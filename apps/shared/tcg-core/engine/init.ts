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
import { validateHeatConfig } from "../heat/registry";
import { initStakesState } from "./stakesReducer";

/** Optional match-start bonuses applied before the first action.
 *  Engine-agnostic: callers translate any upstream buff source
 *  (Oracle Deck readings, daily login rewards, feature flags)
 *  into these concrete scalars before passing them in. Unknown
 *  sources pass through as `undefined`, in which case the engine
 *  uses the default STARTING_MANA / MULLIGAN_HAND_SIZE / general
 *  baseStats. */
export interface MatchStartingBonuses {
  /** Extra crystals of mana added on top of STARTING_MANA (both
   *  current and max). Clamped to a reasonable ceiling of +3 so
   *  a single reading cannot fill the mana bar. */
  extraMana?: number;
  /** Extra cards drawn into the opening hand beyond
   *  MULLIGAN_HAND_SIZE. Clamped to +2. */
  extraCards?: number;
  /** Extra HP added to the general's starting current + max HP.
   *  Clamped to +10. */
  extraGeneralHp?: number;
  /** Free-form label for the reading / source so the UI can
   *  display "Past: The Architect — +1 mana". Optional; the
   *  engine ignores it. */
  sourceLabel?: string;
}

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
  /** Optional match-start bonuses (e.g. from a pre-match Oracle
   *  reading). When omitted, the match starts with default mana,
   *  hand size, and general HP. */
  startingBonuses?: MatchStartingBonuses;
  /** Optional per-cardDefId stat overrides applied at match init.
   *  Keyed by cardDefId, value is an additive { power, health }
   *  delta. The faction-allegiance system (Phase D3) uses this to
   *  scale a player's owned allegiance cards by their faction
   *  win count: every 10 wins gives the matching cards +1/+1
   *  capped at +5/+5. The override is applied to every minted
   *  CardInstance whose defId is in the map, before the deck is
   *  shuffled or the opening hand is dealt. Unknown defIds in
   *  the map are ignored. */
  cardStatOverrides?: Readonly<Record<string, { power: number; health: number }>>;
}

export interface CreateMatchOptionsExtras {
  /**
   * Optional scripted-action queue copied onto the resulting
   * GameState. Story encounters use this to author set-piece plays
   * that the AI can't be trusted to make on schedule (the canonical
   * case is the §5.5 Warlord Three Moves cast on her turn 3). See
   * engine/scriptedActions.ts.
   */
  scriptedActions?: readonly import("../types/ScriptedAction").ScriptedAction[];
  /**
   * Optional §5.8 Authority trial mode. Setting this puts the
   * resulting match into trial mode: phase guards are active in
   * playCard, phase events fire in handleEndTurn, the verdict
   * resolves at turn 10. See engine/trialPhase.ts +
   * docs/production/act1/authority-trial-phase-mechanic.md.
   */
  trialMode?: import("../types/TrialPhase").TrialModeConfig;
  /**
   * Optional §5.6 Programmer gift mode. Setting this puts the
   * resulting match into gift mode: ProgrammerGiftState starts
   * at "not_offered" and transitions through the engine/programmerGift.ts
   * state machine. See ACT1_NARRATIVE_STRUCTURE.md §5.6.
   */
  giftMode?: import("../types/ProgrammerGift").GiftModeConfig;
  /**
   * Optional §5.7 Game Master witness mode. Setting this puts the
   * resulting match into witness mode: PublicWitnessState starts at
   * balance 0 with no entries. Engine/publicWitness.ts transitions
   * the state when the Game Master plays a card. See
   * docs/production/act1/public-witness-ui-spec.md.
   */
  witnessMode?: import("../types/PublicWitness").WitnessModeConfig;
  /**
   * Optional §4.9 Seer prophecy mode. Setting this puts the match
   * into prophecy mode: seerProphecy starts null-pending / 0 plays.
   * The reducer's turn-refresh hook (follow-up PR) bakes the
   * pending future at the start of each player turn. See
   * engine/seerProphecy.ts.
   */
  prophecyMode?: import("../types/SeerProphecy").ProphecyModeConfig;
  /**
   * Optional multi-axis Stakes Stream config. Setting this puts
   * the resulting match into stakes mode: state.stakes is
   * initialized from the declared axes' `initial` values
   * (engine/stakesReducer.ts initStakesState), and each card play
   * dispatches through `applyCardPlayToStakes`. See
   * apps/shared/tcg-core/types/StakesMode.ts.
   */
  stakesMode?: import("../types/StakesMode").StakesModeConfig;
  /**
   * Optional Heat modifier ids (#1 from the AAA review roadmap —
   * Hades-style per-run modifiers). Validated against
   * `HEAT_MODIFIERS` at match init; an unknown / duplicate / over-cap
   * id throws so a misconfigured caller fails loudly rather than
   * silently dropping mutators. The validated id list is persisted
   * to `GameState.heatModifiers` so the canonical state hash differs
   * across heat configs (a Heat-5 replay must not hash-collide with
   * the same actions on Heat-0). Phase-2A (this commit) ships the
   * plumbing only; per-modifier reducer effects land per-modifier in
   * follow-ups. See `apps/shared/tcg-core/heat/registry.ts`.
   */
  heatModifiers?: readonly string[];
  /**
   * Optional: NPC duel replay-pin metadata. Set by callers that
   * launched the match via the NpcDuelOverlay (apps/client/src/
   * components/NpcDuelOverlay.tsx). Recorded on GameState.npcDuelMeta
   * for replay viewers; reducers never read it. See
   * apps/shared/tcg-core/types/GameState.ts NpcDuelMeta.
   */
  npcDuelMeta?: import("../types/GameState").NpcDuelMeta;
}

