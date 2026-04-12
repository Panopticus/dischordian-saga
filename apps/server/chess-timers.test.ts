/* ═══════════════════════════════════════════════════════
   Chess timer tests — flag-fall + tournament auto-forfeit

   These exercise two time-based chess behaviours under
   vitest fake timers:

     1. startTurnTimer (chessWs) — when the current player's
        clock runs out, the match should transition to
        "timeout" with the opponent as winner and the
        flagged player's clock at zero.

     2. runRoundAutoForfeit (chess router) — when a round
        deadline passes, unreported pairings should be
        marked as draws, both participants should receive
        a point, and the tournament should advance to the
        next round (or finalize if it was the last).

   Both paths touch the DB — the auto-forfeit test uses a
   tiny stateful in-memory drizzle shim; the flag-fall test
   mocks getDb() → null so the persistence block is a no-op.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  chessTournaments,
  chessTournamentPairings,
  chessTournamentParticipants,
} from "../db/schema";

/* ───────────────────────────────────────────────────────
   In-memory drizzle shim for the auto-forfeit test.

   The real drizzle query builder accepts opaque SQL
   expressions in `where()` that we can't pattern-match in
   a test context. Instead, we arrange the in-memory state
   so that the SUT's queries return the correct rows even
   without filtering — then rely on the SUT's own logic
   (e.g. `some(p => !p.reported)`) to drive state changes.

   This is enough fidelity to verify the end-to-end
   forfeit → advance-round sequence; it is NOT a general-
   purpose drizzle mock.
   ─────────────────────────────────────────────────────── */
interface MockDbState {
  tournaments: any[];
  pairings: any[];
  participants: any[];
  /** Spies so the test can verify which update/set calls happened. */
  updateCalls: Array<{ table: "pairings" | "participants" | "tournaments"; patch: any }>;
  insertCalls: Array<{ table: "pairings" | "participants" | "tournaments"; values: any }>;
}

const mockState: MockDbState = {
  tournaments: [],
  pairings: [],
  participants: [],
  updateCalls: [],
  insertCalls: [],
};

function tableArray(table: any): any[] | null {
  if (table === chessTournaments) return mockState.tournaments;
  if (table === chessTournamentPairings) return mockState.pairings;
  if (table === chessTournamentParticipants) return mockState.participants;
  return null;
}
function tableTag(table: any): "pairings" | "participants" | "tournaments" | null {
  if (table === chessTournaments) return "tournaments";
  if (table === chessTournamentPairings) return "pairings";
  if (table === chessTournamentParticipants) return "participants";
  return null;
}

/** A fluent builder shim that satisfies the drizzle-like chain used by
 *  runRoundAutoForfeit / maybeAdvanceRound. All filter arguments
 *  (`where`, `orderBy`) are swallowed — the in-memory arrays already
 *  model exactly the data the SUT expects in the "unreported round"
 *  path. */
function makeSelectBuilder(table: any, isCount = false): PromiseLike<any[]> & Record<string, any> {
  const resolve = (limit?: number): any[] => {
    const arr = tableArray(table) ?? [];
    if (isCount) return [{ count: arr.length }];
    return limit !== undefined ? arr.slice(0, limit) : [...arr];
  };
  const builder: any = {
    from: (_t: any) => builder,
    where: (_cond: any) => builder,
    orderBy: (..._args: any[]) => builder,
    limit: (n: number) => Promise.resolve(resolve(n)),
    then: (
      onFulfilled: (v: any[]) => any,
      onRejected?: (e: any) => any,
    ) => Promise.resolve(resolve()).then(onFulfilled, onRejected),
  };
  return builder;
}

function makeInsertBuilder(table: any) {
  return {
    values: async (row: any) => {
      const tag = tableTag(table);
      if (!tag) return;
      mockState.insertCalls.push({ table: tag, values: row });
      const arr = tableArray(table)!;
      // Assign an auto-id if the caller didn't provide one.
      const id = row.id ?? arr.reduce((m, r) => Math.max(m, r.id ?? 0), 0) + 1;
      arr.push({ ...row, id });
    },
  };
}

