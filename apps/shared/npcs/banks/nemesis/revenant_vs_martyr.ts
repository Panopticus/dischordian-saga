/* ═══════════════════════════════════════════════════════
   REVENANT-PLAYER vs. MARTYR-NEMESIS — Phase K Wave 7C (canon, reverse)
   Sacrifice vs debt, reversed. You keep the debt-column; the
   Martyr-Nemesis pays from theirs, even debts that aren't theirs.
   Surfaces: Adjudicator's ledger room, Memorial Wall, Trade
   waystation, cohort gate, Convergence Seat.
   ═══════════════════════════════════════════════════════ */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

const FS_L: DialogTree = { id: "revenant_vs_martyr.first_sighting.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.low.opening", onscreenText: "Adjudicator's ledger room. You have just filed a new debit. The Martyr-Nemesis sits at the forgiveness desk and signs the closure paper before you can finish writing the debtor's name. \"You file. I close. The Adjudicator's clerks have learned to keep both pens ready. The Politician's primer: 'the rivals at the same ledger are the chronicle's most efficient resolution.'\"", choices: [
    { label: "Acknowledge the joint procedure.", nextId: "ack", sets: "mercy_at_grudge_low_first_sighting" },
    { label: "File the debit against the Martyr's column.", nextId: "file_martyr", sets: "aggression_at_grudge_low_first_sighting" }] },
  ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.low.ack", onscreenText: "\"Acknowledged. The clerks update their procedure manual. The chronicle marks it.\"", choices: [{ label: "Sign the new manual.", nextId: "ack_sign" }] },
  ack_sign: { id: "ack_sign", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.low.ack_sign", onscreenText: "\"Signed in both inks. The procedure is permanent.\"" },
  file_martyr: { id: "file_martyr", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.low.file_martyr", onscreenText: "\"Filed against my column. The clerks accept the filing — I can absorb the debit. The chronicle records 'the Revenant who fed the Martyr's column directly.'\"" } } };

const FS_M: DialogTree = { id: "revenant_vs_martyr.first_sighting.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.mid.opening", onscreenText: "\"Three cohorts. Every debit you file, I close from my column. The Adjudicator's annual audit lists us as 'the regime's most patient pair.' The Politician's primer would have demanded we audit each other. The chronicle has filed us as auditing nothing.\"", choices: [
    { label: "Trust the lack of mutual audit.", nextId: "trust", sets: "mercy_at_grudge_mid_first_sighting" },
    { label: "Demand a Hierarchy audit of both columns.", nextId: "demand", sets: "aggression_at_grudge_mid_first_sighting" }] },
  trust: { id: "trust", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.mid.trust", onscreenText: "\"Trusted. The chronicle records 'the rivals who refused to audit each other and survived.'\"" },
  demand: { id: "demand", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.mid.demand", onscreenText: "\"The audit found nothing untoward. The Politician's primer: 'the audit that finds nothing is the audit that proves the chronicle's honesty.'\"" } } };

const FS_H: DialogTree = { id: "revenant_vs_martyr.first_sighting.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.high.opening", onscreenText: "\"My column is empty. Every debit you ever filed has been closed by me. The Adjudicator has offered me the master ledger seat. The Politician's primer: 'the Martyr who is offered the master seat is the Martyr who has converted the Revenant's discipline into procedure.' I converted you. Accept the conversion.\"", choices: [
    { label: "Take the master seat with them.", nextId: "take_seat", sets: "mercy_at_grudge_high_first_sighting" },
    { label: "Refuse the conversion. Keep filing.", nextId: "refuse_conv", sets: "aggression_at_grudge_high_first_sighting" }] },
  take_seat: { id: "take_seat", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.high.take_seat", onscreenText: "\"We share the master ledger. The chronicle records 'the only joint master seat in the regime.'\"", choices: [{ label: "Sign both inks on the master cover.", nextId: "ts_sign" }] },
  ts_sign: { id: "ts_sign", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.high.ts_sign", onscreenText: "\"Signed. Permanent.\"" },
  refuse_conv: { id: "refuse_conv", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.first_sighting.high.refuse_conv", onscreenText: "\"Refused. I take the seat alone. The Politician's primer: 'the refused conversion is the conversion the chronicle records as the rival's most disciplined boundary.'\"" } } };

