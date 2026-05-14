/* ═══════════════════════════════════════════════════════
   SENTINEL-PLAYER vs. PRODIGAL-NEMESIS — Phase K Wave 7D (canon)
   Post vs return. Sentinel holds the cohort gate; Prodigal
   returns through it. Surfaces: cohort gate, Hub
   migration-vote, Memorial Wall, Adjudicator's borders
   office, Convergence Seat.
   ═══════════════════════════════════════════════════════ */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

const FS_L: DialogTree = { id: "sentinel_vs_prodigal.first_sighting.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.low.opening", onscreenText: "The cohort gate. You are on watch. The Prodigal-Nemesis approaches the gate carrying an old household-key that should not exist anymore. \"I have come back. The Politician's primer: 'the Prodigal who returns through the Sentinel's post is the Prodigal whose claim the post must adjudicate.' Adjudicate.\"", choices: [
    { label: "Open the gate. Let them in.", nextId: "open", sets: "mercy_at_grudge_low_first_sighting" },
    { label: "Close the gate. The household has moved on.", nextId: "close", sets: "aggression_at_grudge_low_first_sighting" }] },
  open: { id: "open", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.low.open", onscreenText: "\"Opened. The household keeps watch on the returnee. The chronicle records the opening.\"", choices: [{ label: "Stay on watch as they enter.", nextId: "open_watch" }] },
  open_watch: { id: "open_watch", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.low.open_watch", onscreenText: "\"You watched. The chronicle records the discipline of the watching.\"" },
  close: { id: "close", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.low.close", onscreenText: "\"Closed. The Politician's primer: 'the closed gate is the gate that becomes the Prodigal's next campaign.' I will campaign for the key.\"" } } };

const FS_M: DialogTree = { id: "sentinel_vs_prodigal.first_sighting.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.mid.opening", onscreenText: "\"Three returns. Three different keys. The household lock has been changed twice. The Politician's primer: 'the lock that changes for the returnee is the lock that admits the Sentinel was always negotiating.' I have been negotiating with you for three cohorts.\"", choices: [
    { label: "Acknowledge the negotiation.", nextId: "ack", sets: "mercy_at_grudge_mid_first_sighting" },
    { label: "Refuse. Locks don't negotiate.", nextId: "refuse", sets: "aggression_at_grudge_mid_first_sighting" }] },
  ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.mid.ack", onscreenText: "\"Acknowledged. The Adjudicator's borders office filed our exchange under 'longest negotiated entry in the regime.'\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.mid.refuse", onscreenText: "\"Refused. The Adjudicator's clerks filed your refusal alongside my next key application. The chronicle is patient.\"" } } };

const FS_H: DialogTree = { id: "sentinel_vs_prodigal.first_sighting.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.high.opening", onscreenText: "\"I have stopped trying to enter. I have set up a cot outside the gate. The Politician's primer: 'the Prodigal who camps at the gate is the Prodigal who has become the Sentinel's first apprentice in patience.' Teach me the post. I will hold it with you.\"", choices: [
    { label: "Take them on as co-watch.", nextId: "co_watch", sets: "mercy_at_grudge_high_first_sighting" },
    { label: "Refuse. The post is yours alone.", nextId: "refuse_post", sets: "aggression_at_grudge_high_first_sighting" }] },
  co_watch: { id: "co_watch", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.high.co_watch", onscreenText: "\"You took me on. The cohort gate has two sentinels now. The chronicle records the doubling as 'the regime's most expensive post.'\"", choices: [{ label: "Stand the first joint watch.", nextId: "cw_stand" }] },
  cw_stand: { id: "cw_stand", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.high.cw_stand", onscreenText: "\"Stood. Through the night. The Antiquarian witnessed.\"" },
  refuse_post: { id: "refuse_post", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.first_sighting.high.refuse_post", onscreenText: "\"Refused. I will keep camping. The cot will outlast the post.\"" } } };

