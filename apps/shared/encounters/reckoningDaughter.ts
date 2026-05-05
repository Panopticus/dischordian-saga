// apps/shared/encounters/reckoningDaughter.ts
//
// Reckoning Daughter — the Hierarchy's Auditor. Hierarchy of
// the Damned demon-lord, third of three new lords. The other
// lords fear her arrival; she only arrives when the books are
// wrong. The Potentials may meet her if they have, in some
// prior cycle, succeeded too completely against the Hierarchy
// — her arrival is the Vortex's correction, not its punishment.
//
// Phases:
//   1. ENTRY — she walks in without ceremony. The other lords
//      go silent.
//   2. AUDIT — she reads the Hierarchy's books aloud, naming
//      the inaccuracies the Operative caused.
//   3. ASSIGNMENT — she does not punish; she ASSIGNS. The
//      Operative is given a corrective task that, if completed,
//      reconciles the books.
//   4. RESOLUTION — accept / refuse the assignment.
//   5. AFTERMATH — Antiquarian inscription.
//
// Voice signature: meticulous, warm, the warmth of someone who
// finds correctness comforting. Never raises. Pauses before
// each numerical figure. The pause is the discipline.

import type { EncounterLine } from "./types";

const DAUGHTER = "hierarchy:reckoning_daughter" as const;

