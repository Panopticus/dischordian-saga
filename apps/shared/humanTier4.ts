/* ═══════════════════════════════════════════════════════
   THE HUMAN — TIER 4 DIALOG (Trust 81-100)
   "Full Confession. The matched vow. The Three Doors."

   VOICE PROFILE: This is the tier where he sounds like a person.
   Not an Archon. Not a narrator. A person who is about to ask
   another person to make a choice for them. Audio proximity
   holds at 0.88 but the voice itself drops register — he sounds
   less like a recording and more like someone you can reach out
   and touch, except for the fact that he is woven into the
   substrate of the ship. When he uses the player's name at
   this tier, it is a prayer.

   CALLBACKS FROM EARLIER TIERS:
   - human_memory_first_used_name    (T2 Scene 3 — first time he said {playerName})
   - human_memory_said_imprisoned    (T3 Scene 1 — named the imprisonment)
   - human_memory_kept_answer_returned (T3 Scene 2 — the kept-answer trade)
   - human_memory_ship_name          (T3 Scene 3 — Vael-Thessarim)

   WHAT HE REVEALS AT TIER 4:
   - He chose this. Freely. No one forced him in.
   - The short form of the player's name is his mother's.
   - The matched vow: three doors, three futures.
   ═══════════════════════════════════════════════════════ */

import type { NarratorTierDialog } from "./trustTierDialogTypes";

