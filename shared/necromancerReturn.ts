/* ═══════════════════════════════════════════════════════
   THE NECROMANCER RETURN — Community Resurrection Event

   Every player's death feeds the Universe's Resurrection
   Energy. When the collective meter fills, The Necromancer
   returns from the Matrix of Dreams. This is NOT a solo event.
   This is a server-wide apocalypse the entire community causes.

   It should take months of collective play to trigger.
   It should NOT be easy to reverse.
   It changes the game permanently until defeated.

   Lore: Elara's scientific discovery reveals the mechanic
   during a normal diagnostic. She doesn't understand what
   she's found. The player pieces it together through story.

   Server state: communityDeaths, resurrectionEnergy,
   necromancerStatus, affectedSystems, deathWorlds,
   activeCultists
   ═══════════════════════════════════════════════════════ */

/* ─── SERVER-TRACKED STATE ─── */

export interface CommunityResurrectionState {
  /** Total deaths across ALL players, ever */
  totalCommunityDeaths: number;
  /** Resurrection energy 0-1,000,000 */
  resurrectionEnergy: number;
  /** Status of the Necromancer */
  necromancerStatus: NecromancerStatus;
  /** When the Necromancer was last in a given state */
  lastStatusChange: string; // ISO date
  /** Current impact level on game systems */
  impactLevel: 0 | 1 | 2 | 3 | 4 | 5;
  /** Number of Death Worlds formed */
  deathWorldCount: number;
  /** Cultist population (across all factions) */
  cultistPopulation: number;
  /** Apprentice Magicians (player-controlled necromancer-aligned) */
  apprenticePopulation: number;
}

export type NecromancerStatus =
  | "dormant"                 // No energy, normal game
  | "stirring"                // 10% — early whispers, subtle effects
  | "awakening"               // 30% — noticeable effects, faction forms
  | "manifesting"             // 60% — significant game impact
  | "ascending"               // 85% — near return, universe reacts
  | "returned"                // 100% — The Necromancer is BACK
  | "defeated_temporarily";   // Community defeated him — will return

export const RESURRECTION_THRESHOLDS = {
  STIRRING: 100_000,       // 100K community deaths (early whispers)
  AWAKENING: 300_000,      // 300K deaths — Elara's diagnostic finds it
  MANIFESTING: 600_000,    // 600K — cults form, Death Worlds emerge
  ASCENDING: 850_000,      // 850K — universe visibly changes
  RETURNED: 1_000_000,     // 1M community deaths — HE'S BACK
};

/* ─── DISCOVERY NARRATIVE (Elara's tutorial arc) ─── */

export interface DiscoveryStage {
  id: string;
  energyThreshold: number;
  /** Elara's dialog when player first reaches this threshold */
  elaraDiscovery: string;
  /** What systems show anomalies */
  anomalies: string[];
  /** Player quest/action to investigate */
  investigation: string;
}

