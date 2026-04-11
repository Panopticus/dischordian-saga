/* ═══════════════════════════════════════════════════════
   DEPLOYMENT PROMOTIONS + DEATHS

   Deployed apprentices level up over time in their assigned
   role. Each promotion unlocks stronger bonuses + a narrative
   beat. They can also die in the field.
   ═══════════════════════════════════════════════════════ */

import type { GraduateRole } from "./graduateLegion";

export interface DeploymentRank {
  tier: 1 | 2 | 3 | 4 | 5;
  title: string;
  /** Multiplier on role bonus at this rank */
  bonusMultiplier: number;
  /** Days deployed to reach this rank */
  daysRequired: number;
  /** Narrative beat unlocked */
  promotionFlavor: string;
}

/** Ranks per role */
export const DEPLOYMENT_RANKS: Record<string, DeploymentRank[]> = {
  army_leader: [
    { tier: 1, title: "Captain", bonusMultiplier: 1.0, daysRequired: 0,
      promotionFlavor: "Took command. Didn't embarrass you." },
    { tier: 2, title: "Commander", bonusMultiplier: 1.25, daysRequired: 14,
      promotionFlavor: "The Yellow Coats respect them now. Not love. Respect." },
    { tier: 3, title: "Field General", bonusMultiplier: 1.5, daysRequired: 45,
      promotionFlavor: "They've won a battle you couldn't have won. You're proud. You're also uneasy." },
    { tier: 4, title: "Warlord", bonusMultiplier: 2.0, daysRequired: 120,
      promotionFlavor: "They are the Warlord now, in miniature. The real Warlord would recognize them. That's a warning." },
    { tier: 5, title: "Archon-Claimant", bonusMultiplier: 3.0, daysRequired: 365,
      promotionFlavor: "Mechronis Professors have taken notice. Letters arrive. Questions are asked. The Architect is watching." },
  ],
  trade_envoy: [
    { tier: 1, title: "Envoy", bonusMultiplier: 1.0, daysRequired: 0,
      promotionFlavor: "First contracts signed. Modest but clean." },
    { tier: 2, title: "Syndicate Agent", bonusMultiplier: 1.3, daysRequired: 14,
      promotionFlavor: "They know every faction's trade floor by smell now." },
    { tier: 3, title: "Trade Architect", bonusMultiplier: 1.6, daysRequired: 45,
      promotionFlavor: "They've rewritten three planetary economies. Slightly. Nothing dramatic. Nothing you can point to." },
    { tier: 4, title: "Galactic Signatory", bonusMultiplier: 2.2, daysRequired: 120,
      promotionFlavor: "Their signature carries weight across the known sectors. So does their silence." },
    { tier: 5, title: "Unknown Quantity", bonusMultiplier: 3.0, daysRequired: 365,
      promotionFlavor: "No one knows how wealthy they've made you. Including you." },
  ],
  tower_captain: [
    { tier: 1, title: "Captain", bonusMultiplier: 1.0, daysRequired: 0,
      promotionFlavor: "First wave survived. Not clean, but survived." },
    { tier: 2, title: "Wave Tactician", bonusMultiplier: 1.25, daysRequired: 14,
      promotionFlavor: "They predict enemy patterns three waves out." },
    { tier: 3, title: "Terminus Defender", bonusMultiplier: 1.5, daysRequired: 45,
      promotionFlavor: "They've held lines that should have fallen. The Swarm notices." },
    { tier: 4, title: "Citadel Warden", bonusMultiplier: 2.0, daysRequired: 120,
      promotionFlavor: "They command other Captains now. Wayne's ghost would approve." },
    { tier: 5, title: "The Line Itself", bonusMultiplier: 3.0, daysRequired: 365,
      promotionFlavor: "They ARE the defense now. You can't remember what it was like without them." },
  ],
};

/* ─── DEATH RISK ─── */

export interface DeploymentDeathRoll {
  deathChance: number;  // 0-1
  escalatingThreat: string;
}

/**
 * Compute death probability for a deployed apprentice this week.
 * Higher-rank deployments face stronger enemies, so risk goes UP with rank.
 */
export function computeDeploymentDeathChance(role: GraduateRole, rank: number, daysDeployed: number): DeploymentDeathRoll {
  // Base weekly risk by role
  const baseRisk: Record<string, number> = {
    army_leader: 0.03,
    trade_envoy: 0.015,
    tower_captain: 0.04,
  };
  const base = baseRisk[role] ?? 0.01;
  // Risk grows with rank (bigger fights)
  const rankBonus = (rank - 1) * 0.015;
  // Risk grows slightly with tenure (complacency)
  const tenureBonus = Math.min(0.03, daysDeployed / 1000);
  const chance = Math.min(0.25, base + rankBonus + tenureBonus);

  const threat = rank >= 4
    ? "The Architect has dispatched an Archon-class threat against their post."
    : rank >= 3
    ? "A rival power has marked them for removal."
    : rank >= 2
    ? "The opposition knows their name now."
    : "Standard deployment risks apply.";

  return { deathChance: chance, escalatingThreat: threat };
}

/* ─── DEATH CAUSES ─── */

export const DEPLOYMENT_DEATH_CAUSES: Record<string, string[]> = {
  army_leader: [
    "fell leading a forlorn hope at the Circuit Wastes siege",
    "ambushed by Warden-loyalist cells during a supply march",
    "gave the order to retreat, then covered the retreat personally",
    "traded their life for the survival of their Second",
    "shot by a sniper they'd trained as a recruit — old grudge",
  ],
  trade_envoy: [
    "poisoned at a New Babylon banquet by a faction they'd outmaneuvered",
    "vanished during a solo negotiation with the Insurgency",
    "killed in a market bombing — the bomb wasn't meant for them",
    "execution-order signed by the Architect's Trade Council",
  ],
  tower_captain: [
    "died holding the last tower during an overrun wave",
    "caught outside the perimeter after repositioning a mobile slot",
    "killed by a Swarm elite they'd beaten twice before",
    "gave the 'danger-close' order to wipe out the breach — including themselves",
  ],
};

export function pickDeathCause(role: GraduateRole): string {
  const causes = DEPLOYMENT_DEATH_CAUSES[role];
  if (!causes) return "fell in the line of duty";
  return causes[Math.floor(Math.random() * causes.length)];
}

/* ─── HELPERS ─── */

export function getRankForDays(role: GraduateRole, daysDeployed: number): DeploymentRank | null {
  const ranks = DEPLOYMENT_RANKS[role];
  if (!ranks) return null;
  let current: DeploymentRank | null = null;
  for (const r of ranks) {
    if (daysDeployed >= r.daysRequired) current = r;
    else break;
  }
  return current;
}

export function getNextRank(role: GraduateRole, daysDeployed: number): DeploymentRank | null {
  const ranks = DEPLOYMENT_RANKS[role];
  if (!ranks) return null;
  for (const r of ranks) {
    if (daysDeployed < r.daysRequired) return r;
  }
  return null;
}
