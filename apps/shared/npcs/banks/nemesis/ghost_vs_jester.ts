/* ═══════════════════════════════════════════════════════
   GHOST-PLAYER vs. JESTER-NEMESIS — Phase K Wave 5/6 (canon rewrite)

   The Picard-vs-Q axis grounded in saga canon.

   The JESTER-Nemesis is a Politician's secret-apprentice
   (Project Sorrow Seeker → Mechronis Academy Student →
   Hierarchy-aligned propaganda operative) carrying the
   campaign-smile-rictus tic. Their "barbed wit" register
   isn't a comedy career — it's the Politician's
   rhetorical-mockery template, deployed on the
   Governance Hub vote-floor, in PAC News Network
   counter-broadcasts, in casino-floor patter that masks
   table rigging, in trade-caravan disinfo that moves
   route prices. Every "performance" is a faction-aligned
   campaign operation.

   The GHOST-player is an archive infiltrator — the kind
   of operative who reads ledgers without leaving a
   fingerprint, who walks the Adjudicator's back-rooms
   between shifts, who can be in a Hub gallery without
   being on a citizen-roll. Their refusal to be witnessed
   is the operational discipline of someone trained to
   never sign anything.

   The whole rivalry is the Jester learning that the
   absence of a witness IS the loudest possible witness,
   and the Ghost learning that the Politician's primer
   knows exactly what to do with operatives who refuse
   to leave a record.

   Each scene's surface is canonical:
     • first_sighting — Governance Hub vote-floor gallery
       (Jester is at the podium; Ghost is in the upper
       gallery reading citizen-rolls)
     • sabotage_caught_in_act — Trade route waystation
       (Jester is salting convoy manifests with disinfo;
       Ghost catches them mid-write)
     • mocking_interlude — Degen's Casino back-room
       (Jester is patter-running a rigged Pazaak table;
       Ghost is reading the house ledger)
     • lieutenant_promotion — Mechronis Academy
       coordinator ceremony (Politician-cell promotion)
     • cohort_end_confrontation — Cohort hall, where
       the player's apprentice graduates / falls
     • accumulation_reveal — Hierarchy chamber where
       the Jester learns a new Politician-apprentice
       has been released from the Matrix-archive
     • name_reveal_moment — Antiquarian's Journal, after
       Resurrectionist E5 + Game Master Fight 2 plague-
       mask seed close both reveal-gates
     • final_encounter — Convergence Seat throne room,
       after the Act 7 ladder closes
   ═══════════════════════════════════════════════════════ */

import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

/* ─── first_sighting — Governance Hub vote-floor gallery ─── */

const FIRST_SIGHTING_LOW: DialogTree = {
  id: "ghost_vs_jester.first_sighting.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.low.opening",
      onscreenText: "The Jester-Nemesis is at the Hub podium running a Hierarchy-backed counter-vote. They pivot mid-sentence and address the upper gallery directly: \"There you are. The Adjudicator's silent clerk. You haven't reacted to my last three speeches. That's already part of the campaign. You're crueler than the opposition, and you don't know it.\"",
      choices: [
        { label: "Don't react. Keep reading the citizen-roll.", nextId: "ghost_silence", sets: "mercy_at_grudge_low_first_sighting" },
        { label: "Mark their name in the gallery log.", nextId: "ghost_cut", sets: "aggression_at_grudge_low_first_sighting" },
      ],
    },
    ghost_silence: {
      id: "ghost_silence",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.low.silence_response",
      onscreenText: "\"And there it is. The not-reaction. I've been hunting for it since Project Sorrow's intake hall — the Politician taught me to recognize a gallery-clerk who reads without signing. You give it to me on the first day. Do you understand how useful you are? You're shaping the vote without casting one.\"",
      choices: [
        { label: "Close the citizen-roll. Leave the gallery.", nextId: "ghost_silence_walk" },
      ],
    },
    ghost_silence_walk: {
      id: "ghost_silence_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.low.silence_walk",
      onscreenText: "\"You're leaving the chamber mid-speech. The Politician's primer: 'the audience who walks is the campaign's strongest endorsement of the opposition.' I am writing this down — *[the campaign-smile-rictus tic holds one beat too long; the chronicle marks it; you mark it]* — and I am addressing my next rally to your empty seat.\"",
    },
    ghost_cut: {
      id: "ghost_cut",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.low.cut_response",
      onscreenText: "\"You signed the gallery log. You signed FIRST. The Politician's primer: 'the watcher who signs is the watcher who joined the campaign.' Welcome to the vote-floor. You are now eligible to be quoted.\"",
      choices: [
        { label: "Strike your name from the log.", nextId: "ghost_cut_refuse" },
      ],
    },
    ghost_cut_refuse: {
      id: "ghost_cut_refuse",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.low.cut_refuse",
      onscreenText: "\"Too late. The gallery log went to the press at the third bell. You can strike your name; the speech I am writing tonight already quotes the strike. Worse for you: it quotes you better than the signing did.\"",
    },
  },
};

const FIRST_SIGHTING_MID: DialogTree = {
  id: "ghost_vs_jester.first_sighting.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.mid.opening",
      onscreenText: "\"Three cohorts of campaigns. I now have a whole PAC News segment about the Adjudicator's silent clerk who never signs the roll. The viewership numbers are climbing because of you. The Hierarchy's analyst department thinks you ARE the segment. They are correct.\"",
      choices: [
        { label: "Lift one eyebrow at the press box.", nextId: "ghost_mark_leave", sets: "mercy_at_grudge_mid_first_sighting" },
        { label: "Send a question up to the press box, anonymously.", nextId: "ghost_speak_quiet", sets: "aggression_at_grudge_mid_first_sighting" },
      ],
    },
    ghost_mark_leave: {
      id: "ghost_mark_leave",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.mid.mark_leave",
      onscreenText: "\"The press box saw the eyebrow. The Politician would have written a whole policy paper on your eyebrow. I would have read it on air. The Hierarchy would have funded a follow-up segment. Your eyebrow is now a line item in three faction budgets.\"",
      choices: [
        { label: "Hold the eyebrow until the segment cuts.", nextId: "ghost_mark_leave_hold" },
      ],
    },
    ghost_mark_leave_hold: {
      id: "ghost_mark_leave_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.mid.mark_leave_hold",
      onscreenText: "\"The eyebrow holds longer than the segment. The press box is now editing around it. The chronicle records the eyebrow as 'the gallery's longest editorial.' I am incandescent with envy. I am also taking notes for next quarter's PNN counter-broadcast.\"",
    },
    ghost_speak_quiet: {
      id: "ghost_speak_quiet",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.mid.speak_quiet",
      onscreenText: "\"An anonymous question slid up to the press box. It is in the Adjudicator's house hand. Everyone in the room can tell it is yours. You doubled my coverage by trying to sign nothing. I owe you airtime. I will spend it loudly so you have to refuse the citation.\"",
      choices: [
        { label: "Refuse the citation, silently.", nextId: "ghost_speak_quiet_refuse" },
      ],
    },
    ghost_speak_quiet_refuse: {
      id: "ghost_speak_quiet_refuse",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.mid.speak_quiet_refuse",
      onscreenText: "\"The citation appears in tomorrow's PNN crawl, attributed to 'a source.' The Politician's primer: 'the unattributed citation carries the room longer than the attribution.' The source is yours. The crawl is mine. The room is the Hierarchy's. The chronicle is the Hierarchy's. Everything is the Hierarchy's. Including, today, the silence you brought.\"",
    },
  },
};

