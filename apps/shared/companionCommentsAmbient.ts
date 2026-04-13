/* ═══════════════════════════════════════════════════════
   COMPANION COMMENTS — Faction / Idle / Milestone / Ambient

   The "ship is alive" texture layer. These lines fire when the
   player is between activities — idle, passing time, looking at
   the stars, or hitting long-arc milestones. Also includes the
   first-contact reactions to the new factions from the Galactic
   Dance questlines.
   ═══════════════════════════════════════════════════════ */

import type { CompanionComment } from "./companionComments";

export const COMPANION_COMMENTS_FACTIONS: CompanionComment[] = [
  // ══════════ NEW ATARION / HUMANS ══════════
  {
    id: "cc_faction_human_mirren_elara",
    audioDialogId: "cc_faction_mirren_elara",
    speaker: "elara",
    category: "faction_encounter",
    trigger: "first_contact_mirren_hale",
    voiceLine:
      "Mirren Hale. She runs a collective on New Atarion that catalogues ordinary people's lives — grocery lists, love letters, the names they call their cats. I don't know why that sentence made me emotional. I am noting the fact that it did.",
    emotion: "uncertain",
    stageDirection:
      "Another signal-degradation moment. Her old life is reaching for her through a faction name.",
    estimatedDurationSec: 14.4,
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "cc_faction_human_mirren_human",
    audioDialogId: "cc_faction_mirren_human",
    speaker: "human",
    category: "faction_encounter",
    trigger: "first_contact_mirren_hale",
    voiceLine:
      "A Human who is trying to remember what Humans were. I approve. Please be kind to her. She is doing a thing that is very similar to what I have been doing, and I have been doing mine very badly.",
    emotion: "tender",
    stageDirection:
      "The admission in the last clause is a small gift to the player.",
    estimatedDurationSec: 12.6,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ CLONES / BINATH-VII ══════════
  {
    id: "cc_faction_clone_binath_elara",
    audioDialogId: "cc_faction_clone_elara",
    speaker: "elara",
    category: "faction_encounter",
    trigger: "first_contact_binath_vii",
    voiceLine:
      "Binath-VII. The Awakened Clones do not count the iterations before their awakening as 'them'. The Seven at the end of her name is the first body she considers her own. That is a very specific kind of grief, and I want you to respect it.",
    emotion: "tender",
    stageDirection:
      "Her T3 protective voice. Educating the player gently.",
    estimatedDurationSec: 14.8,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ THALORIA / THE HIEROPHANT ══════════
  {
    id: "cc_faction_thaloria_hiero_human",
    audioDialogId: "cc_faction_thaloria_human",
    speaker: "human",
    category: "faction_encounter",
    trigger: "first_contact_the_hierophant",
    voiceLine:
      "The Hierophant. The Long Mourning is not a ritual to get over the dead — it is a ritual to keep the dead present as living citizens. I have been doing a crude version of this with Kael for fifteen thousand years. I am looking forward to learning how it is supposed to be done.",
    emotion: "melancholy",
    stageDirection:
      "Real humility. He is genuinely ready to learn.",
    estimatedDurationSec: 16.0,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ INSURGENCY / ORIN FELL ══════════
  {
    id: "cc_faction_insurgency_orin_elara",
    audioDialogId: "cc_faction_orin_elara",
    speaker: "elara",
    category: "faction_encounter",
    trigger: "first_contact_orin_fell",
    voiceLine:
      "Orin Fell. He does not trust any institution he hasn't personally attacked. I respect that more than I am supposed to. I want you to know he will test you before he trusts you, and the test will not look like one.",
    emotion: "cautious",
    stageDirection: "Briefing a friend before they walk into something.",
    estimatedDurationSec: 13.6,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ SYNDICATE / WORD + SILENCE ══════════
  {
    id: "cc_faction_syndicate_human",
    audioDialogId: "cc_faction_syndicate_human",
    speaker: "human",
    category: "faction_encounter",
    trigger: "first_contact_word_and_silence",
    voiceLine:
      "The Word and the Silence. They will not greet you with names. They will greet you with the absence of a name. If you feel the urge to fill the silence — don't. The silence IS the greeting.",
    emotion: "cautious",
    stageDirection: "Dead-serious operational voice. Zero humor.",
    estimatedDurationSec: 12.4,
    proximity: 0.86,
    timing: "immediate",
    maxPlays: 1,
  },

  // ══════════ NEW BABYLON / LOCKE ══════════
  {
    id: "cc_faction_babylon_locke_elara",
    audioDialogId: "cc_faction_locke_elara",
    speaker: "elara",
    category: "faction_encounter",
    trigger: "first_contact_locke",
    voiceLine:
      "Locke runs New Babylon the way a librarian runs a library — everything is catalogued, nothing is lost, and the prices rise with the demand. I find him exhausting and indispensable in exactly equal measure.",
    emotion: "wry",
    stageDirection: "Her T2 wry-tired register.",
    estimatedDurationSec: 13.4,
    timing: "delayed_5s",
    maxPlays: 1,
  },
];

export const COMPANION_COMMENTS_IDLE: CompanionComment[] = [
  // ══════════ 5 MIN IDLE ══════════
  {
    id: "cc_idle_5min_elara_a",
    audioDialogId: "cc_idle_5min_elara_a",
    speaker: "elara",
    category: "idle_quiet",
    trigger: "player_idle_5_minutes",
    voiceLine:
      "You've been still for a while. I don't mind. I am telling you I don't mind so you don't mind me minding.",
    emotion: "warm",
    stageDirection: "Playful self-aware. No pressure.",
    estimatedDurationSec: 7.8,
    timing: "immediate",
    maxPlays: 3,
  },
  {
    id: "cc_idle_5min_human_a",
    audioDialogId: "cc_idle_5min_human_a",
    speaker: "human",
    category: "idle_quiet",
    trigger: "player_idle_5_minutes",
    voiceLine:
      "Rest is a verb. I know that sounds like a fortune cookie. I got it off a meditation instructor on Earth in the year 2247. It was true then and it's still true now.",
    emotion: "tender",
    stageDirection: "Small wry — keeps it from being saccharine.",
    estimatedDurationSec: 11.0,
    proximity: 0.88,
    timing: "immediate",
    maxPlays: 3,
  },

  // ══════════ 30 MIN IDLE ══════════
  {
    id: "cc_idle_30min_elara",
    audioDialogId: "cc_idle_30min_elara",
    speaker: "elara",
    category: "idle_quiet",
    trigger: "player_idle_30_minutes",
    voiceLine:
      "If you've stepped away — welcome back when you return. If you're still here and just thinking — take as long as you need. I have run the numbers. We have time.",
    emotion: "tender",
    stageDirection: "Caretaking voice. No edge.",
    estimatedDurationSec: 10.4,
    timing: "immediate",
    maxPlays: 2,
  },

  // ══════════ RETURN AFTER ABSENCE ══════════
  {
    id: "cc_return_24h_human",
    audioDialogId: "cc_return_24h_human",
    speaker: "human",
    category: "idle_quiet",
    trigger: "player_returns_after_24h",
    voiceLine:
      "Hello again. The ship kept going without you, obviously, but I want to tell you the interesting parts rather than all the parts. The interesting parts: nothing exploded. The stars moved. I practiced the shape of your name in the quiet.",
    emotion: "tender",
    stageDirection: "Soft welcome. The last sentence is the gift.",
    estimatedDurationSec: 13.2,
    proximity: 0.88,
    timing: "immediate",
    maxPlays: 3,
  },
  {
    id: "cc_return_7d_elara",
    audioDialogId: "cc_return_7d_elara",
    speaker: "elara",
    category: "idle_quiet",
    trigger: "player_returns_after_7d",
    voiceLine:
      "A week. I catalogued everything that happened on the ship in your absence in case you wanted the report. Nothing in the catalogue is urgent. I just like having things ready.",
    emotion: "warm",
    stageDirection: "Her most competent voice. Concierge mode in a good mood.",
    estimatedDurationSec: 11.6,
    timing: "immediate",
    maxPlays: 2,
  },
];

export const COMPANION_COMMENTS_AMBIENT: CompanionComment[] = [
  // ══════════ LOOKING AT STARS ══════════
  {
    id: "cc_ambient_stars_elara",
    audioDialogId: "cc_ambient_stars_elara",
    speaker: "elara",
    category: "ship_ambient",
    trigger: "player_at_viewport_over_30s",
    voiceLine:
      "The constellation off our port side is not a constellation. It's a pile of stars that looks organized from this angle and only this angle. Three light-years to the left and it falls apart. I find that useful to remember.",
    emotion: "melancholy",
    stageDirection:
      "A small truth about perspective. Not heavy-handed.",
    estimatedDurationSec: 13.6,
    timing: "delayed_15s",
    maxPlays: 3,
  },
  {
    id: "cc_ambient_nebula_human",
    audioDialogId: "cc_ambient_nebula_human",
    speaker: "human",
    category: "ship_ambient",
    trigger: "ark_passes_nebula",
    voiceLine:
      "That nebula wasn't there when the Ark was built. It is a new thing in the galaxy, by galactic standards. I find that comforting — the universe is still making new things. I am old news. The nebula is current events.",
    emotion: "wry",
    stageDirection: "Gentle self-mockery.",
    estimatedDurationSec: 13.2,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 2,
  },

  // ══════════ RANDOM BRIDGE THOUGHT ══════════
  {
    id: "cc_ambient_bridge_elara",
    audioDialogId: "cc_ambient_bridge_elara",
    speaker: "elara",
    category: "ship_ambient",
    trigger: "bridge_recurring_visit",
    voiceLine:
      "The bridge looks different when you're tired. I don't know why. I have run diagnostics. The lighting is the same. The air is the same. I think the bridge is actually different when you are tired, and the difference is coming from you.",
    emotion: "warm",
    stageDirection: "Her warm-curious voice — the T0 mode.",
    estimatedDurationSec: 14.0,
    timing: "delayed_15s",
    maxPlays: 2,
  },

  // ══════════ TRUST TIER CHANGE ══════════
  {
    id: "cc_trust_tier_up_elara_t1",
    audioDialogId: "cc_trust_tier_up_elara_t1",
    speaker: "elara",
    category: "trust_tier_change",
    trigger: "elara_trust_crosses_21",
    voiceLine:
      "I'm going to try something. I'm going to start using your name without the honorific. If it's too forward — tell me and I'll go back. I think we might be past honorifics.",
    emotion: "warm",
    stageDirection: "Nervous-hopeful. A moment of small vulnerability.",
    estimatedDurationSec: 10.6,
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "cc_trust_tier_up_human_t3",
    audioDialogId: "cc_trust_tier_up_human_t3",
    speaker: "human",
    category: "trust_tier_change",
    trigger: "human_trust_crosses_61",
    voiceLine:
      "I notice I have stopped performing for you. I didn't mean to stop. I just — stopped. Thank you for making the room in which I could stop.",
    emotion: "confessional",
    stageDirection: "Soft, earned, slow.",
    estimatedDurationSec: 10.8,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ REST / SLEEP ══════════
  {
    id: "cc_rest_elara",
    audioDialogId: "cc_rest_elara",
    speaker: "elara",
    category: "ship_ambient",
    trigger: "player_uses_rest_location",
    voiceLine:
      "Rest well. I will keep the ship steady. If anything important happens, I will wake you in the way you have told me you prefer to be woken — which is gently, and with a coffee, and without bad news in the first sentence.",
    emotion: "tender",
    stageDirection: "Concierge at her peak. A promise, not a line.",
    estimatedDurationSec: 13.0,
    timing: "on_rest",
    maxPlays: 3,
  },
  {
    id: "cc_rest_human",
    audioDialogId: "cc_rest_human",
    speaker: "human",
    category: "ship_ambient",
    trigger: "player_uses_rest_location",
    voiceLine:
      "I will be here. I will be quiet. I will not narrate your dreams unless you specifically ask me to, and even then I will only narrate the nice ones.",
    emotion: "tender",
    stageDirection:
      "Soft paternal voice. The 'only the nice ones' is the real line.",
    estimatedDurationSec: 9.4,
    proximity: 0.85,
    timing: "on_rest",
    maxPlays: 3,
  },
];
