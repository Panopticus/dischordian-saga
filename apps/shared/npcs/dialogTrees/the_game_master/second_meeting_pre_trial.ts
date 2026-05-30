// apps/shared/npcs/dialogTrees/the_game_master/second_meeting_pre_trial.ts
//
// The Game Master second-meeting dialog tree — Act 2 Interlude onward,
// pre-Authority-Trial. Per the_game_master.md §§1.3–1.4, §2.6:
// post-Original-destruction the player no longer fights "the Game
// Master" but "the Two Game Masters" — the Left and the Right wearing
// lenses from his split goggles. This tree stages one of the saga's
// canonically-rare moments where the Two co-speak in the same scene
// (per bible §1.7 Tell #4 — they always cross-reference each other;
// here they are forced into the same room, with the player between
// them).
//
// First Phase-1 BioWare-style outcome tree — exercises every new
// outcome field at least once:
//   - branch_left_arithmetic  → unlockCard via dialog_choice
//                               + factionRepDelta (antiquarian)
//   - branch_right_drawer     → trustDelta + sets (existing fields)
//   - branch_refuse_original  → publicFlag
//                               + factionRepDelta x3
//                                 (hierarchy_of_damned, antiquarian,
//                                  dreamer)
//   - branch_puzzle           → mutateNextEncounterDeck (ch_authority_trial)
//                               + stakesAxisDelta.public_witness
//                               + factionRepDelta (antiquarian)
//
// Voice discipline (the_game_master.md §§1.3 + 1.4):
//   - Left: no caps, no exclamations, arithmetic vocabulary,
//     past-conditional / future-perfect grammar, names the
//     "wrong-question" reframe at least once.
//   - Right: CAPS for aesthetic verbs (READ, BOOK, KEEPING),
//     "darling" exactly once per branch she dominates, commands-
//     as-invitations ("Sit. Stay."), genuine theatrical delight.
//   - Cross-acknowledgment (Tell #4): each Game Master refers
//     obliquely to the other at least once across the tree.
//   - No "we" anywhere (Tell #5 — they are canonically isolated
//     even when co-speaking).
//   - No first-person plural even when both are on-screen.
//   - The puzzle (§2.3) is voiced ONCE — by the player in branch 4
//     — and the Two acknowledge it without answering it (canon-
//     protected per bible §1.8 + §3.6).

import type { NpcDialogTree } from "../types";