export const DISCOVERY_STAGES: DiscoveryStage[] = [
  {
    id: "baseline_diagnostic",
    energyThreshold: 0,
    elaraDiscovery: "I ran a routine universe-scale diagnostic today. Background radiation, entropy gradients, dark energy flux. Nothing unusual. I should be more thorough.",
    anomalies: [],
    investigation: "None yet — the anomaly hasn't appeared in sensor range.",
  },
  {
    id: "first_anomaly",
    energyThreshold: 100_000,
    elaraDiscovery: "I'm detecting an unfamiliar energy signature. It's... everywhere. Not concentrated. Distributed across the galaxy like a whisper. I've never seen radiation behave like this. The signature almost looks organic. Like it's CHOOSING its distribution.",
    anomalies: ["Distributed energy field across galaxy", "Signature resembles consciousness patterns"],
    investigation: "Run a focused scan on the signature's behavior over time. See if it's growing.",
  },
  {
    id: "growth_pattern",
    energyThreshold: 300_000,
    elaraDiscovery: "The energy is growing. Not linearly — it correlates with something I can't identify. I ran statistical analysis: the growth rate matches... death rates. Every death across the galaxy seems to add to this field. That's not physics. That's not any science I have. Someone designed this.",
    anomalies: ["Energy growth correlates with biological/clone deaths", "Field exhibits intent"],
    investigation: "Search Archives for any references to death-powered energy fields. Ask the Antiquarian.",
  },
  {
    id: "resurrection_protocols",
    energyThreshold: 500_000,
    elaraDiscovery: "I found it. In a file the Shadow Tongue hasn't edited yet. The Resurrection Protocols. Designed by the Necromancer — 10th Archon, currently in the Matrix of Dreams. The energy we're seeing is DESIGNED. Every death feeds it. And when it reaches critical mass... he returns.",
    anomalies: ["Confirmed: Resurrection Protocols", "Necromancer designed the field as his return mechanism"],
    investigation: "Verify with the Antiquarian. Consult The Human — he served alongside the Necromancer as an Archon.",
  },
  {
    id: "cultist_discovery",
    energyThreshold: 600_000,
    elaraDiscovery: "Intelligence reports: cults are forming across the galaxy. They worship a returning god. They call themselves 'Resurrectionists' — and they're speeding up the process. They're KILLING to trigger his return. I don't understand why anyone would want this.",
    anomalies: ["Cult activity spreading", "Targeted mass-death events"],
    investigation: "Investigate Death Worlds. Contact Adjudicator Locke — New Babylon will have intelligence on cult networks.",
  },
  {
    id: "approaching_return",
    energyThreshold: 850_000,
    elaraDiscovery: "The energy field is saturating. I estimate 15% remaining capacity before... something happens. The Antiquarian says the Necromancer has returned twice before in other timelines. Both times, he reshaped reality. Both times, it took a coalition to stop him. We don't have a coalition. We have... us.",
    anomalies: ["Reality distortions reported in multiple sectors", "Castle of Death visible in Matrix of Dreams"],
    investigation: "Prepare. Rally factions. The Antiquarian knows what's coming — he's seen it happen.",
  },
  {
    id: "return_imminent",
    energyThreshold: 1_000_000,
    elaraDiscovery: "He's HERE. The Necromancer has returned. I can see him on every sensor. He's... beautiful? Terrible? I don't know how to describe him. He speaks to the galaxy directly now. He's offering eternal life to anyone who kneels. Operative, we need to talk about our options.",
    anomalies: ["Necromancer manifest across galaxy", "Direct communication with all sentient beings"],
    investigation: "The final arc begins.",
  },
];

export function getCurrentDiscoveryStage(energy: number): DiscoveryStage {
  let current = DISCOVERY_STAGES[0];
  for (const stage of DISCOVERY_STAGES) {
    if (energy >= stage.energyThreshold) current = stage;
  }
  return current;
}

/* ─── SYSTEM IMPACT BY STATUS ─── */

export interface SystemImpact {
  status: NecromancerStatus;
  description: string;
  effects: GameSystemEffect[];
}

export interface GameSystemEffect {
  system: "fight" | "chess" | "dischordia" | "terminus" | "trade_empire" | "ark_explorer" | "bridge_console" | "pet_battles" | "all";
  effect: string;
  severity: "subtle" | "noticeable" | "major" | "catastrophic";
}

