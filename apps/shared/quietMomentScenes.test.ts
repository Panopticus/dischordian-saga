import { describe, expect, it } from "vitest";
import {
  QUIET_MOMENT_SCENES,
  QUIET_MOMENT_TOTAL_COUNT,
  getQuietMomentScene,
  pendingQuietMoment,
  quietMomentsHeard,
} from "./quietMomentScenes";

describe("quietMomentScenes", () => {
  it("ships at least 30 scenes (campfire-target coverage)", () => {
    expect(QUIET_MOMENT_TOTAL_COUNT).toBeGreaterThanOrEqual(30);
    expect(QUIET_MOMENT_SCENES).toHaveLength(QUIET_MOMENT_TOTAL_COUNT);
  });

  it("scene ids are unique", () => {
    const ids = QUIET_MOMENT_SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("seen flags are unique and don't collide with trigger flags", () => {
    const seens = QUIET_MOMENT_SCENES.map((s) => s.seenFlag);
    expect(new Set(seens).size).toBe(seens.length);
    const triggers = new Set(QUIET_MOMENT_SCENES.map((s) => s.triggerFlag));
    for (const seen of seens) {
      expect(triggers.has(seen)).toBe(false);
    }
  });

  it("every scene has a substantive utterance and a canonical speaker", () => {
    for (const scene of QUIET_MOMENT_SCENES) {
      expect(scene.line.trim().length).toBeGreaterThan(40);
      expect(scene.speaker.length).toBeGreaterThan(0);
    }
  });

  it("scenes span Prelude through Act 7 (every act represented)", () => {
    const triggerSet = new Set(QUIET_MOMENT_SCENES.map((s) => s.triggerFlag));
    expect(triggerSet.has("prelude_complete")).toBe(true);
    expect(triggerSet.has("act1_cycle_a_complete")).toBe(true);
    expect(triggerSet.has("act_3_complete")).toBe(true);
    expect(triggerSet.has("act_6_complete")).toBe(true);
    expect(triggerSet.has("convergence_seat_goodbye_walked")).toBe(true);
  });

  it("getQuietMomentScene returns each by id", () => {
    expect(getQuietMomentScene("qm.prelude_close.elara")?.speaker).toBe(
      "elara",
    );
    expect(
      getQuietMomentScene("qm.act5_cades_m7.iron_lion")?.speaker,
    ).toBe("iron_lion");
    expect(getQuietMomentScene("nonexistent")).toBeUndefined();
  });

  describe("pendingQuietMoment", () => {
    it("returns null when nothing has triggered", () => {
      expect(pendingQuietMoment(new Set())).toBeNull();
    });

    it("returns the first triggered-but-unseen scene by canonical order", () => {
      // Both prelude and act1 cycle a are available; prelude has lower
      // order so it should surface first.
      const flags = new Set(["prelude_complete", "act1_cycle_a_complete"]);
      const pending = pendingQuietMoment(flags);
      expect(pending?.id).toBe("qm.prelude_close.elara");
    });

    it("skips scenes whose seenFlag is already set", () => {
      const flags = new Set([
        "prelude_complete",
        "qm_prelude_close_seen",
      ]);
      const pending = pendingQuietMoment(flags);
      // Next scene in order is the human's prelude close
      expect(pending?.id).toBe("qm.prelude_close.human");
    });

    it("returns null when every triggered scene has been seen", () => {
      const flags = new Set([
        "prelude_complete",
        "qm_prelude_close_seen",
        "qm_prelude_close_human_seen",
      ]);
      expect(pendingQuietMoment(flags)).toBeNull();
    });
  });

  describe("quietMomentsHeard", () => {
    it("returns 0 on a fresh save", () => {
      expect(quietMomentsHeard(new Set())).toBe(0);
    });

    it("counts unique seen flags", () => {
      const flags = new Set([
        "qm_prelude_close_seen",
        "qm_cycle_a_close_seen",
        "qm_act5_cades_m7_seen",
      ]);
      expect(quietMomentsHeard(flags)).toBe(3);
    });
  });
});
