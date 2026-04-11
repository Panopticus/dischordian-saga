/* ═══════════════════════════════════════════════════════
   CREW REACTIONS — The Nervous System of the Living Ark

   Every significant event on the ship and in the universe
   ripples through the crew. They watch your fights, worry
   about your choices, celebrate your victories, mourn your
   losses, and take sides when the world fractures.

   This file is the connective tissue between every game
   system and the crew management layer. It transforms
   game state changes into crew morale shifts, feed entries,
   relationship changes, and danger modifiers.

   Design Philosophy:
   - Crew should feel like they LIVE on this ship
   - Every major action should have a crew echo
   - Not every echo needs to be actionable — most are flavor
   - The cumulative effect should be: "this ship breathes"

   Tiers:
   1. High-Impact: Combat, NPC trust, morality, Living Universe
   2. Medium-Impact: Economy, social, story/lore, governance
   3. Flavor: Prestige, music, exploration, necromancer, epoch
   ═══════════════════════════════════════════════════════ */

/* ─── CORE TYPES ─── */

export interface CrewReaction {
  id: string;
  trigger: CrewReactionTrigger;
  feedText: string;
  moraleEffect: number;
  loyaltyEffect?: number;
  healthEffect?: number;
  /** Only applies to crew with specific traits */
  traitFilter?: string;
  /** Only applies to crew in specific roles */
  roleFilter?: string;
  /** Only applies to specific bloodlines */
  bloodlineFilter?: string;
  severity: "info" | "warning" | "alert" | "critical" | "celebration";
  room: string;
  category: "combat" | "social" | "economic" | "story" | "moral" | "crisis" | "celebration" | "exploration" | "meta";
}

export type CrewReactionTrigger =
  // Tier 1: Combat
  | { type: "fight_victory"; streak?: number }
  | { type: "fight_defeat"; streak?: number }
  | { type: "boss_kill"; bossId: string; masteryLevel: number }
  | { type: "terminus_wave_cleared"; wave: number }
  | { type: "terminus_defeat" }
  | { type: "pvp_victory"; isRival: boolean }
  | { type: "pvp_defeat"; isRival: boolean }
  | { type: "coop_raid_victory" }
  | { type: "coop_raid_wipe" }
  // Tier 1: NPC & Apprentice
  | { type: "npc_trust_gained"; npcId: string; newTrust: number }
  | { type: "npc_trust_lost"; npcId: string; newTrust: number }
  | { type: "apprentice_recruited" }
  | { type: "apprentice_graduated" }
  | { type: "apprentice_betrayed" }
  | { type: "apprentice_died" }
  | { type: "breaking_point_triggered"; choice: "elara" | "human" }
  | { type: "npc_gift_given"; npcId: string }
  // Tier 1: Morality & Dark Arts
  | { type: "morality_shifted"; direction: "machine" | "humanity"; score: number }
  | { type: "corruption_tier_changed"; tier: string }
  | { type: "dark_ability_used"; abilityId: string }
  // Tier 1: Living Universe
  | { type: "living_universe_event"; eventId: string }
  | { type: "necromancer_phase_changed"; phase: string }
  // Tier 2: Economy
  | { type: "big_trade"; profit: number }
  | { type: "crafting_success"; rarity: string }
  | { type: "crafting_failure" }
  | { type: "marketplace_sale"; amount: number }
  | { type: "lottery_win" }
  // Tier 2: Social
  | { type: "guild_war_started" }
  | { type: "guild_war_won" }
  | { type: "guild_war_lost" }
  | { type: "guild_tier_upgraded"; tier: number }
  | { type: "donation_made"; amount: number }
  | { type: "visitor_to_quarters" }
  // Tier 2: Story & Lore
  | { type: "signal_intercepted" }
  | { type: "loredex_discovery"; entryCount: number }
  | { type: "tome_read"; tomeId: string }
  | { type: "transmission_watched"; episodeId: string }
  | { type: "conspiracy_connection_made" }
  // Tier 2: Governance
  | { type: "community_vote_cast" }
  | { type: "vote_outcome"; voteId: string; won: boolean }
  | { type: "daily_resource_choice"; choice: string }
  // Tier 3: Progression
  | { type: "level_up"; level: number }
  | { type: "prestige_reset"; prestigeLevel: number }
  | { type: "achievement_unlocked"; achievementId: string }
  | { type: "epoch_pass_tier"; tier: number }
  // Tier 3: Exploration & Specimens
  | { type: "room_discovered"; roomId: string }
  | { type: "specimen_collected"; specimenId: string }
  | { type: "quarantine_started"; roomId: string }
  | { type: "quarantine_resolved"; roomId: string }
  // Tier 3: Music & Media
  | { type: "music_played"; songId: string }
  | { type: "doom_scroll_read" }
  // Tier 3: Station
  | { type: "station_upgraded"; tier: number }
  | { type: "station_raided" }
  | { type: "station_visitor"; rating: number };

/* ═══════════════════════════════════════════════════════
   TIER 1: HIGH-IMPACT REACTIONS
   Combat, NPC Trust, Morality, Living Universe
   These are felt immediately. Crew LIVES through these.
   ═══════════════════════════════════════════════════════ */

