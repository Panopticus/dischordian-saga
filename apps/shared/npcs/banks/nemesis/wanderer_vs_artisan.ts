/* WANDERER-PLAYER vs. ARTISAN-NEMESIS — Phase K Wave 7E (canon, reverse)
   Found vs built. You collect from the road; Artisan-Nemesis crafts at the bench.
   Surfaces: trade waystation, Mechronis workshop, Antiquarian's artifact-registry, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

const node = (id: string, text: string, choices?: { l: string; n: string; f?: string }[]) => ({
  id, speaker: "nemesis" as const, voLineId: `nemesis.wanderer_vs_artisan.${id}`, onscreenText: text,
  choices: choices?.map(c => ({ label: c.l, nextId: c.n, sets: c.f })),
});
const tree = (id: string, nodes: Record<string, ReturnType<typeof node>>): DialogTree => ({ id, nodes });

const FS_L = tree("wanderer_vs_artisan.first_sighting.low", {
  root: node("root", "Trade waystation. You unpack a road-found object. The Artisan-Nemesis at the workshop bench across the yard recognizes the form. \"You found one of mine. The Politician's primer: 'the road-found is the bench-built returned by way of travel.' Trade it back?\"", [{ l: "Trade it back.", n: "trade", f: "mercy_at_grudge_low_first_sighting" }, { l: "Keep it. The road keeps what it finds.", n: "keep", f: "aggression_at_grudge_low_first_sighting" }]),
  trade: node("trade", "\"Traded. The Adjudicator's artifact-registry logs the return.\"", [{ l: "Walk on.", n: "trade_walk" }]),
  trade_walk: node("trade_walk", "\"Walked.\""),
  keep: node("keep", "\"Kept. The Artisan filed a recovery petition.\""),
});
const FS_M = tree("wanderer_vs_artisan.first_sighting.mid", {
  root: node("root", "\"Three found objects. Three trades or refusals. The registry is filling.\"", [{ l: "Co-curate.", n: "co", f: "mercy_at_grudge_mid_first_sighting" }, { l: "Petition separate catalogues.", n: "pet", f: "aggression_at_grudge_mid_first_sighting" }]),
  co: node("co", "\"Co-curated.\""),
  pet: node("pet", "\"Denied.\""),
});
const FS_H = tree("wanderer_vs_artisan.first_sighting.high", {
  root: node("root", "\"I have left the bench. The road is teaching me. Walk with me.\"", [{ l: "Walk with them.", n: "walk_with", f: "mercy_at_grudge_high_first_sighting" }, { l: "Refuse. The road is yours.", n: "refuse", f: "aggression_at_grudge_high_first_sighting" }]),
  walk_with: node("walk_with", "\"Walked.\"", [{ l: "Continue.", n: "ww_cont" }]),
  ww_cont: node("ww_cont", "\"The road remembers two travelers.\""),
  refuse: node("refuse", "\"Refused.\""),
});

const SC_L = tree("wanderer_vs_artisan.sabotage_caught_in_act.low", {
  root: node("root", "Mechronis workshop, after hours. You sneak past with a road-pack. The Artisan-Nemesis lifts a lantern. \"You are taking unfinished work. The Politician's primer: 'the unfinished work that the road takes is the work the chronicle finishes elsewhere.' Take it. File the form.\"", [{ l: "File the form.", n: "file", f: "mercy_at_grudge_low_sabotage_caught_in_act" }, { l: "Refuse to file.", n: "refuse", f: "aggression_at_grudge_low_sabotage_caught_in_act" }]),
  file: node("file", "\"Filed.\""),
  refuse: node("refuse", "\"Refused. The work went into evidence.\""),
});
const SC_M = tree("wanderer_vs_artisan.sabotage_caught_in_act.mid", {
  root: node("root", "\"Same workshop. You have started bringing road-finds to the bench so I can study them. The Politician's primer: 'the studied find is the find that becomes a commission.'\"", [{ l: "Continue bringing finds.", n: "cont", f: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { l: "Stop. The road must stay separate.", n: "stop", f: "aggression_at_grudge_mid_sabotage_caught_in_act" }]),
  cont: node("cont", "\"Continued.\""),
  stop: node("stop", "\"Stopped.\""),
});
const SC_H = tree("wanderer_vs_artisan.sabotage_caught_in_act.high", {
  root: node("root", "\"I am at the workshop without a piece in hand. I want you to make a commission for the next leg of the road. The Politician's primer: 'the commissioned road is the chronicle's most expensive itinerary.'\"", [{ l: "Commission it.", n: "comm", f: "mercy_at_grudge_high_sabotage_caught_in_act" }, { l: "Refuse.", n: "refuse", f: "aggression_at_grudge_high_sabotage_caught_in_act" }]),
  comm: node("comm", "\"Commissioned.\"", [{ l: "Pay the artisan.", n: "comm_pay" }]),
  comm_pay: node("comm_pay", "\"Paid.\""),
  refuse: node("refuse", "\"Refused.\""),
});

const MI_L = tree("wanderer_vs_artisan.mocking_interlude.low", {
  root: node("root", "Antiquarian's artifact-registry. Artisan-Nemesis grades road-finds against bench standards. \"You delivered three finds. One was, in form, indistinguishable from my apprentice's senior project.\"", [{ l: "Acknowledge.", n: "ack", f: "mercy_at_grudge_low_mocking_interlude" }, { l: "Dispute the grading.", n: "dispute", f: "aggression_at_grudge_low_mocking_interlude" }]),
  ack: node("ack", "\"Acknowledged.\""),
  dispute: node("dispute", "\"Disputed. Denied.\""),
});
const MI_M = tree("wanderer_vs_artisan.mocking_interlude.mid", {
  root: node("root", "\"The registry catalogues us as a pair. The Politician's primer: 'the paired catalogue is the chronicle's most efficient curatorship.'\"", [{ l: "Co-curate.", n: "co", f: "mercy_at_grudge_mid_mocking_interlude" }, { l: "Refuse.", n: "refuse", f: "aggression_at_grudge_mid_mocking_interlude" }]),
  co: node("co", "\"Co-curated.\""),
  refuse: node("refuse", "\"Refused.\""),
});
const MI_H = tree("wanderer_vs_artisan.mocking_interlude.high", {
  root: node("root", "\"I have stopped grading. I want to walk a road with you. The Politician's primer: 'the Artisan who walks is the Artisan who has found a found-object discipline.'\"", [{ l: "Walk together.", n: "walk", f: "mercy_at_grudge_high_mocking_interlude" }, { l: "Refuse.", n: "refuse", f: "aggression_at_grudge_high_mocking_interlude" }]),
  walk: node("walk", "\"Walked.\"", [{ l: "Continue.", n: "w_cont" }]),
  w_cont: node("w_cont", "\"The chronicle records two walkers, one bench.\""),
  refuse: node("refuse", "\"Refused.\""),
});

const LP_L = tree("wanderer_vs_artisan.lieutenant_promotion.low", {
  root: node("root", "Mechronis Academy workshop-coordinator ceremony. \"They are elevating me. Bless.\"", [{ l: "Bless from the road.", n: "bless", f: "mercy_at_grudge_low_lieutenant_promotion" }, { l: "Object.", n: "obj", f: "aggression_at_grudge_low_lieutenant_promotion" }]),
  bless: node("bless", "\"Blessed.\""),
  obj: node("obj", "\"Denied.\""),
});
const LP_M = tree("wanderer_vs_artisan.lieutenant_promotion.mid", {
  root: node("root", "\"Workshop-Coordinator. My cell of four crafts for four waystations.\"", [{ l: "Bring road-finds.", n: "bring", f: "mercy_at_grudge_mid_lieutenant_promotion" }, { l: "Audit the cell.", n: "audit", f: "aggression_at_grudge_mid_lieutenant_promotion" }]),
  bring: node("bring", "\"Brought.\""),
  audit: node("audit", "\"Audited.\""),
});
const LP_H = tree("wanderer_vs_artisan.lieutenant_promotion.high", {
  root: node("root", "\"New artifact code drafting. Co-author.\"", [{ l: "Co-author.", n: "co", f: "mercy_at_grudge_high_lieutenant_promotion" }, { l: "Refuse.", n: "refuse", f: "aggression_at_grudge_high_lieutenant_promotion" }]),
  co: node("co", "\"Signed.\"", [{ l: "Hand them the pen.", n: "co_pen" }]),
  co_pen: node("co_pen", "\"Permanent.\""),
  refuse: node("refuse", "\"The chronicle finished without you.\""),
});

const CE_L = tree("wanderer_vs_artisan.cohort_end_confrontation.low", {
  root: node("root", "Cohort hall. Your apprentice graduated with a road-find as their signature piece. The Artisan-Nemesis examines the find.", [{ l: "Honor the dual reading.", n: "ack", f: "mercy_at_grudge_low_cohort_end_confrontation" }, { l: "Refuse the bench's grading.", n: "refuse", f: "aggression_at_grudge_low_cohort_end_confrontation" }]),
  ack: node("ack", "\"Honored.\""),
  refuse: node("refuse", "\"Refused.\""),
});
const CE_M = tree("wanderer_vs_artisan.cohort_end_confrontation.mid", {
  root: node("root", "\"Listed as 'road/bench, paired.'\"", [{ l: "Acknowledge.", n: "ack", f: "mercy_at_grudge_mid_cohort_end_confrontation" }, { l: "Petition separate.", n: "pet", f: "aggression_at_grudge_mid_cohort_end_confrontation" }]),
  ack: node("ack", "\"Acknowledged.\""),
  pet: node("pet", "\"Denied.\""),
});
const CE_H = tree("wanderer_vs_artisan.cohort_end_confrontation.high", {
  root: node("root", "\"Your apprentice signed a joint provenance with the Artisan's mark and a road-stamp.\"", [{ l: "Accept.", n: "acc", f: "mercy_at_grudge_high_cohort_end_confrontation" }, { l: "Refuse.", n: "refuse", f: "aggression_at_grudge_high_cohort_end_confrontation" }]),
  acc: node("acc", "\"Accepted.\""),
  refuse: node("refuse", "\"Refused. Held open.\""),
});

const AR_L = tree("wanderer_vs_artisan.accumulation_reveal.low", {
  root: node("root", "Matrix-archive intake. New sibling-release. Artisan-Nemesis assigns a bench.", [{ l: "Welcome.", n: "wel", f: "mercy_at_grudge_low_accumulation_reveal" }, { l: "Reassign to the road.", n: "road", f: "aggression_at_grudge_low_accumulation_reveal" }]),
  wel: node("wel", "\"Welcomed.\""),
  road: node("road", "\"Reassigned.\""),
});
const AR_M = tree("wanderer_vs_artisan.accumulation_reveal.mid", {
  root: node("root", "\"Four releases. The catalogue grew.\"", [{ l: "Bless.", n: "bless", f: "mercy_at_grudge_mid_accumulation_reveal" }, { l: "Cull old finds.", n: "cull", f: "aggression_at_grudge_mid_accumulation_reveal" }]),
  bless: node("bless", "\"Blessed.\""),
  cull: node("cull", "\"Culled.\""),
});
const AR_H = tree("wanderer_vs_artisan.accumulation_reveal.high", {
  root: node("root", "\"Chorus of five. Joint catalogue is the regime's anthem.\"", [{ l: "Honor.", n: "honor", f: "mercy_at_grudge_high_accumulation_reveal" }, { l: "Pull one to the road.", n: "pull", f: "aggression_at_grudge_high_accumulation_reveal" }]),
  honor: node("honor", "\"Honored.\""),
  pull: node("pull", "\"Pulled.\""),
});

const NR_L = tree("wanderer_vs_artisan.name_reveal_moment.low", {
  root: node("root", "Antiquarian's Journal margin. Artisan-Nemesis's name surfaces, stamped on every piece they have ever made.", [{ l: "Say softly.", n: "say", f: "mercy_at_grudge_low_name_reveal_moment" }, { l: "File at the registry.", n: "file", f: "aggression_at_grudge_low_name_reveal_moment" }]),
  say: node("say", "\"Said.\""),
  file: node("file", "\"Filed.\""),
});
const NR_M = tree("wanderer_vs_artisan.name_reveal_moment.mid", {
  root: node("root", "\"You know my name. Use it.\"", [{ l: "Cite in your next road-log.", n: "cite", f: "mercy_at_grudge_mid_name_reveal_moment" }, { l: "Strike from the registry.", n: "strike", f: "aggression_at_grudge_mid_name_reveal_moment" }]),
  cite: node("cite", "\"Cited.\""),
  strike: node("strike", "\"Denied.\""),
});
const NR_H = tree("wanderer_vs_artisan.name_reveal_moment.high", {
  root: node("root", "\"Use my name. Speak it as you choose.\"", [{ l: "Speak as commission.", n: "comm", f: "mercy_at_grudge_high_name_reveal_moment" }, { l: "Speak as forgery accusation.", n: "forge", f: "aggression_at_grudge_high_name_reveal_moment" }]),
  comm: node("comm", "\"As commission. I am, for one beat, your artisan.\""),
  forge: node("forge", "\"As forgery. The Adjudicator opens an inquiry.\""),
});

const FE_L = tree("wanderer_vs_artisan.final_encounter.low", {
  root: node("root", "Convergence Seat. Artisan-Nemesis at the Seat with one final piece. \"Act Seven. Take it or leave it.\"", [{ l: "Take.", n: "take", f: "mercy_at_grudge_low_final_encounter" }, { l: "Leave.", n: "leave", f: "aggression_at_grudge_low_final_encounter" }]),
  take: node("take", "\"Taken.\""),
  leave: node("leave", "\"Left.\""),
});
const FE_M = tree("wanderer_vs_artisan.final_encounter.mid", {
  root: node("root", "\"End of arc. The catalogue is closing.\"", [{ l: "Sign jointly.", n: "sign", f: "mercy_at_grudge_mid_final_encounter" }, { l: "Let it close.", n: "close", f: "aggression_at_grudge_mid_final_encounter" }]),
  sign: node("sign", "\"Signed.\""),
  close: node("close", "\"Closed.\""),
});
const FE_H = tree("wanderer_vs_artisan.final_encounter.high", {
  root: node("root", "\"The chronicle is folding. Seven cohorts of you finding; seven cohorts of me building. Same artifact, two readings.\"", [{ l: "Read together.", n: "read", f: "mercy_at_grudge_high_final_encounter" }, { l: "Break the artifact.", n: "break", f: "aggression_at_grudge_high_final_encounter" }]),
  read: node("read", "\"Closed together.\"", [{ l: "Hold.", n: "hold" }]),
  hold: node("hold", "\"Held.\""),
  break: node("break", "\"Broken. The fragments fall in a pattern.\""),
});

export const wandererVsArtisanPairBank: NemesisPairBank = {
  pairId: "wanderer_vs_artisan", playerArchetype: "wanderer", nemesisArchetype: "artisan",
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