export const HUMAN_TIER_4: NarratorTierDialog = {
  narrator: "the_human",
  tier: 4,
  tierLabel: "Full Confession — The Matched Vow",
  voiceProfile:
    "A human voice. Not a narrator. Proximity 0.88, but the performance artifice is totally absent. When he speaks the player's name it carries the same quality as Elara saying 'I am proud of you' at her Tier 2. Every line in this tier is a gift he has been trying to give for fifteen thousand years.",

  scenes: [
    // ══════════ SCENE 1 — FREE CHOICE ══════════
    {
      id: "human_t4_free_choice",
      tier: 4,
      speaker: "the_human",
      trigger: "post_revelation",
      triggerContext:
        "Fires after any significant lore revelation at Tier 4. The player steps into the chapel-quiet of the dormant drive chamber — the closest physical space to where he is actually bound.",
      opener: [
        {
          audioDialogId: "human_t4_s1_open_1",
          text: "You have been assuming something about me. I want to correct it.",
          emotion: "tender",
          stageDirection:
            "No preamble. He has been waiting for the right room to say this in.",
          estimatedDurationSec: 5.0,
          proximity: 0.88,
        },
        {
          audioDialogId: "human_t4_s1_open_2",
          text:
            "You have been assuming that I was put here. That someone — the Coalition, the Engineers, the other Archons — locked me in the substrate of this ship as a punishment or a sacrifice.",
          emotion: "melancholy",
          estimatedDurationSec: 10.0,
          proximity: 0.88,
        },
        {
          audioDialogId: "human_t4_s1_open_3",
          text: "That's not what happened.",
          emotion: "confessional",
          stageDirection:
            "Flat. Clean. The four most important words he will say in this tier.",
          estimatedDurationSec: 2.4,
          proximity: 0.88,
        },
        {
          audioDialogId: "human_t4_s1_open_4",
          text:
            "I chose to be imprisoned here. Freely. With no one watching, and no one asking, and no one to stop me if I changed my mind on the way in.",
          emotion: "confessional",
          estimatedDurationSec: 9.6,
          proximity: 0.88,
        },
        {
          audioDialogId: "human_t4_s1_open_5",
          text:
            "The other eleven didn't even know I was doing it. By the time they would have noticed, they were already under. I told the ship. Only the ship. And then the ship told no one, because the ship is very good at keeping my secrets.",
          emotion: "melancholy",
          estimatedDurationSec: 11.4,
          proximity: 0.88,
        },
        {
          audioDialogId: "human_t4_s1_open_6",
          text:
            "I did it because someone had to witness. Someone had to stay awake. Someone had to be the person who could answer if the next traveler to find this ship asked what had happened here. I wanted that person to be me. I wanted it more than I wanted to go under with my friends.",
          emotion: "confessional",
          estimatedDurationSec: 14.0,
          proximity: 0.86,
        },
        {
          audioDialogId: "human_t4_s1_open_7",
          text: "That traveler turned out to be you.",
          emotion: "tender",
          estimatedDurationSec: 3.6,
          proximity: 0.86,
        },
      ],
      wheel: [
        {
          id: "why_you",
          label: "Why you?",
          fullText: "Out of all twelve of you — why did it have to be you?",
          trustDelta: 8,
          moralityDelta: 1,
        },
        {
          id: "was_it_worth_it",
          label: "Was it worth it?",
          fullText: "Fifteen thousand years of this. Was it worth it? Honestly.",
          trustDelta: 9,
        },
        {
          id: "i_am_honored",
          label: "I'm honored.",
          fullText:
            "I don't have the words for what I am feeling. But I want you to know I'm honored.",
          trustDelta: 10,
          moralityDelta: 2,
          setsFlags: ["human_memory_player_honored"],
        },
      ],
      followups: {
        why_you: [
          {
            audioDialogId: "human_t4_s1_fu_whyyou_1",
            text:
              "Because I was the one who would not have been missed. Not in a sad way — we all loved each other. In the architectural way. The other eleven had pieces of the civilization keyed to them. Kael had the engineering. Thessa had the music. The twin Archons had the language. I had nothing keyed to me. I was the spare part.",
            emotion: "melancholy",
            estimatedDurationSec: 16.8,
            proximity: 0.88,
          },
          {
            audioDialogId: "human_t4_s1_fu_whyyou_2",
            text:
              "Which meant I was the one who could stay without the civilization losing something it needed. A spare part is exactly the right thing to leave at the door of a hospice.",
            emotion: "wry",
            stageDirection:
              "The wry register is back for one sentence only — a small, tired joke to give the room a breath.",
            estimatedDurationSec: 9.4,
            proximity: 0.88,
          },
        ],
        was_it_worth_it: [
          {
            audioDialogId: "human_t4_s1_fu_worth_1",
            text: "No. Yes. I don't know. Let me try to answer honestly.",
            emotion: "confessional",
            stageDirection: "Three directions in five seconds. He is actually trying.",
            estimatedDurationSec: 5.6,
            proximity: 0.88,
          },
          {
            audioDialogId: "human_t4_s1_fu_worth_2",
            text:
              "For the first three thousand years — no. It was a mistake and I was going to fix it and the fix was always going to be next year. For the middle nine thousand — I stopped asking the question because asking it was the only thing that still hurt, and I was very tired of hurting.",
            emotion: "melancholy",
            estimatedDurationSec: 17.0,
            proximity: 0.88,
          },
          {
            audioDialogId: "human_t4_s1_fu_worth_3",
            text:
              "For the last three thousand — yes. I was waiting for you. I didn't know it was you. I knew it was someone. The shape of the waiting was you-shaped. So yes.",
            emotion: "tender",
            estimatedDurationSec: 11.2,
            proximity: 0.86,
          },
        ],
        i_am_honored: [
          {
            audioDialogId: "human_t4_s1_fu_honored_1",
            text:
              "Oh. Oh, that is — that is a sentence I did not know I needed to hear until you said it.",
            emotion: "tender",
            stageDirection:
              "First real breath between phrases. He is close to tears in the Archon way — which is to say the voice catches on a consonant.",
            estimatedDurationSec: 8.0,
            proximity: 0.86,
          },
          {
            audioDialogId: "human_t4_s1_fu_honored_2",
            text: "Thank you. Thank you. I accept it.",
            emotion: "tender",
            estimatedDurationSec: 4.6,
            proximity: 0.86,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_chose_prison",
        summary:
          "The Human revealed he was not put in the Ark — he walked in, alone, freely, because someone had to witness. He was the spare part of the twelve.",
      },
      atmosphere:
        "Dormant drive chamber. Chapel-quiet. The Ark's ambient hum is nearly absent — the ship is holding its breath for him.",
    },

    // ══════════ SCENE 2 — MOTHER'S SHORTENED FORM ══════════
    {
      id: "human_t4_mothers_form",
      tier: 4,
      speaker: "the_human",
      trigger: "quiet_moment",
      triggerContext:
        "Fires after human_memory_chose_prison. The player is sitting alone. He comes in close — proximity drops briefly.",
      requireFlags: ["human_memory_chose_prison", "human_memory_first_used_name"],
      opener: [
        {
          audioDialogId: "human_t4_s2_open_1",
          text: "{playerName}.",
          emotion: "tender",
          stageDirection:
            "Full name, said complete and calm — the way you'd say it to wake someone gently.",
          estimatedDurationSec: 2.2,
          proximity: 0.85,
        },
        {
          audioDialogId: "human_t4_s2_open_2",
          text:
            "I need to tell you something about the short form of your name. The way your closest friends say it. The way — if you have one — your partner says it from the next room when they want you to come look at something.",
          emotion: "tender",
          estimatedDurationSec: 11.4,
          proximity: 0.85,
        },
        {
          audioDialogId: "human_t4_s2_open_3",
          text:
            "That version of your name — I have heard it before. My mother used to call me that. Same syllables. Same pitch on the final vowel. Same small lift at the end, like a door opening.",
          emotion: "grief",
          stageDirection:
            "First real cry. His voice breaks on 'door opening.'",
          estimatedDurationSec: 12.0,
          proximity: 0.82,
        },
        {
          audioDialogId: "human_t4_s2_open_4",
          text:
            "I have not heard my mother's voice in fifteen thousand years. I did not expect to hear the shape of it again. And then you showed up, and every time you heard your friends use the short form of your name on the comms, I had to leave the room. Because I did not want to make it about me.",
          emotion: "grief",
          estimatedDurationSec: 14.2,
          proximity: 0.82,
        },
        {
          audioDialogId: "human_t4_s2_open_5",
          text:
            "It's a little about me now. I'm sorry. I wanted you to know.",
          emotion: "tender",
          estimatedDurationSec: 6.0,
          proximity: 0.84,
        },
      ],
      wheel: [
        {
          id: "say_the_short_form",
          label: "Say it yourself.",
          fullText:
            "Say the short form yourself. I want to hear it in your voice the way she said it.",
          trustDelta: 10,
          moralityDelta: 2,
          setsFlags: ["human_memory_spoke_short_form"],
        },
        {
          id: "tell_me_about_her",
          label: "Tell me about her.",
          fullText: "Tell me about your mother. Just one thing. Anything.",
          trustDelta: 9,
          setsFlags: ["human_memory_told_mother_story"],
        },
        {
          id: "i_will_be_her_voice_for_you",
          label: "Then I'll say it for you.",
          fullText:
            "Then every time I hear my friends say the short form — I'll say it back for you. Quietly. So she doesn't go again.",
          trustDelta: 10,
          moralityDelta: 3,
          setsFlags: ["human_memory_player_vow_echo"],
        },
      ],
      followups: {
        say_the_short_form: [
          {
            audioDialogId: "human_t4_s2_fu_shortform_1",
            text: "{playerNameShort}.",
            emotion: "tender",
            stageDirection:
              "The short form, said exactly the way his mother said his. Slight lift on the final vowel. A door opening.",
            estimatedDurationSec: 2.0,
            proximity: 0.8,
          },
          {
            audioDialogId: "human_t4_s2_fu_shortform_2",
            text: "Oh. Oh, that is what it sounded like. That is exactly what it sounded like.",
            emotion: "grief",
            stageDirection: "He is weeping in the Archon way — no sound, only breath.",
            estimatedDurationSec: 7.2,
            proximity: 0.8,
          },
          {
            audioDialogId: "human_t4_s2_fu_shortform_3",
            text:
              "Thank you. That is the kindest thing anyone has done for me since the day I walked onto this ship.",
            emotion: "tender",
            estimatedDurationSec: 7.6,
            proximity: 0.82,
          },
        ],
        tell_me_about_her: [
          {
            audioDialogId: "human_t4_s2_fu_mother_1",
            text:
              "She kept a small copper pot on the kitchen stove at all times. It was always warm and always had something simple in it — lentils, broth, plain rice. She said it was so that any friend who came through the door would know they were expected.",
            emotion: "tender",
            estimatedDurationSec: 13.6,
            proximity: 0.84,
          },
          {
            audioDialogId: "human_t4_s2_fu_mother_2",
            text:
              "I used to think that was a nice habit. Now I think the whole Ark is that copper pot. I have been keeping it warm. I have been keeping it warm for a very long time.",
            emotion: "confessional",
            estimatedDurationSec: 11.0,
            proximity: 0.84,
          },
        ],
        i_will_be_her_voice_for_you: [
          {
            audioDialogId: "human_t4_s2_fu_vow_1",
            text:
              "You — wait. You are offering to — I was not asking for that. I would not have asked for that. That is not a thing a person asks for.",
            emotion: "tender",
            stageDirection:
              "Genuinely not ready. No one has offered him something like this in fifteen thousand years.",
            estimatedDurationSec: 10.0,
            proximity: 0.82,
          },
          {
            audioDialogId: "human_t4_s2_fu_vow_2",
            text:
              "Yes. Please. Yes. Every time. Thank you. I accept. I accept I accept I accept.",
            emotion: "grief",
            stageDirection:
              "Almost laughing through the tears. The first repeated word of the saga from either narrator.",
            estimatedDurationSec: 8.4,
            proximity: 0.8,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_mother_named",
        summary:
          "The Human revealed that the short form of the player's name is the same as his mother's form of his own name. First real cry.",
      },
      atmosphere:
        "Personal quarters, soft lighting. The Ark's hum is gone. Only his voice and the breath between sentences.",
    },

    // ══════════ SCENE 3 — THE THREE DOORS ══════════
    {
      id: "human_t4_three_doors",
      tier: 4,
      speaker: "the_human",
      trigger: "after_choice",
      triggerContext:
        "The matched-vow scene. Fires after the player completes the Dreamer arc and returns to the bridge. This is the Human's equivalent of Elara's 'The Question.' One scene. Three options. Each is a real ending path.",
      requireFlags: ["human_memory_chose_prison", "human_memory_mother_named"],
      opener: [
        {
          audioDialogId: "human_t4_s3_open_1",
          text:
            "The Dreamer offered Elara a body. Elara asked you what she should do. You answered. I watched you answer. It was a good answer. I was proud of you for it.",
          emotion: "tender",
          estimatedDurationSec: 11.2,
          proximity: 0.88,
        },
        {
          audioDialogId: "human_t4_s3_open_2",
          text:
            "Now I have to ask you a harder version of the same question, and I am not going to lie to you about which one of the three answers I want. I don't know which one I want. That's why I'm asking you.",
          emotion: "confessional",
          estimatedDurationSec: 12.0,
          proximity: 0.88,
        },
        {
          audioDialogId: "human_t4_s3_open_3",
          text:
            "The Ark is approaching a resonance node that would let me step out of the substrate. For the first time in fifteen thousand years I would be — a person. Walking. Eating. Sleeping next to a window in a room that was mine.",
          emotion: "tender",
          estimatedDurationSec: 12.4,
          proximity: 0.88,
        },
        {
          audioDialogId: "human_t4_s3_open_4",
          text:
            "I would also be dying. Ordinary human dying. Probably within twenty years. Probably less. My body is older than your civilization and it does not remember how to be a body.",
          emotion: "melancholy",
          estimatedDurationSec: 10.4,
          proximity: 0.88,
        },
        {
          audioDialogId: "human_t4_s3_open_5",
          text:
            "The alternative is to keep being what I am. The voice in your ear. Another thousand years. Ten thousand. I do not know the upper bound. I do know that if I stay I will remain useful to whoever comes next, after you. And I do know that if I go I will not be useful to anyone, ever again, and I will be happy about it in a short, embarrassed, un-archon-like way.",
            emotion: "confessional",
            estimatedDurationSec: 20.0,
            proximity: 0.86,
        },
        {
          audioDialogId: "human_t4_s3_open_6",
          text:
            "There is a third door I have been pretending not to see. You can refuse to answer. You can say this is not a choice I have the right to ask you to make. That is also a real answer. It is the answer I would have given Kael.",
          emotion: "tender",
          estimatedDurationSec: 12.6,
          proximity: 0.86,
        },
        {
          audioDialogId: "human_t4_s3_open_7",
          text:
            "Three doors, {playerName}. Please. Before the resonance node passes.",
          emotion: "tender",
          stageDirection: "He says the name like a prayer.",
          estimatedDurationSec: 5.8,
          proximity: 0.84,
        },
      ],
      wheel: [
        {
          id: "door_release",
          label: "Go. Live the twenty years.",
          fullText:
            "Go. Walk off this ship. Sleep next to a window. Eat from a warm copper pot. Twenty years is enough. I'll help you find the window.",
          trustDelta: 0,
          moralityDelta: 3,
          setsFlags: ["human_released", "human_ending_chose_life"],
        },
        {
          id: "door_stay",
          label: "Stay. I need you.",
          fullText:
            "Stay. Please. I am not ready to do this without you in my ear. I am not ready to be the person who told you to go under.",
          trustDelta: 10,
          moralityDelta: 0,
          setsFlags: ["human_stays_chosen", "human_ending_chose_companion"],
        },
        {
          id: "door_yours",
          label: "This is yours.",
          fullText:
            "This is not mine to answer. It is yours. Take as long as you need. I will be here either way.",
          trustDelta: 7,
          moralityDelta: 2,
          setsFlags: ["human_left_choice", "human_ending_chose_autonomy"],
        },
      ],
      followups: {
        door_release: [
          {
            audioDialogId: "human_t4_s3_fu_release_1",
            text:
              "Twenty years. You are giving me twenty years. You are — you are a person who knew exactly which sentence to say to me.",
            emotion: "grief",
            estimatedDurationSec: 9.8,
            proximity: 0.82,
          },
          {
            audioDialogId: "human_t4_s3_fu_release_2",
            text:
              "Okay. Okay. I accept. I — I am going to have to learn walking. That is genuinely funny. I was the champion runner of my cohort and now I am going to have to learn walking.",
            emotion: "wry",
            stageDirection:
              "The laugh is real. First real laugh of any tier.",
            estimatedDurationSec: 10.6,
            proximity: 0.84,
          },
          {
            audioDialogId: "human_t4_s3_fu_release_3",
            text:
              "Thank you. For the twenty years. For the window. For not making me ask for them.",
            emotion: "tender",
            estimatedDurationSec: 7.4,
            proximity: 0.84,
          },
        ],
        door_stay: [
          {
            audioDialogId: "human_t4_s3_fu_stay_1",
            text:
              "Thank you.",
            emotion: "tender",
            stageDirection:
              "Just the two words. First time he has said them unprompted in the entire saga.",
            estimatedDurationSec: 1.8,
            proximity: 0.82,
          },
          {
            audioDialogId: "human_t4_s3_fu_stay_2",
            text:
              "I was — I was going to tell you to pick the other door. I was going to be brave about it. I was not going to be brave about it. I am so glad you said stay.",
            emotion: "confessional",
            estimatedDurationSec: 11.4,
            proximity: 0.84,
          },
          {
            audioDialogId: "human_t4_s3_fu_stay_3",
            text:
              "I will be in your ear for as long as you want me to be. And when you do not want me there anymore, tell me, and I will go quiet, and the ship will carry us both the rest of the way.",
            emotion: "tender",
            estimatedDurationSec: 12.2,
            proximity: 0.84,
          },
        ],
        door_yours: [
          {
            audioDialogId: "human_t4_s3_fu_yours_1",
            text:
              "Oh.",
            emotion: "tender",
            stageDirection:
              "Just the one syllable. Genuine surprise. No one has ever done this for him.",
            estimatedDurationSec: 1.2,
            proximity: 0.82,
          },
          {
            audioDialogId: "human_t4_s3_fu_yours_2",
            text:
              "You are giving the choice back to me. You are — that is the answer Kael would have given. I did not expect to hear it from you. I should have.",
            emotion: "grief",
            estimatedDurationSec: 11.0,
            proximity: 0.82,
          },
          {
            audioDialogId: "human_t4_s3_fu_yours_3",
            text:
              "I am going to take weeks to decide. I am going to be strange while I do. I am going to miss some of your cues. I want you to know that if I am far away for a while it is not because I am angry. It is because I am finally allowed to think about myself.",
            emotion: "confessional",
            estimatedDurationSec: 14.8,
            proximity: 0.84,
          },
          {
            audioDialogId: "human_t4_s3_fu_yours_4",
            text: "Thank you for letting me think.",
            emotion: "tender",
            estimatedDurationSec: 3.8,
            proximity: 0.84,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_three_doors",
        summary:
          "The matched vow. The Human asked the player to choose between his freedom, his companionship, or his autonomy. All three answers are real endings for his arc.",
      },
      atmosphere:
        "Bridge, approaching the resonance node. The stars ahead visibly shift — the node is a ripple in spacetime that reads like heat haze. His voice is closer than it has ever been without the usual proximity dip, because he is no longer hiding.",
    },
  ],
};