const FIRST_SIGHTING_HIGH: DialogTree = {
  id: "ghost_vs_jester.first_sighting.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.high.opening",
      onscreenText: "\"I have stopped running the counter-vote. Notice that. The Hierarchy is furious. I am here, off the floor, in the gallery, without a podium. You did this. You unmade my campaign and you didn't have to sign a single roll. The Politician would have been proud and disappointed in the same breath. I am just disappointed.\"",
      choices: [
        { label: "Nod, once. Acknowledge them.", nextId: "ghost_ack_once", sets: "mercy_at_grudge_high_first_sighting" },
        { label: "Keep walking past, eyes on the citizen-roll.", nextId: "ghost_walk_past", sets: "aggression_at_grudge_high_first_sighting" },
      ],
    },
    ghost_ack_once: {
      id: "ghost_ack_once",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.high.ack_once",
      onscreenText: "\"You nodded. ONCE. I am going to remember the nod for the rest of my time on the cell-coordinator track. The Politician taught me to honor a real read when it comes — the Hierarchy's analysts read me daily and they have never matched the precision of your nod. Thank you.\"",
      choices: [
        { label: "Hold the nod. Walk on.", nextId: "ghost_ack_walk" },
      ],
    },
    ghost_ack_walk: {
      id: "ghost_ack_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.high.ack_walk",
      onscreenText: "\"You walked on. The chronicle records the nod as the only review I have ever wanted. The chronicle also records that you walked. The Politician would have framed this for the Mechronis Academy lobby. I will, in my way — *[the campaign-smile-rictus tic holds one beat too long; the tic-decode is yours to catch in the Antiquarian's Journal]*\"",
    },
    ghost_walk_past: {
      id: "ghost_walk_past",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.high.walk_past",
      onscreenText: "\"You walked past. With no acknowledgment. The Politician's primer: 'the unacknowledged operative is the Adjudicator's longest correction.' I called it 'a sentence whose end the chronicle has not yet written for me.' I am writing it now. The Hierarchy will read it tomorrow.\"",
      choices: [
        { label: "Don't watch them write.", nextId: "ghost_walk_dont_watch" },
      ],
    },
    ghost_walk_dont_watch: {
      id: "ghost_walk_dont_watch",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.high.walk_dont_watch",
      onscreenText: "\"You didn't watch. Of course. The Adjudicator's clerks were trained never to watch a Politician-cell operative finish a sentence. The chronicle says we are the same kind of trainee at this point. The chronicle is wrong. You are quieter. Quieter is the operational win.\"",
    },
  },
};

/* ─── sabotage_caught_in_act — Trade route waystation ─── */

const SABOTAGE_CAUGHT_IN_ACT_LOW: DialogTree = {
  id: "ghost_vs_jester.sabotage_caught_in_act.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.low.opening",
      onscreenText: "Waystation 7, edge of the Architect Remnants' territory. The Jester-Nemesis is hunched over a freight manifest, salting it with Hierarchy-side rumors about a competing trade-house. They look up. \"OH. You're already here. You're early in MY disinfo run. The chronicle will love this. I love this. I'm furious and I love this.\"",
      choices: [
        { label: "Let them finish the manifest.", nextId: "let_finish", sets: "mercy_at_grudge_low_sabotage_caught_in_act" },
        { label: "Cross out the doctored line.", nextId: "block_punch", sets: "aggression_at_grudge_low_sabotage_caught_in_act" },
      ],
    },
    let_finish: {
      id: "let_finish",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.low.let_finish",
      onscreenText: "\"You're WATCHING the disinfo? Live? Without correcting the spelling? This is the worst thing you have ever done to my craft. The Politician taught us never to write under an audit. You are auditing me with your eyes. Audit from further away.\"",
      choices: [
        { label: "Stay where you are. Watch the spelling.", nextId: "let_finish_stay" },
      ],
    },
    let_finish_stay: {
      id: "let_finish_stay",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.low.let_finish_stay",
      onscreenText: "\"You stayed. The caravan master is now watching me being watched by you. I have lost the manifest. I have lost the manifest to a person who has not said a word. The Politician's primer: 'an unsigned audit is the strongest audit.' She was always right. I hate that she was always right.\"",
    },
    block_punch: {
      id: "block_punch",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.low.block_punch",
      onscreenText: "\"You crossed out the doctored line. Cleanly. With Adjudicator-house ink. The caravan master sees the strike-through and knows it for what it is — the silent clerk's correction. The Politician would have wanted to recruit you to the cell. The Hierarchy will not be happy. The Hierarchy will not be happy with me.\"",
      choices: [
        { label: "Step out of the waystation.", nextId: "block_punch_out" },
      ],
    },
    block_punch_out: {
      id: "block_punch_out",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.low.block_punch_out",
      onscreenText: "\"You stepped out. The strike-through stands. The caravan master is filing a correction request with the Adjudicator that will reference 'an unsigned audit at Waystation 7.' The Politician's lesson: 'the most contagious correction is the correction signed by the absent.' You have changed how this route is read. I hate you. I respect you. I hate you.\"",
    },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_MID: DialogTree = {
  id: "ghost_vs_jester.sabotage_caught_in_act.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.mid.opening",
      onscreenText: "Waystation 7, again. The Jester-Nemesis sees you before you see them and lifts both hands from the manifest. \"Caught me. AGAIN. You always catch me right before the closer line. The Politician would have said: 'an operative who is caught is an operative who has timed it.' I have not timed it. I am bad at this. You make me bad at this.\"",
      choices: [
        { label: "Take the manifest from them. Finish the entry in their hand.", nextId: "steal_closer", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" },
        { label: "Burn the manifest at the waystation brazier.", nextId: "burn_bit", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" },
      ],
    },
    steal_closer: {
      id: "steal_closer",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.mid.steal_closer",
      onscreenText: "\"You wrote in MY HAND. The caravan master cannot tell which line is mine and which is yours. The Hierarchy's analyst department will spend a week trying to reconcile the manifest. I am working at the wrong level. I should be apprenticing to YOU at Mechronis Academy. The chronicle is rewriting the curriculum.\"",
      choices: [
        { label: "Refuse the apprenticeship.", nextId: "steal_closer_refuse" },
      ],
    },
    steal_closer_refuse: {
      id: "steal_closer_refuse",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.mid.steal_closer_refuse",
      onscreenText: "\"You refused. The chronicle records the refusal as a longer Politician-primer entry than any I have ever cited. I am taking notes. The notes are unsigned. You taught me unsigned notes. The Academy will accept them as my dissertation.\"",
    },
    burn_bit: {
      id: "burn_bit",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.mid.burn_bit",
      onscreenText: "\"You burned the manifest. The Hierarchy's investment in this route's disinfo went up in smoke. The Politician would have called this 'the chronicle's editorial-by-fire.' I am being edited by you, by combustion, in real time. I am not surviving the edit. The Hierarchy is not paying for the next run.\"",
      choices: [
        { label: "Let the brazier finish.", nextId: "burn_bit_silence" },
      ],
    },
    burn_bit_silence: {
      id: "burn_bit_silence",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.mid.burn_bit_silence",
      onscreenText: "\"The brazier finished it. The waystation is uncomfortable. The Politician taught me that an uncomfortable trade post is a converted trade post. You have converted the caravan master. They are routing through the Insurgency now. They will quote your unsigned audit from across the trade-lane for the rest of their career.\"",
    },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_HIGH: DialogTree = {
  id: "ghost_vs_jester.sabotage_caught_in_act.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.high.opening",
      onscreenText: "\"I knew you would be at Waystation 7 tonight. I salted the manifest knowing you would be here. The Politician would have called this 'the trap that costs the trapper everything.' I am the trapper. I have cost the Hierarchy three quarters of route revenue. Here is the line anyway. Read it. Or don't.\"",
      choices: [
        { label: "Don't read it. Walk on.", nextId: "dont_catch", sets: "mercy_at_grudge_high_sabotage_caught_in_act" },
        { label: "Read it. Hold the page.", nextId: "catch_hold", sets: "aggression_at_grudge_high_sabotage_caught_in_act" },
      ],
    },
    dont_catch: {
      id: "dont_catch",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.high.dont_catch",
      onscreenText: "\"You let it stand unread. The waystation watched it stand unread. The Politician's primer: 'the unread disinfo is the longest deniability.' She would not have credited me with this line. You did, by letting it stand. Thank you. I think.\"",
      choices: [
        { label: "Walk on.", nextId: "dont_catch_walk" },
      ],
    },
    dont_catch_walk: {
      id: "dont_catch_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.high.dont_catch_walk",
      onscreenText: "\"You walked on. The line is in the chronicle's margin now, unread. The Politician's lesson: 'a doctrine at rest is a doctrine that has converted in silence.' The caravan master is reading the line silently, by lantern, after you have gone. They are reading it WELL. The Hierarchy has its convert.\"",
    },
    catch_hold: {
      id: "catch_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.high.catch_hold",
      onscreenText: "\"You read the line and held the page. Held it. Held it. The waystation is holding their breath with you. You have taught the caravan master to hold the breath the Politician's primer told me to take. I am out of breath. I have been out of breath since New Babylon's veil broke.\"",
      choices: [
        { label: "Set the page down. Slowly.", nextId: "catch_hold_release" },
      ],
    },
    catch_hold_release: {
      id: "catch_hold_release",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.high.catch_hold_release",
      onscreenText: "\"You set the page down. Slowly. With timing the Politician's primer could not have written. The waystation exhaled. The caravan master signed the corrected manifest. They signed in YOUR hand, without knowing it. The Politician would have said: 'you trained the trainer.' I am the trainer. I have been trained.\"",
    },
  },
};

