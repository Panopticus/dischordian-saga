/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Module barrel

   Public surface of the Wolf-Anara solo hunt arc module.
   External callers (server router, client overlay,
   Living Universe hooks) import from this file.
   ═══════════════════════════════════════════════════════ */

export type { HeroClass } from "./types/HeroClass";
export { HERO_CLASSES } from "./types/HeroClass";

export type { CrucibleRegion } from "./types/CrucibleRegion";
export { CRUCIBLE_REGIONS } from "./types/CrucibleRegion";

export type { PowerNode } from "./types/PowerNode";

export type {
  HeroTarget,
  CoreHierarchyLordId,
  ThreatTier,
} from "./types/HeroTarget";
export { CORE_HIERARCHY_LORD_IDS } from "./types/HeroTarget";

export {
  ALL_HERO_TARGETS,
  HERO_TARGET_FULL_MATRIX_COUNT,
  HERO_TARGET_LIEUTENANT_COUNT,
  getHeroTarget,
  getLieutenants,
  getHeroesByLord,
  getLordCohortSizes,
} from "./heroTargets/index";

export { heroTargetSchema } from "./heroTargets/schema";
export type { ValidatedHeroTarget } from "./heroTargets/schema";

export {
  briefMission,
  type AntiquarianBriefing,
  type LeagueState,
} from "./antiquarianBriefer";

export {
  WOLF_HUNT_ARC_AVAILABLE_FLAG,
  WOLF_HUNT_PAUSED_AT_TARGET_FLAG_PREFIX,
  WOLF_HUNT_LYCOS_FIRST_DEATH_FLAG,
  WOLF_HUNT_LYCOS_RESURRECTED_FIRST_TIME_FLAG,
  WOLF_HUNT_ARC_COMPLETE_TRIGGER_FLAG,
  WOLF_HUNT_ARC_FAILURE_TRIGGER_FLAG,
  lieutenantDefeatedFlag,
  lordFullyHarvestedFlag,
  killsCountFlag,
} from "./flags";

export {
  emptyMissionState,
  type WolfHuntMissionState,
  type MissionStep,
  type MissionOutcome,
  type MissionChoiceLogEntry,
  type ApproachChoiceKey,
  type EngagementChoiceKey,
} from "./missionState";

export {
  reduceMission,
  type WolfHuntAction,
  type ReducerContext,
  type ReducerResult,
  type ReducerEffect,
  type WolfHuntEventKind,
} from "./missionReducer";

export {
  rollLycosDeath,
  computeDeathProbability,
  deathRollSeed,
  type DeathRollResult,
  type DeathRollContext,
} from "./lycosDeathRoll";

export {
  emptyBossState,
  reduceBossFight,
  WOLF_CARD_DEFS,
  DEFENDER_CARD_DEFS,
  type BossState,
  type BossAction,
  type BossOutcome,
  type WolfCardId,
  type DefenderCardId,
} from "./bossFight/index";

export {
  eventsFromMission,
  emptyCrucibleMeters,
  applyEventsToMeters,
  isGoodEndingReached,
  isBadEndingReached,
  type WolfHuntLivingEvent,
  type WolfHuntLivingEventKind,
  type CrucibleMeters,
} from "./livingUniverseHooks";

export {
  getPowerLibraryEntry,
  getPowersForClass,
  powerLibraryIds,
  type PowerLibraryEntry,
} from "./powerLibrary";
