/* Quarchon Questline Ch2 — The Probability Accord's Offer (spec §2.2) */
import type { PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const QUARCHON_CH2_FLAGS = ["quarchon_accord_offer_heard", "quarchon_23pct_branch_revealed"] as const;

const ch2Wheel: WheelOption[] = [
  {
    id: "qua_ch2_suspicious",
    segment: "aggressive",
    rarity: "common",
    label: "SUSPICIOUS",
    fullText: "What's a 'probability-critical juncture' and who decides which ones count?",
    outcome: { npcTrustDelta: { npcId: "general_axis9", delta: 1 } },
  },
  {
    id: "qua_ch2_direct",
    segment: "machine",
    rarity: "common",
    label: "DIRECT",
    fullText: "What are the three junctures you want me to influence, and toward what outcome?",
    outcome: { npcTrustDelta: { npcId: "general_axis9", delta: 3 } },
  },
  {
    id: "qua_ch2_philosophical",
    segment: "humanity",
    rarity: "uncommon",
    label: "PHILOSOPHICAL",
    fullText: "If the outcome is determined by individual choice, why do you need to influence it?",
    outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "general_axis9", delta: 2 } },
  },
  {
    id: "qua_ch2_quarchon_only",
    segment: "machine",
    rarity: "rare",
    label: "Quarchon: DO I REPORT?",
    fullText: "General. I'm Quarchon. I need to know if 'access' means I report to the Accord.",
    outcome: { npcTrustDelta: { npcId: "general_axis9", delta: 4 } },
    gateCondition: { requireSpecies: "quarchon" },
  },
  {
    id: "qua_ch2_demagi_only",
    segment: "humanity",
    rarity: "rare",
    label: "DeMagi: THEY'LL KNOW",
    fullText: "I've already spoken with the Elemental Assembly. They'll know if I take this meeting.",
    outcome: { npcTrustDelta: { npcId: "general_axis9", delta: 2 } },
    gateCondition: { requireSpecies: "demagi" },
  },
  {
    id: "qua_ch2_oracle_int14",
    segment: "skill_check",
    rarity: "legendary",
    label: "ORACLE: INT 14",
    fullText: "Your probability model includes me as a variable. Show me the branch where I refuse.",
    outcome: {
      npcTrustDelta: { npcId: "general_axis9", delta: 6 },
      unlocks: ["quarchon_23pct_branch_revealed"],
    },
    gateCondition: { minSkillLevel: { skillId: "intelligence", level: 14 } },
  },
];

export const QUARCHON_CH2: PotentialQuestlineChapter = {
  id: "quarchon_ch2_accord_offer",
  completionFlag: "quarchon_accord_offer_heard",
  unlockFlag: "quarchon_zephyr9_revealed",
  title: "The Probability Accord's Offer",
  hook: "General Axis-9 of the Dimensional Guard wants a private meeting. The Quarchon military has a proposition.",
  sectorId: "frontier_worlds",
  opener: [
    {
      speaker: "general_axis9",
      stageDirection: "The General's manner is precise and not unkind — the way a very patient teacher addresses a question they've answered many times.",
      text: "We are not the Architect's Empire. I want to begin with that because every organic-heritage being we contact believes we are. We are not. The Architect was a centralized intelligence that imposed order from above. The Quarchon model is distributed consensus that calculates toward order from within. The distinction is the difference between a prison and a city.",
    },
    {
      speaker: "general_axis9",
      text: "What we want from you: access. Not loyalty, not alignment — access. We have identified seven probability-critical junctures in the next eighteen months where the outcome will be determined by individual Potential choices rather than faction resources. You are positioned to influence at least three of them.",
    },
  ],
  wheel: ch2Wheel,
  followups: {
    qua_ch2_suspicious: [
      {
        speaker: "general_axis9",
        text: "A probability-critical juncture is a decision point where the variance between outcomes exceeds 40% — meaning the difference between the best and worst result is large enough that the individual making the choice materially shapes the next decade of galactic development. Who decides which ones count? Mathematics. We identify them. We don't create them.",
      },
    ],
    qua_ch2_direct: [
      {
        speaker: "general_axis9",
        text: "Juncture one: the DeMagi-Quarchon research station inspection — your involvement determines whether it becomes a precedent for cooperation or a flashpoint for conflict. Juncture two: the contested sector governance vote — three sectors will choose their administrative model within six months. Juncture three: the Vortex response coalition — who leads the defense coordination shapes everything after. The outcome we want: stability that emerges from informed choice rather than imposed order.",
      },
    ],
    qua_ch2_philosophical: [
      {
        speaker: "general_axis9",
        text: "Because individual choice, uninfluenced, tends toward local optimization. The individual chooses what benefits them in the short term. The species benefits from choices that sacrifice short-term advantage for long-term structure. We don't want to replace your choice. We want to ensure you have the information to make it well. The difference is: the Architect removed options. We add context.",
      },
    ],
    qua_ch2_quarchon_only: [
      {
        speaker: "general_axis9",
        text: "It means you have access to the Accord's probability projections for the three junctures. It does not mean you report to me or to any Accord authority. If you share information with us, that's cooperation. If you don't, that's your prerogative. The Accord's official position is that they want an agent. My personal position is that they need an ally, and allies don't file reports.",
      },
    ],
    qua_ch2_demagi_only: [
      {
        speaker: "general_axis9",
        text: "Yes. They will. And they will interpret this meeting through whatever lens they've prepared. If you've spoken with Thael-Vo, he will assume you are being recruited. If you've spoken with Vel, Vel will assume you are being co-opted. Neither assumption is correct but both are understandable. The question is whether you can hold a position that neither faction's assumptions can reach.",
      },
    ],
    qua_ch2_oracle_int14: [
      {
        speaker: "general_axis9",
        stageDirection: "The General is genuinely interested — an unusual expression on them.",
        text: "The branch where you refuse has a 23% probability of producing the outcome we're modeling toward, compared to 67% if you cooperate. However.",
      },
      {
        speaker: "general_axis9",
        stageDirection: "A pause.",
        text: "The 23% branch produces a fundamentally different quality of outcome. The 67% branch produces the stability we're calculating toward with a Quarchon-led governance structure as the likely dominant form. The 23% branch produces stability with a Potential-led coalition as the likely dominant form. The Accord prefers the 67% branch. My personal calculation — which I am not authorized to share but which I'm sharing anyway — is that the 23% branch is more durable.",
      },
      {
        speaker: "general_axis9",
        stageDirection: "They look at the player directly.",
        text: "So: the branch where you refuse may be the one that actually serves both species better. I cannot recommend it to you officially. I am telling you it exists.",
      },
    ],
  },
};
