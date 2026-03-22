/* ═══════════════════════════════════════════════════════
   ALIEN SYMBOL MATCHING PUZZLE
   A pattern-matching mini-game on the Bridge nav console.
   Match alien glyphs to their correct positions to unlock
   the Ark's fast-travel navigation system.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, RotateCcw, Zap, Navigation } from "lucide-react";

/* ─── ALIEN GLYPHS (SVG-based symbols) ─── */
const ALIEN_GLYPHS = [
  { id: "glyph-void", name: "Void Gate", svg: "M12 2L2 12l10 10 10-10L12 2zm0 4l6 6-6 6-6-6 6-6z", color: "#a855f7" },
  { id: "glyph-nexus", name: "Nexus Point", svg: "M12 2v20M2 12h20M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36", color: "#33E2E6" },
  { id: "glyph-warp", name: "Warp Spiral", svg: "M12 2a10 10 0 0110 10 8 8 0 01-8 8 6 6 0 01-6-6 4 4 0 014-4 2 2 0 012 2", color: "#FF8C00" },
  { id: "glyph-anchor", name: "Anchor Lock", svg: "M12 2l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z", color: "#3875fa" },
  { id: "glyph-pulse", name: "Pulse Wave", svg: "M2 12h3l2-6 3 12 3-8 2 4h5", color: "#22c55e" },
  { id: "glyph-rift", name: "Rift Tear", svg: "M12 2C7 2 3 6 3 12s4 10 9 10c-3-2-5-6-5-10S9 4 12 2zm0 0c5 0 9 4 9 10s-4 10-9 10c3-2 5-6 5-10S15 4 12 2z", color: "#DC2626" },
];

