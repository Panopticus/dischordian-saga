/**
 * memeEngineerShow.ts
 *
 * "The World's Smartest Man" — a hidden broadcast series the Meme produced
 * about the Engineer, discovered through the Transmissions system.  The Meme
 * stole the Engineer's notebook as a child (Little Meme, Act 1 Step 1) and
 * has been secretly documenting his story ever since.
 *
 * 6 episodes added to the Epoch 0 archive, unlocked by discovering
 * holographic recordings.
 */

import type { EpochId, TransmissionTrigger } from "./transmissions";
import type { HoloRecordingId } from "./engineerRecordings";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MemeEngineerEpisode {
  /** Episode number within the series (1-based). */
  readonly episodeNumber: number;
  /** Epoch this transmission belongs to. */
  readonly epoch: EpochId;
  /** Broadcast order within the epoch. */
  readonly broadcastOrder: number;
  /** Episode title. */
  readonly title: string;
  /** The Meme's 4th-wall-breaking commentary. */
  readonly memeIntro: string;
  /** Closing remark. */
  readonly memeOutro: string;
  /** Which holo recording unlocks this episode. */
  readonly unlockedByRecording: HoloRecordingId;
  /** Trigger for the Transmissions system. */
  readonly unlockTrigger: TransmissionTrigger;
  /** XP and Dream reward. */
  readonly reward: Readonly<{ xp: number; dream: number; achievement?: string }>;
  /** Full episode synopsis. */
  readonly synopsis: string;
  /** Related loredex entries. */
  readonly relatedLoredexEntries?: readonly string[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const MEME_ENGINEER_EPISODES: readonly MemeEngineerEpisode[] = [
  {
    episodeNumber: 1,
    epoch: 0,
    broadcastOrder: 101,
    title: "The Kid With the Coat",
    memeIntro:
      "Welcome to a show nobody asked for about a kid nobody remembers. " +
      "Except me. Because I stole his notebook.",
    memeOutro:
      "I stole his notebook in Year 3. I'm not apologizing. That notebook " +
      "became the Deck. You're welcome.",
    unlockedByRecording: "holo_wake_the_bench",
    unlockTrigger: { kind: "flag", flag: "engineer_recording_1_discovered" },
    reward: { xp: 150, dream: 30 },
    synopsis:
      "The Meme introduces the Engineer — a prince from Celebration who was " +
      "never supposed to attend the school. His uncle sent him there to die. " +
      "The Meme stole his notebook, which contained the first sketches of " +
      "what would become the Deck.",
    relatedLoredexEntries: ["the_engineer", "celebration", "the_meme"],
  },
  {
    episodeNumber: 2,
    epoch: 0,
    broadcastOrder: 102,
    title: "Gary's Goggles",
    memeIntro:
      "Episode two. In which our hero puts on someone else's glasses and " +
      "sees that everything is terrible.",
    memeOutro:
      "He put on the Game Master's goggles and saw that Celebration was a " +
      "meat grinder on a loop. Thousands of dead kids. His own parents on " +
      "repeat like actors who don't know the play resets every four years. " +
      "So what did he do? Did he cry? Did he run? He took the death traps " +
      "apart. Every. Single. One. His whole class walked out alive. The " +
      "Empire still doesn't know. I love this kid.",
    unlockedByRecording: "holo_princes_notebook",
    unlockTrigger: { kind: "flag", flag: "engineer_recording_2_discovered" },
    reward: { xp: 200, dream: 50 },
    synopsis:
      "The Meme reveals what the Engineer saw through Gary's goggles: " +
      "Celebration was a death simulation on a 4-year loop. The prince " +
      "disabled every death trap and saved his entire class. The Empire " +
      "still believes they died.",
    relatedLoredexEntries: [
      "the_engineer",
      "game_master",
      "celebration",
      "goggles_of_gary",
    ],
  },
  {
    episodeNumber: 3,
    epoch: 0,
    broadcastOrder: 103,
    title: "The Ghost Network",
    memeIntro:
      "Episode three. The one about ghosts. Not the spooky kind. The genius kind.",
    memeOutro:
      "He saved fourteen planets without firing a single shot. I counted. " +
      "I was following him. He didn't know. But that's not the good part. " +
      "The good part is his classmates — the ones everyone thinks died at " +
      "Celebration. They're everywhere. An invisible army of geniuses placed " +
      "in witness protection by a teenager. He used the Eyes to erase them " +
      "from every database in the Empire. Revolution of thought. I'm taking " +
      "notes.",
    unlockedByRecording: "holo_worlds_i_saved",
    unlockTrigger: { kind: "flag", flag: "engineer_recording_3_discovered" },
    reward: { xp: 200, dream: 50 },
    synopsis:
      "The Meme reveals the Engineer's Ghost Network — his saved Celebration " +
      "classmates placed across the universe in witness protection. The Eyes " +
      "erased them from every record. Fourteen planets saved without violence.",
    relatedLoredexEntries: [
      "the_engineer",
      "eyes_of_the_watcher",
      "ghost_network",
    ],
  },
  {
    episodeNumber: 4,
    epoch: 0,
    broadcastOrder: 104,
    title: "The Day He Stopped Fixing",
    memeIntro:
      "Episode four. The sad one. You've been warned.",
    memeOutro:
      "They killed the Eyes. His friend. The one who helped him build the " +
      "invisible network. I watched. I was in the room. I was the room. " +
      "That's what I do. Then they took the Oracle. And the boy who saved " +
      "everyone without fighting finally understood that sometimes fixing " +
      "isn't enough.",
    unlockedByRecording: "holo_line_they_crossed",
    unlockTrigger: { kind: "flag", flag: "engineer_recording_4_discovered" },
    reward: { xp: 250, dream: 75 },
    synopsis:
      "The Meme witnessed the death of the Eyes firsthand. The Engineer's " +
      "closest collaborator, killed by the Authority. Then they took Kael. " +
      "The pacifist was forced to reconsider everything.",
    relatedLoredexEntries: [
      "the_engineer",
      "eyes_of_the_watcher",
      "the_oracle",
      "the_authority",
    ],
  },
  {
    episodeNumber: 5,
    epoch: 0,
    broadcastOrder: 105,
    title: "Dispatched",
    memeIntro:
      "Episode five. Six words. Three of them are a lie.",
    memeOutro:
      "Agent Zero has been dispatched. Six words. Three of them were a lie. " +
      "Guess which three.",
    unlockedByRecording: "holo_agent_zero_dispatched",
    unlockTrigger: { kind: "flag", flag: "engineer_recording_6_discovered" },
    reward: { xp: 300, dream: 100, achievement: "meme_dispatched_decoded" },
    synopsis:
      "The Meme unpacks the betrayal at Zenon. 'Agent Zero has been " +
      "dispatched' — but the Agent Zero who arrived wasn't Agent Zero " +
      "anymore. The Warlord was wearing her body. The Engineer trusted " +
      "someone who no longer existed.",
    relatedLoredexEntries: [
      "the_engineer",
      "agent_zero",
      "the_warlord",
      "zenon",
      "the_vortex",
    ],
  },
  {
    episodeNumber: 6,
    epoch: 0,
    broadcastOrder: 106,
    title: "The World's Smartest Man",
    memeIntro:
      "Last episode. I don't do sad. But this one... this one is what it is.",
    memeOutro:
      "He built a box where dreams could live. The Architect built a box " +
      "where dreams could die. Same engineering. Different intent. That's " +
      "the whole war in two sentences. He's dead now. Really dead. Not " +
      "hiding-dead. Not transferred-dead. Dead-dead. But Agent Zero is " +
      "alive and she's carrying the smartest mind in the galaxy inside " +
      "her skull and she doesn't even know it yet. That's his last " +
      "invention. The best one.",
    unlockedByRecording: "holo_deck_remembers",
    unlockTrigger: { kind: "flag", flag: "engineer_recording_7_discovered" },
    reward: { xp: 500, dream: 200, achievement: "meme_smartest_man_complete" },
    synopsis:
      "The Meme's final episode. The Engineer is dead — truly dead. He " +
      "sacrificed himself to save Agent Zero, who now carries his brilliance " +
      "without knowing it. The Meme summarises the whole war in two " +
      "sentences.",
    relatedLoredexEntries: [
      "the_engineer",
      "agent_zero",
      "the_architect",
      "the_deck",
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get an episode by its number (1-based). */
export function getMemeEpisode(episodeNumber: number): MemeEngineerEpisode | undefined {
  return MEME_ENGINEER_EPISODES.find((e) => e.episodeNumber === episodeNumber);
}

/** Get the episode unlocked by a specific recording. */
export function getEpisodeForRecording(
  recordingId: HoloRecordingId,
): MemeEngineerEpisode | undefined {
  return MEME_ENGINEER_EPISODES.find((e) => e.unlockedByRecording === recordingId);
}

/**
 * Given a set of raised flags, return the list of unlocked episodes
 * in broadcast order.
 */
export function getUnlockedEpisodes(
  flags: Record<string, unknown>,
): readonly MemeEngineerEpisode[] {
  return MEME_ENGINEER_EPISODES.filter((e) => {
    if (e.unlockTrigger.kind === "flag") {
      return Boolean(flags[e.unlockTrigger.flag]);
    }
    return false;
  });
}

/** Total episodes in the series. */
export const TOTAL_MEME_EPISODES = MEME_ENGINEER_EPISODES.length;
