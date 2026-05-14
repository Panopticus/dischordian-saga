/* ═══════════════════════════════════════════════════════
   THE CODA — CANONICAL REGISTRY

   Vex Solène's organization. Founded by her — or "recognized
   she had already founded" — somewhere in the 17,000 years
   between the Zenon transference and the saga's present
   (apps/shared/npcs/bibles/vex_solene.md:188).

   The Coda's mission, per `vex_solene.md:289-293`:
     "an assassins' guild whose public-facing contracts are
      real and whose internal mission is not. The Coda kills
      specific intelligences whose deaths reduce the
      probability of total war."

   The Coda's relationship to the Ocularum is canonized in
   `apps/shared/nonCoordinationPact.ts` — they are the saga's
   operational-scale fractal of the Logos cosmological split
   (apps/shared/logosCanon.ts). The two organizations share
   anti-Hierarchy doctrine but DO NOT COORDINATE.

   Operational name registry: "Coda" is never used in external
   communications (vex_solene.md:51). The internal vocabulary
   — Chair, Chorus, Maestro, Eyes (of Reality) — is musical
   metaphor; a coda is a musical resolution, the closing
   punctuation that ends a movement.
   ═══════════════════════════════════════════════════════ */

/** The four-node operational architecture. */
export type CodaNodeId =
  | "maestro"
  | "first_chair"
  | "second_chair"
  | "chorus";

/** Membership ladder (per vex_solene.md:11, 314). */
export type CodaMembershipTier =
  | "client" // lowest standing with Coda Central
  | "operative" // can access Second Chair guidance
  | "lieutenant" // slow intelligence-mission path
  | "inner_circle"; // deepest access; Coda-7 faction unlocks; First Chair may be offered

/**
 * One canonical node in the Coda's operational structure.
 */
export interface CodaNode {
  id: CodaNodeId;
  name: string;
  description: string;
  /** Current canonical occupant (if any). */
  occupant: string | null;
  /** Stable id for occupant (cross-cite handle). */
  occupantId: string | null;
  /** Citation. */
  loreSource: string;
  /** Canon notes for ambiguities or pending bindings. */
  canonNote?: string;
}

/**
 * The canonical four-node structure.
 *
 * Per vex_solene.md:294-304. Each node is canonically
 * distinct in function; none can substitute for another.
 */
export const CODA_NODES: readonly CodaNode[] = [
  {
    id: "maestro",
    name: "The Maestro",
    description:
      "The single decision-maker. Commissions all contracts; validates targets; " +
      "hides the Coda's true purpose (war-probability minimization through " +
      "targeted elimination) behind the public face of an unaffiliated " +
      "assassins' guild. Only reachable through encrypted dead-drop lines. " +
      "Never physically co-located with operatives. Public handle: 'The Eyes " +
      "of Reality' (a Coda-internal handle, exclusive to ~5 people in the " +
      "galaxy, per vex_solene.md:9).",
    occupant: "Vex Solène",
    occupantId: "entity_vex_solene",
    loreSource: "vex_solene.md:294-304",
  },
  {
    id: "first_chair",
    name: "The First Chair",
    description:
      "The Maestro's senior operative. Handles killings the Maestro does not " +
      "take personally. The seat exists 'already held out' as a player " +
      "recruitment option at inner_circle standing.",
    occupant: "Jericho Jones (Iron Lion) — plausible occupancy, per vex_solene.md:204-205",
    occupantId: "char_jericho_jones",
    loreSource: "vex_solene.md:294-304",
    canonNote:
      "Jericho Jones is canonically Iron Lion (Insurgency) AND Coda asset. " +
      "Whether he formally holds the First Chair or merely operates as a " +
      "senior asset is canon-pending. The Coda doctrine prefers ambiguity " +
      "here; the architect leaves the seat formally vacant until a player " +
      "reaching inner_circle accepts the offer.",
  },
  {
    id: "second_chair",
    name: "The Second Chair",
    description:
      "An LLM-response layer trained on recovered Engineer audio logs from " +
      "Vortex wreckage (vex_solene.md:190, 302). Not a person; sounds like " +
      "the Engineer. Provides text-only ethical guidance to operatives. " +
      "Built by Vex; described as 'the closest thing to a relationship " +
      "with the Engineer she will ever have.' Surfaces in the Trade " +
      "Empire mission catalog as the 'engineer_zero' agency.",
    occupant: "(LLM — not a person)",
    occupantId: null,
    loreSource: "vex_solene.md:190, 302; tradeMissionCatalog.ts:230-259",
  },
  {
    id: "chorus",
    name: "The Chorus",
    description:
      "Contracted operatives, procedurally generated for missions. Never " +
      "meet each other. Receive encrypted targets. No knowledge of the " +
      "Maestro or the Chairs. Most replaceable operatives; their ignorance " +
      "is the Maestro's protection. Surfaces in the Trade Empire mission " +
      "catalog as the 'coda_central' agency.",
    occupant: "(procedurally generated)",
    occupantId: null,
    loreSource: "vex_solene.md:304; tradeMissionCatalog.ts:90-145",
  },
] as const satisfies readonly CodaNode[];

/**
 * The Coda's canonical doctrine. Source of record for its
 * stated mission.
 */
