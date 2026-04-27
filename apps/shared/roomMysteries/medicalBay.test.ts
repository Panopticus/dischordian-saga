import { describe, expect, it } from "vitest";

import {
  MEDICAL_BAY_MYSTERY,
  type MedicalBayHotspotId,
} from "./medicalBay";
import { resolveVerbResponse, VERB_LIST } from "./_template";

const ALL_HOTSPOTS: MedicalBayHotspotId[] = [
  "bio-bed",
  "dna-helix",
  "medicine-cabinet",
  "medical-log",
  "egg-vox-neural-bridge",
];

describe("medicalBay mystery module", () => {
  it("declares the canonical room id", () => {
    expect(MEDICAL_BAY_MYSTERY.roomId).toBe("medical-bay");
  });

  it("every clue-bearing Look flips the Tier 1 flag", () => {
    const clueHotspots: MedicalBayHotspotId[] = [
      "bio-bed",
      "dna-helix",
      "medicine-cabinet",
      "medical-log",
      "egg-vox-neural-bridge",
    ];
    for (const hs of clueHotspots) {
      const r = resolveVerbResponse(MEDICAL_BAY_MYSTERY, "look", hs);
      expect(r, `Look on ${hs}`).not.toBeNull();
      expect(r!.logsClue, `${hs} Look should log a clue`).toBeDefined();
      expect(r!.setsFlag, `${hs} Look should advance Tier 1`).toBe(
        "medbay_first_clue_found",
      );
    }
  });

  it("clue ids are unique across hotspots", () => {
    const clueIds = ALL_HOTSPOTS.map(
      (hs) => resolveVerbResponse(MEDICAL_BAY_MYSTERY, "look", hs)?.logsClue?.id,
    ).filter(Boolean);
    expect(new Set(clueIds).size).toBe(clueIds.length);
  });

  it("all clues source-tag the medical bay for Journal grouping", () => {
    for (const hs of ALL_HOTSPOTS) {
      const clue = resolveVerbResponse(MEDICAL_BAY_MYSTERY, "look", hs)
        ?.logsClue;
      if (clue) {
        expect(clue.source).toBe("medical-bay");
      }
    }
  });

  it("intentionally omits Use on the Vox neural bridge — donate flow owns it", () => {
    const r = resolveVerbResponse(
      MEDICAL_BAY_MYSTERY,
      "use",
      "egg-vox-neural-bridge",
    );
    expect(r).toBeNull();
  });

  it("uses only the canonical verb set", () => {
    for (const hs of ALL_HOTSPOTS) {
      const verbs = Object.keys(MEDICAL_BAY_MYSTERY.responses[hs]);
      for (const v of verbs) {
        expect(VERB_LIST).toContain(v);
      }
    }
  });
});
