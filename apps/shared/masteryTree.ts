/* ═══════════════════════════════════════════════════════
   MASTERY TREE — Passive Skill Tree for Character Sheet

   Three branches — Combat, Survival, Utility — each
   with 5 unlockable nodes. Mastery points are earned
   from leveling. Nodes grant percentage-based bonuses
   that stack across the tree.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type BranchId = "combat" | "survival" | "utility";

export interface MasteryNode {
  id: string;
  branch: BranchId;
  tier: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  stat: string;
  bonusPercent: number;
  pointCost: number;
  prerequisiteNodeId: string | null;
  iconKey: string;
}

export interface MasteryBranch {
  id: BranchId;
  name: string;
  description: string;
  nodes: MasteryNode[];
  color: string; // hex for UI
}

export interface MasteryState {
  unlockedNodeIds: Set<string>;
  totalPointsSpent: number;
  availablePoints: number;
}

export interface MasteryBonusSummary {
  [stat: string]: number; // cumulative percent bonus per stat
}

/* ─── DATA ─── */

const COMBAT_NODES: MasteryNode[] = [
  { id: "c1", branch: "combat", tier: 1, name: "Sharpened Edge", description: "+5% base damage", stat: "damage", bonusPercent: 5, pointCost: 1, prerequisiteNodeId: null, iconKey: "sword" },
  { id: "c2", branch: "combat", tier: 2, name: "Keen Eye", description: "+3% critical hit chance", stat: "crit_chance", bonusPercent: 3, pointCost: 2, prerequisiteNodeId: "c1", iconKey: "eye" },
  { id: "c3", branch: "combat", tier: 3, name: "Boss Slayer", description: "+10% damage vs bosses", stat: "boss_damage", bonusPercent: 10, pointCost: 3, prerequisiteNodeId: "c2", iconKey: "skull" },
  { id: "c4", branch: "combat", tier: 4, name: "Relentless Strikes", description: "+7% attack speed", stat: "attack_speed", bonusPercent: 7, pointCost: 4, prerequisiteNodeId: "c3", iconKey: "lightning" },
  { id: "c5", branch: "combat", tier: 5, name: "Lethal Precision", description: "+15% critical damage", stat: "crit_damage", bonusPercent: 15, pointCost: 5, prerequisiteNodeId: "c4", iconKey: "crosshair" },
];

const SURVIVAL_NODES: MasteryNode[] = [
  { id: "s1", branch: "survival", tier: 1, name: "Fortified Body", description: "+10% max HP", stat: "max_hp", bonusPercent: 10, pointCost: 1, prerequisiteNodeId: null, iconKey: "heart" },
  { id: "s2", branch: "survival", tier: 2, name: "Regeneration", description: "+5% healing received", stat: "healing", bonusPercent: 5, pointCost: 2, prerequisiteNodeId: "s1", iconKey: "plus" },
  { id: "s3", branch: "survival", tier: 3, name: "Iron Skin", description: "+15% armor rating", stat: "armor", bonusPercent: 15, pointCost: 3, prerequisiteNodeId: "s2", iconKey: "shield" },
  { id: "s4", branch: "survival", tier: 4, name: "Last Stand", description: "+20% damage when below 25% HP", stat: "low_hp_damage", bonusPercent: 20, pointCost: 4, prerequisiteNodeId: "s3", iconKey: "flame" },
  { id: "s5", branch: "survival", tier: 5, name: "Undying Will", description: "+10% revive speed", stat: "revive_speed", bonusPercent: 10, pointCost: 5, prerequisiteNodeId: "s4", iconKey: "phoenix" },
];

const UTILITY_NODES: MasteryNode[] = [
  { id: "u1", branch: "utility", tier: 1, name: "Quick Study", description: "+10% XP gain", stat: "xp_gain", bonusPercent: 10, pointCost: 1, prerequisiteNodeId: null, iconKey: "book" },
  { id: "u2", branch: "utility", tier: 2, name: "Resourceful", description: "+5% resource gain", stat: "resource_gain", bonusPercent: 5, pointCost: 2, prerequisiteNodeId: "u1", iconKey: "gem" },
  { id: "u3", branch: "utility", tier: 3, name: "Silver Tongue", description: "+10% trust gain with NPCs", stat: "trust_gain", bonusPercent: 10, pointCost: 3, prerequisiteNodeId: "u2", iconKey: "chat" },
  { id: "u4", branch: "utility", tier: 4, name: "Treasure Hunter", description: "+8% rare drop rate", stat: "drop_rate", bonusPercent: 8, pointCost: 4, prerequisiteNodeId: "u3", iconKey: "chest" },
  { id: "u5", branch: "utility", tier: 5, name: "Mastermind", description: "+5% all stat bonuses", stat: "all_stats", bonusPercent: 5, pointCost: 5, prerequisiteNodeId: "u4", iconKey: "brain" },
];

export const MASTERY_BRANCHES: MasteryBranch[] = [
  { id: "combat", name: "Combat", description: "Offensive power and critical strikes", nodes: COMBAT_NODES, color: "#e74c3c" },
  { id: "survival", name: "Survival", description: "Durability, healing, and resilience", nodes: SURVIVAL_NODES, color: "#2ecc71" },
  { id: "utility", name: "Utility", description: "Experience, resources, and social", nodes: UTILITY_NODES, color: "#3498db" },
];

/* ─── FUNCTIONS ─── */

function getAllNodes(): MasteryNode[] {
  return [...COMBAT_NODES, ...SURVIVAL_NODES, ...UTILITY_NODES];
}

export function canUnlockNode(nodeId: string, state: MasteryState): boolean {
  const node = getAllNodes().find((n) => n.id === nodeId);
  if (!node) return false;
  if (state.unlockedNodeIds.has(nodeId)) return false;
  if (state.availablePoints < node.pointCost) return false;
  if (node.prerequisiteNodeId && !state.unlockedNodeIds.has(node.prerequisiteNodeId)) return false;
  return true;
}

export function unlockNode(nodeId: string, state: MasteryState): MasteryState | null {
  if (!canUnlockNode(nodeId, state)) return null;
  const node = getAllNodes().find((n) => n.id === nodeId)!;
  const next: MasteryState = {
    unlockedNodeIds: new Set(state.unlockedNodeIds),
    totalPointsSpent: state.totalPointsSpent + node.pointCost,
    availablePoints: state.availablePoints - node.pointCost,
  };
  next.unlockedNodeIds.add(nodeId);
  return next;
}

export function getTotalMasteryBonuses(state: MasteryState): MasteryBonusSummary {
  const bonuses: MasteryBonusSummary = {};
  for (const node of getAllNodes()) {
    if (state.unlockedNodeIds.has(node.id)) {
      bonuses[node.stat] = (bonuses[node.stat] ?? 0) + node.bonusPercent;
    }
  }
  return bonuses;
}
