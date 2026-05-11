import { describe, expect, it } from "vitest";

import {
  activeStoryHooks,
  activeStoryHooksForRoom,
  pickAxis13ForRoom,
} from "./hookDispatcher";
import {
  SEED_STORYTELLER_HOOKS,
  STORYTELLER_HOOK_TOTAL,
  storyHooksForRoom,
} from "./storyHookRegistry";

describe("storyteller hook registry — Phase H.G", () => {
  it("seed registry has hooks for every producer axis-13 variant", () => {
    expect(STORYTELLER_HOOK_TOTAL).toBeGreaterThan(300);
    expect(STORYTELLER_HOOK_TOTAL).toBeLessThan(1000);
  });

  it("every hook has a synthetic id `<zipDir>:<variantKey>`", () => {
    for (const h of SEED_STORYTELLER_HOOKS) {
      expect(h.id).toBe(`${h.roomZipDir}:${h.variantKey}`);
      expect(h.variantKey).toBe(`${h.axisKey}_${h.axisValue}`);
    }
  });

  it("every hook has a synthesized flagTrigger of form storyhook_<zipDir>_<variantKey>", () => {
    for (const h of SEED_STORYTELLER_HOOKS.slice(0, 50)) {
      expect(h.flagTrigger).toBe(
        `storyhook_${h.roomZipDir}_${h.variantKey}`,
      );
    }
  });

  it("storyHooksForRoom('cryo_bay') returns the room's hooks", () => {
    const hooks = storyHooksForRoom("cryo_bay");
    expect(hooks.length).toBeGreaterThan(0);
    for (const h of hooks) {
      expect(h.roomZipDir).toBe("cryo_bay");
    }
  });
});

describe("hookDispatcher — Phase H.G", () => {
  it("activeStoryHooks returns empty when no flags set", () => {
    expect(activeStoryHooks({ narrativeFlags: {} })).toEqual([]);
  });

  it("activeStoryHooks returns matching hooks when a flag is set", () => {
    const trigger = SEED_STORYTELLER_HOOKS[0].flagTrigger;
    const result = activeStoryHooks({
      narrativeFlags: { [trigger]: true },
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].flagTrigger).toBe(trigger);
  });

  it("activeStoryHooksForRoom is scoped", () => {
    const cryoHook = storyHooksForRoom("cryo_bay")[0];
    expect(cryoHook).toBeDefined();
    const result = activeStoryHooksForRoom(
      { narrativeFlags: { [cryoHook!.flagTrigger]: true } },
      "cryo_bay",
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].roomZipDir).toBe("cryo_bay");
    // Other room: empty
    const otherResult = activeStoryHooksForRoom(
      { narrativeFlags: { [cryoHook!.flagTrigger]: true } },
      "medical_bay",
    );
    expect(otherResult).toEqual([]);
  });

  it("pickAxis13ForRoom returns variantKey when a hook is active", () => {
    const cryoHook = storyHooksForRoom("cryo_bay")[0];
    expect(cryoHook).toBeDefined();
    const v = pickAxis13ForRoom(
      { narrativeFlags: { [cryoHook!.flagTrigger]: true } },
      "cryo_bay",
    );
    expect(v).toBe(cryoHook!.variantKey);
  });

  it("pickAxis13ForRoom returns undefined when no hooks active", () => {
    expect(pickAxis13ForRoom({ narrativeFlags: {} }, "cryo_bay")).toBeUndefined();
  });
});
