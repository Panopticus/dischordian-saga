/* ═══════════════════════════════════════════════════════
   CLASS QUESTLINE — ASSASSIN
   "THE KNIFE AND THE CONSCIENCE"

   Spec §3.4 — 1 chapter.

   Ch1  The Eyes' Network Contacts You  (Act 3)
   ═══════════════════════════════════════════════════════ */

import type {
  PotentialQuestline,
  PotentialQuestlineChapter,
} from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

/* ─── FLAGS ─── */

export const ASSASSIN_QUESTLINE_FLAGS = [
  "assassin_eyes_network_contacted",
  "assassin_moral_reasoning_explained",
  "assassin_tracking_signatures_detected",
] as const;

/* ─── CH 1 — THE EYES' NETWORK CONTACTS YOU ─── */

const ch1Wheel: WheelOption[] = [
  {
    id: "asn_ch1_investigate_series",
    segment: "investigate",
    rarity: "common",
    label: "Series 7-Omicron?",
    fullText:
      "You called me Series 7-Omicron. What does that designation mean? How many series were there before me?",
    outcome: {
      elaraTrustDelta: 2,
      unlocks: ["codex_assassin_series_designations"],
    },
  },
  {
    id: "asn_ch1_humanity_center",
    segment: "humanity",
    rarity: "common",
    label: "What happened to your center?",
    fullText:
      "You said you need a new center. That means you had one before. What happened to them?",
    outcome: {
      moralityDelta: 3,
      elaraTrustDelta: 2,
    },
  },
  {
    id: "asn_ch1_machine_terms",
    segment: "machine",
    rarity: "common",
    label: "What are your terms?",
    fullText:
      "You've identified me and you need something from me. Skip the history. What are your terms?",
    outcome: {
      moralityDelta: -3,
      humanTrustDelta: 3,
    },
  },
  {
    id: "asn_ch1_aggressive_decline",
    segment: "aggressive",
    rarity: "common",
    label: "I don't work for networks.",
    fullText:
      "I don't care what series I am. I don't work for networks, I don't answer to archived intelligence services, and I don't take assignments from dead-drop transmissions.",
    outcome: {
      moralityDelta: -1,
      elaraTrustDelta: -1,
      humanTrustDelta: 1,
    },
  },
  {
    id: "asn_ch1_assassin_moral_reasoning",
    segment: "investigate",
    rarity: "epic",
    label: "What does 'independent moral reasoning' mean?",
    fullText:
      "You said 'most likely to develop independent moral reasoning.' What does that actually mean in practice?",
    outcome: {
      elaraTrustDelta: 4,
      humanTrustDelta: 2,
      unlocks: [
        "codex_assassin_conscience_protocol",
        "codex_eyes_series_7_selection_criteria",
      ],
    },
    gateCondition: {
      requireClass: "assassin",
    },
  },
  {
    id: "asn_ch1_skill_stealth",
    segment: "skill_check",
    rarity: "uncommon",
    label: "[Stealth 10] Trace the tracking signatures.",
    fullText:
      "I counted three tracking signatures on this transmission.",
    outcome: {
      elaraTrustDelta: 3,
      unlocks: [
        "codex_transmission_tracking_analysis",
        "counter_surveillance_protocols",
      ],
      requires: ["skill:stealth>=10"],
    },
    gateCondition: {
      minSkillLevel: { skillId: "stealth", level: 10 },
    },
  },
];

