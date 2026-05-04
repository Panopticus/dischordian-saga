/**
 * engineerBenchHints.ts
 *
 * Crafting bench hints tied to Engineer holographic recordings.  When the
 * player crafts cards after discovering a recording, the bench plays a
 * contextual one-shot line from the Engineer — tech advice from beyond the
 * grave.
 */

import type { HoloRecordingId } from "./engineerRecordings";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BenchHintAction =
  | "craft_light"
  | "craft_dark"
  | "craft_rare"
  | "fusion"
  | "blueprint_unlock";

export interface EngineerBenchHint {
  /** Stable identifier. */
  readonly id: string;
  /** Which holo recording must be discovered before this hint fires. */
  readonly requiredRecording: HoloRecordingId;
  /** Crafting action that triggers this hint. */
  readonly triggerAction: BenchHintAction;
  /** The Engineer's voice from the bench. */
  readonly line: string;
  /** Optional companion reactions. */
  readonly companionReaction?: Readonly<{
    elara?: string;
    the_human?: string;
  }>;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const ENGINEER_BENCH_HINTS: readonly EngineerBenchHint[] = [
  // --- Recording 1: How to Wake the Bench ---
  {
    id: "bench_hint_memory_energy",
    requiredRecording: "holo_wake_the_bench",
    triggerAction: "craft_light",
    line:
      "Memory Energy isn't fuel. It's attention. The bench converts your " +
      "attention into cards. Pay attention to what you're making.",
    companionReaction: {
      elara: "He's right. The energy readings spike when you focus.",
      the_human: "He used to say that about everything. 'Pay attention.' Like it was a currency.",
    },
  },
  {
    id: "bench_hint_dark_honest",
    requiredRecording: "holo_wake_the_bench",
    triggerAction: "craft_dark",
    line:
      "Dark cards pull from a different well. Don't be afraid of it. Fear makes " +
      "bad cards.",
    companionReaction: {
      the_human: "He never feared the dark. He just understood it had a different frequency.",
    },
  },

  // --- Recording 2: The Prince's Notebook ---
  {
    id: "bench_hint_source_code",
    requiredRecording: "holo_princes_notebook",
    triggerAction: "craft_light",
    line:
      "The goggles showed me source code. The bench writes it. Every card you " +
      "craft is a line of code in the language of dreams.",
    companionReaction: {
      elara: "Source code of reality. The Game Master designed the goggles to read it. The Engineer taught the bench to write it.",
    },
  },
  {
    id: "bench_hint_blueprint_celebration",
    requiredRecording: "holo_princes_notebook",
    triggerAction: "blueprint_unlock",
    line:
      "Blueprints are just frozen decisions. Every trap I disabled in " +
      "Celebration started as someone else's blueprint. Now you get to make your own.",
  },

  // --- Recording 3: The Worlds I Saved ---
  {
    id: "bench_hint_network_bench",
    requiredRecording: "holo_worlds_i_saved",
    triggerAction: "craft_light",
    line:
      "I built a network of minds — invisible, unrecorded, everywhere. The " +
      "bench is the same idea. A tool that belongs to whoever uses it, not " +
      "whoever controls it.",
    companionReaction: {
      the_human: "That's his philosophy in one sentence. Tools belong to users, not owners.",
    },
  },
  {
    id: "bench_hint_fusion_thought",
    requiredRecording: "holo_worlds_i_saved",
    triggerAction: "fusion",
    line:
      "Fusion is a conversation between two ideas. Don't force it. The best " +
      "inventions happen when you let two things talk to each other.",
  },

  // --- Recording 4: The Line They Crossed ---
  {
    id: "bench_hint_dark_remember",
    requiredRecording: "holo_line_they_crossed",
    triggerAction: "craft_dark",
    line:
      "The dark cards aren't evil. They're honest. Light cards promise. Dark " +
      "cards remember. Build both.",
    companionReaction: {
      elara: "He forgave the dark before most of us could even name it.",
      the_human: "After the Eyes died, he started building dark cards differently. More carefully. Like eulogies.",
    },
  },
  {
    id: "bench_hint_rare_weapon",
    requiredRecording: "holo_line_they_crossed",
    triggerAction: "craft_rare",
    line:
      "A rare card is just a tool that's been through enough to remember what " +
      "it's for. Don't waste rarity on anger.",
  },

  // --- Recording 5: Which Ark to Steal ---
  {
    id: "bench_hint_forge_reactor",
    requiredRecording: "holo_which_ark",
    triggerAction: "blueprint_unlock",
    line:
      "The other Arks have reactors. This one has a forge. Reactors generate " +
      "power. Forges generate possibility. I chose this Ark for a reason.",
    companionReaction: {
      elara: "He chose Ark 7 because it could create, not just sustain. That's the difference.",
    },
  },

  // --- Recording 6: Agent Zero Has Been Dispatched ---
  {
    id: "bench_hint_game_master",
    requiredRecording: "holo_agent_zero_dispatched",
    triggerAction: "craft_rare",
    line:
      "Gary the Ninth let me beat him at his own game. His last move was giving " +
      "me back the goggles. A Game Master's final lesson: the best player is " +
      "the one who builds the game, not the one who wins it.",
    companionReaction: {
      the_human:
        "The Game Master chose to lose. The Engineer chose to die. " +
        "Everyone in this story chose to sacrifice for someone else. Except the Warlord.",
    },
  },
  {
    id: "bench_hint_fusion_sacrifice",
    requiredRecording: "holo_agent_zero_dispatched",
    triggerAction: "fusion",
    line:
      "Fusion destroys two things to make a third. I know something about that. " +
      "Make sure the third thing is worth what you lost.",
  },

  // --- Recording 7: The Deck Remembers ---
  {
    id: "bench_hint_prayers_metal",
    requiredRecording: "holo_deck_remembers",
    triggerAction: "craft_light",
    line:
      "You're not crafting cards. You're writing prayers in metal. The Seer " +
      "wrote them in light. I built the translator.",
    companionReaction: {
      elara: "Prayers in metal. That's what the bench has been doing this whole time.",
      the_human: "The Seer and the Engineer. Light and metal. That's the whole Deck right there.",
    },
  },
  {
    id: "bench_hint_final_dark",
    requiredRecording: "holo_deck_remembers",
    triggerAction: "craft_dark",
    line:
      "Last piece of advice from a dead man: every dark card you craft carries " +
      "a little bit of everyone who didn't make it. Treat them with respect.",
  },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Given the set of discovered recording flags and a crafting action, return
 * all hints that are eligible to fire.  Callers should filter out hints the
 * player has already seen (via a separate `seenHints` set).
 */
export function getEligibleHints(
  flags: Record<string, unknown>,
  action: BenchHintAction,
): readonly EngineerBenchHint[] {
  const discoveredRecordings = new Set<string>();
  for (const hint of ENGINEER_BENCH_HINTS) {
    const flag = `engineer_recording_${hint.requiredRecording.replace("holo_", "").charAt(0)}_discovered`;
    // Actually, let's check properly by importing the recordings
    // We'll match by the discoveryFlag pattern instead
  }

  return ENGINEER_BENCH_HINTS.filter((hint) => {
    if (hint.triggerAction !== action) return false;
    // Map recording id → discovery flag
    const flagKey = recordingIdToFlag(hint.requiredRecording);
    return Boolean(flags[flagKey]);
  });
}

/** Map a HoloRecordingId to its discovery flag. */
function recordingIdToFlag(id: HoloRecordingId): string {
  const orderMap: Record<HoloRecordingId, number> = {
    holo_trap_is_you: 0,
    holo_wake_the_bench: 1,
    holo_princes_notebook: 2,
    holo_worlds_i_saved: 3,
    holo_line_they_crossed: 4,
    holo_which_ark: 5,
    holo_agent_zero_dispatched: 6,
    holo_deck_remembers: 7,
  };
  return `engineer_recording_${orderMap[id]}_discovered`;
}

/** Total count of bench hints. */
export const TOTAL_BENCH_HINTS = ENGINEER_BENCH_HINTS.length;