const TIER_1_COMBAT: CrewReaction[] = [
  // ── Fight Victories ──
  { id: "fight_win_1", trigger: { type: "fight_victory" }, feedText: "Armory: [CREW_NAME] watched your fight on the training bay monitor. Nodded approvingly. Said nothing. Didn't need to.", moraleEffect: 3, severity: "info", room: "armory", category: "combat" },
  { id: "fight_win_streak_3", trigger: { type: "fight_victory", streak: 3 }, feedText: "Mess Hall: Your 3-fight win streak is the talk of dinner. [CREW_NAME] is telling the story with increasingly dramatic hand gestures.", moraleEffect: 5, severity: "info", room: "cargo_bay", category: "combat" },
  { id: "fight_win_streak_7", trigger: { type: "fight_victory", streak: 7 }, feedText: "Bridge: [CREW_NAME] posted your 7-fight streak on the crew bulletin board. Someone drew a crown above your name.", moraleEffect: 8, severity: "info", room: "bridge", category: "celebration" },
  { id: "fight_win_streak_10", trigger: { type: "fight_victory", streak: 10 }, feedText: "Trophy Room: [CREW_NAME] reserved space for a plaque. 'For when the Captain reaches 10.' You just did.", moraleEffect: 12, severity: "info", room: "trophy_room", category: "celebration" },

  // ── Fight Defeats ──
  { id: "fight_loss_1", trigger: { type: "fight_defeat" }, feedText: "Medical Bay: [CREW_NAME] left a first-aid kit outside your quarters. No note. No judgment.", moraleEffect: -2, severity: "info", room: "medical_bay", category: "combat" },
  { id: "fight_loss_streak_3", trigger: { type: "fight_defeat", streak: 3 }, feedText: "Mess Hall: The crew is quiet tonight. [CREW_NAME] changed the subject when someone mentioned the Arena. Small mercies.", moraleEffect: -5, severity: "warning", room: "cargo_bay", category: "combat" },
  { id: "fight_loss_streak_5", trigger: { type: "fight_defeat", streak: 5 }, feedText: "Captain's Quarters: [CREW_NAME] knocked on your door. 'Captain, the crew wants you to know — we don't follow you because you win. We follow you because you keep fighting.'", moraleEffect: 3, severity: "info", room: "captains_quarters", category: "social" },

  // ── Boss Mastery ──
  { id: "boss_kill_first", trigger: { type: "boss_kill", bossId: "", masteryLevel: 1 }, feedText: "Armory: [CREW_NAME] overheard the boss went down. 'First kill is the hardest. Every one after is just practice.'", moraleEffect: 5, severity: "info", room: "armory", category: "combat" },
  { id: "boss_mastery_5", trigger: { type: "boss_kill", bossId: "", masteryLevel: 5 }, feedText: "Trophy Room: The crew held a toast at shift change. [CREW_NAME] raised a glass: 'To the Captain, who kills things that should kill us.'", moraleEffect: 8, severity: "info", room: "trophy_room", category: "celebration" },
  { id: "boss_mastery_10", trigger: { type: "boss_kill", bossId: "", masteryLevel: 10 }, feedText: "Bridge: Mastery level 10. [CREW_NAME] updated the Ark's threat assessment: 'Hostile entities should consider alternative targets.' Elara approved the amendment.", moraleEffect: 12, severity: "info", room: "bridge", category: "celebration" },

  // ── Terminus Swarm ──
  { id: "terminus_wave_10", trigger: { type: "terminus_wave_cleared", wave: 10 }, feedText: "Armory: Wave 10 cleared. [CREW_NAME] ran diagnostics on the defense grid. 'Still holding. Barely.' The crew breathes easier.", moraleEffect: 5, severity: "info", room: "armory", category: "combat", roleFilter: "security" },
  { id: "terminus_wave_25", trigger: { type: "terminus_wave_cleared", wave: 25 }, feedText: "Bridge: Wave 25. [CREW_NAME] calculated the swarm density: 'That's more Thought Virus units than atoms in a small moon.' The crew stopped asking for updates.", moraleEffect: 8, severity: "info", room: "bridge", category: "combat", roleFilter: "scientist" },
  { id: "terminus_defeat", trigger: { type: "terminus_defeat" }, feedText: "Medical Bay: Terminus breached. [CREW_NAME] is triaging. [CREW_NAME] is reinforcing bulkheads. Nobody panicked. They've trained for this.", moraleEffect: -8, healthEffect: -5, severity: "alert", room: "medical_bay", category: "crisis" },

  // ── PvP / Rivals ──
  { id: "pvp_win", trigger: { type: "pvp_victory", isRival: false }, feedText: "Comms Array: [CREW_NAME] intercepted congratulations from the opposing Ark. Didn't relay them. 'They don't get to be gracious. We do.'", moraleEffect: 4, severity: "info", room: "comms_array", category: "combat" },
  { id: "pvp_rival_win", trigger: { type: "pvp_victory", isRival: true }, feedText: "Mess Hall: Your rival went down. [CREW_NAME] organized an impromptu celebration. Even the Security Officer cracked a smile.", moraleEffect: 10, severity: "info", room: "cargo_bay", category: "celebration" },
  { id: "pvp_rival_loss", trigger: { type: "pvp_defeat", isRival: true }, feedText: "Bridge: [CREW_NAME] quietly removed the rival's profile from the tactical display. 'We'll get them next time, Captain.' The crew nods.", moraleEffect: -6, severity: "warning", room: "bridge", category: "combat" },

  // ── Co-op Raids ──
  { id: "coop_victory", trigger: { type: "coop_raid_victory" }, feedText: "Armory: Raid complete. [CREW_NAME] distributed the salvage. [CREW_NAME] is already planning the next one. 'When can we go again?'", moraleEffect: 8, severity: "info", room: "armory", category: "celebration" },
  { id: "coop_wipe", trigger: { type: "coop_raid_wipe" }, feedText: "Medical Bay: Raid failed. [CREW_NAME] is treating injuries. [CREW_NAME] is writing after-action reports. The silence is heavier than usual.", moraleEffect: -10, healthEffect: -8, severity: "alert", room: "medical_bay", category: "crisis" },
];

