/* ═══════════════════════════════════════════════════════
   CROSS-GAME SYNERGY — Buffs that span game modes

   Achievements in one game mode grant temporary bonuses
   in other modes, encouraging players to engage with
   the full breadth of Dischordian Saga.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export interface Synergy {
  /** Unique identifier for this synergy */
  id: string;
  /** Display name */
  name: string;
  /** Which game mode triggers this synergy */
  source: SynergySource;
  /** Condition that must be met to earn this synergy */
  triggerCondition: string;
  /** Human-readable buff description */
  buffDescription: string;
  /** Which game mode(s) receive the bonus */
  targetModes: string[];
  /** Duration in milliseconds */
  durationMs: number;
  /** Expiry timestamp (epoch ms) — set when synergy is earned */
  expiresAt: number;
  /** Earned timestamp */
  earnedAt: number;
  /** Icon identifier for UI (lucide icon name) */
  icon: string;
  /** Effect value for programmatic use */
  effectValue: number;
  /** Effect type for programmatic use */
  effectType: "card_draw_quality" | "xp_multiplier" | "elo_display" | "starting_energy" | "tax_reduction";
}

export type SynergySource =
  | "chess"
  | "fight"
  | "card_battle"
  | "terminus_swarm"
  | "trade_empire";

/* ─── DURATION CONSTANTS ─── */

const HOUR_MS = 1000 * 60 * 60;
const DAY_MS = HOUR_MS * 24;

/* ─── SYNERGY DEFINITIONS ─── */

export interface SynergyDefinition {
  id: string;
  name: string;
  source: SynergySource;
  triggerCondition: string;
  buffDescription: string;
  targetModes: string[];
  durationMs: number;
  icon: string;
  effectValue: number;
  effectType: Synergy["effectType"];
  /** Function to check if the trigger condition is met from game data */
  checkTrigger: (gameData: Record<string, unknown>) => boolean;
}

export const SYNERGY_DEFINITIONS: SynergyDefinition[] = [
  {
    id: "strategic_mind",
    name: "Strategic Mind",
    source: "chess",
    triggerCondition: "Win a chess match",
    buffDescription: "+5% card draw quality for 24 hours",
    targetModes: ["card_battle"],
    durationMs: 24 * HOUR_MS,
    icon: "Brain",
    effectValue: 0.05,
    effectType: "card_draw_quality",
    checkTrigger: (data) => {
      const chessWins = data.chessWins as number | undefined;
      const lastChessWinAt = data.lastChessWinAt as number | undefined;
      if (!chessWins || !lastChessWinAt) return false;
      return Date.now() - lastChessWinAt < 24 * HOUR_MS;
    },
  },
  {
    id: "battle_hardened",
    name: "Battle Hardened",
    source: "fight",
    triggerCondition: "Land a 10+ hit combo in a fight",
    buffDescription: "+10% XP from all sources for 1 hour",
    targetModes: ["all"],
    durationMs: 1 * HOUR_MS,
    icon: "Swords",
    effectValue: 0.10,
    effectType: "xp_multiplier",
    checkTrigger: (data) => {
      const maxCombo = data.fightMaxCombo as number | undefined;
      const lastFightComboAt = data.lastFightComboAt as number | undefined;
      if (!maxCombo || !lastFightComboAt) return false;
      return maxCombo >= 10 && Date.now() - lastFightComboAt < 1 * HOUR_MS;
    },
  },
  {
    id: "tactician",
    name: "Tactician",
    source: "card_battle",
    triggerCondition: "Win a card battle",
    buffDescription: "+50 chess ELO display bonus (cosmetic)",
    targetModes: ["chess"],
    durationMs: 24 * HOUR_MS,
    icon: "Trophy",
    effectValue: 50,
    effectType: "elo_display",
    checkTrigger: (data) => {
      const cardWins = data.cardBattleWins as number | undefined;
      const lastCardWinAt = data.lastCardBattleWinAt as number | undefined;
      if (!cardWins || !lastCardWinAt) return false;
      return Date.now() - lastCardWinAt < 24 * HOUR_MS;
    },
  },
  {
    id: "survivor",
    name: "Survivor",
    source: "terminus_swarm",
    triggerCondition: "Reach wave 20+ in Terminus Swarm",
    buffDescription: "+1 starting energy in card battles",
    targetModes: ["card_battle"],
    durationMs: 24 * HOUR_MS,
    icon: "ShieldCheck",
    effectValue: 1,
    effectType: "starting_energy",
    checkTrigger: (data) => {
      const highestWave = data.terminusHighestWave as number | undefined;
      const lastTerminusWave20At = data.lastTerminusWave20At as number | undefined;
      if (!highestWave || !lastTerminusWave20At) return false;
      return highestWave >= 20 && Date.now() - lastTerminusWave20At < 24 * HOUR_MS;
    },
  },
  {
    id: "merchant",
    name: "Merchant",
    source: "trade_empire",
    triggerCondition: "Earn a profit in Trade Empire",
    buffDescription: "-5% marketplace tax for 24 hours",
    targetModes: ["marketplace"],
    durationMs: 24 * HOUR_MS,
    icon: "Coins",
    effectValue: 0.05,
    effectType: "tax_reduction",
    checkTrigger: (data) => {
      const tradeProfit = data.tradeEmpireProfit as number | undefined;
      const lastTradeProfitAt = data.lastTradeProfitAt as number | undefined;
      if (!tradeProfit || !lastTradeProfitAt) return false;
      return tradeProfit > 0 && Date.now() - lastTradeProfitAt < 24 * HOUR_MS;
    },
  },
];

