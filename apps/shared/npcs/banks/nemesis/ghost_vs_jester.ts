/* ═══════════════════════════════════════════════════════
   GHOST-PLAYER vs. JESTER-NEMESIS — Phase K Wave 5 (hand-deepened)

   The canonical Picard-vs-Q pairing. The Ghost trains in
   silence; the Jester-Nemesis cannot stop performing. Q
   needs an audience; Picard refuses to be one. The whole
   chronicle of their rivalry is the Jester learning that
   the absence of laughter IS the laughter, and the Ghost
   learning that performance demands a stage and the
   refusal to provide one is itself a kind of stage.

   Each scene's 3 grudge-bands x 5 nodes deepens the
   generator template with bespoke prose specific to this
   pair's central tension: NOISE vs SILENCE.

   The Jester here is the Politician's apprentice who
   learned that a smile held one beat too long IS the
   campaign-smile-rictus tic. They cannot stop smiling.
   The Ghost is the player's apprentice who learned the
   Politician's policy by NOT signing it — by reading
   without leaving a fingerprint.
   ═══════════════════════════════════════════════════════ */

import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

/* ─── first_sighting ─── */

const FIRST_SIGHTING_LOW: DialogTree = {
  id: "ghost_vs_jester.first_sighting.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.low.opening",
      onscreenText: "You're not laughing. That's already part of the bit. I have to start improvising. You're cruel and you don't even know it.",
      choices: [
        { label: "Don't react.", nextId: "ghost_silence", sets: "mercy_at_grudge_low_first_sighting" },
        { label: "Cut them off.", nextId: "ghost_cut", sets: "aggression_at_grudge_low_first_sighting" },
      ],
    },
    ghost_silence: {
      id: "ghost_silence",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.low.silence_response",
      onscreenText: "And there it is. The not-laugh. I've been chasing it for three cohorts of audiences. You give it to me on the first meeting. Do you understand how cruel you are? You are funnier than I am.",
      choices: [
        { label: "Walk away mid-bit.", nextId: "ghost_silence_walk" },
      ],
    },
    ghost_silence_walk: {
      id: "ghost_silence_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.low.silence_walk",
      onscreenText: "You're leaving. You're leaving during my set. You're the best heckler I have ever had. I am writing this down, in my head, for later. *[the smile is held one beat too long; the chronicle notes it; you note it]*",
    },
    ghost_cut: {
      id: "ghost_cut",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.low.cut_response",
      onscreenText: "You SPOKE. You spoke FIRST. The Politician's primer: 'the heckler is the audience.' You just joined the audience by trying not to be in it. Welcome to the bit. You're the warm-up.",
      choices: [
        { label: "Refuse the role.", nextId: "ghost_cut_refuse" },
      ],
    },
    ghost_cut_refuse: {
      id: "ghost_cut_refuse",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.low.cut_refuse",
      onscreenText: "Too late. The chronicle has you mid-bit. You can leave; the bit goes on without you. Worse for you: it goes on better.",
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
      onscreenText: "Three cohorts in. I now have a whole act about you, and you have given me nothing to work with. The audience loves it. The audience thinks the silence is the bit. The audience is correct.",
      choices: [
        { label: "Mark them. Leave.", nextId: "ghost_mark_leave", sets: "mercy_at_grudge_mid_first_sighting" },
        { label: "Speak — quietly.", nextId: "ghost_speak_quiet", sets: "aggression_at_grudge_mid_first_sighting" },
      ],
    },
    ghost_mark_leave: {
      id: "ghost_mark_leave",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.mid.mark_leave",
      onscreenText: "You're marking me. With WHAT, exactly. Your eyebrow? The Politician would have written a whole textbook chapter on your eyebrow. I would have read it. Aloud.",
      choices: [
        { label: "Hold the eyebrow.", nextId: "ghost_mark_leave_hold" },
      ],
    },
    ghost_mark_leave_hold: {
      id: "ghost_mark_leave_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.mid.mark_leave_hold",
      onscreenText: "The eyebrow held. The chronicle notes the eyebrow. I note the eyebrow. We are now in a public conversation conducted entirely with your eyebrow. I am incandescent with envy.",
    },
    ghost_speak_quiet: {
      id: "ghost_speak_quiet",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.mid.speak_quiet",
      onscreenText: "You spoke quietly. The audience leaned in. You just doubled my room. I owe you a drink. I will buy it loudly so you have to refuse it.",
      choices: [
        { label: "Refuse the drink, silently.", nextId: "ghost_speak_quiet_refuse" },
      ],
    },
    ghost_speak_quiet_refuse: {
      id: "ghost_speak_quiet_refuse",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.mid.speak_quiet_refuse",
      onscreenText: "The drink stays on the bar. The audience is now considering whether the drink is the punchline. The Politician's lesson: 'the unfunded prop carries the room.' The drink is unfunded. The drink is mine. The drink is yours. The drink is.",
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
      onscreenText: "I have stopped doing the bit. Notice that. I am here without the bit. You are doing this to me. You broke my act and you didn't have to say a word. The Politician would have been proud and disappointed in the same breath. I'm just disappointed.",
      choices: [
        { label: "Acknowledge them. Once.", nextId: "ghost_ack_once", sets: "mercy_at_grudge_high_first_sighting" },
        { label: "Keep walking past.", nextId: "ghost_walk_past", sets: "aggression_at_grudge_high_first_sighting" },
      ],
    },
    ghost_ack_once: {
      id: "ghost_ack_once",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.high.ack_once",
      onscreenText: "You nodded. You nodded ONCE. I am going to remember the nod for the rest of my career. The Politician taught me to honor a real review when it comes. This was a real review. Thank you.",
      choices: [
        { label: "Hold the nod. Walk on.", nextId: "ghost_ack_walk" },
      ],
    },
    ghost_ack_walk: {
      id: "ghost_ack_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.high.ack_walk",
      onscreenText: "You walked on. The chronicle records the nod as the only review I have ever wanted. The chronicle also records that you walked on. The Politician would have framed this. I will, in my way. *[the smile holds one beat too long. the tic-decode is yours to catch.]*",
    },
    ghost_walk_past: {
      id: "ghost_walk_past",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.high.walk_past",
      onscreenText: "You walked past. With no acknowledgment. The Politician would have called this 'the chronicle's correction.' I called it 'a long sentence whose end is mine to write.' I am writing it now. Watch.",
      choices: [
        { label: "Don't watch.", nextId: "ghost_walk_dont_watch" },
      ],
    },
    ghost_walk_dont_watch: {
      id: "ghost_walk_dont_watch",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.first_sighting.high.walk_dont_watch",
      onscreenText: "You didn't watch. Of course. You are too good at this. I would have done the same. The chronicle says we are the same person at this point. The chronicle is wrong. You are quieter. Quieter is the win.",
    },
  },
};