const TIER_1_NPC: CrewReaction[] = [
  // ── Elara Trust ──
  { id: "elara_trust_high", trigger: { type: "npc_trust_gained", npcId: "elara", newTrust: 60 }, feedText: "Bridge: Something shifted. Elara's voice sounds warmer over the intercom. [CREW_NAME] noticed first: 'She's humming. Has she ever hummed before?' The ship feels lighter.", moraleEffect: 8, severity: "info", room: "bridge", category: "social" },
  { id: "elara_trust_low", trigger: { type: "npc_trust_lost", npcId: "elara", newTrust: 20 }, feedText: "Bridge: Elara's responses are clipped. Efficient. Cold. [CREW_NAME] asked what was wrong. 'Nothing is wrong. Everything is operating within parameters.' Nobody believed her.", moraleEffect: -10, severity: "warning", room: "bridge", category: "social" },

  // ── The Human ──
  { id: "human_trust_high", trigger: { type: "npc_trust_gained", npcId: "the_human", newTrust: 50 }, feedText: "Comms Array: The Human's substrate is warmer. [CREW_NAME] reported the Comms Array 'feels different.' Not hostile. Not safe. But... present.", moraleEffect: 5, severity: "info", room: "comms_array", category: "story" },

  // ── Source Trust ──
  { id: "source_trust_gained", trigger: { type: "npc_trust_gained", npcId: "the_source", newTrust: 30 }, feedText: "Medical Bay: [CREW_NAME] heard you're building trust with The Source. They locked the Medical Bay door and checked the quarantine seals. Twice.", moraleEffect: -3, severity: "warning", room: "medical_bay", category: "social" },

  // ── Shadow Tongue ──
  { id: "shadow_trust", trigger: { type: "npc_trust_gained", npcId: "shadow_tongue", newTrust: 30 }, feedText: "Engineering: [CREW_NAME] found text on their console that wasn't there before. It said 'THANK YOU.' They didn't feel thanked.", moraleEffect: -4, severity: "warning", room: "engineering", category: "story" },

  // ── NPC Gifts ──
  { id: "gift_to_npc", trigger: { type: "npc_gift_given", npcId: "" }, feedText: "Mess Hall: [CREW_NAME] overheard you gave a gift to an NPC. 'The Captain gives gifts? To THEM?' Brief jealousy. Then respect.", moraleEffect: 2, severity: "info", room: "cargo_bay", category: "social" },

  // ── Apprentice Events ──
  { id: "apprentice_recruited", trigger: { type: "apprentice_recruited" }, feedText: "Cryo Bay: New apprentice aboard. [CREW_NAME] sized them up from across the corridor. [CREW_NAME] offered them a cup of something warm. First impressions matter.", moraleEffect: 3, severity: "info", room: "cryo_bay", category: "social" },
  { id: "apprentice_graduated", trigger: { type: "apprentice_graduated" }, feedText: "Bridge: Apprentice graduation. The crew assembled without being asked. [CREW_NAME] saluted. [CREW_NAME] brought flowers grown from the hydroponics bay. Elara opened ship-wide comms for the announcement.", moraleEffect: 12, severity: "info", room: "bridge", category: "celebration" },
  { id: "apprentice_betrayed", trigger: { type: "apprentice_betrayed" }, feedText: "Armory: Betrayal. The word spread through the ship in minutes. [CREW_NAME] locked the weapons cache. [CREW_NAME] won't look anyone in the eye. Trust is a living thing, and it just took a wound.", moraleEffect: -15, loyaltyEffect: -8, severity: "critical", room: "armory", category: "crisis" },
  { id: "apprentice_died", trigger: { type: "apprentice_died" }, feedText: "Trophy Room: [CREW_NAME] added a name to the memorial wall. The crew held a minute of silence at shift change. Nobody ordered it. Nobody needed to.", moraleEffect: -12, severity: "alert", room: "trophy_room", category: "crisis" },

  // ── Breaking Point ──
  { id: "breaking_elara", trigger: { type: "breaking_point_triggered", choice: "elara" }, feedText: "Bridge: You chose Elara. The Human's substrate went dark. [CREW_NAME] felt the temperature drop in the Comms Array. Half the crew is relieved. Half is grieving. Everyone is changed.", moraleEffect: -5, loyaltyEffect: 10, severity: "critical", room: "bridge", category: "crisis" },
  { id: "breaking_human", trigger: { type: "breaking_point_triggered", choice: "human" }, feedText: "Comms Array: You chose The Human. Elara's holographic presence flickered — everywhere, all at once — and then became... less. [CREW_NAME] said the ship feels emptier. They're right.", moraleEffect: -5, loyaltyEffect: 10, severity: "critical", room: "comms_array", category: "crisis" },
];

const TIER_1_MORALITY: CrewReaction[] = [
  // ── Machine Path ──
  { id: "morality_machine_20", trigger: { type: "morality_shifted", direction: "machine", score: -20 }, feedText: "Engineering: [CREW_NAME] noticed the ship's systems run 3% more efficiently since your alignment shifted. They don't say anything. Efficiency doesn't require commentary.", moraleEffect: 2, severity: "info", room: "engineering", category: "moral" },
  { id: "morality_machine_60", trigger: { type: "morality_shifted", direction: "machine", score: -60 }, feedText: "Observation Deck: [CREW_NAME] hasn't visited the viewport in a week. 'What's the point of stars when everything is just data?' The Machine path changes people. Even the ones who didn't choose it.", moraleEffect: -5, severity: "warning", room: "observation_deck", category: "moral" },
  { id: "morality_machine_abyssal", trigger: { type: "morality_shifted", direction: "machine", score: -40 }, feedText: "Armory: The Abyssal crew members are... thriving. [CREW_NAME] (House Mol'Kari) said the Machine path 'feels like home.' That should concern you.", moraleEffect: 5, severity: "warning", room: "armory", category: "moral", bloodlineFilter: "blood_weave" },

  // ── Humanity Path ──
  { id: "morality_humanity_20", trigger: { type: "morality_shifted", direction: "humanity", score: 20 }, feedText: "Mess Hall: [CREW_NAME] organized a communal dinner. No reason. Just wanted to. The Humanity path is contagious.", moraleEffect: 5, severity: "info", room: "cargo_bay", category: "moral" },
  { id: "morality_humanity_60", trigger: { type: "morality_shifted", direction: "humanity", score: 60 }, feedText: "Observation Deck: [CREW_NAME] and [CREW_NAME] were found stargazing. 'We're naming the stars after crew members.' The Humanity path makes dreamers.", moraleEffect: 8, severity: "info", room: "observation_deck", category: "moral" },

  // ── Corruption ──
  { id: "corruption_tainted", trigger: { type: "corruption_tier_changed", tier: "tainted" }, feedText: "Medical Bay: [CREW_NAME] ran your latest bioscan. 'Captain... something's different. Your neural patterns are— I'm sure it's nothing.' They locked the results.", moraleEffect: -3, severity: "warning", room: "medical_bay", category: "moral" },
  { id: "corruption_corrupted", trigger: { type: "corruption_tier_changed", tier: "corrupted" }, feedText: "Bridge: The crew knows. They can feel it in the way you give orders. [CREW_NAME] flinched. [CREW_NAME] stood straighter — closer to the door. Corruption has a presence.", moraleEffect: -10, loyaltyEffect: -5, severity: "alert", room: "bridge", category: "crisis" },
  { id: "corruption_consumed", trigger: { type: "corruption_tier_changed", tier: "consumed" }, feedText: "Armory: [CREW_NAME] requisitioned a weapon. 'For personal defense.' They didn't say against what. Everyone knows.", moraleEffect: -20, loyaltyEffect: -15, severity: "critical", room: "armory", category: "crisis" },
  { id: "corruption_abyssal_thrives", trigger: { type: "corruption_tier_changed", tier: "corrupted" }, feedText: "Cryo Bay: The Abyssal bloodline crew are unaffected. No — not unaffected. STRENGTHENED. [CREW_NAME] (House Mol'Kari): 'The darkness feels like a warm bath.' The other crew members stay away from them now.", moraleEffect: 8, severity: "alert", room: "cryo_bay", category: "moral", bloodlineFilter: "blood_weave" },

  // ── Dark Ability Used ──
  { id: "dark_ability", trigger: { type: "dark_ability_used", abilityId: "" }, feedText: "Bridge: [CREW_NAME] saw you use it. The dark ability. They said nothing. But at dinner, they sat further away.", moraleEffect: -5, loyaltyEffect: -3, severity: "warning", room: "bridge", category: "moral" },
];

