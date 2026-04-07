/* ═══════════════════════════════════════════════════════
   SOUL STONE SERVICE

   Helper functions that operate on the Soul Stone store
   from outside React — for integration with fight, arena,
   TD, and narrative systems.
   ═══════════════════════════════════════════════════════ */

import { useSoulStoneStore } from "./soulStoneStore";
import type {
  SoulStone,
  StoneState,
  PurificationAttempt,
  CorruptionTier,
  PurityTier,
} from "./types";

/* ─── COMBAT SOURCE DETECTION ─── */

const COMBAT_SOURCE_PREFIXES = ["arena_", "td_", "fight_", "combat_"];

/** Check if a source is combat (subject to weekly cap) vs narrative (uncapped) */
export function isCombatSource(source: string): boolean {
  return COMBAT_SOURCE_PREFIXES.some((prefix) => source.startsWith(prefix));
}

/* ─── STONE AWARDING ─── */

/** Called by fight/arena/TD systems when player earns a stone */
export function awardSoulStone(
  source: string,
  quality?: StoneState,
): SoulStone | null {
  return useSoulStoneStore.getState().collectStone(source, quality);
}

/* ─── PURIFICATION HELPERS ─── */

/** Get time remaining on a purification in ms */
export function getPurificationTimeRemaining(
  attempt: PurificationAttempt,
): number {
  return Math.max(0, attempt.endTime - Date.now());
}

/** Format a countdown for purification timers */
export function formatPurificationCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/* ─── WEEKLY CAP ─── */

/** Check if weekly cap is reached */
export function isWeeklyCapped(): boolean {
  const s = useSoulStoneStore.getState();

  // If the reset window has passed, cap is effectively not reached
  if (Date.now() >= s.weeklyDropResetAt) return false;

  return s.weeklyDropCount >= 15;
}

/* ─── DROP RATE ─── */

/** Calculate effective drop rate with Harvest Tendril bonus */
export function getEffectiveDropRate(
  baseRate: number,
  hasHarvestTendril: boolean,
): number {
  // Harvest Tendril (demon pet ability) grants +15% additive bonus
  const bonus = hasHarvestTendril ? 0.15 : 0;
  return Math.min(1, baseRate + bonus);
}

/* ─── CORRUPTION TIERS ─── */

const CORRUPTION_TIERS: {
  tier: CorruptionTier;
  min: number;
  name: string;
  color: string;
}[] = [
  { tier: 0, min: 0, name: "Untouched", color: "#a0a0a0" },
  { tier: 1, min: 25, name: "Whispers", color: "#c44dff" },
  { tier: 2, min: 50, name: "Creeping Dark", color: "#9b1dff" },
  { tier: 3, min: 75, name: "Shadow Reign", color: "#6e0dd0" },
  { tier: 4, min: 90, name: "Abyssal", color: "#3a0070" },
];

/** Get the corruption tier based on level (0-100) */
export function getCorruptionTier(level: number): CorruptionTier {
  for (let i = CORRUPTION_TIERS.length - 1; i >= 0; i--) {
    if (level >= CORRUPTION_TIERS[i].min) {
      return CORRUPTION_TIERS[i].tier;
    }
  }
  return 0;
}

/** Get corruption meter display data */
export function getCorruptionDisplay(): {
  level: number;
  tier: CorruptionTier;
  tierName: string;
  color: string;
} {
  const { globalCorruption } = useSoulStoneStore.getState();
  const tier = getCorruptionTier(globalCorruption);
  const tierData = CORRUPTION_TIERS.find((t) => t.tier === tier)!;

  return {
    level: globalCorruption,
    tier,
    tierName: tierData.name,
    color: tierData.color,
  };
}

/* ─── PURITY TIERS ─── */

const PURITY_TIERS: {
  tier: PurityTier;
  min: number;
  name: string;
  color: string;
}[] = [
  { tier: 0, min: 0, name: "Mundane", color: "#a0a0a0" },
  { tier: 1, min: 25, name: "Glimmering", color: "#ffe066" },
  { tier: 2, min: 50, name: "Radiant", color: "#ffd700" },
  { tier: 3, min: 75, name: "Sanctified", color: "#ffaa00" },
  { tier: 4, min: 90, name: "Transcendent", color: "#ff8800" },
];

/** Get the purity tier based on level (0-100) */
export function getPurityTier(level: number): PurityTier {
  for (let i = PURITY_TIERS.length - 1; i >= 0; i--) {
    if (level >= PURITY_TIERS[i].min) {
      return PURITY_TIERS[i].tier;
    }
  }
  return 0;
}

/** Get purity meter display data */
export function getPurityDisplay(): {
  level: number;
  tier: PurityTier;
  tierName: string;
  color: string;
} {
  const { globalPurity } = useSoulStoneStore.getState();
  const tier = getPurityTier(globalPurity);
  const tierData = PURITY_TIERS.find((t) => t.tier === tier)!;

  return {
    level: globalPurity,
    tier,
    tierName: tierData.name,
    color: tierData.color,
  };
}
