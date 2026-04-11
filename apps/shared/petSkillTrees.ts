/* ═══════════════════════════════════════════════════════
   PET SKILL TREES (shared)

   Source of truth for per-species skill trees used by
   both the client (UI) and the server (persistence +
   combat enforcement). The trees describe 3 branches
   (Combat/Utility/Social), each with tier-gated nodes
   that declare their effect as a short `bonus` string
   (e.g. `damage_12`, `dodge_8`).

   `parseSkillBonus` is the single translator from those
   strings into combat-engine effects. It lets designers
   author new nodes without touching combat code.
   ═══════════════════════════════════════════════════════ */

export interface PetSkillNode {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3;
  cost: number; // Skill points required
  bonus: string;
  /** Prerequisite node */
  requires?: string;
}

export interface PetSkillBranch {
  name: string;
  nodes: PetSkillNode[];
}

export interface PetSkillTree {
  combat: PetSkillBranch;
  utility: PetSkillBranch;
  social: PetSkillBranch;
}

export const PET_SKILL_TREES: Record<string, PetSkillTree> = {
  default: {
    combat: {
      name: "COMBAT",
      nodes: [
        { id: "bite", name: "Sharpened Bite", description: "+10% pet battle damage", tier: 1, cost: 1, bonus: "damage_10" },
        { id: "dodge", name: "Quick Dodge", description: "+5% dodge chance in pet battles", tier: 1, cost: 1, bonus: "dodge_5" },
        { id: "rally", name: "Rally Cry", description: "Buffs your combat stats by +5% when pet is active", tier: 2, cost: 2, bonus: "owner_buff_5", requires: "bite" },
        { id: "crit", name: "Critical Strike", description: "10% chance to crit in pet battles (2x damage)", tier: 2, cost: 2, bonus: "crit_10", requires: "dodge" },
        { id: "fury", name: "Protective Fury", description: "When owner HP below 25%, pet enrages: +25% damage, +25% speed", tier: 3, cost: 3, bonus: "rage_mode", requires: "rally" },
      ],
    },
    utility: {
      name: "UTILITY",
      nodes: [
        { id: "scout", name: "Scouting", description: "Reveals adjacent room hotspots", tier: 1, cost: 1, bonus: "hotspot_reveal" },
        { id: "fetch", name: "Fetch Items", description: "5% chance to find bonus items in rooms", tier: 1, cost: 1, bonus: "item_bonus_5" },
        { id: "sniff", name: "Treasure Sense", description: "Can detect hidden items in rooms", tier: 2, cost: 2, bonus: "hidden_reveal", requires: "fetch" },
        { id: "guide", name: "Path Guide", description: "Shows shortest path between rooms on map", tier: 2, cost: 2, bonus: "pathfinding", requires: "scout" },
        { id: "oracle", name: "Oracle's Instinct", description: "Predicts NPC trust changes from choices before you commit", tier: 3, cost: 3, bonus: "choice_preview", requires: "guide" },
      ],
    },
    social: {
      name: "SOCIAL",
      nodes: [
        { id: "calm", name: "Calming Presence", description: "+5% trust gain with all NPCs", tier: 1, cost: 1, bonus: "trust_gain_5" },
        { id: "empathy", name: "Empathic Link", description: "Pet warns you when NPC dialog is deceptive", tier: 1, cost: 1, bonus: "deception_detect" },
        { id: "charm", name: "Charm", description: "+10% gift effectiveness with NPCs", tier: 2, cost: 2, bonus: "gift_boost_10", requires: "calm" },
        { id: "insight", name: "Deep Insight", description: "See NPC mood (hidden) before dialogue", tier: 2, cost: 2, bonus: "mood_reveal", requires: "empathy" },
        { id: "harmonize", name: "Harmonic Bond", description: "Your active pet's bond affects ALL NPC trust gains (+0.5% per bond point)", tier: 3, cost: 3, bonus: "universal_trust", requires: "charm" },
      ],
    },
  },

  /* Lux (Holographic Fox) — light, perception, evasion */
  holographic_fox: {
    combat: {
      name: "COMBAT",
      nodes: [
        { id: "light_lance", name: "Light Lance", description: "+12% pet battle damage (photon-focused)", tier: 1, cost: 1, bonus: "damage_12" },
        { id: "phase_dodge", name: "Phase Dodge", description: "+8% dodge chance — Lux flickers out of existence briefly", tier: 1, cost: 1, bonus: "dodge_8" },
        { id: "radiant_strike", name: "Radiant Strike", description: "+15% crit chance when attacking in lit arenas", tier: 2, cost: 2, bonus: "crit_15", requires: "light_lance" },
        { id: "photon_chain", name: "Photon Chain", description: "15% chance attacks chain to a second target", tier: 2, cost: 2, bonus: "chain_15", requires: "phase_dodge" },
        { id: "solar_flare", name: "Solar Flare", description: "Blinding ultimate: guaranteed crit + stun, long cooldown", tier: 3, cost: 3, bonus: "ultimate_solar_flare", requires: "radiant_strike" },
      ],
    },
    utility: {
      name: "UTILITY",
      nodes: [
        { id: "sight_beyond", name: "Sight Beyond Sight", description: "Reveals stealthed enemies in adjacent rooms", tier: 1, cost: 1, bonus: "reveal_stealth" },
        { id: "foxfire", name: "Foxfire Beacon", description: "10% bonus dream tokens from pet battles", tier: 1, cost: 1, bonus: "dream_bonus_10" },
        { id: "hologram_decoy", name: "Hologram Decoy", description: "First attack on Lux targets a decoy instead (1/battle)", tier: 2, cost: 2, bonus: "decoy_1", requires: "sight_beyond" },
        { id: "solar_reservoir", name: "Solar Reservoir", description: "+8 regen per turn in lit arenas", tier: 2, cost: 2, bonus: "regen_8", requires: "foxfire" },
        { id: "starchart", name: "Starchart Oracle", description: "Preview enemy next move at battle start", tier: 3, cost: 3, bonus: "preview_intent", requires: "hologram_decoy" },
      ],
    },
    social: {
      name: "SOCIAL",
      nodes: [
        { id: "light_kin", name: "Light Kin", description: "+8% trust gain with humanity-aligned NPCs", tier: 1, cost: 1, bonus: "trust_gain_8" },
        { id: "warm_glow", name: "Warm Glow", description: "+5% gift effectiveness", tier: 1, cost: 1, bonus: "gift_boost_5" },
        { id: "truth_shine", name: "Truth Shine", description: "Lux pulses when NPCs lie (reveals deception)", tier: 2, cost: 2, bonus: "deception_detect", requires: "light_kin" },
        { id: "aura_mend", name: "Aura Mend", description: "+10% healing received from all sources", tier: 2, cost: 2, bonus: "heal_power_10", requires: "warm_glow" },
        { id: "dawn_chorus", name: "Dawn Chorus", description: "Morning bond gains doubled for 1 hour after login", tier: 3, cost: 3, bonus: "bond_gain_morning_2x", requires: "truth_shine" },
      ],
    },
  },

  /* Cipher (Data Serpent) — information, code, pressure */
  data_serpent: {
    combat: {
      name: "COMBAT",
      nodes: [
        { id: "code_fang", name: "Code Fang", description: "+12% pet battle damage (exploits enemy schemas)", tier: 1, cost: 1, bonus: "damage_12" },
        { id: "armor_break", name: "Armor Break", description: "Ignore 15% of enemy defense", tier: 1, cost: 1, bonus: "armor_pen_15" },
        { id: "viral_load", name: "Viral Load", description: "+30% burn damage over time", tier: 2, cost: 2, bonus: "burn_damage_30", requires: "code_fang" },
        { id: "segfault", name: "Segfault", description: "25% chance to stun on crit", tier: 2, cost: 2, bonus: "crit_stun_25", requires: "armor_break" },
        { id: "system_crash", name: "System Crash", description: "Ultimate: disables enemy abilities for 2 turns", tier: 3, cost: 3, bonus: "ultimate_system_crash", requires: "viral_load" },
      ],
    },
    utility: {
      name: "UTILITY",
      nodes: [
        { id: "packet_sniffer", name: "Packet Sniffer", description: "Reveals hidden items in rooms", tier: 1, cost: 1, bonus: "hidden_reveal" },
        { id: "crypto_vault", name: "Crypto Vault", description: "+15% credits from pet battles", tier: 1, cost: 1, bonus: "credits_bonus_15" },
        { id: "zero_day", name: "Zero-Day Exploit", description: "First move each fight ignores cooldowns", tier: 2, cost: 2, bonus: "first_move_free", requires: "packet_sniffer" },
        { id: "honeypot", name: "Honeypot", description: "+10% enemy hostility redirected to Cipher", tier: 2, cost: 2, bonus: "taunt_10", requires: "crypto_vault" },
        { id: "fork_bomb", name: "Fork Bomb", description: "Copies itself — 1 extra attack per turn", tier: 3, cost: 3, bonus: "extra_attack_1", requires: "zero_day" },
      ],
    },
    social: {
      name: "SOCIAL",
      nodes: [
        { id: "cold_read", name: "Cold Read", description: "+8% trust gain with machine-aligned NPCs", tier: 1, cost: 1, bonus: "trust_gain_8" },
        { id: "data_gift", name: "Data Gift", description: "+5% gift effectiveness when giving tech items", tier: 1, cost: 1, bonus: "gift_boost_5" },
        { id: "signal_read", name: "Signal Read", description: "See NPC mood before dialogue", tier: 2, cost: 2, bonus: "mood_reveal", requires: "cold_read" },
        { id: "coldstart", name: "Coldstart", description: "Reduces NPC starting hostility by 5", tier: 2, cost: 2, bonus: "hostility_reduce_5", requires: "data_gift" },
        { id: "network_kin", name: "Network Kin", description: "Cipher unlocks a hidden intel feed weekly", tier: 3, cost: 3, bonus: "weekly_intel", requires: "signal_read" },
      ],
    },
  },

  /* Echo (Temporal Kitten) — time, memory, recovery */
  temporal_kitten: {
    combat: {
      name: "COMBAT",
      nodes: [
        { id: "time_slash", name: "Time Slash", description: "+10% pet battle damage", tier: 1, cost: 1, bonus: "damage_10" },
        { id: "reflex_boost", name: "Reflex Boost", description: "+10% initiative (first strike advantage)", tier: 1, cost: 1, bonus: "initiative_10" },
        { id: "stutter_step", name: "Stutter Step", description: "+20% dodge chance on first attack each fight", tier: 2, cost: 2, bonus: "first_dodge_20", requires: "reflex_boost" },
        { id: "echo_strike", name: "Echo Strike", description: "Attacks hit twice at 60% power each", tier: 2, cost: 2, bonus: "double_hit_60", requires: "time_slash" },
        { id: "rewind_fate", name: "Rewind Fate", description: "Ultimate: rewinds last 3 turns once per battle", tier: 3, cost: 3, bonus: "ultimate_rewind", requires: "echo_strike" },
      ],
    },
    utility: {
      name: "UTILITY",
      nodes: [
        { id: "quicksilver", name: "Quicksilver", description: "15% cooldown reduction on all moves", tier: 1, cost: 1, bonus: "cooldown_reduce_15" },
        { id: "second_chance", name: "Second Chance", description: "5% chance to re-roll a missed attack", tier: 1, cost: 1, bonus: "reroll_miss_5" },
        { id: "temporal_rest", name: "Temporal Rest", description: "+12 regen per turn — memories heal wounds", tier: 2, cost: 2, bonus: "regen_12", requires: "quicksilver" },
        { id: "precognition", name: "Precognition", description: "Preview enemy's next move at battle start", tier: 2, cost: 2, bonus: "preview_intent", requires: "second_chance" },
        { id: "revival_memory", name: "Revival Memory", description: "Halved revival cost after death", tier: 3, cost: 3, bonus: "revival_cost_half", requires: "temporal_rest" },
      ],
    },
    social: {
      name: "SOCIAL",
      nodes: [
        { id: "nine_lives", name: "Nine Lives", description: "+5% trust gain with all NPCs — charm of the familiar", tier: 1, cost: 1, bonus: "trust_gain_5" },
        { id: "memory_whisper", name: "Memory Whisper", description: "Remembers NPC conversation history across reloads", tier: 1, cost: 1, bonus: "npc_memory" },
        { id: "paw_of_fortune", name: "Paw of Fortune", description: "+10% XP from dialogue choices", tier: 2, cost: 2, bonus: "dialogue_xp_10", requires: "nine_lives" },
        { id: "old_friend", name: "Old Friend", description: "+10% bond gain from shared missions", tier: 2, cost: 2, bonus: "bond_gain_mission_10", requires: "memory_whisper" },
        { id: "temporal_kinship", name: "Temporal Kinship", description: "Unlocks Antiquarian's hidden dialogue tree", tier: 3, cost: 3, bonus: "antiquarian_unlock", requires: "old_friend" },
      ],
    },
  },
};

