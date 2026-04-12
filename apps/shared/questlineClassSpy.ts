/* ═══════════════════════════════════════════════════════
   CLASS QUESTLINE — SPY
   "EVERY TRUTH HAS A PRICE"

   Spec §3.6 — 2 chapters.

   Ch1  Locke Reads You           (Act 2)
   Ch2  What Locke Knows          (Act 2, requires spy_preempt_origin)
   ═══════════════════════════════════════════════════════ */

import type {
  PotentialQuestline,
  PotentialQuestlineChapter,
} from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

/* ─── FLAGS ─── */

export const SPY_QUESTLINE_FLAGS = [
  "spy_locke_preempt_complete",
  "spy_locke_senne_revealed",
  "spy_eyes_drop_points_recovered",
] as const;

/* ─── CH 1 — LOCKE READS YOU ─── */

const ch1Wheel: WheelOption[] = [
  {
    id: "spy_ch1_deny",
    segment: "machine",
    rarity: "common",
    label: "DENY",
    fullText: "I don't know what you're talking about.",
    outcome: { moralityDelta: -1 },
  },
  {
    id: "spy_ch1_admit",
    segment: "investigate",
    rarity: "common",
    label: "ADMIT",
    fullText: "You're right. What do you want?",
    outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 3 } },
  },
  {
    id: "spy_ch1_counter",
    segment: "aggressive",
    rarity: "uncommon",
    label: "COUNTER",
    fullText: "I know about the Syndicate mark on your eye patch.",
    outcome: { moralityDelta: -2, npcTrustDelta: { npcId: "adjudicator_locke", delta: 1 } },
  },
  {
    id: "spy_ch1_double_down",
    segment: "aggressive",
    rarity: "rare",
    label: "DOUBLE DOWN",
    fullText: "I know about Station 7. The classified Potentials Incident. And your role in it.",
    outcome: { moralityDelta: -3, npcTrustDelta: { npcId: "adjudicator_locke", delta: -2 } },
  },
  {
    id: "spy_ch1_real_name",
    segment: "investigate",
    rarity: "legendary",
    label: "SPY: HER REAL NAME",
    fullText:
      "I know Adjudicator Locke is not your real name. Your real name is in the Panopticon's staff records, Year 15,447. You worked for the Watcher before you worked for New Babylon.",
    outcome: {
      npcTrustDelta: { npcId: "adjudicator_locke", delta: 5 },
      unlocks: ["spy_locke_senne_revealed"],
    },
    gateCondition: { requireClass: "spy" },
  },
  {
    id: "spy_ch1_charisma",
    segment: "skill_check",
    rarity: "epic",
    label: "CHARISMA 14",
    fullText:
      "I know more than you expect. Less than you fear. Trade something genuine and we can both walk away better informed.",
    outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 4 } },
    gateCondition: { minSkillLevel: { skillId: "charisma", level: 14 } },
  },
];

