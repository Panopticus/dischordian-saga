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

  // ═════════════════════════════════════════════════════════════════════
  // INHERITING BAND (post-Ch12, Disappearance-foregrounded)
  // ═════════════════════════════════════════════════════════════════════

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
