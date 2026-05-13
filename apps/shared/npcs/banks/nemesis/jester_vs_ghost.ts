/* ═══════════════════════════════════════════════════════
   JESTER-PLAYER vs. GHOST-NEMESIS — Phase K Wave 5 (hand-deepened)

   The reverse Picard-vs-Q. Here the player is the
   performer; the Nemesis is the audience that refuses to
   be one. The Jester-player heckles into negative space
   and the negative space heckles back, in handwriting,
   in margins, in the silence between the punchline and
   its echo.

   The Ghost-Nemesis carries the Politician's tic as
   stage-direction only — never voiced, only *[written]*.
   The Jester-player's choices are the loudest in the
   game — workshop, heckle, tip, cut. The Ghost-Nemesis's
   responses are the quietest. The rivalry is the volume
   gradient itself.
   ═══════════════════════════════════════════════════════ */

import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

/* ─── first_sighting ─── */

const FIRST_SIGHTING_LOW: DialogTree = {
  id: "jester_vs_ghost.first_sighting.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.low.opening",
      onscreenText: "*[a single chair, slightly turned away from your stage. no applause. no movement.]*",
      choices: [
        { label: "Workshop the bit on them.", nextId: "workshop", sets: "mercy_at_grudge_low_first_sighting" },
        { label: "Heckle the empty chair.", nextId: "heckle", sets: "aggression_at_grudge_low_first_sighting" },
      ],
    },
    workshop: {
      id: "workshop",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.low.workshop",
      onscreenText: "*[the chair turns one degree. a notebook closes. no other movement. the chronicle records the degree.]*",
      choices: [
        { label: "Take the note.", nextId: "workshop_take" },
      ],
    },
    workshop_take: {
      id: "workshop_take",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.low.workshop_take",
      onscreenText: "*[the notebook opens again. a single line is written. you do not see what it is. the chair turns back one degree.]*",
    },
    heckle: {
      id: "heckle",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.low.heckle",
      onscreenText: "*[the chair stays still. the notebook does not open. the silence holds longer than the heckle.]*",
      choices: [
        { label: "Hold the heckle until it breaks.", nextId: "heckle_hold" },
      ],
    },
    heckle_hold: {
      id: "heckle_hold",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.low.heckle_hold",
      onscreenText: "*[it doesn't break. it outlasts you. the chair is still still. the room learns the stillness. you learn the stillness. the chronicle records the lesson.]*",
    },
  },
};

const FIRST_SIGHTING_MID: DialogTree = {
  id: "jester_vs_ghost.first_sighting.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.mid.opening",
      onscreenText: "*[three cohorts of bits. three cohorts of the same chair. the chair has not laughed. the chair has, however, started taking notes you cannot read.]*",
      choices: [
        { label: "Cut a fresh bit just for them.", nextId: "fresh_bit", sets: "mercy_at_grudge_mid_first_sighting" },
        { label: "Tip your hat to the chair.", nextId: "tip_hat", sets: "aggression_at_grudge_mid_first_sighting" },
      ],
    },
    fresh_bit: {
      id: "fresh_bit",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.mid.fresh_bit",
      onscreenText: "*[the notebook writes faster. you cannot see the page. the chair turns two degrees. that's the most movement you have ever gotten.]*",
      choices: [
        { label: "Push for three degrees.", nextId: "fresh_bit_push" },
      ],
    },
    fresh_bit_push: {
      id: "fresh_bit_push",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.mid.fresh_bit_push",
      onscreenText: "*[the chair turns back to one degree. the notebook closes. the lesson the Ghost teaches: do not chase what you have already earned.]*",
    },
    tip_hat: {
      id: "tip_hat",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.mid.tip_hat",
      onscreenText: "*[the chair does not tip back. the notebook writes one word. you are sure the word is your name. you cannot prove it.]*",
      choices: [
        { label: "Demand they show the page.", nextId: "tip_hat_demand" },
      ],
    },
    tip_hat_demand: {
      id: "tip_hat_demand",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.mid.tip_hat_demand",
      onscreenText: "*[the notebook is closed. the chair is still. the chronicle records the page as 'unread.' the page will remain unread for three more cohorts. you will think about it daily.]*",
    },
  },
};

const FIRST_SIGHTING_HIGH: DialogTree = {
  id: "jester_vs_ghost.first_sighting.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.high.opening",
      onscreenText: "*[the chair is empty. the notebook is on the seat, closed. they have left and they have left their notes on you on the chair. the chair is the review.]*",
      choices: [
        { label: "Open the notebook.", nextId: "open_book", sets: "mercy_at_grudge_high_first_sighting" },
        { label: "Don't open it. Walk on.", nextId: "dont_open", sets: "aggression_at_grudge_high_first_sighting" },
      ],
    },
    open_book: {
      id: "open_book",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.high.open_book",
      onscreenText: "*[the notebook is full. seven cohorts of notes on your act. the last page reads: 'they are funny when they don't know they are being watched. they are always being watched. that is the bit.']*",
      choices: [
        { label: "Close the book. Carry it home.", nextId: "open_book_carry" },
      ],
    },
    open_book_carry: {
      id: "open_book_carry",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.high.open_book_carry",
      onscreenText: "*[you carry the book. the Ghost-Nemesis is somewhere watching you carry it. the chronicle records the carry as the longest review either of you ever wrote.]*",
    },
    dont_open: {
      id: "dont_open",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.high.dont_open",
      onscreenText: "*[the notebook stays closed. you walk on. the Ghost-Nemesis is still somewhere, taking notes about your refusal. the refusal goes in the next book. there is always a next book.]*",
      choices: [
        { label: "Don't look back.", nextId: "dont_open_walk" },
      ],
    },
    dont_open_walk: {
      id: "dont_open_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.first_sighting.high.dont_open_walk",
      onscreenText: "*[you didn't look. the Ghost-Nemesis would have been proud. they are. somewhere. silently. you can feel them being proud. you cannot quote them. that is the whole rivalry.]*",
    },
  },
};

/* ─── sabotage_caught_in_act ─── */

