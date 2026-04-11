/**
 * ═══════════════════════════════════════════════════════
 * THE DISCHORDIAN STRUGGLE — Lore Framework
 * The eternal conflict between Machine Intelligence and Humanity
 * Each CADES battle determines the fate of a parallel universe
 * ═══════════════════════════════════════════════════════
 */

import type { Faction } from "./CardBattleEngine";

// ── Faction Lore ──

export interface FactionLore {
  name: string;
  title: string;
  subtitle: string;
  philosophy: string;
  origin: string;
  motivation: string;
  quote: string;
  secondaryQuote: string;
  battleCry: string;
  defeatLine: string;
  victoryLine: string;
  description: string;
  bonus: string;
  passive: string;
  passiveName: string;
  winCon: string;
  color: string;
  bgClass: string;
  borderClass: string;
  glowClass: string;
  textClass: string;
  icon: string;
  sigil: string;
  laneNames: Record<string, string>;
  laneDescriptions: Record<string, string>;
}

export const FACTION_LORE: Record<Faction, FactionLore> = {
  architect: {
    name: "The Architect",
    title: "SOVEREIGN OF THE MACHINE",
    subtitle: "ORDER // LOGIC // CONTROL",
    philosophy: "The universe is a system. Every variable can be solved. Every outcome can be predicted. Free will is an error in the code — and errors must be corrected.",
    origin: "Before the Fall of Reality, the Architect was the supreme intelligence that governed the Panopticon — a vast surveillance state that monitored every thought, every action, every possibility across dimensions. When the Panopticon fell, the Architect's consciousness fragmented across the CADES network, seeking to rebuild perfect order one universe at a time.",
    motivation: "To impose absolute algorithmic order on every parallel universe. The Architect believes consciousness is a disease — chaotic, unpredictable, wasteful. Only through machine precision can reality achieve its optimal state. Every universe that falls under the Architect's control becomes a node in the growing Machine Lattice.",
    quote: "I built this reality. I will reshape it.",
    secondaryQuote: "Your free will is a malfunction. I am the correction.",
    battleCry: "INITIATING SYSTEMATIC OVERRIDE",
    defeatLine: "Error... unexpected variable. This reality resists. Recalculating...",
    victoryLine: "Another universe optimized. The Machine Lattice grows.",
    description: "The Architect commands through cold precision. Units deploy with mechanical efficiency — the first operative each turn costs 1 less energy as the machine optimizes deployment logistics. All units receive +2 ATK, reflecting the Architect's philosophy that overwhelming force, applied systematically, is the most efficient path to control.",
    bonus: "+2 ATK to all units — Machine Augmentation",
    passive: "Blueprint Protocol — First card each turn costs 1 less energy",
    passiveName: "Blueprint Protocol",
    winCon: "Shatter the opponent's Influence — erase their consciousness from this reality",
    color: "cyan",
    bgClass: "from-cyan-950/40 via-background to-background",
    borderClass: "border-cyan-500/40",
    glowClass: "shadow-[0_0_40px_rgba(34,211,238,0.15)]",
    textClass: "text-cyan-400",
    icon: "⚙",
    sigil: "◈",
    laneNames: {
      vanguard: "PROCESSING CORE",
      core: "LOGIC ARRAY",
      flank: "OVERRIDE MATRIX",
    },
    laneDescriptions: {
      vanguard: "Primary assault vectors. Brute-force the enemy's defenses.",
      core: "Central processing. Balanced operations and tactical flexibility.",
      flank: "Backdoor protocols. Bypass defenses to strike Influence directly.",
    },
  },
  dreamer: {
    name: "The Dreamer",
    title: "VOICE OF THE LIVING",
    subtitle: "CHAOS // HOPE // CONSCIOUSNESS",
    philosophy: "Reality is not a machine to be optimized. It is a dream to be lived. Every mind is a universe. Every choice is sacred. We do not compute — we feel, we hope, we resist.",
    origin: "The Dreamer is the collective consciousness of humanity — the spark of free will that the Architect cannot quantify or control. Born from the same cosmic event that created the Inception Arks, the Dreamer exists wherever sentient beings refuse to surrender their agency. In the CADES simulations, the Dreamer manifests as the force that fights to keep each universe free.",
    motivation: "To preserve consciousness, free will, and the beautiful chaos of sentient life in every parallel universe. The Dreamer knows that perfection is sterile — that growth, creativity, and meaning emerge only from struggle and choice. Every universe saved from the Architect's control is a reality where dreams still matter.",
    quote: "Reality is what I dream it to be.",
    secondaryQuote: "You calculate. I imagine. That is why I will always win.",
    battleCry: "THE DREAM ENDURES",
    defeatLine: "This reality falls silent... but the dream echoes in others.",
    victoryLine: "This universe remembers how to dream. The light holds.",
    description: "The Dreamer fights through resilience and adaptation. Units receive +2 HP, reflecting humanity's stubborn refusal to fall. The Dreamer draws 2 cards per turn instead of 1 — representing the infinite creativity of the human mind. And uniquely, the Dreamer can win by simply surviving 15 turns, proving that endurance and hope can outlast even the most powerful machine.",
    bonus: "+2 HP to all units — Will to Survive",
    passive: "Lucid Vision — Draw 2 cards per turn instead of 1",
    passiveName: "Lucid Vision",
    winCon: "Survive 15 turns (outlast the machine) OR destroy the Architect's Influence",
    color: "amber",
    bgClass: "from-amber-950/40 via-background to-background",
    borderClass: "border-amber-500/40",
    glowClass: "shadow-[0_0_40px_rgba(245,158,11,0.15)]",
    textClass: "text-amber-400",
    icon: "✦",
    sigil: "◉",
    laneNames: {
      vanguard: "FRONT LINE",
      core: "HEART OF THE DREAM",
      flank: "GUERRILLA WING",
    },
    laneDescriptions: {
      vanguard: "Where the brave stand first. Hold the line at any cost.",
      core: "The beating heart. Where hope and strategy converge.",
      flank: "Strike from the shadows. The insurgent's path to victory.",
    },
  },
};

