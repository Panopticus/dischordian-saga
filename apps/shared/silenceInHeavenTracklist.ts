/* ═══════════════════════════════════════════════════════
   SILENCE IN HEAVEN — Canonical Tracklist + Narrator Data

   Malkia Ukweli & The Panopticon
   "The Fall of Reality: A Neo-Gospel Musical"

   Source: Silence_in_Heaven_Script.md (v2 canon)
   18 tracks across 3 acts + epilogue, mapped to Revelation 8-22.
   ═══════════════════════════════════════════════════════ */

export interface SIHTrackMeta {
  id: string;
  trackNumber: number;
  title: string;
  act: "ACT I: THE WARNING" | "ACT II: THE JUDGMENT" | "ACT III: THE RECKONING" | "EPILOGUE";
  revParallel: string;
  themeColor: string;
  overlayStyle: "vignette" | "scanlines" | "corruption" | "particles" | "grain" | "clean";
  hasExistingVideo: boolean;
  youtubeUrl?: string;
  frameCount: number;
  tone: string;
  primaryCharacters: string[];
}

export const SIH_TRACKLIST: SIHTrackMeta[] = [
  { id: "sih-01", trackNumber: 1, title: "New Babylon Goddamn", act: "ACT I: THE WARNING", revParallel: "Rev 17-18 prologue", themeColor: "#FF3300", overlayStyle: "scanlines", hasExistingVideo: false, frameCount: 7, tone: "Furious prophecy. Protest song as overture.", primaryCharacters: ["storyteller", "antiquarian"] },
  { id: "sih-02", trackNumber: 2, title: "Letters to the Remnant", act: "ACT I: THE WARNING", revParallel: "Rev 2-3 (letters to churches)", themeColor: "#1A3A6B", overlayStyle: "vignette", hasExistingVideo: false, frameCount: 7, tone: "Moral diagnosis. Intimate. Recognition not accusation.", primaryCharacters: ["storyteller", "antiquarian"] },
  { id: "sih-03", trackNumber: 3, title: "Turn Back", act: "ACT I: THE WARNING", revParallel: "Final mercy before judgment", themeColor: "#E8E0D0", overlayStyle: "corruption", hasExistingVideo: false, frameCount: 6, tone: "The last mercy. The door is closing.", primaryCharacters: ["storyteller", "antiquarian"] },
  { id: "sih-04", trackNumber: 4, title: "Worthy (Who Can Open It)", act: "ACT II: THE JUDGMENT", revParallel: "Rev 4-5 (throne room, scroll)", themeColor: "#D4AF37", overlayStyle: "clean", hasExistingVideo: false, frameCount: 5, tone: "Awe. The question of authority.", primaryCharacters: ["storyteller", "antiquarian"] },
  { id: "sih-05", trackNumber: 5, title: "Behold (The Horsemen)", act: "ACT II: THE JUDGMENT", revParallel: "Rev 6:1-8 (four seals)", themeColor: "#808080", overlayStyle: "grain", hasExistingVideo: false, frameCount: 5, tone: "Consequences. The logical outcome of choices.", primaryCharacters: ["storyteller", "antiquarian"] },
  { id: "sih-06", trackNumber: 6, title: "Plead the Fifth", act: "ACT II: THE JUDGMENT", revParallel: "Rev 6:9-11 (fifth seal, martyrs)", themeColor: "#F5F5F5", overlayStyle: "vignette", hasExistingVideo: false, frameCount: 6, tone: "The dead ask a question. Justice delayed.", primaryCharacters: ["storyteller"] },
  { id: "sih-07", trackNumber: 7, title: "The Two Witnesses", act: "ACT II: THE JUDGMENT", revParallel: "Rev 11", themeColor: "#4A90D9", overlayStyle: "scanlines", hasExistingVideo: false, frameCount: 6, tone: "Truth walks into the street.", primaryCharacters: ["antiquarian", "storyteller"] },
  { id: "sih-08", trackNumber: 8, title: "The Trumpets", act: "ACT II: THE JUDGMENT", revParallel: "Rev 8-9, 11", themeColor: "#FF6B00", overlayStyle: "corruption", hasExistingVideo: false, frameCount: 5, tone: "The world answering back. Echoes, not punishment.", primaryCharacters: ["storyteller", "antiquarian"] },
  { id: "sih-09", trackNumber: 9, title: "They Would Not Repent", act: "ACT II: THE JUDGMENT", revParallel: "Rev 9:20-21", themeColor: "#8B0000", overlayStyle: "scanlines", hasExistingVideo: false, frameCount: 4, tone: "The most damning moment. Not ignorance — choice.", primaryCharacters: ["storyteller"] },
  { id: "sih-10", trackNumber: 10, title: "False Prophet", act: "ACT II: THE JUDGMENT", revParallel: "Rev 13:11-15", themeColor: "#C8A456", overlayStyle: "clean", hasExistingVideo: false, frameCount: 6, tone: "The most seductive song. It should sound good. That is the danger.", primaryCharacters: ["white_oracle", "storyteller"] },
  { id: "sih-11", trackNumber: 11, title: "Sixth Sense", act: "ACT II: THE JUDGMENT", revParallel: "Rev 6 (sixth seal) + Rev 13 (Mark)", themeColor: "#7B00FF", overlayStyle: "particles", hasExistingVideo: false, frameCount: 6, tone: "The seductive threshold. Collapse beginning with consent.", primaryCharacters: ["storyteller", "female_devil"] },
  { id: "sih-12", trackNumber: 12, title: "Silence in Heaven", act: "ACT III: THE RECKONING", revParallel: "Rev 8:1 (half-hour silence)", themeColor: "#000000", overlayStyle: "clean", hasExistingVideo: false, frameCount: 5, tone: "The most powerful moment. Total silence. Reverent dread.", primaryCharacters: ["antiquarian", "storyteller"] },
  { id: "sih-13", trackNumber: 13, title: "The Mark", act: "ACT III: THE RECKONING", revParallel: "Rev 13:16-18", themeColor: "#C8A080", overlayStyle: "vignette", hasExistingVideo: false, frameCount: 1, tone: "The most intimate horror. Nobody forced them.", primaryCharacters: ["storyteller"] },
  { id: "sih-14", trackNumber: 14, title: "The Harvest", act: "ACT III: THE RECKONING", revParallel: "Rev 14:14-20", themeColor: "#D4AF37", overlayStyle: "clean", hasExistingVideo: false, frameCount: 1, tone: "Not judgment — timing. What grew shows its face.", primaryCharacters: ["antiquarian"] },
  { id: "sih-15", trackNumber: 15, title: "It Is Done (The Bowls)", act: "ACT III: THE RECKONING", revParallel: "Rev 15-16", themeColor: "#FFFFFF", overlayStyle: "corruption", hasExistingVideo: false, frameCount: 1, tone: "Completion. No more warnings. The full measure.", primaryCharacters: ["antiquarian"] },
  { id: "sih-16", trackNumber: 16, title: "Fall of New Babylon", act: "ACT III: THE RECKONING", revParallel: "Rev 18", themeColor: "#8B6914", overlayStyle: "grain", hasExistingVideo: false, frameCount: 1, tone: "The funeral of empire. No heroes. Just collapse.", primaryCharacters: ["storyteller", "antiquarian"] },
  { id: "sih-17", trackNumber: 17, title: "Faithful and True", act: "ACT III: THE RECKONING", revParallel: "Rev 19 (white horse)", themeColor: "#FFFFFF", overlayStyle: "clean", hasExistingVideo: false, frameCount: 1, tone: "Authority arriving without volume. Truth that doesn't shout.", primaryCharacters: ["storyteller"] },
  { id: "sih-18", trackNumber: 18, title: "All Things New", act: "EPILOGUE", revParallel: "Rev 21-22", themeColor: "#90EE90", overlayStyle: "clean", hasExistingVideo: false, frameCount: 2, tone: "The exhale. Not triumph. Healing.", primaryCharacters: ["storyteller", "antiquarian"] },
];

