/* ═══════════════════════════════════════════════════════
   GOVERNANCE FRONT BINDINGS — voteId → Reality Front sectors.

   Every vote affects symbolic regions of the Reality Front map.
   This registry maps a voteId to the set of sector ids the vote
   is allowed to touch and the per-option control delta applied
   when the vote closes (or, for the live preview, the direction
   each option pushes the affected sectors).

   For slice 3, the map is rendered client-side from a fixed seed
   of symbolic sectors; the bindings let the renderer tint the
   right sectors when an option leads. A future slice promotes
   this to a binding against the real `warTerritories` table so
   the Reality Front meter aggregates server-truth control.
   ═══════════════════════════════════════════════════════ */

import { VOTE_ZERO_ID } from "./governanceConsequences";

/** Bumped when the binding shape changes in a way that would
 *  affect how the renderer interprets stored entries. */
export const FRONT_BINDINGS_VERSION = 1;

/** Symbolic sector ids — string keys, not numeric. The renderer
 *  spreads these over a golden-angle spiral; the ordering here
 *  is the canonical layout. */
export const REALITY_FRONT_SECTOR_IDS = [
  "spire-of-eyes",
  "open-archive",
  "the-clock-tower",
  "broken-quill",
  "lions-club",
  "old-storyteller",
  "antiquarian-vault",
  "logos-cradle",
  "watchers-bridge",
  "dreamer-quay",
  "consensus-forge",
  "shadow-tongue",
] as const;

export type RealityFrontSectorId = (typeof REALITY_FRONT_SECTOR_IDS)[number];

/** Per-option binding row. `controlDelta` is a signed scalar:
 *   positive = sector leans Order (Confirm) when this option wins
 *   negative = sector leans Dream (Look-Away) when this option wins
 *  Magnitudes typically 5..20. */
export interface OptionBinding {
  affectedSectors: ReadonlyArray<RealityFrontSectorId>;
  controlDelta: number;
}

export interface VoteFrontBinding {
  /** Per-option bindings, keyed by 1-based optionNumber. */
  options: Readonly<Record<number, OptionBinding>>;
}

/* ─── REGISTRY ─── */

const BINDINGS: Readonly<Record<string, VoteFrontBinding>> = Object.freeze({
  [VOTE_ZERO_ID]: {
    options: {
      // CONFIRM — strengthens the spires and the panopticon.
      1: {
        affectedSectors: ["spire-of-eyes", "watchers-bridge", "the-clock-tower"],
        controlDelta: 18,
      },
      // LOOK AWAY — opens the archive and strengthens the Dream side.
      2: {
        affectedSectors: ["open-archive", "shadow-tongue", "dreamer-quay"],
        controlDelta: -18,
      },
    },
  },
});

export function getFrontBinding(voteId: string): VoteFrontBinding | null {
  return BINDINGS[voteId] ?? null;
}

export function getOptionBinding(
  voteId: string,
  optionNumber: number,
): OptionBinding | null {
  return BINDINGS[voteId]?.options[optionNumber] ?? null;
}

export function listBoundVoteIds(): readonly string[] {
  return Object.keys(BINDINGS);
}

/** Internal: exposed only for tests. */
export const __INTERNAL_BINDINGS = BINDINGS;
