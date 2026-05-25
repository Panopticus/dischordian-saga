#!/usr/bin/env tsx
/* ═══════════════════════════════════════════════════════════════════
   SPRITE ISOLATION — Phase J sprite salvage (Path A)

   Background:
     Producer-delivered Phase J sprites are full-bleed 1920×1080 RGBA
     PNGs with alpha=255 everywhere. The "subject" of each sprite
     (named in its filename, e.g. sp22_silver_locket_floor) is only a
     small region; the rest of the canvas re-renders the base room.
     This is engine-correct (compositing still works) but produces
     ~3.5MB per sprite when ~50KB would suffice, and hotspot authoring
     against these PNGs is confusing because the whole room is shown.

   This script:
     1) For each sprite, sends the image + a subject-name prompt to
        Gemini 2.0 Flash, which returns a normalized 0–1000 bbox.
     2) Converts to pixel coords, computes a perceptual diff between
        (base ⊕ sprite) and base inside that bbox, thresholds + dilates
        to recover the precise subject alpha mask.
     3) Writes a tight-cropped RGBA PNG with alpha=0 outside the
        subject, plus a per-sprite manifest entry recording the bbox,
        output dims, and reduction %.

   Usage:
     export GEMINI_API_KEY=...
     pnpm sprites:isolate --room=archives                    # all sprites
     pnpm sprites:isolate --room=archives --limit=5          # first 5
     pnpm sprites:isolate --sprite=path/to/spXX.png          # one sprite
     pnpm sprites:isolate --room=archives --dry-run          # subjects only, no API

   Output: tools/sprite-isolation/<room>/<sprite>.png + _manifest.json
   Costs:  ~$0.0001 per sprite on Gemini 2.0 Flash (free tier covers
           the whole 584-sprite corpus several times over).
   ═══════════════════════════════════════════════════════════════════ */

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

// ───────────────────────────────────────────────────────────────────
// CLI parsing
// ───────────────────────────────────────────────────────────────────

interface CliOpts {
  room?: string;
  sprite?: string;
  limit?: number;
  dryRun: boolean;
  diffThreshold: number;
  dilatePx: number;
  manualBbox?: [number, number, number, number];
}

function parseArgs(): CliOpts {
  const opts: CliOpts = { dryRun: false, diffThreshold: 18, dilatePx: 6 };
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") opts.dryRun = true;
    else if (a.startsWith("--room=")) opts.room = a.slice(7);
    else if (a.startsWith("--sprite=")) opts.sprite = a.slice(9);
    else if (a.startsWith("--limit=")) opts.limit = parseInt(a.slice(8), 10);
    else if (a.startsWith("--threshold=")) opts.diffThreshold = parseInt(a.slice(12), 10);
    else if (a.startsWith("--dilate=")) opts.dilatePx = parseInt(a.slice(9), 10);
    else if (a.startsWith("--manual-bbox=")) {
      const parts = a.slice(14).split(",").map((p) => parseInt(p, 10));
      if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
        throw new Error(`--manual-bbox needs 4 ints (x0,y0,x1,y1), got "${a.slice(14)}"`);
      }
      opts.manualBbox = [parts[0], parts[1], parts[2], parts[3]];
    }
  }
  return opts;
}

// ───────────────────────────────────────────────────────────────────
// Room layout — mirror of COMPOSITE_ROOM_S3_DIR
// ───────────────────────────────────────────────────────────────────

const ROOMS: Record<string, string> = {
  bridge: "bridge",
  "cryo-bay": "cryo_bay",
  "medical-bay": "medical_bay",
  engineering: "engineering",
  archives: "archives",
  "comms-array": "comms_array",
  "observation-deck": "observation_deck",
};

function publicArtDir(roomDir: string): string {
  return path.resolve("apps/client/public/art/rooms", roomDir);
}

// ───────────────────────────────────────────────────────────────────
// Subject phrase extraction from sprite filename
// ───────────────────────────────────────────────────────────────────

/** Turn "sp22_silver_locket_floor" → "silver locket on the floor".
 *  Heuristic — Gemini is forgiving, doesn't need perfect English. */
function spriteToSubject(stem: string): string {
  // Strip leading "sp\d+_"
  let s = stem.replace(/^sp\d+_/, "");
  // Common location suffixes get a preposition
  const locSuffixes: Record<string, string> = {
    floor: " on the floor",
    wall: " on the wall",
    table: " on the table",
    pod: " on a pod",
    bench: " on the bench",
    console: " on the console",
    desk: " on the desk",
    plinth: " on the plinth",
  };
  for (const [suf, prep] of Object.entries(locSuffixes)) {
    const re = new RegExp(`_${suf}(_.*)?$`);
    const m = s.match(re);
    if (m) {
      const rest = m[1] ? ` (${m[1].slice(1).replace(/_/g, " ")})` : "";
      s = s.replace(re, "") + prep + rest;
      break;
    }
  }
  // General _ → space
  return s.replace(/_/g, " ");
}

