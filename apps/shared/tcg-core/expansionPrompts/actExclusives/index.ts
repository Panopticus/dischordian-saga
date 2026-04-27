/**
 * Act-themed pack exclusives — barrel.
 *
 * Will hold 28 cards across the seven Acts (1 mythic + 1 epic + 2
 * rares per Act). Authored incrementally — uncomment imports as
 * each act file lands.
 */
import type { ExpansionCardRegistry } from "../types";
import { ACT1_PROMPTS } from "./act1_memoir";
// import { ACT2_PROMPTS } from "./act2_whisper";
// import { ACT3_PROMPTS } from "./act3_offer";
// import { ACT4_PROMPTS } from "./act4_revelation";
// import { ACT5_PROMPTS } from "./act5_map";
// import { ACT6_PROMPTS } from "./act6_confession";
// import { ACT7_PROMPTS } from "./act7_convergence";

export const ACT_EXCLUSIVE_PROMPTS: ExpansionCardRegistry = Object.freeze({
  ...ACT1_PROMPTS,
});
