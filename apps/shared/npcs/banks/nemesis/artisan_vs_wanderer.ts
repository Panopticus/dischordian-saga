/* ARTISAN-PLAYER vs. WANDERER-NEMESIS — Phase K Wave 7E (canon)
   Built vs found. Artisan crafts; Wanderer collects from roads.
   Surfaces: Mechronis workshop, trade waystation, cohort hall, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";
const t = (id: string, speaker: "nemesis" | "apprentice", line: string, choices?: { label: string; next: string; flag?: string }[]): DialogTree["nodes"]["root"] => ({ id, speaker, voLineId: `nemesis.${id}`, onscreenText: line, choices: choices?.map(c => ({ label: c.label, nextId: c.next, sets: c.flag })) });
const tree = (id: string, nodes: Record<string, DialogTree["nodes"]["root"]>): DialogTree => ({ id, nodes });

const FS_L = tree("artisan_vs_wanderer.first_sighting.low", {
  root: t("root", "nemesis", "Mechronis Academy workshop. You are finishing a commissioned piece. The Wanderer-Nemesis sets a road-found object on your bench — same form, different patina. \"I found this on the trade road last week. The Politician's primer: 'the road's found and the workshop's built are two readings of the same artifact.' Choose which precedes.\"", [{ label: "Acknowledge both readings.", next: "ack", flag: "mercy_at_grudge_low_first_sighting" }, { label: "Insist the built precedes.", next: "built", flag: "aggression_at_grudge_low_first_sighting" }]),
  ack: t("ack", "nemesis", "\"Acknowledged. The Adjudicator's artifact-registry now lists the pair.\"", [{ label: "Sign the joint listing.", next: "ack_sign" }]),
  ack_sign: t("ack_sign", "nemesis", "\"Signed.\""),
  built: t("built", "nemesis", "\"Insisted. The found object filed under 'derivative.' The chronicle records the verdict.\""),
});
const FS_M = tree("artisan_vs_wanderer.first_sighting.mid", {
  root: t("root", "nemesis", "\"Three commissions; three road-found counterparts. The artifact-registry has begun cataloguing us as a discipline-pair. The Politician's primer: 'the discipline-pair is the chronicle's most efficient curatorship.'\"", [{ label: "Co-curate.", next: "co", flag: "mercy_at_grudge_mid_first_sighting" }, { label: "Petition for separate catalogues.", next: "pet", flag: "aggression_at_grudge_mid_first_sighting" }]),
  co: t("co", "nemesis", "\"Co-curated. The registry's joint catalogue is the regime's largest.\""),
  pet: t("pet", "nemesis", "\"Denied. The joint catalogue stands.\""),
});
const FS_H = tree("artisan_vs_wanderer.first_sighting.high", {
  root: t("root", "nemesis", "\"I have stopped collecting from the road. My pack is empty. The Politician's primer: 'the Wanderer who stops collecting is the Wanderer who has accepted the workshop's primacy.' Train me.\"", [{ label: "Train them at the bench.", next: "train", flag: "mercy_at_grudge_high_first_sighting" }, { label: "Refuse. The road is theirs.", next: "refuse", flag: "aggression_at_grudge_high_first_sighting" }]),
  train: t("train", "nemesis", "\"Trained. The bench has a second stool.\"", [{ label: "Hand them a chisel.", next: "train_chisel" }]),
  train_chisel: t("train_chisel", "nemesis", "\"Handed.\""),
  refuse: t("refuse", "nemesis", "\"Refused. The road stays.\""),
});

const SC_L = tree("artisan_vs_wanderer.sabotage_caught_in_act.low", {
  root: t("root", "nemesis", "Trade waystation. Wanderer-Nemesis is trading found objects for commissions you made last quarter. \"The Politician's primer: 'the secondary market is the chronicle's most patient archive.'\"", [{ label: "Honor the secondary market.", next: "honor", flag: "mercy_at_grudge_low_sabotage_caught_in_act" }, { label: "Confiscate the commissions.", next: "conf", flag: "aggression_at_grudge_low_sabotage_caught_in_act" }]),
  honor: t("honor", "nemesis", "\"Honored. The market continues.\""),
  conf: t("conf", "nemesis", "\"Confiscated. The traders complained. The Adjudicator filed.\""),
});
const SC_M = tree("artisan_vs_wanderer.sabotage_caught_in_act.mid", {
  root: t("root", "nemesis", "\"Same waystation. I am brokering trades in your built pieces. The Politician's primer: 'the broker is the chronicle's most efficient curator.'\"", [{ label: "Authorize the brokerage.", next: "auth", flag: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { label: "File a procedural objection.", next: "obj", flag: "aggression_at_grudge_mid_sabotage_caught_in_act" }]),
  auth: t("auth", "nemesis", "\"Authorized. We co-sign each trade.\""),
  obj: t("obj", "nemesis", "\"Denied. The trades continued.\""),
});
const SC_H = tree("artisan_vs_wanderer.sabotage_caught_in_act.high", {
  root: t("root", "nemesis", "\"I am no longer brokering. I am here to ask you to set up a joint stall at the next waystation.\"", [{ label: "Set up the stall.", next: "stall", flag: "mercy_at_grudge_high_sabotage_caught_in_act" }, { label: "Refuse.", next: "ref", flag: "aggression_at_grudge_high_sabotage_caught_in_act" }]),
  stall: t("stall", "nemesis", "\"Stall set. The chronicle records the first joint stall in three regimes.\"", [{ label: "Sign the stall ledger.", next: "stall_sign" }]),
  stall_sign: t("stall_sign", "nemesis", "\"Signed.\""),
  ref: t("ref", "nemesis", "\"Refused. The road continues.\""),
});

const MI_L = tree("artisan_vs_wanderer.mocking_interlude.low", {
  root: t("root", "nemesis", "Mechronis Academy lecture hall. Wanderer-Nemesis lectures on found-form provenance. \"You attended. The road has students now.\"", [{ label: "Compliment.", next: "comp", flag: "mercy_at_grudge_low_mocking_interlude" }, { label: "Heckle the methodology.", next: "heckle", flag: "aggression_at_grudge_low_mocking_interlude" }]),
  comp: t("comp", "nemesis", "\"A compliment from the bench.\""),
  heckle: t("heckle", "nemesis", "\"Heckled. The students laughed at the bench.\""),
});
const MI_M = tree("artisan_vs_wanderer.mocking_interlude.mid", {
  root: t("root", "nemesis", "\"The Academy teaches us together. Half the students bench-train; half road-train.\"", [{ label: "Co-teach.", next: "co", flag: "mercy_at_grudge_mid_mocking_interlude" }, { label: "Separate rooms.", next: "sep", flag: "aggression_at_grudge_mid_mocking_interlude" }]),
  co: t("co", "nemesis", "\"Co-taught.\""),
  sep: t("sep", "nemesis", "\"Separated. Notes are pirated.\""),
});
const MI_H = tree("artisan_vs_wanderer.mocking_interlude.high", {
  root: t("root", "nemesis", "\"I have given up the road. Apprentice me at the bench.\"", [{ label: "Apprentice them.", next: "app", flag: "mercy_at_grudge_high_mocking_interlude" }, { label: "Refuse.", next: "ref", flag: "aggression_at_grudge_high_mocking_interlude" }]),
  app: t("app", "nemesis", "\"Apprenticed.\"", [{ label: "Hand them a chisel.", next: "app_chisel" }]),
  app_chisel: t("app_chisel", "nemesis", "\"First piece begun.\""),
  ref: t("ref", "nemesis", "\"Refused. I will keep the road.\""),
});

const LP_L = tree("artisan_vs_wanderer.lieutenant_promotion.low", {
  root: t("root", "nemesis", "Adjudicator's road-coordinator ceremony. \"Bless the elevation.\"", [{ label: "Bless from the workshop.", next: "bless", flag: "mercy_at_grudge_low_lieutenant_promotion" }, { label: "Object.", next: "obj", flag: "aggression_at_grudge_low_lieutenant_promotion" }]),
  bless: t("bless", "nemesis", "\"Blessed.\""),
  obj: t("obj", "nemesis", "\"Denied.\""),
});
const LP_M = tree("artisan_vs_wanderer.lieutenant_promotion.mid", {
  root: t("root", "nemesis", "\"Road-Coordinator. Four routes covered.\"", [{ label: "Commission a piece for each route.", next: "comm", flag: "mercy_at_grudge_mid_lieutenant_promotion" }, { label: "Audit the cell.", next: "audit", flag: "aggression_at_grudge_mid_lieutenant_promotion" }]),
  comm: t("comm", "nemesis", "\"Commissioned. Four pieces installed at four waystations.\""),
  audit: t("audit", "nemesis", "\"Audited. Tightened.\""),
});
const LP_H = tree("artisan_vs_wanderer.lieutenant_promotion.high", {
  root: t("root", "nemesis", "\"New artifact code drafting. Co-author.\"", [{ label: "Co-author.", next: "co", flag: "mercy_at_grudge_high_lieutenant_promotion" }, { label: "Refuse.", next: "ref", flag: "aggression_at_grudge_high_lieutenant_promotion" }]),
  co: t("co", "nemesis", "\"Signed.\"", [{ label: "Hand them the pen.", next: "co_pen" }]),
  co_pen: t("co_pen", "nemesis", "\"Permanent.\""),
  ref: t("ref", "nemesis", "\"The chronicle finished without you.\""),
});

const CE_L = tree("artisan_vs_wanderer.cohort_end_confrontation.low", {
  root: t("root", "nemesis", "Cohort hall. Your apprentice graduated, with a piece of your make and a found-object gift from the Wanderer.\"", [{ label: "Acknowledge both gifts.", next: "ack", flag: "mercy_at_grudge_low_cohort_end_confrontation" }, { label: "Refuse the found-object.", next: "ref", flag: "aggression_at_grudge_low_cohort_end_confrontation" }]),
  ack: t("ack", "nemesis", "\"Acknowledged.\""),
  ref: t("ref", "nemesis", "\"Refused. The Wanderer kept the object.\""),
});
const CE_M = tree("artisan_vs_wanderer.cohort_end_confrontation.mid", {
  root: t("root", "nemesis", "\"The Adjudicator lists us as 'made/found, paired.'\"", [{ label: "Acknowledge.", next: "ack", flag: "mercy_at_grudge_mid_cohort_end_confrontation" }, { label: "Petition separate.", next: "pet", flag: "aggression_at_grudge_mid_cohort_end_confrontation" }]),
  ack: t("ack", "nemesis", "\"Permanent.\""),
  pet: t("pet", "nemesis", "\"Denied.\""),
});
const CE_H = tree("artisan_vs_wanderer.cohort_end_confrontation.high", {
  root: t("root", "nemesis", "\"Your apprentice closed by signing a joint provenance. The Politician's primer: 'the joint provenance is the chronicle's binding commission.'\"", [{ label: "Accept.", next: "acc", flag: "mercy_at_grudge_high_cohort_end_confrontation" }, { label: "Refuse.", next: "ref", flag: "aggression_at_grudge_high_cohort_end_confrontation" }]),
  acc: t("acc", "nemesis", "\"Accepted.\""),
  ref: t("ref", "nemesis", "\"Refused. Held open.\""),
});

const AR_L = tree("artisan_vs_wanderer.accumulation_reveal.low", {
  root: t("root", "nemesis", "Matrix-archive intake. New sibling-release.\"", [{ label: "Welcome.", next: "wel", flag: "mercy_at_grudge_low_accumulation_reveal" }, { label: "Demand formal application.", next: "demand", flag: "aggression_at_grudge_low_accumulation_reveal" }]),
  wel: t("wel", "nemesis", "\"Welcomed.\""),
  demand: t("demand", "nemesis", "\"Processed.\""),
});
const AR_M = tree("artisan_vs_wanderer.accumulation_reveal.mid", {
  root: t("root", "nemesis", "\"Four releases. The Adjudicator's curatorship has its largest volume.\"", [{ label: "Bless.", next: "bless", flag: "mercy_at_grudge_mid_accumulation_reveal" }, { label: "Audit.", next: "audit", flag: "aggression_at_grudge_mid_accumulation_reveal" }]),
  bless: t("bless", "nemesis", "\"Blessed.\""),
  audit: t("audit", "nemesis", "\"Audited.\""),
});
const AR_H = tree("artisan_vs_wanderer.accumulation_reveal.high", {
  root: t("root", "nemesis", "\"Chorus of five. Joint catalogue is the regime's anthem.\"", [{ label: "Honor.", next: "honor", flag: "mercy_at_grudge_high_accumulation_reveal" }, { label: "Pull one to the bench.", next: "pull", flag: "aggression_at_grudge_high_accumulation_reveal" }]),
  honor: t("honor", "nemesis", "\"Honored.\""),
  pull: t("pull", "nemesis", "\"Pulled.\""),
});

const NR_L = tree("artisan_vs_wanderer.name_reveal_moment.low", {
  root: t("root", "nemesis", "Antiquarian's Journal margin. Wanderer-Nemesis's name surfaces. \"You have my name. The road's milestones have it engraved every fifty paces.\"", [{ label: "Say softly.", next: "say", flag: "mercy_at_grudge_low_name_reveal_moment" }, { label: "File at the workshop.", next: "file", flag: "aggression_at_grudge_low_name_reveal_moment" }]),
  say: t("say", "nemesis", "\"Said.\""),
  file: t("file", "nemesis", "\"Filed.\""),
});
const NR_M = tree("artisan_vs_wanderer.name_reveal_moment.mid", {
  root: t("root", "nemesis", "\"You know my name. Use it.\"", [{ label: "Cite in your next provenance.", next: "cite", flag: "mercy_at_grudge_mid_name_reveal_moment" }, { label: "Strike from the milestones.", next: "strike", flag: "aggression_at_grudge_mid_name_reveal_moment" }]),
  cite: t("cite", "nemesis", "\"Cited. The Antiquarian framed it.\""),
  strike: t("strike", "nemesis", "\"Denied. The milestones held.\""),
});
const NR_H = tree("artisan_vs_wanderer.name_reveal_moment.high", {
  root: t("root", "nemesis", "\"Use my name. Speak it as you choose.\"", [{ label: "Speak as commission.", next: "comm", flag: "mercy_at_grudge_high_name_reveal_moment" }, { label: "Speak as warning.", next: "warn", flag: "aggression_at_grudge_high_name_reveal_moment" }]),
  comm: t("comm", "nemesis", "\"As commission. I am, for one beat, your artisan.\""),
  warn: t("warn", "nemesis", "\"As warning. The road tightened.\""),
});

const FE_L = tree("artisan_vs_wanderer.final_encounter.low", {
  root: t("root", "nemesis", "Convergence Seat throne room. Wanderer-Nemesis at the Seat with one final found-object. \"Act Seven. Take it or leave it.\"", [{ label: "Take.", next: "take", flag: "mercy_at_grudge_low_final_encounter" }, { label: "Leave.", next: "leave", flag: "aggression_at_grudge_low_final_encounter" }]),
  take: t("take", "nemesis", "\"Taken.\""),
  leave: t("leave", "nemesis", "\"Left.\""),
});
const FE_M = tree("artisan_vs_wanderer.final_encounter.mid", {
  root: t("root", "nemesis", "\"End of the arc. The catalogue is closing.\"", [{ label: "Sign jointly.", next: "sign", flag: "mercy_at_grudge_mid_final_encounter" }, { label: "Let it close.", next: "close", flag: "aggression_at_grudge_mid_final_encounter" }]),
  sign: t("sign", "nemesis", "\"Signed.\""),
  close: t("close", "nemesis", "\"Closed.\""),
});
const FE_H = tree("artisan_vs_wanderer.final_encounter.high", {
  root: t("root", "nemesis", "\"The chronicle is folding. Seven cohorts of you building; seven cohorts of me finding. Same artifact, two readings. Read it one more time, with me.\"", [{ label: "Read together.", next: "read", flag: "mercy_at_grudge_high_final_encounter" }, { label: "Break the artifact.", next: "break", flag: "aggression_at_grudge_high_final_encounter" }]),
  read: t("read", "nemesis", "\"The line: 'the made and the found are two readings of the same chronicle.' Closed together.\"", [{ label: "Hold to the end.", next: "hold" }]),
  hold: t("hold", "nemesis", "\"Held.\""),
  break: t("break", "nemesis", "\"Broken. The fragments fall in a pattern. Read the pattern in absence.\""),
});

export const artisanVsWandererPairBank: NemesisPairBank = {
  pairId: "artisan_vs_wanderer", playerArchetype: "artisan", nemesisArchetype: "wanderer",
  scenes: {
    first_sighting: makeScene({ low: FS_L, mid: FS_M, high: FS_H }),
    sabotage_caught_in_act: makeScene({ low: SC_L, mid: SC_M, high: SC_H }),
    mocking_interlude: makeScene({ low: MI_L, mid: MI_M, high: MI_H }),
    lieutenant_promotion: makeScene({ low: LP_L, mid: LP_M, high: LP_H }),
    cohort_end_confrontation: makeScene({ low: CE_L, mid: CE_M, high: CE_H }),
    accumulation_reveal: makeScene({ low: AR_L, mid: AR_M, high: AR_H }),
    name_reveal_moment: makeScene({ low: NR_L, mid: NR_M, high: NR_H }),
    final_encounter: makeScene({ low: FE_L, mid: FE_M, high: FE_H }),
  },
};
