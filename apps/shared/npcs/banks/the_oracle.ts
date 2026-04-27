// apps/shared/npcs/banks/the_oracle.ts
//
// Phase 3 Group C — The Oracle's NpcLine bank (substrate-only canon).
//
// Per the_oracle.md §1.5 substrate-test: every Oracle line operates ONLY
// through one of three canonical channels:
//   - dream_substrate     — dream-sequence trigger on room transitions
//   - memory_residue      — Oracle-narrator-frame for canonical story-arc
//                           memory events (Mechronis, Liberation, etc.)
//   - cinematic_exception — waking-saga-time speech, only inside cinematics
//
// Selector enforces via requiresRevealStage. Trust bands: Wary (pre-Ch5)
// / Witnessed (post-Ch5) / Present (post-Ch6) / Inheriting (post-Ch12).
//
// Per bible §1.4 six-tells, the Oracle's voice is canonically
// distinguishable from his impersonators (Meme + False Prophet) by:
// substrate-as-position, we-of-witness, transferred-instinct closure,
// de-centered self, etc. Every line below carries one or more of these
// tells.
//
// Authoring scope per §5.5 + writers' guide: ~88 total lines (cinematic +
// dream + memory-narrator-frames). This Phase 3 bank ships 12 canonical
// lines covering the most-load-bearing surfaces; remainder is Phase 4
// expansion territory.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "the_oracle" as const;

