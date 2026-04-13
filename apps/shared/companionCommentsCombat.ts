/* ═══════════════════════════════════════════════════════
   COMPANION COMMENTS — Combat / Exploration / Death

   Three categories that cover the moment-to-moment gameplay
   loop: fighting, moving through the ship, and dying + coming
   back. These are the lines the player will hear most often,
   so they need to degrade gracefully (maxPlays caps, rotation
   across multiple variants).
   ═══════════════════════════════════════════════════════ */

import type { CompanionComment } from "./companionComments";

export const COMPANION_COMMENTS_COMBAT: CompanionComment[] = [
  // ══════════ FIRST BLOOD ══════════
  {
    id: "cc_combat_first_hit",
    audioDialogId: "cc_combat_first_hit_elara",
    speaker: "elara",
    category: "combat",
    trigger: "first_enemy_hit",
    voiceLine:
      "First contact confirmed. Your adrenaline response is within human norms. If it helps — so is mine, and I am technically not supposed to have one.",
    emotion: "wry",
    stageDirection:
      "Concierge mode keeping it steady. The joke is for the player's nerves.",
    estimatedDurationSec: 8.4,
    timing: "immediate",
    maxPlays: 1,
  },
  {
    id: "cc_combat_first_kill",
    audioDialogId: "cc_combat_first_kill_human",
    speaker: "human",
    category: "combat",
    trigger: "first_enemy_killed",
    voiceLine:
      "There. You did a difficult thing. I want to say the obvious thing about it mattering who you kill and why, but you already know that. So instead I'll say: breathe.",
    emotion: "tender",
    stageDirection: "Pastoral voice. Not praising the kill. Steadying the player.",
    estimatedDurationSec: 10.0,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ LOW HP ══════════
  {
    id: "cc_combat_lowhp_1",
    audioDialogId: "cc_combat_lowhp_elara_a",
    speaker: "elara",
    category: "combat",
    trigger: "player_hp_below_25",
    voiceLine:
      "You're in the red. If there is something in your inventory that heals, now would be the moment.",
    emotion: "cautious",
    stageDirection: "Not panicking. Extremely clear.",
    estimatedDurationSec: 6.4,
    timing: "immediate",
    maxPlays: 3,
  },
  {
    id: "cc_combat_lowhp_2",
    audioDialogId: "cc_combat_lowhp_human_a",
    speaker: "human",
    category: "combat",
    trigger: "player_hp_below_10",
    voiceLine:
      "I have watched a lot of things die on this ship. I am not ready to watch you. Move.",
    emotion: "afraid",
    stageDirection:
      "First time his voice gets hard in gameplay. Rare register.",
    estimatedDurationSec: 6.8,
    proximity: 0.85,
    timing: "immediate",
    maxPlays: 2,
  },
  {
    id: "cc_combat_lowhp_3",
    audioDialogId: "cc_combat_lowhp_elara_b",
    speaker: "elara",
    category: "combat",
    trigger: "player_hp_below_10",
    voiceLine:
      "I am going to be direct with you. You are about to die. I do not have a graceful way to say that. Please use a heal.",
    emotion: "afraid",
    stageDirection: "Her concierge voice under genuine alarm.",
    estimatedDurationSec: 8.8,
    timing: "immediate",
    maxPlays: 2,
  },

  // ══════════ FLAWLESS / VICTORY ══════════
  {
    id: "cc_combat_flawless",
    audioDialogId: "cc_combat_flawless_elara",
    speaker: "elara",
    category: "combat",
    trigger: "combat_flawless",
    voiceLine:
      "Untouched. Not a single point of damage. I am making a small note in your file. It is a good note.",
    emotion: "proud",
    stageDirection: "Small smile in the voice. Warm competence.",
    estimatedDurationSec: 8.0,
    timing: "delayed_5s",
    maxPlays: 2,
  },
  {
    id: "cc_combat_victory_tough",
    audioDialogId: "cc_combat_victory_tough_human",
    speaker: "human",
    category: "combat",
    trigger: "combat_victory_under_20_percent_hp",
    voiceLine:
      "You came back from that. I wasn't sure you would. I am going to sit with that for a minute and then stop sitting with it and make a joke, because I cope with good news badly.",
    emotion: "wry",
    stageDirection:
      "The relief is real — the self-deprecation is protective.",
    estimatedDurationSec: 12.0,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "cc_combat_overkill",
    audioDialogId: "cc_combat_overkill_elara",
    speaker: "elara",
    category: "combat",
    trigger: "dealt_5x_overkill_damage",
    voiceLine:
      "That was more damage than the target had. You deleted something twice. I don't think they felt the second one.",
    emotion: "amused",
    stageDirection: "Small amused breath. Not delighted — just observing.",
    estimatedDurationSec: 8.0,
    timing: "delayed_5s",
    maxPlays: 2,
  },

  // ══════════ BOSS INTRO ══════════
  {
    id: "cc_combat_boss_intro_elara",
    audioDialogId: "cc_combat_boss_intro_elara",
    speaker: "elara",
    category: "combat",
    trigger: "boss_encounter_start",
    voiceLine:
      "This one has a name. That's usually not a good sign. It means enough people died here for somebody to bother naming it.",
    emotion: "cautious",
    stageDirection:
      "Warm-concierge briefing voice. She is genuinely worried and hiding it under information.",
    estimatedDurationSec: 9.2,
    timing: "immediate",
    maxPlays: 3,
  },
  {
    id: "cc_combat_boss_intro_human",
    audioDialogId: "cc_combat_boss_intro_human",
    speaker: "human",
    category: "combat",
    trigger: "boss_encounter_start",
    voiceLine:
      "I am not going to narrate this one. I want you thinking about the fight and not about me. I will be here when it is over. Go.",
    emotion: "tender",
    stageDirection: "Pulls his own voice out of the player's ear intentionally.",
    estimatedDurationSec: 8.4,
    proximity: 0.88,
    timing: "immediate",
    maxPlays: 3,
  },
];

export const COMPANION_COMMENTS_EXPLORATION: CompanionComment[] = [
  // ══════════ BRIDGE (recurring ambient) ══════════
  {
    id: "cc_explore_bridge_first",
    audioDialogId: "cc_explore_bridge_first_human",
    speaker: "human",
    category: "exploration",
    trigger: "bridge_first_visit",
    voiceLine:
      "The bridge. This is where Kael used to sit. Second chair from the left. He liked having the viewport on his bad side because it reminded him the window wouldn't mind.",
    emotion: "melancholy",
    stageDirection:
      "A memory detail delivered without dramatizing. The detail is the whole point.",
    estimatedDurationSec: 12.2,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ ENGINE ROOM ══════════
  {
    id: "cc_explore_engine_first",
    audioDialogId: "cc_explore_engine_first_elara",
    speaker: "elara",
    category: "exploration",
    trigger: "engine_room_first_visit",
    voiceLine:
      "Engine room. The Ark's drive hasn't been in primary output mode for longer than I can measure. She's idling. She is very good at idling. I admire her.",
    emotion: "warm",
    stageDirection:
      "Concierge-on-a-tour voice. Calling the ship 'she' without ceremony.",
    estimatedDurationSec: 10.6,
    timing: "immediate",
    maxPlays: 1,
  },
  {
    id: "cc_explore_engine_human",
    audioDialogId: "cc_explore_engine_first_human",
    speaker: "human",
    category: "exploration",
    trigger: "engine_room_first_visit",
    voiceLine:
      "Please don't touch the north bulkhead. I am asking specifically. It is closer to me than the rest of the ship and I would rather you didn't lean on me yet.",
    emotion: "tender",
    stageDirection:
      "First joke about his own imprisonment. Vulnerable-playful.",
    estimatedDurationSec: 9.2,
    proximity: 0.86,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ LAB / MEDBAY ══════════
  {
    id: "cc_explore_lab_first",
    audioDialogId: "cc_explore_lab_first_elara",
    speaker: "elara",
    category: "exploration",
    trigger: "lab_first_visit",
    voiceLine:
      "The lab. One of the few rooms on this ship that smells new. Someone cleaned it recently. I don't know when 'recently' stopped being a useful word to me but here we are.",
    emotion: "wry",
    stageDirection: "Wry-tired — her T2 register.",
    estimatedDurationSec: 11.0,
    timing: "immediate",
    maxPlays: 1,
  },

  // ══════════ CHAPEL / OBSERVATION LOUNGE ══════════
  {
    id: "cc_explore_chapel_first",
    audioDialogId: "cc_explore_chapel_first_human",
    speaker: "human",
    category: "exploration",
    trigger: "observation_lounge_first_visit",
    voiceLine:
      "This is the quietest room on the ship. I mean that technically. The acoustic damping here is four times the rest of the vessel. The Archons used it for — for things you do in a quiet room.",
    emotion: "tender",
    stageDirection:
      "The hesitation on 'things you do in a quiet room' is the real line.",
    estimatedDurationSec: 11.8,
    proximity: 0.88,
    timing: "immediate",
    maxPlays: 1,
  },

  // ══════════ SECRET / HIDDEN ══════════
  {
    id: "cc_explore_secret_elara",
    audioDialogId: "cc_explore_secret_elara",
    speaker: "elara",
    category: "exploration",
    trigger: "secret_room_discovered",
    voiceLine:
      "You found something the ship's registry does not admit exists. I am going to update the registry. Or I am going to leave the registry wrong and let you have the secret. Let me think about it.",
    emotion: "amused",
    stageDirection: "Small conspiratorial smile.",
    estimatedDurationSec: 11.2,
    timing: "immediate",
    maxPlays: 2,
  },

  // ══════════ DEAD END / LOST ══════════
  {
    id: "cc_explore_lost_elara",
    audioDialogId: "cc_explore_lost_elara",
    speaker: "elara",
    category: "exploration",
    trigger: "player_backtracks_3_times_same_room",
    voiceLine:
      "You have passed through this corridor three times. I want to gently suggest that if you would like directions, I have an excellent map function and I have been holding myself back from offering out of respect for your independence.",
    emotion: "wry",
    stageDirection: "Affectionate-helpful. Not condescending.",
    estimatedDurationSec: 12.4,
    timing: "immediate",
    maxPlays: 2,
  },
];

export const COMPANION_COMMENTS_DEATH: CompanionComment[] = [
  // ══════════ FIRST DEATH ══════════
  {
    id: "cc_death_first_elara",
    audioDialogId: "cc_death_first_elara",
    speaker: "elara",
    category: "death_revival",
    trigger: "player_first_death",
    voiceLine:
      "You died. You are back. Those two sentences should not work together and yet here we are. The ship caught you. I don't know why she does that for you. I'm grateful.",
    emotion: "tender",
    stageDirection:
      "Processing this in real time with the player. Not pretending to understand the mechanic.",
    estimatedDurationSec: 13.0,
    timing: "immediate",
    maxPlays: 1,
  },
  {
    id: "cc_death_first_human",
    audioDialogId: "cc_death_first_human",
    speaker: "human",
    category: "death_revival",
    trigger: "player_first_death",
    voiceLine:
      "You felt that one. Don't apologize for feeling it. Death in this ship is a lesson, not a debt. The lesson is: slow down. Pay attention to the room. You are allowed to hide.",
    emotion: "tender",
    stageDirection: "Pastoral. No performance.",
    estimatedDurationSec: 11.6,
    proximity: 0.86,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ THIRD DEATH / STRUGGLING ══════════
  {
    id: "cc_death_struggling_elara",
    audioDialogId: "cc_death_struggling_elara",
    speaker: "elara",
    category: "death_revival",
    trigger: "player_died_3_times_same_encounter",
    voiceLine:
      "I have checked. You are not doing anything wrong. This encounter is genuinely difficult. I am saying this not to flatter you but to give you permission to try a different approach.",
    emotion: "warm",
    stageDirection: "Concierge voice carrying gentle reassurance.",
    estimatedDurationSec: 11.4,
    timing: "immediate",
    maxPlays: 1,
  },
  {
    id: "cc_death_struggling_human",
    audioDialogId: "cc_death_struggling_human",
    speaker: "human",
    category: "death_revival",
    trigger: "player_died_5_times_same_encounter",
    voiceLine:
      "Okay. Step off the ship for a while. Come back later. I will be here. The room will be here. The enemy will be here. Your brain will be fresher. Trust me on this one.",
    emotion: "tender",
    stageDirection: "Direct caregiving voice. Not giving up — redirecting.",
    estimatedDurationSec: 11.2,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ NO-DEATH MILESTONE ══════════
  {
    id: "cc_death_no_deaths_10h",
    audioDialogId: "cc_death_no_deaths_10h_elara",
    speaker: "elara",
    category: "death_revival",
    trigger: "no_deaths_for_10_hours",
    voiceLine:
      "Ten hours. No deaths. I want you to know I have been tracking this against every crew roster that ever boarded a ship of this class. You are in the top percentile. I am aware you cannot see my face right now, but I am making an approving face.",
    emotion: "proud",
    stageDirection: "Peak warm-concierge. Full smile in the voice.",
    estimatedDurationSec: 14.8,
    timing: "delayed_5s",
    maxPlays: 1,
  },
];
