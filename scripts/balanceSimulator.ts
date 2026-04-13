// Balance Simulator for Dischordian Saga
// Run: npx tsx scripts/balanceSimulator.ts

// --- Types ---

interface SimPlayer {
  level: number;
  xp: number;
  dream: number;
  cards: number;
  questsCompleted: number;
  craftsAttempted: number;
  craftsSucceeded: number;
  dayNumber: number;
}

interface StrategyConfig {
  name: string;
  questsPerDay: number;
  fightsPerDay: number;
  craftsPerDay: number;
  buyCards: boolean;
}

interface DaySnapshot {
  dream: number;
  level: number;
  xp: number;
}

interface SimResult {
  strategy: string;
  snapshots: DaySnapshot[][]; // per-player, per-day
  players: SimPlayer[];
}

interface Warning {
  severity: "critical" | "warning";
  message: string;
}

// --- Constants ---

const PLAYER_COUNT = 1000;
const SIM_DAYS = 90;
const MAX_LEVEL = 50;
const XP_PER_LEVEL = (lvl: number) => 500 + lvl * 200;
const CRAFT_SUCCESS_RATE = 0.6;
const CRAFT_COST_MIN = 25;
const CRAFT_COST_MAX = 100;
const QUEST_DREAM_MIN = 50;
const QUEST_DREAM_MAX = 200;
const QUEST_XP_MIN = 100;
const QUEST_XP_MAX = 500;
const FIGHT_DREAM = 50;
const CARD_COST = 150;

// --- Helpers ---

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const avg = (nums: number[]) =>
  nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

const c = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
};

// --- Strategies ---

const strategies: StrategyConfig[] = [
  { name: "casual", questsPerDay: 2, fightsPerDay: 0, craftsPerDay: 0, buyCards: false },
  { name: "grinder", questsPerDay: 5, fightsPerDay: 3, craftsPerDay: 1, buyCards: false },
  { name: "pvp_focused", questsPerDay: 2, fightsPerDay: 5, craftsPerDay: 0, buyCards: true },
  { name: "collector", questsPerDay: 3, fightsPerDay: 1, craftsPerDay: 0, buyCards: true },
  { name: "crafter", questsPerDay: 3, fightsPerDay: 0, craftsPerDay: 5, buyCards: false },
];

// --- Simulation ---

function createPlayer(): SimPlayer {
  return {
    level: 1, xp: 0, dream: 100, cards: 3,
    questsCompleted: 0, craftsAttempted: 0, craftsSucceeded: 0, dayNumber: 0,
  };
}

function simulateDay(player: SimPlayer, strat: StrategyConfig): void {
  player.dayNumber++;

  // Quests
  for (let i = 0; i < strat.questsPerDay; i++) {
    const dreamEarned = rand(QUEST_DREAM_MIN, QUEST_DREAM_MAX);
    const xpEarned = rand(QUEST_XP_MIN, QUEST_XP_MAX);
    player.dream += dreamEarned;
    player.xp += xpEarned;
    player.questsCompleted++;
  }

  // Level up
  while (player.level < MAX_LEVEL && player.xp >= XP_PER_LEVEL(player.level)) {
    player.xp -= XP_PER_LEVEL(player.level);
    player.level++;
  }

  // Fights
  for (let i = 0; i < strat.fightsPerDay; i++) {
    if (Math.random() > 0.4) {
      player.dream += FIGHT_DREAM;
    }
  }

  // Crafting
  for (let i = 0; i < strat.craftsPerDay; i++) {
    const cost = rand(CRAFT_COST_MIN, CRAFT_COST_MAX);
    if (player.dream >= cost) {
      player.dream -= cost;
      player.craftsAttempted++;
      if (Math.random() < CRAFT_SUCCESS_RATE) {
        player.craftsSucceeded++;
        player.cards++;
      }
    }
  }

  // Buy cards (collectors/pvp)
  if (strat.buyCards && player.dream >= CARD_COST && Math.random() < 0.5) {
    player.dream -= CARD_COST;
    player.cards++;
  }
}

