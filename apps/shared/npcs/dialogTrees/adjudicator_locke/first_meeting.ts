// apps/shared/npcs/dialogTrees/adjudicator_locke/first_meeting.ts
//
// Locke first-meeting dialog tree — Phase 6e scaffolding instantiated
// per writers'-guide canonical Trade Hub first-contact spec.
//
// Six nodes: root (4-axis branching) → 4 archetype branches → terminal.
// Each branch reveals a canonical Locke personality-variant register
// per adjudicator_locke.md §2.5 ("different pens, single hand").
//
// Branching axes:
//   - curiosity → Mercantile branch ("Good. Business I understand.")
//   - vigilance → Judicial branch (+trust; canonical "I am filing this")
//   - mercy     → Collegial branch (+trust; "Then someone is fortunate")
//   - wit       → Predatory branch (-trust; "I am filing that you said
//                                            that")
//
// All choices set canonical "locke_axis_read_<axis>" narrative flags so
// downstream banks can react to the canonical first-contact axis-read
// without re-querying the player profile.

import type { NpcDialogTree } from "../types";

export const ADJUDICATOR_LOCKE_FIRST_MEETING: NpcDialogTree = {
  id: "locke-first-meeting",
  npcKey: "adjudicator_locke",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.root",
      onscreenText:
        "Welcome to the Authority's ledger. Before you sign anything, I want to know which of us is buying.",
      choices: [
        {
          label: "I'm here to do business.",
          nextId: "mercantile_branch",
          sets: "locke_axis_read_curiosity",
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "I'm here to read the fine print first.",
          nextId: "judicial_branch",
          sets: "locke_axis_read_vigilance",
          trustDelta: 2,
          axisDelta: [{ axis: "vigilance", delta: 1 }],
        },
        {
          label: "I'm here because someone needs me to be.",
          nextId: "collegial_branch",
          sets: "locke_axis_read_mercy",
          trustDelta: 1,
          axisDelta: [{ axis: "mercy", delta: 1 }],
        },
        {
          label: "I'm here to find what you're hiding.",
          nextId: "predatory_branch",
          sets: "locke_axis_read_wit",
          trustDelta: -1,
          axisDelta: [{ axis: "wit", delta: 1 }],
          publicFlag: "locke_filed_player_as_predatory_first_contact",
        },
      ],
    },

    // ─── Mercantile branch (Curiosity-axis player) ──────────────────
    mercantile_branch: {
      id: "mercantile_branch",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.mercantile",
      onscreenText:
        "Good. Business I understand. Sit down. The chair is filed under 'unpriced'. We will see what category fits you by close of day.",
      autoNext: "terminal",
    },

    // ─── Judicial branch (Vigilance-axis player) ────────────────────
    judicial_branch: {
      id: "judicial_branch",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.judicial",
      // §2.5 Judicial register canonical: "I am filing this. You read
      // first. Most people do not." The register inverts the trust-
      // negative of suspicion into the canonical professional respect
      // anchor of the first-contact arc.
      onscreenText:
        "I am filing this. You read first. Most people do not. The ones who do are the ones I keep. Welcome to the docket.",
      autoNext: "terminal",
    },

    // ─── Collegial branch (Mercy-axis player) ───────────────────────
    collegial_branch: {
      id: "collegial_branch",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.collegial",
      onscreenText:
        "Then someone is fortunate. The Authority does not often hire on behalf of someone else. Tell me whose chair you are warming. I will adjust the file accordingly.",
      autoNext: "terminal",
    },

    // ─── Predatory branch (Wit-axis player) ─────────────────────────
    predatory_branch: {
      id: "predatory_branch",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.predatory",
      // §2.5 Predatory canonical: kindness-as-surplus pivots into the
      // canonical "I am filing that you said that" deferred-threat
      // when the player presents as suspicious-witty. Sit anyway is
      // the canonical hospitality-as-honeypot register.
      onscreenText:
        "I am filing that you said that. Sit anyway. We can find out together. Most counterparties don't ask the question that loud on day one. You did. The file thickens.",
      autoNext: "terminal",
    },

    terminal: {
      id: "terminal",
      npcKey: "adjudicator_locke",
      voLineId: "locke.first_meeting.terminal",
      onscreenText:
        "Now: which side of the ledger are you on today? Pick one. We can revise on the second meeting.",
    },
  },
};
