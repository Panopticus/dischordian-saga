// Root-mounted holographic companion panel. Consumes the scheduler and
// routes portrait + VO by line.speaker. One host covers both Elara and
// the Human; the existing ElaraDialog / CompanionAskPanel surfaces
// remain available for specific flows that need full-modal treatment.
//
// F13 requires this to mount once at AppShell root. The panel is a
// fixed-position hologram in the bottom-right corner, intentionally
// unobtrusive — Bioware-style contextual companion, not a modal.

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompanionScheduler } from "./useCompanionScheduler";

interface Props {
  /** Optional override for portrait size; defaults to "sm". */
  portraitSize?: "sm" | "md";
}

export default function CompanionHost({ portraitSize = "sm" }: Props) {
  const { active, dismiss } = useCompanionScheduler();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss for lines that declare it
  useEffect(() => {
    if (!active) return;
    if (active.dismissible !== "auto") return;
    const ms = active.durationMs ?? 5000;
    autoTimer.current = setTimeout(() => dismiss(), ms);
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [active, dismiss]);

  // VO playback — companionScheduler doesn't own audio; the host does.
  // This avoids coupling the pure scheduler module to the DOM.
  useEffect(() => {
    if (!active?.voId) return;

    // Best-effort VO URL resolution: try the shared Elara manifest, then
    // the Human manifest. Both are imported lazily so the host can ship
    // before the VO pass does — missing voIds are non-fatal.
    const speaker = active.speaker;
    const manifestPromise =
      speaker === "human"
        ? import("@shared/humanVoManifest.json")
        : import("@shared/elaraVoManifest.json");

    let cancelled = false;
    manifestPromise
      .then(mod => {
        if (cancelled) return;
        const manifest = (mod as { default?: Record<string, string> }).default ?? (mod as unknown as Record<string, string>);
        const url = manifest[active.voId!];
        if (!url) return;
        const audio = new Audio(url);
        audio.volume = 0.85;
        audioRef.current = audio;
        audio.play().catch(() => {
          // Autoplay blocked; wait for user gesture.
          const retry = () => {
            audio.play().catch(() => {});
            document.removeEventListener("click", retry);
            document.removeEventListener("touchstart", retry);
          };
          document.addEventListener("click", retry, { once: true });
          document.addEventListener("touchstart", retry, { once: true });
        });
      })
      .catch(() => {
        // Missing manifest is fine — text-only fallback.
      });

    return () => {
      cancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={active.lineId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-80 pointer-events-auto"
          role="dialog"
          aria-live="polite"
        >
          <div
            className="rounded-lg p-3 sm:p-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
              border: `1px solid color-mix(in oklch, ${active.speaker === "human" ? "var(--energy-premium)" : "var(--energy-primary)"} 25%, transparent)`,
              boxShadow: `0 0 20px color-mix(in oklch, ${active.speaker === "human" ? "var(--energy-premium)" : "var(--energy-primary)"} 12%, transparent)`,
            }}
          >
            <div className="flex items-start gap-2">
              <div
                className={`shrink-0 rounded-full mt-0.5 ${portraitSize === "sm" ? "w-6 h-6" : "w-8 h-8"}`}
                style={{
                  background:
                    active.speaker === "human"
                      ? "radial-gradient(circle, color-mix(in oklch, var(--energy-premium) 70%, transparent), transparent)"
                      : "radial-gradient(circle, color-mix(in oklch, var(--energy-primary) 70%, transparent), transparent)",
                }}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-60 mb-1">
                  {active.speaker === "human" ? "The Human" : "Elara"}
                </p>
                <p className="font-mono text-xs sm:text-sm leading-relaxed text-foreground break-words">
                  {active.text}
                </p>
                {active.dismissible !== "manual" && (
                  <button
                    onClick={dismiss}
                    className="mt-2 text-[11px] font-mono tracking-wider opacity-60 hover:opacity-100 transition-opacity"
                  >
                    [tap to dismiss]
                  </button>
                )}
                {active.dismissible === "manual" && (
                  <button
                    onClick={dismiss}
                    className="mt-2 text-[11px] font-mono tracking-wider px-2 py-1 rounded border border-white/20 opacity-80 hover:opacity-100 hover:border-white/40 transition-all"
                  >
                    CONTINUE
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
