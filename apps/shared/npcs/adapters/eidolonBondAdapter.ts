// apps/shared/npcs/adapters/eidolonBondAdapter.ts
//
// Eidolon trust adapter — wraps the existing eidolonBonds.bond store
// (apps/db/schema.ts:2938) into the unified TrustState contract.
//
// The Eidolon's bond is a 0-100 numeric value mapped to Untuned / Tuning /
// Resonant / Inseparable bands per registry.ts EIDOLON_BANDS.

import { resolveTrustBand } from "../registry";
import type { NpcKey, TrustState } from "../types";

/**
 * Shape of the underlying eidolonBonds row this adapter consumes.
 * Subset of apps/db/schema.ts:eidolonBonds — only fields needed for
 * unified trust state mapping.
 */
export interface EidolonBondReadRow {
  bond: number;
  /** Optional stage override; if absent, derived from bond. */
  stage?: "fragment" | "companion" | "ascended" | "spectral";
  /** Optional resonance flag — mapped to a per-NPC narrative flag. */
  isResonant?: boolean;
  /** Optional soul-bound flag — mapped to a per-NPC narrative flag. */
  isSoulBound?: boolean;
  /** Optional last-interaction timestamp. */
  updatedAt?: Date | number;
}

const NPC_KEY: NpcKey = "your_eidolon";

/**
 * Convert an eidolonBonds row to the unified TrustState shape.
 * Pure function; no DB access. Caller fetches the row separately.
 */
export function eidolonBondToTrustState(row: EidolonBondReadRow): TrustState {
  const trust = clampTrust(row.bond);
  const band = resolveTrustBand(NPC_KEY, trust);

  const flags = new Set<string>();
  if (row.isResonant) flags.add("eidolon_resonant");
  if (row.isSoulBound) flags.add("eidolon_soul_bound");
  if (row.stage) flags.add(`eidolon_stage_${row.stage}`);

  // Reveal-stage: Eidolon doesn't have canonical reveal-stages in its bible
  // (it's a non-verbal companion; expression-channels gate content instead).
  // We pass the stage enum through anyway in case future content keys on it.
  const revealStage = row.stage;

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
    revealStage,
    lastInteractionAt,
  };
}

function clampTrust(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value);
}