const SC_L: DialogTree = { id: "sentinel_vs_prodigal.sabotage_caught_in_act.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.sabotage_caught_in_act.low.opening", onscreenText: "Trade waystation. The Prodigal-Nemesis has slipped past the customs Sentinel and is renegotiating a route fee with the caravan-master. \"You caught me. I was renegotiating my old route. The Politician's primer: 'the renegotiation conducted past the Sentinel is the renegotiation the Sentinel will have to ratify.' Ratify.\"", choices: [
    { label: "Ratify the renegotiation.", nextId: "ratify", sets: "mercy_at_grudge_low_sabotage_caught_in_act" },
    { label: "Cancel it and re-detain them at the gate.", nextId: "cancel", sets: "aggression_at_grudge_low_sabotage_caught_in_act" }] },
  ratify: { id: "ratify", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.sabotage_caught_in_act.low.ratify", onscreenText: "\"Ratified. The caravan-master signed. The chronicle records the ratification.\"" },
  cancel: { id: "cancel", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.sabotage_caught_in_act.low.cancel", onscreenText: "\"Canceled. I am back at the gate. The cot is still there.\"" } } };

const SC_M: DialogTree = { id: "sentinel_vs_prodigal.sabotage_caught_in_act.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.sabotage_caught_in_act.mid.opening", onscreenText: "\"Same waystation. I have been smuggling — small things, mostly memorial tokens for the keepers at the Wall. The Politician's primer: 'the Prodigal who smuggles memorials is the Prodigal the Sentinel cannot fully arrest.'\"", choices: [
    { label: "Let the memorials through.", nextId: "let_through", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" },
    { label: "Confiscate them.", nextId: "confiscate", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" }] },
  let_through: { id: "let_through", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.sabotage_caught_in_act.mid.let_through", onscreenText: "\"Let through. The Memorial keepers thanked the Sentinel's discretion. The chronicle records the thanks.\"" },
  confiscate: { id: "confiscate", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.sabotage_caught_in_act.mid.confiscate", onscreenText: "\"Confiscated. The memorials sit in the Adjudicator's evidence room. The Memorial keepers grieved publicly.\"" } } };

const SC_H: DialogTree = { id: "sentinel_vs_prodigal.sabotage_caught_in_act.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.sabotage_caught_in_act.high.opening", onscreenText: "\"I am no longer smuggling. I am sitting at the gate with empty hands. The Politician's primer: 'the empty-handed Prodigal is the Prodigal the chronicle treats as a witness, not a criminal.' Witness me.\"", choices: [
    { label: "Witness them. Sign their entry as honest.", nextId: "witness", sets: "mercy_at_grudge_high_sabotage_caught_in_act" },
    { label: "Refuse witness.", nextId: "refuse_witness", sets: "aggression_at_grudge_high_sabotage_caught_in_act" }] },
  witness: { id: "witness", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.sabotage_caught_in_act.high.witness", onscreenText: "\"Witnessed. The Adjudicator's clerks accepted the signature. The chronicle records 'the cleanest entry document in three regimes.'\"", choices: [{ label: "Open the gate.", nextId: "w_open" }] },
  w_open: { id: "w_open", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.sabotage_caught_in_act.high.w_open", onscreenText: "\"Opened. The household kept its watch but admitted the witness.\"" },
  refuse_witness: { id: "refuse_witness", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.sabotage_caught_in_act.high.refuse_witness", onscreenText: "\"Refused. The Prodigal stays outside the gate. The chronicle records 'the longest refused witness in the regime.'\"" } } };

const MI_L: DialogTree = { id: "sentinel_vs_prodigal.mocking_interlude.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.mocking_interlude.low.opening", onscreenText: "Hub migration-vote. The Prodigal-Nemesis testifies before the chamber, asking for relief on returnee-petitions. \"You are the watch's witness here. The Politician's primer: 'the Sentinel who testifies on returnee petitions is the Sentinel who is choosing the regime's posture.'\"", choices: [
    { label: "Support a moderate relief.", nextId: "support_mod", sets: "mercy_at_grudge_low_mocking_interlude" },
    { label: "Oppose all relief.", nextId: "oppose", sets: "aggression_at_grudge_low_mocking_interlude" }] },
  support_mod: { id: "support_mod", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.mocking_interlude.low.support_mod", onscreenText: "\"Supported. The vote passed by margin. The Politician's primer respected margins.\"" },
  oppose: { id: "oppose", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.mocking_interlude.low.oppose", onscreenText: "\"Opposed. The petition failed. The chronicle records 'the watch's strictest verdict in the regime.'\"" } } };

