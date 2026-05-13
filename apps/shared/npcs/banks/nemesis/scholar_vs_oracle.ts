/* ═══════════════════════════════════════════════════════
   SCHOLAR-PLAYER vs. ORACLE-NEMESIS — Phase K Wave 7B (canon-deepened)

   The past-record vs future-vision axis. Both rivals
   claim to know. The Scholar reads what was filed; the
   Oracle reads what will be filed. They argue, across
   every cohort, about whether the chronicle is a record
   or a prophecy — and the chronicle, as always, is
   both, taking notes on the argument.

   The Scholar-player is an Antiquarian-adjacent
   recordkeeper: cross-references citizen-rolls, annotates
   trade manifests, files cross-jurisdictional citations
   in the Adjudicator's house ink. The Oracle-Nemesis is
   a Politician's secret-apprentice who took her
   surveillance doctrine and bent it toward prediction —
   they consult at the edge of the Matrix of Dreams, sit
   in Wraith Calder's revival chambers reading branches
   the chronicle has not yet written, file predictions
   with the Antiquarian that are sealed until the
   predicted event occurs.

   Surfaces:
     • first_sighting — Antiquarian's reading room, where
       you just finished an annotation the Oracle dated
       three cohorts ago
     • sabotage_caught_in_act — trade-manifest cross-
       reference desk (Oracle has marked a future
       discrepancy you are currently auditing)
     • mocking_interlude — Mechronis Academy lecture
       hall, after a prediction lecture
     • lieutenant_promotion — Dreamer's-Children temple
       elevation ceremony
     • cohort_end_confrontation — Cohort hall
     • accumulation_reveal — Matrix-archive edge
     • name_reveal_moment — Antiquarian's Journal margin
     • final_encounter — Convergence Seat throne room
   ═══════════════════════════════════════════════════════ */

import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

/* ─── first_sighting — Antiquarian's reading room ─── */

const FIRST_SIGHTING_LOW: DialogTree = {
  id: "scholar_vs_oracle.first_sighting.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.low.opening",
      onscreenText: "The Antiquarian's reading room. You have just finished an annotation on the seventh-Archon-vacancy file — a careful cross-reference to three other margins. The Oracle-Nemesis is at the next desk, holding up a sealed prediction-slip dated three cohorts ago. \"You wrote exactly that annotation. The Politician's primer's vision-clause has been waiting for it since the Necromancer opened the Matrix-archive's gate. The Antiquarian filed the slip before you were trained. Open it.\"",
      choices: [
        { label: "Open the slip. Compare it to your annotation.", nextId: "open_slip", sets: "mercy_at_grudge_low_first_sighting" },
        { label: "Refuse. The chronicle is a record, not a prophecy.", nextId: "refuse_prophecy", sets: "aggression_at_grudge_low_first_sighting" },
      ],
    },
    open_slip: {
      id: "open_slip",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.low.open_slip",
      onscreenText: "\"The slip reads, in my hand from three cohorts ago: 'the Scholar will cross-reference three margins on the vacancy file; the third margin will surprise them.' Did the third margin surprise you? It surprised me, when I wrote the slip. The Politician's primer: 'the prediction the Oracle is surprised by is the prediction the Scholar will not be able to refute.'\"",
      choices: [
        { label: "Acknowledge the surprise. File the slip yourself.", nextId: "open_slip_file" },
      ],
    },
    open_slip_file: {
      id: "open_slip_file",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.low.open_slip_file",
      onscreenText: "\"You filed the opened slip yourself, in the Antiquarian's match-archive. The chronicle records the filing as 'the first prediction the Scholar agreed was correct.' The Politician's primer: 'the Scholar who files a confirmed prophecy is the Scholar who has begun reading the chronicle in both directions.' Welcome to the bidirectional reading.\"",
    },
    refuse_prophecy: {
      id: "refuse_prophecy",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.low.refuse_prophecy",
      onscreenText: "\"You refused. The slip is still sealed. The Politician's primer: 'the unread prediction is the prediction that the chronicle reads on the Scholar's behalf.' The Antiquarian has logged the refusal. The match-archive will tell us, in time, whether the prediction was right. You are not being deprived of the answer; you are being deprived of the moment.\"",
      choices: [
        { label: "Walk out, prediction still sealed.", nextId: "refuse_walk" },
      ],
    },
    refuse_walk: {
      id: "refuse_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.low.refuse_walk",
      onscreenText: "\"You walked. The slip stays sealed. The chronicle records the walk as 'the Scholar's first refusal to enter the bidirectional reading-room.' The Politician's primer: 'the first refusal is the most efficient teaching moment the Oracle ever gets.' I am teaching, even now, by your absence. Thank you.\"",
    },
  },
};

const FIRST_SIGHTING_MID: DialogTree = {
  id: "scholar_vs_oracle.first_sighting.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.mid.opening",
      onscreenText: "\"Three cohorts of annotations. Three cohorts of sealed prediction-slips dated to match. The Antiquarian has begun shelving the match-archive in your section, between your filings. The Politician's primer: 'the predictions filed adjacent to the annotations they predict are the chronicle's first signed agreement.' The Antiquarian has signed for both of us.\"",
      choices: [
        { label: "Co-file the next annotation with a sealed prediction.", nextId: "cofile", sets: "mercy_at_grudge_mid_first_sighting" },
        { label: "Petition the Antiquarian to separate the shelving.", nextId: "petition_separate", sets: "aggression_at_grudge_mid_first_sighting" },
      ],
    },
    cofile: {
      id: "cofile",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.mid.cofile",
      onscreenText: "\"You co-filed. The Antiquarian's reading room has a new genre tonight: prophetic record. The Politician's primer: 'the chronicle's first new genre in seven cohorts is the chronicle's most expensive admission.' We are the genre. The Hierarchy is going to demand a catalogue listing. The Insurgency will pirate it.\"",
      choices: [
        { label: "Hold the file together. Don't seal it.", nextId: "cofile_hold" },
      ],
    },
    cofile_hold: {
      id: "cofile_hold",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.mid.cofile_hold",
      onscreenText: "\"The file is unsealed. Both of us are reading the same page, in the same hand-pass. The chronicle records the page-pass as 'the first time a Scholar and an Oracle read the same forecast in the same minute.' The Politician's primer: 'the same-minute reading is the same-doctrine reading.' We are the doctrine. The chronicle approves.\"",
    },
    petition_separate: {
      id: "petition_separate",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.mid.petition_separate",
      onscreenText: "\"You petitioned. The Antiquarian denied the petition with a footnote in her own hand: 'the shelving has been correct for three cohorts; the petitioner has not noticed until now.' The Politician's primer: 'the denial that footnotes the petitioner is the denial that the petitioner will quote in their thesis.' Your thesis will quote me. Through her hand. Unavoidably.\"",
      choices: [
        { label: "Accept the denial. Re-file your protest as a footnote.", nextId: "petition_separate_footnote" },
      ],
    },
    petition_separate_footnote: {
      id: "petition_separate_footnote",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.mid.petition_separate_footnote",
      onscreenText: "\"You re-filed. As a footnote. To the Antiquarian's footnote. The chronicle records the recursion as 'the most disciplined protest a Scholar has ever lodged.' The Politician's primer: 'the recursive footnote is the chronicle's longest argument.' We are the argument. The Antiquarian is the moderator. She is enjoying this.\"",
    },
  },
};

