/* DeMagi Questline Ch2 — The Assembly's Offer (spec §2.1) */
import type { PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const DEMAGI_CH2_FLAGS = ["demagi_assembly_offer_heard", "demagi_fracture_revealed", "demagi_quarchon_bridge_offered"] as const;

const ch2Wheel: WheelOption[] = [
  {
    id: "dem_ch2_investigate",
    segment: "investigate",
    rarity: "common",
    label: "INVESTIGATE",
    fullText: "Tell me about the Quarchon's Probability Accord. What exactly do they want?",
    outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 2 } },
  },
  {
    id: "dem_ch2_humanity",
    segment: "humanity",
    rarity: "common",
    label: "HUMANITY",
    fullText: "Forty-three years and you built twelve colonies. That's remarkable.",
    outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "thael_vo", delta: 3 } },
  },
  {
    id: "dem_ch2_skeptical",
    segment: "aggressive",
    rarity: "common",
    label: "SKEPTICAL",
    fullText: "Every faction says they don't want centralized authority. Every faction does.",
    outcome: { moralityDelta: -1, npcTrustDelta: { npcId: "thael_vo", delta: 1 } },
  },
  {
    id: "dem_ch2_demagi_only",
    segment: "humanity",
    rarity: "rare",
    label: "DeMagi: WHAT HAPPENS TO OTHERS?",
    fullText: "What happens to DeMagi who don't join the Assembly?",
    outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 2 } },
    gateCondition: { requireSpecies: "demagi" },
  },
  {
    id: "dem_ch2_quarchon_only",
    segment: "machine",
    rarity: "rare",
    label: "Quarchon: WORK AGAINST MY PEOPLE?",
    fullText: "I'm Quarchon. Are you seriously asking me to work against my own people?",
    outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 4 }, unlocks: ["demagi_quarchon_bridge_offered"] },
    gateCondition: { requireSpecies: "quarchon" },
  },
  {
    id: "dem_ch2_soldier_spy",
    segment: "skill_check",
    rarity: "epic",
    label: "SOLDIER/SPY",
    fullText: "Walk me through the mutual defense network. Structure. Numbers. Weaknesses.",
    outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 2 } },
    gateCondition: { requireClass: ["soldier", "spy"] },
  },
  {
    id: "dem_ch2_engineer",
    segment: "investigate",
    rarity: "epic",
    label: "ENGINEER",
    fullText: "What does the shared research archive contain? Specifically the elemental affinity research.",
    outcome: { npcTrustDelta: { npcId: "thael_vo", delta: 3 }, unlocks: ["codex_resonance_archive_preview"] },
    gateCondition: { requireClass: "engineer" },
  },
  {
    id: "dem_ch2_oracle",
    segment: "skill_check",
    rarity: "legendary",
    label: "ORACLE: INT 12",
    fullText: "I've seen the probability branches from here. Tell me what you're not saying.",
    outcome: {
      npcTrustDelta: { npcId: "thael_vo", delta: 5 },
      unlocks: ["demagi_fracture_revealed"],
    },
    gateCondition: { minSkillLevel: { skillId: "intelligence", level: 12 } },
  },
];

