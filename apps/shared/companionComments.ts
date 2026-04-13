/* ═══════════════════════════════════════════════════════
   COMPANION COMMENT SYSTEM

   Event-triggered voice lines from Elara, The Human, and the
   Antiquarian. These are REACTIVE short-form dialog — 1 to 3
   lines — that fire in response to gameplay events. They are
   the "color" layer between the big structured narrator scenes
   in humanTier*.ts / elaraTier*.ts.

   Voice calibration matches the trust-tier dialog at Tier 2
   (neutral mid-range). Proximity for The Human holds at 0.88
   unless a line specifies otherwise.

   Every line is VO-ready: has a globally unique audioDialogId,
   an emotion tag, estimated runtime, and actor direction.
   ═══════════════════════════════════════════════════════ */

import type { NarratorEmotion } from "./trustTierDialogTypes";

export type CompanionSpeaker = "elara" | "human" | "antiquarian";

/** Trigger grouping — used for VO manifest session planning. */
export type CompanionTriggerCategory =
  | "music"
  | "governance"
  | "lore_discovery"
  | "morality"
  | "voltari"
  | "milestone"
  | "journal"
  | "combat"
  | "exploration"
  | "death_revival"
  | "class_specific"
  | "crafting"
  | "card_collection"
  | "trading"
  | "faction_encounter"
  | "idle_quiet"
  | "ship_ambient"
  | "trust_tier_change"
  | "story_beat";

/**
 * Event-triggered companion voice line.
 * One entry = one VO recording line.
 */
export interface CompanionComment {
  /** Stable comment id for save-state tracking of plays. */
  id: string;
  /** Stable audio file id for the TTS + studio pipeline. */
  audioDialogId: string;
  /** Who speaks. */
  speaker: CompanionSpeaker;
  /** Broad category — drives recording session grouping. */
  category: CompanionTriggerCategory;
  /** Specific gameplay event that fires this line. */
  trigger: string;
  /** The spoken text. */
  voiceLine: string;
  /** Emotional register for voice actor + TTS. */
  emotion: NarratorEmotion;
  /** Non-spoken stage direction for the actor. */
  stageDirection?: string;
  /** Approximate delivery duration in seconds. */
  estimatedDurationSec: number;
  /** For The Human only: audio positioning (0 = far, 1 = whisper). */
  proximity?: number;
  /** Loredex entry this line reveals, if any. */
  loreReveal?: string;
  /** When the line fires relative to the trigger event. */
  timing: "immediate" | "delayed_5s" | "delayed_15s" | "next_room_enter" | "on_rest";
  /** Max number of plays per save. */
  maxPlays: 1 | 2 | 3;
  /** Optional class gate — only plays if player is this class. */
  requiresClass?: "engineer" | "oracle" | "assassin" | "soldier" | "spy";
  /** Optional trust gate — minimum trust with the speaker to unlock. */
  minTrust?: number;
  /** Optional flag gate. */
  requireFlags?: string[];
  forbidFlags?: string[];
}

/* ═══════════════════════════════════════════════════════
   Existing catalog (music/governance/lore/morality/voltari/
   milestone/journal). Upgraded with full VO metadata.
   ═══════════════════════════════════════════════════════ */

