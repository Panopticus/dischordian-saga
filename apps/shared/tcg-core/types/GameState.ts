/**
 * Canonical game state.
 *
 * GameState is the single source of truth for a match. It is:
 *  - Deterministic: every field is serializable, every field is persisted
 *    to the replay log, every operation on it is driven by (action, rngState).
 *  - Immutable (in contract): reducer callers must treat the state they
 *    received as frozen. In dev, `Object.freeze` enforces it.
 *  - Small: we keep it around a few hundred objects per match so both Immer
 *    and the canonical hasher stay cheap.
 *
 * The board is stored as a flat record keyed by "r,c" position string for
 * fast lookup; iteration order is deterministic because we sort on use. We
 * do NOT use JS Map here because JSON round-tripping is lossy for Map.
 */
import type { CardInstance, Faction, CardDefinition } from "./Card";
import type { EntityId, PlayerId, Side } from "./Ids";
import type { ScriptedAction } from "./ScriptedAction";
import type { TrialState } from "./TrialPhase";
import type { ProgrammerGiftState } from "./ProgrammerGift";
import type { PublicWitnessState } from "./PublicWitness";
import type { SeerProphecyState } from "./SeerProphecy";
import type { StakesState } from "./StakesMode";

/** 9-wide, 5-tall board. Coordinates are (row 0..4, col 0..8). */
export const BOARD_WIDTH = 9;
export const BOARD_HEIGHT = 5;
export const MAX_MANA = 9;
export const STARTING_MANA = 2;
export const MAX_HAND = 6;
export const MAX_ARTIFACTS = 3;
export const GENERAL_HP = 25;
export const DECK_SIZE = 40; // including general
export const MULLIGAN_HAND_SIZE = 5;

/** "row,col" key into GameState.board. */
export type PosKey = string;

export function posKey(row: number, col: number): PosKey {
  return `${row},${col}`;
}

export function parsePosKey(k: PosKey): { row: number; col: number } {
  const i = k.indexOf(",");
  return { row: Number(k.slice(0, i)), col: Number(k.slice(i + 1)) };
}

/** A unit, general, or structure deployed on the board. */
export interface BoardEntity {
  entityId: EntityId;
  /** Full runtime card instance. */
  card: CardInstance;
  row: number;
  col: number;
  /** Units with celerity get 2; most get 1; exhausted start at 0 for turn. */
  actionsRemaining: number;
  hasMoved: boolean;
  hasAttacked: boolean;
  /** General only. */
  isGeneral: boolean;
  /** Temporary this-turn flags used by combat and movement. */
  isStunned: boolean;
}

/**
 * Per-player state.
 *
 * Array fields (deck/hand/graveyard/artifacts) are declared mutable — not
 * because the reducer mutates them in place, but because Immer's
 * `WritableDraft<T>` unwraps `readonly` arrays and plain-array assignments
 * into draft slots would otherwise be structurally incompatible. The
 * immutability contract is enforced by the reducer's Immer wrapper, not
 * by readonly annotations.
 */
export interface PlayerState {
  userId: PlayerId;
  faction: Faction;
  /** CardInstance at index 0 is always the general (also tracked in board). */
  generalEntityId: EntityId;
  /** Cards still in deck. Order matters — it's the draw pile. */
  deck: CardInstance[];
  hand: CardInstance[];
  graveyard: CardInstance[];
  /** Hand-equipped artifacts (apply to general). */
  artifacts: ArtifactInstance[];
  mana: number;
  maxMana: number;
  /** Once per match: the general's Bloodborn spell. */
  bloodbornUsed: boolean;
  /** Once per turn: replace a card in hand. */
  replaceUsed: boolean;
}

export interface ArtifactInstance {
  entityId: EntityId;
  defId: string;
  durability: number;
}

