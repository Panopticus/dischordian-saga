/**
 * Card-play rejection toast.
 *
 * Brief rust-orange-outlined message rendered briefly when a player
 * attempts to play a card the runtime rejected. The §5.5 lockout is
 * the first consumer ("locked — next turn"); §5.8 phase violations
 * (when that work-stream lands) will reuse the same component for
 * consistent visual vocabulary (per §5.5 spec §7 forward-compat).
 *
 * The component fades itself out automatically after `durationMs` —
 * the caller provides a `key` (e.g., a click counter) so re-rejecting
 * remounts the toast and restarts the timer.
 */
import { useEffect, useState } from "react";

export interface PlayRejectionToastProps {
  message: string;
  durationMs?: number;
}

export function PlayRejectionToast({
  message,
  durationMs = 1400,
}: PlayRejectionToastProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(t);
  }, [durationMs]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={
        "absolute bottom-44 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 " +
        "rounded border-2 void-border void-bg-sunk void-text-premium " +
        "font-mono text-xs shadow-[0_0_8px_rgba(255,80,30,0.5)] " +
        "transition-opacity duration-300 " +
        (visible ? "opacity-100" : "opacity-0")
      }
    >
      {message}
    </div>
  );
}