/** Lookup a skill tree by pet species, falling back to the default tree. */
export function getSkillTreeForSpecies(species: string): PetSkillTree {
  return PET_SKILL_TREES[species] ?? PET_SKILL_TREES.default;
}

/**
 * PARSED SKILL BONUS — combat-engine effect derived from a node's
 * bonus string. Non-combat nodes (utility/social) return empty effects;
 * those are handled by other subsystems.
 */
export interface SkillBonusEffect {
  damageMult?: number;
  dodgeBonus?: number;
  critBonus?: number;
  initiativeBonus?: number;
  regenPerTurn?: number;
  armorPen?: number;
  healMult?: number;
  chainChance?: number;
  extraAttacks?: number;
  cooldownMult?: number;
  missRerollChance?: number;
  doubleHitFactor?: number;
}

export function parseSkillBonus(bonus: string): SkillBonusEffect {
  const damageMatch = /^damage_(\d+)$/.exec(bonus);
  if (damageMatch) return { damageMult: 1 + Number(damageMatch[1]) / 100 };

  const dodgeMatch = /^dodge_(\d+)$/.exec(bonus);
  if (dodgeMatch) return { dodgeBonus: Number(dodgeMatch[1]) };

  const critMatch = /^crit_(\d+)$/.exec(bonus);
  if (critMatch) return { critBonus: Number(critMatch[1]) };

  const initMatch = /^initiative_(\d+)$/.exec(bonus);
  if (initMatch) return { initiativeBonus: Number(initMatch[1]) };

  const regenMatch = /^regen_(\d+)$/.exec(bonus);
  if (regenMatch) return { regenPerTurn: Number(regenMatch[1]) };

  const armorPenMatch = /^armor_pen_(\d+)$/.exec(bonus);
  if (armorPenMatch) return { armorPen: Number(armorPenMatch[1]) };

  const healMatch = /^heal_power_(\d+)$/.exec(bonus);
  if (healMatch) return { healMult: 1 + Number(healMatch[1]) / 100 };

  const chainMatch = /^chain_(\d+)$/.exec(bonus);
  if (chainMatch) return { chainChance: Number(chainMatch[1]) / 100 };

  const extraAttackMatch = /^extra_attack_(\d+)$/.exec(bonus);
  if (extraAttackMatch) return { extraAttacks: Number(extraAttackMatch[1]) };

  const cooldownMatch = /^cooldown_reduce_(\d+)$/.exec(bonus);
  if (cooldownMatch) return { cooldownMult: 1 - Number(cooldownMatch[1]) / 100 };

  const rerollMatch = /^reroll_miss_(\d+)$/.exec(bonus);
  if (rerollMatch) return { missRerollChance: Number(rerollMatch[1]) / 100 };

  const doubleHitMatch = /^double_hit_(\d+)$/.exec(bonus);
  if (doubleHitMatch) return { doubleHitFactor: Number(doubleHitMatch[1]) / 100 };

  return {};
}

