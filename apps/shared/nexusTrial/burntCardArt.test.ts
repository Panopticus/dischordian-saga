import { describe, it, expect } from "vitest";
import { burntCardArtFor, listBurntCardNpcs } from "./burntCardArt";
import { BALLOT_KEYS } from "./buckets";

describe("burntCardArtFor — returns CDN URL for known npcs", () => {
  it("returns a CDN URL for Locke (fixed-canon permadeath)", () => {
    const url = burntCardArtFor("locke");
    expect(url).not.toBeNull();
    expect(url).toMatch(/cdn\/client-public\/art\/cards\/nexus_trial\/locke_burnt\.webp$/);
  });

  it("returns a CDN URL for every ballot candidate", () => {
    for (const key of BALLOT_KEYS) {
      const url = burntCardArtFor(key);
      expect(url, `missing burnt-card art for ${key}`).not.toBeNull();
      expect(url).toContain(`${key}_burnt.webp`);
    }
  });

  it("returns null for any other npcKey (no burnt variant authored)", () => {
    expect(burntCardArtFor("the_human")).toBeNull();
    expect(burntCardArtFor("elara")).toBeNull();
    expect(burntCardArtFor("unknown")).toBeNull();
  });
});

describe("listBurntCardNpcs — ballot-coverage invariant", () => {
  it("covers Locke + every ballot candidate", () => {
    const npcs = new Set(listBurntCardNpcs());
    expect(npcs.has("locke")).toBe(true);
    for (const key of BALLOT_KEYS) {
      expect(npcs.has(key), `${key} missing from burnt-card registry`).toBe(true);
    }
  });

  it("ships exactly 5 entries (Locke + 4 ballot)", () => {
    expect(listBurntCardNpcs().length).toBe(5);
  });
});