const TIER_1_LIVING_UNIVERSE: CrewReaction[] = [
  { id: "lu_necromancer_stirs", trigger: { type: "living_universe_event", eventId: "necromancer_stirs" }, feedText: "Medical Bay: Something stirred in the deep systems. [CREW_NAME] reported the incubators pulsed in unison for 0.7 seconds. The Resurrectionist: 'He is dreaming. When he stops dreaming, he wakes.'", moraleEffect: -8, severity: "alert", room: "medical_bay", category: "crisis" },
  { id: "lu_architect_strengthens", trigger: { type: "living_universe_event", eventId: "architect_strengthens" }, feedText: "Comms Array: Empire signal strength doubled overnight. [CREW_NAME] detected Architect surveillance drones at the edge of sensor range. The crew is tense.", moraleEffect: -6, severity: "alert", room: "comms_array", category: "crisis" },
  { id: "lu_dreamer_stirs", trigger: { type: "living_universe_event", eventId: "dreamer_stirs" }, feedText: "Observation Deck: Every crew member dreamed of the same thing last night. A golden shield. A voice saying: 'Soon.' [CREW_NAME] woke up crying. [CREW_NAME] woke up smiling. Same dream.", moraleEffect: 10, severity: "info", room: "observation_deck", category: "story" },
  { id: "lu_antiquarian_reveals", trigger: { type: "living_universe_event", eventId: "antiquarian_reveals" }, feedText: "Archives: The Antiquarian's terminal activated independently. Timeline data flooding in. [CREW_NAME] can't read it fast enough. 'There are other versions of us. Other Arks. Other choices.'", moraleEffect: 5, severity: "alert", room: "archives", category: "story", roleFilter: "scientist" },
  { id: "lu_terminus_accelerates", trigger: { type: "living_universe_event", eventId: "terminus_accelerates" }, feedText: "Bridge: Terminus expansion rate just increased 15%. [CREW_NAME] updated the threat board. The red zone is larger today. The crew doesn't look at the map anymore.", moraleEffect: -12, severity: "critical", room: "bridge", category: "crisis" },
  { id: "necro_phase_stirring", trigger: { type: "necromancer_phase_changed", phase: "stirring" }, feedText: "Cryo Bay: Incubator pods are running warmer. The Resurrectionist hasn't spoken in 6 hours. [CREW_NAME] (Medic) says the life support readings are 'wrong in a familiar way.'", moraleEffect: -5, severity: "warning", room: "cryo_bay", category: "crisis", roleFilter: "medic" },
  { id: "necro_phase_manifesting", trigger: { type: "necromancer_phase_changed", phase: "manifesting" }, feedText: "Medical Bay: He's HERE. The 10th Archon's presence fills the ship like a pressure change. [CREW_NAME] collapsed. [CREW_NAME] is praying to a god that might actually be listening. The Resurrectionist knelt.", moraleEffect: -20, healthEffect: -10, severity: "critical", room: "medical_bay", category: "crisis" },
  { id: "necro_phase_banished", trigger: { type: "necromancer_phase_changed", phase: "banished" }, feedText: "Bridge: It's over. The Necromancer is gone. [CREW_NAME] opened the observation deck viewport and stared at the stars for an hour. The ship feels lighter. The crew is hugging people they've never hugged.", moraleEffect: 20, severity: "info", room: "bridge", category: "celebration" },
];

/* ═══════════════════════════════════════════════════════
   TIER 2: MEDIUM-IMPACT REACTIONS
   Economy, Social/Guild, Story/Lore, Governance
   Crew notices these. They talk about them at dinner.
   ═══════════════════════════════════════════════════════ */