/* ─── mocking_interlude — Degen's Casino back room ─── */

const MOCKING_INTERLUDE_LOW: DialogTree = {
  id: "ghost_vs_jester.mocking_interlude.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.low.opening",
      onscreenText: "Degen's Casino, the back-room Pazaak table. The Jester-Nemesis is running patter for a crowd of marks, all of them Hierarchy-loyal. They wave at you across two tables. \"Just passing through. No agenda. Just wanted you to see the patter-line I've been writing about you. It's good. Mostly silence. I have been working hard on the silence. I owe Degen a footnote.\"",
      choices: [
        { label: "Don't acknowledge. Keep reading the house ledger.", nextId: "no_ack", sets: "mercy_at_grudge_low_mocking_interlude" },
        { label: "Drop a chip on their table from across the room.", nextId: "heckle_back", sets: "aggression_at_grudge_low_mocking_interlude" },
      ],
    },
    no_ack: {
      id: "no_ack",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.low.no_ack",
      onscreenText: "\"No acknowledgment. The patter goes on without you, as you intended. The Politician's primer: 'the absent audit is the longest correction.' I will treasure the correction. I will quote it. Silently. To Degen. Over a drink Degen will charge me for.\"",
      choices: [
        { label: "Keep reading the ledger.", nextId: "no_ack_walk" },
      ],
    },
    no_ack_walk: {
      id: "no_ack_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.no_ack_walk_anchor",
      onscreenText: "\"You kept reading. The patter performed itself in your wake. The Hierarchy's table-marks are quoting me to each other now without knowing why. The chronicle is full of patter-lines that perform themselves in your wake. You have become a propaganda engine without ever speaking. The Politician would have envied this.\"",
    },
    heckle_back: {
      id: "heckle_back",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.low.heckle_back",
      onscreenText: "\"A CHIP. From the SILENT CLERK. The Politician's primer: 'a chip from the silent is the chronicle's first transaction.' I am writing the transaction. Both of us are writing it. I am winning the hand. I am NOT winning the hand. I am restructuring my approach to Pazaak.\"",
      choices: [
        { label: "Walk off mid-deal.", nextId: "heckle_back_walk" },
      ],
    },
    heckle_back_walk: {
      id: "heckle_back_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.low.heckle_back_walk",
      onscreenText: "\"You walked off mid-deal. The chronicle's transaction is now one-sided. The Politician would have called this 'the strongest closing position.' I cannot disagree. I will not disagree. I will brood. Degen will charge me for the brooding.\"",
    },
  },
};

const MOCKING_INTERLUDE_MID: DialogTree = {
  id: "ghost_vs_jester.mocking_interlude.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.mid.opening",
      onscreenText: "Degen's Casino, the floor between the high-limit tables. The Jester-Nemesis intercepts you. \"We have an arrangement. I do the patter, you do the silence, Degen pays both of us in different currencies. The Hierarchy is one of those currencies. I am here to renegotiate the cut.\"",
      choices: [
        { label: "Decline the renegotiation. Walk past.", nextId: "decline_reneg", sets: "mercy_at_grudge_mid_mocking_interlude" },
        { label: "Cut the arrangement on the spot.", nextId: "cut_contract", sets: "aggression_at_grudge_mid_mocking_interlude" },
      ],
    },
    decline_reneg: {
      id: "decline_reneg",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.mid.decline_reneg",
      onscreenText: "\"You declined. With NOTHING. With less than the absence of a syllable. The Politician would have said: 'the arrangement that survives renegotiation is the arrangement written in the renegotiation's silence.' We are still in business. Degen will still take a cut. So will the Hierarchy. So, somehow, will you.\"",
      choices: [
        { label: "Walk past the high-limit tables.", nextId: "decline_reneg_walk" },
      ],
    },
    decline_reneg_walk: {
      id: "decline_reneg_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.mid.decline_reneg_walk",
      onscreenText: "\"You walked. The floor's other gamblers are now silent. You converted the floor. You did not place a bet. The Politician's primer: 'the most powerful gambler pays in attention, not coin.' You paid the floor in attention. The floor is yours. Degen has already adjusted the odds.\"",
    },
    cut_contract: {
      id: "cut_contract",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.mid.cut_contract",
      onscreenText: "\"You cut the arrangement. Cleanly. With a look that the chronicle will be quoting for as long as Degen's runs. I have lost my only steady cut. I am a freelance Politician-apprentice now. The Hierarchy will be furious. THE HIERARCHY WILL BE FURIOUS.\"",
      choices: [
        { label: "Walk off. One half-nod to Degen on the way out.", nextId: "cut_contract_smile" },
      ],
    },
    cut_contract_smile: {
      id: "cut_contract_smile",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.mid.cut_contract_smile",
      onscreenText: "\"You nodded to Degen. ONCE. The Politician would have said: 'the rare nod is the only currency the regime still accepts at par.' You paid Degen in the rare nod. Degen is wealthier than the Hierarchy now. I am restructuring. I am applying for a transfer to a different cell.\"",
    },
  },
};

