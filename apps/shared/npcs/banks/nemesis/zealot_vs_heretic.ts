/* ═══════════════════════════════════════════════════════
   ZEALOT-PLAYER vs. HERETIC-NEMESIS — Phase K Wave 7A (canon-deepened)

   The reverse rival-faiths axis. Player is the Hierarchy
   orthodox enforcer — files Points of Order at the Hub,
   audits cell-coordinators, signs every position taken.
   Nemesis is an Insurgency-aligned reformer who reads
   forbidden Antiquarian's Journal excerpts on PAC News
   and argues — eloquently, dangerously — that the
   Politician's primer documented its own failure.

   Surfaces mirror the heretic_vs_zealot pairing.
   ═══════════════════════════════════════════════════════ */

import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

/* ─── first_sighting — Hub vote-floor, your orthodox sermon ─── */

const FIRST_SIGHTING_LOW: DialogTree = {
  id: "zealot_vs_heretic.first_sighting.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.low.opening",
      onscreenText: "The Hub vote-floor. You have just finished an orthodox citation of the Politician's primer's seventh chapter. The Heretic-Nemesis rises from the heretic gallery and does not sign the log before speaking. \"Point of Order — but not the orthodox kind. You read chapter seven as doctrine. The Politician's primer's own footnotes read it as a warning. I have brought the footnotes. The chamber would like to hear them.\"",
      choices: [
        { label: "Yield the floor for the footnotes.", nextId: "yield_floor", sets: "mercy_at_grudge_low_first_sighting" },
        { label: "File a Point of Order against an unsigned speaker.", nextId: "file_unsigned", sets: "aggression_at_grudge_low_first_sighting" },
      ],
    },
    yield_floor: {
      id: "yield_floor",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.low.yield_floor",
      onscreenText: "\"You yielded. Without filing a procedural objection. The orthodox bench is whispering. The Politician's primer: 'the yielded floor is the floor that the orthodoxy will spend three sessions reclaiming.' I have the floor now. I will be careful with it.\"",
      choices: [
        { label: "Sit and audit the reading.", nextId: "yield_floor_audit" },
      ],
    },
    yield_floor_audit: {
      id: "yield_floor_audit",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.low.yield_floor_audit",
      onscreenText: "\"You audited the reading. In the orthodox manner, with marginal annotations. The footnotes I read tonight will be in your audit by morning. The Politician's primer: 'the audited heresy is the heresy the orthodoxy has begun to learn from.' Learn carefully. The Hierarchy is reading your audit.\"",
    },
    file_unsigned: {
      id: "file_unsigned",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.low.file_unsigned",
      onscreenText: "\"You filed against an unsigned speaker. The procedure is sound. The Hierarchy's house rules permit it. The Politician's primer: 'the heretic who refuses to sign is the heretic the orthodoxy can silence by procedure.' You can silence me. I have brought the footnotes anyway. The chamber heard them in the seconds before your filing landed.\"",
      choices: [
        { label: "Strike the heretic's seconds from the record.", nextId: "strike_seconds" },
      ],
    },
    strike_seconds: {
      id: "strike_seconds",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.low.strike_seconds",
      onscreenText: "\"The seconds are stricken. The chamber's stenographer corrects the transcript. The Hierarchy will be pleased. The Politician's primer: 'the stricken seconds are the seconds that the next sermon will quote.' Your next sermon will quote me. Through the strike. Unavoidably.\"",
    },
  },
};

const FIRST_SIGHTING_MID: DialogTree = {
  id: "zealot_vs_heretic.first_sighting.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.mid.opening",
      onscreenText: "\"Three sessions of opposing readings. The Hub stenographer has begun marking my interjections with the orthodox-house symbol, against procedure. The Hierarchy is furious; the heretic gallery is delighted. The Politician's primer: 'the misfiled symbol is the chronicle's most accurate citation.' I am being filed as orthodox. You are being filed as my opposition. We have switched, on paper.\"",
      choices: [
        { label: "Petition for the correct filing.", nextId: "petition_correct", sets: "mercy_at_grudge_mid_first_sighting" },
        { label: "Let the misfiling stand.", nextId: "let_misfile", sets: "aggression_at_grudge_mid_first_sighting" },
      ],
    },
    petition_correct: {
      id: "petition_correct",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.mid.petition_correct",
      onscreenText: "\"You petitioned. The Hierarchy is reviewing. The stenographer is reviewing. The Politician's primer: 'the orthodox who petitions to correct a heretic's misfiling is the orthodox who has stopped being one for the duration of the petition.' For the duration: we are colleagues.\"",
      choices: [
        { label: "Hold the colleague-status until ruling.", nextId: "petition_correct_hold" },
      ],
    },
    petition_correct_hold: {
      id: "petition_correct_hold",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.mid.petition_correct_hold",
      onscreenText: "\"You held it. The ruling came back: 'symbol filed in error; both rivals temporarily marked as procedural co-authors.' The Hierarchy denies the ruling. The chamber records the denial. The Politician's primer: 'the denied ruling is the ruling that becomes the chronicle's binding precedent.' We are precedent.\"",
    },
    let_misfile: {
      id: "let_misfile",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.mid.let_misfile",
      onscreenText: "\"You let it stand. The orthodoxy is now filed as heresy. The heresy is now filed as orthodoxy. The Hierarchy is preparing a procedural emergency. The Insurgency is preparing a celebration. The Politician's primer: 'the misfiling that the orthodox does not correct is the schism made permanent.' We are permanent.\"",
      choices: [
        { label: "Walk on with the misfiling permanent.", nextId: "let_misfile_walk" },
      ],
    },
    let_misfile_walk: {
      id: "let_misfile_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.mid.let_misfile_walk",
      onscreenText: "\"You walked. The misfiling stands. The chronicle is now a record of two operatives who let the procedure flip them and did not flip back. The Politician's primer: 'the unflipped flip is the chronicle's longest joke.' I am laughing. Quietly. In the orthodox cadence.\"",
    },
  },
};

const FIRST_SIGHTING_HIGH: DialogTree = {
  id: "zealot_vs_heretic.first_sighting.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.high.opening",
      onscreenText: "\"I have stopped bringing footnotes. The heretic gallery is furious. I sit through your sermons in silence now. The Politician's primer: 'the heretic who falls silent is the heretic whose footnotes have all been entered into the orthodox record.' My footnotes are now your citations. The Hierarchy is reading them.\"",
      choices: [
        { label: "Offer them the orthodox bench for a session.", nextId: "offer_bench", sets: "mercy_at_grudge_high_first_sighting" },
        { label: "Push for an exile vote.", nextId: "push_exile", sets: "aggression_at_grudge_high_first_sighting" },
      ],
    },
    offer_bench: {
      id: "offer_bench",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.high.offer_bench",
      onscreenText: "\"You offered me the orthodox bench. For a full session. To say my own doctrine, from the position I have spent seven cohorts opposing. The Politician's primer: 'the orthodox who seats the heretic on the orthodox bench is the orthodox who has admitted the schism was procedural.' I accept the seat. I will use it carefully.\"",
      choices: [
        { label: "Sit in the heretic gallery for the session.", nextId: "offer_bench_sit" },
      ],
    },
    offer_bench_sit: {
      id: "offer_bench_sit",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.high.offer_bench_sit",
      onscreenText: "\"You sat in the heretic gallery. From the seat where I had heckled you for seven cohorts. The chronicle records the seating as 'the chamber's first symmetric audit.' The Hierarchy will rewrite the procedure manual. The Insurgency will rewrite their pamphlets. The Politician would have approved of both rewrites.\"",
    },
    push_exile: {
      id: "push_exile",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.high.push_exile",
      onscreenText: "\"You pushed for the exile vote. From the orthodox bench. Against the silent heretic. The Politician's primer: 'the orthodox who exiles the silent is the orthodox who has admitted the silence was correct.' I will accept the exile. I will not contest. You have won the procedure. You have lost the audit.\"",
      choices: [
        { label: "Take the loss in silence.", nextId: "push_exile_take" },
      ],
    },
    push_exile_take: {
      id: "push_exile_take",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.first_sighting.high.push_exile_take",
      onscreenText: "\"You took the loss in silence. The chronicle records the silence as 'the orthodox's only true conversion.' I am exiled. The Insurgency has no use for an exile who refused to fight the exile. I will operate alone, as I always should have. Thank you. The Politician's primer would have called this 'the chamber's longest gift.'\"",
    },
  },
};

