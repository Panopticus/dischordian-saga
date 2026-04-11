/* ═══════════════════════════════════════════════════════
   PRELUDE CREW MISSIONS — §2.6 data shell.

   The three canonical away-missions from §2.6. Each mission
   is short (~3-5 min), runs from the Bridge once a crew
   member is aboard, and yields:

     - Resources for crafting
     - Bond with the crew member
     - Dischordia Memory Energy (the Act 2 crafting material)

   The third mission specifically recovers the burnt Seer's
   card and sets the `prelude_burnt_card_found` flag that
   triggers the §2.7 Archives opener beat.

   This is a DATA SHELL — the mission runner + the text
   adventure engine are not implemented. Future gameplay can
   look up these ids and run the mission steps.
   ═══════════════════════════════════════════════════════ */

export type PreludeMissionStepKind =
  | "text"
  | "choice"
  | "combat"
  | "puzzle"
  | "reveal";

export interface PreludeMissionStep {
  kind: PreludeMissionStepKind;
  /** Narrative text shown at this step. */
  text: string;
  /** Branching options for choice steps. */
  options?: { id: string; label: string; outcome: string }[];
}

export interface PreludeCrewMission {
  id:
    | "wreck_next_door"
    | "signal_from_nowhere"
    | "burnt_card";
  title: string;
  /** Short description for the mission board UI. */
  briefing: string;
  /** Which crew member leads this mission. */
  leader: "patch" | "zephyr_9" | "little_one";
  /** Approximate duration in minutes. */
  durationMins: number;
  /** Narrative steps that play out during the mission. */
  steps: PreludeMissionStep[];
  /** Flags raised on successful completion. */
  flagsOnSuccess: string[];
  /** Material / resource rewards. */
  rewards: {
    materialIds: string[];
    memoryEnergy: number;
    bondDelta: number;
  };
}

export const PRELUDE_CREW_MISSIONS: Record<
  "wreck_next_door" | "signal_from_nowhere" | "burnt_card",
  PreludeCrewMission
> = {
  wreck_next_door: {
    id: "wreck_next_door",
    title: "The Wreck Next Door",
    briefing:
      "A nearby Ark is a smoking wreck in the debris field. Board it. Find whatever's left.",
    leader: "patch",
    durationMins: 3,
    steps: [
      {
        kind: "text",
        text: "Patch seals his helmet. You seal yours. The tether snaps taut as you clear the airlock.",
      },
      {
        kind: "reveal",
        text: "The wreck is a mirror of your Ark — same layout, different crew. The cryo bay is full of bodies. None of them got out.",
      },
      {
        kind: "text",
        text: "You find a journal in the Captain's Quarters. The handwriting is a Potential's, just like yours. The last entry reads: 'The walls are talking. They are not lying. We were wrong to not listen.'",
      },
      {
        kind: "reveal",
        text: "First exposure to the idea that the Potentials are plural. Elara goes quiet on the comms. The Human does not.",
      },
    ],
    flagsOnSuccess: ["prelude_mission_wreck_complete", "potentials_are_plural"],
    rewards: {
      materialIds: ["salvage_plating", "dream_crystal_shard"],
      memoryEnergy: 25,
      bondDelta: 5,
    },
  },

  signal_from_nowhere: {
    id: "signal_from_nowhere",
    title: "The Signal from Nowhere",
    briefing:
      "A ping from an empty sector. No ship on the manifest. No record in the archives. Investigate.",
    leader: "zephyr_9",
    durationMins: 4,
    steps: [
      {
        kind: "text",
        text: "Zephyr-9 computes the jump. The empty sector is not empty. It is full of the memory of having been empty, which she can hear.",
      },
      {
        kind: "reveal",
        text: "The signal is a recording. It is Elara's voice. It is saying words Elara denies ever having said. The timestamp is one thousand, forty-eight years ago.",
      },
      {
        kind: "text",
        text: "Elara hears the recording through the comms and goes silent. The Human does not. He says, very quietly: 'That's the speech she gave at the ratification. I was in the gallery. She was wearing a blue dress. I remember the blue dress.'",
      },
    ],
    flagsOnSuccess: [
      "prelude_mission_signal_complete",
      "elara_pre_recording_exists",
    ],
    rewards: {
      materialIds: ["signal_fragment", "quarchon_prism"],
      memoryEnergy: 40,
      bondDelta: 5,
    },
  },

  burnt_card: {
    id: "burnt_card",
    title: "The Burnt Card",
    briefing:
      "A second fragment of the Seer's shattered deck, wedged in a small wreck. Retrieve it.",
    leader: "little_one",
    durationMins: 5,
    steps: [
      {
        kind: "text",
        text: "Little One does not speak on the mission. She holds the card wrapper you give her with both hands.",
      },
      {
        kind: "reveal",
        text: "The card is half-buried in ash. It is warm. The edges are black but the image is intact — a staff, a woman, a deck fanning in midair against a violet wall.",
      },
      {
        kind: "text",
        text: "You bring it back to the Ark. Little One walks it to the Archives herself. She knows the way. She should not know the way.",
      },
      {
        kind: "reveal",
        text: "The Archives unlock. The §2.7 Two Voices, One Deck cutscene fires. Act 1 begins.",
      },
    ],
    flagsOnSuccess: [
      "prelude_mission_burnt_card_complete",
      "prelude_burnt_card_found",
      "prelude_complete",
    ],
    rewards: {
      materialIds: ["burnt_tarot_fragment"],
      memoryEnergy: 100,
      bondDelta: 10,
    },
  },
};

/** List all three missions in the order the player should run them. */
export function listPreludeMissions(): PreludeCrewMission[] {
  return [
    PRELUDE_CREW_MISSIONS.wreck_next_door,
    PRELUDE_CREW_MISSIONS.signal_from_nowhere,
    PRELUDE_CREW_MISSIONS.burnt_card,
  ];
}

/** Look up a mission by id. */
export function getPreludeMission(
  id: "wreck_next_door" | "signal_from_nowhere" | "burnt_card",
): PreludeCrewMission {
  return PRELUDE_CREW_MISSIONS[id];
}
