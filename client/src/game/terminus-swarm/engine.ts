/* ═══════════════════════════════════════════════════════
   TERMINUS SWARM ENGINE — Core tower defense game logic
   Grid-based with A* pathfinding, turret targeting,
   enemy AI, wave spawning, and resource management.
   ═══════════════════════════════════════════════════════ */
import type {
  TerminusGameState, GridCell, TurretInstance, EnemyInstance,
  Projectile, Vec2, GameResources, GamePhase, WaveSpawn,
  TurretDef, EnemyDef, MapDef,
} from "./types";
import { TURRETS, ENEMIES, getWaveForNumber } from "./definitions";

const FPS = 60;
let _uid = 0;
function uid(): string { return `ts_${++_uid}_${Date.now()}`; }

/* ─── A* PATHFINDING ─── */

interface PathNode {
  row: number;
  col: number;
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
}

function heuristic(a: Vec2, b: Vec2): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function findPath(
  grid: GridCell[][],
  start: Vec2,
  end: Vec2,
  flying: boolean = false,
): Vec2[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const open: PathNode[] = [];
  const closed = new Set<string>();
  const key = (r: number, c: number) => `${r},${c}`;

  const startNode: PathNode = {
    row: Math.round(start.y), col: Math.round(start.x),
    g: 0, h: heuristic(start, end), f: 0, parent: null,
  };
  startNode.f = startNode.g + startNode.h;
  open.push(startNode);

  while (open.length > 0) {
    // Find lowest f
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const ck = key(current.row, current.col);

    if (current.row === Math.round(end.y) && current.col === Math.round(end.x)) {
      // Reconstruct path
      const path: Vec2[] = [];
      let node: PathNode | null = current;
      while (node) {
        path.unshift({ x: node.col, y: node.row });
        node = node.parent;
      }
      return path;
    }

    closed.add(ck);

    // Neighbors (4-directional)
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dr, dc] of dirs) {
      const nr = current.row + dr;
      const nc = current.col + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (closed.has(key(nr, nc))) continue;

      const cell = grid[nr][nc];
      // Flying units can pass over turrets
      if (!flying && (cell.type === "turret" || cell.type === "blocked")) continue;
      if (cell.type === "blocked" && !flying) continue;

      const g = current.g + 1;
      const h = heuristic({ x: nc, y: nr }, end);
      const f = g + h;

      const existing = open.find(n => n.row === nr && n.col === nc);
      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.f = f;
          existing.parent = current;
        }
      } else {
        open.push({ row: nr, col: nc, g, h, f, parent: current });
      }
    }
  }

  // No path found — return direct line (enemies will push through)
  return [start, end];
}

/* ─── GAME STATE CREATION ─── */

export function createGameState(map: MapDef): TerminusGameState {
  _uid = 0;
  const grid: GridCell[][] = [];

  for (let r = 0; r < map.height; r++) {
    grid[r] = [];
    for (let c = 0; c < map.width; c++) {
      let type: GridCell["type"] = "empty";
      // Check if blocked
      if (map.blockedTiles.some(t => t.x === c && t.y === r)) type = "blocked";
      // Check if spawn
      if (map.spawnPoints.some(s => s.x === c && s.y === r)) type = "spawn";
      // Check if core
      if (map.corePosition.x === c && map.corePosition.y === r) type = "core";

      grid[r][c] = { row: r, col: c, type };
    }
  }

  return {
    grid,
    gridWidth: map.width,
    gridHeight: map.height,
    turrets: new Map(),
    enemies: new Map(),
    projectiles: [],
    resources: { salvage: 200, viralIchor: 0, neuralCores: 0, voidCrystals: 0 },
    wave: 0,
    phase: "setup",
    coreHealth: 500,
    coreMaxHealth: 500,
    spawnPoints: map.spawnPoints,
    corePosition: map.corePosition,
    score: 0,
    kills: 0,
    frameCount: 0,
  };
}

/* ─── TURRET PLACEMENT ─── */

export function canPlaceTurret(state: TerminusGameState, row: number, col: number): boolean {
  if (row < 0 || row >= state.gridHeight || col < 0 || col >= state.gridWidth) return false;
  const cell = state.grid[row][col];
  if (cell.type !== "empty") return false;

  // Check that placing here doesn't block ALL paths from spawn to core
  // Temporarily set cell as turret and verify paths exist
  cell.type = "turret";
  let pathExists = true;
  for (const sp of state.spawnPoints) {
    const path = findPath(state.grid, sp, state.corePosition, false);
    if (path.length <= 1) { pathExists = false; break; }
  }
  cell.type = "empty"; // Restore

  return pathExists;
}

