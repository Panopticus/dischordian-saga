/* ═══════════════════════════════════════════════════════
   ACT 3 DATA SHELL — §7 "The Eyes in the Dark"

   §7 is the largest unimplemented section in the Witnessing
   Narrative Proposal — "The story of the Eyes, told through
   Trade Empire." This shell encodes the narrative structure
   (Eyes' biography timeline, faction infiltration paths,
   and the §8 Trade Empire improvement backlog) as pure data.

   Nothing here changes gameplay. The shell exists so future
   Trade Empire rewrites can import canonical content by id
   instead of re-reading the proposal.
   ═══════════════════════════════════════════════════════ */

/* ─── §7 — THE EYES' BIOGRAPHY (the Watcher's weapon) ─── */

export type EyesLifeStage =
  | "recruitment"
  | "first_mission"
  | "senate_arrival"
  | "elara_seduction"
  | "panopticon_betrayal"
  | "run_through_grass"
  | "death_in_grass";

export interface EyesBiographyEntry {
  stage: EyesLifeStage;
  /** 1-based order in which the stages should be surfaced to the player. */
  order: number;
  /** Narrative title for the Loredex entry. */
  title: string;
  /** A short canonical description. */
  summary: string;
  /** Trade Empire system where the stage surfaces. */
  surfacesIn:
    | "archon_hub"
    | "panopticon_cell"
    | "atarion_senate"
    | "insurgency_safehouse"
    | "empire_dispatch"
    | "grasslands_sector";
  /** Flag that gameplay raises when the player encounters this stage. */
  encounteredFlag: string;
}

export const EYES_BIOGRAPHY: readonly EyesBiographyEntry[] = [
  {
    stage: "recruitment",
    order: 1,
    title: "The Recruitment",
    summary:
      "The Eyes is recruited in a cold grey office by the Watcher. She does not hesitate. She has been hesitating for long enough.",
    surfacesIn: "insurgency_safehouse",
    encounteredFlag: "act3_eyes_recruitment_seen",
  },
  {
    stage: "first_mission",
    order: 2,
    title: "The First Mission",
    summary:
      "A single quiet killing in a corridor. She does it because she can. She does it because she was designed to.",
    surfacesIn: "empire_dispatch",
    encounteredFlag: "act3_eyes_first_mission_seen",
  },
  {
    stage: "senate_arrival",
    order: 3,
    title: "The Senate Arrival",
    summary:
      "She is sent to Atarion on a cover identity. She reads as genuine because she genuinely is, in the spaces that matter.",
    surfacesIn: "atarion_senate",
    encounteredFlag: "act3_eyes_senate_arrival_seen",
  },
  {
    stage: "elara_seduction",
    order: 4,
    title: "The Balcony",
    summary:
      "She meets Senator Elara Voss. They become friends. They become more than friends. Elara's narrator slot goes quiet on this frame.",
    surfacesIn: "atarion_senate",
    encounteredFlag: "act3_eyes_elara_encounter_seen",
  },
  {
    stage: "panopticon_betrayal",
    order: 5,
    title: "The Panopticon Betrayal",
    summary:
      "The Panopticon archive is turned against Elara. The Eyes is the one who turns it.",
    surfacesIn: "panopticon_cell",
    encounteredFlag: "act3_eyes_betrayal_seen",
  },
  {
    stage: "run_through_grass",
    order: 6,
    title: "The Run Through Grass",
    summary:
      "She runs from the Panopticon through an unlit grass plain. The grass does not know she is guilty.",
    surfacesIn: "grasslands_sector",
    encounteredFlag: "act3_eyes_run_seen",
  },
  {
    stage: "death_in_grass",
    order: 7,
    title: "The Death in Grass",
    summary:
      "She falls. The sky brightens anyway. The Watcher orders the Collector to finish it. The Watcher's line plays: 'I made her with my own hands. I'm giving her back to the grass.'",
    surfacesIn: "grasslands_sector",
    encounteredFlag: "act3_eyes_death_seen",
  },
];

/* ─── §7.3 — FACTION INFILTRATION PATHS ─── */

export type FactionInfiltrationPath =
  | "insurgency"
  | "empire"
  | "hierarchy";

export interface InfiltrationPathDef {
  id: FactionInfiltrationPath;
  /** Display name for the Trade Empire mission screen. */
  label: string;
  /** One-sentence pitch for the player. */
  pitch: string;
  /** Canonical ending outcome when the player completes this path. */
  endingLabel: string;
  /** Flag raised when the player commits to this path. */
  commitFlag: string;
  /** Flag raised when the path's ending cutscene plays. */
  endingFlag: string;
  /** Lightning-rod milestone fired by this path's completion. */
  milestoneFlag: string;
  /** Which Living Universe event references this path. */
  livingUniverseEvent?: string;
}

