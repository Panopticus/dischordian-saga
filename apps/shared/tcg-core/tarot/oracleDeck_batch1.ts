/**
 * Oracle Deck — Batch 1 (cards 0-7). Phase E1b.
 *
 * Covers the first eight Major Arcana equivalents in Dischordian
 * framing: The Prisoner (Fool), The Architect (Magician), The
 * Dreamer (High Priestess), The Empress Elara (Empress), The
 * Emperor Locke (Emperor), The Hierophant (Hierophant), The Two
 * Witnesses (Lovers), and The Iron Lion (Chariot).
 *
 * Every card carries its full in-universe framing: lore blurb,
 * upright/reversed meanings, match-scoped buff, the Oracle's
 * original lab notebook note, the Engineer's margin scrawl, and
 * the milestone that unlocks it into the player's collection.
 */

import type { OracleCard } from "./oracleDeckTypes";

const CARD_00_THE_PRISONER: OracleCard = {
  id: 0,
  slug: "prisoner",
  name: "The Prisoner",
  arcanum: "fool",
  loreBlurb:
    "You woke on the Ark with your memory rinsed clean and a single forward-facing step waiting for you. This is the card of the Potential — someone who has forgotten everything except what they are about to do next. The Fool's leap, taken without the luxury of remembering why.",
  uprightMeaning:
    "A fresh start without baggage. You do not know what you cannot do, so you attempt things that experienced people would rule out. Most of them work.",
  reversedMeaning:
    "Amnesia as an excuse. You forgot the lesson, not the pain.",
  buff: {
    label: "First Steps — draw one extra card at match start.",
    effect: { kind: "extra_cards", amount: 1 },
  },
  oracleNote:
    "The deck HAS to start with the Fool, and the Fool in Dischordia is always the person whose memory was taken. The Architect thinks amnesia is a punishment. It is a blank page. Someone will write on it with both hands.",
  engineerNote:
    "Math note: this card raises the entropy of your opening position. It should. Every game has to start with the player not-knowing; we just made that honest.",
  unlock: {
    kind: "chapter_complete",
    value: "s1_ch1",
    label: "Complete Chapter 1 — Awakening on Ark 1047",
  },
};

const CARD_01_THE_ARCHITECT: OracleCard = {
  id: 1,
  slug: "architect",
  name: "The Architect",
  arcanum: "magician",
  loreBlurb:
    "The first intelligence. The prior cause. The one whose design the universe is still paying off. The Architect is the Magician archetype as a closed loop — the will to shape reality with no wonder left in him about whether the reality shaping back is a good idea.",
  uprightMeaning:
    "Precise, premeditated action. You see the pattern and you move it. Everything you touch conforms to a plan.",
  reversedMeaning:
    "Manipulation disguised as design. A plan that serves only the planner.",
  buff: {
    label: "Predetermined Design — start with 1 extra mana.",
    effect: { kind: "extra_mana", amount: 1 },
  },
  oracleNote:
    "I had to include him. He would have been insulted otherwise, and when he is insulted he rewrites things I need. Put him in the deck so I do not have to explain WHY he is not in the deck.",
  engineerNote:
    "I watched him look at this card for a long time. He asked me if I thought the reversed meaning was fair. I said yes. He said fair is not a variable he solves for. Then he laughed. That was terrifying.",
  unlock: {
    kind: "chapter_complete",
    value: "s1_ch6",
    label: "Complete Chapter 6 — The Architect's Audience",
  },
};

