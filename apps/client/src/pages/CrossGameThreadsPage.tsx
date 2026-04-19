/* ═══════════════════════════════════════════════════════
   CROSS-GAME THREADS PAGE — player-facing thread browser

   Read-only view over the cross-game thread state. Shows:

     - Every registered thread (via crossGameThreads.listThreads)
     - For each thread, beat-by-beat progress (via .status)
     - Which game emits each beat
     - Whether the beat has fired for this player

   Useful for the player to see what's pending across the
   transmedia project — "I'm waiting on Cades to read the
   memorial" — without opening every game in turn.

   Routed at /cross-game-threads. Linked from the Witnessing
   Hub once the player has reached at least Act 5 (which is
   when the first cross-game beat — Iron Lion expulsion —
   becomes meaningful).
   ═══════════════════════════════════════════════════════ */

import { Link } from "wouter";
import { ChevronLeft, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";

const GAME_LABEL: Record<string, string> = {
  loredex: "Loredex OS",
  cades_fps: "Cades FPS",
  dead_mans_circuit: "Dead Man's Circuit",
};

const GAME_ACCENT: Record<string, string> = {
  loredex: "text-cyan-300",
  cades_fps: "text-amber-300",
  dead_mans_circuit: "text-purple-300",
};

function ThreadCard({ threadId }: { threadId: string }) {
  const { data, isLoading, error } = trpc.crossGameThreads.status.useQuery({
    threadId,
  });

  if (isLoading) {
    return (
      <div className="rounded border border-stone-700 bg-stone-900/40 p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
          loading {threadId}…
        </p>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="rounded border border-rose-500/40 bg-rose-950/20 p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-rose-300/80">
          status unavailable
        </p>
        <p className="mt-1 text-[12px] text-rose-200">
          {error?.message ?? "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded border p-4 transition-colors ${
        data.complete
          ? "border-emerald-500/40 bg-emerald-950/15"
          : "border-stone-700 bg-stone-900/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-400">
            Thread · originates in{" "}
            <span className={GAME_ACCENT[data.originGame] ?? "text-stone-300"}>
              {GAME_LABEL[data.originGame] ?? data.originGame}
            </span>
          </p>
          <h3 className="mt-1 font-display text-base text-stone-100">
            {data.title}
          </h3>
        </div>
        <div className="text-right font-mono text-[11px] text-stone-300">
          {data.totalEmitted}/{data.totalBeats}
          {data.complete && (
            <span className="ml-2 text-emerald-300">complete</span>
          )}
        </div>
      </div>

      <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-stone-500">
        Participates in:{" "}
        {data.participatingGames
          .map((g) => GAME_LABEL[g] ?? g)
          .join(" · ")}
      </p>

      <ol className="mt-3 space-y-2">
        {data.beats.map((b) => (
          <li
            key={b.id}
            className="flex items-start gap-2 rounded border border-stone-800/60 bg-stone-950/40 px-3 py-2"
          >
            <div className="mt-0.5 shrink-0">
              {b.emitted ? (
                <CheckCircle2 size={14} className="text-emerald-400/90" />
              ) : (
                <Circle size={14} className="text-stone-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-serif text-[13px] text-stone-100">
                  {b.label}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-wider text-stone-500">
                  emitted by{" "}
                  <span className={GAME_ACCENT[b.emittedBy] ?? "text-stone-400"}>
                    {GAME_LABEL[b.emittedBy] ?? b.emittedBy}
                  </span>
                </p>
              </div>
              <p className="mt-0.5 font-mono text-[10px] text-stone-500">
                beat id: {b.id} · order: {b.order}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function CrossGameThreadsPage() {
  const { data: threads, isLoading, error } =
    trpc.crossGameThreads.listThreads.useQuery();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="border-b border-stone-700 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <Link
            to="/witnessing"
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-300/80 hover:text-stone-100"
          >
            <ChevronLeft size={14} />
            Back to Witnessing
          </Link>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400">
              Transmedia · Cross-Game Threads
            </p>
            <p className="mt-1 font-serif text-lg italic text-stone-50">
              What the other games are reading
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        <p className="font-serif italic text-[13px] leading-relaxed text-stone-200/80">
          Events you trigger in this Ark are read by the other games in
          the Saga — Cades FPS and Dead Man's Circuit. Below are the
          threads currently in motion. A check means the beat has
          fired; an empty circle means the next move is in another
          room.
        </p>

        {isLoading && (
          <p className="font-mono text-[11px] text-stone-400">
            loading thread registry…
          </p>
        )}

        {error && (
          <div className="rounded border border-rose-500/40 bg-rose-950/20 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-rose-300/80">
              registry unavailable
            </p>
            <p className="mt-1 text-[12px] text-rose-200">
              {error.message}
            </p>
          </div>
        )}

        {threads &&
          threads.map((t) => <ThreadCard key={t.id} threadId={t.id} />)}

        <div className="rounded border border-stone-700 bg-stone-900/30 p-4">
          <div className="flex items-start gap-2">
            <ExternalLink size={14} className="mt-1 shrink-0 text-stone-500" />
            <p className="font-serif text-[12px] italic text-stone-400">
              Beats waiting on Cades FPS or Dead Man's Circuit will fire
              when the relevant moments happen in those games. The Ark
              listens; the other games speak.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
