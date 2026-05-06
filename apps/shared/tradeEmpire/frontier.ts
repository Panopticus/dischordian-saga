// apps/shared/tradeEmpire/frontier.ts
//
// Frontier rotation — Phase B of the Lore-Aligned Galactic-Empire
// Overhaul. At each season's interregnum, one independent sector is
// added to the rotating frontier (becomes more contested, threat +25)
// and one previously-frontier sector relaxes back. The rotation gives
// the galaxy a sense of borders shifting without requiring a full
// territory simulation.
//
// Pure helpers — the season tick driver consumes pickFrontierRotation
// at interregnum and posts the rotation as public knowledge.

/**
 * Sector ids canonically eligible to become contested frontier zones.
 * Phase B ships these as an explicit allowlist; Phase C may extend
 * via the full GALACTIC_MAP query.
 */
export const FRONTIER_CANDIDATES: ReadonlyArray<string> = [
  "free_port_alpha",
  "free_port_beta",
  "outer_rim_holdouts",
  "thaloria_marches",
  "drift_corridor_north",
  "drift_corridor_south",
  "old_panopticon_ruins",
  "broken_archive_world",
];

export interface FrontierRotation {
  /** Sector now opening (becoming contested / threat +). */
  opening: string;
  /** Sector now relaxing (returning to baseline). */
  relaxing: string | null;
}

/**
 * Compute the next frontier rotation. `lastOpened` is the previous
 * season's opening sector; it becomes this season's relaxing sector.
 *
 * RNG is injected for determinism in tests.
 */
export function pickFrontierRotation(
  lastOpened: string | null,
  rng: () => number = Math.random,
): FrontierRotation {
  // Filter out the lastOpened so we don't re-open the same sector.
  const eligible = FRONTIER_CANDIDATES.filter(s => s !== lastOpened);
  if (eligible.length === 0) {
    return { opening: FRONTIER_CANDIDATES[0], relaxing: lastOpened };
  }
  const opening = eligible[Math.floor(rng() * eligible.length)];
  return { opening, relaxing: lastOpened };
}

/** Validate frontier candidate list — used by tests. */
export function validateFrontierCandidates(): ReadonlyArray<string> {
  const errors: string[] = [];
  if (FRONTIER_CANDIDATES.length === 0) {
    errors.push("FRONTIER_CANDIDATES is empty");
  }
  const seen = new Set<string>();
  for (const s of FRONTIER_CANDIDATES) {
    if (seen.has(s)) errors.push(`duplicate frontier candidate: ${s}`);
    seen.add(s);
  }
  return errors;
}
