/* ═══════════════════════════════════════════════════════
   CLASS QUESTLINE — SOLDIER
   "WHAT WAR BUILDS AND WHAT IT DESTROYS"

   Spec §3.5 — 1 chapter.

   Ch1  Iron Lion's Broadcast Reaches You First  (Act 1)
   ═══════════════════════════════════════════════════════ */

import type {
  PotentialQuestline,
  PotentialQuestlineChapter,
} from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

/* ─── FLAGS ─── */

export const SOLDIER_QUESTLINE_FLAGS = [
  "soldier_iron_lion_broadcast_heard",
  "soldier_broadcast_investigated",
  "soldier_iron_lion_honored",
] as const;

/* ─── CH 1 — IRON LION'S BROADCAST REACHES YOU FIRST ─── */

const ch1Wheel: WheelOption[] = [
  {
    id: "sol_ch1_investigate_broadcast",
    segment: "investigate",
    rarity: "common",
    label: "Trace the full recording.",
    fullText:
      "That recording was damaged and fragmentary. There has to be more. Can we reconstruct the full broadcast?",
    outcome: {
      elaraTrustDelta: 2,
      unlocks: ["codex_iron_lion_broadcast_full"],
    },
  },
  {
    id: "sol_ch1_humanity_honor",
    segment: "humanity",
    rarity: "common",
    label: "He deserves to be remembered.",
    fullText:
      "Seventeen thousand years old and still reaching out. Soldier to soldier. He deserves to be remembered for more than a damaged recording.",
    outcome: {
      moralityDelta: 4,
      elaraTrustDelta: 3,
    },
  },
  {
    id: "sol_ch1_aggressive_question",
    segment: "aggressive",
    rarity: "common",
    label: "Why my channel specifically?",
    fullText:
      "A seventeen-thousand-year-old broadcast doesn't arrive on a specific channel by accident. Someone routed this to me. Who?",
    outcome: {
      moralityDelta: -1,
      humanTrustDelta: 2,
    },
  },
  {
    id: "sol_ch1_compassionate_accept",
    segment: "compassionate",
    rarity: "common",
    label: "I hear you, soldier.",
    fullText:
      "Soldier to soldier — if that still means something. It does. I hear you, Iron Lion. Whatever you needed the next soldier to know, I'm listening.",
    outcome: {
      moralityDelta: 5,
      elaraTrustDelta: 3,
      humanTrustDelta: 1,
    },
  },
];

const chapter1: PotentialQuestlineChapter = {
  id: "soldier_ch1_iron_lion_broadcast",
  completionFlag: "soldier_iron_lion_broadcast_heard",
  title: "Iron Lion's Broadcast Reaches You First",
  hook: "A damaged recording has come through the Comms Array — Iron Lion's voice, seventeen thousand years old, addressed to the next soldier.",
  sectorId: "ark_comms_array",
  actGate: 1,
  opener: [
    {
      speaker: "iron_lion_recorded",
      stageDirection: "The Comms Array crackles with a damaged recording — signal degradation layered over a voice that carries the unmistakable weight of command. The recording is fragmentary, patched together from seventeen millennia of signal decay.",
    },
    {
      speaker: "iron_lion_recorded",
      text: "...to whoever finds this. Soldier to soldier, if that still means something.",
      stageDirection: "The fragment ends in static. The silence that follows is heavier than the words.",
    },
    {
      speaker: "elara",
      text: "That's Iron Lion. Seventeen thousand years old. Came through on your channel.",
      stageDirection: "Elara's voice is quieter than usual — the kind of quiet that means she recognizes the significance.",
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
        text: "I can attempt a full reconstruction, but the signal degradation is severe. What I can tell you now is that the broadcast was encoded with a Soldier-class priority header — a classification system that predates the current Ark operating protocols by thousands of years. Iron Lion tagged this as urgent military communication. Whatever he was trying to say, he wanted to make sure a Soldier heard it first.",
      },
      {
        speaker: "the_human",
        text: "The priority header is the important part. Iron Lion didn't broadcast to the Ark. He broadcast to the next Soldier specifically. The Comms Array held it in queue until someone with Soldier-class credentials accessed the system. That's you.",
      },
    ],
    sol_ch1_humanity_honor: [
      {
        speaker: "elara",
        text: "The Ark's memorial systems have a protocol for this — honoring Insurgents whose contributions were classified or lost. Iron Lion's record is fragmented, but what exists describes someone who held the line when every strategic model said retreat was the only viable option. He held it anyway.",
      },
      {
        speaker: "the_human",
        text: "He broke the line so the others could cross. That's not a metaphor. He literally positioned himself at the breach point and held it for seven hours while the rest of the Insurgency evacuated through the tunnels behind him. Seven hours. Alone. The memorial on the artillery tower is his.",
      },
    ],
    sol_ch1_aggressive_question: [
      {
        speaker: "the_human",
        text: "Smart question. The broadcast was tagged with a Soldier-class priority header. The Comms Array held it in queue — possibly for millennia — until a Soldier accessed the system. Iron Lion set it up that way deliberately. He didn't trust the broadcast to anyone who wasn't military.",
      },
      {
        speaker: "elara",
        text: "I can confirm the routing. The priority header is genuine, and the queue timestamp predates every other stored communication in the Comms Array by at least four thousand years. This was the first message the system was ever asked to hold. Iron Lion got here first. In every sense.",
      },
    ],
    sol_ch1_compassionate_accept: [
      {
        speaker: "elara",
        stageDirection: "A long, respectful pause. The Comms Array hums with the residual energy of the decoded broadcast.",
      },
      {
        speaker: "elara",
        text: "The recording is responding to your acknowledgment. There's a secondary data packet embedded in the signal — it was gated behind a Soldier-class voice confirmation. Iron Lion built a call-and-response into the broadcast. He wanted to hear you say it back before he gave you the rest.",
      },
      {
        speaker: "the_human",
        text: "Soldier to soldier. He's been waiting seventeen thousand years for someone to answer. You just did.",
        stageDirection: "The Human's voice carries something rare — genuine respect.",
      },
    ],
  },
  optionFlags: {
    sol_ch1_investigate_broadcast: ["soldier_broadcast_investigated"],
    sol_ch1_humanity_honor: ["soldier_iron_lion_honored"],
  },
};

/* ─── QUESTLINE EXPORT ─── */

export const SOLDIER_QUESTLINE: PotentialQuestline = {
  id: "class_soldier_what_war_builds_and_destroys",
  title: "WHAT WAR BUILDS AND WHAT IT DESTROYS",
  premise:
    "A damaged recording from Iron Lion — seventeen thousand years old — has come through the Comms Array on your channel. Soldier to soldier, if that still means something. He knew there would be more soldiers after him. He was talking to you.",
  actGate: 1,
  chapters: [chapter1],
  flags: SOLDIER_QUESTLINE_FLAGS,
};
