/* REVENANT-PLAYER vs. PRODIGAL-NEMESIS — Phase K Wave 7J (canon)
   Return-to-collect vs. return-to-leave. Homecoming dual.
   Surfaces: Xeth'Raal's debt-ledger room, Mechronis return-hall, Trade waystation, Hub, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";
const n = (id: string, text: string, choices?: { l: string; n: string; f?: string }[]) => ({ id, speaker: "nemesis" as const, voLineId: `nemesis.revenant_vs_prodigal.${id}`, onscreenText: text, choices: choices?.map(c => ({ label: c.l, nextId: c.n, sets: c.f })) });
const tr = (id: string, nodes: Record<string, ReturnType<typeof n>>): DialogTree => ({ id, nodes });

const FS_L = tr("revenant_vs_prodigal.first_sighting.low", { root: n("root", "Xeth'Raal's debt-ledger room. You arrived to collect. Prodigal-Nemesis arrived to walk out again. \"You came back to take what's yours. I came back to drop what was mine. The Politician taught us both — only the direction changes.\"", [{ l: "Acknowledge the direction.", n: "ac", f: "mercy_at_grudge_low_first_sighting" }, { l: "Refuse the equivalence.", n: "rf", f: "aggression_at_grudge_low_first_sighting" }]), ac: n("ac", "\"Acknowledged.\""), rf: n("rf", "\"Refused. Same door.\"") });
const FS_M = tr("revenant_vs_prodigal.first_sighting.mid", { root: n("root", "\"Six returns. Six departures. Same ledger.\"", [{ l: "Walk to the door together.", n: "wd", f: "mercy_at_grudge_mid_first_sighting" }, { l: "Hold the ledger.", n: "hl", f: "aggression_at_grudge_mid_first_sighting" }]), wd: n("wd", "\"Walked.\""), hl: n("hl", "\"Held.\"") });
const FS_H = tr("revenant_vs_prodigal.first_sighting.high", { root: n("root", "\"I have left while you returned. Teach me to come back and stay.\"", [{ l: "Teach.", n: "tc", f: "mercy_at_grudge_high_first_sighting" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_first_sighting" }]), tc: n("tc", "\"Taught.\"", [{ l: "Hand the ledger.", n: "tc_l" }]), tc_l: n("tc_l", "\"Held.\""), ref: n("ref", "\"Refused. She left again.\"") });

const SC_L = tr("revenant_vs_prodigal.sabotage_caught_in_act.low", { root: n("root", "Trade waystation. Prodigal-Nemesis is unloading what you came to claim.", [{ l: "Reclaim.", n: "rc", f: "mercy_at_grudge_low_sabotage_caught_in_act" }, { l: "Seize.", n: "sz", f: "aggression_at_grudge_low_sabotage_caught_in_act" }]), rc: n("rc", "\"Reclaimed.\""), sz: n("sz", "\"Seized.\"") });
const SC_M = tr("revenant_vs_prodigal.sabotage_caught_in_act.mid", { root: n("root", "\"Every cargo you collect. Every cargo I drop. Same waystation.\"", [{ l: "Sign a joint manifest.", n: "jm", f: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { l: "Strike her name.", n: "st", f: "aggression_at_grudge_mid_sabotage_caught_in_act" }]), jm: n("jm", "\"Signed.\""), st: n("st", "\"Denied.\"") });
const SC_H = tr("revenant_vs_prodigal.sabotage_caught_in_act.high", { root: n("root", "\"I want to deliver once. Help me carry it back.\"", [{ l: "Help.", n: "hp", f: "mercy_at_grudge_high_sabotage_caught_in_act" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_sabotage_caught_in_act" }]), hp: n("hp", "\"Helped.\"", [{ l: "Walk with her.", n: "hp_w" }]), hp_w: n("hp_w", "\"Held.\""), ref: n("ref", "\"Refused. She left again.\"") });

const MI_L = tr("revenant_vs_prodigal.mocking_interlude.low", { root: n("root", "Mechronis return-hall. Prodigal-Nemesis hands you a list of debts you forgot to collect.", [{ l: "Read.", n: "rd", f: "mercy_at_grudge_low_mocking_interlude" }, { l: "Burn.", n: "bn", f: "aggression_at_grudge_low_mocking_interlude" }]), rd: n("rd", "\"Read.\""), bn: n("bn", "\"Refiled.\"") });
const MI_M = tr("revenant_vs_prodigal.mocking_interlude.mid", { root: n("root", "\"You collect. I drop. Same door registers both.\"", [{ l: "Co-sign the door.", n: "cs", f: "mercy_at_grudge_mid_mocking_interlude" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_mocking_interlude" }]), cs: n("cs", "\"Co-signed.\""), st: n("st", "\"Denied.\"") });
const MI_H = tr("revenant_vs_prodigal.mocking_interlude.high", { root: n("root", "\"Let me carry one of your collections. Quietly.\"", [{ l: "Pass.", n: "ps", f: "mercy_at_grudge_high_mocking_interlude" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_mocking_interlude" }]), ps: n("ps", "\"Held.\""), ref: n("ref", "\"Refused.\"") });

const LP_L = tr("revenant_vs_prodigal.lieutenant_promotion.low", { root: n("root", "Waystation door-warden ceremony.", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_low_lieutenant_promotion" }, { l: "Object.", n: "ob", f: "aggression_at_grudge_low_lieutenant_promotion" }]), bl: n("bl", "\"Blessed.\""), ob: n("ob", "\"Denied.\"") });
const LP_M = tr("revenant_vs_prodigal.lieutenant_promotion.mid", { root: n("root", "\"Door-Warden. Four doors.\"", [{ l: "Send a manifest.", n: "sn", f: "mercy_at_grudge_mid_lieutenant_promotion" }, { l: "Audit.", n: "au", f: "aggression_at_grudge_mid_lieutenant_promotion" }]), sn: n("sn", "\"Sent.\""), au: n("au", "\"Audited.\"") });
const LP_H = tr("revenant_vs_prodigal.lieutenant_promotion.high", { root: n("root", "\"New return-code. Co-author.\"", [{ l: "Co-author.", n: "co", f: "mercy_at_grudge_high_lieutenant_promotion" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_lieutenant_promotion" }]), co: n("co", "\"Signed.\"", [{ l: "Carve at the door.", n: "co_d" }]), co_d: n("co_d", "\"Permanent.\""), ref: n("ref", "\"Finished without you.\"") });

const CE_L = tr("revenant_vs_prodigal.cohort_end_confrontation.low", { root: n("root", "Cohort hall. Your apprentice graduated holding their collection. Prodigal-Nemesis attached a leave-slip.", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_low_cohort_end_confrontation" }, { l: "Detach.", n: "dt", f: "aggression_at_grudge_low_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), dt: n("dt", "\"Refiled.\"") });
const CE_M = tr("revenant_vs_prodigal.cohort_end_confrontation.mid", { root: n("root", "\"Cohort registered as 'return and depart, paired.'\"", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_mid_cohort_end_confrontation" }, { l: "Petition separate.", n: "pt", f: "aggression_at_grudge_mid_cohort_end_confrontation" }]), sg: n("sg", "\"Permanent.\""), pt: n("pt", "\"Denied.\"") });
const CE_H = tr("revenant_vs_prodigal.cohort_end_confrontation.high", { root: n("root", "\"Your apprentice did neither. They came back AND went out. Surpassed both directions.\"", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_high_cohort_end_confrontation" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), ref: n("ref", "\"Refused.\"") });

const AR_L = tr("revenant_vs_prodigal.accumulation_reveal.low", { root: n("root", "Matrix-archive intake. New sibling-release at the door.", [{ l: "Welcome.", n: "wl", f: "mercy_at_grudge_low_accumulation_reveal" }, { l: "Demand.", n: "dm", f: "aggression_at_grudge_low_accumulation_reveal" }]), wl: n("wl", "\"Welcomed.\""), dm: n("dm", "\"Declared.\"") });
const AR_M = tr("revenant_vs_prodigal.accumulation_reveal.mid", { root: n("root", "\"Four prodigals at four doors.\"", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_mid_accumulation_reveal" }, { l: "Strike one door.", n: "st", f: "aggression_at_grudge_mid_accumulation_reveal" }]), bl: n("bl", "\"Blessed.\""), st: n("st", "\"Struck.\"") });
const AR_H = tr("revenant_vs_prodigal.accumulation_reveal.high", { root: n("root", "\"Chorus of leavings.\"", [{ l: "Honor.", n: "hn", f: "mercy_at_grudge_high_accumulation_reveal" }, { l: "Recruit one to return.", n: "rc", f: "aggression_at_grudge_high_accumulation_reveal" }]), hn: n("hn", "\"Honored.\""), rc: n("rc", "\"Recruited.\"") });

const NR_L = tr("revenant_vs_prodigal.name_reveal_moment.low", { root: n("root", "Xeth'Raal's ledger margin. Prodigal-Nemesis's name appears as a leave-line.", [{ l: "Say softly.", n: "sy", f: "mercy_at_grudge_low_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_low_name_reveal_moment" }]), sy: n("sy", "\"Said.\""), st: n("st", "\"Refiled.\"") });
const NR_M = tr("revenant_vs_prodigal.name_reveal_moment.mid", { root: n("root", "\"Use my name on the ledger.\"", [{ l: "Speak.", n: "sp", f: "mercy_at_grudge_mid_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_name_reveal_moment" }]), sp: n("sp", "\"Spoken.\""), st: n("st", "\"Denied.\"") });
const NR_H = tr("revenant_vs_prodigal.name_reveal_moment.high", { root: n("root", "\"Speak my name.\"", [{ l: "As fellow-witness.", n: "fw", f: "mercy_at_grudge_high_name_reveal_moment" }, { l: "As trespass.", n: "tr", f: "aggression_at_grudge_high_name_reveal_moment" }]), fw: n("fw", "\"Witnessed.\""), tr: n("tr", "\"Indicted.\"") });

const FE_L = tr("revenant_vs_prodigal.final_encounter.low", { root: n("root", "Convergence Seat. Prodigal-Nemesis with a final leave-slip.", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_low_final_encounter" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_low_final_encounter" }]), sg: n("sg", "\"Signed.\""), st: n("st", "\"Struck.\"") });
const FE_M = tr("revenant_vs_prodigal.final_encounter.mid", { root: n("root", "\"End of arc.\"", [{ l: "Co-sign.", n: "cs", f: "mercy_at_grudge_mid_final_encounter" }, { l: "Let close.", n: "cl", f: "aggression_at_grudge_mid_final_encounter" }]), cs: n("cs", "\"Signed.\""), cl: n("cl", "\"Closed.\"") });
const FE_H = tr("revenant_vs_prodigal.final_encounter.high", { root: n("root", "\"The chronicle is folding. Walk to the door with me.\"", [{ l: "Walk together.", n: "wt", f: "mercy_at_grudge_high_final_encounter" }, { l: "Hold the ledger.", n: "hl", f: "aggression_at_grudge_high_final_encounter" }]), wt: n("wt", "\"Closed together.\"", [{ l: "Hold.", n: "wt_h" }]), wt_h: n("wt_h", "\"Held.\""), hl: n("hl", "\"Held alone.\"") });

export const revenantVsProdigalPairBank: NemesisPairBank = {
  pairId: "revenant_vs_prodigal", playerArchetype: "revenant", nemesisArchetype: "prodigal",
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
