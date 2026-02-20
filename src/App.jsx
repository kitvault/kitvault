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

  /* NAV DROPDOWNS */
  .nav-right {
    display: flex; align-items: center; gap: 4px;
  }
  .nav-item { position: relative; }
  .nav-btn {
    background: none; border: none; color: var(--text-dim);
    font-family: 'Share Tech Mono', monospace; font-size: 0.68rem;
    padding: 8px 14px; cursor: pointer; letter-spacing: 1.5px;
    transition: color 0.2s; display: flex; align-items: center; gap: 6px;
    white-space: nowrap;
  }
  .nav-btn:hover, .nav-item.open .nav-btn { color: var(--accent); }
  .nav-btn-arrow { font-size: 0.5rem; transition: transform 0.2s; opacity: 0.6; }
  .nav-item.open .nav-btn-arrow { transform: rotate(180deg); }
  .nav-dropdown {
    position: absolute; top: calc(100% + 12px); right: 0;
    background: var(--bg2); border: 1px solid var(--border-bright);
    min-width: 300px; z-index: 200;
    clip-path: polygon(0 0, 97% 0, 100% 3%, 100% 100%, 3% 100%, 0 97%);
    opacity: 0; pointer-events: none; transform: translateY(-8px);
    transition: opacity 0.18s, transform 0.18s;
  }
  .nav-dropdown::before {
    content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
  }
  .nav-item.open .nav-dropdown {
    opacity: 1; pointer-events: all; transform: translateY(0);
  }
  .nav-dropdown-header {
    padding: 12px 16px 8px;
    font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
    color: var(--accent); letter-spacing: 3px; border-bottom: 1px solid var(--border);
  }
  .nav-dd-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 16px; cursor: pointer; transition: background 0.15s;
    border-bottom: 1px solid rgba(26,47,80,0.5); text-decoration: none;
  }
  .nav-dd-item:last-child { border-bottom: none; }
  .nav-dd-item:hover { background: rgba(0,170,255,0.05); }
  .nav-dd-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
  .nav-dd-text {}
  .nav-dd-label {
    font-family: 'Rajdhani', sans-serif; font-size: 0.9rem; font-weight: 600;
    color: var(--text-bright); letter-spacing: 0.5px; display: block;
  }
  .nav-dd-sub {
    font-family: 'Share Tech Mono', monospace; font-size: 0.58rem;
    color: var(--text-dim); letter-spacing: 0.5px; line-height: 1.6;
    display: block; margin-top: 1px;
  }
  .nav-dd-item:hover .nav-dd-label { color: var(--accent); }
  @media (max-width: 860px) { .nav-right { display: none; } }

  /* GRADE DETAIL PAGE */
  .grade-page { padding: 0 40px 60px; }
  .grade-page-hero {
    padding: 60px 40px 40px; text-align: center; position: relative;
    border-bottom: 1px solid var(--border); margin-bottom: 40px;
  }
  .grade-page-hero::after {
    content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 200px; height: 1px; background: var(--grade-color, var(--accent)); opacity: 0.6;
  }
  .grade-page-tag {
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    letter-spacing: 4px; margin-bottom: 12px; opacity: 0.7;
  }
  .grade-page-title {
    font-family: 'Orbitron', monospace; font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 900; color: var(--text-bright); letter-spacing: 3px; margin-bottom: 8px;
  }
  .grade-page-sub {
    font-family: 'Share Tech Mono', monospace; font-size: 0.8rem;
    color: var(--text-dim); letter-spacing: 2px; margin-bottom: 20px;
  }
  .grade-page-badge {
    display: inline-block; font-family: 'Orbitron', monospace; font-size: 0.7rem;
    font-weight: 700; padding: 6px 18px; letter-spacing: 3px;
    border: 1px solid var(--grade-color, var(--accent));
    color: var(--grade-color, var(--accent));
    background: rgba(0,0,0,0.3);
  }
  .grade-section {
    background: var(--panel); border: 1px solid var(--border);
    padding: 28px 32px; margin-bottom: 16px;
    clip-path: polygon(0 0, 98% 0, 100% 4%, 100% 100%, 2% 100%, 0 96%);
    position: relative;
  }
  .grade-section::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: var(--grade-color, var(--accent)); opacity: 0.7;
  }
  .grade-section-title {
    font-family: 'Orbitron', monospace; font-size: 0.75rem; font-weight: 700;
    color: var(--grade-color, var(--accent)); letter-spacing: 3px; margin-bottom: 12px;
  }
  .grade-section-body {
    font-family: 'Rajdhani', sans-serif; font-size: 1rem; color: var(--text);
    line-height: 1.8; letter-spacing: 0.3px;
  }
  .grade-section-body strong { color: var(--text-bright); font-weight: 600; }
  .grade-stat-row {
    display: flex; gap: 16px; flex-wrap: wrap; margin-top: 20px;
  }
  .grade-stat {
    flex: 1; min-width: 120px; text-align: center;
    border: 1px solid var(--border); padding: 14px 20px;
    background: rgba(0,0,0,0.2);
  }
  .grade-stat-val {
    font-family: 'Orbitron', monospace; font-size: 1.2rem; font-weight: 700;
    color: var(--grade-color, var(--accent)); margin-bottom: 4px;
  }
  .grade-stat-lbl {
    font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
    color: var(--text-dim); letter-spacing: 1.5px;
  }
  .grade-kits-link {
    display: inline-flex; align-items: center; gap: 8px; margin-top: 24px;
    background: rgba(0,0,0,0.2); border: 1px solid var(--grade-color, var(--accent));
    color: var(--grade-color, var(--accent)); font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; padding: 10px 20px; cursor: pointer; letter-spacing: 1.5px;
    transition: all 0.2s; clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
  }
  .grade-kits-link:hover { background: rgba(255,255,255,0.05); box-shadow: 0 0 15px rgba(0,170,255,0.2); }
  .grade-nav-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 40px 0; gap: 12px;
  }
  .grade-nav-btn {
    display: flex; align-items: center; gap: 8px;
    background: var(--panel); border: 1px solid var(--border); color: var(--text-dim);
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    padding: 9px 16px; cursor: pointer; letter-spacing: 1px; transition: all 0.2s;
  }
  .grade-nav-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,170,255,0.06); }
  .grade-nav-btn .grade-nav-label { font-family: 'Rajdhani', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--text-bright); display: block; margin-top: 1px; transition: color 0.2s; }
  .grade-nav-btn:hover .grade-nav-label { color: var(--accent); }
  .grade-nav-btn.prev { clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%, 0 75%); text-align: left; }
  .grade-nav-btn.next { clip-path: polygon(0 0, 92% 0, 100% 25%, 100% 100%, 0 100%); text-align: right; flex-direction: row-reverse; }
  .grade-nav-center { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: var(--text-dim); letter-spacing: 2px; }
  @media (max-width: 640px) {
    .grade-nav-row { padding: 16px 16px 0; }
    .grade-nav-btn { clip-path: none; font-size: 0.6rem; padding: 8px 12px; }
    .grade-nav-btn .grade-nav-label { font-size: 0.8rem; }
    .grade-nav-center { display: none; }
  }
  @media (max-width: 640px) {
    .grade-page { padding: 0 16px 40px; }
    .grade-page-hero { padding: 36px 16px 28px; }
    .grade-section { padding: 20px; clip-path: none; }
  }

  /* RESOURCES PAGE */
  .resources-page { padding: 0 40px 60px; }
  .resources-section-title {
    font-family: 'Orbitron', monospace; font-size: 0.8rem; font-weight: 700;
    color: var(--accent); letter-spacing: 3px; margin-bottom: 16px;
    display: flex; align-items: center; gap: 14px;
  }
  .resources-section-title::after { content:''; flex:1; height:1px; background: linear-gradient(90deg, var(--border), transparent); }
  .resources-section { margin-bottom: 40px; }
  .resources-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
  .resource-card {
    display: flex; align-items: flex-start; gap: 16px;
    background: var(--panel); border: 1px solid var(--border);
    padding: 20px; text-decoration: none; transition: all 0.2s;
    clip-path: polygon(0 0, 96% 0, 100% 8%, 100% 100%, 4% 100%, 0 92%);
    position: relative; overflow: hidden;
  }
  .resource-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent, var(--rc-color, var(--accent)), transparent);
    opacity:0; transition: opacity 0.2s;
  }
  .resource-card:hover { border-color: var(--rc-color, var(--accent)); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.4); }
  .resource-card:hover::before { opacity:1; }
  .resource-card-icon {
    font-size: 1.6rem; flex-shrink: 0; width: 40px; text-align: center; margin-top: 2px;
  }
  .resource-card-body {}
  .resource-card-label {
    font-family: 'Rajdhani', sans-serif; font-size: 1.05rem; font-weight: 700;
    color: var(--text-bright); letter-spacing: 0.5px; margin-bottom: 4px; display: block;
    transition: color 0.2s;
  }
  .resource-card:hover .resource-card-label { color: var(--rc-color, var(--accent)); }
  .resource-card-sub {
    font-family: 'Share Tech Mono', monospace; font-size: 0.62rem;
    color: var(--text-dim); letter-spacing: 0.5px; line-height: 1.7; display: block;
  }
  .resource-card-tag {
    display: inline-block; margin-top: 8px;
    font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
    color: var(--rc-color, var(--accent)); letter-spacing: 1px;
    border: 1px solid var(--rc-color, var(--accent)); padding: 2px 8px;
    opacity: 0.7;
  }
  @media (max-width: 640px) {
    .resources-page { padding: 0 16px 40px; }
    .resources-grid { grid-template-columns: 1fr; }
    .resource-card { clip-path: none; }
  }

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
    max-height: 1200px;
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
    position: relative; overflow: hidden;
  }
  .pdf-frame-wrap iframe { width: 100%; height: 100%; border: none; display: block; }
  @media (max-width: 640px) {
    .pdf-frame-wrap { height: 70vh; }
  }
  .pdf-placeholder {
    text-align: center; font-family: 'Share Tech Mono', monospace;
    color: var(--text-dim); font-size: 0.75rem; letter-spacing: 1px; line-height: 2;
  }
  .pdf-placeholder .big { font-size: 2.5rem; margin-bottom: 12px; color: var(--accent); opacity: 0.3; }
  .btn-view.active { background: rgba(0,170,255,0.22); box-shadow: var(--glow); }

  /* PDF FULLSCREEN MODAL */
  .pdf-fullscreen-overlay {
    position: fixed; inset: 0; z-index: 500;
    background: rgba(0,0,0,0.97);
    display: flex; flex-direction: column;
    backdrop-filter: blur(6px);
  }
  .pdf-fullscreen-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px; border-bottom: 1px solid var(--border);
    background: var(--bg2); flex-shrink: 0; gap: 12px;
  }
  .pdf-fullscreen-title {
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    color: var(--accent); letter-spacing: 2px; flex: 1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .pdf-fullscreen-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .pdf-fullscreen-close {
    background: none; border: 1px solid var(--border); color: var(--text-dim);
    padding: 6px 14px; cursor: pointer; font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; letter-spacing: 1px; transition: all 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .pdf-fullscreen-close:hover { border-color: var(--red); color: var(--red); }
  .pdf-fullscreen-body { flex: 1; overflow: hidden; position: relative; }
  .pdf-fullscreen-body iframe { width: 100%; height: 100%; border: none; display: block; }

  /* FULLSCREEN BUTTON */
  .btn-fullscreen {
    background: rgba(0,255,204,0.07); border: 1px solid var(--accent3);
    color: var(--accent3); font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; padding: 6px 12px; cursor: pointer;
    letter-spacing: 1px; transition: all 0.2s;
    display: flex; align-items: center; gap: 5px; white-space: nowrap;
  }
  .btn-fullscreen:hover { background: rgba(0,255,204,0.18); box-shadow: var(--glow-green); }

  /* MOBILE TAP-TO-INTERACT OVERLAY */
  .pdf-touch-overlay {
    display: none;
  }
  @media (max-width: 640px) {
    .pdf-touch-overlay {
      display: flex; position: absolute; inset: 0;
      align-items: center; justify-content: center;
      background: rgba(0,0,0,0.55); z-index: 2; cursor: pointer;
      flex-direction: column; gap: 10px; transition: opacity 0.2s;
    }
    .pdf-touch-overlay.hidden { display: none; }
    .pdf-touch-overlay-icon { font-size: 2.2rem; }
    .pdf-touch-overlay-text {
      font-family: 'Share Tech Mono', monospace; font-size: 0.7rem;
      color: var(--text-bright); letter-spacing: 2px; text-align: center; line-height: 1.9;
    }
  }

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
  .build-status-options { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .build-status-btn {
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
    padding: 6px 14px; cursor: pointer; letter-spacing: 1px;
    border: 1px solid var(--border); background: none; color: var(--text-dim);
    transition: all 0.2s;
    clip-path: polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%);
  }
  .build-status-btn.active-backlog { border-color: var(--text-dim); color: var(--text-dim); background: rgba(255,255,255,0.05); }
  .build-status-btn.active-inprogress { border-color: var(--gold); color: var(--gold); background: rgba(255,204,0,0.08); box-shadow: 0 0 10px rgba(255,204,0,0.2); }
  .build-status-btn.active-complete { border-color: var(--green); color: var(--green); background: rgba(0,255,136,0.08); box-shadow: 0 0 10px rgba(0,255,136,0.2); }
  .build-status-fav {
    background: none; border: 1px solid var(--border); cursor: pointer;
    font-size: 1rem; padding: 5px 10px; transition: all 0.2s; color: var(--text-dim);
    clip-path: polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%);
  }
  .build-status-fav:hover { border-color: var(--gold); transform: scale(1.15); }
  .build-status-fav.on { border-color: var(--gold); background: rgba(255,204,0,0.08); }

  /* PAGE PROGRESS TRACKER */
  .progress-tracker {
    margin: 0 40px 24px;
    background: var(--panel); border: 1px solid var(--border);
    padding: 16px 20px;
    clip-path: polygon(0 0, 98% 0, 100% 15%, 100% 100%, 2% 100%, 0 85%);
  }
  .progress-tracker-title {
    font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
    color: var(--text-dim); letter-spacing: 3px; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .progress-tracker-title::after { content:''; flex:1; height:1px; background:var(--border); }
  .progress-manual {
    margin-bottom: 14px; padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .progress-manual:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  .progress-manual-name {
    font-family: 'Rajdhani', sans-serif; font-size: 0.9rem; font-weight: 600;
    color: var(--text-bright); margin-bottom: 8px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .progress-pct {
    font-family: 'Orbitron', monospace; font-size: 0.75rem; font-weight: 700;
  }
  .progress-bar-wrap {
    height: 6px; background: var(--bg); border: 1px solid var(--border);
    margin-bottom: 10px; position: relative; overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%; transition: width 0.4s ease;
    background: linear-gradient(90deg, var(--accent), var(--accent3));
    box-shadow: 0 0 8px rgba(0,170,255,0.5);
  }
  .progress-bar-fill.complete { background: linear-gradient(90deg, var(--green), var(--accent3)); }
  .progress-input-row {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  }
  .progress-label {
    font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
    color: var(--text-dim); letter-spacing: 1px; white-space: nowrap;
  }
  .progress-input {
    width: 70px; background: var(--bg); border: 1px solid var(--border);
    color: var(--text-bright); font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem; padding: 5px 10px; outline: none; text-align: center;
    transition: border-color 0.2s;
  }
  .progress-input:focus { border-color: var(--accent); box-shadow: var(--glow); }
  .progress-total {
    font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: var(--text-dim);
  }


  /* ── XP PROGRESS BAR ── */
  .xp-wrap {
    position: relative;
  }

  /* Full bar — kit detail page */
  .xp-bar-full {
    margin: 0 40px 0;
    background: var(--panel); border: 1px solid var(--border);
    padding: 20px 24px 20px;
    clip-path: polygon(0 0, 98% 0, 100% 8%, 100% 100%, 2% 100%, 0 92%);
    position: relative; overflow: hidden;
  }
  .xp-bar-full::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--xp-color, var(--accent)), transparent);
  }
  .xp-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px;
  }
  .xp-label {
    font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
    color: var(--accent); letter-spacing: 3px;
  }
  .xp-pct {
    font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 700;
    color: var(--xp-color, var(--accent));
    text-shadow: 0 0 12px var(--xp-color, var(--accent));
    transition: color 0.6s, text-shadow 0.6s;
  }
  .xp-track {
    height: 14px; background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 2px; overflow: hidden; position: relative; margin-bottom: 14px;
  }
  .xp-track-segments {
    position: absolute; inset: 0; display: flex;
    pointer-events: none; z-index: 2;
  }
  .xp-segment {
    flex: 1; border-right: 1px solid rgba(0,0,0,0.35);
  }
  .xp-segment:last-child { border-right: none; }
  .xp-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, var(--xp-start, #3a6aff), var(--xp-end, var(--accent)));
    box-shadow: 0 0 10px var(--xp-glow, rgba(0,170,255,0.6));
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                background 0.6s ease,
                box-shadow 0.6s ease;
    position: relative; z-index: 1;
  }
  .xp-fill::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    border-radius: 2px;
  }
  .xp-input-row {
    display: flex; align-items: center; gap: 10px;
  }
  .xp-input-label {
    font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
    color: var(--text-dim); letter-spacing: 1.5px; flex-shrink: 0;
  }
  .xp-stepper {
    display: flex; align-items: center; gap: 0;
  }
  .xp-step-btn {
    width: 30px; height: 34px; background: var(--bg3); border: 1px solid var(--border);
    color: var(--text-dim); font-family: 'Share Tech Mono', monospace;
    font-size: 1rem; cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    user-select: none;
  }
  .xp-step-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,170,255,0.08); }
  .xp-step-btn:active { transform: scale(0.92); }
  .xp-step-btn.minus { border-right: none; clip-path: polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 80%); }
  .xp-step-btn.plus  { border-left: none;  clip-path: polygon(0 0, 100% 0, 100% 80%, 85% 100%, 0 100%); }
  .xp-input {
    width: 60px; background: var(--bg); border: 1px solid var(--border);
    color: var(--text-bright); font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem; padding: 5px 6px; outline: none; text-align: center;
    transition: border-color 0.2s; height: 34px;
    -moz-appearance: textfield;
  }
  .xp-input::-webkit-outer-spin-button,
  .xp-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .xp-input:focus { border-color: var(--accent); box-shadow: 0 0 8px rgba(0,170,255,0.3); }
  .xp-total {
    font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: var(--text-dim);
  }
  .xp-manual-name {
    font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 0.85rem;
    color: var(--text-dim); letter-spacing: 1px; margin-bottom: 14px;
  }
  .xp-multi-wrap { display: flex; flex-direction: column; gap: 18px; }

  /* Slim bar — kit cards + vault cards */
  .xp-slim {
    margin-top: 12px;
  }
  .xp-slim-track {
    height: 6px; background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 1px; overflow: hidden; margin-bottom: 4px;
  }
  .xp-slim-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--xp-start, #3a6aff), var(--xp-end, var(--accent)));
    box-shadow: 0 0 6px var(--xp-glow, rgba(0,170,255,0.5));
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
    border-radius: 1px;
  }
  .xp-slim-label {
    display: flex; justify-content: space-between;
    font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
    color: var(--text-dim); letter-spacing: 1px;
  }
  .xp-slim-pct { color: var(--xp-color, var(--accent)); font-weight: 700; }

  @media (max-width: 640px) {
    .xp-bar-full { margin: 0 16px; clip-path: none; padding: 16px; }
  }

  /* VAULT PROGRESS BAR — now uses xp-slim, kept for backward compat */
  .vault-card-progress { margin-top: 10px; }
  .vault-progress-bar-wrap { display: none; }
  .vault-progress-bar-fill { display: none; }
  .vault-progress-label { display: none; }
  .vault-progress-pct { display: none; }

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
    .pdf-dropdown.open { max-height: 650px; }

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
  // ── ENTRY GRADE (EG) ──────────────────────────────────
  { id:1, grade:"EG", scale:"1/144", name:"Action Base 1 Black", series:"", imageUrl:null,
    manuals:[{id:1,name:"Assembly",lang:"JP",size:"",url:"eg-unk-action-base-1-black-assembly.pdf"}] },
  { id:2, grade:"EG", scale:"1/144", name:"Gundam", series:"", imageUrl:null,
    manuals:[{id:2,name:"Assembly",lang:"JP",size:"",url:"eg-unk-gundam-assembly.pdf"}] },
  { id:3, grade:"EG", scale:"1/144", name:"Gundam (entry Grade)", series:"", imageUrl:null,
    manuals:[{id:3,name:"Assembly",lang:"JP",size:"",url:"eg-unk-gundam-entry-grade-assembly.pdf"}] },
  { id:4, grade:"EG", scale:"1/144", name:"Rx-78-2 Gundam (entry Grade VER.)", series:"", imageUrl:null,
    manuals:[{id:4,name:"Assembly",lang:"JP",size:"",url:"eg-unk-rx-78-2-gundam-entry-grade-ver-assembly.pdf"}] },
  { id:5, grade:"EG", scale:"1/144", name:"Rx-78-2 Gundam (wolf Weapon Set)", series:"", imageUrl:null,
    manuals:[{id:5,name:"Assembly",lang:"JP",size:"",url:"eg-unk-rx-78-2-gundam-wolf-weapon-set-assembly.pdf"}] },
  { id:6, grade:"EG", scale:"1/144", name:"Rx78-2 Gundam", series:"", imageUrl:null,
    manuals:[{id:6,name:"Assembly",lang:"JP",size:"",url:"eg-unk-rx78-2-gundam-assembly.pdf"}] },
  { id:7, grade:"EG", scale:"1/144", name:"Strike Gundam", series:"", imageUrl:null,
    manuals:[{id:7,name:"Assembly",lang:"JP",size:"",url:"eg-unk-strike-gundam-assembly.pdf"}] },
  { id:8, grade:"EG", scale:"1/144", name:"Strike Gundam", series:"", imageUrl:null,
    manuals:[{id:8,name:"Assembly",lang:"JP",size:"",url:"eg-unk-strike-gundam-assembly.pdf"}] },
  { id:9, grade:"EG", scale:"1/144", name:"Strike Gundam (seed Package VER.)", series:"", imageUrl:null,
    manuals:[{id:9,name:"Assembly",lang:"JP",size:"",url:"eg-unk-strike-gundam-seed-package-ver-assembly.pdf"}] },

  // ── HIGH GRADE (HG) ───────────────────────────────────
  { id:10, grade:"HG", scale:"1/144", name:"1.5 Gundam", series:"", imageUrl:null,
    manuals:[{id:10,name:"Assembly",lang:"JP",size:"",url:"hg-144-1-5-gundam-assembly.pdf"}] },
  { id:11, grade:"HG", scale:"1/144", name:"Abyss Gundam", series:"", imageUrl:null,
    manuals:[{id:11,name:"Assembly",lang:"JP",size:"",url:"hg-144-abyss-gundam-assembly.pdf"}] },
  { id:12, grade:"HG", scale:"1/144", name:"Action Base 2 Black", series:"", imageUrl:null,
    manuals:[{id:12,name:"Assembly",lang:"JP",size:"",url:"hg-144-action-base-2-black-assembly.pdf"}] },
  { id:13, grade:"HG", scale:"1/144", name:"Action Base Mini", series:"", imageUrl:null,
    manuals:[{id:13,name:"Assembly",lang:"JP",size:"",url:"hg-144-action-base-mini-assembly.pdf"}] },
  { id:14, grade:"HG", scale:"1/144", name:"Action Base Ⅱ Black", series:"", imageUrl:null,
    manuals:[{id:14,name:"Assembly",lang:"JP",size:"",url:"hg-144-action-base-black-assembly.pdf"}] },
  { id:15, grade:"HG", scale:"1/144", name:"Actionbase 6 (clear Color)", series:"", imageUrl:null,
    manuals:[{id:15,name:"Assembly",lang:"JP",size:"",url:"hg-144-actionbase-6-clear-color-assembly.pdf"}] },
  { id:16, grade:"HG", scale:"1/144", name:"Aegis Gundam", series:"", imageUrl:null,
    manuals:[{id:16,name:"Assembly",lang:"JP",size:"",url:"hg-144-aegis-gundam-assembly.pdf"}] },
  { id:17, grade:"HG", scale:"1/144", name:"Aegis Gundam", series:"", imageUrl:null,
    manuals:[{id:17,name:"Assembly",lang:"JP",size:"",url:"hg-144-aegis-gundam-assembly.pdf"}] },
  { id:18, grade:"HG", scale:"1/144", name:"Al Saachez\'s Aeu Enact Custom", series:"", imageUrl:null,
    manuals:[{id:18,name:"Assembly",lang:"JP",size:"",url:"hg-144-al-saachez-s-aeu-enact-custom-assembly.pdf"}] },
  { id:19, grade:"HG", scale:"1/144", name:"Amazing Booster Zaku Amazing Support Unit", series:"", imageUrl:null,
    manuals:[{id:19,name:"Assembly",lang:"JP",size:"",url:"hg-144-amazing-booster-zaku-amazing-support-unit-assembly.pdf"}] },
  { id:20, grade:"HG", scale:"1/144", name:"Amazing Strike Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:20,name:"Assembly",lang:"JP",size:"",url:"hg-144-amazing-strike-freedom-gundam-assembly.pdf"}] },
  { id:21, grade:"HG", scale:"1/144", name:"Amazing Weapon Binder Build Fighters Support Weapon", series:"", imageUrl:null,
    manuals:[{id:21,name:"Assembly",lang:"JP",size:"",url:"hg-144-amazing-weapon-binder-build-fighters-support-weapon-assembly.pdf"}] },
  { id:22, grade:"HG", scale:"1/144", name:"Amida\'s Macuren", series:"", imageUrl:null,
    manuals:[{id:22,name:"Assembly",lang:"JP",size:"",url:"hg-144-amida-s-macuren-assembly.pdf"}] },
  { id:23, grade:"HG", scale:"1/144", name:"Ams-119 Geara Doga Neo Zeon Mass Productive Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:23,name:"Assembly",lang:"JP",size:"",url:"hg-144-ams-119-geara-doga-neo-zeon-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:24, grade:"HG", scale:"1/144", name:"Ams-129 Geara Zulu (angelo Sauper Use)", series:"", imageUrl:null,
    manuals:[{id:24,name:"Assembly",lang:"JP",size:"",url:"hg-144-ams-129-geara-zulu-angelo-sauper-use-assembly.pdf"}] },
  { id:25, grade:"HG", scale:"1/144", name:"Ams-129 Geara Zulu (guards Type)", series:"", imageUrl:null,
    manuals:[{id:25,name:"Assembly",lang:"JP",size:"",url:"hg-144-ams-129-geara-zulu-guards-type-assembly.pdf"}] },
  { id:26, grade:"HG", scale:"1/144", name:"Ams-129 Geara Zulu Neo Zeon Mass-productive Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:26,name:"Assembly",lang:"JP",size:"",url:"hg-144-ams-129-geara-zulu-neo-zeon-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:27, grade:"HG", scale:"1/144", name:"Ams-129m Zee Zulu (neo Zeon Mass-produced Amphibious Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:27,name:"Assembly",lang:"JP",size:"",url:"hg-144-ams-129m-zee-zulu-neo-zeon-mass-produced-amphibious-mobile-suit-assembly.pdf"}] },
  { id:28, grade:"HG", scale:"1/144", name:"Amx-002 Neue Ziel", series:"", imageUrl:null,
    manuals:[{id:28,name:"Assembly",lang:"JP",size:"",url:"hg-144-amx-002-neue-ziel-assembly.pdf"}] },
  { id:29, grade:"HG", scale:"1/144", name:"Amx-003 Gaza C Axis Mass Productive Transformable Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:29,name:"Assembly",lang:"JP",size:"",url:"hg-144-amx-003-gaza-c-axis-mass-productive-transformable-mobile-suit-assembly.pdf"}] },
  { id:30, grade:"HG", scale:"1/144", name:"Amx-003 Gaza C Axis Mass Productive Transformable Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:30,name:"Assembly",lang:"JP",size:"",url:"hg-144-amx-003-gaza-c-axis-mass-productive-transformable-mobile-suit-assembly.pdf"}] },
  { id:31, grade:"HG", scale:"1/144", name:"Amx-009 Dreissen (unicorn VER.)", series:"", imageUrl:null,
    manuals:[{id:31,name:"Assembly",lang:"JP",size:"",url:"hg-144-amx-009-dreissen-unicorn-ver-assembly.pdf"}] },
  { id:32, grade:"HG", scale:"1/144", name:"Amx-014 Döven Wolf Neo Zeon Quasi Psycommu Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:32,name:"Assembly",lang:"JP",size:"",url:"hg-144-amx-014-d-ven-wolf-neo-zeon-quasi-psycommu-mobile-suit-assembly.pdf"}] },
  { id:33, grade:"HG", scale:"1/144", name:"Ballden Arm Arms (build Fighters Support Unit)", series:"", imageUrl:null,
    manuals:[{id:33,name:"Assembly",lang:"JP",size:"",url:"hg-144-ballden-arm-arms-build-fighters-support-unit-assembly.pdf"}] },
  { id:34, grade:"HG", scale:"1/144", name:"Beargguy (plaretti)", series:"", imageUrl:null,
    manuals:[{id:34,name:"Assembly",lang:"JP",size:"",url:"hg-144-beargguy-plaretti-assembly.pdf"}] },
  { id:35, grade:"HG", scale:"1/144", name:"Big Gun Gundam Thunderbolt VER.", series:"", imageUrl:null,
    manuals:[{id:35,name:"Assembly",lang:"JP",size:"",url:"hg-144-big-gun-gundam-thunderbolt-ver-assembly.pdf"}] },
  { id:36, grade:"HG", scale:"1/144", name:"Binder Gun Build Divers Support Weapon", series:"", imageUrl:null,
    manuals:[{id:36,name:"Assembly",lang:"JP",size:"",url:"hg-144-binder-gun-build-divers-support-weapon-assembly.pdf"}] },
  { id:37, grade:"HG", scale:"1/144", name:"Blast Impulse Gundam", series:"", imageUrl:null,
    manuals:[{id:37,name:"Assembly",lang:"JP",size:"",url:"hg-144-blast-impulse-gundam-assembly.pdf"}] },
  { id:38, grade:"HG", scale:"1/144", name:"Blaze Zaku Phantom", series:"", imageUrl:null,
    manuals:[{id:38,name:"Assembly",lang:"JP",size:"",url:"hg-144-blaze-zaku-phantom-assembly.pdf"}] },
  { id:39, grade:"HG", scale:"1/144", name:"Blaze Zaku Phantom", series:"", imageUrl:null,
    manuals:[{id:39,name:"Assembly",lang:"JP",size:"",url:"hg-144-blaze-zaku-phantom-assembly.pdf"}] },
  { id:40, grade:"HG", scale:"1/144", name:"Blaze Zaku Phantom (ray\'s Barrel Custom)", series:"", imageUrl:null,
    manuals:[{id:40,name:"Assembly",lang:"JP",size:"",url:"hg-144-blaze-zaku-phantom-ray-s-barrel-custom-assembly.pdf"}] },
  { id:41, grade:"HG", scale:"1/144", name:"Blitz Gundam", series:"", imageUrl:null,
    manuals:[{id:41,name:"Assembly",lang:"JP",size:"",url:"hg-144-blitz-gundam-assembly.pdf"}] },
  { id:42, grade:"HG", scale:"1/144", name:"Blu Duel Gundam", series:"", imageUrl:null,
    manuals:[{id:42,name:"Assembly",lang:"JP",size:"",url:"hg-144-blu-duel-gundam-assembly.pdf"}] },
  { id:43, grade:"HG", scale:"1/144", name:"Build Booster Mk-ii Build Gundam Mk-ii Support Unit", series:"", imageUrl:null,
    manuals:[{id:43,name:"Assembly",lang:"JP",size:"",url:"hg-144-build-booster-mk-ii-build-gundam-mk-ii-support-unit-assembly.pdf"}] },
  { id:44, grade:"HG", scale:"1/144", name:"Build Custom GP Base Gunpla Display Base", series:"", imageUrl:null,
    manuals:[{id:44,name:"Assembly",lang:"JP",size:"",url:"hg-144-build-custom-gp-base-gunpla-display-base-assembly.pdf"}] },
  { id:45, grade:"HG", scale:"1/144", name:"Build Gundam Mk-ii (build Fighter Set Jori Custom Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:45,name:"Assembly",lang:"JP",size:"",url:"hg-144-build-gundam-mk-ii-build-fighter-set-jori-custom-mobile-suit-assembly.pdf"}] },
  { id:46, grade:"HG", scale:"1/144", name:"Build Hands Edge (s.m.l)", series:"", imageUrl:null,
    manuals:[{id:46,name:"Assembly",lang:"JP",size:"",url:"hg-144-build-hands-edge-s-m-l-assembly.pdf"}] },
  { id:47, grade:"HG", scale:"1/144", name:"Build Hands Round (s.m.l)", series:"", imageUrl:null,
    manuals:[{id:47,name:"Assembly",lang:"JP",size:"",url:"hg-144-build-hands-round-s-m-l-assembly.pdf"}] },
  { id:48, grade:"HG", scale:"1/144", name:"Build Strike Exia Gundam", series:"", imageUrl:null,
    manuals:[{id:48,name:"Assembly",lang:"JP",size:"",url:"hg-144-build-strike-exia-gundam-assembly.pdf"}] },
  { id:49, grade:"HG", scale:"1/144", name:"Build Strike Galaxy Cosmos", series:"", imageUrl:null,
    manuals:[{id:49,name:"Assembly",lang:"JP",size:"",url:"hg-144-build-strike-galaxy-cosmos-assembly.pdf"}] },
  { id:50, grade:"HG", scale:"1/144", name:"Build Strike Gundam Full Package", series:"", imageUrl:null,
    manuals:[{id:50,name:"Assembly",lang:"JP",size:"",url:"hg-144-build-strike-gundam-full-package-assembly.pdf"}] },
  { id:51, grade:"HG", scale:"1/144", name:"Buster Gundam", series:"", imageUrl:null,
    manuals:[{id:51,name:"Assembly",lang:"JP",size:"",url:"hg-144-buster-gundam-assembly.pdf"}] },
  { id:52, grade:"HG", scale:"1/144", name:"Buster Gundam (gat-x103 Buster Gundam)", series:"", imageUrl:null,
    manuals:[{id:52,name:"Assembly",lang:"JP",size:"",url:"hg-144-buster-gundam-gat-x103-buster-gundam-assembly.pdf"}] },
  { id:53, grade:"HG", scale:"1/144", name:"Calamity Gundam", series:"", imageUrl:null,
    manuals:[{id:53,name:"Assembly",lang:"JP",size:"",url:"hg-144-calamity-gundam-assembly.pdf"}] },
  { id:54, grade:"HG", scale:"1/144", name:"Calamity Gundam", series:"", imageUrl:null,
    manuals:[{id:54,name:"Assembly",lang:"JP",size:"",url:"hg-144-calamity-gundam-assembly.pdf"}] },
  { id:55, grade:"HG", scale:"1/144", name:"Changeling Rifle", series:"", imageUrl:null,
    manuals:[{id:55,name:"Assembly",lang:"JP",size:"",url:"hg-144-changeling-rifle-assembly.pdf"}] },
  { id:56, grade:"HG", scale:"1/144", name:"Chaos Gundam", series:"", imageUrl:null,
    manuals:[{id:56,name:"Assembly",lang:"JP",size:"",url:"hg-144-chaos-gundam-assembly.pdf"}] },
  { id:57, grade:"HG", scale:"1/144", name:"Chaos Gundam", series:"", imageUrl:null,
    manuals:[{id:57,name:"Assembly",lang:"JP",size:"",url:"hg-144-chaos-gundam-assembly.pdf"}] },
  { id:58, grade:"HG", scale:"1/144", name:"Cherudim Gundam Saga Type Gbf Inspection Model", series:"", imageUrl:null,
    manuals:[{id:58,name:"Assembly",lang:"JP",size:"",url:"hg-144-cherudim-gundam-saga-type-gbf-inspection-model-assembly.pdf"}] },
  { id:59, grade:"HG", scale:"1/144", name:"Cheruydim Gundam Gnh-w/r", series:"", imageUrl:null,
    manuals:[{id:59,name:"Assembly",lang:"JP",size:"",url:"hg-144-cheruydim-gundam-gnh-w-r-assembly.pdf"}] },
  { id:60, grade:"HG", scale:"1/144", name:"Chimasguy", series:"", imageUrl:null,
    manuals:[{id:60,name:"Assembly",lang:"JP",size:"",url:"hg-144-chimasguy-assembly.pdf"}] },
  { id:61, grade:"HG", scale:"1/144", name:"Civilian Astray Dssd Custom", series:"", imageUrl:null,
    manuals:[{id:61,name:"Assembly",lang:"JP",size:"",url:"hg-144-civilian-astray-dssd-custom-assembly.pdf"}] },
  { id:62, grade:"HG", scale:"1/144", name:"D-50c Loto Twin Set E.f.s.f. Special Operations Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:62,name:"Assembly",lang:"JP",size:"",url:"hg-144-d-50c-loto-twin-set-e-f-s-f-special-operations-mobile-suit-assembly.pdf"}] },
  { id:63, grade:"HG", scale:"1/144", name:"Dahack", series:"", imageUrl:null,
    manuals:[{id:63,name:"Assembly",lang:"JP",size:"",url:"hg-144-dahack-assembly.pdf"}] },
  { id:64, grade:"HG", scale:"1/144", name:"Dark Matter Booster Gundam Exia Dark Matter Support Unit", series:"", imageUrl:null,
    manuals:[{id:64,name:"Assembly",lang:"JP",size:"",url:"hg-144-dark-matter-booster-gundam-exia-dark-matter-support-unit-assembly.pdf"}] },
  { id:65, grade:"HG", scale:"1/144", name:"Denial Gundam", series:"", imageUrl:null,
    manuals:[{id:65,name:"Assembly",lang:"JP",size:"",url:"hg-144-denial-gundam-assembly.pdf"}] },
  { id:66, grade:"HG", scale:"1/144", name:"Destiny Gundam", series:"", imageUrl:null,
    manuals:[{id:66,name:"Assembly",lang:"JP",size:"",url:"hg-144-destiny-gundam-assembly.pdf"}] },
  { id:67, grade:"HG", scale:"1/144", name:"Diver Ace Unit", series:"", imageUrl:null,
    manuals:[{id:67,name:"Assembly",lang:"JP",size:"",url:"hg-144-diver-ace-unit-assembly.pdf"}] },
  { id:68, grade:"HG", scale:"1/144", name:"Diver Ayame", series:"", imageUrl:null,
    manuals:[{id:68,name:"Assembly",lang:"JP",size:"",url:"hg-144-diver-ayame-assembly.pdf"}] },
  { id:69, grade:"HG", scale:"1/144", name:"Diver Gear Gunpla Display Base", series:"", imageUrl:null,
    manuals:[{id:69,name:"Assembly",lang:"JP",size:"",url:"hg-144-diver-gear-gunpla-display-base-assembly.pdf"}] },
  { id:70, grade:"HG", scale:"1/144", name:"Dom R35", series:"", imageUrl:null,
    manuals:[{id:70,name:"Assembly",lang:"JP",size:"",url:"hg-144-dom-r35-assembly.pdf"}] },
  { id:71, grade:"HG", scale:"1/144", name:"Dreadnought Gundam", series:"", imageUrl:null,
    manuals:[{id:71,name:"Assembly",lang:"JP",size:"",url:"hg-144-dreadnought-gundam-assembly.pdf"}] },
  { id:72, grade:"HG", scale:"1/144", name:"Dualey Papillon Build Fighter Ails Eyetalker Custom Made Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:72,name:"Assembly",lang:"JP",size:"",url:"hg-144-dualey-papillon-build-fighter-ails-eyetalker-custom-made-mobile-suit-assembly.pdf"}] },
  { id:73, grade:"HG", scale:"1/144", name:"Duel Gundam Assaulthroud", series:"", imageUrl:null,
    manuals:[{id:73,name:"Assembly",lang:"JP",size:"",url:"hg-144-duel-gundam-assaulthroud-assembly.pdf"}] },
  { id:74, grade:"HG", scale:"1/144", name:"Elf Bullock (masc Exclusive)", series:"", imageUrl:null,
    manuals:[{id:74,name:"Assembly",lang:"JP",size:"",url:"hg-144-elf-bullock-masc-exclusive-assembly.pdf"}] },
  { id:75, grade:"HG", scale:"1/144", name:"F91 Funoichihai", series:"", imageUrl:null,
    manuals:[{id:75,name:"Assembly",lang:"JP",size:"",url:"hg-144-f91-funoichihai-assembly.pdf"}] },
  { id:76, grade:"HG", scale:"1/144", name:"Fa-78 Full Armor Gundam", series:"", imageUrl:null,
    manuals:[{id:76,name:"Assembly",lang:"JP",size:"",url:"hg-144-fa-78-full-armor-gundam-assembly.pdf"}] },
  { id:77, grade:"HG", scale:"1/144", name:"Fa-78-3 Fullarmor Gundam 7th (e.f.s.f. Prototype Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:77,name:"Assembly",lang:"JP",size:"",url:"hg-144-fa-78-3-fullarmor-gundam-7th-e-f-s-f-prototype-mobile-suit-assembly.pdf"}] },
  { id:78, grade:"HG", scale:"1/144", name:"Fd-03-00 Gustav Karl Type-00", series:"", imageUrl:null,
    manuals:[{id:78,name:"Assembly",lang:"JP",size:"",url:"hg-144-fd-03-00-gustav-karl-type-00-assembly.pdf"}] },
  { id:79, grade:"HG", scale:"1/144", name:"Fe-b0", series:"", imageUrl:null,
    manuals:[{id:79,name:"Assembly",lang:"JP",size:"",url:"hg-144-fe-b0-assembly.pdf"}] },
  { id:80, grade:"HG", scale:"1/144", name:"Forbidden Gundam", series:"", imageUrl:null,
    manuals:[{id:80,name:"Assembly",lang:"JP",size:"",url:"hg-144-forbidden-gundam-assembly.pdf"}] },
  { id:81, grade:"HG", scale:"1/144", name:"Forbidden Gundam", series:"", imageUrl:null,
    manuals:[{id:81,name:"Assembly",lang:"JP",size:"",url:"hg-144-forbidden-gundam-assembly.pdf"}] },
  { id:82, grade:"HG", scale:"1/144", name:"Force Impulse Gundam", series:"", imageUrl:null,
    manuals:[{id:82,name:"Assembly",lang:"JP",size:"",url:"hg-144-force-impulse-gundam-assembly.pdf"}] },
  { id:83, grade:"HG", scale:"1/144", name:"Force Impulse Gundam +sword Silhouette (extra Finish Version)", series:"", imageUrl:null,
    manuals:[{id:83,name:"Assembly",lang:"JP",size:"",url:"hg-144-force-impulse-gundam-sword-silhouette-extra-finish-version-assembly.pdf"}] },
  { id:84, grade:"HG", scale:"1/144", name:"Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:84,name:"Assembly",lang:"JP",size:"",url:"hg-144-freedom-gundam-assembly.pdf"}] },
  { id:85, grade:"HG", scale:"1/144", name:"Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:85,name:"Assembly",lang:"JP",size:"",url:"hg-144-freedom-gundam-assembly.pdf"}] },
  { id:86, grade:"HG", scale:"1/144", name:"G-bouncer (wms-gb5)", series:"", imageUrl:null,
    manuals:[{id:86,name:"Assembly",lang:"JP",size:"",url:"hg-144-g-bouncer-wms-gb5-assembly.pdf"}] },
  { id:87, grade:"HG", scale:"1/144", name:"Gaeon", series:"", imageUrl:null,
    manuals:[{id:87,name:"Assembly",lang:"JP",size:"",url:"hg-144-gaeon-assembly.pdf"}] },
  { id:88, grade:"HG", scale:"1/144", name:"Gaia Gundam", series:"", imageUrl:null,
    manuals:[{id:88,name:"Assembly",lang:"JP",size:"",url:"hg-144-gaia-gundam-assembly.pdf"}] },
  { id:89, grade:"HG", scale:"1/144", name:"Galbaldy Rebake", series:"", imageUrl:null,
    manuals:[{id:89,name:"Assembly",lang:"JP",size:"",url:"hg-144-galbaldy-rebake-assembly.pdf"}] },
  { id:90, grade:"HG", scale:"1/144", name:"Gat-o2l2 Dagger L", series:"", imageUrl:null,
    manuals:[{id:90,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-o2l2-dagger-l-assembly.pdf"}] },
  { id:91, grade:"HG", scale:"1/144", name:"Gat-x102 Duel Gundam Assaultshroud", series:"", imageUrl:null,
    manuals:[{id:91,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-x102-duel-gundam-assaultshroud-assembly.pdf"}] },
  { id:92, grade:"HG", scale:"1/144", name:"Gat-x103 Buster Gundam", series:"", imageUrl:null,
    manuals:[{id:92,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-x103-buster-gundam-assembly.pdf"}] },
  { id:93, grade:"HG", scale:"1/144", name:"Gat-x105 Aile Strike Gundam", series:"", imageUrl:null,
    manuals:[{id:93,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-x105-aile-strike-gundam-assembly.pdf"}] },
  { id:94, grade:"HG", scale:"1/144", name:"Gat-x105 Launcher Strike Gundam", series:"", imageUrl:null,
    manuals:[{id:94,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-x105-launcher-strike-gundam-assembly.pdf"}] },
  { id:95, grade:"HG", scale:"1/144", name:"Gat-x105 Sword Strike Gundam", series:"", imageUrl:null,
    manuals:[{id:95,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-x105-sword-strike-gundam-assembly.pdf"}] },
  { id:96, grade:"HG", scale:"1/144", name:"Gat-x131 Calamity Gundam", series:"", imageUrl:null,
    manuals:[{id:96,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-x131-calamity-gundam-assembly.pdf"}] },
  { id:97, grade:"HG", scale:"1/144", name:"Gat-x207 Blitz Gundam", series:"", imageUrl:null,
    manuals:[{id:97,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-x207-blitz-gundam-assembly.pdf"}] },
  { id:98, grade:"HG", scale:"1/144", name:"Gat-x252 Forbidden Gundam", series:"", imageUrl:null,
    manuals:[{id:98,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-x252-forbidden-gundam-assembly.pdf"}] },
  { id:99, grade:"HG", scale:"1/144", name:"Gat-x303 Aegis Gundam", series:"", imageUrl:null,
    manuals:[{id:99,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-x303-aegis-gundam-assembly.pdf"}] },
  { id:100, grade:"HG", scale:"1/144", name:"Gat-x370 Raider Gundam", series:"", imageUrl:null,
    manuals:[{id:100,name:"Assembly",lang:"JP",size:"",url:"hg-144-gat-x370-raider-gundam-assembly.pdf"}] },
  { id:101, grade:"HG", scale:"1/144", name:"Gbn-guard Frame", series:"", imageUrl:null,
    manuals:[{id:101,name:"Assembly",lang:"JP",size:"",url:"hg-144-gbn-guard-frame-assembly.pdf"}] },
  { id:102, grade:"HG", scale:"1/144", name:"Gearh Ghirarga", series:"", imageUrl:null,
    manuals:[{id:102,name:"Assembly",lang:"JP",size:"",url:"hg-144-gearh-ghirarga-assembly.pdf"}] },
  { id:103, grade:"HG", scale:"1/144", name:"Geirail", series:"", imageUrl:null,
    manuals:[{id:103,name:"Assembly",lang:"JP",size:"",url:"hg-144-geirail-assembly.pdf"}] },
  { id:104, grade:"HG", scale:"1/144", name:"Genoace (rge-b790)", series:"", imageUrl:null,
    manuals:[{id:104,name:"Assembly",lang:"JP",size:"",url:"hg-144-genoace-rge-b790-assembly.pdf"}] },
  { id:105, grade:"HG", scale:"1/144", name:"Gf13-017njii G Gundam Neo Japan Mobile Fighter", series:"", imageUrl:null,
    manuals:[{id:105,name:"Assembly",lang:"JP",size:"",url:"hg-144-gf13-017njii-g-gundam-neo-japan-mobile-fighter-assembly.pdf"}] },
  { id:106, grade:"HG", scale:"1/144", name:"Giant Gatling Build Fighters Support Weapon", series:"", imageUrl:null,
    manuals:[{id:106,name:"Assembly",lang:"JP",size:"",url:"hg-144-giant-gatling-build-fighters-support-weapon-assembly.pdf"}] },
  { id:107, grade:"HG", scale:"1/144", name:"Glaive Dain", series:"", imageUrl:null,
    manuals:[{id:107,name:"Assembly",lang:"JP",size:"",url:"hg-144-glaive-dain-assembly.pdf"}] },
  { id:108, grade:"HG", scale:"1/144", name:"Gm Sniper K9", series:"", imageUrl:null,
    manuals:[{id:108,name:"Assembly",lang:"JP",size:"",url:"hg-144-gm-sniper-k9-assembly.pdf"}] },
  { id:109, grade:"HG", scale:"1/144", name:"Gn Archer", series:"", imageUrl:null,
    manuals:[{id:109,name:"Assembly",lang:"JP",size:"",url:"hg-144-gn-archer-assembly.pdf"}] },
  { id:110, grade:"HG", scale:"1/144", name:"Gn-0000+gnr-010 Oo Raiser (double O Raiser)", series:"", imageUrl:null,
    manuals:[{id:110,name:"Assembly",lang:"JP",size:"",url:"hg-144-gn-0000-gnr-010-oo-raiser-double-o-raiser-assembly.pdf"}] },
  { id:111, grade:"HG", scale:"1/144", name:"Gn-006 Cherudim Gundam", series:"", imageUrl:null,
    manuals:[{id:111,name:"Assembly",lang:"JP",size:"",url:"hg-144-gn-006-cherudim-gundam-assembly.pdf"}] },
  { id:112, grade:"HG", scale:"1/144", name:"Gnx-y901tw Susanowo (trans-am Mode)", series:"", imageUrl:null,
    manuals:[{id:112,name:"Assembly",lang:"JP",size:"",url:"hg-144-gnx-y901tw-susanowo-trans-am-mode-assembly.pdf"}] },
  { id:113, grade:"HG", scale:"1/144", name:"Gnz-005 Garazzo", series:"", imageUrl:null,
    manuals:[{id:113,name:"Assembly",lang:"JP",size:"",url:"hg-144-gnz-005-garazzo-assembly.pdf"}] },
  { id:114, grade:"HG", scale:"1/144", name:"Gouf Hugo", series:"", imageUrl:null,
    manuals:[{id:114,name:"Assembly",lang:"JP",size:"",url:"hg-144-gouf-hugo-assembly.pdf"}] },
  { id:115, grade:"HG", scale:"1/144", name:"Graze (standard Type/commander Type)", series:"", imageUrl:null,
    manuals:[{id:115,name:"Assembly",lang:"JP",size:"",url:"hg-144-graze-standard-type-commander-type-assembly.pdf"}] },
  { id:116, grade:"HG", scale:"1/144", name:"Graze Custom", series:"", imageUrl:null,
    manuals:[{id:116,name:"Assembly",lang:"JP",size:"",url:"hg-144-graze-custom-assembly.pdf"}] },
  { id:117, grade:"HG", scale:"1/144", name:"Graze Ritter (calta Machine)", series:"", imageUrl:null,
    manuals:[{id:117,name:"Assembly",lang:"JP",size:"",url:"hg-144-graze-ritter-calta-machine-assembly.pdf"}] },
  { id:118, grade:"HG", scale:"1/144", name:"Grimbgerde", series:"", imageUrl:null,
    manuals:[{id:118,name:"Assembly",lang:"JP",size:"",url:"hg-144-grimbgerde-assembly.pdf"}] },
  { id:119, grade:"HG", scale:"1/144", name:"Gunblaster Starter Set Vol.2", series:"", imageUrl:null,
    manuals:[{id:119,name:"Assembly",lang:"JP",size:"",url:"hg-144-gunblaster-starter-set-vol-2-assembly.pdf"}] },
  { id:120, grade:"HG", scale:"1/144", name:"Gundam", series:"", imageUrl:null,
    manuals:[{id:120,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-assembly.pdf"}] },
  { id:121, grade:"HG", scale:"1/144", name:"Gundam 00 Diver Ace", series:"", imageUrl:null,
    manuals:[{id:121,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-00-diver-ace-assembly.pdf"}] },
  { id:122, grade:"HG", scale:"1/144", name:"Gundam 00 Sky (higher Than Sky Phase)", series:"", imageUrl:null,
    manuals:[{id:122,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-00-sky-higher-than-sky-phase-assembly.pdf"}] },
  { id:123, grade:"HG", scale:"1/144", name:"Gundam 00 Sky Hws (trans-am Infinity Mode)", series:"", imageUrl:null,
    manuals:[{id:123,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-00-sky-hws-trans-am-infinity-mode-assembly.pdf"}] },
  { id:124, grade:"HG", scale:"1/144", name:"Gundam 00-67 Gundam Zabanya", series:"", imageUrl:null,
    manuals:[{id:124,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-00-67-gundam-zabanya-assembly.pdf"}] },
  { id:125, grade:"HG", scale:"1/144", name:"Gundam Age II Magnum Sv VER.", series:"", imageUrl:null,
    manuals:[{id:125,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-age-ii-magnum-sv-ver-assembly.pdf"}] },
  { id:126, grade:"HG", scale:"1/144", name:"Gundam Age-1 Spallow [age-1s]", series:"", imageUrl:null,
    manuals:[{id:126,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-age-1-spallow-age-1s-assembly.pdf"}] },
  { id:127, grade:"HG", scale:"1/144", name:"Gundam Age-2 Double Bullet [age-2db]", series:"", imageUrl:null,
    manuals:[{id:127,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-age-2-double-bullet-age-2db-assembly.pdf"}] },
  { id:128, grade:"HG", scale:"1/144", name:"Gundam Age-2 Normal (age-2)", series:"", imageUrl:null,
    manuals:[{id:128,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-age-2-normal-age-2-assembly.pdf"}] },
  { id:129, grade:"HG", scale:"1/144", name:"Gundam Ages II Magnum Kyoja Kujos Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:129,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-ages-ii-magnum-kyoja-kujos-mobile-suit-assembly.pdf"}] },
  { id:130, grade:"HG", scale:"1/144", name:"Gundam Astaroth", series:"", imageUrl:null,
    manuals:[{id:130,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astaroth-assembly.pdf"}] },
  { id:131, grade:"HG", scale:"1/144", name:"Gundam Astaroth Origin", series:"", imageUrl:null,
    manuals:[{id:131,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astaroth-origin-assembly.pdf"}] },
  { id:132, grade:"HG", scale:"1/144", name:"Gundam Astaroth Rinascimento", series:"", imageUrl:null,
    manuals:[{id:132,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astaroth-rinascimento-assembly.pdf"}] },
  { id:133, grade:"HG", scale:"1/144", name:"Gundam Astraea", series:"", imageUrl:null,
    manuals:[{id:133,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astraea-assembly.pdf"}] },
  { id:134, grade:"HG", scale:"1/144", name:"Gundam Astray Blue Frame", series:"", imageUrl:null,
    manuals:[{id:134,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astray-blue-frame-assembly.pdf"}] },
  { id:135, grade:"HG", scale:"1/144", name:"Gundam Astray Blue Frame Second L", series:"", imageUrl:null,
    manuals:[{id:135,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astray-blue-frame-second-l-assembly.pdf"}] },
  { id:136, grade:"HG", scale:"1/144", name:"Gundam Astray Green Frame", series:"", imageUrl:null,
    manuals:[{id:136,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astray-green-frame-assembly.pdf"}] },
  { id:137, grade:"HG", scale:"1/144", name:"Gundam Astray Mirage Frame", series:"", imageUrl:null,
    manuals:[{id:137,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astray-mirage-frame-assembly.pdf"}] },
  { id:138, grade:"HG", scale:"1/144", name:"Gundam Astray No-name", series:"", imageUrl:null,
    manuals:[{id:138,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astray-no-name-assembly.pdf"}] },
  { id:139, grade:"HG", scale:"1/144", name:"Gundam Astray Red Frame", series:"", imageUrl:null,
    manuals:[{id:139,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astray-red-frame-assembly.pdf"}] },
  { id:140, grade:"HG", scale:"1/144", name:"Gundam Astray Red Frame", series:"", imageUrl:null,
    manuals:[{id:140,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-astray-red-frame-assembly.pdf"}] },
  { id:141, grade:"HG", scale:"1/144", name:"Gundam Avalanche Exia", series:"", imageUrl:null,
    manuals:[{id:141,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-avalanche-exia-assembly.pdf"}] },
  { id:142, grade:"HG", scale:"1/144", name:"Gundam Barbatos", series:"", imageUrl:null,
    manuals:[{id:142,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-barbatos-assembly.pdf"}] },
  { id:143, grade:"HG", scale:"1/144", name:"Gundam Barbatos & Long Distance Transport Booster Kutan Type-iii", series:"", imageUrl:null,
    manuals:[{id:143,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-barbatos-long-distance-transport-booster-kutan-type-iii-assembly.pdf"}] },
  { id:144, grade:"HG", scale:"1/144", name:"Gundam Barbatos (standard Series)", series:"", imageUrl:null,
    manuals:[{id:144,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-barbatos-standard-series-assembly.pdf"}] },
  { id:145, grade:"HG", scale:"1/144", name:"Gundam Barbatos 6th Form", series:"", imageUrl:null,
    manuals:[{id:145,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-barbatos-6th-form-assembly.pdf"}] },
  { id:146, grade:"HG", scale:"1/144", name:"Gundam Barbatos Lupus", series:"", imageUrl:null,
    manuals:[{id:146,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-barbatos-lupus-assembly.pdf"}] },
  { id:147, grade:"HG", scale:"1/144", name:"Gundam Barbatos Lupus Rex", series:"", imageUrl:null,
    manuals:[{id:147,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-barbatos-lupus-rex-assembly.pdf"}] },
  { id:148, grade:"HG", scale:"1/144", name:"Gundam Barbatos Lupus Rex", series:"", imageUrl:null,
    manuals:[{id:148,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-barbatos-lupus-rex-assembly.pdf"}] },
  { id:149, grade:"HG", scale:"1/144", name:"Gundam Calibarn", series:"", imageUrl:null,
    manuals:[{id:149,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-calibarn-assembly.pdf"}] },
  { id:150, grade:"HG", scale:"1/144", name:"Gundam Dantalion", series:"", imageUrl:null,
    manuals:[{id:150,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-dantalion-assembly.pdf"}] },
  { id:151, grade:"HG", scale:"1/144", name:"Gundam Dark Phantom", series:"", imageUrl:null,
    manuals:[{id:151,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-dark-phantom-assembly.pdf"}] },
  { id:152, grade:"HG", scale:"1/144", name:"Gundam Exia Dark Matter", series:"", imageUrl:null,
    manuals:[{id:152,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-exia-dark-matter-assembly.pdf"}] },
  { id:153, grade:"HG", scale:"1/144", name:"Gundam Exia Voda", series:"", imageUrl:null,
    manuals:[{id:153,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-exia-voda-assembly.pdf"}] },
  { id:154, grade:"HG", scale:"1/144", name:"Gundam Flauros (fluorspar)", series:"", imageUrl:null,
    manuals:[{id:154,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-flauros-fluorspar-assembly.pdf"}] },
  { id:155, grade:"HG", scale:"1/144", name:"Gundam G-arcane", series:"", imageUrl:null,
    manuals:[{id:155,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-g-arcane-assembly.pdf"}] },
  { id:156, grade:"HG", scale:"1/144", name:"Gundam G-self", series:"", imageUrl:null,
    manuals:[{id:156,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-g-self-assembly.pdf"}] },
  { id:157, grade:"HG", scale:"1/144", name:"Gundam G-self Assault Pack", series:"", imageUrl:null,
    manuals:[{id:157,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-g-self-assault-pack-assembly.pdf"}] },
  { id:158, grade:"HG", scale:"1/144", name:"Gundam G40 (industrial Design VER.)", series:"", imageUrl:null,
    manuals:[{id:158,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-g40-industrial-design-ver-assembly.pdf"}] },
  { id:159, grade:"HG", scale:"1/144", name:"Gundam Gusion", series:"", imageUrl:null,
    manuals:[{id:159,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-gusion-assembly.pdf"}] },
  { id:160, grade:"HG", scale:"1/144", name:"Gundam Gusion Rebake", series:"", imageUrl:null,
    manuals:[{id:160,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-gusion-rebake-assembly.pdf"}] },
  { id:161, grade:"HG", scale:"1/144", name:"Gundam Ha Unicorn", series:"", imageUrl:null,
    manuals:[{id:161,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-ha-unicorn-assembly.pdf"}] },
  { id:162, grade:"HG", scale:"1/144", name:"Gundam Joan Altron", series:"", imageUrl:null,
    manuals:[{id:162,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-joan-altron-assembly.pdf"}] },
  { id:163, grade:"HG", scale:"1/144", name:"Gundam Kimaris", series:"", imageUrl:null,
    manuals:[{id:163,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-kimaris-assembly.pdf"}] },
  { id:164, grade:"HG", scale:"1/144", name:"Gundam Kimaris Trooper", series:"", imageUrl:null,
    manuals:[{id:164,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-kimaris-trooper-assembly.pdf"}] },
  { id:165, grade:"HG", scale:"1/144", name:"Gundam Leopard Da Vinci", series:"", imageUrl:null,
    manuals:[{id:165,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-leopard-da-vinci-assembly.pdf"}] },
  { id:166, grade:"HG", scale:"1/144", name:"Gundam Oo Shia Qanti", series:"", imageUrl:null,
    manuals:[{id:166,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-oo-shia-qanti-assembly.pdf"}] },
  { id:167, grade:"HG", scale:"1/144", name:"Gundam Operation V", series:"", imageUrl:null,
    manuals:[{id:167,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-operation-v-assembly.pdf"}] },
  { id:168, grade:"HG", scale:"1/144", name:"Gundam Schwarzette", series:"", imageUrl:null,
    manuals:[{id:168,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-schwarzette-assembly.pdf"}] },
  { id:169, grade:"HG", scale:"1/144", name:"Gundam Schwarzritter", series:"", imageUrl:null,
    manuals:[{id:169,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-schwarzritter-assembly.pdf"}] },
  { id:170, grade:"HG", scale:"1/144", name:"Gundam Shining Break", series:"", imageUrl:null,
    manuals:[{id:170,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-shining-break-assembly.pdf"}] },
  { id:171, grade:"HG", scale:"1/144", name:"Gundam Sumo (reraise Full City)", series:"", imageUrl:null,
    manuals:[{id:171,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-sumo-reraise-full-city-assembly.pdf"}] },
  { id:172, grade:"HG", scale:"1/144", name:"Gundam Tayon 3", series:"", imageUrl:null,
    manuals:[{id:172,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-tayon-3-assembly.pdf"}] },
  { id:173, grade:"HG", scale:"1/144", name:"Gundam The End", series:"", imageUrl:null,
    manuals:[{id:173,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-the-end-assembly.pdf"}] },
  { id:174, grade:"HG", scale:"1/144", name:"Gundam Vdar", series:"", imageUrl:null,
    manuals:[{id:174,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-vdar-assembly.pdf"}] },
  { id:175, grade:"HG", scale:"1/144", name:"Gundam Vidar", series:"", imageUrl:null,
    manuals:[{id:175,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-vidar-assembly.pdf"}] },
  { id:176, grade:"HG", scale:"1/144", name:"Gundam X Maoh (build Fighter Mag Yasaka Custom Made Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:176,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-x-maoh-build-fighter-mag-yasaka-custom-made-mobile-suit-assembly.pdf"}] },
  { id:177, grade:"HG", scale:"1/144", name:"Gundam Zerachiel (ain Sophia\'s Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:177,name:"Assembly",lang:"JP",size:"",url:"hg-144-gundam-zerachiel-ain-sophia-s-mobile-suit-assembly.pdf"}] },
  { id:178, grade:"HG", scale:"1/144", name:"Gunner Zaku Warrior", series:"", imageUrl:null,
    manuals:[{id:178,name:"Assembly",lang:"JP",size:"",url:"hg-144-gunner-zaku-warrior-assembly.pdf"}] },
  { id:179, grade:"HG", scale:"1/144", name:"Gunner Zaku Warrior", series:"", imageUrl:null,
    manuals:[{id:179,name:"Assembly",lang:"JP",size:"",url:"hg-144-gunner-zaku-warrior-assembly.pdf"}] },
  { id:180, grade:"HG", scale:"1/144", name:"Gunner Zaku Warrior (lusmaria Horn Equipped)", series:"", imageUrl:null,
    manuals:[{id:180,name:"Assembly",lang:"JP",size:"",url:"hg-144-gunner-zaku-warrior-lusmaria-horn-equipped-assembly.pdf"}] },
  { id:181, grade:"HG", scale:"1/144", name:"Gunpla Battle Arm Arms Build Fighters Support Weapon", series:"", imageUrl:null,
    manuals:[{id:181,name:"Assembly",lang:"JP",size:"",url:"hg-144-gunpla-battle-arm-arms-build-fighters-support-weapon-assembly.pdf"}] },
  { id:182, grade:"HG", scale:"1/144", name:"Gx-9900 Gundam X Satellite System Loading Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:182,name:"Assembly",lang:"JP",size:"",url:"hg-144-gx-9900-gundam-x-satellite-system-loading-mobile-suit-assembly.pdf"}] },
  { id:183, grade:"HG", scale:"1/144", name:"Gx-9900-dv Gundam X Divider (divider-equipped Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:183,name:"Assembly",lang:"JP",size:"",url:"hg-144-gx-9900-dv-gundam-x-divider-divider-equipped-mobile-suit-assembly.pdf"}] },
  { id:184, grade:"HG", scale:"1/144", name:"Gya Eastern Weapons", series:"", imageUrl:null,
    manuals:[{id:184,name:"Assembly",lang:"JP",size:"",url:"hg-144-gya-eastern-weapons-assembly.pdf"}] },
  { id:185, grade:"HG", scale:"1/144", name:"Gyanglot", series:"", imageUrl:null,
    manuals:[{id:185,name:"Assembly",lang:"JP",size:"",url:"hg-144-gyanglot-assembly.pdf"}] },
  { id:186, grade:"HG", scale:"1/144", name:"Haro", series:"", imageUrl:null,
    manuals:[{id:186,name:"Assembly",lang:"JP",size:"",url:"hg-144-haro-assembly.pdf"}] },
  { id:187, grade:"HG", scale:"1/144", name:"Helmsguide Enryuku", series:"", imageUrl:null,
    manuals:[{id:187,name:"Assembly",lang:"JP",size:"",url:"hg-144-helmsguide-enryuku-assembly.pdf"}] },
  { id:188, grade:"HG", scale:"1/144", name:"Hexua", series:"", imageUrl:null,
    manuals:[{id:188,name:"Assembly",lang:"JP",size:"",url:"hg-144-hexua-assembly.pdf"}] },
  { id:189, grade:"HG", scale:"1/144", name:"Hiyakuri (1/144 Scale Model)", series:"", imageUrl:null,
    manuals:[{id:189,name:"Assembly",lang:"JP",size:"",url:"hg-144-hiyakuri-1-144-scale-model-assembly.pdf"}] },
  { id:190, grade:"HG", scale:"1/144", name:"Hws & Sv Custom Weapon Set Build Divers Support Weapon", series:"", imageUrl:null,
    manuals:[{id:190,name:"Assembly",lang:"JP",size:"",url:"hg-144-hws-sv-custom-weapon-set-build-divers-support-weapon-assembly.pdf"}] },
  { id:191, grade:"HG", scale:"1/144", name:"Hyaku-shiki + \'mega Bazooka Launcher\' A.e.u.g. Attack Use Prototype Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:191,name:"Assembly",lang:"JP",size:"",url:"hg-144-hyaku-shiki-mega-bazooka-launcher-a-e-u-g-attack-use-prototype-mobile-suit-assembly.pdf"}] },
  { id:192, grade:"HG", scale:"1/144", name:"Hyakuren", series:"", imageUrl:null,
    manuals:[{id:192,name:"Assembly",lang:"JP",size:"",url:"hg-144-hyakuren-assembly.pdf"}] },
  { id:193, grade:"HG", scale:"1/144", name:"Hyper Gundam", series:"", imageUrl:null,
    manuals:[{id:193,name:"Assembly",lang:"JP",size:"",url:"hg-144-hyper-gundam-assembly.pdf"}] },
  { id:194, grade:"HG", scale:"1/144", name:"Hyper Gunpla Battle Weapons Build Fighters Support Weapon", series:"", imageUrl:null,
    manuals:[{id:194,name:"Assembly",lang:"JP",size:"",url:"hg-144-hyper-gunpla-battle-weapons-build-fighters-support-weapon-assembly.pdf"}] },
  { id:195, grade:"HG", scale:"1/144", name:"Impulse Gundam Arc", series:"", imageUrl:null,
    manuals:[{id:195,name:"Assembly",lang:"JP",size:"",url:"hg-144-impulse-gundam-arc-assembly.pdf"}] },
  { id:196, grade:"HG", scale:"1/144", name:"Impulse Gundam Lancier", series:"", imageUrl:null,
    manuals:[{id:196,name:"Assembly",lang:"JP",size:"",url:"hg-144-impulse-gundam-lancier-assembly.pdf"}] },
  { id:197, grade:"HG", scale:"1/144", name:"Jegan Blast Master Yuki\'s Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:197,name:"Assembly",lang:"JP",size:"",url:"hg-144-jegan-blast-master-yuki-s-mobile-suit-assembly.pdf"}] },
  { id:198, grade:"HG", scale:"1/144", name:"Jigen Build Knuckles \'kaku\'", series:"", imageUrl:null,
    manuals:[{id:198,name:"Assembly",lang:"JP",size:"",url:"hg-144-jigen-build-knuckles-kaku-assembly.pdf"}] },
  { id:199, grade:"HG", scale:"1/144", name:"Jigen Build Knuckles (round)", series:"", imageUrl:null,
    manuals:[{id:199,name:"Assembly",lang:"JP",size:"",url:"hg-144-jigen-build-knuckles-round-assembly.pdf"}] },
  { id:200, grade:"HG", scale:"1/144", name:"Julieta\'s Mobile Suginaze", series:"", imageUrl:null,
    manuals:[{id:200,name:"Assembly",lang:"JP",size:"",url:"hg-144-julieta-s-mobile-suginaze-assembly.pdf"}] },
  { id:201, grade:"HG", scale:"1/144", name:"Justice Gundam", series:"", imageUrl:null,
    manuals:[{id:201,name:"Assembly",lang:"JP",size:"",url:"hg-144-justice-gundam-assembly.pdf"}] },
  { id:202, grade:"HG", scale:"1/144", name:"Justice Gundam", series:"", imageUrl:null,
    manuals:[{id:202,name:"Assembly",lang:"JP",size:"",url:"hg-144-justice-gundam-assembly.pdf"}] },
  { id:203, grade:"HG", scale:"1/144", name:"K9 Dog Pack (gm Sniper K9 Support Unit)", series:"", imageUrl:null,
    manuals:[{id:203,name:"Assembly",lang:"JP",size:"",url:"hg-144-k9-dog-pack-gm-sniper-k9-support-unit-assembly.pdf"}] },
  { id:204, grade:"HG", scale:"1/144", name:"Kabakali", series:"", imageUrl:null,
    manuals:[{id:204,name:"Assembly",lang:"JP",size:"",url:"hg-144-kabakali-assembly.pdf"}] },
  { id:205, grade:"HG", scale:"1/144", name:"Kampfer Amazing", series:"", imageUrl:null,
    manuals:[{id:205,name:"Assembly",lang:"JP",size:"",url:"hg-144-kampfer-amazing-assembly.pdf"}] },
  { id:206, grade:"HG", scale:"1/144", name:"Launcher Strike Gundam", series:"", imageUrl:null,
    manuals:[{id:206,name:"Assembly",lang:"JP",size:"",url:"hg-144-launcher-strike-gundam-assembly.pdf"}] },
  { id:207, grade:"HG", scale:"1/144", name:"Leo Npd (new Player Diver\'s Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:207,name:"Assembly",lang:"JP",size:"",url:"hg-144-leo-npd-new-player-diver-s-mobile-suit-assembly.pdf"}] },
  { id:208, grade:"HG", scale:"1/144", name:"Lg-gat-x105 Gale Strike Gundam", series:"", imageUrl:null,
    manuals:[{id:208,name:"Assembly",lang:"JP",size:"",url:"hg-144-lg-gat-x105-gale-strike-gundam-assembly.pdf"}] },
  { id:209, grade:"HG", scale:"1/144", name:"Lh-gat-x103 Hail Buster Gundam", series:"", imageUrl:null,
    manuals:[{id:209,name:"Assembly",lang:"JP",size:"",url:"hg-144-lh-gat-x103-hail-buster-gundam-assembly.pdf"}] },
  { id:210, grade:"HG", scale:"1/144", name:"Lightning Back Weapon System Mk-iii", series:"", imageUrl:null,
    manuals:[{id:210,name:"Assembly",lang:"JP",size:"",url:"hg-144-lightning-back-weapon-system-mk-iii-assembly.pdf"}] },
  { id:211, grade:"HG", scale:"1/144", name:"Lightning Z Gundam", series:"", imageUrl:null,
    manuals:[{id:211,name:"Assembly",lang:"JP",size:"",url:"hg-144-lightning-z-gundam-assembly.pdf"}] },
  { id:212, grade:"HG", scale:"1/144", name:"Lr-gat-x102 Regen Duel Gundam", series:"", imageUrl:null,
    manuals:[{id:212,name:"Assembly",lang:"JP",size:"",url:"hg-144-lr-gat-x102-regen-duel-gundam-assembly.pdf"}] },
  { id:213, grade:"HG", scale:"1/144", name:"Lu-2gmf-x23s Dent Saviour Gundam", series:"", imageUrl:null,
    manuals:[{id:213,name:"Assembly",lang:"JP",size:"",url:"hg-144-lu-2gmf-x23s-dent-saviour-gundam-assembly.pdf"}] },
  { id:214, grade:"HG", scale:"1/144", name:"Lunagazer Gundam", series:"", imageUrl:null,
    manuals:[{id:214,name:"Assembly",lang:"JP",size:"",url:"hg-144-lunagazer-gundam-assembly.pdf"}] },
  { id:215, grade:"HG", scale:"1/144", name:"M1 Astray", series:"", imageUrl:null,
    manuals:[{id:215,name:"Assembly",lang:"JP",size:"",url:"hg-144-m1-astray-assembly.pdf"}] },
  { id:216, grade:"HG", scale:"1/144", name:"Ma-06 Val-walo", series:"", imageUrl:null,
    manuals:[{id:216,name:"Assembly",lang:"JP",size:"",url:"hg-144-ma-06-val-walo-assembly.pdf"}] },
  { id:217, grade:"HG", scale:"1/144", name:"Machine Rider Build Divers Support Mecha", series:"", imageUrl:null,
    manuals:[{id:217,name:"Assembly",lang:"JP",size:"",url:"hg-144-machine-rider-build-divers-support-mecha-assembly.pdf"}] },
  { id:218, grade:"HG", scale:"1/144", name:"Mack Knife", series:"", imageUrl:null,
    manuals:[{id:218,name:"Assembly",lang:"JP",size:"",url:"hg-144-mack-knife-assembly.pdf"}] },
  { id:219, grade:"HG", scale:"1/144", name:"Matsuri Weapon Build Fighters Support Weapon", series:"", imageUrl:null,
    manuals:[{id:219,name:"Assembly",lang:"JP",size:"",url:"hg-144-matsuri-weapon-build-fighters-support-weapon-assembly.pdf"}] },
  { id:220, grade:"HG", scale:"1/144", name:"Mbf-p01 Gundam Astray Gold Frame", series:"", imageUrl:null,
    manuals:[{id:220,name:"Assembly",lang:"JP",size:"",url:"hg-144-mbf-p01-gundam-astray-gold-frame-assembly.pdf"}] },
  { id:221, grade:"HG", scale:"1/144", name:"Mbf-p03lm Gundam Astray Mirage Frame", series:"", imageUrl:null,
    manuals:[{id:221,name:"Assembly",lang:"JP",size:"",url:"hg-144-mbf-p03lm-gundam-astray-mirage-frame-assembly.pdf"}] },
  { id:222, grade:"HG", scale:"1/144", name:"Meo2r-fo1 Messer Type-fo1 (mafty Mass-produced Heavy Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:222,name:"Assembly",lang:"JP",size:"",url:"hg-144-meo2r-fo1-messer-type-fo1-mafty-mass-produced-heavy-mobile-suit-assembly.pdf"}] },
  { id:223, grade:"HG", scale:"1/144", name:"Meteor Hopper Wing Gundam Fenice Support Unit", series:"", imageUrl:null,
    manuals:[{id:223,name:"Assembly",lang:"JP",size:"",url:"hg-144-meteor-hopper-wing-gundam-fenice-support-unit-assembly.pdf"}] },
  { id:224, grade:"HG", scale:"1/144", name:"Meteor Unit + Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:224,name:"Assembly",lang:"JP",size:"",url:"hg-144-meteor-unit-freedom-gundam-assembly.pdf"}] },
  { id:225, grade:"HG", scale:"1/144", name:"Miss Sazabi", series:"", imageUrl:null,
    manuals:[{id:225,name:"Assembly",lang:"JP",size:"",url:"hg-144-miss-sazabi-assembly.pdf"}] },
  { id:226, grade:"HG", scale:"1/144", name:"Mobile Armor Hashmal", series:"", imageUrl:null,
    manuals:[{id:226,name:"Assembly",lang:"JP",size:"",url:"hg-144-mobile-armor-hashmal-assembly.pdf"}] },
  { id:227, grade:"HG", scale:"1/144", name:"Mobile Cque Zgmf-515 Gundam Seed-15", series:"", imageUrl:null,
    manuals:[{id:227,name:"Assembly",lang:"JP",size:"",url:"hg-144-mobile-cque-zgmf-515-gundam-seed-15-assembly.pdf"}] },
  { id:228, grade:"HG", scale:"1/144", name:"Mobile Dinn", series:"", imageUrl:null,
    manuals:[{id:228,name:"Assembly",lang:"JP",size:"",url:"hg-144-mobile-dinn-assembly.pdf"}] },
  { id:229, grade:"HG", scale:"1/144", name:"Mobile Doll Sarah", series:"", imageUrl:null,
    manuals:[{id:229,name:"Assembly",lang:"JP",size:"",url:"hg-144-mobile-doll-sarah-assembly.pdf"}] },
  { id:230, grade:"HG", scale:"1/144", name:"Mobile Gigue", series:"", imageUrl:null,
    manuals:[{id:230,name:"Assembly",lang:"JP",size:"",url:"hg-144-mobile-gigue-assembly.pdf"}] },
  { id:231, grade:"HG", scale:"1/144", name:"Mobile Ginn (zgmf-1017 Mobile Suit Gundam Seed)", series:"", imageUrl:null,
    manuals:[{id:231,name:"Assembly",lang:"JP",size:"",url:"hg-144-mobile-ginn-zgmf-1017-mobile-suit-gundam-seed-assembly.pdf"}] },
  { id:232, grade:"HG", scale:"1/144", name:"Mobile Goohm", series:"", imageUrl:null,
    manuals:[{id:232,name:"Assembly",lang:"JP",size:"",url:"hg-144-mobile-goohm-assembly.pdf"}] },
  { id:233, grade:"HG", scale:"1/144", name:"Mobile Suit Option Set 8 & Sau Mobile Worker", series:"", imageUrl:null,
    manuals:[{id:233,name:"Assembly",lang:"JP",size:"",url:"hg-144-mobile-suit-option-set-8-sau-mobile-worker-assembly.pdf"}] },
  { id:234, grade:"HG", scale:"1/144", name:"Montero", series:"", imageUrl:null,
    manuals:[{id:234,name:"Assembly",lang:"JP",size:"",url:"hg-144-montero-assembly.pdf"}] },
  { id:235, grade:"HG", scale:"1/144", name:"Mrs. Loheng-rinko", series:"", imageUrl:null,
    manuals:[{id:235,name:"Assembly",lang:"JP",size:"",url:"hg-144-mrs-loheng-rinko-assembly.pdf"}] },
  { id:236, grade:"HG", scale:"1/144", name:"Mrx-009 \'psycho Gundam\' Titans Prototype Transformable Mobile Armor", series:"", imageUrl:null,
    manuals:[{id:236,name:"Assembly",lang:"JP",size:"",url:"hg-144-mrx-009-psycho-gundam-titans-prototype-transformable-mobile-armor-assembly.pdf"}] },
  { id:237, grade:"HG", scale:"1/144", name:"MS Option Set 1 & Cgs Mobile Worker", series:"", imageUrl:null,
    manuals:[{id:237,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-option-set-1-cgs-mobile-worker-assembly.pdf"}] },
  { id:238, grade:"HG", scale:"1/144", name:"MS Option Set 2 & Cgs Mobile Worker (space Type)", series:"", imageUrl:null,
    manuals:[{id:238,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-option-set-2-cgs-mobile-worker-space-type-assembly.pdf"}] },
  { id:239, grade:"HG", scale:"1/144", name:"MS Option Set 3 & Gallarhorn Mobile Worker", series:"", imageUrl:null,
    manuals:[{id:239,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-option-set-3-gallarhorn-mobile-worker-assembly.pdf"}] },
  { id:240, grade:"HG", scale:"1/144", name:"MS Option Set 4 & Union Mobile Worker", series:"", imageUrl:null,
    manuals:[{id:240,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-option-set-4-union-mobile-worker-assembly.pdf"}] },
  { id:241, grade:"HG", scale:"1/144", name:"MS Option Set 5 & Tekkadan Mobile Worker", series:"", imageUrl:null,
    manuals:[{id:241,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-option-set-5-tekkadan-mobile-worker-assembly.pdf"}] },
  { id:242, grade:"HG", scale:"1/144", name:"MS Option Set 6 & Hd Mobile Worker", series:"", imageUrl:null,
    manuals:[{id:242,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-option-set-6-hd-mobile-worker-assembly.pdf"}] },
  { id:243, grade:"HG", scale:"1/144", name:"MS Option Set 7", series:"", imageUrl:null,
    manuals:[{id:243,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-option-set-7-assembly.pdf"}] },
  { id:244, grade:"HG", scale:"1/144", name:"MS Option Set 9", series:"", imageUrl:null,
    manuals:[{id:244,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-option-set-9-assembly.pdf"}] },
  { id:245, grade:"HG", scale:"1/144", name:"Ms-05 Zaku I Gundam Thunderbolt VER.", series:"", imageUrl:null,
    manuals:[{id:245,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-05-zaku-i-gundam-thunderbolt-ver-assembly.pdf"}] },
  { id:246, grade:"HG", scale:"1/144", name:"Ms-06 Zaku II", series:"", imageUrl:null,
    manuals:[{id:246,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-06-zaku-ii-assembly.pdf"}] },
  { id:247, grade:"HG", scale:"1/144", name:"Ms-06 Zaku II Principality Of Zeon Mass-produced Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:247,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-06-zaku-ii-principality-of-zeon-mass-produced-mobile-suit-assembly.pdf"}] },
  { id:248, grade:"HG", scale:"1/144", name:"Ms-06f Zakuii F Type Solar (rfy) Principality Of Zeon Mass-produced Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:248,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-06f-zakuii-f-type-solar-rfy-principality-of-zeon-mass-produced-mobile-suit-assembly.pdf"}] },
  { id:249, grade:"HG", scale:"1/144", name:"Ms-06f-2 Zaku II F2 (e.f.s.f. Mass Productive Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:249,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-06f-2-zaku-ii-f2-e-f-s-f-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:250, grade:"HG", scale:"1/144", name:"Ms-06f-2 Zaku II F2 Principality Of Zeon Mass Productive Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:250,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-06f-2-zaku-ii-f2-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:251, grade:"HG", scale:"1/144", name:"Ms-06fz Zaku II Fz (principality Of Zeon Mass Productive Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:251,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-06fz-zaku-ii-fz-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:252, grade:"HG", scale:"1/144", name:"Ms-06r Zakuii High Mobility Type \"psycho Zaku\" Gundam Thunderbolt VER.", series:"", imageUrl:null,
    manuals:[{id:252,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-06r-zakuii-high-mobility-type-psycho-zaku-gundam-thunderbolt-ver-assembly.pdf"}] },
  { id:253, grade:"HG", scale:"1/144", name:"Ms-06s \'zaku Ii\' (principality Of Zeon Char\'s Customize Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:253,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-06s-zaku-ii-principality-of-zeon-char-s-customize-mobile-suit-assembly.pdf"}] },
  { id:254, grade:"HG", scale:"1/144", name:"Ms-06s Zaku II (principality Of Zeon Char Aznable\'s Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:254,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-06s-zaku-ii-principality-of-zeon-char-aznable-s-mobile-suit-assembly.pdf"}] },
  { id:255, grade:"HG", scale:"1/144", name:"Ms-06s Zaku II (principality Of Zeon Char Aznable\'s Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:255,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-06s-zaku-ii-principality-of-zeon-char-aznable-s-mobile-suit-assembly.pdf"}] },
  { id:256, grade:"HG", scale:"1/144", name:"Ms-07b-3 Gouf Custom (principality Of Zeon Ground Battle Type Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:256,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-07b-3-gouf-custom-principality-of-zeon-ground-battle-type-mobile-suit-assembly.pdf"}] },
  { id:257, grade:"HG", scale:"1/144", name:"Ms-09 Challia\'s Rick Dom (gq)", series:"", imageUrl:null,
    manuals:[{id:257,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-09-challia-s-rick-dom-gq-assembly.pdf"}] },
  { id:258, grade:"HG", scale:"1/144", name:"Ms-14a Gelgoog / Ms-14c Gelgoog Cannon", series:"", imageUrl:null,
    manuals:[{id:258,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-14a-gelgoog-ms-14c-gelgoog-cannon-assembly.pdf"}] },
  { id:259, grade:"HG", scale:"1/144", name:"Ms-14s Gelgoog (principality Of Zeon Char\'s Customize Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:259,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-14s-gelgoog-principality-of-zeon-char-s-customize-mobile-suit-assembly.pdf"}] },
  { id:260, grade:"HG", scale:"1/144", name:"Ms-18e Kämpfer (principality Of Zeon Assault Use Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:260,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-18e-k-mpfer-principality-of-zeon-assault-use-mobile-suit-assembly.pdf"}] },
  { id:261, grade:"HG", scale:"1/144", name:"Ms-21c Dra-c Principality Of Zeon Mass-produced Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:261,name:"Assembly",lang:"JP",size:"",url:"hg-144-ms-21c-dra-c-principality-of-zeon-mass-produced-mobile-suit-assembly.pdf"}] },
  { id:262, grade:"HG", scale:"1/144", name:"Msa-005 Methuss (a.e.u.c. Prototype Attack Use Transformable Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:262,name:"Assembly",lang:"JP",size:"",url:"hg-144-msa-005-methuss-a-e-u-c-prototype-attack-use-transformable-mobile-suit-assembly.pdf"}] },
  { id:263, grade:"HG", scale:"1/144", name:"Msm-03 \'gogg\'", series:"", imageUrl:null,
    manuals:[{id:263,name:"Assembly",lang:"JP",size:"",url:"hg-144-msm-03-gogg-assembly.pdf"}] },
  { id:264, grade:"HG", scale:"1/144", name:"Msm-04 Acguy (principality Of Zeon Mass Productive Amphibious Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:264,name:"Assembly",lang:"JP",size:"",url:"hg-144-msm-04-acguy-principality-of-zeon-mass-productive-amphibious-mobile-suit-assembly.pdf"}] },
  { id:265, grade:"HG", scale:"1/144", name:"Msm-10 Zock Principality Of Zeon Proto-type Amphibious Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:265,name:"Assembly",lang:"JP",size:"",url:"hg-144-msm-10-zock-principality-of-zeon-proto-type-amphibious-mobile-suit-assembly.pdf"}] },
  { id:266, grade:"HG", scale:"1/144", name:"Msn-03 Jagd Doga Neo Zeon Mobile Suit For Newtype", series:"", imageUrl:null,
    manuals:[{id:266,name:"Assembly",lang:"JP",size:"",url:"hg-144-msn-03-jagd-doga-neo-zeon-mobile-suit-for-newtype-assembly.pdf"}] },
  { id:267, grade:"HG", scale:"1/144", name:"Msn-03 Jagd Doga Neo Zeon Mobile Suit For Newtype", series:"", imageUrl:null,
    manuals:[{id:267,name:"Assembly",lang:"JP",size:"",url:"hg-144-msn-03-jagd-doga-neo-zeon-mobile-suit-for-newtype-assembly.pdf"}] },
  { id:268, grade:"HG", scale:"1/144", name:"Msn-04ii Nightingale Neo Zeon Char Aznable\'s Use Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:268,name:"Assembly",lang:"JP",size:"",url:"hg-144-msn-04ii-nightingale-neo-zeon-char-aznable-s-use-mobile-suit-assembly.pdf"}] },
  { id:269, grade:"HG", scale:"1/144", name:"Msz-006 \'zeta Gundam\' A.e.u.g. Prototype Transformable Attack Use Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:269,name:"Assembly",lang:"JP",size:"",url:"hg-144-msz-006-zeta-gundam-a-e-u-g-prototype-transformable-attack-use-mobile-suit-assembly.pdf"}] },
  { id:270, grade:"HG", scale:"1/144", name:"Ninpulse Gundam", series:"", imageUrl:null,
    manuals:[{id:270,name:"Assembly",lang:"JP",size:"",url:"hg-144-ninpulse-gundam-assembly.pdf"}] },
  { id:271, grade:"HG", scale:"1/144", name:"Nix Providence Gundam", series:"", imageUrl:null,
    manuals:[{id:271,name:"Assembly",lang:"JP",size:"",url:"hg-144-nix-providence-gundam-assembly.pdf"}] },
  { id:272, grade:"HG", scale:"1/144", name:"No-name Rifle (build Divers Support Weapon)", series:"", imageUrl:null,
    manuals:[{id:272,name:"Assembly",lang:"JP",size:"",url:"hg-144-no-name-rifle-build-divers-support-weapon-assembly.pdf"}] },
  { id:273, grade:"HG", scale:"1/144", name:"Nrx-044 Asshimar E.f.f. Prototype Transformable Mobile Armor", series:"", imageUrl:null,
    manuals:[{id:273,name:"Assembly",lang:"JP",size:"",url:"hg-144-nrx-044-asshimar-e-f-f-prototype-transformable-mobile-armor-assembly.pdf"}] },
  { id:274, grade:"HG", scale:"1/144", name:"Orb-01 Akatsuki Gundam", series:"", imageUrl:null,
    manuals:[{id:274,name:"Assembly",lang:"JP",size:"",url:"hg-144-orb-01-akatsuki-gundam-assembly.pdf"}] },
  { id:275, grade:"HG", scale:"1/144", name:"Ork-005 \'gaplant\' E.f.s.f. Prototype Transformable Mobile Armor", series:"", imageUrl:null,
    manuals:[{id:275,name:"Assembly",lang:"JP",size:"",url:"hg-144-ork-005-gaplant-e-f-s-f-prototype-transformable-mobile-armor-assembly.pdf"}] },
  { id:276, grade:"HG", scale:"1/144", name:"Overname", series:"", imageUrl:null,
    manuals:[{id:276,name:"Assembly",lang:"JP",size:"",url:"hg-144-overname-assembly.pdf"}] },
  { id:277, grade:"HG", scale:"1/144", name:"Pmx-001 Palace-athene Jupitoris Prototype Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:277,name:"Assembly",lang:"JP",size:"",url:"hg-144-pmx-001-palace-athene-jupitoris-prototype-mobile-suit-assembly.pdf"}] },
  { id:278, grade:"HG", scale:"1/144", name:"Portent Flyer Build Fighters Support Unit", series:"", imageUrl:null,
    manuals:[{id:278,name:"Assembly",lang:"JP",size:"",url:"hg-144-portent-flyer-build-fighters-support-unit-assembly.pdf"}] },
  { id:279, grade:"HG", scale:"1/144", name:"Providence Gundam", series:"", imageUrl:null,
    manuals:[{id:279,name:"Assembly",lang:"JP",size:"",url:"hg-144-providence-gundam-assembly.pdf"}] },
  { id:280, grade:"HG", scale:"1/144", name:"Providence Gundam", series:"", imageUrl:null,
    manuals:[{id:280,name:"Assembly",lang:"JP",size:"",url:"hg-144-providence-gundam-assembly.pdf"}] },
  { id:281, grade:"HG", scale:"1/144", name:"Ptolemaios Arms", series:"", imageUrl:null,
    manuals:[{id:281,name:"Assembly",lang:"JP",size:"",url:"hg-144-ptolemaios-arms-assembly.pdf"}] },
  { id:282, grade:"HG", scale:"1/144", name:"Raider Gundam", series:"", imageUrl:null,
    manuals:[{id:282,name:"Assembly",lang:"JP",size:"",url:"hg-144-raider-gundam-assembly.pdf"}] },
  { id:283, grade:"HG", scale:"1/144", name:"Raider Gundam (gat-x370 レイダーガンダム)", series:"", imageUrl:null,
    manuals:[{id:283,name:"Assembly",lang:"JP",size:"",url:"hg-144-raider-gundam-gat-x370-assembly.pdf"}] },
  { id:284, grade:"HG", scale:"1/144", name:"Reginlaze Julia", series:"", imageUrl:null,
    manuals:[{id:284,name:"Assembly",lang:"JP",size:"",url:"hg-144-reginlaze-julia-assembly.pdf"}] },
  { id:285, grade:"HG", scale:"1/144", name:"Rgm-79 Gm (shoulder Cannon / Missile-pod)", series:"", imageUrl:null,
    manuals:[{id:285,name:"Assembly",lang:"JP",size:"",url:"hg-144-rgm-79-gm-shoulder-cannon-missile-pod-assembly.pdf"}] },
  { id:286, grade:"HG", scale:"1/144", name:"Rgm-79 Gm Gundam Thunderbolt VER.", series:"", imageUrl:null,
    manuals:[{id:286,name:"Assembly",lang:"JP",size:"",url:"hg-144-rgm-79-gm-gundam-thunderbolt-ver-assembly.pdf"}] },
  { id:287, grade:"HG", scale:"1/144", name:"Rgm-79 Powered Gm E.f.s.f. Mass Productive Mobile Suit Custom Type", series:"", imageUrl:null,
    manuals:[{id:287,name:"Assembly",lang:"JP",size:"",url:"hg-144-rgm-79-powered-gm-e-f-s-f-mass-productive-mobile-suit-custom-type-assembly.pdf"}] },
  { id:288, grade:"HG", scale:"1/144", name:"Rgm-86r Gmiii E.f.s.f. Mass-produced Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:288,name:"Assembly",lang:"JP",size:"",url:"hg-144-rgm-86r-gmiii-e-f-s-f-mass-produced-mobile-suit-assembly.pdf"}] },
  { id:289, grade:"HG", scale:"1/144", name:"Rgm-89s Stark Jegan E.f.s.f. Anti-ship Assault Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:289,name:"Assembly",lang:"JP",size:"",url:"hg-144-rgm-89s-stark-jegan-e-f-s-f-anti-ship-assault-mobile-suit-assembly.pdf"}] },
  { id:290, grade:"HG", scale:"1/144", name:"Rgm-96x Jesta E.f.s.f. Special Operations Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:290,name:"Assembly",lang:"JP",size:"",url:"hg-144-rgm-96x-jesta-e-f-s-f-special-operations-mobile-suit-assembly.pdf"}] },
  { id:291, grade:"HG", scale:"1/144", name:"Rms-106 Hi-zack (earth Federation Force)", series:"", imageUrl:null,
    manuals:[{id:291,name:"Assembly",lang:"JP",size:"",url:"hg-144-rms-106-hi-zack-earth-federation-force-assembly.pdf"}] },
  { id:292, grade:"HG", scale:"1/144", name:"Rms-119 Ewac Zack Blue Force\'s Mobile Suit Reconnaissance Type", series:"", imageUrl:null,
    manuals:[{id:292,name:"Assembly",lang:"JP",size:"",url:"hg-144-rms-119-ewac-zack-blue-force-s-mobile-suit-reconnaissance-type-assembly.pdf"}] },
  { id:293, grade:"HG", scale:"1/144", name:"Rodi", series:"", imageUrl:null,
    manuals:[{id:293,name:"Assembly",lang:"JP",size:"",url:"hg-144-rodi-assembly.pdf"}] },
  { id:294, grade:"HG", scale:"1/144", name:"Rx-0 Unicorn Gundam (destroy Mode) Full Psycho-frame Prototype Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:294,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-0-unicorn-gundam-destroy-mode-full-psycho-frame-prototype-mobile-suit-assembly.pdf"}] },
  { id:295, grade:"HG", scale:"1/144", name:"Rx-0 Unicorn Gundam (unicorn Mode) Full Psycho-frame Prototype Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:295,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-0-unicorn-gundam-unicorn-mode-full-psycho-frame-prototype-mobile-suit-assembly.pdf"}] },
  { id:296, grade:"HG", scale:"1/144", name:"Rx-0 Unicorn Gundam 03 Phenex (destroy Mode) (narrative VER.)", series:"", imageUrl:null,
    manuals:[{id:296,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-0-unicorn-gundam-03-phenex-destroy-mode-narrative-ver-assembly.pdf"}] },
  { id:297, grade:"HG", scale:"1/144", name:"Rx-0 Unicorn Gundam 3 Phenex (unicorn Mode) Narrative VER.", series:"", imageUrl:null,
    manuals:[{id:297,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-0-unicorn-gundam-3-phenex-unicorn-mode-narrative-ver-assembly.pdf"}] },
  { id:298, grade:"HG", scale:"1/144", name:"Rx-0000 Full Armor Unicorn Gundam", series:"", imageUrl:null,
    manuals:[{id:298,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-0000-full-armor-unicorn-gundam-assembly.pdf"}] },
  { id:299, grade:"HG", scale:"1/144", name:"Rx-105 XI Gundam Minovsky Flight System Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:299,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-105-xi-gundam-minovsky-flight-system-mobile-suit-assembly.pdf"}] },
  { id:300, grade:"HG", scale:"1/144", name:"Rx-110 Garthley E.f.s.f. Prototype Transformable Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:300,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-110-garthley-e-f-s-f-prototype-transformable-mobile-suit-assembly.pdf"}] },
  { id:301, grade:"HG", scale:"1/144", name:"Rx-78-2 Gundam (beyond Global)", series:"", imageUrl:null,
    manuals:[{id:301,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-78-2-gundam-beyond-global-assembly.pdf"}] },
  { id:302, grade:"HG", scale:"1/144", name:"Rx-78-2 Gundam (ecopla 1/144 Workshop Kit VER.)", series:"", imageUrl:null,
    manuals:[{id:302,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-78-2-gundam-ecopla-1-144-workshop-kit-ver-assembly.pdf"}] },
  { id:303, grade:"HG", scale:"1/144", name:"Rx-78-2 Gundam E.f.s.f. Prototype Close-combat Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:303,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-78-2-gundam-e-f-s-f-prototype-close-combat-mobile-suit-assembly.pdf"}] },
  { id:304, grade:"HG", scale:"1/144", name:"Rx-78gp02a Gundam Gp02a (e.f.s.f. Prototype Attack Use Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:304,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-78gp02a-gundam-gp02a-e-f-s-f-prototype-attack-use-mobile-suit-assembly.pdf"}] },
  { id:305, grade:"HG", scale:"1/144", name:"Rx-78gp03 Dendrobium", series:"", imageUrl:null,
    manuals:[{id:305,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-78gp03-dendrobium-assembly.pdf"}] },
  { id:306, grade:"HG", scale:"1/144", name:"Rx-78gp03 Gundam GP03 Dendrobium", series:"", imageUrl:null,
    manuals:[{id:306,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-78gp03-gundam-gp03-dendrobium-assembly.pdf"}] },
  { id:307, grade:"HG", scale:"1/144", name:"Rx-79(g) Gundam Ground Type E.f.s.f. First Production Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:307,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-79g-gundam-ground-type-e-f-s-f-first-production-mobile-suit-assembly.pdf"}] },
  { id:308, grade:"HG", scale:"1/144", name:"Rx-79(g) 陸戦型ガンダム 鉄山装", series:"", imageUrl:null,
    manuals:[{id:308,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-79g-assembly.pdf"}] },
  { id:309, grade:"HG", scale:"1/144", name:"Rx-79(g)s Gundam Ground Type-s Gundam Thunderbolt VER.", series:"", imageUrl:null,
    manuals:[{id:309,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-79gs-gundam-ground-type-s-gundam-thunderbolt-ver-assembly.pdf"}] },
  { id:310, grade:"HG", scale:"1/144", name:"Rx-93 Ν Gundam", series:"", imageUrl:null,
    manuals:[{id:310,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-93-gundam-assembly.pdf"}] },
  { id:311, grade:"HG", scale:"1/144", name:"Rx-93-ν2 Hi-ν Gundam", series:"", imageUrl:null,
    manuals:[{id:311,name:"Assembly",lang:"JP",size:"",url:"hg-144-rx-93-2-hi-gundam-assembly.pdf"}] },
  { id:312, grade:"HG", scale:"1/144", name:"Saviour Gundam", series:"", imageUrl:null,
    manuals:[{id:312,name:"Assembly",lang:"JP",size:"",url:"hg-144-saviour-gundam-assembly.pdf"}] },
  { id:313, grade:"HG", scale:"1/144", name:"Schwalbe Graze (macdillis)", series:"", imageUrl:null,
    manuals:[{id:313,name:"Assembly",lang:"JP",size:"",url:"hg-144-schwalbe-graze-macdillis-assembly.pdf"}] },
  { id:314, grade:"HG", scale:"1/144", name:"Scramble Gundam (yasima Shigure Custom Made Machinegun)", series:"", imageUrl:null,
    manuals:[{id:314,name:"Assembly",lang:"JP",size:"",url:"hg-144-scramble-gundam-yasima-shigure-custom-made-machinegun-assembly.pdf"}] },
  { id:315, grade:"HG", scale:"1/144", name:"Sengoku Astray Gundam", series:"", imageUrl:null,
    manuals:[{id:315,name:"Assembly",lang:"JP",size:"",url:"hg-144-sengoku-astray-gundam-assembly.pdf"}] },
  { id:316, grade:"HG", scale:"1/144", name:"Servee Gundam Scheherazade", series:"", imageUrl:null,
    manuals:[{id:316,name:"Assembly",lang:"JP",size:"",url:"hg-144-servee-gundam-scheherazade-assembly.pdf"}] },
  { id:317, grade:"HG", scale:"1/144", name:"Shin Burning Gundam", series:"", imageUrl:null,
    manuals:[{id:317,name:"Assembly",lang:"JP",size:"",url:"hg-144-shin-burning-gundam-assembly.pdf"}] },
  { id:318, grade:"HG", scale:"1/144", name:"Sky High Wings Build Divers Support Unit", series:"", imageUrl:null,
    manuals:[{id:318,name:"Assembly",lang:"JP",size:"",url:"hg-144-sky-high-wings-build-divers-support-unit-assembly.pdf"}] },
  { id:319, grade:"HG", scale:"1/144", name:"Slash Zaku Phantom (yzak Joule Dedicated Machine)", series:"", imageUrl:null,
    manuals:[{id:319,name:"Assembly",lang:"JP",size:"",url:"hg-144-slash-zaku-phantom-yzak-joule-dedicated-machine-assembly.pdf"}] },
  { id:320, grade:"HG", scale:"1/144", name:"Space Backpack For Gundam G-self", series:"", imageUrl:null,
    manuals:[{id:320,name:"Assembly",lang:"JP",size:"",url:"hg-144-space-backpack-for-gundam-g-self-assembly.pdf"}] },
  { id:321, grade:"HG", scale:"1/144", name:"Space Jahannam", series:"", imageUrl:null,
    manuals:[{id:321,name:"Assembly",lang:"JP",size:"",url:"hg-144-space-jahannam-assembly.pdf"}] },
  { id:322, grade:"HG", scale:"1/144", name:"Space Jahannam Klim Nick Use", series:"", imageUrl:null,
    manuals:[{id:322,name:"Assembly",lang:"JP",size:"",url:"hg-144-space-jahannam-klim-nick-use-assembly.pdf"}] },
  { id:323, grade:"HG", scale:"1/144", name:"Spinning Blaster", series:"", imageUrl:null,
    manuals:[{id:323,name:"Assembly",lang:"JP",size:"",url:"hg-144-spinning-blaster-assembly.pdf"}] },
  { id:324, grade:"HG", scale:"1/144", name:"Strike Dagger", series:"", imageUrl:null,
    manuals:[{id:324,name:"Assembly",lang:"JP",size:"",url:"hg-144-strike-dagger-assembly.pdf"}] },
  { id:325, grade:"HG", scale:"1/144", name:"Strike Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:325,name:"Assembly",lang:"JP",size:"",url:"hg-144-strike-freedom-gundam-assembly.pdf"}] },
  { id:326, grade:"HG", scale:"1/144", name:"Strike Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:326,name:"Assembly",lang:"JP",size:"",url:"hg-144-strike-freedom-gundam-assembly.pdf"}] },
  { id:327, grade:"HG", scale:"1/144", name:"Strike Freedom Gundam (lightning Edition)", series:"", imageUrl:null,
    manuals:[{id:327,name:"Assembly",lang:"JP",size:"",url:"hg-144-strike-freedom-gundam-lightning-edition-assembly.pdf"}] },
  { id:328, grade:"HG", scale:"1/144", name:"Strike Gundam", series:"", imageUrl:null,
    manuals:[{id:328,name:"Assembly",lang:"JP",size:"",url:"hg-144-strike-gundam-assembly.pdf"}] },
  { id:329, grade:"HG", scale:"1/144", name:"Strike Gundam Gat-x105", series:"", imageUrl:null,
    manuals:[{id:329,name:"Assembly",lang:"JP",size:"",url:"hg-144-strike-gundam-gat-x105-assembly.pdf"}] },
  { id:330, grade:"HG", scale:"1/144", name:"Strike Gundam Striker Weapon System", series:"", imageUrl:null,
    manuals:[{id:330,name:"Assembly",lang:"JP",size:"",url:"hg-144-strike-gundam-striker-weapon-system-assembly.pdf"}] },
  { id:331, grade:"HG", scale:"1/144", name:"Strike Rouge + I.w.s.p.", series:"", imageUrl:null,
    manuals:[{id:331,name:"Assembly",lang:"JP",size:"",url:"hg-144-strike-rouge-i-w-s-p-assembly.pdf"}] },
  { id:332, grade:"HG", scale:"1/144", name:"Super Fumina Axe Angel W", series:"", imageUrl:null,
    manuals:[{id:332,name:"Assembly",lang:"JP",size:"",url:"hg-144-super-fumina-axe-angel-w-assembly.pdf"}] },
  { id:333, grade:"HG", scale:"1/144", name:"Super Fumina Minato Sakai\'s Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:333,name:"Assembly",lang:"JP",size:"",url:"hg-144-super-fumina-minato-sakai-s-mobile-suit-assembly.pdf"}] },
  { id:334, grade:"HG", scale:"1/144", name:"Sword Impulse Gundam", series:"", imageUrl:null,
    manuals:[{id:334,name:"Assembly",lang:"JP",size:"",url:"hg-144-sword-impulse-gundam-assembly.pdf"}] },
  { id:335, grade:"HG", scale:"1/144", name:"Swordstrike Gundam", series:"", imageUrl:null,
    manuals:[{id:335,name:"Assembly",lang:"JP",size:"",url:"hg-144-swordstrike-gundam-assembly.pdf"}] },
  { id:336, grade:"HG", scale:"1/144", name:"The Northern Pod (build Fighters Support Unit)", series:"", imageUrl:null,
    manuals:[{id:336,name:"Assembly",lang:"JP",size:"",url:"hg-144-the-northern-pod-build-fighters-support-unit-assembly.pdf"}] },
  { id:337, grade:"HG", scale:"1/144", name:"The Witch From Mercury Weapon Display Base", series:"", imageUrl:null,
    manuals:[{id:337,name:"Assembly",lang:"JP",size:"",url:"hg-144-the-witch-from-mercury-weapon-display-base-assembly.pdf"}] },
  { id:338, grade:"HG", scale:"1/144", name:"Tiltrotor Pack Build Divers Support Unit", series:"", imageUrl:null,
    manuals:[{id:338,name:"Assembly",lang:"JP",size:"",url:"hg-144-tiltrotor-pack-build-divers-support-unit-assembly.pdf"}] },
  { id:339, grade:"HG", scale:"1/144", name:"Transient Gundam", series:"", imageUrl:null,
    manuals:[{id:339,name:"Assembly",lang:"JP",size:"",url:"hg-144-transient-gundam-assembly.pdf"}] },
  { id:340, grade:"HG", scale:"1/144", name:"Transient Gundam Glacier", series:"", imageUrl:null,
    manuals:[{id:340,name:"Assembly",lang:"JP",size:"",url:"hg-144-transient-gundam-glacier-assembly.pdf"}] },
  { id:341, grade:"HG", scale:"1/144", name:"Try-burning Gundam", series:"", imageUrl:null,
    manuals:[{id:341,name:"Assembly",lang:"JP",size:"",url:"hg-144-try-burning-gundam-assembly.pdf"}] },
  { id:342, grade:"HG", scale:"1/144", name:"Universe Booster Plansky Power Gate Star Build Strike Gundam Support Unit", series:"", imageUrl:null,
    manuals:[{id:342,name:"Assembly",lang:"JP",size:"",url:"hg-144-universe-booster-plansky-power-gate-star-build-strike-gundam-support-unit-assembly.pdf"}] },
  { id:343, grade:"HG", scale:"1/144", name:"Wing Gundam \"ver.ka\" (xxxg-01w)", series:"", imageUrl:null,
    manuals:[{id:343,name:"Assembly",lang:"JP",size:"",url:"hg-144-wing-gundam-ver-ka-xxxg-01w-assembly.pdf"}] },
  { id:344, grade:"HG", scale:"1/144", name:"Wing Gundam Fenice", series:"", imageUrl:null,
    manuals:[{id:344,name:"Assembly",lang:"JP",size:"",url:"hg-144-wing-gundam-fenice-assembly.pdf"}] },
  { id:345, grade:"HG", scale:"1/144", name:"Xxxg-01d Gundam Deathscythe", series:"", imageUrl:null,
    manuals:[{id:345,name:"Assembly",lang:"JP",size:"",url:"hg-144-xxxg-01d-gundam-deathscythe-assembly.pdf"}] },
  { id:346, grade:"HG", scale:"1/144", name:"Xxxg-01s Shenlong Gundam", series:"", imageUrl:null,
    manuals:[{id:346,name:"Assembly",lang:"JP",size:"",url:"hg-144-xxxg-01s-shenlong-gundam-assembly.pdf"}] },
  { id:347, grade:"HG", scale:"1/144", name:"Zaku Amazing Build Fighter Tatsuya Yuuki Custom Made Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:347,name:"Assembly",lang:"JP",size:"",url:"hg-144-zaku-amazing-build-fighter-tatsuya-yuuki-custom-made-mobile-suit-assembly.pdf"}] },
  { id:348, grade:"HG", scale:"1/144", name:"Zaku Warrior", series:"", imageUrl:null,
    manuals:[{id:348,name:"Assembly",lang:"JP",size:"",url:"hg-144-zaku-warrior-assembly.pdf"}] },
  { id:349, grade:"HG", scale:"1/144", name:"Zaku Warrior (live Concert Version)", series:"", imageUrl:null,
    manuals:[{id:349,name:"Assembly",lang:"JP",size:"",url:"hg-144-zaku-warrior-live-concert-version-assembly.pdf"}] },
  { id:350, grade:"HG", scale:"1/144", name:"Zedas [xyv-xcl]", series:"", imageUrl:null,
    manuals:[{id:350,name:"Assembly",lang:"JP",size:"",url:"hg-144-zedas-xyv-xcl-assembly.pdf"}] },
  { id:351, grade:"HG", scale:"1/144", name:"Zeta Gundam \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:351,name:"Assembly",lang:"JP",size:"",url:"hg-144-zeta-gundam-ver-ka-assembly.pdf"}] },
  { id:352, grade:"HG", scale:"1/144", name:"Zgmf-1000 Zaku Warrior +blaze Wizard & Gunner Wizard", series:"", imageUrl:null,
    manuals:[{id:352,name:"Assembly",lang:"JP",size:"",url:"hg-144-zgmf-1000-zaku-warrior-blaze-wizard-gunner-wizard-assembly.pdf"}] },
  { id:353, grade:"HG", scale:"1/144", name:"Zgmf-x13a Providence Gundam", series:"", imageUrl:null,
    manuals:[{id:353,name:"Assembly",lang:"JP",size:"",url:"hg-144-zgmf-x13a-providence-gundam-assembly.pdf"}] },
  { id:354, grade:"HG", scale:"1/144", name:"Zgmf-x19a ∞justice Gundam", series:"", imageUrl:null,
    manuals:[{id:354,name:"Assembly",lang:"JP",size:"",url:"hg-144-zgmf-x19a-justice-gundam-assembly.pdf"}] },
  { id:355, grade:"HG", scale:"1/144", name:"Zgmf-x56s/α Force Impulse Gundam", series:"", imageUrl:null,
    manuals:[{id:355,name:"Assembly",lang:"JP",size:"",url:"hg-144-zgmf-x56s-force-impulse-gundam-assembly.pdf"}] },
  { id:356, grade:"HG", scale:"1/144", name:"Zgmf-x56s/β Sword Impulse Gundam", series:"", imageUrl:null,
    manuals:[{id:356,name:"Assembly",lang:"JP",size:"",url:"hg-144-zgmf-x56s-sword-impulse-gundam-assembly.pdf"}] },
  { id:357, grade:"HG", scale:"1/144", name:"イオフレーム獅電", series:"", imageUrl:null,
    manuals:[{id:357,name:"Assembly",lang:"JP",size:"",url:"hg-144-unknown-assembly.pdf"}] },
  { id:358, grade:"HG", scale:"1/144", name:"流星号(グレイズ改式)", series:"", imageUrl:null,
    manuals:[{id:358,name:"Assembly",lang:"JP",size:"",url:"hg-144-unknown-assembly.pdf"}] },
  { id:359, grade:"HG", scale:"1/144", name:"漲影 (shoei)", series:"", imageUrl:null,
    manuals:[{id:359,name:"Assembly",lang:"JP",size:"",url:"hg-144-shoei-assembly.pdf"}] },

  // ── REAL GRADE (RG) ───────────────────────────────────
  { id:360, grade:"RG", scale:"1/144", name:"00 Raiser (celestial Being Mobile Suit Gn-0000+gn-0000)", series:"", imageUrl:null,
    manuals:[{id:360,name:"Assembly",lang:"JP",size:"",url:"rg-144-00-raiser-celestial-being-mobile-suit-gn-0000-gn-0000-assembly.pdf"}] },
  { id:361, grade:"RG", scale:"1/144", name:"Aile Strike Gundam (gat-x105 Omni Enforcer Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:361,name:"Assembly",lang:"JP",size:"",url:"rg-144-aile-strike-gundam-gat-x105-omni-enforcer-mobile-suit-assembly.pdf"}] },
  { id:362, grade:"RG", scale:"1/144", name:"Build Strike Gundam Full Package", series:"", imageUrl:null,
    manuals:[{id:362,name:"Assembly",lang:"JP",size:"",url:"rg-144-build-strike-gundam-full-package-assembly.pdf"}] },
  { id:363, grade:"RG", scale:"1/144", name:"Crossbone Gundam X1", series:"", imageUrl:null,
    manuals:[{id:363,name:"Assembly",lang:"JP",size:"",url:"rg-144-crossbone-gundam-x1-assembly.pdf"}] },
  { id:364, grade:"RG", scale:"1/144", name:"Destiny Gundam", series:"", imageUrl:null,
    manuals:[{id:364,name:"Assembly",lang:"JP",size:"",url:"rg-144-destiny-gundam-assembly.pdf"}] },
  { id:365, grade:"RG", scale:"1/144", name:"Force Impulse Gundam", series:"", imageUrl:null,
    manuals:[{id:365,name:"Assembly",lang:"JP",size:"",url:"rg-144-force-impulse-gundam-assembly.pdf"}] },
  { id:366, grade:"RG", scale:"1/144", name:"Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:366,name:"Assembly",lang:"JP",size:"",url:"rg-144-freedom-gundam-assembly.pdf"}] },
  { id:367, grade:"RG", scale:"1/144", name:"Full Armor Unicorn Gundam (full Psycho-frame Prototype Rx-0)", series:"", imageUrl:null,
    manuals:[{id:367,name:"Assembly",lang:"JP",size:"",url:"rg-144-full-armor-unicorn-gundam-full-psycho-frame-prototype-rx-0-assembly.pdf"}] },
  { id:368, grade:"RG", scale:"1/144", name:"Fx-550 Skygrasper (launcher Pack)", series:"", imageUrl:null,
    manuals:[{id:368,name:"Assembly",lang:"JP",size:"",url:"rg-144-fx-550-skygrasper-launcher-pack-assembly.pdf"}] },
  { id:369, grade:"RG", scale:"1/144", name:"God Gundam", series:"", imageUrl:null,
    manuals:[{id:369,name:"Assembly",lang:"JP",size:"",url:"rg-144-god-gundam-assembly.pdf"}] },
  { id:370, grade:"RG", scale:"1/144", name:"Gundam Astray Gold Frame Amatsu Mina", series:"", imageUrl:null,
    manuals:[{id:370,name:"Assembly",lang:"JP",size:"",url:"rg-144-gundam-astray-gold-frame-amatsu-mina-assembly.pdf"}] },
  { id:371, grade:"RG", scale:"1/144", name:"Gundam Astray Red Frame (real Grade 1/144 Scale)", series:"", imageUrl:null,
    manuals:[{id:371,name:"Assembly",lang:"JP",size:"",url:"rg-144-gundam-astray-red-frame-real-grade-1-144-scale-assembly.pdf"}] },
  { id:372, grade:"RG", scale:"1/144", name:"Gundam Epyon Mobile Suit Gundam Wing Oz-13ms", series:"", imageUrl:null,
    manuals:[{id:372,name:"Assembly",lang:"JP",size:"",url:"rg-144-gundam-epyon-mobile-suit-gundam-wing-oz-13ms-assembly.pdf"}] },
  { id:373, grade:"RG", scale:"1/144", name:"Gundam Exia (celestial Being Mobile Suit Gn-001)", series:"", imageUrl:null,
    manuals:[{id:373,name:"Assembly",lang:"JP",size:"",url:"rg-144-gundam-exia-celestial-being-mobile-suit-gn-001-assembly.pdf"}] },
  { id:374, grade:"RG", scale:"1/144", name:"Gundam GP01 Zephyranthes", series:"", imageUrl:null,
    manuals:[{id:374,name:"Assembly",lang:"JP",size:"",url:"rg-144-gundam-gp01-zephyranthes-assembly.pdf"}] },
  { id:375, grade:"RG", scale:"1/144", name:"Gundam Gp01fb Full Burnern", series:"", imageUrl:null,
    manuals:[{id:375,name:"Assembly",lang:"JP",size:"",url:"rg-144-gundam-gp01fb-full-burnern-assembly.pdf"}] },
  { id:376, grade:"RG", scale:"1/144", name:"Gundam Mk-ii A.e.u.g.", series:"", imageUrl:null,
    manuals:[{id:376,name:"Assembly",lang:"JP",size:"",url:"rg-144-gundam-mk-ii-a-e-u-g-assembly.pdf"}] },
  { id:377, grade:"RG", scale:"1/144", name:"Gundam Mk-ii Titans (gundam Mk-ii Titans Suit Rx-028)", series:"", imageUrl:null,
    manuals:[{id:377,name:"Assembly",lang:"JP",size:"",url:"rg-144-gundam-mk-ii-titans-gundam-mk-ii-titans-suit-rx-028-assembly.pdf"}] },
  { id:378, grade:"RG", scale:"1/144", name:"Justice Gundam", series:"", imageUrl:null,
    manuals:[{id:378,name:"Assembly",lang:"JP",size:"",url:"rg-144-justice-gundam-assembly.pdf"}] },
  { id:379, grade:"RG", scale:"1/144", name:"Ms-06f Zaku II (principality Of Zeon Mass Productive Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:379,name:"Assembly",lang:"JP",size:"",url:"rg-144-ms-06f-zaku-ii-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:380, grade:"RG", scale:"1/144", name:"Ms-06r-2 Johnny Ridden\'s Zaku II", series:"", imageUrl:null,
    manuals:[{id:380,name:"Assembly",lang:"JP",size:"",url:"rg-144-ms-06r-2-johnny-ridden-s-zaku-ii-assembly.pdf"}] },
  { id:381, grade:"RG", scale:"1/144", name:"Ms-06s Zaku II", series:"", imageUrl:null,
    manuals:[{id:381,name:"Assembly",lang:"JP",size:"",url:"rg-144-ms-06s-zaku-ii-assembly.pdf"}] },
  { id:382, grade:"RG", scale:"1/144", name:"Msm-07s Gouf (principal Zeon Char Aznable Use Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:382,name:"Assembly",lang:"JP",size:"",url:"rg-144-msm-07s-gouf-principal-zeon-char-aznable-use-mobile-suit-assembly.pdf"}] },
  { id:383, grade:"RG", scale:"1/144", name:"Msn-02 Zeong Principal Of Zeon Mobile Suit For New Type", series:"", imageUrl:null,
    manuals:[{id:383,name:"Assembly",lang:"JP",size:"",url:"rg-144-msn-02-zeong-principal-of-zeon-mobile-suit-for-new-type-assembly.pdf"}] },
  { id:384, grade:"RG", scale:"1/144", name:"Msn-04 Sazabi", series:"", imageUrl:null,
    manuals:[{id:384,name:"Assembly",lang:"JP",size:"",url:"rg-144-msn-04-sazabi-assembly.pdf"}] },
  { id:385, grade:"RG", scale:"1/144", name:"Neo Zeon Mobile Suit Customized For Newtype Msn-06s Sinanju", series:"", imageUrl:null,
    manuals:[{id:385,name:"Assembly",lang:"JP",size:"",url:"rg-144-neo-zeon-mobile-suit-customized-for-newtype-msn-06s-sinanju-assembly.pdf"}] },
  { id:386, grade:"RG", scale:"1/144", name:"Rx-78-02 Gundam (gundam The Origin)", series:"", imageUrl:null,
    manuals:[{id:386,name:"Assembly",lang:"JP",size:"",url:"rg-144-rx-78-02-gundam-gundam-the-origin-assembly.pdf"}] },
  { id:387, grade:"RG", scale:"1/144", name:"Rx-78-2 Gundam", series:"", imageUrl:null,
    manuals:[{id:387,name:"Assembly",lang:"JP",size:"",url:"rg-144-rx-78-2-gundam-assembly.pdf"}] },
  { id:388, grade:"RG", scale:"1/144", name:"Rx-93 V Gundam", series:"", imageUrl:null,
    manuals:[{id:388,name:"Assembly",lang:"JP",size:"",url:"rg-144-rx-93-v-gundam-assembly.pdf"}] },
  { id:389, grade:"RG", scale:"1/144", name:"Rx-93-ν2 Hi-ν Gundam", series:"", imageUrl:null,
    manuals:[{id:389,name:"Assembly",lang:"JP",size:"",url:"rg-144-rx-93-2-hi-gundam-assembly.pdf"}] },
  { id:390, grade:"RG", scale:"1/144", name:"Strike Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:390,name:"Assembly",lang:"JP",size:"",url:"rg-144-strike-freedom-gundam-assembly.pdf"}] },
  { id:391, grade:"RG", scale:"1/144", name:"Tallgeese EW Mobile Suit Gundam Wing Endless Waltz Oz-00ms RG 1/144 Tallgeese EW", series:"", imageUrl:null,
    manuals:[{id:391,name:"Assembly",lang:"JP",size:"",url:"rg-144-tallgeese-ew-mobile-suit-gundam-wing-endless-waltz-oz-00ms-rg-1-144-tallgeese-ew-assembly.pdf"}] },
  { id:392, grade:"RG", scale:"1/144", name:"Unicorn Gundam (full Psycho-frame Prototype Mobile Suit Rx-0)", series:"", imageUrl:null,
    manuals:[{id:392,name:"Assembly",lang:"JP",size:"",url:"rg-144-unicorn-gundam-full-psycho-frame-prototype-mobile-suit-rx-0-assembly.pdf"}] },
  { id:393, grade:"RG", scale:"1/144", name:"Unicorn Gundam 02 Banshee Norn (full Psycho Frame Prototype Suit Rx-0[n])", series:"", imageUrl:null,
    manuals:[{id:393,name:"Assembly",lang:"JP",size:"",url:"rg-144-unicorn-gundam-02-banshee-norn-full-psycho-frame-prototype-suit-rx-0-n-assembly.pdf"}] },
  { id:394, grade:"RG", scale:"1/144", name:"Wing Gundam (xxxg-01w)", series:"", imageUrl:null,
    manuals:[{id:394,name:"Assembly",lang:"JP",size:"",url:"rg-144-wing-gundam-xxxg-01w-assembly.pdf"}] },
  { id:395, grade:"RG", scale:"1/144", name:"Wing Gundam EW", series:"", imageUrl:null,
    manuals:[{id:395,name:"Assembly",lang:"JP",size:"",url:"rg-144-wing-gundam-ew-assembly.pdf"}] },
  { id:396, grade:"RG", scale:"1/144", name:"Wing Gundam Zero EW", series:"", imageUrl:null,
    manuals:[{id:396,name:"Assembly",lang:"JP",size:"",url:"rg-144-wing-gundam-zero-ew-assembly.pdf"}] },
  { id:397, grade:"RG", scale:"1/144", name:"Zeta Gundam", series:"", imageUrl:null,
    manuals:[{id:397,name:"Assembly",lang:"JP",size:"",url:"rg-144-zeta-gundam-assembly.pdf"}] },

  // ── MASTER GRADE (MG) ─────────────────────────────────
  { id:398, grade:"MG", scale:"1/100", name:"00 Gundam Seven Sword/g", series:"", imageUrl:null,
    manuals:[{id:398,name:"Assembly",lang:"JP",size:"",url:"mg-100-00-gundam-seven-sword-g-assembly.pdf"}] },
  { id:399, grade:"MG", scale:"1/100", name:"00 Qantt Full Saber (celestial Being Mobile Suit Gnt-0000/fs)", series:"", imageUrl:null,
    manuals:[{id:399,name:"Assembly",lang:"JP",size:"",url:"mg-100-00-qantt-full-saber-celestial-being-mobile-suit-gnt-0000-fs-assembly.pdf"}] },
  { id:400, grade:"MG", scale:"1/100", name:"00 Raiser (celestial Being Mobile Suit Gn-0000+gnr-010)", series:"", imageUrl:null,
    manuals:[{id:400,name:"Assembly",lang:"JP",size:"",url:"mg-100-00-raiser-celestial-being-mobile-suit-gn-0000-gnr-010-assembly.pdf"}] },
  { id:401, grade:"MG", scale:"1/100", name:"Aile Strike Gundam (o.m.n.i. Enforcer Mobile Suit Gat-x105)", series:"", imageUrl:null,
    manuals:[{id:401,name:"Assembly",lang:"JP",size:"",url:"mg-100-aile-strike-gundam-o-m-n-i-enforcer-mobile-suit-gat-x105-assembly.pdf"}] },
  { id:402, grade:"MG", scale:"1/100", name:"Ams-119 Geara Doga (neo Zeon Mass-produced Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:402,name:"Assembly",lang:"JP",size:"",url:"mg-100-ams-119-geara-doga-neo-zeon-mass-produced-mobile-suit-assembly.pdf"}] },
  { id:403, grade:"MG", scale:"1/100", name:"Amx-004-2 Qubeley Mk-ii (neo Zeon Prototype Mobile Suit For Newtype)", series:"", imageUrl:null,
    manuals:[{id:403,name:"Assembly",lang:"JP",size:"",url:"mg-100-amx-004-2-qubeley-mk-ii-neo-zeon-prototype-mobile-suit-for-newtype-assembly.pdf"}] },
  { id:404, grade:"MG", scale:"1/100", name:"Amx-004-3 Qubeley Mk-ii (neo Zeon Prototype Mobile Suit For Newtype)", series:"", imageUrl:null,
    manuals:[{id:404,name:"Assembly",lang:"JP",size:"",url:"mg-100-amx-004-3-qubeley-mk-ii-neo-zeon-prototype-mobile-suit-for-newtype-assembly.pdf"}] },
  { id:405, grade:"MG", scale:"1/100", name:"Asw-g-08 Gundam Barbatos", series:"", imageUrl:null,
    manuals:[{id:405,name:"Assembly",lang:"JP",size:"",url:"mg-100-asw-g-08-gundam-barbatos-assembly.pdf"}] },
  { id:407, grade:"MG", scale:"1/100", name:"Asw-g-08 Gundam Barbatos Lupus", series:"", imageUrl:null,
    manuals:[{id:407,name:"Assembly",lang:"JP",size:"",url:"mg-100-asw-g-08-gundam-barbatos-lupus-assembly.pdf"}] },
  { id:408, grade:"MG", scale:"1/100", name:"Asw-g-xx Gundam Vidar", series:"", imageUrl:null,
    manuals:[{id:408,name:"Assembly",lang:"JP",size:"",url:"mg-100-asw-g-xx-gundam-vidar-assembly.pdf"}] },
  { id:409, grade:"MG", scale:"1/100", name:"Build Gundam Mk-ii Rx-178b", series:"", imageUrl:null,
    manuals:[{id:409,name:"Assembly",lang:"JP",size:"",url:"mg-100-build-gundam-mk-ii-rx-178b-assembly.pdf"}] },
  { id:410, grade:"MG", scale:"1/100", name:"Build Strike Gundam Full Package (gat-x105b/fp)", series:"", imageUrl:null,
    manuals:[{id:410,name:"Assembly",lang:"JP",size:"",url:"mg-100-build-strike-gundam-full-package-gat-x105b-fp-assembly.pdf"}] },
  { id:411, grade:"MG", scale:"1/100", name:"Celestial Being Mobile Suit Gnt-0000 00 Qant", series:"", imageUrl:null,
    manuals:[{id:411,name:"Assembly",lang:"JP",size:"",url:"mg-100-celestial-being-mobile-suit-gnt-0000-00-qant-assembly.pdf"}] },
  { id:412, grade:"MG", scale:"1/100", name:"Concept-x 6-1-2 Turn X", series:"", imageUrl:null,
    manuals:[{id:412,name:"Assembly",lang:"JP",size:"",url:"mg-100-concept-x-6-1-2-turn-x-assembly.pdf"}] },
  { id:413, grade:"MG", scale:"1/100", name:"Cross Bone Gundam X1 \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:413,name:"Assembly",lang:"JP",size:"",url:"mg-100-cross-bone-gundam-x1-ver-ka-assembly.pdf"}] },
  { id:414, grade:"MG", scale:"1/100", name:"Ex-s Gundam (e.f.s.f. Prototype Transformable Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:414,name:"Assembly",lang:"JP",size:"",url:"mg-100-ex-s-gundam-e-f-s-f-prototype-transformable-mobile-suit-assembly.pdf"}] },
  { id:415, grade:"MG", scale:"1/100", name:"Ex-s Gundam / S Gundam", series:"", imageUrl:null,
    manuals:[{id:415,name:"Assembly",lang:"JP",size:"",url:"mg-100-ex-s-gundam-s-gundam-assembly.pdf"}] },
  { id:416, grade:"MG", scale:"1/100", name:"F.a. Test MS Fa-010-a Fazz \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:416,name:"Assembly",lang:"JP",size:"",url:"mg-100-f-a-test-ms-fa-010-a-fazz-ver-ka-assembly.pdf"}] },
  { id:417, grade:"MG", scale:"1/100", name:"F91 Gundam F91 (e.f.s.f. Prototype Attack Use Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:417,name:"Assembly",lang:"JP",size:"",url:"mg-100-f91-gundam-f91-e-f-s-f-prototype-attack-use-mobile-suit-assembly.pdf"}] },
  { id:418, grade:"MG", scale:"1/100", name:"F91 Gundam F91 (e.f.s.f. Prototype Attack Use Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:418,name:"Assembly",lang:"JP",size:"",url:"mg-100-f91-gundam-f91-e-f-s-f-prototype-attack-use-mobile-suit-assembly.pdf"}] },
  { id:419, grade:"MG", scale:"1/100", name:"Fa-010-a Fazz (e.f.s.f. Prototype Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:419,name:"Assembly",lang:"JP",size:"",url:"mg-100-fa-010-a-fazz-e-f-s-f-prototype-mobile-suit-assembly.pdf"}] },
  { id:420, grade:"MG", scale:"1/100", name:"Freedom Gundam Z.a.f.t. Mobile Suit Zgmf-x10a", series:"", imageUrl:null,
    manuals:[{id:420,name:"Assembly",lang:"JP",size:"",url:"mg-100-freedom-gundam-z-a-f-t-mobile-suit-zgmf-x10a-assembly.pdf"}] },
  { id:421, grade:"MG", scale:"1/100", name:"Gat-x102 Duel Gundam Assault Shroud", series:"", imageUrl:null,
    manuals:[{id:421,name:"Assembly",lang:"JP",size:"",url:"mg-100-gat-x102-duel-gundam-assault-shroud-assembly.pdf"}] },
  { id:422, grade:"MG", scale:"1/100", name:"Gat-x103 Buster Gundam", series:"", imageUrl:null,
    manuals:[{id:422,name:"Assembly",lang:"JP",size:"",url:"mg-100-gat-x103-buster-gundam-assembly.pdf"}] },
  { id:423, grade:"MG", scale:"1/100", name:"Gat-x105 Strike Gundam Ver.rm", series:"", imageUrl:null,
    manuals:[{id:423,name:"Assembly",lang:"JP",size:"",url:"mg-100-gat-x105-strike-gundam-ver-rm-assembly.pdf"}] },
  { id:424, grade:"MG", scale:"1/100", name:"Gat-x207 Blitz Gundam", series:"", imageUrl:null,
    manuals:[{id:424,name:"Assembly",lang:"JP",size:"",url:"mg-100-gat-x207-blitz-gundam-assembly.pdf"}] },
  { id:425, grade:"MG", scale:"1/100", name:"Gat-x303 Aegis Gundam", series:"", imageUrl:null,
    manuals:[{id:425,name:"Assembly",lang:"JP",size:"",url:"mg-100-gat-x303-aegis-gundam-assembly.pdf"}] },
  { id:426, grade:"MG", scale:"1/100", name:"Gnx-603t Gn-x Esf Gn Drive[t]-equipped Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:426,name:"Assembly",lang:"JP",size:"",url:"mg-100-gnx-603t-gn-x-esf-gn-drive-t-equipped-mobile-suit-assembly.pdf"}] },
  { id:427, grade:"MG", scale:"1/100", name:"Gundam", series:"", imageUrl:null,
    manuals:[{id:427,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-assembly.pdf"}] },
  { id:428, grade:"MG", scale:"1/100", name:"Gundam Age-1 Normal", series:"", imageUrl:null,
    manuals:[{id:428,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-age-1-normal-assembly.pdf"}] },
  { id:429, grade:"MG", scale:"1/100", name:"Gundam Age-1 Spallow", series:"", imageUrl:null,
    manuals:[{id:429,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-age-1-spallow-assembly.pdf"}] },
  { id:430, grade:"MG", scale:"1/100", name:"Gundam Age-1 Titus", series:"", imageUrl:null,
    manuals:[{id:430,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-age-1-titus-assembly.pdf"}] },
  { id:431, grade:"MG", scale:"1/100", name:"Gundam Age-2 Dark Hound", series:"", imageUrl:null,
    manuals:[{id:431,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-age-2-dark-hound-assembly.pdf"}] },
  { id:432, grade:"MG", scale:"1/100", name:"Gundam Age-2 Double Bullet", series:"", imageUrl:null,
    manuals:[{id:432,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-age-2-double-bullet-assembly.pdf"}] },
  { id:433, grade:"MG", scale:"1/100", name:"Gundam Age-2 Normal", series:"", imageUrl:null,
    manuals:[{id:433,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-age-2-normal-assembly.pdf"}] },
  { id:434, grade:"MG", scale:"1/100", name:"Gundam Ageii Magnum (ryoya Kujos Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:434,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-ageii-magnum-ryoya-kujos-mobile-suit-assembly.pdf"}] },
  { id:435, grade:"MG", scale:"1/100", name:"Gundam Amazing Red Warrior Pf-78-3a", series:"", imageUrl:null,
    manuals:[{id:435,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-amazing-red-warrior-pf-78-3a-assembly.pdf"}] },
  { id:436, grade:"MG", scale:"1/100", name:"Gundam Astray Blue Frame D (gai Murakumo\'s Custom Mobile Suit Mbf-p03d)", series:"", imageUrl:null,
    manuals:[{id:436,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-astray-blue-frame-d-gai-murakumo-s-custom-mobile-suit-mbf-p03d-assembly.pdf"}] },
  { id:437, grade:"MG", scale:"1/100", name:"Gundam Dynames (celestial Being Mobile Suit Gn-002)", series:"", imageUrl:null,
    manuals:[{id:437,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-dynames-celestial-being-mobile-suit-gn-002-assembly.pdf"}] },
  { id:438, grade:"MG", scale:"1/100", name:"Gundam Epyon Mobile Suit Oz-13ms", series:"", imageUrl:null,
    manuals:[{id:438,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-epyon-mobile-suit-oz-13ms-assembly.pdf"}] },
  { id:439, grade:"MG", scale:"1/100", name:"Gundam Exia (celestial Being Mobile Suit Gn-001)", series:"", imageUrl:null,
    manuals:[{id:439,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-exia-celestial-being-mobile-suit-gn-001-assembly.pdf"}] },
  { id:440, grade:"MG", scale:"1/100", name:"Gundam Exia Dark Matter Ppgn-001", series:"", imageUrl:null,
    manuals:[{id:440,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-exia-dark-matter-ppgn-001-assembly.pdf"}] },
  { id:441, grade:"MG", scale:"1/100", name:"Gundam Fenice Rinascita Xxxg-01wfr", series:"", imageUrl:null,
    manuals:[{id:441,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-fenice-rinascita-xxxg-01wfr-assembly.pdf"}] },
  { id:442, grade:"MG", scale:"1/100", name:"Gundam Gp03s (e.f.s.f. Attack Use Prototype Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:442,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-gp03s-e-f-s-f-attack-use-prototype-mobile-suit-assembly.pdf"}] },
  { id:443, grade:"MG", scale:"1/100", name:"Gundam Kyrios (celestial Being Mobile Suit Gn-003)", series:"", imageUrl:null,
    manuals:[{id:443,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-kyrios-celestial-being-mobile-suit-gn-003-assembly.pdf"}] },
  { id:444, grade:"MG", scale:"1/100", name:"Gundam Rx-78 Gp02a (u.n.t. Spacy Prototype Tactical Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:444,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-rx-78-gp02a-u-n-t-spacy-prototype-tactical-mobile-suit-assembly.pdf"}] },
  { id:445, grade:"MG", scale:"1/100", name:"Gundam Rx-78/c.a", series:"", imageUrl:null,
    manuals:[{id:445,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-rx-78-c-a-assembly.pdf"}] },
  { id:446, grade:"MG", scale:"1/100", name:"Gundam Spiegel Neo Germany Mobile Fighter Gf13-021ng", series:"", imageUrl:null,
    manuals:[{id:446,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-spiegel-neo-germany-mobile-fighter-gf13-021ng-assembly.pdf"}] },
  { id:447, grade:"MG", scale:"1/100", name:"Gundam Virtue (celestial Being Mobile Suit Gn-005)", series:"", imageUrl:null,
    manuals:[{id:447,name:"Assembly",lang:"JP",size:"",url:"mg-100-gundam-virtue-celestial-being-mobile-suit-gn-005-assembly.pdf"}] },
  { id:448, grade:"MG", scale:"1/100", name:"Gx-9900 Gundam X (satellite System Loading Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:448,name:"Assembly",lang:"JP",size:"",url:"mg-100-gx-9900-gundam-x-satellite-system-loading-mobile-suit-assembly.pdf"}] },
  { id:449, grade:"MG", scale:"1/100", name:"Gx-9901-dx Gundam Double X (satellite System Loading Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:449,name:"Assembly",lang:"JP",size:"",url:"mg-100-gx-9901-dx-gundam-double-x-satellite-system-loading-mobile-suit-assembly.pdf"}] },
  { id:450, grade:"MG", scale:"1/100", name:"Master Gundam Neo Hong Kong Mobile Fighter Gf13-001nhii", series:"", imageUrl:null,
    manuals:[{id:450,name:"Assembly",lang:"JP",size:"",url:"mg-100-master-gundam-neo-hong-kong-mobile-fighter-gf13-001nhii-assembly.pdf"}] },
  { id:451, grade:"MG", scale:"1/100", name:"Mobile Fighter G Gundam", series:"", imageUrl:null,
    manuals:[{id:451,name:"Assembly",lang:"JP",size:"",url:"mg-100-mobile-fighter-g-gundam-assembly.pdf"}] },
  { id:452, grade:"MG", scale:"1/100", name:"Mobile Suit Amx-004 Qubeley (axis Prototype Mobile Suit For Newtype)", series:"", imageUrl:null,
    manuals:[{id:452,name:"Assembly",lang:"JP",size:"",url:"mg-100-mobile-suit-amx-004-qubeley-axis-prototype-mobile-suit-for-newtype-assembly.pdf"}] },
  { id:453, grade:"MG", scale:"1/100", name:"Mobile Suit Fa-78 Full Armor Gundam [gundam Thunderbolt] \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:453,name:"Assembly",lang:"JP",size:"",url:"mg-100-mobile-suit-fa-78-full-armor-gundam-gundam-thunderbolt-ver-ka-assembly.pdf"}] },
  { id:454, grade:"MG", scale:"1/100", name:"Mobile Suit Lm314v21 Victory Two Gundam \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:454,name:"Assembly",lang:"JP",size:"",url:"mg-100-mobile-suit-lm314v21-victory-two-gundam-ver-ka-assembly.pdf"}] },
  { id:455, grade:"MG", scale:"1/100", name:"Mobile Suit Msm-07 Z\'gok", series:"", imageUrl:null,
    manuals:[{id:455,name:"Assembly",lang:"JP",size:"",url:"mg-100-mobile-suit-msm-07-z-gok-assembly.pdf"}] },
  { id:456, grade:"MG", scale:"1/100", name:"Mobile Suit Msn-06s Sinanju Stein \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:456,name:"Assembly",lang:"JP",size:"",url:"mg-100-mobile-suit-msn-06s-sinanju-stein-ver-ka-assembly.pdf"}] },
  { id:457, grade:"MG", scale:"1/100", name:"Mobile Suit Rgm-79(g) (e.f.s.f. First Production Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:457,name:"Assembly",lang:"JP",size:"",url:"mg-100-mobile-suit-rgm-79g-e-f-s-f-first-production-mobile-suit-assembly.pdf"}] },
  { id:458, grade:"MG", scale:"1/100", name:"Mobile Suit Rx-78-2 Gundam Ver.ka", series:"", imageUrl:null,
    manuals:[{id:458,name:"Assembly",lang:"JP",size:"",url:"mg-100-mobile-suit-rx-78-2-gundam-ver-ka-assembly.pdf"}] },
  { id:459, grade:"MG", scale:"1/100", name:"Mobile Suit Rx-78-3 Gundam (u.n.t.spacy Prototype Close-combat Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:459,name:"Assembly",lang:"JP",size:"",url:"mg-100-mobile-suit-rx-78-3-gundam-u-n-t-spacy-prototype-close-combat-mobile-suit-assembly.pdf"}] },
  { id:460, grade:"MG", scale:"1/100", name:"Mobile Suit Rx-93 Ν Gundam Ver.ka", series:"", imageUrl:null,
    manuals:[{id:460,name:"Assembly",lang:"JP",size:"",url:"mg-100-mobile-suit-rx-93-gundam-ver-ka-assembly.pdf"}] },
  { id:461, grade:"MG", scale:"1/100", name:"Ms-05b Zaku I (principality Of Zeon Mass Productive Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:461,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-05b-zaku-i-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:462, grade:"MG", scale:"1/100", name:"Ms-06f Zaku II", series:"", imageUrl:null,
    manuals:[{id:462,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06f-zaku-ii-assembly.pdf"}] },
  { id:463, grade:"MG", scale:"1/100", name:"Ms-06f Zaku Minelayer", series:"", imageUrl:null,
    manuals:[{id:463,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06f-zaku-minelayer-assembly.pdf"}] },
  { id:464, grade:"MG", scale:"1/100", name:"Ms-06f-2 Zaku II F2 (principality Of Zeon Mass Productive Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:464,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06f-2-zaku-ii-f2-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:465, grade:"MG", scale:"1/100", name:"Ms-06f-2 Zakuii F2 (e.f.s.f. Mass Productive Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:465,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06f-2-zakuii-f2-e-f-s-f-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:466, grade:"MG", scale:"1/100", name:"Ms-06j Zaku II", series:"", imageUrl:null,
    manuals:[{id:466,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06j-zaku-ii-assembly.pdf"}] },
  { id:467, grade:"MG", scale:"1/100", name:"Ms-06k Zakucannon", series:"", imageUrl:null,
    manuals:[{id:467,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06k-zakucannon-assembly.pdf"}] },
  { id:468, grade:"MG", scale:"1/100", name:"Ms-06r Zaku II High Mobility Type \"psycho Zaku\" [gundam Thunderbolt] Ver.ka", series:"", imageUrl:null,
    manuals:[{id:468,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06r-zaku-ii-high-mobility-type-psycho-zaku-gundam-thunderbolt-ver-ka-assembly.pdf"}] },
  { id:469, grade:"MG", scale:"1/100", name:"Ms-06r-1 Zaku II (zeon Duedom Samsinaga\'s Customize White Suit)", series:"", imageUrl:null,
    manuals:[{id:469,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06r-1-zaku-ii-zeon-duedom-samsinaga-s-customize-white-suit-assembly.pdf"}] },
  { id:470, grade:"MG", scale:"1/100", name:"Ms-06r-1a Zaku II", series:"", imageUrl:null,
    manuals:[{id:470,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06r-1a-zaku-ii-assembly.pdf"}] },
  { id:471, grade:"MG", scale:"1/100", name:"Ms-06r-1a Zaku II (principality Of Zeon Mass Productive Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:471,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06r-1a-zaku-ii-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:472, grade:"MG", scale:"1/100", name:"Ms-06r-2 Zaku II", series:"", imageUrl:null,
    manuals:[{id:472,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06r-2-zaku-ii-assembly.pdf"}] },
  { id:473, grade:"MG", scale:"1/100", name:"Ms-06r-2 Zaku II (zeon Dukedom J.ridden\'s Customize Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:473,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06r-2-zaku-ii-zeon-dukedom-j-ridden-s-customize-mobile-suit-assembly.pdf"}] },
  { id:474, grade:"MG", scale:"1/100", name:"Ms-06s Zaku II (char Aznable\'s Customize Ver.2.0)", series:"", imageUrl:null,
    manuals:[{id:474,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-06s-zaku-ii-char-aznable-s-customize-ver-2-0-assembly.pdf"}] },
  { id:475, grade:"MG", scale:"1/100", name:"Ms-07b Gouf (principality Of Zeon Mass Productive Land Battle Type Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:475,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-07b-gouf-principality-of-zeon-mass-productive-land-battle-type-mobile-suit-assembly.pdf"}] },
  { id:476, grade:"MG", scale:"1/100", name:"Ms-07b Gouf Ver.2.0", series:"", imageUrl:null,
    manuals:[{id:476,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-07b-gouf-ver-2-0-assembly.pdf"}] },
  { id:477, grade:"MG", scale:"1/100", name:"Ms-09 Dom", series:"", imageUrl:null,
    manuals:[{id:477,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-09-dom-assembly.pdf"}] },
  { id:478, grade:"MG", scale:"1/100", name:"Ms-09r Rick Dom", series:"", imageUrl:null,
    manuals:[{id:478,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-09r-rick-dom-assembly.pdf"}] },
  { id:479, grade:"MG", scale:"1/100", name:"Ms-09rs Rick-dom (principality Of Zeon Char\'s Customize Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:479,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-09rs-rick-dom-principality-of-zeon-char-s-customize-mobile-suit-assembly.pdf"}] },
  { id:480, grade:"MG", scale:"1/100", name:"Ms-14a Gelgoog (principality Of Zeon Anavel Gato\'s Customize Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:480,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-14a-gelgoog-principality-of-zeon-anavel-gato-s-customize-mobile-suit-assembly.pdf"}] },
  { id:481, grade:"MG", scale:"1/100", name:"Ms-14a Gelgoog Ver.2.0", series:"", imageUrl:null,
    manuals:[{id:481,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-14a-gelgoog-ver-2-0-assembly.pdf"}] },
  { id:482, grade:"MG", scale:"1/100", name:"Ms-14b/c Gelgoog Cannon", series:"", imageUrl:null,
    manuals:[{id:482,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-14b-c-gelgoog-cannon-assembly.pdf"}] },
  { id:483, grade:"MG", scale:"1/100", name:"Ms-14s Gelgoog", series:"", imageUrl:null,
    manuals:[{id:483,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-14s-gelgoog-assembly.pdf"}] },
  { id:484, grade:"MG", scale:"1/100", name:"Ms-14s Gelgoog (principality Of Zeon Char Aznable\'s Customize Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:484,name:"Assembly",lang:"JP",size:"",url:"mg-100-ms-14s-gelgoog-principality-of-zeon-char-aznable-s-customize-mobile-suit-assembly.pdf"}] },
  { id:485, grade:"MG", scale:"1/100", name:"Msa-0011 S-gundam (e.f.s.f. Prototype Transformable Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:485,name:"Assembly",lang:"JP",size:"",url:"mg-100-msa-0011-s-gundam-e-f-s-f-prototype-transformable-mobile-suit-assembly.pdf"}] },
  { id:486, grade:"MG", scale:"1/100", name:"Msm-03 Gogg", series:"", imageUrl:null,
    manuals:[{id:486,name:"Assembly",lang:"JP",size:"",url:"mg-100-msm-03-gogg-assembly.pdf"}] },
  { id:487, grade:"MG", scale:"1/100", name:"Msm-04 Acguay (principality Of Zeon Mass-productive Amphibious Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:487,name:"Assembly",lang:"JP",size:"",url:"mg-100-msm-04-acguay-principality-of-zeon-mass-productive-amphibious-mobile-suit-assembly.pdf"}] },
  { id:488, grade:"MG", scale:"1/100", name:"Msm-07s Z\'gok (principality Of Zeon Char\'s Custom Type Amphibious Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:488,name:"Assembly",lang:"JP",size:"",url:"mg-100-msm-07s-z-gok-principality-of-zeon-char-s-custom-type-amphibious-mobile-suit-assembly.pdf"}] },
  { id:489, grade:"MG", scale:"1/100", name:"Msn-00100 Hyaku-shiki", series:"", imageUrl:null,
    manuals:[{id:489,name:"Assembly",lang:"JP",size:"",url:"mg-100-msn-00100-hyaku-shiki-assembly.pdf"}] },
  { id:490, grade:"MG", scale:"1/100", name:"Msn-00100 Hyaku-shiki (a.e.u.g. Attack Use Prototype Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:490,name:"Assembly",lang:"JP",size:"",url:"mg-100-msn-00100-hyaku-shiki-a-e-u-g-attack-use-prototype-mobile-suit-assembly.pdf"}] },
  { id:491, grade:"MG", scale:"1/100", name:"Msn-001a1 Delta Plus (e.f.s.f. Transformable Mobile Suit Prototype)", series:"", imageUrl:null,
    manuals:[{id:491,name:"Assembly",lang:"JP",size:"",url:"mg-100-msn-001a1-delta-plus-e-f-s-f-transformable-mobile-suit-prototype-assembly.pdf"}] },
  { id:492, grade:"MG", scale:"1/100", name:"Msn-02 Perfect Zeong (principality Of Zeon Mobile Suit For Newtype)", series:"", imageUrl:null,
    manuals:[{id:492,name:"Assembly",lang:"JP",size:"",url:"mg-100-msn-02-perfect-zeong-principality-of-zeon-mobile-suit-for-newtype-assembly.pdf"}] },
  { id:493, grade:"MG", scale:"1/100", name:"Msn-02 Zeong (principality Of Zeon Mobile Suit For Newtype)", series:"", imageUrl:null,
    manuals:[{id:493,name:"Assembly",lang:"JP",size:"",url:"mg-100-msn-02-zeong-principality-of-zeon-mobile-suit-for-newtype-assembly.pdf"}] },
  { id:494, grade:"MG", scale:"1/100", name:"Msn-04 Sazabi (neo Zeon Char Aznable\'s Customize Mobile Suit For New Type)", series:"", imageUrl:null,
    manuals:[{id:494,name:"Assembly",lang:"JP",size:"",url:"mg-100-msn-04-sazabi-neo-zeon-char-aznable-s-customize-mobile-suit-for-new-type-assembly.pdf"}] },
  { id:495, grade:"MG", scale:"1/100", name:"Msn-06s Sinanju", series:"", imageUrl:null,
    manuals:[{id:495,name:"Assembly",lang:"JP",size:"",url:"mg-100-msn-06s-sinanju-assembly.pdf"}] },
  { id:496, grade:"MG", scale:"1/100", name:"Msn-06s-2 Sinanju Stein (narrative VER.)", series:"", imageUrl:null,
    manuals:[{id:496,name:"Assembly",lang:"JP",size:"",url:"mg-100-msn-06s-2-sinanju-stein-narrative-ver-assembly.pdf"}] },
  { id:497, grade:"MG", scale:"1/100", name:"Msz-006a1 Zeta Plus (karaba Production Type Transformable Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:497,name:"Assembly",lang:"JP",size:"",url:"mg-100-msz-006a1-zeta-plus-karaba-production-type-transformable-mobile-suit-assembly.pdf"}] },
  { id:498, grade:"MG", scale:"1/100", name:"Msz-006c1 Zeta Plus C1", series:"", imageUrl:null,
    manuals:[{id:498,name:"Assembly",lang:"JP",size:"",url:"mg-100-msz-006c1-zeta-plus-c1-assembly.pdf"}] },
  { id:499, grade:"MG", scale:"1/100", name:"Mvf-x08 Eclipse Gundam", series:"", imageUrl:null,
    manuals:[{id:499,name:"Assembly",lang:"JP",size:"",url:"mg-100-mvf-x08-eclipse-gundam-assembly.pdf"}] },
  { id:500, grade:"MG", scale:"1/100", name:"Oz-00ms Tallgeese (gundam W Endless Waltz)", series:"", imageUrl:null,
    manuals:[{id:500,name:"Assembly",lang:"JP",size:"",url:"mg-100-oz-00ms-tallgeese-gundam-w-endless-waltz-assembly.pdf"}] },
  { id:501, grade:"MG", scale:"1/100", name:"Plan303e Deep Striker", series:"", imageUrl:null,
    manuals:[{id:501,name:"Assembly",lang:"JP",size:"",url:"mg-100-plan303e-deep-striker-assembly.pdf"}] },
  { id:502, grade:"MG", scale:"1/100", name:"Providence Gundam (z.a.f.t. Mobile Suit Zgmf-x13a)", series:"", imageUrl:null,
    manuals:[{id:502,name:"Assembly",lang:"JP",size:"",url:"mg-100-providence-gundam-z-a-f-t-mobile-suit-zgmf-x13a-assembly.pdf"}] },
  { id:503, grade:"MG", scale:"1/100", name:"Rb-79 Middle-range Support Type Mobile Pod Ball Ver.ka", series:"", imageUrl:null,
    manuals:[{id:503,name:"Assembly",lang:"JP",size:"",url:"mg-100-rb-79-middle-range-support-type-mobile-pod-ball-ver-ka-assembly.pdf"}] },
  { id:504, grade:"MG", scale:"1/100", name:"Rb-79k Ball", series:"", imageUrl:null,
    manuals:[{id:504,name:"Assembly",lang:"JP",size:"",url:"mg-100-rb-79k-ball-assembly.pdf"}] },
  { id:505, grade:"MG", scale:"1/100", name:"Rgm-79 Gm", series:"", imageUrl:null,
    manuals:[{id:505,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgm-79-gm-assembly.pdf"}] },
  { id:506, grade:"MG", scale:"1/100", name:"Rgm-79(g) Gm Sniper (e.e.g.f. First Production Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:506,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgm-79g-gm-sniper-e-e-g-f-first-production-mobile-suit-assembly.pdf"}] },
  { id:507, grade:"MG", scale:"1/100", name:"Rgm-79c Gm Type C (e.f.s.f. First Production Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:507,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgm-79c-gm-type-c-e-f-s-f-first-production-mobile-suit-assembly.pdf"}] },
  { id:508, grade:"MG", scale:"1/100", name:"Rgm-79c Gm Type C (e.f.s.f. Mass Productive Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:508,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgm-79c-gm-type-c-e-f-s-f-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:509, grade:"MG", scale:"1/100", name:"Rgm-79g Gm Command (colony Type)", series:"", imageUrl:null,
    manuals:[{id:509,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgm-79g-gm-command-colony-type-assembly.pdf"}] },
  { id:510, grade:"MG", scale:"1/100", name:"Rgm-79sc Gm Sniper Custom", series:"", imageUrl:null,
    manuals:[{id:510,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgm-79sc-gm-sniper-custom-assembly.pdf"}] },
  { id:511, grade:"MG", scale:"1/100", name:"Rgm-79sp Gm Sniper II", series:"", imageUrl:null,
    manuals:[{id:511,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgm-79sp-gm-sniper-ii-assembly.pdf"}] },
  { id:512, grade:"MG", scale:"1/100", name:"Rgm-89 Jegan", series:"", imageUrl:null,
    manuals:[{id:512,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgm-89-jegan-assembly.pdf"}] },
  { id:513, grade:"MG", scale:"1/100", name:"Rgm-96x Jesta", series:"", imageUrl:null,
    manuals:[{id:513,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgm-96x-jesta-assembly.pdf"}] },
  { id:514, grade:"MG", scale:"1/100", name:"Rgz-91 Re-gz (e.f.s.f. Attack Use Variable Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:514,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgz-91-re-gz-e-f-s-f-attack-use-variable-mobile-suit-assembly.pdf"}] },
  { id:515, grade:"MG", scale:"1/100", name:"Rgz-95c Rezel Type-c (defenser A+b-unit)(gr)", series:"", imageUrl:null,
    manuals:[{id:515,name:"Assembly",lang:"JP",size:"",url:"mg-100-rgz-95c-rezel-type-c-defenser-a-b-unitgr-assembly.pdf"}] },
  { id:516, grade:"MG", scale:"1/100", name:"Rms-099 Rick Dias (a.e.u.g. Quattro Vageena\'s Customize Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:516,name:"Assembly",lang:"JP",size:"",url:"mg-100-rms-099-rick-dias-a-e-u-g-quattro-vageena-s-customize-mobile-suit-assembly.pdf"}] },
  { id:517, grade:"MG", scale:"1/100", name:"Rms-106 Hi-zack Titans Mass Productive Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:517,name:"Assembly",lang:"JP",size:"",url:"mg-100-rms-106-hi-zack-titans-mass-productive-mobile-suit-assembly.pdf"}] },
  { id:518, grade:"MG", scale:"1/100", name:"Rms-108 Marasai", series:"", imageUrl:null,
    manuals:[{id:518,name:"Assembly",lang:"JP",size:"",url:"mg-100-rms-108-marasai-assembly.pdf"}] },
  { id:519, grade:"MG", scale:"1/100", name:"Rx-0 Full Armor Unicorn Gundam \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:519,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-0-full-armor-unicorn-gundam-ver-ka-assembly.pdf"}] },
  { id:520, grade:"MG", scale:"1/100", name:"Rx-0 Unicorn Gundam 02 Banshee", series:"", imageUrl:null,
    manuals:[{id:520,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-0-unicorn-gundam-02-banshee-assembly.pdf"}] },
  { id:521, grade:"MG", scale:"1/100", name:"Rx-0 Unicorn Gundam 03 Phenex", series:"", imageUrl:null,
    manuals:[{id:521,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-0-unicorn-gundam-03-phenex-assembly.pdf"}] },
  { id:522, grade:"MG", scale:"1/100", name:"Rx-178 Gundam Mk-ii A.e.u.g. Prototype Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:522,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-178-gundam-mk-ii-a-e-u-g-prototype-mobile-suit-assembly.pdf"}] },
  { id:523, grade:"MG", scale:"1/100", name:"Rx-178 Gundam Mk-ii Ver.2.0 Titans Prototype Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:523,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-178-gundam-mk-ii-ver-2-0-titans-prototype-mobile-suit-assembly.pdf"}] },
  { id:524, grade:"MG", scale:"1/100", name:"Rx-77-2 Gungannon (e.f.s.f Prototype Middle-range Support Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:524,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-77-2-gungannon-e-f-s-f-prototype-middle-range-support-mobile-suit-assembly.pdf"}] },
  { id:525, grade:"MG", scale:"1/100", name:"Rx-78 Gundam GP01 (u.n.t. Space Prototype Multipurpose Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:525,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-78-gundam-gp01-u-n-t-space-prototype-multipurpose-mobile-suit-assembly.pdf"}] },
  { id:526, grade:"MG", scale:"1/100", name:"Rx-78-2 Gundam (e.f.s.f. Prototype Close-combat Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:526,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-78-2-gundam-e-f-s-f-prototype-close-combat-mobile-suit-assembly.pdf"}] },
  { id:527, grade:"MG", scale:"1/100", name:"Rx-78-4 Gundam Go4 (e.f.s.f. Prototype Mobile Suit Of Space Battle Use)", series:"", imageUrl:null,
    manuals:[{id:527,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-78-4-gundam-go4-e-f-s-f-prototype-mobile-suit-of-space-battle-use-assembly.pdf"}] },
  { id:528, grade:"MG", scale:"1/100", name:"Rx-78-5 Gundam G05 (e.f.s.f. Prototype Mobile Suit Of Space Battle Use)", series:"", imageUrl:null,
    manuals:[{id:528,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-78-5-gundam-g05-e-f-s-f-prototype-mobile-suit-of-space-battle-use-assembly.pdf"}] },
  { id:529, grade:"MG", scale:"1/100", name:"Rx-78nt-1 Gundam Nt-1 (e.f.s.f. Prototype Mobile Suit For Newtype)", series:"", imageUrl:null,
    manuals:[{id:529,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-78nt-1-gundam-nt-1-e-f-s-f-prototype-mobile-suit-for-newtype-assembly.pdf"}] },
  { id:530, grade:"MG", scale:"1/100", name:"Rx-93 Ν Gundam (e.f.s.f. Amuro Ray\'s Customize Mobile Suit For New Type)", series:"", imageUrl:null,
    manuals:[{id:530,name:"Assembly",lang:"JP",size:"",url:"mg-100-rx-93-gundam-e-f-s-f-amuro-ray-s-customize-mobile-suit-for-new-type-assembly.pdf"}] },
  { id:531, grade:"MG", scale:"1/100", name:"Sengoku Astray Gundam", series:"", imageUrl:null,
    manuals:[{id:531,name:"Assembly",lang:"JP",size:"",url:"mg-100-sengoku-astray-gundam-assembly.pdf"}] },
  { id:532, grade:"MG", scale:"1/100", name:"Shining Gundam (neo Japan Mobile Fighter)", series:"", imageUrl:null,
    manuals:[{id:532,name:"Assembly",lang:"JP",size:"",url:"mg-100-shining-gundam-neo-japan-mobile-fighter-assembly.pdf"}] },
  { id:533, grade:"MG", scale:"1/100", name:"Strike Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:533,name:"Assembly",lang:"JP",size:"",url:"mg-100-strike-freedom-gundam-assembly.pdf"}] },
  { id:534, grade:"MG", scale:"1/100", name:"Strike Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:534,name:"Assembly",lang:"JP",size:"",url:"mg-100-strike-freedom-gundam-assembly.pdf"}] },
  { id:535, grade:"MG", scale:"1/100", name:"Strike Rouge (orb Mobile Suit Mbf-02)", series:"", imageUrl:null,
    manuals:[{id:535,name:"Assembly",lang:"JP",size:"",url:"mg-100-strike-rouge-orb-mobile-suit-mbf-02-assembly.pdf"}] },
  { id:536, grade:"MG", scale:"1/100", name:"Universe Booster Ub-01 Star Build Strike Gundam Support Unit", series:"", imageUrl:null,
    manuals:[{id:536,name:"Assembly",lang:"JP",size:"",url:"mg-100-universe-booster-ub-01-star-build-strike-gundam-support-unit-assembly.pdf"}] },
  { id:537, grade:"MG", scale:"1/100", name:"Wing Gundam Proto Zero Mobile Suit Xxxg-00w0", series:"", imageUrl:null,
    manuals:[{id:537,name:"Assembly",lang:"JP",size:"",url:"mg-100-wing-gundam-proto-zero-mobile-suit-xxxg-00w0-assembly.pdf"}] },
  { id:538, grade:"MG", scale:"1/100", name:"Wing Gundam Xxxg-01w", series:"", imageUrl:null,
    manuals:[{id:538,name:"Assembly",lang:"JP",size:"",url:"mg-100-wing-gundam-xxxg-01w-assembly.pdf"}] },
  { id:539, grade:"MG", scale:"1/100", name:"Wing Gundam Zero", series:"", imageUrl:null,
    manuals:[{id:539,name:"Assembly",lang:"JP",size:"",url:"mg-100-wing-gundam-zero-assembly.pdf"}] },
  { id:540, grade:"MG", scale:"1/100", name:"Xxxg-01h Gundam Heavyarms", series:"", imageUrl:null,
    manuals:[{id:540,name:"Assembly",lang:"JP",size:"",url:"mg-100-xxxg-01h-gundam-heavyarms-assembly.pdf"}] },
  { id:541, grade:"MG", scale:"1/100", name:"Xxxg-01sr Gundam Sandrock", series:"", imageUrl:null,
    manuals:[{id:541,name:"Assembly",lang:"JP",size:"",url:"mg-100-xxxg-01sr-gundam-sandrock-assembly.pdf"}] },
  { id:542, grade:"MG", scale:"1/100", name:"Z.a.f.t. Mobile Suit Zgmf-x09a Justice Gundam", series:"", imageUrl:null,
    manuals:[{id:542,name:"Assembly",lang:"JP",size:"",url:"mg-100-z-a-f-t-mobile-suit-zgmf-x09a-justice-gundam-assembly.pdf"}] },
  { id:543, grade:"MG", scale:"1/100", name:"Z.a.f.t. Mobile Suit Zgmf-x10a Freedom Gundam Ver.2.0", series:"", imageUrl:null,
    manuals:[{id:543,name:"Assembly",lang:"JP",size:"",url:"mg-100-z-a-f-t-mobile-suit-zgmf-x10a-freedom-gundam-ver-2-0-assembly.pdf"}] },
  { id:544, grade:"MG", scale:"1/100", name:"Zgmf-1000/a1 Gunner Zaku Warrior (lunamaria Hawke Custom)", series:"", imageUrl:null,
    manuals:[{id:544,name:"Assembly",lang:"JP",size:"",url:"mg-100-zgmf-1000-a1-gunner-zaku-warrior-lunamaria-hawke-custom-assembly.pdf"}] },
  { id:545, grade:"MG", scale:"1/100", name:"Zgmf-1017 Mobile Ginn", series:"", imageUrl:null,
    manuals:[{id:545,name:"Assembly",lang:"JP",size:"",url:"mg-100-zgmf-1017-mobile-ginn-assembly.pdf"}] },
  { id:546, grade:"MG", scale:"1/100", name:"MGSD Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:546,name:"Assembly",lang:"JP",size:"",url:"mg-100-zgmf-x10a-freedom-gundam-assembly.pdf"}] },
  { id:547, grade:"MG", scale:"1/100", name:"Zgmf-x42s Destiny Gundam", series:"", imageUrl:null,
    manuals:[{id:547,name:"Assembly",lang:"JP",size:"",url:"mg-100-zgmf-x42s-destiny-gundam-assembly.pdf"}] },

  // ── PERFECT GRADE (PG) ────────────────────────────────
  { id:548, grade:"PG", scale:"1/60", name:"00 Raiser (double Orizer)", series:"", imageUrl:null,
    manuals:[{id:548,name:"Assembly",lang:"JP",size:"",url:"pg-60-00-raiser-double-orizer-assembly.pdf"}] },
  { id:549, grade:"PG", scale:"1/60", name:"Fx-550 Skygrasper + Aqm/e-x01 Aile Striker", series:"", imageUrl:null,
    manuals:[{id:549,name:"Assembly",lang:"JP",size:"",url:"pg-60-fx-550-skygrasper-aqm-e-x01-aile-striker-assembly.pdf"}] },
  { id:550, grade:"PG", scale:"1/60", name:"Gat-x105 Strike Gundam", series:"", imageUrl:null,
    manuals:[{id:550,name:"Assembly",lang:"JP",size:"",url:"pg-60-gat-x105-strike-gundam-assembly.pdf"}] },
  { id:551, grade:"PG", scale:"1/60", name:"Gat-x105+aqm/e-ym1 Perfect Strike Gundam (o.m.n.i. Enforcer Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:551,name:"Assembly",lang:"JP",size:"",url:"pg-60-gat-x105-aqm-e-ym1-perfect-strike-gundam-o-m-n-i-enforcer-mobile-suit-assembly.pdf"}] },
  { id:552, grade:"PG", scale:"1/60", name:"Gundam Exia (celestial Being Mobile Suit Gn-001)", series:"", imageUrl:null,
    manuals:[{id:552,name:"Assembly",lang:"JP",size:"",url:"pg-60-gundam-exia-celestial-being-mobile-suit-gn-001-assembly.pdf"}] },
  { id:553, grade:"PG", scale:"1/60", name:"Gundam Seven Sword/g", series:"", imageUrl:null,
    manuals:[{id:553,name:"Assembly",lang:"JP",size:"",url:"pg-60-gundam-seven-sword-g-assembly.pdf"}] },
  { id:554, grade:"PG", scale:"1/60", name:"Led Unit For Gundam Exia", series:"", imageUrl:null,
    manuals:[{id:554,name:"Assembly",lang:"JP",size:"",url:"pg-60-led-unit-for-gundam-exia-assembly.pdf"}] },
  { id:555, grade:"PG", scale:"1/60", name:"Led Unit For PG Rx-0 Unicorn Gundam", series:"", imageUrl:null,
    manuals:[{id:555,name:"Assembly",lang:"JP",size:"",url:"pg-60-led-unit-for-pg-rx-0-unicorn-gundam-assembly.pdf"}] },
  { id:556, grade:"PG", scale:"1/60", name:"Mbf-02 Strike Rouge", series:"", imageUrl:null,
    manuals:[{id:556,name:"Assembly",lang:"JP",size:"",url:"pg-60-mbf-02-strike-rouge-assembly.pdf"}] },
  { id:557, grade:"PG", scale:"1/60", name:"Mbf-p02 Gundam Astray [red Frame]", series:"", imageUrl:null,
    manuals:[{id:557,name:"Assembly",lang:"JP",size:"",url:"pg-60-mbf-p02-gundam-astray-red-frame-assembly.pdf"}] },
  { id:558, grade:"PG", scale:"1/60", name:"Ms-06f Zaku II", series:"", imageUrl:null,
    manuals:[{id:558,name:"Assembly",lang:"JP",size:"",url:"pg-60-ms-06f-zaku-ii-assembly.pdf"}] },
  { id:559, grade:"PG", scale:"1/60", name:"Ms-06s Zaku II", series:"", imageUrl:null,
    manuals:[{id:559,name:"Assembly",lang:"JP",size:"",url:"pg-60-ms-06s-zaku-ii-assembly.pdf"}] },
  { id:560, grade:"PG", scale:"1/60", name:"Msz-006 Zeta Gundam", series:"", imageUrl:null,
    manuals:[{id:560,name:"Assembly",lang:"JP",size:"",url:"pg-60-msz-006-zeta-gundam-assembly.pdf"}] },
  { id:561, grade:"PG", scale:"1/60", name:"Rx-178 Gundam Mk-ii", series:"", imageUrl:null,
    manuals:[{id:561,name:"Assembly",lang:"JP",size:"",url:"pg-60-rx-178-gundam-mk-ii-assembly.pdf"}] },
  { id:562, grade:"PG", scale:"1/60", name:"Rx-178 Gundam Mk.ii", series:"", imageUrl:null,
    manuals:[{id:562,name:"Assembly",lang:"JP",size:"",url:"pg-60-rx-178-gundam-mk-ii-assembly.pdf"}] },
  { id:563, grade:"PG", scale:"1/60", name:"Rx-78 GP01 Gundam Gp01/fb", series:"", imageUrl:null,
    manuals:[{id:563,name:"Assembly",lang:"JP",size:"",url:"pg-60-rx-78-gp01-gundam-gp01-fb-assembly.pdf"}] },
  { id:564, grade:"PG", scale:"1/60", name:"Rx-78-2 Gundam", series:"", imageUrl:null,
    manuals:[{id:564,name:"Assembly",lang:"JP",size:"",url:"pg-60-rx-78-2-gundam-assembly.pdf"}] },
  { id:565, grade:"PG", scale:"1/60", name:"Rx-78-2 Gundam", series:"", imageUrl:null,
    manuals:[{id:565,name:"Assembly",lang:"JP",size:"",url:"pg-60-rx-78-2-gundam-assembly.pdf"}] },
  { id:566, grade:"PG", scale:"1/60", name:"Rx-78-2 Gundam (e.f.s.f. Prototype Close-combat Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:566,name:"Assembly",lang:"JP",size:"",url:"pg-60-rx-78-2-gundam-e-f-s-f-prototype-close-combat-mobile-suit-assembly.pdf"}] },
  { id:567, grade:"PG", scale:"1/60", name:"Rx-78-2 Gundam Ver.1.0", series:"", imageUrl:null,
    manuals:[{id:567,name:"Assembly",lang:"JP",size:"",url:"pg-60-rx-78-2-gundam-ver-1-0-assembly.pdf"}] },
  { id:568, grade:"PG", scale:"1/60", name:"Unicorn Gundam (full Psycho-frame Prototype Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:568,name:"Assembly",lang:"JP",size:"",url:"pg-60-unicorn-gundam-full-psycho-frame-prototype-mobile-suit-assembly.pdf"}] },
  { id:569, grade:"PG", scale:"1/60", name:"Unicorn Gundam 02 Banshee Norn", series:"", imageUrl:null,
    manuals:[{id:569,name:"Assembly",lang:"JP",size:"",url:"pg-60-unicorn-gundam-02-banshee-norn-assembly.pdf"}] },
  { id:570, grade:"PG", scale:"1/60", name:"W-gundam Zerocustom", series:"", imageUrl:null,
    manuals:[{id:570,name:"Assembly",lang:"JP",size:"",url:"pg-60-w-gundam-zerocustom-assembly.pdf"}] },
  { id:571, grade:"PG", scale:"1/60", name:"Zgmf-x20a Strike Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:571,name:"Assembly",lang:"JP",size:"",url:"pg-60-zgmf-x20a-strike-freedom-gundam-assembly.pdf"}] },

  // ── SUPER DEFORMED (SD) ───────────────────────────────
  { id:572, grade:"SD", scale:"1/144", name:"Asw-g-08 Gundam Barbatos", series:"", imageUrl:null,
    manuals:[{id:572,name:"Assembly",lang:"JP",size:"",url:"sd-unk-asw-g-08-gundam-barbatos-assembly.pdf"}] },
  { id:573, grade:"SD", scale:"1/144", name:"Duel Gundam", series:"", imageUrl:null,
    manuals:[{id:573,name:"Assembly",lang:"JP",size:"",url:"sd-unk-duel-gundam-assembly.pdf"}] },
  { id:574, grade:"SD", scale:"1/144", name:"Kurenai Mushatoro Red Warrior Amazing Lady Kawaguchi", series:"", imageUrl:null,
    manuals:[{id:574,name:"Assembly",lang:"JP",size:"",url:"sd-unk-kurenai-mushatoro-red-warrior-amazing-lady-kawaguchi-assembly.pdf"}] },
  { id:575, grade:"SD", scale:"1/144", name:"Nebula Blitz Gundam", series:"", imageUrl:null,
    manuals:[{id:575,name:"Assembly",lang:"JP",size:"",url:"sd-unk-nebula-blitz-gundam-assembly.pdf"}] },
  { id:576, grade:"SD", scale:"1/144", name:"Rx-zeromaru Ryame\'s Mobile Suit", series:"", imageUrl:null,
    manuals:[{id:576,name:"Assembly",lang:"JP",size:"",url:"sd-unk-rx-zeromaru-ryame-s-mobile-suit-assembly.pdf"}] },
  { id:577, grade:"SD", scale:"1/144", name:"Rx-zeromaru Shinkikessho", series:"", imageUrl:null,
    manuals:[{id:577,name:"Assembly",lang:"JP",size:"",url:"sd-unk-rx-zeromaru-shinkikessho-assembly.pdf"}] },
  { id:578, grade:"SD", scale:"1/144", name:"S.d.g Gundam (terao Daikagu)", series:"", imageUrl:null,
    manuals:[{id:578,name:"Assembly",lang:"JP",size:"",url:"sd-unk-s-d-g-gundam-terao-daikagu-assembly.pdf"}] },
  { id:579, grade:"SD", scale:"1/144", name:"Sd-ex Gundam Aerial", series:"", imageUrl:null,
    manuals:[{id:579,name:"Assembly",lang:"JP",size:"",url:"sd-unk-sd-ex-gundam-aerial-assembly.pdf"}] },
  { id:580, grade:"SD", scale:"1/144", name:"Star Winning Gundam", series:"", imageUrl:null,
    manuals:[{id:580,name:"Assembly",lang:"JP",size:"",url:"sd-unk-star-winning-gundam-assembly.pdf"}] },
  { id:581, grade:"SD", scale:"1/144", name:"Winning Gundam (team Try Fighters Gundam Hoshino\'s Mobile Suit)", series:"", imageUrl:null,
    manuals:[{id:581,name:"Assembly",lang:"JP",size:"",url:"sd-unk-winning-gundam-team-try-fighters-gundam-hoshino-s-mobile-suit-assembly.pdf"}] },
  { id:582, grade:"SD", scale:"1/144", name:"Xvx-016 Gundam Aerial", series:"", imageUrl:null,
    manuals:[{id:582,name:"Assembly",lang:"JP",size:"",url:"sd-unk-xvx-016-gundam-aerial-assembly.pdf"}] },
  { id:583, grade:"SD", scale:"1/144", name:"Zgmf-x10a Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:583,name:"Assembly",lang:"JP",size:"",url:"sd-unk-zgmf-x10a-freedom-gundam-assembly.pdf"}] },

  // ── HIGH GRADE (HG) ───────────────────────────────────
  { id:584, grade:"HG", scale:"1/144", name:"Action Base 4 Black", series:"", imageUrl:null,
    manuals:[{id:584,name:"Assembly",lang:"JP",size:"",url:"unk-unk-action-base-4-black-assembly.pdf"}] },
  { id:585, grade:"HG", scale:"1/144", name:"Action Base Black 5", series:"", imageUrl:null,
    manuals:[{id:585,name:"Assembly",lang:"JP",size:"",url:"unk-unk-action-base-black-5-assembly.pdf"}] },
  { id:586, grade:"HG", scale:"1/144", name:"Blaze Zaku Phantom", series:"", imageUrl:null,
    manuals:[{id:586,name:"Assembly",lang:"JP",size:"",url:"unk-unk-blaze-zaku-phantom-assembly.pdf"}] },
  { id:587, grade:"HG", scale:"1/144", name:"Force Impulse Gundam", series:"", imageUrl:null,
    manuals:[{id:587,name:"Assembly",lang:"JP",size:"",url:"unk-unk-force-impulse-gundam-assembly.pdf"}] },
  { id:588, grade:"HG", scale:"1/144", name:"Gbn-base Gundam", series:"", imageUrl:null,
    manuals:[{id:588,name:"Assembly",lang:"JP",size:"",url:"unk-unk-gbn-base-gundam-assembly.pdf"}] },
  { id:589, grade:"HG", scale:"1/144", name:"Gundam 00 Sky", series:"", imageUrl:null,
    manuals:[{id:589,name:"Assembly",lang:"JP",size:"",url:"unk-unk-gundam-00-sky-assembly.pdf"}] },
  { id:590, grade:"HG", scale:"1/144", name:"Gundam Aerial", series:"", imageUrl:null,
    manuals:[{id:590,name:"Assembly",lang:"JP",size:"",url:"unk-unk-gundam-aerial-assembly.pdf"}] },
  { id:591, grade:"HG", scale:"1/144", name:"Justice Gundam", series:"", imageUrl:null,
    manuals:[{id:591,name:"Assembly",lang:"JP",size:"",url:"unk-unk-justice-gundam-assembly.pdf"}] },
  { id:592, grade:"HG", scale:"1/144", name:"Mbf-02+ew454f Strike Rouge + I.w.s.p. Oordori Equipped Ver.rm", series:"", imageUrl:null,
    manuals:[{id:592,name:"Assembly",lang:"JP",size:"",url:"unk-unk-mbf-02-ew454f-strike-rouge-i-w-s-p-oordori-equipped-ver-rm-assembly.pdf"}] },
  { id:593, grade:"HG", scale:"1/144", name:"Mbf-p01-re2 Gundam Astray Gold Frame Amatsu", series:"", imageUrl:null,
    manuals:[{id:593,name:"Assembly",lang:"JP",size:"",url:"unk-unk-mbf-p01-re2-gundam-astray-gold-frame-amatsu-assembly.pdf"}] },
  { id:594, grade:"HG", scale:"1/144", name:"Mobile Ginn", series:"", imageUrl:null,
    manuals:[{id:594,name:"Assembly",lang:"JP",size:"",url:"unk-unk-mobile-ginn-assembly.pdf"}] },
  { id:595, grade:"HG", scale:"1/144", name:"Mobile Suit Msz-010 Zz Gundam \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:595,name:"Assembly",lang:"JP",size:"",url:"unk-unk-mobile-suit-msz-010-zz-gundam-ver-ka-assembly.pdf"}] },
  { id:596, grade:"HG", scale:"1/144", name:"Mobile Suit Rx-0 Unicorn Gundam 02 Banshee \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:596,name:"Assembly",lang:"JP",size:"",url:"unk-unk-mobile-suit-rx-0-unicorn-gundam-02-banshee-ver-ka-assembly.pdf"}] },
  { id:597, grade:"HG", scale:"1/144", name:"Mobile Suit Rx-0 Unicorn Gundam Ver.ka", series:"", imageUrl:null,
    manuals:[{id:597,name:"Assembly",lang:"JP",size:"",url:"unk-unk-mobile-suit-rx-0-unicorn-gundam-ver-ka-assembly.pdf"}] },
  { id:598, grade:"HG", scale:"1/144", name:"Mobile Suit Rx-93-v2 Hi-v Gundam \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:598,name:"Assembly",lang:"JP",size:"",url:"unk-unk-mobile-suit-rx-93-v2-hi-v-gundam-ver-ka-assembly.pdf"}] },
  { id:599, grade:"HG", scale:"1/144", name:"Mobile Suit Xxxg-00w0 Wing Gundam Zero EW \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:599,name:"Assembly",lang:"JP",size:"",url:"unk-unk-mobile-suit-xxxg-00w0-wing-gundam-zero-ew-ver-ka-assembly.pdf"}] },
  { id:600, grade:"HG", scale:"1/144", name:"Mobile Suit Xxxg-00w0 Wing Gundam Zero EW \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:600,name:"Assembly",lang:"JP",size:"",url:"unk-unk-mobile-suit-xxxg-00w0-wing-gundam-zero-ew-ver-ka-assembly.pdf"}] },
  { id:601, grade:"HG", scale:"1/144", name:"Mobile Suit Zgundam", series:"", imageUrl:null,
    manuals:[{id:601,name:"Assembly",lang:"JP",size:"",url:"unk-unk-mobile-suit-zgundam-assembly.pdf"}] },
  { id:602, grade:"HG", scale:"1/144", name:"Neogeon Msn-04 Mobile Suit Sazabi \"ver.ka\"", series:"", imageUrl:null,
    manuals:[{id:602,name:"Assembly",lang:"JP",size:"",url:"unk-unk-neogeon-msn-04-mobile-suit-sazabi-ver-ka-assembly.pdf"}] },
  { id:603, grade:"HG", scale:"1/144", name:"Rms-099 Rick Dias", series:"", imageUrl:null,
    manuals:[{id:603,name:"Assembly",lang:"JP",size:"",url:"unk-unk-rms-099-rick-dias-assembly.pdf"}] },
  { id:604, grade:"HG", scale:"1/144", name:"Rms-099b Schuzrum-dias", series:"", imageUrl:null,
    manuals:[{id:604,name:"Assembly",lang:"JP",size:"",url:"unk-unk-rms-099b-schuzrum-dias-assembly.pdf"}] },
  { id:605, grade:"HG", scale:"1/144", name:"Rx-0 Unicorn Gundam 02 Banshee (unicorn Mode)", series:"", imageUrl:null,
    manuals:[{id:605,name:"Assembly",lang:"JP",size:"",url:"unk-unk-rx-0-unicorn-gundam-02-banshee-unicorn-mode-assembly.pdf"}] },
  { id:606, grade:"HG", scale:"1/144", name:"Zgmf-x20a Strike Freedom Gundam", series:"", imageUrl:null,
    manuals:[{id:606,name:"Assembly",lang:"JP",size:"",url:"unk-unk-zgmf-x20a-strike-freedom-gundam-assembly.pdf"}] },
  { id:607, grade:"HG", scale:"1/144", name:"Zgmf-x23s Saviour Gundam", series:"", imageUrl:null,
    manuals:[{id:607,name:"Assembly",lang:"JP",size:"",url:"unk-unk-zgmf-x23s-saviour-gundam-assembly.pdf"}] },
  { id:608, grade:"HG", scale:"1/144", name:"Zgmf-x24s Chaos Gundam", series:"", imageUrl:null,
    manuals:[{id:608,name:"Assembly",lang:"JP",size:"",url:"unk-unk-zgmf-x24s-chaos-gundam-assembly.pdf"}] },
  { id:609, grade:"HG", scale:"1/144", name:"Zgmf-x42s Destiny Gundam", series:"", imageUrl:null,
    manuals:[{id:609,name:"Assembly",lang:"JP",size:"",url:"unk-unk-zgmf-x42s-destiny-gundam-assembly.pdf"}] },
  { id:610, grade:"HG", scale:"1/144", name:"Zgmf-x666s Legend Gundam", series:"", imageUrl:null,
    manuals:[{id:610,name:"Assembly",lang:"JP",size:"",url:"unk-unk-zgmf-x666s-legend-gundam-assembly.pdf"}] },
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
// GRADE DETAIL — separate component so it can use useParams
// ─────────────────────────────────────────────────────────────
const GRADE_DATA = {
  eg: {
    name: "Entry Grade", abbr: "EG", color: "#aa88ff", scale: "1/144",
    tagline: "THE PERFECT STARTING POINT",
    intro: "Entry Grade kits were introduced by Bandai in 2020 as the most accessible way to experience Gunpla. Designed specifically for first-time builders, EG kits require <strong>no nippers, no tools, and no prior experience</strong> — parts snap cleanly off the runner by hand without leaving unsightly gate marks.",
    sections: [
      { title: "◈ BUILD EXPERIENCE", body: "EG kits are engineered for simplicity without sacrificing the iconic look of the mobile suits. The part count is kept low, assembly steps are intuitive, and the instruction manual is easy to follow even for children. A typical EG kit can be completed in <strong>1–2 hours</strong>, making it ideal for an afternoon project." },
      { title: "◈ WHAT YOU GET", body: "Despite being entry-level, EG kits deliver impressive articulation and screen-accurate proportions. Most include a small selection of weapons and accessories. The plastic quality is high — the same Bandai engineering behind MG and RG kits, just simplified for accessibility." },
      { title: "◈ WHO IS IT FOR?", body: "EG is perfect for <strong>absolute beginners</strong>, younger builders, or anyone who wants a quick, satisfying build without committing hours to a complex kit. They also make great gifts. Experienced builders often pick up EG kits as palette cleansers between large MG or PG projects." },
      { title: "◈ TOOLS NEEDED", body: "<strong>None required.</strong> Parts are designed to be hand-separated cleanly. That said, a pair of nippers and a hobby knife will give cleaner results if you have them. No glue, cement, or painting is necessary — though EG kits respond well to panel lining and top coating if you want to take them further." },
    ],
    stats: [{ val:"1/144", lbl:"SCALE" }, { val:"1–2 HRS", lbl:"BUILD TIME" }, { val:"NONE", lbl:"TOOLS NEEDED" }, { val:"★☆☆☆☆", lbl:"DIFFICULTY" }],
  },
  hg: {
    name: "High Grade", abbr: "HG", color: "#00aaff", scale: "1/144",
    tagline: "THE BACKBONE OF GUNPLA",
    intro: "High Grade is the most diverse and widely available grade in all of Gunpla. Running since 1990, HG kits cover virtually every mobile suit from every Gundam series — if a kit exists, there's almost certainly an HG version of it. At 1/144 scale, they're compact, affordable, and endlessly varied.",
    sections: [
      { title: "◈ BUILD EXPERIENCE", body: "HG kits are the <strong>gateway to serious Gunpla building</strong>. They require nippers for clean gate removal and benefit from a hobby knife for cleanup, but are otherwise very approachable. A standard HG takes <strong>3–6 hours</strong> to complete. The part count is moderate and the build flow is well-paced." },
      { title: "◈ WHAT YOU GET", body: "Most HG kits include a good range of accessories — beam sabers, shields, rifles — and feature solid articulation for their size. Newer HG kits (post-2015) have benefited from Bandai's improved engineering, with better proportions, color separation, and posability than older releases." },
      { title: "◈ WHO IS IT FOR?", body: "HG is the ideal grade for <strong>beginners to intermediate builders</strong>. They're a great place to practice panel lining, decal application, and top coating. Advanced builders often collect HG kits for their variety, or use them as customisation bases for kitbashing and painting projects." },
      { title: "◈ TOOLS NEEDED", body: "<strong>Nippers are essential.</strong> A hobby knife for gate cleanup and panel line markers are highly recommended. No glue required for standard assembly. Nippers, a cutting mat, and panel line markers are the standard starter toolkit for HG builds." },
    ],
    stats: [{ val:"1/144", lbl:"SCALE" }, { val:"3–6 HRS", lbl:"BUILD TIME" }, { val:"NIPPERS", lbl:"TOOLS NEEDED" }, { val:"★★☆☆☆", lbl:"DIFFICULTY" }],
  },
  rg: {
    name: "Real Grade", abbr: "RG", color: "#ff2244", scale: "1/144",
    tagline: "MASTER GRADE DETAIL IN A SMALLER PACKAGE",
    intro: "Real Grade kits are Bandai's most technically ambitious 1/144 scale offerings. Launched in 2010, RG kits pack <strong>Master Grade-level internal structure and detail</strong> into a compact frame, making them one of the most impressive grade-for-size achievements in the Gunpla lineup.",
    sections: [
      { title: "◈ BUILD EXPERIENCE", body: "RG kits feature a pre-built Advanced MS Joint inner frame — a flexible, pre-assembled skeleton that forms the core of the kit. Outer armor parts snap onto this frame. The result is exceptional poseability and detail, but the small part size and complex assembly make RG one of the more <strong>challenging grades</strong>. Expect <strong>6–12 hours</strong> for most kits." },
      { title: "◈ WHAT YOU GET", body: "RG kits typically include <strong>waterslide decals</strong> for panel markings, an inner frame visible through translucent or removable outer armor, and an impressive level of color separation considering the scale. The finished product is often the most detailed display piece possible at 1/144 scale." },
      { title: "◈ WHO IS IT FOR?", body: "RG is aimed at <strong>intermediate to advanced builders</strong> who want the detail of an MG without the footprint. The small parts demand patience and steady hands. It's not recommended as a first kit, but experienced HG builders looking for their next challenge will find RG enormously rewarding." },
      { title: "◈ TOOLS NEEDED", body: "<strong>Sharp nippers are critical</strong> — blunt nippers will crack small RG parts. A precision hobby knife, tweezers for waterslide decals, and a fine-tipped panel liner are all highly recommended. A good magnifying lamp helps significantly with the fine detail work." },
    ],
    stats: [{ val:"1/144", lbl:"SCALE" }, { val:"6–12 HRS", lbl:"BUILD TIME" }, { val:"SHARP NIPPERS", lbl:"TOOLS NEEDED" }, { val:"★★★★☆", lbl:"DIFFICULTY" }],
  },
  mg: {
    name: "Master Grade", abbr: "MG", color: "#ff6600", scale: "1/100",
    tagline: "THE GOLD STANDARD OF GUNPLA",
    intro: "Master Grade is the prestige grade of the Gunpla line — the sweet spot between complexity and display quality that most serious collectors aspire to. Introduced in 1995, MG kits feature <strong>fully developed inner frames, detailed cockpit interiors, and exceptional articulation</strong> at the substantial 1/100 scale.",
    sections: [
      { title: "◈ BUILD EXPERIENCE", body: "Building an MG is a <strong>multi-session commitment</strong>. Most kits take 8–20 hours depending on complexity. You'll build the skeleton first — a fully articulated inner frame — and then layer outer armor panels over it. The process is deeply satisfying and teaches builders a thorough understanding of the mobile suit's structure." },
      { title: "◈ WHAT YOU GET", body: "MG kits are packed with features: opening hatches, poseable fingers (on many releases), pilot figures, cockpit details, extensive weapon loadouts, and markings. The 1/100 scale means detail work like panel lining and decal application is much more forgiving than RG or HG." },
      { title: "◈ WHO IS IT FOR?", body: "MG is the target grade for <strong>intermediate to advanced builders</strong> who want a substantial, impressive display piece. It's also the most customisation-friendly grade — the inner frame construction makes repainting, kitbashing, and modification more approachable than smaller grades." },
      { title: "◈ TOOLS NEEDED", body: "<strong>Quality nippers are essential.</strong> A hobby knife, panel liners, and either waterslide or dry transfer decals (depending on the kit) round out the standard toolkit. Airbrush painting elevates MG kits significantly, though hand painting works well too at this scale." },
    ],
    stats: [{ val:"1/100", lbl:"SCALE" }, { val:"8–20 HRS", lbl:"BUILD TIME" }, { val:"NIPPERS + KNIFE", lbl:"TOOLS NEEDED" }, { val:"★★★☆☆", lbl:"DIFFICULTY" }],
  },
  pg: {
    name: "Perfect Grade", abbr: "PG", color: "#ffcc00", scale: "1/60",
    tagline: "THE ULTIMATE GUNPLA EXPERIENCE",
    intro: "Perfect Grade represents the absolute pinnacle of Bandai's Gunpla engineering. Released only for the most iconic mobile suits, PG kits are <strong>enormous, extraordinarily detailed, and built to impress</strong>. At 1/60 scale, a completed PG is a centerpiece — not just a model, but a statement.",
    sections: [
      { title: "◈ BUILD EXPERIENCE", body: "Building a PG is a <strong>major undertaking</strong>. Most kits take 20–40+ hours to complete. Every detail is accounted for — full inner frame, opening cockpit, LED lighting units (on select releases), poseable hands, and interlocking mechanical joints. The build experience itself is considered a highlight by collectors who have completed one." },
      { title: "◈ WHAT YOU GET", body: "PG kits come with everything: chrome parts, rubber tubing, clear parts, full weapon arrays, pilot figures, detailed cockpit interiors, and on some releases, pre-installed LED systems. The box alone is often the size of a shoebox. These are the kits that go in glass display cabinets." },
      { title: "◈ WHO IS IT FOR?", body: "PG is for <strong>experienced, dedicated builders</strong> who want the best that Gunpla has to offer and are prepared to invest significant time and money. Most PG builders have completed multiple MG or RG kits beforehand. A PG is not a casual weekend project — it's a long-term build that rewards patience and skill." },
      { title: "◈ TOOLS NEEDED", body: "<strong>The full toolkit</strong> — quality nippers, precision hobby knife, multiple panel liners, tweezers, sprue cutters, and ideally an airbrush setup. LED wiring on applicable kits benefits from basic electronics knowledge. A dedicated workspace is recommended given the scale and part count." },
    ],
    stats: [{ val:"1/60", lbl:"SCALE" }, { val:"20–40+ HRS", lbl:"BUILD TIME" }, { val:"FULL TOOLKIT", lbl:"TOOLS NEEDED" }, { val:"★★★★★", lbl:"DIFFICULTY" }],
  },
  sd: {
    name: "Super Deformed", abbr: "SD", color: "#00ffcc", scale: "SD",
    tagline: "BIG PERSONALITY, COMPACT SCALE",
    intro: "Super Deformed kits take the iconic mobile suits of Gundam and reimagine them in a <strong>chibi, big-headed, cute aesthetic</strong> that is instantly charming. SD Gundam has been part of Bandai's lineup since the 1980s and has developed its own dedicated fanbase that loves the playful designs and quick build experience.",
    sections: [
      { title: "◈ BUILD EXPERIENCE", body: "SD kits are among the <strong>fastest to build</strong> in the Gunpla lineup. Most can be completed in 1–3 hours. The part count is low, the steps are simple, and the result is immediately fun and displayable. The SD EX-Standard and Cross Silhouette sub-lines have modernised the grade with better articulation." },
      { title: "◈ WHAT YOU GET", body: "SD kits come with weapons and accessories appropriate to the mobile suit, though the emphasis is on the character design rather than mechanical detail. Cross Silhouette kits include an inner frame for improved articulation and can even accept 1/144 HG legs for a more proportional 'SD Kai' look." },
      { title: "◈ WHO IS IT FOR?", body: "SD kits are <strong>great for all skill levels</strong>. Beginners love them for their speed and accessibility. Collectors love them for their unique aesthetic. Experienced builders enjoy them as quick palette-cleansers between larger builds, or as customisation and diorama subjects." },
      { title: "◈ TOOLS NEEDED", body: "<strong>Nippers recommended</strong> but not always strictly necessary on newer SD kits. A hobby knife for gate cleanup improves the finish. Panel lining is very effective on SD kits — the exaggerated details really pop with a wash. Top coating is highly recommended to protect the finish." },
    ],
    stats: [{ val:"SD", lbl:"SCALE" }, { val:"1–3 HRS", lbl:"BUILD TIME" }, { val:"NIPPERS", lbl:"TOOLS NEEDED" }, { val:"★☆☆☆☆", lbl:"DIFFICULTY" }],
  },
};

function GradeDetail({ setGradeFilter }) {
  const { gradeSlug } = useParams();
  const navigate = useNavigate();
  const g = GRADE_DATA[gradeSlug];

  const GRADE_ORDER = ["eg", "hg", "rg", "mg", "pg", "sd"];
  const currentIdx = GRADE_ORDER.indexOf(gradeSlug);
  const prevSlug = GRADE_ORDER[(currentIdx - 1 + GRADE_ORDER.length) % GRADE_ORDER.length];
  const nextSlug = GRADE_ORDER[(currentIdx + 1) % GRADE_ORDER.length];
  const prevG = GRADE_DATA[prevSlug];
  const nextG = GRADE_DATA[nextSlug];

  const GradeNavRow = () => (
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

  if (!g) return (
    <div style={{padding:"80px 40px",textAlign:"center",fontFamily:"'Share Tech Mono',monospace",color:"var(--text-dim)"}}>
      <div style={{fontSize:"3rem",marginBottom:"16px",opacity:0.3}}>404</div>
      <div style={{letterSpacing:"2px",marginBottom:"24px"}}>GRADE NOT FOUND</div>
      <button className="back-btn" style={{margin:"0 auto"}} onClick={() => navigate("/")}>← BACK TO LIBRARY</button>
    </div>
  );
  return (
    <>
      <GradeNavRow />
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
        <GradeNavRow />
        <div style={{height:"40px"}} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// KIT DETAIL — separate component so it can use useParams
// ─────────────────────────────────────────────────────────────
function KitDetail({ gc, isSignedIn, favourites, buildProgress, pageProgress, toggleFavourite, setBuildStatus, setManualPage, openManualId, toggleManual, setOpenManualId, goHome }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const kit = findKitBySlug(slug);

  // Real page counts fetched from actual PDF via pdfjs
  const [realPages, setRealPages] = useState({});
  const [fullscreenManual, setFullscreenManual] = useState(null);
  const [touchActiveId, setTouchActiveId] = useState(null);

  const fetchRealPages = async (manual) => {
    if (!manual.url || realPages[manual.id] !== undefined) return;
    const cacheKey = `kv_pdfpages_${manual.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setRealPages(prev => ({ ...prev, [manual.id]: parseInt(cached) }));
      return;
    }
    try {
      const pdfjs = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.min.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs";
      const pdf = await pdfjs.getDocument(`${R2}/${manual.url}`).promise;
      const count = pdf.numPages;
      localStorage.setItem(cacheKey, String(count));
      setRealPages(prev => ({ ...prev, [manual.id]: count }));
    } catch (_) { /* silently ignore — falls back to manual.pages */ }
  };

  // Auto-fetch real page counts for all manuals with a URL as soon as kit loads
  useEffect(() => {
    kit?.manuals.forEach(m => { if (m.url) fetchRealPages(m); });
  }, [kit?.id]);

  if (!kit) return (
    <div style={{padding:"80px 40px",textAlign:"center",fontFamily:"'Share Tech Mono',monospace",color:"var(--text-dim)"}}>
      <div style={{fontSize:"3rem",marginBottom:"16px",opacity:0.3}}>404</div>
      <div style={{letterSpacing:"2px",marginBottom:"24px"}}>KIT NOT FOUND</div>
      <button className="back-btn" style={{margin:"0 auto"}} onClick={goHome}>← BACK TO LIBRARY</button>
    </div>
  );

  const isFav = favourites.includes(kit.id);

  return (
    <>
      <button className="back-btn" onClick={() => navigate(-1)}>← BACK TO LIBRARY</button>

      <div className="kit-detail-header">
        <div className="detail-grade" style={{color:gc(kit.grade).accent}}>{kit.grade} GRADE — {kit.scale}</div>
        <div className="detail-title">
          {kit.name}
          {isSignedIn && (
            <button className="fav-btn" style={{marginLeft:"12px",fontSize:"1.4rem"}} onClick={e => toggleFavourite(e, kit.id)}>
              {isFav ? "⭐" : "☆"}
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
            <button
              className={`build-status-fav${isFav?" on":""}`}
              onClick={e => toggleFavourite(e, kit.id)}
              title={isFav ? "Remove from My Vault" : "Add to My Vault"}
            >
              {isFav ? "⭐" : "☆"}
            </button>
            <div style={{width:"1px",height:"20px",background:"var(--border)",flexShrink:0}} />
            {[
              {id:"backlog", label:"◻ BACKLOG"},
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



      <div style={{height:"16px"}} />
      {isSignedIn && kit.manuals.some(m => m.url) && (() => {
        // Compute overall progress across all manuals with real page data
        const manualRows = kit.manuals.filter(m => m.url).map(m => {
          const key = `${kit.id}-${m.id}`;
          const total = realPages[m.id];
          const current = Math.min(pageProgress[key]?.current || 0, total || 0);
          return { m, key, total, current };
        });
        const hasAnyTotal = manualRows.some(r => r.total > 0);
        const overallTotal = manualRows.reduce((s, r) => s + (r.total || 0), 0);
        const overallCurrent = manualRows.reduce((s, r) => s + r.current, 0);
        const overallPct = overallTotal > 0 ? Math.round((overallCurrent / overallTotal) * 100) : 0;
        const colors = overallPct >= 100
          ? { "--xp-start":"#00cc66","--xp-end":"#00ffcc","--xp-glow":"rgba(0,255,136,0.7)","--xp-color":"#00ff88" }
          : overallPct >= 50
          ? { "--xp-start":"#cc8800","--xp-end":"#ffcc00","--xp-glow":"rgba(255,204,0,0.6)","--xp-color":"#ffcc00" }
          : { "--xp-start":"#1a4aff","--xp-end":"#00aaff","--xp-glow":"rgba(0,170,255,0.6)","--xp-color":"#00aaff" };

        // 10 segments for the XP track
        const SEGMENTS = 10;

        return (
          <div className="xp-bar-full" style={colors}>
            <div className="xp-header">
              <span className="xp-label">◈ BUILD PROGRESS</span>
              <span className="xp-pct">{hasAnyTotal ? `${overallPct}%` : "—"}</span>
            </div>
            <div className="xp-track">
              <div className="xp-track-segments">
                {Array.from({length: SEGMENTS}).map((_,i) => <div key={i} className="xp-segment" />)}
              </div>
              <div className="xp-fill" style={{width: hasAnyTotal ? `${overallPct}%` : "0%"}} />
            </div>
            <div className="xp-multi-wrap">
              {manualRows.map(({ m, key, total, current }) => {
                const pct = total > 0 ? Math.round((current / total) * 100) : 0;
                const isLoading = total === undefined;
                return (
                  <div key={m.id}>
                    <div className="xp-manual-name">{m.name}</div>
                    <div className="xp-input-row">
                      <span className="xp-input-label">CURRENT PAGE</span>
                      <div className="xp-stepper">
                        <button className="xp-step-btn minus" onClick={() => {
                          const next = Math.max(0, current - 1);
                          setManualPage(kit.id, m.id, next, total || next);
                        }}>−</button>
                        <input
                          className="xp-input"
                          type="number"
                          min="0"
                          max={total || 9999}
                          value={current || ""}
                          placeholder="0"
                          onChange={e => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            const clamped = total ? Math.min(val, total) : val;
                            setManualPage(kit.id, m.id, clamped, total || clamped);
                          }}
                        />
                        <button className="xp-step-btn plus" onClick={() => {
                          const next = total ? Math.min(current + 1, total) : current + 1;
                          setManualPage(kit.id, m.id, next, total || next);
                        }}>+</button>
                      </div>
                      <span className="xp-total">
                        / {isLoading ? <span style={{opacity:0.4}}>loading...</span> : `${total} PGS`}
                      </span>
                      {total > 0 && (
                        <span style={{marginLeft:"auto",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color: pct===100?"var(--green)":pct>0?"var(--gold)":"var(--text-dim)"}}>
                          {pct}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div className="manual-list">
        <div className="section-header" style={{padding:"0 0 20px"}}>
          <span className="section-title">AVAILABLE MANUALS</span>
          <div className="section-line" />
        </div>
        {kit.manuals.map(manual => (
          <div key={manual.id} className="manual-item" onClick={() => { toggleManual(manual.id); fetchRealPages(manual); }}>
            <div className="manual-item-row">
              <div className="manual-item-left">
                <div className="manual-icon">PDF</div>
                <div>
                  <div className="manual-name">{manual.name}</div>
                  <div className="manual-meta">
                    <span>LANG: {manual.lang}</span>
                    <span>{realPages[manual.id] !== undefined ? realPages[manual.id] : manual.pages} PGS</span>
                    <span>{manual.size}</span>
                  </div>
                </div>
              </div>
              <div className="manual-actions">
                <button
                  className={`btn btn-view${openManualId === manual.id ? " active" : ""}`}
                  onClick={e => { e.stopPropagation(); toggleManual(manual.id); fetchRealPages(manual); }}
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
                  <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                    {manual.url && (
                      <button
                        className="btn-fullscreen"
                        onClick={e => { e.stopPropagation(); setFullscreenManual(manual); }}
                      >
                        ⛶ FULLSCREEN
                      </button>
                    )}
                    <button className="pdf-dropdown-close" onClick={e => { e.stopPropagation(); setOpenManualId(null); setTouchActiveId(null); }}>✕</button>
                  </div>
                </div>
                <div className="pdf-frame-wrap">
                  {manual.url ? (
                    <>
                      <iframe
                        src={`${R2}/${manual.url}`}
                        title={manual.name}
                      />
                      <div
                        className={`pdf-touch-overlay${touchActiveId === manual.id ? " hidden" : ""}`}
                        onClick={e => { e.stopPropagation(); setTouchActiveId(manual.id); }}
                      >
                        <div className="pdf-touch-overlay-icon">☝️</div>
                        <div className="pdf-touch-overlay-text">
                          TAP TO SCROLL PDF<br/>TAP AGAIN TO SCROLL PAGE
                        </div>
                      </div>
                    </>
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

      {fullscreenManual && (
        <PdfFullscreenModal manual={fullscreenManual} onClose={() => setFullscreenManual(null)} />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// PDF FULLSCREEN MODAL
// ─────────────────────────────────────────────────────────────
function PdfFullscreenModal({ manual, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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

export default function KitVault() {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [openNav, setOpenNav] = useState(null);
  const toggleNav = (name) => setOpenNav(prev => prev === name ? null : name);
  const closeNav = () => setOpenNav(null);
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
  const [pageProgress, setPageProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_pages") || "{}"); } catch { return {}; }
  });

  // ── D1 sync ──────────────────────────────────────────────────
  // Saves user data to Cloudflare D1 via a Worker API endpoint.
  // Falls back to localStorage silently if the worker isn't set up yet.
  const D1_API = "/api/progress"; // Cloudflare Worker endpoint (set up separately)

  const syncToD1 = async (payload) => {
    if (!isSignedIn || !user) return;
    try {
      await fetch(D1_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...payload }),
      });
    } catch (_) { /* silent fallback to localStorage */ }
  };

  const loadFromD1 = async () => {
    if (!isSignedIn || !user) return;
    try {
      const res = await fetch(`${D1_API}?userId=${user.id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.favourites) { setFavourites(data.favourites); localStorage.setItem("kv_favourites", JSON.stringify(data.favourites)); }
      if (data.progress)   { setBuildProgress(data.progress);  localStorage.setItem("kv_progress",   JSON.stringify(data.progress)); }
      if (data.pages)      { setPageProgress(data.pages);       localStorage.setItem("kv_pages",      JSON.stringify(data.pages)); }
    } catch (_) { /* silent fallback to localStorage */ }
  };

  useEffect(() => { loadFromD1(); }, [isSignedIn]);



  const toggleFavourite = (e, kitId) => {
    e.stopPropagation();
    if (!isSignedIn) return;
    setFavourites(prev => {
      const next = prev.includes(kitId) ? prev.filter(id => id !== kitId) : [...prev, kitId];
      localStorage.setItem("kv_favourites", JSON.stringify(next));
      syncToD1({ favourites: next });
      return next;
    });
  };

  const setBuildStatus = (kitId, status) => {
    if (!isSignedIn) return;
    setBuildProgress(prev => {
      const next = { ...prev, [kitId]: status };
      localStorage.setItem("kv_progress", JSON.stringify(next));
      syncToD1({ progress: next });
      return next;
    });
  };

  const setManualPage = (kitId, manualId, currentPage, totalPages) => {
    if (!isSignedIn) return;
    setPageProgress(prev => {
      const key = `${kitId}-${manualId}`;
      const next = { ...prev, [key]: { current: currentPage, total: totalPages } };
      localStorage.setItem("kv_pages", JSON.stringify(next));
      syncToD1({ pages: next });
      return next;
    });
  };

  // Calculate overall kit progress % across all manuals
  const getKitProgress = (kit) => {
    const entries = kit.manuals.map(m => pageProgress[`${kit.id}-${m.id}`]).filter(Boolean);
    if (entries.length === 0) return null;
    const total = entries.reduce((sum, e) => sum + e.total, 0);
    const current = entries.reduce((sum, e) => sum + Math.min(e.current, e.total), 0);
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  // Returns CSS custom properties for XP bar colour based on %
  const xpColors = (pct) => {
    if (pct >= 100) return { "--xp-start":"#00cc66", "--xp-end":"#00ffcc", "--xp-glow":"rgba(0,255,136,0.7)", "--xp-color":"#00ff88" };
    if (pct >= 50)  return { "--xp-start":"#cc8800", "--xp-end":"#ffcc00", "--xp-glow":"rgba(255,204,0,0.6)",  "--xp-color":"#ffcc00" };
    return                 { "--xp-start":"#1a4aff", "--xp-end":"#00aaff", "--xp-glow":"rgba(0,170,255,0.6)", "--xp-color":"#00aaff" };
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
        <header className="header" style={{position:"relative"}} onClick={e => { if(!e.target.closest('.nav-item')) closeNav(); }}>
          <div className="logo" onClick={goHome} style={{cursor:"pointer"}}>
            <div className="logo-icon">▣</div>
            <div className="logo-text">
              <span>KIT<span style={{color:"#ff6600"}}>VAULT</span></span>
              <span className="logo-sub">KITVAULT.IO</span>
            </div>
          </div>

          <div className="header-right">
            <div className="status-dot" />

            {/* ── NAV RIGHT ── */}
            <nav className="nav-right">

              {/* TOOLS */}
              <div className={`nav-item${openNav==="tools"?" open":""}`}>
                <button className="nav-btn" onClick={()=>toggleNav("tools")}>
                  TOOLS <span className="nav-btn-arrow">▼</span>
                </button>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">◈ HOBBY TOOLS</div>
                  {[
                    {icon:"✂️", label:"Nippers", sub:"Side cutters for clean gate removal — the most essential Gunpla tool"},
                    {icon:"🔧", label:"Panel Line Markers", sub:"Gundam markers & enamel washes for detail lines"},
                    {icon:"📐", label:"Scribers & Chisels", sub:"For adding custom panel lines and surface detail"},
                    {icon:"🪵", label:"Sanding Sticks", sub:"400→1000→2000 grit for seamline removal & gate cleanup"},
                    {icon:"🎨", label:"Paints & Primers", sub:"Mr. Color, Citadel, Vallejo — airbrushing & hand painting"},
                    {icon:"💨", label:"Airbrushes", sub:"Iwata, Badger, GSI Creos — recommended starter setups"},
                    {icon:"🧴", label:"Top Coats", sub:"Gloss, semi-gloss, matte — protecting & unifying your finish"},
                    {icon:"🪚", label:"Hobby Knives", sub:"Olfa & X-Acto knives for cleanup and minor modifications"},
                  ].map(item => (
                    <div key={item.label} className="nav-dd-item" onClick={closeNav}>
                      <span className="nav-dd-icon">{item.icon}</span>
                      <span className="nav-dd-text">
                        <span className="nav-dd-label">{item.label}</span>
                        <span className="nav-dd-sub">{item.sub}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESOURCES */}
              <button className="nav-btn" onClick={() => { closeNav(); navigate("/resources"); }} style={{color: location.pathname==="/resources" ? "var(--accent)" : ""}}>
                RESOURCES
              </button>

              {/* GRADES */}
              <div className={`nav-item${openNav==="grades"?" open":""}`}>
                <button className="nav-btn" onClick={()=>toggleNav("grades")}>
                  GRADES <span className="nav-btn-arrow">▼</span>
                </button>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">◈ KIT GRADE GUIDE</div>
                  {[
                    {slug:"eg", label:"EG — Entry Grade", sub:"Snap-fit, no nippers needed. Perfect first kit", color:"#aa88ff"},
                    {slug:"hg", label:"HG — High Grade", sub:"1/144 scale. Best variety, great for beginners", color:"#00aaff"},
                    {slug:"rg", label:"RG — Real Grade", sub:"1/144 with MG-level detail. Advanced snap-fit", color:"#ff2244"},
                    {slug:"mg", label:"MG — Master Grade", sub:"1/100 scale with inner frame. Intermediate", color:"#ff6600"},
                    {slug:"pg", label:"PG — Perfect Grade", sub:"1/60 scale. The ultimate Gunpla experience", color:"#ffcc00"},
                    {slug:"sd", label:"SD — Super Deformed", sub:"Chibi-style, fun and quick builds for all levels", color:"#00ffcc"},
                  ].map(item => (
                    <div key={item.slug} className="nav-dd-item" onClick={() => { closeNav(); navigate(`/grade/${item.slug}`); }}>
                      <span className="nav-dd-text">
                        <span className="nav-dd-label" style={{color:item.color}}>{item.label}</span>
                        <span className="nav-dd-sub">{item.sub}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </nav>

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
                        {isSignedIn && (() => {
                          const pct = getKitProgress(kit);
                          if (pct === null) return null;
                          const colors = pct >= 100
                            ? { "--xp-start":"#00cc66","--xp-end":"#00ffcc","--xp-glow":"rgba(0,255,136,0.7)","--xp-color":"#00ff88" }
                            : pct >= 50
                            ? { "--xp-start":"#cc8800","--xp-end":"#ffcc00","--xp-glow":"rgba(255,204,0,0.6)","--xp-color":"#ffcc00" }
                            : { "--xp-start":"#1a4aff","--xp-end":"#00aaff","--xp-glow":"rgba(0,170,255,0.6)","--xp-color":"#00aaff" };
                          return (
                            <div className="xp-slim" style={colors}>
                              <div className="xp-slim-track">
                                <div className="xp-slim-fill" style={{width:`${pct}%`}} />
                              </div>
                              <div className="xp-slim-label">
                                <span>BUILD PROGRESS</span>
                                <span className="xp-slim-pct">{pct}%</span>
                              </div>
                            </div>
                          );
                        })()}
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
          <Route path="/kit/:slug" element={<KitDetail gc={gc} isSignedIn={isSignedIn} favourites={favourites} buildProgress={buildProgress} pageProgress={pageProgress} toggleFavourite={toggleFavourite} setBuildStatus={setBuildStatus} setManualPage={setManualPage} openManualId={openManualId} toggleManual={toggleManual} setOpenManualId={setOpenManualId} goHome={goHome} />} />

          {/* ===== MY VAULT PAGE ===== */}
          <Route path="/vault" element={
            <>
              {(() => {
                // A kit appears in vault if: it's starred OR it has a build status set
                const vaultKits = KITS.filter(k =>
                  favourites.includes(k.id) ||
                  buildProgress[k.id] === "inprogress" ||
                  buildProgress[k.id] === "complete" ||
                  buildProgress[k.id] === "backlog"
                );
                const inProgress = vaultKits.filter(k => buildProgress[k.id] === "inprogress");
                const complete   = vaultKits.filter(k => buildProgress[k.id] === "complete");
                // Backlog = explicitly set to backlog, OR starred with no status
                const backlog    = vaultKits.filter(k =>
                  buildProgress[k.id] === "backlog" ||
                  (!buildProgress[k.id] && favourites.includes(k.id))
                );

                const renderVaultCard = (kit) => {
                  const c = gc(kit.grade);
                  const progress = buildProgress[kit.id];
                  const isFav = favourites.includes(kit.id);
                  const pct = getKitProgress(kit);
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
                            {(!progress || progress === "backlog") && <span className="build-badge" style={{background:"rgba(90,122,159,0.15)",border:"1px solid rgba(90,122,159,0.4)",color:"var(--text-dim)",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",padding:"2px 8px",letterSpacing:"1px"}}>BACKLOG</span>}
                            <button className="fav-btn" onClick={e => toggleFavourite(e, kit.id)} title={isFav?"Remove from favourites":"Add to favourites"}>
                              {isFav ? "⭐" : "☆"}
                            </button>
                          </div>
                        </div>
                        <div className="card-title">{kit.name}</div>
                        <div className="card-series">{kit.series}</div>
                        {pct !== null && (() => {
                          const colors = pct >= 100
                            ? { "--xp-start":"#00cc66","--xp-end":"#00ffcc","--xp-glow":"rgba(0,255,136,0.7)","--xp-color":"#00ff88" }
                            : pct >= 50
                            ? { "--xp-start":"#cc8800","--xp-end":"#ffcc00","--xp-glow":"rgba(255,204,0,0.6)","--xp-color":"#ffcc00" }
                            : { "--xp-start":"#1a4aff","--xp-end":"#00aaff","--xp-glow":"rgba(0,170,255,0.6)","--xp-color":"#00aaff" };
                          return (
                            <div className="xp-slim" style={colors}>
                              <div className="xp-slim-track">
                                <div className="xp-slim-fill" style={{width:`${pct}%`}} />
                              </div>
                              <div className="xp-slim-label">
                                <span>BUILD PROGRESS</span>
                                <span className="xp-slim-pct">{pct}%</span>
                              </div>
                            </div>
                          );
                        })()}
                        <div className="card-footer">
                          <span className="card-scale">SCALE {kit.scale}</span>
                          <span className="card-arrow">→</span>
                        </div>
                      </div>
                    </div>
                  );
                };

                return (
                  <>
                    <div className="page-hero">
                      <div className="page-tag">PERSONAL COLLECTION</div>
                      <div className="page-title">MY <span style={{color:"var(--accent)"}}>VAULT</span></div>
                      <div className="page-sub">{vaultKits.length} KIT{vaultKits.length!==1?"S":""} TRACKED</div>
                    </div>
                    {vaultKits.length === 0 ? (
                      <div className="vault-empty">
                        <span className="vault-empty-icon">⭐</span>
                        NOTHING IN YOUR VAULT YET<br/>
                        <span style={{fontSize:"0.7rem",opacity:0.5}}>STAR A KIT OR SET A BUILD STATUS TO ADD IT HERE</span>
                      </div>
                    ) : (
                      <div style={{padding:"0 40px 60px"}}>
                        {inProgress.length > 0 && (
                          <>
                            <div className="section-header" style={{padding:"0 0 20px",marginBottom:"4px"}}>
                              <span className="section-title" style={{color:"var(--gold)"}}>⚙ IN PROGRESS</span>
                              <div className="section-line" />
                              <span className="section-count">{inProgress.length} KIT{inProgress.length!==1?"S":""}</span>
                            </div>
                            <div className="vault-grid" style={{padding:"0 0 32px"}}>{inProgress.map(renderVaultCard)}</div>
                          </>
                        )}
                        {complete.length > 0 && (
                          <>
                            <div className="section-header" style={{padding:"0 0 20px",marginBottom:"4px"}}>
                              <span className="section-title" style={{color:"var(--green)"}}>✓ COMPLETED</span>
                              <div className="section-line" />
                              <span className="section-count">{complete.length} KIT{complete.length!==1?"S":""}</span>
                            </div>
                            <div className="vault-grid" style={{padding:"0 0 32px"}}>{complete.map(renderVaultCard)}</div>
                          </>
                        )}
                        {backlog.length > 0 && (
                          <>
                            <div className="section-header" style={{padding:"0 0 20px",marginBottom:"4px"}}>
                              <span className="section-title" style={{color:"var(--text-dim)"}}>◻ BACKLOG</span>
                              <div className="section-line" />
                              <span className="section-count">{backlog.length} KIT{backlog.length!==1?"S":""}</span>
                            </div>
                            <div className="vault-grid" style={{padding:"0 0 32px"}}>{backlog.map(renderVaultCard)}</div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          } />

          {/* ===== GRADE DETAIL PAGE ===== */}
          <Route path="/grade/:gradeSlug" element={<GradeDetail setGradeFilter={setGradeFilter} />} />

          {/* ===== RESOURCES PAGE ===== */}
          <Route path="/resources" element={
            <>
              <div className="page-hero">
                <div className="page-tag">GUIDES & LINKS</div>
                <div className="page-title">RESOURCES</div>
                <div className="page-sub">EVERYTHING YOU NEED TO BUILD BETTER</div>
              </div>
              <div className="resources-page">

                {/* COMMUNITY */}
                <div className="resources-section">
                  <div className="resources-section-title">◈ COMMUNITY</div>
                  <div className="resources-grid">
                    {[
                      { icon:"📖", label:"Gunpla Wiki", sub:"The definitive beginner resource — grades explained, tool guides, technique breakdowns, and FAQs. The best place to start if you're new to the hobby.", tag:"WIKI", href:"https://www.reddit.com/r/Gunpla/wiki/", color:"#00aaff" },
                      { icon:"💬", label:"r/Gunpla", sub:"The largest Gunpla community on the internet. Share your builds, ask questions, browse WIPs, and get feedback from thousands of builders worldwide.", tag:"REDDIT", href:"https://www.reddit.com/r/Gunpla/", color:"#ff6600" },
                      { icon:"🌐", label:"Gundam Base Online", sub:"Bandai's official Gunpla storefront and news hub. Best place to track new kit announcements, P-Bandai exclusives, and limited releases straight from the source.", tag:"OFFICIAL", href:"https://p-bandai.com/", color:"#00ffcc" },
                    ].map(r => (
                      <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{"--rc-color": r.color}}>
                        <span className="resource-card-icon">{r.icon}</span>
                        <span className="resource-card-body">
                          <span className="resource-card-label">{r.label}</span>
                          <span className="resource-card-sub">{r.sub}</span>
                          <span className="resource-card-tag">{r.tag}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* WHERE TO BUY */}
                <div className="resources-section">
                  <div className="resources-section-title">◈ WHERE TO BUY</div>
                  <div className="resources-grid">
                    {[
                      { icon:"🛒", label:"Hobbylink Japan (HLJ)", sub:"The go-to import retailer. Widest selection of kits at Japanese retail prices, ships worldwide. Great for pre-orders and hard-to-find kits.", tag:"IMPORT", href:"https://www.hlj.com", color:"#ff2244" },
                      { icon:"🛒", label:"Gundam Planet", sub:"US-based Gunpla specialist with fast domestic shipping. Good stock on current HG and MG releases, no import wait times.", tag:"US", href:"https://www.gundamplanet.com", color:"#00aaff" },
                      { icon:"🛒", label:"Nin-Nin Game", sub:"French-based import store with competitive pricing and reliable worldwide shipping. A strong alternative to HLJ, especially for EU builders.", tag:"IMPORT", href:"https://www.nin-nin-game.com", color:"#aa88ff" },
                      { icon:"🛒", label:"AmiAmi", sub:"Japanese marketplace with new and pre-owned kits at excellent prices. Pre-owned section is fantastic for older or discontinued releases.", tag:"IMPORT", href:"https://www.amiami.com", color:"#00ffcc" },
                    ].map(r => (
                      <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{"--rc-color": r.color}}>
                        <span className="resource-card-icon">{r.icon}</span>
                        <span className="resource-card-body">
                          <span className="resource-card-label">{r.label}</span>
                          <span className="resource-card-sub">{r.sub}</span>
                          <span className="resource-card-tag">{r.tag}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* KIT REVIEWS */}
                <div className="resources-section">
                  <div className="resources-section-title">◈ KIT REVIEWS & DATABASE</div>
                  <div className="resources-grid">
                    {[
                      { icon:"🔗", label:"Dalong.net Kit Reviews", sub:"Comprehensive Japanese kit review database with photos, runner breakdowns, and assembly notes on thousands of kits. Essential for research before buying.", tag:"DATABASE", href:"http://www.dalong.net", color:"#ffcc00" },
                    ].map(r => (
                      <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{"--rc-color": r.color}}>
                        <span className="resource-card-icon">{r.icon}</span>
                        <span className="resource-card-body">
                          <span className="resource-card-label">{r.label}</span>
                          <span className="resource-card-sub">{r.sub}</span>
                          <span className="resource-card-tag">{r.tag}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
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
                    <div className="donate-title">☕ BUY ME A COFFEE</div>
                    <div className="donate-sub">
                      KitVault.io is a free, non-profit fan resource.<br/>
                      Donations help cover hosting costs and keep the vault online.
                    </div>
                    <a className="btn-donate" href="https://ko-fi.com/YOUR_KOFI_USERNAME" target="_blank" rel="noopener noreferrer">
                      ☕ BUY ME A COFFEE
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
