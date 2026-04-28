// apps/shared/tradeEmpire/contractTemplates/index.ts
//
// Contract template registry — aggregates all per-broker contract
// definitions into a single lookup. Phase 2 shipped 6 contracts across
// 2 brokers (Locke + Nilmorg); Phase 3 adds 15 more across the four
// remaining brokers (Degen, Antiquarian incl. Oracle futures sub-family,
// Independent, Thaloria).

import type { ContractDef } from "../contracts";
import type { BrokerKey } from "../brokers";
import { LOCKE_CONTRACTS } from "./locke";
import { NILMORG_CONTRACTS } from "./nilmorg";
import { DEGEN_CONTRACTS } from "./degen";
import { ANTIQUARIAN_CONTRACTS } from "./antiquarian";
import { INDEPENDENT_CONTRACTS } from "./independent";
import { THALORIA_CONTRACTS } from "./thaloria";

export const ALL_CONTRACT_TEMPLATES: ReadonlyArray<ContractDef> = [
  ...LOCKE_CONTRACTS,
  ...NILMORG_CONTRACTS,
  ...DEGEN_CONTRACTS,
  ...ANTIQUARIAN_CONTRACTS,
  ...INDEPENDENT_CONTRACTS,
  ...THALORIA_CONTRACTS,
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

export {
  LOCKE_CONTRACTS,
  NILMORG_CONTRACTS,
  DEGEN_CONTRACTS,
  ANTIQUARIAN_CONTRACTS,
  INDEPENDENT_CONTRACTS,
  THALORIA_CONTRACTS,
};
