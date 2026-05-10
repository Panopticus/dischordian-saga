/* ═══════════════════════════════════════════════════════
   COHORT SLOTS PANEL — view + manage all 3 apprentice slots.

   Shows the active companion slot and the two training
   slots side-by-side. Surfaces the cross-cohort doctrine
   resonance/dissonance pulls that fire each day. Provides
   promote/vacate buttons.

   File: apps/client/src/components/apprentice/pedagogy/CohortSlotsPanel.tsx
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowUpFromLine, Skull, Crown, Hourglass } from "lucide-react";
import {
  computeCrossCohortPullup,
  type CohortSlotId,
  type CohortState,
} from "@shared/apprenticeCohort";

const SLOT_LABEL: Record<CohortSlotId, string> = {
  active: "Active Companion",
  training_a: "Training A",
  training_b: "Training B",
};

const SLOT_ICON: Record<CohortSlotId, React.ReactNode> = {
  active: <Crown className="w-4 h-4 text-amber-300" />,
  training_a: <Hourglass className="w-4 h-4 text-sky-300" />,
  training_b: <Hourglass className="w-4 h-4 text-sky-300" />,
};

export default function CohortSlotsPanel() {
  const utils = trpc.useUtils();
  const stateQuery = trpc.apprenticePedagogy.cohortGet.useQuery();

  const promote = trpc.apprenticePedagogy.cohortPromote.useMutation({
    onSuccess: () => {
      utils.apprenticePedagogy.cohortGet.invalidate();
      toast.success("Promoted to active companion.");
    },
    onError: (e) => toast.error(e.message),
  });

  const vacate = trpc.apprenticePedagogy.cohortVacate.useMutation({
    onSuccess: () => {
      utils.apprenticePedagogy.cohortGet.invalidate();
      toast.success("Slot vacated.");
    },
    onError: (e) => toast.error(e.message),
  });

  if (stateQuery.isLoading) {
    return <div className="p-4 text-slate-400 text-sm">Loading cohort...</div>;
  }

  const state: CohortState | undefined = stateQuery.data
    ? {
        slots: stateQuery.data.slots,
        totalRecruited: stateQuery.data.totalRecruited,
        totalGraduated: stateQuery.data.totalGraduated,
        totalFallen: stateQuery.data.totalFallen,
      }
    : undefined;

  if (!state) return null;

  const pulls = computeCrossCohortPullup(state);

  const renderSlot = (slotId: CohortSlotId) => {
    const slot = state.slots[slotId];
    const occupied = slot.apprenticeId !== null;
    const bondPull = pulls.bondDailyDelta[slotId];
    const corruptPull = pulls.corruptionDailyDelta[slotId];

    return (
      <Card key={slotId} className={occupied ? "" : "border-dashed border-slate-800"}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2">
              {SLOT_ICON[slotId]} {SLOT_LABEL[slotId]}
            </span>
            {occupied && slot.doctrineId && (
              <Badge className="bg-slate-800 text-slate-300 text-xs">
                {slot.doctrineId.replace("_", " ")}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {occupied ? (
            <>
              <div className="text-xs text-slate-400 mb-2">
                apprentice: <code className="text-slate-300">{slot.apprenticeId}</code>
              </div>
              <div className="text-xs text-slate-400 space-y-0.5 mb-3">
                {bondPull !== 0 && (
                  <div>
                    cross-cohort bond pull: {bondPull > 0 ? "+" : ""}{bondPull.toFixed(2)}/day
                  </div>
                )}
                {corruptPull !== 0 && (
                  <div className="text-rose-300">
                    cross-cohort corruption pull: +{corruptPull.toFixed(2)}/day
                  </div>
                )}
              </div>
              {(slotId === "training_a" || slotId === "training_b") && state.slots.active.apprenticeId === null && (
                <Button
                  className="w-full mb-2"
                  variant="default"
                  size="sm"
                  disabled={promote.isPending}
                  onClick={() => promote.mutate({ from: slotId })}
                >
                  <ArrowUpFromLine className="w-3.5 h-3.5 mr-1" />
                  Promote to active
                </Button>
              )}
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={vacate.isPending}
                  onClick={() => vacate.mutate({ slot: slotId, exitKind: "graduated" })}
                >
                  Graduated
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={vacate.isPending}
                  onClick={() => vacate.mutate({ slot: slotId, exitKind: "fallen" })}
                >
                  <Skull className="w-3.5 h-3.5 mr-1" />
                  Fallen
                </Button>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-500 italic">
              {slotId === "active"
                ? "Empty. Recruit or promote a training apprentice."
                : "Empty. Recruit a new apprentice into this slot."}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(["active", "training_a", "training_b"] as CohortSlotId[]).map(renderSlot)}
      </div>
      {pulls.notes.length > 0 && (
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm">Daily Cross-Cohort Pulls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {pulls.notes.map((n, i) => (
              <div key={i} className="text-xs text-slate-300">{n}</div>
            ))}
          </CardContent>
        </Card>
      )}
      <div className="text-xs text-slate-500 px-1 flex gap-4">
        <span>recruited: <strong className="text-slate-300">{state.totalRecruited}</strong></span>
        <span>graduated: <strong className="text-slate-300">{state.totalGraduated}</strong></span>
        <span>fallen: <strong className="text-slate-300">{state.totalFallen}</strong></span>
      </div>
    </div>
  );
}
