// apps/shared/tradeEmpire/contractTemplates/index.ts
//
// Contract template registry — aggregates all per-broker contract
// definitions into a single lookup. Per Phase 2: 6 contracts shipped
// across 2 brokers (Locke + Nilmorg); remaining 4 brokers' contracts
// are Phase 3 authoring scope.

import type { ContractDef } from "../contracts";
import type { BrokerKey } from "../brokers";
import { LOCKE_CONTRACTS } from "./locke";
import { NILMORG_CONTRACTS } from "./nilmorg";

export const ALL_CONTRACT_TEMPLATES: ReadonlyArray<ContractDef> = [
  ...LOCKE_CONTRACTS,
  ...NILMORG_CONTRACTS,
];

/** Resolve a contract template by its canonical key. */
export function getContractTemplate(contractKey: string): ContractDef | undefined {
  return ALL_CONTRACT_TEMPLATES.find(c => c.contractKey === contractKey);
}

/** All contracts offered by a single broker. */
export function contractsByBroker(brokerKey: BrokerKey): ReadonlyArray<ContractDef> {
  return ALL_CONTRACT_TEMPLATES.filter(c => c.brokerKey === brokerKey);
}

/** All contract keys (useful for lint enumeration). */
export function allContractKeys(): ReadonlyArray<string> {
  return ALL_CONTRACT_TEMPLATES.map(c => c.contractKey);
}

export { LOCKE_CONTRACTS, NILMORG_CONTRACTS };