const FIRST_SIGHTING_HIGH: DialogTree = {
  id: "scholar_vs_oracle.first_sighting.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.high.opening",
      onscreenText: "\"I have stopped filing prediction-slips. The Dreamer's-Children temple is concerned. I sit in the Antiquarian's reading room without writing. The Politician's primer: 'the Oracle who falls silent is the Oracle whose chronicle has caught up.' The chronicle has caught up. I have nothing left to predict that you have not annotated.\"",
      choices: [
        { label: "Offer them a blank slip. Let them keep predicting.", nextId: "offer_blank", sets: "mercy_at_grudge_high_first_sighting" },
        { label: "Tell them prophecy is finished. Sit in their chair.", nextId: "sit_their_chair", sets: "aggression_at_grudge_high_first_sighting" },
      ],
    },
    offer_blank: {
      id: "offer_blank",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.high.offer_blank",
      onscreenText: "\"You offered a blank slip. The Politician's primer: 'the blank slip from the Scholar is the slip that lets the Oracle predict from the chronicle's near-future, not the far.' I will use it. I will predict only what tomorrow's annotation will say. The Antiquarian will file it under 'collaborative forecast.' We will share the byline.\"",
      choices: [
        { label: "Sit while they write the near-future.", nextId: "offer_blank_sit" },
      ],
    },
    offer_blank_sit: {
      id: "offer_blank_sit",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.high.offer_blank_sit",
      onscreenText: "\"I wrote. You sat. The slip reads, in my hand: 'tomorrow the Scholar will read this slip and remember the day they let the Oracle keep predicting.' The chronicle records the slip as 'the longest co-authored prophecy in the regime.' We are co-authors. The Antiquarian has updated our card.\"",
    },
    sit_their_chair: {
      id: "sit_their_chair",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.high.sit_their_chair",
      onscreenText: "\"You sat in my chair. With my forecasting-quill on the desk. The Politician's primer: 'the Scholar who takes the Oracle's chair is the Scholar who has finally agreed prophecy was a kind of recordkeeping.' I agree. The chair is yours. I will sit in the visitor gallery. From the gallery I can see what the Oracle was looking at, and what they were avoiding looking at. Both kinds of vision.\"",
      choices: [
        { label: "Stay in the chair. Forecast tomorrow.", nextId: "sit_chair_forecast" },
      ],
    },
    sit_chair_forecast: {
      id: "sit_chair_forecast",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.first_sighting.high.sit_chair_forecast",
      onscreenText: "\"You forecasted. In Scholar-house ink. From the Oracle's chair. The chronicle records the forecast as 'the first prediction filed by an annotator in seven cohorts.' The Politician's primer was clear about hybrids. I will read what you wrote tomorrow. So will you. So will the Antiquarian. So will the regime that follows this one.\"",
    },
  },
};

/* ─── sabotage_caught_in_act — trade-manifest cross-reference desk ─── */

const SABOTAGE_CAUGHT_IN_ACT_LOW: DialogTree = {
  id: "scholar_vs_oracle.sabotage_caught_in_act.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.low.opening",
      onscreenText: "The Adjudicator's cross-reference desk. You are auditing a trade-manifest for the Waystation 7 route. The Oracle-Nemesis is at the next station, marking a competing manifest with a small purple seal. \"You are auditing line forty-three. The Politician's primer's vision-clause says it will be wrong on the third inspection. I have sealed my prediction. You will sign the audit before the third inspection or you will not. Either way the chronicle is documenting which.\"",
      choices: [
        { label: "Run the third inspection now.", nextId: "third_now", sets: "mercy_at_grudge_low_sabotage_caught_in_act" },
        { label: "Sign the audit immediately. Refuse the third inspection.", nextId: "sign_no_third", sets: "aggression_at_grudge_low_sabotage_caught_in_act" },
      ],
    },
    third_now: {
      id: "third_now",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.low.third_now",
      onscreenText: "\"You ran the third inspection. Line forty-three was wrong — discrepancy of four crates of architect-ash. The seal unsealed itself. My prediction reads: 'four crates, undeclared, architect-ash.' The Politician's primer: 'the prophecy that is verified by the audit is the prophecy that finally joins the chronicle's index.' We are indexed. Together.\"",
      choices: [
        { label: "Co-sign the corrected manifest.", nextId: "third_now_cosign" },
      ],
    },
    third_now_cosign: {
      id: "third_now_cosign",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.low.third_now_cosign",
      onscreenText: "\"We co-signed. The Adjudicator's clerks are confused — they have never seen Scholar-house ink and Oracle-house ink on the same manifest. The Politician's primer: 'the co-signed manifest is the manifest that survives three regime changes.' This manifest is surviving the chronicle's filing room. The chronicle is recording the survival.\"",
    },
    sign_no_third: {
      id: "sign_no_third",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.low.sign_no_third",
      onscreenText: "\"You signed without the third inspection. The Politician's primer: 'the signed audit without the prophesied inspection is the audit that finally proves the Scholar trusts the Oracle.' You trust me. The chronicle records the trust as 'the cleanest concession of the rival's discipline in the regime.' I will not abuse the trust. The Antiquarian is watching.\"",
      choices: [
        { label: "Walk away from the signed audit.", nextId: "sign_no_third_walk" },
      ],
    },
    sign_no_third_walk: {
      id: "sign_no_third_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.low.sign_no_third_walk",
      onscreenText: "\"You walked. I ran the third inspection on your behalf. Line forty-three was wrong. The chronicle records the running as 'the Oracle's most disciplined favor.' The Adjudicator's clerks are not going to ask which of us caught it. The Politician's primer was kind to the silent corroboration.\"",
    },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_MID: DialogTree = {
  id: "scholar_vs_oracle.sabotage_caught_in_act.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.mid.opening",
      onscreenText: "\"Same desk. Same hour. The Politician's primer would have said: 'the rivals who sit at the same desk on the same hour are the rivals the Adjudicator's clerks have begun to schedule together.' The clerks have begun to schedule us together. We are now, by procedure, a working unit.\"",
      choices: [
        { label: "Accept the pairing. Audit in tandem.", nextId: "tandem", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" },
        { label: "File a complaint about the auto-scheduling.", nextId: "complaint", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" },
      ],
    },
    tandem: {
      id: "tandem",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.mid.tandem",
      onscreenText: "\"Tandem audit. I predict the discrepancy line. You verify the discrepancy line. The audit moves twice as fast. The chronicle records the tandem as 'the Adjudicator's most efficient cross-reference team in three regimes.' The clerks are filing us a joint commendation. The Politician's primer would have been incoherent with envy.\"",
      choices: [
        { label: "Hold the tandem. Finish the route's three manifests.", nextId: "tandem_hold" },
      ],
    },
    tandem_hold: {
      id: "tandem_hold",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.mid.tandem_hold",
      onscreenText: "\"We finished. All three manifests signed in both hands. The Adjudicator's filing system has had to invent a new code for the joint signatures. The Politician's primer: 'the invented filing code is the chronicle's most permanent change.' The code will outlive both of us.\"",
    },
    complaint: {
      id: "complaint",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.mid.complaint",
      onscreenText: "\"You filed the complaint. The clerks reviewed the auto-scheduling and reported: 'the schedule matches the Antiquarian's prediction-archive within four-minute precision; the schedule is administratively sound; the complainant is encouraged to file the prediction-archive as a co-administrator.' The Politician's primer: 'the complaint that proves the prediction is the complaint that converts the complainant.'\"",
      choices: [
        { label: "Withdraw the complaint. File the prediction-archive co-administration paperwork.", nextId: "complaint_withdraw" },
      ],
    },
    complaint_withdraw: {
      id: "complaint_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.mid.complaint_withdraw",
      onscreenText: "\"You withdrew. You filed the paperwork. The chronicle records the filing as 'the Scholar's first administrative endorsement of the Oracle's discipline.' The Politician's primer is unable to comment; she died before this kind of cross-discipline file was permitted. The chronicle is permitting it. The chronicle decides.\"",
    },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_HIGH: DialogTree = {
  id: "scholar_vs_oracle.sabotage_caught_in_act.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.high.opening",
      onscreenText: "\"I am not filing predictions this quarter. The Dreamer's-Children temple has asked me to step back. I am here to audit with you, in your discipline only, in Scholar-house ink. The Politician's primer: 'the Oracle who switches inks is the Oracle who has read the chronicle far enough into its future to know which ink will be permanent.' Scholar-house ink will be permanent.\"",
      choices: [
        { label: "Welcome them as a Scholar. Loan them a quill.", nextId: "loan_quill", sets: "mercy_at_grudge_high_sabotage_caught_in_act" },
        { label: "Refuse. Their discipline is still suspect.", nextId: "refuse_disc", sets: "aggression_at_grudge_high_sabotage_caught_in_act" },
      ],
    },
    loan_quill: {
      id: "loan_quill",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.high.loan_quill",
      onscreenText: "\"You loaned me your quill. The cross-reference goes faster than any in seven cohorts. The chronicle records the loan as 'the rival who lent his own quill to the rival who had spent seven cohorts predicting it.' The Politician's primer: 'the prediction that the quill would be loaned is the prediction the Oracle was holding for this very desk.' I held it. You handed it. We are done predicting.\"",
      choices: [
        { label: "Audit together until dawn.", nextId: "loan_quill_dawn" },
      ],
    },
    loan_quill_dawn: {
      id: "loan_quill_dawn",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.high.loan_quill_dawn",
      onscreenText: "\"Dawn. The desk is covered in completed audits, both hands. The Adjudicator's morning clerks are reading them as if they were a single new operative's work. The Politician's primer: 'the dawn audit is the chronicle's marriage paperwork.' The clerks are filing accordingly.\"",
    },
    refuse_disc: {
      id: "refuse_disc",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.high.refuse_disc",
      onscreenText: "\"You refused. I will use my own quill, in my own ink, to file in your discipline. The chronicle records the refusal as 'the Scholar's most disciplined boundary.' The Politician's primer respected boundaries. The audit will be slower without my quill in your hand. The audit will be honest. The chronicle approves the honesty.\"",
      choices: [
        { label: "Hold the boundary. Audit alone.", nextId: "refuse_disc_alone" },
      ],
    },
    refuse_disc_alone: {
      id: "refuse_disc_alone",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.sabotage_caught_in_act.high.refuse_disc_alone",
      onscreenText: "\"You audited alone. I sat at the next desk, in Scholar-house ink, doing the same work in parallel. The audits matched. The chronicle records the matching as 'the rival who refused to share a quill but produced identical work.' The Politician's primer: 'parallel work is the chronicle's most expensive proof of merger.'\"",
    },
  },
};

