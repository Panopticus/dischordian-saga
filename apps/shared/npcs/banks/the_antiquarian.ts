// apps/shared/npcs/banks/the_antiquarian.ts
//
// Daniel Cross / The Antiquarian — Phase A stub bank.
// Mirrors the adjudicator_locke.ts shape: signature first-meeting,
// sector-arrival cinematic, a couple of trust-band lines, plus
// pk.*.recent reactions for the Phase 9 enrichPublicFlags surface.

import type { DialogSurface, NpcKey, NpcLine } from "../types";

const NPC_KEY: NpcKey = "the_antiquarian";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

export const THE_ANTIQUARIAN_BANK: ReadonlyArray<BankEntry> = [
  // ─── Signature first-meeting ──────────────────────────────────────
  {
    npcKey: NPC_KEY,
    lineId: "antiquarian.signature.desks_do_not_run",
    text:
      "Welcome to the Refuge. I am Daniel Cross. I am the Antiquarian. " +
      "I do not run; desks do not run. I cross-reference. If you wish " +
      "to be cited, your actions will need to deserve citation.",
    surfaces: ["cinematic"],
    cooldownKey: "antiquarian.first_meeting_signature",
    maxPlays: 1,
    setsFlags: ["broker_antiquarian_first_meeting"],
    setsPublicFlags: ["met_the_antiquarian"],
  },

  // ─── Sector arrival ───────────────────────────────────────────────
  {
    npcKey: NPC_KEY,
    lineId: "antiquarian.room.archive.uncited.first_visit",
    text:
      "The Refuge sits outside time. The shelf you are looking at " +
      "would be older than your sun, were it inside time. It is not. " +
      "Mind the citations.",
    surfaces: ["room"],
    requiresTrustBand: "Uncited",
    cooldownKey: "antiquarian.room.archive.uncited",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "antiquarian.room.archive.shelfmate.return",
    text:
      "Shelf-mate. The cross-references on your row continue to compound. " +
      "Whatever you came to ask, ask it as a citation request.",
    surfaces: ["room"],
    requiresTrustBand: "Shelf-mate",
    cooldownKey: "antiquarian.room.archive.shelfmate",
    maxPlays: 3,
  },

  // ─── Catch-all (silent-fail-safe) ─────────────────────────────────
  // Required by banks.test.ts: every (npcKey, surface) pair must
  // have at least one fully un-gated line so the selector never
  // silent-fails in production for a known NPC visiting the Refuge.
  {
    npcKey: NPC_KEY,
    lineId: "antiquarian.room.archive.catchall",
    text:
      "The Refuge endures. Citations compound. The shelves continue.",
    surfaces: ["room"],
    cooldownKey: "antiquarian.catchall",
    maxPlays: 100,
  },

  // ─── Phase 9 public-knowledge reactions ───────────────────────────
  {
    npcKey: NPC_KEY,
    lineId: "antiquarian.room.pk.tribute_paid.cited",
    text:
      "A tribute moved through the Shelf-mates' channel. I have cited " +
      "the source. The destination has been informed of the citation.",
    surfaces: ["room"],
    reactsToPublicFlag: "pk.antiquarian_shelfmates.tribute_paid.recent",
    cooldownKey: "antiquarian.pk.tribute_paid",
    maxPlays: 4,
  },

  {
    npcKey: NPC_KEY,
    lineId: "antiquarian.room.pk.contract_signed.attribution_reminder",
    text:
      "You signed something recently. Whatever its source-tradition, " +
      "the Refuge will canonically remember the attribution. " +
      "Attribution is canon. Plagiarism is the sin.",
    surfaces: ["room"],
    reactsToPublicFlag: "pk.contract_signed.recent",
    cooldownKey: "antiquarian.pk.contract_signed",
    maxPlays: 2,
  },
];
