/**
 * PRESTIGE CLASSES (Recommendation 4.7)
 * ─────────────────────────────────────
 * Inspired by D&D 3.5 Prestige Classes, FFT Advanced Jobs, PoE Ascendancies.
 * Endgame cross-class specializations that require mastery in two different
 * class trees. These represent the pinnacle of character progression.
 *
 * Requirements:
 * - Citizen level 20+
 * - Mastery rank 3+ in primary class
 * - Mastery rank 2+ in secondary class
 * - Specific quest completion
 *
 * Design philosophy:
 * - Prestige classes combine the strengths of two base classes
 * - Each prestige class has a unique identity and playstyle
 * - Prestige perks are more powerful than base class perks
 * - Only one prestige class can be active at a time
 * - Prestige classes add a new progression track (ranks 1-3)
 */

import type { CharacterClass } from "./classMastery";

/* ═══════════════════════════════════════════════════════
   PRESTIGE CLASS DEFINITIONS
   ═══════════════════════════════════════════════════════ */

export type PrestigeClassKey =
  | "chronomancer"
  | "warlord"
  | "shadow_broker"
  | "technomancer"
  | "blade_dancer"
  | "architect_prime"
  | "void_walker"
  | "iron_prophet"
  | "phantom_engineer"
  | "war_oracle";

export interface PrestigeClass {
  key: PrestigeClassKey;
  name: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  /** Primary class requirement (rank 3+) */
  primaryClass: CharacterClass;
  /** Secondary class requirement (rank 2+) */
  secondaryClass: CharacterClass;
  /** Minimum citizen level */
  minLevel: number;
  /** Quest that must be completed to unlock */
  unlockQuestId: string;
  /** Lore description */
  lore: string;
  /** Prestige perks (ranks 1-3) */
  perks: PrestigePerk[];
  /** Passive aura that affects nearby allies in guild wars */
  aura: PrestigeAura;
}

export interface PrestigePerk {
  key: string;
  name: string;
  description: string;
  rank: 1 | 2 | 3;
  effects: PrestigeEffect[];
}

export interface PrestigeEffect {
  system: "card_game" | "trade_empire" | "fight" | "chess" | "guild_war" | "quest" | "market" | "crafting" | "all";
  type: "multiplier" | "flat" | "passive" | "unlock";
  target: string;
  value: number;
  label: string;
}

export interface PrestigeAura {
  name: string;
  description: string;
  /** Range in guild war map tiles */
  range: number;
  effects: { target: string; value: number; label: string }[];
}

/* ═══════════════════════════════════════════════════════
   PRESTIGE XP CURVE
   ═══════════════════════════════════════════════════════ */

export const PRESTIGE_RANKS = [
  { rank: 0, name: "Initiate", xpRequired: 0 },
  { rank: 1, name: "Adept", xpRequired: 500 },
  { rank: 2, name: "Master", xpRequired: 2000 },
  { rank: 3, name: "Grandmaster", xpRequired: 5000 },
] as const;

export type PrestigeRank = 0 | 1 | 2 | 3;

/* ═══════════════════════════════════════════════════════
   PRESTIGE CLASS DEFINITIONS — 10 Classes
   (Each pair of base classes produces one prestige class)
   ═══════════════════════════════════════════════════════ */

