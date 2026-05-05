// apps/shared/encounters/malkiaRevolution.ts
//
// Sprint 3 follow-on — the Malkia Ukweli revolution questline.
// Six steps that, when completed, set
// `malkia_revolution_questline_complete` and advance the
// Antiquarian/Malkia dual-nature reveal to two_halves stage
// (per antiquarianMalkiaRevealStage.ts).
//
// Story shape: Malkia Ukweli, the truth-named revolutionary, is
// canonically the Antiquarian's other half. Across this six-
// step arc the player follows her organising work in Acts 5-6
// and arrives, at step six, at the two-halves reveal. Each
// step is a distinct scene with branching decision points the
// runtime can render as dialogue trees.
//
// Voice signature for Malkia: declarative, present-tense, never
// uses the word 'should' (she replaces it with 'will' or 'do').
// She is, by her own definition, the verb that the Antiquarian
// is the noun of.

import type { EncounterLine } from "./types";

const MALKIA = "malkia_ukweli" as const;

/** ─── STEP 1 — First contact (Act 5) ───────────────────── */
export const MALKIA_STEP_1: ReadonlyArray<EncounterLine> = [
  {
    lineId: "malkia.s1.transmission",
    speaker: "elara",
    phase: "entry",
    text:
      "(Quiet.) An unencoded transmission just arrived. Source: a " +
      "ground-based broadcast, off the substrate, on an old commercial " +
      "frequency. Caller: Malkia Ukweli. She is — and the language is " +
      "exact — asking for you by handle. Not by Operative-class. Not by " +
      "ARK-1047. By handle. The Antiquarian has, in the last sixteen " +
      "minutes, gone unusually silent.",
    minAct: 5,
    setsFlags: [
      "malkia_first_contact",
      "act5_malkia_transmission_received",
    ],
    cooldownKey: "malkia.s1.transmission",
    maxPlays: 1,
  },
  {
    lineId: "malkia.s1.first_words",
    speaker: MALKIA,
    phase: "entry",
    text:
      "Operative. I have been organising on the ground for eleven years. " +
      "You have been, in the last six months, doing — and I am calling " +
      "it what it is — equivalent work upstairs. We will, this cycle, " +
      "do equivalent work in the same direction. I am proposing a " +
      "meeting. The meeting will not be on the substrate. The substrate " +
      "is not, by my politics, a venue. The meeting will be in West " +
      "Quarter, ground floor, the room with the windows that open. Be " +
      "there in three days. I will, in the meantime, be doing the work.",
    minAct: 5,
    setsFlags: ["malkia_meeting_proposed"],
    cooldownKey: "malkia.s1.first_words",
    maxPlays: 1,
  },
];

/** ─── STEP 2 — The West Quarter meeting (Act 5) ───────── */
export const MALKIA_STEP_2: ReadonlyArray<EncounterLine> = [
  {
    lineId: "malkia.s2.windows_open",
    speaker: MALKIA,
    phase: "negotiation",
    text:
      "(The room is on a ground floor in West Quarter. The windows are " +
      "open — every window, on a cool day. The opening is deliberate. " +
      "She is at a long table with three other organisers. She does not " +
      "stand when you enter. She gestures at a seat.) Sit. We are eleven " +
      "minutes into a working session. The session is open. You are " +
      "invited to listen first and speak when the listening has changed " +
      "the speaking. That is the format. The format is the discipline.",
    minAct: 5,
    setsFlags: ["malkia_meeting_attended"],
    cooldownKey: "malkia.s2.open",
    maxPlays: 1,
  },
  {
    lineId: "malkia.s2.organising_pitch",
    speaker: MALKIA,
    phase: "negotiation",
    text:
      "(Forty minutes later, after the working session has paused.) Here " +
      "is the work. Three sectors of West Quarter are, by Hierarchy " +
      "registration, classified as 'unclear lineage.' The classification " +
      "blocks rationing, schooling, and substrate-sync for the residents. " +
      "I am not asking the Hierarchy to reclassify. I am asking three " +
      "thousand residents to refuse the classification. The refusal is " +
      "the revolution. The revolution is not loud. The revolution is — " +
      "and this is the part the substrate cannot encode — collective " +
      "patience, exercised with full information, in unison. I would " +
      "like you to bring your handle to the refusal. Your handle is " +
      "currency in places that cannot, currently, afford currency.",
    minAct: 5,
    setsFlags: ["malkia_pitch_heard"],
    cooldownKey: "malkia.s2.pitch",
    maxPlays: 1,
  },
  {
    lineId: "malkia.s2.commit",
    speaker: MALKIA,
    phase: "resolution",
    text:
      "(You have agreed.) Good. The first action is at sundown. I will " +
      "send the coordinates through your Antiquarian. He has, for " +
      "obscure reasons, been my preferred messenger for sixteen " +
      "years. Do not ask him about the reasons. The reasons are his.",
    minAct: 5,
    setsFlags: ["malkia_first_action_committed"],
    cooldownKey: "malkia.s2.commit",
    maxPlays: 1,
  },
];