const SABOTAGE_CAUGHT_IN_ACT_LOW: DialogTree = {
  id: "jester_vs_ghost.sabotage_caught_in_act.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.low.opening",
      onscreenText: "*[a single page has been left on your music stand mid-set. it reads: 'i was here for the closer. you took too long. i left.']*",
      choices: [
        { label: "Pocket the page. Play on.", nextId: "pocket", sets: "mercy_at_grudge_low_sabotage_caught_in_act" },
        { label: "Read the page aloud to the room.", nextId: "read_aloud", sets: "aggression_at_grudge_low_sabotage_caught_in_act" },
      ],
    },
    pocket: {
      id: "pocket",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.low.pocket",
      onscreenText: "*[the page stays in your pocket for three weeks. you take it out occasionally. it is the most consistent audience you have ever had.]*",
      choices: [
        { label: "Put it back, carefully.", nextId: "pocket_back" },
      ],
    },
    pocket_back: {
      id: "pocket_back",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.low.pocket_back",
      onscreenText: "*[the page softens with handling. the ink does not run. the Ghost-Nemesis writes in ink that does not run. you make a note of this. you cannot use the note.]*",
    },
    read_aloud: {
      id: "read_aloud",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.low.read_aloud",
      onscreenText: "*[the room laughs. the Ghost-Nemesis is not in the room. the laughter is for them and they are not here to hear it. that is the joke. that has always been the joke.]*",
      choices: [
        { label: "Stop reading mid-line.", nextId: "read_aloud_stop" },
      ],
    },
    read_aloud_stop: {
      id: "read_aloud_stop",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.low.read_aloud_stop",
      onscreenText: "*[the room waits for the punchline. there is none. the silence holds. it was their silence all along. you finally got the bit they have been giving you for three cohorts.]*",
    },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_MID: DialogTree = {
  id: "jester_vs_ghost.sabotage_caught_in_act.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.mid.opening",
      onscreenText: "*[the page tonight reads: 'you have started writing your set to anticipate me. that means you have lost. congratulations. you are quieter than you were.']*",
      choices: [
        { label: "Rewrite the set on the spot.", nextId: "rewrite", sets: "mercy_at_grudge_mid_sabotage_caught_in_act" },
        { label: "Burn the page on stage.", nextId: "burn_page", sets: "aggression_at_grudge_mid_sabotage_caught_in_act" },
      ],
    },
    rewrite: {
      id: "rewrite",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.mid.rewrite",
      onscreenText: "*[the new set lands. the room laughs harder than they have ever laughed at you. you suspect the Ghost-Nemesis is in the back row tonight. you do not look back to check.]*",
      choices: [
        { label: "Don't check.", nextId: "rewrite_dont_check" },
      ],
    },
    rewrite_dont_check: {
      id: "rewrite_dont_check",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.mid.rewrite_dont_check",
      onscreenText: "*[the back row's chair is empty after the set. there is a single page on the seat. it reads, in the same hand: 'closer.']*",
    },
    burn_page: {
      id: "burn_page",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.mid.burn_page",
      onscreenText: "*[the page burns. the room watches the page burn. the room is silent. you have made silence the loudest thing in the room. the Ghost-Nemesis would have approved. you cannot ask.]*",
      choices: [
        { label: "Walk off mid-burn.", nextId: "burn_page_walk" },
      ],
    },
    burn_page_walk: {
      id: "burn_page_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.mid.burn_page_walk",
      onscreenText: "*[you walk off. the page finishes burning. a single ash falls. on the ash, in the same impossible ink: 'noted.']*",
    },
  },
};

const SABOTAGE_CAUGHT_IN_ACT_HIGH: DialogTree = {
  id: "jester_vs_ghost.sabotage_caught_in_act.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.high.opening",
      onscreenText: "*[the page on the stand tonight is your own handwriting. you do not remember writing it. it reads: 'i have become quiet enough to be them.']*",
      choices: [
        { label: "Accept the page. Open the set.", nextId: "accept_open", sets: "mercy_at_grudge_high_sabotage_caught_in_act" },
        { label: "Tear the page up.", nextId: "tear_up", sets: "aggression_at_grudge_high_sabotage_caught_in_act" },
      ],
    },
    accept_open: {
      id: "accept_open",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.high.accept_open",
      onscreenText: "*[you open the set with a long silence. the room holds the silence. the chronicle records the silence as the funniest bit you have ever written. the Ghost-Nemesis is in every seat now.]*",
      choices: [
        { label: "Hold the silence. Walk off.", nextId: "accept_open_walk" },
      ],
    },
    accept_open_walk: {
      id: "accept_open_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.high.accept_open_walk",
      onscreenText: "*[you walk off. the room is still silent. the silence follows you home. the Ghost-Nemesis follows the silence. you are friends now, in the way the Politician would have called impossible. she would have been wrong.]*",
    },
    tear_up: {
      id: "tear_up",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.high.tear_up",
      onscreenText: "*[you tear the page. the pieces fall in a pattern. the pattern reads the same sentence again. the chronicle has anticipated the tear. the chronicle records: 'tearing is also writing.']*",
      choices: [
        { label: "Burn the pieces this time.", nextId: "tear_up_burn" },
      ],
    },
    tear_up_burn: {
      id: "tear_up_burn",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.sabotage_caught_in_act.high.tear_up_burn",
      onscreenText: "*[the ash settles. on the ash, in the same impossible ink, the same sentence again. it is not a sentence. it is a verdict. you signed it. you don't remember signing it. the Ghost-Nemesis remembers.]*",
    },
  },
};

/* ─── mocking_interlude ─── */

