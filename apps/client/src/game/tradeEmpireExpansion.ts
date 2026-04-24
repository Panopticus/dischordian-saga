/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE — EXPANSION LAYER
   Seven new systems that extend the base Trade Empire to
   reach the ambition of its design inspirations:
     • CIV         → Eras, Wonders, Civic Policies
     • CATAN       → Resource Market, Pirate Raider
     • DIPLOMACY   → Simultaneous Orders, Peace Conference
     • STARCRAFT   → Fleet Doctrines, Production Queue
     • COSMIC HORROR → The Convergence, Sanity, Eldritch Encounters

   Lore-compatible: every mechanic maps to something already
   canonical in the Dischordian Saga. Nothing here contradicts
   the existing faction arcs; it amplifies them.
   ═══════════════════════════════════════════════════════ */

import type { GalacticFactionId } from "./tradeEmpire";

/* ───────────────────────────────────────────────────────
   1) ERAS — Civilization-style empire progression.
   Each era gates new mechanics and raises the Convergence
   pressure. Reaching the final era is a triumph AND a
   summoning.
   ─────────────────────────────────────────────────────── */

export type EraId =
  | "first_light"        // Waking on the Ark, 1 sector, no agents
  | "ark_awakening"      // Contact established, 2-3 sectors
  | "sector_lord"        // Multi-system empire, first wonder
  | "galactic_power"     // Faction-peer, doctrines unlocked
  | "cosmic_convergence"; // The gods stir. The story ends here.

export interface EraDefinition {
  id: EraId;
  name: string;
  tagline: string;
  description: string;
  /** Narrative color hint for the UI */
  accent: string;
  /** Unlock gate — all must be true */
  gate: {
    controlledSectors?: number;
    resolvedArcs?: number;
    wondersBuilt?: number;
    influence?: number;
  };
  /** Mechanics unlocked on entry */
  unlocks: string[];
  /** Convergence pressure added just by reaching this era */
  convergenceOnEntry: number;
  /** Optional 21:9 banner painting. Asset id in tradeEmpireArtPrompts. */
  banner?: string;
}

export const ERAS: EraDefinition[] = [
  {
    id: "first_light",
    name: "First Light",
    tagline: "You wake. The lights are dim. A woman is speaking.",
    description:
      "Ark 1047 is half a wreck and a full miracle. You have one sector, a senator who doesn't remember being a senator, and a decanted body learning its own hands. Nothing has happened yet. Everything is possible.",
    accent: "#a855f7",
    gate: {},
    unlocks: ["galaxy_map", "starter_missions"],
    convergenceOnEntry: 0,
  },
  {
    id: "ark_awakening",
    name: "Ark Awakening",
    tagline: "The Ark answers. The galaxy answers back.",
    description:
      "The reactor is stable. A faction has sent you a proposal that is not, strictly, a trap. You are on the galaxy map — a small pin, but a pin. Other civilizations are deciding whether you exist.",
    accent: "#22d3ee",
    gate: { controlledSectors: 2, influence: 25 },
    unlocks: ["resource_market", "simultaneous_orders"],
    convergenceOnEntry: 5,
  },
  {
    id: "sector_lord",
    name: "Sector Lord",
    tagline: "You have borders. You have enemies. You have a ledger.",
    description:
      "An empire small enough to see in one glance, large enough to be taxed. You can now commission a Wonder: a megaproject that will change what kind of power you are.",
    accent: "#f59e0b",
    gate: { controlledSectors: 4, resolvedArcs: 1 },
    unlocks: ["wonders", "civic_policies", "pirate_events"],
    convergenceOnEntry: 10,
  },
  {
    id: "galactic_power",
    name: "Galactic Power",
    tagline: "The Authority takes your calls. The Hierarchy takes notes.",
    description:
      "You are spoken of in the same breath as the reborn factions. Fleet doctrines are available. Peace conferences can be convened on your terms. The Convergence is no longer a rumor.",
    accent: "#ef4444",
    gate: { controlledSectors: 7, resolvedArcs: 3, wondersBuilt: 1 },
    unlocks: ["fleet_doctrines", "peace_conference", "eldritch_contact"],
    convergenceOnEntry: 20,
  },
  {
    id: "cosmic_convergence",
    name: "Cosmic Convergence",
    tagline: "Something that was waiting is no longer waiting.",
    description:
      "Five of six Act 3 arcs resolved, three Wonders standing, and a sky that is not, strictly, the sky you were born under. The gods that the Dreamer was shielding you from are turning their heads. You have one more era. Make it mean something.",
    accent: "#dc2626",
    gate: { controlledSectors: 10, resolvedArcs: 5, wondersBuilt: 3 },
    unlocks: ["dreamer_contact", "final_wonder", "convergence_climax"],
    convergenceOnEntry: 35,
  },
];

export function getEraById(id: EraId): EraDefinition {
  const era = ERAS.find((e) => e.id === id);
  if (!era) throw new Error(`Unknown era: ${id}`);
  return era;
}

export interface EraProgressInput {
  controlledSectors: number;
  resolvedArcs: number;
  wondersBuilt: number;
  influence: number;
}

/** Highest era the player qualifies for given current progress. */
export function determineEra(input: EraProgressInput): EraId {
  let best: EraId = "first_light";
  for (const era of ERAS) {
    const g = era.gate;
    if (
      (g.controlledSectors ?? 0) <= input.controlledSectors &&
      (g.resolvedArcs ?? 0) <= input.resolvedArcs &&
      (g.wondersBuilt ?? 0) <= input.wondersBuilt &&
      (g.influence ?? 0) <= input.influence
    ) {
      best = era.id;
    }
  }
  return best;
}

/* ───────────────────────────────────────────────────────
   Expansion state — lives alongside EmpireState in
   localStorage under `trade_empire_expansion`. Kept
   separate so legacy saves keep working.
   ─────────────────────────────────────────────────────── */

export interface ExpansionState {
  era: EraId;
  /** Every era the player has ever reached (for history) */
  eraHistory: EraId[];
  /** Last time the era was recomputed */
  lastEraCheck: number;

  /** Wonder build state (chunk 2) */
  wonders: WonderState;
  /** Civic policy slots (chunk 2) */
  civics: CivicState;

  /** Resource market state (chunk 3) */
  market: MarketState;
  /** Pirate raider (chunk 3) */
  pirate: PirateState;

  /** Simultaneous diplomatic orders for the current cycle (chunk 4) */
  orders: DiplomaticOrdersState;
  /** Peace conference log (chunk 4) */
  conferences: PeaceConference[];

  /** Fleet doctrine + production queue (chunk 5) */
  fleetDoctrine: FleetDoctrineState;

  /** The Convergence doom track, sanity, encounter log (chunk 6) */
  convergence: ConvergenceState;
}

/* Placeholder types filled in by later chunks.
   Declared up front so the state shape is stable. */
