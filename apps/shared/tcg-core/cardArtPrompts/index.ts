/**
 * TCG card art prompts — registry index.
 *
 * Re-exports each faction's prompt module and merges them into a
 * single keyed registry. Consumers (the dispatch script + the
 * validation suite) should import `CARD_ART_PROMPTS` from this
 * index.
 *
 * Faction modules are populated incrementally — see each module's
 * head-comment for current authoring status.
 */

export type { CardArtPrompt, CardArtPromptRegistry } from "./types";

import type { CardArtPromptRegistry } from "./types";
import { IMPRINT_CARD_ART_PROMPTS } from "./imprint";
import { ALLEGIANCE_CARD_ART_PROMPTS } from "./allegiance";
import { CLASS_CARD_ART_PROMPTS } from "./class";
import { RACE_CARD_ART_PROMPTS } from "./race";
import { ELEMENTAL_CARD_ART_PROMPTS } from "./elemental";
import { DIMENSIONAL_CARD_ART_PROMPTS } from "./dimensional";
import { PANOPTICON_CARD_ART_PROMPTS } from "./panopticon";
import { ANTIQUARIAN_CARD_ART_PROMPTS } from "./antiquarian";
import { ARCHITECT_CARD_ART_PROMPTS } from "./architect";
import { DREAMER_CARD_ART_PROMPTS } from "./dreamer";
import { INSURGENCY_CARD_ART_PROMPTS } from "./insurgency";
import { NEW_BABYLON_CARD_ART_PROMPTS } from "./new_babylon";
import { THOUGHT_VIRUS_CARD_ART_PROMPTS } from "./thought_virus";
import { NEUTRAL_CARD_ART_PROMPTS } from "./neutral";

/**
 * The full card-art prompt registry.
 *
 * Populated factions:
 *   - imprint: 18 / 18 character sets — COMPLETE (Elara, Antiquarian,
 *     Iron Lion, Agent Zero, Akai Shi, Foucault, Locke, The
 *     Architect, The Collector, The Detective, The Dreamer, The
 *     Engineer, The Enigma, The Human, The Jailer, The Necromancer,
 *     The Oracle, The Source)
 *   - allegiance: 6 / 6 sets — COMPLETE (Antiquarian, Architect,
 *     Dreamer, Insurgency, New Babylon, Thought Virus)
 *   - class: 6 / 6 sets — COMPLETE (Assassin, Engineer, Ne-Yon,
 *     Oracle, Soldier, Spy)
 *   - race: 5 / 5 sets — COMPLETE (Human, Demagi, Quarchon,
 *     Synthetic, Ne-Yon)
 *   - elemental: 4 / 4 elements — COMPLETE (Fire, Water, Earth, Air)
 *   - dimensional: 4 / 4 dimensions — COMPLETE (Time, Space,
 *     Probability, Reality)
 *   - panopticon: 8 / 8 cards — COMPLETE
 *   - antiquarian: 39 / 39 cards — COMPLETE
 *   - architect: 63 / 63 cards — COMPLETE
 *   - dreamer: 61 / 61 cards — COMPLETE
 *   - insurgency: 51 / 51 cards — COMPLETE
 *   - new_babylon: 52 / 52 cards — COMPLETE
 *   - thought_virus: 53 / 53 cards — COMPLETE
 *   - neutral: 66 / 79 cards
 *
 * Pending factions:
 *   - neutral (remaining 73)
 *   - architect, antiquarian, dreamer, insurgency, new_babylon,
 *     thought_virus, neutral, panopticon, allegiance, class, race,
 *     elemental, dimensional
 */
export const CARD_ART_PROMPTS: CardArtPromptRegistry = Object.freeze({
  ...IMPRINT_CARD_ART_PROMPTS,
  ...ALLEGIANCE_CARD_ART_PROMPTS,
  ...CLASS_CARD_ART_PROMPTS,
  ...RACE_CARD_ART_PROMPTS,
  ...ELEMENTAL_CARD_ART_PROMPTS,
  ...DIMENSIONAL_CARD_ART_PROMPTS,
  ...PANOPTICON_CARD_ART_PROMPTS,
  ...ANTIQUARIAN_CARD_ART_PROMPTS,
  ...ARCHITECT_CARD_ART_PROMPTS,
  ...DREAMER_CARD_ART_PROMPTS,
  ...INSURGENCY_CARD_ART_PROMPTS,
  ...NEW_BABYLON_CARD_ART_PROMPTS,
  ...THOUGHT_VIRUS_CARD_ART_PROMPTS,
  ...NEUTRAL_CARD_ART_PROMPTS,
});
