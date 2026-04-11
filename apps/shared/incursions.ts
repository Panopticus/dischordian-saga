/**
 * CO-OP INCURSIONS — Dungeon Crawl Mode
 * ══════════════════════════════════════════════════════════
 * Two players team up to fight through 10 randomized rooms.
 * Each room cleared grants a permanent stacking buff for the run.
 * Deeper rooms = harder enemies but better rewards.
 *
 * - Players alternate who fights each room (A→B→A→B...)
 * - Both players share the accumulated buff stack
 * - Boss rooms guaranteed at rooms 5 and 10
 * - Weekly reset with 3 free runs; extra runs cost 50 Dream
 */

/* ─── CONSTANTS ─── */

export const DUNGEON_LENGTH = 10;
export const FREE_RUNS_PER_WEEK = 3;
export const EXTRA_RUN_COST_DREAM = 50;
export const BASE_DIFFICULTY = 1.0;
export const DIFFICULTY_PER_ROOM = 0.3;
export const MINI_BOSS_DIFFICULTY = 2.5;
export const FINAL_BOSS_DIFFICULTY = 5.0;
export const COSMETIC_FRAGMENTS_FOR_UNLOCK = 10;

/* ─── TYPES ─── */

export type RoomType = "combat" | "card" | "puzzle" | "boss" | "treasure";
export type PuzzleVariant = "hacking" | "cipher" | "sequence";
export type LootCategory = "dream_tokens" | "crafting_material" | "void_crystal" | "equipment" | "cosmetic_fragment";

export interface RoomBuff {
  key: string;
  label: string;
  icon: string;
  /** Stat key or special effect identifier */
  stat: string;
  /** Numeric value (percentage expressed as decimal, or flat amount) */
  value: number;
  /** Whether the buff stacks additively with copies of itself */
  stackable: boolean;
}

export interface LootTableEntry {
  category: LootCategory;
  itemKey: string;
  name: string;
  dropRate: number; // 0-1
  minRoom: number;  // earliest room this can drop
}

export interface IncursionRoomDef {
  key: string;
  name: string;
  description: string;
  icon: string;
  type: RoomType;
  puzzleVariant?: PuzzleVariant;
  /** Difficulty multiplier applied on top of depth scaling */
  difficultyMod: number;
  buff: RoomBuff;
  loot: LootTableEntry[];
}

export interface IncursionRoom {
  index: number;            // 0-9
  def: IncursionRoomDef;
  difficulty: number;       // resolved difficulty value
  assignedPlayer: "A" | "B";
  cleared: boolean;
  elapsedMs: number;        // time to clear
}

export interface IncursionRun {
  runId: string;
  playerA: string;          // user id
  playerB: string;
  rooms: IncursionRoom[];
  activeBuffs: RoomBuff[];
  currentRoomIndex: number;
  startedAt: number;        // epoch ms
  completedAt: number | null;
  abandoned: boolean;
  weekId: string;           // e.g. "2026-W14"
}

export interface RunReward {
  dreamTokens: number;
  craftingMaterials: { key: string; name: string; quantity: number }[];
  voidCrystals: number;
  equipmentDrops: { key: string; name: string }[];
  cosmeticFragments: number;
}

export interface IncursionLeaderboardEntry {
  runId: string;
  playerA: string;
  playerB: string;
  deepestRoom: number;      // 1-10
  totalTimeMs: number;
  weekId: string;
  completedAt: number;
}

/* ─── ROOM & BUFF POOLS ─── */

