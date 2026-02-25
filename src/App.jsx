// ─────────────────────────────────────────────────────────────
// App.jsx  — KitVault.io
// Main app shell: routes, shared state, header, footer.
// All page components live in src/components/.
// All data lives in src/data/.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Styles
import "./styles/app.css";

// Data & constants
import {
  VERSION, GRADE_COLORS, GRADES,
  slugify, xpColors,
  GRADE_DATA, GRADE_ORDER,
} from "./data/grades.js";

// Components — each in its own file
import AdminUpload from "./components/AdminUpload.jsx";
import GradeDetail from "./components/GradeDetail.jsx";
import KitDetail from "./components/KitDetail.jsx";
import ToolPage from "./components/ToolPage.jsx";
import Gallery from "./components/Gallery.jsx";

// SEO
import useSEO, { SEO, kitSEO, gradeSEO, toolSEO } from "./hooks/useSEO.js";

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

  // ── Back to top ──────────────────────────────────────────
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
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
  const fetchD1Kits = useCallback(() => {
    fetch("/api/kits")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setD1Kits(data); })
      .catch(() => {});
  }, []);
  useEffect(() => { fetchD1Kits(); }, [fetchD1Kits]);
  // All kits now come from D1 only
  const allKits = d1Kits;

  // ── D1 sync ──────────────────────────────────────────────────
  const D1_API = "/api/progress";

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
      const next = { ...prev };
      if (prev[kitId] === status) {
        delete next[kitId]; // toggle off
      } else {
        next[kitId] = status;
      }
      localStorage.setItem("kv_progress", JSON.stringify(next));
      syncToD1({ progress: next });
      return next;
    });
  };

  // Remove kit from vault entirely (clear status + unfavourite)
  const removeFromVault = (e, kitId) => {
    e.stopPropagation();
    if (!isSignedIn) return;
    setBuildProgress(prev => {
      const next = { ...prev };
      delete next[kitId];
      localStorage.setItem("kv_progress", JSON.stringify(next));
      syncToD1({ progress: next });
      return next;
    });
    setFavourites(prev => {
      const next = prev.filter(id => id !== kitId);
      localStorage.setItem("kv_favourites", JSON.stringify(next));
      syncToD1({ favourites: next });
      return next;
    });
  };

  const setManualPage = (kitId, manualId, currentPage, totalPages) => {
    if (!isSignedIn) return;
    setPageProgress(prev => {
      const key = `${kitId}-${manualId}`;
      const next = { ...prev, [key]: { current: currentPage, total: totalPages } };
      localStorage.setItem("kv_pages", JSON.stringify(next));
      syncToD1Debounced({ pages: next });
      return next;
    });
  };

  const getKitProgress = (kit) => {
    const entries = kit.manuals.map(m => pageProgress[`${kit.id}-${m.id}`]).filter(Boolean);
    if (entries.length === 0) return null;
    const total = entries.reduce((sum, e) => sum + e.total, 0);
    const current = entries.reduce((sum, e) => sum + Math.min(e.current, e.total), 0);
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  // Memoized filtered kit list — includes allKits as dependency
  const filtered = useMemo(() => allKits.filter(k => {
    const matchGrade = gradeFilter === "ALL" || k.grade === gradeFilter;
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase()) || k.series.toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchSearch;
  }).sort((a, b) => {
    if (sortOrder === "az") return a.name.localeCompare(b.name);
    if (sortOrder === "za") return b.name.localeCompare(a.name);
    return a.id - b.id;
  }), [allKits, gradeFilter, search, sortOrder]);

  const gc = (g) => GRADE_COLORS[g] || GRADE_COLORS["HG"];
  const goHome = () => { setOpenManualId(null); navigate("/"); };
  const goVault = () => { setOpenManualId(null); navigate("/vault"); };
  const goDisclaimer = () => { setOpenManualId(null); setShowSettings(false); navigate("/disclaimer"); };

  // slugify accepts both objects and strings, so passing the kit object
  // ensures the slug includes grade + scale + name (matching KitDetail lookup)
  const goKit = (kit) => { setOpenManualId(null); navigate(`/kit/${slugify(kit)}`); };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // ── SEO — update title + meta per route ────────────────────
  const seoConfig = useMemo(() => {
    const p = location.pathname;
    if (p === "/") return SEO.home;
    if (p === "/vault") return SEO.vault;
    if (p === "/gallery") return SEO.gallery;
    if (p === "/resources") return SEO.resources;
    if (p === "/support") return SEO.support;
    if (p === "/disclaimer") return SEO.disclaimer;
    if (p === "/admin") return SEO.admin;
    if (p.startsWith("/kit/")) {
      const slug = p.replace("/kit/", "");
      const kit = allKits.find(k => slugify(k) === slug);
      return kit ? kitSEO(kit) : { title: "Kit Not Found", path: p };
    }
    if (p.startsWith("/grade/")) {
      return gradeSEO(p.replace("/grade/", ""));
    }
    if (p.startsWith("/tools/")) {
      return toolSEO(p.replace("/tools/", ""));
    }
    return SEO.home;
  }, [location.pathname, allKits]);
  useSEO(seoConfig);

  // ── Shared kit card renderer (used by home + vault) ────────
  const renderKitCard = (kit, { showBacklog = false, showRemove = false } = {}) => {
    const c = gc(kit.grade);
    const isFav = favourites.includes(kit.id);
    const progress = buildProgress[kit.id];
    const pct = getKitProgress(kit);
    return (
      <div key={kit.id} className="kit-card"
        style={{"--card-accent":c.accent,"--card-accent-bg":c.bg, position:"relative"}}
        onClick={()=>goKit(kit)}
      >
        {showRemove && (
          <button className="vault-remove-btn" onClick={e => removeFromVault(e, kit.id)} title="Remove from vault">🗑</button>
        )}
        <div className="card-grade-banner" style={{background:c.accent}} />
        <div className="card-body">
          <div className="card-top">
            <span className="grade-badge">{kit.grade}</span>
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
              {progress === "inprogress" && <span className="build-badge inprogress">IN PROGRESS</span>}
              {progress === "complete" && <span className="build-badge complete">COMPLETE</span>}
              {showBacklog && (!progress || progress === "backlog") && (
                <span className="build-badge" style={{background:"rgba(90,122,159,0.15)",border:"1px solid rgba(90,122,159,0.4)",color:"var(--text-dim)",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",padding:"2px 8px",letterSpacing:"1px"}}>BACKLOG</span>
              )}
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
          {isSignedIn && pct !== null && (() => {
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

              {/* GALLERY */}
              <button className="nav-btn" onClick={() => { closeNav(); navigate("/gallery"); }} style={{color: location.pathname==="/gallery" ? "var(--accent)" : ""}}>
                GALLERY
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
                    {slug:"mgsd", label:"MGSD — Master Grade SD", sub:"MG inner frame with SD proportions. Best of both", color:"#ff6677"},
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
                    <input className="search-input" placeholder="Search for Kits" value={search} onChange={e=>setSearch(e.target.value)} />
                  </div>
                </div>
                <div className="controls-row">
                  <span className="controls-label">GRADE</span>
                  {GRADES.map(g => {
                    const c = GRADE_COLORS[g];
                    const isActive = gradeFilter === g;
                    const accent = g === "ALL" ? "var(--accent)" : c?.accent || "var(--accent)";
                    return (
                      <button
                        key={g}
                        className={`filter-btn ${isActive?"active":""}`}
                        style={isActive ? { borderColor: accent, color: accent, background: `${c?.bg || "rgba(0,170,255,0.08)"}`, boxShadow: `0 0 12px ${accent}33` } : {}}
                        onClick={()=>setGradeFilter(g)}
                      >{g}</button>
                    );
                  })}
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
                {filtered.map(kit => renderKitCard(kit))}
              </div>
            </>
          } />

          {/* ===== KIT DETAIL PAGE ===== */}
          <Route path="/kit/:slug" element={
            <KitDetail
              allKits={allKits} isSignedIn={isSignedIn} user={user}
              favourites={favourites} buildProgress={buildProgress}
              pageProgress={pageProgress} toggleFavourite={toggleFavourite}
              setBuildStatus={setBuildStatus} setManualPage={setManualPage}
              openManualId={openManualId} toggleManual={toggleManual}
              setOpenManualId={setOpenManualId} goHome={goHome}
              onKitUpdated={fetchD1Kits}
            />
          } />

          {/* ===== MY VAULT PAGE ===== */}
          <Route path="/vault" element={
            <>
              {(() => {
                const vaultKits = allKits.filter(k =>
                  favourites.includes(k.id) ||
                  buildProgress[k.id] === "inprogress" ||
                  buildProgress[k.id] === "complete" ||
                  buildProgress[k.id] === "backlog"
                );
                const inProgress = vaultKits.filter(k => buildProgress[k.id] === "inprogress");
                const complete   = vaultKits.filter(k => buildProgress[k.id] === "complete");
                const backlog    = vaultKits.filter(k =>
                  buildProgress[k.id] === "backlog" ||
                  (!buildProgress[k.id] && favourites.includes(k.id))
                );

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
                            <div className="vault-grid" style={{padding:"0 0 32px"}}>{inProgress.map(k => renderKitCard(k, { showBacklog: true, showRemove: true }))}</div>
                          </>
                        )}
                        {complete.length > 0 && (
                          <>
                            <div className="section-header" style={{padding:"0 0 20px",marginBottom:"4px"}}>
                              <span className="section-title" style={{color:"var(--green)"}}>✓ COMPLETED</span>
                              <div className="section-line" />
                              <span className="section-count">{complete.length} KIT{complete.length!==1?"S":""}</span>
                            </div>
                            <div className="vault-grid" style={{padding:"0 0 32px"}}>{complete.map(k => renderKitCard(k, { showBacklog: true, showRemove: true }))}</div>
                          </>
                        )}
                        {backlog.length > 0 && (
                          <>
                            <div className="section-header" style={{padding:"0 0 20px",marginBottom:"4px"}}>
                              <span className="section-title" style={{color:"var(--text-dim)"}}>◻ BACKLOG</span>
                              <div className="section-line" />
                              <span className="section-count">{backlog.length} KIT{backlog.length!==1?"S":""}</span>
                            </div>
                            <div className="vault-grid" style={{padding:"0 0 32px"}}>{backlog.map(k => renderKitCard(k, { showBacklog: true, showRemove: true }))}</div>
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

          {/* ===== GALLERY PAGE ===== */}
          <Route path="/gallery" element={<Gallery allKits={allKits} />} />

          {/* ===== SUPPORT / DONATE PAGE ===== */}
          <Route path="/support" element={
            <>
              <div className="page-hero">
                <div className="page-tag">KEEP THE VAULT ONLINE</div>
                <div className="page-title">BECOME A <span style={{color:"var(--gold, #ffcc00)"}}>SUPPORTER</span></div>
                <div className="page-sub">YOUR SUPPORT MAKES IT POSSIBLE TO KEEP THIS PROJECT ALIVE</div>
              </div>
              <div style={{padding:"0 40px 60px",maxWidth:900,margin:"0 auto"}}>
                <div data-support-grid="" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,alignItems:"start"}}>
                  {/* Ko-fi embed */}
                  <div style={{background:"#fff",borderRadius:8,overflow:"hidden",minHeight:400}}>
                    <iframe
                      id="kofiframe"
                      src="https://ko-fi.com/kitvault1/?hidefeed=true&widget=true&embed=true&preview=true"
                      style={{border:"none",width:"100%",padding:4,background:"#fff",minHeight:500}}
                      title="Support KitVault on Ko-fi"
                    />
                  </div>
                  {/* Info panel */}
                  <div style={{fontFamily:"'Share Tech Mono',monospace"}}>
                    <div style={{fontSize:"0.85rem",color:"var(--gold, #ffcc00)",letterSpacing:"2px",marginBottom:16,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>Where Does The Money Go?</div>
                    <div style={{fontSize:"0.68rem",color:"#9ab0cc",lineHeight:2,marginBottom:24,letterSpacing:"0.3px"}}>
                      Straight into keeping KitVault alive. Server costs, domain fees, bandwidth for hosting all those PDFs — 
                      turns out running a manual archive isn't free. Shocking, I know. Zero goes toward P-Bandai exclusives 
                      (unfortunately).
                    </div>

                    <div style={{fontSize:"0.85rem",color:"var(--gold, #ffcc00)",letterSpacing:"2px",marginBottom:16,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>Why No Ads?</div>
                    <div style={{fontSize:"0.68rem",color:"#9ab0cc",lineHeight:2,marginBottom:24,letterSpacing:"0.3px"}}>
                      Because nothing ruins the vibe of reading a PG manual like a popup asking if you want to refinance your mortgage.
                      KitVault has been ad-free since day one and that's not changing. Your tips are what make that possible.
                    </div>

                    <div style={{fontSize:"0.85rem",color:"var(--gold, #ffcc00)",letterSpacing:"2px",marginBottom:16,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>What's In It For You?</div>
                    <div style={{fontSize:"0.68rem",color:"#9ab0cc",lineHeight:2,marginBottom:24,letterSpacing:"0.3px"}}>
                      The warm fuzzy feeling of knowing you kept a niche hobby site running. Think of it like panel lining — 
                      it's a small detail but it makes everything look way better. Also you get bragging rights. 
                      That's basically the hobby equivalent of a gold-plated inner frame.
                    </div>

                    <div style={{fontSize:"0.68rem",color:"var(--text-dim, #5a7a9f)",lineHeight:2,borderTop:"1px solid var(--border, #1a2f50)",paddingTop:16,letterSpacing:"0.3px"}}>
                      Even $3 helps more than you think. That's less than a pack of Gundam Markers and arguably more useful. ☕
                    </div>
                  </div>
                </div>

                {/* Mobile: responsive stack */}
                <style>{`@media(max-width:768px){[data-support-grid]{grid-template-columns:1fr !important;}}`}</style>
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

          {/* ===== ALL TOOL PAGES (single dynamic route) ===== */}
          <Route path="/tools/:toolSlug" element={<ToolPage />} />

          {/* ===== ADMIN ===== */}
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
                    <button className="btn-donate" onClick={() => { setShowSettings(false); navigate("/support"); }}>
                      ☕ SUPPORT KITVAULT
                    </button>
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
          <button
            onClick={() => navigate("/support")}
            style={{
              background: "rgba(255,204,0,0.08)", border: "1px solid rgba(255,204,0,0.25)",
              color: "var(--gold, #ffcc00)", fontFamily: "'Share Tech Mono',monospace",
              fontSize: "0.55rem", padding: "6px 14px", cursor: "pointer",
              letterSpacing: "1px", transition: "all 0.2s", display: "inline-flex",
              alignItems: "center", gap: 6,
            }}
          >☕ SUPPORT KITVAULT</button>
          <span>© GUNDAM IP / BANDAI NAMCO · SOTSU · SUNRISE</span>
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem"}}>{VERSION}</span>
        </footer>

        {/* BACK TO TOP */}
        <button
          className={`back-to-top${showBackToTop ? " visible" : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Back to top"
        >↑</button>

      </div>
    </>
  );
}
