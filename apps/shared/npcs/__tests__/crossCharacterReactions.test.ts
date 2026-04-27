// apps/shared/npcs/__tests__/crossCharacterReactions.test.ts
//
// Validates the cross-character reaction registry stays in sync with the
// actual NpcLine banks.

import { describe, it, expect } from "vitest";
import {
  CROSS_CHARACTER_REACTIONS,
  reactorsForFlag,
  settersForFlag,
  allRegisteredFlags,
  flagsActuallyWrittenByBanks,
  flagsActuallyReactedByBanks,
} from "../crossCharacterReactions";

describe("crossCharacterReactions registry", () => {
  it("contains entries for every Phase 3 cross-character canon", () => {
    expect(CROSS_CHARACTER_REACTIONS.length).toBeGreaterThan(0);
  });

  it("registry flags are unique (no duplicates)", () => {
    const flags = allRegisteredFlags();
    expect(flags.length).toBe(new Set(flags).size);
  });

  it("every entry's setBy is non-empty", () => {
    for (const entry of CROSS_CHARACTER_REACTIONS) {
      expect(entry.setBy.length, entry.flag).toBeGreaterThan(0);
    }
  });

  it("every entry's reactsBy is non-empty (use 'future_reader' if no current reactor)", () => {
    for (const entry of CROSS_CHARACTER_REACTIONS) {
      expect(entry.reactsBy.length, entry.flag).toBeGreaterThan(0);
    }
  });
});

describe("registry ↔ banks consistency", () => {
  it("every flag actually written by banks is present in the registry", () => {
    const written = flagsActuallyWrittenByBanks();
    const registered = new Set(allRegisteredFlags());
    const missing = written.filter(f => !registered.has(f));
    expect(
      missing,
      `Bank lines write flags that are not in the cross-character registry: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("every flag actually reacted-to by banks is present in the registry", () => {
    const reacted = flagsActuallyReactedByBanks();
    const registered = new Set(allRegisteredFlags());
    const missing = reacted.filter(f => !registered.has(f));
    expect(
      missing,
      `Bank lines react to flags that are not in the cross-character registry: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("every reactsToPublicFlag references a flag at least one bank actually writes (or 'system')", () => {
    const reacted = flagsActuallyReactedByBanks();
    const written = new Set(flagsActuallyWrittenByBanks());
    const dangling: string[] = [];
    for (const flag of reacted) {
      const setters = settersForFlag(flag);
      const isSystemSet = setters.includes("system");
      const isBankSet = written.has(flag);
      if (!isSystemSet && !isBankSet) {
        dangling.push(flag);
      }
    }
    expect(
      dangling,
      `Reactive flags with no canonical setter (would never fire): ${dangling.join(", ")}`,
    ).toEqual([]);
  });
});

describe("reactorsForFlag / settersForFlag lookups", () => {
  it("Touché canon resolves correctly", () => {
    expect(settersForFlag("vex_locked_out_by_locke_exclusivity")).toContain("adjudicator_locke");
    expect(reactorsForFlag("vex_locked_out_by_locke_exclusivity")).toContain("vex_solene");
    expect(reactorsForFlag("vex_locked_out_by_locke_exclusivity")).toContain("adjudicator_locke");
  });

  it("Hierophant midwifery canon resolves correctly", () => {
    expect(settersForFlag("hierophant_midwifed_companion_first_word")).toContain("wraith_calder");
    expect(reactorsForFlag("hierophant_midwifed_companion_first_word")).toContain("dmc_clone_companion");
  });

  it("Companion-in-chamber canon is system-set", () => {
    expect(settersForFlag("dmc_companion_present_in_chamber")).toContain("system");
    expect(reactorsForFlag("dmc_companion_present_in_chamber")).toContain("wraith_calder");
  });

  it("Seer Inheriting band ripples to multiple reactors", () => {
    const reactors = reactorsForFlag("seer_confidant_band_reached");
    expect(reactors).toContain("the_degen");
    expect(reactors).toContain("the_meme");
  });

  it("unknown flag returns empty arrays", () => {
    expect(reactorsForFlag("does_not_exist")).toEqual([]);
    expect(settersForFlag("does_not_exist")).toEqual([]);
  });
});