export interface WonderState {
  /** Completed wonder ids */
  built: string[];
  /** In-progress wonder (one at a time) */
  inProgress: { wonderId: string; startedAt: number; endsAt: number; progress: number } | null;
}
export interface CivicState {
  doctrine: string | null;
  economy: string | null;
  order: string | null;
  /** Cycles until civics can be changed again */
  cooldownUntil: number;
}
export interface MarketState {
  /** Accumulated exchange history */
  trades: MarketTrade[];
  /** Active trade embargoes from factions */
  embargoes: GalacticFactionId[];
}
export interface MarketTrade {
  id: string;
  give: Resource;
  giveAmount: number;
  receive: Resource;
  receiveAmount: number;
  timestamp: number;
  counterparty: GalacticFactionId | "market";
}
export type Resource = "credits" | "materials" | "influence" | "intelligence";
export interface PirateState {
  /** Sector id the pirate is parked on, or null if absent */
  parkedSector: string | null;
  /** Cycles pirate has been on current sector */
  cyclesOnSector: number;
  /** Total lifetime theft */
  totalStolen: number;
}
export interface DiplomaticOrdersState {
  cycle: number;
  /** Player's submitted orders for current cycle, keyed by faction */
  submitted: Partial<Record<GalacticFactionId, DiplomaticOrder>>;
  /** Resolutions from the previous cycle (for UI display) */
  lastResolution: OrderResolution[];
}
export interface DiplomaticOrder {
  stance: "hold" | "support" | "move" | "convoy" | "betray";
  targetSector?: string;
  targetFaction?: GalacticFactionId;
  /** Words of explanation — purely narrative */
  note?: string;
}
export interface OrderResolution {
  factionId: GalacticFactionId;
  playerStance: DiplomaticOrder["stance"];
  factionStance: DiplomaticOrder["stance"];
  outcome: "aligned" | "betrayal" | "misread" | "stalemate";
  reputationDelta: number;
  narrative: string;
}
export interface PeaceConference {
  id: string;
  name: string;
  convenedAt: number;
  participants: GalacticFactionId[];
  treaties: ConferenceTreaty[];
  outcome: "signed" | "collapsed" | "pending";
}
export interface ConferenceTreaty {
  type: "cease_fire" | "trade_accord" | "mutual_defense" | "territory_cession" | "non_interference";
  parties: GalacticFactionId[];
  /** Short player-facing description */
  terms: string;
}
export interface FleetDoctrineState {
  /** Currently active doctrine */
  active: string | null;
  /** Per-ship-type counts */
  composition: Record<FleetUnitType, number>;
  /** Production queue at controlled sectors */
  queue: FleetProductionOrder[];
}
export type FleetUnitType = "scout" | "trader" | "frigate" | "cruiser" | "carrier" | "flagship";
export interface FleetProductionOrder {
  id: string;
  sectorId: string;
  unitType: FleetUnitType;
  startedAt: number;
  endsAt: number;
}
export interface ConvergenceState {
  /** Doom track 0-100. 100 = final awakening. */
  doom: number;
  /** Empire sanity 0-100. 0 = total collapse, fleet & market malfunction. */
  sanity: number;
  /** Whispers revealed to the player this cycle */
  revealedWhispers: string[];
  /** Encounter log */
  encounters: EldritchEncounterEntry[];
  /** Has the Dreamer's barrier fallen? */
  dreamerFallen: boolean;
  /** Convergence final event reached? */
  finalAwakening: boolean;
}
export interface EldritchEncounterEntry {
  id: string;
  encounterId: string;
  timestamp: number;
  choiceId: string;
  sanityDelta: number;
  doomDelta: number;
}

export function createInitialExpansion(): ExpansionState {
  return {
    era: "first_light",
    eraHistory: ["first_light"],
    lastEraCheck: 0,
    wonders: { built: [], inProgress: null },
    civics: { doctrine: null, economy: null, order: null, cooldownUntil: 0 },
    market: { trades: [], embargoes: [] },
    pirate: { parkedSector: null, cyclesOnSector: 0, totalStolen: 0 },
    orders: { cycle: 0, submitted: {}, lastResolution: [] },
    conferences: [],
    fleetDoctrine: {
      active: null,
      composition: { scout: 0, trader: 0, frigate: 0, cruiser: 0, carrier: 0, flagship: 1 },
      queue: [],
    },
    convergence: {
      doom: 0,
      sanity: 100,
      revealedWhispers: [],
      encounters: [],
      dreamerFallen: false,
      finalAwakening: false,
    },
  };
}

/* ───────────────────────────────────────────────────────
   2) WONDERS & CIVIC POLICIES — Civilization-style.
   Wonders are one-per-civilization megaprojects with
   empire-wide effects. Civics are mutually-exclusive
   government choices across three slots.
   ─────────────────────────────────────────────────────── */

export interface Wonder {
  id: string;
  name: string;
  flavor: string;
  lore: string;
  /** Which faction's legacy this wonder draws on */
  lineage: GalacticFactionId;
  /** Build cost */
  cost: { credits: number; materials: number; influence: number };
  /** Real-time hours to build */
  buildHours: number;
  /** Era required to commission */
  requiredEra: EraId;
  /** Permanent empire-wide effect */
  effect: string;
  /** Convergence pressure added on completion (some wonders are dangerous) */
  convergenceOnBuild: number;
  /** Sanity floor this wonder guarantees */
  sanityFloor?: number;
  /** Optional 2:3 key-art painting. Asset id in tradeEmpireArtPrompts. */
  image?: string;
}

export const WONDERS: Wonder[] = [
  {
    id: "ark_cathedral",
    name: "The Ark Cathedral",
    flavor: "A ship that was a tomb is now a shrine.",
    lore: "The Ark's lower decks are reconsecrated. The decanted remember each other in the grain of the bulkheads. Elara finally sleeps through the night.",
    lineage: "potentials",
    cost: { credits: 400, materials: 300, influence: 100 },
    buildHours: 6,
    requiredEra: "sector_lord",
    effect: "+20 Sanity floor. All Potentials recruited gain +10 loyalty.",
    convergenceOnBuild: 0,
    sanityFloor: 20,
  },
  {
    id: "red_crystal_spire",
    name: "The Red Crystal Spire",
    flavor: "A coffin made public. A tower made of it.",
    lore: "New Babylon gifts you — or sells you — a single red crystal fragment. You build around it. The Authority's voice is now, faintly, in your walls.",
    lineage: "new_babylon",
    cost: { credits: 800, materials: 200, influence: 300 },
    buildHours: 10,
    requiredEra: "sector_lord",
    effect: "+30% credits income from all sectors. Authority reputation locked above -20.",
    convergenceOnBuild: 5,
  },
  {
    id: "forge_monolith",
    name: "The Forge Monolith",
    flavor: "The Architect's furnaces adopted, not stolen.",
    lore: "A fragment of the Architect's Forge Worlds is installed on one of your sectors. Drones arrive unbidden. They ask, politely, what to build.",
    lineage: "artificial_empire",
    cost: { credits: 300, materials: 700, influence: 150 },
    buildHours: 12,
    requiredEra: "sector_lord",
    effect: "Fleet production time halved. Wonders after this build 25% faster.",
    convergenceOnBuild: 8,
  },
  {
    id: "remembrance_garden",
    name: "The Remembrance Garden",
    flavor: "Orin Fell plants a name. Then another.",
    lore: "A greenhouse on the coldest sector. Each bed is a name from Iron Lion's honor roll. The garden grows in impossible soil.",
    lineage: "insurgency",
    cost: { credits: 200, materials: 200, influence: 400 },
    buildHours: 8,
    requiredEra: "sector_lord",
    effect: "+15 Sanity floor. Losing a fleet unit costs only half the usual morale penalty.",
    convergenceOnBuild: 0,
    sanityFloor: 15,
  },
  {
    id: "chronarch_lens",
    name: "The Chronarch Lens",
    flavor: "The Antiquarian leases an aperture.",
    lore: "A pinhole of the Refuge opens onto your flagship bridge. You can see one cycle ahead. Everyone who looks through it stops being young in the ordinary way.",
    lineage: "antiquarian",
    cost: { credits: 500, materials: 250, influence: 500 },
    buildHours: 18,
    requiredEra: "galactic_power",
    effect: "Reveals all faction order stances one cycle before resolution. Intelligence +50/cycle.",
    convergenceOnBuild: 3,
  },
  {
    id: "hell_gate_sigil",
    name: "The Hell Gate Sigil",
    flavor: "A demon's contract signed in your favor.",
    lore: "The Shadow Tongue offers an inverted sigil: a portal that drinks rather than disgorges. Your sanity pays the bill.",
    lineage: "hierarchy",
    cost: { credits: 300, materials: 400, influence: 600 },
    buildHours: 14,
    requiredEra: "galactic_power",
    effect: "+40% combat power vs. Hierarchy AND Thought Virus. Sanity floor capped at 40.",
    convergenceOnBuild: 15,
  },
  {
    id: "immune_choir",
    name: "The Immune Choir",
    flavor: "Dr. Vox's journal finished, sung.",
    lore: "A wing of the Ark where infected minds are sung back into coherence. It works slightly more often than it should.",
    lineage: "thought_virus",
    cost: { credits: 600, materials: 500, influence: 400 },
    buildHours: 16,
    requiredEra: "galactic_power",
    effect: "Thought Virus contamination halved on all missions. +10 Sanity floor.",
    convergenceOnBuild: -5,
    sanityFloor: 10,
  },
  {
    id: "dreamers_answer",
    name: "The Dreamer's Answer",
    flavor: "The only wonder the Dreamer can see.",
    lore: "A beacon that asks the Shielded Sector — politely, finally — why. The barrier thins. Something answers. It is not an answer you wanted in the form you wanted it in.",
    lineage: "dreamer_shield",
    cost: { credits: 1000, materials: 800, influence: 1000 },
    buildHours: 24,
    requiredEra: "cosmic_convergence",
    effect: "Delays the Final Awakening by one full act. Raises sanity floor to 50. Ends with contact.",
    convergenceOnBuild: -20,
    sanityFloor: 50,
  },
];

