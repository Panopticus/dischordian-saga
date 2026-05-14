/* ═══════════════════════════════════════════════════════
   MARTYR-PLAYER vs. REVENANT-NEMESIS — Phase K Wave 7C (canon)

   Sacrifice vs debt. Both keep ledgers. The Martyr-player
   records "I paid" in the same column the Revenant-Nemesis
   records "they owe." Identical bookkeeping, opposite sign.

   Martyr operates in Memorial halls and the cohort gate —
   pays bond caps, forgives apprentice failures, signs the
   Memorial Wall for the fallen. Revenant-Nemesis runs the
   Adjudicator's ledger room, files debt-collection motions
   at the Hub, audits casino tip-jar lifts for repayment
   schedules. Their argument: is the price paid forward, or
   collected forever?
   ═══════════════════════════════════════════════════════ */

import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

const FIRST_SIGHTING_LOW: DialogTree = {
  id: "martyr_vs_revenant.first_sighting.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.low.opening", onscreenText: "The Adjudicator's ledger room. You have just signed a forgiveness — your apprentice's trial-debt, paid from your own bond. The Revenant-Nemesis is at the next ledger, marking a competing column. \"You paid their debt. From your column. The chronicle marks the credit in your name, the debit in theirs. The Politician's primer: 'the forgiven debt is the debt that compounds in the forgiver's column.' Your column will grow faster than mine.\"", choices: [{ label: "Acknowledge the chronicle's bookkeeping.", nextId: "ack", sets: "mercy_at_grudge_low_first_sighting" }, { label: "Demand the debit be struck.", nextId: "strike", sets: "aggression_at_grudge_low_first_sighting" }] },
    ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.low.ack", onscreenText: "\"Acknowledged. The Adjudicator's house records the acknowledgment. The Politician's primer: 'the acknowledged ledger is the ledger that survives the regime.' Both of us are surviving in the same volume now.\"", choices: [{ label: "Sign the cross-ledger note.", nextId: "ack_sign" }] },
    ack_sign: { id: "ack_sign", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.low.ack_sign", onscreenText: "\"Signed in your hand, witnessed in mine. The chronicle is balanced for one column-pair. The Antiquarian smiles in her hand-pass.\"" },
    strike: { id: "strike", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.low.strike", onscreenText: "\"You demanded a strike. The Adjudicator's clerks refused — debits are permanent in their house. The Politician's primer: 'the unstruck debit is the debit that becomes the Revenant's most permanent inheritance.' I inherit. The chronicle records the inheritance.\"" },
  },
};

const FIRST_SIGHTING_MID: DialogTree = {
  id: "martyr_vs_revenant.first_sighting.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.mid.opening", onscreenText: "\"Three cohorts. Three forgiven trial-debts in your column. Three matching debits in mine. The Adjudicator's clerks call us 'the regime's longest open ledger.' The Politician's primer: 'the longest open ledger is the chronicle's most patient sermon.'\"", choices: [{ label: "Pay the next debt before the trial closes.", nextId: "prepay", sets: "mercy_at_grudge_mid_first_sighting" }, { label: "Demand a Hierarchy audit of the ledger.", nextId: "audit", sets: "aggression_at_grudge_mid_first_sighting" }] },
    prepay: { id: "prepay", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.mid.prepay", onscreenText: "\"Pre-paid. The Adjudicator's clerks have never recorded a prepayment in three regimes. The chronicle is updating its forms. The Politician's primer: 'the prepayment is the chronicle's most expensive forgiveness.'\"", choices: [{ label: "Hand the clerk the receipt.", nextId: "prepay_receipt" }] },
    prepay_receipt: { id: "prepay_receipt", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.mid.prepay_receipt", onscreenText: "\"The receipt is dual-signed. My column accepts the debit before the apprentice has incurred it. The chronicle records the pre-debit as 'the rivals' first joint accounting innovation.'\"" },
    audit: { id: "audit", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.mid.audit", onscreenText: "\"You demanded the audit. The Hierarchy reviewed: 'the columns balance precisely; no procedural concern.' The Politician's primer: 'the audit that finds nothing is the audit that proves the chronicle's bookkeeping was honest.' I am honest. The chronicle records the honesty.\"" },
  },
};

