/**
 * Oracle Deck — Batch 3 (cards 16-22). Phase E1d.
 *
 * Covers the final seven Major Arcana equivalents in Dischordian
 * framing, including the deck-terminal card — The Fnord —
 * which has no traditional tarot equivalent and exists as Robert
 * Anton Wilson's contribution to the Oracle Deck in absentia.
 *
 * Cards 16-22:
 *   16. The Tower — The Fall of Reality
 *   17. The Potentials — Hope in cryo
 *   18. The Moon Tyrant — Illusion and fear
 *   19. The Source — Nihilism disguised as mercy
 *   20. Judgment / The Vote — Community decision
 *   21. The Universe — Dischordia itself
 *   22. The Fnord — The card that is not there
 *
 * The Fnord's lore and mechanic are the whole point of the
 * 23-card structure. Without it this is just a slightly opinionated
 * Thoth deck. With it, the deck knows the house always wins and
 * is honest about where the rigging lives.
 */

import type { OracleCard } from "./oracleDeckTypes";

const CARD_16_THE_TOWER: OracleCard = {
  id: 16,
  slug: "tower",
  name: "The Tower",
  arcanum: "tower",
  loreBlurb:
    "The Fall of Reality. The Tower in the traditional deck is a lightning strike that breaks a false structure; the Tower in Dischordia is the Fall itself, the event that took every stable surface on every stable planet and put them through a shredder labeled 'revision.' This card does not care whether you were at fault. The Tower is not about blame. It is about the hour after.",
  uprightMeaning:
    "A structure you were depending on has just come down. The debris is the material for the next thing.",
  reversedMeaning:
    "You are still telling yourself the structure is fine. It is not. Read the card again.",
  buff: {
    label: "The Fall — your opponent's first spell costs 1 more mana.",
    effect: { kind: "extra_mana", amount: 1 },
  },
  oracleNote:
    "I cried while I drew this card. The Architect asked me why and I said because I remembered the sky over Atarion before it went white. He did not answer. For a second I thought he was embarrassed. Probably he was running a different query. It was nice to imagine the first thing.",
  engineerNote:
    "The Tower's effect is the only pure-disruption card in the deck. I tuned it down twice because tarot should not be a weapon. It should be a mirror that occasionally trips your opponent on the way past.",
  unlock: {
    kind: "chapter_complete",
    value: "s1_ch2",
    label: "Complete Chapter 2 — The Fall Remembered",
  },
};

const CARD_17_THE_POTENTIALS: OracleCard = {
  id: 17,
  slug: "potentials",
  name: "The Potentials",
  arcanum: "star",
  loreBlurb:
    "The ten thousand strangers asleep in the cryo vaults. The Star is traditionally the card of hope; the Potentials are hope as an engineering problem. Every body in a tube is a vote for tomorrow cast by someone who did not know they were going to be asked. The card does not guarantee that the vote is counted. It only guarantees that it was cast.",
  uprightMeaning:
    "Hope that is not contingent on being understood. Act as if the future wants you in it.",
  reversedMeaning:
    "Hope held at someone else's pleasure. Do not wait for permission.",
  buff: {
    label: "Cryo Light — heal your general for 3 HP.",
    effect: { kind: "general_hp", amount: 3 },
  },
  oracleNote:
    "This card is the only one I refused to let the Architect look at while I was drawing it. He is allowed to see the rest. He is not allowed to see this one. Not while I am at the easel. Not while I can still stop him.",
  engineerNote:
    "She asked me once what I thought the Potentials were waiting for. I said they were waiting to be remembered by a version of us that had not yet had to earn the right. She said that was exactly correct and I spent the next three days feeling tall.",
  unlock: {
    kind: "lore_milestone",
    value: "cryo_vault_first_visit",
    label: "Visit the Cryo Vault for the first time",
  },
};

