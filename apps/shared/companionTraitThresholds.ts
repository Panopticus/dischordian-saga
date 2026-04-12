/* ═══════════════════════════════════════════════════════
   COMPANION TRAIT THRESHOLDS

   Party-wide synergy system: when the player fields multiple
   companions/pets/summons that share a trait, escalating
   threshold bonuses activate — small at 2 matching, large at
   5, game-changing at 7.

   Traits checked across the active party:
     • Element     (earth/fire/water/air/space/time/probability/reality)
     • Species     (demagi/quarchon/neyon/voltari/iron_lion/construct)
     • Faction     (architect/dreamer/insurgency/new_babylon/hierarchy/voltari)
     • Class       (soldier/scholar/rogue/envoy/mystic/beast)

   This layers ON TOP of per-companion synergies in
   `companionSynergies.ts`. That system asks "how does THIS
   companion fit YOUR build." This system asks "how do your
   companions fit EACH OTHER."
   ═══════════════════════════════════════════════════════ */

export type CompanionTraitType = "element" | "species" | "faction" | "class";

/* ─── PARTY MEMBER SHAPE ─── */

export interface PartyMemberTraits {
  id: string;
  name: string;
  element?: string;
  species?: string;
  faction?: string;
  combatClass?: string;
}

/* ─── THRESHOLD DEFINITION ─── */

export interface TraitThreshold {
  /** How many matching party members required */
  count: number;
  /** Tier name shown in UI */
  tierName: string;
  /** Color for UI */
  color: string;
  /** Bonuses granted */
  bonuses: TraitBonus[];
  /** Narrative flavor */
  flavor: string;
}

export interface TraitBonus {
  type: "multiplier" | "flat" | "unlock" | "passive";
  target: string;
  value: number;
  label: string;
}

export interface TraitDefinition {
  id: string;
  traitType: CompanionTraitType;
  /** The value to match (e.g., element: "fire", species: "demagi") */
  traitValue: string;
  name: string;
  icon: string;
  /** Bronze / Silver / Gold threshold tiers */
  thresholds: TraitThreshold[];
}

/* ─── ELEMENT TRAITS ─── */