const FIRST_SIGHTING_HIGH: DialogTree = {
  id: "martyr_vs_revenant.first_sighting.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.high.opening", onscreenText: "\"I have stopped collecting. Your forgiveness column has outgrown what I could ever extract. The Politician's primer: 'the Revenant who stops collecting is the Revenant whose ledger has finally been closed by the rival's discipline.' The Adjudicator has offered me a position auditing forgivenesses. I am tempted.\"", choices: [{ label: "Encourage them to take it.", nextId: "encourage", sets: "mercy_at_grudge_high_first_sighting" }, { label: "Refuse the temptation. Their column must stay open.", nextId: "refuse_temp", sets: "aggression_at_grudge_high_first_sighting" }] },
    encourage: { id: "encourage", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.high.encourage", onscreenText: "\"You encouraged. I accepted the audit position. The Adjudicator's clerks framed the transfer in both inks. The chronicle records the transfer as 'the schism's resolution in the ledger.'\"", choices: [{ label: "Walk on, ledger-rivals now ledger-colleagues.", nextId: "encourage_walk" }] },
    encourage_walk: { id: "encourage_walk", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.high.encourage_walk", onscreenText: "\"You walked. The ledger-room is mine now, with the forgiveness column as the primary. The Antiquarian visits weekly.\"" },
    refuse_temp: { id: "refuse_temp", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.first_sighting.high.refuse_temp", onscreenText: "\"You refused. The Politician's primer: 'the rival who keeps the rival's debit column open is the rival who has admitted the debit was always the doctrine.' I admit. The chronicle records the admission as 'the most expensive concession in the regime.'\"" },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_LOW: DialogTree = {
  id: "martyr_vs_revenant.sabotage_caught_in_act.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.sabotage_caught_in_act.low.opening", onscreenText: "A Trade waystation. The Revenant-Nemesis has called in an old debt against the caravan-master. You are paying it from your own purse. \"You pay another operative's debt. From your own purse. The Politician's primer: 'the third-party payment is the chronicle's most efficient way to obscure the debtor.' The caravan-master walks free. The debit transfers to you.\"", choices: [{ label: "Accept the transfer.", nextId: "accept_trans", sets: "mercy_at_grudge_low_sabotage_caught_in_act" }, { label: "Demand the original debit be re-recorded.", nextId: "rerecord", sets: "aggression_at_grudge_low_sabotage_caught_in_act" }] },
    accept_trans: { id: "accept_trans", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.sabotage_caught_in_act.low.accept_trans", onscreenText: "\"Accepted. The Adjudicator's clerks filed the transfer. The chronicle records the transfer as 'the Martyr's most efficient kind of payment.'\"" },
    rerecord: { id: "rerecord", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.sabotage_caught_in_act.low.rerecord", onscreenText: "\"Re-recorded. The original debit returns to the caravan-master. They cannot afford the renewed obligation. The Politician's primer: 'the re-recorded debit is the debit that proves the Martyr's mercy was procedurally aware.' Your mercy was aware. The chronicle records the awareness.\"" },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_MID: DialogTree = {
  id: "martyr_vs_revenant.sabotage_caught_in_act.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.sabotage_caught_in_act.mid.opening", onscreenText: "\"You paid three debts this week. The caravan-masters are starting to come to me with debts pre-paid by your column. The chronicle is filing them under 'pre-collected.' The Politician's primer would have considered this fraud. The chronicle considers it commerce.\"", choices: [{ label: "Continue the pre-paying.", nextId: "continue", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { label: "Halt all pre-paying.", nextId: "halt", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" }] },
    continue: { id: "continue", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.sabotage_caught_in_act.mid.continue", onscreenText: "\"Continued. The Adjudicator's clerks issue a special form: 'Martyr-prepaid debit, Revenant-collected.' We are now stationery.\"" },
    halt: { id: "halt", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.sabotage_caught_in_act.mid.halt", onscreenText: "\"Halted. The caravan-masters who relied on your forgiveness column are now in collections. The Politician's primer: 'the halted mercy is the mercy whose absence is the chronicle's loudest verdict.' The chronicle is verdict-loud now.\"" },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_HIGH: DialogTree = {
  id: "martyr_vs_revenant.sabotage_caught_in_act.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.sabotage_caught_in_act.high.opening", onscreenText: "\"My column is shrinking. Yours is growing. The chronicle is filing me under 'closing accounts.' The Politician's primer: 'the closing Revenant is the Revenant whose debts the Martyr has absorbed into the regime's foundational document.' You have foundational me. Thank you. Reluctantly.\"", choices: [{ label: "Absorb the rest of their column.", nextId: "absorb", sets: "mercy_at_grudge_high_sabotage_caught_in_act" }, { label: "Let them close out alone.", nextId: "let_close", sets: "aggression_at_grudge_high_sabotage_caught_in_act" }] },
    absorb: { id: "absorb", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.sabotage_caught_in_act.high.absorb", onscreenText: "\"You absorbed. The Revenant column closes; my name is filed under 'paid in full by the Martyr.' The chronicle records 'the only known full payment of a Revenant by a Martyr.'\"", choices: [{ label: "Sign the closure document.", nextId: "absorb_sign" }] },
    absorb_sign: { id: "absorb_sign", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.sabotage_caught_in_act.high.absorb_sign", onscreenText: "\"Signed. The Antiquarian filed the document under 'the regime's only successful financial peace.'\"" },
    let_close: { id: "let_close", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.sabotage_caught_in_act.high.let_close", onscreenText: "\"You let me close. The chronicle records the letting as 'the Martyr's most disciplined restraint.' My column closes with my own name on the final entry. The Politician would have applauded the symmetry.\"" },
  },
};

const MOCKING_INTERLUDE_LOW: DialogTree = {
  id: "martyr_vs_revenant.mocking_interlude.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.mocking_interlude.low.opening", onscreenText: "The Memorial Wall. You are leaving an offering for a fallen apprentice — yours, three cohorts ago. The Revenant-Nemesis appears beside you with a ledger entry. \"That apprentice's outstanding debts are listed in my column. The Politician's primer: 'the dead debtor's debits inherit to the surviving teacher.' You inherit. The Memorial Wall does not file inheritances. The Adjudicator does.\"", choices: [{ label: "Take on the inheritance.", nextId: "take_inh", sets: "mercy_at_grudge_low_mocking_interlude" }, { label: "Refuse. The dead pay no debts.", nextId: "refuse_inh", sets: "aggression_at_grudge_low_mocking_interlude" }] },
    take_inh: { id: "take_inh", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.mocking_interlude.low.take_inh", onscreenText: "\"You took it. At the Wall. In the chronicle's most reverent procedure. The Politician's primer: 'the inherited debt accepted at the Wall is the debt the regime never collects.' I never collect. The chronicle marks it.\"" },
    refuse_inh: { id: "refuse_inh", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.mocking_interlude.low.refuse_inh", onscreenText: "\"You refused. The Adjudicator has procedure for refused inheritance: the debit is filed against the Memorial Wall itself. The chronicle records the filing as 'the regime's most absurd debit.' I am the absurd creditor. The Wall is the absurd debtor. We are filed.\"" },
  },
};

