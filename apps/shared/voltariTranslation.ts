/* ═══════════════════════════════════════════════════════
   THE VOLTARI TRANSLATION PROJECT

   Community-driven first contact with an alien species.
   The Voltari are electrical life on Violetta — a purple
   planet inside a living storm. They've been broadcasting
   for millennia. Nobody could decode it.

   Until now.


   MECHANICS:
   1. The community collaboratively decodes signal patterns
   2. Patterns unlock vocabulary words one at a time
   3. Vocabulary enables greetings → questions → trades → treaty
   4. Each player contributes pattern observations
   5. Breakthrough moments unlock for ALL players simultaneously

   Players can't rush this. It takes COMMUNITY effort.
   This is not a personal quest. It's a civilizational achievement.
   ═══════════════════════════════════════════════════════ */

/* ─── TRANSLATION PROGRESS (server-state) ─── */

export interface TranslationState {
  /** Total patterns observed across community */
  patternsObserved: number;
  /** Confirmed vocabulary words (unlocked for everyone) */
  confirmedVocabulary: string[];
  /** Currently being decoded */
  activePuzzle: TranslationPuzzle | null;
  /** Diplomatic stage reached */
  diplomaticStage: DiplomaticStage;
  /** Trade relationship status */
  tradeUnlocked: boolean;
  /** Player contribution leaderboard */
  topContributors: { playerId: number; patterns: number; breakthroughs: number }[];
}

export type DiplomaticStage =
  | "silence"           // 0% — no contact
  | "awareness"         // 10% — they've noticed us
  | "greeting"          // 25% — basic pleasantries exchanged
  | "conversation"      // 50% — structured dialogue possible
  | "negotiation"       // 75% — can discuss specifics
  | "alliance"          // 100% — treaty achievable
  | "trading";          // ongoing — active trade partner

/* ─── THE VOLTARI LANGUAGE ─── */

/**
 * Voltari don't have nouns. Every concept is a VERB + RELATIONSHIP.
 *
 * Example: "tree" doesn't exist. They say "{grow}→{upward}→{together}"
 *          "fear" doesn't exist. They say "{anticipate}→{separation}→{without-agreement}"
 */
export interface VoltariWord {
  id: string;
  /** Human approximation of the meaning */
  meaning: string;
  /** The pattern that encodes it (visual representation) */
  pattern: string;
  /** What humans usually translate it AS (inaccurate but useful) */
  approximation: string;
  /** True meaning (usually unlocked later) */
  trueMeaning: string;
  /** Community effort required to decode */
  decodingDifficulty: 1 | 2 | 3 | 4 | 5;
  /** Unlock order */
  order: number;
}

