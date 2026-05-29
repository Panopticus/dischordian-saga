/* ═══════════════════════════════════════════════════════
   NARRATIVE FLAG REGISTRY — typed, owner-tagged catalogue

   Plan §E1. The codebase already had narrativeFlagAudit.test.ts
   detecting orphan *consumers* (gates with no producer). This
   adds the inverse direction: a typed catalogue of canonical
   *milestone* flags so consumers can read them by typed key
   (instead of stringly-typed bracket access), and a coverage
   test asserts every entry here is actually written somewhere
   in the codebase.

   Scope today: the act-gate / romance-commitment / prelude-beat
   spine — the ~30 flags story scenes most often gate against.
   Per-room mystery flags, per-companion small-talk flags, and
   the ~80 ad-hoc operational flags stay un-registered for now;
   the registry is meant to grow incrementally as systems read
   from it. Adding an entry here is intentionally cheap; the
   coverage test (apps/shared/flags/narrativeFlagRegistry.test.ts)
   will fail only if a registered flag has no producer in the
   tree.

   Conventions:
     • flag id matches the literal string passed to
       setNarrativeFlag(...) — no aliases.
     • owner names the act / system that mints the flag. Useful
       for finding the writer fast in code review.
     • category groups flags by the surface that gates against
       them so a UI/audit can list "every act-gate flag set so
       far" without scanning the whole tree.
     • notes are one short sentence on what the flag means in-
       universe — paste it into dialogue authoring without
       digging through the writer's source.
   ═══════════════════════════════════════════════════════ */

export type NarrativeFlagCategory =
  | "act_gate" // act-completion + start gates (Acts 1–7 + 4.5)
  | "act_branch" // act-internal branch outcomes (cycle A/B/C results)
  | "romance" // romance ladder commitments
  | "prelude" // pre-act-1 onboarding beats
  | "morality" // Order/Chaos high-level commitments
  | "companion" // companion-specific milestone / arc beats
  | "system_unlock"; // system-level feature unlocks (army, trade, etc.)

export interface NarrativeFlagEntry {
  flag: string;
  category: NarrativeFlagCategory;
  /** Origin act / system (e.g. "act_1", "prelude", "romance"). */
  owner: string;
  notes: string;
}

