/* DeMagi Questline Ch4 — The Choice: Three-Way Mediation (spec §2.1) */
import type { PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const DEMAGI_CH4_FLAGS = [
  "demagi_mediation_complete",
  "demagi_sided_thaelvo", "demagi_sided_vel", "demagi_split_decision",
  "demagi_third_path", "demagi_refused_mediation", "demagi_element_resolution",
] as const;

const ch4Wheel: WheelOption[] = [
  {
    id: "dem_ch4_side_thaelvo",
    segment: "compassionate",
    rarity: "rare",
    label: "SIDE THAEL-VO",
    fullText: "The Assembly's approach is right. Diplomacy now.",
    outcome: {
      npcTrustDelta: { npcId: "thael_vo", delta: 5 },
      unlocks: ["demagi_sided_thaelvo"],
    },
  },
  {
    id: "dem_ch4_side_vel",
    segment: "aggressive",
    rarity: "rare",
    label: "SIDE VEL",
    fullText: "Vel's concern is legitimate. The stations need inspection, not protection.",
    outcome: {
      npcTrustDelta: { npcId: "arch_burner_vel", delta: 5 },
      unlocks: ["demagi_sided_vel"],
    },
  },
  {
    id: "dem_ch4_split",
    segment: "investigate",
    rarity: "epic",
    label: "SPLIT DECISION",
    fullText: "Thael-Vo oversees safety inspection. Vel observes. Neither acts alone.",
    outcome: {
      npcTrustDelta: { npcId: "thael_vo", delta: 3 },
      unlocks: ["demagi_split_decision"],
    },
  },
  {
    id: "dem_ch4_third_path",
    segment: "humanity",
    rarity: "legendary",
    label: "THIRD PATH",
    fullText: "Stop arguing about the stations. Both of you are missing the actual threat.",
    outcome: {
      moralityDelta: 5,
      npcTrustDelta: { npcId: "thael_vo", delta: 4 },
      unlocks: ["demagi_third_path"],
    },
  },
  {
    id: "dem_ch4_refuse",
    segment: "machine",
    rarity: "common",
    label: "REFUSE",
    fullText: "I won't mediate a DeMagi family argument. Figure it out.",
    outcome: {
      moralityDelta: -2,
      unlocks: ["demagi_refused_mediation"],
    },
  },
  {
    id: "dem_ch4_element",
    segment: "skill_check",
    rarity: "legendary",
    label: "DeMagi: MY ELEMENT SPEAKS",
    fullText: "I am DeMagi. My element is part of me. My choice reflects that.",
    outcome: {
      npcTrustDelta: { npcId: "thael_vo", delta: 3 },
      unlocks: ["demagi_element_resolution"],
    },
    gateCondition: { requireSpecies: "demagi" },
  },
];

export const DEMAGI_CH4: PotentialQuestlineChapter = {
  id: "demagi_ch4_the_choice",
  completionFlag: "demagi_mediation_complete",
  unlockFlag: "demagi_pureflame_contacted",
  title: "The Choice",
  hook: "Thael-Vo and Vel in the same room. The Assembly has requested mediation. You are the only Potential both factions have spoken to.",
  sectorId: "free_ports",
  opener: [
    {
      speaker: "thael_vo",
      text: "Vel. The experiment cascade that destroyed Ember IV was a tragedy. I will not minimize that. But the Reality Institute's work is also the only research that has produced actionable data on stabilizing dimensional rifts — the same rifts that are going to destabilize every DeMagi elemental affinity if the Vortex continues its approach. We need that research.",
    },
    {
      speaker: "arch_burner_vel",
      text: "We need it to not kill us to produce it.",
    },
    {
      speaker: "thael_vo",
      text: "Agreed. Which is why I have been in negotiations with the Probability Accord about—",
    },
    {
      speaker: "arch_burner_vel",
      text: "I know what you've been negotiating. Safety parameters. Improved modeling. Better warning systems. All of which assume the Quarchon will implement them as agreed. All of which assume the Probability Accord's promises are binding. I have forty-six reasons not to assume that.",
    },
    {
      speaker: "thael_vo",
      stageDirection: "Both of them turn to the player.",
    },
    {
      speaker: "arch_burner_vel",
      text: "Say something.",
    },
  ],
  wheel: ch4Wheel,
  followups: {
    dem_ch4_side_thaelvo: [
      {
        speaker: "thael_vo",
        text: "Thank you. I will proceed with the Accord negotiations with your endorsement. Vel — I hear you. I will include independent verification in the safety parameters. But the stations stay operational.",
      },
      {
        speaker: "arch_burner_vel",
        stageDirection: "Vel stares for a long moment, then leaves without speaking.",
      },
    ],
    dem_ch4_side_vel: [
      {
        speaker: "arch_burner_vel",
        text: "Thank you. Thael-Vo, we're going to inspect those stations. Not destroy them — inspect. If they're clean, I'll say so publicly. If they're not, we act.",
      },
      {
        speaker: "thael_vo",
        stageDirection: "He looks at the player with something that might be disappointment, might be recalculation.",
        text: "I hope you're right about Vel's restraint. I genuinely do.",
      },
    ],
    dem_ch4_split: [
      {
        speaker: "thael_vo",
        text: "A compromise. Neither of us gets what we want. Both of us get something we can live with. That's... governance, I suppose.",
      },
      {
        speaker: "arch_burner_vel",
        text: "I'll observe. I won't interfere. But if I see evidence of weapons development, the observation period ends.",
      },
    ],
    dem_ch4_third_path: [
      {
        speaker: "thael_vo",
        stageDirection: "Silence.",
      },
      {
        speaker: "arch_burner_vel",
        stageDirection: "Very quietly.",
        text: "That's the first thing either of you has said that sounds like a real argument.",
      },
      {
        speaker: "thael_vo",
        text: "We would need a joint DeMagi-Quarchon research authority. The Quarchon won't accept that. They barely accept the concept of joint anything.",
      },
      {
        speaker: "player",
        text: "I know someone who can make that argument to the Quarchon. Not because they'll like it — because they'll calculate that the alternative is worse.",
      },
    ],
    dem_ch4_refuse: [
      {
        speaker: "thael_vo",
        stageDirection: "Both NPCs look at you. Then at each other.",
        text: "We asked for your help. You're entitled to refuse. But I want you to know that this conversation will happen with or without you — and without a mediator, it becomes a negotiation between people who have already decided what they want.",
      },
    ],
    dem_ch4_element: [
      {
        speaker: "thael_vo",
        text: "Your element speaks. I hear it. The resolution of this conflict may be something only an elemental Potential can see — a path that isn't diplomatic or military but something deeper. Something that comes from being made of the world itself.",
      },
    ],
  },
  unityContributions: {
    dem_ch4_side_thaelvo: "questline_mediation",
    dem_ch4_side_vel: "questline_extremist_act",
    dem_ch4_split: "questline_mediation",
    dem_ch4_third_path: "questline_third_path",
    dem_ch4_refuse: "questline_formal_affiliation",
    dem_ch4_element: "questline_mediation",
  },
};