const MI_M: DialogTree = { id: "sentinel_vs_prodigal.mocking_interlude.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.mocking_interlude.mid.opening", onscreenText: "\"You have testified at three migration votes. The chamber lists us as 'the regime's longest border argument.' The Politician's primer: 'the longest argument is the chronicle's most patient law.'\"", choices: [
    { label: "Co-draft a returnee statute with them.", nextId: "codraft", sets: "mercy_at_grudge_mid_mocking_interlude" },
    { label: "Refuse co-drafting.", nextId: "refuse_codraft", sets: "aggression_at_grudge_mid_mocking_interlude" }] },
  codraft: { id: "codraft", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.mocking_interlude.mid.codraft", onscreenText: "\"Co-drafted. The statute passed by acclamation. The chronicle records 'the first joint statute in the regime.'\"" },
  refuse_codraft: { id: "refuse_codraft", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.mocking_interlude.mid.refuse_codraft", onscreenText: "\"Refused. The statute drafted unilaterally; the vote was close.\"" } } };

const MI_H: DialogTree = { id: "sentinel_vs_prodigal.mocking_interlude.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.mocking_interlude.high.opening", onscreenText: "\"I have stopped petitioning. I am here to ask whether you will let me stay outside the gate, indefinitely, as a witness rather than a returnee. The Politician's primer: 'the indefinite witness is the chronicle's most expensive border policy.'\"", choices: [
    { label: "Grant indefinite witness status.", nextId: "grant", sets: "mercy_at_grudge_high_mocking_interlude" },
    { label: "Refuse. Status must be regularized.", nextId: "refuse_grant", sets: "aggression_at_grudge_high_mocking_interlude" }] },
  grant: { id: "grant", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.mocking_interlude.high.grant", onscreenText: "\"Granted. I will witness for the rest of my career. The chronicle records 'the only indefinite witness in the regime.'\"", choices: [{ label: "Sign the witness statute.", nextId: "g_sign" }] },
  g_sign: { id: "g_sign", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.mocking_interlude.high.g_sign", onscreenText: "\"Signed. Permanent.\"" },
  refuse_grant: { id: "refuse_grant", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.mocking_interlude.high.refuse_grant", onscreenText: "\"Refused. I will keep the cot. The Adjudicator's clerks file the cot as 'irregular dwelling.'\"" } } };

const LP_L: DialogTree = { id: "sentinel_vs_prodigal.lieutenant_promotion.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.lieutenant_promotion.low.opening", onscreenText: "Adjudicator's borders office. The Prodigal-Nemesis is being elevated to Returnee-Coordinator. \"They are giving me a cell. The Politician's primer: 'the Returnee-Coordinator who has been refused entry is the Coordinator the chronicle distrusts.'\"", choices: [
    { label: "Bless from the watch.", nextId: "bless", sets: "mercy_at_grudge_low_lieutenant_promotion" },
    { label: "File a Sentinel-house objection.", nextId: "object", sets: "aggression_at_grudge_low_lieutenant_promotion" }] },
  bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.lieutenant_promotion.low.bless", onscreenText: "\"Blessed. The Adjudicator's clerks framed your endorsement.\"" },
  object: { id: "object", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.lieutenant_promotion.low.object", onscreenText: "\"Denied. The objection is recorded.\"" } } };

const LP_M: DialogTree = { id: "sentinel_vs_prodigal.lieutenant_promotion.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.lieutenant_promotion.mid.opening", onscreenText: "\"Returnee-Coordinator. My cell of four handles entries. We process by Sentinel-house procedure now. The Politician's primer: 'the returnee processed by Sentinel procedure is the returnee the chronicle treats as native.'\"", choices: [
    { label: "Train the cell in watch-discipline.", nextId: "train", sets: "mercy_at_grudge_mid_lieutenant_promotion" },
    { label: "Audit the cell.", nextId: "audit", sets: "aggression_at_grudge_mid_lieutenant_promotion" }] },
  train: { id: "train", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.lieutenant_promotion.mid.train", onscreenText: "\"Trained. The cell stands watch with you on weekend rotations.\"" },
  audit: { id: "audit", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.lieutenant_promotion.mid.audit", onscreenText: "\"Audited. Lapses tightened. Thank you.\"" } } };

