/**
 * Effect-tree schema — the heart of data-driven card authoring.
 *
 * Every card's mechanical identity is expressed as a tree of composable
 * primitives. The engine's effectInterpreter walks the tree and applies each
 * leaf to the game state. No per-card code, no hard-coded switch on card id.
 *
 * This file exports *only* the schema. Execution semantics live in
 * engine/effectInterpreter.ts. Targeting resolution lives in
 * engine/targeting.ts. Ability triggering lives in engine/triggerQueue.ts.
 *
 * Design principles:
 *  1. No functions in serialized form — everything is plain data so it
 *     round-trips through JSON and can be authored as .ts literals that
 *     Zod-validate at load time.
 *  2. Composable. `sequence`, `if`, `foreach`, `with_target` let authors
 *     build complex cards from primitives.
 *  3. Polymorphic amounts. `Amount` can be a constant, X-cost, a count of
 *     something on the board, or missing-health of a target — this is how
 *     "deal damage equal to allies" works without special-casing.
 */
import type { Keyword, Faction } from "./Card";
import type { TargetSelector } from "./Targeting";

/* ─── Amounts ─── */

/**
 * Polymorphic integer amount. Evaluated by the effect interpreter in the
 * context of the currently-executing effect, with reference to trigger
 * source/victim and the current TargetRef resolution.
 */
export type Amount =
  | { kind: "const"; value: number }
  | { kind: "x_cost" }
  | { kind: "count_of"; filter: UnitFilter }
  | { kind: "missing_health"; of: TargetRef }
  | { kind: "counter_of"; counter: string; of: TargetRef };

/** Where we can point in effect-tree context. */
export type TargetRef =
  | { kind: "self" } // the card whose ability is firing
  | { kind: "it" } // inner ref inside with_target / foreach
  | { kind: "previous_target" }
  | { kind: "trigger_source" }
  | { kind: "trigger_victim" }
  | { kind: "friendly_general" }
  | { kind: "enemy_general" };

/* ─── Filters (shared with Targeting) ─── */

export interface UnitFilter {
  controller?: "self" | "opponent" | "any";
  keywords?: { has?: readonly Keyword[]; lacks?: readonly Keyword[] };
  faction?: readonly Faction[];
  minStats?: { power?: number; health?: number };
  maxStats?: { power?: number; health?: number };
  except?: "self";
  /** Match by card definition id or a prefix (e.g. "s1_spell_"). */
  idPrefix?: string;
}

/* ─── Stat deltas ─── */

export interface StatDelta {
  power?: number;
  health?: number;
}

/* ─── Duration ─── */

export type Duration =
  | { kind: "permanent" }
  | { kind: "this_turn" }
  | { kind: "until_end_of_opponent_turn" }
  | { kind: "n_turns"; n: number };

/* ─── Primitive ops ─── */

export type EffectOp =
  // Damage / healing
  | { op: "deal_damage"; amount: Amount; to: TargetRef }
  | { op: "heal"; amount: Amount; to: TargetRef }
  // Stat changes
  | { op: "buff"; stats: StatDelta; duration: Duration; to: TargetRef }
  | { op: "debuff"; stats: StatDelta; duration: Duration; to: TargetRef }
  // Keywords
  | { op: "grant_keyword"; keyword: Keyword; duration: Duration; to: TargetRef }
  | { op: "remove_keyword"; keyword: Keyword; to: TargetRef }
  // Hand / deck manipulation
  | { op: "draw"; amount: Amount; who: "self" | "opponent" }
  | { op: "discard"; amount: Amount; from: "self" | "opponent"; mode: "random" | "choose" }
  | { op: "mill"; amount: Amount; who: "self" | "opponent" }
  | { op: "return_to_hand"; to: TargetRef; owner: "original" | "self" }
  // Board manipulation
  | { op: "summon"; tokenId: string; at: PositionSelector; controller: "self" | "opponent" }
  | { op: "transform"; into: string; to: TargetRef }
  | { op: "destroy"; to: TargetRef }
  | { op: "dispel"; to: TargetRef }
  | { op: "silence"; to: TargetRef }
  | { op: "stun"; duration: Duration; to: TargetRef }
  | { op: "teleport"; target: TargetRef; to: PositionSelector }
  | { op: "push"; target: TargetRef; direction: DirectionRef; distance: number }
  // Resource
  | { op: "gain_mana"; amount: Amount; permanent: boolean }
  // Counters
  | { op: "add_counter"; kind: string; amount: number; to: TargetRef }
  | { op: "reset_counter"; counter: string; to: TargetRef };

/* ─── Control flow ─── */

export type Effect =
  | EffectOp
  | { op: "sequence"; steps: readonly Effect[] }
  | { op: "if"; cond: Condition; then: Effect; else?: Effect }
  | {
      op: "foreach";
      over: TargetSelector;
      /** Reference to `{kind: "it"}` inside the sub-effect. */
      do: Effect;
    }
  | {
      op: "choose_one";
      options: ReadonlyArray<{ text: string; effect: Effect }>;
    }
  | { op: "repeat"; times: Amount; do: Effect }
  | { op: "sacrifice_then"; sac: TargetSelector; then: Effect }
  | { op: "with_target"; selector: TargetSelector; do: Effect };

/* ─── Conditions ─── */

export type Condition =
  | { kind: "allies_with"; filter: UnitFilter; op: "gte" | "lte" | "eq"; count: number }
  | { kind: "self_damaged" }
  | { kind: "self_at_health"; op: "gte" | "lte"; value: number }
  | { kind: "counter_gte"; counter: string; value: number }
  | { kind: "mana_available"; amount: number }
  | { kind: "target_exists"; selector: TargetSelector }
  | { kind: "and"; all: readonly Condition[] }
  | { kind: "or"; any: readonly Condition[] }
  | { kind: "not"; c: Condition };

/* ─── Positions & directions ─── */

export type PositionSelector =
  | { kind: "origin_offset"; dRow: number; dCol: number }
  | { kind: "random_empty"; within?: { row: number; col: number; radius: number } }
  | { kind: "specific"; row: number; col: number };

export type DirectionRef =
  | { kind: "away_from_source" }
  | { kind: "toward_friendly_general" }
  | { kind: "specific"; dRow: number; dCol: number };