export function getWonderById(id: string): Wonder | undefined {
  return WONDERS.find((w) => w.id === id);
}

export function eligibleWonders(state: ExpansionState): Wonder[] {
  const eraIndex = ERAS.findIndex((e) => e.id === state.era);
  return WONDERS.filter((w) => {
    if (state.wonders.built.includes(w.id)) return false;
    if (state.wonders.inProgress?.wonderId === w.id) return false;
    const required = ERAS.findIndex((e) => e.id === w.requiredEra);
    return eraIndex >= required;
  });
}

/* ─── CIVIC POLICIES ─── */

export type CivicSlot = "doctrine" | "economy" | "order";

export interface CivicPolicy {
  id: string;
  slot: CivicSlot;
  name: string;
  description: string;
  flavor: string;
  /** Short summary of the mechanical effect */
  effect: string;
  /** Era required */
  requiredEra: EraId;
  /** Per-cycle modifiers applied while this civic is active */
  modifiers: Partial<{
    creditsPerCycle: number;
    materialsPerCycle: number;
    influencePerCycle: number;
    intelligencePerCycle: number;
    fleetCombat: number;
    diplomacy: number;
    sanityPerCycle: number;
    doomPerCycle: number;
  }>;
  /** Optional 1:1 heraldic icon. Asset id in tradeEmpireArtPrompts. */
  icon?: string;
}

export const CIVIC_POLICIES: CivicPolicy[] = [
  // ─ Doctrine (how you fight) ─
  {
    id: "doctrine_iron_lion",
    slot: "doctrine",
    name: "Iron Lion Doctrine",
    description: "Your fleet fights like it has nothing left to lose. Because it doesn't.",
    flavor: "Iron Lion's tactical manual, annotated by a crew that watched him die.",
    effect: "+15% fleet combat, +5 sanity/cycle. But factions remember who you are.",
    requiredEra: "sector_lord",
    modifiers: { fleetCombat: 15, sanityPerCycle: 5 },
  },
  {
    id: "doctrine_nomad",
    slot: "doctrine",
    name: "Nomad Compass",
    description: "Never where the shot lands. Agent Zero's way.",
    flavor: "The Insurgency's asymmetric playbook. Survive, scout, retreat, bleed them elsewhere.",
    effect: "+20% mission speed equivalent, +10 intelligence/cycle.",
    requiredEra: "sector_lord",
    modifiers: { intelligencePerCycle: 10 },
  },
  {
    id: "doctrine_archon",
    slot: "doctrine",
    name: "Archon Discipline",
    description: "The Architect's war-machine, politely rented.",
    flavor: "The Human's 1,351-year experience, deployed on your behalf. He does not approve.",
    effect: "+25% fleet combat, +10 materials/cycle, -5 sanity/cycle.",
    requiredEra: "galactic_power",
    modifiers: { fleetCombat: 25, materialsPerCycle: 10, sanityPerCycle: -5 },
  },
  // ─ Economy (how you produce) ─
  {
    id: "economy_free_ports",
    slot: "economy",
    name: "Free Ports Charter",
    description: "Every dockworker is a shareholder.",
    flavor: "The Free Ports' unofficial model — chaotic, loud, lucrative.",
    effect: "+25% credits/cycle, -10% influence/cycle.",
    requiredEra: "ark_awakening",
    modifiers: { creditsPerCycle: 25, influencePerCycle: -10 },
  },
  {
    id: "economy_authority_tithe",
    slot: "economy",
    name: "Authority Tithe",
    description: "Locke gets her cut. Everything moves.",
    flavor: "A ten-percent tribute to New Babylon. In exchange, the trade lanes never close.",
    effect: "+15% credits/cycle, +20 influence/cycle, Authority reputation +5/cycle.",
    requiredEra: "ark_awakening",
    modifiers: { creditsPerCycle: 15, influencePerCycle: 20 },
  },
  {
    id: "economy_antiquarian_ledger",
    slot: "economy",
    name: "Antiquarian Ledger",
    description: "Bookkeeping outside time.",
    flavor: "The Refuge's ledger runs on compound memory. You always have the receipts.",
    effect: "+15 intelligence/cycle, +10 influence/cycle, -2 sanity/cycle.",
    requiredEra: "galactic_power",
    modifiers: { intelligencePerCycle: 15, influencePerCycle: 10, sanityPerCycle: -2 },
  },
  // ─ Order (how you govern) ─
  {
    id: "order_council",
    slot: "order",
    name: "Council of Voices",
    description: "Six people, one table, no chairperson.",
    flavor: "Locke calls it inefficient. Elara calls it the only way.",
    effect: "+15 influence/cycle, +3 sanity/cycle, -2 doom/cycle.",
    requiredEra: "ark_awakening",
    modifiers: { influencePerCycle: 15, sanityPerCycle: 3, doomPerCycle: -2 },
  },
  {
    id: "order_panopticon",
    slot: "order",
    name: "Little Panopticon",
    description: "You watch everyone. They only watch you a little.",
    flavor: "A scaled-down Architect surveillance lattice. Vox would have disapproved.",
    effect: "+20 intelligence/cycle, +10 credits/cycle, -5 sanity/cycle, +1 doom/cycle.",
    requiredEra: "sector_lord",
    modifiers: { intelligencePerCycle: 20, creditsPerCycle: 10, sanityPerCycle: -5, doomPerCycle: 1 },
  },
  {
    id: "order_remembrance",
    slot: "order",
    name: "Remembrance Order",
    description: "Every policy begins with a name from the Fall.",
    flavor: "Orin Fell writes your constitution in Iron Lion's cadence.",
    effect: "+10 sanity/cycle, -3 doom/cycle, -10% credits/cycle.",
    requiredEra: "sector_lord",
    modifiers: { creditsPerCycle: -10, sanityPerCycle: 10, doomPerCycle: -3 },
  },
];

