/**
 * DONATION SYSTEM
 * ══════════════════════════════════════════════════════════
 * Card/material donations, weekly limits, reputation tiers.
 * RPG IMPACT: Civil skill "Diplomacy" increases donation limits, 
 * class affects donation value multiplier.
 */

export type DonationType = "card" | "material" | "dream" | "token";

export interface ReputationTier {
  tier: number;
  name: string;
  icon: string;
  color: string;
  minReputation: number;
  perks: string[];
}

export const REPUTATION_TIERS: ReputationTier[] = [
  { tier: 1, name: "Newcomer", icon: "User", color: "#78716c", minReputation: 0, perks: ["Basic guild access"] },
  { tier: 2, name: "Contributor", icon: "Heart", color: "#22c55e", minReputation: 100, perks: ["+5% guild shop discount"] },
  { tier: 3, name: "Benefactor", icon: "Gift", color: "#3b82f6", minReputation: 500, perks: ["+10% guild shop discount", "Priority guild recruitment"] },
  { tier: 4, name: "Patron", icon: "Crown", color: "#f59e0b", minReputation: 1500, perks: ["+15% guild shop discount", "Exclusive patron cosmetics", "Guild officer nomination"] },
  { tier: 5, name: "Grand Patron", icon: "Sparkles", color: "#8b5cf6", minReputation: 5000, perks: ["+20% guild shop discount", "Mythic patron frame", "Guild council seat", "Custom guild title"] },
];

/** Weekly donation limits by type */
export const WEEKLY_LIMITS: Record<DonationType, number> = {
  card: 10,
  material: 50,
  dream: 200,
  token: 100,
};

/** Reputation earned per donation */
export const REPUTATION_PER_DONATION: Record<DonationType, number> = {
  card: 15,
  material: 5,
  dream: 2,
  token: 3,
};

export function getReputationTier(reputation: number): ReputationTier {
  for (let i = REPUTATION_TIERS.length - 1; i >= 0; i--) {
    if (reputation >= REPUTATION_TIERS[i].minReputation) return REPUTATION_TIERS[i];
  }
  return REPUTATION_TIERS[0];
}

export function getNextTier(reputation: number): ReputationTier | null {
  const current = getReputationTier(reputation);
  const next = REPUTATION_TIERS.find(t => t.tier === current.tier + 1);
  return next || null;
}

/** Calculate donation limit with RPG bonuses */
export function getDonationLimit(
  baseType: DonationType,
  opts: { civilSkills?: Record<string, number>; characterClass?: string }
): number {
  let limit = WEEKLY_LIMITS[baseType];
  // Diplomacy civil skill increases limits
  const diplomacyLevel = opts.civilSkills?.["diplomacy"] || 0;
  if (diplomacyLevel >= 2) limit = Math.ceil(limit * (1 + diplomacyLevel * 0.10));
  // Engineer class gets material bonus
  if (opts.characterClass === "engineer" && baseType === "material") limit = Math.ceil(limit * 1.25);
  return limit;
}

/** Calculate reputation earned with RPG bonuses */
export function getReputationEarned(
  type: DonationType,
  amount: number,
  opts: { civilSkills?: Record<string, number>; talents?: string[] }
): number {
  let rep = REPUTATION_PER_DONATION[type] * amount;
  const diplomacyLevel = opts.civilSkills?.["diplomacy"] || 0;
  if (diplomacyLevel >= 3) rep = Math.ceil(rep * 1.15);
  return rep;
}
