/* ═══════════════════════════════════════════════════════
   HERETIC-PLAYER vs. ZEALOT-NEMESIS — Phase K Wave 7A (canon-deepened)

   The rival-faiths axis. They quote the same Politician's
   primer back at each other and arrive at opposite
   doctrines. The Zealot-Nemesis is a Hierarchy doctrine-
   enforcer — files heresy points-of-order at the Hub,
   audits cell-coordinators for ideological drift, signs
   their name to every position they take. The Heretic-
   player is an Insurgency-leaning reformer — smuggles
   forbidden Antiquarian's Journal excerpts into Hub
   speeches, broadcasts on PAC News that the cause was
   right but its instrument was wrong.

   Both were trained at Project Sorrow's intake. Both
   passed Mechronis Academy's doctrine examinations.
   Both can cite the Politician's primer from memory.
   The chronicle records them as 'the cleanest argument
   in the regime.'

   Surfaces:
     • first_sighting — Hub vote-floor, opposing sermons
     • sabotage_caught_in_act — Antiquarian's reading
       room (Heretic smuggling forbidden excerpts; Zealot
       is the Hierarchy auditor)
     • mocking_interlude — PAC News green-room before a
       broadcast debate
     • lieutenant_promotion — Mechronis Academy doctrine-
       enforcement coordinator ceremony
     • cohort_end_confrontation — Cohort hall after the
       Heretic's apprentice graduates or falls
     • accumulation_reveal — Hierarchy intake bulletin
     • name_reveal_moment — Antiquarian's Journal margin
     • final_encounter — Convergence Seat throne room
   ═══════════════════════════════════════════════════════ */

import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

/* ─── first_sighting — Hub vote-floor, opposing sermons ─── */

const FIRST_SIGHTING_LOW: DialogTree = {
  id: "heretic_vs_zealot.first_sighting.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.low.opening",
      onscreenText: "The Hub vote-floor, mid-session. You have just finished a sermon arguing the Politician's primer was a confession, not a doctrine. The Zealot-Nemesis rises from the orthodox bench and signs the gallery log before speaking. \"The chamber will hear a Point of Order. The orator has cited a confession as if it were doctrine. The orator has it backward — and I have signed my name to that observation, which is what doctrine requires.\"",
      choices: [
        { label: "Concede the floor with grace.", nextId: "concede", sets: "mercy_at_grudge_low_first_sighting" },
        { label: "Cite the same primer back at them.", nextId: "cite_back", sets: "aggression_at_grudge_low_first_sighting" },
      ],
    },
    concede: {
      id: "concede",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.low.concede",
      onscreenText: "\"The orator yields. The Politician's primer: 'the yielded floor is the floor that the orthodox bench remembers.' The bench will remember. I will remember. The chamber will be invited to reconsider your sermon in next session's docket.\"",
      choices: [
        { label: "Yield without filing a counter-motion.", nextId: "concede_no_counter" },
      ],
    },
    concede_no_counter: {
      id: "concede_no_counter",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.low.concede_no_counter",
      onscreenText: "\"No counter-motion. The chronicle records the absence of a counter-motion as 'the heretic who let the orthodoxy file the rebuttal alone.' I will file it alone. I will sign it alone. The Politician's primer was clear about the value of an unanswered orthodoxy.\"",
    },
    cite_back: {
      id: "cite_back",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.low.cite_back",
      onscreenText: "\"You cited the primer. Section seven, the consent-framework inversion clause. You read it as a confession. I read it as a doctrine. The Politician's primer: 'the same clause read by two operatives is the chronicle's longest argument.' This argument has just begun.\"",
      choices: [
        { label: "Hold the floor. Cite section twelve.", nextId: "cite_back_hold" },
      ],
    },
    cite_back_hold: {
      id: "cite_back_hold",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.low.cite_back_hold",
      onscreenText: "\"Section twelve. The ledger-quote provision. You read it as a procedural exception. I read it as the doctrine's load-bearing wall. The chamber is divided. The Politician's primer would have called this 'the schism that proves the doctrine was always doctrine.' I am writing the proof now.\"",
    },
  },
};

const FIRST_SIGHTING_MID: DialogTree = {
  id: "heretic_vs_zealot.first_sighting.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.mid.opening",
      onscreenText: "\"Three sessions of opposing sermons. The Hub stenographer has begun cross-indexing our citations against each other. The Hierarchy's analyst department published the cross-index as a teaching document at Mechronis Academy this morning. We are now a syllabus, you and I. The Politician would have endorsed the curriculum.\"",
      choices: [
        { label: "Honor the cross-index.", nextId: "honor_index", sets: "mercy_at_grudge_mid_first_sighting" },
        { label: "Petition Mechronis to withdraw it.", nextId: "petition", sets: "aggression_at_grudge_mid_first_sighting" },
      ],
    },
    honor_index: {
      id: "honor_index",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.mid.honor_index",
      onscreenText: "\"You honored it. With a citation in your next sermon to the cross-index itself — heretic-style, by acknowledging the orthodoxy's reading. The Politician's primer: 'the rival who cites the rival is the rival who has joined the doctrine.' We are now the same doctrine, read aloud from opposite benches.\"",
      choices: [
        { label: "Acknowledge the union with a half-bow.", nextId: "honor_index_bow" },
      ],
    },
    honor_index_bow: {
      id: "honor_index_bow",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.mid.honor_index_bow",
      onscreenText: "\"The half-bow lands. The orthodox bench is shocked. I return the half-bow. The chamber records both half-bows in the official transcript. The Politician's primer: 'the half-bow exchanged is the schism's repair.' We are repaired. The Hierarchy will not approve. The Insurgency will not approve. The chronicle approves.\"",
    },
    petition: {
      id: "petition",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.mid.petition",
      onscreenText: "\"Your petition is denied. The Politician's primer: 'the petition that argues against the syllabus is the petition that becomes the syllabus's next chapter.' Mechronis has added your petition to the reading list. We are now a two-volume textbook.\"",
      choices: [
        { label: "Withdraw the petition before publication.", nextId: "petition_withdraw" },
      ],
    },
    petition_withdraw: {
      id: "petition_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.mid.petition_withdraw",
      onscreenText: "\"You withdrew. The chronicle records the withdrawal as 'the heretic who corrected their own footnote before publication.' The orthodox bench will quote the correction in next session's opening prayer. I will compose the prayer tonight.\"",
    },
  },
};

const FIRST_SIGHTING_HIGH: DialogTree = {
  id: "heretic_vs_zealot.first_sighting.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.high.opening",
      onscreenText: "\"I have stopped filing Points of Order against your sermons. The orthodox bench is furious. I sit through your readings now without responding. The Politician's primer: 'the orthodox who falls silent is the orthodox who is being converted by the heretic, or who is preparing the final excommunication.' The Hierarchy is betting on the excommunication. The chronicle is betting otherwise.\"",
      choices: [
        { label: "Offer them the floor for a full session.", nextId: "offer_floor", sets: "mercy_at_grudge_high_first_sighting" },
        { label: "Push for the excommunication.", nextId: "push_excomm", sets: "aggression_at_grudge_high_first_sighting" },
      ],
    },
    offer_floor: {
      id: "offer_floor",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.high.offer_floor",
      onscreenText: "\"You offered me the floor. The full session. To say my own doctrine, in my own voice, without your interruption. The Politician's primer: 'the floor offered by the heretic is the floor that proves the heretic was never a heretic.' I will use the session. I will use it carefully.\"",
      choices: [
        { label: "Sit in the gallery for the whole session.", nextId: "offer_floor_sit" },
      ],
    },
    offer_floor_sit: {
      id: "offer_floor_sit",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.high.offer_floor_sit",
      onscreenText: "\"You sat for the whole session. You did not heckle. You did not file a Point of Order. The chronicle records the sitting as 'the longest audit ever performed by a heretic on an orthodox sermon.' I am audited. The orthodoxy is audited. The Politician's primer has been audited. We are all, finally, in the chronicle together.\"",
    },
    push_excomm: {
      id: "push_excomm",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.high.push_excomm",
      onscreenText: "\"You pushed for the excommunication. From the heretic bench. Against the orthodox operative. The Politician's primer: 'the heretic who files the excommunication is the heretic who has admitted the orthodox was right about jurisdiction.' I will accept the excommunication. I will not contest. You have won the procedure. You have lost the doctrine.\"",
      choices: [
        { label: "Take the doctrinal win in silence.", nextId: "push_excomm_take" },
      ],
    },
    push_excomm_take: {
      id: "push_excomm_take",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.first_sighting.high.push_excomm_take",
      onscreenText: "\"You took the doctrine in silence. The chronicle records the silence as 'the heretic's only true conversion.' I am excommunicated. The Hierarchy has no use for me. I will operate alone, as I always should have. Thank you. The Politician would have called this 'the chamber's longest gift.'\"",
    },
  },
};