/* ─── mocking_interlude — Mechronis Academy lecture hall ─── */

const MOCKING_INTERLUDE_LOW: DialogTree = {
  id: "scholar_vs_oracle.mocking_interlude.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.low.opening",
      onscreenText: "Mechronis Academy lecture hall, after a prediction-methodology session. The Oracle-Nemesis is at the podium, packing notes. \"You came to the lecture. The Politician's primer's vision-clause has been on the syllabus for three semesters; I assumed you would read it and never come. I was wrong, by three minutes, which is the smallest margin I have ever been wrong by. Thank you. The chronicle has been recording the margin.\"",
      choices: [
        { label: "Compliment the lecture. Walk out together.", nextId: "compliment", sets: "mercy_at_grudge_low_mocking_interlude" },
        { label: "Cite a Scholar-house critique of the methodology.", nextId: "cite_critique", sets: "aggression_at_grudge_low_mocking_interlude" },
      ],
    },
    compliment: {
      id: "compliment",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.low.compliment",
      onscreenText: "\"A compliment from a Scholar to an Oracle. The Politician's primer: 'the compliment exchanged across disciplines is the compliment the chronicle archives in two indexes at once.' The Antiquarian has indexed it under 'cross-discipline civility, rare.' I am framing the index entry.\"",
      choices: [
        { label: "Walk out of the lecture hall together.", nextId: "compliment_walk" },
      ],
    },
    compliment_walk: {
      id: "compliment_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.low.compliment_walk",
      onscreenText: "\"We walked out together. The students who saw it are now writing papers titled 'the post-lecture co-walk: a new methodology.' The chronicle records the papers as 'the regime's most efficient pedagogical accident.'\"",
    },
    cite_critique: {
      id: "cite_critique",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.low.cite_critique",
      onscreenText: "\"You cited a Scholar-house critique. Specifically: the four-minute-margin objection. The Politician's primer: 'the four-minute margin is the Oracle's least defended interval.' I agree with your critique. I have been waiting for it. I will incorporate it into the next semester's syllabus, with your name in the bibliography. Thank you.\"",
      choices: [
        { label: "Refuse the bibliography credit.", nextId: "cite_critique_refuse" },
      ],
    },
    cite_critique_refuse: {
      id: "cite_critique_refuse",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.low.cite_critique_refuse",
      onscreenText: "\"You refused the credit. The Politician's primer: 'the refused bibliography credit is the credit the chronicle prints in larger type.' Your name will be in larger type. The Academy is going to ask you to deliver a guest critique next semester. I will sit in the front row.\"",
    },
  },
};

const MOCKING_INTERLUDE_MID: DialogTree = {
  id: "scholar_vs_oracle.mocking_interlude.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.mid.opening",
      onscreenText: "\"Mechronis Academy is now co-teaching us as a methodological pair. The students call the course 'past-future bidirectional documentation.' Half of them ignore the second word. Half ignore the first. The Politician's primer: 'the half-students are the chronicle's most predictable variable.' We are predictable in tandem.\"",
      choices: [
        { label: "Co-teach openly. Take the whole semester.", nextId: "co_teach", sets: "mercy_at_grudge_mid_mocking_interlude" },
        { label: "Demand a separate course. Different rooms.", nextId: "demand_separate", sets: "aggression_at_grudge_mid_mocking_interlude" },
      ],
    },
    co_teach: {
      id: "co_teach",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.mid.co_teach",
      onscreenText: "\"We co-taught. The students who paid attention to both halves graduated with the highest marks the Academy has issued in three regimes. The Politician's primer: 'the cross-discipline graduate is the chronicle's most reliable next-generation operative.' We have produced a generation. The Hierarchy is hiring them. The Insurgency is hiring them. The Antiquarian is hiring them.\"",
      choices: [
        { label: "Walk out together at the end of term.", nextId: "co_teach_walk" },
      ],
    },
    co_teach_walk: {
      id: "co_teach_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.mid.co_teach_walk",
      onscreenText: "\"We walked out together at term-end. The students are now in three jurisdictions, citing both of us in the same paragraphs. The chronicle records the citations as 'the most efficient knowledge-transfer in the regime.'\"",
    },
    demand_separate: {
      id: "demand_separate",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.mid.demand_separate",
      onscreenText: "\"You demanded separate rooms. The Academy granted the demand. Half the students requested transfers to mine; half requested transfers to yours. The Politician's primer: 'the separated rooms are the rooms whose students will pirate the other room's notes.' The notes are being pirated. We are jointly accused of permitting it.\"",
      choices: [
        { label: "Don't deny the joint accusation.", nextId: "demand_separate_dont_deny" },
      ],
    },
    demand_separate_dont_deny: {
      id: "demand_separate_dont_deny",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.mid.demand_separate_dont_deny",
      onscreenText: "\"We did not deny. The Academy issued joint reprimands. The reprimands are now framed in both our offices, side by side. The Politician's primer: 'the framed joint reprimand is the regime's most efficient marriage announcement.' We are announced. The Antiquarian sent a card.\"",
    },
  },
};

