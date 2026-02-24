// ─────────────────────────────────────────────────────────────
// WORKER CODE — Add these two handlers to your kitvault-api worker
//
// These go inside your fetch handler's routing logic,
// alongside your existing GET /api/kits and POST /api/upload.
//
// Auth: Uses the same X-Admin-Key header as /api/upload.
// ─────────────────────────────────────────────────────────────

// DELETE /api/manual/:id — Delete a single manual row from D1
// (does NOT delete the PDF from R2)
if (request.method === "DELETE" && url.pathname.startsWith("/api/manual/")) {
  // Auth check
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

// DELETE /api/kit/:id — Delete a kit AND all its manuals from D1
// (does NOT delete PDFs from R2)
if (request.method === "DELETE" && url.pathname.startsWith("/api/kit/")) {
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

  // Delete manuals first (foreign key), then the kit
  await env.DB.prepare("DELETE FROM manuals WHERE kit_id = ?").bind(Number(kitId)).run();
  await env.DB.prepare("DELETE FROM kits WHERE id = ?").bind(Number(kitId)).run();

  return new Response(JSON.stringify({ ok: true, deleted: "kit", id: Number(kitId) }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// ─────────────────────────────────────────────────────────────
// IMPORTANT: Also add DELETE to your CORS preflight handler!
// In your OPTIONS handler, make sure the allowed methods include DELETE:
//
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
// };
//
// if (request.method === "OPTIONS") {
//   return new Response(null, { headers: corsHeaders });
// }
// ─────────────────────────────────────────────────────────────
