// apps/shared/npcs/dialogTrees/wraith_calder/first_meeting.ts
//
// Wraith Calder → Hierophant first-meeting dialog tree — Phase 6e.1a
// per writers'-guide canonical Long Mourning chamber first-visit spec.
//
// All branches gate `post_arena` reveal-stage canonically (the canonical
// pre-arena Ch3b first-meeting fires through the existing match-flow
// bank, not through this canonical-chamber tree). The canonical first-
// look-pause stage-direction lands per §1.7 Tell #1.
//
// Branching axes:
//   - vulnerability → Silence-held branch (canonical "+trust")
//   - curiosity     → Tactical-question branch (canonical wall query)
//   - mercy         → Personal-question branch (canonical "ask first
//                                                about him, not the
//                                                work")
//   - aggression    → Get-up-mistake branch (canonical "verb of someone
//                                            I outgrew" Hostile-band
//                                            trust-breach)
//
// Trust-deltas seed the 5-band ladder per §3.3.

import type { NpcDialogTree } from "../types";

export const WRAITH_CALDER_FIRST_MEETING: NpcDialogTree = {
  id: "hierophant-first-meeting",
  npcKey: "wraith_calder",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "wraith_calder",
      voLineId: "hierophant.first_meeting.root",
      // §1.7 Tell #1: the Hierophant canonically does NOT look up
      // when the player enters. The bracketed [stage-direction]
      // canon is the canonical visual signature. The canonical
      // four-axis player choice canonically determines whether the
      // first-look-pause lands as canonical-gratitude or canonical-
      // trust-breach.
      onscreenText:
        "[The Hierophant does not look up. The pen continues — a name is being written. A small silence. Then another name. The chamber waits to see what kind of visitor you canonically are.]",
      requiresRevealStage: "post_arena",
      choices: [
        {
          label: "[Stand quietly. Wait.]",
          nextId: "silence_held_branch",
          sets: "hierophant_axis_read_vulnerability",
          trustDelta: 3,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
          publicFlag: "hierophant_first_contact_silence_held",
        },
        {
          label: "What is the wall?",
          nextId: "tactical_question_branch",
          sets: "hierophant_axis_read_curiosity",
          trustDelta: 1,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "Are you all right?",
          nextId: "personal_question_branch",
          sets: "hierophant_axis_read_mercy",
          trustDelta: 2,
          axisDelta: [{ axis: "mercy", delta: 1 }],
        },
        {
          label: "Get up. We need to talk.",
          nextId: "get_up_mistake_branch",
          sets: "hierophant_axis_read_aggression",
          trustDelta: -3,
          axisDelta: [{ axis: "aggression", delta: 1 }],
          publicFlag: "hierophant_first_contact_get_up_weaponized",
        },
      ],
    },

    // ─── Silence-held branch (canonical first-look gratitude) ──────
    silence_held_branch: {
      id: "silence_held_branch",
      npcKey: "wraith_calder",
      voLineId: "hierophant.first_meeting.silence_held",
      // §1.7 Tell #1 canonical: "looks up for the first time. The
      // look-up is canonically gratitude, not recognition." The
      // canonical Wary-band-promotion register lands.
      onscreenText:
        "[The Hierophant looks up for the first time. The look-up is canonically gratitude, not recognition.] You held the silence well. Most do not. Sit, if you would like. The names will continue regardless. Your sitting is canonical-presence; canonical-presence is canonically the rarest thing anyone offers me.",
      autoNext: "terminal",
      requiresRevealStage: "post_arena",
    },

    // ─── Tactical-question branch (Curiosity-axis player) ──────────
    tactical_question_branch: {
      id: "tactical_question_branch",
      npcKey: "wraith_calder",
      voLineId: "hierophant.first_meeting.tactical_question",
      // §3.3 Witnessed-band canonical answer to the canonical wall
      // question. The canonical "names go here" register lands.
      onscreenText:
        "The wall is where the names go. Each canonical-name canonically required a canonical-day of canonical-research. I have written for canonical-three-thousand canonical-years. Canonical-three-hundred-and-forty-seven-thousand names canonical-remain. The canonical-continuation is the canonical-point. Sit. We will read the wall together if you would like.",
      autoNext: "terminal",
      requiresRevealStage: "post_arena",
    },

    // ─── Personal-question branch (Mercy-axis player) ──────────────
    personal_question_branch: {
      id: "personal_question_branch",
      npcKey: "wraith_calder",
      voLineId: "hierophant.first_meeting.personal_question",
      // §1.7 Tell #4 canonical: "I will remember" reservation canon.
      // The canonical mercy-axis question lands canonical-trust-warm
      // and canonically registers the canonical-care.
      onscreenText:
        "[The pen pauses. The Hierophant looks up for the first time. The look-up canonically holds longer than canonical-gratitude permits.] You asked first about me. Most ask first about the work. I will remember that. The canonical-remembering is canonically a covenant, not a courtesy. I am canonically all right. The canonical-naming continues canonically-undisturbed.",
      autoNext: "terminal",
      requiresRevealStage: "post_arena",
    },

    // ─── Get-up-mistake branch (canonical Hostile-band trust-breach) ─
    get_up_mistake_branch: {
      id: "get_up_mistake_branch",
      npcKey: "wraith_calder",
      voLineId: "hierophant.first_meeting.get_up_mistake",
      // §3.9 + §1.8 canonical "verb of someone I outgrew" canon.
      // The canonical Hostile-band trust-breach register lands; the
      // canonical "Sit. Or leave." canon closes the door.
      onscreenText:
        "You are canonically using the canonical-verb of someone I canonically outgrew. The canonical-borrowing is canonically not yours to make. Sit. Or leave. The canonical-chamber has space for both, and no canonical-patience for the canonical-third option.",
      autoNext: "terminal",
      requiresRevealStage: "post_arena",
    },

    terminal: {
      id: "terminal",
      npcKey: "wraith_calder",
      voLineId: "hierophant.first_meeting.terminal",
      onscreenText:
        "[The pen returns to the page. The next canonical-name canonically begins. The chamber is canonical-quiet again. You may stay; you may leave; the canonical-work canonically continues either way.]",
      requiresRevealStage: "post_arena",
    },
  },
};