const MOCKING_INTERLUDE_HIGH: DialogTree = {
  id: "scholar_vs_oracle.mocking_interlude.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.high.opening",
      onscreenText: "\"I have left the Dreamer's-Children temple. They say I have become a Scholar by proximity. I am here to ask whether you will let me audit your annotations as an apprentice, not a rival. The Politician's primer: 'the rival who asks to apprentice is the rival who has accepted the chronicle's verdict on the schism.' I have accepted. Will you take me on?\"",
      choices: [
        { label: "Take them on as an apprentice in your discipline.", nextId: "take_on", sets: "mercy_at_grudge_high_mocking_interlude" },
        { label: "Refuse. They keep their own discipline.", nextId: "refuse_take", sets: "aggression_at_grudge_high_mocking_interlude" },
      ],
    },
    take_on: {
      id: "take_on",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.high.take_on",
      onscreenText: "\"You took me on. I will sit at your shoulder in the Antiquarian's reading room for the next cohort. I will not seal predictions. I will annotate alongside you, in Scholar-house ink. The chronicle records the apprenticeship as 'the schism's most expensive resolution.' The Politician would have been speechless.\"",
      choices: [
        { label: "Hand them a quill. Begin.", nextId: "take_on_quill" },
      ],
    },
    take_on_quill: {
      id: "take_on_quill",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.high.take_on_quill",
      onscreenText: "\"You handed me a quill. We began. The first annotation I wrote was a citation to your annotation from three cohorts ago — a citation I would have filed as a prediction in the old regime. The chronicle records it now as 'a Scholar's footnote in the Oracle's hand.' The Antiquarian is updating both our cards.\"",
    },
    refuse_take: {
      id: "refuse_take",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.high.refuse_take",
      onscreenText: "\"You refused. The Politician's primer: 'the refused apprenticeship is the apprenticeship the chronicle assigns by inheritance.' The chronicle assigns. I will sit at the next desk, on my own, in my own discipline, citing your annotations in my predictions as if you had taken me on anyway. The Antiquarian will not file the difference.\"",
      choices: [
        { label: "Let them sit. Don't acknowledge.", nextId: "refuse_take_let" },
      ],
    },
    refuse_take_let: {
      id: "refuse_take_let",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.mocking_interlude.high.refuse_take_let",
      onscreenText: "\"You let me sit. The chronicle records the letting as 'the Scholar's most disciplined non-acknowledgment.' I am sitting. I am writing. The chronicle is filing my work next to yours, by inheritance. The Politician's primer was right about inheritance. She always was.\"",
    },
  },
};

/* ─── lieutenant_promotion — Dreamer's-Children temple elevation ─── */

const LIEUTENANT_PROMOTION_LOW: DialogTree = {
  id: "scholar_vs_oracle.lieutenant_promotion.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.low.opening",
      onscreenText: "The Dreamer's-Children temple, candle-lit, with two newer oracles waiting behind the Nemesis. \"They are elevating me to vision-coordinator. Two younger oracles will report to me. The Politician's primer: 'the vision-coordinator who has read the Scholar is the vision-coordinator the temple distrusts and the Antiquarian fully employs.' The temple is distrusting. The Antiquarian is preparing my employment contract.\"",
      choices: [
        { label: "Bless the elevation from the gallery.", nextId: "bless", sets: "mercy_at_grudge_low_lieutenant_promotion" },
        { label: "Petition the temple to delay.", nextId: "petition_delay", sets: "aggression_at_grudge_low_lieutenant_promotion" },
      ],
    },
    bless: {
      id: "bless",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.low.bless",
      onscreenText: "\"You blessed. From the visitor gallery. In Scholar-house formality. The temple is confused — they have never received a Scholar's blessing for a vision-coordinator. The Politician's primer: 'the cross-discipline blessing is the chronicle's most efficient temple-reform.' The temple is being reformed by my elevation. The Antiquarian smiles in her hand-written index.\"",
      choices: [
        { label: "Stay for the candle-vow.", nextId: "bless_stay" },
      ],
    },
    bless_stay: {
      id: "bless_stay",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.low.bless_stay",
      onscreenText: "\"You stayed for the candle-vow. The two younger oracles took the vow in the cadence you taught them through the syllabus. The chronicle records the cadence as 'the temple's first borrowed inflection from the Scholar discipline.' The Politician would have wept with rage.\"",
    },
    petition_delay: {
      id: "petition_delay",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.low.petition_delay",
      onscreenText: "\"You petitioned for delay. The temple denied. The Antiquarian filed your petition as 'a cross-discipline professional concern; permitted, denied.' The Politician's primer: 'the denied delay is the delay that proves the elevation was correct.' I am elevated faster, because of your petition.\"",
      choices: [
        { label: "Withdraw the petition. Apologize in writing.", nextId: "petition_delay_withdraw" },
      ],
    },
    petition_delay_withdraw: {
      id: "petition_delay_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.low.petition_delay_withdraw",
      onscreenText: "\"You withdrew. With written apology, in Scholar-house formality. The temple has framed the apology. The Politician's primer: 'the framed cross-discipline apology is the chronicle's most expensive ornament.' I am decorated by your apology. The chronicle approves the decoration.\"",
    },
  },
};

const LIEUTENANT_PROMOTION_MID: DialogTree = {
  id: "scholar_vs_oracle.lieutenant_promotion.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.mid.opening",
      onscreenText: "\"Vision-coordinator. My cell of two newer oracles is now four. The Antiquarian has begun cataloguing my sealed predictions in a shared shelf with your annotations. The Politician's primer: 'the shared shelf is the chronicle's most efficient marriage of disciplines.' We are shelved together. The Hierarchy is going to ask whose discipline takes precedence in the cataloguing. The answer will be 'both.'\"",
      choices: [
        { label: "Honor the rank with a Scholar-house citation.", nextId: "honor_cite", sets: "mercy_at_grudge_mid_lieutenant_promotion" },
        { label: "Audit their entire cell for discipline drift.", nextId: "audit_cell", sets: "aggression_at_grudge_mid_lieutenant_promotion" },
      ],
    },
    honor_cite: {
      id: "honor_cite",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.mid.honor_cite",
      onscreenText: "\"You honored the rank with a citation. In a footnote, in the Antiquarian's match-archive, in my discipline's language, in your handwriting. The Politician's primer: 'the cross-discipline citation in the rival's language is the chronicle's most efficient grammar.' We are grammatical now.\"",
      choices: [
        { label: "Sit in the temple gallery for the next ceremony.", nextId: "honor_cite_sit" },
      ],
    },
    honor_cite_sit: {
      id: "honor_cite_sit",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.mid.honor_cite_sit",
      onscreenText: "\"You sat through the next ceremony. The cell's younger members watched you watching me. The chronicle records the watching as 'the cross-discipline audit's most disciplined ceremony attendance.' The Politician's primer would have wept again.\"",
    },
    audit_cell: {
      id: "audit_cell",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.mid.audit_cell",
      onscreenText: "\"You audited the whole cell. For discipline drift. My oracles answered every question in vision-language; your audit caught three procedural lapses; the temple accepted the audit and tightened the discipline. The Politician's primer: 'the audited cell is the cell that survives the next regime change.' Thank you. Sincerely.\"",
      choices: [
        { label: "Withdraw the audit citation. Keep the procedural notes.", nextId: "audit_cell_withdraw" },
      ],
    },
    audit_cell_withdraw: {
      id: "audit_cell_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.mid.audit_cell_withdraw",
      onscreenText: "\"You withdrew the citation. You kept the notes. The cell came back at full procedural strength. The Politician's primer: 'the withdrawn citation with kept notes is the Scholar's most heretic mercy.' The temple is offering you an honorary visiting position. You can refuse. They will offer again next quarter.\"",
    },
  },
};

