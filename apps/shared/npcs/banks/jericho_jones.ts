// apps/shared/npcs/banks/jericho_jones.ts
//
// Sprint 2 #16 — Jericho Jones NPC bank.
//
// The audit identified Jericho as the highest-disparity character on the
// roster: rich lore (mercy-killed Akai Shi at Thaloria, departed on the
// "Heart of Time", canonical Insurgency dovetail) but zero implemented
// content. This bank is the foundation: recruitment, two-way interaction,
// and a five-stage romance ladder per romanceLadders.ts.
//
// Voice signature: laconic gunfighter cadence with occasional
// theological surprises. Outlives most lines by an instant; the line
// after the silence is usually the real one. Never uses your handle
// until he has decided to remember you.
//
// Trust bands: Stranger / Acquaintance / Crew / Confidant / Sworn.
// Reveal stages: pre_thaloria / thaloria_known / heart_offered / aboard.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "jericho_jones" as const;

export const JERICHO_JONES_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // STAGE 1 — pre_thaloria — first encounters, recruitment, banter
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "jericho.intro.first_meet",
    text:
      "Heard about you. Heard you don't take orders from the wrong people. " +
      "I'm Jericho. Don't call me Mr. Jones unless you want to be the kind " +
      "of person who calls a man Mr. Jones. Few people regret that.",
    surfaces: ["room", "match"],
    requiresRevealStage: "pre_thaloria",
    minAct: 3,
    cooldownKey: "jericho.intro",
    maxPlays: 1,
    setsFlags: ["jericho_first_meet"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.intro.recruit_offer",
    text:
      "I work alone, mostly. The 'mostly' is doing some heavy lifting in " +
      "that sentence. You buy a round at the next port, we'll see if the " +
      "lifting wants to slow down for a minute.",
    surfaces: ["room"],
    requiresRevealStage: "pre_thaloria",
    minAct: 3,
    cooldownKey: "jericho.recruit",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.banter.combat_calm",
    text: "Don't flinch. The flinching is what they're aiming at.",
    surfaces: ["match", "match"],
    requiresRevealStage: "pre_thaloria",
    cooldownKey: "jericho.combat_calm",
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.banter.after_kill",
    text:
      "That one was clean. Don't get used to clean. Used-to is how the " +
      "next one gets messy.",
    surfaces: ["match", "match"],
    requiresRevealStage: "pre_thaloria",
    cooldownKey: "jericho.after_kill",
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.banter.you_did_well",
    text:
      "...You did alright back there. (Pause.) I'm saying that to a person " +
      "I plan to see again. The people I don't plan to see again, I don't " +
      "tell.",
    surfaces: ["match", "match"],
    requiresRevealStage: "pre_thaloria",
    cooldownKey: "jericho.you_did_well",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 2 — thaloria_known — the mercy-kill confession, romance gate
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "jericho.thaloria.surface",
    text:
      "Thaloria. The name keeps coming up around me lately. You've been " +
      "doing your reading. Don't ask. Sit down. The asking is what I'm " +
      "trying to skip.",
    surfaces: ["room"],
    requiresRevealStage: "pre_thaloria",
    minAct: 4,
    setsFlags: ["jericho_thaloria_surface"],
    cooldownKey: "jericho.thaloria.surface",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.thaloria.confess",
    text:
      "Akai Shi. The handle was 'Red Death.' Translates better than it " +
      "sounds. I shot him because the alternative was he kept being awake " +
      "during what was happening to him, and the awake part was — it was " +
      "not survivable, the awake. The mercy was the gun. I am not sorry " +
      "I picked it up. I am sorry it had to be picked up.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "pre_thaloria",
    minAct: 4,
    setsFlags: ["jericho_thaloria_confessed", "thaloria_mercy_known"],
    cooldownKey: "jericho.thaloria.confess",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.thaloria.aftermath",
    text:
      "I haven't told the survivors. I haven't told the families. I'm " +
      "telling you. I want to be clear what telling you means to me. It " +
      "means: I am about to start taking the second berth on the Heart " +
      "of Time seriously, and I haven't done that since I had her built.",
    surfaces: ["room"],
    requiresRevealStage: "thaloria_known",
    minAct: 4,
    cooldownKey: "jericho.thaloria.aftermath",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 3 — heart_offered — the romance commitment beat
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "jericho.heart.offer",
    text:
      "Heart of Time. The name sounds romantic. It is, partially. The " +
      "rest of it is engineering. She runs on a chrono-engine I built " +
      "out of grief and patience. There's a second chair. I have not " +
      "moved it for fifteen thousand years. I am moving it tonight.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "thaloria_known",
    minAct: 5,
    setsFlags: ["jericho_heart_of_time_offer"],
    cooldownKey: "jericho.heart.offer",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.heart.commit",
    text:
      "You're sitting in it. The chair, I mean. (Pause.) Don't say " +
      "anything for a minute. The minute is the part of this I asked " +
      "for. The rest of the conversation is what we earn.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "heart_offered",
    minAct: 5,
    setsFlags: ["romance:committed:jericho_jones"],
    cooldownKey: "jericho.heart.commit",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.heart.decline",
    text:
      "Alright. The chair stays where it was. I'm not going to make this " +
      "harder. I'm going to make breakfast tomorrow like always. You're " +
      "welcome at the galley. You should know that. The chair was a yes " +
      "or a no. Breakfast is just breakfast.",
    surfaces: ["room"],
    requiresRevealStage: "heart_offered",
    minAct: 5,
    cooldownKey: "jericho.heart.decline",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 4-5 — aboard — devotion / reactivity
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "jericho.aboard.pre_mission",
    text:
      "Phrase you taught me last week. I'm using it. Don't make a thing " +
      "of it. The using is the thing. The not-making-a-thing-of-it is " +
      "also the thing. Both are vows. I am not calling them vows. " +
      "(Beat.) Let's go.",
    surfaces: ["match", "match"],
    requiresRevealStage: "aboard",
    minAct: 6,
    cooldownKey: "jericho.aboard.pre_mission",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.aboard.combat_with",
    text:
      "Watch the left. (Pause.) Watch the right. (Pause.) I love you. " +
      "Watch the center. The middle one is not a tactical instruction.",
    surfaces: ["match", "match"],
    requiresRevealStage: "aboard",
    minAct: 6,
    cooldownKey: "jericho.aboard.combat_with",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.aboard.late_act",
    text:
      "Heart's running clean. I'm running clean. We have got fewer " +
      "minutes left in the cycle than I thought we'd get. I want to " +
      "spend them right. The right way is sitting with you in the chair " +
      "I moved for you. We can also fight people. The fighting is also " +
      "fine. I just wanted the order on record.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "aboard",
    minAct: 7,
    cooldownKey: "jericho.aboard.late_act",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CROSS-CUTTING — Insurgency tie, Akai Shi callbacks, faction lines
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "jericho.faction.insurgency_nod",
    text:
      "Iron Lions sent a runner. Cades-era flag, modern stitching. They " +
      "want a name. I am giving them yours, with permission. Without " +
      "permission, I am giving them silence. (Beat.) What do you want " +
      "me to give them?",
    surfaces: ["room"],
    reactsToPublicFlag: "faction:championed:insurgency",
    minAct: 5,
    cooldownKey: "jericho.faction.insurgency",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "jericho.faction.architect_skepticism",
    text:
      "The Architect Remnants sent a courier. They want a sit-down. I " +
      "told the courier I sit down for two reasons: dinner, and the " +
      "kind of meeting that ends in a name being added to my list. " +
      "Which one is this. The courier did not have an answer. I am " +
      "still waiting on the answer.",
    surfaces: ["room"],
    reactsToPublicFlag: "faction:championed:architect_remnants",
    minAct: 5,
    cooldownKey: "jericho.faction.architect_skep",
    maxPlays: 1,
  },
];

export const JERICHO_JONES_BANK_META = {
  npcKey: NPC_KEY,
  trustBands: ["Stranger", "Acquaintance", "Crew", "Confidant", "Sworn"] as const,
  revealStages: [
    "pre_thaloria",
    "thaloria_known",
    "heart_offered",
    "aboard",
  ] as const,
  /** Romance ladder identifier. */
  romanceNpcId: "jericho_jones" as const,
} as const;
