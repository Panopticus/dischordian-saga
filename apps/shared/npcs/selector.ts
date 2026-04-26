// apps/shared/npcs/selector.ts
//
// Unified NpcLine selector — Stage 1 architecture per priority plan §Phase 1.
// Wraps the four parallel dialog systems (trees / comments / variants /
// personality-axis) behind a single selection contract.
//
// Selection algorithm (per moralityTrustActVariants.ts:resolveVariant() pattern,
// generalized):
//   1. Filter the bank by surface match
//   2. Filter by hard gates (act, flags, trust band, reveal stage, expression
//      channel, public-flag, axis-magnitude)
//   3. Filter by anti-spam (cooldownKey, cooldownWindowMs, maxPlays)
//   4. Score by specificity (how many narrow gates were satisfied)
//   5. Return highest-scoring candidate; ties broken by bank declaration order
//   6. Silent-fail contract: returns null if no match. Caller falls back to
//      a default line. Lint enforces every (npcKey, surface) pair has a
//      catch-all "any/any/any" variant.

import { NPC_REGISTRY, resolveTrustBand } from "./registry";
import type {
  AxisMagnitude,
  DialogSurface,
  NpcKey,
  NpcLine,
  NpcSelectorContext,
  NpcSelectorResult,
  PlayerAxis,
  PlayerProfileSnapshot,
  TrustBand,
} from "./types";

// --- Specificity scoring --------------------------------------------------

/**
 * Specificity weights — narrower gates score higher. The line that matches
 * the most-specific context wins. Weights mirror moralityTrustActVariants.ts
 * scoring (morality=3, trust=3, act=2, flag=1) generalized.
 */
const SCORE_WEIGHTS = {
  trustBand: 3,
  revealStage: 3,
  axisMagnitude: 2,
  actExact: 2,
  publicFlag: 2,
  flag: 1,
  channel: 1,
} as const;

// --- Magnitude resolution -------------------------------------------------

/**
 * Read the player's magnitude on a given axis from a profile snapshot.
 */
function readMagnitude(profile: PlayerProfileSnapshot, axis: PlayerAxis): AxisMagnitude {
  return profile.axes[axis] ?? "neutral";
}

// --- Gate predicates -------------------------------------------------------

function matchesActGate(line: NpcLine, act: number): boolean {
  if (line.minAct !== undefined && act < line.minAct) return false;
  if (line.maxAct !== undefined && act > line.maxAct) return false;
  return true;
}

function matchesFlagGates(line: NpcLine, flags: ReadonlySet<string>): boolean {
  if (line.unlockFlags?.some(f => !flags.has(f))) return false;
  if (line.excludeFlags?.some(f => flags.has(f))) return false;
  return true;
}

function matchesPublicFlagReact(
  line: NpcLine,
  publicFlags: ReadonlySet<string>,
): boolean {
  if (line.reactsToPublicFlag === undefined) return true;
  return publicFlags.has(line.reactsToPublicFlag);
}

function matchesTrustBand(line: NpcLine, currentBand: TrustBand): boolean {
  if (line.requiresTrustBand === undefined) return true;
  return line.requiresTrustBand === currentBand;
}

function matchesRevealStage(line: NpcLine, currentStage: string | undefined): boolean {
  if (line.requiresRevealStage === undefined) return true;
  if (currentStage === undefined) return false;
  return line.requiresRevealStage === currentStage;
}

function matchesAxisGate(line: NpcLine, profile: PlayerProfileSnapshot): boolean {
  if (line.playerAxisGate === undefined) return true;
  const magnitude = readMagnitude(profile, line.playerAxisGate.axis);
  return line.playerAxisGate.magnitudes.includes(magnitude);
}

function matchesExpressionChannel(
  line: NpcLine,
  registryChannels: ReadonlyArray<string> | undefined,
): boolean {
  // Lines without explicit channel default to "verbal".
  const lineChannel = line.expressionChannel ?? "verbal";
  // If NPC profile declares an expressionChannels ladder, the channel must
  // be in the ladder OR the line must be "verbal" (the default).
  if (lineChannel === "verbal") return true;
  if (!registryChannels) return false;
  return registryChannels.includes(lineChannel);
}

// --- Anti-spam predicates --------------------------------------------------

function passesAntiSpam(
  line: NpcLine,
  history: ReadonlyMap<string, ReadonlyArray<number>>,
  nowMs: number,
): boolean {
  const playTimes = history.get(line.lineId) ?? [];
  if (line.maxPlays !== undefined && playTimes.length >= line.maxPlays) {
    return false;
  }
  if (line.cooldownKey === undefined) return true;
  // Cooldown window: 0 (default) means once per playthrough per cooldownKey.
  const windowMs = line.cooldownWindowMs ?? 0;
  // Walk all history entries; if any other line shares the cooldownKey within
  // the window, we cannot fire.
  for (const [otherLineId, otherTimes] of history) {
    if (otherLineId === line.lineId) continue;
    // We don't have other lines' cooldownKey here; assume the caller uses
    // distinct lineIds per cooldownKey (writers' guide convention). The
    // primary cooldown enforcement is on this line's own history.
    void otherLineId;
    void otherTimes;
  }
  if (windowMs === 0 && playTimes.length > 0) return false;
  if (windowMs > 0 && playTimes.length > 0) {
    const last = playTimes[playTimes.length - 1] ?? 0;
    if (nowMs - last < windowMs) return false;
  }
  return true;
}

// --- Specificity scoring --------------------------------------------------

