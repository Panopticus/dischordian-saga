/**
 * Card-unlock-condition display helpers.
 *
 * `apps/shared/tcg-core/types/Card.ts` defines `CardUnlockCondition`
 * as a discriminated union of unlock kinds. The deck-builder, pack
 * preview, and collection surfaces all need to render a player-
 * readable label and short description for whichever kind a card
 * carries. Centralising the copy here means:
 *
 *   1. Adding a new union variant requires touching exactly one
 *      file's switch. The exhaustiveness assertion below catches
 *      missing cases at typecheck time.
 *
 *   2. The ship:check `tcg.unlock_condition_ui_coverage` parity
 *      gate is satisfied — every kind appears as a string literal
 *      in `apps/client/src/`, proving the player can see the
 *      unlock path in some surface, not just deep in
 *      expansionUnlockService.
 */
import type { CardUnlockCondition } from "@shared/tcg-core/types/Card";

/**
 * One row of player-facing unlock copy.
 *
 *   `chip` — short label for a badge / chip (≤ 16 chars).
 *   `description` — full sentence shown in tooltips / detail panes.
 */
export interface UnlockConditionDisplay {
  readonly kind: CardUnlockCondition["kind"];
  readonly chip: string;
  readonly description: string;
}

export function getUnlockConditionDisplay(
  cond: CardUnlockCondition,
): UnlockConditionDisplay {
  switch (cond.kind) {
    case "act_completion":
      return {
        kind: "act_completion",
        chip: `Finish Act ${cond.act}`,
        description: `Unlocks once you complete Act ${cond.act} of the main story.`,
      };
    case "secret":
      return {
        kind: "secret",
        chip: `Act ${cond.act} secret`,
        description: `Hidden behind the secret-reveal path of Act ${cond.act}. Some choices and side conversations gate this one.`,
      };
    case "battle_pass":
      return {
        kind: "battle_pass",
        chip: `BP tier ${cond.tier}`,
        description: `Reaches you at battle-pass tier ${cond.tier}.`,
      };
    case "founding_author":
      return {
        kind: "founding_author",
        chip: "Founding Author",
        description:
          "Granted to founding-author entitlement holders. Earned during the original Saga launch window.",
      };
    case "authors_edition":
      return {
        kind: "authors_edition",
        chip: `Author's Ed. ${cond.season.toUpperCase()}`,
        description: `Included with the ${cond.season.toUpperCase()} Author's Edition. Direct purchase, not a progression unlock.`,
      };
    case "dlc_chapter_completion":
      return {
        kind: "dlc_chapter_completion",
        chip: `Finish DLC ${cond.chapterId}`,
        description: `Unlocks when you complete the "${cond.chapterId}" DLC chapter.`,
      };
    case "bloodline_threshold":
      return {
        kind: "bloodline_threshold",
        chip: `${cond.classification} gen ${cond.minGenerations}+`,
        description: `Unlocks once your ${cond.classification} bloodline reaches generation ${cond.minGenerations} or higher.`,
      };
  }
}

/**
 * All unlock kinds, exhaustively. Used by the small unit test that
 * pins this list against the union — adding a kind to the union
 * without updating this map fails typecheck via the switch above
 * AND fails the unit test loudly. Belt + suspenders.
 */
export const ALL_UNLOCK_KINDS: ReadonlyArray<CardUnlockCondition["kind"]> = [
  "act_completion",
  "secret",
  "battle_pass",
  "founding_author",
  "authors_edition",
  "dlc_chapter_completion",
  "bloodline_threshold",
];
