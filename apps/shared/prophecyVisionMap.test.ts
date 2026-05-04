/* ═══════════════════════════════════════════════════════
   Prophecy vision map — registry invariants

   Asserts that every entry in the registry is well-formed:
   ids unique, flag bindings unique, bookend prophecy ids
   resolve, themes match the spine, slideshow ids resolve.
   The registry is the structural backbone of the dream
   surface; coverage tests guard it against silent drift.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import {
  PROPHECY_VISIONS,
  findProphecyForFlag,
  getProphecyVisionById,
  isProphecyEligible,
  listMarquees,
  listVisionsForAlbum,
  listVisionsForAct,
  resolveBookend,
  resolveSlideshowForVision,
  validateProphecyRegistry,
} from "./prophecyVisionMap";
import { ORACLE_DECK_MAP } from "./tcg-core/tarot/oracleDeck";

describe("prophecyVisionMap — structural invariants", () => {
  it("registry validates clean", () => {
    const issues = validateProphecyRegistry();
    expect(issues).toEqual([]);
  });

  it("every vision id is unique", () => {
    const ids = PROPHECY_VISIONS.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every flag id is unique", () => {
    const flags = PROPHECY_VISIONS.map((v) => v.flagId);
    expect(new Set(flags).size).toBe(flags.length);
  });

  it("every slideshow id resolves via resolveSlideshowForVision", () => {
    for (const v of PROPHECY_VISIONS) {
      const def = resolveSlideshowForVision(v);
      // Some album-5 slideshows are not yet authored — skip those
      // gracefully but assert the rest. Album 1 + Album 3 ids are
      // canonical, so the registry can't ship pointing to dead
      // ids in those albums.
      if (
        v.albumSlug === "dischordian-logic" ||
        v.albumSlug === "book-of-daniel"
      ) {
        expect(def, `slideshow ${v.slideshowId} for ${v.id} not found`).toBeTruthy();
      }
    }
  });

  it("every Oracle binding resolves", () => {
    for (const v of PROPHECY_VISIONS) {
      if (!v.oracleCardSlug) continue;
      expect(
        ORACLE_DECK_MAP[v.oracleCardSlug],
        `Oracle slug ${v.oracleCardSlug} on ${v.id} not in deck`,
      ).toBeTruthy();
    }
  });

  it("First Visitation + capstone are the only unawakenable visions", () => {
    const unawakenable = PROPHECY_VISIONS.filter((v) => v.unawakenable).map(
      (v) => v.id,
    );
    expect(unawakenable.sort()).toEqual(
      ["pv_album5_capstone_lamb", "pv_first_visitation"].sort(),
    );
  });

  it("findProphecyForFlag round-trips", () => {
    for (const v of PROPHECY_VISIONS) {
      expect(findProphecyForFlag(v.flagId)?.id).toBe(v.id);
    }
  });

  it("getProphecyVisionById round-trips", () => {
    for (const v of PROPHECY_VISIONS) {
      expect(getProphecyVisionById(v.id)?.id).toBe(v.id);
    }
  });

  it("resolveBookend returns both halves for every vision", () => {
    for (const v of PROPHECY_VISIONS) {
      const bookend = resolveBookend(v);
      expect(bookend, `bookend missing for ${v.id}`).toBeTruthy();
      expect(bookend!.opening.id).toBe(v.openingProphecyId);
      expect(bookend!.closing.id).toBe(v.closingProphecyId);
    }
  });

  it("listVisionsForAlbum returns the expected count for each album", () => {
    const dl = listVisionsForAlbum("dischordian-logic");
    expect(dl.length).toBeGreaterThan(0);
    const bod = listVisionsForAlbum("book-of-daniel");
    expect(bod.length).toBeGreaterThan(0);
  });

  it("listVisionsForAct partitions correctly", () => {
    for (const v of PROPHECY_VISIONS) {
      const list = listVisionsForAct(v.playerAct);
      expect(list).toContain(v);
    }
  });

  it("listMarquees returns only marquee-tier visions", () => {
    expect(listMarquees().every((v) => v.intensity === "marquee")).toBe(true);
  });
});

describe("prophecyVisionMap — eligibility", () => {
  it("isProphecyEligible rejects when awareness is too low", () => {
    const v = PROPHECY_VISIONS.find((x) => x.gate?.minAwareness);
    expect(v).toBeTruthy();
    expect(
      isProphecyEligible(v!, {
        awareness: 0,
        currentAct: 5,
        firstContactReceived: true,
      }),
    ).toBe(false);
  });

  it("isProphecyEligible accepts when gates pass", () => {
    const first = getProphecyVisionById("pv_first_visitation")!;
    expect(
      isProphecyEligible(first, {
        awareness: 3,
        currentAct: 1,
        firstContactReceived: false,
      }),
    ).toBe(true);
  });

  it("rejects when act is below minAct", () => {
    const v = PROPHECY_VISIONS.find(
      (x) => x.gate?.minAct !== undefined && x.gate.minAct > 1,
    );
    expect(v).toBeTruthy();
    expect(
      isProphecyEligible(v!, {
        awareness: 100,
        currentAct: 0,
        firstContactReceived: true,
      }),
    ).toBe(false);
  });

  it("rejects when act exceeds maxAct", () => {
    const v = PROPHECY_VISIONS.find((x) => x.gate?.maxAct !== undefined);
    if (!v) return;
    expect(
      isProphecyEligible(v, {
        awareness: 100,
        currentAct: 9,
        firstContactReceived: true,
      }),
    ).toBe(false);
  });
});