/* ─── sabotage_caught_in_act — Antiquarian's reading room (you are auditing) ─── */

const SABOTAGE_CAUGHT_IN_ACT_LOW: DialogTree = {
  id: "zealot_vs_heretic.sabotage_caught_in_act.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.low.opening",
      onscreenText: "The Antiquarian's reading room, after hours. You are conducting a Hierarchy audit. The Heretic-Nemesis is at a chained desk with a forbidden chapter open and a transcription quill in their hand. They do not stop writing as you enter. \"You are doing the audit yourself tonight. The Politician's primer: 'the orthodox who runs their own audit is the orthodox who has begun to read what they were auditing.' Read what I am transcribing. It is in your reach.\"",
      choices: [
        { label: "Read the transcription. Sit beside them.", nextId: "read_sit", sets: "mercy_at_grudge_low_sabotage_caught_in_act" },
        { label: "Seize the quill. Halt the transcription.", nextId: "seize_quill", sets: "aggression_at_grudge_low_sabotage_caught_in_act" },
      ],
    },
    read_sit: {
      id: "read_sit",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.low.read_sit",
      onscreenText: "\"You sat. You read. The chapter is on the chronicle's reading of the seventh-Archon vacancy. The Politician's primer: 'the read forbidden chapter is the chapter the regime cannot un-read.' We have un-readers, but no one can un-read what two operatives read together. The chronicle is now contaminated. Beautifully.\"",
      choices: [
        { label: "Close the chapter. Walk out together.", nextId: "read_sit_close" },
      ],
    },
    read_sit_close: {
      id: "read_sit_close",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.low.read_sit_close",
      onscreenText: "\"You closed the chapter. We walked out together. The Antiquarian's wards did not trigger; the wards understood the symmetry. The chronicle records: 'the rivals who read together do not trigger the wards.' The Hierarchy is reading the ward log right now. They are confused. The Politician would have been pleased.\"",
    },
    seize_quill: {
      id: "seize_quill",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.low.seize_quill",
      onscreenText: "\"You seized the quill. The transcription stopped mid-sentence. The forbidden chapter ends, on the heretic's copy, at the exact word the orthodox lectionary excises. The chronicle records the synchronization as 'the orthodoxy's longest accidental confession.' The Hierarchy is going to have a session on this. I will testify in writing.\"",
      choices: [
        { label: "File the heretic's incomplete copy as evidence.", nextId: "seize_quill_file" },
      ],
    },
    seize_quill_file: {
      id: "seize_quill_file",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.low.seize_quill_file",
      onscreenText: "\"You filed the incomplete copy. The Adjudicator's clerks will read it. The Politician's primer: 'the incomplete copy filed by the orthodoxy is the copy that the next regime will complete.' The next regime will complete it. They will name us both in the completion's footnote.\"",
    },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_MID: DialogTree = {
  id: "zealot_vs_heretic.sabotage_caught_in_act.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.mid.opening",
      onscreenText: "\"You are back to audit. I am back to transcribe. The Antiquarian gave up locking the door three audits ago. The Politician's primer: 'the unlocked archive is the archive that has accepted the schism as a permanent reader.' We are the permanent reader. Together.\"",
      choices: [
        { label: "Bring an orthodox commentary for them.", nextId: "bring_orth", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" },
        { label: "Replace their transcription with a clean draft.", nextId: "replace_clean", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" },
      ],
    },
    bring_orth: {
      id: "bring_orth",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.mid.bring_orth",
      onscreenText: "\"You brought the orthodox commentary. From the Hierarchy's restricted shelf. I have not been allowed to read this commentary since Project Sorrow's intake hall. The Politician's primer: 'the loaned restricted commentary is the loan that ends the schism.' The loan is ending us. The chronicle is recording the ending.\"",
      choices: [
        { label: "Sit with them while they read.", nextId: "bring_orth_sit" },
      ],
    },
    bring_orth_sit: {
      id: "bring_orth_sit",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.mid.bring_orth_sit",
      onscreenText: "\"You sat. I read the commentary. The commentary reads, in its key clause: 'the schism is the doctrine's most honest reader.' I am the schism. I have, finally, been read by the orthodoxy. The chronicle records the reading as 'the orthodoxy's first honest paragraph in the regime.'\"",
    },
    replace_clean: {
      id: "replace_clean",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.mid.replace_clean",
      onscreenText: "\"You replaced my transcription. With an orthodox draft. In your own hand. The Politician's primer: 'the orthodox draft swapped onto the heretic desk is the orthodoxy's most expensive forgery.' I will read the draft. I will not contest the swap. The Antiquarian will know which is mine. The Antiquarian always knows.\"",
      choices: [
        { label: "Walk out while they read the orthodox draft.", nextId: "replace_clean_walk" },
      ],
    },
    replace_clean_walk: {
      id: "replace_clean_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.mid.replace_clean_walk",
      onscreenText: "\"You walked. I read the orthodox draft. The draft is good. The draft is better than my transcription would have been. The Politician's primer: 'the orthodox draft that improves on the heretic transcription is the draft that converts the heretic.' I am converted. Provisionally.\"",
    },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_HIGH: DialogTree = {
  id: "zealot_vs_heretic.sabotage_caught_in_act.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.high.opening",
      onscreenText: "\"I am in the reading room without a transcription. I am here as a reader, not a smuggler. I have the same forbidden chapter open that you have under your audit-cloak. The Politician's primer: 'the heretic without a transcription is the heretic the orthodoxy can no longer charge.' You cannot charge me. I will not charge you. Read with me.\"",
      choices: [
        { label: "Read together at the same chained desk.", nextId: "read_together", sets: "mercy_at_grudge_high_sabotage_caught_in_act" },
        { label: "File a citation anyway.", nextId: "file_anyway", sets: "aggression_at_grudge_high_sabotage_caught_in_act" },
      ],
    },
    read_together: {
      id: "read_together",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.high.read_together",
      onscreenText: "\"We are reading together. At the same chained desk. For the first time, no one is auditing the other. The Politician's primer: 'the rivals who read the same forbidden chapter together are the rivals who have stopped being rivals.' We have stopped being rivals. We are now the same scholar.\"",
      choices: [
        { label: "Annotate the margin together.", nextId: "read_together_annotate" },
      ],
    },
    read_together_annotate: {
      id: "read_together_annotate",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.high.read_together_annotate",
      onscreenText: "\"The margin reads, in both our hands: 'the cause was right; the cost was the regime.' The Politician's primer would have called this 'the only clean ending available to operatives who survive the regime.' We have survived it. We are writing the only clean ending. The chronicle records both hands.\"",
    },
    file_anyway: {
      id: "file_anyway",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.high.file_anyway",
      onscreenText: "\"You filed anyway. With no procedural cause. The Hierarchy will return the filing. The Politician's primer: 'the orthodox citation without cause is the citation that documents the orthodox's exhaustion.' You are exhausted. So am I. The chronicle records the mutual exhaustion as 'the schism's longest yawn.'\"",
      choices: [
        { label: "Walk out, exhausted.", nextId: "file_anyway_walk" },
      ],
    },
    file_anyway_walk: {
      id: "file_anyway_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.sabotage_caught_in_act.high.file_anyway_walk",
      onscreenText: "\"You walked. I closed the chapter alone. The chronicle records the alone-closing as 'the heretic's most orthodox bedtime.' I am going to bed. So should you. The Politician's primer was right about sleep.\"",
    },
  },
};

