/* ═══════════════════════════════════════════════════════
   VexCommissionModal

   Pops once per newly-issued Vex Solène commission. Renders the
   commission's narrative line, the directive it unlocked, and a
   single dismiss action (which pops the queue in
   useVexCommissions).

   Voice surface only — no business logic. The shared module
   apps/shared/vexSoleneCommissions.ts owns the lines and the
   directive shapes.
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CodaCommission } from "@shared/vexSoleneCommissions";

export interface VexCommissionModalProps {
  commission: CodaCommission | null;
  onDismiss: () => void;
}

export function VexCommissionModal({ commission, onDismiss }: VexCommissionModalProps) {
  // Controlled open state derived from commission presence. When
  // the queue empties (commission becomes null), the dialog closes.
  const open = commission !== null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onDismiss();
      }}
    >
      <DialogContent className="max-w-lg">
        {commission && (
          <>
            <DialogHeader>
              <DialogTitle>
                Coda Commission &mdash; Filing #{commission.milestone}
              </DialogTitle>
              <DialogDescription>
                Adjudicator: <span className="font-semibold">Vex Solène</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <p className="leading-relaxed">{commission.line}</p>
              {commission.callbackLine && (
                <p className="leading-relaxed italic opacity-80">
                  {commission.callbackLine}
                </p>
              )}
              <div className="rounded-md border p-3">
                <div className="text-xs uppercase opacity-70 mb-1">
                  Directive unlocked
                </div>
                <div className="font-semibold">
                  {capitalize(commission.directive.unitType)} &middot;{" "}
                  {capitalize(commission.directive.missionKind)}{" "}
                  +{commission.directive.successBonusPct}%
                </div>
                <p className="text-sm mt-2">{commission.directive.counsel}</p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={onDismiss} autoFocus>
                Acknowledge
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}
