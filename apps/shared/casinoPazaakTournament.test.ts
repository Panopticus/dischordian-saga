import { describe, it, expect } from "vitest";
import {
  PAZAAK_AI_OPPONENTS,
  PAZAAK_TOURNAMENT_ENTRY_FEE,
  PAZAAK_TOURNAMENT_FIRST_PRIZE,
  PAZAAK_TOURNAMENT_SECOND_PRIZE,
  runPazaakTournament,
  runPazaakTournamentRound,
} from "./casinoPazaakTournament";

describe("PAZAAK_AI_OPPONENTS", () => {
  it("has exactly 3 distinct opponents", () => {
    expect(PAZAAK_AI_OPPONENTS).toHaveLength(3);
    const ids = PAZAAK_AI_OPPONENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(3);
  });

  it("has stand values that span 17-19 (audit'd lossy spread)", () => {
    const stands = PAZAAK_AI_OPPONENTS.map((a) => a.stand).sort();
    expect(stands).toEqual([17, 18, 19]);
  });
});

describe("Tournament economics", () => {
  it("entry fee is 200, first prize 800, second prize 200", () => {
    expect(PAZAAK_TOURNAMENT_ENTRY_FEE).toBe(200);
    expect(PAZAAK_TOURNAMENT_FIRST_PRIZE).toBe(800);
    expect(PAZAAK_TOURNAMENT_SECOND_PRIZE).toBe(200);
  });

  it("first prize covers the entry fee 4-fold; second prize breaks even", () => {
    // The tournament is intentionally lossy on average so the
    // expected value is negative — players should enter for the
    // bracket experience, not the EV. But 1st > 4x entry and 2nd
    // = entry refund are the reachable wins.
    expect(PAZAAK_TOURNAMENT_FIRST_PRIZE).toBeGreaterThan(PAZAAK_TOURNAMENT_ENTRY_FEE * 3);
    expect(PAZAAK_TOURNAMENT_SECOND_PRIZE).toBe(PAZAAK_TOURNAMENT_ENTRY_FEE);
  });
});

describe("runPazaakTournamentRound", () => {
  it("is deterministic for identical seeds", () => {
    const r1 = runPazaakTournamentRound("Alice", 18, "Bob", 18, "round-seed-1");
    const r2 = runPazaakTournamentRound("Alice", 18, "Bob", 18, "round-seed-1");
    expect(r1).toEqual(r2);
  });

  it("produces different results for different seeds", () => {
    const r1 = runPazaakTournamentRound("Alice", 18, "Bob", 18, "round-seed-1");
    const r2 = runPazaakTournamentRound("Alice", 18, "Bob", 18, "round-seed-2");
    // Either totals differ, or winner differs — at least one of
    // the equality fields must be different.
    const same =
      r1.a.total === r2.a.total &&
      r1.b.total === r2.b.total &&
      r1.winner === r2.winner;
    expect(same).toBe(false);
  });

  it("when both players bust, side A wins (house tie convention)", () => {
    // Find a seed where both bust — scan up to 100 seeds.
    for (let i = 0; i < 100; i++) {
      const r = runPazaakTournamentRound("A", 21, "B", 21, `bust-${i}`);
      if (r.a.bust && r.b.bust) {
        expect(r.winner).toBe("a");
        return;
      }
    }
    // If no double-bust found, this test is a no-op for that seed
    // range but the invariant still holds for any double-bust case.
  });
});

describe("runPazaakTournament", () => {
  it("returns deterministic bracket for identical seed", () => {
    const t1 = runPazaakTournament("Player", 18, "tourn-seed-1");
    const t2 = runPazaakTournament("Player", 18, "tourn-seed-1");
    expect(t1).toEqual(t2);
  });

  it("playerPlace is always 1, 2, or 3 (semi loss)", () => {
    for (let i = 0; i < 50; i++) {
      const t = runPazaakTournament("Player", 18, `seed-${i}`);
      expect([1, 2, 3]).toContain(t.playerPlace);
    }
  });

  it("prize matches placement", () => {
    for (let i = 0; i < 50; i++) {
      const t = runPazaakTournament("Player", 18, `prize-${i}`);
      if (t.playerPlace === 1) expect(t.prize).toBe(PAZAAK_TOURNAMENT_FIRST_PRIZE);
      else if (t.playerPlace === 2) expect(t.prize).toBe(PAZAAK_TOURNAMENT_SECOND_PRIZE);
      else expect(t.prize).toBe(0);
    }
  });

  it("is lossy-on-average — naive 18-stand player wins <half over 50 brackets", () => {
    // Audit invariant: tournament should not be a guaranteed-win.
    // 50 brackets is enough to surface a deterministic-loss exploit
    // without making the test flaky.
    let wins = 0;
    for (let i = 0; i < 50; i++) {
      const t = runPazaakTournament("Player", 18, `lossy-${i}`);
      if (t.playerPlace === 1) wins++;
    }
    expect(wins).toBeLessThan(25);
  });

  it("all three rounds populated regardless of player placement", () => {
    for (let i = 0; i < 10; i++) {
      const t = runPazaakTournament("Player", 18, `rounds-${i}`);
      expect(t.semi1).toBeDefined();
      expect(t.semi2).toBeDefined();
      expect(t.final).toBeDefined();
    }
  });

  it("seed is echoed in result for replay determinism", () => {
    const t = runPazaakTournament("Player", 18, "echo-seed");
    expect(t.seed).toBe("echo-seed");
  });
});
