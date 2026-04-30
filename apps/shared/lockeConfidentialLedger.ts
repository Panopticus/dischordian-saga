/* ═══════════════════════════════════════════════════════
   ADJUDICATOR LOCKE — CONFIDENTIAL LEDGER

   Adjudicator Locke (LOREDEX entity_78) is already wired
   into Trade Empire as a broker (apps/shared/tradeEmpire/
   brokers.ts: broker_locke). His canonical engagement
   style is "fine_print" — every contract has clauses, the
   player can audit, and Locke maintains professional
   distance.

   The Trade Empire is the most cross-cutting subsystem in
   the game: missions touch sectors, brokers, futures, and
   reputation. But its rewards stay inside the trade
   economy itself. Crew, Army, Celebration, and Mechronis
   each have their own currencies and Locke would, in
   character, see all of them as ledgerable.

   This module ships Locke's **Confidential Ledger** —
   side-contracts that pay out in *other systems'*
   currencies. A Crew Charter pays Crew XP. A Field
   Commission pays an army recruitment credit. A Patron's
   Tuition pays Mechronis approval. A Witness Endowment
   pays Celebration bond. Each has fine print Locke states
   plainly when the player audits.

   This is the cross-system seam the Trade Empire bibles
   already imply but never delivered. Locke becomes the
   game's barter layer — the one NPC who exchanges
   currencies across every other loop.

   Locke's voice is canon: terse, transactional, never
   warm, never hostile, always declares the cost first.
   Every contract opens with a single sentence stating
   what the player gets; the next sentence states what
   they pay. The fine print follows.

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

/* ─── PAYOUT KINDS (the cross-system bridge) ─── */

/**
 * The five non-trade systems Locke's ledger can pay into. The
 * keys mirror the systems-this-file-improves; the engine reads
 * the key and routes the credit to the matching subsystem.
 */
export type LedgerPayoutKind =
  | "crew_xp"               // Breeding/Crew — applied to assigned crew
  | "army_recruitment"      // Army recruiting — counts as a completed mission
  | "celebration_bond"      // Celebration — bond top-up for the active apprentice
  | "mechronis_approval"    // Mechronis — professor approval bump
  | "trade_reputation";     // Trade Empire — sector reputation (in-system, retained)

/**
 * A ledger payout. The amount is interpreted by the receiving
 * subsystem; for cross-system clarity the magnitudes are pinned in
 * a tight range so balance work is local.
 */
export interface LedgerPayout {
  kind: LedgerPayoutKind;
  amount: number;
  /** Optional sub-target — eg professor id for mechronis_approval. */
  target?: string;
}

/* ─── LEDGER ENTRIES (the contracts) ─── */

/**
 * A confidential-ledger contract. Each entry is a single
 * Locke-offered side-deal: state, cost, fine print, payout. The
 * cost is in trade-empire reputation (the canonical Locke
 * currency), the payout flows into another subsystem.
 *
 * Entries unlock at trust-band thresholds — the band ladder pinned
 * in apps/shared/npcs/registry.ts (Locke's bands: Stranger /
 * Counterparty / Partner). Entry tier maps to band:
 *     1 → Counterparty (mid)
 *     2 → Partner (high)
 *     3 → Partner + completed prerequisite ledger entry
 */
export interface LedgerEntry {
  id: string;
  /** Display title for the contract — Locke's bookkeeping language. */
  title: string;
  /** Locke's two-sentence pitch (gets / pays / fine print). */
  pitch: string;
  /** The fine print line revealed on audit. Always one sentence. */
  finePrint: string;
  /** Tier (1..3); higher tiers require higher trust + prerequisites. */
  tier: 1 | 2 | 3;
  /** Reputation cost in basis sector — paid from Locke broker rep. */
  reputationCost: number;
  /** Cross-system payout. */
  payout: LedgerPayout;
  /** Optional id of a prior ledger entry that must be completed first. */
  prerequisite?: string;
}

