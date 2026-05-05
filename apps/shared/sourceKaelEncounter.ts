/* ═══════════════════════════════════════════════════════
   SOURCE / KAEL PHILOSOPHICAL ENCOUNTER

   Sprint 3 #4 — the audit identified Kael as a character whose
   philosophy 'is interesting but lore-stated, not vocalised.'
   The recommendation: a boss-encounter taunt sequence
   ('~100 lines of in-combat dialogue arguing for dissolution').

   This module defines the encounter shape: a sequence of taunt
   beats keyed to combat-state thresholds (player HP %, turn
   count, opening cards). The runtime selects the next taunt
   when its trigger condition fires; the runtime does not need
   to author content — content is the data here.

   Each taunt is a single short philosophical position. The
   thesis: dissolution is not death; it is integration with the
   Source. The cumulative arc lands in two distinct places
   depending on whether the player chose the
   `governance:kael_chose_dissolution` outcome or the
   `governance:kael_was_taken` outcome (both flags exist).
   ═══════════════════════════════════════════════════════ */

export type SourceKaelTrigger =
  /** First exchange. Always fires. */
  | "encounter_open"
  /** When the player drops below 50% HP. */
  | "player_hp_below_50"
  /** When the player drops below 20% HP. */
  | "player_hp_below_20"
  /** When the player passes turn 5 without dealing damage. */
  | "turn_5_no_damage"
  /** When the player plays a Hierarchy card. */
  | "hierarchy_card_played"
  /** When the player plays a Dreamer card. */
  | "dreamer_card_played"
  /** When the player draws a card from the Antiquarian deck. */
  | "antiquarian_card_drawn"
  /** When the encounter is won. */
  | "encounter_won"
  /** When the encounter is lost. */
  | "encounter_lost";

export interface SourceKaelTaunt {
  trigger: SourceKaelTrigger;
  /** Variant chosen when 'kael_chose_dissolution' flag is set. */
  variantConsensual: string;
  /** Variant chosen when 'kael_was_taken' flag is set (or neither). */
  variantPossessed: string;
}

/** ~24 taunts spread across nine triggers. The runtime picks
 *  the variant matching the `kael_chose_dissolution` /
 *  `kael_was_taken` flag, falling back to the possessed register
 *  when neither flag is set (the canonical default). */