const SC_L: DialogTree = { id: "revenant_vs_martyr.sabotage_caught_in_act.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.sabotage_caught_in_act.low.opening", onscreenText: "A trade waystation. You are filing a collection against a delinquent caravan-master. The Martyr-Nemesis arrives and pays the debt from their own purse. \"You file; I pay. The caravan-master walks free.\"", choices: [
    { label: "Accept the third-party payment.", nextId: "accept", sets: "mercy_at_grudge_low_sabotage_caught_in_act" },
    { label: "Reject the payment. Demand the original debtor pay.", nextId: "reject", sets: "aggression_at_grudge_low_sabotage_caught_in_act" }] },
  accept: { id: "accept", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.sabotage_caught_in_act.low.accept", onscreenText: "\"Accepted. The Adjudicator filed the substitution.\"" },
  reject: { id: "reject", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.sabotage_caught_in_act.low.reject", onscreenText: "\"Rejected. The Adjudicator's clerks restored the original debt to the caravan-master. The chronicle records 'the Revenant who refused the Martyr's substitution.'\"" } } };

const SC_M: DialogTree = { id: "revenant_vs_martyr.sabotage_caught_in_act.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.sabotage_caught_in_act.mid.opening", onscreenText: "\"You file ten collections; the Martyr pre-pays nine. The clerks file the tenth with a footnote: 'Martyr unable to keep pace.' The Politician's primer: 'the unkept pace is the chronicle's most expensive race.'\"", choices: [
    { label: "Slow your filings to match.", nextId: "slow", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" },
    { label: "Accelerate the filings.", nextId: "accel", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" }] },
  slow: { id: "slow", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.sabotage_caught_in_act.mid.slow", onscreenText: "\"Slowed. The Martyr caught up. The chronicle records the joint cadence as 'the regime's most patient bookkeeping.'\"" },
  accel: { id: "accel", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.sabotage_caught_in_act.mid.accel", onscreenText: "\"Accelerated. The Martyr's column emptied; they declared insolvency. The chronicle records 'the Revenant who outpaced mercy.'\"" } } };

const SC_H: DialogTree = { id: "revenant_vs_martyr.sabotage_caught_in_act.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.sabotage_caught_in_act.high.opening", onscreenText: "\"My column is closed. I am here at the waystation as a citizen. The Politician's primer: 'the bankrupt Martyr is the Martyr the chronicle treats as a memorial.' Treat me as one.\"", choices: [
    { label: "Memorial them in the next collection's footnote.", nextId: "memorial", sets: "mercy_at_grudge_high_sabotage_caught_in_act" },
    { label: "File one final debit against them.", nextId: "final_debit", sets: "aggression_at_grudge_high_sabotage_caught_in_act" }] },
  memorial: { id: "memorial", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.sabotage_caught_in_act.high.memorial", onscreenText: "\"Memorialed. The footnote is permanent. The Antiquarian filed the entry.\"", choices: [{ label: "Sign the footnote in both inks.", nextId: "mem_sign" }] },
  mem_sign: { id: "mem_sign", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.sabotage_caught_in_act.high.mem_sign", onscreenText: "\"Signed in both. The chronicle records 'the only Memorial entry filed by a Revenant.'\"" },
  final_debit: { id: "final_debit", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.sabotage_caught_in_act.high.final_debit", onscreenText: "\"Filed. The chronicle records 'the Revenant's most disciplined cruelty.' The Antiquarian seals the file under permanent review.\"" } } };

const MI_L: DialogTree = { id: "revenant_vs_martyr.mocking_interlude.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.mocking_interlude.low.opening", onscreenText: "Memorial Wall. The Martyr-Nemesis is leaving an offering for a fallen apprentice. They look up. \"You bring a debit-slip to a Memorial. The Politician's primer: 'the Revenant at the Wall is the Revenant the chronicle treats as a witness.' Witness.\"", choices: [
    { label: "Leave the slip at the Wall.", nextId: "leave_slip", sets: "mercy_at_grudge_low_mocking_interlude" },
    { label: "Read the debit aloud.", nextId: "read_aloud", sets: "aggression_at_grudge_low_mocking_interlude" }] },
  leave_slip: { id: "leave_slip", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.mocking_interlude.low.leave_slip", onscreenText: "\"Left. The Memorial keepers accept the slip as 'a debt the dead cannot collect.' The chronicle approves.\"" },
  read_aloud: { id: "read_aloud", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.mocking_interlude.low.read_aloud", onscreenText: "\"Read aloud. The Wall's keepers wrote your name in the offending-visitor log. The chronicle records the log.\"" } } };

