/* ═══════════════════════════════════════════════════════
   CODA AGENCY BOARD — Coda-only mission surface.

   Per CANON Rev 7 §2 (The Coda). Reads
   `tradeMissions.listAvailable` + `tradeMissions.getCodaStanding`,
   filters to the three Coda agencies (vex_solene, coda_central,
   engineer_zero), and offers per-row Accept / Complete actions.

   Mounted on TradeMissionsPage. Completion is routed through
   `tradeMissions.completeCodaMission` so the Coda tier + vexCodaTrust
   updates land in the same transaction as the reward.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  TRADE_AGENCY_LABEL,
  type TradeMissionAgencyId,
} from "@shared/tradeMissionCatalog";

const CODA_AGENCY_SET: ReadonlySet<TradeMissionAgencyId> = new Set([
  "vex_solene",
  "coda_central",
  "engineer_zero",
]);

const TIER_LABEL: Record<string, string> = {
  unknown: "Unknown",
  noticed: "Noticed",
  client: "Client",
  operative: "Operative",
  lieutenant: "Lieutenant",
  inner_circle: "Inner Circle",
};

export function CodaAgencyBoard() {
  const list = trpc.tradeMissions.listAvailable.useQuery();
  const standing = trpc.tradeMissions.getCodaStanding.useQuery();
  const utils = trpc.useUtils();
  const accept = trpc.tradeMissions.accept.useMutation({
    onSuccess: () => utils.tradeMissions.listAvailable.invalidate(),
  });
  const complete = trpc.tradeMissions.completeCodaMission.useMutation({
    onSuccess: () => {
      utils.tradeMissions.listAvailable.invalidate();
      utils.tradeMissions.getCodaStanding.invalidate();
    },
  });

  const codaMissions = useMemo(() => {
    const rows = list.data ?? [];
    return rows.filter(
      (r) => r.def.agencyId && CODA_AGENCY_SET.has(r.def.agencyId),
    );
  }, [list.data]);

  const tier = standing.data?.tier ?? "unknown";
  const trust = standing.data?.vexCodaTrust ?? 0;
  const missionsCompleted = standing.data?.missionsCompleted ?? 0;
  const reconciliationArcs = standing.data?.reconciliationArcs ?? 0;

  return (
    <section
      aria-labelledby="coda-board-heading"
      className="border border-white/10 rounded-md p-4 space-y-4"
    >
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2
            id="coda-board-heading"
            className="text-lg font-semibold tracking-wide"
          >
            The Coda
          </h2>
          <p className="text-xs opacity-60 mt-0.5">
            The closing note. The Eyes of Reality. Maestro's table.
          </p>
        </div>
        <div className="text-right text-xs">
          <div className="uppercase tracking-wider opacity-60">
            Standing
          </div>
          <div className="text-sm font-medium">
            {TIER_LABEL[tier] ?? tier}
          </div>
        </div>
      </header>

      <dl className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <dt className="uppercase tracking-wider opacity-60">
            Vex Coda Trust
          </dt>
          <dd className="mt-1">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white/60"
                style={{ width: `${trust}%` }}
              />
            </div>
            <span className="opacity-80">{trust} / 100</span>
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider opacity-60">Missions</dt>
          <dd className="mt-1 text-sm">{missionsCompleted}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider opacity-60">
            Reconciliations
          </dt>
          <dd className="mt-1 text-sm">{reconciliationArcs}</dd>
        </div>
      </dl>

      {list.isLoading || standing.isLoading ? (
        <p className="text-sm opacity-70">Pulling the dispatch board…</p>
      ) : codaMissions.length === 0 ? (
        <p className="text-sm opacity-70">
          No Coda commissions are open right now. The Maestro is selective.
        </p>
      ) : (
        <ul className="space-y-3">
          {codaMissions.map((m) => (
            <li
              key={m.id}
              className="border border-white/5 rounded-md p-3 space-y-1"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-sm">{m.def.title}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-60 shrink-0">
                  {m.def.agencyId
                    ? TRADE_AGENCY_LABEL[m.def.agencyId]
                    : "Unsigned"}
                </span>
              </div>
              <p className="text-xs opacity-75 leading-snug">{m.def.flavor}</p>
              <div className="flex items-center justify-end gap-2 pt-1">
                {m.status === "available" && (
                  <button
                    type="button"
                    onClick={() => accept.mutate({ id: m.id })}
                    disabled={accept.isPending}
                    className="text-xs px-2 py-1 rounded border border-white/15 hover:bg-white/5"
                  >
                    Accept
                  </button>
                )}
                {m.status === "active" && (
                  <button
                    type="button"
                    onClick={() => complete.mutate({ id: m.id })}
                    disabled={complete.isPending}
                    className="text-xs px-2 py-1 rounded border border-white/15 hover:bg-white/5"
                  >
                    Complete
                  </button>
                )}
                {m.status === "completed" && (
                  <span className="text-[10px] uppercase tracking-wider opacity-60">
                    Closed
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
