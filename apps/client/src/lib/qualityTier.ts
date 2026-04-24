/* ═══════════════════════════════════════════════════════
   QUALITY TIER — Runtime perf-capability detection

   Every ambient/cinematic FX the app ships honors the user's
   motion-intensity + audio-reactive toggles, but those are
   opt-in knobs. On genuinely low-power devices we want to
   DEFAULT expensive FX off so a first-time player on a
   5-year-old phone doesn't hit dropped frames before they
   ever see the settings panel.

   Detection is conservative: we only mark a session `low`
   when at least one strong signal fires. False positives on
   "high" are acceptable (the motion-intensity slider is the
   user's escape hatch); false positives on "low" would
   degrade the experience for players whose devices are
   actually fine.

   Writes `.quality-low` to <html> plus a
   `--quality-tier-multiplier` CSS var (1 high, 0.5 low) so
   CSS-only consumers can scale keyframe amplitudes without
   reading the class directly.

   Components that gate on this:
     - ShaderOverlay / CinematicComposer (full WebGL chain)
     - AmbientSkybox nebula glow (radial gradient reflow)
     - AudioSpectrum (RAF FFT read)
     - RoomAmbientLife (many particle spans)
     - LivingPortrait (perspective tilt + particles)

   Honored via `html.quality-low .<component-class>` CSS rules
   or inline `getComputedStyle(...).getPropertyValue(...)`
   reads for the multiplier.
   ═══════════════════════════════════════════════════════ */

export type QualityTier = "high" | "low";

/**
 * Hard-heuristic detection from navigator hints. Returns "low" only
 * when a strong signal fires — keeps false-positive rate down so
 * players on perfectly capable devices don't get the diminished
 * experience.
 */
export function detectQualityTier(): QualityTier {
  if (typeof navigator === "undefined") return "high";

  // 1. CPU cores — 4+ is typical for any modern phone/tablet/laptop.
  //    Sub-4 (or undefined on older browsers) is a strong "this is
  //    weak hardware" signal.
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores > 0 && cores < 4) return "low";

  // 2. Device memory (Chrome-only). Returns GB in 0.25/0.5/1/2/4/8
  //    buckets. Less than 4 is the threshold below which the
  //    WebGL composer's extra render targets cost real frames.
  const memory = (navigator as { deviceMemory?: number }).deviceMemory;
  if (typeof memory === "number" && memory > 0 && memory < 4) return "low";

  // 3. Explicit user preference — Data Saver / Save Data. Players
  //    who've asked for reduced bandwidth also reasonably want
  //    reduced visual complexity.
  const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return "low";

  // 4. Slow network — 2G / slow-2G signals a device that's likely
  //    also CPU-limited.
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") {
    return "low";
  }

  return "high";
}

/**
 * Apply the detected tier to <html>. Called once at app bootstrap.
 * Idempotent — safe to invoke multiple times.
 */
export function applyQualityTierToDOM(tier: QualityTier): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("quality-low", tier === "low");
  root.classList.toggle("quality-high", tier === "high");
  // CSS-only consumers read this custom property to scale amplitudes
  // without branching on the class name directly.
  root.style.setProperty("--quality-tier-multiplier", tier === "low" ? "0.5" : "1");
}

/**
 * Read the current tier from the DOM. Useful for JS consumers that
 * need to branch (e.g. don't mount the composer at all on low tier).
 * Defaults to "high" when the detection hasn't run yet.
 */
export function getQualityTier(): QualityTier {
  if (typeof document === "undefined") return "high";
  return document.documentElement.classList.contains("quality-low") ? "low" : "high";
}
