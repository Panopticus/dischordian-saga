import { describe, it, expect } from "vitest";

import {
  FACTION_OBJECTIVES,
  objectivesForAgenda,
  objectivesForFaction,
  reachedMilestones,
  stageHitKey,
  validateAllFactionObjectives,
  validateFactionObjective,
  type FactionObjective,
} from "../objectives";
import { REFERENCE_AGENDAS } from "../../tradeEmpire/agendas";
import { isKnownSubHouseKey } from "../../tradeEmpire/houses";
import { CANONICAL_FACTION_IDS } from "../../factionCrosswalk";

describe("FACTION_OBJECTIVES — registry shape", () => {
  it("loads at least one objective", () => {
    expect(FACTION_OBJECTIVES.length).toBeGreaterThan(0);
  });

  it("validateAllFactionObjectives returns no errors", () => {
    expect(validateAllFactionObjectives()).toEqual([]);
  });

  it("every objective references a real canonical faction id", () => {
    const validIds = new Set(CANONICAL_FACTION_IDS);
    for (const o of FACTION_OBJECTIVES) {
      expect(validIds.has(o.factionCanonical)).toBe(true);
    }
  });

  it("every participant references a real sub-house", () => {
    for (const o of FACTION_OBJECTIVES) {
      for (const p of o.participants) {
        expect(isKnownSubHouseKey(p.subHouse)).toBe(true);
      }
    }
  });

  it("every declared agendaKey resolves to a real agenda in REFERENCE_AGENDAS", () => {
    const validKeys = new Set(REFERENCE_AGENDAS.map(a => a.agendaKey));
    for (const o of FACTION_OBJECTIVES) {
      for (const p of o.participants) {
        if (p.agendaKey) {
          expect(
            validKeys.has(p.agendaKey),
            `${o.objectiveId} → participant ${p.subHouse} → agendaKey ${p.agendaKey}`,
          ).toBe(true);
        }
      }
    }
  });

  it("milestone requiredStageHits all reference declared participant agendas", () => {
    for (const o of FACTION_OBJECTIVES) {
      const declared = new Set(
        o.participants.map(p => p.agendaKey).filter(Boolean) as string[],
      );
      for (const m of o.milestones) {
        for (const hit of m.requiredStageHits) {
          expect(
            declared.has(hit.agendaKey),
            `${o.objectiveId}/${m.milestoneId}: hit on undeclared agenda ${hit.agendaKey}`,
          ).toBe(true);
        }
      }
    }
  });

  it("milestone requiredStageHits reference real stages on those agendas", () => {
    const stagesByAgenda = new Map<string, Set<string>>();
    for (const a of REFERENCE_AGENDAS) {
      stagesByAgenda.set(
        a.agendaKey,
        new Set(a.stages.map(s => s.stageId)),
      );
    }
    for (const o of FACTION_OBJECTIVES) {
      for (const m of o.milestones) {
        for (const hit of m.requiredStageHits) {
          const stages = stagesByAgenda.get(hit.agendaKey);
          if (!stages) continue; // covered by previous test
          expect(
            stages.has(hit.stageId),
            `${o.objectiveId}/${m.milestoneId}: stage ${hit.stageId} not in ${hit.agendaKey}`,
          ).toBe(true);
        }
      }
    }
  });
});

describe("validateFactionObjective rejects malformed entries", () => {
  it("rejects empty participant list", () => {
    const bad: FactionObjective = {
      objectiveId: "test_no_participants",
      factionCanonical: "insurgency",
      name: "test",
      loreContext: "test",
      participants: [],
      milestones: [
        {
          milestoneId: "m1",
          label: "M1",
          requiredStageHits: [],
          summary: "kickoff",
        },
      ],
    };
    expect(validateFactionObjective(bad).length).toBeGreaterThan(0);
  });

  it("rejects empty milestone list", () => {
    const bad: FactionObjective = {
      objectiveId: "test_no_milestones",
      factionCanonical: "insurgency",
      name: "test",
      loreContext: "test",
      participants: [
        {
          subHouse: "insurgency_old_network",
          method: "test",
        },
      ],
      milestones: [],
    };
    expect(validateFactionObjective(bad).length).toBeGreaterThan(0);
  });

  it("rejects milestones referencing undeclared agendas", () => {
    const bad: FactionObjective = {
      objectiveId: "test_undeclared_agenda",
      factionCanonical: "insurgency",
      name: "test",
      loreContext: "test",
      participants: [
        {
          subHouse: "insurgency_old_network",
          method: "test",
          agendaKey: "agenda.real",
        },
      ],
      milestones: [
        {
          milestoneId: "m1",
          label: "M1",
          requiredStageHits: [
            { agendaKey: "agenda.fake", stageId: "stage_x" },
          ],
          summary: "should fail",
        },
      ],
    };
    expect(validateFactionObjective(bad).length).toBeGreaterThan(0);
  });

  it("rejects duplicate milestone ids", () => {
    const bad: FactionObjective = {
      objectiveId: "test_dup_milestone",
      factionCanonical: "insurgency",
      name: "test",
      loreContext: "test",
      participants: [
        {
          subHouse: "insurgency_old_network",
          method: "test",
        },
      ],
      milestones: [
        { milestoneId: "m1", label: "M1", requiredStageHits: [], summary: "first" },
        { milestoneId: "m1", label: "M1", requiredStageHits: [], summary: "second" },
      ],
    };
    expect(validateFactionObjective(bad).length).toBeGreaterThan(0);
  });
});

