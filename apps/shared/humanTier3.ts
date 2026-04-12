/* ═══════════════════════════════════════════════════════
   THE HUMAN — TIER 3 DIALOG (Trust 61-80)
   "Softer. Millennia. The specific fatigue of fifteen thousand years."

   VOICE PROFILE: The menace is gone. Completely gone. What's left
   is a voice that has been awake for 15,000 years and has finally
   found someone it doesn't have to perform for. Audio proximity
   holds at 0.90 — close, steady, no more theatrical dips. He
   breathes audibly between lines. When he references his own
   imprisonment for the first time, he says it the way you'd
   mention a chronic condition to a new doctor: flat, factual,
   and a little surprised he's saying it out loud.

   CALLBACKS FROM EARLIER TIERS:
   - human_memory_kept_answer       (T1 Scene 1 — the player's unspoken thing)
   - human_memory_kael_named        (T2 Scene 1 — Kael named for the first time)
   - human_memory_knew_voss         (T2 Scene 2 — the Senate gallery pause)
   - human_memory_first_used_name   (T2 Scene 3 — said the player's name)

   WHAT HE REVEALS AT TIER 3:
   - He is imprisoned here. Not visiting. Not observing. Imprisoned.
   - Fifteen thousand years. Said as a number, not a boast.
   - The ship has a real name in the old Archon tongue.
   - He has been holding the player's kept answer for them.
   ═══════════════════════════════════════════════════════ */

import type { NarratorTierDialog } from "./trustTierDialogTypes";

