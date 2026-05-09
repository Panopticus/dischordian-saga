/* ═══════════════════════════════════════════════════════
   PUZZLE SYSTEM — Lore riddles and keycard puzzles
   that gate access to locked rooms on the Inception Ark.
   Each room has a unique puzzle type.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Key, Brain, Terminal, AlertTriangle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { enqueue as enqueueCompanionLine } from "@/companion/companionScheduler";

/* ─── PUZZLE TYPES ─── */
export type PuzzleType = "riddle" | "keycard" | "sequence" | "cipher" | "power_relay";

export interface Puzzle {
  id: string;
  roomId: string;
  type: PuzzleType;
  title: string;
  description: string;
  elaraHint: string;
  // Riddle-specific
  riddle?: string;
  answer?: string;
  acceptableAnswers?: string[];
  // Sequence-specific
  sequence?: string[];
  // Cipher-specific
  cipherText?: string;
  cipherKey?: string;
  cipherAnswer?: string;
  // Power relay-specific
  relayPattern?: boolean[];
  // Keycard-specific
  requiredItem?: string;
  /**
   * audit/16 PR 8 (finding ER1 — Escape Room persona).
   *
   * Sequencing-lock prerequisites. When set, this puzzle is
   * "locked" until every entry's gate is satisfied — it remains
   * approachable in the room UI but the solve mutation refuses
   * to evaluate input until the prereqs clear. Distinct from the
   * `requiredItem` keycard gate (a single inventory check); a
   * prerequisite chain models cross-room narrative ordering
   * ("you can't crack the Bridge auth handshake until you've
   * scanned the data-slate at Med Bay").
   */
  prerequisites?: readonly PuzzlePrerequisite[];
}

/**
 * audit/16 PR 8 (ER1) — A single sequencing dependency on a puzzle.
 * Each entry encodes ONE thing the player must have done before
 * the puzzle becomes solvable. Multiple prerequisites all must
 * pass (AND-logic) — author OR-logic by leaving the simpler path
 * un-prerequisited.
 */
export type PuzzlePrerequisite =
  | {
      /** Another puzzle (anywhere in the registry) must be solved. */
      kind: "puzzle_solved";
      puzzleId: string;
    }
  | {
      /** A specific clue must have been collected. */
      kind: "clue_collected";
      clueId: string;
    }
  | {
      /** A narrative flag must be set on the player's state. Lets
       *  authors gate puzzles behind major story beats without
       *  needing a synthetic intermediate puzzle. */
      kind: "narrative_flag";
      flag: string;
    };

/**
 * audit/16 PR 8 (ER1) — Per-puzzle unlock state computed against
 * the player's current solve / inventory / flag state. UI consumers
 * read `unlocked` to gray-out the puzzle controls; the `missing`
 * array is for the "what's blocking this?" tooltip surface.
 */
export interface PuzzleUnlockState {
  unlocked: boolean;
  /** Empty when unlocked; otherwise a list of unmet prerequisites. */
  missing: readonly PuzzlePrerequisite[];
}

export function getPuzzleUnlockState(
  puzzle: Puzzle,
  state: {
    solvedPuzzles: ReadonlySet<string>;
    collectedClues: ReadonlySet<string>;
    narrativeFlags: ReadonlySet<string>;
  },
): PuzzleUnlockState {
  if (!puzzle.prerequisites || puzzle.prerequisites.length === 0) {
    return { unlocked: true, missing: [] };
  }
  const missing: PuzzlePrerequisite[] = [];
  for (const pre of puzzle.prerequisites) {
    if (pre.kind === "puzzle_solved" && !state.solvedPuzzles.has(pre.puzzleId)) {
      missing.push(pre);
    } else if (pre.kind === "clue_collected" && !state.collectedClues.has(pre.clueId)) {
      missing.push(pre);
    } else if (pre.kind === "narrative_flag" && !state.narrativeFlags.has(pre.flag)) {
      missing.push(pre);
    }
  }
  return { unlocked: missing.length === 0, missing };
}

