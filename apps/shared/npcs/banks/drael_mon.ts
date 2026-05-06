// apps/shared/npcs/banks/drael_mon.ts
//
// Drael'Mon, SVP Acquisitions — Phase A stub bank.
// Hierarchy peer to Nilmorg. Where Nilmorg refuses gratitude,
// Drael'Mon files it. Where Severance closes ritual, Acquisitions
// strips the asset.

import type { DialogSurface, NpcKey, NpcLine } from "../types";

const NPC_KEY: NpcKey = "drael_mon";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

export const DRAEL_MON_BANK: ReadonlyArray<BankEntry> = [
  // ─── Signature first-meeting ──────────────────────────────────────
  {
    npcKey: NPC_KEY,
    lineId: "drael_mon.signature.we_already_own_you",
    text:
      "Drael'Mon, Senior Vice-President of Acquisitions. We already " +
      "own you. We are merely deciding when to take possession. The " +
      "decision is on the table. The pen is in your hand.",
    surfaces: ["cinematic"],
    cooldownKey: "drael_mon.first_meeting_signature",
    maxPlays: 1,
    setsFlags: ["broker_drael_mon_first_meeting"],
    setsPublicFlags: ["met_drael_mon"],
  },

  // ─── Sector arrival ───────────────────────────────────────────────
  {
    npcKey: NPC_KEY,
    lineId: "drael_mon.room.trench.untargeted.first_visit",
    text:
      "First time at the Trench? Acquisitions appreciates new arrivals. " +
      "We get to choose your category. Try to make it interesting.",
    surfaces: ["room"],
    requiresTrustBand: "Untargeted",
    cooldownKey: "drael_mon.room.trench.untargeted",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "drael_mon.room.trench.acquired.return",
    text:
      "The asset returns. Status update: still acquired. Your operating " +
      "leash retains slack. Use it well.",
    surfaces: ["room"],
    requiresTrustBand: "Acquired",
    cooldownKey: "drael_mon.room.trench.acquired",
    maxPlays: 3,
  },

  // ─── Catch-all (silent-fail-safe) ─────────────────────────────────
  // Required by banks.test.ts: every (npcKey, surface) pair must
  // have at least one fully un-gated line so the selector never
  // silent-fails in production for a known NPC at the Trench.
  {
    npcKey: NPC_KEY,
    lineId: "drael_mon.room.trench.catchall",
    text:
      "Acquisitions never sleeps. Your file remains open.",
    surfaces: ["room"],
    cooldownKey: "drael_mon.catchall",
    maxPlays: 100,
  },

  // ─── Phase 9 public-knowledge reactions ───────────────────────────
  {
    npcKey: NPC_KEY,
    lineId: "drael_mon.room.pk.contract_signed.tracking",
    text:
      "Contract signed. Acquisitions is tracking. Every signature is a " +
      "data point. Every data point compounds. We are patient.",
    surfaces: ["room"],
    reactsToPublicFlag: "pk.contract_signed.recent",
    cooldownKey: "drael_mon.pk.contract_signed",
    maxPlays: 3,
  },

  {
    npcKey: NPC_KEY,
    lineId: "drael_mon.room.pk.thaloria.warning",
    text:
      "The Wraith Hierophant has been busy lately. The revival is " +
      "noticed. Acquisitions does not negotiate with priests. The " +
      "priests will be filed under expense.",
    surfaces: ["room"],
    reactsToPublicFlag: "pk.thaloria_council.tribute_paid.recent",
    cooldownKey: "drael_mon.pk.thaloria_warning",
    maxPlays: 2,
  },
];
