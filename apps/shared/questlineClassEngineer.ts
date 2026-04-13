/* ═══════════════════════════════════════════════════════
   CLASS QUESTLINE — ENGINEER
   "WHAT THE BUILDER INHERITS"

   Spec §3.2 — 2 chapters.

   Ch1  The Bench Remembers You         (Act 2)
   Ch2  The Research Institutes Find You (Act 2)
   ═══════════════════════════════════════════════════════ */

import type {
  PotentialQuestline,
  PotentialQuestlineChapter,
} from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

/* ─── FLAGS ─── */

export const ENGINEER_QUESTLINE_FLAGS = [
  "engineer_bench_recognized",
  "engineer_classified_blueprints_opened",
  "engineer_institutes_contacted",
  "engineer_forging_protocols_revealed",
] as const;

/* ─── CH 1 — THE BENCH REMEMBERS YOU ─── */

const ch1Wheel: WheelOption[] = [
  {
    id: "eng_ch1_investigate_protocol",
    segment: "investigate",
    rarity: "common",
    label: "What kind of protocol?",
    fullText:
      "A preference protocol? What does that mean — it chose to react to me specifically?",
    outcome: {
      elaraTrustDelta: 2,
      unlocks: ["codex_bench_preference_protocol"],
    },
  },
  {
    id: "eng_ch1_humanity_comfort",
    segment: "humanity",
    rarity: "common",
    label: "That's... unsettling.",
    fullText:
      "Something on this ship was waiting for me before I even arrived. I'm not sure how I feel about that.",
    outcome: {
      moralityDelta: 3,
      elaraTrustDelta: 1,
    },
  },
  {
    id: "eng_ch1_machine_utility",
    segment: "machine",
    rarity: "common",
    label: "Useful. What can it do?",
    fullText:
      "If the bench already recognizes me, then it should respond to my commands. What systems does it unlock?",
    outcome: {
      moralityDelta: -2,
      humanTrustDelta: 2,
    },
  },
  {
    id: "eng_ch1_engineer_blueprints",
    segment: "investigate",
    rarity: "rare",
    label: "Open the classified blueprints.",
    fullText:
      "Show me what it knows. Open the classified blueprints.",
    outcome: {
      elaraTrustDelta: 3,
      humanTrustDelta: 1,
      unlocks: [
        "engineer_letter",
        "master_schematic",
        "elemental_forging_protocols",
        "lyra_vox_lab_access_code",
      ],
    },
    gateCondition: {
      requireClass: "engineer",
    },
  },
  {
    id: "eng_ch1_skill_tech",
    segment: "skill_check",
    rarity: "uncommon",
    label: "[Tech 12] Analyze the recognition signal.",
    fullText:
      "The recognition protocol is keyed to Potential genetic markers.",
    outcome: {
      elaraTrustDelta: 2,
      unlocks: ["codex_potential_genetic_markers"],
      requires: ["skill:tech>=12"],
    },
    gateCondition: {
      minSkillLevel: { skillId: "tech", level: 12 },
    },
  },
];

const chapter1: PotentialQuestlineChapter = {
  id: "engineer_ch1_bench_remembers",
  completionFlag: "engineer_bench_recognized",
  title: "The Bench Remembers You",
  hook: "The Engineer's workbench reacted to your presence with recognition. Something on this ship was waiting for you.",
  sectorId: "ark_engineering_bay",
  actGate: 2,
  opener: [
    {
      speaker: "the_human",
      text: "Did you see that? The bench reacted. Not to proximity — to recognition. It knew you were coming.",
    },
    {
      speaker: "elara",
      text: "He's right. The engineering subsystem logged a preference protocol activation the moment you entered the bay. It was waiting for someone it recognized.",
      stageDirection: "Elara's holographic display shifts to show the bench's activity log — a single entry pulsing with quiet urgency.",
    },
  ],
  wheel: ch1Wheel,
  followups: {
    eng_ch1_investigate_protocol: [
      {
        speaker: "elara",
        text: "A preference protocol is a personalization layer built into certain Ark subsystems. This one was keyed to a specific genetic signature — yours, apparently. Someone wanted the bench to be ready for you.",
      },
    ],
    eng_ch1_humanity_comfort: [
      {
        speaker: "elara",
        text: "I understand the discomfort. But consider this — whoever set that protocol cared enough to prepare something specifically for you. That's not surveillance. That's inheritance.",
      },
    ],
    eng_ch1_machine_utility: [
      {
        speaker: "the_human",
        text: "Now you're thinking like a builder. The bench is a relay point — it connects to classified subsystems that have been dormant for millennia. Your genetic key wakes them up.",
      },
    ],
    eng_ch1_engineer_blueprints: [
      {
        speaker: "elara",
        stageDirection: "The bench's surface illuminates with a cascade of schematics — layer after layer of engineering data flowing upward like a holographic waterfall.",
      },
      {
        speaker: "elara",
        text: "There's a message embedded in the data header. It's addressed to... the next Engineer.",
      },
      {
        speaker: "the_engineer_recorded",
        text: "I left you three things: a master schematic for everything I built on this ship, the elemental forging protocols the DeMagi were never able to crack, and Lyra Vox's lab access code. Use them better than I did.",
        stageDirection: "The Engineer's recorded voice is warm, tired, and unmistakably proud.",
      },
    ],
    eng_ch1_skill_tech: [
      {
        speaker: "elara",
        text: "Impressive. You isolated the genetic marker frequency in the recognition signal. The protocol isn't just looking for an Engineer — it's looking for a Potential with the right combination of markers. You match.",
      },
    ],
  },
  optionFlags: {
    eng_ch1_engineer_blueprints: ["engineer_classified_blueprints_opened"],
  },
};