/* ─── PUZZLE DEFINITIONS ─── */
export const ROOM_PUZZLES: Record<string, Puzzle> = {
  "bridge": {
    // The bridge access door has been physically tampered with — the
    // auth handshake was severed from the inside, and Elara cannot
    // talk it open. The reset code is recoverable from the dead
    // Potential's data-slate fragment, scanned at the Med Bay's
    // autopsy console. This replaces the prior `power_relay` puzzle
    // (1047 binary) which played as an arbitrary minigame disconnected
    // from the murder mystery.
    id: "puzzle-bridge",
    roomId: "bridge",
    type: "keycard",
    title: "BRIDGE ACCESS — DEAD-LOCKED",
    description: "The door's authentication handshake has been physically severed. Someone cut the line from the inside before they died. The reset code lives on the data-slate fragment recovered from the dead pod — the Med Bay's autopsy console can read it.",
    elaraHint: "Take the data-slate fragment to the bio-bed in the Medical Bay. The autopsy console can pull the bridge reset code from the dead Potential's manifest entry.",
    requiredItem: "bridge-reset-code",
  },
  "archives": {
    id: "puzzle-archives",
    roomId: "archives",
    type: "riddle",
    title: "ARCHIVES ACCESS PROTOCOL",
    description: "The data core requires a verbal passphrase. Answer the riddle to gain access to the ship's archives.",
    elaraHint: "Think about what connects all the data in this ship — every entity, every relationship, every secret. It's the thing that binds stories together.",
    riddle: "I am the thread that connects all things,\nYet I am invisible to the eye.\nI bind the powerful to the weak,\nThe living to those who die.\nI am found in every story told,\nIn every war and every peace.\nWithout me, all would be forgotten —\nWith me, nothing will cease.\nWhat am I?",
    answer: "lore",
    acceptableAnswers: ["lore", "memory", "history", "knowledge", "story", "stories", "narrative"],
  },
  "comms-array": {
    id: "puzzle-comms",
    roomId: "comms-array",
    type: "cipher",
    title: "COMMUNICATIONS DECRYPTION",
    description: "The comms array is receiving an encrypted signal. Decode the message to restore communications.",
    elaraHint: "It's a simple Caesar cipher — each letter is shifted by a fixed number. The signal header says 'SHIFT-3'. Move each letter back 3 positions in the alphabet.",
    cipherText: "WKH VDJD FRQWLQXHV",
    cipherKey: "3",
    cipherAnswer: "the saga continues",
  },
  "observation-deck": {
    id: "puzzle-observation",
    roomId: "observation-deck",
    type: "keycard",
    title: "OBSERVATION DECK SEAL",
    description: "The observation deck is sealed with a biometric lock. You need the Observation Keycard to open it.",
    elaraHint: "The Observation Keycard should be in the Medical Bay. The previous crew stored sensitive access cards in the medical safe.",
    requiredItem: "observation-keycard",
  },
  "engineering": {
    id: "puzzle-engineering",
    roomId: "engineering",
    type: "sequence",
    title: "ENGINEERING CONSOLE REBOOT",
    description: "The engineering console requires a specific boot sequence. Enter the correct order of system initializations.",
    elaraHint: "Standard Ark boot sequence: Power Core first, then Life Support, then Navigation, then Shields. The acronym is PLNS — remember 'Potentials Launch New Ships'.",
    sequence: ["POWER CORE", "LIFE SUPPORT", "NAVIGATION", "SHIELDS"],
  },
  "armory": {
    id: "puzzle-armory",
    roomId: "armory",
    type: "riddle",
    title: "ARMORY VOICE LOCK",
    description: "The armory is protected by a voice-activated lock. Speak the answer to the Warden's riddle.",
    elaraHint: "The Warden who set this lock was obsessed with the concept of power. Think about what a warrior truly needs — not a weapon, but something more fundamental.",
    riddle: "I am not a blade, yet I cut through fear.\nI am not armor, yet I shield from doubt.\nThe strongest warriors carry me always,\nBut the weak can never find me out.\nI cost nothing but am worth everything.\nWhat am I?",
    answer: "courage",
    acceptableAnswers: ["courage", "bravery", "valor", "will", "willpower", "determination", "resolve"],
  },
  "cargo-hold": {
    id: "puzzle-cargo",
    roomId: "cargo-hold",
    type: "cipher",
    title: "CARGO MANIFEST DECRYPTION",
    description: "The cargo hold doors require the decrypted manifest code. Decode the cargo authorization.",
    elaraHint: "This one uses a reverse cipher — read the encrypted text backwards and you'll find the answer.",
    cipherText: "NEPO DLOH OGRAC",
    cipherKey: "reverse",
    cipherAnswer: "cargo hold open",
  },
  "captains-quarters": {
    id: "puzzle-captains",
    roomId: "captains-quarters",
    type: "keycard",
    title: "CAPTAIN'S QUARTERS — RESTRICTED",
    description: "The Captain's quarters require the Captain's Master Key. This is the most restricted area on the ship.",
    elaraHint: "The Captain's Master Key is hidden somewhere on the Bridge. The Captain always kept a spare near the command chair.",
    requiredItem: "captains-master-key",
  },
};

