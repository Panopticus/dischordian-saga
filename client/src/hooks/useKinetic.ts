/**
 * useKinetic — Physics-aware kinetic typography engine.
 *
 * Port of void-energy-ui's KineticEngine to React.
 * Four modes, physics-dependent behavior:
 *
 * - char: Classic typewriter, character by character
 * - word: Chunked reveal simulating AI streaming
 * - cycle: Rotates through word lists (loading states)
 * - decode: Scramble-to-resolve (random chars converge to target)
 *
 * Physics integration:
 * - glass: default smooth behavior
 * - flat: 0.8x speed multiplier, fewer scramble passes
 * - retro: uppercase-only scramble charset, 30% jitter delay,
 *   forced 'type' cycle transition (no fades on CRTs)
 */
import { useState, useEffect, useRef, useCallback } from "react";

export type KineticMode = "char" | "word" | "cycle" | "decode";

interface KineticOptions {
  mode: KineticMode;
  text: string;
  /** Speed in ms per unit (char/word/scramble-pass). Default 40. */
  speed?: number;
  /** For cycle mode: array of strings to rotate through */
  words?: string[];
  /** Cycle interval in ms. Default 2000. */
  cycleInterval?: number;
  /** Auto-start on mount. Default true. */
  autoStart?: boolean;
  /** Callback when reveal completes */
  onComplete?: () => void;
}

const GLASS_SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
const RETRO_SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░><{}[]|/\\";

function getPhysics(): "glass" | "flat" | "retro" {
  if (typeof document === "undefined") return "flat";
  return (document.documentElement.dataset.physics as any) || "flat";
}

function getSpeedMultiplier(physics: string): number {
  switch (physics) {
    case "flat": return 0.8;
    case "retro": return 1.0;
    default: return 1.0; // glass
  }
}

function getJitter(physics: string): number {
  return physics === "retro" ? 0.3 : 0;
}

function scrambleChar(physics: string): string {
  const chars = physics === "retro" ? RETRO_SCRAMBLE_CHARS : GLASS_SCRAMBLE_CHARS;
  return chars[Math.floor(Math.random() * chars.length)];
}

export function useKinetic(options: KineticOptions) {
  const {
    mode,
    text,
    speed = 40,
    words = [],
    cycleInterval = 2000,
    autoStart = true,
    onComplete,
  } = options;

  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const frameRef = useRef<number>(0);
  const indexRef = useRef(0);
  const completeCalled = useRef(false);

  const physics = getPhysics();
  const speedMult = getSpeedMultiplier(physics);
  const jitter = getJitter(physics);

  const effectiveSpeed = Math.round(speed * speedMult);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    cancelAnimationFrame(frameRef.current);
  }, []);

  const start = useCallback(() => {
    stop();
    setIsComplete(false);
    completeCalled.current = false;
    indexRef.current = 0;
    setDisplayText("");
    setIsRunning(true);
  }, [stop]);

  // Char mode — typewriter
  useEffect(() => {
    if (!isRunning || mode !== "char") return;

    const tick = () => {
      indexRef.current++;
      if (indexRef.current > text.length) {
        setIsComplete(true);
        setIsRunning(false);
        if (!completeCalled.current) { completeCalled.current = true; onComplete?.(); }
        return;
      }
      setDisplayText(text.slice(0, indexRef.current));
      const delay = effectiveSpeed + (jitter ? Math.random() * effectiveSpeed * jitter : 0);
      timerRef.current = setTimeout(tick, delay);
    };
    timerRef.current = setTimeout(tick, effectiveSpeed);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isRunning, mode, text, effectiveSpeed, jitter, onComplete]);

  // Word mode — chunked reveal (simulates AI streaming)
  useEffect(() => {
    if (!isRunning || mode !== "word") return;

    const wordList = text.split(/(\s+)/); // preserve whitespace
    let wordIdx = 0;
    let charIdx = 0;
    let current = "";

    const tick = () => {
      if (wordIdx >= wordList.length) {
        setIsComplete(true);
        setIsRunning(false);
        if (!completeCalled.current) { completeCalled.current = true; onComplete?.(); }
        return;
      }

      const word = wordList[wordIdx];
      charIdx++;
      if (charIdx > word.length) {
        wordIdx++;
        charIdx = 0;
        current += word;
        // Inter-word pause
        timerRef.current = setTimeout(tick, effectiveSpeed * 3);
        return;
      }

      // Internal char burst (fast within word)
      setDisplayText(current + word.slice(0, charIdx));
      const delay = effectiveSpeed * 0.4 + (jitter ? Math.random() * effectiveSpeed * 0.3 : 0);
      timerRef.current = setTimeout(tick, delay);
    };
    timerRef.current = setTimeout(tick, effectiveSpeed);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isRunning, mode, text, effectiveSpeed, jitter, onComplete]);

  // Cycle mode — rotate through word list
  useEffect(() => {
    if (!isRunning || mode !== "cycle" || words.length === 0) return;

    let cycleIdx = 0;
    const showNext = () => {
      setDisplayText(words[cycleIdx % words.length]);
      cycleIdx++;
    };
    showNext();
    const interval = setInterval(showNext, cycleInterval);
    return () => clearInterval(interval);
  }, [isRunning, mode, words, cycleInterval]);

  // Decode mode — scramble converging to target
  useEffect(() => {
    if (!isRunning || mode !== "decode") return;

    const maxPasses = physics === "flat" ? 6 : 10;
    let pass = 0;
    const resolved = new Array(text.length).fill(false);

    const tick = () => {
      pass++;
      // Each pass resolves ~(1/maxPasses) of characters
      const resolveCount = Math.ceil(text.length / maxPasses);
      const unresolved = resolved.map((r, i) => r ? -1 : i).filter(i => i >= 0);
      for (let i = 0; i < resolveCount && unresolved.length > 0; i++) {
        const pick = Math.floor(Math.random() * unresolved.length);
        resolved[unresolved[pick]] = true;
        unresolved.splice(pick, 1);
      }

      // Build display: resolved chars show real text, unresolved show scramble
      const display = text.split("").map((ch, i) => {
        if (resolved[i] || ch === " ") return ch;
        return scrambleChar(physics);
      }).join("");
      setDisplayText(display);

      if (resolved.every(Boolean)) {
        setDisplayText(text);
        setIsComplete(true);
        setIsRunning(false);
        if (!completeCalled.current) { completeCalled.current = true; onComplete?.(); }
        return;
      }

      timerRef.current = setTimeout(tick, effectiveSpeed * 2);
    };
    // Start with all-scrambled
    setDisplayText(text.split("").map(ch => ch === " " ? " " : scrambleChar(physics)).join(""));
    timerRef.current = setTimeout(tick, effectiveSpeed * 2);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isRunning, mode, text, effectiveSpeed, physics, onComplete]);

  // Auto-start
  useEffect(() => {
    if (autoStart) start();
    return stop;
  }, [autoStart, start, stop]);

  return {
    displayText,
    isComplete,
    isRunning,
    start,
    stop,
  };
}
