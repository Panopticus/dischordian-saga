import { describe, it, expect } from "vitest";
import {
  WARDEN,
  listWardenCandidates,
  wardenOfferingsForCycle,
  wardenAuditCameo,
  buildPurgeNotice,
  wardenCandidateCoverage,
} from "./apprenticeWarden";

describe("apprenticeWarden", () => {
  describe("identity", () => {
    it("WARDEN has the canonical identity fields", () => {
      expect(WARDEN.id).toBe("the_warden");
      expect(WARDEN.archonNumber).toBe(8);
      expect(WARDEN.publicName.length).toBeGreaterThan(3);
      expect(WARDEN.privateName).toBe("The Warden");
    });
  });

  describe("candidate pool", () => {
    it("declares ≥ 4 candidates", () => {
      expect(listWardenCandidates().length).toBeGreaterThanOrEqual(4);
    });

    it("every candidate is fully authored", () => {
      const cov = wardenCandidateCoverage();
      const incomplete = cov.filter(c => !c.complete);
      expect(incomplete).toEqual([]);
    });

    it("each candidate has a forced doctrine", () => {
      for (const c of listWardenCandidates()) {
        expect([
          "compliant_mouth", "forked_path", "cold_hand",
          "heretical_quiet", "human_remainder",
        ]).toContain(c.forcedDoctrineId);
      }
    });
  });

  describe("offerings rotation", () => {
    it("produces 1 candidate on a non-prime non-28 cycle", () => {
      // Cycle 4 is not prime and 4 % 28 !== 0.
      expect(wardenOfferingsForCycle(4).length).toBe(1);
    });

    it("produces 2 on a prime cycle", () => {
      // Cycle 7 is prime.
      expect(wardenOfferingsForCycle(7).length).toBe(2);
    });

    it("produces 3 on a 28-divisible cycle", () => {
      expect(wardenOfferingsForCycle(28).length).toBe(3);
    });

    it("rotates by cycle number deterministically", () => {
      const a = wardenOfferingsForCycle(1);
      const b = wardenOfferingsForCycle(1);
      expect(a.map(c => c.id)).toEqual(b.map(c => c.id));
      const next = wardenOfferingsForCycle(2);
      // Different cycle should usually surface a different candidate first.
      expect(next[0].id).not.toBe(a[0].id);
    });
  });

  describe("audit cameo modifier", () => {
    it("withheld → bond-pull boost; on-list when doctrine is heretical_quiet", () => {
      const m = wardenAuditCameo({
        classification: "withheld",
        doctrineId: "heretical_quiet",
        cumulativeArchitectInfluence: 30,
      });
      expect(m.bondDeltaMultiplier).toBeGreaterThan(1);
      expect(m.putsOnPurgeList).toBe(true);
    });

    it("withheld + non-heretical doctrine does NOT trigger purge", () => {
      const m = wardenAuditCameo({
        classification: "withheld",
        doctrineId: "human_remainder",
        cumulativeArchitectInfluence: 30,
      });
      expect(m.putsOnPurgeList).toBe(false);
    });

    it("compliant + high influence → influence amplified", () => {
      const high = wardenAuditCameo({
        classification: "compliant",
        doctrineId: "compliant_mouth",
        cumulativeArchitectInfluence: 70,
      });
      expect(high.influenceDeltaMultiplier).toBeGreaterThan(1);
      expect(high.closingLine).toContain("commendation");
    });

    it("noncompliant → influence dampened", () => {
      const m = wardenAuditCameo({
        classification: "noncompliant",
        doctrineId: "forked_path",
        cumulativeArchitectInfluence: 50,
      });
      expect(m.influenceDeltaMultiplier).toBeLessThan(1);
    });
  });

  describe("purge notice", () => {
    it("fires at Day 14 with three options", () => {
      const notice = buildPurgeNotice("Meridian Quiet");
      expect(notice.day).toBe(14);
      expect(notice.options.length).toBe(3);
      const ids = notice.options.map(o => o.id);
      expect(ids).toContain("accept_exit");
      expect(ids).toContain("refuse_exit");
      expect(ids).toContain("negotiate");
    });

    it("accept_exit → architectInfluence spike, bond loss", () => {
      const notice = buildPurgeNotice("X");
      const accept = notice.options.find(o => o.id === "accept_exit")!;
      expect(accept.architectInfluenceDelta).toBeGreaterThan(20);
      expect(accept.bondDelta).toBeLessThan(0);
    });

    it("refuse_exit → bond gain, influence drop", () => {
      const notice = buildPurgeNotice("X");
      const refuse = notice.options.find(o => o.id === "refuse_exit")!;
      expect(refuse.bondDelta).toBeGreaterThan(0);
      expect(refuse.architectInfluenceDelta).toBeLessThan(0);
    });

    it("interpolates the apprentice name", () => {
      const notice = buildPurgeNotice("Aurelia Lock");
      expect(notice.prompt).toContain("Aurelia Lock");
      expect(notice.options[0].outcomeFlavor).toContain("Aurelia Lock");
    });
  });
});
