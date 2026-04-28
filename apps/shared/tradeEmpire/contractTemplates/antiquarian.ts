// apps/shared/tradeEmpire/contractTemplates/antiquarian.ts
//
// The Antiquarian's archive-broker contract templates + Oracle futures
// sub-family. Phase 3 templates per broker bible §4.6 ("desks do not
// run"; bibliographic precision; attribution canonical) and the Oracle
// class canon ("you see the branches; the market sees only today").
//
// Engagement style: bibliographic. Antiquarian contracts canonically may
// have hidden clauses — but per the broker bible, those clauses are
// CROSS-REFERENCES, not traps. They are printed (auditable on signing)
// and require the player to canonically seek out the referenced source.
//
// Oracle futures sub-family is class-locked (Oracle only, gated by the
// oracle_antiquarian_met flag — set when an Oracle first signs an
// Antiquarian contract). Settlement uses real-world hours
// (ORACLE_FUTURES_CYCLE_HOURS=24 in the router) and player-trade-activity
// for spot-price determination.

import type { ContractDef } from "../contracts";

// --- antiquarian.provenance_run ------------------------------------------
//
// Three-stage attribution-recovery. Cross-references locke.audit_clause
// (the player must canonically have read Locke's audit canon to
// understand the precedent the Antiquarian is citing).

