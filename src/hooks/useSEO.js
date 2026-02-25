// ─────────────────────────────────────────────────────────────
// useSEO.js — Lightweight SEO hook for React SPA
// Updates document.title, meta description, and canonical URL
// on every route change. No external dependencies.
// ─────────────────────────────────────────────────────────────
import { useEffect } from "react";

const SITE_NAME = "KitVault.io";
const BASE_URL = "https://kitvault.io";
const DEFAULT_DESC = "Your complete Gunpla manual database. Browse, view, and download assembly manuals for HG, MG, RG, PG, SD, EG, and MGSD Gundam model kits.";

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
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Gunpla Manual Database`;
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
    description: "Your complete Gunpla manual database. Browse assembly manuals for HG, MG, RG, PG, SD, and MGSD Gundam model kits. Free, ad-free, community-driven.",
    path: "/",
  },
  vault: {
    title: "My Vault",
    description: "Track your Gunpla backlog, in-progress builds, and completed kits. Your personal Gundam model kit collection manager.",
    path: "/vault",
  },
  gallery: {
    title: "Community Gallery",
    description: "Browse completed Gunpla builds shared by the community. Upload photos of your own finished Gundam model kits.",
    path: "/gallery",
  },
  resources: {
    title: "Resources",
    description: "Essential Gunpla resources — community links, where to buy kits, review databases, and beginner guides for Gundam model building.",
    path: "/resources",
  },
  support: {
    title: "Support KitVault",
    description: "Help keep KitVault.io running. Support the Gunpla manual database with a tip — every dollar helps cover hosting and development.",
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
};

export function kitSEO(kit) {
  if (!kit) return { title: "Kit Not Found", description: "This kit could not be found.", path: "/kit/unknown" };
  return {
    title: `${kit.grade} ${kit.scale} ${kit.name} Manual`,
    description: `View the assembly manual for the ${kit.grade} ${kit.scale} ${kit.name} Gundam model kit. ${kit.manuals?.length || 0} manual${kit.manuals?.length !== 1 ? "s" : ""} available. Free PDF viewer on KitVault.io.`,
    path: `/kit/${typeof kit === "string" ? kit : ""}`,
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
    title: `${name} Gunpla Guide`,
    description: `Everything you need to know about ${name} Gundam model kits — scale, difficulty, build time, and available manuals on KitVault.io.`,
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
