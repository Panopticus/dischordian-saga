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
    elaraHint: "The emergency frequency follows a binary pattern based on the Ark's designation number — 47. In binary, that's 101111. Toggle the relays to match.",
    relayPattern: [true, false, true, true, true, true], // 47 in binary = 101111
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
        background: "rgba(168,85,247,0.05)",
        border: "1px solid rgba(168,85,247,0.15)",
      }}>
        <Brain size={14} className="text-purple-400 mb-2" />
        <pre className="font-mono text-xs text-white/70 leading-relaxed whitespace-pre-wrap">{puzzle.riddle}</pre>
      </div>

      {/* Answer input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Enter your answer..."
          className="flex-1 bg-transparent border-b border-white/20 pb-2 font-mono text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-400/50"
          onKeyDown={e => { if (e.key === "Enter") checkAnswer(); }}
          autoFocus
        />
        <button
          onClick={checkAnswer}
          disabled={!answer.trim()}
          className="px-4 py-1.5 rounded-md font-mono text-[10px] tracking-wider transition-all disabled:opacity-30"
          style={{
            background: "rgba(168,85,247,0.1)",
            border: "1px solid rgba(168,85,247,0.3)",
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
            className="flex items-center gap-2 text-green-400 font-mono text-xs"
          >
            <CheckCircle size={14} /> ACCESS GRANTED
          </motion.div>
        )}
        {result === "wrong" && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-red-400 font-mono text-xs"
          >
            <XCircle size={14} /> INCORRECT — TRY AGAIN ({attempts} attempt{attempts !== 1 ? "s" : ""})
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint after 2 failed attempts */}
      {attempts >= 2 && !showHint && (
        <button
          onClick={() => setShowHint(true)}
          className="font-mono text-[10px] text-amber-400/50 hover:text-amber-400 transition-colors"
        >
          [Request Elara's hint]
        </button>
      )}
      {showHint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-md p-3" style={{ background: "rgba(255,183,77,0.05)", border: "1px solid rgba(255,183,77,0.15)" }}
        >
          <p className="font-mono text-[10px] text-amber-400/70">ELARA: {puzzle.elaraHint}</p>
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
              background: "rgba(51,226,230,0.1)",
              border: "1px solid rgba(51,226,230,0.3)",
              color: "var(--neon-cyan)",
            }}
          >
            {i + 1}. {item}
          </motion.div>
        ))}
        {selected.length === 0 && (
          <p className="font-mono text-[10px] text-white/20 self-center">Select systems in the correct boot order...</p>
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
                background: isSelected ? "rgba(255,255,255,0.02)" : "rgba(56,117,250,0.08)",
                border: `1px solid ${isSelected ? "rgba(255,255,255,0.05)" : "rgba(56,117,250,0.25)"}`,
                color: isSelected ? "rgba(255,255,255,0.2)" : "#3b82f6",
              }}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Reset */}
      {selected.length > 0 && result === null && (
        <button onClick={reset} className="flex items-center gap-1 font-mono text-[10px] text-white/30 hover:text-white/50 transition-colors">
          <RotateCcw size={10} /> Reset
        </button>
      )}

      {/* Result */}
      <AnimatePresence>
        {result === "correct" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-400 font-mono text-xs">
            <CheckCircle size={14} /> BOOT SEQUENCE ACCEPTED
          </motion.div>
        )}
        {result === "wrong" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 font-mono text-xs">
            <XCircle size={14} /> INCORRECT SEQUENCE — RESETTING
          </motion.div>
        )}
      </AnimatePresence>

      {attempts >= 2 && !showHint && (
        <button onClick={() => setShowHint(true)} className="font-mono text-[10px] text-amber-400/50 hover:text-amber-400 transition-colors">
          [Request Elara's hint]
        </button>
      )}
      {showHint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-md p-3" style={{ background: "rgba(255,183,77,0.05)", border: "1px solid rgba(255,183,77,0.15)" }}
        >
          <p className="font-mono text-[10px] text-amber-400/70">ELARA: {puzzle.elaraHint}</p>
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
        background: "rgba(51,226,230,0.03)",
        border: "1px solid rgba(51,226,230,0.15)",
      }}>
        <Terminal size={14} className="text-[var(--neon-cyan)] mx-auto mb-2" />
        <p className="font-mono text-[10px] text-white/30 mb-2">ENCRYPTED SIGNAL // {puzzle.cipherKey === "reverse" ? "REVERSE CIPHER" : `SHIFT-${puzzle.cipherKey}`}</p>
        <p className="font-display text-lg tracking-[0.3em] text-[var(--neon-cyan)]">{puzzle.cipherText}</p>
      </div>

      {/* Answer */}
      <div className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Enter decrypted message..."
          className="flex-1 bg-transparent border-b border-white/20 pb-2 font-mono text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[var(--neon-cyan)]/50"
          onKeyDown={e => { if (e.key === "Enter") checkAnswer(); }}
          autoFocus
        />
        <button
          onClick={checkAnswer}
          disabled={!answer.trim()}
          className="px-4 py-1.5 rounded-md font-mono text-[10px] tracking-wider transition-all disabled:opacity-30"
          style={{
            background: "rgba(51,226,230,0.1)",
            border: "1px solid rgba(51,226,230,0.3)",
            color: "var(--neon-cyan)",
          }}
        >
          DECRYPT
        </button>
      </div>

      <AnimatePresence>
        {result === "correct" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-400 font-mono text-xs">
            <CheckCircle size={14} /> DECRYPTION SUCCESSFUL
          </motion.div>
        )}
        {result === "wrong" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 font-mono text-xs">
            <XCircle size={14} /> DECRYPTION FAILED
          </motion.div>
        )}
      </AnimatePresence>

      {attempts >= 2 && !showHint && (
        <button onClick={() => setShowHint(true)} className="font-mono text-[10px] text-amber-400/50 hover:text-amber-400 transition-colors">
          [Request Elara's hint]
        </button>
      )}
      {showHint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-md p-3" style={{ background: "rgba(255,183,77,0.05)", border: "1px solid rgba(255,183,77,0.15)" }}
        >
          <p className="font-mono text-[10px] text-amber-400/70">ELARA: {puzzle.elaraHint}</p>
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
      <p className="font-mono text-[10px] text-white/30 text-center">TOGGLE RELAYS TO MATCH EMERGENCY FREQUENCY</p>

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
                background: on ? "rgba(51,226,230,0.2)" : "rgba(255,255,255,0.03)",
                border: `2px solid ${on ? "rgba(51,226,230,0.5)" : "rgba(255,255,255,0.1)"}`,
                boxShadow: on ? "0 0 15px rgba(51,226,230,0.2)" : "none",
              }}
            >
              <div
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  background: on ? "var(--neon-cyan)" : "rgba(255,255,255,0.1)",
                  boxShadow: on ? "0 0 8px var(--neon-cyan)" : "none",
                }}
              />
            </div>
            <span className="font-mono text-[9px] text-white/30">{i + 1}</span>
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
            background: "rgba(51,226,230,0.1)",
            border: "1px solid rgba(51,226,230,0.3)",
            color: "var(--neon-cyan)",
          }}
        >
          ACTIVATE RELAY
        </button>
      </div>

      <AnimatePresence>
        {result === "correct" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-green-400 font-mono text-xs">
            <CheckCircle size={14} /> POWER RESTORED
          </motion.div>
        )}
        {result === "wrong" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-red-400 font-mono text-xs">
            <XCircle size={14} /> FREQUENCY MISMATCH
          </motion.div>
        )}
      </AnimatePresence>

      {attempts >= 2 && !showHint && (
        <button onClick={() => setShowHint(true)} className="font-mono text-[10px] text-amber-400/50 hover:text-amber-400 transition-colors block mx-auto">
          [Request Elara's hint]
        </button>
      )}
      {showHint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-md p-3" style={{ background: "rgba(255,183,77,0.05)", border: "1px solid rgba(255,183,77,0.15)" }}
        >
          <p className="font-mono text-[10px] text-amber-400/70">ELARA: {puzzle.elaraHint}</p>
        </motion.div>
      )}
    </div>
  );
}

