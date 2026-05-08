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
  | "trade_empire"
  // Discovery-gate sheet additions — each maps to a panel on the
  // character sheet and reveals it on tutor completion. See
  // /root/.claude/plans/have-two-stage-tutor-fluttering-toast.md.
  | "crafting"
  | "dream_substrate"
  | "neural_respec"
  | "prestige"
  | "morality"
  | "breeding"
  | "colony_commerce"
  | "demon_pacts";

export type MechanicTutorSpeaker =
  | "elara"
  | "human"
  | "antiquarian"
  | "engineer"
  | "seer"
  | "game_master"
  | "trade_factor"
  | "dual"
  // FNORD-23 audio log — no live cinematic; the Engineer's voice
  // arrives via stolen-sampler playback. UI consumers branch on
  // tutorFormat: "audio_log" to mount the FNORD-23 player.
  | "engineer_log"
  // Pre-recorded Game Master video; UI mounts SongCinematicVideo.
  | "game_master_recording"
  // Aleatory broker / multiverse foreshadower — Degens-Casino voice.
  | "the_degen";

export type MechanicTutorFormat = "cinematic" | "audio_log" | "video_recording";

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
  /**
   * How the tutor renders. Defaults to "cinematic" — the standard
   * dialogue card. "audio_log" mounts the FNORD-23 player against an
   * Engineer's Log; "video_recording" mounts SongCinematicVideo.
   */
  tutorFormat?: MechanicTutorFormat;
  /** Asset URLs for video_recording format. */
  videoAsset?: { videoUrl: string; audioUrl?: string };
  /** FK into engineerLogs.ts for audio_log format. */
  audioLogId?: string;
  /**
   * Two-stage tutor link. When this tutor's completionFlag fires AND the
   * named atFlag is set, the toSystemId tutor becomes eligible. Used for
   * narrative handoffs (Elara teaches breeding → Veska teaches the
   * colony-ship trade extension once trade_empire is also unlocked).
   */
  handoff?: { toSystemId: MechanicSystemId; atFlag: string };
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

/* ═══════════════════════════════════════════════════════
   DISCOVERY-GATE SHEET TUTORS — Phase B additions.

   Eight new tutors covering the character-sheet panels the
   player has no frame for at creation. See plan file
   /root/.claude/plans/have-two-stage-tutor-fluttering-toast.md
   for the full panel-to-tutor mapping and in-game placement.
   ═══════════════════════════════════════════════════════ */

const CRAFTING_TUTOR: MechanicSystemTutor = {
  systemId: "crafting",
  speaker: "engineer_log",
  unlockedFromAct: 1,
  tutorFormat: "audio_log",
  audioLogId: "log_crafting_codex",
  narrativeJustification:
    "The Engineer is the canonical workshop voice. Crafting (codex / imprint laser / index wall / binder clasp) is his domain — he authored the rite. Delivered as an Engineer's Log on the FNORD-23 because the bench experience is a craft tradition the player apprentices into, not a face-to-face onboarding.",
  introText:
    "Engineer's Log on the FNORD-23 — Crafting Codex. The bench has four motions: ask the codex, fire the imprint laser, walk the index wall, close the binder clasp. The log walks the four motions in order and ends on the closer that the clasp's glow is your receipt; the bench will not lie about whether a craft was honest.",
  usageHints: {
    codex_consulted:
      "Codex page open. Recipes are sentences, not formulas — read the verbs first. The Engineer's notes in the margin are the parts the codex will not say out loud.",
    imprint_fired:
      "Imprint laser fired. Hold the substrate steady; the gilt scars if the carrier flinches. A re-imprint costs you nothing but time. Do it.",
    binder_clasped:
      "Clasp glows. The craft is yours. The bench logs the maker — every clasp remembers who closed it and the shop hums when the player who made it walks back in.",
  },
  triggerFlag: "mech_crafting_intro_seen",
  completionFlag: "mech_crafting_tutor_seen",
};