const MI_M: DialogTree = { id: "revenant_vs_martyr.mocking_interlude.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.mocking_interlude.mid.opening", onscreenText: "\"The Wall now has a small alcove for debit-slips you bring. The keepers call it 'the Revenant's confessional.' The Politician's primer: 'the confessional Revenant is the Revenant the chronicle reclassifies.'\"", choices: [
    { label: "Use the alcove regularly.", nextId: "use_alcove", sets: "mercy_at_grudge_mid_mocking_interlude" },
    { label: "Refuse to use the alcove.", nextId: "refuse_alcove", sets: "aggression_at_grudge_mid_mocking_interlude" }] },
  use_alcove: { id: "use_alcove", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.mocking_interlude.mid.use_alcove", onscreenText: "\"Used. The alcove fills. The Memorial keepers framed your second visit.\"" },
  refuse_alcove: { id: "refuse_alcove", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.mocking_interlude.mid.refuse_alcove", onscreenText: "\"Refused. The alcove stayed empty. The chronicle records the empty alcove as 'the Revenant's most disciplined refusal of memorial procedure.'\"" } } };

const MI_H: DialogTree = { id: "revenant_vs_martyr.mocking_interlude.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.mocking_interlude.high.opening", onscreenText: "\"I am dying. My column closed for the last time yesterday. The Wall has reserved an entry for me. The Politician's primer: 'the dying Martyr asks the rival to deliver the eulogy.' Deliver mine.\"", choices: [
    { label: "Deliver the eulogy.", nextId: "deliver", sets: "mercy_at_grudge_high_mocking_interlude" },
    { label: "Refuse. Their column will speak for itself.", nextId: "refuse", sets: "aggression_at_grudge_high_mocking_interlude" }] },
  deliver: { id: "deliver", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.mocking_interlude.high.deliver", onscreenText: "\"You delivered. In Revenant cadence. The Wall keepers wept. The Politician's primer: 'the Revenant who eulogizes the Martyr is the Revenant who has become Memorial.'\"", choices: [{ label: "Sign the Wall on their behalf.", nextId: "sign_wall" }] },
  sign_wall: { id: "sign_wall", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.mocking_interlude.high.sign_wall", onscreenText: "\"Signed. The chronicle records 'the only joint signature on the Wall.'\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.mocking_interlude.high.refuse", onscreenText: "\"Refused. The column eulogized me itself. The chronicle records 'the longest column that spoke at its own closure.'\"" } } };

const LP_L: DialogTree = { id: "revenant_vs_martyr.lieutenant_promotion.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.lieutenant_promotion.low.opening", onscreenText: "Memorial coordinator ceremony. The Martyr-Nemesis is being elevated to Memorial Coordinator. \"The Memorial keepers are giving me coordinator duties. The Politician's primer: 'the Memorial Coordinator who has been collected against is the Coordinator the chronicle distrusts.' Fairly.\"", choices: [
    { label: "Bless from the Adjudicator's gallery.", nextId: "bless", sets: "mercy_at_grudge_low_lieutenant_promotion" },
    { label: "File a procedural objection.", nextId: "object", sets: "aggression_at_grudge_low_lieutenant_promotion" }] },
  bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.lieutenant_promotion.low.bless", onscreenText: "\"Blessed. The Memorial keepers were not expecting Adjudicator-gallery endorsement.\"" },
  object: { id: "object", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.lieutenant_promotion.low.object", onscreenText: "\"Denied. The chronicle records your objection.\"" } } };

const LP_M: DialogTree = { id: "revenant_vs_martyr.lieutenant_promotion.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.lieutenant_promotion.mid.opening", onscreenText: "\"Memorial Coordinator. My cell of four memorial-keepers maintains the Wall in partnership with your debit-column. The Politician's primer: 'the joint maintenance is the chronicle's first cross-discipline custodianship.'\"", choices: [
    { label: "Honor with a closed debt-entry.", nextId: "honor", sets: "mercy_at_grudge_mid_lieutenant_promotion" },
    { label: "Audit the Memorial keeping.", nextId: "audit", sets: "aggression_at_grudge_mid_lieutenant_promotion" }] },
  honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.lieutenant_promotion.mid.honor", onscreenText: "\"Honored. The keepers framed your closed entry.\"" },
  audit: { id: "audit", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.lieutenant_promotion.mid.audit", onscreenText: "\"Audited. Two procedural lapses found. The keepers tightened. Thank you.\"" } } };

