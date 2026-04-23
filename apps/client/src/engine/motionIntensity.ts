/**
 * motionIntensity — Single source of truth for the ambient-motion multiplier.
 *
 * `--motion-intensity` (0..1) lives on <html> and is written by settingsSync
 * (the user's slider). This module exposes three cheap readers so RAF loops
 * and motion variants don't have to run getComputedStyle each frame.
 *
 * The value also collapses to 0 when `.reduce-motion` is on or the OS
 * `prefers-reduced-motion` media query is set.
 *
 * Usage:
 *   import { getMotionIntensity } from "@/engine/motionIntensity";
 *   const offset = mouseX * MAX_OFFSET * getMotionIntensity();
 */

let cached: number | null = null;
let reducedMotionQuery: MediaQueryList | null = null;

function refresh(): number {
  if (typeof document === "undefined") return 1;
  const root = document.documentElement;

  // Hard zero: accessibility overrides win.
  if (root.classList.contains("reduce-motion")) return 0;
  if (
    reducedMotionQuery?.matches ??
    (typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
  ) {
    return 0;
  }

  // Inline custom property; cheap to read. getComputedStyle would be
  // correct even without inline but ~10x more expensive per read.
  const raw = root.style.getPropertyValue("--motion-intensity").trim();
  const parsed = raw === "" ? 1 : parseFloat(raw);
  if (!Number.isFinite(parsed)) return 1;
  if (parsed < 0) return 0;
  if (parsed > 1) return 1;
  return parsed;
}

function ensureInvalidation(): void {
  if (typeof document === "undefined") return;
  if (reducedMotionQuery) return;

  reducedMotionQuery =
    typeof window !== "undefined"
      ? window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? null
      : null;
  reducedMotionQuery?.addEventListener?.("change", () => {
    cached = null;
  });

  // Watch for the reduce-motion class flipping.
  const observer = new MutationObserver(() => {
    cached = null;
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style"],
  });
}

/** Read the current motion-intensity multiplier (0..1). Cached; invalidates on class/style/media change. */
export function getMotionIntensity(): number {
  ensureInvalidation();
  if (cached === null) cached = refresh();
  return cached;
}

/** Force a re-read on next call. Exposed for tests and settings-save paths. */
export function invalidateMotionIntensity(): void {
  cached = null;
}
