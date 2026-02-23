// ─────────────────────────────────────────────────────────────
// PdfFullscreenModal.jsx
// Custom PDF renderer using PDF.js — renders every page as a
// canvas so it works properly on iOS Safari and all mobile.
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { R2 } from "../data/grades.js";

// Load PDF.js from CDN (avoids a heavy npm dep)
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.mjs";
const WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs";

let pdfjsLib = null;

async function getPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  const mod = await import(/* @vite-ignore */ PDFJS_CDN);
  mod.GlobalWorkerOptions.workerSrc = WORKER_CDN;
  pdfjsLib = mod;
  return pdfjsLib;
}

// ── Single page rendered onto a <canvas> ────────────────────
function PdfPage({ pdfDoc, pageNum, containerWidth }) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !containerWidth) return;

    let cancelled = false;

    const render = async () => {
      if (renderTaskRef.current) {
        await renderTaskRef.current.cancel().catch(() => {});
      }

      const page = await pdfDoc.getPage(pageNum);
      if (cancelled) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const viewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / viewport.width;
      const scaled = page.getViewport({ scale });

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(scaled.width * dpr);
      canvas.height = Math.floor(scaled.height * dpr);
      canvas.style.width = `${scaled.width}px`;
      canvas.style.height = `${scaled.height}px`;

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      renderTaskRef.current = page.render({ canvasContext: ctx, viewport: scaled });
      try {
        await renderTaskRef.current.promise;
      } catch (e) {
        if (e?.name !== "RenderingCancelledException") console.error(e);
      }
    };

    render();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) renderTaskRef.current.cancel().catch(() => {});
    };
  }, [pdfDoc, pageNum, containerWidth]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        marginBottom: "8px",
        background: "#fff",
        width: "100%",
        maxWidth: "100%",
      }}
    />
  );
}

// ── Main modal ───────────────────────────────────────────────
export default function PdfFullscreenModal({ manual, onClose }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const pdfUrl = `${R2}/${manual.url}`;

  // Measure container width for canvas scaling
  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 24); // minus padding
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Load the PDF document
  useEffect(() => {
    let destroyed = false;
    setLoading(true);
    setError(null);
    setPdfDoc(null);
    setNumPages(0);

    const load = async () => {
      try {
        const lib = await getPdfJs();
        const loadingTask = lib.getDocument({ url: pdfUrl, rangeChunkSize: 65536 });
        loadingTask.onProgress = ({ loaded, total }) => {
          if (total > 0) setLoadingProgress(Math.round((loaded / total) * 100));
        };
        const doc = await loadingTask.promise;
        if (destroyed) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
      } catch (e) {
        if (!destroyed) setError(e?.message || "Failed to load PDF");
      } finally {
        if (!destroyed) setLoading(false);
      }
    };

    load();
    return () => { destroyed = true; };
  }, [pdfUrl]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0f",
      }}
    >
      {/* ── Header ── */}
      <div
        className="pdf-fullscreen-header"
        style={{ flexShrink: 0 }}
      >
        <span className="pdf-fullscreen-title">
          ◈ {manual.name.toUpperCase()}
          {numPages > 0 && (
            <span style={{ opacity: 0.5, fontSize: "0.7em", marginLeft: "12px" }}>
              {numPages} PAGES
            </span>
          )}
        </span>
        <div className="pdf-fullscreen-actions" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a
            href={pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-fullscreen-close"
            style={{ textDecoration: "none" }}
          >
            ↓ DOWNLOAD
          </a>
          <button className="pdf-fullscreen-close" onClick={onClose}>
            ✕ CLOSE FULLSCREEN
          </button>
        </div>
      </div>

      {/* ── Scrollable canvas area ── */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: "scroll",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          padding: "12px",
          boxSizing: "border-box",
        }}
      >
        {/* Loading spinner */}
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              gap: "16px",
              fontFamily: "'Share Tech Mono', monospace",
              color: "var(--text-dim, #888)",
            }}
          >
            <style>{`@keyframes kv-spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontSize: "2.5rem", animation: "kv-spin 1.2s linear infinite" }}>◈</div>
            <div style={{ fontSize: "0.75rem", letterSpacing: "2px" }}>
              {loadingProgress > 0 ? `LOADING PDF — ${loadingProgress}%` : "LOADING PDF..."}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              gap: "16px",
              fontFamily: "'Share Tech Mono', monospace",
              color: "var(--text-dim, #888)",
              textAlign: "center",
              padding: "32px",
            }}
          >
            <div style={{ fontSize: "2.5rem" }}>⚠</div>
            <div style={{ fontSize: "0.8rem", letterSpacing: "2px" }}>FAILED TO LOAD PDF</div>
            <div style={{ fontSize: "0.65rem", color: "#555", maxWidth: "300px" }}>{error}</div>
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
              ↗ OPEN IN BROWSER INSTEAD
            </a>
          </div>
        )}

        {/* 
          Render ALL pages as individual canvases stacked vertically.
          This is the core fix: instead of relying on the browser's PDF
          plugin (which iOS renders as a single frozen image), we draw
          each page ourselves using PDF.js. The user can then scroll
          through the container normally like any webpage.
        */}
        {!loading && !error && pdfDoc && containerWidth > 0 &&
          Array.from({ length: numPages }, (_, i) => (
            <PdfPage
              key={i + 1}
              pdfDoc={pdfDoc}
              pageNum={i + 1}
              containerWidth={containerWidth}
            />
          ))
        }
      </div>
    </div>
  );
}
