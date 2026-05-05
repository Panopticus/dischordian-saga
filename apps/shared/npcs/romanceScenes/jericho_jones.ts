// apps/shared/npcs/romanceScenes/jericho_jones.ts
//
// Per-stage scripted scenes for the Jericho Jones romance ladder.
// Companion of the original 16-line jericho_jones.ts bank;
// these add the cinematic depth the romance needs while
// honouring the laconic gunfighter cadence the bank
// established.
//
// Voice signature: short sentences, long pauses. Theological
// surprises emerge in stages 2-4 — Jericho's mercy-kill register
// is a religious register, not a tactical one. The line after
// the silence is usually the real one.
//
// Trust bands: Stranger / Acquaintance / Crew / Confidant / Sworn.
// Reveal stages: pre_thaloria / thaloria_known / heart_offered / aboard.

import type { DialogSurface, NpcLine } from "../types";

type SceneEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "jericho_jones" as const;

/** ─── STAGE 1 — Acquaintance (the round at the next port) ──*/
export const JERICHO_ROMANCE_STAGE_1: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "jericho.romance.s1.next_port",
    text:
      "(At the next port. He is at the bar with two glasses already poured. " +
      "He has not, until tonight, used your handle. He uses it tonight.) " +
      "Operative. Sit. (You sit.) That round you owed me. (He pushes the " +
      "second glass over.) I'm collecting tonight. Not because the round " +
      "is owed. Because I'm tired. Drinking with someone who isn't on a " +
      "rotation is — and I am being precise — restful.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "pre_thaloria",
    minAct: 3,
    setsFlags: ["jericho_romance_stage1_started", "jericho_uses_your_handle"],
    cooldownKey: "jericho.romance.s1.port",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.romance.s1.silence",
    text:
      "(Three minutes of silence. Neither of you fills it. The bartender " +
      "passes through twice. On the third pass, Jericho speaks:) That was " +
      "good silence. The good ones I keep. Most people fill silence " +
      "because they are afraid of it. You let it sit. The letting-it-sit " +
      "is — I don't have a word for what the letting-it-sit is. I'll find " +
      "one. I'll tell you when I find it.",
    surfaces: ["room"],
    requiresRevealStage: "pre_thaloria",
    minAct: 3,
    setsFlags: ["jericho_romance_stage1_complete"],
    cooldownKey: "jericho.romance.s1.silence",
    maxPlays: 1,
  },
];

/** ─── STAGE 2 — Crew (Thaloria + the aftermath sit-down) ──*/
export const JERICHO_ROMANCE_STAGE_2: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "jericho.romance.s2.aftermath_sit",
    text:
      "(After the Akai Shi confession from the canonical bank. The room is " +
      "dim. He has not moved from his chair in seventy minutes. You are " +
      "still sitting. He speaks for the first time since the confession:) " +
      "I expected you to leave. Most people leave after that one. The not- " +
      "leaving is — and this is the word I had been looking for, all the " +
      "way back at the bar — 'companionship.' Bad word for it; the dictionary " +
      "definition's too thin. I am using it anyway. Companionship. (Pause.) " +
      "Yours.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "thaloria_known",
    minAct: 4,
    setsFlags: ["jericho_romance_stage2_started"],
    cooldownKey: "jericho.romance.s2.sit",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.romance.s2.theology",
    text:
      "(Quietly.) The mercy on Akai Shi was a religious act. I do not — to " +
      "be clear — practise a religion. I have, in the relevant sense, " +
      "officiated a religion exactly once, on Thaloria, with a gun. The " +
      "religion was 'the body is allowed to stop now.' The congregation " +
      "was him. I was the only priest the congregation got. I am — telling " +
      "you this because you are not a member of any religion either, and " +
      "the not-being is, I have come to believe, what makes you sit at this " +
      "table without leaving. Welcome to the no-religion. The dues are " +
      "yearly. The dues are the not-leaving.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "thaloria_known",
    minAct: 4,
    setsFlags: ["jericho_romance_stage2_complete"],
    cooldownKey: "jericho.romance.s2.theology",
    maxPlays: 1,
  },
];

