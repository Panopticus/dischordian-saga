import { describe, expect, it } from "vitest";
import {
  buildCommunitySnapshot,
  percentDiscoveredByKind,
  currentMilestone,
  nextMilestone,
  canPlayerContribute,
  DEFAULT_COMMUNITY_MILESTONES,
  type CommunityDiscoveryEvent,
  type CommunityMilestone,
} from "./communityInvestigation";

const ev = (
  partial: Partial<CommunityDiscoveryEvent> & {
    targetId: string;
    kind?: CommunityDiscoveryEvent["kind"];
  },
): CommunityDiscoveryEvent => ({
  id: partial.id ?? "evt_" + Math.random().toString(36).slice(2),
  kind: partial.kind ?? "clue_collected",
  targetId: partial.targetId,
  optIn: partial.optIn ?? true,
  occurredAt: partial.occurredAt ?? new Date("2026-05-09T12:00:00Z"),
  seasonKey: partial.seasonKey,
});

describe("buildCommunitySnapshot (audit/16 PR 29 AR7)", () => {
  it("returns zero counts for an empty event list", () => {
    const snap = buildCommunitySnapshot([]);
    expect(snap.globalDiscoveryCount).toBe(0);
    for (const v of Object.values(snap.countsByKind)) expect(v).toBe(0);
  });

  it("counts events that opted in", () => {
    const snap = buildCommunitySnapshot([
      ev({ targetId: "clue_a", kind: "clue_collected" }),
      ev({ targetId: "clue_b", kind: "clue_collected" }),
      ev({ targetId: "puzzle_a", kind: "puzzle_solved" }),
    ]);
    expect(snap.globalDiscoveryCount).toBe(3);
    expect(snap.countsByKind.clue_collected).toBe(2);
    expect(snap.countsByKind.puzzle_solved).toBe(1);
  });

  it("filters out opt-out events (privacy invariant)", () => {
    const snap = buildCommunitySnapshot([
      ev({ targetId: "clue_a", optIn: true }),
      ev({ targetId: "clue_b", optIn: false }),
      ev({ targetId: "clue_c", optIn: false }),
    ]);
    expect(snap.globalDiscoveryCount).toBe(1);
    expect(snap.countsByKind.clue_collected).toBe(1);
  });

  it("dedupes per-target (50 players collecting clue_a counts ONCE)", () => {
    const events: CommunityDiscoveryEvent[] = [];
    for (let i = 0; i < 50; i++) {
      events.push(ev({ id: `e${i}`, targetId: "clue_a" }));
    }
    const snap = buildCommunitySnapshot(events);
    expect(snap.countsByKind.clue_collected).toBe(1);
  });

  it("dedupe is per-kind — same targetId across kinds counts each", () => {
    const snap = buildCommunitySnapshot([
      ev({ id: "e1", targetId: "shared_id", kind: "clue_collected" }),
      ev({ id: "e2", targetId: "shared_id", kind: "puzzle_solved" }),
    ]);
    expect(snap.countsByKind.clue_collected).toBe(1);
    expect(snap.countsByKind.puzzle_solved).toBe(1);
    expect(snap.globalDiscoveryCount).toBe(2);
  });

  it("filters by seasonKey when set", () => {
    const events: CommunityDiscoveryEvent[] = [
      ev({ id: "e1", targetId: "clue_a", seasonKey: "S1-2026" }),
      ev({ id: "e2", targetId: "clue_b", seasonKey: "S2-2026" }),
      ev({ id: "e3", targetId: "clue_c", seasonKey: "S1-2026" }),
    ];
    const s1 = buildCommunitySnapshot(events, { seasonKey: "S1-2026" });
    expect(s1.globalDiscoveryCount).toBe(2);
    expect(s1.seasonKey).toBe("S1-2026");

    const s2 = buildCommunitySnapshot(events, { seasonKey: "S2-2026" });
    expect(s2.globalDiscoveryCount).toBe(1);

    const all = buildCommunitySnapshot(events);
    expect(all.globalDiscoveryCount).toBe(3);
  });

  it("season filter excludes events with no seasonKey", () => {
    const events: CommunityDiscoveryEvent[] = [
      ev({ id: "e1", targetId: "clue_a", seasonKey: "S1-2026" }),
      ev({ id: "e2", targetId: "clue_b" /* no season */ }),
    ];
    const filtered = buildCommunitySnapshot(events, { seasonKey: "S1-2026" });
    expect(filtered.globalDiscoveryCount).toBe(1);
  });
});