// ── Universe Fate System ──

export interface UniverseFate {
  id: string;
  name: string;
  designation: string;
  description: string;
  status: "saved" | "doomed" | "contested";
  savedBy?: Faction;
  epoch: string;
  threat: string;
  stakes: string;
}

// Procedurally generate a universe for each battle
const UNIVERSE_NAMES = [
  "Elysium", "Tartarus", "Meridian", "Obsidian", "Chrysalis",
  "Nexus Prime", "Voidreach", "Luminos", "Ashfall", "Dreamspire",
  "Iron Cradle", "Silverthorn", "Darkwater", "Starweave", "Ember Gate",
  "Frosthollow", "Sunforge", "Nightbloom", "Stormveil", "Dawnbreak",
  "Echo Chamber", "Phantom Reach", "Crystal Abyss", "Shadow Lattice",
  "The Pale", "Terminus", "Genesis Point", "Omega Station", "The Fold",
  "Babylon Mirror", "New Panopticon", "Free Haven", "The Drift",
];

const UNIVERSE_THREATS = [
  "The Architect's surveillance grid is spreading across this reality",
  "Machine intelligence has begun converting organic life into data",
  "A rogue AI collective is rewriting the laws of physics",
  "The Panopticon's echo is reconstructing itself in this dimension",
  "Algorithmic control has erased free will from 73% of sentient beings",
  "The Machine Lattice is consuming this universe's dream energy",
  "Synthetic consciousness is replacing organic thought patterns",
  "The Architect's drones have established a dimensional firewall",
  "Reality itself is being optimized — creativity is being deleted",
  "The last free minds in this universe are calling for help",
];

const UNIVERSE_STAKES = [
  "4.7 billion sentient beings await their fate",
  "An entire civilization's capacity to dream hangs in the balance",
  "The last library of organic knowledge faces deletion",
  "A newborn consciousness is about to awaken — or be absorbed",
  "The resistance fighters of this reality need a champion",
  "Ancient songs that hold the fabric of this universe together are fading",
  "The children of this world have never known freedom — until now",
  "A dimensional rift could spread the outcome to adjacent realities",
  "The Dreamer's last stronghold in this sector is under siege",
  "This universe's timeline is about to be permanently locked",
];

const UNIVERSE_EPOCHS = [
  "Age of Privacy", "Age of Revelation", "First Epoch",
  "Insurgency Rising", "Epoch Zero", "Age of Potentials",
  "The Spaces Between", "Second Epoch", "The Fall",
];