const TIER_2_ECONOMY: CrewReaction[] = [
  { id: "big_trade_profit", trigger: { type: "big_trade", profit: 500 }, feedText: "Trade Hub: [CREW_NAME] heard about your deal. 'Captain just made 500 credits in one transaction. Locke is either impressed or furious. Same thing with her.'", moraleEffect: 4, severity: "info", room: "trade_hub", category: "economic", roleFilter: "trader" },
  { id: "big_trade_huge", trigger: { type: "big_trade", profit: 2000 }, feedText: "Mess Hall: Your trade profits are legendary. [CREW_NAME] calculated the per-capita wealth increase: 'We're technically the richest Ark in the sector.' Morale through the roof.", moraleEffect: 8, severity: "info", room: "cargo_bay", category: "celebration" },
  { id: "craft_success_rare", trigger: { type: "crafting_success", rarity: "rare" }, feedText: "Engineering: [CREW_NAME] watched the rare craft come together. 'That's not luck. That's the Captain knowing which buttons to press.' They're showing the apprentices.", moraleEffect: 5, severity: "info", room: "engineering", category: "economic", roleFilter: "engineer" },
  { id: "craft_success_legendary", trigger: { type: "crafting_success", rarity: "legendary" }, feedText: "Engineering: LEGENDARY craft. [CREW_NAME] stopped mid-shift to applaud. The Engineer wanted to frame it. 'We're keeping one for the Trophy Room. Non-negotiable.'", moraleEffect: 10, severity: "info", room: "engineering", category: "celebration" },
  { id: "craft_failure", trigger: { type: "crafting_failure" }, feedText: "Engineering: Craft failed. [CREW_NAME] swept up the materials quietly. 'Happens to everyone, Captain. Even the Architect had prototypes.'", moraleEffect: -2, severity: "info", room: "engineering", category: "economic" },
  { id: "marketplace_sale", trigger: { type: "marketplace_sale", amount: 100 }, feedText: "Trade Hub: [CREW_NAME] logged the marketplace sale. 'Another transaction processed. The economy breathes because we breathe.'", moraleEffect: 2, severity: "info", room: "trade_hub", category: "economic" },
  { id: "lottery_win", trigger: { type: "lottery_win" }, feedText: "Trade Hub: YOU WON THE LOTTERY. [CREW_NAME] heard the notification. The mess hall erupted. Even the Quartermaster smiled. 'The universe owes us one. This is payment.'", moraleEffect: 12, severity: "info", room: "trade_hub", category: "celebration" },
];

const TIER_2_SOCIAL: CrewReaction[] = [
  { id: "guild_war_started", trigger: { type: "guild_war_started" }, feedText: "Armory: War declared. [CREW_NAME] began pre-combat checks. [CREW_NAME] distributed emergency rations. The ship goes from idle hum to battle frequency in under a minute.", moraleEffect: 3, severity: "alert", room: "armory", category: "combat" },
  { id: "guild_war_won", trigger: { type: "guild_war_won" }, feedText: "Bridge: WAR WON. [CREW_NAME] opened the observation deck for the victory celebration. [CREW_NAME] hung the enemy banner in the Trophy Room — upside down. Tradition.", moraleEffect: 15, severity: "info", room: "bridge", category: "celebration" },
  { id: "guild_war_lost", trigger: { type: "guild_war_lost" }, feedText: "Bridge: War lost. The crew is silent but not broken. [CREW_NAME] updated the tactical board. [CREW_NAME]: 'We lost a battle. Not the war. Never the war.' They mean it.", moraleEffect: -10, severity: "warning", room: "bridge", category: "combat" },
  { id: "guild_upgraded", trigger: { type: "guild_tier_upgraded", tier: 3 }, feedText: "Trade Hub: Syndicate tier upgraded. [CREW_NAME] organized a small ceremony. The Quartermaster opened the 'good' rations. 'We're building something here. Something that lasts.'", moraleEffect: 8, severity: "info", room: "trade_hub", category: "celebration" },
  { id: "donation_generous", trigger: { type: "donation_made", amount: 100 }, feedText: "Trade Hub: [CREW_NAME] noticed your donation to the guild. 'The Captain gives to the collective. That's... that's leadership.' The younger crew members took note.", moraleEffect: 5, severity: "info", room: "trade_hub", category: "social" },
  { id: "visitor_arrives", trigger: { type: "visitor_to_quarters" }, feedText: "Captain's Quarters: A visitor from another Ark toured your quarters. [CREW_NAME] cleaned up the corridor beforehand without being asked. Pride.", moraleEffect: 3, severity: "info", room: "captains_quarters", category: "social" },
];

const TIER_2_STORY: CrewReaction[] = [
  { id: "signal_intercepted", trigger: { type: "signal_intercepted" }, feedText: "Comms Array: New signal intercepted. [CREW_NAME] was first to decode the header. 'Captain, you need to hear this.' The Comms Array went quiet. Everyone was listening.", moraleEffect: 3, severity: "info", room: "comms_array", category: "story", roleFilter: "comms_officer" },
  { id: "loredex_50", trigger: { type: "loredex_discovery", entryCount: 50 }, feedText: "Archives: 50 Loredex entries. [CREW_NAME] mapped the connections on the conspiracy board. 'Captain, the patterns are forming. I don't like what they're showing.'", moraleEffect: 4, severity: "info", room: "archives", category: "story", roleFilter: "scientist" },
  { id: "loredex_100", trigger: { type: "loredex_discovery", entryCount: 100 }, feedText: "Archives: 100 entries. [CREW_NAME] hasn't slept in 30 hours. 'It's all connected. Everything. The Architect, the Fall, the Arks, US. We're not survivors, Captain. We're evidence.'", moraleEffect: 6, severity: "info", room: "archives", category: "story" },
  { id: "loredex_200", trigger: { type: "loredex_discovery", entryCount: 200 }, feedText: "Archives: 200 entries discovered. The Antiquarian's terminal displayed a single line: 'NOW you see.' [CREW_NAME] printed the full conspiracy board. It covers an entire wall.", moraleEffect: 8, severity: "alert", room: "archives", category: "story" },
  { id: "tome_read", trigger: { type: "tome_read", tomeId: "" }, feedText: "Archives: [CREW_NAME] asked what you read in the latest tome. When you told them, they went quiet for a long time. 'Some stories change the listener.'", moraleEffect: 2, severity: "info", room: "archives", category: "story" },
  { id: "transmission_watched", trigger: { type: "transmission_watched", episodeId: "" }, feedText: "Comms Array: [CREW_NAME] watched the transmission with you. The Meme's voice echoed through the Array. Afterward: 'I don't understand half of what he says. I believe all of it.'", moraleEffect: 3, severity: "info", room: "comms_array", category: "story" },
  { id: "conspiracy_connection", trigger: { type: "conspiracy_connection_made" }, feedText: "Bridge: [CREW_NAME] connected the dots before you did. They're standing at the conspiracy board, hand on a new thread: 'Captain. Look at this. It was here the whole time.'", moraleEffect: 5, severity: "info", room: "bridge", category: "story", roleFilter: "scientist" },
];

