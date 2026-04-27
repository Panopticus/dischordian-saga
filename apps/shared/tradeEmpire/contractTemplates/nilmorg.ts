// apps/shared/tradeEmpire/contractTemplates/nilmorg.ts
//
// Nilmorg's Severance Prize broker contracts — Phase 2 templates per
// nilmorg.md §§2.4 (Severance Prize economy), §4.8 (mid-wife canon),
// §5.7 (Trade Empire deferred broker hook now activated).
//
// All Nilmorg contracts canonically operate under "institutional
// precision" engagement style — no hidden clauses (institutional
// canon: "He always pays. He never explains why that's worse than not
// paying."). Refusal shape is decline_gratitude — Nilmorg never
// accepts thanks; the canonical line is "Don't thank me."
//
// Bridge: contracts canonically OPEN only after a severance_prize_paid
// ripple event fires (DMC ↔ Trade Empire bridge per §5.6 cross-system).

import type { ContractDef } from "../contracts";

// --- severance.clone_body_contract --------------------------------------
//
// Nilmorg commissions the player to deliver a clone-body cargo from
// the Trench to a contracted recipient. Single-stage; institutional;
// canonical "delivery, not gift" framing.

export const SEVERANCE_CLONE_BODY_CONTRACT: ContractDef = {
  contractKey: "severance.clone_body_contract",
  brokerKey: "broker_nilmorg_severance",
  name: "Clone-Body Delivery (Severance Tier)",
  loreContext:
    "Nilmorg has a clone body — fresh, splice-tagged, signed. The body " +
    "is contracted to a recipient he does not name. You deliver. You do " +
    "not ask. The platform pays on completion. Don't thank him.",
  stages: [
    {
      stageId: "deliver_clone",
      label: "Deliver the clone",
      loreContext:
        "Transport the sealed clone-body container from Nilmorg's platform " +
        "to the canonical recipient sector. The container does not open in " +
        "transit. You do not ask why.",
      requiredMissionIds: ["nilmorg.deliver_clone_body"],
      objective: "deliver sealed clone-body to recipient sector",
      rewards: { credits: 1500, materials: 100 },
    },
  ],
  cancellationCost: 250,
  completionReward: {
    credits: 500,
    cardIds: ["card.nilmorg.severance_seal"],
  },
  firstSigningFlag: "nilmorg_first_clone_contract_signed",
  metadata: {
    tier: "severance",
    canon: "Nilmorg bible §4.8 mid-wife canon; §2.4 Severance Prize economy",
    bridge: "DMC severance_prize_paid ripple opens this contract",
    canonicalRefusal: "Don't thank me.",
  },
};

// --- severance.signature_archive_contract -------------------------------
//
// Nilmorg commissions retrieval of a signature-archive — institutional
// metadata about a previous DMC season's racers. Two-stage; institutional;
// the Antiquarian sometimes brokers the secondary purchaser.

export const SEVERANCE_SIGNATURE_ARCHIVE_CONTRACT: ContractDef = {
  contractKey: "severance.signature_archive_contract",
  brokerKey: "broker_nilmorg_severance",
  name: "Signature Archive Retrieval",
  loreContext:
    "A previous season's signature archive has gone missing from the " +
    "vault. Nilmorg wants it back. He does not say why. The Antiquarian " +
    "sometimes brokers the secondary purchaser — Nilmorg does not " +
    "comment on this. You do not ask.",
  stages: [
    {
      stageId: "locate_archive",
      label: "Locate the missing archive",
      loreContext:
        "Find the signature archive. It is canonically kept in one of " +
        "three sectors; Nilmorg does not specify which.",
      requiredMissionIds: ["nilmorg.locate_signature_archive"],
      objective: "locate the missing signature archive",
      rewards: { credits: 800, intelligence: 25 },
    },
    {
      stageId: "return_archive",
      label: "Return the archive",
      loreContext:
        "Bring the archive back to Nilmorg's platform. The platform " +
        "weighs it on receipt. You do not ask why.",
      requiredMissionIds: ["nilmorg.return_signature_archive"],
      objective: "return archive to Nilmorg's platform",
      rewards: { credits: 1200, intelligence: 40 },
    },
  ],
  cancellationCost: 500,
  completionReward: {
    credits: 1500,
    influence: 30,
    cardIds: ["card.nilmorg.archive_seal"],
  },
  firstSigningFlag: "nilmorg_first_archive_contract_signed",
  minAct: 3,
  metadata: {
    tier: "severance",
    canon: "Nilmorg bible §2.4 institutional precision",
    cross: "Antiquarian sometimes-broker; OCB-O3 Programmer cross-bible",
  },
};

