/**
 * STRAND CONTRACTS (Async Player Requests)
 * ══════════════════════════════════════════════════════════
 * Players post resource requests that other players fulfill
 * asynchronously. Both sides benefit — the requester gets
 * resources, the fulfiller earns Connector reputation and
 * marketplace discounts.
 *
 * RPG IMPACT:
 * - Both players get a small trust boost with the room's NPC on fulfillment
 * - Connector tiers unlock marketplace discounts (5%–20%)
 * - High-tier Connectors earn exclusive titles and cosmetics
 *
 * LORE: "The Arks were designed to drift alone. Every
 * connection you forge defies that design."
 */

/* ─── TYPES ─── */

export type ContractResourceType =
  | "salvage"
  | "dream"
  | "void_crystals"
  | "influence"
  | "cards"
  | "materials";

export type ContractStatus = "open" | "fulfilled" | "expired";

export interface StrandContract {
  id: string;
  requesterId: string;
  type: ContractResourceType;
  amountRequested: number;
  offering: { type: string; amount: number };
  status: ContractStatus;
  createdAt: number;
  expiresAt: number;
  fulfilledBy?: string;
  fulfilledAt?: number;
}

export interface ContractFilters {
  type?: ContractResourceType;
  minAmount?: number;
  maxAmount?: number;
  excludeRequesterId?: string;
}

/* ─── CONNECTOR REPUTATION TIERS ─── */

export interface ConnectorTier {
  tier: number;
  name: string;
  minFulfilled: number;
  bonus: string;
}

export const CONNECTOR_TIERS: ConnectorTier[] = [
  { tier: 0, name: "Stranger", minFulfilled: 0, bonus: "" },
  { tier: 1, name: "Helper", minFulfilled: 5, bonus: "+5% marketplace discount" },
  { tier: 2, name: "Connector", minFulfilled: 20, bonus: "+10% marketplace discount, Connector badge" },
  { tier: 3, name: "Bridge Builder", minFulfilled: 50, bonus: "+15% discount, Bridge Builder title, unique cosmetic" },
  { tier: 4, name: "Strand Weaver", minFulfilled: 100, bonus: "+20% discount, Strand Weaver title, exclusive aura cosmetic" },
];

/* ─── CONSTANTS ─── */

/** Maximum active (open) contracts per player */
export const MAX_ACTIVE_CONTRACTS = 3;

/** Contract expiry window (48 hours in ms) */
export const CONTRACT_EXPIRY_MS = 48 * 60 * 60 * 1000;

/** Trust bonus granted to both players when a contract is fulfilled */
export const FULFILLMENT_TRUST_BONUS = 2;

/** Marketplace discount percentages per Connector tier */
export const TIER_DISCOUNTS: Record<number, number> = {
  0: 0,
  1: 0.05,
  2: 0.10,
  3: 0.15,
  4: 0.20,
};

/** Display labels for resource types */
export const RESOURCE_TYPE_LABELS: Record<ContractResourceType, string> = {
  salvage: "Salvage",
  dream: "Dream",
  void_crystals: "Void Crystals",
  influence: "Influence",
  cards: "Cards",
  materials: "Materials",
};

/* ─── CORE FUNCTIONS ─── */

/**
 * Create a new strand contract. Validates that the player hasn't exceeded
 * the active contract limit. Returns the new contract or an error.
 */
export function createContract(
  requesterId: string,
  type: ContractResourceType,
  amount: number,
  offering: { type: string; amount: number },
  activeContracts: StrandContract[],
): { contract: StrandContract | null; error?: string } {
  const playerActive = activeContracts.filter(
    c => c.requesterId === requesterId && c.status === "open",
  );

  if (playerActive.length >= MAX_ACTIVE_CONTRACTS) {
    return {
      contract: null,
      error: `Maximum ${MAX_ACTIVE_CONTRACTS} active contracts allowed. Complete or wait for existing contracts to expire.`,
    };
  }

  if (amount <= 0) {
    return { contract: null, error: "Requested amount must be greater than zero." };
  }

  if (offering.amount <= 0) {
    return { contract: null, error: "Offering amount must be greater than zero." };
  }

  const now = Date.now();
  const contract: StrandContract = {
    id: `strand_${now}_${Math.random().toString(36).slice(2, 9)}`,
    requesterId,
    type,
    amountRequested: amount,
    offering,
    status: "open",
    createdAt: now,
    expiresAt: now + CONTRACT_EXPIRY_MS,
  };

  return { contract };
}

/**
 * Fulfill a strand contract. Validates the contract is still open and
 * the fulfiller isn't the requester. Returns updated contract and the
 * trust bonus that should be applied.
 */