/* ─── NARRATORS ─── */

export interface SIHNarrator {
  id: string;
  name: string;
  canonicalName: string;
  description: string;
  visualDescription: string;
  role: string;
}

export const SIH_NARRATORS: SIHNarrator[] = [
  {
    id: "antiquarian",
    name: "The Antiquarian",
    canonicalName: "Dr. Daniel Cross / The Programmer",
    description: "A collector of endings. A curator of apocalypses.",
    visualDescription: "Seated in a high-backed chair made of tangled cables and starlight. Massive leather-bound Chronicle open on his lap. Ancient and weary. Dry, wry voice. Red-tinted goggles.",
    role: "The Oracle — cross-examines algorithms, fractures syntax, volatile and precise",
  },
  {
    id: "storyteller",
    name: "The Storyteller (Malkia Ukweli)",
    canonicalName: "The Enigma",
    description: "I collect the beginnings that hide inside endings.",
    visualDescription: "Stands at a glowing microphone stand. Vibrant, defiant, warm. Deep umber skin. Short, natural hair. Crimson silk gown with flowing torn hem strips. Antique gold cross at her neck.",
    role: "The Enigma — testifies in tempo, lets the cadence do the work, clarity cuts deeper than the kill",
  },
];

/* ─── PROLOGUE ─── */

