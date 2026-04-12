/**
 * Match initialization.
 *
 * Builds the initial GameState for a new match given two MatchConfigs
 * (faction, generalDefId, deckCardDefIds) and a deterministic seed.
 *
 * What this does:
 *   1. Seeds the RNG from the match seed.
 *   2. Mints CardInstances for every card in each deck, using deterministic
 *      entity ids via GameState.nextEntityCounter.
 *   3. Shuffles each deck deterministically.
 *   4. Draws MULLIGAN_HAND_SIZE cards per player into the opening hand.
 *   5. Places both generals on the board at the canonical Duelyst
 *      positions — P0 at (2,0), P1 at (2,8).
 *   6. Sets phase = "mulligan" so the clients can prompt for replaces
 *      before committing with finish_mulligan.
 *
 * What this does NOT do (by design):
 *   - Player auth / user-id wiring. Callers supply the PlayerIds.
 *   - Deck validation. Formats/validateDeck owns that; init trusts its
 *     input. The server-side match creator is expected to run the deck
 *     through validateDeck() before calling createMatchState().
 *
 * Determinism guarantees:
 *   Same (seed, matchId, registry snapshot, MatchConfigs) → identical
 *   initial GameState across machines and JS runtimes. Card registry is
 *   expected to be stable for the lifetime of the match.
 */
import type {
  GameState,
  BoardEntity,
  PlayerState,
  CardRegistry,
  PosKey,
} from "../types/GameState";
import {
  BOARD_HEIGHT,
  MAX_HAND,
  MULLIGAN_HAND_SIZE,
  STARTING_MANA,
  posKey,
} from "../types/GameState";
import type { CardInstance, Faction, Buff } from "../types/Card";
import type { EntityId, PlayerId, Side } from "../types/Ids";
import { createRng, rngShuffle } from "./rng";
import { RULES_VERSION } from "./version";

export interface MatchConfig {
  userId: PlayerId;
  faction: Faction;
  /** Card definition id of the general this player is commanding. */
  generalDefId: string;
  /**
   * The 39-card deck as a flat list of card definition ids. Duplicates
   * are allowed and represent multiple copies (up to the format's copy
   * limit). Order is irrelevant — `createMatchState` shuffles via the
   * seeded RNG.
   */
  deckCardDefIds: readonly string[];
}

export interface CreateMatchOptions {
  matchId: string;
  seed: string;
  p1: MatchConfig;
  p2: MatchConfig;
  registry: CardRegistry;
}

export function createMatchState(opts: CreateMatchOptions): GameState {
  const { matchId, seed, p1, p2, registry } = opts;
  const rng = createRng(seed);
  let counter = 0;

  const mint = (defId: string, owner: Side): CardInstance => {
    counter += 1;
    return makeCardInstance(matchId, counter, defId, owner, registry);
  };

  // Mint generals first so they land at low, stable entity ids.
  const p1General = mint(p1.generalDefId, 0);
  const p2General = mint(p2.generalDefId, 1);

  // Mint decks. Maintain deterministic ordering by iterating the input
  // config array exactly as given, then shuffling with the seeded RNG.
  const p1DeckRaw = p1.deckCardDefIds.map((id) => mint(id, 0));
  const p2DeckRaw = p2.deckCardDefIds.map((id) => mint(id, 1));
  const p1Deck = rngShuffle(rng, p1DeckRaw);
  const p2Deck = rngShuffle(rng, p2DeckRaw);

  // Deal opening hands. We splice, but since our deck is immutable in
  // the engine, we slice + drop.
  const { hand: p1Hand, deck: p1DeckAfter } = drawOpening(p1Deck, MULLIGAN_HAND_SIZE);
  const { hand: p2Hand, deck: p2DeckAfter } = drawOpening(p2Deck, MULLIGAN_HAND_SIZE);

  // Place generals on the board at canonical positions.
  const midRow = Math.floor(BOARD_HEIGHT / 2);
  const p1Entity: BoardEntity = {
    entityId: p1General.entityId,
    card: p1General,
    row: midRow,
    col: 0,
    actionsRemaining: 0,
    hasMoved: false,
    hasAttacked: false,
    isGeneral: true,
    isStunned: false,
  };
  const p2Entity: BoardEntity = {
    entityId: p2General.entityId,
    card: p2General,
    row: midRow,
    col: 8,
    actionsRemaining: 0,
    hasMoved: false,
    hasAttacked: false,
    isGeneral: true,
    isStunned: false,
  };
  const board: Record<PosKey, BoardEntity> = {
    [posKey(midRow, 0)]: p1Entity,
    [posKey(midRow, 8)]: p2Entity,
  };

  const players: readonly [PlayerState, PlayerState] = [
    {
      userId: p1.userId,
      faction: p1.faction,
      generalEntityId: p1General.entityId,
      deck: p1DeckAfter,
      hand: p1Hand,
      graveyard: [],
      artifacts: [],
      mana: STARTING_MANA,
      maxMana: STARTING_MANA,
      bloodbornUsed: false,
      replaceUsed: false,
    },
    {
      userId: p2.userId,
      faction: p2.faction,
      generalEntityId: p2General.entityId,
      deck: p2DeckAfter,
      hand: p2Hand,
      graveyard: [],
      artifacts: [],
      mana: STARTING_MANA,
      maxMana: STARTING_MANA,
      bloodbornUsed: false,
      replaceUsed: false,
    },
  ];

  return {
    matchId,
    rulesVersion: RULES_VERSION,
    rngState: rng.state(),
    seed,
    board,
    players,
    currentPlayer: 0,
    turnNumber: 1,
    phase: "mulligan",
    winner: null,
    winReason: null,
    triggerQueue: [],
    actionSeq: 0,
    nextEntityCounter: counter + 1,
  };
}