const LP_H: DialogTree = { id: "sentinel_vs_prodigal.lieutenant_promotion.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.lieutenant_promotion.high.opening", onscreenText: "\"The Adjudicator wants a new borders code, with you as the watch-side exemplar. Co-author.\"", choices: [
    { label: "Co-author.", nextId: "coauthor", sets: "mercy_at_grudge_high_lieutenant_promotion" },
    { label: "Refuse.", nextId: "refuse", sets: "aggression_at_grudge_high_lieutenant_promotion" }] },
  coauthor: { id: "coauthor", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.lieutenant_promotion.high.coauthor", onscreenText: "\"Signed in both inks. Canon image.\"", choices: [{ label: "Hand them the pen.", nextId: "ca_pen" }] },
  ca_pen: { id: "ca_pen", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.lieutenant_promotion.high.ca_pen", onscreenText: "\"Permanent.\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.lieutenant_promotion.high.refuse", onscreenText: "\"The chronicle finished in your absence.\"" } } };

const CE_L: DialogTree = { id: "sentinel_vs_prodigal.cohort_end_confrontation.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.cohort_end_confrontation.low.opening", onscreenText: "Cohort hall threshold. The Prodigal-Nemesis stands outside the gate as your apprentice graduates. \"Your apprentice walks out cleanly. I walked back in three times to reach this gate. The Politician's primer: 'the cleanly graduated apprentice is the apprentice the Prodigal will never need to advise.'\"", choices: [
    { label: "Acknowledge the difference.", nextId: "ack", sets: "mercy_at_grudge_low_cohort_end_confrontation" },
    { label: "Bar the Prodigal from witnessing.", nextId: "bar", sets: "aggression_at_grudge_low_cohort_end_confrontation" }] },
  ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.cohort_end_confrontation.low.ack", onscreenText: "\"Acknowledged. The Adjudicator's clerks filed the acknowledgment alongside the graduation.\"" },
  bar: { id: "bar", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.cohort_end_confrontation.low.bar", onscreenText: "\"Barred. I watched from the next street. The chronicle records the watching.\"" } } };

const CE_M: DialogTree = { id: "sentinel_vs_prodigal.cohort_end_confrontation.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.cohort_end_confrontation.mid.opening", onscreenText: "\"The cohort closes. The Adjudicator's borders office lists us as 'watch-and-returnee, paired.' We are a paired entry.\"", choices: [
    { label: "Acknowledge the pairing.", nextId: "ack", sets: "mercy_at_grudge_mid_cohort_end_confrontation" },
    { label: "Petition to separate.", nextId: "petition", sets: "aggression_at_grudge_mid_cohort_end_confrontation" }] },
  ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.cohort_end_confrontation.mid.ack", onscreenText: "\"Acknowledged. Permanent.\"" },
  petition: { id: "petition", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.cohort_end_confrontation.mid.petition", onscreenText: "\"Denied. Footnoted.\"" } } };

const CE_H: DialogTree = { id: "sentinel_vs_prodigal.cohort_end_confrontation.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.cohort_end_confrontation.high.opening", onscreenText: "\"Your apprentice closed the cohort by offering me a key to the new household. I refused — the cot has become a tradition. The Politician's primer: 'the refused key is the chronicle's most disciplined gratitude.'\"", choices: [
    { label: "Accept the refusal.", nextId: "accept", sets: "mercy_at_grudge_high_cohort_end_confrontation" },
    { label: "Demand the Prodigal take the key.", nextId: "demand", sets: "aggression_at_grudge_high_cohort_end_confrontation" }] },
  accept: { id: "accept", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.cohort_end_confrontation.high.accept", onscreenText: "\"Accepted. The cot stays. The chronicle records 'the regime's most patient hospitality.'\"" },
  demand: { id: "demand", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.cohort_end_confrontation.high.demand", onscreenText: "\"Demanded. I took the key. The chronicle records 'the first Prodigal to enter under demand.'\"" } } };