/* ─── sabotage_caught_in_act ─── */

const SABOTAGE_CAUGHT_IN_ACT_LOW: DialogTree = {
  id: "ghost_vs_jester.sabotage_caught_in_act.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.low.opening",
      onscreenText: "Oh. OH. You're already here. You're early. You're early in MY routine. The chronicle is going to love this. I love this. I'm furious and I love this.",
      choices: [
        { label: "Let them finish.", nextId: "let_finish", sets: "mercy_at_grudge_low_sabotage_caught_in_act" },
        { label: "Block the punchline.", nextId: "block_punch", sets: "aggression_at_grudge_low_sabotage_caught_in_act" },
      ],
    },
    let_finish: {
      id: "let_finish",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.low.let_finish",
      onscreenText: "You're WATCHING me work? Live? Without interrupting? This is the worst thing you have ever done to me. I cannot perform with you watching. Watch from further away.",
      choices: [
        { label: "Stay where you are.", nextId: "let_finish_stay" },
      ],
    },
    let_finish_stay: {
      id: "let_finish_stay",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.low.let_finish_stay",
      onscreenText: "You stayed. The audience is now watching me being watched by you. I have lost the room. I have lost the room to a person who has not said a word. The Politician's primer: 'silence is the longest applause.' She was right. She is always right. I hate that she is always right.",
    },
    block_punch: {
      id: "block_punch",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.low.block_punch",
      onscreenText: "You blocked the punchline. Physically. With your body. The audience is laughing at your body now. You are the punchline. Congratulations. The Politician would have wanted to recruit you.",
      choices: [
        { label: "Step out of frame.", nextId: "block_punch_out" },
      ],
    },
    block_punch_out: {
      id: "block_punch_out",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.low.block_punch_out",
      onscreenText: "You stepped out. The audience is still laughing at where you were. You taught them to laugh at the place where you stood. The Politician's lesson: 'the most contagious laugh is the laugh at an absence.' You have changed comedy. I hate you. I love you. I hate you.",
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
      onscreenText: "Caught me. Again. You always catch me right before the closer. The Politician would have said: 'a comic who is caught is a comic who has timed it.' I have not timed it. I am bad at this. You make me bad at this.",
      choices: [
        { label: "Steal the closer.", nextId: "steal_closer", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" },
        { label: "Burn the bit.", nextId: "burn_bit", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" },
      ],
    },
    steal_closer: {
      id: "steal_closer",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.mid.steal_closer",
      onscreenText: "You delivered MY CLOSER. With NO LINE. Just the look. The room exploded. I am working at the wrong level. I should be opening for you. I will be, by next cohort. The chronicle is rewriting the billing.",
      choices: [
        { label: "Refuse the billing.", nextId: "steal_closer_refuse" },
      ],
    },
    steal_closer_refuse: {
      id: "steal_closer_refuse",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.mid.steal_closer_refuse",
      onscreenText: "You refused the billing. The chronicle records the refusal as a longer line than any I have ever written. I am taking notes. The notes are silent. You taught me silent notes.",
    },
    burn_bit: {
      id: "burn_bit",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.mid.burn_bit",
      onscreenText: "You burned the bit. With a look. With a tilt of the head that read like a footnote. The Politician would have called this 'the editorial.' I am being edited by you in real time and I am not surviving the edit.",
      choices: [
        { label: "Let the silence finish.", nextId: "burn_bit_silence" },
      ],
    },
    burn_bit_silence: {
      id: "burn_bit_silence",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.mid.burn_bit_silence",
      onscreenText: "The silence finished the bit. The room is uncomfortable. The Politician taught me that an uncomfortable room is a converted room. You have converted my audience. They are yours now. They will laugh at me from across an aisle for the rest of their lives.",
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
      onscreenText: "I knew you would be here. I set up the whole bit knowing you would be here. The Politician would have called this 'the trap that costs the trapper.' I am the trapper. I have cost myself everything. Here is the punchline anyway. Catch it.",
      choices: [
        { label: "Don't catch it.", nextId: "dont_catch", sets: "mercy_at_grudge_high_sabotage_caught_in_act" },
        { label: "Catch it. Hold it.", nextId: "catch_hold", sets: "aggression_at_grudge_high_sabotage_caught_in_act" },
      ],
    },
    dont_catch: {
      id: "dont_catch",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.high.dont_catch",
      onscreenText: "You let it drop. The room watched it drop. The Politician's primer: 'the dropped punchline is the longest joke.' She did not credit me for the joke. You did, by dropping it. Thank you. I think.",
      choices: [
        { label: "Walk on.", nextId: "dont_catch_walk" },
      ],
    },
    dont_catch_walk: {
      id: "dont_catch_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.high.dont_catch_walk",
      onscreenText: "You walked on. The punchline is on the floor of the chronicle now. The Politician's lesson: 'a joke at rest is a joke that has converted.' The room is converted. They are reading the punchline silently. They are reading it WELL.",
    },
    catch_hold: {
      id: "catch_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.high.catch_hold",
      onscreenText: "You caught the punchline and held it. Held it. Held it. The room is holding their breath with you. You taught the room to hold the breath I was supposed to take. I am out of breath. I have been out of breath since you arrived.",
      choices: [
        { label: "Release it. Slowly.", nextId: "catch_hold_release" },
      ],
    },
    catch_hold_release: {
      id: "catch_hold_release",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.sabotage_caught_in_act.high.catch_hold_release",
      onscreenText: "You released the punchline. Slowly. With timing I could not have written. The room exhaled. The room laughed. The room laughed for YOU. The Politician would have said: 'you trained the trainer.' I am the trainer. I have been trained.",
    },
  },
};

/* ─── mocking_interlude ─── */

