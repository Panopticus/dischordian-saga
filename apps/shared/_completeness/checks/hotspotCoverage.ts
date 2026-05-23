/**
 * Hotspot coverage parity check (Phase H.H).
 *
 * Declared surface: 166 spaces specced in
 * `docs/production/_PRODUCTION_FINAL.md` (PARTs III–VIII).
 *
 * Implemented surface: spec-level spaces that carry at least one
 * hotspot. Sourced from two places:
 *
 *   1. The 49 Ark rooms with inline `ROOM_DEFINITIONS.hotspots`
 *      (count hardcoded per PART III).
 *   2. The sidecar `DEFERRED_SPACE_HOTSPOTS` in
 *      `apps/shared/expansionArt/roomHotspotManifest.ts`, aggregated
 *      to spec level so the 12 archetype apprentice berths collapse
 *      to one `ark.apprentice_berth` row (same convention as
 *      `roomArtCoverageReport()`).
 *
 * Ratcheted; gap shrinks as more spaces get authored hotspots.
 */
import type { RawParityCount } from "../types";

const ARK_ROOM_COUNT = 49;

/**
 * Aggregate a canonical space id to its spec-level equivalent.
 * Mirrors the rule in `roomArtManifest.ts.specLevelId`.
 */
function specLevelId(canonicalId: string): string {
  const hb = /^(hb\.[a-z_]+)(?:\..+)?$/.exec(canonicalId);
  if (hb) return hb[1];
  const ark = /^(ark\.[a-z_]+)(?:\..+)?$/.exec(canonicalId);
  if (ark) return ark[1];
  return canonicalId;
}

export async function checkHotspotCoverage(): Promise<RawParityCount> {
  const sidecar = await import("../../expansionArt/roomHotspotManifest");

  const declared = 166;

  // Spec-level set of sidecar coverage (skip panoramas — vistas, not
  // spec-level rooms).
  const sidecarSpec = new Set<string>();
  for (const block of sidecar.DEFERRED_SPACE_HOTSPOTS) {
    if (block.canonicalSpaceId.startsWith("dest.panorama.")) continue;
    sidecarSpec.add(specLevelId(block.canonicalSpaceId));
  }

  const implemented = Math.min(declared, ARK_ROOM_COUNT + sidecarSpec.size);
  const missing: string[] = [];
  const gap = declared - implemented;
  if (gap > 0) {
    missing.push(
      `~${gap} spaces lack hotspots (apprentice/pedagogy/commons spaces with no inline ROOM_DEFINITIONS or sidecar entry)`,
    );
  }

  return {
    declared,
    implemented,
    missing,
  };
}
