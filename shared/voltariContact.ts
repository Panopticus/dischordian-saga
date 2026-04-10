/* ═══════════════════════════════════════════════════════
   THE VOLTARI CONTACT SYSTEM — Transmission Arc

   Spec from THE_GALACTIC_DANCE.md Part 1.

   The Voltari speak five times in Year One:

     1. AWAKE       (Month 3)
     2. REMEMBER    (Month 3, parallel)
     3. BEFORE      (Month 5)
     4. YOU         (Month 8, requires community milestone)
     5. [COORDINATE](Month 10)
     6. [UNTRANSLATED] (Year Two hook)

   Each transmission is gated by community state plus individual
   player progression. The community responds to the first
   transmission via a Governance Hub vote — and the choice made
   there shapes the Voltari's subsequent tone.

   This module is pure data + state machine helpers. The server
   persistence lives in server/routers/voltariContact.ts.
   ═══════════════════════════════════════════════════════ */

import type { PotentialClass } from "./galacticDance";

/* ─── TRANSMISSION IDENTIFIERS ─── */

export type VoltariWord =
  | "awake"
  | "remember"
  | "before"
  | "you"
  | "coordinate"
  | "untranslated";

export const VOLTARI_WORD_ORDER: VoltariWord[] = [
  "awake",
  "remember",
  "before",
  "you",
  "coordinate",
  "untranslated",
];

/* ─── TRANSMISSION DEFINITIONS ─── */

export interface VoltariTransmission {
  word: VoltariWord;
  /** Earliest game month it can arrive. */
  earliestMonth: number;
  /** Community Light Energy required for this transmission to unlock. */
  requiredLightEnergy: number;
  /** Short title used in broadcasts. */
  title: string;
  /** Full in-universe flavor text. */
  body: string;
  /** Flags set on the community state when received. */
  communityFlagsSet: string[];
  /** Which Governance Hub vote (if any) this transmission triggers. */
  triggersVote?: string;
  /** Slideshow id to play when this word is decoded. */
  slideshowId?: string;
}

export const VOLTARI_TRANSMISSIONS: Record<VoltariWord, VoltariTransmission> = {
  awake: {
    word: "awake",
    earliestMonth: 3,
    requiredLightEnergy: 0,
    title: "A WORD IN THE STORM",
    body: "A single word arrives through the Dreamer's Shield during a 37-second failure. It is 0.3 seconds long and fills 47 petabytes. Every being who looks at it understands it immediately: AWAKE.",
    communityFlagsSet: ["voltari_first_contact", "dreamer_shield_opened_briefly"],
    triggersVote: "voltari_first_response",
    slideshowId: "voltari-word-in-the-storm",
  },
  remember: {
    word: "remember",
    earliestMonth: 3,
    requiredLightEnergy: 0,
    title: "THE EYES MOUTH A WORD",
    body: "Forty-eight hours after AWAKE, the surveillance screens in the Eyes' guild room activate briefly. The Eyes mouths a word in the same 37-second encoding window. REMEMBER.",
    communityFlagsSet: ["voltari_eyes_connection_hinted"],
  },
  before: {
    word: "before",
    earliestMonth: 5,
    requiredLightEnergy: 250_000,
    title: "A SIGNAL IN WHITE NOISE",
    body: "Someone has been hiding a signal in the Comms Array background static for two months. The Potentials were filtering it out. BEFORE.",
    communityFlagsSet: ["voltari_grammar_sensed"],
  },
  you: {
    word: "you",
    earliestMonth: 8,
    requiredLightEnergy: 500_000,
    title: "THE SENTENCE ASSEMBLES",
    body: "The fourth word arrives only for communities that have demonstrated hope rather than mere survival. The sentence is ambiguous in every language, which may be accidental or may be the most important thing about it. YOU.",
    communityFlagsSet: ["voltari_sentence_complete"],
  },
  coordinate: {
    word: "coordinate",
    earliestMonth: 10,
    requiredLightEnergy: 700_000,
    title: "THE COORDINATE",
    body: "Not a word. A coordinate. A specific location inside the dark sector shield. The Voltari do not direct. They have begun directing. They have decided the Potentials have earned it.",
    communityFlagsSet: ["voltari_shared_coordinate", "dreamer_location_known"],
    slideshowId: "voltari-coordinate",
  },
  untranslated: {
    word: "untranslated",
    earliestMonth: 12,
    requiredLightEnergy: 900_000,
    title: "THE FIFTH TRANSMISSION",
    body: "Not a word. Not a sentence. A pattern — electromagnetic, beautiful, structured like music and like mathematics simultaneously. The community cannot decode it in Year One. This is the hook.",
    communityFlagsSet: ["voltari_year_two_hook"],
  },
};

