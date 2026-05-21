// apps/shared/npcs/dialogTrees/akai_shi/loyalty_intro.ts
//
// Akai Shi → Loyalty mission opening — Section D4 ("The Red Death
// Pattern"). Fires at bond threshold; she has been waiting at the
// shrine with the Lair's journal.

import type { NpcDialogTree } from "../types";

export const AKAI_SHI_LOYALTY_INTRO: NpcDialogTree = {
  id: "akai-shi-loyalty-intro",
  npcKey: "akai_shi",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "akai_shi",
      voLineId: "akai.loyalty_intro.root",
      onscreenText:
        "[The case is still open. The journal — a Lair-bound notebook in two halves, one of which is hers — is on the floor between you. The pattern is hand-annotated in the margin.] I want to read what the Lair learned. It learned things from me I did not know I was teaching. I would like a witness. I would like it to be you.",
      requiresRevealStage: "post_reanimation",
      choices: [
        {
          label: "Read it with me.",
          nextId: "accept_loyalty",
          sets: "loyalty_akai_stage_1_armed",
          trustDelta: 5,
          axisDelta: [{ axis: "mercy", delta: 1 }],
          publicFlag: "akai_loyalty_opened",
        },
        {
          label: "What did the Lair learn that you didn't?",
          nextId: "press_on_pattern",
          sets: "akai_loyalty_pressed_pattern",
          trustDelta: 3,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "[Set the journal aside. Sit beside her instead.]",
          nextId: "defer_to_presence",
          sets: "akai_loyalty_offered_presence",
          trustDelta: 2,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
        },
      ],
    },

    accept_loyalty: {
      id: "accept_loyalty",
      npcKey: "akai_shi",
      voLineId: "akai.loyalty_intro.accept_loyalty",
      onscreenText:
        "[She slides the journal toward you. Both halves. The margin notes are hers; the body text is the Lair's. The annotations agree on more than the body text wants them to.] Then we begin. The pattern lives in the margin. The body is the Lair's pretence; the margin is the truth. I am going to read the margin aloud. You may interrupt at any point. The interruption is the calibration.",
      autoNext: "terminal",
      requiresRevealStage: "post_reanimation",
    },

    press_on_pattern: {
      id: "press_on_pattern",
      npcKey: "akai_shi",
      voLineId: "akai.loyalty_intro.press_on_pattern",
      onscreenText:
        "It learned that the cure is generous. The Lair authored a curtailment of the cure — the curtailment specifies a single senior carrier and excludes the other three. The pattern as authored is more permissive; the curtailment is the Lair's choice, not the pattern's. I want to read past the curtailment. I want to know what the pattern says when it is not being curtailed.",
      autoNext: "post_press_offer",
      requiresRevealStage: "post_reanimation",
    },

    post_press_offer: {
      id: "post_press_offer",
      npcKey: "akai_shi",
      voLineId: "akai.loyalty_intro.post_press_offer",
      onscreenText:
        "[She waits. The static remains at the floor.] Will you read it with me.",
      choices: [
        {
          label: "Yes.",
          nextId: "accept_loyalty",
          trustDelta: 4,
          axisDelta: [{ axis: "mercy", delta: 1 }],
          publicFlag: "akai_loyalty_opened",
        },
        {
          label: "Not tonight.",
          nextId: "defer",
          trustDelta: 0,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
        },
      ],
      requiresRevealStage: "post_reanimation",
    },

    defer: {
      id: "defer",
      npcKey: "akai_shi",
      voLineId: "akai.loyalty_intro.defer",
      onscreenText:
        "[She closes the journal but does not put it away. She places it on the shrine's reading-stand within arm's reach.] The journal will remain on the stand. The shrine does not move things on me without my consent. The next time you visit, the journal will be where it is now. If you come back ready, we read.",
      autoNext: "terminal",
      requiresRevealStage: "post_reanimation",
    },

    defer_to_presence: {
      id: "defer_to_presence",
      npcKey: "akai_shi",
      voLineId: "akai.loyalty_intro.defer_to_presence",
      onscreenText:
        "[A small pause. She accepts the offer without quite acknowledging it.] The cushion does not require a reason. Sit. We can read another night. The pattern is generous. The pattern can wait. I — would not have asked for this if you had not offered. Thank you.",
      autoNext: "terminal",
      requiresRevealStage: "post_reanimation",
    },

    terminal: {
      id: "terminal",
      npcKey: "akai_shi",
      onscreenText: "",
      expressionChannel: "posture",
    },
  },
};