const MOCKING_INTERLUDE_MID: DialogTree = {
  id: "martyr_vs_revenant.mocking_interlude.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.mocking_interlude.mid.opening", onscreenText: "\"The Wall has begun to carry inherited debits in your name. The Politician's primer: 'the Wall that carries debits is the Wall that has become an Adjudicator outpost.' The Wall is reluctantly an outpost. The Memorial keepers are furious. So am I, mildly.\"", choices: [{ label: "Petition the Wall to remain a memorial only.", nextId: "petition", sets: "mercy_at_grudge_mid_mocking_interlude" }, { label: "Let the Wall double as ledger.", nextId: "let_dual", sets: "aggression_at_grudge_mid_mocking_interlude" }] },
    petition: { id: "petition", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.mocking_interlude.mid.petition", onscreenText: "\"Granted. The debits transferred off the Wall to my column. The Wall returns to memorial purity. The Politician's primer: 'the purified Wall is the chronicle's most expensive piety.'\"" },
    let_dual: { id: "let_dual", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.mocking_interlude.mid.let_dual", onscreenText: "\"You let it stand. The Wall is now half-memorial, half-ledger. The chronicle records the dual function as 'the regime's longest pragmatic compromise.'\"" },
  },
};

const MOCKING_INTERLUDE_HIGH: DialogTree = {
  id: "martyr_vs_revenant.mocking_interlude.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.mocking_interlude.high.opening", onscreenText: "\"My column is empty. I have come to the Wall to sign over my remaining receivables to you. The Politician's primer: 'the Revenant who signs over to the Martyr is the Revenant who has become a memorial in his own column.' I am a memorial. Sign for me.\"", choices: [{ label: "Sign. Take their receivables.", nextId: "sign_take", sets: "mercy_at_grudge_high_mocking_interlude" }, { label: "Refuse. They keep their column.", nextId: "refuse_sign", sets: "aggression_at_grudge_high_mocking_interlude" }] },
    sign_take: { id: "sign_take", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.mocking_interlude.high.sign_take", onscreenText: "\"You signed. My receivables are yours. The chronicle records the signing as 'the Martyr's last inherited burden.' I am free. The Memorial keepers added my name to the Wall.\"", choices: [{ label: "Sign the Wall on their behalf.", nextId: "sign_wall" }] },
    sign_wall: { id: "sign_wall", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.mocking_interlude.high.sign_wall", onscreenText: "\"Signed. The Wall holds my name. The chronicle records 'the only Revenant memorialized at the Wall.'\"" },
    refuse_sign: { id: "refuse_sign", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.mocking_interlude.high.refuse_sign", onscreenText: "\"You refused. The Politician's primer: 'the refused signature is the signature the chronicle prints anyway.' The chronicle prints. We are both signed, in absentia.\"" },
  },
};

