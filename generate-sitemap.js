// ─────────────────────────────────────────────────────────────
// generate-sitemap.js
// Run after build:  node generate-sitemap.js
// Outputs sitemap.xml to the dist/ (or build/) folder
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = "https://kitvault.io";
const TODAY = new Date().toISOString().split("T")[0];

// ── Parse kits from kits.js ──────────────────────────────────
// We read the raw file and extract kit objects to avoid needing
// a full ESM import chain with all the dependencies.
const kitsFile = readFileSync(join(__dirname, "src/data/kits.js"), "utf-8");

// Slugify matching the app's logic
function slugify(grade, scale, name) {
  const raw = `${grade}-${scale}-${name}`;
  return raw
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Extract kit data using regex (avoids import issues)
const kitRegex = /\{\s*id:\s*(\d+)\s*,\s*grade:\s*"([^"]+)"\s*,\s*scale:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"/g;
const kits = [];
let match;
while ((match = kitRegex.exec(kitsFile)) !== null) {
  kits.push({ id: match[1], grade: match[2], scale: match[3], name: match[4] });
}

console.log(`Found ${kits.length} static kits`);

// ── Static pages ─────────────────────────────────────────────
const staticPages = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/gallery", priority: "0.8", changefreq: "daily" },
  { url: "/resources", priority: "0.7", changefreq: "monthly" },
  { url: "/support", priority: "0.5", changefreq: "monthly" },
  { url: "/disclaimer", priority: "0.3", changefreq: "yearly" },
  // Grade pages
  { url: "/grade/eg", priority: "0.7", changefreq: "monthly" },
  { url: "/grade/hg", priority: "0.7", changefreq: "monthly" },
  { url: "/grade/rg", priority: "0.7", changefreq: "monthly" },
  { url: "/grade/mg", priority: "0.7", changefreq: "monthly" },
  { url: "/grade/pg", priority: "0.7", changefreq: "monthly" },
  { url: "/grade/sd", priority: "0.7", changefreq: "monthly" },
  { url: "/grade/mgsd", priority: "0.7", changefreq: "monthly" },
  // Tool pages
  { url: "/tools/nippers", priority: "0.6", changefreq: "monthly" },
  { url: "/tools/panel-line-markers", priority: "0.6", changefreq: "monthly" },
  { url: "/tools/scribers", priority: "0.6", changefreq: "monthly" },
  { url: "/tools/sanding", priority: "0.6", changefreq: "monthly" },
  { url: "/tools/paints", priority: "0.6", changefreq: "monthly" },
  { url: "/tools/airbrushes", priority: "0.6", changefreq: "monthly" },
  { url: "/tools/top-coats", priority: "0.6", changefreq: "monthly" },
  { url: "/tools/hobby-knives", priority: "0.6", changefreq: "monthly" },
];

// ── Kit pages ────────────────────────────────────────────────
const kitPages = kits.map(k => ({
  url: `/kit/${slugify(k.grade, k.scale, k.name)}`,
  priority: "0.8",
  changefreq: "monthly",
}));

// ── Build XML ────────────────────────────────────────────────
const allPages = [...staticPages, ...kitPages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

// ── Write to dist/ or public/ ────────────────────────────────
const distDir = existsSync(join(__dirname, "dist")) ? "dist" : "public";
const outPath = join(__dirname, distDir, "sitemap.xml");
writeFileSync(outPath, xml);
console.log(`Sitemap written to ${outPath} with ${allPages.length} URLs`);
