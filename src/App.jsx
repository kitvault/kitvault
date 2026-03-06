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
import Hangar from "./components/Hangar.jsx";

// SEO
import useSEO, { SEO, kitSEO, gradeSEO, toolSEO, hangarSEO } from "./hooks/useSEO.js";

// ─────────────────────────────────────────────────────────────
// SPRITE ROSTER
// ─────────────────────────────────────────────────────────────
const SPRITES = [
  { id: "rx78", name: "RX-78-2", series: "Mobile Suit Gundam", cost: 0, free: true, rarity: "STARTER", rarityColor: "#aabbcc", colors: { primary: "#4a7aff", accent: "#ff3311", badge: "#ffcc00" } },
  { id: "wingzero", name: "Wing Zero", series: "Gundam Wing", cost: 150, free: false, rarity: "RARE", rarityColor: "#00aaff", colors: { primary: "#e8eeff", accent: "#ffcc00", badge: "#00aaff" } },
  { id: "unicorn", name: "Unicorn", series: "Gundam UC", cost: 200, free: false, rarity: "RARE", rarityColor: "#00aaff", colors: { primary: "#c8d8ff", accent: "#0066ff", badge: "#88ccff" } },
  { id: "barbatos", name: "Barbatos", series: "Iron-Blooded Orphans", cost: 150, free: false, rarity: "RARE", rarityColor: "#00aaff", colors: { primary: "#8899aa", accent: "#ff6600", badge: "#cc4400" } },
  { id: "exia", name: "Exia", series: "Gundam 00", cost: 300, free: false, rarity: "EPIC", rarityColor: "#cc44ff", colors: { primary: "#2244cc", accent: "#00ffcc", badge: "#88ffee" } },
  { id: "sazabi", name: "Sazabi", series: "Char's Counterattack", cost: 400, free: false, rarity: "EPIC", rarityColor: "#cc44ff", colors: { primary: "#cc1111", accent: "#ff6600", badge: "#ff4400" } },
];
const SPRITE_BASE = "https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sprites";