export const NARRATIVE_FLAG_REGISTRY: ReadonlyArray<NarrativeFlagEntry> = [
  /* ─── Act gates ─── */
  { flag: "act_1_complete", category: "act_gate", owner: "act_1", notes: "Act 1 narrative spine cleared." },
  { flag: "act_1_cycle_a_complete", category: "act_branch", owner: "act_1", notes: "Cycle A (Kindergarten of Gods) cleared." },
  { flag: "act_1_cycle_b_complete", category: "act_branch", owner: "act_1", notes: "Cycle B cleared." },
  { flag: "act_1_cycle_c_complete", category: "act_branch", owner: "act_1", notes: "Cycle C cleared." },
  { flag: "act_2_started", category: "act_gate", owner: "act_2", notes: "Act 2 has begun." },
  { flag: "act_2_complete", category: "act_gate", owner: "act_2", notes: "Act 2 cleared; Trade Empire now unlocked." },
  { flag: "act_3_starting", category: "act_gate", owner: "act_3", notes: "Act 3 transition state." },
  { flag: "act_3_complete", category: "act_gate", owner: "act_3", notes: "Act 3 cleared." },
  { flag: "act_4_started", category: "act_gate", owner: "act_4", notes: "Act 4 has begun." },
  { flag: "act_4_complete", category: "act_gate", owner: "act_4", notes: "Act 4 cleared." },
  { flag: "act_4_5_started", category: "act_gate", owner: "act_4_5", notes: "Optional Act 4.5 (Dead Man's Circuit) has begun." },
  { flag: "act_4_5_complete", category: "act_gate", owner: "act_4_5", notes: "Optional Act 4.5 cleared." },
  { flag: "act_5_started", category: "act_gate", owner: "act_5", notes: "Act 5 has begun." },
  { flag: "act_5_complete", category: "act_gate", owner: "act_5", notes: "Act 5 cleared." },
  { flag: "act_6_started", category: "act_gate", owner: "act_6", notes: "Act 6 has begun." },
  { flag: "act_6_complete", category: "act_gate", owner: "act_6", notes: "Act 6 cleared." },
  { flag: "act_7_started", category: "act_gate", owner: "act_7", notes: "Act 7 has begun." },
  { flag: "act_7_complete", category: "act_gate", owner: "act_7", notes: "Act 7 cleared." },
  { flag: "narrative_spine_complete", category: "act_gate", owner: "act_7", notes: "Full 7-act spine cleared." },

  /* ─── Act 1 closing branch ─── */
  { flag: "act1_closing_choice_made", category: "act_branch", owner: "act_1", notes: "Player has committed an Act 1 closing choice." },

  /* ─── Morality high-water marks ─── */
  { flag: "vortex_endgame_light_variant", category: "morality", owner: "act_7", notes: "Endgame committed to light path." },
  { flag: "vortex_endgame_dark_variant", category: "morality", owner: "act_7", notes: "Endgame committed to dark path." },

  /* ─── Companion / bond milestones ─── */
  { flag: "bond_80_mutual_peak", category: "companion", owner: "narrative_integration", notes: "Both narrators reached trust 80." },
  { flag: "human_dark_confession_unlocked", category: "companion", owner: "the_human", notes: "The Human's dark confession is available." },
  { flag: "elara_high_confession_unlocked", category: "companion", owner: "elara", notes: "Elara's high-trust confession is available." },
  { flag: "kael_questline_complete", category: "companion", owner: "kael", notes: "Kael's questline cleared." },
  { flag: "act6_elara_confession_heard", category: "companion", owner: "act_6", notes: "Player heard Elara's Act 6 confession (the woman she was). Producer: Act6CardLadderPage.tsx. Gates the Act 6 'woman she was' mirror match + Act 7 convergence callback." },
  { flag: "act6_human_confession_heard", category: "companion", owner: "act_6", notes: "Player heard the Human's Act 6 confession (the detective in the wall). Producer: Act6CardLadderPage.tsx. Gates the Act 6 'detective in the wall' mirror match + Act 7 convergence callback." },

  /* ─── System unlocks ─── */
  { flag: "trade_empire_unlocked", category: "system_unlock", owner: "act_2", notes: "Trade Empire game mode is now available." },
  { flag: "act4_army_unlocked", category: "system_unlock", owner: "act_4", notes: "Army management is now available." },
  { flag: "starter_pack_claimed", category: "system_unlock", owner: "narrative_integration", notes: "Starter pack has been claimed once." },
  { flag: "crafting_mastered", category: "system_unlock", owner: "narrative_integration", notes: "Crafting subsystem mastery threshold reached." },
  { flag: "chess_mastered", category: "system_unlock", owner: "narrative_integration", notes: "Chess subsystem mastery threshold reached." },

  /* ─── Prelude beats ─── */
  { flag: "prelude_beat_c_role_chosen", category: "prelude", owner: "prelude", notes: "Player chose a class role at Beat C." },
  { flag: "prelude_beat_f_memo_read", category: "prelude", owner: "prelude", notes: "Player read the biometric-lockbox memo at Beat F." },

  /* ─── Forgiveness sub-arc ─── */
  { flag: "forgiveness_choice_made", category: "act_branch", owner: "act_1", notes: "Player committed a forgiveness choice." },
  { flag: "lyra_vox_unlocked", category: "system_unlock", owner: "act_1", notes: "Lyra Vox NPC unlocked via forgiveness path." },

  /* ─── Discovery-gate sheet — mech_* tutor flags ─────────────
     Producers: apps/shared/flags/mechTutorFlagProducers.ts
     Consumers: apps/client/src/pages/CharacterSheetPage.tsx
                (panel-level visibility gates) and
                apps/shared/mechanicSystemTutors.ts (tutor cards).
     ─────────────────────────────────────────────────────────── */
  { flag: "mech_crafting_intro_seen", category: "system_unlock", owner: "mech_crafting", notes: "Crafting Engineer's-Log audio intro has been delivered." },
  { flag: "mech_crafting_tutor_seen", category: "system_unlock", owner: "mech_crafting", notes: "Crafting tutor card dismissed; bench panel now revealed on the sheet." },
  { flag: "mech_dream_substrate_intro_seen", category: "system_unlock", owner: "mech_dream_substrate", notes: "Dream Substrate Engineer's-Log audio intro has been delivered." },
  { flag: "mech_dream_substrate_tutor_seen", category: "system_unlock", owner: "mech_dream_substrate", notes: "Dream Substrate tutor card dismissed; reserves panel now revealed." },
  { flag: "mech_respec_intro_seen", category: "system_unlock", owner: "mech_respec", notes: "Neural Respec Engineer's-Log audio intro has been delivered." },
  { flag: "mech_respec_tutor_seen", category: "system_unlock", owner: "mech_respec", notes: "Neural Respec tutor card dismissed; respec button now revealed on the sheet." },
  { flag: "mech_prestige_intro_seen", category: "system_unlock", owner: "mech_prestige", notes: "The Degen has delivered the prestige multiverse cinematic." },
  { flag: "mech_prestige_tutor_seen", category: "system_unlock", owner: "mech_prestige", notes: "Prestige tutor card dismissed; security clearance panel now revealed." },
  { flag: "mech_morality_intro_seen", category: "system_unlock", owner: "mech_morality", notes: "The Human's morality cinematic has played at the Act 1 closing branch." },
  { flag: "mech_morality_tutor_seen", category: "system_unlock", owner: "mech_morality", notes: "Morality tutor card dismissed; alignment panel now revealed on the sheet." },
  { flag: "mech_breeding_intro_seen", category: "system_unlock", owner: "mech_breeding", notes: "Elara has introduced the Inception Ark's Collector-restoration mandate at Act 3 open." },
  { flag: "mech_breeding_tutor_seen", category: "system_unlock", owner: "mech_breeding", notes: "Breeding tutor card dismissed; bloodline registry surfaces unlocked." },
  { flag: "mech_colony_commerce_intro_seen", category: "system_unlock", owner: "mech_colony_commerce", notes: "Veska has introduced colony-ship commerce as a handoff from breeding." },
  { flag: "mech_colony_commerce_tutor_seen", category: "system_unlock", owner: "mech_colony_commerce", notes: "Colony commerce tutor card dismissed; founding lanes now eligible at the hangar." },
  { flag: "mech_demon_pacts_intro_seen", category: "system_unlock", owner: "mech_demon_pacts", notes: "Game Master Recording #1 (Advocate / Blood Weave) has been discovered in the Matrix-of-Dreams." },
  { flag: "mech_demon_pacts_tutor_seen", category: "system_unlock", owner: "mech_demon_pacts", notes: "Demon pacts tutor card dismissed; pact ledger surface unlocked." },

  /* ─── audit/16 PR 3 — casino-floor narrative bridge ───
     These flags fire from the casino quest-progression service when
     a meaningful casino milestone lands. Variant resolver
     (audit/10 wiring) picks them up automatically; companion
     dialogue + Degen NPC line variants gate against them. */
  { flag: "casino_first_jackpot_witnessed", category: "companion", owner: "casino", notes: "Player has witnessed (or hit) a progressive jackpot for the first time. Unlocks a Degen reaction line." },
  { flag: "casino_streak_5_hit",            category: "companion", owner: "casino", notes: "Player has hit a 5-win casino streak. Degen acknowledges; companions tease." },
  { flag: "casino_centurion",               category: "companion", owner: "casino", notes: "Player won 100 casino games this season. Unlocks the seasonal title + dedicated Degen ask-topic." },
  { flag: "casino_tale_collector",          category: "companion", owner: "casino", notes: "Player collected 10 Tales of the Tables this season. The Degen tells one story unprompted." },
  { flag: "casino_degen_favor_25",          category: "companion", owner: "casino", notes: "Degen's Favor crossed 25 — the Degen smiles for the first time." },
  { flag: "casino_degen_favor_50",          category: "companion", owner: "casino", notes: "Degen's Favor crossed 50 — the Degen tells a story between hands." },
  { flag: "casino_degen_favor_75",          category: "companion", owner: "casino", notes: "Degen's Favor crossed 75 — the Degen sits down at your table uninvited." },
  { flag: "casino_degen_favor_100",         category: "companion", owner: "casino", notes: "Degen's Favor maxed (Equilibrium Touched). The chair at the corner table is yours." },

  /* ─── Expansion-cutscene flags (NEW_CUTSCENES_67.zip) ─────
     Producers in apps/shared/flags/expansionCutsceneFlagProducers.ts.
     Consumers in apps/shared/roomCutscenes/roomCutsceneTriggers.ts.
     Game-event handlers (forge service, doctrine handler, mission
     flow, etc.) call the matching fire*() helper when the in-world
     event happens; the dispatcher then surfaces the corresponding
     cutscene via <CinematicGate>.
     ───────────────────────────────────────────────────────── */
  { flag: "berth_sleep_initiated", category: "system_unlock", owner: "berth_arc", notes: "Player triggered sleep in their apprentice berth." },
  { flag: "berth_wake_morning", category: "system_unlock", owner: "berth_arc", notes: "Berth wake-up cutscene event queued." },
  { flag: "berth_visitor_arrived", category: "system_unlock", owner: "berth_arc", notes: "A visitor has arrived at the berth." },
  { flag: "berth_nightmare_triggered", category: "system_unlock", owner: "berth_arc", notes: "Player's berth-sleep transitioned into a nightmare beat." },
  { flag: "cohort_bonding_threshold", category: "companion", owner: "cohort_park", notes: "Cohort bonding crossed the cohort-park threshold." },
  { flag: "cohort_training_complete", category: "companion", owner: "cohort_park", notes: "Cohort training session marked complete." },
  { flag: "cohort_argument_erupted", category: "companion", owner: "cohort_park", notes: "Cohort argument event has erupted." },
  { flag: "cohort_member_departed", category: "companion", owner: "cohort_park", notes: "A cohort member has departed." },
  { flag: "comm_archon_calling", category: "system_unlock", owner: "comm_screen", notes: "An Archon is calling on the comm screen." },
  { flag: "comm_warden_tapping", category: "system_unlock", owner: "comm_screen", notes: "A Warden is tapping the comm channel." },
  { flag: "comm_mourning_call", category: "system_unlock", owner: "comm_screen", notes: "Mourning-wall call queued on the comm screen." },
  { flag: "comm_doctrine_recital_aired", category: "system_unlock", owner: "comm_screen", notes: "Doctrine recitation aired on the comm." },
  { flag: "comm_cohort_banter_open", category: "system_unlock", owner: "comm_screen", notes: "Cohort-banter channel opened on the comm." },
  { flag: "doctrine_recitation_active", category: "act_branch", owner: "doctrine_binding_arc", notes: "Doctrine recitation ceremony is currently active." },
  { flag: "doctrine_choice_comply", category: "act_branch", owner: "doctrine_binding_arc", notes: "Player committed the comply branch in the doctrine-binding arc." },
  { flag: "doctrine_choice_heretical", category: "act_branch", owner: "doctrine_binding_arc", notes: "Player committed the heretical branch in the doctrine-binding arc." },
  { flag: "doctrine_fork_chosen", category: "act_branch", owner: "doctrine_binding_arc", notes: "Player selected a forked path in the doctrine arc." },
  { flag: "doctrine_cold_hand_witnessed", category: "act_branch", owner: "doctrine_binding_arc", notes: "Player witnessed the cold-hand doctrine sequence." },
  { flag: "doctrine_human_remainder_revealed", category: "act_branch", owner: "doctrine_binding_arc", notes: "Doctrine arc revealed the human-remainder twist." },
  { flag: "forge_first_card_minted", category: "system_unlock", owner: "forge_service", notes: "Player minted their first card at the Forge." },
  { flag: "forge_craft_failed", category: "system_unlock", owner: "forge_service", notes: "A Forge craft attempt failed." },
  { flag: "forge_card_upgraded", category: "system_unlock", owner: "forge_service", notes: "A card was upgraded at the Forge." },
  { flag: "forge_card_corrupted", category: "system_unlock", owner: "forge_service", notes: "A card was corrupted at the Forge." },
  { flag: "forge_card_purified", category: "system_unlock", owner: "forge_service", notes: "A card was purified at the Forge." },
  { flag: "glass_archon_summoned", category: "system_unlock", owner: "guild_arc", notes: "Glass Archon has been summoned for dialogue." },
  { flag: "guild_blood_first_visit", category: "system_unlock", owner: "guild_arc", notes: "Player's first visit to the Blood guild common-room." },
  { flag: "guild_bone_first_visit", category: "system_unlock", owner: "guild_arc", notes: "Player's first visit to the Bone guild common-room." },
  { flag: "guild_cipher_first_visit", category: "system_unlock", owner: "guild_arc", notes: "Player's first visit to the Cipher guild common-room." },
  { flag: "guild_dust_first_visit", category: "system_unlock", owner: "guild_arc", notes: "Player's first visit to the Dust guild common-room." },
  { flag: "guild_song_first_visit", category: "system_unlock", owner: "guild_arc", notes: "Player's first visit to the Song guild common-room." },
  { flag: "guild_storm_first_visit", category: "system_unlock", owner: "guild_arc", notes: "Player's first visit to the Storm guild common-room." },
  { flag: "guild_thread_first_visit", category: "system_unlock", owner: "guild_arc", notes: "Player's first visit to the Thread guild common-room." },
  { flag: "guild_tide_first_visit", category: "system_unlock", owner: "guild_arc", notes: "Player's first visit to the Tide guild common-room." },
  { flag: "guild_vine_first_visit", category: "system_unlock", owner: "guild_arc", notes: "Player's first visit to the Vine guild common-room." },
  { flag: "audit_day7_zealot_active", category: "act_branch", owner: "mechronis_audit", notes: "Day-7 Zealot audit-Hellbox segment is active." },
  { flag: "audit_day14_heretic_active", category: "act_branch", owner: "mechronis_audit", notes: "Day-14 Heretic audit-Hellbox segment is active." },
  { flag: "audit_day14_scholar_active", category: "act_branch", owner: "mechronis_audit", notes: "Day-14 Scholar audit-Hellbox segment is active." },
  { flag: "audit_day21_martyr_active", category: "act_branch", owner: "mechronis_audit", notes: "Day-21 Martyr audit-Hellbox segment is active." },
  { flag: "audit_day21_warden_active", category: "act_branch", owner: "mechronis_audit", notes: "Day-21 Warden audit-Hellbox segment is active (parallel to Martyr branch)." },
  { flag: "audit_verdict_mercy", category: "act_branch", owner: "mechronis_audit", notes: "Audit-Hellbox verdict resolved on the Mercy outcome." },
  { flag: "audit_verdict_purge", category: "act_branch", owner: "mechronis_audit", notes: "Audit-Hellbox verdict resolved on the Purge outcome." },
  { flag: "memory_card_minted", category: "system_unlock", owner: "memory_card_library", notes: "Player minted a memory card at the Memory Library." },
  { flag: "memory_card_released", category: "system_unlock", owner: "memory_card_library", notes: "A memory card was released from the Memory Library." },
  { flag: "memory_card_corrupted", category: "system_unlock", owner: "memory_card_library", notes: "A memory card became corrupted." },
  { flag: "memory_card_inherited", category: "system_unlock", owner: "memory_card_library", notes: "A memory card was inherited." },
  { flag: "warden_purge_notice_received", category: "act_branch", owner: "wardens_dock", notes: "Player received the Warden purge notice at Warden's Dock." },
  { flag: "warden_choice_comply", category: "act_branch", owner: "wardens_dock", notes: "Player chose to comply with the Warden's purge notice." },
  { flag: "warden_choice_resist", category: "act_branch", owner: "wardens_dock", notes: "Player chose to resist the Warden's purge notice." },
  { flag: "warden_choice_escape", category: "act_branch", owner: "wardens_dock", notes: "Player chose to escape rather than comply or resist." },

  /* ─── Chess cutscene flags (chess roster wiring) ───
     Producers in apps/shared/flags/chessCutsceneFlagProducers.ts.
     Consumers in apps/shared/roomCutscenes/roomCutsceneTriggers.ts.
     Chess router + tutorial gate-enter + Climb-tier-accept call the
     matching fire*() helper when the in-world event happens; dispatcher
     then surfaces the corresponding cutscene via <CinematicGate>.
     ───────────────────────────────────────────────────────── */
  { flag: "chess_tutorial_g1_started", category: "system_unlock", owner: "chess_tutorial", notes: "Player entered Gate 1 (The Board and the Pieces) — Celebration GM intro fires." },
  { flag: "chess_tutorial_g2_started", category: "system_unlock", owner: "chess_tutorial", notes: "Player entered Gate 2 (Check, Checkmate, Stalemate)." },
  { flag: "chess_tutorial_g3_started", category: "system_unlock", owner: "chess_tutorial", notes: "Player entered Gate 3 (Special Moves)." },
  { flag: "chess_tutorial_g4_started", category: "system_unlock", owner: "chess_tutorial", notes: "Player entered Gate 4 (Opening Principles)." },
  { flag: "chess_tutorial_g4_5_started", category: "system_unlock", owner: "chess_tutorial", notes: "Player entered Gate 4.5 (The Prince's Game side gate)." },
  { flag: "chess_tutorial_g5_started", category: "system_unlock", owner: "chess_tutorial", notes: "Player entered Gate 5 (Basic Tactics)." },
  { flag: "chess_tutorial_g5_5_started", category: "system_unlock", owner: "chess_tutorial", notes: "Player entered Gate 5.5 (Opera Game / Engineer's Notebook side gate)." },
  { flag: "chess_tutorial_g6_started", category: "system_unlock", owner: "chess_tutorial", notes: "Player entered Gate 6 (Basic Endgames)." },
  { flag: "chess_tutorial_g7_started", category: "system_unlock", owner: "chess_tutorial", notes: "Player entered Gate 7 (Strategic Thinking)." },
  { flag: "chess_ladder_the_human_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from The Human — story ladder #1." },
  { flag: "chess_ladder_the_collector_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from The Collector — story ladder #2." },
  { flag: "chess_ladder_iron_lion_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from Iron Lion — story ladder #3." },
  { flag: "chess_ladder_the_enigma_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from The Enigma — story ladder #4." },
  { flag: "chess_ladder_the_warlord_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from The Warlord — story ladder #5." },
  { flag: "chess_ladder_the_oracle_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from The Oracle — story ladder #6." },
  { flag: "chess_ladder_the_necromancer_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from The Necromancer — story ladder #7 (Win 10 ranked)." },
  { flag: "chess_ladder_the_programmer_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from The Programmer — story ladder #8 (Silver tier)." },
  { flag: "chess_ladder_agent_zero_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from Agent Zero — story ladder #9 (Gold tier)." },
  { flag: "chess_ladder_the_source_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from The Source — story ladder #10 (Diamond tier)." },
  { flag: "chess_ladder_game_master_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from The Game Master — story ladder finale (GM tier 2400+)." },
  { flag: "chess_ladder_the_architect_first_seated", category: "system_unlock", owner: "chess_ladder", notes: "First seated across from The Architect — hidden roster entry." },
  { flag: "chess_climb_tier_0_entered", category: "system_unlock", owner: "chess_climb", notes: "Entered Chess Climb Tier 0 (Exhibition — corrupted GM, free play)." },
  { flag: "chess_climb_tier_1_entered", category: "system_unlock", owner: "chess_climb", notes: "Entered Chess Climb Tier 1 (Wagered — ELO at stake)." },
  { flag: "chess_climb_tier_2_entered", category: "system_unlock", owner: "chess_climb", notes: "Entered Chess Climb Tier 2 (Hierarchy Table — 24h lockout / consumable mint)." },
  { flag: "chess_climb_tier_3_entered", category: "system_unlock", owner: "chess_climb", notes: "Entered Chess Climb Tier 3 (Labyrinth Wager — Mol'Garath at the audience)." },
];

/* ─── Helpers ─── */

const FLAG_BY_KEY = new Map(NARRATIVE_FLAG_REGISTRY.map((e) => [e.flag, e]));

export function getFlagEntry(flag: string): NarrativeFlagEntry | undefined {
  return FLAG_BY_KEY.get(flag);
}

export function isRegisteredFlag(flag: string): boolean {
  return FLAG_BY_KEY.has(flag);
}

export function listRegisteredFlags(): string[] {
  return NARRATIVE_FLAG_REGISTRY.map((e) => e.flag);
}

export function listFlagsByCategory(category: NarrativeFlagCategory): NarrativeFlagEntry[] {
  return NARRATIVE_FLAG_REGISTRY.filter((e) => e.category === category);
}

export function listFlagsByOwner(owner: string): NarrativeFlagEntry[] {
  return NARRATIVE_FLAG_REGISTRY.filter((e) => e.owner === owner);
}