const TIER_2_GOVERNANCE: CrewReaction[] = [
  { id: "vote_cast", trigger: { type: "community_vote_cast" }, feedText: "Bridge: [CREW_NAME] noticed you voted. 'The Captain participates. That matters more than which way they voted.' The crew watches who shows up.", moraleEffect: 3, severity: "info", room: "bridge", category: "social" },
  { id: "vote_won", trigger: { type: "vote_outcome", voteId: "", won: true }, feedText: "Bridge: The vote went your way. [CREW_NAME] is relieved. [CREW_NAME] is already planning implementation. 'Democracy works. Slowly. Painfully. But it works.'", moraleEffect: 5, severity: "info", room: "bridge", category: "social" },
  { id: "vote_lost", trigger: { type: "vote_outcome", voteId: "", won: false }, feedText: "Bridge: The vote went the other way. [CREW_NAME] exhaled slowly. [CREW_NAME]: 'The people spoke. We listen. That's what separates us from the Architect.'", moraleEffect: -3, severity: "info", room: "bridge", category: "social" },
  { id: "daily_resource_shields", trigger: { type: "daily_resource_choice", choice: "shields" }, feedText: "Engineering: Power to shields. [CREW_NAME] in Engineering pulled on a third sweater. 'Shields are warm. The engine room is not.' No complaints filed. Yet.", moraleEffect: -1, severity: "info", room: "engineering", category: "social" },
  { id: "daily_resource_research", trigger: { type: "daily_resource_choice", choice: "research" }, feedText: "Archives: Power to research. [CREW_NAME] clapped. The lights in Engineering dimmed. [CREW_NAME] from Engineering sent a one-word message: 'Again?'", moraleEffect: 1, severity: "info", room: "archives", category: "social" },
];

/* ═══════════════════════════════════════════════════════
   TIER 3: FLAVOR REACTIONS
   Prestige, Music, Exploration, Specimens, Station, Epoch
   The quiet moments that accumulate into a living world.
   ═══════════════════════════════════════════════════════ */

const TIER_3_PROGRESSION: CrewReaction[] = [
  { id: "level_5", trigger: { type: "level_up", level: 5 }, feedText: "Bridge: Level 5. [CREW_NAME] attended your awakening ceremony. They stood at attention the entire time. Afterward: 'I served under a level 4 Captain yesterday. Today it's level 5. I can feel the difference.'", moraleEffect: 3, severity: "info", room: "bridge", category: "celebration" },
  { id: "level_10", trigger: { type: "level_up", level: 10 }, feedText: "Bridge: Level 10 — a witnessed awakening. The entire crew assembled on the Bridge. [CREW_NAME] organized the formation. Elara dimmed the lights. For a moment, every screen on the ship displayed your name.", moraleEffect: 8, severity: "info", room: "bridge", category: "celebration" },
  { id: "level_25", trigger: { type: "level_up", level: 25 }, feedText: "Bridge: Level 25. Threshold awakening. The Ark broadcast your achievement to every vessel in sensor range. [CREW_NAME] is recording the event for the Antiquarian's Chronicle. Other Arks sent congratulations. Even Locke sent a note: 'Adequate.'", moraleEffect: 15, severity: "info", room: "bridge", category: "celebration" },
  { id: "prestige_1", trigger: { type: "prestige_reset", prestigeLevel: 1 }, feedText: "Cryo Bay: You reset. The crew watched you step back into the incubator. [CREW_NAME] said goodbye. [CREW_NAME] said 'see you soon.' When you emerged, they were all waiting. 'Welcome back, Captain. Again.'", moraleEffect: 5, severity: "info", room: "cryo_bay", category: "meta" },
  { id: "prestige_3", trigger: { type: "prestige_reset", prestigeLevel: 3 }, feedText: "Bridge: Third prestige. [CREW_NAME] has started calling you 'the Eternal.' You told them to stop. They didn't. The Antiquarian added a note to his Chronicle: 'Three lives. Same soul. Interesting.'", moraleEffect: 8, severity: "info", room: "bridge", category: "meta" },
  { id: "achievement_unlocked", trigger: { type: "achievement_unlocked", achievementId: "" }, feedText: "Trophy Room: [CREW_NAME] polished your latest achievement trophy. Twice. Then adjusted the lighting. Then stood back and nodded. 'That one earned its place.'", moraleEffect: 2, severity: "info", room: "trophy_room", category: "celebration" },
  { id: "epoch_pass_25", trigger: { type: "epoch_pass_tier", tier: 25 }, feedText: "Bridge: Epoch Pass tier 25. [CREW_NAME] calculated your daily progress rate: 'At this pace, you'll complete the pass with time to spare. The crew appreciates a Captain who finishes what they start.'", moraleEffect: 3, severity: "info", room: "bridge", category: "meta" },
  { id: "epoch_pass_50", trigger: { type: "epoch_pass_tier", tier: 50 }, feedText: "Trophy Room: Epoch Pass COMPLETE. [CREW_NAME] organized a small celebration in the Trophy Room. Cake. Actual cake. Nobody asks where they got the ingredients.", moraleEffect: 8, severity: "info", room: "trophy_room", category: "celebration" },
];

