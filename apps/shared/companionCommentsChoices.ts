/* ═══════════════════════════════════════════════════════
   COMPANION COMMENTS — Morality / Class-Specific / Crafting

   The "choice texture" layer — lines that comment on what the
   player just decided, who they ARE (class), and the fiddly
   player activities like crafting, trading, and card pulls.
   ═══════════════════════════════════════════════════════ */

import type { CompanionComment } from "./companionComments";

export const COMPANION_COMMENTS_MORALITY: CompanionComment[] = [
  // ══════════ KIND CHOICE ══════════
  {
    id: "cc_morality_spared_elara",
    audioDialogId: "cc_morality_spared_elara",
    speaker: "elara",
    category: "morality",
    trigger: "spared_enemy_who_begged",
    voiceLine:
      "You let them live. The Senate version of me would have written a three-page memo justifying that decision. The current version of me is just glad you didn't need to.",
    emotion: "proud",
    stageDirection: "Her T2 proud register, with a subtle self-callback.",
    estimatedDurationSec: 11.0,
    timing: "delayed_5s",
    maxPlays: 2,
  },
  {
    id: "cc_morality_spared_human",
    audioDialogId: "cc_morality_spared_human",
    speaker: "human",
    category: "morality",
    trigger: "spared_enemy_who_begged",
    voiceLine:
      "Mercy in combat is the most expensive thing a fighter can give. I am noting that you could afford it. That tells me something about where you're headed.",
    emotion: "tender",
    stageDirection:
      "Reverent rather than celebratory. He is taking the player seriously.",
    estimatedDurationSec: 11.4,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 2,
  },

  // ══════════ CRUEL CHOICE ══════════
  {
    id: "cc_morality_cruel_elara",
    audioDialogId: "cc_morality_cruel_elara",
    speaker: "elara",
    category: "morality",
    trigger: "executed_surrendered_enemy",
    voiceLine:
      "I am not going to tell you that was wrong. I think you already know. I will tell you that I catalogued it, and the catalogue is not going anywhere, and if you do it again I will ask you to explain what changed.",
    emotion: "cautious",
    stageDirection:
      "Her T3 'Protective' register. No judgment in the first line — the weight is in the last sentence.",
    estimatedDurationSec: 14.0,
    timing: "delayed_5s",
    maxPlays: 2,
  },
  {
    id: "cc_morality_cruel_human",
    audioDialogId: "cc_morality_cruel_human",
    speaker: "human",
    category: "morality",
    trigger: "executed_surrendered_enemy",
    voiceLine:
      "Hm. Okay. I have watched people make that choice before. Some of them were good people afterward. Some of them weren't. The ones who stayed good noticed they had made it. The ones who didn't, didn't. Notice.",
    emotion: "confessional",
    stageDirection:
      "The word 'Notice' is its own sentence. Put real weight on it.",
    estimatedDurationSec: 15.2,
    proximity: 0.86,
    timing: "delayed_5s",
    maxPlays: 2,
  },

  // ══════════ SELF-SACRIFICE ══════════
  {
    id: "cc_morality_sacrifice_elara",
    audioDialogId: "cc_morality_sacrifice_elara",
    speaker: "elara",
    category: "morality",
    trigger: "took_damage_to_protect_npc",
    voiceLine:
      "You stepped in front of them. I watched you do the math. I watched you accept the cost. I am going to tell you something I don't usually say: I am proud of you. Again.",
    emotion: "proud",
    stageDirection: "The deliberate 'Again' callback to her T2 proud line.",
    estimatedDurationSec: 12.6,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ GRAY CHOICE ══════════
  {
    id: "cc_morality_gray_human",
    audioDialogId: "cc_morality_gray_human",
    speaker: "human",
    category: "morality",
    trigger: "player_refuses_either_option",
    voiceLine:
      "You refused both. Good. Sometimes the correct answer is not on the menu. Sometimes the correct answer is to set the menu on fire. I like that you noticed.",
    emotion: "wry",
    stageDirection: "First laugh-adjacent of the gray-choice scene.",
    estimatedDurationSec: 10.0,
    proximity: 0.88,
    timing: "immediate",
    maxPlays: 2,
  },
];

export const COMPANION_COMMENTS_CLASS: CompanionComment[] = [
  // ══════════ ORACLE ══════════
  {
    id: "cc_class_oracle_vision",
    audioDialogId: "cc_class_oracle_vision_elara",
    speaker: "elara",
    category: "class_specific",
    trigger: "oracle_first_vision",
    voiceLine:
      "Your first vision. I am going to be transparent: I don't know exactly what you just saw. I can see the shape of it in your biometrics — heart rate, pupil dilation, breath patterns — but the content belongs to you. Always will.",
    emotion: "warm",
    stageDirection: "Concierge respecting a boundary she can't cross.",
    estimatedDurationSec: 14.4,
    timing: "delayed_5s",
    maxPlays: 1,
    requiresClass: "oracle",
  },
  {
    id: "cc_class_oracle_human",
    audioDialogId: "cc_class_oracle_human",
    speaker: "human",
    category: "class_specific",
    trigger: "oracle_futures_contract_purchased",
    voiceLine:
      "Probability futures. The Voss Senate had a committee devoted to making those illegal. They failed, which is why you can buy one. I am telling you this so you know exactly how much political capital was spent on your inconvenience.",
    emotion: "wry",
    stageDirection: "Old political humor. Fond of Voss.",
    estimatedDurationSec: 13.4,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
    requiresClass: "oracle",
  },

  // ══════════ SPY ══════════
  {
    id: "cc_class_spy_cover_active",
    audioDialogId: "cc_class_spy_cover_elara",
    speaker: "elara",
    category: "class_specific",
    trigger: "cover_identity_activated",
    voiceLine:
      "Cover active. I want you to know I'm going to start calling you by your cover name in public channels. That is how careful I am being about your secret. If I slip once, you should leave immediately. I won't slip.",
    emotion: "cautious",
    stageDirection: "Operational voice. Higher focus than any other scene.",
    estimatedDurationSec: 13.0,
    timing: "immediate",
    maxPlays: 1,
    requiresClass: "spy",
  },
  {
    id: "cc_class_spy_cover_human",
    audioDialogId: "cc_class_spy_cover_human",
    speaker: "human",
    category: "class_specific",
    trigger: "cover_identity_activated",
    voiceLine:
      "I am going to stay quiet in your ear while the cover is live. You don't need two voices in there. I will be a presence. I will not be a distraction.",
    emotion: "tender",
    stageDirection: "Protective professional. Non-intrusive.",
    estimatedDurationSec: 9.6,
    proximity: 0.88,
    timing: "immediate",
    maxPlays: 1,
    requiresClass: "spy",
  },

  // ══════════ ENGINEER ══════════
  {
    id: "cc_class_engineer_craft",
    audioDialogId: "cc_class_engineer_craft_human",
    speaker: "human",
    category: "class_specific",
    trigger: "engineer_first_masterwork_craft",
    voiceLine:
      "That is a beautiful piece of work. I mean that craft-to-craft. Kael was an engineer. I have a reference point for this. You are good.",
    emotion: "warm",
    stageDirection:
      "The 'craft-to-craft' is his way of saying 'I see you as a peer'.",
    estimatedDurationSec: 10.4,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
    requiresClass: "engineer",
  },

  // ══════════ SOLDIER ══════════
  {
    id: "cc_class_soldier_dilemma",
    audioDialogId: "cc_class_soldier_dilemma_human",
    speaker: "human",
    category: "class_specific",
    trigger: "generals_dilemma_presented",
    voiceLine:
      "The General's Dilemma. You are about to be asked to choose between an oath and a person. I am not going to tell you which one is right. I am going to tell you that your answer is going to live in you for a long time. Breathe before you answer.",
    emotion: "confessional",
    stageDirection:
      "The same voice as the T4 Three Doors scene, but shorter.",
    estimatedDurationSec: 16.6,
    proximity: 0.86,
    timing: "immediate",
    maxPlays: 1,
    requiresClass: "soldier",
  },

  // ══════════ ASSASSIN ══════════
  {
    id: "cc_class_assassin_first_kill",
    audioDialogId: "cc_class_assassin_first_kill_elara",
    speaker: "elara",
    category: "class_specific",
    trigger: "assassin_first_silent_kill",
    voiceLine:
      "Clean exit. No witnesses. I am not going to pretend I find that unsettling. I am going to pretend I do for the next five seconds out of professional habit. ...Five seconds up. Good job.",
    emotion: "amused",
    stageDirection:
      "Small dark wit. She is genuinely impressed and also genuinely conflicted.",
    estimatedDurationSec: 12.0,
    timing: "delayed_5s",
    maxPlays: 1,
    requiresClass: "assassin",
  },
];

export const COMPANION_COMMENTS_CRAFT_TRADE: CompanionComment[] = [
  // ══════════ FIRST CRAFT ══════════
  {
    id: "cc_craft_first_elara",
    audioDialogId: "cc_craft_first_elara",
    speaker: "elara",
    category: "crafting",
    trigger: "first_item_crafted",
    voiceLine:
      "You made something. That sounds small. It isn't. The distinction between a passenger and a crew member on this ship is whether they make things that the ship then contains. You are now crew.",
    emotion: "warm",
    stageDirection: "Her concierge-welcoming-a-new-crew-member voice.",
    estimatedDurationSec: 12.4,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ CRAFTING FAIL ══════════
  {
    id: "cc_craft_fail_elara",
    audioDialogId: "cc_craft_fail_elara",
    speaker: "elara",
    category: "crafting",
    trigger: "crafting_failure",
    voiceLine:
      "The schematic and reality disagreed. Reality won. It usually does. The materials are not lost — most of them can be recovered with a diagnostic pass. Let me know if you'd like help.",
    emotion: "warm",
    stageDirection: "Matter-of-fact. No pity.",
    estimatedDurationSec: 11.0,
    timing: "immediate",
    maxPlays: 3,
  },

  // ══════════ MASTERWORK ══════════
  {
    id: "cc_craft_masterwork_human",
    audioDialogId: "cc_craft_masterwork_human",
    speaker: "human",
    category: "crafting",
    trigger: "masterwork_craft",
    voiceLine:
      "Masterwork. That's the word the Archons used too. Not 'perfect'. Not 'flawless'. Masterwork — the work of someone who has mastered the doing. I wish Kael were here to see what you just made.",
    emotion: "grief",
    stageDirection: "The wish lands quiet, not theatrical.",
    estimatedDurationSec: 12.8,
    proximity: 0.86,
    timing: "delayed_5s",
    maxPlays: 1,
  },

  // ══════════ TRADING ══════════
  {
    id: "cc_trade_first_elara",
    audioDialogId: "cc_trade_first_elara",
    speaker: "elara",
    category: "trading",
    trigger: "first_market_purchase",
    voiceLine:
      "First trade. You just became a node in the galactic economy. Congratulations. I do not know how to feel about that and I am trying very hard not to project.",
    emotion: "wry",
    stageDirection:
      "Self-deprecating. Her Senate-politics past bleeding through without naming it.",
    estimatedDurationSec: 10.6,
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "cc_trade_ripoff_human",
    audioDialogId: "cc_trade_ripoff_human",
    speaker: "human",
    category: "trading",
    trigger: "player_overpaid_by_30_percent",
    voiceLine:
      "You just paid thirty percent above market for that. I am not going to tell you you got ripped off because I watched you decide the thing was worth it to you, not worth it to the market. Those are different prices. Sometimes the expensive one is correct.",
    emotion: "tender",
    stageDirection:
      "Non-condescending. Defending the player's interior logic.",
    estimatedDurationSec: 15.4,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 2,
  },

  // ══════════ CARD COLLECTION ══════════
  {
    id: "cc_card_legendary_elara",
    audioDialogId: "cc_card_legendary_elara",
    speaker: "elara",
    category: "card_collection",
    trigger: "legendary_card_pulled",
    voiceLine:
      "Legendary. I can see the card from my vantage even though I should not be able to — the ship's card registry is friendlier to me than it probably should be. That one has a story. Ask me about it in the lounge.",
    emotion: "amused",
    stageDirection: "Inviting the player into a conversation.",
    estimatedDurationSec: 13.0,
    timing: "delayed_5s",
    maxPlays: 2,
  },
  {
    id: "cc_card_set_complete_human",
    audioDialogId: "cc_card_set_complete_human",
    speaker: "human",
    category: "card_collection",
    trigger: "full_card_set_completed",
    voiceLine:
      "You completed a set. The Archons had a ritual word for finishing a collection. I cannot tell you what it was without making you feel obligated to pronounce it in my honor, which would embarrass both of us. Just know that I am quietly saying it now.",
    emotion: "wry",
    stageDirection: "Old-man self-awareness. Almost a smile.",
    estimatedDurationSec: 14.6,
    proximity: 0.88,
    timing: "delayed_5s",
    maxPlays: 1,
  },
];