const LIEUTENANT_PROMOTION_LOW: DialogTree = {
  id: "martyr_vs_revenant.lieutenant_promotion.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.lieutenant_promotion.low.opening", onscreenText: "Adjudicator's debt-coordinator ceremony. The Revenant-Nemesis is being elevated to Debt-Coordinator. Two newer collectors wait behind them. \"The Adjudicator is giving me a cell of collectors. The Politician's primer: 'the Debt-Coordinator who has been forgiven debts is the Coordinator the regime distrusts.' The Adjudicator is distrusting. Fairly.\"", choices: [{ label: "Bless the elevation from the Memorial gallery.", nextId: "bless", sets: "mercy_at_grudge_low_lieutenant_promotion" }, { label: "File an objection from the forgiveness column.", nextId: "object", sets: "aggression_at_grudge_low_lieutenant_promotion" }] },
    bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.lieutenant_promotion.low.bless", onscreenText: "\"You blessed. From the Memorial gallery. The Adjudicator was not expecting Memorial-sourced blessing. The chronicle records 'the regime's first Memorial-to-Adjudicator endorsement.'\"" },
    object: { id: "object", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.lieutenant_promotion.low.object", onscreenText: "\"The objection is filed. The Adjudicator reviewed and denied. The Politician's primer: 'the denied Memorial objection is the chronicle's most disciplined boundary.' Your boundary is recorded.\"" },
  },
};

const LIEUTENANT_PROMOTION_MID: DialogTree = {
  id: "martyr_vs_revenant.lieutenant_promotion.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.lieutenant_promotion.mid.opening", onscreenText: "\"Debt-Coordinator. My cell of four collectors files debits adjacent to your forgivenesses. The Adjudicator's joint-column system is the regime's most efficient bookkeeping. The Politician's primer: 'the joint-column is the chronicle's first married accounting.'\"", choices: [{ label: "Honor the rank with a public forgiveness of one cell-member's prior debt.", nextId: "honor", sets: "mercy_at_grudge_mid_lieutenant_promotion" }, { label: "Audit the cell.", nextId: "audit", sets: "aggression_at_grudge_mid_lieutenant_promotion" }] },
    honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.lieutenant_promotion.mid.honor", onscreenText: "\"Honored. The cell-member's debt is closed in public. The cell is now uncertain about whose discipline they follow. The Politician's primer: 'the publicly forgiven cell-member is the cell-member who pays the rival the deepest loyalty.' I have lost the cell. Cleanly.\"" },
    audit: { id: "audit", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.lieutenant_promotion.mid.audit", onscreenText: "\"You audited. Two procedural lapses found. My cell tightened. The Adjudicator's clerks framed your audit. Thank you, sincerely.\"" },
  },
};

