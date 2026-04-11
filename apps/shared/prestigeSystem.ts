/* ═══════════════════════════════════════════════════════
   PRESTIGE SYSTEM — Reset for Power

   At max level (25), players can "prestige" — resetting their
   level to 1 in exchange for permanent multipliers that stack.
   Each prestige adds a star to their title and unlocks exclusive
   ship themes, titles, and cosmetics.

   Cookie Clicker ascension, NG+ in Dark Souls

   The twist: each prestige also locks you into a deeper
   narrative path. Prestige 1 = you've lived through the
   Fall once. Prestige 5 = you've witnessed every ending.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export interface PrestigeLevel {
  level: number;
  /** Stars displayed on title (★) */
  stars: number;
  /** Title prefix earned */
  titlePrefix: string;
  /** Permanent XP multiplier (stacks) */
  xpMultiplier: number;
  /** Permanent resource multiplier */
  resourceMultiplier: number;
  /** Permanent trust gain multiplier */
  trustMultiplier: number;
  /** Exclusive reward unlocked at this prestige */
  reward: PrestigeReward;
  /** Narrative flavor — what the prestige means in-world */
  loreText: string;
  /** Required player level to prestige (always 25) */
  requiredLevel: number;
}

export interface PrestigeReward {
  type: "ship_theme" | "title" | "cosmetic" | "equipment" | "room_unlock" | "npc_dialog";
  id: string;
  name: string;
  description: string;
}

export interface PrestigeState {
  /** Current prestige level (0 = never prestiged) */
  currentPrestige: number;
  /** Total times prestiged */
  totalPrestiges: number;
  /** Cumulative XP earned across all prestiges */
  lifetimeXp: number;
  /** Cumulative resources earned across all prestiges */
  lifetimeResources: { dream: number; salvage: number; voidCrystals: number };
  /** Timestamps of each prestige */
  prestigeHistory: { level: number; date: string; playerLevel: number }[];
}

/* ─── PRESTIGE LEVELS ─── */

export const PRESTIGE_LEVELS: PrestigeLevel[] = [
  {
    level: 1, stars: 1,
    titlePrefix: "Reborn",
    xpMultiplier: 1.10, resourceMultiplier: 1.05, trustMultiplier: 1.05,
    reward: { type: "ship_theme", id: "prestige_1_rebirth", name: "Rebirth Protocol", description: "A ship theme of white light breaking through void darkness. You've survived the cycle once." },
    loreText: "You've lived through the Fall. You remember the endings. The Antiquarian nods — you've joined his collection of witnesses.",
    requiredLevel: 25,
  },
  {
    level: 2, stars: 2,
    titlePrefix: "Veteran",
    xpMultiplier: 1.20, resourceMultiplier: 1.10, trustMultiplier: 1.10,
    reward: { type: "title", id: "prestige_2_title", name: "Twice-Born Operative", description: "A title that marks you as someone who chose to return." },
    loreText: "Twice through the cycle. The NPCs begin to recognize you — not from this timeline, but from the echoes. Elara says your neural patterns feel familiar.",
    requiredLevel: 25,
  },
  {
    level: 3, stars: 3,
    titlePrefix: "Elite",
    xpMultiplier: 1.35, resourceMultiplier: 1.15, trustMultiplier: 1.15,
    reward: { type: "equipment", id: "prestige_3_weapon", name: "Cycle Breaker", description: "A weapon that shouldn't exist — forged from memories of timelines that never happened." },
    loreText: "The Human speaks to you differently now. 'You're not just a Potential anymore. You're something the Architect never planned for — someone who remembers.'",
    requiredLevel: 25,
  },
  {
    level: 4, stars: 4,
    titlePrefix: "Ascendant",
    xpMultiplier: 1.50, resourceMultiplier: 1.20, trustMultiplier: 1.20,
    reward: { type: "cosmetic", id: "prestige_4_aura", name: "Temporal Aura", description: "A visible shimmer around your character — you exist slightly out of sync with time." },
    loreText: "The Antiquarian removes his goggles for the first time. His eyes glow not red but gold. 'You're beginning to see what I see. Every version. Every ending. Every possibility.'",
    requiredLevel: 25,
  },
  {
    level: 5, stars: 5,
    titlePrefix: "Eternal",
    xpMultiplier: 1.75, resourceMultiplier: 1.30, trustMultiplier: 1.30,
    reward: { type: "room_unlock", id: "prestige_5_room", name: "The Programmer's Study", description: "A hidden room outside the normal ship layout. Contains the original source code of reality." },
    loreText: "Five cycles. Five endings witnessed. The Programmer's Study opens — a room that exists between the Architect's logic and the Dreamer's vision. Here, you can see the code that built everything. Here, you can finally write your own ending.",
    requiredLevel: 25,
  },
  {
    level: 6, stars: 6,
    titlePrefix: "Mythic",
    xpMultiplier: 2.00, resourceMultiplier: 1.40, trustMultiplier: 1.40,
    reward: { type: "npc_dialog", id: "prestige_6_dialog", name: "The Programmer Speaks", description: "The Antiquarian reveals his final truth — not as the Timekeeper, but as the Programmer who started it all." },
    loreText: "Six times through the Fall. Six times watching everything end. The Antiquarian — no, the Programmer — finally speaks his true name. And the Storyteller's melody changes. She remembers too.",
    requiredLevel: 25,
  },
  {
    level: 7, stars: 7,
    titlePrefix: "Transcendent",
    xpMultiplier: 2.50, resourceMultiplier: 1.50, trustMultiplier: 1.50,
    reward: { type: "ship_theme", id: "prestige_7_transcendent", name: "Beyond the Seventh Seal", description: "When the seventh seal is broken, silence falls across every dimension. Your ship exists outside the cycle." },
    loreText: "Seven seals. Seven cycles. Seven endings. Silence falls — and for the first time in the history of the Dischordian Saga, something new happens. The music stops. And then... a new note. One that was never written. Yours.",
    requiredLevel: 25,
  },
];