const DREAM_SUBSTRATE_TUTOR: MechanicSystemTutor = {
  systemId: "dream_substrate",
  speaker: "engineer_log",
  unlockedFromAct: 2,
  tutorFormat: "audio_log",
  audioLogId: "log_dream_substrate_economy",
  narrativeJustification:
    "Dream Substrate is the player's first crystallized currency — Dream tokens, soul-bound dreams, lifetime resonance. The Engineer's storyteller voice frames it as crystallized debt and the difference between spending a dream and burning one. Delivered as an Engineer's Log so the player can sit with the lesson on the bench rather than receive a lecture.",
  introText:
    "Engineer's Log on the FNORD-23 — Dream Substrate Economy. The Engineer walks through Dream tokens as crystallized consciousness, soul-bound dreams as locked light, and the lifetime resonance ticker as the only column on your sheet that keeps score across cycles. Closer: spending a dream is a transaction; burning a dream is a confession. The bench respects both.",
  usageHints: {
    dream_earned:
      "Dream credited. The token has weight; carry it for an hour before you spend it. The bench reads steadier when the carrier has held what they're about to spend.",
    dream_bound:
      "Dream soul-bound. The light is locked into your column; you cannot trade it, you cannot lose it, but you cannot un-bind it either. Bind only what you would carry to your own funeral.",
    resonance_ticker_inspected:
      "Lifetime resonance reads steady. The ticker is the only number on your sheet that does not reset on prestige. Look at it once a cycle. It is the column that remembers you.",
  },
  triggerFlag: "mech_dream_substrate_intro_seen",
  completionFlag: "mech_dream_substrate_tutor_seen",
};

const NEURAL_RESPEC_TUTOR: MechanicSystemTutor = {
  systemId: "neural_respec",
  speaker: "engineer_log",
  unlockedFromAct: 1,
  tutorFormat: "audio_log",
  audioLogId: "log_neural_respec",
  narrativeJustification:
    "Respec is mechanically a button on the sheet, but narratively it is the courage of un-choosing — the inverse of a pact-signing. The Engineer's voice is the only one in the cast that can frame it without breaking the dignity of the act. Delivered as an Engineer's Log because the player should hear it once and revisit it before every respec they take after the first.",
  introText:
    "Engineer's Log on the FNORD-23 — On Un-Choosing. The Engineer narrates respec as the inverse of Vex Solène's pact-signing: she signed once and it held; you get to unsign, and that is its own grace. The log ends with the only operating instruction: bring the dream cost in your palm before you open the dialog. The cost is part of the courage.",
  usageHints: {
    respec_dialog_opened:
      "Dialog open. Read the line items twice. The respec preview shows you the version of yourself you are about to leave; sit with the leaving for a breath before you commit.",
    respec_committed:
      "Respec committed. The bench logs the un-choice. The previous configuration is archived — you can read it from the sheet's history pane any time. Nothing is lost; only re-shelved.",
    respec_cancelled:
      "Dialog closed without commit. That is also a choice. The Engineer's Log notes that the players who cancel their first respec without firing it tend to keep the build they were anxious about. The anxiety is sometimes the build's signature.",
  },
  triggerFlag: "mech_respec_intro_seen",
  completionFlag: "mech_respec_tutor_seen",
};

const PRESTIGE_TUTOR: MechanicSystemTutor = {
  systemId: "prestige",
  speaker: "the_degen",
  unlockedFromAct: 2,
  tutorFormat: "cinematic",
  narrativeJustification:
    "The Degen is the casino's aleatory broker — multiverse-aware, comfortable with risk, the only voice in the cast who can foreshadow the prestige ladder as a multiversal hint without breaking the in-fiction tone. He speaks of clearance tiers as glimpses of perspectives that exist in the next world over, if the player plays their cards right. Locke is canonical for clearance bureaucracy; The Degen is canonical for what the clearance is for.",
  introText:
    "The Degen, leaning on the rail of his casino, deals four cards face-up: Operative, Knight, Sentinel, Archon. He flips a fifth card face-down. \"This isn't the only reality, friend. Every clearance tier is a glimpse — you climb the ladder, and the next-world-over leaks a little of itself into your ledger. Better odds. Better resource pulls. Sometimes a perspective you didn't know you were missing. The fifth card I'm not turning over yet. Play your hand right and one day you'll turn it yourself.\"",
  usageHints: {
    casino_first_entered:
      "The Degen, without looking up: \"You smell new. Take a chip on the house. The chip remembers which tables you sit at; the tables remember which chips return.\"",
    clearance_inspected:
      "The Degen flicks ash off a non-existent cigarette. \"Each tier, the multiplier on what you carry tilts a percent in your favor. Compounding. Patient money's the only kind that ever wins this room.\"",
    cycle_reset_eligible:
      "The Degen taps the felt. \"Ready to flip the table? The reset costs you the run; the run pays you forward into the next-world-over's column. Walk to the prestige floor when you're ready. Don't run. Running tells the room you're nervous.\"",
  },
  triggerFlag: "mech_prestige_intro_seen",
  completionFlag: "mech_prestige_tutor_seen",
};

