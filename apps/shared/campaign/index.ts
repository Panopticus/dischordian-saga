/**
 * Campaign / narrative-spine subsystem — public surface.
 *
 * Phase 1 ships the additive substrate for the
 * "cards as narrative spine" plan
 * (/root/.claude/plans/analyze-dischordia-as-a-eventual-pixel.md):
 *
 *   • `actManifest.ts`            — declarative per-act surface model
 *   • `choiceOutcomeRegistry.ts`  — typed catalogue of dialog-choice outcomes
 *   • `applyDialogChoice.ts`      — pure resolver, choice → OutcomeBundle
 *   • `dispatchOutcomeBundle.ts`  — effect dispatcher with injected writers
 *
 * Consumers (server routers, client dialog runners, tests) should
 * import from this barrel rather than the underlying modules so the
 * internal layout can evolve without breaking callers.
 */

export {
  ACT_IDS,
  listManifestOpponents,
  manifestHasBattles,
  type ActId,
  type ActManifest,
  type ActOpponent,
  type ActSurface,
  type ActSurfaceBranching,
  type ActSurfaceInterlude,
  type ActSurfaceLadder,
  type ActSurfaceMode,
  type ActSurfaceSingle,
} from "./actManifest";

export {
  CHOICE_OUTCOME_REGISTRY,
  getChoiceOutcome,
  listChoiceOutcomes,
  listChoiceOutcomesByKind,
  listChoiceOutcomesByOwner,
  listOutcomeCardDefIds,
  listOutcomeFlags,
  validateChoiceOutcomeEntry,
  type ChoiceOutcomeEntry,
  type ChoiceOutcomeKind,
} from "./choiceOutcomeRegistry";

export {
  applyDialogChoiceOutcomes,
  bundleHasEffects,
  describeBundle,
  type AxisWrite,
  type CardUnlockWrite,
  type DeckMutationWrite,
  type FactionRepWrite,
  type FlagWrite,
  type OutcomeBundle,
  type StakesWrite,
  type TrustWrite,
} from "./applyDialogChoice";

export {
  dispatchOutcomeBundle,
  type OutcomeDispatchContext,
  type OutcomeDispatchResult,
} from "./dispatchOutcomeBundle";
