/* ═══════════════════════════════════════════════════════
   THE MEME'S RERUNS — Seasonal Event Replay Overlay
   ───────────────────────────────────────────────────────
   Full-screen overlay styled like a retro TV broadcast
   with scanlines, static, and The Meme's sardonic narration.
   Players who missed seasonal events can experience the
   story beats and make their own choices against the
   community results.

   REWARDS: XP + lore entries ONLY. No exclusive cosmetics.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tv, SkipForward, ChevronRight, Award, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  ReplayNarration,
  CommunityChoice,
  ReplayReward,
} from "@shared/seasonalReplay";

/* ── Types ── */

interface SeasonalReplayOverlayProps {
  /** The generated replay narration from generateReplay() */
  narration: ReplayNarration;
  /** Event display name */
  eventName: string;
  /** Event theme color (hex) */
  eventColor: string;
  /** Called when the player makes a choice */
  onChoice: (choiceId: string, option: string) => void;
  /** Called when the overlay is closed */
  onClose: () => void;
  /** Called when replay is fully complete and rewards should be granted */
  onComplete: (rewards: ReplayReward[]) => void;
}

type ReplayPhase = "intro" | "summary" | "choice" | "reaction" | "rewards" | "outro";

/* ── Scanline & Static CSS (injected inline) ── */

const SCANLINE_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
  pointerEvents: "none",
  zIndex: 10,
};

const STATIC_OVERLAY_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  opacity: 0.04,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
  backgroundSize: "128px 128px",
  pointerEvents: "none",
  zIndex: 11,
  animation: "meme-static-flicker 0.1s infinite",
};

const CRT_VIGNETTE_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
  pointerEvents: "none",
  zIndex: 12,
};

/* ── Typewriter Hook ── */

function useTypewriter(text: string, speed: number = 30) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    if (!text) {
      setDone(true);
      return;
    }

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  const skip = useCallback(() => {
    setDisplayed(text);
    setDone(true);
  }, [text]);

  return { displayed, done, skip };
}

/* ── Bar Chart for Community Results ── */

function CommunityResultsBar({
  option,
  percentage,
  isWinner,
  isPlayerChoice,
  color,
}: {
  option: string;
  percentage: number;
  isWinner: boolean;
  isPlayerChoice: boolean;
  color: string;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          marginBottom: 4,
          color: isPlayerChoice ? color : "#a0a0a0",
          fontFamily: "'Courier New', monospace",
        }}
      >
        <span>
          {option}
          {isPlayerChoice && " ◄ YOU"}
          {isWinner && " ★ COMMUNITY"}
        </span>
        <span>{percentage}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 20,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 2,
          overflow: "hidden",
          border: isPlayerChoice
            ? `1px solid ${color}`
            : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            height: "100%",
            background: isPlayerChoice
              ? `linear-gradient(90deg, ${color}, ${color}88)`
              : "linear-gradient(90deg, #555, #333)",
            boxShadow: isPlayerChoice ? `0 0 10px ${color}44` : "none",
          }}
        />
      </div>
    </div>
  );
}

/* ── Main Component ── */