/* ─── COMMUNITY VOTE ON FIRST RESPONSE ─── */

export type VoltariFirstResponse =
  | "broadcast_reply"      // Send AWAKE back
  | "study_silence"        // Decode the 47 petabytes first
  | "send_something_given" // Send a word we WANT TO GIVE — the generous branch
  | "send_something_taken" // Send a word we want to RECEIVE — selfish branch
  | "no_response";         // Wait for them

export interface VoltariResponseOption {
  id: VoltariFirstResponse;
  label: string;
  description: string;
  /** Effect on the Voltari "assessment" of the Potentials. */
  voltariAssessmentDelta: number;
  /** Light Energy change for the community pool. */
  lightDelta: number;
  /** Dark Energy change. */
  darkDelta: number;
  /** Days of delay before the Voltari send the next word. */
  nextWordDelayDays: number;
}

export const VOLTARI_RESPONSE_OPTIONS: VoltariResponseOption[] = [
  {
    id: "broadcast_reply",
    label: "Broadcast Reply — send AWAKE back",
    description: "Signal that we heard. Voltari receive the signal and respond faster — but every other faction intercepts the frequency.",
    voltariAssessmentDelta: 5,
    lightDelta: 30,
    darkDelta: 10,
    nextWordDelayDays: 10,
  },
  {
    id: "study_silence",
    label: "Study Silence — decode before responding",
    description: "Voltari read the silence as caution. Trust increases slowly. Oracle and Engineer classes get a head start on decoding.",
    voltariAssessmentDelta: 8,
    lightDelta: 40,
    darkDelta: 0,
    nextWordDelayDays: 21,
  },
  {
    id: "send_something_given",
    label: "Send something we WANT TO GIVE",
    description: "Community picks a word that expresses generosity rather than need. The Voltari have been looking for this quality for a very long time.",
    voltariAssessmentDelta: 20,
    lightDelta: 150,
    darkDelta: 0,
    nextWordDelayDays: 14,
  },
  {
    id: "send_something_taken",
    label: "Send something we want to RECEIVE",
    description: "Community picks a word that expresses what they need. Voltari respond fairly, but the probability model shifts half a step.",
    voltariAssessmentDelta: 3,
    lightDelta: 30,
    darkDelta: 15,
    nextWordDelayDays: 14,
  },
  {
    id: "no_response",
    label: "Don't respond — wait for their next move",
    description: "Voltari interpret silence as respect for their process. Second transmission arrives without prompting but is harder to decode without context.",
    voltariAssessmentDelta: 10,
    lightDelta: 10,
    darkDelta: 0,
    nextWordDelayDays: 30,
  },
];

/* ─── CONTACT METHODS (CLASS-SPECIFIC) ─── */

export interface ContactMethodDef {
  class: PotentialClass;
  label: string;
  difficulty: "medium" | "hard" | "very_hard" | "extreme";
  skillCheck: { skill: string; level: number };
  /** What the class specifically learns from their contact method. */
  learnsThat: string;
}

