/* ═══════════════════════════════════════════════════════
   NARRATOR BOND — unified "both narrators" scalar

   Single 0–100 number that represents the player's combined
   bond with Elara AND The Human. §14.1 witnessing milestones
   ("Two Witnesses Remember" at 40, "Silence" at 60, "Meet"
   at 80) all describe a shared threshold, not two independent
   per-narrator trusts.

   Today the legacy game state tracks two numbers:
     • elaraTrust — 0..100
     • humanTrust — 0..100
   and the milestone spec handwaves "bond with BOTH". This
   module introduces the canonical first-class field
   `narratorBond` and a reader with a derived-value fallback
   so existing saves (predating the field) keep working.

   Pure module. No React, no server imports.
   ═══════════════════════════════════════════════════════ */

export const NARRATOR_BOND_MIN = 0;
export const NARRATOR_BOND_MAX = 100;

/** §14.1 milestone thresholds — the only bond numbers that matter narratively. */
export const NARRATOR_BOND_THRESHOLDS = {
  /** Two Witnesses Remember */
  remember: 40,
  /** The Silence of Two Witnesses */
  silence: 60,
  /** The Two Witnesses Meet */
  meet: 80,
} as const;

/** Clamp an arbitrary number to [0, 100]. Non-finite → 0. */
export function clampNarratorBond(value: number): number {
  if (!Number.isFinite(value)) return NARRATOR_BOND_MIN;
  if (value < NARRATOR_BOND_MIN) return NARRATOR_BOND_MIN;
  if (value > NARRATOR_BOND_MAX) return NARRATOR_BOND_MAX;
  return value;
}

/** Apply a delta (positive or negative) to the current bond, clamped. */
export function adjustNarratorBond(current: number, delta: number): number {
  const base = Number.isFinite(current) ? current : NARRATOR_BOND_MIN;
  return clampNarratorBond(base + delta);
}

/**
 * Unified narrator bond reader with derived-value fallback.
 *
 * If `narratorBond` is a finite number it's the source of truth
 * (clamped). Otherwise fall back to `min(elaraTrust, humanTrust)`
 * — the "bond with BOTH narrators" semantics used by §14.1.
 *
 * This keeps saves that predate the `narratorBond` field behaving
 * sensibly until the field is written for the first time.
 */
export function deriveNarratorBond(input: {
  narratorBond?: number | null;
  elaraTrust?: number | null;
  humanTrust?: number | null;
}): number {
  if (
    typeof input.narratorBond === "number" &&
    Number.isFinite(input.narratorBond)
  ) {
    return clampNarratorBond(input.narratorBond);
  }
  const elara =
    typeof input.elaraTrust === "number" && Number.isFinite(input.elaraTrust)
      ? input.elaraTrust
      : NARRATOR_BOND_MIN;
  const human =
    typeof input.humanTrust === "number" && Number.isFinite(input.humanTrust)
      ? input.humanTrust
      : NARRATOR_BOND_MIN;
  return clampNarratorBond(Math.min(elara, human));
}
