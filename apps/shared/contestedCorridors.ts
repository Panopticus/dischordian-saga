/* Contested Corridors — class-specific navigation (spec §11.2) */

import type { CharClass } from "./characterCreationImpact";

export interface CorridorNavMethod {
  class: CharClass;
  method: string;
  description: string;
}

export const CORRIDOR_NAV_METHODS: CorridorNavMethod[] = [
  { class: "spy", method: "cover_identity", description: "Cover identity system allows passing as either faction. Requires periodic maintenance missions for the impersonated faction. If cover breaks, both factions become suspicious." },
  { class: "soldier", method: "escort_contracts", description: "Both the Warden's Vanguard and Dimensional Guard offer escort contracts — escorting faction shipments through corridors. Taking both is logistically possible but politically explosive." },
  { class: "oracle", method: "timing_gaps", description: "Predict when corridor patrols intersect and route through gaps. Can also offer both factions probability forecasts suggesting the conflict costs more than a neutral zone agreement." },
  { class: "engineer", method: "infrastructure_repair", description: "Repair cold-war infrastructure damage. Simultaneous goodwill from both factions — neither can object to maintenance without looking petty. Fastest path to corridor neutral-party status." },
  { class: "assassin", method: "syndicate_schedule", description: "The Syndicate runs quiet transit through corridors on a schedule both factions know about and neither discusses publicly. Assassin players who establish Syndicate contact can use this schedule." },
];

export const CORRIDOR_CHOICES = ["demagi_rules", "quarchon_rules", "assist_demagi_ships", "assist_quarchon_ships", "assist_both", "assist_neither"] as const;
export type CorridorChoice = typeof CORRIDOR_CHOICES[number];