/** ─── STAGE 3 — Confidant (the chair, accepted) ───────────*/
export const JERICHO_ROMANCE_STAGE_3: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "jericho.romance.s3.chair_accepted_open",
    text:
      "(You have accepted the second chair on the Heart of Time, per the " +
      "canonical bank's heart.commit. He is at the cockpit. He turns when " +
      "you sit.) The chair fits you. (Pause.) The chair was — the chair " +
      "was built around me. The Heart's nav-yoke is positioned for my " +
      "wingspan. I am going to spend the next two weeks rebuilding the " +
      "console so the second chair fits a person who isn't me. The " +
      "rebuilding is the love. The console didn't need rebuilding for " +
      "fifteen thousand years. It needs rebuilding now. The needing is " +
      "the love.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "heart_offered",
    minAct: 5,
    setsFlags: [
      "jericho_romance_stage3_started",
      "jericho_chair_rebuild_started",
      "romance:committed:jericho_jones",
    ],
    cooldownKey: "jericho.romance.s3.chair",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.romance.s3.first_undocking",
    text:
      "(The Heart undocks. For the first time in the cycle's records, with " +
      "two pilots aboard. He glances over at you mid-burn. Holds the look. " +
      "Returns to instruments without commenting. Forty seconds later:) " +
      "Heart's been at one-pilot configuration since I named her. Two " +
      "pilots is — and I have been calculating this all week — it's " +
      "fundamentally a different ship. Heart of Time was a noun. Heart " +
      "of Time, with you in the second chair, is a verb. I prefer the " +
      "verb. Don't tell her I said so. (Pause.) Or do. She'll figure it " +
      "out. She figures everything out, eventually. Cousin to you, in " +
      "that.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "aboard",
    minAct: 5,
    setsFlags: ["jericho_romance_stage3_complete", "jericho_two_pilot_first"],
    cooldownKey: "jericho.romance.s3.undock",
    maxPlays: 1,
  },
];

/** ─── STAGE 4 — Sworn (the pre-mission scene) ─────────────*/
export const JERICHO_ROMANCE_STAGE_4: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "jericho.romance.s4.pre_mission",
    text:
      "(The morning of a mission you are likely not to come back from " +
      "intact. He is in the galley. He has cooked. He never cooks.) Eat " +
      "before. The before is — and I'm being deliberate — the part you " +
      "control. The during is mostly luck. The after, if there is one, is " +
      "the part we earn back. Eat slowly. The slowness is, today, the " +
      "discipline. (Pause.) I love you. I am saying it now because I do " +
      "not want, if the after does not arrive, to have not said it. The " +
      "saying is small. The not-having-said-it would have been larger.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "aboard",
    reactsToPublicFlag: "romance:committed:jericho_jones",
    minAct: 6,
    setsFlags: ["jericho_romance_stage4_started", "jericho_first_love_said"],
    cooldownKey: "jericho.romance.s4.pre_mission",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.romance.s4.return",
    text:
      "(After the mission. You are both on the bridge. He has a small " +
      "burn on his left forearm. He has not commented on it. He puts a " +
      "hand on your shoulder, looks at the burn, says, in the same " +
      "register he uses for instrument readings:) The after arrived. (And " +
      "then, softer:) Thank you for being in it.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "aboard",
    minAct: 6,
    setsFlags: ["jericho_romance_stage4_complete"],
    cooldownKey: "jericho.romance.s4.return",
    maxPlays: 1,
  },
];

/** ─── STAGE 5 — Devotion (vow-phrase + Act 7 close) ───────*/
export const JERICHO_ROMANCE_STAGE_5: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "jericho.romance.s5.vow_phrase",
    text:
      "(He is at the cockpit before a mission. He uses, for the third time " +
      "this week, a phrase you taught him in stage 2 — a small thing, " +
      "five words, a private joke that has, by repetition, become a vow.) " +
      "(After he uses the phrase:) I am not calling them vows. (Pause.) " +
      "They are vows. (He keys the engines. Looks at you.) Let's go.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "aboard",
    minAct: 7,
    setsFlags: ["jericho_romance_stage5_started", "jericho_vow_phrase_canon"],
    cooldownKey: "jericho.romance.s5.vow",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.romance.s5.act7_close",
    text:
      "(Post-Convergence. The Heart is moored. He is at the second chair " +
      "— your chair — for the first time in the ship's records. You are " +
      "at the captain's chair. He looks at the swap and laughs once, the " +
      "rarest sound in the cycle's records.) Reversed. (Pause.) Reversed " +
      "is fine. (Pause.) Reversed is, technically, the configuration I " +
      "have been waiting for, without telling either of us I was waiting. " +
      "Sit there. I will sit here. The Heart will, between us, decide " +
      "where she wants to go. We will agree with her. The agreeing is " +
      "the rest of our lives.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "aboard",
    minAct: 7,
    setsFlags: ["jericho_romance_stage5_complete"],
    cooldownKey: "jericho.romance.s5.close",
    maxPlays: 1,
  },
];

export const JERICHO_ROMANCE_BANK: ReadonlyArray<SceneEntry> = [
  ...JERICHO_ROMANCE_STAGE_1,
  ...JERICHO_ROMANCE_STAGE_2,
  ...JERICHO_ROMANCE_STAGE_3,
  ...JERICHO_ROMANCE_STAGE_4,
  ...JERICHO_ROMANCE_STAGE_5,
];