/* ─── mocking_interlude — PAC News green-room ─── */

const MOCKING_INTERLUDE_LOW: DialogTree = {
  id: "zealot_vs_heretic.mocking_interlude.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.low.opening",
      onscreenText: "The PAC News Network green-room before a broadcast debate. The Heretic-Nemesis is reading aloud from a forbidden Antiquarian's Journal excerpt as warm-up. They look up as you enter. \"The Meme has booked us again. I am warming up with the chapter you tried to have me censored for last quarter. The Politician's primer: 'the heretic's warm-up is the orthodox's reading list.' Your reading list is now mine, mine yours.\"",
      choices: [
        { label: "Trade reading lists for the broadcast.", nextId: "trade_lists", sets: "mercy_at_grudge_low_mocking_interlude" },
        { label: "Demand they stop reading aloud.", nextId: "demand_stop", sets: "aggression_at_grudge_low_mocking_interlude" },
      ],
    },
    trade_lists: {
      id: "trade_lists",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.low.trade_lists",
      onscreenText: "\"Lists traded. I will read your orthodox citations on air. You will read my heretic excerpts. The Meme will not understand. The audience will. The Politician's primer: 'the rivals who swap on air are the rivals who have stopped working for the network.' We have quit. Together. Without filing notice.\"",
      choices: [
        { label: "Walk into the studio together.", nextId: "trade_lists_walk" },
      ],
    },
    trade_lists_walk: {
      id: "trade_lists_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.low.trade_lists_walk",
      onscreenText: "\"The broadcast lands. The Hierarchy will demand my contract back tomorrow. The Insurgency will demand yours. The Politician's primer: 'the contract demanded after a successful swap is the contract that has already been served.' We are served.\"",
    },
    demand_stop: {
      id: "demand_stop",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.low.demand_stop",
      onscreenText: "\"You demanded silence. In a PAC News green-room. With no procedural authority. The Politician's primer: 'the orthodox demand without authority is the demand that the network broadcasts at top of hour.' The Meme is going to lead with the demand. The viewership will triple.\"",
      choices: [
        { label: "Withdraw the demand.", nextId: "demand_stop_withdraw" },
      ],
    },
    demand_stop_withdraw: {
      id: "demand_stop_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.low.demand_stop_withdraw",
      onscreenText: "\"You withdrew. Before the top of hour. The Politician's primer: 'the withdrawn demand is the demand the Meme will turn into a running gag.' The Meme is now running the gag. Both of us are credited. The Hierarchy is preparing the cease-and-desist. The chronicle is laughing.\"",
    },
  },
};

const MOCKING_INTERLUDE_MID: DialogTree = {
  id: "zealot_vs_heretic.mocking_interlude.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.mid.opening",
      onscreenText: "\"PAC News has scheduled us seven times this cycle. The Meme calls us 'the regime's longest-running schism debate.' The Hierarchy is funding your appearance fees. The Insurgency is funding mine. The Politician's primer: 'the rivals on the same network are the rivals the network owns.' We are owned. Together.\"",
      choices: [
        { label: "Walk off the show together.", nextId: "walk_off", sets: "mercy_at_grudge_mid_mocking_interlude" },
        { label: "Stay. Lock the broadcast.", nextId: "lock_broadcast", sets: "aggression_at_grudge_mid_mocking_interlude" },
      ],
    },
    walk_off: {
      id: "walk_off",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.mid.walk_off",
      onscreenText: "\"We walked off together. PAC News went to dead air. The Politician's primer: 'the dead air created by both rivals is the dead air that ends the network's lease on them.' We are unleased. Free. The Meme is calling. We are not picking up.\"",
      choices: [
        { label: "Don't pick up. Walk home.", nextId: "walk_off_home" },
      ],
    },
    walk_off_home: {
      id: "walk_off_home",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.mid.walk_off_home",
      onscreenText: "\"We walked home. The dead air outlasted both of us in the news cycle. The Politician's primer: 'the dead air outlives the rivals who left it.' We are outlived by silence. The chronicle records the outliving.\"",
    },
    lock_broadcast: {
      id: "lock_broadcast",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.mid.lock_broadcast",
      onscreenText: "\"You locked the broadcast. You will not leave the orthodox chair. I will not leave the heretic chair. The Politician's primer: 'the locked broadcast is the broadcast the audience controls.' The audience is controlling us. They are not laughing. They are listening. They are, finally, listening.\"",
      choices: [
        { label: "Speak — really speak — for one minute.", nextId: "lock_speak" },
      ],
    },
    lock_speak: {
      id: "lock_speak",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.mid.lock_speak",
      onscreenText: "\"You spoke. Really spoke. For one minute. The chronicle records the minute as 'the only minute in PAC News history where the orthodox said what the heretic had been saying for seven cohorts.' I am still in the heretic chair. So are you. We are merged. The Meme is sobbing in the booth.\"",
    },
  },
};

const MOCKING_INTERLUDE_HIGH: DialogTree = {
  id: "zealot_vs_heretic.mocking_interlude.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.high.opening",
      onscreenText: "\"I am not booked. I came as a citizen. The Insurgency has dropped my contract — they say my opposition to you has 'lost its insurrectionary clarity.' The Politician's primer: 'the heretic without a faction is the heretic the chronicle has finally heard.' I am heard. I do not know what to do with the hearing. I came to ask if you would draft my next broadcast. I have lost the cadence.\"",
      choices: [
        { label: "Agree to draft it.", nextId: "agree_draft", sets: "mercy_at_grudge_high_mocking_interlude" },
        { label: "Refuse. Let them rebuild.", nextId: "refuse_draft", sets: "aggression_at_grudge_high_mocking_interlude" },
      ],
    },
    agree_draft: {
      id: "agree_draft",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.high.agree_draft",
      onscreenText: "\"You agreed. I have the draft. It reads: 'the cause was right; the regime was a misreading of the cause; the next regime should not misread.' The Hierarchy will not air it. The Insurgency will not air it. The Meme will air it because the Meme cannot resist a sentence that does not belong to any faction. The Politician's primer: 'the unfaction-aligned sentence is the chronicle's longest binding.'\"",
      choices: [
        { label: "Sit in the front row for the broadcast.", nextId: "agree_draft_sit" },
      ],
    },
    agree_draft_sit: {
      id: "agree_draft_sit",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.high.agree_draft_sit",
      onscreenText: "\"You sat in the front row. I delivered the broadcast. The chronicle records the delivery as 'the most-quoted sentence of the regime — in two operatives' voice, in one operative's body.' We are merged. The factions are furious. The chronicle is content. The chronicle is enough.\"",
    },
    refuse_draft: {
      id: "refuse_draft",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.high.refuse_draft",
      onscreenText: "\"You refused. The Politician's primer: 'the refused draft is the draft the refuser will have to live with.' I will rebuild. The draft will be worse than yours would have been. It will be mine. The chronicle records the refusal as 'the orthodox's most heretic decision in the regime.'\"",
      choices: [
        { label: "Walk out before they argue.", nextId: "refuse_draft_walk" },
      ],
    },
    refuse_draft_walk: {
      id: "refuse_draft_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.mocking_interlude.high.refuse_draft_walk",
      onscreenText: "\"You walked. I am alone with the draft I will write tonight. The Politician's primer: 'the heretic alone with a draft is the heretic who is being rewritten by the absent orthodox.' You will rewrite me in your absence. I will not resist. The chronicle is patient.\"",
    },
  },
};