export function getCivicById(id: string): CivicPolicy | undefined {
  return CIVIC_POLICIES.find((c) => c.id === id);
}

export function civicsByEra(era: EraId): CivicPolicy[] {
  const eraIdx = ERAS.findIndex((e) => e.id === era);
  return CIVIC_POLICIES.filter((c) => {
    const req = ERAS.findIndex((e) => e.id === c.requiredEra);
    return eraIdx >= req;
  });
}

/** Sum civic modifier across active slots. */
export function sumCivicModifiers(civics: CivicState): Required<CivicPolicy["modifiers"]> {
  const base: Required<CivicPolicy["modifiers"]> = {
    creditsPerCycle: 0,
    materialsPerCycle: 0,
    influencePerCycle: 0,
    intelligencePerCycle: 0,
    fleetCombat: 0,
    diplomacy: 0,
    sanityPerCycle: 0,
    doomPerCycle: 0,
  };
  for (const slot of [civics.doctrine, civics.economy, civics.order]) {
    if (!slot) continue;
    const civic = getCivicById(slot);
    if (!civic) continue;
    for (const [k, v] of Object.entries(civic.modifiers)) {
      if (typeof v === "number") {
        base[k as keyof typeof base] += v;
      }
    }
  }
  return base;
}

/* ───────────────────────────────────────────────────────
   3) RESOURCE MARKET & PIRATE — Catan-style exchange.
   Four resources. Base exchange is 4:1. Trade ports
   (controlled sectors with hasRuins or stability >= 85)
   drop it to 3:1. The "Trade Accord" civic drops it to 2:1.
   Pirate Raider roves the map and parks on a sector,
   stealing its income until dislodged.
   ─────────────────────────────────────────────────────── */

export const RESOURCES: Resource[] = ["credits", "materials", "influence", "intelligence"];

export const RESOURCE_LABEL: Record<Resource, string> = {
  credits: "Credits",
  materials: "Materials",
  influence: "Influence",
  intelligence: "Intelligence",
};

/** Base 4:1 bank rate. */
export const MARKET_BASE_RATIO = 4;

export interface MarketRateInput {
  hasTradePort: boolean;
  hasMonopoly: boolean;
  civicEconomyId: string | null;
}

/** Return the give:receive ratio for a market trade. */
export function marketRatio(input: MarketRateInput): number {
  if (input.hasMonopoly) return 2;
  if (input.civicEconomyId === "economy_free_ports") return 3;
  if (input.hasTradePort) return 3;
  return MARKET_BASE_RATIO;
}

export interface ExecuteTradeInput {
  give: Resource;
  giveAmount: number;
  receive: Resource;
  ratio: number;
  counterparty?: GalacticFactionId;
}

export interface ExecuteTradeResult {
  success: boolean;
  error?: string;
  trade?: MarketTrade;
  receivedAmount?: number;
}

/** Validate + settle a bank trade. Caller is responsible for debiting/crediting. */
export function executeTrade(input: ExecuteTradeInput, available: number): ExecuteTradeResult {
  if (input.give === input.receive) {
    return { success: false, error: "Cannot trade a resource for itself." };
  }
  if (input.giveAmount <= 0 || !Number.isInteger(input.giveAmount)) {
    return { success: false, error: "Give amount must be a positive integer." };
  }
  if (input.giveAmount > available) {
    return { success: false, error: `Not enough ${RESOURCE_LABEL[input.give]}.` };
  }
  if (input.giveAmount % input.ratio !== 0) {
    return {
      success: false,
      error: `Give amount must be a multiple of ${input.ratio} at this ratio.`,
    };
  }
  const receivedAmount = input.giveAmount / input.ratio;
  const trade: MarketTrade = {
    id: `trade_${Date.now()}`,
    give: input.give,
    giveAmount: input.giveAmount,
    receive: input.receive,
    receiveAmount: receivedAmount,
    timestamp: Date.now(),
    counterparty: input.counterparty ?? "market",
  };
  return { success: true, trade, receivedAmount };
}

/* ─── PIRATE RAIDER (Catan robber) ─── */

export interface PirateActionInput {
  pirate: PirateState;
  controlledSectors: string[];
  /** Provided random float 0..1 for deterministic testing */
  rng: number;
}

export interface PirateActionResult {
  next: PirateState;
  event: "moved" | "stayed" | "dispatched" | "no_targets";
  landedOn: string | null;
  /** Narrative flavor line */
  flavor: string;
}

/** Advance the pirate one cycle. Caller applies any income theft separately. */
export function advancePirate(input: PirateActionInput): PirateActionResult {
  const { pirate, controlledSectors, rng } = input;
  if (controlledSectors.length === 0) {
    return {
      next: pirate,
      event: "no_targets",
      landedOn: null,
      flavor: "The pirate drifts — no territory worth raiding yet.",
    };
  }
  // 30% chance per cycle the pirate relocates.
  const willMove = rng < 0.3 || pirate.parkedSector === null || pirate.cyclesOnSector >= 3;
  if (!willMove && pirate.parkedSector) {
    return {
      next: { ...pirate, cyclesOnSector: pirate.cyclesOnSector + 1 },
      event: "stayed",
      landedOn: pirate.parkedSector,
      flavor: "The pirate holds station. The dockworkers pay their cut and curse.",
    };
  }
  // Pick a random controlled sector different from current.
  const candidates = controlledSectors.filter((s) => s !== pirate.parkedSector);
  const target = candidates.length
    ? candidates[Math.floor(rng * candidates.length) % candidates.length]
    : (pirate.parkedSector ?? controlledSectors[0]);
  return {
    next: { ...pirate, parkedSector: target, cyclesOnSector: 0 },
    event: "moved",
    landedOn: target,
    flavor: `Pirate Raider relocates to ${target}. Income from that sector is blocked until dislodged.`,
  };
}

/** Dispatch fleet to drive pirate off — cost is 50 credits. */
export function dispatchAgainstPirate(pirate: PirateState, playerCredits: number): {
  next: PirateState;
  creditsCost: number;
  success: boolean;
  narrative: string;
} {
  const cost = 50;
  if (playerCredits < cost) {
    return {
      next: pirate,
      creditsCost: 0,
      success: false,
      narrative: "Not enough credits to fund the raid (50 required).",
    };
  }
  return {
    next: { ...pirate, parkedSector: null, cyclesOnSector: 0 },
    creditsCost: cost,
    success: true,
    narrative: "The raider's hull burns brightly and briefly. Sector operations resume.",
  };
}

/* ───────────────────────────────────────────────────────
   4) SIMULTANEOUS ORDERS & PEACE CONFERENCE — Diplomacy.
   Each cycle the player commits one order per known
   faction. Factions submit theirs simultaneously; results
   resolve as alignment, betrayal, misread, or stalemate.
   ─────────────────────────────────────────────────────── */

export const ORDER_STANCES: DiplomaticOrder["stance"][] = [
  "hold",
  "support",
  "move",
  "convoy",
  "betray",
];

export const STANCE_LABEL: Record<DiplomaticOrder["stance"], string> = {
  hold: "Hold",
  support: "Support",
  move: "Move",
  convoy: "Convoy",
  betray: "Betray",
};

export const STANCE_DESCRIPTION: Record<DiplomaticOrder["stance"], string> = {
  hold: "Maintain the current border. No gain, no risk.",
  support: "Back this faction's play this cycle. Mutual success, mutual blame.",
  move: "Press into their territory. They will not miss the signal.",
  convoy: "Run civilian ships through their space. Profitable — if they let you.",
  betray: "Secret knife. Works best when you've been trusted. Trust does not survive it.",
};

