/**
 * Engineer's Log discovery-rarity formatting (C5 from
 * /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md
 * §"Cicada / wanon community fame").
 *
 * Pure helpers — pass an unlock count, get back a player-facing
 * rarity tier + label. Used both by the server (to bake rarity into
 * the engineerLogs.getAll response shape) and by the client (the
 * <EngineerLogRarityBadge> component renders the label).
 *
 * Bucket boundaries are calibrated for an indie audience size
 * (hundreds → low thousands of players). Tweak as the playerbase
 * scales — but keep the four-tier shape: Mythic / Rare / Uncommon /
 * Common. Wanons earn social proof from being "one of N" for the
 * Mythic / Rare tiers; the Common tier is a non-event so doesn't
 * earn a label.
 */

export type EngineerLogRarityTier = "mythic" | "rare" | "uncommon" | "common";

const MYTHIC_CEILING = 50;
const RARE_CEILING = 250;
const UNCOMMON_CEILING = 1_000;

/**
 * Bucket an unlock count into a rarity tier.
 *
 *   count ≤ 50    → mythic   ("Only N players have found this.")
 *   count ≤ 250   → rare     ("Only N players have found this.")
 *   count ≤ 1000  → uncommon ("N players have found this.")
 *   count > 1000  → common   (no badge — not a discovery anymore)
 *
 * Negative / zero counts are clamped to common (defensive — should
 * never happen in production but safer than throwing).
 */
export function rarityTierForCount(count: number): EngineerLogRarityTier {
  if (count <= 0) return "common";
  if (count <= MYTHIC_CEILING) return "mythic";
  if (count <= RARE_CEILING) return "rare";
  if (count <= UNCOMMON_CEILING) return "uncommon";
  return "common";
}

/**
 * Player-facing label per tier. Returns null for `common` (no badge
 * shown for the common tier, by design). Mythic and Rare both lead
 * with "Only" — the connotation matters.
 */
export function rarityLabelForCount(count: number): string | null {
  const tier = rarityTierForCount(count);
  if (tier === "common") return null;
  if (tier === "mythic") return `Only ${formatCount(count)} players have found this.`;
  if (tier === "rare") return `Only ${formatCount(count)} players have found this.`;
  return `${formatCount(count)} players have found this.`;
}

/** Format N with thousands separator. Pure helper. */
function formatCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  return Math.floor(n).toLocaleString("en-US");
}

/**
 * Compact short-form badge text — fits in a 60px-wide chip on a
 * card. Returns null for the common tier (no chip).
 */
export function rarityChipForCount(count: number): string | null {
  const tier = rarityTierForCount(count);
  if (tier === "common") return null;
  if (tier === "mythic") return "Mythic";
  if (tier === "rare") return "Rare";
  return "Uncommon";
}

// Exposed for tests.
export const _RARITY_BOUNDARIES_FOR_TEST = {
  MYTHIC_CEILING,
  RARE_CEILING,
  UNCOMMON_CEILING,
};