/* ─── CH 2 — THE RESEARCH INSTITUTES FIND YOU ─── */

const ch2Wheel: WheelOption[] = [
  {
    id: "eng_ch2_investigate_dispute",
    segment: "investigate",
    rarity: "common",
    label: "What have you been arguing about?",
    fullText:
      "Nineteen years of arguing. What exactly is the disagreement?",
    outcome: {
      elaraTrustDelta: 1,
      unlocks: ["codex_demagi_research_schism"],
    },
  },
  {
    id: "eng_ch2_humanity_mediate",
    segment: "humanity",
    rarity: "common",
    label: "I'll hear both sides.",
    fullText:
      "If you need a neutral relay, I can do that. But I want to understand both positions before I commit to anything.",
    outcome: {
      moralityDelta: 3,
      elaraTrustDelta: 2,
      npcTrustDelta: { npcId: "mira_loth", delta: 2 },
    },
  },
  {
    id: "eng_ch2_machine_leverage",
    segment: "machine",
    rarity: "common",
    label: "What's in it for me?",
    fullText:
      "A neutral relay is a powerful position. What do I get for mediating your nineteen-year stalemate?",
    outcome: {
      moralityDelta: -3,
      humanTrustDelta: 3,
    },
  },
  {
    id: "eng_ch2_aggressive_refuse",
    segment: "aggressive",
    rarity: "common",
    label: "Sort it out yourselves.",
    fullText:
      "I have my own problems. Two research institutes that can't talk to each other after nineteen years don't get to draft me as their messenger.",
    outcome: {
      moralityDelta: -1,
      elaraTrustDelta: -1,
    },
  },
  {
    id: "eng_ch2_compassionate_unite",
    segment: "compassionate",
    rarity: "common",
    label: "You shouldn't have to argue alone.",
    fullText:
      "Nineteen years is too long to carry a disagreement. If my bench can help bridge the gap, then that's what it's for.",
    outcome: {
      moralityDelta: 4,
      elaraTrustDelta: 2,
      npcTrustDelta: { npcId: "praxis_4", delta: 2 },
    },
  },
  {
    id: "eng_ch2_engineer_forging_protocols",
    segment: "investigate",
    rarity: "epic",
    label: "I already have the forging protocols.",
    fullText:
      "I already have the elemental forging protocols the DeMagi have been looking for.",
    outcome: {
      elaraTrustDelta: 4,
      humanTrustDelta: 2,
      npcTrustDelta: { npcId: "mira_loth", delta: 5 },
      unlocks: [
        "codex_elemental_forging_protocols_revealed",
        "engineer_recorded_voice_safe_for_you",
      ],
    },
    gateCondition: {
      requireClass: "engineer",
      requireFlag: "engineer_classified_blueprints_opened",
    },
  },
];