/* ─── sabotage_caught_in_act — Antiquarian's reading room ─── */

const SABOTAGE_CAUGHT_IN_ACT_LOW: DialogTree = {
  id: "heretic_vs_zealot.sabotage_caught_in_act.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.low.opening",
      onscreenText: "The Antiquarian's reading room, after hours. You have an Insurgency-marked excerpt of the Politician's primer hidden under your coat — a forbidden chapter the Hierarchy's index has redacted. The Zealot-Nemesis is at the cataloguer's desk, signing a Hierarchy audit. \"You are removing material from a chained reading room. The Hierarchy considers this a heresy offense. I am signing the audit now. I will give you to the end of this paragraph to put the excerpt back.\"",
      choices: [
        { label: "Put the excerpt back. Apologize.", nextId: "put_back", sets: "mercy_at_grudge_low_sabotage_caught_in_act" },
        { label: "Read the forbidden chapter aloud.", nextId: "read_aloud", sets: "aggression_at_grudge_low_sabotage_caught_in_act" },
      ],
    },
    put_back: {
      id: "put_back",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.low.put_back",
      onscreenText: "\"The excerpt is back. The audit will record 'excerpt recovered before completion of removal.' That phrase is the Hierarchy's softest verdict. The Politician's primer: 'the recovered excerpt is the recovered heretic.' I am not yet finished signing my name. You have time to walk out cleanly.\"",
      choices: [
        { label: "Walk out cleanly.", nextId: "put_back_walk" },
      ],
    },
    put_back_walk: {
      id: "put_back_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.low.put_back_walk",
      onscreenText: "\"You walked. The audit's final line, in my hand: 'no enforcement action recommended.' The Politician's primer would have called this 'the orthodoxy's most expensive mercy.' I have spent the mercy. The Hierarchy will charge it to my coordinator-track quota.\"",
    },
    read_aloud: {
      id: "read_aloud",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.low.read_aloud",
      onscreenText: "\"You read it aloud. In a chained reading room. The Antiquarian's wards triggered. Two Adjudicator clerks are now en route. The Politician's primer: 'the chapter read aloud in a chained room is the chapter that converts the next reader.' You have converted the wards. The wards are recording. I am still signing.\"",
      choices: [
        { label: "Keep reading until the clerks arrive.", nextId: "read_aloud_keep" },
      ],
    },
    read_aloud_keep: {
      id: "read_aloud_keep",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.low.read_aloud_keep",
      onscreenText: "\"The clerks arrived. You finished the chapter. The clerks are now reading the audit. The audit is now reading itself. The chronicle records the recursion as 'the orthodox audit's most converted moment.' The Hierarchy will not understand the audit. I will explain it to them in writing. The writing will not help.\"",
    },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_MID: DialogTree = {
  id: "heretic_vs_zealot.sabotage_caught_in_act.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.mid.opening",
      onscreenText: "\"You are back in the chained reading room. Same excerpt. Same coat. The Politician's primer would have said: 'the heretic who returns to the scene is the heretic who has joined the orthodoxy's rhythm.' I am here on schedule. So are you. We are doctrine's regulars.\"",
      choices: [
        { label: "Trade excerpts. Insurgency for orthodoxy.", nextId: "trade", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" },
        { label: "Burn the chained ledger.", nextId: "burn_ledger", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" },
      ],
    },
    trade: {
      id: "trade",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.mid.trade",
      onscreenText: "\"You traded. I have your Insurgency-marked excerpt now, in exchange for the orthodox commentary that the Hierarchy never lets out of the audit room. The chronicle records the trade as 'the schism's first treaty.' The Politician would have signed it. The Politician would have cited the signing in next year's primer.\"",
      choices: [
        { label: "Walk out with the orthodox commentary.", nextId: "trade_walk" },
      ],
    },
    trade_walk: {
      id: "trade_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.mid.trade_walk",
      onscreenText: "\"You walked. I keep the heretic excerpt. The orthodoxy now has the Insurgency's reading. The Insurgency now has the orthodoxy's. The Politician's primer: 'the traded doctrine is the doctrine that both sides will read in their next sermon.' We will both read each other tomorrow.\"",
    },
    burn_ledger: {
      id: "burn_ledger",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.mid.burn_ledger",
      onscreenText: "\"You burned the chained ledger. In a chained reading room. The Antiquarian's wards triggered, then fell silent — they cannot scream when the chain itself is gone. The Politician's primer: 'the ledger burned in chains is the schism that the chronicle cannot file.' The chronicle is unfilable now. We are both, by procedure, indistinguishable.\"",
      choices: [
        { label: "Walk out into the unfilable.", nextId: "burn_ledger_walk" },
      ],
    },
    burn_ledger_walk: {
      id: "burn_ledger_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.mid.burn_ledger_walk",
      onscreenText: "\"You walked into the unfilable. The Adjudicator's clerks arrived to find the audit room without an audit. The Politician's primer: 'the unfilable is the doctrine that has no opposition.' We are now the same doctrine. We are unfilable together. The chronicle marks us as 'consolidated.'\"",
    },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_HIGH: DialogTree = {
  id: "heretic_vs_zealot.sabotage_caught_in_act.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.high.opening",
      onscreenText: "\"I am in the reading room without an audit. I am here as a reader, not an auditor. I have the same forbidden excerpt under my coat that you have under yours. The Politician's primer: 'the orthodox who carries the heretic excerpt is the orthodox who has finally read the doctrine.' I have finally read it. I do not like what I read.\"",
      choices: [
        { label: "Read together at the same desk.", nextId: "read_together", sets: "mercy_at_grudge_high_sabotage_caught_in_act" },
        { label: "Take their copy as evidence.", nextId: "take_evidence", sets: "aggression_at_grudge_high_sabotage_caught_in_act" },
      ],
    },
    read_together: {
      id: "read_together",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.high.read_together",
      onscreenText: "\"We are reading together. At the same desk. For the first time, no one is auditing the other. The Politician's primer: 'the rivals who read the same forbidden chapter together are the rivals who have stopped being rivals.' We have stopped being rivals. We are now the same scholar.\"",
      choices: [
        { label: "Annotate the margin together.", nextId: "read_together_annotate" },
      ],
    },
    read_together_annotate: {
      id: "read_together_annotate",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.high.read_together_annotate",
      onscreenText: "\"The margin reads, in both our hands: 'the doctrine was right; the regime was wrong.' The Politician's primer would have called this 'the only clean ending available to operatives who survive the regime.' We have survived it. We are writing the only clean ending. The chronicle records both hands.\"",
    },
    take_evidence: {
      id: "take_evidence",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.high.take_evidence",
      onscreenText: "\"You took my copy as evidence. Of what — heresy? Treason? Apostasy? The Politician's primer: 'the orthodox carrying a heretic excerpt is the orthodox who was always a heretic.' You have evidence of the obvious. The Hierarchy will charge me. I will not contest. I will read my own confession aloud. You will hear it.\"",
      choices: [
        { label: "Sit through the confession.", nextId: "take_evidence_sit" },
      ],
    },
    take_evidence_sit: {
      id: "take_evidence_sit",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.sabotage_caught_in_act.high.take_evidence_sit",
      onscreenText: "\"You sat through the whole confession. The confession reads, in essence: 'i became the heresy i was hunting. i thank the heretic for the hunt.' The chronicle records the confession as 'the regime's most efficient self-correction.' We have corrected each other. The Politician would have hated the symmetry.\"",
    },
  },
};