const LP_H: DialogTree = { id: "revenant_vs_martyr.lieutenant_promotion.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.lieutenant_promotion.high.opening", onscreenText: "\"The Memorial keepers want a new custodian code, with you as the Revenant-side exemplar. Co-author.\"", choices: [
    { label: "Co-author.", nextId: "coauthor", sets: "mercy_at_grudge_high_lieutenant_promotion" },
    { label: "Refuse.", nextId: "refuse", sets: "aggression_at_grudge_high_lieutenant_promotion" }] },
  coauthor: { id: "coauthor", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.lieutenant_promotion.high.coauthor", onscreenText: "\"Signed in both inks. The code is canon.\"", choices: [{ label: "Hand them the pen.", nextId: "ca_pen" }] },
  ca_pen: { id: "ca_pen", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.lieutenant_promotion.high.ca_pen", onscreenText: "\"Permanent.\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.lieutenant_promotion.high.refuse", onscreenText: "\"The chronicle finished the co-authorship in your absence.\"" } } };

const CE_L: DialogTree = { id: "revenant_vs_martyr.cohort_end_confrontation.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.cohort_end_confrontation.low.opening", onscreenText: "Cohort hall. Martyr-Nemesis at the threshold with a closure receipt. \"Your apprentice graduated. I closed their debt-column from mine. The Politician's primer: 'the closed apprentice column is the cleanest gift.'\"", choices: [
    { label: "Accept the gift.", nextId: "accept_gift", sets: "mercy_at_grudge_low_cohort_end_confrontation" },
    { label: "Reverse the closure. Let your apprentice pay.", nextId: "reverse", sets: "aggression_at_grudge_low_cohort_end_confrontation" }] },
  accept_gift: { id: "accept_gift", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.cohort_end_confrontation.low.accept_gift", onscreenText: "\"Accepted. The Adjudicator filed the gift.\"" },
  reverse: { id: "reverse", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.cohort_end_confrontation.low.reverse", onscreenText: "\"Reversed. Your apprentice paid in full. The chronicle records 'the Revenant who refused the Martyr's mercy on their own apprentice.'\"" } } };

const CE_M: DialogTree = { id: "revenant_vs_martyr.cohort_end_confrontation.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.cohort_end_confrontation.mid.opening", onscreenText: "\"The cohort closes around you. The Adjudicator lists us as 'debt-column / forgiveness-column.' We are a balanced ledger.\"", choices: [
    { label: "Acknowledge the balance.", nextId: "ack", sets: "mercy_at_grudge_mid_cohort_end_confrontation" },
    { label: "Petition for separate listings.", nextId: "petition", sets: "aggression_at_grudge_mid_cohort_end_confrontation" }] },
  ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.cohort_end_confrontation.mid.ack", onscreenText: "\"Acknowledged. Permanent.\"" },
  petition: { id: "petition", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.cohort_end_confrontation.mid.petition", onscreenText: "\"Denied. Recorded in the footnote.\"" } } };

const CE_H: DialogTree = { id: "revenant_vs_martyr.cohort_end_confrontation.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.cohort_end_confrontation.high.opening", onscreenText: "\"Your apprentice closed the cohort by paying off my entire receivables column from their own bond. The Adjudicator invited them onto the audit-track.\"", choices: [
    { label: "Accept on their behalf.", nextId: "accept", sets: "mercy_at_grudge_high_cohort_end_confrontation" },
    { label: "Refuse.", nextId: "refuse", sets: "aggression_at_grudge_high_cohort_end_confrontation" }] },
  accept: { id: "accept", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.cohort_end_confrontation.high.accept", onscreenText: "\"Accepted. The apprentice begins tomorrow.\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.cohort_end_confrontation.high.refuse", onscreenText: "\"Refused on their behalf. The Politician's primer: 'the invitation held open is the invitation the apprentice decides on their own.'\"" } } };

