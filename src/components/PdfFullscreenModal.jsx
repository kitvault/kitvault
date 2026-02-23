// ─────────────────────────────────────────────────────────────
// PdfFullscreenModal.jsx
// Overlay that renders a PDF in a full-browser-height iframe.
// Closes on Escape key or clicking the close button.
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { R2 } from "../data/grades.js";

// Detect iOS / iPadOS
const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export default function PdfFullscreenModal({ manual, onClose }) {
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isIOS() || window.innerWidth <= 768);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const pdfUrl = `${R2}/${manual.url}`;

  return (
    <div
      className="pdf-fullscreen-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0f",
      }}
    >
      {/* Header */}
      <div
        className="pdf-fullscreen-header"
        style={{ flexShrink: 0 }}
      >
        <span className="pdf-fullscreen-title">
          ◈ {manual.name.toUpperCase()}
        </span>
        <div className="pdf-fullscreen-actions">
          {/* On mobile, offer an "Open in browser" button as a reliable fallback */}
          {isMobile && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "1px",
                color: "var(--accent, #00aaff)",
                border: "1px solid var(--accent, #00aaff)",
                padding: "6px 12px",
                background: "rgba(0,170,255,0.08)",
                textDecoration: "none",
                marginRight: "8px",
              }}
            >
              ↗ OPEN PDF
            </a>
          )}
          <button className="pdf-fullscreen-close" onClick={onClose}>
            ✕ CLOSE FULLSCREEN
          </button>
        </div>
      </div>

      {/* PDF Body */}
      <div
        className="pdf-fullscreen-body"
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: "auto",
          // Critical for iOS Safari touch scrolling inside a fixed container
          WebkitOverflowScrolling: "touch",
          overflowY: "auto",
          overflowX: "auto",
          position: "relative",
        }}
      >
        {isMobile ? (
          /*
           * iOS Safari cannot scroll inside iframes containing PDFs —
           * the PDF plugin captures all touch events. The most reliable
           * cross-device solution is to render the PDF in an <object> tag
           * inside a scrollable div, or redirect to the raw URL.
           * We use <object> here; if the browser can't render it inline
           * it shows the fallback link.
           */
          <object
            data={pdfUrl}
            type="application/pdf"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              minHeight: "calc(100vh - 60px)",
              border: "none",
            }}
          >
            {/* Fallback for browsers that can't embed PDF (most iOS) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "16px",
                padding: "32px",
                textAlign: "center",
                fontFamily: "'Share Tech Mono', monospace",
                color: "var(--text-dim, #888)",
              }}
            >
              <div style={{ fontSize: "3rem" }}>📄</div>
              <div style={{ fontSize: "0.8rem", letterSpacing: "2px" }}>
                PDF PREVIEW NOT SUPPORTED ON THIS DEVICE
              </div>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--accent, #00aaff)",
                  fontSize: "0.75rem",
                  letterSpacing: "1px",
                  border: "1px solid var(--accent, #00aaff)",
                  padding: "10px 24px",
                  textDecoration: "none",
                  background: "rgba(0,170,255,0.1)",
                }}
              >
                ↗ OPEN PDF IN BROWSER
              </a>
              <div style={{ fontSize: "0.6rem", color: "var(--text-dim, #666)" }}>
                TAP TO VIEW OR DOWNLOAD THE MANUAL
              </div>
            </div>
          </object>
        ) : (
          <iframe
            src={pdfUrl}
            title={manual.name}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              minHeight: "calc(100vh - 60px)",
              border: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
