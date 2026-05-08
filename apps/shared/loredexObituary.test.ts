import { describe, expect, it } from "vitest";
import { composeObituary, closeObituary, markCycleComplete } from "./loredexObituary";
import type { SerializedCrewMember } from "./crewPersistence";

const baseMember: SerializedCrewMember = {
  id: "m-test-1",
  name: "Iskand",
  nickname: null,
  species: "human",
  gender: "non-binary",
  bloodlineId: "void_resonance",
  generation: 1,
  parentIds: null,
  children: [],
  geneticTraits: [],
  role: null,
  stats: {
    resilience: 60,
    intellect: 60,
    reflexes: 60,
    empathy: 60,
    immunity: 60,
    adaptability: 60,
  },
  morale: 70,
  health: 0,
  loyalty: 50,
  status: "dead",
  age: 17,
  maxAge: 80,
  missionHistory: ["m1", "m2"],
  relationships: {},
  birthCycle: 0,
  productionPath: "trained",
  archetype: "scholar",
  personalQuestStage: 2,
  personalQuestResolution: null,
  deathRecord: {
    cycle: 17,
    cause: "Lost during the Coda raid",
    lastWords: "I had three drafts left.",
    epitaph: "They corrected the citations on the way down.",
    romanced: false,
    personalQuestStage: 2,
  },
};

describe("loredexObituary.composeObituary", () => {
  it("composes an entry with required fields", () => {
    const entry = composeObituary({
      member: baseMember,
      squadMemberKeys: ["s1", "s2"],
      missionName: "Coda Raid",
      now: 1000,
    });
    expect(entry.id).toBe("obituary.m-test-1");
    expect(entry.subjectName).toBe("Iskand");
    expect(entry.subjectKind).toBe("apprentice");
    expect(entry.subjectKey).toBe("scholar");
    expect(entry.deathCycle).toBe(17);
    expect(entry.cause).toBe("Lost during the Coda raid");
    expect(entry.epitaph).toBe("They corrected the citations on the way down.");
    expect(entry.missionName).toBe("Coda Raid");
    expect(entry.squadMemberKeys).toEqual(["s1", "s2"]);
    expect(entry.personalQuestStage).toBe(2);
    expect(entry.createdAt).toBe(1000);
    expect(entry.closed).toBeUndefined();
  });

  it("falls back to a default epitaph when missing", () => {
    const member = {
      ...baseMember,
      deathRecord: {
        ...baseMember.deathRecord!,
        epitaph: undefined,
      },
    };
    const entry = composeObituary({
      member,
      squadMemberKeys: [],
      now: 0,
    });
    expect(entry.epitaph).toContain("We remember.");
  });

  it("classifies recruited NPCs and bred crew correctly", () => {
    const recruited = {
      ...baseMember,
      productionPath: "recruited" as const,
      linkedNpcKey: "vex_solene",
      archetype: "artisan" as const,
    };
    const entry = composeObituary({
      member: recruited,
      squadMemberKeys: [],
      now: 0,
    });
    expect(entry.subjectKind).toBe("recruited_npc");
    expect(entry.subjectKey).toBe("vex_solene");

    const bred = {
      ...baseMember,
      productionPath: "bred" as const,
      archetype: undefined,
    };
    const bredEntry = composeObituary({
      member: bred,
      squadMemberKeys: [],
      now: 0,
    });
    expect(bredEntry.subjectKind).toBe("bred_crew");
    expect(bredEntry.subjectKey).toBe("unknown_archetype");
  });

  it("throws when deathRecord is missing", () => {
    const undead = { ...baseMember, deathRecord: undefined };
    expect(() =>
      composeObituary({ member: undead, squadMemberKeys: [], now: 0 }),
    ).toThrow();
  });
});

describe("closeObituary / markCycleComplete", () => {
  it("closeObituary sets closed=true and closedAt", () => {
    const entry = composeObituary({
      member: baseMember,
      squadMemberKeys: [],
      now: 0,
    });
    const closed = closeObituary(entry, 1234);
    expect(closed.closed).toBe(true);
    expect(closed.closedAt).toBe(1234);
  });
  it("markCycleComplete sets cycleComplete=true", () => {
    const entry = composeObituary({
      member: baseMember,
      squadMemberKeys: [],
      now: 0,
    });
    const terminal = markCycleComplete(entry, 5678);
    expect(terminal.cycleComplete).toBe(true);
    expect(terminal.closedAt).toBe(5678);
  });
});
