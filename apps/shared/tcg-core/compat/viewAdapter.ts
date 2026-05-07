/**
 * View adapter: tcg-core GameState → legacy DuelystGameState.
 *
 * Produces a read-only projection of the canonical tcg-core state into
 * the shape the existing UI, AI, and BoardRenderer expect. Conversions:
 *
 *   - Record<string, BoardEntity> → Map<string, BoardUnit>
 *   - Keyword[] → Set<DuelystKeyword>
 *   - CardInstance runtime stats → DuelystCard display object (name,
 *     imageUrl, abilityText from CardRegistry lookup)
 *   - counters.forcefield_charges > 0 → forcefieldActive boolean
 *
 * This adapter is intentionally disposable: once the UI is incrementally
 * migrated to read tcg-core state directly, the adapter is deleted.
 *
 * No mutations, no side effects. Import from anywhere.
 */
import type { GameState, BoardEntity, PlayerState, CardRegistry } from "../types/GameState";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../types/GameState";
import type { CardInstance, Keyword } from "../types/Card";

/* ─── Legacy display types ───
 *
 * Declared here (not imported from the client's types.ts) so the shared
 * package has no dependency on apps/client/. The shapes match structurally;
 * the client can cast freely.
 */

export interface LegacyDuelystCard {
  id: string;
  name: string;
  faction: string;
  cardType: string;
  rarity: string;
  manaCost: number;
  attack: number;
  health: number;
  keywords: string[];
  abilityText: string;
  flavorText: string;
  imageUrl: string;
  spellEffect?: unknown;
  artifactDurability?: number;
  sagaCardId?: string;
}

/* Note: LegacyDuelystCard.id IS the runtime CardInstance.entityId for
 * hand and board cards (see adaptCardInstance), not the static
 * CardDefinition id. The defId is exposed via `sagaCardId`. The §5.5
 * Warlord lockout UI matches lockedEntityIds against this `id`. */

export interface LegacyBoardUnit {
  id: string;
  card: LegacyDuelystCard;
  owner: 0 | 1;
  row: number;
  col: number;
  currentAttack: number;
  currentHealth: number;
  maxHealth: number;
  hasMoved: boolean;
  hasAttacked: boolean;
  actionsRemaining: number;
  activeKeywords: Set<string>;
  buffs: Array<{ attackMod: number; healthMod: number; source: string; temporary?: boolean }>;
  isGeneral: boolean;
  isStunned: boolean;
  forcefieldActive: boolean;
  growAmount?: number;
  backstabDamage?: number;
  infiltrateActive?: boolean;
}

export interface LegacyDuelystPlayer {
  faction: string;
  generalId: string;
  deck: LegacyDuelystCard[];
  hand: LegacyDuelystCard[];
  mana: number;
  maxMana: number;
  artifacts: Array<{ card: LegacyDuelystCard; durability: number }>;
  bloodbornUsed: boolean;
  replaceUsed: boolean;
}

export interface LegacyDuelystGameState {
  board: Map<string, LegacyBoardUnit>;
  players: [LegacyDuelystPlayer, LegacyDuelystPlayer];
  currentPlayer: 0 | 1;
  turnNumber: number;
  phase: "mulligan" | "playing" | "ended";
  winner: 0 | 1 | null;
  /** Reason the match ended. Projected for §4.9 and other campaign
   *  layers that need to distinguish a concede from a combat loss. */
  winReason?: string | null;
  actionLog: Array<{ turn: number; player: 0 | 1; action: string; details: string }>;
  boardWidth: number;
  boardHeight: number;
  /**
   * §5.5 Warlord lockout state, projected through for the UI's
   * countdown indicator + card-lock overlay. Absent when no lockout
   * is active. See engine/lockout.ts.
   */
  lockout?: {
    targetSide: 0 | 1;
    turnsRemaining: number;
    playableEntityIds: readonly string[];
    lockedEntityIds: readonly string[];
  };
  /**
   * §5.8 Authority trial state, projected through for the UI's phase
   * indicator + transcript column. Absent on every match that isn't
   * §5.8. Phase number === turnNumber during trial mode per spec §2.
   * See engine/trialPhase.ts.
   */
  trial?: {
    openingVerdictBalance: number;
    trialBalance: number;
    openingArgumentPlayed: boolean;
    closingArgumentPlayed: boolean;
    outcome?: "overturn" | "sentence_passed";
  };
  /**
   * §5.6 Programmer gift state, mirrored from tcg-core GameState.
   * Absent on matches that aren't §5.6. See engine/programmerGift.ts.
   */
  programmerGift?: {
    status: "not_offered" | "offered" | "accepted" | "declined";
    offeredOnTurn?: number;
    resolvedOnTurn?: number;
  };
  /**
   * §5.7 Game Master public-witness state, mirrored from tcg-core
   * GameState. Absent on matches that aren't §5.7. The UI renders
   * PublicWitnessColumn from this. See engine/publicWitness.ts.
   */
  publicWitness?: {
    balance: number;
    entries: readonly {
      id: string;
      turnNumber: number;
      publicLabel: string;
      publicDelta: number;
      privateDelta: number;
      cardDefId: string;
    }[];
  };
  /**
   * §4.9 Seer prophecy state, mirrored from tcg-core GameState.
   * Absent on matches that aren't §4.9. DuelystGameUI reads the
   * playsPerformed counter at match end to derive the canonical
   * outcome flag. See engine/seerProphecy.ts.
   */
  seerProphecy?: {
    pending: {
      cardDefId: string;
      turnIndex: number;
    } | null;
    playsPerformed: number;
  };
}