export const PRESTIGE_CLASSES: PrestigeClass[] = [
  /* ─── ORACLE + ENGINEER = CHRONOMANCER ─── */
  {
    key: "chronomancer",
    name: "Chronomancer",
    title: "Weaver of Temporal Machinery",
    description: "Masters of time-bending technology. Chronomancers build devices that manipulate the flow of time itself.",
    icon: "Timer",
    color: "#8b5cf6",
    primaryClass: "oracle",
    secondaryClass: "engineer",
    minLevel: 20,
    unlockQuestId: "prestige_chronomancer",
    lore: "When the Oracle's foresight meets the Engineer's ingenuity, time itself becomes a tool. The Chronomancer doesn't predict the future — they build it.",
    perks: [
      {
        key: "chrono_temporal_forge",
        name: "Temporal Forge",
        description: "Crafted items gain +1 random bonus stat; crafting time reduced by 50%.",
        rank: 1,
        effects: [
          { system: "crafting", type: "passive", target: "bonus_stat_chance", value: 1.0, label: "Crafted items always get +1 bonus stat" },
          { system: "crafting", type: "multiplier", target: "craft_time", value: 0.50, label: "50% faster crafting" },
        ],
      },
      {
        key: "chrono_time_dilation",
        name: "Time Dilation Field",
        description: "In fights, slow all enemies by 20% for the first 3 turns. Chess time +30s.",
        rank: 2,
        effects: [
          { system: "fight", type: "debuff" as any, target: "enemy_speed", value: -0.20, label: "-20% enemy speed for 3 turns" },
          { system: "chess", type: "flat", target: "time_bonus", value: 30, label: "+30s chess time" },
        ],
      },
      {
        key: "chrono_rewind",
        name: "Temporal Rewind",
        description: "Once per day: undo the last completed action in any game system.",
        rank: 3,
        effects: [
          { system: "all", type: "unlock", target: "daily_rewind", value: 1, label: "Once per day: undo last action" },
        ],
      },
    ],
    aura: {
      name: "Temporal Distortion",
      description: "Allies within range gain +10% action speed in guild wars.",
      range: 3,
      effects: [{ target: "ally_action_speed", value: 1.10, label: "+10% ally action speed" }],
    },
  },

  /* ─── SOLDIER + SPY = WARLORD ─── */
  {
    key: "warlord",
    name: "Warlord",
    title: "Master of War and Shadow",
    description: "Combines brute military force with intelligence operations. Warlords control the battlefield through both strength and information.",
    icon: "Shield",
    color: "#dc2626",
    primaryClass: "soldier",
    secondaryClass: "spy",
    minLevel: 20,
    unlockQuestId: "prestige_warlord",
    lore: "The Soldier fights. The Spy watches. The Warlord does both — and the enemy never knows which face they're seeing until it's too late.",
    perks: [
      {
        key: "warlord_battle_intel",
        name: "Battle Intelligence",
        description: "See enemy HP, buffs, and cooldowns in fights. Guild war map reveals all enemy positions.",
        rank: 1,
        effects: [
          { system: "fight", type: "unlock", target: "enemy_info_reveal", value: 1, label: "See all enemy stats in fights" },
          { system: "guild_war", type: "unlock", target: "full_map_reveal", value: 1, label: "Reveal all enemy positions" },
        ],
      },
      {
        key: "warlord_iron_fist",
        name: "Iron Fist Protocol",
        description: "Territory capture speed +40%. Captured territories generate 25% more resources.",
        rank: 2,
        effects: [
          { system: "guild_war", type: "multiplier", target: "territory_capture", value: 1.40, label: "+40% capture speed" },
          { system: "guild_war", type: "multiplier", target: "territory_production", value: 1.25, label: "+25% territory production" },
        ],
      },
      {
        key: "warlord_supreme_command",
        name: "Supreme Command",
        description: "All guild members gain +5% ATK and +5% DEF when you're online. War points +50%.",
        rank: 3,
        effects: [
          { system: "guild_war", type: "multiplier", target: "guild_atk_bonus", value: 1.05, label: "+5% guild ATK when online" },
          { system: "guild_war", type: "multiplier", target: "guild_def_bonus", value: 1.05, label: "+5% guild DEF when online" },
          { system: "guild_war", type: "multiplier", target: "war_points", value: 1.50, label: "+50% war points" },
        ],
      },
    ],
    aura: {
      name: "Commander's Presence",
      description: "Allies within range gain +8% ATK and +8% DEF in guild wars.",
      range: 4,
      effects: [
        { target: "ally_atk", value: 1.08, label: "+8% ally ATK" },
        { target: "ally_def", value: 1.08, label: "+8% ally DEF" },
      ],
    },
  },

  /* ─── SPY + ASSASSIN = SHADOW BROKER ─── */
  {
    key: "shadow_broker",
    name: "Shadow Broker",
    title: "Master of Secrets and Blades",
    description: "The ultimate covert operative. Shadow Brokers trade in information and death with equal proficiency.",
    icon: "EyeOff",
    color: "#6366f1",
    primaryClass: "spy",
    secondaryClass: "assassin",
    minLevel: 20,
    unlockQuestId: "prestige_shadow_broker",
    lore: "Information is the deadliest weapon. The Shadow Broker knows every secret and has a blade for every throat.",
    perks: [
      {
        key: "sb_black_market",
        name: "Black Market Access",
        description: "Access exclusive marketplace items. Buy/sell prices improved by 15%.",
        rank: 1,
        effects: [
          { system: "market", type: "unlock", target: "black_market", value: 1, label: "Access black market items" },
          { system: "market", type: "multiplier", target: "price_advantage", value: 1.15, label: "15% better buy/sell prices" },
        ],
      },
      {
        key: "sb_assassination_contract",
        name: "Assassination Contract",
        description: "Once per day: mark a player. If you defeat them within 24h, earn 3x rewards.",
        rank: 2,
        effects: [
          { system: "fight", type: "passive", target: "daily_mark", value: 1, label: "Mark one player per day for 3x rewards" },
        ],
      },
      {
        key: "sb_network",
        name: "Shadow Network",
        description: "Steal 5% of all marketplace transactions in your guild. All sabotage untraceable.",
        rank: 3,
        effects: [
          { system: "market", type: "passive", target: "transaction_skim", value: 0.05, label: "5% skim on guild marketplace" },
          { system: "guild_war", type: "unlock", target: "untraceable_sabotage", value: 1, label: "All sabotage is untraceable" },
        ],
      },
    ],
    aura: {
      name: "Cloak of Shadows",
      description: "Allies within range have their guild war contributions hidden from enemies.",
      range: 2,
      effects: [{ target: "ally_stealth", value: 1, label: "Hide ally contributions" }],
    },
  },

  /* ─── ENGINEER + ASSASSIN = TECHNOMANCER ─── */
  {
    key: "technomancer",
    name: "Technomancer",
    title: "Architect of Lethal Innovation",
    description: "Combines engineering genius with lethal precision. Technomancers build weapons that kill with surgical accuracy.",
    icon: "Cpu",
    color: "#f59e0b",
    primaryClass: "engineer",
    secondaryClass: "assassin",
    minLevel: 20,
    unlockQuestId: "prestige_technomancer",
    lore: "The Engineer builds. The Assassin destroys. The Technomancer does both simultaneously — creating tools of exquisite destruction.",
    perks: [
      {
        key: "tech_nano_blades",
        name: "Nano-Blade Arsenal",
        description: "Crafted weapons gain +15% damage. Critical hits apply a 3-turn bleed effect.",
        rank: 1,
        effects: [
          { system: "crafting", type: "multiplier", target: "weapon_damage", value: 1.15, label: "+15% crafted weapon damage" },
          { system: "fight", type: "passive", target: "crit_bleed", value: 0.05, label: "Crits apply 5% bleed per turn for 3 turns" },
        ],
      },
      {
        key: "tech_trap_network",
        name: "Trap Network",
        description: "Place traps on guild war territories. Enemies entering take 10% HP damage.",
        rank: 2,
        effects: [
          { system: "guild_war", type: "unlock", target: "territory_traps", value: 1, label: "Place traps on territories" },
          { system: "guild_war", type: "passive", target: "trap_damage", value: 0.10, label: "Traps deal 10% HP damage" },
        ],
      },
      {
        key: "tech_killbot",
        name: "Killbot Mk.VII",
        description: "Deploy an autonomous combat drone in fights. Drone has 50% of your stats and attacks independently.",
        rank: 3,
        effects: [
          { system: "fight", type: "unlock", target: "combat_drone", value: 1, label: "Deploy combat drone (50% of your stats)" },
        ],
      },
    ],
    aura: {
      name: "Overcharge Field",
      description: "Allies within range deal +5% damage with crafted weapons.",
      range: 3,
      effects: [{ target: "ally_crafted_weapon_damage", value: 1.05, label: "+5% ally crafted weapon damage" }],
    },
  },

  /* ─── ASSASSIN + SOLDIER = BLADE DANCER ─── */
  {
    key: "blade_dancer",
    name: "Blade Dancer",
    title: "Whirlwind of Steel and Fury",
    description: "The perfect fusion of speed and power. Blade Dancers are unstoppable in combat.",
    icon: "Swords",
    color: "#ef4444",
    primaryClass: "assassin",
    secondaryClass: "soldier",
    minLevel: 20,
    unlockQuestId: "prestige_blade_dancer",
    lore: "Where the Assassin strikes from shadow and the Soldier charges head-on, the Blade Dancer does both — a whirlwind of steel that cannot be stopped or predicted.",
    perks: [
      {
        key: "bd_flurry",
        name: "Flurry of Blades",
        description: "30% chance to attack twice per turn. Each attack can crit independently.",
        rank: 1,
        effects: [
          { system: "fight", type: "passive", target: "double_attack_chance", value: 0.30, label: "30% chance to attack twice" },
        ],
      },
      {
        key: "bd_parry",
        name: "Perfect Parry",
        description: "20% chance to completely negate an incoming attack and counter for 50% damage.",
        rank: 2,
        effects: [
          { system: "fight", type: "passive", target: "parry_chance", value: 0.20, label: "20% parry chance with 50% counter" },
        ],
      },
      {
        key: "bd_dance_of_death",
        name: "Dance of Death",
        description: "When HP drops below 30%, enter Dance of Death: +50% ATK, +50% speed, immune to stun for 5 turns.",
        rank: 3,
        effects: [
          { system: "fight", type: "passive", target: "low_hp_atk_bonus", value: 1.50, label: "+50% ATK below 30% HP" },
          { system: "fight", type: "passive", target: "low_hp_speed_bonus", value: 1.50, label: "+50% speed below 30% HP" },
          { system: "fight", type: "passive", target: "low_hp_stun_immune", value: 1, label: "Stun immunity below 30% HP" },
        ],
      },
    ],
    aura: {
      name: "Killing Intent",
      description: "Enemies within range have -5% DEF.",
      range: 2,
      effects: [{ target: "enemy_def_reduction", value: -0.05, label: "-5% enemy DEF" }],
    },
  },

  /* ─── ORACLE + SOLDIER = IRON PROPHET ─── */
  {
    key: "iron_prophet",
    name: "Iron Prophet",
    title: "Seer of Battlefields",
    description: "Combines prophetic vision with military might. Iron Prophets know where every blow will land before it's thrown.",
    icon: "Eye",
    color: "#7c3aed",
    primaryClass: "oracle",
    secondaryClass: "soldier",
    minLevel: 20,
    unlockQuestId: "prestige_iron_prophet",
    lore: "The Oracle sees the future. The Soldier shapes it. The Iron Prophet does both — standing at the intersection of fate and force.",
    perks: [
      {
        key: "ip_battle_prophecy",
        name: "Battle Prophecy",
        description: "See the next 2 enemy actions in fights. Chess: see opponent's next 2 planned moves.",
        rank: 1,
        effects: [
          { system: "fight", type: "unlock", target: "enemy_action_preview", value: 2, label: "See next 2 enemy actions" },
          { system: "chess", type: "unlock", target: "opponent_move_preview", value: 2, label: "See next 2 opponent moves" },
        ],
      },
      {
        key: "ip_fated_strike",
        name: "Fated Strike",
        description: "Every 5th attack is a guaranteed critical hit that deals 2x damage.",
        rank: 2,
        effects: [
          { system: "fight", type: "passive", target: "guaranteed_crit_interval", value: 5, label: "Every 5th attack is a guaranteed 2x crit" },
        ],
      },
      {
        key: "ip_divine_armor",
        name: "Divine Armor",
        description: "Armor absorbs 50% of incoming damage. When armor breaks, release a shockwave dealing 30% of absorbed damage.",
        rank: 3,
        effects: [
          { system: "fight", type: "multiplier", target: "armor_absorption", value: 0.50, label: "Armor absorbs 50% damage" },
          { system: "fight", type: "passive", target: "armor_break_shockwave", value: 0.30, label: "Armor break: 30% shockwave" },
        ],
      },
    ],
    aura: {
      name: "Prophetic Shield",
      description: "Allies within range gain +10% dodge chance.",
      range: 3,
      effects: [{ target: "ally_dodge", value: 0.10, label: "+10% ally dodge" }],
    },
  },

  /* ─── ENGINEER + SOLDIER = ARCHITECT PRIME ─── */
  {
    key: "architect_prime",
    name: "Architect Prime",
    title: "Builder of Empires",
    description: "The ultimate builder-warrior. Architect Primes construct fortifications and war machines that dominate guild wars.",
    icon: "Building2",
    color: "#0ea5e9",
    primaryClass: "engineer",
    secondaryClass: "soldier",
    minLevel: 20,
    unlockQuestId: "prestige_architect_prime",
    lore: "The Engineer builds colonies. The Soldier conquers them. The Architect Prime does both — raising empires from the ashes of war.",
    perks: [
      {
        key: "ap_war_factory",
        name: "War Factory",
        description: "Colonies produce war materials. Territory defense structures have +30% HP.",
        rank: 1,
        effects: [
          { system: "guild_war", type: "unlock", target: "colony_war_production", value: 1, label: "Colonies produce war materials" },
          { system: "guild_war", type: "multiplier", target: "defense_structure_hp", value: 1.30, label: "+30% defense structure HP" },
        ],
      },
      {
        key: "ap_siege_engine",
        name: "Siege Engine",
        description: "Build siege engines that deal 2x damage to enemy fortifications. Capture speed +30%.",
        rank: 2,
        effects: [
          { system: "guild_war", type: "unlock", target: "siege_engines", value: 1, label: "Build siege engines (2x vs fortifications)" },
          { system: "guild_war", type: "multiplier", target: "territory_capture", value: 1.30, label: "+30% capture speed" },
        ],
      },
      {
        key: "ap_citadel",
        name: "Citadel",
        description: "Build a Citadel on any territory: immune to sabotage, +50% production, heals all allies in range.",
        rank: 3,
        effects: [
          { system: "guild_war", type: "unlock", target: "citadel_building", value: 1, label: "Build Citadel (immune to sabotage)" },
          { system: "guild_war", type: "multiplier", target: "citadel_production", value: 1.50, label: "+50% Citadel production" },
        ],
      },
    ],
    aura: {
      name: "Fortification Aura",
      description: "Allies within range gain +15% DEF near your territories.",
      range: 4,
      effects: [{ target: "ally_territory_def", value: 1.15, label: "+15% ally DEF near territories" }],
    },
  },

  /* ─── ORACLE + SPY = VOID WALKER ─── */
  {
    key: "void_walker",
    name: "Void Walker",
    title: "Between Worlds",
    description: "Moves between dimensions of knowledge and shadow. Void Walkers see all and are seen by none.",
    icon: "Orbit",
    color: "#6d28d9",
    primaryClass: "oracle",
    secondaryClass: "spy",
    minLevel: 20,
    unlockQuestId: "prestige_void_walker",
    lore: "The Oracle peers into the void. The Spy walks through shadows. The Void Walker exists in both — a ghost that knows everything.",
    perks: [
      {
        key: "vw_omniscience",
        name: "Omniscience",
        description: "See all marketplace prices, guild war movements, and player locations in real-time.",
        rank: 1,
        effects: [
          { system: "market", type: "unlock", target: "real_time_prices", value: 1, label: "Real-time marketplace prices" },
          { system: "guild_war", type: "unlock", target: "real_time_movements", value: 1, label: "Real-time enemy movements" },
        ],
      },
      {
        key: "vw_phase_shift",
        name: "Phase Shift",
        description: "Once per fight: become intangible for 2 turns (immune to all damage, can still attack).",
        rank: 2,
        effects: [
          { system: "fight", type: "passive", target: "phase_shift_turns", value: 2, label: "2 turns of intangibility per fight" },
        ],
      },
      {
        key: "vw_void_sight",
        name: "Void Sight",
        description: "All hidden information revealed: opponent hands in cards, hidden quests, secret marketplace deals.",
        rank: 3,
        effects: [
          { system: "all", type: "unlock", target: "reveal_all_hidden", value: 1, label: "All hidden information revealed" },
        ],
      },
    ],
    aura: {
      name: "Veil of the Void",
      description: "Allies within range are hidden from enemy detection.",
      range: 2,
      effects: [{ target: "ally_stealth", value: 1, label: "Allies hidden from detection" }],
    },
  },

  /* ─── ENGINEER + SPY = PHANTOM ENGINEER ─── */
  {
    key: "phantom_engineer",
    name: "Phantom Engineer",
    title: "Ghost in the Machine",
    description: "Builds invisible infrastructure and hidden trade networks. The economy bends to their will.",
    icon: "Wrench",
    color: "#14b8a6",
    primaryClass: "engineer",
    secondaryClass: "spy",
    minLevel: 20,
    unlockQuestId: "prestige_phantom_engineer",
    lore: "The Engineer builds in the open. The Spy operates in the dark. The Phantom Engineer builds in the dark — and nobody knows until it's too late.",
    perks: [
      {
        key: "pe_hidden_colony",
        name: "Hidden Colony",
        description: "Build invisible colonies that cannot be targeted in guild wars. Production +20%.",
        rank: 1,
        effects: [
          { system: "guild_war", type: "unlock", target: "hidden_colonies", value: 1, label: "Build invisible colonies" },
          { system: "trade_empire", type: "multiplier", target: "colony_production", value: 1.20, label: "+20% colony production" },
        ],
      },
      {
        key: "pe_ghost_trade",
        name: "Ghost Trade Routes",
        description: "Trade routes are invisible to other players. Trade profit +25%, no piracy risk.",
        rank: 2,
        effects: [
          { system: "trade_empire", type: "unlock", target: "invisible_routes", value: 1, label: "Invisible trade routes" },
          { system: "trade_empire", type: "multiplier", target: "trade_profit", value: 1.25, label: "+25% trade profit" },
        ],
      },
      {
        key: "pe_shadow_factory",
        name: "Shadow Factory",
        description: "Craft items without consuming materials 20% of the time. Crafted items have hidden bonuses.",
        rank: 3,
        effects: [
          { system: "crafting", type: "passive", target: "free_craft_chance", value: 0.20, label: "20% chance to craft for free" },
          { system: "crafting", type: "passive", target: "hidden_bonus", value: 1, label: "Crafted items gain hidden bonuses" },
        ],
      },
    ],
    aura: {
      name: "Cloaking Field",
      description: "Allies within range have their trade routes hidden from enemies.",
      range: 3,
      effects: [{ target: "ally_trade_stealth", value: 1, label: "Hide ally trade routes" }],
    },
  },

  /* ─── ORACLE + ASSASSIN = WAR ORACLE ─── */
  {
    key: "war_oracle",
    name: "War Oracle",
    title: "Prophet of Destruction",
    description: "Sees the future and uses that knowledge to strike with devastating precision.",
    icon: "Crosshair",
    color: "#e11d48",
    primaryClass: "oracle",
    secondaryClass: "assassin",
    minLevel: 20,
    unlockQuestId: "prestige_war_oracle",
    lore: "The Oracle sees where the blade must fall. The Assassin ensures it falls there. The War Oracle is both the prophecy and its fulfillment.",
    perks: [
      {
        key: "wo_prescient_strike",
        name: "Prescient Strike",
        description: "First attack in every fight is a guaranteed critical hit. +20% crit damage.",
        rank: 1,
        effects: [
          { system: "fight", type: "passive", target: "first_strike_crit", value: 1, label: "First attack always crits" },
          { system: "fight", type: "multiplier", target: "crit_damage", value: 1.20, label: "+20% crit damage" },
        ],
      },
      {
        key: "wo_fate_weaver",
        name: "Fate Weaver",
        description: "In card battles: draw the exact card you need 15% of the time. Chess: see 3 moves ahead.",
        rank: 2,
        effects: [
          { system: "card_game", type: "passive", target: "perfect_draw_chance", value: 0.15, label: "15% chance to draw perfect card" },
          { system: "chess", type: "unlock", target: "move_preview", value: 3, label: "See 3 moves ahead in chess" },
        ],
      },
      {
        key: "wo_death_prophecy",
        name: "Death Prophecy",
        description: "Once per day: choose one enemy. Their next fight starts with -25% HP.",
        rank: 3,
        effects: [
          { system: "fight", type: "passive", target: "daily_curse", value: -0.25, label: "Curse: enemy starts at -25% HP" },
        ],
      },
    ],
    aura: {
      name: "Doom Sight",
      description: "Enemies within range have -5% accuracy.",
      range: 3,
      effects: [{ target: "enemy_accuracy_reduction", value: -0.05, label: "-5% enemy accuracy" }],
    },
  },
];