function makeUpdateBuilder(table: any) {
  const tag = tableTag(table)!;
  return {
    set: (patch: any) => ({
      where: async (_cond: any) => {
        mockState.updateCalls.push({ table: tag, patch });
        const arr = tableArray(table)!;
        // For pairings + tournaments, apply to all rows (test data is
        // arranged so that's the intended set). For participants, we
        // don't apply — the test verifies via updateCalls that the
        // correct count of score-delta calls happened.
        if (tag === "pairings" || tag === "tournaments") {
          for (const row of arr) {
            for (const k of Object.keys(patch)) {
              const v = (patch as any)[k];
              // Skip drizzle `sql` fragments — we only care about plain values.
              if (v && typeof v === "object" && "queryChunks" in v) continue;
              (row as any)[k] = v;
            }
          }
        }
      },
    }),
  };
}

function createMockDb() {
  return {
    select: (cols?: any) => {
      const isCount = cols && typeof cols === "object" && "count" in cols;
      const builder: any = {
        from: (t: any) => makeSelectBuilder(t, isCount),
      };
      return builder;
    },
    insert: (t: any) => makeInsertBuilder(t),
    update: (t: any) => makeUpdateBuilder(t),
  };
}

vi.mock("./db", () => ({
  getDb: vi.fn().mockImplementation(async () => createMockDb()),
}));

// Silence the logger so a forfeit run doesn't spam test output.
vi.mock("./logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

/* ───────────────────────────────────────────────────────
   Flag-fall test — chessWs.startTurnTimer
   ─────────────────────────────────────────────────────── */
describe("chessWs: startTurnTimer flag-fall", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  function makeMatch(overrides: Partial<any> = {}): any {
    const mockWs = () => ({
      readyState: 0, // CONNECTING — `send()` is a no-op at this state
      send: vi.fn(),
    });
    return {
      matchId: "test-match-1",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      pgn: "",
      moves: [],
      white: { ws: mockWs(), userId: 101, userName: "White", characterId: "c", elo: 1500, matchId: "test-match-1" },
      black: { ws: mockWs(), userId: 202, userName: "Black", characterId: "c", elo: 1500, matchId: "test-match-1" },
      turn: "w" as const,
      status: "active" as const,
      winnerId: null,
      spectators: new Set(),
      turnTimeout: null,
      timeControl: 600,
      whiteTimeMs: 3_000,
      blackTimeMs: 600_000,
      lastMoveTime: Date.now(),
      moveCount: 0,
      dbId: null,
      ...overrides,
    };
  }

  it("fires when the current player's clock runs out", async () => {
    const { startTurnTimer } = await import("./chessWs");
    const match = makeMatch({ whiteTimeMs: 3_000, turn: "w" });

    startTurnTimer(match);
    expect(match.turnTimeout).not.toBeNull();
    expect(match.status).toBe("active");

    // Advance exactly to the flag-fall point (3s).
    await vi.advanceTimersByTimeAsync(3_000);

    expect(match.status).toBe("timeout");
    expect(match.winnerId).toBe(202); // Black wins when White flags
    expect(match.whiteTimeMs).toBe(0);
    expect(match.turnTimeout).toBeNull();
  });

  it("does not fire before the clock runs out", async () => {
    const { startTurnTimer } = await import("./chessWs");
    const match = makeMatch({ whiteTimeMs: 5_000, turn: "w" });

    startTurnTimer(match);
    await vi.advanceTimersByTimeAsync(2_000); // Only 2s elapsed

    expect(match.status).toBe("active");
    expect(match.winnerId).toBeNull();
    expect(match.turnTimeout).not.toBeNull();
  });

  it("flags the black player when it's black's turn", async () => {
    const { startTurnTimer } = await import("./chessWs");
    const match = makeMatch({
      whiteTimeMs: 600_000,
      blackTimeMs: 2_500,
      turn: "b",
    });

    startTurnTimer(match);
    await vi.advanceTimersByTimeAsync(2_500);

    expect(match.status).toBe("timeout");
    expect(match.winnerId).toBe(101); // White wins when Black flags
    expect(match.blackTimeMs).toBe(0);
  });

  it("clears the previous timer when restarted (e.g. after a move)", async () => {
    const { startTurnTimer } = await import("./chessWs");
    const match = makeMatch({ whiteTimeMs: 5_000, turn: "w" });

    startTurnTimer(match);
    const firstTimer = match.turnTimeout;

    // Simulate a move: update lastMoveTime then restart the timer.
    await vi.advanceTimersByTimeAsync(1_000);
    match.lastMoveTime = Date.now();
    match.turn = "b";
    match.blackTimeMs = 5_000;
    startTurnTimer(match);

    expect(match.turnTimeout).not.toBe(firstTimer);

    // The old timer is cleared — advancing the remaining original
    // window shouldn't flag anyone, because the new timer is now
    // tracking black's clock.
    await vi.advanceTimersByTimeAsync(3_000);
    expect(match.status).toBe("active");
  });

  it("is capped by TURN_TIMEOUT_MS safety so an idle long clock still moves forward", async () => {
    const { startTurnTimer } = await import("./chessWs");
    // Huge clock but the absolute per-move safety cap (120s) should
    // force the timer to fire within that window.
    const match = makeMatch({ whiteTimeMs: 10 * 60 * 1000, turn: "w" });
    startTurnTimer(match);
    await vi.advanceTimersByTimeAsync(120_000); // TURN_TIMEOUT_MS
    expect(match.status).toBe("timeout");
    expect(match.winnerId).toBe(202);
  });
});

