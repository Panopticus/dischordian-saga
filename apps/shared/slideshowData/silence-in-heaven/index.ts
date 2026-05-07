/* Silence in Heaven — barrel export for all 18 tracks.
 *
 * The hand-authored track files declare frame TIMING (durations,
 * captions, lyrics, narrator beats) but leave `imageUrl: ""` blank.
 * This barrel binds each frame to producer art shipped in
 * `expansionArt/album5Slideshows.ts` at module load:
 *   song N (sih-NN) ↔ ALBUM5_TRACKS T<2N>
 * (Songs sit at album positions 2,4,…,36 in the 37-track manifest;
 *  T<2N> is the corresponding ALBUM5_TRACKS id.)
 */
export { TRACK_01_NEW_BABYLON_GODDAMN } from "./track-01";
export { TRACK_02_LETTERS_TO_THE_REMNANT } from "./track-02";
export { TRACK_03 } from "./track-03";
export { TRACK_04 } from "./track-04";
export { TRACK_05 } from "./track-05";
export { TRACK_06 } from "./track-06";
export { TRACK_07 } from "./track-07";
export { TRACK_08 } from "./track-08";
export { TRACK_09 } from "./track-09";
export { TRACK_10 } from "./track-10";
export { TRACK_11 } from "./track-11";
export { TRACK_12 } from "./track-12";
export { TRACK_13 } from "./track-13";
export { TRACK_14 } from "./track-14";
export { TRACK_15 } from "./track-15";
export { TRACK_16 } from "./track-16";
export { TRACK_17 } from "./track-17";
export { TRACK_18 } from "./track-18";

import { TRACK_01_NEW_BABYLON_GODDAMN } from "./track-01";
import { TRACK_02_LETTERS_TO_THE_REMNANT } from "./track-02";
import { TRACK_03 } from "./track-03";
import { TRACK_04 } from "./track-04";
import { TRACK_05 } from "./track-05";
import { TRACK_06 } from "./track-06";
import { TRACK_07 } from "./track-07";
import { TRACK_08 } from "./track-08";
import { TRACK_09 } from "./track-09";
import { TRACK_10 } from "./track-10";
import { TRACK_11 } from "./track-11";
import { TRACK_12 } from "./track-12";
import { TRACK_13 } from "./track-13";
import { TRACK_14 } from "./track-14";
import { TRACK_15 } from "./track-15";
import { TRACK_16 } from "./track-16";
import { TRACK_17 } from "./track-17";
import { TRACK_18 } from "./track-18";
import type { SlideshowFrame, SongSlideshowDef } from "../../songSlideshow";
import {
  album5FrameUrl,
  album5FrameUrls,
  type Album5TrackId,
} from "../../expansionArt/album5Slideshows";

const RAW_SIH_TRACKS: SongSlideshowDef[] = [
  TRACK_01_NEW_BABYLON_GODDAMN, TRACK_02_LETTERS_TO_THE_REMNANT,
  TRACK_03, TRACK_04, TRACK_05, TRACK_06, TRACK_07, TRACK_08, TRACK_09,
  TRACK_10, TRACK_11, TRACK_12, TRACK_13, TRACK_14, TRACK_15, TRACK_16,
  TRACK_17, TRACK_18,
];

function songNumberToAlbum5TrackId(songNumber: number): Album5TrackId {
  return `T${String(songNumber * 2).padStart(2, "0")}` as Album5TrackId;
}

function withFrameArt(
  track: SongSlideshowDef,
  songNumber: number,
): SongSlideshowDef {
  const albumId = songNumberToAlbum5TrackId(songNumber);
  const producerFrames = album5FrameUrls(albumId);

  /* Frame binding strategy:
   *   - 0 producer frames (manifest unset) → keep authored frames untouched.
   *   - producer count == authored count   → bind 1:1, preserve authored
   *                                          transition / klingPrompt / etc.
   *   - producer count >  authored count   → REBUILD frames using all
   *                                          producer art with even time
   *                                          distribution. Dropped metadata
   *                                          (caption, klingPrompt) is unused
   *                                          at runtime; lyrics ride the
   *                                          independent def.lyrics timeline,
   *                                          so timing stays in sync.
   *   - producer count <  authored count   → bind first N, leave the
   *                                          remaining authored frames'
   *                                          imageUrl untouched (likely "").
   */
  let frames: SlideshowFrame[];
  if (producerFrames.length === 0) {
    frames = track.frames;
  } else if (producerFrames.length > track.frames.length) {
    const slotMs = Math.max(
      500,
      Math.floor(track.durationMs / producerFrames.length),
    );
    frames = producerFrames.map((url, i) => {
      const start = i * slotMs;
      const end =
        i === producerFrames.length - 1 ? track.durationMs : start + slotMs;
      return {
        startMs: start,
        endMs: end,
        imageUrl: url,
        transition: i === 0 ? "fade" : "dissolve",
      };
    });
  } else {
    frames = track.frames.map((f, i) => {
      if (f.imageUrl) return f;
      const url = producerFrames[i];
      return url ? { ...f, imageUrl: url } : f;
    });
  }

  const heroUrl = album5FrameUrl(albumId, 1);
  const reducedMotionFallback = track.reducedMotionFallback.heroImageUrl
    ? track.reducedMotionFallback
    : { ...track.reducedMotionFallback, heroImageUrl: heroUrl ?? "" };
  const completionFlag = `slideshow_${track.id.replace(/-/g, "_")}_complete`;
  const flagsSetOnComplete = track.flagsSetOnComplete?.includes(completionFlag)
    ? track.flagsSetOnComplete
    : [...(track.flagsSetOnComplete ?? []), completionFlag];
  /* Loredex auto-discovery — each SiH song slideshow maps to a
   * `song_sih_<albumPos>` Loredex entry (Loredex tracks the full 37-step
   * album manifest; song N sits at album position 2N). */
  const unlockLoredexEntry =
    track.unlockLoredexEntry ?? `song_sih_${songNumber * 2}`;
  return {
    ...track,
    frames,
    reducedMotionFallback,
    flagsSetOnComplete,
    unlockLoredexEntry,
  };
}

export const ALL_SIH_TRACKS: SongSlideshowDef[] = RAW_SIH_TRACKS.map(
  (t, i) => withFrameArt(t, i + 1),
);
