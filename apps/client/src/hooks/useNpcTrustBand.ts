/* ═══════════════════════════════════════════════════════
   USE NPC TRUST BAND — consumer-facing trust-scalar hook

   Exposes the Mystery Engine's per-(user, npc) trust scalar
   to UI consumers so NPC dialog renderers can pick banded
   variants of authored prose.

   The five bands (Hostile / Wary / Witnessed / Present /
   Inheriting) are the canonical Wraith-bible pre-rite ladder
   per apps/shared/npcs/bibles/wraith_calder.md, generalised
   here for the engine. The same five-tuple shape mirrors
   Elara's stability bands and the Detective's light bands —
   a deliberate convergence so an NPC dialog author authoring
   a triplet for one axis can later author the same shape for
   a trust-band axis without rethinking the structure.

   Usage:

     const band = useNpcTrustBand("wraith_calder");
     // band → "hostile" | "wary" | "witnessed" | "present" |
     //         "inheriting" | null  (null while loading or
     //                              when the player has no
     //                              scalar yet)

     // Consumer authors banded prose:
     const line = banded[band ?? "witnessed"];

   The hook is a thin selector over `mysteries.getMyTrustScalars`
   — no extra network round-trips beyond the one query the
   TrustScalars panel already runs. Both consumers share the
   tRPC query cache.
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

/** Five canonical trust bands. Numeric thresholds match the
 *  TrustScalars panel's display labels — a single source of
 *  truth for the band membership function across the saga. */
export type NpcTrustBand =
  | "hostile"
  | "wary"
  | "witnessed"
  | "present"
  | "inheriting";

/** Pure scalar → band selector. Exported so service-side or
 *  test code can call it without dragging in React. */
export function npcTrustBandFor(scalar: number): NpcTrustBand {
  if (scalar < 20) return "hostile";
  if (scalar < 40) return "wary";
  if (scalar < 60) return "witnessed";
  if (scalar < 80) return "present";
  return "inheriting";
}

/** Read the current trust band for one NPC. Returns null when
 *  the query is loading or when the player has no scalar yet
 *  (the scalar is created on the first interrogation; before
 *  that, no band reading exists).
 *
 *  Consumers should fall back to the neutral midpoint
 *  (`"witnessed"`) when null — the dialog renderer should not
 *  block on a missing scalar.
 */
export function useNpcTrustBand(npcId: string): NpcTrustBand | null {
  const { isAuthenticated } = useAuth();
  const scalars = trpc.mysteries.getMyTrustScalars.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  if (!scalars.data) return null;
  const row = scalars.data.find((s) => s.npcId === npcId);
  if (!row) return null;
  return npcTrustBandFor(row.scalar);
}
