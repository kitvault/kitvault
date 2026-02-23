// ─────────────────────────────────────────────────────────────
// PdfFullscreenModal.jsx
// Fullscreen PDF viewer — renders all pages via PDF.js canvases.
// Uses the shared loadPdfJs() loader from grades.js so the
// script tag is only ever added to the DOM once.
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { R2, loadPdfJs } from "../data/grades.js";

// ── One canvas page ──────────────────────────────────────────
function PdfPage({ pdf, pageNum, width }) {
  const canvasRef = useRef(null);
  const taskRef   = useRef(null);

  useEffect(() => {
    if (!pdf || !width || !canvasRef.current) return;
    let alive = true;

    (async () => {
      try {
        if (taskRef.current) { taskRef.current.cancel(); taskRef.current = null; }
        const page   = await pdf.getPage(pageNum);
        if (!alive) return;
        const baseVp = page.getViewport({ scale: 1 });
        const vp     = page.getViewport({ scale: width / baseVp.width });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr    = window.devicePixelRatio || 1;
        canvas.width  = Math.floor(vp.width  * dpr);
        canvas.height = Math.floor(vp.height * dpr);
        canvas.style.width  = `${vp.width}px`;
        canvas.style.height = `${vp.height}px`;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        taskRef.current = page.render({ canvasContext: ctx, viewport: vp });
        await taskRef.current.promise;
      } catch (e) {
        if (e?.name !== "RenderingCancelledException") console.warn("PDF page render:", e);
      }
    })();

    return () => {
      alive = false;
      if (taskRef.current) { taskRef.current.cancel(); taskRef.current = null; }
    };
  }, [pdf, pageNum, width]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", background: "#fff", marginBottom: "6px", maxWidth: "100%" }}
    />
  );
}

// ── Main modal ───────────────────────────────────────────────
export default function PdfFullscreenModal({ manual, onClose }) {
  const pdfUrl = `${R2}/${manual.url}`;

  const [pdf,      setPdf]      = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status,   setStatus]   = useState("loading"); // loading | ready | error
  const [errMsg,   setErrMsg]   = useState("");
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  // Measure container width for canvas scaling
  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => setWidth(containerRef.current?.clientWidth - 24 || 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Load the PDF
  useEffect(() => {
    let dead = false;
    setStatus("loading");
    setProgress(0);
    setPdf(null);
    setNumPages(0);

    (async () => {
      try {
        const lib  = await loadPdfJs();
        const task = lib.getDocument({ url: pdfUrl, withCredentials: false });
        task.onProgress = ({ loaded, total }) => {
          if (total) setProgress(Math.round((loaded / total) * 100));
        };
        const doc = await task.promise;
        if (dead) return;
        setPdf(doc);
        setNumPages(doc.numPages);
        setStatus("ready");
      } catch (e) {
        if (dead) return;
        setErrMsg(e?.message || "Failed to load PDF");
        setStatus("error");
        console.error("PdfFullscreenModal load error:", e);
      }
    })();

    return () => { dead = true; };
  }, [pdfUrl]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column", background: "#0a0a0f",
    }}>
      {/* ── Header ── */}
      <div
        className="pdf-fullscreen-header"
        style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}
      >
        <span className="pdf-fullscreen-title">
          ◈ {manual.name.toUpperCase()}
          {numPages > 0 && (
            <span style={{ opacity: 0.45, fontSize: "0.7em", marginLeft: 10 }}>
              {numPages} PGS
            </span>
          )}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
              letterSpacing: "1px", color: "var(--accent,#00aaff)",
              border: "1px solid var(--accent,#00aaff)", padding: "6px 12px",
              background: "rgba(0,170,255,0.08)", textDecoration: "none", whiteSpace: "nowrap",
            }}
          >
            ↓ DOWNLOAD
          </a>
          <button className="pdf-fullscreen-close" onClick={onClose}>✕ CLOSE</button>
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
        {/* Loading */}
        {status === "loading" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", minHeight: "60vh", gap: 16,
            fontFamily: "'Share Tech Mono',monospace", color: "var(--text-dim,#888)",
          }}>
            <style>{`@keyframes kvfspin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ fontSize: "2.5rem", animation: "kvfspin 1.2s linear infinite", color: "var(--accent,#00aaff)" }}>◈</div>
            <div style={{ fontSize: "0.75rem", letterSpacing: "2px" }}>
              {progress > 0 ? `LOADING — ${progress}%` : "LOADING PDF..."}
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", minHeight: "60vh", gap: 16,
            fontFamily: "'Share Tech Mono',monospace", color: "var(--text-dim,#888)",
            textAlign: "center", padding: "32px",
          }}>
            <div style={{ fontSize: "2.5rem" }}>⚠</div>
            <div style={{ fontSize: "0.8rem", letterSpacing: "2px" }}>FAILED TO LOAD PDF</div>
            <div style={{ fontSize: "0.65rem", color: "#555", maxWidth: "300px" }}>{errMsg}</div>
            <a
              href={pdfUrl} target="_blank" rel="noopener noreferrer"
              style={{
                color: "var(--accent,#00aaff)", fontSize: "0.75rem", letterSpacing: "1px",
                border: "1px solid var(--accent,#00aaff)", padding: "10px 24px",
                textDecoration: "none", background: "rgba(0,170,255,0.1)",
              }}
            >
              ↗ OPEN IN BROWSER
            </a>
            <div style={{ fontSize: "0.6rem", color: "#444", maxWidth: "280px" }}>
              If this keeps failing, CORS may not be enabled on your R2 bucket.
              Go to Cloudflare → R2 → your bucket → Settings → CORS Policy
              and allow GET requests from https://kitvault.io
            </div>
          </div>
        )}

        {/* All pages as canvases */}
        {status === "ready" && pdf && width > 0 &&
          Array.from({ length: numPages }, (_, i) => (
            <PdfPage key={i + 1} pdf={pdf} pageNum={i + 1} width={width} />
          ))
        }
      </div>
    </div>
  );
}