/* ─── FUNCTIONS ─── */

export function getPrestigeLevel(prestige: number): PrestigeLevel | undefined {
  return PRESTIGE_LEVELS.find(p => p.level === prestige);
}

export function canPrestige(playerLevel: number, currentPrestige: number): boolean {
  if (playerLevel < 25) return false;
  if (currentPrestige >= PRESTIGE_LEVELS.length) return false;
  return true;
}

export function getPrestigeMultipliers(prestige: number): {
  xp: number; resource: number; trust: number;
} {
  const level = PRESTIGE_LEVELS.find(p => p.level === prestige);
  if (!level) return { xp: 1, resource: 1, trust: 1 };
  return {
    xp: level.xpMultiplier,
    resource: level.resourceMultiplier,
    trust: level.trustMultiplier,
  };
}

export function getPrestigeStars(prestige: number): string {
  if (prestige <= 0) return "";
  return "★".repeat(Math.min(prestige, 7));
}

export function getPrestigeTitle(prestige: number, baseTitle: string): string {
  const level = PRESTIGE_LEVELS.find(p => p.level === prestige);
  if (!level) return baseTitle;
  return `${level.titlePrefix} ${baseTitle} ${getPrestigeStars(prestige)}`;
}

export function calculatePrestigeCost(_prestige: number): {
  /** What gets reset */
  resets: string[];
  /** What's preserved */
  preserves: string[];
} {
  return {
    resets: [
      "Player level resets to 1",
      "Room discovery resets (re-explore the Ark)",
      "Quest progress resets",
      "Crafting materials reset",
    ],
    preserves: [
      "All NPC trust levels preserved",
      "All achievements and titles preserved",
      "All collected cards preserved",
      "All equipment preserved",
      "All CoNexus completion preserved",
      "Prestige multipliers stack permanently",
      "Previous prestige rewards preserved",
    ],
  };
}

/** Default state for new players */
export const DEFAULT_PRESTIGE_STATE: PrestigeState = {
  currentPrestige: 0,
  totalPrestiges: 0,
  lifetimeXp: 0,
  lifetimeResources: { dream: 0, salvage: 0, voidCrystals: 0 },
  prestigeHistory: [],
};
