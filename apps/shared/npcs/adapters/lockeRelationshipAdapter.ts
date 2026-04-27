// apps/shared/npcs/adapters/lockeRelationshipAdapter.ts
//
// Locke trust adapter — wraps the existing lockeRelationship.ts trust
// (apps/client/src/game/lockeRelationship.ts) into the unified TrustState
// contract.
//
// Locke's trust is a 0-100 numeric value mapped to
// Prospect / Client / Partner / Insider / Adjudicated bands per
// registry.ts LOCKE_BANDS.

import { resolveTrustBand } from "../registry";
import type { NpcKey, TrustState } from "../types";

/**
 * Shape of the Locke relationship state this adapter consumes.
 * Caller (router or hook) fetches from the canonical store
 * (lockeRelationship.ts or its db equivalent).
 */
export interface LockeRelationshipReadRow {
  trust: number;
  /** Optional canonical flags: trade_coin_unlocked, exclusive_deal_signed, etc. */
  flags?: ReadonlyArray<string>;
  /** Optional last-interaction timestamp. */
  updatedAt?: Date | number;
}

const NPC_KEY: NpcKey = "adjudicator_locke";

/**
 * Convert a Locke relationship row to the unified TrustState shape.
 * Pure function; no DB access. Caller fetches the row separately.
 *
 * Note: registry.ts uses capitalized bands (Prospect / Client / ...);
 * lockeRelationship.ts uses lowercase tiers. We canonicalize on the
 * registry's casing.
 */
export function lockeRelationshipToTrustState(
  row: LockeRelationshipReadRow,
): TrustState {
  const trust = clampTrust(row.trust);
  const band = resolveTrustBand(NPC_KEY, trust);

  const flags = new Set<string>(row.flags ?? []);

  const lastInteractionAt =
    typeof row.updatedAt === "number"
      ? row.updatedAt
      : row.updatedAt instanceof Date
      ? row.updatedAt.getTime()
      : undefined;

  return {
    npcKey: NPC_KEY,
    trust,
    band,
    flags,
    // Locke does not have canonical reveal-stages; her "personality"
    // variants are surface-level (Mercantile / Predatory / Collegial /
    // Conspiratorial / Judicial) and select via personalityArchetypes
    // in NpcLine, not via revealStage.
    revealStage: undefined,
    lastInteractionAt,
  };
}

function clampTrust(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value);
}
