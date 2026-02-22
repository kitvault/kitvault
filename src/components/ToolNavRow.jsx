// ─────────────────────────────────────────────────────────────
// ToolNavRow.jsx
// Prev / next navigation bar shown at top and bottom of every
// tools page. Reads current route from location to determine
// position in TOOL_ORDER.
// ─────────────────────────────────────────────────────────────
import { useNavigate, useLocation } from "react-router-dom";
import { TOOL_ORDER } from "../data/grades.js";

export default function ToolNavRow() {
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
