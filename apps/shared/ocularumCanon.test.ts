import { describe, it, expect } from "vitest";
import {
  CANONICAL_OCULARUM_CELL_COUNT,
  OCULARUM_BIFURCATION,
  OCULARUM_CANON_PENDING,
  OCULARUM_FOUNDING,
  OCULARUM_MEMBERS,
  getCellByNumber,
  getCoordinators,
  getOcularumCellCoverage,
  getOcularumMember,
  getRegisteredCells,
  getWarlordFragmentedSisters,
} from "./ocularumCanon";

describe("ocularumCanon — founding regicide", () => {
  it("targets the_watcher (Kanshi Sha)", () => {
    expect(OCULARUM_FOUNDING.target.archonRegistryEntry).toBe("the_watcher");
  });

  it("describes the assassin as Kanshi Sha's own people, trained personally by him", () => {
    expect(OCULARUM_FOUNDING.assassin.relationship.toLowerCase()).toContain(
      "trained personally by him",
    );
  });

  it("preserves the founding-irony framing (the discipline turned on the teacher)", () => {
    expect(OCULARUM_FOUNDING.assassin.relationship.toLowerCase()).toContain(
      "discipline to the weapon that killed",
    );
  });

  it("registers the regicide outcome reversal via the_collector", () => {
    expect(OCULARUM_FOUNDING.outcomeReversal.reverser).toBe("the_collector");
  });

  it("names the Hierarchy of the Damned as the orchestrator of the reversal", () => {
    expect(OCULARUM_FOUNDING.outcomeReversal.orchestrator).toBe(
      "the_hierarchy_of_the_damned",
    );
  });
});

describe("ocularumCanon — bifurcation", () => {
  it("declares both branches (apparatus + resistance) and a reunification", () => {
    expect(OCULARUM_BIFURCATION.apparatusBranch).toBeDefined();
    expect(OCULARUM_BIFURCATION.resistanceBranch).toBeDefined();
    expect(OCULARUM_BIFURCATION.reunification).toBeDefined();
  });

  it("cites LORE_BIBLE.md:1272 as the canonical evidence for the apparatus branch", () => {
    expect(OCULARUM_BIFURCATION.apparatusBranch.canonicalDescent).toContain(
      "LORE_BIBLE.md:1272",
    );
  });

  it("associates the Panopticon's Ocularum-instrument with the apparatus branch, not the resistance", () => {
    expect(
      OCULARUM_BIFURCATION.apparatusBranch
        .associationWithThePanopticonsInstrument,
    ).toContain("LORE_BIBLE.md:6728-6772");
  });
});

describe("ocularumCanon — modern roster", () => {
  it("registers exactly the 6 members PR-1 canonized", () => {
    expect(OCULARUM_MEMBERS).toHaveLength(6);
  });

  it("registers Locke as the (active) Coordinator", () => {
    const locke = getOcularumMember("locke_coordinator");
    expect(locke.role).toBe("coordinator");
    expect(locke.status).toBe("active");
    expect(locke.cellNumber).toBeNull();
  });

  it("registers Senne as Locke's predecessor-identity (also Coordinator role)", () => {
    const senne = getOcularumMember("senne_predecessor");
    expect(senne.role).toBe("coordinator");
    expect(senne.status).toBe("predecessor-identity");
  });

  it("registers the original Agent Zero as warlord-fragmented sister", () => {
    const zero = getOcularumMember("agent_zero_original");
    expect(zero.role).toBe("warlord-fragmented-sister");
    expect(zero.status).toBe("warlord-fragmented");
    expect(getWarlordFragmentedSisters()).toHaveLength(1);
  });

  it("the original Agent Zero entry flags Vex Solène's relationship as canon-pending", () => {
    const zero = getOcularumMember("agent_zero_original");
    expect(zero.canonNote ?? "").toContain("CANON-PENDING");
  });

  it("registers Cell 1 (Old Tanjin), Cell 99 (Mira), Cell 700 (Seventh Whisper)", () => {
    const tanjin = getCellByNumber(1);
    const mira = getCellByNumber(99);
    const whisper = getCellByNumber(700);
    expect(tanjin?.name).toBe("Old Tanjin");
    expect(mira?.name).toBe("Mira the Glyph-Reader");
    expect(whisper?.name).toBe("the Seventh Whisper");
  });

  it("getCoordinators returns 2 (Locke + Senne as predecessor)", () => {
    expect(getCoordinators()).toHaveLength(2);
  });

  it("getRegisteredCells returns exactly the 3 numbered cells", () => {
    expect(getRegisteredCells()).toHaveLength(3);
  });
});

describe("ocularumCanon — coverage metric vs. canonical 700", () => {
  it("declares the 700-cell operational body", () => {
    expect(CANONICAL_OCULARUM_CELL_COUNT).toBe(700);
  });

  it("registers a 3-cell coverage gap appropriate for PR-1", () => {
    expect(getOcularumCellCoverage()).toBe(3);
  });
});

describe("ocularumCanon — canon-pending notes", () => {
  it("flags the four open canonical questions for PR-2 / DLC resolution", () => {
    const ids = OCULARUM_CANON_PENDING.map((p) => p.id);
    expect(ids).toContain("vex_solene_relationship_to_ocularum");
    expect(ids).toContain("heart_of_time_vs_dimensional_veil_distinction");
    expect(ids).toContain("reunification_coordinator_and_event");
    expect(ids).toContain("the_purple_clad_ninja_identity");
  });

  it("the Heart-of-Time-vs-veil note cites both the bible and the antiquarian's journal", () => {
    const note = OCULARUM_CANON_PENDING.find(
      (p) => p.id === "heart_of_time_vs_dimensional_veil_distinction",
    );
    expect(note?.cites.join("\n")).toContain("LORE_BIBLE.md:1272");
    expect(note?.cites.join("\n")).toContain("antiquariansJournal.ts:440-449");
  });
});

describe("ocularumCanon — cross-registry binding", () => {
  it("Locke's source-of-record points to her existing canon (LORE_BIBLE + bible)", () => {
    const locke = getOcularumMember("locke_coordinator");
    expect(locke.loreSource).toContain("LORE_BIBLE.md");
    expect(locke.loreSource).toContain("adjudicator_locke.md");
  });

  it("the Watcher cross-binding is preserved (founding regicide targets the_watcher archon entry)", () => {
    expect(OCULARUM_FOUNDING.target.archonRegistryEntry).toBe("the_watcher");
  });

  it("the Collector cross-binding is preserved (outcome reversal points at the_collector archon entry)", () => {
    expect(OCULARUM_FOUNDING.outcomeReversal.reverser).toBe("the_collector");
  });
});
