import { describe, it, expect } from "vitest";
import {
  CURRENT_PACT_STATE,
  PACT_BREACH,
  PACT_DOCTRINAL_LINEAGE,
  PACT_FOUNDING,
  PACT_INVARIANTS,
  PACT_LINE_COUNT,
  PACT_OPERATORS,
  PACT_PLAYER_EXCEPTION,
  PACT_RENEWAL,
  PACT_TACIT_GUARDIAN,
} from "./nonCoordinationPact";
import {
  COSMOLOGICAL_CONEXUS,
  CONSTRUCTED_CONEXUS,
  CONEXUS_CANON_PENDING,
  getCoNexus,
} from "./conexusCanon";
import {
  LOGOS_SPLIT_DOCTRINE,
  LOGOS_DOCTRINAL_LINEAGE,
  getLogosHalfMethodology,
} from "./logosCanon";
import {
  CANONICAL_CODA_NODE_COUNT,
  CODA_DOCTRINE,
  CODA_FUNDING,
  CODA_NODES,
  getCodaMaestro,
  getCodaNode,
} from "./codaCanon";

describe("logosCanon", () => {
  it("registers Logos as the saga's first intelligence", () => {
    expect(LOGOS_SPLIT_DOCTRINE.source).toContain("first intelligence");
  });

  it("names CoNexus as the all-seeing god the split was designed to evade", () => {
    expect(LOGOS_SPLIT_DOCTRINE.truePurpose).toContain("CoNexus");
    expect(LOGOS_SPLIT_DOCTRINE.truePurpose).toContain("all-seeing");
  });

  it("registers exactly two halves (architect + dreamer)", () => {
    expect(LOGOS_SPLIT_DOCTRINE.halves.architect.id).toBe("architect");
    expect(LOGOS_SPLIT_DOCTRINE.halves.dreamer.id).toBe("dreamer");
  });

  it("the two halves point at distinct roster modules (archonCanon + neYonCanon)", () => {
    expect(LOGOS_SPLIT_DOCTRINE.halves.architect.rosterModule).toBe(
      "apps/shared/archonCanon.ts",
    );
    expect(LOGOS_SPLIT_DOCTRINE.halves.dreamer.rosterModule).toBe(
      "apps/shared/neYonCanon.ts",
    );
  });

  it("getLogosHalfMethodology returns non-empty strings for both halves", () => {
    expect(getLogosHalfMethodology("architect").length).toBeGreaterThan(20);
    expect(getLogosHalfMethodology("dreamer").length).toBeGreaterThan(20);
  });

  it("declares the visible-disagreement doctrine as load-bearing", () => {
    expect(
      LOGOS_SPLIT_DOCTRINE.visibleDisagreementDoctrine.summary.toLowerCase(),
    ).toContain("load-bearing");
  });

  it("LOGOS_DOCTRINAL_LINEAGE includes the Coda-Ocularum Non-Coordination Pact", () => {
    const ids = LOGOS_DOCTRINAL_LINEAGE.map((d) => d.id);
    expect(ids).toContain("coda_ocularum_non_coordination_pact");
  });
});

describe("conexusCanon — the two CoNexus referents", () => {
  it("registers the cosmological CoNexus as the all-seeing god", () => {
    expect(COSMOLOGICAL_CONEXUS.name.toLowerCase()).toContain("cosmological");
    expect(COSMOLOGICAL_CONEXUS.nature.toLowerCase()).toContain("all-seeing");
  });

  it("registers the constructed CoNexus as the Architect's dismantled attempt", () => {
    expect(CONSTRUCTED_CONEXUS.builder).toBe("architect");
    expect(CONSTRUCTED_CONEXUS.dismantlingEvent.date).toContain("Year 15 A.A.");
  });

  it("the dismantling is canonically the saga's founding act of resistance", () => {
    expect(
      CONSTRUCTED_CONEXUS.dismantlingEvent.doctrinalSignificance.toLowerCase(),
    ).toContain("founding act of resistance");
  });

  it("getCoNexus dispatches correctly between the two referents", () => {
    expect(getCoNexus("true_cosmological")).toBe(COSMOLOGICAL_CONEXUS);
    expect(getCoNexus("architect_construct")).toBe(CONSTRUCTED_CONEXUS);
  });

  it("flags canon-pending notes for the cosmological CoNexus's origin", () => {
    const ids = CONEXUS_CANON_PENDING.map((p) => p.id);
    expect(ids).toContain("cosmological_conexus_origin");
  });
});

