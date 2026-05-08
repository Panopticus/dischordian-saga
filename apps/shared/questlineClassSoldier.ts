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
      text: "The packet arrived warm. That should not be possible. The signal is seventeen thousand years old and the carrier wave still has heat in it. It is Iron Lion. Came through on your channel.",
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
        text: "Reconstruction will hurt to listen to. The decay layer is dense — every recovered word is going to be a word the recording lost the right to keep. I can do it. The protocol it carries is older than the Ark's current handshake by thousands of years; he tagged it Soldier-class so a Soldier would be the one to hear it first. He chose the listener before the listener was born.",
      },
      {
        speaker: "the_human",
        text: "The priority header is the important part. Iron Lion didn't broadcast to the Ark. He broadcast to the next Soldier specifically. The Comms Array held it in queue until someone with Soldier-class credentials accessed the system. That's you.",
      },
    ],
    sol_ch1_humanity_honor: [
      {
        speaker: "elara",
        text: "The breach was wider than the body that held it. That is the line in the fragment I keep returning to. The strategic models on file all say retreat was the correct call — they say it confidently, in clean machine prose, the way they always say it. Iron Lion read those models. He held the line anyway. The Ark has a memorial protocol for the ones who do that. We are inside it now.",
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
        text: "The queue had to learn how to hold this. Every other communication in the Array's history is younger than the wait this one performed; the substrate has a hum it only makes for the oldest stored signal, and that hum has been Iron Lion's hum since before the Ark recognized hum as a category. The header is genuine. He got here first. In every sense.",
      },
    ],
    sol_ch1_compassionate_accept: [
      {
        speaker: "elara",
        stageDirection: "A long, respectful pause. The Comms Array hums with the residual energy of the decoded broadcast.",
      },
      {
        speaker: "elara",
        text: "Something just opened that I did not know was closed. The signal carrier is shifting — there is a second packet inside it, gated behind your voice. He built a call-and-response into the broadcast. He wanted to hear you say it back before he handed over the rest. The substrate just heard you. It is unfolding.",
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
