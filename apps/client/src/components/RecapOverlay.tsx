/* ═══════════════════════════════════════════════════════
   "PREVIOUSLY ON DISCHORDIAN SAGA..."

   Full-screen cinematic recap overlay. Triggered on login
   after 3+ days away, or via a menu button. Dark cinema
   with letterbox bars, typewriter narration, faction-colored
   key choices, companion portraits, and a cliffhanger outro.
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SkipForward, Volume2, VolumeX, ChevronRight } from "lucide-react";
import { KineticText } from "@/components/void";
import AnimatedPortrait from "@/components/AnimatedPortrait";
import {
  generateRecap,
  formatRecapNarrative,
  type RecapReport,
} from "../../../shared/recapSystem";

// ─── CONSTANTS ───

/** Milliseconds between paragraphs auto-advancing */
const PARAGRAPH_DELAY_MS = 3200;
/** Days of inactivity before auto-showing the recap on login */
export const RECAP_INACTIVITY_DAYS = 3;

// ─── FACTION COLORS ───

const FACTION_COLORS = {
  Machine: "var(--energy-error)",   // red
  Balanced: "#a78bfa",  // purple
  Humanity: "var(--energy-success)",  // green
} as const;

// ─── COMPANION PORTRAIT MAP ───

const COMPANION_KEYWORDS: Record<string, string> = {
  elara: "elara",
  "the human": "the_human",
  human: "the_human",
  daniel: "the_human",
};

function detectCompanionInText(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [keyword, npcId] of Object.entries(COMPANION_KEYWORDS)) {
    if (lower.includes(keyword)) return npcId;
  }
  return null;
}

// ─── HELPERS ───

/** Check if user should see the recap on login. */
export function shouldShowRecap(lastLoginTimestamp: number | null): boolean {
  if (!lastLoginTimestamp) return false;
  const daysSince = (Date.now() - lastLoginTimestamp) / (1000 * 60 * 60 * 24);
  return daysSince >= RECAP_INACTIVITY_DAYS;
}

// ─── PROPS ───

interface RecapOverlayProps {
  /** Server-side progressData blob */
  progressData: Record<string, unknown>;
  /** Server-side gameData blob */
  gameData: Record<string, unknown>;
  /** Called when the recap is complete or skipped */
  onComplete: () => void;
  /** Called when skip/close is pressed */
  onClose: () => void;
  /** Whether ambient audio is enabled */
  audioEnabled?: boolean;
  /** Toggle audio callback */
  onToggleAudio?: () => void;
}

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════

