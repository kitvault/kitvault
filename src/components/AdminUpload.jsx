// ─────────────────────────────────────────────────────────────
// AdminUpload.jsx
// Password-protected admin page for uploading new PDF manuals
// AND managing existing kits/manuals (view, delete).
//
// Route: /admin
// Worker endpoints used:
//   POST   /api/upload          — upload a new PDF
//   GET    /api/kits            — list all kits + manuals
//   DELETE /api/manual/:id      — delete one manual
//   DELETE /api/kit/:id         — delete kit + all its manuals
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";

const NAMING_EXAMPLES = [
  { filename: "hg-144-rx78-2-gundam-assembly.pdf",      result: "HG · 1/144 · Rx78 2 Gundam" },
  { filename: "mg-100-unicorn-gundam-assembly.pdf",      result: "MG · 1/100 · Unicorn Gundam" },
  { filename: "rg-144-strike-freedom-assembly.pdf",      result: "RG · 1/144 · Strike Freedom" },
  { filename: "pg-60-rx-78-2-gundam-assembly.pdf",       result: "PG · 1/60 · Rx 78 2 Gundam" },
  { filename: "sd-unk-zeromaru-assembly.pdf",            result: "SD · SD · Zeromaru" },
  { filename: "eg-144-strike-gundam-assembly.pdf",       result: "EG · 1/144 · Strike Gundam" },
  { filename: "mgsd-unk-freedom-gundam-assembly.pdf",    result: "MGSD · SD · Freedom Gundam" },
];

const ADMIN_KEY_STORAGE = "kv_admin_key";

