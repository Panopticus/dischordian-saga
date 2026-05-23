import { describe, expect, it } from "vitest";

import {
  classifyStateToken,
  getConventionForZip,
  parseProducerFilename,
} from "./_filename_normalisers";

describe("classifyStateToken", () => {
  it("classifies axis-9 tv states", () => {
    expect(classifyStateToken("spreading", {})).toEqual({ axis: "tv", value: "spreading" });
    expect(classifyStateToken("corrupted", {})).toEqual({ axis: "tv", value: "corrupted" });
  });
  it("classifies axis-11 cycle states", () => {
    expect(classifyStateToken("dawn", {})).toEqual({ axis: "cycle", value: "dawn" });
    expect(classifyStateToken("longnight", {})).toEqual({ axis: "cycle", value: "longnight" });
  });
  it("classifies axis-12 faction states", () => {
    expect(classifyStateToken("hierarchy", {})).toEqual({ axis: "faction", value: "hierarchy" });
    expect(classifyStateToken("collectors", {})).toEqual({ axis: "faction", value: "collectors" });
  });
  it("classifies unique axis-13 vocab tokens", () => {
    // "investigating" is unique to the investigation vocab
    expect(classifyStateToken("investigating", {})).toEqual({ axis: "investigation", value: "investigating" });
    // "donated" is unique to donation
    expect(classifyStateToken("donated", {})).toEqual({ axis: "donation", value: "donated" });
  });
  it("disambiguates ambiguous tokens via pack default", () => {
    // "initial" appears in investigation + reveal + human + hellbox.
    // The default applies only when it matches one of the candidates.
    expect(classifyStateToken("initial", { defaultAxis13: "investigation" })).toEqual({
      axis: "investigation",
      value: "initial",
    });
    expect(classifyStateToken("initial", { defaultAxis13: "reveal" })).toEqual({
      axis: "reveal",
      value: "initial",
    });
  });
  it("disambiguates ambiguous tokens via per-room hint (highest priority)", () => {
    // Per-room hint takes precedence over pack-level default.
    const res = classifyStateToken("initial", {
      defaultAxis13: "investigation",
      zipDir: "medical_bay",
      axis13HintByZipDir: { medical_bay: "reveal" },
    });
    expect(res).toEqual({ axis: "reveal", value: "initial" });
  });
  it("falls back to alphabetically-first axis when no hint or default", () => {
    // "initial" candidates: donation, hellbox, human, investigation, reveal.
    // Alphabetical first is "donation".
    const res = classifyStateToken("initial", {});
    expect(res).not.toBeNull();
    expect(res!.axis).toBe("donation");
  });
  it("normalises hyphens to underscores", () => {
    expect(classifyStateToken("victim-identified", {})).toEqual({
      axis: "investigation",
      value: "victim_identified",
    });
  });
  it("returns null for unknown tokens", () => {
    expect(classifyStateToken("nonsense_xyz", {})).toBeNull();
  });
});

describe("getConventionForZip", () => {
  it("matches the Phase-H canonical convention by suffix", () => {
    expect(getConventionForZip("AAA Final/rooms_complete_library.zip")?.id).toBe("phase_h_canonical");
    expect(getConventionForZip("AAA Final/NEW_ROOMS_82.zip")?.id).toBe("phase_h_canonical");
  });
  it("matches the flat-hyphen convention", () => {
    expect(getConventionForZip("AAA Final/dischordian_room_state_art.zip")?.id).toBe("flat_hyphen");
    expect(getConventionForZip("AAA Final/dischordian_room_state_art (2).zip")?.id).toBe("flat_hyphen");
  });
  it("matches the two-level-flat convention", () => {
    expect(getConventionForZip("AAA Final/prelude_rooms_missing_9.zip")?.id).toBe("two_level_flat");
    expect(getConventionForZip("AAA Final/inception_ark_room_tiers.zip")?.id).toBe("two_level_flat");
  });
  it("returns null for unregistered ZIPs", () => {
    expect(getConventionForZip("AAA Final/Music & Stories.zip")).toBeNull();
  });
});

