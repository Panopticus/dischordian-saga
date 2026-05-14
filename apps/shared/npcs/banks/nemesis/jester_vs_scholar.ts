/* JESTER-PLAYER vs. SCHOLAR-NEMESIS — Phase K Wave 7H (canon)
   Improvisation vs analysis. You play by ear; Scholar-Nemesis cross-references every riff.
   Surfaces: PAC News green-room, Antiquarian's reading room, Mechronis lecture, Hub, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";
const n = (id: string, text: string, choices?: { l: string; n: string; f?: string }[]) => ({ id, speaker: "nemesis" as const, voLineId: `nemesis.jester_vs_scholar.${id}`, onscreenText: text, choices: choices?.map(c => ({ label: c.l, nextId: c.n, sets: c.f })) });
const tr = (id: string, nodes: Record<string, ReturnType<typeof n>>): DialogTree => ({ id, nodes });

const FS_L = tr("jester_vs_scholar.first_sighting.low", { root: n("root", "PAC News green-room. You finish a riff. Scholar-Nemesis at the desk hands you a footnote sheet. \"Three improvisations cite the Politician's primer without attribution. Sign.\"", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_low_first_sighting" }, { l: "Crumple it.", n: "cr", f: "aggression_at_grudge_low_first_sighting" }]), sg: n("sg", "\"Signed.\""), cr: n("cr", "\"Crumpled. Refiled.\"") });
const FS_M = tr("jester_vs_scholar.first_sighting.mid", { root: n("root", "\"Five segments. Eighty-one footnotes filed.\"", [{ l: "Accept the citation.", n: "ac", f: "mercy_at_grudge_mid_first_sighting" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_mid_first_sighting" }]), ac: n("ac", "\"Cited.\""), ref: n("ref", "\"Footnoted anyway.\"") });
const FS_H = tr("jester_vs_scholar.first_sighting.high", { root: n("root", "\"I have stopped footnoting. Teach me to riff.\"", [{ l: "Teach.", n: "tc", f: "mercy_at_grudge_high_first_sighting" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_first_sighting" }]), tc: n("tc", "\"Taught.\"", [{ l: "Hand mic.", n: "tc_m" }]), tc_m: n("tc_m", "\"Held.\""), ref: n("ref", "\"Refused.\"") });

const SC_L = tr("jester_vs_scholar.sabotage_caught_in_act.low", { root: n("root", "Casino floor. Scholar-Nemesis cross-references your improvised announcement.", [{ l: "Riff past.", n: "rf", f: "mercy_at_grudge_low_sabotage_caught_in_act" }, { l: "Hold.", n: "hd", f: "aggression_at_grudge_low_sabotage_caught_in_act" }]), rf: n("rf", "\"Riffed.\""), hd: n("hd", "\"Held.\"") });
const SC_M = tr("jester_vs_scholar.sabotage_caught_in_act.mid", { root: n("root", "\"Every riff filed. Every filing cross-referenced.\"", [{ l: "Reduce density.", n: "rd", f: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { l: "Increase density.", n: "in", f: "aggression_at_grudge_mid_sabotage_caught_in_act" }]), rd: n("rd", "\"Reduced.\""), in: n("in", "\"Increased. Cited.\"") });
const SC_H = tr("jester_vs_scholar.sabotage_caught_in_act.high", { root: n("root", "\"I want a fully improvised hour on air. Help.\"", [{ l: "Help.", n: "hp", f: "mercy_at_grudge_high_sabotage_caught_in_act" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_sabotage_caught_in_act" }]), hp: n("hp", "\"Helped.\"", [{ l: "Push.", n: "hp_p" }]), hp_p: n("hp_p", "\"Aired.\""), ref: n("ref", "\"Refused.\"") });

const MI_L = tr("jester_vs_scholar.mocking_interlude.low", { root: n("root", "Antiquarian's reading room. Scholar-Nemesis pages through transcripts of your riffs.", [{ l: "Bit.", n: "bt", f: "mercy_at_grudge_low_mocking_interlude" }, { l: "Walk past.", n: "wk", f: "aggression_at_grudge_low_mocking_interlude" }]), bt: n("bt", "\"Bit.\""), wk: n("wk", "\"Walked.\"") });
const MI_M = tr("jester_vs_scholar.mocking_interlude.mid", { root: n("root", "\"The reading room is now a research site on you.\"", [{ l: "Allow.", n: "al", f: "mercy_at_grudge_mid_mocking_interlude" }, { l: "Petition closure.", n: "pt", f: "aggression_at_grudge_mid_mocking_interlude" }]), al: n("al", "\"Allowed.\""), pt: n("pt", "\"Denied.\"") });
const MI_H = tr("jester_vs_scholar.mocking_interlude.high", { root: n("root", "\"I'm offering to be stage-hand. Quietly.\"", [{ l: "Hire.", n: "hr", f: "mercy_at_grudge_high_mocking_interlude" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_mocking_interlude" }]), hr: n("hr", "\"Hired.\""), ref: n("ref", "\"Refused.\"") });

const LP_L = tr("jester_vs_scholar.lieutenant_promotion.low", { root: n("root", "Antiquary citation-officer ceremony.", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_low_lieutenant_promotion" }, { l: "Object.", n: "ob", f: "aggression_at_grudge_low_lieutenant_promotion" }]), bl: n("bl", "\"Blessed.\""), ob: n("ob", "\"Denied.\"") });
const LP_M = tr("jester_vs_scholar.lieutenant_promotion.mid", { root: n("root", "\"Citation Officer. Four annotation desks.\"", [{ l: "Send a riff.", n: "sn", f: "mercy_at_grudge_mid_lieutenant_promotion" }, { l: "Audit.", n: "au", f: "aggression_at_grudge_mid_lieutenant_promotion" }]), sn: n("sn", "\"Sent.\""), au: n("au", "\"Audited.\"") });
const LP_H = tr("jester_vs_scholar.lieutenant_promotion.high", { root: n("root", "\"New annotation code. Co-author.\"", [{ l: "Co-author.", n: "co", f: "mercy_at_grudge_high_lieutenant_promotion" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_lieutenant_promotion" }]), co: n("co", "\"Signed.\"", [{ l: "Pen.", n: "co_p" }]), co_p: n("co_p", "\"Permanent.\""), ref: n("ref", "\"Finished without you.\"") });

const CE_L = tr("jester_vs_scholar.cohort_end_confrontation.low", { root: n("root", "Cohort hall. Your apprentice graduated improvising. Scholar-Nemesis attached a citation packet.", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_low_cohort_end_confrontation" }, { l: "Detach.", n: "dt", f: "aggression_at_grudge_low_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), dt: n("dt", "\"Detached. Refiled.\"") });
const CE_M = tr("jester_vs_scholar.cohort_end_confrontation.mid", { root: n("root", "\"Cohort registered as 'improvisation/analysis, paired.'\"", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_mid_cohort_end_confrontation" }, { l: "Petition.", n: "pt", f: "aggression_at_grudge_mid_cohort_end_confrontation" }]), ac: n("ac", "\"Permanent.\""), pt: n("pt", "\"Denied.\"") });
const CE_H = tr("jester_vs_scholar.cohort_end_confrontation.high", { root: n("root", "\"Your apprentice cited my footnotes by ear.\"", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_high_cohort_end_confrontation" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), ref: n("ref", "\"Refused.\"") });

const AR_L = tr("jester_vs_scholar.accumulation_reveal.low", { root: n("root", "Matrix-archive intake. New sibling-release.", [{ l: "Welcome.", n: "wl", f: "mercy_at_grudge_low_accumulation_reveal" }, { l: "Declare.", n: "dc", f: "aggression_at_grudge_low_accumulation_reveal" }]), wl: n("wl", "\"Welcomed.\""), dc: n("dc", "\"Declared.\"") });
const AR_M = tr("jester_vs_scholar.accumulation_reveal.mid", { root: n("root", "\"Four scholars. One bench.\"", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_mid_accumulation_reveal" }, { l: "Strike one.", n: "st", f: "aggression_at_grudge_mid_accumulation_reveal" }]), bl: n("bl", "\"Blessed.\""), st: n("st", "\"Struck.\"") });
const AR_H = tr("jester_vs_scholar.accumulation_reveal.high", { root: n("root", "\"Chorus of footnoted siblings.\"", [{ l: "Honor.", n: "hn", f: "mercy_at_grudge_high_accumulation_reveal" }, { l: "Recruit one to riff.", n: "rc", f: "aggression_at_grudge_high_accumulation_reveal" }]), hn: n("hn", "\"Honored.\""), rc: n("rc", "\"Recruited.\"") });

const NR_L = tr("jester_vs_scholar.name_reveal_moment.low", { root: n("root", "Antiquarian's Journal margin. Scholar-Nemesis's name appears.", [{ l: "Say softly.", n: "sy", f: "mercy_at_grudge_low_name_reveal_moment" }, { l: "Riff on air.", n: "rf", f: "aggression_at_grudge_low_name_reveal_moment" }]), sy: n("sy", "\"Said.\""), rf: n("rf", "\"Aired.\"") });
const NR_M = tr("jester_vs_scholar.name_reveal_moment.mid", { root: n("root", "\"Use my name on air.\"", [{ l: "Cite.", n: "ct", f: "mercy_at_grudge_mid_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_name_reveal_moment" }]), ct: n("ct", "\"Cited.\""), st: n("st", "\"Denied.\"") });
const NR_H = tr("jester_vs_scholar.name_reveal_moment.high", { root: n("root", "\"Speak my name.\"", [{ l: "As a riff.", n: "rf", f: "mercy_at_grudge_high_name_reveal_moment" }, { l: "As indictment.", n: "in", f: "aggression_at_grudge_high_name_reveal_moment" }]), rf: n("rf", "\"Aired.\""), in: n("in", "\"Indicted.\"") });

const FE_L = tr("jester_vs_scholar.final_encounter.low", { root: n("root", "Convergence Seat. Scholar-Nemesis with a final citation slip.", [{ l: "Riff over it.", n: "rf", f: "mercy_at_grudge_low_final_encounter" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_low_final_encounter" }]), rf: n("rf", "\"Riffed.\""), st: n("st", "\"Struck.\"") });
const FE_M = tr("jester_vs_scholar.final_encounter.mid", { root: n("root", "\"End of arc.\"", [{ l: "Sign jointly.", n: "sg", f: "mercy_at_grudge_mid_final_encounter" }, { l: "Let close.", n: "cl", f: "aggression_at_grudge_mid_final_encounter" }]), sg: n("sg", "\"Signed.\""), cl: n("cl", "\"Closed.\"") });
const FE_H = tr("jester_vs_scholar.final_encounter.high", { root: n("root", "\"The chronicle is folding. Riff once more.\"", [{ l: "Riff together.", n: "rf", f: "mercy_at_grudge_high_final_encounter" }, { l: "Silence.", n: "sl", f: "aggression_at_grudge_high_final_encounter" }]), rf: n("rf", "\"Closed together.\"", [{ l: "Hold.", n: "rf_h" }]), rf_h: n("rf_h", "\"Held.\""), sl: n("sl", "\"Silent.\"") });

export const jesterVsScholarPairBank: NemesisPairBank = {
  pairId: "jester_vs_scholar", playerArchetype: "jester", nemesisArchetype: "scholar",
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
