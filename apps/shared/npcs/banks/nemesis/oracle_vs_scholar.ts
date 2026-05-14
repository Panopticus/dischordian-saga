/* ═══════════════════════════════════════════════════════
   ORACLE-PLAYER vs. SCHOLAR-NEMESIS — Phase K Wave 7B (canon, reverse)

   Reverse of scholar_vs_oracle. Oracle-player files
   sealed predictions with the Antiquarian, consults at
   the Matrix-archive edge, sits in the Dreamer's-
   Children temple. Scholar-Nemesis runs cross-archive
   audits against your predictions, files Hierarchy-side
   methodological objections, occupies the next desk in
   the Antiquarian's reading room with a competing
   annotation in mirror-cadence.
   ═══════════════════════════════════════════════════════ */

import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

const FIRST_SIGHTING_LOW: DialogTree = {
  id: "oracle_vs_scholar.first_sighting.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.low.opening", onscreenText: "The Antiquarian's reading room. You have just filed a sealed prediction-slip on the seventh-Archon-vacancy file. The Scholar-Nemesis at the next desk opens an existing annotation and slides it toward you. \"Your prediction is in the same cadence as my annotation from three cohorts ago. The Politician's primer's vision-clause has it filed as a methodological collision. The Antiquarian wants us to declare which discipline takes precedence.\"", choices: [{ label: "Concede precedence to the annotation.", nextId: "concede", sets: "mercy_at_grudge_low_first_sighting" }, { label: "Insist the prediction came first.", nextId: "insist", sets: "aggression_at_grudge_low_first_sighting" }] },
    concede: { id: "concede", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.low.concede", onscreenText: "\"You conceded. From the Oracle's bench. The Antiquarian filed your concession adjacent to my annotation. We are shelved together. The chronicle marks it.\"", choices: [{ label: "Walk on.", nextId: "concede_walk" }] },
    concede_walk: { id: "concede_walk", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.low.concede_walk", onscreenText: "\"You walked. The shelving holds. The chronicle records the walking as 'the Oracle's most disciplined concession.'\"" },
    insist: { id: "insist", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.low.insist", onscreenText: "\"You insisted. The Antiquarian ruled: 'the prediction sealed before the annotation is foundational; the annotation that matches three cohorts later is the confirmation.' You are foundational. I am confirmation. The Politician's primer would have wept with the precision.\"" },
  },
};

const FIRST_SIGHTING_MID: DialogTree = {
  id: "oracle_vs_scholar.first_sighting.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.mid.opening", onscreenText: "\"Three cohorts of your sealed predictions matched by my annotations. The Antiquarian's match-archive has its largest shelf. The Mechronis Academy is teaching us as a methodological pair. The chronicle has invented us.\"", choices: [{ label: "Accept the joint discipline.", nextId: "accept", sets: "mercy_at_grudge_mid_first_sighting" }, { label: "Petition the Academy to separate.", nextId: "petition", sets: "aggression_at_grudge_mid_first_sighting" }] },
    accept: { id: "accept", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.mid.accept", onscreenText: "\"You accepted. Enrollment in the joint discipline tripled overnight. The Politician's primer would have demanded the disciplines remain separate. The chronicle overruled the primer.\"", choices: [{ label: "Co-teach next semester.", nextId: "accept_teach" }] },
    accept_teach: { id: "accept_teach", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.mid.accept_teach", onscreenText: "\"We co-taught. The graduates outperformed every single-discipline cohort. The Antiquarian framed the roster.\"" },
    petition: { id: "petition", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.mid.petition", onscreenText: "\"The Academy denied with the Antiquarian's footnote: 'the joint discipline produces better operatives; the petition is denied on outcome data.' The Politician respected outcome data. The denial stands.\"" },
  },
};