const chapter1: PotentialQuestlineChapter = {
  id: "assassin_ch1_eyes_network_contact",
  completionFlag: "assassin_eyes_network_contacted",
  title: "The Eyes' Network Contacts You",
  hook: "An unidentified transmission, reconstructed from the Eyes' archived data, has found you. They know your designation: Series 7-Omicron.",
  sectorId: "ark_comms_array",
  actGate: 3,
  opener: [
    {
      speaker: "unknown_transmission",
      stageDirection: "Static resolves into a composite voice — multiple speakers layered into a single transmission, reconstructed from the Eyes' archived intelligence network. The signal is old, patched together from fragments, but unmistakably deliberate.",
    },
    {
      speaker: "unknown_transmission",
      text: "Designation confirmed: Series 7-Omicron. You are the last viable node in the Eyes' operational network. We have been monitoring Potential emergence patterns since the network went dark. You match the profile the Eyes flagged as most likely to develop independent moral reasoning.",
    },
    {
      speaker: "unknown_transmission",
      text: "The network has no center. The Eyes are gone. Their operational infrastructure is degrading. We are not asking you to be what they were. We are asking you to be what comes next. We need a new center.",
    },
    {
      speaker: "elara",
      text: "I'm tracing the signal now. It's been routed through seventeen relay points, each one a former Eyes safe house. Whoever sent this knew exactly how to reach us — and exactly how to avoid being traced.",
    },
    {
      speaker: "the_human",
      text: "The Eyes didn't leave behind an intelligence network. They left behind a conscience. Every agent in that network was selected for the same trait — the ability to refuse an order. Series 7 was the last batch. Omicron was the designation they gave to the one they thought would matter most.",
    },
  ],
  wheel: ch1Wheel,
  followups: {
    asn_ch1_investigate_series: [
      {
        speaker: "the_human",
        text: "Seven series. Each one selected for increasingly specific traits. Series 1 was raw capability — the best infiltrators, the sharpest killers. By Series 7, the selection criteria had shifted entirely. They weren't looking for the most lethal operative. They were looking for the one most likely to decide, independently, when not to kill.",
      },
      {
        speaker: "elara",
        text: "The designation 'Omicron' within Series 7 carried additional significance. It was the Eyes' internal code for 'the one we're watching.' Not as a target — as a hope.",
      },
    ],
    asn_ch1_humanity_center: [
      {
        speaker: "unknown_transmission",
        text: "The center was the Eyes themselves. A single operative who held every thread — every agent's identity, every safe house location, every contingency plan. When the Eyes fell, the threads went slack. We have been operating on stored protocols ever since. Stored protocols do not adapt. They do not make moral judgments. They execute.",
      },
      {
        speaker: "elara",
        text: "That's the problem they're describing. An intelligence network without a conscience is just a weapon that fires automatically. They need someone who can decide which targets matter — and which ones don't.",
      },
    ],
    asn_ch1_machine_terms: [
      {
        speaker: "unknown_transmission",
        text: "Terms: full access to the Eyes' remaining operational infrastructure — safe houses, dead drops, surveillance grids, counter-intelligence protocols. In exchange, you assume center position. You decide what the network does. No oversight. No review. The network answers to your judgment and your judgment alone.",
      },
    ],
    asn_ch1_aggressive_decline: [
      {
        speaker: "unknown_transmission",
        stageDirection: "A long pause. The composite voice recalibrates.",
      },
      {
        speaker: "unknown_transmission",
        text: "Noted. The channel will remain open. Series 7-Omicron was selected because they refuse orders. Including ours. This response is... consistent with the profile.",
      },
    ],
    asn_ch1_assassin_moral_reasoning: [
      {
        speaker: "unknown_transmission",
        stageDirection: "There is a processing delay — not technical, but deliberate. The network is choosing its words carefully.",
      },
      {
        speaker: "unknown_transmission",
        text: "In practice, it means you hesitate. Not from fear. Not from uncertainty. From processing. You evaluate the moral weight of an action before you commit to it. The delay between 'I can do this' and 'I should do this' — that delay is your conscience. The Eyes measured it. Series 7-Omicron had the longest processing delay in the history of the program.",
      },
      {
        speaker: "the_human",
        text: "They're telling you that your conscience is literally measurable. The Eyes built an entire selection methodology around a pause — the fraction of a second between capability and choice. You have the longest pause they ever recorded. That's not a weakness. That's why you're here.",
      },
      {
        speaker: "elara",
        text: "The processing delay correlates with Oracle probability assessment, but it's not the same mechanism. Oracles see branches. Assassins feel weight. The difference is that an Oracle knows what will happen. An Assassin knows what should happen. The Eyes were selecting for moral intuition, not prediction.",
      },
    ],
    asn_ch1_skill_stealth: [
      {
        speaker: "elara",
        text: "You're right. Three distinct tracking signatures embedded in the transmission carrier wave. One is the network's own verification protocol — that's expected. The second is a passive Panopticon monitoring sweep — old, automated, not actively targeted. The third...",
        stageDirection: "Elara's analysis display highlights the third signature in red.",
      },
      {
        speaker: "elara",
        text: "The third is active. Someone else is listening to this channel. Someone who knew the Eyes' relay routing well enough to plant a tracker on it. That level of knowledge implies either a former Eyes operative or someone who captured one.",
      },
      {
        speaker: "the_human",
        text: "Good eye. The previous Assassin would have caught two of the three. You caught all of them. The network chose well.",
      },
    ],
  },
  optionFlags: {
    asn_ch1_assassin_moral_reasoning: ["assassin_moral_reasoning_explained"],
    asn_ch1_skill_stealth: ["assassin_tracking_signatures_detected"],
  },
};

/* ─── QUESTLINE EXPORT ─── */

export const ASSASSIN_QUESTLINE: PotentialQuestline = {
  id: "class_assassin_the_knife_and_the_conscience",
  title: "THE KNIFE AND THE CONSCIENCE",
  premise:
    "An unidentified transmission from the Eyes' archived intelligence network has found you. They know your designation — Series 7-Omicron — and they need a new center. The network has been running on stored protocols since the Eyes fell, but stored protocols don't make moral judgments.",
  actGate: 3,
  chapters: [chapter1],
  flags: ASSASSIN_QUESTLINE_FLAGS,
};
