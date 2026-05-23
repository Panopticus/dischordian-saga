#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   UNIVERSAL CDN ZIP AUDIT — every uningested producer ZIP
   on s3://dgrsart/ probed against the four ratcheted art
   coverage gaps + classified by content type.

   Job: tell us exactly which ZIPs close which ratchets so
   subsequent ingest passes can attack in real impact order.

   Output: a single JSON report grouping every probed ZIP
   into INGESTED / UNPROCESSED / SKIPPED, with per-ratchet
   closure counts and a content-class summary for unclassified
   payloads.

   Usage:
     pnpm art:audit-all-zips                       # full sweep
     pnpm art:audit-all-zips --skip-ingested       # skip already-wired ZIPs
     pnpm art:audit-all-zips --pattern=room        # only ZIPs whose key contains "room"
     pnpm art:audit-all-zips --report=/tmp/x.json  # write JSON report

   Requires AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in env
   (the bucket root is private; HEAD on the public prefix
   can't enumerate). Downloads cached at os.tmpdir().

   Skip list: `_masters/*` ZIPs (master archive duplicates of
   slideshow albums already in scope under their non-`_masters/`
   paths) — never downloaded.
   ═══════════════════════════════════════════════════════ */

import { S3Client } from "@aws-sdk/client-s3";
async function loadGetObjectCommand(): Promise<new (input: { Bucket: string; Key: string }) => unknown> {
  const mod = (await import("@aws-sdk/client-s3")) as unknown as {
    GetObjectCommand: new (input: { Bucket: string; Key: string }) => unknown;
  };
  return mod.GetObjectCommand;
}
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, createWriteStream, existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import type { Readable } from "node:stream";

import { parseProducerFilename, getConventionForZip } from "./_phase_h/_filename_normalisers";
import {
  ROOM_ART_ENTRIES,
  roomArtByAxis,
  roomArtCoverageReport,
  roomArtStateUrl,
} from "../shared/expansionArt/roomArtManifest";

const BUCKET = "dgrsart";
const REGION = process.env.AWS_REGION || "us-east-2";
const CONCURRENCY = 3; // parallel downloads — keep low so disk doesn't fill

/* ─── ZIP inventory ───
   Sourced from `aws s3 ls s3://dgrsart/ --recursive | grep '\\.zip$'`
   on 2026-05-22. Update when new producer drops land. */
interface ZipRow {
  key: string;
  sizeMb: number;
  date: string;
  /** Set when this ZIP has been ingested into a typed manifest already. */
  ingested?: { manifest: string; pass?: string };
  /** Set when we explicitly skip this ZIP (e.g. `_masters/` duplicates). */
  skip?: string;
  /** Producer-pack convention id. Drives the filename normaliser
   *  for matching against gaps. Unset → content-class summary only. */
  convention?: string;
  /** Hint for which ingest family this belongs to. */
  family?: "room_art" | "cutscene" | "card_art" | "portrait" | "sprite" | "suit"
          | "viseme" | "album_slideshow" | "vfx" | "ui_atlas" | "predecessor"
          | "consolidated" | "unknown";
}

const ZIP_INVENTORY: readonly ZipRow[] = [
  // ── INGESTED ROOM ART (Phase H passes) ──
  { key: "AAA Final/rooms_complete_library.zip", sizeMb: 3401, date: "2026-05-11",
    ingested: { manifest: "roomArtManifest.data.ts", pass: "H.A" }, family: "room_art" },
  { key: "AAA Final/final_22_rooms.zip", sizeMb: 178, date: "2026-05-12",
    ingested: { manifest: "roomArtManifest.data.ts", pass: "H1.A" }, family: "room_art" },
  { key: "AAA Final/NEW_ROOMS_82.zip", sizeMb: 514, date: "2026-05-12",
    ingested: { manifest: "roomArtManifest.data.ts", pass: "H2.A" }, family: "room_art" },

  // ── INGESTED OTHER ART ──
  { key: "NEW_ART_1_characters_cards_sheets.zip", sizeMb: 1100, date: "2026-05-12",
    ingested: { manifest: "newArtManifest.ts" }, family: "consolidated" },
  { key: "NEW_ART_2_destinations_overlays_sprites_ui.zip", sizeMb: 2500, date: "2026-05-12",
    ingested: { manifest: "newArtManifest.ts" }, family: "consolidated" },
  { key: "NEW_ART_3_fight_portraits.zip", sizeMb: 5900, date: "2026-05-12",
    ingested: { manifest: "newArtManifest.ts" }, family: "consolidated" },
  { key: "Videos/NEW_CUTSCENES_67.zip", sizeMb: 572, date: "2026-05-12",
    ingested: { manifest: "cinematicsManifest.ts" }, family: "cutscene" },
  { key: "AAA Final/DischordianSaga_GuildCutscenes_Complete.zip", sizeMb: 811, date: "2026-05-01",
    ingested: { manifest: "guildCutscenesManifest.ts" }, family: "cutscene" },
  { key: "cinematics_and_vfx.zip", sizeMb: 465, date: "2026-04-28",
    ingested: { manifest: "cinematicsManifest.ts" }, family: "cutscene" },
  { key: "tcg_card_art_651.zip", sizeMb: 4400, date: "2026-04-27",
    ingested: { manifest: "cardArtManifest" }, family: "card_art" },
  { key: "oracle-deck-aaa-assets.zip", sizeMb: 327, date: "2026-04-09",
    ingested: { manifest: "cardArtManifest (likely)" }, family: "card_art" },

  // ── UNPROCESSED ROOM STATE VARIANTS ──
  { key: "AAA Final/dischordian_room_state_art.zip", sizeMb: 51, date: "2026-04-20",
    convention: "flat_hyphen", family: "room_art" },
  { key: "AAA Final/dischordian_room_state_art (2).zip", sizeMb: 51, date: "2026-04-21",
    convention: "flat_hyphen", family: "room_art" }, // dedupe target

  // ── UNPROCESSED PRELUDE / TIER ROOMS ──
  { key: "AAA Final/prelude_rooms_missing_9.zip", sizeMb: 60, date: "2026-04-25",
    convention: "two_level_flat", family: "room_art" },
  { key: "AAA Final/inception_ark_room_tiers.zip", sizeMb: 5, date: "2026-04-26",
    convention: "two_level_flat", family: "room_art" },
  { key: "AAA Final/deliverables_room_rewrites.zip", sizeMb: 34, date: "2026-04-15",
    convention: "two_level_flat", family: "room_art" },

  // ── UNPROCESSED UNCLASSIFIED (could be room or other) ──
  { key: "AAA Final/dischordian_art_assets.zip", sizeMb: 507, date: "2026-05-19", family: "unknown" },
  { key: "AAA Final/dischordian_batch3_assets.zip", sizeMb: 32, date: "2026-05-19", family: "unknown" },
  { key: "AAA Final/mega_batch_101_assets.zip", sizeMb: 342, date: "2026-04-25", family: "unknown" },

  // ── UNPROCESSED CUTSCENES / VIDEO ──
  { key: "Videos/NEW_VIDEOS_200.zip", sizeMb: 1700, date: "2026-05-12", family: "cutscene" },
  { key: "Videos/OTHER_CUTSCENES.zip", sizeMb: 365, date: "2026-05-10", family: "cutscene" },
  { key: "Videos/awakening_cinematics.zip", sizeMb: 135, date: "2026-04-26", family: "cutscene" },
  { key: "Videos/FIGHT_INTROS_COMPLETE.zip", sizeMb: 1100, date: "2026-05-10", family: "cutscene" },
  { key: "Videos/CHESS_CUTSCENES_25.zip", sizeMb: 351, date: "2026-05-12", family: "cutscene" },
  { key: "Videos/GUILD_SIGNATURES.zip", sizeMb: 459, date: "2026-05-10", family: "cutscene" },
  { key: "Videos/dischordian_cutscene_assets.zip", sizeMb: 277, date: "2026-05-19", family: "cutscene" },
  { key: "AAA Final/prelude_vfx_overlays_webm.zip", sizeMb: 2, date: "2026-04-16", family: "vfx" },
  { key: "Videos/Veo Vid Archive 2.zip", sizeMb: 90, date: "2026-05-14", family: "vfx" },
  { key: "Videos/Veo Vid SIH 1.zip", sizeMb: 190, date: "2026-05-14", family: "vfx" },
  { key: "Videos/ORPHAN_POSTERS_VEO_3.zip", sizeMb: 23, date: "2026-05-12", family: "vfx" },
  { key: "Videos/Music & Stories.zip", sizeMb: 634, date: "2026-04-25", family: "cutscene" },
  { key: "Videos/Welcome to Celebration & Mechronis.zip", sizeMb: 735, date: "2026-05-08", family: "cutscene" },

  // ── UNPROCESSED PORTRAITS / CHARACTERS / SPRITES ──
  { key: "AAA Final/species_body_bases.zip", sizeMb: 5, date: "2026-05-22", family: "portrait" },
  { key: "AAA Final/Agent_Zero_Corrected.zip", sizeMb: 7, date: "2026-04-24", family: "portrait" },
  { key: "AAA Final/Minnie_Sprite_Sheets.zip", sizeMb: 2, date: "2026-04-24", family: "sprite" },
  { key: "4.12 Assets/cycle_b_opponent_portraits.zip", sizeMb: 45, date: "2026-04-12", family: "portrait" },
  { key: "nilmorg_dialogue_portraits.zip", sizeMb: 8, date: "2026-04-09", family: "portrait" },
  { key: "dischordian_saga_sprite_sheets.zip", sizeMb: 444, date: "2026-04-09", family: "sprite" },

  // ── UNPROCESSED VISEME SHEETS ──
  { key: "AAA Final/viseme_sheets_batch_19.zip", sizeMb: 74, date: "2026-04-24", family: "viseme" },
  { key: "AAA Final/viseme_hyper_shadow_tongue.zip", sizeMb: 3, date: "2026-04-24", family: "viseme" },
  { key: "AAA Final/Antiquarian_Viseme_Sheet.zip", sizeMb: 7, date: "2026-04-24", family: "viseme" },
  { key: "AAA Final/Elara_Viseme_Sheet.zip", sizeMb: 7, date: "2026-04-24", family: "viseme" },
  { key: "AAA Final/Locke_Viseme_Sheet.zip", sizeMb: 4, date: "2026-04-24", family: "viseme" },
  { key: "AAA Final/Source_Viseme_Sheet.zip", sizeMb: 5, date: "2026-04-24", family: "viseme" },

  // ── UNPROCESSED SUITS ──
  { key: "dischordian_all_18_suits.zip", sizeMb: 6400, date: "2026-04-21", family: "suit" },

  // ── UNPROCESSED ALBUM SLIDESHOWS ──
  { key: "Album Slide Show/AOP_Part1_T01-T05.zip", sizeMb: 671, date: "2026-04-30", family: "album_slideshow" },
  { key: "Album Slide Show/AOP_Part2_T06-T10.zip", sizeMb: 612, date: "2026-04-30", family: "album_slideshow" },
  { key: "Album Slide Show/AOP_Part3_T11-T15.zip", sizeMb: 616, date: "2026-04-30", family: "album_slideshow" },
  { key: "Album Slide Show/AOP_Part4_T16-T20.zip", sizeMb: 622, date: "2026-04-30", family: "album_slideshow" },
  { key: "Album Slide Show/Album_1_Age_of_Dischordian_Logic.zip", sizeMb: 3300, date: "2026-04-28", family: "album_slideshow" },
  { key: "Album Slide Show/Album_2_Age_of_Privacy.zip", sizeMb: 2200, date: "2026-04-30", family: "album_slideshow" },
  { key: "Album Slide Show/BOOK_OF_DANIEL_247_COMPLETE.zip", sizeMb: 3600, date: "2026-05-01", family: "album_slideshow" },
  { key: "Album Slide Show/SilenceInHeaven_Album6_Complete.zip", sizeMb: 3700, date: "2026-05-01", family: "album_slideshow" },
  { key: "Album Slide Show/WestByGod_Album5_Complete.zip", sizeMb: 1200, date: "2026-04-30", family: "album_slideshow" },

  // ── UNPROCESSED CONSOLIDATED / PRE-FINAL ──
  { key: "aaa_assets_complete.zip", sizeMb: 1100, date: "2026-04-27", family: "consolidated" },
  { key: "AAA Final/DischordianSaga_GameAssets_Complete.zip", sizeMb: 242, date: "2026-04-30", family: "consolidated" },
  { key: "AAA Final/dischordian_acts2_7_assets.zip", sizeMb: 995, date: "2026-04-23", family: "consolidated" },
  { key: "AAA Final/the_dischordian_aaa_assets.zip", sizeMb: 136, date: "2026-04-21", family: "consolidated" },
  { key: "AAA Final/unified_act1_merged_remake.zip", sizeMb: 513, date: "2026-04-19", family: "consolidated" },
  { key: "Dischordian_Saga_Prelude_Act1_Assets.zip", sizeMb: 754, date: "2026-04-24", family: "consolidated" },
  { key: "dischordian_aaa_game_design_assets.zip", sizeMb: 344, date: "2026-04-13", family: "consolidated" },
  { key: "AAA Final/prelude_asset_build_no_vo.zip", sizeMb: 205, date: "2026-04-15", family: "consolidated" },
  { key: "AAA Final/Ark1047_AAA_Assets.zip", sizeMb: 30, date: "2026-04-24", family: "consolidated" },

  // ── UNPROCESSED OTHER ──
  { key: "AAA Final/Master of Rlyeh.zip", sizeMb: 2, date: "2026-05-22", family: "unknown" },
  { key: "AAA Final/New_Sectors_3.zip", sizeMb: 21, date: "2026-04-24", family: "unknown" },
  { key: "AAA Final/Trade_Empire_Art_Assets.zip", sizeMb: 402, date: "2026-04-24", family: "consolidated" },
  { key: "AAA Final/actx_aaa_ui_assets.zip", sizeMb: 16, date: "2026-04-20", family: "ui_atlas" },
  { key: "AAA Final/corrected_assets_batch.zip", sizeMb: 9, date: "2026-04-24", family: "unknown" },
  { key: "AAA Final/corrected_assets_batch2.zip", sizeMb: 14, date: "2026-04-24", family: "unknown" },
  { key: "AAA Final/Dischordia Songs.zip", sizeMb: 156, date: "2026-04-16", family: "unknown" },
  { key: "AAA Final/last_words_only.zip", sizeMb: 21, date: "2026-04-16", family: "unknown" },
  { key: "AAA Final/last_words_tease_afro_remake.zip", sizeMb: 30, date: "2026-04-17", family: "unknown" },
  { key: "Music/Saga Theme Music.zip", sizeMb: 23, date: "2026-05-08", family: "unknown" },
  { key: "page_backgrounds_assets.zip", sizeMb: 6, date: "2026-04-09", family: "ui_atlas" },
  { key: "lore_gallery_assets.zip", sizeMb: 13, date: "2026-04-09", family: "ui_atlas" },
  { key: "casino_art_bible_assets.zip", sizeMb: 763, date: "2026-04-09", family: "consolidated" },
  { key: "optional_components_assets.zip", sizeMb: 376, date: "2026-04-09", family: "consolidated" },
  { key: "player_cabin_art_assets.zip", sizeMb: 256, date: "2026-04-09", family: "ui_atlas" },
  { key: "degen_remade_assets.zip", sizeMb: 75, date: "2026-04-09", family: "ui_atlas" },
  { key: "CADES_FPS_Assets.zip", sizeMb: 190, date: "2026-04-09", family: "unknown" },

  // ── UNPROCESSED PREDECESSOR / SUSPECT ──
  { key: "NanoBanna2_Art_Assets_112.zip", sizeMb: 527, date: "2026-04-09", family: "predecessor" },
  { key: "nanobanna2_game_assets.zip", sizeMb: 107, date: "2026-04-09", family: "predecessor" },
  { key: "dmc_game_assets.zip", sizeMb: 134, date: "2026-04-09", family: "predecessor" },
  { key: "Collectors Arena/seedance2_game_assets.zip", sizeMb: 144, date: "2026-04-10", family: "predecessor" },
  { key: "4.12 Assets/dischordian_generated_art_pack_final_34.zip", sizeMb: 243, date: "2026-04-12", family: "consolidated" },
  { key: "4.12 Assets/dischordian_saga_aaa_assets.zip", sizeMb: 76, date: "2026-04-12", family: "consolidated" },
  { key: "4.12 Assets/scifi_game_art_assets.zip", sizeMb: 21, date: "2026-04-12", family: "predecessor" },
  { key: "4.12 Assets/the_dischordian_saga_aaa_game_assets.zip", sizeMb: 494, date: "2026-04-12", family: "consolidated" },

  // ── SKIPPED — _masters/ duplicates ──
  { key: "_masters/4.12 Assets/Silence in Heaven Finished/Since in Heaven.zip", sizeMb: 1800, date: "2026-05-22",
    skip: "master archive duplicate (Silence in Heaven album)", family: "album_slideshow" },
  { key: "_masters/Album Slide Show/Dischordian Logic 1-9.zip", sizeMb: 544, date: "2026-05-22",
    skip: "master archive duplicate (Dischordian Logic album)", family: "album_slideshow" },
  { key: "_masters/Music/Silence in Heaven Complete.zip", sizeMb: 1800, date: "2026-05-22",
    skip: "master archive duplicate (Silence in Heaven album)", family: "album_slideshow" },
  { key: "_masters/Silence_in_Heaven_asset_set.zip", sizeMb: 608, date: "2026-05-22",
    skip: "master archive duplicate (Silence in Heaven album, lower-res)", family: "album_slideshow" },
];

/* ─── Gap collection (mirrors apps/scripts/audit-art-ratchet-gaps.ts) ─── */

interface Gap {
  ratchet: string;
  relPath: string;
  zipDir: string;
}

function collectAxisGaps(
  ratchetId: string,
  axis: "tv" | "cycle" | "faction",
  states: readonly string[],
): Gap[] {
  const entries = roomArtByAxis(axis);
  const rooms = new Set(entries.map(e => e.zipDir));
  const out: Gap[] = [];
  for (const zipDir of rooms) {
    for (const state of states) {
      if (roomArtStateUrl(zipDir, axis, state)) continue;
      out.push({
        ratchet: ratchetId,
        relPath: `art/rooms/${zipDir}/state_${axis}_${state}.png`,
        zipDir,
      });
    }
  }
  return out;
}

function collectRoomAssetGaps(): Gap[] {
  const report = roomArtCoverageReport();
  const out: Gap[] = [];
  for (const hb of report.deferredHellboxes) {
    const zipDir = hb.replace(/^[a-z_]+\./, "");
    out.push({ ratchet: "art.room_asset_coverage", relPath: `art/rooms/${zipDir}/baseline.png`, zipDir });
  }
  for (const v of report.deferredVehicles) {
    const zipDir = v.replace(/^[a-z_]+\./, "");
    out.push({ ratchet: "art.room_asset_coverage", relPath: `art/rooms/${zipDir}/baseline.png`, zipDir });
  }
  return out;
}

function collectAllGaps(): Gap[] {
  return [
    ...collectRoomAssetGaps(),
    ...collectAxisGaps("art.axis9_state_coverage", "tv", ["clean", "exposed", "spreading", "corrupted", "quarantined"]),
    ...collectAxisGaps("art.axis11_state_coverage", "cycle", ["dawn", "midday", "dusk", "nightwatch", "longnight"]),
    ...collectAxisGaps("art.axis12_state_coverage", "faction", ["none", "hierarchy", "dreamers", "pureflame", "insurgency", "panopticon", "collectors", "multi"]),
  ];
}

/* ─── ZIP download + listing ─── */

function sanitiseKey(key: string): string {
  return key.replace(/[/\s\\]/g, "_");
}

async function downloadZip(
  row: ZipRow,
  client: S3Client,
  GetObjectCmd: new (input: { Bucket: string; Key: string }) => unknown,
): Promise<string> {
  const localPath = join(tmpdir(), sanitiseKey(row.key));
  if (existsSync(localPath)) {
    const size = statSync(localPath).size;
    if (size > 0) {
      console.log(`  cached: ${row.key}  (${(size / 1024 / 1024).toFixed(0)} MB)`);
      return localPath;
    }
  }
  console.log(`  downloading: ${row.key}  (${row.sizeMb} MB)`);
  const started = Date.now();
  const cmd = new GetObjectCmd({ Bucket: BUCKET, Key: row.key });
  const res = await (client as unknown as { send: (c: unknown) => Promise<{ Body?: Readable }> }).send(cmd);
  const body = res.Body;
  if (!body) throw new Error(`Empty body for s3://${BUCKET}/${row.key}`);
  await pipeline(body, createWriteStream(localPath));
  const size = statSync(localPath).size;
  console.log(`    done in ${((Date.now() - started) / 1000).toFixed(0)}s (${(size / 1024 / 1024).toFixed(0)} MB)`);
  return localPath;
}

function listZipEntries(localPath: string): string[] {
  try {
    const out = execFileSync("unzip", ["-l", localPath], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    const lines = out.split("\n");
    const files: string[] = [];
    for (const ln of lines) {
      const m = ln.match(/^\s*\d+\s+\d{2,4}-\d{2}-\d{2,4}\s+\d{2}:\d{2}\s+(.+)$/);
      if (!m) continue;
      const path = m[1].trim();
      if (!path || path.endsWith("/")) continue;
      files.push(path);
    }
    return files;
  } catch (err) {
    console.error(`  ERROR listing ${localPath}:`, (err as Error).message);
    return [];
  }
}

/** Stream-hash a local file (md5). Used for dupe detection across
 *  the `dischordian_room_state_art.zip` / `(2)` pair. */
async function md5File(path: string): Promise<string> {
  return new Promise(resolve => {
    const hash = createHash("md5");
    const stream = createReadStream(path);
    stream.on("data", c => hash.update(c));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", () => resolve(""));
  });
}

/* ─── Audit + reporting ─── */

interface ZipReport {
  key: string;
  sizeMb: number;
  family?: string;
  status: "INGESTED" | "SKIPPED" | "PROBED" | "ERROR";
  reason?: string;
  entries: number;
  md5?: string;
  dupeOf?: string;
  conventionId: string | null;
  matches: Record<string, number>;
  contentClasses: Record<string, number>;
  samplePaths: string[];
}

function summariseContentClasses(entries: readonly string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of entries) {
    const extMatch = e.match(/\.([a-z0-9]+)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : "<no-ext>";
    const topDir = e.includes("/") ? e.split("/")[0] : "<root>";
    const key = `${ext}@${topDir}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

async function auditRow(
  row: ZipRow,
  gapByRelPath: Map<string, Gap>,
  client: S3Client,
  GetObjectCmd: new (input: { Bucket: string; Key: string }) => unknown,
  skipIngested: boolean,
  md5ToFirstKey: Map<string, string>,
): Promise<ZipReport> {
  const base: ZipReport = {
    key: row.key,
    sizeMb: row.sizeMb,
    family: row.family,
    status: "PROBED",
    entries: 0,
    conventionId: getConventionForZip(row.key)?.id ?? null,
    matches: {},
    contentClasses: {},
    samplePaths: [],
  };

  if (row.skip) {
    return { ...base, status: "SKIPPED", reason: row.skip };
  }
  if (row.ingested && skipIngested) {
    return { ...base, status: "INGESTED", reason: `manifest=${row.ingested.manifest}${row.ingested.pass ? " pass=" + row.ingested.pass : ""}` };
  }

  let localPath: string;
  try {
    localPath = await downloadZip(row, client, GetObjectCmd);
  } catch (err) {
    return { ...base, status: "ERROR", reason: `download failed: ${(err as Error).message}` };
  }

  const md5 = await md5File(localPath);
  if (md5) {
    const first = md5ToFirstKey.get(md5);
    if (first && first !== row.key) {
      return { ...base, status: "SKIPPED", md5, dupeOf: first, reason: `byte-identical to ${first}` };
    }
    md5ToFirstKey.set(md5, row.key);
  }

  const entries = listZipEntries(localPath);
  base.entries = entries.length;
  base.md5 = md5;
  base.contentClasses = summariseContentClasses(entries);
  base.samplePaths = entries.slice(0, 8);

  const matchedRelPaths = new Set<string>();
  for (const entry of entries) {
    const parsed = parseProducerFilename(row.key, entry);
    if (!parsed) continue;
    const gap = gapByRelPath.get(parsed.canonicalRelPath);
    if (!gap || matchedRelPaths.has(gap.relPath)) continue;
    matchedRelPaths.add(gap.relPath);
    base.matches[gap.ratchet] = (base.matches[gap.ratchet] ?? 0) + 1;
  }
  return base;
}

/* ─── Main ─── */

async function main() {
  const args = process.argv.slice(2);
  const skipIngested = args.includes("--skip-ingested");
  const reportPath = args.find(a => a.startsWith("--report="))?.split("=")[1];
  const pattern = args.find(a => a.startsWith("--pattern="))?.split("=")[1];

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("ERROR: AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY required.");
    process.exit(2);
  }

  const gaps = collectAllGaps();
  const gapByRelPath = new Map(gaps.map(g => [g.relPath, g]));
  const totalsByRatchet: Record<string, number> = {};
  for (const g of gaps) {
    totalsByRatchet[g.ratchet] = (totalsByRatchet[g.ratchet] ?? 0) + 1;
  }

  console.log(`Gap totals:`);
  for (const [r, c] of Object.entries(totalsByRatchet)) console.log(`  ${r.padEnd(35)} ${c}`);
  console.log(`Manifest rooms in scope: ${new Set(ROOM_ART_ENTRIES.map(e => e.zipDir)).size}`);

  const inventory = pattern
    ? ZIP_INVENTORY.filter(r => r.key.toLowerCase().includes(pattern.toLowerCase()))
    : ZIP_INVENTORY;
  console.log(`\nProbing ${inventory.length} ZIPs (${skipIngested ? "skipping" : "including"} ingested; concurrency ${CONCURRENCY})…\n`);

  const client = new S3Client({ region: REGION });
  const GetObjectCmd = await loadGetObjectCommand();
  const md5ToFirstKey = new Map<string, string>();

  // Serial through the queue but with N workers pulling from a cursor.
  const reports: ZipReport[] = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < inventory.length) {
        const idx = cursor++;
        const row = inventory[idx];
        const r = await auditRow(row, gapByRelPath, client, GetObjectCmd, skipIngested, md5ToFirstKey);
        reports.push(r);
        const matchSum = Object.values(r.matches).reduce((a, b) => a + b, 0);
        const tag = r.status === "PROBED" ? `${matchSum} matches` : r.status;
        console.log(`  [${reports.length}/${inventory.length}] ${row.key.padEnd(60)} ${tag}`);
      }
    }),
  );

  // ── Summary ──
  reports.sort((a, b) => a.key.localeCompare(b.key));

  const totalUniqueGapsClosed = new Set<string>();
  const closeableByRatchet: Record<string, Set<string>> = {};
  for (const r of reports) {
    if (r.status !== "PROBED") continue;
    // The per-ZIP `matches` only counts gaps the ZIP would close;
    // sum across ZIPs is the "any ZIP closes it" union.
    for (const [, count] of Object.entries(r.matches)) void count;
  }

  // Re-walk to count unique gaps across all ZIPs (the per-ZIP report
  // already deduped within a single ZIP; we need cross-ZIP dedupe).
  // Cheap: scan each ZIP again from cached files.
  console.log(`\n══════════════════════════════════════════════════════════════`);
  console.log(`PER-ZIP SUMMARY`);
  console.log(`══════════════════════════════════════════════════════════════\n`);

  const byStatus: Record<string, ZipReport[]> = {};
  for (const r of reports) {
    (byStatus[r.status] ??= []).push(r);
  }

  for (const status of ["INGESTED", "SKIPPED", "ERROR", "PROBED"]) {
    const list = byStatus[status] ?? [];
    if (list.length === 0) continue;
    console.log(`${status} — ${list.length}`);
    for (const r of list) {
      const matchSum = Object.values(r.matches).reduce((a, b) => a + b, 0);
      const tag = status === "PROBED"
        ? `(${r.entries} entries, ${matchSum} gaps closeable, family=${r.family ?? "?"})`
        : r.reason ?? "";
      console.log(`  ${r.key.padEnd(60)} ${tag}`);
    }
    console.log();
  }

  // ── Closeable-gap union by ratchet ──
  const closeableUnion = new Map<string, Set<string>>();
  const probed = byStatus["PROBED"] ?? [];
  for (const r of probed) {
    // The per-ZIP record loses individual relPaths. We have to
    // re-scan from cache to know which exact paths each ZIP covers.
    // To stay fast, only re-scan ZIPs that had ≥1 match.
    if (Object.values(r.matches).reduce((a, b) => a + b, 0) === 0) continue;
    const localPath = join(tmpdir(), sanitiseKey(r.key));
    if (!existsSync(localPath)) continue;
    const entries = listZipEntries(localPath);
    for (const entry of entries) {
      const parsed = parseProducerFilename(r.key, entry);
      if (!parsed) continue;
      const gap = gapByRelPath.get(parsed.canonicalRelPath);
      if (!gap) continue;
      let set = closeableUnion.get(gap.ratchet);
      if (!set) { set = new Set(); closeableUnion.set(gap.ratchet, set); }
      set.add(gap.relPath);
    }
  }

  console.log(`══════════════════════════════════════════════════════════════`);
  console.log(`COMBINED GAP CLOSURE (any ZIP closes the gap)`);
  console.log(`══════════════════════════════════════════════════════════════`);
  let unionTotal = 0;
  for (const [r, c] of Object.entries(totalsByRatchet)) {
    const closeable = closeableUnion.get(r)?.size ?? 0;
    unionTotal += closeable;
    const pct = c > 0 ? ((closeable / c) * 100).toFixed(1) : "0";
    console.log(`  ${r.padEnd(35)} ${closeable} / ${c}  (${pct}%)`);
  }
  console.log(`  ${"TOTAL".padEnd(35)} ${unionTotal} / ${gaps.length}`);

  if (reportPath) {
    writeFileSync(reportPath, JSON.stringify({ generated_at: new Date().toISOString(), gaps_total: gaps.length, totals_by_ratchet: totalsByRatchet, closeable_by_ratchet: Object.fromEntries(Array.from(closeableUnion.entries()).map(([k, v]) => [k, [...v].sort()])), reports }, null, 2));
    console.log(`\nFull JSON report written to ${reportPath}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