const ch1: PotentialQuestlineChapter = {
  id: "spy_ch1_locke_reads_you",
  completionFlag: "spy_locke_preempt_complete",
  title: "Locke Reads You",
  hook: "Adjudicator Locke identified your lineage before you said a word. She wants to trade.",
  sectorId: "new_babylon_core",
  opener: [
    {
      speaker: "adjudicator_locke",
      text:
        "I know what you are. Not 'Potential' — I know that much about everyone. I mean: I know what class of Potential you are. I know because the Spy lineage from the Collector's Garden has a specific genetic marker that shows up in Trade Empire transaction patterns. You gather information reflexively. Your purchase history shows three acquisitions that have no value except as intelligence assets. You're not a merchant. You're a Spy. And you're wasting time pretending to be a merchant to me.",
    },
    {
      speaker: "adjudicator_locke",
      stageDirection: "She folds her hands.",
      text:
        "So let's negotiate like adults. What do you know about me that I don't know you know? Because that's the only currency that matters in this room.",
    },
  ],
  wheel: ch1Wheel,
  followups: {
    spy_ch1_deny: [
      {
        speaker: "adjudicator_locke",
        text: "Interesting. That's the first thing you've said that I believe is a lie. I'll note that. The next time you want to trade, I'll remember you started with a denial.",
      },
    ],
    spy_ch1_admit: [
      {
        speaker: "adjudicator_locke",
        text: "Good. I want the same thing you want: a clear picture of who else is moving on this board. I have intelligence you need. You have a perspective I can't buy. Trade?",
      },
    ],
    spy_ch1_counter: [
      {
        speaker: "adjudicator_locke",
        stageDirection: "A pause.",
        text: "That's not public knowledge. Well done. The mark is from the Syndicate, yes. It means I owe them a favor. One. It is not outstanding. I paid it eleven thousand years ago and they kept the receipt.",
      },
    ],
    spy_ch1_double_down: [
      {
        speaker: "adjudicator_locke",
        stageDirection: "She is very still.",
        text: "Station 7 is sealed for a reason. My role in it is sealed for a reason. If you know about Station 7, then you know enough to hurt me, and I know enough about your transaction pattern to hurt you. Shall we call this even, or shall we both be hurt?",
      },
    ],
    spy_ch1_real_name: [
      {
        speaker: "adjudicator_locke",
        stageDirection: "She is very still.",
        text: "That record was sealed.",
      },
      { speaker: "player", text: "Most sealed records are." },
      {
        speaker: "adjudicator_locke",
        stageDirection: "Very long pause.",
        text: "What do you want?",
      },
      {
        speaker: "player",
        text:
          "What Locke always wants. A fair deal. You know where the first wave went and why. I know what you used to be before New Babylon offered you a new name. We're both people with histories we'd prefer to keep private and information we need to trade. So trade.",
      },
      {
        speaker: "adjudicator_locke",
        stageDirection: "Locke studies them.",
        text:
          "The first wave went to the dark sector because the Eyes sent them there. The Eyes told them the Dreamer was behind the shield and she was asking for help. I don't know if that was true. I know the Eyes believed it.",
      },
      {
        speaker: "adjudicator_locke",
        stageDirection: "She opens the envelope.",
        text:
          "My name, when I worked for the Watcher, was Surveillance Coordinator Senne. I was responsible for the Eyes' operational oversight. She was my asset. I was the one who identified her as compromised and passed her location to the Collector.",
      },
      {
        speaker: "adjudicator_locke",
        stageDirection: "Beat.",
        text:
          "I have been Adjudicator Locke for eleven thousand years. I have been trying to decide if that's long enough to become a different person. I still don't know.",
      },
    ],
    spy_ch1_charisma: [
      {
        speaker: "adjudicator_locke",
        stageDirection: "She almost smiles.",
        text:
          "Now that's a Spy's opening bid. You're not threatening. You're not bluffing. You're offering mutually assured discretion as a foundation for trade. I accept. What do you want to know first?",
      },
    ],
  },
  optionFlags: {
    spy_ch1_real_name: ["spy_locke_senne_revealed"],
  },
};

/* ─── CH 2 — WHAT LOCKE KNOWS ─── */

const ch2Wheel: WheelOption[] = [
  {
    id: "spy_ch2_first_wave",
    segment: "investigate",
    rarity: "rare",
    label: "THE FIRST WAVE",
    fullText: "Where did they go after the dark sector?",
    outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 2 } },
  },
  {
    id: "spy_ch2_eyes",
    segment: "investigate",
    rarity: "rare",
    label: "THE EYES",
    fullText: "Tell me about the Eyes' network — what's left of it.",
    outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 3 }, unlocks: ["spy_eyes_drop_points_recovered"] },
  },
  {
    id: "spy_ch2_dreamer",
    segment: "humanity",
    rarity: "epic",
    label: "THE DREAMER",
    fullText: "Is the Dreamer actually behind the shield? Do you believe the Eyes?",
    outcome: { moralityDelta: 2 },
  },
  {
    id: "spy_ch2_forgive",
    segment: "compassionate",
    rarity: "epic",
    label: "FORGIVE",
    fullText: "Eleven thousand years is long enough, Senne. You're someone else now.",
    outcome: { npcTrustDelta: { npcId: "adjudicator_locke", delta: 5 }, moralityDelta: 3 },
  },
];

