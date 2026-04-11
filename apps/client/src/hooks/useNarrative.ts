/**
 * useNarrative — Apply narrative effects to elements.
 *
 * Sets data-narrative attribute, handles one-shot cleanup via animationend.
 * Framework-agnostic: the actual visual effects live in void-narrative.css.
 *
 * Usage:
 *   const { trigger, clear } = useNarrative(ref);
 *   trigger("shake");    // one-shot
 *   trigger("breathe");  // continuous until clear()
 */
import { useCallback, useEffect, useRef } from "react";

const ONE_SHOT_EFFECTS = new Set([
  "shake", "quake", "jolt", "glitch", "surge", "warp",
]);

export function useNarrative(elementRef: React.RefObject<HTMLElement | null>) {
  const cleanupRef = useRef<(() => void) | null>(null);

  const clear = useCallback(() => {
    const el = elementRef.current;
    if (el) {
      el.removeAttribute("data-narrative");
    }
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, [elementRef]);

  const trigger = useCallback((effect: string) => {
    const el = elementRef.current;
    if (!el) return;

    // Clear any existing effect first
    clear();

    // Force reflow so re-triggering the same effect works
    void el.offsetHeight;

    el.setAttribute("data-narrative", effect);

    // One-shot effects self-clean on animationend
    if (ONE_SHOT_EFFECTS.has(effect)) {
      const handler = () => {
        el.removeAttribute("data-narrative");
        el.removeEventListener("animationend", handler);
      };
      el.addEventListener("animationend", handler);
      cleanupRef.current = () => el.removeEventListener("animationend", handler);
    }
  }, [elementRef, clear]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { clear(); };
  }, [clear]);

  return { trigger, clear };
}