const MOCKING_INTERLUDE_LOW: DialogTree = {
  id: "ghost_vs_jester.mocking_interlude.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.low.opening",
      onscreenText: "Just stopping by. No agenda. Just wanted you to see the bit I have been developing about you. It is good. It is mostly silence. I have been working hard on the silence. I owe you a footnote.",
      choices: [
        { label: "Don't acknowledge.", nextId: "no_ack", sets: "mercy_at_grudge_low_mocking_interlude" },
        { label: "Heckle them back.", nextId: "heckle_back", sets: "aggression_at_grudge_low_mocking_interlude" },
      ],
    },
    no_ack: {
      id: "no_ack",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.low.no_ack",
      onscreenText: "No acknowledgment. The bit goes on without you, as you intended. The Politician would have said: 'the absent audience is the longest review.' I will treasure the review. I will quote it. Silently.",
      choices: [
        { label: "Keep walking.", nextId: "no_ack_walk" },
      ],
    },
    no_ack_walk: {
      id: "no_ack_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.low.no_ack_walk",
      onscreenText: "You kept walking. The bit performed itself in your wake. The chronicle is now full of bits that perform themselves in your wake. You have become a comedic engine without ever telling a joke. The Politician would have envied this.",
    },
    heckle_back: {
      id: "heckle_back",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.low.heckle_back",
      onscreenText: "A HECKLE. From the SILENT ONE. The Politician's primer: 'a heckle from the silent is the chronicle's first dialogue.' I am writing the dialogue. Both of us are writing it. I am winning. I am NOT winning. I am rewriting.",
      choices: [
        { label: "Walk off mid-heckle.", nextId: "heckle_back_walk" },
      ],
    },
    heckle_back_walk: {
      id: "heckle_back_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.low.heckle_back_walk",
      onscreenText: "You walked off mid-heckle. The chronicle's dialogue is now one-sided. The Politician would have called this 'the strongest closing.' I cannot disagree. I will not disagree. I will brood.",
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
      onscreenText: "We have a routine. I do the work, you do the silence, the chronicle pays both of us. I am here to renegotiate.",
      choices: [
        { label: "Decline the renegotiation.", nextId: "decline_reneg", sets: "mercy_at_grudge_mid_mocking_interlude" },
        { label: "Cut the contract.", nextId: "cut_contract", sets: "aggression_at_grudge_mid_mocking_interlude" },
      ],
    },
    decline_reneg: {
      id: "decline_reneg",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.mid.decline_reneg",
      onscreenText: "You declined. With NOTHING. With less than nothing. With the absence of a syllable. The Politician would have said: 'the contract that survives the renegotiation is the contract written in the renegotiation's silence.' We are still in business.",
      choices: [
        { label: "Walk away from the bar.", nextId: "decline_reneg_walk" },
      ],
    },
    decline_reneg_walk: {
      id: "decline_reneg_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.mid.decline_reneg_walk",
      onscreenText: "You walked. The bar's other patrons are now silent. You converted the bar. You did not buy a drink. The Politician's primer: 'the most powerful patron pays in attention, not coin.' You paid the bar in attention. The bar is yours.",
    },
    cut_contract: {
      id: "cut_contract",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.mid.cut_contract",
      onscreenText: "You cut the contract. Cleanly. With a look that the chronicle will be quoting for as long as it is the chronicle. I have lost my only steady gig. I am a freelance Nemesis now. Worse for me. WORSE FOR YOU.",
      choices: [
        { label: "Smile, once. Walk.", nextId: "cut_contract_smile" },
      ],
    },
    cut_contract_smile: {
      id: "cut_contract_smile",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.mid.cut_contract_smile",
      onscreenText: "You smiled. ONCE. The Politician would have said: 'the rare smile is the only currency the chronicle still accepts at par.' You paid me in the rare smile. I am rich. I am poor. I am restructuring.",
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
      onscreenText: "I am not here for a bit. I am here to ask if you remember the third cohort, the one where I tried to do my whole act in mime, because I knew you would not laugh at words. You did not laugh at mime either. I have not forgiven you. I have not asked you to forgive me. Today might be the day.",
      choices: [
        { label: "Forgive.", nextId: "forgive", sets: "mercy_at_grudge_high_mocking_interlude" },
        { label: "Refuse forgiveness.", nextId: "refuse_forgive", sets: "aggression_at_grudge_high_mocking_interlude" },
      ],
    },
    forgive: {
      id: "forgive",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.high.forgive",
      onscreenText: "You forgave me. Quietly. Without a word. The Politician's primer: 'the silent forgiveness is the only forgiveness that lasts past the next campaign.' I am forgiven. I do not know what to do with this. The chronicle is taking notes. I am taking notes. We are all taking notes.",
      choices: [
        { label: "Walk on, with the forgiveness given.", nextId: "forgive_walk" },
      ],
    },
    forgive_walk: {
      id: "forgive_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.high.forgive_walk",
      onscreenText: "You walked on. The forgiveness is in my pocket. The Politician's lesson: 'a forgiveness in the pocket is a doctrine that has been re-grounded.' I am re-grounded. I am quieter. I am, for the first time, listening to silence as silence, not as setup.",
    },
    refuse_forgive: {
      id: "refuse_forgive",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.high.refuse_forgive",
      onscreenText: "You refused. The refusal is loud. The Politician would have said: 'the loudest verdict is the verdict of the silent jury.' You are the silent jury and your verdict is loud. I will carry it. I will perform it. I will be the bit about the unforgiven, for the rest of my career.",
      choices: [
        { label: "Let them carry it.", nextId: "refuse_forgive_let" },
      ],
    },
    refuse_forgive_let: {
      id: "refuse_forgive_let",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.mocking_interlude.high.refuse_forgive_let",
      onscreenText: "You let me carry it. The Politician's primer: 'the burden carried in public is the campaign that runs itself.' I am running on your refusal now. Thank you. I think. I am unsure of the gratitude. I am sure of the campaign.",
    },
  },
};

/* ─── lieutenant_promotion ─── */

