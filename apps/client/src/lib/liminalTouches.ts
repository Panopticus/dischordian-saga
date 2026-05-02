/**
 * Liminal touches — narrative-dressing surfaces for the Dischordian
 * Saga. Each item is a small ARG-flavoured detail that the player
 * isn't required to notice, but that rewards attention from the kind
 * of player the recruitment plan §"Cicada / wanon community fame"
 * is designed to hook.
 *
 * Five items shipped here:
 *   1. `useIdleTitleCycle()`      — `document.title` cycles on tab idle
 *   2. `logBootBanner()`           — morality-conditional console banner
 *   3. (route)                     — `/architect` 23-second-delayed transcript
 *   4. (route)                     — `/dreamer` 404-with-vision-fragment
 *   5. (component)                 — `TitleBootSequence` calibration logs
 *
 * These helpers stay pure and side-effect-free where possible so they
 * can be unit-tested without DOM. The DOM-touching hooks scope their
 * effects to a single useEffect, restoring previous state on unmount.
 */
import { useEffect } from "react";

/* ─── 1. useIdleTitleCycle — hidden-tab title cycle ─────────────── */

/**
 * Cycle through these phrases when the tab is hidden. Restores to the
 * default title (`Loredex OS - The Dischordian Saga`) the moment the
 * tab regains visibility. The cycle is intentionally low-frequency
 * (every 4 seconds) so a user who tabs back quickly never sees it,
 * but a user who leaves the tab open in the background sees the title
 * read like a degraded signal.
 */
const IDLE_TITLE_PHRASES: readonly string[] = [
  "Loredex OS — receiving",
  "Loredex OS — receiving …",
  "Loredex OS — signal lost",
  "Loredex OS — recovering",
  "Loredex OS — fnord",
  "Loredex OS — listening",
];

const IDLE_TITLE_INTERVAL_MS = 4_000;

/**
 * Mount once near the app root. While the tab is hidden, advances
 * `document.title` through `IDLE_TITLE_PHRASES`. When the tab
 * regains visibility, the title is restored to whatever value
 * `usePageMeta()` last set it to (we cache that on mount).
 *
 * The hook accepts the default title as a parameter rather than
 * importing it, so the test can pass a stub and the call site can
 * stay free of cross-module fixture dependencies.
 */
export function useIdleTitleCycle(defaultTitle: string): void {
  useEffect(() => {
    let cycleIndex = 0;
    let cycleTimer: ReturnType<typeof setInterval> | null = null;
    // Cache whatever title was set when the cycle starts so we can
    // restore exactly that on visibility-gain (covers the case where
    // a `usePageMeta()`-driven page-specific title was active when
    // the user tabbed away).
    let titleAtCycleStart: string | null = null;

    function startCycle(): void {
      if (cycleTimer !== null) return;
      titleAtCycleStart = document.title;
      cycleTimer = setInterval(() => {
        cycleIndex = (cycleIndex + 1) % IDLE_TITLE_PHRASES.length;
        document.title = IDLE_TITLE_PHRASES[cycleIndex];
      }, IDLE_TITLE_INTERVAL_MS);
    }

    function stopCycle(): void {
      if (cycleTimer === null) return;
      clearInterval(cycleTimer);
      cycleTimer = null;
      // Restore. If the cached title is null (cycle never started)
      // fall back to the default.
      document.title = titleAtCycleStart ?? defaultTitle;
      titleAtCycleStart = null;
      cycleIndex = 0;
    }

    function onVisibilityChange(): void {
      if (document.hidden) startCycle();
      else stopCycle();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    // If the tab is already hidden when the hook mounts (e.g. the
    // user opened the page in a background tab), start cycling
    // immediately.
    if (document.hidden) startCycle();

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopCycle();
    };
  }, [defaultTitle]);
}

// Exposed for tests.
export const _IDLE_TITLE_PHRASES_FOR_TEST = IDLE_TITLE_PHRASES;
export const _IDLE_TITLE_INTERVAL_MS_FOR_TEST = IDLE_TITLE_INTERVAL_MS;

/* ─── 2. logBootBanner — morality-conditional console message ─── */

