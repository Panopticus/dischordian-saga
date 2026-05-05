// apps/shared/encounters/index.ts
//
// Aggregate barrel for the encounter content set:
//   - Hierarchy of the Damned demon-lord encounters (3)
//   - Malkia Ukweli revolution questline (6 steps)
//   - Source/Kael philosophical dialogue tree (5 nodes)
//   - Act 7 stance epilogue VO scripts (5 endings)
//
// All content uses the shared EncounterLine type from
// apps/shared/encounters/types.ts. Speakers are loose strings —
// canonical NpcKey values for roster characters, sentinel
// strings ('hierarchy:master_of_rlyeh', 'source', 'kael_trace',
// etc.) for non-roster speakers.

export type { EncounterLine, EncounterPhase } from "./types";

export {
  MASTER_OF_RLYEH_LINES,
  MASTER_OF_RLYEH_PHASES,
} from "./masterOfRlyeh";

export {
  PALE_EMISSARY_LINES,
  PALE_EMISSARY_PHASES,
} from "./paleEmissary";

export {
  RECKONING_DAUGHTER_LINES,
  RECKONING_DAUGHTER_PHASES,
} from "./reckoningDaughter";

export {
  MALKIA_REVOLUTION_QUESTLINE,
  MALKIA_REVOLUTION_STEPS,
  MALKIA_STEP_1,
  MALKIA_STEP_2,
  MALKIA_STEP_3,
  MALKIA_STEP_4,
  MALKIA_STEP_5,
  MALKIA_STEP_6,
} from "./malkiaRevolution";

export {
  SOURCE_KAEL_DIALOGUE_LINES,
  SOURCE_KAEL_DIALOGUE_TREE,
} from "./sourceKaelDialogue";

export {
  ACT7_EPILOGUE_VO_SCRIPTS,
  ALL_ACT7_EPILOGUE_LINES,
  HUMANITY_ENDING_VO,
  MACHINE_ENDING_VO,
  BALANCE_ENDING_VO,
  SOLDIER_COMMAND_ENDING_VO,
  SILENCE_ENDING_VO,
} from "./act7EpilogueVoScripts";