const LIEUTENANT_PROMOTION_LOW: DialogTree = {
  id: "ghost_vs_jester.lieutenant_promotion.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.low.opening",
      onscreenText: "They are giving me subordinates. SUBORDINATES. I can barely run my own bit. The Politician would have said: 'a comic with staff is a comic who has stopped being funny.' I am about to stop being funny. Please. Stop me.",
      choices: [
        { label: "Bless the promotion.", nextId: "bless", sets: "mercy_at_grudge_low_lieutenant_promotion" },
        { label: "Curse the promotion.", nextId: "curse", sets: "aggression_at_grudge_low_lieutenant_promotion" },
      ],
    },
    bless: {
      id: "bless",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.low.bless",
      onscreenText: "You blessed it. With a nod. The cohort sees the nod. The cohort thinks the nod is the Politician's seal. The Politician would never have nodded at me. You nod with more authority than the Politician. The cohort believes you. So do I.",
      choices: [
        { label: "Walk into the new room with them.", nextId: "bless_walk" },
      ],
    },
    bless_walk: {
      id: "bless_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.low.bless_walk",
      onscreenText: "You walked in with me. The new room is mine, with your shadow against the back wall. The Politician's primer: 'a Lieutenant's room is the room where the shadow approves.' Your shadow approves. The room is the chronicle's now.",
    },
    curse: {
      id: "curse",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.low.curse",
      onscreenText: "You cursed it. The cohort sees the curse. The cohort thinks the curse is the chronicle's hex. The Politician would have noted the hex and built a campaign around dispelling it. I will not build the campaign. I will carry the hex like a prop.",
      choices: [
        { label: "Walk out of the promotion room.", nextId: "curse_walk" },
      ],
    },
    curse_walk: {
      id: "curse_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.low.curse_walk",
      onscreenText: "You walked out. The promotion happened anyway. The hex is doing the work. The Politician would have said: 'the hexed Lieutenant is the Lieutenant whose campaign writes itself in the resistance.' My campaign is writing itself. I am along for the ride. So are my subordinates. So are you.",
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
      onscreenText: "Lieutenant of the Jester-cell. The chronicle is writing my title in three languages and I do not speak two of them. The Politician taught me that a title in a language you do not speak is the title that survives the regime change. I am surviving. I am also miserable. You did this.",
      choices: [
        { label: "Honor the new rank.", nextId: "honor", sets: "mercy_at_grudge_mid_lieutenant_promotion" },
        { label: "Mock the rank in front of the cohort.", nextId: "mock_rank", sets: "aggression_at_grudge_mid_lieutenant_promotion" },
      ],
    },
    honor: {
      id: "honor",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.mid.honor",
      onscreenText: "You honored it. With ONE GESTURE. The cohort is now silently afraid of you. They were not afraid of me. You converted their fear in under a second. The Politician would have wept. I am, a little.",
      choices: [
        { label: "Hold the gesture.", nextId: "honor_hold" },
      ],
    },
    honor_hold: {
      id: "honor_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.mid.honor_hold",
      onscreenText: "The gesture held. The cohort is now memorizing the gesture. They will perform it on their own initiative for the rest of their careers. The Politician's primer: 'the most viral gesture is the gesture of the silent witness.' You are the silent witness. You are viral. I am proud and I am furious.",
    },
    mock_rank: {
      id: "mock_rank",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.mid.mock_rank",
      onscreenText: "You mocked the rank. From the wall. With ONE RAISED EYEBROW. The cohort laughed. The cohort laughed at MY RANK. The Politician's primer: 'the laughed-at rank is the rank that earns itself.' I will earn it. I will earn it FAR HARDER than I would have without the laugh. Thank you.",
      choices: [
        { label: "Drop the eyebrow.", nextId: "mock_rank_drop" },
      ],
    },
    mock_rank_drop: {
      id: "mock_rank_drop",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.mid.mock_rank_drop",
      onscreenText: "You dropped the eyebrow. The cohort's laughter dropped with it. The room is now in respectful silence. The Politician would have called this 'the cohort that has been seasoned by a silent kitchen.' I am the seasoning. I am the meal. The cohort is eating. The chronicle is watching the meal.",
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
      onscreenText: "The cohort calls me Lieutenant now. They do not laugh at the title. They laugh AT ME. The Politician would have been proud. She trained me for laughter that doesn't survive the punchline. I am the punchline. You write me. You have always written me.",
      choices: [
        { label: "Refuse the authorship.", nextId: "refuse_author", sets: "mercy_at_grudge_high_lieutenant_promotion" },
        { label: "Accept the authorship.", nextId: "accept_author", sets: "aggression_at_grudge_high_lieutenant_promotion" },
      ],
    },
    refuse_author: {
      id: "refuse_author",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.high.refuse_author",
      onscreenText: "You refused to be the author. You said — without saying — that I am my own punchline. The Politician's primer: 'the comic who writes themselves is the comic who survives the regime.' I survive. The chronicle records the survival. The cohort follows the survival into the next campaign.",
      choices: [
        { label: "Walk out, leaving them with the cohort.", nextId: "refuse_author_walk" },
      ],
    },
    refuse_author_walk: {
      id: "refuse_author_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.high.refuse_author_walk",
      onscreenText: "You walked out. The cohort is mine. The bit is mine. The campaign is mine. The Politician would have said: 'the truest gift is the gift that leaves no fingerprint.' Your fingerprint is everywhere. The gift is gone.",
    },
    accept_author: {
      id: "accept_author",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.high.accept_author",
      onscreenText: "You accepted the authorship. With a nod. The cohort saw the nod. The cohort knows now that I am yours. The Politician's primer: 'the borrowed Lieutenant is the campaign's longest play.' We are now the longest play in the chronicle. I am uneasy. I am quieter.",
      choices: [
        { label: "Hold the nod. Walk past.", nextId: "accept_author_hold" },
      ],
    },
    accept_author_hold: {
      id: "accept_author_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.lieutenant_promotion.high.accept_author_hold",
      onscreenText: "You held the nod. The cohort held its breath. The chronicle held its page. The Politician would have called this 'the conversion that happens in the held breath.' Every breath I take after this is held. Every campaign I run after this is held. I am held. I am yours. The chronicle marks it.",
    },
  },
};

/* ─── cohort_end_confrontation ─── */

