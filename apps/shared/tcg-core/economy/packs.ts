/**
 * Pack opening logic — pure, server-side RNG.
 *
 * Pack contents are generated via seeded RNG so:
 *   - The client NEVER controls what cards come out (anti-cheat)
 *   - The server can verify any contested pull
 *   - Test determinism: same seed + same registry = same cards
 *
 * Rarity distribution (per card slot):
 *   Common:    65%
 *   Uncommon:  20%
 *   Rare:      10%
 *   Epic:       4%
 *   Legendary:  1%
 *
 * Every 5th pack guarantees at least one Rare or better (pity timer).
 *
 * Duplicate protection: if a card would be a 4th+ copy, it converts
 * to soul stones automatically. (Conversion happens at the caller's
 * layer, not here — this function returns raw card ids.)
 */
import type { CardRegistry } from "../types/GameState";
import type { Rarity } from "../types/Card";
import { createRng, type Rng } from "../engine/rng";

export interface PackType {
  id: string;
  name: string;
  cardsPerPack: number;
  /** Cost in Dream Tokens. */
  cost: number;
}

export const STANDARD_PACK: PackType = {
  id: "standard_s1",
  name: "Season 1 Standard Pack",
  cardsPerPack: 5,
  cost: 100,
};

export interface PackResult {
  /** Card definition ids pulled. */
  cardDefIds: string[];
  /** Whether the pity timer triggered a guaranteed rare+. */
  pityTriggered: boolean;
}

const RARITY_THRESHOLDS: Array<{ rarity: Rarity; cumulative: number }> = [
  { rarity: "legendary", cumulative: 0.01 },
  { rarity: "epic", cumulative: 0.05 },
  { rarity: "rare", cumulative: 0.15 },
  { rarity: "uncommon", cumulative: 0.35 },
  { rarity: "common", cumulative: 1.0 },
];

/**
 * Open a pack. Pure function — uses seeded RNG.
 *
 * @param seed — unique seed for this pack opening (e.g. `pack_{userId}_{packCount}`)
 * @param registry — the card pool to pull from
 * @param packsSinceLastRare — number of packs opened without a Rare+
 *   (for pity timer; 0 = just opened a Rare)
 */
export function openPack(
  seed: string,
  registry: CardRegistry,
  packsSinceLastRare: number = 0,
  packType: PackType = STANDARD_PACK
): PackResult {
  const rng = createRng(seed);
  const allCards = registry.listAll();

  // Bucket cards by rarity.
  const byRarity = new Map<Rarity, string[]>();
  for (const card of allCards) {
    if (card.cardType === "general") continue; // generals aren't in packs
    if (card.rarity === "basic") continue; // tokens aren't in packs
    const bucket = byRarity.get(card.rarity) ?? [];
    bucket.push(card.id);
    byRarity.set(card.rarity, bucket);
  }

  const cardDefIds: string[] = [];
  let pityTriggered = false;
  const pityActive = packsSinceLastRare >= 4; // 5th pack = guaranteed rare+

  for (let i = 0; i < packType.cardsPerPack; i++) {
    let rarity: Rarity;
    if (pityActive && i === 0) {
      // Pity timer: first card of this pack is at least Rare.
      rarity = rollRarity(rng, "rare");
      pityTriggered = true;
    } else {
      rarity = rollRarity(rng);
    }
    const bucket = byRarity.get(rarity);
    if (!bucket || bucket.length === 0) {
      // Fallback to common if the rarity bucket is empty (small registry).
      const fallback = byRarity.get("common") ?? [];
      if (fallback.length > 0) {
        const idx = Math.floor(rng.next() * fallback.length);
        cardDefIds.push(fallback[idx]);
      }
    } else {
      const idx = Math.floor(rng.next() * bucket.length);
      cardDefIds.push(bucket[idx]);
    }
  }

  return { cardDefIds, pityTriggered };
}

function rollRarity(rng: Rng, minRarity?: Rarity): Rarity {
  const roll = rng.next();
  const thresholds = minRarity
    ? RARITY_THRESHOLDS.filter((t) => {
        const order: Rarity[] = ["legendary", "epic", "rare", "uncommon", "common"];
        return order.indexOf(t.rarity) <= order.indexOf(minRarity);
      })
    : RARITY_THRESHOLDS;

  // Re-normalize if we filtered.
  if (thresholds.length === 0) return "rare";
  const maxCum = thresholds[thresholds.length - 1].cumulative;
  const adjusted = roll * maxCum;

  for (const t of thresholds) {
    if (adjusted <= t.cumulative) return t.rarity;
  }
  return thresholds[thresholds.length - 1].rarity;
}

/**
 * Soul stone conversion values per rarity.
 * Craft cost / disenchant yield.
 */
export const SOUL_STONE_VALUES: Record<
  Rarity,
  { craft: number; disenchant: number }
> = {
  basic: { craft: 0, disenchant: 0 },
  common: { craft: 20, disenchant: 5 },
  uncommon: { craft: 40, disenchant: 10 },
  rare: { craft: 100, disenchant: 20 },
  epic: { craft: 400, disenchant: 100 },
  legendary: { craft: 1600, disenchant: 400 },
};