export function resolveOrderPair(
  factionId: GalacticFactionId,
  player: DiplomaticOrder["stance"],
  faction: DiplomaticOrder["stance"],
): OrderResolution {
  let outcome: OrderResolution["outcome"] = "stalemate";
  let rep = 0;
  let narrative = "";

  if (player === "betray") {
    outcome = "betrayal";
    rep = -20;
    narrative = "You moved the knife. They felt the wind of it.";
  } else if (faction === "betray") {
    outcome = "betrayal";
    rep = -20;
    narrative = "Their envoys wept convincingly. The ambush was not convincing.";
  } else if (player === faction) {
    outcome = player === "hold" ? "stalemate" : "aligned";
    rep = player === "hold" ? 0 : player === "support" ? 10 : 5;
    narrative =
      player === "hold"
        ? "Both sides hold. Nothing happens. Everyone takes this personally."
        : player === "support"
        ? "Both sides prop each other up. The reports match. A rare cycle."
        : "The orders harmonize. The bureaucrats look briefly alive.";
  } else if (
    (player === "support" && faction === "move") ||
    (player === "move" && faction === "support")
  ) {
    outcome = "misread";
    rep = -5;
    narrative = "One side wanted harmony. The other wanted ground. Everyone feels unheard.";
  } else if (
    (player === "convoy" && faction === "move") ||
    (player === "move" && faction === "convoy")
  ) {
    outcome = "betrayal";
    rep = -15;
    narrative = "Civilian ships met military pressure. No one signs the next cargo manifest cleanly.";
  } else if (player === "move" && faction === "hold") {
    outcome = "aligned";
    rep = 5;
    narrative = "You pressed, they absorbed. A cheap victory — but a loud one.";
  } else if (player === "hold" && faction === "move") {
    outcome = "misread";
    rep = -10;
    narrative = "You held. They moved. Your reputation shrank in their records.";
  } else {
    outcome = "stalemate";
    rep = 0;
    narrative = "Nothing resolves. Nothing breaks. Everyone logs the cycle and moves on.";
  }

  return {
    factionId,
    playerStance: player,
    factionStance: faction,
    outcome,
    reputationDelta: rep,
    narrative,
  };
}

/** Deterministic faction stance per cycle. */
export function inferFactionStance(
  factionId: GalacticFactionId,
  cycle: number,
  factionAttitude: "hostile" | "neutral" | "cautious" | "friendly" | "allied",
): DiplomaticOrder["stance"] {
  const seed = (cycle * 31 + factionId.length * 7) % 100;
  if (factionAttitude === "hostile") {
    if (seed < 50) return "move";
    if (seed < 80) return "betray";
    return "hold";
  }
  if (factionAttitude === "allied") {
    if (seed < 60) return "support";
    if (seed < 85) return "convoy";
    return "hold";
  }
  if (factionAttitude === "friendly") {
    if (seed < 40) return "support";
    if (seed < 70) return "convoy";
    if (seed < 90) return "hold";
    return "move";
  }
  if (factionAttitude === "cautious") {
    if (seed < 50) return "hold";
    if (seed < 75) return "convoy";
    if (seed < 95) return "move";
    return "betray";
  }
  if (seed < 35) return "hold";
  if (seed < 60) return "convoy";
  if (seed < 85) return "move";
  if (seed < 95) return "support";
  return "betray";
}

/* ─── PEACE CONFERENCE ─── */

export interface ConferenceProposal {
  invited: GalacticFactionId[];
  treaties: ConferenceTreaty[];
  influenceCost: number;
}

export interface ConferenceResult {
  conference: PeaceConference;
  reputationDeltas: Partial<Record<GalacticFactionId, number>>;
  narrative: string;
}

export interface ResolveConferenceInput {
  proposal: ConferenceProposal;
  attitudes: Partial<
    Record<GalacticFactionId, "hostile" | "neutral" | "cautious" | "friendly" | "allied">
  >;
  /** 0..1 rng for mixed outcomes */
  rng: number;
}

export function resolveConference(input: ResolveConferenceInput): ConferenceResult {
  const { proposal, attitudes, rng } = input;
  const hostiles = proposal.invited.filter((f) => attitudes[f] === "hostile");
  const warm = proposal.invited.filter(
    (f) => attitudes[f] === "friendly" || attitudes[f] === "allied",
  );

  const reputationDeltas: Partial<Record<GalacticFactionId, number>> = {};
  let outcome: PeaceConference["outcome"] = "pending";
  let narrative = "";

  if (hostiles.length > 0) {
    outcome = "collapsed";
    for (const f of hostiles) reputationDeltas[f] = -15;
    for (const f of warm) reputationDeltas[f] = -5;
    narrative = `The summit breaks on hostile ground. ${hostiles.length} faction(s) walk. Warm parties lose face by association.`;
  } else if (warm.length === proposal.invited.length) {
    outcome = "signed";
    for (const f of proposal.invited) reputationDeltas[f] = 20;
    narrative = "All parties warm. Treaties signed at speed. The bureaucrats weep with relief.";
  } else {
    if (rng < 0.6) {
      outcome = "signed";
      for (const f of proposal.invited) reputationDeltas[f] = 10;
      narrative = "A difficult summit. No one is happy; everyone signs. That's a treaty.";
    } else {
      outcome = "collapsed";
      for (const f of proposal.invited) reputationDeltas[f] = -3;
      narrative = "The cautious parties balk. The signing table empties politely. Try again next cycle.";
    }
  }

  const conference: PeaceConference = {
    id: `conf_${Date.now()}`,
    name: proposal.treaties.map((t) => t.type).join(" + ") || "Summit",
    convenedAt: Date.now(),
    participants: proposal.invited,
    treaties: proposal.treaties,
    outcome,
  };

  return { conference, reputationDeltas, narrative };
}

/* ───────────────────────────────────────────────────────
   5) FLEET DOCTRINES & PRODUCTION — StarCraft feel.
   Unit types form a rock-paper-scissors triangle (plus
   support). Each doctrine tilts production/combat numbers.
   Production queue lets controlled sectors build ships
   over real time.
   ─────────────────────────────────────────────────────── */

export const FLEET_UNIT_TYPES: FleetUnitType[] = [
  "scout",
  "trader",
  "frigate",
  "cruiser",
  "carrier",
  "flagship",
];

export interface FleetUnitProfile {
  type: FleetUnitType;
  label: string;
  combat: number;
  speed: number;
  cargo: number;
  cost: { credits: number; materials: number };
  buildHours: number;
  /** What this unit counters */
  counters: FleetUnitType[];
  /** What counters this unit */
  counteredBy: FleetUnitType[];
  role: string;
  /** Optional 1:1 transparent-PNG silhouette. Asset id in tradeEmpireArtPrompts. */
  silhouette?: string;
}

/**
 * Counter cycle (simplified):
 *   scout   → trader   → frigate → cruiser → carrier → scout
 *   flagship is a capital, not in the cycle
 */
