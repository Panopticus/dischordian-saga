/* ═══════════════════════════════════════════════════════
   GHOST-PLAYER vs. HERETIC-NEMESIS — Phase K5 template

   The ghost trains in silence; the heretic preaches the
   truer cause. This is the maximally-asymmetric pairing
   in the 132-pair matrix — the player gives nothing
   away, the Nemesis cannot stop revealing themselves.

   Picard-vs-Q register, dreamer canon: respect grows
   despite the asymmetry. By high-grudge the Heretic-
   Nemesis stops trying to convert the player and starts
   trying to be heard.

   This file is the AUTHORING TEMPLATE for the 132 pair-
   bank waterfall (Phase K5.2). Copy this file, rename to
   `{playerArchetype}_vs_{nemesisArchetype}.ts`, and write
   the per-grudge-band variants.
   ═══════════════════════════════════════════════════════ */

import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

/* ─── First-sighting scene (Phase K5.1 #1) ─── */

const FIRST_SIGHTING_LOW: DialogTree = {
  id: "ghost_vs_heretic.first_sighting.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_heretic.first_sighting.low.opening",
      onscreenText:
        "I have been told you exist. I had not believed it. Welcome to the truer cause.",
      choices: [
        {
          label: "Say nothing.",
          nextId: "ghost_silence",
          sets: "nemesis_ghost_silence_at_first_meeting",
        },
        {
          label: "Watch them.",
          nextId: "ghost_watch",
        },
      ],
    },
    ghost_silence: {
      id: "ghost_silence",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_heretic.first_sighting.low.silence_response",
      onscreenText:
        "You don't speak. Of course. The Politician used to say silence was a kind of vote. I am inclined to disagree.",
    },
    ghost_watch: {
      id: "ghost_watch",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_heretic.first_sighting.low.watch_response",
      onscreenText:
        "You are taking my measure. Take it. I will be precisely as I appear: the truer cause, walking.",
    },
  },
};

const FIRST_SIGHTING_MID: DialogTree = {
  id: "ghost_vs_heretic.first_sighting.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_heretic.first_sighting.mid.opening",
      onscreenText:
        "We've crossed before. You haven't acknowledged it. Welcome to the truer cause — again.",
      choices: [
        {
          label: "Look away.",
          nextId: "ghost_disregard",
          sets: "mercy_choice_at_grudge_mid",
        },
        {
          label: "Mark them.",
          nextId: "ghost_mark",
          sets: "aggression_choice_at_grudge_mid",
        },
      ],
    },
    ghost_disregard: {
      id: "ghost_disregard",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_heretic.first_sighting.mid.disregard_response",
      onscreenText:
        "Disregard noted. The Politician used to file these. I will too. Welcome to the truer cause.",
    },
    ghost_mark: {
      id: "ghost_mark",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_heretic.first_sighting.mid.mark_response",
      onscreenText:
        "Marked. I'll mark you back, three taps. Welcome to the truer cause.",
    },
  },
};

const FIRST_SIGHTING_HIGH: DialogTree = {
  id: "ghost_vs_heretic.first_sighting.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_heretic.first_sighting.high.opening",
      onscreenText:
        "I have stopped trying to convert you. I came here to tell you that. Welcome to the truer cause — but you are the cause now, aren't you. Welcome.",
      choices: [
        {
          label: "Show mercy.",
          nextId: "ghost_mercy",
          sets: "mercy_at_high_grudge_with_nemesis",
        },
        {
          label: "Give the kill.",
          nextId: "ghost_kill",
          sets: "killed_nemesis_at_high_grudge",
        },
        {
          label: "Walk past them.",
          nextId: "ghost_pass",
          sets: "fled_nemesis_at_high_grudge",
        },
      ],
    },
    ghost_mercy: {
      id: "ghost_mercy",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_heretic.first_sighting.high.mercy_response",
      onscreenText:
        "Mercy. From the silent one. I had not prepared for this sermon. Welcome to the truer cause — I am listening for once.",
    },
    ghost_kill: {
      id: "ghost_kill",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_heretic.first_sighting.high.kill_response",
      onscreenText:
        "I will be back. The Politician said the truer cause cannot be killed; only re-spoken by a smaller mouth. Welcome to the truer cause.",
    },
    ghost_pass: {
      id: "ghost_pass",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_heretic.first_sighting.high.pass_response",
      onscreenText:
        "You're walking past me. As though I am not here. The Politician would have applauded. Welcome to the truer cause.",
    },
  },
};

/* ─── The pair-bank export ─── */

export const ghostVsHereticPairBank: NemesisPairBank = {
  pairId: "ghost_vs_heretic",
  playerArchetype: "ghost",
  nemesisArchetype: "heretic",
  scenes: {
    first_sighting: makeScene({
      low: FIRST_SIGHTING_LOW,
      mid: FIRST_SIGHTING_MID,
      high: FIRST_SIGHTING_HIGH,
    }),
    // The remaining 7 scenes are part of the K5.2
    // authoring waterfall. The parity check counts this
    // file as 1 of 132; per-scene coverage is a future
    // RATCHET layer once authoring stabilizes.
  },
};