export const ELEMENT_TRAITS: TraitDefinition[] = [
  {
    id: "trait_fire", traitType: "element", traitValue: "fire",
    name: "Pyre Alignment", icon: "🔥",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "fire_damage", value: 1.15, label: "+15% fire damage" }],
        flavor: "Two flames feed each other. The Ark grows warmer." },
      { count: 4, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "fire_damage", value: 1.30, label: "+30% fire damage" },
          { type: "passive", target: "burn_on_hit", value: 0.15, label: "15% chance to apply burn" },
        ],
        flavor: "Four flames form a hearth. Enemies feel the heat before the strike lands." },
      { count: 6, tierName: "Gold", color: "#ffd700",
        bonuses: [
          { type: "multiplier", target: "fire_damage", value: 1.60, label: "+60% fire damage" },
          { type: "passive", target: "burn_on_hit", value: 0.35, label: "35% burn chance" },
          { type: "unlock", target: "pyre_ultimate", value: 1, label: "Unlock: Pyre Convergence (party-wide AOE)" },
        ],
        flavor: "Six flames become a conflagration. You do not carry fire anymore — you ARE fire." },
    ],
  },
  {
    id: "trait_water", traitType: "element", traitValue: "water",
    name: "Tidal Flow", icon: "💧",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "heal_power", value: 1.15, label: "+15% healing" }],
        flavor: "Two currents find each other." },
      { count: 4, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "heal_power", value: 1.30, label: "+30% healing" },
          { type: "passive", target: "regen_per_turn", value: 3, label: "+3 HP regen per turn, all allies" },
        ],
        flavor: "A tide rises. Wounds close faster than they open." },
      { count: 6, tierName: "Gold", color: "#ffd700",
        bonuses: [
          { type: "multiplier", target: "heal_power", value: 1.60, label: "+60% healing" },
          { type: "passive", target: "regen_per_turn", value: 8, label: "+8 HP regen all allies" },
          { type: "unlock", target: "tidal_revival", value: 1, label: "Unlock: Tidal Revival (revive one fallen ally per fight)" },
        ],
        flavor: "The Flow remembers every drop. Death becomes negotiable." },
    ],
  },
  {
    id: "trait_earth", traitType: "element", traitValue: "earth",
    name: "Bedrock", icon: "🗿",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "armor", value: 1.15, label: "+15% armor" }],
        flavor: "Two stones hold each other up." },
      { count: 4, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "armor", value: 1.30, label: "+30% armor" },
          { type: "flat", target: "damage_reduction", value: 10, label: "-10 flat damage per hit" },
        ],
        flavor: "Four stones form a wall." },
      { count: 6, tierName: "Gold", color: "#ffd700",
        bonuses: [
          { type: "multiplier", target: "armor", value: 1.60, label: "+60% armor" },
          { type: "flat", target: "damage_reduction", value: 25, label: "-25 flat damage per hit" },
          { type: "unlock", target: "bedrock_stance", value: 1, label: "Unlock: Bedrock Stance (immune to knockback/stun)" },
        ],
        flavor: "Six stones become a mountain. Mountains do not move." },
    ],
  },
  {
    id: "trait_air", traitType: "element", traitValue: "air",
    name: "Cyclone", icon: "🌪️",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "dodge_chance", value: 1.15, label: "+15% dodge" }],
        flavor: "Two gusts find a rhythm." },
      { count: 4, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "dodge_chance", value: 1.30, label: "+30% dodge" },
          { type: "multiplier", target: "initiative", value: 1.25, label: "+25% initiative (first strike)" },
        ],
        flavor: "A spiral tightens. You move before the enemy decides to." },
      { count: 6, tierName: "Gold", color: "#ffd700",
        bonuses: [
          { type: "multiplier", target: "dodge_chance", value: 1.60, label: "+60% dodge" },
          { type: "unlock", target: "cyclone_strike", value: 1, label: "Unlock: Cyclone Strike (two attacks per turn)" },
        ],
        flavor: "Six winds become a storm. Enemies strike empty air." },
    ],
  },
  {
    id: "trait_time", traitType: "element", traitValue: "time",
    name: "Chronoweave", icon: "⏳",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "cooldown_reduction", value: 0.90, label: "-10% all cooldowns" }],
        flavor: "Two threads of time entangle." },
      { count: 4, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "cooldown_reduction", value: 0.80, label: "-20% all cooldowns" },
          { type: "passive", target: "rewind_on_death", value: 0.15, label: "15% chance to rewind fatal blow" },
        ],
        flavor: "Four threads form a weave. Moments repeat in your favor." },
      { count: 6, tierName: "Gold", color: "#ffd700",
        bonuses: [
          { type: "multiplier", target: "cooldown_reduction", value: 0.65, label: "-35% all cooldowns" },
          { type: "unlock", target: "chronoweave_ultimate", value: 1, label: "Unlock: Chronoweave (replay the last 3 actions)" },
        ],
        flavor: "Six threads become a tapestry. Time negotiates with you." },
    ],
  },
  {
    id: "trait_probability", traitType: "element", traitValue: "probability",
    name: "Luck Cascade", icon: "🎲",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "crit_chance", value: 1.15, label: "+15% crit chance" }],
        flavor: "Two dice find each other." },
      { count: 4, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "crit_chance", value: 1.30, label: "+30% crit chance" },
          { type: "passive", target: "reroll_failed_dodge", value: 0.25, label: "25% chance to reroll failed dodges" },
        ],
        flavor: "Four dice form a pattern. The pattern is YOUR pattern." },
      { count: 6, tierName: "Gold", color: "#ffd700",
        bonuses: [
          { type: "multiplier", target: "crit_chance", value: 1.60, label: "+60% crit chance" },
          { type: "unlock", target: "luck_cascade", value: 1, label: "Unlock: Luck Cascade (guarantee next 3 rolls)" },
        ],
        flavor: "Six dice become fate. Fate is a tool now." },
    ],
  },
];

/* ─── SPECIES TRAITS ─── */

