/* DeMagi Questline Ch3 — The Pure Flame's Invitation (spec §2.1) */
import type { PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const DEMAGI_CH3_FLAGS = ["demagi_pureflame_contacted", "vel_ember_iv_heard", "vel_logs_received"] as const;

const ch3Wheel: WheelOption[] = [
  {
    id: "dem_ch3_neutral",
    segment: "investigate",
    rarity: "common",
    label: "NEUTRAL",
    fullText: "Send me the logs. I'll evaluate them myself.",
    outcome: { npcTrustDelta: { npcId: "arch_burner_vel", delta: 2 }, unlocks: ["vel_logs_received"] },
  },
  {
    id: "dem_ch3_skeptical",
    segment: "machine",
    rarity: "common",
    label: "SKEPTICAL",
    fullText: "How did you get these logs, and why should I trust them?",
    outcome: { moralityDelta: -1, npcTrustDelta: { npcId: "arch_burner_vel", delta: 1 } },
  },
  {
    id: "dem_ch3_defiant",
    segment: "aggressive",
    rarity: "common",
    label: "DEFIANT",
    fullText: "Preemptive strikes on research stations is a war crime.",
    outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "arch_burner_vel", delta: -2 } },
  },
  {
    id: "dem_ch3_understanding",
    segment: "compassionate",
    rarity: "uncommon",
    label: "UNDERSTANDING",
    fullText: "What happened to you specifically that brought you here?",
    outcome: {
      moralityDelta: 3,
      npcTrustDelta: { npcId: "arch_burner_vel", delta: 5 },
      unlocks: ["vel_ember_iv_heard"],
    },
  },
  {
    id: "dem_ch3_demagi_only",
    segment: "humanity",
    rarity: "rare",
    label: "DeMagi: NOT AUTOMATIC",
    fullText: "Vel. I'm DeMagi. I need you to know I'm not automatically with you because of that.",
    outcome: { npcTrustDelta: { npcId: "arch_burner_vel", delta: 3 } },
    gateCondition: { requireSpecies: "demagi" },
  },
  {
    id: "dem_ch3_int12",
    segment: "skill_check",
    rarity: "legendary",
    label: "INT 12: SIGNATURE",
    fullText: "Destabilizing reality. What exactly does that look like? What's the measurable signature?",
    outcome: {
      npcTrustDelta: { npcId: "arch_burner_vel", delta: 4 },
      unlocks: ["vel_logs_received", "codex_reality_destabilization_signatures"],
    },
    gateCondition: { minSkillLevel: { skillId: "intelligence", level: 12 } },
  },
];

export const DEMAGI_CH3: PotentialQuestlineChapter = {
  id: "demagi_ch3_pure_flame_invitation",
  completionFlag: "demagi_pureflame_contacted",
  unlockFlag: "demagi_assembly_offer_heard",
  title: "The Pure Flame's Invitation",
  hook: "Arch-Burner Vel sends an unencrypted transmission. That itself is a statement.",
  sectorId: "hidden_pureflame_cell",
  opener: [
    {
      speaker: "arch_burner_vel",
      stageDirection: "The transmission is unencrypted. That itself is a statement. A DeMagi with skin so dark it absorbs the light around them, eyes like embers, wearing no Assembly markings.",
    },
    {
      speaker: "arch_burner_vel",
      text: "Potential. I'm not going to waste your time with politics. I'm going to tell you a fact. The Quarchon Reality Institute has been running experiments on the fabric of reality itself — dimensional rifts, probability rewriting, temporal restructuring. The experiment logs I have show three incidents in the last six months where local reality was measurably destabilized by their work.",
    },
    {
      speaker: "arch_burner_vel",
      text: "Thael-Vo knows about this. Thael-Vo is choosing diplomacy because Thael-Vo believes the Quarchon will stop if asked nicely. I believe the Quarchon will stop when they are physically prevented from continuing.",
    },
    {
      speaker: "arch_burner_vel",
      stageDirection: "The ember eyes hold steady.",
      text: "I'm not asking you to join us. I'm asking you to look at the experiment logs and tell me if I'm wrong.",
    },
  ],
  wheel: ch3Wheel,
  followups: {
    dem_ch3_neutral: [
      {
        speaker: "arch_burner_vel",
        text: "Good. Look at them. Run whatever analysis you want. I'm not afraid of an honest evaluation. The logs speak for themselves — three incidents, three sectors of measurable reality distortion, zero Accord acknowledgment that anything went wrong.",
      },
    ],
    dem_ch3_skeptical: [
      {
        speaker: "arch_burner_vel",
        text: "I have a source inside the Reality Institute. No, I won't name them. Yes, the logs are genuine — they carry the Institute's internal metadata signatures. If you have an Engineer or Oracle, you can verify the signatures yourself. I'm not asking you to trust me. I'm asking you to trust physics.",
      },
    ],
    dem_ch3_defiant: [
      {
        speaker: "arch_burner_vel",
        stageDirection: "The embers in their eyes flare briefly, then steady.",
        text: "War crime. Yes. That's the word people use when they want to end a conversation about forty-six dead colonists. I note that nobody called the probability cascade that killed Ember IV a war crime. That was a 'statistical anomaly.' Convenient how the language only works in one direction.",
      },
    ],
    dem_ch3_understanding: [
      {
        speaker: "arch_burner_vel",
        stageDirection: "Something shifts. Not much. But something.",
        text: "My colony. Ember IV. Forty-six DeMagi. We'd been established for eleven years. One of the Quarchon Reality Institute's dimensional experiments three sectors away created a probability cascade — the kind of cascade their models said had a 0.0003% chance of propagating beyond the test area. It propagated. The cascade hit Ember IV at 0.6 light-seconds of warning.",
      },
      {
        speaker: "arch_burner_vel",
        stageDirection: "Beat.",
        text: "There are no survivors. The colony doesn't exist anymore. The Probability Accord's official response was: 'Statistical anomaly. Calculated risk. The research value justified the parameters.'",
      },
      {
        speaker: "arch_burner_vel",
        stageDirection: "The embers in their eyes are very still.",
        text: "I don't expect you to agree with my methods. I expect you to understand why 'calculated risk' doesn't satisfy me as an explanation for forty-six people.",
      },
    ],
    dem_ch3_demagi_only: [
      {
        speaker: "arch_burner_vel",
        text: "Good. I don't want automatic loyalty. Automatic loyalty is what Thael-Vo has, and it's making the Assembly complacent. I want someone who has looked at the evidence, felt the weight of Ember IV, and decided — freely, without pressure — that some things are worth fighting about. If that's you, we talk again. If it's not, I respect that too.",
      },
    ],
    dem_ch3_int12: [
      {
        speaker: "arch_burner_vel",
        text: "Measurable signature: local probability fields deviate from baseline by more than 3 standard deviations within a radius of 0.2 light-years. Physical constants — gravitational coupling, electromagnetic fine structure — fluctuate by 0.001% or more. That doesn't sound like much. In a populated area, 0.001% fluctuation in gravitational coupling means buildings collapse, atmospheres thin, fusion reactors destabilize.",
      },
      {
        speaker: "arch_burner_vel",
        text: "The three incidents I have logged show deviations of 0.003%, 0.007%, and 0.012%. The third one — the 0.012% — is the cascade that hit Ember IV. The trajectory is not stable. It's accelerating.",
      },
    ],
  },
};
