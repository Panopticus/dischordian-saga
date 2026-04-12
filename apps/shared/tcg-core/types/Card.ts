/**
 * Static card definition + runtime card instance shapes.
 *
 * A CardDefinition is the authored data living in
 * apps/shared/tcg-core/cards/definitions/{faction}/{id}_{slug}.ts. One file
 * per card. The loader validates every definition with Zod at startup and
 * builds the CardRegistry.
 *
 * A CardInstance is the runtime state of a card in play — each live unit on
 * the board has one, each card in a hand has one. It carries a reference to
 * its definition plus any runtime deltas (current stats, buffs, counters,
 * position, exhaustion, etc.).
 */
import type { AbilityId, CardDefId, EntityId, Side } from "./Ids";

export type Faction =
  | "architect"
  | "dreamer"
  | "insurgency"
  | "new_babylon"
  | "antiquarian"
  | "thought_virus"
  | "neutral";

export type CardType = "general" | "unit" | "spell" | "artifact" | "structure";

export type Rarity = "basic" | "common" | "rare" | "epic" | "legendary";

/**
 * Engine-recognized keyword set. Keywords are sugar over abilities; the
 * effect interpreter treats keywords as pre-registered ability templates.
 *
 * The authoritative list lives here; ESLint warns on unknown keyword strings
 * in card definitions via the Zod schema.
 */
export type Keyword =
  | "rush" // may act the turn it's summoned
  | "ranged" // may attack any tile, takes no counterattack
  | "flying" // may move to any empty tile
  | "provoke" // adjacent enemies must target this
  | "celerity" // two actions per turn
  | "blast" // attack hits all enemies in a line
  | "frenzy" // attacks hit all enemies adjacent to target
  | "rebirth" // on death, leaves a 0/1 egg that hatches next turn
  | "forcefield" // absorbs the first damage instance this turn
  | "airdrop" // may be summoned on any empty tile
  | "deathwatch" // triggers when any unit dies
  | "infiltrate" // bonus while on enemy side of the board
  | "grow" // gains stats at start of owner's turn
  | "backstab" // bonus damage attacking from behind
  | "zeal" // bonus while adjacent to friendly general
  | "dispel" // strips ongoing effects on hit
  | "stun" // cannot act next turn
  | "structure" // cannot move or attack
  | "ephemeral" // dies at end of owner's turn
  | "untargetable" // cannot be chosen as a single target
  | "ignore_armor_3" // pierces 3 flat armor (Agent Zero & friends)
  | "can_attack_this_turn" // runtime flag used by rush
  | "taunt"; // alias for provoke; folded into provoke at load time

/**
 * Authored card definition. Serializable — no functions. All ability logic
 * lives in effect trees (see types/Effect.ts + types/Trigger.ts).
 */
export interface CardDefinition {
  id: CardDefId;
  name: string;
  faction: Faction;
  cardType: CardType;
  rarity: Rarity;
  /** Mana cost. Generals are 0; runtime validation ensures non-general > 0. */
  cost: number;
  /** Units/artifacts only. Spells have undefined base stats. */
  baseStats?: { power: number; health: number };
  /**
   * Intrinsic keywords. Engine treats keywords as pre-built ability
   * templates; the loader compiles them into the ability list.
   */
  keywords: readonly Keyword[];
  /** Authored ability trees. See types/Trigger.ts for the shape. */
  abilities: readonly Ability[];
  /** Art reference. Content-hashed path into the CDN. */
  art: string;
  /** Pure flavor, no mechanical effect. */
  flavorText: string;
  /** Minimum RULES_VERSION this card was authored against. */
  rulesVersion: string;
  /**
   * Optional: for artifacts, default durability if not otherwise set by
   * abilities. Spells and units ignore this.
   */
  artifactDurability?: number;
}

/** Forward-declared. Full shape lives in types/Trigger.ts. */
export interface Ability {
  id: AbilityId;
  // Actual fields declared in Trigger.ts to avoid circular imports.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  targetSelector?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  effect: any;
}

/**
 * Runtime card instance. Every live card — whether in a hand, in a deck, in
 * a graveyard, or deployed on the board — has one of these. Deployed units
 * additionally have a BoardEntity that references back to their CardInstance.
 */
export interface CardInstance {
  entityId: EntityId;
  defId: CardDefId;
  owner: Side;
  /** Current-state base stats before buffs — units only. */
  currentPower: number;
  currentHealth: number;
  maxHealth: number;
  /** Flat counters keyed by name (e.g. "forcefield_charges", "stealth_turns"). */
  counters: Record<string, number>;
  /** Runtime keywords: intrinsic + granted + debuffed. */
  activeKeywords: readonly Keyword[];
  /** Active buffs tracked by source for proper dispel semantics. */
  buffs: readonly Buff[];
  /**
   * Per-card-instance flag set. Free-form; used by the effect interpreter
   * for things like "already resurrected once" or "already grew this turn".
   */
  flags: Record<string, boolean>;
}

export interface Buff {
  source: string;
  powerDelta: number;
  healthDelta: number;
  /** Turn number this buff expires at, or -1 for permanent. */
  expiresAtTurn: number;
}
