/**
 * TRANSMISSION DISPLAY — Shared typed-out message component
 *
 * Used across the entire narrative system for:
 * - Elara's messages (cyan, clean signal)
 * - The Human's messages (red, corrupted signal with glitch artifacts)
 * - System messages (amber, clean signal)
 * - Kael's logs (amber, system-style)
 *
 * Features:
 * - Character-by-character typing with configurable speed
 * - Corruption mode: random strikethrough, character glitch, signal interference pauses
 * - VO audio support: plays audio file alongside typed text (Human lines)
 * - Speaker header with identification
 * - Click to skip to end
 * - Signal glow effects per speaker
 */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Skull, Terminal, Volume2, VolumeX } from "lucide-react";
import { getCharacterSprite } from "@/game/characterSprites";
import { SpriteCharacter } from "./SpriteCharacter";

/* ─── TYPES ─── */
export type TransmissionSpeaker = "elara" | "human" | "system" | "kael";

export interface TransmissionMessage {
  speaker: TransmissionSpeaker;
  text: string;
  /** Optional VO audio URL (primarily for Human lines) */
  voUrl?: string;
  /** Corruption level 0-100 (only for human speaker) */
  corruptionLevel?: number;
  /** Override typing speed (ms per character) */
  typingSpeed?: number;
  /** Optional callback when this message finishes typing */
  onComplete?: () => void;
}

export interface TransmissionDisplayProps {
  messages: TransmissionMessage[];
  /** Auto-advance to next message after current finishes (ms delay, 0 = wait for click) */
  autoAdvanceMs?: number;
  /** Called when all messages have been displayed */
  onAllComplete?: () => void;
  /** Show speaker headers */
  showHeaders?: boolean;
  /** Compact mode (smaller text, less padding) */
  compact?: boolean;
  /** Allow skipping individual messages by clicking */
  allowSkip?: boolean;
  /** External control: current message index */
  currentIndex?: number;
  /** External control: advance callback */
  onAdvance?: (nextIndex: number) => void;
}

/* ─── SPEAKER CONFIG ─── */
const SPEAKER_CONFIG: Record<TransmissionSpeaker, {
  label: string;
  color: string;
  textClass: string;
  glowClass: string;
  bgClass: string;
  borderClass: string;
  icon: typeof Radio;
  defaultSpeed: number;
}> = {
  elara: {
    label: "ELARA // SHIP AI",
    color: "var(--energy-primary)",
    textClass: "void-text-energy",
    glowClass: "shadow-[0_0_15px_color-mix(in oklch, var(--energy-primary) 30%, transparent)]",
    bgClass: "void-bg-success",
    borderClass: "void-border-success",
    icon: Radio,
    defaultSpeed: 18,
  },
  human: {
    label: "// SIGNAL INTERCEPT",
    color: "#f87171",
    textClass: "void-text-error",
    glowClass: "shadow-[0_0_15px_color-mix(in oklch, var(--energy-error) 30%, transparent)]",
    bgClass: "void-bg-error",
    borderClass: "void-border-error",
    icon: Skull,
    defaultSpeed: 25,
  },
  system: {
    label: "SYSTEM // ARK 47",
    color: "#fbbf24",
    textClass: "void-text-accent",
    glowClass: "shadow-[0_0_15px_color-mix(in oklch, var(--energy-premium) 30%, transparent)]",
    bgClass: "void-bg-sunk",
    borderClass: "void-border",
    icon: Terminal,
    defaultSpeed: 15,
  },
  kael: {
    label: "RECRUITER'S LOG // ARCHIVED",
    color: "#fbbf24",
    textClass: "void-text-accent",
    glowClass: "shadow-[0_0_15px_color-mix(in oklch, var(--energy-premium) 20%, transparent)]",
    bgClass: "void-bg-sunk",
    borderClass: "void-border",
    icon: Terminal,
    defaultSpeed: 15,
  },
};

/* ─── CORRUPTION ENGINE ─── */
const GLITCH_CHARS = "█▓▒░╔╗╚╝║═╬┼┤├┬┴";