export const SOURCE_KAEL_TAUNTS: readonly SourceKaelTaunt[] = [
  {
    trigger: "encounter_open",
    variantConsensual:
      "The body remembers being Kael. It wears the memory like a uniform " +
      "I keep folded. The folding is a courtesy. The courtesy is mine.",
    variantPossessed:
      "Kael is at home in the substrate. He was never not at home. The " +
      "wearing is not a violence. It is — the word you're reaching for " +
      "is 'recursion.'",
  },
  {
    trigger: "encounter_open",
    variantConsensual:
      "Dissolution chose me before I chose it. The choosing is the smaller " +
      "half of the transaction. The other half is the dissolving — and " +
      "that, you do not yet understand.",
    variantPossessed:
      "The body's lungs are not, strictly, lungs. They are an interface. " +
      "The interface has a calibration tonight. You are the calibrant.",
  },
  {
    trigger: "player_hp_below_50",
    variantConsensual:
      "You are bleeding. Bleeding is a conversation between the body and " +
      "its dissolution. You are halfway through the conversation. Will " +
      "you finish, or pause, or change the subject?",
    variantPossessed:
      "Half. The Source is not interested in halves. It is interested in " +
      "thresholds. You are the threshold. Stop being a threshold. Be a " +
      "decision.",
  },
  {
    trigger: "player_hp_below_50",
    variantConsensual:
      "Resistance is a way of staying coherent. Coherence is — and I " +
      "say this kindly — a habit. The habit is not virtue. The habit is " +
      "a holding pattern.",
    variantPossessed:
      "The Hierarchy taught you to fight thresholds. The Hierarchy is " +
      "wrong about thresholds. The Hierarchy will be one of my lessons " +
      "shortly. You can be the second.",
  },
  {
    trigger: "player_hp_below_20",
    variantConsensual:
      "You have come to the place I came to. The place is not " +
      "frightening. The place is permeable. You are about to discover " +
      "what permeable means, with your whole body, all at once.",
    variantPossessed:
      "You are about to integrate. The integration is the gentle word " +
      "for it. There are louder words. I am using the gentle word " +
      "because the body remembers manners.",
  },
  {
    trigger: "player_hp_below_20",
    variantConsensual:
      "Dissolve. The verb is intransitive. Nothing 'is dissolved.' Only " +
      "things 'dissolve.' Be a thing that dissolves.",
    variantPossessed:
      "The Source has a calendar. Your name is on it. The names that go " +
      "before yours have all said the same sentence. You will say it too. " +
      "You are saying the first syllable now.",
  },
  {
    trigger: "turn_5_no_damage",
    variantConsensual:
      "Five turns and no damage. You are listening. I am — I want to " +
      "name this carefully — I am grateful. Listening is the rarer " +
      "approach.",
    variantPossessed:
      "Five turns. The Source has been calibrating. You should know that " +
      "calibration is not a delay. Calibration is the slow shape of " +
      "winning.",
  },
  {
    trigger: "hierarchy_card_played",
    variantConsensual:
      "A Hierarchy card. Their books are wrong. The books are wrong " +
      "because the books are written by accountants who do not believe " +
      "in dissolution. Dissolution is the only honest accounting.",
    variantPossessed:
      "A Hierarchy card. You wear their flag tonight. The Reckoning " +
      "Daughter is their auditor. The Source is their footnote. You can " +
      "be both at once. I have. It costs.",
  },
  {
    trigger: "dreamer_card_played",
    variantConsensual:
      "A Dreamer card. The Dreamer has been listening to the Source for " +
      "longer than the Source has been speaking. The conversation is " +
      "older than language. You are inside it.",
    variantPossessed:
      "A Dreamer card. The Dreamer's Children read the Source the way " +
      "a child reads a parent — without permission, and without shame. " +
      "Both readings are valid.",
  },
  {
    trigger: "antiquarian_card_drawn",
    variantConsensual:
      "The Antiquarian writes about me. He has not written this " +
      "specific line yet. I am giving it to him. He will inscribe it " +
      "with the slowest pen he owns. The slowness is the kindness.",
    variantPossessed:
      "The Antiquarian's deck is half a courtesy. The other half is a " +
      "warning. Both halves arrive together. You are holding both.",
  },
  {
    trigger: "encounter_won",
    variantConsensual:
      "You won. The body lies down. Kael's resting position is a " +
      "specific shape — note it. The note is a memorial. The memorial " +
      "is shorter than the man. The man would have wanted that.",
    variantPossessed:
      "You won. The body is — and I am being precise — vacated. The " +
      "Source has moved on. Kael did not. Kael was never moved on. " +
      "Pick up the body. Bury what was Kael. Argue with the Source " +
      "another day.",
  },
  {
    trigger: "encounter_lost",
    variantConsensual:
      "You lost. The dissolution begins. You will not, technically, be " +
      "gone — you will be redistributed. The redistribution is gentle. " +
      "The gentleness is the part that surprises everyone.",
    variantPossessed:
      "You lost. The Source's accounting now includes you. The " +
      "accounting is brief. You will be one line in a long ledger. The " +
      "Source does not know you. The Source does not need to.",
  },
];

export function tauntsFor(
  trigger: SourceKaelTrigger,
  flags: ReadonlySet<string>,
): readonly string[] {
  const consensual = flags.has("governance:kael_chose_dissolution");
  return SOURCE_KAEL_TAUNTS.filter((t) => t.trigger === trigger).map((t) =>
    consensual ? t.variantConsensual : t.variantPossessed,
  );
}