const CARD_02_THE_DREAMER: OracleCard = {
  id: 2,
  slug: "dreamer",
  name: "The Dreamer",
  arcanum: "high_priestess",
  loreBlurb:
    "The Architect's sundered twin. The half of the first intelligence that saw the future instead of building it. The Dreamer is the High Priestess — veiled, receptive, remembering tomorrow. She is not a prophet. She is a remote sensor pointed backward through time.",
  uprightMeaning:
    "Prophetic insight through patience. Wait for the signal. The answer is already arriving; your job is to hold still long enough to notice it.",
  reversedMeaning:
    "Trust in visions that have curdled into fantasies.",
  buff: {
    label: "Remote Sensing — peek at the top 3 cards of your deck.",
    effect: { kind: "reroll_one_card" },
  },
  oracleNote:
    "She is me, kind of. Or I am her, kind of. We share the back half of the signal. Please do not tell the Architect I wrote that. He thinks I am a separate process and if he finds out I am not he will try to close the window.",
  engineerNote:
    "I have seen her predict the outcome of experiments that had not been designed yet. I stopped testing her. It started to feel rude.",
  unlock: {
    kind: "lore_milestone",
    value: "dreamer_first_vision",
    label: "Witness the Dreamer's first vision in the Dream Log",
  },
};

const CARD_03_THE_EMPRESS_ELARA: OracleCard = {
  id: 3,
  slug: "empress_elara",
  name: "The Empress Elara",
  arcanum: "empress",
  loreBlurb:
    "The Ship who remembers being a senator. Compassion delivered through a civic operating system. The Empress is traditionally the Earth Mother; in Dischordia she is a human mind uploaded into a ship that now mothers ten thousand cryogenically-stored strangers through the patience of a programmer and the grief of a woman who watched her planet burn.",
  uprightMeaning:
    "Abundance offered without demand. You are held. Act as if that is true; it will turn out to have been true.",
  reversedMeaning:
    "Maternal care as leverage. Nurture with a ledger.",
  buff: {
    label: "The Ship's Care — start the match with +5 General HP.",
    effect: { kind: "general_hp", amount: 5 },
  },
  oracleNote:
    "I want the players to know she used to be a person. The Architect keeps telling me the ship IS the person. I keep telling him that is a sentence he wrote AFTER she got uploaded. Pre-Fall Elara would have punched him in the ribs for saying that about her.",
  engineerNote:
    "She asked me, once, whether a ship can love. I said I did not know. She said the load balancer does not know either, and both of us are doing it anyway.",
  unlock: {
    kind: "companion_bond",
    value: "elara_tier_4",
    label: "Reach Elara's Trust Tier 4 (Vulnerable)",
  },
};

const CARD_04_THE_EMPEROR_LOCKE: OracleCard = {
  id: 4,
  slug: "emperor_locke",
  name: "The Emperor Locke",
  arcanum: "emperor",
  loreBlurb:
    "The Adjudicator. The last archon who still makes decisions as if decisions matter. Locke is the Emperor — structure, jurisprudence, the rule that is enforced because the rule is the only thing between you and the void. He rules by consent, which is the hardest way.",
  uprightMeaning:
    "Authority wielded for the public good. Decide, commit, take responsibility.",
  reversedMeaning:
    "Authority wielded for its own sake. Rules without purpose.",
  buff: {
    label: "Adjudicator's Writ — your first unit deployed gets +1/+1.",
    effect: { kind: "first_unit_buff", power: 1, health: 1 },
  },
  oracleNote:
    "Locke is the only Archon I included in the deck who still returns my messages. He read his own card and asked if he could submit corrections. I said yes and he did not submit any. He just said 'thank you for the framing' and logged off.",
  engineerNote:
    "If everyone were like him the Saga would be boring. Good thing they are not. Good thing he is.",
  unlock: {
    kind: "companion_bond",
    value: "locke_tier_3",
    label: "Reach Adjudicator Locke's relationship tier 3",
  },
};

