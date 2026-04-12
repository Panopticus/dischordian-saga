/* ═══════════════════════════════════════════════════════
   COMPANION COMBAT SERVICE — Bond → Combat Bonus Pipeline

   Companion bond level affects combat stats. Deeper bonds
   mean stronger combat performance. Soul-bound Eidolons
   get a 1.5x multiplier on all bonuses.

   Usage from fight/pet routers:
     const bonus = await companionCombat.getCombatBonus(userId);
     const adjustedDamage = baseDamage * (1 + bonus.attack / 100);
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { eidolonBonds } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export interface CompanionCombatBonus {
  /** Attack bonus as percentage (e.g., 6 means +6%) */
  attack: number;
  /** Defense bonus as percentage */
  defense: number;
  /** Speed/tertiary bonus as percentage */
  speed: number;
  /** Whether companion is soul-bound (1.5x multiplier applied) */
  isSoulBound: boolean;
  /** Bond level used for calculation */
  bondLevel: number;
  /** Companion ID */
  companionId: string | null;
  /** Human-readable tier label */
  tierLabel: string;
  /** Spectral bonus if companion is a ghost */
  spectralBonus: { system: string; percentage: number } | null;
}

const BOND_TIERS = [
  { min: 0,   max: 19,  primary: 0,  secondary: 0, tertiary: 0, label: "No Bond" },
  { min: 20,  max: 39,  primary: 2,  secondary: 0, tertiary: 0, label: "Fledgling" },
  { min: 40,  max: 59,  primary: 4,  secondary: 1, tertiary: 0, label: "Bonded" },
  { min: 60,  max: 79,  primary: 6,  secondary: 2, tertiary: 1, label: "Deep Bond" },
  { min: 80,  max: 99,  primary: 8,  secondary: 3, tertiary: 2, label: "Soul Resonance" },
  { min: 100, max: 100, primary: 10, secondary: 10, tertiary: 10, label: "Transcendent" },
];

function getBondTier(bond: number) {
  return BOND_TIERS.find(t => bond >= t.min && bond <= t.max) ?? BOND_TIERS[0];
}

export const companionCombat = {
  /**
   * Get combat bonuses from the player's active soul-bound Eidolon.
   * Returns zero bonuses if no companion or bond is too low.
   */
  async getCombatBonus(userId: number): Promise<CompanionCombatBonus> {
    const empty: CompanionCombatBonus = {
      attack: 0, defense: 0, speed: 0,
      isSoulBound: false, bondLevel: 0, companionId: null,
      tierLabel: "No Companion", spectralBonus: null,
    };

    const db = await getDb();
    if (!db) return empty;

    // Get active soul-bound eidolon
    const [bond] = await db.select().from(eidolonBonds)
      .where(and(
        eq(eidolonBonds.userId, userId),
        eq(eidolonBonds.isSoulBound, true),
      ))
      .limit(1);

    if (!bond) return empty;

    const tier = getBondTier(bond.bond);
    const soulMultiplier = bond.isSoulBound ? 1.5 : 1.0;

    // Spectral companions retain bonds but gain system-specific bonus
    let spectralBonus: { system: string; percentage: number } | null = null;
    if (bond.isSpectral && bond.spectralBonusSystem) {
      spectralBonus = { system: bond.spectralBonusSystem, percentage: 10 };
    }

    return {
      attack: Math.round(tier.primary * soulMultiplier),
      defense: Math.round(tier.secondary * soulMultiplier),
      speed: Math.round(tier.tertiary * soulMultiplier),
      isSoulBound: bond.isSoulBound,
      bondLevel: bond.bond,
      companionId: bond.eidolonId,
      tierLabel: tier.label,
      spectralBonus,
    };
  },

  /**
   * Apply combat bonus to a base stat value.
   * Returns adjusted value with bonus percentage applied.
   */
  applyBonus(baseStat: number, bonusPercent: number): number {
    return Math.round(baseStat * (1 + bonusPercent / 100));
  },

  /**
   * Format bonus breakdown for client display.
   * e.g., "Lux contributed +6% attack, +2% defense"
   */
  formatBreakdown(bonus: CompanionCombatBonus): string | null {
    if (bonus.attack === 0 && bonus.defense === 0 && bonus.speed === 0) return null;
    const parts: string[] = [];
    if (bonus.attack > 0) parts.push(`+${bonus.attack}% attack`);
    if (bonus.defense > 0) parts.push(`+${bonus.defense}% defense`);
    if (bonus.speed > 0) parts.push(`+${bonus.speed}% speed`);
    return `${bonus.companionId} contributed ${parts.join(", ")}`;
  },

  /**
   * Task 5.1 — One-shot helper that applies the companion's attack
   * bonus to an arbitrary reward payload (points, xp, dream, etc.).
   *
   * Mirrors the shape of `applyPrestigeBonuses` in prestigeMultiplier.ts
   * so routers have a consistent "scale this reward" pattern no matter
   * which system they're in.
   *
   * `attack` is used as the single scalar because combat rewards are
   * attack-driven; defense/speed already apply to other stats. For
   * non-combat systems the caller can still read `getCombatBonus` and
   * pick whichever axis is relevant.
   */
  async applyCompanionBonusesToRewards(
    userId: number,
    rewards: { points?: number; xp?: number; dream?: number; credits?: number },
  ): Promise<{
    points: number;
    xp: number;
    dream: number;
    credits: number;
    bonus: CompanionCombatBonus;
  }> {
    const bonus = await this.getCombatBonus(userId);
    const mult = 1 + bonus.attack / 100;
    return {
      points: Math.round((rewards.points ?? 0) * mult),
      xp: Math.round((rewards.xp ?? 0) * mult),
      dream: Math.round((rewards.dream ?? 0) * mult),
      credits: Math.round((rewards.credits ?? 0) * mult),
      bonus,
    };
  },
};
