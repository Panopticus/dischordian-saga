/* dlc_hierarchy_05_yog_nathal_teaser — The Board Above the Hierarchy
 *
 * Terminal chapter of the Hierarchy ladder. Surfaces the
 * Season-2 horizon: Yog-Nathal — "The Board" — the entity above
 * Mol'Garath. Per Section 1B / Testament v2: "the Hierarchy is
 * its bacteria, not its servants."
 *
 * Pure narration. No choice. The teaser ships the lore, raises
 * the Season-2 hook flag, and ends. The full Yog-Nathal arc is
 * Season-2 content.
 *
 * Parent : hierarchy_arc · Sequence 5
 * Prereqs : Chapter 4 complete + narrative_spine_complete
 */
import type { DlcChapter } from "../../types";

export const DLC_HIERARCHY_05_YOG_NATHAL_TEASER: DlcChapter = {
  id: "dlc_hierarchy_05_yog_nathal_teaser",
  title: "The Board",
  synopsis:
    "There is an entity above the Hierarchy. Mol'Garath did not warn you about it because Mol'Garath does not warn. He just makes sure the door is unlocked when you are ready to walk through.",
  parentSection: { kind: "hierarchy_arc" },
  sequence: 5,
  prerequisites: [
    {
      kind: "dlc_chapter_completion",
      chapterId: "dlc_hierarchy_04_molgarath_labyrinth",
    },
    { kind: "flag", flag: "narrative_spine_complete" },
  ],
  steps: [
    {
      kind: "narration",
      id: "the_door",
      speaker: "antiquarian",
      text: "There is a door behind Mol'Garath's chair. You did not see it on the audience visit. He did not let you. Now you see it. He is not in the chair.",
      subtitle: "After the spine completes — the threshold to Season Two.",
    },
    {
      kind: "narration",
      id: "the_naming",
      speaker: "antiquarian",
      text: "The Hierarchy has a name for the thing on the other side. They do not say it aloud, because aloud has consequences. They write it: Yog-Nathal. They call it 'The Board.' They are wrong about both.",
    },
    {
      kind: "narration",
      id: "the_metaphor",
      speaker: "antiquarian",
      text: "I will tell you the metaphor I was given, and not whether it is true. The Hierarchy of the Damned is not Yog-Nathal's servant. The Hierarchy is its bacteria. Bacteria do not serve a body. They do not know there is a body. They live and die at scales the body considers weather.",
    },
    {
      kind: "narration",
      id: "the_witness",
      speaker: "antiquarian",
      text: "Every demon you have walked past in this saga — every COO, every SVP, every Director — has been weather. The thing that made the weather has not yet looked at you. When it does, you will know. Mol'Garath has been preparing you to know.",
    },
    {
      kind: "narration",
      id: "the_threshold",
      speaker: "antiquarian",
      text: "I close the Chronicle here. The next page is in another book, in another season, and the cover of that book has not yet been bound. We will read it together when it ships.",
      subtitle: "Season 2 hook raised. The teaser ends. The story does not.",
    },
  ],
  rewards: {
    xp: 250,
    soulBoundDream: 25,
    lightEnergyReward: 100,
    loredexEntries: [
      "entity_yog_nathal",
      "concept_the_board",
      "concept_hierarchy_as_bacteria",
    ],
    cosmeticIds: ["title_witness_of_the_hierarchy_ladder"],
  },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_hierarchy_05_yog_nathal_teaser_complete",
    "hierarchy_ladder_climbed",
    "yog_nathal_teaser_seen",
    "season_2_hook_raised",
  ],
};
