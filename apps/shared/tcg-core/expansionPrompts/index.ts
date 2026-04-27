/**
 * Expansion prompts — top-level barrel.
 *
 * Single import point for the production-book generator script.
 * Merges card / cutscene / VFX prompts into three frozen registries
 * exported alongside their typed shapes.
 */
export type {
  ExpansionCardPrompt, CutscenePrompt, CutsceneBeat, VfxPrompt,
  ExpansionCardRegistry, CutsceneRegistry, VfxRegistry,
} from "./types";
export { VFX_OUTPUT_LOCKED } from "./types";

import type {
  ExpansionCardRegistry, CutsceneRegistry, VfxRegistry,
} from "./types";
import { HIERARCHY_PROMPTS } from "./hierarchy";
import { ACT_EXCLUSIVE_PROMPTS } from "./actExclusives";
import { SPECIALS_PROMPTS } from "./specials";
import { CUTSCENE_PROMPTS } from "./cutscenes";
import { VFX_PROMPTS } from "./vfx";

/** All 122 expansion cards keyed by id. */
export const EXPANSION_CARD_PROMPTS: ExpansionCardRegistry = Object.freeze({
  ...HIERARCHY_PROMPTS,
  ...ACT_EXCLUSIVE_PROMPTS,
  ...SPECIALS_PROMPTS,
});

/** All 9 cinematic cutscenes keyed by id. */
export const EXPANSION_CUTSCENE_PROMPTS: CutsceneRegistry = CUTSCENE_PROMPTS;

/** All 18 VFX assets keyed by id. */
export const EXPANSION_VFX_PROMPTS: VfxRegistry = VFX_PROMPTS;