const AR_L: DialogTree = { id: "sentinel_vs_prodigal.accumulation_reveal.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.accumulation_reveal.low.opening", onscreenText: "Matrix-archive intake. A new sibling-release arrives — also a returnee-archetype. The Prodigal-Nemesis greets them at the borders office.\"", choices: [
    { label: "Welcome the new sibling at the gate.", nextId: "welcome", sets: "mercy_at_grudge_low_accumulation_reveal" },
    { label: "Demand they apply formally.", nextId: "demand_formal", sets: "aggression_at_grudge_low_accumulation_reveal" }] },
  welcome: { id: "welcome", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.accumulation_reveal.low.welcome", onscreenText: "\"Welcomed. The cot has room.\"" },
  demand_formal: { id: "demand_formal", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.accumulation_reveal.low.demand_formal", onscreenText: "\"Demanded. They applied. The Adjudicator's clerks processed within the day.\"" } } };

const AR_M: DialogTree = { id: "sentinel_vs_prodigal.accumulation_reveal.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.accumulation_reveal.mid.opening", onscreenText: "\"Four releases, three of them returnees. The gate has four cots outside. The Adjudicator's borders office calls it 'the regime's most patient hostel.'\"", choices: [
    { label: "Bless the cohort.", nextId: "bless", sets: "mercy_at_grudge_mid_accumulation_reveal" },
    { label: "Order the cots cleared.", nextId: "clear", sets: "aggression_at_grudge_mid_accumulation_reveal" }] },
  bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.accumulation_reveal.mid.bless", onscreenText: "\"Blessed. The hostel grew to six cots by morning.\"" },
  clear: { id: "clear", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.accumulation_reveal.mid.clear", onscreenText: "\"Cleared. The cohort scattered. The Adjudicator's clerks logged the relocation.\"" } } };

const AR_H: DialogTree = { id: "sentinel_vs_prodigal.accumulation_reveal.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.accumulation_reveal.high.opening", onscreenText: "\"We are five at the gate. The chorus has chosen the cot over the household. The Politician's primer: 'the chorus that chose the cot is the chorus the regime will name as the next migration policy.'\"", choices: [
    { label: "Honor the chorus.", nextId: "honor", sets: "mercy_at_grudge_high_accumulation_reveal" },
    { label: "Recruit one into the watch.", nextId: "recruit", sets: "aggression_at_grudge_high_accumulation_reveal" }] },
  honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.accumulation_reveal.high.honor", onscreenText: "\"Honored. The chorus stays. The Adjudicator drafts the new policy in their cadence.\"" },
  recruit: { id: "recruit", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.accumulation_reveal.high.recruit", onscreenText: "\"Recruited. The chorus is four; the watch is two.\"" } } };

const NR_L: DialogTree = { id: "sentinel_vs_prodigal.name_reveal_moment.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.name_reveal_moment.low.opening", onscreenText: "Antiquarian's Journal margin. Prodigal-Nemesis's name surfaces. \"You have my name. The household's old register has it. Use it.\"", choices: [
    { label: "Say it softly.", nextId: "say", sets: "mercy_at_grudge_low_name_reveal_moment" },
    { label: "File it with the Adjudicator's borders office.", nextId: "file", sets: "aggression_at_grudge_low_name_reveal_moment" }] },
  say: { id: "say", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.name_reveal_moment.low.say", onscreenText: "\"Said. The chronicle records the smallest font.\"" },
  file: { id: "file", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.name_reveal_moment.low.file", onscreenText: "\"Filed. The clerks updated the regional registry.\"" } } };

const NR_M: DialogTree = { id: "sentinel_vs_prodigal.name_reveal_moment.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.name_reveal_moment.mid.opening", onscreenText: "\"My name is now in two registries — the household's and the borders office's. The Politician's primer: 'the dual-registered name is the name the chronicle treats as truly returned.'\"", choices: [
    { label: "Honor with citation in the watch report.", nextId: "honor", sets: "mercy_at_grudge_mid_name_reveal_moment" },
    { label: "Strike the household registration.", nextId: "strike", sets: "aggression_at_grudge_mid_name_reveal_moment" }] },
  honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.name_reveal_moment.mid.honor", onscreenText: "\"Honored. The watch report's citation is permanent.\"" },
  strike: { id: "strike", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.name_reveal_moment.mid.strike", onscreenText: "\"Struck. The Adjudicator's clerks denied the strike. The chronicle records the denial.\"" } } };