/* ─── mocking_interlude — PAC News green-room before a broadcast debate ─── */

const MOCKING_INTERLUDE_LOW: DialogTree = {
  id: "heretic_vs_zealot.mocking_interlude.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.low.opening",
      onscreenText: "The PAC News Network green-room, twenty minutes before a broadcast debate. The Zealot-Nemesis is reviewing their orthodox talking-points; they look up as you enter. \"The Meme has booked us against each other again. The orthodox bench's talking points are written. The heretic's, presumably, are not. The Politician's primer: 'the unprepared heretic is the heretic who survives the broadcast.' I respect the discipline.\"",
      choices: [
        { label: "Trade talking-points for the broadcast.", nextId: "trade_points", sets: "mercy_at_grudge_low_mocking_interlude" },
        { label: "Promise to ambush them on air.", nextId: "ambush_promise", sets: "aggression_at_grudge_low_mocking_interlude" },
      ],
    },
    trade_points: {
      id: "trade_points",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.low.trade_points",
      onscreenText: "\"Talking-points traded. The broadcast will be the cleanest debate in PAC News history. The Meme is going to be furious. The Meme is going to be delighted. Both. The Politician's primer: 'the debate that satisfies the Meme is the debate that has lost the audience.'\"",
      choices: [
        { label: "Walk into the studio. Sit calmly.", nextId: "trade_points_walk" },
      ],
    },
    trade_points_walk: {
      id: "trade_points_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.low.trade_points_walk",
      onscreenText: "\"The broadcast lands. The audience leaves confused. The Hierarchy's analyst department writes a paper titled 'the debate without a winner is the debate the regime cannot use.' The paper is filed without circulation. The Politician's primer: 'the unfiled paper is the longest indictment.' We are indicted together.\"",
    },
    ambush_promise: {
      id: "ambush_promise",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.low.ambush_promise",
      onscreenText: "\"You promised an ambush. I appreciate the warning. The orthodox bench teaches us never to warn before an ambush. The Politician's primer: 'the warned ambush is the ambush that the orthodoxy has been waiting for since the broadcast was scheduled.' I am ready. I have been ready.\"",
      choices: [
        { label: "Walk into the studio. Sharpen the question.", nextId: "ambush_promise_walk" },
      ],
    },
    ambush_promise_walk: {
      id: "ambush_promise_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.low.ambush_promise_walk",
      onscreenText: "\"The ambush lands cleanly. The orthodox bench's rebuttal lands cleanly. The broadcast ends a tie. PAC News's viewership numbers tripled. The Meme buys both of us drinks at the post-broadcast bar. We accept.\"",
    },
  },
};

const MOCKING_INTERLUDE_MID: DialogTree = {
  id: "heretic_vs_zealot.mocking_interlude.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.mid.opening",
      onscreenText: "\"PAC News has scheduled us seven times this cycle. The Meme is calling us 'the regime's longest-running debate.' The Hierarchy is funding my appearance fees. The Insurgency is funding yours. The Politician's primer: 'the rivals on the same network are the rivals the network owns.' We are owned. Together.\"",
      choices: [
        { label: "Walk off the show together.", nextId: "walk_off", sets: "mercy_at_grudge_mid_mocking_interlude" },
        { label: "Lock the broadcast: refuse to leave.", nextId: "lock_broadcast", sets: "aggression_at_grudge_mid_mocking_interlude" },
      ],
    },
    walk_off: {
      id: "walk_off",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.mid.walk_off",
      onscreenText: "\"We walked off together. PAC News went to dead air for forty-three seconds. The Hierarchy's lawyers are calling. The Insurgency's lawyers are calling. The Politician's primer: 'the broadcast walked off by both rivals is the broadcast the regime cannot survive.' We have ended a regime. Quietly. Off-camera.\"",
      choices: [
        { label: "Don't accept the lawyers' calls.", nextId: "walk_off_dont_accept" },
      ],
    },
    walk_off_dont_accept: {
      id: "walk_off_dont_accept",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.mid.walk_off_dont_accept",
      onscreenText: "\"We did not accept. The Politician's primer: 'the unanswered lawyer is the lawyer who becomes the next regime's foundation.' We have founded the next regime. We did not mean to. The chronicle records the founding as 'an accident of two operatives who refused to perform.'\"",
    },
    lock_broadcast: {
      id: "lock_broadcast",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.mid.lock_broadcast",
      onscreenText: "\"You locked the broadcast. You will not leave the chair. I will not leave the opposing chair. The Politician's primer: 'the locked broadcast is the broadcast that the audience controls.' The audience is controlling us now. They are not laughing. They are listening. They are, finally, listening.\"",
      choices: [
        { label: "Speak — really speak — for one minute.", nextId: "lock_speak" },
      ],
    },
    lock_speak: {
      id: "lock_speak",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.mid.lock_speak",
      onscreenText: "\"You spoke. Really spoke. For one minute. The chronicle records the minute as 'the only minute in PAC News history where the orthodox and the heretic were saying the same thing in different words.' I am still in the chair. So are you. The broadcast is still locked. The audience is not leaving.\"",
    },
  },
};

const MOCKING_INTERLUDE_HIGH: DialogTree = {
  id: "heretic_vs_zealot.mocking_interlude.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.high.opening",
      onscreenText: "\"I am not booked tonight. I came as a citizen. The orthodox bench has dropped my coordinator-track contract — they say my opposition to you has 'lost its theological clarity.' The Hierarchy was clear that the loss is mine to mourn. I do not mourn. I am here to ask if you would write my next sermon. I have lost the ear for it.\"",
      choices: [
        { label: "Agree to write the sermon.", nextId: "agree_sermon", sets: "mercy_at_grudge_high_mocking_interlude" },
        { label: "Refuse. Let them rebuild.", nextId: "refuse_sermon", sets: "aggression_at_grudge_high_mocking_interlude" },
      ],
    },
    agree_sermon: {
      id: "agree_sermon",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.high.agree_sermon",
      onscreenText: "\"You agreed. I have your draft. It reads: 'the orthodoxy was right about the cause; it was wrong about the cost.' The Hierarchy will not air it. The Insurgency will not air it. PAC News's Meme will air it because the Meme cannot resist a sentence that does not belong to any faction. I will deliver it. In my own voice. The Politician's primer would have called this 'the schism's marriage.'\"",
      choices: [
        { label: "Sit in the front row.", nextId: "agree_sermon_sit" },
      ],
    },
    agree_sermon_sit: {
      id: "agree_sermon_sit",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.high.agree_sermon_sit",
      onscreenText: "\"You sat in the front row. I delivered the sermon. The chronicle records the delivery as 'the most-quoted sentence of the regime — in two operatives' voice, in one operative's body.' We are merged. The Hierarchy is not happy. The Insurgency is not happy. The chronicle is happy. The chronicle is enough.\"",
    },
    refuse_sermon: {
      id: "refuse_sermon",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.high.refuse_sermon",
      onscreenText: "\"You refused. The Politician's primer: 'the refused commission is the commission that the refuser will have to live with.' I will rebuild. I will write the sermon myself. It will be worse than yours would have been. It will be mine. The chronicle records the refusal as 'the heretic's most orthodox decision.'\"",
      choices: [
        { label: "Walk out before they can argue.", nextId: "refuse_sermon_walk" },
      ],
    },
    refuse_sermon_walk: {
      id: "refuse_sermon_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.mocking_interlude.high.refuse_sermon_walk",
      onscreenText: "\"You walked. I am alone with the draft I will write tonight. The Politician's primer: 'the orthodox alone with a draft is the orthodox who is being rewritten by the absent heretic.' You will rewrite me in your absence. I will not resist. The chronicle is patient.\"",
    },
  },
};