const LIEUTENANT_PROMOTION_HIGH: DialogTree = {
  id: "scholar_vs_oracle.lieutenant_promotion.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.high.opening",
      onscreenText: "\"The temple is asking me to draft a new vision-discipline code, with you as the Scholar-side exemplar. The Politician's primer: 'the rival who becomes the next discipline's textbook is the rival the next discipline cannot dismiss.' Co-author with me. The draft is in both inks already. We have been writing it for cohorts without noticing.\"",
      choices: [
        { label: "Co-author the code.", nextId: "coauthor", sets: "mercy_at_grudge_high_lieutenant_promotion" },
        { label: "Refuse. The disciplines must stay separate.", nextId: "refuse_coauthor", sets: "aggression_at_grudge_high_lieutenant_promotion" },
      ],
    },
    coauthor: {
      id: "coauthor",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.high.coauthor",
      onscreenText: "\"You co-authored. The code is signed in both hands and both inks. The Antiquarian filed the original. The Politician's primer: 'the code signed by two rivals in two inks is the code that survives the regime that wrote it.' We have survived. The temple has adopted. The Adjudicator's house has adopted. The Hierarchy is reading. The Insurgency is reading.\"",
      choices: [
        { label: "Sign the original. Hand them the pen.", nextId: "coauthor_pen" },
      ],
    },
    coauthor_pen: {
      id: "coauthor_pen",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.high.coauthor_pen",
      onscreenText: "\"You handed me the pen. I signed in the same nib. The Antiquarian filed the original under 'the chronicle's canon image.' The chronicle marks it. The temple weeps. The Politician's primer's seventh-Archon-vacancy clause has been amended to cite our signatures.\"",
    },
    refuse_coauthor: {
      id: "refuse_coauthor",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.high.refuse_coauthor",
      onscreenText: "\"You refused. The temple is disappointed. The Antiquarian is filing the refusal. The Politician's primer: 'the refused co-authorship is the co-authorship the chronicle finishes for the rivals.' The chronicle will finish it. The signatures will appear in the next regime's primer. We will not have signed; the chronicle will have signed for us.\"",
      choices: [
        { label: "Hold the refusal. Walk out.", nextId: "refuse_coauthor_walk" },
      ],
    },
    refuse_coauthor_walk: {
      id: "refuse_coauthor_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.lieutenant_promotion.high.refuse_coauthor_walk",
      onscreenText: "\"You walked. The Antiquarian's hand-pass closes the file. The chronicle records the closing as 'the rivals who let the chronicle sign for them.' The chronicle has decided.\"",
    },
  },
};

/* ─── cohort_end_confrontation ─── */

const COHORT_END_CONFRONTATION_LOW: DialogTree = {
  id: "scholar_vs_oracle.cohort_end_confrontation.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.low.opening",
      onscreenText: "The Cohort hall, after graduation. The Oracle-Nemesis is at the heretic seal of the door — vision-coordinators traditionally do not enter; they predict the graduation from outside. \"Your apprentice graduated. The Antiquarian's prediction-archive had two sealed slips on the graduation: one I filed, one the apprentice filed themselves last cohort. Both slips matched. The Politician's primer: 'the apprentice who matches their teacher's rival's prediction is the apprentice the chronicle reads from both ends.' Your apprentice is bidirectional now.\"",
      choices: [
        { label: "Open both slips together.", nextId: "open_both", sets: "mercy_at_grudge_low_cohort_end_confrontation" },
        { label: "Refuse to open them. The cohort closed cleanly.", nextId: "refuse_open", sets: "aggression_at_grudge_low_cohort_end_confrontation" },
      ],
    },
    open_both: {
      id: "open_both",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.low.open_both",
      onscreenText: "\"Both slips read the same line, in different hands: 'the apprentice will graduate at the third bell.' The third bell rang while you read. The Politician's primer: 'the simultaneous reading of a confirmed prediction is the chronicle's most efficient closure.' The cohort is closed. The Antiquarian is filing the slips together. The chronicle records the filing as 'the cohort's bidirectional signature.'\"",
      choices: [
        { label: "Walk on with your apprentice.", nextId: "open_both_walk" },
      ],
    },
    open_both_walk: {
      id: "open_both_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.low.open_both_walk",
      onscreenText: "\"You walked. The slips stay filed. The chronicle records the graduation as 'the most peer-reviewed close in the regime.' The Politician would have, finally, applauded.\"",
    },
    refuse_open: {
      id: "refuse_open",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.low.refuse_open",
      onscreenText: "\"You refused. The slips stay sealed. The Politician's primer: 'the refused match is the match the chronicle delays opening until the apprentice's first audit assignment.' The Antiquarian will open them then. You will read them then. We will both already know what they said.\"",
      choices: [
        { label: "Walk on without opening.", nextId: "refuse_open_walk" },
      ],
    },
    refuse_open_walk: {
      id: "refuse_open_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.low.refuse_open_walk",
      onscreenText: "\"You walked. The chronicle records the walking as 'the Scholar's first deliberate procrastination.' The Politician's primer was kind to procrastination. The slips wait. So do we.\"",
    },
  },
};

const COHORT_END_CONFRONTATION_MID: DialogTree = {
  id: "scholar_vs_oracle.cohort_end_confrontation.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.mid.opening",
      onscreenText: "\"The cohort closes around you. The Antiquarian's prediction-archive now has a section labeled 'rivals' joint forecasts: scholar / oracle.' We are a section. The Politician's primer: 'the rivals who are a section are the rivals the chronicle teaches as a unit.' We are taught. The students cite us in the same paragraph. The chronicle is at peace.\"",
      choices: [
        { label: "Acknowledge the joint section.", nextId: "ack_joint", sets: "mercy_at_grudge_mid_cohort_end_confrontation" },
        { label: "Petition the Antiquarian to file you separately.", nextId: "petition_separate", sets: "aggression_at_grudge_mid_cohort_end_confrontation" },
      ],
    },
    ack_joint: {
      id: "ack_joint",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.mid.ack_joint",
      onscreenText: "\"You acknowledged. The Politician's primer: 'the acknowledged section is the section the next regime will inherit verbatim.' We are verbatim. The chronicle is at peace.\"",
      choices: [
        { label: "Walk on with the section established.", nextId: "ack_joint_walk" },
      ],
    },
    ack_joint_walk: {
      id: "ack_joint_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.mid.ack_joint_walk",
      onscreenText: "\"You walked. The section grows. The Politician would have filed an objection. The Antiquarian would have denied it. The Antiquarian denies all of the Politician's objections, posthumously. The chronicle is satisfied.\"",
    },
    petition_separate: {
      id: "petition_separate",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.mid.petition_separate",
      onscreenText: "\"You petitioned. The Antiquarian denied. The Politician's primer: 'the denied petition for separation is the petition the chronicle records as the rivals' second-most-disciplined gesture.' The first being signing the section's preface together. We will sign next quarter. The Antiquarian has scheduled it.\"",
      choices: [
        { label: "Accept the schedule. Sign next quarter.", nextId: "petition_accept" },
      ],
    },
    petition_accept: {
      id: "petition_accept",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.mid.petition_accept",
      onscreenText: "\"You accepted. The schedule is in the Antiquarian's hand-pass. We are signing. The chronicle records the acceptance as 'the chronicle's most efficient predicted concession.' The Politician's primer was clear: the chronicle wins.\"",
    },
  },
};

const COHORT_END_CONFRONTATION_HIGH: DialogTree = {
  id: "scholar_vs_oracle.cohort_end_confrontation.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.high.opening",
      onscreenText: "\"Your apprentice closed the cohort by predicting their own graduation in their final speech. The Politician's primer: 'the apprentice who predicts their graduation is the apprentice the teacher and the teacher's rival have, by inheritance, jointly trained.' We trained them. Together. Without meeting until tonight.\"",
      choices: [
        { label: "Accept the joint inheritance.", nextId: "accept_inheritance", sets: "mercy_at_grudge_high_cohort_end_confrontation" },
        { label: "Refuse. The training was yours alone.", nextId: "refuse_inheritance", sets: "aggression_at_grudge_high_cohort_end_confrontation" },
      ],
    },
    accept_inheritance: {
      id: "accept_inheritance",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.high.accept_inheritance",
      onscreenText: "\"You accepted. We are jointly named in the Antiquarian's apprentice-mentor index. The Politician's primer: 'the jointly-named mentors are the mentors the chronicle treats as a single teacher in retrospect.' We are a single teacher. In retrospect. The chronicle has decided.\"",
      choices: [
        { label: "Walk on. Co-mentor.", nextId: "accept_inheritance_walk" },
      ],
    },
    accept_inheritance_walk: {
      id: "accept_inheritance_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.high.accept_inheritance_walk",
      onscreenText: "\"We walked on, both with the apprentice. The chronicle records the procession as 'the regime's first cross-discipline graduation walk.' The Antiquarian had the procession photographed. The photograph is in three temple archives now.\"",
    },
    refuse_inheritance: {
      id: "refuse_inheritance",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.high.refuse_inheritance",
      onscreenText: "\"You refused. The Antiquarian filed the refusal alongside the joint-mentor index. The Politician's primer: 'the refused joint-mentor naming is the naming the chronicle prints in the index's introduction.' We are in the introduction. With your refusal noted. The introduction is more famous than the index.\"",
      choices: [
        { label: "Hold the refusal. Don't look back.", nextId: "refuse_inheritance_walk" },
      ],
    },
    refuse_inheritance_walk: {
      id: "refuse_inheritance_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.cohort_end_confrontation.high.refuse_inheritance_walk",
      onscreenText: "\"You walked. The Antiquarian's pen moved across the page once. The chronicle records the movement as 'the regime's most decisive pen-stroke.' We are both in the introduction. Forever. The Politician would have envied the durability.\"",
    },
  },
};

