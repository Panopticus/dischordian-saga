/* ═══════════════════════════════════════════════════════
   TIME OF DAY — minimal 4-phase cycle.

   Used by the Berth System's activity catalog (Sentinel
   polishes armor at midday, sleeps at nightwatch) and by
   the comm screen's ambient diagnostic field.

   Intentionally small. The rest of the game runs on
   Celebration trial-day counters (apprenticeship's 28-day
   loop, Mechronis Academy's semester) and that pacing
   doesn't need a 24-hour clock. This module exists for
   atmospheric variation only — the phase is derived from
   the wall-clock so visiting the bunkroom at 03:00 actually
   shows nightwatch, not whatever the trial cycle thinks
   "evening" is.

   Pure functions. No state.
   ═══════════════════════════════════════════════════════ */

export type DayPhase = "dawn" | "midday" | "dusk" | "nightwatch";

const ALL_PHASES: readonly DayPhase[] = ["dawn", "midday", "dusk", "nightwatch"];

/**
 * Phase from a wall-clock hour (0..23).
 *   05–10  dawn
 *   10–17  midday
 *   17–22  dusk
 *   22–05  nightwatch
 */
export function phaseFromHour(hour: number): DayPhase {
  const h = ((hour % 24) + 24) % 24;
  if (h >= 5 && h < 10) return "dawn";
  if (h >= 10 && h < 17) return "midday";
  if (h >= 17 && h < 22) return "dusk";
  return "nightwatch";
}

/**
 * Phase right now. Reads system time. Caller can override the date
 * for tests / replays.
 */
export function currentPhase(now: Date = new Date()): DayPhase {
  return phaseFromHour(now.getHours());
}

/**
 * Display name for the phase, used by the comm-screen ambient field.
 */
export function phaseLabel(phase: DayPhase): string {
  switch (phase) {
    case "dawn": return "First Light";
    case "midday": return "Mid-shift";
    case "dusk": return "Last Light";
    case "nightwatch": return "Nightwatch";
  }
}

/**
 * Tint color the renderer applies to backdrop art per phase. Hex
 * triplet, no leading hash — caller composes.
 */
export function phaseTint(phase: DayPhase): string {
  switch (phase) {
    case "dawn": return "F4D2A8";       // warm pale gold
    case "midday": return "FFFFFF";     // neutral
    case "dusk": return "C58A5A";       // amber-bronze
    case "nightwatch": return "5E6B85"; // cold blue
  }
}

/**
 * Brightness multiplier the renderer applies, 0..1. Nightwatch is
 * dimmer; midday is full.
 */
export function phaseBrightness(phase: DayPhase): number {
  switch (phase) {
    case "dawn": return 0.85;
    case "midday": return 1.0;
    case "dusk": return 0.78;
    case "nightwatch": return 0.55;
  }
}

/** All phases, for tests + parity gates. */
export function allPhases(): readonly DayPhase[] {
  return ALL_PHASES;
}
