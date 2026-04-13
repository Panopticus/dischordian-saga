/* Track 01 — New Babylon Goddamn (v2 canon) */
import type { SongSlideshowDef } from "../../songSlideshow";

export const TRACK_01_NEW_BABYLON_GODDAMN: SongSlideshowDef = {
  id: "sih-01", songId: "new-babylon-goddamn", audioUrl: "", durationMs: 215000,
  title: "New Babylon Goddamn", subtitle: "ACT I: THE WARNING",
  priority: "P0",
  reducedMotionFallback: { heroImageUrl: "", prose: "The Storyteller and The Panopticon denounce New Babylon — the city that survived the Fall by sacrificing its lower tiers." },
  frames: [
    { startMs: 0, endMs: 20000, imageUrl: "", transition: "dissolve", klingPrompt: "New Babylon — a futuristic cyberpunk megacity at dawn, seen from street level looking up. Crystal towers scraping the sky. Neon corporate holographic ads covering every surface. Surveillance cameras on every corner — not hidden, proudly obvious. The morning crowd: beings of multiple species moving through curated routes, all tracked. The sky is controlled: a dome of perfect blue, obviously artificial. Blade Runner meets ancient Rome.", seedanceMotion: "Camera begins at street level, slowly tilting upward — past crowds, surveillance cameras, corporate screens, to crystal towers, to artificial sky. The city breathes. Everything is watched." },
    { startMs: 20000, endMs: 55000, imageUrl: "", transition: "dissolve", klingPrompt: "A surveillance drone's perspective looking down at New Babylon's lower districts. Multiple camera feeds overlapping — same street from 12 angles. Center: a woman (The Storyteller) in crimson silk gown walking, head up, aware she's being watched, not hurrying. Holographic screens showing curated news. Cold blue surveillance light vs warm amber figure.", seedanceMotion: "Multiple camera feeds rotate around central figure. She keeps walking. Her gaze meets one camera directly." },
    { startMs: 55000, endMs: 85000, imageUrl: "", transition: "hardcut", klingPrompt: "The Storyteller at center of New Babylon's broadcast square. Every screen behind her shows the Politician's face — smiling, omnipresent. She has a microphone stand. Singing to the screens. Crimson dress catches neon. The crowd: some watching her, some watching screens. Her expression: not rage — prophecy. Warm crimson against cold blue.", seedanceMotion: "Screens behind her flicker as she sings. Small sections of corporate broadcast break up — replaced by her face. The corporation reasserts. She keeps singing." },
    { startMs: 85000, endMs: 120000, imageUrl: "", transition: "dissolve", klingPrompt: "The Antiquarian transformed into The Panopticon — still in his characteristic suit but standing at a data terminal, holographic code flowing from fingertips. Red goggles glow with active surveillance feeds. He speaks directly into camera. Behind: the AI Empire's data infrastructure. He is the glitch in the grid. Cyberpunk hacker aesthetic, cold blue data light.", seedanceMotion: "Code cascading from his hands forming lyrics before dissolving into data noise. Camera pushes in." },
    { startMs: 120000, endMs: 155000, imageUrl: "", transition: "hardcut", klingPrompt: "Pure data chaos — the Panopticon in full acceleration. Code streams from every surface. Surveillance drones short-circuiting. Corporate screens glitching with truth-data. One data-stream forms a fist. Electric blue and hot white.", seedanceMotion: "Rapid cuts: drone circuits sparking, screens flickering, code waterfalls accelerating. Then stillness. One camera spins slowly, pointed at nothing." },
    { startMs: 155000, endMs: 185000, imageUrl: "", transition: "fade", klingPrompt: "The Storyteller and Panopticon side by side in broadcast square. Screens behind them split — half empire broadcast, half their faces. The crowd gathered — present, witnessing. They speak directly to camera. This is charges being read.", seedanceMotion: "Still. Both figures. Screens pulsing with contest between broadcasts. Crowd quiet. Even surveillance drones hover motionless." },
    { startMs: 185000, endMs: 215000, imageUrl: "", transition: "fade", klingPrompt: "New Babylon at end of song. City still stands. Towers still gleam. But the artificial sky dome has a hairline crack. Actual sky visible through it: stars, dawn, something real. The crack is small. It is everything. The Storyteller's back to camera, looking at the crack.", seedanceMotion: "Hold on crack in dome. Stars through it. A breath of actual wind. The Storyteller looks up. Not hope exactly. Recognition." },
  ],
  lyrics: [
    { startMs: 0, endMs: 20000, text: "The name of this song is New Babylon Goddamn.\nNot a show tune—no show left to save.\nThe prophecy was written, the warning was given,\nand now the curtain finally caves.", emphasis: "whisper" },
    { startMs: 20000, endMs: 55000, text: "They're selling us shadows disguised as solutions,\nsoft-wired illusions invading our mind.\nThe watchers are watching the watchers who watch us,\na dark tower with an eye that never sleeps.", emphasis: "normal" },
    { startMs: 55000, endMs: 85000, text: "New Babylon Goddamn—\nYou can cage my body but you can't cage my flame.\nNew Babylon Goddamn—\nYou stole our names but we still rise the same.", emphasis: "shout" },
    { startMs: 85000, endMs: 120000, text: "I breathe bass into the battle, baritone bulldozin' borders,\nbendin' bars like gravity, breakin' binaries,\nI'm the glitch in the grid, the ghost in the gears,\nthe growl in the ground when the truth reappears.", emphasis: "normal" },
    { startMs: 120000, endMs: 155000, text: "Data-drillin', villain-killin', stillin' every false dominion,\nSystem-spillin', truth distillin', cuttin' chains with sharp precision.\nYour surveillance is a weakness,\n'cause you STILL can't track me.", emphasis: "shout" },
    { startMs: 155000, endMs: 185000, text: "These are the charges: surveillance, silence, soul extraction.\nThese are the answers: resistance, reason, chain-reaction.\nWe reclaim imagination—the oldest weapon we own.\nWe rewrite revelation—each of us seeds the throne.", emphasis: "normal" },
    { startMs: 185000, endMs: 215000, text: "New Babylon Goddamn—\nThis is our dawn. This is the end…\n…and the BEGINNING again.", emphasis: "echo" },
  ],
  theaterMode: {
    themeColor: "#FF3300", overlayStyle: "scanlines", act: "ACT I: THE WARNING", revParallel: "Rev 17-18 prologue",
    narrators: ["antiquarian", "storyteller"],
    dialogBeats: [],
    loreCardReveals: [],
  },
};
