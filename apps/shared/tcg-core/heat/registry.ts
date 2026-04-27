/* ═══════════════════════════════════════════════════════
   HEAT — per-run modifiers (#1 from the AAA review roadmap).

   Hades-style "Heat" / Slay-the-Spire-style "Ascension":
   layer per-run modifiers on top of the handcrafted Act 1
   ladder so the same authored encounters stay fresh across
   replays. The mutators themselves are pure data; engine
   integration (the reducer hooks that fire each `trigger`)
   is a separate follow-up so this module is safe to author
   and review without touching the rules engine.

   Design notes:

   - Each modifier has a `cost` in [1..3] heat points. The
     player's current Heat is the sum of selected modifier
     costs, so a Heat-5 run might be (cost-3 modifier +
     cost-2 modifier) or (cost-2 + cost-2 + cost-1).

   - `unlockTier` is the lowest Heat the player must have
     reached on a previous run to see this modifier in
     selection. New players start at 0 and unlock tiers as
     they clear runs. Mirrors Hades' "Pact of Punishment"
     unlock cadence.

   - `category` groups modifiers thematically so the UI can
     surface diversified choices ("pick one offensive +
     one defensive") instead of degenerate stacks.

   - Every modifier carries a one-line `flavor` string —
     this is shipping copy, not placeholder. The Antiquarian
     reads each modifier as a recorded Witness Council
     decree; engineering note: keep flavor under 80 chars
     so the mutator card UI doesn't wrap awkwardly.
   ═══════════════════════════════════════════════════════ */

/** Engine integration points. The Phase-2 reducer hook will inspect
 *  the active modifier list and dispatch per-modifier effects when
 *  the matching trigger fires. Adding a trigger here without an
 *  engine handler in Phase 2 is a no-op (the modifier still appears
 *  in selection but does nothing); the test suite asserts every
 *  registry modifier uses one of these values. */
export type ModifierTrigger =
  | "match-start"
  | "turn-start"
  | "card-played"
  | "damage-dealt"
  | "minion-deployed"
  | "match-end";

/** Thematic groupings. The UI can present the catalog filtered by
 *  category, and the selector helper diversifies picks across
 *  categories at higher heat levels so Heat-10 doesn't degenerate
 *  to "5x time-pressure mutators". */
export type ModifierCategory =
  | "offensive"
  | "defensive"
  | "economy"
  | "time-pressure"
  | "chaos"
  | "narrative";

export interface Modifier {
  /** Stable kebab-case id. Persisted to game_replays.tags so a
   *  replay's heat configuration survives schema migrations. */
  id: string;
  /** UI display name — Title Case, no punctuation. */
  name: string;
  /** Player-facing one-line explanation of what the modifier does. */
  description: string;
  /** In-fiction one-liner. Shipping copy; ≤80 chars to avoid wrap. */
  flavor: string;
  /** Heat budget cost. Higher = more disruptive. */
  cost: 1 | 2 | 3;
  /** Lowest cumulative Heat the player must have cleared on a prior
   *  run to see this modifier in selection. 0 = always available. */
  unlockTier: number;
  /** Reducer hook the engine fires for this modifier. */
  trigger: ModifierTrigger;
  /** Thematic category — for UI grouping + selector diversification. */
  category: ModifierCategory;
}

/** Maximum Heat the cap the player can stack in one run. Mirrors
 *  Hades' Heat 32 cap (the game ships 32 unique mutators). We start
 *  conservative — the registry below ships 8 mutators, and the cap
 *  rises as more mutators land. */
export const MAX_HEAT_LEVEL = 12;

/** Hard ceiling on a single modifier's cost. Anything bigger than 3
 *  becomes a "boss modifier" that should be its own affix system. */
export const MAX_MODIFIER_COST = 3;

/** Starter registry. Eight mutators across the six categories so the
 *  selector can satisfy the "diversified picks" contract at Heat ≥ 4
 *  (where the UI starts forcing one pick per category). Phase-2
 *  engine integration will wire the trigger hooks to actual reducer
 *  effects; until then the registry is the contract these depend on. */
