#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   AUDIT ART RATCHET GAPS AGAINST CDN

   For each art-related ship:check ratchet that currently
   reports a non-zero gap, compute the expected CDN URL for
   every missing item and HEAD-check whether the asset is
   actually present on the dgrsart CDN.

   Three buckets in the report:

     • FOUND_ON_CDN — the manifest is the only thing missing
                       (a producer drop landed art under the
                       expected path but no one ran the ingest
                       pipeline to add the entries). These
                       close the gap mechanically once the
                       manifest is regenerated.

     • MISSING      — genuinely not on the CDN. Producer art
                       still needs to be commissioned, rendered,
                       or uploaded.

     • KNOWN_ZIPS   — best-effort list of producer-delivered
                       ZIPs referenced from the codebase or the
                       GHA workflows. The bucket root isn't
                       publicly listable, so this surfaces names
                       only; user must run `aws s3 ls
                       s3://dgrsart/` with creds to confirm.

   The four ratcheted art checks the script walks:
     1. art.room_asset_coverage   (24 gap — missing baselines)
     2. art.axis9_state_coverage  (192 gap — tv-* state variants)
     3. art.axis11_state_coverage (120 gap — cycle-* phase variants)
     4. art.axis12_state_coverage (321 gap — faction-* livery variants)

   Total HEAD checks: ~657 — fast with concurrency 16.
   Public-bucket policy means no AWS creds required.
   ═══════════════════════════════════════════════════════ */

import { request as httpsRequest } from "node:https";
import { URL } from "node:url";

import { roomArtByAxis, roomArtBaselineUrl, roomArtStateUrl, ROOM_ART_ENTRIES, ROOM_ART_ZIP_TO_CANONICAL } from "../shared/expansionArt/roomArtManifest";
import { roomArtCoverageReport } from "../shared/expansionArt/roomArtManifest";

const PUBLIC_BASE = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public";
const CONCURRENCY = 16;

interface Gap {
  ratchet: string;
  /** Manifest-relative key (e.g. `art/rooms/cryo_bay/state_tv_clean.png`). */
  relPath: string;
  /** Human-readable label. */
  label: string;
}

interface HeadResult extends Gap {
  status: number;
  /** True iff the CDN currently serves this asset (2xx response). */
  found: boolean;
}

async function head(url: string): Promise<{ status: number }> {
  return new Promise(resolve => {
    const u = new URL(url);
    const req = httpsRequest(
      {
        method: "HEAD",
        host: u.host,
        path: u.pathname + u.search,
        timeout: 10_000,
      },
      res => {
        resolve({ status: res.statusCode ?? 0 });
        res.resume();
      },
    );
    req.on("error", () => resolve({ status: 0 }));
    req.on("timeout", () => { req.destroy(); resolve({ status: 0 }); });
    req.end();
  });
}

/** Walk art.room_asset_coverage — the 24 deferred rooms with no
 *  baseline.png entry. Their canonical CDN path follows the same
 *  pattern as delivered rooms: art/rooms/<zipDir>/baseline.png. We
 *  derive the candidate zipDir from the canonical space_id by
 *  stripping the section prefix (`ark.`, `hb.`, etc.). */
function collectRoomAssetGap(): Gap[] {
  const report = roomArtCoverageReport();
  const candidates: { label: string; canonical: string }[] = [];
  for (const hb of report.deferredHellboxes) {
    candidates.push({ label: `hellbox: ${hb}`, canonical: hb });
  }
  for (const v of report.deferredVehicles) {
    candidates.push({ label: `vehicle: ${v}`, canonical: v });
  }
  // The destinations + apprentice deferrals are summarised. We don't
  // have a per-id list for them in the manifest, so we surface that
  // bucket as a single advisory row rather than fabricating paths.
  // (When the producer ingest pipeline runs again, those entries
  // would land in the manifest if the art exists.)
  const out: Gap[] = [];
  for (const c of candidates) {
    // Strip the section prefix to get the zipDir slug:
    //   "hb.editors_workshop" → "editors_workshop"
    //   "veh.kestrel_drop_pod" → "kestrel_drop_pod"
    const zipDir = c.canonical.replace(/^[a-z_]+\./, "");
    out.push({
      ratchet: "art.room_asset_coverage",
      relPath: `art/rooms/${zipDir}/baseline.png`,
      label: c.label,
    });
  }
  return out;
}

/** Walk one state-axis ratchet. Mirrors the in-tree checker logic
 *  (apps/shared/_completeness/checks/axis{9,11,12}StateCoverage.ts)
 *  but does not truncate the missing list. */
function collectAxisGap(
  ratchetId: string,
  axis: "tv" | "cycle" | "faction",
  states: readonly string[],
): Gap[] {
  const entries = roomArtByAxis(axis);
  const roomsWithAxis = new Set(entries.map(e => e.zipDir));
  const out: Gap[] = [];
  for (const zipDir of roomsWithAxis) {
    for (const state of states) {
      const url = roomArtStateUrl(zipDir, axis, state);
      if (url) continue; // already in the manifest
      out.push({
        ratchet: ratchetId,
        relPath: `art/rooms/${zipDir}/state_${axis}_${state}.png`,
        label: `${zipDir} × ${axis}_${state}`,
      });
    }
  }
  return out;
}

