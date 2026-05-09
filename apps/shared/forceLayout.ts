/* ═══════════════════════════════════════════════════════
   FORCE-DIRECTED GRAPH LAYOUT — pure JS, no dependencies.

   audit/16 PR 26 — substrate for the Cluster A
   Investigation Board yarn-diagram. The audit'd visual
   intent is "force-directed yarn graph between clues,
   puzzles, and characters" — d3-force or react-flow would
   each pull in a heavy dependency, so this module ships
   the layout math in plain JS instead. ~150 lines of
   physics; tractable to read, tractable to test.

   Algorithm: classical Verlet-style relaxation with two
   forces:
     - Repulsion: every pair of nodes pushes apart (1/r²
       falloff, capped at a min distance to avoid blow-up)
     - Spring: connected nodes pull toward each other
       (linear attraction toward an ideal edge length)
   Plus a centring tug toward the middle of the canvas
   so disconnected components don't drift to infinity.

   Iterates `iterations` times per call; each call returns
   a fresh Map of positions (no mutation). Deterministic
   given the same nodes/edges/seed.

   The component code (`InvestigationYarnDiagram`) calls
   this once on mount + then on data change; doesn't
   re-simulate per frame. The result is a static layout
   the SVG renders directly.
   ═══════════════════════════════════════════════════════ */

export interface ForceLayoutNode {
  id: string;
  /** Optional weight; heavier nodes resist movement more.
   *  Typical: 1 for leaf nodes, 2-3 for hubs. */
  weight?: number;
}

export interface ForceLayoutEdge {
  source: string;
  target: string;
  /** Optional ideal-length override per edge (default
   *  uses the layout's `edgeLength`). */
  length?: number;
}

export interface ForceLayoutOptions {
  width: number;
  height: number;
  /** Iterations of the simulation. More iterations =
   *  cleaner layout but more compute. 200 is a good
   *  default for graphs ≤ 50 nodes. */
  iterations?: number;
  /** Repulsion strength constant. Larger = nodes push
   *  apart harder. */
  repulsion?: number;
  /** Spring strength constant. Larger = edges pull
   *  harder toward their ideal length. */
  springStrength?: number;
  /** Ideal edge length in pixels. */
  edgeLength?: number;
  /** Centring tug strength toward the canvas centre. */
  centringStrength?: number;
  /** Seed for deterministic initial placement. */
  seed?: number;
}

export interface Vec2 {
  x: number;
  y: number;
}

const DEFAULTS: Required<Omit<ForceLayoutOptions, "width" | "height" | "seed">> = {
  iterations: 200,
  repulsion: 4_500,
  springStrength: 0.05,
  edgeLength: 80,
  centringStrength: 0.005,
};

/** Mulberry32 PRNG — small + deterministic. */
function makeRng(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Run the force-directed simulation. Returns final
 *  positions keyed by node id. */
export function computeForceLayout(
  nodes: readonly ForceLayoutNode[],
  edges: readonly ForceLayoutEdge[],
  options: ForceLayoutOptions,
): Map<string, Vec2> {
  const opts = { ...DEFAULTS, seed: 42, ...options };
  const cx = opts.width / 2;
  const cy = opts.height / 2;
  const rng = makeRng(opts.seed);

  // Initial placement — random within the canvas with
  // a small jitter around centre. Deterministic via seed.
  const positions = new Map<string, Vec2>();
  for (const node of nodes) {
    positions.set(node.id, {
      x: cx + (rng() - 0.5) * opts.width * 0.6,
      y: cy + (rng() - 0.5) * opts.height * 0.6,
    });
  }

  // Index edges by node id for fast lookup during the
  // spring pass.
  const edgesByNode = new Map<string, ForceLayoutEdge[]>();
  for (const edge of edges) {
    if (!edgesByNode.has(edge.source)) edgesByNode.set(edge.source, []);
    if (!edgesByNode.has(edge.target)) edgesByNode.set(edge.target, []);
    edgesByNode.get(edge.source)!.push(edge);
    edgesByNode.get(edge.target)!.push(edge);
  }

  const weights = new Map<string, number>();
  for (const node of nodes) weights.set(node.id, node.weight ?? 1);

  // Simulation loop.
  for (let iter = 0; iter < opts.iterations; iter++) {
    const forces = new Map<string, Vec2>();
    for (const node of nodes) forces.set(node.id, { x: 0, y: 0 });

    // Pass 1 — pairwise repulsion (O(n²); acceptable for n ≤ 100).
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]!;
      const pa = positions.get(a.id)!;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]!;
        const pb = positions.get(b.id)!;
        const dx = pa.x - pb.x;
        const dy = pa.y - pb.y;
        const distSq = Math.max(dx * dx + dy * dy, 4); // floor to avoid blowup
        const dist = Math.sqrt(distSq);
        const force = opts.repulsion / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        forces.get(a.id)!.x += fx;
        forces.get(a.id)!.y += fy;
        forces.get(b.id)!.x -= fx;
        forces.get(b.id)!.y -= fy;
      }
    }

    // Pass 2 — spring attraction along edges.
    for (const edge of edges) {
      const pa = positions.get(edge.source);
      const pb = positions.get(edge.target);
      if (!pa || !pb) continue;
      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ideal = edge.length ?? opts.edgeLength;
      const displacement = dist - ideal;
      const force = displacement * opts.springStrength;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      forces.get(edge.source)!.x += fx;
      forces.get(edge.source)!.y += fy;
      forces.get(edge.target)!.x -= fx;
      forces.get(edge.target)!.y -= fy;
    }

    // Pass 3 — centring tug toward the canvas centre.
    for (const node of nodes) {
      const p = positions.get(node.id)!;
      const f = forces.get(node.id)!;
      f.x += (cx - p.x) * opts.centringStrength;
      f.y += (cy - p.y) * opts.centringStrength;
    }

    // Apply forces (with weight-based damping).
    for (const node of nodes) {
      const p = positions.get(node.id)!;
      const f = forces.get(node.id)!;
      const w = weights.get(node.id) ?? 1;
      // Cool the simulation slightly with each iteration so
      // late-iteration motion is small.
      const cooling = 1 - iter / (opts.iterations * 2);
      p.x += (f.x / w) * cooling;
      p.y += (f.y / w) * cooling;
      // Clamp inside the canvas with a margin so labels
      // don't run off the edge.
      const margin = 40;
      p.x = Math.max(margin, Math.min(opts.width - margin, p.x));
      p.y = Math.max(margin, Math.min(opts.height - margin, p.y));
    }
  }

  return positions;
}

/** Compute the bounding box of the laid-out nodes. Useful
 *  for the SVG viewport sizing. */
export function boundsOf(positions: ReadonlyMap<string, Vec2>): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of positions.values()) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}
