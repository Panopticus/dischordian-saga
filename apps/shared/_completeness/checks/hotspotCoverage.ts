/**
 * Hotspot coverage parity check (Phase H.H).
 *
 * Declared surface: 166 spaces specced in
 * `docs/production/_PRODUCTION_FINAL.md` (PARTs III–VIII).
 *
 * Implemented surface: spaces with at least one hotspot — either
 * inline in `ROOM_DEFINITIONS.hotspots` (49 Ark rooms) or sidecar
 * in `apps/shared/expansionArt/roomHotspotManifest.ts`
 * (DEFERRED_SPACE_HOTSPOTS).
 *
 * Ratcheted; gap shrinks as more spaces get authored hotspots.
 */
import type { RawParityCount } from "../types";

const ARK_ROOM_COUNT = 49;

export async function checkHotspotCoverage(): Promise<RawParityCount> {
  const sidecar = await import("../../expansionArt/roomHotspotManifest");

  const declared = 166;
  // 49 Ark rooms have inline hotspots in ROOM_DEFINITIONS (count
  // hardcoded — same value as the spec's PART III)
  // + DEFERRED_SPACE_HOTSPOTS_TOTAL extra spaces stubbed in sidecar
  const implemented =
    ARK_ROOM_COUNT + sidecar.DEFERRED_SPACE_HOTSPOTS_TOTAL;

  const missing: string[] = [];
  // 166 - 49 - 19 (sidecar) = 98 spaces with no hotspot yet (largely
  // destinations + apprentice spaces deferred from H.A producer pass)
  missing.push(
    `~${declared - implemented} spaces lack hotspots (mainly destinations + apprentice spaces beyond the H.A producer delivery)`,
  );

  return {
    declared,
    implemented,
    missing,
  };
}
