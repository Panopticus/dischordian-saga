/* ═══════════════════════════════════════════════════════
   ALLIANCE WAR — MCOC-style Guild vs Guild Hex Grid War

   Two guilds place Dischordia card decks as defenders on
   a 19-node honeycomb hex grid, then attack each other's
   map. Attackers must beat defenders to progress toward
   the boss node. 24h placement phase, 24h attack phase.
   ═══════════════════════════════════════════════════════ */

/* ─── CONSTANTS ─── */

export const WAR_PHASE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const NODE_POINTS: Record<WarNodeType, number> = {
  path: 100,
  gate: 200,
  buff: 150,
  trap: 150,
  boss: 500,
};

export const GATE_STAT_BONUS = 0.2;       // +20% defender stats on gate nodes
export const BUFF_ATTACK_BONUS = 0.1;     // +10% attacker stats from cleared buff nodes
export const BOSS_WINS_REQUIRED = 3;      // stacked defenders on boss node
export const FULL_CLEAR_BONUS = 1000;     // points for clearing every node
export const MAX_ATTACKS_PER_MEMBER = 3;

export const DEFENDERS_PER_TIER: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 3,
  5: 3,
};

/* ─── TYPES ─── */

export type WarNodeType = "path" | "gate" | "buff" | "trap" | "boss";

export type WarPhase = "matchmaking" | "placement" | "attack" | "scoring" | "complete";

export interface HexPosition {
  row: number;
  col: number;
}

export interface WarNode {
  id: string;
  type: WarNodeType;
  position: HexPosition;
  connections: string[];           // adjacent node IDs
  defenderId: string | null;       // user ID who placed a defender
  defenderDeckId: string | null;   // deck placed on this node
  defenderStats: { attack: number; defense: number; hp: number } | null;
  buffs: string[];                 // active buff keywords
  debuffs: string[];               // active debuff keywords
  cleared: boolean;
  bossHitsRemaining: number;       // only relevant for boss nodes
}

export interface WarMap {
  nodes: WarNode[];
  bossNodeId: string;
  entryNodeIds: string[];          // starting nodes attackers can reach
}

export interface DefenderPlacement {
  nodeId: string;
  userId: string;
  deckId: string;
  stats: { attack: number; defense: number; hp: number };
  placedAt: number;
}

export interface AttackResult {
  nodeId: string;
  attackerId: string;
  attackerDeckId: string;
  won: boolean;
  damageDealt: number;
  damageTaken: number;
  buffGained: string | null;       // buff keyword if cleared a buff node
  trapPenalty: string | null;       // penalty keyword if it was a trap node
  timestamp: number;
}

export interface WarScore {
  guildId: string;
  nodesCleared: number;
  nodesDefended: number;           // opponent failed to clear
  offensePoints: number;
  defensePoints: number;
  fullClearBonus: number;
  totalPoints: number;
}

export interface AllianceWar {
  warId: string;
  guild1Id: string;
  guild2Id: string;
  guild1Map: WarMap;
  guild2Map: WarMap;
  phase: WarPhase;
  phaseStartedAt: number;
  attacksUsed: Record<string, number>;  // userId -> attacks spent
  buffStacks: Record<string, number>;   // userId -> accumulated buff %
  attackLog: AttackResult[];
  guild1Score: WarScore | null;
  guild2Score: WarScore | null;
  winnerId: string | null;
  mvpUserId: string | null;
}

/* ─── MAP GENERATION ─── */

/**
 * Generates a 19-node honeycomb hex grid.
 * Layout (rows): 5 - 4 - 5 - 4 - 1(boss)
 * Five paths converge on the single boss node at row 4.
 */
