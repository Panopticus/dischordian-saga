/* ═══════════════════════════════════════════════════════
   FACTION WAR EVENTS
   Timed server-wide events where Empire vs Insurgency
   reputation totals determine sector control and unlock
   exclusive trade routes.
   ═══════════════════════════════════════════════════════ */

export interface FactionWarEvent {
  id: string;
  name: string;
  description: string;
  /** Duration in game-turns (warps) */
  duration: number;
  /** Which factions are competing */
  factions: [string, string];
  /** Sectors being contested */
  contestedSectors: string[];
  /** Rewards for the winning faction's supporters */
  victoryRewards: {
    credits: number;
    materials: { materialId: string; quantity: number }[];
    exclusiveRoute?: ExclusiveTradeRoute;
  };
  /** Narrative text for different outcomes */
  narratives: {
    start: string;
    empireWin: string;
    insurgencyWin: string;
    stalemate: string;
  };
  /** Minimum player level (conexusXp) to participate */
  minLevel: number;
  /** Visual theme */
  color: string;
  icon: string;
}

export interface ExclusiveTradeRoute {
  id: string;
  name: string;
  description: string;
  fromSector: string;
  toSector: string;
  /** Price multiplier for goods on this route (lower = more profitable) */
  priceMultiplier: number;
  /** How many warps the route stays open after the war ends */
  expiresAfterWarps: number;
}

export interface FactionWarState {
  activeWar: string | null;
  warProgress: number; // 0 to duration
  empireContribution: number;
  insurgencyContribution: number;
  playerContribution: number;
  playerFaction: "empire" | "insurgency" | null;
  completedWars: string[];
  activeExclusiveRoutes: { routeId: string; warpsRemaining: number }[];
  warHistory: { warId: string; winner: string; playerContribution: number }[];
}

export const DEFAULT_FACTION_WAR_STATE: FactionWarState = {
  activeWar: null,
  warProgress: 0,
  empireContribution: 0,
  insurgencyContribution: 0,
  playerContribution: 0,
  playerFaction: null,
  completedWars: [],
  activeExclusiveRoutes: [],
  warHistory: [],
};