/** Top-level match state. */
export interface GameState {
  /** Stable match identity. */
  matchId: string;
  /** Minor version of the ruleset the match is locked to. */
  rulesVersion: string;
  /** Seeded PRNG state — see engine/rng.ts. */
  rngState: string;
  /** The one-shot seed the match was created with (for replay & logging). */
  seed: string;
  /** Board map. Sorted by row-major order when iterated canonically. */
  board: Readonly<Record<string, BoardEntity>>;
  players: readonly [PlayerState, PlayerState];
  currentPlayer: Side;
  turnNumber: number;
  phase: GamePhase;
  winner: Side | null;
  winReason: WinReason | null;
  /** In-flight trigger queue — see engine/triggerQueue.ts. */
  triggerQueue: PendingTrigger[];
  /** Monotonic action sequence counter for client-server dedup. */
  actionSeq: number;
  /**
   * Monotonic counter used to mint deterministic entity ids. Every new
   * BoardEntity / CardInstance takes its id from
   *     `e_${matchId}_${nextEntityCounter++}`
   * guaranteeing replay-stable entity naming without RNG burn. Persisted
   * on GameState so forward progress survives snapshotting.
   */
  nextEntityCounter: number;
  /**
   * Optional: §5.5 Warlord three-move lockout state. Present only during
   * the lockout window (Warlord's turn 3 cast → end of player's turn 6).
   * Absent on every other match. Populated by engine/lockout.ts. See
   * docs/production/act1/warlord-three-move-mechanic.md.
   */
  lockout?: WarlordLockoutState;
  /**
   * Optional: scripted-action queue copied from MatchConfig at match
   * init. Drained by engine/scriptedActions.ts after each turn refresh.
   * Empty / absent on standard PvP matches; populated on story
   * encounters that need set-piece plays (the §5.5 Warlord Three
   * Moves cast on turn 3 is the canonical case).
   */
  scriptedActions?: readonly ScriptedAction[];
  /**
   * Optional: §5.8 Authority trial state. Present only on §5.8 matches
   * (initialized via MatchConfig.trialMode). Each match turn IS a trial
   * phase; phase number === turnNumber. Populated by engine/trialPhase.ts.
   * See docs/production/act1/authority-trial-phase-mechanic.md.
   */
  trial?: TrialState;
  /**
   * Optional: §5.6 Programmer gift state. Present only on §5.6 matches
   * (initialized via MatchConfig.giftMode). Populated + transitioned
   * by engine/programmerGift.ts. Acts 2+ codex variants read the
   * terminal state via the PROGRAMMER_GIFT_ACCEPTED_FLAG campaign flag.
   * See ACT1_NARRATIVE_STRUCTURE.md §5.6.
   */
  programmerGift?: ProgrammerGiftState;
  /**
   * Optional: §5.7 Game Master public-witness state. Present only
   * on §5.7 matches (initialized via MatchConfig.witnessMode). Each
   * Game Master card play appends a PublicWitnessEntry and updates
   * the clipped running balance. The final balance is handed off to
   * the §5.8 Authority trial as openingVerdictBalance via
   * deriveAuthorityVerdictOffset. See engine/publicWitness.ts +
   * docs/production/act1/public-witness-ui-spec.md.
   */
  publicWitness?: PublicWitnessState;
  /**
   * Optional: §4.9 Seer prophecy state. Present only on §4.9
   * matches (initialized via MatchConfig.prophecyMode). Holds the
   * "pending future" bake and play counter; transitions via
   * engine/seerProphecy.ts. Spec §3: the pending future is
   * one-directional from engine to board — card effects can read
   * but not write. See docs/production/act1/seer-prophecy-mechanic.md.
   */
  seerProphecy?: SeerProphecyState;
  /**
   * Optional: multi-axis Stakes Stream state. Present only on
   * encounters that opt in via `StoryEncounter.stakesMode` →
   * forwarded into MatchConfig.stakesMode. Initialized in
   * engine/init.ts; mutated by engine/stakesReducer.ts on each
   * authored card play whose `stakes_deltas` (or legacy
   * `verdict_delta` fallback) touches a declared axis.
   *
   * Coexists with `trial` / `publicWitness` rather than
   * subsuming them — the legacy specialized streams keep their
   * own state. Encounter authors generally pick ONE mode for any
   * given axis; the engine does not enforce mutual exclusion.
   */
  stakes?: StakesState;
  /**
   * Heat modifier ids active for this match (#1 from the AAA review
   * roadmap). Always present (defaulted to []) so the canonical hash
   * is stable — a Heat-0 match and a Heat-5 match with the same
   * actions must hash differently because they're functionally
   * different runs. Validated by createMatchState against
   * `HEAT_MODIFIERS`; the field is otherwise immutable for the life
   * of the match (no in-game heat changes; the player locks in their
   * selection at match start). See engine/init.ts +
   * apps/shared/tcg-core/heat/registry.ts.
   */
  heatModifiers: readonly string[];
}

