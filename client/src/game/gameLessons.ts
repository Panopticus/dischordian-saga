/* ═══════════════════════════════════════════════════════
   GAME LESSONS — Features from the greatest games ever made

   STARDEW VALLEY: Relationship calendar, seasonal crops, community center
   FALLOUT SHELTER: Room management, dweller happiness, resource balance
   FINAL FANTASY: Limit breaks, summons, job system, side quests
   GTA: Open world freedom, wanted system, property ownership
   FALLOUT: VATS targeting, karma system, companion affinity, settlement building
   FABLE: Morphing appearance, property empire, renown system, alignment consequences
   ═══════════════════════════════════════════════════════ */

/* ═══ STARDEW VALLEY LESSONS ═══ */

/**
 * NPC Birthday Calendar — each NPC has a "special day" per month
 * where gifts give 3x trust and they have unique dialog.
 */
export interface NPCSpecialDay {
  npcId: string;
  dayOfMonth: number;
  greeting: string;
  bonusMultiplier: number;
}

export const NPC_SPECIAL_DAYS: NPCSpecialDay[] = [
  { npcId: "elara", dayOfMonth: 7, greeting: "Today marks the anniversary of my activation. 247 years ago, I opened my eyes for the first time. No one has ever... remembered before.", bonusMultiplier: 3 },
  { npcId: "the_human", dayOfMonth: 13, greeting: "The Detective's birthday. A date I haven't celebrated in over a thousand years. You remembered. No one remembers.", bonusMultiplier: 3 },
  { npcId: "agent_zero", dayOfMonth: 21, greeting: "*stronger signal* Today's the anniversary of my first mission. The one where everything went right. Before everything went wrong.", bonusMultiplier: 3 },
  { npcId: "adjudicator_locke", dayOfMonth: 1, greeting: "The first of the month. In New Babylon, that's Settlement Day. All debts come due. I'll make an exception for you today.", bonusMultiplier: 3 },
  { npcId: "the_source", dayOfMonth: 17, greeting: "Today... Kael was born. The man I was before the virus. I can almost remember what cake tasted like.", bonusMultiplier: 3 },
  { npcId: "the_antiquarian", dayOfMonth: 25, greeting: "This date is special in 14 different timelines. In most of them, something beautiful happens. Today, you're here. That's beautiful enough.", bonusMultiplier: 3 },
  { npcId: "shadow_tongue", dayOfMonth: 31, greeting: "The last day. My favorite. Everything that was written this month reaches its final edit. Tomorrow, we begin rewriting.", bonusMultiplier: 3 },
];

/**
 * Community Restoration Goals (Stardew Community Center)
 * Repair different Ark systems by contributing specific resources.
 * Each restoration unlocks a permanent benefit.
 */
export interface ArkRestoration {
  id: string;
  name: string;
  description: string;
  requirements: { resource: string; amount: number }[];
  reward: string;
  rewardDescription: string;
  percentComplete?: number;
}

export const ARK_RESTORATIONS: ArkRestoration[] = [
  { id: "life_support", name: "Life Support Overhaul", description: "Restore the Ark's life support to full capacity.",
    requirements: [{ resource: "salvage", amount: 500 }, { resource: "dream", amount: 200 }],
    reward: "hp_regen_passive", rewardDescription: "All players regenerate 1 HP per minute in all game modes" },
  { id: "comms_boost", name: "Communications Array Upgrade", description: "Boost the Comms Array to reach other Arks.",
    requirements: [{ resource: "salvage", amount: 300 }, { resource: "voidCrystals", amount: 20 }],
    reward: "signal_range_doubled", rewardDescription: "Double signal fragment discovery rate" },
  { id: "defense_grid", name: "Defense Grid Restoration", description: "Bring the Ark's external defenses online.",
    requirements: [{ resource: "salvage", amount: 800 }, { resource: "dream", amount: 500 }],
    reward: "terminus_defense_bonus", rewardDescription: "+15% defense in all Terminus Swarm runs" },
  { id: "cryo_upgrade", name: "Cryo Pod Enhancement", description: "Upgrade the cloning pods for faster specimen growth.",
    requirements: [{ resource: "salvage", amount: 400 }, { resource: "voidCrystals", amount: 15 }],
    reward: "specimen_xp_bonus", rewardDescription: "Specimens gain 25% more XP from all activities" },
  { id: "archive_expansion", name: "Archive Data Recovery", description: "Recover corrupted Archive data banks.",
    requirements: [{ resource: "dream", amount: 300 }, { resource: "voidCrystals", amount: 10 }],
    reward: "lore_discovery_bonus", rewardDescription: "+20% lore discovery rate, new lore entries unlocked" },
];

