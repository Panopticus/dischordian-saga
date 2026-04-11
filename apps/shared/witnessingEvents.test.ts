import { describe, it, expect } from "vitest";
import {
  getWitnessingMilestone,
  listWitnessingMilestones,
  WITNESSING_MILESTONES,
  type WitnessingMilestoneId,
} from "./witnessingEvents";

describe("witnessingEvents (§14.1 Living Universe bridge)", () => {
  describe("registry structure", () => {
    it("has exactly the six milestones from §14.1", () => {
      const ids = Object.keys(WITNESSING_MILESTONES).sort();
      expect(ids).toEqual(
        [
          "bulb_dims",
          "lions_last_broadcast",
          "sector_wakes",
          "silence_of_two_witnesses",
          "two_witnesses_meet",
          "two_witnesses_remember",
        ].sort(),
      );
    });

    it("every milestone has title, description, and raisesFlag", () => {
      for (const milestone of listWitnessingMilestones()) {
        expect(milestone.title.length).toBeGreaterThan(0);
        expect(milestone.description.length).toBeGreaterThan(0);
        expect(milestone.raisesFlag).toMatch(/^event_/);
      }
    });

    it("every raisesFlag value is unique", () => {
      const flags = listWitnessingMilestones().map((m) => m.raisesFlag);
      expect(new Set(flags).size).toBe(flags.length);
    });

    it("every milestone id matches its key in the registry", () => {
      for (const [key, milestone] of Object.entries(WITNESSING_MILESTONES)) {
        expect(milestone.id).toBe(key);
      }
    });
  });

  describe("specific milestones", () => {
    it("Two Witnesses Remember matches §14.1 + §1.5 trust 40", () => {
      const m = getWitnessingMilestone("two_witnesses_remember");
      expect(m).toBeDefined();
      expect(m!.raisesFlag).toBe("event_two_witnesses_remember");
      expect(m!.lightEnergyReward).toBeGreaterThan(0);
      expect(m!.npcReactions.elara).toBeDefined();
      expect(m!.npcReactions.the_human).toBeDefined();
    });

    it("Silence of Two Witnesses awards no light (it's a freeze)", () => {
      const m = getWitnessingMilestone("silence_of_two_witnesses");
      expect(m!.lightEnergyReward).toBe(0);
      // The proposal explicitly says neither narrator speaks
      // for 30 minutes real-time during this event.
      expect(m!.npcReactions.elara).toContain("says nothing");
      expect(m!.npcReactions.the_human).toContain("says nothing");
    });

    it("Two Witnesses Meet defers the reward to the §3.6 choice rows", () => {
      const m = getWitnessingMilestone("two_witnesses_meet");
      expect(m!.lightEnergyReward).toBe(0);
    });

    it("The Bulb Dims costs dark energy, not light", () => {
      const m = getWitnessingMilestone("bulb_dims");
      expect(m!.darkEnergyCost).toBeGreaterThan(0);
      expect(m!.lightEnergyReward).toBe(0);
    });

    it("A Sector Wakes rewards +100 community light", () => {
      const m = getWitnessingMilestone("sector_wakes");
      expect(m!.lightEnergyReward).toBe(100);
    });

    it("The Lion's Last Broadcast narrator reaction is the Antiquarian's", () => {
      const m = getWitnessingMilestone("lions_last_broadcast");
      expect(m!.npcReactions.the_antiquarian).toBeDefined();
      expect(m!.npcReactions.elara).toBeUndefined();
      expect(m!.npcReactions.the_human).toBeUndefined();
    });
  });

  describe("getWitnessingMilestone edge cases", () => {
    it("returns undefined for unknown ids", () => {
      expect(
        getWitnessingMilestone("not_a_real_milestone" as WitnessingMilestoneId),
      ).toBeUndefined();
    });
  });
});
