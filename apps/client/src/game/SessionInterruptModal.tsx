/* ═══════════════════════════════════════════════════════
   SESSION INTERRUPT MODAL — casino harm reduction

   audit/16 GA5. Listens for "casino-session-interrupt"
   CustomEvents from useSessionTimer. Shows a single modal at
   2h / 4h / 6h play boundaries: "You've been at the tables for
   X hours. Take a break?" with two non-coercive options
   ("Keep playing" or "Logout"). NO sunk-cost prompts.
   Dismiss = logout means logout.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X } from "lucide-react";

interface InterruptState {
  open: boolean;
  hours: 2 | 4 | 6;
}

export function SessionInterruptModal() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<InterruptState>({ open: false, hours: 2 });

  useEffect(() => {
    const onInterrupt = (e: Event) => {
      const detail = (e as CustomEvent<{ hours: 2 | 4 | 6 }>).detail;
      if (!detail) return;
      setState({ open: true, hours: detail.hours });
    };
    window.addEventListener("casino-session-interrupt", onInterrupt);
    return () => window.removeEventListener("casino-session-interrupt", onInterrupt);
  }, []);

  const close = () => setState((s) => ({ ...s, open: false }));
  const logout = () => {
    setState((s) => ({ ...s, open: false }));
    navigate("/");
  };

  return (
    <AnimatePresence>
      {state.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          data-testid="casino-session-interrupt"
          data-hours={state.hours}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="max-w-md w-[92%] mx-4 rounded-xl border void-border bg-gradient-to-b from-emerald-950/30 to-black/80 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Coffee size={20} className="void-text-accent" />
                <h2 className="font-display text-base tracking-widest void-text-accent uppercase">
                  Take a Break?
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
            <p className="font-mono text-sm text-foreground/90 leading-relaxed mb-2">
              You&apos;ve been at the tables for{" "}
              <span className="font-bold void-text-accent">{state.hours} hours</span>.
            </p>
            <p className="font-mono text-xs text-foreground/70 leading-relaxed mb-5">
              The Degen will hold your seat. The pots will still climb. Your eyes deserve sky for a minute.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md border void-border text-sm font-mono uppercase tracking-wider hover:bg-amber-950/20 transition-colors"
              >
                Logout
              </button>
              <button
                onClick={close}
                className="px-4 py-2 rounded-md border void-border void-text-accent hover:bg-amber-950/30 transition-colors text-sm font-mono uppercase tracking-wider"
              >
                Keep playing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