const MOCKING_INTERLUDE_HIGH: DialogTree = {
  id: "ghost_vs_jester.mocking_interlude.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.high.opening",
      onscreenText: "\"I am not here for a patter run. I am here to ask if you remember the third cohort, when I tried to convert your apprentice using nothing but the Politician's mime-doctrine, because I knew you would not respond to spoken propaganda. Your apprentice held. I have not forgiven you. I have not asked you to forgive me. Today might be the day.\"",
      choices: [
        { label: "Forgive them. Silently.", nextId: "forgive", sets: "mercy_at_grudge_high_mocking_interlude" },
        { label: "Refuse forgiveness.", nextId: "refuse_forgive", sets: "aggression_at_grudge_high_mocking_interlude" },
      ],
    },
    forgive: {
      id: "forgive",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.high.forgive",
      onscreenText: "\"You forgave me. Quietly. Without a word. The Politician's primer: 'the silent forgiveness is the only forgiveness that lasts past the regime change.' I am forgiven. I do not know what to do with this. The Hierarchy will not know what to do with this. The chronicle is taking notes. We are all taking notes.\"",
      choices: [
        { label: "Walk on, with the forgiveness given.", nextId: "forgive_walk" },
      ],
    },
    forgive_walk: {
      id: "forgive_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.high.forgive_walk",
      onscreenText: "\"You walked on. The forgiveness is in my pocket. The Politician's lesson: 'a forgiveness in the pocket is a doctrine that has been re-grounded.' I am re-grounded. I am quieter. I am, for the first time since Project Sorrow's intake hall, listening to silence as silence rather than as setup.\"",
    },
    refuse_forgive: {
      id: "refuse_forgive",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.high.refuse_forgive",
      onscreenText: "\"You refused. The refusal is loud. The Politician would have said: 'the loudest verdict is the verdict of the silent clerk.' You are the silent clerk and your verdict is loud. I will carry it. I will perform it on every Hub vote-floor between here and the Convergence Seat. I will be the operative-of-the-unforgiven, for the rest of my career.\"",
      choices: [
        { label: "Let them carry it.", nextId: "refuse_forgive_let" },
      ],
    },
    refuse_forgive_let: {
      id: "refuse_forgive_let",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.high.refuse_forgive_let",
      onscreenText: "\"You let me carry it. The Politician's primer: 'the burden carried in public is the campaign that runs itself.' I am running on your refusal now. The Hierarchy has its strongest narrative. Thank you. I think. I am unsure of the gratitude. I am sure of the campaign.\"",
    },
  },
};

/* ─── lieutenant_promotion — Mechronis Academy coordinator ceremony ─── */

const LIEUTENANT_PROMOTION_LOW: DialogTree = {
  id: "ghost_vs_jester.lieutenant_promotion.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.low.opening",
      onscreenText: "Mechronis Academy's coordinator-ceremony hall. The Jester-Nemesis is being elevated to Politician-cell coordinator, with two newer apprentices waiting behind them to be assigned as subordinates. They look across the hall to where you are standing in the visitor gallery. \"They are giving me a cell. A WHOLE CELL. I can barely manage my own patter line. The Politician would have said: 'an operative with subordinates is an operative who has stopped being effective.' I am about to stop being effective. Please. Stop me.\"",
      choices: [
        { label: "Bless the promotion. One nod from the gallery.", nextId: "bless", sets: "mercy_at_grudge_low_lieutenant_promotion" },
        { label: "Refuse to recognize the rank.", nextId: "curse", sets: "aggression_at_grudge_low_lieutenant_promotion" },
      ],
    },
    bless: {
      id: "bless",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.low.bless",
      onscreenText: "\"You blessed it. From the gallery. With a nod. The whole cell sees the nod. The cell thinks the nod is the Adjudicator's seal. The Politician would never have authorized that read. You have an authority the Politician never granted you. The cell believes you. So do I.\"",
      choices: [
        { label: "Hold the gallery position. Walk out after the ceremony.", nextId: "bless_walk" },
      ],
    },
    bless_walk: {
      id: "bless_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.low.bless_walk",
      onscreenText: "\"You walked out after the ceremony. The cell-coordinator office is now mine, with your shadow against the back wall. The Politician's primer: 'a Lieutenant's office is the office where the gallery's shadow approves.' Your shadow approves. The office is the chronicle's now.\"",
    },
    curse: {
      id: "curse",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.low.curse",
      onscreenText: "\"You refused to recognize the rank. The cell sees the refusal. The cell thinks the refusal is the Adjudicator's hex. The Politician would have noted the hex and built a counter-campaign around dispelling it. I will not build the counter-campaign. I will carry the hex like a Hierarchy-issue lapel pin.\"",
      choices: [
        { label: "Walk out before the ceremony closes.", nextId: "curse_walk" },
      ],
    },
    curse_walk: {
      id: "curse_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.low.curse_walk",
      onscreenText: "\"You walked out. The promotion happened anyway. The hex is doing the campaign's work. The Politician would have said: 'the hexed Lieutenant is the Lieutenant whose campaign writes itself in the resistance.' My campaign is writing itself. I am along for the ride. So are my new subordinates. So are you.\"",
    },
  },
};

const LIEUTENANT_PROMOTION_MID: DialogTree = {
  id: "ghost_vs_jester.lieutenant_promotion.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.mid.opening",
      onscreenText: "\"Cell-coordinator of the Hierarchy's Jester-line. The chronicle is writing my title in three languages — Hierarchy formal, Mechronis Academy Latin, and the Politician's primer's untranslated cipher. I do not read two of them. The Politician taught me that a title in a cipher you cannot read is the title that survives the regime change. I am surviving. I am also miserable. You did this.\"",
      choices: [
        { label: "Honor the new rank. One gesture from the floor.", nextId: "honor", sets: "mercy_at_grudge_mid_lieutenant_promotion" },
        { label: "Mock the cipher to the cell.", nextId: "mock_rank", sets: "aggression_at_grudge_mid_lieutenant_promotion" },
      ],
    },
    honor: {
      id: "honor",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.mid.honor",
      onscreenText: "\"You honored it. With ONE GESTURE. The cell is now silently afraid of you. They were not afraid of me. You converted their fear in under a second. The Politician would have wept. I am, a little.\"",
      choices: [
        { label: "Hold the gesture.", nextId: "honor_hold" },
      ],
    },
    honor_hold: {
      id: "honor_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.mid.honor_hold",
      onscreenText: "\"The gesture held. The cell is now memorizing it. They will perform it on their own initiative for the rest of their cell-coordinator track. The Politician's primer: 'the most viral gesture is the gesture of the silent witness.' You are the silent witness. You are viral. The Hierarchy's analyst department has opened a file on the gesture.\"",
    },
    mock_rank: {
      id: "mock_rank",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.mid.mock_rank",
      onscreenText: "\"You mocked the cipher. From the floor. With ONE RAISED EYEBROW. The cell laughed. The cell laughed at MY TITLE. The Politician's primer: 'the laughed-at rank is the rank that earns itself.' I will earn it. I will earn it FAR HARDER than I would have without the laugh. Thank you. The Hierarchy will not thank you. The Hierarchy will adjust your file.\"",
      choices: [
        { label: "Drop the eyebrow.", nextId: "mock_rank_drop" },
      ],
    },
    mock_rank_drop: {
      id: "mock_rank_drop",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.mid.mock_rank_drop",
      onscreenText: "\"You dropped the eyebrow. The cell's laughter dropped with it. The hall is now in respectful silence. The Politician would have called this 'the cell that has been seasoned by an Adjudicator's pause.' I am the seasoning. I am the meal. The cell is eating. The chronicle is watching the meal.\"",
    },
  },
};