const MOCKING_INTERLUDE_LOW: DialogTree = {
  id: "jester_vs_ghost.mocking_interlude.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.low.opening",
      onscreenText: "*[a folded note slides under your dressing-room door. inside: 'just here to remind you i exist.']*",
      choices: [
        { label: "Send a note back.", nextId: "send_back", sets: "mercy_at_grudge_low_mocking_interlude" },
        { label: "Stand on the note.", nextId: "stand_note", sets: "aggression_at_grudge_low_mocking_interlude" },
      ],
    },
    send_back: {
      id: "send_back",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.low.send_back",
      onscreenText: "*[your note slides out under the door. it returns within the hour, unchanged, with one new line in their hand: 'received. it is the loudest thing you have ever said to me. i appreciate the volume.']*",
      choices: [
        { label: "Keep the note. Frame it.", nextId: "send_back_frame" },
      ],
    },
    send_back_frame: {
      id: "send_back_frame",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.low.send_back_frame",
      onscreenText: "*[the note hangs in your dressing room for the rest of your career. the Ghost-Nemesis never sends another. the chronicle records the framed note as the longest correspondence in the regime.]*",
    },
    stand_note: {
      id: "stand_note",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.low.stand_note",
      onscreenText: "*[the note is under your boot for the rest of the set. when you lift the boot, the floor underneath reads the same sentence. you walk on the sentence. you walk on the sentence. the sentence holds.]*",
      choices: [
        { label: "Walk off without lifting your boot.", nextId: "stand_note_walk" },
      ],
    },
    stand_note_walk: {
      id: "stand_note_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.low.stand_note_walk",
      onscreenText: "*[you walk off. the note travels with the boot. somewhere, the Ghost-Nemesis is writing a longer sentence on a longer floor. the chronicle is the floor. you are walking on the chronicle. they always were.]*",
    },
  },
};

const MOCKING_INTERLUDE_MID: DialogTree = {
  id: "jester_vs_ghost.mocking_interlude.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.mid.opening",
      onscreenText: "*[the note tonight reads: 'you no longer perform when i am not there. the audience has noticed. the audience is on my side now.']*",
      choices: [
        { label: "Perform harder when they're gone.", nextId: "perform_harder", sets: "mercy_at_grudge_mid_mocking_interlude" },
        { label: "Stop performing entirely.", nextId: "stop_perform", sets: "aggression_at_grudge_mid_mocking_interlude" },
      ],
    },
    perform_harder: {
      id: "perform_harder",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.mid.perform_harder",
      onscreenText: "*[the next set lands hardest when they are demonstrably absent. you have outgrown the audience. you have outgrown them. the chronicle records the growth as a footnote in their book.]*",
      choices: [
        { label: "Keep the footnote close.", nextId: "perform_harder_keep" },
      ],
    },
    perform_harder_keep: {
      id: "perform_harder_keep",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.mid.perform_harder_keep",
      onscreenText: "*[the footnote stays in your mouth as a tongue-stop. you stop, mid-bit, every set, for one beat. the audience thinks it's craft. the audience is wrong. the Ghost-Nemesis would correct them. the Ghost-Nemesis does not correct.]*",
    },
    stop_perform: {
      id: "stop_perform",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.mid.stop_perform",
      onscreenText: "*[you cancel the next three sets. the venues recover. the audience grumbles. the Ghost-Nemesis writes nothing. for the first time, the absence of their writing is what you read.]*",
      choices: [
        { label: "Hold the cancellation.", nextId: "stop_perform_hold" },
      ],
    },
    stop_perform_hold: {
      id: "stop_perform_hold",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.mid.stop_perform_hold",
      onscreenText: "*[the silence holds. the Ghost-Nemesis is somewhere learning that the silence they gave you is now larger than the silence they kept. the chronicle records the inheritance as 'mutual.']*",
    },
  },
};

const MOCKING_INTERLUDE_HIGH: DialogTree = {
  id: "jester_vs_ghost.mocking_interlude.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.high.opening",
      onscreenText: "*[the note tonight is in your own handwriting. it reads: 'i am writing for them now. they have been writing for me for three cohorts. we have switched.']*",
      choices: [
        { label: "Accept the switch.", nextId: "accept_switch", sets: "mercy_at_grudge_high_mocking_interlude" },
        { label: "Refuse to switch.", nextId: "refuse_switch", sets: "aggression_at_grudge_high_mocking_interlude" },
      ],
    },
    accept_switch: {
      id: "accept_switch",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.high.accept_switch",
      onscreenText: "*[the chronicle records the switch as 'mutual conversion.' the Politician would have called it 'the cleanest regime change in the campaign.' she would have been wrong about who changed regimes.]*",
      choices: [
        { label: "Walk on, quietly.", nextId: "accept_switch_walk" },
      ],
    },
    accept_switch_walk: {
      id: "accept_switch_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.high.accept_switch_walk",
      onscreenText: "*[you walk on quietly. the Ghost-Nemesis, somewhere, is laughing. you cannot hear it. the chronicle hears it. the chronicle records the laughter as 'the loudest possible.']*",
    },
    refuse_switch: {
      id: "refuse_switch",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.high.refuse_switch",
      onscreenText: "*[you tear the note. the pieces rearrange themselves on the floor: 'noted.' you tear the floor. the chronicle is the floor. the chronicle is, finally, what you cannot tear.]*",
      choices: [
        { label: "Step back from the floor.", nextId: "refuse_switch_step" },
      ],
    },
    refuse_switch_step: {
      id: "refuse_switch_step",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.mocking_interlude.high.refuse_switch_step",
      onscreenText: "*[you step back. the floor is still the chronicle. the Ghost-Nemesis is still the floor. you are still walking on them. you have always been walking on them. you finally know.]*",
    },
  },
};

/* ─── lieutenant_promotion ─── */

