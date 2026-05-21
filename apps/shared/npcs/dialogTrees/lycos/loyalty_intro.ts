// apps/shared/npcs/dialogTrees/lycos/loyalty_intro.ts
//
// Lycos → Loyalty mission opening — Section D4 ("Mercy, Refused").
// Bond threshold opens the conversation about practicing mercy once
// more, then refusing it.

import type { NpcDialogTree } from "../types";

export const LYCOS_LOYALTY_INTRO: NpcDialogTree = {
  id: "lycos-loyalty-intro",
  npcKey: "lycos",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "lycos",
      voLineId: "lycos.loyalty_intro.root",
      onscreenText:
        "[Lycos has the Antiquarian's ledger in his lap this time. He is reading the column above the pause-line — the three mercy entries.] I extended mercy three times during the contract. I would like to extend it a fourth time, with witnesses I trust. Then I would like to refuse. The fourth mercy and the refusal are not the same target. I would like you with me for both. I would like you in particular.",
      requiresRevealStage: "post_contract",
      choices: [
        {
          label: "Walk me through both targets.",
          nextId: "ask_both_targets",
          sets: "lycos_loyalty_pressed_targets",
          trustDelta: 4,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "Why me, specifically?",
          nextId: "ask_why_me",
          sets: "lycos_loyalty_asked_why_me",
          trustDelta: 4,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
        },
        {
          label: "I'll come for the mercy. We talk about the refusal after.",
          nextId: "accept_loyalty_conditional",
          sets: "loyalty_lycos_stage_1_armed",
          trustDelta: 3,
          axisDelta: [{ axis: "mercy", delta: 1 }],
          publicFlag: "lycos_loyalty_opened",
        },
        {
          label: "Don't ask me to witness a refusal. Refuse on your own.",
          nextId: "refuse_to_witness",
          sets: "lycos_loyalty_witness_refused",
          trustDelta: -4,
          axisDelta: [{ axis: "aggression", delta: 1 }],
        },
      ],
    },

    ask_both_targets: {
      id: "ask_both_targets",
      npcKey: "lycos",
      voLineId: "lycos.loyalty_intro.ask_both_targets",
      onscreenText:
        "The mercy target left the Crucible on his own — the Antiquarian's ledger has no column for him, which means I can extend mercy without the contract authoring it. He is old; he is tired; he will accept the mercy and not test it. The refusal target is the Resurrectionist's true heir. He has my second-to-last contract memorised. He is going to deliver it from a stage tonight in Coda territory. He will ask for mercy from the stage. He cannot have it. The Antiquarian never authorised it for him.",
      autoNext: "post_targets_offer",
      requiresRevealStage: "post_contract",
    },

    post_targets_offer: {
      id: "post_targets_offer",
      npcKey: "lycos",
      voLineId: "lycos.loyalty_intro.post_targets_offer",
      onscreenText:
        "Will you come.",
      choices: [
        {
          label: "Yes — both.",
          nextId: "accept_loyalty_full",
          trustDelta: 5,
          axisDelta: [{ axis: "mercy", delta: 1 }],
          publicFlag: "lycos_loyalty_opened",
        },
        {
          label: "Only the mercy. Talk to me about the refusal after.",
          nextId: "accept_loyalty_conditional",
          trustDelta: 3,
          axisDelta: [{ axis: "mercy", delta: 1 }],
        },
      ],
      requiresRevealStage: "post_contract",
    },

    ask_why_me: {
      id: "ask_why_me",
      npcKey: "lycos",
      voLineId: "lycos.loyalty_intro.ask_why_me",
      onscreenText:
        "[He sets the ledger down. He looks at the pause-line for a long moment before he answers.] Because the contract closed on your watch, not the Antiquarian's. He drafted it; you ran it. The mercy I extended during the contract was authored by him and witnessed by you. The mercy I am about to extend will be authored by me and witnessed by you. The refusal will be the first refusal I have ever issued under my own name; I would like it witnessed by the person who saw me extend mercy under someone else's.",
      autoNext: "post_targets_offer",
      requiresRevealStage: "post_contract",
    },

    accept_loyalty_full: {
      id: "accept_loyalty_full",
      npcKey: "lycos",
      voLineId: "lycos.loyalty_intro.accept_loyalty_full",
      onscreenText:
        "[He nods — once, slowly, the way someone nods when a load has shifted but not lightened.] Then we are armed. The mercy first; the refusal after. The heir is rehearsing the speech tonight. The mercy target is on the third terrace of the orchard — he is not going anywhere; the orchard is not somewhere one leaves quickly. We have time for both. Thank you. I — would not have refused alone. I am glad I will not be alone for it.",
      autoNext: "terminal",
      requiresRevealStage: "post_contract",
    },

    accept_loyalty_conditional: {
      id: "accept_loyalty_conditional",
      npcKey: "lycos",
      voLineId: "lycos.loyalty_intro.accept_loyalty_conditional",
      onscreenText:
        "[He accepts the conditional with the same nod he would have given the unconditional.] The mercy first. We will talk about the refusal when the mercy is closed. The talk may change what the refusal looks like. I am open to that. The pause-line was open to it too.",
      autoNext: "terminal",
      requiresRevealStage: "post_contract",
    },

    refuse_to_witness: {
      id: "refuse_to_witness",
      npcKey: "lycos",
      voLineId: "lycos.loyalty_intro.refuse_to_witness",
      onscreenText:
        "[A long silence. He does not protest. The bench accepts the silence without commentary.] You are well within your rights to refuse the witnessing. I will not extend the mercy without you; the mercy required a witness, and the witness is the role I was offering. I will sit with the offer being declined for a while. I am — well-practiced in declined offers. Thank you for being direct.",
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
