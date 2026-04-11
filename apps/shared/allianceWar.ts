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
  /** When the node was cleared (epoch ms). Null if never cleared, or reset to
   *  null when the node is re-infected by the Thought Virus rule. */
  clearedAt: number | null;
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
        clearedAt: null,
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
        node.clearedAt = Date.now();
      }
    } else {
      node.cleared = true;
      node.clearedAt = Date.now();
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

/* ─── EPOCH SEASONS ─── */

export interface AllianceWarEpochSeason {
  id: string;
  epochId: number;
  epochName: string;
  battleName: string;
  description: string;
  mapNarrative: string;
  nodeBuffModifiers?: Partial<Record<WarNodeType, { attack?: number; defense?: number; hp?: number; damage?: number }>>;
  specialRules: string[];
  color: string;
}

export const ALLIANCE_WAR_EPOCH_SEASONS: AllianceWarEpochSeason[] = [
  {
    id: "epoch-1-privacy",
    epochId: 1,
    epochName: "Age of Privacy",
    battleName: "The Battle of Nexon",
    description:
      "A famous surveillance-state siege where The Watcher's panopticon towers loomed over every approach. Attackers fought blind while defenders tracked their every move.",
    mapNarrative:
      "The fortress city of Nexon bristles with watchtowers. Searchlights sweep the hex grid, and every gate node is reinforced with fortified observation posts.",
    nodeBuffModifiers: {
      gate: { defense: 0.3 },
    },
    specialRules: [
      "Fog of War — defender positions hidden until adjacent node cleared.",
    ],
    color: "#6B7280", // surveillance grey
  },
  {
    id: "epoch-2-prophecy",
    epochId: 2,
    epochName: "Age of Prophecy",
    battleName: "The Siege of the Oracle's Temple",
    description:
      "Prophets and seers defended their sanctuary against those who would silence the future. The temple's visions granted extraordinary power to those who held its shrines.",
    mapNarrative:
      "Incense smoke drifts across the hex grid as oracle flames burn atop every buff shrine. The temple's prophecy stones pulse with doubled energy.",
    nodeBuffModifiers: {
      buff: { attack: 1.0, defense: 1.0, hp: 1.0 },
    },
    specialRules: [
      "Prophecy — one random node revealed at start.",
    ],
    color: "#7C3AED", // mystic purple
  },
  {
    id: "epoch-3-insurgency",
    epochId: 3,
    epochName: "Age of Insurgency",
    battleName: "The Fall of Viridian Prime",
    description:
      "Iron Lion's legendary last stand during the open rebellion. Outnumbered insurgents fought with desperate fury, turning every loss into a rallying cry.",
    mapNarrative:
      "Smoke rises from the shattered walls of Viridian Prime. Rebel banners fly on every conquered node, and the fury of the insurgency empowers every attacker.",
    nodeBuffModifiers: {
      path: { attack: 0.1 },
      gate: { attack: 0.1 },
      buff: { attack: 0.1 },
      trap: { attack: 0.1 },
      boss: { attack: 0.1 },
    },
    specialRules: [
      "Last Stand — defenders at 25% HP deal double damage.",
    ],
    color: "#DC2626", // rebel red
  },
  {
    id: "epoch-4-revelation",
    epochId: 4,
    epochName: "Age of Revelation",
    battleName: "The Hierarchy's Gambit",
    description:
      "Demons within The Hierarchy reveal themselves at last, weaponising long-hidden secrets. Trap nodes conceal deadlier snares as the truth becomes a weapon.",
    mapNarrative:
      "Glyphs of revelation etch themselves into the hex grid. Every trap node crackles with amplified malice, and clearing a gate tears the veil from adjacent dangers.",
    nodeBuffModifiers: {
      trap: { damage: 0.5 },
    },
    specialRules: [
      "Unmasking — clearing a gate node reveals all adjacent trap nodes.",
    ],
    color: "#F59E0B", // revelation gold
  },
  {
    id: "epoch-5-fall",
    epochId: 5,
    epochName: "Fall of Reality",
    battleName: "The Final Convergence",
    description:
      "Reality fractures on the battlefield as the final battles reshape existence itself. Every combatant is supercharged — and nothing stays as it seems.",
    mapNarrative:
      "Cracks in reality spider across the hex grid, leaking raw energy. Every node hums with amplified power, and at the midpoint the map itself shifts.",
    nodeBuffModifiers: {
      path: { attack: 0.15, defense: 0.15, hp: 0.15, damage: 0.15 },
      gate: { attack: 0.15, defense: 0.15, hp: 0.15, damage: 0.15 },
      buff: { attack: 0.15, defense: 0.15, hp: 0.15, damage: 0.15 },
      trap: { attack: 0.15, defense: 0.15, hp: 0.15, damage: 0.15 },
      boss: { attack: 0.15, defense: 0.15, hp: 0.15, damage: 0.15 },
    },
    specialRules: [
      "Reality Fracture — node types randomly swap at the midpoint of the attack phase.",
    ],
    color: "#0EA5E9", // fracture blue
  },
];

/* ─── ALLIANCE WAR EPOCHS (Extended Epoch Theming) ─── */

/**
 * Epoch-themed Alliance War seasons. Each war season is themed to a
 * historical epoch from the Dischordian timeline (17,033 years).
 * Map names reference famous battles from that epoch. This is the
 * user-facing summary array — the detailed season data above drives
 * the actual game mechanics.
 */

export interface AllianceWarEpoch {
  seasonId: string;
  epochName: string;
  mapName: string;
  historicalBattle: string;
  specialRules: string[];
  description: string;
}

export const ALLIANCE_WAR_EPOCHS: AllianceWarEpoch[] = [
  {
    seasonId: "aw-epoch-1",
    epochName: "Insurgency Rising",
    mapName: "Viridian Prime Warzone",
    historicalBattle: "Battle of Nexon",
    specialRules: [
      "Fog of War — defender positions hidden until adjacent node cleared.",
      "Last Stand — defenders at 25% HP deal double damage.",
      "Guerrilla Tactics — attackers gain +10% attack on all nodes.",
    ],
    description: "The Battle of Nexon was the first open engagement of the Insurgency. Iron Lion's rebels struck the Hierarchy's surveillance fortress at dawn, exploiting blind spots in the Panopticon's coverage grid. Outnumbered ten to one, the rebels fought with desperate ingenuity — turning the Hierarchy's own infrastructure against it. This season recreates that chaos: fog of war hides defenders, and cornered units fight with the fury of those who have nothing left to lose.",
  },
  {
    seasonId: "aw-epoch-2",
    epochName: "Fall Era",
    mapName: "New Babylon Siege Grid",
    historicalBattle: "Siege of New Babylon",
    specialRules: [
      "Reality Fracture — node types randomly swap at the midpoint of the attack phase.",
      "Thought Virus — cleared nodes have a 15% chance to re-infect after 6 hours.",
      "Entropic Decay — all defender stats decrease by 5% per hour.",
    ],
    description: "New Babylon was the Hierarchy's crown jewel — the capital of the known galaxy, a city built on secrets and sustained by control. When the Fall came, the Thought Virus turned New Babylon's own population into weapons. The siege lasted seventeen days. By the end, the attackers couldn't tell friend from enemy, and the city's defenses had turned against its own citizens. This season captures that horror: nothing stays where you put it, and what you conquer can turn against you.",
  },
  {
    seasonId: "aw-epoch-3",
    epochName: "Golden Age",
    mapName: "Academy Proving Grounds",
    historicalBattle: "The Academy Schism",
    specialRules: [
      "Prophecy — one random node revealed at start.",
      "Scholar's Edge — buff nodes grant double bonuses.",
      "Wisdom of Ages — XP from war battles increased by 25%.",
    ],
    description: "During the Golden Age, the Academies trained the finest minds in the galaxy. But when the Insurgency began to recruit from within, the Academies split — half loyal to the Hierarchy, half sympathetic to the rebellion. The Schism turned lecture halls into battlegrounds and mentors against students. This season recreates the intellectual warfare: knowledge is power, and buff nodes are worth fighting for.",
  },
  {
    seasonId: "aw-epoch-4",
    epochName: "Genesis",
    mapName: "Foundation Citadel",
    historicalBattle: "The Founding War",
    specialRules: [
      "Primal Rules — only tier 1 and tier 2 units may be placed as defenders.",
      "Creation Forge — trap nodes convert to buff nodes when cleared.",
      "First Principles — no debuffs can be applied to any unit.",
    ],
    description: "Before the empires, before the Arks, the first civilizations fought over the foundational principles that would shape all of history. The Founding War was not fought with advanced weapons — it was fought with conviction and raw strength. This season strips away complexity: only basic units, no debuffs, and every obstacle contains hidden potential.",
  },
  {
    seasonId: "aw-epoch-5",
    epochName: "Age of Potentials",
    mapName: "Ark 1047 Warfront",
    historicalBattle: "The Convergence",
    specialRules: [
      "All Stats Amplified — every unit gains +15% to all stats.",
      "Adaptive Grid — map layout shifts every 8 hours.",
      "Legacy Bonus — players who completed previous seasons gain +5% offense.",
    ],
    description: "The Convergence is happening now. Every epoch, every war, every betrayal — they all led here. Ark 1047 is the fulcrum point, and the Alliance War fought across its hull will determine whether the Potentials inherit a future worth having. This season is the culmination: everything is amplified, the battlefield itself evolves, and the legacies of previous seasons carry forward. The final war is always the loudest.",
  },
];

/**
 * Returns the active epoch season for the current week.
 * Seasons rotate weekly, cycling through all five epochs in order.
 * Uses a fixed epoch (2024-01-01) so the rotation is deterministic.
 */
export function getActiveWarSeason(now: Date = new Date()): AllianceWarEpochSeason {
  const epochStart = new Date("2024-01-01T00:00:00Z").getTime();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weekIndex = Math.floor((now.getTime() - epochStart) / msPerWeek);
  const seasonIndex = ((weekIndex % ALLIANCE_WAR_EPOCH_SEASONS.length) + ALLIANCE_WAR_EPOCH_SEASONS.length) % ALLIANCE_WAR_EPOCH_SEASONS.length;
  return ALLIANCE_WAR_EPOCH_SEASONS[seasonIndex];
}

/* ─── THOUGHT VIRUS RE-INFECTION ─── */

/**
 * The Fall Era ("New Babylon Siege Grid") has the Thought Virus special rule:
 * "cleared nodes have a 15% chance to re-infect after 6 hours." The rule lives
 * as a human-readable string in the epoch's specialRules, but there was never
 * a handler that actually applied it. This function is that handler.
 *
 * Intended usage: the alliance-war tick job (runs once per hour server-side)
 * passes in the current map state + timestamps and gets back a map where some
 * previously-cleared nodes have been marked uncleared again.
 *
 * Pure — no DB access, no globals. Inject a rng in tests to get deterministic
 * re-infection.
 */
export interface NodeClearRecord {
  nodeId: string;
  clearedAt: number; // epoch ms
}

export const THOUGHT_VIRUS_REINFECT_WINDOW_MS = 6 * 60 * 60 * 1000;
export const THOUGHT_VIRUS_REINFECT_CHANCE = 0.15;

export interface ReinfectResult {
  reinfectedNodeIds: string[];
  nextMap: WarMap;
}

/**
 * Anything that carries a specialRules list can drive the reinfection rule.
 * The repo has two epoch types (AllianceWarEpochSeason and AllianceWarEpoch);
 * both satisfy this shape, so this keeps the handler decoupled from which
 * one the caller happens to hold.
 */
export interface HasSpecialRules {
  specialRules: readonly string[];
}

/**
 * Walk a war map, find every node that has been cleared for longer than
 * THOUGHT_VIRUS_REINFECT_WINDOW_MS, roll against THOUGHT_VIRUS_REINFECT_CHANCE,
 * and mark the node uncleared. Returns a new map (pure function) and the list
 * of node IDs that were re-infected so the caller can broadcast a war event.
 *
 * Only runs if the given epoch's specialRules include the Thought Virus rule
 * — other epochs skip this entirely.
 *
 * Clear timestamps are read from `WarNode.clearedAt` by default. Callers that
 * maintain a side-channel clear log (legacy war state) can pass a
 * `NodeClearRecord[]` that overrides the per-node timestamp; entries in that
 * log take precedence over anything on the node itself.
 */
export function applyThoughtVirusReinfection(
  map: WarMap,
  clearLog: NodeClearRecord[] | undefined,
  epoch: HasSpecialRules | undefined,
  now: number = Date.now(),
  rng: () => number = Math.random,
): ReinfectResult {
  if (!epoch) return { reinfectedNodeIds: [], nextMap: map };
  const hasRule = epoch.specialRules.some(rule =>
    rule.toLowerCase().includes("thought virus"),
  );
  if (!hasRule) return { reinfectedNodeIds: [], nextMap: map };

  const clearedAtLookup = new Map(
    (clearLog ?? []).map(entry => [entry.nodeId, entry.clearedAt]),
  );
  const reinfected: string[] = [];

  const nextNodes = map.nodes.map(node => {
    if (!node.cleared) return node;
    if (node.type === "boss") return node; // Boss never re-infects
    const clearedAt = clearedAtLookup.get(node.id) ?? node.clearedAt;
    if (clearedAt === null || clearedAt === undefined) return node;
    if (now - clearedAt < THOUGHT_VIRUS_REINFECT_WINDOW_MS) return node;
    if (rng() >= THOUGHT_VIRUS_REINFECT_CHANCE) return node;
    reinfected.push(node.id);
    return { ...node, cleared: false, clearedAt: null };
  });

  return {
    reinfectedNodeIds: reinfected,
    nextMap: { ...map, nodes: nextNodes },
  };
}
