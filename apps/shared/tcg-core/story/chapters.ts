/**
 * Campaign chapter encounters — Season One.
 *
 * Maps the 14 client-side story chapters (storyModeChapters.ts) to
 * StoryEncounter format for the TCG engine. Each encounter defines
 * the boss's faction, deck, AI behavior hooks, and custom win/lose
 * conditions.
 *
 * Chapter content lives client-side; this file is the server/engine
 * bridge that creates playable matches from story chapters.
 */
import type { StoryEncounter } from "./encounter";

/* ─── Difficulty → Boss HP scale ─── */

export const DIFFICULTY_HP_SCALE: Record<string, number> = {
  easy: 20,
  normal: 25,
  hard: 30,
  nightmare: 40,
};

/* ─── Helper ─── */

function bossDeck(prefix: string): readonly string[] {
  return Array.from({ length: 39 }, (_, i) => `${prefix}_${i}`);
}

/* ═══════════════════════════════════════════════════════
   CHAPTERS 1-12 (including branches 3a/3b, 9a/9b)
   ═══════════════════════════════════════════════════════ */

const ch1: StoryEncounter = {
  id: "ch1_dead_signal",
  chapterId: "ch1",
  name: "The Dead Signal",
  description: "Agent Zero hacked the scheduling matrix to reach you first.",
  bossFaction: "insurgency",
  bossGeneralDefId: "gen_insurgency",
  bossDeckCardDefIds: bossDeck("boss_ch1"),
  seed: "ch1_dead_signal_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch1_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "Subject Zero. Cameras cycle every 43 seconds. I have 31. FIGHT me." },
    },
    {
      id: "ch1_low",
      once: true,
      condition: { kind: "boss_hp_below", percent: 40 },
      action: { kind: "boss_taunt", text: "Combat pattern Alpha-7-Violet. Confirmed. You fight like him." },
    },
  ],
  preMatchDialog: "dialog_ch1_pre",
  postMatchWinDialog: "dialog_ch1_win",
  postMatchLossDialog: "dialog_ch1_loss",
};

const ch2: StoryEncounter = {
  id: "ch2_arenas_law",
  chapterId: "ch2",
  name: "The Arena's Law",
  description: "A skull in green robes enforces the rotation.",
  bossFaction: "panopticon",
  bossGeneralDefId: "gen_panopticon",
  bossDeckCardDefIds: bossDeck("boss_ch2"),
  seed: "ch2_arenas_law_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch2_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "Designation: Subject Zero. You survived. That puts you in the rotation." },
    },
    {
      id: "ch2_half",
      once: true,
      condition: { kind: "boss_hp_below", percent: 50 },
      action: { kind: "boss_taunt", text: "Your voice sounds like mine. Auditory matching. Side effect." },
    },
    {
      id: "ch2_low",
      once: true,
      condition: { kind: "boss_hp_below", percent: 25 },
      action: { kind: "play_dialog", dialogId: "ch2_jailer_reveal" },
    },
  ],
  preMatchDialog: "dialog_ch2_pre",
  postMatchWinDialog: "dialog_ch2_win",
  postMatchLossDialog: "dialog_ch2_loss",
};

const ch3a: StoryEncounter = {
  id: "ch3a_generals_honor",
  chapterId: "ch3a",
  name: "The General's Honor",
  description: "Iron Lion salutes you as a commander.",
  bossFaction: "new_babylon",
  bossGeneralDefId: "gen_new_babylon",
  bossDeckCardDefIds: bossDeck("boss_ch3a"),
  seed: "ch3a_generals_honor_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch3a_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "The one Zero flagged. She doesn't flag anyone." },
    },
    {
      id: "ch3a_respect",
      once: true,
      condition: { kind: "boss_hp_below", percent: 50 },
      action: { kind: "boss_taunt", text: "You fight with a general's discipline. The Oracle's war stance." },
    },
  ],
  preMatchDialog: "dialog_ch3a_pre",
  postMatchWinDialog: "dialog_ch3a_win",
  postMatchLossDialog: "dialog_ch3a_loss",
};