export const VOLTARI_VOCABULARY: VoltariWord[] = [
  { id: "greet", order: 1, meaning: "greeting", pattern: "↻↯↻", approximation: "hello",
    trueMeaning: "acknowledge-presence-without-threat", decodingDifficulty: 1 },
  { id: "self", order: 2, meaning: "self", pattern: "◉", approximation: "I/we",
    trueMeaning: "one-charge-thinking-now", decodingDifficulty: 1 },
  { id: "other", order: 3, meaning: "other", pattern: "◎", approximation: "you/they",
    trueMeaning: "charge-not-us-but-also-thinking", decodingDifficulty: 1 },
  { id: "question", order: 4, meaning: "question", pattern: "⊙?", approximation: "?",
    trueMeaning: "seek-pattern-where-none-exists-yet", decodingDifficulty: 2 },
  { id: "yes", order: 5, meaning: "affirmation", pattern: "≋", approximation: "yes",
    trueMeaning: "pattern-matches-our-understanding", decodingDifficulty: 2 },
  { id: "no", order: 6, meaning: "negation", pattern: "⤬", approximation: "no",
    trueMeaning: "pattern-conflicts-with-truth", decodingDifficulty: 2 },
  { id: "seek", order: 7, meaning: "seek/want", pattern: "→○", approximation: "want",
    trueMeaning: "move-toward-uncompleted-pattern", decodingDifficulty: 2 },
  { id: "exchange", order: 8, meaning: "exchange/trade", pattern: "⇄", approximation: "trade",
    trueMeaning: "move-pattern-through-agreement", decodingDifficulty: 3 },
  { id: "time", order: 9, meaning: "time", pattern: "∞≋", approximation: "time",
    trueMeaning: "pattern-of-patterns-in-order", decodingDifficulty: 3 },
  { id: "danger", order: 10, meaning: "danger", pattern: "⚠↯", approximation: "danger",
    trueMeaning: "pattern-that-ends-patterns", decodingDifficulty: 3 },
  { id: "peace", order: 11, meaning: "peace", pattern: "≋⊙≋", approximation: "peace",
    trueMeaning: "patterns-not-ending-each-other", decodingDifficulty: 3 },
  { id: "gift", order: 12, meaning: "gift", pattern: "⇝◇", approximation: "gift",
    trueMeaning: "pattern-given-without-exchange-expected", decodingDifficulty: 3 },
  { id: "history", order: 13, meaning: "history/memory", pattern: "∞↻", approximation: "history",
    trueMeaning: "patterns-that-we-remain-with", decodingDifficulty: 4 },
  { id: "loss", order: 14, meaning: "loss/extinction", pattern: "⊗", approximation: "death",
    trueMeaning: "pattern-becoming-no-pattern", decodingDifficulty: 4 },
  { id: "virus", order: 15, meaning: "the Thought Virus", pattern: "⚠⊗∞", approximation: "virus",
    trueMeaning: "pattern-that-eats-patterns-forever", decodingDifficulty: 4 },
  { id: "hide", order: 16, meaning: "hide/secret", pattern: "◉≋⊙", approximation: "hidden",
    trueMeaning: "our-patterns-unseen-by-danger", decodingDifficulty: 4 },
  { id: "alliance", order: 17, meaning: "alliance", pattern: "◉⇄◎≋∞", approximation: "alliance",
    trueMeaning: "our-patterns-and-your-patterns-synchronized-across-time", decodingDifficulty: 5 },
  { id: "name", order: 18, meaning: "name/identity", pattern: "◉∞", approximation: "name",
    trueMeaning: "pattern-of-self-maintained-across-time", decodingDifficulty: 5 },
  { id: "why", order: 19, meaning: "why", pattern: "⊙↻?", approximation: "why",
    trueMeaning: "seek-the-pattern-that-created-this-pattern", decodingDifficulty: 5 },
  { id: "choose", order: 20, meaning: "choose/will", pattern: "◉→≋", approximation: "choose",
    trueMeaning: "self-decides-which-pattern-to-become", decodingDifficulty: 5 },
];

/* ─── TRANSLATION PUZZLE (per word) ─── */

export interface TranslationPuzzle {
  id: string;
  wordBeingDecoded: string;
  /** Patterns players must identify */
  patternObservations: PatternObservation[];
  /** Patterns already confirmed */
  confirmedPatterns: string[];
  /** Community contributions needed to unlock */
  contributionsRequired: number;
  /** Current contributions */
  currentContributions: number;
  /** Multiple choice when enough data gathered */
  possibleMeanings: string[];
  /** When enough community votes converge */
  voteThreshold: number;
}

export interface PatternObservation {
  id: string;
  patternGlyph: string;
  /** When this pattern appears in Voltari transmissions */
  context: string;
  /** What it might mean (player guesses) */
  guesses: { meaning: string; votes: number }[];
}

/* ─── COMMUNITY CONTRIBUTION TYPES ─── */

export type ContributionAction =
  | { type: "observe_pattern"; puzzleId: string }
  | { type: "submit_guess"; puzzleId: string; meaning: string }
  | { type: "vote_on_meaning"; puzzleId: string; meaning: string }
  | { type: "test_translation"; puzzleId: string; wordId: string }
  | { type: "confirm_breakthrough"; wordId: string };

export const CONTRIBUTION_REWARDS = {
  observe_pattern: { dream: 5, xp: 10, translationPoints: 1 },
  submit_guess: { dream: 10, xp: 20, translationPoints: 3 },
  vote_on_meaning: { dream: 2, xp: 5, translationPoints: 1 },
  test_translation: { dream: 15, xp: 30, translationPoints: 5 },
  confirm_breakthrough: { dream: 100, xp: 200, translationPoints: 50 },
};

/* ─── DIPLOMATIC PROGRESSION ─── */