export default function AdminUpload() {
  const [adminKey, setAdminKeyState] = useState(() => sessionStorage.getItem(ADMIN_KEY_STORAGE) || "");
  const [isAuthed, setIsAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");

  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [d1Kits, setD1Kits] = useState([]);
  const [kitsLoading, setKitsLoading] = useState(false);
  const [kitSearch, setKitSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);

  // Inline editing state
  const [editingKit, setEditingKit] = useState(null); // kit id being edited
  const [editFields, setEditFields] = useState({});
  const [editManuals, setEditManuals] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editStatus, setEditStatus] = useState(null);

  const fileInputRef = useRef(null);

  // ── Auth ───────────────────────────────────────────────────
  const handleAuth = (e) => {
    e.preventDefault();
    if (!keyInput.trim()) { setKeyError("Enter your admin key"); return; }
    sessionStorage.setItem(ADMIN_KEY_STORAGE, keyInput.trim());
    setAdminKeyState(keyInput.trim());
    setIsAuthed(true);
    setKeyError("");
  };

  // ── Fetch D1 kits ─────────────────────────────────────────
  const fetchKits = useCallback(async () => {
    setKitsLoading(true);
    try {
      const res = await fetch("/api/kits");
      const data = await res.json();
      if (Array.isArray(data)) setD1Kits(data);
    } catch (_) {}
    setKitsLoading(false);
  }, []);

  useEffect(() => { if (isAuthed) fetchKits(); }, [isAuthed, fetchKits]);

  // ── Delete manual ─────────────────────────────────────────
  const deleteManual = async (manualId) => {
    setDeleteStatus(null);
    try {
      const res = await fetch(`/api/manual/${manualId}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": adminKey },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setDeleteStatus({ ok: true, message: `Manual #${manualId} deleted` });
        fetchKits();
      } else {
        setDeleteStatus({ ok: false, message: data.error || "Delete failed" });
      }
    } catch (err) {
      setDeleteStatus({ ok: false, message: err.message });
    }
    setConfirmDelete(null);
  };

  // ── Delete kit ────────────────────────────────────────────
  const deleteKit = async (kitId) => {
    setDeleteStatus(null);
    try {
      const res = await fetch(`/api/kit/${kitId}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": adminKey },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setDeleteStatus({ ok: true, message: `Kit #${kitId} and all manuals deleted` });
        fetchKits();
      } else {
        setDeleteStatus({ ok: false, message: data.error || "Delete failed" });
      }
    } catch (err) {
      setDeleteStatus({ ok: false, message: err.message });
    }
    setConfirmDelete(null);
  };

  // ── Inline edit ─────────────────────────────────────────────
  const startEdit = (kit) => {
    setEditingKit(kit.id);
    setEditFields({ name: kit.name, grade: kit.grade, scale: kit.scale, series: kit.series || "", image_url: kit.image_url || "" });
    setEditManuals(kit.manuals.map(m => ({ id: m.id, name: m.name, lang: m.lang, pages: m.pages || 0 })));
    setEditStatus(null);
  };

  const cancelEdit = () => { setEditingKit(null); setEditFields({}); setEditManuals([]); setEditStatus(null); };

  const saveEdit = async () => {
    setSaving(true);
    setEditStatus(null);
    try {
      const res = await fetch(`/api/kit/${editingKit}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Admin-Key": adminKey },
        body: JSON.stringify({ kit: editFields, manuals: editManuals }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setEditStatus({ ok: true, message: "Saved" });
        fetchKits();
        setTimeout(() => { setEditingKit(null); setEditStatus(null); }, 800);
      } else {
        setEditStatus({ ok: false, message: data.error || "Save failed" });
      }
    } catch (err) {
      setEditStatus({ ok: false, message: err.message });
    }
    setSaving(false);
  };

  // ── File selection ─────────────────────────────────────────
  const addFiles = useCallback((incoming) => {
    const pdfs = Array.from(incoming).filter(f => f.name.endsWith(".pdf"));
    if (pdfs.length === 0) return;
    setFiles(prev => {
      const names = new Set(prev.map(f => f.name));
      return [...prev, ...pdfs.filter(f => !names.has(f.name))];
    });
  }, []);

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };
  const removeFile = (name) => setFiles(prev => prev.filter(f => f.name !== name));

  // ── Upload ─────────────────────────────────────────────────
  const uploadAll = async () => {
    if (!files.length || uploading) return;
    setUploading(true);
    setResults([]);
    const newResults = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("filename", file.name);
      try {
        const res = await fetch("/api/upload", { method: "POST", headers: { "X-Admin-Key": adminKey }, body: fd });
        const data = await res.json();
        if (res.ok && data.ok) {
          newResults.push({ filename: file.name, status: "success", kitCreated: data.kitCreated, kit: data.kit, reason: data.reason });
        } else {
          newResults.push({ filename: file.name, status: "error", message: data.error || "Unknown error" });
        }
      } catch (err) {
        newResults.push({ filename: file.name, status: "error", message: err.message });
      }
      setResults([...newResults]);
    }
    setFiles([]);
    setUploading(false);
    fetchKits();
  };

  const filteredKits = kitSearch
    ? d1Kits.filter(k => k.name.toLowerCase().includes(kitSearch.toLowerCase()) || k.grade.toLowerCase().includes(kitSearch.toLowerCase()))
    : d1Kits;

  // ── Auth gate ──────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <div style={S.authWrap}>
        <div style={S.authBox}>
          <div style={{fontSize:"2rem",marginBottom:4}}>🔒</div>
          <div style={S.authTitle}>ADMIN ACCESS</div>
          <div style={S.authSub}>KITVAULT.IO — MANUAL UPLOAD</div>
          <form onSubmit={handleAuth} style={{width:"100%"}}>
            <input type="password" placeholder="ENTER ADMIN KEY" value={keyInput} onChange={e=>setKeyInput(e.target.value)} style={S.input} autoFocus />
            {keyError && <div style={{fontSize:"0.6rem",color:"#ff2244",letterSpacing:"1px",marginBottom:8}}>{keyError}</div>}
            <button type="submit" style={S.btnPrimary}>UNLOCK →</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={{padding:"60px 0 40px",textAlign:"center"}}>
        <div style={S.tag}>◈ ADMIN PANEL</div>
        <div style={S.title}>MANUAL UPLOAD</div>
        <div style={S.sub}>PDF FILES ARE AUTO-PARSED AND ADDED TO THE KIT LIBRARY</div>
      </div>

      {/* NAMING CONVENTION */}
      <div style={S.section}>
        <div style={S.sectionTitle}>◈ FILENAME FORMAT</div>
        <div style={S.note}>Files must follow this pattern: <code style={S.code}>{"{grade}-{scale}-{kit-name}-assembly.pdf"}</code></div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {NAMING_EXAMPLES.map(ex => (
            <div key={ex.filename} style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <code style={{color:"#c8ddf5",fontSize:"0.65rem",fontFamily:"'Share Tech Mono',monospace"}}>{ex.filename}</code>
              <span style={{color:"#5a7a9f",fontSize:"0.7rem"}}>→</span>
              <span style={{color:"#00ffcc",fontSize:"0.65rem",letterSpacing:"1px"}}>{ex.result}</span>
            </div>
          ))}
        </div>
        <div style={S.note}>Valid grades: <strong>hg · mg · rg · pg · sd · eg · mgsd</strong> | Scale: <strong>144 · 100 · 60 · unk</strong> | Always end with: <strong>-assembly.pdf</strong></div>
      </div>

      {/* DROP ZONE */}
      <div style={S.section}>
        <div style={S.sectionTitle}>◈ SELECT FILES</div>
        <div
          style={{...S.dropZone, ...(dragOver?{borderColor:"#00aaff",background:"rgba(0,170,255,0.08)"}:{})}}
          onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
          onDrop={handleDrop} onClick={()=>fileInputRef.current?.click()}
        >
          <div style={{fontSize:"2.4rem",marginBottom:12}}>📂</div>
          <div style={{fontSize:"0.75rem",letterSpacing:"3px",color:"#c8ddf5",marginBottom:8}}>DRAG & DROP PDF FILES HERE</div>
          <div style={{fontSize:"0.6rem",color:"#5a7a9f",letterSpacing:"1px"}}>or click to browse</div>
          <input ref={fileInputRef} type="file" accept=".pdf" multiple style={{display:"none"}} onChange={e=>addFiles(e.target.files)} />
        </div>
        {files.length > 0 && (
          <div style={{marginTop:20}}>
            <div style={{fontSize:"0.6rem",letterSpacing:"2px",color:"#5a7a9f",marginBottom:10}}>{files.length} FILE{files.length!==1?"S":""} QUEUED</div>
            {files.map(f => (
              <div key={f.name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #1a2f50"}}>
                <span style={S.pdfBadge}>PDF</span>
                <span style={{flex:1,fontSize:"0.65rem",color:"#c8ddf5",wordBreak:"break-all"}}>{f.name}</span>
                <span style={{fontSize:"0.6rem",color:"#5a7a9f"}}>{(f.size/1024).toFixed(0)} KB</span>
                <button style={{background:"none",border:"none",color:"#5a7a9f",cursor:"pointer",fontSize:"0.75rem"}} onClick={()=>removeFile(f.name)}>✕</button>
              </div>
            ))}
            <button style={{...S.btnPrimary,marginTop:16,...(uploading?{opacity:0.5,cursor:"not-allowed"}:{})}} onClick={uploadAll} disabled={uploading}>
              {uploading ? "UPLOADING..." : `UPLOAD ${files.length} FILE${files.length!==1?"S":""} →`}
            </button>
          </div>
        )}
      </div>

      {/* UPLOAD RESULTS */}
      {results.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>◈ UPLOAD RESULTS</div>
          {results.map(r => (
            <div key={r.filename} style={{border:"1px solid",borderColor:r.status==="success"?"rgba(0,255,136,0.3)":"rgba(255,34,68,0.3)",background:r.status==="success"?"rgba(0,255,136,0.05)":"rgba(255,34,68,0.05)",padding:16,marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontSize:"1rem",fontWeight:700,color:r.status==="success"?"#00ff88":"#ff2244"}}>{r.status==="success"?"✓":"✕"}</span>
                <code style={{fontSize:"0.65rem",color:"#c8ddf5"}}>{r.filename}</code>
              </div>
              {r.status==="success"&&r.kitCreated&&r.kit&&<div style={{fontSize:"0.6rem",color:"#5a7a9f",marginLeft:24}}>Kit created: <strong>{r.kit.grade} · {r.kit.scale} · {r.kit.name}</strong></div>}
              {r.status==="success"&&!r.kitCreated&&<div style={{fontSize:"0.6rem",color:"#ffcc00",marginLeft:24}}>⚠ PDF uploaded but kit not created — {r.reason}</div>}
              {r.status==="error"&&<div style={{fontSize:"0.6rem",color:"#ff2244",marginLeft:24}}>Error: {r.message}</div>}
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          KIT MANAGEMENT
         ═══════════════════════════════════════════════════════ */}
      <div style={{...S.section, marginTop:60}}>
        <div style={S.sectionTitle}>◈ MANAGE D1 KITS & MANUALS</div>

        {deleteStatus && (
          <div style={{padding:"10px 16px",marginBottom:16,border:`1px solid ${deleteStatus.ok?"rgba(0,255,136,0.3)":"rgba(255,34,68,0.3)"}`,background:deleteStatus.ok?"rgba(0,255,136,0.05)":"rgba(255,34,68,0.05)",color:deleteStatus.ok?"#00ff88":"#ff2244",fontSize:"0.65rem",letterSpacing:"1px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>{deleteStatus.ok?"✓":"✕"} {deleteStatus.message}</span>
            <button onClick={()=>setDeleteStatus(null)} style={{background:"none",border:"none",color:"inherit",cursor:"pointer",fontSize:"0.8rem"}}>✕</button>
          </div>
        )}

        {/* Confirm delete modal */}
        {confirmDelete && (
          <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
            <div style={{border:"1px solid rgba(255,34,68,0.4)",background:"#0a1220",padding:32,maxWidth:440,width:"100%",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <div style={{fontSize:"2rem"}}>⚠</div>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1rem",letterSpacing:"3px",color:"#ff2244"}}>CONFIRM DELETE</div>
              <div style={{fontSize:"0.7rem",color:"#c8ddf5",letterSpacing:"0.5px",lineHeight:1.6,wordBreak:"break-word"}}>{confirmDelete.label}</div>
              <div style={{fontSize:"0.6rem",color:"#5a7a9f",lineHeight:1.8,marginTop:4}}>
                {confirmDelete.type==="kit" ? "This will delete the kit AND all its manuals from D1. PDF files in R2 will remain." : "This will delete this manual entry from D1. The PDF file in R2 will remain."}
              </div>
              <div style={{display:"flex",gap:12,marginTop:12,width:"100%"}}>
                <button style={{flex:1,padding:12,background:"rgba(90,122,159,0.1)",border:"1px solid #1a2f50",color:"#5a7a9f",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",letterSpacing:"2px",cursor:"pointer"}} onClick={()=>setConfirmDelete(null)}>CANCEL</button>
                <button style={{flex:1,padding:12,background:"rgba(255,34,68,0.1)",border:"1px solid rgba(255,34,68,0.4)",color:"#ff2244",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",letterSpacing:"2px",cursor:"pointer"}} onClick={()=>{if(confirmDelete.type==="kit")deleteKit(confirmDelete.id);else deleteManual(confirmDelete.id);}}>DELETE →</button>
              </div>
            </div>
          </div>
        )}

        {/* Search + refresh */}
        <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
          <input type="text" placeholder="SEARCH KITS..." value={kitSearch} onChange={e=>setKitSearch(e.target.value)} style={{...S.input,marginBottom:0,flex:1}} />
          <button onClick={fetchKits} style={{...S.btnPrimary,width:"auto",padding:"12px 20px",whiteSpace:"nowrap"}}>{kitsLoading?"...":"↻ REFRESH"}</button>
        </div>
        <div style={S.note}>{d1Kits.length} kit{d1Kits.length!==1?"s":""} in D1{kitSearch?` · ${filteredKits.length} matching "${kitSearch}"`:""}</div>

        {filteredKits.length===0&&!kitsLoading&&(
          <div style={{...S.note,textAlign:"center",padding:"32px 0",opacity:0.5}}>{kitSearch?"NO KITS MATCH YOUR SEARCH":"NO KITS IN D1 YET"}</div>
        )}

        {filteredKits.map(kit => (
          <div key={kit.id} style={{border:"1px solid #1a2f50",background:"#080c12",marginBottom:10,padding:"14px 16px"}}>
            {editingKit === kit.id ? (
              /* ── EDIT MODE ── */
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <span style={{fontSize:"0.6rem",letterSpacing:"2px",color:"#00aaff"}}>✎ EDITING KIT #{kit.id}</span>
                  {editStatus && <span style={{fontSize:"0.55rem",color:editStatus.ok?"#00ff88":"#ff2244",marginLeft:"auto"}}>{editStatus.ok?"✓":"✕"} {editStatus.message}</span>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"80px 80px 1fr",gap:8,marginBottom:8}}>
                  <div>
                    <div style={{fontSize:"0.5rem",color:"#5a7a9f",letterSpacing:"1px",marginBottom:4}}>GRADE</div>
                    <select value={editFields.grade} onChange={e=>setEditFields(p=>({...p,grade:e.target.value}))}
                      style={{...S.input,marginBottom:0,padding:"8px",fontSize:"0.65rem",width:"100%"}}>
                      {["HG","MG","RG","PG","SD","EG","MGSD"].map(g=><option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:"0.5rem",color:"#5a7a9f",letterSpacing:"1px",marginBottom:4}}>SCALE</div>
                    <input value={editFields.scale} onChange={e=>setEditFields(p=>({...p,scale:e.target.value}))}
                      style={{...S.input,marginBottom:0,padding:"8px",fontSize:"0.65rem"}} />
                  </div>
                  <div>
                    <div style={{fontSize:"0.5rem",color:"#5a7a9f",letterSpacing:"1px",marginBottom:4}}>NAME</div>
                    <input value={editFields.name} onChange={e=>setEditFields(p=>({...p,name:e.target.value}))}
                      style={{...S.input,marginBottom:0,padding:"8px",fontSize:"0.65rem"}} />
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div>
                    <div style={{fontSize:"0.5rem",color:"#5a7a9f",letterSpacing:"1px",marginBottom:4}}>SERIES</div>
                    <input value={editFields.series} onChange={e=>setEditFields(p=>({...p,series:e.target.value}))}
                      placeholder="e.g. Gundam SEED" style={{...S.input,marginBottom:0,padding:"8px",fontSize:"0.65rem"}} />
                  </div>
                  <div>
                    <div style={{fontSize:"0.5rem",color:"#5a7a9f",letterSpacing:"1px",marginBottom:4}}>IMAGE URL</div>
                    <input value={editFields.image_url} onChange={e=>setEditFields(p=>({...p,image_url:e.target.value}))}
                      placeholder="https://..." style={{...S.input,marginBottom:0,padding:"8px",fontSize:"0.65rem"}} />
                  </div>
                </div>
                {/* Manual editing */}
                {editManuals.map((m, i) => (
                  <div key={m.id} style={{display:"grid",gridTemplateColumns:"1fr 60px 60px",gap:8,marginBottom:4,paddingLeft:12,borderLeft:"2px solid #1a2f50"}}>
                    <div>
                      <div style={{fontSize:"0.45rem",color:"#5a7a9f",letterSpacing:"1px",marginBottom:2}}>MANUAL NAME</div>
                      <input value={m.name} onChange={e=>{const u=[...editManuals];u[i]={...u[i],name:e.target.value};setEditManuals(u);}}
                        style={{...S.input,marginBottom:0,padding:"6px 8px",fontSize:"0.6rem"}} />
                    </div>
                    <div>
                      <div style={{fontSize:"0.45rem",color:"#5a7a9f",letterSpacing:"1px",marginBottom:2}}>LANG</div>
                      <input value={m.lang} onChange={e=>{const u=[...editManuals];u[i]={...u[i],lang:e.target.value};setEditManuals(u);}}
                        style={{...S.input,marginBottom:0,padding:"6px 8px",fontSize:"0.6rem"}} />
                    </div>
                    <div>
                      <div style={{fontSize:"0.45rem",color:"#5a7a9f",letterSpacing:"1px",marginBottom:2}}>PAGES</div>
                      <input type="number" value={m.pages} onChange={e=>{const u=[...editManuals];u[i]={...u[i],pages:parseInt(e.target.value)||0};setEditManuals(u);}}
                        style={{...S.input,marginBottom:0,padding:"6px 8px",fontSize:"0.6rem"}} />
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <button style={{...S.btnPrimary,width:"auto",padding:"8px 20px",fontSize:"0.6rem",...(saving?{opacity:0.5}:{})}} onClick={saveEdit} disabled={saving}>
                    {saving ? "SAVING..." : "💾 SAVE"}
                  </button>
                  <button style={{padding:"8px 20px",background:"rgba(90,122,159,0.1)",border:"1px solid #1a2f50",color:"#5a7a9f",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",letterSpacing:"1px",cursor:"pointer"}} onClick={cancelEdit}>
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              /* ── DISPLAY MODE ── */
              <>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={S.pdfBadge}>{kit.grade}</span>
                    <span style={{fontSize:"0.6rem",color:"#5a7a9f"}}>{kit.scale}</span>
                    <span style={{fontSize:"0.7rem",color:"#c8ddf5"}}>{kit.name}</span>
                    <span style={{fontSize:"0.55rem",color:"#2a4060"}}>#{kit.id}</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button style={{background:"rgba(0,170,255,0.08)",border:"1px solid rgba(0,170,255,0.3)",color:"#00aaff",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",padding:"4px 10px",cursor:"pointer",letterSpacing:"1px"}}
                      onClick={()=>startEdit(kit)}>
                      ✎ EDIT
                    </button>
                    <button style={{background:"rgba(255,34,68,0.08)",border:"1px solid rgba(255,34,68,0.3)",color:"#ff2244",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",padding:"4px 10px",cursor:"pointer",letterSpacing:"1px"}}
                      onClick={()=>setConfirmDelete({type:"kit",id:kit.id,label:`${kit.grade} · ${kit.scale} · ${kit.name} (kit #${kit.id} + ${kit.manuals.length} manual${kit.manuals.length!==1?"s":""})`})}>
                      ✕ DELETE KIT
                    </button>
                  </div>
                </div>
                {kit.manuals.map(m => (
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0 6px 12px",borderTop:"1px solid #111a2a",flexWrap:"wrap"}}>
                    <span style={{...S.pdfBadge,fontSize:"0.5rem",padding:"1px 4px",border:"1px solid #1a2f50"}}>PDF</span>
                    <span style={{fontSize:"0.65rem",color:"#c8ddf5",minWidth:80}}>{m.name}</span>
                    <span style={{fontSize:"0.55rem",color:"#5a7a9f"}}>{m.lang} · {m.pages||"?"} pgs</span>
                    <span style={{fontSize:"0.5rem",color:"#2a4060",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={m.url}>{m.url?.length>50?"..."+m.url.slice(-47):m.url}</span>
                    <button style={{background:"none",border:"1px solid rgba(255,34,68,0.2)",color:"#ff2244",cursor:"pointer",fontSize:"0.65rem",padding:"2px 8px",opacity:0.6}}
                      onClick={()=>setConfirmDelete({type:"manual",id:m.id,label:`"${m.name}" from ${kit.grade} ${kit.name} (manual #${m.id})`})}>
                      ✕
                    </button>
                  </div>
                ))}
                {kit.manuals.length===0&&<div style={{...S.note,padding:"8px 0 0 36px",opacity:0.4}}>No manuals — consider deleting this empty kit</div>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared style tokens ──────────────────────────────────────
const S = {
  page: { maxWidth:860, margin:"0 auto", padding:"0 24px 80px", fontFamily:"'Share Tech Mono',monospace" },
  tag: { fontSize:"0.6rem", letterSpacing:"3px", color:"#00aaff", marginBottom:10, opacity:0.8 },
  title: { fontSize:"2.4rem", fontFamily:"'Orbitron',monospace", fontWeight:700, letterSpacing:"4px", color:"#e8f4ff", marginBottom:10 },
  sub: { fontSize:"0.65rem", letterSpacing:"2px", color:"#5a7a9f" },
  section: { marginBottom:40, border:"1px solid #1a2f50", background:"#0a1220", padding:24 },
  sectionTitle: { fontSize:"0.65rem", letterSpacing:"3px", color:"#00aaff", marginBottom:20 },
  note: { fontSize:"0.65rem", color:"#5a7a9f", letterSpacing:"0.5px", lineHeight:2, marginBottom:12 },
  code: { color:"#00ffcc", background:"rgba(0,255,204,0.08)", padding:"2px 6px", fontFamily:"'Share Tech Mono',monospace" },
  input: { width:"100%", padding:"12px 16px", background:"#080c12", border:"1px solid #1a2f50", color:"#c8ddf5", fontFamily:"'Share Tech Mono',monospace", fontSize:"0.75rem", letterSpacing:"2px", outline:"none", marginBottom:8, boxSizing:"border-box" },
  btnPrimary: { width:"100%", padding:12, background:"rgba(0,170,255,0.1)", border:"1px solid #00aaff", color:"#00aaff", fontFamily:"'Share Tech Mono',monospace", fontSize:"0.75rem", letterSpacing:"2px", cursor:"pointer" },
  pdfBadge: { fontSize:"0.55rem", color:"#00aaff", border:"1px solid #00aaff", padding:"2px 5px", letterSpacing:"1px", flexShrink:0 },
  dropZone: { border:"2px dashed #1a2f50", padding:"48px 24px", textAlign:"center", cursor:"pointer", transition:"all 0.2s", background:"rgba(0,170,255,0.02)" },
  authWrap: { minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center" },
  authBox: { border:"1px solid #1a2f50", background:"#0a1220", padding:40, width:"100%", maxWidth:380, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:12 },
  authTitle: { fontFamily:"'Orbitron',monospace", fontSize:"1.1rem", letterSpacing:"4px", color:"#e8f4ff" },
  authSub: { fontSize:"0.6rem", letterSpacing:"2px", color:"#5a7a9f", marginBottom:8 },
};
