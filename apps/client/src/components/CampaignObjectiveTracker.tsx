/* ═══════════════════════════════════════════════════════
   CAMPAIGN OBJECTIVE TRACKER — wayfinding fallback

   A small, dismissible bottom-left overlay that surfaces the
   current campaign objective(s). Reads from
   apps/shared/campaignObjectives.ts. The PRIMARY wayfinding
   layer is diegetic (Locke's inbox, Antiquarian's Loredex,
   Mobile Narrator banter, Bridge holo-map) — this tracker
   is the safety net for players who turned those off or
   who have been away long enough to lose the thread.

   Behavior:
     - Reads narrativeAct + narrativeFlags + recruitment
       count from GameContext
     - Renders the first objective as a compact card
     - "Go" button navigates via wouter
     - "Dismiss for this session" hides the tracker until
       reload (does not persist; each load reshows)
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState, type ReactElement } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { deriveCampaignObjectives } from "@shared/campaignObjectives";

export function CampaignObjectiveTracker(): ReactElement | null {
  const { state } = useGame();
  const [, navigate] = useLocation();
  const [hidden, setHidden] = useState(false);

  const objectives = useMemo(
    () =>
      deriveCampaignObjectives({
        narrativeAct: state.narrativeAct ?? 0,
        narrativeFlags: state.narrativeFlags ?? {},
        recruitmentMissionsCompleted:
          state.armyRecruitmentMissionsCompleted?.length ?? 0,
        preludeComplete: Boolean(state.narrativeFlags?.prelude_complete),
      }),
    [
      state.narrativeAct,
      state.narrativeFlags,
      state.armyRecruitmentMissionsCompleted,
    ],
  );

  if (hidden) return null;
  if (objectives.length === 0) return null;

  const primary = objectives[0];

  return (
    <AnimatePresence>
      <motion.div
        key={primary.id}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-auto fixed bottom-6 left-6 z-50 max-w-sm rounded-md border border-cyan-500/40 bg-slate-950/85 p-3 shadow-md backdrop-blur"
        data-testid="campaign-objective-tracker"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-cyan-300/70">
            Objective
          </p>
          <button
            type="button"
            onClick={() => setHidden(true)}
            className="rounded border border-cyan-500/30 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-cyan-300/70 hover:bg-cyan-900/40"
            aria-label="Hide tracker for this session"
          >
            Hide
          </button>
        </div>
        <p className="mt-1 font-display text-sm text-cyan-100">
          {primary.label}
        </p>
        <p className="mt-1 font-serif text-[12px] italic leading-relaxed text-cyan-50/80">
          {primary.diegeticHint}
        </p>
        {primary.route && (
          <button
            type="button"
            onClick={() => primary.route && navigate(primary.route)}
            className="mt-2 rounded border border-cyan-500/60 bg-cyan-900/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-100 hover:bg-cyan-800/60"
          >
            Go →
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default CampaignObjectiveTracker;
