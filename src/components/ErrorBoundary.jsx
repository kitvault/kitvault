// ─────────────────────────────────────────────────────────────
// ErrorBoundary.jsx
// Catches render crashes, shows recovery UI.
// Extracted from App.jsx.
// ─────────────────────────────────────────────────────────────
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("[KitVault] Render error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "120px 20px", fontFamily: "'Share Tech Mono',monospace" }}>
          <div style={{ fontSize: "2rem", color: "#ff6600", marginBottom: 16 }}>⚠</div>
          <div style={{ fontSize: "0.9rem", color: "#c8ddf5", letterSpacing: "2px", marginBottom: 12 }}>SOMETHING WENT WRONG</div>
          <div style={{ fontSize: "0.6rem", color: "#5a7a9f", letterSpacing: "1px", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
            An unexpected error occurred. Try refreshing the page.
          </div>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/"; }}
            style={{
              background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)",
              color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
              padding: "10px 24px", cursor: "pointer", letterSpacing: "1.5px",
            }}
          >
            ↻ RELOAD KITVAULT
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