export const SYSTEM_IMPACTS: SystemImpact[] = [
  {
    status: "dormant",
    description: "Normal game state.",
    effects: [],
  },
  {
    status: "stirring",
    description: "Subtle anomalies. Players notice but don't know why.",
    effects: [
      { system: "ark_explorer", effect: "Occasional red flicker in Medical Bay screens", severity: "subtle" },
      { system: "fight", effect: "Defeated opponents occasionally whisper 'he's coming'", severity: "subtle" },
      { system: "pet_battles", effect: "Pets' injury sounds change — deeper, mournful", severity: "subtle" },
    ],
  },
  {
    status: "awakening",
    description: "Noticeable effects. Elara raises concern.",
    effects: [
      { system: "ark_explorer", effect: "Elara runs diagnostic on the energy field (tutorial arc)", severity: "noticeable" },
      { system: "chess", effect: "Black pieces occasionally animate on their own", severity: "noticeable" },
      { system: "dischordia", effect: "Death cards deal +10% damage (lore: Necromancer's influence)", severity: "noticeable" },
      { system: "terminus", effect: "Enemies revive once per wave at 10% HP", severity: "noticeable" },
      { system: "all", effect: "Death messages include Necromancer lore fragments", severity: "noticeable" },
    ],
  },
  {
    status: "manifesting",
    description: "Major systemic changes. Cults emerge. Death Worlds form.",
    effects: [
      { system: "trade_empire", effect: "Death Worlds appear in galaxy map — new faction territory", severity: "major" },
      { system: "ark_explorer", effect: "Medical Bay occasionally blocked by 'RESURRECTION IN PROGRESS' alerts", severity: "major" },
      { system: "fight", effect: "Defeated fighters have 25% chance to rise for one more attack", severity: "major" },
      { system: "dischordia", effect: "New card effects: 'Summon from Matrix of Dreams'", severity: "major" },
      { system: "terminus", effect: "Zombie variant enemies appear (revived swarm)", severity: "major" },
      { system: "pet_battles", effect: "Pets can become 'Risen' — stronger but uncontrollable", severity: "major" },
    ],
  },
  {
    status: "ascending",
    description: "Reality distorts. Players prepare for catastrophe.",
    effects: [
      { system: "all", effect: "Every UI has Castle of Death imagery in peripheral vision", severity: "catastrophic" },
      { system: "bridge_console", effect: "Elara's form flickers red. She's frightened.", severity: "catastrophic" },
      { system: "trade_empire", effect: "Resurrectionist Cult faction consumes 30% of galaxy", severity: "catastrophic" },
      { system: "chess", effect: "Every game auto-ends with Necromancer checkmate pattern on move 3", severity: "catastrophic" },
      { system: "ark_explorer", effect: "Undead NPCs appear — former players' Potentials returned wrong", severity: "catastrophic" },
    ],
  },
  {
    status: "returned",
    description: "THE NECROMANCER IS BACK. Universe-wide event phase.",
    effects: [
      { system: "all", effect: "Global raid event: The Necromancer's Throne. Community must defeat him.", severity: "catastrophic" },
      { system: "trade_empire", effect: "Castle of Death spawns in center of galaxy, requires coalition to assault", severity: "catastrophic" },
      { system: "ark_explorer", effect: "Matrix of Dreams bleeds into Ark. All rooms gain temporal echoes.", severity: "catastrophic" },
      { system: "fight", effect: "The Necromancer becomes a selectable boss fight (party required)", severity: "catastrophic" },
      { system: "dischordia", effect: "Legendary 'The Necromancer' card unlocks in packs (0.1% rate)", severity: "catastrophic" },
      { system: "pet_battles", effect: "All dead pets return as uncontrolled Risen versions", severity: "catastrophic" },
    ],
  },
  {
    status: "defeated_temporarily",
    description: "Community defeated the Necromancer. Energy resets to 50% — he's wounded but healing.",
    effects: [
      { system: "all", effect: "Reward: The Necromancer's Mark — legendary cosmetic + Bone Familiar pet for all participants", severity: "subtle" },
      { system: "trade_empire", effect: "Castle of Death becomes claimable territory", severity: "major" },
      { system: "dischordia", effect: "The Necromancer card now craftable (Soul Fragments + Dream)", severity: "noticeable" },
    ],
  },
];

export function getStatusFromEnergy(energy: number): NecromancerStatus {
  if (energy >= RESURRECTION_THRESHOLDS.RETURNED) return "returned";
  if (energy >= RESURRECTION_THRESHOLDS.ASCENDING) return "ascending";
  if (energy >= RESURRECTION_THRESHOLDS.MANIFESTING) return "manifesting";
  if (energy >= RESURRECTION_THRESHOLDS.AWAKENING) return "awakening";
  if (energy >= RESURRECTION_THRESHOLDS.STIRRING) return "stirring";
  return "dormant";
}

