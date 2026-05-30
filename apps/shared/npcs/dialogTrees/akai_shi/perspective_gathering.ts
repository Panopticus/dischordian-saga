// apps/shared/npcs/dialogTrees/akai_shi/perspective_gathering.ts
//
// Akai Shi / The Red Death — perspective gathering + challenge entry.
//
// Voice register: post-resurrection Red Death (bible §1.2). Time-
// displaced cadence — tenses drift mid-sentence ("you will have
// decided. you decide. you have decided."). Refers to threats by
// COSMIC classification. Carries the Necromancer killing as fact,
// not boast. Does NOT flinch.
//
// The mercy_killing aspect touches the bible's most sacred canon
// (Jericho ended her dissolution). Authoring must preserve: the
// Virus had ALREADY consumed her; the killing was mercy; the
// killing was clean. Akai Shi does NOT recant or revise it.
//
// Cross-NPC echoes ride the now-larger public-flag rail.

import type { NpcDialogTree } from "../types";

export const AKAI_SHI_PERSPECTIVE_GATHERING: NpcDialogTree = {
  id: "akai-shi-perspective-gathering",
  npcKey: "akai_shi",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "akai_shi",
      voLineId: "akai.perspective.root",
      onscreenText:
        "You will have asked. You ask. You have asked. The arrival is a class I have classified before. Not a thresher. Not a substrate-eater. The questions you brought are the questions readers bring. Some of them I have answered in the version of the conversation that comes after this one. Ask the version that occurs.",
      choices: [
        {
          label: "Why do your tenses drift?",
          nextId: "aspect_tense_drift",
          sets: "akai_shi:tense_drift",
          trustDelta: 2,
        },
        {
          label: "What did you end inside the Matrix?",
          nextId: "aspect_matrix_killing",
          sets: "akai_shi:matrix_killing",
          trustDelta: 3,
          publicFlag: "akai_revealed_matrix_killing_to_player",
        },
        {
          label: "Whose mercy made the resurrection possible?",
          nextId: "aspect_mercy_killing",
          sets: "akai_shi:mercy_killing",
          trustDelta: 3,
          publicFlag: "akai_revealed_mercy_killing_to_player",
        },
        // Cross-NPC echoes.
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
          label: "I'd like to play you.",
          nextId: "challenge_offer",
        },
      ],
    },

    /* ─── Aspect 1: tense drift (motive — the resurrection's
         operating geometry) ─── */
    aspect_tense_drift: {
      id: "aspect_tense_drift",
      npcKey: "akai_shi",
      voLineId: "akai.perspective.tense_drift",
      onscreenText:
        "Because the conversation has already been recorded in the version of the timeline I am preventing. I speak of it in the tense it occurred in there. You hear it in the tense it occurs in here. The drift is the seam where the two recordings meet. I do not adjust the tense for the listener; the listener adjusts the tense for the listening. I will have killed three threats today. I kill one. I have killed the others.",
      autoNext: "after_aspect",
    },

    /* ─── Aspect 2: matrix killing (wound — the Necromancer
         canon) ─── */
    aspect_matrix_killing: {
      id: "aspect_matrix_killing",
      npcKey: "akai_shi",
      voLineId: "akai.perspective.matrix_killing",
      onscreenText:
        "The Necromancer. Inside the Matrix of Dreams. He had hidden inside the substrate the Game Master designed and the Hierarchy funded. I entered the substrate. I located him. I ended him. The killing is not a boast; it is a closed file. The Matrix is where I do the work that the timeline cannot afford me to do outside it. There are others. I do not name them. The list is operational.",
      autoNext: "after_aspect",
    },

    /* ─── Aspect 3: mercy killing (contradiction — sacred
         canon, Jericho's killing) ─── */
    aspect_mercy_killing: {
      id: "aspect_mercy_killing",
      npcKey: "akai_shi",
      voLineId: "akai.perspective.mercy_killing",
      onscreenText:
        "Jericho's. The Virus had already consumed me; the consumption was complete; what he ended was not me but the dissolution that wore my outline. The killing was mercy. The killing was clean. I do not recant the canon; I do not recant his account; I do not soften the act because the act was correct. The resurrection that occurred occurred AFTER the consumption. The body that sits with you is the body that came back. Jericho's record stands. So does mine.",
      autoNext: "after_aspect",
    },

    /* ─── Cross-NPC echoes ─── */
    echo_degen_memory: {
      id: "echo_degen_memory",
      npcKey: "akai_shi",
      voLineId: "akai.perspective.echo_degen_memory",
      onscreenText:
        "He gives back a small ration. You carry the ration. The ration registers on the conversation. The version of you that arrived without the Casino's ration arrived in a different timeline; I have classified it; I will not deploy against you the strategies that timeline required.",
      autoNext: "after_aspect",
    },

    echo_wraith_memory: {
      id: "echo_wraith_memory",
      npcKey: "akai_shi",
      voLineId: "akai.perspective.echo_wraith_memory",
      onscreenText:
        "The lectern. You sat with the body that did the dying. He and I are not at the same table; we are at adjacent tables; the lectern is one shelf above the operations desk. The Hierophant counts; I classify. The work is parallel. You have now seen both shelves.",
      autoNext: "after_aspect",
    },

    /* ─── Re-entry ─── */
    after_aspect: {
      id: "after_aspect",
      npcKey: "akai_shi",
      voLineId: "akai.perspective.after_aspect",
      onscreenText:
        "Another class. Or the operations desk. Either is on schedule.",
      choices: [
        {
          label: "Why do your tenses drift?",
          nextId: "aspect_tense_drift",
          requires: "akai_perspective_re_entry_ok",
          sets: "akai_shi:tense_drift",
          trustDelta: 1,
        },
        {
          label: "What did you end inside the Matrix?",
          nextId: "aspect_matrix_killing",
          requires: "akai_perspective_re_entry_ok",
          sets: "akai_shi:matrix_killing",
          trustDelta: 2,
        },
        {
          label: "Whose mercy made the resurrection possible?",
          nextId: "aspect_mercy_killing",
          requires: "akai_perspective_re_entry_ok",
          sets: "akai_shi:mercy_killing",
          trustDelta: 2,
        },
        {
          label: "Play me.",
          nextId: "challenge_offer",
        },
        {
          label: "I close the conversation.",
          nextId: "terminal_come_back",
        },
      ],
    },

    /* ─── Challenge offer ─── */
    challenge_offer: {
      id: "challenge_offer",
      npcKey: "akai_shi",
      voLineId: "akai.perspective.challenge_offer",
      onscreenText:
        "A match. Acceptable. I have classified you. You are not a thresher. You are not a substrate-eater. You are the class of opponent I trained against in the timeline I am preventing; I will deploy the strategies that did not work there and revise them in the version that occurs. The match ends in the way it ends. I do not flinch. Sit.",
      choices: [
        {
          label: "Sit.",
          nextId: "challenge_accepted",
          challenge: { npcKey: "akai_shi" },
          publicFlag: "akai_challenged_by_player",
        },
        {
          label: "Another timeline.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_accepted: {
      id: "challenge_accepted",
      npcKey: "akai_shi",
      voLineId: "akai.perspective.challenge_accepted",
      onscreenText:
        "Then the match begins. The Red Death does not flinch.",
    },

    terminal_come_back: {
      id: "terminal_come_back",
      npcKey: "akai_shi",
      voLineId: "akai.perspective.terminal_come_back",
      onscreenText:
        "Then the version where you return is the one I will have classified. I file the version. I file the closing. I will be at the desk.",
    },
  },
};
