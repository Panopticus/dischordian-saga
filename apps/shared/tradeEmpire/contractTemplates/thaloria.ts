// apps/shared/tradeEmpire/contractTemplates/thaloria.ts
//
// Thaloria Council of Harmony (Hierophant intermediary) contract
// templates. Phase 3 templates per broker bible canonical "ceremony_aware"
// engagement style: combat-positive completion fails the contract;
// non-combat completion is canonically rewarded.
//
// All Thaloria contracts canonically gate on requiresRevealStage:
// "post_arena" — pre-rite players cannot engage. Hidden clauses are
// limited to a single ceremonial_audit per contract that fires
// on_any_stage_failed if the player completed a required mission with
// the canonical "combat_positive" tag (set by the mission resolver).

import type { ContractDef } from "../contracts";

// --- thaloria.name_recovery ----------------------------------------------
//
// Two-stage non-combat archive run. The player must canonically recover
// a person's name from a Thaloria archive without combat resolution.

export const THALORIA_NAME_RECOVERY: ContractDef = {
  contractKey: "thaloria.name_recovery",
  brokerKey: "broker_thaloria_quietwork",
  name: "Name Recovery (Quiet Work)",
  loreContext:
    "The Hierophant's intermediary, Wraith Calder, asks: a person's " +
    "name has been canonically misfiled in a Thaloria archive. Recover " +
    "the name. Do not draw a weapon. The Council of Harmony does not " +
    "thank, but it remembers. Combat-positive completion canonically " +
    "fails the contract.",
  stages: [
    {
      stageId: "locate_archive_entry",
      label: "Locate the misfiled entry",
      loreContext:
        "Quiet work: search the archive without disturbance. The " +
        "ceremonial-audit canonically fires if the locating mission was " +
        "completed combat-positive.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "locate misfiled name in Thaloria archive without combat",
      rewards: { credits: 600, intelligence: 30 },
    },
    {
      stageId: "return_name",
      label: "Return the name",
      loreContext:
        "Bring the recovered name back to the Council antechamber. " +
        "Wraith Calder canonically does not look up; the name is filed " +
        "without comment.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "return the recovered name to thaloria council_antechamber",
      rewards: { credits: 800, intelligence: 40 },
      factionEffect: { factionId: "thaloria", change: 5 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "ceremonial_audit",
      label: "Ceremonial audit (on any combat)",
      text:
        "If any required mission for this contract was completed with " +
        "the canonical combat_positive tag, the contract canonically " +
        "fails and Hierophant trust drops. Per Thaloria broker canon: " +
        "combat-positive missions = negative Hierophant trust.",
      triggers: ["on_any_stage_failed"],
      effect: {
        kind: "ceremonial_audit",
        failsOnCombatPositive: true,
        trustPenalty: 10,
      },
    },
  ],
  cancellationCost: 100,
  completionReward: {
    credits: 700,
    intelligence: 50,
    cardIds: ["card.thaloria.quietwork_seal"],
    reputation: [{ factionId: "thaloria", change: 8 }],
  },
  firstSigningFlag: "thaloria_first_name_recovery_signed",
  requiresRevealStage: "post_arena",
  metadata: {
    tier: "quiet_work",
    canon: "Thaloria broker canon; Hierophant trust rule (combat-positive = -trust)",
    gate: "post_arena revealStage required",
  },
};

// --- thaloria.archive_retrieval ------------------------------------------
//
// Single-stage non-combat archive retrieval. Lower stakes; same gate.

export const THALORIA_ARCHIVE_RETRIEVAL: ContractDef = {
  contractKey: "thaloria.archive_retrieval",
  brokerKey: "broker_thaloria_quietwork",
  name: "Archive Retrieval (Council Quiet)",
  loreContext:
    "Wraith Calder requests retrieval of a Council archive that has " +
    "been canonically left in the wrong sector. Bring it home. Quietly. " +
    "Combat-positive completion canonically fails the contract.",
  stages: [
    {
      stageId: "retrieve_archive",
      label: "Retrieve the archive",
      loreContext:
        "Quiet retrieval. The Council does not pay for noise; it pays " +
        "for the archive's safe return.",
      requiredMissionIds: ["antiquarian_invitation"],
      objective: "retrieve Council archive without combat",
      rewards: { credits: 800, intelligence: 40 },
      factionEffect: { factionId: "thaloria", change: 3 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "ceremonial_audit",
      label: "Ceremonial audit (on any combat)",
      text:
        "Combat-positive completion canonically fails the contract per " +
        "Thaloria broker canon.",
      triggers: ["on_any_stage_failed"],
      effect: {
        kind: "ceremonial_audit",
        failsOnCombatPositive: true,
        trustPenalty: 8,
      },
    },
  ],
  cancellationCost: 50,
  completionReward: {
    credits: 400,
    intelligence: 25,
    cardIds: ["card.thaloria.archive_seal"],
  },
  firstSigningFlag: "thaloria_first_archive_retrieval_signed",
  requiresRevealStage: "post_arena",
  metadata: {
    tier: "quiet_work",
    canon: "Thaloria broker canon; Hierophant quiet-work canon",
    gate: "post_arena revealStage required",
  },
};

// --- thaloria.diplomatic_facilitation ------------------------------------
//
// Three-stage diplomatic mission. Each stage's success requires non-
// combat resolution. Reward scales sharply because the Council values
// canonical de-escalation.

export const THALORIA_DIPLOMATIC_FACILITATION: ContractDef = {
  contractKey: "thaloria.diplomatic_facilitation",
  brokerKey: "broker_thaloria_quietwork",
  name: "Diplomatic Facilitation (Three-Stage)",
  loreContext:
    "The Council requests an extended diplomatic facilitation: three " +
    "discrete stages of de-escalation across three sectors. Each stage " +
    "canonically requires non-combat resolution. Reward scales with " +
    "ceremonial fidelity. Wraith Calder will canonically not appear " +
    "during the contract; the Council watches.",
  stages: [
    {
      stageId: "first_facilitation",
      label: "First facilitation — open the channel",
      loreContext:
        "Open a diplomatic channel in the first sector. Combat-positive " +
        "completion canonically fails the stage.",
      requiredMissionIds: ["contact_free_ports"],
      objective: "open diplomatic channel without combat",
      rewards: { credits: 800, intelligence: 30 },
      factionEffect: { factionId: "thaloria", change: 4 },
    },
    {
      stageId: "second_facilitation",
      label: "Second facilitation — broker the meeting",
      loreContext:
        "Broker the canonical face-to-face. Quiet work; the Hierophant " +
        "watches for tone.",
      requiredMissionIds: ["contact_free_ports"],
      objective: "broker face-to-face meeting without combat",
      rewards: { credits: 1200, intelligence: 50 },
      factionEffect: { factionId: "thaloria", change: 6 },
    },
    {
      stageId: "third_facilitation",
      label: "Third facilitation — close the accord",
      loreContext:
        "Close the canonical accord. The Council files the result. The " +
        "Hierophant does not appear.",
      requiredMissionIds: ["contact_free_ports"],
      objective: "close diplomatic accord without combat",
      rewards: { credits: 2000, intelligence: 75 },
      factionEffect: { factionId: "thaloria", change: 10 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "ceremonial_audit",
      label: "Ceremonial audit (on any combat)",
      text:
        "Any combat-positive stage canonically fails the contract and " +
        "incurs a heavy Hierophant trust penalty.",
      triggers: ["on_any_stage_failed"],
      effect: {
        kind: "ceremonial_audit",
        failsOnCombatPositive: true,
        trustPenalty: 20,
      },
    },
  ],
  cancellationCost: 500,
  completionReward: {
    credits: 2500,
    influence: 100,
    intelligence: 100,
    cardIds: ["card.thaloria.accord_seal"],
    reputation: [{ factionId: "thaloria", change: 25 }],
  },
  firstSigningFlag: "thaloria_first_diplomatic_facilitation_signed",
  requiresRevealStage: "post_arena",
  minAct: 4,
  metadata: {
    tier: "high_ceremony",
    canon: "Thaloria broker canon; Hierophant high-ceremony canon",
    gate: "post_arena revealStage required",
  },
};

// --- Aggregate -----------------------------------------------------------

export const THALORIA_CONTRACTS: ReadonlyArray<ContractDef> = [
  THALORIA_NAME_RECOVERY,
  THALORIA_ARCHIVE_RETRIEVAL,
  THALORIA_DIPLOMATIC_FACILITATION,
];
