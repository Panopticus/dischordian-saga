/* ═══════════════════════════════════════════════════════
   MECHANIC SYSTEM TUTORS — parallel to acts2to7SystemTutors

   Tutor surface for the ten game-mechanic introduction
   cinematics (mech_*_intro_seen) authored in
   docs/production/prompts/kling-omni-mechanic-intros/. Each
   tutor fires once when the cinematic completes; the
   companionComments.ts cc_mech_*_first reactive line lands
   alongside it; the companionAskTopics.ts ask_*_<mech>
   topic stays available for the player to re-litigate the
   mechanic at any time.

   Mechanics covered (10):
     - card_combat       (Dischordia Deck arena tutorial)
     - deckbuilder       (Engineer's Bench card crafting)
     - allegiances       (eight-faction pledge surface)
     - witnessing        (light/dark vote ledger)
     - soul_stones       (eight-stone reliquary)
     - oracle_deck       (three-card spread)
     - chess             (Two Game Masters parlor)
     - sprite_proxy      (companion-bond grove)
     - expansion_drops   (CoNexus pack fabrication)
     - trade_empire      (eight-sector exploration)

   Schema mirrors Acts2To7SystemTutor — UI renderers handle
   both surfaces via the same shape so no branching is needed
   downstream.

   Consumed by:
     - tutor card renderer (matches by triggerFlag)
     - mechanicSystemTutors.test.ts
     - cinematicHookContract.test.ts (mechanic intros are
       paired with both reactive comments and tutors)
   ═══════════════════════════════════════════════════════ */

export type MechanicSystemId =
  | "card_combat"
  | "deckbuilder"
  | "allegiances"
  | "witnessing"
  | "soul_stones"
  | "oracle_deck"
  | "chess"
  | "sprite_proxy"
  | "expansion_drops"
  | "trade_empire";

export type MechanicTutorSpeaker =
  | "elara"
  | "human"
  | "antiquarian"
  | "engineer"
  | "seer"
  | "game_master"
  | "trade_factor"
  | "dual";