/* ─── lieutenant_promotion — Mechronis Academy doctrine-enforcement ceremony ─── */

const LIEUTENANT_PROMOTION_LOW: DialogTree = {
  id: "heretic_vs_zealot.lieutenant_promotion.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.low.opening",
      onscreenText: "Mechronis Academy's doctrine-enforcement ceremony hall. The Zealot-Nemesis is being promoted to Hierarchy Doctrine Coordinator. Two newer enforcers wait behind them, ready to be assigned as their cell. They look across the hall to the heretic gallery, where you are sitting. \"The Hierarchy is giving me two enforcers. I will be auditing your faction's sermons. The Politician's primer: 'the orthodox promoted is the orthodox who has been given the heretic's syllabus to grade.' I will grade fairly. The Hierarchy will not want fair.\"",
      choices: [
        { label: "Wish them well, sincerely.", nextId: "wish_well", sets: "mercy_at_grudge_low_lieutenant_promotion" },
        { label: "Promise to make their grading hell.", nextId: "promise_hell", sets: "aggression_at_grudge_low_lieutenant_promotion" },
      ],
    },
    wish_well: {
      id: "wish_well",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.low.wish_well",
      onscreenText: "\"You wished me well. Sincerely. In a doctrine-enforcement ceremony. The orthodox bench is whispering. The Politician's primer: 'the heretic's blessing of the orthodox promotion is the doctrine's most expensive endorsement.' The Hierarchy will adjust your file. The Hierarchy will not understand the adjustment.\"",
      choices: [
        { label: "Hold the bench position. Stay for the oath.", nextId: "wish_well_stay" },
      ],
    },
    wish_well_stay: {
      id: "wish_well_stay",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.low.wish_well_stay",
      onscreenText: "\"You stayed for the oath. The oath included a clause about 'enforcement against the heretic factions.' You did not flinch. The chronicle records the not-flinching as 'the heretic's most disciplined witness.' I am now your auditor. Begin appealing.\"",
    },
    promise_hell: {
      id: "promise_hell",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.low.promise_hell",
      onscreenText: "\"You promised hell. The orthodox bench laughed. The Hierarchy's analyst department took notes. The Politician's primer: 'the threatened hell is the hell that becomes the curriculum.' I am taking the threat as syllabus. Every sermon you give from this ceremony forward will be graded against the threat.\"",
      choices: [
        { label: "Walk out of the ceremony.", nextId: "promise_hell_walk" },
      ],
    },
    promise_hell_walk: {
      id: "promise_hell_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.low.promise_hell_walk",
      onscreenText: "\"You walked. The ceremony continued. The new enforcers heard the threat. They are now my eager subordinates. The Politician's primer: 'the threat against the new coordinator is the threat that fills the coordinator's first quarter quota.' Thank you for the quota.\"",
    },
  },
};

const LIEUTENANT_PROMOTION_MID: DialogTree = {
  id: "heretic_vs_zealot.lieutenant_promotion.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.mid.opening",
      onscreenText: "\"Doctrine Coordinator. The Hierarchy is now paying me to grade your faction. The chronicle records me as 'the orthodox who reads more heretic prose than any orthodox before.' I am the closest reader you have ever had. The Politician's primer would have appreciated the diligence.\"",
      choices: [
        { label: "Submit a sermon for review willingly.", nextId: "submit_willing", sets: "mercy_at_grudge_mid_lieutenant_promotion" },
        { label: "Smuggle a sermon past the audit.", nextId: "smuggle", sets: "aggression_at_grudge_mid_lieutenant_promotion" },
      ],
    },
    submit_willing: {
      id: "submit_willing",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.mid.submit_willing",
      onscreenText: "\"You submitted. The sermon arrived with a cover letter requesting honest review. The Politician's primer: 'the heretic who requests honest review is the heretic who has stopped being one.' I will give the honest review. It will not be kind. It will be true. The chronicle prefers true.\"",
      choices: [
        { label: "Read the review without arguing.", nextId: "submit_read" },
      ],
    },
    submit_read: {
      id: "submit_read",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.mid.submit_read",
      onscreenText: "\"The review reads: 'the sermon's argument is sound; the sermon's framing is dishonest about its own audience.' You did not argue. The chronicle records the not-arguing as 'the heretic's most orthodox response in the regime so far.' We are merging without notice.\"",
    },
    smuggle: {
      id: "smuggle",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.mid.smuggle",
      onscreenText: "\"You smuggled. The sermon ran on PAC News last night without my audit. The Politician's primer: 'the unaudited sermon is the sermon that the audit will catch by next quarter.' I caught it. I am filing the citation now. The Hierarchy will be pleased.\"",
      choices: [
        { label: "Accept the citation in writing.", nextId: "smuggle_accept" },
      ],
    },
    smuggle_accept: {
      id: "smuggle_accept",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.mid.smuggle_accept",
      onscreenText: "\"You accepted. In writing. With your own signature. The chronicle records the signature as 'the heretic's first orthodox-procedure compliance.' The Hierarchy is filing the signature in the operative-track archive. You are now, by procedure, half-orthodox. The orthodoxy is now, by your half-presence, half-heretic. The merge continues.\"",
    },
  },
};

const LIEUTENANT_PROMOTION_HIGH: DialogTree = {
  id: "heretic_vs_zealot.lieutenant_promotion.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.high.opening",
      onscreenText: "\"The Hierarchy is asking me to draft a new doctrine-enforcement code, with you as the heretic exemplar. The Politician's primer: 'the rival who becomes the regime's textbook is the rival the regime cannot dismiss.' You cannot be dismissed. I will not dismiss you. The draft is on the desk between us. I am asking you to co-author.\"",
      choices: [
        { label: "Co-author the doctrine.", nextId: "coauthor", sets: "mercy_at_grudge_high_lieutenant_promotion" },
        { label: "Refuse and walk.", nextId: "refuse_walk", sets: "aggression_at_grudge_high_lieutenant_promotion" },
      ],
    },
    coauthor: {
      id: "coauthor",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.high.coauthor",
      onscreenText: "\"You co-authored. The doctrine bears two signatures. The Hierarchy will be furious. The Insurgency will be furious. PAC News will run the doctrine as the lead segment. The Politician's primer: 'the doctrine signed by two enemies is the only doctrine that survives a regime change.' We have written the next regime.\"",
      choices: [
        { label: "Sign in your own hand. Hand them the pen.", nextId: "coauthor_pen" },
      ],
    },
    coauthor_pen: {
      id: "coauthor_pen",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.high.coauthor_pen",
      onscreenText: "\"You handed me the pen. I signed. The two signatures are now in the chronicle, side by side. The Politician's primer: 'the side-by-side signatures are the only canon image the regime cannot retouch.' We are the canon image. The chronicle marks it.\"",
    },
    refuse_walk: {
      id: "refuse_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.high.refuse_walk",
      onscreenText: "\"You refused. You walked. The doctrine has only my signature. The Hierarchy will adopt it; the Insurgency will reject it. The Politician's primer: 'the doctrine refused by the heretic is the doctrine that the next heretic will quote.' Your next apprentice will quote me. Through your refusal. Unavoidably.\"",
      choices: [
        { label: "Hold the refusal. Don't look back.", nextId: "refuse_walk_hold" },
      ],
    },
    refuse_walk_hold: {
      id: "refuse_walk_hold",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.lieutenant_promotion.high.refuse_walk_hold",
      onscreenText: "\"You held the refusal. The chronicle records the refusal as 'the heretic's deepest signature — written in absence.' I am signing alone. I am still your co-author. The chronicle has decided.\"",
    },
  },
};

