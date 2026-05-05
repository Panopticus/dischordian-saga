/**
 * Trigger shapes + Ability concrete type.
 *
 * This file finalizes the Ability type forward-declared in Card.ts. Kept in
 * a separate file so the schema imports form a DAG rather than a circular
 * tangle (Card -> forward Ability -> Trigger concretizes it, Effect doesn't
 * depend on Ability).
 *
 * The trigger queue (engine/triggerQueue.ts) tests each pending game Event
 * against the `Trigger` shape of every registered Ability, and enqueues
 * matching Abilities for deterministic APNAP resolution.
 */
import type { Condition, Effect } from "./Effect";
import type { TargetSelector } from "./Targeting";
import type { Keyword, Faction } from "./Card";
import type { AbilityId } from "./Ids";

/** Optional filter on what cards a trigger cares about. */
export interface CardFilter {
  cardType?: "unit" | "spell" | "artifact" | "structure";
  faction?: readonly Faction[];
  rarity?: readonly string[];
  keywords?: { has?: readonly Keyword[] };
  idPrefix?: string;
}

/** How often an activated ability can fire. */
export type ActivationCost =
  | { kind: "once_per_turn"; manaCost?: number }
  | { kind: "once_per_match"; manaCost?: number }
  | { kind: "per_use"; manaCost: number };

export type AuraRange =
  | { kind: "self" }
  | { kind: "adjacent" }
  | { kind: "radius"; n: number }
  | { kind: "same_row" }
  | { kind: "same_col" }
  | { kind: "friendly_side" }
  | { kind: "global" };

/** Discriminated union over all trigger shapes. */
export type Trigger =
  | { kind: "on_deploy" } // opening gambit
  | { kind: "on_cast" } // spells only; implicit
  | { kind: "on_death" } // dying wish
  | { kind: "on_damage_dealt"; by: "self" | "any_ally" | "any" }
  | { kind: "on_damage_taken" }
  | { kind: "on_kill"; of: "unit" | "general" | "any" }
  | { kind: "on_turn_start"; owner: "self" | "opponent" | "either" }
  | { kind: "on_turn_end"; owner: "self" | "opponent" | "either" }
  | { kind: "on_any_unit_dies"; filter?: CardFilter }
  | { kind: "on_card_drawn"; filter?: CardFilter }
  | { kind: "on_card_played"; filter?: CardFilter }
  | { kind: "on_move" }
  | { kind: "on_summoned_near_me"; filter?: CardFilter; radius: number }
  | { kind: "passive_aura"; range: AuraRange }
  | { kind: "activated"; cost: ActivationCost };

/** Concrete Ability type. Card.ts declares the slot; this resolves it. */
export interface ConcreteAbility {
  id: AbilityId;
  trigger: Trigger;
  condition?: Condition;
  /**
   * Required for single-target effects triggered by player action (e.g.
   * on_cast with a targeted effect). Engine uses this to prompt the player
   * or, for `chooser: "random"`, to roll via the match RNG.
   */
  targetSelector?: TargetSelector;
  effect: Effect;
}
