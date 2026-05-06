// apps/shared/tradeEmpire/contractTemplates/houseOaths.ts
//
// House Oaths — phase 4 of the items-matter / Game-of-Thrones arc.
//
// Long-form, season-spanning contracts. Mechanically these are
// ordinary multi-stage ContractDefs, but their stage count and
// progression is tuned for "I am committing to a faction for the
// season" rather than "I am taking on a job." Each oath:
//
//   - Locks the player out of the rival faction's broker on
//     signing (lock_out_broker on a sub-house's primary broker).
//   - Posts a public oath_sworn flag so NPCs can comment.
//   - Grants a faction-aligned title on full completion (consumed
//     by phase 4 court widget gating).
//   - On breach, fires a public_flag for visible "the player broke
//     their oath" so the rival house can capitalise next season.
//
// Cancellation costs are intentionally high — these are oaths,
// not retainers. Breaking them should sting.

import type { ContractDef } from "../contracts";

/**
 * Oath of Authority — bind the player to New Babylon's Authority
 * Ledger sub-house for the season. Locks Hierarchy's Severance
 * counter-broker out and grants the "Sworn Pen" title on success.
 */
export const HOUSE_OATH_AUTHORITY: ContractDef = {
  contractKey: "oath.authority.sworn_pen",
  brokerKey: "broker_locke",
  name: "Oath of the Sworn Pen",
  loreContext:
    "An oath sworn directly to the Authority's Ledger. The signing is private; the lock-out is public. Six minds in red crystal coffins read the registry every cycle. The Severance Division at the Trench, by Hierarchy convention, will not deal with a Sworn Pen until the oath ends or fails.",
  stages: [
    {
      stageId: "swearing",
      label: "The swearing",
      loreContext:
        "Adjudicator Locke witnesses the oath. There is no audience. The signing is canonically witnessed by exactly one Authority adjudicator and one civic-engineer registrar — the latter present only because the engineers refuse to let any signing pass without their stamp.",
      requiredMissionIds: [],
      objective: "Sign the oath instrument with Locke as adjudicating witness.",
      rewards: { credits: 500, influence: 25 },
      factionEffect: { factionId: "new_babylon", change: 5 },
    },
    {
      stageId: "ledger_compliance",
      label: "Demonstrate ledger compliance",
      loreContext:
        "Run two New Babylon trade missions while the oath is active. The Ledger reads each completion as a paragraph in your dossier.",
      requiredMissionIds: ["locke_trade_proposal"],
      objective: "Complete two New Babylon trade missions",
      rewards: { credits: 1500, influence: 75 },
    },
    {
      stageId: "civic_audit",
      label: "Submit to civic audit",
      loreContext:
        "The civic-engineer faction insists on auditing every Sworn Pen mid-oath. The audit is non-trivial — they will look at your books, your hold, your suit's provenance. They will tell you what they find, and the Authority will read their report.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "Complete a civic engineer audit run",
      rewards: { credits: 1000, influence: 50, intelligence: 25 },
      factionEffect: { factionId: "new_babylon", change: 5 },
    },
    {
      stageId: "investiture",
      label: "Investiture as Sworn Pen",
      loreContext:
        "If you reach this stage with the oath unbroken, the Authority confers the Sworn Pen title. A title in New Babylon is not a costume. It is a clearance and an obligation, the latter readable by every broker in the city.",
      requiredMissionIds: [],
      objective: "Receive the Sworn Pen title",
      rewards: { credits: 5000, influence: 300 },
      factionEffect: { factionId: "new_babylon", change: 25 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "severance_lockout",
      label: "Severance lock-out (public)",
      text:
        "Hierarchy's Severance Division will not deal with a Sworn Pen. While this oath is active, broker_nilmorg_severance refuses contracts. The Acquisitions wing remains accessible.",
      triggers: ["on_signing"],
      effect: { kind: "lock_out_broker", brokerKey: "broker_nilmorg_severance" },
    },
    {
      clauseId: "oath_sworn_public",
      label: "Public oath registry",
      text:
        "Every NPC the Authority deals with reads the registry. The fact of the oath is canonically public; its terms are not.",
      triggers: ["on_signing"],
      effect: { kind: "set_public_flag", flag: "oath.authority.sworn_pen.active" },
    },
    {
      clauseId: "civic_audit_trust",
      label: "Civic engineers grant working trust",
      text:
        "The civic-engineer audit is not punitive. Reaching the civic_audit stage canonically grants +5 trust with their senior registrar.",
      triggers: ["on_first_stage_complete"],
      effect: { kind: "trust_delta", npcKey: "the_human", delta: 5 },
    },
    {
      clauseId: "breach_visible",
      label: "Breach is canonically visible",
      text:
        "Cancelling the oath posts a public oath_broken flag the Authority's rivals will reference for at least one season.",
      triggers: ["on_breach"],
      effect: { kind: "set_public_flag", flag: "oath.authority.sworn_pen.broken" },
    },
    {
      clauseId: "breach_acquisitions_offering",
      label: "Acquisitions makes an offering",
      text:
        "On breach, Hierarchy's Acquisitions wing reads the registry update and quietly extends a courtesy. The Authority will note the courtesy as evidence.",
      triggers: ["on_breach"],
      effect: {
        kind: "faction_reputation_delta",
        factionId: "hierarchy",
        delta: 10,
      },
    },
  ],
  cancellationCost: 5000,
  completionReward: {
    credits: 10000,
    influence: 500,
    cardIds: ["card_locke_sworn_pen_title"],
    reputation: [
      { factionId: "new_babylon", change: 50 },
      { factionId: "hierarchy", change: -25 },
    ],
  },
  firstSigningFlag: "oath.authority.sworn_pen.first_sworn",
  minAct: 3,
  metadata: {
    tier: "house_oath",
    canon: "Phase 4 House Oath — Authority's Ledger commitment",
  },
};

/**
 * Oath of the Witness — Revival. Phase A re-tone per user lore
 * correction: Wraith Calder IS the Wraith Hierophant, and the
 * Thalorian religion he leads is a *resurrected, insurgent* movement
 * weaponised against the New Babylon Authority and the Hierarchy's
 * Syndicate of Death. Previously framed as an "Oath of the Quiet
 * Year" (ceremonial restraint) — that's wrong. The oath is *quiet
 * on the surface and insurgent underneath*.
 */
export const HOUSE_OATH_WITNESS_REVIVAL: ContractDef = {
  contractKey: "oath.thaloria.witness_revival",
  brokerKey: "broker_thaloria_quietwork",
  name: "Oath of the Witness — Revival",
  loreContext:
    "Wraith Calder, the Wraith Hierophant, witnesses an oath of revival. The player commits to a season inside the resurrected Thalorian religion — bearing witness to the revival's progress against the New Babylon Authority and the Hierarchy's Syndicate of Death. The oath is canonically *quiet on the surface, insurgent underneath*. Public ceremony; private revolt.",
  stages: [
    {
      stageId: "vesting",
      label: "Vesting in the Wraith Hierophant's chapel",
      loreContext:
        "Wraith Calder leads the vesting himself. The chapel is a converted Thaloria Council antechamber. The witnesses are the seven names the original Hierophant carried. They will be added to.",
      requiredMissionIds: [],
      objective: "Take the Wraith Hierophant's vesting",
      rewards: { credits: 250, influence: 50 },
    },
    {
      stageId: "name_recovery",
      label: "First name recovery (anti-Authority)",
      loreContext:
        "Recover one name the New Babylon Authority erased. Each season the Hierophant names a candidate; the player executes the recovery. Names are weapons — every recovered citation publicly contradicts an Authority record.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "Recover one Authority-erased name with the Hierophant's witness",
      rewards: { credits: 1500, influence: 100, intelligence: 50 },
      factionEffect: { factionId: "antiquarian", change: 10 },
    },
    {
      stageId: "expose_syndicate",
      label: "Expose a Syndicate of Death sacrifice",
      loreContext:
        "The Hierophant's revival exists in part *because* the Hierarchy's Syndicate of Death is preying on the same flock. The mid-oath act is a public exposure: a single sacrifice, witnessed and recorded, the Syndicate cannot deny.",
      requiredMissionIds: [],
      objective: "Witness and publish one Syndicate of Death sacrifice",
      rewards: { credits: 750, influence: 75 },
      factionEffect: { factionId: "hierarchy", change: -10 },
    },
    {
      stageId: "investiture",
      label: "Investiture as Witness of the Revival",
      loreContext:
        "If the oath survives the season unbroken, the Wraith Hierophant confers the Witness title. The title is not a position; it is a *standing accusation* against the Authority and the Syndicate of Death, carried by the bearer.",
      requiredMissionIds: [],
      objective: "Receive the Witness of the Revival title",
      rewards: { credits: 4000, influence: 300 },
      factionEffect: { factionId: "antiquarian", change: 25 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "severance_lockout",
      label: "Severance lock-out (public)",
      text:
        "While the Witness oath is active, Hierarchy's Severance Division refuses contracts. The Hierophant's revival publicly opposes the Hierarchy on multiple fronts; Severance treats the oath-bound as canonically incompatible counterparties.",
      triggers: ["on_signing"],
      effect: { kind: "lock_out_broker", brokerKey: "broker_nilmorg_severance" },
    },
    {
      clauseId: "oath_public",
      label: "Public oath registry — the revival is named",
      text:
        "The Wraith Hierophant publishes the oath. The Authority and the Syndicate of Death will read the registry. The oath-bound becomes canonically a target of both.",
      triggers: ["on_signing"],
      effect: { kind: "set_public_flag", flag: "oath.thaloria.witness_revival.active" },
    },
    {
      clauseId: "anti_authority_canon",
      label: "Anti-Authority canon (post-signing)",
      text:
        "The Authority's Ledger registers the oath as a pro-revival commitment. New Babylon brokers may decline contracts citing 'doctrinal incompatibility'.",
      triggers: ["on_first_stage_complete"],
      effect: {
        kind: "faction_reputation_delta",
        factionId: "new_babylon",
        delta: -10,
      },
    },
    {
      clauseId: "ceremonial_audit_clause",
      label: "Revival audit at completion",
      text:
        "The investiture stage runs a revival audit. Any combat-positive engagement against Thaloria-aligned targets retroactively breaks the oath; trust with the Hierophant collapses; a public oath_broken flag fires.",
      triggers: ["on_full_completion"],
      effect: {
        kind: "ceremonial_audit",
        failsOnCombatPositive: true,
        trustPenalty: -25,
      },
    },
    {
      clauseId: "breach_visible",
      label: "Breach is canonically visible",
      text:
        "Cancelling or failing the Witness oath posts a public flag readable by every Hierarchy and New Babylon broker for at least one season. The Authority and Syndicate of Death will *celebrate* the breach.",
      triggers: ["on_breach"],
      effect: { kind: "set_public_flag", flag: "oath.thaloria.witness_revival.broken" },
    },
  ],
  cancellationCost: 4000,
  completionReward: {
    credits: 8000,
    influence: 600,
    cardIds: ["card_thaloria_witness_title"],
    reputation: [
      { factionId: "antiquarian", change: 40 },
      { factionId: "hierarchy", change: -30 },
      { factionId: "new_babylon", change: -20 },
    ],
  },
  firstSigningFlag: "oath.thaloria.witness_revival.first_sworn",
  minAct: 3,
  metadata: {
    tier: "house_oath",
    canon: "Phase A re-tone — Wraith Hierophant insurgent revival commitment",
  },
};


export const HOUSE_OATH_CONTRACTS: ReadonlyArray<ContractDef> = [
  HOUSE_OATH_AUTHORITY,
  HOUSE_OATH_WITNESS_REVIVAL,
];