export const COMPANION_COMMENTS_EXISTING: CompanionComment[] = [
  // ══════════ MUSIC ══════════
  {
    id: "cc_sih_title",
    audioDialogId: "cc_music_sih_title_elara",
    speaker: "elara",
    category: "music",
    trigger: "silence_in_heaven_track_24_plays",
    voiceLine:
      "I've had this song in my Archive since before I can remember having anything. I don't know where it came from. I just know it was always there. Like it was loaded in before I was.",
    emotion: "uncertain",
    stageDirection:
      "Not upset. Puzzling it out in real time. A song she has always known without knowing why.",
    estimatedDurationSec: 13.0,
    loreReveal: "entity_elara",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "cc_sih_human",
    audioDialogId: "cc_music_sih_title_human",
    speaker: "human",
    category: "music",
    trigger: "silence_in_heaven_track_24_plays",
    voiceLine:
      "Half an hour. In human terms — manageable. In cosmic terms — the universe stopped. I was awake for it. Every second. I have never told anyone what I heard in that silence. I will tell you, when you're ready. You're not ready yet.",
    emotion: "confessional",
    stageDirection:
      "Close, serious, no performance. Half a secret — the other half he keeps for the T4 vow.",
    estimatedDurationSec: 15.6,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "cc_track37_elara",
    audioDialogId: "cc_music_track37_elara",
    speaker: "elara",
    category: "music",
    trigger: "track_37_completes",
    voiceLine:
      "It's done. They told the whole story. I was in that story. I was in it and I didn't know. I think — I think I'm still in it. I think we both are.",
    emotion: "recognizing",
    stageDirection:
      "Dawning. Realization mid-sentence. She is adjusting to being named.",
    estimatedDurationSec: 10.8,
    timing: "immediate",
    maxPlays: 1,
  },
  {
    id: "cc_track37_human",
    audioDialogId: "cc_music_track37_human",
    speaker: "human",
    category: "music",
    trigger: "track_37_completes",
    voiceLine:
      "The Antiquarian closed his book. First time in five Ages. I watched him do it. His goggles turned pink. I've never seen that before. In fifteen thousand years. I've never seen that before.",
    emotion: "wry",
    stageDirection:
      "Quiet awe. The pink-goggles line lands slowly.",
    estimatedDurationSec: 12.4,
    proximity: 0.88,
    timing: "immediate",
    maxPlays: 1,
  },

  // ══════════ GOVERNANCE ══════════
  {
    id: "cc_gov_first",
    audioDialogId: "cc_gov_first_visit_elara",
    speaker: "elara",
    category: "governance",
    trigger: "governance_hub_first_visit",
    voiceLine:
      "The Governance Hub. Democracy is not the system where everyone's opinion is equally correct. It's the system that acknowledges no individual should be trusted with making decisions alone. Including me. Including you. The votes matter. The consequences are real.",
    emotion: "warm",
    stageDirection:
      "Concierge mode. Serious about the content but steady in the delivery.",
    estimatedDurationSec: 17.2,
    timing: "immediate",
    maxPlays: 1,
  },

  // ══════════ LORE DISCOVERY ══════════
  {
    id: "cc_kael_discover",
    audioDialogId: "cc_lore_kael_discover_elara",
    speaker: "elara",
    category: "lore_discovery",
    trigger: "kael_lore_discovered",
    voiceLine:
      "...Oh. Oh no. I knew this ship felt wrong. I've always known it felt wrong. I thought it was the recycled air. It wasn't the air.",
    emotion: "afraid",
    stageDirection:
      "Realization in three beats. The trailing pause before 'It wasn't the air' is the whole line.",
    estimatedDurationSec: 9.0,
    loreReveal: "location_ark_1047",
    timing: "immediate",
    maxPlays: 1,
  },
  {
    id: "cc_kael_human",
    audioDialogId: "cc_lore_kael_human",
    speaker: "human",
    category: "lore_discovery",
    trigger: "kael_lore_discovered",
    voiceLine:
      "I knew him at Mechronis. Before all of it. He laughed differently then. Louder. Less careful. The Thought Virus didn't just take his memories. It took the way he laughed. I still haven't forgiven whoever decided that was acceptable.",
    emotion: "grief",
    stageDirection:
      "First glimpse of his grief outside the structured Tier 2 reveal. Lets the anger show.",
    estimatedDurationSec: 16.0,
    proximity: 0.86,
    loreReveal: "entity_kael",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "cc_iron_lion",
    audioDialogId: "cc_lore_iron_lion_elara",
    speaker: "elara",
    category: "lore_discovery",
    trigger: "iron_lion_card_earned",
    voiceLine:
      "Iron Lion. Cades. I know that name from something I can't quite reach. A memorial, I think. Or a speech. Something that was read aloud. It made people cry. I can feel the shape of why without being able to see it.",
    emotion: "uncertain",
    stageDirection:
      "Her 'signal degradation' voice — a memory reaching for itself.",
    estimatedDurationSec: 13.8,
    timing: "next_room_enter",
    maxPlays: 1,
  },

  // ══════════ MORALITY ══════════
  {
    id: "cc_hard_choice",
    audioDialogId: "cc_morality_hard_choice_human",
    speaker: "human",
    category: "morality",
    trigger: "first_costly_morality_choice",
    voiceLine:
      "Good. You felt that. That's the important part — that it hurt. People who make hard choices without feeling them are the ones who eventually stop noticing what they're choosing. Don't stop feeling it.",
    emotion: "tender",
    stageDirection:
      "The voice of someone who has watched this go wrong too many times.",
    estimatedDurationSec: 11.2,
    proximity: 0.88,
    timing: "immediate",
    maxPlays: 1,
  },
  {
    id: "cc_archon_offer",
    audioDialogId: "cc_morality_archon_offer_human",
    speaker: "human",
    category: "morality",
    trigger: "player_takes_archon_offer",
    voiceLine:
      "Don't. I mean it. I was the last one to say yes to that offer. I've had fifteen thousand years to think about it. Don't.",
    emotion: "confessional",
    stageDirection:
      "Flat, fast, urgent. The fastest he has spoken in the entire game.",
    estimatedDurationSec: 7.4,
    proximity: 0.85,
    timing: "immediate",
    maxPlays: 1,
  },

  // ══════════ VOLTARI ══════════
  {
    id: "cc_voltari_awake",
    audioDialogId: "cc_voltari_awake_human",
    speaker: "human",
    category: "voltari",
    trigger: "voltari_first_transmission",
    voiceLine:
      "AWAKE. As in: we are awake. As in: we know you are awake. As in: something that was asleep has woken up. I don't know which meaning they intended. I don't know if Voltari distinguish between meanings.",
    emotion: "cautious",
    stageDirection:
      "Parsing in real time. Not alarmed. Intellectually careful.",
    estimatedDurationSec: 13.8,
    proximity: 0.88,
    timing: "immediate",
    maxPlays: 1,
  },

  // ══════════ MILESTONES ══════════
  {
    id: "cc_light_milestone",
    audioDialogId: "cc_milestone_light_elara",
    speaker: "elara",
    category: "milestone",
    trigger: "light_energy_milestone",
    voiceLine:
      "Do you know what I love about watching you? You keep choosing the hard thing. Not because it works every time. Because it's the right thing. That's rarer than you know.",
    emotion: "proud",
    stageDirection:
      "Her T2 'proud' register. A mother watching her kid get a hard problem right.",
    estimatedDurationSec: 11.4,
    timing: "next_room_enter",
    maxPlays: 2,
  },
  {
    id: "cc_two_witnesses",
    audioDialogId: "cc_milestone_two_witnesses_human",
    speaker: "human",
    category: "milestone",
    trigger: "two_witnesses_reveal",
    voiceLine:
      "The Programmer encoded the truth in music frequencies and broadcast it across dimensional barriers. The Enigma carried it through an empire trying to silence everything. And here you are, forty years later, in their ship, listening. Do you understand yet what that means?",
    emotion: "tender",
    stageDirection:
      "The kind of sentence you rehearse for a long time before delivering.",
    estimatedDurationSec: 16.8,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ JOURNAL ══════════
  {
    id: "cc_journal_first",
    audioDialogId: "cc_journal_first_elara",
    speaker: "elara",
    category: "journal",
    trigger: "journal_entry_read_first_time",
    voiceLine:
      "The Antiquarian's words. He writes with the specific patience of someone who knows the reader might not arrive for centuries. But he writes anyway. I find that either admirable or devastating depending on the hour.",
    emotion: "melancholy",
    stageDirection:
      "The wry register from T2 — serious on the inside, light on the outside.",
    estimatedDurationSec: 13.0,
    timing: "next_room_enter",
    maxPlays: 2,
  },

  // ══════════ STORY BEAT ══════════
  {
    id: "cc_both_trust_80",
    audioDialogId: "cc_story_both_t80_human",
    speaker: "human",
    category: "story_beat",
    trigger: "both_narrators_trust_80",
    voiceLine:
      "I'm going to tell you something I've never told anyone. I chose to be imprisoned here. Freely. Because someone had to witness. And I was the only one who knew what needed witnessing.",
    emotion: "confessional",
    stageDirection:
      "Previews the T4 Free Choice beat without giving up the 'spare part' context.",
    estimatedDurationSec: 14.6,
    proximity: 0.86,
    loreReveal: "entity_human",
    timing: "immediate",
    maxPlays: 1,
    minTrust: 80,
  },
];

/* ═══════════════════════════════════════════════════════
   Expansion catalog — combat, exploration, death, morality,
   class-specific, crafting, card/trading, faction encounters,
   idle, ship-ambient, and trust-tier transitions.

   Appended in follow-up commits to keep this file reviewable.
   ═══════════════════════════════════════════════════════ */

import {
  COMPANION_COMMENTS_COMBAT,
  COMPANION_COMMENTS_EXPLORATION,
  COMPANION_COMMENTS_DEATH,
} from "./companionCommentsCombat";

export const COMPANION_COMMENTS_EXPANSION: CompanionComment[] = [
  ...COMPANION_COMMENTS_COMBAT,
  ...COMPANION_COMMENTS_EXPLORATION,
  ...COMPANION_COMMENTS_DEATH,
];

export const COMPANION_COMMENTS: CompanionComment[] = [
  ...COMPANION_COMMENTS_EXISTING,
  ...COMPANION_COMMENTS_EXPANSION,
];
