export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ══════════════════════════════════════════════════════════
    // XP + SPRITE ENDPOINTS
    // ══════════════════════════════════════════════════════════

    // ── GET /api/xp?user_id= — Get user's XP balance + owned sprites ──
    if (path === "/api/xp" && request.method === "GET") {
      try {
        const userId = url.searchParams.get("user_id");
        if (!userId) return new Response(JSON.stringify({ xp: 0, sprites: [], parade: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

        const xpRow = await env.DB.prepare(
          "SELECT xp FROM user_xp WHERE user_id = ?"
        ).bind(userId).first();

        const { results: spriteRows } = await env.DB.prepare(
          "SELECT sprite_id, in_parade FROM user_sprites WHERE user_id = ?"
        ).bind(userId).all();

        const allSprites = (spriteRows || []).map(r => r.sprite_id);
        const paradeSprites = (spriteRows || []).filter(r => r.in_parade !== 0).map(r => r.sprite_id);

        return new Response(JSON.stringify({
          xp: xpRow?.xp || 0,
          sprites: allSprites,
          parade: paradeSprites,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ xp: 0, sprites: [], parade: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── POST /api/xp/award — Internal helper: award XP to a user ──
    // Called internally after comment or gallery post — not exposed directly
    // but also available for future admin use via X-Admin-Key
    async function awardXP(env, userId, amount, reason, refId) {
      const now = Math.floor(Date.now() / 1000);
      // Upsert XP balance
      await env.DB.prepare(`
        INSERT INTO user_xp (user_id, xp, updated_at) VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET xp = xp + ?, updated_at = ?
      `).bind(userId, amount, now, amount, now).run();
      // Log the transaction
      await env.DB.prepare(
        "INSERT INTO xp_log (user_id, amount, reason, ref_id, created_at) VALUES (?, ?, ?, ?, ?)"
      ).bind(userId, amount, reason, refId || null, now).run();
    }

    // ── POST /api/xp/grant — Admin: grant XP to any user ──────
    if (path === "/api/xp/grant" && request.method === "POST") {
      const key = request.headers.get("X-Admin-Key");
      if (key !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      try {
        const { user_id, amount } = await request.json();
        if (!user_id || !amount || isNaN(amount)) {
          return new Response(JSON.stringify({ ok: false, error: "Missing user_id or amount" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        await awardXP(env, user_id, Number(amount), "admin_grant", null);
        const updated = await env.DB.prepare("SELECT xp FROM user_xp WHERE user_id = ?").bind(user_id).first();
        return new Response(JSON.stringify({ ok: true, xp: updated?.xp || 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }


    if (path === "/api/sprites/buy" && request.method === "POST") {
      try {
        const { user_id, sprite_id } = await request.json();

        if (!user_id || !sprite_id) {
          return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Sprite cost table — must match frontend SPRITES array
        const SPRITE_COSTS = {
          rx78:     0,
          wingzero: 150,
          unicorn:  200,
          barbatos: 150,
          exia:     300,
          sazabi:   400,
        };

        if (!(sprite_id in SPRITE_COSTS)) {
          return new Response(JSON.stringify({ ok: false, error: "Unknown sprite" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Check already owned
        const existing = await env.DB.prepare(
          "SELECT id FROM user_sprites WHERE user_id = ? AND sprite_id = ?"
        ).bind(user_id, sprite_id).first();
        if (existing) {
          return new Response(JSON.stringify({ ok: false, error: "Already owned" }), {
            status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const cost = SPRITE_COSTS[sprite_id];

        // Free sprites — no XP check
        if (cost > 0) {
          const xpRow = await env.DB.prepare(
            "SELECT xp FROM user_xp WHERE user_id = ?"
          ).bind(user_id).first();
          const balance = xpRow?.xp || 0;
          if (balance < cost) {
            return new Response(JSON.stringify({ ok: false, error: "Not enough XP", xp: balance }), {
              status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          // Deduct XP
          const now = Math.floor(Date.now() / 1000);
          await env.DB.prepare(
            "UPDATE user_xp SET xp = xp - ?, updated_at = ? WHERE user_id = ?"
          ).bind(cost, now, user_id).run();
        }

        // Grant sprite
        const now = Math.floor(Date.now() / 1000);
        await env.DB.prepare(
          "INSERT INTO user_sprites (user_id, sprite_id, created_at) VALUES (?, ?, ?)"
        ).bind(user_id, sprite_id, now).run();

        // Return updated XP balance
        const updatedXp = await env.DB.prepare(
          "SELECT xp FROM user_xp WHERE user_id = ?"
        ).bind(user_id).first();

        return new Response(JSON.stringify({
          ok: true,
          sprite_id,
          xp: updatedXp?.xp || 0,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── POST /api/sprites/toggle-parade — Show/hide sprite in marquee ──
    if (path === "/api/sprites/toggle-parade" && request.method === "POST") {
      try {
        const { user_id, sprite_id, active } = await request.json();
        if (!user_id || !sprite_id || active === undefined) {
          return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        await env.DB.prepare(
          "UPDATE user_sprites SET in_parade = ? WHERE user_id = ? AND sprite_id = ?"
        ).bind(active ? 1 : 0, user_id, sprite_id).run();

        return new Response(JSON.stringify({ ok: true, sprite_id, active }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── POST /api/sprites/upload — Admin upload sprite PNG to R2 ──
    if (path === "/api/sprites/upload" && request.method === "POST") {
      const key = request.headers.get("X-Admin-Key");
      if (key !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      try {
        const formData = await request.formData();
        const file = formData.get("image");
        const spriteId = formData.get("sprite_id"); // e.g. "rx78"

        const VALID_SPRITES = ["rx78", "wingzero", "unicorn", "barbatos", "exia", "sazabi"];
        if (!VALID_SPRITES.includes(spriteId)) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid sprite_id" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (!file || !file.size) {
          return new Response(JSON.stringify({ ok: false, error: "No file provided" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const buf = await file.arrayBuffer();
        if (buf.byteLength > 2 * 1024 * 1024) {
          return new Response(JSON.stringify({ ok: false, error: "Max 2MB" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const r2Key = `sprites/${spriteId}.png`;
        await env.BUCKET.put(r2Key, buf, {
          httpMetadata: { contentType: "image/png" },
        });

        const url_out = `https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/${r2Key}`;
        return new Response(JSON.stringify({ ok: true, url: url_out, sprite_id: spriteId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── PATCH /api/kit/:id — Update kit fields and/or manual fields ──
    if (request.method === "PATCH" && url.pathname.startsWith("/api/kit/")) {
      const key = request.headers.get("X-Admin-Key");
      if (key !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const kitId = url.pathname.split("/").pop();
      if (!kitId || isNaN(kitId)) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid kit ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const body = await request.json();

      if (body.kit) {
        const { name, grade, scale, series, image_url, amazon_asin } = body.kit;
        await env.DB.prepare(
          `UPDATE kits SET
            name = COALESCE(?, name),
            grade = COALESCE(?, grade),
            scale = COALESCE(?, scale),
            series = COALESCE(?, series),
            image_url = COALESCE(?, image_url),
            amazon_asin = COALESCE(?, amazon_asin)
          WHERE id = ?`
        ).bind(
          name || null,
          grade || null,
          scale || null,
          series ?? null,
          image_url ?? null,
          amazon_asin ?? null,
          Number(kitId)
        ).run();
      }

      if (body.manuals && Array.isArray(body.manuals)) {
        for (const m of body.manuals) {
          if (!m.id) continue;
          await env.DB.prepare(
            `UPDATE manuals SET
              name = COALESCE(?, name),
              lang = COALESCE(?, lang),
              pages = COALESCE(?, pages)
            WHERE id = ?`
          ).bind(
            m.name || null,
            m.lang || null,
            m.pages ?? null,
            Number(m.id)
          ).run();
        }
      }

      return new Response(JSON.stringify({ ok: true, updated: Number(kitId) }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // ── POST /api/kit/:id/image — Upload kit main image ────────
    if (request.method === "POST" && url.pathname.match(/^\/api\/kit\/\d+\/image$/)) {
      const token = request.headers.get("X-Admin-Key") || "";
      if (token !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      try {
        const kitId = url.pathname.split("/")[3];
        const formData = await request.formData();
        const file = formData.get("image");
        if (!file || !file.size) {
          return new Response(JSON.stringify({ ok: false, error: "No image provided" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const ext = file.name?.split(".").pop()?.toLowerCase() || "jpg";
        const r2Key = `kit-images/${kitId}.${ext}`;
        const buf = await file.arrayBuffer();
        if (buf.byteLength > 10 * 1024 * 1024) {
          return new Response(JSON.stringify({ ok: false, error: "Image too large (max 10MB)" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        await env.BUCKET.put(r2Key, buf, {
          httpMetadata: { contentType: file.type || "image/jpeg" },
        });
        const imageUrl = `https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/${r2Key}`;
        await env.DB.prepare("UPDATE kits SET image_url = ? WHERE id = ?").bind(imageUrl, Number(kitId)).run();
        return new Response(JSON.stringify({ ok: true, image_url: imageUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── GET /api/gallery/kit/:kitId — Gallery posts tagged for a kit ──
    if (request.method === "GET" && url.pathname.match(/^\/api\/gallery\/kit\/\d+$/)) {
      try {
        const kitId = url.pathname.split("/").pop();
        const { results } = await env.DB.prepare(`
          SELECT id, user_id, username, avatar_url, image_urls, caption, likes, created_at
          FROM gallery WHERE kit_id = ? ORDER BY likes DESC, created_at DESC LIMIT 20
        `).bind(Number(kitId)).all();
        const posts = (results || []).map(p => ({
          ...p,
          images: p.image_urls ? JSON.parse(p.image_urls) : [],
        }));
        return new Response(JSON.stringify(posts), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify([]), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── DELETE /api/manual/:id — Delete a single manual row ──
    if (request.method === "DELETE" && url.pathname.startsWith("/api/manual/")) {
      const key = request.headers.get("X-Admin-Key");
      if (key !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const manualId = url.pathname.split("/").pop();
      if (!manualId || isNaN(manualId)) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid manual ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      await env.DB.prepare("DELETE FROM manuals WHERE id = ?").bind(Number(manualId)).run();

      return new Response(JSON.stringify({ ok: true, deleted: "manual", id: Number(manualId) }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // ── DELETE /api/kit/:id — Delete kit + all its manuals ──
    if (request.method === "DELETE" && url.pathname.startsWith("/api/kit/")) {
      const key = request.headers.get("X-Admin-Key");
      if (key !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const kitId = url.pathname.split("/").pop();
      if (!kitId || isNaN(kitId)) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid kit ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      await env.DB.prepare("DELETE FROM manuals WHERE kit_id = ?").bind(Number(kitId)).run();
      await env.DB.prepare("DELETE FROM kits WHERE id = ?").bind(Number(kitId)).run();

      return new Response(JSON.stringify({ ok: true, deleted: "kit", id: Number(kitId) }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // ── GET /api/kits ──────────────────────────────────────────────
    if (path === "/api/kits" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(`
          SELECT k.id, k.grade, k.scale, k.name, k.series, k.image_url, k.amazon_asin, k.created_at,
            json_group_array(json_object(
              'id', m.id,
              'kit_id', m.kit_id,
              'name', m.name,
              'url', m.url,
              'lang', m.lang,
              'pages', m.pages,
              'size', m.size
            )) as manuals
          FROM kits k
          LEFT JOIN manuals m ON m.kit_id = k.id
          GROUP BY k.id
          ORDER BY k.created_at DESC
        `).all();

        const kits = results.map(kit => ({
          ...kit,
          manuals: JSON.parse(kit.manuals).filter(m => m.id !== null),
        }));

        return new Response(JSON.stringify(kits), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── POST /api/upload ───────────────────────────────────────────
    if (path === "/api/upload" && request.method === "POST") {
      const token = request.headers.get("X-Admin-Key") || "";
      if (token !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      try {
        const formData = await request.formData();
        const file = formData.get("file");
        const filename = (formData.get("filename") || file?.name || "").toLowerCase();

        if (!file) {
          return new Response(JSON.stringify({ ok: false, error: "No file provided" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const withoutExt = filename.replace(/\.pdf$/, "");
        const withoutSuffix = withoutExt.replace(/-assembly$/, "");
        const parts = withoutSuffix.split("-");

        const VALID_GRADES = ["hg", "mg", "rg", "pg", "sd", "eg", "mgsd"];
        const VALID_SCALES = ["144", "100", "60", "unk"];
        const SCALE_MAP = { "144": "1/144", "100": "1/100", "60": "1/60", "unk": "SD" };

        const rawGrade = parts[0];
        const rawScale = parts[1];

        if (!VALID_GRADES.includes(rawGrade)) {
          return new Response(JSON.stringify({
            ok: false,
            kitCreated: false,
            reason: `Unrecognised grade "${rawGrade}". Valid: ${VALID_GRADES.join(", ")}`,
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        if (!VALID_SCALES.includes(rawScale)) {
          return new Response(JSON.stringify({
            ok: true,
            kitCreated: false,
            reason: `Unrecognised scale "${rawScale}". Valid: ${VALID_SCALES.join(", ")}`,
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        const grade = rawGrade.toUpperCase();
        const scale = SCALE_MAP[rawScale];
        const nameWords = parts.slice(2).map(w => w.charAt(0).toUpperCase() + w.slice(1));
        const name = nameWords.join(" ");

        if (!name) {
          return new Response(JSON.stringify({
            ok: true,
            kitCreated: false,
            reason: "Could not parse kit name from filename",
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        const fileBuffer = await file.arrayBuffer();
        const sizeMB = (fileBuffer.byteLength / 1024 / 1024).toFixed(1) + "MB";
        const r2Key = `${grade}/${scale.replace("/", "")}/${name.replace(/\s+/g, "_")}/${filename}`;

        await env.BUCKET.put(r2Key, fileBuffer, {
          httpMetadata: { contentType: "application/pdf" },
        });

        const pdfUrl = `https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/${r2Key}`;

        const now = Math.floor(Date.now() / 1000);
        const kitResult = await env.DB.prepare(`
          INSERT INTO kits (grade, scale, name, series, image_url, created_at)
          VALUES (?, ?, ?, '', '', ?)
          ON CONFLICT(grade, scale, name) DO UPDATE SET created_at = created_at
          RETURNING id
        `).bind(grade, scale, name, now).first();

        const kitId = kitResult.id;

        await env.DB.prepare(`
          INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at)
          VALUES (?, 'Assembly', ?, 'JP', 0, ?, ?)
        `).bind(kitId, pdfUrl, sizeMB, now).run();

        return new Response(JSON.stringify({
          ok: true,
          kitCreated: true,
          kit: { grade, scale, name },
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── GET /api/comments/:kitId — Fetch comments for a kit ────
    if (request.method === "GET" && url.pathname.match(/^\/api\/comments\/\d+$/)) {
      const kitId = url.pathname.split("/").pop();
      try {
        const { results } = await env.DB.prepare(
          `SELECT id, kit_id, user_id, username, avatar_url, body, parent_id, created_at
           FROM comments WHERE kit_id = ? ORDER BY created_at DESC LIMIT 200`
        ).bind(Number(kitId)).all();

        return new Response(JSON.stringify(results || []), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── POST /api/comments — Add a comment ──────────────────────
    if (path === "/api/comments" && request.method === "POST") {
      try {
        const { kit_id, user_id, username, avatar_url, body: commentBody, parent_id } = await request.json();

        if (!kit_id || !user_id || !commentBody?.trim()) {
          return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (commentBody.trim().length > 1000) {
          return new Response(JSON.stringify({ ok: false, error: "Comment too long (max 1000 chars)" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Rate limit: 10 comments per user per day
        const dayAgo = Math.floor(Date.now() / 1000) - 86400;
        const countResult = await env.DB.prepare(
          "SELECT COUNT(*) as cnt FROM comments WHERE user_id = ? AND created_at > ?"
        ).bind(user_id, dayAgo).first();

        if (countResult && countResult.cnt >= 10) {
          return new Response(JSON.stringify({ ok: false, error: "Daily limit reached (10 comments per day)" }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const now = Math.floor(Date.now() / 1000);
        await env.DB.prepare(
          `INSERT INTO comments (kit_id, user_id, username, avatar_url, body, parent_id, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          Number(kit_id),
          user_id,
          username || "Builder",
          avatar_url || "",
          commentBody.trim(),
          parent_id ? Number(parent_id) : null,
          now
        ).run();

        // Award 10 XP for commenting
        try {
          const insertId = await env.DB.prepare("SELECT last_insert_rowid() as id").first();
          await awardXP(env, user_id, 10, "comment", insertId?.id || null);
        } catch (_) { /* XP award failure is non-fatal */ }

        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── DELETE /api/comments/:id — Delete a comment (owner or admin) ──
    if (request.method === "DELETE" && url.pathname.match(/^\/api\/comments\/\d+$/)) {
      try {
        const commentId = url.pathname.split("/").pop();
        const { user_id, admin_key } = await request.json();

        const isAdmin = admin_key && admin_key === env.ADMIN_KEY;

        // Verify ownership or admin
        if (!isAdmin) {
          const comment = await env.DB.prepare(
            "SELECT user_id FROM comments WHERE id = ?"
          ).bind(Number(commentId)).first();

          if (!comment) {
            return new Response(JSON.stringify({ ok: false, error: "Comment not found" }), {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          if (comment.user_id !== user_id) {
            return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }

        await env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(Number(commentId)).run();

        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ══════════════════════════════════════════════════════════
    // GALLERY ENDPOINTS
    // ══════════════════════════════════════════════════════════

    // ── GET /api/gallery — List all gallery posts ──────────────
    if (path === "/api/gallery" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(`
          SELECT g.*, 
            (SELECT COUNT(*) FROM gallery_comments gc WHERE gc.post_id = g.id) as comment_count
          FROM gallery g ORDER BY g.created_at DESC LIMIT 200
        `).all();

        const posts = (results || []).map(p => ({
          ...p,
          images: p.image_urls ? JSON.parse(p.image_urls) : [],
        }));

        return new Response(JSON.stringify(posts), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── POST /api/gallery — Upload a gallery post ──────────────
    if (path === "/api/gallery" && request.method === "POST") {
      try {
        const formData = await request.formData();
        const kitId = formData.get("kit_id");
        const kitName = formData.get("kit_name");
        const kitGrade = formData.get("kit_grade");
        const kitScale = formData.get("kit_scale") || "";
        const caption = formData.get("caption") || "";
        const userId = formData.get("user_id");
        const username = formData.get("username") || "Builder";
        const avatarUrl = formData.get("avatar_url") || "";
        const imageFiles = formData.getAll("images");

        if (!kitId || !userId || imageFiles.length === 0) {
          return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (imageFiles.length > 3) {
          return new Response(JSON.stringify({ ok: false, error: "Max 3 images per post" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Rate limit: 5 gallery posts per day
        const dayAgo = Math.floor(Date.now() / 1000) - 86400;
        const countResult = await env.DB.prepare(
          "SELECT COUNT(*) as cnt FROM gallery WHERE user_id = ? AND created_at > ?"
        ).bind(userId, dayAgo).first();
        if (countResult && countResult.cnt >= 5) {
          return new Response(JSON.stringify({ ok: false, error: "Daily limit reached (5 posts per day)" }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Upload images to R2
        const imageUrls = [];
        for (const file of imageFiles) {
          if (!file || !file.size) continue;
          const ext = file.name?.split(".").pop()?.toLowerCase() || "jpg";
          const ts = Date.now();
          const rand = Math.random().toString(36).slice(2, 8);
          const r2Key = `gallery/${userId}/${ts}-${rand}.${ext}`;
          const buf = await file.arrayBuffer();

          if (buf.byteLength > 5 * 1024 * 1024) continue; // skip >5MB

          await env.BUCKET.put(r2Key, buf, {
            httpMetadata: { contentType: file.type || "image/jpeg" },
          });
          imageUrls.push(`https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/${r2Key}`);
        }

        if (imageUrls.length === 0) {
          return new Response(JSON.stringify({ ok: false, error: "No valid images uploaded" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const now = Math.floor(Date.now() / 1000);
        await env.DB.prepare(`
          INSERT INTO gallery (user_id, username, avatar_url, kit_id, kit_name, kit_grade, kit_scale, caption, image_urls, likes, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
        `).bind(userId, username, avatarUrl, Number(kitId), kitName, kitGrade, kitScale, caption, JSON.stringify(imageUrls), now).run();

        // Award 50 XP for gallery post
        try {
          const insertId = await env.DB.prepare("SELECT last_insert_rowid() as id").first();
          await awardXP(env, userId, 50, "gallery_post", insertId?.id || null);
        } catch (_) { /* XP award failure is non-fatal */ }

        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── DELETE /api/gallery/:id — Delete a gallery post ────────
    if (request.method === "DELETE" && url.pathname.match(/^\/api\/gallery\/\d+$/)) {
      try {
        const postId = url.pathname.split("/").pop();
        const { user_id, admin_key } = await request.json();
        const isAdmin = admin_key && admin_key === env.ADMIN_KEY;

        if (!isAdmin) {
          const post = await env.DB.prepare("SELECT user_id FROM gallery WHERE id = ?").bind(Number(postId)).first();
          if (!post) return new Response(JSON.stringify({ ok: false, error: "Not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          if (post.user_id !== user_id) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        await env.DB.prepare("DELETE FROM gallery_comments WHERE post_id = ?").bind(Number(postId)).run();
        await env.DB.prepare("DELETE FROM gallery_likes WHERE post_id = ?").bind(Number(postId)).run();
        await env.DB.prepare("DELETE FROM gallery WHERE id = ?").bind(Number(postId)).run();

        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // ── POST /api/gallery/:id/like — Toggle like ───────────────
    if (request.method === "POST" && url.pathname.match(/^\/api\/gallery\/\d+\/like$/)) {
      try {
        const postId = url.pathname.split("/")[3];
        const { user_id } = await request.json();
        if (!user_id) return new Response(JSON.stringify({ ok: false }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

        const existing = await env.DB.prepare(
          "SELECT id FROM gallery_likes WHERE post_id = ? AND user_id = ?"
        ).bind(Number(postId), user_id).first();

        if (existing) {
          await env.DB.prepare("DELETE FROM gallery_likes WHERE id = ?").bind(existing.id).run();
          await env.DB.prepare("UPDATE gallery SET likes = MAX(0, likes - 1) WHERE id = ?").bind(Number(postId)).run();
        } else {
          await env.DB.prepare("INSERT INTO gallery_likes (post_id, user_id) VALUES (?, ?)").bind(Number(postId), user_id).run();
          await env.DB.prepare("UPDATE gallery SET likes = likes + 1 WHERE id = ?").bind(Number(postId)).run();
        }

        return new Response(JSON.stringify({ ok: true, liked: !existing }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // ── GET /api/gallery/likes?user_id= — Get user's liked post IDs ──
    if (path === "/api/gallery/likes" && request.method === "GET") {
      try {
        const userId = url.searchParams.get("user_id");
        if (!userId) return new Response(JSON.stringify([]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const { results } = await env.DB.prepare(
          "SELECT post_id FROM gallery_likes WHERE user_id = ?"
        ).bind(userId).all();
        return new Response(JSON.stringify((results || []).map(r => r.post_id)), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify([]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // ── GET /api/gallery/:id/comments — Get comments for a post ──
    if (request.method === "GET" && url.pathname.match(/^\/api\/gallery\/\d+\/comments$/)) {
      try {
        const postId = url.pathname.split("/")[3];
        const { results } = await env.DB.prepare(
          "SELECT * FROM gallery_comments WHERE post_id = ? ORDER BY created_at ASC LIMIT 100"
        ).bind(Number(postId)).all();
        return new Response(JSON.stringify(results || []), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // ── POST /api/gallery/:id/comments — Add a comment ─────────
    if (request.method === "POST" && url.pathname.match(/^\/api\/gallery\/\d+\/comments$/)) {
      try {
        const postId = url.pathname.split("/")[3];
        const { user_id, username, avatar_url, body: commentBody } = await request.json();

        if (!user_id || !commentBody?.trim()) {
          return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // Rate limit: 20 gallery comments per day
        const dayAgo = Math.floor(Date.now() / 1000) - 86400;
        const cnt = await env.DB.prepare("SELECT COUNT(*) as c FROM gallery_comments WHERE user_id = ? AND created_at > ?").bind(user_id, dayAgo).first();
        if (cnt && cnt.c >= 20) {
          return new Response(JSON.stringify({ ok: false, error: "Daily comment limit reached" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        const now = Math.floor(Date.now() / 1000);
        await env.DB.prepare(
          "INSERT INTO gallery_comments (post_id, user_id, username, avatar_url, body, created_at) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(Number(postId), user_id, username || "Builder", avatar_url || "", commentBody.trim(), now).run();

        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // ── DELETE /api/gallery/comments/:id — Delete a gallery comment ──
    if (request.method === "DELETE" && url.pathname.match(/^\/api\/gallery\/comments\/\d+$/)) {
      try {
        const commentId = url.pathname.split("/").pop();
        const { user_id, admin_key } = await request.json();
        const isAdmin = admin_key && admin_key === env.ADMIN_KEY;

        if (!isAdmin) {
          const comment = await env.DB.prepare("SELECT user_id FROM gallery_comments WHERE id = ?").bind(Number(commentId)).first();
          if (!comment) return new Response(JSON.stringify({ ok: false, error: "Not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          if (comment.user_id !== user_id) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        await env.DB.prepare("DELETE FROM gallery_comments WHERE id = ?").bind(Number(commentId)).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
};