const LIEUTENANT_PROMOTION_LOW: DialogTree = {
  id: "jester_vs_ghost.lieutenant_promotion.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.low.opening",
      onscreenText: "*[a brass nameplate appears on a door you have never opened. the nameplate is blank. underneath, in their hand: 'i am now in charge of two more like me. you may notice.']*",
      choices: [
        { label: "Knock on the door.", nextId: "knock", sets: "mercy_at_grudge_low_lieutenant_promotion" },
        { label: "Paint over the nameplate.", nextId: "paint_over", sets: "aggression_at_grudge_low_lieutenant_promotion" },
      ],
    },
    knock: {
      id: "knock",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.low.knock",
      onscreenText: "*[the door does not open. a sheet slides out. the sheet reads: 'thank you for knocking. that is the most courtesy this office has received.']*",
      choices: [
        { label: "Slide a note back.", nextId: "knock_note" },
      ],
    },
    knock_note: {
      id: "knock_note",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.low.knock_note",
      onscreenText: "*[your note slides out, slightly creased. in their hand, added: 'creased on purpose. i appreciated the detail. the office is the chronicle's now. so are we.']*",
    },
    paint_over: {
      id: "paint_over",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.low.paint_over",
      onscreenText: "*[the paint dries clear. the nameplate is still blank underneath. the chronicle records the paint as 'transparent on contact.']*",
      choices: [
        { label: "Walk away from the door.", nextId: "paint_over_walk" },
      ],
    },
    paint_over_walk: {
      id: "paint_over_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.low.paint_over_walk",
      onscreenText: "*[you walk. the door remains. the office remains. the Lieutenant remains. so do their two subordinates. the chronicle has filed all of it under 'unread.']*",
    },
  },
};

const LIEUTENANT_PROMOTION_MID: DialogTree = {
  id: "jester_vs_ghost.lieutenant_promotion.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.mid.opening",
      onscreenText: "*[the office has expanded. four nameplates now, three blank, one with your name. you do not remember accepting employment.]*",
      choices: [
        { label: "Take the office. Sign nothing.", nextId: "take_office", sets: "mercy_at_grudge_mid_lieutenant_promotion" },
        { label: "Burn down the office.", nextId: "burn_office", sets: "aggression_at_grudge_mid_lieutenant_promotion" },
      ],
    },
    take_office: {
      id: "take_office",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.mid.take_office",
      onscreenText: "*[the office is yours. signed by no one. the chronicle records the office as 'the most binding contract that was never written.' you are now their Lieutenant's neighbor. the rivalry is now zoning.]*",
      choices: [
        { label: "Hang a sign: 'in.'", nextId: "take_office_sign" },
      ],
    },
    take_office_sign: {
      id: "take_office_sign",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.mid.take_office_sign",
      onscreenText: "*[the sign hangs. across the hall, on their door, a matching sign in their hand: 'also in.' the chronicle records the symmetry as 'mutually performative.']*",
    },
    burn_office: {
      id: "burn_office",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.mid.burn_office",
      onscreenText: "*[the office burns. the Lieutenant's office across the hall does not. the chronicle records the asymmetry as 'predictable.' you have lost zoning. you are now homeless. they are now the only Lieutenant. the campaign continues.]*",
      choices: [
        { label: "Don't apologize. Walk on.", nextId: "burn_office_walk" },
      ],
    },
    burn_office_walk: {
      id: "burn_office_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.mid.burn_office_walk",
      onscreenText: "*[you walk. somewhere, in a quieter office, the Ghost-Lieutenant adds a line to a long letter you will never read. the letter is, for the first time, not about you. you have been demoted in their attention. that is the wound.]*",
    },
  },
};

const LIEUTENANT_PROMOTION_HIGH: DialogTree = {
  id: "jester_vs_ghost.lieutenant_promotion.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.high.opening",
      onscreenText: "*[the office is the size of a city block now. their Lieutenant-cell runs trade in three districts. your Jester-routine fits in one storage closet. the math is no longer in your favor. the chronicle is no longer in your favor either.]*",
      choices: [
        { label: "Concede the city.", nextId: "concede", sets: "mercy_at_grudge_high_lieutenant_promotion" },
        { label: "Audition for the cell.", nextId: "audition", sets: "aggression_at_grudge_high_lieutenant_promotion" },
      ],
    },
    concede: {
      id: "concede",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.high.concede",
      onscreenText: "*[the concession is filed in their hand. you did not write it. they wrote it for you. you signed by not signing. the chronicle records: 'the cleanest concession in the regime.']*",
      choices: [
        { label: "Walk out, head high.", nextId: "concede_walk" },
      ],
    },
    concede_walk: {
      id: "concede_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.high.concede_walk",
      onscreenText: "*[you walk. the Ghost-Lieutenant follows by not following. the chronicle records the not-following as 'the most dignified pursuit in the campaign.' you are no longer their rival. you are now their warm-up. you do not mind. you might.]*",
    },
    audition: {
      id: "audition",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.high.audition",
      onscreenText: "*[you audition. the Ghost-Lieutenant does not say anything. they hand you a folder. inside: your own name, on a roster you do not remember joining. the chronicle records: 'recruitment by inheritance.']*",
      choices: [
        { label: "Sign the roster anyway.", nextId: "audition_sign" },
      ],
    },
    audition_sign: {
      id: "audition_sign",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.lieutenant_promotion.high.audition_sign",
      onscreenText: "*[you sign. the Ghost-Lieutenant nods. the nod is the loudest acknowledgment the chronicle has ever recorded from them. you have made them speak. the cost is your name on their roster. you might have paid it knowingly.]*",
    },
  },
};

/* ─── cohort_end_confrontation ─── */

const COHORT_END_CONFRONTATION_LOW: DialogTree = {
  id: "jester_vs_ghost.cohort_end_confrontation.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.low.opening",
      onscreenText: "*[your apprentice graduated. on the back of their diploma, in unfamiliar ink: 'i was here for the ceremony. they did not see me. i saw them. they did good work. tell them.']*",
      choices: [
        { label: "Tell your apprentice.", nextId: "tell_apprentice", sets: "mercy_at_grudge_low_cohort_end_confrontation" },
        { label: "Don't tell them.", nextId: "dont_tell", sets: "aggression_at_grudge_low_cohort_end_confrontation" },
      ],
    },
    tell_apprentice: {
      id: "tell_apprentice",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.low.tell_apprentice",
      onscreenText: "*[your apprentice reads the note. they do not laugh. they do not cry. they file it. the Ghost-Nemesis would have approved of the filing. you tell them this. they file the telling.]*",
      choices: [
        { label: "Walk on with them.", nextId: "tell_apprentice_walk" },
      ],
    },
    tell_apprentice_walk: {
      id: "tell_apprentice_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.low.tell_apprentice_walk",
      onscreenText: "*[the apprentice walks with you. their filing-discipline outlasts your bits. you suspect the Ghost-Nemesis has taught them something you cannot teach. you are at peace with this. mostly.]*",
    },
    dont_tell: {
      id: "dont_tell",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.low.dont_tell",
      onscreenText: "*[the note stays in your pocket. the apprentice never reads it. the Ghost-Nemesis writes nothing else. the chronicle records the omission as 'mutual respect.']*",
      choices: [
        { label: "Keep the note safe.", nextId: "dont_tell_keep" },
      ],
    },
    dont_tell_keep: {
      id: "dont_tell_keep",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.low.dont_tell_keep",
      onscreenText: "*[you keep the note. it stays unread. the Ghost-Nemesis stays unread. the chronicle stays patient. the apprentice graduates without knowing they were witnessed. they will know in time.]*",
    },
  },
};