export const SPECIES_TRAITS: TraitDefinition[] = [
  {
    id: "trait_demagi", traitType: "species", traitValue: "demagi",
    name: "Arcane Lineage", icon: "🩸",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "elemental_potency", value: 1.10, label: "+10% elemental potency" }],
        flavor: "Two DeMagi resonate. Ancient modifications remember each other." },
      { count: 4, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "elemental_potency", value: 1.25, label: "+25% elemental potency" },
          { type: "passive", target: "element_mastery", value: 1, label: "Access 2 element types simultaneously" },
        ],
        flavor: "A DeMagi chorus. The arcane arts compound." },
    ],
  },
  {
    id: "trait_quarchon", traitType: "species", traitValue: "quarchon",
    name: "Dimensional Sight", icon: "👁️",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "passive", target: "reveal_invisible", value: 1, label: "See stealthed enemies" }],
        flavor: "Two Quarchon overlap reality perception. Nothing hides." },
      { count: 4, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "passive", target: "reveal_invisible", value: 1, label: "See stealthed enemies" },
          { type: "multiplier", target: "trap_detection", value: 2.0, label: "+100% trap/ambush detection" },
          { type: "unlock", target: "phase_step", value: 1, label: "Unlock: Phase Step (ignore terrain once per fight)" },
        ],
        flavor: "Four Quarchon see every probability. The unseen surrenders." },
    ],
  },
  {
    id: "trait_neyon", traitType: "species", traitValue: "neyon",
    name: "Liminal Bridge", icon: "🌉",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "xp_bonus", value: 1.10, label: "+10% XP gain" }],
        flavor: "Two Ne-Yon walk between worlds. Lessons arrive faster." },
      { count: 3, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "xp_bonus", value: 1.25, label: "+25% XP gain" },
          { type: "unlock", target: "between_access", value: 1, label: "Unlock: The Between (hidden rest area mid-fight)" },
        ],
        flavor: "Three Ne-Yon open the Between. You can rest where nothing exists." },
    ],
  },
  {
    id: "trait_voltari", traitType: "species", traitValue: "voltari",
    name: "Electrical Chorus", icon: "⚡",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "passive", target: "chain_lightning", value: 0.15, label: "15% chance: attacks chain to nearby enemy" }],
        flavor: "Two Voltari share patterns. Electricity finds the path." },
      { count: 3, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "passive", target: "chain_lightning", value: 0.35, label: "35% chain lightning chance" },
          { type: "passive", target: "emp_on_crit", value: 1, label: "Crits disable enemy abilities for 1 turn" },
        ],
        flavor: "Three Voltari become a storm. Enemies short-circuit mid-strike." },
    ],
  },
  {
    id: "trait_construct", traitType: "species", traitValue: "construct",
    name: "Assembled Will", icon: "⚙️",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "repair_rate", value: 1.25, label: "+25% repair rate between fights" }],
        flavor: "Two constructs share maintenance protocols." },
      { count: 4, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "repair_rate", value: 1.50, label: "+50% repair rate" },
          { type: "passive", target: "immune_to_poison_bleed", value: 1, label: "Immune to poison/bleed (no organics)" },
        ],
        flavor: "Four constructs form a workshop. Damage is a scheduling problem." },
    ],
  },
];

/* ─── FACTION TRAITS ─── */

