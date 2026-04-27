/**
 * ReplayViewerPage — /replay/:token
 *
 * Final piece of the replay-sharing surface (#6 / #46). Loads a
 * replay by its unguessable share-token (no auth required), runs the
 * persisted action log through the deterministic reducer via the
 * pre-existing `replayMatch()` helper, and surfaces a step-by-step
 * scrubber on top of the per-step state.
 *
 * The board itself is rendered as a textual state summary rather
 * than the full Pixi board. That's deliberate — the full visual
 * replay needs the live board renderer, which carries Pixi setup
 * + sprite asset loading and is the kind of thing that should live
 * in its own follow-up. This page is the *marketing landing page*
 * the AAA review called out at #46: a non-logged-in viewer
 * following a share-link lands on a real, scrubable replay rather
 * than a dead 404 or a "log in to view" wall.
 *
 * The replay viewer reducer (`replayViewerReducer` from
 * apps/shared/tcg-core/replay/viewer.ts) is already built and
 * already tested by the engine — this page just wires it to a
 * React useReducer and a few buttons.
 */
import { useEffect, useMemo, useReducer } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  replayMatch,
  replayViewerReducer,
  type ReplayInput,
  type ReplayResult,
  type ReplayViewerState,
} from "@shared/tcg-core";
import { clientRegistry } from "@/game/duelyst/TcgClient";

/** Build the engine ReplayInput from the persisted gameReplays row.
 *  Returns null if the row is missing fields the engine needs (legacy
 *  rows produced before the matchId / seed columns landed). */
function buildReplayInput(row: ReplayRow): ReplayInput | null {
  if (!row.matchId || !row.seed || !row.rulesVersion) return null;
  if (!row.p1Config || !row.p2Config) return null;

  let actions: unknown[];
  try {
    const parsed = JSON.parse(row.moveData);
    if (!Array.isArray(parsed)) return null;
    actions = parsed;
  } catch {
    return null;
  }

  // p1Config / p2Config are stored as raw JSON; the producer writes
  // { faction, deckCardIds }. The engine wants a real MatchConfig with
  // userId + generalDefId + deckCardDefIds. We rebuild the minimal
  // shape the engine accepts; the verifier in
  // apps/server/services/replayVerification.ts uses the same coercion
  // (via buildMatchConfig). Mirroring it on the client keeps the
  // viewer offline-renderable from the row alone.
  const p1Config = coercePlayerConfig(row.p1Config, row.player1Id);
  const p2Config = coercePlayerConfig(row.p2Config, row.player2Id ?? 0);
  if (!p1Config || !p2Config) return null;

  return {
    matchId: row.matchId,
    seed: row.seed,
    rulesVersion: row.rulesVersion,
    actions: actions as ReplayInput["actions"],
    p1Config,
    p2Config,
    registry: clientRegistry,
  };
}

/** Local, structural subset of the `gameReplays` row that the viewer
 *  reads. Cast through `unknown` at the call site because the
 *  on-the-wire row type evolves alongside the schema (matchId, seed,
 *  rulesVersion, etc. land in separate migrations) and the viewer is
 *  defensive against any of them being absent — `buildReplayInput`
 *  returns `null` and the page shows the "step viewer unavailable"
 *  fallback rather than throwing. */
interface ReplayRow {
  matchId: string | null;
  seed: string | null;
  rulesVersion: string | null;
  moveData: string;
  finalStateHash: string | null;
  p1Config: Record<string, unknown> | null;
  p2Config: Record<string, unknown> | null;
  player1Id: number;
  player1Name: string;
  player2Id: number | null;
  player2Name: string | null;
  winnerId: number | null;
  totalMoves: number;
  duration: number;
  gameType: string;
  shareToken: string | null;
  playedAt: Date | string;
}

