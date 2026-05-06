// apps/shared/tradeEmpire/convergenceClimax.ts
//
// Convergence climax — Phase D.5 of the Lore-Aligned Galactic-
// Empire Overhaul. Pure helpers for the doom-clock + 3-bad-options
// resolution narrative.

import type { SubHouseKey } from "./houses";

/** Real-time window the climax stays open before auto-resolution. */
export const CLIMAX_WINDOW_MS = 72 * 60 * 60 * 1000;

/** Convergence threshold at which the climax window opens. */
export const CLIMAX_THRESHOLD = 100;

export type ClimaxPhase = "dormant" | "open" | "resolved";

export interface ClimaxResolution {
  resolutionKey: string;
  label: string;
  loreContext: string;
  /** Sub-house rep deltas applied on this resolution. */
  subHouseDeltas: ReadonlyArray<{ houseKey: SubHouseKey; delta: number }>;
  /** Whether this resolution sets the global Convergence back to 0. */
  resetsConvergence: boolean;
}

/**
 * The 3 bad options. Each costs something irrevocable; none is the
 * "good" choice. Authoring lives here so Phase D.5 ships content
 * complete; future seasons may add alternates.
 */
export const CLIMAX_RESOLUTIONS: ReadonlyArray<ClimaxResolution> = [
  {
    resolutionKey: "climax.sacrifice_a_sector",
    label: "Sacrifice a Sector",
    loreContext:
      "Trade an active sector for stability. The Authority files the loss as a settlement. Civic Engineers grieve. The Wraith Hierophant adds a name to his recovery list.",
    subHouseDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: 10 },
      { houseKey: "nb_civic_engineers", delta: -25 },
      { houseKey: "thaloria_council", delta: 8 },
    ],
    resetsConvergence: true,
  },
  {
    resolutionKey: "climax.publish_the_records",
    label: "Publish the Records",
    loreContext:
      "Open the entire Authority Ledger to the public. The Hierophant's revival publishes the citations within hours. Drael'Mon files the player as 'breach risk'.",
    subHouseDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: -25 },
      { houseKey: "antiquarian_shelfmates", delta: 12 },
      { houseKey: "thaloria_council", delta: 10 },
      { houseKey: "hierarchy_acquisitions", delta: -10 },
    ],
    resetsConvergence: true,
  },
  {
    resolutionKey: "climax.broker_a_truce",
    label: "Broker an Impossible Truce",
    loreContext:
      "Personally broker a truce between New Babylon and the Wraith Hierophant. The cost is absorbed by your House's standing across every faction.",
    subHouseDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: -8 },
      { houseKey: "thaloria_council", delta: -8 },
      { houseKey: "hierarchy_severance", delta: -8 },
      { houseKey: "antiquarian_shelfmates", delta: -8 },
    ],
    resetsConvergence: true,
  },
];

export function getClimaxResolution(key: string): ClimaxResolution | undefined {
  return CLIMAX_RESOLUTIONS.find(r => r.resolutionKey === key);
}

/** Pure: should the climax open at this convergence value? */
export function shouldOpenClimax(convergence: number, phase: ClimaxPhase): boolean {
  return phase === "dormant" && convergence >= CLIMAX_THRESHOLD;
}

/** Pure: should the climax auto-resolve given the current wall clock? */
export function shouldAutoResolve(args: {
  phase: ClimaxPhase;
  closesAtMs: number | null;
  now: number;
}): boolean {
  if (args.phase !== "open") return false;
  if (args.closesAtMs === null) return false;
  return args.now >= args.closesAtMs;
}