export interface SIHPrologueBeat {
  speaker: "antiquarian" | "storyteller" | "both";
  line: string;
}

export const SIH_PROLOGUE: SIHPrologueBeat[] = [
  { speaker: "antiquarian", line: "In the beginning was the Word. A rather audacious claim, wouldn't you say? It presupposes a singular vocabulary, a definitive text. But reality, my friends, is a collaborative fiction, a story told by a committee of unreliable narrators. And I should know. I wrote the first draft." },
  { speaker: "storyteller", line: "And it has a rhythm. Don't forget the rhythm, old man. The beat that persists even when the heart has stopped. The melody that remembers what the mind has forgotten." },
  { speaker: "antiquarian", line: "The stubborn, illogical, infuriating pulse of hope." },
  { speaker: "both", line: "New Babylon. Goddamn." },
];

/* ─── INTER-TRACK DIALOG (transitions between songs) ─── */

export interface SIHInterTrackDialog {
  afterTrack: number;
  beats: SIHPrologueBeat[];
}

export const SIH_INTER_TRACK_DIALOG: SIHInterTrackDialog[] = [
  {
    afterTrack: 1,
    beats: [
      { speaker: "storyteller", line: "See? A glitch in the system. A crack in the facade. A reminder that even in the heart of the machine, a human voice can still start a fire." },
      { speaker: "antiquarian", line: "A fire, yes. But a fire is easily extinguished. It is not enough to sing of freedom. You must write it into the code. You must send the message to those who have forgotten how to listen." },
      { speaker: "storyteller", line: "Then let us write to them. A letter to the lost. A message to the remnant." },
    ],
  },
  {
    afterTrack: 3,
    beats: [
      { speaker: "antiquarian", line: "Choice, deferred, is choice, denied. The debate is over." },
      { speaker: "storyteller", line: "And now... the consequences. Who is worthy to even look upon the truth of what comes next?" },
    ],
  },
  {
    afterTrack: 5,
    beats: [
      { speaker: "antiquarian", line: "And did they listen? Did they repent? Did they look upon the ruin they had wrought and seek a different path? What do you think?" },
    ],
  },
  {
    afterTrack: 8,
    beats: [
      { speaker: "storyteller", line: "A third of the trees, burned. A third of the seas, turned to blood. A third of the stars, fallen. A warning, written in the language of devastation." },
      { speaker: "antiquarian", line: "And did they listen? Did they repent? What do you think?" },
    ],
  },
  {
    afterTrack: 9,
    beats: [
      { speaker: "storyteller", line: "When you refuse to see the truth, you become fertile ground for a lie." },
      { speaker: "antiquarian", line: "It was time for the star of the show to make his appearance. The False Prophet." },
    ],
  },
  {
    afterTrack: 11,
    beats: [
      { speaker: "storyteller", line: "And when the seventh seal was broken..." },
      { speaker: "antiquarian", line: "...there was silence. In heaven. For about the space of half an hour." },
    ],
  },
];

/** All track ids for integrity checks. */
export const SIH_TRACK_IDS = SIH_TRACKLIST.map(t => t.id);
