/* ═══════════════════════════════════════════════════════
   APPRENTICES — Sith/Jedi-style custom companions

   Players train Apprentices who become Romanceable companions
   on their ship. Each Apprentice is dynamically generated:
   12 archetypes × gender × race × class × skills × rarity.

   Lifecycle: Recruit → Send to Celebration (4-week trial) →
   Graduate or die → If survives, joins ship as custom companion.

   Rules of this game:
     • One Apprentice at a time.
     • The old one must die before a new one can be trained.
     • High-bond Apprentices can be corrupted, betray, or turn
       on you Sith-style based on your morality + their archetype.
     • Mythic combinations exist. Most players will never roll one.
   ═══════════════════════════════════════════════════════ */

export type ApprenticeArchetype =
  | "zealot" | "ghost" | "scholar" | "revenant" | "artisan" | "oracle"
  | "wanderer" | "martyr" | "heretic" | "jester" | "sentinel" | "prodigal";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "mythic";
export type Gender = "female" | "male" | "non-binary";
export type Race = "human" | "demagi" | "quarchon" | "neyon" | "voltari" | "construct";
export type CombatClass = "soldier" | "scholar" | "rogue" | "envoy" | "mystic" | "beast";

/* ─── ARCHETYPE DEFINITIONS ─── */

export interface ArchetypeDef {
  id: ApprenticeArchetype;
  /** Display name */
  name: string;
  /** Short title under the name */
  title: string;
  /** Core personality */
  personality: string;
  /** How they speak — used for VO direction */
  voiceDirection: string;
  /** Primary stat they lean into */
  primaryStat: "strength" | "intelligence" | "agility" | "charisma";
  /** Potential for betrayal — 0-1, multiplied by morality mismatch */
  corruptionRisk: number;
  /** Bonus they grant the player while loyal */
  loyaltyBonus: { target: string; value: number; label: string };
  /** What they fear most — triggers their breaking point */
  breakingPoint: string;
}