/**
 * §5.5 Warlord three-move lockout runtime state.
 *
 * Lifecycle:
 *  1. Warlord plays `s1_warlord_three_moves` on her turn 3. The cast
 *     interceptor (engine/playCard.ts) builds this struct with
 *     `turnsRemaining = 3`, `witnessed = true`, and assigns it to
 *     `state.lockout`.
 *  2. At the START of each subsequent player turn (refreshTurnForPlayer),
 *     `playableEntityIds` and `lockedEntityIds` are recomputed from the
 *     player's current hand — the Warlord's reality-edit re-evaluates each
 *     turn (spec §2.4.3).
 *  3. At the END of each player turn during lockout, `turnsRemaining`
 *     decrements. When it hits 0 the lockout struct is cleared from state.
 */
export interface WarlordLockoutState {
  /**
   * The Side whose hand is being narrowed. Set by the cast interceptor
   * to the side opposite the Three Moves caster (the Warlord is the
   * caster, so this is the player). Stored explicitly rather than
   * derived from `currentPlayer` because the lockout's tick / re-eval
   * happens on different sides at different points in the turn cycle.
   */
  targetSide: Side;
  /**
   * Player turns remaining under lockout. Initialized to 3 on the Three
   * Moves cast; ticks 3 → 2 → 1 → cleared. Drives the countdown
   * indicator's spent/lit tile state in the UI.
   */
  turnsRemaining: number;
  /**
   * EntityIds of player hand cards the Warlord allows this turn.
   * Recomputed on each player-turn start. Empty during the Warlord's
   * own turns (the field has no meaning when it's not the player's
   * turn). Insurgency-faction cards are always included regardless of
   * the Warlord's selection (spec §2.4 escape hatch).
   */
  playableEntityIds: readonly string[];
  /**
   * EntityIds of player hand cards locked this turn. Disjoint from
   * playableEntityIds; the union covers the player's full current hand.
   * Drives the dim-30%-with-lock-icon overlay in the hand UI.
   */
  lockedEntityIds: readonly string[];
  /**
   * Permanently true once Three Moves has cast in this match. Stays
   * true on the GameState even after `turnsRemaining` hits 0 and the
   * struct is otherwise cleared — but in practice the campaign layer
   * snapshots this flag at match end into the persistent
   * `architect_reality_edit_witnessed` campaign-state field (Acts 3+
   * dialogue branches read it as backstory, per spec §5).
   *
   * The struct as a whole is cleared from `state.lockout` when the
   * lockout ends; the witness signal lives on via the
   * `architect_reality_edit_witnessed` event the cast interceptor
   * also emits, so the campaign layer never has to read this field
   * directly.
   */
  witnessed: true;
}

export type GamePhase = "mulligan" | "playing" | "ended";

export type WinReason =
  | "general_killed"
  | "surrender"
  | "disconnect_forfeit"
  | "turn_limit";

/** An enqueued but not-yet-resolved trigger. */
export interface PendingTrigger {
  /**
   * Stable sort key: (ownerSide, row, col, entityId, abilityIdx).
   *
   * Intentionally not `readonly` so Immer drafts of this interface can be
   * constructed and sorted without the readonly-tuple incompatibility.
   * Callers must treat the array contents as logically immutable; the
   * sortKey is rebuilt from scratch every time a trigger is enqueued.
   */
  sortKey: [number, number, number, string, number];
  sourceEntityId: EntityId;
  abilityIdx: number;
  /**
   * Snapshot of the trigger-causing event, so effect evaluation can look
   * back at e.g. `trigger_victim` correctly even if state changed.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any;
}

/* ─── Read-only card registry passed to the reducer ─── */

/**
 * The reducer is pure over (state, action, cardRegistry). The registry is
 * built once at match start and frozen. Tests construct small registries.
 */
export interface CardRegistry {
  get(defId: string): CardDefinition | undefined;
  has(defId: string): boolean;
  listAll(): readonly CardDefinition[];
}
