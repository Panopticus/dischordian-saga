/* ═══════════════════════════════════════════════════════
   SILENCE IN HEAVEN — Canonical Tracklist + Narrator Data

   Malkia Ukweli & The Panopticon
   "The Fall of Reality: A Neo-Gospel Musical"

   Source: Silence_in_Heaven_Script.md (v2 canon)
   18 tracks across 3 acts + epilogue, mapped to Revelation 8-22.
   ═══════════════════════════════════════════════════════ */

import type {
  Album5BackgroundId,
  Album5PortraitId,
} from "./expansionArt/album5Slideshows";

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

/**
 * One spoken beat in a dialog interlude. `bgId` and `expressionId` pair the
 * line with a specific dialog background and narrator portrait from
 * apps/shared/expansionArt/album5Slideshows.ts. Both are optional so beats
 * can author intentionally — `bgId` may be undefined for opening voids that
 * pre-cede a setting, and `expressionId` is undefined for `speaker: "both"`
 * beats (the renderer composites both narrators in their default poses).
 */
export interface SIHPrologueBeat {
  speaker: "antiquarian" | "storyteller" | "both";
  line: string;
  /** Background scene from ALBUM5_DIALOG_BACKGROUNDS. */
  bgId?: Album5BackgroundId;
  /** Speaker's portrait expression from ALBUM5_NARRATOR_PORTRAITS. Pin to
   *  the active speaker; leave undefined when speaker is "both". */
  expressionId?: Album5PortraitId;
}

export const SIH_PROLOGUE: SIHPrologueBeat[] = [
  { speaker: "antiquarian", bgId: "sih_bg_void", expressionId: "sih_antiq_archive",
    line: "In the beginning was the Word. A rather audacious claim, wouldn't you say? It presupposes a singular vocabulary, a definitive text. But reality, my friends, is a collaborative fiction, a story told by a committee of unreliable narrators. And I should know. I wrote the first draft." },
  { speaker: "storyteller", bgId: "sih_bg_void", expressionId: "sih_story_knowing",
    line: "And it has a rhythm. Don't forget the rhythm, old man. The beat that persists even when the heart has stopped. The melody that remembers what the mind has forgotten." },
  { speaker: "antiquarian", bgId: "sih_bg_void", expressionId: "sih_antiq_concede",
    line: "The stubborn, illogical, infuriating pulse of hope." },
  { speaker: "both", bgId: "sih_bg_street",
    line: "New Babylon. Goddamn." },
];

/* ─── INTER-TRACK DIALOG (transitions between songs) ─── */

export interface SIHInterTrackDialog {
  afterTrack: number;
  beats: SIHPrologueBeat[];
}

