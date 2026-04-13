import { useCallback, useMemo } from "react";
import {
  hapticFeedback,
  hapticPulse,
  isHapticsSupported,
  type HapticPatternName,
} from "@/lib/haptics";

/* ═══════════════════════════════════════════════════════
   useHaptics — React hook for haptic feedback
   Returns memoized helpers that respect user settings.
   Settings are checked at call-time (not mount-time) so
   toggling "reduce motion" takes effect immediately.
   ═══════════════════════════════════════════════════════ */

export interface UseHapticsReturn {
  /** Trigger a named haptic pattern (e.g. "lightHit", "achievement"). */
  trigger: (pattern: HapticPatternName) => void;
  /** Fire a single vibration pulse of the given duration in ms. */
  pulse: (durationMs: number) => void;
  /** Whether the Vibration API is available on this device. */
  isSupported: boolean;
}

/**
 * Hook providing haptic feedback functions that automatically
 * respect the user's accessibility / motion preferences.
 *
 * Settings are read from `localStorage("loredex-settings")` and
 * the OS-level `prefers-reduced-motion` media query at the moment
 * each haptic fires — no context provider required.
 *
 * @example
 * ```tsx
 * function AttackButton() {
 *   const { trigger } = useHaptics();
 *   return (
 *     <button onClick={() => { trigger("heavyHit"); attack(); }}>
 *       Heavy Attack
 *     </button>
 *   );
 * }
 * ```
 */
export function useHaptics(): UseHapticsReturn {
  const trigger = useCallback((pattern: HapticPatternName) => {
    hapticFeedback(pattern);
  }, []);

  const pulse = useCallback((durationMs: number) => {
    hapticPulse(durationMs);
  }, []);

  const isSupported = useMemo(() => isHapticsSupported(), []);

  return { trigger, pulse, isSupported };
}