export const FACTION_TRAITS: TraitDefinition[] = [
  {
    id: "trait_architect", traitType: "faction", traitValue: "architect",
    name: "Ordered Protocol", icon: "⟨⟩",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "plan_damage", value: 1.15, label: "+15% damage vs. planned targets" }],
        flavor: "Two Architect-aligned minds converge on a plan." },
      { count: 3, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "plan_damage", value: 1.30, label: "+30% damage vs. planned targets" },
          { type: "unlock", target: "preview_enemy_moves", value: 1, label: "Unlock: Preview enemy's next move" },
        ],
        flavor: "Three Architects run a simulation. Enemies execute your script." },
    ],
  },
  {
    id: "trait_dreamer", traitType: "faction", traitValue: "dreamer",
    name: "Dreamer's Chorus", icon: "🌙",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "improvise_damage", value: 1.15, label: "+15% damage on unplanned actions" }],
        flavor: "Two Dreamers sing different songs. The harmony surprises." },
      { count: 3, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "improvise_damage", value: 1.35, label: "+35% improvised damage" },
          { type: "passive", target: "random_bless", value: 0.20, label: "20% chance: random ally gains buff each turn" },
        ],
        flavor: "Three Dreamers remake the song mid-fight. Enemies cannot predict you." },
    ],
  },
  {
    id: "trait_insurgency", traitType: "faction", traitValue: "insurgency",
    name: "Insurgency Cell", icon: "🔻",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "ambush_damage", value: 1.20, label: "+20% first-strike damage" }],
        flavor: "Two operatives in the shadows. One target between them." },
      { count: 3, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "ambush_damage", value: 1.40, label: "+40% first-strike damage" },
          { type: "unlock", target: "assassination_protocol", value: 1, label: "Unlock: Assassination Protocol (guaranteed crit on isolated enemy)" },
        ],
        flavor: "Three cells coordinate. The target doesn't hear the door open." },
    ],
  },
  {
    id: "trait_voltari_faction", traitType: "faction", traitValue: "voltari",
    name: "Storm Alliance", icon: "🌩️",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "pattern_recognition", value: 1.20, label: "+20% puzzle/decode rewards" }],
        flavor: "Two Voltari allies share signal patterns with the party." },
    ],
  },
];

/* ─── CLASS TRAITS ─── */

export const CLASS_TRAITS: TraitDefinition[] = [
  {
    id: "trait_soldier", traitType: "class", traitValue: "soldier",
    name: "Phalanx", icon: "🛡️",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "armor", value: 1.10, label: "+10% armor (whole party)" }],
        flavor: "Two shields lock." },
      { count: 4, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "armor", value: 1.25, label: "+25% armor" },
          { type: "passive", target: "taunt_aggro", value: 1, label: "Enemies prioritize front line" },
        ],
        flavor: "Four shields form a wall. Enemies can't reach the back line." },
    ],
  },
  {
    id: "trait_scholar", traitType: "class", traitValue: "scholar",
    name: "Archive Network", icon: "📜",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "ability_power", value: 1.15, label: "+15% ability power" }],
        flavor: "Two scholars cross-reference. Knowledge compounds." },
      { count: 3, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "ability_power", value: 1.30, label: "+30% ability power" },
          { type: "passive", target: "identify_weakness", value: 1, label: "Reveal enemy resistances/weaknesses" },
        ],
        flavor: "Three scholars run the library in real time. Enemies have no secrets." },
    ],
  },
  {
    id: "trait_rogue", traitType: "class", traitValue: "rogue",
    name: "Shadow Net", icon: "🗡️",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "backstab_damage", value: 1.25, label: "+25% flank damage" }],
        flavor: "Two rogues find the blind spots." },
      { count: 3, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "backstab_damage", value: 1.50, label: "+50% flank damage" },
          { type: "passive", target: "steal_on_kill", value: 0.25, label: "25% chance to steal credits on kill" },
        ],
        flavor: "Three rogues close every blind spot. Enemies have no flanks left." },
    ],
  },
  {
    id: "trait_envoy", traitType: "class", traitValue: "envoy",
    name: "Diplomatic Chorus", icon: "🕊️",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "passive", target: "convert_chance", value: 0.10, label: "10% chance to convert weak enemy mid-fight" }],
        flavor: "Two envoys speak with one voice." },
      { count: 3, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "passive", target: "convert_chance", value: 0.25, label: "25% convert chance" },
          { type: "multiplier", target: "peaceful_xp", value: 1.50, label: "+50% XP from peaceful resolutions" },
        ],
        flavor: "Three envoys dissolve the argument. Half the enemies forget why they're fighting." },
    ],
  },
  {
    id: "trait_mystic", traitType: "class", traitValue: "mystic",
    name: "Weave Concordance", icon: "✨",
    thresholds: [
      { count: 2, tierName: "Bronze", color: "#cd7f32",
        bonuses: [{ type: "multiplier", target: "mana_regen", value: 1.25, label: "+25% mana regen" }],
        flavor: "Two mystics pool the weave." },
      { count: 3, tierName: "Silver", color: "#c0c0c0",
        bonuses: [
          { type: "multiplier", target: "mana_regen", value: 1.50, label: "+50% mana regen" },
          { type: "unlock", target: "shared_spells", value: 1, label: "Unlock: Cast allies' spells once per fight" },
        ],
        flavor: "Three mystics braid the weave. Spells cross between casters." },
    ],
  },
];

