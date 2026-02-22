// ─────────────────────────────────────────────────────────────
// GradeNavRow.jsx
// Prev / next navigation bar shown at the top and bottom of
// every grade guide page.
// ─────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import { GRADE_ORDER, GRADE_DATA } from "../data/grades.js";

export default function GradeNavRow({ gradeSlug }) {
  const navigate = useNavigate();
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
