import { describe, expect, it } from "vitest";
import {
  resolvePendingWheelReaction,
  wheelReactionSeenFlag,
} from "@/components/cutscenes/WheelReactionRouter";
import { WHEEL_REACTION_CUTSCENES } from "@shared/wheelReactionCutscenes";

describe("WheelReactionRouter — resolvePendingWheelReaction", () => {
  it("returns null when no flags are set", () => {
    expect(resolvePendingWheelReaction({})).toBeNull();
  });

  it("returns the matching def when an act3 path flag fires", () => {
    expect(
      resolvePendingWheelReaction({ act3_path_transparent_chosen: true })?.id,
    ).toBe("wheel_act3_transparent");
    expect(
      resolvePendingWheelReaction({ act3_path_pragmatic_chosen: true })?.id,
    ).toBe("wheel_act3_pragmatic");
    expect(
      resolvePendingWheelReaction({ act3_path_full_secret_chosen: true })?.id,
    ).toBe("wheel_act3_full_secret");
  });

  it("returns the matching def when an act4 outcome flag fires", () => {
    expect(
      resolvePendingWheelReaction({ act4_outcome_reconciled: true })?.id,
    ).toBe("wheel_act4_reconciled");
    expect(
      resolvePendingWheelReaction({ act4_outcome_fragile_trust: true })?.id,
    ).toBe("wheel_act4_fragile_trust");
    expect(
      resolvePendingWheelReaction({ act4_outcome_broken_trust: true })?.id,
    ).toBe("wheel_act4_broken_trust");
  });

  it("skips an entry whose seen flag is already set", () => {
    const flags = {
      act3_path_transparent_chosen: true,
      [wheelReactionSeenFlag("wheel_act3_transparent")]: true,
    };
    expect(resolvePendingWheelReaction(flags)).toBeNull();
  });

  it("when multiple triggers fire, returns the first in registry order (act3 before act4)", () => {
    const flags = {
      act3_path_pragmatic_chosen: true,
      act4_outcome_broken_trust: true,
    };
    expect(resolvePendingWheelReaction(flags)?.id).toBe("wheel_act3_pragmatic");
  });

  it("non-true values do not count as triggered", () => {
    expect(
      resolvePendingWheelReaction({ act3_path_transparent_chosen: false }),
    ).toBeNull();
    expect(
      resolvePendingWheelReaction({
        act4_outcome_reconciled: 1 as unknown as boolean,
      }),
    ).toBeNull();
  });

  it("seen flag follows the documented convention", () => {
    expect(wheelReactionSeenFlag("wheel_act3_transparent")).toBe(
      "wheel_reaction_wheel_act3_transparent_seen",
    );
  });

  it("every registered wheel-reaction can fire via its trigger", () => {
    for (const def of WHEEL_REACTION_CUTSCENES) {
      const found = resolvePendingWheelReaction({ [def.triggerFlag]: true });
      expect(found?.id).toBe(def.id);
    }
  });
});