export function placeTurret(
  state: TerminusGameState,
  row: number,
  col: number,
  turretType: string,
): TerminusGameState {
  const def = TURRETS[turretType];
  if (!def) return state;
  if (!canPlaceTurret(state, row, col)) return state;

  // Check resources
  if (state.resources.salvage < def.cost.salvage) return state;
  if (def.cost.viralIchor && state.resources.viralIchor < def.cost.viralIchor) return state;
  if (def.cost.neuralCores && state.resources.neuralCores < def.cost.neuralCores) return state;

  // Deduct cost
  state.resources.salvage -= def.cost.salvage;
  if (def.cost.viralIchor) state.resources.viralIchor -= def.cost.viralIchor;
  if (def.cost.neuralCores) state.resources.neuralCores -= def.cost.neuralCores;

  const turret: TurretInstance = {
    id: uid(), def, row, col,
    health: def.health, maxHealth: def.health,
    level: 1, cooldown: 0, target: null, kills: 0, totalDamage: 0,
  };

  state.grid[row][col].type = "turret";
  state.grid[row][col].turretId = turret.id;
  state.turrets.set(turret.id, turret);

  // Recalculate paths for all active enemies
  for (const [, enemy] of state.enemies) {
    if (enemy.alive) {
      enemy.path = findPath(state.grid, { x: enemy.x, y: enemy.y }, state.corePosition, enemy.def.flying);
      enemy.pathIndex = 0;
    }
  }

  return state;
}

export function sellTurret(state: TerminusGameState, turretId: string): TerminusGameState {
  const turret = state.turrets.get(turretId);
  if (!turret) return state;

  // Refund 50% of cost
  state.resources.salvage += Math.floor(turret.def.cost.salvage * 0.5);
  if (turret.def.cost.viralIchor) state.resources.viralIchor += Math.floor(turret.def.cost.viralIchor * 0.5);

  state.grid[turret.row][turret.col].type = "empty";
  state.grid[turret.row][turret.col].turretId = undefined;
  state.turrets.delete(turretId);

  return state;
}

/* ─── WAVE START ─── */

export function startWave(state: TerminusGameState): TerminusGameState {
  state.wave++;
  state.phase = "wave";
  return state;
}

/* ─── MAIN GAME TICK ─── */

// Wave spawn tracking
const activeSpawns: { spawn: WaveSpawn; spawned: number; timer: number }[] = [];

export function tick(state: TerminusGameState): TerminusGameState {
  if (state.phase === "setup" || state.phase === "victory" || state.phase === "defeat") return state;
  state.frameCount++;

  // Initialize wave spawns on first frame
  if (state.phase === "wave" && state.frameCount === 1) {
    // This is handled in startWave
  }

  // Spawn enemies
  if (state.phase === "wave" || state.phase === "boss") {
    spawnEnemies(state);
  }

  // Update enemies
  updateEnemies(state);

  // Update turrets
  updateTurrets(state);

  // Update projectiles
  updateProjectiles(state);

  // Check wave complete
  if ((state.phase === "wave" || state.phase === "boss") && state.enemies.size === 0 && !hasRemainingSpawns()) {
    const waveDef = getWaveForNumber(state.wave);
    // Award wave rewards
    state.resources.salvage += waveDef.reward.salvage;
    if (waveDef.reward.viralIchor) state.resources.viralIchor += waveDef.reward.viralIchor;
    if (waveDef.reward.neuralCores) state.resources.neuralCores += waveDef.reward.neuralCores;
    if (waveDef.reward.voidCrystals) state.resources.voidCrystals += waveDef.reward.voidCrystals;
    state.phase = "intermission";
  }

  // Check defeat
  if (state.coreHealth <= 0) {
    state.phase = "defeat";
  }

  return state;
}

/* ─── WAVE SPAWNING ─── */

let waveInitialized = -1;

function spawnEnemies(state: TerminusGameState) {
  if (waveInitialized !== state.wave) {
    waveInitialized = state.wave;
    activeSpawns.length = 0;
    const waveDef = getWaveForNumber(state.wave);
    for (const spawn of waveDef.spawns) {
      activeSpawns.push({ spawn, spawned: 0, timer: spawn.startDelay });
    }
  }

  for (const as of activeSpawns) {
    if (as.spawned >= as.spawn.count) continue;
    as.timer--;
    if (as.timer <= 0) {
      // Spawn enemy
      const def = ENEMIES[as.spawn.enemyType];
      if (def) {
        const sp = state.spawnPoints[Math.floor(Math.random() * state.spawnPoints.length)];
        const path = findPath(state.grid, sp, state.corePosition, def.flying);
        const enemy: EnemyInstance = {
          id: uid(), def, x: sp.x, y: sp.y,
          health: def.health, maxHealth: def.health,
          path, pathIndex: 0,
          speed: def.speed, slowTimer: 0, stunTimer: 0,
          attackTarget: null, attackCooldown: 0, alive: true,
        };
        state.enemies.set(enemy.id, enemy);
      }
      as.spawned++;
      as.timer = as.spawn.delayBetween;
    }
  }
}

