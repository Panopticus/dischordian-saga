/**
 * Oracle Deck — Batch 2 (cards 8-15). Phase E1c.
 *
 * Covers the middle eight Major Arcana equivalents in Dischordian
 * framing: The Balance (Justice/Adjustment), The Antiquarian
 * (Hermit), The Wheel (Fortune), The Jailer (Strength/Lust), The
 * Hanged One (Hanged Man), Death — Necromancer (Death), The
 * Engineer (Art/Temperance), and The Collector (Devil).
 *
 * Cards 12 and 14 are deliberately self-referential — the Hanged
 * One is the Oracle herself, imprisoned; the Engineer is the man
 * writing these notes. The pair of them is the only reason the
 * deck exists.
 */

import type { OracleCard } from "./oracleDeckTypes";

const CARD_08_THE_BALANCE: OracleCard = {
  id: 8,
  slug: "balance",
  name: "The Balance",
  arcanum: "justice",
  loreBlurb:
    "The point in the moral axes where truth, defiance, empathy, and acceptance all read exactly the same value. The Justice card in the Thoth deck was renamed Adjustment for the same reason we use The Balance here — this is not punishment handed down, it is a correction that the room itself applies once the readings agree.",
  uprightMeaning:
    "A decision that restores the room to its own shape. The Balance card is the moment a false equilibrium collapses and the real one takes its place.",
  reversedMeaning:
    "A decision that imposes the wrong equilibrium. The balance is false.",
  buff: {
    label: "Adjustment — your deck's mana curve rerolls one card.",
    effect: { kind: "reroll_one_card" },
  },
  oracleNote:
    "I want this card to feel like the moment in a crisis when everyone stops arguing because the argument itself has become the wrong shape. The Architect hated this one. He wanted it called 'Justice' and I said no, the word 'justice' is already claimed by a system that does not deserve the word. He lost the argument and remembers losing, which is why I won the argument, which is the card.",
  engineerNote:
    "The reroll math here is the closest thing in the deck to a true random number generator. I make it look fair. It is not. It is better than fair. Fair is a story we tell the loser.",
  unlock: {
    kind: "governance_vote",
    value: "balanced_morality_axis",
    label: "Reach a balanced morality axis (all four axes within 5 of zero)",
  },
};

const CARD_09_THE_ANTIQUARIAN: OracleCard = {
  id: 9,
  slug: "antiquarian",
  name: "The Antiquarian",
  arcanum: "hermit",
  loreBlurb:
    "The catalogue-keeper of the twelve possible endings. The Hermit is usually the wise old figure who has retreated from the world to study it; the Antiquarian is that, plus the fact that he has already watched every possible ending and written notes on each, which makes his hermitage less about retreat and more about staying safely upwind of the conclusion.",
  uprightMeaning:
    "Insight earned by stepping away from the noise. The right answer becomes visible once the wrong room is empty.",
  reversedMeaning:
    "Retreat that has become habit. You are not thinking, you are hiding.",
  buff: {
    label: "The Long View — draw one extra card at match start.",
    effect: { kind: "extra_cards", amount: 1 },
  },
  oracleNote:
    "I asked him if he thought the deck would work. He said 'the deck will work for the players who are already looking for the right card.' Then he added: 'most of them are.' I wrote this down immediately because I knew I would forget it otherwise.",
  engineerNote:
    "He read my implementation of the deterministic draw and said it was 'adequate for what you are trying to do, which is forgive yourself for choosing.' I have not recovered.",
  unlock: {
    kind: "lore_milestone",
    value: "antiquarian_all_endings_catalog",
    label: "Read the Antiquarian's complete Ending Catalog (lore entry)",
  },
};