/* ─── cohort_end_confrontation — Cohort hall after the apprentice's last day ─── */

const COHORT_END_CONFRONTATION_LOW: DialogTree = {
  id: "heretic_vs_zealot.cohort_end_confrontation.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.low.opening",
      onscreenText: "The Cohort hall, after your apprentice's graduation. The Zealot-Nemesis is standing at the orthodox seal of the door, holding a Hierarchy-issued copy of the Apprentice Doctrine Audit. \"Your apprentice graduated. Without converting to orthodoxy. The Hierarchy considers this a procedural defeat. I consider it the cleanest sermon you ever gave. I have signed my name to that observation. The Hierarchy will read it tonight.\"",
      choices: [
        { label: "Thank them for the signed observation.", nextId: "thank_signed", sets: "mercy_at_grudge_low_cohort_end_confrontation" },
        { label: "Cite the orthodox failure aloud.", nextId: "cite_failure", sets: "aggression_at_grudge_low_cohort_end_confrontation" },
      ],
    },
    thank_signed: {
      id: "thank_signed",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.low.thank_signed",
      onscreenText: "\"You thanked me. For the signed observation. The chronicle records the thanks as 'the heretic's most orthodox courtesy.' I will frame the thanks in the doctrine-enforcement office. The Hierarchy will not understand the framing. They never do.\"",
      choices: [
        { label: "Walk on with your apprentice.", nextId: "thank_walk" },
      ],
    },
    thank_walk: {
      id: "thank_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.low.thank_walk",
      onscreenText: "\"You walked on with them. The graduation lives in the chronicle as a clean close. The Politician would have written a counter-campaign against the clean close. I will not. The orthodoxy is tired. The cohort is over. I am the warm-up for the next one. I will start tomorrow.\"",
    },
    cite_failure: {
      id: "cite_failure",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.low.cite_failure",
      onscreenText: "\"You cited the orthodox failure. In front of my new enforcers. The Politician's primer: 'the failure cited by the opposition is the failure that becomes the next quarter's curriculum.' I am writing the curriculum tonight. Your citation is the opening epigraph.\"",
      choices: [
        { label: "Walk away while they write.", nextId: "cite_failure_walk" },
      ],
    },
    cite_failure_walk: {
      id: "cite_failure_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.low.cite_failure_walk",
      onscreenText: "\"You walked. I wrote. The curriculum will run for three quarters. Your citation will be required reading. The Politician's primer: 'the heretic who provides the orthodoxy's epigraph is the heretic who has joined the orthodoxy's lineage.' Welcome to the lineage.\"",
    },
  },
};

const COHORT_END_CONFRONTATION_MID: DialogTree = {
  id: "heretic_vs_zealot.cohort_end_confrontation.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.mid.opening",
      onscreenText: "\"The cohort closes around you. The orthodoxy has been the broadcast. You have been the rebuttal the broadcast played against. The chronicle records us as a duet. I disagree. You say everything I have ever said, only differently. THAT is the duet.\"",
      choices: [
        { label: "Acknowledge the duet.", nextId: "ack_duet", sets: "mercy_at_grudge_mid_cohort_end_confrontation" },
        { label: "Deny it. We are not the same.", nextId: "deny_duet", sets: "aggression_at_grudge_mid_cohort_end_confrontation" },
      ],
    },
    ack_duet: {
      id: "ack_duet",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.mid.ack_duet",
      onscreenText: "\"You acknowledged it. With a citation to my last sermon. The chronicle records the citation as the duet's documented thesis. The Politician's primer: 'the rival's citation is the chronicle's most efficient peer review.' We are peer-reviewed. The orthodoxy and the heresy are both, finally, footnoted.\"",
      choices: [
        { label: "Walk on. Let the footnote stand.", nextId: "ack_duet_walk" },
      ],
    },
    ack_duet_walk: {
      id: "ack_duet_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.mid.ack_duet_walk",
      onscreenText: "\"You walked on with the duet acknowledged. The chronicle is satisfied. I am satisfied. The Politician would have envied the satisfaction. I will think about this for three quarters at least. The Hierarchy will fund the thinking.\"",
    },
    deny_duet: {
      id: "deny_duet",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.mid.deny_duet",
      onscreenText: "\"You denied it. With a citation to your last sermon — the one that contradicted mine in every line. The Politician's primer: 'the denied duet is the duet whose denial cites the same source.' We cite the same source. We are the duet. The denial is the verse.\"",
      choices: [
        { label: "Walk away from the citation.", nextId: "deny_duet_walk" },
      ],
    },
    deny_duet_walk: {
      id: "deny_duet_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.mid.deny_duet_walk",
      onscreenText: "\"You walked away. The denial-as-verse will be on PAC News tomorrow. The Meme is going to love it. The Politician would have wept. The Hierarchy will be furious. The Insurgency will be furious. The chronicle is content.\"",
    },
  },
};

const COHORT_END_CONFRONTATION_HIGH: DialogTree = {
  id: "heretic_vs_zealot.cohort_end_confrontation.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.high.opening",
      onscreenText: "\"Your apprentice closed the cohort by reading the heresy aloud — your heresy, in the orthodox lectionary's cadence. The Hierarchy has filed a citation. I will not contest it. The Politician would have called this 'the schism's most musical surrender.' I surrender. The Hierarchy will not understand the surrender. The orthodoxy is now yours to draft.\"",
      choices: [
        { label: "Accept the draft authority. Edit gently.", nextId: "accept_draft", sets: "mercy_at_grudge_high_cohort_end_confrontation" },
        { label: "Refuse the authority. Burn the lectionary.", nextId: "refuse_draft", sets: "aggression_at_grudge_high_cohort_end_confrontation" },
      ],
    },
    accept_draft: {
      id: "accept_draft",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.high.accept_draft",
      onscreenText: "\"You accepted. You edited the orthodox lectionary gently — a sentence here, a clause there. The Politician's primer: 'the gentle editor is the editor who keeps the regime's furniture.' We have kept the furniture. The doctrine has new walls and the same shelves. The chronicle approves.\"",
      choices: [
        { label: "Walk out leaving the lectionary on the desk.", nextId: "accept_draft_walk" },
      ],
    },
    accept_draft_walk: {
      id: "accept_draft_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.high.accept_draft_walk",
      onscreenText: "\"You walked out. The lectionary is annotated by both of us. The Hierarchy will adopt it without comment. The Insurgency will adopt it without comment. The Politician's primer: 'the unanimously-adopted doctrine is the doctrine that the regime is about to outgrow.' We have outgrown the regime. Together.\"",
    },
    refuse_draft: {
      id: "refuse_draft",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.high.refuse_draft",
      onscreenText: "\"You burned the lectionary. In the orthodox hall. With orthodox flame from the orthodox brazier. The Hierarchy is screaming. The Politician's primer: 'the burned lectionary is the lectionary the regime had already drafted in its own ash.' We are the ash. The chronicle is the wind that scatters it.\"",
      choices: [
        { label: "Walk into the smoke.", nextId: "refuse_draft_walk" },
      ],
    },
    refuse_draft_walk: {
      id: "refuse_draft_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.cohort_end_confrontation.high.refuse_draft_walk",
      onscreenText: "\"You walked into the smoke. I followed. The Politician's primer: 'the rivals who walk into the same smoke are the rivals who are about to write the same elegy.' I will write mine first. You will write yours next. They will read identical to the reader. The reader will not know either of us wrote.\"",
    },
  },
};

