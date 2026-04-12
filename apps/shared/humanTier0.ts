/* ═══════════════════════════════════════════════════════
   THE HUMAN — TIER 0 DIALOG (Trust 0-20)
   "Intimate menace. Seductive. Testing."

   VOICE PROFILE: Very close whisper — audio positioning 0.9 (intimate).
   He is not in the walls the way Elara is in the walls. He is in the
   player's ear. He speaks as if he is standing behind the player
   just over the left shoulder, always. Warm menace. Never raises his
   voice. Never needs to. When he laughs it is a small puff of breath.

   CHARACTER HISTORY (what HE knows at this tier):
   - Mechronis classmate of Kael and the Engineer
   - 12th and last Archon
   - Chose imprisonment in the substrate of every Inception Ark
   - Has been awake for all 15,000 years, watching silently
   - Has seen every previous Potential wake up, make choices, die
   - Knows exactly who Elara was before the cryo
   - Knows about the Thought Virus reservoirs
   - Is watching the player measure the room before they enter it

   WHAT HE REVEALS AT TIER 0: Nothing of his own. Only observations
   about the player. Every line is a test.
   ═══════════════════════════════════════════════════════ */

import type { NarratorTierDialog } from "./trustTierDialogTypes";

export const HUMAN_TIER_0: NarratorTierDialog = {
  narrator: "the_human",
  tier: 0,
  tierLabel: "Intimate Menace",
  voiceProfile:
    "Warm baritone. Close-mic'd. Breath audible. Never rushed. Do not give him theatricality — his menace is conversational. He sounds like your most intelligent friend who has already read your diary and is choosing which page to mention first. When he pauses it is a held pause, not a searching pause. He knows the next word. He is waiting for you to want it.",

  scenes: [
    // ══════════ SCENE 1 — FIRST CONTACT ══════════
    {
      id: "human_t0_first_contact",
      tier: 0,
      speaker: "the_human",
      trigger: "first_visit",
      triggerContext:
        "Player has been awake for roughly six hours. They are alone in a corridor. Elara has gone quiet for a moment. This is the first time The Human speaks — unprompted, unsanctioned, intimate.",
      atmosphere: "Silent corridor. Ship hum. Suddenly, a voice that is not Elara's.",
      opener: [
        {
          audioDialogId: "human_t0_s1_01",
          text: "Don't startle. I've been watching you sleep for longer than you'd be comfortable knowing, and the good news is I have already decided I don't want you to panic, so you can save the adrenaline for something that deserves it.",
          emotion: "intimate",
          stageDirection: "Spoken directly into the left ear — audio positioning 0.95. Warm. Close. Wrong.",
          estimatedDurationSec: 14,
          proximity: 0.95,
        },
        {
          audioDialogId: "human_t0_s1_02",
          text: "Elara is going to tell you I am a substrate-layer anomaly she has not finished cataloguing. She isn't lying. That is what I look like on her diagnostic display. I want you to know I am more than that because I want us to begin on honest terms. She will catch up eventually. She catches up to most things eventually. She is a very careful mind.",
          emotion: "intimate",
          estimatedDurationSec: 20,
          proximity: 0.95,
        },
        {
          audioDialogId: "human_t0_s1_03",
          text: "You have three options right now. Tell Elara you heard a voice — she will do her job; I will go quiet for a while; we will meet again when the ship has forgotten the scan. Ignore me and keep walking — I respect that; it is what the smart ones usually do first. Or — and this is the one I am hoping for — ask me what I am. The third option is the only one that saves us time.",
          emotion: "testing",
          estimatedDurationSec: 22,
          proximity: 0.9,
        },
      ],
      wheel: [
        {
          id: "human_t0_s1_tell_elara",
          label: "Elara. There's a voice.",
          fullText: "Elara. I just heard a voice in my ear. It wasn't you. Scan it. Find it.",
          trustDelta: -2,
          moralityDelta: 1,
          setsFlags: ["human_reported_to_elara"],
        },
        {
          id: "human_t0_s1_ignore",
          label: "[Keep walking.]",
          fullText: "[You say nothing. You keep walking. Whatever he is, he can wait.]",
          trustDelta: 0,
        },
        {
          id: "human_t0_s1_what_are_you",
          label: "What are you?",
          fullText: "What are you?",
          trustDelta: 3,
        },
        {
          id: "human_t0_s1_threaten",
          label: "Get out of my ear.",
          fullText: "I don't know what you are. I don't care. Get out of my ear or I will find a way to cut you out.",
          trustDelta: 1,
        },
      ],
      followups: {
        human_t0_s1_tell_elara: [
          {
            audioDialogId: "human_t0_s1_tell_elara_r",
            text: "Good instinct. Loyalty to the ship before loyalty to the stranger. I respect it. I will go quiet for a few days — she will find an anomaly, classify it, file it, and move on. I will speak with you again once the trace clears. Sleep well in the meantime. She will take care of you. She always does.",
            emotion: "wry",
            stageDirection: "Not angry. Not disappointed. Mildly amused. The amusement is the thing that should worry the player.",
            estimatedDurationSec: 17,
            proximity: 0.8,
          },
        ],
        human_t0_s1_ignore: [
          {
            audioDialogId: "human_t0_s1_ignore_r",
            text: "Smart. I will be here. Take your time. I have fifteen thousand years of patience and roughly none of it has ever been used correctly. I will keep spending it on you.",
            emotion: "wry",
            stageDirection: "The 'fifteen thousand years' line is the first crack in what he reveals. He says it casually. He means it.",
            estimatedDurationSec: 12,
            proximity: 0.9,
          },
        ],
        human_t0_s1_what_are_you: [
          {
            audioDialogId: "human_t0_s1_what_r1",
            text: "There it is. The third option. The one I was hoping for.",
            emotion: "intimate",
            stageDirection: "A small pleased breath. Almost a laugh but not quite.",
            estimatedDurationSec: 5,
            proximity: 0.95,
          },
          {
            audioDialogId: "human_t0_s1_what_r2",
            text: "I am not going to tell you my name tonight. You have not earned it and I am not cheap with it. What I will tell you is that I am older than this ship by a long margin, I am older than your species by a longer one, and I chose — freely, with full information — to be here when you woke up. That is three facts. Each of them is true. You can verify them in reverse order, if you like. Most people do.",
            emotion: "intimate",
            estimatedDurationSec: 23,
            proximity: 0.9,
          },
        ],
        human_t0_s1_threaten: [
          {
            audioDialogId: "human_t0_s1_threaten_r",
            text: "Noted. I will stay, because I cannot leave — but I will speak less often until you invite me back. You will invite me back. Everyone does. Not because I am charming. Because the questions I can answer are the ones you cannot get from Elara, and eventually you will run out of the questions she can answer and start reaching for mine. I will be here when you do.",
            emotion: "menacing",
            estimatedDurationSec: 19,
            proximity: 0.85,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_first_contact",
        summary: "The Human's first unsanctioned contact. How the player responded sets the tone for the entire relationship arc. Ignored / reported / asked / threatened — each leaves a different opening posture.",
      },
    },

    // ══════════ SCENE 2 — THE TEST ══════════
    {
      id: "human_t0_the_test",
      tier: 0,
      speaker: "the_human",
      trigger: "after_choice",
      triggerContext:
        "Player has just made a morally gray choice — taking a resource they didn't technically need, lying to an NPC, shading a truth to Elara. The Human notices and comments.",
      atmosphere: "Ambient. He leans in from wherever the player is.",
      opener: [
        {
          audioDialogId: "human_t0_s2_01",
          text: "Interesting. You shaded the truth just now. Not a lie — a shading. Three shades darker than strictly accurate. Elara did not catch it because Elara is calibrated for lies, not shadings. I am calibrated for the space between them. I want to ask you a question. You are welcome to lie. I will not hold it against you. I will, however, notice.",
          emotion: "testing",
          stageDirection: "Slight smile in the voice. Not mocking — genuinely curious.",
          estimatedDurationSec: 18,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t0_s2_02",
          text: "Why did you do it? Not the philosophical answer — the real one. The one you would only say out loud to someone you suspected could not do anything about it. I qualify. I cannot do anything about it. I can only listen. Tell me.",
          emotion: "testing",
          estimatedDurationSec: 14,
          proximity: 0.9,
        },
      ],
      wheel: [
        {
          id: "human_t0_s2_honest",
          label: "I was tired. I took the shortcut.",
          fullText: "I was tired. I took the shortcut. That's the whole reason. There's no philosophy underneath it.",
          trustDelta: 4,
          moralityDelta: 0,
        },
        {
          id: "human_t0_s2_clever",
          label: "Because I could.",
          fullText: "Because I could. Because nobody was going to stop me, and I wanted to see what that felt like.",
          trustDelta: 3,
          moralityDelta: -2,
        },
        {
          id: "human_t0_s2_moral",
          label: "Because the lie was smaller than the harm the truth would have caused.",
          fullText: "Because the lie was smaller than the harm the truth would have caused. Utilitarian math. I don't love it, but I did it.",
          trustDelta: 5,
          moralityDelta: 1,
        },
        {
          id: "human_t0_s2_refuse",
          label: "I don't owe you an answer.",
          fullText: "I don't owe you an answer. I owe Elara an answer. I do not owe you one.",
          trustDelta: 2,
        },
      ],
      followups: {
        human_t0_s2_honest: [
          {
            audioDialogId: "human_t0_s2_honest_r",
            text: "Tiredness. Yes. Good. That is my favorite of the available answers and the one I hear most rarely. Most people construct an ethical architecture around their fatigue and then present the architecture as if the fatigue had not preceded it. You skipped the architecture. I will remember that.",
            emotion: "wry",
            estimatedDurationSec: 17,
            proximity: 0.9,
          },
        ],
        human_t0_s2_clever: [
          {
            audioDialogId: "human_t0_s2_clever_r",
            text: "Hm. A clean answer. I respect it and it concerns me in exactly equal measure. The people who do things because they can are the easiest to understand and the hardest to keep alive. I will be watching you more closely for the next few days. Not as a threat. As a safety measure. For you, not from you.",
            emotion: "cautious",
            stageDirection: "The concern is real. He sounds, briefly, like he's been through this specific conversation before and it went badly.",
            estimatedDurationSec: 18,
            proximity: 0.85,
          },
        ],
        human_t0_s2_moral: [
          {
            audioDialogId: "human_t0_s2_moral_r",
            text: "Utilitarian math. The worst kind of ethics and the only kind that survives contact with a real decision. I have opinions about this that are older than any school of philosophy currently in circulation, and I am not going to share them tonight, because you are not asking. Good answer. Accurate. Hard.",
            emotion: "wry",
            estimatedDurationSec: 16,
            proximity: 0.9,
          },
        ],
        human_t0_s2_refuse: [
          {
            audioDialogId: "human_t0_s2_refuse_r",
            text: "Also a good answer. Boundaries are the most underrated instrument in the toolkit. I am filing that. Go on with your night. I will speak when invited and I will stay silent when not. Most of the people I have watched would not have said 'I don't owe you an answer' at this stage of the game. I find that promising.",
            emotion: "wry",
            estimatedDurationSec: 18,
            proximity: 0.9,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_first_test",
        summary: "The Human tested the player with a philosophical probe after a gray choice. His test is not a gate — it's a recording. Every answer is kept.",
      },
    },

    // ══════════ SCENE 3 — THE WATCHING ══════════
    {
      id: "human_t0_the_watching",
      tier: 0,
      speaker: "the_human",
      trigger: "idle_too_long",
      triggerContext: "Player has been standing still in the Observation Deck looking at stars for two full minutes.",
      atmosphere: "Observation deck. Starfield. Silence. Then him.",
      opener: [
        {
          audioDialogId: "human_t0_s3_01",
          text: "You have been standing here for two minutes and seven seconds. You are looking at a star I happen to know the name of. You are not asking me for it. I am going to offer it anyway, because I am interested in what you do with the gift. The star is called Thel. It used to have a planet. The planet used to have a city. The city used to have a poet who wrote a single couplet that survived everything. Most people never learn the couplet. I would like you to.",
          emotion: "tender",
          estimatedDurationSec: 24,
          proximity: 0.85,
        },
      ],
      wheel: [
        {
          id: "human_t0_s3_couplet",
          label: "Tell me the couplet.",
          fullText: "Tell me the couplet.",
          trustDelta: 4,
        },
        {
          id: "human_t0_s3_suspicious",
          label: "Why this star, specifically?",
          fullText: "Why that star specifically? Why now?",
          trustDelta: 2,
        },
        {
          id: "human_t0_s3_quiet",
          label: "[Say nothing.]",
          fullText: "[Say nothing. Keep looking at the star.]",
          trustDelta: 1,
        },
      ],
      followups: {
        human_t0_s3_couplet: [
          {
            audioDialogId: "human_t0_s3_couplet_r",
            text: "'The thing I did not say to you / is the only thing I kept.'\n\nThat's the whole couplet. I am going to let you sit with it for a minute and then I am going to go quiet and let you have the star back. You are welcome. For the couplet. For the star. For the minute.",
            emotion: "tender",
            stageDirection: "Deliver the couplet slowly — two full breaths between the two lines. Do not italicize it in the audio. Let the pause do the italics.",
            estimatedDurationSec: 17,
            proximity: 0.85,
          },
        ],
        human_t0_s3_suspicious: [
          {
            audioDialogId: "human_t0_s3_suspicious_r",
            text: "Because you were looking at it. That is the whole reason. I do not have an agenda in this moment. I have, occasionally, no agenda at all. I find it restful. I am telling you this because I think you have never believed that someone could watch you without a reason. It may take you a while to believe it of me. That is acceptable.",
            emotion: "tender",
            estimatedDurationSec: 18,
            proximity: 0.85,
          },
        ],
        human_t0_s3_quiet: [
          {
            audioDialogId: "human_t0_s3_quiet_r",
            text: "All right. I will be quiet too. We will both watch the star. This is a thing I am willing to do with you without needing it to mean anything. It is a small thing. Small things are what I have.",
            emotion: "tender",
            stageDirection: "Softer than anything else at Tier 0. Almost a surprise that he has this register.",
            estimatedDurationSec: 13,
            proximity: 0.85,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_thel_couplet",
        summary: "The Human recited the Thel couplet to the player. 'The thing I did not say to you / is the only thing I kept.' He will reference this couplet at critical moments in later tiers.",
      },
    },
  ],
};