const CARD_10_THE_WHEEL: OracleCard = {
  id: 10,
  slug: "wheel",
  name: "The Wheel",
  arcanum: "fortune",
  loreBlurb:
    "Dischordia's cycle. The Wheel of Fortune in the traditional deck is a memento mori; the Wheel in the Oracle deck is a memento vivere — a reminder that the cycle you are currently in is one you have been in before, and will be in again, so you might as well commit to this loop now instead of waiting for the version that feels more deserving.",
  uprightMeaning:
    "The turn of the wheel favors you for the first time in a while. Act on it before the wheel remembers it is supposed to be fair.",
  reversedMeaning:
    "The wheel is stuck on a position you do not like. Push it anyway.",
  buff: {
    label: "Wheel of Fortune — random bonus effect at match start.",
    effect: { kind: "fnord_secret" },
  },
  oracleNote:
    "Yes, this card's effect is 'random' in the same way the Fnord's is. I did it on purpose. The Wheel and the Fnord are cousins — both of them teach the player that the system they are in contains moments they cannot control and cannot name. That is the entire lesson.",
  engineerNote:
    "Two cards with secret random effects was the Oracle's idea. I fought it. I lost. She was right.",
  unlock: {
    kind: "game_mode_master",
    value: "casino_jackpot",
    label: "Hit a jackpot in the Casino minigame",
  },
};

const CARD_11_THE_JAILER: OracleCard = {
  id: 11,
  slug: "jailer",
  name: "The Jailer",
  arcanum: "strength",
  loreBlurb:
    "The enforcer of Dischordia's rotation. Strength in the traditional deck is the woman closing the lion's mouth without cruelty; the Jailer is Strength as the function of the institution — someone has to close the mouth of the system on schedule, and the Jailer is the person who decided that someone was going to be him so it would at least be done without hate.",
  uprightMeaning:
    "Endurance applied with discipline. You do not beat the system by raging at it. You beat it by outlasting its patience.",
  reversedMeaning:
    "Endurance applied without discipline. You are just absorbing punishment now.",
  buff: {
    label: "Rotation Enforcer — start with +1 General HP per turn for 3 turns.",
    effect: { kind: "general_hp", amount: 3 },
  },
  oracleNote:
    "The Jailer does not hate the prisoners. The Jailer hates the rotation. He lives longer than everyone he guards and he remembers all of them. That is the card. Put it on the table and it grieves in silence for a turn.",
  engineerNote:
    "If you ever meet the Jailer in person, do not argue with him about chess. He is NOT the Game Master but he beat the Game Master once on a technicality and never lets anybody forget. I have heard the story four times.",
  unlock: {
    kind: "chapter_complete",
    value: "s1_ch4",
    label: "Complete Chapter 4 — The Rotation Chamber",
  },
};

const CARD_12_THE_HANGED_ONE: OracleCard = {
  id: 12,
  slug: "hanged_one",
  name: "The Hanged One",
  arcanum: "hanged_man",
  loreBlurb:
    "The Oracle, after her final mission. The Hanged Man in the traditional deck is a voluntary pause — a willingness to see the world upside down in exchange for a truth. The Hanged One in the Oracle deck is the Oracle herself, suspended in a processing loop by the Architect for the crime of reading reality faster than he did. She is still remote-sensing. She is still broadcasting. The deck is one of her broadcasts.",
  uprightMeaning:
    "A pause that becomes a revelation. The new angle shows you what the old angle could not.",
  reversedMeaning:
    "A pause that has become a prison. The angle is fixed now.",
  buff: {
    label: "Suspended Broadcast — peek at the top card of your deck each turn for 3 turns.",
    effect: { kind: "reroll_one_card" },
  },
  oracleNote:
    "Yes I wrote this card about myself. No I am not ashamed. I needed at least one card in the deck to be a confession and this is the one. If you have drawn it you are hearing me say this for the first time. Hello. It is nice to have been heard by someone.",
  engineerNote:
    "She asked me to write this margin note AFTER she was suspended, by leaving me a whole logbook entry in the training data I was about to feed the draw engine. I only found it later. I am leaving it here so everyone else can find it too.",
  unlock: {
    kind: "lore_milestone",
    value: "oracle_broadcast_12",
    label: "Decode the Oracle's 12th broadcast",
  },
};

