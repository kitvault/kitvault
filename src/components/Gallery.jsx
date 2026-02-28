// ─────────────────────────────────────────────────────────────
// Gallery.jsx — Community build gallery
// Features: upload up to 3 images, tag a kit (grade filter +
// autocomplete), caption, likes, comments per post, admin delete.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { GRADE_COLORS, GRADES } from "../data/grades.js";

const gc = (g) => GRADE_COLORS[g] || GRADE_COLORS["HG"];
const ADMIN_KEY_STORAGE = "kv_admin_key";
const MAX_IMAGES = 3;
const MAX_FILE_MB = 5;

// ─── Styles ──────────────────────────────────────────────────
const S = {
  page: { padding: "0 40px 60px", maxWidth: 1200, margin: "0 auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 },
  uploadBtn: { padding: "10px 24px", background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)", color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", letterSpacing: "2px", cursor: "pointer", clipPath: "polygon(0 0, 92% 0, 100% 20%, 100% 100%, 8% 100%, 0 80%)" },
  filters: { display: "flex", gap: 6, flexWrap: "wrap" },
  filterBtn: { padding: "8px 14px", background: "var(--panel, #0a1220)", border: "1px solid var(--border, #1a2f50)", color: "var(--text-dim, #5a7a9f)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", cursor: "pointer", letterSpacing: "1px", transition: "all 0.2s" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  // Card
  card: { background: "var(--panel, #0a1220)", border: "1px solid var(--border, #1a2f50)", overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s" },
  cardImg: { width: "100%", height: 240, objectFit: "cover", display: "block", background: "#080c12" },
  cardBody: { padding: "14px 16px" },
  cardGrade: { fontSize: "0.55rem", letterSpacing: "2px", marginBottom: 4 },
  cardKit: { fontSize: "0.85rem", color: "#c8ddf5", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, marginBottom: 4 },
  cardCaption: { fontSize: "0.65rem", color: "#9ab0cc", fontFamily: "'Share Tech Mono',monospace", lineHeight: 1.6, marginBottom: 8, wordBreak: "break-word" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.55rem", color: "var(--text-dim, #5a7a9f)", letterSpacing: "0.5px" },
  cardUser: { display: "flex", alignItems: "center", gap: 6 },
  cardAvatar: { width: 20, height: 20, borderRadius: "50%", border: "1px solid rgba(0,170,255,0.15)" },
  likeBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "0.65rem", display: "flex", alignItems: "center", gap: 4, color: "var(--text-dim,#5a7a9f)", fontFamily: "'Share Tech Mono',monospace", transition: "color 0.2s" },
  likeBtnActive: { color: "#ff2244" },
  commentCount: { fontSize: "0.55rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "0.5px" },
  // Modal
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modal: { background: "#0a1220", border: "1px solid var(--border, #1a2f50)", width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", padding: 24 },
  modalTitle: { fontSize: "0.65rem", letterSpacing: "3px", color: "#00aaff", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "none", border: "none", color: "var(--text-dim,#5a7a9f)", cursor: "pointer", fontSize: "1rem" },
  // Detail modal
  detailModal: { background: "#0a1220", border: "1px solid var(--border, #1a2f50)", width: "100%", maxWidth: 800, maxHeight: "90vh", overflowY: "auto" },
  detailImgWrap: { position: "relative", background: "#000" },
  detailImg: { width: "100%", maxHeight: "50vh", objectFit: "contain", display: "block" },
  detailNav: { position: "absolute", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", fontSize: "1.5rem", padding: "12px 16px", cursor: "pointer" },
  detailBody: { padding: 24 },
  imgDots: { display: "flex", justifyContent: "center", gap: 6, padding: "8px 0", background: "rgba(0,0,0,0.3)" },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.3)", cursor: "pointer", transition: "background 0.2s" },
  dotActive: { background: "#00aaff" },
  // Form
  label: { fontSize: "0.6rem", color: "#5a7a9f", letterSpacing: "1px", marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "10px 12px", background: "#080c12", border: "1px solid #1a2f50", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", outline: "none", boxSizing: "border-box", marginBottom: 16, letterSpacing: "0.5px" },
  textarea: { width: "100%", padding: "10px 12px", background: "#080c12", border: "1px solid #1a2f50", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 60, marginBottom: 16, letterSpacing: "0.5px", lineHeight: 1.6 },
  gradeRow: { display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" },
  kitSuggestions: { background: "#080c12", border: "1px solid #1a2f50", maxHeight: 160, overflowY: "auto", marginTop: -12, marginBottom: 16 },
  kitSugItem: { padding: "8px 12px", fontSize: "0.65rem", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", cursor: "pointer", borderBottom: "1px solid rgba(26,47,80,0.3)", transition: "background 0.15s", letterSpacing: "0.5px" },
  dropzone: { border: "2px dashed #1a2f50", padding: 24, textAlign: "center", cursor: "pointer", marginBottom: 16, transition: "border-color 0.2s" },
  dropzoneActive: { borderColor: "#00aaff" },
  previewRow: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  previewThumb: { width: 80, height: 80, objectFit: "cover", border: "1px solid #1a2f50", position: "relative" },
  previewRemove: { position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.7)", border: "none", color: "#ff2244", cursor: "pointer", fontSize: "0.6rem", padding: "2px 4px", lineHeight: 1 },
  submitBtn: { padding: "12px 28px", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.4)", color: "#00ff88", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", letterSpacing: "2px", cursor: "pointer", width: "100%" },
  submitBtnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  error: { fontSize: "0.6rem", color: "#ff2244", letterSpacing: "0.5px", marginBottom: 12 },
  success: { fontSize: "0.6rem", color: "#00ff88", letterSpacing: "0.5px", marginBottom: 12 },
  empty: { textAlign: "center", padding: "60px 20px", fontFamily: "'Share Tech Mono',monospace", color: "var(--text-dim,#5a7a9f)" },
  // Comments inside detail
  commentWrap: { borderTop: "1px solid var(--border,#1a2f50)", paddingTop: 16, marginTop: 16 },
  commentTitle: { fontSize: "0.6rem", letterSpacing: "2px", color: "#00aaff", marginBottom: 12 },
  commentInputRow: { display: "flex", gap: 8, marginBottom: 12, alignItems: "flex-start" },
  commentTextarea: { flex: 1, background: "#080c12", border: "1px solid #1a2f50", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "8px 10px", outline: "none", resize: "none", minHeight: 36, letterSpacing: "0.5px", lineHeight: 1.5, boxSizing: "border-box" },
  commentPostBtn: { padding: "8px 14px", background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)", color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", letterSpacing: "1px", cursor: "pointer", flexShrink: 0 },
  commentItem: { display: "flex", gap: 8, padding: "8px 0", borderTop: "1px solid rgba(26,47,80,0.3)" },
  commentAvatar: { width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(0,170,255,0.15)", flexShrink: 0 },
  commentUser: { fontSize: "0.63rem", color: "#c8ddf5", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 },
  commentTime: { fontSize: "0.5rem", color: "var(--text-dim,#5a7a9f)" },
  commentText: { fontSize: "0.63rem", color: "#9ab0cc", fontFamily: "'Share Tech Mono',monospace", lineHeight: 1.6, wordBreak: "break-word" },
  deleteBtn: { background: "none", border: "none", color: "rgba(255,34,68,0.4)", cursor: "pointer", fontSize: "0.55rem", padding: "0 4px", marginLeft: "auto" },
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

// ─── Upload Modal ────────────────────────────────────────────
function UploadModal({ allKits, onClose, onUploaded }) {
  const { user } = useUser();
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [kitSearch, setKitSearch] = useState("");
  const [selectedKit, setSelectedKit] = useState(null);
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const filteredKits = allKits.filter(k => {
    const matchGrade = gradeFilter === "ALL" || k.grade === gradeFilter;
    const matchSearch = kitSearch.length >= 2 && (
      k.name.toLowerCase().includes(kitSearch.toLowerCase()) ||
      k.series?.toLowerCase().includes(kitSearch.toLowerCase())
    );
    return matchGrade && matchSearch;
  }).slice(0, 8);

  const addFiles = (newFiles) => {
    const remaining = MAX_IMAGES - files.length;
    const toAdd = Array.from(newFiles).slice(0, remaining);
    const valid = toAdd.filter(f => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > MAX_FILE_MB * 1024 * 1024) return false;
      return true;
    });
    if (valid.length < toAdd.length) setError(`Some files skipped (max ${MAX_FILE_MB}MB, images only)`);
    const updated = [...files, ...valid];
    setFiles(updated);
    setPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const removeFile = (idx) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    setPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };

  const handleSubmit = async () => {
    if (!selectedKit || files.length === 0 || uploading) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("kit_id", selectedKit.id);
      formData.append("kit_name", selectedKit.name);
      formData.append("kit_grade", selectedKit.grade);
      formData.append("kit_scale", selectedKit.scale);
      formData.append("caption", caption.trim());
      formData.append("user_id", user.id);
      formData.append("username", user.fullName || user.firstName || user.username || "Builder");
      formData.append("avatar_url", user.imageUrl || "");
      files.forEach(f => formData.append("images", f));

      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.ok) {
        onUploaded();
        onClose();
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalTitle}>
          <span>◈ UPLOAD YOUR BUILD</span>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Grade filter */}
        <div style={S.label}>STEP 1 — SELECT KIT GRADE</div>
        <div style={S.gradeRow}>
          {GRADES.map(g => {
            const c = gc(g);
            const active = gradeFilter === g;
            const accent = g === "ALL" ? "#00aaff" : c.accent;
            return (
              <button key={g} style={{...S.filterBtn, ...(active ? { borderColor: accent, color: accent, background: `rgba(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)},0.08)` } : {})}}
                onClick={() => { setGradeFilter(g); setSelectedKit(null); setKitSearch(""); }}>
                {g}
              </button>
            );
          })}
        </div>

        {/* Kit search */}
        <div style={S.label}>STEP 2 — SEARCH & SELECT KIT</div>
        {selectedKit ? (
          <div style={{...S.input, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, color: gc(selectedKit.grade).accent}}>
            <span>{selectedKit.grade} · {selectedKit.scale} · {selectedKit.name}</span>
            <button style={{background:"none",border:"none",color:"#ff2244",cursor:"pointer",fontSize:"0.7rem"}} onClick={() => { setSelectedKit(null); setKitSearch(""); }}>✕</button>
          </div>
        ) : (
          <>
            <input style={S.input} placeholder="Type kit name (min 2 chars)..." value={kitSearch} onChange={e => setKitSearch(e.target.value)} />
            {filteredKits.length > 0 && (
              <div style={S.kitSuggestions}>
                {filteredKits.map(k => (
                  <div key={k.id} style={S.kitSugItem}
                    onMouseEnter={e => e.target.style.background = "rgba(0,170,255,0.05)"}
                    onMouseLeave={e => e.target.style.background = "transparent"}
                    onClick={() => { setSelectedKit(k); setKitSearch(""); }}>
                    <span style={{color: gc(k.grade).accent}}>{k.grade}</span> · {k.scale} · {k.name}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Image upload */}
        <div style={S.label}>STEP 3 — ADD IMAGES (UP TO {MAX_IMAGES})</div>
        {files.length < MAX_IMAGES && (
          <div style={{...S.dropzone, ...(dragOver ? S.dropzoneActive : {})}}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}>
            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden
              onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />
            <div style={{fontSize:"1.5rem",opacity:0.3,marginBottom:8}}>📸</div>
            <div style={{fontSize:"0.65rem",color:"var(--text-dim,#5a7a9f)",letterSpacing:"1px"}}>
              DRAG & DROP OR CLICK TO SELECT
            </div>
            <div style={{fontSize:"0.55rem",color:"var(--text-dim,#5a7a9f)",opacity:0.5,marginTop:4}}>
              MAX {MAX_FILE_MB}MB PER IMAGE · JPG, PNG, WEBP
            </div>
          </div>
        )}
        {previews.length > 0 && (
          <div style={S.previewRow}>
            {previews.map((src, i) => (
              <div key={i} style={{position:"relative"}}>
                <img src={src} alt="" style={S.previewThumb} />
                <button style={S.previewRemove} onClick={() => removeFile(i)}>✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Caption */}
        <div style={S.label}>CAPTION (OPTIONAL)</div>
        <textarea style={S.textarea} placeholder="Tell us about your build..." value={caption} onChange={e => setCaption(e.target.value)} maxLength={500} />

        {error && <div style={S.error}>✕ {error}</div>}

        <button style={{...S.submitBtn, ...((uploading || !selectedKit || files.length === 0) ? S.submitBtnDisabled : {})}}
          onClick={handleSubmit} disabled={uploading || !selectedKit || files.length === 0}>
          {uploading ? "UPLOADING..." : "SUBMIT BUILD →"}
        </button>
      </div>
    </div>
  );
}

// ─── Post Detail Modal ───────────────────────────────────────
function PostDetail({ post, onClose, onRefresh }) {
  const { user, isSignedIn } = useUser();
  const isAdmin = !!sessionStorage.getItem(ADMIN_KEY_STORAGE);
  const images = post.images || [];
  const [imgIdx, setImgIdx] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/gallery/${post.id}/comments`);
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
    } catch (_) {}
  }, [post.id]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const postComment = async () => {
    if (!commentBody.trim() || posting || !user) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/gallery/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          username: user.fullName || user.firstName || user.username || "Builder",
          avatar_url: user.imageUrl || "",
          body: commentBody.trim(),
        }),
      });
      if (res.ok) { setCommentBody(""); fetchComments(); }
    } catch (_) {}
    setPosting(false);
  };

  const deleteComment = async (commentId) => {
    try {
      await fetch(`/api/gallery/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id, admin_key: isAdmin ? sessionStorage.getItem(ADMIN_KEY_STORAGE) : undefined }),
      });
      fetchComments();
    } catch (_) {}
  };

  const deletePost = async () => {
    if (!confirm("Delete this gallery post?")) return;
    try {
      await fetch(`/api/gallery/${post.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id, admin_key: isAdmin ? sessionStorage.getItem(ADMIN_KEY_STORAGE) : undefined }),
      });
      onRefresh();
      onClose();
    } catch (_) {}
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.detailModal} onClick={e => e.stopPropagation()}>
        {/* Image viewer */}
        <div style={S.detailImgWrap}>
          {images[imgIdx] && <img src={images[imgIdx]} alt="" style={S.detailImg} />}
          {images.length > 1 && (
            <>
              <button style={{...S.detailNav, left: 0}} onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}>‹</button>
              <button style={{...S.detailNav, right: 0}} onClick={() => setImgIdx(i => (i + 1) % images.length)}>›</button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div style={S.imgDots}>
            {images.map((_, i) => <div key={i} style={{...S.dot, ...(i === imgIdx ? S.dotActive : {})}} onClick={() => setImgIdx(i)} />)}
          </div>
        )}

        {/* Details */}
        <div style={S.detailBody}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:"0.55rem",letterSpacing:"2px",color: gc(post.kit_grade).accent,marginBottom:4}}>{post.kit_grade} GRADE · {post.kit_scale}</div>
              <div style={{fontSize:"1.1rem",color:"#c8ddf5",fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>{post.kit_name}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={S.cardUser}>
                {post.avatar_url && <img src={post.avatar_url} alt="" style={S.cardAvatar} />}
                <span style={{fontSize:"0.6rem",color:"#c8ddf5"}}>{post.username}</span>
              </div>
              <span style={{fontSize:"0.5rem",color:"var(--text-dim,#5a7a9f)"}}>{timeAgo(post.created_at)}</span>
            </div>
          </div>
          {post.caption && <div style={{fontSize:"0.68rem",color:"#9ab0cc",fontFamily:"'Share Tech Mono',monospace",lineHeight:1.7,marginBottom:16}}>{post.caption}</div>}

          {(user?.id === post.user_id || isAdmin) && (
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <button style={{background:"none",border:"1px solid rgba(0,170,255,0.2)",color:"rgba(0,170,255,0.6)",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",padding:"6px 12px",cursor:"pointer",letterSpacing:"1px"}} onClick={() => setShowEdit(true)}>
                ✎ EDIT POST
              </button>
              <button style={{background:"none",border:"1px solid rgba(255,34,68,0.2)",color:"rgba(255,34,68,0.6)",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",padding:"6px 12px",cursor:"pointer",letterSpacing:"1px"}} onClick={deletePost}>
                🗑 DELETE POST
              </button>
            </div>
          )}

          {/* Comments */}
          <div style={S.commentWrap}>
            <div style={S.commentTitle}>◈ COMMENTS ({comments.length})</div>

            {isSignedIn && user && (
              <div style={S.commentInputRow}>
                <textarea style={S.commentTextarea} placeholder="Add a comment..." value={commentBody}
                  onChange={e => setCommentBody(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) postComment(); }}
                  maxLength={500} />
                <button style={{...S.commentPostBtn, ...(!commentBody.trim() ? {opacity:0.4} : {})}}
                  onClick={postComment} disabled={!commentBody.trim() || posting}>
                  {posting ? "..." : "POST"}
                </button>
              </div>
            )}

            {comments.length === 0 ? (
              <div style={{fontSize:"0.55rem",color:"var(--text-dim,#5a7a9f)",textAlign:"center",padding:"12px 0",opacity:0.6,letterSpacing:"1px"}}>NO COMMENTS YET</div>
            ) : comments.map(c => (
              <div key={c.id} style={S.commentItem}>
                {c.avatar_url ? <img src={c.avatar_url} alt="" style={S.commentAvatar} /> : <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(0,170,255,0.1)",flexShrink:0}} />}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <span style={S.commentUser}>{c.username}</span>
                    <span style={S.commentTime}>{timeAgo(c.created_at)}</span>
                    {(user?.id === c.user_id || isAdmin) && (
                      <button style={S.deleteBtn} onClick={() => deleteComment(c.id)}>🗑</button>
                    )}
                  </div>
                  <div style={S.commentText}>{c.body}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{textAlign:"right",marginTop:16}}>
            <button style={S.closeBtn} onClick={onClose}>CLOSE ✕</button>
          </div>
        </div>
      </div>
      {showEdit && (
        <EditPostModal
          post={post}
          onClose={() => setShowEdit(false)}
          onSaved={() => { setShowEdit(false); onRefresh(); onClose(); }}
          onDeleted={() => { onRefresh(); onClose(); }}
        />
      )}
    </div>
  );
}

// ─── Edit Post Modal (Admin) ──────────────────────────────────
function EditPostModal({ post, onClose, onSaved, onDeleted }) {
  const { user } = useUser();
  const isAdmin = !!sessionStorage.getItem(ADMIN_KEY_STORAGE);
  const [kitName, setKitName] = useState(post.kit_name || "");
  const [caption, setCaption] = useState(post.caption || "");
  const [dateStr, setDateStr] = useState(() => {
    const d = new Date(post.created_at * 1000);
    return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const newTimestamp = Math.floor(new Date(dateStr).getTime() / 1000);
      const res = await fetch(`/api/gallery/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          admin_key: isAdmin ? sessionStorage.getItem(ADMIN_KEY_STORAGE) : undefined,
          kit_name: kitName,
          caption,
          created_at: newTimestamp,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSuccess(true);
        setTimeout(() => onSaved(), 600);
      } else {
        setError(data.error || "Update failed");
      }
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Permanently delete this gallery post? This cannot be undone.")) return;
    try {
      await fetch(`/api/gallery/${post.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          admin_key: isAdmin ? sessionStorage.getItem(ADMIN_KEY_STORAGE) : undefined,
        }),
      });
      onDeleted();
    } catch (_) {}
  };

  return (
    <div style={{...S.overlay, zIndex: 1100}} onClick={onClose}>
      <div style={{...S.modal, maxWidth: 520}} onClick={e => e.stopPropagation()}>
        <div style={S.modalTitle}>
          <span>✎ EDIT POST #{post.id}</span>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Kit Name */}
        <div style={S.label}>KIT NAME</div>
        <input style={S.input} value={kitName} onChange={e => setKitName(e.target.value)} />

        {/* Caption */}
        <div style={S.label}>CAPTION</div>
        <textarea style={S.textarea} value={caption} onChange={e => setCaption(e.target.value)} maxLength={500} />

        {/* Upload Date */}
        <div style={S.label}>UPLOAD DATE</div>
        <input
          type="datetime-local"
          style={{...S.input, colorScheme: "dark"}}
          value={dateStr}
          onChange={e => setDateStr(e.target.value)}
        />

        {/* Post info (read-only) */}
        <div style={{display:"flex",gap:16,marginBottom:16,fontSize:"0.55rem",color:"var(--text-dim,#5a7a9f)",letterSpacing:"0.5px",fontFamily:"'Share Tech Mono',monospace"}}>
          <span>GRADE: {post.kit_grade}</span>
          <span>SCALE: {post.kit_scale}</span>
          <span>BY: {post.username}</span>
          <span>ID: {post.id}</span>
        </div>

        {error && <div style={S.error}>✕ {error}</div>}
        {success && <div style={S.success}>✓ SAVED SUCCESSFULLY</div>}

        <button
          style={{...S.submitBtn, marginBottom: 12, ...((saving) ? S.submitBtnDisabled : {})}}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "SAVING..." : "SAVE CHANGES →"}
        </button>

        {/* Danger zone */}
        <div style={{borderTop:"1px solid rgba(255,34,68,0.15)",paddingTop:16,marginTop:8}}>
          <div style={{fontSize:"0.55rem",letterSpacing:"2px",color:"rgba(255,34,68,0.4)",marginBottom:8,fontFamily:"'Share Tech Mono',monospace"}}>DANGER ZONE</div>
          <button
            style={{padding:"10px 20px",background:"rgba(255,34,68,0.06)",border:"1px solid rgba(255,34,68,0.25)",color:"#ff2244",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",letterSpacing:"1px",cursor:"pointer",width:"100%"}}
            onClick={handleDelete}
          >
            🗑 PERMANENTLY DELETE THIS POST
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Gallery Main ────────────────────────────────────────────
export default function Gallery({ allKits }) {
  const { user, isSignedIn } = useUser();
  const isAdmin = !!sessionStorage.getItem(ADMIN_KEY_STORAGE);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userLikes, setUserLikes] = useState(new Set());

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch (_) {}
    setLoading(false);
  }, []);

  const fetchLikes = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/gallery/likes?user_id=${user.id}`);
      const data = await res.json();
      if (Array.isArray(data)) setUserLikes(new Set(data));
    } catch (_) {}
  }, [user]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => { fetchLikes(); }, [fetchLikes]);

  const toggleLike = async (e, postId) => {
    e.stopPropagation();
    if (!user) return;
    const liked = userLikes.has(postId);
    // Optimistic update
    setUserLikes(prev => {
      const next = new Set(prev);
      liked ? next.delete(postId) : next.add(postId);
      return next;
    });
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p));
    try {
      await fetch(`/api/gallery/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
    } catch (_) {
      // Revert on failure
      setUserLikes(prev => {
        const next = new Set(prev);
        liked ? next.add(postId) : next.delete(postId);
        return next;
      });
      fetchPosts();
    }
  };

  const filtered = gradeFilter === "ALL" ? posts : posts.filter(p => p.kit_grade === gradeFilter);

  return (
    <>
      <div className="page-hero">
        <div className="page-tag">COMMUNITY BUILDS</div>
        <div className="page-title">GALLERY</div>
        <div className="page-sub">SHARE YOUR BUILDS WITH THE COMMUNITY</div>
      </div>

      <div style={S.page}>
        <div style={S.topBar}>
          <div style={S.filters}>
            {["ALL", ...GRADES.filter(g => g !== "ALL")].map(g => {
              const c = gc(g);
              const active = gradeFilter === g;
              const accent = g === "ALL" ? "#00aaff" : c.accent;
              return (
                <button key={g} style={{...S.filterBtn, ...(active ? { borderColor: accent, color: accent, background: `rgba(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)},0.08)` } : {})}}
                  onClick={() => setGradeFilter(g)}>
                  {g}
                </button>
              );
            })}
          </div>
          {isSignedIn && (
            <button style={S.uploadBtn} onClick={() => setShowUpload(true)}>📸 UPLOAD BUILD</button>
          )}
        </div>

        {loading ? (
          <div style={S.empty}>
            <div style={{fontSize:"0.7rem",letterSpacing:"2px"}}>LOADING...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={S.empty}>
            <div style={{fontSize:"2rem",opacity:0.2,marginBottom:12}}>📸</div>
            <div style={{fontSize:"0.75rem",letterSpacing:"2px",marginBottom:8}}>NO BUILDS YET</div>
            <div style={{fontSize:"0.6rem",opacity:0.5}}>
              {isSignedIn ? "Be the first — click UPLOAD BUILD above!" : "Sign in to share your builds."}
            </div>
          </div>
        ) : (
          <div style={S.grid}>
            {filtered.map(post => {
              const firstImg = post.images?.[0];
              const c = gc(post.kit_grade);
              const liked = userLikes.has(post.id);
              return (
                <div key={post.id} style={S.card} onClick={() => setSelectedPost(post)}
                  onMouseEnter={e => e.currentTarget.style.borderColor = c.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border, #1a2f50)"}>
                  {firstImg && <img src={firstImg} alt="" style={S.cardImg} />}
                  <div style={{height:3,background:c.accent}} />
                  <div style={S.cardBody}>
                    <div style={{...S.cardGrade, color: c.accent}}>{post.kit_grade} · {post.kit_scale}</div>
                    <div style={S.cardKit}>{post.kit_name}</div>
                    {post.caption && <div style={S.cardCaption}>{post.caption.length > 100 ? post.caption.slice(0, 100) + "..." : post.caption}</div>}
                    <div style={S.cardFooter}>
                      <div style={S.cardUser}>
                        {post.avatar_url && <img src={post.avatar_url} alt="" style={S.cardAvatar} />}
                        <span>{post.username}</span>
                        <span>· {timeAgo(post.created_at)}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <button style={{...S.likeBtn, ...(liked ? S.likeBtnActive : {})}} onClick={e => toggleLike(e, post.id)}>
                          {liked ? "♥" : "♡"} {post.likes || 0}
                        </button>
                        <span style={S.commentCount}>💬 {post.comment_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showUpload && <UploadModal allKits={allKits} onClose={() => setShowUpload(false)} onUploaded={fetchPosts} />}
      {selectedPost && <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} onRefresh={fetchPosts} />}
    </>
  );
}