describe("Helpers", () => {
  it("objectivesForFaction filters by canonical faction id", () => {
    for (const id of CANONICAL_FACTION_IDS) {
      const objs = objectivesForFaction(id);
      for (const o of objs) {
        expect(o.factionCanonical).toBe(id);
      }
    }
  });

  it("objectivesForAgenda returns objectives that include the agenda as a participant", () => {
    // Hierophant agenda participates in multiple objectives.
    const wraith = objectivesForAgenda("agenda.wraith.cultivate_the_successor");
    expect(wraith.length).toBeGreaterThanOrEqual(2);
    for (const o of wraith) {
      expect(
        o.participants.some(p => p.agendaKey === "agenda.wraith.cultivate_the_successor"),
      ).toBe(true);
    }
  });

  it("reachedMilestones returns only milestones whose required hits are all in the set", () => {
    const obj = FACTION_OBJECTIVES.find(
      o => o.objectiveId === "insurgency.awaken_the_faithful",
    );
    expect(obj).toBeDefined();
    // Empty hits → no required-non-empty milestones reached.
    const noHits = reachedMilestones(obj!, new Set());
    expect(noHits.length).toBe(0);

    // Just the cross-check stage → first_audit reached.
    const oneHit = new Set([
      stageHitKey("agenda.vex.authenticate_the_recording", "cross_check"),
    ]);
    const after = reachedMilestones(obj!, oneHit);
    expect(after.some(m => m.milestoneId === "first_audit")).toBe(true);

    // Both terminal stages → all four milestones reached.
    const allHits = new Set([
      stageHitKey("agenda.vex.authenticate_the_recording", "cross_check"),
      stageHitKey("agenda.vex.authenticate_the_recording", "broadcast"),
      stageHitKey("agenda.wraith.cultivate_the_successor", "identify_successor"),
      stageHitKey("agenda.wraith.cultivate_the_successor", "transmit_method"),
      stageHitKey("agenda.wraith.cultivate_the_successor", "bequeath"),
    ]);
    const allReached = reachedMilestones(obj!, allHits);
    expect(allReached.length).toBe(obj!.milestones.length);
  });
});

describe("Hero example — Insurgency awaken_the_faithful cross-NPC structure", () => {
  it("declares both Vex's Old Network and the Hierophant's Quietwork as participants with opposite methods", () => {
    const obj = FACTION_OBJECTIVES.find(
      o => o.objectiveId === "insurgency.awaken_the_faithful",
    );
    expect(obj).toBeDefined();
    const subHouses = obj!.participants.map(p => p.subHouse);
    expect(subHouses).toContain("insurgency_old_network");
    expect(subHouses).toContain("thaloria_quietwork");
  });

  it("has a milestone that requires BOTH agendas to have advanced (cross-NPC coordination)", () => {
    const obj = FACTION_OBJECTIVES.find(
      o => o.objectiveId === "insurgency.awaken_the_faithful",
    );
    const composite = obj!.milestones.find(
      m => m.milestoneId === "broadcast_meets_inheritance",
    );
    expect(composite).toBeDefined();
    const agendas = new Set(composite!.requiredStageHits.map(h => h.agendaKey));
    expect(agendas.size).toBe(2);
    expect(agendas.has("agenda.vex.authenticate_the_recording")).toBe(true);
    expect(agendas.has("agenda.wraith.cultivate_the_successor")).toBe(true);
  });
});