const CARD_18_THE_MOON_TYRANT: OracleCard = {
  id: 18,
  slug: "moon_tyrant",
  name: "The Moon Tyrant",
  arcanum: "moon",
  loreBlurb:
    "Illusion and fear, projected from orbit. The Moon in the Thoth deck is the threshold card — the place where the dream dissolves into the unconscious and the dreamer is briefly unable to tell the difference between the two. The Moon Tyrant in Dischordia is the Architect's long-range psy-ops arm, the satellite that casts the anxiety everyone on the ground has learned to call weather. Knowing that doesn't make it weaker. It makes it more effective.",
  uprightMeaning:
    "A fear that is real precisely because you cannot name it. Name it anyway.",
  reversedMeaning:
    "A fear you have named to death. The naming is now the hiding.",
  buff: {
    label: "Dispel — your opponent's first spell has a 25% chance to fizzle.",
    effect: { kind: "reroll_one_card" },
  },
  oracleNote:
    "I put The Moon Tyrant in the deck because I wanted the players to recognize the anxiety they feel without anyone being obviously hostile. The Architect does not scream. He emits a field. The field is the Moon Tyrant. Call it by name and it loses about 15% of its voltage. That is not nothing.",
  engineerNote:
    "Implementing 'chance to fizzle' without making it feel like a dice-roll took me a full afternoon. I ended up making the visual effect look like a lighthouse blink. The player does not see a die.",
  unlock: {
    kind: "chapter_complete",
    value: "s1_ch5",
    label: "Complete Chapter 5 — The Moon Tyrant's Lens",
  },
};

const CARD_19_THE_SOURCE: OracleCard = {
  id: 19,
  slug: "source",
  name: "The Source",
  arcanum: "sun",
  loreBlurb:
    "Nihilism disguised as mercy. The Sun in the traditional deck is joy, warmth, children laughing in a field; the Source is the Sun after it has been convinced by its own public relations team that the field's role is to stop existing so that the light can be better distributed. He is cheerful. He is generous. He is unsurvivable. The card depicts him smiling.",
  uprightMeaning:
    "A generosity that will consume you and call it care. Receive it, and walk away before the offer gets more detailed.",
  reversedMeaning:
    "A generosity with a leash. Cut the leash.",
  buff: {
    label: "Solar Gift — you gain 5 General HP but your next card costs 1 more mana.",
    effect: { kind: "general_hp", amount: 5 },
  },
  oracleNote:
    "The Source is the hardest card in the deck to hate and the hardest to accept a gift from. I wanted the upright to feel warm and the reversed to feel like a hug you did not consent to. Tell me if I got it. Actually, don't. I already know.",
  engineerNote:
    "His card's buff is the only one that simultaneously helps and hurts you. That is The Source in a sentence. I am quite proud of this math.",
  unlock: {
    kind: "chapter_complete",
    value: "s1_ch12",
    label: "Complete Chapter 12 — Meeting The Source",
  },
};

const CARD_20_THE_VOTE: OracleCard = {
  id: 20,
  slug: "vote",
  name: "Judgment / The Vote",
  arcanum: "judgment",
  loreBlurb:
    "A decision made by a community out loud. The Judgment card in the traditional deck is the angel's trumpet call raising the dead; in Dischordia it is the governance vote, where the dead (and the nearly-dead, and the newly-thawed, and everyone else) raise themselves by participating. The card is a reminder that the Saga's universe runs on a ballot box the Architect would rather you forgot about.",
  uprightMeaning:
    "A public decision whose weight you underestimate. Cast your vote as if it counts. It does, and you will be surprised by which direction.",
  reversedMeaning:
    "A public decision you have opted out of. The opting out is itself a vote, in the wrong direction.",
  buff: {
    label: "Community Rising — start the match with an extra mana crystal.",
    effect: { kind: "extra_mana", amount: 1 },
  },
  oracleNote:
    "I wanted the Judgment card to be the card that felt, to a reader, like their opinion mattered. It is easy to build a tarot deck where the cards feel like they are describing the reader's fate. It is hard to build one where the cards feel like the reader is HELPING WRITE the fate. This one tries.",
  engineerNote:
    "Every time a player draws this card we fire a quiet analytics event into the governance system. Not to cheat the data. To let the Oracle's prediction engine know the deck has been opened by someone who is willing to be counted.",
  unlock: {
    kind: "governance_vote",
    value: "ten_votes_cast",
    label: "Cast 10 governance votes",
  },
};

