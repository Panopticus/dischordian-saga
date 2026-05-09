// apps/shared/dailyQuestAxisRouter.ts
//
// Axis-routed daily-quest selection — NPC depth #5.
//
// The shipping daily-quest router (apps/server/routers/dailyQuests.ts)
// picks quest templates flat — every player draws from the same pool
// regardless of who they have *been* in the saga so far. This module
// adds opt-in axis-weighted picking: each template is tagged with the
// PlayerAxis values it serves, and the picker weights templates higher
// when they match the player's axis magnitudes.
//
// The 7 axes (apps/shared/npcs/types.ts): aggression, mercy, curiosity,
// conformity, vigilance, vulnerability, wit. The player's per-axis
// magnitude lives in the citizen-trait subsystem; this module is pure
// (axes-in / picks-out) and the caller passes the player's magnitudes
// at call time, so no DB coupling here.
//
// Wiring is opt-in: the daily-quest router can keep its existing flat
// pick or call `pickAxisWeightedTemplates` instead. The two-mode design
// lets the team bring axis routing online incrementally without any
// flat-pool regressions.

import type { PlayerAxis, AxisMagnitude } from "./npcs/types";

/**
 * The shape of a daily-quest template, projected for axis-routing.
 * Mirrors the QuestTemplate interface in apps/server/routers/dailyQuests.ts
 * minus the reward fields the router fills at issue time, plus the
 * axis-tag set this module adds.
 */
export interface AxisTaggedQuestTemplate {
  id: string;
  questType: "fight" | "card_battle" | "trade" | "craft" | "explore" | "social";
  /**
   * The PlayerAxis values this template serves. A `fight` quest serves
   * `aggression` + `vigilance`; a `social` quest serves `mercy` +
   * `vulnerability`; etc. Templates may serve 0-N axes; the picker
   * treats untagged templates as neutral (weight = 1.0 baseline).
   */
  axes?: ReadonlyArray<PlayerAxis>;
}

/**
 * Default axis tagging by questType. The daily-quest router can apply
 * this to its templates wholesale via `tagByQuestType`, or override
 * per-template by setting `axes` directly on a template.
 *
 * Mappings are bible-grounded and intentionally conservative — better
 * to under-tag than to mis-tag. A template that doesn't match any
 * declared axis simply gets baseline weight from the picker.
 */
export const QUEST_TYPE_AXIS_DEFAULTS: Readonly<
  Record<AxisTaggedQuestTemplate["questType"], ReadonlyArray<PlayerAxis>>
> = {
  fight: ["aggression", "vigilance"],
  card_battle: ["wit", "vigilance"],
  trade: ["wit", "conformity"],
  craft: ["curiosity", "wit"],
  explore: ["curiosity", "vigilance"],
  social: ["mercy", "vulnerability"],
};

/**
 * Apply default axis tags to a template by questType. Idempotent —
 * templates with explicit `axes` keep their override. The result type
 * narrows `axes` to non-undefined so callers can rely on the field
 * being present.
 */
export function tagByQuestType<T extends AxisTaggedQuestTemplate>(
  template: T,
): T & { axes: ReadonlyArray<PlayerAxis> } {
  if (template.axes !== undefined) {
    return template as T & { axes: ReadonlyArray<PlayerAxis> };
  }
  return {
    ...template,
    axes: QUEST_TYPE_AXIS_DEFAULTS[template.questType],
  };
}

// --- Magnitude scoring ----------------------------------------------------

/**
 * Map AxisMagnitude tokens to a numeric weight contribution. The picker
 * sums these per template across the player's axis profile.
 *
 * Calibration:
 *   strong_*  ±3
 *   moderate_*  ±2
 *   mild_*  ±1
 *   neutral  0
 *
 * A template tagged with an axis where the player is `strong_positive`
 * gains +3 weight; a player who is `strong_negative` on that axis
 * loses -3 weight (the template is anti-themed for them). Templates
 * not tagged for an axis are unaffected by that axis's magnitude.
 */
export function magnitudeContribution(magnitude: AxisMagnitude): number {
  switch (magnitude) {
    case "strong_positive":
      return 3;
    case "moderate_positive":
      return 2;
    case "mild_positive":
      return 1;
    case "neutral":
      return 0;
    case "mild_negative":
      return -1;
    case "moderate_negative":
      return -2;
    case "strong_negative":
      return -3;
  }
}

/**
 * Compute a template's weight for a player given their per-axis
 * magnitudes. Untagged templates always return the baseline (1).
 *
 * Weight formula:
 *   weight = max(0.1, baseline + Σ contribution(axis_magnitudes[axis]))
 *
 * The `0.1` floor keeps even strongly-mismatched templates eligible
 * at low probability — the world should never feel hard-gated; it
 * should feel *biased*.
 */
export function templateWeight(
  template: AxisTaggedQuestTemplate,
  axes: Readonly<Partial<Record<PlayerAxis, AxisMagnitude>>>,
  baseline = 1,
): number {
  if (!template.axes || template.axes.length === 0) return baseline;
  let weight = baseline;
  for (const axis of template.axes) {
    const mag = axes[axis];
    if (mag) weight += magnitudeContribution(mag);
  }
  return Math.max(0.1, weight);
}

// --- Picker ---------------------------------------------------------------

export interface PickAxisWeightedOptions {
  /** Number of templates to pick. */
  count: number;
  /** Player's per-axis magnitudes. Missing axes treated as neutral. */
  axes: Readonly<Partial<Record<PlayerAxis, AxisMagnitude>>>;
  /**
   * Templates that have already been picked recently and should be
   * suppressed. Useful to avoid the same player getting the same
   * template every cycle. The router supplies this from the player's
   * recent-quest history.
   */
  suppressIds?: ReadonlySet<string>;
  /** Random source — defaults to Math.random; injectable for tests. */
  random?: () => number;
}

/**
 * Pick `count` templates without replacement, weighted by axis match.
 * Returns the picked templates in pick order. If `count > pool.length`
 * (after suppression), returns as many as possible.
 */
export function pickAxisWeightedTemplates<T extends AxisTaggedQuestTemplate>(
  pool: ReadonlyArray<T>,
  options: PickAxisWeightedOptions,
): T[] {
  const random = options.random ?? Math.random;
  const suppress = options.suppressIds ?? new Set<string>();

  // Filter out suppressed templates; tag any untagged via questType
  // defaults so the picker sees a uniformly axis-aware pool.
  const candidates = pool
    .filter(t => !suppress.has(t.id))
    .map(t => tagByQuestType(t) as T);

  const picked: T[] = [];
  const remaining = [...candidates];
  for (let i = 0; i < options.count && remaining.length > 0; i++) {
    const weights = remaining.map(t => templateWeight(t, options.axes));
    const total = weights.reduce((a, b) => a + b, 0);
    if (total <= 0) break;
    let roll = random() * total;
    let pickIdx = 0;
    for (let j = 0; j < weights.length; j++) {
      roll -= weights[j];
      if (roll <= 0) {
        pickIdx = j;
        break;
      }
    }
    picked.push(remaining[pickIdx]);
    remaining.splice(pickIdx, 1);
  }
  return picked;
}
