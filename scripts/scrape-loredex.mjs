#!/usr/bin/env node
/**
 * Headless Browser Scraper for loredex.dgrslabs.ink
 *
 * Uses Puppeteer (puppeteer-core + Playwright's Chromium) to render
 * every entity and song page, extract modal/page content, and produce
 * a comprehensive JSON dump + Markdown Lore Bible.
 *
 * Usage:
 *   node scripts/scrape-loredex.mjs [--url https://loredex.dgrslabs.ink] [--out ./output]
 *   node scripts/scrape-loredex.mjs --local          # Generate from local JSON data only
 */

import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─── Config ────────────────────────────────────────────────────────
const BASE_URL = process.argv.includes("--url")
  ? process.argv[process.argv.indexOf("--url") + 1]
  : "https://loredex.dgrslabs.ink";

const OUT_DIR = process.argv.includes("--out")
  ? path.resolve(process.argv[process.argv.indexOf("--out") + 1])
  : path.join(ROOT, "output");

const CHROMIUM_PATH = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const LOCAL_ONLY = process.argv.includes("--local");

const CONCURRENCY = 4;          // parallel browser tabs
const NAV_TIMEOUT = 30_000;     // ms to wait for page load
const CONTENT_WAIT = 3_000;     // ms to wait after load for JS rendering
const RETRY_LIMIT = 2;

// ─── Helpers ───────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function timestamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function log(msg) {
  process.stdout.write(`[${timestamp()}] ${msg}\n`);
}

// ─── Load entry list from local data (avoids extra scraping) ──────
function loadEntryManifest() {
  const dataPath = path.join(ROOT, "client/src/data/loredex-data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  return data.entries.map((e) => ({
    id: e.id,
    type: e.type,
    name: e.name,
    // songs use /song/:id, everything else uses /entity/:id
    path: e.type === "song" ? `/song/${e.id}` : `/entity/${e.id}`,
  }));
}

// ─── Extract content from a rendered entity page ──────────────────
async function scrapeEntityPage(page) {
  return page.evaluate(() => {
    const txt = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.textContent.trim() : "";
    };
    const allTxt = (sel) =>
      [...document.querySelectorAll(sel)].map((el) => el.textContent.trim()).filter(Boolean);

    // Try multiple selectors to be resilient to class changes
    const name =
      txt("h1") ||
      txt("[class*='entity-name']") ||
      txt("[class*='title']");

    // Grab the type badge
    const typeBadge =
      txt("[class*='badge-character']") ||
      txt("[class*='badge-location']") ||
      txt("[class*='badge-faction']") ||
      txt("[class*='badge-song']") ||
      txt("[class*='badge-concept']") ||
      txt("[class*='badge-event']") ||
      "";

    // Metadata items (era, affiliation, status, etc.)
    const metaItems = {};
    document.querySelectorAll("[class*='font-mono']").forEach((el) => {
      const text = el.textContent.trim();
      if (text.includes("ERA:") || text.includes("Era:")) metaItems.era = text.split(":").slice(1).join(":").trim();
      if (text.includes("AFFILIATION:") || text.includes("Affiliation:")) metaItems.affiliation = text.split(":").slice(1).join(":").trim();
      if (text.includes("STATUS:") || text.includes("Status:")) metaItems.status = text.split(":").slice(1).join(":").trim();
      if (text.includes("DATE:") || text.includes("Date:")) metaItems.date = text.split(":").slice(1).join(":").trim();
      if (text.includes("SEASON:") || text.includes("Season:")) metaItems.season = text.split(":").slice(1).join(":").trim();
    });

    // Dossier / Bio section
    const sections = {};
    document.querySelectorAll("h2, h3, [class*='section-title']").forEach((heading) => {
      const title = heading.textContent.trim().toUpperCase();
      // Get the next sibling or parent's next content
      let content = "";
      let sibling = heading.nextElementSibling;
      while (sibling && !sibling.matches("h2, h3, [class*='section-title']")) {
        content += sibling.textContent.trim() + "\n";
        sibling = sibling.nextElementSibling;
      }
      if (content.trim()) {
        sections[title] = content.trim();
      }
    });

    // All paragraph text (fallback)
    const allParagraphs = allTxt("p").join("\n\n");

    // Connections / related entities
    const connections = allTxt("a[href*='/entity/'], a[href*='/song/']")
      .filter((t) => t.length > 1 && t.length < 100);

    // Images
    const images = [...document.querySelectorAll("img[src*='cloudfront'], img[src*='cdn']")]
      .map((img) => ({ src: img.src, alt: img.alt }));

    // Hero image specifically
    const heroImg = document.querySelector("img[class*='object-cover']");

    // Song-specific: lyrics
    const lyrics = txt("[class*='lyrics'], [class*='Lyrics']");

    // Song-specific: album, track number
    const albumInfo = txt("[class*='album']") || "";
    const trackInfo = txt("[class*='track']") || "";

    // Featured characters (song pages)
    const featuredCharacters = allTxt("[class*='featured'] a, [class*='character'] a")
      .filter((t) => t.length > 1 && t.length < 80);

    // Streaming links
    const streamingLinks = {};
    document.querySelectorAll("a[href*='spotify'], a[href*='apple'], a[href*='tidal'], a[href*='youtube']").forEach((a) => {
      const href = a.href;
      if (href.includes("spotify")) streamingLinks.spotify = href;
      if (href.includes("apple")) streamingLinks.apple_music = href;
      if (href.includes("tidal")) streamingLinks.tidal = href;
      if (href.includes("youtube") && !href.includes("embed")) streamingLinks.youtube = href;
    });

    // Story arc content
    const storyArc = allTxt("[class*='story-arc'] *, [class*='StoryArc'] *").join("\n");

    return {
      name,
      typeBadge,
      meta: metaItems,
      sections,
      allParagraphs,
      connections: [...new Set(connections)],
      images,
      heroImage: heroImg ? { src: heroImg.src, alt: heroImg.alt } : null,
      lyrics: lyrics || null,
      albumInfo,
      trackInfo,
      featuredCharacters: [...new Set(featuredCharacters)],
      streamingLinks,
      storyArc: storyArc || null,
      pageTitle: document.title,
      url: window.location.href,
    };
  });
}

