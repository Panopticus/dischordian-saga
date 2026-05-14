/* PRODIGAL-PLAYER vs. SENTINEL-NEMESIS — Phase K Wave 7D (canon, reverse)
   You return through the gate; Sentinel-Nemesis holds the post.
   Surfaces: cohort gate, Hub migration-vote, Adjudicator's borders, Convergence Seat. */
import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

const FS_L: DialogTree = { id: "prodigal_vs_sentinel.first_sighting.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.low.opening", onscreenText: "Cohort gate. You arrive carrying an old household key. The Sentinel-Nemesis on watch raises a hand. \"The household has changed its lock. The Politician's primer: 'the obsolete key is the chronicle's most forgivable error.' Apply at the borders office.\"", choices: [
    { label: "Apply at the borders office.", nextId: "apply", sets: "mercy_at_grudge_low_first_sighting" },
    { label: "Force the gate.", nextId: "force", sets: "aggression_at_grudge_low_first_sighting" }] },
  apply: { id: "apply", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.low.apply", onscreenText: "\"Applied. Granted within the week. The chronicle records the entry.\"", choices: [{ label: "Wait at the cot outside.", nextId: "apply_wait" }] },
  apply_wait: { id: "apply_wait", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.low.apply_wait", onscreenText: "\"You waited. The watch noted the patience.\"" },
  force: { id: "force", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.low.force", onscreenText: "\"Forced. The watch sounded the alarm. The chronicle records the breach.\"" } } };

const FS_M: DialogTree = { id: "prodigal_vs_sentinel.first_sighting.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.mid.opening", onscreenText: "\"Three applications. Three keys. The watch has memorized your gait. The Politician's primer: 'the recognized returnee is the returnee the post has accepted as neighbor.'\"", choices: [
    { label: "Accept the neighborly status.", nextId: "neighbor", sets: "mercy_at_grudge_mid_first_sighting" },
    { label: "Demand full household reinstatement.", nextId: "demand", sets: "aggression_at_grudge_mid_first_sighting" }] },
  neighbor: { id: "neighbor", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.mid.neighbor", onscreenText: "\"Accepted. The Adjudicator filed.\"" },
  demand: { id: "demand", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.mid.demand", onscreenText: "\"Denied. The watch held the line. The chronicle records the holding.\"" } } };

const FS_H: DialogTree = { id: "prodigal_vs_sentinel.first_sighting.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.high.opening", onscreenText: "\"I have stood this post seven cohorts. You have returned through it seven times. The Politician's primer: 'the seventh return is the return the watch teaches.' Teach me how you keep coming back.\"", choices: [
    { label: "Teach them the discipline of return.", nextId: "teach", sets: "mercy_at_grudge_high_first_sighting" },
    { label: "Refuse. The return is yours alone.", nextId: "refuse", sets: "aggression_at_grudge_high_first_sighting" }] },
  teach: { id: "teach", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.high.teach", onscreenText: "\"Taught. The Sentinel walked the cot path with you. The Antiquarian recorded the lesson.\"", choices: [{ label: "Hand them the spare key.", nextId: "teach_key" }] },
  teach_key: { id: "teach_key", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.high.teach_key", onscreenText: "\"Handed. The post has the spare. The chronicle marks it.\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.first_sighting.high.refuse", onscreenText: "\"Refused. The post will keep its own discipline. The chronicle records.\"" } } };

const SC_L: DialogTree = { id: "prodigal_vs_sentinel.sabotage_caught_in_act.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.sabotage_caught_in_act.low.opening", onscreenText: "Trade waystation. You smuggle memorial-tokens past the watch. The Sentinel-Nemesis at the customs desk lifts the lid of your pack. \"Memorial-tokens. The Wall's keepers requested them. The Politician's primer: 'the smuggled memorial is the procedural exception.' Pass the tokens, file the form.\"", choices: [
    { label: "File the form.", nextId: "file", sets: "mercy_at_grudge_low_sabotage_caught_in_act" },
    { label: "Refuse to file. The tokens are private.", nextId: "refuse_file", sets: "aggression_at_grudge_low_sabotage_caught_in_act" }] },
  file: { id: "file", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.sabotage_caught_in_act.low.file", onscreenText: "\"Filed. The tokens went to the Wall.\"" },
  refuse_file: { id: "refuse_file", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.sabotage_caught_in_act.low.refuse_file", onscreenText: "\"Refused. The tokens went into evidence. The Wall keepers grieved.\"" } } };