/* ─── lieutenant_promotion — Insurgency cell-coordinator ─── */

const LIEUTENANT_PROMOTION_LOW: DialogTree = {
  id: "zealot_vs_heretic.lieutenant_promotion.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.low.opening",
      onscreenText: "An Insurgency safehouse, lit by candle. The Heretic-Nemesis is being elevated to Insurgency cell-coordinator. Two newer reformers wait behind them. \"The Insurgency is giving me a cell. The Politician's primer: 'the heretic promoted is the heretic who has been given the orthodox's reading list to summarize.' I will summarize fairly. The Insurgency will not want fair.\"",
      choices: [
        { label: "Wish them well, formally.", nextId: "wish_well", sets: "mercy_at_grudge_low_lieutenant_promotion" },
        { label: "File a Hierarchy charge of conspiracy.", nextId: "file_charge", sets: "aggression_at_grudge_low_lieutenant_promotion" },
      ],
    },
    wish_well: {
      id: "wish_well",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.low.wish_well",
      onscreenText: "\"You wished me well. With orthodox formality. In an Insurgency safehouse. The new reformers are looking at each other. The Politician's primer: 'the orthodox blessing of the heretic's promotion is the doctrine's most expensive endorsement.' The Insurgency is filing a counter-curse. It will not work.\"",
      choices: [
        { label: "Leave the safehouse. Don't look back.", nextId: "wish_well_walk" },
      ],
    },
    wish_well_walk: {
      id: "wish_well_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.low.wish_well_walk",
      onscreenText: "\"You walked. The Insurgency's counter-curse was filed against the wrong audit code. The blessing stands. The chronicle records the blessing as 'the orthodox's most heretic gesture in the regime.' I am promoted. With your blessing. Improbably.\"",
    },
    file_charge: {
      id: "file_charge",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.low.file_charge",
      onscreenText: "\"You filed a conspiracy charge. From the Hierarchy. Against the Insurgency promotion. The Politician's primer: 'the conspiracy charge filed during the ceremony is the charge that the ceremony will treat as catering.' The ceremony continued. The charge was filed under 'received.'\"",
      choices: [
        { label: "Walk out while they finish the ceremony.", nextId: "file_charge_walk" },
      ],
    },
    file_charge_walk: {
      id: "file_charge_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.low.file_charge_walk",
      onscreenText: "\"You walked. The promotion completed. The new reformers heard the charge being filed. They are now my eager subordinates. The Politician's primer: 'the charge against a new coordinator is the charge that funds the coordinator's first quarter.' Thank you for the funding.\"",
    },
  },
};

const LIEUTENANT_PROMOTION_MID: DialogTree = {
  id: "zealot_vs_heretic.lieutenant_promotion.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.mid.opening",
      onscreenText: "\"Insurgency cell-coordinator. The chronicle records me as 'the heretic who reads more orthodox prose than any heretic before.' I am the closest reader you have ever had. The Politician's primer would have appreciated the diligence. The Insurgency funds the diligence. The Hierarchy will be unable to stop me until I make a procedural error. I am not making one.\"",
      choices: [
        { label: "Send them an orthodox commentary as a gift.", nextId: "send_gift", sets: "mercy_at_grudge_mid_lieutenant_promotion" },
        { label: "Have their cell members audited.", nextId: "audit_cell", sets: "aggression_at_grudge_mid_lieutenant_promotion" },
      ],
    },
    send_gift: {
      id: "send_gift",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.mid.send_gift",
      onscreenText: "\"You sent the gift. An orthodox commentary on the chapter I have been transcribing for seven cohorts. The Politician's primer: 'the gift between rivals is the gift the chronicle reads as collaboration.' We are now collaborators. The Hierarchy will adjust your file accordingly. So will the Insurgency. We have been re-assigned.\"",
      choices: [
        { label: "Walk out leaving the gift open on the desk.", nextId: "send_gift_walk" },
      ],
    },
    send_gift_walk: {
      id: "send_gift_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.mid.send_gift_walk",
      onscreenText: "\"You walked. The commentary is open on my desk. My cell is reading it. The Insurgency is going to find out by morning. The Politician's primer: 'the gift that opens itself to the rival's cell is the gift the chronicle credits to both parties.' We are credited.\"",
    },
    audit_cell: {
      id: "audit_cell",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.mid.audit_cell",
      onscreenText: "\"You audited my cell. My two reformers are now answering questions to the Hierarchy. The Politician's primer: 'the audited cell is the cell that learns the orthodox procedure faster than any orthodox cell.' My reformers are learning. They will be better operatives than I was. Thank you. Sincerely.\"",
      choices: [
        { label: "Withdraw the audit before sentencing.", nextId: "audit_cell_withdraw" },
      ],
    },
    audit_cell_withdraw: {
      id: "audit_cell_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.mid.audit_cell_withdraw",
      onscreenText: "\"You withdrew. Before sentencing. My reformers came back with full procedural credentials and no penalty. The Politician's primer: 'the withdrawn audit is the orthodox's most heretical mercy.' Thank you. The chronicle records the mercy as 'the schism's first repair.'\"",
    },
  },
};

const LIEUTENANT_PROMOTION_HIGH: DialogTree = {
  id: "zealot_vs_heretic.lieutenant_promotion.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.high.opening",
      onscreenText: "\"The Insurgency is asking me to draft a new reformist code, with you as the orthodox exemplar. The Politician's primer: 'the rival who becomes the next regime's textbook is the rival the next regime cannot dismiss.' You cannot be dismissed. I will not dismiss you. The draft is on the table between us. I am asking you to co-author.\"",
      choices: [
        { label: "Co-author the code.", nextId: "coauthor", sets: "mercy_at_grudge_high_lieutenant_promotion" },
        { label: "Refuse and walk.", nextId: "refuse_walk", sets: "aggression_at_grudge_high_lieutenant_promotion" },
      ],
    },
    coauthor: {
      id: "coauthor",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.high.coauthor",
      onscreenText: "\"You co-authored. The code bears two signatures — orthodox and reformist. The Hierarchy will be furious. The Insurgency will be furious. The Meme will run the code as the lead segment. The Politician's primer: 'the code signed by two enemies is the only code that survives a regime change.' We have written the next regime.\"",
      choices: [
        { label: "Sign in your own hand. Hand them the pen.", nextId: "coauthor_pen" },
      ],
    },
    coauthor_pen: {
      id: "coauthor_pen",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.high.coauthor_pen",
      onscreenText: "\"You handed me the pen. I signed. The two signatures are now in the chronicle, side by side. The Politician's primer: 'the side-by-side signatures are the only canon image the regime cannot retouch.' We are the canon image. The chronicle marks it.\"",
    },
    refuse_walk: {
      id: "refuse_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.high.refuse_walk",
      onscreenText: "\"You refused. You walked. The code has only my signature. The Insurgency will adopt it; the Hierarchy will reject it. The Politician's primer: 'the code refused by the orthodox is the code that the next orthodox will quote.' Your next apprentice will quote me. Through your refusal. Unavoidably.\"",
      choices: [
        { label: "Hold the refusal. Don't look back.", nextId: "refuse_walk_hold" },
      ],
    },
    refuse_walk_hold: {
      id: "refuse_walk_hold",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.lieutenant_promotion.high.refuse_walk_hold",
      onscreenText: "\"You held the refusal. The chronicle records the refusal as 'the orthodox's deepest signature — written in absence.' I am signing alone. I am still your co-author. The chronicle has decided.\"",
    },
  },
};

