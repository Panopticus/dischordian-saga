/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Lycos death roll calculator

   Per-choice risk model. Inputs:

     - target.threatTier (1-5)
     - choice.riskGrade (0-1) — the choice's risk
       declaration; conservative choices grade ~0.1,
       reckless ones ~0.85
     - leagueStateModifier — the Crucible's overall
       difficulty; high release_pressure increases risk

   Output: a discrete result drawn from a deterministic
   PRNG seeded by (missionId, choiceIndex). The tuning
   target is ~10-15% Lycos-death rate across a full 250-
   mission arc, weighted toward high-tier + high-risk
   choices.

   Determinism: same (seed, riskGrade) → same result.
   This lets replay tests pin outcomes and lets the
   server reject client-claimed outcomes that don't
   match the deterministic roll.
   ═══════════════════════════════════════════════════════ */

import type { ThreatTier } from "./types/HeroTarget";

export type DeathRollResult = "survived" | "wounded" | "died";

export interface DeathRollContext {
  threatTier: ThreatTier;
  riskGrade: number; // 0-1
  releasePressure: number; // 0-1
  /** Deterministic seed — typically a hash of (missionId + choiceIndex). */
  seed: number;
}

/**
 * Linear-congruential generator. Cheap, deterministic, sufficient for
 * a per-mission roll. NOT cryptographically secure — never use this
 * for anything client-tampering-relevant. The server runs the SAME
 * seeded roll and authoritative-records the result.
 */
function lcg(seed: number): number {
  // Numerical Recipes constants.
  const next = (seed * 1664525 + 1013904223) >>> 0;
  return next / 0xffffffff;
}

export function computeDeathProbability(
  ctx: Omit<DeathRollContext, "seed">,
): { died: number; wounded: number } {
  // Base risk scales with threatTier × riskGrade.
  // Tier 1 + min risk = ~1%; Tier 5 + max risk = ~30%.
  const base = (ctx.threatTier / 5) * ctx.riskGrade;
  // Release-pressure scales the base by up to +50% at max pressure.
  const modifier = 1 + ctx.releasePressure * 0.5;
  const adjusted = base * modifier;

  // Split adjusted band: ~1/3 of it becomes a fatal roll, ~2/3 a
  // wounded roll. The remaining (1 - adjusted) is survived.
  // Clamp to safe range.
  const died = Math.min(0.30, adjusted * 0.33);
  const wounded = Math.min(0.50, adjusted * 0.67);

  return { died, wounded };
}

export function rollLycosDeath(ctx: DeathRollContext): DeathRollResult {
  const { died, wounded } = computeDeathProbability(ctx);
  const roll = lcg(ctx.seed);

  if (roll < died) return "died";
  if (roll < died + wounded) return "wounded";
  return "survived";
}

/** Deterministic hash of a missionId + choiceIndex into a 32-bit seed. */
export function deathRollSeed(missionId: string, choiceIndex: number): number {
  // Simple but stable FNV-1a 32 over the (missionId + ":" + index) string.
  const input = `${missionId}:${choiceIndex}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}