export const INFILTRATION_PATHS: Record<FactionInfiltrationPath, InfiltrationPathDef> = {
  insurgency: {
    id: "insurgency",
    label: "Insurgency Infiltration",
    pitch:
      "Walk the Insurgency's back channels. Find out what the Engineer left there before he died.",
    endingLabel: "The Engineer Speaks",
    commitFlag: "act3_insurgency_committed",
    endingFlag: "act3_insurgency_ending",
    milestoneFlag: "insurgency_infiltration_complete",
    livingUniverseEvent: "event_the_engineer_speaks",
  },
  empire: {
    id: "empire",
    label: "Empire Infiltration",
    pitch:
      "Take the Empire's offer. Rise inside it. The Empire will promise you things it cannot deliver.",
    endingLabel: "The Archon Recruited",
    commitFlag: "act3_empire_committed",
    endingFlag: "act3_empire_ending",
    milestoneFlag: "empire_archon_offer_accepted",
    livingUniverseEvent: "event_the_archon_recruited",
  },
  hierarchy: {
    id: "hierarchy",
    label: "Hierarchy Infiltration",
    pitch:
      "Trade with the Hierarchy. They own the Matrix of Dreams. They are exactly as bad as you remember.",
    endingLabel: "The Dreamer's Shield Cracks",
    commitFlag: "act3_hierarchy_committed",
    endingFlag: "act3_hierarchy_ending",
    milestoneFlag: "hierarchy_infiltration_complete",
  },
};

export function listInfiltrationPaths(): InfiltrationPathDef[] {
  return [
    INFILTRATION_PATHS.insurgency,
    INFILTRATION_PATHS.empire,
    INFILTRATION_PATHS.hierarchy,
  ];
}

/* ─── §8 — TRADE EMPIRE 10 CONCRETE IMPROVEMENTS ─── */

export interface TradeEmpireImprovement {
  id: string;
  /** 1-based position in the §8 list. */
  order: number;
  title: string;
  summary: string;
  /** Which Witnessing concern the improvement serves. */
  serves:
    | "narrative_objects"
    | "diplomacy"
    | "infiltration"
    | "living_economy"
    | "trade_fleets"
    | "sector_memory"
    | "dreamers_shield"
    | "piracy"
    | "colonies"
    | "eyes_voice";
  /** Flag raised when the improvement lands in gameplay. */
  shippedFlag: string;
}

export const TRADE_EMPIRE_IMPROVEMENTS: readonly TradeEmpireImprovement[] = [
  {
    id: "narrative_objects",
    order: 1,
    title: "Narrative Objects",
    summary:
      "Every tradable good carries a narrative tag. The player sees who made it, who lost it, and who is waiting for it to arrive.",
    serves: "narrative_objects",
    shippedFlag: "te_narrative_objects_shipped",
  },
  {
    id: "diplomacy_table",
    order: 2,
    title: "Diplomacy Table",
    summary:
      "A real diplomacy table between factions with multi-turn negotiation and binding terms. Locke sits at the head of it.",
    serves: "diplomacy",
    shippedFlag: "te_diplomacy_table_shipped",
  },
  {
    id: "infiltration_paths",
    order: 3,
    title: "Faction Infiltration Paths",
    summary:
      "Three canonical paths (Insurgency / Empire / Hierarchy) with distinct mission chains and endings.",
    serves: "infiltration",
    shippedFlag: "te_infiltration_paths_shipped",
  },
  {
    id: "living_economies",
    order: 4,
    title: "Living Economies",
    summary:
      "Prices react to community behavior. Necromancer return raises weapon prices 50%. Dreamer awakening drops them 25%. Etc.",
    serves: "living_economy",
    shippedFlag: "te_living_economy_shipped",
  },
  {
    id: "trade_fleets",
    order: 5,
    title: "Trade Fleets",
    summary:
      "Player-owned fleets that move goods across sectors. Fleets can be raided, lost, re-routed.",
    serves: "trade_fleets",
    shippedFlag: "te_trade_fleets_shipped",
  },
  {
    id: "sector_memory",
    order: 6,
    title: "Sector Memory",
    summary:
      "Every sector remembers the last three players who reclaimed it and names them in its Loredex entry.",
    serves: "sector_memory",
    shippedFlag: "te_sector_memory_shipped",
  },
  {
    id: "dreamers_shield_crack",
    order: 7,
    title: "Dreamer's Shield Crack Reveal",
    summary:
      "A visible crack appears on the galactic map when community Dark Energy crosses 500k. Reveals the endgame without spoiling the choice.",
    serves: "dreamers_shield",
    shippedFlag: "te_dreamers_shield_shipped",
  },
  {
    id: "piracy",
    order: 8,
    title: "Piracy",
    summary:
      "Player can become a pirate. Attacks other players' fleets. Dark-aligned path with real consequences.",
    serves: "piracy",
    shippedFlag: "te_piracy_shipped",
  },
  {
    id: "colonies_as_legacies",
    order: 9,
    title: "Colonies as Legacies",
    summary:
      "Colonies the player founds persist after prestige. They remember who founded them. They name streets after you.",
    serves: "colonies",
    shippedFlag: "te_colonies_shipped",
  },
  {
    id: "eyes_voice_layer",
    order: 10,
    title: "Eyes Voice Layer",
    summary:
      "Late Act 3 — the Eyes starts speaking in the background of trade missions. She is not in the slot. She is just present. This is the §1.5 reveal that she was the fourth narrator all along.",
    serves: "eyes_voice",
    shippedFlag: "te_eyes_voice_shipped",
  },
];

/** Look up a biography stage by its stage id. */
export function getEyesStage(
  stage: EyesLifeStage,
): EyesBiographyEntry | undefined {
  return EYES_BIOGRAPHY.find((e) => e.stage === stage);
}

/** Look up an infiltration path by its id. */
export function getInfiltrationPath(
  id: FactionInfiltrationPath,
): InfiltrationPathDef {
  return INFILTRATION_PATHS[id];
}

/** Return the full §8 list of 10 improvements in order. */
export function listTradeEmpireImprovements(): readonly TradeEmpireImprovement[] {
  return TRADE_EMPIRE_IMPROVEMENTS;
}
