/**
 * Bucket-B parity test: every declared hierarchy_mechanics VFX clip
 * in cinematicsManifest must have a card-binding in
 * hierarchyMechanicsVfxMap, and every binding must reference a real
 * shipped card definition.
 */
import { describe, it, expect } from "vitest";
import { VFX_CLIPS } from "../cinematicsManifest";
import {
  HIERARCHY_CARD_TO_VFX,
  hierarchyMechanicVfxForCard,
  hierarchyVfxCardId,
  listHierarchyMechanicVfx,
} from "../hierarchyMechanicsVfxMap";
import { ALL_CARD_DEFINITIONS } from "@shared/tcg-core/cards";

describe("hierarchyMechanicsVfxMap — parity with cinematicsManifest", () => {
  it("every hierarchy_mechanics VFX in the manifest has a card binding", () => {
    const declared = VFX_CLIPS.filter((v) => v.category === "hierarchy_mechanics");
    expect(declared.length).toBeGreaterThan(0);
    for (const fx of declared) {
      const card = hierarchyVfxCardId(fx.id);
      expect(card, `VFX ${fx.id} has no card binding`).toBeDefined();
    }
  });

  it("listHierarchyMechanicVfx returns every clip in the category", () => {
    const listed = listHierarchyMechanicVfx().map((v) => v.id).sort();
    const expected = VFX_CLIPS.filter((v) => v.category === "hierarchy_mechanics")
      .map((v) => v.id)
      .sort();
    expect(listed).toEqual(expected);
  });

  it("every bound card id resolves to a shipped CardDefinition", () => {
    const cardIds = new Set(ALL_CARD_DEFINITIONS.map((c) => c.id));
    for (const cardId of Object.keys(HIERARCHY_CARD_TO_VFX)) {
      expect(cardIds.has(cardId as never), `card ${cardId} not in registry`).toBe(true);
    }
  });

  it("every bound VFX id resolves to a declared VFX clip", () => {
    const vfxIds = new Set(VFX_CLIPS.map((v) => v.id));
    for (const vfxId of Object.values(HIERARCHY_CARD_TO_VFX)) {
      expect(vfxIds.has(vfxId), `VFX ${vfxId} not declared`).toBe(true);
    }
  });

  it("bindings are bijective (one card per VFX, one VFX per card)", () => {
    const cards = Object.keys(HIERARCHY_CARD_TO_VFX);
    const vfx = Object.values(HIERARCHY_CARD_TO_VFX);
    expect(new Set(cards).size).toBe(cards.length);
    expect(new Set(vfx).size).toBe(vfx.length);
  });
});

describe("hierarchyMechanicVfxForCard", () => {
  it("returns video + keyframe urls for a bound card", () => {
    const fx = hierarchyMechanicVfxForCard("s2_hierarchy_mgr_perf_review_wraith");
    expect(fx).toBeDefined();
    expect(fx?.vfxId).toBe("vfx_perf_review");
    expect(fx?.videoUrl).toMatch(/vfx_perf_review\.mp4/);
    expect(fx?.keyframeUrl).toMatch(/kf_perf_review\.webp/);
  });

  it("returns undefined for non-hierarchy cards", () => {
    expect(hierarchyMechanicVfxForCard("s1_char_001_locke")).toBeUndefined();
    expect(hierarchyMechanicVfxForCard("totally_made_up_id")).toBeUndefined();
  });
});
