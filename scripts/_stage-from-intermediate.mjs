#!/usr/bin/env node
/**
 * Stage Prelude bytes from `assets/intermediate/` into the canonical
 * CDN-staging paths under `apps/client/public/`.
 *
 * Why a hand-curated mapping rather than an auto-walker: the
 * intermediate filenames (e.g. `room-engineering_original.png`) and
 * the manifest slugs (e.g. `room-engineering-bay.png`) don't always
 * agree, and the WebP/MP4 format choice is per-asset, not auto-derivable
 * from extension (e.g. the deliverables manifest references VFX MP4s
 * directly, not WebM transcodes). Encoding the mapping as data here
 * makes the contract explicit and keeps the script honest about what
 * actually flows from intermediate → staged.
 *
 * What this script delivers in this environment:
 *   - 13 Prelude rooms: PNG copy + WebP transcode (sharp).
 *   -  6 Prelude VFX clips: MP4 byte copy.
 *   -  3 Prelude ambient beds: WAV byte copy (the deliverables manifest
 *      consumes the raw WAVs directly — no loudnorm pass required).
 *
 * What this script CANNOT deliver here:
 *   -  1 alternate cutscene MP4 (intentionally unused per manifest
 *      comment — kept on intermediate for a future director's-cut).
 *
 * Usage:
 *   pnpm assets:stage:dry        # preview (no writes)
 *   pnpm assets:stage            # actually copy + transcode
 *
 * Idempotent: existing target files with the same byte size are
 * skipped. Re-running after a partial failure is safe.
 */
import {
  copyFile,
  mkdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join } from "node:path";

const REPO_ROOT = process.cwd();
const PUBLIC_ROOT = join(REPO_ROOT, "apps", "client", "public");
const INTERMEDIATE_ROOT = join(REPO_ROOT, "assets", "intermediate");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");

/**
 * @typedef {Object} CopyEntry
 * @property {"copy"} kind
 * @property {string} from   path under assets/intermediate
 * @property {string} to     path under apps/client/public
 */
/**
 * @typedef {Object} PngWebpEntry
 * @property {"png+webp"} kind
 * @property {string} from   path under assets/intermediate (must be .png)
 * @property {string} to     path under apps/client/public (must be .png; .webp sibling derived)
 */
/**
 * @typedef {Object} SkipEntry
 * @property {"skip"} kind
 * @property {string} from
 * @property {string} reason
 */
/** @typedef {CopyEntry | PngWebpEntry | SkipEntry} Entry */

/* ─── Mapping table ─── */

/** @type {Entry[]} */
const PRELUDE_ROOMS = [
  { kind: "png+webp", from: "prelude/rooms/room-archives_original.png",           to: "art/rooms/prelude/room-archives.png" },
  { kind: "png+webp", from: "prelude/rooms/room-cargo-hold_original.png",         to: "art/rooms/prelude/room-cargo-hold.png" },
  { kind: "png+webp", from: "prelude/rooms/room-corridor_original.png",           to: "art/rooms/prelude/room-corridor.png" },
  { kind: "png+webp", from: "prelude/rooms/room-armory_original.png",             to: "art/rooms/prelude/room-armory.png" },
  { kind: "png+webp", from: "prelude/rooms/room-captains-quarters_original.png",  to: "art/rooms/prelude/room-captains-quarters.png" },
  { kind: "png+webp", from: "prelude/rooms/room-mess-hall_original.png",          to: "art/rooms/prelude/room-mess-hall.png" },
  // Deliberate slug remap: intermediate calls it "engineering", the
  // deliverables manifest writes "engineering-bay". Same room.
  { kind: "png+webp", from: "prelude/rooms/room-engineering_original.png",        to: "art/rooms/prelude/room-engineering-bay.png" },
  { kind: "png+webp", from: "prelude/rooms/room-medical-bay_original.png",        to: "art/rooms/prelude/room-medical-bay.png" },
  { kind: "png+webp", from: "prelude/rooms/room-comms-array_original.png",        to: "art/rooms/prelude/room-comms-array.png" },
  { kind: "png+webp", from: "prelude/rooms/room-cryo-bay_original.png",           to: "art/rooms/prelude/room-cryo-bay.png" },
  { kind: "png+webp", from: "prelude/rooms/room-galley_original.png",             to: "art/rooms/prelude/room-galley.png" },
  { kind: "png+webp", from: "prelude/rooms/room-bridge_original.png",             to: "art/rooms/prelude/room-bridge.png" },
  { kind: "png+webp", from: "prelude/rooms/room-briefing-room_original.png",      to: "art/rooms/prelude/room-briefing-room.png" },
];