export const SIH_INTER_TRACK_DIALOG: SIHInterTrackDialog[] = [
  {
    afterTrack: 1, // → T03 dialog, before T04 "Letters to the Remnant"
    beats: [
      { speaker: "storyteller", bgId: "sih_bg_street", expressionId: "sih_story_fire",
        line: "See? A glitch in the system. A crack in the facade. A reminder that even in the heart of the machine, a human voice can still start a fire." },
      { speaker: "antiquarian", bgId: "sih_bg_street", expressionId: "sih_antiq_warn",
        line: "A fire, yes. But a fire is easily extinguished. It is not enough to sing of freedom. You must write it into the code. You must send the message to those who have forgotten how to listen." },
      { speaker: "storyteller", bgId: "sih_bg_sanctuary", expressionId: "sih_story_tender",
        line: "Then let us write to them. A letter to the lost. A message to the remnant." },
    ],
  },
  {
    afterTrack: 2, // → T05 dialog "A Conspiracy of Hope", before T06 "Turn Back"
    beats: [
      { speaker: "storyteller", bgId: "sih_bg_sanctuary", expressionId: "sih_story_witness",
        line: "The letter is written. The remnant has heard. Now comes the harder thing — the calling-back." },
      { speaker: "antiquarian", bgId: "sih_bg_sanctuary", expressionId: "sih_antiq_warn",
        line: "A conspiracy of hope. Thirteen centuries I've kept the archive, and I've never found a more dangerous phrase." },
      { speaker: "storyteller", bgId: "sih_bg_sanctuary", expressionId: "sih_story_tender",
        line: "Then turn back. While the door is still open." },
    ],
  },
  {
    afterTrack: 3, // → T07 dialog, before T08 "Worthy"
    beats: [
      { speaker: "antiquarian", bgId: "sih_bg_seals", expressionId: "sih_antiq_concede",
        line: "Choice, deferred, is choice, denied. The debate is over." },
      { speaker: "storyteller", bgId: "sih_bg_throne", expressionId: "sih_story_witness",
        line: "And now... the consequences. Who is worthy to even look upon the truth of what comes next?" },
    ],
  },
  {
    afterTrack: 4, // → T09 dialog "Not a Lion but a Lamb", before T10 "Behold"
    beats: [
      { speaker: "antiquarian", bgId: "sih_bg_throne", expressionId: "sih_antiq_archive",
        line: "All of heaven assembled, and not one creature could break the seal. Not the elders. Not the cherubim. Not me, for what it's worth." },
      { speaker: "storyteller", bgId: "sih_bg_throne", expressionId: "sih_story_witness",
        line: "And then he stood — not a lion. A lamb. Wounded. Worthy." },
      { speaker: "antiquarian", bgId: "sih_bg_throne", expressionId: "sih_antiq_concede",
        line: "I keep expecting the metaphor to land differently. It never does." },
    ],
  },
  {
    afterTrack: 5, // → T11 dialog, before T12 "Plead the Fifth"
    beats: [
      { speaker: "antiquarian", bgId: "sih_bg_seals", expressionId: "sih_antiq_dread",
        line: "And did they listen? Did they repent? Did they look upon the ruin they had wrought and seek a different path? What do you think?" },
    ],
  },
  {
    afterTrack: 6, // → T13 dialog "How Long", before T14 "The Two Witnesses"
    beats: [
      { speaker: "storyteller", bgId: "sih_bg_altar", expressionId: "sih_story_grief",
        line: "The dead beneath the altar are still asking the question. 'How long, Sovereign Lord, until you judge?'" },
      { speaker: "antiquarian", bgId: "sih_bg_altar", expressionId: "sih_antiq_grief",
        line: "And the answer they receive is a robe and a little more waiting. I've never been comfortable with that answer." },
      { speaker: "storyteller", bgId: "sih_bg_altar", expressionId: "sih_story_fire",
        line: "Wait until the witnesses arrive. They are coming. They are already on the road." },
    ],
  },
  {
    afterTrack: 7, // → T15 dialog "And the Empire Celebrated", before T16 "The Trumpets"
    beats: [
      { speaker: "antiquarian", bgId: "sih_bg_street", expressionId: "sih_antiq_wry",
        line: "Three and a half days. That's all the empire got. Three and a half days of dead witnesses in the street and a city throwing parties." },
      { speaker: "storyteller", bgId: "sih_bg_street", expressionId: "sih_story_defiant",
        line: "Long enough to send each other gifts. Short enough to feel like a punchline." },
      { speaker: "antiquarian", bgId: "sih_bg_trumpet_broadcast", expressionId: "sih_antiq_awe",
        line: "The breath returns. The witnesses stand. The trumpets begin. I never get tired of this part." },
    ],
  },
  {
    afterTrack: 8, // → T17 dialog, before T18 "They Would Not Repent"
    beats: [
      { speaker: "storyteller", bgId: "sih_bg_trumpet_broadcast", expressionId: "sih_story_grief",
        line: "A third of the trees, burned. A third of the seas, turned to blood. A third of the stars, fallen. A warning, written in the language of devastation." },
      { speaker: "antiquarian", bgId: "sih_bg_trumpet_broadcast", expressionId: "sih_antiq_dread",
        line: "And did they listen? Did they repent? What do you think?" },
    ],
  },
  {
    afterTrack: 9, // → T19 dialog, before T20 "False Prophet"
    beats: [
      { speaker: "storyteller", bgId: "sih_bg_agora", expressionId: "sih_story_grief",
        line: "When you refuse to see the truth, you become fertile ground for a lie." },
      { speaker: "antiquarian", bgId: "sih_bg_agora", expressionId: "sih_antiq_wry",
        line: "It was time for the star of the show to make his appearance. The False Prophet." },
    ],
  },
  {
    afterTrack: 10, // → T21 dialog "Here is Wisdom", before T22 "Sixth Sense"
    beats: [
      { speaker: "storyteller", bgId: "sih_bg_wisdom", expressionId: "sih_story_knowing",
        line: "Here is wisdom. The number can be counted. The system is not infinite. Every empire ends." },
      { speaker: "antiquarian", bgId: "sih_bg_wisdom", expressionId: "sih_antiq_archive",
        line: "That has been my thesis for considerably longer than is polite to admit. The receipts are in the Chronicle. Volumes one through six." },
    ],
  },
  {
    afterTrack: 11, // → T23 dialog, before T24 "Silence in Heaven"
    beats: [
      { speaker: "storyteller", bgId: "sih_bg_silence", expressionId: "sih_story_witness",
        line: "And when the seventh seal was broken..." },
      { speaker: "antiquarian", bgId: "sih_bg_silence", expressionId: "sih_antiq_peace",
        line: "...there was silence. In heaven. For about the space of half an hour." },
    ],
  },
  {
    afterTrack: 12, // → T25 dialog "The Resurrection Glitch", before T26 "The Mark"
    beats: [
      { speaker: "antiquarian", bgId: "sih_bg_silence", expressionId: "sih_antiq_dread",
        line: "The silence ended. I almost wish it hadn't." },
      { speaker: "storyteller", bgId: "sih_bg_resurrection", expressionId: "sih_story_fire",
        line: "Watch what comes through the seam. The dead are not staying dead. The system did not account for resurrection. They called it a glitch." },
      { speaker: "antiquarian", bgId: "sih_bg_resurrection", expressionId: "sih_antiq_wry",
        line: "It was always a glitch. To them. We called it the point of the whole exercise." },
    ],
  },
  {
    afterTrack: 13, // → T27 dialog "The Sorting of Souls", before T28 "The Harvest"
    beats: [
      { speaker: "storyteller", bgId: "sih_bg_antechamber", expressionId: "sih_story_grief",
        line: "The mark was a small thing. A scan. A convenience. Nobody held a sword to anyone's throat." },
      { speaker: "antiquarian", bgId: "sih_bg_antechamber", expressionId: "sih_antiq_dread",
        line: "That is what makes the sorting so terrible. Every name in every column put itself there." },
    ],
  },
  {
    afterTrack: 14, // → T29 dialog "The Final Measure", before T30 "It is Done"
    beats: [
      { speaker: "antiquarian", bgId: "sih_bg_harvest", expressionId: "sih_antiq_concede",
        line: "The harvest is in. The wheat to the barn. The chaff to the fire. Everyone always wants to ask which they were. Almost no one wants the answer." },
      { speaker: "storyteller", bgId: "sih_bg_bowls", expressionId: "sih_story_witness",
        line: "The bowls are next. Seven of them. The full measure. After this, no more warnings." },
    ],
  },
  {
    afterTrack: 15, // → T31 dialog "The Lament of Kings and Merchants", before T32 "Fall of New Babylon"
    beats: [
      { speaker: "storyteller", bgId: "sih_bg_bowls", expressionId: "sih_story_grief",
        line: "The kings will weep. The merchants will weep. Everyone who built their fortune on the body of the city will stand at a great distance and weep." },
      { speaker: "antiquarian", bgId: "sih_bg_bowls", expressionId: "sih_antiq_dread",
        line: "Distance has always been the empire's preferred posture toward consequence. They watch the smoke. They do not enter the smoke." },
    ],
  },
  {
    afterTrack: 16, // → T33 dialog "Heaven Stands Open", before T34 "Faithful and True"
    beats: [
      { speaker: "antiquarian", bgId: "sih_bg_empty", expressionId: "sih_antiq_archive",
        line: "Babylon fell at last. I had filed the date in the archive nine times and crossed it out nine times. The tenth time, the date held." },
      { speaker: "storyteller", bgId: "sih_bg_gate", expressionId: "sih_story_witness",
        line: "And then the sky opened. Not split. Opened. Like a door that had always been a door." },
    ],
  },
  {
    afterTrack: 17, // → T35 dialog "Make All Things New", before T36 "All Things New"
    beats: [
      { speaker: "storyteller", bgId: "sih_bg_newearth", expressionId: "sih_story_tender",
        line: "He said he was making everything new. Not new things. Everything. Including the things we thought were already finished." },
      { speaker: "antiquarian", bgId: "sih_bg_newearth", expressionId: "sih_antiq_concede",
        line: "Including, I gather, me." },
      { speaker: "storyteller", bgId: "sih_bg_newearth", expressionId: "sih_story_joy",
        line: "Especially you, old man." },
    ],
  },
  {
    afterTrack: 18, // → T37 dialog "The Story is Yours Now" — album closer
    beats: [
      { speaker: "antiquarian", bgId: "sih_bg_empty", expressionId: "sih_antiq_peace",
        line: "The Chronicle ends here. I have nothing left to read into the record." },
      { speaker: "storyteller", bgId: "sih_bg_empty", expressionId: "sih_story_tender",
        line: "And the song ends here. I have nothing left to sing into the silence." },
      { speaker: "both", bgId: "sih_bg_empty",
        line: "The story is yours now." },
    ],
  },
];

/** All track ids for integrity checks. */
export const SIH_TRACK_IDS = SIH_TRACKLIST.map(t => t.id);
