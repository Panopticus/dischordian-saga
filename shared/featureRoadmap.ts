/* ═══════════════════════════════════════════════════════
   FEATURE UNLOCK ROADMAP — Gradual system introduction

   Players should not face 50+ systems on first login.
   Systems unlock through narrative milestones, creating a
   sense of gradual world expansion.

   Genshin Impact (AR level gates content), Disco Elysium
   (each discovery reveals more world).

   Philosophy: "Every new mechanic should feel like the world
   getting bigger — not a menu getting longer."
   ═══════════════════════════════════════════════════════ */

export interface FeatureUnlock {
  featureId: string;
  name: string;
  description: string;
  /** When this feature becomes available */
  trigger: UnlockTrigger;
  /** What Elara says when it unlocks */
  unlockMessage: string;
  /** Category for grouping */
  category: "core" | "combat" | "social" | "economic" | "lore" | "endgame";
  /** Estimated play time to reach this unlock */
  estimatedTime: string;
}

export type UnlockTrigger =
  | { type: "room_discovered"; roomId: string }
  | { type: "narrative_flag"; flag: string }
  | { type: "trust_reached"; npcId: string; min: number }
  | { type: "level_reached"; level: number }
  | { type: "quests_completed"; count: number }
  | { type: "playtime_hours"; hours: number }
  | { type: "always_available" };

/* ─── UNLOCK ROADMAP ─── */