describe("percentDiscoveredByKind", () => {
  it("returns -1 per kind when declaredTargets is missing", () => {
    const snap = buildCommunitySnapshot([ev({ targetId: "clue_a" })]);
    const pct = percentDiscoveredByKind(snap);
    for (const v of Object.values(pct)) expect(v).toBe(-1);
  });

  it("computes ratio when declaredTargets is set", () => {
    const snap = buildCommunitySnapshot(
      [
        ev({ id: "1", targetId: "c1" }),
        ev({ id: "2", targetId: "c2" }),
        ev({ id: "3", targetId: "c3" }),
      ],
      {
        declaredTargets: {
          clue_collected: 10,
          mystery_solved: 0,
          puzzle_solved: 0,
          manuscript_entry_unlocked: 0,
          unreachable_registered: 0,
        },
      },
    );
    const pct = percentDiscoveredByKind(snap);
    expect(pct.clue_collected).toBeCloseTo(0.3, 5);
    expect(pct.mystery_solved).toBe(-1); // declared 0 → "-"
  });

  it("clamps at 1.0 when discoveries exceed declared", () => {
    // Edge case — a season's declared denominator might
    // shift mid-season. Don't surface > 100%.
    const snap = buildCommunitySnapshot(
      [
        ev({ id: "1", targetId: "c1" }),
        ev({ id: "2", targetId: "c2" }),
        ev({ id: "3", targetId: "c3" }),
      ],
      {
        declaredTargets: {
          clue_collected: 2,
          mystery_solved: 0,
          puzzle_solved: 0,
          manuscript_entry_unlocked: 0,
          unreachable_registered: 0,
        },
      },
    );
    expect(percentDiscoveredByKind(snap).clue_collected).toBe(1);
  });
});

describe("currentMilestone", () => {
  it("returns null when no milestone is reached", () => {
    const snap = buildCommunitySnapshot([
      ev({ id: "1", targetId: "c1" }),
      ev({ id: "2", targetId: "c2" }),
    ]);
    expect(currentMilestone(snap)).toBeNull();
  });

  it("returns the highest reached milestone", () => {
    // 10 unique discoveries → first_ten reached.
    const events = Array.from({ length: 10 }, (_, i) =>
      ev({ id: `e${i}`, targetId: `c${i}` }),
    );
    const snap = buildCommunitySnapshot(events);
    expect(currentMilestone(snap)?.id).toBe("first_ten");
  });

  it("returns the LATEST milestone (not the first)", () => {
    const events = Array.from({ length: 100 }, (_, i) =>
      ev({ id: `e${i}`, targetId: `c${i}` }),
    );
    const snap = buildCommunitySnapshot(events);
    expect(currentMilestone(snap)?.id).toBe("first_hundred");
  });

  it("respects custom milestone ladders", () => {
    const ladder: CommunityMilestone[] = [
      { id: "tiny", threshold: 1, label: "Tiny" },
      { id: "small", threshold: 5, label: "Small" },
    ];
    const snap = buildCommunitySnapshot([
      ev({ id: "1", targetId: "c1" }),
      ev({ id: "2", targetId: "c2" }),
    ]);
    expect(currentMilestone(snap, ladder)?.id).toBe("tiny");
  });
});

describe("nextMilestone", () => {
  it("returns the FIRST unreached milestone with remaining count", () => {
    const events = Array.from({ length: 12 }, (_, i) =>
      ev({ id: `e${i}`, targetId: `c${i}` }),
    );
    const snap = buildCommunitySnapshot(events);
    const next = nextMilestone(snap);
    expect(next?.milestone.id).toBe("first_fifty");
    expect(next?.remaining).toBe(38);
  });

  it("returns null when every milestone is reached", () => {
    const events = Array.from({ length: 1500 }, (_, i) =>
      ev({ id: `e${i}`, targetId: `c${i}` }),
    );
    const snap = buildCommunitySnapshot(events);
    expect(nextMilestone(snap)).toBeNull();
  });
});

describe("canPlayerContribute", () => {
  it("returns false for null/undefined settings (default privacy)", () => {
    expect(canPlayerContribute(null)).toBe(false);
    expect(canPlayerContribute(undefined)).toBe(false);
  });

  it("returns false when opt-in is false", () => {
    expect(canPlayerContribute({ optInToCommunityContribution: false })).toBe(false);
  });

  it("returns true when explicitly opted in", () => {
    expect(canPlayerContribute({ optInToCommunityContribution: true })).toBe(true);
  });
});

describe("DEFAULT_COMMUNITY_MILESTONES", () => {
  it("is sorted ascending by threshold", () => {
    for (let i = 1; i < DEFAULT_COMMUNITY_MILESTONES.length; i++) {
      expect(DEFAULT_COMMUNITY_MILESTONES[i]!.threshold).toBeGreaterThan(
        DEFAULT_COMMUNITY_MILESTONES[i - 1]!.threshold,
      );
    }
  });

  it("milestone ids are unique", () => {
    const ids = DEFAULT_COMMUNITY_MILESTONES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
