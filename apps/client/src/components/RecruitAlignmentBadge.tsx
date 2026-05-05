/**
 * RecruitAlignmentBadge — three-axis allegiance HUD
 *
 * Renders the player's Architect / Dreamer / Engineer alignment as a
 * small ambient badge, derived from recruit-stage actions plus
 * downstream choices. Reads the canonical
 * summarizeRecruitStageAlignment helper from
 * apps/shared/recruitStageCueSequence.ts.
 *
 * The badge does not gate anything; it's a quiet read-out so the
 * player can SEE which way they've been leaning. Hidden until the
 * Prelude completes (no point showing alignment before the player
 * has had a chance to choose).
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, Moon, Wrench } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  summarizeRecruitStageAlignment,
  type RecruitStageActionsLog,
} from "@shared/recruitStageCueSequence";

export default function RecruitAlignmentBadge() {
  const { state } = useGame();
  const flags = state.narrativeFlags ?? {};

  // Hooks must run on every render in the same order — derive the
  // memoised values FIRST, then early-return for visibility. The
  // previous order called useMemo after `if (!visible) return null`,
  // which violates rules-of-hooks.
  const refusedRole = Boolean(flags.dreamer_unsanctioned_choice);
  const askedForbiddenQuestion = Boolean(flags.dreamer_plinth_question_asked);
  const touchedWrongPanel = Boolean(flags.dreamer_wrong_panel_touched);
  const recording0Heard = Boolean(flags.engineer_recording_0_discovered);

  const alignment = useMemo(() => {
    const actions: RecruitStageActionsLog = {
      refusedRole,
      askedForbiddenQuestion,
      touchedWrongPanel,
      recording0Heard,
    };
    return summarizeRecruitStageAlignment(actions);
  }, [refusedRole, askedForbiddenQuestion, touchedWrongPanel, recording0Heard]);

  // The badge surfaces only after the Prelude completes. Before that,
  // alignment is meaningless because the player hasn't made the
  // canonical recruit-stage choices yet.
  if (!flags.prelude_complete) return null;

  // Engineer score derives from a SEPARATE axis: how many Engineer
  // recordings the player has heard. The recruit-stage helper covers
  // Architect / Dreamer; we add Engineer as a parallel reading.
  const engineerScore = countEngineerRecordingsHeard(flags);

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-4 left-4 z-30 rounded-md border border-zinc-800 bg-zinc-950/85 backdrop-blur px-3 py-2 shadow-md"
      data-component="recruit-alignment-badge"
      data-leans-toward={alignment.leansToward}
    >
      <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
        Three-axis lean
      </div>
      <div className="flex items-center gap-3 text-xs">
        <AxisReadout
          icon={<Eye size={12} />}
          label="Architect"
          score={alignment.architectScore}
          total={3}
          color="text-stone-300"
          highlight={alignment.leansToward === "architect"}
        />
        <span className="text-zinc-700">·</span>
        <AxisReadout
          icon={<Moon size={12} />}
          label="Dreamer"
          score={alignment.dreamerScore}
          total={3}
          color="text-amber-300"
          highlight={alignment.leansToward === "dreamer"}
        />
        <span className="text-zinc-700">·</span>
        <AxisReadout
          icon={<Wrench size={12} />}
          label="Engineer"
          score={engineerScore}
          total={8}
          color="text-emerald-300"
          highlight={false /* engineer scoring is parallel, not exclusive */}
        />
      </div>
    </motion.aside>
  );
}

function AxisReadout({
  icon,
  label,
  score,
  total,
  color,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
  total: number;
  color: string;
  highlight: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${highlight ? color : "text-zinc-400"}`}
      title={`${label}: ${score} / ${total}`}
    >
      <span className={highlight ? color : "text-zinc-500"}>{icon}</span>
      <span className="tabular-nums">
        {score}
        <span className="text-zinc-600">/</span>
        {total}
      </span>
    </span>
  );
}

/**
 * Engineer recording discovery count (Recording 0 + Recordings 1–7).
 * Derived from the canonical engineer_recording_<n>_discovered flags.
 */
function countEngineerRecordingsHeard(flags: Record<string, boolean>): number {
  let n = 0;
  for (let i = 0; i <= 7; i++) {
    if (flags[`engineer_recording_${i}_discovered`]) n++;
  }
  return n;
}
