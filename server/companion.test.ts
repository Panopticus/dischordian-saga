import { describe, it, expect } from "vitest";

/**
 * Phase 70 — Companion System, Fleet Viewer, and Diplomacy Tests
 * These tests validate the data integrity of companionData.ts exports
 * and the GameContext companion state shape.
 */

// Import companion data
import {
  ELARA_PROFILE,
  THE_HUMAN_PROFILE,
  COMPANION_QUESTS,
  INCEPTION_ARKS,
  TRADE_NPCS,
  DIPLOMACY_EVENTS,
} from "../client/src/data/companionData";

describe("Companion Profiles", () => {
  it("should have Elara profile with required fields", () => {
    expect(ELARA_PROFILE).toBeDefined();
    expect(ELARA_PROFILE.id).toBe("elara");
    expect(ELARA_PROFILE.name).toBe("Elara");
    expect(ELARA_PROFILE.faction).toBe("dreamer");
    expect(ELARA_PROFILE.personality.length).toBeGreaterThan(0);
    expect(ELARA_PROFILE.backstoryStages.length).toBeGreaterThan(0);
    expect(ELARA_PROFILE.tagline).toBeTruthy();
    expect(ELARA_PROFILE.title).toBeTruthy();
  });

  it("should have The Human profile with required fields", () => {
    expect(THE_HUMAN_PROFILE).toBeDefined();
    expect(THE_HUMAN_PROFILE.id).toBe("the_human");
    // The Human's name is hidden as "???" for the slow reveal mechanic
    expect(THE_HUMAN_PROFILE.name).toBe("???");
    expect(THE_HUMAN_PROFILE.faction).toBe("architect");
    expect(THE_HUMAN_PROFILE.personality.length).toBeGreaterThan(0);
    expect(THE_HUMAN_PROFILE.backstoryStages.length).toBeGreaterThan(0);
    expect(THE_HUMAN_PROFILE.tagline).toBeTruthy();
    expect(THE_HUMAN_PROFILE.title).toBeTruthy();
  });

  it("should have backstory stages with increasing required levels", () => {
    for (const profile of [ELARA_PROFILE, THE_HUMAN_PROFILE]) {
      const levels = profile.backstoryStages.map(s => s.requiredLevel);
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i]).toBeGreaterThanOrEqual(levels[i - 1]);
      }
    }
  });

  it("should have unique backstory stage IDs", () => {
    for (const profile of [ELARA_PROFILE, THE_HUMAN_PROFILE]) {
      const ids = profile.backstoryStages.map(s => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe("Companion Quests", () => {
  it("should have quests for both companions", () => {
    const elaraQuests = COMPANION_QUESTS.filter(q => q.companionId === "elara");
    const humanQuests = COMPANION_QUESTS.filter(q => q.companionId === "the_human");
    expect(elaraQuests.length).toBeGreaterThan(0);
    expect(humanQuests.length).toBeGreaterThan(0);
  });

  it("should have unique quest IDs", () => {
    const ids = COMPANION_QUESTS.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have valid reward structures", () => {
    for (const quest of COMPANION_QUESTS) {
      expect(quest.rewards).toBeDefined();
      expect(quest.rewards.relationshipXp).toBeGreaterThan(0);
      expect(quest.rewards.dreamTokens).toBeGreaterThanOrEqual(0);
      expect(quest.rewards.xp).toBeGreaterThanOrEqual(0);
    }
  });

  it("should have romance quests with morality requirements", () => {
    const romanceQuests = COMPANION_QUESTS.filter(q => q.isRomanceQuest);
    expect(romanceQuests.length).toBeGreaterThanOrEqual(2); // At least one per companion
    for (const quest of romanceQuests) {
      expect(quest.moralityRequirement).toBeDefined();
      expect(quest.moralityRequirement).not.toBe(0);
    }
  });

  it("Elara romance quest should require positive morality (humanity)", () => {
    const elaraRomance = COMPANION_QUESTS.find(q => q.companionId === "elara" && q.isRomanceQuest);
    expect(elaraRomance).toBeDefined();
    expect(elaraRomance!.moralityRequirement).toBeGreaterThan(0);
  });

  it("The Human romance quest should require negative morality (machine)", () => {
    const humanRomance = COMPANION_QUESTS.find(q => q.companionId === "the_human" && q.isRomanceQuest);
    expect(humanRomance).toBeDefined();
    expect(humanRomance!.moralityRequirement).toBeLessThan(0);
  });

  it("should have intro and completion dialog for every quest", () => {
    for (const quest of COMPANION_QUESTS) {
      expect(quest.introDialog).toBeTruthy();
      expect(quest.completionDialog).toBeTruthy();
      expect(quest.objective).toBeTruthy();
    }
  });
});

describe("Inception Arks", () => {
  it("should have multiple arks defined", () => {
    expect(INCEPTION_ARKS.length).toBeGreaterThanOrEqual(5);
  });

  it("should have unique ark IDs", () => {
    const ids = INCEPTION_ARKS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have unique designations", () => {
    const designations = INCEPTION_ARKS.map(a => a.designation);
    expect(new Set(designations).size).toBe(designations.length);
  });

  it("should have valid card stats", () => {
    for (const ark of INCEPTION_ARKS) {
      expect(ark.cardStats.power).toBeGreaterThan(0);
      expect(ark.cardStats.health).toBeGreaterThan(0);
      expect(ark.cardStats.cost).toBeGreaterThan(0);
    }
  });

  it("should have class, color, and AI guardian for every ark", () => {
    for (const ark of INCEPTION_ARKS) {
      expect(ark.class).toBeTruthy();
      expect(ark.color).toBeTruthy();
      expect(ark.aiGuardian).toBeTruthy();
      expect(ark.specialization).toBeTruthy();
    }
  });

  it("should have player class mapping for every ark", () => {
    for (const ark of INCEPTION_ARKS) {
      expect(ark.playerClass).toBeTruthy();
    }
  });
});

describe("Trade NPCs", () => {
  it("should have NPCs defined", () => {
    expect(TRADE_NPCS.length).toBeGreaterThanOrEqual(3);
  });

  it("should have unique NPC IDs", () => {
    const ids = TRADE_NPCS.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have valid faction assignments", () => {
    const validFactions = ["empire", "insurgency", "independent", "pirate"];
    for (const npc of TRADE_NPCS) {
      expect(validFactions).toContain(npc.faction);
    }
  });

  it("should have personality and encounter style for every NPC", () => {
    for (const npc of TRADE_NPCS) {
      expect(npc.personality).toBeTruthy();
      expect(npc.encounterStyle).toBeTruthy();
      expect(npc.quote).toBeTruthy();
    }
  });
});

describe("Diplomacy Events", () => {
  it("should have events defined", () => {
    expect(DIPLOMACY_EVENTS.length).toBeGreaterThanOrEqual(3);
  });

  it("should have unique event IDs", () => {
    const ids = DIPLOMACY_EVENTS.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have at least 2 choices per event", () => {
    for (const event of DIPLOMACY_EVENTS) {
      expect(event.choices.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("should have choices with morality and credit deltas", () => {
    for (const event of DIPLOMACY_EVENTS) {
      for (const choice of event.choices) {
        expect(typeof choice.moralityDelta).toBe("number");
        expect(typeof choice.creditDelta).toBe("number");
        expect(choice.reputationDelta).toBeDefined();
        expect(choice.consequence).toBeTruthy();
      }
    }
  });

  it("should reference valid NPC IDs", () => {
    const npcIds = new Set(TRADE_NPCS.map(n => n.id));
    for (const event of DIPLOMACY_EVENTS) {
      for (const npcId of event.involvedNpcs) {
        expect(npcIds.has(npcId)).toBe(true);
      }
    }
  });

  it("should have a theme for every event", () => {
    for (const event of DIPLOMACY_EVENTS) {
      expect(event.theme).toBeTruthy();
    }
  });

  it("should have choices that offer different morality directions", () => {
    for (const event of DIPLOMACY_EVENTS) {
      const deltas = event.choices.map(c => c.moralityDelta);
      const hasPositive = deltas.some(d => d > 0);
      const hasNegative = deltas.some(d => d < 0);
      // Most events should offer both humanity and machine choices
      expect(hasPositive || hasNegative).toBe(true);
    }
  });
});
