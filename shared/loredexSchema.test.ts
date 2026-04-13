import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  validateLoredex,
  summarizeIssues,
  LoredexEntrySchema,
  LoredexRelationshipSchema,
} from "./loredexSchema";

describe("loredexSchema", () => {
  describe("LoredexEntrySchema", () => {
    it("accepts a valid character entry", () => {
      const entry = {
        id: "test_char",
        type: "character",
        name: "Test",
        aliases: [],
        era: "Fall",
        date_aa: "1 A.A.",
        date_ad: "1000 AD",
        season: "Season 1",
        affiliation: "Test",
        status: "Active",
        bio: "Test bio.",
        history: "Test history.",
        connections: [],
        conexus_stories: [],
        song_appearances: [],
        image: "",
        priority: "high",
      };
      expect(LoredexEntrySchema.safeParse(entry).success).toBe(true);
    });

    it("rejects unknown entry type", () => {
      const entry = {
        id: "x", type: "nonsense", name: "X", aliases: [], era: "", date_aa: "",
        date_ad: "", season: "", affiliation: "", status: "", bio: "", history: "",
        connections: [], conexus_stories: [], song_appearances: [],
      };
      expect(LoredexEntrySchema.safeParse(entry).success).toBe(false);
    });

    it("rejects empty id", () => {
      const entry = {
        id: "", type: "character", name: "X", aliases: [], era: "", date_aa: "",
        date_ad: "", season: "", affiliation: "", status: "", bio: "", history: "",
        connections: [], conexus_stories: [], song_appearances: [],
      };
      expect(LoredexEntrySchema.safeParse(entry).success).toBe(false);
    });
  });

  describe("LoredexRelationshipSchema", () => {
    it("accepts valid relationship", () => {
      const rel = { source: "a", target: "b", relationship_type: "enemy", source_type: "character" };
      expect(LoredexRelationshipSchema.safeParse(rel).success).toBe(true);
    });

    it("rejects missing source", () => {
      const rel = { target: "b", relationship_type: "enemy" };
      expect(LoredexRelationshipSchema.safeParse(rel).success).toBe(false);
    });
  });

  describe("validateLoredex (live data)", () => {
    const dataPath = resolve(__dirname, "../client/src/data/loredex-data.json");
    const raw = JSON.parse(readFileSync(dataPath, "utf-8"));

    it("validates the actual loredex-data.json without crashing", () => {
      const result = validateLoredex(raw);
      expect(result.entryCount).toBeGreaterThan(100);
      expect(result.relationshipCount).toBeGreaterThan(100);
    });

    it("logs issue summary for review", () => {
      const result = validateLoredex(raw);
      if (result.issues.length > 0) {
        const summary = summarizeIssues(result.issues);
        console.log(`\nLoredex found ${result.issues.length} issues:`, summary);
      }
      expect(typeof result.issues).toBe("object");
    });
  });

  describe("validateLoredex (synthetic)", () => {
    it("flags duplicate ids", () => {
      const data = {
        entries: [
          { id: "dup", type: "character", name: "A", aliases: [], era: "", date_aa: "", date_ad: "",
            season: "", affiliation: "", status: "", bio: "test", history: "", connections: [],
            conexus_stories: [], song_appearances: [] },
          { id: "dup", type: "location", name: "B", aliases: [], era: "", date_aa: "", date_ad: "",
            season: "", affiliation: "", status: "", bio: "test", history: "", connections: [],
            conexus_stories: [], song_appearances: [] },
        ],
        relationships: [],
      };
      const result = validateLoredex(data);
      expect(result.issues.some(i => i.kind === "duplicate_id")).toBe(true);
    });

    it("flags broken relationship references", () => {
      const data = {
        entries: [
          { id: "a", type: "character", name: "A", aliases: [], era: "", date_aa: "", date_ad: "",
            season: "", affiliation: "", status: "", bio: "test", history: "", connections: [],
            conexus_stories: [], song_appearances: [] },
        ],
        relationships: [
          { source: "a", target: "ghost_id", relationship_type: "enemy" },
        ],
      };
      const result = validateLoredex(data);
      expect(result.issues.some(i => i.kind === "broken_reference")).toBe(true);
    });

    it("flags empty bio", () => {
      const data = {
        entries: [
          { id: "x", type: "character", name: "X", aliases: [], era: "", date_aa: "", date_ad: "",
            season: "", affiliation: "", status: "", bio: "   ", history: "", connections: [],
            conexus_stories: [], song_appearances: [] },
        ],
        relationships: [],
      };
      const result = validateLoredex(data);
      expect(result.issues.some(i => i.kind === "empty_required_field")).toBe(true);
    });
  });
});
