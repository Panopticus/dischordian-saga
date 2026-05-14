/* ═══════════════════════════════════════════════════════
   MYSTERY ENGINE CANON — Catalog integrity + cross-bind tests
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import type { ArcId } from "./mysteryTypes";
import {
  CANONICAL_MYSTERY_ENGINE_COUNT,
  MYSTERY_ENGINE_ARCS,
  findArcForCharacter,
  getArcAuthoringStatus,
  getArcsAvailableAtAct,
  getCompletedArcCount,
  getMysteryEngineArc,
  getNeYonAnchoredArcs,
  getOrphanCatalogEntries,
  getRegisteredMysteryDefinitionCount,
  getSpoilerProtectedArcs,
} from "./mysteryEngineCanon";

/** Helper: cast a string-literal arc id to the branded ArcId type. */
const asArc = (id: string): ArcId => id as ArcId;

describe("Mystery Engine catalog", () => {
  it("registers exactly 8 canonical arcs (6 spine + 2 DLC)", () => {
    expect(CANONICAL_MYSTERY_ENGINE_COUNT).toBe(8);
    expect(MYSTERY_ENGINE_ARCS).toHaveLength(8);
  });

  it("the runtime MYSTERY_DEFINITIONS count includes the 8 canonical arcs " +
     "(plus the other DLC mysteries from DLC_MYSTERIES)", () => {
    // The runtime registry spreads ...DLC_MYSTERIES on top of the 6
    // core arcs; the catalog covers 6 spine + 2 DLC (Wolf + Akai Shi).
    // The orphan-check below verifies every catalog entry has a
    // corresponding runtime definition.
    expect(getRegisteredMysteryDefinitionCount()).toBeGreaterThanOrEqual(
      CANONICAL_MYSTERY_ENGINE_COUNT,
    );
  });

  it("has no duplicate arc ids", () => {
    const ids = MYSTERY_ENGINE_ARCS.map((a) => a.arcId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no duplicate canonical-character bindings", () => {
    const chars = MYSTERY_ENGINE_ARCS.map((a) => a.canonicalCharacter);
    expect(new Set(chars).size).toBe(chars.length);
  });

  it("every catalog entry has a non-empty arcPremise", () => {
    for (const arc of MYSTERY_ENGINE_ARCS) {
      expect(arc.arcPremise.length).toBeGreaterThan(50);
    }
  });

  it("every catalog entry has a canon citation", () => {
    for (const arc of MYSTERY_ENGINE_ARCS) {
      expect(arc.loreSource.length).toBeGreaterThan(10);
    }
  });

  it("every catalog entry points at an arc with at least 1 authored mystery", () => {
    expect(getOrphanCatalogEntries()).toHaveLength(0);
  });

  it("all 8 arcs are canonically complete (5/5 episodes authored)", () => {
    expect(getCompletedArcCount()).toBe(8);
    for (const arc of MYSTERY_ENGINE_ARCS) {
      const status = getArcAuthoringStatus(arc.arcId);
      expect(status.status).toBe("complete");
      expect(status.episodesAuthored).toBeGreaterThanOrEqual(
        status.canonicalTarget,
      );
    }
  });
});

describe("Identity-collision resolution for arc lookup", () => {
  it("findArcForCharacter('Vex Solène') resolves to vex_solene arc", () => {
    expect(findArcForCharacter("Vex Solène")?.arcId).toBe("arc.vex_solene");
  });

  it("findArcForCharacter('Agent Zero') resolves to vex_solene arc (alias collision)", () => {
    expect(findArcForCharacter("Agent Zero")?.arcId).toBe("arc.vex_solene");
  });

  it("findArcForCharacter('Engineer Zero') resolves to vex_solene arc (alias)", () => {
    expect(findArcForCharacter("Engineer Zero")?.arcId).toBe("arc.vex_solene");
  });

  it("findArcForCharacter('Hierophant Wraith') resolves to wraith_calder arc " +
     "(audit-collision alias)", () => {
    expect(findArcForCharacter("Hierophant Wraith")?.arcId).toBe(
      "arc.wraith_calder",
    );
  });

  it("findArcForCharacter('The Red Death') resolves to akai_shi_red_death " +
     "(alias collision via manifold)", () => {
    // Akai Shi's identity manifold registers "The Red Death" as her
    // post-resurrection canonical alias. With the DLC arc now in the
    // catalog, the lookup resolves to it.
    expect(findArcForCharacter("The Red Death")?.arcId).toBe(
      "arc.dlc.akai_shi_red_death",
    );
  });

  it("findArcForCharacter('Lycos') resolves to wolf_anara_hunt " +
     "(pre-resurrection alias)", () => {
    // Per dreamer-canon §I.1a: Lycos is the Wolf's pre-resurrection
    // name. The identity manifold registers the alias; the Wolf · Anara
    // Hunt DLC arc is its catalog binding.
    expect(findArcForCharacter("Lycos")?.arcId).toBe(
      "arc.dlc.wolf_anara_hunt",
    );
  });

  it("findArcForCharacter for unknown character returns null", () => {
    expect(findArcForCharacter("Nobody Real")).toBeNull();
  });
});

describe("Cosmic anchors", () => {
  it("the_degen arc anchors to Ne-Yon the_degen", () => {
    const arc = getMysteryEngineArc(asArc("arc.the_degen"));
    expect(arc?.cosmicAnchor).toEqual({ kind: "ne-yon", neYonId: "the_degen" });
  });

  it("the_seer arc anchors to Ne-Yon the_seer", () => {
    const arc = getMysteryEngineArc(asArc("arc.the_seer"));
    expect(arc?.cosmicAnchor).toEqual({ kind: "ne-yon", neYonId: "the_seer" });
  });

  it("game_master arc anchors to Archon the_game_master", () => {
    const arc = getMysteryEngineArc(asArc("arc.game_master"));
    expect(arc?.cosmicAnchor).toEqual({
      kind: "archon",
      archonId: "the_game_master",
    });
  });

  it("wraith_calder arc anchors to potential", () => {
    expect(getMysteryEngineArc(asArc("arc.wraith_calder"))?.cosmicAnchor.kind).toBe(
      "potential",
    );
  });

  it("jericho_jones arc anchors to potential", () => {
    expect(getMysteryEngineArc(asArc("arc.jericho_jones"))?.cosmicAnchor.kind).toBe(
      "potential",
    );
  });

  it("vex_solene arc anchors to potential", () => {
    expect(getMysteryEngineArc(asArc("arc.vex_solene"))?.cosmicAnchor.kind).toBe(
      "potential",
    );
  });

  it("getNeYonAnchoredArcs returns the Degen + Seer arcs", () => {
    const neYonArcs = getNeYonAnchoredArcs();
    expect(neYonArcs).toHaveLength(2);
    const arcIds = neYonArcs.map((a) => a.arcId).sort();
    expect(arcIds).toEqual(["arc.the_degen", "arc.the_seer"]);
  });
});

describe("Spoiler protection", () => {
  it("vex_solene is spoiler-protected (Act 5 reveal)", () => {
    expect(getMysteryEngineArc(asArc("arc.vex_solene"))?.spoilerProtected).toBe(true);
  });

  it("no other arc is spoiler-protected at catalog level", () => {
    const protectedArcs = getSpoilerProtectedArcs();
    expect(protectedArcs).toHaveLength(1);
    expect(protectedArcs[0].arcId).toBe("arc.vex_solene");
  });

  it("vex_solene unlocks at Act 5", () => {
    expect(getMysteryEngineArc(asArc("arc.vex_solene"))?.unlockAct).toBe(5);
  });
});

describe("Saga-act gating", () => {
  it("Act 1 unlocks zero arcs (none gate at act 1)", () => {
    expect(getArcsAvailableAtAct(1)).toHaveLength(0);
  });

  it("Act 2 unlocks Wraith + Jericho + Seer arcs", () => {
    const arcs = getArcsAvailableAtAct(2);
    const ids = arcs.map((a) => a.arcId).sort();
    expect(ids).toEqual([
      "arc.jericho_jones",
      "arc.the_seer",
      "arc.wraith_calder",
    ]);
  });

  it("Act 3 unlocks the Degen + Wolf + Akai Shi arcs on top of Act 2 arcs", () => {
    const arcs = getArcsAvailableAtAct(3);
    const ids = arcs.map((a) => a.arcId);
    expect(ids).toContain("arc.the_degen");
    expect(ids).toContain("arc.dlc.wolf_anara_hunt");
    expect(ids).toContain("arc.dlc.akai_shi_red_death");
  });

  it("Act 4 unlocks the Game Master arc", () => {
    const arcs = getArcsAvailableAtAct(4);
    expect(arcs.map((a) => a.arcId)).toContain("arc.game_master");
  });

  it("Act 5 unlocks all 8 arcs (including spoiler-protected vex_solene)", () => {
    expect(getArcsAvailableAtAct(5)).toHaveLength(8);
  });

  it("Acts 6+ also expose all 8 arcs (no gating drift)", () => {
    expect(getArcsAvailableAtAct(7)).toHaveLength(8);
    expect(getArcsAvailableAtAct(14)).toHaveLength(8);
  });
});

describe("Cross-bind invariants", () => {
  it("Vex Solène arc binds to vex_solene_manifold", () => {
    expect(getMysteryEngineArc(asArc("arc.vex_solene"))?.manifoldId).toBe(
      "vex_solene_manifold",
    );
  });

  it("Wraith Calder arc binds to wraith_calder_manifold", () => {
    expect(getMysteryEngineArc(asArc("arc.wraith_calder"))?.manifoldId).toBe(
      "wraith_calder_manifold",
    );
  });

  it("Wolf · Anara Hunt arc binds to wolf_manifold", () => {
    expect(
      getMysteryEngineArc(asArc("arc.dlc.wolf_anara_hunt"))?.manifoldId,
    ).toBe("wolf_manifold");
  });

  it("Akai Shi · Red Death arc binds to akai_shi_manifold", () => {
    expect(
      getMysteryEngineArc(asArc("arc.dlc.akai_shi_red_death"))?.manifoldId,
    ).toBe("akai_shi_manifold");
  });

  it("Arcs without identity-manifold binding have manifoldId: null", () => {
    // Per canon: the Degen, the Seer, the Game Master, and Jericho all
    // have canonical character entries but are NOT in the identity-
    // collision registry (their aliases are not audit-flagged for
    // collision resolution).
    expect(getMysteryEngineArc(asArc("arc.the_degen"))?.manifoldId).toBeNull();
    expect(getMysteryEngineArc(asArc("arc.the_seer"))?.manifoldId).toBeNull();
    expect(getMysteryEngineArc(asArc("arc.game_master"))?.manifoldId).toBeNull();
    expect(getMysteryEngineArc(asArc("arc.jericho_jones"))?.manifoldId).toBeNull();
  });
});
