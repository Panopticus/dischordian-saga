import { describe, expect, it } from "vitest";
import {
  computeForceLayout,
  boundsOf,
  type ForceLayoutNode,
  type ForceLayoutEdge,
} from "./forceLayout";

describe("computeForceLayout (audit/16 PR 26)", () => {
  it("places every node within the canvas bounds", () => {
    const nodes: ForceLayoutNode[] = [
      { id: "a" }, { id: "b" }, { id: "c" }, { id: "d" },
    ];
    const edges: ForceLayoutEdge[] = [
      { source: "a", target: "b" },
      { source: "b", target: "c" },
    ];
    const positions = computeForceLayout(nodes, edges, {
      width: 800, height: 600,
    });
    expect(positions.size).toBe(4);
    for (const [id, pos] of positions) {
      expect(pos.x, `${id}.x out of range`).toBeGreaterThanOrEqual(0);
      expect(pos.x, `${id}.x out of range`).toBeLessThanOrEqual(800);
      expect(pos.y, `${id}.y out of range`).toBeGreaterThanOrEqual(0);
      expect(pos.y, `${id}.y out of range`).toBeLessThanOrEqual(600);
    }
  });

  it("is deterministic for the same seed + inputs", () => {
    const nodes: ForceLayoutNode[] = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const edges: ForceLayoutEdge[] = [{ source: "a", target: "b" }];
    const opts = { width: 400, height: 400, seed: 99 };
    const a = computeForceLayout(nodes, edges, opts);
    const b = computeForceLayout(nodes, edges, opts);
    for (const [id, pa] of a) {
      const pb = b.get(id)!;
      expect(pb.x).toBeCloseTo(pa.x, 5);
      expect(pb.y).toBeCloseTo(pa.y, 5);
    }
  });

  it("produces different layouts for different seeds", () => {
    const nodes: ForceLayoutNode[] = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const edges: ForceLayoutEdge[] = [{ source: "a", target: "b" }];
    const a = computeForceLayout(nodes, edges, { width: 400, height: 400, seed: 1 });
    const b = computeForceLayout(nodes, edges, { width: 400, height: 400, seed: 2 });
    let diffCount = 0;
    for (const [id, pa] of a) {
      const pb = b.get(id)!;
      if (Math.abs(pa.x - pb.x) > 1 || Math.abs(pa.y - pb.y) > 1) diffCount++;
    }
    expect(diffCount).toBeGreaterThan(0);
  });

  it("connected nodes end up roughly within edgeLength of each other", () => {
    const nodes: ForceLayoutNode[] = [{ id: "a" }, { id: "b" }];
    const edges: ForceLayoutEdge[] = [{ source: "a", target: "b" }];
    const positions = computeForceLayout(nodes, edges, {
      width: 800, height: 600, edgeLength: 100, iterations: 400,
    });
    const a = positions.get("a")!;
    const b = positions.get("b")!;
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    // With one edge, two repelling nodes, they should settle
    // close to the ideal length (give it 50% slack since we
    // also have repulsion + centring forces).
    expect(dist).toBeGreaterThan(50);
    expect(dist).toBeLessThan(200);
  });

  it("disconnected nodes don't collapse onto the same point", () => {
    const nodes: ForceLayoutNode[] = [
      { id: "a" }, { id: "b" }, { id: "c" }, { id: "d" },
    ];
    const positions = computeForceLayout(nodes, [], {
      width: 600, height: 400,
    });
    // Pairwise distances should all be > 0 — repulsion
    // separates them.
    const ids = Array.from(positions.keys());
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const pa = positions.get(ids[i]!)!;
        const pb = positions.get(ids[j]!)!;
        const d = Math.hypot(pa.x - pb.x, pa.y - pb.y);
        expect(d, `${ids[i]} ↔ ${ids[j]} too close`).toBeGreaterThan(5);
      }
    }
  });

  it("empty node list produces an empty position map", () => {
    const positions = computeForceLayout([], [], { width: 800, height: 600 });
    expect(positions.size).toBe(0);
  });

  it("edges referencing missing nodes are ignored gracefully", () => {
    const nodes: ForceLayoutNode[] = [{ id: "a" }, { id: "b" }];
    const edges: ForceLayoutEdge[] = [
      { source: "a", target: "b" },
      { source: "a", target: "ghost" },
      { source: "ghost", target: "phantom" },
    ];
    expect(() =>
      computeForceLayout(nodes, edges, { width: 400, height: 400 }),
    ).not.toThrow();
  });

  it("respects the iterations option", () => {
    // More iterations should give a more relaxed layout —
    // assert by running 1 iter vs 200 iter on a connected
    // graph and checking that 200-iter has tighter
    // edge-length variance.
    const nodes: ForceLayoutNode[] = [
      { id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }, { id: "e" },
    ];
    const edges: ForceLayoutEdge[] = [
      { source: "a", target: "b" },
      { source: "b", target: "c" },
      { source: "c", target: "d" },
      { source: "d", target: "e" },
    ];
    const opts = { width: 600, height: 400, edgeLength: 80 };
    const lazy = computeForceLayout(nodes, edges, { ...opts, iterations: 1 });
    const settled = computeForceLayout(nodes, edges, { ...opts, iterations: 400 });
    const distances = (positions: Map<string, { x: number; y: number }>) =>
      edges.map((e) => {
        const a = positions.get(e.source)!;
        const b = positions.get(e.target)!;
        return Math.hypot(a.x - b.x, a.y - b.y);
      });
    const variance = (xs: number[]) => {
      const m = xs.reduce((s, x) => s + x, 0) / xs.length;
      return xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length;
    };
    expect(variance(distances(settled))).toBeLessThan(variance(distances(lazy)));
  });
});

describe("boundsOf", () => {
  it("returns Infinity bounds for an empty map", () => {
    const bounds = boundsOf(new Map());
    expect(bounds.minX).toBe(Infinity);
    expect(bounds.maxX).toBe(-Infinity);
  });

  it("returns the correct bounding box", () => {
    const positions = new Map<string, { x: number; y: number }>([
      ["a", { x: 10, y: 20 }],
      ["b", { x: 50, y: 5 }],
      ["c", { x: 30, y: 80 }],
    ]);
    const bounds = boundsOf(positions);
    expect(bounds.minX).toBe(10);
    expect(bounds.minY).toBe(5);
    expect(bounds.maxX).toBe(50);
    expect(bounds.maxY).toBe(80);
  });
});
