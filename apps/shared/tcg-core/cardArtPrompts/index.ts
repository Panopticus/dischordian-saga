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

/**
 * The full card-art prompt registry.
 *
 * Populated factions:
 *   - imprint: 13 / 18 character sets (Elara, Antiquarian, Iron Lion,
 *     Agent Zero, Akai Shi, Foucault, Locke, The Architect,
 *     The Collector, The Detective, The Dreamer, The Engineer,
 *     The Enigma)
 *
 * Pending factions:
 *   - imprint (remaining 5 sets)
 *   - architect, antiquarian, dreamer, insurgency, new_babylon,
 *     thought_virus, neutral, panopticon, allegiance, class, race,
 *     elemental, dimensional
 */
export const CARD_ART_PROMPTS: CardArtPromptRegistry = Object.freeze({
  ...IMPRINT_CARD_ART_PROMPTS,
});
