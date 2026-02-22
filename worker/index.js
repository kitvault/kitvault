// ─────────────────────────────────────────────────────────────
// KitVault.io — Cloudflare Worker
// Handles three jobs:
//   1. /api/progress   — read/write user build progress to D1
//   2. /api/upload     — accept PDF upload, write to R2, auto-
//                        create kit entry in D1 kits table
//   3. R2 event        — triggered when a PDF is uploaded
//                        directly via the Cloudflare dashboard
//
// Environment bindings required (set in wrangler.toml):
//   DB        — D1 database
//   BUCKET    — R2 bucket
//   ADMIN_KEY — secret string for authenticating admin requests
// ─────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── CORS headers (allow your frontend origin) ──────────
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // ── Route: user progress sync ──────────────────────────
    if (url.pathname === "/api/progress") {
      return handleProgress(request, env, cors);
    }

    // ── Route: admin PDF upload ────────────────────────────
    if (url.pathname === "/api/upload") {
      return handleUpload(request, env, cors);
    }

    // ── Route: admin — list all kits from D1 ──────────────
    if (url.pathname === "/api/kits") {
      return handleKits(request, env, cors);
    }

    return new Response("Not found", { status: 404 });
  },

  // ── R2 event trigger ────────────────────────────────────
  // Fires automatically when a PDF is added to the R2 bucket
  // via the Cloudflare dashboard (not via the upload API).
  async queue(batch, env) {
    for (const msg of batch.messages) {
      const { key } = msg.body;
      if (!key || !key.endsWith(".pdf")) {
        console.log(`[SKIP] Not a PDF: ${key}`);
        msg.ack();
        continue;
      }
      const kit = parseFilename(key);
      if (!kit) {
        console.log(`[SKIP] Could not parse filename: ${key}`);
        msg.ack();
        continue;
      }
      await upsertKit(env.DB, kit);
      console.log(`[OK] Auto-created kit from R2 event: ${kit.name}`);
      msg.ack();
    }
  },
};

// ─────────────────────────────────────────────────────────────
// PROGRESS HANDLER  —  GET/POST /api/progress
// ─────────────────────────────────────────────────────────────
async function handleProgress(request, env, cors) {
  await ensureProgressTable(env.DB);

  if (request.method === "GET") {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return json({ error: "userId required" }, 400, cors);

    const row = await env.DB.prepare(
      "SELECT favourites, progress, pages FROM user_progress WHERE user_id = ?"
    ).bind(userId).first();

    if (!row) return json({ favourites: [], progress: {}, pages: {} }, 200, cors);
    return json({
      favourites: JSON.parse(row.favourites || "[]"),
      progress:   JSON.parse(row.progress   || "{}"),
      pages:      JSON.parse(row.pages      || "{}"),
    }, 200, cors);
  }

  if (request.method === "POST") {
    const body = await request.json();
    const { userId, favourites, progress, pages } = body;
    if (!userId) return json({ error: "userId required" }, 400, cors);

    // Fetch existing row so we only overwrite fields that are present
    const existing = await env.DB.prepare(
      "SELECT favourites, progress, pages FROM user_progress WHERE user_id = ?"
    ).bind(userId).first();

    const merged = {
      favourites: favourites !== undefined ? JSON.stringify(favourites) : (existing?.favourites ?? "[]"),
      progress:   progress   !== undefined ? JSON.stringify(progress)   : (existing?.progress   ?? "{}"),
      pages:      pages      !== undefined ? JSON.stringify(pages)      : (existing?.pages      ?? "{}"),
    };

    await env.DB.prepare(`
      INSERT INTO user_progress (user_id, favourites, progress, pages)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        favourites = excluded.favourites,
        progress   = excluded.progress,
        pages      = excluded.pages
    `).bind(userId, merged.favourites, merged.progress, merged.pages).run();

    return json({ ok: true }, 200, cors);
  }

  return json({ error: "Method not allowed" }, 405, cors);
}

// ─────────────────────────────────────────────────────────────
// UPLOAD HANDLER  —  POST /api/upload
// Expects multipart/form-data with fields:
//   file     — the PDF binary
//   filename — e.g. hg-144-rx78-2-gundam-assembly.pdf
//   key      — optional, same as ADMIN_KEY header
// ─────────────────────────────────────────────────────────────
async function handleUpload(request, env, cors) {
  if (request.method !== "POST") {
    return json({ error: "POST only" }, 405, cors);
  }

  // Auth check
  const adminKey = request.headers.get("X-Admin-Key");
  if (!adminKey || adminKey !== env.ADMIN_KEY) {
    return json({ error: "Unauthorized" }, 401, cors);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ error: "Invalid form data" }, 400, cors);
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return json({ error: "No file provided" }, 400, cors);
  }

  const filename = (formData.get("filename") || file.name || "").trim();
  if (!filename.endsWith(".pdf")) {
    return json({ error: "Only PDF files are accepted" }, 400, cors);
  }

  // Upload to R2
  const buffer = await file.arrayBuffer();
  await env.BUCKET.put(filename, buffer, {
    httpMetadata: { contentType: "application/pdf" },
  });
  console.log(`[UPLOAD] Stored in R2: ${filename}`);

  // Parse filename → kit entry
  const kit = parseFilename(filename);
  if (!kit) {
    console.log(`[SKIP] Could not parse filename: ${filename} — stored in R2 but no kit entry created`);
    return json({
      ok: true,
      uploaded: filename,
      kitCreated: false,
      reason: "Filename did not match expected pattern — PDF is in R2 but no kit entry was created",
    }, 200, cors);
  }

  await ensureKitsTable(env.DB);
  await upsertKit(env.DB, kit);
  console.log(`[OK] Kit auto-created: ${kit.name}`);

  return json({ ok: true, uploaded: filename, kitCreated: true, kit }, 200, cors);
}

