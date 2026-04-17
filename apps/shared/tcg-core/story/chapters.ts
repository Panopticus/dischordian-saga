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

/* ─── §5.5 — Warlord Zero, Battle of Nexon ───
 *
 * The first Warlord encounter. Wires the §5.5 three-move lockout
 * (engine/lockout.ts) into the campaign by scripting the Warlord
 * to cast `s1_warlord_three_moves` on her turn 3 (global turn 3,
 * side 1). The card's cast intercept activates the lockout
 * targeting the player; the lockout's full UI lives in
 * apps/client/src/components/match/.
 *
 * Spec: docs/production/act1/warlord-three-move-mechanic.md.
 * Narrative shell: apps/shared/act1Opponents.ts:176 (act1Step: 9).
 *
 * Boss deck is a placeholder pending a curated Warlord deck pass —
 * other Act 1 encounters in this file use the same `bossDeck()`
 * helper-generated placeholder set, so this is consistent with the
 * surrounding chapters' content-buildout state. The placeholder
 * deck includes `s1_warlord_three_moves` at index 0 so the
 * scripted-action drain finds it without RNG sensitivity. Filler
 * placeholders carry no card definitions (registry returns
 * undefined) and the AI heuristic skips them, which keeps this
 * encounter testable in isolation today.
 */
const chWarlordZeroFirst: StoryEncounter = {
  id: "ch_warlord_zero_first",
  chapterId: "ch_warlord_zero_first",
  name: "Warlord Zero (at the Battle of Nexon)",
  description:
    "Warlord Zero's first full war-deck deployment. She forces a three-move lockout on the player's hand from her third turn through their sixth.",
  bossFaction: "architect",
  bossGeneralDefId: "gen_architect",
  bossDeckCardDefIds: [
    "s1_warlord_three_moves",
    ...bossDeck("boss_warlord_zero_first").slice(0, 38),
  ],
  seed: "warlord_zero_first_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "warlord_pre",
      once: true,
      condition: { kind: "always" },
      action: {
        kind: "boss_taunt",
        text: "I am going to win this war in three moves. This is not bragging. This is arithmetic.",
      },
    },
    {
      id: "warlord_thesis",
      once: true,
      // Three Moves fires on global turn 3 with side 1 (the Warlord).
      // The "thesis" line is the in-narrative voice line spec §2.2.4
      // calls for at the cast moment.
      condition: { kind: "turn_reached", turn: 3 },
      action: { kind: "boss_taunt", text: "Three moves. Count them." },
    },
  ],
  preMatchDialog: "dialog_warlord_zero_first_pre",
  postMatchWinDialog: "dialog_warlord_zero_first_win",
  postMatchLossDialog: "dialog_warlord_zero_first_loss",
  // §5.5 lockout activator. Side 1 (Warlord) on global turn 3.
  // Engine semantics: global turn 3 is the Warlord's third turn under
  // the round-counted turnNumber (turn 1 = P0's first, turn 1 P1 plays
  // immediately after, turn 2 = next P0 round, etc.). The drainer in
  // engine/scriptedActions.ts runs after refreshTurnForPlayer, so the
  // Warlord's hand+mana are fully set up before the force-play.
  scriptedActions: [
    {
      kind: "force_play_card",
      globalTurn: 3,
      side: 1,
      cardDefId: "s1_warlord_three_moves",
    },
  ],
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

/* ─── §5.8 — Authority trial, Act 1 finale ───
 *
 * The only §5.8 encounter. Spec:
 * docs/production/act1/authority-trial-phase-mechanic.md.
 *
 * Unusual shape:
 *  - bossGeneralDefId is the new decorative `gen_authority` (0/99,
 *    no abilities, no Bloodborn — per spec §1 "the Authority is a
 *    verdict, not a duelist"). The Authority's 99 HP + 0 power is
 *    deliberately beyond reach: the only live match-outcome path
 *    is the turn-10 verdict threshold, NOT general death.
 *  - bossDeckCardDefIds is a 39-card placeholder list consistent
 *    with the rest of chapters.ts. The deck is never drawn through
 *    the current AI loop doesn't play cards for the Authority;
 *    the trial-phase machine runs the match to completion via
 *    turn-end cycles alone.
 *  - trialMode: {openingVerdictBalance: 0} opts the match into the
 *    §5.8 engine (phase guards active, verdict resolves at turn 10).
 *    openingVerdictBalance starts at 0; when the §5.7 hand-off
 *    lands, the campaign layer snapshots gameMasterVerdictStream
 *    Balance here.
 *  - winConditions intentionally omits the default general_killed
 *    because §5.8's outcome is the verdict, not general death. The
 *    `kill_before_turn 11` lose-condition keeps the player from
 *    cheese-winning via general damage before the verdict phase.
 *
 * Wiring: ALL_CHAPTER_ENCOUNTERS export below; CHAPTER_MAP lookup
 * by id `ch_authority_trial`. Dialog scenes in
 * dialogBank_chapters_10_12.ts.
 */
