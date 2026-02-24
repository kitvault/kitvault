// ─────────────────────────────────────────────────────────────
// WORKER CODE — Add this PATCH handler to your kitvault-api worker
//
// Goes alongside your existing routes and the DELETE handlers.
// Auth: Uses the same X-Admin-Key header as /api/upload.
// ─────────────────────────────────────────────────────────────

// PATCH /api/kit/:id — Update kit fields and/or manual fields
if (request.method === "PATCH" && url.pathname.startsWith("/api/kit/")) {
  // Auth check
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

  // Update kit fields if provided
  if (body.kit) {
    const { name, grade, scale, series, image_url } = body.kit;
    await env.DB.prepare(
      `UPDATE kits SET
        name = COALESCE(?, name),
        grade = COALESCE(?, grade),
        scale = COALESCE(?, scale),
        series = COALESCE(?, series),
        image_url = COALESCE(?, image_url)
      WHERE id = ?`
    ).bind(
      name || null,
      grade || null,
      scale || null,
      series ?? null,
      image_url ?? null,
      Number(kitId)
    ).run();
  }

  // Update manual fields if provided
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

// ─────────────────────────────────────────────────────────────
// IMPORTANT: Also add PATCH to your CORS preflight handler!
//
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
// };
// ─────────────────────────────────────────────────────────────
