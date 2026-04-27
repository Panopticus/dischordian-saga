/**
 * Hierarchy of the Damned — barrel.
 *
 * Will eventually merge the six tier files (csuite / vps / directors
 * / managers / analysts / interns) into a single frozen registry of
 * all 84 S2_HIERARCHY cards. Authored incrementally — barrels only
 * import what currently exists; uncomment lines as each tier file
 * lands so TypeScript stays compilable at every commit.
 */
import type { ExpansionCardRegistry } from "../types";
import { CSUITE_PROMPTS } from "./csuite";
import { VP_PROMPTS } from "./vps";
import { DIRECTOR_PROMPTS } from "./directors";
import { MANAGER_PROMPTS } from "./managers";
// import { ANALYST_PROMPTS } from "./analysts";    // pending
// import { INTERN_PROMPTS } from "./interns";      // pending

export const HIERARCHY_PROMPTS: ExpansionCardRegistry = Object.freeze({
  ...CSUITE_PROMPTS,
  ...VP_PROMPTS,
  ...DIRECTOR_PROMPTS,
  ...MANAGER_PROMPTS,
});
