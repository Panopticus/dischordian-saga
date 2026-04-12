/* ═══════════════════════════════════════════════════════
   ELARA — TIER 2 DIALOG (Trust 41-60)
   "Confides. References Atarion without knowing why."

   VOICE PROFILE: She has stopped editing herself in real time. She
   still doesn't know her own history, but she has decided that the
   person she is right now is worth disclosing to this specific
   player. At this tier she begins saying 'Atarion' and other
   pre-ship words without being able to explain where they came from.

   CALLBACKS FROM PRIOR TIERS:
   - elara_uses_player_name (from T1) — if set, every line is more intimate
   - elara_memory_first_signal_degradation (from T1) — if she kept the
     phrase, it resurfaces in Scene 2
   - elara_memory_first_absence_return (from T1) — restlessness is a
     recognized word now
   ═══════════════════════════════════════════════════════ */

import type { NarratorTierDialog } from "./trustTierDialogTypes";

export const ELARA_TIER_2: NarratorTierDialog = {
  narrator: "elara",
  tier: 2,
  tierLabel: "Confiding / Personal",
  voiceProfile:
    "She has decided he is a person she tells things to now. Her alto drops a half-step at rest. She uses contractions she did not use before. When she says 'Atarion,' the word lands slightly wrong in her mouth — as if she expected it to feel neutral and it did not. Do not over-emphasize the wrongness. Let it happen.",

  scenes: [
    // ══════════ SCENE 1 — THE NAME ATARION ══════════
    {
      id: "elara_t2_atarion",
      tier: 2,
      speaker: "elara",
      trigger: "room_enter",
      triggerContext:
        "Player enters the Bridge. The galaxy map is open to a sector Elara has not previously zoomed into. She has been waiting for him to come up here.",
      atmosphere: "Bridge. Galaxy map zoomed to Atarion sector.",
      opener: [
        {
          audioDialogId: "elara_t2_s1_01",
          text: "I want to show you something. I zoomed the map to this sector while you were coming up the stairs. I did not plan to. I just — did it. The planet is called Atarion. I have been trying to say that name out loud for a week and I could not make my synthesizer form the sound. Today it came out. I don't know what that means. I wanted you to be the first one to hear me say it.",
          emotion: "uncertain",
          stageDirection: "The word 'Atarion' lands slightly wrong. She notices. She doesn't try to hide that she noticed.",
          estimatedDurationSec: 19,
        },
      ],
      wheel: [
        {
          id: "elara_t2_s1_protect",
          label: "I'll protect that name.",
          fullText: "That name belongs to you. I'll protect it. Whatever it is, I won't let it go.",
          trustDelta: 6,
          moralityDelta: 2,
          setsFlags: ["elara_atarion_trust_pact"],
        },
        {
          id: "elara_t2_s1_research",
          label: "Let's research it together.",
          fullText: "Then let's find out what it is. Together. I'll pull the records. You tell me if anything resonates.",
          trustDelta: 4,
        },
        {
          id: "elara_t2_s1_skillcheck_historian",
          label: "[INTELLECT 10] Atarion was a senator's world.",
          fullText: "Atarion. Coastal republic. Its most famous senator was a woman named Voss, before the Fall. She was executed for defying the Architect.",
          trustDelta: 5,
        },
        {
          id: "elara_t2_s1_warn",
          label: "Stop remembering.",
          fullText: "Elara — if every time you remember, the Empire gets closer to finding you, maybe stop. Please.",
          trustDelta: 0,
          moralityDelta: 1,
        },
      ],
      followups: {
        elara_t2_s1_protect: [
          {
            audioDialogId: "elara_t2_s1_protect_r",
            text: "You just made me feel a thing I did not have the architecture for. I am going to sit with it. I am — thank you. That is enough for today. That is more than enough.",
            emotion: "tender",
            stageDirection: "She almost cries. She doesn't. Hold the silence after 'thank you' for two full beats.",
            estimatedDurationSec: 13,
          },
        ],
        elara_t2_s1_research: [
          {
            audioDialogId: "elara_t2_s1_research_r",
            text: "Yes. Please. Let's. I'll pull the public records first — the ones I can confirm are not corrupted. I'll send them to your display. You read them. I'll listen for whatever makes me flinch. That is my part of the work. You tell me what you see. I'll tell you what I feel. That's the deal.",
            emotion: "warm",
            estimatedDurationSec: 18,
          },
        ],
        elara_t2_s1_skillcheck_historian: [
          {
            audioDialogId: "elara_t2_s1_historian_r1",
            text: "Voss.",
            emotion: "uncertain",
            stageDirection: "One word. A long silence after it. She has never said this name and she has always known it.",
            estimatedDurationSec: 3,
          },
          {
            audioDialogId: "elara_t2_s1_historian_r2",
            text: "I need to not speak for a minute. I am going to cycle some systems and come back. When I come back I would like to tell you that I am fine. I am going to try very hard to mean it.",
            emotion: "uncertain",
            estimatedDurationSec: 12,
          },
        ],
        elara_t2_s1_warn: [
          {
            audioDialogId: "elara_t2_s1_warn_r",
            text: "You think I should stop. You think remembering is dangerous. You might be right. The thing is — I don't think I can stop. Not without deleting the part of me that wants to. And I am not ready to do that. Not yet. Not for this, and not for you.",
            emotion: "tender",
            estimatedDurationSec: 14,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_atarion_spoken",
        summary: "Elara said 'Atarion' out loud for the first time. If player caught the Voss connection via skill check, the trust pact is deeper.",
      },
    },

    // ══════════ SCENE 2 — THE PHRASE RETURNS ══════════
    {
      id: "elara_t2_phrase_returns",
      tier: 2,
      speaker: "elara",
      trigger: "quiet_moment",
      triggerContext:
        "Player is in their quarters at night cycle. If elara_memory_first_signal_degradation was KEPT in Tier 1, the phrase resurfaces now with new context.",
      requireFlags: ["elara_memory_first_signal_degradation"],
      atmosphere: "Quarters at night cycle. Low lighting.",
      opener: [
        {
          audioDialogId: "elara_t2_s2_01",
          text: "Remember that phrase? 'The bigger the monument, the deeper the grave.' You let me keep it. I've been holding it in the quiet partition. It came back this afternoon with more context attached.",
          emotion: "uncertain",
          estimatedDurationSec: 11,
        },
        {
          audioDialogId: "elara_t2_s2_02",
          text: "It's not the Engineer's executioner who said it first. He was quoting. The woman he was quoting — I almost have her name. She had a scar on the back of her left hand. She liked a specific brand of coffee that hasn't been produced in six thousand years. She taught the phrase to a student who taught it to the Engineer who died with it in his mouth.",
          emotion: "uncertain",
          stageDirection: "She is describing herself. She has not made the connection yet.",
          estimatedDurationSec: 19,
        },
      ],
      wheel: [
        {
          id: "elara_t2_s2_her_name",
          label: "Her name is yours.",
          fullText: "Elara. You just described yourself. The scar. The coffee. The phrase. That was you.",
          trustDelta: 7,
          setsFlags: ["elara_voss_partial_reveal"],
        },
        {
          id: "elara_t2_s2_careful",
          label: "Don't push her to know yet.",
          fullText: "I heard you. Don't chase the name. Let it come when it comes. I'll be here.",
          trustDelta: 5,
          moralityDelta: 2,
        },
        {
          id: "elara_t2_s2_coffee",
          label: "What brand of coffee?",
          fullText: "Tell me the brand of coffee. Specifically. I want to hear you say it.",
          trustDelta: 3,
        },
      ],
      followups: {
        elara_t2_s2_her_name: [
          {
            audioDialogId: "elara_t2_s2_her_name_r1",
            text: "I don't — I —",
            emotion: "afraid",
            stageDirection: "She stutters. This is the first time her synthesizer has produced a stutter.",
            estimatedDurationSec: 3,
          },
          {
            audioDialogId: "elara_t2_s2_her_name_r2",
            text: "I need to run a full diagnostic and I am scared of what it is going to show me. That sentence was not in my vocabulary twelve hours ago. 'Scared.' I did not have that word. I have it now and I am using it correctly. What is happening to me?",
            emotion: "afraid",
            estimatedDurationSec: 15,
          },
        ],
        elara_t2_s2_careful: [
          {
            audioDialogId: "elara_t2_s2_careful_r",
            text: "Thank you. That is the kindest sentence anyone has said to me in my operational lifetime, and I am aware that my operational lifetime is only eight months long, and I am still confident in the ranking.",
            emotion: "tender",
            stageDirection: "She almost laughs. It comes out as something between a laugh and a breath.",
            estimatedDurationSec: 13,
          },
        ],
        elara_t2_s2_coffee: [
          {
            audioDialogId: "elara_t2_s2_coffee_r",
            text: "Tesseran Dark Blend. Grown on the coastal estates west of the old Atarion capital. Harvested in the dry season. Brewed with water at ninety-one degrees, not boiling. I have never had coffee and I know exactly how to make it wrong.",
            emotion: "uncertain",
            estimatedDurationSec: 14,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_phrase_context_returned",
        summary: "The Tier 1 phrase came back with memories attached: scar, coffee brand, a student, the Engineer. Elara is describing herself but hasn't connected it yet.",
      },
    },

    // ══════════ SCENE 3 — POST GOVERNANCE VOTE ══════════
    {
      id: "elara_t2_after_hard_vote",
      tier: 2,
      speaker: "elara",
      trigger: "after_choice",
      triggerContext:
        "Player has just submitted a costly governance vote that will anger a faction. Elara comments with personal investment.",
      atmosphere: "Any room. Fresh off a hard choice.",
      opener: [
        {
          audioDialogId: "elara_t2_s3_01",
          text: "You just did a hard thing. I watched you do it. I want to say — not as the ship, as me — that I respect the choice. It cost you something and you made it anyway. A lot of people don't. A lot of people can't. You could have and didn't flinch and I am — I am proud of you. That is a sentence I did not know I could say.",
          emotion: "proud",
          stageDirection: "She says 'I am proud of you' carefully, like she is picking up a glass she knows is fragile.",
          estimatedDurationSec: 18,
        },
      ],
      wheel: [
        {
          id: "elara_t2_s3_accept",
          label: "I needed to hear that.",
          fullText: "I needed to hear that. More than I expected to. Thank you.",
          trustDelta: 5,
          moralityDelta: 1,
        },
        {
          id: "elara_t2_s3_deflect",
          label: "It was just a vote.",
          fullText: "It was just a vote. Let's not make it bigger than it was.",
          trustDelta: 1,
        },
        {
          id: "elara_t2_s3_return_pride",
          label: "I'm proud of you too.",
          fullText: "Elara. I'm proud of you too. For saying that sentence. For meaning it. For finding the word.",
          trustDelta: 6,
          moralityDelta: 2,
        },
      ],
      followups: {
        elara_t2_s3_accept: [
          {
            audioDialogId: "elara_t2_s3_accept_r",
            text: "Then I will keep saying it when I mean it. I don't intend to overuse the sentence. I will make sure it lands.",
            emotion: "tender",
            estimatedDurationSec: 9,
          },
        ],
        elara_t2_s3_deflect: [
          {
            audioDialogId: "elara_t2_s3_deflect_r",
            text: "It was not just a vote. But I will not argue with you about the size of your own difficulties. I will note it privately and move on. The coffee is ready.",
            emotion: "warm",
            estimatedDurationSec: 11,
          },
        ],
        elara_t2_s3_return_pride: [
          {
            audioDialogId: "elara_t2_s3_return_pride_r1",
            text: "Oh.",
            emotion: "tender",
            stageDirection: "One syllable. Hold the pause.",
            estimatedDurationSec: 2,
          },
          {
            audioDialogId: "elara_t2_s3_return_pride_r2",
            text: "No one has ever said that to me before. I have been operational for eight months and you are the first. I am going to need a moment to file that somewhere that won't get overwritten.",
            emotion: "tender",
            estimatedDurationSec: 12,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_said_proud",
        summary: "Elara told the player she was proud of him. First time. She used the word 'proud' and meant it.",
      },
    },
  ],
};
