/* ═══════════════════════════════════════════════════════
   LIVING UNIVERSE — RULES ENGINE

   Plan §E2. The existing EVENT_SYNERGIES array hard-codes
   each combo by hand: every pair-of-pressures combination
   has its own object. Authoring new emergent events means
   editing that array.

   This module is the rules-engine alternative — author once
   in a declarative form ("any 2 dark dimensions over 50 for
   3 days = a despair event"), and the engine yields the same
   per-combo behaviour by composition.

   It does NOT replace the existing static synergies (which
   are well-tuned and reviewed). It runs alongside, so the
   LivingUniverse can opt into rules incrementally.

   Pure module — no DB. Caller passes the current pressure
   snapshot and (optionally) recent history; the engine
   returns a list of triggered rules with their event ids.
   ═══════════════════════════════════════════════════════ */

import type { PressureSnapshot } from "./tradePriceDrift";

export type PressureDimension =
  | "deaths"
  | "viralExposures"
  | "truthRevealed"
  | "healingDone"
  | "exploration"
  | "lightEnergy"
  | "darkEnergy";

/** Polarity tag — many rules want "any 2 dark" or "any 1
 *  light + 1 dark". Mapping each dimension to a polarity
 *  lets rules talk in those terms. */
const DIMENSION_POLARITY: Record<PressureDimension, "light" | "dark" | "neutral"> = {
  truthRevealed: "light",
  healingDone: "light",
  exploration: "light",
  lightEnergy: "light",
  deaths: "dark",
  viralExposures: "dark",
  darkEnergy: "dark",
};

export interface RuleCondition {
  /** AND-combine each clause; the rule fires only when every
   *  clause is true. Multiple clauses inside one rule give
   *  authors a small composition language without tree-
   *  walking. */
  any?: { polarity: "light" | "dark"; minCount: number; threshold: number };
  all?: { dims: PressureDimension[]; threshold: number };
  not?: { dim: PressureDimension; threshold: number };
  /** Quiet-period gate — rule only fires if the named other
   *  rule hasn't fired in the last N days. Optional. */
  cooldownDays?: { ruleId: string; days: number };
}

export interface RuleDefinition {
  id: string;
  name: string;
  /** Human-readable lore intent — surfaces in the event toast. */
  description: string;
  conditions: ReadonlyArray<RuleCondition>;
  /** Event id the consumer dispatches when the rule fires. */
  eventId: string;
}

export const LIVING_UNIVERSE_RULES: ReadonlyArray<RuleDefinition> = [
  {
    id: "two_dark_over_50",
    name: "Despair Cascade",
    description: "Two darkness dimensions over 50: the ship feels heavier today.",
    conditions: [{ any: { polarity: "dark", minCount: 2, threshold: 50 } }],
    eventId: "lu_despair_cascade",
  },
  {
    id: "two_light_over_50",
    name: "Hope Surge",
    description: "Two light dimensions over 50: a quiet ascendant moment.",
    conditions: [{ any: { polarity: "light", minCount: 2, threshold: 50 } }],
    eventId: "lu_hope_surge",
  },
  {
    id: "viral_without_healing",
    name: "Untreated Outbreak",
    description: "Viral exposures rising while healing stays low. The ship needs a medic.",
    conditions: [
      { all: { dims: ["viralExposures"], threshold: 30 } },
      { not: { dim: "healingDone", threshold: 30 } },
    ],
    eventId: "lu_untreated_outbreak",
  },
  {
    id: "exploration_breakthrough",
    name: "Frontier Breakthrough",
    description: "Truth and exploration converging — the map is changing.",
    conditions: [
      { all: { dims: ["truthRevealed", "exploration"], threshold: 40 } },
    ],
    eventId: "lu_frontier_breakthrough",
  },
];

/* ─── Engine ─── */

export interface RuleFireContext {
  pressure: PressureSnapshot;
  /** Rule id → wall-clock timestamp of last fire. Optional;
   *  rules without cooldowns ignore this. */
  lastFiredAt?: Readonly<Record<string, number | undefined>>;
  /** Current evaluation time, for cooldown comparison. */
  now?: number;
}

/** Evaluate every rule against the current pressure +
 *  history. Returns the rules whose conditions are all true. */
export function evaluateRules(
  ctx: RuleFireContext,
  rules: ReadonlyArray<RuleDefinition> = LIVING_UNIVERSE_RULES,
): RuleDefinition[] {
  return rules.filter((r) => ruleFires(r, ctx));
}

/** Pure single-rule evaluator. Exported for tests. */
export function ruleFires(rule: RuleDefinition, ctx: RuleFireContext): boolean {
  for (const cond of rule.conditions) {
    if (!conditionMet(cond, ctx)) return false;
  }
  return true;
}

function conditionMet(cond: RuleCondition, ctx: RuleFireContext): boolean {
  if (cond.any) {
    const { polarity, minCount, threshold } = cond.any;
    const count = countDimsOverThreshold(ctx.pressure, polarity, threshold);
    if (count < minCount) return false;
  }
  if (cond.all) {
    const { dims, threshold } = cond.all;
    for (const d of dims) {
      if ((dimValue(ctx.pressure, d) ?? 0) < threshold) return false;
    }
  }
  if (cond.not) {
    const { dim, threshold } = cond.not;
    if ((dimValue(ctx.pressure, dim) ?? 0) >= threshold) return false;
  }
  if (cond.cooldownDays) {
    const last = ctx.lastFiredAt?.[cond.cooldownDays.ruleId];
    if (last !== undefined) {
      const now = ctx.now ?? Date.now();
      const elapsedDays = (now - last) / (1000 * 60 * 60 * 24);
      if (elapsedDays < cond.cooldownDays.days) return false;
    }
  }
  return true;
}

function countDimsOverThreshold(
  p: PressureSnapshot,
  polarity: "light" | "dark",
  threshold: number,
): number {
  let count = 0;
  for (const dim of Object.keys(DIMENSION_POLARITY) as PressureDimension[]) {
    if (DIMENSION_POLARITY[dim] !== polarity) continue;
    const v = dimValue(p, dim) ?? 0;
    if (v >= threshold) count++;
  }
  return count;
}

function dimValue(p: PressureSnapshot, dim: PressureDimension): number | undefined {
  switch (dim) {
    case "lightEnergy":
      return Math.max(0, p.cycleNet ?? 0);
    case "darkEnergy":
      return Math.max(0, -(p.cycleNet ?? 0));
    case "deaths":
      return p.deaths;
    case "viralExposures":
      return p.viralExposures;
    case "truthRevealed":
      return p.truthRevealed;
    case "healingDone":
      return p.healingDone;
    case "exploration":
      return p.exploration;
  }
}
