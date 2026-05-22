/* ═══════════════════════════════════════════════════════
   LIVING DEFERRAL CANON

   Single spine for narrative surfaces whose absence in the current
   loop is deliberate. Models the pattern set by
   apps/shared/servantHeroFutureSeasonCanon.ts:1-110 — every entry
   carries a typed status, a structural seam pointer (file:line),
   a `seamIsIntentional: true` flag, and a diegetic justification
   (the in-fiction reason the player doesn't reach this surface
   yet). The ship-check parity gate
   (apps/shared/_completeness/checks/livingDeferralCoverage.ts)
   walks this list and asserts every entry is well-formed.

   The 2026-05-12 NEW_ART_{1,2} drop closed the art deferral for
   the 7 vehicles + 60 destination zones + 8 destination panoramas
   (see apps/shared/expansionArt/newArtRoomBridge.ts). What remains
   genuinely deferred is narrative — three single-decision items:

     1. ch20_conexus_BONUS chapter intro
        Authority alignment unspecified in saga canon. Gate row
        in bonusChapterIntroTriggers.ts is engineering's best-guess,
        flagged writerReview:true. Producer MP4 sits on CDN.
     2. epoch1_heart_of_time_four_presences Stage-4 weave anchor
        Canonically deferred per Oracle bible §2.10. The Stage-4
        weave renderer ships with the future season; the anchor's
        canonical configuration is locked here as intentional.
     3. (reserved) any destination-category unlock model that
        narrative-design declines to ratify. The honest ratchet
        at apps/shared/_completeness/checks/roomReachabilityCoverage.ts:32-37
        is the operative gate — this canon spine records the
        diegetic handle, not the unlock rule.
   ═══════════════════════════════════════════════════════ */

export type DeferralStatus =
  /** Narrative-pass authoring pending (spec + producer ready). */
  | "deferred_authoring"
  /** Future-season / DLC canon-lock; seam is the deliberate boundary. */
  | "deferred_future_season"
  /** Narrative-design declined to ratify an unlock gate or spec. */
  | "deferred_narrative_design";

export type DeferralCategory =
  | "bonus_intro"
  | "weave_anchor"
  | "destination_gate";

export interface DeferredSurface {
  /** Canonical id matching the surface's own typed key. */
  id: string;
  category: DeferralCategory;
  status: DeferralStatus;
  /** file:line of the structural gate / seam that keeps the surface absent. */
  seamModule: string;
  /** The Servant-Hero-style intentional-boundary flag — always true. */
  seamIsIntentional: true;
  /** Diegetic justification: why doesn't the player reach this surface yet? */
  diegeticHandle: string;
  /**
   * Optional spec dependency — the single decision that unblocks the
   * surface (e.g. "Authority alignment enum"). Surfaced in dashboards.
   */
  blockedOn?: string;
}

export const LIVING_DEFERRAL_CANON: readonly DeferredSurface[] = [
  {
    id: "ch20_conexus_BONUS",
    category: "bonus_intro",
    status: "deferred_authoring",
    seamModule:
      "apps/shared/bonusChapterIntroTriggers.ts:73 (DEFERRED_BONUS_INTRO_IDS) + " +
      "apps/shared/storyEncounterChapterIntros.ts:29-33 (canon-gap note)",
    seamIsIntentional: true,
    diegeticHandle:
      "Authority alignment is in flux on the player's current loop — " +
      "the Conexus does not testify until the loop chooses an Authority.",
    blockedOn:
      "AuthorityAlignment enum + producer (writer to ratify; engineering " +
      "best-guess gate row landed against `authority_alignment_aligned`).",
  },
  {
    id: "epoch1_heart_of_time_four_presences",
    category: "weave_anchor",
    status: "deferred_future_season",
    seamModule:
      "apps/shared/npcs/stage4WeaveAnchors.ts:314 (status: 'deferred_future_season') + " +
      "apps/shared/servantHeroFutureSeasonCanon.ts:1-110 (precedent)",
    seamIsIntentional: true,
    diegeticHandle:
      "The Enigma has not yet arrived at Thaloria on the player's loop. " +
      "The four canonical presences cohere only at Epoch-1 close; the " +
      "Stage-4-weave renderer ships with that season.",
    blockedOn:
      "Stage-4 weave renderer + Enigma roster canonization (Phase 5+).",
  },
];

export const LIVING_DEFERRAL_BY_ID: ReadonlyMap<string, DeferredSurface> = new Map(
  LIVING_DEFERRAL_CANON.map((d) => [d.id, d] as const),
);

/**
 * Coverage helper — counts entries that have all required fields
 * populated and a seamModule with a real file:line pointer.
 *
 * The corresponding check at
 * `apps/shared/_completeness/checks/livingDeferralCoverage.ts`
 * folds this into the ship-check gate.
 */
export function getLivingDeferralCoverage(): {
  declared: number;
  classified: number;
} {
  const validStatuses: DeferralStatus[] = [
    "deferred_authoring",
    "deferred_future_season",
    "deferred_narrative_design",
  ];
  const fileLineRe = /^[^\s:]+\.(ts|tsx|md):\d+/;
  return {
    declared: LIVING_DEFERRAL_CANON.length,
    classified: LIVING_DEFERRAL_CANON.filter(
      (d) =>
        validStatuses.includes(d.status) &&
        d.seamIsIntentional === true &&
        d.diegeticHandle.trim().length > 0 &&
        // Accept either a single file:line or a "+ "-joined chain.
        d.seamModule.split(/\s*\+\s*/).every((s) => fileLineRe.test(s.trim())),
    ).length,
  };
}
