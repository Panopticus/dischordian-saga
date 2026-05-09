import { describe, expect, it } from "vitest";
import {
  buildCanonEntry,
  buildCanonRegistry,
  cosplayMetadataCoverage,
  type NPCPortraitLike,
} from "./characterCanon";
import {
  CHARACTER_COSPLAY_METADATA,
  getCharacterCosplayMetadata,
  listCosplayMetadataIds,
} from "./characterMetadata";

const fakeElara: NPCPortraitLike = {
  id: "elara",
  name: "Elara",
  fullPortrait: "https://cdn.example/elara-full.jpg",
  bustPortrait: "https://cdn.example/elara-bust.jpg",
  color: "var(--energy-primary)",
  expressions: {
    neutral: "https://cdn.example/elara-neutral.jpg",
    speaking: "https://cdn.example/elara-speaking.jpg",
  },
};

const fakeNoMetadata: NPCPortraitLike = {
  id: "not_in_metadata_registry",
  name: "Mystery NPC",
  fullPortrait: "x",
  bustPortrait: "x",
  color: "#fff",
  expressions: { neutral: "x" },
};

describe("characterMetadata registry invariants", () => {
  it("ids match the keys", () => {
    for (const [key, entry] of Object.entries(CHARACTER_COSPLAY_METADATA)) {
      expect(entry.id, `${key} mismatch`).toBe(key);
    }
  });

  it("buildType is one of the declared variants", () => {
    const allowed = new Set(["slim", "athletic", "average", "stocky", "broad", "non_humanoid"]);
    for (const entry of Object.values(CHARACTER_COSPLAY_METADATA)) {
      expect(allowed.has(entry.buildType), `${entry.id} bad buildType`).toBe(true);
    }
  });

  it("ageBand is one of the declared variants", () => {
    const allowed = new Set([
      "child", "teen", "young_adult", "adult", "older_adult", "ancient", "ageless",
    ]);
    for (const entry of Object.values(CHARACTER_COSPLAY_METADATA)) {
      expect(allowed.has(entry.ageBand), `${entry.id} bad ageBand`).toBe(true);
    }
  });

  it("non-humanoid characters have null canonicalHeightCm", () => {
    for (const entry of Object.values(CHARACTER_COSPLAY_METADATA)) {
      if (entry.buildType === "non_humanoid") {
        expect(entry.canonicalHeightCm, `${entry.id} non_humanoid w/ height`).toBeNull();
      }
    }
  });

  it("humanoid characters have a positive canonicalHeightCm", () => {
    for (const entry of Object.values(CHARACTER_COSPLAY_METADATA)) {
      if (entry.buildType !== "non_humanoid") {
        expect(entry.canonicalHeightCm, `${entry.id} humanoid w/o height`).not.toBeNull();
        expect(entry.canonicalHeightCm!, `${entry.id} non-positive height`).toBeGreaterThan(0);
      }
    }
  });

  it("cosplaySpine + ageApproximationNote are non-empty", () => {
    for (const entry of Object.values(CHARACTER_COSPLAY_METADATA)) {
      expect(entry.cosplaySpine.trim().length, `${entry.id} empty spine`).toBeGreaterThan(0);
      expect(
        entry.ageApproximationNote.trim().length,
        `${entry.id} empty age note`,
      ).toBeGreaterThan(0);
    }
  });

  it("rejects stub markers", () => {
    const stubs = [/\bTODO\b/, /\bFIXME\b/, /\[placeholder\]/i];
    for (const entry of Object.values(CHARACTER_COSPLAY_METADATA)) {
      for (const pattern of stubs) {
        expect(
          pattern.test(entry.cosplaySpine) || pattern.test(entry.ageApproximationNote),
          `${entry.id} stub`,
        ).toBe(false);
      }
    }
  });
});

describe("getCharacterCosplayMetadata", () => {
  it("returns the entry for a known id", () => {
    expect(getCharacterCosplayMetadata("elara")?.id).toBe("elara");
  });

  it("returns null for an unknown id", () => {
    expect(getCharacterCosplayMetadata("not_real")).toBeNull();
  });
});

describe("listCosplayMetadataIds", () => {
  it("includes every key in the registry", () => {
    const ids = listCosplayMetadataIds();
    expect(ids.length).toBe(Object.keys(CHARACTER_COSPLAY_METADATA).length);
    for (const id of Object.keys(CHARACTER_COSPLAY_METADATA)) {
      expect(ids.includes(id)).toBe(true);
    }
  });
});

describe("buildCanonEntry", () => {
  it("populates all NPC-portrait fields", () => {
    const entry = buildCanonEntry(fakeElara);
    expect(entry.id).toBe("elara");
    expect(entry.name).toBe("Elara");
    expect(entry.fullPortrait).toBe(fakeElara.fullPortrait);
    expect(entry.factionColor).toBe(fakeElara.color);
  });

  it("attaches cosplay metadata when registered", () => {
    const entry = buildCanonEntry(fakeElara);
    expect(entry.cosplay?.id).toBe("elara");
    expect(entry.cosplay?.canonicalHeightCm).toBe(168);
  });

  it("returns null cosplay for an unregistered NPC", () => {
    const entry = buildCanonEntry(fakeNoMetadata);
    expect(entry.cosplay).toBeNull();
  });

  it("attaches blood-weave band visual when requested", () => {
    const entry = buildCanonEntry(fakeElara, { bloodWeaveBand: "dormant" });
    expect(entry.bloodWeaveBand?.band).toBe("dormant");
    expect(entry.bloodWeaveBand?.colorHex).toBe("#1a1a1a");
  });

  it("leaves blood-weave band null by default", () => {
    const entry = buildCanonEntry(fakeElara);
    expect(entry.bloodWeaveBand).toBeNull();
  });
});

describe("buildCanonRegistry", () => {
  it("produces one entry per portrait", () => {
    const registry = { elara: fakeElara, mystery: fakeNoMetadata };
    const result = buildCanonRegistry(registry);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id).sort()).toEqual(["elara", "not_in_metadata_registry"]);
  });

  it("threads the bloodWeaveBandFor mapper per-NPC", () => {
    const registry = { elara: fakeElara, mystery: fakeNoMetadata };
    const result = buildCanonRegistry(registry, (id) =>
      id === "elara" ? "dormant" : undefined,
    );
    const elaraEntry = result.find((e) => e.id === "elara");
    const mysteryEntry = result.find((e) => e.id === "not_in_metadata_registry");
    expect(elaraEntry?.bloodWeaveBand?.band).toBe("dormant");
    expect(mysteryEntry?.bloodWeaveBand).toBeNull();
  });
});

describe("cosplayMetadataCoverage", () => {
  it("counts how many portraits have metadata", () => {
    const registry = { elara: fakeElara, mystery: fakeNoMetadata };
    const result = cosplayMetadataCoverage(registry);
    expect(result.declared).toBe(2);
    expect(result.implemented).toBe(1);
  });

  it("returns 0 implemented when no portraits match metadata", () => {
    const registry = { mystery: fakeNoMetadata };
    expect(cosplayMetadataCoverage(registry).implemented).toBe(0);
  });
});