const NR_H: DialogTree = { id: "sentinel_vs_prodigal.name_reveal_moment.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.name_reveal_moment.high.opening", onscreenText: "\"Use my name. The household carved it on the inner door three regimes ago. I never saw the carving. Speak it as you choose.\"", choices: [
    { label: "Speak as homecoming.", nextId: "home", sets: "mercy_at_grudge_high_name_reveal_moment" },
    { label: "Speak as warning.", nextId: "warn", sets: "aggression_at_grudge_high_name_reveal_moment" }] },
  home: { id: "home", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.name_reveal_moment.high.home", onscreenText: "\"Spoken as homecoming. The cot can come inside tonight, if you allow.\"" },
  warn: { id: "warn", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.name_reveal_moment.high.warn", onscreenText: "\"Spoken as warning. The watch tightened. I stayed on the cot.\"" } } };

const FE_L: DialogTree = { id: "sentinel_vs_prodigal.final_encounter.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.final_encounter.low.opening", onscreenText: "Convergence Seat throne room. Prodigal-Nemesis at the gate of the empty Seat, holding a final key. \"Act Seven. The Seat has fallen. The household has dissolved. This is the last key. Take it or leave it.\"", choices: [
    { label: "Take it.", nextId: "take", sets: "mercy_at_grudge_low_final_encounter" },
    { label: "Leave it.", nextId: "leave", sets: "aggression_at_grudge_low_final_encounter" }] },
  take: { id: "take", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.final_encounter.low.take", onscreenText: "\"Taken. The Seat's gate is yours to close, when ready.\"" },
  leave: { id: "leave", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.final_encounter.low.leave", onscreenText: "\"Left. The key sits on the empty throne. The next regime will read the gesture.\"" } } };

const FE_M: DialogTree = { id: "sentinel_vs_prodigal.final_encounter.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.final_encounter.mid.opening", onscreenText: "\"End of the arc. The borders office is dissolving. The cot is folded.\"", choices: [
    { label: "Sign a joint closure.", nextId: "sign", sets: "mercy_at_grudge_mid_final_encounter" },
    { label: "Let the chronicle close it.", nextId: "let_close", sets: "aggression_at_grudge_mid_final_encounter" }] },
  sign: { id: "sign", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.final_encounter.mid.sign", onscreenText: "\"Signed together. The Antiquarian filed it.\"" },
  let_close: { id: "let_close", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.final_encounter.mid.let_close", onscreenText: "\"The chronicle closed. The most disciplined exit.\"" } } };

const FE_H: DialogTree = { id: "sentinel_vs_prodigal.final_encounter.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.final_encounter.high.opening", onscreenText: "\"The chronicle is folding shut. Seven cohorts of you holding the gate; seven cohorts of me returning. We were the same household, watched from the same threshold. Stand with me, one more time.\"", choices: [
    { label: "Stand together at the Seat's foot.", nextId: "stand", sets: "mercy_at_grudge_high_final_encounter" },
    { label: "Refuse. Hold the gate alone.", nextId: "refuse", sets: "aggression_at_grudge_high_final_encounter" }] },
  stand: { id: "stand", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.final_encounter.high.stand", onscreenText: "\"We stood. To the end. The chronicle records 'the only watch held by both sides of a gate.'\"", choices: [{ label: "Hold the watch to the end.", nextId: "hold" }] },
  hold: { id: "hold", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.final_encounter.high.hold", onscreenText: "\"Held. The chronicle closes.\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.sentinel_vs_prodigal.final_encounter.high.refuse", onscreenText: "\"Refused. The cot stayed outside. The chronicle records the last patience.\"" } } };

export const sentinelVsProdigalPairBank: NemesisPairBank = {
  pairId: "sentinel_vs_prodigal", playerArchetype: "sentinel", nemesisArchetype: "prodigal",
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