export function getImpactLevel(status: NecromancerStatus): 0 | 1 | 2 | 3 | 4 | 5 {
  switch (status) {
    case "dormant": return 0;
    case "stirring": return 1;
    case "awakening": return 2;
    case "manifesting": return 3;
    case "ascending": return 4;
    case "returned": return 5;
    case "defeated_temporarily": return 1;
  }
}

/* ─── DEATH WORLDS ─── */

export interface DeathWorld {
  id: string;
  name: string;
  sector: string;
  corruptionLevel: number; // 0-100
  cultistPopulation: number;
  resources: string[];
  /** Raid required to reclaim */
  reclaimDifficulty: "standard" | "heroic" | "mythic";
  /** Special unique reward */
  uniqueReward: string;
}

export const DEATH_WORLDS: DeathWorld[] = [
  {
    id: "necropolis_1",
    name: "Mortis Prime",
    sector: "Outer Rim",
    corruptionLevel: 100,
    cultistPopulation: 50000,
    resources: ["Soul Fragments", "Bone Dust", "Corrupted Mana"],
    reclaimDifficulty: "heroic",
    uniqueReward: "Mortis Prime Banner + Cultist Recruit",
  },
  {
    id: "necropolis_2",
    name: "The Still World",
    sector: "Core Worlds",
    corruptionLevel: 75,
    cultistPopulation: 30000,
    resources: ["Soul Fragments", "Echo Crystals"],
    reclaimDifficulty: "mythic",
    uniqueReward: "Stillness Cloak + Apprentice Magician unlock",
  },
  {
    id: "necropolis_3",
    name: "Thazulok's Reach",
    sector: "Matrix of Dreams border",
    corruptionLevel: 100,
    cultistPopulation: 100000,
    resources: ["Soul Fragments", "Necromantic Essence", "Dream Shards"],
    reclaimDifficulty: "mythic",
    uniqueReward: "Thazulok's Sigil (legendary) + Necromancer's Apprentice title",
  },
];

/* ─── CULTIST FACTION ─── */

export interface CultistRank {
  rank: number;
  name: string;
  deathsRequired: number;
  perks: string[];
  visualChange: string;
}

export const CULTIST_RANKS: CultistRank[] = [
  { rank: 1, name: "Resurrectionist Initiate", deathsRequired: 1,
    perks: ["+5% death-related rewards", "Can harvest Soul Fragments"],
    visualChange: "Subtle shadow aura" },
  { rank: 2, name: "Bone Acolyte", deathsRequired: 5,
    perks: ["+10% death rewards", "Access to Cult marketplace", "Can communicate with undead enemies"],
    visualChange: "Skeletal armor pieces" },
  { rank: 3, name: "Shroud Bearer", deathsRequired: 15,
    perks: ["+15% death rewards", "Revive fallen allies once per day", "Dark whisper abilities"],
    visualChange: "Tattered robes with glyphs" },
  { rank: 4, name: "Apprentice Magician", deathsRequired: 30,
    perks: ["+25% death rewards", "Cast basic necromancy spells", "Summon lesser undead"],
    visualChange: "Ceremonial mask, floating runes" },
  { rank: 5, name: "Death Priest", deathsRequired: 60,
    perks: ["+40% death rewards", "Permanent undead companion", "Can mark enemies for the Necromancer"],
    visualChange: "Full necrotic regalia, pale glow" },
  { rank: 6, name: "Undead Sorcerer", deathsRequired: 100,
    perks: ["+60% death rewards", "Immortality (can die 3x per day with no penalty)", "Channel Necromancer directly"],
    visualChange: "Fully undead appearance, dark aura" },
  { rank: 7, name: "Thazulok's Chosen", deathsRequired: 200,
    perks: ["+100% death rewards", "Eternal life within the Matrix of Dreams", "Direct audience with the Necromancer"],
    visualChange: "Demigod appearance, reality distorts around you" },
];