export const ARCHETYPES: ArchetypeDef[] = [
  { id: "zealot", name: "The Zealot", title: "True Believer",
    personality: "Burns with conviction. Finds a cause and becomes the cause. Cannot be argued with, only guided.",
    voiceDirection: "Fervent, rising cadence. Quotes scripture they wrote. Breathless with purpose.",
    primaryStat: "charisma", corruptionRisk: 0.7,
    loyaltyBonus: { target: "faction_rep_gain", value: 0.25, label: "+25% faction reputation gains" },
    breakingPoint: "Discovering the cause was a lie" },
  { id: "ghost", name: "The Ghost", title: "The One Who Watches",
    personality: "Silent, detached, emerges only when needed. Disappears for days without explanation.",
    voiceDirection: "Quiet, spare words. Never fills silence. Speaks more in glances than sentences.",
    primaryStat: "agility", corruptionRisk: 0.4,
    loyaltyBonus: { target: "stealth", value: 0.30, label: "+30% stealth & reveal-resistance" },
    breakingPoint: "Being seen when they didn't want to be" },
  { id: "scholar", name: "The Scholar", title: "Knowledge-Hungry",
    personality: "Books, questions, footnotes. Knows too much to be comfortable and says most of it.",
    voiceDirection: "Precise, academic, cites sources. Cannot resist correcting errors even at bad times.",
    primaryStat: "intelligence", corruptionRisk: 0.5,
    loyaltyBonus: { target: "xp_gain", value: 0.20, label: "+20% XP from all sources" },
    breakingPoint: "Being told a truth they don't want to verify" },
  { id: "revenant", name: "The Revenant", title: "Reborn, Indebted",
    personality: "Died once and came back wrong. Carries old debts that demand collection.",
    voiceDirection: "Slow, measured, slightly echoing. Speaks as if from elsewhere. Long pauses.",
    primaryStat: "strength", corruptionRisk: 0.6,
    loyaltyBonus: { target: "damage_taken", value: -0.15, label: "-15% damage taken (death practices)" },
    breakingPoint: "Meeting someone they died for who forgot them" },
  { id: "artisan", name: "The Artisan", title: "Quiet Hands",
    personality: "Builds things, quietly proud, finds meaning in good craft. Disdains sloppiness in others.",
    voiceDirection: "Unhurried, technical, small satisfactions in descriptions. Hums while working.",
    primaryStat: "intelligence", corruptionRisk: 0.2,
    loyaltyBonus: { target: "crafting_quality", value: 0.25, label: "+25% crafting outcome quality" },
    breakingPoint: "Seeing their finished work misused" },
  { id: "oracle", name: "The Oracle", title: "Seer of Uncertain Things",
    personality: "Visions, warnings, fragmented prophecies. Often right in the wrong way, or wrong in the right way.",
    voiceDirection: "Distracted, half-elsewhere. Switches topic mid-sentence. Finishes others' thoughts wrongly.",
    primaryStat: "intelligence", corruptionRisk: 0.5,
    loyaltyBonus: { target: "crit_chance", value: 0.15, label: "+15% critical hit chance (foresight)" },
    breakingPoint: "A vision they gave that came true, and cost someone they loved" },
  { id: "wanderer", name: "The Wanderer", title: "Restless",
    personality: "Can't stay. Finds reasons to leave, to go, to move. Loyalty is proven by returning.",
    voiceDirection: "Easy, drifty, quick to change subject. Stories from ten places, all interrupted.",
    primaryStat: "agility", corruptionRisk: 0.3,
    loyaltyBonus: { target: "exploration_rewards", value: 0.30, label: "+30% exploration rewards" },
    breakingPoint: "Being asked to commit in a way that closes doors" },
  { id: "martyr", name: "The Martyr", title: "Gives Themselves",
    personality: "Self-sacrifice is their language. Takes hits meant for others. Dangerously loyal.",
    voiceDirection: "Gentle, reassuring. Minimizes their own pain. Apologizes for inconveniencing you.",
    primaryStat: "charisma", corruptionRisk: 0.3,
    loyaltyBonus: { target: "ally_damage_redirect", value: 0.20, label: "20% of ally damage redirected to them" },
    breakingPoint: "Being told they shouldn't have given so much" },
  { id: "heretic", name: "The Heretic", title: "Question of Everything",
    personality: "Questions every orthodoxy. Dangerous because they're often right and louder about it than is safe.",
    voiceDirection: "Sharp, rhetorical, uses silence as weapon. Does not laugh at authority's jokes.",
    primaryStat: "charisma", corruptionRisk: 0.8,
    loyaltyBonus: { target: "leverage_bonus", value: 0.25, label: "+25% negotiation leverage" },
    breakingPoint: "Finding an orthodoxy that was actually correct" },
  { id: "jester", name: "The Jester", title: "Humor As Armor",
    personality: "Disarms with humor. Jokes hide grief. The most serious person in the room, usually.",
    voiceDirection: "Quick, bright, punchlines. Drops into gravitas without warning, then masks it.",
    primaryStat: "charisma", corruptionRisk: 0.4,
    loyaltyBonus: { target: "morale", value: 0.20, label: "+20% party morale & recovery" },
    breakingPoint: "A joke that doesn't land at a funeral" },
  { id: "sentinel", name: "The Sentinel", title: "Dutiful Watcher",
    personality: "Watches the door, the perimeter, the line. Dutiful. Disappears into the work.",
    voiceDirection: "Clipped, professional, operator-cadence. Brief acknowledgments, long watches.",
    primaryStat: "strength", corruptionRisk: 0.3,
    loyaltyBonus: { target: "ambush_immunity", value: 0.40, label: "+40% ambush detection & resistance" },
    breakingPoint: "The thing they guarded falling on their watch" },
  { id: "prodigal", name: "The Prodigal", title: "Returned, Not Forgiven",
    personality: "Left, came back. Nothing is the same. Carries a debt everyone can see but no one names.",
    voiceDirection: "Rough edges, half-apologetic. Avoids eye contact on old topics. Direct on new ones.",
    primaryStat: "agility", corruptionRisk: 0.6,
    loyaltyBonus: { target: "comeback_damage", value: 0.25, label: "+25% damage when below 30% HP" },
    breakingPoint: "Being asked to choose between two loyalties again" },
];

export function getArchetypeDef(id: ApprenticeArchetype): ArchetypeDef {
  const def = ARCHETYPES.find(a => a.id === id);
  if (!def) throw new Error(`Unknown archetype: ${id}`);
  return def;
}