/* ─── PUZZLE SOLVER COMPONENTS ─── */

function RiddlePuzzle({ puzzle, onSolve }: { puzzle: Puzzle; onSolve: () => void }) {
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);

  const checkAnswer = useCallback(() => {
    const normalized = answer.trim().toLowerCase();
    const acceptable = puzzle.acceptableAnswers || [puzzle.answer || ""];
    if (acceptable.some(a => normalized.includes(a.toLowerCase()))) {
      setResult("correct");
      setTimeout(onSolve, 1200);
    } else {
      setResult("wrong");
      setAttempts(a => a + 1);
      setTimeout(() => setResult(null), 1500);
    }
  }, [answer, puzzle, onSolve]);

  return (
    <div className="space-y-4">
      {/* Riddle text */}
      <div className="rounded-lg p-4" style={{
        background: "color-mix(in oklch, var(--energy-system) 5%, transparent)",
        border: "1px solid color-mix(in oklch, var(--energy-system) 15%, transparent)",
      }}>
        <Brain size={14} className="void-text-system mb-2" />
        <pre className="font-mono text-xs text-muted-foreground/90 leading-relaxed whitespace-pre-wrap">{puzzle.riddle}</pre>
      </div>

      {/* Answer input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Enter your answer..."
          className="flex-1 bg-transparent border-b border-border pb-2 font-mono text-sm text-foreground/85 placeholder:text-muted-foreground/35 focus:outline-none focus:void-border-system"
          onKeyDown={e => { if (e.key === "Enter") checkAnswer(); }}
          autoFocus
        />
        <button
          onClick={checkAnswer}
          disabled={!answer.trim()}
          className="px-4 py-1.5 rounded-md font-mono text-[10px] tracking-wider transition-all disabled:opacity-30"
          style={{
            background: "color-mix(in oklch, var(--energy-system) 10%, transparent)",
            border: "1px solid color-mix(in oklch, var(--energy-system) 30%, transparent)",
            color: "#a855f7",
          }}
        >
          SUBMIT
        </button>
      </div>

      {/* Result feedback */}
      <AnimatePresence>
        {result === "correct" && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 void-text-energy font-mono text-xs"
          >
            <CheckCircle size={14} /> ACCESS GRANTED
          </motion.div>
        )}
        {result === "wrong" && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 void-text-error font-mono text-xs"
          >
            <XCircle size={14} /> INCORRECT — TRY AGAIN ({attempts} attempt{attempts !== 1 ? "s" : ""})
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint after 2 failed attempts */}
      {attempts >= 2 && !showHint && (
        <button
          onClick={() => setShowHint(true)}
          className="font-mono text-[10px] void-text-accent void-text-accent transition-colors"
        >
          [Request Elara's hint]
        </button>
      )}
      {showHint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-md p-3" style={{ background: "color-mix(in oklch, var(--energy-premium) 5%, transparent)", border: "1px solid color-mix(in oklch, var(--energy-premium) 15%, transparent)" }}
        >
          <p className="font-mono text-[10px] void-text-accent">ELARA: {puzzle.elaraHint}</p>
        </motion.div>
      )}
    </div>
  );
}