export const ANTIQUARIAN_PROVENANCE_RUN: ContractDef = {
  contractKey: "antiquarian.provenance_run",
  brokerKey: "broker_antiquarian_archive",
  name: "Provenance Run — Signature Chain",
  loreContext:
    "Daniel Cross has a parcel whose attribution chain is canonically " +
    "incomplete. He needs the chain re-established, signatory by " +
    "signatory, sector by sector. Bring the chain back signed. The " +
    "Antiquarian considers attribution canonical metadata; do not " +
    "shortcut the signatures. If you've read Locke's audit canon, you " +
    "already know the format he expects.",
  stages: [
    {
      stageId: "first_signature",
      label: "First signatory — origin sector",
      loreContext:
        "Locate the originator NPC in the parcel's origin sector. Obtain " +
        "their canonical signature on the chain ledger.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "obtain originator signature in origin sector",
      rewards: { credits: 600, intelligence: 20 },
    },
    {
      stageId: "second_signature",
      label: "Second signatory — transit broker",
      loreContext:
        "The parcel changed hands once in transit. Find the broker who " +
        "held it. Obtain their signature.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "obtain transit-broker signature",
      rewards: { credits: 800, intelligence: 30 },
    },
    {
      stageId: "deliver_chain",
      label: "Return the completed chain",
      loreContext:
        "Bring the fully-signed chain back to the Archive. Daniel Cross " +
        "files it. Provenance is canonically restored.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "deliver completed chain to antiquarian_archive",
      rewards: { credits: 1200, intelligence: 50, tomeIds: ["tome.antiquarian.provenance_v1"] },
      factionEffect: { factionId: "antiquarian", change: 10 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "locke_precedent_xref",
      label: "Cross-reference: Locke audit precedent",
      text:
        "This contract canonically cites locke.audit_clause as procedural " +
        "precedent. The player must canonically have read or signed " +
        "locke.audit_clause to understand the chain-of-custody format. " +
        "Auditing on signing discloses the citation; the precedent " +
        "itself must be sought.",
      triggers: ["on_signing"],
      effect: {
        kind: "cross_reference",
        referencedContractKey: "locke.audit_clause",
        mustBeSigned: false,
      },
    },
  ],
  cancellationCost: 300,
  completionReward: {
    credits: 1500,
    intelligence: 75,
    cardIds: ["card.antiquarian.provenance_seal"],
    reputation: [{ factionId: "antiquarian", change: 15 }],
  },
  firstSigningFlag: "antiquarian_first_provenance_signed",
  minAct: 3,
  metadata: {
    tier: "archive",
    canon: "Antiquarian broker bible §4.6 attribution canon",
    crossRef: "locke.audit_clause precedent",
  },
};

// --- antiquarian.archive_recovery ----------------------------------------
//
// Two-stage shape mirroring nilmorg.signature_archive. Cross-references
// the Nilmorg contract (the secondary purchaser canon).

export const ANTIQUARIAN_ARCHIVE_RECOVERY: ContractDef = {
  contractKey: "antiquarian.archive_recovery",
  brokerKey: "broker_antiquarian_archive",
  name: "Archive Recovery (Bibliographic)",
  loreContext:
    "An archive has gone missing from a shelf the Antiquarian considers " +
    "canonical. Locate it; return it. Daniel Cross does not say which " +
    "shelf — the bibliographic record will canonically identify the " +
    "right one. Nilmorg occasionally brokers the secondary purchaser, " +
    "per his own bible's institutional canon.",
  stages: [
    {
      stageId: "locate_archive",
      label: "Locate the archive",
      loreContext:
        "Search canonical sectors. The bibliographic record is " +
        "self-referential — the archive will canonically identify itself " +
        "to a careful reader.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "locate the missing archive",
      rewards: { credits: 700, intelligence: 30 },
    },
    {
      stageId: "return_archive",
      label: "Return the archive",
      loreContext:
        "Bring it home to the right shelf. The Antiquarian re-files; he " +
        "does not thank.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "return archive to antiquarian_archive sector",
      rewards: { credits: 1000, intelligence: 40 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "nilmorg_secondary_xref",
      label: "Cross-reference: Nilmorg secondary purchaser",
      text:
        "Nilmorg occasionally brokers the secondary purchaser per his " +
        "institutional canon. The cross-reference is purely informational; " +
        "the player who has signed severance.signature_archive_contract " +
        "canonically already knows.",
      triggers: ["on_signing"],
      effect: {
        kind: "cross_reference",
        referencedContractKey: "severance.signature_archive_contract",
        mustBeSigned: false,
      },
    },
  ],
  cancellationCost: 250,
  completionReward: {
    credits: 1200,
    intelligence: 60,
    cardIds: ["card.antiquarian.archive_seal"],
  },
  firstSigningFlag: "antiquarian_first_archive_recovery_signed",
  metadata: {
    tier: "archive",
    canon: "Antiquarian broker bible §4.6 bibliographic canon",
    crossRef: "severance.signature_archive_contract",
  },
};

// --- antiquarian.attribution_audit ---------------------------------------
//
// Single-stage forensic audit on existing cargo. Cross-references the
// Locke retainer to suggest the audit's precedent.

export const ANTIQUARIAN_ATTRIBUTION_AUDIT: ContractDef = {
  contractKey: "antiquarian.attribution_audit",
  brokerKey: "broker_antiquarian_archive",
  name: "Attribution Audit (Forensic)",
  loreContext:
    "Daniel Cross suspects a piece of cargo's attribution is canonically " +
    "wrong. Audit it. Bring back the verified attribution. He'll file " +
    "the correction. Locke's retainer canon is the procedural precedent.",
  stages: [
    {
      stageId: "audit_executed",
      label: "Execute the audit",
      loreContext:
        "Audit the contracted cargo's attribution chain. Verify the " +
        "originator. Verify the chain. File the correction.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "deliver verified attribution to antiquarian_archive",
      rewards: { credits: 1500, intelligence: 75 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "locke_retainer_xref",
      label: "Cross-reference: Locke retainer precedent",
      text:
        "The audit's procedural template canonically derives from " +
        "locke.retainer_baseline. The cross-reference is informational.",
      triggers: ["on_signing"],
      effect: {
        kind: "cross_reference",
        referencedContractKey: "locke.retainer_baseline",
        mustBeSigned: false,
      },
    },
  ],
  cancellationCost: 200,
  completionReward: {
    credits: 800,
    intelligence: 50,
    cardIds: ["card.antiquarian.attribution_seal"],
  },
  firstSigningFlag: "antiquarian_first_attribution_audit_signed",
  minAct: 4,
  metadata: {
    tier: "forensic",
    canon: "Antiquarian broker bible §4.6 attribution canon",
    crossRef: "locke.retainer_baseline",
  },
};

// ═══════════════════════════════════════════════════════════════════
// Oracle futures sub-family — Oracle-class-only.
// Settlement: real-world hours (ORACLE_FUTURES_CYCLE_HOURS=24).
// Spot price: player trade activity in the basis sector during the
// holding window. See router for resolver implementation.
// ═══════════════════════════════════════════════════════════════════

// --- antiquarian.futures_call --------------------------------------------
//
// Oracle bets the basis-sector commodity rises by settlement. Two stages:
// open position → settle. The "settle" stage is canonically completed by
// the lazy resolver, not by player action.

export const ANTIQUARIAN_FUTURES_CALL: ContractDef = {
  contractKey: "antiquarian.futures_call",
  brokerKey: "broker_antiquarian_archive",
  name: "Probability Future — Call",
  loreContext:
    "An Oracle's contract. Daniel Cross will broker a call position on a " +
    "commodity in a basis sector — you see the branch, you stake the " +
    "strike, the settlement comes when the cycle closes. The market sees " +
    "only today. That asymmetry is what a futures contract measures.",
  stages: [
    {
      stageId: "open_position",
      label: "Open the position",
      loreContext:
        "The Oracle articulates which branch they have seen. The strike " +
        "is canonically locked; the position is open.",
      requiredMissionIds: [],
      objective: "open call position via purchaseFutures endpoint",
      rewards: { credits: 0 },
    },
    {
      stageId: "settle_position",
      label: "Settle at horizon",
      loreContext:
        "The cycle closes. The lazy resolver compares the spot price " +
        "against the strike. Win pays a multiple of the spread; loss " +
        "forfeits the broker fee.",
      requiredMissionIds: [],
      objective: "settle position when settlesAt has elapsed",
      rewards: { credits: 0 },
    },
  ],
  cancellationCost: 500,
  completionReward: {
    cardIds: ["card.antiquarian.futures_call_seal"],
  },
  firstSigningFlag: "oracle_antiquarian_met",
  minAct: 3,
  metadata: {
    tier: "oracle_futures",
    canon: "Antiquarian probability-archive canon; Oracle class-locked",
    classLock: "oracle",
    position: "call",
    cycleHours: "24",
  },
};

// --- antiquarian.futures_put ---------------------------------------------
//
// Oracle bets the basis-sector commodity falls by settlement. Same shape
// as call; payout inverted.

export const ANTIQUARIAN_FUTURES_PUT: ContractDef = {
  contractKey: "antiquarian.futures_put",
  brokerKey: "broker_antiquarian_archive",
  name: "Probability Future — Put",
  loreContext:
    "An Oracle's contract. Daniel Cross brokers a put position — you " +
    "see the branch where the price falls, you stake the strike against " +
    "it. Settlement at horizon. The Antiquarian is canonically surprised " +
    "by an Oracle's depth; he does not say so.",
  stages: [
    {
      stageId: "open_position",
      label: "Open the position",
      loreContext:
        "The Oracle articulates the descending branch they have seen. " +
        "The strike is locked; the position is open.",
      requiredMissionIds: [],
      objective: "open put position via purchaseFutures endpoint",
      rewards: { credits: 0 },
    },
    {
      stageId: "settle_position",
      label: "Settle at horizon",
      loreContext:
        "The lazy resolver compares spot against strike. Put pays when " +
        "the price falls below strike; loses when it rises.",
      requiredMissionIds: [],
      objective: "settle position when settlesAt has elapsed",
      rewards: { credits: 0 },
    },
  ],
  cancellationCost: 500,
  completionReward: {
    cardIds: ["card.antiquarian.futures_put_seal"],
  },
  firstSigningFlag: "oracle_antiquarian_met",
  minAct: 3,
  metadata: {
    tier: "oracle_futures",
    canon: "Antiquarian probability-archive canon; Oracle class-locked",
    classLock: "oracle",
    position: "put",
    cycleHours: "24",
  },
};

// --- antiquarian.futures_spread ------------------------------------------
//
// Three-stage paired call+put hedge. Lower variance, lower payout. The
// Oracle who hedges is canonically less sure of the branch they have
// seen — the Antiquarian considers this honest.

export const ANTIQUARIAN_FUTURES_SPREAD: ContractDef = {
  contractKey: "antiquarian.futures_spread",
  brokerKey: "broker_antiquarian_archive",
  name: "Probability Future — Spread (Hedge)",
  loreContext:
    "An Oracle's contract for the canonically less-sure. Daniel Cross " +
    "brokers a paired call+put on the same basis. The variance is " +
    "narrower; the payout is smaller. The Antiquarian considers a " +
    "hedge an honest position.",
  stages: [
    {
      stageId: "open_call_leg",
      label: "Open the call leg",
      loreContext:
        "Open the call half of the paired position. Strike locked.",
      requiredMissionIds: [],
      objective: "open call leg via purchaseFutures endpoint",
      rewards: { credits: 0 },
    },
    {
      stageId: "open_put_leg",
      label: "Open the put leg",
      loreContext:
        "Open the put half. Same basis sector, same horizon, opposite " +
        "direction.",
      requiredMissionIds: [],
      objective: "open put leg via purchaseFutures endpoint",
      rewards: { credits: 0 },
    },
    {
      stageId: "settle_spread",
      label: "Settle the spread",
      loreContext:
        "The lazy resolver compares spot against both strikes. Spread " +
        "pays the bounded delta; the Antiquarian files the result.",
      requiredMissionIds: [],
      objective: "settle spread when both legs' settlesAt have elapsed",
      rewards: { credits: 0 },
    },
  ],
  cancellationCost: 750,
  completionReward: {
    cardIds: ["card.antiquarian.futures_spread_seal"],
  },
  firstSigningFlag: "oracle_antiquarian_met",
  minAct: 4,
  metadata: {
    tier: "oracle_futures",
    canon: "Antiquarian probability-archive canon; Oracle class-locked",
    classLock: "oracle",
    position: "spread",
    cycleHours: "24",
  },
};

// --- Aggregate -----------------------------------------------------------

export const ANTIQUARIAN_CONTRACTS: ReadonlyArray<ContractDef> = [
  ANTIQUARIAN_PROVENANCE_RUN,
  ANTIQUARIAN_ARCHIVE_RECOVERY,
  ANTIQUARIAN_ATTRIBUTION_AUDIT,
  ANTIQUARIAN_FUTURES_CALL,
  ANTIQUARIAN_FUTURES_PUT,
  ANTIQUARIAN_FUTURES_SPREAD,
];