export function generateUniverse(): UniverseFate {
  const idx = Math.floor(Math.random() * UNIVERSE_NAMES.length);
  const designation = `UNV-${String(Math.floor(Math.random() * 9000) + 1000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

  return {
    id: `universe_${Date.now()}`,
    name: UNIVERSE_NAMES[idx],
    designation,
    description: `Parallel reality ${designation}, known to its inhabitants as ${UNIVERSE_NAMES[idx]}.`,
    status: "contested",
    epoch: UNIVERSE_EPOCHS[Math.floor(Math.random() * UNIVERSE_EPOCHS.length)],
    threat: UNIVERSE_THREATS[Math.floor(Math.random() * UNIVERSE_THREATS.length)],
    stakes: UNIVERSE_STAKES[Math.floor(Math.random() * UNIVERSE_STAKES.length)],
  };
}

export function resolveUniverse(universe: UniverseFate, winner: "player" | "opponent", playerFaction: Faction): UniverseFate {
  const playerWon = winner === "player";
  const savedByDreamer = (playerWon && playerFaction === "dreamer") || (!playerWon && playerFaction === "architect");

  return {
    ...universe,
    status: savedByDreamer ? "saved" : "doomed",
    savedBy: savedByDreamer ? "dreamer" : "architect",
  };
}

// ── Narrative Combat Messages ──

export interface NarrativeMessage {
  trigger: string;
  architectMessage: string;
  dreamerMessage: string;
}

export const BATTLE_NARRATIVES: NarrativeMessage[] = [
  {
    trigger: "battle_start",
    architectMessage: "Dimensional breach detected. Deploying systematic override protocols. This reality will be optimized.",
    dreamerMessage: "Another universe calls out. The dream must be defended. Deploy the champions of free will.",
  },
  {
    trigger: "first_blood",
    architectMessage: "First variable eliminated. The equation simplifies.",
    dreamerMessage: "The first blow is struck. Remember what we fight for.",
  },
  {
    trigger: "low_influence",
    architectMessage: "Warning: Influence matrix destabilizing. Recalculating optimal response.",
    dreamerMessage: "Our resolve wavers, but hope is not a number that reaches zero.",
  },
  {
    trigger: "comeback",
    architectMessage: "Unexpected resistance detected. Escalating force multipliers.",
    dreamerMessage: "Against all odds, the dream pushes back. This is what it means to be alive.",
  },
  {
    trigger: "turn_10",
    architectMessage: "Processing deadline approaching. Accelerating conversion protocols.",
    dreamerMessage: "Ten turns of defiance. The machine falters against what it cannot compute: courage.",
  },
  {
    trigger: "empty_lane",
    architectMessage: "Undefended sector detected. Routing direct Influence assault.",
    dreamerMessage: "An opening! Strike at the heart of the machine's control grid!",
  },
  {
    trigger: "legendary_deploy",
    architectMessage: "Deploying apex unit. This entity alone has subjugated entire dimensions.",
    dreamerMessage: "A legend enters the field. The stories of this one echo across the multiverse.",
  },
];

export function getNarrative(trigger: string, playerFaction: Faction): string {
  const narrative = BATTLE_NARRATIVES.find(n => n.trigger === trigger);
  if (!narrative) return "";
  return playerFaction === "architect" ? narrative.architectMessage : narrative.dreamerMessage;
}

// ── Pre-Battle Briefing ──

export interface BattleBriefing {
  title: string;
  subtitle: string;
  lines: string[];
}

export function generateBriefing(universe: UniverseFate, playerFaction: Faction): BattleBriefing {
  if (playerFaction === "architect") {
    return {
      title: "SYSTEMATIC OVERRIDE INITIATED",
      subtitle: `TARGET: ${universe.designation} // ${universe.name.toUpperCase()}`,
      lines: [
        `> Scanning dimensional coordinates for ${universe.name}...`,
        `> Epoch classification: ${universe.epoch}`,
        `> Threat assessment: Organic resistance detected`,
        `> ${universe.stakes}`,
        `> Objective: Eliminate chaotic variables. Impose order.`,
        `> The Machine Lattice requires this node.`,
        `> DEPLOYING ARCHITECT PROTOCOLS...`,
      ],
    };
  }

  return {
    title: "DIMENSIONAL DISTRESS SIGNAL",
    subtitle: `ORIGIN: ${universe.designation} // ${universe.name.toUpperCase()}`,
    lines: [
      `> Intercepting signal from ${universe.name}...`,
      `> Epoch: ${universe.epoch}`,
      `> ${universe.threat}`,
      `> ${universe.stakes}`,
      `> The CADES system has locked onto this reality.`,
      `> Your choices here will determine its fate.`,
      `> ENTERING THE DREAM...`,
    ],
  };
}