// --- severance.prize_body_contract --------------------------------------
//
// The bible-canonical PRIZE-BODY contract. Per Nilmorg bible §4.8:
// every Severance Prize companion canonically carries the memory
// "Nilmorg kept his agreement." This contract is the canonical
// agreement-keeping ritual in Trade Empire form. Three stages mirror
// the canonical Severance Prize ceremony (extraction → container-
// seal → delivery).

export const SEVERANCE_PRIZE_BODY_CONTRACT: ContractDef = {
  contractKey: "severance.prize_body_contract",
  brokerKey: "broker_nilmorg_severance",
  name: "Prize-Body Delivery (Highest Tier)",
  loreContext:
    "The canonical Severance Prize. Nilmorg keeps his agreement. You " +
    "deliver the prize-body. You receive what was paid. Don't thank " +
    "him. The companion is delivered, not given.",
  stages: [
    {
      stageId: "extraction_witnessed",
      label: "Witness the extraction",
      loreContext:
        "Be present at Nilmorg's platform for the canonical extraction " +
        "ceremony. The racing clone smiles — they earned this. The orb " +
        "is golden. The container seals.",
      requiredMissionIds: ["nilmorg.witness_extraction"],
      objective: "witness Severance Prize extraction (player must be on platform)",
      rewards: { credits: 1000, influence: 40 },
    },
    {
      stageId: "container_transit",
      label: "Container transit",
      loreContext:
        "The sealed container travels to the destination sector. You " +
        "transport. The container does not open in transit.",
      requiredMissionIds: ["nilmorg.transport_sealed_container"],
      objective: "transport sealed Severance container to destination",
      rewards: { credits: 1500, materials: 75 },
    },
    {
      stageId: "delivery_to_recipient",
      label: "Deliver to recipient",
      loreContext:
        "Deliver the container. The body grows. The companion awakens. " +
        "Nilmorg kept his agreement. The companion is canonically " +
        "delivered, not given.",
      requiredMissionIds: ["nilmorg.deliver_prize_body"],
      objective: "deliver Prize-Body to canonical recipient",
      rewards: {
        credits: 2500,
        influence: 100,
        cardIds: ["card.nilmorg.prize_seal"],
      },
      factionEffect: { factionId: "hierarchy", change: 15 },
    },
  ],
  cancellationCost: 2000,
  completionReward: {
    credits: 5000,
    influence: 200,
    cardIds: ["card.nilmorg.prize_seal_v2"],
    reputation: [{ factionId: "hierarchy", change: 30 }],
  },
  firstSigningFlag: "nilmorg_first_prize_contract_signed",
  minAct: 5,
  metadata: {
    tier: "severance_prime",
    canon: "Nilmorg bible §4.8 'Nilmorg kept his agreement' canonical line",
    canonicalRefusal: "Don't thank me.",
    bridge: "DMC severance_prize_paid ripple unlocks this contract",
    companionInheritance:
      "Companion canonically inherits 'Nilmorg kept his agreement' memory on delivery",
  },
};

// --- Aggregate -----------------------------------------------------------

export const NILMORG_CONTRACTS: ReadonlyArray<ContractDef> = [
  SEVERANCE_CLONE_BODY_CONTRACT,
  SEVERANCE_SIGNATURE_ARCHIVE_CONTRACT,
  SEVERANCE_PRIZE_BODY_CONTRACT,
];