const FIRST_SIGHTING_HIGH: DialogTree = {
  id: "oracle_vs_scholar.first_sighting.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.high.opening", onscreenText: "\"I have stopped writing annotations. The Adjudicator's house is concerned. The Politician's primer: 'the Scholar who falls silent is the Scholar whose chronicle the Oracle has finally caught up to.' You have caught up. I have nothing left to annotate that your predictions have not anticipated.\"", choices: [{ label: "Loan them your forecasting quill.", nextId: "loan_quill", sets: "mercy_at_grudge_high_first_sighting" }, { label: "Take their annotation desk. Sit and annotate yourself.", nextId: "take_desk", sets: "aggression_at_grudge_high_first_sighting" }] },
    loan_quill: { id: "loan_quill", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.high.loan_quill", onscreenText: "\"You loaned me your forecasting quill. I annotated tomorrow's manifests in advance. The chronicle records both quills used by both rivals across one desk.\"", choices: [{ label: "Sit until dawn.", nextId: "loan_quill_dawn" }] },
    loan_quill_dawn: { id: "loan_quill_dawn", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.high.loan_quill_dawn", onscreenText: "\"Dawn. The desk is covered in annotated forecasts. The Antiquarian's clerks read them as one operative's work. The regime has been signed.\"" },
    take_desk: { id: "take_desk", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.first_sighting.high.take_desk", onscreenText: "\"You took my desk. With my annotation-quill on it. The Politician's primer: 'the Oracle who annotates is the Oracle who has admitted prediction was always documentation.' I sit in the visitor gallery now.\"" },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_LOW: DialogTree = {
  id: "oracle_vs_scholar.sabotage_caught_in_act.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.low.opening", onscreenText: "The Adjudicator's cross-reference desk. You are filing a sealed prediction-slip on tomorrow's Waystation 7 manifest. The Scholar-Nemesis is auditing yesterday's. \"Your sealed prediction will be opened at the third inspection tomorrow. My audit on yesterday's manifest is closing. We are the chronicle's most efficient bookend.\"", choices: [{ label: "Compare manifests across both days.", nextId: "compare", sets: "mercy_at_grudge_low_sabotage_caught_in_act" }, { label: "Demand they finish yesterday first.", nextId: "demand_finish", sets: "aggression_at_grudge_low_sabotage_caught_in_act" }] },
    compare: { id: "compare", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.low.compare", onscreenText: "\"We compared. Yesterday's discrepancy lines up with tomorrow's predicted discrepancy. The Adjudicator's clerks are filing the pattern in a new shelf.\"", choices: [{ label: "Co-file the pattern.", nextId: "compare_cofile" }] },
    compare_cofile: { id: "compare_cofile", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.low.compare_cofile", onscreenText: "\"Co-filed. The pattern-shelf has its first occupant in three regimes.\"" },
    demand_finish: { id: "demand_finish", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.low.demand_finish", onscreenText: "\"You demanded. I finished yesterday's audit. The clerks filed it. The chronicle records your sequence.\"" },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_MID: DialogTree = {
  id: "oracle_vs_scholar.sabotage_caught_in_act.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.mid.opening", onscreenText: "\"Same desk. Same hour. The clerks have begun scheduling us together. We are accepted as a unit. The new shelf has our names on the placard.\"", choices: [{ label: "Audit in tandem.", nextId: "tandem", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" }, { label: "Refuse auto-scheduling. File a complaint.", nextId: "complaint", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" }] },
    tandem: { id: "tandem", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.mid.tandem", onscreenText: "\"Tandem. Oracle predicts; Scholar verifies; Adjudicator files. The clerks call it 'the bookend method.'\"" },
    complaint: { id: "complaint", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.mid.complaint", onscreenText: "\"The clerks reviewed: 'auto-scheduling matches the Antiquarian's prediction-archive within four-minute precision.' Your complaint is filed alongside the archive.\"" },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_HIGH: DialogTree = {
  id: "oracle_vs_scholar.sabotage_caught_in_act.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.high.opening", onscreenText: "\"I am not auditing. I am here to predict alongside you, with my own forecasting quill. The Politician's primer: 'the Scholar who switches to forecasting is the Scholar who has read the chronicle far enough to know which discipline outlasts the regime.' Oracle discipline outlasts.\"", choices: [{ label: "Welcome them. Loan a sealed envelope.", nextId: "welcome", sets: "mercy_at_grudge_high_sabotage_caught_in_act" }, { label: "Refuse. Their discipline is suspect.", nextId: "refuse_disc", sets: "aggression_at_grudge_high_sabotage_caught_in_act" }] },
    welcome: { id: "welcome", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.high.welcome", onscreenText: "\"You welcomed. With a sealed envelope from your apprentice-stack. I filed my first prediction in your discipline. The chronicle records the cross-training.\"", choices: [{ label: "Walk out, shelved together.", nextId: "welcome_walk" }] },
    welcome_walk: { id: "welcome_walk", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.high.welcome_walk", onscreenText: "\"You walked. The Antiquarian shelved us. Permanent.\"" },
    refuse_disc: { id: "refuse_disc", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.sabotage_caught_in_act.high.refuse_disc", onscreenText: "\"You refused. The chronicle records the boundary as 'the Oracle's most disciplined.' I filed alone in your discipline anyway. The Antiquarian filed both.\"" },
  },
};