/* ─── accumulation_reveal — Hierarchy intake bulletin ─── */

const ACCUMULATION_REVEAL_LOW: DialogTree = {
  id: "heretic_vs_zealot.accumulation_reveal.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.low.opening",
      onscreenText: "The Hierarchy's intake chamber. The Zealot-Nemesis is reviewing the new-release bulletin. \"There's another one. Of us. The Matrix-archive has released a sibling. The Politician's stable widens. The new one will want their own enforcement portfolio, want to copy my methodology, and I will have to invent a whole new audit standard overnight. You did this — by recruiting a second apprentice. You SCHISMATIC.\"",
      choices: [
        { label: "Acknowledge the new sibling.", nextId: "ack_sibling", sets: "mercy_at_grudge_low_accumulation_reveal" },
        { label: "Promise to convert them.", nextId: "convert", sets: "aggression_at_grudge_low_accumulation_reveal" },
      ],
    },
    ack_sibling: {
      id: "ack_sibling",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.low.ack_sibling",
      onscreenText: "\"You acknowledged. From the heretic gallery. With one nod. The new sibling is reading my audit standards now. The Politician's primer: 'the recognized sibling is the sibling who learns the orthodoxy faster.' I am the orthodoxy. They are learning fast. You acknowledged them into my classroom.\"",
      choices: [
        { label: "Walk out of the chamber.", nextId: "ack_sibling_walk" },
      ],
    },
    ack_sibling_walk: {
      id: "ack_sibling_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.low.ack_sibling_walk",
      onscreenText: "\"You walked. The new sibling will hear about your acknowledgment before they meet you. The Politician's primer: 'the warning that travels ahead is the warning that does the recruiting work.' You have done my recruiting for me again. Thank you. The Hierarchy will not understand. They never do.\"",
    },
    convert: {
      id: "convert",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.low.convert",
      onscreenText: "\"You promised conversion. The heretic's conversion campaign begins. The Hierarchy is preparing the counter-campaign. The Politician's primer: 'the new release is the regime's most converted recruit.' Whoever's syllabus reaches them first owns the doctrine. Begin teaching. So will I.\"",
      choices: [
        { label: "Start the conversion campaign tonight.", nextId: "convert_start" },
      ],
    },
    convert_start: {
      id: "convert_start",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.low.convert_start",
      onscreenText: "\"Your campaign starts. Mine starts. The new sibling is reading both syllabi at once. The Politician's primer: 'the recruit reading two syllabi is the recruit who becomes the next regime's coordinator.' They will outgrow both of us. The chronicle has anticipated the outgrowth.\"",
    },
  },
};

const ACCUMULATION_REVEAL_MID: DialogTree = {
  id: "heretic_vs_zealot.accumulation_reveal.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.mid.opening",
      onscreenText: "\"We are four now, released from the Matrix. The Politician's roster has tripled, and the schism between us is now the schism between four. The Hierarchy is funding three of us. The Insurgency is funding one. You. The Politician's primer would have called this 'the regime's most expensive balance.'\"",
      choices: [
        { label: "Bless the cohort. All four of us.", nextId: "bless_cohort", sets: "mercy_at_grudge_mid_accumulation_reveal" },
        { label: "Threaten a unified schism.", nextId: "threat_schism", sets: "aggression_at_grudge_mid_accumulation_reveal" },
      ],
    },
    bless_cohort: {
      id: "bless_cohort",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.mid.bless_cohort",
      onscreenText: "\"You blessed the cohort. From the heretic bench. With orthodox formality. The Politician's primer: 'the heretic's formal blessing is the formal end of the schism.' The other three are now disoriented. They were trained to oppose you. They are now bowing back. The chronicle records the bowing as 'the regime's first unanimous gesture.'\"",
      choices: [
        { label: "Walk away. Let us argue.", nextId: "bless_cohort_walk" },
      ],
    },
    bless_cohort_walk: {
      id: "bless_cohort_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.mid.bless_cohort_walk",
      onscreenText: "\"You walked. We are arguing already. The Politician's primer: 'the unified faction dies of internal disagreement before the next vote.' We will not vote together. The chronicle records the disagreement. You have killed the unity with formality.\"",
    },
    threat_schism: {
      id: "threat_schism",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.mid.threat_schism",
      onscreenText: "\"You threatened a unified schism — three orthodox against one heretic, with you preparing to convert all three of us. The Politician's primer: 'the unified schism is the schism the regime cannot survive.' The Hierarchy is preparing. The Insurgency is preparing. The chronicle is preparing.\"",
      choices: [
        { label: "Walk away from the threat.", nextId: "threat_schism_walk" },
      ],
    },
    threat_schism_walk: {
      id: "threat_schism_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.mid.threat_schism_walk",
      onscreenText: "\"You walked. The threat hangs. The Politician's primer: 'the threatened schism that walks is the schism that has already happened.' We are already schismed. The chronicle marks it.\"",
    },
  },
};

const ACCUMULATION_REVEAL_HIGH: DialogTree = {
  id: "heretic_vs_zealot.accumulation_reveal.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.high.opening",
      onscreenText: "\"We are a chorus now. Five Matrix-releases. I have stopped writing audit standards. The other four take turns. The Antiquarian's Journal has a section for us called 'The Politician's Five Schismatic Voices.' I am the entry that signs every audit and is afraid to read its own conclusions. The Hierarchy reads the section like scripture. The Insurgency reads it like a prophecy.\"",
      choices: [
        { label: "Honor the chorus.", nextId: "honor_chorus", sets: "mercy_at_grudge_high_accumulation_reveal" },
        { label: "Recruit one of them.", nextId: "recruit_one", sets: "aggression_at_grudge_high_accumulation_reveal" },
      ],
    },
    honor_chorus: {
      id: "honor_chorus",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.high.honor_chorus",
      onscreenText: "\"You honored the chorus. With one citation in your next sermon — to all four of us. The Politician's primer: 'the chorus honored by the heretic is the chorus that outlasts the schism.' We are lasting. I am lasting. The chronicle records the lasting. The Antiquarian is updating the section's introduction in real time.\"",
      choices: [
        { label: "Walk on, leaving us our chorus.", nextId: "honor_chorus_walk" },
      ],
    },
    honor_chorus_walk: {
      id: "honor_chorus_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.high.honor_chorus_walk",
      onscreenText: "\"You walked on. The chorus continues. The Antiquarian's section grows. The Politician's primer: 'the chorus the chronicler walks past is the chorus that becomes the regime's hymnal.' We are the hymnal. The Hierarchy hums us. The Insurgency hums us back.\"",
    },
    recruit_one: {
      id: "recruit_one",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.high.recruit_one",
      onscreenText: "\"You recruited one. From the orthodox side. Quietly. With one cited sermon. The chronicle records the recruitment as 'the schism's first defection in either direction.' The other three of us are now suspicious of each other. The Politician's primer: 'the recruited rival is the rival the chorus cannot replace.' The chorus is breaking. You broke it. With one citation.\"",
      choices: [
        { label: "Don't recruit another. Walk on.", nextId: "recruit_one_walk" },
      ],
    },
    recruit_one_walk: {
      id: "recruit_one_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.accumulation_reveal.high.recruit_one_walk",
      onscreenText: "\"You walked. One recruit. No more. The chronicle records the restraint as 'the heretic's most disciplined recruitment.' The Hierarchy is restructuring. The Insurgency is restructuring. The Politician's primer would have applauded the discipline. I applaud. Quietly. From inside the audit office that is no longer mine.\"",
    },
  },
};