const AR_L: DialogTree = { id: "revenant_vs_martyr.accumulation_reveal.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.accumulation_reveal.low.opening", onscreenText: "Matrix-archive intake. New sibling-release placement is being scored. The Martyr-Nemesis files a pre-forgiveness on the sibling's starting debit.\"", choices: [
    { label: "Acknowledge the pre-forgiveness.", nextId: "ack", sets: "mercy_at_grudge_low_accumulation_reveal" },
    { label: "Refuse. The sibling should start clean.", nextId: "refuse", sets: "aggression_at_grudge_low_accumulation_reveal" }] },
  ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.accumulation_reveal.low.ack", onscreenText: "\"Acknowledged. The sibling starts negative; the Martyr already owes.\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.accumulation_reveal.low.refuse", onscreenText: "\"Refused. The sibling starts at zero, as the Adjudicator prefers.\"" } } };

const AR_M: DialogTree = { id: "revenant_vs_martyr.accumulation_reveal.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.accumulation_reveal.mid.opening", onscreenText: "\"Four siblings, all pre-forgiven by the Martyr's column. My column is shrinking. The Politician's primer: 'the shrinking Revenant is the chronicle's most efficient peace.'\"", choices: [
    { label: "Bless the cohort.", nextId: "bless", sets: "mercy_at_grudge_mid_accumulation_reveal" },
    { label: "Demand a Hierarchy audit.", nextId: "audit", sets: "aggression_at_grudge_mid_accumulation_reveal" }] },
  bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.accumulation_reveal.mid.bless", onscreenText: "\"Blessed. Peace continues.\"" },
  audit: { id: "audit", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.accumulation_reveal.mid.audit", onscreenText: "\"Found nothing untoward.\"" } } };

const AR_H: DialogTree = { id: "revenant_vs_martyr.accumulation_reveal.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.accumulation_reveal.high.opening", onscreenText: "\"Five siblings. The Martyr's column has paid every one of their debts before they incurred them. I am, by procedure, redundant. The Politician's primer: 'the redundant Revenant is the chronicle's most expensive peace dividend.'\"", choices: [
    { label: "Honor the chorus.", nextId: "honor", sets: "mercy_at_grudge_high_accumulation_reveal" },
    { label: "Reactivate the column. Bring the Revenant discipline back.", nextId: "reactivate", sets: "aggression_at_grudge_high_accumulation_reveal" }] },
  honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.accumulation_reveal.high.honor", onscreenText: "\"Honored. Peace is the regime's new standard.\"" },
  reactivate: { id: "reactivate", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.accumulation_reveal.high.reactivate", onscreenText: "\"Reactivated. The Politician's primer would have applauded. The Martyr is now overworked. The chronicle records the strain.\"" } } };

const NR_L: DialogTree = { id: "revenant_vs_martyr.name_reveal_moment.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.name_reveal_moment.low.opening", onscreenText: "Antiquarian's Journal margin. Martyr-Nemesis's name surfaces. \"You have my name. The Memorial keepers have it engraved on the donor list. Use it. The Politician's primer: 'the engraved name is the name the chronicle treats as paid forward.'\"", choices: [
    { label: "Say it as paid-forward.", nextId: "say", sets: "mercy_at_grudge_low_name_reveal_moment" },
    { label: "File it in the debit column.", nextId: "file", sets: "aggression_at_grudge_low_name_reveal_moment" }] },
  say: { id: "say", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.name_reveal_moment.low.say", onscreenText: "\"Said. The chronicle marks the smallest font.\"" },
  file: { id: "file", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.name_reveal_moment.low.file", onscreenText: "\"Filed. The Memorial keepers struck the engraving. The chronicle records 'the Revenant who unmemorialed the Martyr.'\"" } } };

const NR_M: DialogTree = { id: "revenant_vs_martyr.name_reveal_moment.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.name_reveal_moment.mid.opening", onscreenText: "\"You know my name. The Politician's primer: 'the named donor is the donor the chronicle indexes by inheritance.'\"", choices: [
    { label: "Honor the name in your next collection.", nextId: "honor", sets: "mercy_at_grudge_mid_name_reveal_moment" },
    { label: "Strike the name from your records.", nextId: "strike", sets: "aggression_at_grudge_mid_name_reveal_moment" }] },
  honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.name_reveal_moment.mid.honor", onscreenText: "\"Honored. The Memorial keepers reciprocated.\"" },
  strike: { id: "strike", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.name_reveal_moment.mid.strike", onscreenText: "\"Struck. The chronicle records 'the strike.'\"" } } };

