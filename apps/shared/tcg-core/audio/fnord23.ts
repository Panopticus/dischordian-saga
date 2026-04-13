/**
 * The FNORD-23 — the Engineer's stolen sampler.
 *
 * In-universe: a portable digital sampler the Engineer stole from
 * the Vaults of Celebration. The Programmer (aka the Panopticon)
 * built it by hand in his early studio years — every Panopticon
 * album was produced on this exact unit. The Engineer cracked it
 * open, reflashed the firmware with Oracle-derived probability
 * math, and added a memory-resin banking system that records any
 * audio he witnesses in the world. He uses it to lay down his
 * lab notes as mix tapes.
 *
 * Runtime: the FNORD-23 is a client-side device panel with a
 * server-backed library. This file defines the shared types so
 * both the router and the UI agree on what a channel, track, and
 * memory-resin entry look like.
 *
 * Model name comes from Robert Anton Wilson's 23 Enigma plus the
 * Programmer's numeric model-name tradition (MPC-60, SP-1200, etc).
 */

/** A single instrumental track. Playable underneath any recorded
 *  audio. Tracks belong to channels. */
export interface InstrumentalTrack {
  id: string;                    // "og_003"
  channelId: string;             // "outergroove"
  title: string;                 // "Faster Than The Thought (Instrumental)"
  artist: string;                // "The Programmer" | "The Engineer"
  tempoBpm: number;
  keySignature: string;          // "C Dorian"
  /** Total loopable duration in seconds. */
  durationSeconds: number;
  /** Public path to the audio file. Served from /public/audio/... */
  filePath: string;
  /** Optional loop points for seamless continuous play. */
  loopPoints?: { start: number; end: number };
  /** If this track is the default backing for a specific
   *  Engineer's Log, the log id. Lets the FNORD-23 auto-pair them. */
  defaultForLogId?: string;
  /** Mood tags for the track picker. */
  moodTags: readonly string[];
}

/** A logical channel in the FNORD-23. Channels are essentially
 *  stylistic radio stations — OUTERGROOVE (space-opera funk),
 *  ZERO-POINT SOUL (slow jams), PANOPTIBEAT (industrial), etc. */
export interface ChannelDefinition {
  id: string;                    // "outergroove"
  /** Display name in the FNORD-23 UI (always upper-cased). */
  displayName: string;           // "OUTERGROOVE"
  /** One-line in-universe description. */
  description: string;
  /** In-universe attributed producer. */
  producer: string;              // "The Programmer"
  /** Thematic tags for search / filtering. */
  genreTags: readonly string[];
  /** Track ids that belong to this channel. */
  trackIds: readonly string[];
  /** Condition that unlocks this channel for the player. */
  unlockCondition: {
    kind: "always" | "campaign_chapter" | "engineer_log" | "memory_resin_count" | "item_found";
    value?: string | number;
  };
  /** Cover art path (optional). */
  coverArtPath?: string;
}

/** A single captured audio clip in a player's memory resin bank.
 *  Every in-game VO line gets recorded here automatically the
 *  first time it plays — dialog, Engineer logs, cinematics,
 *  ambient NPC barks, companion chat TTS, etc. */
export interface MemoryResinEntry {
  /** Globally stable id the entry is keyed by. Same audio file
   *  heard in two contexts becomes two separate entries. */
  id: string;                    // "dialog_elara_g1_001_ctx_tutorial"
  /** The stable clip id of the underlying audio asset. */
  audioClipId: string;           // "dialog_elara_g1_001"
  /** Public path to the audio file. */
  audioUrl: string;
  /** Who is speaking. */
  speaker: string;               // "elara" | "the_human" | "engineer" | "narrator" | ...
  /** Where in the game the player was when they heard it. */
  context: string;               // "tutorial_gate_1" | "chapter_2" | "chess_chat"
  /** Human-readable transcript for search. */
  transcript: string;
  /** When the player captured it (milliseconds since epoch). */
  capturedAt: number;
  /** Duration of the audio in seconds. */
  durationSeconds: number;
  /** Tags for the library filter. */
  tags: readonly string[];
}

