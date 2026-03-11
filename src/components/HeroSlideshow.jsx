// ─────────────────────────────────────────────────────────────
// HeroSlideshow.jsx
// 3-slide auto-advancing banner on the home page.
// Extracted from App.jsx.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";

export default function HeroSlideshow({ allKitsCount, effectiveSignedIn, buildProgress, kitTimers, favourites, formatTimer }) {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animDir, setAnimDir] = useState(null); // "left" | "right"
  const [animating, setAnimating] = useState(false);
  const TOTAL = 3;
  const DURATION = 6000;

  // Community stats
  const [stats, setStats] = useState(null);
  // Slide 3 — recently completed with photo (resets daily at 00:00 UTC)
  const [recentCompleted, setRecentCompleted] = useState(null);

  // Fetch community stats — independent of recent-completed cache logic
  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(d => { if (d.ok) setStats(d); })
      .catch(() => {});
  }, []);

  // Fetch recent-completed — cache with UTC date key, resets at 00:00 UTC daily
  useEffect(() => {
    const todayUTC = new Date().toISOString().slice(0, 10);
    const cacheKey = "kv_recent_completed";
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (cached && cached.date === todayUTC) {
        setRecentCompleted(cached.data);
        return;
      }
    } catch (_) {}
    fetch("/api/community/recent-completed")
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.items) {
          setRecentCompleted(d.items);
          localStorage.setItem(cacheKey, JSON.stringify({ date: todayUTC, data: d.items }));
        }
      })
      .catch(() => {});
  }, []);

  const goTo = (next, dir) => {
    if (animating) return;
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setSlide(next);
      setAnimating(false);
      setAnimDir(null);
    }, 320);
  };

  const prev = () => goTo((slide - 1 + TOTAL) % TOTAL, "right");
  const next = () => goTo((slide + 1) % TOTAL, "left");

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => goTo((slide + 1) % TOTAL, "left"), DURATION);
    return () => clearTimeout(t);
  }, [slide, paused]);

  // Format total seconds → "Xh Ym" — returns "—" while still loading (null)
  const fmtTime = (s) => {
    if (s === null || s === undefined) return "—";
    if (s === 0) return "0h";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;
  };

  // Format large numbers — returns "—" while still loading (null/undefined)
  const fmt = (n) => {
    if (n === null || n === undefined) return "—";
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  };

  const slideStyle = {
    position: "absolute", inset: 0,
    transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.32s ease",
    transform: animating
      ? (animDir === "left" ? "translateX(-60px)" : "translateX(60px)")
      : "translateX(0)",
    opacity: animating ? 0 : 1,
  };

  return (
    <div
      className="hero-slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide 1: Original banner ── */}
      {slide === 0 && (
        <div style={slideStyle}>
          <div className="hero-slide-inner">
            <style>{`
              .hero-kv-title { font-family: 'Rajdhani',sans-serif; font-weight: 700; font-size: clamp(3rem, 8vw, 5.5rem); letter-spacing: 6px; line-height: 1; margin: 12px 0; }
              /* Dark (default) — blue + orange */
              .hero-kv-a1 { color: #4a9eff; }
              .hero-kv-a2 { color: #ff8844; }
              /* Light */
              [data-theme="light"] .hero-kv-a1 { color: #2a6fcc; }
              [data-theme="light"] .hero-kv-a2 { color: #e06620; }
              /* Neko / Cyber Pink */
              [data-theme="neko"] .hero-kv-a1 { color: #cc3388; }
              [data-theme="neko"] .hero-kv-a2 { color: #ff77bb; }
              /* Cat Mode — warm gold + copper */
              [data-theme="cat"] .hero-kv-a1 { color: #e8b84b; }
              [data-theme="cat"] .hero-kv-a2 { color: #d4906a; }
            `}</style>
            <div className="hero-tag">GUNPLA BUILD TRACKER</div>
            <h1 className="hero-kv-title">
              <span className="hero-kv-a1">KIT</span><span className="hero-kv-a2">VAULT</span>
            </h1>
            <p className="hero-sub">TRACK. BUILD. COMPLETE.</p>
          </div>
        </div>
      )}

      {/* ── Slide 2: Community stats ── */}
      {slide === 1 && (
        <div style={slideStyle}>
          <div className="hero-slide-inner">
            <div className="hero-tag">COMMUNITY STATS</div>
            <div className="hero-stats-grid">
              <div className="hero-stat-block">
                <div className="hero-stat-val">{fmt(allKitsCount)}</div>
                <div className="hero-stat-lbl">KITS IN LIBRARY</div>
              </div>
              <div className="hero-stat-block">
                <div className="hero-stat-val" style={{ color: "var(--gold)" }}>{fmtTime(stats?.total_build_time_seconds)}</div>
                <div className="hero-stat-lbl">TOTAL BUILD TIME</div>
              </div>
              <div className="hero-stat-block">
                <div className="hero-stat-val" style={{ color: "var(--green)" }}>{fmt(stats?.total_completed)}</div>
                <div className="hero-stat-lbl">BUILDS COMPLETED</div>
              </div>
            </div>
            <p className="hero-sub" style={{ marginTop: 12, fontSize: "0.65rem", opacity: 0.5 }}>ACROSS ALL KITVAULT BUILDERS</p>
          </div>
        </div>
      )}

      {/* ── Slide 3: Recently completed (resets daily 00:00 UTC) ── */}
      {slide === 2 && (
        <div style={slideStyle}>
          <div className="hero-slide-inner">
            <div className="hero-tag">COMPLETED TODAY</div>
            {recentCompleted && recentCompleted.length > 0 ? (
              <div className="hero-recent-grid">
                {recentCompleted.slice(0, 4).map((item, i) => (
                  <div key={i} className="hero-recent-card">
                    <img src={item.photo_url} alt={item.kit_name} className="hero-recent-img" loading="lazy" />
                    <div className="hero-recent-info">
                      <div className="hero-recent-kit">{item.kit_name}</div>
                      <div className="hero-recent-user">by {item.display_name || item.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 10, opacity: 0.3 }}>🏗</div>
                <p className="hero-sub" style={{ fontSize: "0.7rem" }}>NO COMPLETED BUILDS WITH PHOTOS TODAY YET</p>
                <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim)", marginTop: 6, letterSpacing: "1px" }}>BE THE FIRST — COMPLETE A KIT AND UPLOAD A PHOTO</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Navigation arrows ── */}
      <button className="hero-slide-arrow left" onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>
      <button className="hero-slide-arrow right" onClick={e => { e.stopPropagation(); next(); }} aria-label="Next">›</button>

      {/* ── Dot indicators ── */}
      <div className="hero-slide-dots">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            className={`hero-slide-dot${i === slide ? " active" : ""}`}
            onClick={() => goTo(i, i > slide ? "left" : "right")}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
