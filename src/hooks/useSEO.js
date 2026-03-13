// ─────────────────────────────────────────────────────────────
// useSEO.js — Lightweight SEO hook for React SPA
// Updates document.title, meta description, and canonical URL
// on every route change. No external dependencies.
// ─────────────────────────────────────────────────────────────
import { useEffect } from "react";

const SITE_NAME = "KitVault.io";
const BASE_URL = "https://kitvault.io";
const DEFAULT_DESC = "Free Gunpla build tracker and digital manual archive. Log build hours, manage your Gundam model kit backlog, browse assembly manuals, and track your collection. HG, MG, RG, PG, SD, EG, and MGSD kits.";

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    if (name.startsWith("og:")) {
      el.setAttribute("property", name);
    } else {
      el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

export default function useSEO({ title, description, path }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Track. Build. Complete.`;
    const desc = description || DEFAULT_DESC;
    const canonicalUrl = `${BASE_URL}${path || ""}`;

    document.title = fullTitle;
    setMeta("description", desc);
    setMeta("og:title", fullTitle);
    setMeta("og:description", desc);
    setMeta("og:url", canonicalUrl);
    setMeta("og:type", "website");
    setMeta("og:site_name", SITE_NAME);
    setCanonical(canonicalUrl);
  }, [title, description, path]);
}

// ─────────────────────────────────────────────────────────────
// Pre-built SEO configs for each route type
// ─────────────────────────────────────────────────────────────
export const SEO = {
  home: {
    title: null,
    description: "Free Gunpla build tracker and digital manual archive. Track your backlog, log build hours, browse assembly manuals, and manage your Gundam model kit collection. HG, MG, RG, PG, SD, EG, and MGSD kits.",
    path: "/",
  },
  vault: {
    title: "My Vault — Gunpla Backlog Manager",
    description: "Track your Gunpla backlog, in-progress builds, and completed kits in one place. Log build time, set status, and manage your entire Gundam model kit collection for free.",
    path: "/vault",
  },
  gallery: {
    title: "Community Gallery — Completed Gunpla Builds",
    description: "Browse completed Gunpla builds shared by the community. Upload photos of your finished Gundam model kits and see what others are building on KitVault.",
    path: "/gallery",
  },
  resources: {
    title: "Gunpla Resources & Beginner Guide",
    description: "Essential Gunpla resources — where to buy kits, community links, review databases, and beginner guides for Gundam model building. Everything you need to start building.",
    path: "/resources",
  },
  support: {
    title: "Support KitVault",
    description: "Help keep KitVault.io running. Support the free Gunpla build tracker and manual archive with a tip — every dollar helps cover hosting and development.",
    path: "/support",
  },
  disclaimer: {
    title: "Disclaimer",
    description: "Legal disclaimer for KitVault.io. Fan-made, non-commercial Gunpla resource. All Gundam IP belongs to Bandai Namco, Sotsu, and Sunrise.",
    path: "/disclaimer",
  },
  admin: {
    title: "Admin",
    description: null,
    path: "/admin",
  },
  features: {
    title: "Features — Free Gunpla Build Tracker & Manual Archive",
    description: "Track your Gunpla backlog, log build hours with a built-in timer, browse free digital Gundam manuals, and manage your kit collection. KitVault is the best free Gunpla building app.",
    path: "/features",
  },
};

export function kitSEO(kit) {
  if (!kit) return { title: "Kit Not Found", description: "This kit could not be found.", path: "/kit/unknown" };
  const display = `${kit.grade} ${kit.scale} ${kit.name}`;
  const gradeKey = kit.grade?.toLowerCase();
  const manualCount = kit.manuals?.length || 0;
  const manualNote = manualCount > 0 ? `${manualCount} manual${manualCount !== 1 ? "s" : ""} available. ` : "";

  // Path is set by the caller via location.pathname in App.jsx's seoConfig,
  // but we include a fallback here using a basic slug from the kit name.
  const fallbackSlug = `${kit.grade}-${kit.scale}-${kit.name}`
    .toLowerCase().replace(/\//g, "-").replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-").replace(/^-|-$/g, "");

  const gradeDescriptions = {
    pg: `View the free digital manual for the ${display} and track your Perfect Grade build from start to finish. ${manualNote}Log build hours, manage your Gunpla backlog, and earn XP on KitVault.`,
    mg: `Free digital manual and build tracker for the ${display}. ${manualNote}Log your Master Grade build time, track progress step by step, and manage your Gunpla backlog on KitVault.`,
    rg: `Track your ${display} build with a free digital manual viewer and build timer. ${manualNote}Real Grade detail deserves a real build log — manage your Gunpla backlog on KitVault.`,
    hg: `Free ${display} digital manual and build tracker. ${manualNote}Track your High Grade build progress, log build hours, and manage your Gunpla backlog — all free on KitVault.`,
    eg: `${display} digital manual and build tracker. ${manualNote}Perfect for your first Gunpla build — track progress, log build time, and manage your backlog free on KitVault.`,
    sd: `Free digital manual for the ${display}. ${manualNote}Track your Super Deformed build, log hours, and manage your Gunpla backlog on KitVault — the free Gunpla building app.`,
    mgsd: `View the free digital manual for the ${display}. ${manualNote}Track your MGSD build progress, log build time, and manage your Gunpla backlog on KitVault.`,
  };

  return {
    title: `${display} — Digital Manual & Build Tracker`,
    description: gradeDescriptions[gradeKey]
      || `Free digital manual and build tracker for the ${display}. ${manualNote}Log build hours, track progress, and manage your Gunpla backlog on KitVault.`,
    path: `/kit/${fallbackSlug}`,
  };
}

export function gradeSEO(gradeSlug) {
  const GRADE_NAMES = {
    eg: "Entry Grade (EG)", hg: "High Grade (HG)", rg: "Real Grade (RG)",
    mg: "Master Grade (MG)", pg: "Perfect Grade (PG)", sd: "Super Deformed (SD)",
    mgsd: "Master Grade SD (MGSD)",
  };
  const name = GRADE_NAMES[gradeSlug] || gradeSlug?.toUpperCase();
  return {
    title: `${name} Gunpla Guide — Scale, Difficulty & Build Time`,
    description: `Complete guide to ${name} Gundam model kits — scale, difficulty, build time, tools needed, and all available digital manuals. Free on KitVault.io.`,
    path: `/grade/${gradeSlug}`,
  };
}

export function toolSEO(toolSlug) {
  const TOOL_NAMES = {
    nippers: "Nippers & Side Cutters",
    "panel-line-markers": "Panel Line Markers",
    scribers: "Scribers & Chisels",
    sanding: "Sanding Sticks",
    paints: "Paints & Primers",
    airbrushes: "Airbrushes",
    "top-coats": "Top Coats",
    "hobby-knives": "Hobby Knives",
  };
  const name = TOOL_NAMES[toolSlug] || toolSlug;
  return {
    title: `Best ${name} for Gunpla`,
    description: `Recommended ${name?.toLowerCase()} for Gundam model building. Reviews, comparisons, and buying guide for Gunpla hobbyists.`,
    path: `/tools/${toolSlug}`,
  };
}

export function hangarSEO(profile) {
  if (!profile) return { title: "Builder Not Found", description: "This builder could not be found.", path: "/hangar/unknown" };
  const name = profile.display_name || profile.username || "Builder";
  return {
    title: `${name}'s Hangar`,
    description: `Check out ${name}'s Gunpla collection on KitVault.io.${profile.bio ? " " + profile.bio : ""}`.substring(0, 160),
    path: `/hangar/${profile.username || "unknown"}`,
  };
}