/** A currently-loaded remix pair in the FNORD-23 — one acapella
 *  (memory resin entry) plus one instrumental track. The player
 *  can swap either side without stopping playback. */
export interface RemixState {
  acapella: MemoryResinEntry | null;
  instrumental: InstrumentalTrack | null;
  /** Synchronized position in seconds since playback began. */
  positionSeconds: number;
  /** Has the player hit the FNORD button this session? */
  fnordUsedThisSession: boolean;
}

/** Beat-minigame score entry — persisted per player per track. */
export interface BeatGameScore {
  trackId: string;
  perfectHits: number;
  goodHits: number;
  missed: number;
  totalNotes: number;
  /** 0-1 accuracy score. */
  accuracy: number;
  /** Multiplier streak peaked at. */
  peakMultiplier: number;
  /** Unlocked cosmetic reward id, if any. */
  cosmeticRewardId?: string;
}

/** FNORD-23 device-wide state stored per user. */
export interface Fnord23UserState {
  /** Channels the player has unlocked (including the always-on ones). */
  unlockedChannelIds: readonly string[];
  /** Most recently opened track — resumes here on next session. */
  lastPlayedTrackId?: string;
  /** Number of memory resin entries the player has captured. */
  memoryResinCount: number;
  /** Whether the FNORD-23 device itself has been found yet.
   *  The first-time discovery sequence runs when this flips true. */
  discovered: boolean;
  /** Whether the player has unlocked the beat minigame. */
  beatGameUnlocked: boolean;
}

/**
 * Random effects the FNORD button can produce. The button is
 * unlabeled; players press it to see what happens. Each press
 * picks one of these effects with seeded RNG (seed = userId +
 * day), so the same button press on the same day always gives
 * the same result — the FNORD is deterministic mystery, not
 * random nonsense.
 */
export type FnordEffect =
  | { kind: "beat_drop"; bpmDelta: number }
  | { kind: "reverse"; durationSeconds: number }
  | { kind: "pitch_shift"; semitones: number }
  | { kind: "loop_cut"; startOffset: number; lengthSeconds: number }
  | { kind: "silence"; durationSeconds: number }
  | { kind: "echo_cascade"; feedbackAmount: number }
  | { kind: "tape_warp"; intensity: number }
  | { kind: "voice_double"; panSpread: number }
  | { kind: "fnord"; message: string }; // The "nothing happens" variant — RAW homage

/** Registered FNORD effects the randomizer draws from. */
export const FNORD_EFFECTS: readonly FnordEffect[] = Object.freeze([
  { kind: "beat_drop", bpmDelta: -20 },
  { kind: "beat_drop", bpmDelta: +20 },
  { kind: "reverse", durationSeconds: 4 },
  { kind: "pitch_shift", semitones: -3 },
  { kind: "pitch_shift", semitones: +3 },
  { kind: "loop_cut", startOffset: 2, lengthSeconds: 1 },
  { kind: "silence", durationSeconds: 2 },
  { kind: "echo_cascade", feedbackAmount: 0.6 },
  { kind: "tape_warp", intensity: 0.4 },
  { kind: "voice_double", panSpread: 0.8 },
  { kind: "fnord", message: "You do not see the word." },
  { kind: "fnord", message: "The number 23 appears briefly on the display, then is gone." },
  { kind: "fnord", message: "For a moment, you think the device looked at you." },
]);

/** In-universe description of the device itself. Used by the
 *  first-room discovery sequence for the Engineer's "Log 000"
 *  monologue about stealing the device from the Vaults. */
export const FNORD23_DEVICE_LORE = Object.freeze({
  modelName: "FNORD-23",
  originalBuilder: "The Programmer (aka the Panopticon)",
  currentOwner: "The Engineer (stolen from the Vaults of Celebration)",
  padCount: 8,
  channelCapacity: 16, // player can have up to 16 channels loaded at once
  discoveryFlavor:
    "A scuffed black slab the size of a paperback book. Eight rubber pads arranged in a 2x4 grid. A single dial in the top-right corner labeled MASTER. One unlabeled button above the dial — smaller than the others, slightly offset. The LCD displays the word NO SIGNAL but the word NO keeps flickering.",
});