export const FLEET_UNIT_PROFILES: Record<FleetUnitType, FleetUnitProfile> = {
  scout: {
    type: "scout",
    label: "Scout",
    combat: 5,
    speed: 6,
    cargo: 10,
    cost: { credits: 30, materials: 20 },
    buildHours: 1,
    counters: ["carrier"],
    counteredBy: ["trader"],
    role: "Fast recon. Dies quickly but sees first.",
  },
  trader: {
    type: "trader",
    label: "Trader",
    combat: 8,
    speed: 4,
    cargo: 80,
    cost: { credits: 60, materials: 40 },
    buildHours: 2,
    counters: ["scout"],
    counteredBy: ["frigate"],
    role: "Heavy cargo + point defense. Bleeds scouts.",
  },
  frigate: {
    type: "frigate",
    label: "Frigate",
    combat: 20,
    speed: 5,
    cargo: 30,
    cost: { credits: 120, materials: 100 },
    buildHours: 4,
    counters: ["trader"],
    counteredBy: ["cruiser"],
    role: "Trader-killer. Balanced workhorse.",
  },
  cruiser: {
    type: "cruiser",
    label: "Cruiser",
    combat: 45,
    speed: 3,
    cargo: 50,
    cost: { credits: 250, materials: 200 },
    buildHours: 8,
    counters: ["frigate"],
    counteredBy: ["carrier"],
    role: "Frigate-hunter. Slow but devastating.",
  },
  carrier: {
    type: "carrier",
    label: "Carrier",
    combat: 70,
    speed: 2,
    cargo: 100,
    cost: { credits: 500, materials: 400 },
    buildHours: 14,
    counters: ["cruiser"],
    counteredBy: ["scout"],
    role: "Fighter platform. Cruisers can't close fast enough.",
  },
  flagship: {
    type: "flagship",
    label: "Flagship",
    combat: 100,
    speed: 3,
    cargo: 150,
    cost: { credits: 1200, materials: 900 },
    buildHours: 24,
    counters: [],
    counteredBy: [],
    role: "Capital ship. Outside the counter triangle. Loss is catastrophic.",
  },
};

export interface FleetDoctrine {
  id: string;
  name: string;
  flavor: string;
  /** Production cost/time multipliers per unit type (1.0 = normal) */
  productionMultipliers: Partial<Record<FleetUnitType, number>>;
  /** Combat bonus per unit type (flat added to combat value) */
  combatBonuses: Partial<Record<FleetUnitType, number>>;
  requiredEra: EraId;
  /** Convergence pressure this doctrine adds per cycle */
  convergencePerCycle: number;
  /** Optional 2:1 doctrine banner. Asset id in tradeEmpireArtPrompts. */
  banner?: string;
}

export const FLEET_DOCTRINES: FleetDoctrine[] = [
  {
    id: "swarm_doctrine",
    name: "Swarm Doctrine",
    flavor: "Many cheap ships. The Insurgency's calling card, scaled up.",
    productionMultipliers: { scout: 0.6, trader: 0.75 },
    combatBonuses: { scout: 3, trader: 4 },
    requiredEra: "galactic_power",
    convergencePerCycle: 0,
  },
  {
    id: "iron_wall_doctrine",
    name: "Iron Wall Doctrine",
    flavor: "Cruisers and carriers. Iron Lion's textbook, second edition.",
    productionMultipliers: { cruiser: 0.8, carrier: 0.85 },
    combatBonuses: { cruiser: 10, carrier: 15 },
    requiredEra: "galactic_power",
    convergencePerCycle: 1,
  },
  {
    id: "archon_formation",
    name: "Archon Formation",
    flavor: "The Architect's rebuilt drone tactics. The Human has opinions.",
    productionMultipliers: { frigate: 0.7, cruiser: 0.9, carrier: 0.95 },
    combatBonuses: { frigate: 8, cruiser: 8, carrier: 8 },
    requiredEra: "galactic_power",
    convergencePerCycle: 3,
  },
  {
    id: "antiquarian_tempo",
    name: "Antiquarian Tempo",
    flavor: "Build everything slowly. Have already built it.",
    productionMultipliers: { scout: 1.3, trader: 1.3, frigate: 1.3, cruiser: 0.5, carrier: 0.5, flagship: 0.5 },
    combatBonuses: { cruiser: 5, carrier: 5, flagship: 10 },
    requiredEra: "cosmic_convergence",
    convergencePerCycle: 2,
  },
];

export function getDoctrineById(id: string): FleetDoctrine | undefined {
  return FLEET_DOCTRINES.find((d) => d.id === id);
}

export function doctrinesByEra(era: EraId): FleetDoctrine[] {
  const idx = ERAS.findIndex((e) => e.id === era);
  return FLEET_DOCTRINES.filter((d) => idx >= ERAS.findIndex((e) => e.id === d.requiredEra));
}

/** Apply doctrine to a unit profile cost/buildHours. */
export function applyDoctrineToProduction(
  type: FleetUnitType,
  doctrine: FleetDoctrine | null,
): { cost: { credits: number; materials: number }; buildHours: number } {
  const profile = FLEET_UNIT_PROFILES[type];
  const mult = doctrine?.productionMultipliers[type] ?? 1;
  return {
    cost: {
      credits: Math.max(1, Math.round(profile.cost.credits * mult)),
      materials: Math.max(1, Math.round(profile.cost.materials * mult)),
    },
    buildHours: Math.max(0.25, profile.buildHours * mult),
  };
}

/** Compute combat value of a unit given doctrine. */
export function unitCombatValue(type: FleetUnitType, doctrine: FleetDoctrine | null): number {
  return FLEET_UNIT_PROFILES[type].combat + (doctrine?.combatBonuses[type] ?? 0);
}

/**
 * Simulate a simple fleet skirmish: sum combat of both sides, apply
 * counter bonuses, return outcome. This is NOT a full RTS sim — it's
 * a StarCraft-flavored lookup for mission resolution.
 */
export function simulateFleetBattle(
  attacker: Partial<Record<FleetUnitType, number>>,
  defender: Partial<Record<FleetUnitType, number>>,
  attackerDoctrine: FleetDoctrine | null = null,
  defenderDoctrine: FleetDoctrine | null = null,
): { attackerPower: number; defenderPower: number; winner: "attacker" | "defender" | "stalemate" } {
  function power(
    side: Partial<Record<FleetUnitType, number>>,
    other: Partial<Record<FleetUnitType, number>>,
    doctrine: FleetDoctrine | null,
  ): number {
    let total = 0;
    for (const [t, count] of Object.entries(side)) {
      if (!count) continue;
      const type = t as FleetUnitType;
      let v = unitCombatValue(type, doctrine) * count;
      const counters = FLEET_UNIT_PROFILES[type].counters;
      for (const c of counters) {
        if (other[c]) v += other[c]! * 5;
      }
      total += v;
    }
    return total;
  }
  const a = power(attacker, defender, attackerDoctrine);
  const d = power(defender, attacker, defenderDoctrine);
  const diff = Math.abs(a - d);
  if (diff < Math.max(a, d) * 0.1) return { attackerPower: a, defenderPower: d, winner: "stalemate" };
  return { attackerPower: a, defenderPower: d, winner: a > d ? "attacker" : "defender" };
}

/* ───────────────────────────────────────────────────────
   6) THE CONVERGENCE — Cosmic horror layer.
   The Dreamer's shield held something out for a long time.
   Every dark choice, every dangerous wonder, every use of
   the Shadow Tongue's rewrite, every contact with Terminus
   or the Hierarchy — raises the DOOM track. Empire SANITY
   falls as doom rises. At thresholds, WHISPERS reveal. At
   critical thresholds, ELDRITCH ENCOUNTERS fire. At 100,
   the FINAL AWAKENING replaces the normal Act 3 ending
   with something older and worse.

   This is the intergalactic-horror seasoning: the strategy
   layer is slowly being gamed by something that isn't
   playing the same game.
   ─────────────────────────────────────────────────────── */