// ─────────────────────────────────────────────────────────────
// KITS HANDLER  —  GET /api/kits
// Returns all kits from D1 — used by the frontend to merge
// with the static kits.js list (D1 kits take precedence).
// ─────────────────────────────────────────────────────────────
async function handleKits(request, env, cors) {
  await ensureKitsTable(env.DB);
  const { results } = await env.DB.prepare(
    "SELECT * FROM kits ORDER BY id ASC"
  ).all();

  const kits = results.map(row => ({
    id:       row.id,
    grade:    row.grade,
    scale:    row.scale,
    name:     row.name,
    series:   row.series || "",
    imageUrl: row.image_url || null,
    manuals:  JSON.parse(row.manuals || "[]"),
  }));

  return json(kits, 200, cors);
}

// ─────────────────────────────────────────────────────────────
// FILENAME PARSER
// Converts a PDF filename into a kit object.
//
// Expected format:  {grade}-{scale}-{name}-assembly.pdf
// Examples:
//   hg-144-rx78-2-gundam-assembly.pdf
//   mg-100-master-grade-unicorn-assembly.pdf
//   eg-144-strike-gundam-assembly.pdf
//   sd-unk-zeromaru-assembly.pdf
//
// Returns null if the filename doesn't match.
// ─────────────────────────────────────────────────────────────
function parseFilename(filename) {
  // Strip path prefix and extension
  const base = filename.split("/").pop().replace(/\.pdf$/i, "").toLowerCase();

  // Must end with -assembly (or -manual, -instructions as fallbacks)
  const suffixMatch = base.match(/^(.+?)-(assembly|manual|instructions)$/);
  if (!suffixMatch) return null;

  const body = suffixMatch[1]; // e.g. "hg-144-rx78-2-gundam"
  const parts = body.split("-");
  if (parts.length < 3) return null;

  // First part is always grade
  const gradeRaw = parts[0].toUpperCase();
  const VALID_GRADES = ["HG", "MG", "RG", "PG", "SD", "EG"];
  if (!VALID_GRADES.includes(gradeRaw)) return null;

  // Second part is scale denominator (144, 100, 60, unk, etc.)
  const scalePart = parts[1];
  const scale = scalePart === "unk" || scalePart === "sd"
    ? (gradeRaw === "SD" ? "SD" : "1/144")
    : `1/${scalePart}`;

  // Remaining parts form the kit name
  const nameParts = parts.slice(2);
  const name = toTitleCase(nameParts.join(" "));

  // Generate a stable numeric ID from the filename string
  const id = stableId(base);

  return {
    id,
    grade: gradeRaw,
    scale,
    name,
    series: "",
    imageUrl: null,
    manuals: [{
      id:   stableId(filename),
      name: "Assembly",
      lang: "JP",
      size: "",
      url:  filename,
    }],
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

// Title-case a string: "rx78 2 gundam" → "Rx78 2 Gundam"
function toTitleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

// Deterministic integer ID from a string (simple hash)
// Using a large offset (500000) to avoid colliding with static kit IDs
function stableId(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return 500000 + Math.abs(hash) % 499999;
}

// Upsert a kit row into D1 — if the filename already exists, skip
async function upsertKit(db, kit) {
  const manualsJson = JSON.stringify(kit.manuals);
  // Use the PDF url as a unique key to avoid duplicates
  const url = kit.manuals[0]?.url || "";
  await db.prepare(`
    INSERT INTO kits (id, grade, scale, name, series, image_url, manuals)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(pdf_url) DO NOTHING
  `).bind(kit.id, kit.grade, kit.scale, kit.name, kit.series, kit.imageUrl, manualsJson).run()
    .catch(async () => {
      // Fallback if the table doesn't have pdf_url yet — use a raw insert ignore
      await db.prepare(`
        INSERT OR IGNORE INTO kits (id, grade, scale, name, series, image_url, manuals, pdf_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(kit.id, kit.grade, kit.scale, kit.name, kit.series, kit.imageUrl, manualsJson, url).run();
    });
}

// Create user_progress table if it doesn't exist
async function ensureProgressTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS user_progress (
      user_id    TEXT PRIMARY KEY,
      favourites TEXT DEFAULT '[]',
      progress   TEXT DEFAULT '{}',
      pages      TEXT DEFAULT '{}'
    )
  `).run();
}

// Create kits table if it doesn't exist
async function ensureKitsTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS kits (
      id        INTEGER,
      grade     TEXT,
      scale     TEXT,
      name      TEXT,
      series    TEXT DEFAULT '',
      image_url TEXT,
      manuals   TEXT DEFAULT '[]',
      pdf_url   TEXT UNIQUE,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
}

// JSON response helper
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}