function hasRemainingSpawns(): boolean {
  return activeSpawns.some(as => as.spawned < as.spawn.count);
}

/* ─── ENEMY UPDATE ─── */

function updateEnemies(state: TerminusGameState) {
  const toRemove: string[] = [];

  for (const [id, enemy] of state.enemies) {
    if (!enemy.alive) { toRemove.push(id); continue; }

    // Stun check
    if (enemy.stunTimer > 0) { enemy.stunTimer--; continue; }

    // Slow effect
    const speedMult = enemy.slowTimer > 0 ? 0.5 : 1;
    if (enemy.slowTimer > 0) enemy.slowTimer--;

    // Check if adjacent to a turret to attack
    const nearbyTurret = findNearestTurretInRange(state, enemy, 1.2);
    if (nearbyTurret && !enemy.def.flying) {
      // Attack the turret
      enemy.attackCooldown--;
      if (enemy.attackCooldown <= 0) {
        nearbyTurret.health -= enemy.def.damage;
        enemy.attackCooldown = Math.round(FPS / enemy.def.attackSpeed);

        // Check turret death
        if (nearbyTurret.health <= 0) {
          state.grid[nearbyTurret.row][nearbyTurret.col].type = "empty";
          state.grid[nearbyTurret.row][nearbyTurret.col].turretId = undefined;
          state.turrets.delete(nearbyTurret.id);
          enemy.attackTarget = null;
        }
      }
      continue; // Don't move while attacking
    }

    // Move along path
    if (enemy.pathIndex < enemy.path.length) {
      const target = enemy.path[enemy.pathIndex];
      const dx = target.x - enemy.x;
      const dy = target.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const moveSpeed = (enemy.speed * speedMult) / FPS;

      if (dist < moveSpeed) {
        enemy.x = target.x;
        enemy.y = target.y;
        enemy.pathIndex++;
      } else {
        enemy.x += (dx / dist) * moveSpeed;
        enemy.y += (dy / dist) * moveSpeed;
      }
    }

    // Check if reached core
    const coreDistX = enemy.x - state.corePosition.x;
    const coreDistY = enemy.y - state.corePosition.y;
    if (Math.sqrt(coreDistX * coreDistX + coreDistY * coreDistY) < 0.8) {
      state.coreHealth -= enemy.def.damage * 2;
      enemy.alive = false;
      toRemove.push(id);
    }

    // Regeneration
    for (const sp of enemy.def.special) {
      if (sp.type === "regenerate") {
        enemy.health = Math.min(enemy.maxHealth, enemy.health + sp.hpPerSec / FPS);
      }
    }

    // Spawn minions
    for (const sp of enemy.def.special) {
      if (sp.type === "spawn_minions" && state.frameCount % sp.interval === 0) {
        for (let i = 0; i < sp.count; i++) {
          const minionDef = ENEMIES[sp.minionType];
          if (!minionDef) continue;
          const path = findPath(state.grid, { x: enemy.x, y: enemy.y }, state.corePosition, minionDef.flying);
          const minion: EnemyInstance = {
            id: uid(), def: minionDef,
            x: enemy.x + (Math.random() - 0.5) * 0.5,
            y: enemy.y + (Math.random() - 0.5) * 0.5,
            health: minionDef.health, maxHealth: minionDef.health,
            path, pathIndex: 0,
            speed: minionDef.speed, slowTimer: 0, stunTimer: 0,
            attackTarget: null, attackCooldown: 0, alive: true,
          };
          state.enemies.set(minion.id, minion);
        }
      }
    }
  }

  for (const id of toRemove) state.enemies.delete(id);
}

function findNearestTurretInRange(state: TerminusGameState, enemy: EnemyInstance, range: number): TurretInstance | null {
  let nearest: TurretInstance | null = null;
  let nearestDist = Infinity;

  for (const [, turret] of state.turrets) {
    const dx = turret.col - enemy.x;
    const dy = turret.row - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < range && dist < nearestDist) {
      nearestDist = dist;
      nearest = turret;
    }
  }

  return nearest;
}

/* ─── TURRET UPDATE ─── */

function updateTurrets(state: TerminusGameState) {
  for (const [, turret] of state.turrets) {
    if (turret.cooldown > 0) { turret.cooldown--; continue; }
    if (turret.def.fireRate === 0) {
      // Support turrets (shield pylon, nanite swarm)
      handleSupportTurret(state, turret);
      continue;
    }

    // Find target
    const target = findBestTarget(state, turret);
    if (!target) continue;

    // Fire
    const proj: Projectile = {
      id: uid(),
      x: turret.col,
      y: turret.row,
      targetId: target.id,
      damage: turret.def.damage * turret.level,
      speed: 8,
      type: turret.def.type === "arc_emitter" ? "lightning" :
            turret.def.type === "cryo_array" ? "frost" :
            turret.def.type === "flame_projector" ? "flame" :
            turret.def.type === "missile_battery" ? "missile" : "bullet",
      color: turret.def.color,
    };
    state.projectiles.push(proj);
    turret.cooldown = Math.round(FPS / turret.def.fireRate);
    turret.target = target.id;
  }
}