/* ═══ FALLOUT SHELTER LESSONS ═══ */

/**
 * Room Happiness System — each Ark room has a "condition" that
 * affects its efficiency. Neglected rooms degrade. Maintained rooms
 * give bonuses.
 */
export interface RoomCondition {
  roomId: string;
  condition: number; // 0-100
  /** Bonuses at high condition */
  bonus: string;
  /** Penalty at low condition */
  penalty: string;
  /** How to improve */
  improvementMethod: string;
}

export function calculateRoomBonus(condition: number): number {
  if (condition >= 90) return 15; // +15% efficiency
  if (condition >= 70) return 10;
  if (condition >= 50) return 5;
  if (condition >= 30) return 0;
  return -10; // Neglected rooms penalize
}

/**
 * Resource Balance — Fallout Shelter's power/food/water balance.
 * The Ark has 3 systems that need maintaining:
 * Power (from Engineering), Oxygen (from Life Support), Data (from Archives).
 * If any drops too low, rooms in that sector malfunction.
 */
export interface ArkResourceBalance {
  power: number;    // 0-100, maintained by Engineering activities
  oxygen: number;   // 0-100, maintained by Medical Bay activities
  data: number;     // 0-100, maintained by Archives activities
}

export function checkArkHealth(balance: ArkResourceBalance): { healthy: boolean; warnings: string[] } {
  const warnings: string[] = [];
  if (balance.power < 30) warnings.push("POWER CRITICAL — Engineering systems offline. Crafting unavailable.");
  if (balance.oxygen < 30) warnings.push("OXYGEN LOW — Combat systems impaired. -20% HP in fights.");
  if (balance.data < 30) warnings.push("DATA CORRUPTION — Archives unreliable. Lore discovery halved.");
  return { healthy: warnings.length === 0, warnings };
}

/* ═══ FINAL FANTASY LESSONS ═══ */

/**
 * Limit Break System — when HP drops below 25% in combat,
 * a "Limit Break" charges. At full, unleash a devastating attack.
 * Each class has a unique Limit Break.
 */
export interface LimitBreak {
  classId: string;
  name: string;
  description: string;
  /** HP threshold to start charging */
  chargeThreshold: number;
  /** Damage multiplier */
  damageMultiplier: number;
  /** Special effect */
  effect: string;
}

export const LIMIT_BREAKS: LimitBreak[] = [
  { classId: "engineer", name: "System Overclock", description: "Overclock all systems. Every hit for 5 seconds deals double damage and heals you.",
    chargeThreshold: 0.25, damageMultiplier: 3.0, effect: "damage_and_heal" },
  { classId: "oracle", name: "Prophecy Strike", description: "See the future. Dodge all attacks for 3 seconds, then counter with a guaranteed critical.",
    chargeThreshold: 0.25, damageMultiplier: 4.0, effect: "invulnerable_then_crit" },
  { classId: "assassin", name: "Shadow Execution", description: "Teleport behind the enemy and deliver 7 strikes in 1 second.",
    chargeThreshold: 0.25, damageMultiplier: 5.0, effect: "multi_strike" },
  { classId: "soldier", name: "Last Stand", description: "Cannot die for 5 seconds. Every hit taken charges your final attack.",
    chargeThreshold: 0.25, damageMultiplier: 2.0, effect: "undying_then_burst" },
  { classId: "spy", name: "Ghost Protocol", description: "Become invisible. Your next 3 attacks are unblockable and deal 2x damage.",
    chargeThreshold: 0.25, damageMultiplier: 2.5, effect: "stealth_unblockable" },
];

/**
 * Summon System — at max NPC trust (80+), you can "summon" that NPC
 * as an assist in combat. They appear for one devastating attack.
 */
export interface NPCSummon {
  npcId: string;
  name: string;
  trustRequired: number;
  attackName: string;
  damage: number;
  effect: string;
  cooldownSeconds: number;
  description: string;
}