const ch3b: StoryEncounter = {
  id: "ch3b_ghosts_gambit",
  chapterId: "ch3b",
  name: "The Ghost's Gambit",
  description: "Wraith Calder — seven deaths and still standing.",
  bossFaction: "insurgency",
  bossGeneralDefId: "gen_insurgency",
  bossDeckCardDefIds: bossDeck("boss_ch3b"),
  seed: "ch3b_ghosts_gambit_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch3b_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "Seven times I've died. Each time I came back knowing more about what the Arena does to your DNA." },
    },
    {
      id: "ch3b_low",
      once: true,
      condition: { kind: "boss_hp_below", percent: 30 },
      action: { kind: "boss_taunt", text: "Death number eight. I'll be back. Will you?" },
    },
  ],
  preMatchDialog: "dialog_ch3b_pre",
  postMatchWinDialog: "dialog_ch3b_win",
  postMatchLossDialog: "dialog_ch3b_loss",
};

const ch4: StoryEncounter = {
  id: "ch4_red_death",
  chapterId: "ch4",
  name: "The Red Death",
  description: "Akai Shi — the assassin who kills with a whisper.",
  bossFaction: "antiquarian",
  bossGeneralDefId: "gen_antiquarian",
  bossDeckCardDefIds: bossDeck("boss_ch4"),
  seed: "ch4_red_death_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch4_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "The Red Death does not negotiate. It arrives." },
    },
    {
      id: "ch4_stealth",
      once: true,
      condition: { kind: "turn_reached", turn: 4 },
      action: { kind: "boss_taunt", text: "You cannot hit what you cannot see. The whisper is already behind you." },
    },
    {
      id: "ch4_low",
      once: true,
      condition: { kind: "boss_hp_below", percent: 25 },
      action: { kind: "boss_taunt", text: "A worthy opponent. The whisper speaks your name with respect." },
    },
  ],
  preMatchDialog: "dialog_ch4_pre",
  postMatchWinDialog: "dialog_ch4_win",
  postMatchLossDialog: "dialog_ch4_loss",
};

const ch5: StoryEncounter = {
  id: "ch5_dead_code_rising",
  chapterId: "ch5",
  name: "Dead Code Rising",
  description: "The Necromancer — mandatory death and resurrection.",
  bossFaction: "thought_virus",
  bossGeneralDefId: "gen_thought_virus",
  bossDeckCardDefIds: bossDeck("boss_ch5"),
  seed: "ch5_dead_code_rising_seed",
  // Mandatory loss — the player must die and be resurrected.
  winConditions: [{ kind: "survive_turns", turns: 8 }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch5_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "Death is not an ending, Subject Zero. It is a compile error. I fix those." },
    },
    {
      id: "ch5_death",
      once: true,
      condition: { kind: "player_hp_below", percent: 20 },
      action: { kind: "show_cinematic", cinematicId: "ch5_death_resurrection" },
    },
    {
      id: "ch5_resurrect",
      once: true,
      condition: { kind: "turn_reached", turn: 6 },
      action: { kind: "boss_taunt", text: "You're already dead. The question is whether the dead code compiles into something useful." },
    },
  ],
  preMatchDialog: "dialog_ch5_pre",
  postMatchWinDialog: "dialog_ch5_win",
  postMatchLossDialog: "dialog_ch5_loss",
};

const ch6: StoryEncounter = {
  id: "ch6_false_prophet",
  chapterId: "ch6",
  name: "The False Prophet",
  description: "The White Oracle — a mirror match against your stolen face.",
  bossFaction: "dreamer",
  bossGeneralDefId: "gen_dreamer",
  bossDeckCardDefIds: bossDeck("boss_ch6"),
  seed: "ch6_false_prophet_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch6_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "I am what you were. I am what the Architect made from your template." },
    },
    {
      id: "ch6_mirror",
      once: true,
      condition: { kind: "turn_reached", turn: 3 },
      action: { kind: "show_cinematic", cinematicId: "ch6_mirror_glitch" },
    },
    {
      id: "ch6_low",
      once: true,
      condition: { kind: "boss_hp_below", percent: 30 },
      action: { kind: "boss_taunt", text: "You're destroying your own face. Does that feel like victory?" },
    },
  ],
  preMatchDialog: "dialog_ch6_pre",
  postMatchWinDialog: "dialog_ch6_win",
  postMatchLossDialog: "dialog_ch6_loss",
};

