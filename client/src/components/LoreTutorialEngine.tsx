/* ═══════════════════════════════════════════════════════
   LORE TUTORIAL ENGINE — BioWare-style guided dialog
   Full-screen tutorial overlay with Elara narration,
   branching choices, morality shifts, and rewards
   ═══════════════════════════════════════════════════════ */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Gift, Zap, Star, Layers, X,
  CircuitBoard, Heart, MessageSquare, Award
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import type {
  LoreTutorial, TutorialStep, TutorialChoice, TutorialReward,
} from "@/data/loreTutorials";
import type { JSX } from "react";

/* ─── MORALITY SHIFT INDICATOR ─── */
function MoralityShiftBadge({ shift }: { shift: number }) {
  if (shift === 0) return null;
  const isMachine = shift < 0;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider ${
      isMachine
        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
    }`}>
      {isMachine ? <CircuitBoard size={10} /> : <Heart size={10} />}
      {isMachine ? "MACHINE" : "HUMANITY"} {isMachine ? shift : `+${shift}`}
    </span>
  );
}

/* ─── REWARD DISPLAY ─── */
function RewardBadge({ reward }: { reward: TutorialReward }) {
  const icons: Record<string, JSX.Element> = {
    card: <Layers size={12} className="text-purple-400" />,
    dream_tokens: <Zap size={12} className="text-yellow-400" />,
    xp: <Star size={12} className="text-green-400" />,
    item: <Gift size={12} className="text-blue-400" />,
    theme: <Award size={12} className="text-pink-400" />,
  };
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted/40 border border-white/10 text-xs font-mono">
      {icons[reward.type] || <Gift size={12} />}
      {reward.amount ? `${reward.amount} ` : ""}{reward.name}
    </span>
  );
}

/* ─── TYPEWRITER TEXT ─── */
function TypewriterText({ text, speed = 20, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;
    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
        onComplete?.();
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  const skipToEnd = useCallback(() => {
    if (!done) {
      setDisplayed(text);
      setDone(true);
      onComplete?.();
    }
  }, [done, text, onComplete]);

  return (
    <span onClick={skipToEnd} className="cursor-pointer">
      {displayed}
      {!done && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />}
    </span>
  );
}

/* ─── CHOICE BUTTON ─── */
function ChoiceButton({
  choice,
  onSelect,
  disabled,
  selected,
}: {
  choice: TutorialChoice;
  onSelect: (c: TutorialChoice) => void;
  disabled: boolean;
  selected: boolean;
}) {
  const isMachine = choice.sideLabel === "machine";
  const isHumanity = choice.sideLabel === "humanity";

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={!disabled ? { scale: 1.01, x: 4 } : undefined}
      onClick={() => !disabled && onSelect(choice)}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        selected
          ? isMachine
            ? "bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_20px_rgba(0,200,255,0.15)]"
            : isHumanity
            ? "bg-amber-500/20 border-amber-500/50 shadow-[0_0_20px_rgba(255,180,0,0.15)]"
            : "bg-primary/20 border-primary/50"
          : disabled
          ? "bg-muted/25 border-white/5 opacity-40"
          : isMachine
          ? "bg-muted/40 border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40"
          : isHumanity
          ? "bg-muted/40 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/40"
          : "bg-muted/40 border-white/10 hover:bg-muted/60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 p-1.5 rounded ${
          isMachine ? "bg-cyan-500/20" : isHumanity ? "bg-amber-500/20" : "bg-muted/50"
        }`}>
          {isMachine ? <CircuitBoard size={14} className="text-cyan-400" /> : 
           isHumanity ? <Heart size={14} className="text-amber-400" /> :
           <MessageSquare size={14} className="text-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">{choice.text}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <MoralityShiftBadge shift={choice.moralityShift} />
            {choice.rewards?.map((r, i) => (
              <RewardBadge key={i} reward={r} />
            ))}
          </div>
        </div>
        <ChevronRight size={16} className="text-muted-foreground mt-1 shrink-0" />
      </div>
    </motion.button>
  );
}

/* ─── MAIN TUTORIAL ENGINE ─── */
interface LoreTutorialEngineProps {
  tutorial: LoreTutorial;
  onComplete: (rewards: TutorialReward[], moralityTotal: number, flags: Record<string, boolean>) => void;
  onDismiss: () => void;
}