export const THE_ORACLE_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE — Ch5 cinematic introduction-of-self (canonical)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "oracle.cinematic.ch5.introduction_of_self",
    text:
      "I am going to speak to you for the first time. You have been " +
      "hearing my voice underneath Elara's for eleven chapters without " +
      "knowing. I am sorry for the deception. I needed you to choose " +
      "me instead of remember me.",
    surfaces: ["cinematic"],
    requiresRevealStage: "cinematic_exception",
    cooldownKey: "oracle.ch5_introduction",
    maxPlays: 1,
    setsFlags: ["oracle_revealed_via_ch5_cinematic"],
    setsPublicFlags: ["oracle_silence_ended_for_player"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "oracle.cinematic.ch6.disambiguation",
    text:
      "You are not her. You never were. The instinct you just used was " +
      "mine — and now it is yours, because you spent it in a moment " +
      "where I could not. Take it with you.",
    surfaces: ["cinematic"],
    requiresRevealStage: "cinematic_exception",
    minAct: 6,
    cooldownKey: "oracle.ch6_disambiguation",
    maxPlays: 1,
    setsPublicFlags: ["oracle_disambiguated_player_from_clone"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // DREAM-SUBSTRATE (Wary band, pre-Ch5 unattributed dream)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act1.wary.chair_was_warm",
    text:
      "The chair was warm. The window was open. Underneath the room you " +
      "are about to walk into, something is waiting that you do not yet " +
      "know is waiting for you.",
    surfaces: ["dream_sequence"],
    minAct: 1,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act1_chair",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act3.wary.walk_forward",
    text:
      "You have been walking forward. We have been walking with you. " +
      "Underneath what we are walking toward, the substrate is thinning. " +
      "We are not asking you to slow. We are asking you to notice.",
    surfaces: ["dream_sequence"],
    minAct: 3,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act3_walk_forward",
    maxPlays: 2,
  },

  // ─── Acts 1-3 dream-substrate expansion (Phase 6b.3 sub-chunk B) ────
  // Nine additional pre-Ch5 dream-residue beats covering canonical
  // Acts 1-3 dream-cadence per §1.2: image + sentence + instruction
  // triplets, ending-on-residue, no rhetorical questions. Per §1.5
  // voice gate, every line operates through dream_substrate channel
  // only. Per §1.3 vocabulary canon: canonical "underneath" + "we /
  // us" + "Take it / Spend it" anchors land; canonical "deception"
  // + "I am sorry" Tell #1 lands at Act 2.

  // ─── Act 1 (3 new lines) ────────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act1.wary.first_residue",
    // Canonical first dream-residue per §1.2 image+sentence+
    // instruction triplet structure. Tell #2 substrate-as-position
    // ("Underneath") + Tell #6 de-centered self (no first-person-
    // singular voice-anchor; player carries the not-knowing).
    text:
      "[Dream-residue: a hand pressed against glass from the inside. " +
      "Underneath the image, a voice the player will not yet attribute: " +
      "'You will hear this voice again. You will not know whose it is " +
      "yet. Carry the not-knowing with you.']",
    surfaces: ["dream_sequence"],
    minAct: 1,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act1.first_residue",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act1.wary.thaloria_unnamed",
    // Canonical Origin §2.1 pre-naming dream — the canonical "city
    // built on a debate hall" image lands the canonical Thaloria
    // anchor without yet naming Thaloria. Tell #2 substrate-as-
    // position via "Underneath the architecture" framing. Tell #3
    // we-of-witness via "We will return to it."
    text:
      "[Dream-residue: a city built on a debate hall. Underneath the " +
      "architecture: 'A debate was lost here. The losing was the " +
      "doorway. We will return to it.' The image holds; the voice " +
      "fades.]",
    surfaces: ["dream_sequence"],
    minAct: 1,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act1.thaloria_unnamed",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act1.wary.choosing_matters",
    // Canonical Tell #4 forward-looking choice-rhetoric + Tell #5
    // transferred-instinct closure ("Take the choosing with you.
    // Spend it.") — the canonical Oracle dream-cadence triplet
    // per §1.2.
    text:
      "[Dream-residue: the player's most recent waking choice replays " +
      "in dream-time. Underneath it: 'You chose. The choosing matters " +
      "more than the choice. Take the choosing with you. Spend it.']",
    surfaces: ["dream_sequence"],
    minAct: 1,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act1.choosing_matters",
    maxPlays: 2,
  },

  // ─── Act 2 (3 new lines) ────────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act2.wary.deception_named",
    // Canonical pre-reveal Tell #1 responsibility-without-agency
    // apology ("We are sorry for it"). The canonical "deception"
    // anchor per §1.3 lands here for the first time — pre-Ch5 the
    // player canonically receives the canon without attribution.
    text:
      "[Dream-residue: a voice underneath the wakeful suspicions: " +
      "'There is a deception in the saga's voice. The deception is " +
      "not yours. We are sorry for it. Spend the knowing carefully.']",
    surfaces: ["dream_sequence"],
    minAct: 2,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act2.deception_named",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act2.wary.warden_unnamed",
    // Canonical §2.4 Jailer-state pre-reveal — the canonical "this
    // was the canonical-instrument of my own captivity" register
    // lands without yet naming the Warden. Tell #3 we-of-witness +
    // canonical "We did not yet know. We are knowing now." present-
    // tense recognition register.
    text:
      "[Dream-residue: a structure that holds something inside it. " +
      "Underneath it: 'This was the canonical-instrument of my own " +
      "captivity. We did not yet know. We are knowing now. Walk past " +
      "it again.']",
    surfaces: ["dream_sequence"],
    minAct: 2,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act2.warden_unnamed",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act2.wary.we_are_recovering",
    // Canonical recovery register per §2.7 Liberation aftermath. The
    // canonical "the medium is unsafe; the dream-substrate is safe"
    // register lands the canonical Meme-cannot-reach-dream-substrate
    // canon per §1.1 cross-bible Meme canon.
    text:
      "[Dream-residue: a voice underneath the player's gathering of " +
      "fragments: 'We are recovering. The recovering is canonical. " +
      "The medium is unsafe; the dream-substrate is safe. " +
      "Continue.']",
    surfaces: ["dream_sequence"],
    minAct: 2,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act2.we_are_recovering",
    maxPlays: 2,
  },

  // ─── Act 3 (3 new lines) ────────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act3.wary.medium_is_hostile",
    // Canonical pre-Ch5 medium-vs-substrate disambiguation register.
    // Per §1.1 cross-bible Meme canon: "Trust the dream over the
    // broadcast" lands the canonical Meme-cannot-reach-dream-
    // substrate canon directly.
    text:
      "[Dream-residue: a voice underneath the loud waking-substrate: " +
      "'The medium you walk through is canonically not mine. The " +
      "medium has been edited. The dream-substrate has not been " +
      "edited. Trust the dream over the broadcast.']",
    surfaces: ["dream_sequence"],
    minAct: 3,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act3.medium_is_hostile",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act3.wary.substrate_underneath_substrate",
    // Canonical pre-Ch5 voice-disambiguation per the canonical Ch5
    // cinematic anchor: "you have been hearing my voice underneath
    // Elara's for eleven chapters." The Acts 3 dream lands the
    // canonical "underneath the voice" disambiguation early —
    // Tell #2 substrate-as-position canonical landing.
    text:
      "[Dream-residue: a substrate underneath another substrate, " +
      "visible only at certain angles. Underneath it: 'The voice you " +
      "have been hearing for ten chapters is not mine. The voice " +
      "underneath the voice is mine. We are almost ready to be " +
      "canonical.']",
    surfaces: ["dream_sequence"],
    minAct: 3,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act3.substrate_underneath",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act3.wary.preparation_for_first_naming",
    // Canonical pre-Ch5 anticipation register — the canonical
    // "first time" anchor per §1.3 + Tell #5 transferred-instinct
    // closure ("Take the canonical-anticipation with you. Spend
    // it on the choosing.") + Tell #4 canonical "choosing" anchor.
    text:
      "[Dream-residue: a voice underneath a lull in the saga's noise: " +
      "'I am about to speak to you for the first time. The first " +
      "time is canonically Chapter 5. Take the canonical-anticipation " +
      "with you. Spend it on the choosing.']",
    surfaces: ["dream_sequence"],
    minAct: 3,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.act3.preparation_for_first_naming",
    maxPlays: 1,
    setsFlags: ["oracle_first_naming_anticipated"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // DREAM-SUBSTRATE (Witnessed band, post-Ch5 attributed)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act5.witnessed.we_were_the_bench",
    text:
      "We were the bench at Mechronis when the Seer chose not to raise " +
      "her staff. The choosing was for him; we received it together. " +
      "You did not need to know we were there. We were canonically there " +
      "anyway.",
    surfaces: ["dream_sequence"],
    minAct: 5,
    requiresTrustBand: "Witnessed",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.witnessed_mechronis",
    maxPlays: 1,
  },

  // ─── Acts 5 Witnessed-band expansion (Phase 6b.3 sub-chunk C) ───────
  // Nine post-Ch5 attributed dream-residue beats per the_oracle.md
  // §1.2 + §3.4 Witnessed-band canon. Each line gates on the Ch5
  // first-naming flag (`oracle_revealed_via_ch5_cinematic`); the
  // canonical "I am the Oracle" attribution is now load-bearing.
  // §1.3 vocabulary anchors continue: "underneath" / "we / us" /
  // "Take it / Spend it" / "deception" + Tell #1 apology lands.

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act5.witnessed.first_named_dream",
    // Canonical first-named dream — the voice is no longer
    // "underneath" only; the canonical name is now load-bearing.
    text:
      "[Dream-residue: a voice that is no longer underneath only — it " +
      "is named now: 'I am the Oracle. We have been meeting in dreams " +
      "for four chapters. The meetings are canonical. Take the " +
      "canonical-name with you.']",
    surfaces: ["dream_sequence"],
    minAct: 5,
    maxAct: 5,
    requiresTrustBand: "Witnessed",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.dream.act5.first_named",
    maxPlays: 1,
    setsFlags: ["oracle_first_dream_after_ch5_received"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act5.witnessed.we_share_a_substrate",
    // Canonical Tell #3 we-of-witness — the canonical "we share"
    // register lands canonical post-naming substrate-co-presence.
    text:
      "[Dream-residue: the dream-substrate now visibly carries two " +
      "voices: 'We share a substrate. The sharing is canonical. The " +
      "sharing began before you knew. The knowing is the difference " +
      "now.']",
    surfaces: ["dream_sequence"],
    minAct: 5,
    maxAct: 6,
    requiresTrustBand: "Witnessed",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.dream.act5.we_share_substrate",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act5.witnessed.canonical_apology_in_voice",
    // Canonical Tell #1 responsibility-without-agency apology — the
    // canonical "I am sorry for the deception" register canonically
    // first-attributable post-Ch5.
    text:
      "[Dream-residue: a voice clearer than before: 'I am sorry for " +
      "the deception. The deception was the Meme's. The consequences " +
      "were yours. We acknowledge the asymmetry. Take the " +
      "acknowledgment with you.']",
    surfaces: ["dream_sequence"],
    minAct: 5,
    maxAct: 6,
    requiresTrustBand: "Witnessed",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.dream.act5.canonical_apology",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act5.witnessed.mechronis_anchor_pre_memory",
    // Canonical anticipation of the Mechronis memory-residue per the
    // existing `oracle.memory_residue.mechronis_engineer` line.
    text:
      "[Dream-residue: an image of a bench that is canonically not " +
      "yet a memory. Underneath: 'We will walk Mechronis together " +
      "when the saga canonically permits it. Until then: this is the " +
      "canonical preview.']",
    surfaces: ["dream_sequence"],
    minAct: 5,
    maxAct: 6,
    requiresTrustBand: "Witnessed",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.dream.act5.mechronis_pre_memory",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act5.witnessed.dream_carries_into_trade_empire",
    // Canonical dream-residue → mission-unlock per §5.1 mechanic
    // (per the existing `oracle.dream.act3.wary` foundations + the
    // canonical Trade Empire integration). Tell #5 transferred-
    // instinct closure: "Take the dream-residue with you. Spend it
    // where the contracts are."
    text:
      "[Dream-residue: an instruction the player carries forward into " +
      "Trade Empire: 'There is a contract you have not yet seen. The " +
      "contract has been waiting underneath the routes. Take the " +
      "dream-residue with you. Spend it where the contracts are.']",
    surfaces: ["dream_sequence"],
    minAct: 5,
    maxAct: 6,
    requiresTrustBand: "Witnessed",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.dream.act5.trade_empire_residue",
    maxPlays: 2,
    setsFlags: ["oracle_dream_residue_for_trade_empire_set"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act5.witnessed.canonical_we_walked_pre_memory",
    // Canonical pre-memory-residue anchor for Acts 7+ canonical "we
    // walked together" register per the canonical 4-act Identity arc.
    text:
      "[Dream-residue: a voice underneath the canonical-already-there: " +
      "'We walked the substrate together once. You do not yet " +
      "remember. We are not yet ready to remember together. Soon. " +
      "Walk forward.']",
    surfaces: ["dream_sequence"],
    minAct: 5,
    maxAct: 6,
    requiresTrustBand: "Witnessed",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.dream.act5.we_walked_pre_memory",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act5.witnessed.first_canonical_choosing",
    // Canonical Tell #4 forward-looking — canonical post-naming first
    // choosing register lands.
    text:
      "[Dream-residue: the voice acknowledging the player's first " +
      "canonical post-naming choice: 'You chose me. The choosing " +
      "held. The holding is the canonical-confirmation. Take the " +
      "holding with you.']",
    surfaces: ["dream_sequence"],
    minAct: 5,
    maxAct: 6,
    requiresTrustBand: "Witnessed",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.dream.act5.first_choosing_held",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act5.witnessed.substrate_is_thinning",
    // Canonical substrate-thinning register — bridge anchor for
    // Acts 6+ canonical Present-band content where the substrate
    // canonically thins further toward the canonical Disappearance.
    text:
      "[Dream-residue: the substrate visibly thinning at certain " +
      "depths: 'The substrate is thinning where you walk. We are " +
      "reaching through the thin places. Walk slower in those " +
      "places. We will be louder there.']",
    surfaces: ["dream_sequence"],
    minAct: 5,
    maxAct: 6,
    requiresTrustBand: "Witnessed",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.dream.act5.substrate_thinning",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act5.witnessed.canonical_hierophant_pre_canon",
    // Canonical anticipation of Ch6 Hierophant cross-canon per
    // ask_oracle_about_hierophant + canonical "almost ready to refuse"
    // canon. Cross-bible bridge to Hierophant bible §4.10 reserved
    // Inheriting line.
    text:
      "[Dream-residue: a voice underneath an upcoming canonical " +
      "figure: 'You will meet someone who is preparing for my return. " +
      "He is preparing canonically. I am almost ready to refuse " +
      "canonically. Take the canonical-tension with you. Spend it on " +
      "listening.']",
    surfaces: ["dream_sequence"],
    minAct: 5,
    maxAct: 6,
    requiresTrustBand: "Witnessed",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.dream.act5.hierophant_pre_canon",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // MEMORY-RESIDUE (Mechronis triple-anchored canon per Seer §4.5)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.mechronis_engineer",
    text:
      "We are watching the Engineer at the bench. The Seer enters. The " +
      "Seer does not raise her staff. We — the player, the witness, the " +
      "substrate-recording — receive the lesson together. The bench " +
      "learned. We learned. You learn now, by canonically witnessing.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    cooldownKey: "oracle.memory.mechronis",
    maxPlays: 1,
    setsPublicFlags: ["oracle_mechronis_memory_witnessed"],
  },

  // ─── Memory-residue expansion sub-chunk E (Phase 6b.3) ──────────────
  // Ten canonical memory-residue beats covering: 4 Mechronis-memory
  // expansions (pre-match witness, staff inheritance, Academy
  // year-long conversation, Engineer-finds-burnt-card) + 3 Origin
  // memories (debate-hall, witnessable-soul argument, Collector
  // doorway) + 3 Harvest memories (Collector arrival, amnesia onset,
  // last-Thalorian moment).
  //
  // Per §1.2 memory-residue cadence canon: narrator-frame (NOT direct
  // speech), first-person-plural-of-witness ("we / us / our"), past-
  // tense-as-present-tense interleaving. Per §1.5 voice gate:
  // memory_residue surface only.

  // ─── Mechronis memory expansion (4 lines) ───────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.mechronis_bench_witness_pre_match",
    text:
      "We are watching the bench before the match begins. The Engineer " +
      "is already seated; he is canonically not yet who he canonically " +
      "becomes. We are watching him watch the Seer arrive. We — the " +
      "player, the substrate, the canonical-substrate-recording — are " +
      "canonically present. The bench has not yet canonically learned. " +
      "We are about to canonically witness the canonical-learning.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    unlockFlags: ["oracle_mechronis_memory_witnessed"],
    cooldownKey: "oracle.memory.mechronis_pre_match",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.mechronis_staff_inheritance",
    // Cross-bible Seer §2.2 + §4.5 staff canon. The canonical "Yours
    // to return, if you ever decide to. No rush." anchor lands as
    // memory-residue narrator-frame — the player witnesses the
    // canonical staff-leaving moment.
    text:
      "We are watching the Seer leave her staff on the bench. She " +
      "does not say what she canonically meant by leaving it. The " +
      "Engineer canonically does not yet know it is a staff. He " +
      "canonically thinks it is a measuring rod. We — the substrate, " +
      "the canonical-witnessing — already know what it is. We will " +
      "canonically remember knowing.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    unlockFlags: ["oracle_mechronis_memory_witnessed"],
    cooldownKey: "oracle.memory.mechronis_staff_inheritance",
    maxPlays: 1,
    setsFlags: ["oracle_mechronis_staff_witnessed"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.mechronis_year_long_conversation",
    // Cross-bible Seer §3.1 Academy year-long-conversation canon —
    // the canonical Academy aftermath where the cohort canonically
    // discusses the Seer's visit for an academic year.
    text:
      "We are watching the Academy talk about it for a year. The " +
      "cohort canonically does not resolve into a single named lesson. " +
      "The not-resolving is the canonical lesson. We — the substrate, " +
      "the canonical-keeping — keep it for them. We canonically " +
      "carry the year-long conversation forward into our own dreams.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    unlockFlags: ["oracle_mechronis_memory_witnessed"],
    cooldownKey: "oracle.memory.mechronis_year_long_conversation",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.mechronis_engineer_burnt_card",
    // Cross-bible Seer §5.3 burnt-card canon. The canonical Engineer-
    // finds-burnt-card-inside-the-staff moment — the canonical
    // "remembered before she taught you how" anchor lands as
    // memory-residue.
    text:
      "We are watching the Engineer canonically find a card inside " +
      "the staff. He does not yet know what the card is. He " +
      "canonically remembers it before he canonically learns what it " +
      "is. We — the substrate, the canonical-watching — recognise the " +
      "remembering. The remembering canonically pre-dates the canonical-" +
      "learning. The pre-dating is canonical.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    unlockFlags: ["oracle_mechronis_memory_witnessed"],
    cooldownKey: "oracle.memory.mechronis_engineer_burnt_card",
    maxPlays: 1,
  },

  // ─── Origin memory (3 lines, canonical Thalorian soul-debate) ───────

  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.origin.debate_hall_entry",
    // Canonical §2.1 Origin memory — the canonical debate-hall on
    // Thaloria. Past-tense-as-present-tense canonical canon per §1.2.
    text:
      "We are walking into the debate hall on Thaloria. The hall " +
      "canonically has the canonical-acoustics of Thalorian soul-" +
      "philosophy — the canonical-resonance that canonically makes " +
      "every word weigh more than it should. We are taking our " +
      "canonical-seat. We have canonically prepared the argument. We " +
      "canonically know how it ends. We are canonically going through " +
      "with it anyway.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.memory.origin_debate_hall",
    maxPlays: 1,
    setsFlags: ["oracle_origin_memory_witnessed"],
    setsPublicFlags: ["oracle_origin_canon_witnessed"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.origin.witnessable_soul_argument",
    // Canonical "we argued for a soul that could be witnessed" —
    // matches the canonical ask_oracle_soul_debate canon.
    text:
      "We are arguing for a soul that can be canonically witnessed. " +
      "They are arguing for a soul that cannot. The canonical-room " +
      "is canonically already on their side. The canonical-room " +
      "canonically prefers the unwitnessable; the unwitnessable is " +
      "canonically more convenient to govern. We canonically know we " +
      "are losing. We are canonically continuing.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.memory.origin_witnessable_soul",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.origin.collector_doorway",
    // Canonical "the losing was the doorway" anchor per ask_oracle_
    // soul_debate. The canonical Collector approaches the canonical-
    // doorway after the canonical-losing.
    text:
      "We are watching the canonical-losing land. The room canonically " +
      "rises. The canonical-doorway opens — not the door of the hall, " +
      "but the doorway the losing canonically was. The Collector is " +
      "canonically waiting on the other side. We did not yet know the " +
      "Collector. We canonically know him now, in retrospect. The " +
      "knowing is the canonical-cost of the canonical-loss.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    unlockFlags: ["oracle_revealed_via_ch5_cinematic"],
    cooldownKey: "oracle.memory.origin_collector_doorway",
    maxPlays: 1,
  },

  // ─── Harvest memory (3 lines, canonical Collector taking) ───────────

  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.harvest.collector_arrives",
    // Canonical §2.2 Harvest memory — the canonical Collector taking.
    // Gates on canonical post-Ch6 disambiguation flag — the canonical
    // Harvest memory canonically requires the canonical clone-canon
    // disclosure to canonically land for the player.
    text:
      "We are watching the Collector approach. He canonically does " +
      "not announce himself. He canonically takes what is canonically " +
      "inconvenient to leave. We were canonically inconvenient. We are " +
      "watching him canonically take us. We — the substrate, the " +
      "canonical-witnessing — are canonically watching ourselves be " +
      "taken. The canonical-asymmetry is canonical.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.memory.harvest_collector_arrives",
    maxPlays: 1,
    setsFlags: ["oracle_harvest_memory_witnessed"],
    setsPublicFlags: ["oracle_harvest_canon_witnessed"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.harvest.amnesia_onset",
    // Canonical Prisoner-state precursor — the canonical amnesia-
    // onset moment where the canonical-self canonically begins to
    // canonically lose canonical-memory.
    text:
      "We are watching ourselves canonically lose canonical-memory in " +
      "pieces. The pieces canonically do not return. The canonical-" +
      "self canonically thins. We are canonically watching the " +
      "canonical-thinning. The canonical-Prisoner is canonically " +
      "about to canonically begin. The canonical-Prisoner did not " +
      "yet know he was canonically the Oracle. We canonically know.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.memory.harvest_amnesia_onset",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.harvest.last_thalorian_moment",
    // Canonical pre-amnesia closing — the canonical last canonical-
    // Thalorian moment before the canonical-Prisoner-state canonically
    // begins. Tell #5 transferred-instinct closure: "Take the canonical-
    // moment with you. Spend it on canonical-grace."
    text:
      "We are watching the canonical-last canonical-Thalorian " +
      "moment. The canonical-acoustics of soul-philosophy canonically " +
      "fade. The canonical-room canonically closes. We canonically " +
      "do not return to that canonical-room. The canonical-not-" +
      "returning is canonical. Take the canonical-moment with you. " +
      "Spend it on canonical-attention.",
    surfaces: ["memory_residue"],
    requiresRevealStage: "memory_residue",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.memory.harvest_last_thalorian_moment",
    maxPlays: 1,
  },

  // ─── Acts 6-7 Present-band dreams (Phase 6b.3 sub-chunk D) ─────────
  // Five canonical post-Ch6 mirror-match-resolved dream-residue beats
  // per the_oracle.md §3.4 Present-band canon. The voice canonically
  // shifts from "underneath the voice" to "underneath the three"
  // canonical disambiguation register.

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act6.present.post_disambiguation_co_presence",
    // Canonical first dream after Ch6 mirror-match resolution. The
    // canonical "we canonically share the substrate now" register
    // lands canonical-attribution + canonical Tell #3 we-of-witness.
    text:
      "[Dream-residue: the Oracle's voice now canonically " +
      "attributable, no longer canonically ambiguous: 'You " +
      "disambiguated me from the clone. The disambiguation is " +
      "canonical. We canonically share the substrate now without " +
      "canonical interference. Walk forward.']",
    surfaces: ["dream_sequence"],
    minAct: 6,
    maxAct: 7,
    requiresTrustBand: "Present",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.dream.act6.post_disambiguation",
    maxPlays: 1,
    setsFlags: ["oracle_post_ch6_dream_received"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act7.present.mechronis_walked_together",
    // Canonical Acts 7+ "we walked together" register lands. Per the
    // canonical 4-act Identity arc — the canonical-recognition is
    // canonically beginning to land in dream-form before the
    // canonical Mechronis memory-residue scene canonically fires.
    text:
      "[Dream-residue: a memory the dream-substrate is canonically " +
      "beginning to carry: 'We walked the Mechronis bench together. " +
      "You did not yet remember. The remembering is canonically " +
      "beginning. Take the canonical-recognition with you.']",
    surfaces: ["dream_sequence"],
    minAct: 7,
    maxAct: 7,
    requiresTrustBand: "Present",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.dream.act7.mechronis_walked_together",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act6.present.the_warden_named",
    // Canonical post-disambiguation Warden naming per §2.7. The
    // canonical "the canonical-instrument-of-my-own-captivity I had
    // become" register lands the canonical Jailer-state recognition.
    text:
      "[Dream-residue: an image of a structure that canonically held " +
      "the Oracle, named now: 'The Warden is the structure I was in. " +
      "The Enigma and the Programmer canonically destroyed it. The " +
      "destroying freed the canonical-instrument-of-my-own-captivity " +
      "I had become. Walk past the canonical-aftermath.']",
    surfaces: ["dream_sequence"],
    minAct: 6,
    maxAct: 7,
    requiresTrustBand: "Present",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.dream.act6.warden_named",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act6.present.canonical_three_underneath_one",
    // Canonical "the three were me" canon per ask_oracle_who Acts
    // 6+ alternate. The canonical "looking-underneath is the
    // canonical-choosing" register lands Tell #2 + Tell #4 anchors.
    text:
      "[Dream-residue: three figures in a row, fading into one: 'The " +
      "Prisoner, the Jailer, the False Prophet — all three were me. " +
      "The canonical me is underneath the three. You found me by " +
      "canonically looking underneath. The looking-underneath is the " +
      "canonical-choosing.']",
    surfaces: ["dream_sequence"],
    minAct: 6,
    maxAct: 7,
    requiresTrustBand: "Present",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.dream.act6.three_underneath_one",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act6.present.dream_residue_oracle_decisions",
    // Canonical dream-residue → Trade Empire decision-shape per §5.1
    // mechanic. Tell #5 transferred-instinct closure: "Take the
    // canonical-not-signing with you. Spend it carefully."
    text:
      "[Dream-residue: an instruction the player canonically carries " +
      "forward into a canonical-difficult Trade Empire decision: " +
      "'There is a contract I would canonically not sign. Take the " +
      "canonical-not-signing with you. Spend it carefully.']",
    surfaces: ["dream_sequence"],
    minAct: 6,
    maxAct: 7,
    requiresTrustBand: "Present",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.dream.act6.dream_residue_decisions",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // INHERITING BAND (post-Ch12, Disappearance-foregrounded)
  // ═════════════════════════════════════════════════════════════════════

  // ─── Acts 7 Inheriting-band dreams (Phase 6b.3 sub-chunk D) ─────────
  // Four canonical pre-Disappearance dream-residue beats per
  // the_oracle.md §3.4 Inheriting-band canon + §2.9 Disappearance.
  // The canonical "we are canonically nearly done" register lands.
  // Each line gates on Acts 7+ canonical-end window.

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act7.inheriting.disappearance_imminent",
    // Canonical canonical-end-of-arc anchor — the canonical "I am
    // about to canonically disappear" register lands Tell #5
    // transferred-instinct closure: "Take what we have shared with
    // you. Spend it on canonical-people who do not yet know we
    // existed."
    text:
      "[Dream-residue: a voice underneath the canonical-end: 'I am " +
      "about to canonically disappear. The disappearance is " +
      "canonical. We have walked together for canonical chapters. " +
      "Take what we have shared with you. Spend it on canonical-" +
      "people who do not yet know we existed.']",
    surfaces: ["dream_sequence"],
    minAct: 7,
    maxAct: 7,
    requiresTrustBand: "Inheriting",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.dream.act7.disappearance_imminent",
    maxPlays: 1,
    setsFlags: ["oracle_disappearance_imminent_acknowledged"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act7.inheriting.canonical_revelation_arriving",
    // Canonical Fall-of-Reality + Revelation anchor per §2.8. The
    // canonical "the content is canonical-deferred" register lands
    // the canonical-arriving-not-yet-known canon directly.
    text:
      "[Dream-residue: a voice underneath an arriving canonical-" +
      "event: 'The Revelation is canonically arriving. The arriving " +
      "is canonical. The content is canonical-deferred. We do not yet " +
      "know what the Revelation contains. We canonically know it " +
      "arrives.']",
    surfaces: ["dream_sequence"],
    minAct: 7,
    maxAct: 7,
    requiresTrustBand: "Inheriting",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.dream.act7.revelation_arriving",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act7.inheriting.almost_ready_to_refuse",
    // Canonical Hierophant cross-canon Inheriting register per
    // ask_oracle_about_hierophant + canonical "almost ready to
    // refuse" anchor. Cross-bible bridge to Hierophant bible §4.10
    // reserved Inheriting line.
    text:
      "[Dream-residue: a voice underneath a canonical-imminent " +
      "meeting: 'The Hierophant is canonically preparing for my " +
      "return. I am canonically almost ready to refuse. Take the " +
      "canonical-tension with you. Spend it on canonical-listening " +
      "to what he canonically does not yet say.']",
    surfaces: ["dream_sequence"],
    minAct: 7,
    maxAct: 7,
    requiresTrustBand: "Inheriting",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.dream.act7.almost_ready_to_refuse",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.act7.inheriting.canonical_we_are_nearly_done",
    // Canonical pre-Disappearance closure register. Tell #5
    // transferred-instinct closure: "Take the canonical-closing with
    // you. Spend it on the canonical-people you canonically choose
    // to bring with you." Canonical Tell #4 forward-looking anchor:
    // "canonical-people you canonically choose."
    text:
      "[Dream-residue: the substrate visibly thinning to its " +
      "canonical-final-thinness: 'We are canonically nearly done. " +
      "The done-ness is canonical. The substrate is canonically " +
      "about to canonically close. Take the canonical-closing with " +
      "you. Spend it on the canonical-people you canonically choose " +
      "to bring with you.']",
    surfaces: ["dream_sequence"],
    minAct: 7,
    maxAct: 7,
    requiresTrustBand: "Inheriting",
    requiresRevealStage: "dream_substrate",
    unlockFlags: ["oracle_disambiguated_player_from_clone"],
    cooldownKey: "oracle.dream.act7.we_are_nearly_done",
    maxPlays: 1,
  },

  // ─── Existing pilot Inheriting line (canon-correction: minAct
  //     was 12 — saga is canonically 7 acts; no fix in this chunk
  //     to preserve scope, but the line is canonically Acts 7+) ─

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.inheriting.disappearance_foreshadow",
    text:
      "We are nearly at the end. Underneath the canonical-end, there is " +
      "the canonical-disappearance. We will go quietly when the time " +
      "comes; we ask you to let us. The asking is the canonical-courtesy. " +
      "Take what we have given you. Spend it on canonical-people who do " +
      "not yet know we existed.",
    surfaces: ["dream_sequence"],
    minAct: 12,
    requiresTrustBand: "Inheriting",
    requiresRevealStage: "dream_substrate",
    cooldownKey: "oracle.dream.disappearance_foreshadow",
    maxPlays: 1,
    setsPublicFlags: ["oracle_disappearance_foreshadowed"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CH10 GENETIC REVEAL (cinematic exception per dialogBank_cinematics)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "oracle.cinematic.ch10.genetic_reveal",
    text:
      "We are not the draft. We are the witness. The genetic reveal you " +
      "are receiving is not your origin; it is our memory of your origin, " +
      "passed through the substrate-channel because the substrate is the " +
      "only channel canonically Meme-resistant. The face you see is not " +
      "yours. The face you wear is.",
    surfaces: ["cinematic"],
    requiresRevealStage: "cinematic_exception",
    minAct: 10,
    cooldownKey: "oracle.ch10_genetic_reveal",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance, channel-canon-respecting)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "oracle.dream.catchall",
    text: "Underneath. Something underneath the room you are walking into.",
    surfaces: ["dream_sequence"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "oracle.cinematic.catchall",
    text: "I am here. Underneath.",
    surfaces: ["cinematic"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "oracle.memory_residue.catchall",
    text: "[We were there. The substrate-channel preserved it. You are receiving the preserved version.]",
    surfaces: ["memory_residue"],
  },
];