export default function RecapOverlay({
  progressData,
  gameData,
  onComplete,
  onClose,
  audioEnabled = false,
  onToggleAudio,
}: RecapOverlayProps) {
  // ─── Recap data ───
  const recap: RecapReport = useMemo(
    () => generateRecap(progressData, gameData),
    [progressData, gameData],
  );
  const paragraphs = useMemo(() => formatRecapNarrative(recap), [recap]);

  // ─── State ───
  const [phase, setPhase] = useState<"title" | "narrating" | "cliffhanger">("title");
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [paragraphComplete, setParagraphComplete] = useState(false);
  const [visibleCompanion, setVisibleCompanion] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Title phase ───
  useEffect(() => {
    if (phase === "title") {
      const t = setTimeout(() => setPhase("narrating"), 3500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // ─── Auto-advance paragraphs ───
  useEffect(() => {
    if (phase !== "narrating" || !paragraphComplete) return;

    timerRef.current = setTimeout(() => {
      if (currentParagraph < paragraphs.length - 1) {
        setCurrentParagraph(p => p + 1);
        setParagraphComplete(false);
      } else {
        setPhase("cliffhanger");
      }
    }, PARAGRAPH_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, paragraphComplete, currentParagraph, paragraphs.length]);

  // ─── Detect companion in current paragraph ───
  useEffect(() => {
    if (phase === "narrating" && paragraphs[currentParagraph]) {
      const companion = detectCompanionInText(paragraphs[currentParagraph]);
      setVisibleCompanion(companion);
    } else {
      setVisibleCompanion(null);
    }
  }, [phase, currentParagraph, paragraphs]);

  // ─── Handlers ───
  const handleKineticComplete = useCallback(() => {
    setParagraphComplete(true);
  }, []);

  const handleAdvance = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (phase === "title") {
      setPhase("narrating");
      return;
    }
    if (phase === "narrating") {
      if (!paragraphComplete) {
        // Skip to end of current paragraph (mark complete)
        setParagraphComplete(true);
        return;
      }
      if (currentParagraph < paragraphs.length - 1) {
        setCurrentParagraph(p => p + 1);
        setParagraphComplete(false);
      } else {
        setPhase("cliffhanger");
      }
      return;
    }
    if (phase === "cliffhanger") {
      onComplete();
    }
  }, [phase, paragraphComplete, currentParagraph, paragraphs.length, onComplete]);

  const handleSkip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onClose();
  }, [onClose]);

  // ─── Determine faction color for highlighted keywords ───
  const factionColor = FACTION_COLORS[recap.alignment];

  // ─── Is current paragraph an act heading? ───
  const isActHeading = (text: string) => text.startsWith("—") && text.endsWith("—");

  // ─── Current paragraph text ───
  const currentText = paragraphs[currentParagraph] ?? "";

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        style={{ background: "#000" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        onClick={handleAdvance}
        role="dialog"
        aria-label="Previously on Dischordian Saga"
      >
        {/* ─── LETTERBOX TOP BAR ─── */}
        <div
          className="w-full shrink-0"
          style={{
            height: "12vh",
            background: "linear-gradient(to bottom, #000 80%, transparent)",
          }}
        />

        {/* ─── MAIN CONTENT AREA ─── */}
        <div className="relative flex-1 flex items-center justify-center w-full max-w-4xl px-8">
          {/* ─── TITLE PHASE ─── */}
          <AnimatePresence mode="wait">
            {phase === "title" && (
              <motion.div
                key="title"
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <KineticText
                  text="PREVIOUSLY ON DISCHORDIAN SAGA..."
                  mode="char"
                  speed={60}
                  as="h1"
                  className="text-2xl sm:text-4xl font-bold tracking-[0.3em] uppercase"
                  style={{ color: "var(--energy-primary)" }}
                  showCursor={false}
                  effect="breathe"
                />
                <motion.div
                  className="mt-6 text-sm tracking-widest uppercase"
                  style={{ color: "color-mix(in oklch, var(--text-primary) 40%, transparent)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 0.8 }}
                >
                  Click to continue
                </motion.div>
              </motion.div>
            )}

            {/* ─── NARRATION PHASE ─── */}
            {phase === "narrating" && (
              <motion.div
                key={`para-${currentParagraph}`}
                className="w-full flex items-center gap-8"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Companion portrait (left side, if relevant) */}
                <AnimatePresence>
                  {visibleCompanion && (
                    <motion.div
                      key={visibleCompanion}
                      className="hidden md:block shrink-0 w-32 h-32 rounded-lg overflow-hidden"
                      style={{
                        border: `2px solid ${visibleCompanion === "elara" ? "var(--energy-success)" : "var(--energy-error)"}`,
                        boxShadow: `0 0 20px ${visibleCompanion === "elara" ? "color-mix(in oklch, var(--energy-success) 30%, transparent)" : "color-mix(in oklch, var(--energy-error) 30%, transparent)"}`,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                    >
                      <AnimatedPortrait
                        npcId={visibleCompanion}
                        expression="neutral"
                        isSpeaking={false}
                        trustLevel={50}
                        size="bust"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Paragraph text */}
                <div className="flex-1 min-w-0">
                  {isActHeading(currentText) ? (
                    <motion.h2
                      className="text-lg sm:text-xl font-bold tracking-[0.2em] uppercase text-center"
                      style={{ color: factionColor }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      onAnimationComplete={handleKineticComplete}
                    >
                      {currentText}
                    </motion.h2>
                  ) : (
                    <KineticText
                      text={currentText}
                      mode="char"
                      speed={30}
                      as="p"
                      className="text-base sm:text-lg leading-relaxed"
                      style={{
                        color: "color-mix(in oklch, var(--text-primary) 90%, transparent)",
                        fontFamily: "'Georgia', serif",
                        lineHeight: 1.8,
                      }}
                      showCursor
                      onComplete={handleKineticComplete}
                    />
                  )}

                  {/* Key choices for the current recap entry (if any) */}
                  {paragraphComplete && recap.entries[currentParagraph - 2] && (
                    <motion.div
                      className="mt-4 flex flex-wrap gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {recap.entries[currentParagraph - 2]?.keyChoices
                        .slice(0, 2)
                        .map((choice, i) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1 rounded-full border"
                            style={{
                              color: factionColor,
                              borderColor: factionColor,
                              background: `${factionColor}15`,
                            }}
                          >
                            {choice}
                          </span>
                        ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── CLIFFHANGER PHASE ─── */}
            {phase === "cliffhanger" && (
              <motion.div
                key="cliffhanger"
                className="text-center max-w-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <KineticText
                  text={recap.cliffhanger}
                  mode="char"
                  speed={35}
                  as="p"
                  className="text-lg sm:text-xl leading-relaxed italic"
                  style={{
                    color: "var(--energy-primary)",
                    fontFamily: "'Georgia', serif",
                    lineHeight: 1.8,
                  }}
                  showCursor={false}
                  effect="breathe"
                />

                <motion.button
                  className="mt-10 px-8 py-3 text-sm font-bold tracking-[0.2em] uppercase rounded-lg border-2 transition-colors"
                  style={{
                    color: factionColor,
                    borderColor: factionColor,
                    background: "transparent",
                  }}
                  whileHover={{
                    background: `${factionColor}20`,
                    scale: 1.03,
                  }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.6 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete();
                  }}
                >
                  <span className="flex items-center gap-2">
                    Continue Your Story
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── PROGRESS INDICATOR ─── */}
          {phase === "narrating" && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {paragraphs.map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                  style={{
                    background: i <= currentParagraph
                      ? factionColor
                      : "color-mix(in oklch, var(--text-primary) 15%, transparent)",
                  }}
                />
              ))}
            </div>
          )}

          {/* ─── ALIGNMENT BADGE ─── */}
          {phase !== "title" && (
            <motion.div
              className="absolute top-2 left-4 text-xs font-mono tracking-wider uppercase"
              style={{ color: factionColor, opacity: 0.6 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5 }}
            >
              {recap.alignment} Path — Score {recap.alignmentScore > 0 ? "+" : ""}
              {recap.alignmentScore}
            </motion.div>
          )}
        </div>

        {/* ─── LETTERBOX BOTTOM BAR ─── */}
        <div
          className="w-full shrink-0"
          style={{
            height: "12vh",
            background: "linear-gradient(to top, #000 80%, transparent)",
          }}
        />

        {/* ─── SKIP BUTTON (top-right corner) ─── */}
        <motion.button
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded border transition-opacity"
          style={{
            color: "color-mix(in oklch, var(--text-primary) 50%, transparent)",
            borderColor: "color-mix(in oklch, var(--text-primary) 15%, transparent)",
            background: "color-mix(in oklch, var(--bg-void) 40%, transparent)",
          }}
          whileHover={{ color: "color-mix(in oklch, var(--text-primary) 90%, transparent)", borderColor: "color-mix(in oklch, var(--text-primary) 40%, transparent)" }}
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          aria-label="Skip recap"
        >
          <SkipForward className="w-3 h-3" />
          Skip
        </motion.button>

        {/* ─── AUDIO TOGGLE (bottom-right) ─── */}
        {onToggleAudio && (
          <motion.button
            className="absolute bottom-6 right-6 p-2 rounded-full border transition-opacity"
            style={{
              color: "color-mix(in oklch, var(--text-primary) 40%, transparent)",
              borderColor: "color-mix(in oklch, var(--text-primary) 10%, transparent)",
              background: "color-mix(in oklch, var(--bg-void) 30%, transparent)",
            }}
            whileHover={{ color: "color-mix(in oklch, var(--text-primary) 80%, transparent)" }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleAudio();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