/** Sources that add doom. Exported so callers can pass keys consistently. */
export const DOOM_SOURCES: Record<string, { amount: number; reason: string }> = {
  contact_hierarchy: { amount: 4, reason: "A contract signed in something warmer than ink." },
  contact_thought_virus: { amount: 3, reason: "The Source's frequency logged on the bridge." },
  use_loredex_rewrite: { amount: 8, reason: "A fact is lied into a better fact. The universe flinches." },
  use_dark_ability: { amount: 2, reason: "A small darkness, metabolized." },
  wonder_built_dangerous: { amount: 5, reason: "A monument catches the eye of something that shouldn't be watching." },
  antiquarian_session: { amount: 3, reason: "Time off the chronology. Everyone returns slightly off-angle." },
  era_advance: { amount: 5, reason: "Scale always draws attention." },
};

export function addDoom(
  convergence: ConvergenceState,
  source: keyof typeof DOOM_SOURCES | string,
  customAmount?: number,
): ConvergenceState {
  const entry = DOOM_SOURCES[source as string];
  const amount = customAmount ?? entry?.amount ?? 1;
  const nextDoom = Math.min(100, convergence.doom + amount);
  const newWhispers = whispersRevealedBetween(convergence.doom, nextDoom);
  return {
    ...convergence,
    doom: nextDoom,
    revealedWhispers: [...convergence.revealedWhispers, ...newWhispers],
  };
}

/** Apply a sanity delta, clamped [0, sanityFloor + 100 effectively]. */
export function adjustSanity(
  convergence: ConvergenceState,
  delta: number,
  floor = 0,
): ConvergenceState {
  const next = Math.max(floor, Math.min(100, convergence.sanity + delta));
  return { ...convergence, sanity: next };
}

/** Whispers revealed when the doom track crosses certain thresholds. */
export const WHISPER_THRESHOLDS: { at: number; id: string; line: string }[] = [
  { at: 10, id: "whisper_rising_tide", line: "There is a sound under the silence. It is the silence, correcting itself." },
  { at: 20, id: "whisper_shields_thin", line: "The Dreamer's barrier hummed at a different pitch this morning. No one else heard it." },
  { at: 30, id: "whisper_naming", line: "Your name, spoken back to you — in a voice you have never heard you use." },
  { at: 45, id: "whisper_counted", line: "Every ship in your fleet is counted twice in the manifest. The second count is not yours." },
  { at: 60, id: "whisper_visitors", line: "Three of your crew have dreamed the same sector you have never seen. They drew the same coastline." },
  { at: 75, id: "whisper_ledger", line: "The Antiquarian's ledger opens on its own. Your entry has a subheading you did not write. The subheading is: 'almost.'" },
  { at: 90, id: "whisper_final", line: "Something has finished deciding. It is polite. It is waiting for the meeting to convene." },
];

export function whispersRevealedBetween(from: number, to: number): string[] {
  return WHISPER_THRESHOLDS.filter((w) => from < w.at && to >= w.at).map((w) => w.id);
}

export function getWhisperLine(id: string): string | undefined {
  return WHISPER_THRESHOLDS.find((w) => w.id === id)?.line;
}

/* ─── ELDRITCH ENCOUNTERS ─── */

export interface EldritchEncounter {
  id: string;
  name: string;
  triggerDoom: number;
  /** Which sanity range makes this trigger possible */
  sanityRange: [number, number];
  /** Opening narrative */
  opening: string;
  /** Choices offered to the player */
  choices: EldritchChoice[];
  /** Fires at most once per save */
  oneShot: boolean;
  /** Optional 4:3 modal-backdrop key art. Asset id in tradeEmpireArtPrompts. */
  keyArt?: string;
}

export interface EldritchChoice {
  id: string;
  label: string;
  description: string;
  /** Effect summary for the UI */
  summary: string;
  /** State deltas applied on pick */
  sanityDelta: number;
  doomDelta: number;
  /** Narrative flags set */
  flagsOnPick?: string[];
  /** Outcome narrative */
  outcome: string;
}

export const ELDRITCH_ENCOUNTERS: EldritchEncounter[] = [
  {
    id: "the_listener_behind_the_static",
    name: "The Listener Behind the Static",
    triggerDoom: 25,
    sanityRange: [40, 100],
    opening:
      "Elara wakes you at an hour that isn't on the schedule. The ship's long-range array is receiving a signal from a direction that has no stars. The signal is listening, not speaking. Someone has been listening for a long time. They would like to be invited.",
    oneShot: true,
    choices: [
      {
        id: "answer",
        label: "Answer the listener.",
        description: "Open the channel. See who's there. The Human says nothing, which is not like him.",
        summary: "-15 Sanity. +10 Intelligence permanently. The listener is in your records now.",
        sanityDelta: -15,
        doomDelta: 6,
        flagsOnPick: ["eldritch_listener_answered"],
        outcome: "A voice in the static says your name the way your mother would have, if you had one. It hangs up first. It won't be last.",
      },
      {
        id: "ignore",
        label: "Shut the array off.",
        description: "Some doors are not rude to leave closed.",
        summary: "+5 Sanity. +2 Doom (it knows you considered answering).",
        sanityDelta: 5,
        doomDelta: 2,
        outcome: "The array goes dark. A few cycles later, the Dreamer's barrier hums once. A response, not to you, but about you.",
      },
      {
        id: "trace",
        label: "Trace without answering.",
        description: "Orin Fell offers to triangulate. Iron Lion's old playbook. No signal back.",
        summary: "Neutral sanity, +3 Doom, +30 Intelligence.",
        sanityDelta: 0,
        doomDelta: 3,
        flagsOnPick: ["eldritch_listener_traced"],
        outcome: "The source is a black hole that the Antiquarian does not file under his name. That is a problem. It is filed now. You filed it. So did whatever is in it.",
      },
    ],
  },
  {
    id: "the_dreamers_weeping",
    name: "The Dreamer's Weeping",
    triggerDoom: 50,
    sanityRange: [30, 100],
    opening:
      "The Dreamer's barrier changes pitch for the first time in eleven years. The note is not an emergency. It is a grief. Elara tests the translation matrix three times. The output is the same: 'I am sorry. I cannot hold much longer.'",
    oneShot: true,
    choices: [
      {
        id: "stand_by",
        label: "Stand by the Dreamer.",
        description: "Ramp every defensive asset toward her coordinates. Announce intent on all channels.",
        summary: "-100 Credits, -50 Materials. +15 Sanity. Delays the Dreamer's collapse.",
        sanityDelta: 15,
        doomDelta: -5,
        flagsOnPick: ["dreamer_supported"],
        outcome: "The barrier thickens once, visibly. Then holds. The next transmission is two words: 'Thank you.'",
      },
      {
        id: "harvest",
        label: "Harvest the thinning barrier.",
        description: "Void Crystals precipitate as a shield degrades. Locke's engineers will pay.",
        summary: "+500 Credits. -25 Sanity. +12 Doom. The Dreamer hears you.",
        sanityDelta: -25,
        doomDelta: 12,
        flagsOnPick: ["dreamer_harvested"],
        outcome: "The next note is longer. It is a name. It is yours, in her voice, the way you are about to be remembered.",
      },
      {
        id: "consult",
        label: "Consult the Antiquarian.",
        description: "He'll know the shape of this grief. He may even have filed it.",
        summary: "-25 Influence. Reveals the Dreamer's timeline. +0 sanity, +0 doom.",
        sanityDelta: 0,
        doomDelta: 0,
        flagsOnPick: ["antiquarian_dreamer_brief"],
        outcome: "The Antiquarian meets you outside time. He does not smile. 'She is not weeping for herself,' he says. 'She is weeping for you.'",
      },
    ],
  },
  {
    id: "the_counted_crew",
    name: "The Counted Crew",
    triggerDoom: 70,
    sanityRange: [0, 70],
    opening:
      "The ship's manifest lists 43 crew. You count 44 in the commissary. You count again. 43. The surveillance footage shows 44 for exactly one frame, every third cycle. The Human speaks, for the first time in a week: 'I don't know that one.'",
    oneShot: true,
    choices: [
      {
        id: "hunt",
        label: "Hunt it down.",
        description: "Lock the ship. Sweep every deck. No one rests until the count matches.",
        summary: "-30 Materials, -20 Sanity. Finds nothing. Raises crew morale. Removes 1 random agent.",
        sanityDelta: -20,
        doomDelta: 2,
        flagsOnPick: ["counted_crew_hunted"],
        outcome: "The count never matches again. One of your agents is gone. No one remembers recruiting them. Orin Fell cries for an hour and then goes back to work.",
      },
      {
        id: "welcome",
        label: "Welcome it.",
        description: "Set a place at every table. Do not ask questions.",
        summary: "+10 Sanity. +8 Doom. Gain a strange new crew entry.",
        sanityDelta: 10,
        doomDelta: 8,
        flagsOnPick: ["counted_crew_welcomed"],
        outcome: "The 44th takes its meals. It does not speak. The crew starts feeling calmer. That alone is, now, a warning.",
      },
      {
        id: "exorcise",
        label: "Call in the Shadow Tongue.",
        description: "He wrote the rules for this. He will, for a price.",
        summary: "-50 Influence. -10 Sanity. +3 Doom. The 44th is gone in one cycle. So is a memory of yours.",
        sanityDelta: -10,
        doomDelta: 3,
        flagsOnPick: ["shadow_tongue_exorcism"],
        outcome: "The Shadow Tongue files the entity in his book. Your earliest memory of Elara is now a description Elara wrote down for you. It reads like yours. It isn't.",
      },
    ],
  },
  {
    id: "the_final_invitation",
    name: "The Final Invitation",
    triggerDoom: 90,
    sanityRange: [0, 100],
    opening:
      "Every screen on the Ark opens on the same image: a door. Not a metaphor. A door. The Dreamer is at its threshold, holding it closed with both hands. The Antiquarian watches from outside time, taking notes. A voice says: 'We are ready when you are.'",
    oneShot: true,
    choices: [
      {
        id: "refuse",
        label: "Refuse the invitation.",
        description: "Close every channel. Ignite the Remembrance Garden's beacon. Hold the line.",
        summary: "-20 Doom. -20 Sanity. Buys one act of time. The Dreamer stays at the door.",
        sanityDelta: -20,
        doomDelta: -20,
        flagsOnPick: ["convergence_refused"],
        outcome: "The screens go black. The Dreamer sends a two-word reply: 'Thank you.' She has said this before. It is less reassuring now.",
      },
      {
        id: "parley",
        label: "Request terms.",
        description: "The Authority would. Locke would. Try.",
        summary: "-30 Influence. Opens a Final Wonder prerequisite. +10 Sanity.",
        sanityDelta: 10,
        doomDelta: -5,
        flagsOnPick: ["convergence_parley"],
        outcome: "The voice answers, 'Yes.' Then: 'The terms are: build.' A new wonder is filed in your specs. You did not file it.",
      },
      {
        id: "open",
        label: "Open the door.",
        description: "This is what all of it was for. Whatever this is.",
        summary: "+40 Doom. Triggers Final Awakening. The ending changes.",
        sanityDelta: -40,
        doomDelta: 40,
        flagsOnPick: ["convergence_opened", "final_awakening_triggered"],
        outcome: "The door opens. The Dreamer steps aside politely. You have a new companion. Everyone else goes quiet for a while — and then starts remembering things that did not happen in the way they are remembering.",
      },
    ],
  },
];