const SC_M: DialogTree = { id: "prodigal_vs_sentinel.sabotage_caught_in_act.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.sabotage_caught_in_act.mid.opening", onscreenText: "\"You have smuggled enough that the watch has invented a special form for you. The Politician's primer: 'the bespoke form is the chronicle's slowest amnesty.'\"", choices: [
    { label: "Use the form.", nextId: "use", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" },
    { label: "Burn the form.", nextId: "burn", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" }] },
  use: { id: "use", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.sabotage_caught_in_act.mid.use", onscreenText: "\"Used. The Adjudicator's clerks filed.\"" },
  burn: { id: "burn", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.sabotage_caught_in_act.mid.burn", onscreenText: "\"Burned. The watch redrafted the form. The chronicle records the cycle.\"" } } };

const SC_H: DialogTree = { id: "prodigal_vs_sentinel.sabotage_caught_in_act.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.sabotage_caught_in_act.high.opening", onscreenText: "\"I have stopped enforcing customs. The Politician's primer: 'the watch that stops enforcing is the watch that has chosen what the chronicle remembers.' Pass freely, this once.\"", choices: [
    { label: "Pass freely.", nextId: "pass", sets: "mercy_at_grudge_high_sabotage_caught_in_act" },
    { label: "Insist on the form anyway.", nextId: "form", sets: "aggression_at_grudge_high_sabotage_caught_in_act" }] },
  pass: { id: "pass", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.sabotage_caught_in_act.high.pass", onscreenText: "\"Passed. The watch closed the desk for the night.\"", choices: [{ label: "Thank the watch.", nextId: "pass_thank" }] },
  pass_thank: { id: "pass_thank", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.sabotage_caught_in_act.high.pass_thank", onscreenText: "\"Thanked.\"" },
  form: { id: "form", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.sabotage_caught_in_act.high.form", onscreenText: "\"Insisted. The form filed in three copies. The chronicle records the discipline.\"" } } };

const MI_L: DialogTree = { id: "prodigal_vs_sentinel.mocking_interlude.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.mocking_interlude.low.opening", onscreenText: "Hub migration-vote chamber. You testify for relief on returnee petitions. Sentinel-Nemesis rises to rebut. \"Witness exchanged. The chronicle records both halves.\"", choices: [
    { label: "Yield the floor.", nextId: "yield", sets: "mercy_at_grudge_low_mocking_interlude" },
    { label: "Hold the floor.", nextId: "hold", sets: "aggression_at_grudge_low_mocking_interlude" }] },
  yield: { id: "yield", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.mocking_interlude.low.yield", onscreenText: "\"Yielded. The vote passed by margin.\"" },
  hold: { id: "hold", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.mocking_interlude.low.hold", onscreenText: "\"Held. The chamber recessed without verdict.\"" } } };

const MI_M: DialogTree = { id: "prodigal_vs_sentinel.mocking_interlude.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.mocking_interlude.mid.opening", onscreenText: "\"Three migration votes. We are the regime's longest border argument.\"", choices: [
    { label: "Co-draft a returnee statute.", nextId: "co", sets: "mercy_at_grudge_mid_mocking_interlude" },
    { label: "Refuse co-drafting.", nextId: "refuse", sets: "aggression_at_grudge_mid_mocking_interlude" }] },
  co: { id: "co", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.mocking_interlude.mid.co", onscreenText: "\"Co-drafted. Passed by acclamation.\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.mocking_interlude.mid.refuse", onscreenText: "\"Refused. The unilateral draft passed narrowly.\"" } } };

const MI_H: DialogTree = { id: "prodigal_vs_sentinel.mocking_interlude.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.mocking_interlude.high.opening", onscreenText: "\"I am stepping down from the watch. The Adjudicator has offered me a Memorial-keeper position. I want your blessing.\"", choices: [
    { label: "Bless the transition.", nextId: "bless", sets: "mercy_at_grudge_high_mocking_interlude" },
    { label: "Refuse. They are the watch.", nextId: "refuse", sets: "aggression_at_grudge_high_mocking_interlude" }] },
  bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.mocking_interlude.high.bless", onscreenText: "\"Blessed. The Memorial keepers welcomed me.\"", choices: [{ label: "Walk them to the Memorial.", nextId: "bless_walk" }] },
  bless_walk: { id: "bless_walk", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.mocking_interlude.high.bless_walk", onscreenText: "\"Walked. The chronicle records.\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.mocking_interlude.high.refuse", onscreenText: "\"Refused. I stayed at the post.\"" } } };