/* ═══════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/**
 * Get all prestige classes available for a given primary/secondary class combination.
 */
export function getAvailablePrestigeClasses(
  primaryClass: CharacterClass,
  secondaryClass: CharacterClass
): PrestigeClass[] {
  return PRESTIGE_CLASSES.filter(
    pc =>
      (pc.primaryClass === primaryClass && pc.secondaryClass === secondaryClass) ||
      (pc.primaryClass === secondaryClass && pc.secondaryClass === primaryClass)
  );
}

/**
 * Check if a player meets the requirements for a prestige class.
 */
export function meetsPrestigeRequirements(
  prestigeKey: PrestigeClassKey,
  citizenLevel: number,
  classRanks: Record<string, number>,
  completedQuests: string[]
): { eligible: boolean; missing: string[] } {
  const pc = PRESTIGE_CLASSES.find(p => p.key === prestigeKey);
  if (!pc) return { eligible: false, missing: ["Prestige class not found"] };

  const missing: string[] = [];

  if (citizenLevel < pc.minLevel) {
    missing.push(`Citizen level ${pc.minLevel} required (current: ${citizenLevel})`);
  }

  const primaryRank = classRanks[pc.primaryClass] || 0;
  if (primaryRank < 3) {
    missing.push(`${pc.primaryClass} mastery rank 3 required (current: ${primaryRank})`);
  }

  const secondaryRank = classRanks[pc.secondaryClass] || 0;
  if (secondaryRank < 2) {
    missing.push(`${pc.secondaryClass} mastery rank 2 required (current: ${secondaryRank})`);
  }

  if (!completedQuests.includes(pc.unlockQuestId)) {
    missing.push(`Complete quest: ${pc.unlockQuestId}`);
  }

  return { eligible: missing.length === 0, missing };
}

/**
 * Get prestige rank from XP.
 */
export function getPrestigeRank(xp: number): PrestigeRank {
  for (let i = PRESTIGE_RANKS.length - 1; i >= 0; i--) {
    if (xp >= PRESTIGE_RANKS[i].xpRequired) {
      return PRESTIGE_RANKS[i].rank as PrestigeRank;
    }
  }
  return 0;
}

/**
 * Get unlocked perks for a prestige class at a given rank.
 */
export function getPrestigePerks(prestigeKey: PrestigeClassKey, rank: PrestigeRank): PrestigePerk[] {
  const pc = PRESTIGE_CLASSES.find(p => p.key === prestigeKey);
  if (!pc) return [];
  return pc.perks.filter(p => p.rank <= rank);
}

/**
 * Get a prestige class by key.
 */
export function getPrestigeClass(key: PrestigeClassKey): PrestigeClass | undefined {
  return PRESTIGE_CLASSES.find(p => p.key === key);
}

/**
 * Get all prestige classes that require a specific base class.
 */
export function getPrestigeClassesForBaseClass(baseClass: CharacterClass): PrestigeClass[] {
  return PRESTIGE_CLASSES.filter(
    pc => pc.primaryClass === baseClass || pc.secondaryClass === baseClass
  );
}
