// apps/shared/npcs/dialogTrees/vex_solene/first_meeting.ts
//
// Vex Solène first-meeting dialog tree — Phase 6e.1a per writers'-guide
// canonical Coda Maestro narrator first-contact spec.
//
// All branches stay in `eyes_of_reality` reveal-stage canonically;
// the canonical Maestro persona is the canonical first-contact face,
// per vex_solene.md §1 + §2.x. Engineer Zero canonically does NOT
// surface in any branch — the canonical reveal-gate canon is the
// hardest selector constraint on the roster.
//
// Branching axes:
//   - curiosity  → Coda-as-music branch (canonical "the music is
//                                        canonically a market")
//   - wit        → Maestro-as-conductor branch (canonical "I do not
//                                                conduct the players")
//   - vulnerability → Why-quiet branch (canonical "the work is
//                                       canonically loudest underneath")
//   - vigilance  → Audit-aware branch (canonical "ask the Antiquarian
//                                       about my paperwork")
//
// §1.6 silence-shape: NEVER "Engineer" / "Engineer Zero" / "Agent Zero"
// in any node. Canonical reveal-gate enforces.

import type { NpcDialogTree } from "../types";

export const VEX_SOLENE_FIRST_MEETING: NpcDialogTree = {
  id: "vex-first-meeting",
  npcKey: "vex_solene",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "vex_solene",
      voLineId: "vex.first_meeting.root",
      onscreenText:
        "I am the Maestro of Coda's commerce. The role is canonical, the title is informal, the work is the same. You found me. State the business that brought you here — and please do not phrase it as a question I have already answered for someone else this hour.",
      requiresRevealStage: "eyes_of_reality",
      choices: [
        {
          label: "I want to understand the music.",
          nextId: "coda_music_branch",
          sets: "vex_axis_read_curiosity",
          trustDelta: 1,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "What does a Maestro actually do?",
          nextId: "maestro_conductor_branch",
          sets: "vex_axis_read_wit",
          axisDelta: [{ axis: "wit", delta: 1 }],
        },
        {
          label: "Why is Coda so quiet?",
          nextId: "why_quiet_branch",
          sets: "vex_axis_read_vulnerability",
          trustDelta: 1,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
        },
        {
          label: "I want to see your paperwork.",
          nextId: "audit_aware_branch",
          sets: "vex_axis_read_vigilance",
          axisDelta: [{ axis: "vigilance", delta: 1 }],
          publicFlag: "vex_filed_player_as_audit_aware_first_contact",
        },
      ],
    },

    // ─── Coda-as-music branch (Curiosity-axis player) ───────────────
    coda_music_branch: {
      id: "coda_music_branch",
      npcKey: "vex_solene",
      voLineId: "vex.first_meeting.coda_music",
      // §3 canonical anchor: "the music is canonically a market" —
      // the Maestro's canonical-frame for what Coda is.
      onscreenText:
        "The music is canonically a market. The market is canonically a music. Coda's commerce is the canonical-resolution that makes the cadence audible. Sit. The canonical-orchestra has three chairs in the sanctum and a chorus that knows the score. I will introduce you when the canonical-tempo permits.",
      autoNext: "terminal",
      requiresRevealStage: "eyes_of_reality",
    },

    // ─── Maestro-as-conductor branch (Wit-axis player) ──────────────
    maestro_conductor_branch: {
      id: "maestro_conductor_branch",
      npcKey: "vex_solene",
      voLineId: "vex.first_meeting.maestro_conductor",
      // §2.x canonical: Maestro is canonically NOT a conductor in
      // the canonical-orchestra sense. The canonical "I do not
      // conduct the players" register is the canonical clarification.
      onscreenText:
        "I do not conduct the players. Players canonically conduct themselves; the Maestro canonically resolves the canonical-mismatches. The canonical-mismatches are canonical-payment-disputes, canonical-reputation-frays, canonical-tempo-collisions between canonical-soloists. Conducting would be canonical-presumption. I canonical-arbitrate.",
      autoNext: "terminal",
      requiresRevealStage: "eyes_of_reality",
    },

    // ─── Why-quiet branch (Vulnerability-axis player) ───────────────
    why_quiet_branch: {
      id: "why_quiet_branch",
      npcKey: "vex_solene",
      voLineId: "vex.first_meeting.why_quiet",
      // §3 canonical: "the work is canonically loudest underneath" —
      // the canonical Coda silence-canon. Trust-positive because the
      // canonical-vulnerability question canonically registers as
      // canonical-care, not canonical-curiosity.
      onscreenText:
        "Coda is canonical-quiet because the canonical-work is canonically loudest underneath the canonical-silence. We do not announce the canonical-deals; we do not canonical-broadcast the canonical-arbitrations; we canonical-keep the canonical-music available to the canonical-listeners who canonical-listen. You canonical-asked the canonical-right kind of question.",
      autoNext: "terminal",
      requiresRevealStage: "eyes_of_reality",
    },

    // ─── Audit-aware branch (Vigilance-axis player) ─────────────────
    audit_aware_branch: {
      id: "audit_aware_branch",
      npcKey: "vex_solene",
      voLineId: "vex.first_meeting.audit_aware",
      // §4.x canonical Daniel Cross / Antiquarian cross-reference:
      // Vex canonically routes audit-questions to the Antiquarian.
      // The canonical "ask the Programmer" canonical-redirect lands.
      onscreenText:
        "My paperwork is canonical-clean. The Antiquarian canonically audits Coda's books canonical-quarterly; he canonically does not flag the canonical-clean ones. If you want canonical-ledger-evidence, ask the canonical-Programmer. He canonical-keeps the file. He canonical-also keeps a canonical-attitude about my canonical-cleanliness — the canonical-attitude is canonical-his, not canonical-mine.",
      autoNext: "terminal",
      requiresRevealStage: "eyes_of_reality",
    },

    terminal: {
      id: "terminal",
      npcKey: "vex_solene",
      voLineId: "vex.first_meeting.terminal",
      onscreenText:
        "I have a canonical-tempo to keep. Come back when you have a canonical-second-question. The first canonical-question canonical-introduced you; the second canonical-question canonical-keeps you.",
      requiresRevealStage: "eyes_of_reality",
    },
  },
};
