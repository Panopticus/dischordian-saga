// ============================================================================
// ENVIRONMENTAL CLUE SYSTEM
// Discoverable clues that appear in rooms BEFORE puzzles activate.
// Players who explore carefully will find hints toward puzzle solutions.
// ============================================================================

export type DiscoveryMethod = "exploration" | "npc_dialog" | "item_inspect";

export interface EnvironmentalClue {
  id: string;
  roomId: string;       // Where the clue is found
  puzzleId: string;     // Which puzzle this clue helps solve
  text: string;         // What the player sees when they discover the clue
  discoveryMethod: DiscoveryMethod;
  discovered: boolean;
}

// ---------------------------------------------------------------------------
// Bridge Power Relay — binary 1047
// ---------------------------------------------------------------------------
const BRIDGE_CLUES: EnvironmentalClue[] = [
  {
    id: "clue-bridge-01",
    roomId: "bridge",
    puzzleId: "puzzle-bridge",
    text: "An emergency panel on the wall is labeled 'ARK DESIGNATION: 1047'. The number is etched deep into the metal, as though someone wanted to make sure it could never be forgotten.",
    discoveryMethod: "exploration",
    discovered: false,
  },
  {
    id: "clue-bridge-02",
    roomId: "bridge",
    puzzleId: "puzzle-bridge",
    text: "A crewmate's handwritten note is taped to the relay console: 'Binary saves lives. Convert the numbers. If the relays go dark, this is the only way back.'",
    discoveryMethod: "item_inspect",
    discovered: false,
  },
  {
    id: "clue-bridge-03",
    roomId: "bridge",
    puzzleId: "puzzle-bridge",
    text: "Elara glances at the dormant relay panel. 'Our Ark number is 1047. Every system on this ship is keyed to it — including the emergency power grid.'",
    discoveryMethod: "npc_dialog",
    discovered: false,
  },
];

// ---------------------------------------------------------------------------
// Archives Riddle — answer: "lore"
// ---------------------------------------------------------------------------
const ARCHIVES_CLUES: EnvironmentalClue[] = [
  {
    id: "clue-archives-01",
    roomId: "archives",
    puzzleId: "puzzle-archives",
    text: "A heavy book lies open on a reading stand. The visible page is titled 'On the Thread That Connects.' The margin note reads: 'All things are bound by what is remembered.'",
    discoveryMethod: "exploration",
    discovered: false,
  },
  {
    id: "clue-archives-02",
    roomId: "archives",
    puzzleId: "puzzle-archives",
    text: "The Antiquarian's personal note is pinned to a shelf: 'What is remembered cannot be destroyed. What is forgotten was never truly real. The archives exist because of this singular truth.'",
    discoveryMethod: "item_inspect",
    discovered: false,
  },
];

// ---------------------------------------------------------------------------
// Comms Cipher — Caesar shift-3
// ---------------------------------------------------------------------------
const COMMS_CLUES: EnvironmentalClue[] = [
  {
    id: "clue-comms-01",
    roomId: "comms-array",
    puzzleId: "puzzle-comms",
    text: "A small decoder ring sits on the communications desk. Its outer wheel is locked in position — the offset indicator points firmly to the number '3'.",
    discoveryMethod: "item_inspect",
    discovered: false,
  },
  {
    id: "clue-comms-02",
    roomId: "comms-array",
    puzzleId: "puzzle-comms",
    text: "Agent Zero's encrypted log, partially decoded: 'Standard shift protocol. Always three. Anyone who forgets the offset deserves the static they get.'",
    discoveryMethod: "exploration",
    discovered: false,
  },
];

// ---------------------------------------------------------------------------
// Observation Deck Keycard — found in Medical Bay
// ---------------------------------------------------------------------------
const OBSERVATION_CLUES: EnvironmentalClue[] = [
  {
    id: "clue-observation-01",
    roomId: "medical-bay",
    puzzleId: "puzzle-observation",
    text: "A reinforced safe in the Medical Bay has a small glass window. Through it, you can see a keycard with 'OBS-DECK ACCESS' printed on its surface.",
    discoveryMethod: "exploration",
    discovered: false,
  },
  {
    id: "clue-observation-02",
    roomId: "medical-bay",
    puzzleId: "puzzle-observation",
    text: "Elara pauses near the medical safe. 'I stored emergency keycards in the Medical Bay safe during the last crisis. The Observation Deck card should still be in there.'",
    discoveryMethod: "npc_dialog",
    discovered: false,
  },
];