export default function SeasonalReplayOverlay({
  narration,
  eventName,
  eventColor,
  onChoice,
  onClose,
  onComplete,
}: SeasonalReplayOverlayProps) {
  const [phase, setPhase] = useState<ReplayPhase>("intro");
  const [choiceIndex, setChoiceIndex] = useState(0);
  const [playerSelections, setPlayerSelections] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentChoice: CommunityChoice | undefined =
    narration.communityChoices[choiceIndex];

  // Determine which text to typewrite based on phase
  const typewriterText = useMemo(() => {
    switch (phase) {
      case "intro":
        return narration.memeIntro;
      case "summary":
        return narration.eventSummary;
      case "reaction": {
        const cId = currentChoice?.choiceId;
        return cId
          ? narration.memeReactions.get(`choice_${cId}`) ?? ""
          : "";
      }
      case "outro":
        return narration.memeReactions.get("outro") ?? "End of broadcast.";
      default:
        return "";
    }
  }, [phase, narration, currentChoice, choiceIndex]);

  const { displayed, done, skip: skipTypewriter } = useTypewriter(typewriterText, 25);

  /* ── Phase transitions ── */

  const advanceFromIntro = useCallback(() => {
    setPhase("summary");
  }, []);

  const advanceFromSummary = useCallback(() => {
    if (narration.communityChoices.length > 0) {
      setPhase("choice");
      setChoiceIndex(0);
      setShowResults(false);
    } else {
      setPhase("rewards");
    }
  }, [narration.communityChoices.length]);

  const handleChoice = useCallback(
    (choiceId: string, option: string) => {
      setPlayerSelections((prev) => ({ ...prev, [choiceId]: option }));
      onChoice(choiceId, option);
      setShowResults(true);
    },
    [onChoice],
  );

  const handleSkipChoice = useCallback(() => {
    if (currentChoice) {
      setPlayerSelections((prev) => ({ ...prev, [currentChoice.choiceId]: "skip" }));
      onChoice(currentChoice.choiceId, "skip");
      setShowResults(true);
    }
  }, [currentChoice, onChoice]);

  const advanceFromResults = useCallback(() => {
    setShowResults(false);
    setPhase("reaction");
  }, []);

  const advanceFromReaction = useCallback(() => {
    const nextIndex = choiceIndex + 1;
    if (nextIndex < narration.communityChoices.length) {
      setChoiceIndex(nextIndex);
      setShowResults(false);
      setPhase("choice");
    } else {
      setPhase("rewards");
    }
  }, [choiceIndex, narration.communityChoices.length]);

  const advanceFromRewards = useCallback(() => {
    setPhase("outro");
  }, []);

  const handleComplete = useCallback(() => {
    onComplete(narration.rewards);
    onClose();
  }, [narration.rewards, onComplete, onClose]);

  /* ── Render helpers ── */

  const renderContinueButton = (onClick: () => void, label: string = "Continue") => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{ marginTop: 24, textAlign: "center" }}
    >
      <Button
        onClick={onClick}
        style={{
          background: "transparent",
          border: `1px solid ${eventColor}`,
          color: eventColor,
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
          padding: "8px 24px",
          cursor: "pointer",
        }}
      >
        {label} <ChevronRight size={16} style={{ marginLeft: 4 }} />
      </Button>
    </motion.div>
  );

  const renderNarrationPhase = (onContinue: () => void) => (
    <div>
      <p
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 16,
          lineHeight: 1.7,
          color: "#e0e0e0",
          whiteSpace: "pre-wrap",
          minHeight: 100,
          cursor: !done ? "pointer" : "default",
        }}
        onClick={!done ? skipTypewriter : undefined}
      >
        {displayed}
        {!done && (
          <span
            style={{
              animation: "meme-blink 0.7s infinite",
              color: eventColor,
            }}
          >
            ▌
          </span>
        )}
      </p>
      {done && renderContinueButton(onContinue)}
    </div>
  );

  const renderChoicePhase = () => {
    if (!currentChoice) return null;

    return (
      <div>
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 15,
            color: "#c0c0c0",
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          {currentChoice.prompt}
        </p>

        {!showResults ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {currentChoice.options.map((option, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => handleChoice(currentChoice.choiceId, option)}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#e0e0e0",
                    fontFamily: "'Courier New', monospace",
                    fontSize: 14,
                    padding: "14px 20px",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: `1px solid ${eventColor}`,
                      color: eventColor,
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </Button>
              </motion.div>
            ))}

            <Button
              onClick={handleSkipChoice}
              variant="ghost"
              style={{
                color: "#666",
                fontFamily: "'Courier New', monospace",
                fontSize: 12,
                marginTop: 8,
              }}
            >
              Skip this choice
            </Button>
          </div>
        ) : (
          /* ── Community Results Bar Chart ── */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 12,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 16,
              }}
            >
              ▸ Community Poll Results
            </p>

            {currentChoice.options.map((option, i) => (
              <CommunityResultsBar
                key={i}
                option={option}
                percentage={currentChoice.communityResults[i] ?? 0}
                isWinner={i === currentChoice.communityWinner}
                isPlayerChoice={playerSelections[currentChoice.choiceId] === option}
                color={eventColor}
              />
            ))}

            {renderContinueButton(advanceFromResults, "See The Meme's Reaction")}
          </motion.div>
        )}
      </div>
    );
  };

  const renderRewardsPhase = () => (
    <div>
      <p
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: 2,
          marginBottom: 16,
        }}
      >
        ▸ Rerun Rewards
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {narration.rewards.map((reward, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2, duration: 0.3 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 4,
            }}
          >
            {reward.type === "xp" ? (
              <Award size={18} style={{ color: "#f59e0b", flexShrink: 0 }} />
            ) : (
              <BookOpen size={18} style={{ color: "#8b5cf6", flexShrink: 0 }} />
            )}
            <div>
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 14,
                  color: "#e0e0e0",
                  margin: 0,
                }}
              >
                {reward.label}
              </p>
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 11,
                  color: "#888",
                  margin: 0,
                  marginTop: 2,
                }}
              >
                {reward.type === "xp" ? `+${reward.amount} XP` : "Lore Entry Unlocked"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── NO EXCLUSIVE COSMETICS DISCLAIMER ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: narration.rewards.length * 0.2 + 0.3 }}
        style={{
          marginTop: 20,
          padding: "12px 16px",
          background: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: 4,
        }}
      >
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            color: "#ef4444",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          ⚠ NO EXCLUSIVE COSMETICS OR ACHIEVEMENTS
        </p>
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 12,
            color: "#999",
            margin: 0,
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          {narration.memeReactions.get("rewards_disclaimer") ??
            "Reruns grant XP and lore entries only. Exclusive rewards are reserved for live participants."}
        </p>
      </motion.div>

      {renderContinueButton(advanceFromRewards, "Finish Rerun")}
    </div>
  );

  /* ── Phase content router ── */
  const renderPhaseContent = () => {
    switch (phase) {
      case "intro":
        return renderNarrationPhase(advanceFromIntro);
      case "summary":
        return renderNarrationPhase(advanceFromSummary);
      case "choice":
        return renderChoicePhase();
      case "reaction":
        return renderNarrationPhase(advanceFromReaction);
      case "rewards":
        return renderRewardsPhase();
      case "outro":
        return renderNarrationPhase(handleComplete);
      default:
        return null;
    }
  };

  const phaseLabel = (() => {
    switch (phase) {
      case "intro":
        return "THE MEME SPEAKS";
      case "summary":
        return "EVENT RECAP";
      case "choice":
        return `COMMUNITY DECISION ${choiceIndex + 1}/${narration.communityChoices.length}`;
      case "reaction":
        return "THE MEME REACTS";
      case "rewards":
        return "YOUR REWARDS";
      case "outro":
        return "END OF BROADCAST";
      default:
        return "";
    }
  })();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.95)",
        }}
      >
        {/* CRT Effects */}
        <div style={SCANLINE_STYLE} />
        <div style={STATIC_OVERLAY_STYLE} />
        <div style={CRT_VIGNETTE_STYLE} />

        {/* Injected keyframes */}
        <style>{`
          @keyframes meme-static-flicker {
            0% { opacity: 0.03; }
            50% { opacity: 0.06; }
            100% { opacity: 0.03; }
          }
          @keyframes meme-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes meme-hue-rotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
          }
        `}</style>

        {/* Skip Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 20,
          }}
        >
          <Button
            onClick={onClose}
            variant="ghost"
            style={{
              color: "#555",
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <SkipForward size={14} />
            SKIP RERUN
          </Button>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: "relative",
            zIndex: 15,
            width: "100%",
            maxWidth: 680,
            padding: "0 24px",
          }}
        >
          {/* Branding Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <Tv
                size={24}
                style={{
                  color: eventColor,
                  filter: `drop-shadow(0 0 8px ${eventColor}66)`,
                }}
              />
              <h1
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  color: eventColor,
                  textTransform: "uppercase",
                  letterSpacing: 6,
                  margin: 0,
                  textShadow: `0 0 20px ${eventColor}44, 0 0 40px ${eventColor}22`,
                }}
              >
                The Meme's Reruns
              </h1>
              <Tv
                size={24}
                style={{
                  color: eventColor,
                  filter: `drop-shadow(0 0 8px ${eventColor}66)`,
                }}
              />
            </div>

            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 13,
                color: "#888",
                letterSpacing: 3,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Replaying: {eventName}
            </p>
          </motion.div>

          {/* Phase Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 6px #ef4444",
                animation: "meme-blink 1.5s infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                color: "#ef4444",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {phaseLabel}
            </span>
          </div>

          {/* Content Panel */}
          <motion.div
            key={`${phase}-${choiceIndex}-${showResults}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 4,
              padding: 24,
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            {renderPhaseContent()}
          </motion.div>

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              color: "#444",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            <span>THE MEME BROADCAST NETWORK</span>
            <span>SIGNAL: UNSTABLE</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
