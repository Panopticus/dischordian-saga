/* SENTINEL-PLAYER vs. MARTYR-NEMESIS — Phase K Wave 7I (canon)
   Hold-the-post vs. sacrifice-the-self. Cost-bearer dual reversed.
   Surfaces: Adjudicator's house, Memorial Wall, Hub vote-floor, Mechronis post, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";
const n = (id: string, text: string, choices?: { l: string; n: string; f?: string }[]) => ({ id, speaker: "nemesis" as const, voLineId: `nemesis.sentinel_vs_martyr.${id}`, onscreenText: text, choices: choices?.map(c => ({ label: c.l, nextId: c.n, sets: c.f })) });
const tr = (id: string, nodes: Record<string, ReturnType<typeof n>>): DialogTree => ({ id, nodes });

const FS_L = tr("sentinel_vs_martyr.first_sighting.low", { root: n("root", "Adjudicator's house. You stand the watch. Martyr-Nemesis at the threshold has burns from yesterday's fall. \"You hold. I fall. The Politician taught us — only the column changes.\"", [{ l: "Acknowledge the fall.", n: "ac", f: "mercy_at_grudge_low_first_sighting" }, { l: "Refuse the equivalence.", n: "rf", f: "aggression_at_grudge_low_first_sighting" }]), ac: n("ac", "\"Acknowledged.\""), rf: n("rf", "\"Refused.\"") });
const FS_M = tr("sentinel_vs_martyr.first_sighting.mid", { root: n("root", "\"Six falls. Six watches. Same ledger.\"", [{ l: "Carry one fall with her.", n: "cf", f: "mercy_at_grudge_mid_first_sighting" }, { l: "Hold your post.", n: "hp", f: "aggression_at_grudge_mid_first_sighting" }]), cf: n("cf", "\"Carried.\""), hp: n("hp", "\"Held. She fell alone.\"") });
const FS_H = tr("sentinel_vs_martyr.first_sighting.high", { root: n("root", "\"I have fallen while you stood. Teach me to stand.\"", [{ l: "Teach.", n: "tc", f: "mercy_at_grudge_high_first_sighting" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_first_sighting" }]), tc: n("tc", "\"Taught.\"", [{ l: "Hand her a post.", n: "tc_p" }]), tc_p: n("tc_p", "\"Held.\""), ref: n("ref", "\"Refused. She fell.\"") });

const SC_L = tr("sentinel_vs_martyr.sabotage_caught_in_act.low", { root: n("root", "Memorial Wall. Martyr-Nemesis lights a candle for the post you hold.", [{ l: "Allow.", n: "al", f: "mercy_at_grudge_low_sabotage_caught_in_act" }, { l: "Snuff it.", n: "sn", f: "aggression_at_grudge_low_sabotage_caught_in_act" }]), al: n("al", "\"Allowed.\""), sn: n("sn", "\"Snuffed.\"") });
const SC_M = tr("sentinel_vs_martyr.sabotage_caught_in_act.mid", { root: n("root", "\"Every candle for your post. Every post a future candle. The Politician's primer.\"", [{ l: "Light one with her.", n: "lt", f: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { l: "Strike from record.", n: "st", f: "aggression_at_grudge_mid_sabotage_caught_in_act" }]), lt: n("lt", "\"Lit.\""), st: n("st", "\"Denied.\"") });
const SC_H = tr("sentinel_vs_martyr.sabotage_caught_in_act.high", { root: n("root", "\"I want to hold a post once. Help me find it.\"", [{ l: "Help.", n: "hp", f: "mercy_at_grudge_high_sabotage_caught_in_act" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_sabotage_caught_in_act" }]), hp: n("hp", "\"Helped.\"", [{ l: "Step aside for her.", n: "hp_s" }]), hp_s: n("hp_s", "\"Held.\""), ref: n("ref", "\"Refused. She fell again.\"") });

const MI_L = tr("sentinel_vs_martyr.mocking_interlude.low", { root: n("root", "Hub vote-floor. Martyr-Nemesis publishes a list of posts not held.", [{ l: "Read.", n: "rd", f: "mercy_at_grudge_low_mocking_interlude" }, { l: "Strike the list.", n: "st", f: "aggression_at_grudge_low_mocking_interlude" }]), rd: n("rd", "\"Read.\""), st: n("st", "\"Refiled.\"") });
const MI_M = tr("sentinel_vs_martyr.mocking_interlude.mid", { root: n("root", "\"You stand. I fall. Same chronicle accepts both.\"", [{ l: "Co-sign her latest.", n: "cs", f: "mercy_at_grudge_mid_mocking_interlude" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_mocking_interlude" }]), cs: n("cs", "\"Co-signed.\""), st: n("st", "\"Denied.\"") });
const MI_H = tr("sentinel_vs_martyr.mocking_interlude.high", { root: n("root", "\"Let me stand one of your watches. Quietly.\"", [{ l: "Pass the post.", n: "pp", f: "mercy_at_grudge_high_mocking_interlude" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_mocking_interlude" }]), pp: n("pp", "\"Held.\""), ref: n("ref", "\"Refused.\"") });

const LP_L = tr("sentinel_vs_martyr.lieutenant_promotion.low", { root: n("root", "Memorial Wall candle-warden ceremony.", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_low_lieutenant_promotion" }, { l: "Object.", n: "ob", f: "aggression_at_grudge_low_lieutenant_promotion" }]), bl: n("bl", "\"Blessed.\""), ob: n("ob", "\"Denied.\"") });
const LP_M = tr("sentinel_vs_martyr.lieutenant_promotion.mid", { root: n("root", "\"Candle-Warden. Four walls.\"", [{ l: "Send a name.", n: "sn", f: "mercy_at_grudge_mid_lieutenant_promotion" }, { l: "Audit the wall.", n: "au", f: "aggression_at_grudge_mid_lieutenant_promotion" }]), sn: n("sn", "\"Sent.\""), au: n("au", "\"Audited.\"") });
const LP_H = tr("sentinel_vs_martyr.lieutenant_promotion.high", { root: n("root", "\"New rite-code. Co-author.\"", [{ l: "Co-author.", n: "co", f: "mercy_at_grudge_high_lieutenant_promotion" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_lieutenant_promotion" }]), co: n("co", "\"Signed.\"", [{ l: "Carve.", n: "co_c" }]), co_c: n("co_c", "\"Permanent.\""), ref: n("ref", "\"Finished without you.\"") });

const CE_L = tr("sentinel_vs_martyr.cohort_end_confrontation.low", { root: n("root", "Cohort hall. Your apprentice graduated holding their post. Martyr-Nemesis lit a candle for the graduation.", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_low_cohort_end_confrontation" }, { l: "Snuff.", n: "sn", f: "aggression_at_grudge_low_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), sn: n("sn", "\"Snuffed.\"") });
const CE_M = tr("sentinel_vs_martyr.cohort_end_confrontation.mid", { root: n("root", "\"Cohort registered as 'cost paid in two columns.'\"", [{ l: "Sign both.", n: "sb", f: "mercy_at_grudge_mid_cohort_end_confrontation" }, { l: "Petition separate.", n: "pt", f: "aggression_at_grudge_mid_cohort_end_confrontation" }]), sb: n("sb", "\"Permanent.\""), pt: n("pt", "\"Denied.\"") });
const CE_H = tr("sentinel_vs_martyr.cohort_end_confrontation.high", { root: n("root", "\"Your apprentice surpassed both columns. They stood and fell.\"", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_high_cohort_end_confrontation" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), ref: n("ref", "\"Refused.\"") });

const AR_L = tr("sentinel_vs_martyr.accumulation_reveal.low", { root: n("root", "Matrix-archive intake. New sibling-release at the wall.", [{ l: "Welcome.", n: "wl", f: "mercy_at_grudge_low_accumulation_reveal" }, { l: "Demand.", n: "dm", f: "aggression_at_grudge_low_accumulation_reveal" }]), wl: n("wl", "\"Welcomed.\""), dm: n("dm", "\"Declared.\"") });
const AR_M = tr("sentinel_vs_martyr.accumulation_reveal.mid", { root: n("root", "\"Four martyrs at four walls.\"", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_mid_accumulation_reveal" }, { l: "Strike one wall.", n: "st", f: "aggression_at_grudge_mid_accumulation_reveal" }]), bl: n("bl", "\"Blessed.\""), st: n("st", "\"Struck.\"") });
const AR_H = tr("sentinel_vs_martyr.accumulation_reveal.high", { root: n("root", "\"Chorus of falls.\"", [{ l: "Honor.", n: "hn", f: "mercy_at_grudge_high_accumulation_reveal" }, { l: "Recruit one to stand.", n: "rc", f: "aggression_at_grudge_high_accumulation_reveal" }]), hn: n("hn", "\"Honored.\""), rc: n("rc", "\"Recruited.\"") });

const NR_L = tr("sentinel_vs_martyr.name_reveal_moment.low", { root: n("root", "Adjudicator's roster. Martyr-Nemesis's name is logged beside yours.", [{ l: "Say softly.", n: "sy", f: "mercy_at_grudge_low_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_low_name_reveal_moment" }]), sy: n("sy", "\"Said.\""), st: n("st", "\"Refiled.\"") });
const NR_M = tr("sentinel_vs_martyr.name_reveal_moment.mid", { root: n("root", "\"Use my name on the roster.\"", [{ l: "Speak.", n: "sp", f: "mercy_at_grudge_mid_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_name_reveal_moment" }]), sp: n("sp", "\"Spoken.\""), st: n("st", "\"Denied.\"") });
const NR_H = tr("sentinel_vs_martyr.name_reveal_moment.high", { root: n("root", "\"Speak my name.\"", [{ l: "As fellow-witness.", n: "fw", f: "mercy_at_grudge_high_name_reveal_moment" }, { l: "As trespass.", n: "tr", f: "aggression_at_grudge_high_name_reveal_moment" }]), fw: n("fw", "\"Witnessed.\""), tr: n("tr", "\"Indicted.\"") });

const FE_L = tr("sentinel_vs_martyr.final_encounter.low", { root: n("root", "Convergence Seat. Martyr-Nemesis lights one last candle.", [{ l: "Let it burn.", n: "lb", f: "mercy_at_grudge_low_final_encounter" }, { l: "Snuff.", n: "sn", f: "aggression_at_grudge_low_final_encounter" }]), lb: n("lb", "\"Burned.\""), sn: n("sn", "\"Snuffed.\"") });
const FE_M = tr("sentinel_vs_martyr.final_encounter.mid", { root: n("root", "\"End of arc.\"", [{ l: "Co-sign.", n: "cs", f: "mercy_at_grudge_mid_final_encounter" }, { l: "Let close.", n: "cl", f: "aggression_at_grudge_mid_final_encounter" }]), cs: n("cs", "\"Signed.\""), cl: n("cl", "\"Closed.\"") });
const FE_H = tr("sentinel_vs_martyr.final_encounter.high", { root: n("root", "\"The chronicle is folding. Fall one last time with me.\"", [{ l: "Fall together.", n: "fl", f: "mercy_at_grudge_high_final_encounter" }, { l: "Hold while she falls.", n: "hd", f: "aggression_at_grudge_high_final_encounter" }]), fl: n("fl", "\"Closed together.\"", [{ l: "Hold.", n: "fl_h" }]), fl_h: n("fl_h", "\"Held.\""), hd: n("hd", "\"Held alone.\"") });

export const sentinelVsMartyrPairBank: NemesisPairBank = {
  pairId: "sentinel_vs_martyr", playerArchetype: "sentinel", nemesisArchetype: "martyr",
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
