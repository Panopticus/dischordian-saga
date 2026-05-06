/* ═══════════════════════════════════════════════════════
   PRESSURE → TRADE PRICE DRIFT — Civ-style economic feedback

   Plan §C4. The Living Universe pressure system feeds the
   narrative meter, but Trade Empire prices stay flat. This
   module computes per-good price modifiers from the current
   pressure state so the war map's tension actually moves the
   economy: a Terminus surge spikes fuel ore, a healing
   high-water mark drops medical alloys, etc.

   Pure data + helper. The Trade Empire UI/server can call
   computePriceModifiers(pressure) and apply the resulting
   multipliers to its base prices.
   ═══════════════════════════════════════════════════════ */

export type TradeGood =
  | "credits"
  | "fuelOre"
  | "organics"
  | "equipment"
  | "voidCrystals"
  | "salvage";

/** Pressure inputs the drift cares about. Subset of the full
 *  Living Universe pressure vector — only the dimensions that
 *  meaningfully move prices. */
export interface PressureSnapshot {
  deaths?: number;
  viralExposures?: number;
  truthRevealed?: number;
  healingDone?: number;
  exploration?: number;
  /** "lightEnergy" - "darkEnergy" — sign indicates galactic mood. */
  cycleNet?: number;
}

export interface PriceModifiers {
  /** multiplier applied to base price; 1.0 = no change, 1.2 = +20%. */
  fuelOre: number;
  organics: number;
  equipment: number;
  voidCrystals: number;
  salvage: number;
}

export const DEFAULT_PRICE_MODIFIERS: PriceModifiers = {
  fuelOre: 1,
  organics: 1,
  equipment: 1,
  voidCrystals: 1,
  salvage: 1,
};

/** Derive per-good multipliers from a pressure snapshot.
 *  Multipliers clamp to [0.5, 2.0] so a wild snapshot can't
 *  break the trade economy. */
export function computePriceModifiers(p: PressureSnapshot): PriceModifiers {
  const deaths = p.deaths ?? 0;
  const viral = p.viralExposures ?? 0;
  const truth = p.truthRevealed ?? 0;
  const healing = p.healingDone ?? 0;
  const explor = p.exploration ?? 0;
  const cycle = p.cycleNet ?? 0;

  // Fuel: war pressure (deaths + viral) drives demand up; high
  // exploration drives it down (long supply lines mean someone
  // is selling).
  const fuelOre = clamp(1 + 0.005 * deaths + 0.004 * viral - 0.002 * explor);

  // Organics: viral exposures spike (medical demand), healing
  // drops (excess supply).
  const organics = clamp(1 + 0.006 * viral - 0.003 * healing);

  // Equipment: deaths drive demand (replacement); truth revealed
  // softens it (less desperate market).
  const equipment = clamp(1 + 0.004 * deaths - 0.002 * truth);

  // Void crystals: cycleNet > 0 (light energy ascendant) deflates
  // demand for void-tier; cycleNet < 0 (dark) inflates.
  const voidCrystals = clamp(1 - 0.005 * cycle);

  // Salvage: deaths boost supply (war debris), exploration boosts
  // demand (frontier cargo).
  const salvage = clamp(1 + 0.004 * explor - 0.003 * deaths);

  return { fuelOre, organics, equipment, voidCrystals, salvage };
}

function clamp(x: number, lo = 0.5, hi = 2.0): number {
  if (x < lo) return lo;
  if (x > hi) return hi;
  return Math.round(x * 100) / 100;
}

/** Apply the modifiers to a base-price record, returning a
 *  parallel record with adjusted prices (rounded to whole
 *  units). Useful inside the Trade Empire price-fetch path. */
export function applyPriceModifiers(
  basePrices: Readonly<Record<TradeGood, number>>,
  modifiers: PriceModifiers,
): Record<TradeGood, number> {
  return {
    credits: basePrices.credits,
    fuelOre: Math.round(basePrices.fuelOre * modifiers.fuelOre),
    organics: Math.round(basePrices.organics * modifiers.organics),
    equipment: Math.round(basePrices.equipment * modifiers.equipment),
    voidCrystals: Math.round(basePrices.voidCrystals * modifiers.voidCrystals),
    salvage: Math.round(basePrices.salvage * modifiers.salvage),
  };
}