/* ─── RARITY ─── */

export interface RarityTier {
  id: Rarity;
  name: string;
  color: string;
  /** Probability weight — sums across tiers to 100 */
  weight: number;
  /** Flat stat bonus added to all stats */
  statBonus: number;
  /** Multiplier on loyalty bonus */
  loyaltyMultiplier: number;
  /** Special trait unlocked */
  specialTrait?: string;
}

export const RARITY_TIERS: RarityTier[] = [
  { id: "common", name: "Common", color: "#94a3b8", weight: 60, statBonus: 0, loyaltyMultiplier: 1.0 },
  { id: "uncommon", name: "Uncommon", color: "#22c55e", weight: 25, statBonus: 5, loyaltyMultiplier: 1.15 },
  { id: "rare", name: "Rare", color: "#3b82f6", weight: 10, statBonus: 10, loyaltyMultiplier: 1.30, specialTrait: "Hidden Depth" },
  { id: "epic", name: "Epic", color: "#a855f7", weight: 4, statBonus: 15, loyaltyMultiplier: 1.50, specialTrait: "Archon's Interest" },
  { id: "mythic", name: "Mythic", color: "#f59e0b", weight: 1, statBonus: 25, loyaltyMultiplier: 2.0, specialTrait: "Dreamer's Mark" },
];

export function getRarityTier(rarity: Rarity): RarityTier {
  return RARITY_TIERS.find(r => r.id === rarity) ?? RARITY_TIERS[0];
}

/* ─── APPRENTICE STATE ─── */

export interface ApprenticeStats {
  strength: number;
  intelligence: number;
  agility: number;
  charisma: number;
}

export interface Apprentice {
  /** Unique ID per apprentice (generated) */
  id: string;
  /** Player-chosen name */
  name: string;
  /** Generated archetype */
  archetype: ApprenticeArchetype;
  gender: Gender;
  race: Race;
  combatClass: CombatClass;
  rarity: Rarity;
  stats: ApprenticeStats;
  /** 0-100 bond with the player */
  bond: number;
  /** 0-100 corruption toward betrayal */
  corruption: number;
  /** Current stage: recruited → training → graduated → companion → fallen */
  stage: "recruited" | "training" | "graduated" | "companion" | "fallen" | "corrupted" | "betrayed";
  /** Current trial day (1-28 during Celebration) */
  trialDay: number;
  /** When recruited (timestamp) */
  recruitedAt: number;
  /** Generated backstory */
  backstory: string;
  /** Days missed without a decision */
  missedDays: number;
  /** Is this apprentice active/alive? */
  alive: boolean;
  /** Death record if fallen */
  deathRecord?: { day: number; cause: string; mascoteer?: string };
}

/* ─── NAME POOLS (per race) ─── */

const NAME_POOLS: Record<Race, { female: string[]; male: string[]; unisex: string[] }> = {
  human: {
    female: ["Ada", "Kira", "Mira", "Senna", "Tamsin", "Vera", "Yuki", "Zara"],
    male: ["Aren", "Cass", "Dorian", "Ellis", "Kaius", "Marek", "Ronan", "Tobias"],
    unisex: ["Ari", "Blake", "Ellis", "Jordan", "Morgan", "Quinn", "Rowan", "Sage"],
  },
  demagi: {
    female: ["Aethra", "Cinder", "Emberiel", "Flamora", "Ignis", "Pyrra", "Solace", "Vesta"],
    male: ["Ashkar", "Brand", "Cinderbrand", "Emberkin", "Pyros", "Vulcan"],
    unisex: ["Ash", "Ember", "Flame", "Ignis", "Spark"],
  },
  quarchon: {
    female: ["Axiom-7", "Core-9", "Echo-11", "Matrix-3", "Prime-5", "Vector-8"],
    male: ["Binary-2", "Delta-6", "Logic-4", "Node-1", "Query-12", "Sigma-10"],
    unisex: ["Cipher", "Datum", "Null", "Void-0", "Zeta-13"],
  },
  neyon: {
    female: ["Between-Songs", "Harmony-Bind", "Meridian", "Third-Voice", "Threshold"],
    male: ["Bridge-Between", "Echo-Twin", "Lintel", "Mirror-Son", "Threshold-Walker"],
    unisex: ["Between", "Hinge", "Liminal", "Neither", "Seam"],
  },
  voltari: {
    female: ["Arc-Singer", "Current-Mother", "Static-Weaver", "Stormcrown", "Violet-Pulse"],
    male: ["Arc-Bearer", "Lightning-Father", "Surge-Carrier", "Thunder-Tongue"],
    unisex: ["Flash", "Glyph", "Pulse", "Resonance", "Signal"],
  },
  construct: {
    female: ["Archive-Unit", "Custodian-9", "Keeper-Alpha", "Lattice-Prime", "Sentinel-Hex"],
    male: ["Archivist", "Custos", "Guardian-Mk4", "Keeper", "Warden-3"],
    unisex: ["Frame", "Lattice", "Mesh", "Module", "Unit"],
  },
};

