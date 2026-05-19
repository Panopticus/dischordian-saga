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
  it("registers the founding members canonized in PR-1 (Locke, Senne, Agent Zero, Tanjin, Mira, Seventh Whisper) — extended by the ninja-clan wave", () => {
    // PR-1 canonized 6 founding members. The ninja-clan wave extended
    // the cell-roster with 70 curated cells + 627 Shadow-Tongue
    // redactions to complete the canonical 700-cell operational body.
    // Total roster size: 6 founding (3 are cell-members) + 70 curated
    // cells + 627 redacted = 703 entries (700 cell-members + 3 non-cell:
    // Locke + Senne + the original Agent Zero).
    expect(OCULARUM_MEMBERS.length).toBe(703);
    for (const id of [
      "locke_coordinator",
      "senne_predecessor",
      "agent_zero_original",
      "old_tanjin",
      "mira_glyph_reader",
      "the_seventh_whisper",
    ]) {
      expect(() => getOcularumMember(id)).not.toThrow();
    }
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

  it("getRegisteredCells returns the canonical 700 numbered cells (ninja-clan wave canonized the full body)", () => {
    expect(getRegisteredCells()).toHaveLength(CANONICAL_OCULARUM_CELL_COUNT);
  });
});

describe("ocularumCanon — coverage metric vs. canonical 700", () => {
  it("declares the 700-cell operational body", () => {
    expect(CANONICAL_OCULARUM_CELL_COUNT).toBe(700);
  });

  it("ninja-clan wave drives coverage to the full canonical 700 (gate-PASS)", () => {
    expect(getOcularumCellCoverage()).toBe(CANONICAL_OCULARUM_CELL_COUNT);
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

describe("ocularumCanon — ninja-clan wave + Shadow Tongue redaction war", () => {
  it("registers all 700 cells (canon-PASS for canon.ocularum_cell_coverage)", () => {
    const cells = getRegisteredCells();
    expect(cells.length).toBe(CANONICAL_OCULARUM_CELL_COUNT);
    const nums = new Set(cells.map((c) => c.cellNumber));
    expect(nums.size).toBe(CANONICAL_OCULARUM_CELL_COUNT);
    for (let n = 1; n <= CANONICAL_OCULARUM_CELL_COUNT; n++) {
      expect(nums.has(n), `cell ${n} missing`).toBe(true);
    }
  });

  it("canonizes the marquee historical houses as named cells (Hattori, Momochi, Fujibayashi, Fūma, Mochizuki, Iga-Kōga)", () => {
    const named = getRegisteredCells().filter(
      (c) => c.status !== "shadow-tongue-redacted",
    );
    const names = named.map((c) => c.name).join("\n");
    for (const marker of [
      "Hattori",
      "Momochi",
      "Fujibayashi",
      "Fūma",
      "Mochizuki",
      "Iga-Kōga Compact",
    ]) {
      expect(names, `missing canonized marquee house: ${marker}`).toContain(marker);
    }
  });

  it("canonizes the nine ryūha (Togakure, Gyokko, Kotō, Kumogakure, Gyokushin, Gikan, Shinden Fudō, Takagi Yōshin, Kukishin)", () => {
    const names = getRegisteredCells()
      .map((c) => c.name)
      .join("\n");
    for (const ryu of [
      "Togakure",
      "Gyokko",
      "Kotō",
      "Kumogakure",
      "Gyokushin",
      "Gikan",
      "Shinden Fudō",
      "Takagi Yōshin",
      "Kukishin",
    ]) {
      expect(names, `missing ryūha: ${ryu}`).toContain(ryu);
    }
  });

  it("canonizes the doctrinal anti-edit cell (the Tongueless Witness)", () => {
    const cell = getRegisteredCells().find(
      (c) => c.name === "the Tongueless Witness",
    );
    expect(cell, "the Tongueless Witness must be canonized").toBeDefined();
    expect(cell!.domain.toLowerCase()).toContain("shadow tongue");
  });

  it("publishes the Shadow Tongue redaction doctrine — the three reasons + the limit case", async () => {
    const mod = await import("./ocularumCanon");
    const doctrine = (
      mod as unknown as {
        OCULARUM_SHADOW_TONGUE_REDACTION: {
          editor: string;
          doctrine: { threeReasons: readonly string[]; limitCase: string };
        };
      }
    ).OCULARUM_SHADOW_TONGUE_REDACTION;
    expect(doctrine.editor).toBe("the_shadow_tongue");
    expect(doctrine.doctrine.threeReasons.length).toBe(3);
    const joined = doctrine.doctrine.threeReasons.join(" ").toLowerCase();
    expect(joined).toContain("substrate");
    expect(joined).toContain("witness");
    expect(joined).toContain("older");
    expect(doctrine.doctrine.limitCase.toLowerCase()).toContain("tanjin");
  });

  it("marks every redacted cell with status shadow-tongue-redacted and preserves a memory trace", () => {
    const redacted = getRegisteredCells().filter(
      (c) => c.status === "shadow-tongue-redacted",
    );
    // 700 total − 3 founding (Tanjin, Mira, Seventh Whisper) − 70 curated = 627 redacted
    expect(redacted.length).toBe(627);
    for (const c of redacted) {
      expect(c.domain.toLowerCase()).toContain("shadow tongue");
      expect(c.domain.length).toBeGreaterThan(120);
    }
  });

  it("every redacted cell has a UNIQUE memory trace (no two cells share the same surviving hint)", () => {
    const redacted = getRegisteredCells().filter(
      (c) => c.status === "shadow-tongue-redacted",
    );
    const traces = redacted.map(
      (c) =>
        c.domain.split("substrate the editor cannot ride: ")[1] ?? c.domain,
    );
    expect(new Set(traces).size).toBe(traces.length);
  });

  it("cells 1, 99, 700 remain canonically named (Tanjin / Mira / Seventh Whisper)", () => {
    expect(getCellByNumber(1)?.name).toBe("Old Tanjin");
    expect(getCellByNumber(99)?.name).toBe("Mira the Glyph-Reader");
    expect(getCellByNumber(700)?.name).toBe("the Seventh Whisper");
  });
});
