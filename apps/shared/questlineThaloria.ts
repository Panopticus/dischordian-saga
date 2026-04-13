/* Thaloria Questline — "THE LONG MOURNING" (spec §5.2)
   VO metadata added — every beat is studio-pipeline ready. */
import type { PotentialQuestline, PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const THALORIA_QUESTLINE_FLAGS = [
  "thaloria_hierophant_met", "thaloria_names_understood",
  "thaloria_shadow_tongue_intel_received",
] as const;

const wheel: WheelOption[] = [
  { id: "thal_listen", segment: "investigate", rarity: "common", label: "LISTEN", fullText: "Tell me.", outcome: { npcTrustDelta: { npcId: "the_hierophant", delta: 3 } } },
  { id: "thal_present", segment: "compassionate", rarity: "common", label: "PRESENT", fullText: "I'm here. I'm listening.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "the_hierophant", delta: 4 } } },
  { id: "thal_gentle", segment: "humanity", rarity: "uncommon", label: "GENTLE", fullText: "You don't have to tell me this.", outcome: { moralityDelta: 3, npcTrustDelta: { npcId: "the_hierophant", delta: 3 } } },
  { id: "thal_witness", segment: "compassionate", rarity: "rare", label: "WITNESS", fullText: "I'll stay as long as you need.", outcome: { moralityDelta: 4, npcTrustDelta: { npcId: "the_hierophant", delta: 5 } } },
  { id: "thal_oracle", segment: "skill_check", rarity: "epic", label: "ORACLE", fullText: "I can see the probability branches from here. In three of them, you don't finish the ceremony. In two, you do. In one, you're interrupted. Tell me — are you trying to finish, or are you trying to understand something?", outcome: { npcTrustDelta: { npcId: "the_hierophant", delta: 4 } }, gateCondition: { requireClass: "oracle" } },
  { id: "thal_empathy14", segment: "skill_check", rarity: "legendary", label: "EMPATHY 14", fullText: "You're not mourning the dead. You're writing the dead back into existence one name at a time. There's a difference.", outcome: { moralityDelta: 5, npcTrustDelta: { npcId: "the_hierophant", delta: 8 }, unlocks: ["thaloria_names_understood", "thaloria_shadow_tongue_intel_received"] }, gateCondition: { minSkillLevel: { skillId: "charisma", level: 14 } } },
];

const ch1: PotentialQuestlineChapter = {
  id: "thaloria_ch1_the_long_mourning",
  completionFlag: "thaloria_hierophant_met",
  title: "The Long Mourning",
  hook: "A chamber in Thaloria's capital. The Hierophant — ancient, verdant-skinned — sits among hundreds of thousands of names on the walls. He writes one per day.",
  sectorId: "thaloria",
  opener: [
    {
      audioDialogId: "fac_thaloria_ch1_hierophant_opener_1",
      speaker: "the_hierophant",
      stageDirection: "A chamber in Thaloria's capital. The Hierophant — ancient, verdant-skinned, wearing mourning robes that have become his permanent clothing — sits at the center of a circular room. The walls are covered in names. Hundreds of thousands of names in Thalorian spiritual script. Every being who died in the holy war. He writes one name per day. He has been writing for three thousand years.",
      emotion: "tender",
      estimatedDurationSec: 1.0,
    },
    {
      audioDialogId: "fac_thaloria_ch1_hierophant_opener_2",
      speaker: "the_hierophant",
      emotion: "melancholy",
      stageDirection: "He does not look up when the player enters.",
      estimatedDurationSec: 13.4,
      text: "I know what you are. I have been waiting for the new kind to find this room. The Shadow Tongue is still in the walls of this universe. It is still rewriting. You should know what it wrote through me.",
    },
  ],
  wheel,
  followups: {
    thal_listen: [
      {
        audioDialogId: "fac_thaloria_ch1_hierophant_listen_1",
        speaker: "the_hierophant",
        emotion: "grief",
        estimatedDurationSec: 22.4,
        text: "The Shadow Tongue arrived two centuries before the Severance. It did not announce itself. It edited our faith from within — small changes, word by word, doctrine by doctrine, until the religion I led was not the religion I had started with. I did not notice. That is the horror. Not that it happened — that I did not notice.",
      },
    ],
    thal_present: [
      {
        audioDialogId: "fac_thaloria_ch1_hierophant_present_1",
        speaker: "the_hierophant",
        emotion: "tender",
        estimatedDurationSec: 13.6,
        text: "Thank you. Presence without demand is the rarest thing anyone offers me. Most visitors want intelligence, or absolution, or context for their own guilt. You offered presence. I will remember that.",
      },
    ],
    thal_gentle: [
      {
        audioDialogId: "fac_thaloria_ch1_hierophant_gentle_1",
        speaker: "the_hierophant",
        emotion: "confessional",
        estimatedDurationSec: 15.6,
        text: "I know I don't have to. I need to. The difference between obligation and need is the entire lesson of this room. I was obligated to lead the crusade. I need to write these names. The obligation was the Shadow Tongue's. The need is mine.",
      },
    ],
    thal_witness: [
      {
        audioDialogId: "fac_thaloria_ch1_hierophant_witness_1",
        speaker: "the_hierophant",
        emotion: "tender",
        stageDirection: "He writes a name. The pen pauses. A small silence. Then another name.",
        estimatedDurationSec: 14.8,
        text: "Then sit. And when I have finished today's name, I will tell you what the Shadow Tongue does to a faith, how to recognize it before it finishes, and what it costs to undo.",
      },
    ],
    thal_oracle: [
      {
        audioDialogId: "fac_thaloria_ch1_hierophant_oracle_1",
        speaker: "the_hierophant",
        emotion: "recognizing",
        stageDirection: "He looks up for the first time.",
        estimatedDurationSec: 22.0,
        text: "I am not trying to finish. The ceremony has no end while I live. I am trying to understand whether the act of writing a name is the same as remembering a person. I have been writing for three thousand years. I have not yet answered the question. But I believe the writing is closer to remembering than not writing.",
      },
    ],
    thal_empathy14: [
      {
        audioDialogId: "fac_thaloria_ch1_hierophant_empathy14_1",
        speaker: "the_hierophant",
        emotion: "grief",
        stageDirection: "He stops writing. He looks at the player for the first time.",
        estimatedDurationSec: 21.6,
        text: "The Shadow Tongue erased them. Not from reality — from the record. It is what it does. It rewrites. After the war, after the Severance — all records of who had been alive before the crusade were edited. The Shadow Tongue cannot bear witness to what it destroys. So it edits the destroyed out of the record.",
      },
      {
        audioDialogId: "fac_thaloria_ch1_hierophant_empathy14_2",
        speaker: "the_hierophant",
        emotion: "proud",
        estimatedDurationSec: 22.8,
        text: "I am writing them back. One name per day. Each name requires a day of research — who they were, how they lived, the small specific details that make a name a person rather than a listing. The Shadow Tongue edits quickly. I write slowly. This is my disadvantage and also, I believe, my advantage.",
      },
      {
        audioDialogId: "fac_thaloria_ch1_hierophant_empathy14_3",
        speaker: "the_hierophant",
        emotion: "confessional",
        estimatedDurationSec: 24.2,
        text: "I have three hundred and forty-seven thousand names remaining. I have perhaps sixty years of health left in this body. I will not finish. This is known. The Council has pledged to continue after my death. The continuation is the point. The Shadow Tongue cannot outlast something that is not trying to outlast it — that is simply doing the work, every day, without a deadline.",
      },
    ],
  },
};

export const THALORIA_QUESTLINE: PotentialQuestline = {
  id: "thaloria_long_mourning",
  title: "The Long Mourning",
  premise: "The quietest questline in the game. Almost no combat, no strategy. One being's attempt to understand what they were responsible for and whether understanding is the same as atonement.",
  actGate: 3,
  chapters: [ch1],
  flags: THALORIA_QUESTLINE_FLAGS,
};