const COHORT_END_CONFRONTATION_MID: DialogTree = {
  id: "jester_vs_ghost.cohort_end_confrontation.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.mid.opening",
      onscreenText: "*[your apprentice did not graduate cleanly. on the back of the broken diploma, in unfamiliar ink: 'i watched the break. i could have stopped it. i did not. ask me why.']*",
      choices: [
        { label: "Ask why.", nextId: "ask_why", sets: "mercy_at_grudge_mid_cohort_end_confrontation" },
        { label: "Don't ask. Walk on.", nextId: "dont_ask", sets: "aggression_at_grudge_mid_cohort_end_confrontation" },
      ],
    },
    ask_why: {
      id: "ask_why",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.mid.ask_why",
      onscreenText: "*[a longer letter arrives. it reads: 'the break was the cleanest exit your apprentice had. they walked into it. i would have walked into it too. i did, three cohorts ago. i am not unsympathetic.']*",
      choices: [
        { label: "Burn the letter, gently.", nextId: "ask_why_burn" },
      ],
    },
    ask_why_burn: {
      id: "ask_why_burn",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.mid.ask_why_burn",
      onscreenText: "*[the letter burns slowly. the Ghost-Nemesis is somewhere watching it burn. they wrote it for the burn. the chronicle records the burn as 'the only collaborative gesture in the campaign so far.']*",
    },
    dont_ask: {
      id: "dont_ask",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.mid.dont_ask",
      onscreenText: "*[you walked. the diploma stays broken. the Ghost-Nemesis writes nothing else. the chronicle is quieter than usual. the apprentice is quieter than usual. all of you, quieter. the Politician would have called this 'the campaign's stillest pause.']*",
      choices: [
        { label: "Hold the pause.", nextId: "dont_ask_hold" },
      ],
    },
    dont_ask_hold: {
      id: "dont_ask_hold",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.mid.dont_ask_hold",
      onscreenText: "*[the pause holds. it holds for a long time. the chronicle eventually moves on. the Ghost-Nemesis does not. you do not. you both stay in the pause. the chronicle calls it 'the pause that became an address.']*",
    },
  },
};

const COHORT_END_CONFRONTATION_HIGH: DialogTree = {
  id: "jester_vs_ghost.cohort_end_confrontation.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.high.opening",
      onscreenText: "*[your apprentice died. on their last note, in unfamiliar ink at the bottom: 'i was there. they spoke my name aloud at the end. you taught them how. i will not forget.']*",
      choices: [
        { label: "Sit with the note.", nextId: "sit_note", sets: "mercy_at_grudge_high_cohort_end_confrontation" },
        { label: "Tear the unfamiliar ink off.", nextId: "tear_ink", sets: "aggression_at_grudge_high_cohort_end_confrontation" },
      ],
    },
    sit_note: {
      id: "sit_note",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.high.sit_note",
      onscreenText: "*[you sit. the note holds. the Ghost-Nemesis is somewhere sitting too. you are sitting together, across a chronicle, in a silence that has been earned. the Politician's primer: 'the earned silence is the longest sermon.' this is the sermon.]*",
      choices: [
        { label: "Hold the sermon.", nextId: "sit_note_hold" },
      ],
    },
    sit_note_hold: {
      id: "sit_note_hold",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.high.sit_note_hold",
      onscreenText: "*[the sermon holds. across the chronicle, the Ghost-Nemesis stands. they fold the note like a flag. they put it somewhere you cannot see. the chronicle records the folding as 'the chronicle's longest goodbye.']*",
    },
    tear_ink: {
      id: "tear_ink",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.high.tear_ink",
      onscreenText: "*[you tear the unfamiliar ink. the paper holds your apprentice's writing. you have separated your loss from their witness. you carry the loss alone. the chronicle records: 'the loss carried alone is the loss the rival cannot share.']*",
      choices: [
        { label: "Walk away with the torn paper.", nextId: "tear_ink_walk" },
      ],
    },
    tear_ink_walk: {
      id: "tear_ink_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.cohort_end_confrontation.high.tear_ink_walk",
      onscreenText: "*[you walk. the torn paper is yours. the unfamiliar ink, on the ground, blows away. the Ghost-Nemesis lets it blow. they will not chase. they never chase. the chronicle records: 'the rival who let the wind take their witness.']*",
    },
  },
};

/* ─── accumulation_reveal ─── */