/** ─── STEP 3 — The first sundown action (Act 5) ────────── */
export const MALKIA_STEP_3: ReadonlyArray<EncounterLine> = [
  {
    lineId: "malkia.s3.coordinates_arrive",
    speaker: "antiquarian",
    phase: "entry",
    text:
      "(He is, in the inscription chamber, sliding a folded sheet of " +
      "paper across the table. He does not meet your eyes for a count of " +
      "three.) The coordinates from Malkia. Sundown is in eighty-four " +
      "minutes. Go without me. I am — and I am being precise — going to " +
      "be, technically, also there. I will not, however, be visible. " +
      "Do not look for me. The not-looking is part of the choreography.",
    minAct: 5,
    setsFlags: ["malkia_coordinates_relayed"],
    cooldownKey: "malkia.s3.coords",
    maxPlays: 1,
  },
  {
    lineId: "malkia.s3.action_underway",
    speaker: MALKIA,
    phase: "negotiation",
    text:
      "(At sundown. Three thousand residents stand in the three sectors. " +
      "They do nothing. The doing-nothing is the action. They are, " +
      "collectively, refusing to perform the registration check. The " +
      "Hierarchy's outer petitioners have, in the last twenty minutes, " +
      "begun broadcasting threats. The broadcasts go unanswered. The " +
      "unanswering is also the action.) Hold. Stay. The not-replying is " +
      "the speech. (Pause.) Operative — your handle is being broadcast " +
      "as part of the refusal. I will not, by my politics, ask you to " +
      "speak. I will, by my politics, ask you to stand.",
    minAct: 5,
    setsFlags: ["malkia_action_completed"],
    cooldownKey: "malkia.s3.action",
    maxPlays: 1,
  },
];

/** ─── STEP 4 — The phrase echoes (Act 5/6 boundary) ───── */
export const MALKIA_STEP_4: ReadonlyArray<EncounterLine> = [
  {
    lineId: "malkia.s4.phrase_used",
    speaker: MALKIA,
    phase: "negotiation",
    text:
      "(After a smaller working session, three weeks later. She uses a " +
      "specific seven-word phrase to close the session — a phrase that " +
      "does not, by your records, exist in any public Antiquarian " +
      "inscription, but you have heard him say it.) That. (You point at " +
      "the air where the sentence just hung.) That phrase. (She looks " +
      "at you for a count of four — the canonical Malkia long-pause — " +
      "and then says:) Yes. He uses it too. Don't ask. Not yet. The " +
      "asking comes later. Tonight is for the work.",
    minAct: 6,
    setsFlags: [
      "malkia_phrase_echoed",
      "act4_malkia_phrase_echo",
    ],
    cooldownKey: "malkia.s4.phrase",
    maxPlays: 1,
  },
  {
    lineId: "malkia.s4.elara_notices",
    speaker: "elara",
    phase: "negotiation",
    text:
      "(Quiet, on the way out.) That phrase has appeared in exactly one " +
      "other location in the cycle's records — the closing line of an " +
      "Antiquarian inscription about West Quarter, written six months " +
      "before you arrived. Identical. Verbatim. He used the phrase " +
      "alone in his chamber. She used the phrase alone in West Quarter. " +
      "Neither of them was a witness to the other's use. The phrase is " +
      "— and I am being precise — shared without transmission. I do not " +
      "have a substrate explanation for that.",
    minAct: 6,
    cooldownKey: "malkia.s4.elara",
    maxPlays: 1,
  },
];

