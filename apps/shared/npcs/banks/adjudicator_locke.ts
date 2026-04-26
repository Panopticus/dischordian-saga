// apps/shared/npcs/banks/adjudicator_locke.ts
//
// Phase 3 PILOT — Adjudicator Locke's NpcLine bank.
//
// Validates the unified architecture (Phase 1) + Trade Empire surfaces
// (Phase 2) by authoring real bible-canonical content per
// adjudicator_locke.md §§1-6.
//
// Per Locke bible §6 voice samples: each line carries the canonical
// Locke registers (Mercantile / Predatory / Collegial / Conspiratorial /
// Judicial). Trust bands per registry: Prospect / Client / Partner /
// Insider / Adjudicated.
//
// Canonical surfaces in this pilot bank:
//   - room (sector entry: trade_nexus)
//   - npc_line (mission briefings, contract signing, faction-betrayal
//     reactions)
//   - cinematic (signature first-meeting monologue)
//   - trade_empire (per-mission flavor)
//
// The selector validates per (npcKey, surface) catch-all rule: every
// surface has a catch-all line (no gates) so the silent-fail contract
// holds.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "adjudicator_locke" as const;

export const ADJUDICATOR_LOCKE_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE FIRST-MEETING (cinematic, Trade Hub arrival)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.signature.welcome_to_the_authoritys_ledger",
    text:
      "Welcome to the Authority's ledger. I'm Adjudicator Locke. I read " +
      "contracts. I write contracts. I enforce contracts. The third one " +
      "is the part most people forget. Please don't.",
    surfaces: ["cinematic"],
    cooldownKey: "locke.first_meeting_signature",
    maxPlays: 1,
    setsFlags: ["broker_locke_first_meeting"],
    setsPublicFlags: ["met_adjudicator_locke"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // SECTOR ENTRY (room — trade_nexus)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.room.trade_nexus.prospect.first_visit",
    text:
      "You're new at the Nexus. I file new arrivals under 'unpriced'. " +
      "It's not a slur; it's a category. Everything gets a price eventually.",
    surfaces: ["room"],
    requiresTrustBand: "Prospect",
    minAct: 1,
    cooldownKey: "locke.room.trade_nexus.prospect_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.room.trade_nexus.partner.return_visit",
    text:
      "You've earned a chair, Partner. I'd rather you stay near the third " +
      "column — that's where the audit-friendly contracts live.",
    surfaces: ["room"],
    requiresTrustBand: "Partner",
    cooldownKey: "locke.room.trade_nexus.partner_return",
    maxPlays: 3,
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.room.trade_nexus.insider.deferred_threat",
    text:
      "Insider rates apply. So does Insider candor: the Nexus has a leak " +
      "this week, and I haven't decided yet whether you're the one " +
      "stopping it or the one I report. I'll let you know which.",
    surfaces: ["room"],
    requiresTrustBand: "Insider",
    minAct: 4,
    cooldownKey: "locke.room.trade_nexus.insider_threat",
    maxPlays: 1,
  },

  // Catch-all for room surface (silent-fail compliance)
  {
    npcKey: NPC_KEY,
    lineId: "locke.room.trade_nexus.catchall",
    text: "The Nexus is the Authority's ledger. Try not to bring weather in with you.",
    surfaces: ["room"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CONTRACT SIGNING (npc_line — fine-print canon §1.4)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.signing.audit_offered",
    text:
      "Before you sign, I'll offer the audit. Every contract I write has " +
      "fine print. Auditing it doesn't change the contract — it just means " +
      "you knew. Some clients think knowing is worse. They're not wrong, " +
      "but they're also not who I write contracts for.",
    surfaces: ["npc_line"],
    cooldownKey: "locke.signing.audit_offer",
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.signing.audited.respect_acknowledged",
    text:
      "You audited. Good. The retainer permits me to log every delivery " +
      "sector you touch for seven saga-years. That's the clause. You knew. " +
      "I respect that you knew. Sign here.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Client",
    unlockFlags: ["locke_retainer_audit_disclosed"],
    cooldownKey: "locke.signing.audited_response",
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.signing.unaudited.told_you_so",
    text:
      "There was a clause. There usually is. You didn't audit, so you didn't " +
      "see it. The retainer logs your delivery sectors for seven saga-years. " +
      "I'd have told you on signing if you'd asked. I'm telling you now.",
    surfaces: ["npc_line"],
    reactsToPublicFlag: "locke_retainer_audit_disclosed",
    excludeFlags: ["locke_retainer_audit_disclosed"], // Player did NOT audit
    cooldownKey: "locke.signing.unaudited_reveal",
  },

  // Catch-all for npc_line surface
  {
    npcKey: NPC_KEY,
    lineId: "locke.npc_line.catchall",
    text: "Read the contract. Sign if it makes sense. The Nexus opens at the third tone.",
    surfaces: ["npc_line"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // TOUCHÉ — Vex locked out by Locke exclusivity (cross-character react)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.touche.vex_locked_out",
    text:
      "Vex Solène registers the lock-out. Touché. She doesn't argue; she " +
      "just stops calling. That's how she signs her side of a contract — " +
      "by going quiet. I respect that more than the alternative.",
    surfaces: ["npc_line"],
    reactsToPublicFlag: "vex_locked_out_by_locke_exclusivity",
    cooldownKey: "locke.touche.vex_lockout_acknowledged",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // FACTION-BETRAYAL (cross-NPC reactive — Locke registers your shifts)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.faction_align.new_babylon_lost",
    text:
      "Your standing with New Babylon just turned negative. I file these. " +
      "I don't act on every file. But I file them, and I make sure you " +
      "know I'm filing. That's not a threat. That's the Authority's " +
      "courtesy.",
    surfaces: ["npc_line"],
    reactsToPublicFlag: "faction_align_new_babylon_negative",
    cooldownKey: "locke.faction.new_babylon_loss",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // TRADE-EMPIRE-SURFACE catch-alls (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.trade_empire.catchall",
    text: "The contract is the contract. The price is the price. The audit is on request.",
    surfaces: ["trade_empire"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.cinematic.catchall",
    text: "I'll see you when there's something to file.",
    surfaces: ["cinematic"],
  },
];
