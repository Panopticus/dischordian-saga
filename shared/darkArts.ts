/* ═══════════════════════════════════════════════════════
   DARK ARTS

   The forbidden branch. Every Guild signature ability has a
   Dark variant — more powerful, pays in corruption. The more
   corruption you carry, the more NPCs notice, the more the
   Academy distrusts you, the more power you unlock.

   Design:
     • 0-100 corruption scale
     • Tiers: Clean (0) / Tainted (25) / Corrupted (50) / Consumed (75) / Architect's Enemy (100)
     • Each tier unlocks NEW dark abilities AND applies penalties
     • Using a dark variant = corruption gain from its config
     • Corruption NEVER decreases automatically. Purge rituals
       (expensive, narrative) are the only way down.
     • At 100, the player becomes an Architect's Enemy —
       hunted, locked out of Mechronis, alternative endings open
   ═══════════════════════════════════════════════════════ */

export type DarkTier = "clean" | "tainted" | "corrupted" | "consumed" | "enemy";

export interface DarkTierInfo {
  id: DarkTier;
  name: string;
  minCorruption: number;
  maxCorruption: number;
  color: string;
  description: string;
  /** Penalties applied while at this tier */
  penalties: string[];
  /** Bonuses unlocked at this tier (power comes with corruption) */
  bonuses: string[];
}

export const DARK_TIERS: DarkTierInfo[] = [
  {
    id: "clean", name: "Clean", minCorruption: 0, maxCorruption: 24,
    color: "#86efac",
    description: "The Academy trusts you. Your voices are steady.",
    penalties: [],
    bonuses: ["All NPC trust gains +10%"],
  },
  {
    id: "tainted", name: "Tainted", minCorruption: 25, maxCorruption: 49,
    color: "#fde047",
    description: "Something has changed in how you see. The Archons have noticed.",
    penalties: ["Elara trust gains -15%", "Companion bond growth slowed"],
    bonuses: ["Dark variant cooldowns -10%", "Combat damage +5%"],
  },
  {
    id: "corrupted", name: "Corrupted", minCorruption: 50, maxCorruption: 74,
    color: "#fb923c",
    description: "You've crossed a line you cannot un-cross. Some NPCs refuse to meet your eye.",
    penalties: [
      "Order-aligned NPCs refuse dialog",
      "Elara trust degrades over time",
      "Apprentice corruption rises 2x faster",
    ],
    bonuses: [
      "Dark variant cooldowns -25%",
      "Combat damage +15%",
      "Forbidden abilities unlocked (per Guild)",
    ],
  },
  {
    id: "consumed", name: "Consumed", minCorruption: 75, maxCorruption: 99,
    color: "#ef4444",
    description: "The Dark Arts wear you now. You wear them back. Your companions leave or turn.",
    penalties: [
      "Companions may betray at high corruption",
      "Most Order NPCs treat you as enemy",
      "Guild standing drops weekly",
      "Locked out of Mechronis Academy",
    ],
    bonuses: [
      "Dark variant cooldowns -50%",
      "Combat damage +30%",
      "Necromancer's Call: revive at 50% HP on death, once per day",
      "Sith-path endings unlocked",
    ],
  },
  {
    id: "enemy", name: "Architect's Enemy", minCorruption: 100, maxCorruption: 100,
    color: "#991b1b",
    description: "The Architect has marked you for deletion. The entire AI Empire hunts you. Good.",
    penalties: [
      "All Order-aligned NPCs hostile",
      "Cannot return to Mechronis",
      "Can no longer recruit new Apprentices",
      "Ambush encounters +300%",
    ],
    bonuses: [
      "All dark variants cooldown -75%",
      "Combat damage +50%",
      "Unique endings only you can reach",
      "The Dreamer sends secret allies",
    ],
  },
];

export function getDarkTier(corruption: number): DarkTierInfo {
  const c = Math.max(0, Math.min(100, corruption));
  return DARK_TIERS.find(t => c >= t.minCorruption && c <= t.maxCorruption) ?? DARK_TIERS[0];
}

/* ─── CORRUPTION PURGE ─── */

export interface PurgeRitual {
  id: string;
  name: string;
  corruptionReduction: number;
  cost: { dream: number; xp: number };
  /** Narrative prerequisite */
  requires: string;
  /** Warning — what you lose */
  sacrifice: string;
}

export const PURGE_RITUALS: PurgeRitual[] = [
  {
    id: "confession_chorus", name: "Confession to The Chorus",
    corruptionReduction: 10,
    cost: { dream: 50, xp: 500 },
    requires: "Admit a truth you've hidden. The Chorus records it in the network.",
    sacrifice: "One lore achievement is locked.",
  },
  {
    id: "wayne_quarantine", name: "Wayne's Quarantine",
    corruptionReduction: 25,
    cost: { dream: 200, xp: 1500 },
    requires: "Return to Wayne. Enter the Lock willingly. Emerge 3 days later.",
    sacrifice: "One skill drops by 10 points.",
  },
  {
    id: "necromancer_trade", name: "The Necromancer's Trade",
    corruptionReduction: 50,
    cost: { dream: 500, xp: 5000 },
    requires: "Enter the Matrix of Dreams. Bargain with The Necromancer.",
    sacrifice: "One companion's bond resets to 0. You choose which.",
  },
  {
    id: "architects_audit", name: "The Architect's Audit",
    corruptionReduction: 100,
    cost: { dream: 2000, xp: 20000 },
    requires: "The Architect's Study summons you. Only the Seeker has ever done this.",
    sacrifice: "Your character is scanned. Three narrative flags are reset. Your archetype may change.",
  },
];

export function canAffordPurge(ritual: PurgeRitual, dream: number, xp: number): boolean {
  return dream >= ritual.cost.dream && xp >= ritual.cost.xp;
}