// ─── Scrape a single entry with retries ───────────────────────────
async function scrapeEntry(browser, entry, attempt = 0) {
  const page = await browser.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 900 });

    const url = `${BASE_URL}${entry.path}`;
    await page.goto(url, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT });

    // Wait for React to hydrate and content to render
    await sleep(CONTENT_WAIT);

    // Wait for main content to appear
    await page.waitForSelector("h1, [class*='entity'], [class*='song']", { timeout: 10_000 }).catch(() => {});

    const content = await scrapeEntityPage(page);
    return { ...entry, scraped: content, error: null };
  } catch (err) {
    if (attempt < RETRY_LIMIT) {
      log(`  Retry ${attempt + 1} for ${entry.name}`);
      await sleep(1000 * (attempt + 1));
      return scrapeEntry(browser, entry, attempt + 1);
    }
    return { ...entry, scraped: null, error: err.message };
  } finally {
    await page.close();
  }
}

// ─── Parallel scraping with concurrency limit ─────────────────────
async function scrapeAll(browser, entries) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < entries.length) {
      const i = idx++;
      const entry = entries[i];
      log(`[${i + 1}/${entries.length}] Scraping: ${entry.name} (${entry.type})`);
      const result = await scrapeEntry(browser, entry);
      results.push(result);
      if (result.error) {
        log(`  ✗ FAILED: ${entry.name} — ${result.error}`);
      } else {
        log(`  ✓ ${entry.name}`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  // Sort back to original order
  results.sort((a, b) => {
    const ai = entries.findIndex((e) => e.id === a.id);
    const bi = entries.findIndex((e) => e.id === b.id);
    return ai - bi;
  });

  return results;
}

// ─── Generate Lore Bible Markdown ─────────────────────────────────
function generateLoreBible(results, loredexData) {
  const lines = [];
  const hr = "---";

  lines.push("# The Dischordian Saga — Complete Lore Bible");
  lines.push("");
  lines.push(`> Auto-generated from [loredex.dgrslabs.ink](${BASE_URL}) on ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`> Total entries scraped: ${results.filter((r) => r.scraped).length} / ${results.length}`);
  lines.push("");
  lines.push("## Table of Contents");
  lines.push("");

  // Group by type
  const groups = {
    character: { title: "Characters", icon: "👤", entries: [] },
    faction: { title: "Factions", icon: "⚔️", entries: [] },
    location: { title: "Locations", icon: "📍", entries: [] },
    concept: { title: "Concepts", icon: "💡", entries: [] },
    event: { title: "Events", icon: "📅", entries: [] },
    song: { title: "Songs & Transmissions", icon: "🎵", entries: [] },
  };

  for (const r of results) {
    const group = groups[r.type] || groups.concept;
    group.entries.push(r);
  }

  // TOC
  for (const [type, group] of Object.entries(groups)) {
    if (group.entries.length === 0) continue;
    const anchor = type.toLowerCase();
    lines.push(`- [${group.title}](#${anchor}) (${group.entries.length})`);
  }
  lines.push("");
  lines.push(hr);
  lines.push("");

  // Also load the raw data for enrichment
  const rawMap = {};
  loredexData.entries.forEach((e) => { rawMap[e.id] = e; });

  // ─── Render each group ───
  for (const [type, group] of Object.entries(groups)) {
    if (group.entries.length === 0) continue;

    lines.push(`# ${group.title}`);
    lines.push("");

    for (const entry of group.entries) {
      const raw = rawMap[entry.id] || {};
      const s = entry.scraped || {};

      lines.push(`## ${raw.name || entry.name}`);
      lines.push("");

      // Metadata table
      const meta = [];
      if (raw.type) meta.push(["Type", raw.type.charAt(0).toUpperCase() + raw.type.slice(1)]);
      if (raw.era) meta.push(["Era", raw.era]);
      if (raw.date_aa) meta.push(["Date (A.A.)", raw.date_aa]);
      if (raw.date_ad) meta.push(["Date (AD)", raw.date_ad]);
      if (raw.season) meta.push(["Season", raw.season]);
      if (raw.affiliation) meta.push(["Affiliation", raw.affiliation]);
      if (raw.status) meta.push(["Status", raw.status]);
      if (raw.album) meta.push(["Album", raw.album]);
      if (raw.track_number) meta.push(["Track #", String(raw.track_number)]);
      if (raw.artist) meta.push(["Artist", raw.artist]);
      if (raw.release_year) meta.push(["Release Year", raw.release_year]);
      if (raw.priority) meta.push(["Priority", raw.priority]);

      if (meta.length > 0) {
        lines.push("| Field | Value |");
        lines.push("|-------|-------|");
        for (const [k, v] of meta) {
          lines.push(`| **${k}** | ${v} |`);
        }
        lines.push("");
      }

      // Image
      if (raw.image) {
        lines.push(`![${raw.name}](${raw.image})`);
        lines.push("");
      }

      // Biography / Description
      if (raw.bio) {
        lines.push("### Dossier");
        lines.push("");
        lines.push(raw.bio);
        lines.push("");
      }

      // Extended History
      if (raw.history && raw.history !== raw.bio) {
        lines.push("### History");
        lines.push("");
        lines.push(raw.history);
        lines.push("");
      }

      // Scraped sections (content rendered by JS that may differ from raw data)
      if (s.sections && Object.keys(s.sections).length > 0) {
        for (const [title, content] of Object.entries(s.sections)) {
          // Skip if we already have this from raw data
          if (title.includes("DOSSIER") && raw.bio) continue;
          if (title.includes("HISTORY") && raw.history) continue;
          if (title === "BACK TO DASHBOARD" || title === "BACK") continue;
          if (content.length < 5) continue;

          lines.push(`### ${title}`);
          lines.push("");
          lines.push(content);
          lines.push("");
        }
      }

      // Story Arc (scraped)
      if (s.storyArc) {
        lines.push("### Story Arc");
        lines.push("");
        lines.push(s.storyArc);
        lines.push("");
      }

      // Connections
      const connections = raw.connections || [];
      if (connections.length > 0) {
        lines.push("### Connections");
        lines.push("");
        for (const c of connections) {
          lines.push(`- ${c}`);
        }
        lines.push("");
      }

      // Song Appearances
      if (raw.song_appearances && raw.song_appearances.length > 0) {
        lines.push("### Song Appearances");
        lines.push("");
        lines.push("| Song | Album | Music Video |");
        lines.push("|------|-------|-------------|");
        for (const sa of raw.song_appearances) {
          const mv = sa.music_video?.official || sa.music_video?.vevo || "—";
          const mvLink = mv !== "—" ? `[Watch](${mv})` : "—";
          lines.push(`| ${sa.song} | ${sa.album} | ${mvLink} |`);
        }
        lines.push("");
      }

      // Featured Characters (songs)
      if (raw.characters_featured && raw.characters_featured.length > 0) {
        lines.push("### Featured Characters");
        lines.push("");
        for (const c of raw.characters_featured) {
          lines.push(`- ${c}`);
        }
        lines.push("");
      }

      // CoNexus Stories
      if (raw.conexus_stories && raw.conexus_stories.length > 0) {
        lines.push("### CoNexus Stories");
        lines.push("");
        for (const story of raw.conexus_stories) {
          lines.push(`- ${story}`);
        }
        lines.push("");
      }

      // Streaming Links
      const streaming = raw.streaming_links || s.streamingLinks || {};
      if (Object.keys(streaming).length > 0) {
        lines.push("### Streaming Links");
        lines.push("");
        for (const [platform, url] of Object.entries(streaming)) {
          const label = platform.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          lines.push(`- [${label}](${url})`);
        }
        lines.push("");
      }

      // Music Videos
      if (raw.music_video && Object.keys(raw.music_video).length > 0) {
        lines.push("### Music Videos");
        lines.push("");
        for (const [label, url] of Object.entries(raw.music_video)) {
          lines.push(`- [${label}](${url})`);
        }
        lines.push("");
      }

      lines.push(hr);
      lines.push("");
    }
  }

  // ─── Relationship Graph ───
  if (loredexData.relationships && loredexData.relationships.length > 0) {
    lines.push("# Relationship Graph");
    lines.push("");
    lines.push("| Source | Relationship | Target |");
    lines.push("|--------|-------------|--------|");
    for (const rel of loredexData.relationships) {
      lines.push(`| ${rel.source} | ${rel.relationship_type} | ${rel.target} |`);
    }
    lines.push("");
    lines.push(hr);
    lines.push("");
  }

  // ─── Episodes ───
  if (loredexData.episodes && Object.keys(loredexData.episodes).length > 0) {
    lines.push("# Episodes & Story Collections");
    lines.push("");
    for (const [epKey, epData] of Object.entries(loredexData.episodes)) {
      lines.push(`## ${epKey}`);
      lines.push("");
      if (Array.isArray(epData)) {
        for (const item of epData) {
          if (typeof item === "string") {
            lines.push(`- ${item}`);
          } else if (item && typeof item === "object") {
            lines.push(`- **${item.title || "Untitled"}**`);
            if (item.primary_character) lines.push(`  - Primary Character: ${item.primary_character}`);
            if (item.description) lines.push(`  - ${item.description}`);
          }
        }
      } else if (epData && typeof epData === "object") {
        if (epData.title) lines.push(`**${epData.title}**\n`);
        if (epData.description) lines.push(epData.description);
        if (epData.entries && Array.isArray(epData.entries)) {
          lines.push(`\nEntries: ${epData.entries.join(", ")}`);
        }
      }
      lines.push("");
    }
    lines.push(hr);
    lines.push("");
  }

  // ─── Aliases ───
  if (loredexData.aliases && Object.keys(loredexData.aliases).length > 0) {
    lines.push("# Known Aliases");
    lines.push("");
    lines.push("| Alias | True Name |");
    lines.push("|-------|-----------|");
    for (const [alias, name] of Object.entries(loredexData.aliases)) {
      lines.push(`| ${alias} | ${name} |`);
    }
    lines.push("");
    lines.push(hr);
    lines.push("");
  }

  // ─── Stats ───
  if (loredexData.stats) {
    lines.push("# Universe Statistics");
    lines.push("");
    for (const [k, v] of Object.entries(loredexData.stats)) {
      lines.push(`- **${k}**: ${v}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ─── Main ──────────────────────────────────────────────────────────
async function main() {
  log("═══ Dischordian Saga Loredex Scraper ═══");
  log(`Mode: ${LOCAL_ONLY ? "LOCAL (JSON data)" : "LIVE (headless browser)"}`);
  log(`Target: ${BASE_URL}`);
  log(`Output: ${OUT_DIR}`);
  log("");

  // Ensure output directory
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Load entry manifest & full data
  const entries = loadEntryManifest();
  const loredexData = JSON.parse(
    fs.readFileSync(path.join(ROOT, "client/src/data/loredex-data.json"), "utf-8")
  );
  log(`Found ${entries.length} entries`);
  log(`  Characters: ${entries.filter((e) => e.type === "character").length}`);
  log(`  Songs: ${entries.filter((e) => e.type === "song").length}`);
  log(`  Factions: ${entries.filter((e) => e.type === "faction").length}`);
  log(`  Locations: ${entries.filter((e) => e.type === "location").length}`);
  log(`  Events: ${entries.filter((e) => e.type === "event").length}`);
  log(`  Concepts: ${entries.filter((e) => e.type === "concept").length}`);
  log("");

  let results;

  if (LOCAL_ONLY) {
    // ─── Local-only mode: build results from JSON without browser ───
    log("Generating lore bible from local JSON data...\n");
    results = entries.map((entry) => ({
      ...entry,
      scraped: { sections: {}, connections: [], streamingLinks: {} },
      error: null,
    }));
  } else {
    // ─── Live scrape mode: use headless Chromium ───
    log(`Chromium: ${CHROMIUM_PATH}`);
    log("Launching headless Chromium...");
    const browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });
    log("Browser launched.\n");

    try {
      // Verify site accessibility
      log("Verifying site accessibility...");
      const testPage = await browser.newPage();
      await testPage.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );
      try {
        const resp = await testPage.goto(BASE_URL, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT });
        log(`Site responded: ${resp.status()}`);
        await sleep(2000);
        const title = await testPage.title();
        log(`Page title: "${title}"`);
      } catch (err) {
        log(`WARNING: Could not reach ${BASE_URL} — ${err.message}`);
        log("Falling back to local data enrichment...");
      }
      await testPage.close();

      // Scrape all entries
      log("\n═══ Starting full scrape ═══\n");
      const startTime = Date.now();
      results = await scrapeAll(browser, entries);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      const succeeded = results.filter((r) => r.scraped).length;
      const failed = results.filter((r) => r.error).length;
      log(`\n═══ Scrape Complete ═══`);
      log(`Succeeded: ${succeeded} | Failed: ${failed} | Time: ${elapsed}s\n`);

      // Save raw scraped JSON
      const jsonPath = path.join(OUT_DIR, "loredex-scraped.json");
      fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
      log(`Raw JSON saved: ${jsonPath}`);
    } finally {
      await browser.close();
      log("Browser closed.\n");
    }
  }

  // Generate lore bible (works in both modes — raw JSON data is the source of truth)
  const bible = generateLoreBible(results, loredexData);
  const biblePath = path.join(OUT_DIR, "LORE_BIBLE.md");
  fs.writeFileSync(biblePath, bible);
  log(`Lore Bible saved: ${biblePath} (${(bible.length / 1024).toFixed(0)} KB)`);

  // Summary report
  const succeeded = results.filter((r) => r.scraped).length;
  const failed = results.filter((r) => r.error).length;
  const summaryPath = path.join(OUT_DIR, "scrape-summary.json");
  fs.writeFileSync(
    summaryPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        mode: LOCAL_ONLY ? "local" : "live",
        baseUrl: BASE_URL,
        totalEntries: results.length,
        succeeded,
        failed,
        byType: Object.fromEntries(
          Object.entries(groups(results)).map(([type, items]) => [
            type,
            { total: items.length, scraped: items.filter((e) => e.scraped).length },
          ])
        ),
      },
      null,
      2
    )
  );
  log(`Summary saved: ${summaryPath}`);
  log("\nDone!");
}

function groups(results) {
  const g = {};
  for (const r of results) {
    if (!g[r.type]) g[r.type] = [];
    g[r.type].push(r);
  }
  return g;
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
