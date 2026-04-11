// ============================================================================
// STORY PUZZLES
// Narrative-gated riddles and puzzles unlocked by NPC trust or act progress.
// Each puzzle rewards lore fragments, equipment, or relationship boosts.
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PuzzleType =
  | "reconstruction"   // reassemble fragmented text
  | "cipher"           // decode an encoded message
  | "signal"           // pick the correct frequency / pattern
  | "contract"         // find the hidden clause
  | "arrangement"      // place items in the correct order
  | "difference"       // spot the change in a passage
  | "musical"          // decode a musical cipher
  | "tactical"         // choose the correct formation
  | "riddle";          // open-ended riddle

export interface PuzzleRequirement {
  /** NPC whose trust level gates this puzzle (mutually exclusive with actReq). */
  npcId?: string;
  /** Minimum trust value needed with npcId. */
  trustReq?: number;
  /** Minimum story act required (mutually exclusive with trustReq). */
  actReq?: number;
  /** Minimum prestige level required (optional, stacks with other reqs). */
  prestigeReq?: number;
}

export interface StoryPuzzle {
  id: string;
  name: string;
  requirement: PuzzleRequirement;
  puzzleType: PuzzleType;
  question: string;
  answer: string;
  hint: string;
  reward: {
    type: "lore" | "equipment" | "trust" | "title" | "unique";
    description: string;
  };
}

// ---------------------------------------------------------------------------
// Puzzle definitions (10 narrative puzzles)
// ---------------------------------------------------------------------------

