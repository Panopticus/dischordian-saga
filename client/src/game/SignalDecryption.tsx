/**
 * SignalDecryption — Wordle-style minigame for the Comms Array room.
 *
 * Guess the daily 5-letter lore word in 6 attempts. Letters are marked
 * green (correct), amber (misplaced), or gray (absent). Daily word rotates
 * based on a date seed. Rewards XP + signal fragments on completion.
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, X, Share2 } from "lucide-react";

/* ═══ PROPS ═══ */
interface SignalDecryptionProps {
  onComplete: (won: boolean, guesses: number) => void;
  onClose: () => void;
}

/* ═══ CONSTANTS ═══ */
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

const WORD_LIST = [
  "ELARA", "DREAM", "VIRUS", "FORGE", "TOWER", "SWARM", "BLADE", "QUEEN",
  "FLAME", "GHOST", "VALOR", "CRYPT", "NEXUS", "VENOM", "SPIRE", "CHAOS",
  "ORDER", "CURSE", "ANGEL", "DEMON", "LIGHT", "SHADE", "REALM", "STEEL",
  "PULSE", "DRIFT", "SIEGE", "ROYAL",
];

type LetterState = "correct" | "present" | "absent" | "empty";

interface CellData {
  letter: string;
  state: LetterState;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const STATS_KEY = "signal_decryption_stats";

interface GameStats {
  played: number;
  wins: number;
  streak: number;
  maxStreak: number;
  distribution: number[];
}

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { played: 0, wins: 0, streak: 0, maxStreak: 0, distribution: Array(MAX_GUESSES).fill(0) };
}

function saveStats(stats: GameStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

/* ═══ DAILY WORD ═══ */
function getDailyWord(): string {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return WORD_LIST[dayIndex % WORD_LIST.length];
}

/* ═══ EVALUATE GUESS ═══ */
function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill("absent");
  const answerChars = answer.split("");
  const remaining: (string | null)[] = [...answerChars];

  // First pass: mark correct
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answerChars[i]) {
      result[i] = "correct";
      remaining[i] = null;
    }
  }
  // Second pass: mark present
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = "present";
      remaining[idx] = null;
    }
  }
  return result;
}

/* ═══ SHARE RESULT ═══ */
function buildShareText(board: CellData[][], won: boolean, guessCount: number): string {
  const dayNum = Math.floor(Date.now() / 86400000);
  const header = `SIGNAL DECRYPTION #${dayNum} — ${won ? guessCount : "X"}/${MAX_GUESSES}\n\n`;
  const grid = board
    .filter((row) => row.some((c) => c.letter !== ""))
    .map((row) =>
      row.map((c) => (c.state === "correct" ? "🟩" : c.state === "present" ? "🟨" : "⬛")).join("")
    )
    .join("\n");
  return header + grid;
}

/* ═══ STATIC NOISE BACKGROUND ═══ */
function StaticNoise() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.04]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
          animation: "static-shift 0.15s steps(3) infinite",
        }}
      />
      <style>{`@keyframes static-shift { 0%{transform:translate(0,0)} 33%{transform:translate(-2px,1px)} 66%{transform:translate(1px,-2px)} 100%{transform:translate(0,0)} }`}</style>
    </div>
  );
}

/* ═══ TILE COMPONENT ═══ */
function Tile({ cell, delay, revealed }: { cell: CellData; delay: number; revealed: boolean }) {
  const bg =
    cell.state === "correct"
      ? "bg-cyan-600 border-cyan-500"
      : cell.state === "present"
        ? "bg-amber-600 border-amber-500"
        : cell.state === "absent"
          ? "bg-zinc-700 border-zinc-600"
          : "border-zinc-600";

  return (
    <motion.div
      className={`flex h-14 w-14 items-center justify-center rounded border-2 text-2xl font-bold uppercase ${revealed ? bg : cell.letter ? "border-zinc-400" : "border-zinc-600"}`}
      initial={revealed ? { rotateX: 0 } : false}
      animate={revealed ? { rotateX: [0, 90, 0] } : {}}
      transition={{ delay, duration: 0.45, ease: "easeInOut" }}
    >
      {cell.letter}
    </motion.div>
  );
}

