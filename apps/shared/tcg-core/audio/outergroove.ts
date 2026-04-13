/**
 * OUTERGROOVE — the Programmer's first channel.
 *
 * Space-opera funk. Ten loopable instrumentals recorded by the
 * Programmer in his early Panopticon studio era, before the
 * Panopticon became what it became. The Engineer stole the
 * master tapes along with the FNORD-23 itself; each track lives
 * in the device's first channel slot.
 *
 * Each track is a backing instrumental for one of the first ten
 * Engineer's Logs. The player hears the log as a voice-over over
 * the instrumental. They can swap the instrumental mid-playback
 * in the FNORD-23 remix UI — the voice-over keeps going while a
 * different OUTERGROOVE cut drops in under it.
 *
 * File paths point to /public/audio/outergroove/ where the user
 * drops generated MP3/WAV files. The device auto-discovers any
 * track whose filePath resolves. Missing files fall back to
 * silence (the voice-over still plays).
 */

import type { ChannelDefinition, InstrumentalTrack } from "./fnord23";

/* ═══════════════════════════════════════════════════════
   TRACKS
   Each entry matches the musicPrompt on a single Engineer's
   Log — tempo, key, mood, and duration target are copied over
   so the data file is a faithful record of what was generated.
   ═══════════════════════════════════════════════════════ */

export const OG_001_CELEBRATION_RAIN: InstrumentalTrack = {
  id: "og_001",
  channelId: "outergroove",
  title: "Celebration Rain",
  artist: "The Programmer",
  tempoBpm: 92,
  keySignature: "F minor",
  durationSeconds: 100,
  filePath: "/audio/outergroove/og_001.mp3",
  defaultForLogId: "log_keyword_provoke",
  moodTags: ["cathedral-funk", "slow", "shoulder-roll", "lecture-friendly"],
};

export const OG_003_FASTER_THAN_THOUGHT: InstrumentalTrack = {
  id: "og_003",
  channelId: "outergroove",
  title: "Faster Than The Thought",
  artist: "The Programmer",
  tempoBpm: 104,
  keySignature: "C Dorian",
  durationSeconds: 95,
  filePath: "/audio/outergroove/og_003.mp3",
  defaultForLogId: "log_keyword_rush",
  moodTags: ["driving", "confident", "searching", "zero-g-funk"],
};

export const OG_005_ONE_BITE_SHIELD: InstrumentalTrack = {
  id: "og_005",
  channelId: "outergroove",
  title: "One Bite Shield",
  artist: "The Programmer",
  tempoBpm: 88,
  keySignature: "E-flat minor",
  durationSeconds: 110,
  filePath: "/audio/outergroove/og_005.mp3",
  defaultForLogId: "log_keyword_forcefield",
  moodTags: ["quiet-storm", "3am", "contemplative", "space-station-soul"],
};

export const OG_007_DOUBLE_HEARTBEAT: InstrumentalTrack = {
  id: "og_007",
  channelId: "outergroove",
  title: "The Double Heartbeat",
  artist: "The Programmer",
  tempoBpm: 112,
  keySignature: "G Mixolydian",
  durationSeconds: 100,
  filePath: "/audio/outergroove/og_007.mp3",
  defaultForLogId: "log_keyword_celerity",
  moodTags: ["hyperactive", "sign-o-the-times", "doubled", "cathedral-funk"],
};

export const OG_009_THE_EGG: InstrumentalTrack = {
  id: "og_009",
  channelId: "outergroove",
  title: "The Egg",
  artist: "The Programmer",
  tempoBpm: 76,
  keySignature: "B-flat minor",
  durationSeconds: 130,
  filePath: "/audio/outergroove/og_009.mp3",
  defaultForLogId: "log_keyword_rebirth",
  moodTags: ["reverent", "lullaby", "funeral-cortege", "grieving-groove"],
};

export const OG_011_PERMISSION_TO_BE_ANYWHERE: InstrumentalTrack = {
  id: "og_011",
  channelId: "outergroove",
  title: "Permission To Be Anywhere",
  artist: "The Programmer",
  tempoBpm: 96,
  keySignature: "A major",
  durationSeconds: 95,
  filePath: "/audio/outergroove/og_011.mp3",
  defaultForLogId: "log_keyword_flying",
  moodTags: ["weightless", "buoyant", "optimistic", "zero-g-flute"],
};

