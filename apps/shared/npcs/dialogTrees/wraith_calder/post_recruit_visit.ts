// apps/shared/npcs/dialogTrees/wraith_calder/post_recruit_visit.ts
//
// Wraith Calder → Ledger-vault first-visit dialog tree — Section D5.
// Fires the first time the player enters the ledger-vault after
// completePathA writes wraith_calder_recruited. Authored branches:
//
//   - witness_the_ledger → he opens the Syndicate ledger you helped him
//                          take back. Calibration / mercy register.
//   - ask_about_the_song → his bunk-room half-rewritten song. Vulnerability.
//   - ask_about_dying    → he answers directly. Trust gate to Confidant.
//   - decline_to_visit   → withdrawal. -3 trust, sets withdrawal flag.

import type { NpcDialogTree } from "../types";

export const WRAITH_CALDER_POST_RECRUIT_VISIT: NpcDialogTree = {
  id: "wraith-calder-post-recruit-visit",
  npcKey: "wraith_calder",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "wraith_calder",
      voLineId: "wraith.post_recruit.root",
      onscreenText:
        "[The brass desk catches the light differently here than in the Hierophant's chamber. Wraith is reading, not writing. He sets the ledger down when you come in. He has been waiting.] You came. I had not assumed you would, on the first day. Sit. The room is still calibrating to having me back inside it.",
      requiresRevealStage: "post_arena",
      choices: [
        {
          label: "[Pick up the ledger he set down.]",
          nextId: "witness_the_ledger",
          sets: "wraith_post_recruit_witnessed_ledger",
          trustDelta: 4,
          axisDelta: [{ axis: "mercy", delta: 1 }],
        },
        {
          label: "There's a song half-rewritten on your bunk-room desk.",
          nextId: "ask_about_the_song",
          sets: "wraith_post_recruit_asked_song",
          trustDelta: 3,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
        },
        {
          label: "What was it like — dying?",
          nextId: "ask_about_dying",
          sets: "wraith_post_recruit_asked_dying",
          trustDelta: 2,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "I shouldn't have come. I'll see you tomorrow.",
          nextId: "decline_to_visit",
          sets: "wraith_post_recruit_withdrew",
          trustDelta: -3,
          axisDelta: [{ axis: "aggression", delta: 1 }],
        },
      ],
    },

    witness_the_ledger: {
      id: "witness_the_ledger",
      npcKey: "wraith_calder",
      voLineId: "wraith.post_recruit.witness_the_ledger",
      onscreenText:
        "[He watches you pick it up. He does not flinch.] That ledger has been in the Syndicate's safe since the year I died. The Antiquarian's resurrection-ticket included a clause for retrieval; he ran the retrieval the same morning he ran me. I have not opened it. I have been waiting to open it with a witness who is not the Syndicate. You qualify.",
      autoNext: "terminal",
      requiresRevealStage: "post_arena",
    },

    ask_about_the_song: {
      id: "ask_about_the_song",
      npcKey: "wraith_calder",
      voLineId: "wraith.post_recruit.ask_about_the_song",
      onscreenText:
        "[Pause. The pen-hand twitches; it does not lift.] I am writing the verse I died before finishing. The Syndicate authored a substitute verse and shipped it under my name; the substitute is publicly canonical. I am rewriting the original. You can read it when it is done. You will be the second person to. I am the first.",
      autoNext: "terminal",
      requiresRevealStage: "post_arena",
    },

    ask_about_dying: {
      id: "ask_about_dying",
      npcKey: "wraith_calder",
      voLineId: "wraith.post_recruit.ask_about_dying",
      onscreenText:
        "Dying was bookkeeping. The Syndicate had run the columns; the columns balanced; the closing entry was authored a week before the event. The event itself was unremarkable. What was remarkable was the silence after. The silence was not a balance. The silence was the column the Syndicate forgot to close. I lived inside that column for fourteen years. The Antiquarian closed it.",
      autoNext: "terminal",
      requiresRevealStage: "post_arena",
    },

    decline_to_visit: {
      id: "decline_to_visit",
      npcKey: "wraith_calder",
      voLineId: "wraith.post_recruit.decline_to_visit",
      onscreenText:
        "[He does not protest. He picks the ledger up again.] Tomorrow, then. The room will still be calibrating. I will still be here. The calibration is not on a schedule.",
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
