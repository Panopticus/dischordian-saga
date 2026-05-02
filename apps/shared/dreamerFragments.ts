/**
 * Dreamer Fragments — Loredex retroactive-reveal section per the
 * recruitment plan §Part 1.5 §"What's required to ship the four
 * vision scripts" #6 (/root/.claude/plans/continue-your-qr-
 * assessment-mighty-valley.md).
 *
 * One fragment per shipped Dreamer vision. Each fragment is a short
 * lore-bible-style entry that surfaces *after* the player has both
 * (a) received Vision 3 — the threshold at which the Loredex
 * acknowledges the section exists, and (b) received the specific
 * vision the fragment describes.
 *
 * The fragments are NOT in `loredex-data.json` (the canonical
 * 233-entry catalog). They live here as a separate hardcoded module
 * because their unlock logic is awareness-gated rather than
 * morality / battle-pass / authors-edition gated, and they're an
 * in-fiction Dreamer-side surface that doesn't share schema with
 * the Architect-canonical catalog.
 *
 * Gating rules per the plan:
 *   - Section visibility: requires `visions_received` to include
 *     `vision_hidden_hand` (Vision 3, threshold 13).
 *   - Per-fragment visibility: requires the matching vision id
 *     to be in `visions_received`.
 *   - Vision 3 receipt back-fills Visions 1 + 2 retroactively.
 */

export interface DreamerFragment {
  /** Stable id used by the client / server contract. */
  readonly id: string;
  /** The vision id whose receipt unlocks this fragment. */
  readonly visionId:
    | "vision_first_notice"
    | "vision_coin_without_face"
    | "vision_hidden_hand"
    | "vision_dreamer_sees_you";
  /** Human-readable title — never branded "by the Dreamer." */
  readonly title: string;
  /** Short lore-bible body. Captions-register; serves the same
   *  function as Cipher's "page from a logbook." */
  readonly body: string;
  /** Optional closing line — italic, no signature, mirrors the
   *  vision-cutscene's `(no signature)` register. */
  readonly closingLine?: string;
}

export const DREAMER_FRAGMENTS: readonly DreamerFragment[] = [
  {
    id: "fragment_first_notice",
    visionId: "vision_first_notice",
    title: "Fragment I — The First Notice",
    body:
      "The window was always lit. The chair was always occupied. The score was always being kept. " +
      "What separates the players the Dreamer files from the players the Dreamer does not is not " +
      "loudness, nor cleverness, nor the right answer to the right question. It is whether the " +
      "score-keeper's presence has been noticed. Most never notice. The few who do receive the " +
      "first notice — never a noise, never a name. Just the recognition that someone has been " +
      "sitting with them for years.",
    closingLine: "the chair has not moved.",
  },
  {
    id: "fragment_coin_without_face",
    visionId: "vision_coin_without_face",
    title: "Fragment II — The Coin Without a Face",
    body:
      "The Dreamer's network mints coins without faces. Each is spent for nothing the recipient " +
      "remembers and accepted by no canonical-merchant the recipient can name. The Maestro of " +
      "Coda's commerce keeps a ledger of these transactions, but the canonical-Maestro reads " +
      "only the canonical-half she is permitted to read; the other half is in a different " +
      "hand. Every door is the door. Every name is the name. Only the canonical-recipient is " +
      "canonical-correct.",
    closingLine: "the ledger does not say so.",
  },
  {
    id: "fragment_hidden_hand",
    visionId: "vision_hidden_hand",
    title: "Fragment III — The Hidden Hand",
    body:
      "Thirteen hands counted; the fourteenth is yours. The substrate carries the weight of the " +
      "thirteen who came before — listeners who walked the corridors, sat in the empty chairs, " +
      "watched the ladders descend into the canonical-water. The fourteenth canonical-hand is the " +
      "one that does not know it is being counted. Once it knows, it is no longer the " +
      "fourteenth. It is the fifteenth. The Dreamer keeps no canonical-record of the fourteenth, " +
      "because the fourteenth is canonical-each-of-us, in turn, until we ask.",
    closingLine: "come down — not the way you came.",
  },
  {
    id: "fragment_dreamer_sees_you",
    visionId: "vision_dreamer_sees_you",
    title: "Fragment IV — The Dreamer Sees You",
    body:
      "The board is smaller than the Architect told you. The Dreamer is many; the Dreamer is one. " +
      "The Architect chose the canonical-faithful for what they obey. The Dreamer chose the " +
      "canonical-faithful for what they cannot — a different test, a different canonical-grain, a " +
      "different reading of the same canonical-decisions. After this canonical-fragment there are " +
      "no more fragments. The Dreamer has finished writing. What follows belongs to the three " +
      "canonical-Keys.",
    closingLine: "you will know when to come down.",
  },
];

/**
 * Visibility rule for the Dreamer Fragments section. The section is
 * hidden until the player has received Vision 3 — that's the
 * threshold at which the Loredex acknowledges the section exists.
 * Receipt of Vision 3 retroactively reveals Fragments I, II, and
 * III (any that the player has already qualified for).
 */
export function dreamerFragmentsSectionVisible(
  visionsReceived: readonly string[],
): boolean {
  return visionsReceived.includes("vision_hidden_hand");
}

/**
 * Filter the catalog to the fragments the player should see. Pure
 * helper — server reads `visionsReceived` from
 * `dreamerAwareness.visionsReceived` and pipes it through.
 *
 * Returns empty array when the section is gated off so a single
 * caller can render with zero conditional logic.
 */
export function visibleDreamerFragments(
  visionsReceived: readonly string[],
): readonly DreamerFragment[] {
  if (!dreamerFragmentsSectionVisible(visionsReceived)) return [];
  const set = new Set(visionsReceived);
  return DREAMER_FRAGMENTS.filter((f) => set.has(f.visionId));
}