// ---------------------------------------------------------------------------
// Engineering Sequence — PLNS (Power, Life Support, Navigation, Shields)
// ---------------------------------------------------------------------------
const ENGINEERING_CLUES: EnvironmentalClue[] = [
  {
    id: "clue-engineering-01",
    roomId: "engineering",
    puzzleId: "puzzle-engineering",
    text: "A laminated boot manual is bolted to the wall beside the console. The page on display shows the system priority order: 'In any cold-start scenario, subsystems must initialize in strict dependency order.'",
    discoveryMethod: "exploration",
    discovered: false,
  },
  {
    id: "clue-engineering-02",
    roomId: "engineering",
    puzzleId: "puzzle-engineering",
    text: "A faded mnemonic poster hangs above the engineering workbench. In bold letters: 'Potentials Launch New Ships' — with the first letter of each word circled in red marker.",
    discoveryMethod: "item_inspect",
    discovered: false,
  },
];

// ---------------------------------------------------------------------------
// Armory Riddle — answer: "courage"
// ---------------------------------------------------------------------------
const ARMORY_CLUES: EnvironmentalClue[] = [
  {
    id: "clue-armory-01",
    roomId: "armory",
    puzzleId: "puzzle-armory",
    text: "Agent Zero's inscription is carved into the wall beside the armory door: 'Not a blade, but what makes you pick one up. Not armor, but what makes you stand when you should run.'",
    discoveryMethod: "exploration",
    discovered: false,
  },
  {
    id: "clue-armory-02",
    roomId: "armory",
    puzzleId: "puzzle-armory",
    text: "A small war memorial is set into an alcove near the armory entrance. The names of fallen crew are listed beneath a single engraved word: 'COURAGE'.",
    discoveryMethod: "item_inspect",
    discovered: false,
  },
];

// ---------------------------------------------------------------------------
// Cargo Cipher — reverse cipher
// ---------------------------------------------------------------------------
const CARGO_CLUES: EnvironmentalClue[] = [
  {
    id: "clue-cargo-01",
    roomId: "cargo-hold",
    puzzleId: "puzzle-cargo",
    text: "A full-length mirror is mounted on the cargo hold wall, seemingly out of place among crates and machinery. Someone has written 'THINK REFLECTION' across it in grease pencil.",
    discoveryMethod: "exploration",
    discovered: false,
  },
  {
    id: "clue-cargo-02",
    roomId: "cargo-hold",
    puzzleId: "puzzle-cargo",
    text: "A crumpled note wedged between two crates reads: 'Read it backwards, like time. The cargo master was paranoid — everything here is mirrored.'",
    discoveryMethod: "item_inspect",
    discovered: false,
  },
];

// ---------------------------------------------------------------------------
// Captain's Quarters Key — hidden on the Bridge
// ---------------------------------------------------------------------------
const CAPTAINS_CLUES: EnvironmentalClue[] = [
  {
    id: "clue-captains-01",
    roomId: "bridge",
    puzzleId: "puzzle-captains",
    text: "The bridge command chair has a subtle seam along its left armrest. Pressing it reveals a small hidden compartment — just large enough to hold a key.",
    discoveryMethod: "exploration",
    discovered: false,
  },
  {
    id: "clue-captains-02",
    roomId: "bridge",
    puzzleId: "puzzle-captains",
    text: "Elara lowers her voice near the command chair. 'The captain kept a master key near the command chair. Old habit — she never trusted digital locks alone.'",
    discoveryMethod: "npc_dialog",
    discovered: false,
  },
];

// ---------------------------------------------------------------------------
// Master registry — all clues indexed for lookup
// ---------------------------------------------------------------------------
export const ALL_CLUES: EnvironmentalClue[] = [
  ...BRIDGE_CLUES,
  ...ARCHIVES_CLUES,
  ...COMMS_CLUES,
  ...OBSERVATION_CLUES,
  ...ENGINEERING_CLUES,
  ...ARMORY_CLUES,
  ...CARGO_CLUES,
  ...CAPTAINS_CLUES,
];

/** Look up every clue located in a specific room. */
export function getCluesForRoom(roomId: string): EnvironmentalClue[] {
  return ALL_CLUES.filter((c) => c.roomId === roomId);
}

/** Look up every clue that hints at a specific puzzle. */
export function getCluesForPuzzle(puzzleId: string): EnvironmentalClue[] {
  return ALL_CLUES.filter((c) => c.puzzleId === puzzleId);
}

/** Mark a clue as discovered and return the updated clue. */
export function discoverClue(clueId: string): EnvironmentalClue | undefined {
  const clue = ALL_CLUES.find((c) => c.id === clueId);
  if (clue) {
    clue.discovered = true;
  }
  return clue;
}

/** Return the number of discovered clues for a given puzzle (useful for UI). */
export function discoveredCountForPuzzle(puzzleId: string): number {
  return ALL_CLUES.filter((c) => c.puzzleId === puzzleId && c.discovered).length;
}

/** Reset all clues to undiscovered (used on new game). */
export function resetAllClues(): void {
  ALL_CLUES.forEach((c) => {
    c.discovered = false;
  });
}