export const CODA_DOCTRINE = {
  publicMission:
    "An unaffiliated assassins' guild whose contracts are real and whose " +
    "fees are professional.",
  internalMission:
    "Kill specific intelligences whose deaths reduce the probability of " +
    "total war. The Coda runs a probability-weighted war-risk model " +
    "invisible to clients; it refuses clients and substitutes targets " +
    "when the math demands it.",
  authorialSummary:
    "Per DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md:125: 'She is not a hitman, " +
    "or not just a hitman. She is running a shadow war against war itself.'",
  /**
   * The architect's reading of the Coda's relationship to
   * larger-scale resistance patterns.
   */
  metaframe:
    "The Coda is the operational-scale fractal of the Logos cosmological " +
    "split (apps/shared/logosCanon.ts:LOGOS_SPLIT_DOCTRINE). Vex's " +
    "Maestro-and-Chorus structure mirrors the Dreamer-half's emergent / " +
    "improvisational methodology. The Ocularum's Coordinator-and-cells " +
    "structure (apps/shared/ocularumCanon.ts) mirrors the Architect-half's " +
    "institutional methodology. Both organizations oppose the same enemy " +
    "(the Hierarchy's piece-positioning) via incompatible doctrines, and " +
    "have agreed — without explicit statement — to never coordinate " +
    "(apps/shared/nonCoordinationPact.ts).",
  loreSource: "vex_solene.md:289-293",
} as const;

/**
 * The Coda's three canonical mission tracks (per
 * vex_solene.md:306-310). Each track has different
 * operational signatures and different player-side hooks.
 */
export const CODA_MISSION_TRACKS = {
  assassination: {
    label: "Assassination Contracts (Coda-1 through Coda-5)",
    summary:
      "Probability-weighted war-risk nodes. Public-facing contracts that " +
      "are real and whose fees are paid; the internal target-selection is " +
      "the Coda's actual mission.",
    tradeMissionAgencyId: "vex_solene",
  },
  intelligence: {
    label: "Intelligence Missions",
    summary:
      "Information extraction for the Coda's predictive war-probability " +
      "model. The Chorus runs these; operatives do not know what model " +
      "their gathered intel feeds.",
    tradeMissionAgencyId: "coda_central",
  },
  diplomacy: {
    label: "Diplomacy Missions (Reconciliation Arcs)",
    summary:
      "Back-channel faction negotiations. The Coda funds and stages " +
      "diplomatic interventions that prevent specific war-risk inflections. " +
      "Surfaces in the Trade Empire mission catalog as 'A Seat at a Small " +
      "Table' and related missions.",
    tradeMissionAgencyId: "vex_solene",
  },
} as const;

/**
 * The Coda's canonical funding model. Per the Degen arc (PR-2's
 * the_degen Mystery Engine arc, apps/shared/episodeMysteries.ts):
 * the Degen has been quietly funding the Coda through camouflaged
 * brokerage commission-stream routing for ten years, framed as
 * 'the Degen's actual life's work.'
 */
export const CODA_FUNDING = {
  primaryFunder: "the_degen",
  funderId: "entity_the_degen",
  mechanism:
    "Camouflaged brokerage commission-stream routing. The Degen runs his " +
    "trusteeship for the Hierarchy (Mol'Vereth's contract — apps/shared/" +
    "hierarchyCanon.ts:262-274) and diverts a portion of the brokerage " +
    "fee into the Coda's operating budget. The Hierarchy's senior partners " +
    "(notably Ozhul'Vana — hierarchyCanon.ts:282-297) audit this diversion " +
    "annually. The audit has not yet caught it; whether the audit IS " +
    "catching it and choosing not to flag it is canon-pending (mirrors " +
    "the Mol'Vereth annual-audit dynamic in the_degen arc).",
  funderRecognitionState:
    "The Degen knows he is funding the Coda. Vex knows the Degen funds " +
    "the Coda. The Coda's operatives do not know who funds them. The " +
    "Hierarchy's senior partners audit but do not yet act. The pact " +
    "between funder and Maestro is its own quiet doctrine.",
  loreSource:
    "apps/shared/episodeMysteries.ts (the_degen arc E3 'The Coda's Books')",
} as const;

/**
 * Canon-pending notes — open questions about the Coda the
 * architect flags for future PRs / DLC.
 */
export const CODA_CANON_PENDING = [
  {
    id: "first_chair_formal_occupancy",
    summary:
      "Whether Jericho Jones canonically holds the First Chair or is a " +
      "senior asset operating in its function without title. The Coda's " +
      "doctrinal preference is ambiguity here; surfacing the seat as " +
      "formally vacant lets a player at inner_circle standing accept it.",
  },
  {
    id: "coda_size",
    summary:
      "The Coda's canonical size — how many Chorus operatives at any given " +
      "time. The Ocularum is canonically 700 cells (apps/shared/ocularumCanon.ts:" +
      "CANONICAL_OCULARUM_CELL_COUNT); the Coda is not numerically pinned. " +
      "The architect's lean: the Coda is intentionally smaller and more " +
      "fluid (Chorus operatives are procedurally generated and replaceable), " +
      "with a hard cap that even the Maestro does not exceed. PR-3D or DLC.",
  },
] as const;

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up a Coda node by stable id. */
export function getCodaNode(id: CodaNodeId): CodaNode {
  const node = CODA_NODES.find((n) => n.id === id);
  if (!node) {
    throw new Error(`Unknown Coda node id: ${id}`);
  }
  return node;
}

/** Returns the Coda's current Maestro entry. */
export function getCodaMaestro(): CodaNode {
  return getCodaNode("maestro");
}

/** Returns the canonical four-node count. */
export const CANONICAL_CODA_NODE_COUNT = 4;
