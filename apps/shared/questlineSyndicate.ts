/* Syndicate of Death Questline — The Word and the Silence (spec §6) */
import type { PotentialQuestline, PotentialQuestlineChapter } from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

export const SYNDICATE_QUESTLINE_FLAGS = [
  "syndicate_first_contact", "syndicate_7omega_copies_known",
  "syndicate_missing_imprint_known",
] as const;

const wheel: WheelOption[] = [
  { id: "syn_alarmed", segment: "aggressive", rarity: "common", label: "ALARMED", fullText: "What am I carrying?", outcome: { npcTrustDelta: { npcId: "the_word", delta: 1 } } },
  { id: "syn_cool", segment: "machine", rarity: "common", label: "COOL", fullText: "I'm listening. What do you want?", outcome: { npcTrustDelta: { npcId: "the_word", delta: 3 } } },
  { id: "syn_suspicious", segment: "aggressive", rarity: "common", label: "SUSPICIOUS", fullText: "Why would I trust anything the Syndicate tells me?", outcome: { moralityDelta: -1, npcTrustDelta: { npcId: "the_word", delta: 1 } } },
  { id: "syn_direct", segment: "investigate", rarity: "uncommon", label: "DIRECT", fullText: "Name it. Whatever you think I have, name it.", outcome: { npcTrustDelta: { npcId: "the_word", delta: 4 } } },
  { id: "syn_spy", segment: "investigate", rarity: "legendary", label: "SPY: DARK SECTOR DATA", fullText: "The Word and the Silence. Which one of you has the dark sector coordinate data?", outcome: { npcTrustDelta: { npcId: "the_word", delta: 6 }, unlocks: ["syndicate_7omega_copies_known"] }, gateCondition: { requireClass: "spy" } },
  { id: "syn_int10", segment: "skill_check", rarity: "epic", label: "INTEL 10", fullText: "The docking logs were sealed under 7-Omega clearance. How do you have them?", outcome: { npcTrustDelta: { npcId: "the_word", delta: 5 }, unlocks: ["syndicate_7omega_copies_known"] }, gateCondition: { minSkillLevel: { skillId: "intelligence", level: 10 } } },
];

const ch1: PotentialQuestlineChapter = {
  id: "syndicate_ch1_the_word_and_silence",
  completionFlag: "syndicate_first_contact",
  title: "The Word and the Silence",
  hook: "Two identical beings in silver suits on the Comms Array. They speak in alternating sentences so smoothly it sounds like one voice.",
  sectorId: "new_babylon_core",
  opener: [
    { speaker: "the_word", text: "Ark 1047. We know your ship's designation from the docking logs." },
    { speaker: "the_silence", text: "We know your ship's history from the theft records." },
    { speaker: "the_word", text: "We know what's in your cryo fluid from the Warlord's production documents." },
    { speaker: "the_silence", text: "We are not here to threaten you with what we know." },
    { speaker: "the_word", stageDirection: "Together:", text: "We are here because we were in New Babylon when the first wave was there, and we lost something, and we believe you are currently carrying it without knowing." },
  ],
  wheel,
  followups: {
    syn_alarmed: [
      { speaker: "the_word", text: "A memory imprint." },
      { speaker: "the_silence", text: "One of our operatives." },
      { speaker: "the_word", text: "Died in the battle." },
      { speaker: "the_silence", text: "The imprint survived." },
      { speaker: "the_word", text: "It was loaded onto your Ark during the theft — when Kael took the ship." },
      { speaker: "the_silence", text: "It has been running in the substrate layer since." },
      { speaker: "the_word", text: "The Human knows about it." },
      { speaker: "the_silence", text: "He has been protecting it." },
    ],
    syn_cool: [
      { speaker: "the_word", text: "We want the memory imprint of our operative." },
      { speaker: "the_silence", text: "In exchange, we offer the 7-Omega records." },
      { speaker: "the_word", text: "The full account of what happened in New Babylon." },
      { speaker: "the_silence", text: "Unredacted. Unedited." },
      { speaker: "the_word", text: "The Authority's silence is ours." },
      { speaker: "the_silence", text: "We could open it." },
      { speaker: "the_word", stageDirection: "Together:", text: "We are waiting for someone worth opening it for." },
    ],
    syn_suspicious: [
      { speaker: "the_word", text: "You should not trust us." },
      { speaker: "the_silence", text: "Trust is for allies." },
      { speaker: "the_word", text: "We are not your allies." },
      { speaker: "the_silence", text: "We are traders." },
      { speaker: "the_word", text: "Traders do not require trust." },
      { speaker: "the_silence", text: "They require fair exchange." },
      { speaker: "the_word", stageDirection: "Together:", text: "We say what we want. We say what we give. We do not add conditions after the fact. In a galaxy full of agendas, this makes us oddly reliable." },
    ],
    syn_direct: [
      { speaker: "the_word", text: "A Syndicate operative's memory imprint." },
      { speaker: "the_silence", text: "Loaded during Kael's theft." },
      { speaker: "the_word", text: "Running in your substrate." },
      { speaker: "the_silence", text: "The Human has been shielding it." },
      { speaker: "the_word", stageDirection: "Together:", text: "Find it. Give it to us. We give you the full 7-Omega records in exchange. Fair trade." },
    ],
    syn_spy: [
      { speaker: "the_word", stageDirection: "The faintest pause — recognition.", text: "7-Omega clearance was sealed by the Authority." },
      { speaker: "the_silence", text: "We sealed it for them. As part of a service agreement." },
      { speaker: "the_word", text: "The copies we kept are ours." },
      { speaker: "the_silence", stageDirection: "Together:", text: "New Babylon's official silence is not the Authority's silence. It is ours. We could open it. We have not. We are waiting for someone worth opening it for." },
    ],
    syn_int10: [
      { speaker: "the_word", text: "7-Omega clearance was sealed by the Authority." },
      { speaker: "the_silence", text: "We sealed it for them. As part of a service agreement." },
      { speaker: "the_word", text: "The Authority asked us to handle certain records after the battle." },
      { speaker: "the_silence", text: "We charged them appropriately." },
      { speaker: "the_word", text: "They paid." },
      { speaker: "the_silence", text: "The copies we kept are ours." },
    ],
  },
};

export const SYNDICATE_QUESTLINE: PotentialQuestline = {
  id: "syndicate_the_fair_trade",
  title: "The Fair Trade",
  premise: "The Syndicate of Death is the most formidable criminal empire in the galaxy. Their transactions are fair in a way political factions rarely are. They say what they want. They say what they give. They do not add conditions.",
  actGate: 2,
  chapters: [ch1],
  flags: SYNDICATE_QUESTLINE_FLAGS,
};
