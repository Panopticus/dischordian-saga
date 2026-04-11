/* ═══════════════════════════════════════════════════════
   HAPTIC FEEDBACK — Mobile vibration patterns for game interactions
   Uses the Vibration API where supported, gracefully degrades.
   Respects user accessibility settings (reduce-motion, haptics toggle).
   ═══════════════════════════════════════════════════════ */

// ── Pattern Definitions ──────────────────────────────────────────────
// Each value is a vibration pattern array for Navigator.vibrate().
// Format: [vibrate, pause, vibrate, pause, ...] in milliseconds.

export const HapticPatterns = {
  // UI
  tap: [10],                          // Light tap for button press
  select: [15, 30, 15],               // Selection confirmation
  error: [50, 50, 50, 50, 50],        // Error buzz
  success: [10, 50, 20, 100, 30],     // Success fanfare

  // Combat
  lightHit: [20],                     // Light punch lands
  mediumHit: [40, 20, 40],            // Medium attack
  heavyHit: [80, 30, 60, 30, 80],     // Heavy slam
  specialMove: [30, 20, 30, 20, 100], // Special activation
  parry: [15, 10, 50],                // Successful parry
  ko: [100, 50, 100, 50, 200],        // Knockout

  // Rewards
  lootDrop: [20, 40, 20, 40, 60],     // Loot appears
  epicLoot: [30, 30, 30, 30, 30, 30, 100], // Epic+ rarity
  achievement: [20, 20, 40, 20, 20, 40, 80], // Achievement unlock
  levelUp: [50, 50, 50, 100, 200],    // Level up

  // Narrative
  dialogChoice: [15],                 // Dialog option selected
  moralityShift: [30, 100, 30],       // Alignment change
  storyReveal: [10, 30, 10, 30, 10, 60], // Plot twist
  companionTrust: [20, 60, 20],       // Trust milestone
} as const;

export type HapticPatternName = keyof typeof HapticPatterns;

// ── Support Detection ────────────────────────────────────────────────

/** Check if the Vibration API is available in the current environment. */
export function isHapticsSupported(): boolean {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

// ── Settings Integration ─────────────────────────────────────────────

/**
 * Determine whether haptics should fire based on user settings.
 * Checks:
 *   1. The browser `prefers-reduced-motion` media query
 *   2. The app-level `reduceMotion` setting from localStorage ("loredex-settings")
 *   3. An optional explicit `hapticsEnabled` flag in the same settings blob
 *
 * Returns false if any of these indicate haptics should be suppressed.
 */
function shouldFireHaptics(): boolean {
  // OS-level reduced motion preference
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return false;
  }

  // App-level settings stored in localStorage
  try {
    const raw = localStorage.getItem("loredex-settings");
    if (raw) {
      const settings = JSON.parse(raw) as Record<string, unknown>;
      // Explicit haptics toggle (if present)
      if (settings.hapticsEnabled === false) return false;
      // Reduce-motion toggle disables haptics too
      if (settings.reduceMotion === true) return false;
    }
  } catch {
    // localStorage unavailable or corrupt — allow haptics
  }

  return true;
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Trigger a named haptic pattern.
 * No-ops silently if haptics are unsupported or disabled by user settings.
 */
export function hapticFeedback(pattern: HapticPatternName): void {
  if (!isHapticsSupported() || !shouldFireHaptics()) return;
  try {
    navigator.vibrate(HapticPatterns[pattern]);
  } catch {
    // Vibration API can throw in some edge-case environments; swallow.
  }
}

/**
 * Fire a single vibration pulse of the given duration.
 * Useful for custom/dynamic feedback not covered by named patterns.
 */
export function hapticPulse(durationMs: number): void {
  if (!isHapticsSupported() || !shouldFireHaptics()) return;
  try {
    navigator.vibrate(Math.max(0, Math.round(durationMs)));
  } catch {
    // silent
  }
}

/**
 * Fire a custom vibration pattern (array of vibrate/pause durations).
 * For one-off patterns that don't warrant a named entry.
 */
export function hapticCustom(pattern: number[]): void {
  if (!isHapticsSupported() || !shouldFireHaptics()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // silent
  }
}

/** Cancel any active vibration immediately. */
export function hapticStop(): void {
  if (!isHapticsSupported()) return;
  try {
    navigator.vibrate(0);
  } catch {
    // silent
  }
}

// ── Legacy Convenience Aliases ───────────────────────────────────────
// Keep backward compatibility with earlier call-sites.

/** Light tap — button press, menu selection */
export function hapticLight() { hapticFeedback("tap"); }

/** Medium tap — card play, hit confirmation */
export function hapticMedium() { hapticFeedback("mediumHit"); }

/** Heavy impact — KO, critical hit, explosion */
export function hapticHeavy() { hapticFeedback("heavyHit"); }

/** Double tap pattern — combo hit, achievement unlock */
export function hapticDouble() { hapticFeedback("select"); }

/** Triple burst — special move, ultimate ability */
export function hapticTriple() { hapticFeedback("specialMove"); }

/** Error buzz — invalid action, insufficient funds */
export function hapticError() { hapticFeedback("error"); }

/** Success pattern — purchase complete, trade accepted */
export function hapticSuccess() { hapticFeedback("success"); }

/** Long rumble — round start, boss encounter */
export function hapticRumble() { hapticPulse(100); }

/** Custom pattern */
export function hapticPattern(pattern: number | number[]) {
  if (!isHapticsSupported() || !shouldFireHaptics()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // silent
  }
}
