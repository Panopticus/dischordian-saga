// apps/shared/tradeEmpire/contractTemplates/independent.ts
//
// Free Ports Coalition (faction-neutral) contract templates. Phase 3
// templates per broker bible canonical "barter" engagement style: no
// hidden clauses, minimal personality, market-volatility scaling. The
// Coalition does not editorialise; the contracts are pure economics.
//
// Per the broker test invariant: Independent contracts canonically
// have ZERO hidden clauses. The market_volatility effect is therefore
// declared inline on the contract metadata (not as a hidden clause)
// and applied at stage-completion by the router.

import type { ContractDef } from "../contracts";

// --- independent.bulk_haul -----------------------------------------------
//
// Single-stage bulk freight contract with a market-volatility multiplier.
// Reward scales with the destination sector's recent extraction volume.

export const INDEPENDENT_BULK_HAUL: ContractDef = {
  contractKey: "independent.bulk_haul",
  brokerKey: "broker_independent_freeport",
  name: "Bulk Haul (Freeport Coalition)",
  loreContext:
    "Routine bulk freight from a Free Port to a destination sector. The " +
    "Coalition pays a base rate plus a market-volatility bonus calculated " +
    "off the destination's recent extraction volume. No drama. Pure " +
    "economics.",
  stages: [
    {
      stageId: "haul_to_destination",
      label: "Haul the bulk freight",
      loreContext:
        "Move the contracted bulk cargo to the destination sector. " +
        "Payout includes a volatility multiplier rolled at completion.",
      requiredMissionIds: ["salvage_debris"],
      objective: "deliver bulk cargo to destination sector",
      rewards: { credits: 1000, materials: 50 },
    },
  ],
  cancellationCost: 100,
  completionReward: {
    credits: 200,
    cardIds: ["card.independent.bulk_seal"],
  },
  firstSigningFlag: "independent_first_bulk_haul_signed",
  metadata: {
    tier: "barter",
    canon: "Free Ports Coalition broker canon; faction-neutral barter",
    volatilityBasis: "free_port_alpha",
    volatilityRange: "[0.85, 1.30]",
  },
};

// --- independent.split_share ---------------------------------------------
//
// Two-stage co-brokered contract. Player gets 60%, Coalition keeps 40%.
// No hidden clauses; the split is canonically printed on the cover.

export const INDEPENDENT_SPLIT_SHARE: ContractDef = {
  contractKey: "independent.split_share",
  brokerKey: "broker_independent_freeport",
  name: "Split-Share Run (60/40)",
  loreContext:
    "The Coalition contracts you for a two-leg run with a printed " +
    "60/40 split. You take the larger share. The Coalition takes the " +
    "smaller share for keeping the lane open. Both numbers are on the " +
    "cover. No surprises.",
  stages: [
    {
      stageId: "first_leg",
      label: "First leg — outbound",
      loreContext:
        "Run the outbound leg. Volatility roll applies on completion.",
      requiredMissionIds: ["contact_free_ports"],
      objective: "complete outbound leg",
      rewards: { credits: 600, materials: 25 },
    },
    {
      stageId: "second_leg",
      label: "Second leg — return",
      loreContext:
        "Run the return leg. Volatility roll applies on completion. " +
        "Coalition's 40% is canonically deducted from the gross.",
      requiredMissionIds: ["contact_free_ports"],
      objective: "complete return leg",
      rewards: { credits: 800, materials: 35 },
    },
  ],
  cancellationCost: 150,
  completionReward: {
    credits: 400,
    cardIds: ["card.independent.split_seal"],
    reputation: [{ factionId: "independent", change: 5 }],
  },
  firstSigningFlag: "independent_first_split_share_signed",
  metadata: {
    tier: "barter",
    canon: "Free Ports Coalition broker canon; printed-split canon",
    volatilityBasis: "free_port_alpha",
    volatilityRange: "[0.90, 1.20]",
    coalitionShare: "0.40",
  },
};

// --- independent.rare_mineral_run ----------------------------------------
//
// Single-stage scarcity-scaling run. Reward multiplier scales with
// destination-sector cargo scarcity. Higher payout in higher-volatility
// destinations.

export const INDEPENDENT_RARE_MINERAL_RUN: ContractDef = {
  contractKey: "independent.rare_mineral_run",
  brokerKey: "broker_independent_freeport",
  name: "Rare Mineral Run (Scarcity Premium)",
  loreContext:
    "The Coalition has a rare-mineral lot they need moved into a " +
    "destination where the commodity is canonically scarce. Payout " +
    "scales with destination scarcity; the wider the spread, the more " +
    "you make. The numbers are on the cover.",
  stages: [
    {
      stageId: "deliver_minerals",
      label: "Deliver the minerals",
      loreContext:
        "Transport the rare-mineral lot to the destination sector. " +
        "Volatility multiplier applies at completion based on the " +
        "destination's commodity scarcity.",
      requiredMissionIds: ["salvage_debris", "contact_free_ports"],
      objective: "deliver rare-mineral lot to destination",
      rewards: { credits: 1500, materials: 100 },
    },
  ],
  cancellationCost: 250,
  completionReward: {
    credits: 500,
    materials: 50,
    cardIds: ["card.independent.scarcity_seal"],
  },
  firstSigningFlag: "independent_first_rare_mineral_signed",
  minAct: 3,
  metadata: {
    tier: "barter",
    canon: "Free Ports Coalition broker canon; scarcity-premium canon",
    volatilityBasis: "free_port_alpha",
    volatilityRange: "[1.00, 1.75]",
  },
};

// --- Aggregate -----------------------------------------------------------

export const INDEPENDENT_CONTRACTS: ReadonlyArray<ContractDef> = [
  INDEPENDENT_BULK_HAUL,
  INDEPENDENT_SPLIT_SHARE,
  INDEPENDENT_RARE_MINERAL_RUN,
];
