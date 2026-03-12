// ─────────────────────────────────────────────────────────────
// App.jsx  — KitVault.io
// Main app shell: routes, shared state, header, footer.
// All page components live in src/components/.
// All data lives in src/data/.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Routes, Route, useNavigate, useLocation, Link, NavLink } from "react-router-dom";

// Styles
import "./styles/app.css";

// Data & constants
import {
  VERSION, GRADE_COLORS, GRADES,
  slugify, xpColors,
} from "./data/grades.js";

// Components — each in its own file
import AdminUpload from "./components/AdminUpload.jsx";
import GradeDetail from "./components/GradeDetail.jsx";
import KitDetail from "./components/KitDetail.jsx";
import ToolPage from "./components/ToolPage.jsx";
import Gallery from "./components/Gallery.jsx";
import Hangar from "./components/Hangar.jsx";

// SEO
import useSEO, { SEO, kitSEO, gradeSEO, toolSEO, hangarSEO } from "./hooks/useSEO.js";

// ─────────────────────────────────────────────────────────────
// SPRITE ROSTER — extracted to SpriteRoster.jsx
// ─────────────────────────────────────────────────────────────
import { SPRITES, ChibiSprite, MarqueeStrip, CustomizeModal, GuestCustomizeTeaser } from "./components/SpriteRoster.jsx";

// LOGIN MODAL — extracted to LoginModal.jsx
import LoginModal from "./components/LoginModal.jsx";

// ERROR BOUNDARY — extracted to ErrorBoundary.jsx
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// HERO SLIDESHOW — extracted to HeroSlideshow.jsx
import HeroSlideshow from "./components/HeroSlideshow.jsx";


function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

