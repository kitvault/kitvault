// ─────────────────────────────────────────────────────────────
// AdminUpload.jsx
// Password-protected admin page for uploading new PDF manuals.
// On upload the Worker parses the filename, stores the PDF in
// R2, and creates the kit entry in D1 automatically.
//
// Route: /admin  (add this to App.jsx — see bottom of this file)
// ─────────────────────────────────────────────────────────────
import { useState, useRef, useCallback } from "react";

// ── Naming convention reminder shown on the page ─────────────
const NAMING_EXAMPLES = [
  { filename: "hg-144-rx78-2-gundam-assembly.pdf",      result: "HG · 1/144 · Rx78 2 Gundam" },
  { filename: "mg-100-unicorn-gundam-assembly.pdf",      result: "MG · 1/100 · Unicorn Gundam" },
  { filename: "rg-144-strike-freedom-assembly.pdf",      result: "RG · 1/144 · Strike Freedom" },
  { filename: "pg-60-rx-78-2-gundam-assembly.pdf",       result: "PG · 1/60 · Rx 78 2 Gundam" },
  { filename: "sd-unk-zeromaru-assembly.pdf",            result: "SD · SD · Zeromaru" },
  { filename: "eg-144-strike-gundam-assembly.pdf",       result: "EG · 1/144 · Strike Gundam" },
];

const ADMIN_KEY_STORAGE = "kv_admin_key";