const BUFF_POOL: RoomBuff[] = [
  { key: "atk_up",      label: "+10% Attack",             icon: "Swords",     stat: "attack",        value: 0.10, stackable: true },
  { key: "def_up",      label: "+10% Defense",            icon: "Shield",     stat: "defense",       value: 0.10, stackable: true },
  { key: "hp_up",       label: "+15% HP",                 icon: "Heart",      stat: "maxHP",         value: 0.15, stackable: true },
  { key: "speed_up",    label: "+20% Speed",              icon: "Zap",        stat: "speed",         value: 0.20, stackable: true },
  { key: "crit_up",     label: "+5% Crit Chance",         icon: "Crosshair",  stat: "critChance",    value: 0.05, stackable: true },
  { key: "resource_up", label: "+10% Resource Bonus",     icon: "Coins",      stat: "resourceBonus", value: 0.10, stackable: true },
  { key: "heal_burst",  label: "Heal 20% HP",             icon: "HeartPulse", stat: "healOnClear",   value: 0.20, stackable: true },
  { key: "shield",      label: "Shield: absorb first hit",icon: "ShieldPlus", stat: "shieldHits",    value: 1,    stackable: true },
  { key: "extra_life",  label: "+1 Extra Life",           icon: "LifeBuoy",   stat: "extraLives",    value: 1,    stackable: true },
];

const ROOM_POOL: IncursionRoomDef[] = [
  // Combat rooms (6)
  { key: "drone_swarm",      name: "Drone Swarm",         description: "Waves of rogue drones flood the corridor.",                  icon: "Bug",        type: "combat",   difficultyMod: 1.0, buff: BUFF_POOL[0], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "crafting_material", itemKey: "scrap_metal", name: "Scrap Metal", dropRate: 0.6, minRoom: 0 }] },
  { key: "void_sentinels",   name: "Void Sentinels",      description: "Shadowy sentinels phase in and out of reality.",             icon: "Ghost",      type: "combat",   difficultyMod: 1.2, buff: BUFF_POOL[1], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "crafting_material", itemKey: "void_dust", name: "Void Dust", dropRate: 0.5, minRoom: 0 }] },
  { key: "chrono_raiders",   name: "Chrono Raiders",      description: "Time-displaced warriors attack from multiple eras.",         icon: "Clock",      type: "combat",   difficultyMod: 1.1, buff: BUFF_POOL[3], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "crafting_material", itemKey: "chrono_shard", name: "Chrono Shard", dropRate: 0.4, minRoom: 2 }] },
  { key: "flame_constructs", name: "Flame Constructs",    description: "Molten golems guard an ancient forge.",                      icon: "Flame",      type: "combat",   difficultyMod: 1.3, buff: BUFF_POOL[4], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "crafting_material", itemKey: "ember_core", name: "Ember Core", dropRate: 0.45, minRoom: 1 }] },
  { key: "shadow_lurkers",   name: "Shadow Lurkers",      description: "Enemies that strike from the darkness.",                     icon: "EyeOff",     type: "combat",   difficultyMod: 1.0, buff: BUFF_POOL[6], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }] },
  { key: "machine_cult",     name: "Machine Cult",        description: "Fanatical engineers have rigged the room with turrets.",     icon: "Cog",        type: "combat",   difficultyMod: 1.15, buff: BUFF_POOL[5], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "crafting_material", itemKey: "circuit_board", name: "Circuit Board", dropRate: 0.5, minRoom: 0 }] },
  // Card rooms (2)
  { key: "card_trial",       name: "Dischordia Trial",    description: "An AI challenger demands a card duel.",                      icon: "Layers",     type: "card",     difficultyMod: 1.0, buff: BUFF_POOL[2], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }] },
  { key: "card_gauntlet",    name: "Dischordia Gauntlet", description: "Defeat three AI decks in rapid succession.",                icon: "LayoutGrid", type: "card",     difficultyMod: 1.4, buff: BUFF_POOL[0], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "crafting_material", itemKey: "rare_ink", name: "Rare Ink", dropRate: 0.35, minRoom: 3 }] },
  // Puzzle rooms (2)
  { key: "cipher_lock",      name: "Cipher Lock",         description: "Decode the cipher before the door seals forever.",           icon: "Lock",       type: "puzzle",   puzzleVariant: "cipher",   difficultyMod: 0.8, buff: BUFF_POOL[7], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }] },
  { key: "hacking_node",     name: "Hacking Node",        description: "Breach the security node to unlock the next sector.",       icon: "Terminal",   type: "puzzle",   puzzleVariant: "hacking",  difficultyMod: 0.9, buff: BUFF_POOL[8], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "crafting_material", itemKey: "data_chip", name: "Data Chip", dropRate: 0.55, minRoom: 0 }] },
  { key: "sequence_trap",    name: "Sequence Trap",       description: "Step on the tiles in the right order or face the trap.",     icon: "Grid",       type: "puzzle",   puzzleVariant: "sequence", difficultyMod: 0.85, buff: BUFF_POOL[4], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }] },
  // Treasure rooms (2)
  { key: "hidden_cache",     name: "Hidden Cache",        description: "An unguarded stash — pick from three loot options.",         icon: "Gift",       type: "treasure", difficultyMod: 0.0, buff: BUFF_POOL[5], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "crafting_material", itemKey: "golden_alloy", name: "Golden Alloy", dropRate: 0.7, minRoom: 0 }, { category: "equipment", itemKey: "incursion_ring", name: "Incursion Ring", dropRate: 0.08, minRoom: 6 }] },
  { key: "dreamers_vault",   name: "Dreamer's Vault",     description: "A vault of crystallized dreams, ripe for the taking.",      icon: "Gem",        type: "treasure", difficultyMod: 0.0, buff: BUFF_POOL[2], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "equipment", itemKey: "void_pendant", name: "Void Pendant", dropRate: 0.06, minRoom: 6 }] },
  // Boss rooms (2 — guaranteed at positions 5 and 10)
  { key: "mini_boss",        name: "The Warden",          description: "A mid-dungeon guardian blocks the path forward.",            icon: "ShieldAlert",type: "boss",     difficultyMod: 1.0, buff: BUFF_POOL[8], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "void_crystal", itemKey: "void_crystal", name: "Void Crystal", dropRate: 1.0, minRoom: 0 }, { category: "crafting_material", itemKey: "warden_plate", name: "Warden Plate", dropRate: 0.5, minRoom: 0 }] },
  { key: "final_boss",       name: "The Architect",       description: "The mastermind behind the incursion awaits at the depths.", icon: "Crown",      type: "boss",     difficultyMod: 1.0, buff: BUFF_POOL[7], loot: [{ category: "dream_tokens", itemKey: "dream", name: "Dream Tokens", dropRate: 1.0, minRoom: 0 }, { category: "void_crystal", itemKey: "void_crystal", name: "Void Crystal", dropRate: 1.0, minRoom: 0 }, { category: "equipment", itemKey: "architects_sigil", name: "Architect's Sigil", dropRate: 0.15, minRoom: 0 }, { category: "cosmetic_fragment", itemKey: "incursion_fragment", name: "Incursion Cosmetic Fragment", dropRate: 1.0, minRoom: 0 }] },
];

