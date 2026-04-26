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
 *   - class: 2 / 6 sets (Assassin, Engineer)
 *
 * Pending factions:
 *   - class (remaining 5 sets)
 *   - race, elemental, dimensional (tier-up sets)
 *   - architect, antiquarian, dreamer, insurgency, new_babylon,
 *     thought_virus, neutral, panopticon, allegiance, class, race,
 *     elemental, dimensional
 */
export const CARD_ART_PROMPTS: CardArtPromptRegistry = Object.freeze({
  ...IMPRINT_CARD_ART_PROMPTS,
  ...ALLEGIANCE_CARD_ART_PROMPTS,
  ...CLASS_CARD_ART_PROMPTS,
});
