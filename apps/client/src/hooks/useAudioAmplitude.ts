/**
 * useAudioAmplitude — Read live audio band energy from the shared player.
 *
 * A single AnalyserNode lives in PlayerContext. Each animation frame it
 * writes {bass, mid, treble, overall} to this module's store AND to four
 * CSS custom properties on <html>:
 *
 *   --audio-bass     0..1   low band (≈ 20–250 Hz)
 *   --audio-mid      0..1   mid band (≈ 250 Hz – 4 kHz)
 *   --audio-treble   0..1   high band (≈ 4 kHz – 20 kHz)
 *   --audio-overall  0..1   time-domain RMS (rough loudness)
 *
 * Two consumption modes:
 *   1. **Pure CSS** — reference `var(--audio-bass)` directly in inline style
 *      or in a stylesheet. Zero React cost. Use for logo glow, vitals
 *      pulses, ambient backgrounds.
 *   2. **Programmatic** — call `useAudioAmplitude(cb?)`. The hook returns
 *      the latest state and optionally invokes a callback per frame (for
 *      canvas visualizers). Re-renders only when `overall` changes by more
 *      than 0.01 to avoid thrashing React.
 *
 * Safety rails:
 *   - Respects `prefers-reduced-motion` and `.reduce-motion` class (bus stays zero).
 *   - Respects the `audioReactive` setting (`html.audio-reactive-off` zeros the bus via CSS).
 *   - Gracefully no-ops if PlayerContext could not create the analyser
 *     (CORS, Safari MediaElementSource quirks, etc.).
 */
import { useEffect, useState } from "react";

export type AudioAmplitude = {
  bass: number;
  mid: number;
  treble: number;
  overall: number;
};

const ZERO: AudioAmplitude = { bass: 0, mid: 0, treble: 0, overall: 0 };

// Module-scoped state. PlayerContext's RAF loop calls publishAmplitude().
let current: AudioAmplitude = ZERO;
type Subscriber = (a: AudioAmplitude) => void;
const subscribers = new Set<Subscriber>();

/**
 * Called from PlayerContext's RAF driver. Not part of the public API.
 * Clamps values and fans out to subscribers.
 */
export function publishAmplitude(next: AudioAmplitude): void {
  current = {
    bass: clamp01(next.bass),
    mid: clamp01(next.mid),
    treble: clamp01(next.treble),
    overall: clamp01(next.overall),
  };
  for (const fn of subscribers) fn(current);
}

/** Read the most recent amplitude without subscribing. */
export function getAmplitude(): AudioAmplitude {
  return current;
}

/**
 * Subscribe to amplitude updates.
 *
 * @param callback  Optional per-frame callback (canvas visualizers).
 *                  Receives the fresh amplitude every published frame.
 * @returns The most recent amplitude. The component re-renders only when
 *          the `overall` band changes by more than the epsilon to keep
 *          cost bounded when many components listen.
 */
export function useAudioAmplitude(
  callback?: (amp: AudioAmplitude) => void,
): AudioAmplitude {
  const [snapshot, setSnapshot] = useState<AudioAmplitude>(current);

  useEffect(() => {
    const EPSILON = 0.01;
    let lastOverall = snapshot.overall;
    const sub: Subscriber = (a) => {
      callback?.(a);
      if (Math.abs(a.overall - lastOverall) >= EPSILON) {
        lastOverall = a.overall;
        setSnapshot(a);
      }
    };
    subscribers.add(sub);
    return () => {
      subscribers.delete(sub);
    };
  }, [callback]);

  return snapshot;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}
