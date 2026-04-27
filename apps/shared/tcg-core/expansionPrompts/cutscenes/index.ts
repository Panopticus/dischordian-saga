/**
 * Cutscene prompts — barrel.
 *
 * 9 cinematics: card-pack opening (1) + Mol'Garath / Hierarchy
 * reveal (1) + per-Act narrative cutscenes (7). Authored
 * incrementally; uncomment as each cutscene file lands.
 *
 * Naming note: previously this barrel referenced a "crystalOpening"
 * file; the user clarified 2026-04-27 that this is a CARD PACK
 * opening, not a crystal cinematic — file renamed to
 * cardPackOpening.ts and the cutscene id updated accordingly.
 */
import type { CutsceneRegistry } from "../types";
import { CARD_PACK_OPENING_CUTSCENE } from "./cardPackOpening";
import { HIERARCHY_REVEAL_CUTSCENE } from "./hierarchyReveal";
import { ACT1_CUTSCENE } from "./act1_memoir";
import { ACT2_CUTSCENE } from "./act2_whisper";
import { ACT3_CUTSCENE } from "./act3_offer";
import { ACT4_CUTSCENE } from "./act4_revelation";
import { ACT5_CUTSCENE } from "./act5_map";
// import { ACT6_CUTSCENE } from "./act6_confession";
// import { ACT7_CUTSCENE } from "./act7_convergence";

export const CUTSCENE_PROMPTS: CutsceneRegistry = Object.freeze({
  ...CARD_PACK_OPENING_CUTSCENE,
  ...HIERARCHY_REVEAL_CUTSCENE,
  ...ACT1_CUTSCENE,
  ...ACT2_CUTSCENE,
  ...ACT3_CUTSCENE,
  ...ACT4_CUTSCENE,
  ...ACT5_CUTSCENE,
});
