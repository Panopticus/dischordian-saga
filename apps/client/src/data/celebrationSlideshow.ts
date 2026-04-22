/* ═══════════════════════════════════════════════════════
   WELCOME TO CELEBRATION — Cycle A Closing Slideshow

   8-frame cinematic set to "Welcome to Celebration"
   (Dischordian Logic, track 25). Plays when the player
   completes the 28-day trial and triggers Cycle A's ending.

   Art assets live in /art/celebration/. Each frame maps
   to an existing room painting.

   See WITNESSING_NARRATIVE_PROPOSAL §4.3 + §5.
   ═══════════════════════════════════════════════════════ */
import type { SlideshowFrame } from "@/components/SongSlideshow";

import { assetUrl } from "@/lib/assetUrl";
export const WELCOME_TO_CELEBRATION_TITLE = "Welcome to Celebration";

export const WELCOME_TO_CELEBRATION_FRAMES: SlideshowFrame[] = [
  {
    imageSrc: assetUrl("art/celebration/celebration-town-square.png"),
    lyric: "Welcome to Celebration, where dreams don't always shine",
    durationMs: 6000,
  },
  {
    imageSrc: assetUrl("art/celebration/celebration-schoolhouse.png"),
    lyric: "Step lightly, wander carefully, and watch for every sign",
    durationMs: 5500,
  },
  {
    imageSrc: assetUrl("art/celebration/celebration-chorus-pavilion.png"),
    lyric: "The Mascoteers are waiting, but be careful where you tread",
    durationMs: 5500,
  },
  {
    imageSrc: assetUrl("art/celebration/celebration-eye-garden.png"),
    lyric: "Not every game is just for fun, not every word is said",
    durationMs: 5500,
  },
  {
    imageSrc: assetUrl("art/celebration/celebration-trading-jars.png"),
    lyric: "Hear ye, hear ye, the prince arrives, with colors fierce and sharpened knives",
    subtitle: "— The Prince of Celebration",
    durationMs: 6500,
  },
  {
    imageSrc: assetUrl("art/celebration/celebration-forge-yard.png"),
    lyric: "Frens, frens, gather close and see, an iron clad lion on his path to be",
    durationMs: 6000,
  },
  {
    imageSrc: assetUrl("art/celebration/celebration-puzzle-garden.png"),
    lyric: "New recruit, inspiration found, in the light we've grown",
    durationMs: 5500,
  },
  {
    imageSrc: assetUrl("art/celebration/celebration-by-night.png"),
    lyric: "To shape our fate and bring reality home",
    subtitle: "Everyone in the photo is smiling. The Engineer is the only child not looking at the camera.",
    durationMs: 8000,
  },
];

/**
 * Audio source — "Welcome to Celebration" (Dischordian Logic, track 25).
 * Silently falls back to no-audio if the file is absent.
 */
export const WELCOME_TO_CELEBRATION_AUDIO: string | undefined =
  assetUrl("audio/music/celebration/welcome-to-celebration.mp3");