function GlyphIcon({ glyph, size = 40, dimmed = false }: { glyph: typeof ALIEN_GLYPHS[0]; size?: number; dimmed?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={glyph.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      style={{ opacity: dimmed ? 0.3 : 1, filter: dimmed ? "none" : `drop-shadow(0 0 6px ${glyph.color}40)` }}
    >
      <path d={glyph.svg} />
    </svg>
  );
}

interface AlienSymbolPuzzleProps {
  onSolve: () => void;
  onClose: () => void;
}

export default function AlienSymbolPuzzle({ onSolve, onClose }: AlienSymbolPuzzleProps) {
  // Generate a random sequence of 4 glyphs to match
  const [targetSequence] = useState(() => {
    const shuffled = [...ALIEN_GLYPHS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  });

  const [phase, setPhase] = useState<"memorize" | "match" | "solved">("memorize");
  const [memorizeTimer, setMemorizeTimer] = useState(5);
  const [selectedSlots, setSelectedSlots] = useState<(typeof ALIEN_GLYPHS[0] | null)[]>([null, null, null, null]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Available glyphs to pick from (all 6, shuffled)
  const availableGlyphs = useMemo(() => {
    return [...ALIEN_GLYPHS].sort(() => Math.random() - 0.5);
  }, []);

  // Memorize countdown
  useEffect(() => {
    if (phase !== "memorize") return;
    if (memorizeTimer <= 0) {
      setPhase("match");
      return;
    }
    const t = setTimeout(() => setMemorizeTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, memorizeTimer]);

  const handleGlyphSelect = useCallback((glyph: typeof ALIEN_GLYPHS[0]) => {
    if (phase !== "match" || showResult) return;
    setSelectedSlots(prev => {
      const next = [...prev];
      next[activeSlot] = glyph;
      return next;
    });
    if (activeSlot < 3) {
      setActiveSlot(s => s + 1);
    }
  }, [phase, activeSlot, showResult]);

  const handleSlotClick = useCallback((index: number) => {
    if (phase !== "match" || showResult) return;
    setActiveSlot(index);
  }, [phase, showResult]);

  const handleSubmit = useCallback(() => {
    if (selectedSlots.some(s => s === null)) return;
    const correct = selectedSlots.every((s, i) => s?.id === targetSequence[i].id);
    if (correct) {
      setShowResult("correct");
      setTimeout(() => {
        setPhase("solved");
        setTimeout(onSolve, 1500);
      }, 1200);
    } else {
      setShowResult("wrong");
      setAttempts(a => a + 1);
      setTimeout(() => {
        setShowResult(null);
        setSelectedSlots([null, null, null, null]);
        setActiveSlot(0);
      }, 1200);
    }
  }, [selectedSlots, targetSequence, onSolve]);

  const handleReset = useCallback(() => {
    setSelectedSlots([null, null, null, null]);
    setActiveSlot(0);
    setShowResult(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--bg-void) 0%, rgba(56,117,250,0.05) 100%)",
          border: "1px solid rgba(51,226,230,0.25)",
          boxShadow: "0 0 60px rgba(51,226,230,0.1), 0 0 120px rgba(56,117,250,0.05)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--glass-border)" }}>
          <div className="flex items-center gap-2">
            <Navigation size={14} className="text-[var(--neon-cyan)]" />
            <span className="font-display text-xs font-bold tracking-[0.2em] text-[var(--neon-cyan)]">
              NAVIGATION CALIBRATION
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground/60 hover:text-muted-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Elara instruction */}
          <div className="rounded-md px-4 py-3" style={{
            background: "rgba(51,226,230,0.04)",
            border: "1px solid rgba(51,226,230,0.12)",
          }}>
            <p className="font-mono text-[10px] text-[var(--neon-cyan)]/60 tracking-[0.2em] mb-1">ELARA</p>
            <p className="font-mono text-xs text-muted-foreground/80 leading-relaxed">
              {phase === "memorize"
                ? "The navigation system uses alien glyph sequences for authentication. Memorize the symbol pattern — you'll need to reproduce it exactly."
                : phase === "match"
                ? "Now match the symbols in the correct order. Select each glyph from the panel below."
                : "Navigation system calibrated! Fast-travel is now online. You can jump to any discovered room from the nav panel."}
            </p>
          </div>

          {/* ═══ MEMORIZE PHASE ═══ */}
          {phase === "memorize" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--orb-orange)] tracking-[0.3em]">MEMORIZE SEQUENCE</span>
                <span className="font-mono text-sm font-bold" style={{ color: memorizeTimer <= 2 ? "var(--alert-red)" : "var(--neon-cyan)" }}>
                  {memorizeTimer}s
                </span>
              </div>
              <div className="flex items-center justify-center gap-4">
                {targetSequence.map((glyph, i) => (
                  <motion.div
                    key={glyph.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{
                      background: `${glyph.color}10`,
                      border: `1.5px solid ${glyph.color}40`,
                      boxShadow: `0 0 15px ${glyph.color}20`,
                    }}>
                      <GlyphIcon glyph={glyph} size={36} />
                    </div>
                    <span className="font-mono text-[8px] text-muted-foreground/50 tracking-wider">{i + 1}</span>
                  </motion.div>
                ))}
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--glass-border)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--neon-cyan)" }}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>
            </div>
          )}

          {/* ═══ MATCH PHASE ═══ */}
          {phase === "match" && (
            <div className="space-y-4">
              {/* Target slots */}
              <div>
                <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.3em] mb-3 block">REPRODUCE SEQUENCE</span>
                <div className="flex items-center justify-center gap-3">
                  {selectedSlots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => handleSlotClick(i)}
                      className="w-16 h-16 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: slot ? `${slot.color}10` : "rgba(255,255,255,0.02)",
                        border: `1.5px ${i === activeSlot ? "solid" : "dashed"} ${
                          slot ? `${slot.color}40` : i === activeSlot ? "rgba(51,226,230,0.5)" : "rgba(255,255,255,0.1)"
                        }`,
                        boxShadow: i === activeSlot ? "0 0 15px rgba(51,226,230,0.15)" : "none",
                      }}
                    >
                      {slot ? <GlyphIcon glyph={slot} size={36} /> : (
                        <span className="font-mono text-xs text-muted-foreground/20">{i + 1}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glyph picker */}
              <div>
                <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.3em] mb-3 block">SELECT GLYPHS</span>
                <div className="grid grid-cols-6 gap-2">
                  {availableGlyphs.map(glyph => (
                    <button
                      key={glyph.id}
                      onClick={() => handleGlyphSelect(glyph)}
                      className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                      style={{
                        background: `${glyph.color}08`,
                        border: `1px solid ${glyph.color}25`,
                      }}
                    >
                      <GlyphIcon glyph={glyph} size={28} />
                      <span className="font-mono text-[7px] text-muted-foreground/40 tracking-wider hidden sm:block">{glyph.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button onClick={handleReset} className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <RotateCcw size={12} /> CLEAR
                </button>
                <div className="flex items-center gap-2">
                  {attempts >= 2 && !showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="font-mono text-[10px] text-[var(--orb-orange)]/50 hover:text-[var(--orb-orange)] transition-colors"
                    >
                      SHOW HINT
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={selectedSlots.some(s => s === null)}
                    className="px-5 py-2 rounded-md font-mono text-[10px] tracking-wider transition-all disabled:opacity-30"
                    style={{
                      background: "rgba(51,226,230,0.1)",
                      border: "1px solid rgba(51,226,230,0.3)",
                      color: "var(--neon-cyan)",
                    }}
                  >
                    CALIBRATE
                  </button>
                </div>
              </div>

              {/* Result feedback */}
              <AnimatePresence>
                {showResult === "correct" && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-green-400 font-mono text-xs justify-center"
                  >
                    <CheckCircle size={14} /> CALIBRATION SUCCESSFUL — NAVIGATION ONLINE
                  </motion.div>
                )}
                {showResult === "wrong" && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-400 font-mono text-xs justify-center"
                  >
                    <Zap size={14} /> SEQUENCE MISMATCH — TRY AGAIN ({attempts} attempt{attempts !== 1 ? "s" : ""})
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hint */}
              {showHint && (
                <div className="rounded-md px-3 py-2" style={{
                  background: "rgba(255,183,77,0.05)",
                  border: "1px solid rgba(255,183,77,0.15)",
                }}>
                  <p className="font-mono text-[10px] text-[var(--orb-orange)]/70">
                    ELARA HINT: The first symbol was {targetSequence[0].name}. The sequence follows the pattern: {targetSequence.map(g => g.name.split(" ")[0]).join(" → ")}.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ═══ SOLVED PHASE ═══ */}
          {phase === "solved" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <div className="flex items-center justify-center gap-3">
                {targetSequence.map((glyph, i) => (
                  <motion.div
                    key={glyph.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlyphIcon glyph={glyph} size={32} />
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="font-display text-sm font-bold tracking-[0.2em] text-[var(--signal-green)]">NAVIGATION SYSTEM ONLINE</p>
                <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">Fast-travel to discovered rooms is now available</p>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-0.5 mx-auto rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, var(--signal-green), transparent)", maxWidth: "200px" }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
