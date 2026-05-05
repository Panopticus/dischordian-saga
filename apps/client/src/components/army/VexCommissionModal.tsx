/* ═══════════════════════════════════════════════════════
   VexCommissionModal

   Pops once per newly-issued Vex Solène commission. Renders the
   commission's narrative line, the directive it unlocked, and a
   single dismiss action (which pops the queue in
   useVexCommissions).

   Voice surface only — no business logic. The shared module
   apps/shared/vexSoleneCommissions.ts owns the lines and the
   directive shapes. Visual idiom matches the existing
   ArmyManagementPage mission-report modal: framer-motion
   fade+scale, void-* design tokens, faction-style colored
   speaker dots + uppercase labels.
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronRight } from "lucide-react";
import type { CodaCommission } from "@shared/vexSoleneCommissions";
import type {
  SecondChairAdviceContext,
  SecondChairRevealStage,
} from "@shared/codaSecondChair";
import { SecondChairAside } from "@/companion/SecondChairAside";

export interface VexCommissionModalProps {
  commission: CodaCommission | null;
  onDismiss: () => void;
  /**
   * Optional Vex reveal stage for the current player. When this
   * reaches `engineer_zero_hint` or `engineer_zero_confirmed` the
   * commission modal renders an Engineer-flavoured "Second Chair"
   * aside beside Vex's filing line.
   */
  revealStage?: SecondChairRevealStage;
  /** Vex bond tier (0..4); gates rare vexAware fragments. */
  vexBondTier?: 0 | 1 | 2 | 3 | 4;
}

export function VexCommissionModal({
  commission,
  onDismiss,
  revealStage,
  vexBondTier = 0,
}: VexCommissionModalProps) {
  const secondChairCtx: SecondChairAdviceContext | null =
    commission && revealStage
      ? {
          missionId: `vex-commission:${commission.id}`,
          archetype: commission.directive.missionKind,
          reconstructionConfidence: 0.4 + vexBondTier * 0.15,
          revealStage,
          vexBondTier,
        }
      : null;
  return (
    <AnimatePresence>
      {commission && (
        <motion.div
          key="vex-commission-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onDismiss}
        >
          <motion.div
            key={commission.id}
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full max-w-md void-surface p-5"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header — speaker + filing number, matching the army
                report modal's icon + uppercase title shape. */}
            <div className="flex items-center gap-2 mb-1">
              <FileText size={16} className="text-primary" />
              <h3 className="font-display text-sm font-bold tracking-wide">
                CODA COMMISSION &middot; FILING #{commission.milestone}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 mb-4 pl-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-mono text-[10px] text-primary tracking-[0.2em]">
                VEX SOLÈNE
              </span>
            </div>

            {/* Vex's filing line. Generous leading; trailing-word
                cadence reads better with breathing room. */}
            <div className="space-y-3 mb-4">
              <p className="text-sm leading-relaxed">{commission.line}</p>
              {commission.callbackLine && (
                <div className="border-l-2 border-primary/40 pl-3">
                  <p className="text-xs italic opacity-80 leading-relaxed">
                    {commission.callbackLine}
                  </p>
                </div>
              )}
              {secondChairCtx && <SecondChairAside ctx={secondChairCtx} />}
            </div>

            {/* Directive card. Distinct surface so the unlock
                visually separates from the dialog. */}
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 mb-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <ChevronRight size={12} className="text-primary" />
                <span className="font-mono text-[10px] text-primary tracking-[0.2em]">
                  DIRECTIVE UNLOCKED
                </span>
              </div>
              <div className="font-display text-sm font-bold tracking-wide mb-1">
                {capitalize(commission.directive.unitType)}
                <span className="opacity-50 mx-2">·</span>
                {capitalize(commission.directive.missionKind)}
                <span className="text-primary ml-2">
                  +{commission.directive.successBonusPct}%
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {commission.directive.counsel}
              </p>
            </div>

            <button
              onClick={onDismiss}
              autoFocus
              className="w-full px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/20 transition-all tracking-wide"
            >
              ACKNOWLEDGE
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}
