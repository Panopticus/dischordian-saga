/* ═══════════════════════════════════════════════════════
   SUIT ADAPTERS INDEX (plan §G.11)

   Per-mode translators from AggregatedBonus[] → mode-native
   modifier shapes. Every adapter is a pure function; none
   mutate the aggregator.
   ═══════════════════════════════════════════════════════ */

export { toFightingModifiers, type FightingModifiers } from "./fighting";
export { toPetBattleModifiers, type PetBattleModifiers } from "./petBattles";
export { toTcgPreMatchModifiers, type TcgPreMatchModifiers } from "./tcg";
export {
  toTradeEmpireDealModifiers,
  type TradeEmpireDealModifiers,
} from "./tradeEmpire";
export { toArkEventModifiers, type ArkEventModifiers } from "./arkEvents";
export { toCasinoModifiers, type CasinoModifiers } from "./casino";
export { toDiplomacyModifiers, type DiplomacyModifiers } from "./diplomacy";
export {
  toInfiltrationModifiers,
  hasInfiltrationSetBonus,
  type InfiltrationModifiers,
} from "./infiltration";
export { toChessModifiers, type ChessModifiers } from "./chess";
export { toFpsSuitBonuses, type FpsSuitBonuses } from "./fps";
export {
  mergeCircuitSuitBonuses,
  type CircuitPlayerClone,
} from "./deadMansCircuit";
export { toTerminusModifiers, type TerminusModifiers } from "./terminusSwarm";
