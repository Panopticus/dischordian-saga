/* ═══════════════════════════════════════════════════════
   GESTURE TUTORIAL — Interactive MCOC-style control walkthrough
   Teaches each swipe/tap control with visual prompts before
   the first fight. Steps through: Block, Dash Back, Dash Forward,
   Light Attack, Medium Attack, Heavy Attack, Special Attack.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Swords, ChevronLeft, ChevronRight, ChevronUp,
  Zap, X, Hand, ArrowLeft, ArrowRight, Timer
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  zone: "left" | "right";
  gesture: "hold" | "tap" | "swipe_left" | "swipe_right" | "swipe_up" | "hold_release";
  icon: React.ReactNode;
  keyboardHint: string;
  color: string;
  glowColor: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "block",
    title: "BLOCK",
    description: "Hold the LEFT side of the screen to block incoming attacks. Timing it just before a hit triggers a PARRY, stunning your opponent!",
    zone: "left",
    gesture: "hold",
    icon: <Shield size={28} />,
    keyboardHint: "Hold S",
    color: "#22d3ee",
    glowColor: "rgba(34, 211, 238, 0.3)",
  },
  {
    id: "dash_back",
    title: "DASH BACK",
    description: "Swipe LEFT on the left side to dash backward. If timed during an enemy attack, you'll perform a DEXTERITY evade — complete invincibility!",
    zone: "left",
    gesture: "swipe_left",
    icon: <ArrowLeft size={28} />,
    keyboardHint: "Press Q",
    color: "#22d3ee",
    glowColor: "rgba(34, 211, 238, 0.3)",
  },
  {
    id: "dash_fwd",
    title: "DASH FORWARD",
    description: "Swipe RIGHT on the left side to dash forward and close distance. Attack during the opponent's dash for an INTERCEPT bonus!",
    zone: "left",
    gesture: "swipe_right",
    icon: <ArrowRight size={28} />,
    keyboardHint: "Press E",
    color: "#22d3ee",
    glowColor: "rgba(34, 211, 238, 0.3)",
  },
  {
    id: "light",
    title: "LIGHT ATTACK",
    description: "Tap the RIGHT side for quick light attacks. Chain up to 5 hits in a combo: Light → Light → Light → Light → Medium!",
    zone: "right",
    gesture: "tap",
    icon: <Hand size={28} />,
    keyboardHint: "Press J",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.3)",
  },
  {
    id: "medium",
    title: "MEDIUM ATTACK",
    description: "Swipe RIGHT on the right side for a powerful medium attack with forward lunge. Great as a combo finisher after light attacks!",
    zone: "right",
    gesture: "swipe_right",
    icon: <Swords size={28} />,
    keyboardHint: "Press K",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.3)",
  },
  {
    id: "heavy",
    title: "HEAVY ATTACK",
    description: "Hold the RIGHT side to charge a heavy attack. Release to unleash! Fully charged heavies break through blocks (GUARD BREAK).",
    zone: "right",
    gesture: "hold_release",
    icon: <Zap size={28} />,
    keyboardHint: "Hold L",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.3)",
  },
  {
    id: "special",
    title: "SPECIAL ATTACK",
    description: "Swipe UP on the right side when your special meter is charged. Each character has unique SP1, SP2, and SP3 moves with special effects!",
    zone: "right",
    gesture: "swipe_up",
    icon: <ChevronUp size={28} />,
    keyboardHint: "Press Space",
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.3)",
  },
];

interface GestureTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function GestureTutorial({ onComplete, onSkip }: GestureTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [gestureCompleted, setGestureCompleted] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [holdTimer, setHoldTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  // Clean up hold interval on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (holdTimer) clearTimeout(holdTimer);
    };
  }, [holdTimer]);

  const advanceStep = useCallback(() => {
    setGestureCompleted(true);
    setTimeout(() => {
      if (isLastStep) {
        onComplete();
      } else {
        setCurrentStep((s) => s + 1);
        setGestureCompleted(false);
        setHoldProgress(0);
      }
    }, 600);
  }, [isLastStep, onComplete]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, zone: "left" | "right") => {
      if (gestureCompleted) return;
      if (step.zone !== zone) return;

      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() });

      // Hold gestures
      if (step.gesture === "hold" || step.gesture === "hold_release") {
        setHoldProgress(0);
        holdIntervalRef.current = setInterval(() => {
          setHoldProgress((p) => {
            const next = Math.min(p + 2, 100);
            return next;
          });
        }, 20);

        if (step.gesture === "hold") {
          const timer = setTimeout(() => {
            if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
            advanceStep();
          }, 1000);
          setHoldTimer(timer);
        }
      }
    },
    [step, gestureCompleted, advanceStep]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent, zone: "left" | "right") => {
      if (gestureCompleted) return;
      if (step.zone !== zone || !touchStart) return;

      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
      if (holdTimer) {
        clearTimeout(holdTimer);
        setHoldTimer(null);
      }

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      const elapsed = Date.now() - touchStart.time;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Tap detection
      if (step.gesture === "tap" && dist < 20 && elapsed < 300) {
        advanceStep();
      }

      // Swipe detection
      const SWIPE_THRESHOLD = 40;
      if (dist >= SWIPE_THRESHOLD) {
        if (step.gesture === "swipe_left" && dx < -SWIPE_THRESHOLD && Math.abs(dy) < Math.abs(dx)) {
          advanceStep();
        }
        if (step.gesture === "swipe_right" && dx > SWIPE_THRESHOLD && Math.abs(dy) < Math.abs(dx)) {
          advanceStep();
        }
        if (step.gesture === "swipe_up" && dy < -SWIPE_THRESHOLD && Math.abs(dx) < Math.abs(dy)) {
          advanceStep();
        }
      }

      // Hold-release detection
      if (step.gesture === "hold_release" && elapsed > 500) {
        advanceStep();
      }

      setTouchStart(null);
      setHoldProgress(0);
    },
    [step, touchStart, gestureCompleted, advanceStep, holdTimer]
  );

  // Keyboard support for desktop
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gestureCompleted) return;
      const key = e.key.toLowerCase();

      if (key === "escape") { onSkip(); return; }

      switch (step.gesture) {
        case "hold":
          if (key === "s") advanceStep();
          break;
        case "swipe_left":
          if (key === "q") advanceStep();
          break;
        case "swipe_right":
          if (key === "e" && step.zone === "left") advanceStep();
          if (key === "k" && step.zone === "right") advanceStep();
          break;
        case "tap":
          if (key === "j") advanceStep();
          break;
        case "hold_release":
          if (key === "l") advanceStep();
          break;
        case "swipe_up":
          if (key === " ") advanceStep();
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [step, gestureCompleted, advanceStep, onSkip]);

  const renderGestureAnimation = () => {
    switch (step.gesture) {
      case "hold":
        return (
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: step.color }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="absolute inset-2 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: step.glowColor }}>
              <Hand size={24} style={{ color: step.color }} />
            </div>
            {holdProgress > 0 && (
              <svg className="absolute inset-0 w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke={step.color}
                        strokeWidth="3" strokeDasharray={`${holdProgress * 1.76} 176`}
                        opacity={0.8} />
              </svg>
            )}
          </div>
        );
      case "tap":
        return (
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: step.glowColor, border: `2px solid ${step.color}` }}
            animate={{ scale: [1, 0.85, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <Hand size={24} style={{ color: step.color }} />
          </motion.div>
        );
      case "swipe_left":
        return (
          <motion.div className="flex items-center gap-1">
            <motion.div
              animate={{ x: [20, -20] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
            >
              <ChevronLeft size={32} style={{ color: step.color }} />
            </motion.div>
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: step.color }}
              animate={{ x: [20, -20], opacity: [1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
            />
          </motion.div>
        );
      case "swipe_right":
        return (
          <motion.div className="flex items-center gap-1">
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: step.color }}
              animate={{ x: [-20, 20], opacity: [1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
            />
            <motion.div
              animate={{ x: [-20, 20] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
            >
              <ChevronRight size={32} style={{ color: step.color }} />
            </motion.div>
          </motion.div>
        );
      case "swipe_up":
        return (
          <motion.div className="flex flex-col items-center">
            <motion.div
              animate={{ y: [15, -15] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
            >
              <ChevronUp size={32} style={{ color: step.color }} />
            </motion.div>
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: step.color }}
              animate={{ y: [15, -15], opacity: [1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
            />
          </motion.div>
        );
      case "hold_release":
        return (
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: step.glowColor, border: `2px solid ${step.color}` }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Timer size={24} style={{ color: step.color }} />
            </div>
            {holdProgress > 0 && (
              <svg className="absolute inset-0 w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke={step.color}
                        strokeWidth="3" strokeDasharray={`${holdProgress * 1.76} 176`}
                        opacity={0.8} />
              </svg>
            )}
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ touchAction: "none" }}>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="absolute top-3 right-3 z-60 flex items-center gap-1.5 px-3 py-1.5 rounded-md
                   bg-white/10 border border-white/20 text-white/70 text-xs font-mono
                   hover:bg-white/20 hover:text-white transition-all"
      >
        <X size={12} /> SKIP TUTORIAL
      </button>

      {/* Progress dots */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-60 flex gap-2">
        {TUTORIAL_STEPS.map((s, i) => (
          <div
            key={s.id}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < currentStep ? step.color : i === currentStep ? step.color : "rgba(255,255,255,0.2)",
              opacity: i <= currentStep ? 1 : 0.4,
              transform: i === currentStep ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Content area */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            {/* Step icon */}
            <motion.div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: step.glowColor, border: `1px solid ${step.color}` }}
              animate={gestureCompleted ? { scale: [1, 1.2, 1] } : {}}
            >
              <span style={{ color: step.color }}>{step.icon}</span>
            </motion.div>

            {/* Title */}
            <h2
              className="font-display text-xl font-bold tracking-[0.2em] mb-2"
              style={{ color: step.color }}
            >
              {step.title}
            </h2>

            {/* Description */}
            <p className="font-mono text-xs text-white/70 leading-relaxed mb-4">
              {step.description}
            </p>

            {/* Keyboard hint */}
            <p className="font-mono text-[10px] text-white/40 mb-5">
              KEYBOARD: {step.keyboardHint}
            </p>

            {/* Gesture animation */}
            <div className="mb-4">
              {gestureCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl"
                  style={{ color: step.color }}
                >
                  ✓
                </motion.div>
              ) : (
                renderGestureAnimation()
              )}
            </div>

            {/* Instruction */}
            {!gestureCompleted && (
              <motion.p
                className="font-mono text-[10px] tracking-[0.15em] uppercase"
                style={{ color: step.color }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {step.gesture === "tap" ? "TAP" :
                 step.gesture === "hold" ? "HOLD" :
                 step.gesture === "hold_release" ? "HOLD & RELEASE" :
                 step.gesture.startsWith("swipe") ? "SWIPE" : "PERFORM"}{" "}
                ON THE {step.zone.toUpperCase()} SIDE
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Touch zones — split screen */}
      <div className="absolute inset-0 flex z-20" style={{ pointerEvents: "auto" }}>
        {/* Left zone */}
        <div
          className="flex-1 relative"
          onTouchStart={(e) => handleTouchStart(e, "left")}
          onTouchEnd={(e) => handleTouchEnd(e, "left")}
        >
          {step.zone === "left" && !gestureCompleted && (
            <motion.div
              className="absolute inset-0 border-r"
              style={{ borderColor: `${step.color}40`, backgroundColor: `${step.color}08` }}
              animate={{ backgroundColor: [`${step.color}08`, `${step.color}15`, `${step.color}08`] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <span className="font-mono text-[9px] text-white/30 tracking-[0.2em]">DEFENSE</span>
          </div>
        </div>

        {/* Right zone */}
        <div
          className="flex-1 relative"
          onTouchStart={(e) => handleTouchStart(e, "right")}
          onTouchEnd={(e) => handleTouchEnd(e, "right")}
        >
          {step.zone === "right" && !gestureCompleted && (
            <motion.div
              className="absolute inset-0 border-l"
              style={{ borderColor: `${step.color}40`, backgroundColor: `${step.color}08` }}
              animate={{ backgroundColor: [`${step.color}08`, `${step.color}15`, `${step.color}08`] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <span className="font-mono text-[9px] text-white/30 tracking-[0.2em]">OFFENSE</span>
          </div>
        </div>
      </div>

      {/* Step counter */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-60">
        <span className="font-mono text-[10px] text-white/30">
          {currentStep + 1} / {TUTORIAL_STEPS.length}
        </span>
      </div>
    </div>
  );
}