/**
 * Mint a single CardInstance with a deterministic entity id. The entity id
 * format is `e_{matchId}_{counter}` — stable across replays, never
 * collides with other instances even when the same card def is cloned.
 *
 * If the registry is missing the card, we still mint a placeholder
 * instance so the caller's error surface stays uniform. The actual
 * validation of "every card in every deck is a known def" belongs to
 * format validation upstream.
 */
export function makeCardInstance(
  matchId: string,
  counter: number,
  defId: string,
  owner: Side,
  registry: CardRegistry
): CardInstance {
  const def = registry.get(defId);
  const power = def?.baseStats?.power ?? 0;
  const health = def?.baseStats?.health ?? 1;
  const keywords = def?.keywords ? [...def.keywords] : [];
  const emptyBuffs: Buff[] = [];
  return {
    entityId: `e_${matchId}_${counter}` as EntityId,
    defId: defId as CardInstance["defId"],
    owner,
    currentPower: power,
    currentHealth: health,
    maxHealth: health,
    counters: {},
    activeKeywords: keywords,
    buffs: emptyBuffs,
    flags: {},
  };
}

function drawOpening(
  deck: readonly CardInstance[],
  count: number
): { hand: CardInstance[]; deck: CardInstance[] } {
  const take = Math.min(count, deck.length);
  return { hand: deck.slice(0, take), deck: deck.slice(take) };
}

/**
 * Draw a single card into the given player's hand, respecting MAX_HAND and
 * emitting the correct events. Returns an updated PlayerState slice.
 *
 * Pure helper used by turn refresh and mulligan commit; receiving side
 * is responsible for pushing the new PlayerState back onto the draft.
 */
export function drawOneCard(
  player: PlayerState,
  events: {
    onDrawn?: (card: CardInstance) => void;
    onBurnedHandFull?: (card: CardInstance) => void;
    onDeckEmpty?: () => void;
  } = {}
): PlayerState {
  if (player.deck.length === 0) {
    events.onDeckEmpty?.();
    return player;
  }
  const [top, ...rest] = player.deck;
  if (player.hand.length >= MAX_HAND) {
    events.onBurnedHandFull?.(top);
    return { ...player, deck: rest, graveyard: [...player.graveyard, top] };
  }
  events.onDrawn?.(top);
  return { ...player, deck: rest, hand: [...player.hand, top] };
}

/**
 * Used by runtime handlers that need a fresh entity id inside a draft.
 * Bumps the draft's counter and returns the new id string.
 */
export function mintEntityId(draft: {
  matchId: string;
  nextEntityCounter: number;
}): EntityId {
  const id = `e_${draft.matchId}_${draft.nextEntityCounter}` as EntityId;
  draft.nextEntityCounter += 1;
  return id;
}

