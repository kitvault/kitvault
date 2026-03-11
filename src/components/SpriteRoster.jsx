// ─────────────────────────────────────────────────────────────
// SpriteRoster.jsx
// Sprite data, chibi renderer, marquee strip, customize modal,
// and guest teaser. Extracted from App.jsx.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";

// ── Sprite Data ─────────────────────────────────────────────
export const SPRITES = [
  { id: "rx78", name: "RX-78-2", series: "Mobile Suit Gundam", cost: 0, free: true, rarity: "STARTER", rarityColor: "#aabbcc", colors: { primary: "#4a7aff", accent: "#ff3311", badge: "#ffcc00" } },
  { id: "wingzero", name: "Wing Zero", series: "Gundam Wing", cost: 150, free: false, rarity: "RARE", rarityColor: "#00aaff", colors: { primary: "#e8eeff", accent: "#ffcc00", badge: "#00aaff" } },
  { id: "unicorn", name: "Unicorn", series: "Gundam UC", cost: 200, free: false, rarity: "RARE", rarityColor: "#00aaff", colors: { primary: "#c8d8ff", accent: "#0066ff", badge: "#88ccff" } },
  { id: "barbatos", name: "Barbatos", series: "Iron-Blooded Orphans", cost: 150, free: false, rarity: "RARE", rarityColor: "#00aaff", colors: { primary: "#8899aa", accent: "#ff6600", badge: "#cc4400" } },
  { id: "exia", name: "Exia", series: "Gundam 00", cost: 300, free: false, rarity: "EPIC", rarityColor: "#cc44ff", colors: { primary: "#2244cc", accent: "#00ffcc", badge: "#88ffee" } },
  { id: "sazabi", name: "Sazabi", series: "Char's Counterattack", cost: 400, free: false, rarity: "EPIC", rarityColor: "#cc44ff", colors: { primary: "#cc1111", accent: "#ff6600", badge: "#ff4400" } },
];
export const SPRITE_BASE = "https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sprites";

// ── ChibiSprite ─────────────────────────────────────────────
export function ChibiSprite({ sprite, size = 48, bob = false }) {
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

// ── MarqueeStrip ────────────────────────────────────────────
export function MarqueeStrip({ ownedSprites }) {
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

// ── CustomizeModal ──────────────────────────────────────────
export function CustomizeModal({ onClose, ownedIds, paradeIds, xp, onPurchaseComplete, onParadeChange, userId }) {
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

// ── GuestCustomizeTeaser ────────────────────────────────────
export function GuestCustomizeTeaser({ onClose }) {
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
