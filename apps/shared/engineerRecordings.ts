/**
 * engineerRecordings.ts
 *
 * 7 holographic recordings left by the Engineer in the Ark, discovered as
 * room events through the Daily Brief system.  Each recording is tied to a
 * card-game milestone AND an Ark room.
 *
 * Discovery is progressive — the player unlocks recordings by winning
 * Dischordia card battles, revealing the Engineer's story from Celebration
 * through his death.
 */

import type { RoomId, EventType } from "./arkEventHandler";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HoloRecordingId =
  | "holo_wake_the_bench"
  | "holo_princes_notebook"
  | "holo_worlds_i_saved"
  | "holo_line_they_crossed"
  | "holo_which_ark"
  | "holo_agent_zero_dispatched"
  | "holo_deck_remembers";

export interface HoloRecording {
  /** Stable identifier. */
  readonly id: HoloRecordingId;
  /** 1-based progression order. */
  readonly order: number;
  /** Ark room where the hologram materialises. */
  readonly roomId: RoomId;
  /** Event type registered with the Ark event handler. */
  readonly eventType: EventType;
  /** Human-readable title shown in the Daily Brief. */
  readonly title: string;
  /** Card-game milestone that activates this recording. */
  readonly trigger: HoloRecordingTrigger;
  /** The Engineer's transcript — calm, philosophical, defiant. */
  readonly transcript: string;
  /** Flag raised when the player discovers this recording. */
  readonly discoveryFlag: string;
  /** NPC reactions that fire alongside the recording. */
  readonly npcReactions: Readonly<{
    elara: string;
    the_human: string;
  }>;
  /** Optional reward granted on first discovery. */
  readonly reward?: Readonly<{
    dream?: number;
    xp?: number;
    cardId?: string;
    material?: string;
    trust?: number;
  }>;
}

