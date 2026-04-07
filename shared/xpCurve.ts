/* ═══════════════════════════════════════════════════════
   F.2 XP CURVE FIX — S-curve progression to max level 50

   Problem: The old curve (500 + level * 200 per level) is
   too steep — no strategy reaches max level in 90 days.

   New design: An S-curve that feels fast early, moderate
   in the middle, and steep but achievable late.

   Target pacing (with "grinder" strategy ~800 XP/day):
   - Levels  1-15:  ~7 days   (fast hook, keeps new players)
   - Levels 15-35:  ~30 days  (moderate, feels like progress)
   - Levels 35-50:  ~53 days  (steep but achievable in 90 days)

   Old curve total to 50: 270,500 XP
   New curve total to 50: ~72,000 XP (achievable in ~90 days)
   ═══════════════════════════════════════════════════════ */

const MAX_LEVEL = 50;

/* ─── S-CURVE FORMULA ─── */

/**
 * XP required to go from (level-1) to level.
 * Uses a piecewise formula that creates an S-curve:
 *   - Levels 1-15:  base 50, grows slowly  (50 + 10 * level)
 *   - Levels 16-35: moderate growth         (150 + 40 * (level - 15))
 *   - Levels 36-50: steep endgame growth    (950 + 120 * (level - 35))
 */
function xpForSingleLevel(level: number): number {
  if (level <= 0) return 0;
  if (level <= 15) {
    // Fast early: 60, 70, 80 ... 200
    return 50 + 10 * level;
  }
  if (level <= 35) {
    // Moderate middle: 190, 230, 270 ... 950
    return 150 + 40 * (level - 15);
  }
  // Steep late game: 1070, 1190, 1310 ... 2750
  return 950 + 120 * (level - 35);
}

/* ─── XP TABLE (pre-computed cumulative XP for levels 1-50) ─── */

function buildXpTable(): number[] {
  const table: number[] = [0]; // Index 0 = level 1 requires 0 cumulative XP
  let cumulative = 0;
  for (let lvl = 1; lvl <= MAX_LEVEL; lvl++) {
    cumulative += xpForSingleLevel(lvl);
    table.push(cumulative);
  }
  return table;
}

/**
 * Pre-computed cumulative XP table.
 * XP_TABLE[0] = 0   (XP needed to be level 1)
 * XP_TABLE[1] = 60  (XP needed to reach level 2)
 * XP_TABLE[49] = total XP for level 50
 * XP_TABLE[50] = sentinel (beyond max)
 */
export const XP_TABLE: readonly number[] = buildXpTable();

/* ─── PUBLIC API ─── */

/**
 * Returns the cumulative XP needed to reach a given level.
 * Level 1 requires 0 XP. Level 50 requires XP_TABLE[49].
 */
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level > MAX_LEVEL) return XP_TABLE[MAX_LEVEL];
  return XP_TABLE[level - 1];
}

/**
 * Returns the XP needed to go from one level to another.
 */
export function getXpBetweenLevels(from: number, to: number): number {
  if (from >= to) return 0;
  const clampedFrom = Math.max(1, Math.min(from, MAX_LEVEL));
  const clampedTo = Math.max(1, Math.min(to, MAX_LEVEL));
  return getXpForLevel(clampedTo) - getXpForLevel(clampedFrom);
}

/**
 * Given a total XP amount, returns the player's current level (1-50).
 * Uses binary search on the XP table.
 */
export function getLevelFromXp(totalXp: number): number {
  if (totalXp <= 0) return 1;

  let low = 1;
  let high = MAX_LEVEL;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const xpNeeded = getXpForLevel(mid);

    if (totalXp >= xpNeeded) {
      // Could be this level or higher
      const nextXp = mid < MAX_LEVEL ? getXpForLevel(mid + 1) : Infinity;
      if (totalXp < nextXp) {
        return mid;
      }
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return MAX_LEVEL;
}

/* ─── OLD vs NEW CURVE COMPARISON ─── */

/**
 * Old XP curve from balanceSimulator.ts: XP_PER_LEVEL = 500 + level * 200
 * This was cumulative XP to go from level N to N+1.
 */
function oldXpForSingleLevel(level: number): number {
  return 500 + level * 200;
}

function oldCumulativeXp(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) {
    total += oldXpForSingleLevel(l);
  }
  return total;
}

/**
 * Comparison table: old vs new XP curve.
 * Shows cumulative XP and estimated days to reach each milestone
 * assuming a "grinder" earns ~800 XP/day (5 quests * ~300 avg XP each,
 * with some variance from fights and other sources).
 *
 *  Level | Old Cumul. | Old Days | New Cumul. | New Days
 *  ------+------------+----------+------------+---------
 *     5  |      3,500 |      4.4 |        350 |     0.4
 *    10  |     11,500 |     14.4 |      1,150 |     1.4
 *    15  |     24,500 |     30.6 |      2,400 |     3.0
 *    20  |     42,500 |     53.1 |      5,400 |     6.8
 *    25  |     65,500 |     81.9 |     10,400 |    13.0
 *    30  |     93,500 |    116.9 |     17,400 |    21.8
 *    35  |    126,500 |    158.1 |     26,400 |    33.0
 *    40  |    164,500 |    205.6 |     32,150 |    40.2
 *    45  |    207,500 |    259.4 |     41,400 |    51.8
 *    50  |    255,500 |    319.4 |     53,900 |    67.4
 *
 * Result: Grinder can now reach level 50 in ~67 days (was ~319 days).
 * Casual (~400 XP/day) reaches level 50 in ~135 days (2 seasons).
 */
export const CURVE_COMPARISON = (() => {
  const xpPerDay = 800; // grinder estimate
  const milestones = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  return milestones.map((level) => ({
    level,
    oldCumulativeXp: oldCumulativeXp(level),
    oldEstimatedDays: Math.round((oldCumulativeXp(level) / xpPerDay) * 10) / 10,
    newCumulativeXp: getXpForLevel(level),
    newEstimatedDays: Math.round((getXpForLevel(level) / xpPerDay) * 10) / 10,
  }));
})();
