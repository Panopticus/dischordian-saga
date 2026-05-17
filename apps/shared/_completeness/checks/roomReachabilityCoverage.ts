/**
 * Room reachability coverage parity check (Phase H.I).
 *
 * Declared surface: 117 deferred spaces from H.A inventory (12
 * Hellboxes + 7 vehicles + 60 destinations + 38 apprentice spaces).
 *
 * Implemented surface: spaces declared in
 * `apps/shared/roomGating/roomUnlockManifest.ts` (70).
 *
 * Ratcheted at 47. The gap is the 60 destination zones (Trade
 * Empire / Crucible / Tower Defense / Castle of Death / Quiz
 * Show) minus the few `dest.*` entries already in the manifest.
 * Their unlock model is NOT authored anywhere in source or docs
 * — it is an explicitly deferred narrative-design decision
 * (TBD[4] in `docs/production/_PHASE_H_HANDOFF.md`). The ratchet
 * is the correct honest accounting of that deferral; it closes
 * only when the narrative team authors the per-zone gates. The
 * gate must NOT be turned green by inventing them.
 */
import type { RawParityCount } from "../types";

export async function checkRoomReachabilityCoverage(): Promise<RawParityCount> {
  const manifest = await import("../../roomGating/roomUnlockManifest");

  const declared = 117;
  const implemented = manifest.ROOM_UNLOCK_MANIFEST_TOTAL;
  const missing: string[] = [];

  // The gap is the 60 destination zones whose unlock model is an
  // explicitly deferred narrative-design decision (TBD[4] in
  // _PHASE_H_HANDOFF.md) — not yet authored in source or docs.
  const gap = declared - implemented;
  if (gap > 0) {
    missing.push(
      `~${gap} destination-zone spaces have no authored unlock gate (deferred narrative-design decision, TBD[4] _PHASE_H_HANDOFF.md — not yet written anywhere)`,
    );
  }

  return {
    declared,
    implemented,
    missing,
  };
}
