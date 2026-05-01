import { afterEach, describe, expect, it } from "vitest";

import {
  clearDynamicMysteryRegistry,
  dynamicMysteryCount,
  lookupEpisode,
  lookupMystery,
  registerCompiledMystery,
} from "./mysteryRegistry";
import {
  TEMPLATE_VOTE_RESOLUTION_SHORT,
  compileMysterySeed,
  seedFromVoteClosure,
} from "@shared/mysteryTemplates";
import type { EpisodeId, MysteryId } from "@shared/mysteryTypes";

afterEach(() => clearDynamicMysteryRegistry());

describe("mysteryRegistry — composite lookup", () => {
  it("returns the static authored mystery when one exists", () => {
    const wraith = lookupMystery("mystery.wraith_calder" as MysteryId);
    expect(wraith).not.toBeNull();
    expect(wraith!.title).toBe("The Eighth Death and the Names");
  });

  it("returns null for an unknown id with empty dynamic registry", () => {
    expect(lookupMystery("mystery.nonexistent" as MysteryId)).toBeNull();
  });

  it("registerCompiledMystery makes a compiled definition findable", () => {
    const seed = seedFromVoteClosure("ap_v1", "a", TEMPLATE_VOTE_RESOLUTION_SHORT);
    const def = compileMysterySeed(seed)!;
    registerCompiledMystery(def);

    expect(lookupMystery(def.id)).not.toBeNull();
    expect(lookupMystery(def.id)!.id).toBe(def.id);
  });

  it("static authored ids are NOT overridden by a dynamic registration", () => {
    // Build a fake definition with the same id as the authored Wraith arc
    const wraith = lookupMystery("mystery.wraith_calder" as MysteryId)!;
    const fake = { ...wraith, title: "FAKE OVERRIDE — should not surface" };
    registerCompiledMystery(fake);

    const resolved = lookupMystery("mystery.wraith_calder" as MysteryId);
    expect(resolved!.title).toBe("The Eighth Death and the Names");
  });

  it("lookupEpisode falls back to dynamic episode when not authored", () => {
    const seed = seedFromVoteClosure("ap_v3", "b", TEMPLATE_VOTE_RESOLUTION_SHORT);
    const def = compileMysterySeed(seed)!;
    registerCompiledMystery(def);

    const ep = lookupEpisode(def.id, def.episodes[0].id);
    expect(ep).not.toBeNull();
    expect(ep!.id).toBe(def.episodes[0].id);
  });

  it("lookupEpisode returns null when mystery exists but episode id doesn't", () => {
    const seed = seedFromVoteClosure("ap_v2", "c", TEMPLATE_VOTE_RESOLUTION_SHORT);
    const def = compileMysterySeed(seed)!;
    registerCompiledMystery(def);

    const ep = lookupEpisode(def.id, "ep.does_not_exist" as EpisodeId);
    expect(ep).toBeNull();
  });
});

describe("mysteryRegistry — count + clear", () => {
  it("dynamicMysteryCount tracks registered definitions", () => {
    expect(dynamicMysteryCount()).toBe(0);

    const seedA = seedFromVoteClosure("ap_v1", "a", TEMPLATE_VOTE_RESOLUTION_SHORT);
    const seedB = seedFromVoteClosure("ap_v2", "b", TEMPLATE_VOTE_RESOLUTION_SHORT);
    registerCompiledMystery(compileMysterySeed(seedA)!);
    expect(dynamicMysteryCount()).toBe(1);

    registerCompiledMystery(compileMysterySeed(seedB)!);
    expect(dynamicMysteryCount()).toBe(2);
  });

  it("clearDynamicMysteryRegistry empties the dynamic map but leaves static lookups intact", () => {
    const seed = seedFromVoteClosure("ap_v1", "a", TEMPLATE_VOTE_RESOLUTION_SHORT);
    registerCompiledMystery(compileMysterySeed(seed)!);
    expect(dynamicMysteryCount()).toBe(1);

    clearDynamicMysteryRegistry();
    expect(dynamicMysteryCount()).toBe(0);
    // Static authored mystery still findable
    expect(lookupMystery("mystery.wraith_calder" as MysteryId)).not.toBeNull();
  });

  it("idempotent registration — re-registering the same id overwrites without growing the count", () => {
    const seed = seedFromVoteClosure("ap_v1", "a", TEMPLATE_VOTE_RESOLUTION_SHORT);
    const def = compileMysterySeed(seed)!;
    registerCompiledMystery(def);
    registerCompiledMystery(def);
    registerCompiledMystery(def);
    expect(dynamicMysteryCount()).toBe(1);
  });
});

describe("mysteryRegistry — round-trip vote-closure", () => {
  it("compileMysterySeed → registerCompiledMystery → lookupMystery returns the same definition", () => {
    const seed = seedFromVoteClosure("prophet_v2", "d", TEMPLATE_VOTE_RESOLUTION_SHORT);
    const compiled = compileMysterySeed(seed)!;
    registerCompiledMystery(compiled);

    const looked = lookupMystery(compiled.id);
    expect(looked).not.toBeNull();
    expect(looked!.id).toBe(compiled.id);
    expect(looked!.title).toBe(compiled.title);
    expect(looked!.episodes.length).toBe(compiled.episodes.length);
    expect(looked!.episodes[0].id).toBe(compiled.episodes[0].id);
  });
});
