/* ═══════════════════════════════════════════════════════
   CONVEYOR SYSTEM — Mindustry-style resource automation

   Resource nodes appear on the map and produce resources
   over time. Conveyor belts transport resources from nodes
   to turrets (for auto-ammo) or to the core (for storage).

   This creates a "factory" layer on top of tower defense:
   - Place resource extractors on nodes
   - Build conveyor belts to connect them
   - Route resources to turrets for damage boosts
   - Or route to core for wave-end bonus multiplier
   ═══════════════════════════════════════════════════════ */
import type { Vec2, ConveyorDirection, GameResources } from "./types";

/* ─── RESOURCE NODES ─── */

export type NodeType = "salvage_deposit" | "ichor_pool" | "crystal_vein" | "void_rift";

export interface ResourceNodeDef {
  type: NodeType;
  name: string;
  description: string;
  resourceType: keyof GameResources;
  baseYield: number; // per collection cycle (every 5 waves)
  color: string;
  extractorCost: { salvage: number; viralIchor?: number };
}

export const RESOURCE_NODES: Record<string, ResourceNodeDef> = {
  salvage_deposit: {
    type: "salvage_deposit",
    name: "Salvage Deposit",
    description: "Wreckage from the crash. Rich in recoverable metal.",
    resourceType: "salvage",
    baseYield: 50,
    color: "#cd7f32",
    extractorCost: { salvage: 30 },
  },
  ichor_pool: {
    type: "ichor_pool",
    name: "Viral Ichor Pool",
    description: "Pooled secretions from the Swarm. Toxic but valuable.",
    resourceType: "viralIchor",
    baseYield: 15,
    color: "#66aa22",
    extractorCost: { salvage: 60, viralIchor: 5 },
  },
  crystal_vein: {
    type: "crystal_vein",
    name: "Neural Crystal Vein",
    description: "Crystallized neural energy from deep within Terminus.",
    resourceType: "neuralCores",
    baseYield: 3,
    color: "#aa44dd",
    extractorCost: { salvage: 100, viralIchor: 20 },
  },
  void_rift: {
    type: "void_rift",
    name: "Void Rift",
    description: "A tear in reality. Emits trace amounts of void energy.",
    resourceType: "voidCrystals",
    baseYield: 1,
    color: "#0088aa",
    extractorCost: { salvage: 200, viralIchor: 50 },
  },
};

/* ─── CONVEYOR BELTS ─── */

export interface ConveyorSegment {
  id: string;
  row: number;
  col: number;
  direction: ConveyorDirection;
  carrying: keyof GameResources | null;
  speed: number; // tiles per second
}

export interface Extractor {
  id: string;
  row: number;
  col: number;
  nodeType: NodeType;
  level: number;
  outputDirection: ConveyorDirection;
  /** Accumulated resources waiting to be sent on conveyor */
  buffer: number;
}

export interface ConveyorState {
  extractors: Map<string, Extractor>;
  conveyors: Map<string, ConveyorSegment>;
  /** Resource nodes on the map (fixed positions per map) */
  nodes: Array<{ row: number; col: number; type: NodeType }>;
}

export const CONVEYOR_COST = { salvage: 10 };
export const EXTRACTOR_UPGRADE_COST = [
  { salvage: 0 },                    // Level 1 (built-in)
  { salvage: 50, viralIchor: 5 },    // Level 2: +50% yield
  { salvage: 150, viralIchor: 20 },  // Level 3: +100% yield
  { salvage: 400, viralIchor: 50 },  // Level 4: +200% yield
];

/** Calculate extractor yield based on level */
export function getExtractorYield(nodeType: NodeType, level: number): number {
  const base = RESOURCE_NODES[nodeType].baseYield;
  const mult = level === 1 ? 1 : level === 2 ? 1.5 : level === 3 ? 2 : 3;
  return Math.floor(base * mult);
}

/** Create initial conveyor state for a map */
export function createConveyorState(
  nodes: Array<{ row: number; col: number; type: NodeType }>
): ConveyorState {
  return {
    extractors: new Map(),
    conveyors: new Map(),
    nodes,
  };
}

/** Collect resources from all extractors (called between waves) */
export function collectResources(state: ConveyorState): GameResources {
  const collected: GameResources = { salvage: 0, viralIchor: 0, neuralCores: 0, voidCrystals: 0 };

  for (const [, extractor] of state.extractors) {
    const nodeDef = RESOURCE_NODES[extractor.nodeType];
    if (!nodeDef) continue;
    const yield_ = getExtractorYield(extractor.nodeType, extractor.level);
    collected[nodeDef.resourceType] += yield_;
  }

  return collected;
}

/**
 * Trace a conveyor chain from an extractor to see where resources end up.
 * Returns "core" if it reaches the core, "turret" if it reaches a turret tile,
 * or "none" if the chain is broken.
 */
export function traceConveyorChain(
  state: ConveyorState,
  startRow: number,
  startCol: number,
  startDir: ConveyorDirection,
  gridWidth: number,
  gridHeight: number,
  corePos: Vec2,
  turretPositions: Set<string>,
): "core" | "turret" | "none" {
  let row = startRow;
  let col = startCol;
  let dir = startDir;
  const visited = new Set<string>();

  for (let i = 0; i < 50; i++) { // max 50 steps to prevent infinite loops
    // Move in direction
    switch (dir) {
      case "up": row--; break;
      case "down": row++; break;
      case "left": col--; break;
      case "right": col++; break;
    }

    if (row < 0 || row >= gridHeight || col < 0 || col >= gridWidth) return "none";

    const key = `${row},${col}`;
    if (visited.has(key)) return "none"; // Loop detected
    visited.add(key);

    // Check if reached core
    if (col === corePos.x && row === corePos.y) return "core";

    // Check if reached a turret
    if (turretPositions.has(key)) return "turret";

    // Check for conveyor at this position
    const conveyor = state.conveyors.get(key);
    if (!conveyor) return "none"; // Chain broken

    dir = conveyor.direction; // Follow conveyor's direction
  }

  return "none";
}

/** Map node positions for the default maps */
export const MAP_RESOURCE_NODES: Record<string, Array<{ row: number; col: number; type: NodeType }>> = {
  "Ark #25 — Landing Bay": [
    { row: 1, col: 5, type: "salvage_deposit" },
    { row: 4, col: 3, type: "salvage_deposit" },
    { row: 8, col: 6, type: "ichor_pool" },
    { row: 3, col: 9, type: "crystal_vein" },
    { row: 6, col: 13, type: "void_rift" },
  ],
  "Ark #25 — Corridor B": [
    { row: 2, col: 6, type: "salvage_deposit" },
    { row: 5, col: 10, type: "ichor_pool" },
    { row: 3, col: 14, type: "salvage_deposit" },
    { row: 6, col: 17, type: "crystal_vein" },
  ],
};