/* ─── CORE FUNCTIONS ─── */

/** Fisher-Yates shuffle (non-mutating) */
function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Calculate effective difficulty for a given room index (0-based). */
export function calculateRoomDifficulty(roomIndex: number, roomDifficultyMod: number): number {
  if (roomIndex === 4) return MINI_BOSS_DIFFICULTY * roomDifficultyMod;
  if (roomIndex === 9) return FINAL_BOSS_DIFFICULTY * roomDifficultyMod;
  return (BASE_DIFFICULTY + roomIndex * DIFFICULTY_PER_ROOM) * roomDifficultyMod;
}

/** Generate a 10-room dungeon. Bosses are pinned at rooms 5 and 10. */
export function generateDungeon(runId: string, playerA: string, playerB: string): IncursionRun {
  const miniBoss = ROOM_POOL.find((r) => r.key === "mini_boss")!;
  const finalBoss = ROOM_POOL.find((r) => r.key === "final_boss")!;
  const nonBoss = ROOM_POOL.filter((r) => r.type !== "boss");

  // Pick 8 random non-boss rooms, then slot bosses at index 4 and 9
  const picked = shuffle(nonBoss).slice(0, 8);
  const ordered = [...picked.slice(0, 4), miniBoss, ...picked.slice(4), finalBoss];

  const rooms: IncursionRoom[] = ordered.map((def, i) => ({
    index: i,
    def,
    difficulty: calculateRoomDifficulty(i, def.difficultyMod),
    assignedPlayer: i % 2 === 0 ? "A" : "B",
    cleared: false,
    elapsedMs: 0,
  }));

  const now = Date.now();
  const weekNum = Math.ceil(((now / 86400000) - 3) / 7); // rough ISO week
  return {
    runId,
    playerA,
    playerB,
    rooms,
    activeBuffs: [],
    currentRoomIndex: 0,
    startedAt: now,
    completedAt: null,
    abandoned: false,
    weekId: `2026-W${String(weekNum).padStart(2, "0")}`,
  };
}

