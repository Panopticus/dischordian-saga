/**
 * fightAi — AI difficulty profiles + helpers.
 *
 * audit/01.F4 Step 3a (data layer) of the FightEngine2D split.
 *
 * What lives here:
 *   - `Difficulty2D` enum: the four AI tiers (recruit / soldier /
 *     veteran / archon).
 *   - `AIDifficultyProfile` interface: the tunable per-tier knobs
 *     the runtime decision logic reads.
 *   - `AI_PROFILES`: the canonical profile table.
 *   - Pure helpers used by both decision logic and tests.
 *
 * What does NOT live here yet (deferred to Step 3b — needs manual
 * smoke between steps; per docs/refactor-plans/fight-engine-2d-split.md):
 *   - `processAI(ai, player)` — the 218-line behavior method that
 *     today mutates fighter state directly via `this.changeState`,
 *     `this.activateSpecial`, etc. Extracting that to a pure
 *     `decideNextAction(fighter, opponent, profile, frame): AiDecision`
 *     requires (a) defining the AiDecision discriminated union,
 *     (b) reworking processAI to RETURN a decision rather than
 *     mutate, and (c) having the engine class interpret the
 *     decision. That's a behavioral refactor with no test coverage,
 *     so it ships in its own PR with manual smoke at each step.
 *
 * The data extracted in this file is enough to:
 *   - Unit-test the profile table (e.g. monotonicity of difficulty
 *     across tiers, sanity bounds on rates).
 *   - Reuse the profile shape from the upcoming sim/AI-controller
 *     extraction without duplicating types.
 *   - Land a parity ratchet that asserts every Difficulty2D value
 *     has a matching AI_PROFILES entry (already implicit via the
 *     `Record<Difficulty2D, AIDifficultyProfile>` type — TypeScript
 *     enforces this at compile time).
 */

/** Four difficulty tiers, easiest → hardest. */
export type Difficulty2D = "recruit" | "soldier" | "veteran" | "archon";

/** Tunable knobs for the AI decision loop. Each rate is a [0, 1]
 *  probability the loop checks against `Math.random()` per frame
 *  cluster; fewer-frames-per-cluster + more-checks = harder AI. */
export interface AIDifficultyProfile {
  /** How many frames AI waits before reacting */
  reactionFrames: number;
  /** 0-1, chance of continuing combo */
  comboAccuracy: number;
  /** 0-1, chance of blocking on reaction */
  blockRate: number;
  /** 0-1, chance of anti-airing jumps */
  antiAirRate: number;
  /** 0-1, chance of punishing whiffed attacks */
  whiffPunishRate: number;
  /** 0-1, how often AI uses specials */
  specialUseRate: number;
  /** 0-1, chance of random mistake */
  mistakeRate: number;
  /** 0-1, base aggression level */
  aggressionBase: number;
}

/** AI profile table. Difficulty curve is hand-tuned; tests in
 *  fightAi.test.ts (planned) lock in the per-knob monotonicity. */
export const AI_PROFILES: Record<Difficulty2D, AIDifficultyProfile> = {
  // Easy: approachable, lets player learn. Slow reactions, frequent mistakes,
  // rarely blocks or punishes. Feels like sparring a beginner.
  recruit: {
    reactionFrames: 35, comboAccuracy: 0.2, blockRate: 0.15, antiAirRate: 0.05,
    whiffPunishRate: 0.05, specialUseRate: 0.1, mistakeRate: 0.35, aggressionBase: 0.35,
  },
  // Normal: solid opponent, blocks sometimes, can chain 2-hit combos.
  // Reacts to jump-ins occasionally. Feels like a competent player.
  soldier: {
    reactionFrames: 20, comboAccuracy: 0.5, blockRate: 0.4, antiAirRate: 0.25,
    whiffPunishRate: 0.25, specialUseRate: 0.25, mistakeRate: 0.18, aggressionBase: 0.5,
  },
  // Hard: reads your patterns, blocks most attacks, punishes mistakes.
  // Chains full combos and uses specials strategically. Fair but demanding.
  veteran: {
    reactionFrames: 12, comboAccuracy: 0.7, blockRate: 0.6, antiAirRate: 0.5,
    whiffPunishRate: 0.5, specialUseRate: 0.45, mistakeRate: 0.08, aggressionBase: 0.6,
  },
  // Nightmare: near-frame-perfect reactions, optimal combos, ruthless punishes.
  // Still makes rare mistakes to keep it beatable.
  archon: {
    reactionFrames: 5, comboAccuracy: 0.9, blockRate: 0.8, antiAirRate: 0.75,
    whiffPunishRate: 0.75, specialUseRate: 0.65, mistakeRate: 0.04, aggressionBase: 0.7,
  },
};

/**
 * Adapt the profile's effective aggression based on the health
 * ratio between AI and player.
 *
 *   - Comeback mechanic: AI gets more aggressive (and reacts
 *     faster) when losing badly.
 *   - Mercy mode: AI eases off when dominating (more fun for
 *     the player).
 *   - Otherwise: profile baseline.
 *
 * Returns both the adjusted aggression value AND the adjusted
 * reactionFrames so the caller can apply both atomically. The
 * function is pure — moved out of processAI's body so it can be
 * unit-tested and reused by the upcoming AI-controller extraction.
 */
export function adaptAggression(
  profile: AIDifficultyProfile,
  aiHealthRatio: number,
  playerHealthRatio: number,
): { aggression: number; reactDelay: number } {
  if (aiHealthRatio < 0.3 && playerHealthRatio > 0.5) {
    return {
      aggression: Math.min(0.9, profile.aggressionBase + 0.3),
      reactDelay: Math.max(4, profile.reactionFrames - 8),
    };
  }
  if (aiHealthRatio > 0.7 && playerHealthRatio < 0.3) {
    return {
      aggression: Math.max(0.2, profile.aggressionBase - 0.15),
      reactDelay: profile.reactionFrames + 4,
    };
  }
  return {
    aggression: profile.aggressionBase,
    reactDelay: profile.reactionFrames,
  };
}

/**
 * Compute the ideal stand-off distance for a fighter archetype.
 * Pure helper; pulled out of processAI's body so the rest of the
 * stack (combo trainer, replay viewer, AI controller) can reuse the
 * same constants without duplicating the magic numbers.
 *
 * Archetype names match `FighterArchetype` from gameData.
 */
export function idealDistanceFor(archetype: string): number {
  switch (archetype) {
    case "zoner":     return 400;
    case "grappler":  return 80;
    case "rushdown":  return 100;
    default:          return 180;
  }
}
