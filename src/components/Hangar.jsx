// ─────────────────────────────────────────────────────────────
// Hangar.jsx — Public Hangar Profile Page
// Route: /hangar/:username
// Shows a builder's collection, build photos, and gallery posts.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GRADE_COLORS, slugify } from "../data/grades.js";

const gc = (g) => GRADE_COLORS[g] || GRADE_COLORS["HG"];

export default function Hangar({ currentUserId }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [photoModal, setPhotoModal] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchHangar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const viewerParam = currentUserId ? `?viewer_id=${currentUserId}` : "";
      const res = await fetch(`/api/hangar/${username}${viewerParam}`);
      const json = await res.json();
      if (!json.ok) {
        setError(json.error || "Failed to load hangar");
      } else {
        setData(json);
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  }, [username, currentUserId]);

  useEffect(() => { fetchHangar(); }, [fetchHangar]);

  const copyLink = () => {
    navigator.clipboard.writeText(`https://kitvault.io/hangar/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="page-wrap" style={{ textAlign: "center", padding: "120px 20px" }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.8rem", color: "var(--text-dim)", letterSpacing: "2px" }}>
          LOADING HANGAR...
        </div>
      </div>
    );
  }

  // ── Error / Private / Not Found ──
  if (error) {
    return (
      <div className="page-wrap" style={{ textAlign: "center", padding: "120px 20px" }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.4rem", color: "var(--text)", marginBottom: 16 }}>
          {error === "This hangar is private" ? "🔒" : "404"}
        </div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.75rem", color: "var(--text-dim)", letterSpacing: "1px", marginBottom: 24 }}>
          {error === "This hangar is private"
            ? "THIS HANGAR IS PRIVATE"
            : error === "User not found"
              ? "BUILDER NOT FOUND"
              : error.toUpperCase()}
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)",
            color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
            padding: "10px 20px", cursor: "pointer", letterSpacing: "1.5px",
          }}
        >
          ← BACK TO KITVAULT
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { profile, vault, photos, gallery_posts, stats, is_owner } = data;
  const { kits, favourites, progress } = vault;

  // Organize kits by status
  const favKits = kits.filter(k => favourites.includes(k.id));
  const completedKits = kits.filter(k => progress[String(k.id)] === "complete" && !favourites.includes(k.id));
  const inProgressKits = kits.filter(k => progress[String(k.id)] === "inprogress" && !favourites.includes(k.id));
  const backlogKits = kits.filter(k => progress[String(k.id)] === "backlog" && !favourites.includes(k.id));

  // Get photos for a specific kit
  const getKitPhotos = (kitId) => photos.filter(p => p.kit_id === kitId);

  // ── Kit card ──
  const KitCard = ({ kit }) => {
    const kitPhotos = getKitPhotos(kit.id);
    const status = progress[String(kit.id)];
    const isFav = favourites.includes(kit.id);
    const colors = gc(kit.grade);

    return (
      <div
        style={{
          background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 2, overflow: "hidden", cursor: "pointer",
          transition: "border-color 0.2s",
        }}
        onClick={() => navigate(`/kit/${slugify(kit)}`)}
        onMouseEnter={e => e.currentTarget.style.borderColor = colors.accent + "44"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
      >
        {/* Kit image or first build photo */}
        <div style={{ width: "100%", aspectRatio: "1", background: "rgba(0,0,0,0.3)", position: "relative", overflow: "hidden" }}>
          {kitPhotos.length > 0 ? (
            <img
              src={kitPhotos[0].image_url}
              alt={kit.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
            />
          ) : kit.image_url ? (
            <img
              src={kit.image_url}
              alt={kit.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: "1px" }}>
              NO IMAGE
            </div>
          )}

          {/* Grade badge */}
          <div style={{
            position: "absolute", top: 8, left: 8,
            background: colors.bg, border: `1px solid ${colors.accent}44`,
            fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", color: colors.accent,
            padding: "3px 10px", letterSpacing: "1.5px",
          }}>
            {kit.grade}
          </div>

          {/* Photo count badge */}
          {kitPhotos.length > 0 && (
            <div style={{
              position: "absolute", top: 8, right: 8,
              background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)",
              fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "#ccc",
              padding: "3px 8px", letterSpacing: "1px",
            }}>
              📷 {kitPhotos.length}
            </div>
          )}

          {/* Status badge */}
          {status && (
            <div style={{
              position: "absolute", bottom: 8, left: 8,
              background: status === "complete" ? "rgba(0,255,136,0.15)" : status === "inprogress" ? "rgba(255,170,0,0.15)" : "rgba(90,122,159,0.15)",
              border: `1px solid ${status === "complete" ? "rgba(0,255,136,0.4)" : status === "inprogress" ? "rgba(255,170,0,0.4)" : "rgba(90,122,159,0.4)"}`,
              fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem",
              color: status === "complete" ? "#00ff88" : status === "inprogress" ? "#ffaa00" : "var(--text-dim)",
              padding: "2px 8px", letterSpacing: "1px",
            }}>
              {status === "complete" ? "COMPLETE" : status === "inprogress" ? "IN PROGRESS" : "BACKLOG"}
            </div>
          )}

          {isFav && (
            <div style={{ position: "absolute", bottom: 8, right: 8, fontSize: "0.75rem" }}>⭐</div>
          )}
        </div>

        {/* Kit info */}
        <div style={{ padding: "12px 14px" }}>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", letterSpacing: "0.5px", lineHeight: 1.3 }}>
            {kit.name}
          </div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: "1px", marginTop: 4 }}>
            {kit.grade} · {kit.scale}
          </div>
        </div>

        {/* Build photo strip */}
        {kitPhotos.length > 1 && (
          <div style={{ display: "flex", gap: 2, padding: "0 4px 4px", overflow: "hidden" }}>
            {kitPhotos.slice(1, 4).map(photo => (
              <div
                key={photo.id}
                onClick={e => { e.stopPropagation(); setPhotoModal(photo); }}
                style={{ flex: 1, aspectRatio: "1", borderRadius: 1, overflow: "hidden", cursor: "pointer" }}
              >
                <img src={photo.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              </div>
            ))}
            {kitPhotos.length > 4 && (
              <div style={{
                flex: 1, aspectRatio: "1", background: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim)",
              }}>
                +{kitPhotos.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── Section renderer ──
  const Section = ({ title, icon, kits: sectionKits, color }) => {
    if (sectionKits.length === 0) return null;
    return (
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontFamily: "'Share Tech Mono',monospace", fontSize: "0.85rem", letterSpacing: "2px",
          color: color || "var(--text-dim)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
        }}>
          {icon} {title}
          <span style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "1px" }}>
            {sectionKits.length} KIT{sectionKits.length !== 1 ? "S" : ""}
          </span>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}>
          {sectionKits.map(kit => <KitCard key={kit.id} kit={kit} />)}
        </div>
      </div>
    );
  };

  // ── Member since ──
  const memberDate = profile.created_at
    ? new Date(profile.created_at * 1000).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="page-wrap" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 100px" }}>

      {/* PROFILE HEADER */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20, marginBottom: 32,
        flexWrap: "wrap",
      }}>
        {/* Avatar */}
        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt={profile.display_name || profile.username}
            style={{
              width: 90, height: 90, borderRadius: "50%",
              border: "2px solid rgba(0,170,255,0.3)",
            }}
          />
        )}

        {/* Name + bio */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--text)", letterSpacing: "1px" }}>
            {profile.display_name || profile.username}
          </div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.75rem", color: "var(--text-dim)", letterSpacing: "1px", marginTop: 4 }}>
            @{profile.username}
            {memberDate && <span> · Member since {memberDate}</span>}
          </div>
          {profile.bio && (
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "0.95rem", color: "var(--text)", marginTop: 10, lineHeight: 1.5, maxWidth: 550 }}>
              {profile.bio}
            </div>
          )}
        </div>

        {/* Share button */}
        {is_owner && (
          <button
            onClick={copyLink}
            style={{
              background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)",
              color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem",
              padding: "10px 20px", cursor: "pointer", letterSpacing: "1.5px",
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "✓ COPIED!" : "📋 SHARE HANGAR"}
          </button>
        )}
      </div>

      {/* STATS BAR */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 32, flexWrap: "wrap",
      }}>
        {[
          { label: "TOTAL KITS", value: stats.total_kits, color: "#00aaff" },
          { label: "COMPLETED", value: stats.completed, color: "#00ff88" },
          { label: "IN PROGRESS", value: stats.in_progress, color: "#ffaa00" },
          { label: "BACKLOG", value: stats.backlog, color: "#5a7a9f" },
          { label: "BUILD PHOTOS", value: stats.photos, color: "#cc44ff" },
          { label: "GALLERY POSTS", value: stats.gallery_posts, color: "#ff6600" },
        ].map(s => (
          <div key={s.label} style={{
            flex: "1 1 120px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 12px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.4rem", fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "1.5px", marginTop: 6 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {kits.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.9rem", color: "var(--text-dim)", letterSpacing: "1.5px" }}>
            NO KITS IN THIS HANGAR YET
          </div>
        </div>
      )}

      {/* KIT SECTIONS */}
      <Section title="FAVORITES" icon="⭐" kits={favKits} color="#ffcc00" />
      <Section title="COMPLETED" icon="✓" kits={completedKits} color="#00ff88" />
      <Section title="IN PROGRESS" icon="🔧" kits={inProgressKits} color="#ffaa00" />
      <Section title="BACKLOG" icon="📦" kits={backlogKits} color="#5a7a9f" />

      {/* GALLERY POSTS */}
      {gallery_posts.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: "0.85rem", letterSpacing: "2px",
            color: "#ff6600", marginBottom: 16,
          }}>
            📸 GALLERY POSTS
            <span style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "1px", marginLeft: 8 }}>
              {gallery_posts.length} POST{gallery_posts.length !== 1 ? "S" : ""}
            </span>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
          }}>
            {gallery_posts.map(post => {
              const images = typeof post.image_urls === "string" ? JSON.parse(post.image_urls) : post.image_urls;
              return (
                <div
                  key={post.id}
                  onClick={() => navigate("/gallery")}
                  style={{
                    aspectRatio: "1", borderRadius: 2, overflow: "hidden", cursor: "pointer",
                    position: "relative", background: "rgba(0,0,0,0.3)",
                  }}
                >
                  {images?.[0] && (
                    <img src={images[0]} alt={post.kit_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  )}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                    padding: "20px 8px 6px",
                  }}>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "#fff", letterSpacing: "0.5px" }}>
                      {post.kit_name}
                    </div>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px", marginTop: 2 }}>
                      ♥ {post.likes || 0}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PHOTO MODAL */}
      {photoModal && (
        <div
          onClick={() => setPhotoModal(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
            zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={photoModal.image_url}
            alt=""
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
            onClick={e => e.stopPropagation()}
          />
          {photoModal.caption && (
            <div style={{
              position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
              fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", color: "#fff",
              background: "rgba(0,0,0,0.7)", padding: "8px 16px", letterSpacing: "0.5px",
              maxWidth: "80vw", textAlign: "center",
            }}>
              {photoModal.caption}
            </div>
          )}
          <button
            onClick={() => setPhotoModal(null)}
            style={{
              position: "absolute", top: 20, right: 20,
              background: "none", border: "none", color: "#fff",
              fontSize: "1.5rem", cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