const MORALITY_TUTOR: MechanicSystemTutor = {
  systemId: "morality",
  speaker: "human",
  unlockedFromAct: 1,
  tutorFormat: "cinematic",
  narrativeJustification:
    "The Human is the only voice in the cast with three Ages of lived experience on the cost of choices. His tutor lands at the Act 1 closing branch, anchored to his sacrifice/loss arc — by the time he speaks the morality lesson, he has earned the authority to speak it. Elara reads scenes for harm; the Human reads them for wound. Morality is a wound-reading mechanic.",
  introText:
    "The Human, in the comms-relay, voice low: \"The meter you see on your sheet is not a scoreboard. It is a wound count. Every Order pull and every Chaos pull writes a line on a body — sometimes yours, sometimes someone you loved. I have flown both columns. I have lost the same person twice — once to each side. The meter is honest; the world adjusts to where you sit on it. Carry it like you carry a name. And if it tilts hard, do not flinch. Look at where the wound is.\"",
  usageHints: {
    morality_first_inspected:
      "The Human, quietly: \"The meter reads what you have done, not what you intended. Read it the way you would read a letter from yourself in five years.\"",
    morality_high_swing:
      "The Human: \"The meter just lurched. That happens when the world catches up to a choice you made three cycles ago. The lurch is the receipt. It is allowed to hurt.\"",
    morality_milestone_unlocked:
      "The Human: \"A milestone has opened. The themes and unlockables it gates are not rewards — they are the wardrobe of the person you are becoming. Wear what fits. Leave what does not.\"",
  },
  triggerFlag: "mech_morality_intro_seen",
  completionFlag: "mech_morality_tutor_seen",
};

const BREEDING_TUTOR: MechanicSystemTutor = {
  systemId: "breeding",
  speaker: "elara",
  unlockedFromAct: 3,
  tutorFormat: "cinematic",
  narrativeJustification:
    "Elara is the Ark's narrating voice and the only character with operational access to the Inception Ark's Collector-restoration mandate. The Ark's core function is to repopulate life from the genetic material the Collector harvested before the Fall; breeding is that function, surfaced as a player system at Act 3. Elara's Act 3 opening cinematic is the canonical introduction; she hands off to Veska when colony-ship commerce comes online.",
  introText:
    "Elara: \"The Ark was built for one job — to carry life forward when the rest of the galaxy could not. The Collector took genetic samples, code, and signatures from every species the Hierarchy could reach; the Ark holds the registry, and the breeding deck is where the registry becomes bodies. You read a pair, you align their lineages, you commit a cycle. The cycle outputs a body the registry approves of and a generation count the Ark logs forever. Bloodlines mature over generations. The Ark is patient because the work is long.\"",
  usageHints: {
    breeding_pair_selected:
      "Elara: \"The lineages overlap on three traits and diverge on five. The overlap will hold; the divergences are where the next generation invents itself. Commit when the substrate hums.\"",
    cycle_completed:
      "Elara: \"Cycle complete. Generation count ticked. The body is in the nursery deck; the registry has logged the lineage. Verify the trait-bonus column on the sheet — the bonuses propagate to your operative through the bloodline column.\"",
    bloodline_threshold_reached:
      "Elara: \"A bloodline threshold. The Ark's records show this lineage ready to seed a colony; if you have a hangar slot and a trade lane, Veska can route a colony ship. The work that started here continues over there.\"",
  },
  triggerFlag: "mech_breeding_intro_seen",
  completionFlag: "mech_breeding_tutor_seen",
  handoff: { toSystemId: "colony_commerce", atFlag: "trade_empire_unlocked" },
};