const ch7: StoryEncounter = {
  id: "ch7_project_vector",
  chapterId: "ch7",
  name: "Project Vector",
  description: "Dr. Vox transforms mid-battle into the Warlord.",
  bossFaction: "new_babylon",
  bossGeneralDefId: "gen_new_babylon",
  bossDeckCardDefIds: bossDeck("boss_ch7"),
  seed: "ch7_project_vector_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch7_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "Project Vector was designed to eliminate anomalies like you. I am the project." },
    },
    {
      id: "ch7_transform",
      once: true,
      condition: { kind: "boss_hp_below", percent: 60 },
      action: { kind: "show_cinematic", cinematicId: "ch7_vox_transform" },
    },
    {
      id: "ch7_warlord",
      once: true,
      condition: { kind: "boss_hp_below", percent: 30 },
      action: { kind: "boss_taunt", text: "The Warlord awakens. Dr. Vox is no longer driving." },
    },
  ],
  preMatchDialog: "dialog_ch7_pre",
  postMatchWinDialog: "dialog_ch7_win",
  postMatchLossDialog: "dialog_ch7_loss",
};

const ch8: StoryEncounter = {
  id: "ch8_the_detective",
  chapterId: "ch8",
  name: "The Detective",
  description: "The Human — the only non-augmented fighter in the Arena.",
  bossFaction: "insurgency",
  bossGeneralDefId: "gen_insurgency",
  bossDeckCardDefIds: bossDeck("boss_ch8"),
  seed: "ch8_the_detective_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch8_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "No augments. No powers. Just deduction. Let me show you what that's worth." },
    },
    {
      id: "ch8_deduce",
      once: true,
      condition: { kind: "turn_reached", turn: 5 },
      action: { kind: "boss_taunt", text: "I've been watching your patterns. Three more turns and I'll have you solved." },
    },
  ],
  preMatchDialog: "dialog_ch8_pre",
  postMatchWinDialog: "dialog_ch8_win",
  postMatchLossDialog: "dialog_ch8_loss",
};

const ch9a: StoryEncounter = {
  id: "ch9a_unknown_variable",
  chapterId: "ch9a",
  name: "The Unknown Variable",
  description: "The Enigma — probability itself bends around her.",
  bossFaction: "dreamer",
  bossGeneralDefId: "gen_dreamer",
  bossDeckCardDefIds: bossDeck("boss_ch9a"),
  seed: "ch9a_unknown_variable_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch9a_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "Every outcome is a probability cloud until observed. I choose which cloud collapses." },
    },
    {
      id: "ch9a_chaos",
      once: true,
      condition: { kind: "turn_reached", turn: 4 },
      action: { kind: "boss_taunt", text: "Your strategy assumes causality. How quaint." },
    },
    {
      id: "ch9a_low",
      once: true,
      condition: { kind: "boss_hp_below", percent: 25 },
      action: { kind: "boss_taunt", text: "The probability of your victory just exceeded my tolerance threshold." },
    },
  ],
  preMatchDialog: "dialog_ch9a_pre",
  postMatchWinDialog: "dialog_ch9a_win",
  postMatchLossDialog: "dialog_ch9a_loss",
};

const ch9b: StoryEncounter = {
  id: "ch9b_gamblers_truth",
  chapterId: "ch9b",
  name: "The Gambler's Truth",
  description: "The Degen — chaos incarnate, all-in on every turn.",
  bossFaction: "antiquarian",
  bossGeneralDefId: "gen_antiquarian",
  bossDeckCardDefIds: bossDeck("boss_ch9b"),
  seed: "ch9b_gamblers_truth_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch9b_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "I go all-in every turn. Strategy is for cowards. Let's see who the universe favours." },
    },
    {
      id: "ch9b_luck",
      once: true,
      condition: { kind: "turn_reached", turn: 3 },
      action: { kind: "boss_taunt", text: "The house always wins. And tonight, I AM the house." },
    },
    {
      id: "ch9b_low",
      once: true,
      condition: { kind: "boss_hp_below", percent: 20 },
      action: { kind: "boss_taunt", text: "Even a gambler knows when to fold. But I never learned that part." },
    },
  ],
  preMatchDialog: "dialog_ch9b_pre",
  postMatchWinDialog: "dialog_ch9b_win",
  postMatchLossDialog: "dialog_ch9b_loss",
};

