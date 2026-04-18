/* ═══════════════════════════════════════════════════════
   IDEOLOGY PAGE

   Shows the 6 mutually-exclusive political visions. Player
   commits to one, unlocks its 5-stage meditation path, and
   faces the consequences.

   "Every vision has a promise and a cost. Pick the one you
    can live with."
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Lock, Check, AlertTriangle, Scroll, Flag } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  POLITICAL_VISIONS,
  getVisionProgress,
  canPursueVision,
  type VisionId,
} from "@/game/politicalVisions";

const VISION_COLORS: Record<string, { color: string; border: string; bg: string; gradient: string }> = {
  architect: { color: "void-text-energy", border: "void-border-success", bg: "void-bg-success", gradient: "from-cyan-500/20 to-blue-500/10" },
  dreamer: { color: "void-text-accent", border: "void-border", bg: "void-bg-sunk", gradient: "from-amber-500/20 to-orange-500/10" },
  insurgency: { color: "void-text-error", border: "void-border-error", bg: "void-bg-error", gradient: "from-red-500/20 to-rose-500/10" },
  new_babylon: { color: "void-text-system", border: "void-border-system", bg: "void-bg-system", gradient: "from-purple-500/20 to-indigo-500/10" },
  hierarchy: { color: "void-text", border: "void-border", bg: "void-bg-canvas", gradient: "from-slate-500/20 to-zinc-500/10" },
  antiquarian: { color: "void-text-premium", border: "void-border", bg: "void-bg-sunk", gradient: "from-yellow-500/20 to-amber-500/10" },
};

export default function IdeologyPage() {
  const { state, commitIdeology } = useGame();
  const committedTo = state.ideologyCommitted as VisionId | null;
  const [selectedVision, setSelectedVision] = useState<VisionId | null>(null);
  const flags = state.ideologyFlags;

  const selected = selectedVision ? POLITICAL_VISIONS.find(v => v.id === selectedVision) : null;
  const selectedStyle = selected ? VISION_COLORS[selectedVision!] ?? VISION_COLORS.architect : null;
  const progress = selectedVision ? getVisionProgress(selectedVision, { flags }) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Flag size={18} className="void-text-system" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">POLITICAL VISIONS</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              Six ideologies. One commitment. Every choice costs something.
            </p>
          </div>
        </div>

        {/* Commitment status */}
        {committedTo && (
          <div className="mb-4 p-2 rounded border void-border-system void-bg-system">
            <span className="font-mono text-[9px] uppercase tracking-wider void-text-system">Committed To: </span>
            <span className="font-display text-xs font-bold text-foreground">
              {POLITICAL_VISIONS.find(v => v.id === committedTo)?.name}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Vision list */}
          <div className="lg:col-span-1 space-y-2">
            {POLITICAL_VISIONS.map(v => {
              const style = VISION_COLORS[v.id] ?? VISION_COLORS.architect;
              const pursuable = canPursueVision(v.id, committedTo);
              const isSelected = selectedVision === v.id;
              const isCommitted = committedTo === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVision(v.id)}
                  disabled={!pursuable && !isCommitted}
                  className={`w-full text-left p-3 rounded border transition-all ${
                    isSelected ? `${style.border} ${style.bg} shadow-md` : "border-border/30 bg-card/40 hover:bg-card/60"
                  } ${!pursuable && !isCommitted ? "opacity-40 cursor-not-allowed" : ""}`}
                  data-testid={`vision-${v.id}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-display text-sm font-bold ${isSelected ? style.color : "text-foreground"}`}>
                      {v.name}
                    </span>
                    {isCommitted && <Check size={12} className={style.color} />}
                    {!pursuable && !isCommitted && <Lock size={10} className="text-muted-foreground/40" />}
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
                    {v.faction}
                  </span>
                  <p className="font-mono text-[9px] text-muted-foreground/80 mt-1 italic leading-relaxed line-clamp-2">
                    "{v.coreBelief}"
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected && selectedStyle ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg border ${selectedStyle.border} bg-gradient-to-br ${selectedStyle.gradient}`}
                >
                  {/* Title */}
                  <div className="mb-3">
                    <h2 className={`font-display text-xl font-bold ${selectedStyle.color}`}>{selected.name}</h2>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                      {selected.faction}
                    </span>
                  </div>

                  {/* Core belief */}
                  <div className="mb-3 p-2.5 rounded border border-border/20 bg-background/40">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 block mb-0.5">
                      Core Belief
                    </span>
                    <p className="font-mono text-[11px] italic text-foreground leading-relaxed">"{selected.coreBelief}"</p>
                  </div>

                  {/* Promise / Cost */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 rounded border void-border-success void-bg-success">
                      <span className="font-mono text-[9px] uppercase tracking-wider void-text-energy block mb-0.5">
                        Promise
                      </span>
                      <p className="font-mono text-[10px] text-foreground/90 leading-relaxed">{selected.promise}</p>
                    </div>
                    <div className="p-2 rounded border void-border-error void-bg-error">
                      <span className="font-mono text-[9px] uppercase tracking-wider void-text-error block mb-0.5">
                        Cost
                      </span>
                      <p className="font-mono text-[10px] text-foreground/90 leading-relaxed">{selected.cost}</p>
                    </div>
                  </div>

                  {/* Consequences */}
                  {selected.consequences.length > 0 && (
                    <div className="mb-3 p-2 rounded border void-border void-bg-sunk">
                      <div className="flex items-center gap-1.5 mb-1">
                        <AlertTriangle size={10} className="void-text-premium" />
                        <span className="font-mono text-[9px] uppercase tracking-wider void-text-premium">
                          What Commits Away
                        </span>
                      </div>
                      <ul className="space-y-0.5">
                        {selected.consequences.map((c, i) => (
                          <li key={i} className="font-mono text-[9px] text-foreground/70">▸ {c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 5 Meditation Stages */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Scroll size={10} className={selectedStyle.color} />
                      <span className={`font-mono text-[9px] uppercase tracking-wider ${selectedStyle.color}`}>
                        Meditation Path · {Math.round(progress * 100)}% deep
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {selected.stages.map(s => {
                        const unlocked = progress >= s.stage / 5;
                        return (
                          <div
                            key={s.stage}
                            className={`p-2 rounded border ${unlocked ? selectedStyle.border : "border-border/20"} ${unlocked ? selectedStyle.bg : "bg-background/20"}`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={`font-mono text-[10px] font-bold ${unlocked ? selectedStyle.color : "text-muted-foreground/50"}`}>
                                STAGE {s.stage}: {s.name}
                              </span>
                              {!unlocked && <Lock size={9} className="text-muted-foreground/40" />}
                            </div>
                            <span className="font-mono text-[9px] text-muted-foreground/70 block">
                              Requires: {s.requirement}
                            </span>
                            {unlocked && (
                              <p className="font-mono text-[9px] italic text-foreground/80 mt-1 leading-relaxed">
                                "{s.revelation}"
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Commit button */}
                  {!committedTo && canPursueVision(selected.id, committedTo) && (
                    <button
                      onClick={() => commitIdeology(selected.id)}
                      className={`w-full px-3 py-2 rounded border ${selectedStyle.border} ${selectedStyle.bg} ${selectedStyle.color} font-mono text-[10px] uppercase tracking-wider hover:brightness-125 transition-all`}
                      data-testid={`commit-${selected.id}`}
                    >
                      Commit to {selected.name}
                    </button>
                  )}
                  {committedTo === selected.id && (
                    <div className="text-center py-2 font-mono text-[10px] uppercase tracking-wider void-text-energy">
                      ✓ COMMITTED — There is no going back
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="p-8 void-surface text-center">
                  <Flag size={32} className="text-muted-foreground/20 mx-auto mb-3" />
                  <p className="font-mono text-[10px] text-muted-foreground/60 italic">
                    Select a vision to study it. Understand what it promises and what it costs before you commit.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