export function generateWarMap(): WarMap {
  const nodes: WarNode[] = [];
  const layout: { row: number; count: number }[] = [
    { row: 0, count: 5 },
    { row: 1, count: 4 },
    { row: 2, count: 5 },
    { row: 3, count: 4 },
    { row: 4, count: 1 },
  ];

  const nodeTypePattern: WarNodeType[][] = [
    ["path", "buff", "path", "trap", "path"],
    ["gate", "path", "path", "gate"],
    ["path", "trap", "buff", "trap", "path"],
    ["gate", "path", "path", "gate"],
    ["boss"],
  ];

  // Create nodes
  for (const { row, count } of layout) {
    for (let col = 0; col < count; col++) {
      const id = `node-${row}-${col}`;
      nodes.push({
        id,
        type: nodeTypePattern[row][col],
        position: { row, col },
        connections: [],
        defenderId: null,
        defenderDeckId: null,
        defenderStats: null,
        buffs: [],
        debuffs: [],
        cleared: false,
        bossHitsRemaining: nodeTypePattern[row][col] === "boss" ? BOSS_WINS_REQUIRED : 0,
      });
    }
  }

  // Wire hex adjacency: each node connects to neighbors in the row above/below
  // Odd-width rows (5) and even-width rows (4) offset differently in a honeycomb.
  const rowCounts = layout.map((l) => l.count);

  for (const node of nodes) {
    const { row, col } = node.position;
    const curCount = rowCounts[row];

    // Same-row neighbors
    if (col > 0) node.connections.push(`node-${row}-${col - 1}`);
    if (col < curCount - 1) node.connections.push(`node-${row}-${col + 1}`);

    // Adjacent rows (above and below)
    for (const adjRow of [row - 1, row + 1]) {
      if (adjRow < 0 || adjRow >= rowCounts.length) continue;
      const adjCount = rowCounts[adjRow];

      // Honeycomb offset: wider row to narrower row shares overlapping indices
      if (curCount > adjCount) {
        // Current row is wider — connect to col-1 and col in narrower row
        for (const adjCol of [col - 1, col]) {
          if (adjCol >= 0 && adjCol < adjCount) {
            node.connections.push(`node-${adjRow}-${adjCol}`);
          }
        }
      } else if (curCount < adjCount) {
        // Current row is narrower — connect to col and col+1 in wider row
        for (const adjCol of [col, col + 1]) {
          if (adjCol >= 0 && adjCol < adjCount) {
            node.connections.push(`node-${adjRow}-${adjCol}`);
          }
        }
      } else {
        // Same width — direct neighbor mapping (boss row handled naturally)
        if (col >= 0 && col < adjCount) {
          node.connections.push(`node-${adjRow}-${col}`);
        }
      }
    }
  }

  const bossNodeId = "node-4-0";
  const entryNodeIds = nodes
    .filter((n) => n.position.row === 0)
    .map((n) => n.id);

  return { nodes, bossNodeId, entryNodeIds };
}

/* ─── DEFENDER PLACEMENT ─── */

export function placeDefender(
  map: WarMap,
  placement: DefenderPlacement,
  guildTier: number,
  existingPlacements: DefenderPlacement[],
): { success: boolean; error?: string } {
  const node = map.nodes.find((n) => n.id === placement.nodeId);
  if (!node) return { success: false, error: "Node not found." };
  if (node.defenderId) return { success: false, error: "Node already has a defender." };

  const maxDefs = DEFENDERS_PER_TIER[guildTier] ?? 1;
  const userCount = existingPlacements.filter((p) => p.userId === placement.userId).length;
  if (userCount >= maxDefs) {
    return { success: false, error: `You can only place ${maxDefs} defender(s) at tier ${guildTier}.` };
  }

  // Apply gate bonus
  const stats = { ...placement.stats };
  if (node.type === "gate") {
    stats.attack = Math.round(stats.attack * (1 + GATE_STAT_BONUS));
    stats.defense = Math.round(stats.defense * (1 + GATE_STAT_BONUS));
    stats.hp = Math.round(stats.hp * (1 + GATE_STAT_BONUS));
  }

  node.defenderId = placement.userId;
  node.defenderDeckId = placement.deckId;
  node.defenderStats = stats;

  return { success: true };
}

/* ─── ATTACK LOGIC ─── */

/**
 * Returns node IDs the given user can currently attack.
 * A node is attackable if:
 *  - it has a defender and is not yet cleared
 *  - it is an entry node OR at least one connected node is already cleared
 */
export function getAvailableAttacks(map: WarMap, userId: string, attacksUsed: number): string[] {
  if (attacksUsed >= MAX_ATTACKS_PER_MEMBER) return [];

  return map.nodes
    .filter((node) => {
      if (node.cleared || !node.defenderId) return false;
      // Entry nodes are always reachable
      if (map.entryNodeIds.includes(node.id)) return true;
      // Otherwise need an adjacent cleared node
      return node.connections.some((connId) => {
        const conn = map.nodes.find((n) => n.id === connId);
        return conn?.cleared === true;
      });
    })
    .map((n) => n.id);
}

/**
 * Resolves an attack on a node. Uses simplified stat comparison with
 * randomness factor. Returns the full AttackResult.
 */
