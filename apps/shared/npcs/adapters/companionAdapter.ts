// apps/shared/npcs/adapters/companionAdapter.ts
//
// Elara + Human trust adapter — wraps the existing CompanionStats numeric
// stability (Elara) and light (Human) values into the unified TrustState
// contract.
//
// Both values use the same 0-100 mapping per registry.ts COMPANION_BANDS:
//   fragmented (0-29) / lucid (30-69) / luminous (70-100)
//
// Bible-canonical correspondence:
//   - Elara stability: fragmented / lucid / luminous (per companion.ts)
//   - Human light:     shadow     / balanced / warm     (per companion.ts)
//
// We canonicalize on the registry's band names; the legacy Human band names
// (shadow / balanced / warm) are surfaced as flags for back-compat selectors
// that key on them.

import { resolveTrustBand } from "../registry";
import type { NpcKey, TrustState } from "../types";

export interface CompanionReadRow {
  /** -100..+100 per legacy companion.ts; we normalize to 0..100. */
  value: number;
  flags?: ReadonlyArray<string>;
  updatedAt?: Date | number;
}

/**
 * Convert Elara's stability value to TrustState.
 */
export function elaraStabilityToTrustState(row: CompanionReadRow): TrustState {
  return companionToTrustState("elara", row, "elara_stability");
}

/**
 * Convert Human's light value to TrustState.
 */
export function humanLightToTrustState(row: CompanionReadRow): TrustState {
  const state = companionToTrustState("the_human", row, "human_light");
  // Surface legacy Human band names as flags for back-compat selectors.
  const flags = new Set(state.flags);
  if (state.band === "fragmented") flags.add("human_band_shadow");
  if (state.band === "lucid") flags.add("human_band_balanced");
  if (state.band === "luminous") flags.add("human_band_warm");
  return { ...state, flags };
}

function companionToTrustState(
  npcKey: NpcKey,
  row: CompanionReadRow,
  metricFlagPrefix: string,
): TrustState {
  // Legacy companion stats are -100..+100. Normalize to 0..100.
  const trust = normalizeBipolarToTrust(row.value);
  const band = resolveTrustBand(npcKey, trust);

  const flags = new Set<string>(row.flags ?? []);
  flags.add(`${metricFlagPrefix}_${band}`);

  const lastInteractionAt =
    typeof row.updatedAt === "number"
      ? row.updatedAt
      : row.updatedAt instanceof Date
      ? row.updatedAt.getTime()
      : undefined;

  return {
    npcKey,
    trust,
    band,
    flags,
    revealStage: undefined,
    lastInteractionAt,
  };
}

function normalizeBipolarToTrust(value: number): number {
  if (!Number.isFinite(value)) return 50;
  // -100 → 0; 0 → 50; +100 → 100
  const normalized = (value + 100) / 2;
  if (normalized < 0) return 0;
  if (normalized > 100) return 100;
  return Math.round(normalized);
}
