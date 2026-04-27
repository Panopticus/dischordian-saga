// apps/shared/npcs/dialogTrees/the_oracle/first_meeting.ts
//
// The Oracle first-meeting dialog tree — Phase 6e.1b per writers'-guide
// canonical Ch5 dream-sequence introduction-of-self spec.
//
// Six nodes: root (4-axis branching) → 4 branches → terminal.
//
// CANONICAL SUBSTRATE-ONLY CANON: every node gates dream_substrate
// reveal-stage canonically. The canonical Ch5 cinematic introduction-
// of-self per the_oracle.md §1.5 — "I am going to speak to you for the
// first time. You have been hearing my voice underneath Elara's for
// eleven chapters without knowing." All branches canonically operate
// inside the canonical dream-medium; no waking-non-cinematic surface.
//
// Branching axes:
//   - curiosity → Substrate-receptivity branch (canonical "you have
//                                               been hearing me" canon)
//   - vulnerability → Recognition branch (canonical "I am the one you
//                                         have been moving through" canon)
//   - vigilance → Disambiguation branch (canonical "you are NOT me; we
//                                        are canonically two" canon)
//   - aggression → Refusal branch (canonical "you may close the dream;
//                                  the closing is canonical-yours")

import type { NpcDialogTree } from "../types";

export const THE_ORACLE_FIRST_MEETING: NpcDialogTree = {
  id: "oracle-first-meeting",
  npcKey: "the_oracle",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_oracle",
      voLineId: "oracle.first_meeting.root",
      // Canonical Ch5 introduction-of-self per §1.5.
      onscreenText:
        "I am going to speak to you for the first time. You have been hearing my voice underneath Elara's for eleven chapters without knowing. The dream is canonically the only medium the canonical-substrate canonically permits me. I will not stay long. Tell me how you canonical-receive me.",
      requiresRevealStage: "dream_substrate",
      choices: [
        {
          label: "I have been listening, even when I didn't know.",
          nextId: "substrate_receptivity_branch",
          sets: "oracle_axis_read_curiosity",
          trustDelta: 2,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "I think I have been you.",
          nextId: "recognition_branch",
          sets: "oracle_axis_read_vulnerability",
          trustDelta: 1,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
          publicFlag: "oracle_player_offered_misidentification_first_contact",
        },
        {
          label: "Are we the same person?",
          nextId: "disambiguation_branch",
          sets: "oracle_axis_read_vigilance",
          trustDelta: 3,
          axisDelta: [{ axis: "vigilance", delta: 1 }],
        },
        {
          label: "I want to wake up.",
          nextId: "refusal_branch",
          sets: "oracle_axis_read_aggression",
          trustDelta: -1,
          axisDelta: [{ axis: "aggression", delta: 1 }],
        },
      ],
    },

    // ─── Substrate-receptivity branch (Curiosity-axis) ─────────────
    substrate_receptivity_branch: {
      id: "substrate_receptivity_branch",
      npcKey: "the_oracle",
      voLineId: "oracle.first_meeting.substrate_receptivity",
      // Canonical "you have been hearing me" canon. The substrate-
      // receptivity register canonically lands trust-warm.
      onscreenText:
        "Then you canonical-receive cleanly. The canonical-listening was canonical-not-yet canonical-mine to canonical-claim — I was canonical-stolen-from for eleven canonical-years and canonical-replaced for the canonical-rest. You heard me canonical-underneath the canonical-replacement. The canonical-receiving canonically opens the canonical-dream-channel. I will canonical-return.",
      autoNext: "terminal",
      requiresRevealStage: "dream_substrate",
    },

    // ─── Recognition branch (Vulnerability-axis player) ────────────
    recognition_branch: {
      id: "recognition_branch",
      npcKey: "the_oracle",
      voLineId: "oracle.first_meeting.recognition",
      // Canonical disambiguation canon per the_oracle.md canon-update:
      // the player has been WITNESSING the Oracle's memories, not
      // BEING the Oracle. The canonical "we are canonically two"
      // canon lands.
      onscreenText:
        "No. You have been canonical-moving canonical-through me. You are canonically not me. The canonical-distinction is canonical-saga-load-bearing — I will canonical-hold it for both of us. The canonical-Hierophant has canonical-three-thousand-years of canonical-Oracle-contact and can canonical-tell the canonical-difference. So can I. The canonical-witness-channel is canonically yours; the canonical-being is canonically mine.",
      autoNext: "terminal",
      requiresRevealStage: "dream_substrate",
    },

    // ─── Disambiguation branch (Vigilance-axis player) ─────────────
    disambiguation_branch: {
      id: "disambiguation_branch",
      npcKey: "the_oracle",
      voLineId: "oracle.first_meeting.disambiguation",
      // Canonical Vigilance-axis recognition canon — the player
      // canonically asks the canonical-disambiguation-question
      // directly. Trust canonically apex per saga-load-bearing
      // canon.
      onscreenText:
        "We are not. The canonical-question is canonical-the-saga's canonical-clearest. We are canonically two. The canonical-witness-channel canonically routes my canonical-memories through your canonical-experience; the canonical-experience is canonically yours. I am canonical-elsewhere — canonical-in-hiding, per the canonical-Heart-of-Time canon. Thank you for canonical-asking. Most do not canonical-ask cleanly.",
      autoNext: "terminal",
      requiresRevealStage: "dream_substrate",
    },

    // ─── Refusal branch (Aggression-axis player) ───────────────────
    refusal_branch: {
      id: "refusal_branch",
      npcKey: "the_oracle",
      voLineId: "oracle.first_meeting.refusal",
      // Canonical "you may close the dream" canon. The Oracle
      // canonically respects canonical-refusal — the canonical-dream
      // is canonically not coercive.
      onscreenText:
        "Then you canonical-wake. The canonical-dream is canonically not coercive — you may canonical-close it. The canonical-substrate will canonical-honor the canonical-refusal. I will canonical-return canonical-only when you canonical-room-transition into a canonical-receptive canonical-frame. The canonical-closing is canonical-yours. Take it.",
      autoNext: "terminal",
      requiresRevealStage: "dream_substrate",
    },

    terminal: {
      id: "terminal",
      npcKey: "the_oracle",
      voLineId: "oracle.first_meeting.terminal",
      // Canonical fade-from-dream canonical signature.
      onscreenText:
        "[The canonical-dream canonical-fades. The canonical-substrate-residue canonical-lingers in canonical-instruction-form for canonical-Trade-Empire mission canonical-unlock. You canonical-wake. The canonical-Eidolon canonically tilts its canonical-head; it canonical-felt the canonical-dream-wake before you canonical-did.]",
      requiresRevealStage: "dream_substrate",
    },
  },
};
