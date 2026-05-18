import { describe, it, expect } from "vitest";
import { consumeDailyXpCap, utcDayKey } from "./battlePassConfig";

describe("consumeDailyXpCap (Balance F2 durable daily cap)", () => {
  const DAY = "2026-05-17";

  it("allows awards up to the cap, then blocks", () => {
    let ledger: Record<string, Record<string, number>> | undefined;
    // dailyCap of 3 → 3 allowed, 4th blocked.
    for (let i = 1; i <= 3; i++) {
      const r = consumeDailyXpCap(ledger, DAY, "daily_quest", 3);
      expect(r.allowed, `award ${i} should be allowed`).toBe(true);
      ledger = r.ledger;
      expect(ledger[DAY].daily_quest).toBe(i);
    }
    const blocked = consumeDailyXpCap(ledger, DAY, "daily_quest", 3);
    expect(blocked.allowed).toBe(false);
    // count is not incremented past the cap
    expect(blocked.ledger[DAY].daily_quest).toBe(3);
  });

  it("uncapped sources (dailyCap undefined) are always allowed but still counted", () => {
    let ledger: Record<string, Record<string, number>> | undefined;
    for (let i = 1; i <= 50; i++) {
      const r = consumeDailyXpCap(ledger, DAY, "prestige_cycle", undefined);
      expect(r.allowed).toBe(true);
      ledger = r.ledger;
    }
    expect(ledger![DAY].prestige_cycle).toBe(50);
  });

  it("prunes prior days — the blob never grows unbounded", () => {
    const stale = {
      "2026-01-01": { daily_quest: 3, combat_win: 20 },
      "2026-02-02": { gift_sent: 5 },
    };
    const r = consumeDailyXpCap(stale, DAY, "combat_win", 20);
    expect(r.allowed).toBe(true);
    // only the current UTC day survives
    expect(Object.keys(r.ledger)).toEqual([DAY]);
    expect(r.ledger[DAY]).toEqual({ combat_win: 1 });
  });

  it("separate sources have independent counters within a day", () => {
    let l = consumeDailyXpCap(undefined, DAY, "combat_win", 20).ledger;
    l = consumeDailyXpCap(l, DAY, "gift_sent", 5).ledger;
    expect(l[DAY]).toEqual({ combat_win: 1, gift_sent: 1 });
  });

  it("utcDayKey is a stable YYYY-MM-DD in UTC", () => {
    expect(utcDayKey(new Date("2026-05-17T23:59:59.999Z"))).toBe("2026-05-17");
    expect(utcDayKey(new Date("2026-05-17T00:00:00.000Z"))).toBe("2026-05-17");
    expect(/^\d{4}-\d{2}-\d{2}$/.test(utcDayKey())).toBe(true);
  });
});
