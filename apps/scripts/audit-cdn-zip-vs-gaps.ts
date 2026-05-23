#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   AUDIT CDN ZIP vs RATCHET GAPS

   Given the name of a producer ZIP on s3://dgrsart/, this script:

     1. Downloads it (caches to /tmp on subsequent runs)
     2. Lists the entries inside
     3. Cross-references each entry against the missing-art
        paths the four ratcheted art coverage checks report
     4. Reports how many gaps the ZIP would close if ingested

   Useful when triaging which producer drops have already been
   absorbed into roomArtManifest.data.ts vs which still have
   uningested art that would close axis 9/11/12 / room-asset gaps
   mechanically (no new commissions needed).

   Usage:
     pnpm art:audit-zip "AAA Final/dischordian_room_state_art.zip"
     pnpm art:audit-zip "AAA Final/prelude_rooms_missing_9.zip"
     # Multiple at once:
     pnpm art:audit-zip "ZIP1" "ZIP2" "ZIP3"

   Default target when no args given:
     "AAA Final/dischordian_room_state_art.zip"  — strongly
     suspected to contain the axis 9/11/12 state variants that
     are missing from the manifest today.

   Requires AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in env
   (the bucket root is private — only cdn/client-public/* is
   publicly readable). Region defaults to us-east-2.

   Cached downloads live at /tmp/<sanitised-key>.zip; delete
   /tmp/*.zip to force re-download.
   ═══════════════════════════════════════════════════════ */

import { S3Client } from "@aws-sdk/client-s3";
// GetObjectCommand is exported from the package at runtime but the
// re-export chain in @aws-sdk/client-s3@3.1033 trips a TS2724
// "no exported member" under `tsc --noEmit` in this tree. The
// PutObjectCommand / HeadObjectCommand exports resolve fine (used
// in apps/scripts/upload-trade-empire-art.ts), so the resolver works
// for SOME commands but not others — looks like a known
// dist-types index drift. Dynamic-import sidesteps the static-typed
// re-export entirely; we narrow the runtime type ourselves.
async function loadGetObjectCommand(): Promise<new (input: { Bucket: string; Key: string }) => unknown> {
  // The package's dist-types/index.d.ts in 3.1033.0 doesn't list
  // GetObjectCommand among its re-exports, but the runtime *does*
  // ship it. Double-cast through `unknown` to bypass the broken
  // shipped types.
  const mod = (await import("@aws-sdk/client-s3")) as unknown as {
    GetObjectCommand: new (input: { Bucket: string; Key: string }) => unknown;
  };
  return mod.GetObjectCommand;
}
import { execFileSync } from "node:child_process";
import { createWriteStream, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import type { Readable } from "node:stream";

import { parseProducerFilename } from "./_phase_h/_filename_normalisers";

import {
  ROOM_ART_ENTRIES,
  roomArtByAxis,
  roomArtCoverageReport,
  roomArtStateUrl,
} from "../shared/expansionArt/roomArtManifest";

const BUCKET = "dgrsart";
const REGION = process.env.AWS_REGION || "us-east-2";

// ─── Gap collection (mirrors apps/scripts/audit-art-ratchet-gaps.ts) ───

interface Gap {
  ratchet: string;
  relPath: string; // e.g. "art/rooms/cryo_bay/state_tv_clean.png"
  label: string;
  zipDir: string;
  filename: string; // basename only — e.g. "state_tv_clean.png"
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
      const filename = `state_${axis}_${state}.png`;
      out.push({
        ratchet: ratchetId,
        relPath: `art/rooms/${zipDir}/${filename}`,
        label: `${zipDir} × ${axis}_${state}`,
        zipDir,
        filename,
      });
    }
  }
  return out;
}

function collectRoomAssetGaps(): Gap[] {
  const report = roomArtCoverageReport();
  const out: Gap[] = [];
  const candidates = [
    ...report.deferredHellboxes.map(hb => ({ canonical: hb, kind: "hellbox" })),
    ...report.deferredVehicles.map(v => ({ canonical: v, kind: "vehicle" })),
  ];
  for (const c of candidates) {
    const zipDir = c.canonical.replace(/^[a-z_]+\./, "");
    out.push({
      ratchet: "art.room_asset_coverage",
      relPath: `art/rooms/${zipDir}/baseline.png`,
      label: `${c.kind}: ${c.canonical}`,
      zipDir,
      filename: "baseline.png",
    });
  }
  return out;
}

function collectAllGaps(): Gap[] {
  return [
    ...collectRoomAssetGaps(),
    ...collectAxisGaps("art.axis9_state_coverage",  "tv",      ["clean", "exposed", "spreading", "corrupted", "quarantined"]),
    ...collectAxisGaps("art.axis11_state_coverage", "cycle",   ["dawn", "midday", "dusk", "nightwatch", "longnight"]),
    ...collectAxisGaps("art.axis12_state_coverage", "faction", ["none", "hierarchy", "dreamers", "pureflame", "insurgency", "panopticon", "collectors", "multi"]),
  ];
}

