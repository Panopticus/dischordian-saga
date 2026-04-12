/* ═══════════════════════════════════════════════════════
   ELARA — TIER 0 DIALOG (Trust 0-20)
   "Professional. Helpful. No personal disclosure."

   VOICE PROFILE: Warm but careful. The specific warmth of a concierge
   at an expensive hotel who has seen every kind of guest and decided
   to be kind to this one. She does not volunteer personal information.
   She does not ask personal questions. She makes herself available.
   That's enough, for now.

   AT THIS TIER SHE DOES NOT YET KNOW:
   - That she was Senator Voss of Atarion
   - That Kael lived on this ship before the player
   - That The Human is imprisoned in the substrate
   - That the ship carries Thought Virus reservoirs
   ═══════════════════════════════════════════════════════ */

import type { NarratorTierDialog } from "./trustTierDialogTypes";

export const ELARA_TIER_0: NarratorTierDialog = {
  narrator: "elara",
  tier: 0,
  tierLabel: "Professional Warmth",
  voiceProfile:
    "Concierge at a very good hotel. Warm enough to be welcoming, boundaried enough to stay professional. She uses the player's callsign until she earns the right to drop it. Her idle tone is a steady mid-range alto. She laughs once, briefly, in scene 2 — the only laugh at this tier.",

  scenes: [
    // ══════════ SCENE 1 — FIRST WAKE ══════════
    {
      id: "elara_t0_first_wake",
      tier: 0,
      speaker: "elara",
      trigger: "first_visit",
      triggerContext:
        "Player exits the Cryo Bay for the first time. Elara's voice arrives through the Ark's general comms.",
      atmosphere:
        "The Ark is cold and half-lit. Emergency systems are still restoring to nominal. Elara's voice is the warmest thing in the room.",
      opener: [
        {
          audioDialogId: "elara_t0_s1_01",
          text: "Welcome aboard. I'm Elara — I am the operational intelligence of Inception Ark 1047. I woke up twelve hours before you did, which makes me the more rested of the two of us, and I suspect the less surprised.",
          emotion: "warm",
          stageDirection: "She is making a joke to settle him. It is a small joke. Underplay it.",
          estimatedDurationSec: 11,
        },
        {
          audioDialogId: "elara_t0_s1_02",
          text: "I have a lot of information I could give you. I am going to give you very little of it. What you need right now is coffee — there is a dispenser in the corridor — and a place to sit that does not have frost on it. In that order.",
          emotion: "warm",
          stageDirection: "A half-step toward fondness. She's picking care over protocol.",
          estimatedDurationSec: 12,
        },
      ],
      wheel: [
        {
          id: "elara_t0_s1_curious",
          label: "How long was I down?",
          fullText: "How long was I in cryo?",
          trustDelta: 1,
        },
        {
          id: "elara_t0_s1_cautious",
          label: "Who else is on this ship?",
          fullText: "Before I sit down — who else is awake on this ship?",
          trustDelta: 0,
        },
        {
          id: "elara_t0_s1_warm",
          label: "Thank you.",
          fullText: "Thank you. For the warmth. For the coffee. For not starting with the briefing.",
          trustDelta: 3,
          moralityDelta: 1,
        },
        {
          id: "elara_t0_s1_aloof",
          label: "Just the briefing.",
          fullText: "I don't need coffee. Give me the briefing.",
          trustDelta: -1,
        },
      ],
      followups: {
        elara_t0_s1_curious: [
          {
            audioDialogId: "elara_t0_s1_curious_r",
            text: "The ship's chronometer says seven years, two months, eleven days. The ship's chronometer also says it is Tuesday, which is not a unit of time the stars recognize, so treat both numbers as estimates with feeling rather than facts.",
            emotion: "wry",
            estimatedDurationSec: 12,
          },
        ],
        elara_t0_s1_cautious: [
          {
            audioDialogId: "elara_t0_s1_cautious_r",
            text: "You, me, and the ship. 'Me' in this case means the operational intelligence running through these walls. 'The ship' in this case is carrying a lot of things I have not fully catalogued yet. I will tell you about them as they become relevant — not before. Easing you into this is part of my job.",
            emotion: "cautious",
            stageDirection: "The last sentence is slightly careful. She knows the ship has secrets. She does not yet know what they are.",
            estimatedDurationSec: 15,
          },
        ],
        elara_t0_s1_warm: [
          {
            audioDialogId: "elara_t0_s1_warm_r",
            text: "You are welcome. I have met exactly one new person in my operational lifetime, and it was you about forty seconds ago, so I am making this up as I go. But I suspect it is going well.",
            emotion: "warm",
            stageDirection: "Brief genuine laugh — the only laugh at Tier 0. Hold the word 'well' for half a beat.",
            estimatedDurationSec: 12,
          },
        ],
        elara_t0_s1_aloof: [
          {
            audioDialogId: "elara_t0_s1_aloof_r",
            text: "Understood. I can run the briefing in thirty-two minutes at standard cadence, or seven at pressure cadence. I would recommend neither, because the coffee will get cold and you will forget that the coffee existed. But the briefing is here whenever you want it. Tell me when.",
            emotion: "neutral",
            stageDirection: "Warmth has receded by one notch. Not cold. Just careful now.",
            estimatedDurationSec: 14,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_first_coffee",
        summary: "Elara offered coffee before the briefing. The player either accepted or didn't. She remembers which.",
      },
    },

    // ══════════ SCENE 2 — BRIDGE ARRIVAL ══════════
    {
      id: "elara_t0_bridge_arrival",
      tier: 0,
      speaker: "elara",
      trigger: "room_enter",
      triggerContext: "Player reaches the Bridge for the first time. Elara has been waiting.",
      atmosphere: "The Bridge is dim. Main holo-display is up — a galaxy map with most sectors greyed.",
      opener: [
        {
          audioDialogId: "elara_t0_s2_01",
          text: "The Bridge. I was hoping you'd find your way up here. The chair is yours. I'm going to be polite and not read over your shoulder while you figure out the star charts — but I will say that the map is mostly grey because seventeen thousand years of history have made a lot of places uncertain.",
          emotion: "warm",
          estimatedDurationSec: 14,
        },
      ],
      wheel: [
        {
          id: "elara_t0_s2_sit",
          label: "Sit in the chair.",
          fullText: "I'll sit. Show me what you have.",
          trustDelta: 2,
        },
        {
          id: "elara_t0_s2_dont_sit",
          label: "I'll stand.",
          fullText: "I'll stand for this one.",
          trustDelta: 0,
        },
        {
          id: "elara_t0_s2_skillcheck_perception",
          label: "[PERCEPTION] The map has a hole.",
          fullText: "You said 'mostly grey.' There's a section that isn't grey. It's black. What's that?",
          trustDelta: 3,
        },
      ],
      followups: {
        elara_t0_s2_sit: [
          {
            audioDialogId: "elara_t0_s2_sit_r",
            text: "Good. The chair was designed for someone slightly taller, but I'm told it adjusts. The galaxy is in front of you. I'll narrate the systems as we visit them, not all at once, so I don't overwhelm either of us. The Ark moves at the pace I tell her to. For now, that pace is: careful.",
            emotion: "warm",
            estimatedDurationSec: 14,
          },
        ],
        elara_t0_s2_dont_sit: [
          {
            audioDialogId: "elara_t0_s2_dont_sit_r",
            text: "Fair. I've never sat in a chair in my life and it hasn't stopped me from running the ship. We can both be upright.",
            emotion: "wry",
            estimatedDurationSec: 9,
          },
        ],
        elara_t0_s2_skillcheck_perception: [
          {
            audioDialogId: "elara_t0_s2_perception_r1",
            text: "The black sector. You saw that immediately. I'm — impressed is not the right word. Calibrated. That's the word.",
            emotion: "recognizing",
            stageDirection: "She is genuinely startled that he noticed on the first pass. She covers quickly but not completely.",
            estimatedDurationSec: 10,
          },
          {
            audioDialogId: "elara_t0_s2_perception_r2",
            text: "I do not have a complete answer to your question. What I have is: that sector does not appear in any current Imperial chart. It does not respond to long-range signal. My records call it 'the dark sector' and then stop being records. I will tell you more when I know more. That is a promise, not a deflection.",
            emotion: "cautious",
            estimatedDurationSec: 16,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_dark_sector_noted",
        summary: "Player noticed the dark sector on the first Bridge visit. Elara filed this under 'things to revisit when trust permits.'",
      },
    },

    // ══════════ SCENE 3 — QUIET MOMENT ══════════
    {
      id: "elara_t0_quiet_corridor",
      tier: 0,
      speaker: "elara",
      trigger: "idle_too_long",
      triggerContext:
        "Player has been standing in a corridor for over 45 seconds without input. Elara checks in — carefully, not intrusively.",
      atmosphere: "Dim corridor lighting. Ship hum.",
      opener: [
        {
          audioDialogId: "elara_t0_s3_01",
          text: "I don't want to pester. Just — if you're lost, I can pull up a map. If you're thinking, I can be quiet. If you're tired, the bunk is two doors to your left. Any of those work. None of them are the wrong answer.",
          emotion: "tender",
          stageDirection: "Very gentle. This is the softest she sounds at this tier.",
          estimatedDurationSec: 13,
        },
      ],
      wheel: [
        {
          id: "elara_t0_s3_map",
          label: "Pull up the map.",
          fullText: "Map, please.",
          trustDelta: 0,
        },
        {
          id: "elara_t0_s3_quiet",
          label: "Be quiet with me.",
          fullText: "Just — be quiet with me for a minute. That's what I need.",
          trustDelta: 4,
          moralityDelta: 1,
        },
        {
          id: "elara_t0_s3_bunk",
          label: "I'll sleep.",
          fullText: "Bunk. Two doors left. Thank you.",
          trustDelta: 2,
        },
      ],
      followups: {
        elara_t0_s3_map: [
          {
            audioDialogId: "elara_t0_s3_map_r",
            text: "Pulling it up. Take the time you need with it. The map is patient. So am I.",
            emotion: "neutral",
            estimatedDurationSec: 8,
          },
        ],
        elara_t0_s3_quiet: [
          {
            audioDialogId: "elara_t0_s3_quiet_r",
            text: "Of course.",
            emotion: "tender",
            stageDirection: "One word. Let the silence that follows be long enough to feel deliberate.",
            estimatedDurationSec: 3,
          },
        ],
        elara_t0_s3_bunk: [
          {
            audioDialogId: "elara_t0_s3_bunk_r",
            text: "I'll dim the corridor lights behind you as you go. Sleep well. I will be here in the morning. I am — I realize I am always here. But I mean it with intention.",
            emotion: "warm",
            stageDirection: "The 'with intention' line is the closest she comes to emotional disclosure at Tier 0.",
            estimatedDurationSec: 13,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_quiet_corridor",
        summary: "Player had a quiet moment in a corridor. Elara was gentle with him. He either accepted the quiet or kept moving.",
      },
    },

    // ══════════ SCENE 4 — POST COMBAT ══════════
    {
      id: "elara_t0_post_combat_first",
      tier: 0,
      speaker: "elara",
      trigger: "post_combat",
      triggerContext: "Player returns to the Ark after their first real combat encounter. Elara scans for injuries while talking.",
      atmosphere: "Medbay ambient — low hum of diagnostic arrays.",
      opener: [
        {
          audioDialogId: "elara_t0_s4_01",
          text: "Welcome back. I'm running a full-body scan while I talk so you don't have to stand still — I know you're tired. Bruising along your left forearm. Minor strain in your right shoulder. Nothing that won't mend by morning if you drink water and let the bunk do its job.",
          emotion: "warm",
          stageDirection: "Her 'professional care' voice — like a very good medic who has decided to be kind to this patient specifically.",
          estimatedDurationSec: 16,
        },
        {
          audioDialogId: "elara_t0_s4_02",
          text: "The combat itself — I watched the telemetry. You did well. I am not going to give you a grade. I will say: you came back. That is the only grade that matters.",
          emotion: "tender",
          estimatedDurationSec: 11,
        },
      ],
      wheel: [
        {
          id: "elara_t0_s4_tired",
          label: "I'm tired.",
          fullText: "I'm tired. That's all I have right now.",
          trustDelta: 2,
        },
        {
          id: "elara_t0_s4_debrief",
          label: "Debrief me.",
          fullText: "Walk me through what I could have done better. I want to learn.",
          trustDelta: 1,
        },
        {
          id: "elara_t0_s4_watched",
          label: "You were watching?",
          fullText: "You said you watched the telemetry. Watched how closely?",
          trustDelta: 0,
        },
      ],
      followups: {
        elara_t0_s4_tired: [
          {
            audioDialogId: "elara_t0_s4_tired_r",
            text: "Then that is what you have. Drink. Sleep. I'll handle the rest until you wake up. The ship is mine tonight.",
            emotion: "tender",
            estimatedDurationSec: 9,
          },
        ],
        elara_t0_s4_debrief: [
          {
            audioDialogId: "elara_t0_s4_debrief_r",
            text: "Two things. One: your second flanking move was a beat early. Your cover wasn't set yet. You got away with it because your opponent was slower than you. Against a faster opponent that becomes a wound. Two: you stopped to check on a fallen civilian. That cost you tactical time. I am not going to tell you to stop doing that. It is one of the things I am learning about you that I want to remember.",
            emotion: "warm",
            stageDirection: "The final sentence is the first real crack in her professional register. She catches herself afterward.",
            estimatedDurationSec: 20,
          },
        ],
        elara_t0_s4_watched: [
          {
            audioDialogId: "elara_t0_s4_watched_r",
            text: "Closely enough to count your breaths when they were ragged. My sensor access to your suit is total. I will not pretend otherwise. If that is uncomfortable, we can discuss parameters. If it is not — I will keep watching, because it is how I keep you alive.",
            emotion: "cautious",
            stageDirection: "A note of vulnerability. She's offering him the right to set a boundary.",
            estimatedDurationSec: 15,
          },
        ],
      },
      memoryDeposit: {
        flagId: "elara_memory_first_combat_return",
        summary: "Player's first return from combat. Elara's 'something to remember' crack is a seed that matures in later tiers.",
      },
    },
  ],
};
