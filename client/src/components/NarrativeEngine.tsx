/* ═══════════════════════════════════════════════════════
   NARRATIVE ENGINE — 7-Act Angel/Demon Dialog System
   
   Advanced dialog engine for the main narrative arc.
   Handles:
   - Dual speakers (Elara = angel, Human = demon)
   - TransmissionDisplay typed-out messages with VO audio
   - Flag-based step filtering (requireFlag / excludeFlag)
   - Class-based dialog wheel checks (engineer, oracle, etc.)
   - Morality shifts and narrative choice tracking
   - Act progression and branching paths (A/B/C)
   - Reward distribution
   ═══════════════════════════════════════════════════════ */

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Gift, Zap, Star, Layers, X,
  CircuitBoard, Heart, MessageSquare, Award,
  Radio, Skull, Terminal, Volume2
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import TransmissionDisplay from "@/components/TransmissionDisplay";
import type { TransmissionMessage } from "@/components/TransmissionDisplay";
import DialogWheel from "@/components/DialogWheel";
import type { WheelChoice } from "@/components/DialogWheel";
import type {
  LoreTutorial, TutorialStep, TutorialChoice, TutorialReward,
} from "@/data/loreTutorials";

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
  const icons: Record<string, React.ReactNode> = {
    card: <Layers size={12} className="text-purple-400" />,
    dream_tokens: <Zap size={12} className="text-yellow-400" />,
    xp: <Star size={12} className="text-green-400" />,
    item: <Gift size={12} className="text-blue-400" />,
    theme: <Award size={12} className="text-pink-400" />,
  };
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted/40 border border-border/60 text-xs font-mono">
      {icons[reward.type] || <Gift size={12} />}
      {reward.amount ? `${reward.amount} ` : ""}{reward.name}
    </span>
  );
}

/* ─── MAIN NARRATIVE ENGINE ─── */
interface NarrativeEngineProps {
  tutorial: LoreTutorial;
  onComplete: (rewards: TutorialReward[], moralityTotal: number, flags: Record<string, boolean>) => void;
  onDismiss: () => void;
}