function runStrategy(strat: StrategyConfig): SimResult {
  const players: SimPlayer[] = [];
  const snapshots: DaySnapshot[][] = [];

  for (let p = 0; p < PLAYER_COUNT; p++) {
    const player = createPlayer();
    const playerSnaps: DaySnapshot[] = [];

    for (let d = 0; d < SIM_DAYS; d++) {
      simulateDay(player, strat);
      playerSnaps.push({ dream: player.dream, level: player.level, xp: player.xp });
    }

    players.push(player);
    snapshots.push(playerSnaps);
  }

  return { strategy: strat.name, snapshots, players };
}

// --- Analysis ---

function avgDreamAtDay(result: SimResult, day: number): number {
  return avg(result.snapshots.map((s) => s[day - 1]?.dream ?? 0));
}

function avgLevelAtDay(result: SimResult, day: number): number {
  return avg(result.snapshots.map((s) => s[day - 1]?.level ?? 1));
}

function daysToMaxLevel(result: SimResult): number | null {
  const days = result.snapshots.map((snaps) => {
    const idx = snaps.findIndex((s) => s.level >= MAX_LEVEL);
    return idx >= 0 ? idx + 1 : null;
  });
  const reached = days.filter((d): d is number => d !== null);
  return reached.length > 0 ? Math.round(avg(reached)) : null;
}

function craftingSuccessRate(result: SimResult): number {
  const totalAttempts = result.players.reduce((a, p) => a + p.craftsAttempted, 0);
  const totalSuccess = result.players.reduce((a, p) => a + p.craftsSucceeded, 0);
  return totalAttempts > 0 ? totalSuccess / totalAttempts : 0;
}

function detectWarnings(results: SimResult[]): Warning[] {
  const warnings: Warning[] = [];

  for (const result of results) {
    // Check dream inflation: compare average dream growth rate day-over-day
    for (const checkDay of [30, 60]) {
      const dreamBefore = avgDreamAtDay(result, checkDay);
      const dreamAfter = avgDreamAtDay(result, checkDay + 1);
      if (dreamBefore > 0) {
        const dailyGrowth = (dreamAfter - dreamBefore) / dreamBefore;
        if (dailyGrowth > 0.10) {
          warnings.push({
            severity: "critical",
            message: `[${result.strategy}] Dream inflation >10% daily at day ${checkDay} (${(dailyGrowth * 100).toFixed(1)}%)`,
          });
        }
      }
    }

    // Check overall inflation: day 1 vs day 90
    const dreamDay1 = avgDreamAtDay(result, 1);
    const dreamDay90 = avgDreamAtDay(result, 90);
    if (dreamDay1 > 0) {
      const totalGrowth = dreamDay90 / dreamDay1;
      const dailyRate = Math.pow(totalGrowth, 1 / 89) - 1;
      if (dailyRate > 0.05) {
        warnings.push({
          severity: "warning",
          message: `[${result.strategy}] Sustained dream inflation: ${(dailyRate * 100).toFixed(2)}%/day avg over 90 days (${totalGrowth.toFixed(1)}x total)`,
        });
      }
    }

    // Check for progression stalls (level doesn't change for 10+ days)
    let stuckPlayers = 0;
    for (const snaps of result.snapshots) {
      for (let d = 10; d < snaps.length; d++) {
        const windowLevels = snaps.slice(d - 10, d).map((s) => s.level);
        const allSame = windowLevels.every((l) => l === windowLevels[0]);
        const notMax = windowLevels[0] < MAX_LEVEL;
        if (allSame && notMax) {
          stuckPlayers++;
          break;
        }
      }
    }
    if (stuckPlayers > PLAYER_COUNT * 0.2) {
      warnings.push({
        severity: "warning",
        message: `[${result.strategy}] ${stuckPlayers}/${PLAYER_COUNT} players got stuck (no level gain for 10+ days)`,
      });
    }

    // Check if a strategy can never reach max level
    const maxDays = daysToMaxLevel(result);
    if (maxDays === null) {
      warnings.push({
        severity: "critical",
        message: `[${result.strategy}] No players reached max level in ${SIM_DAYS} days`,
      });
    }
  }

  return warnings;
}

