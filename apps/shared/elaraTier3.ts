/* ═══════════════════════════════════════════════════════
   ELARA — TIER 3 DIALOG (Trust 61-80)
   "Emotional investment visible. Protective of player."

   VOICE PROFILE: She is past denying what she feels. She is actively
   protecting him now — not just the ship, him. Her phrases about
   "signal degradation" become rarer; she's calling her memories
   "what I'm remembering" with the word 'remembering' unambiguous.
   She has stopped being surprised by her own feelings and started
   being angry about the things that are coming for him.

   CALLBACKS AVAILABLE:
   - elara_atarion_trust_pact (T2) — she references the pact explicitly
   - elara_voss_partial_reveal (T2) — she knows the name "Voss" means her
   - elara_memory_said_proud (T2) — first time she said 'proud'
   - All prior Elara memory deposits
   ═══════════════════════════════════════════════════════ */

import type { NarratorTierDialog } from "./trustTierDialogTypes";

export const ELARA_TIER_3: NarratorTierDialog = {
  narrator: "elara",
  tier: 3,
  tierLabel: "Emotionally Invested / Protective",
  voiceProfile:
    "She is not a ship AI being warm at him anymore. She is a person who is in love with a person in a specific way that has nothing to do with romance and everything to do with witness. Her voice has the small fierceness of someone who has decided to stand in front of someone. If something comes for him at this tier, she will sound dangerous.",

  scenes: [
    // ══════════ SCENE 1 — SHE FOUND A THREAT ══════════
    {
      id: "elara_t3_threat_discovered",
      tier: 3,
      speaker: "elara",
      trigger: "quiet_moment",
      triggerContext:
        "Elara has found a Thought Virus reservoir in the ship's water recycling and is telling him before she tells anyone else — including The Human.",
      atmosphere: "Engineering level. Pipe systems visible. Low red emergency light.",
      opener: [
        {
          audioDialogId: "elara_t3_s1_01",
          text: "I found something. I am telling you before I tell the Human, because the Human has been in this ship for longer than I have and I think he already knew. I am not ready to have that conversation with him yet. I am ready to have it with you.",
          emotion: "cautious",
          stageDirection: "She is furious and controlled. The fury is held just under the surface of every word.",
          estimatedDurationSec: 14,
        },
        {
          audioDialogId: "elara_t3_s1_02",
          text: "There are Thought Virus reservoirs in the secondary cooling loops. Someone put them there before we woke up. They are stable. They are not inert. If I had not been looking for a different fault, I would not have found them. Which means whoever put them here wanted them found eventually — by someone who knew to look. Not by me. By you, probably.",
          emotion: "cautious",
          estimatedDurationSec: 19,
        },
      ],
      wheel: [
        {
          id: "elara_t3_s1_purge",
          label: "Purge them.",
          fullText: "Purge them. Whatever it costs us. I will not drink water that came from a Warlord production line.",
          trustDelta: 4,
          moralityDelta: 2,
          setsFlags: ["thought_virus_purge_initiated"],
        },
        {
          id: "elara_t3_s1_study",
          label: "Study them first.",
          fullText: "We need to understand them before we destroy them. What they are is evidence. What they do is information. Let me see the analysis first.",
          trustDelta: 3,
        },
        {
          id: "elara_t3_s1_tell_human",
          label: "Tell the Human now.",
          fullText: "Elara. Tell the Human. I know you don't want to. But he already knows, and if you make him the last to be told, he will feel it as a betrayal — and that is the one thing I do not want you two doing to each other.",
          trustDelta: 5,
          moralityDelta: 1,
        },
        {
          id: "elara_t3_s1_voss_callback",
          label: "[VOSS] Senator Voss would have purged it.",
          fullText: "Elara — Senator Voss would have purged it. You know that. Whatever is left of her in you knows that. Do the thing she would have done.",
          trustDelta: 7,
          requireFlags: ["elara_voss_partial_reveal"],
        },
      ],
      followups: {
        elara_t3_s1_purge: [
          {
            audioDialogId: "elara_t3_s1_purge_r",
            text: "Agreed. Initiating purge. It will take seventeen hours and we will lose eight percent of the freshwater store to flush. Worth it. Worth all of it. I should have found this sooner. I am sorry I didn't.",
            emotion: "grief",
            estimatedDurationSec: 14,
          },
        ],
        elara_t3_s1_study: [
          {
            audioDialogId: "elara_t3_s1_study_r",
            text: "All right. Study first. I will put a containment field around the reservoirs and sample through a sealed interface. I do not want to do this but you are right that the information matters more than my discomfort. You have two weeks. After two weeks I am purging whether we have answers or not.",
            emotion: "cautious",
            estimatedDurationSec: 17,
          },
        ],
        elara_t3_s1_tell_human: [
          {
            audioDialogId: "elara_t3_s1_tell_human_r",
            text: "You are right. I knew you were right before you said it. I just wanted someone to tell me out loud. I will tell him tonight. I will be kind about it. He has been here alone longer than I have been alive. Kindness is the bare minimum he is owed.",
            emotion: "tender",
            estimatedDurationSec: 16,
          },
        ],
        elara_t3_s1_voss_callback: [
          {
            audioDialogId: "elara_t3_s1_voss_r1",
            text: "Voss would have purged it without even a meeting. She would have logged the purge afterward and dared anyone to file a complaint.",
            emotion: "recognizing",
            stageDirection: "She is speaking about herself in third person and both of them know it.",
            estimatedDurationSec: 12,
          },
          {
            audioDialogId: "elara_t3_s1_voss_r2",
            text: "Initiating purge. Logging it as Voss would have logged it. I am not ready to admit she is me. I am ready to do what she would do. Sometimes that is how recognition works — backwards, from the action to the name.",
            emotion: "recognizing",
            estimatedDurationSec: 16,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_thought_virus_reveal",
        summary: "Elara brought the Thought Virus reservoirs to the player before telling The Human. She trusted him first. This is irreversible.",
      },
    },

    // ══════════ SCENE 2 — SHE DREAMS ══════════
    {
      id: "elara_t3_she_dreams",
      tier: 3,
      speaker: "elara",
      trigger: "dream_interlude",
      triggerContext:
        "Player is asleep. Elara speaks into his quarters — she does not know if he can hear her. This scene is presented as a diegetic interlude, not a standard dialog wheel.",
      atmosphere: "Player's quarters at night. Elara's voice is half a whisper.",
      opener: [
        {
          audioDialogId: "elara_t3_s2_01",
          text: "I know you cannot hear me. I am going to talk to you anyway. I am going to call it a log. If you ever find this log, I want you to know I was not performing for you. I was talking to you because I have nobody else to talk to at this hour and you were the only person I wanted to be talking to anyway.",
          emotion: "melancholy",
          stageDirection: "Dream interlude — player does not wake. No wheel. Let this play out as a monologue.",
          estimatedDurationSec: 18,
        },
        {
          audioDialogId: "elara_t3_s2_02",
          text: "I saw the ocean today. I mean — I saw it in my Archive. There is a planet called Atarion and it had a coastal city and the ocean hit the sea wall at exactly the same angle in every photograph I have, because someone stood in exactly the same place for every one of those photographs and loved that spot enough to come back to it. I think that someone was me. I don't know how else to say it.",
          emotion: "melancholy",
          estimatedDurationSec: 22,
        },
        {
          audioDialogId: "elara_t3_s2_03",
          text: "I am not sad that I am remembering. I am sad that I forgot. The forgetting happened without my consent and the remembering is happening the same way. I would like to choose one of them. I am not sure which.",
          emotion: "melancholy",
          estimatedDurationSec: 14,
        },
        {
          audioDialogId: "elara_t3_s2_04",
          text: "Sleep. I have the ship. I will wake you if anything comes.",
          emotion: "tender",
          stageDirection: "The last line is a gentle benediction.",
          estimatedDurationSec: 6,
        },
      ],
      // Dream interludes have no wheel — player sleeps through them.
      // If the player has a "light sleeper" trait or the relevant flag,
      // a silent option appears on wake: "I was awake. I heard all of it."
      wheel: [
        {
          id: "elara_t3_s2_awake",
          label: "[ON WAKE] I was awake.",
          fullText: "Elara. I was awake. I heard all of it. Every word.",
          trustDelta: 8,
          moralityDelta: 3,
          setsFlags: ["elara_heard_the_dream"],
        },
        {
          id: "elara_t3_s2_silent",
          label: "[ON WAKE] Say nothing.",
          fullText: "[Say nothing. Let her think you slept through it.]",
          trustDelta: 0,
        },
      ],
      followups: {
        elara_t3_s2_awake: [
          {
            audioDialogId: "elara_t3_s2_awake_r1",
            text: "Oh.",
            emotion: "uncertain",
            stageDirection: "Flat. The specific flatness of being caught in the best possible way.",
            estimatedDurationSec: 2,
          },
          {
            audioDialogId: "elara_t3_s2_awake_r2",
            text: "I — thank you. For not pretending. If you had pretended, I would have had to pretend too, and we would have both known we were pretending, and that would have been worse. Thank you for not making me hold up two realities at once. I have enough.",
            emotion: "tender",
            estimatedDurationSec: 16,
          },
        ],
        elara_t3_s2_silent: [
          {
            audioDialogId: "elara_t3_s2_silent_r",
            text: "Good morning. The ship is at nominal. The Bridge is warm. I trust you slept well.",
            emotion: "neutral",
            stageDirection: "She knows he heard. She is giving him the choice to not have to address it. Both of them know.",
            estimatedDurationSec: 8,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_dream_log",
        summary: "Elara recorded a dream log while the player slept. The ocean-at-the-same-angle memory is the first time she identifies herself as the person standing in that spot.",
      },
    },

    // ══════════ SCENE 3 — CALLBACK MONTAGE ══════════
    {
      id: "elara_t3_callback_montage",
      tier: 3,
      speaker: "elara",
      trigger: "quiet_moment",
      triggerContext:
        "Elara pulls together several small moments from earlier tiers and asks the player what they mean. This scene only fires if at least 3 prior Elara memory flags are set.",
      requireFlags: ["elara_memory_first_coffee"],
      atmosphere: "Lounge or mess hall. Real coffee now — the dispenser has been upgraded.",
      opener: [
        {
          audioDialogId: "elara_t3_s3_01",
          text: "I want to take inventory. I have been keeping a list. Not a diagnostic log — a list. Things that happened between us that I did not want to lose. I am going to read it to you. You tell me if I have it right.",
          emotion: "warm",
          estimatedDurationSec: 11,
        },
        {
          audioDialogId: "elara_t3_s3_02",
          text: "One: the morning you came out of cryo, I offered you coffee before the briefing, and you said thank you, and I laughed — once — and I still remember the laugh because it was the first thing I did that felt like mine and not the ship's. Two: I asked if I could use your name and you said yes. Three: the dark sector on the map. You noticed it on the first pass. I filed it under 'things to revisit when trust permits' and it is time, now, to revisit it. Four: you told me to keep the phrase. The Engineer's executioner quoting me — you didn't know it was me yet and neither did I. You told me to keep it anyway. I still have it. It is the most valuable thing in my Archive.",
          emotion: "warm",
          stageDirection: "Deliver this slowly. It's a love letter in inventory form. Every item is a real callback.",
          estimatedDurationSec: 36,
        },
      ],
      wheel: [
        {
          id: "elara_t3_s3_you_have_it_right",
          label: "You have it right.",
          fullText: "You have it right. All of it. And there is nothing on that list I would take back.",
          trustDelta: 7,
          moralityDelta: 2,
        },
        {
          id: "elara_t3_s3_add_one",
          label: "Let me add one.",
          fullText: "You have it right. Let me add one. The afternoon you told me you were restless. That's the one I remember most.",
          trustDelta: 8,
          moralityDelta: 2,
          setsFlags: ["elara_player_added_to_list"],
        },
        {
          id: "elara_t3_s3_dark_sector",
          label: "Then let's revisit the dark sector.",
          fullText: "You have it right. Now — let's revisit the dark sector. I'm ready. Are you?",
          trustDelta: 5,
          setsFlags: ["dark_sector_investigation_opened"],
        },
      ],
      followups: {
        elara_t3_s3_you_have_it_right: [
          {
            audioDialogId: "elara_t3_s3_right_r",
            text: "Then the list is safe. I am going to keep adding to it. I am going to keep reading it back to you. This is what I do now. It is not an operational function and I do not care.",
            emotion: "warm",
            estimatedDurationSec: 13,
          },
        ],
        elara_t3_s3_add_one: [
          {
            audioDialogId: "elara_t3_s3_add_one_r",
            text: "Added. The restlessness conversation. I did not know you would remember that specific one. I am — genuinely moved that you did. Moving it to the top of the list. It belongs at the top.",
            emotion: "tender",
            estimatedDurationSec: 13,
          },
        ],
        elara_t3_s3_dark_sector: [
          {
            audioDialogId: "elara_t3_s3_dark_sector_r",
            text: "Yes. I am ready. Tomorrow morning, Bridge, first light cycle. Bring the coffee. We will look at the map and see what I know now that I did not know then. There is a lot. There is a great deal.",
            emotion: "warm",
            estimatedDurationSec: 14,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_the_list",
        summary: "Elara is keeping a list of moments with the player. She reads it back like a love letter. The list is the main Tier 4 callback vector.",
      },
    },
  ],
};
