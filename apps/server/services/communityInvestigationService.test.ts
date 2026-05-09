import { describe, expect, it } from "vitest";
import {
  countDiscoverersFor,
  getCommunitySnapshot,
  getMilestoneSnapshot,
  recordDiscoveryEvent,
  setOptInForUser,
} from "./communityInvestigationService";

/* These tests exercise the DB-degraded path — when getDb()
   returns null (no DATABASE_URL in the test env), every
   operation must return a safe default. The test environment
   does not configure a MySQL connection, so `getDb()` resolves
   null and we verify the service contract holds without DB.

   The cross-player aggregator's correctness lives on the
   shared module's tests (apps/shared/communityInvestigation.test.ts)
   — 21 tests covering opt-in filtering, per-target dedupe,
   season filtering, milestone resolution. We don't re-prove
   those here. */

describe("communityInvestigationService — DB-unconfigured contract", () => {
  it("recordDiscoveryEvent returns 0 (no-op) without DB", async () => {
    const id = await recordDiscoveryEvent({
      userId: 1,
      kind: "clue_collected",
      targetId: "clue_a",
      optIn: true,
    });
    expect(id).toBe(0);
  });

  it("setOptInForUser returns 0 rows updated without DB", async () => {
    expect(await setOptInForUser(1, true)).toBe(0);
    expect(await setOptInForUser(1, false)).toBe(0);
  });

  it("getCommunitySnapshot returns empty snapshot without DB", async () => {
    const snap = await getCommunitySnapshot();
    expect(snap.globalDiscoveryCount).toBe(0);
    expect(snap.countsByKind.clue_collected).toBe(0);
    expect(snap.countsByKind.mystery_solved).toBe(0);
    expect(snap.countsByKind.puzzle_solved).toBe(0);
    expect(snap.countsByKind.manuscript_entry_unlocked).toBe(0);
    expect(snap.countsByKind.unreachable_registered).toBe(0);
  });

  it("getCommunitySnapshot threads the seasonKey filter through", async () => {
    const snap = await getCommunitySnapshot({ seasonKey: "S1-2026" });
    expect(snap.seasonKey).toBe("S1-2026");
    expect(snap.globalDiscoveryCount).toBe(0);
  });

  it("getCommunitySnapshot threads declaredTargets through", async () => {
    const snap = await getCommunitySnapshot({
      declaredTargets: {
        clue_collected: 100,
        mystery_solved: 12,
        puzzle_solved: 30,
        manuscript_entry_unlocked: 50,
        unreachable_registered: 5,
      },
    });
    expect(snap.declaredTargets).toBeDefined();
    expect(snap.declaredTargets!.clue_collected).toBe(100);
  });

  it("getMilestoneSnapshot returns null current + first-milestone-as-next without DB", async () => {
    const r = await getMilestoneSnapshot();
    expect(r.snapshot.globalDiscoveryCount).toBe(0);
    // No discoveries → no milestone reached → currentMilestoneId null.
    expect(r.currentMilestoneId).toBeNull();
    // First-unreached milestone in DEFAULT_COMMUNITY_MILESTONES is `first_ten`.
    expect(r.next).not.toBeNull();
    expect(r.next!.milestoneId).toBe("first_ten");
    expect(r.next!.remaining).toBe(10);
  });

  it("countDiscoverersFor returns 0 without DB", async () => {
    expect(await countDiscoverersFor("clue_collected", "clue_a")).toBe(0);
  });
});
