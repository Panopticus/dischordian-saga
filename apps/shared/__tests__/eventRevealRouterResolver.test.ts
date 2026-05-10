import { describe, expect, it } from "vitest";
import {
  eventRevealSeenFlag,
  resolvePendingEventReveal,
} from "@/components/cutscenes/EventRevealRouter";
import { ALL_EMERGENT_EVENTS } from "@shared/livingUniverseEvents";
import { livingUniverseEventActiveFlag } from "@/hooks/useLivingShipSensor";

describe("EventRevealRouter — resolvePendingEventReveal", () => {
  it("returns null when no flags are set", () => {
    expect(resolvePendingEventReveal({})).toBeNull();
  });

  it("returns the matching event when its _active flag fires AND it has a cutsceneVideoRelPath", () => {
    const necromancer = ALL_EMERGENT_EVENTS.find(
      (e) => e.id === "necromancer_return",
    );
    expect(necromancer?.cutsceneVideoRelPath).toBeDefined();
    const flags = { [livingUniverseEventActiveFlag("necromancer_return")]: true };
    expect(resolvePendingEventReveal(flags)?.id).toBe("necromancer_return");
  });

  it("skips events without a cutsceneVideoRelPath silently", () => {
    // vox_revelation has no cutsceneVideoRelPath today (producer
    // hasn't shipped a reveal); it must NOT trigger the router.
    const vox = ALL_EMERGENT_EVENTS.find((e) => e.id === "vox_revelation");
    expect(vox?.cutsceneVideoRelPath).toBeUndefined();
    const flags = { [livingUniverseEventActiveFlag("vox_revelation")]: true };
    expect(resolvePendingEventReveal(flags)).toBeNull();
  });

  it("skips an event whose seen flag is already set", () => {
    const flags = {
      [livingUniverseEventActiveFlag("necromancer_return")]: true,
      [eventRevealSeenFlag("necromancer_return")]: true,
    };
    expect(resolvePendingEventReveal(flags)).toBeNull();
  });

  it("when multiple events activate, returns the first in registry order", () => {
    const flags = {
      [livingUniverseEventActiveFlag("necromancer_return")]: true,
      [livingUniverseEventActiveFlag("dreamer_awakening")]: true,
    };
    // ALL_EMERGENT_EVENTS lists necromancer first.
    expect(resolvePendingEventReveal(flags)?.id).toBe("necromancer_return");
  });

  it("non-true active values do not count as activated", () => {
    expect(
      resolvePendingEventReveal({
        [livingUniverseEventActiveFlag("necromancer_return")]: false,
      }),
    ).toBeNull();
    expect(
      resolvePendingEventReveal({
        [livingUniverseEventActiveFlag("necromancer_return")]: 1 as unknown as boolean,
      }),
    ).toBeNull();
  });

  it("seen flag follows the documented convention", () => {
    expect(eventRevealSeenFlag("necromancer_return")).toBe(
      "event_necromancer_return_reveal_seen",
    );
  });

  it("each of the 5 producer-delivered reveal events resolves via its active flag", () => {
    const expected = [
      "necromancer_return",
      "dreamer_awakening",
      "terminus_advance",
      "antiquarian_revelation",
      "shadow_tongue_edit",
    ];
    for (const id of expected) {
      const found = resolvePendingEventReveal({
        [livingUniverseEventActiveFlag(id)]: true,
      });
      expect(found?.id).toBe(id);
      expect(found?.cutsceneVideoRelPath).toBeDefined();
    }
  });
});
