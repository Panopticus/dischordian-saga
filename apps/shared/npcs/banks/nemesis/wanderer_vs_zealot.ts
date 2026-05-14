/* WANDERER-PLAYER vs. ZEALOT-NEMESIS — Phase K Wave 7L (canon)
   The road vs. the cause. Drift vs. commitment.
   Surfaces: Trade waystation, Insurgency commitment hall, Mechronis crossroad, Hub, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";
const n = (id: string, text: string, choices?: { l: string; n: string; f?: string }[]) => ({ id, speaker: "nemesis" as const, voLineId: `nemesis.wanderer_vs_zealot.${id}`, onscreenText: text, choices: choices?.map(c => ({ label: c.l, nextId: c.n, sets: c.f })) });
const tr = (id: string, nodes: Record<string, ReturnType<typeof n>>): DialogTree => ({ id, nodes });

const FS_L = tr("wanderer_vs_zealot.first_sighting.low", { root: n("root", "Trade waystation. You arrive on a road. Zealot-Nemesis at the desk holds a cause-oath stamped with your name. \"You drift. I commit. The Politician's primer: both end at the same gate.\"", [{ l: "Acknowledge the gate.", n: "ac", f: "mercy_at_grudge_low_first_sighting" }, { l: "Refuse the equivalence.", n: "rf", f: "aggression_at_grudge_low_first_sighting" }]), ac: n("ac", "\"Acknowledged.\""), rf: n("rf", "\"Refused.\"") });
const FS_M = tr("wanderer_vs_zealot.first_sighting.mid", { root: n("root", "\"Six roads. Six oaths.\"", [{ l: "Sign one with him.", n: "sn", f: "mercy_at_grudge_mid_first_sighting" }, { l: "Walk away.", n: "wa", f: "aggression_at_grudge_mid_first_sighting" }]), sn: n("sn", "\"Signed.\""), wa: n("wa", "\"Walked.\"") });
const FS_H = tr("wanderer_vs_zealot.first_sighting.high", { root: n("root", "\"I have committed while you drifted. Teach me to leave the post.\"", [{ l: "Teach.", n: "tc", f: "mercy_at_grudge_high_first_sighting" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_first_sighting" }]), tc: n("tc", "\"Taught.\"", [{ l: "Hand him a road.", n: "tc_r" }]), tc_r: n("tc_r", "\"Held.\""), ref: n("ref", "\"Refused. He committed.\"") });

const SC_L = tr("wanderer_vs_zealot.sabotage_caught_in_act.low", { root: n("root", "Mechronis crossroad. Zealot-Nemesis plants a cause-banner at the road you were drifting along.", [{ l: "Read.", n: "rd", f: "mercy_at_grudge_low_sabotage_caught_in_act" }, { l: "Strike banner.", n: "st", f: "aggression_at_grudge_low_sabotage_caught_in_act" }]), rd: n("rd", "\"Read.\""), st: n("st", "\"Refiled.\"") });
const SC_M = tr("wanderer_vs_zealot.sabotage_caught_in_act.mid", { root: n("root", "\"Every cause I plant on one of your roads.\"", [{ l: "Co-mark.", n: "cm", f: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_sabotage_caught_in_act" }]), cm: n("cm", "\"Marked.\""), st: n("st", "\"Denied.\"") });
const SC_H = tr("wanderer_vs_zealot.sabotage_caught_in_act.high", { root: n("root", "\"I want to drift once. Help me leave the post.\"", [{ l: "Help.", n: "hp", f: "mercy_at_grudge_high_sabotage_caught_in_act" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_sabotage_caught_in_act" }]), hp: n("hp", "\"Helped.\"", [{ l: "Walk with him.", n: "hp_w" }]), hp_w: n("hp_w", "\"Held.\""), ref: n("ref", "\"Refused. He held.\"") });

const MI_L = tr("wanderer_vs_zealot.mocking_interlude.low", { root: n("root", "Insurgency commitment hall. Zealot-Nemesis lists your unsigned oaths.", [{ l: "Sign one.", n: "s1", f: "mercy_at_grudge_low_mocking_interlude" }, { l: "Strike list.", n: "st", f: "aggression_at_grudge_low_mocking_interlude" }]), s1: n("s1", "\"Signed.\""), st: n("st", "\"Refiled.\"") });
const MI_M = tr("wanderer_vs_zealot.mocking_interlude.mid", { root: n("root", "\"You drift. I commit. Same chronicle.\"", [{ l: "Co-sign.", n: "cs", f: "mercy_at_grudge_mid_mocking_interlude" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_mocking_interlude" }]), cs: n("cs", "\"Co-signed.\""), st: n("st", "\"Denied.\"") });
const MI_H = tr("wanderer_vs_zealot.mocking_interlude.high", { root: n("root", "\"Let me carry one cause for you. Quietly.\"", [{ l: "Pass cause.", n: "pc", f: "mercy_at_grudge_high_mocking_interlude" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_mocking_interlude" }]), pc: n("pc", "\"Held.\""), ref: n("ref", "\"Refused.\"") });

const LP_L = tr("wanderer_vs_zealot.lieutenant_promotion.low", { root: n("root", "Oath-warden ceremony.", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_low_lieutenant_promotion" }, { l: "Object.", n: "ob", f: "aggression_at_grudge_low_lieutenant_promotion" }]), bl: n("bl", "\"Blessed.\""), ob: n("ob", "\"Denied.\"") });
const LP_M = tr("wanderer_vs_zealot.lieutenant_promotion.mid", { root: n("root", "\"Oath-Warden. Four halls.\"", [{ l: "Send a road-mark.", n: "sn", f: "mercy_at_grudge_mid_lieutenant_promotion" }, { l: "Audit.", n: "au", f: "aggression_at_grudge_mid_lieutenant_promotion" }]), sn: n("sn", "\"Sent.\""), au: n("au", "\"Audited.\"") });
const LP_H = tr("wanderer_vs_zealot.lieutenant_promotion.high", { root: n("root", "\"New oath-code. Co-author.\"", [{ l: "Co-author.", n: "co", f: "mercy_at_grudge_high_lieutenant_promotion" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_lieutenant_promotion" }]), co: n("co", "\"Signed.\"", [{ l: "Bind.", n: "co_b" }]), co_b: n("co_b", "\"Permanent.\""), ref: n("ref", "\"Finished without you.\"") });

const CE_L = tr("wanderer_vs_zealot.cohort_end_confrontation.low", { root: n("root", "Cohort hall. Your apprentice graduated on the road. Zealot-Nemesis attached an oath-slip.", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_low_cohort_end_confrontation" }, { l: "Detach.", n: "dt", f: "aggression_at_grudge_low_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), dt: n("dt", "\"Refiled.\"") });
const CE_M = tr("wanderer_vs_zealot.cohort_end_confrontation.mid", { root: n("root", "\"Cohort registered as 'road/cause, paired.'\"", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_mid_cohort_end_confrontation" }, { l: "Petition.", n: "pt", f: "aggression_at_grudge_mid_cohort_end_confrontation" }]), sg: n("sg", "\"Permanent.\""), pt: n("pt", "\"Denied.\"") });
const CE_H = tr("wanderer_vs_zealot.cohort_end_confrontation.high", { root: n("root", "\"Your apprentice walked AND committed. They surpassed both of us.\"", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_high_cohort_end_confrontation" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), ref: n("ref", "\"Refused.\"") });

const AR_L = tr("wanderer_vs_zealot.accumulation_reveal.low", { root: n("root", "Matrix-archive intake. New sibling-release in the hall.", [{ l: "Welcome.", n: "wl", f: "mercy_at_grudge_low_accumulation_reveal" }, { l: "Demand.", n: "dm", f: "aggression_at_grudge_low_accumulation_reveal" }]), wl: n("wl", "\"Welcomed.\""), dm: n("dm", "\"Declared.\"") });
const AR_M = tr("wanderer_vs_zealot.accumulation_reveal.mid", { root: n("root", "\"Four zealots in four halls.\"", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_mid_accumulation_reveal" }, { l: "Strike one.", n: "st", f: "aggression_at_grudge_mid_accumulation_reveal" }]), bl: n("bl", "\"Blessed.\""), st: n("st", "\"Struck.\"") });
const AR_H = tr("wanderer_vs_zealot.accumulation_reveal.high", { root: n("root", "\"Chorus of committed.\"", [{ l: "Honor.", n: "hn", f: "mercy_at_grudge_high_accumulation_reveal" }, { l: "Recruit one to drift.", n: "rc", f: "aggression_at_grudge_high_accumulation_reveal" }]), hn: n("hn", "\"Honored.\""), rc: n("rc", "\"Recruited.\"") });

const NR_L = tr("wanderer_vs_zealot.name_reveal_moment.low", { root: n("root", "Hall roster. Zealot-Nemesis's name is signed beside yours.", [{ l: "Say softly.", n: "sy", f: "mercy_at_grudge_low_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_low_name_reveal_moment" }]), sy: n("sy", "\"Said.\""), st: n("st", "\"Refiled.\"") });
const NR_M = tr("wanderer_vs_zealot.name_reveal_moment.mid", { root: n("root", "\"Use my name on the roster.\"", [{ l: "Speak.", n: "sp", f: "mercy_at_grudge_mid_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_name_reveal_moment" }]), sp: n("sp", "\"Spoken.\""), st: n("st", "\"Denied.\"") });
const NR_H = tr("wanderer_vs_zealot.name_reveal_moment.high", { root: n("root", "\"Speak my name.\"", [{ l: "As fellow-witness.", n: "fw", f: "mercy_at_grudge_high_name_reveal_moment" }, { l: "As trespass.", n: "tr", f: "aggression_at_grudge_high_name_reveal_moment" }]), fw: n("fw", "\"Witnessed.\""), tr: n("tr", "\"Indicted.\"") });

const FE_L = tr("wanderer_vs_zealot.final_encounter.low", { root: n("root", "Convergence Seat. Zealot-Nemesis with a final oath-slip.", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_low_final_encounter" }, { l: "Walk past.", n: "wp", f: "aggression_at_grudge_low_final_encounter" }]), sg: n("sg", "\"Signed.\""), wp: n("wp", "\"Walked.\"") });
const FE_M = tr("wanderer_vs_zealot.final_encounter.mid", { root: n("root", "\"End of arc.\"", [{ l: "Co-sign.", n: "cs", f: "mercy_at_grudge_mid_final_encounter" }, { l: "Let close.", n: "cl", f: "aggression_at_grudge_mid_final_encounter" }]), cs: n("cs", "\"Signed.\""), cl: n("cl", "\"Closed.\"") });
const FE_H = tr("wanderer_vs_zealot.final_encounter.high", { root: n("root", "\"The chronicle is folding. Hold one oath with me.\"", [{ l: "Hold together.", n: "hd", f: "mercy_at_grudge_high_final_encounter" }, { l: "Drift past.", n: "dp", f: "aggression_at_grudge_high_final_encounter" }]), hd: n("hd", "\"Closed together.\"", [{ l: "Hold.", n: "hd_h" }]), hd_h: n("hd_h", "\"Held.\""), dp: n("dp", "\"Drifted.\"") });

export const wandererVsZealotPairBank: NemesisPairBank = {
  pairId: "wanderer_vs_zealot", playerArchetype: "wanderer", nemesisArchetype: "zealot",
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