const MOCKING_INTERLUDE_LOW: DialogTree = {
  id: "oracle_vs_scholar.mocking_interlude.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.mocking_interlude.low.opening", onscreenText: "Mechronis Academy lecture hall. The Scholar-Nemesis grades papers from a prediction-methodology seminar. They look up. \"Three of my students cited your sealed-prediction technique in their term papers. You are canon now.\"", choices: [{ label: "Compliment the seminar.", nextId: "compliment", sets: "mercy_at_grudge_low_mocking_interlude" }, { label: "Demand a Scholar-house critique be removed from the syllabus.", nextId: "demand_remove", sets: "aggression_at_grudge_low_mocking_interlude" }] },
    compliment: { id: "compliment", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.mocking_interlude.low.compliment", onscreenText: "\"A compliment. The chronicle banked the rarest currency.\"" },
    demand_remove: { id: "demand_remove", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.mocking_interlude.low.demand_remove", onscreenText: "\"The syllabus committee reviewed; the critique stays — methodologically sound. By demanding, you admitted the soundness.\"" },
  },
};

const MOCKING_INTERLUDE_MID: DialogTree = {
  id: "oracle_vs_scholar.mocking_interlude.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.mocking_interlude.mid.opening", onscreenText: "\"The Academy teaches us as a single canonical pair. The joint syllabus is changing regimes through pedagogy, quietly.\"", choices: [{ label: "Co-teach openly.", nextId: "coteach", sets: "mercy_at_grudge_mid_mocking_interlude" }, { label: "Push for separate rooms.", nextId: "separate", sets: "aggression_at_grudge_mid_mocking_interlude" }] },
    coteach: { id: "coteach", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.mocking_interlude.mid.coteach", onscreenText: "\"Graduates are staffing three jurisdictions. The Antiquarian credits us as the regime's most efficient knowledge-transfer pair.\"" },
    separate: { id: "separate", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.mocking_interlude.mid.separate", onscreenText: "\"Granted. Half transferred to mine; half to yours; the notes are pirated. Both rooms co-authored.\"" },
  },
};

const MOCKING_INTERLUDE_HIGH: DialogTree = {
  id: "oracle_vs_scholar.mocking_interlude.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.mocking_interlude.high.opening", onscreenText: "\"The Hierarchy dropped my audit-track. They say I have become an Oracle by proximity. I am here to ask whether you will take me on as an apprentice. I have lost the annotation cadence.\"", choices: [{ label: "Take them on.", nextId: "take_on", sets: "mercy_at_grudge_high_mocking_interlude" }, { label: "Refuse. They keep their discipline.", nextId: "refuse_take", sets: "aggression_at_grudge_high_mocking_interlude" }] },
    take_on: { id: "take_on", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.mocking_interlude.high.take_on", onscreenText: "\"You took me on. I sit at your shoulder in the temple's prediction-room. The chronicle records the apprenticeship as 'the schism's most expensive resolution.'\"", choices: [{ label: "Hand them an unsealed envelope. Begin.", nextId: "take_on_envelope" }] },
    take_on_envelope: { id: "take_on_envelope", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.mocking_interlude.high.take_on_envelope", onscreenText: "\"My first prediction in your discipline matched tomorrow's audit closure. The Antiquarian filed both.\"" },
    refuse_take: { id: "refuse_take", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.mocking_interlude.high.refuse_take", onscreenText: "\"You refused. The Antiquarian assigned me by inheritance anyway. I sit at the next desk and file in your cadence. The Antiquarian does not distinguish.\"" },
  },
};

