import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c12;
    --bg2: #0d1420;
    --bg3: #111b2e;
    --panel: #0a1220;
    --border: #1a2f50;
    --border-bright: #1e4080;
    --accent: #00aaff;
    --accent2: #ff6600;
    --accent3: #00ffcc;
    --text: #c8ddf5;
    --text-dim: #5a7a9f;
    --text-bright: #e8f4ff;
    --red: #ff2244;
    --gold: #ffcc00;
    --green: #00ff88;
    --glow: 0 0 20px rgba(0,170,255,0.3);
    --glow2: 0 0 15px rgba(255,102,0,0.4);
    --glow-green: 0 0 15px rgba(0,255,136,0.4);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Rajdhani', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  .grid-bg {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background-image:
      linear-gradient(rgba(0,170,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,170,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none; z-index: 0;
  }

  .app { position: relative; z-index: 1; min-height: 100vh; }

  /* HEADER */
  .header {
    border-bottom: 1px solid var(--border);
    background: linear-gradient(180deg, rgba(0,20,50,0.95) 0%, rgba(8,12,18,0.95) 100%);
    backdrop-filter: blur(10px);
    position: sticky; top: 0; z-index: 100;
    padding: 0 40px;
    display: flex; align-items: center; justify-content: space-between;
    height: 70px;
  }
  .header::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.6;
  }
  .logo {
    font-family: 'Orbitron', monospace;
    font-size: 1.6rem; font-weight: 900; letter-spacing: 2px;
    color: var(--text-bright);
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; text-decoration: none;
  }
  .logo-icon {
    width: 36px; height: 36px;
    border: 2px solid var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: var(--accent);
    clip-path: polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%);
    background: rgba(0,170,255,0.08); box-shadow: var(--glow);
  }
  .logo-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; color: var(--text-dim);
    letter-spacing: 3px; display: block; line-height: 1; margin-top: 2px;
  }
  .logo-text { display: flex; flex-direction: column; }
  .header-right {
    display: flex; align-items: center; gap: 12px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; color: var(--text-dim); letter-spacing: 1px;
  }
  .status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent3); box-shadow: 0 0 8px var(--accent3);
    animation: pulse 2s infinite;
  }
  .cog-btn {
    background: none; border: 1px solid var(--border); color: var(--text-dim);
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.25s;
    clip-path: polygon(0 0, 88% 0, 100% 12%, 100% 100%, 12% 100%, 0 88%);
    font-size: 1.1rem; flex-shrink: 0;
  }
  .cog-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,170,255,0.08); transform: rotate(30deg); }
  .cog-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(0,170,255,0.1); }

  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

  /* HERO */
  .hero {
    padding: 80px 40px 60px; text-align: center;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute;
    top: -100px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0,170,255,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; color: var(--accent); letter-spacing: 4px;
    margin-bottom: 16px;
    display: flex; align-items: center; justify-content: center; gap: 12px;
  }
  .hero-tag::before, .hero-tag::after { content:''; height:1px; width:40px; background:var(--accent); opacity:0.5; }
  .hero h1 {
    font-family: 'Orbitron', monospace;
    font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 900;
    color: var(--text-bright); letter-spacing: 4px; line-height: 1; margin-bottom: 8px;
  }
  .hero h1 .a1 { color: var(--accent); }
  .hero h1 .a2 { color: var(--accent2); }
  .hero-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem; color: var(--text-dim); letter-spacing: 2px; margin-bottom: 32px;
  }
  .hero-stats { display: flex; justify-content: center; gap: 40px; margin-bottom: 48px; flex-wrap: wrap; }
  .stat {
    text-align: center; border: 1px solid var(--border); padding: 12px 24px;
    background: var(--panel);
    clip-path: polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%);
  }
  .stat-num { font-family: 'Orbitron', monospace; font-size: 1.6rem; font-weight: 700; color: var(--accent); }
  .stat-label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: var(--text-dim); letter-spacing: 2px; }

  /* CONTROLS */
  .controls { padding: 0 40px 24px; display: flex; flex-direction: column; gap: 12px; }
  .controls-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; width: 100%; }
  .controls-label {
    font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
    color: var(--text-dim); letter-spacing: 2px; white-space: nowrap; flex-shrink: 0;
  }
  .search-wrap { flex: 1; min-width: 200px; position: relative; }
  .search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--accent); font-size: 0.85rem; font-family: 'Share Tech Mono', monospace;
  }
  .search-input {
    width: 100%; background: var(--panel); border: 1px solid var(--border);
    color: var(--text-bright); font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem; padding: 10px 16px 10px 40px; outline: none;
    clip-path: polygon(0 0, 98% 0, 100% 20%, 100% 100%, 2% 100%, 0 80%);
    transition: border-color 0.2s; letter-spacing: 1px;
  }
  .search-input::placeholder { color: var(--text-dim); }
  .search-input:focus { border-color: var(--accent); box-shadow: var(--glow); }
  .filter-btn {
    background: var(--panel); border: 1px solid var(--border); color: var(--text-dim);
    font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; padding: 10px 16px;
    cursor: pointer; letter-spacing: 1px; transition: all 0.2s;
    clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
    white-space: nowrap; flex-shrink: 0;
  }
  .filter-btn:hover, .filter-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(0,170,255,0.08); }
  .filter-btn.active { box-shadow: var(--glow); }
  .filter-divider { width: 1px; height: 24px; background: var(--border); flex-shrink: 0; }
  .sort-btn {
    background: var(--panel); border: 1px solid var(--border); color: var(--text-dim);
    font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; padding: 10px 16px;
    cursor: pointer; letter-spacing: 1px; transition: all 0.2s;
    clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
    white-space: nowrap; flex-shrink: 0; display: flex; align-items: center; gap: 6px;
  }
  .sort-btn:hover, .sort-btn.active { border-color: var(--accent3); color: var(--accent3); background: rgba(0,255,204,0.06); }
  .sort-btn.active { box-shadow: var(--glow-green); }
  .pdf-toggle {
    display: flex; align-items: center; gap: 8px;
    background: var(--panel); border: 1px solid var(--border);
    padding: 10px 16px; cursor: pointer; transition: all 0.2s;
    clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
    flex-shrink: 0;
  }
  .pdf-toggle:hover { border-color: var(--accent2); }
  .pdf-toggle.on { border-color: var(--accent2); background: rgba(255,102,0,0.08); box-shadow: var(--glow2); }
  .pdf-toggle-box {
    width: 14px; height: 14px; border: 1px solid var(--text-dim);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.6rem; transition: all 0.2s; flex-shrink: 0;
  }
  .pdf-toggle.on .pdf-toggle-box { border-color: var(--accent2); color: var(--accent2); background: rgba(255,102,0,0.15); }
  .pdf-toggle-label {
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    color: var(--text-dim); letter-spacing: 1px; transition: color 0.2s;
  }
  .pdf-toggle.on .pdf-toggle-label { color: var(--accent2); }

  /* SECTION HEADER */
  .section-header { padding: 0 40px 20px; display: flex; align-items: center; gap: 16px; }
  .section-title { font-family: 'Orbitron', monospace; font-size: 0.9rem; font-weight: 700; color: var(--text-bright); letter-spacing: 3px; }
  .section-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }
  .section-count { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: var(--text-dim); letter-spacing: 1px; }

  /* KIT GRID */
  .kit-grid { padding: 0 40px 60px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
  .kit-card {
    background: var(--panel); border: 1px solid var(--border);
    cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
    clip-path: polygon(0 0, 94% 0, 100% 6%, 100% 100%, 6% 100%, 0 94%);
  }
  .kit-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--card-accent, var(--accent)), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .kit-card:hover { border-color: var(--border-bright); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.5), var(--glow); }
  .kit-card:hover::before { opacity: 1; }
  .card-grade-banner { height: 4px; background: var(--card-accent, var(--accent)); opacity: 0.7; }
  .card-body { padding: 20px; }
  .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .grade-badge {
    font-family: 'Orbitron', monospace; font-size: 0.65rem; font-weight: 700;
    padding: 4px 10px; letter-spacing: 2px;
    background: var(--card-accent-bg, rgba(0,170,255,0.1));
    border: 1px solid var(--card-accent, var(--accent));
    color: var(--card-accent, var(--accent));
  }
  .manual-count { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: var(--text-dim); letter-spacing: 1px; }
  .card-title { font-family: 'Rajdhani', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--text-bright); margin-bottom: 6px; line-height: 1.2; }
  .card-series { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: var(--text-dim); letter-spacing: 1px; margin-bottom: 16px; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 12px; }
  .card-scale { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: var(--accent3); letter-spacing: 1px; }
  .card-arrow { color: var(--card-accent, var(--accent)); font-size: 1rem; transition: transform 0.2s; }
  .kit-card:hover .card-arrow { transform: translateX(4px); }

  /* KIT DETAIL */
  .back-btn {
    display: flex; align-items: center; gap: 8px;
    background: none; border: 1px solid var(--border); color: var(--text-dim);
    font-family: 'Share Tech Mono', monospace; font-size: 0.75rem;
    padding: 8px 16px; cursor: pointer; letter-spacing: 1px; transition: all 0.2s;
    margin: 24px 40px;
    clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
  }
  .back-btn:hover { border-color: var(--accent); color: var(--accent); }
  .kit-detail-header {
    padding: 0 40px 32px; border-bottom: 1px solid var(--border);
    margin-bottom: 24px; position: relative;
  }
  .kit-detail-header::after {
    content: ''; position: absolute; bottom: 0; left: 40px;
    width: 200px; height: 1px; background: var(--accent); opacity: 0.5;
  }
  .detail-grade { font-family: 'Orbitron', monospace; font-size: 0.7rem; letter-spacing: 3px; color: var(--accent); margin-bottom: 8px; }
  .detail-title { font-family: 'Orbitron', monospace; font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 900; color: var(--text-bright); letter-spacing: 2px; margin-bottom: 8px; }
  .detail-meta { display: flex; gap: 24px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: var(--text-dim); letter-spacing: 1px; flex-wrap: wrap; }

  /* AFFILIATE BANNER */
  .affiliate-banner {
    margin: 0 40px 24px;
    background: linear-gradient(135deg, rgba(255,153,0,0.06) 0%, rgba(255,102,0,0.04) 100%);
    border: 1px solid rgba(255,153,0,0.25);
    padding: 16px 20px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    clip-path: polygon(0 0, 98% 0, 100% 15%, 100% 100%, 2% 100%, 0 85%);
    flex-wrap: wrap;
  }
  .affiliate-left { display: flex; align-items: center; gap: 12px; }
  .affiliate-icon { font-size: 1.4rem; }
  .affiliate-title { font-family: 'Rajdhani', sans-serif; font-size: 0.95rem; font-weight: 700; color: #ff9900; letter-spacing: 1px; margin-bottom: 2px; }
  .affiliate-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: var(--text-dim); letter-spacing: 1px; }
  .btn-amazon {
    background: linear-gradient(135deg, #ff9900, #ff6600);
    border: none; color: #000;
    font-family: 'Orbitron', monospace; font-size: 0.65rem; font-weight: 700;
    padding: 9px 18px; cursor: pointer; letter-spacing: 2px;
    transition: all 0.2s; text-decoration: none; display: inline-block; white-space: nowrap;
    clip-path: polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%);
  }
  .btn-amazon:hover { box-shadow: var(--glow2); transform: translateY(-1px); opacity: 0.9; }
  .affiliate-disclaimer {
    width: 100%; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
    color: var(--text-dim); letter-spacing: 0.5px; opacity: 0.7;
    border-top: 1px solid rgba(255,153,0,0.12); padding-top: 10px; margin-top: 4px;
  }

  /* MANUAL LIST */
  .manual-list { padding: 0 40px 60px; }
  .manual-item {
    display: flex; align-items: center; justify-content: space-between;
    background: var(--panel); border: 1px solid var(--border);
    padding: 16px 20px; margin-bottom: 10px; transition: all 0.2s;
    position: relative; overflow: hidden;
  }
  .manual-item::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: var(--accent); opacity: 0; transition: opacity 0.2s;
  }
  .manual-item:hover { border-color: var(--border-bright); background: var(--bg3); }
  .manual-item:hover::before { opacity: 1; }
  .manual-item-left { display: flex; align-items: center; gap: 16px; }
  .manual-icon {
    width: 38px; height: 46px;
    background: rgba(0,170,255,0.06); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Share Tech Mono', monospace; font-size: 0.5rem;
    color: var(--accent); letter-spacing: 1px; flex-shrink: 0;
    clip-path: polygon(0 0, 80% 0, 100% 20%, 100% 100%, 0 100%);
  }
  .manual-name { font-family: 'Rajdhani', sans-serif; font-size: 1.05rem; font-weight: 600; color: var(--text-bright); margin-bottom: 2px; }
  .manual-meta { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: var(--text-dim); letter-spacing: 1px; display: flex; gap: 12px; }
  .manual-actions { display: flex; gap: 10px; flex-shrink: 0; }
  .btn {
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; padding: 7px 14px;
    cursor: pointer; letter-spacing: 1px; border: 1px solid; transition: all 0.2s;
    text-decoration: none; display: flex; align-items: center; gap: 5px; white-space: nowrap;
  }
  .btn-view { background: rgba(0,170,255,0.08); border-color: var(--accent); color: var(--accent); clip-path: polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%); }
  .btn-view:hover { background: rgba(0,170,255,0.2); box-shadow: var(--glow); }
  .btn-dl { background: rgba(255,102,0,0.08); border-color: var(--accent2); color: var(--accent2); clip-path: polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%); }
  .btn-dl:hover { background: rgba(255,102,0,0.2); box-shadow: var(--glow2); }

  /* PDF INLINE DROPDOWN */
  .manual-item { flex-direction: column; align-items: stretch; gap: 0; cursor: pointer; }
  .manual-item-row {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; gap: 16px;
  }
  .manual-item:hover { border-color: var(--border-bright); background: var(--bg3); }
  .manual-item:hover::before { opacity: 1; }
  .pdf-dropdown {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease;
    opacity: 0;
    width: 100%;
  }
  .pdf-dropdown.open {
    max-height: 1000px;
    opacity: 1;
  }
  .pdf-dropdown-inner {
    margin-top: 14px;
    border-top: 1px solid var(--border);
    padding-top: 14px;
  }
  .pdf-dropdown-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .pdf-dropdown-title {
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    color: var(--accent); letter-spacing: 2px;
  }
  .pdf-dropdown-close {
    background: none; border: 1px solid var(--border); color: var(--text-dim);
    width: 22px; height: 22px; cursor: pointer; font-size: 0.7rem;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    flex-shrink: 0;
  }
  .pdf-dropdown-close:hover { border-color: var(--red); color: var(--red); }
  .pdf-frame-wrap {
    background: var(--bg); border: 1px solid var(--border);
    height: 850px; width: 100%; display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .pdf-placeholder {
    text-align: center; font-family: 'Share Tech Mono', monospace;
    color: var(--text-dim); font-size: 0.75rem; letter-spacing: 1px; line-height: 2;
  }
  .pdf-placeholder .big { font-size: 2.5rem; margin-bottom: 12px; color: var(--accent); opacity: 0.3; }
  .btn-view.active { background: rgba(0,170,255,0.22); box-shadow: var(--glow); }

  /* MODAL OVERLAY (settings) */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    backdrop-filter: blur(4px);
  }
  .modal-close {
    background: none; border: 1px solid var(--border); color: var(--text-dim);
    width: 28px; height: 28px; cursor: pointer; font-size: 0.9rem;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .modal-close:hover { border-color: var(--red); color: var(--red); }

  /* SETTINGS MODAL */
  .settings-modal {
    background: var(--bg2); border: 1px solid var(--border-bright);
    width: 100%; max-width: 540px;
    box-shadow: 0 0 60px rgba(0,170,255,0.15);
    clip-path: polygon(0 0, 97% 0, 100% 3%, 100% 100%, 3% 100%, 0 97%);
  }
  .settings-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 24px; border-bottom: 1px solid var(--border);
  }
  .settings-title { font-family: 'Orbitron', monospace; font-size: 0.85rem; color: var(--text-bright); letter-spacing: 3px; }
  .settings-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
  .settings-section { border: 1px solid var(--border); background: var(--panel); padding: 20px; }
  .settings-section-label {
    font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: var(--text-dim);
    letter-spacing: 3px; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .settings-section-label::after { content:''; flex:1; height:1px; background:var(--border); }
  .donate-block { text-align: center; }
  .donate-title { font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 700; color: var(--green); letter-spacing: 2px; margin-bottom: 6px; }
  .donate-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: var(--text-dim); letter-spacing: 1px; margin-bottom: 16px; line-height: 1.8; }
  .btn-donate {
    background: rgba(0,255,136,0.08); border: 1px solid var(--green);
    color: var(--green); font-family: 'Orbitron', monospace; font-size: 0.7rem; font-weight: 700;
    padding: 11px 24px; cursor: pointer; letter-spacing: 2px; transition: all 0.2s;
    text-decoration: none; display: inline-block;
    clip-path: polygon(0 0, 92% 0, 100% 25%, 100% 100%, 8% 100%, 0 75%);
  }
  .btn-donate:hover { background: rgba(0,255,136,0.18); box-shadow: var(--glow-green); }
  .settings-info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid rgba(26,47,80,0.5);
  }
  .settings-info-row:last-child { border-bottom: none; }
  .settings-info-key { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: var(--text-dim); letter-spacing: 1px; }
  .settings-info-val { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: var(--accent); letter-spacing: 1px; }
  .clickable-val { cursor: pointer; text-decoration: underline; }
  .clickable-val:hover { opacity: 0.7; }

  /* DISCLAIMER PAGE */
  .page { padding: 0 40px 60px; }
  .page-hero {
    padding: 60px 40px 40px; text-align: center; position: relative; overflow: hidden;
  }
  .page-hero::before {
    content: ''; position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(255,204,0,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .page-tag {
    font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: var(--gold);
    letter-spacing: 4px; margin-bottom: 12px;
    display: flex; align-items: center; justify-content: center; gap: 12px;
  }
  .page-tag::before, .page-tag::after { content:''; height:1px; width:40px; background:var(--gold); opacity:0.5; }
  .page-title { font-family: 'Orbitron', monospace; font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 900; color: var(--text-bright); letter-spacing: 3px; margin-bottom: 8px; }
  .page-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: var(--text-dim); letter-spacing: 2px; }

  .disclaimer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 32px; }
  .disclaimer-card {
    background: var(--panel); border: 1px solid var(--border); padding: 24px;
    position: relative; overflow: hidden;
    clip-path: polygon(0 0, 96% 0, 100% 4%, 100% 100%, 4% 100%, 0 96%);
  }
  .disclaimer-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--dc, var(--gold)); }
  .disclaimer-card-icon { font-size: 1.8rem; margin-bottom: 12px; }
  .disclaimer-card-title { font-family: 'Orbitron', monospace; font-size: 0.8rem; font-weight: 700; color: var(--dc, var(--gold)); letter-spacing: 2px; margin-bottom: 10px; }
  .disclaimer-card-text { font-family: 'Rajdhani', sans-serif; font-size: 0.95rem; color: var(--text); line-height: 1.7; }

  .disclaimer-block {
    background: var(--panel); border: 1px solid var(--border); padding: 28px;
    margin-bottom: 20px;
    clip-path: polygon(0 0, 99.5% 0, 100% 1.5%, 100% 100%, 0.5% 100%, 0 98.5%);
  }
  .disclaimer-block-title {
    font-family: 'Orbitron', monospace; font-size: 0.75rem; font-weight: 700;
    color: var(--gold); letter-spacing: 3px; margin-bottom: 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .disclaimer-block-title::after { content:''; flex:1; height:1px; background:rgba(255,204,0,0.2); }
  .disclaimer-block p { font-family: 'Rajdhani', sans-serif; font-size: 1rem; color: var(--text); line-height: 1.8; margin-bottom: 12px; }
  .disclaimer-block p:last-child { margin-bottom: 0; }
  .hl { color: var(--text-bright); font-weight: 600; }
  .hl-gold { color: var(--gold); font-weight: 600; }
  .hl-blue { color: var(--accent); font-weight: 600; }

  .bandai-badge {
    max-width: 520px; margin: 0 auto 32px;
    background: linear-gradient(135deg, rgba(255,204,0,0.06), rgba(255,102,0,0.04));
    border: 1px solid rgba(255,204,0,0.3); padding: 20px 28px; text-align: center;
    clip-path: polygon(0 0, 97% 0, 100% 10%, 100% 100%, 3% 100%, 0 90%);
  }
  .bandai-name { font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 900; color: var(--gold); letter-spacing: 4px; margin-bottom: 4px; }
  .bandai-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: var(--text-dim); letter-spacing: 2px; }

  /* KIT IMAGE */
  .kit-image-section {
    margin: 0 40px 32px;
    display: flex; justify-content: center;
  }
  .kit-image-wrap {
    position: relative;
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 24px;
    max-width: 420px; width: 100%;
    clip-path: polygon(0 0, 96% 0, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0 96%, 0 4%);
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .kit-image-wrap::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--ki-accent, var(--accent)), transparent);
  }
  .kit-image {
    width: 100%; max-width: 340px; height: 300px;
    object-fit: contain;
    filter: drop-shadow(0 4px 24px rgba(0,170,255,0.18));
    transition: transform 0.3s;
  }
  .kit-image:hover { transform: scale(1.03); }
  .kit-image-label {
    font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
    color: var(--text-dim); letter-spacing: 2px; text-align: center;
  }
  .kit-image-placeholder {
    width: 100%; max-width: 340px; height: 280px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 12px; opacity: 0.25;
  }
  .kit-image-placeholder-icon { font-size: 4rem; }
  .kit-image-placeholder-text {
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    color: var(--text-dim); letter-spacing: 2px; text-align: center;
  }

  /* AUTH BUTTONS */
  .auth-btn {
    background: rgba(0,170,255,0.08); border: 1px solid var(--border-bright);
    color: var(--accent); font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; padding: 8px 14px; cursor: pointer; letter-spacing: 1px;
    transition: all 0.2s; white-space: nowrap;
    clip-path: polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%);
  }
  .auth-btn:hover { background: rgba(0,170,255,0.2); box-shadow: var(--glow); }

  /* FAVOURITE BUTTON */
  .fav-btn {
    background: none; border: none; cursor: pointer;
    font-size: 1.1rem; transition: transform 0.2s;
    line-height: 1; padding: 2px; flex-shrink: 0;
  }
  .fav-btn:hover { transform: scale(1.3); }

  /* BUILD STATUS */
  .build-status-wrap {
    margin: 0 40px 24px;
    background: var(--panel); border: 1px solid var(--border);
    padding: 16px 20px;
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    clip-path: polygon(0 0, 98% 0, 100% 15%, 100% 100%, 2% 100%, 0 85%);
  }
  .build-status-label {
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    color: var(--text-dim); letter-spacing: 2px; white-space: nowrap;
  }
  .build-status-options { display: flex; gap: 8px; flex-wrap: wrap; }
  .build-status-btn {
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    padding: 6px 14px; cursor: pointer; letter-spacing: 1px;
    border: 1px solid var(--border); background: none; color: var(--text-dim);
    transition: all 0.2s;
    clip-path: polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%);
  }
  .build-status-btn.active-notstarted { border-color: var(--text-dim); color: var(--text-dim); background: rgba(255,255,255,0.05); }
  .build-status-btn.active-inprogress { border-color: var(--gold); color: var(--gold); background: rgba(255,204,0,0.08); box-shadow: 0 0 10px rgba(255,204,0,0.2); }
  .build-status-btn.active-complete { border-color: var(--green); color: var(--green); background: rgba(0,255,136,0.08); box-shadow: 0 0 10px rgba(0,255,136,0.2); }

  /* MY VAULT PAGE */
  .vault-grid { padding: 0 40px 60px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
  .vault-empty {
    padding: 80px 40px; text-align: center;
    font-family: 'Share Tech Mono', monospace; color: var(--text-dim);
    font-size: 0.8rem; letter-spacing: 2px; line-height: 3;
  }
  .vault-empty-icon { font-size: 3rem; opacity: 0.3; display: block; margin-bottom: 16px; }
  .kit-card .build-badge {
    font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
    padding: 3px 8px; letter-spacing: 1px; border-radius: 0;
    border: 1px solid; margin-left: 6px;
  }
  .build-badge.inprogress { border-color: var(--gold); color: var(--gold); }
  .build-badge.complete { border-color: var(--green); color: var(--green); }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border); padding: 24px 40px;
    display: flex; align-items: center; justify-content: space-between;
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    color: var(--text-dim); letter-spacing: 1px; flex-wrap: wrap; gap: 12px;
  }
  .footer-logo { font-family: 'Orbitron', monospace; color: var(--accent); font-weight: 700; font-size: 0.8rem; }
  .footer-links { display: flex; gap: 16px; }
  .footer-link { color: var(--text-dim); text-decoration: none; transition: color 0.2s; cursor: pointer; }
  .footer-link:hover { color: var(--accent); }

  /* ── RESPONSIVE: TABLET (≤768px) ── */
  @media (max-width: 768px) {
    .kit-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
    .hero-stats { gap: 16px; }
    .hero h1 { font-size: clamp(2rem, 10vw, 3.5rem); letter-spacing: 2px; }
    .settings-modal { max-width: 100%; margin: 0 12px; }
    .modal { height: 85vh; }
    .detail-title { font-size: clamp(1.3rem, 5vw, 2rem); }
    .disclaimer-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
  }

  /* ── RESPONSIVE: MOBILE (≤640px) ── */
  @media (max-width: 640px) {
    /* Global */
    * { -webkit-tap-highlight-color: transparent; }

    /* Header */
    .header { padding: 0 16px; height: 60px; }
    .logo { font-size: 1.2rem; gap: 8px; }
    .logo-icon { width: 30px; height: 30px; font-size: 0.85rem; }
    .logo-sub { font-size: 0.42rem; letter-spacing: 2px; }
    .header-right { gap: 8px; }
    .cog-btn { width: 40px; height: 40px; font-size: 1.2rem; } /* larger touch target */
    .status-dot { display: none; } /* hide on mobile to save space */

    /* Hero */
    .hero { padding: 36px 16px 28px; }
    .hero-tag { font-size: 0.6rem; letter-spacing: 2px; }
    .hero h1 { font-size: clamp(2.2rem, 12vw, 3rem); letter-spacing: 1px; margin-bottom: 6px; }
    .hero-sub { font-size: 0.7rem; letter-spacing: 1px; margin-bottom: 20px; }
    .hero-stats { gap: 10px; margin-bottom: 0; }
    .stat { padding: 10px 16px; }
    .stat-num { font-size: 1.3rem; }
    .stat-label { font-size: 0.55rem; letter-spacing: 1px; }

    /* Controls */
    .controls { padding: 16px 16px 20px; gap: 10px; }
    .controls-row { gap: 8px; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .controls-row::-webkit-scrollbar { display: none; }
    .controls-row:first-child { flex-wrap: wrap; overflow-x: visible; }
    .search-input { font-size: 0.9rem; padding: 12px 16px 12px 40px; }
    .filter-btn { padding: 10px 14px; font-size: 0.65rem; flex-shrink: 0; clip-path: none; }
    .sort-btn { padding: 10px 14px; font-size: 0.65rem; flex-shrink: 0; clip-path: none; }
    .pdf-toggle { clip-path: none; flex-shrink: 0; }

    /* Section header */
    .section-header { padding: 0 16px 14px; }
    .section-title { font-size: 0.75rem; letter-spacing: 2px; }

    /* Kit grid — single column on mobile */
    .kit-grid {
      padding: 0 16px 40px;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .kit-card { clip-path: none; border-radius: 2px; } /* simpler shape on mobile */
    .card-body { padding: 16px; }
    .card-title { font-size: 1.15rem; }
    .card-arrow { font-size: 1.2rem; }

    /* Back button */
    .back-btn {
      margin: 16px 16px 12px;
      padding: 10px 16px;
      clip-path: none;
      font-size: 0.7rem;
      min-height: 44px; /* iOS touch target minimum */
    }

    /* Kit detail header */
    .kit-detail-header { padding: 0 16px 20px; margin-bottom: 16px; }
    .kit-detail-header::after { left: 16px; width: 120px; }
    .detail-grade { font-size: 0.6rem; letter-spacing: 2px; }
    .detail-title { font-size: clamp(1.2rem, 6vw, 1.8rem); letter-spacing: 1px; }
    .detail-meta { gap: 12px; font-size: 0.6rem; flex-direction: column; gap: 4px; }

    /* Affiliate banner */
    .affiliate-banner {
      margin: 0 16px 16px;
      padding: 14px 16px;
      clip-path: none;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .btn-amazon {
      width: 100%; text-align: center; justify-content: center;
      clip-path: none; padding: 12px 18px;
      display: flex; align-items: center;
    }

    /* Manual list */
    .manual-list { padding: 0 16px 40px; }
    .manual-item-row {
      flex-direction: column; align-items: flex-start; gap: 14px;
    }
    .manual-item-left { width: 100%; }
    .manual-name { font-size: 1rem; }
    .manual-meta { font-size: 0.6rem; flex-wrap: wrap; gap: 8px; }
    .manual-actions {
      width: 100%; display: flex; gap: 10px;
    }
    .btn {
      flex: 1; justify-content: center; text-align: center;
      padding: 11px 10px; font-size: 0.65rem;
      clip-path: none; min-height: 44px;
    }

    /* PDF dropdown */
    .pdf-frame-wrap { height: 500px; }
    .pdf-dropdown.open { max-height: 600px; }

    /* Settings modal */
    .modal-overlay { padding: 0; align-items: flex-end; }
    .settings-modal {
      max-width: 100%; width: 100%;
      clip-path: none;
      border-bottom: none; border-left: none; border-right: none;
      border-top: 2px solid var(--accent);
      border-radius: 0;
      max-height: 88dvh;
      overflow-y: auto;
    }
    .settings-header { padding: 16px 20px; }
    .settings-body { padding: 16px; gap: 14px; }
    .settings-section { padding: 16px; }
    .btn-donate { width: 100%; text-align: center; clip-path: none; padding: 13px; min-height: 44px; }

    /* Disclaimer page */
    .page-hero { padding: 36px 16px 28px; }
    .page-title { font-size: clamp(1.6rem, 8vw, 2.2rem); letter-spacing: 1px; }
    .page { padding: 0 16px 40px; }
    .disclaimer-grid { grid-template-columns: 1fr; gap: 12px; margin-bottom: 20px; }
    .disclaimer-card { padding: 18px; clip-path: none; }
    .disclaimer-block { padding: 18px; clip-path: none; }
    .disclaimer-block p { font-size: 0.95rem; }
    .bandai-badge { padding: 16px 20px; clip-path: none; margin-bottom: 20px; }
    .bandai-name { font-size: 0.9rem; letter-spacing: 2px; }

    /* Kit image */
    .kit-image-section { margin: 0 16px 20px; }
    .kit-image-wrap { padding: 16px; clip-path: none; }
    .kit-image { height: 220px; }

    /* Footer */
    .footer {
      flex-direction: column; text-align: center; padding: 20px 16px;
      gap: 8px;
    }
  }

  /* ── VERY SMALL PHONES (≤380px) ── */
  @media (max-width: 380px) {
    .hero h1 { font-size: 2rem; }
    .logo { font-size: 1rem; }
    .filter-btn { padding: 9px 8px; font-size: 0.6rem; }
    .stat { padding: 8px 12px; }
    .stat-num { font-size: 1.1rem; }
  }
`;

// ─────────────────────────────────────────────────────────────
// AMAZON AFFILIATE URLS
// Paste your URLs here as "kitId": "url" pairs.
// The site will automatically show the Buy on Amazon banner
// for any kit that has a real URL here.
// Kits with no entry (or left as "") will simply show no banner.
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// CLOUDFLARE R2 — PDF STORAGE BASE URL
// All manual PDFs are served from this bucket.
// To update storage, change this one line only.
// ─────────────────────────────────────────────────────────────
const R2 = "https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev";

const AMAZON_URLS = {
  // PASTE YOUR JSON HERE — example format:
  // "1": "https://www.amazon.com/dp/XXXXXXX?tag=yourtag-20",
  // "2": "https://www.amazon.com/dp/XXXXXXX?tag=yourtag-20",
};

const GRADE_COLORS = {
  "HG": { accent: "#00aaff", bg: "rgba(0,170,255,0.1)" },
  "MG": { accent: "#ff6600", bg: "rgba(255,102,0,0.1)" },
  "RG": { accent: "#ff2244", bg: "rgba(255,34,68,0.1)" },
  "PG": { accent: "#ffcc00", bg: "rgba(255,204,0,0.1)" },
  "SD": { accent: "#00ffcc", bg: "rgba(0,255,204,0.1)" },
  "EG": { accent: "#aa88ff", bg: "rgba(170,136,255,0.1)" },
};

// Kit data — set imageUrl per kit when you have photos ready
const KITS = [
  // ── ENTRY GRADE ──────────────────────────────────────────────
  { id:1, grade:"EG", scale:"1/144", name:"RX-78-2 Gundam", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:1,name:"Quick Assembly Guide",lang:"EN/JP",pages:12,size:"2.4 MB",url:"eg-144-rx78-2-assembly.pdf"}] },
  { id:2, grade:"EG", scale:"1/144", name:"Strike Gundam", series:"Mobile Suit Gundam SEED", imageUrl:null,
    manuals:[{id:2,name:"Quick Assembly Guide",lang:"EN/JP",pages:10,size:"2.1 MB",url:"eg-144-strike-assembly.pdf"}] },

  // ── HIGH GRADE (HG) ───────────────────────────────────────────
  { id:3, grade:"HG", scale:"1/144", name:"RX-78-2 Gundam (Revive)", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:3,name:"Assembly Manual",lang:"EN/JP",pages:24,size:"4.2 MB"},{id:4,name:"Decal Guide",lang:"EN/JP",pages:6,size:"1.1 MB"}] },
  { id:4, grade:"HG", scale:"1/144", name:"Zaku II (MS-06F)", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:5,name:"Assembly Manual",lang:"EN/JP",pages:20,size:"3.8 MB",url:"hg-144-zakuii-assembly.pdf"}] },
  { id:5, grade:"HG", scale:"1/144", name:"Dom", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:6,name:"Assembly Manual",lang:"EN/JP",pages:18,size:"3.4 MB"}] },
  { id:6, grade:"HG", scale:"1/144", name:"Gouf", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:7,name:"Assembly Manual",lang:"EN/JP",pages:18,size:"3.2 MB"}] },
  { id:7, grade:"HG", scale:"1/144", name:"Wing Gundam", series:"Mobile Suit Gundam Wing", imageUrl:null,
    manuals:[{id:8,name:"Assembly Manual",lang:"EN/JP",pages:22,size:"4.0 MB"}] },
  { id:8, grade:"HG", scale:"1/144", name:"Deathscythe Hell", series:"Mobile Suit Gundam Wing", imageUrl:null,
    manuals:[{id:9,name:"Assembly Manual",lang:"EN/JP",pages:22,size:"4.1 MB"}] },
  { id:9, grade:"HG", scale:"1/144", name:"Heavyarms Kai", series:"Mobile Suit Gundam Wing", imageUrl:null,
    manuals:[{id:10,name:"Assembly Manual",lang:"EN/JP",pages:20,size:"3.9 MB"}] },
  { id:10, grade:"HG", scale:"1/144", name:"Strike Freedom Gundam", series:"Mobile Suit Gundam SEED Destiny", imageUrl:null,
    manuals:[{id:11,name:"Assembly Manual",lang:"EN/JP",pages:28,size:"5.4 MB"},{id:12,name:"Wing Binder Guide",lang:"EN/JP",pages:8,size:"1.6 MB"}] },
  { id:11, grade:"HG", scale:"1/144", name:"Freedom Gundam (Revive)", series:"Mobile Suit Gundam SEED", imageUrl:null,
    manuals:[{id:13,name:"Assembly Manual",lang:"EN/JP",pages:26,size:"5.0 MB"}] },
  { id:12, grade:"HG", scale:"1/144", name:"Justice Gundam", series:"Mobile Suit Gundam SEED", imageUrl:null,
    manuals:[{id:14,name:"Assembly Manual",lang:"EN/JP",pages:24,size:"4.6 MB"}] },
  { id:13, grade:"HG", scale:"1/144", name:"Unicorn Gundam", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:15,name:"Assembly Manual",lang:"EN/JP",pages:32,size:"6.2 MB"},{id:16,name:"Transformation Guide",lang:"EN/JP",pages:8,size:"1.5 MB"}] },
  { id:14, grade:"HG", scale:"1/144", name:"Banshee Norn", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:17,name:"Assembly Manual",lang:"EN/JP",pages:32,size:"6.4 MB"}] },
  { id:15, grade:"HG", scale:"1/144", name:"Sinanju", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:18,name:"Assembly Manual",lang:"EN/JP",pages:30,size:"5.8 MB"}] },
  { id:16, grade:"HG", scale:"1/144", name:"00 Gundam", series:"Mobile Suit Gundam 00", imageUrl:null,
    manuals:[{id:19,name:"Assembly Manual",lang:"EN/JP",pages:26,size:"5.1 MB"}] },
  { id:17, grade:"HG", scale:"1/144", name:"00 Raiser", series:"Mobile Suit Gundam 00", imageUrl:null,
    manuals:[{id:20,name:"Assembly Manual",lang:"EN/JP",pages:30,size:"5.9 MB"},{id:21,name:"0 Raiser Docking Guide",lang:"EN/JP",pages:8,size:"1.4 MB"}] },
  { id:18, grade:"HG", scale:"1/144", name:"Exia", series:"Mobile Suit Gundam 00", imageUrl:null,
    manuals:[{id:22,name:"Assembly Manual",lang:"EN/JP",pages:24,size:"4.7 MB"}] },
  { id:19, grade:"HG", scale:"1/144", name:"Barbatos", series:"Iron-Blooded Orphans", imageUrl:null,
    manuals:[{id:23,name:"Assembly Manual",lang:"EN/JP",pages:28,size:"5.3 MB"}] },
  { id:20, grade:"HG", scale:"1/144", name:"Barbatos Lupus", series:"Iron-Blooded Orphans", imageUrl:null,
    manuals:[{id:24,name:"Assembly Manual",lang:"EN/JP",pages:30,size:"5.7 MB"}] },
  { id:21, grade:"HG", scale:"1/144", name:"Barbatos Lupus Rex", series:"Iron-Blooded Orphans", imageUrl:null,
    manuals:[{id:25,name:"Assembly Manual",lang:"EN/JP",pages:32,size:"6.8 MB"},{id:26,name:"Weapon Configuration Guide",lang:"EN",pages:10,size:"2.1 MB"}] },
  { id:22, grade:"HG", scale:"1/144", name:"Gusion Rebake Full City", series:"Iron-Blooded Orphans", imageUrl:null,
    manuals:[{id:27,name:"Assembly Manual",lang:"EN/JP",pages:28,size:"5.4 MB"}] },
  { id:23, grade:"HG", scale:"1/144", name:"Kimaris Vidar", series:"Iron-Blooded Orphans", imageUrl:null,
    manuals:[{id:28,name:"Assembly Manual",lang:"EN/JP",pages:28,size:"5.5 MB"}] },
  { id:24, grade:"HG", scale:"1/144", name:"Aerial", series:"The Witch from Mercury", imageUrl:null,
    manuals:[{id:29,name:"Assembly Manual",lang:"EN/JP",pages:28,size:"5.9 MB"},{id:30,name:"GUND-BIT Effect Guide",lang:"EN/JP",pages:8,size:"1.7 MB"}] },
  { id:25, grade:"HG", scale:"1/144", name:"Aerial Rebuild", series:"The Witch from Mercury", imageUrl:null,
    manuals:[{id:31,name:"Assembly Manual",lang:"EN/JP",pages:30,size:"6.1 MB"}] },
  { id:26, grade:"HG", scale:"1/144", name:"Lfrith", series:"The Witch from Mercury", imageUrl:null,
    manuals:[{id:32,name:"Assembly Manual",lang:"EN/JP",pages:26,size:"5.2 MB"}] },
  { id:27, grade:"HG", scale:"1/144", name:"Zeta Gundam", series:"Mobile Suit Zeta Gundam", imageUrl:null,
    manuals:[{id:33,name:"Assembly Manual",lang:"EN/JP",pages:26,size:"5.0 MB"}] },
  { id:28, grade:"HG", scale:"1/144", name:"Nu Gundam", series:"Char's Counterattack", imageUrl:null,
    manuals:[{id:34,name:"Assembly Manual",lang:"EN/JP",pages:28,size:"5.4 MB"}] },
  { id:29, grade:"HG", scale:"1/144", name:"Sazabi", series:"Char's Counterattack", imageUrl:null,
    manuals:[{id:35,name:"Assembly Manual",lang:"EN/JP",pages:26,size:"5.1 MB"}] },
  { id:30, grade:"HG", scale:"1/144", name:"Gundam Mk-II (AEUG)", series:"Mobile Suit Zeta Gundam", imageUrl:null,
    manuals:[{id:36,name:"Assembly Manual",lang:"EN/JP",pages:22,size:"4.3 MB"}] },
  { id:31, grade:"HG", scale:"1/144", name:"ReZEL", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:37,name:"Assembly Manual",lang:"EN/JP",pages:24,size:"4.8 MB"}] },
  { id:32, grade:"HG", scale:"1/144", name:"Byarlant Custom", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:38,name:"Assembly Manual",lang:"EN/JP",pages:22,size:"4.4 MB"}] },
  { id:33, grade:"HG", scale:"1/144", name:"Dilanza (Standard)", series:"The Witch from Mercury", imageUrl:null,
    manuals:[{id:39,name:"Assembly Manual",lang:"EN/JP",pages:24,size:"4.7 MB"}] },

  // ── REAL GRADE (RG) ───────────────────────────────────────────
  { id:34, grade:"RG", scale:"1/144", name:"RX-78-2 Gundam", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:40,name:"Assembly Manual",lang:"EN/JP",pages:36,size:"7.2 MB"},{id:41,name:"Marking Guide",lang:"EN/JP",pages:8,size:"1.6 MB"}] },
  { id:35, grade:"RG", scale:"1/144", name:"Zaku II", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:42,name:"Assembly Manual",lang:"EN/JP",pages:34,size:"6.9 MB"}] },
  { id:36, grade:"RG", scale:"1/144", name:"Wing Gundam Zero EW", series:"Endless Waltz", imageUrl:null,
    manuals:[{id:43,name:"Assembly Manual",lang:"EN/JP",pages:44,size:"9.2 MB"},{id:44,name:"Wing Detail Guide",lang:"EN/JP",pages:10,size:"2.0 MB"}] },
  { id:37, grade:"RG", scale:"1/144", name:"Strike Gundam", series:"Mobile Suit Gundam SEED", imageUrl:null,
    manuals:[{id:45,name:"Assembly Manual",lang:"EN/JP",pages:38,size:"7.8 MB"}] },
  { id:38, grade:"RG", scale:"1/144", name:"Freedom Gundam", series:"Mobile Suit Gundam SEED", imageUrl:null,
    manuals:[{id:46,name:"Assembly Manual",lang:"EN/JP",pages:40,size:"8.3 MB"}] },
  { id:39, grade:"RG", scale:"1/144", name:"Destiny Gundam", series:"Mobile Suit Gundam SEED Destiny", imageUrl:null,
    manuals:[{id:47,name:"Assembly Manual",lang:"EN/JP",pages:40,size:"8.5 MB"}] },
  { id:40, grade:"RG", scale:"1/144", name:"Strike Freedom Gundam", series:"Mobile Suit Gundam SEED Destiny", imageUrl:null,
    manuals:[{id:48,name:"Assembly Manual",lang:"EN/JP",pages:44,size:"9.4 MB"},{id:49,name:"DRAGOON System Guide",lang:"EN/JP",pages:8,size:"1.8 MB"}] },
  { id:41, grade:"RG", scale:"1/144", name:"Unicorn Gundam", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:50,name:"Assembly Manual",lang:"EN/JP",pages:44,size:"9.1 MB"},{id:51,name:"LED Unit Installation Guide",lang:"EN/JP",pages:12,size:"2.3 MB"},{id:52,name:"Transformation Guide",lang:"EN",pages:6,size:"1.2 MB"}] },
  { id:42, grade:"RG", scale:"1/144", name:"Sinanju", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:53,name:"Assembly Manual",lang:"EN/JP",pages:46,size:"9.8 MB"},{id:54,name:"Marking Decal Guide",lang:"EN/JP",pages:10,size:"2.0 MB"}] },
  { id:43, grade:"RG", scale:"1/144", name:"Zeta Gundam", series:"Mobile Suit Zeta Gundam", imageUrl:null,
    manuals:[{id:55,name:"Assembly Manual",lang:"EN/JP",pages:40,size:"8.7 MB"},{id:56,name:"Wave Rider Transformation Guide",lang:"EN",pages:8,size:"1.9 MB"}] },
  { id:44, grade:"RG", scale:"1/144", name:"Nu Gundam", series:"Char's Counterattack", imageUrl:null,
    manuals:[{id:57,name:"Assembly Manual",lang:"EN/JP",pages:44,size:"9.3 MB"},{id:58,name:"Fin Funnel Effect Guide",lang:"EN/JP",pages:10,size:"2.1 MB"}] },
  { id:45, grade:"RG", scale:"1/144", name:"00 Gundam Seven Sword/G", series:"Mobile Suit Gundam 00", imageUrl:null,
    manuals:[{id:59,name:"Assembly Manual",lang:"EN/JP",pages:42,size:"8.9 MB"}] },
  { id:46, grade:"RG", scale:"1/144", name:"Evangelion Unit-01", series:"Rebuild of Evangelion", imageUrl:null,
    manuals:[{id:60,name:"Assembly Manual",lang:"EN/JP",pages:38,size:"7.9 MB"}] },
  { id:47, grade:"RG", scale:"1/144", name:"Sazabi", series:"Char's Counterattack", imageUrl:null,
    manuals:[{id:61,name:"Assembly Manual",lang:"EN/JP",pages:46,size:"10.1 MB"}] },
  { id:48, grade:"RG", scale:"1/144", name:"Crossbone Gundam X1", series:"Mobile Suit Crossbone Gundam", imageUrl:null,
    manuals:[{id:62,name:"Assembly Manual",lang:"EN/JP",pages:40,size:"8.6 MB"}] },

  // ── MASTER GRADE (MG) ─────────────────────────────────────────
  { id:49, grade:"MG", scale:"1/100", name:"RX-78-2 Gundam Ver. 3.0", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:63,name:"Full Assembly Manual",lang:"EN/JP",pages:60,size:"13.2 MB"},{id:64,name:"Marking Guide",lang:"EN/JP",pages:12,size:"2.5 MB"}] },
  { id:50, grade:"MG", scale:"1/100", name:"Zaku II Ver. 2.0", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:65,name:"Full Assembly Manual",lang:"EN/JP",pages:52,size:"11.6 MB"}] },
  { id:51, grade:"MG", scale:"1/100", name:"Char's Zaku II Ver. 2.0", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:66,name:"Full Assembly Manual",lang:"EN/JP",pages:52,size:"11.6 MB"}] },
  { id:52, grade:"MG", scale:"1/100", name:"Gouf Ver. 2.0", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:67,name:"Full Assembly Manual",lang:"EN/JP",pages:48,size:"10.8 MB"}] },
  { id:53, grade:"MG", scale:"1/100", name:"Wing Gundam Zero EW", series:"Endless Waltz", imageUrl:null,
    manuals:[{id:68,name:"Full Assembly Manual",lang:"EN/JP",pages:52,size:"11.4 MB"},{id:69,name:"Inner Frame Guide",lang:"JP",pages:18,size:"3.6 MB"}] },
  { id:101, grade:"MG", scale:"1/100", name:"Wing Gundam Zero EW Ver.Ka", series:"Endless Waltz", imageUrl:null,
    manuals:[{id:145,name:"Full Assembly Manual",lang:"EN/JP",pages:56,size:"12.2 MB",url:"mg-100-wingzero-vka-assembly.pdf"}] },
  { id:54, grade:"MG", scale:"1/100", name:"Deathscythe Hell EW", series:"Endless Waltz", imageUrl:null,
    manuals:[{id:70,name:"Full Assembly Manual",lang:"EN/JP",pages:50,size:"11.0 MB"}] },
  { id:55, grade:"MG", scale:"1/100", name:"Heavyarms EW", series:"Endless Waltz", imageUrl:null,
    manuals:[{id:71,name:"Full Assembly Manual",lang:"EN/JP",pages:50,size:"10.9 MB"}] },
  { id:56, grade:"MG", scale:"1/100", name:"Sandrock EW", series:"Endless Waltz", imageUrl:null,
    manuals:[{id:72,name:"Full Assembly Manual",lang:"EN/JP",pages:48,size:"10.5 MB"}] },
  { id:57, grade:"MG", scale:"1/100", name:"Strike Gundam", series:"Mobile Suit Gundam SEED", imageUrl:null,
    manuals:[{id:73,name:"Full Assembly Manual",lang:"EN/JP",pages:54,size:"12.0 MB"}] },
  { id:58, grade:"MG", scale:"1/100", name:"Freedom Gundam Ver. 2.0", series:"Mobile Suit Gundam SEED", imageUrl:null,
    manuals:[{id:74,name:"Full Assembly Manual",lang:"EN/JP",pages:58,size:"12.8 MB"},{id:75,name:"Wing Binder Guide",lang:"EN/JP",pages:10,size:"2.0 MB"}] },
  { id:59, grade:"MG", scale:"1/100", name:"Destiny Gundam", series:"Mobile Suit Gundam SEED Destiny", imageUrl:null,
    manuals:[{id:76,name:"Full Assembly Manual",lang:"EN/JP",pages:56,size:"12.8 MB"},{id:77,name:"Wing Effect Parts Guide",lang:"EN",pages:10,size:"2.6 MB"}] },
  { id:60, grade:"MG", scale:"1/100", name:"Strike Freedom Gundam", series:"Mobile Suit Gundam SEED Destiny", imageUrl:null,
    manuals:[{id:78,name:"Full Assembly Manual",lang:"EN/JP",pages:60,size:"13.4 MB"},{id:79,name:"DRAGOON System Guide",lang:"EN/JP",pages:12,size:"2.4 MB"}] },
  { id:61, grade:"MG", scale:"1/100", name:"Infinite Justice Gundam", series:"Mobile Suit Gundam SEED Destiny", imageUrl:null,
    manuals:[{id:80,name:"Full Assembly Manual",lang:"EN/JP",pages:56,size:"12.3 MB"}] },
  { id:62, grade:"MG", scale:"1/100", name:"Unicorn Gundam Ver. Ka", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:81,name:"Full Assembly Manual",lang:"EN/JP",pages:64,size:"14.6 MB"},{id:82,name:"Transformation Guide",lang:"EN/JP",pages:14,size:"2.8 MB"},{id:83,name:"Waterslide Decal Guide",lang:"EN/JP",pages:8,size:"1.6 MB"}] },
  { id:63, grade:"MG", scale:"1/100", name:"Banshee Ver. Ka", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:84,name:"Full Assembly Manual",lang:"EN/JP",pages:64,size:"14.5 MB"}] },
  { id:64, grade:"MG", scale:"1/100", name:"Sinanju", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:85,name:"Full Assembly Manual",lang:"EN/JP",pages:68,size:"15.4 MB"},{id:86,name:"Decal Sheet Guide",lang:"EN/JP",pages:10,size:"2.1 MB"}] },
  { id:65, grade:"MG", scale:"1/100", name:"Sinanju Stein Ver. Ka", series:"Mobile Suit Gundam NT", imageUrl:null,
    manuals:[{id:87,name:"Full Assembly Manual",lang:"EN/JP",pages:66,size:"15.0 MB"}] },
  { id:66, grade:"MG", scale:"1/100", name:"Nu Gundam Ver. Ka", series:"Char's Counterattack", imageUrl:null,
    manuals:[{id:88,name:"Full Assembly Manual",lang:"EN/JP",pages:68,size:"15.2 MB"},{id:89,name:"Fin Funnel Guide",lang:"EN/JP",pages:12,size:"2.4 MB"}] },
  { id:67, grade:"MG", scale:"1/100", name:"Sazabi Ver. Ka", series:"Char's Counterattack", imageUrl:null,
    manuals:[{id:90,name:"Full Assembly Manual",lang:"EN/JP",pages:72,size:"16.3 MB"},{id:91,name:"Funnel Effect Parts Guide",lang:"EN/JP",pages:14,size:"3.1 MB"},{id:92,name:"Waterslide Decal Sheet",lang:"EN/JP",pages:6,size:"1.5 MB"}] },
  { id:68, grade:"MG", scale:"1/100", name:"Zeta Gundam Ver. Ka", series:"Mobile Suit Zeta Gundam", imageUrl:null,
    manuals:[{id:93,name:"Full Assembly Manual",lang:"EN/JP",pages:60,size:"13.5 MB"},{id:94,name:"Wave Rider Guide",lang:"EN/JP",pages:12,size:"2.3 MB"}] },
  { id:69, grade:"MG", scale:"1/100", name:"Gundam Mk-II Ver. 2.0 (AEUG)", series:"Mobile Suit Zeta Gundam", imageUrl:null,
    manuals:[{id:95,name:"Full Assembly Manual",lang:"EN/JP",pages:52,size:"11.7 MB"}] },
  { id:70, grade:"MG", scale:"1/100", name:"Barbatos", series:"Iron-Blooded Orphans", imageUrl:null,
    manuals:[{id:96,name:"Full Assembly Manual",lang:"EN/JP",pages:54,size:"12.1 MB",url:"mg-100-barbatos-assembly.pdf"}] },
  { id:71, grade:"MG", scale:"1/100", name:"Exia", series:"Mobile Suit Gundam 00", imageUrl:null,
    manuals:[{id:97,name:"Full Assembly Manual",lang:"EN/JP",pages:52,size:"11.8 MB",url:"mg-100-exia-assembly.pdf"}] },
  { id:72, grade:"MG", scale:"1/100", name:"00 Gundam Seven Sword/G", series:"Mobile Suit Gundam 00", imageUrl:null,
    manuals:[{id:98,name:"Full Assembly Manual",lang:"EN/JP",pages:56,size:"12.5 MB"}] },
  { id:73, grade:"MG", scale:"1/100", name:"Crossbone Gundam X1 Ver. Ka", series:"Mobile Suit Crossbone Gundam", imageUrl:null,
    manuals:[{id:99,name:"Full Assembly Manual",lang:"EN/JP",pages:58,size:"12.9 MB"}] },
  { id:74, grade:"MG", scale:"1/100", name:"Tallgeese EW", series:"Endless Waltz", imageUrl:null,
    manuals:[{id:100,name:"Full Assembly Manual",lang:"EN/JP",pages:50,size:"11.2 MB"}] },
  { id:75, grade:"MG", scale:"1/100", name:"Epyon EW", series:"Endless Waltz", imageUrl:null,
    manuals:[{id:101,name:"Full Assembly Manual",lang:"EN/JP",pages:50,size:"11.0 MB"}] },
  { id:76, grade:"MG", scale:"1/100", name:"V2 Assault Buster Gundam Ver. Ka", series:"V Gundam", imageUrl:null,
    manuals:[{id:102,name:"Full Assembly Manual",lang:"EN/JP",pages:62,size:"14.0 MB"}] },
  { id:77, grade:"MG", scale:"1/100", name:"Hyaku-Shiki Ver. 2.0", series:"Mobile Suit Zeta Gundam", imageUrl:null,
    manuals:[{id:103,name:"Full Assembly Manual",lang:"EN/JP",pages:52,size:"11.9 MB"}] },
  { id:78, grade:"MG", scale:"1/100", name:"ReZEL", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:104,name:"Full Assembly Manual",lang:"EN/JP",pages:54,size:"12.2 MB"}] },
  { id:79, grade:"MG", scale:"1/100", name:"F91 Gundam Ver. 2.0", series:"Mobile Suit Gundam F91", imageUrl:null,
    manuals:[{id:105,name:"Full Assembly Manual",lang:"EN/JP",pages:54,size:"12.0 MB"}] },

  // ── PERFECT GRADE (PG) ────────────────────────────────────────
  { id:80, grade:"PG", scale:"1/60", name:"RX-78-2 Gundam", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:106,name:"Assembly Manual Vol.1",lang:"EN/JP",pages:72,size:"19.8 MB"},{id:107,name:"Assembly Manual Vol.2",lang:"EN/JP",pages:68,size:"18.4 MB"}] },
  { id:81, grade:"PG", scale:"1/60", name:"Zaku II", series:"Mobile Suit Gundam", imageUrl:null,
    manuals:[{id:108,name:"Assembly Manual Vol.1",lang:"EN/JP",pages:68,size:"18.2 MB"},{id:109,name:"Assembly Manual Vol.2",lang:"EN/JP",pages:64,size:"17.1 MB"}] },
  { id:82, grade:"PG", scale:"1/60", name:"Wing Gundam Zero EW", series:"Endless Waltz", imageUrl:null,
    manuals:[{id:110,name:"Assembly Manual Vol.1",lang:"EN/JP",pages:72,size:"20.2 MB"},{id:111,name:"Assembly Manual Vol.2",lang:"EN/JP",pages:68,size:"18.9 MB"},{id:112,name:"LED Unit Guide",lang:"EN/JP",pages:20,size:"4.4 MB"}] },
  { id:83, grade:"PG", scale:"1/60", name:"Strike Gundam", series:"Mobile Suit Gundam SEED", imageUrl:null,
    manuals:[{id:113,name:"Assembly Manual Vol.1",lang:"EN/JP",pages:64,size:"18.7 MB"},{id:114,name:"Assembly Manual Vol.2",lang:"EN/JP",pages:60,size:"17.2 MB"},{id:115,name:"Aile Striker Pack Guide",lang:"EN/JP",pages:28,size:"6.4 MB"},{id:116,name:"LED Installation Manual",lang:"EN/JP",pages:16,size:"3.9 MB"}] },
  { id:84, grade:"PG", scale:"1/60", name:"Freedom Gundam", series:"Mobile Suit Gundam SEED", imageUrl:null,
    manuals:[{id:117,name:"Assembly Manual Vol.1",lang:"EN/JP",pages:72,size:"20.5 MB"},{id:118,name:"Assembly Manual Vol.2",lang:"EN/JP",pages:68,size:"19.1 MB"}] },
  { id:85, grade:"PG", scale:"1/60", name:"Strike Freedom Gundam", series:"Mobile Suit Gundam SEED Destiny", imageUrl:null,
    manuals:[{id:119,name:"Assembly Manual Vol.1",lang:"EN/JP",pages:76,size:"21.4 MB"},{id:120,name:"Assembly Manual Vol.2",lang:"EN/JP",pages:72,size:"20.2 MB"},{id:121,name:"LED Unit Installation",lang:"EN/JP",pages:24,size:"5.2 MB"}] },
  { id:86, grade:"PG", scale:"1/60", name:"Unicorn Gundam", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:122,name:"Assembly Manual Vol.1",lang:"EN/JP",pages:80,size:"22.1 MB"},{id:123,name:"Assembly Manual Vol.2",lang:"EN/JP",pages:76,size:"20.8 MB"},{id:124,name:"LED Unit Installation",lang:"EN/JP",pages:24,size:"5.4 MB"},{id:125,name:"Psycho-frame Effect Guide",lang:"EN/JP",pages:16,size:"3.8 MB"}] },
  { id:87, grade:"PG", scale:"1/60", name:"Banshee Norn", series:"Mobile Suit Gundam UC", imageUrl:null,
    manuals:[{id:126,name:"Assembly Manual Vol.1",lang:"EN/JP",pages:80,size:"22.3 MB"},{id:127,name:"Assembly Manual Vol.2",lang:"EN/JP",pages:76,size:"21.0 MB"},{id:128,name:"LED Unit Installation",lang:"EN/JP",pages:24,size:"5.5 MB"}] },
  { id:88, grade:"PG", scale:"1/60", name:"00 Raiser", series:"Mobile Suit Gundam 00", imageUrl:null,
    manuals:[{id:129,name:"Assembly Manual Vol.1",lang:"EN/JP",pages:74,size:"20.8 MB"},{id:130,name:"Assembly Manual Vol.2",lang:"EN/JP",pages:70,size:"19.6 MB"},{id:131,name:"GN Drive Guide",lang:"EN/JP",pages:18,size:"4.0 MB"}] },
  { id:89, grade:"PG", scale:"1/60", name:"Exia (Repair II)", series:"Mobile Suit Gundam 00", imageUrl:null,
    manuals:[{id:132,name:"Assembly Manual Vol.1",lang:"EN/JP",pages:72,size:"20.2 MB"},{id:133,name:"Assembly Manual Vol.2",lang:"EN/JP",pages:68,size:"19.0 MB"}] },

  // ── SD GUNDAM ─────────────────────────────────────────────────
  { id:90, grade:"SD", scale:"SD", name:"RX-78-2 Gundam", series:"SD Gundam EX-Standard", imageUrl:null,
    manuals:[{id:134,name:"Assembly Manual",lang:"EN/JP",pages:14,size:"2.8 MB"}] },
  { id:91, grade:"SD", scale:"SD", name:"Nu Gundam", series:"SD Gundam EX-Standard", imageUrl:null,
    manuals:[{id:135,name:"Assembly Manual",lang:"EN/JP",pages:16,size:"3.2 MB"}] },
  { id:92, grade:"SD", scale:"SD", name:"Wing Gundam Zero EW", series:"SD Gundam EX-Standard", imageUrl:null,
    manuals:[{id:136,name:"Assembly Manual",lang:"EN/JP",pages:16,size:"3.1 MB"}] },
  { id:93, grade:"SD", scale:"SD", name:"Unicorn Gundam", series:"SD Gundam EX-Standard", imageUrl:null,
    manuals:[{id:137,name:"Assembly Manual",lang:"EN/JP",pages:16,size:"3.3 MB"}] },
  { id:94, grade:"SD", scale:"SD", name:"Sazabi", series:"SD Gundam EX-Standard", imageUrl:null,
    manuals:[{id:138,name:"Assembly Manual",lang:"EN/JP",pages:16,size:"3.2 MB"}] },
  { id:95, grade:"SD", scale:"SD", name:"Strike Freedom Gundam", series:"SD Gundam EX-Standard", imageUrl:null,
    manuals:[{id:139,name:"Assembly Manual",lang:"EN/JP",pages:14,size:"2.9 MB"}] },
  { id:96, grade:"SD", scale:"SD", name:"Barbatos", series:"SD Gundam Cross Silhouette", imageUrl:null,
    manuals:[{id:140,name:"Assembly Manual",lang:"EN/JP",pages:18,size:"3.5 MB"}] },
  { id:97, grade:"SD", scale:"SD", name:"Aerial", series:"SD Gundam Cross Silhouette", imageUrl:null,
    manuals:[{id:141,name:"Assembly Manual",lang:"EN/JP",pages:18,size:"3.6 MB"}] },
  { id:98, grade:"SD", scale:"SD", name:"Gundam Mk-II (AEUG)", series:"SD Gundam EX-Standard", imageUrl:null,
    manuals:[{id:142,name:"Assembly Manual",lang:"EN/JP",pages:14,size:"2.8 MB"}] },
  { id:99, grade:"SD", scale:"SD", name:"Zaku II", series:"SD Gundam EX-Standard", imageUrl:null,
    manuals:[{id:143,name:"Assembly Manual",lang:"EN/JP",pages:14,size:"2.7 MB"}] },
  { id:100, grade:"SD", scale:"SD", name:"Exia", series:"SD Gundam Cross Silhouette", imageUrl:null,
    manuals:[{id:144,name:"Assembly Manual",lang:"EN/JP",pages:18,size:"3.4 MB"}] },
];

const GRADES = ["ALL", "HG", "MG", "RG", "PG", "SD", "EG"];

// Convert kit to URL slug: "EG 1/144 RX-78-2 Gundam" → "eg-144-rx78-2-gundam"
const slugify = (kit) =>
  `${kit.grade}-${kit.scale}-${kit.name}`
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const findKitBySlug = (slug) => KITS.find(k => slugify(k) === slug);

// ─────────────────────────────────────────────────────────────
// KIT DETAIL — separate component so it can use useParams
// ─────────────────────────────────────────────────────────────
function KitDetail({ gc, isSignedIn, favourites, buildProgress, toggleFavourite, setBuildStatus, openManualId, toggleManual, setOpenManualId, goHome }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const kit = findKitBySlug(slug);

  if (!kit) return (
    <div style={{padding:"80px 40px",textAlign:"center",fontFamily:"'Share Tech Mono',monospace",color:"var(--text-dim)"}}>
      <div style={{fontSize:"3rem",marginBottom:"16px",opacity:0.3}}>404</div>
      <div style={{letterSpacing:"2px",marginBottom:"24px"}}>KIT NOT FOUND</div>
      <button className="back-btn" style={{margin:"0 auto"}} onClick={goHome}>← BACK TO LIBRARY</button>
    </div>
  );

  return (
    <>
      <button className="back-btn" onClick={() => navigate(-1)}>← BACK TO LIBRARY</button>

      <div className="kit-detail-header">
        <div className="detail-grade" style={{color:gc(kit.grade).accent}}>{kit.grade} GRADE — {kit.scale}</div>
        <div className="detail-title">
          {kit.name}
          {isSignedIn && (
            <button className="fav-btn" style={{marginLeft:"12px",fontSize:"1.4rem"}} onClick={e => toggleFavourite(e, kit.id)}>
              {favourites.includes(kit.id) ? "⭐" : "☆"}
            </button>
          )}
        </div>
        <div className="detail-meta">
          <span>◈ {kit.series}</span>
          <span>◈ {kit.manuals.length} MANUAL{kit.manuals.length!==1?"S":""} AVAILABLE</span>
        </div>
      </div>

      {isSignedIn && (
        <div className="build-status-wrap">
          <span className="build-status-label">◈ BUILD STATUS</span>
          <div className="build-status-options">
            {[
              {id:"notstarted", label:"◻ NOT STARTED"},
              {id:"inprogress", label:"⚙ IN PROGRESS"},
              {id:"complete",   label:"✓ COMPLETE"},
            ].map(s => (
              <button
                key={s.id}
                className={`build-status-btn${buildProgress[kit.id]===s.id ? ` active-${s.id}` : ""}`}
                onClick={() => setBuildStatus(kit.id, s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="manual-list">
        <div className="section-header" style={{padding:"0 0 20px"}}>
          <span className="section-title">AVAILABLE MANUALS</span>
          <div className="section-line" />
        </div>
        {kit.manuals.map(manual => (
          <div key={manual.id} className="manual-item" onClick={() => toggleManual(manual.id)}>
            <div className="manual-item-row">
              <div className="manual-item-left">
                <div className="manual-icon">PDF</div>
                <div>
                  <div className="manual-name">{manual.name}</div>
                  <div className="manual-meta">
                    <span>LANG: {manual.lang}</span>
                    <span>{manual.pages} PGS</span>
                    <span>{manual.size}</span>
                  </div>
                </div>
              </div>
              <div className="manual-actions">
                <button
                  className={`btn btn-view${openManualId === manual.id ? " active" : ""}`}
                  onClick={e => { e.stopPropagation(); toggleManual(manual.id); }}
                >
                  {openManualId === manual.id ? "▼ CLOSE" : "▶ VIEW"}
                </button>
                <button className="btn btn-dl" onClick={e => { e.stopPropagation(); alert(`Download "${manual.name}" — connect your PDF files to enable downloads.`); }}>↓ DL</button>
              </div>
            </div>
            <div className={`pdf-dropdown${openManualId === manual.id ? " open" : ""}`}>
              <div className="pdf-dropdown-inner">
                <div className="pdf-dropdown-header">
                  <span className="pdf-dropdown-title">◈ {manual.name.toUpperCase()}</span>
                  <button className="pdf-dropdown-close" onClick={e => { e.stopPropagation(); setOpenManualId(null); }}>✕</button>
                </div>
                <div className="pdf-frame-wrap">
                  {manual.url ? (
                    <iframe src={`${R2}/${manual.url}`} width="100%" height="100%" style={{border:"none"}} title={manual.name} />
                  ) : (
                    <div className="pdf-placeholder">
                      <div className="big">PDF</div>
                      <div>[ PDF VIEWER ]</div>
                      <div style={{marginTop:12,fontSize:"0.65rem",opacity:0.6}}>
                        Add a <code>url</code> field to this manual in the data<br/>to enable in-browser viewing.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="kit-image-section">
        <div className="kit-image-wrap" style={{"--ki-accent": gc(kit.grade).accent}}>
          {kit.imageUrl ? (
            <>
              <img className="kit-image" src={kit.imageUrl} alt={`${kit.name} — ${kit.grade} ${kit.scale}`}
                onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
              <div className="kit-image-placeholder" style={{display:"none"}}>
                <div className="kit-image-placeholder-icon">🤖</div>
                <div className="kit-image-placeholder-text">IMAGE UNAVAILABLE<br/>REPLACE imageUrl IN DATA</div>
              </div>
            </>
          ) : (
            <div className="kit-image-placeholder">
              <div className="kit-image-placeholder-icon">🤖</div>
              <div className="kit-image-placeholder-text">NO IMAGE YET<br/>ADD imageUrl TO THIS KIT</div>
            </div>
          )}
          <div className="kit-image-label">{kit.grade} {kit.scale} · {kit.name}</div>
        </div>
      </div>

      {AMAZON_URLS[String(kit.id)] && (
        <div className="affiliate-banner">
          <div className="affiliate-left">
            <div className="affiliate-icon">🛒</div>
            <div>
              <div className="affiliate-title">BUY ON AMAZON</div>
              <div className="affiliate-sub">{kit.grade} {kit.scale} · {kit.name}</div>
            </div>
          </div>
          <a className="btn-amazon" href={AMAZON_URLS[String(kit.id)]} target="_blank" rel="noopener noreferrer sponsored">
            VIEW ON AMAZON →
          </a>
          <div className="affiliate-disclaimer">
            ★ As an Amazon Associate, KitVault.io earns from qualifying purchases. This does not affect the price you pay.
          </div>
        </div>
      )}
    </>
  );
}

export default function KitVault() {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [openManualId, setOpenManualId] = useState(null);
  const toggleManual = (id) => setOpenManualId(prev => prev === id ? null : id);
  const [showSettings, setShowSettings] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [pdfOnly, setPdfOnly] = useState(true);
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_favourites") || "[]"); } catch { return []; }
  });
  const [buildProgress, setBuildProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_progress") || "{}"); } catch { return {}; }
  });

  const toggleFavourite = (e, kitId) => {
    e.stopPropagation();
    if (!isSignedIn) return;
    setFavourites(prev => {
      const next = prev.includes(kitId) ? prev.filter(id => id !== kitId) : [...prev, kitId];
      localStorage.setItem("kv_favourites", JSON.stringify(next));
      return next;
    });
  };

  const setBuildStatus = (kitId, status) => {
    if (!isSignedIn) return;
    setBuildProgress(prev => {
      const next = { ...prev, [kitId]: status };
      localStorage.setItem("kv_progress", JSON.stringify(next));
      return next;
    });
  };

  const filtered = KITS.filter(k => {
    const hasPdf = k.manuals.some(m => m.url);
    const matchGrade = gradeFilter === "ALL" || k.grade === gradeFilter;
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase()) || k.series.toLowerCase().includes(search.toLowerCase());
    return (!pdfOnly || hasPdf) && matchGrade && matchSearch;
  }).sort((a, b) => {
    if (sortOrder === "az") return a.name.localeCompare(b.name);
    if (sortOrder === "za") return b.name.localeCompare(a.name);
    return a.id - b.id;
  });

  const gc = (g) => GRADE_COLORS[g] || GRADE_COLORS["HG"];
  const goHome = () => { setOpenManualId(null); navigate("/"); };
  const goVault = () => { setOpenManualId(null); navigate("/vault"); };
  const goDisclaimer = () => { setOpenManualId(null); setShowSettings(false); navigate("/disclaimer"); };
  const goKit = (kit) => { setOpenManualId(null); navigate(`/kit/${slugify(kit)}`); };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      <style>{styles}</style>
      <div className="grid-bg" />
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div className="logo" onClick={goHome} style={{cursor:"pointer"}}>
            <div className="logo-icon">▣</div>
            <div className="logo-text">
              <span>KIT<span style={{color:"#ff6600"}}>VAULT</span></span>
              <span className="logo-sub">KITVAULT.IO</span>
            </div>
          </div>
          <div className="header-right">
            <div className="status-dot" />
            <SignedIn>
              <button
                onClick={goVault}
                style={{
                  background:"none", border:"1px solid var(--border)", color: location.pathname==="/vault" ? "var(--accent)" : "var(--text-dim)",
                  fontFamily:"'Share Tech Mono',monospace", fontSize:"0.65rem",
                  padding:"8px 14px", cursor:"pointer", letterSpacing:"1px", transition:"all 0.2s",
                  clipPath:"polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%)"
                }}
              >
                ⭐ MY VAULT
              </button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="auth-btn">LOG IN</button>
              </SignInButton>
            </SignedOut>
            <button className={`cog-btn ${showSettings?"active":""}`} onClick={() => setShowSettings(true)} title="Settings">⚙</button>
          </div>
        </header>

        <Routes>

          {/* ===== HOME PAGE ===== */}
          <Route path="/" element={
            <>
              <section className="hero">
                <div className="hero-tag">GUNDAM MANUAL ARCHIVE</div>
                <h1><span className="a1">KIT</span><span className="a2">VAULT</span></h1>
                <p className="hero-sub">YOUR COMPLETE GUNPLA MANUAL DATABASE</p>
                <div className="hero-stats">
                  <div className="stat"><div className="stat-num">{KITS.length}</div><div className="stat-label">KITS INDEXED</div></div>
                  <div className="stat"><div className="stat-num">{KITS.reduce((a,k)=>a+k.manuals.length,0)}</div><div className="stat-label">MANUALS</div></div>
                  <div className="stat"><div className="stat-num">{GRADES.length-1}</div><div className="stat-label">GRADES</div></div>
                </div>
              </section>

              <div className="controls">
                <div className="controls-row">
                  <div className="search-wrap">
                    <span className="search-icon">⌕</span>
                    <input className="search-input" placeholder="SEARCH KITS OR SERIES..." value={search} onChange={e=>setSearch(e.target.value)} />
                  </div>
                  <div className={`pdf-toggle ${pdfOnly?"on":""}`} onClick={()=>setPdfOnly(p=>!p)}>
                    <div className="pdf-toggle-box">{pdfOnly?"✓":""}</div>
                    <span className="pdf-toggle-label">PDF AVAILABLE</span>
                  </div>
                </div>
                <div className="controls-row">
                  <span className="controls-label">GRADE</span>
                  {GRADES.map(g => (
                    <button key={g} className={`filter-btn ${gradeFilter===g?"active":""}`} onClick={()=>setGradeFilter(g)}>{g}</button>
                  ))}
                  <div className="filter-divider" />
                  <span className="controls-label">SORT</span>
                  <button className={`sort-btn ${sortOrder==="az"?"active":""}`} onClick={()=>setSortOrder(s=>s==="az"?"default":"az")}>A→Z</button>
                  <button className={`sort-btn ${sortOrder==="za"?"active":""}`} onClick={()=>setSortOrder(s=>s==="za"?"default":"za")}>Z→A</button>
                </div>
              </div>

              <div className="section-header">
                <span className="section-title">KIT LIBRARY</span>
                <div className="section-line" />
                <span className="section-count">{filtered.length} RESULTS</span>
              </div>

              <div className="kit-grid">
                {filtered.map(kit => {
                  const c = gc(kit.grade);
                  const isFav = favourites.includes(kit.id);
                  const progress = buildProgress[kit.id];
                  return (
                    <div key={kit.id} className="kit-card"
                      style={{"--card-accent":c.accent,"--card-accent-bg":c.bg}}
                      onClick={()=>goKit(kit)}
                    >
                      <div className="card-grade-banner" style={{background:c.accent}} />
                      <div className="card-body">
                        <div className="card-top">
                          <span className="grade-badge">{kit.grade}</span>
                          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                            {progress === "inprogress" && <span className="build-badge inprogress">IN PROGRESS</span>}
                            {progress === "complete" && <span className="build-badge complete">COMPLETE</span>}
                            <span className="manual-count">{kit.manuals.length} MANUAL{kit.manuals.length!==1?"S":""}</span>
                            {isSignedIn && (
                              <button className="fav-btn" onClick={e => toggleFavourite(e, kit.id)} title={isFav?"Remove from favourites":"Add to favourites"}>
                                {isFav ? "⭐" : "☆"}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="card-title">{kit.name}</div>
                        <div className="card-series">{kit.series}</div>
                        <div className="card-footer">
                          <span className="card-scale">SCALE {kit.scale}</span>
                          <span className="card-arrow">→</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          } />

          {/* ===== KIT DETAIL PAGE ===== */}
          <Route path="/kit/:slug" element={<KitDetail gc={gc} isSignedIn={isSignedIn} favourites={favourites} buildProgress={buildProgress} toggleFavourite={toggleFavourite} setBuildStatus={setBuildStatus} openManualId={openManualId} toggleManual={toggleManual} setOpenManualId={setOpenManualId} goHome={goHome} />} />

          {/* ===== MY VAULT PAGE ===== */}
          <Route path="/vault" element={
            <>
              <div className="page-hero">
                <div className="page-tag">PERSONAL COLLECTION</div>
                <div className="page-title">MY <span style={{color:"var(--accent)"}}>VAULT</span></div>
                <div className="page-sub">{favourites.length} SAVED KIT{favourites.length!==1?"S":""}</div>
              </div>
              {favourites.length === 0 ? (
                <div className="vault-empty">
                  <span className="vault-empty-icon">⭐</span>
                  NO KITS SAVED YET<br/>
                  <span style={{fontSize:"0.7rem",opacity:0.5}}>STAR A KIT FROM THE LIBRARY TO ADD IT HERE</span>
                </div>
              ) : (
                <div className="vault-grid">
                  {KITS.filter(k => favourites.includes(k.id)).map(kit => {
                    const c = gc(kit.grade);
                    const progress = buildProgress[kit.id];
                    return (
                      <div key={kit.id} className="kit-card"
                        style={{"--card-accent":c.accent,"--card-accent-bg":c.bg}}
                        onClick={()=>goKit(kit)}
                      >
                        <div className="card-grade-banner" style={{background:c.accent}} />
                        <div className="card-body">
                          <div className="card-top">
                            <span className="grade-badge">{kit.grade}</span>
                            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                              {progress === "inprogress" && <span className="build-badge inprogress">IN PROGRESS</span>}
                              {progress === "complete" && <span className="build-badge complete">COMPLETE</span>}
                              <button className="fav-btn" onClick={e => toggleFavourite(e, kit.id)}>⭐</button>
                            </div>
                          </div>
                          <div className="card-title">{kit.name}</div>
                          <div className="card-series">{kit.series}</div>
                          <div className="card-footer">
                            <span className="card-scale">SCALE {kit.scale}</span>
                            <span className="card-arrow">→</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          } />

          {/* ===== DISCLAIMER PAGE ===== */}
          <Route path="/disclaimer" element={
            <>
              <div className="page-hero">
                <div className="page-tag">LEGAL NOTICE</div>
                <div className="page-title">DISCLAIMER</div>
                <div className="page-sub">PLEASE READ BEFORE USING THIS SITE</div>
              </div>
              <div className="page">
                <div className="bandai-badge">
                  <div className="bandai-name">BANDAI NAMCO ENTERTAINMENT</div>
                  <div className="bandai-sub">© SOTSU · SUNRISE — ALL GUNDAM IP AND TRADEMARKS BELONG TO THEIR RESPECTIVE OWNERS</div>
                </div>
                <div className="disclaimer-grid">
                  <div className="disclaimer-card" style={{"--dc":"#ffcc00"}}>
                    <div className="disclaimer-card-icon">🛡️</div>
                    <div className="disclaimer-card-title">FAN PROJECT</div>
                    <div className="disclaimer-card-text">KitVault.io is an unofficial, non-commercial fan-made website created out of love for the Gunpla hobby. It is not affiliated with, endorsed by, or connected to Bandai Namco Entertainment, Sotsu, or Sunrise in any way.</div>
                  </div>
                  <div className="disclaimer-card" style={{"--dc":"#00aaff"}}>
                    <div className="disclaimer-card-icon">📄</div>
                    <div className="disclaimer-card-title">MANUAL CONTENT</div>
                    <div className="disclaimer-card-text">All assembly manuals hosted on this site are the intellectual property of Bandai Namco Entertainment. They are provided here solely as a convenience resource for hobbyists who have already purchased these kits.</div>
                  </div>
                  <div className="disclaimer-card" style={{"--dc":"#00ffcc"}}>
                    <div className="disclaimer-card-icon">🔗</div>
                    <div className="disclaimer-card-title">AFFILIATE LINKS</div>
                    <div className="disclaimer-card-text">This site participates in the Amazon Associates affiliate program. Links to Amazon products may earn a small commission at no extra cost to you. This helps cover server costs and keeps the site free for everyone.</div>
                  </div>
                  <div className="disclaimer-card" style={{"--dc":"#ff6600"}}>
                    <div className="disclaimer-card-icon">💛</div>
                    <div className="disclaimer-card-title">NON-PROFIT</div>
                    <div className="disclaimer-card-text">Any revenue generated through affiliate links or donations is used solely to cover hosting and maintenance costs. This project is run by a hobbyist for hobbyists — not for profit.</div>
                  </div>
                </div>
                <div className="disclaimer-block">
                  <div className="disclaimer-block-title">INTELLECTUAL PROPERTY NOTICE</div>
                  <p><span className="hl">Gundam</span>, all associated mobile suit names, series titles, logos, and imagery are registered trademarks of <span className="hl-gold">Bandai Namco Entertainment Inc.</span>, <span className="hl-gold">Sotsu Co., Ltd.</span>, and <span className="hl-gold">Sunrise Inc.</span> All rights are reserved by their respective owners.</p>
                  <p>The assembly manuals available on this site are reproduced for informational and archival purposes only. If you are a rights holder and wish for any content to be removed, please contact us and it will be taken down promptly.</p>
                </div>
                <div className="disclaimer-block">
                  <div className="disclaimer-block-title">AMAZON ASSOCIATES DISCLOSURE</div>
                  <p>KitVault.io is a participant in the <span className="hl">Amazon Services LLC Associates Program</span>, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.</p>
                  <p>As an Amazon Associate, we earn from qualifying purchases. This does <span className="hl">not</span> increase the price you pay. Affiliate commissions help us keep this resource free and maintained for the community.</p>
                </div>
                <div className="disclaimer-block">
                  <div className="disclaimer-block-title">FAIR USE & INTENT</div>
                  <p>KitVault.io operates under the belief that hosting assembly manuals for kits that hobbyists have legitimately purchased constitutes fair use. We do not sell, redistribute for profit, or claim ownership over any Bandai intellectual property.</p>
                  <p>Our intent is to make the hobby more accessible — especially for international builders who may have received kits with manuals in a language they cannot read, or who have lost their original instruction sheets.</p>
                </div>
              </div>
            </>
          } />

        </Routes>

        {/* SETTINGS MODAL */}
        {/* SETTINGS MODAL */}
        {showSettings && (
          <div className="modal-overlay" onClick={()=>setShowSettings(false)}>
            <div className="settings-modal" onClick={e=>e.stopPropagation()}>
              <div className="settings-header">
                <span className="settings-title">⚙ SETTINGS</span>
                <button className="modal-close" onClick={()=>setShowSettings(false)}>✕</button>
              </div>
              <div className="settings-body">

                {/* DONATE */}
                <div className="settings-section">
                  <div className="settings-section-label">SUPPORT KITVAULT</div>
                  <div className="donate-block">
                    <div className="donate-title">♥ SUPPORT THIS PROJECT</div>
                    <div className="donate-sub">
                      KitVault.io is a free, non-profit fan resource.<br/>
                      Donations help cover hosting costs and keep the vault online.
                    </div>
                    {/* Replace href with your Ko-fi, PayPal, or other donation link */}
                    <a className="btn-donate" href="https://ko-fi.com/your-page" target="_blank" rel="noopener noreferrer">
                      ♥ DONATE / TIP JAR
                    </a>
                  </div>
                </div>

                {/* SITE INFO */}
                <div className="settings-section">
                  <div className="settings-section-label">SITE INFO</div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">VERSION</span>
                    <span className="settings-info-val">v1.0.0</span>
                  </div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">KITS INDEXED</span>
                    <span className="settings-info-val">{KITS.length}</span>
                  </div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">TOTAL MANUALS</span>
                    <span className="settings-info-val">{KITS.reduce((a,k)=>a+k.manuals.length,0)}</span>
                  </div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">DISCLAIMER</span>
                    <span className="settings-info-val clickable-val" onClick={goDisclaimer}>VIEW →</span>
                  </div>
                </div>

                {/* AFFILIATE NOTE */}
                <div className="settings-section">
                  <div className="settings-section-label">AFFILIATE PROGRAM</div>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:"var(--text-dim)",letterSpacing:"0.5px",lineHeight:2}}>
                    KitVault.io participates in the Amazon Associates program. Kit pages include affiliate links to Amazon — we earn a small commission on qualifying purchases at no extra cost to you. Thank you for supporting the site.
                  </div>
                </div>

                {/* DISCLAIMER LINK */}
                <div className="settings-section">
                  <div className="settings-section-label">LEGAL</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:"var(--text-dim)",letterSpacing:"0.5px",lineHeight:1.8}}>
                      Fan-made non-profit project.<br/>All Gundam IP © Bandai Namco · Sotsu · Sunrise.
                    </div>
                    <button
                      onClick={goDisclaimer}
                      style={{
                        background:"rgba(255,204,0,0.06)", border:"1px solid rgba(255,204,0,0.3)",
                        color:"var(--gold)", fontFamily:"'Share Tech Mono',monospace",
                        fontSize:"0.6rem", padding:"8px 14px", cursor:"pointer",
                        letterSpacing:"1px", transition:"all 0.2s", whiteSpace:"nowrap",
                        clipPath:"polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%)"
                      }}
                    >
                      VIEW DISCLAIMER →
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer">
          <span className="footer-logo">KITVAULT.IO</span>
          <span>© GUNDAM IP — BANDAI NAMCO · SOTSU · SUNRISE</span>
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem"}}>v1.0.0</span>
        </footer>

      </div>
    </>
  );
}