/** Producer-supplied ZIP names referenced from the codebase or GHA
 *  workflows. The bucket root isn't publicly listable; the user can
 *  confirm presence with `aws s3 ls s3://dgrsart/` (with creds). */
function knownZips(): string[] {
  return [
    "AAA Final/Ark1047_AAA_Assets.zip",     // .github/workflows/ark-rooms-art-upload.yml
    "rooms_complete_library.zip",            // referenced by roomArtManifest.data.ts header (H.A ingest)
    "final_22_rooms.zip",                    // H1.A ingest pass
    "NEW_ROOMS_82.zip",                      // H2.A ingest pass
    "NEW_CUTSCENES_67.zip",                  // 2026-05-12 producer drop, registry.ts:811
    "NEW_ART_1.zip",                         // 2026-05-12, registry.ts:822
    "NEW_ART_2.zip",                         // 2026-05-12, registry.ts:822
    "NEW_ART_3.zip",                         // 2026-05-12, registry.ts:822
  ];
}

async function main() {
  const gaps: Gap[] = [
    ...collectRoomAssetGap(),
    ...collectAxisGap("art.axis9_state_coverage",  "tv",      ["clean", "exposed", "spreading", "corrupted", "quarantined"]),
    ...collectAxisGap("art.axis11_state_coverage", "cycle",   ["dawn", "midday", "dusk", "nightwatch", "longnight"]),
    ...collectAxisGap("art.axis12_state_coverage", "faction", ["none", "hierarchy", "dreamers", "pureflame", "insurgency", "panopticon", "collectors", "multi"]),
  ];

  console.log(`Manifest rooms (zipDirs): ${ROOM_ART_ZIP_TO_CANONICAL.size}`);
  console.log(`Total manifest entries:   ${ROOM_ART_ENTRIES.length}`);
  console.log(`Total gap items to probe: ${gaps.length}`);
  console.log(`\nHEAD-checking ${gaps.length} URLs (concurrency ${CONCURRENCY})…\n`);

  const results: HeadResult[] = [];
  let cursor = 0;
  const started = Date.now();
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < gaps.length) {
        const idx = cursor++;
        const g = gaps[idx];
        const { status } = await head(`${PUBLIC_BASE}/${g.relPath}`);
        const found = status >= 200 && status < 300;
        results.push({ ...g, status, found });
        if (results.length % 50 === 0) {
          process.stderr.write(`  ${results.length}/${gaps.length}\r`);
        }
      }
    }),
  );
  console.error(`  done in ${((Date.now() - started) / 1000).toFixed(1)}s`);

  // ── Report ────────────────────────────────────────────────────
  const byRatchet = new Map<string, { found: HeadResult[]; missing: HeadResult[] }>();
  for (const r of results) {
    let bucket = byRatchet.get(r.ratchet);
    if (!bucket) { bucket = { found: [], missing: [] }; byRatchet.set(r.ratchet, bucket); }
    (r.found ? bucket.found : bucket.missing).push(r);
  }

  console.log(`\n══════════════════════════════════════════════════════════════`);
  console.log(`ART RATCHET GAP AUDIT vs CDN`);
  console.log(`══════════════════════════════════════════════════════════════\n`);

  for (const [ratchet, { found, missing }] of [...byRatchet.entries()].sort()) {
    console.log(`${ratchet}`);
    console.log(`  found on CDN (manifest needs update):  ${found.length}`);
    console.log(`  genuinely missing:                     ${missing.length}`);
    if (found.length > 0) {
      console.log(`\n  ── ON CDN (close gap mechanically) ──`);
      for (const r of found.slice(0, 30)) {
        console.log(`    ✓ ${r.label}`);
        console.log(`        → ${r.relPath}`);
      }
      if (found.length > 30) console.log(`    … and ${found.length - 30} more`);
    }
    if (missing.length > 0 && missing.length <= 20) {
      console.log(`\n  ── NOT ON CDN ──`);
      for (const r of missing) {
        console.log(`    ✗ ${r.label}  (HTTP ${r.status})`);
      }
    } else if (missing.length > 20) {
      console.log(`\n  ── NOT ON CDN (first 10 of ${missing.length}) ──`);
      for (const r of missing.slice(0, 10)) {
        console.log(`    ✗ ${r.label}  (HTTP ${r.status})`);
      }
    }
    console.log();
  }

  // ── Known ZIPs ────────────────────────────────────────────────
  console.log(`══════════════════════════════════════════════════════════════`);
  console.log(`KNOWN PRODUCER ZIPS (best-effort list from codebase)`);
  console.log(`══════════════════════════════════════════════════════════════\n`);
  console.log(`The bucket root isn't publicly listable. Confirm with:`);
  console.log(`  aws s3 ls s3://dgrsart/ --recursive | grep -E '\\.zip$'\n`);
  for (const z of knownZips()) {
    console.log(`  s3://dgrsart/${z}`);
  }
  console.log();

  // ── Totals ────────────────────────────────────────────────────
  const totalFound   = results.filter(r => r.found).length;
  const totalMissing = results.length - totalFound;
  console.log(`══════════════════════════════════════════════════════════════`);
  console.log(`TOTALS`);
  console.log(`══════════════════════════════════════════════════════════════`);
  console.log(`  Probed:                ${results.length}`);
  console.log(`  On CDN  (closeable):   ${totalFound}`);
  console.log(`  Genuinely missing:     ${totalMissing}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
