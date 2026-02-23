// ─────────────────────────────────────────────────────────────
// GRADES DATA & CONSTANTS
// This file contains all static config for the app:
//   R2 url, version, amazon urls, grade colors/data,
//   slug helpers, xp colors, tool order.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// CLOUDFLARE R2 + VERSION
// ─────────────────────────────────────────────────────────────
import { KITS } from "./kits.js";

export const R2 = "https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev";
export const VERSION = "v1.0.0";

// ─────────────────────────────────────────────────────────────
// PDF.JS LOADER
// Loads PDF.js via a <script> tag (NOT ESM dynamic import —
// Vite blocks cross-origin ESM imports at runtime).
// Returns the pdfjsLib global. Safe to call multiple times.
// ─────────────────────────────────────────────────────────────
const PDFJS_SRC  = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

let _pdfJsPromise = null;

export function loadPdfJs() {
  if (_pdfJsPromise) return _pdfJsPromise;
  _pdfJsPromise = new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      resolve(window.pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = PDFJS_SRC;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error("Failed to load PDF.js from CDN"));
    document.head.appendChild(script);
  });
  return _pdfJsPromise;
}

// ─────────────────────────────────────────────────────────────
// AMAZON AFFILIATE URLS
// Paste your URLs here as "kitId": "url" pairs.
// ─────────────────────────────────────────────────────────────
export const AMAZON_URLS = {
  // PASTE YOUR JSON HERE (example format):
  // "1": "https://www.amazon.com/dp/XXXXXXX?tag=yourtag-20",
  // "2": "https://www.amazon.com/dp/XXXXXXX?tag=yourtag-20",
};

export const GRADE_COLORS = {
  "HG": { accent: "#00aaff", bg: "rgba(0,170,255,0.1)" },
  "MG": { accent: "#ff6600", bg: "rgba(255,102,0,0.1)" },
  "RG": { accent: "#ff2244", bg: "rgba(255,34,68,0.1)" },
  "PG": { accent: "#ffcc00", bg: "rgba(255,204,0,0.1)" },
  "SD": { accent: "#00ffcc", bg: "rgba(0,255,204,0.1)" },
  "EG": { accent: "#aa88ff", bg: "rgba(170,136,255,0.1)" },
};

export const GRADES = ["ALL", "HG", "MG", "RG", "PG", "SD", "EG"];

// Convert kit to URL slug: "EG 1/144 RX-78-2 Gundam" → "eg-144-rx78-2-gundam"
export const slugify = (kit) =>
  `${kit.grade}-${kit.scale}-${kit.name}`
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const findKitBySlug = (slug) => KITS.find(k => slugify(k) === slug);

// ─────────────────────────────────────────────────────────────
// XP COLORS: maps a progress % to CSS custom properties
// Used by kit cards, vault cards, and the kit detail XP bar.
// ─────────────────────────────────────────────────────────────
export const xpColors = (pct) => {
  if (pct >= 100) return { "--xp-start":"#00cc66", "--xp-end":"#00ffcc", "--xp-glow":"rgba(0,255,136,0.7)", "--xp-color":"#00ff88" };
  if (pct >= 50)  return { "--xp-start":"#cc8800", "--xp-end":"#ffcc00", "--xp-glow":"rgba(255,204,0,0.6)",  "--xp-color":"#ffcc00" };
  return                 { "--xp-start":"#1a4aff", "--xp-end":"#00aaff", "--xp-glow":"rgba(0,170,255,0.6)", "--xp-color":"#00aaff" };
};


