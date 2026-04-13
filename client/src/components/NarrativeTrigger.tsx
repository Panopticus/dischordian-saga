/* ═══════════════════════════════════════════════════════
   NARRATIVE TRIGGER — Detects when act conditions are met
   and launches the NarrativeEngine for the next act.
   
   Placed in the ArkExplorerPage and game mode pages.
   Checks ACT_TRIGGERS against current game state.
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useMemo } from "react";
import { dialogOpened, dialogClosed } from "@/lib/dialogState";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Skull, ChevronRight, Zap, Star, Layers } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import NarrativeEngine from "@/components/NarrativeEngine";
import { ACT_TRIGGERS, NARRATIVE_ACTS } from "@/data/narrativeActs";
import type { TutorialReward } from "@/data/loreTutorials";

interface NarrativeTriggerProps {
  /** Current room ID (for room-triggered acts) */
  currentRoom?: string;
  /** Current route (for route-triggered acts) */
  currentRoute?: string;
  /** Show as a banner prompt instead of auto-launching */
  variant?: "auto" | "banner";
  /** Additional className */
  className?: string;
}

export default function NarrativeTrigger({
  currentRoom,
  currentRoute,
  variant = "auto",
  className = "",
}: NarrativeTriggerProps) {
  const {
    state,
    completeTutorial,
    shiftMorality,
    collectCard,
    advanceNarrativeAct,
    setHumanContact,
    setHumanContactSecret,
    setNarrativeFlag,
  } = useGame();

  const [showEngine, setShowEngine] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [pendingAct, setPendingAct] = useState<number | null>(null);

  // Notify global dialog state when NarrativeEngine opens/closes
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

  // Check which act should trigger next
  const nextAct = useMemo(() => {
    const triggerState = {
      narrativeAct: state.narrativeAct,
      totalRoomsUnlocked: state.totalRoomsUnlocked,
      completedTutorials: state.completedTutorials,
      armyRecruitmentMissionsCompleted: state.armyRecruitmentMissionsCompleted || [],
      humanContactMade: state.humanContactMade,
      humanContactSecret: state.humanContactSecret,
      elaraKnowsAboutHuman: state.elaraKnowsAboutHuman,
      playerLevel: Math.floor((state.conexusXp || 0) / 500) + 1,
      completedGameModes: state.completedTutorials.filter(t => t.startsWith("tut-")).length,
    };

    for (const trigger of ACT_TRIGGERS) {
      if (trigger.check(triggerState)) {
        // For Act 1, only trigger in comms-relay room
        if (trigger.act === 1 && currentRoom !== "comms-relay") return null;
        return trigger;
      }
    }
    return null;
  }, [state, currentRoom]);

  // Find the matching narrative tutorial for the act
  const actTutorial = useMemo(() => {
    if (!nextAct) return null;
    // Find the base act tutorial
    const baseId = `act-${nextAct.act}-`;
    const candidates = NARRATIVE_ACTS.filter(t => t.id.startsWith(baseId));
    
    if (candidates.length === 0) return null;
    
    // If there are path-specific variants, check which path the player is on
    if (candidates.length === 1) return candidates[0];
    
    // For acts with branching (Act 4+), check narrative flags
    const pathA = state.narrativeFlags["told_elara_willingly"];
    const pathB = state.narrativeFlags["elara_discovers_signal"];
    const pathC = state.narrativeFlags["elara_betrayed"];
    
    if (pathA) {
      const pathATut = candidates.find(t => t.pathRequirement === "A");
      if (pathATut) return pathATut;
    }
    if (pathB) {
      const pathBTut = candidates.find(t => t.pathRequirement === "B");
      if (pathBTut) return pathBTut;
    }
    if (pathC) {
      const pathCTut = candidates.find(t => t.pathRequirement === "C");
      if (pathCTut) return pathCTut;
    }
    
    // Default to first candidate (no path requirement)
    return candidates.find(t => !t.pathRequirement) || candidates[0];
  }, [nextAct, NARRATIVE_ACTS, state.narrativeFlags]);

  // Check if this act was already completed
  const isCompleted = actTutorial ? state.completedTutorials.includes(actTutorial.id) : false;

  // Auto-trigger for Act 1 in comms-relay
  useEffect(() => {
    if (
      variant === "auto" &&
      nextAct?.act === 1 &&
      currentRoom === "comms-relay" &&
      actTutorial &&
      !isCompleted &&
      !dismissed &&
      !showEngine
    ) {
      // Small delay before auto-launching
      const timer = setTimeout(() => {
        setPendingAct(nextAct.act);
        setShowEngine(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [nextAct, currentRoom, actTutorial, isCompleted, dismissed, showEngine, variant]);

  // Handle completion
  const handleComplete = useCallback(
    (rewards: TutorialReward[], moralityTotal: number, flags: Record<string, boolean>) => {
      if (actTutorial) {
        completeTutorial(actTutorial.id);
        
        // Advance to the next act
        if (nextAct) {
          advanceNarrativeAct(nextAct.act);
        }

        // Apply morality shift
        if (moralityTotal !== 0) {
          shiftMorality(moralityTotal, actTutorial.id);
        }

        // Collect card rewards
        rewards.forEach(r => {
          if (r.type === "card" && r.id) {
            collectCard(r.id);
          }
        });

        // Set narrative flags
        Object.entries(flags).forEach(([flag, value]) => {
          if (value) setNarrativeFlag(flag, true);
        });

        // Special flags for Act 1
        if (nextAct?.act === 1) {
          if (flags["human_contact_accepted"]) {
            setHumanContact(true);
          }
        }

        // Special flags for Act 4 (revelation paths)
        if (nextAct?.act === 4) {
          if (flags["told_elara_willingly"]) {
            setHumanContactSecret(false);
          }
        }
      }

      setShowEngine(false);
      setPendingAct(null);
    },
    [actTutorial, nextAct, completeTutorial, advanceNarrativeAct, shiftMorality, collectCard, setNarrativeFlag, setHumanContact, setHumanContactSecret]
  );

  const handleDismiss = useCallback(() => {
    setShowEngine(false);
    setDismissed(true);
    setPendingAct(null);
  }, []);

  const handleLaunch = useCallback(() => {
    if (nextAct) {
      setPendingAct(nextAct.act);
      setShowEngine(true);
    }
  }, [nextAct]);

  // Don't render if no act is pending or already completed
  if (!nextAct || !actTutorial || isCompleted) return null;

  // ─── BANNER VARIANT ───
  if (variant === "banner" && !showEngine) {
    return (
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative rounded-lg border overflow-hidden ${
              nextAct.act <= 3
                ? "border-primary/30 bg-primary/5"
                : "border-red-500/30 bg-red-500/5"
            } ${className}`}
          >
            {/* Glow line */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${
              nextAct.act <= 3
                ? "bg-gradient-to-r from-transparent via-primary to-transparent"
                : "bg-gradient-to-r from-transparent via-red-500 to-transparent"
            }`} />

            <div className="flex items-center gap-3 px-4 py-3">
              <div className={`p-2 rounded-lg shrink-0 ${
                nextAct.act <= 3 ? "bg-primary/20" : "bg-red-500/20"
              }`}>
                {nextAct.act <= 3 ? (
                  <Radio size={18} className="text-primary" />
                ) : (
                  <Skull size={18} className="text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-bold text-foreground tracking-wide">
                  ACT {nextAct.act}: {nextAct.title}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider truncate">
                  {actTutorial.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <Zap size={10} className="text-yellow-400" />{actTutorial.totalRewards.dreamTokens}
                  <Star size={10} className="text-green-400 ml-1" />{actTutorial.totalRewards.xp}
                  {actTutorial.totalRewards.cards > 0 && (
                    <><Layers size={10} className="text-purple-400 ml-1" />{actTutorial.totalRewards.cards}</>
                  )}
                </div>
                <button
                  onClick={handleLaunch}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-colors ${
                    nextAct.act <= 3
                      ? "bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
                      : "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
                  }`}
                >
                  BEGIN <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ─── ENGINE OVERLAY ───
  if (showEngine && actTutorial) {
    return (
      <NarrativeEngine
        tutorial={actTutorial}
        onComplete={handleComplete}
        onDismiss={handleDismiss}
      />
    );
  }

  return null;
}
