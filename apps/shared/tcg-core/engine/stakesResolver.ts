/* ═══════════════════════════════════════════════════════
   STAKES RESOLVER — multi-axis card delta reader

   Plan §"Stakes Stream engine generalization".

   Generalizes the single-axis `verdict_delta` card field
   into a multi-axis `stakes_deltas` map while preserving
   bit-for-bit replay determinism. The widening is
   *additive*: existing card definitions that author only
   `verdict_delta` continue to drive the trial / public-
   witness streams exactly as they did before, because the
   resolver falls back to `verdict_delta` whenever the
   `"verdict"` axis is requested and no `stakes_deltas`
   entry exists.

   New cards (and the encounter authoring layer) can
   declare multi-axis stakes via `stakes_deltas`. The
   `StoryEncounter.stakesMode` config (apps/shared/tcg-core/
   types/StakesMode.ts) declares which axes a given
   encounter cares about; the reducer that walks
   stakes_deltas through that config on each card play
   lands in a follow-up slice. This file is the engine
   reader; the reducer is its consumer.

   RULES_VERSION non-bump

   Because the new `stakes_deltas` field is optional and
   the resolver preserves the exact behavior of every
   shipped card, no MINOR bump is required. The semver
   contract in apps/shared/tcg-core/engine/version.ts
   stays at 1.1.0 — `reduce(state, action)` returns the
   same output for every existing card. The Zod schema
   rejects authoring drift (a card with both
   `verdict_delta` AND `stakes_deltas.verdict` set) so the
   two sources cannot diverge silently.
   ═══════════════════════════════════════════════════════ */

import type { CardDefinition } from "../types/Card";

/**
 * The canonical stakes axes the engine currently understands. New
 * axes are added here as encounters need them (e.g.,
 * `doctrine_purity` for Insurgency-tied trials,
 * `bond_resonance` for Eidolon-tied encounters). The
 * existing single-axis card fields map onto:
 *
 *   - "verdict"        → CardDefinition.verdict_delta
 *                        (§5.8 Authority trial balance)
 *   - "public_witness" → CardDefinition.public_delta
 *                        (§5.7 public divergence override)
 */
export const STAKES_AXES = ["verdict", "public_witness"] as const;
export type StakesAxis = (typeof STAKES_AXES)[number];

/**
 * Read a single stakes axis delta from a card definition. Returns
 * `undefined` when the card does not author that axis.
 *
 * Precedence:
 *   1. `card.stakes_deltas[axis]` when set
 *   2. Per-axis legacy fallback:
 *        "verdict"        → card.verdict_delta
 *        "public_witness" → undefined (caller composes the
 *                          existing public_delta / verdict_delta
 *                          chain — see resolvePublicWitnessDelta)
 *   3. `undefined`
 *
 * Pure function — same inputs always return the same output. Safe
 * to call from the reducer.
 */
export function resolveCardStakeDelta(
  card: Pick<CardDefinition, "stakes_deltas" | "verdict_delta">,
  axis: StakesAxis,
): number | undefined {
  const fromStakes = card.stakes_deltas?.[axis];
  if (typeof fromStakes === "number") return fromStakes;
  if (axis === "verdict" && typeof card.verdict_delta === "number") {
    return card.verdict_delta;
  }
  return undefined;
}

/**
 * Compose the §5.7 public-witness delta with the canonical
 * fallback chain documented at engine/publicWitness.ts:108-175 —
 * preserved verbatim so the public stream's pre-widening behavior
 * is bit-identical:
 *
 *   stakes_deltas.public_witness  → highest priority (new)
 *   public_delta                  → legacy override field
 *   verdict_delta (via resolver)  → "public agrees with private"
 *   undefined                     → caller substitutes placeholder
 *
 * Returns `undefined` only when the card authors none of the
 * three sources. Callers (engine/publicWitness.ts) substitute
 * PLACEHOLDER_PUBLIC_DELTA (0).
 */
export function resolvePublicWitnessDelta(
  card: Pick<
    CardDefinition,
    "stakes_deltas" | "verdict_delta" | "public_delta"
  >,
): number | undefined {
  const fromStakes = card.stakes_deltas?.public_witness;
  if (typeof fromStakes === "number") return fromStakes;
  if (typeof card.public_delta === "number") return card.public_delta;
  return resolveCardStakeDelta(card, "verdict");
}