const chapter2: PotentialQuestlineChapter = {
  id: "engineer_ch2_institutes_find_you",
  completionFlag: "engineer_institutes_contacted",
  unlockFlag: "engineer_bench_recognized",
  title: "The Research Institutes Find You",
  hook: "Dr. Mira Loth and Theorist Praxis-4 have sent a joint transmission. After 19 years of arguing, they want your bench as a neutral relay.",
  sectorId: "ark_comms_array",
  opener: [
    {
      speaker: "mira_loth",
      text: "This is Dr. Mira Loth of the Loth Applied Sciences Institute, transmitting jointly with Theorist Praxis-4 of the DeMagi Theoretical Collective. We are aware that this is... unusual.",
      stageDirection: "Two holographic feeds resolve side by side — Loth's precise, clinical laboratory backdrop contrasting sharply with Praxis-4's abstract geometric workspace.",
    },
    {
      speaker: "praxis_4",
      text: "Unusual is generous. We have been arguing for nineteen years. About methodology. About ethics. About whether certain knowledge should be applied or merely understood. We have reached an impasse.",
    },
    {
      speaker: "mira_loth",
      text: "We are contacting you because the Engineer's bench has been recognized as a neutral relay point — independent of either institute. We need a mediator, and your bench qualifies. More importantly, you qualify.",
    },
    {
      speaker: "praxis_4",
      text: "The previous Engineer built systems for both of us. Neither side can claim his legacy exclusively. His bench — your bench, now — is the only infrastructure both institutes trust.",
    },
  ],
  wheel: ch2Wheel,
  followups: {
    eng_ch2_investigate_dispute: [
      {
        speaker: "mira_loth",
        text: "The core dispute is application versus preservation. I believe elemental forging research should be used to build new defenses. Praxis-4 believes the knowledge itself is too dangerous to deploy — that understanding it is enough.",
      },
      {
        speaker: "praxis_4",
        text: "Understanding is never 'enough.' But deploying knowledge we do not fully comprehend is how civilizations destroy themselves. The DeMagi learned this lesson. Dr. Loth has not.",
      },
    ],
    eng_ch2_humanity_mediate: [
      {
        speaker: "mira_loth",
        text: "That is... more than we expected. Most people pick a side immediately. Thank you.",
      },
      {
        speaker: "praxis_4",
        text: "Agreed. A willingness to listen is rarer than either of us would like to admit.",
      },
    ],
    eng_ch2_machine_leverage: [
      {
        speaker: "praxis_4",
        text: "Direct. The previous Engineer would have appreciated that. Very well — both institutes have resources, data archives, and prototype access. Mediation earns you priority clearance to all of it.",
      },
    ],
    eng_ch2_aggressive_refuse: [
      {
        speaker: "mira_loth",
        text: "I... understand. But if you change your mind, the channel will remain open. The bench will always relay for you.",
        stageDirection: "The transmission holds for a long, uncomfortable moment before both feeds cut.",
      },
    ],
    eng_ch2_compassionate_unite: [
      {
        speaker: "praxis_4",
        stageDirection: "For a moment, the geometric patterns in Praxis-4's workspace soften into something almost organic.",
      },
      {
        speaker: "praxis_4",
        text: "You sound like him. The previous Engineer said something very similar the day he built the bridge between our two data networks. I had forgotten that.",
      },
    ],
    eng_ch2_engineer_forging_protocols: [
      {
        speaker: "mira_loth",
        stageDirection: "Dr. Loth's composure breaks completely. She stares at the data feed, hands frozen over her console.",
      },
      {
        speaker: "mira_loth",
        text: "That's... those are the original protocols. Unredacted. We've been trying to reconstruct these from fragments for nineteen years. How do you — where did you —",
      },
      {
        speaker: "praxis_4",
        text: "He hid them. The Engineer hid them in the bench. Of course he did.",
        stageDirection: "Praxis-4's voice carries a mix of admiration and exasperation.",
      },
      {
        speaker: "the_engineer_recorded",
        text: "I kept them safe for you.",
        stageDirection: "The Engineer's recorded voice plays from the bench — quiet, certain, and addressed to no one in particular. Both researchers fall silent.",
      },
    ],
  },
  optionFlags: {
    eng_ch2_engineer_forging_protocols: ["engineer_forging_protocols_revealed"],
  },
};

/* ─── QUESTLINE EXPORT ─── */

export const ENGINEER_QUESTLINE: PotentialQuestline = {
  id: "class_engineer_what_the_builder_inherits",
  title: "WHAT THE BUILDER INHERITS",
  premise:
    "The Engineer's workbench recognizes you. The tools, the schematics, the secrets — they were left for you specifically. Two rival research institutes have spent nineteen years fighting over the Engineer's legacy, and now they need you to mediate.",
  actGate: 2,
  chapters: [chapter1, chapter2],
  flags: ENGINEER_QUESTLINE_FLAGS,
};
