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
  actionLog: Array<{ turn: number; player: 0 | 1; action: string; details: string }>;
  boardWidth: number;
  boardHeight: number;
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
    actionLog: [],
    boardWidth: BOARD_WIDTH,
    boardHeight: BOARD_HEIGHT,
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