export interface MechanicSystemTutor {
  systemId: MechanicSystemId;
  speaker: MechanicTutorSpeaker;
  /** Why this character is allowed to teach this mechanic in fiction. */
  narrativeJustification: string;
  /** First-time introduction, rendered as a tutor card. */
  introText: string;
  /** Action-anchored cues: actionId → in-fiction line. */
  usageHints: Record<string, string>;
  /** Flag the player must have set for the intro to show — pairs with the cinematic. */
  triggerFlag: string;
  /** Flag set when the intro card has been dismissed. */
  completionFlag: string;
  /**
   * Lowest narrative act the tutor can fire in. Mechanic tutors are not
   * gated by act in the same strict sense as Acts2To7SystemTutor; most
   * fire from Act 1 onward. Trade Empire and Soul Stones gate on Act 2
   * because they unlock with their respective system access.
   */
  unlockedFromAct: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

const CARD_COMBAT_TUTOR: MechanicSystemTutor = {
  systemId: "card_combat",
  speaker: "elara",
  unlockedFromAct: 1,
  narrativeJustification:
    "Elara is the Ark's narrating voice for first-time encounters with the Dischordia Deck. The cinematic ends with her line about every gilt-edged wall being a card someone has played — she is canonically the only character authorized to say that out loud. Her tutor lands directly on the cinematic's flag.",
  introText:
    "Your first duel. Five cards in hand, seven hex slots per side, mana pool growing by one per turn to a cap of seven, life total starts at twenty. You play units into your slots; spells resolve and burn; banners buff the row; artifacts hold a slot until removed. Each play forecloses a different play — that is the argument the deck is having with itself, with the opponent, and with you. Win condition: bring the opposing life total to zero, or fulfill a card-specific alternate. Read the keywords. The keywords are short on purpose.",
  usageHints: {
    first_card_played:
      "Card on the field. Its stat plate floats beside its hologram — ATK left, HP right, COST upper-left. Read the keyword tag underneath; that is the verb of the card.",
    first_strike:
      "Combat resolves on the hex divide; both units take damage simultaneously unless a keyword says otherwise. STRIKE units survive a single fatal hit by design — that is what the keyword means and the keyword is rarer than it feels.",
    rare_drawn:
      "A rare card glows a tier brighter in your hand. Hold it for the moment that asks for it. Most witnesses spend rares too early their first ten matches; you have time to learn the timing.",
  },
  triggerFlag: "mech_card_combat_intro_seen",
  completionFlag: "mech_card_combat_tutor_seen",
};

const DECKBUILDER_TUTOR: MechanicSystemTutor = {
  systemId: "deckbuilder",
  speaker: "engineer",
  unlockedFromAct: 1,
  narrativeJustification:
    "The Engineer is the canonical bench voice — she runs the workshop, she designed the fiber-optic substrate weave, and the cinematic ends with her sentence 'forty slots, every slot a sentence.' No other character has the in-fiction access to teach the imprint laser, the index wall, or the binder clasp.",
  introText:
    "Forty cards. Every slot is a sentence; the deck is the paragraph. Pick from the index wall — the columns are colour-coded by faction. Mix factions; the Witnesses do not care which colour you wear, only what you say with it. Drop blanks on the brass plate, fire the imprint laser, slot the printed card into the binder. When the binder closes, the clasp glows. Bring the deck back when it speaks something else; the bench is open.",
  usageHints: {
    blank_placed:
      "Blank gilt-edged card on the plate. The plate's prongs hold it during imprint; do not move the card while the laser is firing — the gilt scars and the substrate read becomes uneven.",
    card_imprinted:
      "Card printed. Inspect the gilt ribbon around the frame — it confirms the imprint succeeded. A flicker means re-imprint; a steady glow means slot.",
    binder_closed:
      "Binder full. Clasp glows. Carry it. The bench's blank stack refills overnight — there is no rationing. The rationing is your patience.",
  },
  triggerFlag: "mech_deckbuilder_intro_seen",
  completionFlag: "mech_deckbuilder_tutor_seen",
};

const ALLEGIANCES_TUTOR: MechanicSystemTutor = {
  systemId: "allegiances",
  speaker: "human",
  unlockedFromAct: 2,
  narrativeJustification:
    "The Human VOs every faction banner reveal in the cinematic — he has flown all eight at one point in his three-Age career and is the only character with first-person experience of each pledge's cost. The cinematic ends with him on screen at the central pedestal; the tutor is his continuation.",
  introText:
    "Eight banners. Eight factions. You can pledge once, you can re-pledge later, and you can fly the un-pledged stance the whole arc — the un-pledged stance is its own banner. Pledging changes opening lines on first contact and unlocks faction-specific quartermasters; it does not lock you out of any other faction's dialog. The banners remember every name they have flown. The remembering is the relationship.",
  usageHints: {
    banner_inspected:
      "Banner read. Each carries a motto along its lower edge; the motto tells you what the faction values, not what the faction is. Read both lines.",
    pledge_inscribed:
      "Pledge written. The card seal carries your name. Quartermasters from this faction will offer you a small but consistent discount; opposing factions will not refuse you, only open at their default tone.",
    repledge:
      "Re-pledge. The faction you leave does not punish you; the faction you join does not commemorate. The change is logged and the substrate moves on. The cost is your previous discount expires immediately.",
  },
  triggerFlag: "mech_allegiances_intro_seen",
  completionFlag: "mech_allegiances_tutor_seen",
};

const WITNESSING_TUTOR: MechanicSystemTutor = {
  systemId: "witnessing",
  speaker: "dual",
  unlockedFromAct: 1,
  narrativeJustification:
    "The witnessing system is the only mechanic where Elara and the Human are co-narrators by design — Elara reads scenes for harm, the Human reads them for wound, and the player chooses the primary reading. The dual tutor matches the cinematic's two-pedestal composition.",
  introText:
    "Elara: When you witness a scene, the world pauses and the chamber opens — half cyan, half rose, the divide above your head. I read for the body language of the person being acted upon.\nHuman: I read for the trembling hands of the person doing the acting. Both readings live in every scene.\nElara: You vote with the gold token. The vote is logged in the ledger; the world adjusts to the reading you marked primary. The other reading does not vanish — it waits.\nHuman: You can refuse to vote. The refusal column is the most honest column on the ledger. Use it without shame.",
  usageHints: {
    scene_witnessed:
      "Elara: Scene logged. The token in your palms is uncommitted; turn it to commit. Token-side determines primary reading.",
    vote_cast:
      "Human: Vote written. The world will read the entry the next time the involved NPCs cross your path. Their tone shifts to match.",
    refusal_logged:
      "Elara: Refusal logged in the third column. This is the most underused vote and almost always the correct vote when you cannot cleanly tell. Trust your inability to tell.",
  },
  triggerFlag: "mech_witnessing_intro_seen",
  completionFlag: "mech_witnessing_tutor_seen",
};

const SOUL_STONES_TUTOR: MechanicSystemTutor = {
  systemId: "soul_stones",
  speaker: "antiquarian",
  unlockedFromAct: 2,
  narrativeJustification:
    "The Antiquarian is the canonical reliquary keeper — the stones live in his vault, the ledger of which witness has carried which stones is in his book, and he is the only character whose voice can introduce the eight-stone schema without breaking the dual-narrator dynamic the rest of the game runs on.",
  introText:
    "Eight stones. Cyan fills when you witness; rose when you confess; amber when you close a door; violet when you listen to the substrate; gold when two voices align in the same scene; sepia when you read the Loredex; green-black when you flinch toward the cage. The clear stone — Reservation — fills when you refuse to be defined. Carry only the ones you can name. Naming is half the carrying.",
  usageHints: {
    stone_filled:
      "Stone weight increased. The reliquary logs the increment in your private ledger; you can read the ledger from the cabin terminal at any time. Most witnesses read it once a month; some read it weekly. There is no correct frequency.",
    stone_inspected:
      "Stone in palm. Hold it long enough and the substrate plays back the moment that filled it; the playback is silent and short and you can dismiss it with a closed fist. The dismissal does not erase the entry.",
    eighth_stone_named:
      "Reservation stone — the clear one — has weight. This is rare. Most witnesses never give the clear stone weight; you did. The Antiquarian has noted the entry in the bound book. You will not see the entry. He has it.",
  },
  triggerFlag: "mech_soul_stones_intro_seen",
  completionFlag: "mech_soul_stones_tutor_seen",
};

const ORACLE_DECK_TUTOR: MechanicSystemTutor = {
  systemId: "oracle_deck",
  speaker: "seer",
  unlockedFromAct: 2,
  narrativeJustification:
    "The Seer is the only character who shuffles the oracle deck without breaking the prophetic register — his prismatic eyes are the spectroscope the cards read against. Antiquarian voice is acceptable for ledger questions; Seer voice is required for the spread itself.",
  introText:
    "Three cards. Past, present, future. The cards do not predict — they remember what wants to happen if you do not interrupt. Cut where the deck wants you to. The Past lights sepia, the Present white-gold, the Future violet. A Reversed card means the position is contested; a card pulled twice in a single arc means the substrate is asking you to pay attention.",
  usageHints: {
    deck_shuffled:
      "Cards in the air between my palms. The shuffle is gravity-defying because the substrate participates; do not interrupt. The interruption costs the spread its honesty.",
    card_revealed:
      "Card up. Read the position first, then the art, then the keyword. The keyword is the smallest part and the most often misread.",
    spread_archived:
      "Spread filed. The archive holds spreads forever; you can return and read your old spreads from the temple's ledger. Re-reading old spreads changes them. Not the text — the weight.",
  },
  triggerFlag: "mech_oracle_deck_intro_seen",
  completionFlag: "mech_oracle_deck_tutor_seen",
};

const CHESS_TUTOR: MechanicSystemTutor = {
  systemId: "chess",
  speaker: "game_master",
  unlockedFromAct: 2,
  narrativeJustification:
    "Gary and Zephyr-9 are the parlor's two voices. Gary is warm-tutorial; Zephyr-9 is precise-evaluative. The dual game-master speaker is canonical — neither alone can introduce the chess subgame without misrepresenting its register.",
  introText:
    "Gary: Sit down. The board is the universe with eight squares per side. The pieces are the choices.\nZephyr-9: Tutorial parameters loaded. The first decision matters more than every move that follows; do not waste it.\nGary: Each match adjusts a single psychological-profile axis by plus or minus two depending on outcome and texture of play. Aggressive openings tilt assertive; positional games tilt patient.\nZephyr-9: Resignations are logged differently from mates. Resignations measure self-knowledge. Both columns are useful.",
  usageHints: {
    opening_played:
      "Gary: Pawn forward two — the classical opening. The first move tells the table what kind of game we are playing.",
    sacrifice:
      "Zephyr-9: Sacrifice logged. The line you took loses 1.7 in evaluation; the line you intended loses 1.4. Neither is fatal. Continue.",
    mate:
      "Gary: Good game. Come back. The parlor is here whenever the rest of the universe gets loud.",
  },
  triggerFlag: "mech_chess_intro_seen",
  completionFlag: "mech_chess_tutor_seen",
};

const SPRITE_PROXY_TUTOR: MechanicSystemTutor = {
  systemId: "sprite_proxy",
  speaker: "elara",
  unlockedFromAct: 2,
  narrativeJustification:
    "Elara narrates the bond grove in the cinematic; the bond-thread shows up on her substrate scan as a small dedicated channel. She is the only voice in the game who can describe the channel's signal characteristics without breaking the system's emotional register. The grove keeper is silent by design.",
  introText:
    "The bond is mutual. The sprite chose you as much as you chose them; the thread between your sternums carries low-bandwidth emotional state in both directions — which is why your sprite seems to know when you are tired and why you feel a small lift when they have eaten well. The thread does not carry language. It does not need to.",
  usageHints: {
    bond_formed:
      "Thread visible — a soft luminous tether. The grove logs the thread's brightness in its ledger. Brighter threads attract better vendors at Verdant.",
    sprite_fed:
      "Sprite fed. Their substrate signature shifts toward contentment for the next four hours; you will feel a small steadying in your own readings. The feeding is the conversation.",
    re_visit_grove:
      "The grove remembers each bond. Bring your sprite back; the bio-flora bloom in your sprite's signature colour for the duration of the visit. The bloom is unprompted and not metaphor.",
  },
  triggerFlag: "mech_sprite_proxy_intro_seen",
  completionFlag: "mech_sprite_proxy_tutor_seen",
};

const EXPANSION_DROPS_TUTOR: MechanicSystemTutor = {
  systemId: "expansion_drops",
  speaker: "engineer",
  unlockedFromAct: 2,
  narrativeJustification:
    "The Engineer runs the CoNexus console in the cinematic; the seal that the foundry presses on every pack carries the maker's signature. She is the canonical voice for the fabrication process and the only character with operational access to the spectroscope reading the fuel.",
  introText:
    "Bring fuel. The CoNexus reads the fuel three ways — the cellulose becomes card stock, the sentimental coefficient sets the rarity floor, the duplicate-archetype sets the printing palette. The sentimental coefficient is the largest single input. Fuel that mattered to you yields better packs. I will refuse commissions where the buyer tries to fuel with items that meant nothing to them. The rule is mine and I am fierce about it.",
  usageHints: {
    fuel_deposited:
      "Tray retracts. The conveyor takes it. Do not stand near the crucible during the burn — the spectroscope reads heat and your body skews the readings.",
    pack_sealed:
      "Pack out. The wax seal is your signature. If you trade the pack away, the next holder reads the seal and knows you forged it. This is by design.",
    pack_opened:
      "Cards face-up. Sit with them for a moment before integrating into the binder. The sit is part of the receipt; the receipt is part of the relationship with the deck.",
  },
  triggerFlag: "mech_expansion_drops_intro_seen",
  completionFlag: "mech_expansion_drops_tutor_seen",
};

const TRADE_EMPIRE_TUTOR: MechanicSystemTutor = {
  systemId: "trade_empire",
  speaker: "trade_factor",
  unlockedFromAct: 2,
  narrativeJustification:
    "Veska is the cinematic's named factor and the only character licensed by the Trade Empire to onboard new captains. The trade factor speaker is required because the harbor's commerce register is its own dialect and Elara/Human voices read as foreign in the harbor.",
  introText:
    "Eight sectors. Eight markets. Each sells what the others want. Core pays best and taxes hardest; Fringe pays poorly and asks no questions. Reef trades in life, Verdant in growth; Ash is dangerous and pays well; Crystal is safer and gates by tariff. Whisper does not always let you leave. Reach does not always let you enter. Most captains skip those two. Some need to. The lanes are forgiving; the factors are not. Read the manifest twice before you sign.",
  usageHints: {
    cargo_loaded:
      "Manifest signed. The wax seal closes the route — you can re-route mid-voyage but the seal logs every adjustment. Adjustments cost a percent of the final profit per re-seal.",
    sector_entered:
      "Sector ticker live. The prices on the wall update in real time; the prices in your hold do not. The difference is your profit, your loss, and occasionally a question for the harbormaster.",
    voyage_returned:
      "Welcome back. The harbor's reputation flag for that sector ticked up. Three returns from the same sector unlocks a tier-2 vessel slot; six returns unlocks tier-3.",
  },
  triggerFlag: "mech_trade_empire_intro_seen",
  completionFlag: "mech_trade_empire_tutor_seen",
};

export const MECHANIC_SYSTEM_TUTORS: readonly MechanicSystemTutor[] = [
  CARD_COMBAT_TUTOR,
  DECKBUILDER_TUTOR,
  ALLEGIANCES_TUTOR,
  WITNESSING_TUTOR,
  SOUL_STONES_TUTOR,
  ORACLE_DECK_TUTOR,
  CHESS_TUTOR,
  SPRITE_PROXY_TUTOR,
  EXPANSION_DROPS_TUTOR,
  TRADE_EMPIRE_TUTOR,
];

export function getMechanicTutor(
  id: MechanicSystemId,
): MechanicSystemTutor | undefined {
  return MECHANIC_SYSTEM_TUTORS.find((t) => t.systemId === id);
}
