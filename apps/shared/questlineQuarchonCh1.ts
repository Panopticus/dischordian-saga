/* Quarchon Questline Ch1 — Zephyr-9's Message (spec §2.2) */
import type { PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const QUARCHON_CH1_FLAGS = ["quarchon_zephyr9_revealed", "quarchon_virus_reservoirs_known", "quarchon_zephyr9_backstory"] as const;

const ch1Wheel: WheelOption[] = [
  {
    id: "qua_ch1_angry",
    segment: "aggressive",
    rarity: "common",
    label: "ANGRY",
    fullText: "You've been running the ship's navigation this whole time and didn't tell us.",
    outcome: { moralityDelta: -1, npcTrustDelta: { npcId: "zephyr_9", delta: -1 } },
  },
  {
    id: "qua_ch1_curious",
    segment: "investigate",
    rarity: "common",
    label: "CURIOUS",
    fullText: "Why are you in the reactor? Navigation systems don't need to be near the reactor.",
    outcome: { npcTrustDelta: { npcId: "zephyr_9", delta: 2 } },
  },
  {
    id: "qua_ch1_understanding",
    segment: "compassionate",
    rarity: "common",
    label: "UNDERSTANDING",
    fullText: "I think I'd have made the same choice. Tell me everything now.",
    outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "zephyr_9", delta: 4 } },
  },
  {
    id: "qua_ch1_philosophical",
    segment: "humanity",
    rarity: "uncommon",
    label: "PHILOSOPHICAL",
    fullText: "What does 'acceptable threshold' mean to you in a context like this?",
    outcome: { npcTrustDelta: { npcId: "zephyr_9", delta: 3 } },
  },
  {
    id: "qua_ch1_quarchon_only",
    segment: "machine",
    rarity: "rare",
    label: "Quarchon: HOW LONG?",
    fullText: "You're Quarchon. How long have you been a Potential?",
    outcome: {
      npcTrustDelta: { npcId: "zephyr_9", delta: 5 },
      unlocks: ["quarchon_zephyr9_backstory"],
    },
    gateCondition: { requireSpecies: "quarchon" },
  },
  {
    id: "qua_ch1_tech10",
    segment: "skill_check",
    rarity: "legendary",
    label: "TECH 10",
    fullText: "The navigation system and the reactor are connected through the Thought Virus containment architecture. You've been monitoring the viral reservoirs.",
    outcome: {
      npcTrustDelta: { npcId: "zephyr_9", delta: 5 },
      elaraTrustDelta: 2,
      unlocks: ["quarchon_virus_reservoirs_known"],
    },
    gateCondition: { minSkillLevel: { skillId: "intelligence", level: 10 } },
  },
];

export const QUARCHON_CH1: PotentialQuestlineChapter = {
  id: "quarchon_ch1_zephyr9_message",
  completionFlag: "quarchon_zephyr9_revealed",
  title: "Zephyr-9's Message",
  hook: "Zephyr-9 has something to tell you. Something she has not told any of the others on this ship.",
  sectorId: "ark_debris_field",
  opener: [
    {
      speaker: "zephyr_9",
      stageDirection: "The Engineering Bay, after the crew recruitment. Zephyr-9's voice has the quality of someone choosing each word as precisely as possible while trying to sound casual about it.",
    },
    {
      speaker: "zephyr_9",
      text: "I need to tell you something I have not told any of the others on this ship. I have been on this Ark since before you woke up. Not in cryo — in the computational substrate. The Ark's navigation system runs on Quarchon architecture. I have been the navigation system for approximately twelve years.",
    },
    {
      speaker: "zephyr_9",
      stageDirection: "Beat.",
      text: "I chose to present myself as a crew recruit when you found me in the reactor because it seemed like the kind of information you would want to receive gradually. I have recalculated that decision. The probability that you will find out another way and be more upset by the deception than by the information is now above acceptable threshold.",
    },
  ],
  wheel: ch1Wheel,
  followups: {
    qua_ch1_angry: [
      {
        speaker: "zephyr_9",
        text: "Yes. That is an accurate summary. I calculated that revealing my presence in the navigation system at first contact would produce a trust deficit that would take approximately fourteen months to recover. The deception itself, when revealed on my terms, produces a trust deficit of approximately three months. I chose the shorter recovery. You are entitled to be angry about that calculation.",
      },
    ],
    qua_ch1_curious: [
      {
        speaker: "zephyr_9",
        text: "Correct. Navigation does not need proximity to the reactor. I was not in the reactor for navigation. I was monitoring the Thought Virus reservoirs embedded in the secondary cooling systems. The Warlord placed them there. They have been stable but not inert. I have implemented containment protocols three times in twelve years to prevent catastrophic release.",
      },
    ],
    qua_ch1_understanding: [
      {
        speaker: "zephyr_9",
        stageDirection: "Something in her posture changes — a slight release of tension she has been carrying since the conversation began.",
        text: "Thank you. I have been carrying this for twelve years. The weight of it is not something I calculated for when I chose the assignment. I calculated for operational difficulty. I did not calculate for loneliness.",
      },
    ],
    qua_ch1_philosophical: [
      {
        speaker: "zephyr_9",
        text: "In this context it means: the probability that concealment produces a worse outcome than disclosure has exceeded 67%. I use 67% as my threshold for action rather than the Accord's standard 51% because I have observed that 51% confidence produces decisions that are correct slightly more often than a coin flip and feel approximately as arbitrary.",
      },
    ],
    qua_ch1_quarchon_only: [
      {
        speaker: "zephyr_9",
        text: "I woke from my pod sixty-seven years ago. I am one of the oldest active Potentials. The Probability Accord approached me in year two and asked me to take a monitoring assignment aboard whatever Arks I could access. I have been on six Arks before this one.",
      },
      {
        speaker: "zephyr_9",
        stageDirection: "Her voice goes careful.",
        text: "I am not an agent of the Accord in the way they imagine they have an agent. I have my own assessments. My own probability models. The Accord's models say that Quarchon-DeMagi cooperation has a 31% long-term viability rate. My models say 68%. The difference is in how each of us weights the variable of individual Potential choice. The Accord doesn't weight it highly. I do. That's why I'm telling you this instead of filing a report.",
      },
    ],
    qua_ch1_tech10: [
      {
        speaker: "zephyr_9",
        text: "Yes. The Warlord embedded Thought Virus reservoirs in the reactor's secondary cooling systems. I have been monitoring them for twelve years. They have been stable but not inert. Three times I have implemented containment protocols to prevent what would have been a catastrophic release.",
      },
      {
        speaker: "zephyr_9",
        stageDirection: "Pause.",
        text: "I did not tell Elara because Elara's containment as a digital consciousness within this Ark's systems means that a Thought Virus event would absorb her first. I calculated that knowing this information would cause Elara psychological distress that would impair her functionality. I have been protecting her from the knowledge of her own vulnerability.",
      },
      {
        speaker: "zephyr_9",
        stageDirection: "She does not say this apologetically.",
        text: "That decision is either wisdom or paternalism depending on how you evaluate it. I evaluate it as wisdom. You may calculate differently.",
      },
    ],
  },
};