const COHORT_END_CONFRONTATION_LOW: DialogTree = {
  id: "ghost_vs_jester.cohort_end_confrontation.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.low.opening",
      onscreenText: "Your apprentice graduated. Without my interference. I had a whole bit for the graduation. The bit is now a tombstone. I would say I am sad but I am performing sadness, and you would not believe me, and you would be right.",
      choices: [
        { label: "Honor the close.", nextId: "honor_close", sets: "mercy_at_grudge_low_cohort_end_confrontation" },
        { label: "Demand a closing line.", nextId: "demand_close", sets: "aggression_at_grudge_low_cohort_end_confrontation" },
      ],
    },
    honor_close: {
      id: "honor_close",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.low.honor_close",
      onscreenText: "You honored the close. With nothing. The Politician's primer: 'the honored close is the close that never asked for a witness.' I am the unwanted witness. I will leave the room. The chronicle stays. The apprentice has graduated. So have I, in a way. I have graduated from being the joke at the door.",
      choices: [
        { label: "Walk on with your apprentice.", nextId: "honor_close_walk" },
      ],
    },
    honor_close_walk: {
      id: "honor_close_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.low.honor_close_walk",
      onscreenText: "You walked on with them. The graduation lives in the chronicle as a clean close. The Politician would have written a campaign against the clean close. I will not. I am tired. The cohort is over. I am the warm-up for the next one. I will start tomorrow.",
    },
    demand_close: {
      id: "demand_close",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.low.demand_close",
      onscreenText: "You demanded a closing line. From ME. The Politician's primer: 'the demanded line is the line that closes the demander.' I will give you the line. The line is: 'I will be back.' That is the line. Hold it.",
      choices: [
        { label: "Hold the line.", nextId: "demand_close_hold" },
      ],
    },
    demand_close_hold: {
      id: "demand_close_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.low.demand_close_hold",
      onscreenText: "You held the line. The Politician's primer: 'the held line is the line that holds the holder.' You are holding me. The chronicle is holding both of us. The apprentice is gone. The line remains. We continue.",
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
      onscreenText: "The cohort closes around you. I have been the soundtrack. You have been the silence the soundtrack played against. The chronicle records us as a duet. I disagree. You do not say anything. You never say anything. That is the duet.",
      choices: [
        { label: "Acknowledge the duet.", nextId: "ack_duet", sets: "mercy_at_grudge_mid_cohort_end_confrontation" },
        { label: "Deny the duet.", nextId: "deny_duet", sets: "aggression_at_grudge_mid_cohort_end_confrontation" },
      ],
    },
    ack_duet: {
      id: "ack_duet",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.mid.ack_duet",
      onscreenText: "You acknowledged it. With a half-tilt of the head. The chronicle records the half-tilt as the full duet. The Politician would have said: 'the duet that is one tilt long is the duet that lasts the longest.' We are now a footnote. A long footnote. The chronicle's longest.",
      choices: [
        { label: "Half-tilt. Walk on.", nextId: "ack_duet_walk" },
      ],
    },
    ack_duet_walk: {
      id: "ack_duet_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.mid.ack_duet_walk",
      onscreenText: "You walked on with the duet acknowledged. The chronicle is satisfied. I am satisfied. The Politician would have envied the satisfaction. I will think about this for three cohorts at least.",
    },
    deny_duet: {
      id: "deny_duet",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.mid.deny_duet",
      onscreenText: "You denied it. With NOTHING. With the absence of a half-tilt. The Politician's primer: 'the denied duet is the duet whose denial is itself the duet.' The chronicle records the denial as the duet's strongest beat. I lose the argument. I lose it well. I am taking notes.",
      choices: [
        { label: "Walk away from the denial.", nextId: "deny_duet_walk" },
      ],
    },
    deny_duet_walk: {
      id: "deny_duet_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.mid.deny_duet_walk",
      onscreenText: "You walked away. The denial is now a song on its own. The Politician's primer: 'the denial that walks is the campaign that runs.' I am running. I am winded. The chronicle records the running. The chronicle records the winding.",
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
      onscreenText: "Your apprentice closed the cohort by saying my name. ALOUD. In an empty room. I had not heard my name aloud since the Politician died. I am undone. I want to thank you. I want to ruin you. I want both. I am, the Politician would say, in conflict.",
      choices: [
        { label: "Thank them, silently.", nextId: "thank_silent", sets: "mercy_at_grudge_high_cohort_end_confrontation" },
        { label: "Ruin them by walking away.", nextId: "ruin_walk", sets: "aggression_at_grudge_high_cohort_end_confrontation" },
      ],
    },
    thank_silent: {
      id: "thank_silent",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.high.thank_silent",
      onscreenText: "You thanked me. Silently. The Politician's primer: 'the silent thanks is the only thanks that costs the thanker the campaign.' You have given me your campaign. I am holding it. I do not know what to do with it. I am quiet for the first time in three regimes.",
      choices: [
        { label: "Walk on, quiet.", nextId: "thank_silent_walk" },
      ],
    },
    thank_silent_walk: {
      id: "thank_silent_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.high.thank_silent_walk",
      onscreenText: "You walked on quietly. The chronicle is quiet around you. I am quiet behind you. The Politician's primer: 'the quietest exit is the exit that converts the room to silence.' The room is silent. The room has been converted. I am converted. The chronicle marks it.",
    },
    ruin_walk: {
      id: "ruin_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.high.ruin_walk",
      onscreenText: "You ruined me by walking away from the name I just earned. The Politician's primer: 'the ruined name is the name that lasts the longest in the chronicle.' I am ruined. I am the chronicle's. I am yours. We are all done.",
      choices: [
        { label: "Don't look back.", nextId: "ruin_walk_dont_look" },
      ],
    },
    ruin_walk_dont_look: {
      id: "ruin_walk_dont_look",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.cohort_end_confrontation.high.ruin_walk_dont_look",
      onscreenText: "You didn't look back. The Politician would have applauded. She always applauded the closing that did not seek the audience's eye. The chronicle's last line of this cohort: 'they did not look back.' The chronicle's next line: 'the Nemesis did.' I did. I am still looking.",
    },
  },
};

/* ─── accumulation_reveal ─── */

