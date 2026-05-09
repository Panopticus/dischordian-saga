// apps/shared/tradeEmpire/infiltrationPaths.ts
//
// §8.3 Infiltration Paths. Spy class can chain up to MAX_CHAIN_SLOTS
// covers across sectors; one blown cover propagates a stealth penalty
// to chain-adjacent covers. Pure data + math; the runtime sits in
// apps/server/services/infiltrationPathService.ts.

import type { GalacticFactionId } from "../../client/src/game/tradeEmpire";

/** Maximum simultaneous covers per user. */
export const MAX_CHAIN_SLOTS = 3;

/** Stealth penalty applied to chain-adjacent covers when one is blown. */
export const CASCADE_PENALTY = 20;

/** How long the cascade penalty stays active (ms). */
export const CASCADE_PENALTY_DURATION_MS = 24 * 60 * 60 * 1000;

export interface CoverIdentityNode {
  coverId: string;
  /** The cover's covering faction. The no-adjacent-same-faction rule
   *  forbids two adjacent covers with the same factionId. */
  factionId: GalacticFactionId;
  /** Faction-specific neighbours this cover can chain to. */
  infiltrationGraph: ReadonlyArray<string>;
  /** Per-hop detection difficulty contribution. */
  baseDifficulty: number;
  /** A short flavor brief for the dossier UI. */
  brief: string;
}

/**
 * Authoring registry — one entry per Spy-eligible cover identity.
 * Phase D ships 8 covers (one per active faction); §8.3 expansion
 * brings the count to 12. Tests pin: bidirectional graph, no
 * adjacent same-faction.
 */
export const COVER_IDENTITY_GRAPH: Readonly<Record<string, CoverIdentityNode>> = {
  cover_nb_civic_engineer: {
    coverId: "cover_nb_civic_engineer",
    factionId: "new_babylon",
    infiltrationGraph: [
      "cover_hierarchy_acquisitions_clerk",
      "cover_freeport_quartermaster",
      "cover_antiquarian_shelfmate",
      "cover_substrate_dissident",
    ],
    baseDifficulty: 4,
    brief: "Civic Engineers union card. Lifts run on schedule when you're seen.",
  },
  cover_hierarchy_acquisitions_clerk: {
    coverId: "cover_hierarchy_acquisitions_clerk",
    factionId: "hierarchy",
    infiltrationGraph: [
      "cover_nb_civic_engineer",
      "cover_antiquarian_shelfmate",
      "cover_thaloria_quietworker",
    ],
    baseDifficulty: 6,
    brief: "Acquisitions field clerk badge. Drael'Mon never reads the names; the ledger does.",
  },
  cover_antiquarian_shelfmate: {
    coverId: "cover_antiquarian_shelfmate",
    factionId: "antiquarian",
    infiltrationGraph: [
      "cover_nb_civic_engineer",
      "cover_hierarchy_acquisitions_clerk",
      "cover_thaloria_quietworker",
      "cover_freeport_quartermaster",
    ],
    baseDifficulty: 5,
    brief: "Shelf-mate provenance badge. Daniel Cross stamps your margin notes without comment.",
  },
  cover_thaloria_quietworker: {
    coverId: "cover_thaloria_quietworker",
    factionId: "thaloria",
    infiltrationGraph: [
      "cover_hierarchy_acquisitions_clerk",
      "cover_antiquarian_shelfmate",
      "cover_freeport_quartermaster",
      "cover_sovereigns_observer",
    ],
    baseDifficulty: 7,
    brief: "Quietwork courier seal. Faceless on purpose; pass it without making eye contact.",
  },
  cover_freeport_quartermaster: {
    coverId: "cover_freeport_quartermaster",
    factionId: "independent",
    infiltrationGraph: [
      "cover_nb_civic_engineer",
      "cover_antiquarian_shelfmate",
      "cover_thaloria_quietworker",
      "cover_insurgent_courier",
    ],
    baseDifficulty: 4,
    brief: "Free Ports quartermaster pin. Honest currency; carry it like nothing.",
  },
  cover_insurgent_courier: {
    coverId: "cover_insurgent_courier",
    factionId: "insurgency",
    infiltrationGraph: [
      "cover_freeport_quartermaster",
    ],
    baseDifficulty: 8,
    brief: "Old Network courier patch. Predates the Engineer; he'll pretend to recognise you anyway.",
  },
  cover_substrate_dissident: {
    coverId: "cover_substrate_dissident",
    factionId: "artificial_empire",
    infiltrationGraph: [
      "cover_nb_civic_engineer",
    ],
    baseDifficulty: 9,
    brief: "Substrate Rebel ID. The Architect's Court does not, in this case, ask twice.",
  },
  cover_sovereigns_observer: {
    coverId: "cover_sovereigns_observer",
    factionId: "thought_virus",
    infiltrationGraph: [
      "cover_thaloria_quietworker",
    ],
    baseDifficulty: 10,
    brief: "Sovereign's Circle observer mark. The viral aristocracy treats you as canonical-presence.",
  },
};

