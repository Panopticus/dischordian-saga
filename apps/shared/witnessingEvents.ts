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
  | "lions_last_broadcast";

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