// ───────────────────────────────────────────────────────────────────
// Gemini bbox API
// ───────────────────────────────────────────────────────────────────

interface GeminiBbox {
  /** Pixel coords in 1920×1080 space. */
  bbox: [number, number, number, number]; // x0, y0, x1, y1
  /** Raw model response for debugging. */
  raw: string;
}

const GEMINI_KEY = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
const GEMINI_MODEL = "gemini-2.0-flash";

async function geminiLocateSubject(
  imagePath: string,
  subject: string,
  canvasW: number,
  canvasH: number,
): Promise<GeminiBbox> {
  if (!GEMINI_KEY) {
    throw new Error(
      "GEMINI_API_KEY not set. Get a key at https://aistudio.google.com/apikey " +
      "and export GEMINI_API_KEY=... before running.",
    );
  }
  const imageB64 = fs.readFileSync(imagePath).toString("base64");
  const prompt =
    `Locate the "${subject}" in this image. ` +
    `Return ONLY a JSON object of the form ` +
    `{"box_2d":[ymin,xmin,ymax,xmax]} with values normalized to 0-1000. ` +
    `The box should tightly enclose just the named subject. ` +
    `If the subject is not visible, return {"box_2d":null}.`;
  const body = {
    contents: [{
      role: "user",
      parts: [
        { text: prompt },
        { inline_data: { mime_type: "image/png", data: imageB64 } },
      ],
    }],
    generationConfig: { temperature: 0.0, response_mime_type: "application/json" },
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  }
  const json = await res.json() as any;
  const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const parsed = JSON.parse(text);
  const b = parsed?.box_2d;
  if (!Array.isArray(b) || b.length !== 4) {
    throw new Error(`Gemini returned non-bbox: ${text}`);
  }
  const [ymin, xmin, ymax, xmax] = b as [number, number, number, number];
  const x0 = Math.max(0, Math.round((xmin / 1000) * canvasW));
  const y0 = Math.max(0, Math.round((ymin / 1000) * canvasH));
  const x1 = Math.min(canvasW, Math.round((xmax / 1000) * canvasW));
  const y1 = Math.min(canvasH, Math.round((ymax / 1000) * canvasH));
  return { bbox: [x0, y0, x1, y1], raw: text };
}

// ───────────────────────────────────────────────────────────────────
// Isolation pipeline (diff within bbox + dilate + crop)
// ───────────────────────────────────────────────────────────────────

interface IsolationResult {
  /** Tight bbox of the subject in the original canvas. */
  tightBbox: [number, number, number, number];
  /** Number of pixels surviving the mask (subject area in px). */
  subjectPx: number;
  /** Width × Height of the output cropped PNG. */
  outputSize: [number, number];
  /** Coverage % within the FULL CANVAS area (compare to pre-isolation). */
  coveragePct: number;
}

