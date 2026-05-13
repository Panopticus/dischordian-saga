import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, Skull, Crown } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   NEMESES PAGE — Phase K2/K3

   The cross-cohort roster: every Nemesis the player has
   accumulated (Mordor-Saga hybrid model). 2-5 active
   rivals by Act 7. Each Nemesis surfaces with rank,
   grudge, faction, preferred surface.
   ═══════════════════════════════════════════════════════ */

const FACTION_LABEL: Record<string, string> = {
  hierarchy: "the Hierarchy",
  insurgency: "the Insurgency",
  new_babylon: "New Babylon",
  architect_remnants: "the Architect Remnants",
  dreamers_children: "the Dreamer's Children",
};

const SURFACE_LABEL: Record<string, string> = {
  "trade-empire": "Trade Empire",
  casino: "Casino",
  hub: "Governance Hub",
  apprentice: "Apprentice Trial",
};

const RANK_LABEL: Record<number, string> = {
  1: "Seeker",
  2: "Student",
  3: "Initiate",
  4: "Operative",
  5: "Lieutenant",
  6: "Captain",
  7: "Archon-aspirant",
};

export default function NemesesPage() {
  const nemeses = trpc.nemesis.getActiveNemeses.useQuery();
  const plans = trpc.nemesis.listActivePlans.useQuery();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/cohort"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <Skull size={18} className="text-amber-400" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">
              NEMESES
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              The Politician's secret apprentices, in the order they
              found you.
            </p>
          </div>
        </div>

        {nemeses.isLoading && (
          <div className="text-sm text-zinc-500">Reading the chronicle…</div>
        )}

        {!nemeses.isLoading &&
          (nemeses.data ?? []).length === 0 && (
            <div className="rounded border border-zinc-800 bg-zinc-950/50 p-6 text-center">
              <Skull className="mx-auto mb-3 size-8 text-zinc-700" />
              <div className="font-mono text-xs text-zinc-400">
                No Nemesis is yet shadowing you. Recruit an apprentice
                and the chronicle will pair you against one of the
                Politician's surviving secret-apprentices.
              </div>
            </div>
          )}

        <div className="space-y-3">
          {(nemeses.data ?? []).map((n) => {
            const myPlans = (plans.data ?? []).filter(
              (p) => p.nemesisId === n.id,
            );
            const factionLabel =
              FACTION_LABEL[n.alignedFaction ?? "hierarchy"];
            const display = n.identity.nameRevealed
              ? n.identity.properName
              : `The ${n.identity.archetypeTitle}`;
            return (
              <div
                key={n.id}
                className="rounded border border-amber-900/30 bg-zinc-950/60 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-amber-950/40">
                    <Skull className="size-4 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-amber-200">
                      {display}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Cohort #{n.cohortNumber} · operating from{" "}
                      {SURFACE_LABEL[n.preferredSurface] ?? n.preferredSurface}
                      {" · serving "}{factionLabel}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Crown className="size-3" />
                      {RANK_LABEL[n.rank] ?? `Rank ${n.rank}`}
                    </div>
                    <div className="text-zinc-500">
                      Grudge tier {n.grudgeTier}/5
                    </div>
                  </div>
                </div>
                {myPlans.length > 0 && (
                  <div className="mt-2 ml-12 space-y-1">
                    {myPlans.map((p) => (
                      <div
                        key={p.planId}
                        className="text-xs text-amber-300/80"
                      >
                        · {p.loreTitle} ({SURFACE_LABEL[p.targetSurface] ?? p.targetSurface})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