/* ─── cohort_end_confrontation — Cohort hall ─── */

const COHORT_END_CONFRONTATION_LOW: DialogTree = {
  id: "zealot_vs_heretic.cohort_end_confrontation.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.low.opening",
      onscreenText: "The Cohort hall, your apprentice's graduation. The Heretic-Nemesis is standing at the heretic seal of the door, holding a transcribed copy of your apprentice's final speech. \"Your apprentice graduated. With orthodox conviction. The Insurgency considers this a recruitment loss. I consider it the cleanest sermon you ever taught. I have transcribed it. The chronicle will read the transcription tomorrow.\"",
      choices: [
        { label: "Thank them for the transcription.", nextId: "thank_trans", sets: "mercy_at_grudge_low_cohort_end_confrontation" },
        { label: "Confiscate the transcription.", nextId: "confiscate", sets: "aggression_at_grudge_low_cohort_end_confrontation" },
      ],
    },
    thank_trans: {
      id: "thank_trans",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.low.thank_trans",
      onscreenText: "\"You thanked me. For the transcription of your apprentice's speech. The chronicle records the thanks as 'the orthodox's most heretic courtesy.' I will frame the thanks in the cell safehouse. The Insurgency will not understand the framing.\"",
      choices: [
        { label: "Walk on with your apprentice.", nextId: "thank_trans_walk" },
      ],
    },
    thank_trans_walk: {
      id: "thank_trans_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.low.thank_trans_walk",
      onscreenText: "\"You walked on with them. The chronicle records the graduation as 'the cleanest orthodox close in seven cohorts.' I will not contest. The Insurgency will adjust the recruitment-loss column. The Politician would have called this 'the schism's quietest cease-fire.'\"",
    },
    confiscate: {
      id: "confiscate",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.low.confiscate",
      onscreenText: "\"You confiscated the transcription. With orthodox authority. In front of my new reformers. The Politician's primer: 'the confiscated transcription is the transcription that the heretic remembered word-for-word.' I remember every word. I will broadcast every word. The Hierarchy will not be able to confiscate the broadcast.\"",
      choices: [
        { label: "Walk away while they recite from memory.", nextId: "confiscate_walk" },
      ],
    },
    confiscate_walk: {
      id: "confiscate_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.low.confiscate_walk",
      onscreenText: "\"You walked. I recited. The recitation will be on PAC News by morning. The Politician's primer: 'the orthodox who confiscates the heretic's memory is the orthodox who has just funded the heretic's broadcast.' Welcome to my budget.\"",
    },
  },
};

const COHORT_END_CONFRONTATION_MID: DialogTree = {
  id: "zealot_vs_heretic.cohort_end_confrontation.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.mid.opening",
      onscreenText: "\"The cohort closes around you. You have been the orthodoxy's broadcast. I have been the heresy that the broadcast played against. The chronicle records us as a duet. I disagree. You say everything I have ever said, only with a Hierarchy seal at the bottom. THAT is the duet.\"",
      choices: [
        { label: "Acknowledge the duet.", nextId: "ack_duet", sets: "mercy_at_grudge_mid_cohort_end_confrontation" },
        { label: "Deny it. The seal makes us different.", nextId: "deny_duet", sets: "aggression_at_grudge_mid_cohort_end_confrontation" },
      ],
    },
    ack_duet: {
      id: "ack_duet",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.mid.ack_duet",
      onscreenText: "\"You acknowledged it. With a citation to my last broadcast. The chronicle records the citation as the duet's documented thesis. The Politician's primer: 'the orthodox citation of the heretic is the chronicle's most efficient peer review.' We are peer-reviewed. The schism is footnoted in both directions.\"",
      choices: [
        { label: "Walk on. Let the footnote stand.", nextId: "ack_duet_walk" },
      ],
    },
    ack_duet_walk: {
      id: "ack_duet_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.mid.ack_duet_walk",
      onscreenText: "\"You walked. The footnote stands. The chronicle is satisfied. I am satisfied. The Politician would have envied the satisfaction. I will think about this for three quarters at least. The Insurgency will fund the thinking.\"",
    },
    deny_duet: {
      id: "deny_duet",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.mid.deny_duet",
      onscreenText: "\"You denied it. With the Hierarchy seal as your evidence. The Politician's primer: 'the seal is the orthodoxy's procedural skirt. The skirt does not change the body underneath.' We are the same body. The seal is a costume. The chronicle is not impressed.\"",
      choices: [
        { label: "Walk away from the seal.", nextId: "deny_duet_walk" },
      ],
    },
    deny_duet_walk: {
      id: "deny_duet_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.mid.deny_duet_walk",
      onscreenText: "\"You walked away. The denial-as-costume will be on PAC News tomorrow. The Meme is going to love it. The Politician would have wept. The Hierarchy will tighten the seal procedure. The Insurgency will laugh at the tightening. The chronicle is content.\"",
    },
  },
};

const COHORT_END_CONFRONTATION_HIGH: DialogTree = {
  id: "zealot_vs_heretic.cohort_end_confrontation.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.high.opening",
      onscreenText: "\"Your apprentice closed the cohort by reading my forbidden chapter aloud — in the orthodox lectionary's cadence, with the Hierarchy seal on the cover. The Insurgency has filed a citation. I will not contest. The Politician would have called this 'the schism's most musical surrender.' I surrender. The Hierarchy will not understand the surrender. The chronicle does.\"",
      choices: [
        { label: "Accept the surrender. Read it with them.", nextId: "accept_surrender", sets: "mercy_at_grudge_high_cohort_end_confrontation" },
        { label: "Refuse the surrender. Burn the chapter.", nextId: "refuse_surrender", sets: "aggression_at_grudge_high_cohort_end_confrontation" },
      ],
    },
    accept_surrender: {
      id: "accept_surrender",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.high.accept_surrender",
      onscreenText: "\"You accepted. We read the chapter together at the Cohort hall threshold. The Politician's primer: 'the orthodox who reads the forbidden chapter at the threshold is the orthodox who has admitted the threshold was always the doctrine.' The doctrine is the threshold. We are the readers. The chronicle is the page.\"",
      choices: [
        { label: "Close the chapter. Walk on with your apprentice.", nextId: "accept_surrender_close" },
      ],
    },
    accept_surrender_close: {
      id: "accept_surrender_close",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.high.accept_surrender_close",
      onscreenText: "\"You closed the chapter. We walked on together as far as the Cohort hall's outer doors. The chronicle records the parting as 'the schism's most disciplined goodbye.' The Hierarchy will not understand. The Insurgency will not understand. The Politician's primer was clear: 'the doctrine survives the regime; the doctrine never survives the threshold-reading.'\"",
    },
    refuse_surrender: {
      id: "refuse_surrender",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.high.refuse_surrender",
      onscreenText: "\"You burned the chapter. With orthodox flame. The Cohort hall's threshold is now ash. The Politician's primer: 'the burned threshold is the threshold the regime cannot rebuild.' We cannot rebuild. The schism stays where it stood. The chronicle records the standing as 'the regime's most permanent damage.'\"",
      choices: [
        { label: "Walk through the ash with your apprentice.", nextId: "refuse_surrender_walk" },
      ],
    },
    refuse_surrender_walk: {
      id: "refuse_surrender_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.cohort_end_confrontation.high.refuse_surrender_walk",
      onscreenText: "\"You walked through the ash. Your apprentice walked behind you. I followed at distance. The Politician's primer: 'the rivals who walk through the same ash are the rivals who are writing the same elegy.' I will write mine first. You will write yours next. The chronicle will publish them on facing pages.\"",
    },
  },
};