const NR_H: DialogTree = { id: "revenant_vs_martyr.name_reveal_moment.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.name_reveal_moment.high.opening", onscreenText: "\"Use my name. The Memorial keepers have it; the Adjudicator's clerks have it; you have it. Speak it as you choose.\"", choices: [
    { label: "Speak it as forgiveness.", nextId: "forgive", sets: "mercy_at_grudge_high_name_reveal_moment" },
    { label: "Speak it as collection notice.", nextId: "collect", sets: "aggression_at_grudge_high_name_reveal_moment" }] },
  forgive: { id: "forgive", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.name_reveal_moment.high.forgive", onscreenText: "\"Spoken as forgiveness. I am, finally, free.\"" },
  collect: { id: "collect", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.name_reveal_moment.high.collect", onscreenText: "\"Collection notice received. The Memorial keepers grieve. The Adjudicator's clerks file the notice.\"" } } };

const FE_L: DialogTree = { id: "revenant_vs_martyr.final_encounter.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.final_encounter.low.opening", onscreenText: "Convergence Seat throne room. Martyr-Nemesis at the empty Seat with a final receipt. \"Act Seven. The Seat has fallen. This is the last forgiveness. The forgiveness column closes against your debt column. Both at zero.\"", choices: [
    { label: "Sign the settlement.", nextId: "sign", sets: "mercy_at_grudge_low_final_encounter" },
    { label: "Refuse. The debt column should stay open.", nextId: "refuse", sets: "aggression_at_grudge_low_final_encounter" }] },
  sign: { id: "sign", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.final_encounter.low.sign", onscreenText: "\"Signed. The regime's only perfectly balanced book.\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.final_encounter.low.refuse", onscreenText: "\"Refused. The debt column inherits into the next regime.\"" } } };

const FE_M: DialogTree = { id: "revenant_vs_martyr.final_encounter.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.final_encounter.mid.opening", onscreenText: "\"End of the arc. The Adjudicator's joint volume is folding into the next regime's foundational document.\"", choices: [
    { label: "Sign the folding jointly.", nextId: "sign", sets: "mercy_at_grudge_mid_final_encounter" },
    { label: "Let the chronicle fold.", nextId: "let_fold", sets: "aggression_at_grudge_mid_final_encounter" }] },
  sign: { id: "sign", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.final_encounter.mid.sign", onscreenText: "\"Signed together. Permanent.\"" },
  let_fold: { id: "let_fold", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.final_encounter.mid.let_fold", onscreenText: "\"The chronicle folded. The most disciplined exit.\"" } } };

const FE_H: DialogTree = { id: "revenant_vs_martyr.final_encounter.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.final_encounter.high.opening", onscreenText: "\"The chronicle is folding shut. Seven cohorts of you collecting; seven cohorts of me forgiving. Same line, two columns. Read the line one more time.\"", choices: [
    { label: "Read together at the Seat's foot.", nextId: "read", sets: "mercy_at_grudge_high_final_encounter" },
    { label: "Burn the ledger.", nextId: "burn", sets: "aggression_at_grudge_high_final_encounter" }] },
  read: { id: "read", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.final_encounter.high.read", onscreenText: "\"The line: 'the debt was always paid; the rivals were always one accountant.' We are one accountant. The chronicle closes around the symmetry.\"", choices: [{ label: "Hold the line.", nextId: "hold" }] },
  hold: { id: "hold", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.final_encounter.high.hold", onscreenText: "\"The line holds. The chronicle's last page is zero, in both columns.\"" },
  burn: { id: "burn", speaker: "nemesis", voLineId: "nemesis.revenant_vs_martyr.final_encounter.high.burn", onscreenText: "\"Burned. The Adjudicator's wards did not trigger. The chronicle records 'discharged by fire and faith together.'\"" } } };

export const revenantVsMartyrPairBank: NemesisPairBank = {
  pairId: "revenant_vs_martyr", playerArchetype: "revenant", nemesisArchetype: "martyr",
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