// ─── ZIP download + listing ────────────────────────────────────

function sanitiseKey(key: string): string {
  return key.replace(/[/\s\\]/g, "_");
}

async function downloadZip(
  key: string,
  client: S3Client,
  GetObjectCmd: new (input: { Bucket: string; Key: string }) => unknown,
): Promise<string> {
  const localPath = join(tmpdir(), sanitiseKey(key));
  if (existsSync(localPath)) {
    const size = statSync(localPath).size;
    console.log(`  cached: ${localPath}  (${(size / 1024 / 1024).toFixed(1)} MB)`);
    return localPath;
  }
  console.log(`  downloading s3://${BUCKET}/${key}  →  ${localPath}`);
  const started = Date.now();
  const cmd = new GetObjectCmd({ Bucket: BUCKET, Key: key });
  // The runtime type is GetObjectCommand; send() returns
  // GetObjectCommandOutput whose `Body` is a Readable on Node.
  const res = await (client as unknown as { send: (c: unknown) => Promise<{ Body?: Readable }> }).send(cmd);
  const body = res.Body;
  if (!body) throw new Error(`Empty body for s3://${BUCKET}/${key}`);
  await pipeline(body, createWriteStream(localPath));
  const size = statSync(localPath).size;
  console.log(`    ${(size / 1024 / 1024).toFixed(1)} MB in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  return localPath;
}

/** Use `unzip -l` to list contents without extracting. Returns
 *  relative paths only — directory entries filtered out. */
function listZipEntries(localPath: string): string[] {
  const out = execFileSync("unzip", ["-l", localPath], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  const lines = out.split("\n");
  const files: string[] = [];
  for (const ln of lines) {
    // unzip -l format:
    //   Length      Date    Time    Name
    //   ---------  ---------- -----   ----
    //         123  04-20-2026 12:34   path/to/file.png
    //   ---------                     -------
    //         123                     1 file
    const m = ln.match(/^\s*\d+\s+\d{2,4}-\d{2}-\d{2,4}\s+\d{2}:\d{2}\s+(.+)$/);
    if (!m) continue;
    const path = m[1].trim();
    if (!path || path.endsWith("/")) continue; // directory entry
    files.push(path);
  }
  return files;
}

// ─── Matching ──────────────────────────────────────────────────

/** Given a path inside a ZIP, generate plausible CDN-relative
 *  candidate paths (`art/rooms/<zipDir>/<filename>`) to test
 *  against the gap set. Handles common producer layouts:
 *
 *    rooms/cryo_bay/state_tv_clean.png
 *    cryo_bay/state_tv_clean.png
 *    deliverables/rooms/cryo_bay/state_tv_clean.png
 *    cryo_bay_state_tv_clean.png          (flat with concatenated id)
 *    state_tv_clean.png                    (flat, room from caller — we skip these)
 */
function generateCandidates(zipEntry: string, zipKey?: string): string[] {
  const out: string[] = [];
  // 1. Producer-pack normaliser. The shared registry in
  //    apps/scripts/_phase_h/_filename_normalisers.ts knows the
  //    file-naming convention for each ZIP family and emits the
  //    canonical relPath directly. This is the right answer for
  //    every ZIP we've registered a convention for.
  if (zipKey) {
    const parsed = parseProducerFilename(zipKey, zipEntry);
    if (parsed) out.push(parsed.canonicalRelPath);
  }
  // 2. Already CDN-shaped: starts with "art/"
  if (zipEntry.startsWith("art/")) out.push(zipEntry);
  // 3. Last two components: <room>/<file>
  const parts = zipEntry.split("/").filter(p => p.length > 0);
  if (parts.length >= 2) {
    const tail = parts.slice(-2).join("/");
    out.push(`art/rooms/${tail}`);
  }
  // 4. Strip leading "rooms/" prefix if present
  if (zipEntry.startsWith("rooms/")) {
    out.push(`art/${zipEntry}`);
  }
  return out;
}

interface Match {
  zipEntry: string;
  gap: Gap;
}

async function auditZip(
  key: string,
  client: S3Client,
  GetObjectCmd: new (input: { Bucket: string; Key: string }) => unknown,
  gapByRelPath: Map<string, Gap>,
): Promise<{ key: string; entries: string[]; matches: Match[]; unmatched: string[] }> {
  console.log(`\n── ${key}`);
  const local = await downloadZip(key, client, GetObjectCmd);
  const entries = listZipEntries(local);
  console.log(`  entries: ${entries.length}`);

  const matches: Match[] = [];
  const matchedRelPaths = new Set<string>();
  const unmatched: string[] = [];

  for (const entry of entries) {
    const candidates = generateCandidates(entry, key);
    let hit: Gap | undefined;
    for (const c of candidates) {
      const g = gapByRelPath.get(c);
      if (g) { hit = g; break; }
    }
    if (hit) {
      // Don't double-count: if the same gap was already matched by
      // an earlier ZIP entry, skip (otherwise the closure count
      // becomes a "hits" count rather than a "gaps closeable" count).
      if (!matchedRelPaths.has(hit.relPath)) {
        matches.push({ zipEntry: entry, gap: hit });
        matchedRelPaths.add(hit.relPath);
      }
    } else {
      unmatched.push(entry);
    }
  }

  return { key, entries, matches, unmatched };
}

// ─── Main ──────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const zipKeys = args.length > 0 ? args : ["AAA Final/dischordian_room_state_art.zip"];

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("ERROR: AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY required.");
    console.error("The dgrsart bucket root is private; HEAD on public prefix won't help here.");
    process.exit(2);
  }

  const gaps = collectAllGaps();
  const gapByRelPath = new Map(gaps.map(g => [g.relPath, g]));
  console.log(`Gap set: ${gaps.length} missing paths`);
  console.log(`  art.room_asset_coverage:   ${gaps.filter(g => g.ratchet === "art.room_asset_coverage").length}`);
  console.log(`  art.axis9_state_coverage:  ${gaps.filter(g => g.ratchet === "art.axis9_state_coverage").length}`);
  console.log(`  art.axis11_state_coverage: ${gaps.filter(g => g.ratchet === "art.axis11_state_coverage").length}`);
  console.log(`  art.axis12_state_coverage: ${gaps.filter(g => g.ratchet === "art.axis12_state_coverage").length}`);
  console.log(`Manifest rooms in scope:  ${new Set(ROOM_ART_ENTRIES.map(e => e.zipDir)).size}`);

  const client = new S3Client({ region: REGION });
  const GetObjectCmd = await loadGetObjectCommand();
  const reports = [];
  for (const key of zipKeys) {
    reports.push(await auditZip(key, client, GetObjectCmd, gapByRelPath));
  }

  // ── Per-ZIP report ─────────────────────────────────────────
  console.log(`\n══════════════════════════════════════════════════════════════`);
  console.log(`PER-ZIP RESULTS`);
  console.log(`══════════════════════════════════════════════════════════════`);
  for (const r of reports) {
    const closeable = r.matches.length;
    const pct = gaps.length > 0 ? ((closeable / gaps.length) * 100).toFixed(1) : "0";
    console.log(`\n${r.key}`);
    console.log(`  entries:          ${r.entries.length}`);
    console.log(`  gaps closeable:   ${closeable}  (${pct}% of total gap)`);
    if (r.matches.length > 0) {
      const byRatchet = new Map<string, number>();
      for (const m of r.matches) {
        byRatchet.set(m.gap.ratchet, (byRatchet.get(m.gap.ratchet) ?? 0) + 1);
      }
      console.log(`  breakdown by ratchet:`);
      for (const [rat, count] of [...byRatchet.entries()].sort()) {
        const totalForRatchet = gaps.filter(g => g.ratchet === rat).length;
        console.log(`    ${rat.padEnd(35)} ${count} / ${totalForRatchet}`);
      }
      console.log(`  sample matches (first 8):`);
      for (const m of r.matches.slice(0, 8)) {
        console.log(`    ${m.zipEntry}`);
        console.log(`      → ${m.gap.label}`);
      }
      if (r.matches.length > 8) console.log(`    … and ${r.matches.length - 8} more`);
    } else {
      console.log(`  no overlap with current gap set — this ZIP doesn't close any of the four art ratchets.`);
    }
    if (r.unmatched.length > 0 && r.matches.length > 0) {
      const otherArt = r.unmatched.filter(e => /\.(png|webp|jpg|jpeg)$/i.test(e)).length;
      console.log(`  unmatched art entries (would land in OTHER bins or be redundant): ${otherArt}`);
    }
  }

  // ── Cross-ZIP coverage ─────────────────────────────────────
  if (reports.length > 1) {
    const allMatched = new Set<string>();
    for (const r of reports) for (const m of r.matches) allMatched.add(m.gap.relPath);
    console.log(`\n══════════════════════════════════════════════════════════════`);
    console.log(`COMBINED COVERAGE (all ZIPs above)`);
    console.log(`══════════════════════════════════════════════════════════════`);
    console.log(`  unique gaps closeable across all ZIPs: ${allMatched.size} / ${gaps.length}  (${(allMatched.size / gaps.length * 100).toFixed(1)}%)`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