export interface HoloRecordingTrigger {
  /** Minimum total card-battle wins required. */
  readonly minCardWins: number;
  /** Optional: specific Dischordia battle step that must be reached. */
  readonly dischordiaStep?: number;
  /** Optional: all Act 1 battles must be complete. */
  readonly allAct1Complete?: boolean;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const ENGINEER_RECORDINGS: readonly HoloRecording[] = [
  {
    id: "holo_wake_the_bench",
    order: 1,
    roomId: "engineering",
    eventType: "lore_discovery",
    title: "How to Wake the Bench",
    trigger: { minCardWins: 1 },
    transcript:
      "The bench hums in three frequencies. The first is mine. The second is the Seer's. " +
      "The third is yours — it won't know the note until you play your first card.",
    discoveryFlag: "engineer_recording_1_discovered",
    npcReactions: {
      elara:
        "That voice. I know that voice. He recorded these before they took him to New Babylon. " +
        "He knew he wasn't coming back.",
      the_human:
        "He'd talk to machines like they were people. And honestly? They listened. " +
        "That bench hasn't hummed like that since he built it.",
    },
    reward: { dream: 50, xp: 200 },
  },
  {
    id: "holo_princes_notebook",
    order: 2,
    roomId: "archives",
    eventType: "lore_discovery",
    title: "The Prince's Notebook",
    trigger: { minCardWins: 3 },
    transcript:
      "I borrowed the Game Master's goggles because I was curious. I saw source code. " +
      "I saw the loop — the 4-year reset, the death traps, my parents living the same " +
      "lives over and over as props in someone else's play. Thousands of children had " +
      "died in that simulation. I was supposed to be one of them. Instead I took the " +
      "death traps apart, one by one. They thought my class died on schedule. They didn't. " +
      "I saved every single one of them.",
    discoveryFlag: "engineer_recording_2_discovered",
    npcReactions: {
      elara:
        "Celebration was a simulation? A loop? I served the system that ran those death " +
        "traps. I didn't know. I should have known.",
      the_human:
        "He told me about the goggles once, at Mechronis. I thought he was exaggerating. " +
        "He wasn't. He never exaggerated. He just told you the truth and let you decide " +
        "it was impossible.",
    },
    reward: { dream: 75, xp: 300, material: "celebration_blueprint" },
  },
  {
    id: "holo_worlds_i_saved",
    order: 3,
    roomId: "observation_deck",
    eventType: "lore_discovery",
    title: "The Worlds I Saved",
    trigger: { minCardWins: 4 },
    transcript:
      "My classmates — the ones everyone thinks are dead — they're out there. Second " +
      "best at Celebration is still a once-in-a-lifetime intelligence. I put them " +
      "everywhere. The Eyes helped me erase them from every record — the Watcher's, " +
      "the Authority's, the Empire's. An invisible army that doesn't fight. We fix " +
      "things. Violent resistance or revolution of thought — I chose thought every time. " +
      "Fixing is harder than breaking.",
    discoveryFlag: "engineer_recording_3_discovered",
    npcReactions: {
      elara:
        "An invisible network of survivors. The Authority never found them because " +
        "the Eyes erased them. And I spent years hunting ghosts that were never there.",
      the_human:
        "He saved fourteen planets without firing a single shot. I verified three of " +
        "them myself when I was still working cases. I never connected them to him. " +
        "That was the point, wasn't it?",
    },
    reward: { dream: 75, xp: 300 },
  },
  {
    id: "holo_line_they_crossed",
    order: 4,
    roomId: "comms_array",
    eventType: "lore_discovery",
    title: "The Line They Crossed",
    trigger: { minCardWins: 8 },
    transcript:
      "The Eyes helped me build something invisible and beautiful. A network of minds, " +
      "not weapons. Then they killed him. Then they took Kael. I never wanted to build " +
      "weapons. But when they took him — when they took Kael — I understood that a tool " +
      "becomes a weapon the moment someone takes it from the person it was built for.",
    discoveryFlag: "engineer_recording_4_discovered",
    npcReactions: {
      elara:
        "When they killed the Eyes... I was on the other side. I didn't pull the trigger " +
        "but I held the door open. I can't unhear this recording.",
      the_human:
        "I was there when the Eyes died. I couldn't stop it. The Engineer found out three " +
        "days later. I watched him go quiet. Not angry-quiet. Calculating-quiet. " +
        "That's when I knew the pacifist was done being passive.",
    },
    reward: { dream: 100, xp: 400, trust: 5 },
  },
  {
    id: "holo_which_ark",
    order: 5,
    roomId: "bridge",
    eventType: "lore_discovery",
    title: "Which Ark to Steal",
    trigger: { minCardWins: 9 },
    transcript:
      "Steal Ark 7. It's the one I built the bench into. The others have reactors. " +
      "This one has a forge. The Panopticon's orbital pattern resets every 43 days — " +
      "that's your window. I've sent the coordinates to Elara and the Human. " +
      "Kael, if you're hearing this: the bench knows your voice. It always has. " +
      "I tuned it to the Oracle's frequency before they took you.",
    discoveryFlag: "engineer_recording_5_discovered",
    npcReactions: {
      elara:
        "He sent me the Panopticon's coordinates from a cell in New Babylon. I thought " +
        "it was a trap. It was the most precise orbital calculation I've ever seen. " +
        "He did it in his head.",
      the_human:
        "I received the same coordinates. Different encoding, same data. He sent it " +
        "twice because he knew one of us might not trust it. He was right about that too.",
    },
    reward: { dream: 100, xp: 400, material: "panopticon_schematic" },
  },
  {
    id: "holo_agent_zero_dispatched",
    order: 6,
    roomId: "medical_bay",
    eventType: "lore_discovery",
    title: "Agent Zero Has Been Dispatched",
    trigger: { minCardWins: 10, dischordiaStep: 12 },
    transcript:
      "If I don't come back from this — if the device works but I don't survive the " +
      "transference — look for her. Agent Zero. She'll have my memories. My knowledge. " +
      "She won't know why she suddenly understands the bench. Tell her it's because a " +
      "boy from Celebration loved building things more than he loved living.",
    discoveryFlag: "engineer_recording_6_discovered",
    npcReactions: {
      elara:
        "He knew. He knew he was going to die and he recorded this anyway. Not a " +
        "goodbye. Instructions. Even dying, he was still engineering outcomes.",
      the_human:
        "...I need a minute. He wasn't supposed to — the device was supposed to save " +
        "him. He found Agent Zero still alive in there and he chose her. Of course he " +
        "did. Of course he did.",
    },
    reward: { dream: 150, xp: 500, trust: 10 },
  },
  {
    id: "holo_deck_remembers",
    order: 7,
    roomId: "captains_quarters",
    eventType: "lore_discovery",
    title: "The Deck Remembers",
    trigger: { minCardWins: 12, allAct1Complete: true },
    transcript:
      "Every card you play is a prayer I wrote in metal. The Deck doesn't care who " +
      "holds it. It cares that someone does. I'm probably dead by the time you hear " +
      "this. That's fine. The bench hums. The Deck remembers. That's enough. That was " +
      "always enough.",
    discoveryFlag: "engineer_recording_7_discovered",
    npcReactions: {
      elara:
        "He's gone. Really gone. Not transferred, not hidden, not waiting. Gone. And he " +
        "left us a deck of prayers written in metal. I'm going to learn every card.",
      the_human:
        "He'd show up late, build something impossible during class, and sleep through " +
        "the lecture. That's how I'll remember him. Not this. Not chains and execution " +
        "chambers. The kid who built impossible things and fell asleep smiling.",
    },
    reward: { dream: 250, xp: 1000, cardId: "engineers_final_prayer" },
  },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Look up a recording by its stable id. */
export function getRecording(id: HoloRecordingId): HoloRecording {
  const rec = ENGINEER_RECORDINGS.find((r) => r.id === id);
  if (!rec) throw new Error(`Unknown holo recording: ${id}`);
  return rec;
}

/** Look up a recording by its 1-based order. */
export function getRecordingByOrder(order: number): HoloRecording | undefined {
  return ENGINEER_RECORDINGS.find((r) => r.order === order);
}

/**
 * Given a set of raised flags, return the list of discovered recordings
 * in progression order.
 */
export function getDiscoveredRecordings(
  flags: Record<string, unknown>,
): readonly HoloRecording[] {
  return ENGINEER_RECORDINGS.filter((r) => flags[r.discoveryFlag]);
}

/**
 * Given the player's card-battle stats, return the next recording that
 * should activate (if any).  Returns `undefined` when all recordings are
 * discovered or no trigger conditions are met.
 */
export function getNextPendingRecording(
  flags: Record<string, unknown>,
  cardWins: number,
  dischordiaStep: number,
  allAct1Complete: boolean,
): HoloRecording | undefined {
  return ENGINEER_RECORDINGS.find((r) => {
    if (flags[r.discoveryFlag]) return false;
    if (cardWins < r.trigger.minCardWins) return false;
    if (r.trigger.dischordiaStep != null && dischordiaStep < r.trigger.dischordiaStep) return false;
    if (r.trigger.allAct1Complete && !allAct1Complete) return false;
    return true;
  });
}

/**
 * Total count of recordings (useful for progress displays).
 */
export const TOTAL_RECORDINGS = ENGINEER_RECORDINGS.length;