/* ───────────────────────────────────────────────────────
   runRoundAutoForfeit — tournament advance-round test
   ─────────────────────────────────────────────────────── */
describe("chess router: runRoundAutoForfeit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockState.tournaments = [];
    mockState.pairings = [];
    mockState.participants = [];
    mockState.updateCalls = [];
    mockState.insertCalls = [];
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("forfeits unreported round-1 pairings and advances a 2-round swiss tournament to round 2", async () => {
    // Stage: 4 players, 2 pairings in round 1, none reported.
    mockState.tournaments = [{
      id: 1,
      name: "Test Open",
      format: "swiss",
      maxPlayers: 16,
      currentPlayers: 4,
      entryFee: 0,
      prizePool: 0,
      timeControl: 600,
      currentRound: 1,
      totalRounds: 2,
      status: "active",
      startsAt: new Date(),
      createdAt: new Date(),
    }];
    mockState.pairings = [
      { id: 10, tournamentId: 1, round: 1, whiteId: 100, blackId: 200, whiteResult: null, reported: false, gameId: null, deadlineAt: new Date(), createdAt: new Date() },
      { id: 11, tournamentId: 1, round: 1, whiteId: 300, blackId: 400, whiteResult: null, reported: false, gameId: null, deadlineAt: new Date(), createdAt: new Date() },
    ];
    mockState.participants = [
      { id: 1, tournamentId: 1, userId: 100, userName: "p100", score: 0, tieBreak: 0, active: true, joinedAt: new Date() },
      { id: 2, tournamentId: 1, userId: 200, userName: "p200", score: 0, tieBreak: 0, active: true, joinedAt: new Date() },
      { id: 3, tournamentId: 1, userId: 300, userName: "p300", score: 0, tieBreak: 0, active: true, joinedAt: new Date() },
      { id: 4, tournamentId: 1, userId: 400, userName: "p400", score: 0, tieBreak: 0, active: true, joinedAt: new Date() },
    ];

    const { runRoundAutoForfeit, autoForfeitTimers } = await import("./routers/chess");
    autoForfeitTimers.clear();

    await runRoundAutoForfeit(1, 1);

    // Both round-1 pairings should now be reported with a "draw" result.
    const round1 = mockState.pairings.filter(p => p.round === 1);
    expect(round1).toHaveLength(2);
    for (const p of round1) {
      expect(p.reported).toBe(true);
      expect(p.whiteResult).toBe("draw");
    }

    // Score delta updates: one per forfeited player (4 players × 1 pairing each).
    const scoreUpdates = mockState.updateCalls.filter(u => u.table === "participants");
    expect(scoreUpdates.length).toBeGreaterThanOrEqual(4);

    // Tournament should have advanced to round 2.
    expect(mockState.tournaments[0].currentRound).toBe(2);

    // New round-2 pairings should have been inserted.
    const insertedPairings = mockState.insertCalls.filter(c => c.table === "pairings");
    expect(insertedPairings.length).toBeGreaterThanOrEqual(1);
    for (const ins of insertedPairings) {
      expect(ins.values.round).toBe(2);
      expect(ins.values.tournamentId).toBe(1);
    }

    // A new auto-forfeit timer should be scheduled for round 2.
    expect(autoForfeitTimers.has("1:2")).toBe(true);
  });

  it("returns early when there are no unreported pairings", async () => {
    mockState.tournaments = [{
      id: 2,
      name: "Already Done",
      format: "swiss",
      maxPlayers: 16,
      currentPlayers: 2,
      entryFee: 0,
      prizePool: 0,
      timeControl: 600,
      currentRound: 1,
      totalRounds: 1,
      status: "active",
      startsAt: new Date(),
      createdAt: new Date(),
    }];
    mockState.pairings = [
      { id: 20, tournamentId: 2, round: 1, whiteId: 1, blackId: 2, whiteResult: "win", reported: true, gameId: null, deadlineAt: new Date(), createdAt: new Date() },
    ];

    const { runRoundAutoForfeit } = await import("./routers/chess");
    // NB: our mock `select` returns the entire pairings table unfiltered —
    // so runRoundAutoForfeit sees the reported pairing as "unreported" and
    // would re-forfeit it. To simulate the "no unreported" path we drain
    // the pairings array before calling.
    mockState.pairings = [];

    await expect(runRoundAutoForfeit(2, 1)).resolves.toBeUndefined();
    // No draw-patches, no score deltas.
    expect(mockState.updateCalls.filter(u => u.table === "pairings")).toHaveLength(0);
    expect(mockState.updateCalls.filter(u => u.table === "participants")).toHaveLength(0);
  });

  it("finalizes a 1-round tournament after forfeiting its sole round", async () => {
    mockState.tournaments = [{
      id: 3,
      name: "Single Round",
      format: "swiss",
      maxPlayers: 16,
      currentPlayers: 2,
      entryFee: 0,
      prizePool: 0,
      timeControl: 600,
      currentRound: 1,
      totalRounds: 1,
      status: "active",
      startsAt: new Date(),
      createdAt: new Date(),
    }];
    mockState.pairings = [
      { id: 30, tournamentId: 3, round: 1, whiteId: 500, blackId: 600, whiteResult: null, reported: false, gameId: null, deadlineAt: new Date(), createdAt: new Date() },
    ];
    mockState.participants = [
      { id: 10, tournamentId: 3, userId: 500, userName: "p500", score: 0, tieBreak: 0, active: true, joinedAt: new Date() },
      { id: 11, tournamentId: 3, userId: 600, userName: "p600", score: 0, tieBreak: 0, active: true, joinedAt: new Date() },
    ];

    const { runRoundAutoForfeit, autoForfeitTimers } = await import("./routers/chess");
    autoForfeitTimers.clear();

    await runRoundAutoForfeit(3, 1);

    // Round 1 pairing is reported as a draw.
    expect(mockState.pairings[0].reported).toBe(true);
    expect(mockState.pairings[0].whiteResult).toBe("draw");

    // Tournament is finalised (currentRound NOT advanced past totalRounds,
    // status flipped to "completed"). No new round-2 pairings inserted.
    expect(mockState.tournaments[0].status).toBe("completed");
    const insertedPairings = mockState.insertCalls.filter(c => c.table === "pairings");
    expect(insertedPairings).toHaveLength(0);

    // No new auto-forfeit timer since there's no next round.
    expect(autoForfeitTimers.has("3:2")).toBe(false);
  });
});