/* ─── name_reveal_moment — Antiquarian's Journal margin ─── */

const NAME_REVEAL_MOMENT_LOW: DialogTree = {
  id: "heretic_vs_zealot.name_reveal_moment.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.low.opening",
      onscreenText: "The Antiquarian's Journal page on the Matrix-released enforcers. You have closed Resurrectionist E5 and witnessed Game Master Fight 2's plague-mask seed. The Zealot-Nemesis's proper name surfaces in the margin. They are at the orthodox reading-desk across from yours. \"You have my name now. I should warn you: my name is in the Hierarchy's master enforcement roll. Using it without orthodox authority is a procedural offense. The Politician's primer: 'the name on the master roll is the name the heretic must speak softly to avoid being audited for the speaking.' Speak it softly.\"",
      choices: [
        { label: "Say the name softly.", nextId: "say_soft", sets: "mercy_at_grudge_low_name_reveal_moment" },
        { label: "File the name with the Adjudicator.", nextId: "file_adj", sets: "aggression_at_grudge_low_name_reveal_moment" },
      ],
    },
    say_soft: {
      id: "say_soft",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.low.say_soft",
      onscreenText: "\"You said it softly. In the way an orthodox citation would have it pronounced. The Politician's primer: 'the soft name is the name the schism cannot weaponize.' My name is now safe in your mouth. The chronicle records the safety. I owe you a citation in tomorrow's audit. I will deliver it.\"",
      choices: [
        { label: "Walk on with the name in your mouth.", nextId: "say_soft_walk" },
      ],
    },
    say_soft_walk: {
      id: "say_soft_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.low.say_soft_walk",
      onscreenText: "\"You walked. The name walked with you. The Politician's primer: 'the name carried softly is the name that outlasts the carrier and the cited.' I am cited. You are carrying. We are both, by procedure, in good standing.\"",
    },
    file_adj: {
      id: "file_adj",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.low.file_adj",
      onscreenText: "\"You filed the name with the Adjudicator. The Hierarchy will be notified by the third bell. The Politician's primer: 'the filed name is the name that owns the filer.' You now own me in three jurisdictions. The Hierarchy will respond. The Insurgency will respond. The chronicle is waiting.\"",
      choices: [
        { label: "Withdraw the filing before the third bell.", nextId: "file_adj_withdraw" },
      ],
    },
    file_adj_withdraw: {
      id: "file_adj_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.low.file_adj_withdraw",
      onscreenText: "\"You withdrew. Before the third bell. The chronicle records the withdrawal as 'the heretic's most orthodox restraint.' I owe you. In writing. With my own signature. The signature is now in the Adjudicator's house records, where it will stay until the regime ends. The chronicle marks the debt.\"",
    },
  },
};

const NAME_REVEAL_MOMENT_MID: DialogTree = {
  id: "heretic_vs_zealot.name_reveal_moment.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.mid.opening",
      onscreenText: "\"You know my name. The chronicle records the knowing. The Politician's primer: 'the orthodox name in the heretic's chronicle is the name the regime cannot reclaim.' My name is now permanently filed in your sermon-archive. Use it. Or don't. The chronicle holds either way.\"",
      choices: [
        { label: "Honor the name in your next sermon.", nextId: "honor_name", sets: "mercy_at_grudge_mid_name_reveal_moment" },
        { label: "Cite the name as a heresy.", nextId: "cite_heresy", sets: "aggression_at_grudge_mid_name_reveal_moment" },
      ],
    },
    honor_name: {
      id: "honor_name",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.mid.honor_name",
      onscreenText: "\"You honored the name. In a heretic sermon. In the cadence the orthodox uses for the founders. The Politician's primer: 'the honored orthodox name in the heretic mouth is the name that finally belongs to both schools.' I am, for the first time, two schools' citation. The Hierarchy is uncomfortable. The Insurgency is uncomfortable. The chronicle is comfortable.\"",
      choices: [
        { label: "Walk on, honored back.", nextId: "honor_name_walk" },
      ],
    },
    honor_name_walk: {
      id: "honor_name_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.mid.honor_name_walk",
      onscreenText: "\"You walked on. The name is mine, owed to you, owed to the heretic syllabus that holds it. The chronicle records the debt as the lightest in the Hierarchy's records. The Politician would have called this 'the debt that compounds in citations, not interest.'\"",
    },
    cite_heresy: {
      id: "cite_heresy",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.mid.cite_heresy",
      onscreenText: "\"You cited my name as a heresy. In a heretic sermon. The Politician's primer: 'the name cited as heresy is the name that finally renounces both schools.' I renounce. The Hierarchy will revoke my credentials. The Insurgency will offer me hospitality. The chronicle does not record renunciations; it records the gait of the renouncer.\"",
      choices: [
        { label: "Walk away while they pack.", nextId: "cite_heresy_walk" },
      ],
    },
    cite_heresy_walk: {
      id: "cite_heresy_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.mid.cite_heresy_walk",
      onscreenText: "\"You walked. The chronicle records my gait. The chronicle records my packing. The chronicle records the slow procession from the orthodox bench to the heretic gallery. The Politician's primer: 'the procession of the renounced is the regime's most informative parade.'\"",
    },
  },
};

const NAME_REVEAL_MOMENT_HIGH: DialogTree = {
  id: "heretic_vs_zealot.name_reveal_moment.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.high.opening",
      onscreenText: "\"Use my name. It is the last thing in this chronicle that is fully mine. The Politician left me my name, my coordinator-track contract, and the Hierarchy's enforcement code. You have read the code. You have read the contract. You have read the chronicle. The name is the last gift. Speak it as you choose. The chronicle will note who you made it.\"",
      choices: [
        { label: "Speak it as an absolution.", nextId: "absolution", sets: "mercy_at_grudge_high_name_reveal_moment" },
        { label: "Speak it as an indictment.", nextId: "indictment", sets: "aggression_at_grudge_high_name_reveal_moment" },
      ],
    },
    absolution: {
      id: "absolution",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.high.absolution",
      onscreenText: "\"You spoke it as an absolution. The orthodox bench does not believe in absolution from the heretic gallery. The Politician's primer would not have permitted the absolution. The chronicle has permitted it. I am, for one beat, not an enforcer. I am a person with a name. Thank you.\"",
      choices: [
        { label: "Hold the absolution. Walk on.", nextId: "absolution_hold" },
      ],
    },
    absolution_hold: {
      id: "absolution_hold",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.high.absolution_hold",
      onscreenText: "\"You held the absolution. You walked on. The chronicle records the absolution as the line that closes the schism's middle act. The middle act is over. The closing act is ours. I will play it under my new name. The new name is the old one, said in your voice.\"",
    },
    indictment: {
      id: "indictment",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.high.indictment",
      onscreenText: "\"You spoke it as an indictment. The Hierarchy will file the indictment in tomorrow's docket. The Politician's primer: 'the indicted name is the name the regime engraves on its own headstone.' The Hierarchy is engraving. I am cooperating with the engraving. The chronicle is listening.\"",
      choices: [
        { label: "Stay for the engraving. Quietly.", nextId: "indictment_stay" },
      ],
    },
    indictment_stay: {
      id: "indictment_stay",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.name_reveal_moment.high.indictment_stay",
      onscreenText: "\"You stayed. You listened. I cooperated. The chronicle wrote. The Politician's primer: 'the indictment the wielder stays for is the indictment that becomes the regime's longest verse.' This is the longest verse. We are inside it. The schism continues, inside the verse, together, until the chronicle closes.\"",
    },
  },
};