describe("parseProducerFilename — phase_h_canonical", () => {
  const ZIP = "AAA Final/rooms_complete_library.zip";
  it("parses a baseline", () => {
    expect(parseProducerFilename(ZIP, "art/rooms/cryo_bay/baseline.png")).toEqual({
      zipDir: "cryo_bay",
      axis: "baseline",
      value: "",
      canonicalRelPath: "art/rooms/cryo_bay/baseline.png",
      variantKey: "baseline",
      id: "cryo_bay:baseline",
      kind: "baseline",
    });
  });
  it("parses a state variant", () => {
    expect(parseProducerFilename(ZIP, "art/rooms/cryo_bay/state_tv_spreading.png")).toEqual({
      zipDir: "cryo_bay",
      axis: "tv",
      value: "spreading",
      canonicalRelPath: "art/rooms/cryo_bay/state_tv_spreading.png",
      variantKey: "tv_spreading",
      id: "cryo_bay:tv_spreading",
      kind: "state_variant",
    });
  });
  it("tolerates the 'rooms/' top-level shape", () => {
    expect(parseProducerFilename(ZIP, "rooms/cryo_bay/baseline.png")?.canonicalRelPath).toBe(
      "art/rooms/cryo_bay/baseline.png",
    );
  });
  it("returns null for non-baseline/non-state stems", () => {
    expect(parseProducerFilename(ZIP, "art/rooms/cryo_bay/atlas_thumb.png")).toBeNull();
  });
});

describe("parseProducerFilename — flat_hyphen", () => {
  const ZIP = "AAA Final/dischordian_room_state_art.zip";
  it("parses the cryo-bay_initial.png shape — the user's verified case", () => {
    // Pack convention defaults axis-13 to "investigation" so
    // "initial" disambiguates to investigation_initial.
    expect(parseProducerFilename(ZIP, "cryo-bay_initial.png")).toEqual({
      zipDir: "cryo_bay",
      axis: "investigation",
      value: "initial",
      canonicalRelPath: "art/rooms/cryo_bay/state_investigation_initial.png",
      variantKey: "investigation_initial",
      id: "cryo_bay:investigation_initial",
      kind: "state_variant",
    });
  });
  it("parses the medical-bay_donated.png shape", () => {
    expect(parseProducerFilename(ZIP, "medical-bay_donated.png")).toEqual({
      zipDir: "medical_bay",
      axis: "donation",
      value: "donated",
      canonicalRelPath: "art/rooms/medical_bay/state_donation_donated.png",
      variantKey: "donation_donated",
      id: "medical_bay:donation_donated",
      kind: "state_variant",
    });
  });
  it("uses per-room hint to route medical-bay_initial.png to donation (not investigation)", () => {
    // Both arcs use "initial"; the per-zipDir hint in the convention
    // must disambiguate medical_bay → donation.
    expect(parseProducerFilename(ZIP, "medical-bay_initial.png")).toEqual({
      zipDir: "medical_bay",
      axis: "donation",
      value: "initial",
      canonicalRelPath: "art/rooms/medical_bay/state_donation_initial.png",
      variantKey: "donation_initial",
      id: "medical_bay:donation_initial",
      kind: "state_variant",
    });
  });
  it("collapses compound state tokens into single underscore values", () => {
    // "victim-identified" → "victim_identified" (one value token,
    // not two — the resolver's split(_, 2) constraint).
    expect(parseProducerFilename(ZIP, "cryo-bay_victim-identified.png")).toEqual({
      zipDir: "cryo_bay",
      axis: "investigation",
      value: "victim_identified",
      canonicalRelPath: "art/rooms/cryo_bay/state_investigation_victim_identified.png",
      variantKey: "investigation_victim_identified",
      id: "cryo_bay:investigation_victim_identified",
      kind: "state_variant",
    });
  });
  it("rejects nested paths — this convention is flat only", () => {
    expect(parseProducerFilename(ZIP, "rooms/cryo-bay_initial.png")).toBeNull();
  });
  it("returns null for unknown state tokens", () => {
    expect(parseProducerFilename(ZIP, "cryo-bay_nonsense.png")).toBeNull();
  });
});

describe("parseProducerFilename — two_level_flat", () => {
  const ZIP = "AAA Final/prelude_rooms_missing_9.zip";
  it("parses a baseline at <room>/baseline.png", () => {
    expect(parseProducerFilename(ZIP, "starlit_courtyard/baseline.png")).toEqual({
      zipDir: "starlit_courtyard",
      axis: "baseline",
      value: "",
      canonicalRelPath: "art/rooms/starlit_courtyard/baseline.png",
      variantKey: "baseline",
      id: "starlit_courtyard:baseline",
      kind: "baseline",
    });
  });
  it("parses a state variant at <room>/state_<axis>_<value>.png", () => {
    expect(parseProducerFilename(ZIP, "starlit_courtyard/state_tv_clean.png")).toEqual({
      zipDir: "starlit_courtyard",
      axis: "tv",
      value: "clean",
      canonicalRelPath: "art/rooms/starlit_courtyard/state_tv_clean.png",
      variantKey: "tv_clean",
      id: "starlit_courtyard:tv_clean",
      kind: "state_variant",
    });
  });
});

describe("parseProducerFilename — unregistered ZIPs", () => {
  it("returns null when no convention matches", () => {
    expect(parseProducerFilename("AAA Final/Music & Stories.zip", "cryo-bay_initial.png")).toBeNull();
  });
});
