/**
 * KineticText — Physics-aware animated text reveal.
 *
 * Wrapper around useKinetic hook. Renders text with mode-specific animation:
 * - char: typewriter
 * - word: AI streaming simulation
 * - cycle: rotating word list (loading states)
 * - decode: scramble-to-resolve
 *
 * Physics modifies behavior:
 * - Retro: uppercase scramble chars, jitter delay
 * - Flat: 0.8x speed
 * - Glass: smooth default
 */
import { useKinetic, type KineticMode } from "@/hooks/useKinetic";

interface KineticTextProps {
  /** The target text to reveal */
  text: string;
  /** Animation mode */
  mode?: KineticMode;
  /** Speed in ms per unit. Default 40 */
  speed?: number;
  /** For cycle mode: words to rotate through */
  words?: string[];
  /** Cycle interval in ms. Default 2000 */
  cycleInterval?: number;
  /** Auto-start. Default true */
  autoStart?: boolean;
  /** Callback when complete */
  onComplete?: () => void;
  /** Render as specific element. Default span */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  /** CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
  /** Show cursor during reveal */
  showCursor?: boolean;
}

export default function KineticText({
  text,
  mode = "char",
  speed = 40,
  words,
  cycleInterval,
  autoStart = true,
  onComplete,
  as: Tag = "span",
  className = "",
  style,
  showCursor = true,
}: KineticTextProps) {
  const { displayText, isComplete, isRunning } = useKinetic({
    mode,
    text,
    speed,
    words,
    cycleInterval,
    autoStart,
    onComplete,
  });

  return (
    <Tag className={className} style={style}>
      {displayText}
      {showCursor && isRunning && !isComplete && (
        <span className="inline-block w-[2px] h-[1em] ml-[1px] align-text-bottom animate-pulse" style={{ background: "var(--void-primary, #33E2E6)" }} />
      )}
    </Tag>
  );
}
