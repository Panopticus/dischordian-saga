/* Track 14 — Silence in Heaven album */
import type { SongSlideshowDef } from "../../songSlideshow";
import { SIH_TRACKLIST } from "../../silenceInHeavenTracklist";
const meta = SIH_TRACKLIST[14 - 1];
export const TRACK_14: SongSlideshowDef = {
  id: meta.id, songId: meta.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), audioUrl: "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/silence-in-heaven/28-the-harvest.mp3", durationMs: 284800,
  title: meta.title, subtitle: meta.act, priority: "P0",
  reducedMotionFallback: { heroImageUrl: "", prose: meta.tone },
  frames: [
    { startMs: 0, endMs: 284800, imageUrl: "", transition: "fade", klingPrompt: "PLACEHOLDER — see docs/silence-in-heaven/KLING-PROMPTS.md for full production prompts", seedanceMotion: "PLACEHOLDER" },
  ],
  lyrics: [],
  theaterMode: { themeColor: meta.themeColor, overlayStyle: meta.overlayStyle, act: meta.act, revParallel: meta.revParallel, narrators: ["antiquarian", "storyteller"], dialogBeats: [], loreCardReveals: [] },
};