function KeycardPuzzle({ puzzle, hasItem, onSolve }: { puzzle: Puzzle; hasItem: boolean; onSolve: () => void }) {
  return (
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{
        background: hasItem ? "rgba(34,197,94,0.1)" : "rgba(255,50,50,0.1)",
        border: `2px solid ${hasItem ? "rgba(34,197,94,0.3)" : "rgba(255,50,50,0.3)"}`,
      }}>
        {hasItem ? <Key size={24} className="text-green-400" /> : <Lock size={24} className="text-red-400" />}
      </div>

      {hasItem ? (
        <>
          <p className="font-mono text-xs text-green-400">KEYCARD DETECTED</p>
          <button
            onClick={onSolve}
            className="px-6 py-2.5 rounded-md font-mono text-xs tracking-wider transition-all hover:scale-105"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "#22c55e",
            }}
          >
            USE KEYCARD
          </button>
        </>
      ) : (
        <>
          <p className="font-mono text-xs text-red-400">KEYCARD REQUIRED</p>
          <p className="font-mono text-[10px] text-white/40 max-w-xs mx-auto">
            You need the <span className="text-amber-400">{puzzle.requiredItem?.replace(/-/g, " ")}</span> to access this area.
          </p>
          <div className="rounded-md p-3 max-w-xs mx-auto" style={{
            background: "rgba(255,183,77,0.05)",
            border: "1px solid rgba(255,183,77,0.15)",
          }}>
            <p className="font-mono text-[10px] text-amber-400/70">ELARA: {puzzle.elaraHint}</p>
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
          background: "linear-gradient(135deg, rgba(1,0,32,0.99) 0%, rgba(10,12,43,0.99) 100%)",
          border: "1px solid rgba(51,226,230,0.2)",
          boxShadow: "0 0 60px rgba(51,226,230,0.08), 0 20px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400" />
              <h3 className="font-display text-sm font-bold tracking-[0.15em] text-amber-400">{puzzle.title}</h3>
            </div>
            <button onClick={onClose} className="font-mono text-[10px] text-white/30 hover:text-white/50 transition-colors">
              [close]
            </button>
          </div>
          <p className="font-mono text-[11px] text-white/50 leading-relaxed mb-4">{puzzle.description}</p>
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
                background: "rgba(34,197,94,0.15)",
                border: "2px solid rgba(34,197,94,0.4)",
                boxShadow: "0 0 30px rgba(34,197,94,0.2)",
              }}>
                <CheckCircle size={28} className="text-green-400" />
              </div>
              <p className="font-display text-lg font-bold tracking-[0.2em] text-green-400 mb-1">PUZZLE SOLVED</p>
              <p className="font-mono text-xs text-white/40">Unlocking {roomId.replace(/-/g, " ")}...</p>
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