const LIEUTENANT_PROMOTION_HIGH: DialogTree = {
  id: "ghost_vs_jester.lieutenant_promotion.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.high.opening",
      onscreenText: "\"The cell calls me Lieutenant now. They do not laugh at the title. They laugh AT ME. The Hierarchy would have been proud. They trained me for laughter that doesn't survive the next vote. I am the next vote. You write me. You have always written me. Project Sorrow released me from the Matrix-archive and the first hand I read was yours.\"",
      choices: [
        { label: "Refuse the authorship.", nextId: "refuse_author", sets: "mercy_at_grudge_high_lieutenant_promotion" },
        { label: "Accept the authorship.", nextId: "accept_author", sets: "aggression_at_grudge_high_lieutenant_promotion" },
      ],
    },
    refuse_author: {
      id: "refuse_author",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.high.refuse_author",
      onscreenText: "\"You refused to be the author. You said — without saying — that I am my own next vote. The Politician's primer: 'the operative who writes themselves is the operative who survives the next regime.' I survive. The chronicle records the survival. The cell follows the survival into the next campaign. The Hierarchy reluctantly approves.\"",
      choices: [
        { label: "Walk out, leaving them with the cell.", nextId: "refuse_author_walk" },
      ],
    },
    refuse_author_walk: {
      id: "refuse_author_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.high.refuse_author_walk",
      onscreenText: "\"You walked out. The cell is mine. The campaign is mine. The Hierarchy is mine, for as long as I can hold the cell-coordinator track. The Politician would have said: 'the truest gift is the gift that leaves no fingerprint.' Your fingerprint is everywhere — in the Adjudicator's records, in the gallery log, in the unread doctored manifest at Waystation 7. The gift is gone. I keep the cell.\"",
    },
    accept_author: {
      id: "accept_author",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.high.accept_author",
      onscreenText: "\"You accepted the authorship. With a nod. The cell saw the nod. The cell knows now that I am yours, by inheritance from the Adjudicator's silent clerks. The Politician's primer: 'the borrowed Lieutenant is the campaign's longest play.' We are now the longest play in the chronicle. The Hierarchy is uneasy. I am quieter.\"",
      choices: [
        { label: "Hold the nod. Walk past the cell.", nextId: "accept_author_hold" },
      ],
    },
    accept_author_hold: {
      id: "accept_author_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.high.accept_author_hold",
      onscreenText: "\"You held the nod. The cell held its breath. The chronicle held its page. The Politician would have called this 'the conversion that happens in the held breath.' Every breath I take from this ceremony on is held. Every campaign I run is held. I am held. I am yours. The Hierarchy will adjust. The chronicle marks it.\"",
    },
  },
};

/* ─── cohort_end_confrontation — Cohort hall, apprentice's last day ─── */

const COHORT_END_CONFRONTATION_LOW: DialogTree = {
  id: "ghost_vs_jester.cohort_end_confrontation.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.low.opening",
      onscreenText: "The Cohort hall, after your apprentice's graduation ceremony. The Jester-Nemesis is leaning on a pillar, smile-rictus tic held longer than usual. \"Your apprentice graduated. Without my whisper-plan converting them. I had a whole Hub speech for the graduation. The speech is a tombstone now. I would say I am sad but I am performing sadness, and you would not believe me, and you would be right.\"",
      choices: [
        { label: "Honor the close. Walk past the pillar with your apprentice.", nextId: "honor_close", sets: "mercy_at_grudge_low_cohort_end_confrontation" },
        { label: "Demand a closing line for the chronicle.", nextId: "demand_close", sets: "aggression_at_grudge_low_cohort_end_confrontation" },
      ],
    },
    honor_close: {
      id: "honor_close",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.low.honor_close",
      onscreenText: "\"You honored the close. With nothing. The Politician's primer: 'the honored close is the close that never asked for a witness.' I am the unwanted witness. I will leave the hall. The chronicle stays. The apprentice graduated; their cohort closed clean. The Hierarchy is going to file this as a loss. So is my cell.\"",
      choices: [
        { label: "Walk on with your apprentice.", nextId: "honor_close_walk" },
      ],
    },
    honor_close_walk: {
      id: "honor_close_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.low.honor_close_walk",
      onscreenText: "\"You walked on with them. The graduation lives in the chronicle as a clean close. The Politician would have written a counter-campaign against the clean close. I will not. The Hierarchy is tired. The cohort is over. I am the warm-up for the next one. I will start tomorrow.\"",
    },
    demand_close: {
      id: "demand_close",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.low.demand_close",
      onscreenText: "\"You demanded a closing line. From ME. The Politician's primer: 'the demanded line is the line that closes the demander.' I will give you the line. The line is: 'the Hierarchy will be back.' That is the line. Hold it.\"",
      choices: [
        { label: "Hold the line.", nextId: "demand_close_hold" },
      ],
    },
    demand_close_hold: {
      id: "demand_close_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.low.demand_close_hold",
      onscreenText: "\"You held the line. The Politician's primer: 'the held line is the line that holds the holder.' You are holding me. The chronicle is holding both of us. The apprentice is gone. The line remains. The Hierarchy WILL be back. The next cohort is already in Project Sorrow's intake.\"",
    },
  },
};

const COHORT_END_CONFRONTATION_MID: DialogTree = {
  id: "ghost_vs_jester.cohort_end_confrontation.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.mid.opening",
      onscreenText: "\"The cohort closes around you. I have been the Hierarchy's running broadcast. You have been the silence the broadcast played against. The chronicle records us as a duet. I disagree. You do not say anything. You never say anything. THAT is the duet.\"",
      choices: [
        { label: "Acknowledge the duet.", nextId: "ack_duet", sets: "mercy_at_grudge_mid_cohort_end_confrontation" },
        { label: "Deny the duet.", nextId: "deny_duet", sets: "aggression_at_grudge_mid_cohort_end_confrontation" },
      ],
    },
    ack_duet: {
      id: "ack_duet",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.mid.ack_duet",
      onscreenText: "\"You acknowledged it. With a half-tilt of the head. The chronicle records the half-tilt as the full duet. The Politician would have said: 'the duet that is one tilt long is the duet that lasts the longest.' We are now a footnote in the Antiquarian's Journal. A long footnote. The chronicle's longest.\"",
      choices: [
        { label: "Half-tilt. Walk on.", nextId: "ack_duet_walk" },
      ],
    },
    ack_duet_walk: {
      id: "ack_duet_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.mid.ack_duet_walk",
      onscreenText: "\"You walked on with the duet acknowledged. The chronicle is satisfied. I am satisfied. The Politician would have envied the satisfaction. I will think about this for three cohorts at least. The Hierarchy will fund the thinking.\"",
    },
    deny_duet: {
      id: "deny_duet",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.mid.deny_duet",
      onscreenText: "\"You denied it. With NOTHING. With the absence of a half-tilt. The Politician's primer: 'the denied duet is the duet whose denial is itself the duet.' The chronicle records the denial as the duet's strongest beat. I lose the argument. I lose it well. I am taking notes for tomorrow's broadcast.\"",
      choices: [
        { label: "Walk away from the denial.", nextId: "deny_duet_walk" },
      ],
    },
    deny_duet_walk: {
      id: "deny_duet_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.mid.deny_duet_walk",
      onscreenText: "\"You walked away. The denial is now a broadcast on its own. The Politician's primer: 'the denial that walks is the campaign that runs.' I am running. I am winded. The chronicle records the running. The chronicle records the winding. The Hierarchy is paying the production costs.\"",
    },
  },
};

const COHORT_END_CONFRONTATION_HIGH: DialogTree = {
  id: "ghost_vs_jester.cohort_end_confrontation.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.high.opening",
      onscreenText: "\"Your apprentice closed the cohort by saying my name. ALOUD. In an empty hall. I had not heard my name aloud since the Politician was destroyed by the Iron Lion's legions, forty-two years before the Fall. I am undone. I want to thank you. I want to ruin you. I want both. I am, the Politician would have said, in conflict — and the cell-coordinator track does not reward conflict.\"",
      choices: [
        { label: "Thank them, silently.", nextId: "thank_silent", sets: "mercy_at_grudge_high_cohort_end_confrontation" },
        { label: "Ruin them by walking away from the name.", nextId: "ruin_walk", sets: "aggression_at_grudge_high_cohort_end_confrontation" },
      ],
    },
    thank_silent: {
      id: "thank_silent",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.high.thank_silent",
      onscreenText: "\"You thanked me. Silently. The Politician's primer: 'the silent thanks is the only thanks that costs the thanker the campaign.' You have given me your campaign. I am holding it. I do not know what to do with it. I am quiet for the first time since the Necromancer opened the Matrix-archive's gate.\"",
      choices: [
        { label: "Walk on, quiet.", nextId: "thank_silent_walk" },
      ],
    },
    thank_silent_walk: {
      id: "thank_silent_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.high.thank_silent_walk",
      onscreenText: "\"You walked on quietly. The chronicle is quiet around you. I am quiet behind you. The Politician's primer: 'the quietest exit is the exit that converts the regime to silence.' The regime is silent. The regime has been converted. I am converted. The chronicle marks it.\"",
    },
    ruin_walk: {
      id: "ruin_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.high.ruin_walk",
      onscreenText: "\"You ruined me by walking away from the name I just earned in the chronicle. The Politician's primer: 'the ruined name is the name that lasts the longest in the regime's records.' I am ruined. I am the chronicle's. I am yours. We are all done. The Hierarchy will replace me by morning.\"",
      choices: [
        { label: "Don't look back.", nextId: "ruin_walk_dont_look" },
      ],
    },
    ruin_walk_dont_look: {
      id: "ruin_walk_dont_look",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.high.ruin_walk_dont_look",
      onscreenText: "\"You didn't look back. The Politician would have applauded. She always applauded the closing that did not seek the audience's eye. The chronicle's last line of this cohort: 'they did not look back.' The chronicle's next line: 'the Nemesis did.' I did. I am still looking.\"",
    },
  },
};