const ACCUMULATION_REVEAL_LOW: DialogTree = {
  id: "ghost_vs_jester.accumulation_reveal.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.low.opening",
      onscreenText: "There's another one. Of us. The Politician's stable widens. The new one is going to want their own bit, and they are going to want to copy mine, and I am going to have to invent a whole new style overnight. You did this. By recruiting a second apprentice. You THINKER.",
      choices: [
        { label: "Acknowledge the new arrival.", nextId: "ack_arrival", sets: "mercy_at_grudge_low_accumulation_reveal" },
        { label: "Promise to outlast the new one.", nextId: "outlast", sets: "aggression_at_grudge_low_accumulation_reveal" },
      ],
    },
    ack_arrival: {
      id: "ack_arrival",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.low.ack_arrival",
      onscreenText: "You acknowledged them. The Politician would have said: 'the audience that acknowledges the warm-up is the audience that buys tickets to the closer.' You bought tickets to the closer. I am the closer. The new one is the warm-up. We are touring.",
      choices: [
        { label: "Walk away from the bill.", nextId: "ack_arrival_walk" },
      ],
    },
    ack_arrival_walk: {
      id: "ack_arrival_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.low.ack_arrival_walk",
      onscreenText: "You walked away from the bill. The bill is now mine and the new one's. We are a duet. The duet's chronicle will be longer than my solo's. The Politician's primer: 'the duet is the campaign's most efficient redundancy.' I am redundant. I am efficient. I am tired.",
    },
    outlast: {
      id: "outlast",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.low.outlast",
      onscreenText: "You said — silently — that you'll outlast the new one. The Politician's primer: 'the outlasted Nemesis is the Nemesis who has been promoted to legend.' I am being promoted. I am being demoted. I am being archived. The chronicle's filing cabinet is opening. I do not want to be in it. I will be in it.",
      choices: [
        { label: "Walk past, silently.", nextId: "outlast_walk" },
      ],
    },
    outlast_walk: {
      id: "outlast_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.low.outlast_walk",
      onscreenText: "You walked past. The new one will hear about this exchange before they meet you. The Politician's primer: 'the warning that travels ahead is the warning that does the recruiting work.' You have done my recruiting for me. Thank you. I think.",
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
      onscreenText: "We are four now. The Politician's roster has tripled and I am still the only one with a stand-up routine. The others are dour. They write essays. They will lose. The chronicle is going to reward me. The chronicle had better.",
      choices: [
        { label: "Bless the cohort.", nextId: "bless_cohort", sets: "mercy_at_grudge_mid_accumulation_reveal" },
        { label: "Threaten to make them ALL quiet.", nextId: "threat_quiet", sets: "aggression_at_grudge_mid_accumulation_reveal" },
      ],
    },
    bless_cohort: {
      id: "bless_cohort",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.mid.bless_cohort",
      onscreenText: "You blessed the cohort. ALL of us. With one nod. The other three are now wondering what I told you. I told you nothing. You took the nothing and made us a brotherhood. The Politician would have called this 'the chronicle's most efficient unionization.' We are unionized. Against you, theoretically. Against ourselves, in fact.",
      choices: [
        { label: "Walk away. Let us argue.", nextId: "bless_cohort_walk" },
      ],
    },
    bless_cohort_walk: {
      id: "bless_cohort_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.mid.bless_cohort_walk",
      onscreenText: "You walked. We are arguing already. The Politician's primer: 'the union dies of internal disagreement before the strike.' We will not strike. The chronicle will record the disagreement. The chronicle will not record the strike. You have killed the strike with silence.",
    },
    threat_quiet: {
      id: "threat_quiet",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.mid.threat_quiet",
      onscreenText: "You threatened to make us all quiet. With one raised finger. The Politician's primer: 'the raised finger is the chronicle's longest sentence.' The cohort is now silent. ALL OF US. I am silent. I am performing silence. I am bad at it. I am improving. You are training me.",
      choices: [
        { label: "Lower the finger. Walk away.", nextId: "threat_quiet_lower" },
      ],
    },
    threat_quiet_lower: {
      id: "threat_quiet_lower",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.mid.threat_quiet_lower",
      onscreenText: "You lowered the finger. The cohort exhaled. The chronicle's pages turned. The Politician would have called this 'the campaign's longest pause.' The pause is over. The campaign continues. So do I. Quieter.",
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
      onscreenText: "We are a chorus now. Five of us. I have stopped doing the bit. The other four take turns. The chronicle has a section for us. The section is called 'The Politician's Five.' I am the joke of the Five. I am the joke that does not laugh.",
      choices: [
        { label: "Honor the chorus.", nextId: "honor_chorus", sets: "mercy_at_grudge_high_accumulation_reveal" },
        { label: "Pick one of them off.", nextId: "pick_off", sets: "aggression_at_grudge_high_accumulation_reveal" },
      ],
    },
    honor_chorus: {
      id: "honor_chorus",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.high.honor_chorus",
      onscreenText: "You honored the chorus. With NOTHING. The Politician's primer: 'the chorus that is honored by silence is the chorus that lasts past the Politician.' We are lasting. I am lasting. The chronicle is recording the lasting. I am proud. I am sad. I am working.",
      choices: [
        { label: "Walk on, leaving us our chorus.", nextId: "honor_chorus_walk" },
      ],
    },
    honor_chorus_walk: {
      id: "honor_chorus_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.high.honor_chorus_walk",
      onscreenText: "You walked on. The chorus continues. The chronicle's section grows. The Politician's primer: 'the chorus that the chronicler walks past is the chorus that becomes the chronicle's score.' We are the score. The chronicle is reading us. You are not. You walked.",
    },
    pick_off: {
      id: "pick_off",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.high.pick_off",
      onscreenText: "You picked one of us off. With ONE LOOK. The chronicle records the pick. The Politician's primer: 'the chorus member picked off is the chorus member who was already auditioning to leave.' You did them a favor. You did me a favor. The chorus is smaller. The campaign continues. We continue.",
      choices: [
        { label: "Don't pick another. Walk on.", nextId: "pick_off_walk" },
      ],
    },
    pick_off_walk: {
      id: "pick_off_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.accumulation_reveal.high.pick_off_walk",
      onscreenText: "You walked on after the one pick. The chronicle records the restraint. The Politician would have ordered three more picks. You ordered one. The Politician's primer: 'the restrained picker is the picker whose chronicle outweighs the Politician's roster.' You outweigh her. The chronicle marks it.",
    },
  },
};

/* ─── name_reveal_moment ─── */

