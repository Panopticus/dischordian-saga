/* ═══════════════════════════════════════════════════════
   YOUR SAGA — Personal consequence ledger.

   The ripple ledger (ripple_events) is a durable, per-user trail
   of every cross-system consequence the player has caused. The
   sagaLedgerService humanizes each event via SAGA_EVENT_HUMANIZERS
   and joins it with npc_public_flags so the page can render both
   the things you've done and how the world now regards you.

   Server: trpc.saga.ledger (apps/server/routers/saga.ts).
   Service: apps/server/services/sagaLedgerService.ts.
   Humanizer parity gate: narrative.saga_ledger_humanizer_coverage.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { PageSkeleton } from "@/components/SkeletonLoader";

const LEDGER_LIMIT = 60;

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function YourSagaPage() {
  const query = trpc.saga.ledger.useQuery({ limit: LEDGER_LIMIT });

  const grouped = useMemo(() => {
    const entries = query.data?.entries ?? [];
    const byDay = new Map<string, typeof entries>();
    for (const e of entries) {
      const day = e.at.slice(0, 10);
      const bucket = byDay.get(day) ?? [];
      bucket.push(e);
      byDay.set(day, bucket);
    }
    return Array.from(byDay.entries()).map(([day, items]) => ({
      day,
      items,
    }));
  }, [query.data]);

  if (query.isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <PageSkeleton />
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold mb-2">Your Saga</h1>
          <p className="text-sm opacity-70">
            Could not load the ledger right now. Try again later.
          </p>
        </div>
      </div>
    );
  }

  const entries = query.data?.entries ?? [];
  const worldStanding = query.data?.worldStanding ?? [];

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        <header>
          <h1 className="text-2xl font-semibold">Your Saga</h1>
          <p className="text-sm opacity-70 mt-1">
            Every consequence you have left in the world, humanized from the
            ripple ledger. Read from newest to oldest.
          </p>
        </header>

        <section aria-labelledby="ledger-heading">
          <h2 id="ledger-heading" className="text-lg font-medium mb-3">
            Consequences ({entries.length})
          </h2>
          {entries.length === 0 ? (
            <p className="text-sm opacity-70">
              Nothing has rippled out yet. Make a choice, and the saga starts
              writing itself here.
            </p>
          ) : (
            <ol className="space-y-6">
              {grouped.map(({ day, items }) => (
                <li key={day}>
                  <div className="text-xs uppercase tracking-wide opacity-60 mb-2">
                    {day}
                  </div>
                  <ul className="space-y-2">
                    {items.map((e, i) => (
                      <li
                        key={`${day}-${i}`}
                        className="flex items-baseline gap-3"
                      >
                        <span className="text-xs opacity-50 shrink-0 w-20">
                          {formatWhen(e.at)}
                        </span>
                        <span className="text-sm">{e.line}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section aria-labelledby="standing-heading">
          <h2 id="standing-heading" className="text-lg font-medium mb-3">
            How the world regards you ({worldStanding.length})
          </h2>
          {worldStanding.length === 0 ? (
            <p className="text-sm opacity-70">
              No factions have rendered a public verdict on you yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {worldStanding.map((s) => (
                <li
                  key={`${s.flag}-${s.since}`}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="text-sm">{s.label}</span>
                  <span className="text-xs opacity-50 shrink-0">
                    since {formatWhen(s.since)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