const LEDGER: ReadonlyArray<LedgerEntry> = [
  // -- Tier 1 (Counterparty band) --------------------------------------------
  {
    id: "locke.ledger.crew_charter",
    title: "Crew Charter",
    pitch:
      "I will charter your crew under a New Babylon licence for one cycle. Your crew gains the " +
      "experience the licence implies. You give up some of your standing with my office.",
    finePrint:
      "The licence does not cover acts the licence cannot legally cover. You will know which when you do them.",
    tier: 1,
    reputationCost: 50,
    payout: { kind: "crew_xp", amount: 75 },
  },
  {
    id: "locke.ledger.field_commission",
    title: "Field Commission",
    pitch:
      "I will recognise one of your recruitment runs as a New Babylon field commission. The army " +
      "counter ticks once. The commission is mine until the cycle ends.",
    finePrint:
      "If your army moves against a New Babylon interest during the cycle, the commission becomes the count and the count becomes a debt.",
    tier: 1,
    reputationCost: 60,
    payout: { kind: "army_recruitment", amount: 1 },
  },
  // -- Tier 2 (Partner band) -------------------------------------------------
  {
    id: "locke.ledger.witness_endowment",
    title: "Witness Endowment",
    pitch:
      "Your apprentice's trial gains a New Babylon witness on record. The bond reads higher in the " +
      "Council's eye. You concede the witness's right of veto in the closing rite.",
    finePrint:
      "Vetoes are exercised in writing. They are exercised by a subordinate. The subordinate has my signature.",
    tier: 2,
    reputationCost: 100,
    payout: { kind: "celebration_bond", amount: 15 },
  },
  {
    id: "locke.ledger.patrons_tuition",
    title: "Patron's Tuition",
    pitch:
      "I sponsor one semester of your studies under a Mechronis professor of your choosing. Their " +
      "approval registers an upward correction. You owe me a transcript.",
    finePrint:
      "Transcripts are read only by me. Reading is not the same as filing. I file what is useful.",
    tier: 2,
    reputationCost: 90,
    payout: { kind: "mechronis_approval", amount: 12 },
  },
  // -- Tier 3 (Partner band + prerequisite) ----------------------------------
  {
    id: "locke.ledger.crossreference",
    title: "Cross-Reference",
    pitch:
      "I tie three of my open accounts to one of yours. The standing across all four rises. You become " +
      "discoverable across my network.",
    finePrint:
      "Discoverable is not the same as visible. People who hold this contract know to look for you. I do not control where they look.",
    tier: 3,
    reputationCost: 175,
    payout: { kind: "trade_reputation", amount: 50 },
    prerequisite: "locke.ledger.crew_charter",
  },
  {
    id: "locke.ledger.standing_audit",
    title: "Standing Audit",
    pitch:
      "I audit your standing across every Authority I represent in one motion. The result is a dossier. " +
      "The dossier is yours. The audit is not free.",
    finePrint:
      "Findings of irregularity are noted. Findings of merit are noted differently. You will not be told which is which until the next audit.",
    tier: 3,
    reputationCost: 200,
    payout: { kind: "trade_reputation", amount: 75 },
    prerequisite: "locke.ledger.field_commission",
  },
];

/* ─── HELPERS ─── */

export function allLedgerEntries(): ReadonlyArray<LedgerEntry> {
  return LEDGER;
}

export function getLedgerEntry(id: string): LedgerEntry | undefined {
  return LEDGER.find(e => e.id === id);
}

/* ─── ELIGIBILITY ─── */

/**
 * Locke trust bands, per the canonical registry
 * (apps/shared/npcs/registry.ts LOCKE_BANDS): five bands at
 * thresholds 0/20/40/60/80. Players climb the ladder via Locke
 * trust deltas; each tier of contract requires a different band.
 */
export type LockeTrustBand =
  | "Prospect"     // 0-19
  | "Client"       // 20-39
  | "Partner"      // 40-59
  | "Insider"      // 60-79
  | "Adjudicated"; // 80-100

/** Map a tier to the minimum trust band it requires. Tier 1 is
 *  client-tier work; tier 2 needs the Partner relationship; tier 3
 *  is the Insider tier where Locke shares cross-network access. */
export function tierToRequiredBand(tier: 1 | 2 | 3): LockeTrustBand {
  if (tier === 1) return "Client";
  if (tier === 2) return "Partner";
  return "Insider";
}

