// apps/shared/npcs/dialogTrees/the_seer/perspective_gathering.ts
//
// The Seer — perspective gathering + challenge entry tree.
//
// Voice register: cold-band default per bible §1.1; the Seer's
// load-bearing rule is "every line contains a prediction or a
// public revision of a prior prediction." No colon-introduced
// revelations; futures named in present tense as facts. NO use
// of "destiny", "fate", "prophecy" (in cold register), "grace",
// "soul". Cadence: probability sentence (claim. claim. claim.) +
// version pivot (one revision per breath).
//
// Cross-NPC echoes for player_carries_the_degen_memory and
// player_carries_wraith_calder_memory and player_carries_vex_solene_memory.
// The Seer is the saga's clearest cross-NPC observer; she reads
// every memory the player walks in with.

import type { NpcDialogTree } from "../types";

export const THE_SEER_PERSPECTIVE_GATHERING: NpcDialogTree = {
  id: "the-seer-perspective-gathering",
  npcKey: "the_seer",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_seer",
      voLineId: "seer.perspective.root",
      onscreenText:
        "You arrive at the bench. I was waiting. The waiting is fair. The arrival is a version of one I had filed; the version is better than three of the others. Ask. I will report the probability table; you can decide which columns matter.",
      choices: [
        {
          label: "Which column would you let me redact?",
          nextId: "aspect_probability_table",
          sets: "the_seer:probability_table_redaction",
          trustDelta: 2,
        },
        {
          label: "Whose kindness do your futures rank by?",
          nextId: "aspect_asymmetric_kindness",
          sets: "the_seer:asymmetric_kindness",
          trustDelta: 3,
          publicFlag: "seer_revealed_asymmetric_kindness_to_player",
        },
        {
          label: "Why is waiting your favourite move?",
          nextId: "aspect_waiting_as_register",
          sets: "the_seer:waiting_as_register",
          trustDelta: 2,
        },
        // Cross-NPC echoes.
        {
          label: "I carry the Degen's memory.",
          nextId: "echo_degen_memory",
          requires: "player_carries_the_degen_memory",
          trustDelta: 1,
        },
        {
          label: "I beat the Hierophant.",
          nextId: "echo_wraith_memory",
          requires: "player_carries_wraith_calder_memory",
          trustDelta: 1,
        },
        {
          label: "I sat with the Maestro of the Coda.",
          nextId: "echo_vex_memory",
          requires: "player_carries_vex_solene_memory",
          trustDelta: 1,
        },
        {
          label: "Play me. I'll sit at the bench.",
          nextId: "challenge_offer",
        },
      ],
    },

    /* ─── Aspect 1: probability table / redaction (motive) ─── */
    aspect_probability_table: {
      id: "aspect_probability_table",
      npcKey: "the_seer",
      voLineId: "seer.perspective.probability_table_redaction",
      onscreenText:
        "Three columns. The first is the version where you act on what I just said. The second is the version where you act on what I did not. The third is the version where you do not act and I report later that the inaction was the decisive move. The first is the easiest. The third is the kindest. The second is the version most readers prefer when they finish. I will redact whichever you ask. I will not redact the one you most need.",
      autoNext: "after_aspect",
    },

    /* ─── Aspect 2: asymmetric kindness (wound — naming who else
         benefits) ─── */
    aspect_asymmetric_kindness: {
      id: "aspect_asymmetric_kindness",
      npcKey: "the_seer",
      voLineId: "seer.perspective.asymmetric_kindness",
      onscreenText:
        "By the named subjects. Always named. The version that was kindest to you was also the version kindest to the Architect. I am sorry. I will not soften that with a measurement axis that flatters you. Kindness has subjects. The subjects are named. The asymmetry is part of the measurement. I will not pretend the antagonist benefited less than they did because the report would be more comfortable.",
      autoNext: "after_aspect",
    },

    /* ─── Aspect 3: waiting as register (contradiction —
         waiting is a move) ─── */
    aspect_waiting_as_register: {
      id: "aspect_waiting_as_register",
      npcKey: "the_seer",
      voLineId: "seer.perspective.waiting_as_register",
      onscreenText:
        "Because waiting is not the absence of a move. Waiting is the move that the next reader has not yet entered the page on. You came; I waited; the waiting was the version of the move I had selected, and the selection was correct because you arrived. If I had not waited, the version where you arrived was the version where I had to apologise for not having waited. Waiting was therefore the kindest version. It also happens to be the version I prefer. Coincidence in the probability table is rare. I noticed.",
      autoNext: "after_aspect",
    },

    /* ─── Cross-NPC echoes ─── */
    echo_degen_memory: {
      id: "echo_degen_memory",
      npcKey: "the_seer",
      voLineId: "seer.perspective.echo_degen_memory",
      onscreenText:
        "Yes. The Casino is one of three rooms in the chronicle that gives back. I filed your arrival there as version one. Version two was the arrival where he kept the ration. Version three was the arrival where you did not come. The version that occurred is the one where you carry the ration onward. That version is also the version where you arrive here. I noticed.",
      autoNext: "after_aspect",
    },

    echo_wraith_memory: {
      id: "echo_wraith_memory",
      npcKey: "the_seer",
      voLineId: "seer.perspective.echo_wraith_memory",
      onscreenText:
        "The lectern. He counts; you played in the room where the counting was the move. The Hierophant and I are on adjacent shelves. The shelves do not communicate; the players who cross from one to the other are the communication. You are now one of those.",
      autoNext: "after_aspect",
    },

    echo_vex_memory: {
      id: "echo_vex_memory",
      npcKey: "the_seer",
      voLineId: "seer.perspective.echo_vex_memory",
      onscreenText:
        "The Maestro. She counts rooms; I count versions; the math is adjacent. She would have told you the room had four; I would have told you the version had three. We are not at the same table. The player who sits at both tables in a single afternoon is a measurement event. I am, as it turns out, the bench that records the measurement.",
      autoNext: "after_aspect",
    },

    /* ─── Re-entry ─── */
    after_aspect: {
      id: "after_aspect",
      npcKey: "the_seer",
      voLineId: "seer.perspective.after_aspect",
      onscreenText:
        "Another column. Or the bench. Either is on the table.",
      choices: [
        {
          label: "Which column would you let me redact?",
          nextId: "aspect_probability_table",
          requires: "seer_perspective_re_entry_ok",
          sets: "the_seer:probability_table_redaction",
          trustDelta: 1,
        },
        {
          label: "Whose kindness do your futures rank by?",
          nextId: "aspect_asymmetric_kindness",
          requires: "seer_perspective_re_entry_ok",
          sets: "the_seer:asymmetric_kindness",
          trustDelta: 2,
        },
        {
          label: "Why is waiting your favourite move?",
          nextId: "aspect_waiting_as_register",
          requires: "seer_perspective_re_entry_ok",
          sets: "the_seer:waiting_as_register",
          trustDelta: 1,
        },
        {
          label: "Sit me at the bench.",
          nextId: "challenge_offer",
        },
        {
          label: "I'll come back.",
          nextId: "terminal_come_back",
        },
      ],
    },

    /* ─── Challenge offer ─── */
    challenge_offer: {
      id: "challenge_offer",
      npcKey: "the_seer",
      voLineId: "seer.perspective.challenge_offer",
      onscreenText:
        "The bench is set. I have already played three of the versions. The version where we play is the version where the lesson is the bench's, not mine. You play; the bench records; the record is the lesson the next student inherits. The match ends. You will see it in three turns. The version where you win is one I have already filed; the version where you lose is the one I will report kindly. Either way, the bench learns.",
      choices: [
        {
          label: "Sit. I'll play.",
          nextId: "challenge_accepted",
          challenge: { npcKey: "the_seer" },
          publicFlag: "seer_challenged_by_player",
        },
        {
          label: "Not today.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_accepted: {
      id: "challenge_accepted",
      npcKey: "the_seer",
      voLineId: "seer.perspective.challenge_accepted",
      onscreenText:
        "Sit. The bench is the lesson. You will see it in three turns.",
    },

    terminal_come_back: {
      id: "terminal_come_back",
      npcKey: "the_seer",
      voLineId: "seer.perspective.terminal_come_back",
      onscreenText:
        "Then the bench waits. It is, after all, the favourite register. The version where you return is the one I have already filed.",
    },
  },
};