const LP_L: DialogTree = { id: "prodigal_vs_sentinel.lieutenant_promotion.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.lieutenant_promotion.low.opening", onscreenText: "Adjudicator's watch-coordinator ceremony. Sentinel-Nemesis elevated to Watch-Coordinator.\"", choices: [
    { label: "Bless from the gate.", nextId: "bless", sets: "mercy_at_grudge_low_lieutenant_promotion" },
    { label: "File a Prodigal objection.", nextId: "object", sets: "aggression_at_grudge_low_lieutenant_promotion" }] },
  bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.lieutenant_promotion.low.bless", onscreenText: "\"Blessed.\"" },
  object: { id: "object", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.lieutenant_promotion.low.object", onscreenText: "\"Denied.\"" } } };

const LP_M: DialogTree = { id: "prodigal_vs_sentinel.lieutenant_promotion.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.lieutenant_promotion.mid.opening", onscreenText: "\"Watch-Coordinator. My cell of four maintains gates across the regime.\"", choices: [
    { label: "Honor with a returnee festival.", nextId: "fest", sets: "mercy_at_grudge_mid_lieutenant_promotion" },
    { label: "Audit the cell.", nextId: "audit", sets: "aggression_at_grudge_mid_lieutenant_promotion" }] },
  fest: { id: "fest", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.lieutenant_promotion.mid.fest", onscreenText: "\"Festival held. The cot moved indoors for the night.\"" },
  audit: { id: "audit", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.lieutenant_promotion.mid.audit", onscreenText: "\"Audited. Cell tightened.\"" } } };

const LP_H: DialogTree = { id: "prodigal_vs_sentinel.lieutenant_promotion.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.lieutenant_promotion.high.opening", onscreenText: "\"The Adjudicator wants a new borders code. Co-author with the returnee column.\"", choices: [
    { label: "Co-author.", nextId: "co", sets: "mercy_at_grudge_high_lieutenant_promotion" },
    { label: "Refuse.", nextId: "refuse", sets: "aggression_at_grudge_high_lieutenant_promotion" }] },
  co: { id: "co", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.lieutenant_promotion.high.co", onscreenText: "\"Signed in both inks.\"", choices: [{ label: "Hand them the pen.", nextId: "pen" }] },
  pen: { id: "pen", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.lieutenant_promotion.high.pen", onscreenText: "\"Permanent.\"" },
  refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.lieutenant_promotion.high.refuse", onscreenText: "\"Refused. The chronicle finished in your absence.\"" } } };

const CE_L: DialogTree = { id: "prodigal_vs_sentinel.cohort_end_confrontation.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.cohort_end_confrontation.low.opening", onscreenText: "Cohort hall. Sentinel-Nemesis watches as your apprentice graduates from inside the gate. \"Your apprentice graduated without ever leaving. The Politician's primer: 'the apprentice who stayed is the apprentice who outlasted the Prodigal's discipline.'\"", choices: [
    { label: "Acknowledge.", nextId: "ack", sets: "mercy_at_grudge_low_cohort_end_confrontation" },
    { label: "Insist your apprentice should also return-and-leave.", nextId: "insist", sets: "aggression_at_grudge_low_cohort_end_confrontation" }] },
  ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.cohort_end_confrontation.low.ack", onscreenText: "\"Acknowledged. The Sentinel filed the acknowledgment.\"" },
  insist: { id: "insist", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.cohort_end_confrontation.low.insist", onscreenText: "\"Insistence noted. The apprentice may decide separately. The chronicle held the petition.\"" } } };

const CE_M: DialogTree = { id: "prodigal_vs_sentinel.cohort_end_confrontation.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.cohort_end_confrontation.mid.opening", onscreenText: "\"The Adjudicator's office files us as 'returnee/watch, paired.' We are paired.\"", choices: [
    { label: "Acknowledge.", nextId: "ack", sets: "mercy_at_grudge_mid_cohort_end_confrontation" },
    { label: "Petition for separate listing.", nextId: "pet", sets: "aggression_at_grudge_mid_cohort_end_confrontation" }] },
  ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.cohort_end_confrontation.mid.ack", onscreenText: "\"Acknowledged.\"" },
  pet: { id: "pet", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.cohort_end_confrontation.mid.pet", onscreenText: "\"Denied. Footnoted.\"" } } };