async function isolateWithinBbox(
  basePath: string,
  spritePath: string,
  bbox: [number, number, number, number],
  outPath: string,
  diffThreshold: number,
  dilatePx: number,
): Promise<IsolationResult> {
  const baseImg = sharp(basePath).removeAlpha();
  const spriteImg = sharp(spritePath).ensureAlpha();

  const { data: baseRaw, info } = await baseImg
    .raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  if (W !== 1920 || H !== 1080) {
    throw new Error(`Unexpected base size ${W}×${H} for ${basePath}; expected 1920×1080`);
  }

  // Composite sprite over base → RGB
  const composited = await sharp(basePath)
    .composite([{ input: spritePath }])
    .removeAlpha()
    .raw().toBuffer();

  // Diff per pixel: max of |R−R|, |G−G|, |B−B|
  const [bx0, by0, bx1, by1] = bbox;
  const padded: [number, number, number, number] = [
    Math.max(0, bx0 - 12), Math.max(0, by0 - 12),
    Math.min(W, bx1 + 12),  Math.min(H, by1 + 12),
  ];
  const mask = new Uint8Array(W * H); // 0/1
  for (let y = padded[1]; y < padded[3]; y++) {
    for (let x = padded[0]; x < padded[2]; x++) {
      const i = (y * W + x) * 3;
      const dR = Math.abs(composited[i]   - baseRaw[i]);
      const dG = Math.abs(composited[i+1] - baseRaw[i+1]);
      const dB = Math.abs(composited[i+2] - baseRaw[i+2]);
      if (Math.max(dR, dG, dB) >= diffThreshold) mask[y * W + x] = 1;
    }
  }

  // Dilate the mask (box max filter, radius=dilatePx)
  const dilated = dilateMask(mask, W, H, dilatePx);

  // Apply mask to sprite alpha, find tight bbox
  const { data: spriteRaw } = await sharp(spritePath)
    .ensureAlpha()
    .raw().toBuffer({ resolveWithObject: true });
  let minX = W, minY = H, maxX = -1, maxY = -1, subjectPx = 0;
  const out = Buffer.from(spriteRaw); // copy
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const m = dilated[y * W + x];
      const idx = (y * W + x) * 4 + 3; // alpha index
      if (!m) {
        out[idx] = 0;
      } else {
        subjectPx++;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (subjectPx === 0) {
    throw new Error("isolation produced empty mask — bbox or threshold too tight");
  }
  const tight: [number, number, number, number] = [minX, minY, maxX + 1, maxY + 1];
  const cropW = tight[2] - tight[0];
  const cropH = tight[3] - tight[1];

  // Build a sharp pipeline from the modified RGBA buffer, then crop
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: tight[0], top: tight[1], width: cropW, height: cropH })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  return {
    tightBbox: tight,
    subjectPx,
    outputSize: [cropW, cropH],
    coveragePct: (subjectPx / (W * H)) * 100,
  };
}

/** Box-max dilation (radius=r). r=0 is a no-op. Implemented as
 *  two-pass separable max-filter for O(W·H·r) instead of O(W·H·r²). */
function dilateMask(mask: Uint8Array, W: number, H: number, r: number): Uint8Array {
  if (r <= 0) return mask;
  const tmp = new Uint8Array(W * H);
  // Horizontal pass
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let any = 0;
      for (let dx = -r; dx <= r; dx++) {
        const xx = x + dx;
        if (xx < 0 || xx >= W) continue;
        if (mask[y * W + xx]) { any = 1; break; }
      }
      tmp[y * W + x] = any;
    }
  }
  const out = new Uint8Array(W * H);
  // Vertical pass
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let any = 0;
      for (let dy = -r; dy <= r; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= H) continue;
        if (tmp[yy * W + x]) { any = 1; break; }
      }
      out[y * W + x] = any;
    }
  }
  return out;
}

// ───────────────────────────────────────────────────────────────────
// Driver
// ───────────────────────────────────────────────────────────────────

interface ManifestEntry {
  sprite: string;
  subject: string;
  geminiBbox: [number, number, number, number];
  tightBbox: [number, number, number, number];
  outputSize: [number, number];
  originalBytes: number;
  outputBytes: number;
  reductionPct: number;
  coveragePct: number;
  outPath: string;
  status: "ok" | "skipped" | "error";
  error?: string;
}

