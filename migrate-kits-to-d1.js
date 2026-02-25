// ─────────────────────────────────────────────────────────────
// migrate-kits-to-d1.js
// Reads kits.js and generates SQL to insert all static kits
// into D1. Run from your kitvault project root:
//
//   node migrate-kits-to-d1.js
//
// This outputs a file: migration.sql
// Then run it against your D1 database:
//
//   npx wrangler d1 execute kitvault-db --file=migration.sql --remote
//
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const R2_BASE = "https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev";

// ── Read and parse kits.js ───────────────────────────────────
const raw = readFileSync(join(__dirname, "src/data/kits.js"), "utf-8");

// Extract kit objects using regex
// Matches: { id:N, grade:"X", scale:"X", name:"X", series:"X", imageUrl:X,
const kitBlocks = [];
const kitRegex = /\{\s*id:\s*(\d+)\s*,\s*grade:\s*"([^"]+)"\s*,\s*scale:\s*"([^"]+)"\s*,\s*name:\s*"((?:[^"\\]|\\.)*)"\s*,\s*series:\s*"((?:[^"\\]|\\.)*)"\s*,\s*imageUrl:\s*(null|"[^"]*")\s*,\s*\n?\s*manuals:\s*\[([\s\S]*?)\]\s*\}/g;

let match;
while ((match = kitRegex.exec(raw)) !== null) {
  const manualStr = match[7];
  const manuals = [];

  const manualRegex = /\{\s*id:\s*(\d+)\s*,\s*name:\s*"((?:[^"\\]|\\.)*)"\s*,\s*lang:\s*"([^"]*)"\s*,\s*size:\s*"([^"]*)"\s*,\s*url:\s*"([^"]*)"\s*\}/g;
  let mm;
  while ((mm = manualRegex.exec(manualStr)) !== null) {
    manuals.push({
      id: parseInt(mm[1]),
      name: mm[2],
      lang: mm[3],
      size: mm[4],
      url: mm[5],
    });
  }

  kitBlocks.push({
    id: parseInt(match[1]),
    grade: match[2],
    scale: match[3],
    name: match[4].replace(/\\'/g, "'"),
    series: match[5].replace(/\\'/g, "'"),
    imageUrl: match[6] === "null" ? "" : match[6].replace(/^"|"$/g, ""),
    manuals,
  });
}

console.log(`Parsed ${kitBlocks.length} kits from kits.js`);

if (kitBlocks.length === 0) {
  console.error("ERROR: No kits parsed. Check the regex or kits.js format.");
  process.exit(1);
}

// ── Escape SQL strings ───────────────────────────────────────
function esc(str) {
  return (str || "").replace(/'/g, "''");
}

// ── Generate SQL ─────────────────────────────────────────────
const lines = [];
const now = Math.floor(Date.now() / 1000);

// Clear existing data first (optional — comment out if you want to keep D1 kits)
// lines.push("-- WARNING: This deletes ALL existing kits and manuals in D1");
// lines.push("DELETE FROM manuals;");
// lines.push("DELETE FROM kits;");
// lines.push("");

lines.push("-- ═══════════════════════════════════════════════════════");
lines.push("-- KitVault Static Kits → D1 Migration");
lines.push(`-- Generated: ${new Date().toISOString()}`);
lines.push(`-- Total kits: ${kitBlocks.length}`);
lines.push("-- ═══════════════════════════════════════════════════════");
lines.push("");

for (const kit of kitBlocks) {
  // Use ON CONFLICT to skip duplicates (in case some were already uploaded)
  lines.push(
    `INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('${esc(kit.grade)}', '${esc(kit.scale)}', '${esc(kit.name)}', '${esc(kit.series)}', '${esc(kit.imageUrl)}', ${now}) ON CONFLICT(grade, scale, name) DO NOTHING;`
  );

  for (const m of kit.manuals) {
    // Build the full R2 URL
    const fullUrl = m.url.startsWith("http") ? m.url : `${R2_BASE}/${m.url}`;

    // We need the kit ID from the insert above, so we use a subquery
    lines.push(
      `INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, '${esc(m.name)}', '${esc(fullUrl)}', '${esc(m.lang)}', 0, '${esc(m.size)}', ${now} FROM kits WHERE grade='${esc(kit.grade)}' AND scale='${esc(kit.scale)}' AND name='${esc(kit.name)}' LIMIT 1;`
    );
  }
  lines.push("");
}

// ── Write SQL file ───────────────────────────────────────────
const outPath = join(__dirname, "migration.sql");
writeFileSync(outPath, lines.join("\n"));
console.log(`\nSQL written to: migration.sql`);
console.log(`\nNext steps:`);
console.log(`  1. Review migration.sql (optional)`);
console.log(`  2. Run:  npx wrangler d1 execute kitvault-db --file=migration.sql --remote`);
console.log(`  3. Verify at: https://kitvault.io/api/kits`);
console.log(`  4. Once confirmed, remove KITS import from App.jsx and set allKits = d1Kits`);