export interface DiplomaticMilestone {
  stage: DiplomaticStage;
  vocabularyRequired: number; // Number of words needed to reach this stage
  /** What unlocks at this stage */
  unlocks: string[];
  /** Community narrative */
  narrative: string;
  /** Voltari's response to humanity */
  voltariResponse: string;
}

export const DIPLOMATIC_MILESTONES: DiplomaticMilestone[] = [
  {
    stage: "silence", vocabularyRequired: 0,
    unlocks: [],
    narrative: "Violetta pulses with purple lightning. Nobody has decoded its language. Yet.",
    voltariResponse: "(no contact — they may not know we exist)",
  },
  {
    stage: "awareness", vocabularyRequired: 3,
    unlocks: ["Basic signal reception", "Violetta marked on galaxy map"],
    narrative: "The community decoded their greeting pattern. The Voltari have noticed our signal. They're listening.",
    voltariResponse: "{greet}→{self}→{other}  (They see us. We see them. Acknowledge.)",
  },
  {
    stage: "greeting", vocabularyRequired: 6,
    unlocks: ["Can send simple greetings", "Cultural exchange missions"],
    narrative: "Basic conversation possible. The community can now ask yes/no questions. Voltari respond patiently. They seem... relieved we're trying.",
    voltariResponse: "{greet}→{other}→{question:seek?}  (They ask what we seek.)",
  },
  {
    stage: "conversation", vocabularyRequired: 10,
    unlocks: ["Exchange stories about extinct races", "Voltari reveal their history", "First gift exchange"],
    narrative: "Structured dialogue. The Voltari tell us they've been watching the Thought Virus for 2 million years. They hid. They are ashamed they hid.",
    voltariResponse: "{self}→{history}→{hide}→{virus}. {self}→{seek}→{exchange}→{peace}.  (We hid. Long. We want peace-trade.)",
  },
  {
    stage: "negotiation", vocabularyRequired: 14,
    unlocks: ["Trade agreements possible", "Request specific resources", "Voltari can visit orbital space"],
    narrative: "We can negotiate. The Voltari offer electrical technology — impossible architecture, lightning-based weapons, energy beings we cannot replicate. They want ONE thing in return.",
    voltariResponse: "{self}→{seek}→{exchange}. {give}→{technology}. {receive}→{question:why-virus-wins?}  (Trade tech for understanding why virus wins.)",
  },
  {
    stage: "alliance", vocabularyRequired: 18,
    unlocks: ["Voltari faction playable", "Purple sector territory available", "Joint operations against Thought Virus"],
    narrative: "Full alliance achieved. The Voltari have revealed their true agenda: they want to help humanity fight the Thought Virus. They hid because they were afraid. Now they are afraid enough to act.",
    voltariResponse: "{alliance}→{us}→{you}→{against}→{virus}→{forever}.  (Alliance. Us+you vs virus eternally.)",
  },
  {
    stage: "trading", vocabularyRequired: 20,
    unlocks: ["Permanent Voltari market", "Electrical tech crafting", "Voltari units in card game", "Voltari champion in fight game"],
    narrative: "The Voltari trade freely. Their electrical technology changes everything. Players can now harness lightning as a resource. Their philosophy — that all life is pattern — becomes a new worldview option.",
    voltariResponse: "(ongoing trade — they have become permanent partners)",
  },
];

/* ─── VOLTARI TRADE GOODS ─── */

export const VOLTARI_TRADE_ITEMS = [
  { id: "lightning_core", name: "Crystallized Lightning Core", cost: { dream: 200, patternFragments: 10 }, unlocks: "Lightning weapon type" },
  { id: "storm_essence", name: "Storm Essence", cost: { dream: 150, patternFragments: 5 }, unlocks: "Electrical shield" },
  { id: "voltari_architecture", name: "Living Architecture Blueprint", cost: { dream: 500, patternFragments: 25 }, unlocks: "Build shaped-lightning structures" },
  { id: "frequency_manipulator", name: "Frequency Manipulator", cost: { dream: 300, patternFragments: 15 }, unlocks: "Communicate with electrical beings" },
  { id: "pattern_translator", name: "Pattern Translator", cost: { dream: 800, patternFragments: 50 }, unlocks: "Universal translator for Voltari fluency" },
];

/* ─── COMMUNITY CONTRIBUTION SYSTEM ─── */