const CE_H: DialogTree = { id: "prodigal_vs_sentinel.cohort_end_confrontation.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.cohort_end_confrontation.high.opening", onscreenText: "\"Your apprentice closed the cohort by inviting me through the gate as a guest. I declined. The Politician's primer: 'the declined invitation is the chronicle's most disciplined gratitude.'\"", choices: [
    { label: "Accept the decline.", nextId: "accept", sets: "mercy_at_grudge_high_cohort_end_confrontation" },
    { label: "Demand they come through.", nextId: "demand", sets: "aggression_at_grudge_high_cohort_end_confrontation" }] },
  accept: { id: "accept", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.cohort_end_confrontation.high.accept", onscreenText: "\"Accepted. The Sentinel stayed at post.\"" },
  demand: { id: "demand", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.cohort_end_confrontation.high.demand", onscreenText: "\"Demanded. The Sentinel walked through for one cup of water and returned to post.\"" } } };

const AR_L: DialogTree = { id: "prodigal_vs_sentinel.accumulation_reveal.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.accumulation_reveal.low.opening", onscreenText: "Matrix-archive intake. A new sibling-release also returnee-archetype. The Sentinel files them at the borders office.\"", choices: [
    { label: "Welcome them.", nextId: "welcome", sets: "mercy_at_grudge_low_accumulation_reveal" },
    { label: "Demand formal application.", nextId: "demand", sets: "aggression_at_grudge_low_accumulation_reveal" }] },
  welcome: { id: "welcome", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.accumulation_reveal.low.welcome", onscreenText: "\"Welcomed.\"" },
  demand: { id: "demand", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.accumulation_reveal.low.demand", onscreenText: "\"Processed within the day.\"" } } };

const AR_M: DialogTree = { id: "prodigal_vs_sentinel.accumulation_reveal.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.accumulation_reveal.mid.opening", onscreenText: "\"Four releases. Three returnees. The gate now has cots and a roster.\"", choices: [
    { label: "Bless.", nextId: "bless", sets: "mercy_at_grudge_mid_accumulation_reveal" },
    { label: "Clear the cots.", nextId: "clear", sets: "aggression_at_grudge_mid_accumulation_reveal" }] },
  bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.accumulation_reveal.mid.bless", onscreenText: "\"Blessed.\"" },
  clear: { id: "clear", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.accumulation_reveal.mid.clear", onscreenText: "\"Cleared.\"" } } };

const AR_H: DialogTree = { id: "prodigal_vs_sentinel.accumulation_reveal.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.accumulation_reveal.high.opening", onscreenText: "\"Five at the gate. The chorus has chosen the cot. The Politician's primer: 'the chorus on the cot is the regime's next migration policy.'\"", choices: [
    { label: "Honor.", nextId: "honor", sets: "mercy_at_grudge_high_accumulation_reveal" },
    { label: "Recruit one into the watch.", nextId: "recruit", sets: "aggression_at_grudge_high_accumulation_reveal" }] },
  honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.accumulation_reveal.high.honor", onscreenText: "\"Honored.\"" },
  recruit: { id: "recruit", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.accumulation_reveal.high.recruit", onscreenText: "\"Recruited. The chorus is four.\"" } } };

const NR_L: DialogTree = { id: "prodigal_vs_sentinel.name_reveal_moment.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.name_reveal_moment.low.opening", onscreenText: "Antiquarian's Journal margin. Sentinel-Nemesis's name surfaces. \"You have my name. The watch's roll has held it. Use it.\"", choices: [
    { label: "Say softly.", nextId: "say", sets: "mercy_at_grudge_low_name_reveal_moment" },
    { label: "File in the household register.", nextId: "file", sets: "aggression_at_grudge_low_name_reveal_moment" }] },
  say: { id: "say", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.name_reveal_moment.low.say", onscreenText: "\"Said softly.\"" },
  file: { id: "file", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.name_reveal_moment.low.file", onscreenText: "\"Filed.\"" } } };

