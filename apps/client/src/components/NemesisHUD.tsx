import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Skull, Crown, Eye, ScrollText, ChevronDown, ChevronUp } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   NEMESIS HUD — Shadow-of-Mordor-style cohort-rival panel

   Per dreamer-canon (2026-05-13): every player apprentice
   recruitment spawns a Nemesis. This HUD surfaces:
     - the current Nemesis for the active cohort
     - display-name (archetype-title or proper name when the
       two reveal gates close)
     - rank + grudge tier
     - active plans (open + ticking)
     - encounter ledger (collapsible)

   Wired through the Nemesis tRPC router (apps/server/
   routers/nemesis.ts). All data fetched from server; the
   client never spawns a Nemesis directly — that's the
   recruit-flow's job.
   ═══════════════════════════════════════════════════════ */

interface NemesisHUDProps {
  /** Active apprentice cohort number. */
  cohortNumber: number;
  /** Whether the Resurrectionist arc E5 has closed. */
  resurrectionistE5Complete?: boolean;
  /** Whether Game Master Fight 2 plague-mask seed has been seen. */
  gameMasterPlagueMaskSeedSeen?: boolean;
}

const RANK_LABEL: Record<number, string> = {
  1: "Seeker (Project Sorrow)",
  2: "Student (Mechronis Academy)",
  3: "Initiate",
  4: "Operative",
  5: "Lieutenant",
  6: "Captain",
  7: "Archon-aspirant",
};

const GRUDGE_LABEL: Record<number, string> = {
  0: "Neutral",
  1: "Annoyed",
  2: "Pointed",
  3: "Vindictive",
  4: "Ceremonial",
  5: "Total",
};

const SURFACE_LABEL: Record<string, string> = {
  "trade-empire": "Trade Empire",
  "casino": "Casino",
  "hub": "Governance Hub",
  "apprentice": "Apprentice Trial",
  "world": "World",
};