export function aggregateSkillEffects(unlockedNodes: string[], species: string): SkillBonusEffect {
  const tree = getSkillTreeForSpecies(species);
  const all = [...tree.combat.nodes, ...tree.utility.nodes, ...tree.social.nodes];
  const effect: SkillBonusEffect = {};
  for (const id of unlockedNodes) {
    const node = all.find((n) => n.id === id);
    if (!node) continue;
    const parsed = parseSkillBonus(node.bonus);
    if (parsed.damageMult !== undefined) effect.damageMult = (effect.damageMult ?? 1) * parsed.damageMult;
    if (parsed.dodgeBonus !== undefined) effect.dodgeBonus = (effect.dodgeBonus ?? 0) + parsed.dodgeBonus;
    if (parsed.critBonus !== undefined) effect.critBonus = (effect.critBonus ?? 0) + parsed.critBonus;
    if (parsed.initiativeBonus !== undefined) effect.initiativeBonus = (effect.initiativeBonus ?? 0) + parsed.initiativeBonus;
    if (parsed.regenPerTurn !== undefined) effect.regenPerTurn = (effect.regenPerTurn ?? 0) + parsed.regenPerTurn;
    if (parsed.armorPen !== undefined) effect.armorPen = Math.max(effect.armorPen ?? 0, parsed.armorPen);
    if (parsed.healMult !== undefined) effect.healMult = (effect.healMult ?? 1) * parsed.healMult;
    if (parsed.chainChance !== undefined) effect.chainChance = Math.max(effect.chainChance ?? 0, parsed.chainChance);
    if (parsed.extraAttacks !== undefined) effect.extraAttacks = (effect.extraAttacks ?? 0) + parsed.extraAttacks;
    if (parsed.cooldownMult !== undefined) effect.cooldownMult = (effect.cooldownMult ?? 1) * parsed.cooldownMult;
    if (parsed.missRerollChance !== undefined) effect.missRerollChance = Math.max(effect.missRerollChance ?? 0, parsed.missRerollChance);
    if (parsed.doubleHitFactor !== undefined) effect.doubleHitFactor = parsed.doubleHitFactor;
  }
  return effect;
}

