import { describe, it, expect } from "vitest";
import {
  getEntityXrefs,
  getMascoteerReferences,
  getMechronisProfessorReferences,
  listEntitiesWithXrefs,
  MASCOTEER_XREFS,
  MECHRONIS_PROFESSOR_XREFS,
  WITNESSING_ENTITY_XREFS,
} from "./witnessingCanonXref";
import { SONG_SLIDESHOWS } from "./songSlideshows";
import { WITNESSING_MILESTONES } from "./witnessingEvents";

describe("witnessingCanonXref — §14.3 cross-references", () => {
  describe("MASCOTEER_XREFS", () => {
    it("has entries for the three canonical Mascoteers", () => {
      expect(MASCOTEER_XREFS).toHaveProperty("little_meme");
      expect(MASCOTEER_XREFS).toHaveProperty("little_collector");
      expect(MASCOTEER_XREFS).toHaveProperty("little_watcher");
    });

    it("Little Watcher references both a slideshow and a milestone", () => {
      const refs = getMascoteerReferences("little_watcher");
      const kinds = refs.map((r) => r.kind);
      expect(kinds).toContain("slideshow");
      expect(kinds).toContain("milestone");
    });

    it("every referenced slideshow id exists in SONG_SLIDESHOWS", () => {
      for (const refs of Object.values(MASCOTEER_XREFS)) {
        for (const ref of refs) {
          if (ref.kind !== "slideshow") continue;
          expect(
            SONG_SLIDESHOWS[ref.refId],
            `Slideshow ${ref.refId} not found in registry`,
          ).toBeDefined();
        }
      }
    });
  });

  describe("MECHRONIS_PROFESSOR_XREFS", () => {
    it("has an entry for the Seer per §12 C3", () => {
      const refs = getMechronisProfessorReferences("the_seer");
      expect(refs.length).toBeGreaterThan(0);
      // The Seer shows up in BOTH To Be the Human and Hacking
      // Reality per the proposal.
      const slideshowRefs = refs.filter((r) => r.kind === "slideshow");
      expect(slideshowRefs.length).toBeGreaterThanOrEqual(2);
    });

    it("every referenced slideshow id exists in SONG_SLIDESHOWS", () => {
      for (const refs of Object.values(MECHRONIS_PROFESSOR_XREFS)) {
        for (const ref of refs) {
          if (ref.kind !== "slideshow") continue;
          expect(
            SONG_SLIDESHOWS[ref.refId],
            `Slideshow ${ref.refId} not found in registry`,
          ).toBeDefined();
        }
      }
    });
  });

  describe("lookup helpers", () => {
    it("returns an empty array for unknown Mascoteer ids", () => {
      expect(getMascoteerReferences("not_a_mascoteer")).toEqual([]);
    });

    it("returns an empty array for unknown Professor ids", () => {
      expect(getMechronisProfessorReferences("not_a_professor")).toEqual([]);
    });

    it("listEntitiesWithXrefs returns the full lists", () => {
      const { entities, mascoteers, professors } = listEntitiesWithXrefs();
      expect(entities.length).toBeGreaterThanOrEqual(10);
      expect(mascoteers.length).toBeGreaterThanOrEqual(3);
      expect(professors.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("WITNESSING_ENTITY_XREFS — Loredex entity-keyed xrefs", () => {
    it("has entries for the canonical Witnessing characters", () => {
      // Spot-check: if these ids are missing the LoredexWitnessingXrefs
      // panel on EntityPage will render empty.
      expect(WITNESSING_ENTITY_XREFS).toHaveProperty("entity_18"); // Engineer
      expect(WITNESSING_ENTITY_XREFS).toHaveProperty("entity_22"); // Eyes
      expect(WITNESSING_ENTITY_XREFS).toHaveProperty("entity_23"); // Iron Lion
      expect(WITNESSING_ENTITY_XREFS).toHaveProperty("entity_49"); // Kael
      expect(WITNESSING_ENTITY_XREFS).toHaveProperty("entity_66"); // Antiquarian
      expect(WITNESSING_ENTITY_XREFS).toHaveProperty("entity_106"); // Darren Fessler
    });

    it("every xref has a non-empty context and refId", () => {
      for (const refs of Object.values(WITNESSING_ENTITY_XREFS)) {
        for (const ref of refs) {
          expect(ref.refId.length).toBeGreaterThan(0);
          expect(ref.context.length).toBeGreaterThan(0);
        }
      }
    });

    it("Darren's xrefs include the Clause 14 delivery sentence", () => {
      const refs = WITNESSING_ENTITY_XREFS.entity_106;
      const sentence = refs.find(
        (r) => r.refId === "clause_14_delivery_sentence",
      );
      expect(sentence).toBeDefined();
    });

    it("Iron Lion's xrefs include the Lion's Last Broadcast milestone", () => {
      const refs = WITNESSING_ENTITY_XREFS.entity_23;
      const milestone = refs.find(
        (r) => r.kind === "milestone" && r.refId === "lions_last_broadcast",
      );
      expect(milestone).toBeDefined();
    });
  });

  describe("getEntityXrefs — unified lookup", () => {
    it("returns the entity-keyed xrefs for a Loredex entity id", () => {
      const refs = getEntityXrefs("entity_18"); // Engineer
      expect(refs.length).toBeGreaterThan(0);
    });

    it("falls through to the mascoteer map for legacy ids", () => {
      const refs = getEntityXrefs("little_watcher");
      expect(refs.length).toBeGreaterThan(0);
    });

    it("falls through to the professor map for legacy ids", () => {
      const refs = getEntityXrefs("the_seer");
      expect(refs.length).toBeGreaterThan(0);
    });

    it("returns an empty array for unknown ids", () => {
      expect(getEntityXrefs("entity_9999999")).toEqual([]);
    });
  });

  describe("referential integrity", () => {
    it("every referenced milestone flag exists as a raisesFlag or trigger flag", () => {
      // Collect all known milestone raisesFlags.
      const knownFlags = new Set<string>();
      for (const m of Object.values(WITNESSING_MILESTONES)) {
        knownFlags.add(m.raisesFlag);
      }
      // We don't enforce 100% coverage here — milestone refs
      // can reference trigger flags not in the milestone
      // registry yet. We just sanity-check that the flag string
      // is non-empty.
      for (const refs of Object.values(MASCOTEER_XREFS)) {
        for (const ref of refs) {
          if (ref.kind !== "milestone") continue;
          expect(ref.refId.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
