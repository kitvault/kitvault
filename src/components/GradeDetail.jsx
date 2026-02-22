// ─────────────────────────────────────────────────────────────
// GradeDetail.jsx
// Full-page grade guide. Reads gradeSlug from URL params.
// ─────────────────────────────────────────────────────────────
import { useParams, useNavigate } from "react-router-dom";
import { GRADE_DATA } from "../data/grades.js";
import GradeNavRow from "./GradeNavRow.jsx";

export default function GradeDetail({ setGradeFilter }) {
  const { gradeSlug } = useParams();
  const navigate = useNavigate();
  const g = GRADE_DATA[gradeSlug];

  if (!g) return (
    <div style={{padding:"80px 40px",textAlign:"center",fontFamily:"'Share Tech Mono',monospace",color:"var(--text-dim)"}}>
      <div style={{fontSize:"3rem",marginBottom:"16px",opacity:0.3}}>404</div>
      <div style={{letterSpacing:"2px",marginBottom:"24px"}}>GRADE NOT FOUND</div>
      <button className="back-btn" style={{margin:"0 auto"}} onClick={() => navigate("/")}>← BACK TO LIBRARY</button>
    </div>
  );

  return (
    <>
      <GradeNavRow gradeSlug={gradeSlug} />
      <div style={{"--grade-color": g.color}}>
        <div className="grade-page-hero">
          <div className="grade-page-tag" style={{color:g.color}}>◈ GRADE GUIDE — {g.abbr}</div>
          <div className="grade-page-title" style={{color:g.color}}>{g.abbr}</div>
          <div className="grade-page-sub">{g.name.toUpperCase()} — {g.tagline}</div>
          <div className="grade-page-badge">{g.abbr} — {g.name.toUpperCase()} — SCALE {g.scale}</div>
          <div className="grade-stat-row" style={{justifyContent:"center",marginTop:"28px"}}>
            {g.stats.map(s => (
              <div key={s.lbl} className="grade-stat">
                <div className="grade-stat-val" style={{color:g.color}}>{s.val}</div>
                <div className="grade-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grade-page">
          <div className="grade-section">
            <div className="grade-section-title">◈ OVERVIEW</div>
            <div className="grade-section-body" dangerouslySetInnerHTML={{__html: g.intro}} />
          </div>
          {g.sections.map(s => (
            <div key={s.title} className="grade-section">
              <div className="grade-section-title">{s.title}</div>
              <div className="grade-section-body" dangerouslySetInnerHTML={{__html: s.body}} />
            </div>
          ))}
          <div style={{textAlign:"center",marginTop:"24px"}}>
            <button className="grade-kits-link" onClick={() => { setGradeFilter(g.abbr); navigate("/"); }}>
              VIEW ALL {g.abbr} KITS IN THE LIBRARY →
            </button>
          </div>
        </div>
        <GradeNavRow gradeSlug={gradeSlug} />
        <div style={{height:"40px"}} />
      </div>
    </>
  );
}
