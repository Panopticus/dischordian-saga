/* ═══════════════════════════════════════════════════════
   RIDDLE COMMENTARY
   audit/16 PR 9 (Cluster Co2 — Conspiracy persona).

   Pre-audit, the riddle puzzles in PuzzleSystem.tsx had
   hardcoded answers that doubled as meta-textual confessions
   (the answer is the structural truth of the saga). Players
   who looked up the answers online could speedrun the
   meaning without earning the discovery — and the engine had
   no way to surface the meta-layer post-game.

   This module is the post-game commentary surface. After a
   riddle is solved, the player can re-open the puzzle from
   the Loredex Reconstruction tab and see the Editor / Author
   / NPC commentary on WHY that answer was chosen — the
   confession layered under the puzzle.

   Schema-only ship. The Reconstruction tab UI consumer is
   queued for the Cluster A Investigation Board PR; this
   module is the data substrate authors can extend today.
   ═══════════════════════════════════════════════════════ */

/** A "metariddle" is a riddle whose answer is itself a
 *  meta-textual claim about the saga (e.g. "what is in the
 *  pod that was never opened?" → "the second protagonist").
 *  Distinct from a regular riddle (whose answer is a thing,
 *  not a confession). */
export type MetariddleAttributor = "editor" | "author" | "elara" | "human" | "the_degen";

export interface RiddleCommentaryEntry {
  /** The puzzle id from PuzzleSystem's ROOM_PUZZLES. */
  puzzleId: string;
  /** Whether this riddle is a metariddle (carries a meta-
   *  textual confession). Pure metadata; the consumer can
   *  filter the Reconstruction tab to "metariddles only". */
  isMetariddle: boolean;
  /** Voice the commentary speaks in. */
  attributedTo: MetariddleAttributor;
  /** The post-game text. Reveals the structural truth the
   *  riddle answer points at. Not shown until the puzzle
   *  is solved. */
  commentary: string;
}

/** Seed entries. The audit'd intent is "exploitable" — the
 *  player should EARN the meta-layer, not stumble into it.
 *  Keep entries tied to puzzles that already exist in the
 *  saga; new authoring extends this list as new metariddles
 *  ship.
 *
 *  These are the four canonical metariddles called out in
 *  the audit/15 Conspiracy persona writeup. Authors extend
 *  by adding to this array; the Reconstruction tab walks
 *  the registry. */
export const RIDDLE_COMMENTARY: readonly RiddleCommentaryEntry[] = [
  {
    puzzleId: "bridge",
    isMetariddle: true,
    attributedTo: "editor",
    commentary:
      "The handshake was severed from the inside. The riddle wants you to find the " +
      "fragment from a dead body, but the truth the riddle is gesturing at is that " +
      "every clue you've found in this room has been mediated by someone who has " +
      "spent fourteen thousand edits making sure you'd find these clues and not the " +
      "other ones. The dead Potential isn't the obstacle. The Potential who wrote " +
      "down what to do with the dead Potential is the obstacle. You are not solving " +
      "this riddle. You are following an instruction set.",
  },
  {
    puzzleId: "med_bay",
    isMetariddle: true,
    attributedTo: "elara",
    commentary:
      "The data-slate fragment is what you needed to get into the Bridge. But the slate " +
      "wasn't supposed to be readable. The reason it IS readable — the reason the bio-" +
      "encryption decayed at exactly the right rate to be cracked by exactly the " +
      "instruments we have on board — is that someone planned for the player to be " +
      "able to follow this trail. You've been on rails since the cryo open. The rails " +
      "aren't bad. The rails are the only reason you're alive. Just don't pretend the " +
      "rails aren't there.",
  },
  {
    puzzleId: "antiquarian-library",
    isMetariddle: true,
    attributedTo: "author",
    commentary:
      "The Antiquarian's catalogue tells you which book to open. The book you open " +
      "tells you which other book to open. You are reading a recursive instruction. " +
      "The riddle's literal answer is the catalogue card number — but the meta- " +
      "answer is that the entire library is one nested instruction, and somewhere " +
      "inside the recursion there is a card that points at itself. That card is the " +
      "self-portrait. The self-portrait is the saga.",
  },
  {
    puzzleId: "cipher-den",
    isMetariddle: true,
    attributedTo: "the_degen",
    commentary:
      "The cipher is solvable. Of course it is. Every cipher in the Den is solvable. " +
      "The Den exists to make solvable things look impossible so the player feels " +
      "smart when they solve them. That's the whole pitch. The riddle's literal " +
      "answer is the cleartext. The meta-answer is that the Den is a confidence " +
      "machine — every solve dumps a measured serotonin payout into the player's " +
      "evening. We're not cheating. We're just transparent about the math.",
  },
];

/* ─── Pure helpers ─────────────────────────────────────── */

export function getCommentaryForPuzzle(
  puzzleId: string,
  registry: readonly RiddleCommentaryEntry[] = RIDDLE_COMMENTARY,
): RiddleCommentaryEntry | null {
  return registry.find((e) => e.puzzleId === puzzleId) ?? null;
}

export function getMetariddles(
  registry: readonly RiddleCommentaryEntry[] = RIDDLE_COMMENTARY,
): readonly RiddleCommentaryEntry[] {
  return registry.filter((e) => e.isMetariddle);
}
