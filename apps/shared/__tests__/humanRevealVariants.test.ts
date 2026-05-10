import { describe, expect, it } from "vitest";
import {
  HUMAN_REVEAL_BRANCHES,
  HUMAN_REVEAL_VARIANTS,
  HUMAN_REVEAL_VARIANT_TOTAL,
  deriveHumanRevealBranch,
  resolveHumanRevealVariant,
} from "@shared/humanRevealVariants";

describe("humanRevealVariants — parity", () => {
  it("registers exactly 4 branch variants", () => {
    expect(HUMAN_REVEAL_VARIANT_TOTAL).toBe(4);
    expect(HUMAN_REVEAL_VARIANTS).toHaveLength(4);
    expect(HUMAN_REVEAL_BRANCHES).toEqual([
      "convergence",
      "fragment",
      "full",
      "ghost",
    ]);
  });

  it("ids match the producer-delivered MP4 basename pattern", () => {
    for (const def of HUMAN_REVEAL_VARIANTS) {
      expect(def.id).toBe(`human_reveal_to_${def.branch}`);
      expect(def.videoRelPath).toBe(`videos/human_reveal/${def.id}.mp4`);
    }
  });

  it("resolveHumanRevealVariant round-trips every branch", () => {
    for (const branch of HUMAN_REVEAL_BRANCHES) {
      const def = resolveHumanRevealVariant(branch);
      expect(def?.branch).toBe(branch);
    }
  });

  it("deriveHumanRevealBranch follows precedence: convergence > elara > human > refused", () => {
    // Canonical convergence flag (set by useLivingUniverseSync when
    // the convergence_threshold event activates).
    expect(
      deriveHumanRevealBranch({
        living_universe_event_convergence_threshold_active: true,
        breaking_point_chose_elara: true,
      }),
    ).toBe("convergence");
    // Legacy alias still honored.
    expect(
      deriveHumanRevealBranch({
        convergence_threshold_reached: true,
        breaking_point_chose_elara: true,
      }),
    ).toBe("convergence");
    expect(
      deriveHumanRevealBranch({ breaking_point_chose_elara: true }),
    ).toBe("fragment");
    expect(
      deriveHumanRevealBranch({ breaking_point_chose_human: true }),
    ).toBe("full");
    expect(
      deriveHumanRevealBranch({ breaking_point_refused: true }),
    ).toBe("ghost");
    expect(deriveHumanRevealBranch({})).toBeNull();
  });
});
