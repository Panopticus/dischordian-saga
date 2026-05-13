/* ═══════════════════════════════════════════════════════
   CROSS-ARC REACTIVITY CANON
   The Mystery Engine ships extensive cross-arc bindings in
   apps/shared/episodeMysteries.ts — choices made in one arc
   surface as clues, deductions, and narrative shifts in
   another. This module catalogs those bindings so the runtime
   can validate them, surface them to the player, and report
   coverage.

   Six canonical cross-arc weights ship today:
     - cross_arc_jericho
     - cross_arc_wraith
     - cross_arc_seer
     - cross_arc_vex
     - cross_arc_degen
     - cross_arc_game_master

   Each weight names the DESTINATION arc the choice will
   surface in. The catalog binds each weighted choice to:
     - the SOURCE arc / episode / choice id where the choice
       is offered
     - the DESTINATION arc / episode where the cross-arc beat
       resolves
     - the narrative meaning of the cross-arc thread
     - the canon citation (LORE_BIBLE or Mystery Engine bible)

   Downstream consumers:
     - Hub UI: "this choice will affect Jericho's arc"
       preview surface
     - Codex: cross-arc retrospective ("you inscribed Akai
       Shi's name; Jericho's case stays open because of it")
     - ship:check parity: validate every cross_arc_* weight in
       episodeMysteries.ts has a corresponding catalog entry
   ═══════════════════════════════════════════════════════ */

import type { ArcId, ChoiceId } from "./mysteryTypes";

/** The canonical cross-arc weight values shipping in episodeMysteries.ts. */
export type CrossArcWeight =
  | "cross_arc_jericho"
  | "cross_arc_wraith"
  | "cross_arc_seer"
  | "cross_arc_vex"
  | "cross_arc_degen"
  | "cross_arc_game_master";

/** A canonical cross-arc binding. */
export interface CrossArcBinding {
  /** The weight value the source choice carries. */
  weight: CrossArcWeight;
  /** Source arc (where the cross-arc choice is OFFERED). */
  sourceArc: ArcId;
  /** Source episode ordinal (1-5). */
  sourceEpisode: number;
  /**
   * Source choice id — the specific decision that activates the
   * cross-arc thread. Free-text for runtime lookup; not branded
   * because we need to cite mid-episode choice ids.
   */
  sourceChoiceId: string;
  /** Destination arc (where the cross-arc surfaces RESOLVE). */
  destinationArc: ArcId;
  /**
   * Destination episode ordinals where the cross-arc thread
   * manifests as clues / deductions / narrative shifts.
   */
  destinationEpisodes: readonly number[];
  /**
   * One-sentence canonical meaning — what does the thread
   * actually do narratively.
   */
  narrativeMeaning: string;
  /** Canon citation. */
  loreSource: string;
}

/* ═══════════════════════════════════════════════════════
   THE CANONICAL CROSS-ARC BINDINGS
   ═══════════════════════════════════════════════════════ */