export const FEATURE_ROADMAP: FeatureUnlock[] = [
  // ═══ HOUR 0-1: Core systems (tutorial) ═══
  { featureId: "character_sheet", name: "Character Sheet", description: "View stats, equipment, trust levels",
    trigger: { type: "always_available" }, category: "core", estimatedTime: "immediate",
    unlockMessage: "Your dossier is always accessible. Review it often." },
  { featureId: "cryo_bay", name: "Cryo Bay", description: "Character creation and army recruitment",
    trigger: { type: "always_available" }, category: "core", estimatedTime: "immediate",
    unlockMessage: "This is where you woke up. Start here." },
  { featureId: "companion_selection", name: "First Companion", description: "Pick your first specimen companion",
    trigger: { type: "narrative_flag", flag: "awakening_complete" } as UnlockTrigger, category: "core", estimatedTime: "15 min",
    unlockMessage: "The cloning pods responded to your DNA. Choose your companion." },

  // ═══ HOUR 1-2: First explorable systems ═══
  { featureId: "medical_bay_games", name: "Combat Simulator", description: "Fight game unlocks in Medical Bay",
    trigger: { type: "room_discovered", roomId: "medical_bay" } as UnlockTrigger, category: "combat", estimatedTime: "30 min",
    unlockMessage: "Elara: 'The Medical Bay has combat diagnostic systems. Would you like to spar with a simulation?'" },
  { featureId: "loredex", name: "Loredex Database", description: "Search lore entries and history",
    trigger: { type: "room_discovered", roomId: "archives" } as UnlockTrigger, category: "lore", estimatedTime: "45 min",
    unlockMessage: "Elara: 'The Archives database is extensive. Ask me if you find something confusing.'" },

  // ═══ HOUR 2-4: Intermediate systems ═══
  { featureId: "chess", name: "The Architect's Gambit", description: "Strategic chess on the Bridge",
    trigger: { type: "room_discovered", roomId: "bridge" } as UnlockTrigger, category: "combat", estimatedTime: "1 hour",
    unlockMessage: "Elara: 'The Architect himself designed a chess variant. It's... educational.'" },
  { featureId: "dischordia", name: "Dischordia (Card Battles)", description: "Faction card warfare",
    trigger: { type: "room_discovered", roomId: "archives" } as UnlockTrigger, category: "combat", estimatedTime: "1 hour",
    unlockMessage: "Elara: 'The Antiquarian has prepared something called Dischordia. Living history, he calls it.'" },
  { featureId: "quests", name: "Daily Quests", description: "Daily/weekly objectives",
    trigger: { type: "room_discovered", roomId: "bridge" } as UnlockTrigger, category: "core", estimatedTime: "1 hour",
    unlockMessage: "Elara: 'The Bridge generates operational priorities daily. I'll track them for you.'" },
  { featureId: "guild_system", name: "Syndicates", description: "Join or create a guild",
    trigger: { type: "room_discovered", roomId: "bridge" } as UnlockTrigger, category: "social", estimatedTime: "1 hour",
    unlockMessage: "Elara: 'Other Potentials are surviving on other Arks. You can form Syndicates with them.'" },

  // ═══ HOUR 4-8: Deeper systems ═══
  { featureId: "crafting", name: "Research Lab", description: "Craft items and cards",
    trigger: { type: "room_discovered", roomId: "engineering" } as UnlockTrigger, category: "economic", estimatedTime: "2 hours",
    unlockMessage: "Elara: 'Engineering has fabrication systems. What you can imagine, you can build.'" },
  { featureId: "conexus_portal", name: "Antiquarian's Library", description: "Interactive story games",
    trigger: { type: "room_discovered", roomId: "comms_array" } as UnlockTrigger, category: "lore", estimatedTime: "2 hours",
    unlockMessage: "Elara: 'The Comms Array is receiving strange transmissions. The Antiquarian calls them \"tomes.\" I don't know what that means yet.'" },
  { featureId: "observation_deck_music", name: "Music Library", description: "Saga soundtrack + transmissions",
    trigger: { type: "room_discovered", roomId: "observation_deck" } as UnlockTrigger, category: "lore", estimatedTime: "2 hours",
    unlockMessage: "Elara: 'The Observation Deck receives music. Not songs exactly. Scripture.'" },

  // ═══ HOUR 8-15: Specialized systems ═══
  { featureId: "trade_empire", name: "Trade Empire", description: "Galactic commerce",
    trigger: { type: "room_discovered", roomId: "trade_hub" } as UnlockTrigger, category: "economic", estimatedTime: "4 hours",
    unlockMessage: "Elara: 'Adjudicator Locke is... insistent. She wants to show you the Trade Hub. I'd be cautious.'" },
  { featureId: "casino", name: "The Degen's Casino", description: "Gambling in Ne-Yon space",
    trigger: { type: "trust_reached", npcId: "adjudicator_locke", min: 30 } as UnlockTrigger, category: "economic", estimatedTime: "5 hours",
    unlockMessage: "Locke: 'I've made arrangements. Ne-Yon space is closed to outsiders — except for The Degen's Casino. She can get you in. For a finder's fee.'" },
  { featureId: "terminus_swarm", name: "Terminus Swarm", description: "Tower defense combat",
    trigger: { type: "room_discovered", roomId: "armory" } as UnlockTrigger, category: "combat", estimatedTime: "5 hours",
    unlockMessage: "Agent Zero: '*static* The Armory's defense grid is operational. Someone should stress-test it. Someone like you.'" },

  // ═══ HOUR 15-25: Advanced systems ═══
  { featureId: "gamemasters_arena", name: "The Gamemaster's Arena", description: "Deadly lore quiz show",
    trigger: { type: "trust_reached", npcId: "the_antiquarian", min: 40 } as UnlockTrigger, category: "lore", estimatedTime: "10 hours",
    unlockMessage: "The Antiquarian: 'The Game Master left his world running. A clone hosts the show. You should see it. Bring a disposable clone body.'" },
  { featureId: "voltari_project", name: "Voltari Translation Project", description: "Community-decode alien language",
    trigger: { type: "quests_completed", count: 20 } as UnlockTrigger, category: "lore", estimatedTime: "15 hours",
    unlockMessage: "Elara: 'Deep scan detected something impossible. A purple planet. A 2-million-year-old signal. It's language. It's been waiting for us.'" },
  { featureId: "pet_battles", name: "Pet Battles (Spectator)", description: "Watch your companions fight",
    trigger: { type: "narrative_flag", flag: "specimen_evolution_stage_2" } as UnlockTrigger, category: "combat", estimatedTime: "15 hours",
    unlockMessage: "Your companion: '*thinks hard* I want to fight for you. Not against you. FOR you. Take me to the Arena.'" },
  { featureId: "alliance_war", name: "Alliance Wars", description: "Guild vs guild hex-grid battles",
    trigger: { type: "level_reached", level: 15 } as UnlockTrigger, category: "social", estimatedTime: "20 hours",
    unlockMessage: "Elara: 'Other Syndicates are challenging yours. Formal war declared. I've opened the tactical hex map.'" },
  { featureId: "incursions", name: "Co-op Incursions", description: "Team dungeon crawling",
    trigger: { type: "level_reached", level: 12 } as UnlockTrigger, category: "combat", estimatedTime: "15 hours",
    unlockMessage: "The Human: 'I've been scanning for anomalies. There are pocket dimensions forming near the Ark. Dangerous. Bring a friend.'" },

  // ═══ HOUR 25+: Endgame systems ═══
  { featureId: "prestige", name: "Prestige System", description: "Reset for permanent multipliers",
    trigger: { type: "level_reached", level: 25 } as UnlockTrigger, category: "endgame", estimatedTime: "25 hours",
    unlockMessage: "The Antiquarian: 'You've reached the cycle's end. But you can choose to begin again — stronger, faster, remembering.'" },
  { featureId: "bounties", name: "Bounty Board", description: "Witcher-style investigation contracts",
    trigger: { type: "trust_reached", npcId: "adjudicator_locke", min: 50 } as UnlockTrigger, category: "social", estimatedTime: "10 hours",
    unlockMessage: "Locke: 'I've been sitting on contracts. You've earned the right to see them. Some pay well. Some... pay differently.'" },
  { featureId: "bestiary", name: "Bestiary", description: "Discovered enemy codex",
    trigger: { type: "narrative_flag", flag: "first_fight_won" } as UnlockTrigger, category: "lore", estimatedTime: "2 hours",
    unlockMessage: "Elara: 'I've compiled a file on every enemy you've defeated. Patterns emerge. Weaknesses. Lore.'" },
  { featureId: "necromancer_return", name: "The Necromancer Returns", description: "Server-wide resurrection event",
    trigger: { type: "narrative_flag", flag: "necromancer_manifested" } as UnlockTrigger, category: "endgame", estimatedTime: "50+ hours",
    unlockMessage: "Elara: '*static* Something is WRONG. The energy signatures... *the transmission cuts out* He's HERE. The 10th Archon has returned. All Arks, report.'" },
];