const ch2: PotentialQuestlineChapter = {
  id: "spy_ch2_what_locke_knows",
  completionFlag: "spy_eyes_drop_points_recovered",
  unlockFlag: "spy_preempt_origin",
  title: "What Locke Knows",
  hook: "The horror reveal unlocked something in Locke. She's ready to trade her deepest intelligence — the Eyes' final mission and the first wave's fate.",
  sectorId: "new_babylon_core",
  opener: [
    {
      speaker: "adjudicator_locke",
      text:
        "You knew what you were before we told you. That changes the equation. Someone who sees themselves clearly is someone I can do business with — because you won't flinch when I show you what I've been carrying.",
    },
    {
      speaker: "adjudicator_locke",
      text:
        "The Eyes — my asset, the woman I got killed — she left drop points. Hidden intelligence caches across six sectors. I've known their locations for eleven thousand years. I have never accessed them. I couldn't bring myself to open her work after what I did.",
    },
    {
      speaker: "adjudicator_locke",
      stageDirection: "She pushes a data chip across the table.",
      text:
        "You can. You're Spy class. The caches are keyed to the Collector's intelligence lineage — your lineage. They'll open for you. They won't open for me.",
    },
  ],
  wheel: ch2Wheel,
  followups: {
    spy_ch2_first_wave: [
      {
        speaker: "adjudicator_locke",
        text:
          "Beyond the dark sector, I lose them. The signal went dead fourteen months after they entered the Dreamer's Barrier. New Babylon's long-range sensors picked up one final burst: a coordinate set that matched nothing in any known system. Either the Dreamer moved them, or they found something on the other side that doesn't map to normal space.",
      },
    ],
    spy_ch2_eyes: [
      {
        speaker: "adjudicator_locke",
        text:
          "The network is fragmented but not dead. Six drop points, three I can confirm are still intact. The intelligence inside predates the Fall. Some of it implicates factions that currently don't know she had it. If you access those caches, you will be the most informed Potential in the galaxy — and also the most targeted.",
      },
    ],
    spy_ch2_dreamer: [
      {
        speaker: "adjudicator_locke",
        stageDirection: "She is quiet for a long time.",
        text:
          "I believe the Eyes believed it. The Eyes was the most careful operative I ever handled. She didn't follow rumors. She followed evidence. If she sent the first wave behind the shield, she had evidence the Dreamer was there. Whether the Dreamer is still there — that I don't know. The shield has been silent for eleven thousand years.",
      },
    ],
    spy_ch2_forgive: [
      {
        speaker: "adjudicator_locke",
        stageDirection: "Something breaks in her expression. Just briefly.",
        text:
          "Don't say that unless you mean it. Don't say it because it's the kind thing to say. I got someone killed. The fact that it was eleven thousand years ago doesn't make her less dead. It makes me better at living with it.",
      },
      {
        speaker: "adjudicator_locke",
        stageDirection: "A pause.",
        text:
          "But if you mean it — if you genuinely believe that eleven thousand years of trying to be someone else counts for something — then thank you. That is the first time anyone has said that to me since I became Locke.",
      },
    ],
  },
};

/* ─── QUESTLINE ─── */

export const SPY_QUESTLINE: PotentialQuestline = {
  id: "spy_every_truth",
  title: "Every Truth Has a Price",
  premise:
    "Spy Potentials are the most politically versatile — and the most politically dangerous. Every faction treats them with suspicion and wants to recruit them simultaneously. The questline is about what information costs the person carrying it.",
  actGate: 2,
  chapters: [ch1, ch2],
  flags: SPY_QUESTLINE_FLAGS,
};