/** True if `held` band satisfies the `required` band on the canonical ladder. */
export function bandSatisfies(
  held: LockeTrustBand,
  required: LockeTrustBand,
): boolean {
  const order: LockeTrustBand[] = [
    "Prospect", "Client", "Partner", "Insider", "Adjudicated",
  ];
  return order.indexOf(held) >= order.indexOf(required);
}

/**
 * Resolve a numeric Locke trust value (0-100) to its canonical band.
 * Mirrors the LOCKE_BANDS thresholds in registry.ts so the engagement
 * router can map directly without importing the whole NPC registry.
 */
export function lockeTrustToBand(trust: number): LockeTrustBand {
  if (trust >= 80) return "Adjudicated";
  if (trust >= 60) return "Insider";
  if (trust >= 40) return "Partner";
  if (trust >= 20) return "Client";
  return "Prospect";
}

export interface LedgerEligibilityInput {
  band: LockeTrustBand;
  reputation: number;
  completedEntryIds: ReadonlyArray<string>;
}

export type LedgerEligibility =
  | { eligible: true }
  | { eligible: false; reason:
      | "trust_band_too_low"
      | "insufficient_reputation"
      | "prerequisite_not_completed"
      | "already_completed"
    };

export function checkLedgerEligibility(
  entry: LedgerEntry,
  input: LedgerEligibilityInput,
): LedgerEligibility {
  if (input.completedEntryIds.includes(entry.id)) {
    return { eligible: false, reason: "already_completed" };
  }
  if (!bandSatisfies(input.band, tierToRequiredBand(entry.tier))) {
    return { eligible: false, reason: "trust_band_too_low" };
  }
  if (entry.prerequisite && !input.completedEntryIds.includes(entry.prerequisite)) {
    return { eligible: false, reason: "prerequisite_not_completed" };
  }
  if (input.reputation < entry.reputationCost) {
    return { eligible: false, reason: "insufficient_reputation" };
  }
  return { eligible: true };
}

/**
 * List the ledger entries the player can sign right now (eligible
 * + not already completed). Useful for UI rendering of the
 * "available work" panel.
 */
export function availableLedgerEntries(
  input: LedgerEligibilityInput,
): ReadonlyArray<LedgerEntry> {
  return LEDGER.filter(e => checkLedgerEligibility(e, input).eligible);
}

/* ─── EXECUTION ─── */

export interface LedgerExecutionResult {
  /** Reputation after Locke debits the cost. */
  reputationAfter: number;
  /** Updated completed-entries ledger (caller persists). */
  completedEntryIdsAfter: string[];
  /** The cross-system payout to route. */
  payout: LedgerPayout;
  /** Locke's transaction-close line, verbatim. */
  closeLine: string;
}

/**
 * Execute a ledger entry. Caller must have called
 * checkLedgerEligibility first; this function trusts inputs but
 * clamps reputation to >= 0 defensively.
 */
export function executeLedgerEntry(
  entry: LedgerEntry,
  input: LedgerEligibilityInput,
): LedgerExecutionResult {
  const reputationAfter = Math.max(0, input.reputation - entry.reputationCost);
  const completed = [...input.completedEntryIds];
  if (!completed.includes(entry.id)) completed.push(entry.id);
  return {
    reputationAfter,
    completedEntryIdsAfter: completed,
    payout: entry.payout,
    closeLine: closeLineFor(entry),
  };
}

function closeLineFor(entry: LedgerEntry): string {
  // Locke's transaction-close lines are deliberately templated.
  // Each carries the same beat: ledger updated, fine print binding,
  // door open for the next contract. Tone: terse, professional,
  // never grateful.
  switch (entry.payout.kind) {
    case "crew_xp":
      return "Charter filed. Your crew is licensed. The licence is binding. Next contract when you are ready.";
    case "army_recruitment":
      return "Commission entered. The count is correct. The count is mine until cycle close.";
    case "celebration_bond":
      return "Witness on record. The Council acknowledges. The veto is mine. Be discreet about it.";
    case "mechronis_approval":
      return "Tuition cleared. The Professor will note the correction. Their notation favours the funded student.";
    case "trade_reputation":
      return "Cross-reference complete. Your name is in three places it was not yesterday. I have copies of all three.";
  }
}
