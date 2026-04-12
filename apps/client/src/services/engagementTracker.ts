/* ═══════════════════════════════════════════════════════
   ENGAGEMENT TRACKER SERVICE

   Every action in the game feeds the Pulse panel of the
   Governance Hub. Tracks real-time, 24h rolling, 7d rolling,
   and 30d rolling metrics. Displayed as "vital signs" of
   the Ark — color-coded with trend arrows and sparklines.

   The Antiquarian references these in his journal:
   "I watched through the Orb as 14,000 souls fell in
    combat this week alone."
   ═══════════════════════════════════════════════════════ */

import { useGovernanceStore, type EngagementMetrics, type MetricTrend } from "@/stores/governanceStore";

/* ─── METRIC DEFINITIONS ─── */

export interface MetricDefinition {
  key: keyof EngagementMetrics;
  label: string;
  /** Short label for compact display */
  shortLabel: string;
  /** Icon hint (lucide icon name) */
  icon: string;
  /** Color class for the vital sign card */
  color: string;
  /** Category for grouping */
  category: "combat" | "progression" | "social" | "discovery" | "economy";
  /** Format function for display */
  format: (value: number) => string;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatRatio(n: number): string {
  return n.toLocaleString();
}

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    key: "totalKills",
    label: "Arena Kills",
    shortLabel: "Kills",
    icon: "Swords",
    color: "text-red-400",
    category: "combat",
    format: formatCompact,
  },
  {
    key: "totalMissions",
    label: "Missions Completed",
    shortLabel: "Missions",
    icon: "Target",
    color: "text-blue-400",
    category: "progression",
    format: formatCompact,
  },
  {
    key: "totalVotesCast",
    label: "Votes Cast",
    shortLabel: "Votes",
    icon: "Vote",
    color: "text-cyan-400",
    category: "social",
    format: formatRatio,
  },
  {
    key: "activePlayers",
    label: "Active Operatives",
    shortLabel: "Active",
    icon: "Users",
    color: "text-green-400",
    category: "social",
    format: formatRatio,
  },
  {
    key: "resourcesGathered",
    label: "Dream Tokens Earned",
    shortLabel: "Dream",
    icon: "Sparkles",
    color: "text-amber-400",
    category: "economy",
    format: formatCompact,
  },
  {
    key: "cardsForged",
    label: "Cards Forged",
    shortLabel: "Forged",
    icon: "Flame",
    color: "text-orange-400",
    category: "economy",
    format: formatRatio,
  },
  {
    key: "specimensEvolved",
    label: "Specimens Evolved",
    shortLabel: "Evolved",
    icon: "Dna",
    color: "text-emerald-400",
    category: "progression",
    format: formatRatio,
  },
  {
    key: "chessMatesDelivered",
    label: "Chess Victories",
    shortLabel: "Checkmates",
    icon: "Crown",
    color: "text-yellow-400",
    category: "combat",
    format: formatRatio,
  },
  {
    key: "towerWavesCleared",
    label: "TD Waves Cleared",
    shortLabel: "Waves",
    icon: "Shield",
    color: "text-purple-400",
    category: "combat",
    format: formatCompact,
  },
  {
    key: "tradeVolumeCredits",
    label: "Trade Volume",
    shortLabel: "Credits",
    icon: "ArrowLeftRight",
    color: "text-teal-400",
    category: "economy",
    format: formatCompact,
  },
  {
    key: "loredexEntriesRead",
    label: "Lore Discovered",
    shortLabel: "Lore",
    icon: "BookOpen",
    color: "text-amber-300",
    category: "discovery",
    format: formatRatio,
  },
  {
    key: "musicTracksPlayed",
    label: "Tracks Played",
    shortLabel: "Music",
    icon: "Music",
    color: "text-pink-400",
    category: "discovery",
    format: formatRatio,
  },
  {
    key: "trustPointsEarned",
    label: "Trust Earned",
    shortLabel: "Trust",
    icon: "Heart",
    color: "text-rose-400",
    category: "social",
    format: formatRatio,
  },
  {
    key: "deathCount",
    label: "Resurrections",
    shortLabel: "Deaths",
    icon: "Skull",
    color: "text-gray-400",
    category: "combat",
    format: formatCompact,
  },
  {
    key: "betrayalsTriggered",
    label: "Betrayals",
    shortLabel: "Betrayals",
    icon: "AlertTriangle",
    color: "text-red-300",
    category: "social",
    format: formatRatio,
  },
  {
    key: "secretsDiscovered",
    label: "Secrets Found",
    shortLabel: "Secrets",
    icon: "Eye",
    color: "text-violet-400",
    category: "discovery",
    format: formatRatio,
  },
];

