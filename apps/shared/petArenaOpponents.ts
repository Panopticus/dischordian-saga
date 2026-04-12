/* ═══════════════════════════════════════════════════════
   PET ARENA OPPONENTS — Matchmaker

   Server-authoritative opponent pool + builder. Replaces the
   old hard-coded "void_crawler at stage 2 bond 40" fallback.
   Each tier draws from a pool of flavored opponents, scales
   their stats to the player's pet, and adds a small
   bond/random component so matchups feel distinct.
   ═══════════════════════════════════════════════════════ */

export type ArenaTierId = "bronze_gauntlet" | "silver_circle" | "gold_coliseum";

export interface OpponentTemplate {
  petId: string;
  species: string;
  displayName: string;
  /** Flavor blurb shown on the matchup card. */
  flavor: string;
  /** Baseline bond (affects HP/attack via bondBonus). */
  baselineBond: number;
  /** Stat tilt — which stat the opponent emphasizes. */
  archetype: "bruiser" | "glass_cannon" | "tank" | "skirmisher";
}

export interface ArenaOpponent {
  petId: string;
  species: string;
  name: string;
  evolutionStage: 1 | 2 | 3;
  bond: number;
  /** Narrative blurb for the UI. */
  flavor: string;
  /** Which archetype the AI should favor (for move selection bias). */
  archetype: OpponentTemplate["archetype"];
}

/** Pool of opponents by tier. Each pool has at least 3 templates. */
export const ARENA_OPPONENT_POOLS: Record<ArenaTierId, OpponentTemplate[]> = {
  bronze_gauntlet: [
    {
      petId: "shadow_whelp", species: "void_crawler",
      displayName: "Shadow Whelp",
      flavor: "A half-formed specimen. Not yet sure why it fights.",
      baselineBond: 15, archetype: "glass_cannon",
    },
    {
      petId: "scrap_hound", species: "gilt_beetle",
      displayName: "Scrap Hound",
      flavor: "Cobbled together from cargo-bay debris. Still growing.",
      baselineBond: 20, archetype: "tank",
    },
    {
      petId: "ember_sprite", species: "flicker_imp",
      displayName: "Ember Sprite",
      flavor: "Burns bright, burns fast. The handler bets against every match.",
      baselineBond: 25, archetype: "skirmisher",
    },
    {
      petId: "husk_serpent", species: "data_serpent",
      displayName: "Husk Serpent",
      flavor: "A decommissioned training dummy with just enough code to bite.",
      baselineBond: 18, archetype: "bruiser",
    },
  ],
  silver_circle: [
    {
      petId: "veteran_crawler", species: "void_crawler",
      displayName: "Veteran Crawler",
      flavor: "Bronze champion three seasons running. Scarred and tired.",
      baselineBond: 45, archetype: "bruiser",
    },
    {
      petId: "spore_lieutenant", species: "spore_fungus",
      displayName: "Spore Lieutenant",
      flavor: "Fungal command node. Regrows faster than you can cut it down.",
      baselineBond: 50, archetype: "tank",
    },
    {
      petId: "quicksilver_fox", species: "holographic_fox",
      displayName: "Quicksilver",
      flavor: "Holographic champion of the Silver Circle. Lux eyes it warily.",
      baselineBond: 55, archetype: "skirmisher",
    },
    {
      petId: "echo_warden", species: "temporal_kitten",
      displayName: "Warden of Echoes",
      flavor: "A temporal kitten that has already seen the outcome of this fight.",
      baselineBond: 50, archetype: "glass_cannon",
    },
  ],
  gold_coliseum: [
    {
      petId: "ascended_crawler", species: "void_crawler",
      displayName: "Ascended Maw",
      flavor: "The first specimen to cross into gold. Its handler no longer attends.",
      baselineBond: 80, archetype: "bruiser",
    },
    {
      petId: "glyph_prophet", species: "glyph_moth",
      displayName: "Glyph Prophet",
      flavor: "Wings trace futures in light. It has never taken a hit it did not choose to take.",
      baselineBond: 85, archetype: "glass_cannon",
    },
    {
      petId: "mirror_cipher", species: "data_serpent",
      displayName: "Mirror Cipher",
      flavor: "Cipher's reflection from a timeline where you never met.",
      baselineBond: 90, archetype: "bruiser",
    },
    {
      petId: "singularity_kitten", species: "temporal_kitten",
      displayName: "Singularity",
      flavor: "An Echo that outlasted the Antiquarian's memory. It does not need to fight to win.",
      baselineBond: 88, archetype: "tank",
    },
  ],
};

export interface TierConfig {
  id: ArenaTierId;
  minEvolution: 1 | 2 | 3;
  /** Stat floor expressed as a multiplier of the player pet's current stats. */
  statFloor: number;
  /** Stat ceiling (player pet × ceiling). */
  statCeiling: number;
}

export const ARENA_TIER_CONFIGS: TierConfig[] = [
  { id: "bronze_gauntlet", minEvolution: 1, statFloor: 0.85, statCeiling: 1.05 },
  { id: "silver_circle",   minEvolution: 2, statFloor: 1.00, statCeiling: 1.25 },
  { id: "gold_coliseum",   minEvolution: 3, statFloor: 1.15, statCeiling: 1.45 },
];

export function getArenaTierDef(id: string): TierConfig | undefined {
  return ARENA_TIER_CONFIGS.find((t) => t.id === id);
}

/**
 * Pure, deterministic-if-seeded opponent builder. Given the player's
 * pet bond/stage and a tier, picks a template from the pool (by
 * modulo so it's easy to step through), then scales bond + stage
 * to fall within the tier's floor/ceiling band.
 */
export function buildOpponent(
  tierId: ArenaTierId,
  playerPet: { evolutionStage: 1 | 2 | 3; bond: number },
  opts: { seed?: number } = {},
): ArenaOpponent {
  const pool = ARENA_OPPONENT_POOLS[tierId] ?? ARENA_OPPONENT_POOLS.bronze_gauntlet;
  const cfg = getArenaTierDef(tierId) ?? ARENA_TIER_CONFIGS[0];

  const seed = opts.seed ?? Math.floor(Math.random() * 1e9);
  const template = pool[seed % pool.length];

  // Scale bond into the tier band relative to the player pet.
  const band = cfg.statFloor + ((seed % 100) / 100) * (cfg.statCeiling - cfg.statFloor);
  const targetBond = Math.round(Math.min(100, Math.max(1, playerPet.bond * band)));
  const scaledBond = Math.max(template.baselineBond, targetBond);

  return {
    petId: `${template.petId}_${seed % 10000}`,
    species: template.species,
    name: template.displayName,
    evolutionStage: cfg.minEvolution,
    bond: scaledBond,
    flavor: template.flavor,
    archetype: template.archetype,
  };
}
