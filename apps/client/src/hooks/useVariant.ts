/* ═══════════════════════════════════════════════════════
   useVariant — runtime consumer for VARIANT_REGISTRY

   audit/10.F1 + 10.F2. The morality / trust / act variant
   resolver in apps/shared/moralityTrustActVariants.ts has
   been authored but had no runtime caller — the entire
   registry was inert beyond DevVariantsPage. This hook
   wraps `resolveVariant` and reads the gating state from
   GameContext, returning the best-matching authored variant
   (or null when nothing matches; callers fall back to the
   default line).

   Surfaces wired:
     - room (e.g. comms-relay, bridge, cabin)
     - transmission
     - npc_line (per-companion / per-npc dialog lines)
     - journal
     - wheel_followup

   The returned variant is memoised by (surface, targetId,
   moralityScore, narrativeAct, trust-band-by-companion, flag-
   set hash) so that consumers do not pay the registry-scan
   cost on unrelated re-renders.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  VARIANT_REGISTRY,
  resolveVariant,
  bandForTrust,
  bandForMorality,
  type MoralityTrustActVariant,
  type VariantResolutionInput,
} from "@shared/moralityTrustActVariants";

/**
 * Minimal subset of GameState the resolver needs. Kept narrow
 * so tests can construct stub state without instantiating the
 * full GameProvider tree.
 */
export interface VariantInputSourceState {
  moralityScore?: number;
  narrativeAct?: number;
  elaraTrustLevel?: number;
  elaraTrust?: number;
  humanTrustLevel?: number;
  humanTrust?: number;
  companionRelationships?: Readonly<Record<string, number>>;
  narrativeFlags?: Readonly<Record<string, boolean>>;
}

/**
 * Build the resolver input from a state snapshot. Pure;
 * exported for testing.
 *
 * `trustByCompanion` exposes both per-narrator bond fields
 * (elara, human) and the legacy companionRelationships map
 * (locke, kael, nythera, advocate, etc.). Variant authors
 * reference whichever id matches the surface.
 */
export function buildVariantInput(
  state: VariantInputSourceState,
): VariantResolutionInput {
  const trustByCompanion: Record<string, number> = {
    elara: state.elaraTrustLevel ?? state.elaraTrust ?? 0,
    human: state.humanTrustLevel ?? state.humanTrust ?? 0,
    ...(state.companionRelationships ?? {}),
  };
  const flags = new Set<string>();
  for (const [k, v] of Object.entries(state.narrativeFlags ?? {})) {
    if (v === true) flags.add(k);
  }
  return {
    moralityScore: state.moralityScore ?? 0,
    narrativeAct: state.narrativeAct ?? 0,
    trustByCompanion,
    flags,
  };
}

/**
 * Coarse signature of an input so memoisation is stable
 * across re-renders. Trust is bucketed (the resolver only
 * cares about bands, not raw values) so a 1-point trust
 * tick does not invalidate the cache. Pure; exported for
 * testing.
 */
export function variantInputSignature(input: VariantResolutionInput): string {
  const moralityBand = bandForMorality(input.moralityScore);
  const trustParts: string[] = [];
  for (const [id, t] of Object.entries(input.trustByCompanion).sort()) {
    trustParts.push(`${id}:${bandForTrust(t)}`);
  }
  const flagParts: string[] = [];
  for (const f of Array.from(input.flags).sort()) flagParts.push(f);
  return [
    `m:${moralityBand}`,
    `a:${input.narrativeAct}`,
    `t:${trustParts.join(",")}`,
    `f:${flagParts.join(",")}`,
  ].join("|");
}

/**
 * Resolve a single variant for the given surface + targetId.
 * Returns null when nothing matches; callers fall back to
 * the surface's default authored line.
 */
export function useVariant(
  surface: MoralityTrustActVariant["surface"],
  targetId?: string,
  registry: readonly MoralityTrustActVariant[] = VARIANT_REGISTRY,
): MoralityTrustActVariant | null {
  const { state } = useGame();
  const input = useMemo(() => buildVariantInput(state), [state]);
  const sig = useMemo(() => variantInputSignature(input), [input]);

  return useMemo(
    () => resolveVariant(registry, surface, targetId, input),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [registry, surface, targetId, sig],
  );
}

/**
 * Convenience: same as useVariant but returns the rendered
 * text directly (or `fallback` when no variant matches).
 * Lets callsites stay one-liners.
 */
export function useVariantText(
  surface: MoralityTrustActVariant["surface"],
  targetId: string | undefined,
  fallback: string,
): string {
  const v = useVariant(surface, targetId);
  return v ? v.text : fallback;
}