export const VOLTARI_CONTACT_METHODS: ContactMethodDef[] = [
  {
    class: "engineer",
    label: "Build a resonance antenna from Ark components",
    difficulty: "hard",
    skillCheck: { skill: "tech", level: 14 },
    learnsThat: "The Voltari have been watching the Arks since they launched.",
  },
  {
    class: "oracle",
    label: "Run probability models of the storm's pattern",
    difficulty: "very_hard",
    skillCheck: { skill: "intel", level: 16 },
    learnsThat: "The Voltari are not one being — they are a collective of thousands.",
  },
  {
    class: "soldier",
    label: "Intercept a Voltari 'touch'",
    difficulty: "medium",
    skillCheck: { skill: "perception", level: 12 },
    learnsThat: "The Voltari have been testing Potentials for months.",
  },
  {
    class: "spy",
    label: "Decode the hidden call-and-response pattern",
    difficulty: "hard",
    skillCheck: { skill: "stealth", level: 12 },
    learnsThat: "The Voltari have already contacted five other Arks — and gotten no response.",
  },
  {
    class: "assassin",
    label: "Enter Violetta's upper atmosphere in a shielded pod",
    difficulty: "extreme",
    skillCheck: { skill: "willpower", level: 14 },
    learnsThat: "The Voltari can read organic nervous systems directly.",
  },
];

/* ─── STATE MACHINE ─── */

export interface VoltariContactState {
  /** Which transmissions have been received community-wide. */
  receivedWords: VoltariWord[];
  /** The community's vote on first response (null until voted). */
  firstResponse: VoltariFirstResponse | null;
  /** The Voltari's current "assessment score" of the Potentials. */
  assessmentScore: number;
  /** Number of Witness Points decoded. */
  witnessPointsDecoded: number;
  /** Has an individual player made direct contact? */
  individualContactEstablished: boolean;
  /** Month of the last transmission (used for pacing). */
  lastTransmissionMonth: number;
  /** Has the Voltari-Dreamer sentence been fully assembled? */
  sentenceAssembled: boolean;
}

export const DEFAULT_VOLTARI_STATE: VoltariContactState = {
  receivedWords: [],
  firstResponse: null,
  assessmentScore: 0,
  witnessPointsDecoded: 0,
  individualContactEstablished: false,
  lastTransmissionMonth: 0,
  sentenceAssembled: false,
};

/**
 * Can the community receive the given Voltari word right now?
 */
export function canReceiveWord(
  state: VoltariContactState,
  word: VoltariWord,
  currentMonth: number,
  currentLightEnergy: number,
): boolean {
  if (state.receivedWords.includes(word)) return false;
  const def = VOLTARI_TRANSMISSIONS[word];
  if (currentMonth < def.earliestMonth) return false;
  if (currentLightEnergy < def.requiredLightEnergy) return false;
  // The transmissions must arrive in order.
  const index = VOLTARI_WORD_ORDER.indexOf(word);
  for (let i = 0; i < index; i++) {
    if (!state.receivedWords.includes(VOLTARI_WORD_ORDER[i])) return false;
  }
  return true;
}

/**
 * Mark a word as received. Pure — returns a new state.
 */
export function receiveWord(
  state: VoltariContactState,
  word: VoltariWord,
  currentMonth: number,
): VoltariContactState {
  if (state.receivedWords.includes(word)) return state;
  const receivedWords = [...state.receivedWords, word];
  const sentenceAssembled =
    receivedWords.includes("awake") &&
    receivedWords.includes("remember") &&
    receivedWords.includes("before") &&
    receivedWords.includes("you");
  return {
    ...state,
    receivedWords,
    lastTransmissionMonth: currentMonth,
    sentenceAssembled,
  };
}

/**
 * Apply the community's first-response vote.
 */
