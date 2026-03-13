// ─────────────────────────────────────────────────────────────
// FeaturesPage.jsx
// SEO landing page targeting long-tail Gunpla search queries.
// Routes: /features
// Targets: "Gunpla build tracker", "Gunpla backlog manager",
//   "digital Gundam manual archive", "Gunpla build timer"
// ─────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";

export default function FeaturesPage({ allKitsCount }) {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📖",
      tag: "MANUAL ARCHIVE",
      title: "Free Digital Gundam Manuals",
      color: "#00aaff",
      body: `Browse ${allKitsCount || "hundreds of"} Gunpla assembly manuals directly in your browser — no downloads, no PDFs to manage. Every grade from Entry Grade to Perfect Grade, all in one searchable archive. Find the manual you need, zoom into any page, and follow along while you build.`,
      keywords: "Digital Gundam manual archive · Online Gunpla instructions · Free manual viewer",
    },
    {
      icon: "📋",
      tag: "BACKLOG MANAGER",
      title: "Track Your Gunpla Backlog",
      color: "#ff6600",
      body: "Every builder has a pile of unbuilt kits. KitVault lets you organize your entire collection — mark kits as backlog, in-progress, or complete. See everything you own at a glance, decide what to build next, and never lose track of a kit again. Your vault syncs across devices so you can check it from your desk or your phone.",
      keywords: "Gunpla backlog tracker · Kit collection manager · Build queue organizer",
    },
    {
      icon: "⏱",
      tag: "BUILD TIMER",
      title: "Log Your Gunpla Build Time",
      color: "#ff2244",
      body: "Ever wonder how long a Master Grade actually takes? KitVault's built-in build timer lets you log hours per kit as you build. Start the timer when you sit down, pause when you take a break, and see your total build time grow. Compare your times with the community and track your progress across every kit you've ever built.",
      keywords: "Gunpla build timer · Build hour logger · How long does a Gunpla take",
    },
    {
      icon: "📊",
      tag: "BUILD PROGRESS",
      title: "Step-by-Step Build Tracking",
      color: "#00ffcc",
      body: "Track your build page by page through the manual. Mark steps as complete, see your progress percentage climb, and earn XP as you go. Whether you're halfway through an RG or just unboxing a PG, KitVault gives you a clear picture of where you are in every build.",
      keywords: "Gunpla build progress tracker · Step tracker · Build completion log",
    },
    {
      icon: "⭐",
      tag: "COMMUNITY RATINGS",
      title: "Rate and Review Gunpla Kits",
      color: "#ffcc00",
      body: "Rate kits across five categories — difficulty, articulation, detail, fun factor, and value. See how the community scores each kit before you buy. Whether you're choosing between two Master Grades or looking for the best beginner kit, community ratings help you make better decisions.",
      keywords: "Gunpla kit reviews · Kit ratings · Best Gunpla kits",
    },
    {
      icon: "🖼",
      tag: "GALLERY",
      title: "Share Your Completed Builds",
      color: "#aa88ff",
      body: "Finished a kit? Upload photos to the community gallery and show off your work. Browse what other builders are completing, leave comments, and get inspired for your next build. Every completed kit with a photo gets featured on the homepage.",
      keywords: "Gunpla gallery · Completed build showcase · Share Gundam builds",
    },
  ];

  return (
    <>
      <div className="page-hero">
        <div className="page-tag">WHY KITVAULT</div>
        <h1 className="page-title" style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)" }}>THE FREE GUNPLA BUILDING APP</h1>
        <p className="page-sub">TRACK YOUR BACKLOG · LOG BUILD HOURS · BROWSE DIGITAL MANUALS</p>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* Intro paragraph — keyword-rich but natural */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.7rem",
          lineHeight: 2,
          color: "var(--text-dim, #5a7a9f)",
          textAlign: "center",
          marginBottom: 48,
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          KitVault is a free Gunpla build tracker and digital manual archive built for the hobby.
          Whether you're managing a growing backlog, logging build hours on a Perfect Grade, or
          looking up assembly instructions for your first High Grade — everything lives in one place.
        </div>

        {/* Feature sections */}
        {features.map((f, i) => (
          <div key={f.tag} style={{
            marginBottom: 48,
            paddingBottom: 48,
            borderBottom: i < features.length - 1 ? "1px solid var(--border, #1a2f50)" : "none",
          }}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "3px",
              color: f.color,
              marginBottom: 8,
            }}>
              {f.icon} {f.tag}
            </div>

            <h2 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "var(--text-heading, #c8ddf5)",
              marginBottom: 12,
              lineHeight: 1.2,
            }}>
              {f.title}
            </h2>

            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.65rem",
              lineHeight: 2,
              color: "var(--text-dim, #5a7a9f)",
              marginBottom: 12,
            }}>
              {f.body}
            </p>

            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.5rem",
              letterSpacing: "1px",
              color: "var(--text-dim, #5a7a9f)",
              opacity: 0.4,
            }}>
              {f.keywords}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "2px",
            color: "var(--text-dim, #5a7a9f)",
            marginBottom: 20,
          }}>
            100% FREE · NO ADS · OPEN TO ALL BUILDERS
          </div>
          <button
            className="grade-kits-link"
            onClick={() => navigate("/")}
            style={{ fontSize: "0.7rem", padding: "12px 32px" }}
          >
            BROWSE THE KIT LIBRARY →
          </button>
        </div>
      </div>
    </>
  );
}
