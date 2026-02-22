// ─────────────────────────────────────────────────────────────
// PdfFullscreenModal.jsx
// Overlay that renders a PDF in a full-browser-height iframe.
// Closes on Escape key or clicking the close button.
// ─────────────────────────────────────────────────────────────
import { useEffect } from "react";
import { R2 } from "../data/grades.js";

export default function PdfFullscreenModal({ manual, onClose }) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="pdf-fullscreen-overlay">
      <div className="pdf-fullscreen-header">
        <span className="pdf-fullscreen-title">◈ {manual.name.toUpperCase()}</span>
        <div className="pdf-fullscreen-actions">
          <button className="pdf-fullscreen-close" onClick={onClose}>✕ CLOSE FULLSCREEN</button>
        </div>
      </div>
      <div className="pdf-fullscreen-body">
        <iframe src={`${R2}/${manual.url}`} title={manual.name} />
      </div>
    </div>
  );
}
