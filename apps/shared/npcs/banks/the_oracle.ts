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