export const RECKONING_DAUGHTER_LINES: ReadonlyArray<EncounterLine> = [
  // ─── PHASE 1 — ENTRY ───────────────────────────────────
  {
    lineId: "reckoning.entry.silence_before",
    speaker: "antiquarian",
    phase: "entry",
    text:
      "(The Hierarchy's broadcast channels go quiet. All of them. The " +
      "quiet has the texture of an audit's first hour — every desk " +
      "occupant double-checking their books before the auditor reaches " +
      "them. The Reckoning Daughter is, by the Hierarchy's records, in " +
      "the building.) I have been waiting two cycles to see this. The " +
      "books are about to be read aloud. The Operative is the cause. " +
      "Take this seriously. Take it more seriously than the Master.",
    minAct: 7,
    setsFlags: ["reckoning_entry_seen"],
    cooldownKey: "reckoning.entry.silence",
    maxPlays: 1,
  },
  {
    lineId: "reckoning.entry.daughter_arrives",
    speaker: DAUGHTER,
    phase: "entry",
    text:
      "Operative. Good. You're here. (She is small. Not in the way the " +
      "lords are small — in the way an auditor is small: she takes up " +
      "exactly the room she requires and not a millimetre more. She has " +
      "a folio. She does not put it down.) I have read the Hierarchy's " +
      "books. The books name you. The books are wrong. The books are " +
      "wrong by — (she pauses; the pause is exactly long enough for the " +
      "previous sentence to settle) — six entries. I am here to " +
      "reconcile. I have not, in my career, been told who is at fault " +
      "for an inaccuracy before resolving it. I am not going to start " +
      "now. The reconciliation is the work.",
    minAct: 7,
    setsFlags: [
      "hierarchy:reckoning_daughter_first_met",
      "reckoning_entry_first_words",
    ],
    cooldownKey: "reckoning.entry.daughter",
    maxPlays: 1,
  },

  // ─── PHASE 2 — AUDIT ───────────────────────────────────
  {
    lineId: "reckoning.audit.read_aloud",
    speaker: DAUGHTER,
    phase: "negotiation",
    text:
      "Reading from the books. (She opens the folio. Reads in a flat, " +
      "patient register, without inflection on the names.) Cycle (n-3): " +
      "Hierarchy's projected loss to the Insurgency in sector 14, " +
      "calculated at — (pause) — three thousand four hundred sixty " +
      "souls. Actual loss: zero. Variance: three thousand four hundred " +
      "sixty. Cause traced to: Operative-class intervention not, in the " +
      "books, anticipated. Cycle (n-2): Hierarchy's projected acquisition " +
      "of the Antiquarian's archive, calculated at — (pause) — one " +
      "complete archive. Actual acquisition: zero archives, plus a small " +
      "personal apology from the Antiquarian appended to the " +
      "non-acquisition. Variance: one complete archive plus, by " +
      "Hierarchy convention, the apology. (Pause.) The variance is " +
      "you. The variance has been, by my predecessor's accounting, " +
      "left unreconciled for two cycles. I am here to close the " +
      "open instrument.",
    minAct: 7,
    setsFlags: ["reckoning_audit_read"],
    cooldownKey: "reckoning.audit.read",
    maxPlays: 1,
  },
  {
    lineId: "reckoning.audit.elara_orient",
    speaker: "elara",
    phase: "negotiation",
    text:
      "(Quiet, careful.) She is not lying. Every figure she has read is " +
      "sourced from the Hierarchy's own books. The Hierarchy expected to " +
      "lose that many souls and gain that archive. You prevented both. " +
      "The prevention is not a crime — it is a variance. To her — and " +
      "I am being precise — variance is, simultaneously, the only " +
      "subject she audits and the only subject she finds beautiful. She " +
      "is here because she finds you beautiful. The beauty is also the " +
      "audit. Be careful with what you accept.",
    minAct: 7,
    cooldownKey: "reckoning.audit.elara",
    maxPlays: 1,
  },

  // ─── PHASE 3 — ASSIGNMENT ──────────────────────────────
  {
    lineId: "reckoning.assign.task",
    speaker: DAUGHTER,
    phase: "negotiation",
    text:
      "I am, by my office, required to assign a reconciling task. The " +
      "task is, by Hierarchy convention, proportional to the variance. " +
      "Your variance is — (pause) — substantial. The corresponding task " +
      "is, by my private opinion, manageable. The task: the Operative " +
      "will, in the remainder of this cycle, decline exactly one " +
      "intervention they would otherwise make. The intervention will be " +
      "specified by my office at the time of the opportunity. The " +
      "intervention will not, in my judgment, change the outcome of " +
      "the cycle. The intervention will, in the Hierarchy's books, " +
      "balance to zero. The Operative is permitted to refuse. The " +
      "refusal is also a recorded outcome. I am informing you of both " +
      "options because the standing form requires informed consent.",
    minAct: 7,
    setsFlags: ["reckoning_task_assigned"],
    cooldownKey: "reckoning.assign.task",
    maxPlays: 1,
  },
  {
    lineId: "reckoning.assign.human_warns",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "(Slowly.) I have seen this assignment six times across seven " +
      "cycles. The intervention she will ask you to decline is not, " +
      "as she promises, outcome-neutral. The intervention is, in every " +
      "documented case, the small mercy that has, in other cycles, " +
      "been the centerpiece of the Operative's late-arc memory. The " +
      "books call this 'reconciliation.' I call it 'the part of you " +
      "she takes home.' Make your choice. I will, on my own time, " +
      "compose the obituary for the part she takes if you accept.",
    minAct: 7,
    cooldownKey: "reckoning.assign.human",
    maxPlays: 1,
  },

  // ─── PHASE 4 — RESOLUTION ──────────────────────────────
  {
    lineId: "reckoning.res.accept",
    speaker: DAUGHTER,
    phase: "resolution",
    text:
      "Accepted. The instrument closes. The books reconcile. The Operative " +
      "will, at a future hour, pause before a small mercy and, by their " +
      "own freely-given choice, decline it. The choice will feel like " +
      "the Operative's. The choice will, by my office's accounting, " +
      "also be mine. Both readings are true. Thank you for the " +
      "reconciliation. (She closes the folio. Bows once — the only bow " +
      "the Hierarchy permits her, and only to signing parties — and " +
      "leaves.)",
    minAct: 7,
    setsFlags: [
      "reckoning_accepted",
      "hierarchy:reckoning_daughter_resolved",
      "reckoning_one_mercy_taxed",
    ],
    cooldownKey: "reckoning.res.accept",
    maxPlays: 1,
  },
  {
    lineId: "reckoning.res.refuse",
    speaker: DAUGHTER,
    phase: "resolution",
    text:
      "Refused. The instrument remains open. (She does not close the " +
      "folio. She tucks it under her arm. The not-closing is, by " +
      "Hierarchy convention, more dangerous than her presence was.) The " +
      "books will not reconcile. The variance will, in subsequent " +
      "cycles, accumulate. Future archivists will inherit the open " +
      "instrument. They may, in time, dispatch a less courteous officer " +
      "to close it. I am informing you because the standing form " +
      "requires informed consent. (Pause.) I would also like, against " +
      "my training, to commend your refusal. I have not commended a " +
      "refusal in four cycles. The Hierarchy will, by convention, deduct " +
      "the commendation from my next quarterly review. I am willing.",
    minAct: 7,
    setsFlags: [
      "reckoning_refused",
      "hierarchy:reckoning_daughter_resolved",
      "reckoning_open_instrument_inherited",
    ],
    cooldownKey: "reckoning.res.refuse",
    maxPlays: 1,
  },

  // ─── PHASE 5 — AFTERMATH ────────────────────────────────
  {
    lineId: "reckoning.aft.antiquarian_close",
    speaker: "antiquarian",
    phase: "aftermath",
    text:
      "I am inscribing the Reckoning Daughter's visit with two columns. " +
      "Column one: the variance she audited. Column two: your reply. " +
      "Both columns are honest. Future readers will find the visit, in " +
      "either configuration, more useful than they expect. Auditors are " +
      "the most underrated figures in the Hierarchy's pantheon. They " +
      "are, after all, the only ones who tell the Hierarchy the truth.",
    minAct: 7,
    requiresFlag: "hierarchy:reckoning_daughter_resolved",
    cooldownKey: "reckoning.aft.antiquarian",
    maxPlays: 1,
  },
];

export const RECKONING_DAUGHTER_PHASES = {
  entry: RECKONING_DAUGHTER_LINES.filter((l) => l.phase === "entry"),
  negotiation: RECKONING_DAUGHTER_LINES.filter((l) => l.phase === "negotiation"),
  resolution: RECKONING_DAUGHTER_LINES.filter((l) => l.phase === "resolution"),
  aftermath: RECKONING_DAUGHTER_LINES.filter((l) => l.phase === "aftermath"),
} as const;