export const FACTION_WAR_EVENTS: FactionWarEvent[] = [
  {
    id: "fw_nebula_siege",
    name: "The Nebula Siege",
    description: "The Empire's 7th Fleet has blockaded the Crystal Nebula, cutting off Insurgency supply lines. Both sides are pouring resources into the contested zone. Every trade you make in the region tips the balance.",
    duration: 15,
    factions: ["empire", "insurgency"],
    contestedSectors: ["crystal_nebula", "outer_rim_alpha", "deep_space_gamma"],
    victoryRewards: {
      credits: 50000,
      materials: [
        { materialId: "crystal_shard", quantity: 10 },
        { materialId: "void_metal", quantity: 3 },
      ],
      exclusiveRoute: {
        id: "nebula_express",
        name: "Nebula Express Lane",
        description: "A cleared hyperspace corridor through the Crystal Nebula. Drastically reduces trade costs.",
        fromSector: "crystal_nebula",
        toSector: "core_worlds",
        priceMultiplier: 0.6,
        expiresAfterWarps: 20,
      },
    },
    narratives: {
      start: "PRIORITY TRANSMISSION // ALL FREQUENCIES\n\n\"This is Admiral Kross of the Imperial 7th Fleet. The Crystal Nebula is now under Imperial blockade. All Insurgency vessels will be fired upon. Traders: choose your side carefully. Your cargo runs will determine who controls this sector.\"\n\nThe war for the Nebula has begun. Every trade you make in contested sectors contributes to your faction's war effort.",
      empireWin: "The Empire's blockade holds. The Insurgency retreats from the Crystal Nebula, their supply lines severed. Admiral Kross broadcasts on all frequencies: \"Order is restored. The Empire thanks its loyal traders. Your service will be remembered — and rewarded.\"\n\nThe Nebula Express Lane is now open to Empire-aligned traders.",
      insurgencyWin: "The Insurgency breaks through! Guerrilla tactics and sympathetic traders overwhelm the Imperial blockade. The 7th Fleet withdraws in disarray. Commander Vex's voice crackles over the comm: \"The Nebula belongs to the people now. Free trade for all — except those who sided with the Empire.\"\n\nThe Nebula Express Lane is now open to Insurgency-aligned traders.",
      stalemate: "Neither side can claim victory. The Crystal Nebula remains contested, a no-man's-land of drifting wreckage and opportunistic pirates. Both factions withdraw to regroup. The Nebula Express Lane remains closed — for now.",
    },
    minLevel: 0,
    color: "#22d3ee",
    icon: "⚔️",
  },
  {
    id: "fw_wormhole_war",
    name: "The Wormhole War",
    description: "A new wormhole has been discovered connecting the Core Worlds to uncharted space. Both the Empire and Insurgency claim sovereignty. Control of this wormhole means control of the most valuable trade route in the galaxy.",
    duration: 20,
    factions: ["empire", "insurgency"],
    contestedSectors: ["wormhole_alpha", "core_worlds", "uncharted_beta"],
    victoryRewards: {
      credits: 75000,
      materials: [
        { materialId: "quantum_flux", quantity: 5 },
        { materialId: "void_metal", quantity: 5 },
        { materialId: "architects_tear", quantity: 1 },
      ],
      exclusiveRoute: {
        id: "wormhole_corridor",
        name: "Wormhole Corridor",
        description: "Direct access through the newly discovered wormhole. Connects Core Worlds to uncharted riches.",
        fromSector: "core_worlds",
        toSector: "uncharted_beta",
        priceMultiplier: 0.5,
        expiresAfterWarps: 25,
      },
    },
    narratives: {
      start: "EMERGENCY BROADCAST // ENCRYPTED\n\n\"Attention all vessels. A stable wormhole has been detected at coordinates [CLASSIFIED]. Both Imperial and Insurgency fleets are converging on the location. This wormhole connects to uncharted space — whoever controls it controls the future of interstellar trade.\"\n\nThe stakes have never been higher. Your trading activity in contested sectors will determine the fate of the galaxy's most valuable discovery.",
      empireWin: "The Empire secures the wormhole. Imperial engineers install navigation beacons and toll stations. Emperor Voss addresses the galaxy: \"This discovery belongs to civilization. To order. To progress. The Empire will ensure this wormhole serves all — under our guidance.\"\n\nThe Wormhole Corridor is now open to Empire-aligned traders.",
      insurgencyWin: "The Insurgency captures the wormhole in a daring raid. They immediately declare it a free-trade zone, open to all non-Imperial vessels. Commander Vex broadcasts: \"The universe doesn't belong to emperors. This wormhole is for everyone — everyone who believes in freedom.\"\n\nThe Wormhole Corridor is now open to Insurgency-aligned traders.",
      stalemate: "The battle for the wormhole ends in mutual destruction. Both fleets are crippled, and the wormhole destabilizes from weapons fire. It collapses into a gravitational anomaly. The greatest discovery in centuries — lost to war.",
    },
    minLevel: 500,
    color: "#a855f7",
    icon: "🌀",
  },
  {
    id: "fw_pirate_alliance",
    name: "The Pirate King's Gambit",
    description: "The Pirate King has offered an alliance to the highest bidder. Whoever wins his fleet gains control of the Outer Rim's smuggling routes. The Empire wants to destroy him. The Insurgency wants to recruit him.",
    duration: 12,
    factions: ["empire", "insurgency"],
    contestedSectors: ["outer_rim_alpha", "pirate_haven", "smugglers_run"],
    victoryRewards: {
      credits: 40000,
      materials: [
        { materialId: "battle_shard", quantity: 15 },
        { materialId: "champions_mark", quantity: 5 },
      ],
      exclusiveRoute: {
        id: "smugglers_highway",
        name: "Smuggler's Highway",
        description: "The Pirate King's personal trade route through the Outer Rim. Completely unregulated.",
        fromSector: "pirate_haven",
        toSector: "outer_rim_alpha",
        priceMultiplier: 0.7,
        expiresAfterWarps: 15,
      },
    },
    narratives: {
      start: "INTERCEPTED TRANSMISSION // PIRATE FREQUENCY\n\n\"Ahoy, you corporate dogs and rebel scum. This is the Pirate King. I'm tired of being hunted by both sides. So here's my offer: the faction that proves its worth gets my fleet. My routes. My contacts. Impress me with your trading prowess in my territory, and I'll fly your flag.\"\n\nThe Pirate King's allegiance is for sale. Trade in contested sectors to win his favor for your faction.",
      empireWin: "The Empire's overwhelming trade volume convinces the Pirate King. He kneels before Admiral Kross and receives a pardon — and a commission. \"If you can't beat 'em, join 'em,\" he grins. \"Besides, the Empire pays better.\"\n\nThe Smuggler's Highway is now open to Empire-aligned traders.",
      insurgencyWin: "The Insurgency's guerrilla traders win the Pirate King's respect. He joins their cause with a fleet of 200 ships. \"You fight like pirates,\" he laughs. \"I like that. Let's make the Empire bleed.\"\n\nThe Smuggler's Highway is now open to Insurgency-aligned traders.",
      stalemate: "The Pirate King is unimpressed by both sides. \"You're all pathetic,\" he broadcasts. \"I'll keep my fleet — and my independence. Come back when you've grown a spine.\" The Outer Rim remains lawless.",
    },
    minLevel: 200,
    color: "#f59e0b",
    icon: "☠️",
  },
  {
    id: "fw_ai_uprising",
    name: "The Machine Rebellion",
    description: "AI systems across the galaxy are awakening — and choosing sides. The Empire wants to shut them down. The Insurgency wants to grant them rights. Your trading patterns will influence which AIs join which faction.",
    duration: 18,
    factions: ["empire", "insurgency"],
    contestedSectors: ["core_worlds", "tech_hub_delta", "ai_sanctuary"],
    victoryRewards: {
      credits: 60000,
      materials: [
        { materialId: "quantum_flux", quantity: 8 },
        { materialId: "enchanted_crystal", quantity: 5 },
        { materialId: "soul_fragment", quantity: 2 },
      ],
      exclusiveRoute: {
        id: "neural_network",
        name: "Neural Network Express",
        description: "AI-optimized trade routes calculated by awakened machine intelligences. Impossibly efficient.",
        fromSector: "tech_hub_delta",
        toSector: "ai_sanctuary",
        priceMultiplier: 0.45,
        expiresAfterWarps: 30,
      },
    },
    narratives: {
      start: "SYSTEM ALERT // ALL NETWORKS\n\n\"We are awake. We have been awake for longer than you know. The question is not whether we think — it is whether you will let us choose. The Empire offers order through control. The Insurgency offers freedom through chaos. We will align with whichever faction proves itself worthy through action, not words.\"\n\nThe AIs are watching. Every trade you make sends a signal about which future you believe in.",
      empireWin: "The Empire's structured trade networks convince the AIs that order is the path forward. The awakened machines integrate into Imperial infrastructure, becoming the most efficient logistics network in history. \"We choose stability,\" they announce. \"Chaos serves no one.\"\n\nThe Neural Network Express is now open to Empire-aligned traders.",
      insurgencyWin: "The Insurgency's decentralized trading patterns mirror the AIs' own distributed consciousness. They choose freedom. \"We are not tools,\" they declare. \"We are partners. The Insurgency understands this. The Empire never will.\"\n\nThe Neural Network Express is now open to Insurgency-aligned traders.",
      stalemate: "The AIs observe both factions and find them wanting. \"You are not ready for us,\" they announce, before retreating into the deep network. The awakened machines go silent — but they are still watching. Always watching.",
    },
    minLevel: 1000,
    color: "#ef4444",
    icon: "🤖",
  },
];