/**
 * Validate that a skill node can be unlocked given the player's
 * current progress. Single source of truth consumed by both the
 * server (authoritative) and the client (preflight).
 */
export function canUnlockNode(
  nodeId: string,
  species: string,
  availablePoints: number,
  alreadyUnlocked: string[],
): { ok: true } | { ok: false; reason: string } {
  const tree = getSkillTreeForSpecies(species);
  const all = [...tree.combat.nodes, ...tree.utility.nodes, ...tree.social.nodes];
  const node = all.find((n) => n.id === nodeId);
  if (!node) return { ok: false, reason: "Unknown skill node" };
  if (alreadyUnlocked.includes(nodeId)) return { ok: false, reason: "Already unlocked" };
  if (availablePoints < node.cost) return { ok: false, reason: "Not enough skill points" };
  if (node.requires && !alreadyUnlocked.includes(node.requires)) {
    return { ok: false, reason: `Requires prerequisite node: ${node.requires}` };
  }
  return { ok: true };
}

export function getSkillNodeCost(nodeId: string, species: string): number {
  const tree = getSkillTreeForSpecies(species);
  const all = [...tree.combat.nodes, ...tree.utility.nodes, ...tree.social.nodes];
  return all.find((n) => n.id === nodeId)?.cost ?? 0;
}
