import { describe, it, expect } from "vitest";

import {
  CINEMATICS,
  CINEMATICS_TOTAL,
  cinematicForAct,
  cinematicKeyframeUrl,
  cinematicVideoUrl,
  VFX_CLIPS,
  VFX_TOTAL,
  vfxByCategory,
  vfxKeyframeUrl,
  vfxVideoUrl,
  type CinematicId,
  type VfxCategory,
} from "../cinematicsManifest";

const CDN_PREFIX = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/";

describe("Cinematics manifest", () => {
  it("ships exactly 9 cinematics (per producer drop)", () => {
    expect(CINEMATICS_TOTAL).toBe(9);
    expect(CINEMATICS).toHaveLength(9);
  });

  it("has unique cinematic ids", () => {
    const ids = CINEMATICS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("act 1-7 cinematics each carry a matching gateAct", () => {
    const gated = CINEMATICS.filter((c) => c.gateAct !== undefined);
    expect(gated).toHaveLength(7);
    const acts = new Set(gated.map((c) => c.gateAct));
    expect(acts).toEqual(new Set([1, 2, 3, 4, 5, 6, 7]));
  });

  it("the two universal cinematics (pack opening, hierarchy reveal) carry no gateAct", () => {
    const universal = CINEMATICS.filter((c) => c.gateAct === undefined);
    expect(universal.map((c) => c.id).sort()).toEqual([
      "01_pack_opening",
      "02_hierarchy_reveal",
    ]);
  });

  it("every cinematic has a videoRelPath under videos/cinematics/", () => {
    for (const c of CINEMATICS) {
      expect(c.videoRelPath).toMatch(/^videos\/cinematics\/\d{2}_[a-z0-9_]+\/cinematic_\d{2}_[a-z0-9_]+\.mp4$/);
    }
  });

  it("every keyframe sits under art/cinematics/<id>/keyframes/ as a .webp", () => {
    for (const c of CINEMATICS) {
      for (const kf of c.keyframeRelPaths) {
        expect(kf).toMatch(
          new RegExp(`^art/cinematics/${c.id}/keyframes/[a-z0-9_]+\\.webp$`),
        );
      }
    }
  });

  it("cinematicVideoUrl resolves a known id and returns undefined for unknown", () => {
    expect(cinematicVideoUrl("01_pack_opening")).toBe(
      `${CDN_PREFIX}videos/cinematics/01_pack_opening/cinematic_01_card_pack_opening.mp4`,
    );
    expect(cinematicVideoUrl("does_not_exist" as CinematicId)).toBeUndefined();
  });

  it("cinematicKeyframeUrl returns the right beat (1-indexed) and undefined past the end", () => {
    const url = cinematicKeyframeUrl("02_hierarchy_reveal", 2);
    expect(url).toBe(
      `${CDN_PREFIX}art/cinematics/02_hierarchy_reveal/keyframes/beat2_mol_garath_stand.webp`,
    );
    expect(cinematicKeyframeUrl("02_hierarchy_reveal", 99)).toBeUndefined();
  });

  it("cinematicForAct returns the matching cinematic for each act 1..7", () => {
    for (let act = 1; act <= 7; act++) {
      const c = cinematicForAct(act as 1 | 2 | 3 | 4 | 5 | 6 | 7);
      expect(c?.gateAct).toBe(act);
    }
  });
});

describe("VFX manifest", () => {
  it("ships exactly 18 VFX clips (per producer drop)", () => {
    expect(VFX_TOTAL).toBe(18);
    expect(VFX_CLIPS).toHaveLength(18);
  });

  it("has unique VFX ids", () => {
    const ids = VFX_CLIPS.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("category counts match the producer drop", () => {
    const expected: Record<VfxCategory, number> = {
      act_spells: 5,
      card_flips: 7,
      cosmetic_ceremonies: 3,
      hierarchy_mechanics: 3,
    };
    for (const [cat, count] of Object.entries(expected)) {
      expect(vfxByCategory(cat as VfxCategory)).toHaveLength(count);
    }
  });

  it("every clip has well-formed video + keyframe relPaths", () => {
    for (const v of VFX_CLIPS) {
      expect(v.videoRelPath).toMatch(/^videos\/vfx\/[a-z_]+\/vfx_[a-z0-9_]+\.mp4$/);
      expect(v.keyframeRelPath).toMatch(/^art\/vfx\/[a-z_]+\/kf_[a-z0-9_]+\.webp$/);
      expect(v.videoRelPath).toContain(`/${v.category}/`);
      expect(v.keyframeRelPath).toContain(`/${v.category}/`);
    }
  });

  it("vfxVideoUrl + vfxKeyframeUrl resolve known ids and return undefined for unknown", () => {
    expect(vfxVideoUrl("vfx_pack_flip_legendary")).toBe(
      `${CDN_PREFIX}videos/vfx/card_flips/vfx_pack_flip_legendary.mp4`,
    );
    expect(vfxKeyframeUrl("vfx_pack_flip_legendary")).toBe(
      `${CDN_PREFIX}art/vfx/card_flips/kf_legendary_end.webp`,
    );
    expect(vfxVideoUrl("does_not_exist")).toBeUndefined();
    expect(vfxKeyframeUrl("does_not_exist")).toBeUndefined();
  });
});
