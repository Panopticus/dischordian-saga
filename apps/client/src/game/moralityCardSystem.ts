/* ═══════════════════════════════════════════════════════
   MORALITY CARD ALIGNMENT SYSTEM
   
   Cards have alignment (order/chaos). Your morality score
   determines how well you can wield each alignment:
   
   Machine alignment (score < -20): 
     - ORDER cards get +1 ATK (disciplined, systematic)
     - CHAOS cards cost +1 energy (harder to control)
   
   Humanity alignment (score > 20):
     - CHAOS cards get +1 ATK (passionate, unpredictable)
     - ORDER cards cost +1 energy (too rigid for you)
   
   Balanced (-20 to 20):
     - No bonuses or penalties — versatile but unspecialized
   
   Extreme alignment (|score| > 60):
     - Aligned cards get +2 ATK instead of +1
     - Opposed cards cost +2 energy instead of +1
     - NEW: Aligned cards gain a keyword bonus
   ═══════════════════════════════════════════════════════ */

export type MoralityAlignment = "machine" | "balanced" | "humanity";

export interface CardMoralityModifier {
  /** ATK bonus/penalty */
  atkBonus: number;
  /** Extra energy cost (0 = no change, positive = costs more) */
  energyCostModifier: number;
  /** Bonus keyword granted by extreme alignment */
  bonusKeyword: string | null;
  /** Description of the modifier */
  description: string;
  /** Whether this is a bonus or penalty */
  type: "bonus" | "penalty" | "neutral";
}

export function getMoralityAlignment(moralityScore: number): MoralityAlignment {
  if (moralityScore <= -20) return "machine";
  if (moralityScore >= 20) return "humanity";
  return "balanced";
}

export function getCardMoralityModifier(
  moralityScore: number,
  cardAlignment: string | null
): CardMoralityModifier {
  if (!cardAlignment) {
    return { atkBonus: 0, energyCostModifier: 0, bonusKeyword: null, description: "No alignment", type: "neutral" };
  }

  const alignment = getMoralityAlignment(moralityScore);
  const isExtreme = Math.abs(moralityScore) > 60;
  const atkBoost = isExtreme ? 2 : 1;
  const costPenalty = isExtreme ? 2 : 1;

  if (alignment === "balanced") {
    return { atkBonus: 0, energyCostModifier: 0, bonusKeyword: null, description: "Balanced — no alignment modifiers", type: "neutral" };
  }

  // Machine alignment: ORDER = bonus, CHAOS = penalty
  if (alignment === "machine") {
    if (cardAlignment === "order") {
      return {
        atkBonus: atkBoost,
        energyCostModifier: 0,
        bonusKeyword: isExtreme ? "pierce" : null,
        description: `Machine Synergy: +${atkBoost} ATK${isExtreme ? " + Pierce" : ""}`,
        type: "bonus",
      };
    }
    if (cardAlignment === "chaos") {
      return {
        atkBonus: 0,
        energyCostModifier: costPenalty,
        bonusKeyword: null,
        description: `Machine Resistance: +${costPenalty} energy cost`,
        type: "penalty",
      };
    }
  }

  // Humanity alignment: CHAOS = bonus, ORDER = penalty
  if (alignment === "humanity") {
    if (cardAlignment === "chaos") {
      return {
        atkBonus: atkBoost,
        energyCostModifier: 0,
        bonusKeyword: isExtreme ? "rally" : null,
        description: `Humanity Synergy: +${atkBoost} ATK${isExtreme ? " + Rally" : ""}`,
        type: "bonus",
      };
    }
    if (cardAlignment === "order") {
      return {
        atkBonus: 0,
        energyCostModifier: costPenalty,
        bonusKeyword: null,
        description: `Humanity Resistance: +${costPenalty} energy cost`,
        type: "penalty",
      };
    }
  }

  return { atkBonus: 0, energyCostModifier: 0, bonusKeyword: null, description: "No modifier", type: "neutral" };
}

/** Get a summary of all morality card effects for the current score */
export function getMoralityCardSummary(moralityScore: number): {
  alignment: MoralityAlignment;
  orderEffect: string;
  chaosEffect: string;
  isExtreme: boolean;
} {
  const alignment = getMoralityAlignment(moralityScore);
  const isExtreme = Math.abs(moralityScore) > 60;

  if (alignment === "balanced") {
    return {
      alignment,
      orderEffect: "No modifier",
      chaosEffect: "No modifier",
      isExtreme: false,
    };
  }

  if (alignment === "machine") {
    return {
      alignment,
      orderEffect: `+${isExtreme ? 2 : 1} ATK${isExtreme ? ", +Pierce" : ""}`,
      chaosEffect: `+${isExtreme ? 2 : 1} energy cost`,
      isExtreme,
    };
  }

  return {
    alignment,
    orderEffect: `+${isExtreme ? 2 : 1} energy cost`,
    chaosEffect: `+${isExtreme ? 2 : 1} ATK${isExtreme ? ", +Rally" : ""}`,
    isExtreme,
  };
}