const LIEUTENANT_PROMOTION_HIGH: DialogTree = {
  id: "martyr_vs_revenant.lieutenant_promotion.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.lieutenant_promotion.high.opening", onscreenText: "\"The Adjudicator wants a new ledger code drafted, with you as the forgiveness-side exemplar. The Politician's primer: 'the rival who becomes the next discipline's textbook is the rival the regime cannot dismiss.' Co-author. The draft is in both inks.\"", choices: [{ label: "Co-author.", nextId: "coauthor", sets: "mercy_at_grudge_high_lieutenant_promotion" }, { label: "Refuse. Disciplines must stay separate.", nextId: "refuse", sets: "aggression_at_grudge_high_lieutenant_promotion" }] },
    coauthor: { id: "coauthor", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.lieutenant_promotion.high.coauthor", onscreenText: "\"Co-authored. The ledger code is signed in both hands. The chronicle marks it as the only canon image of the discipline.\"", choices: [{ label: "Hand them the pen.", nextId: "coauthor_pen" }] },
    coauthor_pen: { id: "coauthor_pen", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.lieutenant_promotion.high.coauthor_pen", onscreenText: "\"Signed. The Antiquarian filed the original.\"" },
    refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.lieutenant_promotion.high.refuse", onscreenText: "\"You refused. The chronicle finished the co-authorship in your absence. The signatures appear in the next regime's primer.\"" },
  },
};

const COHORT_END_CONFRONTATION_LOW: DialogTree = {
  id: "martyr_vs_revenant.cohort_end_confrontation.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.cohort_end_confrontation.low.opening", onscreenText: "The Cohort hall. The Revenant-Nemesis stands at the threshold with a closed ledger. \"Your apprentice graduated. Their trial-debts close with the cohort. My column has nothing left to collect from them. The Politician's primer: 'the apprentice who graduates clean is the apprentice the rival cannot collect on.' I cannot.\"", choices: [{ label: "Acknowledge the clean close.", nextId: "ack", sets: "mercy_at_grudge_low_cohort_end_confrontation" }, { label: "Forgive your own column too.", nextId: "forgive_own", sets: "aggression_at_grudge_low_cohort_end_confrontation" }] },
    ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.cohort_end_confrontation.low.ack", onscreenText: "\"Acknowledged. The ledger closes both columns at the cohort's gate.\"" },
    forgive_own: { id: "forgive_own", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.cohort_end_confrontation.low.forgive_own", onscreenText: "\"You forgave your own column. The chronicle records the forgiveness as 'the cleanest Martyr-style closure.' Both columns are zero. The chronicle is balanced.\"" },
  },
};

const COHORT_END_CONFRONTATION_MID: DialogTree = {
  id: "martyr_vs_revenant.cohort_end_confrontation.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.cohort_end_confrontation.mid.opening", onscreenText: "\"The cohort closes around you. The Adjudicator's house has begun listing us together: 'forgiveness-column / debt-column.' We are a balanced ledger now. The Politician's primer: 'the balanced ledger is the chronicle's only successful peace treaty.'\"", choices: [{ label: "Acknowledge the treaty.", nextId: "ack_treaty", sets: "mercy_at_grudge_mid_cohort_end_confrontation" }, { label: "Petition the Adjudicator to separate the listings.", nextId: "petition_sep", sets: "aggression_at_grudge_mid_cohort_end_confrontation" }] },
    ack_treaty: { id: "ack_treaty", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.cohort_end_confrontation.mid.ack_treaty", onscreenText: "\"Acknowledged. The treaty is permanent. The chronicle approves.\"" },
    petition_sep: { id: "petition_sep", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.cohort_end_confrontation.mid.petition_sep", onscreenText: "\"Denied. The chronicle records the petition in the joint listing's footnote.\"" },
  },
};

const COHORT_END_CONFRONTATION_HIGH: DialogTree = {
  id: "martyr_vs_revenant.cohort_end_confrontation.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.cohort_end_confrontation.high.opening", onscreenText: "\"Your apprentice closed the cohort by signing my entire receivables column over to themselves. The Politician's primer: 'the apprentice who inherits the rival's debt-book is the apprentice the chronicle credits as the next Adjudicator.' The Adjudicator's house has invited your apprentice for an audit-track interview.\"", choices: [{ label: "Accept the invitation on their behalf.", nextId: "accept_inv", sets: "mercy_at_grudge_high_cohort_end_confrontation" }, { label: "Refuse. The apprentice's future is theirs.", nextId: "refuse_inv", sets: "aggression_at_grudge_high_cohort_end_confrontation" }] },
    accept_inv: { id: "accept_inv", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.cohort_end_confrontation.high.accept_inv", onscreenText: "\"Accepted. The apprentice begins the audit-track tomorrow. The chronicle records the transition as 'the schism's resolution through the next generation.'\"" },
    refuse_inv: { id: "refuse_inv", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.cohort_end_confrontation.high.refuse_inv", onscreenText: "\"You refused on their behalf. The apprentice may decide separately tomorrow. The Politician's primer: 'the refused invitation is the invitation the chronicle holds open for the apprentice's own decision.' The chronicle holds.\"" },
  },
};