const NR_M: DialogTree = { id: "prodigal_vs_sentinel.name_reveal_moment.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.name_reveal_moment.mid.opening", onscreenText: "\"You know my name. The Politician's primer: 'the named watch is the watch the returnee can finally greet by name.'\"", choices: [
    { label: "Greet them by name.", nextId: "greet", sets: "mercy_at_grudge_mid_name_reveal_moment" },
    { label: "Strike the name from your reentry papers.", nextId: "strike", sets: "aggression_at_grudge_mid_name_reveal_moment" }] },
  greet: { id: "greet", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.name_reveal_moment.mid.greet", onscreenText: "\"Greeted. The watch returned the greeting.\"" },
  strike: { id: "strike", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.name_reveal_moment.mid.strike", onscreenText: "\"Struck. The clerks denied.\"" } } };

const NR_H: DialogTree = { id: "prodigal_vs_sentinel.name_reveal_moment.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.name_reveal_moment.high.opening", onscreenText: "\"Use my name. The household carved it three regimes ago. Speak it as you choose.\"", choices: [
    { label: "Speak as homecoming.", nextId: "home", sets: "mercy_at_grudge_high_name_reveal_moment" },
    { label: "Speak as warning.", nextId: "warn", sets: "aggression_at_grudge_high_name_reveal_moment" }] },
  home: { id: "home", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.name_reveal_moment.high.home", onscreenText: "\"Spoken as homecoming. The gate opened for the night.\"" },
  warn: { id: "warn", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.name_reveal_moment.high.warn", onscreenText: "\"Spoken as warning. The watch tightened.\"" } } };

const FE_L: DialogTree = { id: "prodigal_vs_sentinel.final_encounter.low", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.final_encounter.low.opening", onscreenText: "Convergence Seat throne room. Sentinel-Nemesis at the empty Seat with the master key. \"Act Seven. The Seat has fallen. The household has dissolved. The master key is yours, or stays here.\"", choices: [
    { label: "Take it.", nextId: "take", sets: "mercy_at_grudge_low_final_encounter" },
    { label: "Leave it.", nextId: "leave", sets: "aggression_at_grudge_low_final_encounter" }] },
  take: { id: "take", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.final_encounter.low.take", onscreenText: "\"Taken.\"" },
  leave: { id: "leave", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.final_encounter.low.leave", onscreenText: "\"Left on the throne.\"" } } };

const FE_M: DialogTree = { id: "prodigal_vs_sentinel.final_encounter.mid", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.final_encounter.mid.opening", onscreenText: "\"End of the arc. The borders office is dissolving. The cot is folded.\"", choices: [
    { label: "Sign jointly.", nextId: "sign", sets: "mercy_at_grudge_mid_final_encounter" },
    { label: "Let the chronicle close.", nextId: "close", sets: "aggression_at_grudge_mid_final_encounter" }] },
  sign: { id: "sign", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.final_encounter.mid.sign", onscreenText: "\"Signed together.\"" },
  close: { id: "close", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.final_encounter.mid.close", onscreenText: "\"The chronicle closed.\"" } } };

const FE_H: DialogTree = { id: "prodigal_vs_sentinel.final_encounter.high", nodes: {
  root: { id: "root", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.final_encounter.high.opening", onscreenText: "\"The chronicle is folding shut. Seven cohorts of you holding the gate; seven cohorts of me returning. Stand the last watch with me.\"", choices: [
    { label: "Stand together.", nextId: "stand", sets: "mercy_at_grudge_high_final_encounter" },
    { label: "Walk past the gate alone.", nextId: "walk", sets: "aggression_at_grudge_high_final_encounter" }] },
  stand: { id: "stand", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.final_encounter.high.stand", onscreenText: "\"Stood. The chronicle records 'the only watch held by both sides.'\"", choices: [{ label: "Hold to the end.", nextId: "hold" }] },
  hold: { id: "hold", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.final_encounter.high.hold", onscreenText: "\"Held. The chronicle closes.\"" },
  walk: { id: "walk", speaker: "nemesis", voLineId: "nemesis.prodigal_vs_sentinel.final_encounter.high.walk", onscreenText: "\"You walked. The post emptied. The chronicle marks the last walk.\"" } } };

export const prodigalVsSentinelPairBank: NemesisPairBank = {
  pairId: "prodigal_vs_sentinel", playerArchetype: "prodigal", nemesisArchetype: "sentinel",
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