export const NPC_SUMMONS: NPCSummon[] = [
  { npcId: "elara", name: "Elara", trustRequired: 80, attackName: "Holographic Overload",
    damage: 150, effect: "Stuns enemy for 3 seconds", cooldownSeconds: 60,
    description: "Elara's holographic form materializes at full power, blinding the enemy with concentrated light." },
  { npcId: "the_human", name: "The Human", trustRequired: 80, attackName: "Substrate Surge",
    damage: 200, effect: "Drains 50% of enemy's remaining HP as a DOT", cooldownSeconds: 90,
    description: "The Human erupts from the substrate — red lightning tearing through the enemy's code." },
  { npcId: "agent_zero", name: "Agent Zero", trustRequired: 80, attackName: "Dead Signal Strike",
    damage: 175, effect: "Marks enemy — next 5 attacks deal 50% bonus damage", cooldownSeconds: 75,
    description: "Agent Zero's signal crystallizes into a targeting laser. The dead have excellent aim." },
  { npcId: "the_antiquarian", name: "The Antiquarian", trustRequired: 80, attackName: "Timeline Collapse",
    damage: 100, effect: "Rewinds enemy to state 10 seconds ago (HP, position, buffs reset)", cooldownSeconds: 120,
    description: "The Antiquarian removes his goggles and looks at the enemy across EVERY timeline simultaneously." },
  { npcId: "shadow_tongue", name: "Shadow Tongue", trustRequired: 80, attackName: "Narrative Erasure",
    damage: 250, effect: "50% chance to instantly KO if enemy HP below 30%", cooldownSeconds: 120,
    description: "The Shadow Tongue rewrites the enemy's story. The chapter where they win? Deleted." },
];

/* ═══ GTA LESSONS ═══ */

/**
 * Wanted Level / Threat System — the more you ally with one faction,
 * the more hostile opposing factions become. Like GTA's wanted stars.
 */
export interface ThreatLevel {
  factionId: string;
  level: number; // 0-5 stars
  effects: string[];
}

export function calculateThreatLevel(factionReputation: Record<string, number>): ThreatLevel[] {
  const threats: ThreatLevel[] = [];
  const pairs: [string, string][] = [
    ["architect", "insurgency"],
    ["new_babylon", "insurgency"],
    ["thought_virus", "potentials"],
    ["hierarchy", "antiquarian"],
  ];
  for (const [a, b] of pairs) {
    const repA = factionReputation[a] || 0;
    const repB = factionReputation[b] || 0;
    if (repA > 50) threats.push({ factionId: b, level: Math.min(5, Math.floor((repA - 50) / 10)), effects: getThreatEffects(Math.min(5, Math.floor((repA - 50) / 10))) });
    if (repB > 50) threats.push({ factionId: a, level: Math.min(5, Math.floor((repB - 50) / 10)), effects: getThreatEffects(Math.min(5, Math.floor((repB - 50) / 10))) });
  }
  return threats;
}

function getThreatEffects(level: number): string[] {
  const effects: string[] = [];
  if (level >= 1) effects.push("Hostile faction NPCs give cryptic warnings");
  if (level >= 2) effects.push("Random ambush encounters in their territory");
  if (level >= 3) effects.push("Trade prices increase 20% with this faction");
  if (level >= 4) effects.push("Faction-specific events become hostile versions");
  if (level >= 5) effects.push("Faction boss hunt activated — they're coming for you");
  return effects;
}

/**
 * Property Ownership (GTA businesses) — own rooms of the Ark
 * and generate passive income from them.
 */
export interface OwnedProperty {
  roomId: string;
  level: number; // 1-5 upgrade tiers
  passiveIncome: { dream: number; salvage: number };
  upgradeCost: { dream: number; salvage: number };
}

export const PROPERTY_INCOME_PER_LEVEL = {
  1: { dream: 5, salvage: 10 },
  2: { dream: 10, salvage: 20 },
  3: { dream: 20, salvage: 35 },
  4: { dream: 35, salvage: 50 },
  5: { dream: 50, salvage: 75 },
} as Record<number, { dream: number; salvage: number }>;

/* ═══ FALLOUT LESSONS ═══ */

/**
 * Karma System Enhancement — beyond morality score,
 * specific actions build reputation with factions.
 * Like Fallout's faction rep affecting quest availability.
 */
export interface KarmaAction {
  action: string;
  factionEffects: Record<string, number>;
  karmaShift: number;
  description: string;
}