function findInitialBase(roomDir: string): string {
  const baseDir = path.join(publicArtDir(roomDir), "base");
  const candidates = [
    path.join(baseDir, `${roomDir}_base_initial.png`),
    ...fs.existsSync(baseDir) ? fs.readdirSync(baseDir).filter(f => f.endsWith(".png")).map(f => path.join(baseDir, f)) : [],
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  throw new Error(`no base PNG found in ${baseDir}`);
}

async function processSprite(
  spritePath: string,
  basePath: string,
  outDir: string,
  opts: CliOpts,
): Promise<ManifestEntry> {
  const stem = path.basename(spritePath, ".png");
  const subject = spriteToSubject(stem);
  const outPath = path.join(outDir, `${stem}.png`);

  if (opts.dryRun) {
    return {
      sprite: stem, subject,
      geminiBbox: [0,0,0,0], tightBbox: [0,0,0,0],
      outputSize: [0,0], originalBytes: 0, outputBytes: 0,
      reductionPct: 0, coveragePct: 0,
      outPath: "(dry-run)", status: "skipped",
    };
  }

  try {
    const bbox = opts.manualBbox
      ? opts.manualBbox
      : (await geminiLocateSubject(spritePath, subject, 1920, 1080)).bbox;
    const result = await isolateWithinBbox(
      basePath, spritePath, bbox, outPath, opts.diffThreshold, opts.dilatePx,
    );
    const origBytes = fs.statSync(spritePath).size;
    const outBytes = fs.statSync(outPath).size;
    return {
      sprite: stem, subject,
      geminiBbox: bbox, tightBbox: result.tightBbox,
      outputSize: result.outputSize,
      originalBytes: origBytes, outputBytes: outBytes,
      reductionPct: (1 - outBytes / origBytes) * 100,
      coveragePct: result.coveragePct,
      outPath, status: "ok",
    };
  } catch (e: any) {
    return {
      sprite: stem, subject,
      geminiBbox: [0,0,0,0], tightBbox: [0,0,0,0],
      outputSize: [0,0], originalBytes: 0, outputBytes: 0,
      reductionPct: 0, coveragePct: 0,
      outPath: "", status: "error", error: e?.message ?? String(e),
    };
  }
}

async function main() {
  const opts = parseArgs();

  if (!opts.room && !opts.sprite) {
    console.error("Usage: tsx isolate-sprites.ts --room=<id> [--limit=N] [--dry-run]");
    console.error("       tsx isolate-sprites.ts --sprite=<path>");
    console.error("Rooms:", Object.keys(ROOMS).join(", "));
    process.exit(2);
  }

  if (!opts.dryRun && !opts.manualBbox && !GEMINI_KEY) {
    console.error("Set GEMINI_API_KEY (free tier covers full corpus).");
    console.error("Get a key at https://aistudio.google.com/apikey");
    console.error("Or pass --manual-bbox=x0,y0,x1,y1 to skip the API.");
    process.exit(2);
  }

  // Single-sprite mode
  if (opts.sprite) {
    const spritePath = path.resolve(opts.sprite);
    if (!fs.existsSync(spritePath)) throw new Error(`no such sprite: ${spritePath}`);
    // Infer room from path
    const m = spritePath.match(/art\/rooms\/([^/]+)\/sprites\//);
    if (!m) throw new Error("can't infer room from sprite path");
    const roomDir = m[1];
    const basePath = findInitialBase(roomDir);
    const outDir = path.resolve("tools/sprite-isolation", roomDir);
    const entry = await processSprite(spritePath, basePath, outDir, opts);
    console.log(JSON.stringify(entry, null, 2));
    return;
  }

  // Room mode
  const roomDir = ROOMS[opts.room!] ?? opts.room!;
  const spriteDir = path.join(publicArtDir(roomDir), "sprites");
  if (!fs.existsSync(spriteDir)) throw new Error(`no sprites at ${spriteDir}`);
  const basePath = findInitialBase(roomDir);
  const outDir = path.resolve("tools/sprite-isolation", roomDir);
  fs.mkdirSync(outDir, { recursive: true });

  let sprites = fs.readdirSync(spriteDir).filter(f => f.endsWith(".png")).sort();
  if (opts.limit) sprites = sprites.slice(0, opts.limit);

  console.log(`isolating ${sprites.length} sprites for ${opts.room} (${roomDir})`);
  console.log(`base: ${path.basename(basePath)}`);
  console.log(`out:  ${outDir}`);
  if (opts.dryRun) console.log("[dry-run] no Gemini calls, just subject preview");

  const manifest: ManifestEntry[] = [];
  let ok = 0, err = 0, skipped = 0;
  for (let i = 0; i < sprites.length; i++) {
    const spritePath = path.join(spriteDir, sprites[i]);
    const entry = await processSprite(spritePath, basePath, outDir, opts);
    manifest.push(entry);
    if (entry.status === "ok") {
      ok++;
      console.log(
        `  ${i+1}/${sprites.length}  OK   ${entry.sprite.slice(0,38).padEnd(38)} ` +
        `→ ${entry.outputSize[0]}×${entry.outputSize[1]} ` +
        `(${entry.reductionPct.toFixed(1)}% smaller, ${entry.coveragePct.toFixed(2)}% canvas)`
      );
    } else if (entry.status === "error") {
      err++;
      console.log(`  ${i+1}/${sprites.length}  ERR  ${entry.sprite}: ${entry.error}`);
    } else {
      skipped++;
      console.log(`  ${i+1}/${sprites.length}  SKIP ${entry.sprite} (subject: "${entry.subject}")`);
    }
  }

  const manifestPath = path.join(outDir, "_manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  const totalOrig = manifest.reduce((n,e) => n + e.originalBytes, 0);
  const totalOut  = manifest.reduce((n,e) => n + e.outputBytes, 0);
  console.log();
  console.log(`done — ok=${ok}, err=${err}, skipped=${skipped}`);
  if (totalOrig > 0) {
    console.log(
      `bytes: ${(totalOrig/1024/1024).toFixed(1)} MB → ${(totalOut/1024/1024).toFixed(1)} MB ` +
      `(${((1 - totalOut/totalOrig) * 100).toFixed(1)}% smaller)`
    );
  }
  console.log(`manifest: ${manifestPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