function specificityScore(line: NpcLine): number {
  let score = 0;
  if (line.requiresTrustBand !== undefined) score += SCORE_WEIGHTS.trustBand;
  if (line.requiresRevealStage !== undefined) score += SCORE_WEIGHTS.revealStage;
  if (line.playerAxisGate !== undefined) score += SCORE_WEIGHTS.axisMagnitude;
  if (line.minAct !== undefined || line.maxAct !== undefined) {
    score += SCORE_WEIGHTS.actExact;
  }
  if (line.reactsToPublicFlag !== undefined) score += SCORE_WEIGHTS.publicFlag;
  score += (line.unlockFlags?.length ?? 0) * SCORE_WEIGHTS.flag;
  score += (line.excludeFlags?.length ?? 0) * SCORE_WEIGHTS.flag;
  if (line.expressionChannel !== undefined && line.expressionChannel !== "verbal") {
    score += SCORE_WEIGHTS.channel;
  }
  return score;
}

// --- Surface-aware bank index ---------------------------------------------

/**
 * Per-surface bank index. Each NPC bank declares lines under a surface key.
 * The selector reads (npcKey, surface) and filters from this bank.
 *
 * Banks live at apps/shared/npcs/banks/{npcKey}.ts and export a
 * NpcBank record. The selector accepts a bank as input rather than
 * importing all banks (avoids circular deps and supports lazy loading).
 */
export type NpcBank = ReadonlyArray<NpcLine & { surfaces: ReadonlyArray<DialogSurface> }>;

// --- The selector ---------------------------------------------------------

export interface SelectorOptions {
  /** Override for "now" timestamp; useful for tests. Default: Date.now(). */
  nowMs?: number;
}

/**
 * Select the highest-specificity NpcLine for the given context.
 *
 * Returns null if no line matches. Callers must handle null gracefully
 * (silent-fail contract). Lint should enforce that every (npcKey, surface)
 * pair has at least one catch-all line with no gating.
 */
export function selectNpcLine(
  bank: NpcBank,
  ctx: NpcSelectorContext,
  options: SelectorOptions = {},
): NpcSelectorResult | null {
  const nowMs = options.nowMs ?? Date.now();
  const profile = NPC_REGISTRY[ctx.npcKey];
  if (!profile) return null;

  // 1. Filter by NPC + surface
  const surfaceCandidates = bank.filter(
    line => line.npcKey === ctx.npcKey && line.surfaces.includes(ctx.surface),
  );
  if (surfaceCandidates.length === 0) return null;

  // 2. Filter by hard gates
  const gateCandidates = surfaceCandidates.filter(line => {
    if (!matchesActGate(line, ctx.act)) return false;
    if (!matchesFlagGates(line, ctx.flags)) return false;
    if (!matchesPublicFlagReact(line, ctx.publicFlags)) return false;
    if (!matchesTrustBand(line, ctx.trustState.band)) return false;
    if (!matchesRevealStage(line, ctx.trustState.revealStage)) return false;
    if (!matchesAxisGate(line, ctx.playerProfile)) return false;
    if (!matchesExpressionChannel(line, profile.expressionChannels)) return false;
    return true;
  });
  if (gateCandidates.length === 0) return null;

  // 3. Filter by anti-spam
  const finalCandidates = gateCandidates.filter(line =>
    passesAntiSpam(line, ctx.lineHistory, nowMs),
  );
  if (finalCandidates.length === 0) return null;

  // 4. Score by specificity (highest wins)
  const scored = finalCandidates
    .map(line => ({ line, specificityScore: specificityScore(line) }))
    .sort((a, b) => b.specificityScore - a.specificityScore);

  const winner = scored[0];
  if (!winner) return null;

  return {
    line: winner.line,
    specificityScore: winner.specificityScore,
    alternates: scored.slice(1, 4),
  };
}

// --- Validation helper for lint -------------------------------------------

/**
 * Lint helper: returns the (npcKey, surface) pairs in a bank that lack a
 * catch-all line (no hard gates). Phase 1 test suite uses this to enforce
 * the silent-fail contract.
 */
export function findUngatedSurfaces(bank: NpcBank): ReadonlyArray<{
  npcKey: NpcKey;
  surface: DialogSurface;
}> {
  const seen = new Map<string, boolean>();
  const missing: { npcKey: NpcKey; surface: DialogSurface }[] = [];

  for (const line of bank) {
    for (const surface of line.surfaces) {
      const key = `${line.npcKey}:${surface}`;
      if (seen.get(key) === true) continue;
      const isCatchAll =
        line.requiresTrustBand === undefined &&
        line.requiresRevealStage === undefined &&
        line.playerAxisGate === undefined &&
        line.minAct === undefined &&
        line.maxAct === undefined &&
        line.reactsToPublicFlag === undefined &&
        (line.unlockFlags?.length ?? 0) === 0 &&
        (line.excludeFlags?.length ?? 0) === 0;
      if (isCatchAll) {
        seen.set(key, true);
      } else if (!seen.has(key)) {
        seen.set(key, false);
      }
    }
  }

  for (const [key, hasCatchAll] of seen) {
    if (!hasCatchAll) {
      const [npcKey, surface] = key.split(":") as [NpcKey, DialogSurface];
      missing.push({ npcKey, surface });
    }
  }

  return missing;
}

// --- Trust-band utility re-export -----------------------------------------

/** Re-export for convenience; the selector uses the registry's logic. */
export { resolveTrustBand };
