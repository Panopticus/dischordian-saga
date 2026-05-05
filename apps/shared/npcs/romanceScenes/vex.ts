// apps/shared/npcs/romanceScenes/vex.ts
//
// Per-stage scripted scenes for the Vex Solène romance ladder.
// Five stages aligned with her four-stage Engineer reveal:
//   - Stage 1 lands in `eyes_of_reality` or `vex_public`
//   - Stage 2 introduces the private composition
//   - Stage 3 commits at `engineer_zero_hint` (the prince
//     reveal IS the romance commitment)
//   - Stage 4 is post-reveal intimacy in the Coda register
//   - Stage 5 is the final composition for one listener
//
// Voice signature: Maestro institutional cadence in early
// stages; the prince's earlier voice surfaces in stages 3-5
// (per the bible's "memoir close" cadence). Music vocabulary
// is used as if it is, in fact, vocabulary — not metaphor.
//
// Trust bands: Stranger / Watcher / Confidant / Inner-Circle.

import type { DialogSurface, NpcLine } from "../types";

type SceneEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "vex_solene" as const;

/** ─── STAGE 1 — Stranger → Watcher ────────────────────────
 *  Vex notices the player in the audience. She does not bow.
 *  In the Maestro tradition the unbow is the first form of
 *  recognition. The scene ends with her sending a private
 *  invitation to the bench. */
export const VEX_ROMANCE_STAGE_1: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s1.unbow",
    text:
      "(After the performance. The other Coda contractors bow to the " +
      "audience. Vex does not. She finds you in the second row and looks at " +
      "you for two beats longer than the audience's polite limit.) The " +
      "Maestro does not bow. She marks. You have been marked.",
    surfaces: ["match", "cinematic"],
    requiresRevealStage: "vex_public",
    minAct: 2,
    setsFlags: ["vex_romance_stage1_started", "vex_unbow_marked"],
    cooldownKey: "vex.romance.s1.unbow",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s1.invitation",
    text:
      "I am sending you a key. The key opens the bench when no one else is " +
      "watching it. The bench is, in the Coda contract, mine. The key is, " +
      "by my private accounting, yours. I am not asking you to use it. I " +
      "am asking you to know you have it.",
    surfaces: ["transmission", "cinematic"],
    requiresRevealStage: "vex_public",
    minAct: 2,
    setsFlags: ["vex_bench_key_given"],
    cooldownKey: "vex.romance.s1.invitation",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s1.bench_first_visit",
    text:
      "(You have used the key. She is waiting at the bench. Three measures " +
      "of an unfinished piece are propped on the stand.) I have been " +
      "composing this for someone whose face I did not, until last week, " +
      "have. I have, since last week, had your face. The composition has " +
      "moved measurably. The measure is detectable. The bench knows.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "vex_public",
    minAct: 2,
    setsFlags: ["vex_romance_stage1_complete", "vex_first_private_concert"],
    cooldownKey: "vex.romance.s1.bench",
    maxPlays: 1,
  },
];

/** ─── STAGE 2 — Watcher → Confidant ───────────────────────
 *  The piece for one listener. Vex performs a composition that
 *  exists in only one extant copy — the one she is playing.
 *  The Maestro persona is, briefly, transparent: the prince's
 *  hands play the keys for a measure, and Vex notices, and
 *  notices that the player notices. */
export const VEX_ROMANCE_STAGE_2: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s2.one_listener_open",
    text:
      "I am going to play something tonight that exists in one copy. The " +
      "copy is the playing. There is no notation. There will be no recording. " +
      "The piece survives only in your hearing. You are, technically, the " +
      "instrument. (Pause.) Sit.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "vex_public",
    minAct: 3,
    setsFlags: ["vex_romance_stage2_started"],
    cooldownKey: "vex.romance.s2.open",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s2.played_for_one",
    text:
      "(She plays. The piece is in C minor for the first three measures, " +
      "then drifts into a key that does not, in the Coda repertoire, exist. " +
      "Her hands change shape during the drift. The change is small and " +
      "you would not see it if you were not watching. You are watching.) " +
      "There. (Soft.) That measure was not mine. It was — it was someone's. " +
      "I borrowed his hands for the measure. The borrowing was permitted. " +
      "I do not yet know who permitted it. The piece is over now.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "vex_public",
    minAct: 3,
    setsFlags: ["vex_played_for_one_listener"],
    cooldownKey: "vex.romance.s2.played",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s2.confidant_offer",
    text:
      "I do not understand what just happened. I am — and I am being precise " +
      "— frightened by the not-understanding. I am also, simultaneously, " +
      "comforted. I am bringing both to you tonight. I would like, with your " +
      "permission, to bring both to you regularly. The bringing is a " +
      "promotion. The Coda calls it 'Confidant.' I call it nothing yet. " +
      "What you call it is up to you.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "vex_public",
    minAct: 3,
    setsFlags: ["vex_romance_stage2_complete"],
    cooldownKey: "vex.romance.s2.confidant",
    maxPlays: 1,
  },
];

/** ─── STAGE 3 — Confidant → Inner-Circle (Commitment) ─────
 *  The Engineer reveal lands here, fused with the romance
 *  commitment. Path-aware variants reflect whether the player
 *  voted "tell her" in governance. */