function ChibiSprite({ sprite, size = 48, bob = false }) {
  const [imgError, setImgError] = useState(false);
  if (!imgError) {
    return (
      <div style={{
        width: size, height: size,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        animation: bob ? "kvBob 1.8s ease-in-out infinite" : "none",
      }}>
        <img
          src={`${SPRITE_BASE}/${sprite.id}.png`}
          alt={sprite.name}
          style={{
            width: "100%", height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            display: "block",
          }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }
  // Fallback placeholder
  return (
    <div style={{
      width: size, height: size,
      position: "relative", imageRendering: "pixelated", flexShrink: 0,
      animation: bob ? "kvBob 1.8s ease-in-out infinite" : "none",
    }}>
      <div style={{ position: "absolute", top: 0, left: "25%", width: "50%", height: "30%", background: sprite.colors.primary, border: "1px solid #111" }}>
        <div style={{ position: "absolute", top: "35%", left: "10%", width: "30%", height: "30%", background: sprite.colors.badge, border: "1px solid #000" }} />
        <div style={{ position: "absolute", top: "35%", right: "10%", width: "30%", height: "30%", background: sprite.colors.badge, border: "1px solid #000" }} />
        <div style={{ position: "absolute", top: "-60%", left: "35%", width: "30%", height: "65%", background: sprite.colors.accent, border: "1px solid #111", clipPath: "polygon(20% 0%,80% 0%,100% 100%,0% 100%)" }} />
      </div>
      <div style={{ position: "absolute", top: "30%", left: "15%", width: "70%", height: "38%", background: sprite.colors.primary, border: "1px solid #111" }}>
        <div style={{ position: "absolute", top: "20%", left: "37%", width: "26%", height: "30%", background: sprite.colors.accent, border: "1px solid #111" }} />
      </div>
      <div style={{ position: "absolute", top: "30%", left: 0, width: "14%", height: "32%", background: sprite.colors.primary, border: "1px solid #111" }} />
      <div style={{ position: "absolute", top: "30%", right: 0, width: "14%", height: "32%", background: sprite.colors.primary, border: "1px solid #111" }} />
      <div style={{ position: "absolute", top: "68%", left: "18%", width: "26%", height: "32%", background: sprite.colors.primary, border: "1px solid #111" }} />
      <div style={{ position: "absolute", top: "68%", right: "18%", width: "26%", height: "32%", background: sprite.colors.primary, border: "1px solid #111" }} />
      <div style={{ position: "absolute", bottom: 0, left: "14%", width: "30%", height: "10%", background: sprite.colors.accent, border: "1px solid #111" }} />
      <div style={{ position: "absolute", bottom: 0, right: "14%", width: "30%", height: "10%", background: sprite.colors.accent, border: "1px solid #111" }} />
    </div>
  );
}

function MarqueeStrip({ ownedSprites }) {
  if (!ownedSprites || ownedSprites.length === 0) return null;
  const tripled = [...ownedSprites, ...ownedSprites, ...ownedSprites];
  const duration = Math.max(12, ownedSprites.length * 4);
  return (
    <div className="marquee-strip">
      <div className="marquee-fade-left" />
      <div className="marquee-fade-right" />
      <div style={{ display: "flex", alignItems: "flex-end", width: "300%", animation: `kvMarquee ${duration}s linear infinite` }}>
        {tripled.map((sprite, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flex: `0 0 calc(100% / ${tripled.length})` }}>
            <ChibiSprite sprite={sprite} size={64} bob={true} />
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.38rem", color: sprite.colors.badge, letterSpacing: "1.5px", whiteSpace: "nowrap" }}>{sprite.name.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomizeModal({ onClose, ownedIds, paradeIds, xp, onPurchaseComplete, onParadeChange, userId }) {
  const [localXp, setLocalXp] = useState(xp);
  const [localOwned, setLocalOwned] = useState(ownedIds);
  const [localParade, setLocalParade] = useState(paradeIds || ownedIds);
  const [buying, setBuying] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [justBought, setJustBought] = useState(null);
  const [error, setError] = useState(null);

  // Always fetch fresh XP + parade state when modal opens
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/xp?user_id=${userId}`)
      .then(r => r.json())
      .then(data => {
        setLocalXp(data.xp || 0);
        setLocalOwned(data.sprites || []);
        setLocalParade(data.parade || data.sprites || []);
      })
      .catch(() => { });
  }, [userId]);

  const handleBuy = async (sprite) => {
    if (buying || localOwned.includes(sprite.id)) return;
    setBuying(sprite.id); setError(null);
    try {
      const res = await fetch("/api/sprites/buy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: userId, sprite_id: sprite.id }) });
      const data = await res.json();
      if (data.ok) {
        setLocalOwned(prev => [...prev, sprite.id]);
        setLocalParade(prev => [...prev, sprite.id]); // auto-add to parade on purchase
        setLocalXp(data.xp);
        setJustBought(sprite.id);
        setTimeout(() => setJustBought(null), 1500);
        onPurchaseComplete(sprite.id, data.xp);
        onParadeChange(sprite.id, true);
      } else { setError(data.error || "Purchase failed"); }
    } catch (err) { setError(err.message); }
    setBuying(null);
  };

  const handleToggleParade = async (sprite) => {
    if (toggling) return;
    const isActive = localParade.includes(sprite.id);
    setToggling(sprite.id); setError(null);
    try {
      const res = await fetch("/api/sprites/toggle-parade", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: userId, sprite_id: sprite.id, active: !isActive }) });
      const data = await res.json();
      if (data.ok) {
        setLocalParade(prev => isActive ? prev.filter(id => id !== sprite.id) : [...prev, sprite.id]);
        onParadeChange(sprite.id, !isActive);
      } else { setError(data.error || "Failed"); }
    } catch (err) { setError(err.message); }
    setToggling(null);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,5,18,0.92)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "linear-gradient(160deg,#0a1628 0%,#070f1e 100%)", border: "1px solid rgba(0,170,255,0.3)", borderRadius: 2, width: "100%", maxWidth: 1100, maxHeight: "95vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 0 80px rgba(0,170,255,0.15)", clipPath: "polygon(0 0,97% 0,100% 3%,100% 100%,3% 100%,0 97%)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "28px 40px 22px", borderBottom: "1px solid rgba(0,170,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,170,255,0.04)" }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.75rem", color: "#00aaff", letterSpacing: "3px", marginBottom: 8 }}>◈ ROSTER CUSTOMIZATION</div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "2rem", color: "#ffcc00", letterSpacing: "4px" }}>ROSTER</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ background: "rgba(255,204,0,0.08)", border: "1px solid rgba(255,204,0,0.3)", padding: "14px 28px", fontFamily: "'Share Tech Mono',monospace" }}>
              <div style={{ fontSize: "0.65rem", color: "#ffcc00", letterSpacing: "2px", marginBottom: 4 }}>YOUR XP</div>
              <div style={{ fontSize: "1.6rem", color: "#ffcc00", letterSpacing: "2px" }}>{localXp.toLocaleString()}</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#5a7a9f", fontFamily: "'Share Tech Mono',monospace", fontSize: "1rem", width: 42, height: 42, cursor: "pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ padding: "14px 40px", borderBottom: "1px solid rgba(0,170,255,0.08)", display: "flex", gap: 32, alignItems: "center", background: "rgba(0,0,0,0.2)", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "#1a3a5a", letterSpacing: "2px" }}>EARN XP BY:</span>
          {[{ label: "POST TO GALLERY", xp: "+50 XP" }, { label: "LEAVE A COMMENT", xp: "+10 XP" }].map(a => (
            <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "#5a7a9f", letterSpacing: "1.5px" }}>{a.label}</span>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "#ffcc00", letterSpacing: "1px" }}>{a.xp}</span>
            </div>
          ))}
        </div>
        {error && <div style={{ padding: "10px 40px", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "#ff2244", background: "rgba(255,34,68,0.06)" }}>{error}</div>}
        <div style={{ padding: "28px 40px", overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 20, flex: 1 }}>
          {SPRITES.map(sprite => {
            const owned = localOwned.includes(sprite.id);
            const inParade = localParade.includes(sprite.id);
            const canAfford = localXp >= sprite.cost;
            const isBuying = buying === sprite.id;
            const boughtAnim = justBought === sprite.id;
            return (
              <div key={sprite.id} style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${owned ? sprite.colors.badge + "44" : "rgba(255,255,255,0.06)"}`, borderRadius: 2, padding: "24px 20px 20px", position: "relative", clipPath: "polygon(0 0,94% 0,100% 6%,100% 100%,6% 100%,0 94%)", animation: boughtAnim ? "kvPurchasePop 0.5s cubic-bezier(0.175,0.885,0.32,1.275)" : "none" }}>
                {owned && <div style={{ position: "absolute", top: 10, right: 10, fontFamily: "'Share Tech Mono',monospace", fontSize: "0.58rem", color: "#00ff88", letterSpacing: "1px", border: "1px solid #00ff8844", padding: "3px 8px" }}>✓ OWNED</div>}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, marginTop: 8 }}>
                  <div style={{ filter: owned ? `drop-shadow(0 0 8px ${sprite.colors.accent}99)` : "none" }}>
                    <ChibiSprite sprite={sprite} size={96} />
                  </div>
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace" }}>
                  <div style={{ fontSize: "0.9rem", color: owned ? sprite.colors.badge : "#c8ddf5", letterSpacing: "1.5px", marginBottom: 6 }}>{sprite.name.toUpperCase()}</div>
                  <div style={{ fontSize: "0.62rem", color: "#1a3a5a", letterSpacing: "1px", marginBottom: 16 }}>{sprite.series.toUpperCase()}</div>
                  {owned ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button
                        onClick={() => handleToggleParade(sprite)}
                        disabled={toggling === sprite.id}
                        style={{
                          width: "100%", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                          padding: "11px", cursor: "pointer", letterSpacing: "1.5px", transition: "all 0.2s",
                          background: inParade ? "rgba(0,255,136,0.08)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${inParade ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)"}`,
                          color: inParade ? "#00ff88" : "#3a5a7a",
                        }}
                      >
                        {toggling === sprite.id ? "..." : inParade ? "● IN PARADE — CLICK TO HIDE" : "○ HIDDEN — CLICK TO SHOW"}
                      </button>
                    </div>
                  ) : sprite.free ? (
                    <button onClick={() => handleBuy(sprite)} disabled={isBuying} style={{ width: "100%", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", color: "#00ff88", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.68rem", padding: "12px", cursor: "pointer", letterSpacing: "1.5px" }}>✦ FREE — ADD TO ROSTER</button>
                  ) : (
                    <button onClick={() => handleBuy(sprite)} disabled={!canAfford || isBuying} style={{ width: "100%", background: canAfford ? "rgba(255,204,0,0.08)" : "rgba(0,0,0,0.2)", border: `1px solid ${canAfford ? "rgba(255,204,0,0.35)" : "rgba(255,255,255,0.06)"}`, color: canAfford ? "#ffcc00" : "#2a3a5a", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.68rem", padding: "12px", cursor: canAfford ? "pointer" : "not-allowed", letterSpacing: "1.5px" }}>
                      {isBuying ? "UNLOCKING..." : canAfford ? `⭐ ${sprite.cost} XP — UNLOCK` : `⭐ ${sprite.cost} XP — NOT ENOUGH`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GuestCustomizeTeaser({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,5,18,0.92)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "linear-gradient(160deg,#0a1628,#070f1e)", border: "1px solid rgba(0,170,255,0.25)", padding: "48px 56px", textAlign: "center", maxWidth: 420, clipPath: "polygon(0 0,96% 0,100% 4%,100% 100%,4% 100%,0 96%)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 28, filter: "blur(2px) opacity(0.45)" }}>
          {SPRITES.slice(0, 4).map(s => <ChibiSprite key={s.id} sprite={s} size={40} />)}
        </div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "#00aaff", letterSpacing: "3px", marginBottom: 12 }}>◈ ROSTER CUSTOMIZATION</div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "1rem", color: "#c8ddf5", letterSpacing: "3px", marginBottom: 8 }}>COLLECT <span style={{ color: "#ffcc00" }}>SPRITES</span></div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "#3a5a7a", letterSpacing: "1.5px", lineHeight: 2.2, marginBottom: 28 }}>EARN XP BY POSTING TO THE GALLERY<br />AND COMMENTING · SPEND XP TO UNLOCK<br />SPRITES THAT PARADE ABOVE THE VAULT</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#1a3a5a", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.42rem", cursor: "pointer", letterSpacing: "1px" }}>DISMISS</button>
      </div>
    </div>
  );
}

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
// FALLBACK LOGIN MODAL — email/password login when Clerk is down
// ─────────────────────────────────────────────────────────────
function FallbackLoginModal({ onClose, onLogin, onSignup, clerkFailed }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => { setEmail(""); setPassword(""); setConfirmPassword(""); setError(""); };

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Enter both email and password"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Invalid email format"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }

    if (mode === "signup") {
      if (password !== confirmPassword) { setError("Passwords don't match"); return; }
      setLoading(true);
      const result = await onSignup(email, password);
      if (result.ok) { onClose(); } else { setError(result.error); }
      setLoading(false);
    } else {
      setLoading(true);
      const result = await onLogin(email, password);
      if (result.ok) { onClose(); } else { setError(result.error); }
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,5,18,0.92)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "linear-gradient(160deg,#0a1628 0%,#070f1e 100%)", border: "1px solid rgba(0,170,255,0.3)", borderRadius: 2, width: "100%", maxWidth: 420, padding: "36px 32px", boxShadow: "0 0 80px rgba(0,170,255,0.15)", clipPath: "polygon(0 0,96% 0,100% 4%,100% 100%,4% 100%,0 96%)", position: "relative" }} onClick={e => e.stopPropagation()}>

        {clerkFailed && (
          <div style={{ background: "rgba(255,170,0,0.08)", border: "1px solid rgba(255,170,0,0.3)", padding: "10px 14px", marginBottom: 20, fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", color: "#ffaa00", letterSpacing: "0.5px", lineHeight: 1.8 }}>
            ⚠ Our primary sign-in service is temporarily unavailable. Use your backup login or create a new account below.
          </div>
        )}

        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "#00aaff", letterSpacing: "3px", marginBottom: 8 }}>◈ KITVAULT ACCOUNT</div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => { setMode("login"); resetFields(); }}
            style={{
              flex: 1, background: mode === "login" ? "rgba(0,170,255,0.08)" : "transparent",
              border: "none", borderBottom: mode === "login" ? "2px solid #00aaff" : "2px solid transparent",
              color: mode === "login" ? "#00aaff" : "#3a5a7a",
              fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 0",
              cursor: "pointer", letterSpacing: "2px", transition: "all 0.2s",
            }}
          >SIGN IN</button>
          <button
            onClick={() => { setMode("signup"); resetFields(); }}
            style={{
              flex: 1, background: mode === "signup" ? "rgba(0,255,136,0.06)" : "transparent",
              border: "none", borderBottom: mode === "signup" ? "2px solid #00ff88" : "2px solid transparent",
              color: mode === "signup" ? "#00ff88" : "#3a5a7a",
              fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 0",
              cursor: "pointer", letterSpacing: "2px", transition: "all 0.2s",
            }}
          >SIGN UP</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "1px", marginBottom: 4 }}>EMAIL</div>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              onKeyDown={e => e.key === "Enter" && (mode === "login" || confirmPassword) && handleSubmit()}
              style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 12px", letterSpacing: "0.5px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "1px", marginBottom: 4 }}>PASSWORD{mode === "signup" ? " (8+ CHARACTERS)" : ""}</div>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && mode === "login" && handleSubmit()}
              style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 12px", letterSpacing: "0.5px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {mode === "signup" && (
            <div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "1px", marginBottom: 4 }}>CONFIRM PASSWORD</div>
              <input
                type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 12px", letterSpacing: "0.5px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          )}

          {error && (
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", color: "#ff3c3c", letterSpacing: "0.5px" }}>{error}</div>
          )}

          <button
            onClick={handleSubmit} disabled={loading}
            style={{
              width: "100%",
              background: mode === "signup" ? "rgba(0,255,136,0.1)" : "rgba(0,170,255,0.1)",
              border: `1px solid ${mode === "signup" ? "rgba(0,255,136,0.3)" : "rgba(0,170,255,0.3)"}`,
              color: mode === "signup" ? "#00ff88" : "#00aaff",
              fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "12px",
              cursor: loading ? "wait" : "pointer", letterSpacing: "2px", marginTop: 4,
            }}
          >
            {loading ? (mode === "signup" ? "CREATING ACCOUNT..." : "SIGNING IN...") : (mode === "signup" ? "CREATE ACCOUNT →" : "SIGN IN →")}
          </button>

          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "0.5px", lineHeight: 1.8, textAlign: "center", marginTop: 4 }}>
            {mode === "login"
              ? "Don't have an account? Click SIGN UP above."
              : "Already have an account? Click SIGN IN above."
            }
          </div>
        </div>

        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#5a7a9f", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.8rem", width: 32, height: 32, cursor: "pointer" }}>✕</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BACKUP AUTH SETUP — shown on Vault page and Settings modal
// ─────────────────────────────────────────────────────────────
function BackupAuthSetup({ onRegister, hasBackupAuth, backupAuthEmail, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (hasBackupAuth) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem" }}>
        <span style={{ color: "#00ff88", letterSpacing: "1px" }}>✓ BACKUP LOGIN ACTIVE</span>
        <span style={{ color: "var(--text-dim,#5a7a9f)", letterSpacing: "0.5px" }}>{backupAuthEmail}</span>
      </div>
    );
  }

  if (!expanded) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => setExpanded(true)}
            style={{ background: "rgba(255,170,0,0.08)", border: "1px solid rgba(255,170,0,0.3)", color: "#ffaa00", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", padding: "8px 14px", cursor: "pointer", letterSpacing: "1px" }}
          >
            🔑 SET UP BACKUP LOGIN
          </button>
          {!compact && (
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "0.5px" }}>
              Access your vault even if our sign-in provider is down
            </span>
          )}
        </div>
      </div>
    );
  }

  const handleRegister = async () => {
    setError(""); setSuccess("");
    if (!email || !password) { setError("Email and password required"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Invalid email format"); return; }

    setLoading(true);
    const result = await onRegister(email, password);
    if (result.ok) {
      setSuccess("✓ Backup login created!");
      setEmail(""); setPassword(""); setConfirmPassword("");
      setTimeout(() => setExpanded(false), 2000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "rgba(255,170,0,0.04)", border: "1px solid rgba(255,170,0,0.15)", padding: "16px 14px" }}>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", color: "#ffaa00", letterSpacing: "1.5px" }}>🔑 SET UP BACKUP LOGIN</div>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "0.5px", lineHeight: 1.8 }}>
        Add an email and password so you can log in even if our primary sign-in service goes down. This links to your existing account.
      </div>

      <div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "1px", marginBottom: 3 }}>EMAIL</div>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
          style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "8px 10px", outline: "none", boxSizing: "border-box" }}
        />
      </div>
      <div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "1px", marginBottom: 3 }}>PASSWORD (8+ CHARACTERS)</div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
          style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "8px 10px", outline: "none", boxSizing: "border-box" }}
        />
      </div>
      <div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "1px", marginBottom: 3 }}>CONFIRM PASSWORD</div>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
          onKeyDown={e => e.key === "Enter" && handleRegister()}
          style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "8px 10px", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {error && <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "#ff3c3c" }}>{error}</div>}
      {success && <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "#00ff88" }}>{success}</div>}

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleRegister} disabled={loading}
          style={{ background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)", color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", padding: "8px 16px", cursor: loading ? "wait" : "pointer", letterSpacing: "1px" }}
        >
          {loading ? "SAVING..." : "✦ CREATE BACKUP LOGIN"}
        </button>
        <button onClick={() => { setExpanded(false); setError(""); }}
          style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-dim,#5a7a9f)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", padding: "8px 12px", cursor: "pointer", letterSpacing: "1px" }}
        >
          CANCEL
        </button>
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

  // ── Fallback Auth State ─────────────────────────────────────
  const [clerkFailed, setClerkFailed] = useState(false);
  const [fallbackToken, setFallbackToken] = useState(null);
  const [fallbackUserId, setFallbackUserId] = useState(null);
  const [fallbackEmail, setFallbackEmail] = useState(null);
  const [hasBackupAuth, setHasBackupAuth] = useState(false);
  const [backupAuthEmail, setBackupAuthEmail] = useState(null);

  // Detect if Clerk failed to load (check after 5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      const clerkLoaded = document.querySelector("[data-clerk-loaded]") ||
        document.querySelector(".cl-userButtonBox") ||
        document.querySelector(".cl-signInButton") ||
        isSignedIn;
      if (!clerkLoaded && !isSignedIn) {
        setClerkFailed(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isSignedIn]);

  // When Clerk signs in, clear fallback state
  useEffect(() => {
    if (isSignedIn) {
      setClerkFailed(false);
      setFallbackToken(null);
      setFallbackUserId(null);
      setFallbackEmail(null);
    }
  }, [isSignedIn]);

  // Effective auth — works with either Clerk or fallback
  const effectiveUserId = isSignedIn ? user?.id : fallbackUserId;
  const effectiveSignedIn = isSignedIn || !!fallbackUserId;

  // Check if current user has backup auth set up
  useEffect(() => {
    if (!effectiveUserId) return;
    fetch(`/api/auth/check?userId=${effectiveUserId}`)
      .then(r => r.json())
      .then(data => {
        setHasBackupAuth(data.hasBackupAuth || false);
        setBackupAuthEmail(data.email || null);
      })
      .catch(() => { });
  }, [effectiveUserId]);

  // Fallback login handler
  const handleFallbackLogin = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.ok) {
      setFallbackToken(data.token);
      setFallbackUserId(data.userId);
      setFallbackEmail(email);
      return { ok: true };
    }
    return { ok: false, error: data.error || "Login failed" };
  };

  // Fallback logout
  const handleFallbackLogout = () => {
    setFallbackToken(null);
    setFallbackUserId(null);
    setFallbackEmail(null);
  };

  // Register backup auth
  const handleRegisterBackup = async (email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: effectiveUserId, email, password }),
    });
    const data = await res.json();
    if (data.ok) {
      setHasBackupAuth(true);
      setBackupAuthEmail(email.replace(/^(.{2})(.*)(@.*)$/, "$1***$3"));
      return { ok: true };
    }
    return { ok: false, error: data.error || "Registration failed" };
  };

  // Signup — create a new standalone local account
  const handleFallbackSignup = async (email, password) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.ok) {
      setFallbackToken(data.token);
      setFallbackUserId(data.userId);
      setFallbackEmail(email);
      setHasBackupAuth(true);
      setBackupAuthEmail(email.replace(/^(.{2})(.*)(@.*)$/, "$1***$3"));
      return { ok: true };
    }
    return { ok: false, error: data.error || "Signup failed" };
  };
  const [openNav, setOpenNav] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFallbackLogin, setShowFallbackLogin] = useState(false);
  const toggleNav = (name) => setOpenNav(prev => prev === name ? null : name);
  const closeNav = () => setOpenNav(null);
  const closeMobileMenu = () => { setMobileMenuOpen(false); closeNav(); };
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

  // ── Theme persistence ──────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("kv-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    // Ensure Google Fonts load (Firefox fallback if CSS @import fails in Vite bundle)
    if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Rajdhani"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap";
      document.head.appendChild(link);
    }
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
      .catch(() => { });
  }, []);
  useEffect(() => { fetchD1Kits(); }, [fetchD1Kits]);
  // All kits now come from D1 only
  const allKits = d1Kits;

  // ── XP + Sprites ─────────────────────────────────────────────
  const [xp, setXp] = useState(0);
  const [ownedSpriteIds, setOwnedSpriteIds] = useState([]);
  const [paradeIds, setParadeIds] = useState([]);
  const [showCustomize, setShowCustomize] = useState(false);

  const fetchXpAndSprites = useCallback(async () => {
    if (!effectiveSignedIn || !effectiveUserId) return;
    try {
      const res = await fetch(`/api/xp?user_id=${effectiveUserId}`);
      const data = await res.json();
      setXp(data.xp || 0);
      setOwnedSpriteIds(data.sprites || []);
      setParadeIds(data.parade || data.sprites || []);
    } catch (_) { }
  }, [effectiveSignedIn, effectiveUserId]);

  useEffect(() => { fetchXpAndSprites(); }, [fetchXpAndSprites]);

  useEffect(() => { if (effectiveUserId) window.__kvUserId = effectiveUserId; }, [effectiveUserId]);

  const ownedSprites = SPRITES.filter(s => ownedSpriteIds.includes(s.id));
  const paradeSprites = SPRITES.filter(s => paradeIds.includes(s.id));

  // ── Hangar Profile ───────────────────────────────────────────
  const [hangarProfile, setHangarProfile] = useState(null);
  const [hangarUsername, setHangarUsername] = useState("");
  const [hangarDisplayName, setHangarDisplayName] = useState("");
  const [hangarBio, setHangarBio] = useState("");
  const [hangarIsPublic, setHangarIsPublic] = useState(false);
  const [hangarSaving, setHangarSaving] = useState(false);
  const [hangarMsg, setHangarMsg] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const fetchHangarProfile = useCallback(async () => {
    if (!effectiveSignedIn || !effectiveUserId) return;
    try {
      const res = await fetch(`/api/hangar/profile?user_id=${effectiveUserId}`);
      const data = await res.json();
      if (data.ok && data.profile) {
        setHangarProfile(data.profile);
        setHangarUsername(data.profile.username || "");
        setHangarDisplayName(data.profile.display_name || "");
        setHangarBio(data.profile.bio || "");
        setHangarIsPublic(!!data.profile.is_public);
      }
    } catch (_) { }
  }, [effectiveSignedIn, effectiveUserId]);

  useEffect(() => { fetchHangarProfile(); }, [fetchHangarProfile]);

  // Username availability check (debounced)
  const usernameCheckTimer = useRef(null);
  const checkUsername = (val) => {
    setHangarUsername(val);
    setUsernameAvailable(null);
    setHangarMsg("");
    if (usernameCheckTimer.current) clearTimeout(usernameCheckTimer.current);
    const clean = val.trim().toLowerCase();
    if (clean.length < 3) { setUsernameAvailable(null); return; }
    if (!/^[a-z0-9_-]{3,24}$/.test(clean)) { setUsernameAvailable(false); setHangarMsg("Letters, numbers, _ and - only"); return; }
    // Skip check if unchanged from saved profile
    if (hangarProfile && clean === hangarProfile.username) { setUsernameAvailable(true); return; }
    usernameCheckTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/hangar/check-username?username=${clean}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
        if (!data.available) setHangarMsg("Username taken");
      } catch (_) { }
    }, 400);
  };

  const saveHangarProfile = async () => {
    if (!effectiveUserId || !hangarUsername.trim()) return;
    setHangarSaving(true);
    setHangarMsg("");
    try {
      const res = await fetch("/api/hangar/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: effectiveUserId,
          username: hangarUsername.trim().toLowerCase(),
          display_name: hangarDisplayName.trim(),
          avatar_url: user?.imageUrl || "",
          bio: hangarBio.trim(),
          is_public: hangarIsPublic,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setHangarMsg("✓ Saved");
        fetchHangarProfile();
      } else {
        setHangarMsg(data.error || "Failed to save");
      }
    } catch (err) {
      setHangarMsg("Network error");
    }
    setHangarSaving(false);
  };

  // ── D1 sync ──────────────────────────────────────────────────
  const D1_API = "/api/progress";

  const syncToD1 = useCallback(async (payload) => {
    if (!effectiveSignedIn || !effectiveUserId) return;
    try {
      await fetch(D1_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: effectiveUserId, ...payload }),
      });
    } catch (_) { /* silent fallback to localStorage */ }
  }, [effectiveSignedIn, effectiveUserId]);

  const syncToD1Debounced = useDebounce(syncToD1, 500);

  const loadFromD1 = useCallback(async () => {
    if (!effectiveSignedIn || !effectiveUserId) return;
    try {
      const res = await fetch(`${D1_API}?userId=${effectiveUserId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.favourites) { setFavourites(data.favourites); localStorage.setItem("kv_favourites", JSON.stringify(data.favourites)); }
      if (data.progress) { setBuildProgress(data.progress); localStorage.setItem("kv_progress", JSON.stringify(data.progress)); }
      if (data.pages) { setPageProgress(data.pages); localStorage.setItem("kv_pages", JSON.stringify(data.pages)); }
    } catch (_) { /* silent fallback to localStorage */ }
  }, [effectiveSignedIn, effectiveUserId]);

  useEffect(() => { loadFromD1(); }, [loadFromD1]);

  const toggleFavourite = (e, kitId) => {
    e.stopPropagation();
    if (!effectiveSignedIn) return;
    setFavourites(prev => {
      const next = prev.includes(kitId) ? prev.filter(id => id !== kitId) : [...prev, kitId];
      localStorage.setItem("kv_favourites", JSON.stringify(next));
      syncToD1({ favourites: next });
      return next;
    });
  };

  const setBuildStatus = (kitId, status) => {
    if (!effectiveSignedIn) return;
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
    if (!effectiveSignedIn) return;
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
    if (!effectiveSignedIn) return;
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
    return (b.created_at || 0) - (a.created_at || 0);
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
    if (p.startsWith("/hangar/")) {
      return hangarSEO({ username: p.replace("/hangar/", "") });
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
        style={{ "--card-accent": c.accent, "--card-accent-bg": c.bg, position: "relative" }}
        onClick={() => goKit(kit)}
      >
        {showRemove && (
          <button className="vault-remove-btn" onClick={e => removeFromVault(e, kit.id)} title="Remove from vault">🗑</button>
        )}
        <div className="card-grade-banner" style={{ background: c.accent }} />
        <div className="card-body">
          <div className="card-top">
            <span className="grade-badge">{kit.grade}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {progress === "inprogress" && <span className="build-badge inprogress">IN PROGRESS</span>}
              {progress === "complete" && <span className="build-badge complete">COMPLETE</span>}
              {showBacklog && (!progress || progress === "backlog") && (
                <span className="build-badge" style={{ background: "rgba(90,122,159,0.15)", border: "1px solid rgba(90,122,159,0.4)", color: "var(--text-dim)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", padding: "2px 8px", letterSpacing: "1px" }}>BACKLOG</span>
              )}
              <span className="manual-count">{kit.manuals.length} MANUAL{kit.manuals.length !== 1 ? "S" : ""}</span>
              {effectiveSignedIn && (
                <button className="fav-btn" onClick={e => toggleFavourite(e, kit.id)} title={isFav ? "Remove from favourites" : "Add to favourites"}>
                  {isFav ? "⭐" : "☆"}
                </button>
              )}
            </div>
          </div>
          <div className="card-title">{kit.name}</div>
          <div className="card-series">{kit.series}</div>
          {effectiveSignedIn && pct !== null && (() => {
            const colors = xpColors(pct);
            return (
              <div className="xp-slim" style={colors}>
                <div className="xp-slim-track">
                  <div className="xp-slim-fill" style={{ width: `${pct}%` }} />
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

        {/* CLERK DOWN BANNER */}
        {clerkFailed && !fallbackUserId && (
          <div style={{
            background: "rgba(255,170,0,0.08)", borderBottom: "1px solid rgba(255,170,0,0.25)",
            padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", letterSpacing: "0.5px",
          }}>
            <span style={{ color: "#ffaa00" }}>⚠ Sign-in service temporarily unavailable</span>
            <button
              onClick={() => setShowFallbackLogin(true)}
              style={{
                background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)",
                color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem",
                padding: "4px 12px", cursor: "pointer", letterSpacing: "1px",
              }}
            >
              USE BACKUP LOGIN →
            </button>
          </div>
        )}

        {/* HEADER */}
        <header className="header" style={{ position: "relative" }} onClick={e => { if (!e.target.closest('.nav-item')) closeNav(); }}>
          <style>{`
            @keyframes kvMarquee { from{transform:translateX(0)} to{transform:translateX(-33.3333%)} }
            @keyframes kvPurchasePop { 0%{transform:scale(0.9)} 60%{transform:scale(1.04)} 100%{transform:scale(1)} }
            @keyframes kvBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
          `}</style>
          <div className="logo" onClick={goHome} style={{ cursor: "pointer" }}>
            <div className="logo-icon">▣</div>
            <div className="logo-text">
              <span>KIT<span style={{ color: "#ff6600" }}>VAULT</span></span>
              <span className="logo-sub">KITVAULT.IO</span>
            </div>
          </div>

          <div className="header-right">
            <div className="status-dot" />

            {/* ── HAMBURGER (mobile only) ── */}
            <button className={`hamburger-btn${mobileMenuOpen ? " open" : ""}`} onClick={() => setMobileMenuOpen(v => !v)} aria-label="Menu">
              <span /><span /><span />
            </button>

            {/* ── NAV RIGHT ── */}
            <nav className={`nav-right${mobileMenuOpen ? " mobile-open" : ""}`}>

              {/* TOOLS */}
              <div className={`nav-item${openNav === "tools" ? " open" : ""}`}>
                <button className="nav-btn" onClick={() => toggleNav("tools")}>
                  TOOLS <span className="nav-btn-arrow">▼</span>
                </button>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">◈ HOBBY TOOLS</div>
                  {[
                    { icon: "✂️", label: "Nippers", sub: "Side cutters for clean gate removal. The most essential tool in your kit.", route: "/tools/nippers" },
                    { icon: "🔧", label: "Panel Line Markers", sub: "Gundam markers & enamel washes for detail lines", route: "/tools/panel-line-markers" },
                    { icon: "📐", label: "Scribers & Chisels", sub: "For adding custom panel lines and surface detail", route: "/tools/scribers" },
                    { icon: "🪵", label: "Sanding Sticks", sub: "400→1000→2000 grit for seamline removal & gate cleanup", route: "/tools/sanding" },
                    { icon: "🎨", label: "Paints & Primers", sub: "Mr. Color, Citadel, Vallejo and more. Airbrushing and hand painting.", route: "/tools/paints" },
                    { icon: "💨", label: "Airbrushes", sub: "Iwata, Badger, GSI Creos. Starter to pro setups covered.", route: "/tools/airbrushes" },
                    { icon: "🧴", label: "Top Coats", sub: "Gloss, semi-gloss, matte. Lock in your finish and protect your work.", route: "/tools/top-coats" },
                    { icon: "🪚", label: "Hobby Knives", sub: "Olfa & X-Acto knives for cleanup and minor modifications", route: "/tools/hobby-knives" },
                  ].map(item => (
                    <div key={item.label} className="nav-dd-item" onClick={() => { closeMobileMenu(); if (item.route) navigate(item.route); }}>
                      <span className="nav-dd-icon">{item.icon}</span>
                      <span className="nav-dd-text">
                        <span className="nav-dd-label">{item.label}{!item.route && <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim)", marginLeft: 8, letterSpacing: 1 }}>SOON</span>}</span>
                        <span className="nav-dd-sub">{item.sub}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESOURCES */}
              <button className="nav-btn" onClick={() => { closeMobileMenu(); navigate("/resources"); }} style={{ color: location.pathname === "/resources" ? "#ffcc00" : "" }}>
                RESOURCES
              </button>

              {/* GALLERY */}
              <button className="nav-btn" onClick={() => { closeMobileMenu(); navigate("/gallery"); }} style={{ color: location.pathname === "/gallery" ? "#ffcc00" : "" }}>
                GALLERY
              </button>

              {/* GRADES */}
              <div className={`nav-item${openNav === "grades" ? " open" : ""}`}>
                <button className="nav-btn" onClick={() => toggleNav("grades")}>
                  GRADES <span className="nav-btn-arrow">▼</span>
                </button>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">◈ KIT GRADE GUIDE</div>
                  {[
                    { slug: "eg", label: "EG — Entry Grade", sub: "Snap-fit, no nippers needed. Perfect first kit", color: "#aa88ff" },
                    { slug: "hg", label: "HG — High Grade", sub: "1/144 scale. Best variety, great for beginners", color: "#00aaff" },
                    { slug: "rg", label: "RG — Real Grade", sub: "1/144 with MG-level detail. Advanced snap-fit", color: "#ff2244" },
                    { slug: "mg", label: "MG — Master Grade", sub: "1/100 scale with inner frame. Intermediate", color: "#ff6600" },
                    { slug: "pg", label: "PG — Perfect Grade", sub: "1/60 scale. The ultimate Gunpla experience", color: "#ffcc00" },
                    { slug: "sd", label: "SD — Super Deformed", sub: "Chibi-style, fun and quick builds for all levels", color: "#00ffcc" },
                    { slug: "mgsd", label: "MGSD — Master Grade SD", sub: "MG inner frame with SD proportions. Best of both", color: "#ff6677" },
                  ].map(item => (
                    <div key={item.slug} className="nav-dd-item" onClick={() => { closeMobileMenu(); navigate(`/grade/${item.slug}`); }}>
                      <span className="nav-dd-text">
                        <span className="nav-dd-label" style={{ color: item.color }}>{item.label}</span>
                        <span className="nav-dd-sub">{item.sub}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </nav>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu} />}

            {/* ROSTER + VAULT + HANGAR (desktop: inline here, mobile: drops to sub-row) */}
            <div className="header-action-btns">
              <SignedIn>
                <button onClick={() => setShowCustomize(true)} className="hangar-btn">
                  ◈ ROSTER
                  <span className="hangar-xp-badge">{xp} XP</span>
                </button>
              </SignedIn>
              {!isSignedIn && fallbackUserId && (
                <button onClick={() => setShowCustomize(true)} className="hangar-btn">
                  ◈ ROSTER
                  <span className="hangar-xp-badge">{xp} XP</span>
                </button>
              )}
              <SignedOut>
                {!fallbackUserId && (
                  <button onClick={() => setShowCustomize(true)} className="hangar-btn locked">
                    🔒 ROSTER
                  </button>
                )}
              </SignedOut>

              {effectiveSignedIn && (
                <>
                  <button onClick={goVault} className={`vault-btn${location.pathname === "/vault" ? " active" : ""}`}>
                    ⭐ VAULT
                  </button>
                  {hangarProfile?.username && (
                    <button
                      onClick={() => navigate(`/hangar/${hangarProfile.username}`)}
                      className={`vault-btn${location.pathname.startsWith("/hangar/") ? " active" : ""}`}
                    >
                      🏠 HANGAR
                    </button>
                  )}
                </>
              )}
            </div>

            {/* THEME DROPDOWN */}
            <div className={`nav-item theme-picker${openNav === "theme" ? " open" : ""}`}>
              <button className="theme-toggle-btn" onClick={() => toggleNav("theme")} title="Change Theme">🎨</button>
              <div className="nav-dropdown theme-dropdown">
                <div className="nav-dropdown-header">◈ THEME</div>
                {[
                  { id: "dark", label: "Dark Mode", icon: "🌑", sub: "Default tech blue" },
                  { id: "light", label: "Light Mode", icon: "☀️", sub: "Clean and bright" },
                  { id: "neko", label: "Cyber Pink", icon: "🌸", sub: "Digital rose glow" },
                  { id: "cat", label: "Cat Mode", icon: "🐱", sub: "Meow! Cats everywhere" },
                ].map(t => (
                  <div key={t.id} className={`nav-dd-item${(document.documentElement.getAttribute("data-theme") || "dark") === t.id ? " active-theme" : ""}`} onClick={() => {
                    document.documentElement.setAttribute("data-theme", t.id);
                    localStorage.setItem("kv-theme", t.id);
                    closeNav();
                  }}>
                    <span className="nav-dd-icon">{t.icon}</span>
                    <span className="nav-dd-text">
                      <span className="nav-dd-label">{t.label}</span>
                      <span className="nav-dd-sub">{t.sub}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="header-profile">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                {fallbackUserId ? (
                  <button className="auth-btn" onClick={handleFallbackLogout} style={{ fontSize: "0.55rem" }}>LOG OUT</button>
                ) : (
                  <>
                    {!clerkFailed && (
                      <SignInButton mode="modal">
                        <button className="auth-btn">LOG IN</button>
                      </SignInButton>
                    )}
                    <button className="auth-btn" onClick={() => setShowFallbackLogin(true)} style={clerkFailed ? { background: "rgba(0,170,255,0.15)", borderColor: "rgba(0,170,255,0.4)", color: "#00aaff" } : { fontSize: "0.5rem", opacity: 0.7 }}>
                      {clerkFailed ? "LOG IN" : "EMAIL LOGIN"}
                    </button>
                  </>
                )}
              </SignedOut>
            </div>
            <button className={`cog-btn ${showSettings ? "active" : ""}`} onClick={() => setShowSettings(true)} title="Settings">⚙</button>
          </div>
        </header>

        {/* MARQUEE — owned sprites parade (logged-in only) */}
        <SignedIn>
          <MarqueeStrip ownedSprites={paradeSprites} />
        </SignedIn>
        {!isSignedIn && fallbackUserId && (
          <MarqueeStrip ownedSprites={paradeSprites} />
        )}

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
                    <input className="search-input" placeholder="Search for Kits" value={search} onChange={e => setSearch(e.target.value)} />
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
                        className={`filter-btn ${isActive ? "active" : ""}`}
                        style={isActive ? { borderColor: accent, color: accent, background: `${c?.bg || "rgba(0,170,255,0.08)"}`, boxShadow: `0 0 12px ${accent}33` } : {}}
                        onClick={() => setGradeFilter(g)}
                      >{g}</button>
                    );
                  })}
                  <div className="filter-divider" />
                  <span className="controls-label">SORT</span>
                  <button className={`sort-btn ${sortOrder === "az" ? "active" : ""}`} onClick={() => setSortOrder(s => s === "az" ? "default" : "az")}>A→Z</button>
                  <button className={`sort-btn ${sortOrder === "za" ? "active" : ""}`} onClick={() => setSortOrder(s => s === "za" ? "default" : "za")}>Z→A</button>
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
              allKits={allKits} isSignedIn={effectiveSignedIn} user={user || { id: effectiveUserId }}
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
                const favOnly = vaultKits.filter(k => favourites.includes(k.id));
                const inProgress = vaultKits.filter(k => buildProgress[k.id] === "inprogress");
                const complete = vaultKits.filter(k => buildProgress[k.id] === "complete");
                const backlog = vaultKits.filter(k =>
                  buildProgress[k.id] === "backlog" && !favourites.includes(k.id)
                );

                return (
                  <>
                    <div className="page-hero">
                      <div className="page-tag">PERSONAL COLLECTION</div>
                      <div className="page-title">MY <span style={{ color: "var(--accent)" }}>VAULT</span></div>
                      <div className="page-sub">{vaultKits.length} KIT{vaultKits.length !== 1 ? "S" : ""} TRACKED</div>
                    </div>

                    {/* Backup auth setup prompt */}
                    {effectiveSignedIn && !hasBackupAuth && (
                      <div style={{ maxWidth: 800, margin: "0 auto 12px", padding: "0 40px" }}>
                        <BackupAuthSetup onRegister={handleRegisterBackup} hasBackupAuth={hasBackupAuth} backupAuthEmail={backupAuthEmail} />
                      </div>
                    )}
                    {vaultKits.length === 0 ? (
                      <div className="vault-empty">
                        <span className="vault-empty-icon">⭐</span>
                        NOTHING IN YOUR VAULT YET<br />
                        <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>STAR A KIT OR SET A BUILD STATUS TO ADD IT HERE</span>
                      </div>
                    ) : (
                      <div style={{ padding: "0 40px 60px" }}>
                        {favOnly.length > 0 && (
                          <>
                            <div className="section-header" style={{ padding: "0 0 20px", marginBottom: "4px" }}>
                              <span className="section-title" style={{ color: "var(--gold)" }}>⭐ FAVORITES</span>
                              <div className="section-line" />
                              <span className="section-count">{favOnly.length} KIT{favOnly.length !== 1 ? "S" : ""}</span>
                            </div>
                            <div className="vault-grid" style={{ padding: "0 0 32px" }}>{favOnly.map(k => renderKitCard(k, { showBacklog: true, showRemove: true }))}</div>
                          </>
                        )}
                        {inProgress.length > 0 && (
                          <>
                            <div className="section-header" style={{ padding: "0 0 20px", marginBottom: "4px" }}>
                              <span className="section-title" style={{ color: "var(--gold)" }}>⚙ IN PROGRESS</span>
                              <div className="section-line" />
                              <span className="section-count">{inProgress.length} KIT{inProgress.length !== 1 ? "S" : ""}</span>
                            </div>
                            <div className="vault-grid" style={{ padding: "0 0 32px" }}>{inProgress.map(k => renderKitCard(k, { showBacklog: true, showRemove: true }))}</div>
                          </>
                        )}
                        {complete.length > 0 && (
                          <>
                            <div className="section-header" style={{ padding: "0 0 20px", marginBottom: "4px" }}>
                              <span className="section-title" style={{ color: "var(--green)" }}>✓ COMPLETED</span>
                              <div className="section-line" />
                              <span className="section-count">{complete.length} KIT{complete.length !== 1 ? "S" : ""}</span>
                            </div>
                            <div className="vault-grid" style={{ padding: "0 0 32px" }}>{complete.map(k => renderKitCard(k, { showBacklog: true, showRemove: true }))}</div>
                          </>
                        )}
                        {backlog.length > 0 && (
                          <>
                            <div className="section-header" style={{ padding: "0 0 20px", marginBottom: "4px" }}>
                              <span className="section-title" style={{ color: "var(--text-dim)" }}>◻ BACKLOG</span>
                              <div className="section-line" />
                              <span className="section-count">{backlog.length} KIT{backlog.length !== 1 ? "S" : ""}</span>
                            </div>
                            <div className="vault-grid" style={{ padding: "0 0 32px" }}>{backlog.map(k => renderKitCard(k, { showBacklog: true, showRemove: true }))}</div>
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
                      { icon: "📖", label: "Gunpla Wiki", sub: "The definitive beginner resource. Grades explained, tool guides, technique breakdowns, FAQs. Best place to start if you're new.", tag: "WIKI", href: "https://www.reddit.com/r/Gunpla/wiki/", color: "#00aaff" },
                      { icon: "💬", label: "r/Gunpla", sub: "The largest Gunpla community on the internet. Share your builds, ask questions, browse WIPs, and get feedback from thousands of builders worldwide.", tag: "REDDIT", href: "https://www.reddit.com/r/Gunpla/", color: "#ff6600" },
                      { icon: "🌐", label: "Gundam Base Online", sub: "Bandai's official Gunpla storefront and news hub. Best place to track new kit announcements, P-Bandai exclusives, and limited releases straight from the source.", tag: "OFFICIAL", href: "https://p-bandai.com/", color: "#00ffcc" },
                    ].map(r => (
                      <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{ "--rc-color": r.color }}>
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
                      { icon: "🛒", label: "Hobbylink Japan (HLJ)", sub: "The go-to import retailer. Widest selection of kits at Japanese retail prices, ships worldwide. Great for pre-orders and hard-to-find kits.", tag: "IMPORT", href: "https://www.hlj.com", color: "#ff2244" },
                      { icon: "🛒", label: "Gundam Planet", sub: "US-based Gunpla specialist with fast domestic shipping. Good stock on current HG and MG releases, no import wait times.", tag: "US", href: "https://www.gundamplanet.com", color: "#00aaff" },
                    ].map(r => (
                      <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{ "--rc-color": r.color }}>
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
                      { icon: "🔗", label: "Dalong.net Kit Reviews", sub: "Comprehensive Japanese kit review database with photos, runner breakdowns, and assembly notes on thousands of kits. Essential for research before buying.", tag: "DATABASE", href: "http://www.dalong.net", color: "#ffcc00" },
                    ].map(r => (
                      <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{ "--rc-color": r.color }}>
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
                <div className="page-tag">100% OPTIONAL · 100% APPRECIATED</div>
                <div className="page-title">TIP <span style={{ color: "var(--gold, #ffcc00)" }}>JAR</span></div>
                <div className="page-sub">HELP KEEP THE LIGHTS ON</div>
              </div>
              <div style={{ padding: "0 40px 60px", maxWidth: 1000, margin: "0 auto" }}>

                {/* The pitch — single column, conversational */}
                <div style={{ maxWidth: 620, margin: "0 auto 40px", fontFamily: "'Share Tech Mono',monospace" }}>
                  <div style={{ fontSize: "0.75rem", color: "#c8ddf5", lineHeight: 2.2, letterSpacing: "0.3px", marginBottom: 24 }}>
                    KitVault started because I was sick of googling manual scans and landing on dead links
                    or sites that looked like they hadn't been updated since the Wing Zero Ver.Ka dropped.
                    So I built this. One person, no team, no budget. Just a dude with too many nub marks on his
                    desk and a Cloudflare account.
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#9ab0cc", lineHeight: 2.2, letterSpacing: "0.3px", marginBottom: 24 }}>
                    Storing 500+ PDFs, running the database, and keeping page loads fast enough that you're not
                    waiting longer than a PG inner frame takes to assemble... that all costs money every month.
                    If KitVault has ever saved you from squinting at a blurry Instagram photo of step 14,
                    tossing a couple bucks my way would genuinely help.
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-dim,#5a7a9f)", lineHeight: 2, letterSpacing: "0.3px", borderTop: "1px solid var(--border,#1a2f50)", paddingTop: 20 }}>
                    There's no paywall, no "premium tier," no pop-up begging you on every page.
                    This tip jar exists, the link lives in the footer, and I'll never bug you about it.
                    If you drop something in here though, know that it's going straight into keeping this thing alive.
                  </div>
                </div>

                {/* Ko-fi widget — centered, clean */}
                <div style={{ maxWidth: 420, margin: "0 auto", background: "#fff", borderRadius: 8, overflow: "hidden" }}>
                  <iframe
                    id="kofiframe"
                    src="https://ko-fi.com/kitvault1/?hidefeed=true&widget=true&embed=true&preview=true"
                    style={{ border: "none", width: "100%", padding: 4, background: "#fff", minHeight: 500 }}
                    title="Support KitVault on Ko-fi"
                  />
                </div>

                {/* FAQ — compact, below widget */}
                <div style={{ maxWidth: 620, margin: "40px auto 0", fontFamily: "'Share Tech Mono',monospace" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div>
                      <div style={{ fontSize: "0.6rem", color: "var(--accent,#00aaff)", letterSpacing: "2px", marginBottom: 8 }}>WHERE DOES IT GO?</div>
                      <div style={{ fontSize: "0.62rem", color: "#5a7a9f", lineHeight: 2 }}>
                        Server bills, domain renewal, R2 storage for PDFs, and Cloudflare Workers. The boring stuff that keeps the site loading fast.
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.6rem", color: "var(--accent,#00aaff)", letterSpacing: "2px", marginBottom: 8 }}>WHAT DO I GET?</div>
                      <div style={{ fontSize: "0.62rem", color: "#5a7a9f", lineHeight: 2 }}>
                        Nothing tangible. The site stays free for everyone regardless. But you get to feel good about it, and that's worth at least $3.
                      </div>
                    </div>
                  </div>
                </div>

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
                  <div className="disclaimer-card" style={{ "--dc": "#ffcc00" }}>
                    <div className="disclaimer-card-icon">🛡️</div>
                    <div className="disclaimer-card-title">FAN PROJECT</div>
                    <div className="disclaimer-card-text">KitVault.io is an unofficial, non-commercial fan-made website created out of love for the Gunpla hobby. It is not affiliated with, endorsed by, or connected to Bandai Namco Entertainment, Sotsu, or Sunrise in any way.</div>
                  </div>
                  <div className="disclaimer-card" style={{ "--dc": "#00aaff" }}>
                    <div className="disclaimer-card-icon">📄</div>
                    <div className="disclaimer-card-title">MANUAL CONTENT</div>
                    <div className="disclaimer-card-text">All assembly manuals hosted on this site are the intellectual property of Bandai Namco Entertainment. They are provided here solely as a convenience resource for hobbyists who have already purchased these kits.</div>
                  </div>
                  <div className="disclaimer-card" style={{ "--dc": "#00ffcc" }}>
                    <div className="disclaimer-card-icon">🔗</div>
                    <div className="disclaimer-card-title">AFFILIATE LINKS</div>
                    <div className="disclaimer-card-text">This site participates in the Amazon Associates affiliate program. Links to Amazon products may earn a small commission at no extra cost to you. This helps cover server costs and keeps the site free for everyone.</div>
                  </div>
                  <div className="disclaimer-card" style={{ "--dc": "#ff6600" }}>
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

          {/* ===== PUBLIC HANGAR PROFILE ===== */}
          <Route path="/hangar/:username" element={
            <Hangar currentUserId={effectiveSignedIn ? effectiveUserId : null} />
          } />

          {/* ===== ADMIN ===== */}
          <Route path="/admin" element={<AdminUpload />} />

        </Routes>

        {/* SETTINGS MODAL */}
        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="settings-modal" onClick={e => e.stopPropagation()}>
              <div className="settings-header">
                <span className="settings-title">⚙ SETTINGS</span>
                <button className="modal-close" onClick={() => setShowSettings(false)}>✕</button>
              </div>
              <div className="settings-body">

                {/* HANGAR PROFILE */}
                {effectiveSignedIn && (
                  <div className="settings-section">
                    <div className="settings-section-label">MY HANGAR</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                      {/* Username */}
                      <div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "1px", marginBottom: 4 }}>USERNAME</div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", color: "var(--text-dim)" }}>kitvault.io/hangar/</span>
                          <input
                            value={hangarUsername}
                            onChange={e => checkUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                            maxLength={24}
                            placeholder="your-username"
                            style={{
                              flex: 1, background: "rgba(0,0,0,0.3)", border: `1px solid ${usernameAvailable === true ? "rgba(0,255,136,0.4)" : usernameAvailable === false ? "rgba(255,60,60,0.4)" : "rgba(255,255,255,0.1)"}`,
                              color: "var(--text)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem",
                              padding: "8px 10px", letterSpacing: "0.5px", outline: "none",
                            }}
                          />
                          {usernameAvailable === true && <span style={{ color: "#00ff88", fontSize: "0.7rem" }}>✓</span>}
                          {usernameAvailable === false && <span style={{ color: "#ff3c3c", fontSize: "0.7rem" }}>✗</span>}
                        </div>
                      </div>

                      {/* Display Name */}
                      <div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "1px", marginBottom: 4 }}>DISPLAY NAME</div>
                        <input
                          value={hangarDisplayName}
                          onChange={e => setHangarDisplayName(e.target.value)}
                          maxLength={40}
                          placeholder="How you want your name shown"
                          style={{
                            width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                            color: "var(--text)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem",
                            padding: "8px 10px", letterSpacing: "0.5px", outline: "none", boxSizing: "border-box",
                          }}
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "1px", marginBottom: 4 }}>BIO <span style={{ color: "var(--text-dim)", opacity: 0.5 }}>({280 - hangarBio.length} left)</span></div>
                        <textarea
                          value={hangarBio}
                          onChange={e => setHangarBio(e.target.value.substring(0, 280))}
                          maxLength={280}
                          rows={3}
                          placeholder="Tell people about your builds..."
                          style={{
                            width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                            color: "var(--text)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                            padding: "8px 10px", letterSpacing: "0.3px", outline: "none", resize: "vertical",
                            lineHeight: 1.6, boxSizing: "border-box",
                          }}
                        />
                      </div>

                      {/* Public/Private Toggle */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text)", letterSpacing: "0.5px" }}>
                            {hangarIsPublic ? "🔓 PUBLIC" : "🔒 PRIVATE"}
                          </div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim)", letterSpacing: "0.5px", marginTop: 2 }}>
                            {hangarIsPublic ? "Anyone with the link can view your hangar" : "Only you can see your hangar"}
                          </div>
                        </div>
                        <button
                          onClick={() => setHangarIsPublic(p => !p)}
                          style={{
                            background: hangarIsPublic ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.05)",
                            border: `1px solid ${hangarIsPublic ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)"}`,
                            color: hangarIsPublic ? "#00ff88" : "var(--text-dim)",
                            fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem",
                            padding: "6px 14px", cursor: "pointer", letterSpacing: "1px",
                          }}
                        >
                          {hangarIsPublic ? "PUBLIC" : "PRIVATE"}
                        </button>
                      </div>

                      {/* Save + View + Share */}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <button
                          onClick={saveHangarProfile}
                          disabled={hangarSaving || !hangarUsername.trim() || hangarUsername.trim().length < 3 || usernameAvailable === false}
                          style={{
                            background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)",
                            color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                            padding: "8px 18px", cursor: "pointer", letterSpacing: "1px",
                            opacity: (hangarSaving || !hangarUsername.trim() || hangarUsername.trim().length < 3 || usernameAvailable === false) ? 0.4 : 1,
                          }}
                        >
                          {hangarSaving ? "SAVING..." : "💾 SAVE PROFILE"}
                        </button>
                        {hangarProfile?.username && (
                          <>
                            <button
                              onClick={() => { setShowSettings(false); navigate(`/hangar/${hangarProfile.username}`); }}
                              style={{
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                color: "var(--text-dim)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                                padding: "8px 14px", cursor: "pointer", letterSpacing: "1px",
                              }}
                            >
                              VIEW HANGAR →
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`https://kitvault.io/hangar/${hangarProfile.username}`);
                                setHangarMsg("✓ Link copied!");
                                setTimeout(() => setHangarMsg(""), 2000);
                              }}
                              style={{
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                color: "var(--text-dim)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                                padding: "8px 14px", cursor: "pointer", letterSpacing: "1px",
                              }}
                            >
                              📋 COPY LINK
                            </button>
                          </>
                        )}
                      </div>

                      {/* Status message */}
                      {hangarMsg && (
                        <div style={{
                          fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.5px",
                          color: hangarMsg.startsWith("✓") ? "#00ff88" : "#ff3c3c",
                        }}>
                          {hangarMsg}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* BACKUP LOGIN */}
                {effectiveSignedIn && (
                  <div className="settings-section">
                    <div className="settings-section-label">BACKUP LOGIN</div>
                    <BackupAuthSetup onRegister={handleRegisterBackup} hasBackupAuth={hasBackupAuth} backupAuthEmail={backupAuthEmail} compact={true} />
                  </div>
                )}

                {/* SUPPORT KITVAULT */}
                <div className="settings-section">
                  <div className="settings-section-label">SUPPORT KITVAULT</div>
                  <div className="donate-block">
                    <div className="donate-title">☕ BUY ME A COFFEE</div>
                    <div className="donate-sub">
                      KitVault.io is a free, non-profit fan resource.<br />
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
                    <span className="settings-info-val">{allKits.reduce((a, k) => a + k.manuals.length, 0)}</span>
                  </div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">DISCLAIMER</span>
                    <span className="settings-info-val clickable-val" onClick={goDisclaimer}>VIEW →</span>
                  </div>
                </div>

                {/* AFFILIATE NOTE */}
                <div className="settings-section">
                  <div className="settings-section-label">AFFILIATE PROGRAM</div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", lineHeight: 2 }}>
                    KitVault.io participates in the Amazon Associates program. Kit pages include affiliate links to Amazon. We earn a small commission on qualifying purchases at no extra cost to you. Thank you for supporting the site.
                  </div>
                </div>

                {/* DISCLAIMER LINK */}
                <div className="settings-section">
                  <div className="settings-section-label">LEGAL</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", lineHeight: 1.8 }}>
                      Fan-made non-profit project.<br />All Gundam IP © Bandai Namco · Sotsu · Sunrise.
                    </div>
                    <button
                      onClick={goDisclaimer}
                      style={{
                        background: "rgba(255,204,0,0.06)", border: "1px solid rgba(255,204,0,0.3)",
                        color: "var(--gold)", fontFamily: "'Share Tech Mono',monospace",
                        fontSize: "0.6rem", padding: "8px 14px", cursor: "pointer",
                        letterSpacing: "1px", transition: "all 0.2s", whiteSpace: "nowrap",
                        clipPath: "polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%)"
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
          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem" }}>{VERSION}</span>
        </footer>

        {/* BACK TO TOP */}
        <button
          className={`back-to-top${showBackToTop ? " visible" : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Back to top"
        >↑</button>

        {/* CUSTOMIZE MODALS */}
        {showCustomize && effectiveSignedIn && (
          <CustomizeModal
            onClose={() => setShowCustomize(false)}
            ownedIds={ownedSpriteIds}
            paradeIds={paradeIds}
            xp={xp}
            userId={effectiveUserId}
            onPurchaseComplete={(spriteId, newXp, removedId) => {
              if (removedId) {
                setOwnedSpriteIds(prev => prev.filter(id => id !== removedId));
              } else {
                setOwnedSpriteIds(prev => [...prev, spriteId]);
                setXp(newXp);
              }
            }}
            onParadeChange={(spriteId, active) => {
              setParadeIds(prev => active
                ? [...prev, spriteId]
                : prev.filter(id => id !== spriteId)
              );
            }}
          />
        )}
        {showCustomize && !effectiveSignedIn && (
          <GuestCustomizeTeaser onClose={() => setShowCustomize(false)} />
        )}

        {/* FALLBACK LOGIN MODAL */}
        {showFallbackLogin && (
          <FallbackLoginModal
            onClose={() => setShowFallbackLogin(false)}
            onLogin={handleFallbackLogin}
            onSignup={handleFallbackSignup}
            clerkFailed={clerkFailed}
          />
        )}

      </div>
    </>
  );
}
