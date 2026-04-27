import { describe, expect, it } from "vitest";

import {
  ENGINEERING_MYSTERY,
  type EngineeringHotspotId,
} from "./engineering";
import { resolveVerbResponse, VERB_LIST } from "./_template";

const ALL_HOTSPOTS: EngineeringHotspotId[] = [
  "crafting-bench",
  "reactor-core",
  "blueprints",
  "egg-eng-formula",
];

describe("engineering mystery module", () => {
  it("declares the canonical room id", () => {
    expect(ENGINEERING_MYSTERY.roomId).toBe("engineering");
  });

  it("every hotspot answers Look and lifts Tier 1", () => {
    for (const hs of ALL_HOTSPOTS) {
      const r = resolveVerbResponse(ENGINEERING_MYSTERY, "look", hs);
      expect(r, `Look on ${hs}`).not.toBeNull();
      expect(r!.logsClue, `${hs} Look should log a clue`).toBeDefined();
      expect(r!.setsFlag).toBe("engineering_first_clue_found");
    }
  });

  it("clue ids are unique across hotspots", () => {
    const ids = ALL_HOTSPOTS.map(
      (hs) => resolveVerbResponse(ENGINEERING_MYSTERY, "look", hs)?.logsClue?.id,
    ).filter(Boolean);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all clues source-tag engineering for Journal grouping", () => {
    for (const hs of ALL_HOTSPOTS) {
      const clue = resolveVerbResponse(ENGINEERING_MYSTERY, "look", hs)
        ?.logsClue;
      if (clue) expect(clue.source).toBe("engineering");
    }
  });

  it("reactor-core answers Use with bench guidance", () => {
    const r = resolveVerbResponse(ENGINEERING_MYSTERY, "use", "reactor-core");
    expect(r).not.toBeNull();
    expect(r!.narration).toMatch(/Research Station|bench/i);
  });

  it("blueprints answer Talk with Elara commentary", () => {
    expect(
      resolveVerbResponse(ENGINEERING_MYSTERY, "talk", "blueprints"),
    ).not.toBeNull();
  });

  it("uses only the canonical verb set", () => {
    for (const hs of ALL_HOTSPOTS) {
      for (const v of Object.keys(ENGINEERING_MYSTERY.responses[hs])) {
        expect(VERB_LIST).toContain(v);
      }
    }
  });
});