export function getCultistRank(personalDeaths: number, hasJoinedCult: boolean): CultistRank | null {
  if (!hasJoinedCult) return null;
  let current = CULTIST_RANKS[0];
  for (const rank of CULTIST_RANKS) {
    if (personalDeaths >= rank.deathsRequired) current = rank;
  }
  return current;
}

/* ─── DEATH CONTRIBUTION ─── */

export interface DeathContribution {
  playerId: number;
  deathType: "arena" | "fight" | "terminus" | "dischordia" | "chess" | "pet_battle";
  energyContributed: number;
  timestamp: string;
}

/** How much energy each death type contributes */
export const ENERGY_PER_DEATH: Record<DeathContribution["deathType"], number> = {
  arena: 10,           // Clone death in Collector's Arena
  fight: 3,            // Combat sim loss
  terminus: 5,         // Wave defense failure
  dischordia: 2,       // Card battle loss
  chess: 2,            // Chess loss
  pet_battle: 7,       // Pet death in battle (heavier because pets matter)
};

/* ─── COALITION RAID (when Necromancer returns) ─── */

export interface CoalitionRaid {
  id: string;
  name: string;
  bossName: string;
  requiredParticipants: number;
  /** How much community damage needed to defeat */
  totalHpRequired: number;
  phases: RaidPhase[];
  rewards: RaidRewards;
}

export interface RaidPhase {
  phase: number;
  name: string;
  description: string;
  hpThreshold: number; // % remaining
  mechanic: string;
}

export interface RaidRewards {
  participationReward: { dream: number; xp: number; soulFragments: number };
  topContributorReward: { title: string; cosmetic: string; card: string };
  communityReward: string;
}

export const NECROMANCER_RAID: CoalitionRaid = {
  id: "necromancer_throne",
  name: "Assault on the Castle of Death",
  bossName: "The Necromancer (Thazulok)",
  requiredParticipants: 1000,
  totalHpRequired: 100_000_000,
  phases: [
    { phase: 1, name: "The Approach", description: "The Necromancer's undead army defends the castle gates.", hpThreshold: 100, mechanic: "Army of Undead" },
    { phase: 2, name: "The Inner Sanctum", description: "Pass through the Matrix of Dreams. Reality distorts. Chess pieces fight you.", hpThreshold: 75, mechanic: "Reality Puzzles" },
    { phase: 3, name: "The Necromancer's Throne", description: "Thazulok himself. He offers eternal life. Refuse or accept.", hpThreshold: 50, mechanic: "Moral Choice + Combat" },
    { phase: 4, name: "The True Form", description: "His final form manifests. The universe itself is at stake.", hpThreshold: 25, mechanic: "All players deal 2x damage, but die in 1 hit" },
    { phase: 5, name: "Thazulok Falls (Temporarily)", description: "He drops to his knees. 'I will return. The Protocols are eternal.' Final blow required.", hpThreshold: 5, mechanic: "Community killing blow vote" },
  ],
  rewards: {
    participationReward: { dream: 1000, xp: 5000, soulFragments: 50 },
    topContributorReward: {
      title: "Slayer of Thazulok",
      cosmetic: "Necromancer's Crown (full animated set)",
      card: "The Necromancer (legendary card, unique variant for raid winners)",
    },
    communityReward: "The entire galaxy's Death Worlds become claimable. All players earn Bone Familiar pets.",
  },
};

/* ─── DEFAULT STATE ─── */

export const DEFAULT_COMMUNITY_STATE: CommunityResurrectionState = {
  totalCommunityDeaths: 0,
  resurrectionEnergy: 0,
  necromancerStatus: "dormant",
  lastStatusChange: new Date().toISOString(),
  impactLevel: 0,
  deathWorldCount: 0,
  cultistPopulation: 0,
  apprenticePopulation: 0,
};