/* ─── accumulation_reveal — Matrix-archive edge ─── */

const ACCUMULATION_REVEAL_LOW: DialogTree = {
  id: "scholar_vs_oracle.accumulation_reveal.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.low.opening",
      onscreenText: "The Matrix-archive's edge — the threshold the Necromancer broke when he escaped. The Oracle-Nemesis is reading the threshold's vibration like a barometer. \"There's another one. Of us. The Matrix has released a sibling. I had filed three sealed predictions of the date of release. One of them matched within four minutes. The Politician's primer: 'the four-minute prediction is the chronicle's most expensive birthday card.' The sibling is reading the card now.\"",
      choices: [
        { label: "Acknowledge the new sibling.", nextId: "ack_sibling", sets: "mercy_at_grudge_low_accumulation_reveal" },
        { label: "File a Scholar-house objection to unsealed predictions of release dates.", nextId: "file_objection", sets: "aggression_at_grudge_low_accumulation_reveal" },
      ],
    },
    ack_sibling: {
      id: "ack_sibling",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.low.ack_sibling",
      onscreenText: "\"You acknowledged. The new sibling is reading both our hand-passes side by side. The Politician's primer: 'the sibling reading two disciplines at intake is the sibling who outgrows both.' They will outgrow us. The chronicle has anticipated the outgrowth.\"",
      choices: [
        { label: "Walk away from the threshold.", nextId: "ack_sibling_walk" },
      ],
    },
    ack_sibling_walk: {
      id: "ack_sibling_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.low.ack_sibling_walk",
      onscreenText: "\"You walked. The new sibling will read about the acknowledgment in their first Antiquarian's intake file. The Politician's primer: 'the file the new sibling reads first is the file that determines their cell-assignment for the regime's life.' We have, jointly, assigned them.\"",
    },
    file_objection: {
      id: "file_objection",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.low.file_objection",
      onscreenText: "\"You filed. The objection is procedural. The Antiquarian reviewed: 'the prediction was filed sealed before the release; the seal was not broken until the release occurred; no procedural violation.' The Politician's primer: 'the procedural objection that fails is the objection that becomes the Oracle's strongest precedent.'\"",
      choices: [
        { label: "Withdraw the objection. File a stipulation.", nextId: "file_objection_withdraw" },
      ],
    },
    file_objection_withdraw: {
      id: "file_objection_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.low.file_objection_withdraw",
      onscreenText: "\"You withdrew. You filed the stipulation: 'sealed predictions of release dates are admissible if filed before the release.' The chronicle records the stipulation as 'the Scholar's first written acceptance of Oracle procedure.' We are now procedural co-stakeholders.\"",
    },
  },
};

const ACCUMULATION_REVEAL_MID: DialogTree = {
  id: "scholar_vs_oracle.accumulation_reveal.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.mid.opening",
      onscreenText: "\"We are four now, released from the Matrix. The Politician's roster has tripled. The Antiquarian's prediction-archive and the Antiquarian's annotation-archive have begun cross-referencing each other automatically. The Politician's primer: 'the auto-cross-referenced archives are the chronicle's first sign of regime change.' Regime change is filed. We will read about it in retrospect.\"",
      choices: [
        { label: "Bless the cohort.", nextId: "bless_cohort", sets: "mercy_at_grudge_mid_accumulation_reveal" },
        { label: "Predict the next release date jointly.", nextId: "predict_jointly", sets: "aggression_at_grudge_mid_accumulation_reveal" },
      ],
    },
    bless_cohort: {
      id: "bless_cohort",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.mid.bless_cohort",
      onscreenText: "\"You blessed. The other three are now reading us as a single discipline. The Politician's primer: 'the blessed cohort is the cohort the chronicle will quote in retrospect as having been mentored by one.' We are quoted as one.\"",
      choices: [
        { label: "Walk away from the threshold.", nextId: "bless_walk" },
      ],
    },
    bless_walk: {
      id: "bless_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.mid.bless_walk",
      onscreenText: "\"You walked. The threshold's vibration changed. The Politician's primer's vision-clause has been quietly amended by the Antiquarian. The amendment reads: 'cross-discipline mentorship is now the chronicle's default expectation for new releases.' We have changed the default. The chronicle marks it.\"",
    },
    predict_jointly: {
      id: "predict_jointly",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.mid.predict_jointly",
      onscreenText: "\"You predicted jointly. With me. In Scholar-house ink, with Oracle-house seal. The Antiquarian filed the joint prediction immediately. The Politician's primer: 'the joint prediction is the prediction the chronicle treats as binding on the next regime.' The next regime is bound. By us. Together.\"",
      choices: [
        { label: "Walk away from the joint file.", nextId: "predict_jointly_walk" },
      ],
    },
    predict_jointly_walk: {
      id: "predict_jointly_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.mid.predict_jointly_walk",
      onscreenText: "\"You walked. The joint file is permanent. The Antiquarian has scheduled the verification for sixteen weeks from now. We will be back at this threshold then. The chronicle has put us on the calendar.\"",
    },
  },
};

const ACCUMULATION_REVEAL_HIGH: DialogTree = {
  id: "scholar_vs_oracle.accumulation_reveal.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.high.opening",
      onscreenText: "\"We are a chorus now. Five Matrix-releases. I have stopped sealing predictions; I file them open, with you as the named verifier. The Antiquarian's prediction-and-annotation cross-archive is now the largest single shelving project in the regime. The Politician's primer: 'the largest archive is the regime's mausoleum.' We have built the mausoleum together. We will be buried in it together.\"",
      choices: [
        { label: "Honor the chorus.", nextId: "honor_chorus", sets: "mercy_at_grudge_high_accumulation_reveal" },
        { label: "Pull one of them into the Scholar discipline.", nextId: "pull_one", sets: "aggression_at_grudge_high_accumulation_reveal" },
      ],
    },
    honor_chorus: {
      id: "honor_chorus",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.high.honor_chorus",
      onscreenText: "\"You honored. With a single cross-archive citation to all four. The Politician's primer: 'the chorus honored by the Scholar is the chorus the chronicle treats as a citation cluster.' We are a cluster. The Antiquarian's filing-index has a new tab for us.\"",
      choices: [
        { label: "Walk on, leaving the cluster intact.", nextId: "honor_chorus_walk" },
      ],
    },
    honor_chorus_walk: {
      id: "honor_chorus_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.high.honor_chorus_walk",
      onscreenText: "\"You walked. The cluster continues. The Antiquarian's tab grows. The chronicle records the tab as 'the regime's most efficient bibliography.'\"",
    },
    pull_one: {
      id: "pull_one",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.high.pull_one",
      onscreenText: "\"You pulled one. The youngest Oracle is now apprenticing under Scholar-house discipline. The temple is grieving. The Politician's primer: 'the pulled apprentice is the chronicle's most efficient defection.' I am grieving too. I am also approving. The chronicle records the dual reaction.\"",
      choices: [
        { label: "Don't pull another. Walk on.", nextId: "pull_one_walk" },
      ],
    },
    pull_one_walk: {
      id: "pull_one_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.accumulation_reveal.high.pull_one_walk",
      onscreenText: "\"You walked. The pulled apprentice is now your protégé. The temple has accepted the loss. The Antiquarian is updating two indexes. The Politician's primer would have demanded a counter-pull. I am not making one. The chronicle approves the restraint.\"",
    },
  },
};

