import { describe, it, expect, beforeEach } from "vitest";
import { dischordiaCycleService } from "./dischordiaCycleService";

beforeEach(() => {
  dischordiaCycleService.__resetForTests();
});

describe("dischordiaCycleService (server)", () => {
  describe("getState", () => {
    it("starts at default", () => {
      const state = dischordiaCycleService.getState();
      expect(state.lightEnergy).toBe(0);
      expect(state.darkEnergy).toBe(0);
      expect(state.vortexProximity).toBe(0);
      expect(state.phase).toBe("dawn");
      expect(state.cycleNumber).toBe(1);
      expect(state.history).toEqual([]);
    });

    it("returns a defensive copy (no mutation leaks)", () => {
      const snapshot = dischordiaCycleService.getState();
      snapshot.lightEnergy = 999_999;
      snapshot.history.push({
        cycleNumber: 99,
        advanceTriggeredAt: "",
        reclaimedAt: null,
        durationHours: 0,
        sectorsConsumed: 0,
        sectorsReclaimed: 0,
        outcome: "ongoing",
      });
      const fresh = dischordiaCycleService.getState();
      expect(fresh.lightEnergy).toBe(0);
      expect(fresh.history).toEqual([]);
    });
  });

  describe("applyEnergy", () => {
    it("applies a card battle light win (+20 light)", () => {
      const state = dischordiaCycleService.applyEnergy(
        "card_battle_light_win" as never,
      );
      expect(state.lightEnergy).toBe(20);
      expect(state.darkEnergy).toBe(0);
    });

    it("applies a card battle loss (+15 dark)", () => {
      const state = dischordiaCycleService.applyEnergy(
        "card_battle_loss" as never,
      );
      expect(state.darkEnergy).toBe(15);
    });

    it("accumulates across multiple calls", () => {
      dischordiaCycleService.applyEnergy("card_battle_light_win" as never);
      dischordiaCycleService.applyEnergy("card_battle_light_win" as never);
      dischordiaCycleService.applyEnergy("card_battle_light_win" as never);
      const state = dischordiaCycleService.getState();
      expect(state.lightEnergy).toBe(60);
    });

    it("two_witnesses_refuse increments the vortex clock", () => {
      const state = dischordiaCycleService.applyEnergy(
        "two_witnesses_refuse" as never,
      );
      expect(state.vortexProximity).toBe(1);
      expect(state.darkEnergy).toBe(100);
    });

    it("records the audit trail with userId attribution", () => {
      dischordiaCycleService.applyEnergy("card_battle_light_win" as never, 42);
      const trail = dischordiaCycleService.getRecentAuditTrail(10);
      expect(trail.length).toBe(1);
      expect(trail[0].userId).toBe(42);
      expect(trail[0].actionId).toBe("card_battle_light_win");
      expect(trail[0].lightDelta).toBe(20);
      expect(trail[0].darkDelta).toBe(0);
    });

    it("null userId works for server-initiated gains", () => {
      dischordiaCycleService.applyEnergy("card_battle_light_win" as never);
      const trail = dischordiaCycleService.getRecentAuditTrail(1);
      expect(trail[0].userId).toBeNull();
    });
  });

  describe("applyRawDelta", () => {
    it("applies a positive light reward", () => {
      const state = dischordiaCycleService.applyRawDelta({
        light: 500,
        source: "slideshow_last_words",
      });
      expect(state.lightEnergy).toBe(500);
    });

    it("clamps vortex proximity", () => {
      dischordiaCycleService.applyRawDelta({ vortex: 200 });
      expect(dischordiaCycleService.getState().vortexProximity).toBe(100);
    });

    it("records the audit trail with the source tag", () => {
      dischordiaCycleService.applyRawDelta({
        light: 100,
        source: "test_event",
        userId: 7,
      });
      const trail = dischordiaCycleService.getRecentAuditTrail(1);
      expect(trail[0].actionId).toBe("test_event");
      expect(trail[0].userId).toBe(7);
      expect(trail[0].lightDelta).toBe(100);
    });

    it("flips the phase when light crosses 1M", () => {
      dischordiaCycleService.applyRawDelta({ light: 1_200_000 });
      expect(dischordiaCycleService.getState().phase).toBe("light_holds");
    });

    it("flips the phase to dimming when dark crosses 100k", () => {
      dischordiaCycleService.applyRawDelta({ dark: 150_000 });
      expect(dischordiaCycleService.getState().phase).toBe("dimming");
    });
  });

  describe("triggerVortexAdvance + reclamation flow", () => {
    it("triggerVortexAdvance sets the phase", () => {
      const state = dischordiaCycleService.triggerVortexAdvance();
      expect(state.phase).toBe("vortex_advance");
    });

    it("vortex_advance refuses to auto-exit on raw light deltas", () => {
      dischordiaCycleService.triggerVortexAdvance();
      dischordiaCycleService.applyRawDelta({ light: 2_000_000 });
      expect(dischordiaCycleService.getState().phase).toBe("vortex_advance");
    });

    it("triggerReclamation + completeReclamation advances cycleNumber", () => {
      dischordiaCycleService.triggerVortexAdvance();
      dischordiaCycleService.triggerReclamation();
      const state = dischordiaCycleService.completeReclamation(5);
      expect(state.phase).toBe("dawn");
      expect(state.cycleNumber).toBe(2);
      expect(state.history.length).toBe(1);
      expect(state.history[0].sectorsReclaimed).toBe(5);
      expect(state.lightEnergy).toBe(500); // +100 per sector reclaimed
    });
  });

  describe("checkVortexTrigger", () => {
    it("true at 10% lit", () => {
      expect(dischordiaCycleService.checkVortexTrigger(0.1)).toBe(true);
    });
    it("false at 50% lit", () => {
      expect(dischordiaCycleService.checkVortexTrigger(0.5)).toBe(false);
    });
    it("false once vortex_advance is already active", () => {
      dischordiaCycleService.triggerVortexAdvance();
      expect(dischordiaCycleService.checkVortexTrigger(0.05)).toBe(false);
    });
  });

  describe("getRecentAuditTrail", () => {
    it("returns entries in reverse-chronological order", () => {
      dischordiaCycleService.applyEnergy("card_battle_light_win" as never, 1);
      dischordiaCycleService.applyEnergy("card_battle_loss" as never, 2);
      dischordiaCycleService.applyEnergy("crew_mission_compassionate" as never, 3);
      const trail = dischordiaCycleService.getRecentAuditTrail(10);
      expect(trail.length).toBe(3);
      expect(trail[0].userId).toBe(3);
      expect(trail[1].userId).toBe(2);
      expect(trail[2].userId).toBe(1);
    });

    it("respects the limit parameter", () => {
      for (let i = 0; i < 20; i++) {
        dischordiaCycleService.applyEnergy(
          "card_battle_light_win" as never,
          i,
        );
      }
      const trail = dischordiaCycleService.getRecentAuditTrail(5);
      expect(trail.length).toBe(5);
    });
  });

  describe("__resetForTests", () => {
    it("clears state and audit trail", () => {
      dischordiaCycleService.applyEnergy("two_witnesses_forgive" as never);
      dischordiaCycleService.triggerVortexAdvance();
      dischordiaCycleService.__resetForTests();
      const state = dischordiaCycleService.getState();
      expect(state.lightEnergy).toBe(0);
      expect(state.darkEnergy).toBe(0);
      expect(state.phase).toBe("dawn");
      expect(dischordiaCycleService.getRecentAuditTrail().length).toBe(0);
    });
  });
});
