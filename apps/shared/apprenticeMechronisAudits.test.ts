import { describe, it, expect } from "vitest";
import { generateApprentice } from "./apprentices";
import {
  AUDIT_PROMPTS,
  resolveAudit,
  archetypeAuditCoverage,
  allAuditDays,
} from "./apprenticeMechronisAudits";

describe("apprenticeMechronisAudits", () => {
  describe("AUDIT_PROMPTS", () => {
    it("declares 7 / 14 / 21", () => {
      expect(allAuditDays()).toEqual([7, 14, 21]);
      for (const d of allAuditDays()) {
        const p = AUDIT_PROMPTS[d];
        expect(p.question.length).toBeGreaterThan(20);
        expect(p.complianceTemplate.length).toBeGreaterThan(20);
      }
    });

    it("every (archetype × day) cell has authored flavor", () => {
      const cells = archetypeAuditCoverage();
      expect(cells.length).toBe(12 * 3);
      for (const c of cells) expect(c.authored).toBe(true);
    });
  });

  describe("resolveAudit", () => {
    it("Compliant Mouth always classifies compliant; deltas favor influence up, bond down", () => {
      const apprentice = generateApprentice({ forceArchetype: "zealot" });
      const out = resolveAudit({
        day: 7,
        apprentice,
        doctrineId: "compliant_mouth",
        bondAtAudit: 30,
        corruptionAtAudit: 10,
        architectInfluenceAtAudit: 30,
        fireInheritedLine: false,
      });
      expect(out.classification).toBe("compliant");
      expect(out.architectInfluenceDelta).toBeGreaterThan(0);
      expect(out.bondDelta).toBeLessThanOrEqual(0);
    });

    it("Heretical Quiet always classifies withheld; deltas favor influence down, bond up", () => {
      const apprentice = generateApprentice({ forceArchetype: "heretic" });
      const out = resolveAudit({
        day: 21,
        apprentice,
        doctrineId: "heretical_quiet",
        bondAtAudit: 50,
        corruptionAtAudit: 30,
        architectInfluenceAtAudit: 20,
        fireInheritedLine: false,
      });
      expect(out.classification).toBe("withheld");
      expect(out.architectInfluenceDelta).toBeLessThan(0);
      expect(out.bondDelta).toBeGreaterThan(0);
    });

    it("Day 21 deltas exceed Day 7 deltas at the same classification", () => {
      const apprentice = generateApprentice({ forceArchetype: "zealot" });
      const day7 = resolveAudit({
        day: 7, apprentice, doctrineId: "compliant_mouth",
        bondAtAudit: 50, corruptionAtAudit: 0, architectInfluenceAtAudit: 50,
        fireInheritedLine: false,
      });
      const day21 = resolveAudit({
        day: 21, apprentice, doctrineId: "compliant_mouth",
        bondAtAudit: 50, corruptionAtAudit: 0, architectInfluenceAtAudit: 50,
        fireInheritedLine: false,
      });
      expect(day21.architectInfluenceDelta).toBeGreaterThan(day7.architectInfluenceDelta);
    });

    it("inherited line surfaces in the private transcript when fired", () => {
      const apprentice = generateApprentice({ forceArchetype: "ghost" });
      const out = resolveAudit({
        day: 7, apprentice, doctrineId: "human_remainder",
        bondAtAudit: 60, corruptionAtAudit: 0, architectInfluenceAtAudit: 20,
        fireInheritedLine: true,
        inheritedLineText: "I am the next watch. I will fall too.",
      });
      expect(out.privateTranscript).toContain("I am the next watch");
      expect(out.inheritedLineFired).toBe(true);
    });

    it("Human Remainder + low bond + low influence → noncompliant; high bond → withheld", () => {
      const apprentice = generateApprentice({ forceArchetype: "martyr" });
      const lowBond = resolveAudit({
        day: 14, apprentice, doctrineId: "human_remainder",
        bondAtAudit: 20, corruptionAtAudit: 0, architectInfluenceAtAudit: 20,
        fireInheritedLine: false,
      });
      const highBond = resolveAudit({
        day: 14, apprentice, doctrineId: "human_remainder",
        bondAtAudit: 70, corruptionAtAudit: 0, architectInfluenceAtAudit: 20,
        fireInheritedLine: false,
      });
      expect(lowBond.classification).toBe("noncompliant");
      expect(highBond.classification).toBe("withheld");
    });
  });
});
