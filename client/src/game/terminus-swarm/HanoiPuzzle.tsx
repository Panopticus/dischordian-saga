/* ═══════════════════════════════════════════════════════
   TOWERS OF HANOI PUZZLE — Gear Repair Mini-Game
   The player must repair the Ark's long-range comms
   by moving gears between three spindles.
   Themed as repairing mechanical components.

   Lore: The comms array uses a cascading gear mechanism.
   The gears were knocked out of alignment in the crash.
   Move all gears from the left spindle to the right.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HanoiPuzzleProps {
  numDiscs?: number;  // 4 = moderate challenge, 5 = harder
  onComplete: () => void;
  onSkip?: () => void;
}

type Spindle = number[]; // Array of disc sizes (larger number = bigger gear)

const GEAR_COLORS = [
  "#ff6b6b", // smallest — red
  "#ffa94d", // orange
  "#ffd43b", // yellow
  "#69db7c", // green
  "#74c0fc", // blue
  "#b197fc", // purple
  "#f06595", // pink
];

const SPINDLE_NAMES = ["Input Shaft", "Transfer Shaft", "Output Shaft"];

export default function HanoiPuzzle({ numDiscs = 4, onComplete, onSkip }: HanoiPuzzleProps) {
  const [spindles, setSpindles] = useState<[Spindle, Spindle, Spindle]>(() => {
    const initial: number[] = [];
    for (let i = numDiscs; i >= 1; i--) initial.push(i);
    return [initial, [], []];
  });
  const [selectedSpindle, setSelectedSpindle] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimalMoves = Math.pow(2, numDiscs) - 1;

  const handleSpindleClick = useCallback((index: number) => {
    if (complete) return;

    if (selectedSpindle === null) {
      // Select a spindle to pick up from
      if (spindles[index].length === 0) {
        setError("No gears on this shaft.");
        setTimeout(() => setError(null), 1500);
        return;
      }
      setSelectedSpindle(index);
      setError(null);
    } else {
      // Place gear on this spindle
      if (selectedSpindle === index) {
        setSelectedSpindle(null); // Deselect
        return;
      }

      const fromSpindle = [...spindles[selectedSpindle]];
      const toSpindle = [...spindles[index]];
      const gear = fromSpindle[fromSpindle.length - 1];

      // Check if valid move (can't place larger on smaller)
      if (toSpindle.length > 0 && toSpindle[toSpindle.length - 1] < gear) {
        setError("A larger gear can't go on a smaller one.");
        setTimeout(() => setError(null), 1500);
        setSelectedSpindle(null);
        return;
      }

      // Make the move
      fromSpindle.pop();
      toSpindle.push(gear);

      const newSpindles: [Spindle, Spindle, Spindle] = [...spindles] as any;
      newSpindles[selectedSpindle] = fromSpindle;
      newSpindles[index] = toSpindle;
      setSpindles(newSpindles);
      setSelectedSpindle(null);
      setMoves(m => m + 1);

      // Check completion (all gears on the rightmost spindle)
      if (newSpindles[2].length === numDiscs) {
        setComplete(true);
        setTimeout(onComplete, 1500);
      }
    }
  }, [selectedSpindle, spindles, numDiscs, complete, onComplete]);

  const handleReset = () => {
    const initial: number[] = [];
    for (let i = numDiscs; i >= 1; i--) initial.push(i);
    setSpindles([initial, [], []]);
    setSelectedSpindle(null);
    setMoves(0);
    setComplete(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-xl tracking-[0.2em] text-amber-400 mb-2">COMMS ARRAY REPAIR</h2>
        <p className="font-mono text-sm text-white/60 max-w-md">
          The cascading gear mechanism is misaligned. Move all {numDiscs} gears
          from the Input Shaft to the Output Shaft. A larger gear can never be
          placed on a smaller one.
        </p>
      </div>

      {/* Move counter */}
      <div className="flex items-center gap-4 font-mono text-sm">
        <span className="text-white/40">Moves: <span className="text-white font-bold">{moves}</span></span>
        <span className="text-white/20">|</span>
        <span className="text-white/40">Optimal: <span className="text-amber-400">{optimalMoves}</span></span>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 font-mono text-xs"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Spindles */}
      <div className="flex gap-8 sm:gap-16">
        {spindles.map((spindle, spIdx) => (
          <div key={spIdx} className="flex flex-col items-center gap-2">
            {/* Spindle label */}
            <p className={`font-mono text-[10px] tracking-wider ${selectedSpindle === spIdx ? "text-amber-400" : "text-white/30"}`}>
              {SPINDLE_NAMES[spIdx]}
            </p>

            {/* Spindle visual */}
            <button
              onClick={() => handleSpindleClick(spIdx)}
              className={`relative w-32 h-48 sm:w-40 sm:h-56 flex flex-col-reverse items-center justify-start gap-1 pt-2 rounded-xl border-2 transition-all ${
                selectedSpindle === spIdx
                  ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              {/* Spindle rod */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-40 sm:h-48 rounded-full bg-white/10" />

              {/* Gears */}
              {spindle.map((size, gIdx) => {
                const width = 20 + size * 16;
                const color = GEAR_COLORS[size - 1] || GEAR_COLORS[0];
                return (
                  <motion.div
                    key={`gear-${size}`}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative z-10 rounded-lg flex items-center justify-center"
                    style={{
                      width: `${width}px`,
                      height: "24px",
                      backgroundColor: color + "30",
                      border: `2px solid ${color}`,
                      boxShadow: gIdx === spindle.length - 1 && selectedSpindle === spIdx
                        ? `0 0 12px ${color}80`
                        : "none",
                    }}
                  >
                    {/* Gear teeth decoration */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: size + 1 }, (_, i) => (
                        <div key={i} className="w-1.5 h-3 rounded-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </button>
          </div>
        ))}
      </div>

      {/* Completion */}
      {complete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="font-display text-lg text-amber-400 tracking-wider mb-2">COMMS ARRAY ONLINE</p>
          <p className="font-mono text-sm text-white/60">
            Completed in {moves} moves{moves === optimalMoves ? " — PERFECT!" : ""}
          </p>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handleReset} className="px-4 py-2 border border-white/20 text-white/40 rounded-lg font-mono text-xs hover:text-white/70 hover:border-white/30 transition-colors">
          RESET
        </button>
        {onSkip && (
          <button onClick={onSkip} className="px-4 py-2 border border-white/10 text-white/20 rounded-lg font-mono text-xs hover:text-white/40 transition-colors">
            SKIP PUZZLE
          </button>
        )}
      </div>
    </div>
  );
}
