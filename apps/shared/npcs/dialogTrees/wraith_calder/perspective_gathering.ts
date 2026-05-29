// apps/shared/npcs/dialogTrees/wraith_calder/perspective_gathering.ts
//
// Wraith Calder / the Hierophant — perspective gathering + challenge
// entry tree. Second NPC content drop for the dialog → duel → harvest
// loop (after the_degen).
//
// Voice register: pre-rite Wraith (cell-veteran tactical mentor)
// shading toward the Hierophant when the deeper aspects unlock. The
// bible §1.1 soul-tells govern every line:
//   - Patience earned, not granted
//   - Counting as confession (a number is always a confession)
//   - The system is inside us now (architectural corruption)
//
// Cross-NPC echo: when the player has defeated the_degen, the root
// node has an extra conditional acknowledgement gated on the
// public flag `player_carries_the_degen_memory`. Wraith reads it
// the way the Hierophant reads any new debt — without flinching.
//
// VO line ids follow the convention wraith.perspective.<aspect>.
// MP3s land via `pnpm vo:npc-first-meet --only=wraith_calder`.

import type { NpcDialogTree } from "../types";

export const WRAITH_CALDER_PERSPECTIVE_GATHERING: NpcDialogTree = {
  id: "wraith-calder-perspective-gathering",
  npcKey: "wraith_calder",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "wraith_calder",
      voLineId: "wraith.perspective.root",
      onscreenText:
        "You came to the chamber for a reason. The chair behind me is the chair I sit in. The lectern in front of me is the lectern I write at. Neither of them is going anywhere. Ask what you came to ask. If the question is small I will answer it small. If the question is large I will answer it the same way.",
      choices: [
        {
          label: "What did seven deaths teach you?",
          nextId: "aspect_patience_earned",
          sets: "wraith_calder:patience_earned",
          trustDelta: 2,
        },
        {
          label: "Why does the count always matter?",
          nextId: "aspect_counting_as_confession",
          sets: "wraith_calder:counting_as_confession",
          trustDelta: 2,
          publicFlag: "wraith_revealed_counting_to_player",
        },
        {
          label: "Where does the corruption actually live?",
          nextId: "aspect_system_is_inside_us",
          sets: "wraith_calder:system_is_inside_us",
          trustDelta: 3,
          publicFlag: "wraith_revealed_architectural_corruption_to_player",
        },
        // Cross-NPC echo — visible only when the player has the
        // Degen's memory imprinted via npc_public_flags.
        {
          label: "I carry the Degen's memory. You'll want to see it.",
          nextId: "echo_degen_memory",
          requires: "player_carries_the_degen_memory",
          trustDelta: 1,
        },
        {
          label: "I came to challenge you.",
          nextId: "challenge_offer",
        },
      ],
    },

    /* ─── Aspect 1: patience earned (motive — what cost it) ─── */
    aspect_patience_earned: {
      id: "aspect_patience_earned",
      npcKey: "wraith_calder",
      voLineId: "wraith.perspective.patience_earned",
      onscreenText:
        "Patience is the wrong word in the mouth of anyone who hasn't earned it. The first three deaths I argued with. The fourth I bargained with. The fifth I refused. The sixth I performed. The seventh I sat down inside. That is when the patience started. Not because I learned to wait. Because the body learned that argument, bargain, refusal, performance — all of them are the same ration of time. So I stopped spending the ration. That is the patience. It cost me six bodies. The seventh is the one that kept it.",
      autoNext: "after_aspect",
    },

    /* ─── Aspect 2: counting as confession (wound — the unwillingness
         to round) ─── */
    aspect_counting_as_confession: {
      id: "aspect_counting_as_confession",
      npcKey: "wraith_calder",
      voLineId: "wraith.perspective.counting_as_confession",
      onscreenText:
        "Because a round number is a kind of mercy I have not earned for the people behind it. Three hundred and forty-seven thousand. Not three hundred and fifty. Not three hundred and forty-six. Three hundred and forty-seven thousand. Each name in that count was a person who had a body and a Tuesday and a way of sitting that the room remembers. If I round, the people I round off become a kind of arithmetic. That is what the Shadow Tongue would do. I am not in the chamber to do what the Shadow Tongue would do. I am in the chamber to count.",
      autoNext: "after_aspect",
    },

    /* ─── Aspect 3: system is inside us (contradiction — fighting
         from inside the cage) ─── */
    aspect_system_is_inside_us: {
      id: "aspect_system_is_inside_us",
      npcKey: "wraith_calder",
      voLineId: "wraith.perspective.system_is_inside_us",
      onscreenText:
        "Inside us. Not at the gate, not in the next room, not in the chamber down the hall — inside us. The Shadow Tongue is in the way I just constructed that sentence. The Architect is in the rhythm I used to construct it. The Hierarchy is in the patience I used to construct it. The Insurgency is in the refusal underneath it. If you go looking for the corruption at the gate you will find a gate. The corruption is the way you arrived at the gate. The work — the only work — is doing it from inside, every day, without a deadline. That is also why I count. The count is the work I do from inside.",
      autoNext: "after_aspect",
    },

    /* ─── Cross-NPC echo — the Degen's memory ─── */
    echo_degen_memory: {
      id: "echo_degen_memory",
      npcKey: "wraith_calder",
      voLineId: "wraith.perspective.echo_degen_memory",
      onscreenText:
        "I felt it the moment you walked in. The arithmetic on you has a different cadence than the arithmetic on you when you arrived the first time. The Degen is the part of the chronicle that gives a small ration back to the people who walked up to the table. He is not careless about which rations he gives. If he gave you one, the chronicle has marked you for a reason. I will not name the reason. The reason will surface in the chamber it surfaces in. Sit. Or stand. Either way I am listening.",
      autoNext: "after_aspect",
    },

    /* ─── Re-entry after any aspect ─── */
    after_aspect: {
      id: "after_aspect",
      npcKey: "wraith_calder",
      voLineId: "wraith.perspective.after_aspect",
      onscreenText:
        "Another question. Or the lectern. Or the chair. The chamber accepts all three. Take the time you need.",
      choices: [
        {
          label: "What did seven deaths teach you?",
          nextId: "aspect_patience_earned",
          requires: "wraith_perspective_re_entry_ok",
          sets: "wraith_calder:patience_earned",
          trustDelta: 1,
        },
        {
          label: "Why does the count always matter?",
          nextId: "aspect_counting_as_confession",
          requires: "wraith_perspective_re_entry_ok",
          sets: "wraith_calder:counting_as_confession",
          trustDelta: 1,
        },
        {
          label: "Where does the corruption actually live?",
          nextId: "aspect_system_is_inside_us",
          requires: "wraith_perspective_re_entry_ok",
          sets: "wraith_calder:system_is_inside_us",
          trustDelta: 2,
        },
        {
          label: "I'll challenge you.",
          nextId: "challenge_offer",
        },
        {
          label: "I'll come back.",
          nextId: "terminal_come_back",
        },
      ],
    },

    /* ─── Challenge offer — Wraith does not perform reluctance ─── */
    challenge_offer: {
      id: "challenge_offer",
      npcKey: "wraith_calder",
      voLineId: "wraith.perspective.challenge_offer",
      onscreenText:
        "A duel. Then yes. The chamber is the chamber whether we duel in it or write in it. I will not perform reluctance. I will not perform mercy. I will play the way the body that did the dying played — which is to say, accurately. You lose, the Hierophant takes one card from your tray. You win, the tray opens by however many doors you opened in this conversation. Sit. Or stand. Either way, deal.",
      choices: [
        {
          label: "Deal.",
          nextId: "challenge_accepted",
          challenge: { npcKey: "wraith_calder" },
          publicFlag: "wraith_challenged_by_player",
        },
        {
          label: "Not today.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_accepted: {
      id: "challenge_accepted",
      npcKey: "wraith_calder",
      voLineId: "wraith.perspective.challenge_accepted",
      onscreenText:
        "Then we sit. The body that did the dying knows how to deal.",
    },

    terminal_come_back: {
      id: "terminal_come_back",
      npcKey: "wraith_calder",
      voLineId: "wraith.perspective.terminal_come_back",
      onscreenText:
        "The chamber is not closing. The lectern is not closing. The chair is not closing. Come back when the question has finished forming. It will. It always does.",
    },
  },
};
