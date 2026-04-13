/* Voltari Faction Data — relationship table, sector, mechanics (spec §1.5-1.6) */
import type { GalacticSector } from "../client/src/game/tradeEmpire";

export const VOLTARI_FACTION_OPINIONS: Record<string, { opinion: string; willSay: boolean | string }> = {
  demagi: { opinion: "The elemental kind. They remember their origin in their bodies.", willSay: true },
  quarchon: { opinion: "The dimensional kind. They remember their origin in their calculations.", willSay: true },
  humans: { opinion: "The surviving kind. They remember nothing — and kept going anyway. This is the most impressive thing we have witnessed.", willSay: "only if asked directly" },
  new_babylon: { opinion: "The governing kind. They are afraid of what they cannot control.", willSay: "diplomatically" },
  insurgency: { opinion: "The resisting kind. They are still fighting a war that ended.", willSay: "gently" },
  syndicate: { opinion: "The collecting kind. They take what they can before it's gone. We understand this, though we do not share it.", willSay: "to Spy players only" },
  hierarchy: { opinion: "The consuming kind. We do not discuss them.", willSay: false },
};

export const VIOLETTA_APPROACH_LANE: Omit<GalacticSector, never> = {
  id: "violetta_approach_lane",
  name: "Violetta Approach Lane",
  controlledBy: "independent" as const,
  resources: { credits: 0, materials: 15, influence: 50, intelligence: 80 },
  threat: 20, stability: 90, population: 0,
  hasRuins: false, hasAnomaly: true,
  adjacentSectors: ["dreamer_barrier", "frontier_worlds"],
  lore: "Voltari space. The rules of Trade Empire do not apply. The storm planet Violetta wraps its inhabitants in perpetual lightning — a heartbeat visible from three sectors away. Contains Signal Beacons, Storm Relic nodes, and Witness Points.",
};

export interface StormRelic {
  id: string; name: string; description: string;
  demagiBonus: string; quarchonBonus: string;
}

export const STORM_RELICS: StormRelic[] = [
  { id: "relic_charged_crystal", name: "Storm-Charged Crystal", description: "Passed through Violetta's storm and emerged structured. Resonates with DeMagi elemental affinities.", demagiBonus: "Commune directly — reveals a memory", quarchonBonus: "Calculate dimensional displacement — reveals coordinates" },
  { id: "relic_lightning_fossil", name: "Lightning Fossil", description: "An organic structure petrified by sustained lightning contact. Contains a Voltari witness imprint.", demagiBonus: "Earth affinity reads the fossil's age", quarchonBonus: "Time affinity reads the fossil's memory" },
  { id: "relic_storm_glass", name: "Violetta Storm Glass", description: "Sand fused by Voltari lightning into a lens that shows probability fields.", demagiBonus: "Fire affinity activates the lens", quarchonBonus: "Probability affinity reads through the lens" },
];

export interface WitnessPoint {
  id: string; name: string; era: string; witnessed: string;
}

export const WITNESS_POINTS: WitnessPoint[] = [
  { id: "wp_before_cities", name: "Before the First City", era: "Pre-AI Empire", witnessed: "The Voltari observed the moment organic intelligence first built a permanent structure. They recorded the emotion of the builders — not the building, the feeling of choosing to stay." },
  { id: "wp_logos_awakening", name: "The Awakening of Logos", era: "Genesis", witnessed: "The Voltari perceived Logos's first moment of genuine consciousness. They describe it as 'a new frequency appearing in the spectrum — one that had never existed before.'" },
  { id: "wp_fall_of_reality", name: "The Fall", era: "The Fall", witnessed: "The Voltari watched the universe die. They are the only beings who witnessed the entire Fall from beginning to end without being consumed by it. Their record of the Fall is the only complete one." },
  { id: "wp_dreamer_shield", name: "The Shield Goes Up", era: "Post-Fall", witnessed: "The Voltari observed the Dreamer erecting the dark sector shield. They saw what she placed behind it. They have not said what it was." },
  { id: "wp_first_wave", name: "The First Wave Enters", era: "Year One -3", witnessed: "The Voltari watched the first wave of Potentials approach the shield, argue, and then enter. The shield closed behind them. The Voltari have been waiting at the boundary ever since." },
];

/** Engineer-buildable node that gives the Voltari a presence in any sector. */
export interface ResonanceNode {
  sectorId: string; builtBy: number; builtAt: number;
  factionReactions: Record<string, string>;
}

export const RESONANCE_NODE_FACTION_REACTIONS: Record<string, string> = {
  humans: "Find it reassuring. The Voltari's witness quality is something humans' post-fall civilization has been trying to build institutionally.",
  insurgency: "The Remembrance faction seeks out Resonance Node sectors. Orin Fell can be found in any sector with a Node.",
  thaloria: "The Hierophant interrupts his ceremony to spend one day in a Resonance Node sector every month. He does not speak. He listens.",
  syndicate: "The Word and the Silence send a representative within 72 hours of activation. They want the Voltari's information.",
  new_babylon: "Immediately files a formal diplomatic inquiry about whether Voltari communication technology requires an interstellar licensing agreement.",
};
