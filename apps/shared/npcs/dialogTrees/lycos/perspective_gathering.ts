// apps/shared/npcs/dialogTrees/lycos/perspective_gathering.ts
//
// Lycos / the Wolf — perspective gathering + challenge entry.
//
// Voice register: post-resurrection Wolf (bible §1.2). Sparse,
// exact, unsentimental. Noun before verb. Direct deixis instead
// of names. The Wolf does NOT raise his voice. He does not soften
// the last word. He does not chase a sentence with a qualifier.
//
// §2.3 canon: the Judge killed Lycos under authority — clean
// execution, not mercy. The Wolf does not contest the authority;
// he contests only the silence afterward. Authoring preserves
// that.

import type { NpcDialogTree } from "../types";

export const LYCOS_PERSPECTIVE_GATHERING: NpcDialogTree = {
  id: "lycos-perspective-gathering",
  npcKey: "lycos",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "lycos",
      voLineId: "lycos.perspective.root",
      onscreenText:
        "The perimeter is clean. You crossed it. The contract permits the crossing. Ask. The lead is downwind; the second covers the south. We have time.",
      choices: [
        {
          label: "What did the Judge's killing actually close?",
          nextId: "aspect_judges_killing",
          sets: "lycos:judges_killing",
          trustDelta: 2,
        },
        {
          label: "Why does the Antiquarian write the contracts short?",
          nextId: "aspect_wolf_tasking",
          sets: "lycos:wolf_tasking",
          trustDelta: 3,
          publicFlag: "lycos_revealed_wolf_tasking_to_player",
        },
        {
          label: "What does the ballot foreclose if you're sacrificed?",
          nextId: "aspect_ballot_foreclosure",
          sets: "lycos:ballot_foreclosure",
          trustDelta: 3,
          publicFlag: "lycos_revealed_ballot_foreclosure_to_player",
        },
        {
          label: "I carry the Hierophant's memory.",
          nextId: "echo_wraith_memory",
          requires: "player_carries_wraith_calder_memory",
          trustDelta: 1,
        },
        {
          label: "I beat Akai Shi.",
          nextId: "echo_akai_memory",
          requires: "player_carries_akai_shi_memory",
          trustDelta: 2,
        },
        {
          label: "The contract permits the duel.",
          nextId: "challenge_offer",
        },
      ],
    },

    aspect_judges_killing: {
      id: "aspect_judges_killing",
      npcKey: "lycos",
      voLineId: "lycos.perspective.judges_killing",
      onscreenText:
        "The infection. He closed the infection. The Quarchon doctrine had no clause for a Servant Hero who had become a vector; the Judge wrote the clause by carrying the act out. The execution was clean. I do not contest the authority. I contest the silence afterward. He did not stay to witness it. The silence is what the doctrine cannot file. The Antiquarian filed it for him.",
      autoNext: "after_aspect",
    },

    aspect_wolf_tasking: {
      id: "aspect_wolf_tasking",
      npcKey: "lycos",
      voLineId: "lycos.perspective.wolf_tasking",
      onscreenText:
        "Because long contracts kill packs. The Antiquarian writes them short because the Pack reads short contracts well. The lead carries one verb. The second carries the next. A long contract becomes ambiguous in the field; ambiguity is a body in the perimeter. The Antiquarian does not write ambiguity. He writes the verb. I read the verb. The Pack reads me.",
      autoNext: "after_aspect",
    },

    aspect_ballot_foreclosure: {
      id: "aspect_ballot_foreclosure",
      npcKey: "lycos",
      voLineId: "lycos.perspective.ballot_foreclosure",
      onscreenText:
        "Anara. The two hundred fifty in the matrix. The hunt is mid-stride. The matrix records partial completions; the ballot would freeze it. The Heroes not yet hunted would remain in the matrix at the configuration the ballot caught them in. The lead would freeze. The contract would close partial. The forecloser is not the ballot. The forecloser is the configuration the freezing happens against.",
      autoNext: "after_aspect",
    },

    echo_wraith_memory: {
      id: "echo_wraith_memory",
      npcKey: "lycos",
      voLineId: "lycos.perspective.echo_wraith_memory",
      onscreenText:
        "The lectern. He counts. I do not count. The Hierophant and I work different surfaces of the same doctrine. He carries patience as the answer. I carry the contract as the answer. The doctrines are adjacent. You have sat at both. The Pack noted.",
      autoNext: "after_aspect",
    },

    echo_akai_memory: {
      id: "echo_akai_memory",
      npcKey: "lycos",
      voLineId: "lycos.perspective.echo_akai_memory",
      onscreenText:
        "She was on Thaloria with me. The Virus took her cleanly; the Virus took me by stages. Her resurrection was not the Crucible. Mine was. We do not work the same surface anymore. The contract permits the noting of the parallel. The contract does not require the meeting.",
      autoNext: "after_aspect",
    },

    after_aspect: {
      id: "after_aspect",
      npcKey: "lycos",
      voLineId: "lycos.perspective.after_aspect",
      onscreenText:
        "Another question. Or the perimeter. The lead has not moved.",
      choices: [
        {
          label: "Judge's killing?",
          nextId: "aspect_judges_killing",
          requires: "lycos_perspective_re_entry_ok",
          sets: "lycos:judges_killing",
          trustDelta: 1,
        },
        {
          label: "Wolf-tasking?",
          nextId: "aspect_wolf_tasking",
          requires: "lycos_perspective_re_entry_ok",
          sets: "lycos:wolf_tasking",
          trustDelta: 2,
        },
        {
          label: "Ballot foreclosure?",
          nextId: "aspect_ballot_foreclosure",
          requires: "lycos_perspective_re_entry_ok",
          sets: "lycos:ballot_foreclosure",
          trustDelta: 2,
        },
        {
          label: "The duel.",
          nextId: "challenge_offer",
        },
        {
          label: "I'll step back through the perimeter.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_offer: {
      id: "challenge_offer",
      npcKey: "lycos",
      voLineId: "lycos.perspective.challenge_offer",
      onscreenText:
        "The contract permits. You lose, the Antiquarian writes the asset transfer. You win, the Pack registers the loss without contest. The lead will not engage. The second covers the south. We deal here. Sit.",
      choices: [
        {
          label: "Deal.",
          nextId: "challenge_accepted",
          challenge: { npcKey: "lycos" },
          publicFlag: "lycos_challenged_by_player",
        },
        {
          label: "Not under this contract.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_accepted: {
      id: "challenge_accepted",
      npcKey: "lycos",
      voLineId: "lycos.perspective.challenge_accepted",
      onscreenText:
        "Then we deal. The Pack will not interrupt.",
    },

    terminal_come_back: {
      id: "terminal_come_back",
      npcKey: "lycos",
      voLineId: "lycos.perspective.terminal_come_back",
      onscreenText:
        "The contract remains. The perimeter remains. Come back when the question has finished forming.",
    },
  },
};
