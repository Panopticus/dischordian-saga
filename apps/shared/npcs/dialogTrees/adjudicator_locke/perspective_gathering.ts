// apps/shared/npcs/dialogTrees/adjudicator_locke/perspective_gathering.ts
//
// Adjudicator Locke — perspective gathering + challenge entry.
//
// Voice register: boardroom-predatory, finance-as-default metaphor.
// Per bible §1.4 voice tells: transaction reframe / aphoristic
// close / self-instrumentalization admission / deferred threat.
// Per §1.2 forbidden vocab: NO "fair" / "just" / "right" / "wrong"
// / "sorry" / "love" / "betray". NO pleading. NO loud voice. The
// closest she gets to morality is "the most expensive commodity."
//
// §1.5 silence shape: she does NOT name her superiors or the deal
// that cost her the eye. The eyepatch perspective is the PLAYER
// naming it back to her — she does not narrate the unmaking.

import type { NpcDialogTree } from "../types";

export const ADJUDICATOR_LOCKE_PERSPECTIVE_GATHERING: NpcDialogTree = {
  id: "adjudicator-locke-perspective-gathering",
  npcKey: "adjudicator_locke",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "adjudicator_locke",
      voLineId: "locke.perspective.root",
      onscreenText:
        "Adjudicator Locke. You have my attention, my friend. You also have, I'm noting, a posture I have priced before. Sit. The booth is on the house — which, you may have heard, is a phrase that has never once meant what it appears to. Name the transaction.",
      choices: [
        {
          label: "Whose price are you actually naming?",
          nextId: "aspect_price_naming",
          sets: "adjudicator_locke:price_naming",
          trustDelta: 2,
        },
        {
          label: "How does deniability become power?",
          nextId: "aspect_deniable_authority",
          sets: "adjudicator_locke:deniable_authority",
          trustDelta: 3,
          publicFlag: "locke_revealed_deniable_authority_to_player",
        },
        {
          label: "What was the eyepatch the receipt for?",
          nextId: "aspect_eyepatch_unmaking",
          sets: "adjudicator_locke:eyepatch_unmaking",
          trustDelta: 3,
          publicFlag: "locke_revealed_eyepatch_unmaking_to_player",
        },
        {
          label: "I carry the Degen's memory.",
          nextId: "echo_degen_memory",
          requires: "player_carries_the_degen_memory",
          trustDelta: 1,
        },
        {
          label: "I beat the Hierophant.",
          nextId: "echo_wraith_memory",
          requires: "player_carries_wraith_calder_memory",
          trustDelta: 1,
        },
        {
          label: "I'd like to transact.",
          nextId: "challenge_offer",
        },
      ],
    },

    aspect_price_naming: {
      id: "aspect_price_naming",
      npcKey: "adjudicator_locke",
      voLineId: "locke.perspective.price_naming",
      onscreenText:
        "Yours, my friend. Always yours. The Authority pays me to name yours. I have several pricing models available; the one I bring to a given booth is itself a transaction — the model is also priced. You will note I am telling you this. That is itself a tell. I would not tell you the model unless I had already decided the model. The model is decided. The price will follow.",
      autoNext: "after_aspect",
    },

    aspect_deniable_authority: {
      id: "aspect_deniable_authority",
      npcKey: "adjudicator_locke",
      voLineId: "locke.perspective.deniable_authority",
      onscreenText:
        "Through paperwork, my friend. Through fine print, through clauses, through the careful distance between the signature on the document and the entity it represents. Power that names itself can be opposed. Power that arrives through an Adjudicator — that has a procedural form, a precedent, a ruling, a verdict — is harder to refuse than to comply with. The deniability is the structure. The structure is the power.",
      autoNext: "after_aspect",
    },

    aspect_eyepatch_unmaking: {
      id: "aspect_eyepatch_unmaking",
      npcKey: "adjudicator_locke",
      voLineId: "locke.perspective.eyepatch_unmaking",
      onscreenText:
        "You're asking the question the Authority filed as protected, my friend. I will not name the deal. I will tell you what I am telling you by not telling you: the eyepatch is a receipt, the receipt is not for sale, and the most expensive commodity in this room is the one I have already chosen not to put on the table. You named the unmaking. I noted that you noticed. The Authority logs the noting.",
      autoNext: "after_aspect",
    },

    echo_degen_memory: {
      id: "echo_degen_memory",
      npcKey: "adjudicator_locke",
      voLineId: "locke.perspective.echo_degen_memory",
      onscreenText:
        "The Casino gives back. The Authority and the Casino have a long-standing arrangement of mutual non-interference, my friend, which is its own kind of contract. The arithmetic you carry registers on my ledger. I will not adjust the terms; I will note the carrying.",
      autoNext: "after_aspect",
    },

    echo_wraith_memory: {
      id: "echo_wraith_memory",
      npcKey: "adjudicator_locke",
      voLineId: "locke.perspective.echo_wraith_memory",
      onscreenText:
        "The lectern. The Hierophant and I have done business — quietly. He counts names; I count contracts; the chronicle has a column for each. You have sat at his desk; the noting is filed in your portfolio. I do not adjust the price. I do, however, raise my eyebrow.",
      autoNext: "after_aspect",
    },

    after_aspect: {
      id: "after_aspect",
      npcKey: "adjudicator_locke",
      voLineId: "locke.perspective.after_aspect",
      onscreenText:
        "Another clause. Or the table. Or the booth, my friend, if you would prefer to step away with the price still open.",
      choices: [
        {
          label: "Whose price are you naming?",
          nextId: "aspect_price_naming",
          requires: "locke_perspective_re_entry_ok",
          sets: "adjudicator_locke:price_naming",
          trustDelta: 1,
        },
        {
          label: "How does deniability become power?",
          nextId: "aspect_deniable_authority",
          requires: "locke_perspective_re_entry_ok",
          sets: "adjudicator_locke:deniable_authority",
          trustDelta: 2,
        },
        {
          label: "What was the eyepatch the receipt for?",
          nextId: "aspect_eyepatch_unmaking",
          requires: "locke_perspective_re_entry_ok",
          sets: "adjudicator_locke:eyepatch_unmaking",
          trustDelta: 2,
        },
        {
          label: "Sit me at the table.",
          nextId: "challenge_offer",
        },
        {
          label: "I'll step away.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_offer: {
      id: "challenge_offer",
      npcKey: "adjudicator_locke",
      voLineId: "locke.perspective.challenge_offer",
      onscreenText:
        "A transaction. Very good. The terms: you lose, I take one item from your portfolio I have been wanting; you win, the booth pays out the tray as priced by what you have understood. The fine print is the fine print, my friend. I have already initialled it. Your move.",
      choices: [
        {
          label: "Deal.",
          nextId: "challenge_accepted",
          challenge: { npcKey: "adjudicator_locke" },
          publicFlag: "locke_challenged_by_player",
        },
        {
          label: "Walk the booth back.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_accepted: {
      id: "challenge_accepted",
      npcKey: "adjudicator_locke",
      voLineId: "locke.perspective.challenge_accepted",
      onscreenText:
        "Then we begin. The ink is already forming.",
    },

    terminal_come_back: {
      id: "terminal_come_back",
      npcKey: "adjudicator_locke",
      voLineId: "locke.perspective.terminal_come_back",
      onscreenText:
        "Then the price stays open, my friend. The Authority is patient. So am I. Come back when the terms have finished forming themselves in your head.",
    },
  },
};