export default function AdminUpload() {
  const [adminKey, setAdminKeyState] = useState(
    () => sessionStorage.getItem(ADMIN_KEY_STORAGE) || ""
  );
  const [isAuthed, setIsAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");

  const [files, setFiles] = useState([]);       // queued files
  const [results, setResults] = useState([]);   // upload results
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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

  // ── File selection ─────────────────────────────────────────
  const addFiles = useCallback((incoming) => {
    const pdfs = Array.from(incoming).filter(f => f.name.endsWith(".pdf"));
    if (pdfs.length === 0) return;
    setFiles(prev => {
      const names = new Set(prev.map(f => f.name));
      return [...prev, ...pdfs.filter(f => !names.has(f.name))];
    });
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

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
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "X-Admin-Key": adminKey },
          body: fd,
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          newResults.push({
            filename: file.name,
            status: "success",
            kitCreated: data.kitCreated,
            kit: data.kit,
            reason: data.reason,
          });
        } else {
          newResults.push({
            filename: file.name,
            status: "error",
            message: data.error || "Unknown error",
          });
        }
      } catch (err) {
        newResults.push({
          filename: file.name,
          status: "error",
          message: err.message,
        });
      }

      setResults([...newResults]);
    }

    setFiles([]);
    setUploading(false);
  };

  // ── Auth gate ──────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <div style={styles.authWrap}>
        <div style={styles.authBox}>
          <div style={styles.authIcon}>🔒</div>
          <div style={styles.authTitle}>ADMIN ACCESS</div>
          <div style={styles.authSub}>KITVAULT.IO — MANUAL UPLOAD</div>
          <form onSubmit={handleAuth} style={{width:"100%"}}>
            <input
              type="password"
              placeholder="ENTER ADMIN KEY"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              style={styles.keyInput}
              autoFocus
            />
            {keyError && <div style={styles.errorMsg}>{keyError}</div>}
            <button type="submit" style={styles.authBtn}>UNLOCK →</button>
          </form>
        </div>
      </div>
    );
  }

  // ── Upload UI ──────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerTag}>◈ ADMIN PANEL</div>
        <div style={styles.headerTitle}>MANUAL UPLOAD</div>
        <div style={styles.headerSub}>PDF FILES ARE AUTO-PARSED AND ADDED TO THE KIT LIBRARY</div>
      </div>

      {/* NAMING CONVENTION */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>◈ FILENAME FORMAT</div>
        <div style={styles.conventionNote}>
          Files must follow this pattern: <code style={styles.code}>{"{grade}-{scale}-{kit-name}-assembly.pdf"}</code>
        </div>
        <div style={styles.exampleGrid}>
          {NAMING_EXAMPLES.map(ex => (
            <div key={ex.filename} style={styles.exampleRow}>
              <code style={styles.exFilename}>{ex.filename}</code>
              <span style={styles.exArrow}>→</span>
              <span style={styles.exResult}>{ex.result}</span>
            </div>
          ))}
        </div>
        <div style={styles.conventionNote}>
          Valid grades: <strong>hg · mg · rg · pg · sd · eg</strong> &nbsp;|&nbsp;
          Scale: <strong>144 · 100 · 60 · unk</strong> &nbsp;|&nbsp;
          Always end with: <strong>-assembly.pdf</strong>
        </div>
      </div>

      {/* DROP ZONE */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>◈ SELECT FILES</div>
        <div
          style={{...styles.dropZone, ...(dragOver ? styles.dropZoneActive : {})}}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={styles.dropIcon}>📂</div>
          <div style={styles.dropText}>DRAG & DROP PDF FILES HERE</div>
          <div style={styles.dropSub}>or click to browse</div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            style={{display:"none"}}
            onChange={e => addFiles(e.target.files)}
          />
        </div>

        {/* QUEUED FILES */}
        {files.length > 0 && (
          <div style={styles.queueWrap}>
            <div style={styles.queueHeader}>
              {files.length} FILE{files.length !== 1 ? "S" : ""} QUEUED
            </div>
            {files.map(f => (
              <div key={f.name} style={styles.queueRow}>
                <span style={styles.queueIcon}>PDF</span>
                <span style={styles.queueName}>{f.name}</span>
                <span style={styles.queueSize}>{(f.size / 1024).toFixed(0)} KB</span>
                <button style={styles.removeBtn} onClick={() => removeFile(f.name)}>✕</button>
              </div>
            ))}
            <button
              style={{...styles.uploadBtn, ...(uploading ? styles.uploadBtnDisabled : {})}}
              onClick={uploadAll}
              disabled={uploading}
            >
              {uploading ? "UPLOADING..." : `UPLOAD ${files.length} FILE${files.length !== 1 ? "S" : ""} →`}
            </button>
          </div>
        )}
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>◈ UPLOAD RESULTS</div>
          {results.map(r => (
            <div key={r.filename} style={{
              ...styles.resultRow,
              borderColor: r.status === "success" ? "rgba(0,255,136,0.3)" : "rgba(255,34,68,0.3)",
              background:  r.status === "success" ? "rgba(0,255,136,0.05)" : "rgba(255,34,68,0.05)",
            }}>
              <div style={styles.resultTop}>
                <span style={{...styles.resultStatus, color: r.status === "success" ? "var(--green, #00ff88)" : "var(--red, #ff2244)"}}>
                  {r.status === "success" ? "✓" : "✕"}
                </span>
                <code style={styles.resultFilename}>{r.filename}</code>
              </div>
              {r.status === "success" && r.kitCreated && r.kit && (
                <div style={styles.resultDetail}>
                  Kit created: <strong>{r.kit.grade} · {r.kit.scale} · {r.kit.name}</strong>
                </div>
              )}
              {r.status === "success" && !r.kitCreated && (
                <div style={{...styles.resultDetail, color:"#ffcc00"}}>
                  ⚠ PDF uploaded but kit not created — {r.reason}
                </div>
              )}
              {r.status === "error" && (
                <div style={{...styles.resultDetail, color:"#ff2244"}}>
                  Error: {r.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES (inline — no extra CSS file needed)
// ─────────────────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: 860, margin: "0 auto", padding: "0 24px 80px",
    fontFamily: "'Share Tech Mono', monospace",
  },
  header: {
    padding: "60px 0 40px", textAlign: "center",
  },
  headerTag: {
    fontSize: "0.6rem", letterSpacing: "3px", color: "#00aaff",
    marginBottom: 10, opacity: 0.8,
  },
  headerTitle: {
    fontSize: "2.4rem", fontFamily: "'Orbitron', monospace",
    fontWeight: 700, letterSpacing: "4px", color: "#e8f4ff",
    marginBottom: 10,
  },
  headerSub: {
    fontSize: "0.65rem", letterSpacing: "2px", color: "#5a7a9f",
  },
  section: {
    marginBottom: 40, border: "1px solid #1a2f50",
    background: "#0a1220", padding: 24,
  },
  sectionTitle: {
    fontSize: "0.65rem", letterSpacing: "3px", color: "#00aaff",
    marginBottom: 20,
  },
  conventionNote: {
    fontSize: "0.65rem", color: "#5a7a9f", letterSpacing: "0.5px",
    lineHeight: 2, marginBottom: 12,
  },
  code: {
    color: "#00ffcc", background: "rgba(0,255,204,0.08)",
    padding: "2px 6px", fontFamily: "'Share Tech Mono', monospace",
  },
  exampleGrid: {
    display: "flex", flexDirection: "column", gap: 8, marginBottom: 16,
  },
  exampleRow: {
    display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
  },
  exFilename: {
    color: "#c8ddf5", fontSize: "0.65rem",
    fontFamily: "'Share Tech Mono', monospace",
  },
  exArrow: { color: "#5a7a9f", fontSize: "0.7rem" },
  exResult: { color: "#00ffcc", fontSize: "0.65rem", letterSpacing: "1px" },

  dropZone: {
    border: "2px dashed #1a2f50", padding: "48px 24px",
    textAlign: "center", cursor: "pointer",
    transition: "all 0.2s", background: "rgba(0,170,255,0.02)",
  },
  dropZoneActive: {
    borderColor: "#00aaff", background: "rgba(0,170,255,0.08)",
  },
  dropIcon: { fontSize: "2.4rem", marginBottom: 12 },
  dropText: {
    fontSize: "0.75rem", letterSpacing: "3px", color: "#c8ddf5",
    marginBottom: 8,
  },
  dropSub: { fontSize: "0.6rem", color: "#5a7a9f", letterSpacing: "1px" },

  queueWrap: { marginTop: 20 },
  queueHeader: {
    fontSize: "0.6rem", letterSpacing: "2px", color: "#5a7a9f",
    marginBottom: 10,
  },
  queueRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 0", borderBottom: "1px solid #1a2f50",
  },
  queueIcon: {
    fontSize: "0.55rem", color: "#00aaff", border: "1px solid #00aaff",
    padding: "2px 5px", letterSpacing: "1px", flexShrink: 0,
  },
  queueName: {
    flex: 1, fontSize: "0.65rem", color: "#c8ddf5",
    fontFamily: "'Share Tech Mono', monospace", wordBreak: "break-all",
  },
  queueSize: { fontSize: "0.6rem", color: "#5a7a9f", flexShrink: 0 },
  removeBtn: {
    background: "none", border: "none", color: "#5a7a9f",
    cursor: "pointer", fontSize: "0.75rem", padding: "0 4px",
    flexShrink: 0,
  },

  uploadBtn: {
    marginTop: 16, width: "100%", padding: "14px",
    background: "rgba(0,170,255,0.1)", border: "1px solid #00aaff",
    color: "#00aaff", fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.75rem", letterSpacing: "2px", cursor: "pointer",
    transition: "all 0.2s",
  },
  uploadBtnDisabled: {
    opacity: 0.5, cursor: "not-allowed",
  },

  resultRow: {
    border: "1px solid", padding: 16, marginBottom: 10,
  },
  resultTop: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 6,
  },
  resultStatus: { fontSize: "1rem", fontWeight: 700 },
  resultFilename: {
    fontSize: "0.65rem", color: "#c8ddf5",
    fontFamily: "'Share Tech Mono', monospace",
  },
  resultDetail: {
    fontSize: "0.6rem", color: "#5a7a9f",
    letterSpacing: "0.5px", lineHeight: 1.8, marginLeft: 24,
  },

  // Auth screen
  authWrap: {
    minHeight: "80vh", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  authBox: {
    border: "1px solid #1a2f50", background: "#0a1220",
    padding: 40, width: "100%", maxWidth: 380, textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
  },
  authIcon: { fontSize: "2rem", marginBottom: 4 },
  authTitle: {
    fontFamily: "'Orbitron', monospace", fontSize: "1.1rem",
    letterSpacing: "4px", color: "#e8f4ff",
  },
  authSub: {
    fontSize: "0.6rem", letterSpacing: "2px", color: "#5a7a9f", marginBottom: 8,
  },
  keyInput: {
    width: "100%", padding: "12px 16px",
    background: "#080c12", border: "1px solid #1a2f50",
    color: "#c8ddf5", fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.75rem", letterSpacing: "2px", outline: "none",
    marginBottom: 8, boxSizing: "border-box",
  },
  authBtn: {
    width: "100%", padding: "12px",
    background: "rgba(0,170,255,0.1)", border: "1px solid #00aaff",
    color: "#00aaff", fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.75rem", letterSpacing: "2px", cursor: "pointer",
  },
  errorMsg: {
    fontSize: "0.6rem", color: "#ff2244",
    letterSpacing: "1px", marginBottom: 8,
  },
};
