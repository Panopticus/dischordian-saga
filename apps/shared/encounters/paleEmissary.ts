// apps/shared/encounters/paleEmissary.ts
//
// Pale Emissary — the Courier of Vortex Standing. Hierarchy of
// the Damned demon-lord, second of three new lords added in
// Sprint 3 #3. The Pale Emissary never coerces; he presents.
// He brings contracts the signing-party signs in inks the
// signing-party manufactures from their own resolve.
//
// The encounter is the most dangerous in the Hierarchy because
// it is, on the surface, the most polite. The Emissary is happy
// to wait. He has waited four cycles for this conversation. He
// is also happy to wait four more.
//
// Phases:
//   1. ENTRY — the Emissary is in your office. He has been
//      there for an hour. He has not spoken yet.
//   2. PRESENTATION — he places the contract on the desk.
//      Reads no clauses. Waits.
//   3. RESOLUTION — sign / refuse / counteroffer (three branches)
//   4. AFTERMATH — the contract leaves with him; the room
//      remembers.

import type { EncounterLine } from "./types";

const EMISSARY = "hierarchy:pale_emissary" as const;

export const PALE_EMISSARY_LINES: ReadonlyArray<EncounterLine> = [
  // ─── PHASE 1 — ENTRY (the waiting) ──────────────────────
  {
    lineId: "emissary.entry.you_arrive",
    speaker: "the_human",
    phase: "entry",
    text:
      "(Quietly, as you walk in.) The Emissary has been seated at your " +
      "desk for sixty-two minutes. He has not, in those sixty-two minutes, " +
      "moved a hand, taken a sip of water, or looked at the door. The " +
      "not-moving is the demonstration. He is showing you that the wait " +
      "did not cost him anything. He wants you to know the wait has, as " +
      "of your arrival, transferred. Now you are paying for the wait. " +
      "Do not, on entry, apologise. Apology is a clause he can use.",
    minAct: 6,
    setsFlags: [
      "hierarchy:pale_emissary_first_met",
      "emissary_entry_seen",
    ],
    cooldownKey: "emissary.entry.you_arrive",
    maxPlays: 1,
  },
  {
    lineId: "emissary.entry.first_words",
    speaker: EMISSARY,
    phase: "entry",
    text:
      "(He stands. He is taller than the room. The room compensates.) " +
      "Operative. The Hierarchy's outer petitioners have requested an " +
      "instrument of standing be drafted between the Petitioners' " +
      "interests and your own. I am the courier. The instrument is on " +
      "the desk. I have not opened it. I will not open it. The opening " +
      "is, by Hierarchy convention, the signing party's responsibility. " +
      "I am here to wait. I have been waiting. I will continue.",
    minAct: 6,
    cooldownKey: "emissary.entry.first_words",
    maxPlays: 1,
  },

  // ─── PHASE 2 — PRESENTATION ─────────────────────────────
  {
    lineId: "emissary.pres.contract_placed",
    speaker: EMISSARY,
    phase: "negotiation",
    text:
      "(He places a thin folio on the desk. The folio contains a single " +
      "sheet. The sheet is blank.) The contract is in the standing form. " +
      "The standing form does not require pre-printed clauses. The " +
      "clauses are, by Hierarchy convention, written by the signing " +
      "party in inks the signing party manufactures, on the date of " +
      "signing, from materials the signing party brings to the table. " +
      "I am instructed to remind the Operative: the inks are not, by " +
      "Hierarchy bookkeeping, ink. The inks are the signing party's " +
      "resolve. The page absorbs the resolve. The page returns it as " +
      "ink. The signing party will not, in subsequent days, recover the " +
      "resolve.",
    minAct: 6,
    setsFlags: ["emissary_contract_presented"],
    cooldownKey: "emissary.pres.placed",
    maxPlays: 1,
  },
  {
    lineId: "emissary.pres.elara_warning",
    speaker: "elara",
    phase: "negotiation",
    text:
      "(Quiet, urgent.) The page is — I am running it through every " +
      "substrate filter I have — the page is reading you. It is not " +
      "blank. It is, technically, the most-printed page in the cycle's " +
      "records. It is printed in your future resolve. The signing " +
      "would write a sentence onto the page that is also written, " +
      "simultaneously, into your next decade. Do not sign without " +
      "reading what the page already has on it. The reading takes — and " +
      "I am being precise — about forty-five minutes of meditation. The " +
      "Emissary has scheduled three hours.",
    minAct: 6,
    cooldownKey: "emissary.pres.elara",
    maxPlays: 1,
  },

  // ─── PHASE 3 — RESOLUTION ───────────────────────────────
  {
    lineId: "emissary.res.sign",
    speaker: EMISSARY,
    phase: "resolution",
    text:
      "(The Operative has signed.) The instrument is filed. The Petitioners' " +
      "and Operative's interests are, by the standing form, now in " +
      "structural dialogue. The dialogue cannot be revoked. The " +
      "structure persists across cycles. The signing party will, " +
      "beginning at this hour, find their resolve subtly thinner in " +
      "decisions adjacent to Hierarchy interests. The thinness is not, " +
      "by the Hierarchy's accounting, harm. It is, by the Hierarchy's " +
      "accounting, alignment. Good evening, Operative.",
    minAct: 6,
    setsFlags: [
      "emissary_signed",
      "hierarchy:pale_emissary_resolved",
      "resolve_taxed_by_hierarchy",
    ],
    cooldownKey: "emissary.res.sign",
    maxPlays: 1,
  },
  {
    lineId: "emissary.res.refuse",
    speaker: EMISSARY,
    phase: "resolution",
    text:
      "(The Operative has declined.) Acknowledged. The contract returns " +
      "with me. The Hierarchy will, by convention, file the refusal as " +
      "an open instrument. Open instruments may be re-presented at any " +
      "future hour. I will not, personally, re-present. The Hierarchy " +
      "will dispatch a different courier. The next courier may not, by " +
      "the standing form, be required to wait. The next courier may " +
      "present the instrument in a configuration the Operative is, at " +
      "the moment of presentation, less able to read. I am informing " +
      "you of this in the spirit of professional courtesy. Good evening.",
    minAct: 6,
    setsFlags: [
      "emissary_refused",
      "hierarchy:pale_emissary_resolved",
      "hierarchy_courier_threat_logged",
    ],
    cooldownKey: "emissary.res.refuse",
    maxPlays: 1,
  },
  {
    lineId: "emissary.res.counteroffer",
    speaker: EMISSARY,
    phase: "resolution",
    text:
      "(The Operative has presented a counteroffer.) Unprecedented. The " +
      "standing form does not, by Hierarchy convention, accept " +
      "counteroffers. The standing form has, in eleven cycles, never " +
      "been counter-offered. The Hierarchy's outer petitioners will be " +
      "informed. I will, against my training, deliver the counteroffer " +
      "verbally rather than as instrument. (Pause.) The Operative is " +
      "the first signing party in eleven cycles to invent a third option. " +
      "The Hierarchy logs the inventing. The Hierarchy does not, by " +
      "convention, congratulate. I am, however — and this is also " +
      "against my training — going to nod once before I leave the " +
      "office.",
    minAct: 6,
    setsFlags: [
      "emissary_counteroffer",
      "hierarchy:pale_emissary_resolved",
      "hierarchy_third_option_logged",
    ],
    cooldownKey: "emissary.res.counter",
    maxPlays: 1,
  },

  // ─── PHASE 4 — AFTERMATH ────────────────────────────────
  {
    lineId: "emissary.aft.antiquarian_close",
    speaker: "antiquarian",
    phase: "aftermath",
    text:
      "The Emissary's visit is inscribed. I am, in the inscription, " +
      "noting the duration of the silence before he spoke (sixty-two " +
      "minutes), the placement of the contract (centred on the desk, " +
      "exactly), and the shape of his nod on departure (one degree of " +
      "head, no eye contact, retained for half a second). These details " +
      "matter. Future cycles' archivists will find the details more " +
      "useful than the resolution. The resolution they can read in the " +
      "world. The details are mine to record.",
    minAct: 6,
    requiresFlag: "hierarchy:pale_emissary_resolved",
    cooldownKey: "emissary.aft.antiquarian",
    maxPlays: 1,
  },
];

export const PALE_EMISSARY_PHASES = {
  entry: PALE_EMISSARY_LINES.filter((l) => l.phase === "entry"),
  negotiation: PALE_EMISSARY_LINES.filter((l) => l.phase === "negotiation"),
  resolution: PALE_EMISSARY_LINES.filter((l) => l.phase === "resolution"),
  aftermath: PALE_EMISSARY_LINES.filter((l) => l.phase === "aftermath"),
} as const;
