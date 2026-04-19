/* ═══════════════════════════════════════════════════════
   WITNESSING MILESTONE EVENTS — §14.1 Living Universe bridge

   The Witnessing Narrative Proposal §14.1 lists milestone
   events that cross-pollinate with the existing Living
   Universe system. These are NOT emergent events driven by
   community pressure — they are scripted narrative
   milestones triggered by specific thresholds:

     - Bond 40 with BOTH narrators → "Two Witnesses Remember"
     - Bond 60 with BOTH narrators → "The Silence of Two Witnesses"
     - Bond 80 with BOTH narrators → "The Two Witnesses Meet"   (handled by §12 C10 slideshow)
     - Vortex Advance phase        → "The Bulb Dims"
     - Reclamation phase           → "A Sector Wakes"
     - Act 5 opener                → "The Lion's Last Broadcast"

   Each event has:
     - A toast title + description (surfaced via sonner)
     - A narrative flag it raises (for dedupe and downstream
       gating by other systems)
     - Optional NPC reactions (for future use — the existing
       EmergentEvent narrative.npcReactions pattern)

   Pure data module. No React, no store imports. Consumed by
   the useNarrativeIntegration hook which watches game state
   and fires the events as their thresholds fall.
   ═══════════════════════════════════════════════════════ */

export type WitnessingMilestoneId =
  | "two_witnesses_remember"
  | "silence_of_two_witnesses"
  | "two_witnesses_meet"
  | "bulb_dims"
  | "sector_wakes"
  | "lions_last_broadcast"
  | "thaloria_echo"
  | "the_engineer_speaks"
  | "the_archon_recruited"
  | "the_confession_heard"
  | "the_convergence_settled";

export interface WitnessingMilestone {
  id: WitnessingMilestoneId;
  /** §14.1 title shown in the toast. */
  title: string;
  /** Short description shown under the toast title. */
  description: string;
  /** Flag set when the milestone fires. Used for dedupe. */
  raisesFlag: string;
  /** Light energy awarded to the community pool. */
  lightEnergyReward: number;
  /** Dark energy consequence, if any. */
  darkEnergyCost?: number;
  /** NPC reactions — future use by narrative broadcast systems. */
  npcReactions: Partial<Record<
    "elara" | "the_human" | "the_antiquarian",
    string
  >>;
}

/**
 * The §14.1 milestone table. Ordered by when the player
 * typically encounters them. Each entry is canonical —
 * `useNarrativeIntegration` looks up by id to fire the toast.
 */