export interface CommunityContributor {
  playerId: number;
  playerName: string;
  patternsObserved: number;
  guessesSubmitted: number;
  correctGuesses: number;
  breakthroughsContributed: number;
  translationPointsEarned: number;
  /** Special titles earned */
  titles: string[];
}

export const CONTRIBUTOR_TITLES = [
  { id: "listener", name: "The Listener", requirement: "10 patterns observed" },
  { id: "translator", name: "Pattern Translator", requirement: "5 correct guesses" },
  { id: "linguist", name: "First-Contact Linguist", requirement: "1 breakthrough contribution" },
  { id: "ambassador", name: "Voltari Ambassador", requirement: "10 breakthroughs" },
  { id: "rocky", name: "Rocky's Heir", requirement: "100 translation points (hidden achievement)" },
  { id: "arrival", name: "Time-Walker", requirement: "Complete full alliance (unlocks all 20 words)" },
];


/**
 * The Voltari DO NOT respond to impatience. If the community
 * tries to brute-force translation, they pull back. Progress slows.
 * Only patient, methodical contributions advance the project.
 */
export const PATIENCE_MODIFIERS = {
  rushed_guesses: -0.5,        // Penalty for wrong guesses in quick succession
  methodical_work: +2.0,       // Bonus for spaced, thoughtful contributions
  community_coordination: +1.5, // Bonus when multiple players agree on a meaning
  first_wrong_guess_per_day: 0, // No penalty for first mistake
  aggressive_attempts: -1.0,   // Heavy penalty for trying to force breakthroughs
};

/* ─── FIRST CONTACT NARRATIVE ARC ─── */

export const FIRST_CONTACT_DIALOG = {
  discovery: {
    elara: "I'm detecting a signal. Rhythmic. Intentional. From a purple planet I've never catalogued. It's been broadcasting for... the signal math suggests 2 million years.",
    the_human: "I recognize this. The Architect's archives mentioned it once. He called it 'the unsolvable frequency.' He gave up. He never gave up on anything.",
    agent_zero: "Intelligence flag: the Insurgency intercepted this same signal centuries ago. We couldn't decode it. Nobody could. If you crack this, you accomplish what entire civilizations failed to do.",
    the_antiquarian: "Oh. OH. *goggles flare red* I haven't seen the Voltari manifest in this timeline. They hid too well. They're REACHING. They know we're dying.",
  },
  first_word_decoded: {
    elara: "We decoded a greeting. Just one word: 'acknowledge-presence-without-threat.' That's how they say hello. I've never read anything so cautious AND so warm at once.",
    the_source: "*viral static* They are PURE patterns. The Virus cannot touch them. They are what Kael might have become if everything had gone differently.",
  },
  first_conversation: {
    the_antiquarian: "We're talking to them. We. HUMANITY. Just weeks ago we didn't know they existed. Now we're having conversations. The Five Ages have NEVER seen this.",
    shadow_tongue: "*text glitches* I cannot corrupt their language. Their patterns are... immune. I find them OFFENSIVE. I cannot edit what I cannot read.",
  },
  alliance_formed: {
    elara: "Alliance confirmed. They're sending envoys. They've been waiting 2 million years for someone to speak back. We did.",
    the_human: "I've known hope twice in 1,500 years. This is the second time.",
    the_source: "*long silence* I will try to remember what peace feels like. I will try.",
  },
};

/* ─── DEFAULT STATE ─── */

export const DEFAULT_TRANSLATION_STATE: TranslationState = {
  patternsObserved: 0,
  confirmedVocabulary: [],
  activePuzzle: null,
  diplomaticStage: "silence",
  tradeUnlocked: false,
  topContributors: [],
};

/* ─── HELPERS ─── */

export function getDiplomaticStageForVocab(vocabCount: number): DiplomaticStage {
  let current: DiplomaticStage = "silence";
  for (const milestone of DIPLOMATIC_MILESTONES) {
    if (vocabCount >= milestone.vocabularyRequired) current = milestone.stage;
  }
  return current;
}

export function canAccessTrade(state: TranslationState): boolean {
  return state.diplomaticStage === "trading" || state.diplomaticStage === "alliance";
}

export function getContributionReward(action: ContributionAction): { dream: number; xp: number; translationPoints: number } {
  return CONTRIBUTION_REWARDS[action.type];
}
