// ─────────────────────────────────────────────────────────────
// KitDetail.jsx
// Full kit detail page including manual viewer, build status,
// XP progress bar, and Amazon affiliate banner.
//
// Mobile PDF fix: replaced the touch-intercept overlay with a
// proper two-tap pattern using pointer-events toggling so users
// can scroll the PDF iframe on touch devices without the page
// stealing the gesture.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { R2, AMAZON_URLS, GRADE_COLORS } from "../data/grades.js";
import { findKitBySlug, xpColors } from "../data/grades.js";
import PdfFullscreenModal from "./PdfFullscreenModal.jsx";

// gc is used locally — no need to pass it as a prop
const gc = (g) => GRADE_COLORS[g] || GRADE_COLORS["HG"];

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

  const [realPages, setRealPages] = useState({});
  const [fullscreenManual, setFullscreenManual] = useState(null);
  // activeIframeId: when set, that iframe receives pointer events so the
  // user can scroll/interact with the PDF. Tap outside to deactivate.
  const [activeIframeId, setActiveIframeId] = useState(null);
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
      const pdfjs = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.min.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs";
      const pdf = await pdfjs.getDocument(`${R2}/${manual.url}`).promise;
      const count = pdf.numPages;
      localStorage.setItem(cacheKey, String(count));
      setRealPages(prev => ({ ...prev, [manual.id]: count }));
    } catch (_) { /* silently ignore, falls back to manual.pages */ }
  };

  useEffect(() => {
    kit?.manuals.forEach(m => { if (m.url) fetchRealPages(m); });
  }, [kit?.id]);

  // Deactivate active iframe when clicking anywhere outside the PDF frame
  useEffect(() => {
    if (!activeIframeId) return;
    const deactivate = () => setActiveIframeId(null);
    window.addEventListener("click", deactivate);
    return () => window.removeEventListener("click", deactivate);
  }, [activeIframeId]);

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

      {/* ── XP PROGRESS BAR ─────────────────────────────────── */}
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
                      onClick={e => { e.stopPropagation(); setOpenManualId(null); setActiveIframeId(null); }}
                    >✕</button>
                  </div>
                </div>

                <div className="pdf-frame-wrap">
                  {manual.url ? (
                    /*
                     * MOBILE SCROLL FIX
                     * ─────────────────
                     * On touch devices, an <iframe> inside a scrollable page will
                     * have its touch events stolen by the parent scroll container,
                     * causing only the first page of the PDF to ever be reachable.
                     *
                     * The fix: wrap the iframe in a relative-positioned div and
                     * overlay a transparent tap-target on top. On first tap the
                     * overlay activates the iframe by removing its own pointer
                     * capture (setting pointer-events: none on the overlay, and
                     * restoring pointer-events on the iframe). A global click
                     * listener on window deactivates when the user taps outside.
                     *
                     * This gives exactly the same UX as native PDF viewers:
                     *   • First tap  → activates scroll mode
                     *   • Tap outside / close → deactivates
                     */
                    <div
                      className="pdf-iframe-container"
                      style={{position:"relative"}}
                      onClick={e => e.stopPropagation()}
                    >
                      <iframe
                        src={`${R2}/${manual.url}`}
                        title={manual.name}
                        style={{
                          // When inactive on touch, the overlay sits on top and
                          // pointer-events are none on the iframe to avoid the
                          // browser treating iframe touch as page scroll.
                          pointerEvents: activeIframeId === manual.id ? "auto" : "none",
                        }}
                      />
                      {/* Activation overlay — invisible when iframe is active */}
                      {activeIframeId !== manual.id && (
                        <div
                          className="pdf-touch-overlay"
                          onClick={e => {
                            e.stopPropagation();
                            setActiveIframeId(manual.id);
                          }}
                        >
                          <div className="pdf-touch-overlay-icon">☝️</div>
                          <div className="pdf-touch-overlay-text">
                            TAP TO SCROLL PDF<br />TAP OUTSIDE TO SCROLL PAGE
                          </div>
                        </div>
                      )}
                    </div>
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
