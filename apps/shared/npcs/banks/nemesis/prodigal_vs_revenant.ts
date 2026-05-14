/* PRODIGAL-PLAYER vs. REVENANT-NEMESIS — Phase K Wave 7J (canon)
   Return-to-leave vs. return-to-collect. Homecoming dual reversed.
   Surfaces: Mechronis return-hall, Xeth'Raal's ledger room, Trade waystation, Hub, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";
const n = (id: string, text: string, choices?: { l: string; n: string; f?: string }[]) => ({ id, speaker: "nemesis" as const, voLineId: `nemesis.prodigal_vs_revenant.${id}`, onscreenText: text, choices: choices?.map(c => ({ label: c.l, nextId: c.n, sets: c.f })) });
const tr = (id: string, nodes: Record<string, ReturnType<typeof n>>): DialogTree => ({ id, nodes });

const FS_L = tr("prodigal_vs_revenant.first_sighting.low", { root: n("root", "Mechronis return-hall. You came back to leave again. Revenant-Nemesis came back to collect. \"You shed what's yours. I gather what's mine. Same door. The Politician's primer.\"", [{ l: "Acknowledge.", n: "ac", f: "mercy_at_grudge_low_first_sighting" }, { l: "Refuse the equivalence.", n: "rf", f: "aggression_at_grudge_low_first_sighting" }]), ac: n("ac", "\"Acknowledged.\""), rf: n("rf", "\"Refused.\"") });
const FS_M = tr("prodigal_vs_revenant.first_sighting.mid", { root: n("root", "\"Six departures. Six returns. Same hall.\"", [{ l: "Walk in with her.", n: "wi", f: "mercy_at_grudge_mid_first_sighting" }, { l: "Walk out alone.", n: "wo", f: "aggression_at_grudge_mid_first_sighting" }]), wi: n("wi", "\"Walked.\""), wo: n("wo", "\"Walked. She gathered alone.\"") });
const FS_H = tr("prodigal_vs_revenant.first_sighting.high", { root: n("root", "\"I have returned while you left. Teach me to leave well.\"", [{ l: "Teach.", n: "tc", f: "mercy_at_grudge_high_first_sighting" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_first_sighting" }]), tc: n("tc", "\"Taught.\"", [{ l: "Hand her the door.", n: "tc_d" }]), tc_d: n("tc_d", "\"Held.\""), ref: n("ref", "\"Refused. She gathered.\"") });

const SC_L = tr("prodigal_vs_revenant.sabotage_caught_in_act.low", { root: n("root", "Trade waystation. Revenant-Nemesis is loading what you came to shed.", [{ l: "Allow.", n: "al", f: "mercy_at_grudge_low_sabotage_caught_in_act" }, { l: "Take it back.", n: "tb", f: "aggression_at_grudge_low_sabotage_caught_in_act" }]), al: n("al", "\"Allowed.\""), tb: n("tb", "\"Reclaimed.\"") });
const SC_M = tr("prodigal_vs_revenant.sabotage_caught_in_act.mid", { root: n("root", "\"Every cargo you shed. Every cargo I claim. Same waystation.\"", [{ l: "Joint manifest.", n: "jm", f: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { l: "Strike her name.", n: "st", f: "aggression_at_grudge_mid_sabotage_caught_in_act" }]), jm: n("jm", "\"Signed.\""), st: n("st", "\"Denied.\"") });
const SC_H = tr("prodigal_vs_revenant.sabotage_caught_in_act.high", { root: n("root", "\"I want to leave once. Help me walk out.\"", [{ l: "Help.", n: "hp", f: "mercy_at_grudge_high_sabotage_caught_in_act" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_sabotage_caught_in_act" }]), hp: n("hp", "\"Helped.\"", [{ l: "Walk with her.", n: "hp_w" }]), hp_w: n("hp_w", "\"Held.\""), ref: n("ref", "\"Refused. She gathered again.\"") });

const MI_L = tr("prodigal_vs_revenant.mocking_interlude.low", { root: n("root", "Return-hall. Revenant-Nemesis posts a list of debts she has come back to collect from you.", [{ l: "Pay one.", n: "p1", f: "mercy_at_grudge_low_mocking_interlude" }, { l: "Strike list.", n: "st", f: "aggression_at_grudge_low_mocking_interlude" }]), p1: n("p1", "\"Paid.\""), st: n("st", "\"Refiled.\"") });
const MI_M = tr("prodigal_vs_revenant.mocking_interlude.mid", { root: n("root", "\"You shed. I claim. Same door registers both.\"", [{ l: "Co-sign door.", n: "cs", f: "mercy_at_grudge_mid_mocking_interlude" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_mocking_interlude" }]), cs: n("cs", "\"Co-signed.\""), st: n("st", "\"Denied.\"") });
const MI_H = tr("prodigal_vs_revenant.mocking_interlude.high", { root: n("root", "\"Let me leave one cargo with you. Quietly.\"", [{ l: "Hold.", n: "hd", f: "mercy_at_grudge_high_mocking_interlude" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_mocking_interlude" }]), hd: n("hd", "\"Held.\""), ref: n("ref", "\"Refused.\"") });

const LP_L = tr("prodigal_vs_revenant.lieutenant_promotion.low", { root: n("root", "Return-hall claim-warden ceremony.", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_low_lieutenant_promotion" }, { l: "Object.", n: "ob", f: "aggression_at_grudge_low_lieutenant_promotion" }]), bl: n("bl", "\"Blessed.\""), ob: n("ob", "\"Denied.\"") });
const LP_M = tr("prodigal_vs_revenant.lieutenant_promotion.mid", { root: n("root", "\"Claim-Warden. Four halls.\"", [{ l: "Send a manifest.", n: "sn", f: "mercy_at_grudge_mid_lieutenant_promotion" }, { l: "Audit.", n: "au", f: "aggression_at_grudge_mid_lieutenant_promotion" }]), sn: n("sn", "\"Sent.\""), au: n("au", "\"Audited.\"") });
const LP_H = tr("prodigal_vs_revenant.lieutenant_promotion.high", { root: n("root", "\"New claim-code. Co-author.\"", [{ l: "Co-author.", n: "co", f: "mercy_at_grudge_high_lieutenant_promotion" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_lieutenant_promotion" }]), co: n("co", "\"Signed.\"", [{ l: "Carve.", n: "co_c" }]), co_c: n("co_c", "\"Permanent.\""), ref: n("ref", "\"Finished without you.\"") });

const CE_L = tr("prodigal_vs_revenant.cohort_end_confrontation.low", { root: n("root", "Cohort hall. Your apprentice graduated walking out. Revenant-Nemesis attached a claim-slip.", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_low_cohort_end_confrontation" }, { l: "Detach.", n: "dt", f: "aggression_at_grudge_low_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), dt: n("dt", "\"Refiled.\"") });
const CE_M = tr("prodigal_vs_revenant.cohort_end_confrontation.mid", { root: n("root", "\"Cohort registered as 'depart and return, paired.'\"", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_mid_cohort_end_confrontation" }, { l: "Petition.", n: "pt", f: "aggression_at_grudge_mid_cohort_end_confrontation" }]), sg: n("sg", "\"Permanent.\""), pt: n("pt", "\"Denied.\"") });
const CE_H = tr("prodigal_vs_revenant.cohort_end_confrontation.high", { root: n("root", "\"Your apprentice surpassed both directions.\"", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_high_cohort_end_confrontation" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), ref: n("ref", "\"Refused.\"") });

const AR_L = tr("prodigal_vs_revenant.accumulation_reveal.low", { root: n("root", "Matrix-archive intake. New sibling-release at the door.", [{ l: "Welcome.", n: "wl", f: "mercy_at_grudge_low_accumulation_reveal" }, { l: "Demand.", n: "dm", f: "aggression_at_grudge_low_accumulation_reveal" }]), wl: n("wl", "\"Welcomed.\""), dm: n("dm", "\"Declared.\"") });
const AR_M = tr("prodigal_vs_revenant.accumulation_reveal.mid", { root: n("root", "\"Four revenants at four doors.\"", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_mid_accumulation_reveal" }, { l: "Strike one.", n: "st", f: "aggression_at_grudge_mid_accumulation_reveal" }]), bl: n("bl", "\"Blessed.\""), st: n("st", "\"Struck.\"") });
const AR_H = tr("prodigal_vs_revenant.accumulation_reveal.high", { root: n("root", "\"Chorus of returns.\"", [{ l: "Honor.", n: "hn", f: "mercy_at_grudge_high_accumulation_reveal" }, { l: "Recruit one to depart.", n: "rc", f: "aggression_at_grudge_high_accumulation_reveal" }]), hn: n("hn", "\"Honored.\""), rc: n("rc", "\"Recruited.\"") });

const NR_L = tr("prodigal_vs_revenant.name_reveal_moment.low", { root: n("root", "Xeth'Raal's ledger margin. Revenant-Nemesis's name appears as a claim-line.", [{ l: "Say softly.", n: "sy", f: "mercy_at_grudge_low_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_low_name_reveal_moment" }]), sy: n("sy", "\"Said.\""), st: n("st", "\"Refiled.\"") });
const NR_M = tr("prodigal_vs_revenant.name_reveal_moment.mid", { root: n("root", "\"Use my name on the ledger.\"", [{ l: "Speak.", n: "sp", f: "mercy_at_grudge_mid_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_name_reveal_moment" }]), sp: n("sp", "\"Spoken.\""), st: n("st", "\"Denied.\"") });
const NR_H = tr("prodigal_vs_revenant.name_reveal_moment.high", { root: n("root", "\"Speak my name.\"", [{ l: "As fellow-witness.", n: "fw", f: "mercy_at_grudge_high_name_reveal_moment" }, { l: "As trespass.", n: "tr", f: "aggression_at_grudge_high_name_reveal_moment" }]), fw: n("fw", "\"Witnessed.\""), tr: n("tr", "\"Indicted.\"") });

const FE_L = tr("prodigal_vs_revenant.final_encounter.low", { root: n("root", "Convergence Seat. Revenant-Nemesis with a final claim-slip.", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_low_final_encounter" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_low_final_encounter" }]), sg: n("sg", "\"Signed.\""), st: n("st", "\"Struck.\"") });
const FE_M = tr("prodigal_vs_revenant.final_encounter.mid", { root: n("root", "\"End of arc.\"", [{ l: "Co-sign.", n: "cs", f: "mercy_at_grudge_mid_final_encounter" }, { l: "Let close.", n: "cl", f: "aggression_at_grudge_mid_final_encounter" }]), cs: n("cs", "\"Signed.\""), cl: n("cl", "\"Closed.\"") });
const FE_H = tr("prodigal_vs_revenant.final_encounter.high", { root: n("root", "\"The chronicle is folding. Walk in with me one last time.\"", [{ l: "Walk in together.", n: "wi", f: "mercy_at_grudge_high_final_encounter" }, { l: "Walk out.", n: "wo", f: "aggression_at_grudge_high_final_encounter" }]), wi: n("wi", "\"Closed together.\"", [{ l: "Hold.", n: "wi_h" }]), wi_h: n("wi_h", "\"Held.\""), wo: n("wo", "\"Walked.\"") });

export const prodigalVsRevenantPairBank: NemesisPairBank = {
  pairId: "prodigal_vs_revenant", playerArchetype: "prodigal", nemesisArchetype: "revenant",
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