export default function NarrativeEngine({ tutorial, onComplete, onDismiss }: NarrativeEngineProps) {
  const { state, setNarrativeFlag } = useGame();
  const characterChoices = state.characterChoices;
  const [stepIndex, setStepIndex] = useState(-1); // -1 = intro phase
  const [phase, setPhase] = useState<"intro" | "dialog" | "human_response" | "elara_response" | "wheel" | "summary">("intro");
  const [selectedChoice, setSelectedChoice] = useState<TutorialChoice | null>(null);
  const [transmissionComplete, setTransmissionComplete] = useState(false);
  const [collectedRewards, setCollectedRewards] = useState<TutorialReward[]>([]);
  const [totalMoralityShift, setTotalMoralityShift] = useState(0);
  const [localFlags, setLocalFlags] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const playerName = characterChoices?.name || "Operative";
  const playerClass = characterChoices?.characterClass || "engineer";
  const playerSpecies = characterChoices?.species || "demagi";

  // Merge local flags with global narrative flags for step filtering
  const allFlags = useMemo(() => ({
    ...state.narrativeFlags,
    ...localFlags,
  }), [state.narrativeFlags, localFlags]);

  // Filter steps based on requireFlag / excludeFlag
  const filteredSteps = useMemo(() => {
    return tutorial.steps.filter(step => {
      if (step.requireFlag && !allFlags[step.requireFlag]) return false;
      if (step.excludeFlag && allFlags[step.excludeFlag]) return false;
      return true;
    });
  }, [tutorial.steps, allFlags]);

  const currentStep = stepIndex >= 0 ? filteredSteps[stepIndex] : null;
  const isLastStep = stepIndex >= filteredSteps.length - 1;

  // Template variable replacement
  const fillTemplate = useCallback((text: string) => {
    if (!text) return "";
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

  // Build TransmissionMessages for the current step
  const buildTransmissionMessages = useCallback((step: TutorialStep): TransmissionMessage[] => {
    const messages: TransmissionMessage[] = [];
    const speaker = step.speaker || "elara";

    if (speaker === "system" || speaker === "kael_log") {
      messages.push({
        speaker: speaker === "kael_log" ? "kael" : "system",
        text: fillTemplate(step.elaraText),
        typingSpeed: 12,
      });
    } else if (speaker === "elara") {
      messages.push({
        speaker: "elara",
        text: getStepText(step),
        typingSpeed: 18,
      });
    } else if (speaker === "human") {
      // Human messages: corrupted signal with optional VO
      const humanText = step.humanText || step.elaraText;
      messages.push({
        speaker: "human",
        text: fillTemplate(humanText),
        corruptionLevel: step.corruptionLevel || 40,
        typingSpeed: 25,
        voUrl: step.humanVoAudioUrl,
      });
    }

    // If there's both elaraText AND humanText on the same step, show both
    if (speaker === "elara" && step.humanText) {
      messages.push({
        speaker: "human",
        text: fillTemplate(step.humanText),
        corruptionLevel: step.corruptionLevel || 40,
        typingSpeed: 25,
        voUrl: step.humanVoAudioUrl,
      });
    }

    return messages;
  }, [fillTemplate, getStepText]);

  // Handle advancing to next step
  const advanceStep = useCallback(() => {
    // Apply any setFlag from current step
    if (currentStep?.setFlag) {
      setLocalFlags(prev => ({ ...prev, [currentStep.setFlag!]: true }));
      setNarrativeFlag(currentStep.setFlag, true);
    }

    // Find next valid step
    const nextIdx = stepIndex + 1;
    
    // Check if we need to re-filter after flag changes
    // The filteredSteps will update on next render, so we look ahead
    if (nextIdx >= filteredSteps.length) {
      setPhase("summary");
      return;
    }

    const nextStep = filteredSteps[nextIdx];
    if (!nextStep || nextStep.type === "reward_summary") {
      setPhase("summary");
      return;
    }

    setStepIndex(nextIdx);
    setSelectedChoice(null);
    setTransmissionComplete(false);

    if (nextStep.type === "wheel_choice" || nextStep.type === "choice") {
      setPhase("dialog"); // Show the prompt text first, then the wheel
    } else {
      setPhase("dialog");
    }
  }, [stepIndex, filteredSteps, currentStep, setNarrativeFlag]);

  // Handle choice selection from wheel or buttons
  const handleChoice = useCallback((choice: TutorialChoice) => {
    setSelectedChoice(choice);
    setTotalMoralityShift(prev => prev + choice.moralityShift);
    
    if (choice.rewards) {
      setCollectedRewards(prev => [...prev, ...choice.rewards!]);
    }
    if (choice.flag) {
      setLocalFlags(prev => ({ ...prev, [choice.flag!]: true }));
      setNarrativeFlag(choice.flag!, true);
    }
    if (choice.setFlag) {
      setLocalFlags(prev => ({ ...prev, [choice.setFlag!]: true }));
      setNarrativeFlag(choice.setFlag!, true);
    }

    // Determine response phase based on what responses exist
    if (choice.humanResponse) {
      setPhase("human_response");
    } else if (choice.elaraResponse) {
      setPhase("elara_response");
    } else {
      // No response, advance directly
      advanceStep();
    }
    setTransmissionComplete(false);
  }, [setNarrativeFlag, advanceStep]);

  // Handle human response complete -> show elara response if exists
  const handleHumanResponseComplete = useCallback(() => {
    if (selectedChoice?.elaraResponse) {
      setPhase("elara_response");
      setTransmissionComplete(false);
    } else {
      setTransmissionComplete(true);
    }
  }, [selectedChoice]);

  // Handle final completion
  const handleComplete = useCallback(() => {
    onComplete(collectedRewards, totalMoralityShift, localFlags);
  }, [collectedRewards, totalMoralityShift, localFlags, onComplete]);

  // Auto-start from intro
  useEffect(() => {
    const timer = setTimeout(() => {
      setStepIndex(0);
      setPhase("dialog");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [phase, stepIndex, transmissionComplete]);

  // Filter choices by class requirements
  const getAvailableChoices = useCallback((step: TutorialStep) => {
    if (!step.choices) return [];
    return step.choices.filter(c => {
      // classCheck means this option is ONLY for that class
      if (c.classCheck && c.classCheck !== playerClass) return false;
      if (c.requiresClass && c.requiresClass !== playerClass) return false;
      if (c.requiresAlignment && c.requiresAlignment !== characterChoices?.alignment) return false;
      // Filter by corruption visibility
      if (c.hiddenUntilCorruption && (step.corruptionLevel || 0) < c.hiddenUntilCorruption) return false;
      return true;
    });
  }, [playerClass, characterChoices?.alignment]);

  // Get the speaker icon
  const getSpeakerIcon = (speaker: string) => {
    switch (speaker) {
      case "human": return <Skull size={14} className="text-red-400" />;
      case "system": return <Terminal size={14} className="text-amber-400" />;
      case "kael_log": return <Terminal size={14} className="text-amber-400" />;
      default: return <Radio size={14} className="text-cyan-400" />;
    }
  };

  const getSpeakerLabel = (speaker: string) => {
    switch (speaker) {
      case "human": return "SIGNAL INTERCEPT";
      case "system": return "SYSTEM // ARK 47";
      case "kael_log": return "RECRUITER'S LOG // ARCHIVED";
      default: return "ELARA // SHIP AI";
    }
  };

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case "human": return "text-red-400";
      case "system": return "text-amber-400";
      case "kael_log": return "text-amber-400";
      default: return "text-cyan-400";
    }
  };

  const getSpeakerBorder = (speaker: string) => {
    switch (speaker) {
      case "human": return "border-red-800/40";
      case "system": return "border-amber-800/40";
      case "kael_log": return "border-amber-800/30";
      default: return "border-cyan-800/40";
    }
  };

  const getSpeakerBg = (speaker: string) => {
    switch (speaker) {
      case "human": return "bg-red-950/30";
      case "system": return "bg-amber-950/30";
      case "kael_log": return "bg-amber-950/20";
      default: return "bg-cyan-950/30";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      >
        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors z-10"
          title="Skip narrative"
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
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
              <span className="font-mono text-[10px] text-primary/70 tracking-[0.4em]">
                {tutorial.act ? `ACT ${tutorial.act}` : "NARRATIVE"}
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground tracking-wider mb-3">
              {tutorial.title}
            </h2>
            <p className="font-mono text-sm text-muted-foreground max-w-md mx-auto">{tutorial.subtitle}</p>
            <div className="flex items-center justify-center gap-4 mt-4 font-mono text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-400" />{tutorial.totalRewards.dreamTokens} DT</span>
              <span className="flex items-center gap-1"><Star size={12} className="text-green-400" />{tutorial.totalRewards.xp} XP</span>
              {tutorial.totalRewards.cards > 0 && (
                <span className="flex items-center gap-1"><Layers size={12} className="text-purple-400" />{tutorial.totalRewards.cards} Cards</span>
              )}
            </div>
            {/* Signal interference animation */}
            <div className="mt-6 flex items-center justify-center gap-1">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary/40 rounded-full"
                  animate={{
                    height: [4, Math.random() * 20 + 4, 4],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ DIALOG PHASE ═══ */}
        {phase === "dialog" && currentStep && (
          <motion.div
            key={`step-${stepIndex}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="w-full max-w-2xl mx-4"
          >
            {/* Step progress */}
            <div className="flex items-center gap-1 mb-3 px-1">
              {filteredSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < stepIndex ? "bg-primary" : i === stepIndex ? "bg-primary/60" : "bg-muted/30"
                  }`}
                />
              ))}
            </div>

            {/* Dialog container */}
            <div
              ref={scrollRef}
              className="rounded-xl border border-border/30 bg-card/95 overflow-hidden shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              {/* Speaker header */}
              <div className={`flex items-center gap-3 px-5 py-3 border-b border-border/30 ${getSpeakerBg(currentStep.speaker || "elara")}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getSpeakerBg(currentStep.speaker || "elara")} border ${getSpeakerBorder(currentStep.speaker || "elara")}`}>
                  {getSpeakerIcon(currentStep.speaker || "elara")}
                </div>
                <div>
                  <p className={`font-display text-sm font-bold tracking-wide ${getSpeakerColor(currentStep.speaker || "elara")}`}>
                    {getSpeakerLabel(currentStep.speaker || "elara")}
                  </p>
                  {currentStep.subtitle && (
                    <p className="font-mono text-[10px] text-muted-foreground tracking-wider">{currentStep.subtitle}</p>
                  )}
                </div>
                {tutorial.act && (
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground/50 tracking-wider">
                    ACT {tutorial.act} // SCENE {stepIndex + 1}/{filteredSteps.length}
                  </span>
                )}
              </div>

              {/* Transmission content */}
              <div className="px-5 py-4">
                <TransmissionDisplay
                  key={`transmission-${stepIndex}`}
                  messages={buildTransmissionMessages(currentStep)}
                  showHeaders={false}
                  autoAdvanceMs={currentStep.autoAdvanceMs || 0}
                  onAllComplete={() => setTransmissionComplete(true)}
                />

                {/* Dialog Wheel (for wheel_choice steps) */}
                {currentStep.type === "wheel_choice" && transmissionComplete && !selectedChoice && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-5"
                  >
                    <DialogWheel
                      speakerName={getSpeakerLabel(currentStep.speaker || "elara")}
                      speakerText={getStepText(currentStep)}
                      speakerPortrait={currentStep.speakerPortrait}
                      choices={getAvailableChoices(currentStep).map(c => ({
                        ...c,
                        shortText: c.shortText || c.text.slice(0, 25),
                        alignment: (c.sideLabel || "neutral") as "machine" | "humanity" | "neutral",
                      })) as WheelChoice[]}
                      corruptionLevel={currentStep.corruptionLevel || 0}
                      onSelect={(wc) => handleChoice(wc as TutorialChoice)}
                    />
                  </motion.div>
                )}

                {/* Linear choice buttons (for choice steps) */}
                {currentStep.type === "choice" && transmissionComplete && !selectedChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {getAvailableChoices(currentStep).map((choice, i) => (
                      <motion.button
                        key={choice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        onClick={() => handleChoice(choice)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          choice.sideLabel === "machine"
                            ? "bg-muted/40 border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40"
                            : choice.sideLabel === "humanity"
                            ? "bg-muted/40 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/40"
                            : "bg-muted/40 border-border/60 hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 p-1.5 rounded ${
                            choice.sideLabel === "machine" ? "bg-cyan-500/20" :
                            choice.sideLabel === "humanity" ? "bg-amber-500/20" : "bg-muted/50"
                          }`}>
                            {choice.sideLabel === "machine" ? <CircuitBoard size={14} className="text-cyan-400" /> :
                             choice.sideLabel === "humanity" ? <Heart size={14} className="text-amber-400" /> :
                             <MessageSquare size={14} className="text-muted-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground leading-snug">{choice.text}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <MoralityShiftBadge shift={choice.moralityShift} />
                              {choice.classCheck && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                  {choice.classCheck.toUpperCase()} CLASS
                                </span>
                              )}
                              {choice.rewards?.map((r, ri) => (
                                <RewardBadge key={ri} reward={r} />
                              ))}
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-muted-foreground mt-1 shrink-0" />
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* Continue button (for non-choice steps) */}
                {currentStep.type !== "choice" && currentStep.type !== "wheel_choice" && transmissionComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex justify-end"
                  >
                    <button
                      onClick={advanceStep}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-mono hover:bg-primary/20 transition-colors"
                    >
                      {isLastStep ? "COMPLETE" : "CONTINUE"}
                      <ChevronRight size={14} />
                    </button>
                  </motion.div>
                )}

                {/* Auto-advance for narration steps */}
                {currentStep.type === "narration" && currentStep.autoAdvanceMs && transmissionComplete && (
                  <AutoAdvance delay={currentStep.autoAdvanceMs} onAdvance={advanceStep} />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ HUMAN RESPONSE PHASE ═══ */}
        {phase === "human_response" && selectedChoice && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-2xl mx-4"
          >
            <div className="rounded-xl border border-red-800/30 bg-card/95 overflow-hidden shadow-2xl">
              {/* Human header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-red-800/30 bg-red-950/30">
                <div className="w-8 h-8 rounded-full bg-red-950/50 border border-red-800/40 flex items-center justify-center">
                  <Skull size={14} className="text-red-400" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-red-400 tracking-wide">// SIGNAL INTERCEPT</p>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-wider">THE HUMAN RESPONDS</p>
                </div>
                <MoralityShiftBadge shift={selectedChoice.moralityShift} />
              </div>

              <div className="px-5 py-4">
                {/* Player's choice recap */}
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/40 mb-4">
                  <span className="font-mono text-[10px] text-muted-foreground mt-0.5 shrink-0">YOU:</span>
                  <p className="text-xs text-foreground/70 italic">{selectedChoice.text}</p>
                </div>

                {/* Human's response as typed transmission */}
                <TransmissionDisplay
                  key={`human-response-${stepIndex}`}
                  messages={[{
                    speaker: "human" as const,
                    text: fillTemplate(selectedChoice.humanResponse || ""),
                    corruptionLevel: 40,
                    typingSpeed: 25,
                    voUrl: selectedChoice.humanVoAudioUrl,
                  }]}
                  showHeaders={false}
                  onAllComplete={handleHumanResponseComplete}
                />

                {/* Continue button (shows after human response if no elara response) */}
                {!selectedChoice.elaraResponse && transmissionComplete && (
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

        {/* ═══ ELARA RESPONSE PHASE ═══ */}
        {phase === "elara_response" && selectedChoice && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-2xl mx-4"
          >
            <div className="rounded-xl border border-cyan-800/30 bg-card/95 overflow-hidden shadow-2xl">
              {/* Elara header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-cyan-800/30 bg-cyan-950/30">
                <div className="w-8 h-8 rounded-full bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center">
                  <Radio size={14} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-cyan-400 tracking-wide">ELARA // SHIP AI</p>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-wider">RESPONDING</p>
                </div>
              </div>

              <div className="px-5 py-4">
                {/* Player's choice recap */}
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/40 mb-4">
                  <span className="font-mono text-[10px] text-muted-foreground mt-0.5 shrink-0">YOU:</span>
                  <p className="text-xs text-foreground/70 italic">{selectedChoice.text}</p>
                </div>

                {/* Elara's response as typed transmission */}
                <TransmissionDisplay
                  key={`elara-response-${stepIndex}`}
                  messages={[{
                    speaker: "elara" as const,
                    text: fillTemplate(selectedChoice.elaraResponse || ""),
                    typingSpeed: 18,
                  }]}
                  showHeaders={false}
                  onAllComplete={() => setTransmissionComplete(true)}
                />

                {/* Rewards earned */}
                {transmissionComplete && selectedChoice.rewards && selectedChoice.rewards.length > 0 && (
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
                {transmissionComplete && (
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
            className="w-full max-w-lg mx-4"
          >
            <div className="rounded-xl border border-accent/30 bg-card/95 overflow-hidden shadow-2xl">
              <div className="px-5 py-4 border-b border-border/40 bg-accent/5 text-center">
                <Award size={32} className="text-accent mx-auto mb-2" />
                <h3 className="font-display text-lg font-bold text-foreground tracking-wide">
                  {tutorial.act ? `ACT ${tutorial.act} COMPLETE` : "NARRATIVE COMPLETE"}
                </h3>
                <p className="font-mono text-xs text-muted-foreground mt-1">{tutorial.title}</p>
                {/* Find the reward_summary step for subtitle */}
                {filteredSteps.find(s => s.type === "reward_summary")?.subtitle && (
                  <p className="font-mono text-xs text-muted-foreground/70 mt-2 max-w-sm mx-auto italic">
                    {filteredSteps.find(s => s.type === "reward_summary")?.subtitle}
                  </p>
                )}
              </div>

              <div className="px-5 py-4 space-y-3">
                {/* Morality summary */}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40 border border-border/60">
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

                {/* Flags set summary */}
                {Object.keys(localFlags).length > 0 && (
                  <div className="px-3 py-2 rounded-lg bg-muted/40 border border-border/60">
                    <p className="font-mono text-[10px] text-primary/70 tracking-wider mb-1.5">NARRATIVE PATH</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.keys(localFlags).map(flag => (
                        <span key={flag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 border border-primary/20 text-primary/80">
                          {flag.replace(/_/g, " ").toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rewards collected */}
                {collectedRewards.length > 0 && (
                  <div className="px-3 py-2 rounded-lg bg-muted/40 border border-border/60">
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

/* ─── AUTO-ADVANCE HELPER ─── */
function AutoAdvance({ delay, onAdvance }: { delay: number; onAdvance: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onAdvance, delay);
    return () => clearTimeout(timer);
  }, [delay, onAdvance]);
  return null;
}
