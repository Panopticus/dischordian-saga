/* Track 16 — Silence in Heaven album */
import type { SongSlideshowDef } from "../../songSlideshow";
import { SIH_TRACKLIST } from "../../silenceInHeavenTracklist";
const meta = SIH_TRACKLIST[16 - 1];
export const TRACK_16: SongSlideshowDef = {
  id: meta.id, songId: meta.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), audioUrl: "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/silence-in-heaven/32-the-fall-of-new-babylon.mp3", durationMs: 277160,
  title: "The Fall of New Babylon", subtitle: meta.act, priority: "P0",
  reducedMotionFallback: { heroImageUrl: "", prose: meta.tone },
  frames: [
    { startMs: 0, endMs: 277160, imageUrl: "", transition: "fade", klingPrompt: "PLACEHOLDER — see docs/silence-in-heaven/KLING-PROMPTS.md for full production prompts", seedanceMotion: "PLACEHOLDER" },
  ],
  lyrics: [],
  theaterMode: { themeColor: meta.themeColor, overlayStyle: meta.overlayStyle, act: meta.act, revParallel: meta.revParallel, narrators: ["antiquarian", "storyteller"], dialogBeats: [], loreCardReveals: [] },
};
