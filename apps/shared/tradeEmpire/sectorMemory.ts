// apps/shared/tradeEmpire/sectorMemory.ts
//
// §8.6 Sector Memory + Gossip Line. Pure helpers and registries
// that turn the public-knowledge feed into per-sector gossip,
// with decay, priority weights, and adjacency-based contamination.
//
// The runtime sits in apps/server/services/sectorMemoryService.ts;
// this file is the data-only side that the client + tests can also
// import.

/**
 * Canonical event kinds the gossip layer recognises. Mirrors the
 * server's PublicKnowledgeEventKind alias in
 * apps/server/services/publicKnowledgeService.ts; lives in shared
 * so client code (Court tab, Map tab bulletin board) can import
 * without reaching into apps/server.
 */
export type PublicKnowledgeEventKind =
  | "contract_signed"
  | "contract_breached"
  | "demand_paid"
  | "demand_refused"
  | "tribute_paid"
  | "cover_blown"
  | "agenda_step"
  | "season_declaration"
  | "sector_flipped"
  | "house_oath_sworn"
  | "house_oath_broken"
  | "anomaly_discovered"
  | "ruin_uncovered";

export interface GossipWeight {
  priorityWeight: number;
  decayHours: number;
}

/**
 * Per-event-kind gossip weights. Higher priorityWeight = travels
 * further; longer decayHours = stays gossip-relevant longer.
 *
 * Numbers picked from the §8.6 spec; designers can iterate. Tests
 * pin the keys (every PublicKnowledgeEventKind must be represented)
 * so a new event kind can't ship without explicit gossip weights.
 */
export const GOSSIP_WEIGHTS: Readonly<Record<PublicKnowledgeEventKind, GossipWeight>> = {
  contract_signed:        { priorityWeight: 1.0, decayHours: 168 },
  contract_breached:      { priorityWeight: 1.4, decayHours: 240 },
  demand_paid:            { priorityWeight: 0.7, decayHours: 96 },
  demand_refused:         { priorityWeight: 1.2, decayHours: 240 },
  tribute_paid:           { priorityWeight: 0.8, decayHours: 168 },
  cover_blown:            { priorityWeight: 1.4, decayHours: 336 },
  agenda_step:            { priorityWeight: 0.9, decayHours: 168 },
  season_declaration:     { priorityWeight: 1.6, decayHours: 720 },
  sector_flipped:         { priorityWeight: 1.5, decayHours: 480 },
  house_oath_sworn:       { priorityWeight: 1.3, decayHours: 480 },
  house_oath_broken:      { priorityWeight: 1.5, decayHours: 480 },
  anomaly_discovered:     { priorityWeight: 1.1, decayHours: 240 },
  ruin_uncovered:         { priorityWeight: 1.0, decayHours: 240 },
};

export const IMMEDIATE_NEIGHBOR_FACTOR = 0.6;
export const TWO_HOP_NEIGHBOR_FACTOR = 0.3;

/**
 * Coarse adjacency map between Trade Empire sector ids — used for
 * gossip contamination only. Not the canonical galactic map; just
 * a "what travels to where in conversation" approximation.
 *
 * Designers can extend; tests pin that no entry references an
 * unknown sector and that adjacency is symmetric.
 */
export const SECTOR_ADJACENCY: Readonly<Record<string, ReadonlyArray<string>>> = {
  trade_nexus:           ["new_babylon_core", "free_port_alpha", "the_trench"],
  new_babylon_core:      ["trade_nexus", "the_trench"],
  the_trench:            ["trade_nexus", "new_babylon_core", "antiquarian_archive"],
  antiquarian_archive:   ["the_trench", "degens_casino", "thaloria"],
  degens_casino:         ["antiquarian_archive", "thaloria"],
  thaloria:              ["antiquarian_archive", "degens_casino"],
  free_port_alpha:       ["trade_nexus", "free_port_beta", "frontier_worlds"],
  free_port_beta:        ["free_port_alpha", "frontier_worlds"],
  frontier_worlds:       ["free_port_alpha", "free_port_beta", "ark_debris_field"],
  ark_debris_field:      ["frontier_worlds", "panopticon_ruins"],
  panopticon_ruins:      ["ark_debris_field", "viral_wastes"],
  viral_wastes:          ["panopticon_ruins", "terminus_approach"],
  terminus_approach:     ["viral_wastes", "terminus_core"],
  terminus_core:         ["terminus_approach"],
  insurgency_haven:      ["frontier_worlds", "ark_debris_field"],
  hell_gate:             ["the_trench"],
  dreamer_barrier:       [], // sealed; gossip does not travel here
};

// Mirror reverse-edges so the registry is bidirectional.
const _adj = SECTOR_ADJACENCY as Record<string, string[]>;
for (const [a, neighbours] of Object.entries({ ...SECTOR_ADJACENCY })) {
  for (const b of neighbours) {
    if (!_adj[b]) _adj[b] = [];
    if (!_adj[b].includes(a)) _adj[b].push(a);
  }
}

export function adjacentSectors(sectorId: string): ReadonlyArray<string> {
  return SECTOR_ADJACENCY[sectorId] ?? [];
}

/**
 * Compute the contamination factor of an event posted in `originSector`
 * as it reaches `targetSector`. 1.0 if same sector; 0.6 if 1-hop
 * neighbour; 0.3 if 2-hop; 0 otherwise.
 */
export function contaminationFactor(
  originSector: string,
  targetSector: string,
): number {
  if (originSector === targetSector) return 1.0;
  const oneHop = adjacentSectors(originSector);
  if (oneHop.includes(targetSector)) return IMMEDIATE_NEIGHBOR_FACTOR;
  for (const hop of oneHop) {
    if (adjacentSectors(hop).includes(targetSector)) {
      return TWO_HOP_NEIGHBOR_FACTOR;
    }
  }
  return 0;
}

/**
 * Time-decay multiplier for an event aged `ageHours` against a
 * decayHours horizon. Linear ramp from 1.0 (new) to 0 (at horizon),
 * clamped to [0, 1]. After horizon: 0 (event drops out of gossip).
 */
export function timeDecayFactor(ageHours: number, decayHours: number): number {
  if (decayHours <= 0) return 0;
  return Math.max(0, Math.min(1, 1 - ageHours / decayHours));
}

export interface GossipScoreInput {
  eventKind: PublicKnowledgeEventKind;
  originSectorId: string | null;
  ageHours: number;
}

export function gossipScoreForSector(
  input: GossipScoreInput,
  targetSectorId: string,
): number {
  const w = GOSSIP_WEIGHTS[input.eventKind];
  if (!w) return 0;
  const origin = input.originSectorId ?? targetSectorId; // global events are everywhere
  const contamination = contaminationFactor(origin, targetSectorId);
  if (contamination === 0) return 0;
  const decay = timeDecayFactor(input.ageHours, w.decayHours);
  return w.priorityWeight * contamination * decay;
}

/** Validate the gossip registries — used by tests. */
export function validateGossipRegistries(): ReadonlyArray<string> {
  const errors: string[] = [];
  // Adjacency symmetry.
  for (const [a, neighbours] of Object.entries(SECTOR_ADJACENCY)) {
    for (const b of neighbours) {
      const back = SECTOR_ADJACENCY[b];
      if (!back) {
        errors.push(`adjacency: ${a} -> ${b} but ${b} has no entry`);
        continue;
      }
      if (!back.includes(a)) {
        errors.push(`adjacency not symmetric: ${a} -> ${b} but ${b} -/-> ${a}`);
      }
    }
  }
  return errors;
}
