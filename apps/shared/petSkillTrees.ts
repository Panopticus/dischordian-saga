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

  /* Spore (Spore Fungus) — viral, healing, symbiosis */
  spore_fungus: {
    combat: {
      name: "COMBAT",
      nodes: [
        { id: "spore_burst", name: "Spore Burst", description: "+10% pet battle damage (toxic clouds)", tier: 1, cost: 1, bonus: "damage_10" },
        { id: "viral_skin", name: "Viral Skin", description: "-8 flat damage reduction from each hit", tier: 1, cost: 1, bonus: "damage_reduction_8" },
        { id: "infection_cloud", name: "Infection Cloud", description: "+25% burn damage over time (viral bloom)", tier: 2, cost: 2, bonus: "burn_damage_25", requires: "spore_burst" },
        { id: "rot_armor", name: "Rot Armor", description: "+10% dodge chance — enemies flinch from touching the fungus", tier: 2, cost: 2, bonus: "dodge_10", requires: "viral_skin" },
        { id: "strain_bloom", name: "Strain Bloom", description: "Ultimate: infect the arena — all enemies take passive damage", tier: 3, cost: 3, bonus: "ultimate_strain_bloom", requires: "infection_cloud" },
      ],
    },
    utility: {
      name: "UTILITY",
      nodes: [
        { id: "mycelium_net", name: "Mycelium Net", description: "Reveals hidden items in any room Spore has entered", tier: 1, cost: 1, bonus: "hidden_reveal" },
        { id: "sporeling", name: "Sporeling", description: "+15 regen per turn — Spore literally regrows", tier: 1, cost: 1, bonus: "regen_15" },
        { id: "decay_economy", name: "Decay Economy", description: "+15% dream tokens from pet battles (recycled rot)", tier: 2, cost: 2, bonus: "dream_bonus_15", requires: "mycelium_net" },
        { id: "viral_purge", name: "Viral Purge", description: "Cleanses status effects at battle start", tier: 2, cost: 2, bonus: "status_cleanse", requires: "sporeling" },
        { id: "living_archive", name: "Living Archive", description: "Preview enemy's next move at battle start", tier: 3, cost: 3, bonus: "preview_intent", requires: "decay_economy" },
      ],
    },
    social: {
      name: "SOCIAL",
      nodes: [
        { id: "symbiosis", name: "Symbiosis", description: "+8% trust gain with all NPCs (Spore calms them subconsciously)", tier: 1, cost: 1, bonus: "trust_gain_8" },
        { id: "decay_gift", name: "Decay Gift", description: "+5% gift effectiveness — organics-based gifts preferred", tier: 1, cost: 1, bonus: "gift_boost_5" },
        { id: "viral_empathy", name: "Viral Empathy", description: "Pet warns you when NPC dialogue is deceptive", tier: 2, cost: 2, bonus: "deception_detect", requires: "symbiosis" },
        { id: "rot_diplomacy", name: "Rot Diplomacy", description: "Reduces NPC starting hostility by 5", tier: 2, cost: 2, bonus: "hostility_reduce_5", requires: "decay_gift" },
        { id: "mycelium_chorus", name: "Mycelium Chorus", description: "Strain communicates with other infected crew — secret dialogue unlocked", tier: 3, cost: 3, bonus: "strain_dialogue", requires: "viral_empathy" },
      ],
    },
  },

  /* Gilt (Gilt Beetle) — earth, armor, wealth */
  gilt_beetle: {
    combat: {
      name: "COMBAT",
      nodes: [
        { id: "mandible_crunch", name: "Mandible Crunch", description: "+10% pet battle damage", tier: 1, cost: 1, bonus: "damage_10" },
        { id: "gold_plate", name: "Gold Plate", description: "Ignore 10% of enemy defense (pierce armor with shell-strikes)", tier: 1, cost: 1, bonus: "armor_pen_10" },
        { id: "burrow_guard", name: "Burrow Guard", description: "-10 flat damage reduction — Gilt digs in", tier: 2, cost: 2, bonus: "damage_reduction_10", requires: "mandible_crunch" },
        { id: "shell_shock", name: "Shell Shock", description: "+15% crit chance when below 50% HP — the beetle fights hardest cornered", tier: 2, cost: 2, bonus: "crit_15", requires: "gold_plate" },
        { id: "treasure_rage", name: "Treasure Rage", description: "Ultimate: +50% damage for 3 turns after taking any hit", tier: 3, cost: 3, bonus: "ultimate_treasure_rage", requires: "burrow_guard" },
      ],
    },
    utility: {
      name: "UTILITY",
      nodes: [
        { id: "prospector", name: "Prospector", description: "+20% dream tokens from pet battles (Gilt smells value)", tier: 1, cost: 1, bonus: "dream_bonus_20" },
        { id: "tremor_sense", name: "Tremor Sense", description: "Reveals adjacent room hotspots via ground vibrations", tier: 1, cost: 1, bonus: "hotspot_reveal" },
        { id: "appraisal", name: "Appraisal", description: "+25% credits from pet battles", tier: 2, cost: 2, bonus: "credits_bonus_25", requires: "prospector" },
        { id: "ore_sense", name: "Ore Sense", description: "Reveals hidden items in all rooms", tier: 2, cost: 2, bonus: "hidden_reveal", requires: "tremor_sense" },
        { id: "gilded_vault", name: "Gilded Vault", description: "+1 bonus item drop per arena victory", tier: 3, cost: 3, bonus: "bonus_drop_1", requires: "appraisal" },
      ],
    },
    social: {
      name: "SOCIAL",
      nodes: [
        { id: "merchant_kin", name: "Merchant Kin", description: "+10% gift effectiveness when giving luxury items", tier: 1, cost: 1, bonus: "gift_boost_10" },
        { id: "haggler", name: "Haggler", description: "-10% store prices (Gilt intimidates vendors)", tier: 1, cost: 1, bonus: "store_discount_10" },
        { id: "patron", name: "Patron", description: "+5% trust gain with wealth-aligned NPCs", tier: 2, cost: 2, bonus: "trust_gain_5", requires: "merchant_kin" },
        { id: "vault_reveal", name: "Vault Reveal", description: "See NPC mood before dialogue", tier: 2, cost: 2, bonus: "mood_reveal", requires: "haggler" },
        { id: "the_collectors_eye", name: "The Collector's Eye", description: "Unlocks Collector hidden-merchant route", tier: 3, cost: 3, bonus: "collector_merchant", requires: "patron" },
      ],
    },
  },

  /* Glyph (Glyph Moth) — air, prophecy, wings */
  glyph_moth: {
    combat: {
      name: "COMBAT",
      nodes: [
        { id: "wing_slash", name: "Wing Slash", description: "+8% pet battle damage (sharp glyph edges)", tier: 1, cost: 1, bonus: "damage_8" },
        { id: "scale_dust", name: "Scale Dust", description: "+12% dodge chance (the dust obscures vision)", tier: 1, cost: 1, bonus: "dodge_12" },
        { id: "glyph_curse", name: "Glyph Curse", description: "Ignore 20% of enemy defense (writes weakness into their code)", tier: 2, cost: 2, bonus: "armor_pen_20", requires: "wing_slash" },
        { id: "foresight_strike", name: "Foresight Strike", description: "+20% crit chance — attacks hit future weak points", tier: 2, cost: 2, bonus: "crit_20", requires: "scale_dust" },
        { id: "oracles_flight", name: "Oracle's Flight", description: "Ultimate: dodge the next 3 attacks guaranteed", tier: 3, cost: 3, bonus: "ultimate_oracles_flight", requires: "foresight_strike" },
      ],
    },
    utility: {
      name: "UTILITY",
      nodes: [
        { id: "prophecy_wing", name: "Prophecy Wing", description: "Preview enemy's next move at battle start", tier: 1, cost: 1, bonus: "preview_intent" },
        { id: "chitin_lantern", name: "Chitin Lantern", description: "+5 regen per turn — ambient light heals", tier: 1, cost: 1, bonus: "regen_5" },
        { id: "rune_reader", name: "Rune Reader", description: "Predicts NPC trust changes from choices before you commit", tier: 2, cost: 2, bonus: "choice_preview", requires: "prophecy_wing" },
        { id: "wind_glide", name: "Wind Glide", description: "+15% initiative — Glyph moves first", tier: 2, cost: 2, bonus: "initiative_15", requires: "chitin_lantern" },
        { id: "written_fate", name: "Written Fate", description: "5% chance to re-roll a missed attack", tier: 3, cost: 3, bonus: "reroll_miss_5", requires: "rune_reader" },
      ],
    },
    social: {
      name: "SOCIAL",
      nodes: [
        { id: "glyph_weaver", name: "Glyph Weaver", description: "+10% trust gain with dreamer-aligned NPCs", tier: 1, cost: 1, bonus: "trust_gain_10" },
        { id: "moth_messenger", name: "Moth Messenger", description: "+10% gift effectiveness (Glyph delivers gifts directly)", tier: 1, cost: 1, bonus: "gift_boost_10" },
        { id: "scroll_keeper", name: "Scroll Keeper", description: "See NPC mood before dialogue", tier: 2, cost: 2, bonus: "mood_reveal", requires: "glyph_weaver" },
        { id: "prophet_seat", name: "Prophet's Seat", description: "+10% XP from dialogue choices", tier: 2, cost: 2, bonus: "dialogue_xp_10", requires: "moth_messenger" },
        { id: "written_name", name: "Written Name", description: "Unlocks Antiquarian's prophecy-read dialogue", tier: 3, cost: 3, bonus: "antiquarian_unlock", requires: "scroll_keeper" },
      ],
    },
  },

  /* Flicker (Flicker Imp) — fire, chaos, mischief */
  flicker_imp: {
    combat: {
      name: "COMBAT",
      nodes: [
        { id: "ember_jab", name: "Ember Jab", description: "+12% pet battle damage (burning strikes)", tier: 1, cost: 1, bonus: "damage_12" },
        { id: "flash_step", name: "Flash Step", description: "+10% dodge chance — Flicker is briefly somewhere else", tier: 1, cost: 1, bonus: "dodge_10" },
        { id: "wildfire", name: "Wildfire", description: "+30% burn damage over time", tier: 2, cost: 2, bonus: "burn_damage_30", requires: "ember_jab" },
        { id: "chain_spark", name: "Chain Spark", description: "20% chance attacks chain to a second target", tier: 2, cost: 2, bonus: "chain_20", requires: "flash_step" },
        { id: "infernal_mischief", name: "Infernal Mischief", description: "Ultimate: 1 extra attack per turn (imp doubles up)", tier: 3, cost: 3, bonus: "extra_attack_1", requires: "wildfire" },
      ],
    },
    utility: {
      name: "UTILITY",
      nodes: [
        { id: "spark_hoard", name: "Spark Hoard", description: "+15% dream tokens from pet battles (Flicker pockets them)", tier: 1, cost: 1, bonus: "dream_bonus_15" },
        { id: "trickster_luck", name: "Trickster's Luck", description: "10% chance to re-roll a missed attack", tier: 1, cost: 1, bonus: "reroll_miss_10" },
        { id: "pocket_fire", name: "Pocket Fire", description: "+10 regen per turn — Flicker steals warmth", tier: 2, cost: 2, bonus: "regen_10", requires: "spark_hoard" },
        { id: "pickpocket", name: "Pickpocket", description: "+1 bonus item drop per arena victory", tier: 2, cost: 2, bonus: "bonus_drop_1", requires: "trickster_luck" },
        { id: "chaos_cascade", name: "Chaos Cascade", description: "20% cooldown reduction on all moves", tier: 3, cost: 3, bonus: "cooldown_reduce_20", requires: "pocket_fire" },
      ],
    },
    social: {
      name: "SOCIAL",
      nodes: [
        { id: "jester", name: "Jester", description: "+8% trust gain with insurgency-aligned NPCs", tier: 1, cost: 1, bonus: "trust_gain_8" },
        { id: "spark_gift", name: "Spark Gift", description: "+10% gift effectiveness on chaotic NPCs", tier: 1, cost: 1, bonus: "gift_boost_10" },
        { id: "mocking_bird", name: "Mocking Bird", description: "Pet warns you when NPC dialogue is deceptive", tier: 2, cost: 2, bonus: "deception_detect", requires: "jester" },
        { id: "thiefs_bargain", name: "Thief's Bargain", description: "-15% store prices (Flicker distracts vendors)", tier: 2, cost: 2, bonus: "store_discount_15", requires: "spark_gift" },
        { id: "kindling_friend", name: "Kindling Friend", description: "Unlocks Insurgency cell contact list", tier: 3, cost: 3, bonus: "insurgency_contacts", requires: "mocking_bird" },
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
  /** Flat damage reduction subtracted from incoming hits (shell/armor nodes). */
  damageReduction?: number;
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

  // Flat damage reduction from shell/armor skills — Gilt "Burrow Guard",
  // Spore "Viral Skin". Routed through SkillBonusEffect.damageReduction
  // which the combat engine subtracts from the defender's incoming damage.
  const damageReductionMatch = /^damage_reduction_(\d+)$/.exec(bonus);
  if (damageReductionMatch) return { damageReduction: Number(damageReductionMatch[1]) };

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
    if (parsed.damageReduction !== undefined) effect.damageReduction = (effect.damageReduction ?? 0) + parsed.damageReduction;
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