export const DEMAGI_CH2: PotentialQuestlineChapter = {
  id: "demagi_ch2_assembly_offer",
  completionFlag: "demagi_assembly_offer_heard",
  unlockFlag: "demagi_assembly_contacted",
  title: "The Assembly's Offer",
  hook: "Thael-Vo wants you to visit the Free Ports. The Assembly has something to show you — and something to ask.",
  sectorId: "free_ports",
  opener: [
    {
      speaker: "thael_vo",
      text: "What we've built in forty-three years: twelve self-sustaining DeMagi colonies, a mutual defense network, a shared research archive on elemental affinity development, and — most importantly — the beginning of a governance framework that doesn't require a single centralized authority.",
    },
    {
      speaker: "thael_vo",
      text: "What we need: someone who can move between DeMagi and Quarchon spaces without either faction treating them as an agent of the other. You woke up recently. You haven't been claimed. You are — for a window that will close — genuinely unaffiliated.",
    },
  ],
  wheel: ch2Wheel,
  followups: {
    dem_ch2_investigate: [
      {
        speaker: "thael_vo",
        text: "The Accord wants stability. I don't question that motive. I question their method. They model outcomes and then steer toward the model. Every conversation, every trade agreement, every diplomatic contact is probability-weighted before it happens. They don't see a conversation — they see a tree of outcomes and they prune the branches they don't like. That's not governance. That's gardening. And we've had enough of being someone's garden.",
      },
    ],
    dem_ch2_humanity: [
      {
        speaker: "thael_vo",
        text: "Thank you. It hasn't been easy. The first three years were survival — food, shelter, figuring out how to exist in bodies that were designed in a lab. The next ten were politics — who leads, who decides, who speaks for DeMagi when there's no precedent for DeMagi existing. The last thirty have been... building. Slowly. With a lot of arguments.",
      },
    ],
    dem_ch2_skeptical: [
      {
        speaker: "thael_vo",
        stageDirection: "He smiles. It is a tired smile.",
        text: "Fair. You're not wrong about the pattern. I can only tell you what we've built and let you decide if it matches the claim. The Assembly has no president, no prime minister, no single leader. I'm Council Speaker because someone has to schedule the meetings. That's the joke we tell. It's also the truth.",
      },
    ],
    dem_ch2_demagi_only: [
      {
        speaker: "thael_vo",
        text: "They're welcome to stay independent. We don't compel. Some DeMagi colonies have chosen isolation — they want nothing to do with either faction. We respect that. We worry about them, because the galaxy is not safe for isolated Potentials, but we respect it.",
      },
    ],
    dem_ch2_quarchon_only: [
      {
        speaker: "thael_vo",
        stageDirection: "He is quiet for a moment.",
        text: "I'm asking you to consider that the Quarchon you grew up knowing — the collective consciousness, the dimensional models, the probability structures — that's your ancestry. Not your identity. The same way a DeMagi born from Fire doesn't have to burn everything they touch just because fire is what they are.",
      },
      {
        speaker: "thael_vo",
        text: "I'm not asking you to work against Quarchon. I'm asking you to be a Potential who happens to be Quarchon, instead of a Quarchon who happens to have been a Potential once. The distinction is the entire difference between peace and forty more years of cold war.",
      },
    ],
    dem_ch2_soldier_spy: [
      {
        speaker: "thael_vo",
        text: "Twelve colonies. Each colony maintains a local defense force of 30-50 trained elementalists. The mutual defense pact requires any colony within range to reinforce a colony under attack within 72 hours. Our weakness: range. The colonies are spread across four sectors. A coordinated simultaneous attack on three or more colonies would overwhelm the network. I'm telling you this because you asked, and because if you can see the weakness, the Quarchon military already has.",
      },
    ],
    dem_ch2_engineer: [
      {
        speaker: "thael_vo",
        text: "Everything. Forty-three years of research into how elemental affinities work at the genetic level. What the Collector did to create them. How they can be strengthened, stabilized, or — in emergency — suppressed. The archive is the single most valuable scientific resource the DeMagi have. It's also the thing the Quarchon Reality Institute most wants access to.",
      },
    ],
    dem_ch2_oracle: [
      {
        speaker: "thael_vo",
        stageDirection: "He stops. Reassesses.",
        text: "You're an Oracle. That — changes the conversation. An Oracle sees the branches.",
      },
      {
        speaker: "thael_vo",
        stageDirection: "He sits down, which he hasn't done yet.",
        text: "What I'm not saying is that the Assembly is fracturing. The Pure Flame faction has been gaining members for six months. Arch-Burner Vel is not interested in cooperation with Quarchon. Vel is interested in preemptive action. 'Preemptive action' means destroying three Quarchon research stations that the Pure Flame believes are developing reality-altering weapons.",
      },
      {
        speaker: "thael_vo",
        text: "We do not know if the stations are building weapons. We do not know if destroying them would start a war we would lose. What we know is that Vel has a point of view that resonates with DeMagi who remember what centralized machine intelligence did to the galaxy — and that resonance is real even if Vel's solution is catastrophic.",
      },
      {
        speaker: "thael_vo",
        text: "That is what I'm not saying.",
      },
    ],
  },
};