export const GRADE_DATA = {
  eg: {
    name: "Entry Grade", abbr: "EG", color: "#aa88ff", scale: "1/144",
    tagline: "THE PERFECT STARTING POINT",
    intro: "Entry Grade kits were introduced by Bandai in 2020 as the most accessible way to experience Gunpla. Designed specifically for first-time builders, EG kits require <strong>no nippers, no tools, and no prior experience</strong>. Parts snap cleanly off the runner by hand without leaving unsightly gate marks.",
    sections: [
      { title: "◈ BUILD EXPERIENCE", body: "EG kits are engineered for simplicity without sacrificing the iconic look of the mobile suits. The part count is kept low, assembly steps are intuitive, and the instruction manual is easy to follow even for children. A typical EG kit can be completed in <strong>1–2 hours</strong>, making it ideal for an afternoon project." },
      { title: "◈ WHAT YOU GET", body: "Despite being entry-level, EG kits deliver impressive articulation and screen-accurate proportions. Most include a small selection of weapons and accessories. The plastic quality is solid too. Same Bandai engineering behind MG and RG kits, just simplified." },
      { title: "◈ WHO IS IT FOR?", body: "EG is perfect for <strong>absolute beginners</strong>, younger builders, or anyone who wants a quick, satisfying build without committing hours to a complex kit. They also make great gifts. Experienced builders often pick up EG kits as palette cleansers between large MG or PG projects." },
      { title: "◈ TOOLS NEEDED", body: "<strong>None required.</strong> Parts are designed to be hand-separated cleanly. That said, a pair of nippers and a hobby knife will give cleaner results if you have them. No glue, cement, or painting needed, though EG kits respond really well to panel lining and a topcoat if you want to push them further." },
    ],
    stats: [{ val:"1/144", lbl:"SCALE" }, { val:"1–2 HRS", lbl:"BUILD TIME" }, { val:"NONE", lbl:"TOOLS NEEDED" }, { val:"★☆☆☆☆", lbl:"DIFFICULTY" }],
  },
  hg: {
    name: "High Grade", abbr: "HG", color: "#00aaff", scale: "1/144",
    tagline: "THE BACKBONE OF GUNPLA",
    intro: "High Grade is the most diverse and widely available grade in all of Gunpla. Running since 1990, HG kits cover virtually every mobile suit from every Gundam series. If a suit exists, there's almost certainly an HG version of it. At 1/144 scale, they're compact, affordable, and endlessly varied.",
    sections: [
      { title: "◈ BUILD EXPERIENCE", body: "HG kits are the <strong>gateway to serious Gunpla building</strong>. They require nippers for clean gate removal and benefit from a hobby knife for cleanup, but are otherwise very approachable. A standard HG takes <strong>3–6 hours</strong> to complete. The part count is moderate and the build flow is well-paced." },
      { title: "◈ WHAT YOU GET", body: "Most HG kits include a good range of accessories (beam sabers, shields, rifles) and solid articulation for their size. Newer HG kits (post-2015) have benefited from Bandai's improved engineering, with better proportions, color separation, and posability than older releases." },
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
      { title: "◈ BUILD EXPERIENCE", body: "RG kits feature a pre-built Advanced MS Joint inner frame, basically a flexible pre-assembled skeleton that forms the core of the kit. Outer armor parts snap onto this frame. The result is exceptional poseability and detail, but the small part size and complex assembly make RG one of the more <strong>challenging grades</strong>. Expect <strong>6–12 hours</strong> for most kits." },
      { title: "◈ WHAT YOU GET", body: "RG kits typically include <strong>waterslide decals</strong> for panel markings, an inner frame visible through translucent or removable outer armor, and an impressive level of color separation considering the scale. The finished product is often the most detailed display piece possible at 1/144 scale." },
      { title: "◈ WHO IS IT FOR?", body: "RG is aimed at <strong>intermediate to advanced builders</strong> who want the detail of an MG without the footprint. The small parts demand patience and steady hands. It's not recommended as a first kit, but experienced HG builders looking for their next challenge will find RG enormously rewarding." },
      { title: "◈ TOOLS NEEDED", body: "<strong>Sharp nippers are critical.</strong> Blunt nippers will crack small RG parts. A precision hobby knife, tweezers for waterslide decals, and a fine-tipped panel liner are all highly recommended. A good magnifying lamp helps significantly with the fine detail work." },
    ],
    stats: [{ val:"1/144", lbl:"SCALE" }, { val:"6–12 HRS", lbl:"BUILD TIME" }, { val:"SHARP NIPPERS", lbl:"TOOLS NEEDED" }, { val:"★★★★☆", lbl:"DIFFICULTY" }],
  },
  mg: {
    name: "Master Grade", abbr: "MG", color: "#ff6600", scale: "1/100",
    tagline: "THE GOLD STANDARD OF GUNPLA",
    intro: "Master Grade is the prestige grade of the Gunpla line. It sits in that sweet spot between complexity and display quality that most serious collectors aspire to. Introduced in 1995, MG kits feature <strong>fully developed inner frames, detailed cockpit interiors, and exceptional articulation</strong> at the substantial 1/100 scale.",
    sections: [
      { title: "◈ BUILD EXPERIENCE", body: "Building an MG is a <strong>multi-session commitment</strong>. Most kits take 8–20 hours depending on complexity. You'll build the skeleton first, a fully articulated inner frame, then layer the outer armor panels over it. The process is deeply satisfying and teaches builders a thorough understanding of the mobile suit's structure." },
      { title: "◈ WHAT YOU GET", body: "MG kits are packed with features: opening hatches, poseable fingers (on many releases), pilot figures, cockpit details, extensive weapon loadouts, and markings. The 1/100 scale means detail work like panel lining and decal application is much more forgiving than RG or HG." },
      { title: "◈ WHO IS IT FOR?", body: "MG is the target grade for <strong>intermediate to advanced builders</strong> who want a substantial, impressive display piece. It's also the most customisation-friendly grade out there. The inner frame construction makes repainting, kitbashing, and modification more approachable than smaller grades." },
      { title: "◈ TOOLS NEEDED", body: "<strong>Quality nippers are essential.</strong> A hobby knife, panel liners, and either waterslide or dry transfer decals (depending on the kit) round out the standard toolkit. Airbrush painting elevates MG kits significantly, though hand painting works well too at this scale." },
    ],
    stats: [{ val:"1/100", lbl:"SCALE" }, { val:"8–20 HRS", lbl:"BUILD TIME" }, { val:"NIPPERS + KNIFE", lbl:"TOOLS NEEDED" }, { val:"★★★☆☆", lbl:"DIFFICULTY" }],
  },
  pg: {
    name: "Perfect Grade", abbr: "PG", color: "#ffcc00", scale: "1/60",
    tagline: "THE ULTIMATE GUNPLA EXPERIENCE",
    intro: "Perfect Grade represents the absolute pinnacle of Bandai's Gunpla engineering. Released only for the most iconic mobile suits, PG kits are <strong>enormous, extraordinarily detailed, and built to impress</strong>. At 1/60 scale, a completed PG is a proper centerpiece. Not just a model.",
    sections: [
      { title: "◈ BUILD EXPERIENCE", body: "Building a PG is a <strong>major undertaking</strong>. Most kits take 20–40+ hours to complete. Every detail is accounted for: full inner frame, opening cockpit, LED lighting units (on select releases), poseable hands, interlocking mechanical joints. The build experience itself is considered a highlight by collectors who have completed one." },
      { title: "◈ WHAT YOU GET", body: "PG kits come with everything: chrome parts, rubber tubing, clear parts, full weapon arrays, pilot figures, detailed cockpit interiors, and on some releases, pre-installed LED systems. The box alone is often the size of a shoebox. These are the kits that go in glass display cabinets." },
      { title: "◈ WHO IS IT FOR?", body: "PG is for <strong>experienced, dedicated builders</strong> who want the best that Gunpla has to offer and are prepared to invest significant time and money. Most PG builders have completed multiple MG or RG kits beforehand. A PG is not a casual weekend build. It rewards patience and skill." },
      { title: "◈ TOOLS NEEDED", body: "<strong>The full toolkit.</strong> Quality nippers, precision hobby knife, multiple panel liners, tweezers, sprue cutters, and ideally an airbrush setup. LED wiring on applicable kits benefits from basic electronics knowledge. A dedicated workspace is recommended given the scale and part count." },
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
      { title: "◈ TOOLS NEEDED", body: "<strong>Nippers recommended</strong> but not always strictly necessary on newer SD kits. A hobby knife for gate cleanup improves the finish. Panel lining works great on SD kits too. The exaggerated details really pop with a wash. Top coating is highly recommended to protect the finish." },
    ],
    stats: [{ val:"SD", lbl:"SCALE" }, { val:"1–3 HRS", lbl:"BUILD TIME" }, { val:"NIPPERS", lbl:"TOOLS NEEDED" }, { val:"★☆☆☆☆", lbl:"DIFFICULTY" }],
  },
};

export const GRADE_ORDER = ["eg", "hg", "rg", "mg", "pg", "sd"];

export const TOOL_ORDER = [
  { route: "/tools/nippers",           label: "Nippers",            color: "#00ffcc" },
  { route: "/tools/panel-line-markers",label: "Panel Line Markers", color: "#00aaff" },
  { route: "/tools/scribers",          label: "Scribers & Chisels", color: "#ff6600" },
  { route: "/tools/sanding",           label: "Sanding Sticks",     color: "#ffcc00" },
  { route: "/tools/paints",            label: "Paints & Primers",   color: "#ff2244" },
  { route: "/tools/airbrushes",        label: "Airbrushes",         color: "#aa88ff" },
  { route: "/tools/top-coats",         label: "Top Coats",          color: "#00ffcc" },
  { route: "/tools/hobby-knives",      label: "Hobby Knives",       color: "#ff9900" },
];
