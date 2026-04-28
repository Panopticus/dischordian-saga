// apps/shared/tradeEmpire/contractTemplates/degen.ts
//
// The Degen's casino-broker contract templates. Phase 3 templates per
// broker bible §3.x (aleatory canon) and §4.6 (Antiquarian-aligned
// data-source canon).
//
// All Degen contracts canonically operate under "aleatory" engagement
// style — randomness IS the contract, not a hidden trap. Per broker
// canon, Degen contracts canonically have NO hidden clauses (the
// outcome variance is the contract's only concealed surface, and it is
// disclosed by being a die-roll). Aleatory effects fire on stage
// completion; close stage is deterministic (the rep cost is the floor).
//
// Engagement bridge: the Degen calibrates contract offers by the
// player's recent gambling pattern (per broker.metadata.missionCalibration).

import type { ContractDef } from "../contracts";

// --- degen.gambling_retainer ---------------------------------------------
//
// Two-stage retainer. Stage 1 is deterministic (haul cargo to the casino
// floor). Stage 2 rolls an aleatory multiplier in [0.5×, 2.0×] on the
// credit reward — the canonical "your luck holds, or it doesn't" beat.
// Completion rep cost is deterministic.

export const DEGEN_GAMBLING_RETAINER: ContractDef = {
  contractKey: "degen.gambling_retainer",
  brokerKey: "broker_degen_casino",
  name: "Casino-Floor Retainer",
  loreContext:
    "The Degen offers you a retainer for routine haul-and-hold work to " +
    "the casino floor. The first leg pays flat. The second leg pays " +
    "whatever the table decides on the night. If you don't like " +
    "uncertainty, the door's that way.",
  stages: [
    {
      stageId: "haul_to_floor",
      label: "Haul to the floor",
      loreContext:
        "Bring the contracted cargo to Degen's Casino. The Degen does " +
        "not inspect; the floor manager does. Flat-rate leg.",
      requiredMissionIds: ["salvage_debris"],
      objective: "deliver cargo to degens_casino sector",
      rewards: { credits: 400, influence: 5 },
    },
    {
      stageId: "settle_at_table",
      label: "Settle at the table",
      loreContext:
        "Settle the second leg with the floor. The settlement is " +
        "aleatory — the reward rolls between half and double the base " +
        "tonight. The Degen smiles whichever way it lands.",
      requiredMissionIds: ["salvage_debris"],
      objective: "settle the second-leg payout at the casino table",
      rewards: { credits: 600, influence: 10 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "settle_at_table_roll",
      label: "Aleatory settlement (disclosed)",
      text:
        "The second-leg payout is multiplied by a uniform roll in [0.5, " +
        "2.0]. The roll is disclosed as part of the engagement style; the " +
        "Degen considers the variance disclosure itself sufficient. " +
        "There is no hidden trap. The randomness is the contract.",
      triggers: ["on_signing"],
      effect: {
        kind: "aleatory_roll",
        stageId: "settle_at_table",
        multiplierMin: 0.5,
        multiplierMax: 2.0,
      },
    },
  ],
  cancellationCost: 200,
  completionReward: {
    credits: 250,
    cardIds: ["card.degen.retainer_chip"],
    reputation: [{ factionId: "antiquarian", change: 3 }],
  },
  firstSigningFlag: "degen_first_retainer_signed",
  metadata: {
    tier: "baseline",
    canon: "Degen broker bible §3.x aleatory canon",
    canonicalRefusal: "If you don't like uncertainty, the door's that way.",
  },
};

// --- degen.pattern_bet ---------------------------------------------------
//
// Single-stage bet against the player's own recent mission pattern. Reward
// is rolled aleatory in [0.25×, 3.0×]. The Degen canonically files the
// player's outcome twice — once in his own ledger and once with the
// Antiquarian's broker_engagement record (cross-broker spillage canon).

export const DEGEN_PATTERN_BET: ContractDef = {
  contractKey: "degen.pattern_bet",
  brokerKey: "broker_degen_casino",
  name: "Pattern Bet (Single Round)",
  loreContext:
    "The Degen has been watching your routes. He'll bet against the " +
    "pattern you don't know you're making. One round. One stake. Win " +
    "huge or pay the rep cost. He'll write either outcome down in two " +
    "ledgers; one of them belongs to the Antiquarian.",
  stages: [
    {
      stageId: "place_the_bet",
      label: "Place the bet",
      loreContext:
        "Run any routine trade-empire mission. The Degen has staked it " +
        "already. The roll resolves on completion. Variance band is wide.",
      requiredMissionIds: ["salvage_debris", "contact_free_ports"],
      objective: "complete one trade-empire mission while the bet is open",
      rewards: { credits: 800, influence: 15 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "wide_band_roll",
      label: "Wide-band aleatory (disclosed)",
      text:
        "Stake reward is multiplied by a uniform roll in [0.25, 3.0]. " +
        "The Degen considers the variance disclosure sufficient.",
      triggers: ["on_signing"],
      effect: {
        kind: "aleatory_roll",
        stageId: "place_the_bet",
        multiplierMin: 0.25,
        multiplierMax: 3.0,
      },
    },
    {
      clauseId: "antiquarian_double_file",
      label: "Antiquarian double-file (public flag)",
      text:
        "The outcome is logged in both Degen's ledger and the " +
        "Antiquarian's broker engagement record per cross-broker " +
        "spillage canon. Public flag.",
      triggers: ["on_full_completion"],
      effect: {
        kind: "set_public_flag",
        flag: "degen_antiquarian_double_filed",
      },
    },
  ],
  cancellationCost: 0,
  completionReward: {
    credits: 100,
    cardIds: ["card.degen.pattern_seal"],
  },
  firstSigningFlag: "degen_first_pattern_bet_signed",
  metadata: {
    tier: "single_round",
    canon: "Degen broker bible §3.x aleatory canon; §4.6 Antiquarian double-file",
  },
};

// --- degen.casino_debt ---------------------------------------------------
//
// Three-stage escalating debt contract. Each stage has its own aleatory
// roll; stage failures compound into a cumulative breach that locks out
// the broker on full failure. The canonical "house always wins, eventually"
// vehicle.

export const DEGEN_CASINO_DEBT: ContractDef = {
  contractKey: "degen.casino_debt",
  brokerKey: "broker_degen_casino",
  name: "Casino Debt (Escalating)",
  loreContext:
    "You owe the floor. The Degen offers a structured run — three legs, " +
    "each one bigger than the last, each one rolled. Clear all three " +
    "and the slate's clean. Miss one, and the next leg costs more. Miss " +
    "all three and the door closes for a while.",
  stages: [
    {
      stageId: "debt_leg_one",
      label: "First leg — small stake",
      loreContext:
        "First leg of the escalating run. Modest stake, narrow variance.",
      requiredMissionIds: ["salvage_debris"],
      objective: "complete the first debt-leg mission",
      rewards: { credits: 500, influence: 10 },
    },
    {
      stageId: "debt_leg_two",
      label: "Second leg — doubled stake",
      loreContext:
        "Stakes double. The Degen widens his variance band; the floor " +
        "watches. If the first leg failed, the second leg is now cash-on-" +
        "delivery only.",
      requiredMissionIds: ["salvage_debris", "contact_free_ports"],
      objective: "complete the second debt-leg mission",
      rewards: { credits: 1200, influence: 20 },
    },
    {
      stageId: "debt_leg_three",
      label: "Third leg — house stake",
      loreContext:
        "The house puts up its own credits. Wide-open variance. Clear " +
        "this and the debt's gone; miss it and the door closes.",
      requiredMissionIds: ["salvage_debris", "contact_free_ports", "vox_corridor"],
      objective: "complete the third debt-leg mission",
      rewards: { credits: 2500, influence: 50 },
    },
  ],
  hiddenClauses: [
    {
      clauseId: "leg_one_roll",
      label: "Leg one variance (disclosed)",
      text: "First-leg payout × roll in [0.75, 1.25].",
      triggers: ["on_signing"],
      effect: {
        kind: "aleatory_roll",
        stageId: "debt_leg_one",
        multiplierMin: 0.75,
        multiplierMax: 1.25,
      },
    },
    {
      clauseId: "leg_two_roll",
      label: "Leg two variance (disclosed)",
      text: "Second-leg payout × roll in [0.5, 1.75].",
      triggers: ["on_signing"],
      effect: {
        kind: "aleatory_roll",
        stageId: "debt_leg_two",
        multiplierMin: 0.5,
        multiplierMax: 1.75,
      },
    },
    {
      clauseId: "leg_three_roll",
      label: "Leg three variance (disclosed)",
      text: "Third-leg payout × roll in [0.25, 2.5].",
      triggers: ["on_signing"],
      effect: {
        kind: "aleatory_roll",
        stageId: "debt_leg_three",
        multiplierMin: 0.25,
        multiplierMax: 2.5,
      },
    },
    {
      clauseId: "house_lockout_on_total_breach",
      label: "Door closes on total breach",
      text:
        "If all three legs fail, broker_degen_casino canonically declines " +
        "to engage for at least one act.",
      triggers: ["on_breach"],
      effect: { kind: "lock_out_broker", brokerKey: "broker_degen_casino" },
    },
  ],
  cancellationCost: 1000,
  completionReward: {
    credits: 3000,
    influence: 100,
    cardIds: ["card.degen.cleared_slate"],
    reputation: [{ factionId: "antiquarian", change: 10 }],
  },
  firstSigningFlag: "degen_first_debt_contract_signed",
  minAct: 4,
  metadata: {
    tier: "escalating",
    canon: "Degen broker bible §3.x aleatory canon; house-always-wins canonical close",
  },
};

// --- Aggregate -----------------------------------------------------------

export const DEGEN_CONTRACTS: ReadonlyArray<ContractDef> = [
  DEGEN_GAMBLING_RETAINER,
  DEGEN_PATTERN_BET,
  DEGEN_CASINO_DEBT,
];
