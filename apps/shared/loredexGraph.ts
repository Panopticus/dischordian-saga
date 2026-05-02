/**
 * Loredex relationship-graph helpers (C3 from
 * /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md
 * §"Cicada / wanon community fame").
 *
 * Pure helpers that walk a {entries, relationships} loredex dataset
 * and compute focus-entity 1-hop neighborhoods + node/edge layout
 * data the client SVG renderer can consume.
 *
 * The full loredex catalog has ~233 entries and ~578 relationships;
 * rendering all of them at once is impractical without a heavy
 * layout library (cytoscape isn't a direct dep). The plan asks for
 * a graph viewer; the practical interpretation is a focus-and-
 * neighborhood viewer that wanons can crawl one entity at a time.
 *
 * Discovery state — when an entity id is in `discoveredIds`, the
 * node renders fully (name + type + faction); otherwise it's
 * fogged (id + rarity tier only). The plan canon: "locked entries
 * show only ID + rarity behind a fog."
 */

export type LoredexEntryType =
  | "character"
  | "concept"
  | "event"
  | "faction"
  | "location"
  | "song"
  | "artifact";

export interface LoredexGraphEntry {
  readonly id: string;
  readonly type: LoredexEntryType;
  readonly name: string;
  readonly priority?: string;
}

export interface LoredexGraphRelationship {
  readonly source: string;
  readonly target: string;
  readonly relationship_type: string;
}

export interface LoredexGraphNode {
  readonly id: string;
  /** True when the player has discovered this entity (visible name +
   *  type) — false when the node should render fogged. */
  readonly discovered: boolean;
  /** Type for color-coding. Always present so the renderer can pick
   *  a fog colour even for undiscovered nodes. */
  readonly type: LoredexEntryType;
  /** Display name. Empty when undiscovered (renderer falls back to
   *  the id with the entity_ prefix stripped, plus a "?" suffix). */
  readonly name: string;
  /** Polar layout coordinates, computed deterministically per
   *  neighbour count + index. The renderer uses these as
   *  starting positions; a CSS animation eases them into place. */
  readonly x: number;
  readonly y: number;
}

export interface LoredexGraphEdge {
  readonly source: string;
  readonly target: string;
  readonly relationship_type: string;
}

export interface LoredexGraphView {
  /** The focus entity. Always at the centre, always discovered (we
   *  never fog the entity the user is currently looking at). */
  readonly focus: LoredexGraphNode;
  /** 1-hop neighbours of the focus, with discovery state applied. */
  readonly neighbours: readonly LoredexGraphNode[];
  /** Edges between focus and neighbours (no neighbour-to-neighbour
   *  edges — those would clutter the 1-hop view). */
  readonly edges: readonly LoredexGraphEdge[];
}

/** Polar-layout radius for the neighbour ring (px). Empty default
 *  picked to fit comfortably inside a 600×600 SVG viewport. */
const RING_RADIUS = 220;

/** Compute the polar position of the i-th neighbour of N, anchored
 *  at angle -π/2 (top) and going clockwise. Pure helper exported
 *  for tests. */
export function neighbourPosition(
  index: number,
  total: number,
): { x: number; y: number } {
  if (total <= 0) return { x: 0, y: 0 };
  const startAngle = -Math.PI / 2;
  const angleStep = (Math.PI * 2) / total;
  const angle = startAngle + index * angleStep;
  return {
    x: Math.round(Math.cos(angle) * RING_RADIUS),
    y: Math.round(Math.sin(angle) * RING_RADIUS),
  };
}

/**
 * Resolve a relationship's `source` / `target` (which may be an id
 * or a name in the loredex JSON) to a canonical entry id. Returns
 * undefined when neither id nor name resolves.
 */
function resolveRefToId(
  ref: string,
  entries: readonly LoredexGraphEntry[],
  byName: Map<string, string>,
): string | undefined {
  if (entries.some((e) => e.id === ref)) return ref;
  return byName.get(ref);
}

/**
 * Compute the focus-entity 1-hop neighbourhood graph. Returns null
 * when the focus id isn't in the dataset.
 *
 * Pure — no I/O. Server / client both call this with the same
 * `loredex-data.json` payload.
 */
export function focusNeighbourhood(
  focusId: string,
  entries: readonly LoredexGraphEntry[],
  relationships: readonly LoredexGraphRelationship[],
  discoveredIds: ReadonlySet<string>,
): LoredexGraphView | null {
  const focusEntry = entries.find((e) => e.id === focusId);
  if (!focusEntry) return null;

  const byId = new Map(entries.map((e) => [e.id, e]));
  const byName = new Map(entries.map((e) => [e.name, e.id]));

  // Collect 1-hop neighbour ids by walking relationships in either
  // direction. Resolve refs (id or name) to canonical ids.
  const neighbourIds = new Set<string>();
  const edges: LoredexGraphEdge[] = [];
  for (const rel of relationships) {
    const sourceId = resolveRefToId(rel.source, entries, byName);
    const targetId = resolveRefToId(rel.target, entries, byName);
    if (!sourceId || !targetId) continue;
    if (sourceId === focusId && targetId !== focusId) {
      neighbourIds.add(targetId);
      edges.push({
        source: focusId,
        target: targetId,
        relationship_type: rel.relationship_type,
      });
    } else if (targetId === focusId && sourceId !== focusId) {
      neighbourIds.add(sourceId);
      edges.push({
        source: sourceId,
        target: focusId,
        relationship_type: rel.relationship_type,
      });
    }
  }

  const sortedNeighbours = [...neighbourIds].sort();
  const neighbours: LoredexGraphNode[] = sortedNeighbours.map((id, i) => {
    const entry = byId.get(id);
    if (!entry) {
      // Defensive — shouldn't happen because we only add ids that
      // exist in the byId map. Render as a defensive fogged node.
      const pos = neighbourPosition(i, sortedNeighbours.length);
      return {
        id,
        discovered: false,
        type: "concept" as const,
        name: "",
        x: pos.x,
        y: pos.y,
      };
    }
    const discovered = discoveredIds.has(id);
    const pos = neighbourPosition(i, sortedNeighbours.length);
    return {
      id,
      discovered,
      type: entry.type,
      name: discovered ? entry.name : "",
      x: pos.x,
      y: pos.y,
    };
  });

  return {
    focus: {
      id: focusEntry.id,
      // Focus is always shown unfogged — the user is looking AT this
      // entity by definition.
      discovered: true,
      type: focusEntry.type,
      name: focusEntry.name,
      x: 0,
      y: 0,
    },
    neighbours,
    edges,
  };
}