function SequencePuzzle({ puzzle, onSolve }: { puzzle: Puzzle; onSolve: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const sequence = puzzle.sequence || [];
  const shuffled = useState(() => [...sequence].sort(() => Math.random() - 0.5))[0];

  const handleSelect = useCallback((item: string) => {
    if (selected.includes(item)) return;
    const next = [...selected, item];
    setSelected(next);
    if (next.length === sequence.length) {
      const correct = next.every((s, i) => s === sequence[i]);
      if (correct) {
        setResult("correct");
        setTimeout(onSolve, 1200);
      } else {
        setResult("wrong");
        setAttempts(a => a + 1);
        setTimeout(() => { setResult(null); setSelected([]); }, 1500);
      }
    }
  }, [selected, sequence, onSolve]);

  const reset = () => { setSelected([]); setResult(null); };

  return (
    <div className="space-y-4">
      {/* Selected sequence */}
      <div className="flex gap-2 min-h-[40px] flex-wrap">
        {selected.map((item, i) => (
          <motion.div
            key={`${item}-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider"
            style={{
              background: "color-mix(in oklch, var(--energy-primary) 10%, transparent)",
              border: "1px solid color-mix(in oklch, var(--energy-primary) 30%, transparent)",
              color: "var(--neon-cyan)",
            }}
          >
            {i + 1}. {item}
          </motion.div>
        ))}
        {selected.length === 0 && (
          <p className="font-mono text-[10px] text-muted-foreground/35 self-center">Select systems in the correct boot order...</p>
        )}
      </div>

      {/* Available options */}
      <div className="flex gap-2 flex-wrap">
        {shuffled.map(item => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => handleSelect(item)}
              disabled={isSelected || result !== null}
              className="px-3 py-2 rounded-md font-mono text-[11px] tracking-wider transition-all disabled:opacity-20"
              style={{
                background: isSelected ? "color-mix(in oklch, var(--text-primary) 2%, transparent)" : "var(--glass-border)",
                border: `1px solid ${isSelected ? "color-mix(in oklch, var(--text-primary) 5%, transparent)" : "color-mix(in oklch, var(--electric-blue) 25%, transparent)"}`,
                color: isSelected ? "color-mix(in oklch, var(--text-primary) 20%, transparent)" : "#3b82f6",
              }}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Reset */}
      {selected.length > 0 && result === null && (
        <button onClick={reset} className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors">
          <RotateCcw size={10} /> Reset
        </button>
      )}

      {/* Result */}
      <AnimatePresence>
        {result === "correct" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 void-text-energy font-mono text-xs">
            <CheckCircle size={14} /> BOOT SEQUENCE ACCEPTED
          </motion.div>
        )}
        {result === "wrong" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 void-text-error font-mono text-xs">
            <XCircle size={14} /> INCORRECT SEQUENCE — RESETTING
          </motion.div>
        )}
      </AnimatePresence>

      {attempts >= 2 && !showHint && (
        <button onClick={() => setShowHint(true)} className="font-mono text-[10px] void-text-accent void-text-accent transition-colors">
          [Request Elara's hint]
        </button>
      )}
      {showHint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-md p-3" style={{ background: "color-mix(in oklch, var(--energy-premium) 5%, transparent)", border: "1px solid color-mix(in oklch, var(--energy-premium) 15%, transparent)" }}
        >
          <p className="font-mono text-[10px] void-text-accent">ELARA: {puzzle.elaraHint}</p>
        </motion.div>
      )}
    </div>
  );
}

function CipherPuzzle({ puzzle, onSolve }: { puzzle: Puzzle; onSolve: () => void }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const checkAnswer = useCallback(() => {
    const normalized = answer.trim().toLowerCase();
    if (normalized === (puzzle.cipherAnswer || "").toLowerCase()) {
      setResult("correct");
      setTimeout(onSolve, 1200);
    } else {
      setResult("wrong");
      setAttempts(a => a + 1);
      setTimeout(() => setResult(null), 1500);
    }
  }, [answer, puzzle, onSolve]);

  return (
    <div className="space-y-4">
      {/* Cipher display */}
      <div className="rounded-lg p-4 text-center" style={{
        background: "color-mix(in oklch, var(--energy-primary) 3%, transparent)",
        border: "1px solid color-mix(in oklch, var(--energy-primary) 15%, transparent)",
      }}>
        <Terminal size={14} className="text-[var(--neon-cyan)] mx-auto mb-2" />
        <p className="font-mono text-[10px] text-muted-foreground/50 mb-2">ENCRYPTED SIGNAL // {puzzle.cipherKey === "reverse" ? "REVERSE CIPHER" : `SHIFT-${puzzle.cipherKey}`}</p>
        <p className="font-display text-lg tracking-[0.3em] text-[var(--neon-cyan)]">{puzzle.cipherText}</p>
      </div>

      {/* Answer */}
      <div className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Enter decrypted message..."
          className="flex-1 bg-transparent border-b border-border pb-2 font-mono text-sm text-foreground/85 placeholder:text-muted-foreground/35 focus:outline-none focus:border-[var(--neon-cyan)]/50"
          onKeyDown={e => { if (e.key === "Enter") checkAnswer(); }}
          autoFocus
        />
        <button
          onClick={checkAnswer}
          disabled={!answer.trim()}
          className="px-4 py-1.5 rounded-md font-mono text-[10px] tracking-wider transition-all disabled:opacity-30"
          style={{
            background: "color-mix(in oklch, var(--energy-primary) 10%, transparent)",
            border: "1px solid color-mix(in oklch, var(--energy-primary) 30%, transparent)",
            color: "var(--neon-cyan)",
          }}
        >
          DECRYPT
        </button>
      </div>

      <AnimatePresence>
        {result === "correct" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 void-text-energy font-mono text-xs">
            <CheckCircle size={14} /> DECRYPTION SUCCESSFUL
          </motion.div>
        )}
        {result === "wrong" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 void-text-error font-mono text-xs">
            <XCircle size={14} /> DECRYPTION FAILED
          </motion.div>
        )}
      </AnimatePresence>

      {attempts >= 2 && !showHint && (
        <button onClick={() => setShowHint(true)} className="font-mono text-[10px] void-text-accent void-text-accent transition-colors">
          [Request Elara's hint]
        </button>
      )}
      {showHint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-md p-3" style={{ background: "color-mix(in oklch, var(--energy-premium) 5%, transparent)", border: "1px solid color-mix(in oklch, var(--energy-premium) 15%, transparent)" }}
        >
          <p className="font-mono text-[10px] void-text-accent">ELARA: {puzzle.elaraHint}</p>
        </motion.div>
      )}
    </div>
  );
}

function PowerRelayPuzzle({ puzzle, onSolve }: { puzzle: Puzzle; onSolve: () => void }) {
  const { state } = useGame();
  const pattern = puzzle.relayPattern || [];
  const [switches, setSwitches] = useState<boolean[]>(pattern.map(() => false));
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [attempts, setAttempts] = useState(0);
  // F10 — attempts is still tracked for telemetry / future use but no
  // longer gates a static hint reveal. Referenced here to keep lint green.
  void attempts;

  // F10 — "Ask Elara for Help" replaces the 2-fail timer. The button
  // only shows once the designation clue is in the Clue Journal.
  const bridgeDesignationFound = Boolean(
    state.narrativeFlags?.bridge_ark_designation_found ||
      state.clueJournal?.some(c => c.id === "clue-bridge-01"),
  );
  const askElaraForHelp = useCallback(() => {
    // Seed the CompanionAsk topic chain by enqueuing the first topic's
    // equivalent line via the scheduler. The panel surface itself is
    // owned by CompanionAskPanel; this is the nudge.
    enqueueCompanionLine("ask_elara_binary_basics");
  }, []);

  const toggleSwitch = (i: number) => {
    const next = [...switches];
    next[i] = !next[i];
    setSwitches(next);
  };

  const checkPattern = useCallback(() => {
    const correct = switches.every((s, i) => s === pattern[i]);
    if (correct) {
      setResult("correct");
      setTimeout(onSolve, 1200);
    } else {
      setResult("wrong");
      setAttempts(a => a + 1);
      setTimeout(() => setResult(null), 1500);
    }
  }, [switches, pattern, onSolve]);

  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] text-muted-foreground/50 text-center">TOGGLE RELAYS TO MATCH EMERGENCY FREQUENCY</p>

      {/* Relay switches. Flex-wrap at every viewport so all 11 switches
          wrap cleanly rather than overflowing the modal's inner width
          and clipping switch #1 off the left edge. max-w-full + min-w-0
          keeps this resilient to ancestors that might clip. */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2 max-w-full min-w-0">
        {switches.map((on, i) => (
          <button
            key={i}
            onClick={() => toggleSwitch(i)}
            className="flex flex-col items-center gap-1.5 transition-all shrink-0"
          >
            <div
              className="w-10 h-14 rounded-md flex items-center justify-center transition-all duration-300"
              style={{
                background: on ? "color-mix(in oklch, var(--energy-primary) 20%, transparent)" : "color-mix(in oklch, var(--text-primary) 3%, transparent)",
                border: `2px solid ${on ? "color-mix(in oklch, var(--energy-primary) 50%, transparent)" : "color-mix(in oklch, var(--text-primary) 10%, transparent)"}`,
                boxShadow: on ? "0 0 15px color-mix(in oklch, var(--energy-primary) 20%, transparent)" : "none",
              }}
            >
              <div
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  background: on ? "var(--neon-cyan)" : "color-mix(in oklch, var(--text-primary) 10%, transparent)",
                  boxShadow: on ? "0 0 8px var(--neon-cyan)" : "none",
                }}
              />
            </div>
            <span className="font-mono text-[9px] text-muted-foreground/50">{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Binary display */}
      <p className="font-mono text-xs sm:text-sm text-center tracking-[0.3em] sm:tracking-[0.4em] break-all" style={{ color: "var(--neon-cyan)" }}>
        {switches.map(s => s ? "1" : "0").join("")}
      </p>

      <div className="text-center">
        <button
          onClick={checkPattern}
          className="px-6 py-2 rounded-md font-mono text-[10px] tracking-wider transition-all"
          style={{
            background: "color-mix(in oklch, var(--energy-primary) 10%, transparent)",
            border: "1px solid color-mix(in oklch, var(--energy-primary) 30%, transparent)",
            color: "var(--neon-cyan)",
          }}
        >
          ACTIVATE RELAY
        </button>
      </div>

      <AnimatePresence>
        {result === "correct" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 void-text-energy font-mono text-xs">
            <CheckCircle size={14} /> POWER RESTORED
          </motion.div>
        )}
        {result === "wrong" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 void-text-error font-mono text-xs">
            <XCircle size={14} /> FREQUENCY MISMATCH
          </motion.div>
        )}
      </AnimatePresence>

      {/* F10 — the hint button is gated on clue-bridge-01, not on failed
          attempts. If the player hasn't logged the Ark designation clue
          yet, the button is not visible and the static elaraHint never
          shows. This prevents auto-solving via brute-force retries. */}
      {bridgeDesignationFound && (
        <button
          onClick={askElaraForHelp}
          className="font-mono text-[10px] void-text-accent transition-colors block mx-auto underline underline-offset-2"
        >
          [Ask Elara for Help]
        </button>
      )}
    </div>
  );
}

function KeycardPuzzle({ puzzle, hasItem, onSolve }: { puzzle: Puzzle; hasItem: boolean; onSolve: () => void }) {
  // The hint is opt-in. Surfacing the full solution path the moment the
  // door opens collapses the murder-mystery into a checklist; the player
  // sees "BRIDGE ACCESS — DEAD-LOCKED" and is immediately told to take
  // the data-slate to the Med Bay autopsy console. The hint stays
  // available, but only when the player asks for it.
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{
        background: hasItem ? "color-mix(in oklch, var(--energy-success) 10%, transparent)" : "rgba(255,50,50,0.1)",
        border: `2px solid ${hasItem ? "color-mix(in oklch, var(--energy-success) 30%, transparent)" : "rgba(255,50,50,0.3)"}`,
      }}>
        {hasItem ? <Key size={24} className="void-text-energy" /> : <Lock size={24} className="void-text-error" />}
      </div>

      {hasItem ? (
        <>
          <p className="font-mono text-xs void-text-energy">KEYCARD DETECTED</p>
          <button
            onClick={onSolve}
            className="px-6 py-2.5 rounded-md font-mono text-xs tracking-wider transition-all hover:scale-105"
            style={{
              background: "color-mix(in oklch, var(--energy-success) 10%, transparent)",
              border: "1px solid color-mix(in oklch, var(--energy-success) 30%, transparent)",
              color: "var(--energy-success)",
            }}
          >
            USE KEYCARD
          </button>
        </>
      ) : (
        <>
          <p className="font-mono text-xs void-text-error">KEYCARD REQUIRED</p>
          <p className="font-mono text-[10px] text-muted-foreground/60 max-w-xs mx-auto">
            You need the <span className="void-text-accent">{puzzle.requiredItem?.replace(/-/g, " ")}</span> to access this area.
          </p>
          {showHint ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-md p-3 max-w-xs mx-auto"
              style={{
                background: "color-mix(in oklch, var(--energy-premium) 5%, transparent)",
                border: "1px solid color-mix(in oklch, var(--energy-premium) 15%, transparent)",
              }}
            >
              <p className="font-mono text-[10px] void-text-accent">ELARA: {puzzle.elaraHint}</p>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="font-mono text-[10px] void-text-accent transition-colors block mx-auto underline underline-offset-2"
            >
              [Ask Elara for Help]
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ─── MAIN PUZZLE MODAL ─── */
export default function PuzzleModal({
  roomId,
  itemsCollected,
  solvedPuzzles,
  collectedClues,
  narrativeFlags,
  onSolve,
  onClose,
}: {
  roomId: string;
  itemsCollected: string[];
  /**
   * audit/16 PR 8 (ER1) — sequencing prerequisite state. Optional
   * for back-compat; callers that don't pass these see the legacy
   * "all puzzles always solvable" behaviour.
   */
  solvedPuzzles?: ReadonlySet<string>;
  collectedClues?: ReadonlySet<string>;
  narrativeFlags?: ReadonlySet<string>;
  onSolve: (roomId: string) => void;
  onClose: () => void;
}) {
  const puzzle = ROOM_PUZZLES[roomId];
  const [solved, setSolved] = useState(false);

  if (!puzzle) return null;

  // audit/16 PR 8 (ER1) — sequencing-lock check. If any prerequisite
  // is unmet, the per-type checkAnswer paths still fire (so the
  // player sees their input was valid) but the parent won't dispatch
  // the solve mutation. The "missing" list drives the gating
  // tooltip on the modal so players know what to do next.
  const unlockState = getPuzzleUnlockState(puzzle, {
    solvedPuzzles: solvedPuzzles ?? new Set(),
    collectedClues: collectedClues ?? new Set(),
    narrativeFlags: narrativeFlags ?? new Set(),
  });

  const handleSolve = () => {
    if (!unlockState.unlocked) return;
    setSolved(true);
    setTimeout(() => onSolve(roomId), 1500);
  };

  const hasRequiredItem = puzzle.requiredItem ? itemsCollected.includes(puzzle.requiredItem) : false;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="relative rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
          border: "1px solid color-mix(in oklch, var(--energy-primary) 20%, transparent)",
          boxShadow: "0 0 60px color-mix(in oklch, var(--energy-primary) 8%, transparent), 0 20px 80px color-mix(in oklch, var(--bg-void) 70%, transparent)",
        }}
      >
        {/* Header */}
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="void-text-accent" />
              <h3 className="font-display text-sm font-bold tracking-[0.15em] void-text-accent">{puzzle.title}</h3>
            </div>
            <button onClick={onClose} className="font-mono text-[10px] text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors">
              [close]
            </button>
          </div>
          <p className="font-mono text-[11px] text-muted-foreground/70 leading-relaxed mb-4">{puzzle.description}</p>
        </div>

        {/* Puzzle content */}
        <div className="p-4 pt-0">
          {solved ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{
                background: "color-mix(in oklch, var(--energy-success) 15%, transparent)",
                border: "2px solid color-mix(in oklch, var(--energy-success) 40%, transparent)",
                boxShadow: "0 0 30px color-mix(in oklch, var(--energy-success) 20%, transparent)",
              }}>
                <CheckCircle size={28} className="void-text-energy" />
              </div>
              <p className="font-display text-lg font-bold tracking-[0.2em] void-text-energy mb-1">PUZZLE SOLVED</p>
              <p className="font-mono text-xs text-muted-foreground/60">Unlocking {roomId.replace(/-/g, " ")}...</p>
            </motion.div>
          ) : (
            <>
              {puzzle.type === "riddle" && <RiddlePuzzle puzzle={puzzle} onSolve={handleSolve} />}
              {puzzle.type === "sequence" && <SequencePuzzle puzzle={puzzle} onSolve={handleSolve} />}
              {puzzle.type === "cipher" && <CipherPuzzle puzzle={puzzle} onSolve={handleSolve} />}
              {puzzle.type === "power_relay" && <PowerRelayPuzzle puzzle={puzzle} onSolve={handleSolve} />}
              {puzzle.type === "keycard" && <KeycardPuzzle puzzle={puzzle} hasItem={hasRequiredItem} onSolve={handleSolve} />}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}


