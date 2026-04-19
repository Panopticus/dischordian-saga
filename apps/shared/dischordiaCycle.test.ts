import { describe, it, expect } from "vitest";
import {
  applyEnergyGain,
  calculateBalance,
  checkLightEnergyThresholdCrossing,
  clampProximity,
  completeReclamation,
  DEFAULT_DISCHORDIA_CYCLE_STATE,
  ENERGY_GAIN_TABLE,
  getDarkEnergyDescription,
  getEnergyGain,
  getGalaxyBrightnessTier,
  getLightEnergyDescription,
  getVortexProximityDescription,
  LIGHT_ENERGY_THRESHOLDS,
  recomputeDerived,
  RECLAMATION_CHAIN,
  SECTOR_LIGHT_INFO,
  shouldTriggerVortexAdvance,
  triggerReclamation,
  triggerVortexAdvance,
  type DischordiaCycleState,
} from "./dischordiaCycle";

describe("dischordiaCycle", () => {
  describe("poetic descriptors", () => {
    it("light energy floor says galaxy is a rumor of stars", () => {
      expect(getLightEnergyDescription(0)).toBe("The galaxy is a rumor of stars.");
    });
    it("light energy ceiling locks in THE LIGHT HOLDS", () => {
      expect(getLightEnergyDescription(2_000_000)).toBe("THE LIGHT HOLDS.");
    });
    it("dark energy floor is a shadow in the gutter of the sky", () => {
      expect(getDarkEnergyDescription(0)).toBe("A shadow in the gutter of the sky.");
    });
    it("dark energy ceiling locks in THE BULB IS BREAKING", () => {
      expect(getDarkEnergyDescription(2_000_000)).toBe("THE BULB IS BREAKING.");
    });
    it("dark energy crosses thresholds monotonically", () => {
      const thresholds = [50_000, 150_000, 350_000, 550_000, 750_000, 950_000];
      const texts = thresholds.map(getDarkEnergyDescription);
      // No two adjacent thresholds should produce the same text.
      for (let i = 1; i < texts.length; i++) {
        expect(texts[i]).not.toBe(texts[i - 1]);
      }
    });
  });

  describe("vortex proximity", () => {
    it("is hidden below 50%", () => {
      expect(getVortexProximityDescription(0)).toBeNull();
      expect(getVortexProximityDescription(50)).toBeNull();
    });
    it("shows a drum in the deep sky above 50%", () => {
      expect(getVortexProximityDescription(60)).toBe("A drum in the deep sky.");
    });
    it("escalates at 75 and 90", () => {
      expect(getVortexProximityDescription(80)).toBe("The drum is closer.");
      expect(getVortexProximityDescription(95)).toBe("The drum is here.");
    });
    it("clamps values outside 0..100", () => {
      expect(clampProximity(-10)).toBe(0);
      expect(clampProximity(120)).toBe(100);
      expect(clampProximity(42)).toBe(42);
    });
  });

  describe("galaxy brightness tiers", () => {
    it("full bloom unlocks Elara's warm callback", () => {
      const tier = getGalaxyBrightnessTier(0.9);
      expect(tier.tier).toBe("full_bloom");
      expect(tier.elaraCallback).not.toBeNull();
      expect(tier.musicLayer).toBe("warm");
      expect(tier.triggersVortexAdvance).toBe(false);
    });
    it("normal tier stays silent", () => {
      expect(getGalaxyBrightnessTier(0.65).tier).toBe("normal");
    });
    it("dimming tier has no warm callback", () => {
      const tier = getGalaxyBrightnessTier(0.35);
      expect(tier.tier).toBe("dimming");
      expect(tier.elaraCallback).toBeNull();
    });
    it("long night triggers vortex advance", () => {
      const tier = getGalaxyBrightnessTier(0.1);
      expect(tier.tier).toBe("long_night");
      expect(tier.triggersVortexAdvance).toBe(true);
      expect(tier.musicLayer).toBe("vortex");
    });
  });

  describe("energy gain table", () => {
    it("has unique ids", () => {
      const ids = new Set(ENERGY_GAIN_TABLE.map((a) => a.id));
      expect(ids.size).toBe(ENERGY_GAIN_TABLE.length);
    });
    it("includes the Two Witnesses moral extremes from §3.6", () => {
      expect(getEnergyGain("two_witnesses_forgive")?.light).toBe(200);
      const refuse = getEnergyGain("two_witnesses_refuse");
      expect(refuse?.dark).toBe(100);
      expect(refuse?.vortex).toBe(1);
    });
    it("card battle light win is +20 light", () => {
      expect(getEnergyGain("card_battle_light_win")?.light).toBe(20);
    });
    it("pet death (non memorial) is +25 dark", () => {
      expect(getEnergyGain("pet_death_non_memorial")?.dark).toBe(25);
    });
  });

  describe("applyEnergyGain", () => {
    it("adds light energy and recomputes balance", () => {
      const next = applyEnergyGain(DEFAULT_DISCHORDIA_CYCLE_STATE, "card_battle_light_win");
      expect(next.lightEnergy).toBe(20);
      expect(next.darkEnergy).toBe(0);
      expect(next.phase).toBe("dawn");
    });
    it("a two_witnesses_refuse increments vortex proximity", () => {
      const next = applyEnergyGain(DEFAULT_DISCHORDIA_CYCLE_STATE, "two_witnesses_refuse");
      expect(next.vortexProximity).toBe(1);
      expect(next.darkEnergy).toBe(100);
    });
    it("does not mutate the input state", () => {
      const base = { ...DEFAULT_DISCHORDIA_CYCLE_STATE };
      applyEnergyGain(base, "card_battle_light_win");
      expect(base.lightEnergy).toBe(0);
      expect(base.darkEnergy).toBe(0);
    });
  });

  describe("balance calculation", () => {
    it("returns balanced when meters are near-equal", () => {
      expect(calculateBalance(50_000, 50_000)).toBe("balanced");
    });
    it("returns dark_ascending when dark leads by > 100k", () => {
      expect(calculateBalance(100_000, 300_000)).toBe("dark_ascending");
    });
    it("returns light_ascending when light leads by > 100k", () => {
      expect(calculateBalance(400_000, 100_000)).toBe("light_ascending");
    });
  });

  describe("phase transitions via recomputeDerived", () => {
    it("moves from dawn to dimming once dark crosses 100k", () => {
      const state: DischordiaCycleState = {
        ...DEFAULT_DISCHORDIA_CYCLE_STATE,
        darkEnergy: 150_000,
      };
      const next = recomputeDerived(state);
      expect(next.phase).toBe("dimming");
    });
    it("moves to long_night once dark crosses 500k", () => {
      const next = recomputeDerived({
        ...DEFAULT_DISCHORDIA_CYCLE_STATE,
        darkEnergy: 600_000,
      });
      expect(next.phase).toBe("long_night");
    });
    it("locks to light_holds once light crosses 1M", () => {
      const next = recomputeDerived({
        ...DEFAULT_DISCHORDIA_CYCLE_STATE,
        lightEnergy: 1_200_000,
        darkEnergy: 200_000,
      });
      expect(next.phase).toBe("light_holds");
    });
    it("never auto-exits the vortex_advance or reclamation phases", () => {
      const vortex = recomputeDerived({
        ...DEFAULT_DISCHORDIA_CYCLE_STATE,
        phase: "vortex_advance",
        lightEnergy: 2_000_000,
      });
      expect(vortex.phase).toBe("vortex_advance");
      const reclamation = recomputeDerived({
        ...DEFAULT_DISCHORDIA_CYCLE_STATE,
        phase: "reclamation",
        darkEnergy: 2_000_000,
      });
      expect(reclamation.phase).toBe("reclamation");
    });
  });

  describe("vortex advance + reclamation flow", () => {
    it("triggers vortex advance only when lit ratio < 20% and phase is stable", () => {
      expect(shouldTriggerVortexAdvance(DEFAULT_DISCHORDIA_CYCLE_STATE, 0.5)).toBe(false);
      expect(shouldTriggerVortexAdvance(DEFAULT_DISCHORDIA_CYCLE_STATE, 0.1)).toBe(true);
    });
    it("does not double-trigger while vortex_advance is live", () => {
      const state = triggerVortexAdvance(DEFAULT_DISCHORDIA_CYCLE_STATE);
      expect(shouldTriggerVortexAdvance(state, 0.05)).toBe(false);
    });
    it("reclamation restores dawn and bumps cycle number", () => {
      const advanced = triggerVortexAdvance(DEFAULT_DISCHORDIA_CYCLE_STATE);
      const reclaimed = completeReclamation(triggerReclamation(advanced), 3);
      expect(reclaimed.phase).toBe("dawn");
      expect(reclaimed.cycleNumber).toBe(2);
      expect(reclaimed.history).toHaveLength(1);
      expect(reclaimed.history[0].sectorsReclaimed).toBe(3);
      expect(reclaimed.lightEnergy).toBe(300);
    });
  });

  describe("sector light info", () => {
    it("has an info record for every SectorLightState", () => {
      for (const key of Object.keys(SECTOR_LIGHT_INFO)) {
        const info = SECTOR_LIGHT_INFO[key as keyof typeof SECTOR_LIGHT_INFO];
        expect(info.label).toBeTruthy();
        expect(info.description).toBeTruthy();
      }
    });
  });

  describe("reclamation chain", () => {
    it("has monotonically increasing stages", () => {
      for (let i = 0; i < RECLAMATION_CHAIN.length; i++) {
        expect(RECLAMATION_CHAIN[i].stage).toBe(i + 1);
      }
    });
    it("ends with a cutscene step", () => {
      const last = RECLAMATION_CHAIN[RECLAMATION_CHAIN.length - 1];
      expect(last.gameMode).toBe("cutscene");
      expect(last.objective.type).toBe("cutscene_play");
    });
  });

  describe("§17.4 Light Energy thresholds (Last Words integration)", () => {
    it("includes the Last Words +500 energy gain action", () => {
      const action = getEnergyGain("last_words_cinematic_seen");
      expect(action).toBeDefined();
      expect(action?.light).toBe(500);
      expect(action?.dark).toBe(0);
    });

    it("applies +500 Light on the Last Words cinematic gain", () => {
      const next = applyEnergyGain(
        DEFAULT_DISCHORDIA_CYCLE_STATE,
        "last_words_cinematic_seen",
      );
      expect(next.lightEnergy).toBe(500);
    });

    it("exports five canonical thresholds in ascending order", () => {
      expect(LIGHT_ENERGY_THRESHOLDS.length).toBe(5);
      for (let i = 1; i < LIGHT_ENERGY_THRESHOLDS.length; i++) {
        expect(LIGHT_ENERGY_THRESHOLDS[i].value).toBeGreaterThan(
          LIGHT_ENERGY_THRESHOLDS[i - 1].value,
        );
      }
    });

    it("detects the first-thousand threshold crossing from a +500 gain", () => {
      // Player at 750 Light; Last Words pushes to 1250 → crosses 1000.
      const crossed = checkLightEnergyThresholdCrossing(750, 1250);
      expect(crossed?.value).toBe(1_000);
      expect(crossed?.acknowledgment).toContain("You contributed");
    });

    it("returns null when a gain doesn't cross any threshold", () => {
      const crossed = checkLightEnergyThresholdCrossing(200, 700);
      expect(crossed).toBeNull();
    });

    it("detects higher-tier thresholds for large jumps", () => {
      const crossed = checkLightEnergyThresholdCrossing(9_500, 10_500);
      expect(crossed?.value).toBe(10_000);
    });

    it("returns only the first (lowest) crossed threshold on multi-cross gains", () => {
      // Huge jump crossing 1k, 10k, 100k, 1M — returns the lowest (1000).
      const crossed = checkLightEnergyThresholdCrossing(500, 2_000_000);
      expect(crossed?.value).toBe(1_000);
    });
  });
});
