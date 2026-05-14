/* ZEALOT-PLAYER vs. WANDERER-NEMESIS — Phase K Wave 7L (canon)
   The cause vs. the road. Commitment vs. drift.
   Surfaces: Insurgency commitment hall, Trade waystation, Mechronis crossroad, Hub, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";
const n = (id: string, text: string, choices?: { l: string; n: string; f?: string }[]) => ({ id, speaker: "nemesis" as const, voLineId: `nemesis.zealot_vs_wanderer.${id}`, onscreenText: text, choices: choices?.map(c => ({ label: c.l, nextId: c.n, sets: c.f })) });
const tr = (id: string, nodes: Record<string, ReturnType<typeof n>>): DialogTree => ({ id, nodes });

const FS_L = tr("zealot_vs_wanderer.first_sighting.low", { root: n("root", "Insurgency commitment hall. You sign the cause-oath. Wanderer-Nemesis at the back, road-dust on their boots. \"You commit. I drift. The Politician's primer: the cause and the road both end at the same gate.\"", [{ l: "Acknowledge the gate.", n: "ac", f: "mercy_at_grudge_low_first_sighting" }, { l: "Refuse the equivalence.", n: "rf", f: "aggression_at_grudge_low_first_sighting" }]), ac: n("ac", "\"Acknowledged.\""), rf: n("rf", "\"Refused.\"") });
const FS_M = tr("zealot_vs_wanderer.first_sighting.mid", { root: n("root", "\"Six oaths. Six roads. Same hall.\"", [{ l: "Walk the road with her.", n: "wr", f: "mercy_at_grudge_mid_first_sighting" }, { l: "Hold the oath.", n: "ho", f: "aggression_at_grudge_mid_first_sighting" }]), wr: n("wr", "\"Walked.\""), ho: n("ho", "\"Held.\"") });
const FS_H = tr("zealot_vs_wanderer.first_sighting.high", { root: n("root", "\"I have drifted while you committed. Teach me to plant my feet.\"", [{ l: "Teach.", n: "tc", f: "mercy_at_grudge_high_first_sighting" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_first_sighting" }]), tc: n("tc", "\"Taught.\"", [{ l: "Hand her the oath.", n: "tc_o" }]), tc_o: n("tc_o", "\"Held.\""), ref: n("ref", "\"Refused. She drifted.\"") });

const SC_L = tr("zealot_vs_wanderer.sabotage_caught_in_act.low", { root: n("root", "Mechronis crossroad. Wanderer-Nemesis walks a road that crosses your cause-route.", [{ l: "Let pass.", n: "lp", f: "mercy_at_grudge_low_sabotage_caught_in_act" }, { l: "Block.", n: "bl", f: "aggression_at_grudge_low_sabotage_caught_in_act" }]), lp: n("lp", "\"Passed.\""), bl: n("bl", "\"Blocked.\"") });
const SC_M = tr("zealot_vs_wanderer.sabotage_caught_in_act.mid", { root: n("root", "\"Every road I drift across one of your causes. The Politician's primer.\"", [{ l: "Co-mark the road.", n: "cm", f: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { l: "Strike her road.", n: "st", f: "aggression_at_grudge_mid_sabotage_caught_in_act" }]), cm: n("cm", "\"Marked.\""), st: n("st", "\"Denied.\"") });
const SC_H = tr("zealot_vs_wanderer.sabotage_caught_in_act.high", { root: n("root", "\"I want to take a cause once. Help me commit.\"", [{ l: "Help.", n: "hp", f: "mercy_at_grudge_high_sabotage_caught_in_act" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_sabotage_caught_in_act" }]), hp: n("hp", "\"Helped.\"", [{ l: "Sign the oath together.", n: "hp_s" }]), hp_s: n("hp_s", "\"Signed.\""), ref: n("ref", "\"Refused. She drifted.\"") });

const MI_L = tr("zealot_vs_wanderer.mocking_interlude.low", { root: n("root", "Trade waystation. Wanderer-Nemesis hands you a list of crossroads where your cause meets her road.", [{ l: "Read.", n: "rd", f: "mercy_at_grudge_low_mocking_interlude" }, { l: "Burn.", n: "bn", f: "aggression_at_grudge_low_mocking_interlude" }]), rd: n("rd", "\"Read.\""), bn: n("bn", "\"Refiled.\"") });
const MI_M = tr("zealot_vs_wanderer.mocking_interlude.mid", { root: n("root", "\"You commit. I drift. Same chronicle.\"", [{ l: "Co-sign.", n: "cs", f: "mercy_at_grudge_mid_mocking_interlude" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_mocking_interlude" }]), cs: n("cs", "\"Co-signed.\""), st: n("st", "\"Denied.\"") });
const MI_H = tr("zealot_vs_wanderer.mocking_interlude.high", { root: n("root", "\"Let me walk one road for you. Quietly.\"", [{ l: "Pass road.", n: "pr", f: "mercy_at_grudge_high_mocking_interlude" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_mocking_interlude" }]), pr: n("pr", "\"Held.\""), ref: n("ref", "\"Refused.\"") });

const LP_L = tr("zealot_vs_wanderer.lieutenant_promotion.low", { root: n("root", "Crossroad-warden ceremony.", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_low_lieutenant_promotion" }, { l: "Object.", n: "ob", f: "aggression_at_grudge_low_lieutenant_promotion" }]), bl: n("bl", "\"Blessed.\""), ob: n("ob", "\"Denied.\"") });
const LP_M = tr("zealot_vs_wanderer.lieutenant_promotion.mid", { root: n("root", "\"Crossroad-Warden. Four roads.\"", [{ l: "Send a banner.", n: "sn", f: "mercy_at_grudge_mid_lieutenant_promotion" }, { l: "Audit.", n: "au", f: "aggression_at_grudge_mid_lieutenant_promotion" }]), sn: n("sn", "\"Sent.\""), au: n("au", "\"Audited.\"") });
const LP_H = tr("zealot_vs_wanderer.lieutenant_promotion.high", { root: n("root", "\"New road-code. Co-author.\"", [{ l: "Co-author.", n: "co", f: "mercy_at_grudge_high_lieutenant_promotion" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_lieutenant_promotion" }]), co: n("co", "\"Signed.\"", [{ l: "Mark the road.", n: "co_m" }]), co_m: n("co_m", "\"Permanent.\""), ref: n("ref", "\"Finished without you.\"") });

const CE_L = tr("zealot_vs_wanderer.cohort_end_confrontation.low", { root: n("root", "Cohort hall. Your apprentice graduated under the cause. Wanderer-Nemesis attached a road-slip.", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_low_cohort_end_confrontation" }, { l: "Detach.", n: "dt", f: "aggression_at_grudge_low_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), dt: n("dt", "\"Refiled.\"") });
const CE_M = tr("zealot_vs_wanderer.cohort_end_confrontation.mid", { root: n("root", "\"Cohort registered as 'cause/road, paired.'\"", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_mid_cohort_end_confrontation" }, { l: "Petition.", n: "pt", f: "aggression_at_grudge_mid_cohort_end_confrontation" }]), sg: n("sg", "\"Permanent.\""), pt: n("pt", "\"Denied.\"") });
const CE_H = tr("zealot_vs_wanderer.cohort_end_confrontation.high", { root: n("root", "\"Your apprentice walked your cause AS a road, and stayed.\"", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_high_cohort_end_confrontation" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), ref: n("ref", "\"Refused.\"") });

const AR_L = tr("zealot_vs_wanderer.accumulation_reveal.low", { root: n("root", "Matrix-archive intake. New sibling-release at the road.", [{ l: "Welcome.", n: "wl", f: "mercy_at_grudge_low_accumulation_reveal" }, { l: "Demand.", n: "dm", f: "aggression_at_grudge_low_accumulation_reveal" }]), wl: n("wl", "\"Welcomed.\""), dm: n("dm", "\"Declared.\"") });
const AR_M = tr("zealot_vs_wanderer.accumulation_reveal.mid", { root: n("root", "\"Four wanderers at four roads.\"", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_mid_accumulation_reveal" }, { l: "Strike one.", n: "st", f: "aggression_at_grudge_mid_accumulation_reveal" }]), bl: n("bl", "\"Blessed.\""), st: n("st", "\"Struck.\"") });
const AR_H = tr("zealot_vs_wanderer.accumulation_reveal.high", { root: n("root", "\"Chorus of drifts.\"", [{ l: "Honor.", n: "hn", f: "mercy_at_grudge_high_accumulation_reveal" }, { l: "Recruit one to commit.", n: "rc", f: "aggression_at_grudge_high_accumulation_reveal" }]), hn: n("hn", "\"Honored.\""), rc: n("rc", "\"Recruited.\"") });

const NR_L = tr("zealot_vs_wanderer.name_reveal_moment.low", { root: n("root", "Crossroad marker. Wanderer-Nemesis's name is carved on the post.", [{ l: "Say softly.", n: "sy", f: "mercy_at_grudge_low_name_reveal_moment" }, { l: "Carve over it.", n: "cv", f: "aggression_at_grudge_low_name_reveal_moment" }]), sy: n("sy", "\"Said.\""), cv: n("cv", "\"Carved.\"") });
const NR_M = tr("zealot_vs_wanderer.name_reveal_moment.mid", { root: n("root", "\"Use my name at the post.\"", [{ l: "Speak.", n: "sp", f: "mercy_at_grudge_mid_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_name_reveal_moment" }]), sp: n("sp", "\"Spoken.\""), st: n("st", "\"Denied.\"") });
const NR_H = tr("zealot_vs_wanderer.name_reveal_moment.high", { root: n("root", "\"Speak my name.\"", [{ l: "As fellow-witness.", n: "fw", f: "mercy_at_grudge_high_name_reveal_moment" }, { l: "As trespass.", n: "tr", f: "aggression_at_grudge_high_name_reveal_moment" }]), fw: n("fw", "\"Witnessed.\""), tr: n("tr", "\"Indicted.\"") });

const FE_L = tr("zealot_vs_wanderer.final_encounter.low", { root: n("root", "Convergence Seat. Wanderer-Nemesis with a final road-slip.", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_low_final_encounter" }, { l: "Burn.", n: "bn", f: "aggression_at_grudge_low_final_encounter" }]), sg: n("sg", "\"Signed.\""), bn: n("bn", "\"Burned.\"") });
const FE_M = tr("zealot_vs_wanderer.final_encounter.mid", { root: n("root", "\"End of arc.\"", [{ l: "Co-sign.", n: "cs", f: "mercy_at_grudge_mid_final_encounter" }, { l: "Let close.", n: "cl", f: "aggression_at_grudge_mid_final_encounter" }]), cs: n("cs", "\"Signed.\""), cl: n("cl", "\"Closed.\"") });
const FE_H = tr("zealot_vs_wanderer.final_encounter.high", { root: n("root", "\"The chronicle is folding. Walk the last road with me.\"", [{ l: "Walk together.", n: "wt", f: "mercy_at_grudge_high_final_encounter" }, { l: "Hold the oath.", n: "ho", f: "aggression_at_grudge_high_final_encounter" }]), wt: n("wt", "\"Closed together.\"", [{ l: "Hold.", n: "wt_h" }]), wt_h: n("wt_h", "\"Held.\""), ho: n("ho", "\"Held alone.\"") });

export const zealotVsWandererPairBank: NemesisPairBank = {
  pairId: "zealot_vs_wanderer", playerArchetype: "zealot", nemesisArchetype: "wanderer",
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
