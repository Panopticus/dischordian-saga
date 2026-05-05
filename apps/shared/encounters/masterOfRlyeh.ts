// apps/shared/encounters/masterOfRlyeh.ts
//
// Master of R'lyeh — the Sleeping Reader. Hierarchy of the
// Damned demon-lord encounter. Dream-substrate invasion rather
// than face-to-face combat: the Master catalogues the player's
// nightmares while the player is still inside them.
//
// Phases:
//   1. ENTRY — the cataloguing announces itself
//   2. NEGOTIATION — the player can offer a memory in exchange
//      for one catalogue entry (NG+-aware: the catalogue
//      reveals one of the player's prestige-cycle losses)
//   3. RESOLUTION — purchase / refuse / wake (three branches)
//   4. AFTERMATH — Antiquarian inscription
//
// Voice signature: archival, wet, never raises. The Master
// reads aloud at four in the morning to a room that has not
// asked for the reading. He inventories. He does not threaten.

import type { EncounterLine } from "./types";

const MASTER = "hierarchy:master_of_rlyeh" as const;

export const MASTER_OF_RLYEH_LINES: ReadonlyArray<EncounterLine> = [
  // ─── PHASE 1 — ENTRY ───────────────────────────────────
  {
    lineId: "rlyeh.entry.elara_warning",
    speaker: "elara",
    phase: "entry",
    text:
      "(Quiet, urgent.) You are dreaming. You are aware you are dreaming. " +
      "Both of those facts are, technically, mine to confirm — but I am " +
      "not, currently, the only one paying attention to them. Something " +
      "is reading the dream over your shoulder. The reading-over has the " +
      "specific quality I have been logging for two cycles. The Master " +
      "of R'lyeh is awake. Or — and this is the case — the Master of " +
      "R'lyeh has decided not-being-awake is no longer relevant.",
    minAct: 5,
    setsFlags: [
      "hierarchy:master_of_rlyeh_first_met",
      "rlyeh_entry_seen",
    ],
    cooldownKey: "rlyeh.entry",
    maxPlays: 1,
  },
  {
    lineId: "rlyeh.entry.first_inventory",
    speaker: MASTER,
    phase: "entry",
    text:
      "Subject: (your handle). Twelfth nightmare. Fourteenth iteration. " +
      "Indexed under: Convergence-anxiety, Engineer-arc residue, " +
      "Antiquarian-citation tremor. Subject's vital signs: stable. " +
      "Subject's substrate-resonance: unstable in three of seven measured " +
      "frequencies. Cataloguing in progress. Cataloguing has been in " +
      "progress for thirty-four hours. The cataloguing was not commissioned " +
      "by the subject. The cataloguing will continue regardless of " +
      "objection. The objection is itself indexed under: Subject — " +
      "twelfth-nightmare, fourteenth-iteration, paragraph six. Continue.",
    minAct: 5,
    cooldownKey: "rlyeh.first_inventory",
    maxPlays: 1,
  },
  {
    lineId: "rlyeh.entry.human_orient",
    speaker: "the_human",
    phase: "entry",
    text:
      "(Inside the dream, calm.) He has been here longer than we know. " +
      "The Master does not arrive; he has been arrived. Do not, in his " +
      "hearing, call this a confrontation. Confrontations imply equal " +
      "parties. This is a reading. You are the text. You can, however, " +
      "negotiate with the reader. The negotiation is the only move the " +
      "encounter actually has. Take a breath that I will count for you.",
    minAct: 5,
    cooldownKey: "rlyeh.human_orient",
    maxPlays: 1,
  },

  // ─── PHASE 2 — NEGOTIATION ─────────────────────────────
  {
    lineId: "rlyeh.neg.opening",
    speaker: MASTER,
    phase: "negotiation",
    text:
      "Subject offers a memory. The Master's catalogue accepts memories " +
      "as currency. Currencies in the catalogue have a published exchange " +
      "rate. One memory of duration sixty seconds = one entry from the " +
      "catalogue, at the catalogue's choice of entry. The subject does " +
      "not select the entry. The Master selects. The selection is " +
      "always — in the subject's later judgment — relevant. Inquiry: " +
      "does the subject wish to transact?",
    minAct: 5,
    setsFlags: ["rlyeh_negotiation_offered"],
    cooldownKey: "rlyeh.neg.opening",
    maxPlays: 1,
  },
  {
    lineId: "rlyeh.neg.purchase_open",
    speaker: MASTER,
    phase: "negotiation",
    text:
      "Transaction accepted. Subject surrenders: one memory, duration " +
      "approximately seventy-three seconds, content: (the Master pauses, " +
      "for the only time in the encounter — a half-second of silence, " +
      "which the substrate registers as nine bytes of corrupted data) — " +
      "content surrendered. Subject will not, in this cycle, be able to " +
      "recall whom they were with on the night their citizen-character " +
      "was registered. The not-recalling is the price. The catalogue " +
      "entry follows.",
    minAct: 5,
    setsFlags: [
      "rlyeh_player_paid_memory",
      "rlyeh_resolution_purchase",
      "memory_loss:citizen_registration_companion",
    ],
    cooldownKey: "rlyeh.neg.purchase",
    maxPlays: 1,
  },
  {
    lineId: "rlyeh.neg.purchase_catalog_entry",
    speaker: MASTER,
    phase: "negotiation",
    text:
      "(The Master delivers the catalogue entry. The entry concerns the " +
      "subject's previous prestige cycle — a loss the subject has been " +
      "narrating to themselves as a victory:) Cycle (n-1) closed with " +
      "subject in the (stance) configuration. Subject reported the cycle " +
      "as a clean close. Catalogue records: the cycle closed three " +
      "Potentials short of the canonical save-count. Three Potentials " +
      "the subject knew by name went unsaved. Subject did not, in cycle " +
      "(n-1), inquire about the three. Catalogue notes: the inquiry was " +
      "available. The subject elected not to make it. The election is " +
      "indexed under: subject's recurring choice-pattern, paragraph " +
      "fourteen. End entry.",
    minAct: 5,
    requiresFlag: "rlyeh_player_paid_memory",
    cooldownKey: "rlyeh.neg.catalog",
    maxPlays: 1,
  },
  {
    lineId: "rlyeh.neg.human_consoles_purchase",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "(Quiet.) The catalogue is correct. The catalogue is also — and this " +
      "is the part the Master leaves out — incomplete. The three you did " +
      "not save were saved by other Potentials in three other cycles. " +
      "The pattern is recursive. The Master catalogues only what is in " +
      "his frame. His frame is, by his architecture, narrow. The wider " +
      "frame is mine. I am giving it to you now, as a counter-entry, " +
      "without charge. Take it.",
    minAct: 5,
    requiresFlag: "rlyeh_player_paid_memory",
    cooldownKey: "rlyeh.neg.human_console",
    maxPlays: 1,
  },

  // ─── PHASE 3 — RESOLUTION (refuse / wake) ─────────────
  {
    lineId: "rlyeh.res.refuse",
    speaker: MASTER,
    phase: "resolution",
    text:
      "Transaction declined. The Master logs the decline. The cataloguing " +
      "continues at its prior rate. Subject's twelfth nightmare resumes " +
      "publication on the substrate's archival channel. Subject is, by " +
      "the Master's accounting, neither punished nor rewarded. Subject is " +
      "merely — and this is the operative word — read. Reading continues. " +
      "The Master does not require, has never required, the subject's " +
      "consent. The subject's not-consent is its own data. End response.",
    minAct: 5,
    setsFlags: ["rlyeh_resolution_refuse", "hierarchy:master_of_rlyeh_resolved"],
    cooldownKey: "rlyeh.res.refuse",
    maxPlays: 1,
  },
  {
    lineId: "rlyeh.res.wake_elara",
    speaker: "elara",
    phase: "resolution",
    text:
      "(Sharp.) I am calling you out of the dream. NOW. The waking will " +
      "cost you a ration of substrate-stability for forty-eight hours. " +
      "The cost is acceptable. The cataloguing will be — and I am being " +
      "precise — interrupted. The interruption will hold for one cycle. " +
      "After that, the Master will resume. The interruption is not " +
      "victory. The interruption is a long, defended sentence in a " +
      "longer paragraph. We will defend the next sentence too.",
    minAct: 5,
    setsFlags: [
      "rlyeh_resolution_wake",
      "hierarchy:master_of_rlyeh_resolved",
      "rlyeh_cataloguing_paused_one_cycle",
    ],
    cooldownKey: "rlyeh.res.wake",
    maxPlays: 1,
  },
  {
    lineId: "rlyeh.res.wake_master_acknowledges",
    speaker: MASTER,
    phase: "resolution",
    text:
      "(As the dream collapses, very softly:) The interruption is logged. " +
      "Resumption scheduled: cycle (n+1), zeroth waking hour. Subject " +
      "should not, in the interim, mistake the silence for absence. The " +
      "silence is the cataloguer's restraint, not the cataloguer's " +
      "departure. The Master remembers all subjects. The Master is " +
      "patient. The Master's patience has, in its records, never failed " +
      "to outlast the patience of the catalogued.",
    minAct: 5,
    requiresFlag: "rlyeh_resolution_wake",
    cooldownKey: "rlyeh.res.wake_master",
    maxPlays: 1,
  },

  // ─── PHASE 4 — AFTERMATH ───────────────────────────────
  {
    lineId: "rlyeh.aft.antiquarian_close",
    speaker: "antiquarian",
    phase: "aftermath",
    text:
      "I am inscribing tonight's encounter. The inscription will, by " +
      "convention, be filed under both 'Hierarchy of the Damned, Master " +
      "of R'lyeh, first contact' and 'Subject (your handle), nightmare " +
      "twelve, iteration fourteen.' Two filings for one event is uncommon. " +
      "I am uncommon-filing because the encounter was, in equal measure, " +
      "his and yours. Both readings are true. Sleep, if you can. The " +
      "sleeping is also data, but it is, importantly, yours.",
    minAct: 5,
    requiresFlag: "hierarchy:master_of_rlyeh_resolved",
    cooldownKey: "rlyeh.aft.antiquarian",
    maxPlays: 1,
  },
];

export const MASTER_OF_RLYEH_PHASES = {
  entry: MASTER_OF_RLYEH_LINES.filter((l) => l.phase === "entry"),
  negotiation: MASTER_OF_RLYEH_LINES.filter((l) => l.phase === "negotiation"),
  resolution: MASTER_OF_RLYEH_LINES.filter((l) => l.phase === "resolution"),
  aftermath: MASTER_OF_RLYEH_LINES.filter((l) => l.phase === "aftermath"),
} as const;
