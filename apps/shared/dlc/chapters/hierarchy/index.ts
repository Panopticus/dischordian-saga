/* Hierarchy ladder — DLC chapters wrapping the C-suite of the
 * Hierarchy of the Damned plus the Season-2 Yog-Nathal teaser.
 *
 * Five chapters chain in lore order:
 *   01 Xeth'Raal · Debt Collector       (Act 3)
 *   02 Riri'Ahlia / Malkia · Taskmaster (Act 4)
 *   03 Syl'Vex · Corruptor              (Act 5)
 *   04 Mol'Garath · Unmaker / Referee   (Act 6)
 *   05 Yog-Nathal · The Board (S2 hook) (spine complete)
 *
 * Each chapter except the first chains via
 *   { kind: "dlc_chapter_completion", chapterId: <prev> }
 * so the ladder is strictly ordered. */

import type { DlcChapter } from "../../types";

import { DLC_HIERARCHY_01_XETH_AUDIT } from "./xeth_audit";
import { DLC_HIERARCHY_02_TASKMASTER_REMEMBERED } from "./taskmaster_remembered";
import { DLC_HIERARCHY_03_SYLVEX_TEMPTATION } from "./sylvex_temptation";
import { DLC_HIERARCHY_04_MOLGARATH_LABYRINTH } from "./molgarath_labyrinth";
import { DLC_HIERARCHY_05_YOG_NATHAL_TEASER } from "./yog_nathal_teaser";

export {
  DLC_HIERARCHY_01_XETH_AUDIT,
  DLC_HIERARCHY_02_TASKMASTER_REMEMBERED,
  DLC_HIERARCHY_03_SYLVEX_TEMPTATION,
  DLC_HIERARCHY_04_MOLGARATH_LABYRINTH,
  DLC_HIERARCHY_05_YOG_NATHAL_TEASER,
};

export const ALL_HIERARCHY_DLC_CHAPTERS: readonly DlcChapter[] = Object.freeze([
  DLC_HIERARCHY_01_XETH_AUDIT,
  DLC_HIERARCHY_02_TASKMASTER_REMEMBERED,
  DLC_HIERARCHY_03_SYLVEX_TEMPTATION,
  DLC_HIERARCHY_04_MOLGARATH_LABYRINTH,
  DLC_HIERARCHY_05_YOG_NATHAL_TEASER,
] as DlcChapter[]);
