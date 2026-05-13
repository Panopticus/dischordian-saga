/* ═══════════════════════════════════════════════════════
   GHOST-APPRENTICE on HERETIC-NEMESIS — Phase K6.2 template

   The player's Ghost-archetype apprentice has dialog about
   their Heretic-archetype Nemesis. Mirrors the K5
   ghost_vs_heretic.ts pair-bank from the Nemesis side.

   Authoring template — copy-rename for the other 131
   pairings. The parity check counts files matching
   `*_on_*.ts` in this directory.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeOnNemesisPairBank } from "./_types";
import { makeApprenticeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

const MORNING_LOW: DialogTree = {
  id: "ghost_on_heretic.morning.low",
  nodes: {
    root: {
      id: "root",
      speaker: "apprentice",
      voLineId: "apprentice.ghost_on_heretic.morning.low.opening",
      onscreenText:
        "There was someone in the corridor last night. Heretic-cadence. They preached. I did not respond. I did not need to.",
      choices: [
        {
          label: "Acknowledge.",
          nextId: "player_ack",
        },
        {
          label: "Move on.",
          nextId: "player_dismiss",
        },
      ],
    },
    player_ack: {
      id: "player_ack",
      speaker: "apprentice",
      voLineId: "apprentice.ghost_on_heretic.morning.low.ack_response",
      onscreenText:
        "Good. They will be back. They cannot help it. The cause is the only thing they know how to be.",
    },
    player_dismiss: {
      id: "player_dismiss",
      speaker: "apprentice",
      voLineId: "apprentice.ghost_on_heretic.morning.low.dismiss_response",
      onscreenText:
        "Yes. Same again tomorrow.",
    },
  },
};

const MORNING_MID: DialogTree = {
  id: "ghost_on_heretic.morning.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "apprentice",
      voLineId: "apprentice.ghost_on_heretic.morning.mid.opening",
      onscreenText:
        "They came again. They had words for me. Mine specifically. The truer cause has my number now.",
      choices: [
        {
          label: "Steady them.",
          nextId: "steady",
          sets: "apprentice_bond_deepens_mid_corruption",
        },
        {
          label: "Test their resolve.",
          nextId: "test",
        },
      ],
    },
    steady: {
      id: "steady",
      speaker: "apprentice",
      voLineId: "apprentice.ghost_on_heretic.morning.mid.steady_response",
      onscreenText:
        "Thank you. I will hold the line. The cause does not get a vote on what I am.",
    },
    test: {
      id: "test",
      speaker: "apprentice",
      voLineId: "apprentice.ghost_on_heretic.morning.mid.test_response",
      onscreenText:
        "Tested. Held. They will be back. I will be here.",
    },
  },
};

const MORNING_HIGH: DialogTree = {
  id: "ghost_on_heretic.morning.high",
  nodes: {
    root: {
      id: "root",
      speaker: "apprentice",
      voLineId: "apprentice.ghost_on_heretic.morning.high.opening",
      onscreenText:
        "The truer cause sounds like our cause now. I cannot tell which side I dreamed on. Help me, or let me go.",
      choices: [
        {
          label: "Help.",
          nextId: "help",
          sets: "apprentice_held_at_breaking_point_via_player_intervention",
        },
        {
          label: "Let go.",
          nextId: "release",
          sets: "apprentice_released_to_nemesis",
        },
      ],
    },
    help: {
      id: "help",
      speaker: "apprentice",
      voLineId: "apprentice.ghost_on_heretic.morning.high.help_response",
      onscreenText:
        "I am here. I am still here. The cause was loud. Your hand is louder.",
    },
    release: {
      id: "release",
      speaker: "apprentice",
      voLineId: "apprentice.ghost_on_heretic.morning.high.release_response",
      onscreenText:
        "Then I am theirs. The truer cause was always going to win this argument. I'm sorry.",
    },
  },
};

export const ghostOnHereticPairBank: ApprenticeOnNemesisPairBank = {
  pairId: "ghost_on_heretic",
  apprenticeArchetype: "ghost",
  nemesisArchetype: "heretic",
  scenes: {
    cohort_morning_briefing: makeApprenticeScene({
      low: MORNING_LOW,
      mid: MORNING_MID,
      high: MORNING_HIGH,
    }),
    // Remaining 7 scenes: K6.2 authoring waterfall.
  },
};