/* ─── TREND CALCULATION ─── */

/**
 * Determine the trend direction by comparing current to previous snapshot.
 */
export function calculateTrend(current: number, previous: number): MetricTrend {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "stable";
}

/**
 * Get the trend arrow symbol for display.
 */
export function trendArrow(trend: MetricTrend): string {
  switch (trend) {
    case "up": return "↑";
    case "down": return "↓";
    case "stable": return "→";
  }
}

/**
 * Get the health color for a metric based on its trend.
 * Green = healthy (up), Amber = stable, Red = declining.
 */
export function trendHealthColor(trend: MetricTrend): string {
  switch (trend) {
    case "up": return "text-green-400";
    case "down": return "text-red-400";
    case "stable": return "text-amber-400";
  }
}

/* ─── SPARKLINE DATA ─── */

/**
 * Extract a 7-day sparkline array for a given metric from the history.
 */
export function getSparklineData(
  history: Array<{ date: string; metrics: EngagementMetrics }>,
  metricKey: keyof EngagementMetrics,
): number[] {
  return history.slice(-7).map((h) => h.metrics[metricKey]);
}

/* ─── INCREMENT HELPERS ─── */

/**
 * Convenience function to increment a single metric.
 * Call from anywhere in the game when an action occurs.
 */
export function trackMetric(
  key: keyof EngagementMetrics,
  amount: number = 1,
): void {
  const store = useGovernanceStore.getState();
  store.updateMetrics({ [key]: store.metrics[key] + amount });
}

/**
 * Batch-increment multiple metrics at once.
 */
export function trackMetrics(
  increments: Partial<Record<keyof EngagementMetrics, number>>,
): void {
  const store = useGovernanceStore.getState();
  const updated: Partial<EngagementMetrics> = {};
  for (const [key, amount] of Object.entries(increments)) {
    const k = key as keyof EngagementMetrics;
    updated[k] = store.metrics[k] + (amount ?? 0);
  }
  store.updateMetrics(updated);
}

/* ─── ANTIQUARIAN METRIC NARRATION ─── */

/**
 * Generate an Antiquarian-style observation about the current metrics.
 * Used to flavor chronicle entries with real engagement data.
 */
export function narrateMetrics(metrics: EngagementMetrics): string {
  const observations: string[] = [];

  if (metrics.totalKills > 0) {
    observations.push(
      `I watched through the Orb as ${formatCompact(metrics.totalKills)} souls fell in combat. The Second Coming fights harder than the first.`,
    );
  }
  if (metrics.totalVotesCast > 0) {
    observations.push(
      `${formatCompact(metrics.totalVotesCast)} voices raised in governance. Democracy, even in the void, persists.`,
    );
  }
  if (metrics.secretsDiscovered > 0) {
    observations.push(
      `They have found ${metrics.secretsDiscovered} of the hidden things. I wonder if they know how many remain.`,
    );
  }
  if (metrics.betrayalsTriggered > 0) {
    observations.push(
      `${metrics.betrayalsTriggered} betrayals. I do not judge. I merely note that the first wave had fewer.`,
    );
  }
  if (metrics.deathCount > 0) {
    observations.push(
      `${formatCompact(metrics.deathCount)} resurrections. Death means less here than it should. I find this... concerning.`,
    );
  }

  if (observations.length === 0) {
    return "The Ark is quiet. Too quiet. I continue to observe.";
  }

  return observations[Math.floor(Math.random() * observations.length)];
}

/* ─── PRIMARY METRICS (for the Pulse panel — top 8) ─── */

export const PRIMARY_METRICS = METRIC_DEFINITIONS.filter((m) =>
  [
    "totalKills",
    "totalMissions",
    "totalVotesCast",
    "activePlayers",
    "resourcesGathered",
    "towerWavesCleared",
    "loredexEntriesRead",
    "secretsDiscovered",
  ].includes(m.key),
);
