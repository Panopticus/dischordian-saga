/* ═══════════════════════════════════════════════════════
   AutoTutorialPrompt — Slide-in prompt for first-visit tutorials
   Shows Elara offering to guide the player, with Launch / Skip / Later options.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Zap, Star, Clock, ChevronRight } from "lucide-react";
import type { LoreTutorial } from "@/data/loreTutorials";
import LoreTutorialEngine from "./LoreTutorialEngine";
import { useGame } from "@/contexts/GameContext";

interface AutoTutorialPromptProps {
  tutorial: LoreTutorial;
  show: boolean;
  onLaunch: () => void;
  onDismiss: () => void;
  onSnooze: () => void;
}

export default function AutoTutorialPrompt({
  tutorial,
  show,
  onLaunch,
  onDismiss,
  onSnooze,
}: AutoTutorialPromptProps) {
  const [showEngine, setShowEngine] = useState(false);
  const { completeTutorial } = useGame();

  const handleLaunch = () => {
    onLaunch();
    setShowEngine(true);
  };

  const handleComplete = () => {
    completeTutorial(tutorial.id);
    setShowEngine(false);
  };

  return (
    <>
      <AnimatePresence>
        {show && !showEngine && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-[140px] left-4 right-4 sm:left-auto sm:right-4 sm:bottom-4 sm:w-[380px] z-[44]"
          >
            <div className="relative rounded-xl border border-primary/30 bg-card/95 backdrop-blur-xl overflow-hidden shadow-2xl shadow-primary/10">
              {/* Glow accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

              {/* Close button */}
              <button
                onClick={onDismiss}
                className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50 transition-colors z-10"
                title="Don't show again"
              >
                <X size={14} />
              </button>

              <div className="p-4">
                {/* Header with Elara avatar */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <BookOpen size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-display text-xs font-bold tracking-[0.15em] text-primary">ELARA</span>
                      <span className="font-mono text-[9px] text-muted-foreground/60 tracking-wider">TUTORIAL GUIDE</span>
                    </div>
                    <p className="font-mono text-xs text-foreground/90 leading-relaxed">
                      Welcome, Operative. I can guide you through{" "}
                      <span className="text-primary font-semibold">{tutorial.title}</span>.
                    </p>
                  </div>
                </div>

                {/* Tutorial info */}
                <div className="rounded-lg bg-muted/40 border border-border/40 p-3 mb-3">
                  <p className="font-mono text-[10px] text-muted-foreground mb-2 leading-relaxed">
                    {tutorial.subtitle}
                  </p>
                  <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Zap size={10} /> {tutorial.totalRewards.dreamTokens} DT
                    </span>
                    <span className="flex items-center gap-1 text-green-400">
                      <Star size={10} /> {tutorial.totalRewards.xp} XP
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={10} /> ~{tutorial.estimatedMinutes}m
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLaunch}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-mono font-semibold tracking-wider hover:bg-primary/30 transition-colors"
                  >
                    BEGIN TUTORIAL <ChevronRight size={12} />
                  </button>
                  <button
                    onClick={onSnooze}
                    className="px-3 py-2.5 rounded-lg bg-muted/40 border border-border/60 text-muted-foreground text-xs font-mono hover:bg-muted/60 hover:text-foreground transition-colors"
                    title="Remind me later"
                  >
                    LATER
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full tutorial engine */}
      <AnimatePresence>
        {showEngine && (
          <LoreTutorialEngine
            key={tutorial.id}
            tutorial={tutorial}
            onComplete={handleComplete}
            onDismiss={() => setShowEngine(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
