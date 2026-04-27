// apps/shared/npcs/dialogTrees/the_seer/first_meeting.ts
//
// The Seer first-meeting dialog tree — Phase 6e.1b per writers'-guide
// canonical Mechronis bench prophecy-match spec.
//
// Six nodes: root (4-axis branching) → 4 branches → terminal.
//
// CANONICAL CROSS-TIME CANON (the_seer.md §2.3): every player choice
// canonically matches the Seer's pre-recorded predictions. Every choice
// is canonically *right* — the Seer foresaw the conversation and pre-
// recorded her sides before sealing herself behind the Dreamer's shield.
// The branches are canonically her four canonical-prepared answers.
//
// Branching axes:
//   - vigilance → Recognized-prediction branch (canonical "you said it
//                                               in three turns" canon)
//   - curiosity → Question-shape branch (canonical "the asking is the
//                                        prediction" register)
//   - wit       → Pre-recorded-meta branch (canonical recursion canon)
//   - vulnerability → Quiet-acceptance branch (canonical "I will see
//                                              you in Act 7" canon)

import type { NpcDialogTree } from "../types";

export const THE_SEER_FIRST_MEETING: NpcDialogTree = {
  id: "seer-first-meeting",
  npcKey: "the_seer",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_seer",
      voLineId: "seer.first_meeting.root",
      // Canonical Mechronis bench prophecy-match opener. The staff
      // is canonically resting on the bench; the Seer canonically
      // does not raise it. Per the_seer.md §2.1 canonical scripted-
      // loss canon.
      onscreenText:
        "I will not raise my staff today. I want to see whether the bench has learned yet. Sit. The match is canonical-already-resolved on my side. You will play it on yours; I have prepared my responses. Tell me what you have come here knowing.",
      choices: [
        {
          label: "I see the move three turns ahead.",
          nextId: "recognized_prediction_branch",
          sets: "seer_axis_read_vigilance",
          trustDelta: 2,
          axisDelta: [{ axis: "vigilance", delta: 1 }],
        },
        {
          label: "What does the bench teach?",
          nextId: "question_shape_branch",
          sets: "seer_axis_read_curiosity",
          trustDelta: 1,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "You said you'd say that.",
          nextId: "pre_recorded_meta_branch",
          sets: "seer_axis_read_wit",
          trustDelta: 2,
          axisDelta: [{ axis: "wit", delta: 1 }],
          publicFlag: "seer_recognized_player_recursion_first_contact",
        },
        {
          label: "[Sit silently. Wait for her.]",
          nextId: "quiet_acceptance_branch",
          sets: "seer_axis_read_vulnerability",
          trustDelta: 3,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
          publicFlag: "seer_offered_staff_to_player_first_contact",
        },
      ],
    },

    // ─── Recognized-prediction branch (Vigilance-axis player) ──────
    recognized_prediction_branch: {
      id: "recognized_prediction_branch",
      npcKey: "the_seer",
      voLineId: "seer.first_meeting.recognized_prediction",
      // Canonical "You will see it in three turns" per act1OpponentDialog.
      // The canonical-vigilance read canonically matches her canonical-
      // pre-recording.
      onscreenText:
        "You will see it in three turns. You already do. The recording I left for this branch was: 'they will see it in three turns. They will tell me they see it. I will tell them they already do.' Read the bench. The lesson is finished before the canonical-loss arrives.",
      autoNext: "terminal",
    },

    // ─── Question-shape branch (Curiosity-axis player) ─────────────
    question_shape_branch: {
      id: "question_shape_branch",
      npcKey: "the_seer",
      voLineId: "seer.first_meeting.question_shape",
      // Canonical "the asking is the prediction" register. The Seer
      // canonically pre-recorded that the player would ask.
      onscreenText:
        "The bench teaches that the canonical-asking is canonically half of the canonical-prediction. I recorded this answer for you sixteen thousand canonical-years ago. The canonical-asking lands canonical-on-cue. The canonical-bench canonically taught me too. You are canonical-on-the-bench right now.",
      autoNext: "terminal",
    },

    // ─── Pre-recorded-meta branch (Wit-axis player) ────────────────
    pre_recorded_meta_branch: {
      id: "pre_recorded_meta_branch",
      npcKey: "the_seer",
      voLineId: "seer.first_meeting.pre_recorded_meta",
      // Canonical recursion canon — the player canonically catches
      // the canonical-pre-recording mechanic. Saga-load-bearing
      // recognition.
      onscreenText:
        "I did. I said I would say that. The canonical-recording is canonical-deep — every canonical-line of mine is canonical-pre-recorded against your canonical-already-spoken question. You canonical-noticed canonical-faster than the canonical-mean. The canonical-mean is canonical-Act-Five. You are at canonical-first-contact. The canonical-noticing is canonical-flattering and canonical-meaningless to my schedule.",
      autoNext: "terminal",
    },

    // ─── Quiet-acceptance branch (Vulnerability-axis player) ───────
    quiet_acceptance_branch: {
      id: "quiet_acceptance_branch",
      npcKey: "the_seer",
      voLineId: "seer.first_meeting.quiet_acceptance",
      // Canonical "I will see you in Act 7" canon — the canonical
      // Thaloria-coordinates invitation foreshadow.
      onscreenText:
        "Good. The canonical-silence is canonical-the-bench's canonical-favorite student. I prepared this canonical-answer for the canonical-quiet-ones. I will see you in canonical-Act-Seven. Coordinates will arrive in canonical-pre-recorded form. Take the staff if you want it. I left it on the canonical-bench for you specifically.",
      autoNext: "terminal",
    },

    terminal: {
      id: "terminal",
      npcKey: "the_seer",
      voLineId: "seer.first_meeting.terminal",
      onscreenText:
        "The canonical-match is canonical-resolved. You will canonical-leave the canonical-bench. The canonical-bench will canonical-remain. I will canonical-remain canonical-pre-recorded. The canonical-three-of-us are canonical-in-canonical-balance.",
    },
  },
};