/* ─── Adapter ─── */

export function adaptTcgStateToLegacyView(
  state: GameState,
  registry: CardRegistry
): LegacyDuelystGameState {
  const board = new Map<string, LegacyBoardUnit>();
  for (const [key, entity] of Object.entries(state.board)) {
    board.set(key, adaptBoardEntity(entity, registry));
  }

  return {
    board,
    players: [
      adaptPlayer(state.players[0], registry),
      adaptPlayer(state.players[1], registry),
    ],
    currentPlayer: state.currentPlayer,
    turnNumber: state.turnNumber,
    phase: state.phase,
    winner: state.winner,
    winReason: state.winReason,
    actionLog: [],
    boardWidth: BOARD_WIDTH,
    boardHeight: BOARD_HEIGHT,
    lockout: state.lockout
      ? {
          targetSide: state.lockout.targetSide,
          turnsRemaining: state.lockout.turnsRemaining,
          playableEntityIds: state.lockout.playableEntityIds,
          lockedEntityIds: state.lockout.lockedEntityIds,
        }
      : undefined,
    trial: state.trial
      ? {
          openingVerdictBalance: state.trial.openingVerdictBalance,
          trialBalance: state.trial.trialBalance,
          openingArgumentPlayed: state.trial.openingArgumentPlayed,
          closingArgumentPlayed: state.trial.closingArgumentPlayed,
          outcome: state.trial.outcome,
        }
      : undefined,
    programmerGift: state.programmerGift
      ? {
          status: state.programmerGift.status,
          offeredOnTurn: state.programmerGift.offeredOnTurn,
          resolvedOnTurn: state.programmerGift.resolvedOnTurn,
        }
      : undefined,
    publicWitness: state.publicWitness
      ? {
          balance: state.publicWitness.balance,
          entries: state.publicWitness.entries.map((e) => ({
            id: e.id,
            turnNumber: e.turnNumber,
            publicLabel: e.publicLabel,
            publicDelta: e.publicDelta,
            privateDelta: e.privateDelta,
            cardDefId: e.cardDefId,
          })),
        }
      : undefined,
    seerProphecy: state.seerProphecy
      ? {
          pending: state.seerProphecy.pending
            ? {
                cardDefId: state.seerProphecy.pending.cardDefId,
                turnIndex: state.seerProphecy.pending.turnIndex,
              }
            : null,
          playsPerformed: state.seerProphecy.playsPerformed,
        }
      : undefined,
  };
}

function adaptBoardEntity(
  entity: BoardEntity,
  registry: CardRegistry
): LegacyBoardUnit {
  const card = adaptCardInstance(entity.card, registry);
  return {
    id: entity.entityId,
    card,
    owner: entity.card.owner,
    row: entity.row,
    col: entity.col,
    currentAttack: entity.card.currentPower,
    currentHealth: entity.card.currentHealth,
    maxHealth: entity.card.maxHealth,
    hasMoved: entity.hasMoved,
    hasAttacked: entity.hasAttacked,
    actionsRemaining: entity.actionsRemaining,
    activeKeywords: new Set<string>(entity.card.activeKeywords),
    buffs: entity.card.buffs.map((b) => ({
      attackMod: b.powerDelta,
      healthMod: b.healthDelta,
      source: b.source,
      temporary: b.expiresAtTurn >= 0,
    })),
    isGeneral: entity.isGeneral,
    isStunned: entity.isStunned,
    forcefieldActive: (entity.card.counters.forcefield_charges ?? 0) > 0,
    growAmount: entity.card.activeKeywords.includes("grow" as Keyword)
      ? 1
      : undefined,
    backstabDamage: entity.card.activeKeywords.includes("backstab" as Keyword)
      ? 2
      : undefined,
    infiltrateActive: entity.card.flags.infiltrateActive ?? undefined,
  };
}

function adaptPlayer(
  player: PlayerState,
  registry: CardRegistry
): LegacyDuelystPlayer {
  return {
    faction: player.faction,
    generalId: player.generalEntityId,
    deck: player.deck.map((c) => adaptCardInstance(c, registry)),
    hand: player.hand.map((c) => adaptCardInstance(c, registry)),
    mana: player.mana,
    maxMana: player.maxMana,
    artifacts: player.artifacts.map((a) => ({
      card: adaptCardInstance(
        {
          entityId: a.entityId,
          defId: a.defId as CardInstance["defId"],
          owner: 0 as 0 | 1,
          currentPower: 0,
          currentHealth: 0,
          maxHealth: 0,
          armor: 0,
          counters: {},
          activeKeywords: [],
          buffs: [],
          flags: {},
        },
        registry
      ),
      durability: a.durability,
    })),
    bloodbornUsed: player.bloodbornUsed,
    replaceUsed: player.replaceUsed,
  };
}

function adaptCardInstance(
  card: CardInstance,
  registry: CardRegistry
): LegacyDuelystCard {
  const def = registry.get(card.defId);
  return {
    id: card.entityId,
    name: def?.name ?? card.defId,
    faction: def?.faction ?? "neutral",
    cardType: def?.cardType ?? "unit",
    rarity: def?.rarity ?? "common",
    manaCost: def?.cost ?? 0,
    attack: card.currentPower,
    health: card.currentHealth,
    keywords: [...card.activeKeywords],
    abilityText: def?.flavorText ?? "",
    flavorText: def?.flavorText ?? "",
    imageUrl: def?.art ?? "",
    sagaCardId: card.defId,
  };
}