/* ═══ MAIN COMPONENT ═══ */
export default function SignalDecryption({ onComplete, onClose }: SignalDecryptionProps) {
  const answer = useMemo(getDailyWord, []);
  const [board, setBoard] = useState<CellData[][]>(() =>
    Array.from({ length: MAX_GUESSES }, () =>
      Array.from({ length: WORD_LENGTH }, () => ({ letter: "", state: "empty" as LetterState }))
    )
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [showStats, setShowStats] = useState(false);
  const [copied, setCopied] = useState(false);

  /* keyboard state map */
  const keyStates = useMemo(() => {
    const map = new Map<string, LetterState>();
    for (let r = 0; r < currentRow; r++) {
      for (let c = 0; c < WORD_LENGTH; c++) {
        const { letter, state } = board[r][c];
        if (!letter) continue;
        const prev = map.get(letter);
        if (state === "correct" || (!prev && state !== "empty") || (prev === "absent" && state === "present")) {
          map.set(letter, state);
        }
      }
    }
    return map;
  }, [board, currentRow]);

  /* Elara hint after 3 wrong guesses */
  const showHint = currentRow >= 3 && !won && !gameOver;

  const flashMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1800);
  }, []);

  const submitGuess = useCallback(() => {
    const guess = board[currentRow].map((c) => c.letter).join("");
    if (guess.length < WORD_LENGTH) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      flashMessage("Not enough letters");
      return;
    }
    const states = evaluateGuess(guess, answer);
    setBoard((prev) => {
      const next = prev.map((row) => row.map((c) => ({ ...c })));
      for (let i = 0; i < WORD_LENGTH; i++) next[currentRow][i].state = states[i];
      return next;
    });
    setRevealedRows((prev) => new Set(prev).add(currentRow));

    const isWin = states.every((s) => s === "correct");
    const isLast = currentRow === MAX_GUESSES - 1;

    setTimeout(() => {
      if (isWin) {
        setWon(true);
        setGameOver(true);
        flashMessage("Signal decoded!");
        const next = { ...stats, played: stats.played + 1, wins: stats.wins + 1, streak: stats.streak + 1, maxStreak: Math.max(stats.maxStreak, stats.streak + 1), distribution: [...stats.distribution] };
        next.distribution[currentRow]++;
        setStats(next);
        saveStats(next);
        onComplete(true, currentRow + 1);
      } else if (isLast) {
        setGameOver(true);
        flashMessage(`Signal lost — word was ${answer}`);
        const next = { ...stats, played: stats.played + 1, streak: 0, distribution: [...stats.distribution] };
        setStats(next);
        saveStats(next);
        onComplete(false, MAX_GUESSES);
      }
      setCurrentRow((r) => r + 1);
      setCurrentCol(0);
    }, WORD_LENGTH * 120 + 300);
  }, [board, currentRow, answer, stats, onComplete, flashMessage]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver) return;
      if (key === "ENTER") return submitGuess();
      if (key === "⌫" || key === "BACKSPACE") {
        if (currentCol > 0) {
          setBoard((prev) => {
            const next = prev.map((row) => row.map((c) => ({ ...c })));
            next[currentRow][currentCol - 1].letter = "";
            return next;
          });
          setCurrentCol((c) => c - 1);
        }
        return;
      }
      if (/^[A-Z]$/.test(key) && currentCol < WORD_LENGTH) {
        setBoard((prev) => {
          const next = prev.map((row) => row.map((c) => ({ ...c })));
          next[currentRow][currentCol].letter = key;
          return next;
        });
        setCurrentCol((c) => c + 1);
      }
    },
    [gameOver, currentRow, currentCol, submitGuess]
  );

  /* Physical keyboard listener */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKey(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const handleShare = () => {
    const text = buildShareText(board, won, currentRow);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ═══ RENDER ═══ */
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-6 text-white select-none overflow-hidden">
      {/* Background art */}
      <img src="/art/minigames/minigame-signal-decryption.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: 0.12, filter: "brightness(0.35) saturate(0.7)" }} />
      <StaticNoise />

      {/* Header */}
      <div className="relative z-10 mb-4 flex w-full max-w-sm items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-400">
          <Radio size={20} />
          <span className="text-sm font-bold tracking-widest uppercase">Signal Decryption</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowStats(true)} className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800">Stats</button>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
        </div>
      </div>

      {/* Flash message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute top-16 z-20 rounded bg-zinc-800 px-4 py-2 text-sm font-semibold"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board */}
      <motion.div
        className="relative z-10 mb-4 grid gap-1.5"
        animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.35 }}
      >
        {board.map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map((cell, ci) => (
              <Tile key={`${ri}-${ci}`} cell={cell} delay={revealedRows.has(ri) ? ci * 0.12 : 0} revealed={revealedRows.has(ri)} />
            ))}
          </div>
        ))}
      </motion.div>

      {/* Elara hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="relative z-10 mb-3 max-w-sm rounded border border-cyan-900/50 bg-cyan-950/40 px-4 py-2 text-center text-xs text-cyan-300"
          >
            <span className="font-semibold">Elara:</span> "The signal starts with{" "}
            <span className="font-bold text-cyan-100">{answer[0]}</span>... I can feel it."
          </motion.div>
        )}
      </AnimatePresence>

      {/* Virtual keyboard */}
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map((key) => {
              const state = keyStates.get(key);
              const bg =
                state === "correct"
                  ? "bg-cyan-600"
                  : state === "present"
                    ? "bg-amber-600"
                    : state === "absent"
                      ? "bg-zinc-700 text-zinc-500"
                      : "bg-zinc-600";
              const wide = key === "ENTER" || key === "⌫";
              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={`flex h-12 items-center justify-center rounded text-sm font-bold transition-colors ${bg} ${wide ? "px-3 text-xs" : "w-9"}`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Game-over share button */}
      {gameOver && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="relative z-10 mt-4">
          <button onClick={handleShare} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 font-semibold text-white hover:bg-cyan-500">
            <Share2 size={16} /> {copied ? "Copied!" : "Share Result"}
          </button>
        </motion.div>
      )}

      {/* Stats modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/70"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-72 void-surface p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-3 text-center text-sm font-bold tracking-wider uppercase text-cyan-400">Statistics</h3>
              <div className="mb-4 grid grid-cols-4 gap-2 text-center">
                {[
                  [stats.played, "Played"],
                  [stats.played ? Math.round((stats.wins / stats.played) * 100) : 0, "Win %"],
                  [stats.streak, "Streak"],
                  [stats.maxStreak, "Max"],
                ].map(([val, label]) => (
                  <div key={label as string}>
                    <div className="text-2xl font-bold">{val}</div>
                    <div className="text-[10px] text-zinc-400">{label}</div>
                  </div>
                ))}
              </div>
              <h4 className="mb-2 text-center text-xs font-semibold text-zinc-400">Guess Distribution</h4>
              <div className="space-y-1">
                {stats.distribution.map((count, i) => {
                  const maxD = Math.max(...stats.distribution, 1);
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-right text-zinc-400">{i + 1}</span>
                      <div className="h-4 rounded-sm bg-cyan-700" style={{ width: `${Math.max((count / maxD) * 100, 8)}%` }}>
                        <span className="px-1 text-[10px] font-bold leading-4">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setShowStats(false)} className="mt-4 w-full rounded bg-zinc-700 py-1.5 text-xs hover:bg-zinc-600">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