/** Apply the cleared room's buff to the run's active buff stack. */
export function applyRoomBuff(run: IncursionRun, roomIndex: number): IncursionRun {
  const room = run.rooms[roomIndex];
  if (!room || !room.cleared) return run;
  return {
    ...run,
    activeBuffs: [...run.activeBuffs, room.def.buff],
    currentRoomIndex: Math.min(roomIndex + 1, DUNGEON_LENGTH - 1),
  };
}

/** Aggregate all active buffs into a flat stat map. */
export function resolveBuffStack(buffs: RoomBuff[]): Record<string, number> {
  const stats: Record<string, number> = {};
  for (const b of buffs) {
    stats[b.stat] = (stats[b.stat] ?? 0) + b.value;
  }
  return stats;
}

/** Calculate rewards for all rooms cleared so far in a run. */
export function getRunRewards(run: IncursionRun): RunReward {
  const reward: RunReward = {
    dreamTokens: 0,
    craftingMaterials: [],
    voidCrystals: 0,
    equipmentDrops: [],
    cosmeticFragments: 0,
  };

  const materialsMap = new Map<string, { key: string; name: string; quantity: number }>();

  for (const room of run.rooms) {
    if (!room.cleared) continue;
    const depth = room.index + 1;

    // Dream tokens scale with depth: 10 base + 4 per depth level (10–50)
    reward.dreamTokens += Math.min(10 + (depth - 1) * 4, 50);

    for (const entry of room.def.loot) {
      if (depth - 1 < entry.minRoom) continue;
      if (Math.random() > entry.dropRate) continue;

      switch (entry.category) {
        case "dream_tokens":
          // already handled above
          break;
        case "crafting_material": {
          const existing = materialsMap.get(entry.itemKey);
          if (existing) { existing.quantity += 1; }
          else { materialsMap.set(entry.itemKey, { key: entry.itemKey, name: entry.name, quantity: 1 }); }
          break;
        }
        case "void_crystal":
          reward.voidCrystals += 1;
          break;
        case "equipment":
          reward.equipmentDrops.push({ key: entry.itemKey, name: entry.name });
          break;
        case "cosmetic_fragment":
          reward.cosmeticFragments += 1;
          break;
      }
    }
  }

  reward.craftingMaterials = Array.from(materialsMap.values());

  // Completion bonus: full clear grants extra dream and a guaranteed cosmetic fragment
  const allCleared = run.rooms.every((r) => r.cleared);
  if (allCleared) {
    reward.dreamTokens += 100;
    reward.cosmeticFragments += 1;
  }

  return reward;
}

/** Build a leaderboard entry from a completed (or abandoned) run. */
export function toLeaderboardEntry(run: IncursionRun): IncursionLeaderboardEntry {
  const deepest = run.rooms.filter((r) => r.cleared).length;
  const totalTime = run.rooms.reduce((sum, r) => sum + r.elapsedMs, 0);
  return {
    runId: run.runId,
    playerA: run.playerA,
    playerB: run.playerB,
    deepestRoom: deepest,
    totalTimeMs: totalTime,
    weekId: run.weekId,
    completedAt: run.completedAt ?? Date.now(),
  };
}
