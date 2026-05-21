// apps/shared/npcs/dialogTrees/wraith_calder/loyalty_intro.ts
//
// Wraith Calder → Loyalty mission opening — Section D4 ("The Seventh
// Sanctuary"). Fires when player visits the ledger-vault after
// loyalty_locke_stage_3-style bond threshold reached.

import type { NpcDialogTree } from "../types";

export const WRAITH_CALDER_LOYALTY_INTRO: NpcDialogTree = {
  id: "wraith-calder-loyalty-intro",
  npcKey: "wraith_calder",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "wraith_calder",
      voLineId: "wraith.loyalty_intro.root",
      onscreenText:
        "[The ledger is open this time. He turns it toward you. The page is the Syndicate's canonical list of sanctuaries: six, in order, each with a balance and a closing date. The margin between entries six and the back cover is just wide enough for a column nobody has drawn.] Six sanctuaries. I am told there are seven. I would like to know which one was added after I died. I am asking you, not the Antiquarian, because the Antiquarian's pen would close the column before I had read it.",
      requiresRevealStage: "post_arena",
      choices: [
        {
          label: "I'll ride out with you.",
          nextId: "accept_loyalty",
          sets: "loyalty_wraith_stage_1_armed",
          trustDelta: 5,
          axisDelta: [{ axis: "mercy", delta: 1 }],
          publicFlag: "wraith_loyalty_opened",
        },
        {
          label: "Tell me what you think you'll find.",
          nextId: "press_for_premise",
          sets: "wraith_loyalty_pressed_premise",
          trustDelta: 2,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "[Slide the ledger back. Take the Antiquarian's seat.]",
          nextId: "summon_the_antiquarian",
          sets: "wraith_loyalty_deferred_antiquarian",
          trustDelta: -2,
          axisDelta: [{ axis: "aggression", delta: 1 }],
        },
      ],
    },

    accept_loyalty: {
      id: "accept_loyalty",
      npcKey: "wraith_calder",
      voLineId: "wraith.loyalty_intro.accept_loyalty",
      onscreenText:
        "[He closes the ledger. He has been ready since the Antiquarian wrote his name on the ticket. He needed someone to ride out with him.] Thank you. Then we leave at dawn — Syndicate time, not ark time. The Syndicate keeps to a slower clock; we arrive when the auditor expects us, which is canonically twenty minutes after the auditor thinks we are still preparing.",
      autoNext: "terminal",
      requiresRevealStage: "post_arena",
    },

    press_for_premise: {
      id: "press_for_premise",
      npcKey: "wraith_calder",
      voLineId: "wraith.loyalty_intro.press_for_premise",
      onscreenText:
        "I think we will find someone wearing my face who has signed three hundred contracts in my hand. The Syndicate does not retire functions; it replaces incumbents. The replacement and I will need to have a conversation about who owns the plates. I am asking you to be in the room because I have not been in a room with my own replacement before. Neither has anyone else, that I know of.",
      autoNext: "post_premise_offer",
      requiresRevealStage: "post_arena",
    },

    post_premise_offer: {
      id: "post_premise_offer",
      npcKey: "wraith_calder",
      voLineId: "wraith.loyalty_intro.post_premise_offer",
      onscreenText:
        "[He waits. The pen is closed. The question is open.] Will you come.",
      choices: [
        {
          label: "Yes.",
          nextId: "accept_loyalty",
          trustDelta: 4,
          axisDelta: [{ axis: "mercy", delta: 1 }],
          publicFlag: "wraith_loyalty_opened",
        },
        {
          label: "Not yet.",
          nextId: "defer",
          trustDelta: 0,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
        },
      ],
      requiresRevealStage: "post_arena",
    },

    defer: {
      id: "defer",
      npcKey: "wraith_calder",
      voLineId: "wraith.loyalty_intro.defer",
      onscreenText:
        "[He nods. He returns the ledger to its corner of the brass desk. He does not press.] The page will remain open. The Syndicate will not move the seventh sanctuary tonight. They will not move it next week either. They have not moved it in fourteen years. I have time.",
      autoNext: "terminal",
      requiresRevealStage: "post_arena",
    },

    summon_the_antiquarian: {
      id: "summon_the_antiquarian",
      npcKey: "wraith_calder",
      voLineId: "wraith.loyalty_intro.summon_the_antiquarian",
      onscreenText:
        "[He looks at the seat you slid the ledger toward. The look is not gratitude; the look is correction, polite and absolute.] The Antiquarian's pen runs faster than the auditor can dictate. If you bring him in, he will close the column before I have read it; the closing will be canonical and the reading will not. I would prefer the reading. I would prefer it with you.",
      autoNext: "terminal",
      requiresRevealStage: "post_arena",
    },

    terminal: {
      id: "terminal",
      npcKey: "wraith_calder",
      onscreenText: "",
      expressionChannel: "posture",
    },
  },
};
