/* dlc_hierarchy_02_taskmaster_remembered — The Taskmaster Remembered
 *
 * Riri'Ahlia, COO Taskmaster. Born Malkia (NOT Malkia Ukweli the
 * Storyteller — a different soul whose name Riri'Ahlia took as a
 * trophy at her promotion). Kael's childhood friend. Fell at Nexon.
 * Mol'Garath promoted her, renamed her, and dressed the renaming
 * in a vow.
 *
 * Per Testament v2 §VI Part 2: Act 1 Beat H — "my pattern is in the
 * swarm" — was her promotion moment, hidden in plain sight.
 *
 * Parent : hierarchy_arc · Sequence 2
 * Prereqs : Chapter 1 complete + Act 4 complete
 */
import type { DlcChapter } from "../../types";

export const DLC_HIERARCHY_02_TASKMASTER_REMEMBERED: DlcChapter = {
  id: "dlc_hierarchy_02_taskmaster_remembered",
  title: "The Taskmaster Remembered",
  synopsis:
    "The COO writes the day's work order. The handwriting is one you have read before. Kael's childhood friend was named Malkia — and there are now two beings in the saga walking under that name.",
  parentSection: { kind: "hierarchy_arc" },
  sequence: 2,
  prerequisites: [
    {
      kind: "dlc_chapter_completion",
      chapterId: "dlc_hierarchy_01_xeth_audit",
    },
    { kind: "act_completion", act: 4 },
  ],
  steps: [
    {
      kind: "narration",
      id: "the_work_order",
      speaker: "antiquarian",
      text: "The Taskmaster's work order arrives every morning, in every Ark, in handwriting older than the Hierarchy. Today the handwriting is the same as a note Kael keeps folded inside a watchcase from before Nexon.",
      subtitle: "Riri'Ahlia, COO Taskmaster. Born Malkia. Fell at Nexon.",
    },
    {
      kind: "narration",
      id: "two_malkias",
      speaker: "antiquarian",
      text: "There are two beings walking under the name Malkia in this saga. The Storyteller is one. The Taskmaster is the other. Mol'Garath did not invent the duplication — he found it useful. He often does.",
    },
    {
      kind: "narration",
      id: "the_promotion",
      speaker: "antiquarian",
      text: "'My pattern is in the swarm.' She said it once, on a battlefield, with her best friend listening. The Hierarchy heard it as an audition. They were right. She was already auditioning, and she did not yet know.",
      subtitle: "Act 1 Beat H — the promotion moment, hidden in plain sight.",
    },
    {
      kind: "choice",
      id: "remember_or_unname",
      speaker: "antiquarian",
      prompt: "Tell Kael, or carry the recognition alone?",
      options: [
        {
          id: "tell_kael",
          text: "Tell Kael. He kept the watchcase for a reason. The grief belongs to him.",
          setFlag: "hierarchy_taskmaster_revealed_to_kael",
        },
        {
          id: "carry_alone",
          text: "Carry it alone. Some recognitions are not gifts you hand over.",
          setFlag: "hierarchy_taskmaster_carried_alone",
        },
        {
          id: "name_her_back",
          text: "Speak her old name aloud. See if any of her hears it.",
          setFlag: "hierarchy_taskmaster_old_name_spoken",
        },
      ],
    },
    {
      kind: "narration",
      id: "next_morning",
      speaker: "antiquarian",
      text: "Tomorrow's work order will arrive in the same handwriting. She will not change it. The handwriting is the only piece of her that is still, technically, hers.",
    },
  ],
  rewards: {
    xp: 80,
    soulBoundDream: 8,
    lightEnergyReward: 40,
    loredexEntries: ["entity_riri_ahlia", "concept_two_malkias"],
  },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_hierarchy_02_taskmaster_remembered_complete",
    "hierarchy_ladder_taskmaster_recognized",
    "two_malkias_distinguished",
  ],
};
