/**
 * REPLAY SYSTEM
 * ══════════════════════════════════════════════════════════
 * Move storage, playback, sharing, and featured replays.
 * Supports all game types: chess, card battles, fighting, tower defense raids.
 */

export type GameType = "chess" | "card_battle" | "fighting" | "tower_defense_raid" | "coop_raid";

export interface ReplayMetadata {
  gameType: GameType;
  player1Id: string;
  player1Name: string;
  player1Class?: string;
  player2Id?: string;
  player2Name?: string;
  player2Class?: string;
  winnerId?: string;
  duration: number; // seconds
  totalMoves: number;
  /** Star rating for featured replays */
  featured: boolean;
  /** Tags for searchability */
  tags: string[];
  /** Timestamp */
  playedAt: number;
}

export interface ReplayMove {
  moveIndex: number;
  timestamp: number; // ms from start
  playerId: string;
  action: string; // JSON-encoded action
  /** Optional annotation */
  annotation?: string;
}

/** Compact encoding for replay storage */
export function encodeReplay(moves: ReplayMove[]): string {
  return JSON.stringify(moves.map(m => [m.moveIndex, m.timestamp, m.playerId, m.action, m.annotation || ""]));
}

export function decodeReplay(encoded: string): ReplayMove[] {
  const arr = JSON.parse(encoded) as [number, number, string, string, string][];
  return arr.map(([moveIndex, timestamp, playerId, action, annotation]) => ({
    moveIndex, timestamp, playerId, action, annotation: annotation || undefined,
  }));
}

/** Playback speed options */
export const PLAYBACK_SPEEDS = [0.25, 0.5, 1, 1.5, 2, 4] as const;
export type PlaybackSpeed = typeof PLAYBACK_SPEEDS[number];

/** Featured replay criteria */
export function shouldFeatureReplay(metadata: ReplayMetadata): boolean {
  if (metadata.totalMoves >= 30 && metadata.duration >= 120) return true;
  if (metadata.tags.includes("comeback")) return true;
  if (metadata.tags.includes("perfect")) return true;
  return false;
}

/** Generate shareable replay link */
export function getReplayShareUrl(replayId: string): string {
  return `/replay/${replayId}`;
}

/** Game type display names */
export const GAME_TYPE_LABELS: Record<GameType, string> = {
  chess: "Chess Match",
  card_battle: "Card Battle",
  fighting: "Fighting Match",
  tower_defense_raid: "Tower Defense Raid",
  coop_raid: "Co-op Raid",
};

export const GAME_TYPE_ICONS: Record<GameType, string> = {
  chess: "Crown",
  card_battle: "Layers",
  fighting: "Swords",
  tower_defense_raid: "Shield",
  coop_raid: "Users",
};
