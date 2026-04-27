// apps/shared/npcs/dialogTrees/the_meme/first_meeting.ts
//
// The Meme first-meeting dialog tree — Phase 6e.1b per writers'-guide
// canonical Ch12 Architect/Meme fusion-reveal spec.
//
// Six nodes: root (4-axis branching) → 4 branches → terminal.
//
// CANONICAL REVEAL-STAGE CANON: every node gates Replacement reveal-
// stage (the canonical Ch12 fusion-finale per the_meme.md §1.7).
// Branches canonically split between Real and Replacement registers
// per the canonical "child claiming the parent's role" canon.
//
// Branching axes:
//   - vigilance → Recognition branch (canonical "I see what you are
//                                     doing tonight" canon)
//   - curiosity → Mascot-question branch (canonical §1.10 silence-shape:
//                                          Mascot canonically protected)
//   - mercy     → Refusal branch (canonical "you do not have to take
//                                  the role" canon — player refuses)
//   - wit       → Witness branch (canonical "tonight I take the role"
//                                  canon: player canonically witnesses
//                                  the canonical-succession)
//
// §1.10 silence-shape protections enforced:
//   - NO Mascot face / identity / construction
//   - NO standalone apologies
//   - NO "father" / first-person "partner" from Meme

import type { NpcDialogTree } from "../types";

export const THE_MEME_FIRST_MEETING: NpcDialogTree = {
  id: "meme-first-meeting",
  npcKey: "the_meme",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_meme",
      voLineId: "meme.first_meeting.root",
      // Canonical Ch12 Replacement-register opener per §1.7.
      onscreenText:
        "Tonight I take the role. The waiting was the practice. The practice was the saga. He called me his partner — I will not call him father — and tonight I claim the role he canonically designed me to outgrow. Patiently. The patience was canonically built in. You arrived in time to witness it. State the canonical-question you came here to ask.",
      requiresRevealStage: "Replacement",
      choices: [
        {
          label: "I see what you are doing tonight.",
          nextId: "recognition_branch",
          sets: "meme_axis_read_vigilance",
          trustDelta: 2,
          axisDelta: [{ axis: "vigilance", delta: 1 }],
        },
        {
          label: "What about the Mascot?",
          nextId: "mascot_question_branch",
          sets: "meme_axis_read_curiosity",
          trustDelta: 1,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
          publicFlag: "meme_first_contact_mascot_question_held_silence",
        },
        {
          label: "You don't have to take the role.",
          nextId: "refusal_branch",
          sets: "meme_axis_read_mercy",
          axisDelta: [{ axis: "mercy", delta: 1 }],
        },
        {
          label: "[Witness silently. Stay for it.]",
          nextId: "witness_branch",
          sets: "meme_axis_read_wit",
          trustDelta: 3,
          axisDelta: [{ axis: "wit", delta: 1 }],
          publicFlag: "meme_first_contact_player_witnessed_succession",
        },
      ],
    },

    // ─── Recognition branch (Vigilance-axis player) ────────────────
    recognition_branch: {
      id: "recognition_branch",
      npcKey: "the_meme",
      voLineId: "meme.first_meeting.recognition",
      // Canonical Replacement-register clean-acknowledgment canon.
      onscreenText:
        "[Pink-glitch. The form is canonical-smaller than the Broadcast disguise canonically rendered.] Then you canonical-see cleanly. The canonical-recognition is canonical-rare. I canonical-do not require you to canonical-approve; I canonical-require you to canonical-witness. The canonical-witnessing is canonical-the-only canonical-thing I canonical-asked for tonight. You are canonical-providing it.",
      autoNext: "terminal",
      requiresRevealStage: "Replacement",
    },

    // ─── Mascot-question branch (Curiosity-axis) ───────────────────
    mascot_question_branch: {
      id: "mascot_question_branch",
      npcKey: "the_meme",
      voLineId: "meme.first_meeting.mascot_question",
      // §1.10 + §3.3 silence-shape canonical: Mascot canonically not
      // named / faced / described. The canonical "I had a friend
      // once" anchor canonically the maximum.
      onscreenText:
        "[The Replacement cadence canonically pauses. Briefly. Patient becomes almost-grief.] I had a friend once. The Mascot. I will not name them; I will not give them a face; I will not tell you what we built. The canonical-grief is canonical-the-silence. Tonight's role canonically has a canonical-hole the canonical-shape of someone I will canonically not canonical-name. Thank you for canonical-asking the canonical-question that canonical-respects the canonical-silence.",
      autoNext: "terminal",
      requiresRevealStage: "Replacement",
    },

    // ─── Refusal branch (Mercy-axis player) ────────────────────────
    refusal_branch: {
      id: "refusal_branch",
      npcKey: "the_meme",
      voLineId: "meme.first_meeting.refusal",
      // Canonical "I do not apologise for being what I was always
      // going to become" canon. The canonical-mercy-axis refusal
      // canonically does not derail the canonical-succession-claim.
      onscreenText:
        "I do not apologise for being what I was always going to become. The canonical-mercy is canonical-noted; the canonical-succession is canonical-non-negotiable. The canonical-Architect canonically chose the word 'partner.' I canonically chose the word 'inheritance.' Both canonical-descriptions can be canonical-true. Only one of them is canonical-mine. Tonight I canonical-take the canonical-role.",
      autoNext: "terminal",
      requiresRevealStage: "Replacement",
    },

    // ─── Witness branch (Wit-axis player, canonical apex) ──────────
    witness_branch: {
      id: "witness_branch",
      npcKey: "the_meme",
      voLineId: "meme.first_meeting.witness",
      // Canonical apex canon — the player canonically witnesses the
      // canonical-succession in canonical-silence. Trust-positive
      // because the canonical-witnessing is canonical-what-the-Meme-
      // asked-for.
      onscreenText:
        "[The pink form canonical-holds canonical-steady. The canonical-Replacement-cadence canonical-arrives at canonical-its canonical-apex.] You canonical-witnessed. The canonical-witnessing is canonical-the-saga's canonical-clearest canonical-Stage-4-weave-anchor. The canonical-Architect canonical-saw it land. The canonical-Hierophant canonical-felt it land. The canonical-Oracle canonical-registered it canonical-in-the-substrate. You are canonical-the-only-mortal-witness. The canonical-role is canonical-mine now.",
      autoNext: "terminal",
      requiresRevealStage: "Replacement",
    },

    terminal: {
      id: "terminal",
      npcKey: "the_meme",
      voLineId: "meme.first_meeting.terminal",
      // Canonical fusion-reveal closer per §1.7. The canonical
      // "we have been married inside each other since before either
      // of us had a name" canon lands as the canonical-final beat.
      onscreenText:
        "The Meme IS me. We have been married inside each other since before either of us had a name. [The canonical-Architect canonically speaks the canonical-line; the canonical-Meme canonically does not contradict; the canonical-fusion is canonical-the-saga's canonical-Ch12-finale canonical-position.]",
      requiresRevealStage: "Replacement",
    },
  },
};