// --- Report ---

function printReport(results: SimResult[], warnings: Warning[]): void {
  console.log("\n" + c.bold("═══════════════════════════════════════════════════════════════"));
  console.log(c.bold("  DISCHORDIAN SAGA — ECONOMY BALANCE REPORT"));
  console.log(c.bold("═══════════════════════════════════════════════════════════════"));
  console.log(c.dim(`  ${PLAYER_COUNT} players × ${SIM_DAYS} days per strategy\n`));

  for (const result of results) {
    const maxDays = daysToMaxLevel(result);
    const craftRate = craftingSuccessRate(result);
    const dreamDay1 = avgDreamAtDay(result, 1);
    const dreamDay90 = avgDreamAtDay(result, 90);
    const inflationTotal = dreamDay1 > 0 ? dreamDay90 / dreamDay1 : 0;

    console.log(c.cyan(`  ┌─ Strategy: ${c.bold(result.strategy.toUpperCase())} ─────────────────────────`));
    console.log(`  │  Dream    day 30: ${c.bold(avgDreamAtDay(result, 30).toFixed(0).padStart(8))}    day 60: ${c.bold(avgDreamAtDay(result, 60).toFixed(0).padStart(8))}    day 90: ${c.bold(avgDreamAtDay(result, 90).toFixed(0).padStart(8))}`);
    console.log(`  │  Level    day  7: ${c.bold(avgLevelAtDay(result, 7).toFixed(1).padStart(8))}    day 30: ${c.bold(avgLevelAtDay(result, 30).toFixed(1).padStart(8))}`);
    console.log(`  │  Max lvl  ${maxDays ? `reached in ~${maxDays} days` : c.red("NOT REACHED")}`);

    if (result.players[0].craftsAttempted > 0) {
      console.log(`  │  Crafting  success rate: ${c.bold((craftRate * 100).toFixed(1) + "%")}`);
    }

    const inflColor = inflationTotal > 50 ? c.red : inflationTotal > 20 ? c.yellow : c.green;
    console.log(`  │  Dream inflation: ${inflColor(inflationTotal.toFixed(1) + "x")} over 90 days`);
    console.log(`  └──────────────────────────────────────────────────`);
    console.log();
  }

  // Warnings
  if (warnings.length > 0) {
    console.log(c.bold("  WARNINGS & ISSUES"));
    console.log("  " + "─".repeat(50));
    for (const w of warnings) {
      const icon = w.severity === "critical" ? c.red("CRITICAL") : c.yellow("WARNING ");
      const colorFn = w.severity === "critical" ? c.red : c.yellow;
      console.log(`  ${icon}  ${colorFn(w.message)}`);
    }
  } else {
    console.log(c.green("  No balance warnings detected."));
  }

  // Summary table
  console.log("\n" + c.bold("  COMPARISON TABLE"));
  console.log("  " + "─".repeat(65));
  console.log(c.dim("  Strategy        Dream@30   Dream@90   Lvl@30   MaxLvl Days"));
  console.log("  " + "─".repeat(65));
  for (const result of results) {
    const maxDays = daysToMaxLevel(result);
    const name = result.strategy.padEnd(16);
    const d30 = avgDreamAtDay(result, 30).toFixed(0).padStart(8);
    const d90 = avgDreamAtDay(result, 90).toFixed(0).padStart(8);
    const l30 = avgLevelAtDay(result, 30).toFixed(1).padStart(6);
    const ml = maxDays ? String(maxDays).padStart(10) : c.red("never".padStart(10));
    console.log(`  ${name}  ${d30}   ${d90}   ${l30}   ${ml}`);
  }
  console.log("  " + "─".repeat(65));
  console.log();
}

// --- Main ---

function main(): void {
  console.log(c.dim("\n  Simulating..."));
  const start = Date.now();

  const results = strategies.map((strat) => runStrategy(strat));
  const warnings = detectWarnings(results);

  printReport(results, warnings);

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(c.dim(`  Completed in ${elapsed}s\n`));
}

main();