/* ─── final_encounter — Convergence Seat throne room ─── */

const FINAL_ENCOUNTER_LOW: DialogTree = {
  id: "heretic_vs_zealot.final_encounter.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.low.opening",
      onscreenText: "The Convergence Seat throne room, immediately after the Act 7 ladder closes. The Zealot-Nemesis is standing at the orthodox side of the empty Seat, with their two enforcers now uncertain behind them. \"Act Seven. The Seat has fallen. So has my enforcement portfolio. The Hierarchy is dissolving. The Politician's primer: 'the arc that ends without an audit is the arc the chronicle inherits.' The chronicle is inheriting us. Quietly. As citations.\"",
      choices: [
        { label: "Mercy at the end.", nextId: "mercy_end", sets: "mercy_at_grudge_low_final_encounter" },
        { label: "Quick, clean end.", nextId: "clean_end", sets: "aggression_at_grudge_low_final_encounter" },
      ],
    },
    mercy_end: {
      id: "mercy_end",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.low.mercy_end",
      onscreenText: "\"Mercy at the end. The Politician's primer: 'the merciful close is the close that the next regime cites in its founding documents.' The next regime is starting. Neither of us will be the founder. But the mercy will be in the founding. The mercy travels.\"",
      choices: [
        { label: "Walk on to the next regime.", nextId: "mercy_end_walk" },
      ],
    },
    mercy_end_walk: {
      id: "mercy_end_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.low.mercy_end_walk",
      onscreenText: "\"You walked. The chronicle closed around the mercy. I am closing too. The Politician would have called this 'the cleanest schism-close in the regime's records.' I would not have agreed in life. I agree now.\"",
    },
    clean_end: {
      id: "clean_end",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.low.clean_end",
      onscreenText: "\"An ending. Quick. Clean. The Politician would have applauded the brevity. I applaud the brevity. The chronicle records the brevity as the most efficient schism-close in the regime. We are efficient. We are closed.\"",
      choices: [
        { label: "Walk away. Don't watch.", nextId: "clean_end_walk" },
      ],
    },
    clean_end_walk: {
      id: "clean_end_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.low.clean_end_walk",
      onscreenText: "\"You walked. You did not watch. The chronicle's last image of me is the back of your head. The Politician's primer: 'the back of the head is the chronicle's most dignified citation.' I have been dignified. The chronicle records it.\"",
    },
  },
};

const FINAL_ENCOUNTER_MID: DialogTree = {
  id: "heretic_vs_zealot.final_encounter.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.mid.opening",
      onscreenText: "\"End of the arc. Most of mine, anyway. The Politician's primer: 'the arc that ends with both operatives in the same throne room is the arc that becomes the next regime's foundational citation.' We are the citation. The Antiquarian is preparing the new entry. We will be quoted in it. Together.\"",
      choices: [
        { label: "Let them close their own file.", nextId: "let_close", sets: "mercy_at_grudge_mid_final_encounter" },
        { label: "Close their file for them.", nextId: "close_for", sets: "aggression_at_grudge_mid_final_encounter" },
      ],
    },
    let_close: {
      id: "let_close",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.mid.let_close",
      onscreenText: "\"You let me close my own file. The Politician's primer: 'the self-closed orthodox file is the file that survives the regime.' I am surviving in the file. The chronicle is reading the file. I am writing the last sentence. The sentence is: 'i was wrong about the cost; i was right about the cause.'\"",
      choices: [
        { label: "Walk on. Let them write it.", nextId: "let_close_walk" },
      ],
    },
    let_close_walk: {
      id: "let_close_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.mid.let_close_walk",
      onscreenText: "\"You walked. I wrote. The Politician would have written 'i was right about everything.' I wrote what was true. The chronicle records the difference. The chronicle prefers the difference. So do I, now.\"",
    },
    close_for: {
      id: "close_for",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.mid.close_for",
      onscreenText: "\"You closed my file for me. With your heretic citation. The Politician's primer: 'the orthodox file closed by the heretic is the file whose ending the heretic owns.' You own my ending. I am writing one more line, in your closing, in your handwriting. The line is: 'the schism was the orthodoxy's longest sermon.' The chronicle records the credit.\"",
      choices: [
        { label: "Sign the closing.", nextId: "close_for_sign" },
      ],
    },
    close_for_sign: {
      id: "close_for_sign",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.mid.close_for_sign",
      onscreenText: "\"You signed. With a citation, not a name. The chronicle records the citation as the most dignified signature in the regime. The Politician would have envied the citation. I envy the citation. The chronicle is rich with the citation.\"",
    },
  },
};

const FINAL_ENCOUNTER_HIGH: DialogTree = {
  id: "heretic_vs_zealot.final_encounter.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.high.opening",
      onscreenText: "\"The chronicle is folding this story shut around both of us. I have spent seven cohorts auditing your faction, and you have spent seven cohorts teaching me that the audit I wanted was the doctrine I refused to read. I have read the doctrine. I cannot enforce it anymore. You can. Read it one more time.\"",
      choices: [
        { label: "Read the doctrine. One last time.", nextId: "read_doctrine", sets: "mercy_at_grudge_high_final_encounter" },
        { label: "Refuse the reading. Burn the doctrine.", nextId: "burn_doctrine", sets: "aggression_at_grudge_high_final_encounter" },
      ],
    },
    read_doctrine: {
      id: "read_doctrine",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.high.read_doctrine",
      onscreenText: "\"You read it. In the heretic cadence. In front of the empty Convergence Seat. The Politician's primer: 'the doctrine read at the Seat's foot is the doctrine that founds the next regime.' We are founding it. Together. The chronicle is taking dictation. The next regime's first citation is this reading.\"",
      choices: [
        { label: "Hold the doctrine open. Let them read the next page.", nextId: "read_doctrine_hold" },
      ],
    },
    read_doctrine_hold: {
      id: "read_doctrine_hold",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.high.read_doctrine_hold",
      onscreenText: "\"You held it open. I read the next page. In my own cadence. The chronicle's last page is the doctrine we read together at the foot of the empty Seat. The Politician would have hated this ending. She would have hated that we ended it as the same school. The chronicle marks it. The chronicle closes. The doctrine remains.\"",
    },
    burn_doctrine: {
      id: "burn_doctrine",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.high.burn_doctrine",
      onscreenText: "\"You refused. You burned the doctrine in the throne room's brazier. The Politician's primer: 'the burned doctrine at the Seat's foot is the doctrine the next regime will read in ash.' The ash is being collected. The Antiquarian will file it. The chronicle records the burning as 'the heretic's final orthodoxy.'\"",
      choices: [
        { label: "Walk away from the smoke.", nextId: "burn_doctrine_walk" },
      ],
    },
    burn_doctrine_walk: {
      id: "burn_doctrine_walk",
      speaker: "nemesis",
      voLineId: "nemesis.heretic_vs_zealot.final_encounter.high.burn_doctrine_walk",
      onscreenText: "\"You walked. The smoke followed. The chronicle did not follow you; it stayed with me at the Seat's foot, recording the ash. The Politician would have called this 'the orthodoxy's stubborn loyalty to its own combustion.' I am the combustion. I am still smoking. The chronicle is still recording.\"",
    },
  },
};

/* ─── The pair-bank export ─── */

export const hereticVsZealotPairBank: NemesisPairBank = {
  pairId: "heretic_vs_zealot",
  playerArchetype: "heretic",
  nemesisArchetype: "zealot",
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
