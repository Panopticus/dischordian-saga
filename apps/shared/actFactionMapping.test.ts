/* ═══════════════════════════════════════════════════════
   ACT → NARRATIVE FACTION mapping — invariant test

   Pins the seven act ↔ faction associations and the
   out-of-range null return so future contributors can't
   silently rename or drop a faction signature.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import {
  actFaction,
  allActFactionPairs,
} from "./actFactionMapping";
import { CHARACTER_SHEET_BACKGROUNDS } from "./aaaArtArchive";

describe("actFactionMapping", () => {
  it("Act 1 → authority (the Authority is the Cycle C finale boss)", () => {
    expect(actFaction(1)).toBe("authority");
  });
  it("Act 2 → hierarchy (Shadow Tongue is Hierarchy propaganda)", () => {
    expect(actFaction(2)).toBe("hierarchy");
  });
  it("Act 3 → hierarchy (the Offer is the Hierarchy bargain)", () => {
    expect(actFaction(3)).toBe("hierarchy");
  });
  it("Act 4 → watcher (the Revelation is the Watcher unveiling)", () => {
    expect(actFaction(4)).toBe("watcher");
  });
  it("Act 5 → dreamer (the Map is the Dreamer's geography)", () => {
    expect(actFaction(5)).toBe("dreamer");
  });
  it("Act 6 → insurgency (Confession ≡ liberation through truth)", () => {
    expect(actFaction(6)).toBe("insurgency");
  });
  it("Act 7 → mechronis (Architect returns at the Mechronis core)", () => {
    expect(actFaction(7)).toBe("mechronis");
  });

  it("Acts 0, 8, -1 return null (out of range)", () => {
    expect(actFaction(0)).toBeNull();
    expect(actFaction(8)).toBeNull();
    expect(actFaction(-1)).toBeNull();
  });

  it("every mapped act resolves to a valid producer-drop faction", () => {
    const valid = new Set<string>(CHARACTER_SHEET_BACKGROUNDS);
    for (const [act, faction] of allActFactionPairs()) {
      expect(valid.has(faction), `act ${act} → ${faction}`).toBe(true);
    }
  });
});