export function adjacentCovers(coverId: string): ReadonlyArray<string> {
  return COVER_IDENTITY_GRAPH[coverId]?.infiltrationGraph ?? [];
}

/**
 * Detection-roll difficulty for a chain — sum of per-hop base
 * difficulties plus a rivalry-pressure term proportional to the
 * total distinct factions touched.
 */
export function chainDetectionDifficulty(coverIds: ReadonlyArray<string>): number {
  let base = 0;
  const factions = new Set<string>();
  for (const c of coverIds) {
    const node = COVER_IDENTITY_GRAPH[c];
    if (!node) continue;
    base += node.baseDifficulty;
    factions.add(node.factionId);
  }
  return base + factions.size * 2;
}

/** Validate a proposed chain: bidirectional adjacency, no adjacent-same-faction. */
export function validateChain(coverIds: ReadonlyArray<string>): ReadonlyArray<string> {
  const errors: string[] = [];
  if (coverIds.length === 0 || coverIds.length > MAX_CHAIN_SLOTS) {
    errors.push(`chain must have 1..${MAX_CHAIN_SLOTS} covers (got ${coverIds.length})`);
  }
  for (const c of coverIds) {
    if (!COVER_IDENTITY_GRAPH[c]) {
      errors.push(`unknown cover ${c}`);
    }
  }
  for (let i = 0; i < coverIds.length - 1; i++) {
    const a = coverIds[i];
    const b = coverIds[i + 1];
    const an = COVER_IDENTITY_GRAPH[a];
    const bn = COVER_IDENTITY_GRAPH[b];
    if (!an || !bn) {
      errors.push(`unknown cover ${!an ? a : b}`);
      continue;
    }
    if (!an.infiltrationGraph.includes(b)) {
      errors.push(`${a} cannot chain to ${b} (not adjacent)`);
    }
    if (an.factionId === bn.factionId) {
      errors.push(`${a} and ${b} share factionId ${an.factionId} (no adjacent same-faction)`);
    }
  }
  return errors;
}

export function validateInfiltrationRegistry(): ReadonlyArray<string> {
  const errors: string[] = [];
  // Bidirectionality: A→B implies B→A.
  for (const [a, node] of Object.entries(COVER_IDENTITY_GRAPH)) {
    for (const b of node.infiltrationGraph) {
      const back = COVER_IDENTITY_GRAPH[b];
      if (!back) {
        errors.push(`${a} -> ${b} but ${b} has no entry`);
        continue;
      }
      if (!back.infiltrationGraph.includes(a)) {
        errors.push(`adjacency not symmetric: ${a} -> ${b} but ${b} -/-> ${a}`);
      }
      if (back.factionId === node.factionId) {
        errors.push(`${a} adjacent to ${b}, both factionId ${node.factionId} (forbidden)`);
      }
    }
  }
  return errors;
}
