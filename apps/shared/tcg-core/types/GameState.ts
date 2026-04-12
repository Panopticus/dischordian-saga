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

/** 9-wide, 5-tall board. Coordinates are (row 0..4, col 0..8). */
export const BOARD_WIDTH = 9;
export const BOARD_HEIGHT = 5;
export const MAX_MANA = 9;
export const STARTING_MANA = 2;
export const MAX_HAND = 6;
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

/** Per-player state. */
export interface PlayerState {
  userId: PlayerId;
  faction: Faction;
  /** CardInstance at index 0 is always the general (also tracked in board). */
  generalEntityId: EntityId;
  /** Cards still in deck. Order matters — it's the draw pile. */
  deck: readonly CardInstance[];
  hand: readonly CardInstance[];
  graveyard: readonly CardInstance[];
  /** Hand-equipped artifacts (apply to general). */
  artifacts: readonly ArtifactInstance[];
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
  triggerQueue: readonly PendingTrigger[];
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
