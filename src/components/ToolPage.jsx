// ─────────────────────────────────────────────────────────────
// ToolPage.jsx
// Generic tool page renderer. Reads the tool slug from URL
// params and looks up the matching entry in TOOLS_DATA.
//
// Supports two card layouts:
//   hasTiers: true  → shows a tier bar (used by nippers)
//   hasTiers: false → standard simple card layout
// ─────────────────────────────────────────────────────────────
import { useParams } from "react-router-dom";
import { TOOLS_DATA } from "../data/tools.js";
import ToolNavRow from "./ToolNavRow.jsx";

const AFFILIATE_NOTE = "★ KitVault.io participates in the Amazon Associates program. Links above are affiliate links. We earn a small commission at no extra cost to you, which helps keep the site free. ⚠ These are recommendations only. Please do your own due diligence before purchasing.";

function TieredCard({ item }) {
  return (
    <div className="tool-card" style={{"--tc": item.tierColor}}>
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
        {item.asin && (
          <a
            className="tool-amazon-btn"
            href={`https://www.amazon.com/dp/${item.asin}?tag=kitvault-20`}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            VIEW ON AMAZON →
          </a>
        )}
      </div>
    </div>
  );
}

function SimpleCard({ item }) {
  return (
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
        {item.badge && <span className="tool-badge">★ {item.badge}</span>}
        {item.asin && (
          <a
            className="tool-amazon-btn"
            href={`https://www.amazon.com/dp/${item.asin}?tag=kitvault-20`}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            VIEW ON AMAZON →
          </a>
        )}
      </div>
    </div>
  );
}

export default function ToolPage() {
  const { toolSlug } = useParams();
  const tool = TOOLS_DATA[toolSlug];

  if (!tool) return (
    <div style={{padding:"80px 40px",textAlign:"center",fontFamily:"'Share Tech Mono',monospace",color:"var(--text-dim)"}}>
      <div style={{fontSize:"3rem",marginBottom:"16px",opacity:0.3}}>404</div>
      <div style={{letterSpacing:"2px"}}>TOOL PAGE NOT FOUND</div>
    </div>
  );

  return (
    <>
      <ToolNavRow />
      <div className="page-hero">
        <div className="page-tag">◈ HOBBY TOOLS</div>
        <div className="page-title">{tool.title}</div>
        <div className="page-sub">{tool.sub}</div>
      </div>
      <div className="tools-page">
        <div className="tools-intro-block">
          <div className="tools-intro-text">{tool.intro}</div>
          <div className="tools-intro-tip">
            <span className="tools-tip-label">◈ PRO TIP</span>
            {tool.tip}
          </div>
        </div>
        <div className="tools-section-title">{tool.sectionTitle}</div>
        <div className="tools-grid">
          {tool.products.map(item =>
            tool.hasTiers
              ? <TieredCard key={item.name} item={item} />
              : <SimpleCard key={item.name} item={item} />
          )}
        </div>
        <div className="tools-affiliate-note">{AFFILIATE_NOTE}</div>
      </div>
      <ToolNavRow />
    </>
  );
}