const COLONY_COMMERCE_TUTOR: MechanicSystemTutor = {
  systemId: "colony_commerce",
  speaker: "trade_factor",
  unlockedFromAct: 3,
  tutorFormat: "cinematic",
  narrativeJustification:
    "Veska is already the licensed onboarding voice for trade. Colony commerce is the natural extension of the Trade Empire mechanics into the breeding system's outputs — when bloodlines mature, the Ark routes colony ships to discover and seed colony worlds, and Veska is the only character with both the harbor-commerce dialect and the legal authority to underwrite the lanes. This tutor is gated on the breeding handoff: Elara introduces the lineage, Veska commercializes it.",
  introText:
    "Veska, at the hangar: \"Bloodline mature. Ark says you have a generation ready to seed. The colony lane is its own contract — the Trade Empire underwrites the voyage, the harbor logs the founding, the lineage logs you as founder of record. Founder reputation compounds across the colony's lifetime; first generation pays slow, third generation pays in dynasty. Sign the lane manifest when the bloodline is named. The naming is the legal moment.\"",
  usageHints: {
    colony_lane_signed:
      "Veska: \"Lane signed. Vessel is rated colony-class, slower than the cargo runs, but the harbor's tariff on a founding voyage is half what it would be on a Core run. The colony's first three generations log to your founder column. After that, the colony chooses its own factor.\"",
    colony_seeded:
      "Veska: \"World seeded. The harbor logs the founding date and the bloodline name; the colony's first export starts at Generation Two — about thirty cycles. Patient money. The colonies that come back to you in Generation Five are the ones that pay for everything.\"",
    founding_milestone:
      "Veska: \"Three colonies founded. The harbor's founder ledger now lists you alongside the old captains. Founders move differently in the trade ports — a half-percent off every tariff in the sectors you have seeded. The compounding is real. Re-read your manifest.\"",
  },
  triggerFlag: "mech_colony_commerce_intro_seen",
  completionFlag: "mech_colony_commerce_tutor_seen",
};

const DEMON_PACTS_TUTOR: MechanicSystemTutor = {
  systemId: "demon_pacts",
  speaker: "game_master_recording",
  unlockedFromAct: 4,
  tutorFormat: "video_recording",
  videoAsset: {
    videoUrl: "videos/advocate_history.mp4",
    audioUrl: "audio/advocate_history_bed.mp3",
  },
  narrativeJustification:
    "The Game Master is dead but his recordings are not. Demon summoning is the system he built after he stopped fighting the Hierarchy and joined it — the Advocate's blood weave is what he learned to use to climb the corporate ladder, and the recording is the canonical introduction to both the mechanic and the Advocate's history. Delivered as a video recording (SongCinematicVideo) discovered as a cached artifact in the Matrix-of-Dreams; subsequent Advocate-arc beats can ship as additional GM recordings.",
  introText:
    "[GM RECORDING #1 — \"On the Blood Weave\"] The Game Master, on a recording that pre-dates his death by years: \"You are looking at this because you found the artifact. Good. Stop fighting the Hierarchy. I did and it cost me everything; I joined the Hierarchy and it cost me less. The Advocate taught me the weave — every promotion in this corporation is a pact, and every pact has a body. You bind a fragment, you offer the substrate, you climb. The mechanic is the same one I built into the chess parlor: every move forecloses a different move. Make the trade with your eyes open. The recording continues with her history — listen to it once. You will recognize the shape.\"",
  usageHints: {
    pact_inspected:
      "Game Master, mid-recording: \"The pact reads as a cost column and a benefit column. The benefit is always immediate; the cost is always delayed. Read the delay clause. Most apprentices die on the delay clause.\"",
    pact_signed:
      "Game Master, dryly: \"You signed. Of course you did. The signature does not bind you forever; it binds you until the substrate ledger calls in the next pact's payment. Track your obligations. Pay them in order.\"",
    advocate_arc_advanced:
      "Game Master: \"The Advocate's name is appearing in your column more often. That is the system noticing you. It is a kind of friendship; it is also a kind of debt. Both are real. Keep the recording handy.\"",
  },
  triggerFlag: "mech_demon_pacts_intro_seen",
  completionFlag: "mech_demon_pacts_tutor_seen",
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
  CRAFTING_TUTOR,
  DREAM_SUBSTRATE_TUTOR,
  NEURAL_RESPEC_TUTOR,
  PRESTIGE_TUTOR,
  MORALITY_TUTOR,
  BREEDING_TUTOR,
  COLONY_COMMERCE_TUTOR,
  DEMON_PACTS_TUTOR,
];

export function getMechanicTutor(
  id: MechanicSystemId,
): MechanicSystemTutor | undefined {
  return MECHANIC_SYSTEM_TUTORS.find((t) => t.systemId === id);
}