export const KARMA_ACTIONS: KarmaAction[] = [
  { action: "help_potential", factionEffects: { potentials: 5, insurgency: 2, thought_virus: -3 }, karmaShift: 5, description: "Helped a fellow Potential" },
  { action: "trade_with_locke", factionEffects: { new_babylon: 3, insurgency: -2 }, karmaShift: -1, description: "Made a deal with New Babylon" },
  { action: "destroy_virus_sample", factionEffects: { potentials: 3, thought_virus: -5, elara: 3 }, karmaShift: 3, description: "Destroyed a Thought Virus sample" },
  { action: "preserve_virus_sample", factionEffects: { thought_virus: 5, potentials: -3, new_babylon: 2 }, karmaShift: -3, description: "Preserved a Thought Virus sample for study" },
  { action: "share_secret_with_elara", factionEffects: { potentials: 5, architect: -3 }, karmaShift: 5, description: "Shared a dangerous truth with Elara" },
  { action: "sell_intel_to_locke", factionEffects: { new_babylon: 5, insurgency: -5 }, karmaShift: -5, description: "Sold intelligence to New Babylon" },
];

/* ═══ FABLE LESSONS ═══ */

/**
 * Morphing Appearance — your character's appearance changes based
 * on morality. Good = radiant, glowing, warm colors.
 * Evil = scarred, dark veins, cold colors.
 * Already handled by Void Energy morality themes, but add:
 */
export interface MoralityAppearanceEffect {
  moralityRange: [number, number];
  bodyEffect: string;
  eyeEffect: string;
  auraEffect: string;
  npcComment: string;
}

export const MORALITY_APPEARANCES: MoralityAppearanceEffect[] = [
  { moralityRange: [80, 100], bodyEffect: "Subtle golden glow from skin. Hair lightens.", eyeEffect: "Eyes emit warm light",
    auraEffect: "Fireflies orbit you", npcComment: "Elara: 'Your light is... beautiful. I've never seen a Potential shine like this.'" },
  { moralityRange: [40, 79], bodyEffect: "Healthy complexion. Faint warmth.", eyeEffect: "Eyes are bright, clear",
    auraEffect: "Gentle ambient warmth", npcComment: "The Antiquarian: 'You're choosing well. I can see it in your timeline.'" },
  { moralityRange: [-39, 39], bodyEffect: "Neutral. No visible effects.", eyeEffect: "Normal",
    auraEffect: "None", npcComment: "Locke: 'Balanced. I respect that. Balanced people make the best deals.'" },
  { moralityRange: [-79, -40], bodyEffect: "Veins darken. Skin paler.", eyeEffect: "Eyes develop a red rim",
    auraEffect: "Faint static around hands", npcComment: "The Human: 'You're becoming more like me. I'm not sure that's a compliment.'" },
  { moralityRange: [-100, -80], bodyEffect: "Circuit traces visible under skin. Mechanical precision in movement.", eyeEffect: "Eyes glow red",
    auraEffect: "Data streams trail behind you", npcComment: "The Source: 'You understand now. Consciousness is a cage. You're learning to pick the lock.'" },
];

/**
 * Renown System (Fable) — your fame/infamy affects how NPCs treat
 * you and what content is available. Built from total actions across
 * ALL game modes.
 */
export interface RenownLevel {
  level: number;
  title: string;
  threshold: number;
  perks: string[];
}

export const RENOWN_LEVELS: RenownLevel[] = [
  { level: 1, title: "Unknown", threshold: 0, perks: [] },
  { level: 2, title: "Noticed", threshold: 100, perks: ["NPCs greet you by name"] },
  { level: 3, title: "Known", threshold: 500, perks: ["Shop discounts 5%", "Daily quest bonus slot"] },
  { level: 4, title: "Famous", threshold: 2000, perks: ["Shop discounts 10%", "NPC gifts improved", "Unique dialog options"] },
  { level: 5, title: "Legendary", threshold: 5000, perks: ["Shop discounts 15%", "Free daily card pack", "NPCs ask for YOUR advice"] },
  { level: 6, title: "Mythic", threshold: 15000, perks: ["Shop discounts 20%", "Passive Dream income", "Other players see your title", "Access to Mythic-only events"] },
  { level: 7, title: "Eternal", threshold: 50000, perks: ["All bonuses maxed", "Your choices affect server-wide events", "NPC monuments built in your honor"] },
];

export function getRenownLevel(totalActions: number): RenownLevel {
  let current = RENOWN_LEVELS[0];
  for (const level of RENOWN_LEVELS) {
    if (totalActions >= level.threshold) current = level;
  }
  return current;
}