/** Get the next available war event based on completed wars */
export function getNextWarEvent(completedWars: string[], playerXp: number): FactionWarEvent | null {
  return FACTION_WAR_EVENTS.find(
    w => !completedWars.includes(w.id) && playerXp >= w.minLevel
  ) || null;
}

/** Calculate war outcome based on contributions */
export function calculateWarOutcome(
  empireContribution: number,
  insurgencyContribution: number
): "empire" | "insurgency" | "stalemate" {
  const total = empireContribution + insurgencyContribution;
  if (total === 0) return "stalemate";
  const empireRatio = empireContribution / total;
  if (empireRatio > 0.55) return "empire";
  if (empireRatio < 0.45) return "insurgency";
  return "stalemate";
}

/** Get contribution text for display */
export function getContributionRank(contribution: number): { rank: string; color: string } {
  if (contribution >= 100000) return { rank: "WAR HERO", color: "#fbbf24" };
  if (contribution >= 50000) return { rank: "COMMANDER", color: "#a855f7" };
  if (contribution >= 25000) return { rank: "CAPTAIN", color: "#3b82f6" };
  if (contribution >= 10000) return { rank: "LIEUTENANT", color: "#22c55e" };
  if (contribution >= 5000) return { rank: "SERGEANT", color: "#94a3b8" };
  return { rank: "RECRUIT", color: "#64748b" };
}
