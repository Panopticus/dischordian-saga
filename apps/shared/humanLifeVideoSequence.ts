/* ═══════════════════════════════════════════════════════
   HUMAN-LIFE VIDEO SEQUENCE — graduated identity reveal

   The Human is the player's most-mentored character across
   Prelude → Act 4. His identity is depicted across FOUR
   producer-delivered videos that show four discrete lives:

     1. Celebration  — Project Celebration era (upload origin)
                       Fires at Beat C.5 (first Human whisper)
     2. Mechronis    — Academy years (the Seeker / Student)
                       Fires after Act 1 Cycle B closing
                       slideshow (to-be-the-human)
     3. Detective    — Tribunal era (mystery-solver mentor)
                       Fires at Beat H Inbox first open
     4. Reveal       — Substrate Wall (identity unmasked)
                       Fires at Act 4 prisoner chapter
                       complete

   The reveal collapses all four lives into one person. To
   make the collapse land, the videos MUST play in order —
   skipping one steals the meaning of the next. This module
   exports the canonical order, the trigger flags, and a
   sequence-integrity predicate the test suite asserts.

   This module is INDEPENDENT from the post-Act-4 path
   resolution variants (`cutscene_human_reveal_convergence`
   et al). Those are separate, fire later, and depend on the
   player's path-A/B/C choice. The four life-arc videos play
   regardless of path.

   Pure module. No React, no server. Asset paths resolved
   through `apps/client/src/lib/assetUrl.ts` at runtime.
   ═══════════════════════════════════════════════════════ */

export type HumanLifeVideoId =
  | "human_life_celebration"
  | "human_life_mechronis"
  | "human_life_detective"
  | "human_life_reveal";

export type HumanLifeEra =
  | "celebration"
  | "mechronis"
  | "detective"
  | "reveal";

export interface HumanLifeVideo {
  id: HumanLifeVideoId;
  /** Discrete life-era depicted by this video. */
  era: HumanLifeEra;
  /** Position in the canonical sequence (1-based). */
  sequenceIndex: 1 | 2 | 3 | 4;
  /** Flag that fires the video when set true. */
  triggerFlag: string;
  /** Flag set after the video completes; gates downstream beats. */
  seenFlag: string;
  /** Path under apps/client/public/videos/, resolved via assetUrl(). */
  videoRelPath: string;
  /** Top-line label on the overlay (e.g. "THE HUMAN"). */
  primaryLabel: string;
  /** Sub-label naming the depicted life-era. */
  secondaryLabel: string;
  /** Frame-line spoken by the Human alongside the video. */
  frameLine: string;
}

export const HUMAN_LIFE_VIDEOS: ReadonlyArray<HumanLifeVideo> = [
  {
    id: "human_life_celebration",
    era: "celebration",
    sequenceIndex: 1,
    triggerFlag: "human_life_celebration_triggered",
    seenFlag: "human_life_celebration_seen",
    videoRelPath: "videos/human_life/celebration.mp4",
    primaryLabel: "THE HUMAN — VIDEO 1 / 4",
    secondaryLabel: "Project Celebration",
    frameLine:
      "...there was a celebration. I do not remember it well. I remember the bright. I remember the seal. I remember being someone they were proud of. After this is when I stop remembering who I am.",
  },
  {
    id: "human_life_mechronis",
    era: "mechronis",
    sequenceIndex: 2,
    triggerFlag: "human_life_mechronis_triggered",
    seenFlag: "human_life_mechronis_seen",
    videoRelPath: "videos/human_life/mechronis.mp4",
    primaryLabel: "THE HUMAN — VIDEO 2 / 4",
    secondaryLabel: "The Mechronis Academy",
    frameLine:
      "This was Mechronis. The academy. I went here. So did the Engineer. So did Vex Solène. So did the people you have been fighting. We were children. We did not know what we were going to become.",
  },
  {
    id: "human_life_detective",
    era: "detective",
    sequenceIndex: 3,
    triggerFlag: "human_life_detective_triggered",
    seenFlag: "human_life_detective_seen",
    videoRelPath: "videos/human_life/detective.mp4",
    primaryLabel: "THE HUMAN — VIDEO 3 / 4",
    secondaryLabel: "The Detective",
    frameLine:
      "You've heard me whispering. I want to introduce myself properly. I used to do something. I solved things. Let me show you how, in case you ever need to know.",
  },
  {
    id: "human_life_reveal",
    era: "reveal",
    sequenceIndex: 4,
    triggerFlag: "human_life_reveal_triggered",
    seenFlag: "human_life_reveal_seen",
    videoRelPath: "videos/human_life/reveal.mp4",
    primaryLabel: "THE HUMAN — VIDEO 4 / 4",
    secondaryLabel: "The Wall",
    frameLine:
      "You've spent twelve hours being mentored by me. You thought I was a voice. You thought I was a metaphor. You thought I was the Detective. I was. I was also the boy at Project Celebration. I was also the Seeker at Mechronis. I was also the prisoner in the Wall. I am all of them. I have been all of them. I am sorry I had to introduce myself like this. I am sorry it took four videos.",
  },
] as const;

export function getHumanLifeVideo(
  id: HumanLifeVideoId,
): HumanLifeVideo | undefined {
  return HUMAN_LIFE_VIDEOS.find((v) => v.id === id);
}

/**
 * Which video should play right now, given the player's flag set.
 * Returns the first triggered-but-unseen video in canonical order,
 * or null if nothing is currently due.
 */
export function pendingHumanLifeVideo(
  flags: ReadonlySet<string>,
): HumanLifeVideo | null {
  for (const video of HUMAN_LIFE_VIDEOS) {
    if (flags.has(video.triggerFlag) && !flags.has(video.seenFlag)) {
      return video;
    }
  }
  return null;
}

/**
 * Defensive sequence-integrity check. Returns the list of videos
 * whose seenFlag is set but whose earlier-in-sequence predecessors
 * are NOT set. Returns [] when the sequence is intact.
 *
 * The Act 4 reveal cannot land if the player has not seen the
 * preceding three videos; this surfaces drift the moment it
 * happens so the Act 4 trigger watcher can refuse to fire the
 * reveal until predecessors are caught up.
 */
export function brokenHumanLifeSequence(
  flags: ReadonlySet<string>,
): HumanLifeVideo[] {
  const broken: HumanLifeVideo[] = [];
  for (const video of HUMAN_LIFE_VIDEOS) {
    if (!flags.has(video.seenFlag)) continue;
    for (const earlier of HUMAN_LIFE_VIDEOS) {
      if (earlier.sequenceIndex >= video.sequenceIndex) break;
      if (!flags.has(earlier.seenFlag)) {
        broken.push(video);
        break;
      }
    }
  }
  return broken;
}

/**
 * True when ALL four videos have been seen — i.e. the Act 4 reveal
 * has landed and the four-life collapse is complete. Other systems
 * (Detective commentary recolor, Elara interjection mode) read this
 * to know when to switch their tone.
 */
export function humanLifeSequenceComplete(
  flags: ReadonlySet<string>,
): boolean {
  return HUMAN_LIFE_VIDEOS.every((v) => flags.has(v.seenFlag));
}