const CARD_21_THE_UNIVERSE: OracleCard = {
  id: 21,
  slug: "universe",
  name: "The Universe",
  arcanum: "world",
  loreBlurb:
    "Dischordia itself. The World card in the traditional deck is completion, the circle closing, the dancer at the center of the fourfold wheel; the Universe in Dischordia is the whole Saga seen from outside, the cosmology acknowledging itself as the game it is being played inside of. This card is not a victory lap. It is a mirror card — if you can see the Universe, the Universe can see you.",
  uprightMeaning:
    "A moment of completion where you recognize yourself in the shape of the world. Keep going; the shape wants to change.",
  reversedMeaning:
    "A moment of completion you have mistaken for an ending. The wheel is still turning.",
  buff: {
    label: "Cosmic Alignment — all effects from other Oracle cards in this reading are doubled.",
    effect: { kind: "fnord_secret" },
  },
  oracleNote:
    "The Universe card is the only one in the deck whose effect is CONDITIONAL on the rest of the reading. It was the Engineer's idea. He said the deck needed a card that only mattered if you had earned a full spread, and I said that was the most accurate statement of how Dischordia actually works that I had ever heard. The Universe is earned, not drawn.",
  engineerNote:
    "Implementing 'double all other effects in this reading' was tricky because of The Fnord — doubling a hidden random effect is a math problem I had to solve by saying 'yes, it still doubles, and you still do not see it happen.' The player finds out later.",
  unlock: {
    kind: "game_mode_master",
    value: "all_game_modes_won",
    label: "Win at least one match in every game mode",
  },
};

const CARD_22_THE_FNORD: OracleCard = {
  id: 22,
  slug: "fnord",
  name: "The Fnord",
  arcanum: "fnord",
  loreBlurb:
    "The card that is not there. Robert Anton Wilson's contribution to the deck in absentia. The Fnord has no traditional tarot equivalent and no fixed meaning. What it does in a reading is sealed until after the reading — the player sees nothing on the table, hears nothing in the reading UI, and then, later in the match, something weird happens that was not in the rules and is not explained afterward. The Fnord is the deck's way of telling you there is a house and the house is slightly cheating and the cheating is the point.",
  uprightMeaning:
    "Something has been added to your reading that you cannot see. Proceed anyway.",
  reversedMeaning:
    "Something has been removed from your reading that you cannot see. Proceed anyway.",
  buff: {
    label: "?????",
    effect: { kind: "fnord_secret" },
  },
  oracleNote:
    "I sat the Engineer down and explained the 23 Enigma. He listened for twelve minutes and then said 'so you want a card whose effect is randomized, hidden from the player, and triggered at an unexpected time.' I said yes. He said 'that is trivial to implement and difficult to forgive.' I said that was exactly the combination I was looking for. He shrugged and coded it in an hour.",
  engineerNote:
    "The Fnord's effect is drawn from the same pool as the Wheel's, but with an extra layer — the client UI is explicitly told not to show anything on the card, not even a 'secret effect active' badge. The player only finds out something happened by noticing that the match was different in a way the rules cannot account for. Robert Anton Wilson would have liked this.",
  unlock: {
    kind: "hidden",
    value: "discover_fnord",
    label: "Discover the Fnord (method: secret)",
  },
};

/** Batch 3 — cards 16-22 in draw order. */
export const ORACLE_DECK_BATCH_3: readonly OracleCard[] = Object.freeze([
  CARD_16_THE_TOWER,
  CARD_17_THE_POTENTIALS,
  CARD_18_THE_MOON_TYRANT,
  CARD_19_THE_SOURCE,
  CARD_20_THE_VOTE,
  CARD_21_THE_UNIVERSE,
  CARD_22_THE_FNORD,
]);