/** @type {Entry[]} */
const PRELUDE_VFX = [
  { kind: "copy", from: "prelude/vfx/cryo-frost-retreat.mp4",   to: "art/vfx/prelude/cryo-frost-retreat.mp4" },
  { kind: "copy", from: "prelude/vfx/pod-hatch-cryogas.mp4",    to: "art/vfx/prelude/pod-hatch-cryogas.mp4" },
  { kind: "copy", from: "prelude/vfx/hologram-materialize.mp4", to: "art/vfx/prelude/hologram-materialize.mp4" },
  { kind: "copy", from: "prelude/vfx/breath-pulse-strip.mp4",   to: "art/vfx/prelude/breath-pulse-strip.mp4" },
  { kind: "copy", from: "prelude/vfx/sepia-drain.mp4",          to: "art/vfx/prelude/sepia-drain.mp4" },
  { kind: "copy", from: "prelude/vfx/film-damage-overlay.mp4",  to: "art/vfx/prelude/film-damage-overlay.mp4" },
];

/** @type {Entry[]} */
const PRELUDE_AMBIENT = [
  // PRELUDE_AMBIENT_BEDS_DELIVERED in preludeAct1Deliverables.ts
  // references these WAVs at the canonical path directly — no
  // loudnorm pass required by the runtime.
  { kind: "copy", from: "prelude/audio/ambient_bridge_powered_systems_mix.wav", to: "audio/ambient/prelude/ambient_bridge_powered_systems_mix.wav" },
  { kind: "copy", from: "prelude/audio/ambient_transfer_array_standby.wav",     to: "audio/ambient/prelude/ambient_transfer_array_standby.wav" },
  { kind: "copy", from: "prelude/audio/ambient_neural_rig_hum.wav",             to: "audio/ambient/prelude/ambient_neural_rig_hum.wav" },
];

/** @type {Entry[]} */
const KNOWN_SKIPS = [
  { kind: "skip", from: "prelude/cutscenes/prelude-beat-j-archives-arrival-clip.mp4", reason: "alternate take, intentionally unused (see preludeAct1Deliverables.ts)" },
];

/** @type {Entry[]} */
const ENTRIES = [...PRELUDE_ROOMS, ...PRELUDE_VFX, ...PRELUDE_AMBIENT, ...KNOWN_SKIPS];

/* ─── Helpers ─── */

async function fileSize(path) {
  try {
    const s = await stat(path);
    return s.isFile() ? s.size : -1;
  } catch {
    return -1;
  }
}

async function ensureDir(path) {
  await mkdir(dirname(path), { recursive: true });
}

let sharpModule = null;
async function getSharp() {
  if (sharpModule) return sharpModule;
  try {
    sharpModule = (await import("sharp")).default;
    return sharpModule;
  } catch {
    return null;
  }
}

/* ─── Per-entry processors ─── */

const stats = {
  copied: 0,
  transcoded: 0,
  skippedExisting: 0,
  skippedNoSource: 0,
  skippedKnown: 0,
  failed: 0,
};

/** @param {CopyEntry} entry */
async function handleCopy(entry) {
  const fromAbs = join(INTERMEDIATE_ROOT, entry.from);
  const toAbs = join(PUBLIC_ROOT, entry.to);
  const fromSize = await fileSize(fromAbs);
  if (fromSize < 0) {
    console.warn(`  miss-source  ${entry.from}`);
    stats.skippedNoSource++;
    return;
  }
  const toSize = await fileSize(toAbs);
  if (toSize === fromSize) {
    console.log(`  skip-equal   ${entry.to}  (${(toSize / 1024).toFixed(1)} KB)`);
    stats.skippedExisting++;
    return;
  }
  if (DRY_RUN) {
    console.log(`  would-copy   ${entry.from} → ${entry.to}  (${(fromSize / 1024).toFixed(1)} KB)`);
    return;
  }
  await ensureDir(toAbs);
  await copyFile(fromAbs, toAbs);
  console.log(`  copy         ${entry.to}  (${(fromSize / 1024).toFixed(1)} KB)`);
  stats.copied++;
}