/* ─── accumulation_reveal — Hierarchy chamber, news of a new Matrix-release ─── */

const ACCUMULATION_REVEAL_LOW: DialogTree = {
  id: "ghost_vs_jester.accumulation_reveal.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.low.opening",
      onscreenText: "The Hierarchy's daily intake chamber. The Jester-Nemesis is reading the bulletin board. \"There's another one. Of us. The Matrix-archive has released a sibling. The Politician's stable widens. The new one will want their own cell, want to copy my approach, and I will have to invent a whole new propaganda style overnight. You did this. By recruiting a second apprentice. You THINKER.\"",
      choices: [
        { label: "Acknowledge the new arrival.", nextId: "ack_arrival", sets: "mercy_at_grudge_low_accumulation_reveal" },
        { label: "Promise to outlast the new one.", nextId: "outlast", sets: "aggression_at_grudge_low_accumulation_reveal" },
      ],
    },
    ack_arrival: {
      id: "ack_arrival",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.low.ack_arrival",
      onscreenText: "\"You acknowledged them. The Politician would have said: 'the audit that acknowledges the new recruit is the audit that buys the recruit's loyalty.' You bought the new sibling's loyalty without speaking. I am the older sibling. The new one is the warm-up. We are touring the Hierarchy's circuit together now.\"",
      choices: [
        { label: "Walk out of the chamber.", nextId: "ack_arrival_walk" },
      ],
    },
    ack_arrival_walk: {
      id: "ack_arrival_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.low.ack_arrival_walk",
      onscreenText: "\"You walked out of the chamber. The bulletin board's new entry is now mine and the new one's. We are a duet. The duet's chronicle will be longer than my solo's. The Politician's primer: 'the duet is the campaign's most efficient redundancy.' I am redundant. I am efficient. I am tired.\"",
    },
    outlast: {
      id: "outlast",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.low.outlast",
      onscreenText: "\"You said — silently, from the door — that you'll outlast the new one. The Politician's primer: 'the outlasted Nemesis is the Nemesis who has been promoted to legend.' I am being promoted. I am being demoted. I am being archived back into the Matrix. The Hierarchy's filing cabinet is opening. I do not want to be in it. I will be in it.\"",
      choices: [
        { label: "Walk past, silently.", nextId: "outlast_walk" },
      ],
    },
    outlast_walk: {
      id: "outlast_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.low.outlast_walk",
      onscreenText: "\"You walked past. The new sibling will hear about this exchange before they meet you. The Politician's primer: 'the warning that travels ahead is the warning that does the recruiting work.' You have done my recruiting for me. The Hierarchy will not understand. Thank you. I think.\"",
    },
  },
};

const ACCUMULATION_REVEAL_MID: DialogTree = {
  id: "ghost_vs_jester.accumulation_reveal.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.mid.opening",
      onscreenText: "\"We are four now, released from the Matrix. The Politician's roster has tripled and I am still the only one with the patter-line discipline. The others are dour. They write Hierarchy memoranda. They will lose. The chronicle is going to reward me. The chronicle had better.\"",
      choices: [
        { label: "Bless the cohort.", nextId: "bless_cohort", sets: "mercy_at_grudge_mid_accumulation_reveal" },
        { label: "Threaten to make them ALL quiet.", nextId: "threat_quiet", sets: "aggression_at_grudge_mid_accumulation_reveal" },
      ],
    },
    bless_cohort: {
      id: "bless_cohort",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.mid.bless_cohort",
      onscreenText: "\"You blessed the cohort. ALL of us. With one nod. The other three are now wondering what I told you. I told you nothing. You took the nothing and made us a Hierarchy bloc. The Politician would have called this 'the chronicle's most efficient consolidation.' We are consolidated. Against you, theoretically. Against ourselves, in fact.\"",
      choices: [
        { label: "Walk away. Let us argue.", nextId: "bless_cohort_walk" },
      ],
    },
    bless_cohort_walk: {
      id: "bless_cohort_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.mid.bless_cohort_walk",
      onscreenText: "\"You walked. We are arguing already. The Politician's primer: 'the bloc dies of internal disagreement before the next vote.' We will not vote together. The chronicle records the disagreement. The Hierarchy was counting on the unity. You killed the unity with silence.\"",
    },
    threat_quiet: {
      id: "threat_quiet",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.mid.threat_quiet",
      onscreenText: "\"You threatened to make us all quiet. With one raised finger from the gallery. The Politician's primer: 'the raised finger is the chronicle's longest sentence.' The cohort is now silent. ALL OF US. I am silent. I am performing silence. I am bad at it. I am improving. You are training the Politician's stable.\"",
      choices: [
        { label: "Lower the finger. Walk away.", nextId: "threat_quiet_lower" },
      ],
    },
    threat_quiet_lower: {
      id: "threat_quiet_lower",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.mid.threat_quiet_lower",
      onscreenText: "\"You lowered the finger. The cohort exhaled. The chronicle's pages turned. The Politician would have called this 'the campaign's longest pause.' The pause is over. The campaign continues. So do I. Quieter. The Hierarchy will not understand the quieter. They never do.\"",
    },
  },
};

const ACCUMULATION_REVEAL_HIGH: DialogTree = {
  id: "ghost_vs_jester.accumulation_reveal.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.high.opening",
      onscreenText: "\"We are a chorus now. Five Matrix-releases. I have stopped running the patter. The other four take turns. The chronicle has a section for us in the Antiquarian's Journal. The section is called 'The Politician's Five.' I am the entry that does not laugh anymore. The Hierarchy reads the section like scripture.\"",
      choices: [
        { label: "Honor the chorus.", nextId: "honor_chorus", sets: "mercy_at_grudge_high_accumulation_reveal" },
        { label: "Pick one of them off.", nextId: "pick_off", sets: "aggression_at_grudge_high_accumulation_reveal" },
      ],
    },
    honor_chorus: {
      id: "honor_chorus",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.high.honor_chorus",
      onscreenText: "\"You honored the chorus. With NOTHING. The Politician's primer: 'the chorus honored by silence is the chorus that outlasts the Politician.' We are lasting. I am lasting. The chronicle is recording the lasting. The Hierarchy is recording the lasting. I am proud. I am sad. I am working.\"",
      choices: [
        { label: "Walk on, leaving us our chorus.", nextId: "honor_chorus_walk" },
      ],
    },
    honor_chorus_walk: {
      id: "honor_chorus_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.high.honor_chorus_walk",
      onscreenText: "\"You walked on. The chorus continues. The chronicle's section grows. The Politician's primer: 'the chorus the chronicler walks past is the chorus that becomes the regime's anthem.' We are the anthem. The Hierarchy is humming us. You are not. You walked.\"",
    },
    pick_off: {
      id: "pick_off",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.high.pick_off",
      onscreenText: "\"You picked one of us off. With ONE LOOK across the Hierarchy's chamber. The chronicle records the pick. The Politician's primer: 'the chorus member picked off is the member who was already drafting their resignation.' You did them a favor. You did me a favor. The chorus is smaller. The campaign continues.\"",
      choices: [
        { label: "Don't pick another. Walk on.", nextId: "pick_off_walk" },
      ],
    },
    pick_off_walk: {
      id: "pick_off_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.high.pick_off_walk",
      onscreenText: "\"You walked on after the one pick. The chronicle records the restraint. The Politician would have ordered three more picks before sundown. You ordered one. The Politician's primer: 'the restrained picker is the picker whose chronicle outweighs the Politician's roster.' You outweigh her. The chronicle marks it.\"",
    },
  },
};