/**
 * Three boot-banner registers, picked by morality alignment. The
 * Architect grain (negative score) gets the calibration-register
 * banner; the Dreamer grain (positive score) gets the cryptic-vision
 * banner; neutrals get the inert "loaded" banner.
 *
 * Pure helper for testability — pass a score, get back the banner
 * string. The actual `console.log` call site is in `App.tsx` and
 * runs once on mount.
 */
export function bootBannerForMorality(score: number): string {
  if (score <= -25) {
    return [
      "─── LOREDEX OS · CALIBRATION LAYER ───",
      "Candidate file open. Decisions logged.",
      "The Architect attends.",
    ].join("\n");
  }
  if (score >= 25) {
    return [
      "─── loredex os · listening ───",
      "the gate was not where you thought.",
      "count your hands when you wake.",
    ].join("\n");
  }
  return [
    "─── Loredex OS · ready ───",
    "Boot OK. Welcome, witness.",
  ].join("\n");
}

/**
 * One-shot console banner. Uses `console.warn` (not `info`) so the
 * void-energy ratchet's no-console rule allows it without an escape
 * hatch — `warn` and `error` are the two methods kept reserved for
 * intentional DX surfaces. Idempotent within a session via a
 * window-flag guard so React 18 strict-mode double-mount doesn't
 * print twice.
 */
export function logBootBanner(score: number): void {
  if (typeof window === "undefined") return;
  const FLAG = "__loredexBootBannerLogged";
  // window typing — opaque guard via index access keeps this
  // self-contained without polluting global types.
  const w = window as unknown as Record<string, unknown>;
  if (w[FLAG] === true) return;
  w[FLAG] = true;
  // eslint-disable-next-line no-console
  console.warn(bootBannerForMorality(score));
}

// Exposed for tests — clears the flag so a test can re-fire.
export function _resetBootBannerForTest(): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as Record<string, unknown>;
  delete w["__loredexBootBannerLogged"];
}

/* ─── 5. Title-screen calibration logs (deterministic per-day) ─── */

/**
 * Boot-sequence calibration log lines for the title screen. The line
 * pool is fixed; the *order* shown for any given (day, morality)
 * tuple is deterministic, so two players who compare logs on the
 * same day see the same logs but two days apart see different orders.
 * Wanons can catalogue these.
 *
 * Returns 4 lines from the pool, picked by a tiny deterministic hash
 * of (epochDay × 31 + alignmentBucket). No randomness — that's the
 * point. Same inputs always produce the same output.
 */
const CALIBRATION_LOG_POOL: readonly string[] = [
  "Loredex OS booting…",
  "Sub-channel 0x17 — listening.",
  "Substrate latency: 23 ms.",
  "Witness handshake: ok.",
  "Cross-game beat alignment: 1351.",
  "Memoir cache: warm.",
  "Discordian timing: nominal.",
  "Gate state: ajar.",
  "Companion bonds: holding.",
  "Calibration drift: −0.000.",
  "Eyes-of-reality reveal-stage: locked.",
  "Voice signatures: 920.",
  "Antiquarian goggles: cyan.",
  "Public-witness balance: 0.",
  "Fnord index: nominal.",
];

/** Pure helper — picks the 4-line calibration set for the given
 *  epoch-day + alignment-bucket. Exported for tests. */
export function calibrationLogsFor(
  epochDay: number,
  alignmentBucket: -1 | 0 | 1,
): readonly string[] {
  const seed = (epochDay * 31 + (alignmentBucket + 1) * 17) | 0;
  // Linear-congruential pick — small + deterministic + good enough
  // for a 4-of-15 sample per day.
  const indices: number[] = [];
  let state = seed >>> 0;
  while (indices.length < 4) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const idx = state % CALIBRATION_LOG_POOL.length;
    if (!indices.includes(idx)) indices.push(idx);
  }
  return indices.map((i) => CALIBRATION_LOG_POOL[i]);
}

/** Today's epoch-day in UTC. Pure — extracted so tests can pass a
 *  fixed timestamp without mocking Date. */
export function epochDayUtc(now: number = Date.now()): number {
  return Math.floor(now / 86_400_000);
}

/** Bucket a morality score into {-1 machine | 0 neutral | +1 humanity}. */
export function alignmentBucketFor(score: number): -1 | 0 | 1 {
  if (score <= -25) return -1;
  if (score >= 25) return 1;
  return 0;
}

export const _CALIBRATION_LOG_POOL_FOR_TEST = CALIBRATION_LOG_POOL;
