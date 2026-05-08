/* ═══════════════════════════════════════════════════════
   HELLBOX RESTORATION PANEL — Stage 2 of the Resurrection
   Protocol. Restores a fallen apprentice (one-shot, ever).

   Reads:
     trpc.crew.getState     — picks fallen apprentices.
     trpc.hellbox.checkEligibility({ memberKey })
   Mutates:
     trpc.hellbox.restore({ memberKey })

   Surfaces the cost (dream + materials + voidCrystals), the
   memory-loss warning ("one previously-unread loredex entry
   will be stripped"), and a degradation preview.

   Only `productionPath="trained"` and `cloneDegradation=0`
   apprentices are eligible. Recruited NPCs go through the
   Resurrection Protocols quest, not Hellbox.

   File: apps/client/src/components/resurrection/HellboxRestorationPanel.tsx
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skull, AlertTriangle, RotateCcw } from "lucide-react";

export default function HellboxRestorationPanel() {
  const utils = trpc.useUtils();
  const crewQuery = trpc.crew.getState.useQuery();
  const restore = trpc.hellbox.restore.useMutation({
    onSuccess: (res) => {
      utils.crew.getState.invalidate();
      utils.bloodWeave?.getState?.invalidate?.();
      const newlyUnlocked = res.bloodWeave?.newlyUnlocked ?? [];
      const tail =
        newlyUnlocked.length > 0
          ? ` Blood Weave +1 — ${newlyUnlocked.length} new loredex entry${
              newlyUnlocked.length > 1 ? "ies" : ""
            } unlocked.`
          : "";
      toast.success(
        `${res.member.name} restored. The pattern came back imperfect.${tail}`,
        { duration: 10000 },
      );
    },
    onError: (err) => toast.error(err.message),
  });

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const fallenApprentices = useMemo(() => {
    const deceased = crewQuery.data?.roster?.deceased ?? [];
    return deceased.filter(
      (m) => m.productionPath === "trained" && (m.cloneDegradation ?? 0) === 0,
    );
  }, [crewQuery.data]);

  const eligibilityQuery = trpc.hellbox.checkEligibility.useQuery(
    { memberKey: selectedKey ?? "" },
    { enabled: selectedKey !== null },
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Skull className="w-5 h-5" />
          Stage 2 — Hellbox Restoration
        </h3>
        <p className="text-sm opacity-80 max-w-prose">
          Bench-built salvage tech. Restores a fallen apprentice <em>once,
          ever</em>. The Resurrectionist Ne-Yon is gone; the salvage runs
          uncorrected. Cost: 100 dream + 50 materials + 5 voidCrystals + one
          previously-unread loredex entry, permanently. The restored member
          comes back with a 10% stat dim and a death record they can read.
        </p>
      </div>

      {fallenApprentices.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm opacity-80">
            No fallen apprentices eligible for restoration. The Hellbox is dormant.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {fallenApprentices.map((m) => {
            const isSelected = selectedKey === m.id;
            return (
              <Card
                key={m.id}
                data-selected={isSelected || undefined}
                className="cursor-pointer"
                onClick={() => setSelectedKey(m.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{m.name}</span>
                    <Badge variant="outline">{m.archetype ?? "—"}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {m.deathRecord ? (
                    <p className="opacity-80 italic">
                      &ldquo;{m.deathRecord.epitaph || m.deathRecord.lastWords}&rdquo;
                    </p>
                  ) : null}
                  <p className="text-xs opacity-70">
                    Cause: {m.deathRecord?.cause ?? "unknown"} · Cycle{" "}
                    {m.deathRecord?.cycle ?? "?"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedKey ? (
        <Card data-selected-detail className="border-amber-500/40">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Restoration Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {eligibilityQuery.isLoading ? (
              <div className="opacity-70">Checking eligibility…</div>
            ) : null}
            {eligibilityQuery.data?.eligible === false ? (
              <p className="text-amber-600">
                Not eligible: {eligibilityQuery.data.reason}
              </p>
            ) : null}
            {eligibilityQuery.data?.eligible === true ? (
              <>
                <ul className="list-disc list-inside space-y-1 text-xs opacity-80">
                  <li>Cost: 100 dream + 50 materials + 5 voidCrystals.</li>
                  <li>
                    Stat-cap reduction: 10% on every axis (clone degradation tier 1).
                  </li>
                  <li>
                    Memory loss: one previously-unread loredex entry, stripped
                    permanently. The Memorial Wall keeps a record of what was
                    lost.
                  </li>
                  <li>
                    Blood Weave alignment: +1 toward the Hierarchy. May reveal one
                    Game-Master / Hierarchy / Blood-Weave loredex entry.
                  </li>
                  <li>
                    Limit: this apprentice cannot be restored again. A second
                    death is final.
                  </li>
                </ul>
                <Button
                  className="w-full"
                  onClick={() =>
                    restore.mutate({ memberKey: selectedKey })
                  }
                  disabled={restore.isPending}
                  variant="default"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {restore.isPending ? "Restoring…" : "Run Restoration"}
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