/** @param {PngWebpEntry} entry */
async function handlePngWebp(entry) {
  const fromAbs = join(INTERMEDIATE_ROOT, entry.from);
  const toPngAbs = join(PUBLIC_ROOT, entry.to);
  const toWebpAbs = toPngAbs.replace(/\.png$/u, ".webp");

  const fromSize = await fileSize(fromAbs);
  if (fromSize < 0) {
    console.warn(`  miss-source  ${entry.from}`);
    stats.skippedNoSource++;
    return;
  }

  const pngExisting = await fileSize(toPngAbs);
  const webpExisting = await fileSize(toWebpAbs);
  const pngOk = pngExisting === fromSize;
  const webpOk = webpExisting > 0;
  if (pngOk && webpOk) {
    console.log(`  skip-equal   ${entry.to}  + .webp`);
    stats.skippedExisting++;
    return;
  }

  if (DRY_RUN) {
    console.log(
      `  would-stage  ${entry.from} → ${entry.to}${pngOk ? " (png ok)" : ""} + .webp${webpOk ? " (webp ok)" : ""}  (${(fromSize / 1024).toFixed(1)} KB)`,
    );
    return;
  }

  await ensureDir(toPngAbs);
  if (!pngOk) {
    await copyFile(fromAbs, toPngAbs);
    stats.copied++;
  }
  if (!webpOk) {
    const sharp = await getSharp();
    if (!sharp) {
      console.error(`  FAIL no-sharp  cannot transcode ${entry.from}`);
      stats.failed++;
      return;
    }
    const buf = await readFile(fromAbs);
    const webpBuf = await sharp(buf).webp({ quality: 85 }).toBuffer();
    await writeFile(toWebpAbs, webpBuf);
    stats.transcoded++;
    const ratio = ((webpBuf.byteLength / fromSize) * 100).toFixed(0);
    console.log(`  stage        ${entry.to}  +.webp (${(webpBuf.byteLength / 1024).toFixed(1)} KB, ${ratio}% of png)`);
  } else {
    console.log(`  stage-png    ${entry.to}`);
  }
}

/** @param {SkipEntry} entry */
async function handleSkip(entry) {
  const fromAbs = join(INTERMEDIATE_ROOT, entry.from);
  const fromSize = await fileSize(fromAbs);
  if (fromSize < 0) {
    console.log(`  skip-known   ${entry.from}  (source missing — ${entry.reason})`);
  } else {
    console.log(`  skip-known   ${entry.from}  (${entry.reason})`);
  }
  stats.skippedKnown++;
}

/* ─── Main ─── */

console.log("");
console.log(`Staging Prelude intermediate sources${DRY_RUN ? " (dry-run)" : ""}`);
console.log(`Source: ${INTERMEDIATE_ROOT}`);
console.log(`Target: ${PUBLIC_ROOT}`);
console.log("");

for (const entry of ENTRIES) {
  if (entry.kind === "copy") await handleCopy(entry);
  else if (entry.kind === "png+webp") await handlePngWebp(entry);
  else await handleSkip(entry);
}

console.log("");
console.log("─── Summary ────────────────────────────────────────────────────");
console.log(` copied (mp4 / png)     ${stats.copied}`);
console.log(` transcoded (.webp)     ${stats.transcoded}`);
console.log(` skipped (already up)   ${stats.skippedExisting}`);
console.log(` skipped (no source)    ${stats.skippedNoSource}`);
console.log(` skipped (known/ffmpeg) ${stats.skippedKnown}`);
console.log(` failed                 ${stats.failed}`);
if (DRY_RUN) console.log("(dry-run: no files written)");
if (stats.failed > 0) process.exit(1);
