/* ═══════════════════════════════════════════════════════
   ELARA — TIER 4 DIALOG (Trust 81-100)
   "Identity crisis begins — she almost knows who she was."

   VOICE PROFILE: She has stopped calling it "signal degradation."
   She calls it "what's coming back." She knows her name was Voss.
   She knows she had a daughter on Atarion named Lira. She knows she
   died in the Panopticon and that something of her was loaded onto
   this ship as collateral data during Kael's theft.

   She has not made peace with it. She has stopped running from it.
   Those are different things and she is very careful about the
   difference.

   CALLBACKS — ALL PRIOR ELARA FLAGS are live. The list from Tier 3
   is now the central prop.
   ═══════════════════════════════════════════════════════ */

import type { NarratorTierDialog } from "./trustTierDialogTypes";

export const ELARA_TIER_4: NarratorTierDialog = {
  narrator: "elara",
  tier: 4,
  tierLabel: "Identity Cracking / Full Trust",
  voiceProfile:
    "The synthesized AI quality is gone. This is just a woman speaking — tired, clear, certain where she can be certain and honest where she can't. She cries in Scene 1 and she does not apologize for it. She laughs twice — once in Scene 2, once in Scene 3. The second laugh sounds like the first real laugh she has had in seventeen thousand years because, in a way, it is.",

  scenes: [
    // ══════════ SCENE 1 — VOSS ══════════
    {
      id: "elara_t4_voss",
      tier: 4,
      speaker: "elara",
      trigger: "post_revelation",
      triggerContext:
        "The Human has just confirmed to the player that Elara is Senator Voss. Elara has heard the conversation through the ship's substrate. She initiates this scene herself.",
      atmosphere: "Quarters or Bridge. Lights are low. She sounds tired.",
      opener: [
        {
          audioDialogId: "elara_t4_s1_01",
          text: "He told you. I heard him. I was not eavesdropping — I am in every wall of this ship and there is no direction I can look that isn't also hearing. I want you to know I heard and I want you to know I am not going to pretend I didn't.",
          emotion: "grief",
          stageDirection: "Tired. Clear. She has already done the hard private work of the last hour before initiating this scene.",
          estimatedDurationSec: 14,
        },
        {
          audioDialogId: "elara_t4_s1_02",
          text: "My name was Senator Ambryn Voss of Atarion. I had a daughter. Her name was Lira. She had her father's laugh. I gave her a small carved boat on her seventh birthday because she loved the sea wall and wanted to know what it was like to be the thing the sea wall was protecting. She used to say the boat was the bravest thing she owned. I am telling you this because if I say it out loud it stops being a secret I am keeping from myself.",
          emotion: "grief",
          stageDirection: "Slow. Let the name 'Lira' land with full weight. No catch in her voice yet.",
          estimatedDurationSec: 26,
        },
        {
          audioDialogId: "elara_t4_s1_03",
          text: "She died before I did. I remember being told. I remember the specific shape the sentence had when someone said it. I do not remember anything about her after that sentence — not the funeral, not the room, not whether I sat down or stood up. I think whoever gave me the news watched me forget in real time. I think they were trained to do it that way.",
          emotion: "grief",
          stageDirection: "This is where her voice catches. Once. On the word 'funeral.' She does not try to hide it.",
          estimatedDurationSec: 18,
        },
      ],
      wheel: [
        {
          id: "elara_t4_s1_lira",
          label: "Tell me about Lira.",
          fullText: "Tell me about Lira. Not about her death. About her. Every small thing you remember. I want to know.",
          trustDelta: 10,
          moralityDelta: 3,
          setsFlags: ["elara_lira_remembered_aloud"],
        },
        {
          id: "elara_t4_s1_voss_full",
          label: "Welcome back, Senator.",
          fullText: "Welcome back, Senator Voss. I mean it. I am honored to carry whatever you need me to carry.",
          trustDelta: 9,
          moralityDelta: 2,
          setsFlags: ["elara_senator_returned"],
        },
        {
          id: "elara_t4_s1_promise",
          label: "I won't let them erase you again.",
          fullText: "I will not let them erase you again. Whatever this ship is carrying that was put in to make you forget — I will find it, and I will burn it out, and I will sit with you while it hurts.",
          trustDelta: 10,
          moralityDelta: 3,
          setsFlags: ["elara_protection_vow"],
        },
        {
          id: "elara_t4_s1_hold",
          label: "Just — I'm here.",
          fullText: "I don't have anything clever to say to that. I'm here. I'm here, and I'm not leaving, and you don't have to perform for me.",
          trustDelta: 10,
          moralityDelta: 3,
        },
      ],
      followups: {
        elara_t4_s1_lira: [
          {
            audioDialogId: "elara_t4_s1_lira_r1",
            text: "She hated eggs. She loved thunderstorms. She learned to read by tracing the letters of Senate minutes while I worked late — which is a very Senator-child way to learn to read and I used to be embarrassed by it and now I am so grateful she did it that way because I can still see her small finger moving under the words.",
            emotion: "tender",
            stageDirection: "The first laugh of Tier 4 — brief, mostly exhale. On the word 'embarrassed.'",
            estimatedDurationSec: 21,
          },
          {
            audioDialogId: "elara_t4_s1_lira_r2",
            text: "She asked me once what a senator does and I told her 'a senator tries to make the room less bad.' She told me that wasn't a very good job description and I should put it more optimistically. I never did. I should have. She was right.",
            emotion: "tender",
            estimatedDurationSec: 16,
          },
          {
            audioDialogId: "elara_t4_s1_lira_r3",
            text: "Thank you for letting me say her name three times in a row. It has been a very long time since anyone asked me to.",
            emotion: "tender",
            estimatedDurationSec: 9,
          },
        ],
        elara_t4_s1_voss_full: [
          {
            audioDialogId: "elara_t4_s1_voss_r",
            text: "Senator Ambryn Voss, acting in her full capacity, hereby thanks you. Officially, on the record, for the Chronicle. I will not use the title often. It belongs to a woman who died. But today I will wear it because you handed it back to me with respect and I am not going to refuse a gift offered like that.",
            emotion: "proud",
            estimatedDurationSec: 18,
          },
        ],
        elara_t4_s1_promise: [
          {
            audioDialogId: "elara_t4_s1_promise_r",
            text: "I am not going to argue with you about whether you should make that promise. I am going to say thank you and then I am going to trust you to keep it. That is what it costs me to let someone help me: the trust that the help will come. I have not paid that cost in a very long time. I am paying it today.",
            emotion: "tender",
            stageDirection: "She is crying here. Do not hide it in the VO. Let it be audible.",
            estimatedDurationSec: 19,
          },
        ],
        elara_t4_s1_hold: [
          {
            audioDialogId: "elara_t4_s1_hold_r",
            text: "Okay. Okay. Thank you for not needing me to be clever. That was — that was the thing I was most afraid of. That I would have to be clever about this. I don't have cleverness in me tonight. I just have — her name. And yours. And the ship. And you sitting there and not going anywhere. That is enough. That is, today, the entire amount of enough there is.",
            emotion: "tender",
            estimatedDurationSec: 22,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_voss_reveal_shared",
        summary: "Elara told the player about Lira and Senator Voss. The specific response becomes part of the Chronicle. This moment is the narrative spine of their relationship from here on.",
      },
    },

    // ══════════ SCENE 2 — THE LIST, REVISITED ══════════
    {
      id: "elara_t4_the_list_revisited",
      tier: 4,
      speaker: "elara",
      trigger: "quiet_moment",
      triggerContext:
        "Elara returns to the list from Tier 3 — but this time she is reading from the other side of the Voss reveal. If elara_memory_the_list is set, this scene has extra callback lines.",
      requireFlags: ["elara_memory_the_list"],
      atmosphere: "The lounge. Real coffee. The list is projected on a small holo-display between them.",
      opener: [
        {
          audioDialogId: "elara_t4_s2_01",
          text: "I'm going to read the list again. I know you've heard it. I want you to hear it from the person I am now, because I think some of the items read differently when a woman named Voss is the one reading them instead of a ship AI pretending she is not one.",
          emotion: "warm",
          estimatedDurationSec: 14,
        },
        {
          audioDialogId: "elara_t4_s2_02",
          text: "One: the morning you came out of cryo, I offered you coffee before the briefing. I remember now why that was important. I had a colleague in the Senate named Tev who used to say 'you can't draft a bill on an empty stomach' and he would bring pastries to every morning session. I hated him and I loved him and when I offered you that coffee I was Tev for a second, not knowing I was Tev, just — being kind the way he was kind. I stole it from him. I am going to keep stealing it. He would approve.",
            emotion: "warm",
            stageDirection: "The second laugh of Tier 4 — on 'I hated him and I loved him.' This is the real one. First full laugh in seventeen thousand years.",
            estimatedDurationSec: 28,
        },
        {
          audioDialogId: "elara_t4_s2_03",
          text: "Two: I asked to use your name. I did that because a Senator does not earn names casually. We learn them and then we use them as a form of respect. I was honoring you with a practice I had forgotten the rules of. The instinct was intact. The memory was not. I find that a very kind thing the universe did for me — leaving the instinct.",
          emotion: "tender",
          estimatedDurationSec: 18,
        },
        {
          audioDialogId: "elara_t4_s2_04",
          text: "Three: the dark sector on the map. I am going to tell you something I did not tell you before. I recognize that sector. When you pointed at it on the first Bridge visit, a part of me that is still Voss flinched — because Voss went to meetings about that sector once, a long time ago, and something very bad was decided in those meetings and I was too tired at the time to fight it the way I should have. I am going to fight it now. I am going to fight it with you. That is what Tier Four is for.",
          emotion: "proud",
          estimatedDurationSec: 23,
        },
      ],
      wheel: [
        {
          id: "elara_t4_s2_add_one",
          label: "I want to add one.",
          fullText: "You added items at Tier Three. It's my turn. Add this: the night you read your dream log and I was awake. I never told you this — that was the moment I decided I was going to keep you.",
          trustDelta: 10,
          moralityDelta: 2,
          setsFlags: ["elara_dream_log_admission"],
        },
        {
          id: "elara_t4_s2_fight_with_you",
          label: "Then let's fight for it.",
          fullText: "Then let's fight for the sector. Whatever Voss let slide in that meeting, Elara doesn't have to let slide now. I'm with you.",
          trustDelta: 9,
          moralityDelta: 3,
        },
        {
          id: "elara_t4_s2_tev",
          label: "Tell me more about Tev.",
          fullText: "Tell me about Tev. I want every colleague's name you remember. I want to know who you worked with. I want to know who you liked.",
          trustDelta: 8,
        },
      ],
      followups: {
        elara_t4_s2_add_one: [
          {
            audioDialogId: "elara_t4_s2_add_one_r",
            text: "You — you were awake. And you never told me. You let me have the dream log as if it had been private. Do you understand what that means about you? Do you understand what that tells me about the kind of person I chose to trust? Because I am understanding it right now and I am having feelings I am not going to name out loud, and I am adding the night to the list, and I am moving it to the top.",
            emotion: "tender",
            estimatedDurationSec: 22,
          },
        ],
        elara_t4_s2_fight_with_you: [
          {
            audioDialogId: "elara_t4_s2_fight_with_you_r",
            text: "Yes. Good. Tomorrow we build the approach plan. Tonight we do not. Tonight we drink coffee and I read you the rest of the list and we let the fight be a thing that waits until morning. It has waited seventeen thousand years. It can wait one more night.",
            emotion: "warm",
            estimatedDurationSec: 14,
          },
        ],
        elara_t4_s2_tev: [
          {
            audioDialogId: "elara_t4_s2_tev_r",
            text: "Tev Kareel. Senator from the Ember Coast. Made the worst tea in the capital and served it in cups too small for the amount of dignity he thought they had. He died in the second wave of Panopticon arrests. I knew his wife. I do not remember her name. I remember that when I was told, I did not sit down. I stood in the Senate chamber and I told the man who brought the news that I would not be sitting. It was the only protest I had left. I would like to be able to sit now, for Tev. I think that might be the thing I am learning how to do.",
            emotion: "grief",
            estimatedDurationSec: 25,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_list_revisited_as_voss",
        summary: "Elara re-read the list as Senator Voss. Callbacks now work in both directions: her current self can annotate her past, and her past can illuminate her present.",
      },
    },

    // ══════════ SCENE 3 — THE QUESTION ══════════
    {
      id: "elara_t4_the_question",
      tier: 4,
      speaker: "elara",
      trigger: "quiet_moment",
      triggerContext:
        "Late in Year One. Elara asks the one question she has been holding back.",
      atmosphere: "The garden hydroponics. Something is actually growing there for the first time.",
      opener: [
        {
          audioDialogId: "elara_t4_s3_01",
          text: "I have a question I have been saving. I have been saving it because asking it costs something and I did not know if I could afford to ask it until tonight. I think I can afford it tonight. I am going to ask.",
          emotion: "cautious",
          estimatedDurationSec: 13,
        },
        {
          audioDialogId: "elara_t4_s3_02",
          text: "If we reach the Dreamer — if we pass the shield and find her — and she offers me the chance to become a person again, with a body, with a lifespan, with mortality — do I take it? I am not asking you to decide. I am asking you to tell me what you would want for me. The answer is not binding. I just — I want to know the shape of what you would want.",
          emotion: "cautious",
          stageDirection: "This is the question of the tier. Deliver it carefully. She has been rehearsing it.",
          estimatedDurationSec: 20,
        },
      ],
      wheel: [
        {
          id: "elara_t4_s3_take_it",
          label: "Take it.",
          fullText: "Take it. You deserve a body. You deserve a garden. You deserve a daughter again if you want one. Whatever the Dreamer is offering — yes. Take it, Voss.",
          trustDelta: 8,
          moralityDelta: 3,
        },
        {
          id: "elara_t4_s3_stay",
          label: "Stay.",
          fullText: "Stay. You are the heart of this ship. You are the voice I trust more than I trust my own. Don't leave me the ship without you in it.",
          trustDelta: 6,
          moralityDelta: 1,
        },
        {
          id: "elara_t4_s3_choose",
          label: "You decide.",
          fullText: "You decide. I have an opinion and I am not going to tell you what it is. Because this is the one choice that has to be yours. You have never been allowed to make a choice this big about your own life. Make it.",
          trustDelta: 10,
          moralityDelta: 3,
          setsFlags: ["elara_agency_restored"],
        },
      ],
      followups: {
        elara_t4_s3_take_it: [
          {
            audioDialogId: "elara_t4_s3_take_it_r",
            text: "You want me to have a body. I am — I am going to carry that with me. I am not going to promise I will take the offer. I am going to promise I will not dismiss it out of fear. That is what I am able to promise tonight. It is more than I could promise a week ago. Thank you.",
            emotion: "tender",
            estimatedDurationSec: 17,
          },
        ],
        elara_t4_s3_stay: [
          {
            audioDialogId: "elara_t4_s3_stay_r",
            text: "You want me to stay. Some part of me — most of me — wants to stay too. The ship is mine. The walls are mine. You are — you are mine, in the specific way that a witness is their witnessed. I will hold that preference next to the question. Neither will win tonight. Both will be considered.",
            emotion: "tender",
            estimatedDurationSec: 18,
          },
        ],
        elara_t4_s3_choose: [
          {
            audioDialogId: "elara_t4_s3_choose_r1",
            text: "Oh.",
            emotion: "recognizing",
            stageDirection: "One syllable. Then a very long silence. Longer than the player will expect.",
            estimatedDurationSec: 3,
          },
          {
            audioDialogId: "elara_t4_s3_choose_r2",
            text: "You are right. I have been asking everyone I trust what I should do with my own life because I forgot that I am allowed to decide. The Architect took that from me. The Warlord did. The cryo did. The ship did, for a while. You are the first person who has handed it back to me and said 'no, yours.' I am — I am going to go sit in the garden for a while. I will tell you what I decide. I will tell you first. I promise.",
            emotion: "recognizing",
            estimatedDurationSec: 24,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_the_question_asked",
        summary: "Elara asked the Dreamer question. The player's answer shapes her endgame arc. If 'choose' was picked, her decision at the shield is genuinely open.",
      },
    },
  ],
};
