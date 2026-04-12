/**
 * Minimal state builders for engine unit tests.
 *
 * Tests need to construct valid GameState snapshots without depending on
 * the card loader (which doesn't exist until WS2) or the full match-start
 * flow. These builders produce the smallest legal state shape and provide
 * composable helpers for adding generals, units, hands, and decks.
 *
 * When the real card loader lands, most test fixtures should migrate to
 * it — but the engine-contract tests will always want direct construction.
 */
import type {
  GameState,
  BoardEntity,
  PlayerState,
  CardRegistry,
  PosKey,
} from "../../types/GameState";
import { posKey } from "../../types/GameState";
import type { CardDefinition, CardInstance } from "../../types/Card";
import type { Side } from "../../types/Ids";
import { createRng, RULES_VERSION } from "../../index";

export interface BuildStateOptions {
  seed?: string;
  currentPlayer?: Side;
  turnNumber?: number;
  phase?: GameState["phase"];
}

/**
 * Build a bare GameState with two generals placed at the default Duelyst
 * positions ((2,0) for P0 general, (2,8) for P1 general). Phase: "playing".
 * No cards in hand, no cards in deck.
 */
export function buildBareState(opts: BuildStateOptions = {}): GameState {
  const seed = opts.seed ?? "deadbeef";
  const rng = createRng(seed);

  const p0GeneralCard = makeCardInstance("general_p0", "gen_architect", 0);
  const p1GeneralCard = makeCardInstance("general_p1", "gen_dreamer", 1);

  const p0Entity: BoardEntity = {
    entityId: p0GeneralCard.entityId,
    card: p0GeneralCard,
    row: 2,
    col: 0,
    actionsRemaining: 1,
    hasMoved: false,
    hasAttacked: false,
    isGeneral: true,
    isStunned: false,
  };
  const p1Entity: BoardEntity = {
    entityId: p1GeneralCard.entityId,
    card: p1GeneralCard,
    row: 2,
    col: 8,
    actionsRemaining: 1,
    hasMoved: false,
    hasAttacked: false,
    isGeneral: true,
    isStunned: false,
  };

  const board: Record<PosKey, BoardEntity> = {
    [posKey(2, 0)]: p0Entity,
    [posKey(2, 8)]: p1Entity,
  };

  const players: [PlayerState, PlayerState] = [
    {
      userId: 1 as PlayerState["userId"],
      faction: "architect",
      generalEntityId: p0GeneralCard.entityId,
      deck: [],
      hand: [],
      graveyard: [],
      artifacts: [],
      mana: 2,
      maxMana: 2,
      bloodbornUsed: false,
      replaceUsed: false,
    },
    {
      userId: 2 as PlayerState["userId"],
      faction: "dreamer",
      generalEntityId: p1GeneralCard.entityId,
      deck: [],
      hand: [],
      graveyard: [],
      artifacts: [],
      mana: 2,
      maxMana: 2,
      bloodbornUsed: false,
      replaceUsed: false,
    },
  ];

  return {
    matchId: "test-match",
    rulesVersion: RULES_VERSION,
    rngState: rng.state(),
    seed,
    board,
    players,
    currentPlayer: opts.currentPlayer ?? 0,
    turnNumber: opts.turnNumber ?? 1,
    phase: opts.phase ?? "playing",
    winner: null,
    winReason: null,
    triggerQueue: [],
    actionSeq: 0,
    nextEntityCounter: 1000,
  };
}

/**
 * Build a CardInstance with the given entity id, def id, and owner.
 * Default stats: 2 power / 3 health / 3 max health, no keywords or buffs.
 * Callers can override after construction for specific test scenarios.
 */
export function makeCardInstance(
  entityId: string,
  defId: string,
  owner: Side,
  opts: Partial<Pick<CardInstance, "currentPower" | "currentHealth" | "maxHealth">> = {}
): CardInstance {
  return {
    entityId: entityId as CardInstance["entityId"],
    defId: defId as CardInstance["defId"],
    owner,
    currentPower: opts.currentPower ?? 2,
    currentHealth: opts.currentHealth ?? 3,
    maxHealth: opts.maxHealth ?? 3,
    counters: {},
    activeKeywords: [],
    buffs: [],
    flags: {},
  };
}

/**
 * Place a non-general unit at (row, col) on the board. Returns a new state
 * with the unit added. Does NOT check for collisions — caller is
 * responsible.
 */
export function placeUnit(
  state: GameState,
  entityId: string,
  defId: string,
  owner: Side,
  row: number,
  col: number,
  opts: Parameters<typeof makeCardInstance>[3] = {}
): GameState {
  const card = makeCardInstance(entityId, defId, owner, opts);
  const entity: BoardEntity = {
    entityId: card.entityId,
    card,
    row,
    col,
    actionsRemaining: 1,
    hasMoved: false,
    hasAttacked: false,
    isGeneral: false,
    isStunned: false,
  };
  return {
    ...state,
    board: {
      ...state.board,
      [posKey(row, col)]: entity,
    },
  };
}

/** Set an on-board entity's currentHealth (for triggering SBA). */
export function setEntityHealth(
  state: GameState,
  entityId: string,
  health: number
): GameState {
  const board: Record<PosKey, BoardEntity> = {};
  for (const [k, e] of Object.entries(state.board)) {
    if (e.entityId === entityId) {
      board[k] = { ...e, card: { ...e.card, currentHealth: health } };
    } else {
      board[k] = e;
    }
  }
  return { ...state, board };
}

/** Read-through empty registry. Sufficient for contract-level tests. */
export const emptyRegistry: CardRegistry = {
  get: (_id: string): CardDefinition | undefined => undefined,
  has: (_id: string) => false,
  listAll: () => [],
};