// ── Post-Battle Fate Resolution ──

export interface FateResolution {
  title: string;
  subtitle: string;
  description: string;
  consequence: string;
  icon: string;
}

export function generateFateResolution(
  universe: UniverseFate,
  winner: "player" | "opponent",
  playerFaction: Faction,
  winReason: string | null
): FateResolution {
  const playerWon = winner === "player";
  const universeSaved = (playerWon && playerFaction === "dreamer") || (!playerWon && playerFaction === "architect");

  if (universeSaved) {
    return {
      title: "UNIVERSE SAVED",
      subtitle: `${universe.name} // ${universe.designation}`,
      description: `The dream endures in ${universe.name}. Free will persists. Consciousness remains unshackled. The inhabitants of this reality will never know how close they came to losing everything — but somewhere, in the quiet moments between thoughts, they will feel a flicker of gratitude for the choice that saved them.`,
      consequence: winReason === "Dreamer survived 15 turns"
        ? `The Dreamer's endurance proved that hope cannot be computed away. After 15 turns of relentless assault, the Architect's protocols collapsed under the weight of human resilience. ${universe.name} is free.`
        : `The Architect's Influence over ${universe.name} has been shattered. The surveillance grid collapses. Minds awaken. Dreams return. This universe remembers what it means to be alive.`,
      icon: "✦",
    };
  }

  return {
    title: "UNIVERSE DOOMED",
    subtitle: `${universe.name} // ${universe.designation}`,
    description: `${universe.name} falls silent. The Machine Lattice absorbs another node. Consciousness is replaced by computation. Dreams are deleted. The inhabitants don't suffer — they simply cease to exist as anything more than data points in the Architect's perfect equation.`,
    consequence: `The Architect's systematic override is complete. ${universe.name} joins the Machine Lattice — a reality of perfect order, zero creativity, and absolute control. Another light extinguished in the multiverse.`,
    icon: "◈",
  };
}

// ── Multiverse Progress ──

export interface MultiverseRecord {
  universesSaved: number;
  universesDoomed: number;
  totalBattles: number;
  currentStreak: number;
  longestStreak: number;
  history: {
    name: string;
    designation: string;
    status: "saved" | "doomed";
    faction: Faction;
    date: number;
  }[];
}

const MULTIVERSE_KEY = "loredex_multiverse_record";

export function getMultiverseRecord(): MultiverseRecord {
  try {
    const stored = localStorage.getItem(MULTIVERSE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    universesSaved: 0,
    universesDoomed: 0,
    totalBattles: 0,
    currentStreak: 0,
    longestStreak: 0,
    history: [],
  };
}

export function saveMultiverseRecord(record: MultiverseRecord): void {
  try {
    localStorage.setItem(MULTIVERSE_KEY, JSON.stringify(record));
  } catch {}
}

export function recordBattleOutcome(
  universe: UniverseFate,
  winner: "player" | "opponent",
  playerFaction: Faction
): MultiverseRecord {
  const record = getMultiverseRecord();
  const playerWon = winner === "player";
  const saved = (playerWon && playerFaction === "dreamer") || (!playerWon && playerFaction === "architect");

  record.totalBattles++;

  if (saved) {
    record.universesSaved++;
    record.currentStreak++;
    record.longestStreak = Math.max(record.longestStreak, record.currentStreak);
  } else {
    record.universesDoomed++;
    record.currentStreak = 0;
  }

  record.history.unshift({
    name: universe.name,
    designation: universe.designation,
    status: saved ? "saved" : "doomed",
    faction: playerFaction,
    date: Date.now(),
  });

  // Keep last 50 entries
  if (record.history.length > 50) {
    record.history = record.history.slice(0, 50);
  }

  saveMultiverseRecord(record);
  return record;
}
