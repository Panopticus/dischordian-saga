/**
 * Room reachability coverage parity check (Phase H.I).
 *
 * Declared surface: 117 deferred spaces from H.A inventory (12
 * Hellboxes + 7 vehicles + 60 destinations + 38 apprentice spaces).
 *
 * Implemented surface: spaces declared in
 * `apps/shared/roomGating/roomUnlockManifest.ts`.
 *
 * Ratcheted; remaining 60 destinations (Trade Empire / Crucible /
 * Tower Defense / Castle of Death / Quiz Show) are gated per-zone
 * in their respective subsystems, so coverage here is partial by
 * design.
 */
import type { RawParityCount } from "../types";

export async function checkRoomReachabilityCoverage(): Promise<RawParityCount> {
  const manifest = await import("../../roomGating/roomUnlockManifest");

  const declared = 117;
  const implemented = manifest.ROOM_UNLOCK_MANIFEST_TOTAL;
  const missing: string[] = [];

  // Approximate gap report: 60 destinations + remaining apprentice
  // spaces still need explicit unlock declarations
  const gap = declared - implemented;
  if (gap > 0) {
    missing.push(
      `~${gap} deferred spaces lack explicit unlock declarations (mainly destination zones gated per-subsystem)`,
    );
  }

  return {
    declared,
    implemented,
    missing,
  };
}