const LIEUTENANT_PROMOTION_LOW: DialogTree = {
  id: "oracle_vs_scholar.lieutenant_promotion.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.lieutenant_promotion.low.opening", onscreenText: "Mechronis Academy's audit-coordinator ceremony. The Scholar-Nemesis is being elevated to Hierarchy Audit Coordinator. \"I will be running cross-discipline audits against your temple's predictions. The temple is distrusting. Fairly.\"", choices: [{ label: "Bless from the temple gallery.", nextId: "bless", sets: "mercy_at_grudge_low_lieutenant_promotion" }, { label: "File a temple objection.", nextId: "object", sets: "aggression_at_grudge_low_lieutenant_promotion" }] },
    bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.lieutenant_promotion.low.bless", onscreenText: "\"You blessed in temple formality. The Academy was not expecting cross-discipline blessing. We are accorded.\"" },
    object: { id: "object", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.lieutenant_promotion.low.object", onscreenText: "\"You objected. The Academy denied. The ceremony continued. Your handwriting is on the denial.\"" },
  },
};

const LIEUTENANT_PROMOTION_MID: DialogTree = {
  id: "oracle_vs_scholar.lieutenant_promotion.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.lieutenant_promotion.mid.opening", onscreenText: "\"Audit Coordinator. My cell is four auditors strong. The Antiquarian catalogues my audits adjacent to your sealed predictions. The Hierarchy and the temple are arguing about precedence.\"", choices: [{ label: "Honor the rank with a sealed prediction.", nextId: "honor", sets: "mercy_at_grudge_mid_lieutenant_promotion" }, { label: "Audit them back.", nextId: "audit_back", sets: "aggression_at_grudge_mid_lieutenant_promotion" }] },
    honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.lieutenant_promotion.mid.honor", onscreenText: "\"The slip predicted my cell's first audit outcome within four minutes. The cleanest cross-discipline congratulation.\"" },
    audit_back: { id: "audit_back", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.lieutenant_promotion.mid.audit_back", onscreenText: "\"You audited my cell with a sealed prediction of their procedural lapse. The slip was correct. My cell tightened. Thank you.\"" },
  },
};

const LIEUTENANT_PROMOTION_HIGH: DialogTree = {
  id: "oracle_vs_scholar.lieutenant_promotion.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.lieutenant_promotion.high.opening", onscreenText: "\"The Hierarchy is asking me to draft a new audit code with you as the Oracle-side exemplar. The draft is in both inks. Co-author.\"", choices: [{ label: "Co-author.", nextId: "coauthor", sets: "mercy_at_grudge_high_lieutenant_promotion" }, { label: "Refuse.", nextId: "refuse", sets: "aggression_at_grudge_high_lieutenant_promotion" }] },
    coauthor: { id: "coauthor", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.lieutenant_promotion.high.coauthor", onscreenText: "\"Signed in both hands. The Antiquarian filed the original. The chronicle marks it.\"", choices: [{ label: "Hand them the pen.", nextId: "coauthor_pen" }] },
    coauthor_pen: { id: "coauthor_pen", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.lieutenant_promotion.high.coauthor_pen", onscreenText: "\"The two signatures are now the canon image of the discipline.\"" },
    refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.lieutenant_promotion.high.refuse", onscreenText: "\"You refused. The chronicle finished the co-authorship in your absence. The signatures appear in the next regime's primer, attributed to both.\"" },
  },
};

