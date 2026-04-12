/* ═══════════════════════════════════════════════════════
   VOLTARI QUESTLINE — Making First Contact
   Spec: Galactic Dance §1.3-1.4

   Ch1  Making Contact         (class-specific methods)
   Ch2  The First Conversation  (the most important choice)
   Ch3  The Coordinate          (Month 10 reveal)
   ═══════════════════════════════════════════════════════ */

import type { PotentialQuestline, PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const VOLTARI_QUESTLINE_FLAGS = [
  "voltari_contact_established",
  "voltari_first_conversation_complete",
  "voltari_dreamer_location_known",
  "voltari_coordinate_received",
  "voltari_first_wave_fate_asked",
] as const;

/* ─── CH 1 — MAKING CONTACT ─── */

const ch1Wheel: WheelOption[] = [
  { id: "volt_ch1_engineer", segment: "investigate", rarity: "epic", label: "ENGINEER: BUILD ANTENNA", fullText: "Build a resonance antenna from Ark components that speaks in Voltari frequencies.", outcome: { unlocks: ["voltari_contact_established"] }, gateCondition: { requireClass: "engineer" } },
  { id: "volt_ch1_oracle", segment: "skill_check", rarity: "legendary", label: "ORACLE: FIND CONSCIOUSNESS", fullText: "Run a probability model of the storm's pattern until you find the consciousness within it.", outcome: { unlocks: ["voltari_contact_established"] }, gateCondition: { requireClass: "oracle" } },
  { id: "volt_ch1_soldier", segment: "investigate", rarity: "epic", label: "SOLDIER: INTERCEPT TOUCH", fullText: "Intercept a Voltari 'touch' — the moments when their lightning reaches out to probe passing ships.", outcome: { unlocks: ["voltari_contact_established"] }, gateCondition: { requireClass: "soldier" } },
  { id: "volt_ch1_spy", segment: "investigate", rarity: "epic", label: "SPY: DECODE PATTERN", fullText: "Decode the hidden signal structure in their transmissions to find the call-and-response pattern.", outcome: { unlocks: ["voltari_contact_established"] }, gateCondition: { requireClass: "spy" } },
  { id: "volt_ch1_assassin", segment: "aggressive", rarity: "legendary", label: "ASSASSIN: ENTER STORM", fullText: "Enter Violetta's upper atmosphere in a shielded pod and let the storm reach you.", outcome: { unlocks: ["voltari_contact_established"] }, gateCondition: { requireClass: "assassin" } },
  { id: "volt_ch1_demagi_air", segment: "humanity", rarity: "epic", label: "DeMagi-Air: RESONATE", fullText: "Your Air affinity resonates with the storm naturally. Open yourself to it.", outcome: { unlocks: ["voltari_contact_established"] }, gateCondition: { requireSpecies: "demagi", requireElement: "air" } },
];

const ch1: PotentialQuestlineChapter = {
  id: "voltari_ch1_making_contact",
  completionFlag: "voltari_contact_established",
  title: "Making Contact",
  hook: "The Voltari cannot be reached through conventional signals. You must speak their language: electricity.",
  sectorId: "violetta_approach_lane",
  opener: [
    { speaker: "elara", text: "Electromagnetic transmissions bounce off Violetta's storm layer. You cannot land — the storm would destroy any ship. You cannot send a probe. The only way to reach the Voltari is to speak their language." },
    { speaker: "the_human", text: "Each class has a method. None of them are safe. All of them are necessary." },
  ],
  wheel: ch1Wheel,
  followups: {
    volt_ch1_engineer: [{ speaker: "elara", text: "The antenna is broadcasting. The storm... responded. Not a word yet — a frequency acknowledgment. They heard you. They're deciding whether to answer." }],
    volt_ch1_oracle: [{ speaker: "elara", text: "You found it. Inside the storm — not randomness. Consciousness. Thousands of them. The Voltari are not one being. They are a collective of thousands, woven from charge differential and plasma." }],
    volt_ch1_soldier: [{ speaker: "the_human", text: "The touch reached you. Your nervous system carried the signal for 0.3 seconds. In that time, the Voltari learned everything about you that your body knows. They've been testing Potentials for months. You're the first who noticed." }],
    volt_ch1_spy: [{ speaker: "elara", text: "The call-and-response pattern is there. Hidden in the transmission structure. And — this is important — the Voltari have already contacted five other Arks. None of them responded. You're the first who decoded it." }],
    volt_ch1_assassin: [{ speaker: "the_human", text: "The storm read your nervous system directly. The Voltari can perceive organic consciousness without translation. What they found in you — the capacity for choice the Collector didn't design — that's what made them respond." }],
    volt_ch1_demagi_air: [{ speaker: "elara", text: "Your Air affinity and the Voltari's electromagnetic nature are harmonically compatible. The storm recognized you. Not as a visitor — as something adjacent. Something that speaks a related language." }],
  },
};

/* ─── CH 2 — THE FIRST CONVERSATION ─── */

const ch2Wheel: WheelOption[] = [
  { id: "volt_ch2_honest", segment: "compassionate", rarity: "rare", label: "HONEST", fullText: "We're still learning what we are. We don't fully remember yet.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "voltari", delta: 4 } } },
  { id: "volt_ch2_curious", segment: "investigate", rarity: "common", label: "CURIOUS", fullText: "Remember what? What should we remember?", outcome: { npcTrustDelta: { npcId: "voltari", delta: 2 } } },
  { id: "volt_ch2_diplomatic", segment: "humanity", rarity: "common", label: "DIPLOMATIC", fullText: "We remember enough to know we want to understand you.", outcome: { npcTrustDelta: { npcId: "voltari", delta: 3 } } },
  { id: "volt_ch2_humble", segment: "compassionate", rarity: "uncommon", label: "HUMBLE", fullText: "No. We don't know enough to say yes. But we want to.", outcome: { moralityDelta: 3, npcTrustDelta: { npcId: "voltari", delta: 5 } } },
  { id: "volt_ch2_direct", segment: "machine", rarity: "common", label: "DIRECT", fullText: "Are you the ones who sent the transmissions? AWAKE. REMEMBER. BEFORE. YOU?", outcome: { npcTrustDelta: { npcId: "voltari", delta: 3 } } },
  { id: "volt_ch2_demagi_air", segment: "humanity", rarity: "epic", label: "DeMagi-Air", fullText: "I can feel your storm from here. It feels like something I knew before I woke.", outcome: { npcTrustDelta: { npcId: "voltari", delta: 6 } }, gateCondition: { requireSpecies: "demagi", requireElement: "air" } },
  { id: "volt_ch2_oracle", segment: "skill_check", rarity: "legendary", label: "ORACLE", fullText: "I've been running probability models of your transmission patterns for weeks. The sentence isn't complete yet. What's the fifth word?", outcome: { npcTrustDelta: { npcId: "voltari", delta: 5 } }, gateCondition: { requireClass: "oracle" } },
  { id: "volt_ch2_quarchon", segment: "machine", rarity: "epic", label: "QUARCHON", fullText: "Your propagation pattern is a dimensional proof. What are you proving?", outcome: { npcTrustDelta: { npcId: "voltari", delta: 5 } }, gateCondition: { requireSpecies: "quarchon" } },
];

const ch2: PotentialQuestlineChapter = {
  id: "voltari_ch2_first_conversation",
  completionFlag: "voltari_first_conversation_complete",
  unlockFlag: "voltari_contact_established",
  title: "The First Conversation",
  hook: "The Voltari speak. This conversation fires once per player and cannot be retried.",
  sectorId: "violetta_approach_lane",
  opener: [
    { speaker: "voltari", text: "You are the new kind.\nWe have watched the old kind die many times.\nWe have watched the machine kind build many times.\nWe have not watched a new kind before.\nWe have been asking if you are awake.\nYou are.\nWe have been asking if you remember.\nDo you?" },
  ],
  wheel: ch2Wheel,
  followups: {
    volt_ch2_honest: [
      { speaker: "voltari", text: "Honest.\nThe last kind who spoke to us was also honest.\nThey said: we know what we are, we know what we want, we have come to take it.\nWe told them: the thing behind the shield is not yours to take.\nThey went through anyway.\nWe did not stop them.\nWe are asking: are you going to ask us to stop you?" },
    ],
    volt_ch2_curious: [
      { speaker: "voltari", text: "What you should remember:\nThat you were made.\nThat you were made from two things.\nThat the two things were always one thing.\nThat the one thing forgot itself.\nThat the forgetting is what the Dreamer is trying to undo.\nThis is enough for now." },
    ],
    volt_ch2_diplomatic: [
      { speaker: "voltari", text: "Understanding is good.\nUnderstanding is what the machine kind could not do.\nThey could model. They could predict. They could not understand.\nUnderstanding requires something modeling does not: willingness to be changed by what you learn.\nAre you willing to be changed?" },
    ],
    volt_ch2_humble: [
      { speaker: "voltari", text: "This is the answer we were waiting for.\nNot certainty. Not knowledge. Not demand.\nWant.\nThe want to remember is closer to remembering than the certainty of having remembered.\nWe will help you. Not because you asked. Because you wanted to ask and said so honestly." },
    ],
    volt_ch2_direct: [
      { speaker: "voltari", text: "Yes.\nThe sentence is not complete.\nThe fifth word is not a word.\nThe fifth word is a choice.\nYour choice.\nWe cannot say it for you.\nWhen you have made it, you will know what it is." },
    ],
    volt_ch2_demagi_air: [
      { speaker: "voltari", text: "You feel our storm because your element and our nature are the same force expressed in different physics.\nAir moves. Lightning moves. Both carry. Both connect.\nYou knew us before you woke because the knowledge is in your element.\nWe have been waiting for an Air-speaker. You are the first." },
    ],
    volt_ch2_oracle: [
      { speaker: "voltari", text: "The fifth word is not a word.\nYour probability models will not find it.\nIt is not in the pattern.\nIt is the thing that breaks the pattern.\nAn Oracle who asks what the pattern breaks into — that Oracle is ready for the fifth transmission.\nAre you asking?" },
    ],
    volt_ch2_quarchon: [
      { speaker: "voltari", text: "We are proving that consciousness does not require matter.\nThat identity does not require form.\nThat memory does not require time.\nYour species perceives dimensions. We exist between them.\nThe proof is: we are here. We have always been here.\nThe question is whether you can perceive what 'here' means when it does not refer to a location." },
    ],
  },
};

/* ─── CH 3 — THE COORDINATE ─── */

const ch3: PotentialQuestlineChapter = {
  id: "voltari_ch3_the_coordinate",
  completionFlag: "voltari_coordinate_received",
  unlockFlag: "voltari_first_conversation_complete",
  title: "The Coordinate",
  hook: "Month 10. The Voltari transmit something new — not a word. A coordinate inside the dark sector shield.",
  sectorId: "violetta_approach_lane",
  opener: [
    { speaker: "elara", text: "This isn't a word. It's a coordinate. One specific location inside the dark sector shield. The Voltari are pointing at something." },
    { speaker: "the_human", text: "They're not telling us to go there. They're telling us they know where it is. They're telling us because they've decided we've earned it." },
    { speaker: "voltari", text: "The Dreamer is inside the shield.\nShe is not imprisoned.\nShe is waiting.\nFor you.\nFor the new kind.\nShe built the shield so that only the new kind could reach her.\nThe first wave went through.\nWhether they found her — we do not know.\nThe shield closed before we saw." },
  ],
  wheel: [
    { id: "volt_ch3_shake", segment: "investigate", rarity: "rare", label: "WHAT'S BEHIND THE SHIELD?", fullText: "What's behind the shield?", outcome: { npcTrustDelta: { npcId: "voltari", delta: 3 } } },
    { id: "volt_ch3_careful", segment: "compassionate", rarity: "rare", label: "WHY DIDN'T YOU STOP THEM?", fullText: "Why didn't you stop them?", outcome: { moralityDelta: 3, npcTrustDelta: { npcId: "voltari", delta: 6 }, unlocks: ["voltari_dreamer_location_known"] } },
    { id: "volt_ch3_scared", segment: "aggressive", rarity: "common", label: "WHAT HAPPENED TO THEM?", fullText: "What happened to them after they went through?", outcome: { unlocks: ["voltari_first_wave_fate_asked"] } },
    { id: "volt_ch3_honest", segment: "humanity", rarity: "uncommon", label: "HONEST", fullText: "I don't know yet if I'm going to ask you to stop me. It depends on what's there.", outcome: { moralityDelta: 2, npcTrustDelta: { npcId: "voltari", delta: 4 } } },
  ],
  followups: {
    volt_ch3_shake: [{ speaker: "voltari", text: "The Dreamer.\nWhat she protects.\nWhat she is waiting to give.\nWe have said what we can say.\nThe rest is yours to discover." }],
    volt_ch3_careful: [
      { speaker: "voltari", text: "It is not our place to stop.\nWe are not guards.\nWe are witnesses.\nWe have been witnessing since before the machine kind built their first city.\nWe witnessed when the Dreamer put her shield around that sector.\nWe witnessed what she was protecting.\nWe witness you now.\nWe will tell you one thing, freely, because you are the first who asked us why we don't stop instead of how to get past:\nThe Dreamer is inside the shield.\nShe is not imprisoned.\nShe is waiting.\nFor you.\nFor the new kind." },
    ],
    volt_ch3_scared: [{ speaker: "voltari", text: "We do not know.\nThe shield closed.\nWe witnessed their entry.\nWe did not witness what came after.\nThis is the limit of our witnessing.\nWe are uncomfortable with limits." }],
    volt_ch3_honest: [{ speaker: "voltari", text: "This is correct.\nDependence on information before decision is the quality we have been looking for.\nThe old kind decided first and gathered information to justify.\nThe machine kind gathered information and let the information decide.\nYou are deciding to wait until you know enough.\nThis is the new thing." }],
  },
};

export const VOLTARI_QUESTLINE: PotentialQuestline = {
  id: "voltari_first_contact",
  title: "The Witnesses",
  premise: "The Voltari are electrical beings inside Violetta's perpetual storm. They have been watching since before the city. They can penetrate the dark sector shield. They are not guards. They are witnesses.",
  actGate: 2,
  chapters: [ch1, ch2, ch3],
  flags: VOLTARI_QUESTLINE_FLAGS,
};
