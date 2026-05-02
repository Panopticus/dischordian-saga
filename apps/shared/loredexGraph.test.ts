/**
 * Pure-function tests for the loredex relationship-graph helpers
 * (C3). Covers the polar layout math, ref-resolution (id or name),
 * fog-state propagation, and edge-case handling for missing
 * entries.
 */
import { describe, it, expect } from "vitest";
import {
  focusNeighbourhood,
  neighbourPosition,
  type LoredexGraphEntry,
  type LoredexGraphRelationship,
} from "./loredexGraph";

const ENTRIES: LoredexGraphEntry[] = [
  { id: "entity_1", type: "character", name: "The Programmer" },
  { id: "entity_2", type: "character", name: "The Architect" },
  { id: "entity_3", type: "song", name: "Seeds of Inception" },
  { id: "entity_4", type: "faction", name: "The Insurgency" },
  { id: "entity_5", type: "location", name: "Coda" },
];

const RELATIONSHIPS: LoredexGraphRelationship[] = [
  // Programmer ↔ Architect (id refs)
  { source: "entity_1", target: "entity_2", relationship_type: "connected_to" },
  // Programmer → Seeds of Inception (mixed: id + name)
  { source: "entity_1", target: "Seeds of Inception", relationship_type: "featured_in_song" },
  // Insurgency → Programmer (name refs)
  { source: "The Insurgency", target: "The Programmer", relationship_type: "founded_by" },
  // Edge between two non-focus entities — should be ignored for the
  // 1-hop view of entity_1.
  { source: "entity_2", target: "entity_5", relationship_type: "operates_in" },
  // Self-loop — should be ignored.
  { source: "entity_1", target: "entity_1", relationship_type: "self" },
];

describe("neighbourPosition — polar layout", () => {
  it("returns origin for empty neighbour set", () => {
    expect(neighbourPosition(0, 0)).toEqual({ x: 0, y: 0 });
  });

  it("places the first neighbour at top (-Y on SVG axis)", () => {
    const pos = neighbourPosition(0, 4);
    expect(pos.x).toBe(0);
    expect(pos.y).toBeLessThan(0);
  });

  it("distributes neighbours evenly around a circle", () => {
    const four = [0, 1, 2, 3].map((i) => neighbourPosition(i, 4));
    // Each adjacent pair should be ~equidistant from the origin.
    const distances = four.map((p) => Math.sqrt(p.x ** 2 + p.y ** 2));
    for (const d of distances) {
      expect(d).toBeGreaterThan(200);
      expect(d).toBeLessThan(240);
    }
  });

  it("returns integer coordinates (no sub-pixel positioning)", () => {
    const pos = neighbourPosition(2, 7);
    expect(Number.isInteger(pos.x)).toBe(true);
    expect(Number.isInteger(pos.y)).toBe(true);
  });
});

describe("focusNeighbourhood — graph computation", () => {
  it("returns null for an unknown focus id", () => {
    expect(
      focusNeighbourhood("entity_doesnt_exist", ENTRIES, RELATIONSHIPS, new Set()),
    ).toBeNull();
  });

  it("returns the focus entity unfogged at origin", () => {
    const view = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, new Set());
    expect(view).not.toBeNull();
    expect(view!.focus.id).toBe("entity_1");
    expect(view!.focus.discovered).toBe(true);
    expect(view!.focus.x).toBe(0);
    expect(view!.focus.y).toBe(0);
  });

  it("collects 1-hop neighbours via id refs", () => {
    const view = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, new Set());
    const ids = view!.neighbours.map((n) => n.id);
    expect(ids).toContain("entity_2");
  });

  it("collects 1-hop neighbours via name refs (mixed-form data)", () => {
    const view = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, new Set());
    const ids = view!.neighbours.map((n) => n.id);
    expect(ids).toContain("entity_3"); // resolved from "Seeds of Inception"
    expect(ids).toContain("entity_4"); // resolved from "The Insurgency" (source side)
  });

  it("ignores self-loops in the 1-hop set", () => {
    const view = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, new Set());
    const ids = view!.neighbours.map((n) => n.id);
    expect(ids).not.toContain("entity_1");
  });

  it("ignores edges between two non-focus entities (1-hop only)", () => {
    const view = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, new Set());
    const ids = view!.neighbours.map((n) => n.id);
    // entity_5 (Coda) is connected to entity_2 (Architect), but
    // since we're focused on entity_1 it shouldn't appear in the
    // 1-hop view.
    expect(ids).not.toContain("entity_5");
  });

  it("fogs undiscovered neighbours (no name, discovered:false)", () => {
    const view = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, new Set());
    for (const n of view!.neighbours) {
      expect(n.discovered).toBe(false);
      expect(n.name).toBe("");
      // Type is preserved for fog-colour selection.
      expect(n.type).toBeDefined();
    }
  });

  it("unfogs neighbours present in discoveredIds", () => {
    const discovered = new Set(["entity_2", "entity_3"]);
    const view = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, discovered);
    const arch = view!.neighbours.find((n) => n.id === "entity_2");
    const seeds = view!.neighbours.find((n) => n.id === "entity_3");
    const insurg = view!.neighbours.find((n) => n.id === "entity_4");
    expect(arch?.discovered).toBe(true);
    expect(arch?.name).toBe("The Architect");
    expect(seeds?.discovered).toBe(true);
    expect(seeds?.name).toBe("Seeds of Inception");
    // Undiscovered neighbour stays fogged.
    expect(insurg?.discovered).toBe(false);
    expect(insurg?.name).toBe("");
  });

  it("each edge connects the focus to a neighbour (no neighbour-neighbour edges)", () => {
    const view = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, new Set());
    for (const edge of view!.edges) {
      expect(edge.source === "entity_1" || edge.target === "entity_1").toBe(true);
    }
  });

  it("preserves relationship_type on every edge", () => {
    const view = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, new Set());
    const types = new Set(view!.edges.map((e) => e.relationship_type));
    expect(types.has("connected_to")).toBe(true);
    expect(types.has("featured_in_song")).toBe(true);
    expect(types.has("founded_by")).toBe(true);
  });

  it("neighbour layout is deterministic for the same input", () => {
    const a = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, new Set());
    const b = focusNeighbourhood("entity_1", ENTRIES, RELATIONSHIPS, new Set());
    expect(a!.neighbours.map((n) => [n.id, n.x, n.y])).toEqual(
      b!.neighbours.map((n) => [n.id, n.x, n.y]),
    );
  });
});
