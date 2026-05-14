/* ARTISAN-PLAYER vs. ORACLE-NEMESIS — Phase K Wave 7K (canon)
   Build-from-plan vs. see-the-plan.
   Surfaces: Engineer's workshop, Templum Veritus, Mechronis design-hall, Hub, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";
const n = (id: string, text: string, choices?: { l: string; n: string; f?: string }[]) => ({ id, speaker: "nemesis" as const, voLineId: `nemesis.artisan_vs_oracle.${id}`, onscreenText: text, choices: choices?.map(c => ({ label: c.l, nextId: c.n, sets: c.f })) });
const tr = (id: string, nodes: Record<string, ReturnType<typeof n>>): DialogTree => ({ id, nodes });

const FS_L = tr("artisan_vs_oracle.first_sighting.low", { root: n("root", "Engineer's workshop. You finish a casting. Oracle-Nemesis at the doorway holds a sealed prediction-slip dated the same hour. \"You built what I saw. The Politician's primer: the seen and the made arrive together.\"", [{ l: "Open the slip.", n: "op", f: "mercy_at_grudge_low_first_sighting" }, { l: "Refuse to read.", n: "rf", f: "aggression_at_grudge_low_first_sighting" }]), op: n("op", "\"Matched.\""), rf: n("rf", "\"Filed unread.\"") });
const FS_M = tr("artisan_vs_oracle.first_sighting.mid", { root: n("root", "\"Six castings. Six matching slips.\"", [{ l: "Cast with her vision.", n: "cv", f: "mercy_at_grudge_mid_first_sighting" }, { l: "Refuse predictions.", n: "rp", f: "aggression_at_grudge_mid_first_sighting" }]), cv: n("cv", "\"Cast.\""), rp: n("rp", "\"Filed.\"") });
const FS_H = tr("artisan_vs_oracle.first_sighting.high", { root: n("root", "\"I have only seen. Teach me to build.\"", [{ l: "Teach.", n: "tc", f: "mercy_at_grudge_high_first_sighting" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_first_sighting" }]), tc: n("tc", "\"Taught.\"", [{ l: "Hand her a chisel.", n: "tc_c" }]), tc_c: n("tc_c", "\"Held.\""), ref: n("ref", "\"Refused.\"") });

const SC_L = tr("artisan_vs_oracle.sabotage_caught_in_act.low", { root: n("root", "Templum Veritus. Oracle-Nemesis tells you the casting will crack tomorrow.", [{ l: "Brace for it.", n: "br", f: "mercy_at_grudge_low_sabotage_caught_in_act" }, { l: "Refuse the prophecy.", n: "rf", f: "aggression_at_grudge_low_sabotage_caught_in_act" }]), br: n("br", "\"Braced.\""), rf: n("rf", "\"Cracked.\"") });
const SC_M = tr("artisan_vs_oracle.sabotage_caught_in_act.mid", { root: n("root", "\"Every casting cracks at the seam I sealed without your design.\"", [{ l: "Co-design.", n: "co", f: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_mid_sabotage_caught_in_act" }]), co: n("co", "\"Designed.\""), ref: n("ref", "\"Cracked.\"") });
const SC_H = tr("artisan_vs_oracle.sabotage_caught_in_act.high", { root: n("root", "\"I want to build something the chronicle has not seen yet. Help me.\"", [{ l: "Help.", n: "hp", f: "mercy_at_grudge_high_sabotage_caught_in_act" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_sabotage_caught_in_act" }]), hp: n("hp", "\"Helped.\"", [{ l: "Cast.", n: "hp_c" }]), hp_c: n("hp_c", "\"Cast.\""), ref: n("ref", "\"Refused.\"") });

const MI_L = tr("artisan_vs_oracle.mocking_interlude.low", { root: n("root", "Mechronis design-hall. Oracle-Nemesis annotates your blueprints with predicted failure points.", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_low_mocking_interlude" }, { l: "Strike annotations.", n: "st", f: "aggression_at_grudge_low_mocking_interlude" }]), ac: n("ac", "\"Accepted.\""), st: n("st", "\"Refiled.\"") });
const MI_M = tr("artisan_vs_oracle.mocking_interlude.mid", { root: n("root", "\"You build. I forecast. Same shelf.\"", [{ l: "Co-shelf.", n: "cs", f: "mercy_at_grudge_mid_mocking_interlude" }, { l: "Petition removal.", n: "pt", f: "aggression_at_grudge_mid_mocking_interlude" }]), cs: n("cs", "\"Shelved.\""), pt: n("pt", "\"Denied.\"") });
const MI_H = tr("artisan_vs_oracle.mocking_interlude.high", { root: n("root", "\"Let me hold a tool for you. Quietly.\"", [{ l: "Pass tool.", n: "pt", f: "mercy_at_grudge_high_mocking_interlude" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_mocking_interlude" }]), pt: n("pt", "\"Held.\""), ref: n("ref", "\"Refused.\"") });

const LP_L = tr("artisan_vs_oracle.lieutenant_promotion.low", { root: n("root", "Templum forecast-warden ceremony.", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_low_lieutenant_promotion" }, { l: "Object.", n: "ob", f: "aggression_at_grudge_low_lieutenant_promotion" }]), bl: n("bl", "\"Blessed.\""), ob: n("ob", "\"Denied.\"") });
const LP_M = tr("artisan_vs_oracle.lieutenant_promotion.mid", { root: n("root", "\"Forecast-Warden. Four temples.\"", [{ l: "Send a blueprint.", n: "sn", f: "mercy_at_grudge_mid_lieutenant_promotion" }, { l: "Audit.", n: "au", f: "aggression_at_grudge_mid_lieutenant_promotion" }]), sn: n("sn", "\"Sent.\""), au: n("au", "\"Audited.\"") });
const LP_H = tr("artisan_vs_oracle.lieutenant_promotion.high", { root: n("root", "\"New design-code. Co-author.\"", [{ l: "Co-author.", n: "co", f: "mercy_at_grudge_high_lieutenant_promotion" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_lieutenant_promotion" }]), co: n("co", "\"Signed.\"", [{ l: "Cast.", n: "co_c" }]), co_c: n("co_c", "\"Permanent.\""), ref: n("ref", "\"Finished without you.\"") });

const CE_L = tr("artisan_vs_oracle.cohort_end_confrontation.low", { root: n("root", "Cohort hall. Your apprentice graduated with a finished cast. Oracle-Nemesis predicted the casting exactly.", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_low_cohort_end_confrontation" }, { l: "Detach prediction.", n: "dt", f: "aggression_at_grudge_low_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), dt: n("dt", "\"Refiled.\"") });
const CE_M = tr("artisan_vs_oracle.cohort_end_confrontation.mid", { root: n("root", "\"Cohort registered as 'built/foreseen, paired.'\"", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_mid_cohort_end_confrontation" }, { l: "Petition.", n: "pt", f: "aggression_at_grudge_mid_cohort_end_confrontation" }]), sg: n("sg", "\"Permanent.\""), pt: n("pt", "\"Denied.\"") });
const CE_H = tr("artisan_vs_oracle.cohort_end_confrontation.high", { root: n("root", "\"Your apprentice built what NO oracle foresaw. They surpassed both of us.\"", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_high_cohort_end_confrontation" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), ref: n("ref", "\"Refused.\"") });

const AR_L = tr("artisan_vs_oracle.accumulation_reveal.low", { root: n("root", "Matrix-archive intake. New sibling-release at the temple.", [{ l: "Welcome.", n: "wl", f: "mercy_at_grudge_low_accumulation_reveal" }, { l: "Demand.", n: "dm", f: "aggression_at_grudge_low_accumulation_reveal" }]), wl: n("wl", "\"Welcomed.\""), dm: n("dm", "\"Declared.\"") });
const AR_M = tr("artisan_vs_oracle.accumulation_reveal.mid", { root: n("root", "\"Four oracles. Four temples.\"", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_mid_accumulation_reveal" }, { l: "Strike one.", n: "st", f: "aggression_at_grudge_mid_accumulation_reveal" }]), bl: n("bl", "\"Blessed.\""), st: n("st", "\"Struck.\"") });
const AR_H = tr("artisan_vs_oracle.accumulation_reveal.high", { root: n("root", "\"Chorus of foreseen.\"", [{ l: "Honor.", n: "hn", f: "mercy_at_grudge_high_accumulation_reveal" }, { l: "Recruit one to build.", n: "rc", f: "aggression_at_grudge_high_accumulation_reveal" }]), hn: n("hn", "\"Honored.\""), rc: n("rc", "\"Recruited.\"") });

const NR_L = tr("artisan_vs_oracle.name_reveal_moment.low", { root: n("root", "Templum Veritus margin. Oracle-Nemesis's name surfaces.", [{ l: "Say softly.", n: "sy", f: "mercy_at_grudge_low_name_reveal_moment" }, { l: "Cast it on a plate.", n: "cp", f: "aggression_at_grudge_low_name_reveal_moment" }]), sy: n("sy", "\"Said.\""), cp: n("cp", "\"Cast.\"") });
const NR_M = tr("artisan_vs_oracle.name_reveal_moment.mid", { root: n("root", "\"Use my name on a plate.\"", [{ l: "Cast.", n: "ct", f: "mercy_at_grudge_mid_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_name_reveal_moment" }]), ct: n("ct", "\"Cast.\""), st: n("st", "\"Denied.\"") });
const NR_H = tr("artisan_vs_oracle.name_reveal_moment.high", { root: n("root", "\"Speak my name.\"", [{ l: "As fellow-witness.", n: "fw", f: "mercy_at_grudge_high_name_reveal_moment" }, { l: "As trespass.", n: "tr", f: "aggression_at_grudge_high_name_reveal_moment" }]), fw: n("fw", "\"Witnessed.\""), tr: n("tr", "\"Indicted.\"") });

const FE_L = tr("artisan_vs_oracle.final_encounter.low", { root: n("root", "Convergence Seat. Oracle-Nemesis with a final sealed slip.", [{ l: "Open.", n: "op", f: "mercy_at_grudge_low_final_encounter" }, { l: "Burn.", n: "bn", f: "aggression_at_grudge_low_final_encounter" }]), op: n("op", "\"Read.\""), bn: n("bn", "\"Burned.\"") });
const FE_M = tr("artisan_vs_oracle.final_encounter.mid", { root: n("root", "\"End of arc.\"", [{ l: "Co-sign.", n: "cs", f: "mercy_at_grudge_mid_final_encounter" }, { l: "Let close.", n: "cl", f: "aggression_at_grudge_mid_final_encounter" }]), cs: n("cs", "\"Signed.\""), cl: n("cl", "\"Closed.\"") });
const FE_H = tr("artisan_vs_oracle.final_encounter.high", { root: n("root", "\"The chronicle is folding. Cast one last plate.\"", [{ l: "Cast together.", n: "cs", f: "mercy_at_grudge_high_final_encounter" }, { l: "Break the mold.", n: "br", f: "aggression_at_grudge_high_final_encounter" }]), cs: n("cs", "\"Closed together.\"", [{ l: "Hold.", n: "cs_h" }]), cs_h: n("cs_h", "\"Held.\""), br: n("br", "\"Broken.\"") });

export const artisanVsOraclePairBank: NemesisPairBank = {
  pairId: "artisan_vs_oracle", playerArchetype: "artisan", nemesisArchetype: "oracle",
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