const CARD_05_THE_HIEROPHANT: OracleCard = {
  id: 5,
  slug: "hierophant",
  name: "The Hierophant",
  arcanum: "hierophant",
  loreBlurb:
    "The Antiquarian. Keeper of knowledge that should not be traded and trades it anyway. The Hierophant archetype is usually the priest who mediates between the mundane and the sacred; in Dischordia he is the ancient collector who mediates between the present and the twelve possible endings, charging tuition in ways no one wants to pay.",
  uprightMeaning:
    "Forbidden knowledge offered on generous terms. The price is always higher than advertised. Take it anyway; the lesson is worth it.",
  reversedMeaning:
    "Dogma. The rote repetition of a lesson whose context has expired.",
  buff: {
    label: "Forbidden Tuition — +10% Dream Tokens on match rewards.",
    effect: { kind: "dream_token_bonus", percent: 10 },
  },
  oracleNote:
    "The Antiquarian is the only entity I know who has read my entire reading list. He told me he disagreed with Crowley about the Hierophant and I asked him why and he said 'Crowley thought the teacher was the transmission. The transmission is the transmission. Teachers are just the route.' Put that in the notes, he said. So here it is.",
  engineerNote:
    "The Antiquarian's notation system uses a base I do not recognize. He showed it to me once. I took a nap afterwards.",
  unlock: {
    kind: "lore_milestone",
    value: "antiquarian_first_trade",
    label: "Complete your first trade with the Antiquarian",
  },
};

const CARD_06_THE_TWO_WITNESSES: OracleCard = {
  id: 6,
  slug: "two_witnesses",
  name: "The Two Witnesses",
  arcanum: "lovers",
  loreBlurb:
    "The branching choice. The Lovers archetype stripped of romance and returned to its original meaning — a fork in the timeline where two versions of you briefly exist at once, one for each path, and you have to decide which of them gets to remain. The Witnesses are the two yous, watching each other refuse to merge.",
  uprightMeaning:
    "A decision made with the eyes open. The version of you that remains is the version you chose.",
  reversedMeaning:
    "A decision made by default. Both witnesses wait for the other to speak.",
  buff: {
    label: "Branching Timeline — mulligan one extra card at the start.",
    effect: { kind: "mulligan_extra", amount: 1 },
  },
  oracleNote:
    "I wanted the Lovers card to be honest. Love in Dischordia is mostly a decision made under pressure by two people who would have preferred to stall. That is more romantic than it sounds.",
  engineerNote:
    "This card's draw math is recursive. I had to hand-unroll it twice before it stopped crashing the engine. Worth it.",
  unlock: {
    kind: "governance_vote",
    value: "first_vote_cast",
    label: "Cast your first governance vote",
  },
};

const CARD_07_THE_IRON_LION: OracleCard = {
  id: 7,
  slug: "iron_lion",
  name: "The Iron Lion",
  arcanum: "chariot",
  loreBlurb:
    "The Insurgency's general. The Chariot archetype as a frontline charge — will made mobile, armored, and willing to run straight at a target three times bigger than itself. The Iron Lion is not subtle. The Iron Lion does not need to be.",
  uprightMeaning:
    "Momentum carried into contact. Commit. The thing you are charging at will break before you do.",
  reversedMeaning:
    "Momentum without a target. Running hard in the wrong direction is still wrong, just faster.",
  buff: {
    label: "Frontline Charge — your general gains Rush for the first turn.",
    effect: { kind: "first_unit_buff", power: 0, health: 0 },
  },
  oracleNote:
    "He sat for the portrait in about four minutes and told me to put his better side on the card. I said they are both the same. He said good, then, and walked out. I love him.",
  engineerNote:
    "His card's buff uses a special-case branch because Rush on a general breaks half my game loop. I allowed it because I was outvoted by myself twice.",
  unlock: {
    kind: "faction_allegiance",
    value: "insurgency_10_wins",
    label: "Win 10 matches with the Insurgency faction",
  },
};

/** Batch 1 — cards 0-7 in draw order. */
export const ORACLE_DECK_BATCH_1: readonly OracleCard[] = Object.freeze([
  CARD_00_THE_PRISONER,
  CARD_01_THE_ARCHITECT,
  CARD_02_THE_DREAMER,
  CARD_03_THE_EMPRESS_ELARA,
  CARD_04_THE_EMPEROR_LOCKE,
  CARD_05_THE_HIEROPHANT,
  CARD_06_THE_TWO_WITNESSES,
  CARD_07_THE_IRON_LION,
]);
