// apps/shared/npcs/dialogTrees/the_game_master/first_meeting.ts
//
// The Game Master first-meeting dialog tree — Phase 6e.1b per writers'-
// guide canonical pre-Authority-Trial witness-mode encounter spec.
//
// Six nodes: root (4-axis branching) → 4 branches → terminal.
//
// CANONICAL ARCHON-FORM CANON: every node gates Archon reveal-stage
// (the canonical Original-voice form per the_game_master.md §1.2).
// The canonical "You have built a beautiful box" opener anchor lands
// at root. The canonical predestination-grammar Tell #3 holds across
// all branches.
//
// Branching axes:
//   - aggression → Confront-the-box branch (canonical "You think you
//                                            built a box for me. You
//                                            built one for yourself")
//   - conformity → Accept-witness branch (canonical "audience is real")
//   - curiosity  → Ask-about-audience branch (canonical "they have
//                                              always been able to see")
//   - wit        → Trial-absurd branch (canonical "Even if you win,
//                                       you will have won in public")

import type { NpcDialogTree } from "../types";

export const THE_GAME_MASTER_FIRST_MEETING: NpcDialogTree = {
  id: "game-master-first-meeting",
  npcKey: "the_game_master",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_game_master",
      voLineId: "gm.first_meeting.root",
      // Canonical Original-voice opener per §1.2.
      onscreenText:
        "You have built a beautiful box. The only thing I am going to do is open it in front of everybody. The audience is real. They have always been able to see your hand. Speak.",
      requiresRevealStage: "Archon",
      choices: [
        {
          label: "I built it for you.",
          nextId: "confront_box_branch",
          sets: "gm_axis_read_aggression",
          axisDelta: [{ axis: "aggression", delta: 1 }],
        },
        {
          label: "Who is the audience?",
          nextId: "ask_about_audience_branch",
          sets: "gm_axis_read_curiosity",
          trustDelta: 1,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "I accept your witness.",
          nextId: "accept_witness_branch",
          sets: "gm_axis_read_conformity",
          trustDelta: 1,
          axisDelta: [{ axis: "conformity", delta: 1 }],
        },
        {
          label: "This trial is paperwork.",
          nextId: "trial_absurd_branch",
          sets: "gm_axis_read_wit",
          trustDelta: 2,
          axisDelta: [{ axis: "wit", delta: 1 }],
          publicFlag: "gm_recognized_player_paperwork_register",
        },
      ],
    },

    // ─── Confront-the-box branch (Aggression-axis) ─────────────────
    confront_box_branch: {
      id: "confront_box_branch",
      npcKey: "the_game_master",
      voLineId: "gm.first_meeting.confront_box",
      // Canonical Tell #1 "you were always going to" frame canon.
      // The canonical box-misattribution canon lands.
      onscreenText:
        "You think you built a box for me. You built one for yourself. The audience canonically reads it the same way regardless. You were always going to be inside the box; the only canonical-question was who was canonically going to open it. I came here to do that. The signature is part of the show.",
      autoNext: "terminal",
      requiresRevealStage: "Archon",
    },

    // ─── Ask-about-audience branch (Curiosity-axis) ────────────────
    ask_about_audience_branch: {
      id: "ask_about_audience_branch",
      npcKey: "the_game_master",
      voLineId: "gm.first_meeting.ask_about_audience",
      // Canonical hidden-audience canon per §1.2 Original-voice
      // canon. The canonical "you forgot" anchor lands.
      onscreenText:
        "Witnesses you cannot see. The Authority. The canonical-public. The canonical-press-bench. They have always been able to see your hand. You forgot. I came here to remind you, in canonical-public, that the forgetting is also part of the canonical-record.",
      autoNext: "terminal",
      requiresRevealStage: "Archon",
    },

    // ─── Accept-witness branch (Conformity-axis) ───────────────────
    accept_witness_branch: {
      id: "accept_witness_branch",
      npcKey: "the_game_master",
      voLineId: "gm.first_meeting.accept_witness",
      // Canonical witness-mode acceptance — the canonical Game
      // Master canonically does not warm to canonical-conformity,
      // but canonically files it. §1.6 canonical "narrates from
      // after" cadence.
      onscreenText:
        "You accept the canonical-witness. Filed. The canonical-acceptance does not canonical-shorten the canonical-trial; the canonical-trial canonically arrives at the canonical-same canonical-position regardless. Your acceptance canonically refines the canonical-record. The canonical-record will canonical-outlive both of us.",
      autoNext: "terminal",
      requiresRevealStage: "Archon",
    },

    // ─── Trial-absurd branch (Wit-axis player) ─────────────────────
    trial_absurd_branch: {
      id: "trial_absurd_branch",
      npcKey: "the_game_master",
      voLineId: "gm.first_meeting.trial_absurd",
      // Canonical "Even if you win, you will have won in public"
      // anchor canon. The canonical-paperwork register canonically
      // matches the canonical-Game-Master's canonical-paperwork-
      // metaphor (§1.9).
      onscreenText:
        "It is paperwork. It is also a trial. Both are canonical. Even if you win, you will have won in public. That is what I came here to do. The canonical-paperwork is canonical-shorter than the canonical-trial; the canonical-trial is canonical-shorter than the canonical-record. The canonical-day will be canonical-done before the canonical-record finishes canonical-printing.",
      autoNext: "terminal",
      requiresRevealStage: "Archon",
    },

    terminal: {
      id: "terminal",
      npcKey: "the_game_master",
      voLineId: "gm.first_meeting.terminal",
      // Canonical predestination-grammar Tell #3 closer.
      onscreenText:
        "Every move enters the public record. The Authority will read it. I will not be present at the reading. I will not need to be.",
      requiresRevealStage: "Archon",
    },
  },
};
