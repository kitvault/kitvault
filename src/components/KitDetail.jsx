// ─────────────────────────────────────────────────────────────
// KitDetail.jsx
// Full kit detail page including manual viewer, build status,
// XP progress bar, Amazon affiliate banner, and admin edit panel.
//
// Admin edit: If admin key is in sessionStorage (kv_admin_key),
// a pencil button appears. Clicking it opens an inline editor
// for kit fields + manual fields. Saves via PATCH /api/kit/:id.
// Only works for D1 kits (kits with numeric ids from the DB).
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AMAZON_URLS, GRADE_COLORS, GRADES, loadPdfJs, resolveManualUrl } from "../data/grades.js";
import { slugify, xpColors } from "../data/grades.js";
import PdfFullscreenModal from "./PdfFullscreenModal.jsx";

const gc = (g) => GRADE_COLORS[g] || GRADE_COLORS["HG"];
const ADMIN_KEY_STORAGE = "kv_admin_key";
const GRADE_OPTIONS = GRADES.filter(g => g !== "ALL");

// ─────────────────────────────────────────────────────────────
// PdfPage — renders one page of a loaded PDF onto a canvas
// ─────────────────────────────────────────────────────────────
function PdfPage({ pdf, pageNum, width }) {
  const canvasRef = useRef(null);
  const taskRef   = useRef(null);

  useEffect(() => {
    if (!pdf || !width || !canvasRef.current) return;
    let alive = true;

    (async () => {
      try {
        if (taskRef.current) { taskRef.current.cancel(); taskRef.current = null; }
        const page   = await pdf.getPage(pageNum);
        if (!alive) return;
        const baseVp = page.getViewport({ scale: 1 });
        const vp     = page.getViewport({ scale: width / baseVp.width });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr    = window.devicePixelRatio || 1;
        canvas.width  = Math.floor(vp.width  * dpr);
        canvas.height = Math.floor(vp.height * dpr);
        canvas.style.width  = `${vp.width}px`;
        canvas.style.height = `${vp.height}px`;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        taskRef.current = page.render({ canvasContext: ctx, viewport: vp });
        await taskRef.current.promise;
      } catch (e) {
        if (e?.name !== "RenderingCancelledException") console.warn("PDF render:", e);
      }
    })();

    return () => {
      alive = false;
      if (taskRef.current) { taskRef.current.cancel(); taskRef.current = null; }
    };
  }, [pdf, pageNum, width]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", background: "#fff", marginBottom: "4px", maxWidth: "100%" }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// PdfViewer — loads a PDF and renders all pages as canvases
// ─────────────────────────────────────────────────────────────
function PdfViewer({ url, onPageCount }) {
  const [pdf,      setPdf]      = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status,   setStatus]   = useState("loading");
  const [errMsg,   setErrMsg]   = useState("");
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!wrapRef.current) return;
    const measure = () => setWidth(wrapRef.current?.clientWidth || 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!url) return;
    let dead = false;
    setStatus("loading");
    setProgress(0);
    setPdf(null);
    setNumPages(0);

    (async () => {
      try {
        const lib  = await loadPdfJs();
        const task = lib.getDocument({ url, withCredentials: false });
        task.onProgress = ({ loaded, total }) => {
          if (total) setProgress(Math.round((loaded / total) * 100));
        };
        const doc = await task.promise;
        if (dead) return;
        setPdf(doc);
        setNumPages(doc.numPages);
        setStatus("ready");
        onPageCount?.(doc.numPages);
      } catch (e) {
        if (dead) return;
        setErrMsg(e?.message || "Failed to load PDF");
        setStatus("error");
        console.error("PdfViewer load error:", e);
      }
    })();

    return () => { dead = true; };
  }, [url]);

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%", background: "#111", overflowY: "auto", overflowX: "hidden",
        WebkitOverflowScrolling: "touch", maxHeight: "75vh", boxSizing: "border-box", padding: "8px",
      }}
    >
      {status === "loading" && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "220px", gap: "14px",
          fontFamily: "'Share Tech Mono',monospace", color: "var(--text-dim,#888)",
        }}>
          <style>{`@keyframes kvspin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ fontSize: "2rem", animation: "kvspin 1.2s linear infinite", color: "var(--accent,#00aaff)" }}>◈</div>
          <div style={{ fontSize: "0.7rem", letterSpacing: "2px" }}>
            {progress > 0 ? `LOADING — ${progress}%` : "LOADING MANUAL..."}
          </div>
        </div>
      )}
      {status === "error" && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "180px", gap: "14px",
          fontFamily: "'Share Tech Mono',monospace", color: "var(--text-dim,#888)",
          textAlign: "center", padding: "24px",
        }}>
          <div style={{ fontSize: "2rem" }}>⚠</div>
          <div style={{ fontSize: "0.72rem", letterSpacing: "2px" }}>FAILED TO LOAD MANUAL</div>
          <div style={{ fontSize: "0.6rem", color: "#555", maxWidth: "280px" }}>{errMsg}</div>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{
              color: "var(--accent,#00aaff)", fontSize: "0.7rem", letterSpacing: "1px",
              border: "1px solid var(--accent,#00aaff)", padding: "8px 20px",
              textDecoration: "none", background: "rgba(0,170,255,0.08)",
            }}
          >↗ OPEN PDF IN BROWSER</a>
        </div>
      )}
      {status === "ready" && pdf && width > 0 &&
        Array.from({ length: numPages }, (_, i) => (
          <PdfPage key={i + 1} pdf={pdf} pageNum={i + 1} width={width} />
        ))
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Admin Edit Panel — inline styles
// ─────────────────────────────────────────────────────────────
const E = {
  wrap: { border:"1px solid rgba(0,170,255,0.3)", background:"rgba(0,170,255,0.04)", padding:20, marginBottom:24 },
  title: { fontSize:"0.65rem", letterSpacing:"3px", color:"#00aaff", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between" },
  row: { display:"flex", gap:10, marginBottom:10, alignItems:"center", flexWrap:"wrap" },
  label: { fontSize:"0.6rem", color:"#5a7a9f", letterSpacing:"1px", minWidth:70, flexShrink:0 },
  input: { flex:1, minWidth:140, padding:"8px 12px", background:"#080c12", border:"1px solid #1a2f50", color:"#c8ddf5", fontFamily:"'Share Tech Mono',monospace", fontSize:"0.7rem", letterSpacing:"1px", outline:"none", boxSizing:"border-box" },
  select: { padding:"8px 12px", background:"#080c12", border:"1px solid #1a2f50", color:"#c8ddf5", fontFamily:"'Share Tech Mono',monospace", fontSize:"0.7rem", letterSpacing:"1px", outline:"none" },
  btnSave: { padding:"10px 24px", background:"rgba(0,255,136,0.1)", border:"1px solid rgba(0,255,136,0.4)", color:"#00ff88", fontFamily:"'Share Tech Mono',monospace", fontSize:"0.65rem", letterSpacing:"2px", cursor:"pointer" },
  btnCancel: { padding:"10px 24px", background:"rgba(90,122,159,0.1)", border:"1px solid #1a2f50", color:"#5a7a9f", fontFamily:"'Share Tech Mono',monospace", fontSize:"0.65rem", letterSpacing:"2px", cursor:"pointer" },
  btnEdit: { background:"rgba(0,170,255,0.08)", border:"1px solid rgba(0,170,255,0.3)", color:"#00aaff", fontFamily:"'Share Tech Mono',monospace", fontSize:"0.6rem", padding:"6px 14px", cursor:"pointer", letterSpacing:"1px" },
  manualHeader: { fontSize:"0.6rem", color:"#5a7a9f", letterSpacing:"2px", margin:"16px 0 8px", borderTop:"1px solid #1a2f50", paddingTop:12 },
  status: { fontSize:"0.6rem", letterSpacing:"1px", padding:"8px 12px", marginTop:10 },
};

function AdminEditPanel({ kit, onSaved, onCancel }) {
  const adminKey = sessionStorage.getItem(ADMIN_KEY_STORAGE) || "";
  const [form, setForm] = useState({
    name: kit.name,
    grade: kit.grade,
    scale: kit.scale,
    series: kit.series || "",
    image_url: kit.imageUrl || kit.image_url || "",
  });
  const [manualForms, setManualForms] = useState(
    kit.manuals.map(m => ({ id: m.id, name: m.name, lang: m.lang || "JP", pages: m.pages || 0 }))
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateManual = (idx, field, value) => setManualForms(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/kit/${kit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Admin-Key": adminKey },
        body: JSON.stringify({ kit: form, manuals: manualForms }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus({ ok: true, message: "Saved" });
        onSaved?.();
      } else {
        setStatus({ ok: false, message: data.error || "Save failed" });
      }
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    }
    setSaving(false);
  };

  return (
    <div style={E.wrap}>
      <div style={E.title}>
        <span>◈ EDIT KIT #{kit.id}</span>
        <button style={E.btnCancel} onClick={onCancel}>✕ CLOSE</button>
      </div>

      <div style={E.row}>
        <span style={E.label}>NAME</span>
        <input style={E.input} value={form.name} onChange={e => updateField("name", e.target.value)} />
      </div>
      <div style={E.row}>
        <span style={E.label}>GRADE</span>
        <select style={E.select} value={form.grade} onChange={e => updateField("grade", e.target.value)}>
          {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <span style={E.label}>SCALE</span>
        <input style={{...E.input, maxWidth:120}} value={form.scale} onChange={e => updateField("scale", e.target.value)} placeholder="1/144" />
      </div>
      <div style={E.row}>
        <span style={E.label}>SERIES</span>
        <input style={E.input} value={form.series} onChange={e => updateField("series", e.target.value)} placeholder="e.g. Mobile Suit Gundam SEED" />
      </div>
      <div style={E.row}>
        <span style={E.label}>IMAGE URL</span>
        <input style={E.input} value={form.image_url} onChange={e => updateField("image_url", e.target.value)} placeholder="https://..." />
      </div>

      {manualForms.map((m, idx) => (
        <div key={m.id}>
          <div style={E.manualHeader}>MANUAL #{m.id}</div>
          <div style={E.row}>
            <span style={E.label}>NAME</span>
            <input style={E.input} value={m.name} onChange={e => updateManual(idx, "name", e.target.value)} />
            <span style={E.label}>LANG</span>
            <input style={{...E.input, maxWidth:60}} value={m.lang} onChange={e => updateManual(idx, "lang", e.target.value)} />
            <span style={E.label}>PAGES</span>
            <input style={{...E.input, maxWidth:70}} type="number" value={m.pages} onChange={e => updateManual(idx, "pages", parseInt(e.target.value)||0)} />
          </div>
        </div>
      ))}

      <div style={{display:"flex",gap:10,marginTop:16}}>
        <button style={E.btnSave} onClick={handleSave} disabled={saving}>{saving ? "SAVING..." : "SAVE CHANGES →"}</button>
        <button style={E.btnCancel} onClick={onCancel}>CANCEL</button>
      </div>
      {status && (
        <div style={{...E.status, color: status.ok ? "#00ff88" : "#ff2244", border: `1px solid ${status.ok ? "rgba(0,255,136,0.3)" : "rgba(255,34,68,0.3)"}`, background: status.ok ? "rgba(0,255,136,0.05)" : "rgba(255,34,68,0.05)"}}>
          {status.ok ? "✓" : "✕"} {status.message}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CommentSection — kit-level comment thread
// ─────────────────────────────────────────────────────────────
const C = {
  wrap: { marginTop: 40, border: "1px solid var(--border, #1a2f50)", background: "var(--panel, #0a1220)", padding: "24px" },
  title: { fontSize: "0.65rem", letterSpacing: "3px", color: "var(--accent, #00aaff)", marginBottom: 20 },
  empty: { fontSize: "0.65rem", color: "var(--text-dim, #5a7a9f)", textAlign: "center", padding: "24px 0", letterSpacing: "1px", opacity: 0.6 },
  inputWrap: { display: "flex", gap: 10, marginBottom: 20, alignItems: "flex-start" },
  avatar: { width: 32, height: 32, borderRadius: "50%", flexShrink: 0, border: "1px solid rgba(0,170,255,0.2)" },
  avatarPlaceholder: { width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "var(--accent, #00aaff)" },
  textarea: { flex: 1, background: "#080c12", border: "1px solid #1a2f50", color: "#c8ddf5", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", padding: "10px 12px", outline: "none", resize: "vertical", minHeight: 60, letterSpacing: "0.5px", lineHeight: 1.6, boxSizing: "border-box" },
  postBtn: { padding: "10px 20px", background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)", color: "#00aaff", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "2px", cursor: "pointer", flexShrink: 0, alignSelf: "flex-end" },
  postBtnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  comment: { display: "flex", gap: 10, padding: "14px 0", borderTop: "1px solid rgba(26,47,80,0.5)" },
  commentBody: { flex: 1, minWidth: 0 },
  commentHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" },
  commentUser: { fontSize: "0.7rem", color: "#c8ddf5", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: "0.5px" },
  commentTime: { fontSize: "0.55rem", color: "var(--text-dim, #5a7a9f)", letterSpacing: "0.5px" },
  commentText: { fontSize: "0.68rem", color: "#9ab0cc", fontFamily: "'Share Tech Mono', monospace", lineHeight: 1.7, letterSpacing: "0.3px", wordBreak: "break-word" },
  deleteBtn: { background: "none", border: "none", color: "rgba(255,34,68,0.4)", cursor: "pointer", fontSize: "0.6rem", padding: "0 4px", marginLeft: "auto", flexShrink: 0 },
  signInNote: { fontSize: "0.6rem", color: "var(--text-dim, #5a7a9f)", letterSpacing: "1px", textAlign: "center", padding: "16px 0", opacity: 0.7 },
  error: { fontSize: "0.6rem", color: "#ff2244", letterSpacing: "0.5px", marginBottom: 8 },
  loading: { fontSize: "0.6rem", color: "var(--text-dim, #5a7a9f)", textAlign: "center", padding: "16px 0", letterSpacing: "2px" },
};

function timeAgo(ts) {
  const now = Date.now() / 1000;
  const diff = now - ts;
  if (diff < 60) return "JUST NOW";
  if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}D AGO`;
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
}