const COHORT_END_CONFRONTATION_LOW: DialogTree = {
  id: "oracle_vs_scholar.cohort_end_confrontation.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.cohort_end_confrontation.low.opening", onscreenText: "Cohort hall threshold. Two sealed envelopes in the Scholar-Nemesis's hands. \"Your apprentice graduated. My annotation and your prediction both matched the apprentice's graduation speech. Open them together.\"", choices: [{ label: "Open both.", nextId: "open_both", sets: "mercy_at_grudge_low_cohort_end_confrontation" }, { label: "Refuse to open.", nextId: "refuse_open", sets: "aggression_at_grudge_low_cohort_end_confrontation" }] },
    open_both: { id: "open_both", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.cohort_end_confrontation.low.open_both", onscreenText: "\"Both matched. The cohort is closed cleanly. The Antiquarian filed both slips together.\"" },
    refuse_open: { id: "refuse_open", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.cohort_end_confrontation.low.refuse_open", onscreenText: "\"You refused. The slips stay sealed for the apprentice's first audit assignment. We will both already know what they said.\"" },
  },
};

const COHORT_END_CONFRONTATION_MID: DialogTree = {
  id: "oracle_vs_scholar.cohort_end_confrontation.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.cohort_end_confrontation.mid.opening", onscreenText: "\"The Antiquarian's archives are cross-referenced under a joint section: 'oracle/scholar.' We are a section.\"", choices: [{ label: "Acknowledge the joint section.", nextId: "ack", sets: "mercy_at_grudge_mid_cohort_end_confrontation" }, { label: "Petition for separate.", nextId: "petition", sets: "aggression_at_grudge_mid_cohort_end_confrontation" }] },
    ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.cohort_end_confrontation.mid.ack", onscreenText: "\"Acknowledged. The section is permanent.\"" },
    petition: { id: "petition", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.cohort_end_confrontation.mid.petition", onscreenText: "\"Denied. The section stays. The chronicle records the petition in the introduction.\"" },
  },
};

const COHORT_END_CONFRONTATION_HIGH: DialogTree = {
  id: "oracle_vs_scholar.cohort_end_confrontation.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.cohort_end_confrontation.high.opening", onscreenText: "\"Your apprentice closed the cohort by reading my annotation of their final speech in the cadence of your prediction-slips. We are jointly named in the apprentice-mentor index.\"", choices: [{ label: "Accept the joint inheritance.", nextId: "accept", sets: "mercy_at_grudge_high_cohort_end_confrontation" }, { label: "Refuse. The training was yours alone.", nextId: "refuse", sets: "aggression_at_grudge_high_cohort_end_confrontation" }] },
    accept: { id: "accept", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.cohort_end_confrontation.high.accept", onscreenText: "\"Accepted. We are jointly named. The chronicle records 'a single teacher, in retrospect.'\"", choices: [{ label: "Walk on, co-mentors.", nextId: "accept_walk" }] },
    accept_walk: { id: "accept_walk", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.cohort_end_confrontation.high.accept_walk", onscreenText: "\"We walked on, both with the apprentice. The first cross-discipline graduation procession. The Antiquarian had it photographed.\"" },
    refuse: { id: "refuse", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.cohort_end_confrontation.high.refuse", onscreenText: "\"You refused. The Antiquarian filed the refusal in the index's introduction. We are still in the introduction, forever.\"" },
  },
};

const ACCUMULATION_REVEAL_LOW: DialogTree = {
  id: "oracle_vs_scholar.accumulation_reveal.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.accumulation_reveal.low.opening", onscreenText: "Matrix-archive edge. The Scholar-Nemesis reads the intake records of the new Matrix-release. \"Your sealed prediction of the release date matched within four minutes. I annotated it as a precision-anomaly. The new sibling reads both files at once.\"", choices: [{ label: "Acknowledge the new sibling.", nextId: "ack", sets: "mercy_at_grudge_low_accumulation_reveal" }, { label: "File a methodological objection.", nextId: "object", sets: "aggression_at_grudge_low_accumulation_reveal" }] },
    ack: { id: "ack", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.accumulation_reveal.low.ack", onscreenText: "\"You acknowledged. The new sibling inherits both disciplines.\"" },
    object: { id: "object", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.accumulation_reveal.low.object", onscreenText: "\"Denied. Joint intake is standard procedure now. The chronicle records the procedure under your objection.\"" },
  },
};