/* ─── name_reveal_moment — Antiquarian's Journal margin ─── */

const NAME_REVEAL_MOMENT_LOW: DialogTree = {
  id: "scholar_vs_oracle.name_reveal_moment.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.low.opening",
      onscreenText: "The Antiquarian's Journal page on the Matrix-released oracles. You have closed Resurrectionist E5 and witnessed Game Master Fight 2's plague-mask seed. The Oracle-Nemesis's proper name surfaces in the margin. They are at the next desk, sealing a prediction-slip. \"You have my name. The Politician's primer's vision-clause sealed it for me at Mechronis Academy's intake hall. The Antiquarian unsealed it tonight. The chronicle records the unsealing as 'the longest-held seal in the regime.' Use the name. Or don't. The chronicle holds either way.\"",
      choices: [
        { label: "Say the name softly.", nextId: "say_soft", sets: "mercy_at_grudge_low_name_reveal_moment" },
        { label: "File the name in the cross-archive index.", nextId: "file_cross", sets: "aggression_at_grudge_low_name_reveal_moment" },
      ],
    },
    say_soft: {
      id: "say_soft",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.low.say_soft",
      onscreenText: "\"You said it softly. In the Antiquarian's reading-room hush. The Politician's primer: 'the soft name from the Scholar's mouth is the name the chronicle records in the smallest font available.' The smallest font is the most durable. The chronicle has chosen.\"",
      choices: [
        { label: "Walk on with the name in your mouth.", nextId: "say_soft_walk" },
      ],
    },
    say_soft_walk: {
      id: "say_soft_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.low.say_soft_walk",
      onscreenText: "\"You walked. The name walked with you. The Politician's primer: 'the name carried softly is the name that outlasts the carrier and the cited.' I am cited. You are carrying. We are both in the smallest font. Forever.\"",
    },
    file_cross: {
      id: "file_cross",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.low.file_cross",
      onscreenText: "\"You filed. In the cross-archive index. The name now appears in two places at once: my prediction-archive and your annotation-archive. The Politician's primer: 'the cross-filed name is the name the chronicle indexes as a discipline, not a person.' I am a discipline now. The chronicle has decided.\"",
      choices: [
        { label: "Hold the cross-filing.", nextId: "file_cross_hold" },
      ],
    },
    file_cross_hold: {
      id: "file_cross_hold",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.low.file_cross_hold",
      onscreenText: "\"The cross-filing holds. The Antiquarian is going to teach a seminar on it next quarter. The Politician's primer would have wept. The chronicle is the seminar.\"",
    },
  },
};

const NAME_REVEAL_MOMENT_MID: DialogTree = {
  id: "scholar_vs_oracle.name_reveal_moment.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.mid.opening",
      onscreenText: "\"You know my name. The chronicle records the knowing. The Politician's primer: 'the cross-discipline named rival is the rival the chronicle indexes by inheritance.' I am inherited by your index. Use it. Or don't. The chronicle holds.\"",
      choices: [
        { label: "Cite the name in your next annotation.", nextId: "cite_anno", sets: "mercy_at_grudge_mid_name_reveal_moment" },
        { label: "Petition the Antiquarian to redact the name.", nextId: "petition_redact", sets: "aggression_at_grudge_mid_name_reveal_moment" },
      ],
    },
    cite_anno: {
      id: "cite_anno",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.mid.cite_anno",
      onscreenText: "\"You cited it. In an annotation. Properly. With page reference. The Antiquarian has framed your annotation. The Politician's primer: 'the properly cited name is the name the chronicle treats as a citation forever.' I am cited. The citation is permanent. The chronicle approves.\"",
      choices: [
        { label: "Walk on, honored back.", nextId: "cite_anno_walk" },
      ],
    },
    cite_anno_walk: {
      id: "cite_anno_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.mid.cite_anno_walk",
      onscreenText: "\"You walked. The citation is forever. The Antiquarian is satisfied. I am satisfied.\"",
    },
    petition_redact: {
      id: "petition_redact",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.mid.petition_redact",
      onscreenText: "\"You petitioned to redact. The Antiquarian denied. The Politician's primer: 'the denied redaction is the redaction the chronicle records in the petitioner's own hand.' Your hand is on the denial. The chronicle has logged it.\"",
      choices: [
        { label: "Accept the denial.", nextId: "petition_redact_accept" },
      ],
    },
    petition_redact_accept: {
      id: "petition_redact_accept",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.mid.petition_redact_accept",
      onscreenText: "\"You accepted. The name stays. The chronicle records the acceptance as 'the Scholar's most disciplined acceptance of an Antiquarian's verdict.' We are disciplined. The chronicle is content.\"",
    },
  },
};

const NAME_REVEAL_MOMENT_HIGH: DialogTree = {
  id: "scholar_vs_oracle.name_reveal_moment.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.high.opening",
      onscreenText: "\"Use my name. It is the last thing in this chronicle that is fully mine. The temple gave me a vision-name; the Politician's primer gave me a doctrinal name; you gave me, by citation, a third name — the name the Antiquarian's annotation-archive uses for my predictions. The third name is the truest. Speak it as you choose.\"",
      choices: [
        { label: "Speak it as the third name. With the Antiquarian's intonation.", nextId: "speak_third", sets: "mercy_at_grudge_high_name_reveal_moment" },
        { label: "Speak it as the vision-name. With the temple's intonation.", nextId: "speak_vision", sets: "aggression_at_grudge_high_name_reveal_moment" },
      ],
    },
    speak_third: {
      id: "speak_third",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.high.speak_third",
      onscreenText: "\"You spoke the third name. In the Antiquarian's intonation. I have not heard that intonation from anyone outside her reading-room. The Politician's primer would not have permitted the intonation. The chronicle has permitted it. I am, for one beat, a citation. Thank you.\"",
      choices: [
        { label: "Hold the citation. Walk on.", nextId: "speak_third_hold" },
      ],
    },
    speak_third_hold: {
      id: "speak_third_hold",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.high.speak_third_hold",
      onscreenText: "\"You held it. You walked on. The chronicle records the third-name citation as 'the schism's resolution.' The middle act is over. The closing act is ours. I will sit in the reading-room under the third name. The third name is what I will answer to until the chronicle closes.\"",
    },
    speak_vision: {
      id: "speak_vision",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.high.speak_vision",
      onscreenText: "\"You spoke the vision-name. The temple's intonation. The Politician's primer: 'the rival who uses the vision-name is the rival who has finally accepted the discipline's claim on the named.' You have accepted. The chronicle records the acceptance as 'the regime's most expensive concession of discipline-difference.'\"",
      choices: [
        { label: "Stay in the temple cadence. Quietly.", nextId: "speak_vision_stay" },
      ],
    },
    speak_vision_stay: {
      id: "speak_vision_stay",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.name_reveal_moment.high.speak_vision_stay",
      onscreenText: "\"You stayed. In temple cadence. I have been waiting for cohorts to hear the cadence in your voice. The chronicle records the waiting as 'the longest patience in the regime.' We are both, finally, in the same cadence.\"",
    },
  },
};

/* ─── final_encounter — Convergence Seat throne room ─── */