function CommentSection({ kitId, isSignedIn, user }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const isAdmin = !!sessionStorage.getItem(ADMIN_KEY_STORAGE);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments/${kitId}`);
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
    } catch (_) {}
    setLoading(false);
  }, [kitId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const postComment = async () => {
    if (!body.trim() || posting || !user) return;
    setPosting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kit_id: kitId,
          user_id: user.id,
          username: user.fullName || user.firstName || user.username || "Builder",
          avatar_url: user.imageUrl || "",
          body: body.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setBody("");
        fetchComments();
      } else {
        setError(data.error || "Failed to post");
      }
    } catch (err) {
      setError(err.message);
    }
    setPosting(false);
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          admin_key: isAdmin ? sessionStorage.getItem(ADMIN_KEY_STORAGE) : undefined,
        }),
      });
      if (res.ok) fetchComments();
    } catch (_) {}
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) postComment();
  };

  return (
    <div style={C.wrap}>
      <div style={C.title}>◈ COMMENTS ({comments.length})</div>

      {/* Post input */}
      {isSignedIn && user ? (
        <div>
          <div style={C.inputWrap}>
            {user.imageUrl ? (
              <img src={user.imageUrl} alt="" style={C.avatar} />
            ) : (
              <div style={C.avatarPlaceholder}>◈</div>
            )}
            <textarea
              style={C.textarea}
              placeholder="Share your thoughts on this kit..."
              value={body}
              onChange={e => setBody(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={1000}
            />
            <button
              style={{...C.postBtn, ...((!body.trim() || posting) ? C.postBtnDisabled : {})}}
              onClick={postComment}
              disabled={!body.trim() || posting}
            >
              {posting ? "..." : "POST →"}
            </button>
          </div>
          {error && <div style={C.error}>✕ {error}</div>}
        </div>
      ) : (
        <div style={C.signInNote}>SIGN IN TO LEAVE A COMMENT</div>
      )}

      {/* Comment list */}
      {loading ? (
        <div style={C.loading}>LOADING COMMENTS...</div>
      ) : comments.length === 0 ? (
        <div style={C.empty}>NO COMMENTS YET — BE THE FIRST</div>
      ) : (
        comments.map(c => (
          <div key={c.id} style={C.comment}>
            {c.avatar_url ? (
              <img src={c.avatar_url} alt="" style={C.avatar} />
            ) : (
              <div style={C.avatarPlaceholder}>◈</div>
            )}
            <div style={C.commentBody}>
              <div style={C.commentHeader}>
                <span style={C.commentUser}>{c.username}</span>
                <span style={C.commentTime}>{timeAgo(c.created_at)}</span>
                {(user?.id === c.user_id || isAdmin) && (
                  <button style={C.deleteBtn} onClick={() => deleteComment(c.id)} title="Delete comment">🗑</button>
                )}
              </div>
              <div style={C.commentText}>{c.body}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KitDetail — main export
// ─────────────────────────────────────────────────────────────
export default function KitDetail({
  allKits,
  isSignedIn,
  user,
  favourites,
  buildProgress,
  pageProgress,
  toggleFavourite,
  setBuildStatus,
  setManualPage,
  openManualId,
  toggleManual,
  setOpenManualId,
  goHome,
  onKitUpdated,
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const kit = allKits.find(k => slugify(k) === slug);

  const [realPages,        setRealPages]        = useState({});
  const [fullscreenManual, setFullscreenManual] = useState(null);
  const [dlNotifyId,       setDlNotifyId]       = useState(null);
  const [editing,          setEditing]           = useState(false);

  // Check if admin key exists in session
  const isAdmin = !!sessionStorage.getItem(ADMIN_KEY_STORAGE);

  // Fetch real page count via PDF.js and cache in localStorage
  const fetchRealPages = async (manual) => {
    if (!manual.url || realPages[manual.id] !== undefined) return;
    const cacheKey = `kv_pdfpages_${manual.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setRealPages(prev => ({ ...prev, [manual.id]: parseInt(cached) }));
      return;
    }
    try {
      const lib = await loadPdfJs();
      const doc = await lib.getDocument(resolveManualUrl(manual.url)).promise;
      const count = doc.numPages;
      localStorage.setItem(cacheKey, String(count));
      setRealPages(prev => ({ ...prev, [manual.id]: count }));
    } catch (_) { /* silently ignore — falls back to manual.pages */ }
  };

  useEffect(() => {
    kit?.manuals.forEach(m => { if (m.url) fetchRealPages(m); });
  }, [kit?.id]);

  if (!kit) return (
    <div style={{padding:"80px 40px",textAlign:"center",fontFamily:"'Share Tech Mono',monospace",color:"var(--text-dim)"}}>
      <div style={{fontSize:"3rem",marginBottom:"16px",opacity:0.3}}>404</div>
      <div style={{letterSpacing:"2px",marginBottom:"24px"}}>KIT NOT FOUND</div>
      <button className="back-btn" style={{margin:"0 auto"}} onClick={goHome}>← BACK TO LIBRARY</button>
    </div>
  );

  const isFav = favourites.includes(kit.id);
  // D1 kits have numeric IDs; static kits could too but only D1 kits are editable via API
  const isD1Kit = typeof kit.id === "number";

  return (
    <>
      <button className="back-btn" onClick={() => navigate(-1)}>← BACK TO LIBRARY</button>

      <div className="kit-detail-header">
        <div className="detail-grade" style={{color:gc(kit.grade).accent}}>
          {kit.grade} GRADE — {kit.scale}
          {isAdmin && isD1Kit && !editing && (
            <button style={{...E.btnEdit, marginLeft:12}} onClick={() => setEditing(true)}>✎ EDIT</button>
          )}
        </div>
        <div className="detail-title">
          {kit.name}
          {isSignedIn && (
            <button className="fav-btn" style={{marginLeft:"12px",fontSize:"1.4rem"}} onClick={e => toggleFavourite(e, kit.id)}>
              {isFav ? "⭐" : "☆"}
            </button>
          )}
        </div>
        <div className="detail-meta">
          <span>◈ {kit.series}</span>
          <span>◈ {kit.manuals.length} MANUAL{kit.manuals.length!==1?"S":""} AVAILABLE</span>
        </div>
      </div>

      {/* ── ADMIN EDIT PANEL ─────────────────────────────────── */}
      {editing && isAdmin && isD1Kit && (
        <AdminEditPanel
          kit={kit}
          onSaved={() => {
            setEditing(false);
            onKitUpdated?.();
          }}
          onCancel={() => setEditing(false)}
        />
      )}

      {isSignedIn && (
        <div className="build-status-wrap">
          <span className="build-status-label">◈ BUILD STATUS</span>
          <div className="build-status-options">
            <button
              className={`build-status-fav${isFav?" on":""}`}
              onClick={e => toggleFavourite(e, kit.id)}
              title={isFav ? "Remove from My Vault" : "Add to My Vault"}
            >
              {isFav ? "⭐" : "☆"}
            </button>
            <div style={{width:"1px",height:"20px",background:"var(--border)",flexShrink:0}} />
            {[
              {id:"backlog", label:"◻ BACKLOG"},
              {id:"inprogress", label:"⚙ IN PROGRESS"},
              {id:"complete",   label:"✓ COMPLETE"},
            ].map(s => (
              <button
                key={s.id}
                className={`build-status-btn${buildProgress[kit.id]===s.id ? ` active-${s.id}` : ""}`}
                onClick={() => setBuildStatus(kit.id, s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{height:"16px"}} />
      {isSignedIn && kit.manuals.some(m => m.url) && (() => {
        const manualRows = kit.manuals.filter(m => m.url).map(m => {
          const key = `${kit.id}-${m.id}`;
          const total = realPages[m.id];
          const current = Math.min(pageProgress[key]?.current || 0, total || 0);
          return { m, key, total, current };
        });
        const hasAnyTotal = manualRows.some(r => r.total > 0);
        const overallTotal = manualRows.reduce((s, r) => s + (r.total || 0), 0);
        const overallCurrent = manualRows.reduce((s, r) => s + r.current, 0);
        const overallPct = overallTotal > 0 ? Math.round((overallCurrent / overallTotal) * 100) : 0;
        const colors = xpColors(overallPct);
        const SEGMENTS = 10;

        return (
          <div className="xp-bar-full" style={colors}>
            <div className="xp-header">
              <span className="xp-label">◈ BUILD PROGRESS</span>
              <span className="xp-pct">{hasAnyTotal ? `${overallPct}%` : "—"}</span>
            </div>
            <div className="xp-track">
              <div className="xp-track-segments">
                {Array.from({length: SEGMENTS}).map((_,i) => <div key={i} className="xp-segment" />)}
              </div>
              <div className="xp-fill" style={{width: hasAnyTotal ? `${overallPct}%` : "0%"}} />
            </div>
            <div className="xp-multi-wrap">
              {manualRows.map(({ m, key, total, current }) => {
                const pct = total > 0 ? Math.round((current / total) * 100) : 0;
                const isLoading = total === undefined;
                return (
                  <div key={m.id}>
                    <div className="xp-manual-name">{m.name}</div>
                    <div className="xp-input-row">
                      <span className="xp-input-label">CURRENT PAGE</span>
                      <div className="xp-stepper">
                        <button className="xp-step-btn minus" onClick={() => {
                          const next = Math.max(0, current - 1);
                          setManualPage(kit.id, m.id, next, total || next);
                        }}>−</button>
                        <input
                          className="xp-input"
                          type="number"
                          min="0"
                          max={total || 9999}
                          value={current || ""}
                          placeholder="0"
                          onChange={e => {
                            const val     = Math.max(0, parseInt(e.target.value) || 0);
                            const clamped = total ? Math.min(val, total) : val;
                            setManualPage(kit.id, m.id, clamped, total || clamped);
                          }}
                        />
                        <button className="xp-step-btn plus" onClick={() => {
                          const next = total ? Math.min(current + 1, total) : current + 1;
                          setManualPage(kit.id, m.id, next, total || next);
                        }}>+</button>
                      </div>
                      <span className="xp-total">
                        / {isLoading ? <span style={{opacity:0.4}}>loading...</span> : `${total} PGS`}
                      </span>
                      {total > 0 && (
                        <span style={{marginLeft:"auto",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color: pct===100?"var(--green)":pct>0?"var(--gold)":"var(--text-dim)"}}>
                          {pct}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── MANUAL LIST ─────────────────────────────────────── */}
      <div className="manual-list">
        <div className="section-header" style={{padding:"0 0 20px"}}>
          <span className="section-title">AVAILABLE MANUALS</span>
          <div className="section-line" />
        </div>

        {kit.manuals.map(manual => (
          <div key={manual.id} className="manual-item" onClick={() => { toggleManual(manual.id); fetchRealPages(manual); }}>
            <div className="manual-item-row">
              <div className="manual-item-left">
                <div className="manual-icon">PDF</div>
                <div>
                  <div className="manual-name">{manual.name}</div>
                  <div className="manual-meta">
                    <span>LANG: {manual.lang}</span>
                    <span>{realPages[manual.id] !== undefined ? realPages[manual.id] : manual.pages} PGS</span>
                    <span>{manual.size}</span>
                  </div>
                </div>
              </div>
              <div className="manual-actions">
                <button
                  className={`btn btn-view${openManualId === manual.id ? " active" : ""}`}
                  onClick={e => { e.stopPropagation(); toggleManual(manual.id); fetchRealPages(manual); }}
                >
                  {openManualId === manual.id ? "▼ CLOSE" : "▶ VIEW"}
                </button>
                <button className="btn btn-dl" onClick={e => {
                  e.stopPropagation();
                  setDlNotifyId(manual.id);
                  setTimeout(() => setDlNotifyId(null), 2800);
                }}>↓ DL</button>
                {dlNotifyId === manual.id && (
                  <span style={{
                    fontFamily:"'Share Tech Mono',monospace", fontSize:"0.6rem",
                    color:"var(--accent2)", letterSpacing:"1px", padding:"4px 8px",
                    border:"1px solid rgba(255,102,0,0.3)", background:"rgba(255,102,0,0.06)",
                    whiteSpace:"nowrap", alignSelf:"center"
                  }}>
                    ⚠ DOWNLOADS COMING SOON
                  </span>
                )}
              </div>
            </div>

            {/* ── PDF DROPDOWN ──────────────────────────────── */}
            <div className={`pdf-dropdown${openManualId === manual.id ? " open" : ""}`}>
              <div className="pdf-dropdown-inner">
                <div className="pdf-dropdown-header">
                  <span className="pdf-dropdown-title">◈ {manual.name.toUpperCase()}</span>
                  <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                    {manual.url && (
                      <button
                        className="btn-fullscreen"
                        onClick={e => { e.stopPropagation(); setFullscreenManual(manual); }}
                      >
                        ⛶ FULLSCREEN
                      </button>
                    )}
                    <button
                      className="pdf-dropdown-close"
                      onClick={e => { e.stopPropagation(); setOpenManualId(null); }}
                    >✕</button>
                  </div>
                </div>

                <div className="pdf-frame-wrap">
                  {manual.url ? (
                    openManualId === manual.id && (
                      <PdfViewer
                        url={resolveManualUrl(manual.url)}
                        onPageCount={count => {
                          const cacheKey = `kv_pdfpages_${manual.id}`;
                          localStorage.setItem(cacheKey, String(count));
                          setRealPages(prev => ({ ...prev, [manual.id]: count }));
                        }}
                      />
                    )
                  ) : (
                    <div className="pdf-placeholder">
                      <div className="big">PDF</div>
                      <div>[ PDF VIEWER ]</div>
                      <div style={{marginTop:12,fontSize:"0.65rem",opacity:0.6}}>
                        Add a <code>url</code> field to this manual in the data<br/>to enable in-browser viewing.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── KIT IMAGE ───────────────────────────────────────── */}
      <div className="kit-image-section">
        <div className="kit-image-wrap" style={{"--ki-accent": gc(kit.grade).accent}}>
          {kit.imageUrl ? (
            <>
              <img
                className="kit-image"
                src={kit.imageUrl}
                alt={`${kit.name} — ${kit.grade} ${kit.scale}`}
                onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
              />
              <div className="kit-image-placeholder" style={{display:"none"}}>
                <div className="kit-image-placeholder-icon">🤖</div>
                <div className="kit-image-placeholder-text">IMAGE UNAVAILABLE<br/>REPLACE imageUrl IN DATA</div>
              </div>
            </>
          ) : (
            <div className="kit-image-placeholder">
              <div className="kit-image-placeholder-icon">🤖</div>
              <div className="kit-image-placeholder-text">NO IMAGE YET<br/>ADD imageUrl TO THIS KIT</div>
            </div>
          )}
          <div className="kit-image-label">{kit.grade} {kit.scale} · {kit.name}</div>
        </div>
      </div>

      {/* ── AMAZON AFFILIATE BANNER ─────────────────────────── */}
      {AMAZON_URLS[String(kit.id)] && (
        <div className="affiliate-banner">
          <div className="affiliate-left">
            <div className="affiliate-icon">🛒</div>
            <div>
              <div className="affiliate-title">BUY ON AMAZON</div>
              <div className="affiliate-sub">{kit.grade} {kit.scale} · {kit.name}</div>
            </div>
          </div>
          <a className="btn-amazon" href={AMAZON_URLS[String(kit.id)]} target="_blank" rel="noopener noreferrer sponsored">
            VIEW ON AMAZON →
          </a>
          <div className="affiliate-disclaimer">
            ★ As an Amazon Associate, KitVault.io earns from qualifying purchases. This does not affect the price you pay.
          </div>
        </div>
      )}

      {/* ── COMMENTS ─────────────────────────────────────────── */}
      <CommentSection kitId={kit.id} isSignedIn={isSignedIn} user={user} />

      {fullscreenManual && (
        <PdfFullscreenModal manual={fullscreenManual} onClose={() => setFullscreenManual(null)} />
      )}
    </>
  );
}