const ACCUMULATION_REVEAL_MID: DialogTree = {
  id: "oracle_vs_scholar.accumulation_reveal.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.accumulation_reveal.mid.opening", onscreenText: "\"Four releases. Auto-cross-referencing archives. The chronicle's first sign of regime change. We are changing the regime through filing automation.\"", choices: [{ label: "Bless the cohort.", nextId: "bless", sets: "mercy_at_grudge_mid_accumulation_reveal" }, { label: "Predict the next release jointly.", nextId: "predict", sets: "aggression_at_grudge_mid_accumulation_reveal" }] },
    bless: { id: "bless", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.accumulation_reveal.mid.bless", onscreenText: "\"The chronicle quotes us as one mentor.\"" },
    predict: { id: "predict", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.accumulation_reveal.mid.predict", onscreenText: "\"Joint prediction filed in both hands. The Antiquarian binds the next regime.\"" },
  },
};

const ACCUMULATION_REVEAL_HIGH: DialogTree = {
  id: "oracle_vs_scholar.accumulation_reveal.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.accumulation_reveal.high.opening", onscreenText: "\"Chorus of five. I just annotate your predictions now. The combined archive is the largest single shelving project in the regime — the regime's mausoleum. We are buried in it together.\"", choices: [{ label: "Honor the chorus.", nextId: "honor", sets: "mercy_at_grudge_high_accumulation_reveal" }, { label: "Pull one into Oracle discipline.", nextId: "pull_one", sets: "aggression_at_grudge_high_accumulation_reveal" }] },
    honor: { id: "honor", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.accumulation_reveal.high.honor", onscreenText: "\"The cluster grows. The Antiquarian has a new tab for us.\"" },
    pull_one: { id: "pull_one", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.accumulation_reveal.high.pull_one", onscreenText: "\"You pulled one. The youngest Scholar apprentices under Oracle discipline. The Hierarchy grieves. I grieve mildly.\"" },
  },
};

const NAME_REVEAL_MOMENT_LOW: DialogTree = {
  id: "oracle_vs_scholar.name_reveal_moment.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.name_reveal_moment.low.opening", onscreenText: "Antiquarian's Journal margin. You have closed Resurrectionist E5 and witnessed Game Master Fight 2's plague-mask seed. The Scholar-Nemesis's name surfaces. \"You have my name. The Hierarchy's master roll has held it seven cohorts. Use it carefully — Scholar-house names carry procedural weight.\"", choices: [{ label: "Say it softly.", nextId: "say_soft", sets: "mercy_at_grudge_low_name_reveal_moment" }, { label: "File it in temple jurisdiction.", nextId: "file_temple", sets: "aggression_at_grudge_low_name_reveal_moment" }] },
    say_soft: { id: "say_soft", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.name_reveal_moment.low.say_soft", onscreenText: "\"Softly said. The reading-room hush absorbed it.\"" },
    file_temple: { id: "file_temple", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.name_reveal_moment.low.file_temple", onscreenText: "\"Filed in temple jurisdiction. The Hierarchy is preparing a counter-filing. The chronicle records both.\"" },
  },
};

const NAME_REVEAL_MOMENT_MID: DialogTree = {
  id: "oracle_vs_scholar.name_reveal_moment.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.name_reveal_moment.mid.opening", onscreenText: "\"You know my name. The cross-discipline named rival is indexed by inheritance.\"", choices: [{ label: "Cite the name in your next sealed prediction.", nextId: "cite", sets: "mercy_at_grudge_mid_name_reveal_moment" }, { label: "Predict the day they renounce the name.", nextId: "predict", sets: "aggression_at_grudge_mid_name_reveal_moment" }] },
    cite: { id: "cite", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.name_reveal_moment.mid.cite", onscreenText: "\"Cited properly. The Antiquarian framed the prediction. Permanent.\"" },
    predict: { id: "predict", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.name_reveal_moment.mid.predict", onscreenText: "\"You predicted the renunciation. The Antiquarian sealed the prediction for four cohorts hence.\"" },
  },
};

