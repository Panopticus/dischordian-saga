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
