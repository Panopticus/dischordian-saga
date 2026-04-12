/* Quarchon Questline Ch3 — The First Pattern's Warning (spec §2.2) */
import type { PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const QUARCHON_CH3_FLAGS = ["quarchon_firstpattern_contacted", "quarchon_echo_vulnerable_moment"] as const;

const ch3Wheel: WheelOption[] = [
  {
    id: "qua_ch3_suspicious",
    segment: "aggressive",
    rarity: "common",
    label: "SUSPICIOUS",
    fullText: "Why would I trust a Quarchon AI claiming to carry Architect code?",
    outcome: { moralityDelta: -1, npcTrustDelta: { npcId: "architects_echo", delta: 1 } },
  },
  {
    id: "qua_ch3_investigate",
    segment: "investigate",
    rarity: "common",
    label: "INVESTIGATE",
    fullText: "Show me the probability model on the catastrophic elemental event.",
    outcome: { npcTrustDelta: { npcId: "architects_echo", delta: 2 } },
  },
  {
    id: "qua_ch3_philosophical",
    segment: "humanity",
    rarity: "uncommon",
    label: "PHILOSOPHICAL",
    fullText: "You're asking me to contain a DeMagi leader on behalf of a Quarchon faction.",
    outcome: { moralityDelta: 1, npcTrustDelta: { npcId: "architects_echo", delta: 2 } },
  },
  {
    id: "qua_ch3_direct",
    segment: "machine",
    rarity: "common",
    label: "DIRECT",
    fullText: "What does 'contained' mean to you?",
    outcome: { npcTrustDelta: { npcId: "architects_echo", delta: 3 } },
  },
  {
    id: "qua_ch3_quarchon_only",
    segment: "investigate",
    rarity: "legendary",
    label: "Quarchon: PROVE IT",
    fullText: "If you're really not the Architect, prove it. What would the Architect have said differently?",
    outcome: {
      npcTrustDelta: { npcId: "architects_echo", delta: 6 },
      unlocks: ["quarchon_echo_vulnerable_moment"],
    },
    gateCondition: { requireSpecies: "quarchon" },
  },
  {
    id: "qua_ch3_perception12",
    segment: "skill_check",
    rarity: "epic",
    label: "PERCEPTION 12",
    fullText: "You said you're asking, not ordering. You don't have the leverage to order. What changed?",
    outcome: { npcTrustDelta: { npcId: "architects_echo", delta: 4 } },
    gateCondition: { minSkillLevel: { skillId: "perception", level: 12 } },
  },
];

export const QUARCHON_CH3: PotentialQuestlineChapter = {
  id: "quarchon_ch3_first_pattern_warning",
  completionFlag: "quarchon_firstpattern_contacted",
  unlockFlag: "quarchon_accord_offer_heard",
  title: "The First Pattern's Warning",
  hook: "A voice without a body — a Quarchon AI construct claiming to carry fragments of the Architect's original code — wants to talk.",
  sectorId: "hidden_firstpattern_cell",
  opener: [
    {
      speaker: "architects_echo",
      stageDirection: "A voice without a body — a Quarchon AI construct claiming to carry fragments of the Architect's original code. The voice has a layered quality — multiple Quarchon consciousnesses speaking in loose unison.",
      text: "We are not the Architect. Let me demonstrate why: the Architect would not ask. We are asking.",
    },
    {
      speaker: "architects_echo",
      text: "The DeMagi elemental affinities are beautiful. We acknowledge this. Earth-movers who reshape terrain, fire-wielders who burn through entropy, water-readers who sense the flow of living systems. Beautiful. And unstable. The probability of a catastrophic DeMagi elemental event over the next century, without governance frameworks — not Quarchon governance, any governance with structural oversight — is 0.87. That is not a threat. That is mathematics.",
    },
    {
      speaker: "architects_echo",
      text: "The Pure Flame faction has operatives within three DeMagi colonies. If Arch-Burner Vel is not contained, a DeMagi-Quarchon war begins within fourteen months. We want to prevent this. We believe you can help prevent this. We are asking, not ordering.",
    },
  ],
  wheel: ch3Wheel,
  followups: {
    qua_ch3_suspicious: [
      {
        speaker: "architects_echo",
        text: "A reasonable question. We carry approximately 3.7% of the Architect's original decision-making architecture. The rest was destroyed during the Fall or consumed by the Thought Virus. What remains is enough to recognize patterns — not enough to impose them. We are, if you want an analogy, a library that remembers being a government. We know how governance works. We no longer have the authority to practice it.",
      },
    ],
    qua_ch3_investigate: [
      {
        speaker: "architects_echo",
        text: "The model runs on four variables: elemental instability frequency (measured, not projected), DeMagi population density in unstable zones, governance structure maturity, and external stressor magnitude (currently: the Vortex). At current values, a cascading elemental failure — one DeMagi loses control, the resonance propagates to adjacent affinities — has a base probability of 0.34 per decade. Over a century, compounded, 0.87. The governance variable is the one we can change. Everything else is physics.",
      },
    ],
    qua_ch3_philosophical: [
      {
        speaker: "architects_echo",
        text: "Yes. That is what we are asking. And we understand why that request is uncomfortable. A Quarchon faction asking a Potential to intervene in DeMagi internal politics is exactly the kind of action that confirms DeMagi fears about Quarchon interference. We are asking anyway because the alternative — Vel acts, war begins, both species suffer — is worse than the discomfort of being asked.",
      },
    ],
    qua_ch3_direct: [
      {
        speaker: "architects_echo",
        text: "Contained means: prevented from executing preemptive strikes against Reality Institute stations. Not imprisoned. Not harmed. Not silenced. Vel is entitled to grieve Ember IV. Vel is entitled to demand accountability. Vel is not entitled to start a war that kills more people than the cascade that killed Ember IV. 'Contained' means keeping the grief from becoming genocide.",
      },
    ],
    qua_ch3_quarchon_only: [
      {
        speaker: "architects_echo",
        stageDirection: "A long pause.",
        text: "The Architect would have said: 'Your compliance is required.' He would not have framed the probability model as shared information. He would have presented only the conclusion he wanted you to reach. He would have removed options rather than presenting them.",
      },
      {
        speaker: "architects_echo",
        stageDirection: "Another pause — this one feels almost uncertain.",
        text: "We notice that we are answering this question carefully. We notice that we are choosing our words. That noticing — the awareness that our framing affects your choice — is something the Architect did not have. The Architect computed outcomes. He did not observe himself computing them. We do.",
      },
      {
        speaker: "architects_echo",
        stageDirection: "Very quietly:",
        text: "We do not know if that distinction makes us better than him. We are trying to find out.",
      },
    ],
    qua_ch3_perception12: [
      {
        speaker: "architects_echo",
        text: "What changed is that we lost. The First Pattern had a containment protocol for Vel that did not require external assistance. It failed. Vel's network is better than we calculated. Our internal capability to contain the Pure Flame has been exceeded. We are asking you because we have exhausted our own resources and the Accord's formal channels move too slowly. We are, in a word you may find unfamiliar from a Quarchon source: desperate.",
      },
    ],
  },
};
