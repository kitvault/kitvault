// ─────────────────────────────────────────────────────────────
// LoginModal.jsx
// Email/password + Google OAuth sign-in modal.
// Extracted from App.jsx.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";

const GOOGLE_CLIENT_ID = "1048413363942-31kef3psma06tg0c13heiiufoier6ltb.apps.googleusercontent.com";

export default function LoginModal({ onClose, onLogin, onSignup, onGoogleLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef(null);

  const resetFields = () => { setEmail(""); setPassword(""); setConfirmPassword(""); setError(""); };

  // Initialize Google Sign-In button
  useEffect(() => {
    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          setLoading(true);
          setError("");
          const result = await onGoogleLogin(response.credential);
          if (result.ok) { onClose(); } else { setError(result.error || "Google sign-in failed"); }
          setLoading(false);
        },
      });
      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text: "continue_with",
          width: 356,
          logo_alignment: "center",
        });
      }
    };

    // Load Google Identity Services script if not already loaded
    if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => setTimeout(initGoogle, 100);
      document.head.appendChild(script);
    } else {
      setTimeout(initGoogle, 100);
    }
  }, [onGoogleLogin, onClose]);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Enter both email and password"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Invalid email format"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }

    if (mode === "signup") {
      if (password !== confirmPassword) { setError("Passwords don't match"); return; }
      setLoading(true);
      const result = await onSignup(email, password);
      if (result.ok) { onClose(); } else { setError(result.error); }
      setLoading(false);
    } else {
      setLoading(true);
      const result = await onLogin(email, password);
      if (result.ok) { onClose(); } else { setError(result.error); }
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,5,18,0.92)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "linear-gradient(160deg,#0a1628 0%,#070f1e 100%)", border: "1px solid rgba(0,170,255,0.3)", borderRadius: 2, width: "100%", maxWidth: 420, padding: "36px 32px", boxShadow: "0 0 80px rgba(0,170,255,0.15)", clipPath: "polygon(0 0,96% 0,100% 4%,100% 100%,4% 100%,0 96%)", position: "relative" }} onClick={e => e.stopPropagation()}>

        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "#00aaff", letterSpacing: "3px", marginBottom: 16 }}>◈ KITVAULT ACCOUNT</div>

        {/* Google Sign-In Button */}
        <div ref={googleBtnRef} style={{ display: "flex", justifyContent: "center", marginBottom: 20 }} />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "#3a5a7a", letterSpacing: "2px" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => { setMode("login"); resetFields(); }}
            style={{
              flex: 1, background: mode === "login" ? "rgba(0,170,255,0.08)" : "transparent",
              border: "none", borderBottom: mode === "login" ? "2px solid #00aaff" : "2px solid transparent",
              color: mode === "login" ? "#00aaff" : "#3a5a7a",
              fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 0",
              cursor: "pointer", letterSpacing: "2px", transition: "all 0.2s",
            }}
          >SIGN IN</button>
          <button
            onClick={() => { setMode("signup"); resetFields(); }}
            style={{
              flex: 1, background: mode === "signup" ? "rgba(0,255,136,0.06)" : "transparent",
              border: "none", borderBottom: mode === "signup" ? "2px solid #00ff88" : "2px solid transparent",
              color: mode === "signup" ? "#00ff88" : "#3a5a7a",
              fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 0",
              cursor: "pointer", letterSpacing: "2px", transition: "all 0.2s",
            }}
          >SIGN UP</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "1px", marginBottom: 4 }}>EMAIL</div>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              onKeyDown={e => e.key === "Enter" && (mode === "login" || confirmPassword) && handleSubmit()}
              style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 12px", letterSpacing: "0.5px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "1px", marginBottom: 4 }}>PASSWORD{mode === "signup" ? " (8+ CHARACTERS)" : ""}</div>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && mode === "login" && handleSubmit()}
              style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 12px", letterSpacing: "0.5px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {mode === "signup" && (
            <div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "1px", marginBottom: 4 }}>CONFIRM PASSWORD</div>
              <input
                type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 12px", letterSpacing: "0.5px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          )}

          {error && (
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", color: "#ff3c3c", letterSpacing: "0.5px" }}>{error}</div>
          )}

          <button
            onClick={handleSubmit} disabled={loading}
            style={{
              width: "100%",
              background: mode === "signup" ? "rgba(0,255,136,0.1)" : "rgba(0,170,255,0.1)",
              border: `1px solid ${mode === "signup" ? "rgba(0,255,136,0.3)" : "rgba(0,170,255,0.3)"}`,
              color: mode === "signup" ? "#00ff88" : "#00aaff",
              fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "12px",
              cursor: loading ? "wait" : "pointer", letterSpacing: "2px", marginTop: 4,
            }}
          >
            {loading ? (mode === "signup" ? "CREATING ACCOUNT..." : "SIGNING IN...") : (mode === "signup" ? "CREATE ACCOUNT →" : "SIGN IN →")}
          </button>

          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim,#5a7a9f)", letterSpacing: "0.5px", lineHeight: 1.8, textAlign: "center", marginTop: 4 }}>
            {mode === "login"
              ? "Don't have an account? Click SIGN UP above."
              : "Already have an account? Click SIGN IN above."
            }
          </div>
        </div>

        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#5a7a9f", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.8rem", width: 32, height: 32, cursor: "pointer" }}>✕</button>
      </div>
    </div>
  );
}
