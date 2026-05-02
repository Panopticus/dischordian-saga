/**
 * M6 — quality-preset resolution hook.
 *
 * Reads the player's `qualityPreference` setting (auto | low | medium |
 * high) and returns the resolved 3-tier value the renderer should
 * actually use. The "auto" mode delegates to the existing binary
 * `detectQualityTier()` + `useIsMobile()` heuristic:
 *   - detector says "low"        → "low"
 *   - useIsMobile() is true       → "medium" (the recruitment-plan
 *                                    default for mobile)
 *   - everything else             → "high"
 *
 * Renderer consumers read the resolved tier and translate to whatever
 * cap they care about — Pixi resolution, Three.js DPR, shader chain
 * skip-list, particle density. Each consumer maps the 3 tiers to its
 * own knob; this hook is just the source of truth for which tier.
 *
 * Pure helper `resolveQualityTier(preference, isMobile, detected)` is
 * exported for unit tests so the resolution table is deterministic.
 */
import { useEffect, useMemo, useState } from "react";
import { useIsMobile } from "./useMobile";
import { detectQualityTier, type QualityTier } from "@/lib/qualityTier";
import { loadSettings } from "@/lib/settingsSync";

export type QualityPreference = "auto" | "low" | "medium" | "high";
export type ResolvedQualityTier = "low" | "medium" | "high";

/** Pure resolver — exported for tests. The decision table:
 *
 *   preference   isMobile   detected   →   resolved
 *   ──────────   ────────   ────────       ────────
 *   "low"         *          *              "low"
 *   "medium"      *          *              "medium"
 *   "high"        *          *              "high"
 *   "auto"        *          "low"          "low"
 *   "auto"        true       "high"         "medium"
 *   "auto"        false      "high"         "high"
 */
export function resolveQualityTier(
  preference: QualityPreference,
  isMobile: boolean,
  detected: QualityTier,
): ResolvedQualityTier {
  if (preference === "low") return "low";
  if (preference === "medium") return "medium";
  if (preference === "high") return "high";
  // preference === "auto"
  if (detected === "low") return "low";
  if (isMobile) return "medium";
  return "high";
}

/**
 * Subscribe to the player's quality preference + the auto-detect
 * inputs. Re-resolves whenever settings, viewport breakpoint, or the
 * settingsSync 'loredex-settings-changed' event fires.
 */
export function useResolvedQualityTier(): ResolvedQualityTier {
  const isMobile = useIsMobile();
  const detected = useMemo(() => detectQualityTier(), []);
  const [preference, setPreference] = useState<QualityPreference>(() => {
    const stored = loadSettings()?.qualityPreference;
    return (stored as QualityPreference | undefined) ?? "auto";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    function refresh(): void {
      const stored = loadSettings()?.qualityPreference;
      setPreference((stored as QualityPreference | undefined) ?? "auto");
    }
    // settingsSync dispatches this on every save; re-resolve when it
    // fires so a settings-page edit propagates without reload.
    window.addEventListener("loredex-settings-changed", refresh);
    return () =>
      window.removeEventListener("loredex-settings-changed", refresh);
  }, []);

  return resolveQualityTier(preference, isMobile, detected);
}

/**
 * Map the resolved tier to a Pixi-style resolution multiplier. Bounded
 * at the device pixel ratio so we never up-scale beyond the screen's
 * own pixels.
 */
export function pixiResolutionForTier(
  tier: ResolvedQualityTier,
  devicePixelRatio: number = typeof window !== "undefined"
    ? window.devicePixelRatio || 1
    : 1,
): number {
  if (tier === "low") return 1;
  if (tier === "medium") return Math.min(devicePixelRatio, 1.5);
  return Math.min(devicePixelRatio, 2);
}

/** Same map for Three.js setPixelRatio. */
export function threeDprForTier(
  tier: ResolvedQualityTier,
  devicePixelRatio: number = typeof window !== "undefined"
    ? window.devicePixelRatio || 1
    : 1,
): number {
  // Same formula today; kept as a separate export so renderers can
  // diverge later (e.g. when Three's WebGPU path lands and wants a
  // different cap than Pixi's WebGL path).
  return pixiResolutionForTier(tier, devicePixelRatio);
}