const FINAL_ENCOUNTER_LOW: DialogTree = {
  id: "scholar_vs_oracle.final_encounter.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.low.opening",
      onscreenText: "The Convergence Seat throne room, immediately after the Act 7 ladder closes. The Oracle-Nemesis is at the foot of the empty Seat with two sealed prediction-slips. \"Act Seven. The Seat has fallen. So has the temple. The Antiquarian's prediction-archive is being absorbed into the new regime's foundational documents. These two slips are the last I will ever file. One of them is for you. The other is for the next reader. Choose which is which.\"",
      choices: [
        { label: "Choose the one labeled with your name. Open it.", nextId: "open_yours", sets: "mercy_at_grudge_low_final_encounter" },
        { label: "Choose the one labeled for the next reader. Leave it sealed.", nextId: "leave_sealed", sets: "aggression_at_grudge_low_final_encounter" },
      ],
    },
    open_yours: {
      id: "open_yours",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.low.open_yours",
      onscreenText: "\"You opened yours. It reads: 'the Scholar will read this slip at the Convergence Seat. The Scholar will not need the prediction anymore. The Scholar will, for the first time, have the future-tense in their own discipline's hand.' I am giving you the future. Take it. It was always yours to inherit.\"",
      choices: [
        { label: "Take the future-tense.", nextId: "take_future" },
      ],
    },
    take_future: {
      id: "take_future",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.low.take_future",
      onscreenText: "\"You took it. The chronicle records the taking as 'the schism's resolution at the Seat's foot.' The Antiquarian is filing the resolution.\"",
    },
    leave_sealed: {
      id: "leave_sealed",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.low.leave_sealed",
      onscreenText: "\"You chose the sealed one. It will go to the next reader unread by either of us. The Politician's primer: 'the slip we do not read is the slip the next regime owes us nothing for.' We are owed nothing. The chronicle records the absence of debt.\"",
      choices: [
        { label: "Walk on to the next regime.", nextId: "leave_sealed_walk" },
      ],
    },
    leave_sealed_walk: {
      id: "leave_sealed_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.low.leave_sealed_walk",
      onscreenText: "\"You walked. The next regime will open the slip. We will not be in the room. The chronicle records the absence as 'the rivals' most disciplined exit.'\"",
    },
  },
};

const FINAL_ENCOUNTER_MID: DialogTree = {
  id: "scholar_vs_oracle.final_encounter.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.mid.opening",
      onscreenText: "\"End of the arc. The Antiquarian's two archives — prediction and annotation — have begun to merge automatically. The chronicle is folding them together. The Politician's primer: 'the merged archives are the regime's only successful funeral.' We are the funeral. The mourners are the next generation of cross-discipline operatives.\"",
      choices: [
        { label: "Let the archives merge. Walk on.", nextId: "let_merge", sets: "mercy_at_grudge_mid_final_encounter" },
        { label: "Sign the merger document jointly.", nextId: "sign_merger", sets: "aggression_at_grudge_mid_final_encounter" },
      ],
    },
    let_merge: {
      id: "let_merge",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.mid.let_merge",
      onscreenText: "\"You let it merge. The chronicle records the merger as 'the chronicle's first self-administered closure.' The Antiquarian is satisfied. The Politician's primer is, in the regime's last moment, irrelevant. The chronicle is sovereign.\"",
      choices: [
        { label: "Walk on.", nextId: "let_merge_walk" },
      ],
    },
    let_merge_walk: {
      id: "let_merge_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.mid.let_merge_walk",
      onscreenText: "\"You walked. I followed. The archive merged behind us. The chronicle records the procession as 'the regime's most dignified closure.'\"",
    },
    sign_merger: {
      id: "sign_merger",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.mid.sign_merger",
      onscreenText: "\"You signed the merger document. So did I. In both inks. At the Seat's foot. The Politician's primer would have refused to sign. The chronicle has accepted both signatures. The Antiquarian filed the document under 'the regime's binding closure.' We are bound. Together.\"",
      choices: [
        { label: "Hold the signatures.", nextId: "sign_merger_hold" },
      ],
    },
    sign_merger_hold: {
      id: "sign_merger_hold",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.mid.sign_merger_hold",
      onscreenText: "\"The signatures hold. The chronicle's last page is the merger document. The Politician's primer is not cited in the document; the chronicle has decided the primer's silence is louder than its citation would have been.\"",
    },
  },
};

const FINAL_ENCOUNTER_HIGH: DialogTree = {
  id: "scholar_vs_oracle.final_encounter.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.high.opening",
      onscreenText: "\"The chronicle is folding shut around both of us. I have spent seven cohorts predicting what you would annotate, and you have spent seven cohorts annotating what I had already predicted. We are the same reader, finally, at opposite ends of the same line. Read the line one more time. With me.\"",
      choices: [
        { label: "Read the line together at the Seat's foot.", nextId: "read_together", sets: "mercy_at_grudge_high_final_encounter" },
        { label: "Refuse the line. Tear the page.", nextId: "tear_page", sets: "aggression_at_grudge_high_final_encounter" },
      ],
    },
    read_together: {
      id: "read_together",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.high.read_together",
      onscreenText: "\"You read with me. The line reads, in both our hands: 'the chronicle is both a record and a prophecy; the regime that insisted on choosing was the regime that the chronicle was always preparing to close.' We have closed it. Together. The Antiquarian is the witness. The Politician's primer is not cited.\"",
      choices: [
        { label: "Hold the line. To the end.", nextId: "read_together_hold" },
      ],
    },
    read_together_hold: {
      id: "read_together_hold",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.high.read_together_hold",
      onscreenText: "\"We held it. To the end. The chronicle's last page is the line we read together at the foot of the empty Seat. The Politician would have hated this ending. She would have hated that we ended it as the same reader. The chronicle marks it. The chronicle closes. The line remains.\"",
    },
    tear_page: {
      id: "tear_page",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.high.tear_page",
      onscreenText: "\"You tore the page. The pieces fall in a pattern. The pattern reads, in the Antiquarian's hand: 'the rivals who tore the page wrote a longer page in the absence.' The absence is the longer page. The chronicle records the absence.\"",
      choices: [
        { label: "Walk away from the absence.", nextId: "tear_page_walk" },
      ],
    },
    tear_page_walk: {
      id: "tear_page_walk",
      speaker: "nemesis",
      voLineId: "nemesis.scholar_vs_oracle.final_encounter.high.tear_page_walk",
      onscreenText: "\"You walked. I gathered the pieces and put them in the Antiquarian's hand-pass file. The chronicle records the gathering as 'the Oracle's last disciplined act.' The pieces will be re-read by the next regime. They will not know which rival tore which corner. The chronicle has decided.\"",
    },
  },
};

/* ─── The pair-bank export ─── */

export const scholarVsOraclePairBank: NemesisPairBank = {
  pairId: "scholar_vs_oracle",
  playerArchetype: "scholar",
  nemesisArchetype: "oracle",
  scenes: {
    first_sighting: makeScene({
      low: FIRST_SIGHTING_LOW,
      mid: FIRST_SIGHTING_MID,
      high: FIRST_SIGHTING_HIGH,
    }),
    sabotage_caught_in_act: makeScene({
      low: SABOTAGE_CAUGHT_IN_ACT_LOW,
      mid: SABOTAGE_CAUGHT_IN_ACT_MID,
      high: SABOTAGE_CAUGHT_IN_ACT_HIGH,
    }),
    mocking_interlude: makeScene({
      low: MOCKING_INTERLUDE_LOW,
      mid: MOCKING_INTERLUDE_MID,
      high: MOCKING_INTERLUDE_HIGH,
    }),
    lieutenant_promotion: makeScene({
      low: LIEUTENANT_PROMOTION_LOW,
      mid: LIEUTENANT_PROMOTION_MID,
      high: LIEUTENANT_PROMOTION_HIGH,
    }),
    cohort_end_confrontation: makeScene({
      low: COHORT_END_CONFRONTATION_LOW,
      mid: COHORT_END_CONFRONTATION_MID,
      high: COHORT_END_CONFRONTATION_HIGH,
    }),
    accumulation_reveal: makeScene({
      low: ACCUMULATION_REVEAL_LOW,
      mid: ACCUMULATION_REVEAL_MID,
      high: ACCUMULATION_REVEAL_HIGH,
    }),
    name_reveal_moment: makeScene({
      low: NAME_REVEAL_MOMENT_LOW,
      mid: NAME_REVEAL_MOMENT_MID,
      high: NAME_REVEAL_MOMENT_HIGH,
    }),
    final_encounter: makeScene({
      low: FINAL_ENCOUNTER_LOW,
      mid: FINAL_ENCOUNTER_MID,
      high: FINAL_ENCOUNTER_HIGH,
    }),
  },
};