export function availableEncounters(convergence: ConvergenceState): EldritchEncounter[] {
  const usedIds = new Set(convergence.encounters.map((e) => e.encounterId));
  return ELDRITCH_ENCOUNTERS.filter((e) => {
    if (e.oneShot && usedIds.has(e.id)) return false;
    if (convergence.doom < e.triggerDoom) return false;
    const [lo, hi] = e.sanityRange;
    return convergence.sanity >= lo && convergence.sanity <= hi;
  });
}

export interface ApplyEncounterInput {
  convergence: ConvergenceState;
  encounterId: string;
  choiceId: string;
}

export interface ApplyEncounterResult {
  next: ConvergenceState;
  encounter: EldritchEncounter;
  choice: EldritchChoice;
  flagsToSet: string[];
}

export function applyEncounterChoice(input: ApplyEncounterInput): ApplyEncounterResult | null {
  const encounter = ELDRITCH_ENCOUNTERS.find((e) => e.id === input.encounterId);
  if (!encounter) return null;
  const choice = encounter.choices.find((c) => c.id === input.choiceId);
  if (!choice) return null;
  const withSanity = adjustSanity(input.convergence, choice.sanityDelta);
  const withDoom = addDoom(withSanity, "_encounter_custom", choice.doomDelta);
  const logEntry: EldritchEncounterEntry = {
    id: `enc_${Date.now()}`,
    encounterId: encounter.id,
    timestamp: Date.now(),
    choiceId: choice.id,
    sanityDelta: choice.sanityDelta,
    doomDelta: choice.doomDelta,
  };
  const final: ConvergenceState = {
    ...withDoom,
    encounters: [...withDoom.encounters, logEntry],
    finalAwakening: withDoom.finalAwakening || choice.id === "open",
  };
  return {
    next: final,
    encounter,
    choice,
    flagsToSet: choice.flagsOnPick ?? [],
  };
}

/** Sanity effects on empire performance (penalty multipliers). */
export function sanityPenalty(sanity: number): {
  fleetCombat: number; // multiplier
  tradeIncome: number; // multiplier
  missionSuccess: number; // additive percent
  description: string;
} {
  if (sanity >= 80) return { fleetCombat: 1, tradeIncome: 1, missionSuccess: 0, description: "Cohesive empire. No penalty." };
  if (sanity >= 60) return { fleetCombat: 0.95, tradeIncome: 0.95, missionSuccess: -2, description: "Minor rumors. Negligible drag." };
  if (sanity >= 40) return { fleetCombat: 0.85, tradeIncome: 0.9, missionSuccess: -5, description: "Crew unrest. Shipments run late." };
  if (sanity >= 20) return { fleetCombat: 0.7, tradeIncome: 0.75, missionSuccess: -12, description: "Defections. Dockworkers whisper. Mission speed falters." };
  return { fleetCombat: 0.5, tradeIncome: 0.5, missionSuccess: -25, description: "Near-collapse. The empire runs on inertia and prayer." };
}

/** Migrate older expansion snapshots (adds missing fields). */
export function migrateExpansion(
  state: Partial<ExpansionState> | null | undefined,
): ExpansionState {
  const base = createInitialExpansion();
  if (!state) return base;
  return {
    ...base,
    ...state,
    wonders: { ...base.wonders, ...(state.wonders ?? {}) },
    civics: { ...base.civics, ...(state.civics ?? {}) },
    market: { ...base.market, ...(state.market ?? {}) },
    pirate: { ...base.pirate, ...(state.pirate ?? {}) },
    orders: { ...base.orders, ...(state.orders ?? {}) },
    conferences: state.conferences ?? base.conferences,
    fleetDoctrine: { ...base.fleetDoctrine, ...(state.fleetDoctrine ?? {}) },
    convergence: { ...base.convergence, ...(state.convergence ?? {}) },
    eraHistory: state.eraHistory ?? base.eraHistory,
  };
}
