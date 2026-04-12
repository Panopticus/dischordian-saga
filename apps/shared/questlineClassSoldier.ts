/* ═══════════════════════════════════════════════════════
   CLASS QUESTLINE — SOLDIER
   "WHAT WAR BUILDS AND WHAT IT DESTROYS"

   Spec §3.5 — 1 chapter.
   Iron Lion's damaged recording reaches the player
   through the Comms Array. Seventeen thousand years old,
   soldier to soldier. He knew there would be more.
   ═══════════════════════════════════════════════════════ */

import type { PotentialQuestline, PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

/* ─── FLAGS ─── */

export const SOLDIER_FLAGS = [
  "soldier_iron_lion_broadcast_heard",
  "soldier_broadcast_investigated",
  "soldier_broadcast_honored",
  "soldier_broadcast_questioned",
  "soldier_broadcast_accepted",
] as const;

/* ─── CHAPTER 1: IRON LION'S BROADCAST REACHES YOU FIRST ─── */

const ch1Wheel: WheelOption[] = [
  {
    id: "sol_ch1_investigate_broadcast",
    segment: "investigate",
    rarity: "common",
    label: "Can we recover more?",
    fullText: "That recording is damaged. Is there more? Can we reconstruct the rest of the broadcast, clean up the signal?",
    outcome: {
      elaraTrustDelta: 2,
      unlocks: ["codex_iron_lion_broadcast_fragments"],
    },
  },
  {
    id: "sol_ch1_humanity_honor",
    segment: "humanity",
    rarity: "common",
    label: "Soldier to soldier",
    fullText: "He said 'soldier to soldier, if that still means something.' It does. Whatever he was trying to say, I want to hear all of it.",
    outcome: {
      moralityDelta: 3,
      elaraTrustDelta: 2,
    },
  },
  {
    id: "sol_ch1_aggressive_question",
    segment: "aggressive",
    rarity: "common",
    label: "Why my channel?",
    fullText: "Seventeen thousand years old and it came through on my channel specifically? That's not a coincidence. Someone pointed this at me.",
    outcome: {
      moralityDelta: -1,
      humanTrustDelta: 2,
    },
  },
  {
    id: "sol_ch1_compassionate_accept",
    segment: "compassionate",
    rarity: "common",
    label: "He was talking to me",
    fullText: "He didn't know my name. He didn't know when I'd be born. But he recorded that message for the next soldier, and I'm the next soldier. I'm listening.",
    outcome: {
      moralityDelta: 3,
      elaraTrustDelta: 3,
      humanTrustDelta: 1,
    },
  },
];

const chapter1: PotentialQuestlineChapter = {
  id: "soldier_ch1_iron_lion_broadcast",
  completionFlag: "soldier_iron_lion_broadcast_heard",
  title: "Iron Lion's Broadcast Reaches You First",
  hook: "A damaged recording has come through the Comms Array. Iron Lion — seventeen thousand years old — speaking soldier to soldier.",
  sectorId: "ark_comms_array",
  opener: [
    {
      speaker: "elara",
      text: "We're receiving a damaged recording through the Comms Array. It's old — extremely old. The signal degradation suggests it's been bouncing through relay stations for... I'm not sure I trust this number.",
    },
    {
      speaker: "iron_lion_recording",
      stageDirection: "A damaged recording, full of static. The voice is deep, tired, and unmistakably military.",
      text: "...to whoever finds this. Soldier to soldier, if that still means something.",
    },
    {
      speaker: "iron_lion_recording",
      stageDirection: "The fragment ends in static. The recording loops once, then falls silent.",
    },
    {
      speaker: "elara",
      text: "That's Iron Lion. Seventeen thousand years old. Came through on your channel.",
    },
    {
      speaker: "the_human",
      text: "He knew there would be more soldiers after him. He was talking to you.",
    },
  ],
  wheel: ch1Wheel,
  followups: {
    sol_ch1_investigate_broadcast: [
      {
        speaker: "elara",
        text: "The recording is severely degraded. I can identify at least three additional data segments embedded in the carrier wave, but they'll need significant reconstruction. This wasn't a simple voice recording — Iron Lion encoded something in the signal itself. Military-grade, multi-layered.",
      },
      {
        speaker: "the_human",
        text: "He was a soldier. He didn't just leave a message. He left a briefing. The voice is the part he wanted anyone to hear. The encoded data is the part he wanted only a soldier to find.",
      },
    ],
    sol_ch1_humanity_honor: [
      {
        speaker: "elara",
        text: "I'll dedicate a full processing thread to signal reconstruction. If there's more in that recording, we'll find it. He deserves that much.",
      },
      {
        speaker: "the_human",
        text: "Iron Lion held the line at the Breach of Terminus for eleven hours with a broken weapon and four wounded behind him. Not because anyone ordered him to. Because they were behind him and he was a soldier and that's what soldiers do. He would have understood you.",
      },
    ],
    sol_ch1_aggressive_question: [
      {
        speaker: "the_human",
        text: "You're right to be suspicious. That recording has been in the relay network for seventeen thousand years and it surfaced now, on your frequency, tuned to your encryption. That's either the most improbable coincidence in the history of communications, or the system was designed to find the next soldier and deliver it.",
      },
      {
        speaker: "elara",
        text: "I'm running a trace on the delivery protocol. The relay routing suggests the recording was dormant until a specific signal profile activated it — a profile that matches Soldier-class Potential genetic markers. He built a lock that only a soldier could open.",
      },
    ],
    sol_ch1_compassionate_accept: [
      {
        speaker: "the_human",
        stageDirection: "Quiet for a moment. When he speaks, there's something uncommon in his voice — something almost like respect.",
        text: "That's the right answer. Not the strategic answer. Not the clever answer. The right one. He was alone when he recorded that. He thought he might be the last soldier left. And he still made the recording, because a soldier doesn't abandon the ones who come after.",
      },
      {
        speaker: "elara",
        text: "The recording has additional encoded layers. Now that you've acknowledged it, the second layer is decrypting. He set it up so the message would only continue if the listener responded with intent. Iron Lion wanted to know you were really listening before he told you the rest.",
      },
    ],
  },
  optionFlags: {
    sol_ch1_investigate_broadcast: ["soldier_broadcast_investigated"],
    sol_ch1_humanity_honor: ["soldier_broadcast_honored"],
    sol_ch1_aggressive_question: ["soldier_broadcast_questioned"],
    sol_ch1_compassionate_accept: ["soldier_broadcast_accepted"],
  },
};

/* ─── QUESTLINE EXPORT ─── */

export const SOLDIER_QUESTLINE: PotentialQuestline = {
  id: "class_soldier_what_war_builds_and_destroys",
  title: "WHAT WAR BUILDS AND WHAT IT DESTROYS",
  premise:
    "A damaged recording from Iron Lion — seventeen thousand years old — has surfaced through the Comms Array on your channel. Soldier to soldier. He knew there would be more after him, and he left something in the signal.",
  actGate: 1,
  chapters: [chapter1],
  flags: SOLDIER_FLAGS,
};
