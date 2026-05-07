/* DLC chapter system — public barrel.
 *
 * Foundation layer (Wave 2). The registry ships empty; chapters
 * land in subsequent waves under apps/shared/dlc/chapters/<id>/.
 * Consumers should import from here rather than the individual
 * modules. */

export type {
  DlcChapter,
  DlcChapterStatus,
  DlcParentSection,
  DlcPrerequisite,
  DlcRewardBundle,
  DlcStep,
  DlcStepChoice,
  DlcStepSpeakerId,
  DlcStoryEncounterRef,
  GalacticDanceFactionId,
} from "./types";

export {
  ALL_DLC_CHAPTERS,
  dlcChapterCompletionFlag,
  getDlcChapter,
  getDlcChaptersForSection,
  sameParentSection,
} from "./dlcChapterRegistry";

export {
  deriveDlcChapterStatus,
  getAvailableDlcChapters,
  isPrerequisiteMet,
  type DlcChapterGateInput,
} from "./dlcChapterCompletionGate";