const ACCUMULATION_REVEAL_LOW: DialogTree = {
  id: "jester_vs_ghost.accumulation_reveal.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.low.opening",
      onscreenText: "*[a second blank notebook appears on a chair next to the first. the new notebook has a different binding. in the margin of your set list, the Ghost-Nemesis's hand: 'there is a sibling. they take notes too. you may notice.']*",
      choices: [
        { label: "Salute both chairs.", nextId: "salute_both", sets: "mercy_at_grudge_low_accumulation_reveal" },
        { label: "Ignore the new one.", nextId: "ignore_new", sets: "aggression_at_grudge_low_accumulation_reveal" },
      ],
    },
    salute_both: {
      id: "salute_both",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.low.salute_both",
      onscreenText: "*[both notebooks open at once. both close at once. the chronicle records the symmetry as 'the chorus has begun.' you are now playing to two silent reviewers. you are funnier for it. you are tired for it.]*",
      choices: [
        { label: "Add a third chair, just in case.", nextId: "salute_both_third" },
      ],
    },
    salute_both_third: {
      id: "salute_both_third",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.low.salute_both_third",
      onscreenText: "*[the third chair stays empty for the rest of the cohort. in your set list, in the Ghost-Nemesis's hand: 'thank you. that is for me. you understand.']*",
    },
    ignore_new: {
      id: "ignore_new",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.low.ignore_new",
      onscreenText: "*[the new notebook is filed quickly. the Ghost-Nemesis writes one more line: 'they noted the ignore. they file in a different cadence. the cadence is louder. you will hear them.']*",
      choices: [
        { label: "Keep ignoring.", nextId: "ignore_new_keep" },
      ],
    },
    ignore_new_keep: {
      id: "ignore_new_keep",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.low.ignore_new_keep",
      onscreenText: "*[you ignore. the new sibling's cadence becomes audible by the third week. you cannot ignore audibility. the chronicle records: 'the ignored sibling became audible by being unignored.']*",
    },
  },
};

const ACCUMULATION_REVEAL_MID: DialogTree = {
  id: "jester_vs_ghost.accumulation_reveal.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.mid.opening",
      onscreenText: "*[four chairs now. four bindings. the Ghost-Nemesis's hand in the margin tonight: 'you may need a bigger room. the chorus's filing-cabinet is now bigger than the room.']*",
      choices: [
        { label: "Move to a bigger room.", nextId: "bigger_room", sets: "mercy_at_grudge_mid_accumulation_reveal" },
        { label: "Cancel the cohort entirely.", nextId: "cancel_cohort", sets: "aggression_at_grudge_mid_accumulation_reveal" },
      ],
    },
    bigger_room: {
      id: "bigger_room",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.mid.bigger_room",
      onscreenText: "*[the bigger room has eight chairs. half of them stay empty. half of them fill quietly. the Ghost-Nemesis's hand: 'the empty chairs are the recruits. you are doing my work for me. thank you.']*",
      choices: [
        { label: "Empty the next set.", nextId: "bigger_room_empty" },
      ],
    },
    bigger_room_empty: {
      id: "bigger_room_empty",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.mid.bigger_room_empty",
      onscreenText: "*[you cancel the set mid-bit. the room empties. the Ghost-Nemesis's hand in the dust: 'noted. the cancellation is the closer.']*",
    },
    cancel_cohort: {
      id: "cancel_cohort",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.mid.cancel_cohort",
      onscreenText: "*[the cohort cancels. the chairs do not. they remain. the Ghost-Nemesis's hand on the doors: 'the cohort cancels; the audience does not. you should consider this.']*",
      choices: [
        { label: "Lock the doors.", nextId: "cancel_lock" },
      ],
    },
    cancel_lock: {
      id: "cancel_lock",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.mid.cancel_lock",
      onscreenText: "*[you lock the doors. the lock holds for one cohort. by the next cohort, the lock is replaced with a brass nameplate. the nameplate is blank. the chronicle records: 'the doors locked themselves open.']*",
    },
  },
};

const ACCUMULATION_REVEAL_HIGH: DialogTree = {
  id: "jester_vs_ghost.accumulation_reveal.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.high.opening",
      onscreenText: "*[the chorus is at five. they have a section in the chronicle. you have a footnote. the Ghost-Nemesis's hand in your dressing-room mirror: 'we are quieter than ever. you are louder than ever. the chronicle is loudest of all.']*",
      choices: [
        { label: "Concede the masthead.", nextId: "concede_mast", sets: "mercy_at_grudge_high_accumulation_reveal" },
        { label: "Demand the masthead back.", nextId: "demand_mast", sets: "aggression_at_grudge_high_accumulation_reveal" },
      ],
    },
    concede_mast: {
      id: "concede_mast",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.high.concede_mast",
      onscreenText: "*[you concede. the mirror clears. the Ghost-Nemesis writes nothing for three weeks. the silence is generous. the silence is yours. you keep it.]*",
      choices: [
        { label: "Wear the silence well.", nextId: "concede_mast_wear" },
      ],
    },
    concede_mast_wear: {
      id: "concede_mast_wear",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.high.concede_mast_wear",
      onscreenText: "*[the silence becomes your registered style. the chronicle records your act as 'a Ghost-derived comedy of withholding.' you have inherited their voice without their permission. they would have approved. they do not say.]*",
    },
    demand_mast: {
      id: "demand_mast",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.high.demand_mast",
      onscreenText: "*[you demand. the chorus is silent. the Ghost-Nemesis is silent. the chronicle prints the masthead as 'unsigned.' you have demanded a masthead from a chorus that does not print. the demand is the joke. the chorus does not laugh.]*",
      choices: [
        { label: "Withdraw the demand quietly.", nextId: "demand_mast_withdraw" },
      ],
    },
    demand_mast_withdraw: {
      id: "demand_mast_withdraw",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.accumulation_reveal.high.demand_mast_withdraw",
      onscreenText: "*[you withdraw. the chronicle records the withdrawal as 'the most public retraction in the campaign.' the Ghost-Nemesis writes one line in your dressing room: 'you wrote that yourself. you do not need me to write it for you anymore.']*",
    },
  },
};

/* ─── name_reveal_moment ─── */