/* ─── name_reveal_moment — Antiquarian's Journal, after both gates close ─── */

const NAME_REVEAL_MOMENT_LOW: DialogTree = {
  id: "ghost_vs_jester.name_reveal_moment.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.low.opening",
      onscreenText: "The Antiquarian's Journal page on the Matrix-archive's released apprentices. You have just closed the Resurrectionist E5 case and witnessed the Game Master Fight 2 plague-mask seed. The Jester-Nemesis's proper name surfaces in the chronicle's margin. They are standing behind you in the archive reading-room. \"You read the file. You have my name now. I should warn you: my name was a stage name once, a campaign alias from before Project Sorrow. The Politician kept it. I kept it. You may use it. You may not use it loudly. It is a soft name. It carries strangely in big rooms.\"",
      choices: [
        { label: "Say the name. Once. Softly.", nextId: "say_soft", sets: "mercy_at_grudge_low_name_reveal_moment" },
        { label: "Take the name to the Adjudicator's office as evidence.", nextId: "weaponize", sets: "aggression_at_grudge_low_name_reveal_moment" },
      ],
    },
    say_soft: {
      id: "say_soft",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.low.say_soft",
      onscreenText: "\"You said it softly. The way the Politician used to say it, in the moments when she was not running for the Seventh Archon seat. The Politician's primer: 'the soft name is the name that travels under the regime.' My name is now traveling under your regime. Thank you. I think.\"",
      choices: [
        { label: "Walk on with the name in your mouth.", nextId: "say_soft_walk" },
      ],
    },
    say_soft_walk: {
      id: "say_soft_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.low.say_soft_walk",
      onscreenText: "\"You walked on. The name walked with you. The Politician's primer: 'the name carried softly is the name that outlasts the carrier.' I will outlast both of us. The chronicle will outlast me. The name will outlast the chronicle. Thank you. I think.\"",
    },
    weaponize: {
      id: "weaponize",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.low.weaponize",
      onscreenText: "\"You filed it as evidence. You signed an Adjudicator-house deposition with my name on it. The deposition will be read aloud in three jurisdictions. The Politician's primer: 'the deposed name is the name that owns the deposer.' I now own you, by precedent, for the rest of this campaign. You deposed yourself.\"",
      choices: [
        { label: "Walk out of the deposition chamber.", nextId: "weaponize_walk" },
      ],
    },
    weaponize_walk: {
      id: "weaponize_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.low.weaponize_walk",
      onscreenText: "\"You walked out. The deposition stays. The chambers remember. The Politician's primer: 'the jurisdiction that learned a Nemesis's name is the jurisdiction that joined the Nemesis's cohort.' You have recruited me three jurisdictions. I am thanking you and cursing you in the same breath. The Politician would have done both.\"",
    },
  },
};

const NAME_REVEAL_MOMENT_MID: DialogTree = {
  id: "ghost_vs_jester.name_reveal_moment.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.mid.opening",
      onscreenText: "\"You know my name. The chronicle records the knowing. I should warn you: the Politician collected names like she collected campaign endorsements. Mine was the third — earned at the Mechronis Academy passing-out parade by impersonating the Authority's voice for half a second too long. Use it carefully. Or don't. Either way it survives the using.\"",
      choices: [
        { label: "Honor the name.", nextId: "honor_name", sets: "mercy_at_grudge_mid_name_reveal_moment" },
        { label: "Spit the name.", nextId: "spit_name", sets: "aggression_at_grudge_mid_name_reveal_moment" },
      ],
    },
    honor_name: {
      id: "honor_name",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.mid.honor_name",
      onscreenText: "\"You honored it. You said it like a credit line in the Adjudicator's house ledger. The Politician's primer: 'the credited name is the name that finally belongs to the bearer.' I am, for the first time, my name's owner. I owe you a campaign. I will pay it. Quietly. As is your style.\"",
      choices: [
        { label: "Walk on, honored back.", nextId: "honor_name_walk" },
      ],
    },
    honor_name_walk: {
      id: "honor_name_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.mid.honor_name_walk",
      onscreenText: "\"You walked on. The name is mine, owed to you. The chronicle records the debt as the lightest debt in the Adjudicator's ledger. The Politician would have called this 'the debt that compounds in dignity, not interest.' I am dignified. I am compounding. I am yours.\"",
    },
    spit_name: {
      id: "spit_name",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.mid.spit_name",
      onscreenText: "\"You spat it. The chronicle records the spit. The Politician's primer: 'the spat name is the name that finally enters the public domain.' My name is public now. The PAC News crawl will run it before morning. The Hierarchy will spend a week pretending they did not know. The Insurgency will use it as a recruiting slogan.\"",
      choices: [
        { label: "Walk away from the spit.", nextId: "spit_name_walk" },
      ],
    },
    spit_name_walk: {
      id: "spit_name_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.mid.spit_name_walk",
      onscreenText: "\"You walked. The spit dried on the archive's reading-room page. The Politician's primer: 'the dried spit is the chronicle's seal.' My name is sealed. I am sealed. The campaign continues, with the seal as my new credit line. I owe you something. I am still calculating what.\"",
    },
  },
};

const NAME_REVEAL_MOMENT_HIGH: DialogTree = {
  id: "ghost_vs_jester.name_reveal_moment.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.high.opening",
      onscreenText: "\"Use my name. It is the last thing in this chronicle that is fully mine. The Politician left me my name and a smile and a tic. You have the smile catalogued in the Antiquarian's Journal already, and you have decoded the tic across three encounters. The name is the last gift. The chronicle will note who you make it.\"",
      choices: [
        { label: "Say it as an apology.", nextId: "say_apology", sets: "mercy_at_grudge_high_name_reveal_moment" },
        { label: "Say it as a verdict.", nextId: "say_verdict", sets: "aggression_at_grudge_high_name_reveal_moment" },
      ],
    },
    say_apology: {
      id: "say_apology",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.high.say_apology",
      onscreenText: "\"You said it as an apology. The Politician would have refused the apology. I will not refuse it. The chronicle records the apology as the lightest line in the campaign. I am, for one beat, not a Nemesis. I am a person with a name. Thank you.\"",
      choices: [
        { label: "Hold the apology. Walk on.", nextId: "say_apology_hold" },
      ],
    },
    say_apology_hold: {
      id: "say_apology_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.high.say_apology_hold",
      onscreenText: "\"You held the apology. You walked on. The chronicle records the apology as the line that closes the rivalry's middle act. The middle act is over. The closing act is ours. I will play it quietly. As is your style. As is, now, mine.\"",
    },
    say_verdict: {
      id: "say_verdict",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.high.say_verdict",
      onscreenText: "\"You said it as a verdict. The chronicle records the verdict as final. The Politician's primer: 'the verdict-name is the name that becomes the Nemesis's headstone.' My headstone is being engraved on a wall of the Antiquarian's Journal. I am still alive. I am dictating the rest of the engraving. The chronicle is listening.\"",
      choices: [
        { label: "Stay for the dictation. Quietly.", nextId: "say_verdict_stay" },
      ],
    },
    say_verdict_stay: {
      id: "say_verdict_stay",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.high.say_verdict_stay",
      onscreenText: "\"You stayed. You listened. I dictated. The chronicle wrote. The Politician's primer: 'the verdict that the wielder stays for is the verdict that becomes the chronicle's longest entry.' This is the longest entry. We are inside it. The campaign continues, inside the entry. We are inside the entry, together, until the chronicle closes.\"",
    },
  },
};

