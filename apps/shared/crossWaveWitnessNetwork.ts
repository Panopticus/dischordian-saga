/* ═══════════════════════════════════════════════════════
   THE CROSS-WAVE WITNESS NETWORK — build-plan §VIII Phase C
   (C7 surface, authored as NEW canon)

   The build plan named a "Cross-Wave Witness Network" with
   no canon anywhere. Per the dreamer reframe (2026-05-15):
   it is a CURRENT-LOOP surface (NOT a Servant Hero Academy
   surface). It is the Two-Witnesses doctrine made
   multiplayer.

   The Two Witnesses (the Programmer-Antiquarian, encoded;
   the Enigma, transmitted) carried the saga's continuity
   THROUGH bodies — apps/shared/identityCollisionCanon.ts:
   257-258. The signature-transfer mechanic is canonically
   shipped: decoding Fragment V transfers the player's
   signature into the Antiquarian's Tome so "the next
   reader will read your signature; the continuity is
   transferred" (apps/shared/twoWitnessesDecode.ts:126-142).

   The Cross-Wave Witness Network formalizes that mechanic
   across the prestige loop: every closed run's chronicle
   inscription (post_run:<userId>:<prestigeTier>:<stanceFlag>
   and dischordia:<userId>:<prestigeTier> — see
   apps/server/services/postRunInscriptionsService.ts:46-50)
   is a witness another wave can read. Players across cycles
   cross-witness each other's Volumes. No run is written
   alone.
   ═══════════════════════════════════════════════════════ */

/** Scope guard — the Cross-Wave Witness Network is a
 *  CURRENT-LOOP surface, never a Servant Hero (future
 *  season) surface. The parity gate asserts this. */
export const CROSS_WAVE_WITNESS_SCOPE = "current_loop_surface" as const;

export interface CrossWaveWitnessCanon {
  /** The doctrine: cross-cycle/cross-wave chronicle witnessing. */
  doctrine: string;
  /** The inscription namespaces players read across waves. */
  witnessSourceNamespaces: readonly ["post_run", "dischordia"];
  /** Two-Witnesses footing (file:line). */
  twoWitnessesAnchor: string;
  /** The shipped signature-transfer mechanic this formalizes (file:line). */
  signatureTransferAnchor: string;
  /** The cycle-aware inscription runtime (file:line). */
  cycleAwareAnchor: string;
  canonLockedAt: "2026-05-15";
}

export const CROSS_WAVE_WITNESS: CrossWaveWitnessCanon = {
  doctrine:
    "Players across prestige cycles and waves cross-witness each " +
    "other's chronicle inscriptions, exactly as the Two Witnesses " +
    "(the Programmer-Antiquarian and the Enigma) carried the saga's " +
    "continuity through bodies. Each closed run's Tome inscription is " +
    "a witness the following waves read; the continuity is transferred " +
    "from wave to wave the way Fragment V transfers a signature into " +
    "the Antiquarian's Tome. No Volume is written unwitnessed.",
  witnessSourceNamespaces: ["post_run", "dischordia"],
  twoWitnessesAnchor:
    "apps/shared/identityCollisionCanon.ts:257-258 (the Two-Witnesses " +
    "canon — Programmer-Antiquarian encoded, Enigma transmitted)",
  signatureTransferAnchor:
    "apps/shared/twoWitnessesDecode.ts:126-142 (Fragment V — decoding " +
    "transfers the player's signature into the Antiquarian's Tome; the " +
    "next reader reads your signature; the continuity is transferred)",
  cycleAwareAnchor:
    "apps/server/services/postRunInscriptionsService.ts:46-50 " +
    "(post_run:<userId>:<prestigeTier>:<stanceFlag> + " +
    "dischordia:<userId>:<prestigeTier>) + apps/shared/postRunInscriptions.ts",
  canonLockedAt: "2026-05-15",
} as const;

/** Scope guard used by the parity gate: the network must
 *  never be classified as a Servant Hero (future season)
 *  surface. */
export function isCrossWaveWitnessCurrentLoop(): boolean {
  return CROSS_WAVE_WITNESS_SCOPE === "current_loop_surface";
}