export function attackNode(
  map: WarMap,
  nodeId: string,
  attackerStats: { attack: number; defense: number; hp: number },
  attackerId: string,
  attackerDeckId: string,
  buffPercent: number,
): AttackResult {
  const node = map.nodes.find((n) => n.id === nodeId);
  if (!node || !node.defenderStats) {
    throw new Error(`Invalid attack target: ${nodeId}`);
  }

  // Apply accumulated buff bonuses to attacker
  const atkBoost = 1 + buffPercent;
  const boostedAtk = Math.round(attackerStats.attack * atkBoost);
  const boostedDef = Math.round(attackerStats.defense * atkBoost);
  const boostedHp = Math.round(attackerStats.hp * atkBoost);

  const def = node.defenderStats;

  // Simplified combat: trade blows based on attack vs defense
  const damageToDefender = Math.max(1, boostedAtk - Math.floor(def.defense * 0.5));
  const damageToAttacker = Math.max(1, def.attack - Math.floor(boostedDef * 0.5));

  const hitsToKillDefender = Math.ceil(def.hp / damageToDefender);
  const hitsToKillAttacker = Math.ceil(boostedHp / damageToAttacker);

  const won = hitsToKillAttacker > hitsToKillDefender;

  const damageDealt = won ? def.hp : hitsToKillAttacker * damageToDefender;
  const damageTaken = won ? hitsToKillDefender * damageToAttacker : boostedHp;

  let buffGained: string | null = null;
  let trapPenalty: string | null = null;

  if (won) {
    if (node.type === "boss") {
      node.bossHitsRemaining -= 1;
      if (node.bossHitsRemaining <= 0) {
        node.cleared = true;
      }
    } else {
      node.cleared = true;
    }

    if (node.type === "buff") {
      buffGained = "war_buff_10";
    }
  }

  // Trap nodes penalise the attacker win or lose
  if (node.type === "trap") {
    trapPenalty = "war_trap_debuff";
  }

  return {
    nodeId,
    attackerId,
    attackerDeckId,
    won,
    damageDealt,
    damageTaken,
    buffGained,
    trapPenalty,
    timestamp: Date.now(),
  };
}

/* ─── SCORING ─── */

export function calculateWarScore(
  ownMap: WarMap,
  opponentMap: WarMap,
  guildId: string,
): WarScore {
  // Offense: points for nodes cleared on the opponent's map
  let offensePoints = 0;
  let nodesCleared = 0;
  for (const node of opponentMap.nodes) {
    if (node.cleared) {
      offensePoints += NODE_POINTS[node.type];
      nodesCleared++;
    }
  }

  const allOpponentCleared = opponentMap.nodes.every((n) => n.cleared);
  const fullClearBonus = allOpponentCleared ? FULL_CLEAR_BONUS : 0;

  // Defense: points for own nodes that were NOT cleared
  let defensePoints = 0;
  let nodesDefended = 0;
  for (const node of ownMap.nodes) {
    if (node.defenderId && !node.cleared) {
      defensePoints += Math.floor(NODE_POINTS[node.type] * 0.5);
      nodesDefended++;
    }
  }

  return {
    guildId,
    nodesCleared,
    nodesDefended,
    offensePoints,
    defensePoints,
    fullClearBonus,
    totalPoints: offensePoints + defensePoints + fullClearBonus,
  };
}

/* ─── REWARDS ─── */

export interface WarRewards {
  dreamTokens: number;
  guildXp: number;
  cosmeticId: string | null;
  isMvp: boolean;
  mvpBonusDream: number;
}

export function computeWarRewards(
  won: boolean,
  isMvp: boolean,
): WarRewards {
  const base = won ? 500 : 200;
  return {
    dreamTokens: base + (isMvp ? 150 : 0),
    guildXp: won ? 1000 : 400,
    cosmeticId: won ? "war_victory_banner" : null,
    isMvp,
    mvpBonusDream: isMvp ? 150 : 0,
  };
}

/** Finds the MVP — the player who cleared the most nodes in the attack log. */
export function determineMvp(attackLog: AttackResult[]): string | null {
  const clearCounts: Record<string, number> = {};
  for (const result of attackLog) {
    if (result.won) {
      clearCounts[result.attackerId] = (clearCounts[result.attackerId] ?? 0) + 1;
    }
  }
  let mvp: string | null = null;
  let maxClears = 0;
  for (const [userId, count] of Object.entries(clearCounts)) {
    if (count > maxClears) {
      maxClears = count;
      mvp = userId;
    }
  }
  return mvp;
}
