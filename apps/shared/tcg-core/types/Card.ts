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

export type Rarity = "basic" | "common" | "uncommon" | "rare" | "epic" | "legendary";

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
  | "taunt" // alias for provoke; folded into provoke at load time
  | "drain" // heals owner for a percentage of damage dealt
  | "pierce" // ignores a portion of enemy armor
  | "overcharge" // deals bonus damage on first attack, then self-damages
  | "fury" // attacks hit with extra ferocity (multi-attack)
  | "pack" // gains bonuses from allied units of the same type
  | "rally_buff" // on deploy, buffs adjacent friendly units
  | "resurrect"; // returns to the field once after death

/**
 * Trial-phase category tags used by §5.8 Authority match (Act 1 finale).
 * Each tag describes how the card is *admissible* during a specific phase
 * of the canonical Empire judicial proceeding the §5.8 match models.
 *
 * A card may have multiple categories — e.g. a card that is both a
 * defensive play in turn 1's charge phase and an admissible evidence-
 * category play in turns 3–5. Cards with no trial_categories are
 * unplayable in every restricted §5.8 phase and are only available in
 * the all-categories-permitted phases (none exist in §5.8's current
 * spec — see docs/production/act1/authority-trial-phase-mechanic.md §2).
 *
 * Back-fill status: new optional field as of April 2026. Existing
 * cards default to empty (unplayable in §5.8). Act 1 card-pool
 * backfill planned in a follow-up pass before §5.8 runtime ships.
 */
export type TrialCategory =
  | "defensive"   // phase 1 (charge)
  | "offensive"   // no §5.8 phase permits these; reserved for tooling
  | "narrative"   // phases 2 (opening argument) + 9 (closing argument)
  | "evidence"    // phases 3–5 (evidence presentation)
  | "reactive"    // phases 6–8 (cross-examination)
  | "confession"; // phase 7 (cross-exam second) only — insurgency lean

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
  /**
   * Optional: player-class restriction (Phase B7). When set, the
   * card may only be added to decks built by players of the given
   * character class. Enforced at deck-validation time by the
   * format validator (Phase B8). Omitting the field leaves the
   * card class-neutral.
   */
  characterClass?: "spy" | "oracle" | "assassin" | "engineer" | "soldier" | "neyon";
  /**
   * Optional: Act 1 §5.8 Authority trial-phase admissibility tags.
   * Omitting the field (or providing an empty array) makes the card
   * unplayable in every restricted §5.8 phase. See
   * docs/production/act1/authority-trial-phase-mechanic.md for the
   * phase-to-category mapping.
   */
  trial_categories?: readonly TrialCategory[];
  /**
   * Optional: marks the card as Warlord-deck-only. The deck builder
   * filters these out of every player-buildable pool; they appear
   * only in scripted opponent decks (currently §5.5 Warlord Zero).
   * See docs/production/act1/warlord-three-move-mechanic.md §6.1.
   */
  warlord_only?: true;
  /**
   * Optional: the card's contribution to the §5.8 verdict-stream
   * balance when played during an Authority trial. Integer in the
   * range [-3, +3] per the spec's "public delta" phrasing; positive
   * values push the balance toward Overturn, negative toward
   * Sentence Passed. Absent values default to +1 per
   * engine/trialPhase.ts's PLACEHOLDER_PLAY_DELTA — authoring a real
   * value per card refines §5.8 balance beyond the placeholder
   * (spec §7 open design item "per-card delta authoring").
   *
   * Heuristic for the initial backfill (see balance/verdictDelta
   * Proposer.ts): defensive 0/+1, evidence +1/+2, narrative +1,
   * reactive +1, confession -2 (trade-off), uncategorized 0. Offensive-
   * only cards don't appear in §5.8 (no phase admits them), so their
   * delta is never read — proposer still emits 0 for completeness.
   */
  verdict_delta?: number;
  /**
   * Optional §5.7 public-witness override. When set, the card's
   * public-record delta diverges from its private (verdict_delta)
   * impact — the divergence drives the TranscriptColumn's
   * rust-orange warning border (spec §3: "private good, public bad"
   * or vice versa). Absent → public delta defaults to verdict_delta
   * (public and private agree; no divergence).
   *
   * Integer, same [-3, +3] range as verdict_delta. See
   * engine/publicWitness.ts applyPublicWitnessPlay.
   */
  public_delta?: number;
  /**
   * Optional: marks a card as reserved-from-pools — not available via
   * normal pack openings, deck-builder UIs, or reward drops. Reserved
   * cards still load into the CardRegistry (so the engine can resolve
   * their effects when the card lands via a scripted route), but every
   * card-enumeration surface must filter them out.
   *
   * Current use: `burnt_card_placeholder` — the §4.9 Seer winnable-path
   * card delivered retroactively via Acts 2+ unlock routes (spec §3.3
   * "not discoverable on first playthrough"). Surfacing it in a
   * normal pack would break the §4.9 canon.
   *
   * Deck-builder + pack-opening code filters on this flag via
   * `isReservedCard(def)` / `filterReservedFromPool(defs)`.
   */
  reserved?: true;
  /**
   * Optional: which release/expansion this card belongs to. Authors
   * may leave this absent — the registry loader (cards/loader.ts)
   * backfills it from the id prefix at startup ("s1_*" → "S1_MEMOIR",
   * "s2_*" → "S2_HIERARCHY", "act{1..7}_*" → "ACT_EXCLUSIVES").
   *
   * The Format.allowedSets gate (formats/standard.ts + validateDeck)
   * uses this field to keep S2 cards out of the S1-only standard
   * format until the rotation ships. See sets/setCode.ts for the
   * full type union and derivation rules.
   */
  setCode?: import("../sets/setCode").SetCode;
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
  /**
   * Runtime keywords: intrinsic + granted + debuffed.
   * Not declared `readonly` because Immer's Draft<T> unwraps readonly
   * arrays and plain-array assignments into draft slots become
   * structurally incompatible. Immutability in practice is enforced by
   * the reducer's Immer wrapper, not by this annotation.
   */
  activeKeywords: Keyword[];
  /** Active buffs tracked by source for proper dispel semantics. */
  buffs: Buff[];
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
