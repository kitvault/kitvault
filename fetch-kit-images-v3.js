#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// fetch-kit-images-v3.js — Bulk image fetcher for KitVault
// 
// Uses puppeteer with DuckDuckGo Image Search (scraper-friendly)
// to find box art for each kit.
//
// Usage:
//   npm install puppeteer  (if not already installed)
//   node fetch-kit-images-v3.js
// ─────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════
// CONFIGURE THESE
// ══════════════════════════════════════════════════════════════
const API_BASE = "https://kitvault.io";
const ADMIN_KEY = "Applesauce1!";
const DELAY_MS = 2000;
// ══════════════════════════════════════════════════════════════

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithRetry(url, options = {}, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (err) {
      if (i === retries) throw err;
      await sleep(2000);
    }
  }
}

async function uploadImageToKit(kitId, imageBuffer, contentType) {
  try {
    const blob = new Blob([imageBuffer], { type: contentType || "image/jpeg" });
    const formData = new FormData();
    formData.append("image", blob, `kit-${kitId}.jpg`);
    const res = await fetchWithRetry(`${API_BASE}/api/kit/${kitId}/image`, {
      method: "POST",
      headers: { "X-Admin-Key": ADMIN_KEY },
      body: formData,
    });
    const data = await res.json();
    return data.ok === true;
  } catch (err) {
    console.log(`  ✕ Upload failed: ${err.message}`);
    return false;
  }
}

async function downloadImage(url) {
  try {
    const res = await fetchWithRetry(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" }
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.startsWith("image")) return null;
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 3000) return null; // skip tiny images
    return { buffer, contentType: ct };
  } catch (_) {
    return null;
  }
}

// ── DuckDuckGo Image Search via Puppeteer ──
async function searchDDG(page, kit) {
  const query = `${kit.grade} ${kit.name} gunpla box`;
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
    await sleep(2000);

    // DuckDuckGo images page loads thumbnails with data-src or src attributes
    const imageUrl = await page.evaluate(() => {
      // DDG image results are in .tile--img__img img elements
      const imgs = document.querySelectorAll(".tile--img__img, img.tile--img__img, .js-images-link img");
      for (const img of imgs) {
        const src = img.getAttribute("data-src") || img.src || "";
        if (src && src.startsWith("http") && !src.includes("duckduckgo.com")) {
          return src;
        }
      }
      // Fallback: check all images on the page
      const allImgs = document.querySelectorAll("img");
      for (const img of allImgs) {
        const src = img.src || "";
        if (src.startsWith("//external-content.duckduckgo.com")) {
          return "https:" + src;
        }
        if (src.startsWith("https://external-content.duckduckgo.com")) {
          return src;
        }
      }
      return null;
    });

    // DDG external-content URLs are proxied images — extract the actual URL
    if (imageUrl && imageUrl.includes("external-content.duckduckgo.com")) {
      // These proxy URLs contain the real URL as a query param
      try {
        const u = new URL(imageUrl);
        const realUrl = u.searchParams.get("u");
        if (realUrl) return realUrl;
      } catch (_) { }
      return imageUrl;
    }

    return imageUrl;
  } catch (err) {
    console.log(`  ✕ DDG search failed: ${err.message}`);
    return null;
  }
}

// ── Bing Image Search (more reliable backup) ──
async function searchBing(page, kit) {
  const query = `${kit.grade} ${kit.name} gunpla box art bandai`;
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    await sleep(1500);

    const imageUrl = await page.evaluate(() => {
      // Bing puts image URLs in "murl" attribute of <a> tags, or in data attributes
      const items = document.querySelectorAll("a.iusc");
      for (const a of items) {
        try {
          const m = a.getAttribute("m");
          if (m) {
            const parsed = JSON.parse(m);
            if (parsed.murl && parsed.murl.startsWith("http")) {
              return parsed.murl;
            }
          }
        } catch (_) { }
      }

      // Fallback: look for img tags with decent-sized images
      const imgs = document.querySelectorAll(".imgpt img, .img_cont img");
      for (const img of imgs) {
        const src = img.getAttribute("src2") || img.getAttribute("data-src") || img.src || "";
        if (src.startsWith("http") && !src.includes("bing.com") && !src.includes("microsoft.com")) {
          return src;
        }
      }
      return null;
    });

    return imageUrl;
  } catch (err) {
    console.log(`  ✕ Bing search failed: ${err.message}`);
    return null;
  }
}

