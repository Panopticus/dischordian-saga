/**
 * Room-asset coverage parity check (Phase H.B).
 *
 * Declared surface: 166 spaces specced in
 * `docs/production/_PRODUCTION_FINAL.md` (PART III Ark rooms + PART IV
 * Hellboxes + PART V vehicles + PART VI destinations + PART VIII
 * apprentice/pedagogy/etc.).
 *
 * Implemented surface: rooms with at least a baseline.png entry in the
 * producer-art library (apps/shared/expansionArt/roomArtManifest.ts).
 *
 * Producer-art passthrough delivered 61 of 166 spaces in the first pass
 * (37 %). Remaining 105 spaces are deferred for subsequent producer
 * passes (12 Hellboxes + 7 vehicles + 60 destinations + 36 of 38
 * apprentice spaces).
 *
 * **Ratcheted parity**: the gap can shrink as future producer passes
 * land; cannot regress.
 */
import type { RawParityCount } from "../types";

export async function checkRoomAssetCoverage(): Promise<RawParityCount> {
  const mod = await import("../../expansionArt/roomArtManifest");
  const { ROOM_ART_ZIP_DIRS, roomArtCoverageReport } = mod;

  const declared = 166;
  const implemented = ROOM_ART_ZIP_DIRS.length;
  const report = roomArtCoverageReport();

  const missing: string[] = [];
  // The 12 Hellboxes
  for (const hb of report.deferredHellboxes) {
    missing.push(`deferred-hellbox: ${hb}`);
  }
  // The 7 vehicles
  for (const v of report.deferredVehicles) {
    missing.push(`deferred-vehicle: ${v}`);
  }
  // Destinations + apprentice spaces summarised
  missing.push(
    `deferred: 60 destinations (PART VI) + 36 of 38 apprentice/pedagogy/berth/guild/Game-Master spaces (PART VIII; apprentice_berth + pedagogy_hall delivered)`,
  );

  // 5 producer-delivered rooms not in original spec — surface as note
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