export const OG_013_THE_CLEAN_LINE: InstrumentalTrack = {
  id: "og_013",
  channelId: "outergroove",
  title: "The Clean Line",
  artist: "The Programmer",
  tempoBpm: 84,
  keySignature: "D minor",
  durationSeconds: 115,
  filePath: "/audio/outergroove/og_013.mp3",
  defaultForLogId: "log_keyword_ranged",
  moodTags: ["noir-jazz", "patient", "cool", "trumpet-dangerous"],
};

export const OG_015_ONES_WHO_WATCH: InstrumentalTrack = {
  id: "og_015",
  channelId: "outergroove",
  title: "The Ones Who Watch The Falling",
  artist: "The Programmer",
  tempoBpm: 72,
  keySignature: "C-sharp minor",
  durationSeconds: 140,
  filePath: "/audio/outergroove/og_015.mp3",
  defaultForLogId: "log_keyword_deathwatch",
  moodTags: ["trip-hop", "mournful", "heavy-gravity", "processed-choir"],
};

export const OG_017_WRONG_ANGLE: InstrumentalTrack = {
  id: "og_017",
  channelId: "outergroove",
  title: "The Wrong Angle",
  artist: "The Programmer",
  tempoBpm: 108,
  keySignature: "F-sharp minor",
  durationSeconds: 100,
  filePath: "/audio/outergroove/og_017.mp3",
  defaultForLogId: "log_keyword_backstab",
  moodTags: ["stealth-funk", "shaft-groove", "bongo-bridge", "moving-quietly"],
};

export const OG_019_TAX_ON_HURTING: InstrumentalTrack = {
  id: "og_019",
  channelId: "outergroove",
  title: "The Tax On Hurting",
  artist: "The Programmer",
  tempoBpm: 82,
  keySignature: "G minor",
  durationSeconds: 125,
  filePath: "/audio/outergroove/og_019.mp3",
  defaultForLogId: "log_keyword_drain",
  moodTags: ["medicinal-soul", "slightly-guilty", "muted-trumpet", "clinic-funk"],
};

/* ═══════════════════════════════════════════════════════
   CHANNEL
   ═══════════════════════════════════════════════════════ */

export const OUTERGROOVE_TRACKS: readonly InstrumentalTrack[] = Object.freeze([
  OG_001_CELEBRATION_RAIN,
  OG_003_FASTER_THAN_THOUGHT,
  OG_005_ONE_BITE_SHIELD,
  OG_007_DOUBLE_HEARTBEAT,
  OG_009_THE_EGG,
  OG_011_PERMISSION_TO_BE_ANYWHERE,
  OG_013_THE_CLEAN_LINE,
  OG_015_ONES_WHO_WATCH,
  OG_017_WRONG_ANGLE,
  OG_019_TAX_ON_HURTING,
]);

export const OUTERGROOVE_CHANNEL: ChannelDefinition = {
  id: "outergroove",
  displayName: "OUTERGROOVE",
  description:
    "The Programmer's first channel. Space-opera funk recorded in his early Panopticon studio era, before the mask fit. Slap bass, clavinet wah, Linn LM-1 drums, the kind of pocket that makes you lean back and understand something you'd been avoiding.",
  producer: "The Programmer",
  genreTags: ["funk", "soul", "space-opera", "spoken-word-friendly"],
  trackIds: OUTERGROOVE_TRACKS.map((t) => t.id),
  unlockCondition: {
    kind: "item_found",
    value: "fnord23",
  },
  coverArtPath: "/audio/outergroove/cover.jpg",
};

/** Quick lookup by track id. */
export const OUTERGROOVE_TRACK_MAP: Readonly<Record<string, InstrumentalTrack>> =
  Object.freeze(
    Object.fromEntries(OUTERGROOVE_TRACKS.map((t) => [t.id, t]))
  );

/** All channels the FNORD-23 currently ships with. The user can
 *  drop more channels (`zero_point_soul.ts`, `panoptibeat.ts`, etc)
 *  as new instrumentals get generated. */
export const ALL_CHANNELS: readonly ChannelDefinition[] = Object.freeze([
  OUTERGROOVE_CHANNEL,
]);

export const ALL_INSTRUMENTAL_TRACKS: readonly InstrumentalTrack[] = Object.freeze([
  ...OUTERGROOVE_TRACKS,
]);

export const INSTRUMENTAL_TRACK_MAP: Readonly<Record<string, InstrumentalTrack>> =
  Object.freeze(
    Object.fromEntries(ALL_INSTRUMENTAL_TRACKS.map((t) => [t.id, t]))
  );
