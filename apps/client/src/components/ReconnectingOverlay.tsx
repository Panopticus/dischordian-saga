/* ═══════════════════════════════════════════════════════
   RECONNECTING OVERLAY — Task 4.1

   Drop-in full-screen overlay that shows while a match
   WebSocket is reconnecting during a network blip. It
   counts down against the server-side 30 s grace period
   so the player knows exactly how long they have before
   a forfeit is triggered on the server.

   Usage:
     const chess = useReconnectingWs({ url, onMessage });
     return (
       <>
         <ChessBoard ... />
         <ReconnectingOverlay
           visible={chess.reconnecting || chess.gaveUp}
           retryCount={chess.retryCount}
           gracePeriodExpiresAt={chess.gracePeriodExpiresAt}
           gaveUp={chess.gaveUp}
           onDismiss={() => navigate("/")}
         />
       </>
     );

   Ticks once per second while visible so the countdown
   updates in real time, but mounts no timer when hidden.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dissolve } from "@/lib/motionPrimitives";

export interface ReconnectingOverlayProps {
  /** Whether the overlay should be rendered. */
  visible: boolean;
  /** Current retry attempt number (from useReconnectingWs). */
  retryCount: number;
  /** Maximum retries before we give up entirely. */
  maxRetries?: number;
  /** Timestamp when the server-side grace period expires. Null when connected. */
  gracePeriodExpiresAt: number | null;
  /** True once max retries have been exhausted. */
  gaveUp: boolean;
  /** Optional handler when the player opts out (navigate away, forfeit). */
  onDismiss?: () => void;
  /** Optional context label ("Chess match", "Terminus raid", etc.). */
  context?: string;
}

function formatCountdown(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${seconds}s`;
}

export function ReconnectingOverlay({
  visible,
  retryCount,
  maxRetries = 8,
  gracePeriodExpiresAt,
  gaveUp,
  onDismiss,
  context = "match",
}: ReconnectingOverlayProps) {
  // Re-render every second so the countdown updates.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [visible]);

  const remainingMs = gracePeriodExpiresAt != null
    ? Math.max(0, gracePeriodExpiresAt - now)
    : 0;
  const expired = gracePeriodExpiresAt != null && now >= gracePeriodExpiresAt;

  return (
    <AnimatePresence>
      {visible && (
        // Task 7.2 — physics-aware dissolve. Glass shows the
        // gentle fade, retro pops in instantly so the player
        // sees the countdown immediately.
        <motion.div
          variants={dissolve()}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          role="dialog"
          aria-label="Reconnecting to server"
          aria-live="polite"
        >
          <div className="max-w-sm w-full text-center space-y-5">
            {/* Spinner */}
            {!gaveUp && !expired && (
              <div className="flex justify-center">
                <div
                  className="h-10 w-10 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "var(--energy-accent)", borderTopColor: "transparent" }}
                />
              </div>
            )}

            {/* Headline */}
            <div>
              {gaveUp || expired ? (
                <h2 className="font-display text-lg font-bold tracking-wider text-destructive">
                  CONNECTION LOST
                </h2>
              ) : (
                <h2 className="font-display text-lg font-bold tracking-wider void-text-accent">
                  RECONNECTING
                </h2>
              )}
              <p className="font-mono text-xs text-muted-foreground tracking-wider mt-1">
                {gaveUp || expired
                  ? "SERVER SEVERED // MATCH FORFEITED"
                  : `ATTEMPT ${retryCount}/${maxRetries}`}
              </p>
            </div>

            {/* Countdown */}
            {gracePeriodExpiresAt != null && !gaveUp && !expired && (
              <div className="void-surface p-4">
                <p
                  className="font-mono text-xs mb-2"
                  style={{ color: "color-mix(in oklch, var(--energy-accent) 80%, transparent)" }}
                >
                  Your {context} is preserved for
                </p>
                <p className="font-display text-3xl font-bold void-text-accent tabular-nums">
                  {formatCountdown(remainingMs)}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground mt-2">
                  before the server awards the win to your opponent
                </p>
              </div>
            )}

            {/* Give-up state */}
            {(gaveUp || expired) && (
              <div className="void-surface p-4">
                <p className="font-mono text-xs text-destructive/80">
                  We couldn't re-establish a connection in time.
                  Your {context} has been resolved on the server.
                </p>
              </div>
            )}

            {/* Dismiss button */}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-2 rounded-md bg-secondary border border-border/50 text-foreground text-sm font-mono hover:bg-secondary/80 transition-colors"
              >
                {gaveUp || expired ? "CLOSE" : "LEAVE MATCH"}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReconnectingOverlay;
