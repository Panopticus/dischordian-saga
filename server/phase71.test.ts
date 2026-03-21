import { describe, it, expect } from "vitest";
import {
  ELARA_PROFILE, THE_HUMAN_PROFILE,
  COMPANION_QUESTS, INCEPTION_ARKS,
  DIPLOMACY_EVENTS, TRADE_NPCS,
} from "../client/src/data/companionData";
import { QUEST_CUTSCENES } from "../client/src/components/CutsceneOverlay";

/* ═══════════════════════════════════════════════════════════
   Phase 71 Tests: LLM Dialog, Diplomacy Consequences,
   Cutscenes, and AAA Game Upgrades
   ═══════════════════════════════════════════════════════════ */

describe("The Human companion dialog system", () => {
  it("has The Human companion defined with noir persona", () => {
    expect(THE_HUMAN_PROFILE).toBeDefined();
    expect(THE_HUMAN_PROFILE.name).toBe("???");
    expect(THE_HUMAN_PROFILE.id).toBe("the_human");
  });

  it("has personality traits for LLM system prompt", () => {
    expect(THE_HUMAN_PROFILE.personality).toBeDefined();
    expect(THE_HUMAN_PROFILE.personality.length).toBeGreaterThan(0);
  });

  it("has progressive backstory reveal stages", () => {
    expect(THE_HUMAN_PROFILE.backstoryStages).toBeDefined();
    expect(THE_HUMAN_PROFILE.backstoryStages.length).toBeGreaterThanOrEqual(3);
    // Each stage should have a title and content
    for (const stage of THE_HUMAN_PROFILE.backstoryStages) {
      expect(stage.title).toBeDefined();
      expect(stage.content).toBeDefined();
    }
  });

  it("has Machine morality alignment for romance", () => {
    const romanceQuest = COMPANION_QUESTS.find(
      q => q.companionId === "the_human" && q.isRomanceQuest
    );
    expect(romanceQuest).toBeDefined();
    expect(romanceQuest!.moralityRequirement).toBeDefined();
    // The Human requires Machine alignment (negative morality number)
    expect(romanceQuest!.moralityRequirement!).toBeLessThan(0);
  });
});

describe("Elara companion dialog system", () => {
  it("has Elara companion defined", () => {
    expect(ELARA_PROFILE).toBeDefined();
    expect(ELARA_PROFILE.name).toBe("Elara");
    expect(ELARA_PROFILE.id).toBe("elara");
  });

  it("has personality traits for LLM system prompt", () => {
    expect(ELARA_PROFILE.personality).toBeDefined();
    expect(ELARA_PROFILE.personality.length).toBeGreaterThan(0);
  });

  it("has Humanity morality alignment for romance", () => {
    const romanceQuest = COMPANION_QUESTS.find(
      q => q.companionId === "elara" && q.isRomanceQuest
    );
    expect(romanceQuest).toBeDefined();
    expect(romanceQuest!.moralityRequirement).toBeDefined();
    // Elara requires Humanity alignment (positive morality number)
    expect(romanceQuest!.moralityRequirement!).toBeGreaterThan(0);
  });
});

describe("Diplomacy consequences system", () => {
  it("all diplomacy events have valid faction reputation effects", () => {
    for (const event of DIPLOMACY_EVENTS) {
      expect(event.choices.length).toBeGreaterThanOrEqual(2);
      for (const choice of event.choices) {
        expect(choice.reputationDelta).toBeDefined();
        // At least one faction should be affected
        const totalEffect = Object.values(choice.reputationDelta).reduce(
          (sum, val) => sum + Math.abs(val), 0
        );
        expect(totalEffect).toBeGreaterThan(0);
      }
    }
  });

  it("diplomacy events have morality deltas", () => {
    for (const event of DIPLOMACY_EVENTS) {
      for (const choice of event.choices) {
        expect(typeof choice.moralityDelta).toBe("number");
      }
    }
  });

  it("trade NPCs have valid faction affiliations", () => {
    const validFactions = ["empire", "insurgency", "independent", "pirate"];
    for (const npc of TRADE_NPCS) {
      expect(validFactions).toContain(npc.faction);
    }
  });

  it("diplomacy events cover multiple themes", () => {
    const themes = new Set(DIPLOMACY_EVENTS.map(e => e.theme));
    expect(themes.size).toBeGreaterThanOrEqual(3);
  });
});

describe("Cutscene system", () => {
  it("has cutscene scripts for both companions", () => {
    const elaraCutscenes = Object.values(QUEST_CUTSCENES).filter(c => c.theme === "elara");
    const humanCutscenes = Object.values(QUEST_CUTSCENES).filter(c => c.theme === "human");
    expect(elaraCutscenes.length).toBeGreaterThanOrEqual(2);
    expect(humanCutscenes.length).toBeGreaterThanOrEqual(2);
  });

  it("all cutscenes have valid structure", () => {
    for (const cutscene of Object.values(QUEST_CUTSCENES)) {
      expect(cutscene.id).toBeDefined();
      expect(cutscene.title).toBeDefined();
      expect(cutscene.lines.length).toBeGreaterThan(0);
      // Each line must have speaker and text
      for (const line of cutscene.lines) {
        expect(line.speaker).toBeDefined();
        expect(line.text).toBeDefined();
        expect(line.text.length).toBeGreaterThan(0);
      }
    }
  });

  it("cutscenes have mood and effect properties", () => {
    let hasEffects = false;
    for (const cutscene of Object.values(QUEST_CUTSCENES)) {
      for (const line of cutscene.lines) {
        if (line.mood) {
          expect(typeof line.mood).toBe("string");
        }
        if (line.effect) {
          hasEffects = true;
          expect(["shake", "flash", "fadeToBlack", "glitch", "pulse"]).toContain(line.effect);
        }
      }
    }
    expect(hasEffects).toBe(true);
  });

  it("romance cutscenes exist for both companions", () => {
    expect(QUEST_CUTSCENES["cq_elara_romance"]).toBeDefined();
    expect(QUEST_CUTSCENES["cq_human_romance"]).toBeDefined();
  });
});

describe("Inception Ark fleet data integrity", () => {
  it("all 7 arks have card stats", () => {
    expect(INCEPTION_ARKS.length).toBe(7);
    for (const ark of INCEPTION_ARKS) {
      expect(ark.cardStats).toBeDefined();
      expect(ark.cardStats.power).toBeGreaterThan(0);
      expect(ark.cardStats.health).toBeGreaterThan(0);
      expect(ark.cardStats.cost).toBeGreaterThan(0);
    }
  });

  it("all arks have unique player class assignments", () => {
    const classes = INCEPTION_ARKS.map(a => a.playerClass);
    const uniqueClasses = new Set(classes);
    expect(uniqueClasses.size).toBe(INCEPTION_ARKS.length);
  });

  it("all arks have AI guardian names and specializations", () => {
    for (const ark of INCEPTION_ARKS) {
      expect(ark.aiGuardian).toBeDefined();
      expect(ark.aiGuardian.length).toBeGreaterThan(0);
      expect(ark.specialization).toBeDefined();
      expect(ark.specialization.length).toBeGreaterThan(0);
    }
  });
});