export function NemesisHUD({
  cohortNumber,
  resurrectionistE5Complete = false,
  gameMasterPlagueMaskSeedSeen = false,
}: NemesisHUDProps) {
  const [memoryExpanded, setMemoryExpanded] = useState(false);
  const [plansExpanded, setPlansExpanded] = useState(true);

  const nemesis = trpc.nemesis.getForCohort.useQuery({
    cohortNumber,
    resurrectionistE5Complete,
    gameMasterPlagueMaskSeedSeen,
  });

  const plansQuery = trpc.nemesis.listActivePlans.useQuery(undefined, {
    enabled: Boolean(nemesis.data),
  });

  const memoryQuery = trpc.nemesis.listMemory.useQuery(
    { nemesisId: nemesis.data?.id ?? "", limit: 25 },
    { enabled: Boolean(nemesis.data) },
  );

  if (nemesis.isLoading) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
        <div className="text-sm text-zinc-500">Reading the chronicle…</div>
      </div>
    );
  }

  if (!nemesis.data) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Skull className="size-4" />
          <span>No Nemesis is yet shadowing this cohort.</span>
        </div>
      </div>
    );
  }

  const n = nemesis.data;
  const activePlans = plansQuery.data ?? [];
  const cohortPlans = activePlans.filter((p) => p.nemesisId === n.id);
  const memory = memoryQuery.data ?? [];

  const nameDisplay = n.identity.nameRevealed
    ? n.identity.properName
    : n.identity.archetypeTitle;

  return (
    <div className="rounded-lg border border-amber-900/30 bg-zinc-950/70 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-amber-950/40">
          <Skull className="size-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-amber-200">
              {nameDisplay}
            </span>
            {n.identity.nameRevealed && (
              <span className="rounded-full bg-amber-950/40 px-2 py-0.5 text-xs text-amber-400">
                <Eye className="inline size-3 mr-1" />Revealed
              </span>
            )}
          </div>
          <div className="text-xs text-zinc-500">
            Cohort #{n.cohortNumber} · paired against your {n.archetype}-apprentice
          </div>
        </div>
      </div>

      {/* Rank + Grudge + Surface */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded border border-zinc-800 bg-zinc-900/50 p-2">
          <div className="flex items-center gap-1 text-zinc-500">
            <Crown className="size-3" />Rank
          </div>
          <div className="mt-1 font-medium text-zinc-200">
            {RANK_LABEL[n.rank] ?? `Rank ${n.rank}`}
          </div>
        </div>
        <div className="rounded border border-zinc-800 bg-zinc-900/50 p-2">
          <div className="text-zinc-500">Grudge</div>
          <div className="mt-1 font-medium text-zinc-200">
            {GRUDGE_LABEL[n.grudgeTier] ?? `Tier ${n.grudgeTier}`}
          </div>
        </div>
        <div className="rounded border border-zinc-800 bg-zinc-900/50 p-2">
          <div className="text-zinc-500">Preferred</div>
          <div className="mt-1 font-medium text-zinc-200">
            {SURFACE_LABEL[n.preferredSurface] ?? n.preferredSurface}
          </div>
        </div>
      </div>

      {/* Active plans */}
      <div className="rounded border border-zinc-800 bg-zinc-900/30">
        <button
          type="button"
          onClick={() => setPlansExpanded(!plansExpanded)}
          className="flex w-full items-center justify-between p-2 text-sm"
        >
          <span className="flex items-center gap-2 text-zinc-300">
            <ScrollText className="size-4 text-amber-400" />
            Active plans ({cohortPlans.length})
          </span>
          {plansExpanded
            ? <ChevronUp className="size-4 text-zinc-500" />
            : <ChevronDown className="size-4 text-zinc-500" />}
        </button>
        {plansExpanded && (
          <div className="space-y-1 px-2 pb-2">
            {cohortPlans.length === 0 ? (
              <div className="text-xs text-zinc-500">
                The Nemesis is between plans. New plans spawn on cohort tick.
              </div>
            ) : (
              cohortPlans.map((plan) => (
                <div
                  key={plan.planId}
                  className="rounded border border-amber-900/20 bg-amber-950/10 p-2 text-xs"
                >
                  <div className="font-medium text-amber-200">{plan.loreTitle}</div>
                  <div className="mt-1 text-zinc-500">
                    Surface: {SURFACE_LABEL[plan.targetSurface] ?? plan.targetSurface}
                    {" · "}
                    Status: {plan.status}
                    {" · "}
                    Ticks: {new Date(plan.ticksAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Encounter ledger */}
      <div className="rounded border border-zinc-800 bg-zinc-900/30">
        <button
          type="button"
          onClick={() => setMemoryExpanded(!memoryExpanded)}
          className="flex w-full items-center justify-between p-2 text-sm"
        >
          <span className="text-zinc-300">
            Encounter ledger ({memory.length})
          </span>
          {memoryExpanded
            ? <ChevronUp className="size-4 text-zinc-500" />
            : <ChevronDown className="size-4 text-zinc-500" />}
        </button>
        {memoryExpanded && (
          <div className="space-y-1 px-2 pb-2">
            {memory.length === 0 ? (
              <div className="text-xs text-zinc-500">
                No encounters yet. The chronicle has not begun between you.
              </div>
            ) : (
              memory.map((entry) => (
                <div
                  key={entry.memoryId}
                  className="rounded border border-zinc-800 bg-zinc-950/40 p-2 text-xs"
                >
                  <div className="text-zinc-400">
                    [{entry.encounterKind}] at {SURFACE_LABEL[entry.source] ?? entry.source}
                    {" · "}
                    {new Date(entry.recordedAt).toLocaleDateString()}
                  </div>
                  <div className="mt-1 italic text-zinc-300">
                    &ldquo;{entry.quoteOpening}&rdquo;
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Reveal hint footer */}
      {!n.identity.nameRevealed && (
        <div className="rounded border border-zinc-800 bg-zinc-950/40 p-2 text-xs text-zinc-500">
          The Nemesis's name remains hidden. The chronicle reveals it when
          you close the Resurrectionist arc and witness the second Game Master
          fight's plague-masked imprint seed.
        </div>
      )}
    </div>
  );
}
