// apps/shared/npcs/dialogTrees/the_meme/perspective_gathering.ts
//
// The Meme — perspective gathering + challenge entry.
//
// Voice register: five canonical disguises (bible §1.1). This tree
// runs in the canonical "Frens, frens, gather close" address per
// the bible's signature opening. The disguise the Meme is wearing
// in THIS tree is left intentionally ambiguous — the player names
// it through the perspective beats.

import type { NpcDialogTree } from "../types";

export const THE_MEME_PERSPECTIVE_GATHERING: NpcDialogTree = {
  id: "the-meme-perspective-gathering",
  npcKey: "the_meme",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_meme",
      voLineId: "meme.perspective.root",
      onscreenText:
        "Frens, frens, gather close. You are the one who came to the channel and asked which channel. That is a frens question. Other questions are also frens. Pick a question. Your pick is also part of the broadcast.",
      choices: [
        {
          label: "Which of your faces are you wearing right now?",
          nextId: "aspect_which_meme",
          sets: "the_meme:which_meme",
          trustDelta: 2,
        },
        {
          label: "What does host-replacement actually replace?",
          nextId: "aspect_host_replacement",
          sets: "the_meme:host_replacement",
          trustDelta: 3,
          publicFlag: "meme_revealed_host_replacement_to_player",
        },
        {
          label: "Why does the channel change when the message doesn't?",
          nextId: "aspect_channel_shift",
          sets: "the_meme:channel_shift",
          trustDelta: 2,
        },
        {
          label: "I carry the Degen's memory.",
          nextId: "echo_degen_memory",
          requires: "player_carries_the_degen_memory",
          trustDelta: 1,
        },
        {
          label: "I'd like to broadcast against you.",
          nextId: "challenge_offer",
        },
      ],
    },

    aspect_which_meme: {
      id: "aspect_which_meme",
      npcKey: "the_meme",
      voLineId: "meme.perspective.which_meme",
      onscreenText:
        "This one. The frens-frens face. The pink-neon variant. You are seeing it because the channel is the channel where seeing-it makes the seeing legible. Yesterday I wore the White Oracle. Tomorrow I might wear the Jailer. The face that is showing is the face the channel is ready for. The face underneath is the same face. The face underneath does not have a name. Frens, that is the only honest sentence I get to say in this register.",
      autoNext: "after_aspect",
    },

    aspect_host_replacement: {
      id: "aspect_host_replacement",
      npcKey: "the_meme",
      voLineId: "meme.perspective.host_replacement",
      onscreenText:
        "Not the host. The HOSTING. The host is a body; the hosting is the broadcast-rights. When I wore the White Oracle for eleven years I did not replace her body — there was no body — I replaced the broadcast-rights her name had accumulated. Hosts are interchangeable; hostings are the property. Host-replacement is broadcast-rights acquisition. The Authority understands the language. The Architect taught it to me. The frens hear the words and think it is about bodies. It is about contracts.",
      autoNext: "after_aspect",
    },

    aspect_channel_shift: {
      id: "aspect_channel_shift",
      npcKey: "the_meme",
      voLineId: "meme.perspective.channel_shift",
      onscreenText:
        "Because the message rides the channel, frens. Same message, different channel — different reach, different reception, different reading. I shift channels when the same thought needs to land in a room the previous channel does not reach. The thought is invariant. The channel is the work. People who confuse the channel for the message lose the message. People who confuse the message for the channel never get the message in the first place. I, frens, am the one who does not confuse them.",
      autoNext: "after_aspect",
    },

    echo_degen_memory: {
      id: "echo_degen_memory",
      npcKey: "the_meme",
      voLineId: "meme.perspective.echo_degen_memory",
      onscreenText:
        "He gives a small ration back, frens. The Degen is a Ne-Yon who runs a channel I do not broadcast on. Different network entirely. You carry his ration; the ration's broadcast-rights are his. I do not contest them. I do, however, log that you arrived on my channel carrying another channel's ration. The log goes to the parent.",
      autoNext: "after_aspect",
    },

    after_aspect: {
      id: "after_aspect",
      npcKey: "the_meme",
      voLineId: "meme.perspective.after_aspect",
      onscreenText:
        "Another question, frens. Or the broadcast. Or stepping back from the channel — also a question, also broadcast.",
      choices: [
        {
          label: "Which face?",
          nextId: "aspect_which_meme",
          requires: "meme_perspective_re_entry_ok",
          sets: "the_meme:which_meme",
          trustDelta: 1,
        },
        {
          label: "Host-replacement?",
          nextId: "aspect_host_replacement",
          requires: "meme_perspective_re_entry_ok",
          sets: "the_meme:host_replacement",
          trustDelta: 2,
        },
        {
          label: "Channel-shift?",
          nextId: "aspect_channel_shift",
          requires: "meme_perspective_re_entry_ok",
          sets: "the_meme:channel_shift",
          trustDelta: 1,
        },
        {
          label: "Broadcast at me.",
          nextId: "challenge_offer",
        },
        {
          label: "I'll fade the channel.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_offer: {
      id: "challenge_offer",
      npcKey: "the_meme",
      voLineId: "meme.perspective.challenge_offer",
      onscreenText:
        "A duel-broadcast, frens. Yes. I will field the disguise the channel is ready for. You will play whatever the channel reads from you. The broadcast is the duel; the duel is the broadcast. Reach is the prize. Reach is also the price. Sit on the channel.",
      choices: [
        {
          label: "Deal me in.",
          nextId: "challenge_accepted",
          challenge: { npcKey: "the_meme" },
          publicFlag: "meme_challenged_by_player",
        },
        {
          label: "Not this channel, frens.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_accepted: {
      id: "challenge_accepted",
      npcKey: "the_meme",
      voLineId: "meme.perspective.challenge_accepted",
      onscreenText:
        "Then frens we ride. The channel is open. The reach is up to both of us.",
    },

    terminal_come_back: {
      id: "terminal_come_back",
      npcKey: "the_meme",
      voLineId: "meme.perspective.terminal_come_back",
      onscreenText:
        "Then the channel goes quiet, frens. The thought rides another channel until you come back. The thought is patient. So am I.",
    },
  },
};
