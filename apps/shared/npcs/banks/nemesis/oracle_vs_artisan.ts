/* ORACLE-PLAYER vs. ARTISAN-NEMESIS — Phase K Wave 7K (canon)
   See-the-plan vs. build-from-plan.
   Surfaces: Templum Veritus, Engineer's workshop, Mechronis design-hall, Hub, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";
const n = (id: string, text: string, choices?: { l: string; n: string; f?: string }[]) => ({ id, speaker: "nemesis" as const, voLineId: `nemesis.oracle_vs_artisan.${id}`, onscreenText: text, choices: choices?.map(c => ({ label: c.l, nextId: c.n, sets: c.f })) });
const tr = (id: string, nodes: Record<string, ReturnType<typeof n>>): DialogTree => ({ id, nodes });

const FS_L = tr("oracle_vs_artisan.first_sighting.low", { root: n("root", "Templum Veritus. You seal a vision. Artisan-Nemesis at the forge holds a casting that matches your sealed slip. \"You saw what I built. The Politician's primer: the seen and the made arrive together.\"", [{ l: "Open the slip.", n: "op", f: "mercy_at_grudge_low_first_sighting" }, { l: "Refuse to compare.", n: "rf", f: "aggression_at_grudge_low_first_sighting" }]), op: n("op", "\"Matched.\""), rf: n("rf", "\"Filed unread.\"") });
const FS_M = tr("oracle_vs_artisan.first_sighting.mid", { root: n("root", "\"Six visions. Six matching castings.\"", [{ l: "Forecast for her.", n: "ff", f: "mercy_at_grudge_mid_first_sighting" }, { l: "Refuse.", n: "rf", f: "aggression_at_grudge_mid_first_sighting" }]), ff: n("ff", "\"Forecast.\""), rf: n("rf", "\"Filed.\"") });
const FS_H = tr("oracle_vs_artisan.first_sighting.high", { root: n("root", "\"I have only built. Teach me to see.\"", [{ l: "Teach.", n: "tc", f: "mercy_at_grudge_high_first_sighting" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_first_sighting" }]), tc: n("tc", "\"Taught.\"", [{ l: "Hand her a sealed slip.", n: "tc_s" }]), tc_s: n("tc_s", "\"Held.\""), ref: n("ref", "\"Refused.\"") });

const SC_L = tr("oracle_vs_artisan.sabotage_caught_in_act.low", { root: n("root", "Engineer's workshop. Artisan-Nemesis casts a piece you have not yet foreseen.", [{ l: "Read the future.", n: "rf", f: "mercy_at_grudge_low_sabotage_caught_in_act" }, { l: "Strike the cast.", n: "st", f: "aggression_at_grudge_low_sabotage_caught_in_act" }]), rf: n("rf", "\"Read.\""), st: n("st", "\"Refiled.\"") });
const SC_M = tr("oracle_vs_artisan.sabotage_caught_in_act.mid", { root: n("root", "\"Every casting outpaces my vision by hours.\"", [{ l: "Co-design.", n: "co", f: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_mid_sabotage_caught_in_act" }]), co: n("co", "\"Designed.\""), ref: n("ref", "\"Filed.\"") });
const SC_H = tr("oracle_vs_artisan.sabotage_caught_in_act.high", { root: n("root", "\"I want to forecast something no oracle has read. Help me.\"", [{ l: "Help.", n: "hp", f: "mercy_at_grudge_high_sabotage_caught_in_act" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_sabotage_caught_in_act" }]), hp: n("hp", "\"Helped.\"", [{ l: "Seal slip.", n: "hp_s" }]), hp_s: n("hp_s", "\"Sealed.\""), ref: n("ref", "\"Refused.\"") });

const MI_L = tr("oracle_vs_artisan.mocking_interlude.low", { root: n("root", "Mechronis design-hall. Artisan-Nemesis casts plates of your sealed slips.", [{ l: "Allow.", n: "al", f: "mercy_at_grudge_low_mocking_interlude" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_low_mocking_interlude" }]), al: n("al", "\"Allowed.\""), st: n("st", "\"Refiled.\"") });
const MI_M = tr("oracle_vs_artisan.mocking_interlude.mid", { root: n("root", "\"You see. I cast. Same shelf.\"", [{ l: "Co-shelf.", n: "cs", f: "mercy_at_grudge_mid_mocking_interlude" }, { l: "Petition.", n: "pt", f: "aggression_at_grudge_mid_mocking_interlude" }]), cs: n("cs", "\"Shelved.\""), pt: n("pt", "\"Denied.\"") });
const MI_H = tr("oracle_vs_artisan.mocking_interlude.high", { root: n("root", "\"Let me cast for you. Quietly.\"", [{ l: "Pass casting.", n: "pc", f: "mercy_at_grudge_high_mocking_interlude" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_mocking_interlude" }]), pc: n("pc", "\"Held.\""), ref: n("ref", "\"Refused.\"") });

const LP_L = tr("oracle_vs_artisan.lieutenant_promotion.low", { root: n("root", "Forge cast-warden ceremony.", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_low_lieutenant_promotion" }, { l: "Object.", n: "ob", f: "aggression_at_grudge_low_lieutenant_promotion" }]), bl: n("bl", "\"Blessed.\""), ob: n("ob", "\"Denied.\"") });
const LP_M = tr("oracle_vs_artisan.lieutenant_promotion.mid", { root: n("root", "\"Cast-Warden. Four forges.\"", [{ l: "Send a vision.", n: "sn", f: "mercy_at_grudge_mid_lieutenant_promotion" }, { l: "Audit.", n: "au", f: "aggression_at_grudge_mid_lieutenant_promotion" }]), sn: n("sn", "\"Sent.\""), au: n("au", "\"Audited.\"") });
const LP_H = tr("oracle_vs_artisan.lieutenant_promotion.high", { root: n("root", "\"New forge-code. Co-author.\"", [{ l: "Co-author.", n: "co", f: "mercy_at_grudge_high_lieutenant_promotion" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_lieutenant_promotion" }]), co: n("co", "\"Signed.\"", [{ l: "Cast.", n: "co_c" }]), co_c: n("co_c", "\"Permanent.\""), ref: n("ref", "\"Finished without you.\"") });

const CE_L = tr("oracle_vs_artisan.cohort_end_confrontation.low", { root: n("root", "Cohort hall. Your apprentice graduated with a sealed vision. Artisan-Nemesis cast the matching plate.", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_low_cohort_end_confrontation" }, { l: "Detach plate.", n: "dt", f: "aggression_at_grudge_low_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), dt: n("dt", "\"Refiled.\"") });
const CE_M = tr("oracle_vs_artisan.cohort_end_confrontation.mid", { root: n("root", "\"Cohort registered as 'foreseen/built, paired.'\"", [{ l: "Sign.", n: "sg", f: "mercy_at_grudge_mid_cohort_end_confrontation" }, { l: "Petition.", n: "pt", f: "aggression_at_grudge_mid_cohort_end_confrontation" }]), sg: n("sg", "\"Permanent.\""), pt: n("pt", "\"Denied.\"") });
const CE_H = tr("oracle_vs_artisan.cohort_end_confrontation.high", { root: n("root", "\"Your apprentice foresaw what NO artisan cast. They surpassed both.\"", [{ l: "Accept.", n: "ac", f: "mercy_at_grudge_high_cohort_end_confrontation" }, { l: "Refuse.", n: "ref", f: "aggression_at_grudge_high_cohort_end_confrontation" }]), ac: n("ac", "\"Accepted.\""), ref: n("ref", "\"Refused.\"") });

const AR_L = tr("oracle_vs_artisan.accumulation_reveal.low", { root: n("root", "Matrix-archive intake. New sibling-release at the forge.", [{ l: "Welcome.", n: "wl", f: "mercy_at_grudge_low_accumulation_reveal" }, { l: "Demand.", n: "dm", f: "aggression_at_grudge_low_accumulation_reveal" }]), wl: n("wl", "\"Welcomed.\""), dm: n("dm", "\"Declared.\"") });
const AR_M = tr("oracle_vs_artisan.accumulation_reveal.mid", { root: n("root", "\"Four artisans. Four forges.\"", [{ l: "Bless.", n: "bl", f: "mercy_at_grudge_mid_accumulation_reveal" }, { l: "Strike one.", n: "st", f: "aggression_at_grudge_mid_accumulation_reveal" }]), bl: n("bl", "\"Blessed.\""), st: n("st", "\"Struck.\"") });
const AR_H = tr("oracle_vs_artisan.accumulation_reveal.high", { root: n("root", "\"Chorus of built.\"", [{ l: "Honor.", n: "hn", f: "mercy_at_grudge_high_accumulation_reveal" }, { l: "Recruit one to see.", n: "rc", f: "aggression_at_grudge_high_accumulation_reveal" }]), hn: n("hn", "\"Honored.\""), rc: n("rc", "\"Recruited.\"") });

const NR_L = tr("oracle_vs_artisan.name_reveal_moment.low", { root: n("root", "Workshop margin. Artisan-Nemesis's name is cast on a small plate.", [{ l: "Say softly.", n: "sy", f: "mercy_at_grudge_low_name_reveal_moment" }, { l: "Melt the plate.", n: "mt", f: "aggression_at_grudge_low_name_reveal_moment" }]), sy: n("sy", "\"Said.\""), mt: n("mt", "\"Refiled.\"") });
const NR_M = tr("oracle_vs_artisan.name_reveal_moment.mid", { root: n("root", "\"Use my name on a plate.\"", [{ l: "Cast.", n: "ct", f: "mercy_at_grudge_mid_name_reveal_moment" }, { l: "Strike.", n: "st", f: "aggression_at_grudge_mid_name_reveal_moment" }]), ct: n("ct", "\"Cast.\""), st: n("st", "\"Denied.\"") });
const NR_H = tr("oracle_vs_artisan.name_reveal_moment.high", { root: n("root", "\"Speak my name.\"", [{ l: "As fellow-witness.", n: "fw", f: "mercy_at_grudge_high_name_reveal_moment" }, { l: "As trespass.", n: "tr", f: "aggression_at_grudge_high_name_reveal_moment" }]), fw: n("fw", "\"Witnessed.\""), tr: n("tr", "\"Indicted.\"") });

const FE_L = tr("oracle_vs_artisan.final_encounter.low", { root: n("root", "Convergence Seat. Artisan-Nemesis with a final cast plate.", [{ l: "Read.", n: "rd", f: "mercy_at_grudge_low_final_encounter" }, { l: "Break.", n: "br", f: "aggression_at_grudge_low_final_encounter" }]), rd: n("rd", "\"Read.\""), br: n("br", "\"Broken.\"") });
const FE_M = tr("oracle_vs_artisan.final_encounter.mid", { root: n("root", "\"End of arc.\"", [{ l: "Co-sign.", n: "cs", f: "mercy_at_grudge_mid_final_encounter" }, { l: "Let close.", n: "cl", f: "aggression_at_grudge_mid_final_encounter" }]), cs: n("cs", "\"Signed.\""), cl: n("cl", "\"Closed.\"") });
const FE_H = tr("oracle_vs_artisan.final_encounter.high", { root: n("root", "\"The chronicle is folding. Seal one last slip with me.\"", [{ l: "Seal together.", n: "sl", f: "mercy_at_grudge_high_final_encounter" }, { l: "Break.", n: "br", f: "aggression_at_grudge_high_final_encounter" }]), sl: n("sl", "\"Closed together.\"", [{ l: "Hold.", n: "sl_h" }]), sl_h: n("sl_h", "\"Held.\""), br: n("br", "\"Broken.\"") });

export const oracleVsArtisanPairBank: NemesisPairBank = {
  pairId: "oracle_vs_artisan", playerArchetype: "oracle", nemesisArchetype: "artisan",
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