export function fulfillContract(
  contract: StrandContract,
  fulfillerId: string,
): { contract: StrandContract | null; trustBonus: number; error?: string } {
  if (contract.status !== "open") {
    return { contract: null, trustBonus: 0, error: "This contract is no longer open." };
  }

  if (Date.now() > contract.expiresAt) {
    return { contract: null, trustBonus: 0, error: "This contract has expired." };
  }

  if (contract.requesterId === fulfillerId) {
    return { contract: null, trustBonus: 0, error: "You cannot fulfill your own contract." };
  }

  const fulfilled: StrandContract = {
    ...contract,
    status: "fulfilled",
    fulfilledBy: fulfillerId,
    fulfilledAt: Date.now(),
  };

  return { contract: fulfilled, trustBonus: FULFILLMENT_TRUST_BONUS };
}

/**
 * Get open contracts matching optional filters.
 * Filters out expired contracts automatically.
 */
export function getOpenContracts(
  allContracts: StrandContract[],
  filters?: ContractFilters,
): StrandContract[] {
  const now = Date.now();

  return allContracts.filter(c => {
    if (c.status !== "open") return false;
    if (c.expiresAt <= now) return false;
    if (filters?.type && c.type !== filters.type) return false;
    if (filters?.minAmount && c.amountRequested < filters.minAmount) return false;
    if (filters?.maxAmount && c.amountRequested > filters.maxAmount) return false;
    if (filters?.excludeRequesterId && c.requesterId === filters.excludeRequesterId) return false;
    return true;
  });
}

/**
 * Get the Connector tier for a player based on how many contracts they've fulfilled.
 */
export function getConnectorTier(fulfilled: number): ConnectorTier {
  for (let i = CONNECTOR_TIERS.length - 1; i >= 0; i--) {
    if (fulfilled >= CONNECTOR_TIERS[i].minFulfilled) {
      return CONNECTOR_TIERS[i];
    }
  }
  return CONNECTOR_TIERS[0];
}

/**
 * Get the next Connector tier and how many more fulfillments are needed.
 * Returns null if the player is at max tier.
 */
export function getNextConnectorTier(fulfilled: number): {
  nextTier: ConnectorTier;
  remaining: number;
} | null {
  const current = getConnectorTier(fulfilled);
  const next = CONNECTOR_TIERS.find(t => t.tier === current.tier + 1);
  if (!next) return null;
  return { nextTier: next, remaining: next.minFulfilled - fulfilled };
}

/**
 * Get the marketplace discount for a player based on their Connector tier.
 */
export function getMarketplaceDiscount(fulfilled: number): number {
  const tier = getConnectorTier(fulfilled);
  return TIER_DISCOUNTS[tier.tier] || 0;
}

/**
 * Expire contracts that have passed their expiry time.
 * Returns the list of newly expired contracts.
 */
export function expireContracts(contracts: StrandContract[]): StrandContract[] {
  const now = Date.now();
  const expired: StrandContract[] = [];

  for (const contract of contracts) {
    if (contract.status === "open" && contract.expiresAt <= now) {
      contract.status = "expired";
      expired.push(contract);
    }
  }

  return expired;
}

/**
 * Get a summary of a player's contract activity.
 */
export function getPlayerContractSummary(
  allContracts: StrandContract[],
  playerId: string,
): {
  activeRequests: number;
  totalRequested: number;
  totalFulfilled: number;
  tier: ConnectorTier;
  discount: number;
} {
  const requested = allContracts.filter(c => c.requesterId === playerId);
  const fulfilled = allContracts.filter(c => c.fulfilledBy === playerId && c.status === "fulfilled");
  const active = requested.filter(c => c.status === "open" && c.expiresAt > Date.now());
  const tier = getConnectorTier(fulfilled.length);

  return {
    activeRequests: active.length,
    totalRequested: requested.length,
    totalFulfilled: fulfilled.length,
    tier,
    discount: TIER_DISCOUNTS[tier.tier] || 0,
  };
}

/**
 * Format a contract for display in the UI.
 */
export function formatContractForDisplay(contract: StrandContract): {
  resourceLabel: string;
  amountRequested: number;
  offeringLabel: string;
  status: ContractStatus;
  remainingHours: number;
} {
  const remaining = Math.max(0, contract.expiresAt - Date.now());
  const remainingHours = Math.round(remaining / (60 * 60 * 1000));

  return {
    resourceLabel: RESOURCE_TYPE_LABELS[contract.type],
    amountRequested: contract.amountRequested,
    offeringLabel: `${contract.offering.amount} ${contract.offering.type}`,
    status: contract.status,
    remainingHours,
  };
}