/* ─── CHECK IF FEATURE UNLOCKED ─── */

export interface GameStateSnapshot {
  rooms: Record<string, { unlocked?: boolean }>;
  narrativeFlags: Record<string, boolean>;
  elaraTrust: number;
  humanTrust: number;
  npcTrust: Record<string, number>;
  level: number;
  questsCompleted: number;
  playtimeHours: number;
}

export function isFeatureUnlocked(feature: FeatureUnlock, state: GameStateSnapshot): boolean {
  const t = feature.trigger;
  switch (t.type) {
    case "always_available": return true;
    case "room_discovered": return !!state.rooms[t.roomId.replace(/_/g, "-")]?.unlocked;
    case "narrative_flag": return !!state.narrativeFlags[t.flag];
    case "trust_reached":
      if (t.npcId === "elara") return state.elaraTrust >= t.min;
      if (t.npcId === "the_human") return state.humanTrust >= t.min;
      return (state.npcTrust[t.npcId] || 0) >= t.min;
    case "level_reached": return state.level >= t.level;
    case "quests_completed": return state.questsCompleted >= t.count;
    case "playtime_hours": return state.playtimeHours >= t.hours;
    default: return false;
  }
}

export function getUnlockedFeatures(state: GameStateSnapshot): FeatureUnlock[] {
  return FEATURE_ROADMAP.filter(f => isFeatureUnlocked(f, state));
}

export function getNextUnlocks(state: GameStateSnapshot, count: number = 3): FeatureUnlock[] {
  return FEATURE_ROADMAP.filter(f => !isFeatureUnlocked(f, state)).slice(0, count);
}

export function getRecentlyUnlocked(state: GameStateSnapshot, knownFlags: Set<string>): FeatureUnlock[] {
  return FEATURE_ROADMAP.filter(f => isFeatureUnlocked(f, state) && !knownFlags.has(f.featureId));
}

/* ─── CATEGORY GROUPINGS ─── */

export const FEATURE_CATEGORIES = {
  core: { name: "Core Systems", color: "#33E2E6", icon: "◉" },
  combat: { name: "Combat", color: "#ef4444", icon: "⚔" },
  social: { name: "Social", color: "#a855f7", icon: "◎" },
  economic: { name: "Economic", color: "#f59e0b", icon: "💰" },
  lore: { name: "Lore & Discovery", color: "#10b981", icon: "📖" },
  endgame: { name: "Endgame", color: "#fbbf24", icon: "★" },
} as const;
