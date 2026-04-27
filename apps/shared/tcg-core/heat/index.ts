/* Barrel export for the Heat (run-modifier) module (#1).
   Engine integration of the trigger hooks lands in a follow-up; this
   barrel is safe to import from the client (e.g. the heat selection
   UI) and from the server (e.g. saveReplay tagging the persisted
   match with its modifier set). */
export {
  HEAT_MODIFIERS,
  MAX_HEAT_LEVEL,
  MAX_MODIFIER_COST,
  getModifier,
  totalHeatCost,
  validateHeatConfig,
  modifiersUnlockedAtTier,
} from "./registry";
export type {
  Modifier,
  ModifierTrigger,
  ModifierCategory,
  HeatConfig,
  HeatValidationResult,
} from "./registry";
