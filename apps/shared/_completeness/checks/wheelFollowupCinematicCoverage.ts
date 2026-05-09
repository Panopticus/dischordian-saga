/**
 * audit/16 PR 4 (Cluster D — finding C1) — wheel_followup
 * portraitCinematicId coverage parity check.
 *
 * The audit'd intent for the `wheel_followup` surface is that every
 * post-wheel reaction line should crossfade an `AnimatedPortrait` to
 * the appropriate cinematic — text-only is undershot. This check
 * compares the count of `surface: "wheel_followup"` variants in
 * VARIANT_REGISTRY (declared) against the count that have a
 * populated `portraitCinematicId` (implemented).
 *
 * RATCHETed — gap may be positive but can only shrink. PR 4 lands
 * the schema; PR 9 (cinematic consumers) lands the per-variant
 * portrait reactions and moves the gap toward zero.
 */
import { VARIANT_REGISTRY } from "../../moralityTrustActVariants";
import type { ParityResult } from "../types";

export function checkWheelFollowupCinematicCoverage(): ParityResult {
  const wheelFollowups = VARIANT_REGISTRY.filter((v) => v.surface === "wheel_followup");
  const declared = wheelFollowups.length;
  const withCinematic = wheelFollowups.filter((v) => !!v.portraitCinematicId);
  const implemented = withCinematic.length;
  const gap = Math.max(0, declared - implemented);
  const missing = wheelFollowups
    .filter((v) => !v.portraitCinematicId)
    .map((v) => v.id)
    .sort();
  const notes: string[] = [];
  if (gap > 0) {
    const sample = missing.slice(0, 5).join(", ");
    notes.push(
      `${gap} wheel_followup variant${gap === 1 ? "" : "s"} missing portraitCinematicId` +
        (missing.length > 5 ? ` (sample: ${sample}, …)` : sample ? ` (${sample})` : ""),
    );
  }
  // Status left as PASS; the harness will reassign to RATCHET based on
  // the entry's `ratchet: { target: 0 }` config in registry.ts.
  return {
    declared,
    implemented,
    gap,
    status: gap === 0 ? "PASS" : "FAIL",
    notes: notes.length ? notes : undefined,
  };
}