export const HEAT_MODIFIERS: readonly Modifier[] = [
  // ─── Offensive (pressure the player) ───
  {
    id: "extra-mana-on-turn-4",
    name: "The Architect's Patience Wanes",
    description: "Enemy gains +1 mana starting on turn 4.",
    flavor: "Patience is a measurement, and the measurement is exhausted.",
    cost: 2,
    unlockTier: 0,
    trigger: "turn-start",
    category: "offensive",
  },
  {
    id: "enemy-minions-rush",
    name: "Insurgent Cadre",
    description: "Enemy minions enter with Rush.",
    flavor: "The Cadre does not wait for permission. The Cadre is permission.",
    cost: 3,
    unlockTier: 4,
    trigger: "minion-deployed",
    category: "offensive",
  },

  // ─── Defensive (limit the player) ───
  {
    id: "minions-cost-plus-one-undamaged",
    name: "Hierarchy Tax",
    description: "Your minions cost +1 mana while they are undamaged.",
    flavor: "Pristine assets pay tribute. The Hierarchy is pleased.",
    cost: 2,
    unlockTier: 1,
    trigger: "card-played",
    category: "defensive",
  },
  {
    id: "no-healing",
    name: "Sealed Vessel",
    description: "Healing effects are halved (rounded down).",
    flavor: "Some wounds were always going to scar. The Vessel remembers.",
    cost: 2,
    unlockTier: 2,
    trigger: "damage-dealt",
    category: "defensive",
  },

  // ─── Economy (warp resources) ───
  {
    id: "expensive-spells",
    name: "The Prison's Ledger",
    description: "Your spells cost +1 mana.",
    flavor: "Every word is a debt. Every silence is a deferral.",
    cost: 1,
    unlockTier: 0,
    trigger: "card-played",
    category: "economy",
  },

  // ─── Time pressure ───
  {
    id: "architect-interrupts-turn-6",
    name: "The Architect Interrupts",
    description:
      "On turn 6, you skip your draw and your next minion costs +2.",
    flavor: "A measurement was performed. The result was you.",
    cost: 3,
    unlockTier: 3,
    trigger: "turn-start",
    category: "time-pressure",
  },

  // ─── Chaos (random / RNG) ───
  {
    id: "shuffled-mulligan",
    name: "Static Interference",
    description: "Your opening hand is drawn from a shuffled-once deck.",
    flavor: "The Source's Static rearranges your stratagem. It rearranges you.",
    cost: 1,
    unlockTier: 0,
    trigger: "match-start",
    category: "chaos",
  },

  // ─── Narrative (in-fiction stakes; non-mechanical flavor for future) ───
  {
    id: "antiquarian-records-loss",
    name: "The Antiquarian is Watching",
    description:
      "On loss, this match is recorded in the canon Witness ledger as Failure-Pattern.",
    flavor: "I will write you down. I will not soften what you were.",
    cost: 1,
    unlockTier: 0,
    trigger: "match-end",
    category: "narrative",
  },
];

/** Lookup-by-id (returns undefined for unknown). Cheap because the
 *  registry is small; a Map is overkill until we hit ~50+ modifiers. */
export function getModifier(id: string): Modifier | undefined {
  return HEAT_MODIFIERS.find((m) => m.id === id);
}

/** Sum the costs of a modifier id list. Returns null when any id is
 *  unknown so the caller can surface the offending row before it
 *  ships to the engine. */
export function totalHeatCost(ids: readonly string[]): number | null {
  let total = 0;
  for (const id of ids) {
    const m = getModifier(id);
    if (!m) return null;
    total += m.cost;
  }
  return total;
}

export interface HeatConfig {
  /** Selected modifier ids in declaration order. */
  modifierIds: readonly string[];
  /** Total cost — invariant: == totalHeatCost(modifierIds). */
  totalCost: number;
}

export type HeatValidationResult =
  | { ok: true; config: HeatConfig }
  | {
      ok: false;
      reason:
        | "unknown-modifier"
        | "duplicate-modifier"
        | "exceeds-cap"
        | "exceeds-max-level";
      detail: string;
    };

/** Validate a candidate Heat selection: all ids known, no
 *  duplicates, total cost within the cap. Used at "lock-in" time
 *  before a match starts, and as a defensive guard in any flow that
 *  loads a saved Heat selection (e.g. resume-on-reconnect). */
export function validateHeatConfig(
  modifierIds: readonly string[],
  cap: number = MAX_HEAT_LEVEL,
): HeatValidationResult {
  if (cap > MAX_HEAT_LEVEL) {
    return {
      ok: false,
      reason: "exceeds-max-level",
      detail: `cap ${cap} exceeds MAX_HEAT_LEVEL=${MAX_HEAT_LEVEL}`,
    };
  }

  const seen = new Set<string>();
  let total = 0;
  for (const id of modifierIds) {
    if (seen.has(id)) {
      return {
        ok: false,
        reason: "duplicate-modifier",
        detail: `modifier '${id}' appears more than once`,
      };
    }
    seen.add(id);
    const m = getModifier(id);
    if (!m) {
      return {
        ok: false,
        reason: "unknown-modifier",
        detail: `modifier '${id}' not in HEAT_MODIFIERS`,
      };
    }
    total += m.cost;
  }
  if (total > cap) {
    return {
      ok: false,
      reason: "exceeds-cap",
      detail: `total cost ${total} > cap ${cap}`,
    };
  }
  return {
    ok: true,
    config: { modifierIds, totalCost: total },
  };
}

/** Return the modifiers visible to a player at a given unlock tier
 *  (i.e. they've cleared a run at this Heat or higher). Used by the
 *  selection UI to filter the catalog. */
export function modifiersUnlockedAtTier(
  highestClearedTier: number,
): readonly Modifier[] {
  return HEAT_MODIFIERS.filter((m) => m.unlockTier <= highestClearedTier);
}