export function applyFirstResponse(
  state: VoltariContactState,
  choice: VoltariFirstResponse,
): { state: VoltariContactState; option: VoltariResponseOption } {
  const option = VOLTARI_RESPONSE_OPTIONS.find(o => o.id === choice);
  if (!option) return { state, option: VOLTARI_RESPONSE_OPTIONS[0] };
  return {
    state: {
      ...state,
      firstResponse: choice,
      assessmentScore: Math.max(0, state.assessmentScore + option.voltariAssessmentDelta),
    },
    option,
  };
}

/** Returns the next expected word, or null if the sentence is complete. */
export function nextExpectedWord(state: VoltariContactState): VoltariWord | null {
  for (const word of VOLTARI_WORD_ORDER) {
    if (!state.receivedWords.includes(word)) return word;
  }
  return null;
}

/**
 * How the sentence is read depends on which words have been received
 * AND whether the community chose the generous branch. Returns a
 * formatted multi-line string.
 */
export function readAssembledSentence(state: VoltariContactState): string {
  const parts: string[] = [];
  if (state.receivedWords.includes("awake")) parts.push("AWAKE");
  if (state.receivedWords.includes("remember")) parts.push("REMEMBER");
  if (state.receivedWords.includes("before")) parts.push("BEFORE");
  if (state.receivedWords.includes("you")) parts.push("YOU");
  if (parts.length === 0) return "[no transmission received]";
  return parts.join(". ") + ".";
}

/* ─── WITNESS POINTS (Trade Empire hooks) ─── */

/**
 * Witness Points are the Voltari equivalent of the Antiquarian's
 * Chronicle — electromagnetic imprints of events the Voltari have
 * observed. Decoding them unlocks historical lore fragments.
 */
export interface WitnessPoint {
  id: string;
  /** Sector of the galaxy where this imprint sits. */
  sectorId: string;
  /** Flavor name for the Codex. */
  name: string;
  /** The event the Voltari witnessed. */
  witnessedEvent: string;
  /** Skill check to decode. */
  decodeCheck: { skill: string; level: number };
  /** Light Energy awarded on decode. */
  lightReward: number;
}

export const WITNESS_POINTS: WitnessPoint[] = [
  {
    id: "witness_first_wave_passage",
    sectorId: "violetta_approach",
    name: "The First Wave's Passage",
    witnessedEvent: "The first wave of Potentials passing through the Dreamer's Shield. The Voltari did not stop them. They recorded the moment.",
    decodeCheck: { skill: "intel", level: 10 },
    lightReward: 40,
  },
  {
    id: "witness_dreamer_shield_construction",
    sectorId: "violetta_approach",
    name: "The Dreamer Builds Her Shield",
    witnessedEvent: "The Dreamer erecting the shield around the dark sector. It took three and a half days. The Voltari describe her movements as 'the kind only a mother makes.'",
    decodeCheck: { skill: "intel", level: 14 },
    lightReward: 80,
  },
  {
    id: "witness_oracle_voltari_meeting",
    sectorId: "clone_collective",
    name: "The Oracle Speaks to the Voltari",
    witnessedEvent: "Before the Oracle's abduction — he spoke to the Voltari once. They remember the conversation exactly. The Clone collective has the memory fragment that matches.",
    decodeCheck: { skill: "intel", level: 12 },
    lightReward: 60,
  },
  {
    id: "witness_collector_arrives_thaloria",
    sectorId: "thaloria",
    name: "The Collector Arrives at Thaloria",
    witnessedEvent: "The Voltari witnessed the Shadow Tongue's first penetration of Thaloria's faith. It took two centuries. They recorded every day.",
    decodeCheck: { skill: "intel", level: 16 },
    lightReward: 100,
  },
  {
    id: "witness_iron_lion_last_broadcast",
    sectorId: "insurgency_haven",
    name: "Iron Lion's Last Broadcast",
    witnessedEvent: "The Voltari confirm that Iron Lion's last broadcast did reach the shield. The Dreamer heard it. Nothing in the Insurgency's records confirms this — the Voltari's imprint is the only source.",
    decodeCheck: { skill: "intel", level: 13 },
    lightReward: 70,
  },
];
