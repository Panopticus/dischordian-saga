/**
 * Completeness gate — registry.
 *
 * Add subsystems here as their parity checks land. The harness
 * (`scripts/ship-check.ts`) iterates this list and the matching vitest
 * suite (`apps/shared/_completeness/registry.test.ts`) keeps the entries
 * well-formed.
 *
 * Each entry's `check` function does its own scanning and returns a
 * {@link RawParityCount}. The harness folds in PASS/FAIL/RATCHET status
 * from the count and the entry's ratchet config — check functions do
 * NOT compute their own status.
 */
import type { CompletenessEntry } from "./types";
import { checkEffectOpCoverage } from "./checks/effectOpCoverage";
import { checkConditionKindCoverage } from "./checks/conditionKindCoverage";
import { checkTriggerKindCoverage } from "./checks/triggerKindCoverage";
import { checkKeywordBehaviorCoverage } from "./checks/keywordBehaviorCoverage";
import { checkUnlockConditionUICoverage } from "./checks/unlockConditionUICoverage";
import { checkCardStatBudgetCoverage } from "./checks/cardStatBudgetCoverage";

export const COMPLETENESS_REGISTRY: ReadonlyArray<CompletenessEntry> = [
  // ─── Card engine ──────────────────────────────────────────
  {
    id: "tcg.effect_op_coverage",
    name: "effect.op handlers",
    description:
      "Every Effect op declared in apps/shared/tcg-core/types/Effect.ts has a `case` branch in engine/effectInterpreter.ts.",
    check: () => checkEffectOpCoverage(),
  },
  {
    id: "tcg.condition_kind_coverage",
    name: "Condition.kind handlers",
    description:
      "Every Condition kind declared in Effect.ts has a `case` branch in engine/conditions.ts.",
    check: () => checkConditionKindCoverage(),
  },
  {
    id: "tcg.trigger_kind_coverage",
    name: "Trigger.kind dispatchers",
    description:
      "Every Trigger kind declared in apps/shared/tcg-core/types/Trigger.ts has at least one `trigger.kind === \"<kind>\"` dispatch site in the engine.",
    check: () => checkTriggerKindCoverage(),
    // Ratcheted during Part B rollout. End state is hard parity
    // (gap === 0 → PASS). Removing the ratchet config is the final
    // step of the Part B work, after passive_aura's continuous-
    // evaluation pass lands.
    ratchet: { target: 0 },
  },
  {
    id: "tcg.keyword_behavior_coverage",
    name: "Keyword combat behaviors",
    description:
      "Every keyword in the Keyword union (Card.ts) is queried by at least one engine source file. Exempt keywords are listed in checks/keywordBehaviorCoverage.ts with a documented reason.",
    check: () => checkKeywordBehaviorCoverage(),
    // Ratcheted during Part B rollout. drain ships first (canonical
    // dead-keyword case); the ~11 other unimplemented keywords get
    // triaged one-by-one — either implemented or moved to the
    // KEYWORD_BEHAVIOR_EXEMPT allowlist with a documented reason.
    ratchet: { target: 0 },
  },
  {
    id: "tcg.unlock_condition_ui_coverage",
    name: "CardUnlockCondition UI surfaces",
    description:
      "Every CardUnlockCondition kind is named as a string literal somewhere in apps/client/src/ — proves the player can see why a card unlocked.",
    check: () => checkUnlockConditionUICoverage(),
    // founding_author and authors_edition currently have no UI;
    // closed in Part E (mobile / collection surface) but the row
    // sits visible until then.
    ratchet: { target: 0 },
  },
  {
    id: "tcg.card_stat_budget_coverage",
    name: "Card stat-budget compliance",
    description:
      "Every unit/structure card is either within the per-cost tolerance window from balance/statCurve.ts OR carries an explicit `balanceException: { reason, reviewer }`. Off-curve cards without an exception are silent power-curve outliers.",
    check: () => checkCardStatBudgetCoverage(),
    // Existing card pool has known outliers (the OVER/UNDER lines
    // already printed by balance/balanceAudit.ts). Ratcheted at
    // landing; tightens as designers either rebalance or add
    // documented exceptions.
    ratchet: { target: 0 },
  },
];