function handleSupportTurret(state: TerminusGameState, turret: TurretInstance) {
  if (turret.def.type === "nanite_swarm") {
    // Heal nearby turrets
    for (const [, t] of state.turrets) {
      if (t.id === turret.id) continue;
      const dx = t.col - turret.col;
      const dy = t.row - turret.row;
      if (Math.sqrt(dx * dx + dy * dy) <= turret.def.range) {
        t.health = Math.min(t.maxHealth, t.health + 5 / FPS);
      }
    }
  }
  // Shield pylon is passive (checked in damage calculation)
}

function findBestTarget(state: TerminusGameState, turret: TurretInstance): EnemyInstance | null {
  let best: EnemyInstance | null = null;
  let bestScore = -Infinity;

  for (const [, enemy] of state.enemies) {
    if (!enemy.alive) continue;
    const dx = enemy.x - turret.col;
    const dy = enemy.y - turret.row;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > turret.def.range) continue;

    // Prioritize: closest to core > lowest HP > highest tier
    const score = -enemy.pathIndex * 10 + (1 / Math.max(1, enemy.health)) * 100 + enemy.def.tier * 5;
    if (score > bestScore) { bestScore = score; best = enemy; }
  }

  return best;
}

/* ─── PROJECTILE UPDATE ─── */

function updateProjectiles(state: TerminusGameState) {
  const toRemove: number[] = [];

  for (let i = 0; i < state.projectiles.length; i++) {
    const proj = state.projectiles[i];
    const target = state.enemies.get(proj.targetId);

    if (!target || !target.alive) {
      toRemove.push(i);
      continue;
    }

    // Move toward target
    const dx = target.x - proj.x;
    const dy = target.y - proj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.3) {
      // Hit!
      let damage = proj.damage;

      // Dodge check
      for (const sp of target.def.special) {
        if (sp.type === "dodge" && Math.random() < sp.chance) {
          damage = 0; // Dodged
          break;
        }
      }

      // Armor reduction
      damage = Math.max(1, damage - target.def.armor);

      // Shield pylon check
      const hasShield = [...state.turrets.values()].some(t =>
        t.def.type === "shield_pylon" &&
        Math.sqrt((t.col - target.x) ** 2 + (t.row - target.y) ** 2) <= t.def.range
      );
      // Shield pylons don't affect enemy damage - they affect turret damage taken

      target.health -= damage;

      // Apply special effects based on projectile type
      if (proj.type === "frost") {
        const immune = target.def.special.some(s => s.type === "immune_slow");
        if (!immune) target.slowTimer = 180; // 3 seconds
      }
      if (proj.type === "flame") {
        // Burn DOT — applied as immediate extra damage (simplified)
        target.health -= 5;
      }

      // Check kill
      if (target.health <= 0) {
        target.alive = false;
        state.kills++;
        state.score += target.def.tier * 10;
        state.resources.salvage += target.def.reward.salvage;
        if (target.def.reward.viralIchor) state.resources.viralIchor += target.def.reward.viralIchor;
        if (target.def.reward.neuralCores) state.resources.neuralCores += target.def.reward.neuralCores;
        if (target.def.reward.voidCrystals) state.resources.voidCrystals += target.def.reward.voidCrystals;

        // Death effects
        for (const sp of target.def.special) {
          if (sp.type === "explode_on_death" || sp.type === "area_death") {
            // Damage nearby turrets
            for (const [, turret] of state.turrets) {
              const tdx = turret.col - target.x;
              const tdy = turret.row - target.y;
              if (Math.sqrt(tdx * tdx + tdy * tdy) <= sp.radius) {
                turret.health -= sp.damage;
                if (turret.health <= 0) {
                  state.grid[turret.row][turret.col].type = "empty";
                  state.grid[turret.row][turret.col].turretId = undefined;
                  state.turrets.delete(turret.id);
                }
              }
            }
          }
        }
      }

      toRemove.push(i);
    } else {
      const moveSpeed = proj.speed / FPS;
      proj.x += (dx / dist) * moveSpeed;
      proj.y += (dy / dist) * moveSpeed;
    }
  }

  // Remove hit projectiles (reverse order to maintain indices)
  for (let i = toRemove.length - 1; i >= 0; i--) {
    state.projectiles.splice(toRemove[i], 1);
  }
}

/* ─── EXPORTS ─── */

export { TURRETS, ENEMIES, getWaveForNumber };
export type { MapDef };
