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
  | "cross_arc_game_master"
  | "cross_arc_nemesis"
  | "cross_arc_collector"
  | "cross_arc_politician"
  | "cross_arc_zyr_koth"
  | "cross_arc_riri_ahlia"
  | "cross_arc_varkul"
  | "cross_arc_fenra";

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
  /* ── Varkul → Necromancer (the vigil IS the continuity reading) ── */
  {
    weight: "cross_arc_varkul",
    sourceArc: "arc.varkul" as ArcId,
    sourceEpisode: 2,
    sourceChoiceId: "varkul.e2.c.active",
    destinationArc: "arc.the_necromancer" as ArcId,
    destinationEpisodes: [1],
    narrativeMeaning:
      "If the player asks Varkul what he would do in the first hour " +
      "after the maker's signal stopped (varkul.e2 active choice), " +
      "the_necromancer arc's E1 gains the instrument frame: Varkul " +
      "is not evidence of the Necromancer's continuity, he IS it, " +
      "instrumented. The two arcs compose — necromancer.e1 deduces " +
      "the continuity; varkul.e2 measures it. The player who has run " +
      "both reads the Cathedral's standing as a needle, not an " +
      "inference.",
    loreSource:
      "apps/shared/episodeMysteries.ts (varkul.e2 + necromancer.e1) + " +
      "apps/shared/hierarchyCanon.ts:219-232 (Varkul) + the " +
      "necromancer.e1 Varkul-vigil canon (PR-7)",
  },
  /* ── Fenra → Riri'Ahlia (the engine under the reorganization) ── */
  {
    weight: "cross_arc_fenra",
    sourceArc: "arc.fenra" as ArcId,
    sourceEpisode: 1,
    sourceChoiceId: "fenra.e1.c.active",
    destinationArc: "arc.riri_ahlia" as ArcId,
    destinationEpisodes: [3],
    narrativeMeaning:
      "If the player cross-walks Fenra's logistics against " +
      "Riri'Ahlia's reorganization (fenra.e1 active choice), the " +
      "riri_ahlia arc's E3 gains the supply frame: the Taskmaster " +
      "reorganizes the org chart, but Fenra's kitchen is what makes " +
      "the reorganized chart executable. The two arcs compose — " +
      "riri_ahlia.e3 is the strategy; fenra.e1 is the supply line " +
      "that lets the strategy have a next quarter.",
    loreSource:
      "apps/shared/episodeMysteries.ts (fenra.e1 + riri_ahlia.e3) + " +
      "apps/shared/hierarchyCanon.ts:234-249 (Fenra) + the " +
      "riri_ahlia.e3 Fenra-commendation canon (PR-12)",
  },
  /* ── Zyr'Koth → Syl'Vex (the third use is the only convert-reversal) ── */
  {
    weight: "cross_arc_zyr_koth",
    sourceArc: "arc.zyr_koth" as ArcId,
    sourceEpisode: 3,
    sourceChoiceId: "zyr_koth.e3.c.active",
    destinationArc: "arc.syl_vex" as ArcId,
    destinationEpisodes: [3],
    narrativeMeaning:
      "If the player carries to the Insurgency that the only " +
      "convert-reversal in existence is one Hierarchy vote from " +
      "being deployable (zyr_koth.e3 active choice), the syl_vex " +
      "arc's E3 reads differently: the locked Severance lever is " +
      "not a theoretical constraint but an active political " +
      "object the Insurgency now tracks. The two arcs compose: " +
      "syl_vex.e3 establishes the lock; zyr_koth.e3 establishes " +
      "what is behind it and that it is one quarterly review from " +
      "moving.",
    loreSource:
      "apps/shared/episodeMysteries.ts (zyr_koth.e3 + sylVexE3) + " +
      "apps/shared/hierarchyCanon.ts:155-170 (Zyr'Koth R&D) + the " +
      "Blood-Weave-three-uses canon (syl_vex arc, PR-7)",
  },
  /* ── Riri'Ahlia → Necromancer (the question that holds him quiet) ── */
  {
    weight: "cross_arc_riri_ahlia",
    sourceArc: "arc.riri_ahlia" as ArcId,
    sourceEpisode: 4,
    sourceChoiceId: "riri_ahlia.e4.c.active",
    destinationArc: "arc.the_necromancer" as ArcId,
    destinationEpisodes: [4],
    narrativeMeaning:
      "If the player carries to the Necromancer that his silence " +
      "is partly Riri'Ahlia's procedural question holding him " +
      "quiet (riri_ahlia.e4 active choice), the_necromancer arc's " +
      "E4 (the Architect's conditional tolerance) gains the COO's " +
      "instrument: the Necromancer's discipline of staying quiet " +
      "in the Castle is not only Architect-tolerance management — " +
      "it is also a response to Riri'Ahlia's unanswered question. " +
      "The two arcs compose into one constraint-web holding the " +
      "Necromancer's continuity invisible.",
    loreSource:
      "apps/shared/episodeMysteries.ts (riri_ahlia.e4 + necromancer.e4) + " +
      "apps/shared/hierarchyCanon.ts:140-153 (Riri'Ahlia COO) + the " +
      "necromancer.e4 procedural-question canon (PR-7)",
  },
  /* ── Politician → Nemesis (the policy pays out, against the player) ── */
  {
    weight: "cross_arc_politician",
    sourceArc: "arc.the_politician" as ArcId,
    sourceEpisode: 4,
    sourceChoiceId: "politician.e4.c.active",
    destinationArc: "arc.the_necromancer" as ArcId,
    destinationEpisodes: [1],
    narrativeMeaning:
      "If the player carries the recruit clause to the next Nemesis " +
      "encounter (politician.e4 active choice), the the_necromancer " +
      "arc's E1 gains the cross-thread: the secret apprentices were " +
      "re-released when the Necromancer escaped the Matrix. The player " +
      "who has run the Politician arc reads the Nemesis not as a " +
      "generic rival but as the Politician's insurance policy paying " +
      "out — and reads the Necromancer's escape as the event that " +
      "triggered the disbursement. The two arcs compose into one " +
      "mechanism: the Politician built the apprentices; the " +
      "Necromancer's escape released them.",
    loreSource:
      "apps/shared/episodeMysteries.ts (politician.e4 + necromancer.e1) + " +
      "apps/shared/nemesisSystem.ts:15-30 (Nemesis = Politician's secret " +
      "apprentice, re-released when the Necromancer escaped the Matrix) + " +
      "build plan §I.1a",
  },
  /* ── Collector → Watcher (the seizure, from both sides) ── */
  {
    weight: "cross_arc_collector",
    sourceArc: "arc.the_collector" as ArcId,
    sourceEpisode: 1,
    sourceChoiceId: "collector.e1.c.investigative",
    destinationArc: "arc.the_watcher" as ArcId,
    destinationEpisodes: [1, 2],
    narrativeMeaning:
      "If the player cross-walks the Collector's catalog against " +
      "the Ocularum's record in collector.e1 (the investigative " +
      "choice), the watcher arc's early episodes gain the curator's " +
      "side of the founding regicide: the Ocularum grieves the " +
      "undone assassination; the Collector's catalog never had the " +
      "man on file. The two records do not contradict — the player " +
      "who has seen both reads the Watcher's origin as a seam " +
      "between a grief and a catalog, not as a single event.",
    loreSource:
      "apps/shared/episodeMysteries.ts (collector.e1 + watcherE1/E2) + " +
      "apps/shared/archonCanon.ts:the_watcher.canonNote + the_collector entry + " +
      "apps/shared/hierarchyCanon.ts:HIERARCHY_AEONS_PIECE_POSITIONING",
  },
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

  /* ── Wolf → Wraith (the Crucible / Eighth Death lineage) ── */
  {
    weight: "cross_arc_wraith",
    sourceArc: "arc.dlc.wolf_anara_hunt" as ArcId,
    sourceEpisode: 1,
    sourceChoiceId: "wolf.e1.c.audit_the_judge",
    destinationArc: "arc.wraith_calder" as ArcId,
    destinationEpisodes: [4, 5],
    narrativeMeaning:
      "The Wolf's pre-resurrection name was Lycos; he became the " +
      "Wolf at the Crucible after his Year 100,001 A.A. destruction " +
      "by the Judge. The Judge's audit-entry phrase 'the instrument " +
      "was not lost' is load-bearing — it surfaces in Wraith's " +
      "Long Mourning ceremony as a candidate inscription. Wraith E4 " +
      "(Final Rite as consent or coercion) and E5 (Herald's Vigil) " +
      "gain context: the Sanctuary's resurrection protocols are not " +
      "the only way a Potential comes back; the Crucible is another. " +
      "Both routes share a lineage canonical to the Syndicate of Death.",
    loreSource:
      "LORE_BIBLE.md:3561-3605 (Wolf's Year 100,001 destruction + Year " +
      "128,652 resurrection) + plan §I.1a (Lycos / Crucible canon) + " +
      "apps/shared/dlcMysteries/wolfAnaraHunt.ts (E1 audit_the_judge)",
  },

  /* ── Wolf → Jericho (the Iron Lion's grief for Lycos) ── */
  {
    weight: "cross_arc_jericho",
    sourceArc: "arc.dlc.wolf_anara_hunt" as ArcId,
    sourceEpisode: 3,
    sourceChoiceId: "wolf.e3.c.ask_jericho",
    destinationArc: "arc.jericho_jones" as ArcId,
    destinationEpisodes: [4, 5],
    narrativeMeaning:
      "Jericho killed Akai Shi as mercy under Thought-Virus " +
      "consumption. The Wolf's case is the canonical parallel: he " +
      "too was consumed, then destroyed by the Judge, then " +
      "resurrected — but as the hunter of the Antiquarian's Heroes, " +
      "not as a comrade restored. If the player brings Jericho the " +
      "Wolf-case at E3, Jericho's Lionism Ethics episode (E4) and " +
      "Commission episode (E5) reframe: mercy is a verdict the Iron " +
      "Lion is sometimes asked to render twice on the same name.",
    loreSource:
      "LORE_BIBLE.md:3561-3605 (Wolf's hunt of the Antiquarian's " +
      "Heroes) + apps/shared/dlcMysteries/wolfAnaraHunt.ts (E3 " +
      "ask_jericho) + apps/shared/episodeMysteries.ts (jericho E4-E5)",
  },

  /* ── Akai Shi → Jericho (the closing mercy-killing payoff) ── */
  {
    weight: "cross_arc_jericho",
    sourceArc: "arc.dlc.akai_shi_red_death" as ArcId,
    sourceEpisode: 5,
    sourceChoiceId: "akai.e5.c.cross_arc_jericho_close",
    destinationArc: "arc.jericho_jones" as ArcId,
    destinationEpisodes: [5],
    narrativeMeaning:
      "Akai Shi's transformation arc closes with the Red Death's " +
      "cosmic mandate accepted. The cross-arc choice returns the " +
      "verdict to Jericho: he killed her as mercy; she came back " +
      "as something larger. Jericho's Commission episode (E5) gains " +
      "the Red Death's blessing — Iron-Clad Lionism is canonically " +
      "compatible with mercy that becomes resurrection. The cross-arc " +
      "is the saga's most-emotionally-loaded reciprocal closure.",
    loreSource:
      "LORE_BIBLE.md:726-748 (Akai Shi → Red Death + " +
      "Necromancer-kill canon) + LORE_BIBLE.md:63-160 (Jericho's " +
      "mercy canon) + apps/shared/dlcMysteries/akaiShiRedDeath.ts " +
      "(E5 cross_arc_jericho_close)",
  },

  /* ── Akai Shi → Wraith (the closing inscription) ── */
  {
    weight: "cross_arc_wraith",
    sourceArc: "arc.dlc.akai_shi_red_death" as ArcId,
    sourceEpisode: 5,
    sourceChoiceId: "akai.e5.c.cross_arc_wraith_close",
    destinationArc: "arc.wraith_calder" as ArcId,
    destinationEpisodes: [5],
    narrativeMeaning:
      "Akai Shi's E5 closure offers Wraith her name for inscription — " +
      "the Red Death's name added to the Long Mourning's daily " +
      "ceremony. The inscription is canonically reciprocal to " +
      "Wraith's own E5 'inscribe Akai Shi' choice: each arc surfaces " +
      "the other's option, and the player's path determines which " +
      "(or both, or neither) gets written. The 347,000-name backlog " +
      "moves by one if the choice is taken from either side.",
    loreSource:
      "apps/shared/dlcMysteries/akaiShiRedDeath.ts (E5 " +
      "cross_arc_wraith_close) + apps/shared/episodeMysteries.ts " +
      "(wraith.e5 inscribe_akai_shi) — reciprocal binding pair",
  },

  /* ── Akai Shi → Game Master (the Necromancer kill in the Matrix) ── */
  {
    weight: "cross_arc_game_master",
    sourceArc: "arc.dlc.akai_shi_red_death" as ArcId,
    sourceEpisode: 3,
    sourceChoiceId: "akai.e3.c.cross_arc_game_master",
    destinationArc: "arc.game_master" as ArcId,
    destinationEpisodes: [4, 5],
    narrativeMeaning:
      "Akai Shi's hunt of the Necromancer happened canonically " +
      "WITHIN the Matrix of Dreams — the Game Master's archive. The " +
      "cross-arc binding surfaces in the Game Master arc as: the " +
      "Matrix is not only watched; it can be entered, hunted in, and " +
      "the imprints inside can be ended. The Red Death's precedent " +
      "is the only known case of a non-Game-Master operating " +
      "successfully inside the archive. This is a conspiracy seed " +
      "the Game Master arc surfaces in E4-E5 without yet revealing " +
      "the full post-game canon.",
    loreSource:
      "LORE_BIBLE.md:726-748 (Akai Shi killed the Necromancer in " +
      "the Matrix of Dreams) + LORE_BIBLE.md:6238-6259 (Matrix " +
      "canon) + apps/shared/dlcMysteries/akaiShiRedDeath.ts (E3 " +
      "cross_arc_game_master)",
  },

  /* ── Resurrectionist → Game Master (the Nemesis name-reveal pair) ── */
  {
    weight: "cross_arc_nemesis",
    sourceArc: "arc.dlc.resurrectionist_cycle_walker" as ArcId,
    sourceEpisode: 5,
    sourceChoiceId: "resur.e5.c.mark_the_partial_for_re_audit",
    destinationArc: "arc.game_master" as ArcId,
    destinationEpisodes: [4, 5],
    narrativeMeaning:
      "The Resurrectionist arc's E5 partial-audit choice + " +
      "Game Master Fight 2's plague-mask seed together form " +
      "the two-gate name-reveal for the Nemesis system " +
      "(apps/shared/nemesisSystem.ts shouldRevealProperName). " +
      "Per dreamer-canon (2026-05-13): the Nemesis is the " +
      "Politician's secret apprentice, preserved as a " +
      "consciousness-imprint inside the Matrix of Dreams " +
      "during her reign, re-released into the world when the " +
      "Necromancer escaped the Matrix (Resurrectionist arc's " +
      "encoded post-game canon). Game Master Fight 2's " +
      "plague-masked-imprint seed (apps/shared/" +
      "gameMasterTwoFights.ts beat gm_robot_post_fight_seed_01) " +
      "is the parallel gate. When BOTH close, the chronicle's " +
      "Nemesis-name catalog opens to the player. Each arc " +
      "thus surfaces a Nemesis-aware deduction-callback on " +
      "E4-E5 when the other gate has already closed.",
    loreSource:
      "apps/shared/nemesisSystem.ts (Nemesis canon: " +
      "Politician's secret apprentice, Matrix-of-Dreams " +
      "preservation, Necromancer-escape re-release) + " +
      "apps/shared/dlcMysteries/resurrectionistCycleWalker.ts " +
      "E5 + apps/shared/gameMasterTwoFights.ts (Game Master " +
      "Fight 2 plague-mask seed) + plan §I.1a (Nemesis canon)",
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
 * 6 spine-arc bindings + 5 DLC bindings (Wolf → Wraith + Wolf →
 * Jericho + Akai Shi → Jericho + Akai Shi → Wraith + Akai Shi →
 * Game Master) + 1 Nemesis bind (Resurrectionist → Nemesis name
 * reveal) + 6 expansion bindings (Advocate / Blood-Weave /
 * Severance arc cross-refs) = 18 canonical cross-arc threads.
 * The CROSS_ARC_BINDINGS registry is authoritative; this
 * constant tracks its length.
 */
export const CANONICAL_CROSS_ARC_COUNT = 18;

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