const ch10: StoryEncounter = {
  id: "ch10_panoptic_warden",
  chapterId: "ch10",
  name: "The Panoptic Warden",
  description: "Foucault — chrome jaw, genetic reveal, the Arena's true enforcer.",
  bossFaction: "panopticon",
  bossGeneralDefId: "gen_panopticon",
  bossDeckCardDefIds: bossDeck("boss_ch10"),
  seed: "ch10_panoptic_warden_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch10_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "The Panopticon sees all. Every move you've made since Chapter 1 was observed." },
    },
    {
      id: "ch10_reveal",
      once: true,
      condition: { kind: "boss_hp_below", percent: 50 },
      action: { kind: "show_cinematic", cinematicId: "ch10_genetic_reveal" },
    },
    {
      id: "ch10_low",
      once: true,
      condition: { kind: "boss_hp_below", percent: 20 },
      action: { kind: "boss_taunt", text: "The warden falls. But the Panopticon… the Panopticon will remember." },
    },
  ],
  preMatchDialog: "dialog_ch10_pre",
  postMatchWinDialog: "dialog_ch10_win",
  postMatchLossDialog: "dialog_ch10_loss",
};

const ch11: StoryEncounter = {
  id: "ch11_harvesters_reckoning",
  chapterId: "ch11",
  name: "The Harvester's Reckoning",
  description: "The Collector — Damnatio Memoriae, eraser of identities.",
  bossFaction: "panopticon",
  bossGeneralDefId: "gen_panopticon",
  bossDeckCardDefIds: bossDeck("boss_ch11"),
  seed: "ch11_harvesters_reckoning_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch11_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "I collected your identity. Your name. Your prophecy. All filed under 'Resolved.'" },
    },
    {
      id: "ch11_harvest",
      once: true,
      condition: { kind: "turn_reached", turn: 5 },
      action: { kind: "boss_taunt", text: "Damnatio Memoriae — the erasure of a person from history. I perfected the technique." },
    },
    {
      id: "ch11_low",
      once: true,
      condition: { kind: "boss_hp_below", percent: 20 },
      action: { kind: "boss_taunt", text: "You cannot un-harvest what I've already consumed. But you can… outlast me." },
    },
  ],
  preMatchDialog: "dialog_ch11_pre",
  postMatchWinDialog: "dialog_ch11_win",
  postMatchLossDialog: "dialog_ch11_loss",
};

const ch12: StoryEncounter = {
  id: "ch12_architects_design",
  chapterId: "ch12",
  name: "The Architect's Design",
  description: "Final boss — the entity that built the Arena to contain you.",
  bossFaction: "architect",
  bossGeneralDefId: "gen_architect",
  bossDeckCardDefIds: bossDeck("boss_ch12"),
  seed: "ch12_architects_design_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "ch12_intro",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "Oracle. I foresaw this moment the day I built the Arena." },
    },
    {
      id: "ch12_phase2",
      once: true,
      condition: { kind: "boss_hp_below", percent: 66 },
      action: { kind: "show_cinematic", cinematicId: "ch12_false_prophet_reveal" },
    },
    {
      id: "ch12_meme",
      once: true,
      condition: { kind: "boss_hp_below", percent: 40 },
      action: { kind: "boss_taunt", text: "The Meme IS me. We have been married inside each other since before either of us had a name." },
    },
    {
      id: "ch12_phase3",
      once: true,
      condition: { kind: "boss_hp_below", percent: 25 },
      action: { kind: "show_cinematic", cinematicId: "ch12_corruption_outbreak" },
    },
  ],
  preMatchDialog: "dialog_ch12_pre",
  postMatchWinDialog: "dialog_ch12_win",
  postMatchLossDialog: "dialog_ch12_loss",
};

/* ═══════════════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════════════ */

export const ALL_CHAPTER_ENCOUNTERS: readonly StoryEncounter[] = Object.freeze([
  ch1, ch2, ch3a, ch3b,
  ch4, ch5, ch6, ch7, ch8,
  ch9a, ch9b, ch10, ch11, ch12,
]);

export const CHAPTER_MAP: Readonly<Record<string, StoryEncounter>> =
  Object.freeze(
    Object.fromEntries(ALL_CHAPTER_ENCOUNTERS.map(e => [e.id, e]))
  );