function corruptText(text: string, level: number): string {
  if (level <= 0) return text;
  // Apply strikethrough to ~~ delimited sections (already in text)
  // Add random character glitches based on corruption level
  const glitchProbability = level / 500; // 0-0.2 chance per character
  return text.split("").map((char) => {
    if (char === "~") return char; // preserve markdown strikethrough markers
    if (Math.random() < glitchProbability && char !== " " && char !== "\n") {
      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    return char;
  }).join("");
}

function renderCorruptedText(text: string): React.ReactNode[] {
  // Parse ~~strikethrough~~ markers into actual strikethrough elements
  const parts: React.ReactNode[] = [];
  const regex = /~~(.*?)~~/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  // Also handle F̷i̶n̸a̵l̶l̵y̶ style unicode corruption (pass through as-is)
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <span key={key++} className="line-through opacity-70 decoration-red-500/60">
        {match[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }
  return parts;
}

/* ─── SINGLE MESSAGE COMPONENT ─── */
function TransmissionMessage({
  message,
  isActive,
  showHeader,
  compact,
  onComplete,
  onSkip,
}: {
  message: TransmissionMessage;
  isActive: boolean;
  showHeader: boolean;
  compact: boolean;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const config = SPEAKER_CONFIG[message.speaker];
  const [displayedLength, setDisplayedLength] = useState(0);
  const [done, setDone] = useState(!isActive);
  const [voPlaying, setVoPlaying] = useState(false);
  const [voMuted, setVoMuted] = useState(false);
  // Stored in state (not a ref) so SpriteCharacter re-renders when the
  // audio element swaps and the lipsync analyser can connect to the
  // new MediaElementSource.
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speed = message.typingSpeed ?? config.defaultSpeed;
  const isHuman = message.speaker === "human";
  const corruption = isHuman ? (message.corruptionLevel ?? 40) : 0;
  const humanSprite = useMemo(() => (isHuman ? getCharacterSprite("the_human") : null), [isHuman]);

  // Clean text (without ~~markers~~) for length calculation
  const cleanText = message.text.replace(/~~/g, "");
  const fullText = message.text;

  // Start VO audio when message becomes active
  useEffect(() => {
    if (isActive && message.voUrl && !voMuted) {
      const a = new Audio();
      a.crossOrigin = "anonymous";
      a.src = message.voUrl;
      a.volume = 0.8;
      setAudio(a);
      a.play().then(() => setVoPlaying(true)).catch(() => {/* autoplay blocked */});
      a.onended = () => setVoPlaying(false);
      return () => {
        a.pause();
        a.currentTime = 0;
        setVoPlaying(false);
        setAudio(null);
      };
    }
  }, [isActive, message.voUrl, voMuted]);

  // Typing animation
  useEffect(() => {
    if (!isActive) {
      setDisplayedLength(cleanText.length);
      setDone(true);
      return;
    }
    setDisplayedLength(0);
    setDone(false);

    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx++;
      // Human signal interference: occasional pauses
      if (isHuman && corruption > 20 && Math.random() < 0.03) {
        // Skip this tick (simulates signal pause)
        return;
      }
      if (idx >= cleanText.length) {
        setDisplayedLength(cleanText.length);
        setDone(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        onComplete();
      } else {
        setDisplayedLength(idx);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, cleanText, speed, isHuman, corruption]);

  const skipToEnd = useCallback(() => {
    if (!done) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayedLength(cleanText.length);
      setDone(true);
      onComplete();
    } else {
      onSkip();
    }
  }, [done, cleanText, onComplete, onSkip]);

  const toggleVoMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setVoMuted((m) => {
      if (audio) {
        if (!m) {
          audio.pause();
          setVoPlaying(false);
        } else {
          audio.play().catch(() => {});
          setVoPlaying(true);
        }
      }
      return !m;
    });
  }, [audio]);

  // Build the displayed text by mapping displayedLength back to the original text with markers
  const getDisplayedText = (): string => {
    let cleanIdx = 0;
    let result = "";
    let inStrike = false;
    let i = 0;
    while (i < fullText.length && cleanIdx < displayedLength) {
      if (fullText[i] === "~" && fullText[i + 1] === "~") {
        result += "~~";
        inStrike = !inStrike;
        i += 2;
        continue;
      }
      result += fullText[i];
      cleanIdx++;
      i++;
    }
    // Close any open strikethrough
    if (inStrike) result += "~~";
    return result;
  };

  const displayText = done ? fullText : getDisplayedText();
  const corruptedDisplay = isHuman ? corruptText(displayText, corruption) : displayText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        ${compact ? "p-2.5" : "p-4"} rounded-lg border cursor-pointer
        ${config.bgClass} ${config.borderClass}
        ${isActive ? config.glowClass : ""}
        transition-shadow duration-500
      `}
      onClick={skipToEnd}
    >
      {/* Sprite-driven Human avatar with viseme lipsync — only shown when
          the bundle is registered for "the_human" and we're on the
          Human's transmission. Sized to slot above the typed text. */}
      {isHuman && humanSprite && (
        <div className="flex items-start gap-3 mb-2">
          <div className="w-20 h-28 rounded overflow-hidden shrink-0 border border-red-500/20 bg-black/30">
            <SpriteCharacter npcId="the_human" audio={audio} isSpeaking={voPlaying || (isActive && !done)} />
          </div>
          <div className="flex-1" />
        </div>
      )}

      {/* Speaker Header */}
      {showHeader && (
        <div className={`flex items-center justify-between mb-2 ${compact ? "mb-1.5" : "mb-2.5"}`}>
          <div className="flex items-center gap-2">
            <config.icon size={compact ? 12 : 14} className={config.textClass} />
            <span className={`font-mono text-[10px] tracking-[0.2em] ${config.textClass} opacity-70`}>
              {config.label}
            </span>
            {isActive && !done && (
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${config.textClass.replace("text-", "bg-")} animate-pulse`} />
                <span className="font-mono text-[9px] text-muted-foreground">RECEIVING</span>
              </span>
            )}
          </div>
          {/* VO controls */}
          {message.voUrl && (
            <button
              onClick={toggleVoMute}
              className={`p-1 rounded ${config.textClass} opacity-60 hover:opacity-100 transition-opacity`}
            >
              {voMuted ? <VolumeX size={12} /> : <Volume2 size={12} className={voPlaying ? "animate-pulse" : ""} />}
            </button>
          )}
        </div>
      )}

      {/* Message Text */}
      <div className={`
        font-mono leading-relaxed
        ${compact ? "text-xs" : "text-sm"}
        ${isHuman ? "void-text-error" : config.textClass.replace("text-", "text-").replace("-400", "-300")}
      `}>
        {isHuman ? (
          <>
            {renderCorruptedText(corruptedDisplay)}
            {/* Scan line effect for human messages */}
            {isActive && !done && (
              <span className="inline-block w-2 h-4 void-bg-error animate-pulse ml-0.5" />
            )}
          </>
        ) : (
          <>
            {corruptedDisplay}
            {isActive && !done && (
              <span className={`inline-block w-2 h-4 ${config.textClass.replace("text-", "bg-")}/60 animate-pulse ml-0.5`} />
            )}
          </>
        )}
      </div>

      {/* Signal interference overlay for human messages */}
      {isHuman && isActive && !done && corruption > 30 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--energy-error) 10%, transparent) 2px, color-mix(in oklch, var(--energy-error) 10%, transparent) 4px)",
              animation: "scan 3s linear infinite",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function TransmissionDisplay({
  messages,
  autoAdvanceMs = 0,
  onAllComplete,
  showHeaders = true,
  compact = false,
  allowSkip = true,
}: TransmissionDisplayProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedMessages, setCompletedMessages] = useState<Set<number>>(new Set());
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMessageComplete = useCallback((idx: number) => {
    setCompletedMessages((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });

    // Auto-advance if configured
    if (autoAdvanceMs > 0 && idx < messages.length - 1) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        setCurrentIdx(idx + 1);
      }, autoAdvanceMs);
    }

    // All messages complete
    if (idx === messages.length - 1) {
      // Call the message's own onComplete
      messages[idx]?.onComplete?.();
      onAllComplete?.();
    } else {
      messages[idx]?.onComplete?.();
    }
  }, [messages, autoAdvanceMs, onAllComplete]);

  const handleSkip = useCallback((idx: number) => {
    if (allowSkip && idx < messages.length - 1 && completedMessages.has(idx)) {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      setCurrentIdx(idx + 1);
    }
  }, [allowSkip, messages.length, completedMessages]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  // Reset when messages change
  useEffect(() => {
    setCurrentIdx(0);
    setCompletedMessages(new Set());
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className={`space-y-${compact ? "2" : "3"} relative`}>
      <AnimatePresence mode="sync">
        {messages.slice(0, currentIdx + 1).map((msg, idx) => (
          <TransmissionMessage
            key={`${msg.speaker}-${idx}`}
            message={msg}
            isActive={idx === currentIdx}
            showHeader={showHeaders}
            compact={compact}
            onComplete={() => handleMessageComplete(idx)}
            onSkip={() => handleSkip(idx)}
          />
        ))}
      </AnimatePresence>

      {/* Progress indicator */}
      {messages.length > 1 && (
        <div className="flex justify-center gap-1 pt-1">
          {messages.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx <= currentIdx
                  ? completedMessages.has(idx)
                    ? "bg-primary/60"
                    : "bg-primary animate-pulse"
                  : "bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SINGLE TRANSMISSION SHORTHAND ─── */
export function SingleTransmission({
  speaker,
  text,
  voUrl,
  corruptionLevel,
  typingSpeed,
  showHeader = true,
  compact = false,
  onComplete,
}: {
  speaker: TransmissionSpeaker;
  text: string;
  voUrl?: string;
  corruptionLevel?: number;
  typingSpeed?: number;
  showHeader?: boolean;
  compact?: boolean;
  onComplete?: () => void;
}) {
  const messages = useMemo(() => [{
    speaker,
    text,
    voUrl,
    corruptionLevel,
    typingSpeed,
    onComplete,
  }], [speaker, text, voUrl, corruptionLevel, typingSpeed, onComplete]);

  return (
    <TransmissionDisplay
      messages={messages}
      showHeaders={showHeader}
      compact={compact}
      onAllComplete={onComplete}
    />
  );
}