// KITVAULT APP — main component (routes + shared state)
// ─────────────────────────────────────────────────────────────
export default function KitVault() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Auth State (cookie-based) ─────────────────────────────────
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userDisplayName, setUserDisplayName] = useState("");
  const [userAvatarUrl, setUserAvatarUrl] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(true); // default true so no flash

  const isSignedIn = !!userId;

  // Check for existing session on page load (reads httpOnly cookie)
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setUserId(data.userId);
          setUserEmail(data.email);
          setUserDisplayName(data.displayName || "");
          setUserAvatarUrl(data.avatarUrl || "");
          setEmailVerified(data.emailVerified !== undefined ? data.emailVerified : true);
        }
      })
      .catch(() => { })
      .finally(() => setAuthLoading(false));
  }, []);

  // Kept for backward compat — code below references these
  const effectiveUserId = userId;
  const effectiveSignedIn = isSignedIn;
  // verifiedUser = signed in AND email verified — gates vault/hangar/build features
  const verifiedUser = isSignedIn && emailVerified;

  // ── Auth Handlers ─────────────────────────────────────────
  const handleLogin = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.ok) {
      setIsSignedIn(true);
      setUserId(data.userId);
      setUserEmail(data.email);
      setUserDisplayName(data.displayName || "");
      setUserAvatarUrl(data.avatarUrl || "");
      setEmailVerified(data.emailVerified !== undefined ? data.emailVerified : true);
      return { ok: true };
    }
    return { ok: false, error: data.error || "Login failed" };
  };

  const handleSignup = async (email, password) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.ok) {
      setIsSignedIn(true);
      setUserId(data.userId);
      setUserEmail(data.email);
      setUserDisplayName(data.displayName || "");
      setUserAvatarUrl(data.avatarUrl || "");
      setEmailVerified(data.emailVerified !== undefined ? data.emailVerified : false);
      return { ok: true };
    }
    return { ok: false, error: data.error || "Signup failed" };
  };

  const handleGoogleLogin = useCallback(async (credential) => {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (data.ok) {
      setUserId(data.userId);
      setUserEmail(data.email);
      setUserDisplayName(data.displayName || "");
      setUserAvatarUrl(data.avatarUrl || "");
      setEmailVerified(true); // Google users are always verified
      return { ok: true };
    }
    return { ok: false, error: data.error || "Google sign-in failed" };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUserId(null);
    setUserEmail(null);
    setUserDisplayName("");
    setUserAvatarUrl("");
  };

  const [openNav, setOpenNav] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const toggleNav = (name) => setOpenNav(prev => prev === name ? null : name);
  const closeNav = () => setOpenNav(null);
  const closeMobileMenu = () => { setMobileMenuOpen(false); closeNav(); };
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [kitPage, setKitPage] = useState(0);
  const [kitsPerPage, setKitsPerPage] = useState(50);
  const KITS_PER_PAGE_OPTIONS = [50, 100, 200];
  const [openManualId, setOpenManualId] = useState(null);
  const toggleManual = (id) => setOpenManualId(prev => prev === id ? null : id);
  const [showSettings, setShowSettings] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  // ── Back to top ──────────────────────────────────────────
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Theme persistence ──────────────────────────────────────
  const [currentTheme, setCurrentTheme] = useState(() => {
    return (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme")) || localStorage.getItem("kv-theme") || "dark";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("kv-theme", currentTheme);
  }, [currentTheme]);
  useEffect(() => {
    // Ensure Google Fonts load (Firefox fallback if CSS @import fails in Vite bundle)
    if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Rajdhani"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap";
      document.head.appendChild(link);
    }
  }, []);
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_favourites") || "[]"); } catch { return []; }
  });
  const [buildProgress, setBuildProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_progress") || "{}"); } catch { return {}; }
  });
  const [pageProgress, setPageProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_pages") || "{}"); } catch { return {}; }
  });
  const [kitTags, setKitTags] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_tags") || "{}"); } catch { return {}; }
  });
  const [openTagsId, setOpenTagsId] = useState(null);
  const [openMoreMenuId, setOpenMoreMenuId] = useState(null);
  const [duplicatedKits, setDuplicatedKits] = useState([]); // [{ afterId, kit }]
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ── Wishlist ─────────────────────────────────────────────────
  const [kitWishlist, setKitWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_wishlist") || "[]"); } catch { return []; }
  });

  // ── Build Timers ─────────────────────────────────────────────
  // { kitId: { accumulated: seconds, running: bool, startedAt: epoch_ms|null } }
  const [kitTimers, setKitTimers] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_timers") || "{}"); } catch { return {}; }
  });
  const [openTimerId, setOpenTimerId] = useState(null);
  const [timerTick, setTimerTick] = useState(0);
  const [confirmEndTimerId, setConfirmEndTimerId] = useState(null);
  const [confirmRestartTimerId, setConfirmRestartTimerId] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => setTimerTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const [collapsedSections, setCollapsedSections] = useState({});
  const toggleSection = (key) => setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  const [kitNotes, setKitNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kv_notes") || "{}"); } catch { return {}; }
  });
  const [openNotesId, setOpenNotesId] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  // ── D1 kits — merged with static list ────────────────────
  const [d1Kits, setD1Kits] = useState([]);
  const [kitsLoading, setKitsLoading] = useState(true);
  const fetchD1Kits = useCallback(() => {
    fetch("/api/kits")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setD1Kits(data); })
      .catch(() => { })
      .finally(() => setKitsLoading(false));
  }, []);
  useEffect(() => { fetchD1Kits(); }, [fetchD1Kits]);
  // All kits now come from D1 only
  const allKits = d1Kits;

  // ── XP + Sprites ─────────────────────────────────────────────
  const [xp, setXp] = useState(0);
  const [ownedSpriteIds, setOwnedSpriteIds] = useState([]);
  const [paradeIds, setParadeIds] = useState([]);
  const [showCustomize, setShowCustomize] = useState(false);

  const fetchXpAndSprites = useCallback(async () => {
    if (!effectiveSignedIn || !effectiveUserId) return;
    try {
      const res = await fetch(`/api/xp?user_id=${effectiveUserId}`);
      const data = await res.json();
      setXp(data.xp || 0);
      setOwnedSpriteIds(data.sprites || []);
      setParadeIds(data.parade || data.sprites || []);
    } catch (_) { }
  }, [effectiveSignedIn, effectiveUserId]);

  useEffect(() => { fetchXpAndSprites(); }, [fetchXpAndSprites]);

  useEffect(() => { if (effectiveUserId) window.__kvUserId = effectiveUserId; }, [effectiveUserId]);

  const ownedSprites = SPRITES.filter(s => ownedSpriteIds.includes(s.id));
  const paradeSprites = SPRITES.filter(s => paradeIds.includes(s.id));

  // ── Hangar Profile ───────────────────────────────────────────
  const [hangarProfile, setHangarProfile] = useState(null);
  const [hangarUsername, setHangarUsername] = useState("");
  const [hangarDisplayName, setHangarDisplayName] = useState("");
  const [hangarBio, setHangarBio] = useState("");
  const [hangarIsPublic, setHangarIsPublic] = useState(false);
  const [hangarSaving, setHangarSaving] = useState(false);
  const [hangarMsg, setHangarMsg] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const fetchHangarProfile = useCallback(async () => {
    if (!effectiveSignedIn || !effectiveUserId) return;
    try {
      const res = await fetch(`/api/hangar/profile?user_id=${effectiveUserId}`);
      const data = await res.json();
      if (data.ok && data.profile) {
        setHangarProfile(data.profile);
        setHangarUsername(data.profile.username || "");
        setHangarDisplayName(data.profile.display_name || "");
        setHangarBio(data.profile.bio || "");
        setHangarIsPublic(!!data.profile.is_public);
      }
    } catch (_) { }
  }, [effectiveSignedIn, effectiveUserId]);

  useEffect(() => { fetchHangarProfile(); }, [fetchHangarProfile]);

  // Listen for Hangar avatar click → open profile modal
  useEffect(() => {
    const handler = () => { setAvatarPreview(userAvatarUrl || ""); setHangarMsg(""); setShowProfileModal(true); };
    window.addEventListener("kitvault:openProfileModal", handler);
    return () => window.removeEventListener("kitvault:openProfileModal", handler);
  }, [userAvatarUrl]);

  // Username availability check (debounced)
  const usernameCheckTimer = useRef(null);
  const checkUsername = (val) => {
    setHangarUsername(val);
    setUsernameAvailable(null);
    setHangarMsg("");
    if (usernameCheckTimer.current) clearTimeout(usernameCheckTimer.current);
    const clean = val.trim().toLowerCase();
    if (clean.length < 3) { setUsernameAvailable(null); return; }
    if (!/^[a-z0-9_-]{3,24}$/.test(clean)) { setUsernameAvailable(false); setHangarMsg("Letters, numbers, _ and - only"); return; }
    // Skip check if unchanged from saved profile
    if (hangarProfile && clean === hangarProfile.username) { setUsernameAvailable(true); return; }
    usernameCheckTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/hangar/check-username?username=${clean}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
        if (!data.available) setHangarMsg("Username taken");
      } catch (_) { }
    }, 400);
  };

  const saveHangarProfile = async () => {
    if (!effectiveUserId || !hangarUsername.trim()) return;
    setHangarSaving(true);
    setHangarMsg("");
    try {
      const res = await fetch("/api/hangar/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: effectiveUserId,
          username: hangarUsername.trim().toLowerCase(),
          display_name: hangarDisplayName.trim(),
          avatar_url: userAvatarUrl || "",
          bio: hangarBio.trim(),
          is_public: hangarIsPublic,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setHangarMsg("✓ Saved");
        fetchHangarProfile();
      } else {
        setHangarMsg(data.error || "Failed to save");
      }
    } catch (err) {
      setHangarMsg("Network error");
    }
    setHangarSaving(false);
  };

  const handleAvatarUpload = async (file) => {
    if (!file || !effectiveUserId) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) { setHangarMsg("Image must be under 2MB"); return; }
    setAvatarUploading(true);
    setHangarMsg("");
    try {
      // Read as base64 data URL
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      // Resize to max 256px via canvas before saving
      const resized = await new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          const size = Math.min(img.width, img.height);
          const canvas = document.createElement("canvas");
          canvas.width = 256; canvas.height = 256;
          const ctx = canvas.getContext("2d");
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          ctx.drawImage(img, sx, sy, size, size, 0, 0, 256, 256);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.src = dataUrl;
      });
      // Update avatar URL in state and save to hangar profile
      setUserAvatarUrl(resized);
      setAvatarPreview(resized);
      // Save through existing profile endpoint
      await fetch("/api/hangar/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: effectiveUserId,
          username: hangarProfile?.username || hangarUsername.trim().toLowerCase(),
          display_name: hangarProfile?.display_name || hangarDisplayName.trim(),
          avatar_url: resized,
          bio: hangarProfile?.bio || hangarBio.trim(),
          is_public: hangarProfile?.is_public ?? hangarIsPublic,
        }),
      });
      setHangarMsg("✓ Photo saved");
      fetchHangarProfile();
    } catch (err) {
      setHangarMsg("Upload failed");
    }
    setAvatarUploading(false);
  };

  // ── D1 sync ──────────────────────────────────────────────────
  const D1_API = "/api/progress";

  const syncToD1 = useCallback(async (payload) => {
    if (!effectiveSignedIn || !effectiveUserId) return;
    try {
      await fetch(D1_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: effectiveUserId, ...payload }),
      });
    } catch (_) { /* silent fallback to localStorage */ }
  }, [effectiveSignedIn, effectiveUserId]);

  const syncToD1Debounced = useDebounce(syncToD1, 500);

  const loadFromD1 = useCallback(async () => {
    if (!effectiveSignedIn || !effectiveUserId) return;
    try {
      const res = await fetch(`${D1_API}?userId=${effectiveUserId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.favourites) { setFavourites(data.favourites); localStorage.setItem("kv_favourites", JSON.stringify(data.favourites)); }
      if (data.progress) { setBuildProgress(data.progress); localStorage.setItem("kv_progress", JSON.stringify(data.progress)); }
      if (data.pages) { setPageProgress(data.pages); localStorage.setItem("kv_pages", JSON.stringify(data.pages)); }
      if (data.tags) { setKitTags(data.tags); localStorage.setItem("kv_tags", JSON.stringify(data.tags)); }
      if (data.notes) { setKitNotes(data.notes); localStorage.setItem("kv_notes", JSON.stringify(data.notes)); }
      if (data.wishlist) { setKitWishlist(data.wishlist); localStorage.setItem("kv_wishlist", JSON.stringify(data.wishlist)); }
      if (data.timers) { setKitTimers(data.timers); localStorage.setItem("kv_timers", JSON.stringify(data.timers)); }
    } catch (_) { /* silent fallback to localStorage */ }
  }, [effectiveSignedIn, effectiveUserId]);

  useEffect(() => { loadFromD1(); }, [loadFromD1]);

  const toggleFavourite = (e, kitId) => {
    e.stopPropagation();
    if (!effectiveSignedIn) return;
    setFavourites(prev => {
      const next = prev.includes(kitId) ? prev.filter(id => id !== kitId) : [...prev, kitId];
      localStorage.setItem("kv_favourites", JSON.stringify(next));
      syncToD1({ favourites: next });
      return next;
    });
  };

  const setBuildStatus = (kitId, status) => {
    if (!effectiveSignedIn) return;
    setBuildProgress(prev => {
      const next = { ...prev };
      if (prev[kitId] === status) {
        delete next[kitId]; // toggle off
      } else {
        next[kitId] = status;
      }
      localStorage.setItem("kv_progress", JSON.stringify(next));
      syncToD1({ progress: next });
      return next;
    });
  };

  // Remove kit from vault entirely (clear status + unfavourite)
  const removeFromVault = (e, kitId) => {
    e.stopPropagation();
    if (!effectiveSignedIn) return;
    setBuildProgress(prev => {
      const next = { ...prev };
      delete next[kitId];
      localStorage.setItem("kv_progress", JSON.stringify(next));
      syncToD1({ progress: next });
      return next;
    });
    setFavourites(prev => {
      const next = prev.filter(id => id !== kitId);
      localStorage.setItem("kv_favourites", JSON.stringify(next));
      syncToD1({ favourites: next });
      return next;
    });
  };

  const duplicateKit = (kit) => {
    const dupId = `dup-${kit.id}-${Date.now()}`;
    const dupKit = { ...kit, id: dupId, _isDuplicate: true, _originalId: kit.id };
    setDuplicatedKits(prev => [...prev, { afterId: kit.id, kit: dupKit }]);
    setOpenMoreMenuId(null);
  };

  const removeDuplicate = (dupId) => {
    setDuplicatedKits(prev => prev.filter(d => d.kit.id !== dupId));
  };

  // ── Wishlist helpers ─────────────────────────────────────────
  const toggleWishlist = (kitId) => {
    setKitWishlist(prev => {
      const next = prev.includes(kitId) ? prev.filter(id => id !== kitId) : [...prev, kitId];
      localStorage.setItem("kv_wishlist", JSON.stringify(next));
      syncToD1({ wishlist: next });
      return next;
    });
  };

  // ── Timer helpers ────────────────────────────────────────────
  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const getLiveSeconds = (timer) => {
    if (!timer) return 0;
    const base = timer.accumulated || 0;
    if (!timer.running || !timer.startedAt) return base;
    return base + Math.floor((Date.now() - timer.startedAt) / 1000);
  };

  const timerStart = (kitId) => {
    if (!effectiveSignedIn) return;
    setKitTimers(prev => {
      const t = prev[kitId] || { accumulated: 0, running: false, startedAt: null };
      if (t.running) return prev;
      const next = { ...prev, [kitId]: { accumulated: t.accumulated, running: true, startedAt: Date.now() } };
      localStorage.setItem("kv_timers", JSON.stringify(next));
      syncToD1({ timers: next });
      return next;
    });
  };

  const timerPause = (kitId) => {
    if (!effectiveSignedIn) return;
    setKitTimers(prev => {
      const t = prev[kitId];
      if (!t || !t.running) return prev;
      const elapsed = Math.floor((Date.now() - t.startedAt) / 1000);
      const next = { ...prev, [kitId]: { accumulated: t.accumulated + elapsed, running: false, startedAt: null } };
      localStorage.setItem("kv_timers", JSON.stringify(next));
      syncToD1({ timers: next });
      return next;
    });
  };

  const timerEnd = (kitId) => {
    // Save final time then mark as ended (running: false, startedAt: null, ended: true)
    setKitTimers(prev => {
      const t = prev[kitId];
      const elapsed = t?.running && t?.startedAt ? Math.floor((Date.now() - t.startedAt) / 1000) : 0;
      const total = (t?.accumulated || 0) + elapsed;
      const next = { ...prev, [kitId]: { accumulated: total, running: false, startedAt: null, ended: true } };
      localStorage.setItem("kv_timers", JSON.stringify(next));
      syncToD1({ timers: next });
      return next;
    });
    setConfirmEndTimerId(null);
    setOpenTimerId(null);
  };

  const timerRestart = (kitId) => {
    setKitTimers(prev => {
      const next = { ...prev, [kitId]: { accumulated: 0, running: false, startedAt: null, ended: false } };
      localStorage.setItem("kv_timers", JSON.stringify(next));
      syncToD1({ timers: next });
      return next;
    });
    setConfirmRestartTimerId(null);
  };

  const KIT_TAG_OPTIONS = ["Panel Line", "Paint", "Scribe", "Decals", "Sanding"];

  const toggleKitTag = (e, kitId, tag) => {
    e.stopPropagation();
    setKitTags(prev => {
      const current = prev[kitId] || [];
      const next = current.includes(tag)
        ? current.filter(t => t !== tag)
        : [...current, tag];
      const updated = { ...prev, [kitId]: next };
      if (next.length === 0) delete updated[kitId];
      localStorage.setItem("kv_tags", JSON.stringify(updated));
      syncToD1({ tags: updated });
      return updated;
    });
  };

  const saveKitNote = (kitId, text) => {
    setKitNotes(prev => {
      const updated = { ...prev };
      if (text.trim()) { updated[kitId] = text.trim(); } else { delete updated[kitId]; }
      localStorage.setItem("kv_notes", JSON.stringify(updated));
      syncToD1({ notes: updated });
      return updated;
    });
  };

  const setManualPage = (kitId, manualId, currentPage, totalPages) => {
    if (!effectiveSignedIn) return;
    setPageProgress(prev => {
      const key = `${kitId}-${manualId}`;
      const next = { ...prev, [key]: { current: currentPage, total: totalPages } };
      localStorage.setItem("kv_pages", JSON.stringify(next));
      syncToD1Debounced({ pages: next });
      return next;
    });
  };

  const getKitProgress = (kit) => {
    const entries = kit.manuals.map(m => pageProgress[`${kit.id}-${m.id}`]).filter(Boolean);
    if (entries.length === 0) return null;
    const total = entries.reduce((sum, e) => sum + e.total, 0);
    const current = entries.reduce((sum, e) => sum + Math.min(e.current, e.total), 0);
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  // Memoized filtered kit list — includes allKits as dependency
  const filtered = useMemo(() => allKits.filter(k => {
    const matchGrade = gradeFilter === "ALL" || k.grade === gradeFilter;
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase()) || k.series.toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchSearch;
  }).sort((a, b) => {
    if (sortOrder === "az") return a.name.localeCompare(b.name);
    if (sortOrder === "za") return b.name.localeCompare(a.name);
    return (b.created_at || 0) - (a.created_at || 0);
  }), [allKits, gradeFilter, search, sortOrder]);

  // Reset to page 0 whenever the filtered results change
  useEffect(() => { setKitPage(0); }, [gradeFilter, search, sortOrder, kitsPerPage]);

  const gc = (g) => GRADE_COLORS[g] || GRADE_COLORS["HG"];
  const goHome = () => { setOpenManualId(null); navigate("/"); };
  const goVault = () => { setOpenManualId(null); navigate("/vault"); };
  const goDisclaimer = () => { setOpenManualId(null); setShowSettings(false); navigate("/disclaimer"); };

  // slugify accepts both objects and strings, so passing the kit object
  // ensures the slug includes grade + scale + name (matching KitDetail lookup)
  const goKit = (kit) => { setOpenManualId(null); navigate(`/kit/${slugify(kit)}`); };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // ── SEO — update title + meta per route ────────────────────
  const seoConfig = useMemo(() => {
    const p = location.pathname;
    if (p === "/") return SEO.home;
    if (p === "/vault") return SEO.vault;
    if (p === "/gallery") return SEO.gallery;
    if (p === "/resources") return SEO.resources;
    if (p === "/support") return SEO.support;
    if (p === "/disclaimer") return SEO.disclaimer;
    if (p === "/admin") return SEO.admin;
    if (p.startsWith("/kit/")) {
      const slug = p.replace("/kit/", "");
      const kit = allKits.find(k => slugify(k) === slug);
      return kit ? kitSEO(kit) : { title: "Kit Not Found", path: p };
    }
    if (p.startsWith("/grade/")) {
      return gradeSEO(p.replace("/grade/", ""));
    }
    if (p.startsWith("/tools/")) {
      return toolSEO(p.replace("/tools/", ""));
    }
    if (p.startsWith("/hangar/")) {
      return hangarSEO({ username: p.replace("/hangar/", "") });
    }
    return SEO.home;
  }, [location.pathname, allKits]);
  useSEO(seoConfig);

  // Renders a list of kits with any duplicates inserted inline after their original
  const renderWithDuplicates = (kits, opts) => {
    const cards = [];
    kits.forEach(kit => {
      cards.push(renderKitCard(kit, opts));
      duplicatedKits
        .filter(d => d.afterId === kit.id)
        .forEach(d => cards.push(renderKitCard(d.kit, opts)));
    });
    return cards;
  };

  const renderKitCard = (kit, { showBacklog = false, showRemove = false, showTags = false, showWishlistRemove = false } = {}) => {
    const c = gc(kit.grade);
    const isFav = favourites.includes(kit.id);
    const progress = buildProgress[kit.id];
    const pct = getKitProgress(kit);
    const activeTags = kitTags[kit.id] || [];
    const isTagsOpen = openTagsId === kit.id;
    const isMoreOpen = openMoreMenuId === kit.id;
    const isDuplicate = !!kit._isDuplicate;
    return (
      <div key={kit.id} className="kit-card"
        style={{ "--card-accent": c.accent, "--card-accent-bg": c.bg, position: "relative" }}
        onClick={() => {
          if (isTagsOpen) { setOpenTagsId(null); return; }
          if (isMoreOpen) { setOpenMoreMenuId(null); return; }
          if (!isDuplicate) goKit(kit);
        }}
      >
        <div className="card-grade-banner" style={{ background: c.accent }} />
        <div className="card-body">
          <div className="card-top">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="grade-badge">{kit.grade}</span>
              {showTags && effectiveSignedIn && (
                <button
                  className={`kit-tags-btn${isTagsOpen ? " active" : ""}`}
                  onClick={e => {
                    e.stopPropagation();
                    setOpenTagsId(isTagsOpen ? null : kit.id);
                    setOpenMoreMenuId(null);
                    setOpenNotesId(null);
                  }}
                  title="Manage tags"
                >TAGS</button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {progress === "inprogress" && <span className="build-badge inprogress">IN PROGRESS</span>}
              {progress === "complete" && <span className="build-badge complete">COMPLETE</span>}
              {showBacklog && (!progress || progress === "backlog") && (
                <span className="build-badge" style={{ background: "rgba(90,122,159,0.15)", border: "1px solid rgba(90,122,159,0.4)", color: "var(--text-dim)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", padding: "2px 8px", letterSpacing: "1px" }}>BACKLOG</span>
              )}
            </div>
          </div>
          <div className="card-title">{kit.name}</div>
          <div className="card-series">{kit.series}</div>
          {effectiveSignedIn && pct !== null && (() => {
            const colors = xpColors(pct);
            return (
              <div className="xp-slim" style={colors}>
                <div className="xp-slim-track">
                  <div className="xp-slim-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="xp-slim-label">
                  <span>BUILD PROGRESS</span>
                  <span className="xp-slim-pct">{pct}%</span>
                </div>
              </div>
            );
          })()}

          {/* Tag pills */}
          {showTags && activeTags.length > 0 && (
            <div className="kit-tag-pills">
              {activeTags.map(tag => (
                <span key={tag} className="kit-tag-pill">{tag}</span>
              ))}
            </div>
          )}

          {/* TAGS popover — opened via TAGS button */}
          {showTags && isTagsOpen && (
            <div className="kit-tag-popover" onClick={e => e.stopPropagation()}>
              <div className="kit-tag-popover-label">TODO TAGS</div>
              <div className="kit-tag-popover-options">
                {KIT_TAG_OPTIONS.map(tag => {
                  const active = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      className={`kit-tag-option${active ? " active" : ""}`}
                      onClick={e => toggleKitTag(e, kit.id, tag)}
                    >
                      {active ? "✓ " : ""}{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ••• dropdown — Duplicate + Delete + Move to Hangar */}
          {showTags && isMoreOpen && (
            <div className="kit-tag-popover" onClick={e => e.stopPropagation()}>
              <div className="kit-tag-popover-options" style={{ flexDirection: "column", gap: 6 }}>
                <button
                  className="kit-tag-option"
                  style={{ width: "100%", textAlign: "left" }}
                  onClick={e => { e.stopPropagation(); duplicateKit(kit); }}
                >⧉ DUPLICATE</button>
                <button
                  className="kit-tag-option"
                  style={{ width: "100%", textAlign: "left", color: "var(--red)", borderColor: "rgba(255,34,68,0.3)" }}
                  onClick={e => { e.stopPropagation(); setOpenMoreMenuId(null); if (isDuplicate) { removeDuplicate(kit.id); } else { setConfirmDeleteId(kit.id); } }}
                >🗑 DELETE</button>
                {effectiveSignedIn && hangarProfile?.username && !isDuplicate && (
                  <button
                    className="kit-tag-option"
                    style={{ width: "100%", textAlign: "left", color: favourites.includes(kit.id) ? "var(--text-dim)" : "var(--accent3)", borderColor: favourites.includes(kit.id) ? "var(--border)" : "rgba(0,255,204,0.3)", marginTop: 4, borderTop: "1px solid var(--border)", paddingTop: 10 }}
                    onClick={e => {
                      e.stopPropagation();
                      if (!favourites.includes(kit.id)) { toggleFavourite(e, kit.id); setOpenMoreMenuId(null); }
                    }}
                  >
                    {favourites.includes(kit.id) ? "✓ IN HANGAR" : "✈ MOVE TO HANGAR"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Notes panel */}
          {showTags && openNotesId === kit.id && (
            <div className="kit-notes-panel" onClick={e => e.stopPropagation()}>
              <div className="kit-notes-label">
                <span>KIT NOTES</span>
                <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>{noteDraft.length}/1000</span>
              </div>
              <textarea
                className="kit-notes-textarea"
                maxLength={1000}
                placeholder="Record your progress, paint colours, build notes..."
                value={noteDraft}
                onChange={e => setNoteDraft(e.target.value)}
                autoFocus
              />
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button className="kit-notes-save" onClick={e => { e.stopPropagation(); saveKitNote(kit.id, noteDraft); setOpenNotesId(null); }}>
                  ✓ SAVE
                </button>
                <button className="kit-notes-cancel" onClick={e => { e.stopPropagation(); setOpenNotesId(null); }}>
                  CANCEL
                </button>
              </div>
            </div>
          )}

          {/* Timer panel */}
          {showTags && openTimerId === kit.id && (() => {
            const timerId = kit._originalId || kit.id;
            const timer = kitTimers[timerId];
            const liveSeconds = getLiveSeconds(timer);
            const isRunning = timer?.running;
            const isEnded = timer?.ended;
            return (
              <div className="kit-timer-panel" onClick={e => e.stopPropagation()}>
                <div className="kit-timer-display">{formatTimer(liveSeconds)}</div>
                <div className="kit-timer-label">BUILD TIME{isDuplicate ? " (SHARED)" : ""}</div>
                {!isEnded ? (
                  <div className="kit-timer-controls">
                    {!isRunning ? (
                      <button className="kit-timer-btn start" onClick={e => { e.stopPropagation(); timerStart(timerId); }}>▶ START</button>
                    ) : (
                      <button className="kit-timer-btn pause" onClick={e => { e.stopPropagation(); timerPause(timerId); }}>⏸ PAUSE</button>
                    )}
                    <button className="kit-timer-btn end" onClick={e => { e.stopPropagation(); setConfirmEndTimerId(timerId); }}>⏹ END</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.58rem", color: "var(--green)", letterSpacing: "1.5px" }}>✓ BUILD COMPLETE</div>
                    <button className="kit-timer-btn start" style={{ fontSize: "0.58rem", padding: "5px 12px" }} onClick={e => { e.stopPropagation(); setConfirmRestartTimerId(timerId); }}>↺ RESTART</button>
                  </div>
                )}
              </div>
            );
          })()}

          <div className="card-footer">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {showTags && effectiveSignedIn && (
                <button
                  className={`kit-notes-btn${kitNotes[kit.id] ? " has-note" : ""}`}
                  onClick={e => {
                    e.stopPropagation();
                    if (openNotesId === kit.id) { setOpenNotesId(null); return; }
                    setNoteDraft(kitNotes[kit.id] || "");
                    setOpenNotesId(kit.id);
                  }}
                  title="Kit notes"
                >✎ NOTES</button>
              )}
              {showTags && effectiveSignedIn && (
                <button
                  className={`kit-timer-btn-small${kitTimers[kit._originalId || kit.id]?.running ? " running" : ""}${kitTimers[kit._originalId || kit.id]?.ended ? " ended" : ""}`}
                  onClick={e => { e.stopPropagation(); setOpenTimerId(openTimerId === kit.id ? null : kit.id); setOpenNotesId(null); setOpenTagsId(null); setOpenMoreMenuId(null); }}
                  title="Build timer"
                >⏱ TIMER</button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {showTags && effectiveSignedIn && (
                <button
                  className="kit-tag-menu-btn"
                  onClick={e => { e.stopPropagation(); setOpenMoreMenuId(isMoreOpen ? null : kit.id); setOpenTagsId(null); setOpenNotesId(null); }}
                  title="More options"
                >•••</button>
              )}
              {effectiveSignedIn && (
                <button className="fav-btn" onClick={e => toggleFavourite(e, kit.id)} title={isFav ? "Remove from favourites" : "Add to favourites"}>
                  {isFav ? "⭐" : "☆"}
                </button>
              )}
              {showRemove && !isDuplicate && (
                <button className="vault-remove-btn" onClick={e => { e.stopPropagation(); setConfirmDeleteId(kit.id); }} title="Remove from vault">🗑</button>
              )}
              {showWishlistRemove && (
                <button className="vault-remove-btn" onClick={e => { e.stopPropagation(); toggleWishlist(kit.id); }} title="Remove from wishlist">🗑</button>
              )}
              {!isDuplicate && <span className="card-arrow">→</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid-bg" />
      <div className="app">

        {/* CLERK DOWN BANNER */}
        {currentTheme === "cat" && (
          <style>{`
            [data-theme="cat"] .kit-card,
            [data-theme="cat"] .manual-item,
            [data-theme="cat"] .settings-modal,
            [data-theme="cat"] .settings-section,
            [data-theme="cat"] .nav-dropdown,
            [data-theme="cat"] .resource-card,
            [data-theme="cat"] .disclaimer-card,
            [data-theme="cat"] .disclaimer-block,
            [data-theme="cat"] .donate-block,
            [data-theme="cat"] .affiliate-banner,
            [data-theme="cat"] .vault-empty,
            [data-theme="cat"] .controls,
            [data-theme="cat"] .section-header,
            [data-theme="cat"] .page-hero,
            [data-theme="cat"] .comment-item,
            [data-theme="cat"] .bandai-badge,
            [data-theme="cat"] .modal-overlay .settings-body,
            [data-theme="cat"] .xp-slim {
              background-color: rgba(60, 40, 30, 0.95) !important;
            }
            [data-theme="cat"] .card-body,
            [data-theme="cat"] .pdf-dropdown-inner,
            [data-theme="cat"] .pdf-dropdown-header {
              background-color: rgba(70, 45, 35, 0.97) !important;
            }
            [data-theme="cat"] .hero {
              background-color: rgba(50, 30, 20, 0.9) !important;
            }
          `}</style>
        )}

        {/* HEADER */}
        <header className="header" style={{ position: "relative" }} onClick={e => { if (!e.target.closest('.nav-item')) closeNav(); }}>
          <style>{`
            @keyframes kvMarquee { from{transform:translateX(0)} to{transform:translateX(-33.3333%)} }
            @keyframes kvPurchasePop { 0%{transform:scale(0.9)} 60%{transform:scale(1.04)} 100%{transform:scale(1)} }
            @keyframes kvBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
          `}</style>
          <Link to="/" className="logo" onClick={() => setOpenManualId(null)} style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
            <div className="logo-icon">▣</div>
            <div className="logo-text">
              <span>KIT<span style={{ color: "#ff6600" }}>VAULT</span></span>
              <span className="logo-sub">KITVAULT.IO</span>
            </div>
          </Link>

          <div className="header-right">
            <div className="status-dot" />

            {/* ── HAMBURGER (mobile only) ── */}
            <button className={`hamburger-btn${mobileMenuOpen ? " open" : ""}`} onClick={() => setMobileMenuOpen(v => !v)} aria-label="Menu">
              <span /><span /><span />
            </button>

            {/* ── NAV RIGHT ── */}
            <nav className={`nav-right${mobileMenuOpen ? " mobile-open" : ""}`}>

              {/* TOOLS */}
              <div className={`nav-item${openNav === "tools" ? " open" : ""}`}>
                <button className="nav-btn" onClick={() => toggleNav("tools")}>
                  TOOLS <span className="nav-btn-arrow">▼</span>
                </button>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">◈ HOBBY TOOLS</div>
                  {[
                    { icon: "✂️", label: "Nippers", sub: "Side cutters for clean gate removal. The most essential tool in your kit.", route: "/tools/nippers" },
                    { icon: "🔧", label: "Panel Line Markers", sub: "Gundam markers & enamel washes for detail lines", route: "/tools/panel-line-markers" },
                    { icon: "📐", label: "Scribers & Chisels", sub: "For adding custom panel lines and surface detail", route: "/tools/scribers" },
                    { icon: "🪵", label: "Sanding Sticks", sub: "400→1000→2000 grit for seamline removal & gate cleanup", route: "/tools/sanding" },
                    { icon: "🎨", label: "Paints & Primers", sub: "Mr. Color, Citadel, Vallejo and more. Airbrushing and hand painting.", route: "/tools/paints" },
                    { icon: "💨", label: "Airbrushes", sub: "Iwata, Badger, GSI Creos. Starter to pro setups covered.", route: "/tools/airbrushes" },
                    { icon: "🧴", label: "Top Coats", sub: "Gloss, semi-gloss, matte. Lock in your finish and protect your work.", route: "/tools/top-coats" },
                    { icon: "🪚", label: "Hobby Knives", sub: "Olfa & X-Acto knives for cleanup and minor modifications", route: "/tools/hobby-knives" },
                  ].map(item => (
                    item.route
                      ? (
                        <Link key={item.label} to={item.route} className="nav-dd-item" onClick={closeMobileMenu} style={{ textDecoration: "none" }}>
                          <span className="nav-dd-icon">{item.icon}</span>
                          <span className="nav-dd-text">
                            <span className="nav-dd-label">{item.label}</span>
                            <span className="nav-dd-sub">{item.sub}</span>
                          </span>
                        </Link>
                      ) : (
                        <div key={item.label} className="nav-dd-item">
                          <span className="nav-dd-icon">{item.icon}</span>
                          <span className="nav-dd-text">
                            <span className="nav-dd-label">{item.label}<span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim)", marginLeft: 8, letterSpacing: 1 }}>SOON</span></span>
                            <span className="nav-dd-sub">{item.sub}</span>
                          </span>
                        </div>
                      )
                  ))}
                </div>
              </div>

              {/* RESOURCES */}
              <NavLink
                to="/resources"
                className="nav-btn"
                onClick={closeMobileMenu}
                style={({ isActive }) => ({ color: isActive ? "#ffcc00" : "", textDecoration: "none" })}
              >
                RESOURCES
              </NavLink>

              {/* GALLERY */}
              <NavLink
                to="/gallery"
                className="nav-btn"
                onClick={closeMobileMenu}
                style={({ isActive }) => ({ color: isActive ? "#ffcc00" : "", textDecoration: "none" })}
              >
                GALLERY
              </NavLink>

              {/* GRADES */}
              <div className={`nav-item${openNav === "grades" ? " open" : ""}`}>
                <button className="nav-btn" onClick={() => toggleNav("grades")}>
                  GRADES <span className="nav-btn-arrow">▼</span>
                </button>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">◈ KIT GRADE GUIDE</div>
                  {[
                    { slug: "eg", label: "EG — Entry Grade", sub: "Snap-fit, no nippers needed. Perfect first kit", color: "#aa88ff" },
                    { slug: "hg", label: "HG — High Grade", sub: "1/144 scale. Best variety, great for beginners", color: "#00aaff" },
                    { slug: "rg", label: "RG — Real Grade", sub: "1/144 with MG-level detail. Advanced snap-fit", color: "#ff2244" },
                    { slug: "mg", label: "MG — Master Grade", sub: "1/100 scale with inner frame. Intermediate", color: "#ff6600" },
                    { slug: "pg", label: "PG — Perfect Grade", sub: "1/60 scale. The ultimate Gunpla experience", color: "#ffcc00" },
                    { slug: "sd", label: "SD — Super Deformed", sub: "Chibi-style, fun and quick builds for all levels", color: "#00ffcc" },
                    { slug: "mgsd", label: "MGSD — Master Grade SD", sub: "MG inner frame with SD proportions. Best of both", color: "#ff6677" },
                  ].map(item => (
                    <Link key={item.slug} to={`/grade/${item.slug}`} className="nav-dd-item" onClick={closeMobileMenu} style={{ textDecoration: "none" }}>
                      <span className="nav-dd-text">
                        <span className="nav-dd-label" style={{ color: item.color }}>{item.label}</span>
                        <span className="nav-dd-sub">{item.sub}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

            </nav>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu} />}

            {/* ROSTER + VAULT + HANGAR (desktop: inline here, mobile: drops to sub-row) */}
            <div className="header-action-btns">
              {effectiveSignedIn ? (
                <button onClick={() => setShowCustomize(true)} className="hangar-btn">
                  ◈ ROSTER
                  <span className="hangar-xp-badge">{xp} XP</span>
                </button>
              ) : (
                <button onClick={() => setShowCustomize(true)} className="hangar-btn locked">
                  🔒 ROSTER
                </button>
              )}

              {effectiveSignedIn && (
                <>
                  <NavLink
                    to="/vault"
                    className={({ isActive }) => `vault-btn${isActive ? " active" : ""}`}
                    style={{ textDecoration: "none" }}
                    onClick={() => setOpenManualId(null)}
                  >
                    VAULT
                  </NavLink>
                  {hangarProfile?.username && (
                    <NavLink
                      to={`/hangar/${hangarProfile.username}`}
                      className={({ isActive }) => `vault-btn${isActive ? " active" : ""}`}
                      style={{ textDecoration: "none" }}
                    >
                      HANGAR
                    </NavLink>
                  )}
                </>
              )}
              <a className="vault-btn" href="https://discord.gg/NGXB3bYW8a" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#7289da", borderColor: "rgba(114,137,218,0.3)" }}>
                DISCORD
              </a>
            </div>

            {/* THEME DROPDOWN */}
            <div className={`nav-item theme-picker${openNav === "theme" ? " open" : ""}`}>
              <button className="theme-toggle-btn" onClick={() => toggleNav("theme")} title="Change Theme" style={{ fontSize: "0.6rem", letterSpacing: "1px" }}>THEME</button>
              <div className="nav-dropdown theme-dropdown">
                <div className="nav-dropdown-header">◈ THEME</div>
                {[
                  { id: "dark", label: "Dark Mode", icon: "🌑", sub: "Default tech blue" },
                  { id: "light", label: "Light Mode", icon: "☀️", sub: "Clean and bright" },
                  { id: "neko", label: "Cyber Pink", icon: "🌸", sub: "Digital rose glow" },
                  { id: "cat", label: "Cat Mode", icon: "🐱", sub: "Meow! Cats everywhere" },
                ].map(t => (
                  <div key={t.id} className={`nav-dd-item${currentTheme === t.id ? " active-theme" : ""}`} onClick={() => {
                    setCurrentTheme(t.id);
                    closeNav();
                  }}>
                    <span className="nav-dd-icon">{t.icon}</span>
                    <span className="nav-dd-text">
                      <span className="nav-dd-label">{t.label}</span>
                      <span className="nav-dd-sub">{t.sub}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="header-profile">
              {effectiveSignedIn ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() => { setAvatarPreview(userAvatarUrl || ""); setHangarMsg(""); setShowProfileModal(true); }}
                    title="Edit profile"
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", borderRadius: "50%" }}
                  >
                    {userAvatarUrl ? (
                      <img src={userAvatarUrl} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(0,170,255,0.4)", display: "block", transition: "border-color 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,170,255,0.9)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,170,255,0.4)"} />
                    ) : (
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(0,170,255,0.4)",
                        background: "rgba(0,170,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "#00aaff", transition: "all 0.2s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,170,255,0.9)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,170,255,0.4)"}>
                        {(userDisplayName || userEmail || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                  <button className="auth-btn" onClick={handleLogout} style={{ fontSize: "0.55rem" }}>LOG OUT</button>
                </div>
              ) : (
                <button className="auth-btn" onClick={() => setShowLoginModal(true)} style={{ background: "rgba(0,170,255,0.15)", borderColor: "rgba(0,170,255,0.4)", color: "#00aaff" }}>
                  LOG IN
                </button>
              )}
            </div>
            <button className={`cog-btn ${showSettings ? "active" : ""}`} onClick={() => setShowSettings(true)} title="Settings">⚙</button>
          </div>
        </header>

        {/* MARQUEE — owned sprites parade (logged-in only) */}
        {effectiveSignedIn && (
          <MarqueeStrip ownedSprites={paradeSprites} />
        )}

        {/* EMAIL VERIFICATION BANNER */}
        {effectiveSignedIn && !emailVerified && (() => {
          const [resending, setResending] = React.useState(false);
          const [resendMsg, setResendMsg] = React.useState("");
          const handleResend = async () => {
            setResending(true); setResendMsg("");
            try {
              const res = await fetch("/api/auth/resend-verification", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail }),
              });
              const data = await res.json();
              setResendMsg(data.ok ? "✓ Verification email sent!" : (data.error || "Failed"));
            } catch { setResendMsg("Network error"); }
            setResending(false);
          };
          return (
            <div style={{
              background: "rgba(255,170,0,0.08)", border: "1px solid rgba(255,170,0,0.25)",
              padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "center",
              gap: 16, flexWrap: "wrap",
            }}>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "#ffaa00", letterSpacing: "1px" }}>
                ⚠ VERIFY YOUR EMAIL TO UNLOCK VAULT, HANGAR & BUILD FEATURES
              </span>
              <button
                onClick={handleResend} disabled={resending}
                style={{
                  background: "rgba(255,170,0,0.1)", border: "1px solid rgba(255,170,0,0.4)",
                  color: "#ffaa00", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem",
                  padding: "6px 16px", cursor: resending ? "wait" : "pointer", letterSpacing: "1px",
                }}
              >{resending ? "SENDING..." : "RESEND EMAIL"}</button>
              {resendMsg && <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: resendMsg.startsWith("✓") ? "#00ff88" : "#ff3c3c", letterSpacing: "0.5px" }}>{resendMsg}</span>}
            </div>
          );
        })()}

        <ErrorBoundary>
          <Routes>

            {/* ===== VERIFY EMAIL PAGE ===== */}
            <Route path="/verify-email" element={(() => {
              const VerifyEmail = () => {
                const [status, setStatus] = React.useState("verifying");
                const [msg, setMsg] = React.useState("");
                React.useEffect(() => {
                  const params = new URLSearchParams(window.location.search);
                  const token = params.get("token");
                  if (!token) { setStatus("error"); setMsg("Missing verification token"); return; }
                  fetch(`/api/auth/verify-email?token=${token}`, { credentials: "include" })
                    .then(r => r.json())
                    .then(data => {
                      if (data.ok) {
                        setStatus("success"); setMsg(data.message || "Email verified!");
                        setEmailVerified(true);
                      } else {
                        setStatus("error"); setMsg(data.error || "Verification failed");
                      }
                    })
                    .catch(() => { setStatus("error"); setMsg("Network error"); });
                }, []);
                return (
                  <div style={{ textAlign: "center", padding: "120px 20px" }}>
                    {status === "verifying" && (
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.8rem", color: "var(--text-dim)", letterSpacing: "2px" }}>VERIFYING...</div>
                    )}
                    {status === "success" && (
                      <>
                        <div style={{ fontSize: "2rem", marginBottom: 16 }}>✓</div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.85rem", color: "#00ff88", letterSpacing: "2px", marginBottom: 16 }}>EMAIL VERIFIED</div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", marginBottom: 24, lineHeight: 1.8 }}>{msg}</div>
                        <button onClick={() => navigate("/")} style={{ background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)", color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "10px 24px", cursor: "pointer", letterSpacing: "1.5px" }}>
                          ← BACK TO KITVAULT
                        </button>
                      </>
                    )}
                    {status === "error" && (
                      <>
                        <div style={{ fontSize: "2rem", marginBottom: 16 }}>✕</div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.85rem", color: "#ff2244", letterSpacing: "2px", marginBottom: 16 }}>VERIFICATION FAILED</div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", marginBottom: 24, lineHeight: 1.8 }}>{msg}</div>
                        <button onClick={() => navigate("/")} style={{ background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)", color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "10px 24px", cursor: "pointer", letterSpacing: "1.5px" }}>
                          ← BACK TO KITVAULT
                        </button>
                      </>
                    )}
                  </div>
                );
              };
              return <VerifyEmail />;
            })()} />

            {/* ===== RESET PASSWORD PAGE ===== */}
            <Route path="/reset-password" element={(() => {
              const ResetPassword = () => {
                const [newPassword, setNewPassword] = React.useState("");
                const [confirmPw, setConfirmPw] = React.useState("");
                const [status, setStatus] = React.useState("form"); // form | loading | success | error
                const [msg, setMsg] = React.useState("");
                const params = new URLSearchParams(window.location.search);
                const token = params.get("token");

                const handleReset = async () => {
                  if (!token) { setStatus("error"); setMsg("Missing reset token"); return; }
                  if (newPassword.length < 8) { setMsg("Password must be at least 8 characters"); return; }
                  if (newPassword !== confirmPw) { setMsg("Passwords don't match"); return; }
                  setStatus("loading"); setMsg("");
                  try {
                    const res = await fetch("/api/auth/reset-password", {
                      method: "POST", headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ token, newPassword }),
                    });
                    const data = await res.json();
                    if (data.ok) { setStatus("success"); setMsg(data.message || "Password reset!"); }
                    else { setStatus("form"); setMsg(data.error || "Reset failed"); }
                  } catch { setStatus("form"); setMsg("Network error"); }
                };

                if (!token) return (
                  <div style={{ textAlign: "center", padding: "120px 20px" }}>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.85rem", color: "#ff2244", letterSpacing: "2px", marginBottom: 16 }}>INVALID RESET LINK</div>
                    <button onClick={() => navigate("/")} style={{ background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)", color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "10px 24px", cursor: "pointer", letterSpacing: "1.5px" }}>← BACK TO KITVAULT</button>
                  </div>
                );

                return (
                  <div style={{ maxWidth: 420, margin: "80px auto", padding: "0 20px" }}>
                    <div style={{ background: "linear-gradient(160deg,#0a1628 0%,#070f1e 100%)", border: "1px solid rgba(255,102,0,0.3)", padding: "36px 32px", clipPath: "polygon(0 0,96% 0,100% 4%,100% 100%,4% 100%,0 96%)" }}>
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "#ff6600", letterSpacing: "3px", marginBottom: 24 }}>◈ RESET PASSWORD</div>

                      {status === "success" ? (
                        <>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", color: "#00ff88", letterSpacing: "1px", marginBottom: 20, lineHeight: 1.8 }}>✓ {msg}</div>
                          <button onClick={() => { navigate("/"); setShowLoginModal(true); }} style={{ width: "100%", background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)", color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "12px", cursor: "pointer", letterSpacing: "2px" }}>SIGN IN →</button>
                        </>
                      ) : (
                        <>
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "#5a7a9f", letterSpacing: "1px", marginBottom: 4 }}>NEW PASSWORD (8+ CHARACTERS)</div>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••"
                              style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 12px", outline: "none", boxSizing: "border-box" }} />
                          </div>
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "#5a7a9f", letterSpacing: "1px", marginBottom: 4 }}>CONFIRM PASSWORD</div>
                            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••"
                              onKeyDown={e => e.key === "Enter" && handleReset()}
                              style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8ddf5", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "10px 12px", outline: "none", boxSizing: "border-box" }} />
                          </div>
                          {msg && <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", color: "#ff3c3c", letterSpacing: "0.5px", marginBottom: 12 }}>{msg}</div>}
                          <button onClick={handleReset} disabled={status === "loading"}
                            style={{ width: "100%", background: "rgba(255,102,0,0.1)", border: "1px solid rgba(255,102,0,0.3)", color: "#ff6600", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", padding: "12px", cursor: status === "loading" ? "wait" : "pointer", letterSpacing: "2px" }}>
                            {status === "loading" ? "RESETTING..." : "SET NEW PASSWORD →"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              };
              return <ResetPassword />;
            })()} />

            {/* ===== HOME PAGE ===== */}
            <Route path="/" element={
              <>
                <HeroSlideshow allKitsCount={allKits.length} effectiveSignedIn={effectiveSignedIn} buildProgress={buildProgress} kitTimers={kitTimers} favourites={favourites} formatTimer={formatTimer} />

                <div className="controls">
                  <div className="controls-row">
                    <div className="search-wrap">
                      <span className="search-icon">⌕</span>
                      <input className="search-input" placeholder="Search for Kits" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                  </div>
                  <div className="controls-row">
                    <span className="controls-label">GRADE</span>
                    {GRADES.map(g => {
                      const c = GRADE_COLORS[g];
                      const isActive = gradeFilter === g;
                      const accent = g === "ALL" ? "var(--accent)" : c?.accent || "var(--accent)";
                      return (
                        <button
                          key={g}
                          className={`filter-btn ${isActive ? "active" : ""}`}
                          style={isActive ? { borderColor: accent, color: accent, background: `${c?.bg || "rgba(0,170,255,0.08)"}`, boxShadow: `0 0 12px ${accent}33` } : {}}
                          onClick={() => setGradeFilter(g)}
                        >{g}</button>
                      );
                    })}
                    <div className="filter-divider" />
                    <span className="controls-label">SORT</span>
                    <button className={`sort-btn ${sortOrder === "az" ? "active" : ""}`} onClick={() => setSortOrder(s => s === "az" ? "default" : "az")}>A→Z</button>
                    <button className={`sort-btn ${sortOrder === "za" ? "active" : ""}`} onClick={() => setSortOrder(s => s === "za" ? "default" : "za")}>Z→A</button>
                  </div>
                </div>

                <div className="section-header">
                  <span className="section-title">KIT LIBRARY</span>
                  <div className="section-line" />
                  <span className="section-count">{filtered.length} RESULTS</span>
                </div>

                <div className="kit-grid">
                  {kitsLoading ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px" }}>
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.75rem", color: "var(--text-dim)", letterSpacing: "2px" }}>
                        LOADING KITS...
                      </div>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px" }}>
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.75rem", color: "var(--text-dim)", letterSpacing: "2px" }}>
                        NO KITS FOUND
                      </div>
                    </div>
                  ) : (
                    filtered.slice(kitPage * kitsPerPage, (kitPage + 1) * kitsPerPage).map(kit => renderKitCard(kit))
                  )}
                </div>

                {/* ── Pagination controls ── */}
                {!kitsLoading && filtered.length > 50 && (() => {
                  const totalPages = Math.ceil(filtered.length / kitsPerPage);
                  const startKit = kitPage * kitsPerPage + 1;
                  const endKit = Math.min((kitPage + 1) * kitsPerPage, filtered.length);
                  return (
                    <div className="kit-pagination">
                      <button
                        className="kit-page-btn"
                        disabled={kitPage === 0}
                        onClick={() => { setKitPage(p => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      >‹ PREV</button>

                      <div className="kit-page-info">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span className="kit-page-range">{startKit}–{endKit} of {filtered.length}</span>
                          <div className="kit-per-page">
                            {KITS_PER_PAGE_OPTIONS.map(n => (
                              <button
                                key={n}
                                className={`kit-per-page-btn${kitsPerPage === n ? " active" : ""}`}
                                onClick={() => setKitsPerPage(n)}
                              >{n}</button>
                            ))}
                          </div>
                        </div>
                        <div className="kit-page-dots">
                          {Array.from({ length: totalPages }).map((_, i) => {
                            const show = i === 0 || i === totalPages - 1 || Math.abs(i - kitPage) <= 1;
                            const isEllipsisBefore = i === 1 && kitPage > 2;
                            const isEllipsisAfter = i === totalPages - 2 && kitPage < totalPages - 3;
                            if (!show) return null;
                            if (isEllipsisBefore || isEllipsisAfter) {
                              return <span key={i} className="kit-page-ellipsis">···</span>;
                            }
                            return (
                              <button
                                key={i}
                                className={`kit-page-num${i === kitPage ? " active" : ""}`}
                                onClick={() => { setKitPage(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                              >{i + 1}</button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        className="kit-page-btn"
                        disabled={kitPage >= totalPages - 1}
                        onClick={() => { setKitPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      >NEXT ›</button>
                    </div>
                  );
                })()}
              </>
            } />

            {/* ===== KIT DETAIL PAGE ===== */}
            <Route path="/kit/:slug" element={
              <KitDetail
                allKits={allKits} isSignedIn={effectiveSignedIn} user={{ id: effectiveUserId, email: userEmail, fullName: userDisplayName, imageUrl: userAvatarUrl }}
                favourites={favourites} buildProgress={buildProgress}
                pageProgress={pageProgress} toggleFavourite={toggleFavourite}
                setBuildStatus={setBuildStatus} setManualPage={setManualPage}
                openManualId={openManualId} toggleManual={toggleManual}
                setOpenManualId={setOpenManualId} goHome={goHome}
                onKitUpdated={fetchD1Kits}
                kitNotes={kitNotes} saveKitNote={saveKitNote}
                kitWishlist={kitWishlist} toggleWishlist={toggleWishlist}
                kitTimers={kitTimers} timerStart={timerStart} timerPause={timerPause}
                setConfirmEndTimerId={setConfirmEndTimerId}
                setConfirmRestartTimerId={setConfirmRestartTimerId}
                formatTimer={formatTimer} getLiveSeconds={getLiveSeconds} timerTick={timerTick}
              />
            } />

            {/* ===== MY VAULT PAGE ===== */}
            <Route path="/vault" element={
              <>
                {!verifiedUser && effectiveSignedIn ? (
                  <div style={{ textAlign: "center", padding: "120px 20px" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 16 }}>📧</div>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.85rem", color: "#ffaa00", letterSpacing: "2px", marginBottom: 16 }}>VERIFY YOUR EMAIL</div>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", lineHeight: 1.8, maxWidth: 400, margin: "0 auto" }}>
                      Your vault, build timers, and hangar features are locked until you verify your email address. Check your inbox for a verification link.
                    </div>
                  </div>
                ) : (
                (() => {
                  const vaultKits = allKits.filter(k =>
                    favourites.includes(k.id) ||
                    buildProgress[k.id] === "inprogress" ||
                    buildProgress[k.id] === "complete" ||
                    buildProgress[k.id] === "backlog"
                  );
                  const favOnly = vaultKits.filter(k => favourites.includes(k.id));
                  const inProgress = vaultKits.filter(k => buildProgress[k.id] === "inprogress");
                  const complete = vaultKits.filter(k => buildProgress[k.id] === "complete");
                  const backlog = vaultKits.filter(k =>
                    buildProgress[k.id] === "backlog" && !favourites.includes(k.id)
                  );

                  return (
                    <>
                      <div className="page-hero">
                        <div className="page-tag">PERSONAL COLLECTION</div>
                        <div className="page-title">MY <span style={{ color: "var(--accent)" }}>VAULT</span></div>
                        <div className="page-sub">{vaultKits.length} KIT{vaultKits.length !== 1 ? "S" : ""} TRACKED</div>
                      </div>

                      {vaultKits.length === 0 ? (
                        <div className="vault-empty">
                          <span className="vault-empty-icon">⭐</span>
                          NOTHING IN YOUR VAULT YET<br />
                          <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>STAR A KIT OR SET A BUILD STATUS TO ADD IT HERE</span>
                        </div>
                      ) : (
                        <div style={{ padding: "0 40px 60px", marginTop: 48 }}>
                          {favOnly.length > 0 && (
                            <>
                              <div className="section-header vault-section-header" style={{ padding: "0 0 20px", marginBottom: "4px", cursor: "pointer" }} onClick={() => toggleSection("fav")}>
                                <span className="section-title" style={{ color: "var(--gold)" }}>⭐ FAVORITES</span>
                                <div className="section-line" />
                                <span className="section-count">{favOnly.length} KIT{favOnly.length !== 1 ? "S" : ""}</span>
                                <span className="section-collapse-arrow">{collapsedSections["fav"] ? "▶" : "▼"}</span>
                              </div>
                              {!collapsedSections["fav"] && <div className="vault-grid" style={{ padding: "0 0 32px" }}>{renderWithDuplicates(favOnly, { showBacklog: true, showRemove: true, showTags: true })}</div>}
                            </>
                          )}
                          {inProgress.length > 0 && (
                            <>
                              <div className="section-header vault-section-header" style={{ padding: "0 0 20px", marginBottom: "4px", cursor: "pointer" }} onClick={() => toggleSection("inprogress")}>
                                <span className="section-title" style={{ color: "var(--gold)" }}>⚙ IN PROGRESS</span>
                                <div className="section-line" />
                                <span className="section-count">{inProgress.length} KIT{inProgress.length !== 1 ? "S" : ""}</span>
                                <span className="section-collapse-arrow">{collapsedSections["inprogress"] ? "▶" : "▼"}</span>
                              </div>
                              {!collapsedSections["inprogress"] && <div className="vault-grid" style={{ padding: "0 0 32px" }}>{renderWithDuplicates(inProgress, { showBacklog: true, showRemove: true, showTags: true })}</div>}
                            </>
                          )}
                          {complete.length > 0 && (
                            <>
                              <div className="section-header vault-section-header" style={{ padding: "0 0 20px", marginBottom: "4px", cursor: "pointer" }} onClick={() => toggleSection("complete")}>
                                <span className="section-title" style={{ color: "var(--green)" }}>✓ COMPLETED</span>
                                <div className="section-line" />
                                <span className="section-count">{complete.length} KIT{complete.length !== 1 ? "S" : ""}</span>
                                <span className="section-collapse-arrow">{collapsedSections["complete"] ? "▶" : "▼"}</span>
                              </div>
                              {!collapsedSections["complete"] && <div className="vault-grid" style={{ padding: "0 0 32px" }}>{renderWithDuplicates(complete, { showBacklog: true, showRemove: true, showTags: true })}</div>}
                            </>
                          )}
                          {backlog.length > 0 && (
                            <>
                              <div className="section-header vault-section-header" style={{ padding: "0 0 20px", marginBottom: "4px", cursor: "pointer" }} onClick={() => toggleSection("backlog")}>
                                <span className="section-title" style={{ color: "var(--text-dim)" }}>◻ BACKLOG</span>
                                <div className="section-line" />
                                <span className="section-count">{backlog.length} KIT{backlog.length !== 1 ? "S" : ""}</span>
                                <span className="section-collapse-arrow">{collapsedSections["backlog"] ? "▶" : "▼"}</span>
                              </div>
                              {!collapsedSections["backlog"] && <div className="vault-grid" style={{ padding: "0 0 32px" }}>{renderWithDuplicates(backlog, { showBacklog: true, showRemove: true, showTags: true })}</div>}
                            </>
                          )}
                          {(() => {
                            const wishlistKits = allKits.filter(k => kitWishlist.includes(k.id));
                            if (wishlistKits.length === 0) return null;
                            return (
                              <>
                                <div className="section-header vault-section-header" style={{ padding: "0 0 20px", marginBottom: "4px", cursor: "pointer" }} onClick={() => toggleSection("wishlist")}>
                                  <span className="section-title" style={{ color: "#cc44ff" }}>✦ WISH LIST</span>
                                  <div className="section-line" />
                                  <span className="section-count">{wishlistKits.length} KIT{wishlistKits.length !== 1 ? "S" : ""}</span>
                                  <span className="section-collapse-arrow">{collapsedSections["wishlist"] ? "▶" : "▼"}</span>
                                </div>
                                {!collapsedSections["wishlist"] && (
                                  <div className="vault-grid" style={{ padding: "0 0 32px" }}>
                                    {wishlistKits.map(k => renderKitCard(k, { showWishlistRemove: true }))}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </>
                  );
                })()
                )}
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
                        { icon: "📖", label: "Gunpla Wiki", sub: "The definitive beginner resource. Grades explained, tool guides, technique breakdowns, FAQs. Best place to start if you're new.", tag: "WIKI", href: "https://www.reddit.com/r/Gunpla/wiki/", color: "#00aaff" },
                        { icon: "💬", label: "r/Gunpla", sub: "The largest Gunpla community on the internet. Share your builds, ask questions, browse WIPs, and get feedback from thousands of builders worldwide.", tag: "REDDIT", href: "https://www.reddit.com/r/Gunpla/", color: "#ff6600" },
                        { icon: "🌐", label: "Gundam Base Online", sub: "Bandai's official Gunpla storefront and news hub. Best place to track new kit announcements, P-Bandai exclusives, and limited releases straight from the source.", tag: "OFFICIAL", href: "https://p-bandai.com/", color: "#00ffcc" },
                      ].map(r => (
                        <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{ "--rc-color": r.color }}>
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
                        { icon: "🛒", label: "Hobbylink Japan (HLJ)", sub: "The go-to import retailer. Widest selection of kits at Japanese retail prices, ships worldwide. Great for pre-orders and hard-to-find kits.", tag: "IMPORT", href: "https://www.hlj.com", color: "#ff2244" },
                        { icon: "🛒", label: "Gundam Planet", sub: "US-based Gunpla specialist with fast domestic shipping. Good stock on current HG and MG releases, no import wait times.", tag: "US", href: "https://www.gundamplanet.com", color: "#00aaff" },
                      ].map(r => (
                        <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{ "--rc-color": r.color }}>
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
                        { icon: "🔗", label: "Dalong.net Kit Reviews", sub: "Comprehensive Japanese kit review database with photos, runner breakdowns, and assembly notes on thousands of kits. Essential for research before buying.", tag: "DATABASE", href: "http://www.dalong.net", color: "#ffcc00" },
                      ].map(r => (
                        <a key={r.label} className="resource-card" href={r.href} target="_blank" rel="noopener noreferrer" style={{ "--rc-color": r.color }}>
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

            {/* ===== GALLERY PAGE ===== */}
            <Route path="/gallery" element={<Gallery allKits={allKits} effectiveUser={effectiveSignedIn ? { id: effectiveUserId, email: userEmail, fullName: userDisplayName, firstName: userDisplayName, username: userEmail, imageUrl: userAvatarUrl } : null} effectiveSignedIn={effectiveSignedIn} />} />

            {/* ===== SUPPORT / DONATE PAGE ===== */}
            <Route path="/support" element={
              <>
                <div className="page-hero">
                  <div className="page-tag">100% OPTIONAL · 100% APPRECIATED</div>
                  <div className="page-title">TIP <span style={{ color: "var(--gold, #ffcc00)" }}>JAR</span></div>
                  <div className="page-sub">HELP KEEP THE LIGHTS ON</div>
                </div>
                <div style={{ padding: "0 40px 60px", maxWidth: 1000, margin: "0 auto" }}>

                  {/* The pitch — single column, conversational */}
                  <div style={{ maxWidth: 620, margin: "0 auto 40px", fontFamily: "'Share Tech Mono',monospace" }}>
                    <div style={{ fontSize: "0.75rem", color: "#c8ddf5", lineHeight: 2.2, letterSpacing: "0.3px", marginBottom: 24 }}>
                      KitVault started because I was sick of googling manual scans and landing on dead links
                      or sites that looked like they hadn't been updated since the Wing Zero Ver.Ka dropped.
                      So I built this. One person, no team, no budget. Just a dude with too many nub marks on his
                      desk and a Cloudflare account.
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9ab0cc", lineHeight: 2.2, letterSpacing: "0.3px", marginBottom: 24 }}>
                      Storing 500+ PDFs, running the database, and keeping page loads fast enough that you're not
                      waiting longer than a PG inner frame takes to assemble... that all costs money every month.
                      If KitVault has ever saved you from squinting at a blurry Instagram photo of step 14,
                      tossing a couple bucks my way would genuinely help.
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-dim,#5a7a9f)", lineHeight: 2, letterSpacing: "0.3px", borderTop: "1px solid var(--border,#1a2f50)", paddingTop: 20 }}>
                      There's no paywall, no "premium tier," no pop-up begging you on every page.
                      This tip jar exists, the link lives in the footer, and I'll never bug you about it.
                      If you drop something in here though, know that it's going straight into keeping this thing alive.
                    </div>
                  </div>

                  {/* Ko-fi widget — centered, clean */}
                  <div style={{ maxWidth: 420, margin: "0 auto", background: "#fff", borderRadius: 8, overflow: "hidden" }}>
                    <iframe
                      id="kofiframe"
                      src="https://ko-fi.com/kitvault1/?hidefeed=true&widget=true&embed=true&preview=true"
                      style={{ border: "none", width: "100%", padding: 4, background: "#fff", minHeight: 500 }}
                      title="Support KitVault on Ko-fi"
                    />
                  </div>

                  {/* FAQ — compact, below widget */}
                  <div style={{ maxWidth: 620, margin: "40px auto 0", fontFamily: "'Share Tech Mono',monospace" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                      <div>
                        <div style={{ fontSize: "0.6rem", color: "var(--accent,#00aaff)", letterSpacing: "2px", marginBottom: 8 }}>WHERE DOES IT GO?</div>
                        <div style={{ fontSize: "0.62rem", color: "#5a7a9f", lineHeight: 2 }}>
                          Server bills, domain renewal, R2 storage for PDFs, and Cloudflare Workers. The boring stuff that keeps the site loading fast.
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.6rem", color: "var(--accent,#00aaff)", letterSpacing: "2px", marginBottom: 8 }}>WHAT DO I GET?</div>
                        <div style={{ fontSize: "0.62rem", color: "#5a7a9f", lineHeight: 2 }}>
                          Nothing tangible. The site stays free for everyone regardless. But you get to feel good about it, and that's worth at least $3.
                        </div>
                      </div>
                    </div>
                  </div>

                  <style>{`@media(max-width:768px){[data-support-grid]{grid-template-columns:1fr !important;}}`}</style>
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
                    <div className="bandai-sub">© SOTSU · SUNRISE. ALL GUNDAM IP AND TRADEMARKS BELONG TO THEIR RESPECTIVE OWNERS.</div>
                  </div>
                  <div className="disclaimer-grid">
                    <div className="disclaimer-card" style={{ "--dc": "#ffcc00" }}>
                      <div className="disclaimer-card-icon">🛡️</div>
                      <div className="disclaimer-card-title">FAN PROJECT</div>
                      <div className="disclaimer-card-text">KitVault.io is an unofficial, non-commercial fan-made website created out of love for the Gunpla hobby. It is not affiliated with, endorsed by, or connected to Bandai Namco Entertainment, Sotsu, or Sunrise in any way.</div>
                    </div>
                    <div className="disclaimer-card" style={{ "--dc": "#00aaff" }}>
                      <div className="disclaimer-card-icon">📄</div>
                      <div className="disclaimer-card-title">MANUAL CONTENT</div>
                      <div className="disclaimer-card-text">All assembly manuals hosted on this site are the intellectual property of Bandai Namco Entertainment. They are provided here solely as a convenience resource for hobbyists who have already purchased these kits.</div>
                    </div>
                    <div className="disclaimer-card" style={{ "--dc": "#00ffcc" }}>
                      <div className="disclaimer-card-icon">🔗</div>
                      <div className="disclaimer-card-title">AFFILIATE LINKS</div>
                      <div className="disclaimer-card-text">This site participates in the Amazon Associates affiliate program. Links to Amazon products may earn a small commission at no extra cost to you. This helps cover server costs and keeps the site free for everyone.</div>
                    </div>
                    <div className="disclaimer-card" style={{ "--dc": "#ff6600" }}>
                      <div className="disclaimer-card-icon">💛</div>
                      <div className="disclaimer-card-title">NON-PROFIT</div>
                      <div className="disclaimer-card-text">Any revenue generated through affiliate links or donations is used solely to cover hosting and maintenance costs. This project is run by a hobbyist for hobbyists. Not for profit.</div>
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
                    <p>The goal is to make the hobby more accessible, especially for international builders who got kits with Japanese-only manuals, or anyone who's misplaced their instructions.</p>
                  </div>
                </div>
              </>
            } />

            {/* ===== ALL TOOL PAGES (single dynamic route) ===== */}
            <Route path="/tools/:toolSlug" element={<ToolPage />} />

            {/* ===== PUBLIC HANGAR PROFILE ===== */}
            <Route path="/hangar/:username" element={
              <Hangar currentUserId={effectiveSignedIn ? effectiveUserId : null} onRemoveFromVault={effectiveSignedIn ? removeFromVault : null} onMoveToHangar={effectiveSignedIn ? (e, kitId) => { if (!favourites.includes(kitId)) toggleFavourite(e, kitId); } : null} />
            } />

            {/* ===== ADMIN ===== */}
            <Route path="/admin" element={<AdminUpload />} />

            {/* ===== 404 CATCH-ALL ===== */}
            <Route path="*" element={
              <div style={{ textAlign: "center", padding: "120px 20px" }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "3rem", color: "var(--accent, #00aaff)", marginBottom: 16 }}>404</div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.8rem", color: "var(--text-dim)", letterSpacing: "2px", marginBottom: 24 }}>PAGE NOT FOUND</div>
                <button
                  onClick={goHome}
                  style={{
                    background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)",
                    color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                    padding: "10px 24px", cursor: "pointer", letterSpacing: "1.5px",
                  }}
                >
                  ← BACK TO KITVAULT
                </button>
              </div>
            } />

          </Routes>
        </ErrorBoundary>

        {/* SETTINGS MODAL */}
        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="settings-modal" onClick={e => e.stopPropagation()}>
              <div className="settings-header">
                <span className="settings-title">⚙ SETTINGS</span>
                <button className="modal-close" onClick={() => setShowSettings(false)}>✕</button>
              </div>
              <div className="settings-body">

                {/* HANGAR PROFILE */}
                {effectiveSignedIn && (
                  <div className="settings-section">
                    <div className="settings-section-label">MY HANGAR</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                      {/* Username */}
                      <div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "1px", marginBottom: 4 }}>USERNAME</div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", color: "var(--text-dim)" }}>kitvault.io/hangar/</span>
                          <input
                            value={hangarUsername}
                            onChange={e => checkUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                            maxLength={24}
                            placeholder="your-username"
                            style={{
                              flex: 1, background: "rgba(0,0,0,0.3)", border: `1px solid ${usernameAvailable === true ? "rgba(0,255,136,0.4)" : usernameAvailable === false ? "rgba(255,60,60,0.4)" : "rgba(255,255,255,0.1)"}`,
                              color: "var(--text)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem",
                              padding: "8px 10px", letterSpacing: "0.5px", outline: "none",
                            }}
                          />
                          {usernameAvailable === true && <span style={{ color: "#00ff88", fontSize: "0.7rem" }}>✓</span>}
                          {usernameAvailable === false && <span style={{ color: "#ff3c3c", fontSize: "0.7rem" }}>✗</span>}
                        </div>
                      </div>

                      {/* Display Name */}
                      <div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "1px", marginBottom: 4 }}>DISPLAY NAME</div>
                        <input
                          value={hangarDisplayName}
                          onChange={e => setHangarDisplayName(e.target.value)}
                          maxLength={40}
                          placeholder="How you want your name shown"
                          style={{
                            width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                            color: "var(--text)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem",
                            padding: "8px 10px", letterSpacing: "0.5px", outline: "none", boxSizing: "border-box",
                          }}
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "1px", marginBottom: 4 }}>BIO <span style={{ color: "var(--text-dim)", opacity: 0.5 }}>({280 - hangarBio.length} left)</span></div>
                        <textarea
                          value={hangarBio}
                          onChange={e => setHangarBio(e.target.value.substring(0, 280))}
                          maxLength={280}
                          rows={3}
                          placeholder="Tell people about your builds..."
                          style={{
                            width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                            color: "var(--text)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                            padding: "8px 10px", letterSpacing: "0.3px", outline: "none", resize: "vertical",
                            lineHeight: 1.6, boxSizing: "border-box",
                          }}
                        />
                      </div>

                      {/* Public/Private Toggle */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text)", letterSpacing: "0.5px" }}>
                            {hangarIsPublic ? "🔓 PUBLIC" : "🔒 PRIVATE"}
                          </div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim)", letterSpacing: "0.5px", marginTop: 2 }}>
                            {hangarIsPublic ? "Anyone with the link can view your hangar" : "Only you can see your hangar"}
                          </div>
                        </div>
                        <button
                          onClick={() => setHangarIsPublic(p => !p)}
                          style={{
                            background: hangarIsPublic ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.05)",
                            border: `1px solid ${hangarIsPublic ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)"}`,
                            color: hangarIsPublic ? "#00ff88" : "var(--text-dim)",
                            fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem",
                            padding: "6px 14px", cursor: "pointer", letterSpacing: "1px",
                          }}
                        >
                          {hangarIsPublic ? "PUBLIC" : "PRIVATE"}
                        </button>
                      </div>

                      {/* Save + View + Share */}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <button
                          onClick={saveHangarProfile}
                          disabled={hangarSaving || !hangarUsername.trim() || hangarUsername.trim().length < 3 || usernameAvailable === false}
                          style={{
                            background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.3)",
                            color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                            padding: "8px 18px", cursor: "pointer", letterSpacing: "1px",
                            opacity: (hangarSaving || !hangarUsername.trim() || hangarUsername.trim().length < 3 || usernameAvailable === false) ? 0.4 : 1,
                          }}
                        >
                          {hangarSaving ? "SAVING..." : "💾 SAVE PROFILE"}
                        </button>
                        {hangarProfile?.username && (
                          <>
                            <button
                              onClick={() => { setShowSettings(false); navigate(`/hangar/${hangarProfile.username}`); }}
                              style={{
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                color: "var(--text-dim)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                                padding: "8px 14px", cursor: "pointer", letterSpacing: "1px",
                              }}
                            >
                              VIEW HANGAR →
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`https://kitvault.io/hangar/${hangarProfile.username}`);
                                setHangarMsg("✓ Link copied!");
                                setTimeout(() => setHangarMsg(""), 2000);
                              }}
                              style={{
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                color: "var(--text-dim)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                                padding: "8px 14px", cursor: "pointer", letterSpacing: "1px",
                              }}
                            >
                              📋 COPY LINK
                            </button>
                          </>
                        )}
                      </div>

                      {/* Status message */}
                      {hangarMsg && (
                        <div style={{
                          fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.5px",
                          color: hangarMsg.startsWith("✓") ? "#00ff88" : "#ff3c3c",
                        }}>
                          {hangarMsg}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUPPORT KITVAULT */}
                <div className="settings-section">
                  <div className="settings-section-label">SUPPORT KITVAULT</div>
                  <div className="donate-block">
                    <div className="donate-title">☕ BUY ME A COFFEE</div>
                    <div className="donate-sub">
                      KitVault.io is a free, non-profit fan resource.<br />
                      Donations help cover hosting costs and keep the vault online.
                    </div>
                    <button className="btn-donate" onClick={() => { setShowSettings(false); navigate("/support"); }}>
                      ☕ SUPPORT KITVAULT
                    </button>
                  </div>
                </div>

                {/* SITE INFO */}
                <div className="settings-section">
                  <div className="settings-section-label">SITE INFO</div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">VERSION</span>
                    <span className="settings-info-val">{VERSION}</span>
                  </div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">KITS INDEXED</span>
                    <span className="settings-info-val">{allKits.length}</span>
                  </div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">TOTAL MANUALS</span>
                    <span className="settings-info-val">{allKits.reduce((a, k) => a + k.manuals.length, 0)}</span>
                  </div>
                  <div className="settings-info-row">
                    <span className="settings-info-key">DISCLAIMER</span>
                    <span className="settings-info-val clickable-val" onClick={goDisclaimer}>VIEW →</span>
                  </div>
                </div>

                {/* AFFILIATE NOTE */}
                <div className="settings-section">
                  <div className="settings-section-label">AFFILIATE PROGRAM</div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", lineHeight: 2 }}>
                    KitVault.io participates in the Amazon Associates program. Kit pages include affiliate links to Amazon. We earn a small commission on qualifying purchases at no extra cost to you. Thank you for supporting the site.
                  </div>
                </div>

                {/* DISCLAIMER LINK */}
                <div className="settings-section">
                  <div className="settings-section-label">LEGAL</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", lineHeight: 1.8 }}>
                      Fan-made non-profit project.<br />All Gundam IP © Bandai Namco · Sotsu · Sunrise.
                    </div>
                    <button
                      onClick={goDisclaimer}
                      style={{
                        background: "rgba(255,204,0,0.06)", border: "1px solid rgba(255,204,0,0.3)",
                        color: "var(--gold)", fontFamily: "'Share Tech Mono',monospace",
                        fontSize: "0.6rem", padding: "8px 14px", cursor: "pointer",
                        letterSpacing: "1px", transition: "all 0.2s", whiteSpace: "nowrap",
                        clipPath: "polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%)"
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
          <button
            onClick={() => navigate("/support")}
            style={{
              background: "rgba(255,204,0,0.08)", border: "1px solid rgba(255,204,0,0.25)",
              color: "var(--gold, #ffcc00)", fontFamily: "'Share Tech Mono',monospace",
              fontSize: "0.55rem", padding: "6px 14px", cursor: "pointer",
              letterSpacing: "1px", transition: "all 0.2s", display: "inline-flex",
              alignItems: "center", gap: 6,
            }}
          >☕ SUPPORT KITVAULT</button>
          <span>© GUNDAM IP / BANDAI NAMCO · SOTSU · SUNRISE</span>
          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem" }}>{VERSION}</span>
        </footer>

        {/* BACK TO TOP */}
        <button
          className={`back-to-top${showBackToTop ? " visible" : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Back to top"
        >↑</button>

        {/* CUSTOMIZE MODALS */}
        {showCustomize && effectiveSignedIn && (
          <CustomizeModal
            onClose={() => setShowCustomize(false)}
            ownedIds={ownedSpriteIds}
            paradeIds={paradeIds}
            xp={xp}
            userId={effectiveUserId}
            onPurchaseComplete={(spriteId, newXp, removedId) => {
              if (removedId) {
                setOwnedSpriteIds(prev => prev.filter(id => id !== removedId));
              } else {
                setOwnedSpriteIds(prev => [...prev, spriteId]);
                setXp(newXp);
              }
            }}
            onParadeChange={(spriteId, active) => {
              setParadeIds(prev => active
                ? [...prev, spriteId]
                : prev.filter(id => id !== spriteId)
              );
            }}
          />
        )}
        {showCustomize && !effectiveSignedIn && (
          <GuestCustomizeTeaser onClose={() => setShowCustomize(false)} />
        )}

        {/* LOGIN MODAL */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onGoogleLogin={handleGoogleLogin}
          />
        )}

        {/* PROFILE MODAL */}
        {showProfileModal && effectiveSignedIn && (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,5,18,0.92)", backdropFilter: "blur(8px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={() => setShowProfileModal(false)}
          >
            <div
              style={{ background: "var(--bg2)", border: "1px solid var(--border-bright)", maxWidth: 420, width: "100%", clipPath: "polygon(0 0, 97% 0, 100% 3%, 100% 100%, 3% 100%, 0 97%)", boxShadow: "0 0 60px rgba(0,170,255,0.12)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "3px" }}>MY PROFILE</div>
                <button onClick={() => setShowProfileModal(false)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-dim)", width: 28, height: 28, cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dim)"; }}>✕</button>
              </div>

              {/* Avatar section */}
              <div style={{ padding: "28px 28px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative", cursor: "pointer" }}
                  onClick={() => document.getElementById("profile-avatar-input").click()}>
                  {/* Avatar circle */}
                  {(avatarPreview || userAvatarUrl) ? (
                    <img
                      src={avatarPreview || userAvatarUrl}
                      alt=""
                      style={{ width: 96, height: 96, borderRadius: "50%", border: "2px solid rgba(0,170,255,0.4)", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{ width: 96, height: 96, borderRadius: "50%", border: "2px solid rgba(0,170,255,0.4)", background: "rgba(0,170,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron',sans-serif", fontSize: "1.8rem", color: "#00aaff" }}>
                      {(userDisplayName || userEmail || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Camera overlay */}
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, opacity: 0, transition: "opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                    <span style={{ fontSize: "1.4rem" }}>📷</span>
                    <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "#fff", letterSpacing: "1px" }}>CHANGE</span>
                  </div>
                  {avatarUploading && (
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--accent)", letterSpacing: "1px" }}>...</div>
                  )}
                </div>
                <input
                  id="profile-avatar-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => { if (e.target.files[0]) handleAvatarUpload(e.target.files[0]); e.target.value = ""; }}
                />
                <button
                  onClick={() => document.getElementById("profile-avatar-input").click()}
                  style={{ background: "rgba(0,170,255,0.08)", border: "1px solid rgba(0,170,255,0.3)", color: "#00aaff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.58rem", padding: "7px 18px", cursor: "pointer", letterSpacing: "1.5px", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,170,255,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,170,255,0.08)"}
                >📷 {avatarUploading ? "UPLOADING..." : "CHANGE PHOTO"}</button>
                {hangarMsg && (
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", color: hangarMsg.startsWith("✓") ? "var(--green)" : "var(--red)", letterSpacing: "1px" }}>{hangarMsg}</div>
                )}
              </div>

              {/* Profile info */}
              <div style={{ padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "2px", marginBottom: 6 }}>DISPLAY NAME</div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-bright)" }}>{hangarProfile?.display_name || userDisplayName || "—"}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "2px", marginBottom: 6 }}>USERNAME</div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.8rem", color: "var(--accent)" }}>@{hangarProfile?.username || "not set"}</div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  {hangarProfile?.username && (
                    <button
                      onClick={() => { setShowProfileModal(false); window.location.href = `/hangar/${hangarProfile.username}`; }}
                      style={{ flex: 1, background: "rgba(255,204,0,0.08)", border: "1px solid rgba(255,204,0,0.3)", color: "var(--gold)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", padding: "10px", cursor: "pointer", letterSpacing: "1.5px", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,204,0,0.15)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,204,0,0.08)"}
                    >✈ VIEW MY HANGAR</button>
                  )}
                  <button
                    onClick={() => { setShowProfileModal(false); setShowSettings(true); }}
                    style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", padding: "10px", cursor: "pointer", letterSpacing: "1.5px", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                  >⚙ EDIT PROFILE</button>
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--text-dim)", letterSpacing: "0.5px", opacity: 0.6, textAlign: "center" }}>Max 2MB · JPG, PNG, GIF, WebP</div>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM END TIMER MODAL */}
        {confirmEndTimerId && (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,5,18,0.88)", backdropFilter: "blur(6px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={() => setConfirmEndTimerId(null)}
          >
            <div
              style={{ background: "var(--bg2)", border: "1px solid rgba(255,170,0,0.35)", maxWidth: 380, width: "100%", padding: "32px 28px", clipPath: "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)" }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "#ffaa00", letterSpacing: "3px", marginBottom: 14 }}>⚠ CONFIRM END TIMER</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", marginBottom: 8, lineHeight: 1.8 }}>
                Final time: <span style={{ color: "var(--gold)" }}>{formatTimer(getLiveSeconds(kitTimers[confirmEndTimerId]))}</span>
              </div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", marginBottom: 24, lineHeight: 1.8 }}>
                Ending the timer will stop it completely and save your total build time. This cannot be undone.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => timerEnd(confirmEndTimerId)}
                  style={{ flex: 1, background: "rgba(255,170,0,0.1)", border: "1px solid rgba(255,170,0,0.4)", color: "#ffaa00", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "10px", cursor: "pointer", letterSpacing: "1.5px" }}
                >⏹ YES, END TIMER</button>
                <button
                  onClick={() => setConfirmEndTimerId(null)}
                  style={{ flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "10px", cursor: "pointer", letterSpacing: "1.5px" }}
                >CANCEL</button>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM RESTART TIMER MODAL */}
        {confirmRestartTimerId && (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,5,18,0.88)", backdropFilter: "blur(6px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={() => setConfirmRestartTimerId(null)}
          >
            <div
              style={{ background: "var(--bg2)", border: "1px solid rgba(0,170,255,0.35)", maxWidth: 380, width: "100%", padding: "32px 28px", clipPath: "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)" }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "var(--accent)", letterSpacing: "3px", marginBottom: 14 }}>↺ CONFIRM RESTART TIMER</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", marginBottom: 8, lineHeight: 1.8 }}>
                Previous time: <span style={{ color: "var(--gold)" }}>{formatTimer(kitTimers[confirmRestartTimerId]?.accumulated || 0)}</span>
              </div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", marginBottom: 24, lineHeight: 1.8 }}>
                Restarting will wipe your recorded build time and reset to 00:00:00. This cannot be undone.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => timerRestart(confirmRestartTimerId)}
                  style={{ flex: 1, background: "rgba(0,170,255,0.1)", border: "1px solid rgba(0,170,255,0.4)", color: "var(--accent)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "10px", cursor: "pointer", letterSpacing: "1.5px" }}
                >↺ YES, RESTART</button>
                <button
                  onClick={() => setConfirmRestartTimerId(null)}
                  style={{ flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "10px", cursor: "pointer", letterSpacing: "1.5px" }}
                >CANCEL</button>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM DELETE MODAL */}
        {confirmDeleteId && (() => {
          const kit = allKits.find(k => k.id === confirmDeleteId);
          return (
            <div
              style={{ position: "fixed", inset: 0, background: "rgba(0,5,18,0.88)", backdropFilter: "blur(6px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
              onClick={() => setConfirmDeleteId(null)}
            >
              <div
                style={{ background: "var(--bg2)", border: "1px solid rgba(255,34,68,0.35)", maxWidth: 380, width: "100%", padding: "32px 28px", clipPath: "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)" }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", color: "#ff2244", letterSpacing: "3px", marginBottom: 14 }}>⚠ CONFIRM REMOVAL</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-bright)", marginBottom: 6, lineHeight: 1.3 }}>
                  {kit?.name || "This kit"}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.5px", marginBottom: 24, lineHeight: 1.8 }}>
                  Are you sure you want to remove this kit from your vault? Your build status and tags will be lost.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={e => { removeFromVault(e, confirmDeleteId); setConfirmDeleteId(null); }}
                    style={{ flex: 1, background: "rgba(255,34,68,0.1)", border: "1px solid rgba(255,34,68,0.4)", color: "#ff2244", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "10px", cursor: "pointer", letterSpacing: "1.5px", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,34,68,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,34,68,0.1)"}
                  >
                    🗑 YES, REMOVE
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    style={{ flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", padding: "10px", cursor: "pointer", letterSpacing: "1.5px", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-bright)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </>
  );
}