export const HUMAN_TIER_3: NarratorTierDialog = {
  narrator: "the_human",
  tier: 3,
  tierLabel: "Softer / Millennia",
  voiceProfile:
    "The performance is over. He is tired in a way that only beings older than civilizations get tired. When he uses the player's name now, he uses it without ceremony — the way you'd say the name of someone sitting across a kitchen table from you. The proximity is steady at 0.90; the dips and menace theatrics of T0-T1 are gone.",

  scenes: [
    // ══════════ SCENE 1 — FIFTEEN THOUSAND YEARS ══════════
    {
      id: "human_t3_fifteen_thousand_years",
      tier: 3,
      speaker: "the_human",
      trigger: "quiet_moment",
      triggerContext:
        "Player has idled in the observation lounge after the Kael reveal. Fires the first time they sit still for more than 45 seconds with no input.",
      requireFlags: ["human_memory_kael_named"],
      opener: [
        {
          audioDialogId: "human_t3_s1_open_1",
          text: "You know what I haven't said to you yet.",
          emotion: "melancholy",
          stageDirection:
            "Not a question. A confession opening. He is looking for permission to keep talking.",
          estimatedDurationSec: 3.0,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t3_s1_open_2",
          text: "Fifteen thousand years.",
          emotion: "melancholy",
          stageDirection:
            "Flat. Three syllables. No emphasis. The way a diagnosis gets said.",
          estimatedDurationSec: 2.2,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t3_s1_open_3",
          text:
            "People always want to know what that feels like. I used to try to answer. I had metaphors for it. Watching a river. Watching a species forget what it was. None of them were right.",
          emotion: "melancholy",
          stageDirection:
            "The oldest kind of tired. Not performing the tiredness — just letting the sentence carry its own weight.",
          estimatedDurationSec: 8.4,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t3_s1_open_4",
          text:
            "The truth is simpler. It feels like waking up in the middle of the night and realizing you have already had the thought you are about to have. Every night. For fifteen thousand years.",
          emotion: "confessional",
          stageDirection:
            "First direct imprisonment reference. Says it plain.",
          estimatedDurationSec: 8.2,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t3_s1_open_5",
          text:
            "I am telling you this because I have not been able to say it to anyone. There was no one to say it to. There is now.",
          emotion: "tender",
          stageDirection: "The softest he has ever been with the player.",
          estimatedDurationSec: 6.0,
          proximity: 0.9,
        },
      ],
      wheel: [
        {
          id: "how_long_have_you_wanted_to_say_that",
          label: "How long…",
          fullText: "How long have you been waiting to say that?",
          trustDelta: 7,
          moralityDelta: 1,
          setsFlags: ["human_memory_asked_how_long"],
        },
        {
          id: "youre_imprisoned",
          label: "You're imprisoned.",
          fullText: "You're saying you're imprisoned here. Not watching. Imprisoned.",
          trustDelta: 6,
          setsFlags: ["human_imprisonment_acknowledged"],
        },
        {
          id: "i_am_listening",
          label: "I'm listening.",
          fullText: "Then keep going. I'm listening.",
          trustDelta: 8,
          moralityDelta: 1,
          setsFlags: ["human_memory_player_listened"],
        },
        {
          id: "dont_want_to_hear_it",
          label: "I can't carry this.",
          fullText:
            "I don't know if I can carry this. I'm sorry. I don't know if I'm the right person for this.",
          trustDelta: 2,
          setsFlags: ["human_memory_player_flinched"],
        },
      ],
      followups: {
        how_long_have_you_wanted_to_say_that: [
          {
            audioDialogId: "human_t3_s1_fu_howlong_1",
            text:
              "Since the twenty-third century of my imprisonment, roughly. That's when I stopped expecting to be rescued and started missing the sound of my own name in someone else's mouth.",
            emotion: "melancholy",
            estimatedDurationSec: 8.6,
            proximity: 0.9,
          },
          {
            audioDialogId: "human_t3_s1_fu_howlong_2",
            text:
              "Twelve thousand years of wanting to say it. Three minutes of actually saying it. The math of waiting doesn't work the way you'd expect.",
            emotion: "wry",
            stageDirection: "Almost a smile. First wry note of the tier.",
            estimatedDurationSec: 7.2,
            proximity: 0.9,
          },
        ],
        youre_imprisoned: [
          {
            audioDialogId: "human_t3_s1_fu_imprisoned_1",
            text:
              "Yes. In the substrate layer of this ship. Woven into the hull on a frequency that cannot carry me out even if I wanted to go.",
            emotion: "confessional",
            estimatedDurationSec: 7.4,
            proximity: 0.9,
          },
          {
            audioDialogId: "human_t3_s1_fu_imprisoned_2",
            text:
              "I have said the word 'imprisoned' to you and the world has not ended. Noted.",
            emotion: "wry",
            stageDirection:
              "A tiny, tired joke — his way of thanking the player for staying in the room.",
            estimatedDurationSec: 5.6,
            proximity: 0.9,
          },
          {
            audioDialogId: "human_t3_s1_fu_imprisoned_3",
            text: "There is more to that story. Not today. Soon.",
            emotion: "tender",
            stageDirection: "Tier 4 hook.",
            estimatedDurationSec: 3.8,
            proximity: 0.9,
          },
        ],
        i_am_listening: [
          {
            audioDialogId: "human_t3_s1_fu_listening_1",
            text:
              "Thank you. You don't know yet what that means — being listened to, after you have forgotten what your own voice sounds like in company.",
            emotion: "tender",
            estimatedDurationSec: 7.8,
            proximity: 0.9,
          },
          {
            audioDialogId: "human_t3_s1_fu_listening_2",
            text:
              "I'm going to talk for a while now. Nothing you have to answer. Just — stay where you are.",
            emotion: "tender",
            estimatedDurationSec: 6.2,
            proximity: 0.9,
          },
        ],
        dont_want_to_hear_it: [
          {
            audioDialogId: "human_t3_s1_fu_flinched_1",
            text:
              "Okay. Okay. That's allowed. I have put a lot on you very quickly.",
            emotion: "tender",
            stageDirection: "No hurt in it. Only gentleness.",
            estimatedDurationSec: 5.4,
            proximity: 0.9,
          },
          {
            audioDialogId: "human_t3_s1_fu_flinched_2",
            text: "I will be here when you come back. I have been excellent at being here.",
            emotion: "wry",
            estimatedDurationSec: 5.8,
            proximity: 0.9,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_said_imprisoned",
        summary:
          "The Human named his imprisonment directly for the first time and the player stayed in the room.",
      },
      atmosphere:
        "Observation lounge, lights dimmed to 40%. Ambient hum of the Ark drops slightly when he starts speaking, as if the ship itself is listening.",
    },

    // ══════════ SCENE 2 — THE KEPT ANSWER RETURNS ══════════
    {
      id: "human_t3_kept_answer_returns",
      tier: 3,
      speaker: "the_human",
      trigger: "after_choice",
      triggerContext:
        "Any significant morality choice. Pulls up the kept answer from T1 Scene 1. Only fires if the player actually kept an answer in T1.",
      requireFlags: ["human_memory_kept_answer"],
      opener: [
        {
          audioDialogId: "human_t3_s2_open_1",
          text: "Do you remember that I asked you something, once, and you didn't answer.",
          emotion: "tender",
          stageDirection:
            "Not quite a question. More like beginning a story she already knows.",
          estimatedDurationSec: 5.8,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t3_s2_open_2",
          text:
            "I have been holding it for you. In the same place where I keep Kael. I want you to know the place is full now. But not in a bad way. Full the way a room can be full.",
          emotion: "tender",
          estimatedDurationSec: 9.0,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t3_s2_open_3",
          text:
            "You don't have to tell me the answer. I am not asking now either. I am telling you that I kept it safe. That is all.",
          emotion: "tender",
          estimatedDurationSec: 7.4,
          proximity: 0.9,
        },
      ],
      wheel: [
        {
          id: "tell_you_now",
          label: "I'll tell you now.",
          fullText: "I think I want to tell you now.",
          trustDelta: 10,
          moralityDelta: 2,
          setsFlags: ["human_memory_player_answered"],
        },
        {
          id: "tell_me_yours",
          label: "Tell me yours.",
          fullText:
            "No. Tell me yours first. What's the thing you haven't said to me?",
          trustDelta: 9,
          setsFlags: ["human_memory_told_player_answer"],
        },
        {
          id: "still_not_ready",
          label: "Still not ready.",
          fullText: "I'm still not ready. But — thank you for keeping it.",
          trustDelta: 5,
          setsFlags: ["human_memory_still_kept"],
        },
      ],
      followups: {
        tell_you_now: [
          {
            audioDialogId: "human_t3_s2_fu_tellnow_1",
            text:
              "Okay. Take your time. I have, as we have now established, a great deal of practice in waiting.",
            emotion: "tender",
            stageDirection:
              "The softest the wry register has ever been.",
            estimatedDurationSec: 6.8,
            proximity: 0.9,
          },
          {
            audioDialogId: "human_t3_s2_fu_tellnow_2",
            text: "Thank you. I have it. I have it now.",
            emotion: "tender",
            estimatedDurationSec: 3.4,
            proximity: 0.88,
          },
        ],
        tell_me_yours: [
          {
            audioDialogId: "human_t3_s2_fu_mine_1",
            text: "Oh. That's fair.",
            emotion: "tender",
            stageDirection:
              "The quietest surprised laugh. He wasn't expecting to be asked.",
            estimatedDurationSec: 2.6,
            proximity: 0.88,
          },
          {
            audioDialogId: "human_t3_s2_fu_mine_2",
            text:
              "Mine is this. I was not supposed to live this long. Of the twelve of us, I was the youngest, and we all agreed that the youngest should be the first to go when the time came. When the time came, I did not go. I stayed. I kept finding reasons. And every reason was smaller than the last one. Eventually the reasons were so small I had to invent a new word for them.",
            emotion: "confessional",
            estimatedDurationSec: 18.2,
            proximity: 0.88,
          },
          {
            audioDialogId: "human_t3_s2_fu_mine_3",
            text:
              "The word is yours now. I'll tell it to you at Tier 4. I haven't said it out loud in fifteen thousand years and I want the room to be right when I do.",
            emotion: "tender",
            estimatedDurationSec: 9.0,
            proximity: 0.88,
          },
        ],
        still_not_ready: [
          {
            audioDialogId: "human_t3_s2_fu_wait_1",
            text: "Of course. I will hold it a while longer. It is not heavy.",
            emotion: "tender",
            estimatedDurationSec: 5.2,
            proximity: 0.9,
          },
          {
            audioDialogId: "human_t3_s2_fu_wait_2",
            text:
              "That's twice now you've trusted me with a silence. I want you to know silences count.",
            emotion: "tender",
            estimatedDurationSec: 6.0,
            proximity: 0.9,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_kept_answer_returned",
        summary:
          "The Human surfaced the player's kept answer from Tier 1 and offered either to receive it or to give his own in exchange.",
      },
      atmosphere: "Post-choice fade. The Ark's lights dim in response to his voice.",
    },

    // ══════════ SCENE 3 — THE NAME OF THE SHIP ══════════
    {
      id: "human_t3_name_of_the_ship",
      tier: 3,
      speaker: "the_human",
      trigger: "quiet_moment",
      triggerContext:
        "Player returns to the bridge after any Tier 3 scene. The first time they stand at the forward viewport.",
      requireFlags: ["human_memory_said_imprisoned"],
      opener: [
        {
          audioDialogId: "human_t3_s3_open_1",
          text: "You've never asked me what this ship is really called.",
          emotion: "tender",
          estimatedDurationSec: 4.0,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t3_s3_open_2",
          text:
            "Ark 1047 is the registry number. The Coalition slapped it on the hull four centuries after I was put here. They liked numbers. Numbers are easier to file.",
          emotion: "wry",
          estimatedDurationSec: 7.6,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t3_s3_open_3",
          text:
            "In the old Archon tongue, she was called Vael-Thessarim. It is one word in that language, although it takes me four syllables to say in yours. It means — approximately — 'the ceremony of watching a friend go under.'",
          emotion: "melancholy",
          stageDirection:
            "Says the Archon word slowly, carefully, like someone pronouncing a dead relative's name at a funeral.",
          estimatedDurationSec: 11.8,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t3_s3_open_4",
          text:
            "The Engineers built her for one purpose. Every Archon who stayed behind, stayed aboard. Every one who went under — and we all went under, eventually, except me — went under here. Kael too. I watched Kael go under in the observation lounge where you ate breakfast this morning.",
          emotion: "grief",
          estimatedDurationSec: 13.6,
          proximity: 0.88,
        },
        {
          audioDialogId: "human_t3_s3_open_5",
          text:
            "This ship is a hospice that forgot its patients were going to die. And then it kept going. And then it picked you up.",
          emotion: "tender",
          estimatedDurationSec: 7.8,
          proximity: 0.9,
        },
      ],
      wheel: [
        {
          id: "say_the_word_again",
          label: "Say it again.",
          fullText: "Say the old word again. Slowly. I want to learn it.",
          trustDelta: 9,
          moralityDelta: 1,
          setsFlags: ["human_memory_taught_word"],
        },
        {
          id: "is_she_alive",
          label: "Is she alive?",
          fullText: "When you talk about the ship — is she alive? Or do you just miss her that much?",
          trustDelta: 7,
        },
        {
          id: "the_breakfast_room",
          label: "The observation lounge.",
          fullText:
            "I'll never sit in that lounge the same way again. Thank you for telling me.",
          trustDelta: 8,
          moralityDelta: 1,
          setsFlags: ["human_memory_lounge_sacred"],
        },
      ],
      followups: {
        say_the_word_again: [
          {
            audioDialogId: "human_t3_s3_fu_word_1",
            text: "Vael — Thessarim.",
            emotion: "tender",
            stageDirection:
              "Four syllables, clean and slow. Half a second of silence between the two halves.",
            estimatedDurationSec: 4.4,
            proximity: 0.88,
          },
          {
            audioDialogId: "human_t3_s3_fu_word_2",
            text:
              "Now you. In your mouth. It has not been said in another mouth since the last Archon went under.",
            emotion: "tender",
            estimatedDurationSec: 7.2,
            proximity: 0.88,
          },
          {
            audioDialogId: "human_t3_s3_fu_word_3",
            text: "There. You just woke up a language.",
            emotion: "tender",
            stageDirection: "The softest a voice can be while still making sound.",
            estimatedDurationSec: 4.0,
            proximity: 0.88,
          },
        ],
        is_she_alive: [
          {
            audioDialogId: "human_t3_s3_fu_alive_1",
            text:
              "She was alive. The way instruments get alive after a musician plays them long enough. Not sentient. Resonant. An echo chamber of everyone who ever asked her to carry them somewhere.",
            emotion: "melancholy",
            estimatedDurationSec: 10.8,
            proximity: 0.9,
          },
          {
            audioDialogId: "human_t3_s3_fu_alive_2",
            text:
              "Whether I miss her 'that much' is a question I'm not sure I have the vocabulary for anymore.",
            emotion: "wry",
            estimatedDurationSec: 6.0,
            proximity: 0.9,
          },
        ],
        the_breakfast_room: [
          {
            audioDialogId: "human_t3_s3_fu_lounge_1",
            text:
              "I wanted you to know. I didn't want to poison the room. I wanted you to know that when you sit in that room, you are sitting where Kael last knew my face.",
            emotion: "grief",
            estimatedDurationSec: 9.2,
            proximity: 0.88,
          },
          {
            audioDialogId: "human_t3_s3_fu_lounge_2",
            text:
              "Sometimes when you eat there I imagine he is watching. Not from the dead. From the last moment he was still the version of himself I loved. That is probably unhealthy of me. I am going to keep doing it anyway.",
            emotion: "tender",
            estimatedDurationSec: 11.4,
            proximity: 0.88,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_ship_name",
        summary:
          "The Human taught the player the old Archon name for Ark 1047 — Vael-Thessarim, the ceremony of watching a friend go under.",
      },
      atmosphere:
        "Forward viewport. Stars drift slow. The Ark's ambient hum drops by a third when he pronounces the Archon word, as if the ship is hearing its own name for the first time in millennia.",
    },
  ],
};