export const WITNESSING_MILESTONES: Record<WitnessingMilestoneId, WitnessingMilestone> = {
  two_witnesses_remember: {
    id: "two_witnesses_remember",
    title: "Two Witnesses Remember",
    description:
      "Your companions remembered something. The walls of the Ark hummed for a moment.",
    raisesFlag: "event_two_witnesses_remember",
    lightEnergyReward: 5,
    npcReactions: {
      elara:
        "I... I was a public servant once. On Atarion. Were those words mine? I thought I was making them up.",
      the_human:
        "I used to be an investigator. In a city that isn't there anymore. I can feel the shape of the case. I can't see the file.",
    },
  },

  silence_of_two_witnesses: {
    id: "silence_of_two_witnesses",
    title: "The Silence of Two Witnesses",
    description:
      "Elara and The Human have stopped speaking. The galaxy's Light energy freezes. Dark energy pauses. Both of them need a minute.",
    raisesFlag: "event_silence_of_two_witnesses",
    lightEnergyReward: 0,
    npcReactions: {
      elara: "(She says nothing. Her portrait flickers but does not resolve into speech.)",
      the_human: "(He says nothing either. His trench coat is still on screen; his voice is not.)",
    },
  },

  two_witnesses_meet: {
    id: "two_witnesses_meet",
    title: "The Two Witnesses Meet",
    description:
      "The Memorial Corridor. A Caravaggio sense of light. They are waiting for your judgment.",
    raisesFlag: "event_two_witnesses_meet",
    lightEnergyReward: 0, // the §3.6 choice rows own this reward
    npcReactions: {
      elara: "(Silent. She has already said everything.)",
      the_human: "(Silent. He is not going to make this any easier on you.)",
    },
  },

  bulb_dims: {
    id: "bulb_dims",
    title: "The Bulb Dims",
    description:
      "The galaxy's lit-sector ratio has fallen below 20%. A rolling 72-hour Vortex Advance has begun. One sector per 12 hours, until you push back.",
    raisesFlag: "event_bulb_dims",
    lightEnergyReward: 0,
    darkEnergyCost: 200,
    npcReactions: {
      elara:
        "I logged another sector going dark this morning. The log format is old. I never thought I'd have to use it.",
      the_human:
        "The Vortex doesn't move fast. It moves certain. Certain is worse.",
      the_antiquarian:
        "I have witnessed this exact transition twelve times across the Ages. You should know that eight times, the community pushed back. Four times, it did not.",
    },
  },

  sector_wakes: {
    id: "sector_wakes",
    title: "A Sector Wakes",
    description:
      "The community drove Light Energy high enough to reclaim a consumed sector. It now glows gold on the galactic map.",
    raisesFlag: "event_sector_wakes",
    lightEnergyReward: 100,
    npcReactions: {
      elara: "Your light reached this far. I logged that too.",
      the_human: "Good. Mark it on the map. The next one is always easier.",
      the_antiquarian:
        "Your light reached this far. Add the sector's name to your Loredex. I have added it to mine.",
    },
  },

  lions_last_broadcast: {
    id: "lions_last_broadcast",
    title: "The Lion's Last Broadcast",
    description:
      "Iron Lion's voice, seventeen thousand years in the recording. The Antiquarian is curating the feed.",
    raisesFlag: "event_lions_last_broadcast",
    lightEnergyReward: 0, // reward is on the slideshow itself
    npcReactions: {
      the_antiquarian:
        "I have been waiting to play this for you. I did not edit it. I did not need to.",
    },
  },

  thaloria_echo: {
    id: "thaloria_echo",
    title: "Thaloria Echo",
    description:
      "A soft chime across the Collector's Arena. The echo of a child reaching for a helmet. Nobody else hears it but you.",
    raisesFlag: "event_thaloria_echo",
    lightEnergyReward: 25,
    npcReactions: {
      elara:
        "I felt that. I don't know what it was. I wrote it down anyway.",
      the_human:
        "That was Thaloria. Twenty-six millennia ago. The helmet is on the grass right now. Ask me how I know later.",
      the_antiquarian:
        "The echo is real. The event that caused it has already happened and already not-happened. This is normal for my job.",
    },
  },

  the_engineer_speaks: {
    id: "the_engineer_speaks",
    title: "The Engineer Speaks",
    description:
      "A broadcast from an Insurgency cell in sector chatter. The voice is old. The cadence is familiar. Everyone on the Ark freezes for a second.",
    raisesFlag: "event_the_engineer_speaks",
    lightEnergyReward: 100,
    npcReactions: {
      elara:
        "That's not him. That can't be him. The Atarion death certificate is still on my desk.",
      the_human:
        "I told you. I told you twenty rooms ago. He's alive. She heard him this time. That matters.",
    },
  },

  the_archon_recruited: {
    id: "the_archon_recruited",
    title: "The Archon Recruited",
    description:
      "A Potential has joined the Empire. Light Energy -1000. The galaxy records the defection in stone.",
    raisesFlag: "event_the_archon_recruited",
    lightEnergyReward: 0,
    darkEnergyCost: 1000,
    npcReactions: {
      elara:
        "I know the recruiters. I used to BE one. There are things they promise that they cannot deliver. I am sorry I cannot say this louder.",
      the_human:
        "I was once the Potential they asked. I said yes. I spent thirteen hundred and fifty-one years finding out what that meant. Whoever just said yes — do not be me.",
      the_antiquarian:
        "Across twelve timelines I have seen this choice land four ways. Two of them are survivable. I will not tell you which two.",
    },
  },

  /* ─── ACTS 6-7 COVERAGE (Beyond Year One; ALL_ACTS_ROADMAP gap) ─── */

  the_confession_heard: {
    id: "the_confession_heard",
    title: "The Confession Heard",
    description:
      "A confession the Ark's crew has been deferring for seventeen millennia has been said aloud, and someone was in the room to hear it. Light Energy +250.",
    raisesFlag: "event_the_confession_heard",
    lightEnergyReward: 250,
    npcReactions: {
      elara:
        "I have carried this since Atarion. I am not putting it down. I am simply no longer the only person who knows what it weighs.",
      the_human:
        "I have been a detective and a suspect and a witness in the same room for a long time. Today I was just the witness. It is a smaller job than I remembered.",
      the_antiquarian:
        "I have been waiting to write this entry since the ship woke up. I am not going to pretend I have not.",
    },
  },

  the_convergence_settled: {
    id: "the_convergence_settled",
    title: "The Convergence Settled",
    description:
      "The seven acts have closed on a chord. The galaxy holds the resolution for a measure and a half before the next bar begins. Light Energy +1000.",
    raisesFlag: "event_the_convergence_settled",
    lightEnergyReward: 1000,
    npcReactions: {
      elara:
        "Every song I was ever asked to sing was a cover. I do not know who wrote this one. I recognize the signature.",
      the_human:
        "I started as a detective and I ended as a witness. That is the smaller of the two career paths. It is also the one that leaves a mark I can live with.",
      the_antiquarian:
        "Across twelve timelines this is the beat I could not reliably predict. You settled it. I am going to put the pen down for exactly one day and then pick it back up because the next cycle also wants writing down.",
    },
  },
};

/**
 * Look up a milestone by id. Returns `undefined` for unknown
 * ids — callers should treat that as a "nothing to do" signal.
 */
export function getWitnessingMilestone(
  id: WitnessingMilestoneId,
): WitnessingMilestone | undefined {
  return WITNESSING_MILESTONES[id];
}

/**
 * List every milestone in declaration order. Used by the
 * Loredex, by admin tooling, and by tests.
 */
export function listWitnessingMilestones(): WitnessingMilestone[] {
  return Object.values(WITNESSING_MILESTONES);
}