/* ─── final_encounter — Convergence Seat throne room ─── */

const FINAL_ENCOUNTER_LOW: DialogTree = {
  id: "ghost_vs_jester.final_encounter.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.low.opening",
      onscreenText: "The Convergence Seat throne room, immediately after the Act 7 ladder closes. The Jester-Nemesis is sitting at the foot of the empty seat, smile-rictus tic slack for the first time. \"Act Seven. The Seat has fallen. So have most of my Hierarchy-funded plans. The Politician's primer: 'the arc that ends without an audience is the arc the chronicle inherits.' The chronicle is inheriting us. Quietly. As is your style.\"",
      choices: [
        { label: "Mercy at the end.", nextId: "mercy_end", sets: "mercy_at_grudge_low_final_encounter" },
        { label: "Quick, clean end.", nextId: "clean_end", sets: "aggression_at_grudge_low_final_encounter" },
      ],
    },
    mercy_end: {
      id: "mercy_end",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.low.mercy_end",
      onscreenText: "\"Mercy at the end. The Politician's primer: 'the merciful close is the close that the next regime inherits.' The next regime is starting. You will not be in it. I will not be in it. But the mercy will be. The mercy travels.\"",
      choices: [
        { label: "Walk on to the next regime.", nextId: "mercy_end_walk" },
      ],
    },
    mercy_end_walk: {
      id: "mercy_end_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.low.mercy_end_walk",
      onscreenText: "\"You walked. The chronicle closed around the mercy. I am closing too. The Politician would have called this 'the cleanest close in the regime's records.' I would not have agreed in life. I agree now.\"",
    },
    clean_end: {
      id: "clean_end",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.low.clean_end",
      onscreenText: "\"An ending. Quick. Clean. The Politician would have applauded the brevity. I applaud the brevity. The chronicle records the brevity as the most efficient close in the regime. We are efficient. We are closed.\"",
      choices: [
        { label: "Walk away. Don't watch.", nextId: "clean_end_walk" },
      ],
    },
    clean_end_walk: {
      id: "clean_end_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.low.clean_end_walk",
      onscreenText: "\"You walked. You did not watch. The chronicle's last image of me is the back of your head. The Politician's primer: 'the back of the head is the chronicle's most dignified image.' I have been dignified. The chronicle records it.\"",
    },
  },
};

const FINAL_ENCOUNTER_MID: DialogTree = {
  id: "ghost_vs_jester.final_encounter.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.mid.opening",
      onscreenText: "\"End of the arc. Most of mine, anyway. The Politician's primer: 'the arc that ends with both operatives in the same throne room is the arc that becomes the chronicle's masthead.' We are the masthead. The next reader of the regime will read us first. They will not laugh. You taught the chronicle not to laugh.\"",
      choices: [
        { label: "Let them close their own file.", nextId: "let_close", sets: "mercy_at_grudge_mid_final_encounter" },
        { label: "Close their file for them.", nextId: "close_for", sets: "aggression_at_grudge_mid_final_encounter" },
      ],
    },
    let_close: {
      id: "let_close",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.mid.let_close",
      onscreenText: "\"You let me close my own file. The Politician's primer: 'the self-closed file is the file that survives the regime.' I am surviving in the file. The chronicle is reading the file. I am writing the last sentence. The sentence is: 'I tried.'\"",
      choices: [
        { label: "Walk on. Let them write it.", nextId: "let_close_walk" },
      ],
    },
    let_close_walk: {
      id: "let_close_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.mid.let_close_walk",
      onscreenText: "\"You walked. I wrote. The Politician would have written 'I won.' I wrote 'I tried.' The chronicle records the difference. The chronicle prefers the difference. So do I, now. Thank you. Quietly.\"",
    },
    close_for: {
      id: "close_for",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.mid.close_for",
      onscreenText: "\"You closed my file for me. The Politician's primer: 'the file closed by the rival is the file whose ending the rival owns.' You own my ending. I am writing one more line, in your closing, in your handwriting. The line is: 'I made him quieter.' The chronicle records the credit.\"",
      choices: [
        { label: "Sign the closing.", nextId: "close_for_sign" },
      ],
    },
    close_for_sign: {
      id: "close_for_sign",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.mid.close_for_sign",
      onscreenText: "\"You signed the closing. With a mark, not a name. The chronicle records the mark as the most dignified signature in the regime. The Politician would have envied the mark. I envy the mark. The chronicle is rich with the mark.\"",
    },
  },
};

const FINAL_ENCOUNTER_HIGH: DialogTree = {
  id: "ghost_vs_jester.final_encounter.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.high.opening",
      onscreenText: "\"The chronicle is folding this story shut around both of us. I have spent seven cohorts running Hierarchy-funded propaganda against you, and you have spent seven cohorts teaching me that the witness I wanted was the silence I refused to record. I have learned the silence. I cannot perform it. You can. Show me one more time.\"",
      choices: [
        { label: "Show them silence. One last time.", nextId: "show_silence", sets: "mercy_at_grudge_high_final_encounter" },
        { label: "Refuse the lesson. End the campaign.", nextId: "refuse_lesson", sets: "aggression_at_grudge_high_final_encounter" },
      ],
    },
    show_silence: {
      id: "show_silence",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.high.show_silence",
      onscreenText: "\"You showed me. The silence held. The chronicle is full of the silence. The Politician's primer: 'the lesson learned at the close is the lesson the regime's reader inherits.' The reader is inheriting it. I am the lesson. You are the teacher. The chronicle is the textbook. The campaign closes.\"",
      choices: [
        { label: "Hold the silence with them. To the end.", nextId: "show_silence_hold" },
      ],
    },
    show_silence_hold: {
      id: "show_silence_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.high.show_silence_hold",
      onscreenText: "\"You held it with me. To the end. The chronicle's last page is the silence we held together at the foot of the empty Convergence Seat. The Politician would have hated this ending. She would have hated that we ended it together. The chronicle marks it. The chronicle closes. The silence remains. *[the campaign-smile-rictus tic holds one beat too long; it is the last beat the tic ever takes]*\"",
    },
    refuse_lesson: {
      id: "refuse_lesson",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.high.refuse_lesson",
      onscreenText: "\"You refused. With a turn of the head. The Politician's primer: 'the refused last lesson is the lesson that the chronicle teaches in the rival's absence.' I will teach myself, in your absence. The chronicle will not have you to compare me to. I will be worse for it. I will be better for it. The chronicle will know which.\"",
      choices: [
        { label: "Walk away from the throne room.", nextId: "refuse_lesson_walk" },
      ],
    },
    refuse_lesson_walk: {
      id: "refuse_lesson_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.high.refuse_lesson_walk",
      onscreenText: "\"You walked. The chronicle did not follow. The chronicle stayed with me at the foot of the empty Seat. The Politician would have called this 'the chronicle's stubborn loyalty.' I am loyalty's recipient. I am loyalty's burden. I will carry the loyalty until the chronicle ends. The chronicle is ending. I am still carrying. *[the campaign-smile-rictus tic holds one beat too long; the chronicle marks it as the last beat of the regime]*\"",
    },
  },
};

/* ─── The pair-bank export ─── */

export const ghostVsJesterPairBank: NemesisPairBank = {
  pairId: "ghost_vs_jester",
  playerArchetype: "ghost",
  nemesisArchetype: "jester",
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