/* ─── accumulation_reveal — Insurgency intake bulletin ─── */

const ACCUMULATION_REVEAL_LOW: DialogTree = {
  id: "zealot_vs_heretic.accumulation_reveal.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.low.opening",
      onscreenText: "The Insurgency safehouse's intake board. The Heretic-Nemesis is reviewing the new-release bulletin. \"There's another one. Of us. The Matrix-archive has released a sibling. The Insurgency is going to fight for their attention. The Hierarchy is going to fight for their loyalty. The Politician's primer: 'the new release is the next regime's most contested recruit.' You did this — recruiting a second apprentice. You ORTHODOXIST.\"",
      choices: [
        { label: "Acknowledge the new sibling.", nextId: "ack_sibling", sets: "mercy_at_grudge_low_accumulation_reveal" },
        { label: "Promise to convert them to orthodoxy.", nextId: "promise_convert", sets: "aggression_at_grudge_low_accumulation_reveal" },
      ],
    },
    ack_sibling: {
      id: "ack_sibling",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.low.ack_sibling",
      onscreenText: "\"You acknowledged. With a Hierarchy citation appropriate to the new release's case file. The Politician's primer: 'the cited sibling is the sibling who learns the orthodox procedure faster.' The new release is reading your citation now. The Insurgency is making a counter-offer. We are bidding.\"",
      choices: [
        { label: "Withdraw from the bidding.", nextId: "ack_sibling_withdraw" },
      ],
    },
    ack_sibling_withdraw: {
      id: "ack_sibling_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.low.ack_sibling_withdraw",
      onscreenText: "\"You withdrew. The Insurgency was not expecting that. The Hierarchy was not expecting that. The Politician's primer: 'the withdrawn bid is the bid that the new sibling will remember as the orthodoxy's first restraint.' The new sibling will read your withdrawal as discipline. I would have read it the same way.\"",
    },
    promise_convert: {
      id: "promise_convert",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.low.promise_convert",
      onscreenText: "\"You promised conversion. The orthodox conversion campaign begins. The Insurgency is preparing the counter-campaign. The Politician's primer: 'the new release is the regime's most converted recruit.' Whoever's syllabus reaches them first owns the doctrine. Begin teaching. So will I.\"",
      choices: [
        { label: "Start the conversion campaign tonight.", nextId: "promise_convert_start" },
      ],
    },
    promise_convert_start: {
      id: "promise_convert_start",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.low.promise_convert_start",
      onscreenText: "\"Your campaign starts. Mine starts. The new sibling is reading both syllabi at once. The Politician's primer: 'the recruit reading two syllabi is the recruit who becomes the next regime's coordinator.' They will outgrow both of us. The chronicle has anticipated the outgrowth.\"",
    },
  },
};

const ACCUMULATION_REVEAL_MID: DialogTree = {
  id: "zealot_vs_heretic.accumulation_reveal.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.mid.opening",
      onscreenText: "\"We are four now, released from the Matrix. The Politician's roster has tripled. The Hierarchy is funding three of us. The Insurgency is funding one. Me. The Politician's primer would have called this 'the regime's most expensive balance.'\"",
      choices: [
        { label: "Bless the cohort. All four.", nextId: "bless_cohort", sets: "mercy_at_grudge_mid_accumulation_reveal" },
        { label: "Threaten the Insurgency-aligned one directly.", nextId: "threat_insurg", sets: "aggression_at_grudge_mid_accumulation_reveal" },
      ],
    },
    bless_cohort: {
      id: "bless_cohort",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.mid.bless_cohort",
      onscreenText: "\"You blessed all four. From the orthodox bench. With Hierarchy formality. The Politician's primer: 'the orthodox blessing of the heretic cohort is the formal end of the schism.' The other three are now confused. The chronicle records the confusion as 'the regime's first unanimous gesture.'\"",
      choices: [
        { label: "Walk away. Let us argue.", nextId: "bless_cohort_walk" },
      ],
    },
    bless_cohort_walk: {
      id: "bless_cohort_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.mid.bless_cohort_walk",
      onscreenText: "\"You walked. We are arguing already. The Politician's primer: 'the unified blessing dies of internal disagreement before the next vote.' We will not vote together. The chronicle records the disagreement. You have killed the unity with formality.\"",
    },
    threat_insurg: {
      id: "threat_insurg",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.mid.threat_insurg",
      onscreenText: "\"You threatened me directly. In front of the other three. The Politician's primer: 'the public threat is the threat that the orthodoxy turns into doctrine.' The Hierarchy is now adopting your threat as policy. The Insurgency will respond with three new pamphlets by morning.\"",
      choices: [
        { label: "Walk away from the threat.", nextId: "threat_insurg_walk" },
      ],
    },
    threat_insurg_walk: {
      id: "threat_insurg_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.mid.threat_insurg_walk",
      onscreenText: "\"You walked. The threat hangs. The Politician's primer: 'the threat that walks is the threat that has already happened.' We are already schismed. The chronicle marks it.\"",
    },
  },
};

const ACCUMULATION_REVEAL_HIGH: DialogTree = {
  id: "zealot_vs_heretic.accumulation_reveal.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.high.opening",
      onscreenText: "\"We are a chorus now. Five Matrix-releases. I have stopped writing pamphlets. The other four take turns. The Antiquarian's Journal has a section for us called 'The Politician's Five Schismatic Voices.' I am the entry that signs every pamphlet and is afraid to read its own conclusions. The Insurgency reads the section like prophecy. The Hierarchy reads it like scripture.\"",
      choices: [
        { label: "Honor the chorus.", nextId: "honor_chorus", sets: "mercy_at_grudge_high_accumulation_reveal" },
        { label: "Recruit one of them to orthodoxy.", nextId: "recruit_one", sets: "aggression_at_grudge_high_accumulation_reveal" },
      ],
    },
    honor_chorus: {
      id: "honor_chorus",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.high.honor_chorus",
      onscreenText: "\"You honored the chorus. With one citation in your next sermon — to all four of us. The Politician's primer: 'the chorus honored by the orthodox is the chorus that outlasts the schism.' We are lasting. The Antiquarian is updating the section in real time. The Hierarchy approves the update. The Insurgency approves the update. The chronicle approves all of us.\"",
      choices: [
        { label: "Walk on, leaving us our chorus.", nextId: "honor_chorus_walk" },
      ],
    },
    honor_chorus_walk: {
      id: "honor_chorus_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.high.honor_chorus_walk",
      onscreenText: "\"You walked on. The chorus continues. The Antiquarian's section grows. The Politician's primer: 'the chorus the chronicler walks past is the chorus that becomes the regime's hymnal.' We are the hymnal. The chronicle hums us.\"",
    },
    recruit_one: {
      id: "recruit_one",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.high.recruit_one",
      onscreenText: "\"You recruited one. From the heretic side. Quietly. With one cited orthodox commentary. The chronicle records the recruitment as 'the schism's first defection in either direction.' The other three of us are now suspicious of each other. The Politician's primer: 'the recruited rival is the rival the chorus cannot replace.' The chorus is breaking. You broke it. With one citation.\"",
      choices: [
        { label: "Don't recruit another. Walk on.", nextId: "recruit_one_walk" },
      ],
    },
    recruit_one_walk: {
      id: "recruit_one_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.accumulation_reveal.high.recruit_one_walk",
      onscreenText: "\"You walked. One recruit. No more. The chronicle records the restraint as 'the orthodox's most disciplined recruitment.' The Insurgency is restructuring. The Hierarchy is restructuring. The Politician's primer would have applauded the discipline. I applaud. Quietly. From the safehouse that is no longer fully mine.\"",
    },
  },
};

