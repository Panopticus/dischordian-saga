/* ═══════════════════════════════════════════════════════
   TRADE MISSIONS PAGE — Coda Agency vertical slice (UI).

   First-slice client surface for the browse → accept → complete →
   reward loop documented in
   docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md §2 (The Coda).

   Reads tradeMissions.listAvailable + tradeMissions.getAgencyStanding
   in one render; offers Accept / Complete actions per row. No real-
   time clock check yet — instant complete on click is the slice's
   acceptable simplification (audit §6 item 1).
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  TRADE_AGENCY_LABEL,
  type TradeMissionAgencyId,
} from "@shared/tradeMissionCatalog";

function formatHoursLeft(expiresAtMs: number): string {
  const dt = expiresAtMs - Date.now();
  if (dt <= 0) return "expired";
  const hours = Math.floor(dt / 3_600_000);
  const mins = Math.floor((dt % 3_600_000) / 60_000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function standingTier(standing: number): string {
  // CANON Rev 7 §2.4 tier projection — integer score → tier label.
  if (standing >= 100) return "Inner Circle";
  if (standing >= 50) return "Lieutenant";
  if (standing >= 25) return "Operative";
  if (standing >= 5) return "Client";
  if (standing < 0) return "Suspect";
  return "Neutral";
}

function rewardSummary(reward: {
  credits?: number;
  dream?: number;
  voidCrystals?: number;
  standing?: Partial<Record<TradeMissionAgencyId, number>>;
  narrativeFlags?: string[];
}): string {
  const parts: string[] = [];
  if (reward.credits) parts.push(`${reward.credits.toLocaleString()} credits`);
  if (reward.dream) parts.push(`${reward.dream} dream`);
  if (reward.voidCrystals) parts.push(`${reward.voidCrystals} void`);
  if (reward.standing) {
    for (const [agencyId, delta] of Object.entries(reward.standing)) {
      if (!delta) continue;
      const label = TRADE_AGENCY_LABEL[agencyId as TradeMissionAgencyId] ?? agencyId;
      parts.push(`${delta > 0 ? "+" : ""}${delta} ${label}`);
    }
  }
  return parts.join(" · ") || "—";
}

export default function TradeMissionsPage() {
  const utils = trpc.useUtils();
  const missions = trpc.tradeMissions.listAvailable.useQuery();
  const standing = trpc.tradeMissions.getAgencyStanding.useQuery();

  const acceptMut = trpc.tradeMissions.accept.useMutation({
    onSuccess: () => {
      utils.tradeMissions.listAvailable.invalidate();
    },
  });
  const completeMut = trpc.tradeMissions.complete.useMutation({
    onSuccess: () => {
      utils.tradeMissions.listAvailable.invalidate();
      utils.tradeMissions.getAgencyStanding.invalidate();
    },
  });

  const grouped = useMemo(() => {
    const open = (missions.data ?? []).filter((m) => m.status === "available");
    const active = (missions.data ?? []).filter((m) => m.status === "active");
    return { open, active };
  }, [missions.data]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">The Coda — Open Contracts</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Browse available work, accept, deliver. The Eyes only contact you when she
            has something for you.
          </p>
        </div>
        <Link href="/trade-empire" className="text-sm text-zinc-300 underline">
          Back to Trade Empire
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <main>
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Active</h2>
            {missions.isLoading && (
              <p className="text-zinc-500 text-sm">Loading…</p>
            )}
            {!missions.isLoading && grouped.active.length === 0 && (
              <p className="text-zinc-500 text-sm italic">
                No active contracts. Accept one below.
              </p>
            )}
            <ul className="space-y-3">
              {grouped.active.map((m) => (
                <li
                  key={m.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-md p-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{m.def.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-900 text-emerald-200">
                          tier {m.def.tier}
                        </span>
                        {m.def.agencyId && (
                          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {TRADE_AGENCY_LABEL[m.def.agencyId]}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 mb-2">{m.def.flavor}</p>
                      <p className="text-xs text-zinc-500">
                        Reward: {rewardSummary(m.def.reward)}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {formatHoursLeft(m.expiresAtMs)} remaining
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50"
                      disabled={completeMut.isPending}
                      onClick={() => completeMut.mutate({ id: m.id })}
                    >
                      Complete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Available</h2>
            {!missions.isLoading && grouped.open.length === 0 && (
              <p className="text-zinc-500 text-sm italic">
                No contracts on offer right now.
              </p>
            )}
            <ul className="space-y-3">
              {grouped.open.map((m) => (
                <li
                  key={m.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-md p-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{m.def.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          tier {m.def.tier}
                        </span>
                        {m.def.agencyId && (
                          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {TRADE_AGENCY_LABEL[m.def.agencyId]}
                          </span>
                        )}
                        <span className="text-xs text-zinc-500">
                          {m.def.durationHours}h
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 mb-2">{m.def.flavor}</p>
                      <p className="text-xs text-zinc-500">
                        Reward: {rewardSummary(m.def.reward)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm rounded bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50"
                      disabled={acceptMut.isPending}
                      onClick={() => acceptMut.mutate({ id: m.id })}
                    >
                      Accept
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <aside className="bg-zinc-900 border border-zinc-800 rounded-md p-4 h-fit">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide text-zinc-400">
            Standing
          </h2>
          {standing.isLoading && (
            <p className="text-zinc-500 text-xs">Loading…</p>
          )}
          {!standing.isLoading && (standing.data?.length ?? 0) === 0 && (
            <p className="text-zinc-500 text-xs italic">
              You have not yet drawn the Coda's attention.
            </p>
          )}
          <ul className="space-y-3">
            {standing.data?.map((row) => (
              <li
                key={row.agencyId}
                className="border-b border-zinc-800 pb-2 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-200">
                    {TRADE_AGENCY_LABEL[row.agencyId as TradeMissionAgencyId] ??
                      row.agencyId}
                  </span>
                  <span className="text-zinc-400 tabular-nums">{row.standing}</span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {standingTier(row.standing)}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
