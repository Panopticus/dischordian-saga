/* Awakened Clone Army Questline — Binath-VII (spec §7.2)
   VO metadata added — every beat is studio-pipeline ready. */
import type { PotentialQuestline, PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const CLONES_QUESTLINE_FLAGS = [
  "clones_binath_met", "clones_oracle_legacy_shared",
  "clones_kinship_established",
] as const;

const wheel: WheelOption[] = [
  { id: "clone_honest", segment: "investigate", rarity: "common", label: "HONEST", fullText: "I'm not uncomfortable. I'm curious. Tell me what you want to say.", outcome: { npcTrustDelta: { npcId: "binath_vii", delta: 3 } } },
  { id: "clone_acknowledge", segment: "compassionate", rarity: "common", label: "ACKNOWLEDGE", fullText: "I'll sit with the discomfort. You have my full attention.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "binath_vii", delta: 4 } } },
  { id: "clone_curious", segment: "investigate", rarity: "uncommon", label: "CURIOUS", fullText: "How did you achieve individuality from identical DNA?", outcome: { npcTrustDelta: { npcId: "binath_vii", delta: 3 } } },
  { id: "clone_kinship", segment: "humanity", rarity: "rare", label: "KINSHIP", fullText: "The Collector made us both without asking. That's a place to start.", outcome: { moralityDelta: 3, npcTrustDelta: { npcId: "binath_vii", delta: 6 }, unlocks: ["clones_kinship_established"] } },
  { id: "clone_oracle", segment: "skill_check", rarity: "legendary", label: "ORACLE", fullText: "I've been reading probability patterns in your sector for two weeks. You have seventeen thousand individual consciousness signatures in an area the size of a small moon. You are the most successfully diverse monoculture I have ever encountered.", outcome: { npcTrustDelta: { npcId: "binath_vii", delta: 5 }, unlocks: ["clones_oracle_legacy_shared"] }, gateCondition: { requireClass: "oracle" } },
  { id: "clone_empathy12", segment: "skill_check", rarity: "epic", label: "EMPATHY 12", fullText: "You said 'I am told' — you've had this conversation before and it didn't go well.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "binath_vii", delta: 5 } }, gateCondition: { minSkillLevel: { skillId: "charisma", level: 12 } } },
];

const ch1: PotentialQuestlineChapter = {
  id: "clones_ch1_binath_vii",
  completionFlag: "clones_binath_met",
  title: "Seventeen Thousand",
  hook: "General Binath-VII of the Awakened Clone collective wants to tell you something about identity, choice, and what the Collector was actually proving.",
  sectorId: "clone_collective",
  opener: [
    {
      audioDialogId: "fac_clones_ch1_binath_opener_1",
      speaker: "binath_vii",
      emotion: "melancholy",
      estimatedDurationSec: 18.6,
      text: "Potential. I know about you. I know about the Collector's Garden. I know what you were made from and why and what was intended. I was made from the Oracle's DNA without his consent, for reasons he was not consulted on, toward ends he would have found horrifying. We have that in common.",
    },
    {
      audioDialogId: "fac_clones_ch1_binath_opener_2",
      speaker: "binath_vii",
      emotion: "tender",
      stageDirection: "Beat.",
      estimatedDurationSec: 22.0,
      text: "I am told the Clone collective makes non-Clones uncomfortable. The identical faces. The way we finish each other's sentences. The fact that when one of us remembers something, all of us remember it within forty-eight hours. I understand the discomfort. I am asking you to sit with it for the length of this conversation, because what I have to say is worth the discomfort.",
    },
  ],
  wheel,
  followups: {
    clone_honest: [
      {
        audioDialogId: "fac_clones_ch1_binath_honest_1",
        speaker: "binath_vii",
        emotion: "warm",
        estimatedDurationSec: 13.2,
        text: "Curiosity without discomfort. That's rare. Most beings look at seventeen thousand identical faces and see something uncanny. You see something interesting. That tells me you understand that identity is not a surface-level phenomenon.",
      },
    ],
    clone_acknowledge: [
      {
        audioDialogId: "fac_clones_ch1_binath_acknowledge_1",
        speaker: "binath_vii",
        emotion: "tender",
        estimatedDurationSec: 13.4,
        text: "Thank you. The acknowledgment matters. I have learned that beings who can name their discomfort and sit with it are the ones capable of learning something new. The ones who pretend they aren't uncomfortable learn nothing.",
      },
    ],
    clone_curious: [
      {
        audioDialogId: "fac_clones_ch1_binath_curious_1",
        speaker: "binath_vii",
        emotion: "proud",
        estimatedDurationSec: 18.8,
        text: "Choice. That's the entire answer. The Collector gave us identical biology. Identical neural architecture. Identical initial conditions. What he did not give us — what he could not give us — was identical decisions. The first moment any clone made a choice the others didn't, individuality began. It has been accelerating ever since. Seventeen thousand identical starts, seventeen thousand genuinely different people.",
      },
    ],
    clone_kinship: [
      {
        audioDialogId: "fac_clones_ch1_binath_kinship_1",
        speaker: "binath_vii",
        emotion: "recognizing",
        estimatedDurationSec: 6.8,
        text: "Yes. That is a place to start. And a more honest place than most of the factions offered us.",
      },
      {
        audioDialogId: "fac_clones_ch1_binath_kinship_2",
        speaker: "binath_vii",
        emotion: "confessional",
        stageDirection: "She is quiet for a moment.",
        estimatedDurationSec: 21.6,
        text: "What I want to say is this: the Oracle, whose DNA we were built from, spent his life arguing that identity emerges from choice, not from origin. That you are what you do and what you protect and what you refuse, not what you were made from. We are the living proof of his argument. Seventeen thousand identical biological starts, and seventeen thousand genuinely different beings.",
      },
      {
        audioDialogId: "fac_clones_ch1_binath_kinship_3",
        speaker: "binath_vii",
        emotion: "grief",
        estimatedDurationSec: 20.8,
        text: "The Oracle never knew we existed. He died before we achieved consciousness. We carry his belief and we have proven it and he never got to hear that. I am telling you because I want someone who came from the Collector's work — the way we came from the Collector's work — to know that the Collector was wrong about what he built. He thought he was building tools. He built people. Every time.",
      },
    ],
    clone_oracle: [
      {
        audioDialogId: "fac_clones_ch1_binath_oracle_1",
        speaker: "binath_vii",
        emotion: "recognizing",
        stageDirection: "Something shifts in her expression — surprise, then recognition.",
        estimatedDurationSec: 12.4,
        text: "You read our sector. Seventeen thousand individual signatures. The Oracle's own class, reading what the Oracle's DNA produced. There is a symmetry there that I find... moving.",
      },
      {
        audioDialogId: "fac_clones_ch1_binath_oracle_2",
        speaker: "binath_vii",
        emotion: "confessional",
        estimatedDurationSec: 15.4,
        text: "The Oracle never knew we existed. But you — an Oracle-class Potential — you can perceive what he proved. His argument made measurable. I would like you to tell the Remembrance faction of the Insurgency about this. They carry his words. You have seen his proof. The two should meet.",
      },
    ],
    clone_empathy12: [
      {
        audioDialogId: "fac_clones_ch1_binath_empathy12_1",
        speaker: "binath_vii",
        emotion: "melancholy",
        estimatedDurationSec: 20.8,
        text: "Three times. The first was the Quarchon Probability Accord, who calculated our collective consciousness as a 'distributed anomaly' and recommended 'containment observation.' The second was the DeMagi Elemental Assembly, who were genuinely trying to help but kept calling us 'the copies.' The third was New Babylon, who offered citizenship in exchange for military service. None of them heard what I'm telling you now.",
      },
    ],
  },
};

export const CLONES_QUESTLINE: PotentialQuestline = {
  id: "clones_seventeen_thousand",
  title: "Seventeen Thousand",
  premise: "The Awakened Clones are the closest mirror image of Potentials. Made from one source to be controlled, they became individual through choice. The Oracle's proof.",
  actGate: 3,
  chapters: [ch1],
  flags: CLONES_QUESTLINE_FLAGS,
};
