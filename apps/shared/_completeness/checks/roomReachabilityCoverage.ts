/**
 * Room reachability coverage parity check (Phase H.I).
 *
 * Declared surface: 131 spaces. The H.A inventory specced 117 (12
 * HB + 7 veh + 60 dest + 38 apprentice). Producer expanded that by 4
 * dest extras (celebration_school sub-zones + warden_dock +
 * hall_of_disappearances) and 10 apprentice/pedagogy spaces beyond
 * the original 38 (guild commons, recruit berths, misc) — total 131.
 *
 * Implemented surface: every entry in
 * `apps/shared/roomGating/roomUnlockManifest.ts`. As of the follow-up
 * pass that authored the 60 NEW_ART_2 destination gates with
 * engineering-best-guess category rules (§E in `_PRODUCTION_DESTINATIONS.md`),
 * implemented = declared = 131. The writer-ratification gap stays
 * visible via the canon spine in `apps/shared/livingDeferralCanon.ts`
 * (5 destination_gate entries, one per category) — so the spec gap
 * never becomes invisible just because the count balances.
 *
 * Hard parity. Adding a new declared space without a gate fails the
 * gate; adding a gate without a corresponding canon-spine
 * justification (for the engineering-best-guess case) is fine, but
 * narrative-design should ratify or override.
 */
import type { RawParityCount } from "../types";

export async function checkRoomReachabilityCoverage(): Promise<RawParityCount> {
  const manifest = await import("../../roomGating/roomUnlockManifest");

  const declared = 131;
  const implemented = manifest.ROOM_UNLOCK_MANIFEST_TOTAL;
  const missing: string[] = [];

  const gap = declared - implemented;
  if (gap > 0) {
    missing.push(
      `~${gap} spaces lack an authored unlock gate — see roomUnlockManifest.ts and livingDeferralCanon.ts (destination_gate category)`,
    );
  }

  return {
    declared,
    implemented,
    missing,
  };
}
