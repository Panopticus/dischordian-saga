/* New Babylon Questline — Locke's Trading System + 7-Omega Vault (spec §3)
   VO metadata added — every beat is studio-pipeline ready. */
import type { PotentialQuestline, PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const NEW_BABYLON_QUESTLINE_FLAGS = [
  "nb_locke_first_trade", "nb_archive_gap_known",
  "nb_7omega_vault_quest", "nb_syndicate_contract_known",
] as const;

const ch1Wheel: WheelOption[] = [
  { id: "nb_ch1_information", segment: "investigate", rarity: "common", label: "INFORMATION", fullText: "Information about the first wave. What happened in New Babylon.", outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 2 } } },
  { id: "nb_ch1_relationship", segment: "humanity", rarity: "common", label: "RELATIONSHIP", fullText: "I want to understand New Babylon. Not just trade with it.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "adjudicator_locke", delta: 3 } } },
  { id: "nb_ch1_intelligent", segment: "investigate", rarity: "uncommon", label: "YOU SPECIFICALLY", fullText: "I want to understand you specifically. You're more interesting than the city.", outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 4 } } },
  { id: "nb_ch1_direct", segment: "machine", rarity: "common", label: "ARCHIVE GAP", fullText: "I want access to the Archive gap. Something was taken. I want to know what.", outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 2 }, unlocks: ["nb_archive_gap_known"] } },
  { id: "nb_ch1_spy", segment: "investigate", rarity: "legendary", label: "SPY: SYNDICATE CONTRACT", fullText: "I already know about your Syndicate contract. The eye patch is their mark. I'm not here to threaten you — I'm here to offer you a way out of it.", outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 8 }, unlocks: ["nb_syndicate_contract_known"] }, gateCondition: { requireClass: "spy" } },
  { id: "nb_ch1_oracle", segment: "skill_check", rarity: "epic", label: "ORACLE: STAY OR CLOSE", fullText: "I've modeled this conversation six times and in four branches you close the channel without trading. What makes this one of the two where you stay?", outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 5 } }, gateCondition: { requireClass: "oracle" } },
  { id: "nb_ch1_charisma12", segment: "skill_check", rarity: "epic", label: "CHARISMA 12", fullText: "You said 'tell me what it costs.' But what you actually want to know is whether I'm going to try to get it for free. I'm not.", outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 5 } }, gateCondition: { minSkillLevel: { skillId: "charisma", level: 12 } } },
];

const ch1: PotentialQuestlineChapter = {
  id: "nb_ch1_lockes_system",
  completionFlag: "nb_locke_first_trade",
  title: "Locke's Trading System",
  hook: "Adjudicator Locke names the price before giving the information. She does not haggle. She does not barter.",
  sectorId: "new_babylon_core",
  opener: [
    {
      audioDialogId: "fac_newbabylon_ch1_locke_opener_1",
      speaker: "adjudicator_locke",
      emotion: "neutral",
      estimatedDurationSec: 17.2,
      text: "Potential of Ark 1047. You're later than the first wave but earlier than I expected. You want something. Everything that comes to New Babylon wants something. Tell me what you want and I'll tell you what it costs.",
    },
  ],
  wheel: ch1Wheel,
  followups: {
    nb_ch1_information: [
      {
        audioDialogId: "fac_newbabylon_ch1_locke_information_1",
        speaker: "adjudicator_locke",
        emotion: "testing",
        estimatedDurationSec: 21.6,
        text: "Information about the first wave. That costs one of two things: intelligence about the Voltari transmissions — content, not just frequency — or access to whatever your Ark's substrate is hiding. I know there's something in there. The Human knows what it is. He's been protecting it. I want to know what he's protecting. Choose your price.",
      },
    ],
    nb_ch1_relationship: [
      {
        audioDialogId: "fac_newbabylon_ch1_locke_relationship_1",
        speaker: "adjudicator_locke",
        emotion: "melancholy",
        estimatedDurationSec: 16.0,
        text: "Understanding New Babylon means understanding that this city survived by quarantine. The Authority sealed the lower tiers and let them die so the upper tiers could continue. Every relationship New Babylon has is shaped by that calculus. Including this one.",
      },
    ],
    nb_ch1_intelligent: [
      {
        audioDialogId: "fac_newbabylon_ch1_locke_intelligent_1",
        speaker: "adjudicator_locke",
        emotion: "curious",
        stageDirection: "A pause. She hadn't expected this.",
        estimatedDurationSec: 10.4,
        text: "Me specifically. That's either flattery or intelligence. I'll assume intelligence until you prove otherwise. What do you want to know?",
      },
    ],
    nb_ch1_direct: [
      {
        audioDialogId: "fac_newbabylon_ch1_locke_direct_1",
        speaker: "adjudicator_locke",
        emotion: "cautious",
        estimatedDurationSec: 19.2,
        text: "The Archive gap. You noticed it. Most don't. Something was removed from our records during the first wave's visit. The cataloguing gap is visible if you know where to look. The cost for that information: tell me what the Voltari said. The full transmission. Not the redacted version. I know there's a redacted version.",
      },
    ],
    nb_ch1_spy: [
      {
        audioDialogId: "fac_newbabylon_ch1_locke_spy_1",
        speaker: "adjudicator_locke",
        emotion: "recognizing",
        stageDirection: "She does not move. She is very good at not moving when something surprises her.",
        estimatedDurationSec: 12.4,
        text: "A Spy class. The Collector's 7-Omicron lineage. I had a note in my files about that lineage — the moral reasoning subroutine. You saw the mark.",
      },
      {
        audioDialogId: "fac_newbabylon_ch1_locke_spy_2",
        speaker: "adjudicator_locke",
        emotion: "confessional",
        estimatedDurationSec: 17.6,
        text: "The contract is eighteen thousand years old. My predecessor signed it. I inherited it. Offering to get me out of it would require you to either pay the Syndicate what's owed — which I will tell you is not a number you can currently afford — or give them something of equivalent value.",
      },
      {
        audioDialogId: "fac_newbabylon_ch1_locke_spy_3",
        speaker: "adjudicator_locke",
        emotion: "testing",
        estimatedDurationSec: 3.2,
        text: "What do you consider equivalent value?",
      },
    ],
    nb_ch1_oracle: [
      {
        audioDialogId: "fac_newbabylon_ch1_locke_oracle_1",
        speaker: "adjudicator_locke",
        emotion: "wry",
        estimatedDurationSec: 15.2,
        text: "What makes this one of the two: you asked which branch survives instead of which branch profits. That tells me you're modeling outcomes, not maximizing returns. I prefer modelers. Maximizers are exhausting.",
      },
    ],
    nb_ch1_charisma12: [
      {
        audioDialogId: "fac_newbabylon_ch1_locke_charisma12_1",
        speaker: "adjudicator_locke",
        emotion: "amused",
        stageDirection: "Almost a smile.",
        estimatedDurationSec: 16.4,
        text: "Good. Yes, that was the test. Most beings who arrive here either try to charm the price down or threaten the price away. You named the dynamic, acknowledged the price exists, and signaled willingness to pay. We can work together.",
      },
    ],
  },
};