const NAME_REVEAL_MOMENT_LOW: DialogTree = {
  id: "jester_vs_ghost.name_reveal_moment.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.low.opening",
      onscreenText: "*[the file you have been chasing for three cohorts is open. their name is on the first page. it is shorter than you thought. it is harder to pronounce than you expected. the file's last line, in their hand: 'now you have it. carry it carefully.']*",
      choices: [
        { label: "Practice saying it.", nextId: "practice", sets: "mercy_at_grudge_low_name_reveal_moment" },
        { label: "Tell the room.", nextId: "tell_room", sets: "aggression_at_grudge_low_name_reveal_moment" },
      ],
    },
    practice: {
      id: "practice",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.low.practice",
      onscreenText: "*[you practice. the name lands wrong the first three times. by the fourth, you say it correctly. the Ghost-Nemesis is somewhere flinching at the fourth attempt. the chronicle records: 'the rival has been pronounced.']*",
      choices: [
        { label: "Say it once aloud, in private.", nextId: "practice_private" },
      ],
    },
    practice_private: {
      id: "practice_private",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.low.practice_private",
      onscreenText: "*[you say it. the room hears nothing. the Ghost-Nemesis hears everything. the chronicle records: 'the private name said aloud is the loudest name in the regime.']*",
    },
    tell_room: {
      id: "tell_room",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.low.tell_room",
      onscreenText: "*[the room learns the name. the room repeats the name. the name is now public. the Ghost-Nemesis's hand on the door of the venue: 'thank you for the publicity. the rate has changed.']*",
      choices: [
        { label: "Walk past the door without reading.", nextId: "tell_room_walk" },
      ],
    },
    tell_room_walk: {
      id: "tell_room_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.low.tell_room_walk",
      onscreenText: "*[you walk past. the door reads itself to the next person who passes. and the next. the name has begun to recite itself. you started the recitation. you will not finish it.]*",
    },
  },
};

const NAME_REVEAL_MOMENT_MID: DialogTree = {
  id: "jester_vs_ghost.name_reveal_moment.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.mid.opening",
      onscreenText: "*[the chronicle has begun listing the Ghost-Nemesis by name in the credits. you are credited as 'their counterpart.' the credit, in their hand: 'i did not request the order. the chronicle made it. i think it is correct.']*",
      choices: [
        { label: "Honor the credit.", nextId: "honor_credit", sets: "mercy_at_grudge_mid_name_reveal_moment" },
        { label: "Reverse the credit.", nextId: "reverse_credit", sets: "aggression_at_grudge_mid_name_reveal_moment" },
      ],
    },
    honor_credit: {
      id: "honor_credit",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.mid.honor_credit",
      onscreenText: "*[the credit stands. the chronicle records the honor as 'the rival who let the chronicler decide the order.' the Ghost-Nemesis's hand: 'i appreciate the dignity. the chronicle does too. so do i, twice.']*",
      choices: [
        { label: "Walk on.", nextId: "honor_credit_walk" },
      ],
    },
    honor_credit_walk: {
      id: "honor_credit_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.mid.honor_credit_walk",
      onscreenText: "*[you walked. the credit is permanent. the chronicle records it as 'the longest credit in the regime.' the Ghost-Nemesis's hand, faintly: 'good night, counterpart.']*",
    },
    reverse_credit: {
      id: "reverse_credit",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.mid.reverse_credit",
      onscreenText: "*[you reverse. the credit reads: 'their counterpart and another.' the Ghost-Nemesis is now 'another.' the chronicle records: 'the rival who unnamed the rival.']*",
      choices: [
        { label: "Restore the credit before morning.", nextId: "reverse_credit_restore" },
      ],
    },
    reverse_credit_restore: {
      id: "reverse_credit_restore",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.mid.reverse_credit_restore",
      onscreenText: "*[you restore. the chronicle records the restoration as 'the rival who repented before publication.' the Ghost-Nemesis's hand: 'i was watching. i appreciated the speed of the repent. it was the only loud thing you did this cohort.']*",
    },
  },
};

const NAME_REVEAL_MOMENT_HIGH: DialogTree = {
  id: "jester_vs_ghost.name_reveal_moment.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.high.opening",
      onscreenText: "*[you say their name aloud. for the first time in the chronicle, the Ghost-Nemesis is in the room when you say it. they do not flinch. they nod. the nod is the loudest movement you have ever earned from them. the chronicle records: 'the name was said correctly.']*",
      choices: [
        { label: "Apologize for the volume.", nextId: "apologize_volume", sets: "mercy_at_grudge_high_name_reveal_moment" },
        { label: "Say it again, louder.", nextId: "louder", sets: "aggression_at_grudge_high_name_reveal_moment" },
      ],
    },
    apologize_volume: {
      id: "apologize_volume",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.high.apologize_volume",
      onscreenText: "*[they shake their head. they take out a folded page. they hand you the page. you do not read it. you put it away. the chronicle records: 'the apology was accepted before it was finished.']*",
      choices: [
        { label: "Read it later, in private.", nextId: "apologize_volume_later" },
      ],
    },
    apologize_volume_later: {
      id: "apologize_volume_later",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.high.apologize_volume_later",
      onscreenText: "*[the page reads: 'thank you for saying my name. thank you for apologizing for the volume. the volume is mine to keep. you have given me my name and the volume and the apology. i am rich. the chronicle is rich. we are done.']*",
    },
    louder: {
      id: "louder",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.high.louder",
      onscreenText: "*[you say it louder. the room turns. the Ghost-Nemesis does not turn. they have stopped responding to the name. they have left the name. the name belongs to you now. the chronicle records: 'the name's bearer became the name's caretaker.']*",
      choices: [
        { label: "Hold the name. Walk on.", nextId: "louder_hold" },
      ],
    },
    louder_hold: {
      id: "louder_hold",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.name_reveal_moment.high.louder_hold",
      onscreenText: "*[you walk. the name walks with you. the Ghost-Nemesis is somewhere new. the chronicle records: 'the rival who gave away their name to be quieter.' you carry the name. you cannot put it down. you would not have wanted to.]*",
    },
  },
};

/* ─── final_encounter ─── */

