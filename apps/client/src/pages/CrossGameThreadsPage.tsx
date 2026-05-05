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
  loredex: "void-text-energy",
  cades_fps: "void-text-accent",
  dead_mans_circuit: "void-text-system",
};

function ThreadCard({ threadId }: { threadId: string }) {
  const { data, isLoading, error } = trpc.crossGameThreads.status.useQuery({
    threadId,
  });

  if (isLoading) {
    return (
      <div className="rounded border void-border void-bg-canvas p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider void-text">
          loading {threadId}…
        </p>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="rounded border void-border-error void-bg-error p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider void-text-error">
          status unavailable
        </p>
        <p className="mt-1 text-[12px] void-text-error">
          {error?.message ?? "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded border p-4 transition-colors ${
        data.complete
          ? "void-border-success void-bg-success"
          : "void-border void-bg-canvas"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text">
            Thread · originates in{" "}
            <span className={GAME_ACCENT[data.originGame] ?? "void-text"}>
              {GAME_LABEL[data.originGame] ?? data.originGame}
            </span>
          </p>
          <h3 className="mt-1 font-display text-base void-text">
            {data.title}
          </h3>
        </div>
        <div className="text-right font-mono text-[11px] void-text">
          {data.totalEmitted}/{data.totalBeats}
          {data.complete && (
            <span className="ml-2 void-text-energy">complete</span>
          )}
        </div>
      </div>

      <p className="mt-2 font-mono text-[9px] uppercase tracking-wider void-text">
        Participates in:{" "}
        {data.participatingGames
          .map((g) => GAME_LABEL[g] ?? g)
          .join(" · ")}
      </p>

      <ol className="mt-3 space-y-2">
        {data.beats.map((b) => (
          <li
            key={b.id}
            className="flex items-start gap-2 rounded border void-border void-bg-canvas px-3 py-2"
          >
            <div className="mt-0.5 shrink-0">
              {b.emitted ? (
                <CheckCircle2 size={14} className="void-text-energy" />
              ) : (
                <Circle size={14} className="void-text" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-serif text-[13px] void-text">
                  {b.label}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-wider void-text">
                  emitted by{" "}
                  <span className={GAME_ACCENT[b.emittedBy] ?? "void-text"}>
                    {GAME_LABEL[b.emittedBy] ?? b.emittedBy}
                  </span>
                </p>
              </div>
              <p className="mt-0.5 font-mono text-[10px] void-text">
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
    <div className="min-h-screen void-bg-canvas void-text">
      <header className="border-b void-border void-bg-canvas px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <Link
            to="/witnessing"
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] void-text-dim void-text"
          >
            <ChevronLeft size={14} />
            Back to Witnessing
          </Link>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text">
              Transmedia · Cross-Game Threads
            </p>
            <p className="mt-1 font-serif text-lg italic void-text">
              What the other games are reading
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        <p className="font-serif italic text-[13px] leading-relaxed void-text-dim">
          Events you trigger in this Ark are read by the other games in
          the Saga — Cades FPS and Dead Man's Circuit. Below are the
          threads currently in motion. A check means the beat has
          fired; an empty circle means the next move is in another
          room.
        </p>

        {isLoading && (
          <p className="font-mono text-[11px] void-text">
            loading thread registry…
          </p>
        )}

        {error && (
          <div className="rounded border void-border-error void-bg-error p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider void-text-error">
              registry unavailable
            </p>
            <p className="mt-1 text-[12px] void-text-error">
              {error.message}
            </p>
          </div>
        )}

        {threads &&
          threads.map((t) => <ThreadCard key={t.id} threadId={t.id} />)}

        <div className="rounded border void-border void-bg-canvas p-4">
          <div className="flex items-start gap-2">
            <ExternalLink size={14} className="mt-1 shrink-0 void-text" />
            <p className="font-serif text-[12px] italic void-text">
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