export const CROSS_ARC_BINDINGS: readonly CrossArcBinding[] = [
  /* ── Wraith → Jericho (the saga's most-load-bearing cross-arc) ── */
  {
    weight: "cross_arc_jericho",
    sourceArc: "arc.wraith_calder" as ArcId,
    sourceEpisode: 5,
    sourceChoiceId: "wraith.e5.c.inscribe_akai_shi",
    destinationArc: "arc.jericho_jones" as ArcId,
    destinationEpisodes: [5],
    narrativeMeaning:
      "If the player inscribes Akai Shi's name in Wraith's Long " +
      "Mourning daily-names ceremony, the Hierophant's litany counts " +
      "as a recognised witnessing surface in Hierarchy law. " +
      "Mol'Vereth's contract on the Degen's trusteeship can then be " +
      "altered — the seal that has held for centuries shifts because " +
      "a witness has finally named the act. Jericho's commission " +
      "becomes operational rather than witnessing-in-readiness.",
    loreSource:
      "apps/shared/episodeMysteries.ts:588 (wraith.e5 choice) + " +
      "apps/shared/episodeMysteries.ts:1185-1209 (jericho.e5 payoff) + " +
      "LORE_BIBLE.md:595 (Mystery Engine bible — Akai Shi inscription " +
      "option ties to Jericho's grief in mystery.jericho_jones E5)",
  },

  /* ── Jericho → Wraith (reciprocal — Substrate-N reading) ── */
  {
    weight: "cross_arc_wraith",
    sourceArc: "arc.jericho_jones" as ArcId,
    sourceEpisode: 3,
    sourceChoiceId: "jericho.e3.c.cross_arc_consult_wraith",
    destinationArc: "arc.wraith_calder" as ArcId,
    destinationEpisodes: [4, 5],
    narrativeMeaning:
      "If Jericho's investigation of the Iron Lion imprint surfaces " +
      "a partial-substrate match to the Substrate-N encryption " +
      "residue (the resurrection-protocol technological floor the " +
      "Syndicate of Death used — and Wraith Calder democratised — " +
      "stealing for the Sanctuary), the player can bring the reading " +
      "to Wraith. Wraith's E4 (Final Rite as consent or coercion) " +
      "and E5 (Herald's Vigil) gain context about the imprint's " +
      "lineage.",
    loreSource:
      "apps/shared/episodeMysteries.ts:1008-1010 + " +
      "apps/shared/episodeMysteries.ts:955-984 (Substrate-N Cross-Reference)",
  },

  /* ── Vex → Seer (the missing DEC-7710 tape) ── */
  {
    weight: "cross_arc_seer",
    sourceArc: "arc.vex_solene" as ArcId,
    sourceEpisode: 5,
    sourceChoiceId: "vex.e5.c.cross_arc_seer_archive",
    destinationArc: "arc.the_seer" as ArcId,
    destinationEpisodes: [4, 5],
    narrativeMeaning:
      "Vex Solène's E5 Engineer's Last Calibration on the DEC-7710 " +
      "rig surfaces the canonical resolution to the Seer's archive " +
      "anomaly: 4,711 of 4,712 tapes credited; DEC-7710 missing " +
      "because it was filed under a Warlord-fragment cover identity. " +
      "The Seer's E4 cross-arc clue records Vex's open installment " +
      "as a Seer-archive event — the two arcs are halves of the " +
      "same investigation seen from opposite sides.",
    loreSource:
      "apps/shared/episodeMysteries.ts:1671-1672 (seer.e4 cross-arc " +
      "echo) + LORE_BIBLE.md:554 (Vex Solène's archive credits canon)",
  },

  /* ── Game Master → Vex (the contract-honoring-yet-fatal operation) ── */
  {
    weight: "cross_arc_vex",
    sourceArc: "arc.game_master" as ArcId,
    sourceEpisode: 5,
    sourceChoiceId: "game_master.e5.c.cross_arc_vex_protocol",
    destinationArc: "arc.vex_solene" as ArcId,
    destinationEpisodes: [4, 5],
    narrativeMeaning:
      "The Game Master arc's resolution surfaces Xeth'Raal's " +
      "celebrated operation — Agent Zero (Vex Solène) was the " +
      "instrument that destroyed the Game Master while every clause " +
      "of his protection contract was honored. The cross-arc thread " +
      "feeds back into Vex's identity-collapse arc: she is " +
      "canonically the Hierarchy's instrument as well as the " +
      "Engineer's vessel. Both reads are true.",
    loreSource:
      "LORE_BIBLE.md:5352 (Xeth'Raal's celebrated operation) + " +
      "apps/shared/episodeMysteries.ts:1403, 1503, 1609 (cross_arc_wraith " +
      "weighted choices in the Game Master arc surfacing Vex's role)",
  },

  /* ── Degen → Wraith / Jericho (the Empty Table settlement) ── */
  {
    weight: "cross_arc_wraith",
    sourceArc: "arc.the_degen" as ArcId,
    sourceEpisode: 5,
    sourceChoiceId: "degen.e5.c.bring_brel_to_the_table",
    destinationArc: "arc.wraith_calder" as ArcId,
    destinationEpisodes: [5],
    narrativeMeaning:
      "The Degen's E5 Settlement at the Empty Table — his first-ever " +
      "direct letter to the saga, inviting one night of witness for " +
      "a hundred-year arrangement — closes Mol'Vereth's annual audit " +
      "without action. The cross-arc beat acknowledges that the " +
      "Hierophant's daily-names ceremony has held the Degen's seat " +
      "open for centuries. If the player has been to both arcs, the " +
      "Empty Table is canonically witnessed by the Long Mourning.",
    loreSource:
      "apps/shared/npcs/bibles/the_degen.md (Mystery Engine arc " +
      "summary) + apps/shared/episodeMysteries.ts (degen.e5 ChoiceId)",
  },

  /* ── Degen → Jericho (the Iron Lion training ledger) ── */
  {
    weight: "cross_arc_jericho",
    sourceArc: "arc.the_degen" as ArcId,
    sourceEpisode: 1,
    sourceChoiceId: "degen.e1.c.cross_arc_iron_lion_training",
    destinationArc: "arc.jericho_jones" as ArcId,
    destinationEpisodes: [1, 5],
    narrativeMeaning:
      "The Degen's ledger has a single line for 'Iron Lion training' " +
      "with NO FEE — the gift, which is the one thing the Degen " +
      "doesn't do. The Jericho arc opens on the same anomaly: " +
      "Jericho's training is being subsidised by the Degen against " +
      "the Degen's stated ledger principle. The cross-arc binding " +
      "is the saga's coldest investigative hook.",
    loreSource:
      "LORE_BIBLE.md:1740 (Jericho-arc Degen-ledger canon: " +
      "'single line for Iron Lion training with no fee — the gift, " +
      "which is the one thing the Degen doesn't do, is the cold-hook " +
      "clue of mystery.jericho_jones E1')",
  },
] as const satisfies readonly CrossArcBinding[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Returns all bindings whose source is the given arc. */
export function getBindingsFromArc(
  sourceArc: ArcId,
): readonly CrossArcBinding[] {
  return CROSS_ARC_BINDINGS.filter((b) => b.sourceArc === sourceArc);
}

/** Returns all bindings whose destination is the given arc. */
export function getBindingsToArc(
  destinationArc: ArcId,
): readonly CrossArcBinding[] {
  return CROSS_ARC_BINDINGS.filter((b) => b.destinationArc === destinationArc);
}

/** Returns all bindings of a given weight. */
export function getBindingsByWeight(
  weight: CrossArcWeight,
): readonly CrossArcBinding[] {
  return CROSS_ARC_BINDINGS.filter((b) => b.weight === weight);
}

/**
 * Returns every distinct arc that participates in cross-arc
 * reactivity (either as source or destination).
 */
export function getParticipatingArcs(): readonly ArcId[] {
  const arcs = new Set<ArcId>();
  for (const b of CROSS_ARC_BINDINGS) {
    arcs.add(b.sourceArc);
    arcs.add(b.destinationArc);
  }
  return [...arcs];
}

/**
 * Total count of canonical cross-arc bindings shipping today.
 */
export const CANONICAL_CROSS_ARC_COUNT = 6;

/**
 * Returns the canonical preview text the Hub UI shows to the
 * player when they are about to make a choice that activates a
 * cross-arc thread. Pure string composition; no I/O.
 */
export function getCrossArcPreview(binding: CrossArcBinding): string {
  const fromArc = binding.sourceArc.replace("arc.", "").replace(/_/g, " ");
  const toArc = binding.destinationArc.replace("arc.", "").replace(/_/g, " ");
  return (
    `Your choice in the ${fromArc} arc (Episode ${binding.sourceEpisode}) ` +
    `will alter the ${toArc} arc — specifically Episode${
      binding.destinationEpisodes.length === 1 ? "" : "s"
    } ${binding.destinationEpisodes.join(", ")}. ` +
    binding.narrativeMeaning
  );
}
