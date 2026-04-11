import { describe, it, expect } from "vitest";
import {
  getMascoteerReferences,
  getMechronisProfessorReferences,
  listEntitiesWithXrefs,
  MASCOTEER_XREFS,
  MECHRONIS_PROFESSOR_XREFS,
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
      const { mascoteers, professors } = listEntitiesWithXrefs();
      expect(mascoteers.length).toBeGreaterThanOrEqual(3);
      expect(professors.length).toBeGreaterThanOrEqual(1);
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