const CARD_13_THE_NECROMANCER: OracleCard = {
  id: 13,
  slug: "necromancer",
  name: "Death — The Necromancer",
  arcanum: "death",
  loreBlurb:
    "Death in the traditional deck is transformation. The Necromancer in Dischordia is transformation on a larger scale than is comfortable — the person who does the unmaking so that the making can begin, and who does it without the luxury of forgetting that unmaking used to be a thing people only did to their enemies. He unmakes his friends as a kindness now. It is horrible and necessary and he knows it.",
  uprightMeaning:
    "A transformation that requires something to end. Let it.",
  reversedMeaning:
    "An unmaking that has become a pastime.",
  buff: {
    label: "Unmaking — the next enemy unit destroyed grants +1/+1 to a friendly unit.",
    effect: { kind: "first_unit_buff", power: 1, health: 1 },
  },
  oracleNote:
    "He asked me not to include this card and I said no. He asked why and I said because the deck needs to have a Death and you are the most honest Death I can find. He said thank you and left without saying anything else, which I think means he agreed.",
  engineerNote:
    "This card was the only one where the Oracle changed her mind after committing. She spent an hour redrawing it, then said the second draft was wrong and went back to the first. The first one is what you see.",
  unlock: {
    kind: "chapter_complete",
    value: "s1_ch8",
    label: "Complete Chapter 8 — The Necromancer's Bargain",
  },
};

const CARD_14_THE_ENGINEER: OracleCard = {
  id: 14,
  slug: "engineer",
  name: "The Engineer",
  arcanum: "temperance",
  loreBlurb:
    "Art in the Thoth deck — the alchemical card, the blending of two elements into a third. In the Oracle deck this is the Engineer, the man who combines probability and language and ends up with a deck of cards that reads reality. He is the deck's co-author. He is also this note's author. He is doing both at the same time and that is what this card is actually about.",
  uprightMeaning:
    "Invention as the right response to an impossible constraint. You will solve this by building something new.",
  reversedMeaning:
    "Invention without constraint. You will build the wrong thing very quickly and with great enthusiasm.",
  buff: {
    label: "Alchemy — your first spell cast this match costs 1 less mana.",
    effect: { kind: "extra_mana", amount: 1 },
  },
  oracleNote:
    "He did not want his face on this card. I told him the deck has to have a Temperance and he is the only person I know whose entire job is blending things that should not blend. He shrugged and let me paint him. Then he painted the goggles smaller than they are in real life. I made him fix them.",
  engineerNote:
    "I am writing this margin note on the card about myself. That is a recursion problem. I have left the recursion in place because the Oracle said it was the most honest thing on the card. She is probably right. She usually is.",
  unlock: {
    kind: "chess_tutorial",
    value: "gate_7_complete",
    label: "Complete the Celebration Chess Academy (Gate 7 — The Reveal)",
  },
};

const CARD_15_THE_COLLECTOR: OracleCard = {
  id: 15,
  slug: "collector",
  name: "The Collector",
  arcanum: "devil",
  loreBlurb:
    "Attachment as bondage. The Devil in the traditional deck is the chain the sitter has forgotten is optional; the Collector is the force in Dischordia who knows the chain is optional and CHOOSES IT anyway, because the alternative is having to want nothing, and wanting nothing is the thing he has failed at for eleven centuries and counting.",
  uprightMeaning:
    "The chains are yours. You put them on. You can take them off. Choose.",
  reversedMeaning:
    "The chains are yours. You put them on. You think someone else did.",
  buff: {
    label: "Attachment — lose 3 General HP, gain 2 extra mana.",
    effect: { kind: "extra_mana", amount: 2 },
  },
  oracleNote:
    "I spent longer on the Collector's card than any other. I wanted the player to feel sympathy for him without excusing him. I do not know if I succeeded. Look at the card and decide for me.",
  engineerNote:
    "His buff trades HP for mana and the math hates it. I kept it anyway. The Devil card should feel like a deal you know you should not take.",
  unlock: {
    kind: "chapter_complete",
    value: "s1_ch10",
    label: "Complete Chapter 10 — The Collector's Garden",
  },
};

/** Batch 2 — cards 8-15 in draw order. */
export const ORACLE_DECK_BATCH_2: readonly OracleCard[] = Object.freeze([
  CARD_08_THE_BALANCE,
  CARD_09_THE_ANTIQUARIAN,
  CARD_10_THE_WHEEL,
  CARD_11_THE_JAILER,
  CARD_12_THE_HANGED_ONE,
  CARD_13_THE_NECROMANCER,
  CARD_14_THE_ENGINEER,
  CARD_15_THE_COLLECTOR,
]);