const NAME_REVEAL_MOMENT_LOW: DialogTree = {
  id: "ghost_vs_jester.name_reveal_moment.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.low.opening",
      onscreenText: "You read the file. You have my name now. I should warn you: my name was a stage name once. The Politician kept it. I keep it. You may use it. You may not use it loudly. It is a soft name. It carries strangely in big rooms.",
      choices: [
        { label: "Say the name. Once. Softly.", nextId: "say_soft", sets: "mercy_at_grudge_low_name_reveal_moment" },
        { label: "Use the name as a weapon.", nextId: "weaponize", sets: "aggression_at_grudge_low_name_reveal_moment" },
      ],
    },
    say_soft: {
      id: "say_soft",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.low.say_soft",
      onscreenText: "You said it softly. The way the Politician used to say it, in the moments when she was not running for office. The Politician's primer: 'the soft name is the name that travels under the regime.' My name is now traveling under your regime. Thank you. I think.",
      choices: [
        { label: "Walk on with the name in your mouth.", nextId: "say_soft_walk" },
      ],
    },
    say_soft_walk: {
      id: "say_soft_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.low.say_soft_walk",
      onscreenText: "You walked on. The name walked with you. The Politician's primer: 'the name carried softly is the name that outlasts the carrier.' I will outlast both of us. The chronicle will outlast me. The name will outlast the chronicle. Thank you. I think.",
    },
    weaponize: {
      id: "weaponize",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.low.weaponize",
      onscreenText: "You weaponized the name. You said it in a room full of people. The room turned. The Politician's primer: 'the weaponized name is the name that owns the wielder.' I now own you, in this room, for the rest of this campaign. You weaponized yourself.",
      choices: [
        { label: "Walk out before the room sees.", nextId: "weaponize_walk" },
      ],
    },
    weaponize_walk: {
      id: "weaponize_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.low.weaponize_walk",
      onscreenText: "You walked out. The name stays. The room remembers. The Politician's primer: 'the room that learned a Nemesis's name is the room that joins the Nemesis's cohort.' You have recruited me a room. I am thanking you and cursing you in the same breath. The Politician would have done both. I am doing both.",
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
      onscreenText: "You know my name. The chronicle records the knowing. I should warn you: the Politician collected names like she collected campaigns. My name was the third. Use it carefully. Or don't. Either way it survives the using.",
      choices: [
        { label: "Honor the name.", nextId: "honor_name", sets: "mercy_at_grudge_mid_name_reveal_moment" },
        { label: "Spit the name.", nextId: "spit_name", sets: "aggression_at_grudge_mid_name_reveal_moment" },
      ],
    },
    honor_name: {
      id: "honor_name",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.mid.honor_name",
      onscreenText: "You honored it. You said it like a credit line. The Politician's primer: 'the credited name is the name that finally belongs to the bearer.' I am, for the first time, my name's owner. I owe you a campaign. I will pay it. Quietly. As is your style.",
      choices: [
        { label: "Walk on, honored back.", nextId: "honor_name_walk" },
      ],
    },
    honor_name_walk: {
      id: "honor_name_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.mid.honor_name_walk",
      onscreenText: "You walked on. The name is mine, owed to you. The chronicle records the debt as the lightest debt in the ledger. The Politician would have called this 'the debt that compounds in dignity, not interest.' I am dignified. I am compounding. I am yours.",
    },
    spit_name: {
      id: "spit_name",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.mid.spit_name",
      onscreenText: "You spat it. The chronicle records the spit. The Politician's primer: 'the spat name is the name that finally enters the public domain.' My name is public now. EVERYONE can spit it. You have made me a verb. I have become 'to be spat.' Thank you. Sincerely. The Politician would have written a campaign on it.",
      choices: [
        { label: "Walk away from the spit.", nextId: "spit_name_walk" },
      ],
    },
    spit_name_walk: {
      id: "spit_name_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.mid.spit_name_walk",
      onscreenText: "You walked. The spit dried on the chronicle's page. The Politician's primer: 'the dried spit is the chronicle's seal.' My name is sealed. I am sealed. The campaign continues, with the seal as my new credit line. I owe you something. I am still calculating what.",
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
      onscreenText: "Use my name. It is the last thing in this chronicle that is fully mine. The Politician left me my name and a smile and a tic. You have the smile and you have learned the tic. The name is the last gift. The chronicle will note who you make it.",
      choices: [
        { label: "Say it as an apology.", nextId: "say_apology", sets: "mercy_at_grudge_high_name_reveal_moment" },
        { label: "Say it as a verdict.", nextId: "say_verdict", sets: "aggression_at_grudge_high_name_reveal_moment" },
      ],
    },
    say_apology: {
      id: "say_apology",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.high.say_apology",
      onscreenText: "You said it as an apology. The Politician would have refused the apology. I will not refuse it. The chronicle records the apology as the lightest line in the campaign. I am, for one beat, not a Nemesis. I am a person with a name. Thank you.",
      choices: [
        { label: "Hold the apology. Walk on.", nextId: "say_apology_hold" },
      ],
    },
    say_apology_hold: {
      id: "say_apology_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.high.say_apology_hold",
      onscreenText: "You held the apology. You walked on. The chronicle records the apology as the line that closes the rivalry's middle act. The middle act is over. The closing act is ours. I will play it quietly. As is your style. As is, now, mine.",
    },
    say_verdict: {
      id: "say_verdict",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.high.say_verdict",
      onscreenText: "You said it as a verdict. The chronicle records the verdict as final. The Politician's primer: 'the verdict-name is the name that becomes the Nemesis's headstone.' My headstone is being engraved. I am still alive. I am dictating the rest of the engraving. The chronicle is listening.",
      choices: [
        { label: "Stay for the dictation. Quietly.", nextId: "say_verdict_stay" },
      ],
    },
    say_verdict_stay: {
      id: "say_verdict_stay",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.name_reveal_moment.high.say_verdict_stay",
      onscreenText: "You stayed. You listened. I dictated. The chronicle wrote. The Politician's primer: 'the verdict that the wielder stays for is the verdict that becomes the chronicle's longest entry.' This is the longest entry. We are inside it. The campaign continues, inside the entry. We are inside the entry, together, forever, until the chronicle closes.",
    },
  },
};

/* ─── final_encounter ─── */

