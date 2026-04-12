/**
 * engineerGovernanceVotes.ts
 *
 * 7 governance votes tied to the Engineer's holographic recordings.
 * Each vote is proposed after a recording is discovered — the community
 * shapes how the Engineer's story resolves while learning the lore.
 *
 * Follows the CommunityVote pattern from governance.ts.
 */

import type { CommunityVote } from "./governance";
import type { HoloRecordingId } from "./engineerRecordings";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EngineerGovernanceVote extends CommunityVote {
  /** Which recording triggers this vote. */
  readonly triggeredByRecording: HoloRecordingId;
  /** Flag that must be raised for this vote to appear. */
  readonly requiresFlag: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const ENGINEER_GOVERNANCE_VOTES: readonly EngineerGovernanceVote[] = [
  // --- Vote 1: After Recording 1 ---
  {
    id: "engineer_vote_bench_power",
    month: 0,
    week: 0,
    question: "The bench is humming. Do we power it up or contain it?",
    proposedBy: "Elara",
    antiquarianIntro:
      "And so the forge of the fallen prince stirred in its slumber, " +
      "humming a frequency none had heard since his departure. The Potentials " +
      "gathered to decide: shall we feed the flame, or smother it before " +
      "it draws attention we cannot afford?",
    options: [
      {
        id: "power_up",
        label: "Power it up",
        description: "Activate the bench at full capacity. Risk Vortex attention.",
        consequences: [
          "Crafting bonus for one week",
          "Deck resonance increases",
          "Vortex proximity +5",
        ],
        icon: "lightning",
      },
      {
        id: "contain",
        label: "Contain it",
        description: "Suppress the humming. Keep a low profile.",
        consequences: [
          "Dark energy reduction -10",
          "Bench operates at reduced capacity",
          "Vortex proximity unchanged",
        ],
        icon: "shield",
      },
    ],
    durationHours: 168,
    category: "crisis",
    affectedSystems: ["crafting", "dischordia_cycle", "living_universe"],
    quorum: 50,
    triggeredByRecording: "holo_wake_the_bench",
    requiresFlag: "engineer_recording_1_discovered",
  },

  // --- Vote 2: After Recording 2 ---
  {
    id: "engineer_vote_ghost_network",
    month: 0,
    week: 0,
    question:
      "He saved his entire class and hid them across the universe. Was " +
      "building a secret network the right response to Celebration's horrors?",
    proposedBy: "The Antiquarian",
    antiquarianIntro:
      "The prince saw the loop — the 4-year reset, the death traps, his " +
      "family as props in an endless play. Rather than flee, he dismantled " +
      "the machinery of death and scattered his classmates like seeds in " +
      "fertile soil. Was this wisdom, or the beginning of a shadow empire?",
    options: [
      {
        id: "right",
        label: "It was the right call",
        description: "Building the Ghost Network saved lives without violence.",
        consequences: [
          "Light energy surge +30",
          "Unlock Ghost Network intel transmissions",
          "Engineer's network contacts become available as trade partners",
        ],
        icon: "network",
      },
      {
        id: "wrong",
        label: "It was a dangerous gamble",
        description:
          "A secret network of geniuses answering to one person is a liability.",
        consequences: [
          "Unlock alternate perspective on what the network became",
          "Dark energy +10 (doubt)",
          "Unlock Watcher's file on the Ghost Network",
        ],
        icon: "eye",
      },
    ],
    durationHours: 168,
    category: "monthly",
    affectedSystems: ["trade_empire", "living_universe", "transmissions"],
    quorum: 50,
    triggeredByRecording: "holo_princes_notebook",
    requiresFlag: "engineer_recording_2_discovered",
  },

  // --- Vote 3: After Recording 3 ---
  {
    id: "engineer_vote_thought_vs_violence",
    month: 0,
    week: 0,
    question:
      "Revolution of thought or violent resistance? The Engineer chose " +
      "thought every time — until they killed his friends. Was he right to wait?",
    proposedBy: "The Human",
    antiquarianIntro:
      "The detective poses a question that has no comfortable answer. " +
      "The prince believed that changing minds was stronger than breaking " +
      "bodies. He held this conviction until the bodies they broke were " +
      "the ones he loved. Was the waiting wisdom, or was it the luxury of " +
      "one who had not yet been tested?",
    options: [
      {
        id: "thought",
        label: "Revolution of thought",
        description:
          "The Engineer was right to try diplomacy first. Violence should always be the last resort.",
        consequences: [
          "Diplomacy bonuses in Trade Empire",
          "Unlock the Engineer's writings on passive resistance",
          "Light energy +15",
        ],
        icon: "book",
      },
      {
        id: "violence",
        label: "Violent resistance",
        description:
          "The Empire only understands force. Waiting cost the Eyes their life.",
        consequences: [
          "Combat bonuses for one week",
          "Unlock Insurgency files on what the Ghost Network could have done",
          "Dark energy +15",
        ],
        icon: "sword",
      },
    ],
    durationHours: 168,
    category: "monthly",
    affectedSystems: ["trade_empire", "combat", "transmissions"],
    quorum: 50,
    triggeredByRecording: "holo_worlds_i_saved",
    requiresFlag: "engineer_recording_3_discovered",
  },

  // --- Vote 4: After Recording 4 ---
  {
    id: "engineer_vote_fought_sooner",
    month: 0,
    week: 0,
    question:
      "The Eyes helped him build the invisible network. Now the Eyes are " +
      "dead. Should the Engineer have fought sooner — or did the network " +
      "only work BECAUSE he stayed peaceful?",
    proposedBy: "Agent Zero Signal",
    antiquarianIntro:
      "A signal from beyond the veil — Agent Zero's frequency, though she " +
      "herself may not know she sends it. The question arrives wrapped in " +
      "static and grief: did the prince's patience cost the Eyes their " +
      "life, or was the network's invisibility the very thing that kept " +
      "everyone else alive?",
    options: [
      {
        id: "sooner",
        label: "He should have fought sooner",
        description:
          "The Eyes might be alive if the Engineer had acted instead of theorizing.",
        consequences: [
          "Insurgency reputation +20",
          "Dark energy +10",
          "Unlock combat intel from the Ghost Network",
        ],
        icon: "fist",
      },
      {
        id: "patience",
        label: "The network required peace",
        description:
          "Violence would have exposed the Ghost Network and everyone in it.",
        consequences: [
          "Unlock the Engineer's private journal on the Eyes",
          "Light energy +10",
          "Trade Empire stealth bonus",
        ],
        icon: "hourglass",
      },
    ],
    durationHours: 168,
    category: "monthly",
    affectedSystems: ["combat", "trade_empire", "living_universe"],
    quorum: 50,
    triggeredByRecording: "holo_line_they_crossed",
    requiresFlag: "engineer_recording_4_discovered",
  },

  // --- Vote 5: After Recording 5 ---
  {
    id: "engineer_vote_kaels_choice",
    month: 0,
    week: 0,
    question:
      "He told Kael which Ark to steal. Was that his choice to make?",
    proposedBy: "The Source (Kael)",
    antiquarianIntro:
      "The Oracle — imprisoned, diminished, but unbroken — speaks through " +
      "the frequency the prince tuned for him. The question is not whether " +
      "the instructions were correct. They were. The question is whether " +
      "one mind, however brilliant, has the right to choose another's path " +
      "— even when that path leads to freedom.",
    options: [
      {
        id: "his_choice",
        label: "It was his choice to make",
        description:
          "The Engineer had the information. Kael was imprisoned. Someone had to decide.",
        consequences: [
          "Crafting blueprints unlock",
          "Bench efficiency +10%",
          "Light energy +10",
        ],
        icon: "blueprint",
      },
      {
        id: "not_his",
        label: "It wasn't his choice",
        description:
          "Even in crisis, you don't get to choose someone else's destiny.",
        consequences: [
          "Unlock Kael's response recording",
          "Oracle trust +5",
          "Unlock alternate Ark lore",
        ],
        icon: "chains",
      },
    ],
    durationHours: 168,
    category: "monthly",
    affectedSystems: ["crafting", "lore", "tower_defense"],
    quorum: 50,
    triggeredByRecording: "holo_which_ark",
    requiresFlag: "engineer_recording_5_discovered",
  },

  // --- Vote 6: After Recording 6 ---
  {
    id: "engineer_vote_tell_agent_zero",
    month: 0,
    week: 0,
    question:
      "Agent Zero carries his mind. She doesn't know. Do we tell her " +
      "what she inherited?",
    proposedBy: "Elara + The Human",
    antiquarianIntro:
      "Two voices propose in unison — the commander and the detective, " +
      "who so rarely agree. Agent Zero walks the universe carrying the " +
      "brilliance of a dead man who loved building things more than he " +
      "loved living. She does not know why she understands machines now. " +
      "She does not know why the bench responds to her touch. Do we grant " +
      "her the grief of knowing, or protect her from it?",
    options: [
      {
        id: "tell_her",
        label: "Tell her",
        description:
          "She deserves to know who died to save her and what she carries.",
        consequences: [
          "Agent Zero reaction chain (grief, then determination)",
          "Unlock Agent Zero's eulogy for the Engineer",
          "Light energy +20",
        ],
        icon: "truth",
      },
      {
        id: "dont_tell",
        label: "Don't tell her",
        description:
          "Let her discover it herself, in her own time, in her own way.",
        consequences: [
          "Agent Zero discovers the truth later — different narrative path",
          "Unlock bench anomaly events (she senses him without understanding)",
          "Dark energy +10",
        ],
        icon: "silence",
      },
    ],
    durationHours: 168,
    category: "crisis",
    affectedSystems: ["living_universe", "transmissions", "crafting"],
    quorum: 75,
    triggeredByRecording: "holo_agent_zero_dispatched",
    requiresFlag: "engineer_recording_6_discovered",
  },

  // --- Vote 7: After Recording 7 ---
  {
    id: "engineer_vote_keep_playing",
    month: 0,
    week: 0,
    question: "The Deck remembers. Should we keep playing?",
    proposedBy: "The Meme",
    antiquarianIntro:
      "The Meme — that impossible, boundary-defying consciousness — poses " +
      "the final question with uncharacteristic gravity. The Deck hums with " +
      "the frequency of a dead prince. Every card played sends a signal " +
      "into the void. The Vortex listens. The question is not whether we " +
      "can keep playing. It is whether we should.",
    options: [
      {
        id: "keep_playing",
        label: "Keep playing",
        description:
          "The Engineer built the Deck to be used. Honour his sacrifice.",
        consequences: [
          "Vortex confrontation event triggered",
          "All card rewards doubled for one week",
          "Light energy surge +50",
          "Vortex proximity +20",
        ],
        icon: "cards",
      },
      {
        id: "go_dark",
        label: "Go dark",
        description:
          "The Vortex is listening. Silence the Deck before it finds us.",
        consequences: [
          "Dark energy spiral begins",
          "Crafting bench enters low-power mode",
          "Vortex proximity -15",
          "Unlock the Engineer's contingency recording",
        ],
        icon: "void",
      },
    ],
    durationHours: 168,
    category: "crisis",
    affectedSystems: ["dischordia_cycle", "crafting", "living_universe"],
    quorum: 100,
    triggeredByRecording: "holo_deck_remembers",
    requiresFlag: "engineer_recording_7_discovered",
  },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get a vote by its id. */
export function getEngineerVote(id: string): EngineerGovernanceVote | undefined {
  return ENGINEER_GOVERNANCE_VOTES.find((v) => v.id === id);
}

/** Get the vote triggered by a specific recording. */
export function getVoteForRecording(
  recordingId: HoloRecordingId,
): EngineerGovernanceVote | undefined {
  return ENGINEER_GOVERNANCE_VOTES.find(
    (v) => v.triggeredByRecording === recordingId,
  );
}

/**
 * Given a set of raised flags, return the list of governance votes that
 * should be active or available.
 */
export function getAvailableEngineerVotes(
  flags: Record<string, unknown>,
): readonly EngineerGovernanceVote[] {
  return ENGINEER_GOVERNANCE_VOTES.filter((v) => Boolean(flags[v.requiresFlag]));
}

/** Total votes in the Engineer series. */
export const TOTAL_ENGINEER_VOTES = ENGINEER_GOVERNANCE_VOTES.length;
