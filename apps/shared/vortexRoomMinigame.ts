/* ═══════════════════════════════════════════════════════
   VORTEX ROOM MINIGAME — pure state helpers

   Pure-function engine for the interactive puzzle variant
   of a Vortex Incursion room. Today supports the "sequence"
   puzzle variant (memorize a growing tile order and tap it
   back). The other room types (combat / card / treasure /
   boss) delegate to existing systems — the card type to
   DuelystGameUI, the others to a themed "Clear" action
   until richer minigames ship.

   Keeping the state machine pure lets us:
     - test round trips without spinning up React
     - persist mid-puzzle state on reload
     - re-use the solver across multiple room puzzles
   ═══════════════════════════════════════════════════════ */

import type { PuzzleVariant } from "./incursions";

export type VortexPuzzleOutcome = "pending" | "won" | "lost";

export interface VortexSequencePuzzleState {
  kind: "sequence";
  /** Canonical length of the target sequence for this puzzle. */
  targetLength: number;
  /** The full sequence of tile indexes the player must input. */
  targetSequence: readonly number[];
  /** Tiles the player has tapped so far this round. */
  playerInput: readonly number[];
  /** Number of tiles currently visible as a hint. */
  hintVisibleCount: number;
  outcome: VortexPuzzleOutcome;
}

export interface VortexCipherPuzzleState {
  kind: "cipher";
  /** Plain-text word the player is trying to decrypt. */
  plaintext: string;
  /** Caesar shift applied to produce the ciphertext. */
  shift: number;
  /** Player's current guess. */
  guess: string;
  outcome: VortexPuzzleOutcome;
}

export interface VortexHackingPuzzleState {
  kind: "hacking";
  /** Target bytes the player must match. */
  target: readonly number[];
  /** Player's current byte input. */
  current: readonly number[];
  outcome: VortexPuzzleOutcome;
}

export type VortexPuzzleState =
  | VortexSequencePuzzleState
  | VortexCipherPuzzleState
  | VortexHackingPuzzleState;

/** Deterministic seeded RNG — Mulberry32. */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ─── SEQUENCE PUZZLE ─── */

const SEQUENCE_TILE_COUNT = 9;

export function startSequencePuzzle(
  seed: number,
  length = 5,
): VortexSequencePuzzleState {
  const rng = mulberry32(seed);
  const seq: number[] = [];
  for (let i = 0; i < length; i++) {
    seq.push(Math.floor(rng() * SEQUENCE_TILE_COUNT));
  }
  return {
    kind: "sequence",
    targetLength: length,
    targetSequence: seq,
    playerInput: [],
    hintVisibleCount: length,
    outcome: "pending",
  };
}

/**
 * Hide the hint and let the player begin input. Called
 * after the player finishes memorizing the sequence.
 */
export function hideSequenceHint(
  state: VortexSequencePuzzleState,
): VortexSequencePuzzleState {
  if (state.outcome !== "pending") return state;
  return { ...state, hintVisibleCount: 0 };
}

/**
 * Append a tapped tile to the player's input. If the tap
 * matches the corresponding target index, the puzzle
 * progresses; if not, the puzzle is lost. A complete
 * correct sequence wins.
 */
export function tapSequenceTile(
  state: VortexSequencePuzzleState,
  tileIndex: number,
): VortexSequencePuzzleState {
  if (state.outcome !== "pending") return state;
  if (state.hintVisibleCount > 0) return state; // still memorizing
  const nextStep = state.playerInput.length;
  const expected = state.targetSequence[nextStep];
  if (tileIndex !== expected) {
    return {
      ...state,
      playerInput: [...state.playerInput, tileIndex],
      outcome: "lost",
    };
  }
  const nextInput = [...state.playerInput, tileIndex];
  const won = nextInput.length === state.targetSequence.length;
  return {
    ...state,
    playerInput: nextInput,
    outcome: won ? "won" : "pending",
  };
}

/* ─── CIPHER PUZZLE ─── */

const CIPHER_WORDS: readonly string[] = [
  "WITNESS",
  "ANTIQUARIAN",
  "ENGINEER",
  "CHRONICLE",
  "SIGNAL",
];

export function startCipherPuzzle(seed: number): VortexCipherPuzzleState {
  const rng = mulberry32(seed);
  const plaintext = CIPHER_WORDS[Math.floor(rng() * CIPHER_WORDS.length)];
  const shift = 1 + Math.floor(rng() * 12);
  return {
    kind: "cipher",
    plaintext,
    shift,
    guess: "",
    outcome: "pending",
  };
}

export function getCiphertext(state: VortexCipherPuzzleState): string {
  return state.plaintext
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code < 65 || code > 90) return ch;
      return String.fromCharCode(((code - 65 + state.shift) % 26) + 65);
    })
    .join("");
}

export function submitCipherGuess(
  state: VortexCipherPuzzleState,
  guess: string,
): VortexCipherPuzzleState {
  if (state.outcome !== "pending") return state;
  const normalized = guess.trim().toUpperCase();
  return {
    ...state,
    guess: normalized,
    outcome: normalized === state.plaintext ? "won" : "lost",
  };
}

/* ─── HACKING PUZZLE ─── */

export function startHackingPuzzle(seed: number): VortexHackingPuzzleState {
  const rng = mulberry32(seed);
  const target = Array.from({ length: 6 }, () => Math.floor(rng() * 16));
  return {
    kind: "hacking",
    target,
    current: Array.from({ length: 6 }, () => 0),
    outcome: "pending",
  };
}

export function setHackingByte(
  state: VortexHackingPuzzleState,
  index: number,
  value: number,
): VortexHackingPuzzleState {
  if (state.outcome !== "pending") return state;
  if (index < 0 || index >= state.current.length) return state;
  const clamped = Math.max(0, Math.min(15, value));
  const next = state.current.slice();
  next[index] = clamped;
  return { ...state, current: next };
}

export function submitHackingPuzzle(
  state: VortexHackingPuzzleState,
): VortexHackingPuzzleState {
  if (state.outcome !== "pending") return state;
  const match = state.current.every((b, i) => b === state.target[i]);
  return { ...state, outcome: match ? "won" : "lost" };
}

/* ─── DISPATCHER ─── */

export function startVortexPuzzle(
  variant: PuzzleVariant,
  seed: number,
): VortexPuzzleState {
  if (variant === "sequence") return startSequencePuzzle(seed);
  if (variant === "cipher") return startCipherPuzzle(seed);
  return startHackingPuzzle(seed);
}