const FINAL_ENCOUNTER_LOW: DialogTree = {
  id: "jester_vs_ghost.final_encounter.low",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.low.opening",
      onscreenText: "*[Act Seven. The Convergence Seat has fallen. on the empty seat, a final folded page in unfamiliar ink: 'thank you for the cohorts. i kept every set list. the filing cabinet is somewhere in the chronicle. find it if you want. i would not, in your place.']*",
      choices: [
        { label: "Search for the cabinet.", nextId: "search_cab", sets: "mercy_at_grudge_low_final_encounter" },
        { label: "Don't search. End the show.", nextId: "end_show", sets: "aggression_at_grudge_low_final_encounter" },
      ],
    },
    search_cab: {
      id: "search_cab",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.low.search_cab",
      onscreenText: "*[you find the cabinet. it is small. it is meticulously labeled. every set is dated. every set has a one-line review. the reviews are kinder than you remembered. the chronicle records: 'the rival kept everything carefully.']*",
      choices: [
        { label: "Read one review.", nextId: "search_cab_read" },
      ],
    },
    search_cab_read: {
      id: "search_cab_read",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.low.search_cab_read",
      onscreenText: "*[you read a review at random. it reads: 'they did not need me. they performed for the room. the room laughed. i wrote down the laugh. the laugh stays in the cabinet. so do i. i was happy.']*",
    },
    end_show: {
      id: "end_show",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.low.end_show",
      onscreenText: "*[the show ends. the cabinet stays unread. the Ghost-Nemesis is, for the first time, lighter for the not-reading. the chronicle records: 'the cabinet went home with the rival.']*",
      choices: [
        { label: "Walk on without looking.", nextId: "end_show_walk" },
      ],
    },
    end_show_walk: {
      id: "end_show_walk",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.low.end_show_walk",
      onscreenText: "*[you walked. the cabinet remains. somewhere, the chronicle will find it. someone will read it. the Ghost-Nemesis will be remembered by a stranger. that, the Politician would have said, is the cleanest legacy.]*",
    },
  },
};

const FINAL_ENCOUNTER_MID: DialogTree = {
  id: "jester_vs_ghost.final_encounter.mid",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.mid.opening",
      onscreenText: "*[End of the arc. The chronicle records the final page as the back of a set list — yours, dated tonight, with the Ghost-Nemesis's hand at the bottom: 'i am the final review. the review is one word. you do not get the word until you stop performing.']*",
      choices: [
        { label: "Stop performing now.", nextId: "stop_now", sets: "mercy_at_grudge_mid_final_encounter" },
        { label: "Demand the word first.", nextId: "demand_first", sets: "aggression_at_grudge_mid_final_encounter" },
      ],
    },
    stop_now: {
      id: "stop_now",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.mid.stop_now",
      onscreenText: "*[the silence holds. the set list flips to its back. the word is written in their cleanest hand: 'sufficient.' the chronicle records: 'the rival was given the word at the end.' you walk out with the word.]*",
      choices: [
        { label: "Carry the word home.", nextId: "stop_now_carry" },
      ],
    },
    stop_now_carry: {
      id: "stop_now_carry",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.mid.stop_now_carry",
      onscreenText: "*[you carry it home. the chronicle records the carrying as 'the longest closing line in the regime.' the Ghost-Nemesis is somewhere quieter than the chronicle. you have left them with the silence. they have left you with the word.]*",
    },
    demand_first: {
      id: "demand_first",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.mid.demand_first",
      onscreenText: "*[the demand hangs. the set list remains unflipped. the Ghost-Nemesis's last hand: 'i can outwait you. i have been outwaiting you for seven cohorts. the chronicle is on my side.']*",
      choices: [
        { label: "Outwait them, this once.", nextId: "demand_first_outwait" },
      ],
    },
    demand_first_outwait: {
      id: "demand_first_outwait",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.mid.demand_first_outwait",
      onscreenText: "*[you outwait them. for the first time. the set list flips on its own. the word, in their cleanest hand: 'persistent.' the chronicle records the outwait as 'the regime's only known reversal.']*",
    },
  },
};

const FINAL_ENCOUNTER_HIGH: DialogTree = {
  id: "jester_vs_ghost.final_encounter.high",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.high.opening",
      onscreenText: "*[the chronicle is folding shut. the Ghost-Nemesis is in the room. for the first time, they are looking at you, not at a notebook. their last hand, written on the air between you: 'i am sorry i never said it aloud. i am saying it now. the silence was the saying.']*",
      choices: [
        { label: "Say the same thing back.", nextId: "say_back", sets: "mercy_at_grudge_high_final_encounter" },
        { label: "Refuse the symmetry.", nextId: "refuse_sym", sets: "aggression_at_grudge_high_final_encounter" },
      ],
    },
    say_back: {
      id: "say_back",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.high.say_back",
      onscreenText: "*[you say nothing. the silence holds. the chronicle records the silence as 'the only mutual sentence in the regime.' the Ghost-Nemesis nods. you nod. the chronicle closes around the two nods. the campaign is over.]*",
      choices: [
        { label: "Hold the nod.", nextId: "say_back_hold" },
      ],
    },
    say_back_hold: {
      id: "say_back_hold",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.high.say_back_hold",
      onscreenText: "*[the nod holds. the chronicle records: 'the rivals closed the chronicle by agreeing not to write the last line.' the last line is the silence. the silence is the last line. *[stage-direction in their hand: 'the bow was deeper than any bow they took for an audience. i bowed too. the chronicle records both bows.']*]*",
    },
    refuse_sym: {
      id: "refuse_sym",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.high.refuse_sym",
      onscreenText: "*[you speak. one line. 'i am still louder than you.' the Ghost-Nemesis writes one final line in the air between you: 'that is the only joke i ever found funny. thank you.']*",
      choices: [
        { label: "Walk away laughing.", nextId: "refuse_sym_laugh" },
      ],
    },
    refuse_sym_laugh: {
      id: "refuse_sym_laugh",
      speaker: "nemesis",
      voLineId: "nemesis.jester_vs_ghost.final_encounter.high.refuse_sym_laugh",
      onscreenText: "*[you laugh. for the first time in the chronicle, your laugh is heard. the Ghost-Nemesis is laughing too. the chronicle records both laughs as 'the regime's first and last symmetry.' the campaign closes on the laugh. *[the writing on the air dries, settles, becomes the chronicle's final page.]*]*",
    },
  },
};

/* ─── The pair-bank export ─── */

export const jesterVsGhostPairBank: NemesisPairBank = {
  pairId: "jester_vs_ghost",
  playerArchetype: "jester",
  nemesisArchetype: "ghost",
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