const TIER_3_EXPLORATION: CrewReaction[] = [
  { id: "room_discovered", trigger: { type: "room_discovered", roomId: "" }, feedText: "Bridge: New room discovered. [CREW_NAME] requested assignment to the new area immediately. 'I want to be the first one to map it properly.' The Explorer's instinct.", moraleEffect: 5, severity: "info", room: "bridge", category: "exploration" },
  { id: "specimen_collected", trigger: { type: "specimen_collected", specimenId: "" }, feedText: "Cryo Bay: New specimen acquired. [CREW_NAME] pressed their face against the containment glass. 'It's beautiful. What does it eat? Can I name it?' The Resurrectionist: 'It eats void energy. No.'", moraleEffect: 4, severity: "info", room: "cryo_bay", category: "exploration" },
  { id: "specimen_lux", trigger: { type: "specimen_collected", specimenId: "lux" }, feedText: "Cryo Bay: Lux arrived. The Photon Fox's light filled the entire Cryo Bay. [CREW_NAME] reached out and Lux nuzzled their hand. Even the Security Officer smiled. 'Don't tell anyone I did that.'", moraleEffect: 8, severity: "info", room: "cryo_bay", category: "exploration" },
  { id: "specimen_spore", trigger: { type: "specimen_collected", specimenId: "spore" }, feedText: "Cryo Bay: Spore acquired. The Viral Symbiote. [CREW_NAME] backed away from the containment unit. [CREW_NAME] (House Mol'Kari) leaned IN. 'It understands what it means to be feared. I respect that.'", moraleEffect: -2, severity: "warning", room: "cryo_bay", category: "exploration", bloodlineFilter: "blood_weave" },
  { id: "quarantine_started", trigger: { type: "quarantine_started", roomId: "" }, feedText: "Medical Bay: Quarantine initiated. [CREW_NAME] sealed the bulkheads. [CREW_NAME] distributed emergency masks. The Medic's hands are steady. They've trained for this. 'Containment holding. Everyone breathe.'", moraleEffect: -8, severity: "alert", room: "medical_bay", category: "crisis", roleFilter: "medic" },
  { id: "quarantine_resolved", trigger: { type: "quarantine_resolved", roomId: "" }, feedText: "Medical Bay: Quarantine lifted. [CREW_NAME] unsealed the doors. Fresh air. Crew members stepped back into the corridor blinking. [CREW_NAME] hugged the Medic. 'Don't ever do that to us again.' The Medic: 'Blame the Virus, not me.'", moraleEffect: 8, severity: "info", room: "medical_bay", category: "celebration" },
];

const TIER_3_MUSIC: CrewReaction[] = [
  { id: "music_seeds", trigger: { type: "music_played", songId: "seeds_of_inception" }, feedText: "Observation Deck: 'Seeds of Inception' playing. [CREW_NAME] stopped mid-task and listened. 'This is the song that was playing when the Arks launched. Before any of us existed.' They listened to the whole thing.", moraleEffect: 3, severity: "info", room: "observation_deck", category: "story" },
  { id: "music_human", trigger: { type: "music_played", songId: "to_be_the_human" }, feedText: "Comms Array: 'To Be the Human' echoed through the Array. [CREW_NAME] said the substrate felt warmer. [CREW_NAME] said they heard someone crying inside the walls. The Human denies it.", moraleEffect: 2, severity: "info", room: "comms_array", category: "story" },
  { id: "music_family_tree", trigger: { type: "music_played", songId: "family_tree" }, feedText: "Captain's Quarters: 'Family Tree' playing. [CREW_NAME] found [CREW_NAME] looking at the bloodline registry. 'We're all family, aren't we? Cloned from the same archive. Different templates, same home.'", moraleEffect: 5, severity: "info", room: "captains_quarters", category: "social" },
  { id: "music_worthy", trigger: { type: "music_played", songId: "worthy" }, feedText: "Bridge: 'Worthy' resonated through the ship. [CREW_NAME] stood a little taller. The whole crew did. Some songs don't just play — they arrive.", moraleEffect: 6, severity: "info", room: "bridge", category: "celebration" },
  { id: "music_silence", trigger: { type: "music_played", songId: "silence_in_heaven" }, feedText: "Archives: 'Silence in Heaven.' The ship went quiet. Not silent — quiet. The difference matters. [CREW_NAME] closed their eyes. The Antiquarian's terminal pulsed once, softly, like a heartbeat.", moraleEffect: 4, severity: "info", room: "archives", category: "story" },
  { id: "doom_scroll", trigger: { type: "doom_scroll_read" }, feedText: "Mess Hall: [CREW_NAME] read the latest news feed. Hasn't spoken since. [CREW_NAME] took the datapad away. 'That's enough doom for today.' The Quartermaster rations information like food. Wisely.", moraleEffect: -2, severity: "info", room: "cargo_bay", category: "social" },
];

const TIER_3_STATION: CrewReaction[] = [
  { id: "station_upgraded", trigger: { type: "station_upgraded", tier: 3 }, feedText: "Engineering: Space station upgraded. [CREW_NAME] toured the new modules. 'Captain, this is bigger than my quarters. This is bigger than anyone's quarters. This is bigger than the Mess Hall.' Pride.", moraleEffect: 5, severity: "info", room: "engineering", category: "celebration" },
  { id: "station_raided", trigger: { type: "station_raided" }, feedText: "Bridge: Your station was raided. [CREW_NAME] slammed a fist on the console. 'We BUILD things. They TAKE things. That's the difference between us and them.' The Engineer is already calculating repairs.", moraleEffect: -8, severity: "alert", room: "bridge", category: "crisis" },
  { id: "station_visitor_good", trigger: { type: "station_visitor", rating: 5 }, feedText: "Captain's Quarters: Someone left a 5-star rating on your station. [CREW_NAME] beamed. 'We built that. WE built that.' They printed the review and pinned it in the Mess Hall.", moraleEffect: 4, severity: "info", room: "captains_quarters", category: "social" },
  { id: "station_visitor_bad", trigger: { type: "station_visitor", rating: 1 }, feedText: "Captain's Quarters: Someone left a 1-star rating. [CREW_NAME] read it aloud at dinner. The crew laughed. Then they redesigned the entryway out of spite.", moraleEffect: 2, severity: "info", room: "captains_quarters", category: "social" },
];