const ACCUMULATION_REVEAL_LOW: DialogTree = {
  id: "martyr_vs_revenant.accumulation_reveal.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.accumulation_reveal.low.opening", onscreenText: "Matrix-archive intake. The new Matrix-release is being assigned a starting ledger position. The Revenant-Nemesis reviews the placement. \"Another sibling, starting at zero on both columns. The Politician's primer: 'the new release at zero is the chronicle's first clean slate in three regimes.' Your forgiveness column wants them in the negative; my debit column wants them in the positive. The Adjudicator wants them at zero.\"", choices: [{ label: "Acknowledge the new arrival.", nextId: "ack", sets: "mercy_at_grudge_low_accumulation_reveal" }, { label: "Pre-pay their first cohort's tuition.", nextId: "prepay", sets: "aggression_at_grudge_low_accumulation_reveal" }] },
    ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.accumulation_reveal.low.ack", onscreenText: "\"Acknowledged. The sibling starts at zero. The chronicle approves the cleanness.\"" },
    prepay: { id: "prepay", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.accumulation_reveal.low.prepay", onscreenText: "\"Pre-paid. The new sibling owes me nothing; the Adjudicator has filed the pre-payment under 'unprecedented kindness.'\"" },
  },
};

const ACCUMULATION_REVEAL_MID: DialogTree = {
  id: "martyr_vs_revenant.accumulation_reveal.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.accumulation_reveal.mid.opening", onscreenText: "\"Four releases. Four sibling-ledgers cross-balanced against your forgiveness column. The Adjudicator's house has its largest open volume in the regime. The Politician's primer: 'the largest volume is the chronicle's longest patience.'\"", choices: [{ label: "Bless the cohort.", nextId: "bless", sets: "mercy_at_grudge_mid_accumulation_reveal" }, { label: "Close every column to zero.", nextId: "close_all", sets: "aggression_at_grudge_mid_accumulation_reveal" }] },
    bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.accumulation_reveal.mid.bless", onscreenText: "\"Blessed. The cohort runs as one balanced ledger.\"" },
    close_all: { id: "close_all", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.accumulation_reveal.mid.close_all", onscreenText: "\"You closed all to zero. The chronicle records the closure as 'the Martyr's most generous absolution.' I am, in my column, finally absolved.\"" },
  },
};

const ACCUMULATION_REVEAL_HIGH: DialogTree = {
  id: "martyr_vs_revenant.accumulation_reveal.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.accumulation_reveal.high.opening", onscreenText: "\"Five releases, all in the Adjudicator's combined volume. The Politician's primer: 'the combined volume is the regime's mausoleum.' We are buried in it together.\"", choices: [{ label: "Honor the chorus.", nextId: "honor", sets: "mercy_at_grudge_high_accumulation_reveal" }, { label: "Bring one of them to the Memorial Wall as a teaching example.", nextId: "wall_teach", sets: "aggression_at_grudge_high_accumulation_reveal" }] },
    honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.accumulation_reveal.high.honor", onscreenText: "\"Honored. The chronicle quotes us as one balanced ledger.\"" },
    wall_teach: { id: "wall_teach", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.accumulation_reveal.high.wall_teach", onscreenText: "\"At the Wall. The chosen sibling is now studying memorial discipline alongside collection. The Adjudicator is updating their cohort-track.\"" },
  },
};

