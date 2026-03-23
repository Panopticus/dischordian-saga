/* ═══════════════════════════════════════════════════════
   TUTORIAL TRIGGER — Reusable component that shows a
   "Learn with Elara" button on game pages. Launches
   the LoreTutorialEngine for the matching tutorial.
   ═══════════════════════════════════════════════════════ */

import { useState, useCallback, useMemo, useEffect } from "react";
import { dialogOpened, dialogClosed } from "@/lib/dialogState";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CheckCircle2, Zap, Star, ChevronRight, X } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { LORE_TUTORIALS, type LoreTutorial, type TutorialReward } from "@/data/loreTutorials";
import LoreTutorialEngine from "@/components/LoreTutorialEngine";

interface TutorialTriggerProps {
  /** The route path to match (e.g. "/fight", "/cards") */
  route?: string;
  /** Or provide a tutorial ID directly */
  tutorialId?: string;
  /** Display variant */
  variant?: "banner" | "button" | "compact";
  /** Additional className */
  className?: string;
}

export default function TutorialTrigger({
  route,
  tutorialId,
  variant = "banner",
  className = "",
}: TutorialTriggerProps) {
  const { state, completeTutorial, shiftMorality, collectCard } = useGame();
  const [showEngine, setShowEngine] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Notify global dialog state when tutorial engine opens/closes
  useEffect(() => {
    if (showEngine) {
      dialogOpened();
    } else {
      dialogClosed();
    }
    return () => {
      if (showEngine) dialogClosed();
    };
  }, [showEngine]);

  const tutorial = useMemo(() => {
    if (tutorialId) return LORE_TUTORIALS.find(t => t.id === tutorialId) || null;
    if (route) return LORE_TUTORIALS.find(t => t.triggerRoute === route) || null;
    return null;
  }, [route, tutorialId]);

  const isCompleted = tutorial ? state.completedTutorials.includes(tutorial.id) : false;

  const handleComplete = useCallback(
    (rewards: TutorialReward[], moralityTotal: number, _flags: Record<string, boolean>) => {
      if (tutorial) {
        completeTutorial(tutorial.id);
        if (moralityTotal !== 0) {
          shiftMorality(moralityTotal, tutorial.id);
        }
        rewards.forEach(r => {
          if (r.type === "card" && r.id) {
            collectCard(r.id);
          }
        });
      }
      setShowEngine(false);
    },
    [tutorial, completeTutorial, shiftMorality, collectCard]
  );

  if (!tutorial || dismissed) return null;

  // ─── BANNER VARIANT ───
  if (variant === "banner") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-lg border overflow-hidden ${
            isCompleted
              ? "border-green-500/20 bg-green-500/5"
              : "border-primary/20 bg-primary/5"
          } ${className}`}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className={`p-2 rounded-lg shrink-0 ${
              isCompleted ? "bg-green-500/20" : "bg-primary/20"
            }`}>
              {isCompleted ? (
                <CheckCircle2 size={16} className="text-green-400" />
              ) : (
                <BookOpen size={16} className="text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-xs font-bold text-foreground tracking-wide">
                {isCompleted ? "TUTORIAL COMPLETE" : "ELARA'S TUTORIAL AVAILABLE"}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground truncate">
                {tutorial.title} — {tutorial.subtitle}
              </p>
            </div>
            {!isCompleted && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[10px] text-yellow-400 flex items-center gap-1 hidden sm:flex">
                  <Zap size={10} /> {tutorial.totalRewards.dreamTokens} DT
                </span>
                <button
                  onClick={() => setShowEngine(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/20 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/30 transition-colors"
                >
                  START <ChevronRight size={12} />
                </button>
              </div>
            )}
            {isCompleted && (
              <button
                onClick={() => setShowEngine(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/40 border border-border/60 text-muted-foreground text-xs font-mono hover:bg-muted/60 transition-colors shrink-0"
              >
                REPLAY
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded text-muted-foreground/50 hover:text-muted-foreground transition-colors shrink-0"
            >
              <X size={12} />
            </button>
          </div>
        </motion.div>

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

  // ─── BUTTON VARIANT ───
  if (variant === "button") {
    return (
      <>
        <button
          onClick={() => setShowEngine(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
            isCompleted
              ? "border-green-500/20 bg-green-500/5 text-green-400"
              : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
          } ${className}`}
        >
          {isCompleted ? <CheckCircle2 size={14} /> : <BookOpen size={14} />}
          <span className="font-mono text-xs tracking-wider">
            {isCompleted ? "REPLAY TUTORIAL" : "LEARN WITH ELARA"}
          </span>
          {!isCompleted && (
            <span className="font-mono text-[10px] text-yellow-400 flex items-center gap-0.5">
              <Zap size={9} /> {tutorial.totalRewards.dreamTokens}
            </span>
          )}
        </button>

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

  // ─── COMPACT VARIANT ───
  return (
    <>
      <button
        onClick={() => setShowEngine(true)}
        title={isCompleted ? "Replay tutorial" : `Tutorial: ${tutorial.title}`}
        className={`p-2 rounded-lg border transition-all ${
          isCompleted
            ? "border-green-500/20 bg-green-500/5 text-green-400"
            : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
        } ${className}`}
      >
        {isCompleted ? <CheckCircle2 size={14} /> : <BookOpen size={14} />}
      </button>

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
