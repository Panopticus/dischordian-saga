// apps/shared/tradeEmpire/contracts.ts
//
// Multi-stage Contracts — Phase 2 entity type.
//
// Currently shipped Trade Empire missions are atomic (dispatch → complete).
// Contracts wrap multiple Mission instances under a single agreement,
// supporting:
//   - Long-haul trade agreements (run the same route N times, escalating payout)
//   - Espionage with escalating demands across stages
//   - Rescue-extraction with time limits
//   - Faction-specific retainer agreements (Locke canon: retainer + %)
//   - Severance Prize ritual contracts (Nilmorg canon: institutional precision)
//
// Per Locke's bible §1.4: every contract has fine-print. Player can
// canonically audit hidden clauses on signing. The selector emits the
// canonical hidden-clause-revealed line if player audits.

import type { NpcKey } from "../npcs/types";
import type { BrokerKey } from "./brokers";

// --- Stage definition -----------------------------------------------------

export type ContractStageStatus =
  | "pending"
  | "active"
  | "succeeded"
  | "failed"
  | "skipped";

/**
 * One stage of a multi-stage contract. Each stage is a discrete objective;
 * stages may be sequential (default) or parallel (independent completion).
 */
export interface ContractStageDef {
  stageId: string;
  /** Human-readable label rendered in mission/contract UIs. */
  label: string;
  /** Lore context — multi-paragraph allowed. */
  loreContext: string;
  /** Mission ids that must canonically be completed for this stage. */
  requiredMissionIds: ReadonlyArray<string>;
  /**
   * Optional canonical objective specifications (free-form metadata).
   * Bible-canonical examples: "complete 5 trade runs to {sectorId}",
   * "deliver {cargoType} to {brokerKey}", "negotiate-without-violence".
   */
  objective?: string;
  /** Stage-completion rewards. */
  rewards?: ContractRewards;
  /**
   * Optional faction-effect on stage completion.
   * Some contracts canonically shift faction reputation per stage.
   */
  factionEffect?: { factionId: string; change: number };
}

// --- Hidden clauses (Locke canon §1.4) ------------------------------------

/**
 * Hidden clauses are bible-canonical features of any Locke-issued contract.
 * Other brokers may have them too (Antiquarian: attribution-recovery
 * conditions; Nilmorg: institutional surcharges). Players who audit on
 * signing canonically see them; players who don't canonically discover
 * them mid-execution.
 */
export interface ContractHiddenClause {
  clauseId: string;
  /** Short label rendered in the audit UI. */
  label: string;
  /** Long-form text revealed on audit / discovery. */
  text: string;
  /** When the clause activates. */
  triggers: ReadonlyArray<
    | "on_signing"               // Activates immediately
    | "on_first_stage_complete"  // Activates after stage 0 succeeds
    | "on_any_stage_failed"      // Activates if any stage fails
    | "on_full_completion"       // Activates only on full contract success
    | "on_breach"                // Activates if player breaks the contract
  >;
  /** Side-effect on activation. */
  effect: ContractClauseEffect;
}

export type ContractClauseEffect =
  | { kind: "trust_delta"; npcKey: NpcKey; delta: number }
  | { kind: "set_flag"; flag: string }
  | { kind: "set_public_flag"; flag: string }
  | { kind: "faction_reputation_delta"; factionId: string; delta: number }
  | { kind: "reward_modifier"; modifier: number /* multiplier, 1.0 = no change */ }
  | { kind: "lock_out_broker"; brokerKey: BrokerKey };

// --- Reward shape ---------------------------------------------------------

export interface ContractRewards {
  credits?: number;
  materials?: number;
  influence?: number;
  intelligence?: number;
  /** Reputation deltas per faction. */
  reputation?: ReadonlyArray<{ factionId: string; change: number }>;
  /** Card unlocks. */
  cardIds?: ReadonlyArray<string>;
  /** Tome / lore-codex unlocks. */
  tomeIds?: ReadonlyArray<string>;
}

// --- Contract definition --------------------------------------------------

export interface ContractDef {
  contractKey: string;
  /** Owning broker. */
  brokerKey: BrokerKey;
  /** Human-readable label. */
  name: string;
  /** Long-form lore context (renderable in audit UI). */
  loreContext: string;
  /** Stages, in canonical execution order. */
  stages: ReadonlyArray<ContractStageDef>;
  /** Stages run sequentially by default; set true for parallel execution. */
  parallelStages?: boolean;
  /** Hidden clauses bound to the contract. */
  hiddenClauses?: ReadonlyArray<ContractHiddenClause>;
  /** Cancellation cost (in credits). 0 = free cancel; high = canonical-trap. */
  cancellationCost?: number;
  /** Final reward on full completion (separate from per-stage rewards). */
  completionReward?: ContractRewards;
  /** Optional canonical first-signing flag. */
  firstSigningFlag?: string;
  /** Optional reveal-stage requirement (Hierophant post_arena, etc.). */
  requiresRevealStage?: string;
  /** Optional minimum saga act. */
  minAct?: number;
  /** Optional metadata (free-form bible-asserted fields). */
  metadata?: Readonly<Record<string, string>>;
}

// --- Helpers --------------------------------------------------------------

/**
 * Read all hidden clauses that activate at signing-time. UI surfaces these
 * in the audit modal when player chooses to audit before signing.
 */
export function clausesAtSigning(contract: ContractDef): ReadonlyArray<ContractHiddenClause> {
  return (contract.hiddenClauses ?? []).filter(c => c.triggers.includes("on_signing"));
}

/**
 * Read clauses that activate on contract breach.
 */
export function clausesOnBreach(contract: ContractDef): ReadonlyArray<ContractHiddenClause> {
  return (contract.hiddenClauses ?? []).filter(c => c.triggers.includes("on_breach"));
}

/**
 * Validate a contract definition. Returns array of error messages or empty
 * array if valid. Used by lint tests + load-time validation.
 */
export function validateContractDef(contract: ContractDef): ReadonlyArray<string> {
  const errors: string[] = [];
  if (contract.stages.length === 0) {
    errors.push(`${contract.contractKey}: contract has no stages`);
  }
  const seenStageIds = new Set<string>();
  for (const stage of contract.stages) {
    if (seenStageIds.has(stage.stageId)) {
      errors.push(`${contract.contractKey}: duplicate stageId ${stage.stageId}`);
    }
    seenStageIds.add(stage.stageId);
    if (stage.requiredMissionIds.length === 0 && !stage.objective) {
      // Stages with no required missions must have an objective string —
      // this distinguishes "signing-completes-the-stage" patterns (e.g.,
      // locke.exclusive_dealings.exclusivity_signed) from accidental empty
      // stages.
      errors.push(
        `${contract.contractKey}/${stage.stageId}: stage has no requiredMissionIds AND no objective`,
      );
    }
  }
  if (contract.hiddenClauses) {
    const seenClauseIds = new Set<string>();
    for (const clause of contract.hiddenClauses) {
      if (seenClauseIds.has(clause.clauseId)) {
        errors.push(`${contract.contractKey}: duplicate clauseId ${clause.clauseId}`);
      }
      seenClauseIds.add(clause.clauseId);
    }
  }
  return errors;
}
