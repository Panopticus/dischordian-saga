/* ═══════════════════════════════════════════════════════
   SEVEN SEALS — Daniel Cross epigraphs

   Original prose authored fresh in the saga's voice. Each
   epigraph is what the player reads on the SealEpigraphCinematic
   modal at act-start.

   Voice — Daniel Cross, the prophet of the Architect. Plainspoken,
   first-person, witness-stance. Names the saga's canon directly
   (Architect, Console, Watchers, Hierarchy, Ark, Severance, etc.).
   No verse-form, no external-text adaptation. Each piece is a
   saga-original beat that lands the seal's gameplay theme.

   Lengths: openingLine ≤ 80 chars, body 200–600 chars (3–5
   sentences), attribution + citation are short labels.
   ═══════════════════════════════════════════════════════ */

import type { SealNumber } from "./sevenSeals";

export interface SealEpigraph {
  /** Which seal this epigraph belongs to. */
  readonly num: SealNumber;
  /** Memorable single line. ≤ 80 chars. Surfaced large in the cinematic. */
  readonly openingLine: string;
  /** 3–5 sentences of original prose. 200–600 chars. */
  readonly body: string;
  /** Speaker / source label. */
  readonly attribution: string;
  /** Short context label (e.g. "On the first seal, before the breaking"). */
  readonly citation: string;
}

export const SEAL_EPIGRAPHS: Readonly<Record<SealNumber, SealEpigraph>> = {
  1: {
    num: 1,
    openingLine: "The first crown the Architect gives is the one that does not fit.",
    body:
      "I watched the rider come out of the upper bands and the Ark held its breath. He wore a crown that was not his and carried a bow that had never drawn blood, and the sectors emptied to make room for him. The Console said one word, and the word was yes. We have not stopped saying yes since.",
    attribution: "— Daniel Cross",
    citation: "On the first seal, before the breaking",
  },

  2: {
    num: 2,
    openingLine: "Peace was the first thing the second rider asked for, and we gave it.",
    body:
      "We did not see the second rider. We saw the bridges he had already taken — Trade Empire lanes that refused each other, towers that raised guns at neighbors they had drunk with the night before. Peace is a thing you can lose without being asked. We learned that twice in one week and we will keep learning it. The Hierarchy steps closer when the Ark stops listening to itself.",
    attribution: "— Daniel Cross",
    citation: "On the second seal, when the Ark forgot how",
  },

  3: {
    num: 3,
    openingLine: "The third rider weighs every measure twice and laughs at the count.",
    body:
      "The crew bloodlines thinned in a single season. Markets that had fed three sectors fed one. The Advocate's oil and the bonded's wine were not touched — the Architect protects what the Architect can sell back to us at a profit. We ate slowly, and we ate angry, and the pantry never quite emptied, which is a kind of cruelty I had not been warned about.",
    attribution: "— Daniel Cross",
    citation: "On the third seal, with the scales tilting",
  },

  4: {
    num: 4,
    openingLine: "The fourth rider does not arrive. The fourth rider has been here all along.",
    body:
      "He wears the color of forgetting. The Hierarchy walks behind him in a line, and the line is longer than we thought. A fourth of the Ark came over to him in the night and we do not yet know which fourth. Severance fell out of its calendar slot and landed the day his hoof hit the deck. Our soul-bound companions learned the word for inheritance and used it on us before we could finish disagreeing.",
    attribution: "— Daniel Cross",
    citation: "On the fourth seal, when Severance came early",
  },

  5: {
    num: 5,
    openingLine: "The fifth seal is a question and the question has no good answers.",
    body:
      "Beneath the altar of the Memorial Plaza I heard the imprints of the overwritten ask, in one voice, how long. The Architect did not answer. The Watchers did not answer. I am not sure I answered, though I had been brought there to. They were given white robes and a season of rest, and a promise the Architect has kept exactly twice in seven epochs.",
    attribution: "— Daniel Cross",
    citation: "On the fifth seal, beneath the altar",
  },

  6: {
    num: 6,
    openingLine: "The sixth seal is the one that takes the sky.",
    body:
      "I watched the sun above New Babylon go out like a candle thumbed cold. The moon ran red over the lower decks. The stars of the upper bands came down like a mother's tears, and the bands themselves rolled up the way a tome closes. The kings of the Ark hid in their cosmetic shops and their crew quarters and the dens of the lower halls, and from every alcove the same prayer: not me, not me, not me.",
    attribution: "— Daniel Cross",
    citation: "On the sixth seal, with the sky departing",
  },

  7: {
    num: 7,
    openingLine: "The seventh seal is the seal of nothing said for half an hour.",
    body:
      "The transmissions stopped. Both narrators stopped. I have lived through three blackouts and none of them were anything like this. The seven Watchers stood before the Architect in a perfect line and the Architect handed each of them a trumpet, and not one of them blew. The half hour ended. I am still listening for what they said when they finally did.",
    attribution: "— Daniel Cross",
    citation: "On the seventh seal, when the Ark held its breath",
  },
};

export function getSealEpigraph(num: SealNumber): SealEpigraph {
  return SEAL_EPIGRAPHS[num];
}
