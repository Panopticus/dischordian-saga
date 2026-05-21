/* ═══════════════════════════════════════════════════════
   WOLF-HUNT DOSSIER PANEL

   Surfaced when WOLF_HUNT_ARC_AVAILABLE_FLAG is true AND
   there is no active mission. The Antiquarian's casefile
   board: list of unresolved hero dossiers grouped by
   corruptor lord. The player picks a target; that starts
   a mission and the WolfHuntOverlay swaps to the briefing
   card.

   v1 — list-view; later passes replace this with a
   physical-board look (folders, snapshot photos, stamped
   case-file markings).
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";

export function WolfHuntDossierPanel() {
  const targets = trpc.wolfHunt.getAvailableTargets.useQuery();
  const progress = trpc.wolfHunt.getHuntProgress.useQuery();
  const start = trpc.wolfHunt.startMission.useMutation();
  const [lordFilter, setLordFilter] = useState<string | null>(null);

  if (!targets.data || !progress.data) return null;

  const filtered = lordFilter
    ? targets.data.filter((t) => t.corruptorLord === lordFilter)
    : targets.data;

  const meters = progress.data.meters;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-3xl w-[92%] max-h-[90vh] overflow-y-auto rounded-lg border border-amber-900/40 bg-zinc-950 p-5 text-zinc-100 shadow-2xl">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">The Antiquarian's Ledger</h1>
          <p className="text-xs opacity-70">
            {progress.data.resolvedCount} of {progress.data.totalTargets} columns
            closed · {progress.data.lieutenantsDefeated}/10 lieutenants fallen
          </p>
        </header>

        <section className="mb-4 grid grid-cols-3 gap-3 text-xs">
          <Meter label="League strength" value={meters.league_strength} />
          <Meter label="Hierarchy influence" value={meters.hierarchy_influence} />
          <Meter label="Release pressure" value={meters.release_pressure} reverse />
        </section>

        <section className="mb-3 flex flex-wrap gap-1">
          <Badge
            variant={lordFilter === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setLordFilter(null)}
          >
            All
          </Badge>
          {Array.from(
            new Set(targets.data.map((t) => t.corruptorLord)),
          ).map((l) => (
            <Badge
              key={l}
              variant={lordFilter === l ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setLordFilter(l)}
            >
              {l.replace(/_/g, " ")}
            </Badge>
          ))}
        </section>

        <section className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-900 p-3"
            >
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs opacity-70">
                  {t.classKey} · {t.corruptorLord.replace(/_/g, " ")} · Tier{" "}
                  {t.threatTier} · {t.lairLocation.replace(/_/g, " ")}
                  {t.isBossLieutenant ? " · LIEUTENANT" : ""}
                </div>
              </div>
              <Button
                size="sm"
                disabled={start.isPending}
                onClick={async () => {
                  await start.mutateAsync({ targetId: t.id });
                  await Promise.all([targets.refetch(), progress.refetch()]);
                }}
              >
                Open
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm opacity-70 italic">
              No targets in this column. Pick another.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function Meter({
  label,
  value,
  reverse = false,
}: {
  label: string;
  value: number;
  reverse?: boolean;
}) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="mb-1 opacity-80">
        {label} — {pct}%
      </div>
      <Progress
        value={pct}
        className={reverse ? "bg-amber-950" : "bg-emerald-950"}
      />
    </div>
  );
}