const chAuthorityTrial: StoryEncounter = {
  id: "ch_authority_trial",
  chapterId: "ch_authority_trial",
  name: "The Authority's Trial",
  description:
    "The Act 1 finale. Ten phases of an Empire judicial proceeding. Survive every phase restriction and the verdict-stream balance decides your fate.",
  bossFaction: "architect",
  bossGeneralDefId: "gen_authority",
  bossDeckCardDefIds: bossDeck("boss_authority_trial"),
  seed: "authority_trial_seed",
  winConditions: [{ kind: "survive_turns", turns: 10 }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "authority_opening",
      once: true,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "What do you say to the charges?" },
    },
  ],
  preMatchDialog: "dialog_authority_trial_pre",
  postMatchWinDialog: "dialog_authority_trial_win",
  postMatchLossDialog: "dialog_authority_trial_loss",
  trialMode: { openingVerdictBalance: 0 },
};

/* ═══════════════════════════════════════════════════════
   §5.6 — THE PROGRAMMER (Cycle C step 10)

   The Engineer's oldest friend, last seen at Nexon. Canonically
   he deliberately throws the match; the player can either accept
   the gift or decline and fight on.

   Parallel to chAuthorityTrial (§5.8) in shape:
    - bossGeneralDefId is the new decorative `gen_programmer` (3/22,
      neutral, no abilities). Mid-range stats so the two legitimate
      opening turns (spec §2) play honestly before the gift fires.
    - giftMode opts the match into the §5.6 engine (ProgrammerGift-
      State starts at "not_offered"; offerGift / acceptGift / declineGift
      in engine/programmerGift.ts drive the transitions).
    - winConditions keep the default general_killed — a declined
      gift still resolves via combat. Accepting the gift is the
      narrative winning path; DuelystGameUI resolves the match on
      the accept transition.

   Wiring: ALL_CHAPTER_ENCOUNTERS export below; CHAPTER_MAP lookup
   by id `ch_programmer_gift`. Dialog scenes in
   dialogBank_chapters_10_12.ts (pre/win/loss).
*/
const chProgrammerGift: StoryEncounter = {
  id: "ch_programmer_gift",
  chapterId: "ch_programmer_gift",
  name: "The Programmer",
  description:
    "The Engineer's oldest friend. He plays two honest turns, then offers the gift — a deliberate throw. Accept or decline.",
  bossFaction: "neutral",
  bossGeneralDefId: "gen_programmer",
  bossDeckCardDefIds: bossDeck("boss_programmer_gift"),
  seed: "programmer_gift_seed",
  winConditions: [{ kind: "general_killed" }],
  loseConditions: [{ kind: "general_killed" }],
  narrativeHooks: [
    {
      id: "programmer_opening",
      once: true,
      condition: { kind: "always" },
      action: {
        kind: "boss_taunt",
        text: "I will not tell you what I am doing. Trust me. I have done the arithmetic, and the arithmetic is very bad.",
      },
    },
  ],
  preMatchDialog: "dialog_programmer_gift_pre",
  postMatchWinDialog: "dialog_programmer_gift_win",
  postMatchLossDialog: "dialog_programmer_gift_loss",
  giftMode: { earliestOfferTurn: 3 },
  // §5.6 gift-offer activator: on global turn 3 with side 1 (the
  // Programmer), transition programmerGift from not_offered → offered.
  // The drainer runs after refreshTurnForPlayer, so the Programmer
  // has already made two honest plays (turns 1 and 2) before the
  // gesture fires, matching spec §2.
  scriptedActions: [
    {
      kind: "offer_programmer_gift",
      globalTurn: 3,
      side: 1,
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════════════ */

export const ALL_CHAPTER_ENCOUNTERS: readonly StoryEncounter[] = Object.freeze([
  ch1, ch2, ch3a, ch3b,
  ch4, ch5, ch6, ch7, ch8,
  chWarlordZeroFirst,
  ch9a, ch9b, ch10, ch11, ch12,
  chProgrammerGift,
  chAuthorityTrial,
]);

export const CHAPTER_MAP: Readonly<Record<string, StoryEncounter>> =
  Object.freeze(
    Object.fromEntries(ALL_CHAPTER_ENCOUNTERS.map(e => [e.id, e]))
  );
