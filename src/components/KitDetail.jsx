// ─────────────────────────────────────────────────────────────
// KitDetail.jsx
// Full kit detail page including manual viewer, build status,
// XP progress bar, and Amazon affiliate banner.
//
// PDF rendering: uses PDF.js (loaded via <script> tag, not ESM
// dynamic import) to render every page as a <canvas> element.
// This works on iOS Safari, Android, and all desktop browsers.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { R2, AMAZON_URLS, GRADE_COLORS, loadPdfJs } from "../data/grades.js";
import { findKitBySlug, xpColors } from "../data/grades.js";
import PdfFullscreenModal from "./PdfFullscreenModal.jsx";

const gc = (g) => GRADE_COLORS[g] || GRADE_COLORS["HG"];

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
  const [status,   setStatus]   = useState("loading"); // loading | ready | error
  const [errMsg,   setErrMsg]   = useState("");
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);

  // Measure container so canvases fill available width
  useEffect(() => {
    if (!wrapRef.current) return;
    const measure = () => setWidth(wrapRef.current?.clientWidth || 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Load the PDF document
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
        width: "100%",
        background: "#111",
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        maxHeight: "75vh",
        boxSizing: "border-box",
        padding: "8px",
      }}
    >
      {/* Loading */}
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

      {/* Error */}
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
          <a
            href={url} target="_blank" rel="noopener noreferrer"
            style={{
              color: "var(--accent,#00aaff)", fontSize: "0.7rem", letterSpacing: "1px",
              border: "1px solid var(--accent,#00aaff)", padding: "8px 20px",
              textDecoration: "none", background: "rgba(0,170,255,0.08)",
            }}
          >
            ↗ OPEN PDF IN BROWSER
          </a>
          <div style={{ fontSize: "0.58rem", color: "#444", maxWidth: "260px" }}>
            If this keeps failing, CORS may not be enabled on your R2 bucket.
          </div>
        </div>
      )}

      {/* All pages rendered as canvases */}
      {status === "ready" && pdf && width > 0 &&
        Array.from({ length: numPages }, (_, i) => (
          <PdfPage key={i + 1} pdf={pdf} pageNum={i + 1} width={width} />
        ))
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KitDetail — main export
// ─────────────────────────────────────────────────────────────
export default function KitDetail({
  isSignedIn,
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
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const kit = findKitBySlug(slug);

  const [realPages,       setRealPages]       = useState({});
  const [fullscreenManual,setFullscreenManual] = useState(null);
  const [dlNotifyId,      setDlNotifyId]       = useState(null);

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
      const doc = await lib.getDocument(`${R2}/${manual.url}`).promise;
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

  return (
    <>
      <button className="back-btn" onClick={() => navigate(-1)}>← BACK TO LIBRARY</button>

      <div className="kit-detail-header">
        <div className="detail-grade" style={{color:gc(kit.grade).accent}}>{kit.grade} GRADE — {kit.scale}</div>
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
              {id:"backlog",    label:"◻ BACKLOG"},
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

      {/* ── XP PROGRESS BAR ─────────────────────────────────── */}
      {isSignedIn && kit.manuals.some(m => m.url) && (() => {
        const manualRows = kit.manuals.filter(m => m.url).map(m => {
          const key     = `${kit.id}-${m.id}`;
          const total   = realPages[m.id];
          const current = Math.min(pageProgress[key]?.current || 0, total || 0);
          return { m, key, total, current };
        });
        const hasAnyTotal    = manualRows.some(r => r.total > 0);
        const overallTotal   = manualRows.reduce((s, r) => s + (r.total   || 0), 0);
        const overallCurrent = manualRows.reduce((s, r) => s + r.current, 0);
        const overallPct     = overallTotal > 0 ? Math.round((overallCurrent / overallTotal) * 100) : 0;
        const colors  = xpColors(overallPct);
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
                const pct       = total > 0 ? Math.round((current / total) * 100) : 0;
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
                    /*
                     * PDF.js canvas renderer — replaces the old <iframe>.
                     * Renders ALL pages. Works on iOS, Android, and desktop.
                     * Only mounts when the dropdown is actually open so we
                     * don't load PDFs until the user requests them.
                     */
                    openManualId === manual.id && (
                      <PdfViewer
                        url={`${R2}/${manual.url}`}
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

      {fullscreenManual && (
        <PdfFullscreenModal manual={fullscreenManual} onClose={() => setFullscreenManual(null)} />
      )}
    </>
  );
}
