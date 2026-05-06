import { describe, it, expect } from "vitest";
import {
  CIVILOPEDIA_INDEX,
  getCivilopediaEntry,
  listEntriesByCategory,
  listEntriesByOrigin,
  relatedIds,
  searchCivilopedia,
} from "./civilopedia";

describe("CIVILOPEDIA_INDEX — invariants", () => {
  it("ships at least one entry per major category", () => {
    const cats = new Set(CIVILOPEDIA_INDEX.map((e) => e.category));
    expect(cats.has("faction")).toBe(true);
    expect(cats.has("character")).toBe(true);
    expect(cats.has("era")).toBe(true);
    expect(cats.has("song")).toBe(true);
  });

  it("every entry id is unique", () => {
    const ids = CIVILOPEDIA_INDEX.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every related cross-link points to an existing entry", () => {
    const allIds = new Set(CIVILOPEDIA_INDEX.map((e) => e.id));
    for (const entry of CIVILOPEDIA_INDEX) {
      for (const refId of entry.related ?? []) {
        expect(allIds.has(refId), `${entry.id} → unknown ${refId}`).toBe(true);
      }
    }
  });
});

describe("getCivilopediaEntry", () => {
  it("returns the entry by id", () => {
    expect(getCivilopediaEntry("civ_architect")?.title).toBe("The Architect");
  });

  it("returns undefined for unknown ids", () => {
    expect(getCivilopediaEntry("nope")).toBeUndefined();
  });
});

describe("listEntriesByCategory + listEntriesByOrigin", () => {
  it("filters by category", () => {
    const out = listEntriesByCategory("character");
    expect(out.length).toBeGreaterThan(0);
    for (const e of out) expect(e.category).toBe("character");
  });

  it("filters by origin", () => {
    const out = listEntriesByOrigin("loredex");
    expect(out.length).toBeGreaterThan(0);
    for (const e of out) expect(e.origin).toBe("loredex");
  });
});

describe("searchCivilopedia", () => {
  it("matches title substring (case-insensitive)", () => {
    const out = searchCivilopedia("ARCHITECT");
    expect(out.find((e) => e.id === "civ_architect")).toBeDefined();
  });

  it("matches summary substring", () => {
    const out = searchCivilopedia("imprisoned, voluntarily");
    expect(out.find((e) => e.id === "civ_human")).toBeDefined();
  });

  it("returns empty for whitespace queries", () => {
    expect(searchCivilopedia("   ")).toEqual([]);
  });
});

describe("relatedIds", () => {
  it("returns the deduped cross-link list", () => {
    const a = getCivilopediaEntry("civ_dreamer");
    expect(a).toBeDefined();
    expect(relatedIds(a!)).toContain("civ_architect");
  });

  it("returns an empty list for entries with no relations", () => {
    const lone = getCivilopediaEntry("civ_age_of_privacy");
    expect(lone).toBeDefined();
    expect(relatedIds(lone!)).toEqual([]);
  });
});