/* ═══════════════════════════════════════════════════════
   REACTION ENGINE — Resolves triggers to crew reactions
   ═══════════════════════════════════════════════════════ */

import { CADES_CREW_REACTIONS } from "@/data/cadesNarrativeIntegration";

/** Normalize room ids to the underscore form used by other reactions */
const CADES_REACTIONS_NORMALIZED: CrewReaction[] = CADES_CREW_REACTIONS.map(r => ({
  ...r,
  room: r.room.replace(/-/g, "_"),
}));

/** All reactions across all tiers */
export const ALL_CREW_REACTIONS: CrewReaction[] = [
  ...TIER_1_COMBAT,
  ...TIER_1_NPC,
  ...TIER_1_MORALITY,
  ...TIER_1_LIVING_UNIVERSE,
  ...TIER_2_ECONOMY,
  ...TIER_2_SOCIAL,
  ...TIER_2_STORY,
  ...TIER_2_GOVERNANCE,
  ...TIER_3_PROGRESSION,
  ...TIER_3_EXPLORATION,
  ...TIER_3_MUSIC,
  ...TIER_3_STATION,
  ...CADES_REACTIONS_NORMALIZED,
];

/** Find all matching reactions for a given trigger */
export function getReactionsForTrigger(
  trigger: CrewReactionTrigger,
  crewTraits: string[],
  crewRoles: string[],
  crewBloodlines: string[],
): CrewReaction[] {
  return ALL_CREW_REACTIONS.filter(r => {
    // Match trigger type
    if (r.trigger.type !== trigger.type) return false;

    // Match trigger-specific fields (loose matching — empty strings match anything)
    const rt = r.trigger as Record<string, unknown>;
    const tt = trigger as Record<string, unknown>;
    for (const key of Object.keys(rt)) {
      if (key === "type") continue;
      if (rt[key] !== undefined && rt[key] !== "" && rt[key] !== 0) {
        // Numeric thresholds: reaction fires if trigger value >= template value
        if (typeof rt[key] === "number" && typeof tt[key] === "number") {
          if ((tt[key] as number) < (rt[key] as number)) return false;
        } else if (tt[key] !== rt[key]) {
          return false;
        }
      }
    }

    // Filter by trait, role, bloodline
    if (r.traitFilter && !crewTraits.includes(r.traitFilter)) return false;
    if (r.roleFilter && !crewRoles.includes(r.roleFilter)) return false;
    if (r.bloodlineFilter && !crewBloodlines.includes(r.bloodlineFilter)) return false;

    return true;
  });
}

/** Pick the single best reaction for a trigger (highest morale magnitude) */
export function getBestReaction(
  trigger: CrewReactionTrigger,
  crewTraits: string[],
  crewRoles: string[],
  crewBloodlines: string[],
): CrewReaction | null {
  const matches = getReactionsForTrigger(trigger, crewTraits, crewRoles, crewBloodlines);
  if (matches.length === 0) return null;
  // Sort by absolute morale effect (most impactful first)
  matches.sort((a, b) => Math.abs(b.moraleEffect) - Math.abs(a.moraleEffect));
  return matches[0];
}

/** Fill crew names into a reaction's feed text */
export function fillReactionText(
  reaction: CrewReaction,
  crewNames: string[],
  playerName: string,
): string {
  let text = reaction.feedText;
  const shuffled = [...crewNames];
  // Simple deterministic shuffle based on reaction id
  shuffled.sort((a, b) => {
    const ha = reaction.id.length + a.charCodeAt(0);
    const hb = reaction.id.length + b.charCodeAt(0);
    return ha - hb;
  });
  let idx = 0;
  while (text.includes("[CREW_NAME]") && idx < shuffled.length) {
    text = text.replace("[CREW_NAME]", shuffled[idx]);
    idx++;
  }
  text = text.replace(/\[PLAYER_NAME\]/g, playerName);
  return text;
}

/** Apply a reaction's effects to crew morale/loyalty/health */
export interface ReactionEffects {
  moraleChange: number;
  loyaltyChange: number;
  healthChange: number;
  feedEntry: string;
  severity: "info" | "warning" | "alert" | "critical" | "celebration";
  room: string;
  category: string;
}

export function resolveReactionEffects(
  reaction: CrewReaction,
  crewNames: string[],
  playerName: string,
): ReactionEffects {
  return {
    moraleChange: reaction.moraleEffect,
    loyaltyChange: reaction.loyaltyEffect || 0,
    healthChange: reaction.healthEffect || 0,
    feedEntry: fillReactionText(reaction, crewNames, playerName),
    severity: reaction.severity,
    room: reaction.room,
    category: reaction.category,
  };
}

/* ─── AGGREGATE STATS ─── */

export const REACTION_STATS = {
  total: ALL_CREW_REACTIONS.length,
  tier1: TIER_1_COMBAT.length + TIER_1_NPC.length + TIER_1_MORALITY.length + TIER_1_LIVING_UNIVERSE.length,
  tier2: TIER_2_ECONOMY.length + TIER_2_SOCIAL.length + TIER_2_STORY.length + TIER_2_GOVERNANCE.length,
  tier3: TIER_3_PROGRESSION.length + TIER_3_EXPLORATION.length + TIER_3_MUSIC.length + TIER_3_STATION.length,
  categories: {
    combat: ALL_CREW_REACTIONS.filter(r => r.category === "combat").length,
    social: ALL_CREW_REACTIONS.filter(r => r.category === "social").length,
    economic: ALL_CREW_REACTIONS.filter(r => r.category === "economic").length,
    story: ALL_CREW_REACTIONS.filter(r => r.category === "story").length,
    moral: ALL_CREW_REACTIONS.filter(r => r.category === "moral").length,
    crisis: ALL_CREW_REACTIONS.filter(r => r.category === "crisis").length,
    celebration: ALL_CREW_REACTIONS.filter(r => r.category === "celebration").length,
    exploration: ALL_CREW_REACTIONS.filter(r => r.category === "exploration").length,
    meta: ALL_CREW_REACTIONS.filter(r => r.category === "meta").length,
  },
} as const;