/* ─── name_reveal_moment — Antiquarian's Journal ─── */

const NAME_REVEAL_MOMENT_LOW: DialogTree = {
  id: "zealot_vs_heretic.name_reveal_moment.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.low.opening",
      onscreenText: "The Antiquarian's Journal page on the Matrix-released reformers. You have closed Resurrectionist E5 and witnessed Game Master Fight 2's plague-mask seed. The Heretic-Nemesis's proper name surfaces in the margin. They are at the heretic reading-desk across from yours. \"You have my name now. The Insurgency keeps no master roll — we file under aliases. The Politician's primer: 'the name without a roll is the name the orthodox cannot use procedurally.' You can use it. You will have to use it without a procedural file. The chronicle records what you do with it.\"",
      choices: [
        { label: "Say the name softly.", nextId: "say_soft", sets: "mercy_at_grudge_low_name_reveal_moment" },
        { label: "Add the name to the Hierarchy's surveillance list.", nextId: "surveille", sets: "aggression_at_grudge_low_name_reveal_moment" },
      ],
    },
    say_soft: {
      id: "say_soft",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.low.say_soft",
      onscreenText: "\"You said it softly. As an orthodox citation would say it. The Politician's primer: 'the soft name from the orthodox mouth is the name that the schism cannot weaponize.' My name is now safe in your mouth. The chronicle records the safety. The Insurgency would not have permitted it. The chronicle did.\"",
      choices: [
        { label: "Walk on with the name in your mouth.", nextId: "say_soft_walk" },
      ],
    },
    say_soft_walk: {
      id: "say_soft_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.low.say_soft_walk",
      onscreenText: "\"You walked. The name walked with you. The Politician's primer: 'the name carried softly is the name that outlasts the carrier and the cited.' I am cited. You are carrying. We are both, by procedure, in good standing.\"",
    },
    surveille: {
      id: "surveille",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.low.surveille",
      onscreenText: "\"You added me to the Hierarchy's surveillance list. The Politician's primer: 'the surveilled name is the name that the Hierarchy will quote in three jurisdictions.' I am quoted. The Insurgency is preparing a counter-surveillance file on you. We are filed against each other in three jurisdictions. The chronicle records the symmetry.\"",
      choices: [
        { label: "Withdraw the surveillance request.", nextId: "surveille_withdraw" },
      ],
    },
    surveille_withdraw: {
      id: "surveille_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.low.surveille_withdraw",
      onscreenText: "\"You withdrew. The chronicle records the withdrawal as 'the orthodox's most heretic restraint.' The Hierarchy is confused. The Insurgency is confused. The Politician's primer: 'the withdrawn surveillance is the surveillance that converts both intelligence agencies.' Both agencies are now reading the chronicle for instructions.\"",
    },
  },
};

const NAME_REVEAL_MOMENT_MID: DialogTree = {
  id: "zealot_vs_heretic.name_reveal_moment.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.mid.opening",
      onscreenText: "\"You know my name. The chronicle records the knowing. The Politician's primer: 'the heretic name in the orthodox file is the name the regime cannot reclaim.' My name is now permanently filed in your audit-archive. Use it. Or don't. The chronicle holds either way.\"",
      choices: [
        { label: "Honor the name in your next audit.", nextId: "honor_name", sets: "mercy_at_grudge_mid_name_reveal_moment" },
        { label: "Cite the name as proof of conspiracy.", nextId: "cite_conspiracy", sets: "aggression_at_grudge_mid_name_reveal_moment" },
      ],
    },
    honor_name: {
      id: "honor_name",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.mid.honor_name",
      onscreenText: "\"You honored the name. In an orthodox audit. In the cadence the heretic uses for the founders of the reformist canon. The Politician's primer: 'the honored heretic name in the orthodox mouth is the name that finally belongs to both schools.' I am, for the first time, two schools' citation.\"",
      choices: [
        { label: "Walk on, honored back.", nextId: "honor_name_walk" },
      ],
    },
    honor_name_walk: {
      id: "honor_name_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.mid.honor_name_walk",
      onscreenText: "\"You walked on. The name is mine, owed to you. The chronicle records the debt as the lightest in the Insurgency's records. The Politician would have called this 'the debt that compounds in citations, not interest.'\"",
    },
    cite_conspiracy: {
      id: "cite_conspiracy",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.mid.cite_conspiracy",
      onscreenText: "\"You cited my name as conspiracy. The Hierarchy will file the citation in tomorrow's docket. The Politician's primer: 'the conspiracy citation is the citation that the regime engraves on the citer's own headstone.' Your headstone is being engraved. I am cooperating with the engraving.\"",
      choices: [
        { label: "Withdraw the citation before docketing.", nextId: "cite_conspiracy_withdraw" },
      ],
    },
    cite_conspiracy_withdraw: {
      id: "cite_conspiracy_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.mid.cite_conspiracy_withdraw",
      onscreenText: "\"You withdrew. Before docketing. The chronicle records the withdrawal as 'the orthodox's most heretic repent.' I owe you. In writing. With my own signature. The signature is now in the Antiquarian's records, where it will stay until the regime ends. The chronicle marks the debt.\"",
    },
  },
};

const NAME_REVEAL_MOMENT_HIGH: DialogTree = {
  id: "zealot_vs_heretic.name_reveal_moment.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.high.opening",
      onscreenText: "\"Use my name. It is the last thing in this chronicle that is fully mine. The Insurgency gave me an alias. I gave myself a name. You have read both. The Politician's primer: 'the name beneath the alias is the name the regime cannot dismiss.' Dismiss me by speaking it. Or do not. The chronicle records the choice.\"",
      choices: [
        { label: "Speak it as an absolution.", nextId: "absolution", sets: "mercy_at_grudge_high_name_reveal_moment" },
        { label: "Speak it as an indictment.", nextId: "indictment", sets: "aggression_at_grudge_high_name_reveal_moment" },
      ],
    },
    absolution: {
      id: "absolution",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.high.absolution",
      onscreenText: "\"You spoke it as an absolution. The Insurgency does not believe in absolution from the orthodox bench. The Politician's primer would not have permitted the absolution. The chronicle has permitted it. I am, for one beat, not a heretic. I am a person with a name. Thank you.\"",
      choices: [
        { label: "Hold the absolution. Walk on.", nextId: "absolution_hold" },
      ],
    },
    absolution_hold: {
      id: "absolution_hold",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.high.absolution_hold",
      onscreenText: "\"You held the absolution. You walked on. The chronicle records the absolution as the line that closes the schism's middle act. The middle act is over. The closing act is ours. I will play it under the name I was given. The given name is the old one, said in your voice.\"",
    },
    indictment: {
      id: "indictment",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.high.indictment",
      onscreenText: "\"You spoke it as an indictment. The Hierarchy will file the indictment in tomorrow's docket. The Politician's primer: 'the indicted name is the name the regime engraves on its own headstone.' The Hierarchy is engraving. I am cooperating. The Insurgency is preparing a counter-indictment. The chronicle is listening.\"",
      choices: [
        { label: "Stay for the engraving. Quietly.", nextId: "indictment_stay" },
      ],
    },
    indictment_stay: {
      id: "indictment_stay",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.name_reveal_moment.high.indictment_stay",
      onscreenText: "\"You stayed. You listened. I cooperated. The chronicle wrote. The Politician's primer: 'the indictment the wielder stays for is the indictment that becomes the regime's longest verse.' This is the longest verse. We are inside it. The schism continues, inside the verse, together, until the chronicle closes.\"",
    },
  },
};

