// ============================================================================
// META-PUZZLE SYSTEM
// The master puzzle that unlocks when all 8 room puzzles are solved.
// Combines each room's answer into one final challenge whose solution
// reveals a hidden room, legendary equipment, and the title "Reality Hacker".
// ============================================================================

// ---------------------------------------------------------------------------
// Room puzzle answers (canonical constants)
// ---------------------------------------------------------------------------

export const ROOM_PUZZLE_ANSWERS = {
  bridge:       "1047",             // Binary power relay
  archives:     "lore",             // Riddle answer
  comms:        "the saga continues", // Caesar shift-3 decoded message
  observation:  "keycard found",    // Keycard retrieved from Medical Bay
  engineering:  "PLNS",             // Power, Life Support, Navigation, Shields
  armory:       "courage",          // Riddle answer
  cargo:        "cargo hold open",  // Reverse cipher decoded
  captains:     "master key",       // Hidden key from Bridge command chair
} as const;

export type RoomId = keyof typeof ROOM_PUZZLE_ANSWERS;

/** The final message spelled by rearranging the first letters of each answer. */
export const META_SOLUTION = "COURAGE TO SEEK LORE OPENS THE SAGA";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MetaPuzzleClue {
  roomId: RoomId;
  answer: string;
  hint: string;
  solved: boolean;
}

export interface MetaPuzzleReward {
  hiddenRoom: { id: string; name: string; description: string };
  equipmentSet: { id: string; name: string; pieces: string[] };
  title: { id: string; label: string };
}

export interface MetaPuzzleState {
  clues: MetaPuzzleClue[];
  available: boolean;
  attempted: boolean;
  solved: boolean;
  reward: MetaPuzzleReward | null;
}

// ---------------------------------------------------------------------------
// Clue definitions (one per room)
// ---------------------------------------------------------------------------

const META_CLUES: MetaPuzzleClue[] = [
  { roomId: "bridge",      answer: ROOM_PUZZLE_ANSWERS.bridge,      hint: "The Ark's designation holds the first piece.",        solved: false },
  { roomId: "archives",    answer: ROOM_PUZZLE_ANSWERS.archives,    hint: "What the Antiquarian treasures above all else.",      solved: false },
  { roomId: "comms",       answer: ROOM_PUZZLE_ANSWERS.comms,       hint: "The decoded broadcast carried this promise.",         solved: false },
  { roomId: "observation", answer: ROOM_PUZZLE_ANSWERS.observation, hint: "A small card that opened the widest view.",           solved: false },
  { roomId: "engineering", answer: ROOM_PUZZLE_ANSWERS.engineering, hint: "Four letters that wake a sleeping ship.",             solved: false },
  { roomId: "armory",      answer: ROOM_PUZZLE_ANSWERS.armory,      hint: "Not a weapon — the will to wield one.",              solved: false },
  { roomId: "cargo",       answer: ROOM_PUZZLE_ANSWERS.cargo,       hint: "Mirrors unlocked what brute force could not.",       solved: false },
  { roomId: "captains",    answer: ROOM_PUZZLE_ANSWERS.captains,    hint: "Hidden beside the seat of command.",                 solved: false },
];

// ---------------------------------------------------------------------------
// Reward definition
// ---------------------------------------------------------------------------

const META_REWARD: MetaPuzzleReward = {
  hiddenRoom: {
    id: "programmers-study",
    name: "The Programmer's Study",
    description: "A chamber outside the simulation's logic, filled with terminals that display the Ark's raw source code.",
  },
  equipmentSet: {
    id: "code-of-reality",
    name: "Code of Reality",
    pieces: [
      "Compiler's Crown",
      "Debugger's Mantle",
      "Refactorer's Gauntlets",
      "Runtime Greaves",
      "Null-Pointer Aegis",
    ],
  },
  title: {
    id: "title-reality-hacker",
    label: "Reality Hacker",
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Returns true when every room puzzle has been solved. */
export function isMetaPuzzleAvailable(solvedRooms: RoomId[]): boolean {
  const allRooms: RoomId[] = Object.keys(ROOM_PUZZLE_ANSWERS) as RoomId[];
  return allRooms.every((room) => solvedRooms.includes(room));
}

/**
 * Check the player's proposed solution against the meta-puzzle answer.
 * The player must arrange the 8 room answers so that the first letters,
 * read in sequence, spell the META_SOLUTION message.
 *
 * @param playerAnswer - The full sentence the player submits.
 * @returns `true` if the answer matches (case-insensitive).
 */
export function checkMetaPuzzleSolution(playerAnswer: string): boolean {
  return playerAnswer.trim().toUpperCase() === META_SOLUTION;
}

/**
 * Build and return the full reward payload when the meta-puzzle is solved.
 * Also marks every clue as solved.
 */
export function getMetaPuzzleReward(): { reward: MetaPuzzleReward; state: MetaPuzzleState } {
  const clues = META_CLUES.map((c) => ({ ...c, solved: true }));
  return {
    reward: META_REWARD,
    state: {
      clues,
      available: true,
      attempted: true,
      solved: true,
      reward: META_REWARD,
    },
  };
}