export const THE_GAME_MASTER_SECOND_MEETING_PRE_TRIAL: NpcDialogTree = {
  id: "game-master-second-meeting-pre-trial",
  npcKey: "the_game_master",
  entryNodeId: "root",
  nodes: {
    // ─── Root: the Two co-speak (canonically rare) ─────────────────
    root: {
      id: "root",
      npcKey: "the_game_master",
      voLineId: "gm.second_meeting_pre_trial.root",
      // Left opens (arithmetic / past-conditional). Right interrupts
      // (CAPS on aesthetic verbs, "darling", filed-her-move-already
      // frame). The interruption itself is a Tell #4 cross-reference.
      onscreenText:
        "Left: You played the chess. The arithmetic was the wrong question. I will tell the Right one. She will be disappointed.\n\nRight: ALREADY disappointed, darling. You used the Engineer's opening; I had the SHAPE of it filed in the drawer before you finished your tea. But you came back. That is the only data point I am KEEPING. Sit.",
      requiresRevealStage: "Archon",
      choices: [
        {
          label: "What was the wrong question?",
          nextId: "branch_left_arithmetic",
          sets: "gm_engaged_left_arithmetic",
          axisDelta: [{ axis: "curiosity", delta: 1 }],
          // Engaging the Left earns a relic of the pre-Fall Senator
          // (bible §2.1) — the man who laughed easily, before the
          // split. Quietly load-bearing: the unlock surfaces a
          // version of him no living character has access to.
          unlockCard: {
            cardDefId: "gen_game_master_original",
            via: "dialog_choice",
          },
          // The Antiquarian (bible §4.3) is the canonical historian
          // of the Game Master's career; voicing the wrong-question
          // reframe inside his archive raises the Antiquarian's
          // disposition toward the player.
          factionRepDelta: { antiquarian: 1 },
        },
        {
          label: "What's in the drawer?",
          nextId: "branch_right_drawer",
          sets: "gm_engaged_right_drawer",
          trustDelta: 2,
          axisDelta: [{ axis: "wit", delta: 1 }],
        },
        {
          label: "Where is the Original?",
          nextId: "branch_refuse_original",
          sets: "gm_asked_about_original",
          axisDelta: [{ axis: "aggression", delta: 1 }],
          // Public flag — other NPCs (notably the Antiquarian and
          // the Degen, per bible §§4.3 + 4.10) react to a player
          // who has voiced this question aloud.
          publicFlag: "gm_player_asked_about_original",
          // The Hierarchy "honored every clause" of the protection
          // contract that killed him (bible §2.5). Asking about the
          // Original in front of the Two is a hostile question to
          // their former employer — and the Antiquarian + the
          // Matrix-of-Dreams substrate (dreamer faction) are the two
          // institutional layers that benefit from the question
          // being asked.
          factionRepDelta: {
            hierarchy_of_damned: -1,
            antiquarian: 1,
            dreamer: 1,
          },
        },
        {
          label: "An Archon wanted the soul to exist. Why?",
          nextId: "branch_puzzle",
          sets: "gm_puzzle_voiced_aloud",
          axisDelta: [
            { axis: "curiosity", delta: 1 },
            { axis: "wit", delta: 1 },
          ],
          // Voicing the Antiquarian's question (bible §2.3) in front
          // of the Two is the saga's deepest canonically-load-bearing
          // dialog move. The puzzle has not been spoken aloud in the
          // Game Master's presence in 17,000 years. The mechanical
          // expression: the architect-faction Game Master card joins
          // the Authority Trial encounter deck (the Two file the
          // player's voicing into the Trial's witness layer), and the
          // public-witness stakes shift in the player's favor — which
          // carries forward to the §5.8 Authority Trial's
          // openingVerdictBalance via deriveAuthorityVerdictOffset
          // (act1TrialHandoff.ts). verdict itself is owned by trialMode
          // and is not movable via stakesAxisDelta (chapters.ts §A4),
          // so the nudge is authored on public_witness — the declared
          // axis every GM dialog choice uses (see mid_trial_intercession).
          factionRepDelta: { antiquarian: 2 },
          stakesAxisDelta: { public_witness: 1 },
          mutateNextEncounterDeck: {
            encounterId: "ch_authority_trial",
            addCardDefId: "s1_char_030",
          },
        },
      ],
    },

    // ─── Left-arithmetic branch (curiosity) ────────────────────────
    branch_left_arithmetic: {
      id: "branch_left_arithmetic",
      npcKey: "the_game_master",
      voLineId: "gm.second_meeting_pre_trial.branch_left_arithmetic",
      // Left elaborates. No caps. No exclamations. Past-conditional
      // grammar ("would have"), wrong-question reframe (Tell §1.3),
      // cross-reference to the Right (Tell #4 — "the drawer the
      // Right one keeps"), and a relic-of-pre-split offering. The
      // pre-Fall Senator (§2.1) is the relic. The line carries the
      // bible's deepest humanizing detail — he laughed twice at
      // Elara — without explaining it.
      onscreenText:
        "Left: The arithmetic moved up a register. You solved the chess. The Trial does not care about the chess. The Trial cares about the man you have not yet been asked to be. I will give you a relic of the man I was, before the split. Read him. He laughed twice at Elara. The drawer the Right one keeps is not the only one.",
      autoNext: "terminal",
      requiresRevealStage: "Archon",
    },

    // ─── Right-drawer branch (wit) ─────────────────────────────────
    branch_right_drawer: {
      id: "branch_right_drawer",
      npcKey: "the_game_master",
      voLineId: "gm.second_meeting_pre_trial.branch_right_drawer",
      // Right elaborates. CAPS on KEEPING (twice — keeping symmetry
      // is the move). "Darling" lands once. Cross-reference to the
      // Left ("The Left one is unable to process"). Commands-as-
      // invitations close ("Stay."). The line does NOT say what is
      // in the other drawers (bible §1.8 — she will not name what
      // she has filed about the player; the threat is in what she
      // has, not in what she shows).
      onscreenText:
        "Right: Drawers, plural, darling. One for every READ I have done. Yours has the Engineer's opening, the way you hold your queen when you are tired, the move you would have made if you trusted me. You are KEEPING me. I am KEEPING you. The Left one is unable to process the symmetry. Stay.",
      autoNext: "terminal",
      requiresRevealStage: "Archon",
    },

    // ─── Refuse-original branch (aggression) ───────────────────────
    branch_refuse_original: {
      id: "branch_refuse_original",
      npcKey: "the_game_master",
      voLineId: "gm.second_meeting_pre_trial.branch_refuse_original",
      // Both speak in turn — the question forces them onto a shared
      // surface. Left lands the canonical five-word epitaph (§2.5),
      // verbatim. Right escalates into caps to cover the Left's
      // refusal to elaborate. Neither answers the actual question
      // (§1.8 silence shape — the destruction is not narrated).
      onscreenText:
        "Left: The Original is destroyed. The contract was honored. Every clause.\n\nRight: Don't make her say it twice, darling. The clauses kept him. The clauses killed him. She is too quiet to hate the clauses. I am LOUD enough for both of us.",
      autoNext: "terminal",
      requiresRevealStage: "Archon",
    },

    // ─── Puzzle branch (wit + curiosity) ───────────────────────────
    branch_puzzle: {
      id: "branch_puzzle",
      npcKey: "the_game_master",
      voLineId: "gm.second_meeting_pre_trial.branch_puzzle",
      // The puzzle (§2.3) is acknowledged but not answered. The Left
      // names the Antiquarian — first canonical instance of either
      // Game Master naming another character. The Right files the
      // moment into the drawer with explicit Trial-deck consequence
      // ("the Trial deck has just acquired a witness"), which is the
      // narrative justification for the mutateNextEncounterDeck
      // intent. Neither says "yes" or "no" — the puzzle remains.
      onscreenText:
        "Left: ... The Antiquarian asked that question. He has been asking it for seventeen thousand years. I do not answer it. I am the question.\n\nRight: Darling. You voiced it. The Authority will hear you voiced it. I am writing this one in the drawer where I keep the ones that matter. The Trial deck has just acquired a witness.",
      autoNext: "terminal",
      requiresRevealStage: "Archon",
    },

    // ─── Terminal (shared) ─────────────────────────────────────────
    terminal: {
      id: "terminal",
      npcKey: "the_game_master",
      voLineId: "gm.second_meeting_pre_trial.terminal",
      // Predestination-grammar close (Tell #3). No caps. The Left's
      // voice closes — quietest in the saga (§1.3) — even after a
      // co-speaking scene. The Matrix of Dreams reference (§2.4)
      // makes the persistence-after-departure explicit without
      // narrating it.
      onscreenText:
        "Left: You will leave the chamber. The Authority Trial will begin in an hour. Somewhere, in the Matrix of Dreams, your moves will already be filed before you make them.",
      requiresRevealStage: "Archon",
    },
  },
};