function coercePlayerConfig(
  raw: Record<string, unknown>,
  userId: number,
): ReplayInput["p1Config"] | null {
  const faction = raw.faction;
  const deckCardIds = raw.deckCardIds;
  if (typeof faction !== "string") return null;
  if (!Array.isArray(deckCardIds)) return null;
  if (!deckCardIds.every((c) => typeof c === "string")) return null;
  // PlayerId is a branded type — the engine itself does the cast
  // when it ingests configs from JSON (the live server does the same
  // via buildMatchConfig). Cast through `unknown` to satisfy strict
  // TS without leaking the brand into shared types.
  return {
    userId,
    faction,
    generalDefId: `gen_${faction}`,
    deckCardDefIds: deckCardIds as string[],
  } as unknown as ReplayInput["p1Config"];
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}m ${sec.toString().padStart(2, "0")}s`;
}

export default function ReplayViewerPage() {
  const [, params] = useRoute("/replay/:token");
  const token = params?.token;

  const { data, isLoading, error } = trpc.replay.getReplayByToken.useQuery(
    { shareToken: token ?? "" },
    { enabled: !!token, refetchOnWindowFocus: false, retry: false },
  );

  // Memoize the engine replay computation. Re-running through the
  // reducer is deterministic but not free for long matches, and the
  // viewer state below depends on this result by reference identity
  // — recomputing on every render would reset the scrubber.
  const computed = useMemo<
    | { kind: "ok"; replay: ReplayResult }
    | { kind: "incomplete"; reason: string }
    | null
  >(() => {
    if (!data) return null;
    const input = buildReplayInput(data as unknown as ReplayRow);
    if (!input) {
      return {
        kind: "incomplete",
        reason:
          "This replay was recorded before the match-reconstruction columns " +
          "(matchId / seed / rulesVersion / per-player config) landed. " +
          "Metadata below is still authoritative; the step-by-step viewer " +
          "is unavailable for legacy rows.",
      };
    }
    try {
      return { kind: "ok", replay: replayMatch(input) };
    } catch (err) {
      return {
        kind: "incomplete",
        reason: `Engine threw during replay: ${
          err instanceof Error ? err.message : String(err)
        }`,
      };
    }
  }, [data]);

  if (!token) {
    return <FallbackShell title="Missing share token in URL." />;
  }
  if (isLoading) {
    return <FallbackShell title="Loading replay…" />;
  }
  if (error) {
    return (
      <FallbackShell
        title="Couldn't load this replay."
        detail={error.message}
      />
    );
  }
  if (!data) {
    return (
      <FallbackShell
        title="Replay not found."
        detail="The share-link may have been mistyped or the replay was deleted."
      />
    );
  }

  const row = data as unknown as ReplayRow;

  return (
    <main className="mx-auto max-w-4xl p-6 text-foreground">
      <header className="mb-6">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Bridge
        </Link>
        <h1 className="mt-2 font-display text-2xl tracking-wide">
          Replay — {row.player1Name} vs {row.player2Name ?? "—"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {row.gameType} · {row.totalMoves} actions ·{" "}
          {formatDuration(row.duration)}
        </p>
      </header>

      <ReplayMetadata row={row} />

      {computed?.kind === "ok" && (
        <ReplayScrubber result={computed.replay} />
      )}
      {computed?.kind === "incomplete" && (
        <section
          className="mt-6 rounded border border-border/40 bg-card/30 p-4 text-sm text-muted-foreground"
          aria-live="polite"
        >
          <strong className="text-foreground">Step viewer unavailable.</strong>{" "}
          {computed.reason}
        </section>
      )}
    </main>
  );
}

function ReplayMetadata({ row }: { row: ReplayRow }) {
  const winnerName =
    row.winnerId === row.player1Id
      ? row.player1Name
      : row.winnerId === row.player2Id
      ? row.player2Name
      : null;

  return (
    <section className="grid grid-cols-2 gap-x-6 gap-y-2 rounded border border-border/40 bg-card/30 p-4 text-sm">
      <DefRow label="Winner" value={winnerName ?? "Draw"} />
      <DefRow label="Played" value={new Date(row.playedAt).toLocaleString()} />
      <DefRow label="Final-state hash" value={row.finalStateHash ?? "—"} mono />
      <DefRow label="Engine version" value={row.rulesVersion ?? "—"} mono />
      <DefRow label="Match seed" value={row.seed ?? "—"} mono />
      <DefRow label="Share token" value={row.shareToken ?? "—"} mono />
    </section>
  );
}

function DefRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
        {label}
      </dt>
      <dd className={mono ? "font-mono text-xs" : "text-sm"}>{value}</dd>
    </div>
  );
}

function ReplayScrubber({ result }: { result: ReplayResult }) {
  const total = result.steps.length;
  const initial: ReplayViewerState = {
    replay: result,
    currentStep: 0,
    playing: false,
    speed: 1,
    spectatorMode: false,
  };
  const [state, dispatch] = useReducer(replayViewerReducer, initial);

  // Auto-play loop. Advances one step every (1000 / speed)ms while
  // `playing` is true; pauses naturally at end-of-replay.
  useEffect(() => {
    if (!state.playing) return;
    if (state.currentStep >= total) {
      dispatch({ kind: "pause" });
      return;
    }
    const timer = setTimeout(() => {
      dispatch({ kind: "step_forward" });
    }, 1000 / state.speed);
    return () => clearTimeout(timer);
  }, [state.playing, state.currentStep, state.speed, total]);

  const currentAction =
    state.currentStep > 0 ? state.replay.steps[state.currentStep - 1] : null;

  return (
    <section
      className="mt-6 rounded border border-border/40 bg-card/30 p-4"
      aria-label="Replay scrubber"
    >
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-mono">
          step {state.currentStep} / {total}
        </span>
        <span className="text-muted-foreground">
          {result.versionCompatible
            ? `engine ${result.errorCount} errors`
            : "ENGINE VERSION MISMATCH"}
        </span>
      </div>

      <div className="mb-3 h-1 overflow-hidden rounded-full bg-muted/15">
        <div
          className="h-full bg-foreground/60 transition-all"
          style={{
            width: total === 0 ? "0%" : `${(state.currentStep / total) * 100}%`,
          }}
        />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch({ kind: "jump_to_start" })}
          className="rounded border border-border/40 px-3 py-1 text-xs hover:bg-muted/15"
        >
          ⏮ Start
        </button>
        <button
          type="button"
          onClick={() => dispatch({ kind: "step_backward" })}
          disabled={state.currentStep === 0}
          className="rounded border border-border/40 px-3 py-1 text-xs hover:bg-muted/15 disabled:opacity-40"
        >
          ◀ Step
        </button>
        {state.playing ? (
          <button
            type="button"
            onClick={() => dispatch({ kind: "pause" })}
            className="rounded border border-border/40 px-3 py-1 text-xs hover:bg-muted/15"
          >
            ⏸ Pause
          </button>
        ) : (
          <button
            type="button"
            onClick={() => dispatch({ kind: "play" })}
            disabled={state.currentStep >= total}
            className="rounded border border-border/40 px-3 py-1 text-xs hover:bg-muted/15 disabled:opacity-40"
          >
            ▶ Play
          </button>
        )}
        <button
          type="button"
          onClick={() => dispatch({ kind: "step_forward" })}
          disabled={state.currentStep >= total}
          className="rounded border border-border/40 px-3 py-1 text-xs hover:bg-muted/15 disabled:opacity-40"
        >
          Step ▶
        </button>
        <button
          type="button"
          onClick={() => dispatch({ kind: "jump_to_end" })}
          className="rounded border border-border/40 px-3 py-1 text-xs hover:bg-muted/15"
        >
          End ⏭
        </button>

        <span className="ml-auto flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          Speed
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => dispatch({ kind: "set_speed", speed: s })}
              className={`rounded border px-2 py-0.5 text-xs ${
                state.speed === s
                  ? "border-foreground bg-foreground/10"
                  : "border-border/40 hover:bg-muted/15"
              }`}
            >
              {s}×
            </button>
          ))}
        </span>
      </div>

      <pre
        className="max-h-48 overflow-auto rounded bg-background/60 p-3 font-mono text-[11px] text-muted-foreground"
        aria-label="Current action"
      >
        {currentAction
          ? JSON.stringify(currentAction.action, null, 2)
          : "// initial state — no action applied yet"}
      </pre>
    </section>
  );
}

function FallbackShell({ title, detail }: { title: string; detail?: string }) {
  return (
    <main className="mx-auto max-w-2xl p-6 text-center text-foreground">
      <h1 className="font-display text-xl tracking-wide">{title}</h1>
      {detail && (
        <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
      )}
      <Link
        href="/"
        className="mt-6 inline-block text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        ← Back to Bridge
      </Link>
    </main>
  );
}
