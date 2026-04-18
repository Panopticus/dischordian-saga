/* ═══════════════════════════════════════════════════════
   POST-AWAKENING ORIENTATION — ARK GUIDED TOUR

   Triggered after awakening completion, before free
   exploration. Elara walks the player through the main
   UI sections in a 5-step guided tour with highlight
   boxes around each element.

   Sets `ark_orientation_complete` in localStorage when
   finished or skipped.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── ORIENTATION STEP ─── */

export interface OrientationStep {
  /** CSS selector of the element to highlight */
  targetSelector: string;
  /** Title shown in the tooltip */
  title: string;
  /** Elara's dialog for this step */
  dialog: string;
  /** Where to position the tooltip relative to the target */
  placement: "top" | "bottom" | "left" | "right";
}

const STEPS: OrientationStep[] = [
  {
    targetSelector: "[data-tour='dashboard']",
    title: "Your Dashboard",
    dialog:
      "This is your command center. Everything you need -- your stats, companions, recent activity -- it all lives here. Think of it as the bridge of our little ship.",
    placement: "bottom",
  },
  {
    targetSelector: "[data-tour='navigation']",
    title: "Navigation",
    dialog:
      "The sidebar is your map through the Ark. Quests, games, your character sheet... each section is a corridor waiting to be explored. I suggest starting with the quest board.",
    placement: "right",
  },
  {
    targetSelector: "[data-tour='daily-rewards']",
    title: "Daily Rewards",
    dialog:
      "Come back every day and this will be waiting for you. The Ark rewards consistency -- streaks unlock rarer items. I... may have set this up while you were asleep.",
    placement: "bottom",
  },
  {
    targetSelector: "[data-tour='quest-board']",
    title: "Quest Board",
    dialog:
      "Quests are how we make progress out here. Some are simple -- defeat a few enemies, solve a puzzle. Others will test everything you believe in. Choose wisely.",
    placement: "bottom",
  },
  {
    targetSelector: "[data-tour='games']",
    title: "Games Section",
    dialog:
      "Not everything has to be life-or-death. Chess, cards, puzzles -- they sharpen your mind and earn you XP. Plus, some of us find it... therapeutic. Welcome aboard, Captain.",
    placement: "left",
  },
];

const STORAGE_KEY = "ark_orientation_complete";

/* ─── HIGHLIGHT OVERLAY ─── */

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getElementRect(selector: string): HighlightRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top - 8,
    left: rect.left - 8,
    width: rect.width + 16,
    height: rect.height + 16,
  };
}

function getTooltipPosition(
  rect: HighlightRect,
  placement: OrientationStep["placement"],
): { top: number; left: number } {
  const gap = 16;
  switch (placement) {
    case "top":
      return { top: rect.top - gap, left: rect.left + rect.width / 2 };
    case "bottom":
      return { top: rect.top + rect.height + gap, left: rect.left + rect.width / 2 };
    case "left":
      return { top: rect.top + rect.height / 2, left: rect.left - gap };
    case "right":
      return { top: rect.top + rect.height / 2, left: rect.left + rect.width + gap };
  }
}

/* ─── PROPS ─── */

interface Props {
  /** Override: force show even if previously completed */
  forceShow?: boolean;
  /** Called when orientation finishes or is skipped */
  onComplete?: () => void;
}

/* ─── MAIN COMPONENT ─── */