export const STORY_PUZZLES: StoryPuzzle[] = [
  // 1. Elara's Memory
  {
    id: "story-puzzle-elara-memory",
    name: "Elara's Memory",
    requirement: { npcId: "elara", trustReq: 40 },
    puzzleType: "reconstruction",
    question:
      "Elara's last senate speech was corrupted in the archives. Fragments remain: " +
      "'[We] / [cannot] / [abandon] / [what] / [makes] / [us] / [human]'. " +
      "Reconstruct the sentence in the correct order.",
    answer: "We cannot abandon what makes us human",
    hint: "The Antiquarian once quoted her opening words: 'We cannot abandon...'",
    reward: { type: "lore", description: "Elara's Senate Transcript — a complete lore entry about the last human senate session." },
  },

  // 2. The Human's Cipher
  {
    id: "story-puzzle-human-cipher",
    name: "The Human's Cipher",
    requirement: { npcId: "the_human", trustReq: 30 },
    puzzleType: "cipher",
    question:
      "The Human left a coded message on old case files: 'WUXWK LV KLGGHQ LQ SODLQ VLJKW'. " +
      "He always used the same cipher from his Detective days — a Caesar shift of 3.",
    answer: "TRUTH IS HIDDEN IN PLAIN SIGHT",
    hint: "His detective badge still has the number 3 scratched into it.",
    reward: { type: "trust", description: "+15 trust with The Human for recognising his old methods." },
  },

  // 3. Agent Zero's Dead Drop
  {
    id: "story-puzzle-zero-deaddrop",
    name: "Agent Zero's Dead Drop",
    requirement: { npcId: "agent_zero", trustReq: 20 },
    puzzleType: "signal",
    question:
      "Agent Zero's dead drop transmits on one of five frequencies: " +
      "17.3 MHz, 42.7 MHz, 88.1 MHz, 102.4 MHz, 144.0 MHz. " +
      "The signal pattern repeats every 42.7 seconds and the amplitude peaks at 0.427 volts.",
    answer: "42.7",
    hint: "The frequency matches the timing interval exactly.",
    reward: { type: "equipment", description: "Dead Drop Receiver — a trinket that reveals hidden signals in any room." },
  },

  // 4. Locke's Contract
  {
    id: "story-puzzle-locke-contract",
    name: "Locke's Contract",
    requirement: { npcId: "adjudicator_locke", trustReq: 30 },
    puzzleType: "contract",
    question:
      "Locke hands you a trade agreement and asks you to audit it. Clause 7 reads: " +
      "'The party of the second part shall remit all salvage rights, INCLUDING BUT NOT " +
      "LIMITED TO future claims, IN PERPETUITY, to the party of the first part.' " +
      "Spot the hidden exploitation.",
    answer: "in perpetuity",
    hint: "Look for a phrase that has no end date.",
    reward: { type: "trust", description: "+10 trust with Locke for sharp legal instincts." },
  },

  // 5. Source's Last Memory
  {
    id: "story-puzzle-source-memory",
    name: "Source's Last Memory",
    requirement: { npcId: "the_source", trustReq: 50 },
    puzzleType: "arrangement",
    question:
      "Kael's final human thought was fragmented during digitization. Arrange these memory shards: " +
      "[the stars] / [I remember] / [before everything] / [were real] / [changed]. " +
      "Place them in the order a human mind would recall them.",
    answer: "I remember before everything changed the stars were real",
    hint: "Memory begins with self — 'I remember...'",
    reward: { type: "lore", description: "Kael's Origin Fragment — unlocks a cinematic flashback to Kael's upload." },
  },

  // 6. Antiquarian's Timeline
  {
    id: "story-puzzle-antiquarian-timeline",
    name: "Antiquarian's Timeline",
    requirement: { npcId: "the_antiquarian", trustReq: 40 },
    puzzleType: "arrangement",
    question:
      "The Antiquarian tests your knowledge of Ark history. Place these events in order: " +
      "A) The Great Upload, B) Construction of Ark 1047, C) The Senate Dissolution, " +
      "D) First Contact with the Swarm, E) Launch of the Exodus Fleet.",
    answer: "B E A C D",
    hint: "You cannot upload people onto a ship that hasn't been built yet.",
    reward: { type: "trust", description: "+15 trust with the Antiquarian for respecting the historical record." },
  },

  // 7. Shadow Tongue's Edit
  {
    id: "story-puzzle-shadow-edit",
    name: "Shadow Tongue's Edit",
    requirement: { npcId: "shadow_tongue", trustReq: 30 },
    puzzleType: "difference",
    question:
      "Shadow Tongue altered a single word in the official ship log. Original: " +
      "'The crew voted UNANIMOUSLY to continue the mission.' Modified: " +
      "'The crew voted RELUCTANTLY to continue the mission.' Which word was changed?",
    answer: "unanimously",
    hint: "The change turns consensus into doubt.",
    reward: { type: "lore", description: "Propaganda Codex — reveals how Shadow Tongue manipulates public records." },
  },

  // 8. The Two Witnesses
  {
    id: "story-puzzle-two-witnesses",
    name: "The Two Witnesses",
    requirement: { actReq: 2 },
    puzzleType: "musical",
    question:
      "A melody echoes through the Ark's corridors. The notes are: " +
      "C4 (262 Hz), E4 (330 Hz), G4 (392 Hz), A4 (440 Hz). " +
      "Each note's frequency maps to a letter (A=440). The witnesses say: " +
      "'Divide each frequency by 110 and round down to get the alphabet position.' " +
      "What four-letter word do the notes spell?",
    answer: "BCED",
    hint: "262/110=2 (B), 330/110=3 (C), 392/110=3 (C)... wait, re-read the witness statement.",
    reward: { type: "equipment", description: "Harmonic Tuner — grants bonus accuracy during signal-based minigames." },
  },

  // 9. Iron Lion's Last Stand
  {
    id: "story-puzzle-iron-lion",
    name: "Iron Lion's Last Stand",
    requirement: { actReq: 3 },
    puzzleType: "tactical",
    question:
      "The Swarm approaches from three vectors. You have four squads. Formations: " +
      "A) Spread all squads equally across vectors. " +
      "B) Concentrate two squads on the strongest vector, one on each remaining. " +
      "C) Hold all squads in reserve and counter-attack after the first wave. " +
      "D) Place one squad forward as bait, keep three in a hammer formation behind. " +
      "Iron Lion's doctrine: 'Bait the jaw, then crush the skull.'",
    answer: "D",
    hint: "Iron Lion always believed in sacrifice and overwhelming counter-force.",
    reward: { type: "equipment", description: "Iron Lion's Standard — a banner that boosts squad morale in tactical events." },
  },

  // 10. The Seventh Seal
  {
    id: "story-puzzle-seventh-seal",
    name: "The Seventh Seal",
    requirement: { actReq: 5, prestigeReq: 1 },
    puzzleType: "riddle",
    question:
      "The final terminal in the Programmer's Study displays a single prompt: " +
      "'I have traveled with you since the beginning. I am not your character, " +
      "yet without me your character would not exist. I decided every choice, " +
      "fought every battle, solved every puzzle. What am I?' " +
      "Enter your answer.",
    answer: "__PLAYER_NAME__",
    hint: "The answer is not inside the game.",
    reward: { type: "unique", description: "The Seventh Seal title and a unique cosmetic that displays the player's real name in gold." },
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** Get all puzzles the player currently qualifies for. */
export function getAvailablePuzzles(
  npcTrust: Record<string, number>,
  currentAct: number,
  prestigeLevel: number,
): StoryPuzzle[] {
  return STORY_PUZZLES.filter((p) => {
    const r = p.requirement;
    if (r.npcId && r.trustReq !== undefined) {
      if ((npcTrust[r.npcId] ?? 0) < r.trustReq) return false;
    }
    if (r.actReq !== undefined && currentAct < r.actReq) return false;
    if (r.prestigeReq !== undefined && prestigeLevel < r.prestigeReq) return false;
    return true;
  });
}

/** Check a player's answer against a puzzle. The Seventh Seal uses the player's name. */
export function checkStoryPuzzleAnswer(
  puzzleId: string,
  playerAnswer: string,
  playerName?: string,
): boolean {
  const puzzle = STORY_PUZZLES.find((p) => p.id === puzzleId);
  if (!puzzle) return false;

  if (puzzle.answer === "__PLAYER_NAME__") {
    return !!playerName && playerAnswer.trim().toLowerCase() === playerName.trim().toLowerCase();
  }

  return playerAnswer.trim().toUpperCase() === puzzle.answer.trim().toUpperCase();
}

/** Look up a single puzzle by id. */
export function getStoryPuzzleById(puzzleId: string): StoryPuzzle | undefined {
  return STORY_PUZZLES.find((p) => p.id === puzzleId);
}