export interface CreateMatchOptions extends CreateMatchOptionsExtras {
  matchId: string;
  seed: string;
  p1: MatchConfig;
  p2: MatchConfig;
  registry: CardRegistry;
}

/** Small internal helper — clamp an optional bonus value into
 *  [min, max], with undefined/NaN falling through to 0. */
function clampBonus(
  value: number | undefined,
  min: number,
  max: number,
): number {
  if (value === undefined || Number.isNaN(value)) return 0;
  if (value < min) return min;
  if (value > max) return max;
  return Math.floor(value);
}

/** Apply per-cardDefId stat deltas to a freshly-minted deck of
 *  CardInstances. Mutates each matching instance in place. Used
 *  by createMatchState to scale faction-allegiance cards by
 *  the player's faction win count (Phase D3). */
function applyCardStatOverrides(
  deck: CardInstance[],
  overrides: Readonly<Record<string, { power: number; health: number }>> | undefined,
): void {
  if (!overrides) return;
  for (const inst of deck) {
    const delta = overrides[inst.defId];
    if (!delta) continue;
    const power = Math.max(0, Math.floor(delta.power ?? 0));
    const health = Math.max(0, Math.floor(delta.health ?? 0));
    if (power === 0 && health === 0) continue;
    inst.currentPower += power;
    inst.currentHealth += health;
    inst.maxHealth += health;
  }
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

  // Apply any general-HP bonus from starting bonuses. The mint
  // helper already assigned currentHealth/maxHealth from the card
  // definition; we overwrite them here because we can't easily
  // thread the bonus through makeCardInstance without polluting
  // its signature. The bonus is clamped below.

  // Mint decks. Maintain deterministic ordering by iterating the input
  // config array exactly as given, then shuffling with the seeded RNG.
  const p1DeckRaw = p1.deckCardDefIds.map((id) => mint(id, 0));
  const p2DeckRaw = p2.deckCardDefIds.map((id) => mint(id, 1));

  // Apply per-card stat overrides (Phase D3) BEFORE shuffling, so
  // every copy of an allegiance card the player owns receives its
  // win-scaled buff. The override values are added on top of the
  // card definition's baseStats, not replaced. Unknown defIds in
  // the override map are silently ignored.
  applyCardStatOverrides(p1DeckRaw, p1.cardStatOverrides);
  applyCardStatOverrides(p2DeckRaw, p2.cardStatOverrides);
  const p1Deck = rngShuffle(rng, p1DeckRaw);
  const p2Deck = rngShuffle(rng, p2DeckRaw);

  // Resolve starting-bonus scalars. Clamp so a single source
  // cannot distort the match beyond recognition.
  const p1ExtraCards = clampBonus(p1.startingBonuses?.extraCards, 0, 2);
  const p2ExtraCards = clampBonus(p2.startingBonuses?.extraCards, 0, 2);
  const p1ExtraMana = clampBonus(p1.startingBonuses?.extraMana, 0, 3);
  const p2ExtraMana = clampBonus(p2.startingBonuses?.extraMana, 0, 3);
  const p1ExtraHp = clampBonus(p1.startingBonuses?.extraGeneralHp, 0, 10);
  const p2ExtraHp = clampBonus(p2.startingBonuses?.extraGeneralHp, 0, 10);

  // Apply HP bonus directly to the general's card instance
  // before we build the BoardEntity. The instance is still
  // private to this init function at this point.
  if (p1ExtraHp > 0) {
    p1General.currentHealth += p1ExtraHp;
    p1General.maxHealth += p1ExtraHp;
  }
  if (p2ExtraHp > 0) {
    p2General.currentHealth += p2ExtraHp;
    p2General.maxHealth += p2ExtraHp;
  }

  // Deal opening hands. We splice, but since our deck is immutable in
  // the engine, we slice + drop. Extra cards from a starting bonus
  // land in hand alongside the normal mulligan hand.
  const p1HandSize = MULLIGAN_HAND_SIZE + p1ExtraCards;
  const p2HandSize = MULLIGAN_HAND_SIZE + p2ExtraCards;
  const { hand: p1Hand, deck: p1DeckAfter } = drawOpening(p1Deck, p1HandSize);
  const { hand: p2Hand, deck: p2DeckAfter } = drawOpening(p2Deck, p2HandSize);

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
      mana: STARTING_MANA + p1ExtraMana,
      maxMana: STARTING_MANA + p1ExtraMana,
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
      mana: STARTING_MANA + p2ExtraMana,
      maxMana: STARTING_MANA + p2ExtraMana,
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
    scriptedActions: opts.scriptedActions,
    trial: opts.trialMode
      ? {
          openingVerdictBalance: opts.trialMode.openingVerdictBalance,
          trialBalance: 0,
          openingArgumentPlayed: false,
          closingArgumentPlayed: false,
        }
      : undefined,
    programmerGift: opts.giftMode ? { status: "not_offered" } : undefined,
    stakes: opts.stakesMode ? initStakesState(opts.stakesMode) : undefined,
    publicWitness: opts.witnessMode
      ? {
          balance:
            typeof opts.witnessMode.openingBalance === "number" &&
            Number.isFinite(opts.witnessMode.openingBalance)
              ? Math.max(-10, Math.min(10, opts.witnessMode.openingBalance))
              : 0,
          entries: [],
        }
      : undefined,
    seerProphecy: opts.prophecyMode
      ? { pending: null, playsPerformed: 0 }
      : undefined,
    heatModifiers: validateHeatModifiersAtInit(opts.heatModifiers),
    npcDuelMeta: opts.npcDuelMeta,
  };
}

/** Validate the caller-supplied heat modifier ids against the
 *  registry. Throws on misconfiguration so a bad caller (typo'd id,
 *  duplicate, over-cap stack) fails loudly at match init rather than
 *  silently dropping mutators or surfacing as a desync later.
 *
 *  Default to an empty list so callers that don't care about heat
 *  (story encounters, tutorial gates, AI-vs-AI smoke tests) get the
 *  Heat-0 hash unchanged. */
function validateHeatModifiersAtInit(
  ids: readonly string[] | undefined,
): readonly string[] {
  if (!ids || ids.length === 0) return [];
  const result = validateHeatConfig(ids);
  if (!result.ok) {
    throw new Error(
      `[createMatchState] invalid heat modifiers (${result.reason}): ${result.detail}`,
    );
  }
  return result.config.modifierIds;
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
  const armor = (def as { baseArmor?: number } | undefined)?.baseArmor ?? 0;
  const keywords = def?.keywords ? [...def.keywords] : [];
  const emptyBuffs: Buff[] = [];
  return {
    entityId: `e_${matchId}_${counter}` as EntityId,
    defId: defId as CardInstance["defId"],
    owner,
    currentPower: power,
    currentHealth: health,
    maxHealth: health,
    armor,
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

