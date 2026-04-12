/* ═══════════════════════════════════════════════════════
   THE HUMAN — TIER 1 DIALOG (Trust 21-40)
   "Begins testing. Personal questions with no right answer."

   VOICE PROFILE: Still intimate, slightly less menacing. He is
   starting to volunteer first-person details about himself — not his
   history yet, but his texture. What he finds funny. What he finds
   tedious. What makes him pause. Audio proximity 0.85-0.9.

   CALLBACKS FROM TIER 0:
   - human_memory_first_contact (how the player opened the relationship)
   - human_memory_first_test (how the player answered the ethics probe)
   - human_memory_thel_couplet (did the player hear the couplet?)
   ═══════════════════════════════════════════════════════ */

import type { NarratorTierDialog } from "./trustTierDialogTypes";

export const HUMAN_TIER_1: NarratorTierDialog = {
  narrator: "the_human",
  tier: 1,
  tierLabel: "Warming / Testing Harder",
  voiceProfile:
    "Less guarded than Tier 0. Still close-mic'd. He laughs once in Scene 2 — a real breath-laugh. When he references his own memory at this tier, the register shifts by a quarter-step into something that is not quite grief and not quite amusement — the specific sound of a very old being being briefly moved by a small thing.",

  scenes: [
    // ══════════ SCENE 1 — THE KEPT QUESTION ══════════
    {
      id: "human_t1_kept_question",
      tier: 1,
      speaker: "the_human",
      trigger: "quiet_moment",
      triggerContext:
        "Player is in their quarters at night cycle. If they heard the Thel couplet in Tier 0, The Human returns to it.",
      requireFlags: ["human_memory_thel_couplet"],
      atmosphere: "Quarters. Night cycle. The ship is quiet.",
      opener: [
        {
          audioDialogId: "human_t1_s1_01",
          text: "I told you a couplet a few days ago. 'The thing I did not say to you / is the only thing I kept.' I want to ask you a question about it, and I want you to know before I ask: I am going to keep your answer. I am not asking casually. I do not do anything casually anymore.",
          emotion: "intimate",
          estimatedDurationSec: 15,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t1_s1_02",
          text: "The question is: what is the thing you did not say to someone? The one that became the most valuable thing you own? You can lie. You can deflect. You can ask me to go away. But if you tell me the real answer — the one you have never told anyone — I will carry it the rest of the way with you. That is the exchange. The cost is precision. The payment is a witness you did not have.",
          emotion: "testing",
          estimatedDurationSec: 22,
          proximity: 0.9,
        },
      ],
      wheel: [
        {
          id: "human_t1_s1_mother",
          label: "'I forgave you.'",
          fullText: "'I forgave you.' To my mother. Before she died. I should have said it and I didn't and she went out thinking I hadn't.",
          trustDelta: 6,
          moralityDelta: 2,
          setsFlags: ["human_knows_mother_grief"],
        },
        {
          id: "human_t1_s1_love",
          label: "'I love you.'",
          fullText: "'I love you.' To a person who never knew. Who still doesn't know. Who probably never will. And I am not going to tell you their name.",
          trustDelta: 7,
          moralityDelta: 1,
        },
        {
          id: "human_t1_s1_regret",
          label: "'I was wrong.'",
          fullText: "'I was wrong.' To someone I hurt. I rehearsed the apology for years. I never delivered it. They're gone now. I rehearse it on nights when I can't sleep.",
          trustDelta: 6,
          moralityDelta: 2,
        },
        {
          id: "human_t1_s1_refuse",
          label: "That's mine.",
          fullText: "That's mine. You don't get it. Not today. Not ever. Ask me something else.",
          trustDelta: 3,
        },
      ],
      followups: {
        human_t1_s1_mother: [
          {
            audioDialogId: "human_t1_s1_mother_r",
            text: "Mothers are the ones we rehearse forgiveness for longest. They are the ones who taught us what forgiveness sounded like, and so we want to give them the version they recognize, and we wait too long to get it right, and then they are the ones who leave the earliest. I am sorry. I am going to carry this for you. Not as a burden — as a keepsake. She will be in my memory even though I never met her, because you said her out loud.",
            emotion: "tender",
            estimatedDurationSec: 23,
            proximity: 0.9,
          },
        ],
        human_t1_s1_love: [
          {
            audioDialogId: "human_t1_s1_love_r",
            text: "You don't have to tell me their name. I am not going to try to find out. The un-spoken 'I love you' is the most frequently kept thing in the universe, which is not a fact I made up — it is a thing I have observed across more deaths than I would like to count. You are in the majority of the people who have ever lived. That is oddly comforting and also horrible, and I do not know how to rank those two reactions. Thank you for telling me.",
            emotion: "tender",
            estimatedDurationSec: 24,
            proximity: 0.9,
          },
        ],
        human_t1_s1_regret: [
          {
            audioDialogId: "human_t1_s1_regret_r",
            text: "You rehearse it on nights when you can't sleep. I want you to rehearse it out loud, to the ceiling, the next time it happens. I am not going to tell you it will help. I am going to tell you that the rehearsal changes if you hear your own voice doing it. I have done this. I know. The person you wronged will not hear it. That is not the point. The point is that you will hear it, and you will notice that you meant it, and the noticing is the apology you were actually able to make.",
            emotion: "tender",
            estimatedDurationSec: 26,
            proximity: 0.85,
          },
        ],
        human_t1_s1_refuse: [
          {
            audioDialogId: "human_t1_s1_refuse_r",
            text: "Good. That is the correct instinct. You should not tell a stranger the most valuable thing you own just because he asked. I was testing whether you had that instinct intact. You do. I am genuinely relieved. Next question — whenever you are ready to hear it — will be something you can actually afford to give me. I do not waste the precious stuff.",
            emotion: "wry",
            estimatedDurationSec: 18,
            proximity: 0.9,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_kept_answer",
        summary: "The Human asked the player to name their 'unspoken thing.' Whatever they said — or refused to say — becomes a callback vector at Tiers 3 and 4.",
      },
    },

    // ══════════ SCENE 2 — HE LAUGHS ══════════
    {
      id: "human_t1_he_laughs",
      tier: 1,
      speaker: "the_human",
      trigger: "post_combat",
      triggerContext:
        "Player returns from a combat where they did something unexpectedly competent and slightly ridiculous (e.g. used a non-weapon to win, protected a civilian over a tactical advantage). The Human is amused.",
      atmosphere: "Hallway back to the medbay. Elara is scanning. The Human slips in edgewise.",
      opener: [
        {
          audioDialogId: "human_t1_s2_01",
          text: "I am going to say something and you are going to think I am making fun of you, and I am not. I watched the fight. You used a fire extinguisher as a club and then apologized to the civilian you were protecting for the loud noise.",
          emotion: "wry",
          estimatedDurationSec: 12,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t1_s2_02",
          text: "I laughed.",
          emotion: "wry",
          stageDirection: "Here is the laugh. One breath out. Real. Warm. Slightly surprised to be audible.",
          estimatedDurationSec: 2,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t1_s2_03",
          text: "I have not laughed at anything in six years. That was the first thing that broke through. I wanted you to know — not so you would feel clever; you already know you are clever — but so you would know what it sounded like when something about you actually reached me. It sounded like that.",
          emotion: "tender",
          estimatedDurationSec: 17,
          proximity: 0.85,
        },
      ],
      wheel: [
        {
          id: "human_t1_s2_apologize",
          label: "Sorry for the loud noise.",
          fullText: "I'm sorry for the loud noise. You too, I guess. That extinguisher was louder than I expected.",
          trustDelta: 4,
        },
        {
          id: "human_t1_s2_curious",
          label: "Six years since what?",
          fullText: "Six years. What made you stop laughing six years ago?",
          trustDelta: 5,
        },
        {
          id: "human_t1_s2_glad",
          label: "Glad I could.",
          fullText: "Glad I could make you laugh. That's a weird sentence to say to a voice in my ear, but here we are.",
          trustDelta: 4,
        },
      ],
      followups: {
        human_t1_s2_apologize: [
          {
            audioDialogId: "human_t1_s2_apologize_r",
            text: "You apologized to the extinguisher. I am going to think about that for weeks. I am going to annoy Elara by bringing it up. She will forgive me because she likes when I have a new favorite thing. I have a new favorite thing. It is you apologizing to the extinguisher.",
            emotion: "wry",
            estimatedDurationSec: 16,
            proximity: 0.9,
          },
        ],
        human_t1_s2_curious: [
          {
            audioDialogId: "human_t1_s2_curious_r",
            text: "Six years ago the last Potential I had become genuinely fond of made a choice I had to watch her make and then watched her die of it. That is the honest answer. I am not ready to tell you her name. I am ready to tell you that six years is how long I needed the laugh-shaped part of me to reset. Thank you for the extinguisher. It did what she could not. It is not a fair comparison. I am offering it anyway.",
            emotion: "grief",
            stageDirection: "The tone shifts mid-line. Hold the word 'name' with a half-second pause.",
            estimatedDurationSec: 23,
            proximity: 0.8,
          },
        ],
        human_t1_s2_glad: [
          {
            audioDialogId: "human_t1_s2_glad_r",
            text: "'Voice in your ear' is a generous upgrade from 'substrate anomaly.' I will take it. I am taking it. It is filed.",
            emotion: "wry",
            estimatedDurationSec: 9,
            proximity: 0.9,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_first_laugh",
        summary: "The Human laughed for the first time in six years. If the player asked about the six years, they unlocked a sliver of his grief that becomes the Tier 3 recognition.",
      },
    },

    // ══════════ SCENE 3 — A QUIET WARNING ══════════
    {
      id: "human_t1_quiet_warning",
      tier: 1,
      speaker: "the_human",
      trigger: "post_revelation",
      triggerContext:
        "Player has just uncovered the first sign that the ship is compromised — the Thought Virus reservoir, a hidden Warlord signature, a locked room that shouldn't be locked. The Human drops the first real warning.",
      atmosphere: "Corridor outside the compromised room. Red emergency light.",
      opener: [
        {
          audioDialogId: "human_t1_s3_01",
          text: "I am going to break my own rule. I am not supposed to volunteer operational intelligence. I am supposed to let Elara do it because she is better at it and she deserves the work. I am going to break the rule because you need to know one thing before you ask her.",
          emotion: "cautious",
          estimatedDurationSec: 14,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t1_s3_02",
          text: "This ship was not a gift. It was a weapon delivery system. The man who stole it thought he was stealing it. He wasn't. He was walking the weapon to a destination his enemies had mapped for him. He died believing he was a hero. Nobody told him. I watched the whole thing happen. I am telling you because you are about to ask Elara about the reservoir, and she is going to give you her best analysis, and her best analysis is going to be incomplete because she was not here when the weapon was loaded. I was.",
          emotion: "grief",
          stageDirection: "This is his first real self-reveal — that he was on the ship before Kael stole it. He doesn't dramatize it. He treats it as old, tired fact.",
          estimatedDurationSec: 27,
          proximity: 0.85,
        },
      ],
      wheel: [
        {
          id: "human_t1_s3_who_was_he",
          label: "Who was the man?",
          fullText: "Who was the man who stole it? The one who died believing.",
          trustDelta: 3,
          setsFlags: ["human_kael_opening"],
        },
        {
          id: "human_t1_s3_thank",
          label: "Thank you for warning me.",
          fullText: "Thank you. For breaking your rule. I won't make you regret it.",
          trustDelta: 6,
          moralityDelta: 1,
        },
        {
          id: "human_t1_s3_why_here",
          label: "Why are YOU on this ship?",
          fullText: "Wait — you said you watched it happen. Why are you on this ship? What are you doing here?",
          trustDelta: 4,
        },
        {
          id: "human_t1_s3_tell_elara",
          label: "I'm going to tell Elara you told me.",
          fullText: "I'm going to tell Elara you told me. I am not going to keep this from her. Understand?",
          trustDelta: 2,
          moralityDelta: 2,
        },
      ],
      followups: {
        human_t1_s3_who_was_he: [
          {
            audioDialogId: "human_t1_s3_who_r",
            text: "I am not going to say his name tonight. Not because I am withholding — because saying his name changes the shape of the room and I want the shape of the room to be only the warning for now. I will tell you his name soon. You will recognize it when you hear it. That is a promise.",
            emotion: "cautious",
            estimatedDurationSec: 16,
            proximity: 0.85,
          },
        ],
        human_t1_s3_thank: [
          {
            audioDialogId: "human_t1_s3_thank_r",
            text: "You are welcome. The rules were mine to break and I broke them for a reason. The reason is you. I am choosing to say that out loud even though it sounds more sentimental than I intended. I am going to go quiet for the rest of the night. You are going to go talk to Elara. She will tell you everything she knows. It will be almost enough.",
            emotion: "tender",
            estimatedDurationSec: 19,
            proximity: 0.85,
          },
        ],
        human_t1_s3_why_here: [
          {
            audioDialogId: "human_t1_s3_why_r",
            text: "Now that is the right question. And the answer is not for tonight. The answer is the thing I will give you when we have the right amount of trust between us, which is not what we have now. What we have now is enough to warn you. What we will have later is enough to explain. I am looking forward to that conversation. I have been rehearsing it.",
            emotion: "intimate",
            estimatedDurationSec: 19,
            proximity: 0.85,
          },
        ],
        human_t1_s3_tell_elara: [
          {
            audioDialogId: "human_t1_s3_tell_elara_r",
            text: "Tell her. Please. I would prefer it. I do not want to be something you keep from her. I have been something people kept from each other for fifteen thousand years and it has never once improved anything. Tell her I spoke to you. Tell her exactly what I said. She will be — she will be annoyed and also relieved. Both at once. She is good at both at once.",
            emotion: "tender",
            estimatedDurationSec: 21,
            proximity: 0.85,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_broke_rule",
        summary: "The Human broke his own rule to warn the player about the Ark being a weapon delivery system. First time he volunteers operational intelligence. First real self-reveal (he was on the ship before Kael stole it).",
      },
    },
  ],
};
