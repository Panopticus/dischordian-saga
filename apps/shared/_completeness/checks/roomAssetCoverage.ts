/**
 * Room-asset coverage parity check (Phase H.B).
 *
 * Declared surface: 166 spaces specced in
 * `docs/production/_PRODUCTION_FINAL.md` (PART III Ark rooms + PART IV
 * Hellboxes + PART V vehicles + PART VI destinations + PART VIII
 * apprentice/pedagogy/etc.).
 *
 * Implemented surface: spaces with at least a baseline-art URL
 * resolvable through `roomArtBaselineUrl()`. Two sources contribute:
 *   1. the primary producer-art library
 *      (`apps/shared/expansionArt/roomArtManifest.data.ts`) — 79 zipDirs
 *      covering Ark rooms, Hellboxes, and the apprentice / commons /
 *      guild ecosystem.
 *   2. the `newArtRoomBridge` — the 2026-05-12 NEW_ART_1/2 drop
 *      delivering all 7 vehicles + all 60 destination zones (5
 *      categories) + 8 destination panoramas, resolved by canonical
 *      space id.
 *
 * **Ratcheted parity**: the gap can shrink as future producer passes
 * land; cannot regress.
 */
import type { RawParityCount } from "../types";

export async function checkRoomAssetCoverage(): Promise<RawParityCount> {
  const mod = await import("../../expansionArt/roomArtManifest");
  const { roomArtCoverageReport } = mod;

  const declared = 166;
  const report = roomArtCoverageReport();
  const implemented = report.producerDelivered.length;

  const missing: string[] = [];
  for (const hb of report.deferredHellboxes) {
    missing.push(`deferred-hellbox: ${hb}`);
  }
  for (const v of report.deferredVehicles) {
    missing.push(`deferred-vehicle: ${v}`);
  }

  // Apprentice / pedagogy / commons tail — most are delivered (NEW_ART
  // sprites + roomArtManifest entries). A handful of §AC sub-zones may
  // still need bridging; surface the residual count rather than naming
  // each so the ratchet stays honest.
  const residual = Math.max(0, declared - implemented - missing.length);
  if (residual > 0) {
    missing.push(
      `deferred-tail: ${residual} apprentice/pedagogy/commons sub-zones pending bridge or NEW_ART manifest registration`,
    );
  }

  // Producer-delivered rooms not in original spec — surface as note
  if (report.producerNewNotInSpec.length > 0) {
    missing.push(
      `NEW (not in original spec; accepted as canonical): ${report.producerNewNotInSpec.join(", ")}`,
    );
  }

  return {
    declared,
    implemented,
    missing,
  };
}
