// apps/shared/npcs/dialogTrees/the_degen/perspective_gathering.ts
//
// The Degen — perspective gathering + challenge entry tree.
//
// The pilot wiring for the NPC duel loop. Players who have completed
// the_degen/first_meeting can re-enter this tree from the Casino
// surface to:
//
//   1. Learn perspective aspects (motive / wound / contradiction).
//      Each set a narrative flag of the form `the_degen:<aspect>`
//      that the reward dispatcher reads at duel-end.
//
//   2. Issue a duel challenge via NpcDialogChoice.challenge. The
//      challenge is gated by either trust accumulated through the
//      perspective beats OR by reaching the third aspect — either
//      path unlocks the option but the reward tier scales with how
//      many aspects the player learned before challenging.
//
// Voice protections (per the_degen.md §1.4):
//   - NO "fair", "sorry", "forever", religious vocabulary.
//   - "Mostly takes" leitmotif is reserved (deploy-once); use it on
//     the "lonely_void" aspect, where it canonically lands.
//
// VO line ids follow the convention degen.perspective.<aspect>.
// The audit script (apps/scripts/vo-audit.mjs) catches missing lines
// the next time the_degen voice bank ships.

import type { NpcDialogTree } from "../types";

export const THE_DEGEN_PERSPECTIVE_GATHERING: NpcDialogTree = {
  id: "degen-perspective-gathering",
  npcKey: "the_degen",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_degen",
      voLineId: "degen.perspective.root",
      onscreenText:
        "You came back. Good. The arithmetic remembered you. Sit down. You want the table, or you want the booth tonight, friend? Or — " +
        "you want the thing nobody at the booth asks for. The reading. The actual reading. I do those too. Pick.",
      choices: [
        {
          label: "Why can't you sit out a hand?",
          nextId: "aspect_risk_addiction",
          sets: "the_degen:risk_addiction",
          trustDelta: 2,
        },
        {
          label: "What are you actually betting against?",
          nextId: "aspect_lonely_void",
          sets: "the_degen:lonely_void",
          trustDelta: 2,
          publicFlag: "degen_revealed_lonely_void_to_player",
        },
        {
          label: "What's the wager the ledger never closes?",
          nextId: "aspect_bet_against_god",
          sets: "the_degen:bet_against_god",
          trustDelta: 3,
          publicFlag: "degen_revealed_bet_against_god_to_player",
        },
        {
          label: "Deal. I came to play, not to ask.",
          nextId: "challenge_offer",
        },
      ],
    },

    /* ─── Aspect 1: risk addiction (motive) ───
       The "why can't you sit out a hand" beat. The Degen explains
       the compulsive surface — the answer he gives at parties. */
    aspect_risk_addiction: {
      id: "aspect_risk_addiction",
      npcKey: "the_degen",
      voLineId: "degen.perspective.risk_addiction",
      onscreenText:
        "Sitting out is the only canonical-losing move at the Casino, friend. The table moves whether you're at it or not. The arithmetic " +
        "advances. The hands deal. If you're not in, you're in arrears — your seat is canonical-paying interest on the chair. So I sit. " +
        "I sit because the math sits. The compulsion isn't the cards. It's the chair. Tell me you've never canonical-felt that.",
      autoNext: "after_aspect",
    },

    /* ─── Aspect 2: lonely void (wound) ───
       The "what are you actually betting against" beat. This is the
       canonical "mostly takes" deployment — once per playthrough. */
    aspect_lonely_void: {
      id: "aspect_lonely_void",
      npcKey: "the_degen",
      voLineId: "degen.perspective.lonely_void",
      onscreenText:
        "Against the thing that mostly takes, friend. The Casino is the part of the universe that gives a little back — not much, but enough " +
        "that the canonical-give registers against the canonical-take. Most rooms only take. The Casino takes too, but it takes with a " +
        "receipt. A receipt is a kind of company. I am, at the table, very canonical-not-alone. That is the wager.",
      autoNext: "after_aspect",
    },

    /* ─── Aspect 3: bet against god (contradiction) ───
       The deepest beat — the Degen confirms he is canonically aware
       that the house IS him AND he is canonically betting against
       what the house is built on. The bible §3 contradiction. */
    aspect_bet_against_god: {
      id: "aspect_bet_against_god",
      npcKey: "the_degen",
      voLineId: "degen.perspective.bet_against_god",
      onscreenText:
        "The wager the ledger never closes, friend, is the canonical-bet that the Architect was canonical-wrong about the cadence. The " +
        "design says you cannot canonical-beat the math. The Casino is built on that. I am built on that. And I am canonically " +
        "wagering — every hand, every chair, every receipt — that one night the canonical-design canonical-breaks and the arithmetic " +
        "canonical-blinks. I am the house. The house bets against itself. That's the ledger that never canonical-closes.",
      autoNext: "after_aspect",
    },

    /* ─── Re-entry after any aspect beat ─── */
    after_aspect: {
      id: "after_aspect",
      npcKey: "the_degen",
      voLineId: "degen.perspective.after_aspect",
      onscreenText:
        "There are other questions, friend. There usually are. Ask another. Or pull up to the table and let the arithmetic do the rest of " +
        "the answering. Your call.",
      choices: [
        {
          label: "Why can't you sit out a hand?",
          nextId: "aspect_risk_addiction",
          requires: "degen_perspective_re_entry_ok",
          sets: "the_degen:risk_addiction",
          trustDelta: 1,
        },
        {
          label: "What are you actually betting against?",
          nextId: "aspect_lonely_void",
          requires: "degen_perspective_re_entry_ok",
          sets: "the_degen:lonely_void",
          trustDelta: 1,
        },
        {
          label: "What's the wager the ledger never closes?",
          nextId: "aspect_bet_against_god",
          requires: "degen_perspective_re_entry_ok",
          sets: "the_degen:bet_against_god",
          trustDelta: 2,
        },
        {
          label: "Deal. I'll play you.",
          nextId: "challenge_offer",
        },
        {
          label: "I'll come back.",
          nextId: "terminal_come_back",
        },
      ],
    },

    /* ─── Challenge offer beat ───
       Pre-duel gating prompt. Surfaces the Degen's awareness of what
       the player has revealed (the "I sense you carry X" line from
       the DBZ/Pokémon layer); confirms the challenge. */
    challenge_offer: {
      id: "challenge_offer",
      npcKey: "the_degen",
      voLineId: "degen.perspective.challenge_offer",
      onscreenText:
        "A real game then. Not the booth, not the bar, not the back-room — the canonical-table. I deal, you canonical-play, the arithmetic " +
        "settles. You lose, the Casino takes one canonical-card from your collection — a memory I have been wanting. You win, the canonical-tray " +
        "is yours. The deeper you canonical-understood what's at the table, the more the canonical-tray weighs. Sit?",
      choices: [
        {
          label: "Sit. Deal.",
          nextId: "challenge_accepted",
          challenge: { npcKey: "the_degen" },
          publicFlag: "degen_challenged_by_player",
        },
        {
          label: "Not yet.",
          nextId: "terminal_come_back",
        },
      ],
    },

    /* ─── Terminal: challenge accepted ───
       The runner detects the `challenge:` outcome on the choice that
       brought us here and routes to buildNpcDeck → DuelystGameUI.
       This node renders only briefly while the match initializes. */
    challenge_accepted: {
      id: "challenge_accepted",
      npcKey: "the_degen",
      voLineId: "degen.perspective.challenge_accepted",
      onscreenText:
        "Then we play. The arithmetic was waiting.",
    },

    /* ─── Terminal: come back later ─── */
    terminal_come_back: {
      id: "terminal_come_back",
      npcKey: "the_degen",
      voLineId: "degen.perspective.terminal_come_back",
      onscreenText:
        "Then the canonical-arithmetic will wait. It does, mostly. The table is here. So is the booth. So am I.",
    },
  },
};