const ch2: PotentialQuestlineChapter = {
  id: "nb_ch2_7omega_vault",
  completionFlag: "nb_7omega_vault_quest",
  unlockFlag: "nb_locke_first_trade",
  title: "The 7-Omega Vault",
  hook: "Sealed under Imperial Security Directive 7-Omega: the full account of what happened in New Babylon when the first wave arrived.",
  sectorId: "new_babylon_core",
  opener: [
    {
      audioDialogId: "fac_newbabylon_ch2_locke_opener_1",
      speaker: "adjudicator_locke",
      emotion: "cautious",
      estimatedDurationSec: 19.2,
      text: "Three things New Babylon knows and won't say. One: the exact events of the three-way battle — first wave, Authority, Syndicate. Two: what the first wave took from our Archives. Three: whether the Syndicate was invited to the battle or stumbled into it.",
    },
    {
      audioDialogId: "fac_newbabylon_ch2_locke_opener_2",
      speaker: "adjudicator_locke",
      emotion: "melancholy",
      estimatedDurationSec: 14.4,
      text: "All three are sealed under 7-Omega. The Authority will not discuss it. I claim ignorance officially. The vault has been sealed for three years. I've been trying to open it for three thousand.",
    },
    {
      audioDialogId: "fac_newbabylon_ch2_locke_opener_3",
      speaker: "adjudicator_locke",
      emotion: "confessional",
      stageDirection: "A pause. Then, quieter:",
      estimatedDurationSec: 10.4,
      text: "If you find a way in, I want to be there when it opens. Not because I'll stop you. Because I want to know too.",
    },
  ],
  wheel: [
    { id: "nb_ch2_accept", segment: "investigate", rarity: "rare", label: "OPEN IT TOGETHER", fullText: "We open it together. Whatever's in there, we both see it at the same time.", outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 5 } } },
    { id: "nb_ch2_leverage", segment: "machine", rarity: "uncommon", label: "LEVERAGE", fullText: "I'll open it. But I decide what gets shared and with whom.", outcome: { moralityDelta: -2, npcTrustDelta: { npcId: "adjudicator_locke", delta: 1 } } },
    { id: "nb_ch2_syndicate", segment: "aggressive", rarity: "epic", label: "ASK THE SYNDICATE", fullText: "The Syndicate sealed the records for the Authority. They kept copies. I'll get it from them.", outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 3 } } },
  ],
  followups: {
    nb_ch2_accept: [
      {
        audioDialogId: "fac_newbabylon_ch2_locke_accept_1",
        speaker: "adjudicator_locke",
        emotion: "tender",
        estimatedDurationSec: 11.2,
        text: "Together. That word costs me nothing and means everything. I have been alone with this for three thousand years. Together is acceptable.",
      },
    ],
    nb_ch2_leverage: [
      {
        audioDialogId: "fac_newbabylon_ch2_locke_leverage_1",
        speaker: "adjudicator_locke",
        emotion: "cautious",
        estimatedDurationSec: 13.6,
        text: "Control. I understand control. I've been the one controlling New Babylon's information flow for eleven thousand years. Just know that when you decide who sees what, you become me. Think about whether you want that.",
      },
    ],
    nb_ch2_syndicate: [
      {
        audioDialogId: "fac_newbabylon_ch2_locke_syndicate_1",
        speaker: "adjudicator_locke",
        emotion: "wry",
        estimatedDurationSec: 12.4,
        text: "The Syndicate has copies. The Word and the Silence will trade them. Their price will be higher than mine. But their copies are probably more complete — the Syndicate doesn't redact.",
      },
    ],
  },
};

export const NEW_BABYLON_QUESTLINE: PotentialQuestline = {
  id: "new_babylon_the_city_that_classifies",
  title: "The City That Classifies Everything It Can't Control",
  premise: "New Babylon survived by quarantine. It sealed the lower tiers and let them die. Every relationship it has is shaped by that calculus.",
  actGate: 2,
  chapters: [ch1, ch2],
  flags: NEW_BABYLON_QUESTLINE_FLAGS,
};