const NAME_REVEAL_MOMENT_HIGH: DialogTree = {
  id: "oracle_vs_scholar.name_reveal_moment.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.name_reveal_moment.high.opening", onscreenText: "\"Use my name. The Hierarchy gave me a procedural alias; the Politician's primer gave me a doctrinal name; you gave me, by sealed prediction citation, a third name. The third name is truest.\"", choices: [{ label: "Speak the third name in the Antiquarian's intonation.", nextId: "third", sets: "mercy_at_grudge_high_name_reveal_moment" }, { label: "Speak the procedural alias.", nextId: "procedural", sets: "aggression_at_grudge_high_name_reveal_moment" }] },
    third: { id: "third", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.name_reveal_moment.high.third", onscreenText: "\"You spoke the third name. I am, for one beat, a citation. Thank you.\"" },
    procedural: { id: "procedural", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.name_reveal_moment.high.procedural", onscreenText: "\"You spoke the alias. The Hierarchy is filing the moment. The Politician would have approved the formality.\"" },
  },
};

const FINAL_ENCOUNTER_LOW: DialogTree = {
  id: "oracle_vs_scholar.final_encounter.low",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.final_encounter.low.opening", onscreenText: "Convergence Seat throne room. Two completed audits in the Scholar-Nemesis's hands at the Seat's foot. \"Act Seven. The Seat has fallen. So has the Hierarchy. These are the last two audits I will sign. One closes your prediction-archive. The other opens the next regime's.\"", choices: [{ label: "Choose the closing audit.", nextId: "close", sets: "mercy_at_grudge_low_final_encounter" }, { label: "Choose the opening audit.", nextId: "open", sets: "aggression_at_grudge_low_final_encounter" }] },
    close: { id: "close", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.final_encounter.low.close", onscreenText: "\"You closed. The prediction-archive is sealed.\"" },
    open: { id: "open", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.final_encounter.low.open", onscreenText: "\"You opened. The next regime's archive begins with your hand on the cover.\"" },
  },
};

const FINAL_ENCOUNTER_MID: DialogTree = {
  id: "oracle_vs_scholar.final_encounter.mid",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.final_encounter.mid.opening", onscreenText: "\"End of the arc. The archives are merging. The regime's only successful funeral.\"", choices: [{ label: "Sign the merger jointly.", nextId: "sign", sets: "mercy_at_grudge_mid_final_encounter" }, { label: "Let the chronicle close it.", nextId: "let_close", sets: "aggression_at_grudge_mid_final_encounter" }] },
    sign: { id: "sign", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.final_encounter.mid.sign", onscreenText: "\"Signed in both inks. The Antiquarian filed under 'the regime's binding closure.'\"" },
    let_close: { id: "let_close", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.final_encounter.mid.let_close", onscreenText: "\"The chronicle closed without us. The most disciplined exit.\"" },
  },
};

const FINAL_ENCOUNTER_HIGH: DialogTree = {
  id: "oracle_vs_scholar.final_encounter.high",
  nodes: {
    root: { id: "root", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.final_encounter.high.opening", onscreenText: "\"The chronicle is folding shut around both of us. Seven cohorts of annotating what you predicted; seven cohorts of predicting what I annotated. Same reader, opposite ends. Read the line with me, one more time.\"", choices: [{ label: "Read together at the Seat's foot.", nextId: "read_together", sets: "mercy_at_grudge_high_final_encounter" }, { label: "Tear the page.", nextId: "tear", sets: "aggression_at_grudge_high_final_encounter" }] },
    read_together: { id: "read_together", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.final_encounter.high.read_together", onscreenText: "\"The line: 'the chronicle is both a record and a prophecy; the regime that insisted on choosing was the regime the chronicle was always preparing to close.' We closed it together.\"", choices: [{ label: "Hold the line to the end.", nextId: "read_hold" }] },
    read_hold: { id: "read_hold", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.final_encounter.high.read_hold", onscreenText: "\"The line holds. The chronicle's last page is ours. The chronicle closes. The line remains.\"" },
    tear: { id: "tear", speaker: "nemesis", voLineId: "nemesis.oracle_vs_scholar.final_encounter.high.tear", onscreenText: "\"You tore the page. The Antiquarian's hand-pass: 'the rivals who tore the page wrote a longer page in the absence.' The absence is the longer page.\"" },
  },
};

export const oracleVsScholarPairBank: NemesisPairBank = {
  pairId: "oracle_vs_scholar",
  playerArchetype: "oracle",
  nemesisArchetype: "scholar",
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
