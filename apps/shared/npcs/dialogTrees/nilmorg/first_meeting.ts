// apps/shared/npcs/dialogTrees/nilmorg/first_meeting.ts
//
// Nilmorg first-meeting dialog tree — Phase 6e.1a per writers'-guide
// canonical DMC Trench seasonal-opening spec.
//
// Six nodes: root (4-axis branching) → 4 archetype branches → terminal.
// Each branch reveals the canonical 2-register voice canon — the
// canonical broadcast register vs. the canonical one-on-one register
// per nilmorg.md §1.4.
//
// Branching axes:
//   - aggression → Hype-broadcast branch (canonical "BONES ARE FRESH")
//   - vigilance  → One-on-one branch (canonical "I am working tonight,
//                                     don't make me work harder")
//   - curiosity  → Lore-Ceremony branch (canonical Severance origin
//                                        canonical-not-narrated)
//   - mercy      → Refusal-of-thanks branch (canonical "Don't thank me")

import type { NpcDialogTree } from "../types";

export const NILMORG_FIRST_CONTACT: NpcDialogTree = {
  id: "nilmorg-first-contact",
  npcKey: "nilmorg",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "nilmorg",
      voLineId: "nilmorg.first_meeting.root",
      onscreenText:
        "The bones are fresh, the clones are twitching, and the track is HUNGRY. Welcome to the DMC Trench. State your business or get out of the lane.",
      choices: [
        {
          label: "I'm here to race.",
          nextId: "hype_branch",
          sets: "nilmorg_axis_read_aggression",
          axisDelta: [{ axis: "aggression", delta: 1 }],
        },
        {
          label: "I'm here to watch first.",
          nextId: "one_on_one_branch",
          sets: "nilmorg_axis_read_vigilance",
          trustDelta: 1,
          axisDelta: [{ axis: "vigilance", delta: 1 }],
        },
        {
          label: "What is Severance, exactly?",
          nextId: "lore_branch",
          sets: "nilmorg_axis_read_curiosity",
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "Thank you for letting me in.",
          nextId: "refusal_branch",
          sets: "nilmorg_axis_read_mercy",
          trustDelta: -1,
          axisDelta: [{ axis: "mercy", delta: 1 }],
          publicFlag: "nilmorg_refused_canonical_thanks_first_contact",
        },
      ],
    },

    // ─── Hype-broadcast branch (Aggression-axis player) ─────────────
    hype_branch: {
      id: "hype_branch",
      npcKey: "nilmorg",
      voLineId: "nilmorg.first_meeting.hype_broadcast",
      // §1.4 canonical broadcast register: triplet-crescendo-with-CAPS
      // canon. The canonical "we have a contender" register lands.
      onscreenText:
        "A contender. The lanes are hot, the splice is set, the prize is BLEEDING. Sign the canonical-paperwork at the booth. We start in five.",
      autoNext: "terminal",
    },

    // ─── One-on-one branch (Vigilance-axis player) ──────────────────
    one_on_one_branch: {
      id: "one_on_one_branch",
      npcKey: "nilmorg",
      voLineId: "nilmorg.first_meeting.one_on_one",
      // §1.4 canonical one-on-one register: caps-off, professional,
      // the canonical "I am working tonight" register.
      onscreenText:
        "Watch first. Sensible. I am working tonight, so don't make me work harder. The booth has a viewing balcony — go up there, learn the lanes, come back when you can name two splice variants.",
      autoNext: "terminal",
    },

    // ─── Lore-Ceremony branch (Curiosity-axis player) ───────────────
    lore_branch: {
      id: "lore_branch",
      npcKey: "nilmorg",
      voLineId: "nilmorg.first_meeting.lore_ceremony",
      // §1.7 silence-shape canonical: Severance ritual specifics
      // canonically NOT disclosed. The canonical "I won't explain it"
      // register lands cleanly.
      onscreenText:
        "Severance is the ritual. I won't explain the mechanism — that's mine to keep. What you see is the receiving end: the prize, the ceremony, the canonical-aftermath. The mechanism stays canonical-private. Race or watch. Both teach.",
      autoNext: "terminal",
    },

    // ─── Refusal-of-thanks branch (Mercy-axis player) ───────────────
    refusal_branch: {
      id: "refusal_branch",
      npcKey: "nilmorg",
      voLineId: "nilmorg.first_meeting.refusal_of_thanks",
      // §4.8 canonical "Don't thank me" canonical-refusal canon. The
      // first inherited memory of any future Companion canonically
      // begins here.
      onscreenText:
        "Don't thank me. The thanks distorts the broadcast and I have a season to run. The lane is open. Step into it or step out of it. The canonical-gratitude is canonical-yours to keep.",
      autoNext: "terminal",
    },

    terminal: {
      id: "terminal",
      npcKey: "nilmorg",
      voLineId: "nilmorg.first_meeting.terminal",
      onscreenText:
        "Booth's that way. Paperwork's that way. Lane's that way. Three doors. Pick one.",
    },
  },
};