const FINAL_ENCOUNTER_LOW: DialogTree = {
  id: "ghost_vs_jester.final_encounter.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.low.opening",
      onscreenText: "Act Seven. The Convergence Seat has fallen. So have most of my plans. The Politician's primer: 'the arc that ends without an audience is the arc that the chronicle inherits.' The chronicle is inheriting us. Quietly. As is your style.",
      choices: [
        { label: "Mercy at the end.", nextId: "mercy_end", sets: "mercy_at_grudge_low_final_encounter" },
        { label: "Quick, clean end.", nextId: "clean_end", sets: "aggression_at_grudge_low_final_encounter" },
      ],
    },
    mercy_end: {
      id: "mercy_end",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.low.mercy_end",
      onscreenText: "Mercy at the end. The Politician's primer: 'the merciful close is the close that the next chronicle inherits.' The next chronicle is starting. You will not be in it. I will not be in it. But the mercy will be. The mercy travels.",
      choices: [
        { label: "Walk on to the next chronicle.", nextId: "mercy_end_walk" },
      ],
    },
    mercy_end_walk: {
      id: "mercy_end_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.low.mercy_end_walk",
      onscreenText: "You walked. The chronicle closed around the mercy. I am closing too. The Politician would have called this 'the cleanest close in the regime's records.' I would not have agreed in life. I agree now.",
    },
    clean_end: {
      id: "clean_end",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.low.clean_end",
      onscreenText: "An ending. Quick. Clean. The Politician would have applauded the brevity. I applaud the brevity. The chronicle records the brevity as the most efficient close in the regime. We are efficient. We are closed.",
      choices: [
        { label: "Walk away. Don't watch.", nextId: "clean_end_walk" },
      ],
    },
    clean_end_walk: {
      id: "clean_end_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.low.clean_end_walk",
      onscreenText: "You walked. You did not watch. The chronicle's last image of me is the back of your head. The Politician's primer: 'the back of the head is the chronicle's most dignified image.' I have been dignified. The chronicle records it.",
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
      onscreenText: "End of the arc. Most of mine, anyway. The Politician's primer: 'the arc that ends with both rivals in the room is the arc that becomes the chronicle's masthead.' We are the masthead. The chronicle's next reader will read us first. They will not laugh. You taught the chronicle not to laugh.",
      choices: [
        { label: "Let them close their own file.", nextId: "let_close", sets: "mercy_at_grudge_mid_final_encounter" },
        { label: "Close their file for them.", nextId: "close_for", sets: "aggression_at_grudge_mid_final_encounter" },
      ],
    },
    let_close: {
      id: "let_close",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.mid.let_close",
      onscreenText: "You let me close my own file. The Politician's primer: 'the self-closed file is the file that survives the regime.' I am surviving in the file. The chronicle is reading the file. I am writing the last sentence. The sentence is: 'I tried.'",
      choices: [
        { label: "Walk on. Let them write it.", nextId: "let_close_walk" },
      ],
    },
    let_close_walk: {
      id: "let_close_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.mid.let_close_walk",
      onscreenText: "You walked. I wrote. The Politician would have written 'I won.' I wrote 'I tried.' The chronicle records the difference. The chronicle prefers the difference. So do I, now. Thank you. Quietly.",
    },
    close_for: {
      id: "close_for",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.mid.close_for",
      onscreenText: "You closed my file for me. The Politician's primer: 'the file closed by the rival is the file whose ending the rival owns.' You own my ending. I am writing one more line, in your closing, in your handwriting. The line is: 'I made him quieter.' The chronicle records the credit.",
      choices: [
        { label: "Sign the closing.", nextId: "close_for_sign" },
      ],
    },
    close_for_sign: {
      id: "close_for_sign",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.mid.close_for_sign",
      onscreenText: "You signed the closing. With a mark, not a name. The chronicle records the mark as the most dignified signature in the regime. The Politician would have envied the mark. I envy the mark. The chronicle is rich with the mark.",
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
      onscreenText: "The chronicle is folding this story shut around both of us. I have spent seven cohorts trying to make you laugh and you have spent seven cohorts teaching me that the laugh I wanted was the silence I refused. I have learned the silence. I cannot perform it. You can. Show me one more time.",
      choices: [
        { label: "Show them silence. One last time.", nextId: "show_silence", sets: "mercy_at_grudge_high_final_encounter" },
        { label: "Refuse the lesson. End the show.", nextId: "refuse_lesson", sets: "aggression_at_grudge_high_final_encounter" },
      ],
    },
    show_silence: {
      id: "show_silence",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.high.show_silence",
      onscreenText: "You showed me. The silence held. The chronicle is full of the silence. The Politician's primer: 'the lesson learned at the close is the lesson the regime's reader inherits.' The reader is inheriting it. I am the lesson. You are the teacher. The chronicle is the textbook. The campaign closes.",
      choices: [
        { label: "Hold the silence with them. To the end.", nextId: "show_silence_hold" },
      ],
    },
    show_silence_hold: {
      id: "show_silence_hold",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.high.show_silence_hold",
      onscreenText: "You held it with me. To the end. The chronicle's last page is the silence we held together. The Politician would have hated this ending. She would have hated that we ended it together. The chronicle marks it. The chronicle closes. The silence remains. *[the smile holds one beat too long]*",
    },
    refuse_lesson: {
      id: "refuse_lesson",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.high.refuse_lesson",
      onscreenText: "You refused. With a turn of the head. The Politician's primer: 'the refused last lesson is the lesson that the chronicle teaches in the rivalrist's absence.' I will teach myself, in your absence. The chronicle will not have you to compare me to. I will be worse for it. I will be better for it. The chronicle will know which.",
      choices: [
        { label: "Walk away from the show.", nextId: "refuse_lesson_walk" },
      ],
    },
    refuse_lesson_walk: {
      id: "refuse_lesson_walk",
      speaker: "nemesis",
      voLineId: "nemesis.ghost_vs_jester.final_encounter.high.refuse_lesson_walk",
      onscreenText: "You walked. The chronicle did not follow. The chronicle stayed with me. The Politician would have called this 'the chronicle's stubborn loyalty.' I am loyalty's recipient. I am loyalty's burden. I will carry the loyalty until the chronicle ends. The chronicle is ending. I am still carrying. *[the smile holds one beat too long. the chronicle marks it as the last beat.]*",
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
