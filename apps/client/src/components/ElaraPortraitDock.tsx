/* ═══════════════════════════════════════════════════════
   ELARA PORTRAIT DOCK

   Persistent bottom-right widget that lets the player
   click Elara and open a conversation. Only mounts once
   the player has actually met her in Awakening — the
   gate is `narrativeFlags.met_elara`, set by AwakeningPage
   when ELARA_INTRO completes.

   Mounts globally from App.tsx so the dock is visible
   across every page after the introduction (Ark, room,
   governance hub, etc.).

   Click → StageDialogOverlay. The first such click
   surfaces the must-end-with-the-quest-reveal first-talk
   flow (see StageDialogOverlay's NODES); subsequent
   clicks open the same overlay but skip directly into
   the topic list with the reveal node closed off.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HolographicElara from "@/components/HolographicElara";
import StageDialogOverlay from "@/components/StageDialogOverlay";
import { useGame } from "@/contexts/GameContext";

export default function ElaraPortraitDock() {
  const { state } = useGame();
  const [open, setOpen] = useState(false);

  // Gate: only render after Elara has actually appeared
  // in the fiction. `met_elara` is set by AwakeningPage
  // at the end of ELARA_INTRO. Without this, the dock
  // would pop in on the title page.
  const met = !!state.narrativeFlags["met_elara"];
  if (!met) return null;

  // The "unread pulse" stays on until Elara has delivered
  // the degradation reveal (her first conversational
  // milestone). After that, the dock is a quiet affordance
  // — no pulse, no urgency — even though the conversation
  // can still be re-opened. The narrative flag is the
  // durable source of truth here.
  const firstTalkCompleted = !!state.narrativeFlags["elara_degradation_revealed"];

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        onClick={() => setOpen(true)}
        aria-label="Talk to Elara"
        title={
          firstTalkCompleted
            ? "Talk to Elara"
            : "Elara wants to talk to you."
        }
        className="fixed bottom-4 right-4 z-[5000] flex flex-col items-center gap-1 group focus:outline-none"
      >
        <div className="relative">
          {/* Unread pulse — only until first talk is
              completed. */}
          {!firstTalkCompleted && (
            <span
              className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-80"
              style={{ animation: "ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite" }}
            />
          )}
          <div className="rounded-full overflow-hidden border border-emerald-500/40 shadow-[0_0_18px_rgba(16,185,129,0.35)] group-hover:shadow-[0_0_24px_rgba(16,185,129,0.55)] transition-shadow">
            <HolographicElara size="sm" visible />
          </div>
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-emerald-300/60 group-hover:text-emerald-200">
          Elara
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <StageDialogOverlay
            isFirstTalk={!firstTalkCompleted}
            speakers={[{ id: "elara", position: "center" }]}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