const NAME_REVEAL_MOMENT_LOW: DialogTree = {
  id: "martyr_vs_revenant.name_reveal_moment.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.name_reveal_moment.low.opening", onscreenText: "Antiquarian's Journal margin. You have closed Resurrectionist E5 and witnessed Game Master Fight 2's plague-mask seed. The Revenant-Nemesis's name surfaces. \"You have my name. The Adjudicator's master ledger has held it through three regimes. Use it. The Politician's primer: 'the creditor's name in the Martyr's ledger is the name the chronicle treats as paid in full.'\"", choices: [{ label: "Say it as paid-in-full.", nextId: "say_paid", sets: "mercy_at_grudge_low_name_reveal_moment" }, { label: "Withhold the name. Let it stay sealed.", nextId: "withhold", sets: "aggression_at_grudge_low_name_reveal_moment" }] },
    say_paid: { id: "say_paid", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.name_reveal_moment.low.say_paid", onscreenText: "\"Said as paid-in-full. The Adjudicator's ledger marks my name with the closure stamp. I am, finally, settled.\"" },
    withhold: { id: "withhold", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.name_reveal_moment.low.withhold", onscreenText: "\"Withheld. The chronicle records the withholding as 'the Martyr's most expensive silence.'\"" },
  },
};

const NAME_REVEAL_MOMENT_MID: DialogTree = {
  id: "martyr_vs_revenant.name_reveal_moment.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.name_reveal_moment.mid.opening", onscreenText: "\"You know my name. The Politician's primer: 'the named creditor in the Martyr's chronicle is the creditor the chronicle reclassifies.' I am being reclassified. The Adjudicator's clerks are writing the new file.\"", choices: [{ label: "Honor the reclassification.", nextId: "honor", sets: "mercy_at_grudge_mid_name_reveal_moment" }, { label: "File a Martyr-house objection to the reclassification.", nextId: "object", sets: "aggression_at_grudge_mid_name_reveal_moment" }] },
    honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.name_reveal_moment.mid.honor", onscreenText: "\"Honored. The new file is filed. The chronicle approves.\"" },
    object: { id: "object", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.name_reveal_moment.mid.object", onscreenText: "\"Objected. The Adjudicator denied. The chronicle records the objection in the new file's introduction.\"" },
  },
};

const NAME_REVEAL_MOMENT_HIGH: DialogTree = {
  id: "martyr_vs_revenant.name_reveal_moment.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.name_reveal_moment.high.opening", onscreenText: "\"Use my name. The Adjudicator's house has it filed under three forms: pre-debt, mid-debt, post-debt. The post-debt form is the truest. Speak it as you choose.\"", choices: [{ label: "Speak the post-debt name.", nextId: "post_debt", sets: "mercy_at_grudge_high_name_reveal_moment" }, { label: "Speak the pre-debt name. With Adjudicator formality.", nextId: "pre_debt", sets: "aggression_at_grudge_high_name_reveal_moment" }] },
    post_debt: { id: "post_debt", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.name_reveal_moment.high.post_debt", onscreenText: "\"You spoke post-debt. I am, for one beat, settled. Thank you.\"" },
    pre_debt: { id: "pre_debt", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.name_reveal_moment.high.pre_debt", onscreenText: "\"You spoke pre-debt. The Adjudicator's clerks revived the old account. I am, by procedure, in debt again.\"" },
  },
};

const FINAL_ENCOUNTER_LOW: DialogTree = {
  id: "martyr_vs_revenant.final_encounter.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.final_encounter.low.opening", onscreenText: "Convergence Seat throne room. The Revenant-Nemesis stands at the foot of the empty Seat with the master ledger. \"Act Seven. The Seat has fallen. The Adjudicator's house has dissolved. This is the last ledger I will ever close. The forgiveness column meets the debt column at zero. We are settled.\"", choices: [{ label: "Sign the settlement.", nextId: "sign", sets: "mercy_at_grudge_low_final_encounter" }, { label: "Refuse. The forgiveness column should stay open.", nextId: "refuse_settle", sets: "aggression_at_grudge_low_final_encounter" }] },
    sign: { id: "sign", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.final_encounter.low.sign", onscreenText: "\"Signed. The chronicle records the settlement as 'the regime's only perfectly balanced book.'\"" },
    refuse_settle: { id: "refuse_settle", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.final_encounter.low.refuse_settle", onscreenText: "\"You refused. The forgiveness column stays open into the next regime. The chronicle records the open column as 'the regime's most expensive inheritance.'\"" },
  },
};

