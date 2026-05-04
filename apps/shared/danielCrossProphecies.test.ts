import { describe, expect, it } from "vitest";
import {
  DANIEL_CROSS_PROPHECIES,
  allowedThemesForSpine,
  getProphecyById,
  listProphecyIds,
} from "./danielCrossProphecies";
import { PROPHECY_VISIONS } from "./prophecyVisionMap";

describe("danielCrossProphecies — text bank invariants", () => {
  it("every prophecy id is unique", () => {
    const ids = DANIEL_CROSS_PROPHECIES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every prophecy text is reasonably short", () => {
    for (const p of DANIEL_CROSS_PROPHECIES) {
      expect(p.text.length, `${p.id} text too long`).toBeLessThanOrEqual(180);
    }
  });

  it("getProphecyById round-trips", () => {
    for (const p of DANIEL_CROSS_PROPHECIES) {
      expect(getProphecyById(p.id)?.id).toBe(p.id);
    }
  });

  it("listProphecyIds returns every id", () => {
    expect(listProphecyIds().length).toBe(DANIEL_CROSS_PROPHECIES.length);
  });

  it("every bookend referenced by the registry exists", () => {
    for (const v of PROPHECY_VISIONS) {
      expect(getProphecyById(v.openingProphecyId), `opening for ${v.id}`).toBeTruthy();
      expect(getProphecyById(v.closingProphecyId), `closing for ${v.id}`).toBeTruthy();
    }
  });

  it("every bookend theme matches the spine's allowed themes", () => {
    for (const v of PROPHECY_VISIONS) {
      const opening = getProphecyById(v.openingProphecyId)!;
      const closing = getProphecyById(v.closingProphecyId)!;
      const allowed = allowedThemesForSpine(v.spine);
      expect(allowed).toContain(opening.theme);
      expect(allowed).toContain(closing.theme);
    }
  });
});