/* ─── SYNERGY EVALUATION ─── */

/**
 * Evaluate all cross-game synergies for a player based on their game data.
 * Returns an array of currently active synergies with computed expiry timestamps.
 *
 * @param gameData - A record of game state data (e.g., chessWins, fightMaxCombo, etc.)
 *   Keys depend on what each synergy definition checks.
 */
export function getActiveSynergies(gameData: Record<string, unknown>): Synergy[] {
  const now = Date.now();
  const active: Synergy[] = [];

  for (const def of SYNERGY_DEFINITIONS) {
    if (def.checkTrigger(gameData)) {
      // Determine earned time from the relevant "lastXxxAt" field
      const earnedAt = getEarnedTimestamp(def, gameData) || now;
      const expiresAt = earnedAt + def.durationMs;

      // Only include if not yet expired
      if (expiresAt > now) {
        active.push({
          id: def.id,
          name: def.name,
          source: def.source,
          triggerCondition: def.triggerCondition,
          buffDescription: def.buffDescription,
          targetModes: def.targetModes,
          durationMs: def.durationMs,
          expiresAt,
          earnedAt,
          icon: def.icon,
          effectValue: def.effectValue,
          effectType: def.effectType,
        });
      }
    }
  }

  return active;
}

/**
 * Check if a specific synergy is currently active.
 */
export function isSynergyActive(
  synergyId: string,
  gameData: Record<string, unknown>,
): boolean {
  return getActiveSynergies(gameData).some(s => s.id === synergyId);
}

/**
 * Get the effect value for a specific synergy if active, otherwise 0.
 */
export function getSynergyEffectValue(
  synergyId: string,
  gameData: Record<string, unknown>,
): number {
  const synergy = getActiveSynergies(gameData).find(s => s.id === synergyId);
  return synergy?.effectValue ?? 0;
}

/**
 * Get remaining time on a synergy in human-readable format.
 */
export function getSynergyTimeRemaining(synergy: Synergy): string {
  const remaining = synergy.expiresAt - Date.now();
  if (remaining <= 0) return "Expired";

  const hours = Math.floor(remaining / HOUR_MS);
  const minutes = Math.floor((remaining % HOUR_MS) / (1000 * 60));

  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

/* ─── INTERNAL HELPERS ─── */

function getEarnedTimestamp(def: SynergyDefinition, gameData: Record<string, unknown>): number | null {
  const sourceTimestampKeys: Record<SynergySource, string> = {
    chess: "lastChessWinAt",
    fight: "lastFightComboAt",
    card_battle: "lastCardBattleWinAt",
    terminus_swarm: "lastTerminusWave20At",
    trade_empire: "lastTradeProfitAt",
  };

  const key = sourceTimestampKeys[def.source];
  const value = gameData[key];
  return typeof value === "number" ? value : null;
}
