import { describe, it, expect } from "vitest";
import {
  applyPrestigeCarryover,
  buildWitnessingWall,
  captainsQuartersSleepForBond,
  listActiveAppendixAXrefs,
  shouldPlayBridgeOfKaelPostCredits,
} from "./witnessingIntegrations";

describe("witnessingIntegrations", () => {
  describe("shouldPlayBridgeOfKaelPostCredits", () => {
    it("false until kael_questline_complete", () => {
      expect(shouldPlayBridgeOfKaelPostCredits({})).toBe(false);
    });
    it("false until player returns to bridge", () => {
      expect(
        shouldPlayBridgeOfKaelPostCredits({ kael_questline_complete: true }),
      ).toBe(false);
    });
    it("true when questline complete AND returned to bridge", () => {
      expect(
        shouldPlayBridgeOfKaelPostCredits({
          kael_questline_complete: true,
          returned_to_bridge_post_kael: true,
        }),
      ).toBe(true);
    });
    it("false once scene flag is already set", () => {
      expect(
        shouldPlayBridgeOfKaelPostCredits({
          kael_questline_complete: true,
          returned_to_bridge_post_kael: true,
          bridge_of_kael_post_credit_seen: true,
        }),
      ).toBe(false);
    });
  });

  describe("applyPrestigeCarryover", () => {
    const stats = {
      loredexEntries: 100,
      bondPeakMemories: 40,
      narratorDominanceEnergy: 250,
      dischordiaCards: 60,
      witnessingMilestones: 9,
      memorableMoments: 50,
    };

    it("carries loredex entries at 100%", () => {
      expect(applyPrestigeCarryover(stats).loredexEntries).toBe(100);
    });

    it("carries bond peak memories at 50%", () => {
      expect(applyPrestigeCarryover(stats).bondPeakMemories).toBe(20);
    });

    it("resets narrator dominance to 0 (§1.5 invariant)", () => {
      expect(applyPrestigeCarryover(stats).narratorDominanceEnergy).toBe(0);
    });

    it("carries 25% of Dischordia cards", () => {
      expect(applyPrestigeCarryover(stats).dischordiaCards).toBe(15);
    });

    it("carries Witnessing milestones at 100%", () => {
      expect(applyPrestigeCarryover(stats).witnessingMilestones).toBe(9);
    });

    it("carries 10% of memorable moments (Antiquarian's choice)", () => {
      expect(applyPrestigeCarryover(stats).memorableMoments).toBe(5);
    });
  });

  describe("buildWitnessingWall", () => {
    it("includes all six kinds when all inputs present", () => {
      const wall = buildWitnessingWall({
        authoredCards: [{ id: "c1", title: "The First Card" }],
        deadPets: [{ name: "Biscuit", species: "Eidolon-9" }],
        dismissedLines: [
          { narratorId: "elara", text: "I'll miss you" },
        ],
        dmcIdentityChain: {
          student: "Andy",
          seeker: "Jay",
          detective: "Ren",
          last: "Vale",
        },
        unlockedFragmentIds: ["f1", "f6"],
        topMemorableMoments: [{ title: "The Bulb Dims" }],
      });
      const kinds = new Set(wall.map((e) => e.kind));
      expect(kinds).toContain("authored_card");
      expect(kinds).toContain("dead_pet");
      expect(kinds).toContain("dismissed_line");
      expect(kinds).toContain("dmc_identity");
      expect(kinds).toContain("kael_fragment");
      expect(kinds).toContain("memorable_moment");
      expect(wall.length).toBe(1 + 1 + 1 + 4 + 2 + 1);
    });

    it("skips DMC chain entries that are undefined", () => {
      const wall = buildWitnessingWall({
        authoredCards: [],
        deadPets: [],
        dismissedLines: [],
        dmcIdentityChain: { student: "Andy" },
        unlockedFragmentIds: [],
        topMemorableMoments: [],
      });
      expect(wall).toHaveLength(1);
      expect(wall[0].kind).toBe("dmc_identity");
    });

    it("resolves fragment ids through KAEL_FRAGMENTS", () => {
      const wall = buildWitnessingWall({
        authoredCards: [],
        deadPets: [],
        dismissedLines: [],
        dmcIdentityChain: {},
        unlockedFragmentIds: ["f1"],
        topMemorableMoments: [],
      });
      expect(wall[0].title).toBe("What You Are Fighting");
    });
  });

  describe("captainsQuartersSleepForBond", () => {
    const now = 10_000_000_000;

    it("allows sleep when no previous sleep recorded", () => {
      const out = captainsQuartersSleepForBond({
        companionIds: ["elara", "the_human"],
        nowMs: now,
      });
      expect(out.allowed).toBe(true);
      expect(out.deltas.elara).toBe(1);
      expect(out.deltas.the_human).toBe(1);
      expect(out.cooldownSecondsRemaining).toBe(0);
    });

    it("blocks sleep within 24h of last sleep", () => {
      const out = captainsQuartersSleepForBond({
        companionIds: ["elara"],
        nowMs: now,
        lastSleepMs: now - 60 * 60 * 1000, // 1h ago
      });
      expect(out.allowed).toBe(false);
      expect(Object.keys(out.deltas)).toHaveLength(0);
      expect(out.cooldownSecondsRemaining).toBeGreaterThan(0);
    });

    it("allows sleep exactly 24h after last sleep", () => {
      const out = captainsQuartersSleepForBond({
        companionIds: ["elara"],
        nowMs: now,
        lastSleepMs: now - 24 * 60 * 60 * 1000,
      });
      expect(out.allowed).toBe(true);
    });
  });

  describe("listActiveAppendixAXrefs", () => {
    it("always surfaces A.7 and A.8 (shell_landed)", () => {
      const out = listActiveAppendixAXrefs({});
      const ids = out.map((x) => x.id);
      expect(ids).toContain("a7_celebration_trial");
      expect(ids).toContain("a8_mechronis_professors");
    });

    it("does not surface documented-status notes with no flags raised", () => {
      const out = listActiveAppendixAXrefs({});
      const ids = out.map((x) => x.id);
      expect(ids).not.toContain("a1_matrix_of_dreams");
    });

    it("surfaces a documented note once any shippingFlag is set", () => {
      const out = listActiveAppendixAXrefs({
        matrix_is_slideshow_substrate: true,
      });
      const ids = out.map((x) => x.id);
      expect(ids).toContain("a1_matrix_of_dreams");
    });
  });
});