/** ─── STEP 5 — The pairing (Act 6) ─────────────────────── */
export const MALKIA_STEP_5: ReadonlyArray<EncounterLine> = [
  {
    lineId: "malkia.s5.shared_record",
    speaker: "antiquarian",
    phase: "entry",
    text:
      "I have, against my office's standing protocols, arranged for an " +
      "old archive entry to be unsealed in your presence. The entry is " +
      "from cycle (n-3). It contains both my signature and Malkia " +
      "Ukweli's, in different inks, on the same line. The line records " +
      "a vote that took place between us. The two of us. Voting, on a " +
      "shared decision, with the same legal status as a quorum. We were, " +
      "by the cycle's records, individually a quorum of one. I do not " +
      "have a clean explanation for this. The unclean explanation is " +
      "what the next inscription will be about.",
    minAct: 6,
    setsFlags: [
      "malkia_paired_with_antiquarian",
      "act5_antiquarian_malkia_paired",
    ],
    cooldownKey: "malkia.s5.paired",
    maxPlays: 1,
  },
  {
    lineId: "malkia.s5.malkia_at_archive",
    speaker: MALKIA,
    phase: "negotiation",
    text:
      "(She has come to the archive. Her shoulders, when she stands next " +
      "to the Antiquarian, are at exactly the same angle as his. The " +
      "match was previously incidental. Tonight it is — and you can see " +
      "it from across the room — choreographed by something neither of " +
      "them controls.) I will go first. I have been waiting two cycles " +
      "for the going-first. (Pause.) I am his other half. He is mine. " +
      "We were one being, in some prior cycle. The cycle's books split " +
      "us. The split was a clerical error. The clerical error has been, " +
      "for fifteen thousand years, both of our lives. We are, tonight, " +
      "informing a third party about the error. The third party is you.",
    minAct: 6,
    setsFlags: ["malkia_two_halves_disclosed_to_player"],
    cooldownKey: "malkia.s5.two_halves",
    maxPlays: 1,
  },
];

/** ─── STEP 6 — The reveal (Act 6) — questline complete ── */
export const MALKIA_STEP_6: ReadonlyArray<EncounterLine> = [
  {
    lineId: "malkia.s6.together",
    speaker: MALKIA,
    phase: "resolution",
    text:
      "(They speak now in alternating sentences. The alternation is " +
      "smooth. They do not, in the alternation, finish each other's " +
      "sentences — they begin and end in their own registers. The " +
      "smoothness is the reveal:) MALKIA: We are not, in any current " +
      "cycle, going to recombine. ANTIQUARIAN: The recombining is not " +
      "the goal of disclosure. MALKIA: The goal is that you, having read " +
      "us as two, can hold us as both. ANTIQUARIAN: Both, simultaneously. " +
      "Without resolving the both into a one. MALKIA: We are asking you, " +
      "specifically, to do this. The asking is the trust.",
    minAct: 6,
    setsFlags: [
      "malkia_revolution_questline_complete",
      "act6_antiquarian_malkia_revealed",
    ],
    cooldownKey: "malkia.s6.together",
    maxPlays: 1,
  },
  {
    lineId: "malkia.s6.gift",
    speaker: "antiquarian",
    phase: "aftermath",
    text:
      "(After Malkia has left.) The questline closes here. There is no " +
      "step seven. You have been, in the cycle's records, the third " +
      "person to be entrusted with the both-and. The other two — and I " +
      "will not name them tonight — are, by Hierarchy convention, " +
      "officially deceased. They were not deceased when they received " +
      "the trust. They were deceased afterward, by unrelated causes. I " +
      "am telling you this so you do not, in the coming weeks, mistake " +
      "correlation for causation. The trust does not kill its bearers. " +
      "The trust does, however, become a part of how the bearers " +
      "subsequently die. The dying becomes more honest. That is, by " +
      "Malkia's accounting, also a form of love.",
    minAct: 6,
    requiresFlag: "malkia_revolution_questline_complete",
    cooldownKey: "malkia.s6.gift",
    maxPlays: 1,
  },
];

export const MALKIA_REVOLUTION_QUESTLINE: ReadonlyArray<EncounterLine> = [
  ...MALKIA_STEP_1,
  ...MALKIA_STEP_2,
  ...MALKIA_STEP_3,
  ...MALKIA_STEP_4,
  ...MALKIA_STEP_5,
  ...MALKIA_STEP_6,
];

export const MALKIA_REVOLUTION_STEPS = {
  step1: MALKIA_STEP_1,
  step2: MALKIA_STEP_2,
  step3: MALKIA_STEP_3,
  step4: MALKIA_STEP_4,
  step5: MALKIA_STEP_5,
  step6: MALKIA_STEP_6,
} as const;