export default function ArkOrientation({ forceShow = false, onComplete }: Props) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null);
  const rafRef = useRef<number>(0);

  // Check if orientation should show
  useEffect(() => {
    if (forceShow) {
      setActive(true);
      return;
    }
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      setActive(true);
    }
  }, [forceShow]);

  // Track the highlight target
  useEffect(() => {
    if (!active) return;

    const updateRect = () => {
      const currentStep = STEPS[step];
      if (currentStep) {
        setHighlightRect(getElementRect(currentStep.targetSelector));
      }
      rafRef.current = requestAnimationFrame(updateRect);
    };
    rafRef.current = requestAnimationFrame(updateRect);

    return () => cancelAnimationFrame(rafRef.current);
  }, [active, step]);

  const finish = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setActive(false);
    onComplete?.();
  }, [onComplete]);

  const nextStep = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }, [step, finish]);

  const prevStep = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  if (!active) return null;

  const currentStep = STEPS[step];
  const tooltipPos = highlightRect
    ? getTooltipPosition(highlightRect, currentStep.placement)
    : null;

  const tooltipTransform = (() => {
    switch (currentStep.placement) {
      case "top":
        return "translate(-50%, -100%)";
      case "bottom":
        return "translate(-50%, 0)";
      case "left":
        return "translate(-100%, -50%)";
      case "right":
        return "translate(0, -50%)";
    }
  })();

  return (
    <AnimatePresence>
      <motion.div
        key="ark-orientation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998]"
      >
        {/* Dimmed overlay with cutout */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="orientation-mask">
              <rect width="100%" height="100%" fill="white" />
              {highlightRect && (
                <rect
                  x={highlightRect.left}
                  y={highlightRect.top}
                  width={highlightRect.width}
                  height={highlightRect.height}
                  rx={8}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="color-mix(in oklch, var(--bg-void) 75%, transparent)"
            mask="url(#orientation-mask)"
          />
        </svg>

        {/* Highlight border */}
        {highlightRect && (
          <motion.div
            layoutId="highlight-border"
            className="absolute border-2 void-border-system rounded-lg pointer-events-none"
            style={{
              top: highlightRect.top,
              left: highlightRect.left,
              width: highlightRect.width,
              height: highlightRect.height,
              boxShadow: "0 0 20px rgba(167,139,250,0.3), inset 0 0 20px rgba(167,139,250,0.1)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        )}

        {/* Tooltip */}
        {tooltipPos && (
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute z-10 max-w-sm w-80"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: tooltipTransform,
            }}
          >
            <div className="bg-card/95 border void-border-system rounded-lg p-4 backdrop-blur-md shadow-2xl">
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="void-text-system" />
                  <span className="font-display text-xs font-bold tracking-wide void-text-system">
                    {currentStep.title}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">
                  {step + 1} / {STEPS.length}
                </span>
              </div>

              {/* Elara dialog */}
              <div className="mb-4">
                <div className="text-[9px] font-mono uppercase tracking-wider void-text-system mb-1">
                  Elara
                </div>
                <p className="text-sm leading-relaxed text-white/90 italic">
                  &ldquo;{currentStep.dialog}&rdquo;
                </p>
              </div>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-1.5 mb-3">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === step
                        ? "void-bg-system"
                        : i < step
                          ? "void-bg-system"
                          : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStep}
                  disabled={step === 0}
                  className="text-xs gap-1"
                >
                  <ChevronLeft size={14} />
                  Back
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={finish}
                  className="text-xs text-muted-foreground gap-1"
                >
                  <X size={12} />
                  Skip
                </Button>

                <Button
                  size="sm"
                  onClick={nextStep}
                  className="text-xs gap-1 void-bg-system void-bg-system"
                >
                  {step === STEPS.length - 1 ? "Finish" : "Next"}
                  {step < STEPS.length - 1 && <ChevronRight size={14} />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Fallback when target not found */}
        {!highlightRect && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card/95 border void-border-system rounded-lg p-6 backdrop-blur-md shadow-2xl max-w-sm text-center">
              <Sparkles size={24} className="void-text-system mx-auto mb-3" />
              <h3 className="font-display text-sm font-bold mb-2">{currentStep.title}</h3>
              <div className="text-[9px] font-mono uppercase tracking-wider void-text-system mb-1">
                Elara
              </div>
              <p className="text-sm text-white/90 italic mb-4">
                &ldquo;{currentStep.dialog}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button variant="ghost" size="sm" onClick={prevStep} disabled={step === 0}>
                  <ChevronLeft size={14} />
                </Button>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {step + 1}/{STEPS.length}
                </span>
                <Button size="sm" onClick={nextStep} className="void-bg-system void-bg-system">
                  {step === STEPS.length - 1 ? "Finish" : "Next"}
                </Button>
                <Button variant="ghost" size="sm" onClick={finish} className="text-muted-foreground">
                  <X size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
