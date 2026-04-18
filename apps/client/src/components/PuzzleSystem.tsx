/* ═══════════════════════════════════════════════════════
   PUZZLE SYSTEM — Lore riddles and keycard puzzles
   that gate access to locked rooms on the Inception Ark.
   Each room has a unique puzzle type.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Key, Brain, Terminal, AlertTriangle, CheckCircle, XCircle, RotateCcw } from "lucide-react";

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
}

/* ─── PUZZLE DEFINITIONS ─── */
export const ROOM_PUZZLES: Record<string, Puzzle> = {
  "bridge": {
    id: "puzzle-bridge",
    roomId: "bridge",
    type: "power_relay",
    title: "BRIDGE POWER RELAY",
    description: "The bridge power grid is offline. Activate the correct relay sequence to restore main power. Toggle the switches to match the ship's emergency frequency pattern.",
    elaraHint: "The emergency frequency follows a binary pattern based on the Ark's designation number — 1047. In binary, that's 10000010111. Toggle the relays to match.",
    relayPattern: [true, false, false, false, false, false, true, false, true, true, true], // 1047 in binary = 10000010111
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
  const pattern = puzzle.relayPattern || [];
  const [switches, setSwitches] = useState<boolean[]>(pattern.map(() => false));
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

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

      {/* Relay switches */}
      <div className="flex justify-center gap-3">
        {switches.map((on, i) => (
          <button
            key={i}
            onClick={() => toggleSwitch(i)}
            className="flex flex-col items-center gap-1.5 transition-all"
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
      <p className="font-mono text-xs text-center tracking-[0.5em]" style={{ color: "var(--neon-cyan)" }}>
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

      {attempts >= 2 && !showHint && (
        <button onClick={() => setShowHint(true)} className="font-mono text-[10px] void-text-accent void-text-accent transition-colors block mx-auto">
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

function KeycardPuzzle({ puzzle, hasItem, onSolve }: { puzzle: Puzzle; hasItem: boolean; onSolve: () => void }) {
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
          <div className="rounded-md p-3 max-w-xs mx-auto" style={{
            background: "color-mix(in oklch, var(--energy-premium) 5%, transparent)",
            border: "1px solid color-mix(in oklch, var(--energy-premium) 15%, transparent)",
          }}>
            <p className="font-mono text-[10px] void-text-accent">ELARA: {puzzle.elaraHint}</p>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── MAIN PUZZLE MODAL ─── */
export default function PuzzleModal({
  roomId,
  itemsCollected,
  onSolve,
  onClose,
}: {
  roomId: string;
  itemsCollected: string[];
  onSolve: (roomId: string) => void;
  onClose: () => void;
}) {
  const puzzle = ROOM_PUZZLES[roomId];
  const [solved, setSolved] = useState(false);

  if (!puzzle) return null;

  const handleSolve = () => {
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


