// ─────────────────────────────────────────────────────────────
// App.jsx  — KitVault.io
// This file is now ~200 lines. All data lives in src/data/.
// Components will be split further in future steps.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";

// Styles — extracted from the inline <style> tag
import "./styles/app.css";

// Data & constants
import { KITS } from "./data/kits.js";
import {
  R2, VERSION, AMAZON_URLS,
  GRADE_COLORS, GRADES,
  slugify, findKitBySlug, xpColors,
  GRADE_DATA, GRADE_ORDER,
  TOOL_ORDER, loadPdfJs,
} from "./data/grades.js";

import AdminUpload from "./components/AdminUpload.jsx";

// ─────────────────────────────────────────────────────────────
// DEBOUNCE HOOK
// ─────────────────────────────────────────────────────────────
function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}


// ─────────────────────────────────────────────────────────────
// GRADE NAV ROW
// ─────────────────────────────────────────────────────────────
function GradeNavRow({ gradeSlug, navigate }) {
  const currentIdx = GRADE_ORDER.indexOf(gradeSlug);
  const prevSlug = GRADE_ORDER[(currentIdx - 1 + GRADE_ORDER.length) % GRADE_ORDER.length];
  const nextSlug = GRADE_ORDER[(currentIdx + 1) % GRADE_ORDER.length];
  const prevG = GRADE_DATA[prevSlug];
  const nextG = GRADE_DATA[nextSlug];
  return (
    <div className="grade-nav-row">
      <button className="grade-nav-btn prev" onClick={() => navigate(`/grade/${prevSlug}`)}>
        <span>←</span>
        <span>
          <span style={{display:"block",fontSize:"0.55rem",opacity:0.6,marginBottom:"2px"}}>PREVIOUS</span>
          <span className="grade-nav-label" style={{color: prevG.color}}>{prevG.abbr} — {prevG.name}</span>
        </span>
      </button>
      <span className="grade-nav-center">GRADE {currentIdx + 1} OF {GRADE_ORDER.length}</span>
      <button className="grade-nav-btn next" onClick={() => navigate(`/grade/${nextSlug}`)}>
        <span>
          <span style={{display:"block",fontSize:"0.55rem",opacity:0.6,marginBottom:"2px",textAlign:"right"}}>NEXT</span>
          <span className="grade-nav-label" style={{color: nextG.color}}>{nextG.abbr} — {nextG.name}</span>
        </span>
        <span>→</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GRADE DETAIL PAGE
// ─────────────────────────────────────────────────────────────
function GradeDetail({ setGradeFilter }) {
  const { gradeSlug } = useParams();
  const navigate = useNavigate();
  const g = GRADE_DATA[gradeSlug];

  if (!g) return (
    <div style={{padding:"80px 40px",textAlign:"center",fontFamily:"'Share Tech Mono',monospace",color:"var(--text-dim)"}}>
      <div style={{fontSize:"3rem",marginBottom:"16px",opacity:0.3}}>404</div>
      <div style={{letterSpacing:"2px",marginBottom:"24px"}}>GRADE NOT FOUND</div>
      <button className="back-btn" style={{margin:"0 auto"}} onClick={() => navigate("/")}>← BACK TO LIBRARY</button>
    </div>
  );
  return (
    <>
      <GradeNavRow gradeSlug={gradeSlug} navigate={navigate} />
      <div style={{"--grade-color": g.color}}>
        <div className="grade-page-hero">
          <div className="grade-page-tag" style={{color:g.color}}>◈ GRADE GUIDE — {g.abbr}</div>
          <div className="grade-page-title" style={{color:g.color}}>{g.abbr}</div>
          <div className="grade-page-sub">{g.name.toUpperCase()} — {g.tagline}</div>
          <div className="grade-page-badge">{g.abbr} — {g.name.toUpperCase()} — SCALE {g.scale}</div>
          <div className="grade-stat-row" style={{justifyContent:"center",marginTop:"28px"}}>
            {g.stats.map(s => (
              <div key={s.lbl} className="grade-stat">
                <div className="grade-stat-val" style={{color:g.color}}>{s.val}</div>
                <div className="grade-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grade-page">
          <div className="grade-section">
            <div className="grade-section-title">◈ OVERVIEW</div>
            <div className="grade-section-body" dangerouslySetInnerHTML={{__html: g.intro}} />
          </div>
          {g.sections.map(s => (
            <div key={s.title} className="grade-section">
              <div className="grade-section-title">{s.title}</div>
              <div className="grade-section-body" dangerouslySetInnerHTML={{__html: s.body}} />
            </div>
          ))}
          <div style={{textAlign:"center",marginTop:"24px"}}>
            <button className="grade-kits-link" onClick={() => { setGradeFilter(g.abbr); navigate("/"); }}>
              VIEW ALL {g.abbr} KITS IN THE LIBRARY →
            </button>
          </div>
        </div>
        <GradeNavRow gradeSlug={gradeSlug} navigate={navigate} />
        <div style={{height:"40px"}} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// TOOL NAV ROW
// ─────────────────────────────────────────────────────────────
function ToolNavRow() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIdx = TOOL_ORDER.findIndex(t => t.route === location.pathname);
  if (currentIdx === -1) return null;
  const prevTool = TOOL_ORDER[(currentIdx - 1 + TOOL_ORDER.length) % TOOL_ORDER.length];
  const nextTool = TOOL_ORDER[(currentIdx + 1) % TOOL_ORDER.length];
  return (
    <div className="grade-nav-row">
      <button className="grade-nav-btn prev" onClick={() => navigate(prevTool.route)}>
        <span>←</span>
        <span>
          <span style={{display:"block",fontSize:"0.55rem",opacity:0.6,marginBottom:"2px"}}>PREVIOUS</span>
          <span className="grade-nav-label" style={{color: prevTool.color}}>{prevTool.label}</span>
        </span>
      </button>
      <span className="grade-nav-center">TOOL {currentIdx + 1} OF {TOOL_ORDER.length}</span>
      <button className="grade-nav-btn next" onClick={() => navigate(nextTool.route)}>
        <span>
          <span style={{display:"block",fontSize:"0.55rem",opacity:0.6,marginBottom:"2px",textAlign:"right"}}>NEXT</span>
          <span className="grade-nav-label" style={{color: nextTool.color}}>{nextTool.label}</span>
        </span>
        <span>→</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PdfPage — renders one PDF page onto a <canvas>
// ─────────────────────────────────────────────────────────────
function PdfPage({ pdf, pageNum, width }) {
  const canvasRef = useRef(null);
  const renderRef = useRef(null);

  useEffect(() => {
    if (!pdf || !width || !canvasRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        if (renderRef.current) { renderRef.current.cancel(); renderRef.current = null; }
        const page = await pdf.getPage(pageNum);
        if (cancelled) return;
        const baseVp = page.getViewport({ scale: 1 });
        const scale = width / baseVp.width;
        const vp = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(vp.width * dpr);
        canvas.height = Math.floor(vp.height * dpr);
        canvas.style.width = `${vp.width}px`;
        canvas.style.height = `${vp.height}px`;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        renderRef.current = page.render({ canvasContext: ctx, viewport: vp });
        await renderRef.current.promise;
      } catch (e) {
        if (e?.name !== "RenderingCancelledException") console.warn("PDF page render:", e);
      }
    })();

    return () => {
      cancelled = true;
      if (renderRef.current) { renderRef.current.cancel(); renderRef.current = null; }
    };
  }, [pdf, pageNum, width]);

  return <canvas ref={canvasRef} style={{ display: "block", background: "#fff", marginBottom: "4px", maxWidth: "100%" }} />;
}

// ─────────────────────────────────────────────────────────────
// PdfViewer — loads a PDF via pdfjs-dist, renders all pages
// ─────────────────────────────────────────────────────────────
function PdfViewer({ url, onPageCount }) {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("loading");
  const [errMsg, setErrMsg] = useState("");
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!wrapRef.current) return;
    const measure = () => setWidth(wrapRef.current?.clientWidth - 16 || 0);
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
        const lib = await loadPdfJs();
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
    <div ref={wrapRef} style={{
      width: "100%", background: "#111", overflowY: "auto", overflowX: "hidden",
      WebkitOverflowScrolling: "touch", maxHeight: "75vh", padding: "8px",
    }}>
      {status === "loading" && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "220px", gap: "14px",
          fontFamily: "'Share Tech Mono',monospace", color: "var(--text-dim)",
        }}>
          <style>{`@keyframes kvspin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ fontSize: "2rem", animation: "kvspin 1.2s linear infinite", color: "var(--accent)" }}>◈</div>
          <div style={{ fontSize: "0.7rem", letterSpacing: "2px" }}>
            {progress > 0 ? `LOADING — ${progress}%` : "LOADING MANUAL..."}
          </div>
        </div>
      )}
      {status === "error" && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "180px", gap: "14px",
          fontFamily: "'Share Tech Mono',monospace", color: "var(--text-dim)",
          textAlign: "center", padding: "24px",
        }}>
          <div style={{ fontSize: "2rem" }}>⚠</div>
          <div style={{ fontSize: "0.72rem", letterSpacing: "2px" }}>FAILED TO LOAD MANUAL</div>
          <div style={{ fontSize: "0.6rem", color: "#555", maxWidth: "280px" }}>{errMsg}</div>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{
            color: "var(--accent)", fontSize: "0.7rem", letterSpacing: "1px",
            border: "1px solid var(--accent)", padding: "8px 20px",
            textDecoration: "none", background: "rgba(0,170,255,0.08)",
          }}>↗ OPEN PDF IN BROWSER</a>
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
// KIT DETAIL PAGE
// ─────────────────────────────────────────────────────────────
function KitDetail({ gc, isSignedIn, favourites, buildProgress, pageProgress, toggleFavourite, setBuildStatus, setManualPage, openManualId, toggleManual, setOpenManualId, goHome }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const kit = findKitBySlug(slug);

  // Real page counts fetched from actual PDF via pdfjs
  const [realPages, setRealPages] = useState({});
  const [fullscreenManual, setFullscreenManual] = useState(null);
  const [dlNotifyId, setDlNotifyId] = useState(null);

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
      const pdf = await lib.getDocument({ url: `${R2}/${manual.url}`, withCredentials: false }).promise;
      const count = pdf.numPages;
      localStorage.setItem(cacheKey, String(count));
      setRealPages(prev => ({ ...prev, [manual.id]: count }));
    } catch (_) { /* silently ignore, falls back to manual.pages */ }
  };

  // Auto-fetch real page counts for all manuals with a URL as soon as kit loads
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
        // Compute overall progress across all manuals with real page data
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

        // 10 segments for the XP track
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
                            const val = Math.max(0, parseInt(e.target.value) || 0);
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
                    <button className="pdf-dropdown-close" onClick={e => { e.stopPropagation(); setOpenManualId(null); }}>✕</button>
                  </div>
                </div>
                <div className="pdf-frame-wrap">
                  {manual.url ? (
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

      <div className="kit-image-section">
        <div className="kit-image-wrap" style={{"--ki-accent": gc(kit.grade).accent}}>
          {kit.imageUrl ? (
            <>
              <img className="kit-image" src={kit.imageUrl} alt={`${kit.name} — ${kit.grade} ${kit.scale}`}
                onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
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

// ─────────────────────────────────────────────────────────────
// PDF FULLSCREEN MODAL
// ─────────────────────────────────────────────────────────────
function PdfFullscreenModal({ manual, onClose }) {
  const pdfUrl = `${R2}/${manual.url}`;
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("loading");
  const [errMsg, setErrMsg] = useState("");
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => setWidth(containerRef.current?.clientWidth - 24 || 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let dead = false;
    setStatus("loading"); setProgress(0); setPdf(null); setNumPages(0);
    (async () => {
      try {
        const lib = await loadPdfJs();
        const task = lib.getDocument({ url: pdfUrl, withCredentials: false });
        task.onProgress = ({ loaded, total }) => { if (total) setProgress(Math.round((loaded / total) * 100)); };
        const doc = await task.promise;
        if (dead) return;
        setPdf(doc); setNumPages(doc.numPages); setStatus("ready");
      } catch (e) {
        if (dead) return;
        setErrMsg(e?.message || "Failed to load PDF"); setStatus("error");
      }
    })();
    return () => { dead = true; };
  }, [pdfUrl]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="pdf-fullscreen-overlay">
      <div className="pdf-fullscreen-header">
        <span className="pdf-fullscreen-title">
          ◈ {manual.name.toUpperCase()}
          {numPages > 0 && <span style={{ opacity: 0.45, fontSize: "0.7em", marginLeft: 10 }}>{numPages} PGS</span>}
        </span>
        <div className="pdf-fullscreen-actions">
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
            letterSpacing: "1px", color: "var(--accent)",
            border: "1px solid var(--accent)", padding: "6px 12px",
            background: "rgba(0,170,255,0.08)", textDecoration: "none", whiteSpace: "nowrap",
          }}>↓ DOWNLOAD</a>
          <button className="pdf-fullscreen-close" onClick={onClose}>✕ CLOSE</button>
        </div>
      </div>
      <div ref={containerRef} style={{
        flex: 1, overflowY: "scroll", overflowX: "hidden",
        WebkitOverflowScrolling: "touch", padding: "12px",
      }}>
        {status === "loading" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", minHeight: "60vh", gap: 16,
            fontFamily: "'Share Tech Mono',monospace", color: "var(--text-dim)",
          }}>
            <style>{`@keyframes kvfspin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ fontSize: "2.5rem", animation: "kvfspin 1.2s linear infinite", color: "var(--accent)" }}>◈</div>
            <div style={{ fontSize: "0.75rem", letterSpacing: "2px" }}>
              {progress > 0 ? `LOADING — ${progress}%` : "LOADING PDF..."}
            </div>
          </div>
        )}
        {status === "error" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", minHeight: "60vh", gap: 16,
            fontFamily: "'Share Tech Mono',monospace", color: "var(--text-dim)",
            textAlign: "center", padding: "32px",
          }}>
            <div style={{ fontSize: "2.5rem" }}>⚠</div>
            <div style={{ fontSize: "0.8rem", letterSpacing: "2px" }}>FAILED TO LOAD PDF</div>
            <div style={{ fontSize: "0.65rem", color: "#555", maxWidth: "300px" }}>{errMsg}</div>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{
              color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "1px",
              border: "1px solid var(--accent)", padding: "10px 24px",
              textDecoration: "none", background: "rgba(0,170,255,0.1)",
            }}>↗ OPEN IN BROWSER</a>
          </div>
        )}
        {status === "ready" && pdf && width > 0 &&
          Array.from({ length: numPages }, (_, i) => (
            <PdfPage key={i + 1} pdf={pdf} pageNum={i + 1} width={width} />
          ))
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KITVAULT APP — main component (routes + shared state)
// ─────────────────────────────────────────────────────────────
export default function KitVault() {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [openNav, setOpenNav] = useState(null);
  const toggleNav = (name) => setOpenNav(prev => prev === name ? null : name);
  const closeNav = () => setOpenNav(null);
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [openManualId, setOpenManualId] = useState(null);
  const toggleManual = (id) => setOpenManualId(prev => prev === id ? null : id);
  const [showSettings, setShowSettings] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [pdfOnly, setPdfOnly] = useState(true);
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_favourites") || "[]"); } catch { return []; }
  });
  const [buildProgress, setBuildProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_progress") || "{}"); } catch { return {}; }
  });
  const [pageProgress, setPageProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_pages") || "{}"); } catch { return {}; }
  });

  // ── D1 kits — merged with static list ────────────────────
  const [d1Kits, setD1Kits] = useState([]);
  useEffect(() => {
    fetch("/api/kits")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setD1Kits(data); })
      .catch(() => {}); // silent fallback to static list
  }, []);
  const allKits = useMemo(() => {
    const d1Ids = new Set(d1Kits.map(k => k.id));
    return [...KITS.filter(k => !d1Ids.has(k.id)), ...d1Kits];
  }, [d1Kits]);

  // ── D1 sync ──────────────────────────────────────────────────
  // Saves user data to Cloudflare D1 via a Worker API endpoint.
  // Falls back to localStorage silently if the worker isn't set up yet.
  const D1_API = "/api/progress"; // Cloudflare Worker endpoint (set up separately)

  const syncToD1 = useCallback(async (payload) => {
    if (!isSignedIn || !user) return;
    try {
      await fetch(D1_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...payload }),
      });
    } catch (_) { /* silent fallback to localStorage */ }
  }, [isSignedIn, user]);

  // Debounced version: used for rapid page-number input (fires 500ms after last keystroke)
  const syncToD1Debounced = useDebounce(syncToD1, 500);

  const loadFromD1 = useCallback(async () => {
    if (!isSignedIn || !user) return;
    try {
      const res = await fetch(`${D1_API}?userId=${user.id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.favourites) { setFavourites(data.favourites); localStorage.setItem("kv_favourites", JSON.stringify(data.favourites)); }
      if (data.progress)   { setBuildProgress(data.progress);  localStorage.setItem("kv_progress",   JSON.stringify(data.progress)); }
      if (data.pages)      { setPageProgress(data.pages);       localStorage.setItem("kv_pages",      JSON.stringify(data.pages)); }
    } catch (_) { /* silent fallback to localStorage */ }
  }, [isSignedIn, user]);

  // Depend on the stable memoized function — re-runs only when user signs in/out
  useEffect(() => { loadFromD1(); }, [loadFromD1]);



  const toggleFavourite = (e, kitId) => {
    e.stopPropagation();
    if (!isSignedIn) return;
    setFavourites(prev => {
      const next = prev.includes(kitId) ? prev.filter(id => id !== kitId) : [...prev, kitId];
      localStorage.setItem("kv_favourites", JSON.stringify(next));
      syncToD1({ favourites: next });
      return next;
    });
  };

  const setBuildStatus = (kitId, status) => {
    if (!isSignedIn) return;
    setBuildProgress(prev => {
      const next = { ...prev, [kitId]: status };
      localStorage.setItem("kv_progress", JSON.stringify(next));
      syncToD1({ progress: next });
      return next;
    });
  };

  const setManualPage = (kitId, manualId, currentPage, totalPages) => {
    if (!isSignedIn) return;
    setPageProgress(prev => {
      const key = `${kitId}-${manualId}`;
      const next = { ...prev, [key]: { current: currentPage, total: totalPages } };
      localStorage.setItem("kv_pages", JSON.stringify(next));
      // Debounced: won't fire until 500ms after the user stops typing/clicking
      syncToD1Debounced({ pages: next });
      return next;
    });
  };

  // Calculate overall kit progress % across all manuals
  const getKitProgress = (kit) => {
    const entries = kit.manuals.map(m => pageProgress[`${kit.id}-${m.id}`]).filter(Boolean);
    if (entries.length === 0) return null;
    const total = entries.reduce((sum, e) => sum + e.total, 0);
    const current = entries.reduce((sum, e) => sum + Math.min(e.current, e.total), 0);
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };



  // Memoized — only recalculates when filter/sort state changes, not on every render
  const filtered = useMemo(() => allKits.filter(k => {
    const hasPdf = k.manuals.some(m => m.url);
    const matchGrade = gradeFilter === "ALL" || k.grade === gradeFilter;
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase()) || k.series.toLowerCase().includes(search.toLowerCase());
    return (!pdfOnly || hasPdf) && matchGrade && matchSearch;
  }).sort((a, b) => {
    if (sortOrder === "az") return a.name.localeCompare(b.name);
    if (sortOrder === "za") return b.name.localeCompare(a.name);
    return a.id - b.id;
  }), [gradeFilter, search, pdfOnly, sortOrder]);

  const gc = (g) => GRADE_COLORS[g] || GRADE_COLORS["HG"];
  const goHome = () => { setOpenManualId(null); navigate("/"); };
  const goVault = () => { setOpenManualId(null); navigate("/vault"); };
  const goDisclaimer = () => { setOpenManualId(null); setShowSettings(false); navigate("/disclaimer"); };
  const goKit = (kit) => { setOpenManualId(null); navigate(`/kit/${slugify(kit)}`); };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      <div className="grid-bg" />
      <div className="app">

        {/* HEADER */}
        <header className="header" style={{position:"relative"}} onClick={e => { if(!e.target.closest('.nav-item')) closeNav(); }}>
          <div className="logo" onClick={goHome} style={{cursor:"pointer"}}>
            <div className="logo-icon">▣</div>
            <div className="logo-text">
              <span>KIT<span style={{color:"#ff6600"}}>VAULT</span></span>
              <span className="logo-sub">KITVAULT.IO</span>
            </div>
          </div>

          <div className="header-right">
            <div className="status-dot" />

            {/* ── NAV RIGHT ── */}
            <nav className="nav-right">

              {/* TOOLS */}
              <div className={`nav-item${openNav==="tools"?" open":""}`}>
                <button className="nav-btn" onClick={()=>toggleNav("tools")}>
                  TOOLS <span className="nav-btn-arrow">▼</span>
                </button>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">◈ HOBBY TOOLS</div>
                  {[
                    {icon:"✂️", label:"Nippers", sub:"Side cutters for clean gate removal. The most essential tool in your kit.", route:"/tools/nippers"},
                    {icon:"🔧", label:"Panel Line Markers", sub:"Gundam markers & enamel washes for detail lines", route:"/tools/panel-line-markers"},
                    {icon:"📐", label:"Scribers & Chisels", sub:"For adding custom panel lines and surface detail", route:"/tools/scribers"},
                    {icon:"🪵", label:"Sanding Sticks", sub:"400→1000→2000 grit for seamline removal & gate cleanup", route:"/tools/sanding"},
                    {icon:"🎨", label:"Paints & Primers", sub:"Mr. Color, Citadel, Vallejo and more. Airbrushing and hand painting.", route:"/tools/paints"},
                    {icon:"💨", label:"Airbrushes", sub:"Iwata, Badger, GSI Creos. Starter to pro setups covered.", route:"/tools/airbrushes"},
                    {icon:"🧴", label:"Top Coats", sub:"Gloss, semi-gloss, matte. Lock in your finish and protect your work.", route:"/tools/top-coats"},
                    {icon:"🪚", label:"Hobby Knives", sub:"Olfa & X-Acto knives for cleanup and minor modifications", route:"/tools/hobby-knives"},
                  ].map(item => (
                    <div key={item.label} className="nav-dd-item" onClick={() => { closeNav(); if(item.route) navigate(item.route); }}>
                      <span className="nav-dd-icon">{item.icon}</span>
                      <span className="nav-dd-text">
                        <span className="nav-dd-label">{item.label}{!item.route && <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.5rem",color:"var(--text-dim)",marginLeft:8,letterSpacing:1}}>SOON</span>}</span>
                        <span className="nav-dd-sub">{item.sub}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESOURCES */}
              <button className="nav-btn" onClick={() => { closeNav(); navigate("/resources"); }} style={{color: location.pathname==="/resources" ? "var(--accent)" : ""}}>
                RESOURCES
              </button>

              {/* GRADES */}
              <div className={`nav-item${openNav==="grades"?" open":""}`}>
                <button className="nav-btn" onClick={()=>toggleNav("grades")}>
                  GRADES <span className="nav-btn-arrow">▼</span>
                </button>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">◈ KIT GRADE GUIDE</div>
                  {[
                    {slug:"eg", label:"EG — Entry Grade", sub:"Snap-fit, no nippers needed. Perfect first kit", color:"#aa88ff"},
                    {slug:"hg", label:"HG — High Grade", sub:"1/144 scale. Best variety, great for beginners", color:"#00aaff"},
                    {slug:"rg", label:"RG — Real Grade", sub:"1/144 with MG-level detail. Advanced snap-fit", color:"#ff2244"},
                    {slug:"mg", label:"MG — Master Grade", sub:"1/100 scale with inner frame. Intermediate", color:"#ff6600"},
                    {slug:"pg", label:"PG — Perfect Grade", sub:"1/60 scale. The ultimate Gunpla experience", color:"#ffcc00"},
                    {slug:"sd", label:"SD — Super Deformed", sub:"Chibi-style, fun and quick builds for all levels", color:"#00ffcc"},
                  ].map(item => (
                    <div key={item.slug} className="nav-dd-item" onClick={() => { closeNav(); navigate(`/grade/${item.slug}`); }}>
                      <span className="nav-dd-text">
                        <span className="nav-dd-label" style={{color:item.color}}>{item.label}</span>
                        <span className="nav-dd-sub">{item.sub}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </nav>

            <SignedIn>
              <button
                onClick={goVault}
                style={{
                  background:"none", border:"1px solid var(--border)", color: location.pathname==="/vault" ? "var(--accent)" : "var(--text-dim)",
                  fontFamily:"'Share Tech Mono',monospace", fontSize:"0.65rem",
                  padding:"8px 14px", cursor:"pointer", letterSpacing:"1px", transition:"all 0.2s",
                  clipPath:"polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%)"
                }}
              >
                ⭐ MY VAULT
              </button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="auth-btn">LOG IN</button>
              </SignInButton>
            </SignedOut>
            <button className={`cog-btn ${showSettings?"active":""}`} onClick={() => setShowSettings(true)} title="Settings">⚙</button>
          </div>
        </header>

        <Routes>

          {/* ===== HOME PAGE ===== */}
          <Route path="/" element={
            <>
              <section className="hero">
                <div className="hero-tag">GUNDAM MANUAL ARCHIVE</div>
                <h1><span className="a1">KIT</span><span className="a2">VAULT</span></h1>
                <p className="hero-sub">YOUR COMPLETE GUNPLA MANUAL DATABASE</p>

              </section>

              <div className="controls">
                <div className="controls-row">
                  <div className="search-wrap">
                    <span className="search-icon">⌕</span>
                    <input className="search-input" placeholder="SEARCH KITS OR SERIES..." value={search} onChange={e=>setSearch(e.target.value)} />
                  </div>
                  <div className={`pdf-toggle ${pdfOnly?"on":""}`} onClick={()=>setPdfOnly(p=>!p)}>
                    <div className="pdf-toggle-box">{pdfOnly?"✓":""}</div>
                    <span className="pdf-toggle-label">PDF AVAILABLE</span>
                  </div>
                </div>
                <div className="controls-row">
                  <span className="controls-label">GRADE</span>
                  {GRADES.map(g => (
                    <button key={g} className={`filter-btn ${gradeFilter===g?"active":""}`} onClick={()=>setGradeFilter(g)}>{g}</button>
                  ))}
                  <div className="filter-divider" />
                  <span className="controls-label">SORT</span>
                  <button className={`sort-btn ${sortOrder==="az"?"active":""}`} onClick={()=>setSortOrder(s=>s==="az"?"default":"az")}>A→Z</button>
                  <button className={`sort-btn ${sortOrder==="za"?"active":""}`} onClick={()=>setSortOrder(s=>s==="za"?"default":"za")}>Z→A</button>
                </div>
              </div>

              <div className="section-header">
                <span className="section-title">KIT LIBRARY</span>
                <div className="section-line" />
                <span className="section-count">{filtered.length} RESULTS</span>
              </div>

              <div className="kit-grid">
                {filtered.map(kit => {
                  const c = gc(kit.grade);
                  const isFav = favourites.includes(kit.id);
                  const progress = buildProgress[kit.id];
                  return (
                    <div key={kit.id} className="kit-card"
                      style={{"--card-accent":c.accent,"--card-accent-bg":c.bg}}
                      onClick={()=>goKit(kit)}
                    >
                      <div className="card-grade-banner" style={{background:c.accent}} />
                      <div className="card-body">
                        <div className="card-top">
                          <span className="grade-badge">{kit.grade}</span>
                          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                            {progress === "inprogress" && <span className="build-badge inprogress">IN PROGRESS</span>}
                            {progress === "complete" && <span className="build-badge complete">COMPLETE</span>}
                            <span className="manual-count">{kit.manuals.length} MANUAL{kit.manuals.length!==1?"S":""}</span>
                            {isSignedIn && (
                              <button className="fav-btn" onClick={e => toggleFavourite(e, kit.id)} title={isFav?"Remove from favourites":"Add to favourites"}>
                                {isFav ? "⭐" : "☆"}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="card-title">{kit.name}</div>
                        <div className="card-series">{kit.series}</div>
                        {isSignedIn && (() => {
                          const pct = getKitProgress(kit);
                          if (pct === null) return null;
                          const colors = xpColors(pct);
                          return (
                            <div className="xp-slim" style={colors}>
                              <div className="xp-slim-track">
                                <div className="xp-slim-fill" style={{width:`${pct}%`}} />
                              </div>
                              <div className="xp-slim-label">
                                <span>BUILD PROGRESS</span>
                                <span className="xp-slim-pct">{pct}%</span>
                              </div>
                            </div>
                          );
                        })()}
                        <div className="card-footer">
                          <span className="card-scale">SCALE {kit.scale}</span>
                          <span className="card-arrow">→</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          } />

          {/* ===== KIT DETAIL PAGE ===== */}
          <Route path="/kit/:slug" element={<KitDetail gc={gc} isSignedIn={isSignedIn} favourites={favourites} buildProgress={buildProgress} pageProgress={pageProgress} toggleFavourite={toggleFavourite} setBuildStatus={setBuildStatus} setManualPage={setManualPage} openManualId={openManualId} toggleManual={toggleManual} setOpenManualId={setOpenManualId} goHome={goHome} />} />

          {/* ===== MY VAULT PAGE ===== */}
          <Route path="/vault" element={
            <>
              {(() => {
                // A kit appears in vault if: it's starred OR it has a build status set
                const vaultKits = allKits.filter(k =>
                  favourites.includes(k.id) ||
                  buildProgress[k.id] === "inprogress" ||
                  buildProgress[k.id] === "complete" ||
                  buildProgress[k.id] === "backlog"
                );
                const inProgress = vaultKits.filter(k => buildProgress[k.id] === "inprogress");
                const complete   = vaultKits.filter(k => buildProgress[k.id] === "complete");
                // Backlog = explicitly set to backlog, OR starred with no status
                const backlog    = vaultKits.filter(k =>
                  buildProgress[k.id] === "backlog" ||
                  (!buildProgress[k.id] && favourites.includes(k.id))
                );

                const renderVaultCard = (kit) => {
                  const c = gc(kit.grade);
                  const progress = buildProgress[kit.id];
                  const isFav = favourites.includes(kit.id);
                  const pct = getKitProgress(kit);
                  return (
                    <div key={kit.id} className="kit-card"
                      style={{"--card-accent":c.accent,"--card-accent-bg":c.bg}}
                      onClick={()=>goKit(kit)}
                    >
                      <div className="card-grade-banner" style={{background:c.accent}} />
                      <div className="card-body">
                        <div className="card-top">
                          <span className="grade-badge">{kit.grade}</span>
                          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                            {progress === "inprogress" && <span className="build-badge inprogress">IN PROGRESS</span>}
                            {progress === "complete" && <span className="build-badge complete">COMPLETE</span>}
                            {(!progress || progress === "backlog") && <span className="build-badge" style={{background:"rgba(90,122,159,0.15)",border:"1px solid rgba(90,122,159,0.4)",color:"var(--text-dim)",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",padding:"2px 8px",letterSpacing:"1px"}}>BACKLOG</span>}
                            <button className="fav-btn" onClick={e => toggleFavourite(e, kit.id)} title={isFav?"Remove from favourites":"Add to favourites"}>
                              {isFav ? "⭐" : "☆"}
                            </button>
                          </div>
                        </div>
                        <div className="card-title">{kit.name}</div>
                        <div className="card-series">{kit.series}</div>
                        {pct !== null && (() => {
                          const colors = xpColors(pct);
                          return (
                            <div className="xp-slim" style={colors}>
                              <div className="xp-slim-track">
                                <div className="xp-slim-fill" style={{width:`${pct}%`}} />
                              </div>
                              <div className="xp-slim-label">
                                <span>BUILD PROGRESS</span>
                                <span className="xp-slim-pct">{pct}%</span>
                              </div>
                            </div>
                          );
                        })()}
                        <div className="card-footer">
                          <span className="card-scale">SCALE {kit.scale}</span>
                          <span className="card-arrow">→</span>
                        </div>
                      </div>
                    </div>
                  );
                };

                return (
                  <>
                    <div className="page-hero">
                      <div className="page-tag">PERSONAL COLLECTION</div>
                      <div className="page-title">MY <span style={{color:"var(--accent)"}}>VAULT</span></div>
                      <div className="page-sub">{vaultKits.length} KIT{vaultKits.length!==1?"S":""} TRACKED</div>
                    </div>
                    {vaultKits.length === 0 ? (
                      <div className="vault-empty">
                        <span className="vault-empty-icon">⭐</span>
                        NOTHING IN YOUR VAULT YET<br/>
                        <span style={{fontSize:"0.7rem",opacity:0.5}}>STAR A KIT OR SET A BUILD STATUS TO ADD IT HERE</span>
                      </div>
                    ) : (
                      <div style={{padding:"0 40px 60px"}}>
                        {inProgress.length > 0 && (
                          <>
                            <div className="section-header" style={{padding:"0 0 20px",marginBottom:"4px"}}>
                              <span className="section-title" style={{color:"var(--gold)"}}>⚙ IN PROGRESS</span>
                              <div className="section-line" />
                              <span className="section-count">{inProgress.length} KIT{inProgress.length!==1?"S":""}</span>
                            </div>
                            <div className="vault-grid" style={{padding:"0 0 32px"}}>{inProgress.map(renderVaultCard)}</div>
                          </>
                        )}
                        {complete.length > 0 && (
                          <>
                            <div className="section-header" style={{padding:"0 0 20px",marginBottom:"4px"}}>
                              <span className="section-title" style={{color:"var(--green)"}}>✓ COMPLETED</span>
                              <div className="section-line" />
                              <span className="section-count">{complete.length} KIT{complete.length!==1?"S":""}</span>
                            </div>
                            <div className="vault-grid" style={{padding:"0 0 32px"}}>{complete.map(renderVaultCard)}</div>
                          </>
                        )}
                        {backlog.length > 0 && (
                          <>
                            <div className="section-header" style={{padding:"0 0 20px",marginBottom:"4px"}}>
                              <span className="section-title" style={{color:"var(--text-dim)"}}>◻ BACKLOG</span>
                              <div className="section-line" />
                              <span className="section-count">{backlog.length} KIT{backlog.length!==1?"S":""}</span>
                            </div>
                            <div className="vault-grid" style={{padding:"0 0 32px"}}>{backlog.map(renderVaultCard)}</div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          } />

          {/* ===== GRADE DETAIL PAGE ===== */}
          <Route path="/grade/:gradeSlug" element={<GradeDetail setGradeFilter={setGradeFilter} />} />

          {/* ===== RESOURCES PAGE ===== */}
          <Route path="/resources" element={
            <>
              <div className="page-hero">
                <div className="page-tag">GUIDES & LINKS</div>
                <div className="page-title">RESOURCES</div>
                <div className="page-sub">EVERYTHING YOU NEED TO BUILD BETTER</div>
              </div>
              <div className="resources-page">

                {/* COMMUNITY */}
                <div className="resources-section">
                  <div className="resources-section-title">◈ COMMUNITY</div>
                  <div className="resources-grid">
                    {[
                      { icon:"📖", label:"Gunpla Wiki", sub:"The definitive beginner resource. Grades explained, tool guides, technique breakdowns, FAQs. Best place to start if you're new.", tag:"WIKI", href:"https://www.reddit.com/r/Gunpla/wiki/", color:"#00aaff" },
                      { icon:"💬", label:"r/Gunpla", sub:"The largest Gunpla community on the internet. Share your builds, ask questions, browse WIPs, and get feedback from thousands of builders worldwide.", tag:"REDDIT", href:"https://www.reddit.com/r/Gunpla/", color:"#ff6600" },
                      { icon:"🌐", label:"Gundam Base Online", sub:"Bandai's official Gunpla storefront and news hub. Best place to track new kit announcements, P-Bandai exclusives, and limited releases straight from the source.", tag:"OFFICIAL", href:"https://p-bandai.com/", color:"#00ffcc" },
                    ].map(r => (
                      <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{"--rc-color": r.color}}>
                        <span className="resource-card-icon">{r.icon}</span>
                        <span className="resource-card-body">
                          <span className="resource-card-label">{r.label}</span>
                          <span className="resource-card-sub">{r.sub}</span>
                          <span className="resource-card-tag">{r.tag}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* WHERE TO BUY */}
                <div className="resources-section">
                  <div className="resources-section-title">◈ WHERE TO BUY</div>
                  <div className="resources-grid">
                    {[
                      { icon:"🛒", label:"Hobbylink Japan (HLJ)", sub:"The go-to import retailer. Widest selection of kits at Japanese retail prices, ships worldwide. Great for pre-orders and hard-to-find kits.", tag:"IMPORT", href:"https://www.hlj.com", color:"#ff2244" },
                      { icon:"🛒", label:"Gundam Planet", sub:"US-based Gunpla specialist with fast domestic shipping. Good stock on current HG and MG releases, no import wait times.", tag:"US", href:"https://www.gundamplanet.com", color:"#00aaff" },
                    ].map(r => (
                      <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{"--rc-color": r.color}}>
                        <span className="resource-card-icon">{r.icon}</span>
                        <span className="resource-card-body">
                          <span className="resource-card-label">{r.label}</span>
                          <span className="resource-card-sub">{r.sub}</span>
                          <span className="resource-card-tag">{r.tag}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* KIT REVIEWS */}
                <div className="resources-section">
                  <div className="resources-section-title">◈ KIT REVIEWS & DATABASE</div>
                  <div className="resources-grid">
                    {[
                      { icon:"🔗", label:"Dalong.net Kit Reviews", sub:"Comprehensive Japanese kit review database with photos, runner breakdowns, and assembly notes on thousands of kits. Essential for research before buying.", tag:"DATABASE", href:"http://www.dalong.net", color:"#ffcc00" },
                    ].map(r => (
                      <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{"--rc-color": r.color}}>
                        <span className="resource-card-icon">{r.icon}</span>
                        <span className="resource-card-body">
                          <span className="resource-card-label">{r.label}</span>
                          <span className="resource-card-sub">{r.sub}</span>
                          <span className="resource-card-tag">{r.tag}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </>
          } />

          {/* ===== DISCLAIMER PAGE ===== */}
          <Route path="/disclaimer" element={
            <>
              <div className="page-hero">
                <div className="page-tag">LEGAL NOTICE</div>
                <div className="page-title">DISCLAIMER</div>
                <div className="page-sub">PLEASE READ BEFORE USING THIS SITE</div>
              </div>
              <div className="page">
                <div className="bandai-badge">
                  <div className="bandai-name">BANDAI NAMCO ENTERTAINMENT</div>
                  <div className="bandai-sub">© SOTSU · SUNRISE. ALL GUNDAM IP AND TRADEMARKS BELONG TO THEIR RESPECTIVE OWNERS.</div>
                </div>
                <div className="disclaimer-grid">
                  <div className="disclaimer-card" style={{"--dc":"#ffcc00"}}>
                    <div className="disclaimer-card-icon">🛡️</div>
                    <div className="disclaimer-card-title">FAN PROJECT</div>
                    <div className="disclaimer-card-text">KitVault.io is an unofficial, non-commercial fan-made website created out of love for the Gunpla hobby. It is not affiliated with, endorsed by, or connected to Bandai Namco Entertainment, Sotsu, or Sunrise in any way.</div>
                  </div>
                  <div className="disclaimer-card" style={{"--dc":"#00aaff"}}>
                    <div className="disclaimer-card-icon">📄</div>
                    <div className="disclaimer-card-title">MANUAL CONTENT</div>
                    <div className="disclaimer-card-text">All assembly manuals hosted on this site are the intellectual property of Bandai Namco Entertainment. They are provided here solely as a convenience resource for hobbyists who have already purchased these kits.</div>
                  </div>
                  <div className="disclaimer-card" style={{"--dc":"#00ffcc"}}>
                    <div className="disclaimer-card-icon">🔗</div>
                    <div className="disclaimer-card-title">AFFILIATE LINKS</div>
                    <div className="disclaimer-card-text">This site participates in the Amazon Associates affiliate program. Links to Amazon products may earn a small commission at no extra cost to you. This helps cover server costs and keeps the site free for everyone.</div>
                  </div>
                  <div className="disclaimer-card" style={{"--dc":"#ff6600"}}>
                    <div className="disclaimer-card-icon">💛</div>
                    <div className="disclaimer-card-title">NON-PROFIT</div>
                    <div className="disclaimer-card-text">Any revenue generated through affiliate links or donations is used solely to cover hosting and maintenance costs. This project is run by a hobbyist for hobbyists. Not for profit.</div>
                  </div>
                </div>
                <div className="disclaimer-block">
                  <div className="disclaimer-block-title">INTELLECTUAL PROPERTY NOTICE</div>
                  <p><span className="hl">Gundam</span>, all associated mobile suit names, series titles, logos, and imagery are registered trademarks of <span className="hl-gold">Bandai Namco Entertainment Inc.</span>, <span className="hl-gold">Sotsu Co., Ltd.</span>, and <span className="hl-gold">Sunrise Inc.</span> All rights are reserved by their respective owners.</p>
                  <p>The assembly manuals available on this site are reproduced for informational and archival purposes only. If you are a rights holder and wish for any content to be removed, please contact us and it will be taken down promptly.</p>
                </div>
                <div className="disclaimer-block">
                  <div className="disclaimer-block-title">AMAZON ASSOCIATES DISCLOSURE</div>
                  <p>KitVault.io is a participant in the <span className="hl">Amazon Services LLC Associates Program</span>, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.</p>
                  <p>As an Amazon Associate, we earn from qualifying purchases. This does <span className="hl">not</span> increase the price you pay. Affiliate commissions help us keep this resource free and maintained for the community.</p>
                </div>
                <div className="disclaimer-block">
                  <div className="disclaimer-block-title">FAIR USE & INTENT</div>
                  <p>KitVault.io operates under the belief that hosting assembly manuals for kits that hobbyists have legitimately purchased constitutes fair use. We do not sell, redistribute for profit, or claim ownership over any Bandai intellectual property.</p>
                  <p>The goal is to make the hobby more accessible, especially for international builders who got kits with Japanese-only manuals, or anyone who's misplaced their instructions.</p>
                </div>
              </div>
            </>
          } />

          {/* ===== PANEL LINE MARKERS PAGE ===== */}
          <Route path="/tools/panel-line-markers" element={
            <>
              <ToolNavRow />
              <div className="page-hero">
                <div className="page-tag">◈ HOBBY TOOLS</div>
                <div className="page-title">PANEL LINE MARKERS</div>
                <div className="page-sub">BRING YOUR KIT'S DETAIL TO LIFE IN MINUTES</div>
              </div>
              <div className="tools-page">
                <div className="tools-intro-block">
                  <div className="tools-intro-text">
                    Panel lining is the single fastest way to dramatically improve how any Gunpla looks. By running ink into the recessed lines of a kit, you add depth, shadow, and realism that makes the sculpted detail pop. Whether you're a snap-builder who just wants their kit to look sharper, or going for a full weathered finish, panel lining makes a bigger difference than almost anything else.
                  </div>
                  <div className="tools-intro-tip">
                    <span className="tools-tip-label">◈ PRO TIP</span>
                    Always apply panel lines to assembled, topcoated (or at minimum, bare) parts. On gloss or semi-gloss surfaces the ink flows perfectly into lines. On bare plastic it can bleed. A gloss coat beforehand solves this completely.
                  </div>
                </div>
                <div className="tools-section-title">◈ PANEL LINER RECOMMENDATIONS</div>
                <div className="tools-grid">
                  {[
                    {
                      price: "~$3–5 each",
                      name: "Gundam Marker Panel Line Accent Color",
                      brand: "BANDAI / GSI CREOS",
                      desc: "The most beginner-friendly panel liner on the market. Flow-type ink bleeds directly into recessed lines with a fine tip, and any mistakes wipe clean with an eraser or cotton swab. Available in black, gray, and brown. Use brown on red/orange parts and gray on white/light areas. An essential first purchase.",
                      bestFor: "Beginners · HG · EG · SD · All Colors",
                      asin: "B00E5W716A",
                      badge: "BEST STARTER",
                    },
                    {
                      price: "~$10–20 + thinner",
                      name: "Tamiya Panel Line Accent Color",
                      brand: "TAMIYA",
                      desc: "Enamel-based wash that flows beautifully into deep recesses and creates a richer, more scale-realistic effect than marker-based liners. Applied with a brush, flows by capillary action, and is cleaned up with lighter fluid or enamel thinner and a cotton swab. Available in black, dark brown, dark gray, and more. The intermediate builder's go-to.",
                      bestFor: "Intermediate · HG · RG · MG · PG",
                      asin: "B0BKRKRSDY",
                      badge: "COMMUNITY PICK",
                    },
                  ].map(item => (
                    <div className="tool-card" key={item.name}>
                      <div className="tool-card-body">
                        <div className="tool-card-brand">{item.brand}</div>
                        <div className="tool-card-name">{item.name}</div>
                        <div className="tool-card-price-tag">{item.price}</div>
                        <div className="tool-card-desc">{item.desc}</div>
                        <div className="tool-card-best-for">
                          <span className="tool-best-label">BEST FOR</span>
                          <span className="tool-best-val">{item.bestFor}</span>
                        </div>
                      </div>
                      <div className="tool-card-footer">
                        <span className="tool-badge">★ {item.badge}</span>
                        {item.asin && <a className="tool-amazon-btn" href={`https://www.amazon.com/dp/${item.asin}?tag=kitvault-20`} target="_blank" rel="noopener noreferrer sponsored">VIEW ON AMAZON →</a>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tools-affiliate-note">
                  ★ KitVault.io participates in the Amazon Associates program. Links above are affiliate links. We earn a small commission at no extra cost to you, which helps keep the site free.
                  ⚠ These are recommendations only. Please do your own due diligence before purchasing.
                </div>
              </div>
              <ToolNavRow />
            </>
          } />

          {/* ===== SCRIBERS & CHISELS PAGE ===== */}
          <Route path="/tools/scribers" element={
            <>
              <ToolNavRow />
              <div className="page-hero">
                <div className="page-tag">◈ HOBBY TOOLS</div>
                <div className="page-title">SCRIBERS & CHISELS</div>
                <div className="page-sub">CUT CUSTOM PANEL LINES INTO YOUR KIT'S SURFACE</div>
              </div>
              <div className="tools-page">
                <div className="tools-intro-block">
                  <div className="tools-intro-text">
                    Scribers and chisels let you cut new panel lines directly into plastic, either adding detail that isn't there or deepening existing lines so they hold washes better. This is where Gunpla building crosses into modelling craft. It takes practice, but the results on a well-scribed MG or PG are stunning.
                  </div>
                  <div className="tools-intro-tip">
                    <span className="tools-tip-label">◈ PRO TIP</span>
                    Always use masking tape or a metal ruler as a guide when scribing straight lines. Light, repeated passes beat one heavy stroke every time. You'll have way more control and slip a lot less. Practice on sprue scraps before touching your kit.
                  </div>
                </div>
                <div className="tools-section-title">◈ SCRIBING TOOL RECOMMENDATIONS</div>
                <div className="tools-grid">
                  {[
                    {
                      price: "~$19",
                      name: "Generic Prime Model Scriber Gundam",
                      brand: "DULIWO",
                      desc: "An outstanding entry into scribing. This generic scribing tool gives you reliable straight guides for consistent panel lines at a very accessible price. Pair it with sanding sticks for clean, reproducible results. Highly recommended as a starting point for beginners on r/Gunpla who want to try scribing without committing to premium tools.",
                      bestFor: "Beginners · HG · MG · Surface Detail",
                      asin: "B0CYNTSXZK",
                      badge: "BEST STARTER",
                    },
                    {
                      price: "~$25",
                      name: "stedi Model Scriber Chisel",
                      brand: "stedi",
                      desc: "A solid intermediate scribing tool with a replaceable carbide-style tip that stays sharp longer than cheaper alternatives. The ergonomic handle gives good control for clean, consistent panel line work. A reliable step up from a generic beginner scriber, consistently recommended across Gunpla and scale modelling communities for its quality-to-price ratio.",
                      bestFor: "Intermediate · MG · PG · Clean Line Work",
                      asin: "B0CMT3R3RV",
                      badge: "COMMUNITY FAVOURITE",
                    },
                    {
                      price: "~$50",
                      name: "DSPIAE Departure Tool Combo Set",
                      brand: "DSPIAE",
                      desc: "Professional-grade scribing combo machined to incredibly tight tolerances. The Departure Tool Combo Set gives you everything needed for precise, varied line work in one package, with DSPIAE's signature perfectly-weighted handles. These are the tools you see in World Championship builds. Overkill for casual builders, but genuinely transformative if you're serious about surface work.",
                      bestFor: "Advanced · PG · Competition Builds · Fine Detail",
                      asin: "B0C7NJFD6T",
                      badge: "PRO LEVEL",
                    },
                  ].map(item => (
                    <div className="tool-card" key={item.name}>
                      <div className="tool-card-body">
                        <div className="tool-card-brand">{item.brand}</div>
                        <div className="tool-card-name">{item.name}</div>
                        <div className="tool-card-price-tag">{item.price}</div>
                        <div className="tool-card-desc">{item.desc}</div>
                        <div className="tool-card-best-for">
                          <span className="tool-best-label">BEST FOR</span>
                          <span className="tool-best-val">{item.bestFor}</span>
                        </div>
                      </div>
                      <div className="tool-card-footer">
                        <span className="tool-badge">★ {item.badge}</span>
                        {item.asin && <a className="tool-amazon-btn" href={`https://www.amazon.com/dp/${item.asin}?tag=kitvault-20`} target="_blank" rel="noopener noreferrer sponsored">VIEW ON AMAZON →</a>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tools-affiliate-note">
                  ★ KitVault.io participates in the Amazon Associates program. Links above are affiliate links. We earn a small commission at no extra cost to you, which helps keep the site free.
                  ⚠ These are recommendations only. Please do your own due diligence before purchasing.
                </div>
              </div>
              <ToolNavRow />
            </>
          } />

          {/* ===== SANDING STICKS PAGE ===== */}
          <Route path="/tools/sanding" element={
            <>
              <ToolNavRow />
              <div className="page-hero">
                <div className="page-tag">◈ HOBBY TOOLS</div>
                <div className="page-title">SANDING STICKS</div>
                <div className="page-sub">SMOOTH GATES, REMOVE SEAM LINES, POLISH CLEAR PARTS</div>
              </div>
              <div className="tools-page">
                <div className="tools-intro-block">
                  <div className="tools-intro-text">
                    Sanding is what separates a tabletop build from a display-quality one. After your nippers remove the gate stub, a progression of sanding grits brings that surface flush and smooth, basically invisible under paint or topcoat. The right sanding tools also let you eliminate seam lines on MG parts, polish clear parts to crystal clarity, and prep surfaces for priming.
                  </div>
                  <div className="tools-intro-tip">
                    <span className="tools-tip-label">◈ PRO TIP</span>
                    Work through the grits in sequence: 400 to remove material, 600 to refine, 1000 to smooth, 2000+ to polish. Skipping grits leaves scratches that show through paint. Wet sanding from 1000 grit upward gives the cleanest results on plastic.
                  </div>
                </div>
                <div className="tools-section-title">◈ SANDING TOOL RECOMMENDATIONS</div>
                <div className="tools-grid">
                  {[
                    {
                      price: "~$8–12",
                      name: "Tamiya Finishing Abrasives (Fine Set)",
                      brand: "TAMIYA",
                      desc: "Tamiya's finishing abrasive sheets are an excellent, affordable entry point. Available in Fine (600), Extra Fine (1000), and Ultra Fine (2000) grits. Cut to size and wrap around a flat stick or sanding block for controlled results. The sheets don't clog quickly and last a surprisingly long time for the price. A genuine community staple.",
                      bestFor: "Beginners · HG · Gate Cleanup · All Grades",
                      asin: "B00J4DC872",
                      badge: "BEST STARTER",
                    },
                    {
                      price: "~$42",
                      name: "Gunprimer Raser The Black",
                      brand: "GUNPRIMER",
                      desc: "Purpose-built for Gunpla, the Gunprimer sticks come in a variety of profiles (flat, curved, round) that match the geometry of typical Gunpla parts. Each stick has a firm, consistent backing that prevents the abrasive from flexing where you don't want it to. Multiple grits available. These are one of the best mid-range sanding investments a builder can make.",
                      bestFor: "Intermediate · HG · MG · Seam Line Removal",
                      asin: "",
                      badge: "GUNPLA SPECIFIC",
                    },
                  ].map(item => (
                    <div className="tool-card" key={item.name}>
                      <div className="tool-card-body">
                        <div className="tool-card-brand">{item.brand}</div>
                        <div className="tool-card-name">{item.name}</div>
                        <div className="tool-card-price-tag">{item.price}</div>
                        <div className="tool-card-desc">{item.desc}</div>
                        <div className="tool-card-best-for">
                          <span className="tool-best-label">BEST FOR</span>
                          <span className="tool-best-val">{item.bestFor}</span>
                        </div>
                      </div>
                      <div className="tool-card-footer">
                        <span className="tool-badge">★ {item.badge}</span>
                        {item.asin && <a className="tool-amazon-btn" href={`https://www.amazon.com/dp/${item.asin}?tag=kitvault-20`} target="_blank" rel="noopener noreferrer sponsored">VIEW ON AMAZON →</a>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tools-affiliate-note">
                  ★ KitVault.io participates in the Amazon Associates program. Links above are affiliate links. We earn a small commission at no extra cost to you, which helps keep the site free.
                  ⚠ These are recommendations only. Please do your own due diligence before purchasing.
                </div>
              </div>
              <ToolNavRow />
            </>
          } />

          {/* ===== PAINTS & PRIMERS PAGE ===== */}
          <Route path="/tools/paints" element={
            <>
              <ToolNavRow />
              <div className="page-hero">
                <div className="page-tag">◈ HOBBY TOOLS</div>
                <div className="page-title">PAINTS & PRIMERS</div>
                <div className="page-sub">COLOR YOUR BUILDS. HAND PAINTING TO FULL AIRBRUSH.</div>
              </div>
              <div className="tools-page">
                <div className="tools-intro-block">
                  <div className="tools-intro-text">
                    Paint is what transforms a good build into an artwork. Whether you're hand-painting accent colors, touching up nub marks, or airbrushing an entire custom color scheme, choosing the right paint line matters. Gunpla builders primarily work with lacquer, enamel, and acrylic paints. Each has its own properties, strengths, and thinner requirements.
                  </div>
                  <div className="tools-intro-tip">
                    <span className="tools-tip-label">◈ PRO TIP</span>
                    Always prime before painting. Primer gives paint something to grip, reveals surface imperfections you need to fix, and unifies the color of the plastic so your topcoats look consistent. Mr. Surfacer 1000 is the community standard for Gunpla primer.
                  </div>
                </div>
                <div className="tools-section-title">◈ PAINT RECOMMENDATIONS</div>
                <div className="tools-grid">
                  {[
                    {
                      price: "~$3–5 per pot",
                      name: "Citadel Contrast & Base Paints",
                      brand: "GAMES WORKSHOP",
                      desc: "Citadel paints are water-based acrylics with a wide color range and excellent brush quality. The Contrast range is great for beginners. One coat over white primer creates shading and highlighting on its own. Easy cleanup with water, no harsh chemicals, and widely available. A great entry point for hand-painting Gunpla details and accent work.",
                      bestFor: "Beginners · Hand Painting · Accent Colors · HG · SD",
                      asin: "B0F1JQVJ4R",
                      badge: "BEGINNER FRIENDLY",
                    },
                    {
                      price: "~$3–6 per bottle",
                      name: "Vallejo Model Color Acrylic",
                      brand: "VALLEJO",
                      desc: "The preferred acrylic line for serious modelers who aren't ready to commit to lacquers. Vallejo Model Color comes in over 200 colors, thins reliably with water or Vallejo thinner, and performs exceptionally well through an airbrush. The dropper-bottle format makes consistent mixing easy. Widely praised for coverage quality and color accuracy.",
                      bestFor: "Intermediate · Airbrushing · Hand Painting · MG",
                      asin: "B000PHCTRK",
                      badge: "MODELLER'S CHOICE",
                    },
                    {
                      price: "~$3–5 per bottle",
                      name: "Mr. Color Lacquer Paint",
                      brand: "GSI CREOS",
                      desc: "The gold standard for Gunpla painting in Japan and increasingly worldwide. Mr. Color lacquers dry hard, fast, and smooth with a factory-like finish that holds up really well. The color range is perfectly tuned to Gundam color schemes (Gundam White, MS Gray, Zeon Red, etc.). Requires lacquer thinner and ventilation, but the results are unmatched. What the pros use.",
                      bestFor: "Advanced · Airbrushing · MG · PG · Custom Schemes",
                      asin: "B0027XABF2",
                      badge: "GOLD STANDARD",
                    },
                  ].map(item => (
                    <div className="tool-card" key={item.name}>
                      <div className="tool-card-body">
                        <div className="tool-card-brand">{item.brand}</div>
                        <div className="tool-card-name">{item.name}</div>
                        <div className="tool-card-price-tag">{item.price}</div>
                        <div className="tool-card-desc">{item.desc}</div>
                        <div className="tool-card-best-for">
                          <span className="tool-best-label">BEST FOR</span>
                          <span className="tool-best-val">{item.bestFor}</span>
                        </div>
                      </div>
                      <div className="tool-card-footer">
                        <span className="tool-badge">★ {item.badge}</span>
                        {item.asin && <a className="tool-amazon-btn" href={`https://www.amazon.com/dp/${item.asin}?tag=kitvault-20`} target="_blank" rel="noopener noreferrer sponsored">VIEW ON AMAZON →</a>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tools-affiliate-note">
                  ★ KitVault.io participates in the Amazon Associates program. Links above are affiliate links. We earn a small commission at no extra cost to you, which helps keep the site free.
                  ⚠ These are recommendations only. Please do your own due diligence before purchasing.
                </div>
              </div>
              <ToolNavRow />
            </>
          } />

          {/* ===== AIRBRUSHES PAGE ===== */}
          <Route path="/tools/airbrushes" element={
            <>
              <ToolNavRow />
              <div className="page-hero">
                <div className="page-tag">◈ HOBBY TOOLS</div>
                <div className="page-title">AIRBRUSHES</div>
                <div className="page-sub">SMOOTH, EVEN COATS. THE BUILDER'S BIGGEST UPGRADE.</div>
              </div>
              <div className="tools-page">
                <div className="tools-intro-block">
                  <div className="tools-intro-text">
                    An airbrush is the single biggest quality upgrade a Gunpla builder can make. The difference between a brushed and airbrushed finish is night and day: smooth, even coats with zero brush strokes, clean gradients, subtle shading, and the ability to lay down primer and topcoat cleanly. It's a significant investment, but one that pays off on every kit afterward.
                  </div>
                  <div className="tools-intro-tip">
                    <span className="tools-tip-label">◈ PRO TIP</span>
                    You'll need a compressor as well as the airbrush itself. For Gunpla, a 0.3mm needle is the most versatile. Fine enough for detail work, wide enough to base coat panels without striping. Always thin your paint to a skim-milk consistency before airbrushing. Too thick = tip dry and orange peel texture.
                  </div>
                </div>
                <div className="tools-section-title">◈ AIRBRUSH RECOMMENDATIONS</div>
                <div className="tools-grid">
                  {[
                    {
                      price: "~$99",
                      name: "Badger Patriot 105",
                      brand: "BADGER",
                      desc: "The Patriot 105 is probably the most recommended budget airbrush in the Gunpla community, and it earns it. Reliable, easy to clean, forgiving for beginners, and built to last. The 0.5mm needle is on the wider side, making it better for base coating and primer than fine detail work, but it's an excellent tool to learn the fundamentals on without breaking the bank.",
                      bestFor: "Beginners · Base Coating · Primer · HG · MG",
                      asin: "B002W84GTO",
                      badge: "",
                    },
                    {
                      price: "~$80–130",
                      name: "Iwata Neo CN Gravity Feed",
                      brand: "IWATA",
                      desc: "Iwata's Neo line brings professional-grade engineering to an accessible price point. The Neo CN gravity-feed with a 0.35mm needle hits the sweet spot for Gunpla. Smooth enough for fine work, wide enough for even base coverage. Gravity feed means less air pressure needed, which means better control. Iwata's build quality is a noticeable step up from budget options.",
                      bestFor: "Intermediate · Detailing · Base Coat · MG · PG",
                      asin: "B01J4GTIUI",
                      badge: "STEP UP PICK",
                    },
                    {
                      price: "~$180–250",
                      name: "Iwata HP-CS Eclipse",
                      brand: "IWATA",
                      desc: "The HP-CS Eclipse is the airbrush you see in virtually every professional Gunpla build video. The 0.35mm needle, gravity-feed cup, and Iwata's precision engineering deliver flawlessly smooth coats and the finest detail capability in this price range. Virtually zero tip dry, intuitive needle control, and an absolute joy to use once you've learned your technique. Built to last decades.",
                      bestFor: "Advanced · Competition Builds · MG · PG · Detail Work",
                      asin: "B000BQKFAI",
                      badge: "PRO STANDARD",
                    },
                  ].map(item => (
                    <div className="tool-card" key={item.name}>
                      <div className="tool-card-body">
                        <div className="tool-card-brand">{item.brand}</div>
                        <div className="tool-card-name">{item.name}</div>
                        <div className="tool-card-price-tag">{item.price}</div>
                        <div className="tool-card-desc">{item.desc}</div>
                        <div className="tool-card-best-for">
                          <span className="tool-best-label">BEST FOR</span>
                          <span className="tool-best-val">{item.bestFor}</span>
                        </div>
                      </div>
                      <div className="tool-card-footer">
                        <span className="tool-badge">★ {item.badge}</span>
                        {item.asin && <a className="tool-amazon-btn" href={`https://www.amazon.com/dp/${item.asin}?tag=kitvault-20`} target="_blank" rel="noopener noreferrer sponsored">VIEW ON AMAZON →</a>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tools-affiliate-note">
                  ★ KitVault.io participates in the Amazon Associates program. Links above are affiliate links. We earn a small commission at no extra cost to you, which helps keep the site free.
                  ⚠ These are recommendations only. Please do your own due diligence before purchasing.
                </div>
              </div>
              <ToolNavRow />
            </>
          } />

          {/* ===== TOP COATS PAGE ===== */}
          <Route path="/tools/top-coats" element={
            <>
              <ToolNavRow />
              <div className="page-hero">
                <div className="page-tag">◈ HOBBY TOOLS</div>
                <div className="page-title">TOP COATS</div>
                <div className="page-sub">PROTECT YOUR BUILD & UNIFY YOUR FINISH</div>
              </div>
              <div className="tools-page">
                <div className="tools-intro-block">
                  <div className="tools-intro-text">
                    A topcoat is the final step that pulls everything together. It seals panel lines, locks down waterslide decals, and gives the whole model a consistent sheen. It's the difference between a kit that looks "built" and one that looks "finished." Gloss coats are used mid-build to prep for washes and decals; matte or semi-gloss coats are the typical final seal.
                  </div>
                  <div className="tools-intro-tip">
                    <span className="tools-tip-label">◈ PRO TIP</span>
                    Never spray topcoat in humid conditions or when temperature is below 15°C. Moisture in the air causes "frosting," a milky and pretty much irreversible whitening of the finish. Spray in thin, even passes from 25–30cm away and let each coat tack dry before applying the next.
                  </div>
                </div>
                <div className="tools-section-title">◈ TOP COAT RECOMMENDATIONS</div>
                <div className="tools-grid">
                  {[
                    {
                      price: "~$10–15 per can",
                      name: "Krylon UV-Resistant Clear Matte",
                      brand: "KRYLON",
                      desc: "An accessible, widely available rattle-can topcoat that delivers a solid matte finish at a budget price. Not as refined as Japanese lacquer options, but does the job for snap-build kits and practice. Water-based, so it's less likely to react with acrylic paints underneath. Good option while you're learning topcoat technique before investing in premium cans.",
                      bestFor: "Beginners · Practice Builds · Snap-Fit HG · EG",
                      asin: "B004O7HTDQ",
                      badge: "BUDGET PICK",
                    },
                    {
                      price: "~$15–20 per can",
                      name: "Tamiya TS-80 Flat Clear / TS-13 Gloss",
                      brand: "TAMIYA",
                      desc: "Tamiya's TS lacquer rattle cans are the most recommended mid-range topcoat in the Gunpla hobby. They spray smoothly, dry fast, and leave a consistent, even finish. TS-80 Flat Clear is the go-to for matte final seals; TS-13 Crystal Clear Gloss is ideal for pre-decal coats and gloss coats before washes. Widely trusted and genuinely great results.",
                      bestFor: "Intermediate · HG · MG · Pre-Decal & Final Seal",
                      asin: "B000ZVO3YS",
                      badge: "COMMUNITY STAPLE",
                    },
                    {
                      price: "~$15–20 per can",
                      name: "Mr. Super Clear Flat / UV Cut Gloss",
                      brand: "GSI CREOS",
                      desc: "The absolute benchmark for Gunpla topcoats. Mr. Super Clear sprays as a fine mist that settles perfectly flat, dries incredibly smooth, and gives an exceptional matte or gloss finish depending on the variant. The UV Cut versions provide added protection from display fading. The flat version produces a convincingly realistic surface scale effect beloved by competition builders worldwide.",
                      bestFor: "Advanced · MG · PG · Competition · Display Builds",
                      asin: "B002DTL7ZS",
                      badge: "GOLD STANDARD",
                    },
                  ].map(item => (
                    <div className="tool-card" key={item.name}>
                      <div className="tool-card-body">
                        <div className="tool-card-brand">{item.brand}</div>
                        <div className="tool-card-name">{item.name}</div>
                        <div className="tool-card-price-tag">{item.price}</div>
                        <div className="tool-card-desc">{item.desc}</div>
                        <div className="tool-card-best-for">
                          <span className="tool-best-label">BEST FOR</span>
                          <span className="tool-best-val">{item.bestFor}</span>
                        </div>
                      </div>
                      <div className="tool-card-footer">
                        <span className="tool-badge">★ {item.badge}</span>
                        {item.asin && <a className="tool-amazon-btn" href={`https://www.amazon.com/dp/${item.asin}?tag=kitvault-20`} target="_blank" rel="noopener noreferrer sponsored">VIEW ON AMAZON →</a>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tools-affiliate-note">
                  ★ KitVault.io participates in the Amazon Associates program. Links above are affiliate links. We earn a small commission at no extra cost to you, which helps keep the site free.
                  ⚠ These are recommendations only. Please do your own due diligence before purchasing.
                </div>
              </div>
              <ToolNavRow />
            </>
          } />

          {/* ===== HOBBY KNIVES PAGE ===== */}
          <Route path="/tools/hobby-knives" element={
            <>
              <ToolNavRow />
              <div className="page-hero">
                <div className="page-tag">◈ HOBBY TOOLS</div>
                <div className="page-title">HOBBY KNIVES</div>
                <div className="page-sub">PRECISION CLEANUP FOR GATES, SEAMS & MODIFICATIONS</div>
              </div>
              <div className="tools-page">
                <div className="tools-intro-block">
                  <div className="tools-intro-text">
                    A hobby knife is your second most-used tool after nippers. Once you've clipped the gate stub close, a sharp blade shaves it flush in a way sandpaper alone just can't replicate. Knives are also essential for removing mold seam lines, trimming sprue flash, cleaning up sink marks, and performing minor modifications to parts. Keep your blades fresh. A dull blade is slower and actually more dangerous than a sharp one.
                  </div>
                  <div className="tools-intro-tip">
                    <span className="tools-tip-label">◈ PRO TIP</span>
                    Change blades often. Hobby knife blades are cheap. Swap one in every session and you'll notice the difference immediately. For gate cleanup, use a paring motion (push toward yourself at a low angle) rather than a scraping motion. You'll have far more control and get cleaner results.
                  </div>
                </div>
                <div className="tools-section-title">◈ HOBBY KNIFE RECOMMENDATIONS</div>
                <div className="tools-grid">
                  {[
                    {
                      price: "~$5–10 + blades",
                      name: "X-Acto X1 Knife Set",
                      brand: "X-ACTO",
                      desc: "The classic entry-level hobby knife, and for good reason. The X-Acto X1 with #11 blade is universally available, compatible with a massive range of blade types, and perfectly adequate for gate cleanup and basic seam work. Comes with a pack of blades. The aluminum handle is lightweight but can get slippery. A rubber grip sleeve is a cheap fix worth doing.",
                      bestFor: "Beginners · Gate Cleanup · HG · EG · Light Modification",
                      asin: "B00JWFIKOC",
                      badge: "BEST STARTER",
                    },
                    {
                      price: "~$15–25 + blades",
                      name: "Olfa AK-4 Art Knife Pro",
                      brand: "OLFA",
                      desc: "Olfa is the preferred knife brand among serious modelers and Gunpla builders alike. The AK-4 Art Knife Pro features a precision-machined aluminum handle with a satisfyingly weighted balance, a secure blade locking collar, and compatibility with Olfa's exceptional blade range. The blades are noticeably sharper and more consistent than generic alternatives. Worth the extra few dollars.",
                      bestFor: "Intermediate · Gate Cleanup · Seam Lines · MG · Conversion",
                      asin: "B0006O87TQ",
                      badge: "BUILDER'S CHOICE",
                    },
                    {
                      price: "~$20 + blades",
                      name: "Dspiae Aluminium Alloy Hobby Knife Set",
                      brand: "DSPIAE",
                      desc: "DSPIAE's premium hobby knife is machined from aircraft-grade aluminum with a perfectly knurled grip and a precision locking collar. The weight and balance feel like a proper surgical instrument. A real step above anything else at this price. Compatible with standard #11 blades. If you spend long sessions doing detail work and modification, the ergonomics of this knife pay for themselves in reduced hand fatigue.",
                      bestFor: "Advanced · Fine Detailing · Conversion Work · MG · PG",
                      asin: "B0DL6FK7QH",
                      badge: "PRECISION GRADE",
                    },
                  ].map(item => (
                    <div className="tool-card" key={item.name}>
                      <div className="tool-card-body">
                        <div className="tool-card-brand">{item.brand}</div>
                        <div className="tool-card-name">{item.name}</div>
                        <div className="tool-card-price-tag">{item.price}</div>
                        <div className="tool-card-desc">{item.desc}</div>
                        <div className="tool-card-best-for">
                          <span className="tool-best-label">BEST FOR</span>
                          <span className="tool-best-val">{item.bestFor}</span>
                        </div>
                      </div>
                      <div className="tool-card-footer">
                        <span className="tool-badge">★ {item.badge}</span>
                        {item.asin && <a className="tool-amazon-btn" href={`https://www.amazon.com/dp/${item.asin}?tag=kitvault-20`} target="_blank" rel="noopener noreferrer sponsored">VIEW ON AMAZON →</a>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tools-affiliate-note">
                  ★ KitVault.io participates in the Amazon Associates program. Links above are affiliate links. We earn a small commission at no extra cost to you, which helps keep the site free.
                  ⚠ These are recommendations only. Please do your own due diligence before purchasing.
                </div>
              </div>
              <ToolNavRow />
            </>
          } />

          {/* ===== NIPPERS PAGE ===== */}
          <Route path="/tools/nippers" element={
            <>
              <ToolNavRow />
              <div className="page-hero">
                <div className="page-tag">◈ HOBBY TOOLS</div>
                <div className="page-title">NIPPERS</div>
                <div className="page-sub">THE MOST ESSENTIAL TOOL IN YOUR GUNPLA KIT</div>
              </div>

              <div className="tools-page">

                {/* INTRO BLOCK */}
                <div className="tools-intro-block">
                  <div className="tools-intro-text">
                    Nippers are the single most important tool a Gunpla builder can own. A good pair cuts cleanly through plastic runners without stressing or whitening the surrounding material. Your finish is protected before you've even touched a panel liner. Cheap nippers crush and crack; quality nippers slice. The difference is immediately visible on your finished build.
                  </div>
                  <div className="tools-intro-tip">
                    <span className="tools-tip-label">◈ PRO TIP</span>
                    Always cut twice. First cut 1-2mm from the part to take off the bulk, then a second precise cut flush to the gate. This prevents gate stress marks and white scarring on the plastic.
                  </div>
                </div>

                {/* PRICE TIER HEADER */}
                <div className="tools-section-title">◈ RECOMMENDED NIPPERS BY PRICE</div>

                <div className="tools-grid">

                  {/* BUDGET */}
                  {[
                    {
                      tier: "BUDGET",
                      tierColor: "#00ffcc",
                      price: "~$15–20",
                      name: "RUITOOL 4.7\" Single-Edge Model Nippers",
                      brand: "RUITOOL",
                      desc: "An outstanding budget nipper that punches well above its price. The ultra-thin single-edge blade delivers clean, stress-free cuts with minimal gate marks; builders consistently compare it to nippers costing three times the price. Comes with a blade cover and hard carrying case. Lifetime guarantee included.",
                      bestFor: "Beginners · HG · EG · SD",
                      asin: "B0BVH9KCF7",
                      badge: "BEST VALUE",
                      badgeColor: "#00ffcc",
                    },
                    {
                      tier: "MID-RANGE",
                      tierColor: "#00aaff",
                      price: "~$25–35",
                      name: "DSPIAE Ultra-Thin Single Blade Nipper",
                      brand: "DSPIAE",
                      desc: "A serious upgrade from budget nippers. DSPIAE's ultra-thin single blade applies cutting force from one side only, leaving gate surfaces noticeably cleaner with minimal white stress marks. Consistently praised by the community for its sharpness straight out of the box; a favourite among intermediate builders looking to step up their finish quality.",
                      bestFor: "Intermediate · HG · RG · MG",
                      asin: "B07F8Q3C2T",
                      badge: "STEP UP",
                      badgeColor: "#00aaff",
                    },
                    {
                      tier: "PREMIUM",
                      tierColor: "#ffcc00",
                      price: "~$60–70",
                      name: "GodHand Ultimate Nipper 5.0",
                      brand: "GODHAND",
                      desc: "The gold standard of Gunpla nippers. Ultra-thin blade cuts with almost no pressure. Gate surfaces come out so clean they often need no sanding at all. Fragile compared to budget options (don't cut metal or thick sprue with these), but the results speak for themselves.",
                      bestFor: "Advanced · RG · MG · PG",
                      asin: "B01MUGEO9X",
                      badge: "GOLD STANDARD",
                      badgeColor: "#ffcc00",
                    },
                  ].map(item => (
                    <div className="tool-card" key={item.name} style={{"--tc": item.tierColor}}>
                      <div className="tool-card-tier-bar">
                        <span className="tool-card-tier">{item.tier}</span>
                        <span className="tool-card-price">{item.price}</span>
                      </div>
                      <div className="tool-card-body">
                        <div className="tool-card-brand">{item.brand}</div>
                        <div className="tool-card-name">{item.name}</div>
                        <div className="tool-card-desc">{item.desc}</div>
                        <div className="tool-card-best-for">
                          <span className="tool-best-label">BEST FOR</span>
                          <span className="tool-best-val">{item.bestFor}</span>
                        </div>
                      </div>
                      <div className="tool-card-footer">
                        <span className="tool-badge" style={{borderColor: item.badgeColor, color: item.badgeColor}}>
                          ★ {item.badge}
                        </span>
                        {item.asin && <a
                          className="tool-amazon-btn"
                          href={`https://www.amazon.com/dp/${item.asin}?tag=kitvault-20`}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                        >
                          VIEW ON AMAZON →
                        </a>}
                      </div>
                    </div>
                  ))}

                </div>

                {/* AFFILIATE DISCLAIMER */}
                <div className="tools-affiliate-note">
                  ★ KitVault.io participates in the Amazon Associates program. Links above are affiliate links. We earn a small commission at no extra cost to you, which helps keep the site free.
                  ⚠ These are recommendations only. Please do your own due diligence before purchasing.
                </div>

              </div>
              <ToolNavRow />
            </>
          } />

          {/* ── ADMIN ─────────────────────────────────────── */}
          <Route path="/admin" element={<AdminUpload />} />

        </Routes>

        {/* SETTINGS MODAL */}
        {showSettings && (
          <div className="modal-overlay" onClick={()=>setShowSettings(false)}>
            <div className="settings-modal" onClick={e=>e.stopPropagation()}>
              <div className="settings-header">
                <span className="settings-title">⚙ SETTINGS</span>
                <button className="modal-close" onClick={()=>setShowSettings(false)}>✕</button>
              </div>
              <div className="settings-body">

                {/* DONATE */}
                <div className="settings-section">
                  <div className="settings-section-label">SUPPORT KITVAULT</div>
                  <div className="donate-block">
                    <div className="donate-title">☕ BUY ME A COFFEE</div>
                    <div className="donate-sub">
                      KitVault.io is a free, non-profit fan resource.<br/>
                      Donations help cover hosting costs and keep the vault online.
                    </div>
                    <a className="btn-donate" href="https://ko-fi.com/kitvault1" target="_blank" rel="noopener noreferrer">
                      ☕ BUY ME A COFFEE
                    </a>
                  </div>
                </div>

                {/* SITE INFO */}
                <div className="settings-section">
                  <div className="settings-section-label">SITE INFO</div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">VERSION</span>
                    <span className="settings-info-val">{VERSION}</span>
                  </div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">KITS INDEXED</span>
                    <span className="settings-info-val">{allKits.length}</span>
                  </div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">TOTAL MANUALS</span>
                    <span className="settings-info-val">{allKits.reduce((a,k)=>a+k.manuals.length,0)}</span>
                  </div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">DISCLAIMER</span>
                    <span className="settings-info-val clickable-val" onClick={goDisclaimer}>VIEW →</span>
                  </div>
                </div>

                {/* AFFILIATE NOTE */}
                <div className="settings-section">
                  <div className="settings-section-label">AFFILIATE PROGRAM</div>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:"var(--text-dim)",letterSpacing:"0.5px",lineHeight:2}}>
                    KitVault.io participates in the Amazon Associates program. Kit pages include affiliate links to Amazon. We earn a small commission on qualifying purchases at no extra cost to you. Thank you for supporting the site.
                  </div>
                </div>

                {/* DISCLAIMER LINK */}
                <div className="settings-section">
                  <div className="settings-section-label">LEGAL</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:"var(--text-dim)",letterSpacing:"0.5px",lineHeight:1.8}}>
                      Fan-made non-profit project.<br/>All Gundam IP © Bandai Namco · Sotsu · Sunrise.
                    </div>
                    <button
                      onClick={goDisclaimer}
                      style={{
                        background:"rgba(255,204,0,0.06)", border:"1px solid rgba(255,204,0,0.3)",
                        color:"var(--gold)", fontFamily:"'Share Tech Mono',monospace",
                        fontSize:"0.6rem", padding:"8px 14px", cursor:"pointer",
                        letterSpacing:"1px", transition:"all 0.2s", whiteSpace:"nowrap",
                        clipPath:"polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%)"
                      }}
                    >
                      VIEW DISCLAIMER →
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer">
          <span className="footer-logo">KITVAULT.IO</span>
          <span>© GUNDAM IP / BANDAI NAMCO · SOTSU · SUNRISE</span>
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem"}}>{VERSION}</span>
        </footer>

      </div>
    </>
  );
}