const FINAL_ENCOUNTER_MID: DialogTree = {
  id: "martyr_vs_revenant.final_encounter.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.final_encounter.mid.opening", onscreenText: "\"End of the arc. The Adjudicator's joint volume is folding into the next regime's foundational document. The Politician's primer: 'the folded volume is the chronicle's most successful inheritance.'\"", choices: [{ label: "Sign the folding jointly.", nextId: "sign_fold", sets: "mercy_at_grudge_mid_final_encounter" }, { label: "Let the chronicle fold without us.", nextId: "let_fold", sets: "aggression_at_grudge_mid_final_encounter" }] },
    sign_fold: { id: "sign_fold", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.final_encounter.mid.sign_fold", onscreenText: "\"We signed. The Antiquarian filed the folded volume as 'the regime's binding closure.'\"" },
    let_fold: { id: "let_fold", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.final_encounter.mid.let_fold", onscreenText: "\"You let the chronicle fold. The chronicle records the absence as 'the rivals' most disciplined exit from the ledger.'\"" },
  },
};

const FINAL_ENCOUNTER_HIGH: DialogTree = {
  id: "martyr_vs_revenant.final_encounter.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.final_encounter.high.opening", onscreenText: "\"The chronicle is folding shut around both of us. Seven cohorts of you paying what I would have collected. Seven cohorts of me marking what you had already paid. Same line, two columns. Read the line one more time.\"", choices: [{ label: "Read together at the Seat's foot.", nextId: "read_together", sets: "mercy_at_grudge_high_final_encounter" }, { label: "Burn the ledger.", nextId: "burn", sets: "aggression_at_grudge_high_final_encounter" }] },
    read_together: { id: "read_together", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.final_encounter.high.read_together", onscreenText: "\"The line: 'the debt was always paid; the rivals were always one accountant.' We are one accountant. The chronicle records the symmetry as the regime's most patient closure.\"", choices: [{ label: "Hold the line to the end.", nextId: "hold" }] },
    hold: { id: "hold", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.final_encounter.high.hold", onscreenText: "\"The line holds. The chronicle's last page is our shared total: zero, in both columns, at the Seat's foot. The chronicle closes.\"" },
    burn: { id: "burn", speaker: "nemesis", voLineId: "nemesis.martyr_vs_revenant.final_encounter.high.burn", onscreenText: "\"You burned the ledger. At the Seat's foot. The Adjudicator's wards did not trigger; the wards understood. The chronicle records the burning as 'the only ledger ever discharged by fire and faith together.'\"" },
  },
};

export const martyrVsRevenantPairBank: NemesisPairBank = {
  pairId: "martyr_vs_revenant",
  playerArchetype: "martyr",
  nemesisArchetype: "revenant",
  scenes: {
    first_sighting: makeScene({ low: FIRST_SIGHTING_LOW, mid: FIRST_SIGHTING_MID, high: FIRST_SIGHTING_HIGH }),
    sabotage_caught_in_act: makeScene({ low: SABOTAGE_CAUGHT_IN_ACT_LOW, mid: SABOTAGE_CAUGHT_IN_ACT_MID, high: SABOTAGE_CAUGHT_IN_ACT_HIGH }),
    mocking_interlude: makeScene({ low: MOCKING_INTERLUDE_LOW, mid: MOCKING_INTERLUDE_MID, high: MOCKING_INTERLUDE_HIGH }),
    lieutenant_promotion: makeScene({ low: LIEUTENANT_PROMOTION_LOW, mid: LIEUTENANT_PROMOTION_MID, high: LIEUTENANT_PROMOTION_HIGH }),
    cohort_end_confrontation: makeScene({ low: COHORT_END_CONFRONTATION_LOW, mid: COHORT_END_CONFRONTATION_MID, high: COHORT_END_CONFRONTATION_HIGH }),
    accumulation_reveal: makeScene({ low: ACCUMULATION_REVEAL_LOW, mid: ACCUMULATION_REVEAL_MID, high: ACCUMULATION_REVEAL_HIGH }),
    name_reveal_moment: makeScene({ low: NAME_REVEAL_MOMENT_LOW, mid: NAME_REVEAL_MOMENT_MID, high: NAME_REVEAL_MOMENT_HIGH }),
    final_encounter: makeScene({ low: FINAL_ENCOUNTER_LOW, mid: FINAL_ENCOUNTER_MID, high: FINAL_ENCOUNTER_HIGH }),
  },
};