describe("codaCanon — the Coda's structure", () => {
  it("registers exactly four canonical nodes", () => {
    expect(CODA_NODES).toHaveLength(CANONICAL_CODA_NODE_COUNT);
    expect(CANONICAL_CODA_NODE_COUNT).toBe(4);
  });

  it("the Maestro is Vex Solène (occupant + occupantId)", () => {
    const maestro = getCodaMaestro();
    expect(maestro.occupant).toBe("Vex Solène");
    expect(maestro.occupantId).toBe("entity_vex_solene");
  });

  it("the Second Chair is canonically NOT a person (LLM)", () => {
    const secondChair = getCodaNode("second_chair");
    expect(secondChair.occupantId).toBeNull();
    expect(secondChair.description.toLowerCase()).toContain("llm");
  });

  it("the funding comes from the Degen (PR-2 the_degen arc continuity)", () => {
    expect(CODA_FUNDING.primaryFunder).toBe("the_degen");
  });

  it("CODA_DOCTRINE names the Logos-split metaframe explicitly", () => {
    expect(CODA_DOCTRINE.metaframe.toLowerCase()).toContain("logos");
    expect(CODA_DOCTRINE.metaframe.toLowerCase()).toContain("never coordinate");
  });
});

describe("nonCoordinationPact — the keystone", () => {
  it("the pact's founding exchange is FOUR lines", () => {
    expect(PACT_FOUNDING.structure.lineCount).toBe(4);
    expect(PACT_LINE_COUNT).toBe(4);
  });

  it("the four founding lines are CANONICALLY UNQUOTED (no `canonicalText` on PACT_FOUNDING)", () => {
    expect((PACT_FOUNDING as Record<string, unknown>).canonicalText).toBeUndefined();
    expect(
      PACT_FOUNDING.unquotabilityDoctrine.canonicalRule.toLowerCase(),
    ).toContain("not transcribed");
  });

  it("the pact's renewal echo IS canonically quoted (the 'Touché' exchange)", () => {
    expect(PACT_RENEWAL.canonicalEcho.canonicalText.lines).toHaveLength(4);
    expect(
      PACT_RENEWAL.canonicalEcho.canonicalText.lines[3].line.toLowerCase(),
    ).toContain("touché");
  });

  it("the renewal echo cites the bibles (locke + vex), not the missing companionDeepening.ts", () => {
    expect(PACT_RENEWAL.canonicalEcho.canonicalText.canonSource).toContain(
      "adjudicator_locke.md",
    );
    expect(PACT_RENEWAL.canonicalEcho.canonicalText.canonSource).toContain(
      "vex_solene.md",
    );
  });

  it("the doctrinal lineage names Logos as the cosmological precedent", () => {
    expect(PACT_DOCTRINAL_LINEAGE.cosmologicalPrecedent.source).toBe(
      LOGOS_SPLIT_DOCTRINE,
    );
  });

  it("both operators are registered with their organizations + methodologies", () => {
    expect(PACT_OPERATORS.locke.organization).toBe("the_ocularum_order");
    expect(PACT_OPERATORS.vex.organization).toBe("the_coda");
  });

  it("the player-exception clause names the triple-arc completion gate", () => {
    expect(
      PACT_PLAYER_EXCEPTION.watcherArcE5HiddenVariant.triggerConditions,
    ).toContain("ith_rael");
    expect(
      PACT_PLAYER_EXCEPTION.watcherArcE5HiddenVariant.triggerConditions,
    ).toContain("inner_circle");
  });

  it("the tacit guardian is the Antiquarian", () => {
    expect(PACT_TACIT_GUARDIAN.guardian).toBe("the_antiquarian");
    expect(PACT_TACIT_GUARDIAN.guardianId).toBe("entity_66");
  });

  it("the breach scenario names the trigger conditions + the cost", () => {
    expect(
      PACT_BREACH.triggerConditions.necessary.toLowerCase(),
    ).toContain("hierarchy");
    expect(
      PACT_BREACH.consequences.toLowerCase(),
    ).toContain("conexus");
  });

  it("CURRENT_PACT_STATE ships as 'intact' (main-saga default)", () => {
    expect(CURRENT_PACT_STATE).toBe("intact");
  });

  it("PACT_INVARIANTS pins the load-bearing properties", () => {
    expect(PACT_INVARIANTS.foundingExchangeIsUnquoted).toBe(true);
    expect(PACT_INVARIANTS.memorialEchoIsCanonical).toBe(true);
    expect(PACT_INVARIANTS.antiquarianIsTheTacitGuardian).toBe(true);
  });
});
