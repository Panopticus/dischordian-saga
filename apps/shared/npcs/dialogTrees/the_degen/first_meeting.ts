// apps/shared/npcs/dialogTrees/the_degen/first_meeting.ts
//
// The Degen first-meeting dialog tree — Phase 6e.1c per writers'-guide
// canonical Casino first-game spec.
//
// Six nodes: root (4-axis branching) → 4 branches → terminal.
//
// Branching axes:
//   - aggression → All-in branch (canonical "Strategy is for cowards"
//                                  doctrine canon)
//   - curiosity  → Interesting-game branch (canonical Pedagogical
//                                            register)
//   - mercy      → Pacifist-at-table branch (canonical "courteous
//                                             adversary" canon)
//   - wit        → House-always-wins branch (canonical "house IS the
//                                             math" canon)
//
// Voice protections per the_degen.md §1.4 forbidden vocabulary:
//   - NO "fair" (idea offends him)
//   - NO standalone "sorry" (15,000-year canon)
//   - NO "forever" (entropy canon)
//   - NO religious vocabulary (soul / salvation / sin)
//   - "Mostly takes" leitmotif NOT used here (deploy-once canon)

import type { NpcDialogTree } from "../types";

export const THE_DEGEN_FIRST_GAME: NpcDialogTree = {
  id: "degen-first-game",
  npcKey: "the_degen",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_degen",
      voLineId: "degen.first_meeting.root",
      // Canonical Casino-welcome opener per existing
      // degen.signature.casino_welcome anchor.
      onscreenText:
        "Welcome to the Casino. The house has an edge. The edge is me. I will play you fairly. I will not, however, play you predictably. Strategy is for cowards. Sit down. What's it going to be tonight, friend?",
      choices: [
        {
          label: "Deal me in. All of it.",
          nextId: "all_in_branch",
          sets: "degen_axis_read_aggression",
          axisDelta: [{ axis: "aggression", delta: 1 }],
        },
        {
          label: "What's the most interesting game?",
          nextId: "interesting_game_branch",
          sets: "degen_axis_read_curiosity",
          trustDelta: 1,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "I just want to watch tonight.",
          nextId: "pacifist_branch",
          sets: "degen_axis_read_mercy",
          axisDelta: [{ axis: "mercy", delta: 1 }],
        },
        {
          label: "The house always wins. Why bother?",
          nextId: "house_wins_branch",
          sets: "degen_axis_read_wit",
          trustDelta: 2,
          axisDelta: [{ axis: "wit", delta: 1 }],
          publicFlag: "degen_filed_player_as_house_aware_first_contact",
        },
      ],
    },

    // ─── All-in branch (Aggression-axis player) ────────────────────
    all_in_branch: {
      id: "all_in_branch",
      npcKey: "the_degen",
      voLineId: "degen.first_meeting.all_in",
      // Canonical "Strategy is for cowards" doctrine canon. The
      // canonical-aggression read canonically matches the Degen's
      // canonical-All-in archetype.
      onscreenText:
        "All-in on the first hand. I respect the WEIGHT of that. Strategy is for cowards. Pacing is for people who plan to die slowly. I plan to die loud, when the arithmetic catches up. The arithmetic and you canonically agree on the cadence tonight. Sign the paperwork at the booth — they keep one copy.",
      autoNext: "terminal",
    },

    // ─── Interesting-game branch (Curiosity-axis) ──────────────────
    interesting_game_branch: {
      id: "interesting_game_branch",
      npcKey: "the_degen",
      voLineId: "degen.first_meeting.interesting_game",
      // Canonical Pedagogical register: casino-as-classroom canon.
      onscreenText:
        "The most interesting game depends on what you came here to learn. Nebula Poker teaches patience under canonical-information-asymmetry. Entropy Dice teaches surrender to a canonical-process you cannot influence. Pazaak teaches that strategy works until it doesn't. Pick the lesson; the game will follow.",
      autoNext: "terminal",
    },

    // ─── Pacifist-at-table branch (Mercy-axis) ─────────────────────
    pacifist_branch: {
      id: "pacifist_branch",
      npcKey: "the_degen",
      voLineId: "degen.first_meeting.pacifist",
      // Canonical Pacifist-at-the-table archetype canon. The
      // canonical "courteous adversary" register lands.
      onscreenText:
        "Watching is a respectable opening move, friend. The Casino canonically reads watchers under three indices: hungry, curious, and looking-for-someone. You will be filed under all three until I learn which one is canonical-yours. The viewing balcony has a chair. Sit. Drink something. I will be down here, dealing.",
      autoNext: "terminal",
    },

    // ─── House-always-wins branch (Wit-axis player) ────────────────
    house_wins_branch: {
      id: "house_wins_branch",
      npcKey: "the_degen",
      voLineId: "degen.first_meeting.house_wins",
      // Canonical "house IS the math" canon per ask_house_always_wins.
      // The canonical Wit-axis recognition canonically lands trust-
      // positive — the player canonical-sees the Casino-as-system.
      onscreenText:
        "Because the house IS the math, friend. The house isn't an opponent at the table; the house is the table. The house is also the chips. You can't beat the room. You can play in it well. That's the difference. Why bother? Because canonical-bothering is the only canonical-honest thing the Casino sells. The arithmetic loves you back, briefly, while you canonical-bother.",
      autoNext: "terminal",
    },

    terminal: {
      id: "terminal",
      npcKey: "the_degen",
      voLineId: "degen.first_meeting.terminal",
      onscreenText:
        "The booth, the bar, or the back-room. Three doors. The Casino has more, but those are for people I have already been canonical-introduced to. Pick a door, friend. The arithmetic is waiting.",
    },
  },
};
