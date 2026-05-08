import { describe, expect, it } from "vitest";
import {
  APPRENTICE_BANTER,
  banterCoverageByArchetype,
  findBanterPairs,
  renderBanterLine,
} from "./apprenticeBanter";
import {
  APPRENTICE_COMMENTS,
  commentCoverageByArchetype,
  findApprenticeComments,
  renderApprenticeLine,
} from "./apprenticeComments";
import {
  GIFT_CATALOG,
  evaluateGift,
  giftCoverageByArchetype,
} from "./apprenticeGifts";
import {
  advanceRomance,
  applyRomanceResult,
  coupleLoredexEntryId,
  romanceableArchetypes,
} from "./apprenticeRomance";
import { APPRENTICE_IDENTITIES } from "./apprenticeIdentity";
import type { SerializedCrewMember } from "./crewPersistence";
import type { ApprenticeArchetype } from "./apprentices";

const ARCHS: ApprenticeArchetype[] = Object.keys(APPRENTICE_IDENTITIES) as ApprenticeArchetype[];

describe("apprentice banter coverage", () => {
  it("every archetype has at least one banter pair", () => {
    const cov = banterCoverageByArchetype();
    for (const a of ARCHS) {
      expect(cov[a] ?? 0).toBeGreaterThanOrEqual(1);
    }
  });
  it("findBanterPairs filters by archetype + npc", () => {
    const pairs = findBanterPairs("scholar", "locke");
    expect(pairs.length).toBeGreaterThan(0);
    expect(pairs.every((p) => p.archetype === "scholar" && p.npc === "locke")).toBe(true);
  });
  it("renderBanterLine substitutes {name}", () => {
    expect(renderBanterLine("Hello {name}.", "Lirael")).toBe("Hello Lirael.");
  });
  it("no duplicate banter ids", () => {
    const ids = APPRENTICE_BANTER.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("apprentice comments coverage", () => {
  it("every archetype has ≥ 2 comments", () => {
    const cov = commentCoverageByArchetype();
    for (const a of ARCHS) {
      expect(cov[a] ?? 0).toBeGreaterThanOrEqual(2);
    }
  });
  it("findApprenticeComments filters by trigger", () => {
    const list = findApprenticeComments("loredex_entry_discovered");
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((c) => c.trigger === "loredex_entry_discovered")).toBe(true);
  });
  it("renderApprenticeLine substitutes {name}", () => {
    expect(renderApprenticeLine("{name} listens.", "Iskand")).toBe("Iskand listens.");
  });
  it("no duplicate comment ids", () => {
    const ids = APPRENTICE_COMMENTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("apprentice gifts", () => {
  it("every archetype has at least one matching catalog item", () => {
    const cov = giftCoverageByArchetype();
    for (const a of ARCHS) {
      expect(cov[a] ?? 0).toBeGreaterThanOrEqual(1);
    }
  });
  it("liked tag yields positive bond", () => {
    // Zealot likes 'devotional_text' — catalog has matching item.
    const result = evaluateGift("zealot", "devotional_text");
    expect(["liked", "loved"]).toContain(result.reaction);
    expect(result.bondDelta).toBeGreaterThan(0);
  });
  it("disliked tag yields negative bond", () => {
    // Zealot dislikes 'heretical_pamphlet'.
    const result = evaluateGift("zealot", "heretical_pamphlet");
    expect(["disliked", "loathed"]).toContain(result.reaction);
    expect(result.bondDelta).toBeLessThan(0);
  });
  it("unknown item is neutral", () => {
    const result = evaluateGift("scholar", "asdf-not-a-real-item");
    expect(result.reaction).toBe("neutral");
  });
  it("all GIFT_CATALOG ids are unique", () => {
    const ids = GIFT_CATALOG.map((g) => g.itemId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("apprentice romance", () => {
  const baseMember: SerializedCrewMember = {
    id: "m1",
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
    health: 100,
    loyalty: 50,
    status: "active",
    age: 1,
    maxAge: 80,
    missionHistory: [],
    relationships: {},
    birthCycle: 0,
    productionPath: "trained",
    archetype: "scholar",
    personalQuestStage: 0,
    personalQuestResolution: null,
  };

  it("non-romanceable archetype declines", () => {
    const member = { ...baseMember, archetype: "ghost" as ApprenticeArchetype };
    if (!APPRENTICE_IDENTITIES.ghost.romance.available) {
      const result = advanceRomance({
        member,
        bond: 95,
        flags: new Set(),
      });
      expect(result.nextStage).toBeNull();
    }
  });

  it("sparks at the archetype's minBondToStart", () => {
    const minBond = APPRENTICE_IDENTITIES.scholar.romance.minBondToStart;
    const result = advanceRomance({
      member: baseMember,
      bond: minBond,
      flags: new Set(),
    });
    if (APPRENTICE_IDENTITIES.scholar.romance.available) {
      expect(result.nextStage).toBe("spark");
      expect(result.flagToSet).toMatch(/^romance:spark:/);
    }
  });

  it("does not auto-advance to courtship without quest progress", () => {
    if (!APPRENTICE_IDENTITIES.scholar.romance.available) return;
    const member = { ...baseMember, personalQuestStage: 0 };
    const result = advanceRomance({
      member,
      bond: 60,
      flags: new Set(),
      current: { stage: "spark" },
    });
    expect(result.nextStage).toBeNull();
  });

  it("locks in committed only when in alcove + deepened resolution", () => {
    if (!APPRENTICE_IDENTITIES.scholar.romance.available) return;
    const member = {
      ...baseMember,
      personalQuestStage: 3,
      personalQuestResolution: "deepened" as const,
    };
    const noAlcove = advanceRomance({
      member,
      bond: 95,
      flags: new Set(),
      current: { stage: "consummation" },
      inAlcove: false,
    });
    expect(noAlcove.nextStage).toBeNull();

    const inAlcove = advanceRomance({
      member,
      bond: 95,
      flags: new Set(),
      current: { stage: "consummation" },
      inAlcove: true,
    });
    expect(inAlcove.nextStage).toBe("committed");
    expect(inAlcove.fireLoredexUnlock).toBe(true);

    const next = applyRomanceResult({ stage: "consummation" }, inAlcove, 1234);
    expect(next.stage).toBe("committed");
    expect(next.lockInFired).toBe(true);
  });

  it("coupleLoredexEntryId returns archetype-keyed id", () => {
    expect(coupleLoredexEntryId("scholar")).toBe("couple_arc_scholar");
  });

  it("at least three archetypes are romanceable", () => {
    expect(romanceableArchetypes().length).toBeGreaterThanOrEqual(3);
  });
});
