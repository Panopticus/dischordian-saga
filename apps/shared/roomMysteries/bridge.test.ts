import { describe, expect, it } from "vitest";

import { BRIDGE_MYSTERY, type BridgeHotspotId } from "./bridge";
import { resolveVerbResponse, VERB_LIST } from "./_template";

const ALL_HOTSPOTS: BridgeHotspotId[] = [
  "tactical-display",
  "timeline-projector",
  "captains-chair",
  "nav-console",
  "diplomacy-table",
];

describe("bridge mystery module", () => {
  it("declares the canonical room id", () => {
    expect(BRIDGE_MYSTERY.roomId).toBe("bridge");
  });

  it("every hotspot answers the Look verb and lifts Tier 1", () => {
    for (const hs of ALL_HOTSPOTS) {
      const r = resolveVerbResponse(BRIDGE_MYSTERY, "look", hs);
      expect(r, `Look on ${hs}`).not.toBeNull();
      expect(r!.logsClue, `${hs} Look should log a clue`).toBeDefined();
      expect(r!.setsFlag, `${hs} Look should advance Tier 1`).toBe(
        "bridge_first_clue_found",
      );
    }
  });

  it("clue ids are unique across hotspots", () => {
    const clueIds = ALL_HOTSPOTS.map(
      (hs) => resolveVerbResponse(BRIDGE_MYSTERY, "look", hs)?.logsClue?.id,
    ).filter(Boolean);
    expect(new Set(clueIds).size).toBe(clueIds.length);
  });

  it("all clues source-tag the bridge for Journal grouping", () => {
    for (const hs of ALL_HOTSPOTS) {
      const clue = resolveVerbResponse(BRIDGE_MYSTERY, "look", hs)?.logsClue;
      if (clue) expect(clue.source).toBe("bridge");
    }
  });

  it("captains-chair answers Use and Talk", () => {
    expect(resolveVerbResponse(BRIDGE_MYSTERY, "use", "captains-chair")).not.toBeNull();
    expect(resolveVerbResponse(BRIDGE_MYSTERY, "talk", "captains-chair")).not.toBeNull();
  });

  it("nav-console intentionally omits Use — runtime owns the puzzle", () => {
    expect(resolveVerbResponse(BRIDGE_MYSTERY, "use", "nav-console")).toBeNull();
  });

  it("uses only the canonical verb set", () => {
    for (const hs of ALL_HOTSPOTS) {
      for (const v of Object.keys(BRIDGE_MYSTERY.responses[hs])) {
        expect(VERB_LIST).toContain(v);
      }
    }
  });
});
