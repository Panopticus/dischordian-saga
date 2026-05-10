import { describe, it, expect } from "vitest";
import {
  MISSION_TYPES,
  ROLES_WITH_MISSIONS,
  MIN_MISSIONS_PER_ROLE,
  missionsForRole,
  pickMissionForDeployment,
  missionCountByRole,
} from "./apprenticeMissionTypes";

describe("apprenticeMissionTypes", () => {
  describe("catalog coverage", () => {
    it("every role with missions meets the minimum count", () => {
      const counts = missionCountByRole();
      for (const role of ROLES_WITH_MISSIONS) {
        const min = MIN_MISSIONS_PER_ROLE[role];
        expect(counts[role]).toBeGreaterThanOrEqual(min);
      }
    });

    it("every mission has briefing + crisis + return + ≥ 2 choices", () => {
      for (const m of Object.values(MISSION_TYPES)) {
        expect(m.briefingTemplate.length).toBeGreaterThan(20);
        expect(m.crisisPrompt.length).toBeGreaterThan(20);
        expect(m.returnTemplate.length).toBeGreaterThan(10);
        expect(m.crisisChoices.length).toBeGreaterThanOrEqual(2);
      }
    });

    it("every mission has at least one resonant archetype", () => {
      for (const m of Object.values(MISSION_TYPES)) {
        expect(m.resonantArchetypes.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe("missionsForRole", () => {
    it("companion has missions", () => {
      expect(missionsForRole("companion").length).toBeGreaterThanOrEqual(3);
    });

    it("army_leader has the canon ridge holdfast", () => {
      const ids = missionsForRole("army_leader").map(m => m.id);
      expect(ids).toContain("army_holdfast");
    });
  });

  describe("pickMissionForDeployment", () => {
    it("returns a mission for every role", () => {
      const rng = () => 0.3;
      for (const role of ROLES_WITH_MISSIONS) {
        const mission = pickMissionForDeployment({
          role,
          archetype: "scholar",
          doctrineId: "human_remainder",
          rng,
        });
        expect(mission).not.toBeNull();
        expect(mission?.role).toBe(role);
      }
    });

    it("resonant archetype + resonant doctrine biases the pick", () => {
      const rng = () => 0.5;
      // martyr + human_remainder is resonant for army_letter_home.
      const m = pickMissionForDeployment({
        role: "army_leader", archetype: "martyr",
        doctrineId: "human_remainder", rng,
      });
      expect(m).not.toBeNull();
    });
  });

  describe("crisis choice integrity", () => {
    it("every choice has a non-empty label and outcomeFlavor", () => {
      for (const m of Object.values(MISSION_TYPES)) {
        for (const c of m.crisisChoices) {
          expect(c.label.length).toBeGreaterThan(5);
          expect(c.outcomeFlavor.length).toBeGreaterThan(15);
        }
      }
    });

    it("every choice has number-typed deltas", () => {
      for (const m of Object.values(MISSION_TYPES)) {
        for (const c of m.crisisChoices) {
          expect(typeof c.bondDelta).toBe("number");
          expect(typeof c.corruptionDelta).toBe("number");
          expect(typeof c.architectInfluenceDelta).toBe("number");
          expect(typeof c.rewardMultiplier).toBe("number");
        }
      }
    });
  });
});