// ── MAIN ──────────────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  KitVault — Bulk Image Scraper v3");
  console.log("  (Bing + DuckDuckGo Image Search)");
  console.log("═══════════════════════════════════════════════════\n");

  if (ADMIN_KEY === "YOUR_ADMIN_KEY_HERE") {
    console.log("✕ ERROR: Set your ADMIN_KEY at the top of this file first!");
    process.exit(1);
  }

  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch (_) {
    console.log("✕ ERROR: Run 'npm install puppeteer' first");
    process.exit(1);
  }

  // Step 1: Fetch kits
  console.log("Step 1: Fetching kit list...");
  const kitsRes = await fetchWithRetry(`${API_BASE}/api/kits`);
  const allKits = await kitsRes.json();

  const needsImage = allKits.filter(k => !k.image_url || k.image_url.trim() === "");
  console.log(`  Total: ${allKits.length} | Have images: ${allKits.length - needsImage.length} | Need: ${needsImage.length}\n`);

  if (needsImage.length === 0) {
    console.log("✓ All kits have images!");
    return;
  }

  // Step 2: Launch browser (visible so you can see what's happening)
  console.log("Step 2: Launching browser...");
  console.log("  (A Chrome window will open — don't close it!)\n");

  const browser = await puppeteer.default.launch({
    headless: false, // Show the browser so we can debug
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,900"],
    defaultViewport: { width: 1280, height: 900 },
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  // Step 3: Process kits
  console.log("Step 3: Searching for images...\n");

  let found = 0;
  let failed = 0;
  const results = [];

  for (let i = 0; i < needsImage.length; i++) {
    const kit = needsImage[i];
    const progress = `[${i + 1}/${needsImage.length}]`;
    console.log(`${progress} ${kit.grade} ${kit.scale} — ${kit.name}`);

    // Try Bing first (most reliable for image scraping)
    let imageUrl = await searchBing(page, kit);

    // Fallback to DuckDuckGo
    if (!imageUrl) {
      console.log(`  → Trying DuckDuckGo...`);
      imageUrl = await searchDDG(page, kit);
    }

    if (!imageUrl) {
      console.log(`  ✕ No image found from any source`);
      failed++;
      results.push({ id: kit.id, grade: kit.grade, name: kit.name, status: "no_image" });
      await sleep(DELAY_MS);
      continue;
    }

    console.log(`  ↓ Found: ${imageUrl.substring(0, 90)}${imageUrl.length > 90 ? "..." : ""}`);

    // Download
    const imgData = await downloadImage(imageUrl);
    if (!imgData) {
      console.log(`  ✕ Download failed`);
      failed++;
      results.push({ id: kit.id, grade: kit.grade, name: kit.name, status: "download_failed", url: imageUrl });
      await sleep(DELAY_MS);
      continue;
    }

    console.log(`  ↑ Uploading (${Math.round(imgData.buffer.byteLength / 1024)}KB)...`);

    // Upload
    const success = await uploadImageToKit(kit.id, imgData.buffer, imgData.contentType);
    if (success) {
      console.log(`  ✓ Done!`);
      found++;
      results.push({ id: kit.id, grade: kit.grade, name: kit.name, status: "success", url: imageUrl });
    } else {
      console.log(`  ✕ Upload failed`);
      failed++;
      results.push({ id: kit.id, grade: kit.grade, name: kit.name, status: "upload_failed", url: imageUrl });
    }

    await sleep(DELAY_MS);

    // Pause every 15 kits
    if ((i + 1) % 15 === 0) {
      console.log(`\n  ⏸ Pausing 8s...\n`);
      await sleep(8000);
    }
  }

  await browser.close();

  // Summary
  console.log("\n═══════════════════════════════════════════════════");
  console.log("  RESULTS");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  ✓ Images added:  ${found}`);
  console.log(`  ✕ Failed:        ${failed}`);
  console.log(`  Total processed: ${needsImage.length}`);
  console.log("═══════════════════════════════════════════════════\n");

  const fs = await import("fs");
  const logFile = `image-scrape-results-${Date.now()}.json`;
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${logFile}`);

  const stillMissing = results.filter(r => r.status !== "success");
  if (stillMissing.length > 0) {
    console.log(`\nStill need images (${stillMissing.length}):`);
    stillMissing.forEach(r => console.log(`  #${r.id} ${r.grade} ${r.name} — ${r.status}`));
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