/* ─── ALL TRAITS ─── */

export const ALL_TRAITS: TraitDefinition[] = [
  ...ELEMENT_TRAITS,
  ...SPECIES_TRAITS,
  ...FACTION_TRAITS,
  ...CLASS_TRAITS,
];

/* ─── RUNTIME: COMPUTE ACTIVE THRESHOLDS ─── */

export interface ActiveTrait {
  trait: TraitDefinition;
  matchingMembers: string[];   // names of party members contributing
  matchCount: number;
  activeThreshold: TraitThreshold | null;  // highest reached
  nextThreshold: TraitThreshold | null;    // next unlock target
}

/**
 * Analyze a party and return all traits with their threshold status.
 */
export function computeActiveTraits(party: PartyMemberTraits[]): ActiveTrait[] {
  const results: ActiveTrait[] = [];

  for (const trait of ALL_TRAITS) {
    const matching = party.filter(m => {
      const value = getTraitValue(m, trait.traitType);
      return value === trait.traitValue;
    });

    if (matching.length < 2) continue; // Don't show traits below threshold-1

    const matchCount = matching.length;
    const sortedThresholds = [...trait.thresholds].sort((a, b) => a.count - b.count);

    let activeThreshold: TraitThreshold | null = null;
    let nextThreshold: TraitThreshold | null = null;

    for (const t of sortedThresholds) {
      if (matchCount >= t.count) activeThreshold = t;
      else if (!nextThreshold) nextThreshold = t;
    }

    results.push({
      trait,
      matchingMembers: matching.map(m => m.name),
      matchCount,
      activeThreshold,
      nextThreshold,
    });
  }

  // Sort: active traits first (highest tier), then aspirational
  return results.sort((a, b) => {
    const ai = a.activeThreshold ? a.activeThreshold.count : 0;
    const bi = b.activeThreshold ? b.activeThreshold.count : 0;
    return bi - ai;
  });
}

function getTraitValue(member: PartyMemberTraits, traitType: CompanionTraitType): string | undefined {
  switch (traitType) {
    case "element": return member.element;
    case "species": return member.species;
    case "faction": return member.faction;
    case "class": return member.combatClass;
  }
}

/**
 * Flatten all active bonuses from the party for combat resolution.
 */
export function resolvePartyBonuses(party: PartyMemberTraits[]): TraitBonus[] {
  const active = computeActiveTraits(party);
  const bonuses: TraitBonus[] = [];
  for (const t of active) {
    if (t.activeThreshold) bonuses.push(...t.activeThreshold.bonuses);
  }
  return bonuses;
}

/**
 * Aggregate multiplier bonuses by target (combines stacking bonuses).
 */
export function aggregateMultipliers(bonuses: TraitBonus[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const b of bonuses) {
    if (b.type !== "multiplier") continue;
    map[b.target] = (map[b.target] ?? 1) * b.value;
  }
  return map;
}

/**
 * Recommend ONE party member swap to unlock the next threshold tier.
 * Returns the most-impactful change player could make.
 */
export function suggestThresholdUpgrade(party: PartyMemberTraits[]): {
  traitName: string;
  needed: number;
  current: number;
  recommendation: string;
} | null {
  const active = computeActiveTraits(party);
  let best: { delta: number; trait: ActiveTrait } | null = null;
  for (const t of active) {
    if (!t.nextThreshold) continue;
    const delta = t.nextThreshold.count - t.matchCount;
    if (delta <= 0) continue;
    if (!best || delta < best.delta) best = { delta, trait: t };
  }
  if (!best) return null;
  return {
    traitName: best.trait.trait.name,
    needed: best.trait.nextThreshold!.count,
    current: best.trait.matchCount,
    recommendation: `Add ${best.delta} more ${best.trait.trait.traitValue} ${best.trait.trait.traitType} member(s) to unlock ${best.trait.nextThreshold!.tierName}: ${best.trait.nextThreshold!.flavor}`,
  };
}