export default function LoreTutorialEngine({ tutorial, onComplete, onDismiss }: LoreTutorialEngineProps) {
  const { state } = useGame();
  const characterChoices = state.characterChoices;
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<"intro" | "dialog" | "response" | "summary">("intro");
  const [selectedChoice, setSelectedChoice] = useState<TutorialChoice | null>(null);
  const [textComplete, setTextComplete] = useState(false);
  const [collectedRewards, setCollectedRewards] = useState<TutorialReward[]>([]);
  const [totalMoralityShift, setTotalMoralityShift] = useState(0);
  const [collectedFlags, setCollectedFlags] = useState<Record<string, boolean>>({});

  const currentStep = tutorial.steps[stepIndex];
  const isLastStep = stepIndex >= tutorial.steps.length - 1;
  const playerName = characterChoices?.name || "Operative";
  const playerClass = characterChoices?.characterClass || "engineer";
  const playerSpecies = characterChoices?.species || "demagi";

  // Template variable replacement
  const fillTemplate = useCallback((text: string) => {
    return text
      .replace(/\{playerName\}/g, playerName)
      .replace(/\{playerClass\}/g, playerClass)
      .replace(/\{playerSpecies\}/g, playerSpecies);
  }, [playerName, playerClass, playerSpecies]);

  // Get the display text for the current step (with class overrides)
  const getStepText = useCallback((step: TutorialStep) => {
    const base = step.classOverrides?.[playerClass] || step.elaraText;
    return fillTemplate(base);
  }, [playerClass, fillTemplate]);

  // Handle advancing to next step
  const advanceStep = useCallback(() => {
    if (isLastStep || currentStep.type === "reward_summary") {
      setPhase("summary");
    } else {
      setStepIndex(prev => prev + 1);
      setSelectedChoice(null);
      setTextComplete(false);
      setPhase("dialog");
    }
  }, [isLastStep, currentStep]);

  // Handle choice selection
  const handleChoice = useCallback((choice: TutorialChoice) => {
    setSelectedChoice(choice);
    setTotalMoralityShift(prev => prev + choice.moralityShift);
    if (choice.rewards) {
      setCollectedRewards(prev => [...prev, ...choice.rewards!]);
    }
    if (choice.flag) {
      setCollectedFlags(prev => ({ ...prev, [choice.flag!]: true }));
    }
    setPhase("response");
    setTextComplete(false);
  }, []);

  // Handle final completion
  const handleComplete = useCallback(() => {
    onComplete(collectedRewards, totalMoralityShift, collectedFlags);
  }, [collectedRewards, totalMoralityShift, collectedFlags, onComplete]);

  // Auto-start from intro
  useEffect(() => {
    const timer = setTimeout(() => setPhase("dialog"), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Filter choices by class/alignment requirements
  const getAvailableChoices = useCallback((step: TutorialStep) => {
    if (!step.choices) return [];
    return step.choices.filter(c => {
      if (c.requiresClass && c.requiresClass !== playerClass) return false;
      if (c.requiresAlignment && c.requiresAlignment !== characterChoices.alignment) return false;
      return true;
    });
  }, [playerClass, characterChoices.alignment]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
        style={{ background: "rgba(1,0,32,0.92)", backdropFilter: "blur(12px)" }}
      >
        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors z-10"
          title="Skip tutorial"
        >
          <X size={18} />
        </button>

        {/* ═══ INTRO PHASE ═══ */}
        {phase === "intro" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center px-6"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
              <span className="font-mono text-[10px] text-primary/70 tracking-[0.4em]">LORE TUTORIAL</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-wide mb-2">
              {tutorial.title}
            </h2>
            <p className="font-mono text-sm text-muted-foreground">{tutorial.subtitle}</p>
            <div className="flex items-center justify-center gap-4 mt-4 font-mono text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-400" />{tutorial.totalRewards.dreamTokens} DT</span>
              <span className="flex items-center gap-1"><Star size={12} className="text-green-400" />{tutorial.totalRewards.xp} XP</span>
              {tutorial.totalRewards.cards > 0 && (
                <span className="flex items-center gap-1"><Layers size={12} className="text-purple-400" />{tutorial.totalRewards.cards} Cards</span>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ DIALOG PHASE ═══ */}
        {phase === "dialog" && currentStep && (
          <motion.div
            key={`step-${stepIndex}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="w-full max-w-2xl mx-4 mb-4 sm:mb-0"
          >
            {/* Step progress */}
            <div className="flex items-center gap-1 mb-3 px-1">
              {tutorial.steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < stepIndex ? "bg-primary" : i === stepIndex ? "bg-primary/60" : "bg-muted/50"
                  }`}
                />
              ))}
            </div>

            {/* Dialog box */}
            <div className="rounded-xl border border-primary/20 bg-card/90 overflow-hidden shadow-[0_0_40px_rgba(0,200,255,0.08)]">
              {/* Elara header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-primary/5">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageSquare size={14} className="text-primary" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-primary tracking-wide">ELARA</p>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-wider">AI COMPANION // TUTORIAL MODE</p>
                </div>
                {currentStep.subtitle && (
                  <span className="ml-auto font-mono text-[10px] text-accent tracking-wider">{currentStep.subtitle}</span>
                )}
              </div>

              {/* Dialog content */}
              <div className="px-5 py-4">
                <div className="text-sm text-foreground/90 leading-relaxed min-h-[60px]">
                  <TypewriterText
                    key={`text-${stepIndex}-${phase}`}
                    text={getStepText(currentStep)}
                    speed={18}
                    onComplete={() => setTextComplete(true)}
                  />
                </div>

                {/* Choices (for choice steps) */}
                {currentStep.type === "choice" && textComplete && !selectedChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {getAvailableChoices(currentStep).map((choice, i) => (
                      <motion.div
                        key={choice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                      >
                        <ChoiceButton
                          choice={choice}
                          onSelect={handleChoice}
                          disabled={false}
                          selected={false}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Continue button (for non-choice steps) */}
                {currentStep.type !== "choice" && textComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex justify-end"
                  >
                    <button
                      onClick={advanceStep}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-mono hover:bg-primary/20 transition-colors"
                    >
                      {isLastStep || currentStep.type === "reward_summary" ? "COMPLETE" : "CONTINUE"}
                      <ChevronRight size={14} />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ RESPONSE PHASE (after choice) ═══ */}
        {phase === "response" && selectedChoice && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-2xl mx-4 mb-4 sm:mb-0"
          >
            {/* Step progress */}
            <div className="flex items-center gap-1 mb-3 px-1">
              {tutorial.steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= stepIndex ? "bg-primary" : "bg-muted/50"
                  }`}
                />
              ))}
            </div>

            <div className="rounded-xl border border-primary/20 bg-card/90 overflow-hidden shadow-[0_0_40px_rgba(0,200,255,0.08)]">
              {/* Elara response header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-primary/5">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageSquare size={14} className="text-primary" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-primary tracking-wide">ELARA</p>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-wider">RESPONDING TO YOUR CHOICE</p>
                </div>
                <MoralityShiftBadge shift={selectedChoice.moralityShift} />
              </div>

              {/* Your choice recap */}
              <div className="px-5 pt-3 pb-1">
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-white/10 mb-3">
                  <span className="font-mono text-[10px] text-muted-foreground mt-0.5 shrink-0">YOU:</span>
                  <p className="text-xs text-foreground/70 italic">{selectedChoice.text}</p>
                </div>
              </div>

              {/* Elara's response */}
              <div className="px-5 pb-4">
                <div className="text-sm text-foreground/90 leading-relaxed min-h-[40px]">
                  <TypewriterText
                    key={`response-${stepIndex}`}
                    text={fillTemplate(selectedChoice.elaraResponse)}
                    speed={18}
                    onComplete={() => setTextComplete(true)}
                  />
                </div>

                {/* Rewards earned */}
                {textComplete && selectedChoice.rewards && selectedChoice.rewards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center gap-2 flex-wrap"
                  >
                    <span className="font-mono text-[10px] text-accent tracking-wider">REWARDS:</span>
                    {selectedChoice.rewards.map((r, i) => (
                      <RewardBadge key={i} reward={r} />
                    ))}
                  </motion.div>
                )}

                {/* Continue button */}
                {textComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex justify-end"
                  >
                    <button
                      onClick={advanceStep}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-mono hover:bg-primary/20 transition-colors"
                    >
                      CONTINUE <ChevronRight size={14} />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ SUMMARY PHASE ═══ */}
        {phase === "summary" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg mx-4 mb-4 sm:mb-0"
          >
            <div className="rounded-xl border border-accent/30 bg-card/90 overflow-hidden shadow-[0_0_40px_rgba(255,180,0,0.1)]">
              <div className="px-5 py-4 border-b border-white/5 bg-accent/5 text-center">
                <Award size={32} className="text-accent mx-auto mb-2" />
                <h3 className="font-display text-lg font-bold text-foreground tracking-wide">TUTORIAL COMPLETE</h3>
                <p className="font-mono text-xs text-muted-foreground">{tutorial.title}</p>
              </div>

              <div className="px-5 py-4 space-y-3">
                {/* Morality summary */}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40 border border-white/10">
                  <span className="font-mono text-xs text-muted-foreground">MORALITY SHIFT</span>
                  <div className="flex items-center gap-2">
                    {totalMoralityShift < 0 ? (
                      <span className="flex items-center gap-1 text-cyan-400 font-mono text-sm font-bold">
                        <CircuitBoard size={14} /> {totalMoralityShift} MACHINE
                      </span>
                    ) : totalMoralityShift > 0 ? (
                      <span className="flex items-center gap-1 text-amber-400 font-mono text-sm font-bold">
                        <Heart size={14} /> +{totalMoralityShift} HUMANITY
                      </span>
                    ) : (
                      <span className="font-mono text-sm text-muted-foreground">BALANCED</span>
                    )}
                  </div>
                </div>

                {/* Rewards collected */}
                {collectedRewards.length > 0 && (
                  <div className="px-3 py-2 rounded-lg bg-muted/40 border border-white/10">
                    <p className="font-mono text-[10px] text-accent tracking-wider mb-2">REWARDS EARNED</p>
                    <div className="flex flex-wrap gap-2">
                      {collectedRewards.map((r, i) => (
                        <RewardBadge key={i} reward={r} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Complete button */}
                <button
                  onClick={handleComplete}
                  className="w-full py-3 rounded-lg bg-accent/20 border border-accent/40 text-accent font-mono text-sm font-bold hover:bg-accent/30 transition-colors tracking-wider"
                >
                  CLAIM REWARDS & CONTINUE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