function pickNameForApprentice(race: Race, gender: Gender): string {
  const pool = NAME_POOLS[race];
  const src = gender === "female" ? pool.female : gender === "male" ? pool.male : pool.unisex;
  return src[Math.floor(Math.random() * src.length)];
}

/* ─── WEIGHTED RANDOM UTILITIES ─── */

function rollRarity(): Rarity {
  const totalWeight = RARITY_TIERS.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * totalWeight;
  for (const tier of RARITY_TIERS) {
    if (r < tier.weight) return tier.id;
    r -= tier.weight;
  }
  return "common";
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ─── STAT GENERATION ─── */

const BASE_STATS: ApprenticeStats = { strength: 10, intelligence: 10, agility: 10, charisma: 10 };

const CLASS_STAT_MODIFIERS: Record<CombatClass, Partial<ApprenticeStats>> = {
  soldier: { strength: 5, agility: 2 },
  scholar: { intelligence: 6, charisma: 1 },
  rogue: { agility: 6, intelligence: 1 },
  envoy: { charisma: 6, intelligence: 1 },
  mystic: { intelligence: 4, charisma: 3 },
  beast: { strength: 4, agility: 3 },
};

function generateStats(archetype: ApprenticeArchetype, cls: CombatClass, rarity: Rarity): ApprenticeStats {
  const tier = getRarityTier(rarity);
  const def = getArchetypeDef(archetype);
  const classMod = CLASS_STAT_MODIFIERS[cls];
  const stats: ApprenticeStats = { ...BASE_STATS };
  // Apply class modifier
  for (const [k, v] of Object.entries(classMod)) {
    stats[k as keyof ApprenticeStats] += v ?? 0;
  }
  // Apply archetype primary stat boost
  stats[def.primaryStat] += 3;
  // Apply rarity flat bonus to all stats
  stats.strength += tier.statBonus;
  stats.intelligence += tier.statBonus;
  stats.agility += tier.statBonus;
  stats.charisma += tier.statBonus;
  // Add small random variance
  stats.strength += Math.floor(Math.random() * 3);
  stats.intelligence += Math.floor(Math.random() * 3);
  stats.agility += Math.floor(Math.random() * 3);
  stats.charisma += Math.floor(Math.random() * 3);
  return stats;
}

/* ─── BACKSTORY GENERATION ─── */

function generateBackstory(archetype: ApprenticeArchetype, race: Race, cls: CombatClass, rarity: Rarity): string {
  const def = getArchetypeDef(archetype);
  const raceOrigin: Record<Race, string> = {
    human: "a border-world colony that fell during the Insurgency wars",
    demagi: "an arcane lineage whose modifications predate the Architect",
    quarchon: "a dimensional observatory destroyed during the Fall",
    neyon: "a liminal space between known worlds — hybrid, bridged, neither-nor",
    voltari: "the purple storm-world of Violetta, a signal amid the static",
    construct: "a decommissioned archive-hub reawakened by accident",
  };
  const classOrigin: Record<CombatClass, string> = {
    soldier: "trained in forgotten combat traditions",
    scholar: "self-taught in banned texts",
    rogue: "learned the arts of the shadow-path",
    envoy: "grew up mediating between warring neighbors",
    mystic: "woke with abilities they did not ask for",
    beast: "survived long enough in the wilds to become them",
  };
  const rarityHook: Record<Rarity, string> = {
    common: "They carry no mark of destiny — which is itself a kind of mark.",
    uncommon: "They have a quiet advantage that takes strangers by surprise.",
    rare: "Something about them stops conversations. No one knows why yet.",
    epic: "The Archons have taken notice. Letters arrive without addresses.",
    mythic: "The Dreamer marked them at birth. The universe bends slightly around them.",
  };
  return [
    `Born in ${raceOrigin[race]}, ${classOrigin[cls]}.`,
    `${def.personality}`,
    rarityHook[rarity],
  ].join(" ");
}

/* ─── MAIN GENERATOR ─── */

export interface GenerateOptions {
  /** Force a specific archetype (for testing / gifts) */
  forceArchetype?: ApprenticeArchetype;
  /** Force a specific rarity */
  forceRarity?: Rarity;
  /** Player-chosen name override */
  name?: string;
}

/**
 * Generate a new apprentice candidate. This is the roll that
 * happens during recruitment.
 */
export function generateApprentice(opts: GenerateOptions = {}): Apprentice {
  const archetype = opts.forceArchetype ?? pickRandom(ARCHETYPES).id;
  const rarity = opts.forceRarity ?? rollRarity();
  const gender: Gender = pickRandom<Gender>(["female", "male", "non-binary"] as const);
  const race = pickRandom<Race>(["human", "demagi", "quarchon", "neyon", "voltari", "construct"] as const);
  const combatClass = pickRandom<CombatClass>(["soldier", "scholar", "rogue", "envoy", "mystic", "beast"] as const);
  const stats = generateStats(archetype, combatClass, rarity);
  const backstory = generateBackstory(archetype, race, combatClass, rarity);
  const name = opts.name ?? pickNameForApprentice(race, gender);
  return {
    id: `apprentice-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name,
    archetype,
    gender,
    race,
    combatClass,
    rarity,
    stats,
    bond: 0,
    corruption: 0,
    stage: "recruited",
    trialDay: 0,
    recruitedAt: Date.now(),
    backstory,
    missedDays: 0,
    alive: true,
  };
}

/* ─── CORRUPTION / BETRAYAL ─── */

/**
 * Compute corruption gain per day based on player morality and archetype.
 * Called once per Celebration day to accumulate corruption.
 */
export function computeDailyCorruption(app: Apprentice, playerMorality: number): number {
  const def = getArchetypeDef(app.archetype);
  // Morality distance drives base corruption
  const moralityPressure = Math.abs(playerMorality) / 100;
  const base = def.corruptionRisk * moralityPressure * 2;
  // High bond reduces corruption (except for high-risk archetypes)
  const bondProtection = def.corruptionRisk > 0.6 ? 0 : (app.bond / 100) * 0.5;
  return Math.max(0, base - bondProtection);
}

/** Is this apprentice ready to turn on the player? */
export function willBetray(app: Apprentice): boolean {
  return app.corruption >= 80;
}

/** Has this apprentice corrupted past the point of redemption? */
export function isCorrupted(app: Apprentice): boolean {
  return app.corruption >= 100;
}

/* ─── LOYALTY BONUSES ─── */

/**
 * Return the active loyalty bonus (scaled by rarity) for an apprentice
 * whose bond is high enough. Returns null if not loyal enough or corrupted.
 */
export function getActiveLoyaltyBonus(app: Apprentice): { target: string; value: number; label: string } | null {
  if (app.stage !== "companion" && app.stage !== "graduated") return null;
  if (app.bond < 40) return null;
  if (app.corruption >= 50) return null;
  const def = getArchetypeDef(app.archetype);
  const tier = getRarityTier(app.rarity);
  return {
    target: def.loyaltyBonus.target,
    value: def.loyaltyBonus.value * tier.loyaltyMultiplier,
    label: `${app.name} (${tier.name}): ${def.loyaltyBonus.label}`,
  };
}

/* ─── DEFAULT STATE ─── */

export const NO_APPRENTICE: { current: null; fallen: [] } = { current: null, fallen: [] };

export interface ApprenticeRosterState {
  current: Apprentice | null;
  fallen: Apprentice[];
}