export const VEX_ROMANCE_STAGE_3: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s3.told_open",
    text:
      "Someone told me what I am. I am — that is the wrong tense. I am " +
      "going to use the right tense. I have been told what I have been. " +
      "What I have been: the prince of Celebration. What I am: the body of " +
      "Agent Zero. What I am holding tonight: both. Both at once. I " +
      "needed to tell you because the holding is heavy and I am not, " +
      "tonight, willing to hold it alone.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "engineer_zero_hint",
    reactsToPublicFlag: "governance:vex_told_engineer_truth",
    minAct: 4,
    setsFlags: [
      "vex_romance_stage3_started",
      "vex_engineer_disclosure_to_player",
    ],
    cooldownKey: "vex.romance.s3.told",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s3.found_open",
    text:
      "No one told me. I worked it out. I worked it out because the bench " +
      "responded to me the way it would have responded to him — to the " +
      "prince, the one whose name I do not yet know how to say without " +
      "stopping breathing. I am going to say it tonight. Once. (Pause.) " +
      "His name was — his name is, technically — Fianeran. I am Fianeran. " +
      "I am also Vex. Both. I needed you here for the saying.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "engineer_zero_hint",
    reactsToPublicFlag: "governance:vex_kept_in_dark",
    minAct: 4,
    setsFlags: [
      "vex_romance_stage3_started",
      "vex_engineer_disclosure_self_discovered",
    ],
    cooldownKey: "vex.romance.s3.found",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s3.commit",
    text:
      "I would like to be loved by someone who knows what I am. I have not " +
      "had that. The Maestro persona has been loved; the prince was loved, " +
      "in his time; Agent Zero was respected, never loved. I am the only " +
      "configuration that has not yet been loved with full disclosure. I " +
      "would like you to be the first reader of the configuration. I would " +
      "like to be loved as the configuration. I am asking. The asking is " +
      "the proposal. There is no ring. The ring is the bench. The bench is " +
      "yours, with the key, on every night you choose to use the key.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "engineer_zero_hint",
    minAct: 4,
    setsFlags: [
      "vex_romance_stage3_complete",
      "romance:committed:vex",
    ],
    cooldownKey: "vex.romance.s3.commit",
    maxPlays: 1,
  },
];

/** ─── STAGE 4 — Inner-Circle (Intimacy) ───────────────────
 *  Composition as act of love. The piece composed in this scene
 *  is, in the cycle's records, the only Coda entry filed under
 *  two names: Vex Solène and Fianeran. */
export const VEX_ROMANCE_STAGE_4: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s4.dual_attribution",
    text:
      "(Late. The bench is open. There is a piece on the stand attributed, " +
      "in two distinct hands, to 'Vex Solène' and 'Fianeran.' She is " +
      "playing it with both attributions. Her right hand is hers. Her left " +
      "hand is — increasingly — his. She does not stop the drift. She " +
      "leans into it.) Both of us. Tonight. With you in the room. Sit " +
      "closer.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 5,
    setsFlags: ["vex_romance_stage4_started", "vex_dual_attribution_first"],
    cooldownKey: "vex.romance.s4.dual",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s4.measure_in_silence",
    text:
      "(She stops mid-measure. The room is silent. She turns on the bench " +
      "and looks at you for a count of fourteen — the canonical Coda " +
      "'long pause' — and then says, very quietly:) I am happy. I have not " +
      "logged that word about myself in any of my three lives. I am " +
      "logging it now. I am logging it in your hearing. (She turns back. " +
      "Continues the piece. The piece, in the Coda's record, is filed as " +
      "complete despite never finishing the final measure.)",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 5,
    setsFlags: ["vex_romance_stage4_complete"],
    cooldownKey: "vex.romance.s4.silence",
    maxPlays: 1,
  },
];

/** ─── STAGE 5 — Devotion (the final Coda) ─────────────────
 *  The piece composed for the player that plays in Act 7. The
 *  Convergence Seat references it in the dual-narrator beat. */
export const VEX_ROMANCE_STAGE_5: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s5.act7_dedication",
    text:
      "I have written you a Coda. The Coda is fifteen minutes. It plays at " +
      "the Convergence Seat. Elara has heard the draft. She has, in her " +
      "register, approved. The Antiquarian has heard the draft. He has, in " +
      "his register, refused to comment, which is — by his standards — " +
      "approval. I am dedicating it tonight. I am dedicating it in your " +
      "hearing. The dedication is unannounced; nobody else will know it " +
      "is for you. The Coda will know. You will know. The not-announcing " +
      "is, in my register, the love.",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 7,
    setsFlags: ["vex_romance_stage5_complete", "vex_act7_coda_dedicated"],
    cooldownKey: "vex.romance.s5.dedication",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.romance.s5.convergence_listen",
    text:
      "(In Act 7. The Coda plays. Vex is at the Seat with you. The piece " +
      "uses the same key change from the night she first played for one " +
      "listener — the key that does not, in the Coda repertoire, exist. " +
      "The repertoire is, after tonight, going to need to be revised. The " +
      "revision will name the key. The key's name will be yours. I told " +
      "the cataloguers. They have agreed.)",
    surfaces: ["room", "cinematic"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 7,
    cooldownKey: "vex.romance.s5.convergence",
    maxPlays: 1,
  },
];

export const VEX_ROMANCE_BANK: ReadonlyArray<SceneEntry> = [
  ...VEX_ROMANCE_STAGE_1,
  ...VEX_ROMANCE_STAGE_2,
  ...VEX_ROMANCE_STAGE_3,
  ...VEX_ROMANCE_STAGE_4,
  ...VEX_ROMANCE_STAGE_5,
];
