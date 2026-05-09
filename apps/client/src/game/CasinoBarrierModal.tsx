/* ═══════════════════════════════════════════════════════
   CASINO BARRIER MODAL — harm-reduction surface

   audit/16 GA4 + GA2. Listens for "casino-barrier" CustomEvents
   dispatched from the global tRPC mutation-cache subscriber in
   main.tsx whenever a casino mutation throws a harm-reduction
   limit error (daily loss cap, Void Cases per-day cap).

   Renders a clearly-labelled, dismissable modal explaining
   *why* the action was blocked and *when* it will reset (UTC
   midnight). Recovering-gambler audit persona explicitly asked
   for the reason + reset window over a generic error.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Clock, X } from "lucide-react";

interface BarrierState {
  open: boolean;
  message: string;
}

function nextUtcMidnightLocal(): string {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
      0,
    ),
  );
  // Format in local timezone for the player.
  return tomorrow.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function CasinoBarrierModal() {
  const [state, setState] = useState<BarrierState>({ open: false, message: "" });

  useEffect(() => {
    const onBarrier = (e: Event) => {
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      setState({
        open: true,
        message: detail?.message ?? "The casino is closed for you for today.",
      });
    };
    window.addEventListener("casino-barrier", onBarrier);
    return () => window.removeEventListener("casino-barrier", onBarrier);
  }, []);

  const close = () => setState((s) => ({ ...s, open: false }));

  return (
    <AnimatePresence>
      {state.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          data-testid="casino-barrier-modal"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="max-w-md w-[92%] mx-4 rounded-xl border void-border bg-gradient-to-b from-amber-950/40 to-black/80 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="void-text-accent" />
                <h2 className="font-display text-base tracking-widest void-text-accent uppercase">
                  Casino Closed (For You, Today)
                </h2>
              </div>
              <button
                onClick={close}
                aria-label="Dismiss"
                className="void-text-muted hover:void-text-accent transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="font-mono text-sm text-foreground/90 leading-relaxed mb-4">
              {state.message}
            </p>
            <div className="flex items-center gap-2 text-xs void-text-muted mb-4">
              <Clock size={14} />
              <span>Resets at UTC midnight ({nextUtcMidnightLocal()} your time).</span>
            </div>
            <p className="font-mono text-[11px] text-foreground/60 italic mb-4">
              Free-to-play games (Void Bingo, Dischordian Mahjong) still work.
              Take a walk; the tables will still be here tomorrow.
            </p>
            <div className="flex justify-end">
              <button
                onClick={close}
                className="px-4 py-2 rounded-md border void-border void-text-accent hover:bg-amber-950/30 transition-colors text-sm font-mono uppercase tracking-wider"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
