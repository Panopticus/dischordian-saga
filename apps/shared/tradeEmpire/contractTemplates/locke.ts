// apps/shared/tradeEmpire/contractTemplates/locke.ts
//
// Adjudicator Locke's contract templates. Phase 2 ships 3 canonical
// contracts per Locke's bible §§1.4 (fine-print), §4.x (Touché canon
// vs. Vex), §5.x (Trade Empire integration).
//
// All Locke contracts canonically have hidden clauses. Player can
// audit on signing — UI surfaces the audit modal. Failure to audit
// surfaces the clause mid-execution (canonical "I told you" beat).

import type { ContractDef } from "../contracts";

// --- locke.retainer_baseline ---------------------------------------------
//
// The simplest Locke contract: standing retainer for routine New Babylon
// trade missions. Three stages, escalating payout.

export const LOCKE_RETAINER_BASELINE: ContractDef = {
  contractKey: "locke.retainer_baseline",
  brokerKey: "broker_locke",
  name: "Standing Retainer — Routine Trade",
  loreContext:
    "Locke offers you a standing retainer for routine New Babylon trade " +
    "missions. The retainer is paid in three tranches; each tranche " +
    "requires a successful run. The fine-print is, as ever, available on " +
    "request.",
  stages: [
    {
      stageId: "first_run",
      label: "First run — establish reliability",
      loreContext:
        "Complete one routine trade mission for New Babylon. Locke calls " +
        "this the establishing run; she's looking for reliability above " +
        "competence.",
      requiredMissionIds: ["locke_trade_proposal"],
      objective: "complete 1 New Babylon trade mission",
      rewards: { credits: 250, influence: 5 },
    },
    {
      stageId: "second_run",
      label: "Second run — establish pattern",
      loreContext:
        "Complete a second routine trade. Locke is now calibrating; the " +
        "second run is where her actuarial model commits.",
      requiredMissionIds: ["locke_trade_proposal"],
      objective: "complete a second New Babylon trade mission",
      rewards: { credits: 400, influence: 10 },
    },
    {
      stageId: "third_run_with_audit",
      label: "Third run — file the audit",
      loreContext:
        "On the third run, Locke files her actuarial audit. The retainer " +
        "becomes a long-term contract from this point forward.",
      requiredMissionIds: ["locke_trade_proposal"],
      objective: "complete a third trade mission AND submit the audit form",
      rewards: { credits: 750, influence: 20, cardIds: ["card.locke.retainer_seal"] },
      factionEffect: { factionId: "new_babylon", change: 5 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "audit_clause",
      label: "Audit clause (auto-disclose)",
      text:
        "If the player audits the contract on signing, this clause is " +
        "disclosed. The retainer permits Locke to canonically log every " +
        "delivery sector in her actuarial database for a period of seven " +
        "saga-years. Auditing canonically does not change the contract; " +
        "Locke simply respects the audit.",
      triggers: ["on_signing"],
      effect: { kind: "set_public_flag", flag: "locke_retainer_audit_disclosed" },
    },
    {
      clauseId: "trust_breach_clause",
      label: "Breach penalty (post-breach)",
      text:
        "Locke files the breach in her ledger. Trust falls; future " +
        "retainer offers are canonically suspended for at least one act.",
      triggers: ["on_breach"],
      effect: { kind: "trust_delta", npcKey: "adjudicator_locke", delta: -25 },
    },
  ],
  cancellationCost: 100,
  completionReward: {
    credits: 500,
    cardIds: ["card.locke.retainer_seal_v2"],
    reputation: [{ factionId: "new_babylon", change: 10 }],
  },
  firstSigningFlag: "locke_first_retainer_signed",
  metadata: {
    tier: "baseline",
    canon: "Locke bible §1.4 fine-print canon",
  },
};

// --- locke.exclusive_dealings --------------------------------------------
//
// The Touché canon contract (per Locke bible §4.x cross-reference with
// Vex). Player who signs this contract canonically commits to New Babylon
// alignment exclusively. Insurgency / Coda contracts canonically lock out.

export const LOCKE_EXCLUSIVE_DEALINGS: ContractDef = {
  contractKey: "locke.exclusive_dealings",
  brokerKey: "broker_locke",
  name: "Exclusive Dealings Agreement",
  loreContext:
    "Locke offers an exclusive dealings agreement: New Babylon contracts " +
    "only. The premium is significant; the trade-off is alignment. Vex " +
    "Solène, on the Coda side, has been known to make a similar offer in " +
    "her own time. You may not hold both.",
  stages: [
    {
      stageId: "exclusivity_signed",
      label: "Sign the exclusivity",
      loreContext:
        "Once signed, Insurgency and Coda contracts cannot be accepted " +
        "for the duration of this agreement.",
      requiredMissionIds: [],
      objective: "sign the exclusivity agreement",
      rewards: { credits: 1000, influence: 50 },
    },
    {
      stageId: "first_exclusive_run",
      label: "First exclusive run",
      loreContext:
        "Complete a New Babylon mission while exclusivity is active. Locke " +
        "watches the result canonically with attention.",
      requiredMissionIds: ["locke_trade_proposal", "vox_corridor"],
      objective: "complete one New Babylon mission while exclusive",
      rewards: { credits: 1500, influence: 75 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "vex_lockout",
      label: "Insurgency / Coda lock-out",
      text:
        "While exclusivity is active, broker_independent_freeport and any " +
        "Insurgency-aligned broker decline to engage. Vex Solène's offer " +
        "in particular becomes uncashable until exclusivity ends.",
      triggers: ["on_signing"],
      effect: { kind: "lock_out_broker", brokerKey: "broker_independent_freeport" },
    },
    {
      clauseId: "touche_public_flag",
      label: "Touché — Vex registers the lock-out",
      text:
        "Vex Solène, per her own bible canon, registers your exclusivity. " +
        "Touché. She does not contact you again under her Maestro persona " +
        "until the agreement ends or fails.",
      triggers: ["on_signing"],
      effect: { kind: "set_public_flag", flag: "vex_locked_out_by_locke_exclusivity" },
    },
  ],
  cancellationCost: 500,
  completionReward: {
    credits: 2500,
    influence: 100,
    cardIds: ["card.locke.exclusive_seal"],
    reputation: [{ factionId: "new_babylon", change: 25 }],
  },
  firstSigningFlag: "locke_exclusivity_signed",
  minAct: 3,
  metadata: {
    tier: "exclusive",
    canon: "Locke bible §4.x Touché canon vs. Vex",
  },
};

// --- locke.audit_clause --------------------------------------------------
//
// A single-stage "audit-only" contract — Locke commissions the player to
// audit a third-party broker. Canonical Insider-band content (per Locke
// bible §3.x trust-band canon).

export const LOCKE_AUDIT_CLAUSE: ContractDef = {
  contractKey: "locke.audit_clause",
  brokerKey: "broker_locke",
  name: "Third-Party Audit Commission",
  loreContext:
    "Locke commissions you to audit another broker's books. She does not " +
    "name the broker on signing; the audit target is canonically revealed " +
    "post-acceptance. Insider-band trust required.",
  stages: [
    {
      stageId: "audit_executed",
      label: "Execute the audit",
      loreContext:
        "Audit the canonical target (revealed post-signing). Bring the " +
        "ledger back to Locke verified.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "deliver verified audit to Locke",
      rewards: { credits: 1500, intelligence: 50 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "audit_target_reveal",
      label: "Audit target (post-signing)",
      text:
        "The target is broker_antiquarian_archive. Daniel Cross is the " +
        "subject. Locke is auditing the Antiquarian's attribution practice.",
      triggers: ["on_signing"],
      effect: { kind: "set_flag", flag: "locke_audit_target_antiquarian_revealed" },
    },
  ],
  completionReward: {
    credits: 500,
    cardIds: ["card.locke.audit_seal"],
  },
  firstSigningFlag: "locke_audit_first_signed",
  minAct: 4,
  metadata: {
    tier: "insider",
    canon: "Locke bible §3.x Insider-band canon",
    targetBroker: "broker_antiquarian_archive",
  },
};

// --- Aggregate -----------------------------------------------------------

export const LOCKE_CONTRACTS: ReadonlyArray<ContractDef> = [
  LOCKE_RETAINER_BASELINE,
  LOCKE_EXCLUSIVE_DEALINGS,
  LOCKE_AUDIT_CLAUSE,
];
