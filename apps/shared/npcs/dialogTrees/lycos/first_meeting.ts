// apps/shared/npcs/dialogTrees/lycos/first_meeting.ts
//
// Lycos / The Wolf → Containment-atrium first-visit dialog tree —
// Section D5. Fires once after lycos_recruited (either good or bad
// arc-end). The bench by the snow-globe alcove is the canonical
// scene; the Antiquarian's ledger sits open at the pause-line.

import type { NpcDialogTree } from "../types";

export const LYCOS_FIRST_MEETING: NpcDialogTree = {
  id: "lycos-first-meeting",
  npcKey: "lycos",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "lycos",
      voLineId: "lycos.first_meeting.root",
      onscreenText:
        "[Lycos sits on the bench. Both feet flat. Hands folded loosely. He is not waiting; he is on the other side of waiting. The snow-globe alcove is empty. The Antiquarian's ledger is open on the shelf at his shoulder — the pause-line is visible, unmarked, neither closed nor continued.] You came. The contract is done. I have not had nothing to do in — I cannot tell you in what units. Sit.",
      requiresRevealStage: "post_contract",
      choices: [
        {
          label: "[Sit. Don't speak. Let him decide where this goes.]",
          nextId: "sit_silent",
          sets: "lycos_first_meeting_sat_silent",
          trustDelta: 4,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
        },
        {
          label: "The pause-line is unmarked. Does that mean something?",
          nextId: "ask_pause_line",
          sets: "lycos_first_meeting_asked_pause",
          trustDelta: 3,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "You extended mercy three times. Why those three?",
          nextId: "ask_about_mercy",
          sets: "lycos_first_meeting_asked_mercy",
          trustDelta: 3,
          axisDelta: [{ axis: "mercy", delta: 1 }],
        },
        {
          label: "You're still the Wolf. I'd like to be sure of that.",
          nextId: "test_the_wolf",
          sets: "lycos_first_meeting_tested",
          trustDelta: -3,
          axisDelta: [{ axis: "aggression", delta: 1 }],
          publicFlag: "lycos_first_meeting_tested_identity",
        },
      ],
    },

    sit_silent: {
      id: "sit_silent",
      npcKey: "lycos",
      voLineId: "lycos.first_meeting.sit_silent",
      onscreenText:
        "[He breathes out — a long, deliberate exhalation that has nothing to do with tension and everything to do with permission. The bench accepts your weight. The room is quieter than the Antiquarian's chamber, quieter than the snow-globe before it was emptied, quieter than the Crucible's threshold at the moment the contract opened.] Thank you. The silence is — useful. I would like a few more minutes of it before either of us speaks. You are welcome to stay for the silence.",
      autoNext: "terminal",
      requiresRevealStage: "post_contract",
    },

    ask_pause_line: {
      id: "ask_pause_line",
      npcKey: "lycos",
      voLineId: "lycos.first_meeting.ask_pause_line",
      onscreenText:
        "[He glances at the ledger over his shoulder. The pause-line is exactly as he left it.] The Antiquarian draws the pause-line when the column cannot be closed and refuses to be sealed. It is canonically the kindest mark in his hand. I died on contract; the pause-line went down before the closing entry. I came back; the pause-line did not lift, because the contract continued. The contract closed; the pause-line is still there. I think he leaves it there for me. I think he expects me to read it sometimes.",
      autoNext: "terminal",
      requiresRevealStage: "post_contract",
    },

    ask_about_mercy: {
      id: "ask_about_mercy",
      npcKey: "lycos",
      voLineId: "lycos.first_meeting.ask_about_mercy",
      onscreenText:
        "Three. The first one because the contract had not authorised the kill — the kill would have been mine, not the Antiquarian's, and I am not in that business any longer. The second one because the target asked me by my pre-corruption name; the name has not been spoken aloud since the Crucible took me, and the pronunciation was correct. The third one because the moon was full, and the target was old, and I was tired, and I had run out of reasons to refuse. None of those reasons would have held the next time. I am — not certain mercy is something I will extend again. I would like to talk about that with someone who will tell me when I am wrong.",
      autoNext: "terminal",
      requiresRevealStage: "post_contract",
    },

    test_the_wolf: {
      id: "test_the_wolf",
      npcKey: "lycos",
      voLineId: "lycos.first_meeting.test_the_wolf",
      onscreenText:
        "[He turns to face you for the first time. The look is not aggression; the look is correction.] I am still the Wolf. I do not need you to be sure of that. I needed you to be sure of it during the contract; the contract is closed. You can leave the room without testing the latch on the way out. The Wolf does not require a witness in the doorway. The Wolf is at peace with you whether or not you stay.",
      autoNext: "terminal",
      requiresRevealStage: "post_contract",
    },

    terminal: {
      id: "terminal",
      npcKey: "lycos",
      onscreenText: "",
      expressionChannel: "posture",
    },
  },
};
