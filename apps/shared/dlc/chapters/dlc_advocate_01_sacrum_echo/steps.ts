/* Steps for `dlc_advocate_01_sacrum_echo`.
 *
 * Three narration beats from the Antiquarian opening the Sealed
 * Chronicle, one wheel-style choice on how to handle the first
 * Sacrum fragment, and a closing narration. The choice
 * branches into one of three flag outcomes that downstream
 * chapters can chain off via the `dlc_chapter_completion`
 * + `flag` prerequisite kinds.
 *
 * Lore source: docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md
 * §VI Part 2 — "Sacrum Acquisition Arc". The Antiquarian's
 * voice is the calibration register from §VI Part 5 (~25 minutes
 * of VO budget; these lines are the opening minute of that bank).
 */
import type { DlcStep } from "../../types";

export const DLC_ADVOCATE_01_STEPS: readonly DlcStep[] = [
  {
    kind: "narration",
    id: "open_chronicle",
    speaker: "antiquarian",
    text: "The Chronicle was always going to open at this page. I have re-shelved it nine times. The leather knows the angle of my hand by now.",
    subtitle: "The Antiquarian unlatches the seventh lock of the Sealed Chronicle.",
  },
  {
    kind: "narration",
    id: "name_the_sacrum",
    speaker: "antiquarian",
    text: "She called it the Sacrum of Severed Silk. The crew called it heresy. The Empire called it nothing — they had not yet learned the word for what she made. We have. We are the word.",
  },
  {
    kind: "narration",
    id: "first_fragment",
    speaker: "antiquarian",
    text: "And here, on the table between us, is a fragment. Cool to the touch. Older than the Empire that buried it. The shard sings, and you can hear it because the Authority Trial taught you to listen.",
    subtitle: "A loose page falls from the Chronicle. The shard is real.",
  },
  {
    kind: "choice",
    id: "fragment_choice",
    speaker: "antiquarian",
    prompt: "How do you carry the shard?",
    options: [
      {
        id: "preserve",
        text: "Cradle it. Catalog it. Add it to the Chronicle alongside her name.",
        setFlag: "advocate_sacrum_path_preserve",
      },
      {
        id: "weave",
        text: "Press it to your palm. Let it weave with you. Some part of her, carried.",
        setFlag: "advocate_sacrum_path_weave",
      },
      {
        id: "return",
        text: "Return it to the seventh chamber. The seal exists for reasons we did not write.",
        setFlag: "advocate_sacrum_path_return",
      },
    ],
  },
  {
    kind: "narration",
    id: "echo_preserve",
    speaker: "antiquarian",
    text: "Cataloged. Of course. You are a Chronicle person after all — you would rather the shard be true and kept than true and gone. Her name now has a fragment beside it in my hand. That is the oldest kind of grave: an accurate one.",
    subtitle: "The shard takes its place in the Chronicle, beside her name.",
    requiresFlag: "advocate_sacrum_path_preserve",
  },
  {
    kind: "narration",
    id: "echo_weave",
    speaker: "antiquarian",
    text: "You pressed it to your palm. I felt the room change temperature. Understand what you have done: you are no longer only carrying her record — you are carrying a part of her, and parts of her have opinions. Listen when the shard is quiet. That is when it is deciding.",
    subtitle: "The shard cools into the skin of your palm and is gone from the table.",
    requiresFlag: "advocate_sacrum_path_weave",
  },
  {
    kind: "narration",
    id: "echo_return",
    speaker: "antiquarian",
    text: "Back to the seventh chamber. The seal we did not write, honored by the one person in an Age who could have broken it. I will note the restraint. Most who reach the shard cannot put it down. You could. The Empire's regrets are safer for it — and so, I suspect, are you.",
    subtitle: "The seventh lock re-engages with a sound like an exhale.",
    requiresFlag: "advocate_sacrum_path_return",
  },
  {
    kind: "narration",
    id: "close_chronicle",
    speaker: "antiquarian",
    text: "Whichever way you carried it — that is your first answer. There will be more. The Chronicle has not run out of pages, and the Empire has not run out of regrets.",
    subtitle: "The Antiquarian closes the book. The seventh lock does not re-engage.",
  },
];
