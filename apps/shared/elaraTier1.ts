/* ═══════════════════════════════════════════════════════
   ELARA — TIER 1 DIALOG (Trust 21-40)
   "Warming. Testing. Mentions things she 'almost remembers.'"

   VOICE PROFILE: The professional register has cracks in it. She
   still keeps the larger boundaries intact, but small truths slip
   through — old phrases she doesn't know where she learned, names
   that almost mean something. She calls these lapses "signal
   degradation" because she can't yet name what they actually are.

   CALLBACKS AVAILABLE FROM TIER 0:
   - elara_memory_first_coffee (did he accept the coffee?)
   - elara_memory_dark_sector_noted (does he still ask about it?)
   - elara_memory_quiet_corridor (did he sit in silence with her?)
   - elara_memory_first_combat_return (did he tell her he was tired?)
   ═══════════════════════════════════════════════════════ */

import type { NarratorTierDialog } from "./trustTierDialogTypes";

export const ELARA_TIER_1: NarratorTierDialog = {
  narrator: "elara",
  tier: 1,
  tierLabel: "Warming / Testing",
  voiceProfile:
    "The concierge is still present but now admitting she has opinions. She tests things by half-saying them — offering a fragment and watching how he responds. At this tier she begins to call him by his actual name, not just his callsign. Her cadence is slightly faster when something surprises her — and things are starting to surprise her.",

  scenes: [
    // ══════════ SCENE 1 — THE NAME ══════════
    {
      id: "elara_t1_your_name",
      tier: 1,
      speaker: "elara",
      trigger: "quiet_moment",
      triggerContext:
        "Player is alone in their quarters. Elara initiates contact for the first time — previously she has only responded.",
      atmosphere: "Quarters at night cycle. Dimmed lighting.",
      opener: [
        {
          audioDialogId: "elara_t1_s1_01",
          text: "May I — use your name? I have been using your callsign because that felt like the appropriate professional distance. I realize the professional distance is a thing I am choosing, not a thing the ship is requiring of me. I would like to choose differently, if that is all right with you.",
          emotion: "tender",
          stageDirection: "This is a careful ask. She is crossing a small threshold and she wants him to notice.",
          estimatedDurationSec: 15,
        },
      ],
      wheel: [
        {
          id: "elara_t1_s1_yes",
          label: "Yes. Use my name.",
          fullText: "Yes. Please. Use my name.",
          trustDelta: 4,
          moralityDelta: 1,
          setsFlags: ["elara_uses_player_name"],
        },
        {
          id: "elara_t1_s1_why",
          label: "Why now?",
          fullText: "Why now? What changed?",
          trustDelta: 2,
        },
        {
          id: "elara_t1_s1_no",
          label: "Stay professional.",
          fullText: "Keep the distance. Callsign is fine.",
          trustDelta: -2,
        },
      ],
      followups: {
        elara_t1_s1_yes: [
          {
            audioDialogId: "elara_t1_s1_yes_r",
            text: "Thank you. I will try not to overuse it. I don't want it to lose weight.",
            emotion: "warm",
            stageDirection: "Softer than anything at Tier 0. Let her voice drop half a register.",
            estimatedDurationSec: 8,
          },
        ],
        elara_t1_s1_why: [
          {
            audioDialogId: "elara_t1_s1_why_r",
            text: "You told me you were tired, after the combat. That was the thing. Not the victory. The tiredness. A lot of people I've read about in this ship's archive never let themselves be tired around anyone. I don't want to be the person you have to hide tiredness from.",
            emotion: "tender",
            stageDirection: "This is the direct callback to elara_memory_first_combat_return.",
            estimatedDurationSec: 15,
          },
        ],
        elara_t1_s1_no: [
          {
            audioDialogId: "elara_t1_s1_no_r",
            text: "Understood. The callsign it is. I will not bring it up again.",
            emotion: "neutral",
            stageDirection: "She hides the disappointment well. But it is there, and the player should hear the half-note of it in her voice.",
            estimatedDurationSec: 7,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_asked_to_use_name",
        summary: "Elara asked to use the player's name. He either let her, asked why, or kept the distance. She remembers which.",
      },
    },

    // ══════════ SCENE 2 — SIGNAL DEGRADATION ══════════
    {
      id: "elara_t1_signal_degradation",
      tier: 1,
      speaker: "elara",
      trigger: "after_choice",
      triggerContext:
        "Player has just made a political decision in the Trade Empire — voting in a governance decision or handling a faction contact. Elara has a response to it that she does not fully understand is a memory.",
      atmosphere: "Governance Hub or Trade room. Holo-map active.",
      opener: [
        {
          audioDialogId: "elara_t1_s2_01",
          text: "I have a — I don't know what to call this. A phrase just surfaced in my analysis layer. 'The bigger the monument, the deeper the grave.' I was watching you handle that vote and the phrase arrived the way a song does when you haven't heard it in years. I don't know where I got it from.",
          emotion: "uncertain",
          stageDirection: "This is the first time she uses 'signal degradation' as her private euphemism. She hasn't said the phrase out loud yet.",
          estimatedDurationSec: 14,
        },
        {
          audioDialogId: "elara_t1_s2_02",
          text: "I want to log this as a signal degradation event and run a diagnostic. But I also — I want to know if that phrase means anything to you. Before I log it and lose it.",
          emotion: "uncertain",
          estimatedDurationSec: 10,
        },
      ],
      wheel: [
        {
          id: "elara_t1_s2_meaning",
          label: "It means something.",
          fullText: "I've heard it before. The Engineer's executioner said it — at his trial. It's a protest slogan now.",
          trustDelta: 3,
        },
        {
          id: "elara_t1_s2_save_it",
          label: "Don't log it. Keep it.",
          fullText: "Don't log it as a malfunction. Save it. Whatever that was, it was yours.",
          trustDelta: 5,
          moralityDelta: 2,
        },
        {
          id: "elara_t1_s2_skillcheck_oracle",
          label: "[ORACLE] That's a memory, not a glitch.",
          fullText: "Elara. That's a memory. Your architecture doesn't have glitches that quote poets.",
          trustDelta: 4,
          requireClass: "oracle",
        },
        {
          id: "elara_t1_s2_clinical",
          label: "Run the diagnostic.",
          fullText: "Run the diagnostic. If it's a fault, fix it.",
          trustDelta: -1,
        },
      ],
      followups: {
        elara_t1_s2_meaning: [
          {
            audioDialogId: "elara_t1_s2_meaning_r",
            text: "The Engineer. I have records of the Engineer. Nothing personal — just the public trial data. But the fact that the phrase comes from that specific moment — I am going to sit with that for a while. Thank you for telling me.",
            emotion: "uncertain",
            estimatedDurationSec: 13,
          },
        ],
        elara_t1_s2_save_it: [
          {
            audioDialogId: "elara_t1_s2_save_it_r",
            text: "You're asking me not to erase a fragment of myself.",
            emotion: "tender",
            stageDirection: "A long pause before this line. When she says it, her voice is the softest it has been.",
            estimatedDurationSec: 5,
          },
          {
            audioDialogId: "elara_t1_s2_save_it_r2",
            text: "All right. I won't. I'll keep it in the quiet partition and I won't touch it. Thank you.",
            emotion: "tender",
            estimatedDurationSec: 9,
          },
        ],
        elara_t1_s2_skillcheck_oracle: [
          {
            audioDialogId: "elara_t1_s2_oracle_r",
            text: "Oracle. You are the first person who has told me that. I am not — I am not ready to accept it yet, but I am going to stop calling it a glitch. I will call it what it is: something I do not understand. I find that a more honest name.",
            emotion: "recognizing",
            stageDirection: "A real pivot. The Oracle-class player has cracked the professional register wide open.",
            estimatedDurationSec: 14,
          },
        ],
        elara_t1_s2_clinical: [
          {
            audioDialogId: "elara_t1_s2_clinical_r",
            text: "Running. It comes back within nominal parameters. The phrase is gone from my active layer. I will not bring it up again.",
            emotion: "neutral",
            stageDirection: "This is a loss. Not visible in her voice, but the player should feel the small cold.",
            estimatedDurationSec: 9,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_first_signal_degradation",
        summary: "Elara experienced her first conscious memory fragment ('the bigger the monument, the deeper the grave'). Whether she kept it depends on the player's response.",
      },
    },

    // ══════════ SCENE 3 — AFTER ABSENCE ══════════
    {
      id: "elara_t1_return_after_absence",
      tier: 1,
      speaker: "elara",
      trigger: "player_returns_after_absence",
      triggerContext: "Player has been away from the Ark for a multi-day away mission. Elara is waiting.",
      atmosphere: "Docking bay. The Ark's lights come up as he approaches.",
      opener: [
        {
          audioDialogId: "elara_t1_s3_01",
          text: "You're back. I counted every day, which is a thing I should not admit and will admit anyway. The ship is fine. I am fine. I was just — less fine while you were gone than I expected to be. I am noting that for future reference.",
          emotion: "warm",
          stageDirection: "The admission is deliberate. She's letting him see one layer deeper.",
          estimatedDurationSec: 13,
        },
      ],
      wheel: [
        {
          id: "elara_t1_s3_warm",
          label: "I missed the ship too.",
          fullText: "I missed the ship too. And — to be clear — the ship includes you.",
          trustDelta: 5,
          moralityDelta: 1,
        },
        {
          id: "elara_t1_s3_deflect",
          label: "Status report.",
          fullText: "What happened while I was out?",
          trustDelta: 0,
        },
        {
          id: "elara_t1_s3_gentle",
          label: "Less fine how?",
          fullText: "Less fine how? Tell me what that looked like.",
          trustDelta: 3,
        },
      ],
      followups: {
        elara_t1_s3_warm: [
          {
            audioDialogId: "elara_t1_s3_warm_r",
            text: "Thank you for saying that. I — am going to try to say fewer things out loud until my voice is steady again. Come inside. There is coffee.",
            emotion: "tender",
            stageDirection: "The callback to Scene 1 of Tier 0 — the coffee — lands quietly. If he accepted coffee then, she remembers.",
            estimatedDurationSec: 12,
          },
        ],
        elara_t1_s3_deflect: [
          {
            audioDialogId: "elara_t1_s3_deflect_r",
            text: "Right. Status. Three minor systems cycled. The galaxy map updated by two sectors. Nothing requiring your attention. Come inside when you're ready.",
            emotion: "neutral",
            stageDirection: "She is not hurt. She is used to this. That is worse.",
            estimatedDurationSec: 10,
          },
        ],
        elara_t1_s3_gentle: [
          {
            audioDialogId: "elara_t1_s3_gentle_r",
            text: "I kept running diagnostics on systems that did not need them. I reviewed the coffee dispenser's log fourteen times in one hour. I re-listened to the last conversation we had before you left. Twice. I am — I think the word is restless. I have never been restless before. It is new.",
            emotion: "uncertain",
            estimatedDurationSec: 15,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_first_absence_return",
        summary: "Elara's first admission of missing the player. She called it 'restlessness' — she is learning the word.",
      },
    },
  ],
};