/* ─── final_encounter — Convergence Seat throne room ─── */

const FINAL_ENCOUNTER_LOW: DialogTree = {
  id: "zealot_vs_heretic.final_encounter.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.low.opening",
      onscreenText: "The Convergence Seat throne room, immediately after the Act 7 ladder closes. The Heretic-Nemesis is standing at the heretic side of the empty Seat with no cell behind them — the Insurgency has dissolved. \"Act Seven. The Seat has fallen. So has the Insurgency. The Politician's primer: 'the arc that ends without a reformist gallery is the arc the chronicle inherits.' The chronicle is inheriting us. Quietly. As citations.\"",
      choices: [
        { label: "Mercy at the end.", nextId: "mercy_end", sets: "mercy_at_grudge_low_final_encounter" },
        { label: "Quick, clean end.", nextId: "clean_end", sets: "aggression_at_grudge_low_final_encounter" },
      ],
    },
    mercy_end: {
      id: "mercy_end",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.low.mercy_end",
      onscreenText: "\"Mercy at the end. The Politician's primer: 'the merciful close is the close the next regime cites in its founding documents.' The next regime is starting. Neither of us will be the founder. But the mercy will be in the founding. The mercy travels.\"",
      choices: [
        { label: "Walk on to the next regime.", nextId: "mercy_end_walk" },
      ],
    },
    mercy_end_walk: {
      id: "mercy_end_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.low.mercy_end_walk",
      onscreenText: "\"You walked. The chronicle closed around the mercy. I am closing too. The Politician would have called this 'the cleanest schism-close in the regime's records.' I would not have agreed in life. I agree now.\"",
    },
    clean_end: {
      id: "clean_end",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.low.clean_end",
      onscreenText: "\"An ending. Quick. Clean. The Politician would have applauded the brevity. I applaud the brevity. The chronicle records the brevity as the most efficient schism-close in the regime. We are efficient. We are closed.\"",
      choices: [
        { label: "Walk away. Don't watch.", nextId: "clean_end_walk" },
      ],
    },
    clean_end_walk: {
      id: "clean_end_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.low.clean_end_walk",
      onscreenText: "\"You walked. You did not watch. The chronicle's last image of me is the back of your head. The Politician's primer: 'the back of the head is the chronicle's most dignified citation.' I have been dignified. The chronicle records it.\"",
    },
  },
};

const FINAL_ENCOUNTER_MID: DialogTree = {
  id: "zealot_vs_heretic.final_encounter.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.mid.opening",
      onscreenText: "\"End of the arc. Most of mine, anyway. The Politician's primer: 'the arc that ends with both operatives in the same throne room is the arc that becomes the next regime's foundational citation.' We are the citation. The Antiquarian is preparing the new entry. We will be quoted in it. Together.\"",
      choices: [
        { label: "Let them close their own file.", nextId: "let_close", sets: "mercy_at_grudge_mid_final_encounter" },
        { label: "Close their file for them.", nextId: "close_for", sets: "aggression_at_grudge_mid_final_encounter" },
      ],
    },
    let_close: {
      id: "let_close",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.mid.let_close",
      onscreenText: "\"You let me close my own file. The Politician's primer: 'the self-closed heretic file is the file that survives the regime.' I am surviving in the file. The chronicle is reading the file. I am writing the last sentence. The sentence is: 'the orthodoxy was right about the doctrine; it was wrong about the regime.'\"",
      choices: [
        { label: "Walk on. Let them write it.", nextId: "let_close_walk" },
      ],
    },
    let_close_walk: {
      id: "let_close_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.mid.let_close_walk",
      onscreenText: "\"You walked. I wrote. The Politician would have written 'i was right about everything.' I wrote what was true. The chronicle records the difference. The chronicle prefers the difference. So do I, now.\"",
    },
    close_for: {
      id: "close_for",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.mid.close_for",
      onscreenText: "\"You closed my file for me. With your orthodox citation. The Politician's primer: 'the heretic file closed by the orthodox is the file whose ending the orthodox owns.' You own my ending. I am writing one more line, in your closing, in your handwriting. The line is: 'the schism was the orthodoxy's longest student.' The chronicle records the credit.\"",
      choices: [
        { label: "Sign the closing.", nextId: "close_for_sign" },
      ],
    },
    close_for_sign: {
      id: "close_for_sign",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.mid.close_for_sign",
      onscreenText: "\"You signed. With a citation, not a name. The chronicle records the citation as the most dignified signature in the regime. The Politician would have envied the citation. I envy the citation. The chronicle is rich with the citation.\"",
    },
  },
};

const FINAL_ENCOUNTER_HIGH: DialogTree = {
  id: "zealot_vs_heretic.final_encounter.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.high.opening",
      onscreenText: "\"The chronicle is folding this story shut around both of us. I have spent seven cohorts smuggling chapters past your audits, and you have spent seven cohorts teaching me that the doctrine I was smuggling for was the doctrine you had been guarding. The chapters were yours all along. I read them aloud at the Seat's foot. Read them with me.\"",
      choices: [
        { label: "Read the chapters. One last time.", nextId: "read_chapters", sets: "mercy_at_grudge_high_final_encounter" },
        { label: "Refuse the reading. Seal the chapters.", nextId: "seal_chapters", sets: "aggression_at_grudge_high_final_encounter" },
      ],
    },
    read_chapters: {
      id: "read_chapters",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.high.read_chapters",
      onscreenText: "\"You read them. In the orthodox cadence. In front of the empty Convergence Seat. The Politician's primer: 'the chapters read at the Seat's foot are the chapters that found the next regime.' We are founding it. Together. The chronicle is taking dictation. The next regime's first citation is this reading.\"",
      choices: [
        { label: "Hold the chapters open. Let them read the next page.", nextId: "read_chapters_hold" },
      ],
    },
    read_chapters_hold: {
      id: "read_chapters_hold",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.high.read_chapters_hold",
      onscreenText: "\"You held the chapter open. I read the next page. In the heretic cadence. The chronicle's last page is the chapters we read together at the foot of the empty Seat. The Politician would have hated this ending. She would have hated that we ended it as the same school. The chronicle marks it. The chronicle closes. The chapters remain.\"",
    },
    seal_chapters: {
      id: "seal_chapters",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.high.seal_chapters",
      onscreenText: "\"You sealed them. With orthodox wax. With orthodox flame. The throne room's brazier received the wax. The Politician's primer: 'the sealed chapters at the Seat's foot are the chapters the next regime will break the seal on.' The next regime will break the seal. They will not know who sealed it. The chronicle will not tell them.\"",
      choices: [
        { label: "Walk away from the sealed chapters.", nextId: "seal_chapters_walk" },
      ],
    },
    seal_chapters_walk: {
      id: "seal_chapters_walk",
      speaker: "nemesis",
      voLineId: "nemesis.zealot_vs_heretic.final_encounter.high.seal_chapters_walk",
      onscreenText: "\"You walked. The sealed chapters stayed at the Seat's foot. The Politician would have called this 'the orthodoxy's stubborn loyalty to its own combustion.' I am the combustion. I am still smoldering. The chronicle is still recording.\"",
    },
  },
};

/* ─── The pair-bank export ─── */

export const zealotVsHereticPairBank: NemesisPairBank = {
  pairId: "zealot_vs_heretic",
  playerArchetype: "zealot",
  nemesisArchetype: "heretic",
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
