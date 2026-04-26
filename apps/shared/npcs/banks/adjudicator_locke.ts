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
  // 5×5 PERSONALITY-VARIANT GRID (Phase 6a.2 sub-chunk A)
  // Predatory + Collegial + Conspiratorial registers per §2.5 — the
  // "different pens, single hand" canon. Voice doesn't change; angle
  // does. Each variant gates on requiresTrustBand + playerAxisGate
  // so the selector picks the canonical register for the player's
  // current state.
  //
  // Mercantile lives at the default of the existing bank above; this
  // sub-chunk fills the other 3 archetypes for the trust bands where
  // they canonically emerge per §2.5.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Predatory (low-trust + high-mercy player) ──────────────────────
  // Per §2.5: "she senses kindness as a surplus she can extract from,
  // and her lines become slightly crueler. She tests whether the
  // player's virtue is genuine or purchasable."

  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.predatory.prospect.kindness_test",
    text:
      "You agreed quickly. That's a kindness, my dear. I'll need to test " +
      "whether the kindness is genuine or only the look of it. The way I " +
      "test is to ask for slightly more next time. You'll tell me which " +
      "kind you are by what you do.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Prospect",
    playerAxisGate: {
      axis: "mercy",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.predatory.prospect",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.predatory.client.appetite_filed",
    text:
      "You give before I ask. That's interesting. I file 'gives without " +
      "prompting' under appetite. Appetites are leverage. I will not " +
      "punish your appetite. I will use it. I am telling you now because " +
      "you should know I'm telling you.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Client",
    playerAxisGate: {
      axis: "mercy",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.predatory.client",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.predatory.partner.kindness_as_vision",
    // §3.3 "appetite reframed as vision" canon — the canonical
    // mid-trust pivot where Locke's predation becomes flattery.
    text:
      "Your generosity has stopped looking like kindness, my friend. It " +
      "is starting to look like vision. I am willing to call it vision. " +
      "I will charge you the same rate either way.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Partner",
    playerAxisGate: {
      axis: "mercy",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.predatory.partner",
    maxPlays: 1,
  },

  // ─── Collegial (high-trust + pragmatic-wit player) ──────────────────
  // Per §2.5: "peer-mode. She drops honorifics, uses first-person
  // plural ('we'), treats the player as a board member."

  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.collegial.partner.no_table",
    text:
      "Sit closer. We don't need the table between us anymore. There are " +
      "three things on next quarter's docket I'd rather hear your read on " +
      "before I file mine.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Partner",
    playerAxisGate: {
      axis: "wit",
      magnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.collegial.partner",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.collegial.insider.board_member",
    // §1.5 protected: she does NOT name a coffin-mind individually.
    // The line names the institution and its docket without naming
    // any of the six.
    text:
      "You are not a counterparty anymore. You are a colleague who has " +
      "not yet been issued the full briefing. Let me correct that. The " +
      "Authority will be considering the Hierarchy's offer in the next " +
      "session. Your read on Nilmorg's reliability informs mine.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Insider",
    playerAxisGate: {
      axis: "wit",
      magnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.collegial.insider",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.collegial.adjudicated.peer_confessional",
    // §3.6 canon: at trust ≥80 she sacrifices operational information
    // about her own network. The Adjudicated-Collegial register is
    // the deepest peer-mode posture — she names the asymmetry between
    // her interest and the Authority's interest without retracting it.
    text:
      "We are colleagues now. The institutional language drops from here. " +
      "The truth I'd file with my peers is also the truth I'd file with " +
      "you. The Authority's interest and mine are not always the same. " +
      "You are the only person on this ship who knows that.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Adjudicated",
    playerAxisGate: {
      axis: "wit",
      magnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.collegial.adjudicated",
    maxPlays: 1,
    setsPublicFlags: ["locke_disclosed_authority_divergence"],
  },

  // ─── Conspiratorial (high-trust + manipulative/vigilant player) ─────
  // Per §2.5: "she offers shared knowledge as bond-of-crime. Here she
  // is at her most seductive and most dangerous."

  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.conspiratorial.insider.unread_clause",
    text:
      "Listen carefully — and do not make a face. There is a clause in " +
      "the Red Crystal Accord that the Authority itself has never read " +
      "in full. I have. You should. We will both deny this conversation. " +
      "That is the bond.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Insider",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.conspiratorial.insider",
    maxPlays: 1,
    setsPublicFlags: ["locke_shared_unsigned_clause"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.conspiratorial.adjudicated.cannot_be_filed",
    // §3.3 contradiction canon: the deepest she gets to attachment is
    // shared deniability. The line names that without naming feeling.
    text:
      "We have something now, you and I. It cannot be filed. It cannot " +
      "be unsigned. It is the kind of arrangement the Authority pretends " +
      "does not exist. The arrangement keeps me alive. I am telling you " +
      "because you keep me alive too.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Adjudicated",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.conspiratorial.adjudicated",
    maxPlays: 1,
    setsPublicFlags: ["locke_admitted_attachment_to_player"],
  },

  // ─── Judicial (any trust + suspicious-vigilance player) ────────────
  // Per §2.5: "she becomes formal and precise, turning the relationship
  // into something like cross-examination, where she invites challenge
  // so she can parry it." The canonical "I am filing this" register
  // lands across all 5 bands; the band-progression escalates the
  // posture (welcome-the-suspicion → invite-the-questioning →
  // professional-respect-for-the-catch → audit-rehearsal → legacy-
  // drafting). Sub-chunk B of the 5×5 variant grid.

  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.judicial.prospect.welcome_to_the_docket",
    text:
      "You came in suspicious. I file 'arrived skeptical' under " +
      "'professional'. Do not soften that. The client who reads the " +
      "contract twice gets a contract worth reading twice. Welcome to " +
      "the docket.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Prospect",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.judicial.prospect",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.judicial.client.cross_examination",
    text:
      "You are noting my phrasing. I will note that you are noting. We " +
      "are now having a cross-examination, which is a form I prefer. The " +
      "witness improves under questioning. Continue.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Client",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.judicial.client",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.judicial.partner.professional_courtesy",
    text:
      "You suspected me at the third quarter. You were correct to. The " +
      "clause did say what you thought it said, and you proved it before " +
      "I could pivot. I file that under 'professional courtesy'. Continue " +
      "questioning.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Partner",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.judicial.partner",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.judicial.insider.audit_rehearsal",
    text:
      "You are not catching me out anymore. You are rehearsing for the " +
      "room. Good. The Authority audits its own rulings; I would rather " +
      "you audit mine first. Bring me the questions you would ask under " +
      "oath.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Insider",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.judicial.insider",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.judicial.adjudicated.legacy_drafting",
    // §3.6 deepest expression of professional respect: she shares
    // succession-drafting with the player. The line is canonical
    // "the only kind of legacy I am authorized to leave" — Locke
    // naming her own institutional mortality through paperwork.
    text:
      "We are no longer cross-examining each other. We are drafting " +
      "depositions for whoever inherits this office. I file that under " +
      "the only kind of legacy I am authorized to leave. Continue.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Adjudicated",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.judicial.adjudicated",
    maxPlays: 1,
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
