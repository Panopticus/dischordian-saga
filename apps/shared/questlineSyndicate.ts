/* Syndicate of Death Questline — The Word and the Silence (spec §6)
   VO metadata added — every beat is studio-pipeline ready. */
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
    { audioDialogId: "fac_syndicate_ch1_word_opener_1", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 4.4, text: "Ark 1047. We know your ship's designation from the docking logs." },
    { audioDialogId: "fac_syndicate_ch1_silence_opener_1", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 3.8, text: "We know your ship's history from the theft records." },
    { audioDialogId: "fac_syndicate_ch1_word_opener_2", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 5.4, text: "We know what's in your cryo fluid from the Warlord's production documents." },
    { audioDialogId: "fac_syndicate_ch1_silence_opener_2", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 4.6, text: "We are not here to threaten you with what we know." },
    { audioDialogId: "fac_syndicate_ch1_together_opener_1", speaker: "the_word", emotion: "confessional", proximity: 0.85, stageDirection: "Together:", estimatedDurationSec: 13.2, text: "We are here because we were in New Babylon when the first wave was there, and we lost something, and we believe you are currently carrying it without knowing." },
  ],
  wheel,
  followups: {
    syn_alarmed: [
      { audioDialogId: "fac_syndicate_ch1_word_alarmed_1", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 2.0, text: "A memory imprint." },
      { audioDialogId: "fac_syndicate_ch1_silence_alarmed_1", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 2.2, text: "One of our operatives." },
      { audioDialogId: "fac_syndicate_ch1_word_alarmed_2", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 2.0, text: "Died in the battle." },
      { audioDialogId: "fac_syndicate_ch1_silence_alarmed_2", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 2.2, text: "The imprint survived." },
      { audioDialogId: "fac_syndicate_ch1_word_alarmed_3", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 5.4, text: "It was loaded onto your Ark during the theft — when Kael took the ship." },
      { audioDialogId: "fac_syndicate_ch1_silence_alarmed_3", speaker: "the_silence", emotion: "melancholy", proximity: 0.85, estimatedDurationSec: 4.0, text: "It has been running in the substrate layer since." },
      { audioDialogId: "fac_syndicate_ch1_word_alarmed_4", speaker: "the_word", emotion: "melancholy", proximity: 0.85, estimatedDurationSec: 3.2, text: "The Human knows about it." },
      { audioDialogId: "fac_syndicate_ch1_silence_alarmed_4", speaker: "the_silence", emotion: "melancholy", proximity: 0.85, estimatedDurationSec: 3.6, text: "He has been protecting it." },
    ],
    syn_cool: [
      { audioDialogId: "fac_syndicate_ch1_word_cool_1", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 4.8, text: "We want the memory imprint of our operative." },
      { audioDialogId: "fac_syndicate_ch1_silence_cool_1", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 5.0, text: "In exchange, we offer the 7-Omega records." },
      { audioDialogId: "fac_syndicate_ch1_word_cool_2", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 5.0, text: "The full account of what happened in New Babylon." },
      { audioDialogId: "fac_syndicate_ch1_silence_cool_2", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 3.2, text: "Unredacted. Unedited." },
      { audioDialogId: "fac_syndicate_ch1_word_cool_3", speaker: "the_word", emotion: "proud", proximity: 0.85, estimatedDurationSec: 4.2, text: "The Authority's silence is ours." },
      { audioDialogId: "fac_syndicate_ch1_silence_cool_3", speaker: "the_silence", emotion: "proud", proximity: 0.85, estimatedDurationSec: 2.4, text: "We could open it." },
      { audioDialogId: "fac_syndicate_ch1_together_cool_1", speaker: "the_word", emotion: "confessional", proximity: 0.85, stageDirection: "Together:", estimatedDurationSec: 5.2, text: "We are waiting for someone worth opening it for." },
    ],
    syn_suspicious: [
      { audioDialogId: "fac_syndicate_ch1_word_suspicious_1", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 3.2, text: "You should not trust us." },
      { audioDialogId: "fac_syndicate_ch1_silence_suspicious_1", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 2.4, text: "Trust is for allies." },
      { audioDialogId: "fac_syndicate_ch1_word_suspicious_2", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 2.6, text: "We are not your allies." },
      { audioDialogId: "fac_syndicate_ch1_silence_suspicious_2", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 2.0, text: "We are traders." },
      { audioDialogId: "fac_syndicate_ch1_word_suspicious_3", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 3.0, text: "Traders do not require trust." },
      { audioDialogId: "fac_syndicate_ch1_silence_suspicious_3", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 3.0, text: "They require fair exchange." },
      { audioDialogId: "fac_syndicate_ch1_together_suspicious_1", speaker: "the_word", emotion: "proud", proximity: 0.85, stageDirection: "Together:", estimatedDurationSec: 13.2, text: "We say what we want. We say what we give. We do not add conditions after the fact. In a galaxy full of agendas, this makes us oddly reliable." },
    ],
    syn_direct: [
      { audioDialogId: "fac_syndicate_ch1_word_direct_1", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 4.4, text: "A Syndicate operative's memory imprint." },
      { audioDialogId: "fac_syndicate_ch1_silence_direct_1", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 3.2, text: "Loaded during Kael's theft." },
      { audioDialogId: "fac_syndicate_ch1_word_direct_2", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 3.2, text: "Running in your substrate." },
      { audioDialogId: "fac_syndicate_ch1_silence_direct_2", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 3.6, text: "The Human has been shielding it." },
      { audioDialogId: "fac_syndicate_ch1_together_direct_1", speaker: "the_word", emotion: "confessional", proximity: 0.85, stageDirection: "Together:", estimatedDurationSec: 9.6, text: "Find it. Give it to us. We give you the full 7-Omega records in exchange. Fair trade." },
    ],
    syn_spy: [
      { audioDialogId: "fac_syndicate_ch1_word_spy_1", speaker: "the_word", emotion: "recognizing", proximity: 0.85, stageDirection: "The faintest pause — recognition.", estimatedDurationSec: 4.8, text: "7-Omega clearance was sealed by the Authority." },
      { audioDialogId: "fac_syndicate_ch1_silence_spy_1", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 5.4, text: "We sealed it for them. As part of a service agreement." },
      { audioDialogId: "fac_syndicate_ch1_word_spy_2", speaker: "the_word", emotion: "proud", proximity: 0.85, estimatedDurationSec: 3.4, text: "The copies we kept are ours." },
      { audioDialogId: "fac_syndicate_ch1_together_spy_1", speaker: "the_silence", emotion: "confessional", proximity: 0.85, stageDirection: "Together:", estimatedDurationSec: 13.2, text: "New Babylon's official silence is not the Authority's silence. It is ours. We could open it. We have not. We are waiting for someone worth opening it for." },
    ],
    syn_int10: [
      { audioDialogId: "fac_syndicate_ch1_word_int10_1", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 4.8, text: "7-Omega clearance was sealed by the Authority." },
      { audioDialogId: "fac_syndicate_ch1_silence_int10_1", speaker: "the_silence", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 5.4, text: "We sealed it for them. As part of a service agreement." },
      { audioDialogId: "fac_syndicate_ch1_word_int10_2", speaker: "the_word", emotion: "intimate", proximity: 0.85, estimatedDurationSec: 5.0, text: "The Authority asked us to handle certain records after the battle." },
      { audioDialogId: "fac_syndicate_ch1_silence_int10_2", speaker: "the_silence", emotion: "wry", proximity: 0.85, estimatedDurationSec: 2.8, text: "We charged them appropriately." },
      { audioDialogId: "fac_syndicate_ch1_word_int10_3", speaker: "the_word", emotion: "wry", proximity: 0.85, estimatedDurationSec: 1.6, text: "They paid." },
      { audioDialogId: "fac_syndicate_ch1_silence_int10_3", speaker: "the_silence", emotion: "proud", proximity: 0.85, estimatedDurationSec: 3.4, text: "The copies we kept are ours." },
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
