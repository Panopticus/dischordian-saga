/* ═══════════════════════════════════════════════════════
   EIDOLON SERVICE — Soul Stone Feeding & Evolution

   Integrates the Soul Stone system with the Eidolon Bond
   companion. Feed stones to your Eidolon to push it down
   the Hierarchy path (red → corruption → legendary) or
   the Dreamer's path (gold → ascension → mythic).

   10 red stones = Hierarchy Evolution (legendary)
   10 gold fragments = Dreamer Ascension (mythic)
   Violet = minor bond boost (uncommitted potential)
   ═══════════════════════════════════════════════════════ */

import type { StoneState } from "@/features/soulStones/types";
import { useSoulStoneStore } from "@/features/soulStones/soulStoneStore";

/* ─── TYPES ─── */

export type EidolonTransformState = "normal" | "hierarchy_evolved" | "dreamer_evolved";

export interface EidolonFeedResult {
  success: boolean;
  evolved: boolean;
  transformState: EidolonTransformState;
  newRarity?: "legendary" | "mythic";
  redStonesAbsorbed?: number;
  goldFragmentsAbsorbed?: number;
  narrative: string;
}

/* ─── STAT EFFECTS ─── */

/** How much each red stone boosts primary stat */
export const RED_STONE_PRIMARY_BOOST = 0.02; // +2% per red stone

/** How much each gold fragment boosts all stats */
export const GOLD_FRAGMENT_ALL_BOOST = 0.01; // +1% per gold fragment

/** Red stones needed for Hierarchy evolution */
export const HIERARCHY_EVOLUTION_THRESHOLD = 10;

/** Gold fragments needed for Dreamer ascension */
export const DREAMER_ASCENSION_THRESHOLD = 10;

/* ─── HIERARCHY EVOLUTION EFFECTS ─── */

export interface HierarchyForm {
  visualDescription: string;
  abilityName: string;
  abilityDescription: string;
  statModifiers: Record<string, number>;
  sideEffects: string[];
}

export const HIERARCHY_FORM: HierarchyForm = {
  visualDescription:
    "Your Eidolon's form has been rewritten by the Hierarchy. Dark veins of foxfire green trace corporate sigils across its body. Its eyes burn crimson. A faint hum of contractual obligation emanates from it at all times. It is larger, more powerful, and it watches you with an intelligence it did not previously possess.",
  abilityName: "Hierarchy's Investment",
  abilityDescription:
    "+25% primary stat. +10% Soul Stone drop rate. BUT: 2% of all Dream Token income is siphoned to the global Corruption Meter. The Hierarchy always takes its cut.",
  statModifiers: {
    primaryStat: 0.25,
    soulStoneDropRate: 0.10,
    dreamTokenDrain: -0.02,
  },
  sideEffects: [
    "Global corruption meter increases by 0.1% per day while equipped",
    "The Necromancer acknowledges your Eidolon with a nod — professional respect",
    "NPC dialog occasionally references the corporate sigil on your companion",
    "Red stone drops are 10% more common while this Eidolon is active",
  ],
};

/* ─── DREAMER ASCENSION EFFECTS ─── */

export interface DreamerForm {
  visualDescription: string;
  abilityName: string;
  abilityDescription: string;
  statModifiers: Record<string, number>;
  blessings: string[];
}

export const DREAMER_FORM: DreamerForm = {
  visualDescription:
    "Your Eidolon glows with golden-white light. Its form has become partially translucent — you can see stars inside it, as if it contains a tiny universe. Golden fractals orbit its body like electrons. A faint melody accompanies it everywhere — the Dreamer's lullaby, barely audible, infinitely beautiful.",
  abilityName: "The Dreamer's Grace",
  abilityDescription:
    "+10% ALL stats. +5% purification success rate. Daily lore vision (like the Dreamer's Tear). Zero drawbacks. Zero cost. Zero corruption.",
  statModifiers: {
    allStats: 0.10,
    purificationBonus: 0.05,
  },
  blessings: [
    "Global purity meter increases by 0.1% per day while equipped",
    "The Antiquarian writes about your Eidolon in the Chronicle with visible joy",
    "Purification success rate increases by 5% (stacks with other bonuses)",
    "Once per day, receive a brief lore vision about the dark sector",
    "The Dreamer's shield on the star map pulses when your Eidolon is near",
  ],
};

/* ─── NARRATIVE GENERATION ─── */

const CORRUPTION_FEED_NARRATIVES: Record<string, string[]> = {
  early: [
    "The red stone sinks into your Eidolon like a drop of blood into water. It shivers. Its eyes flash crimson for a moment.",
    "A faint hiss. The corruption spreads — slowly, beautifully, like ink in milk. Your Eidolon tilts its head, curious about its own transformation.",
    "The stone dissolves on contact. Your Eidolon's heartbeat — if it has one — pulses red for three beats. Then normal. Almost normal.",
  ],
  mid: [
    "Another soul consumed. Your Eidolon absorbs the corruption with something that looks disturbingly like hunger. The Hierarchy's mark grows visible.",
    "The red stone doesn't dissolve — it's PULLED in. Your Eidolon is no longer passively accepting. It is feeding.",
    "Dark veins trace across your Eidolon's body like circuitry activating. The Necromancer watches from the shadows. His glasses glow brighter.",
  ],
  late: [
    "The stone barely touches your Eidolon before it's consumed. The hunger is ravenous now. Corporate sigils burn beneath its skin like brands.",
    "Your Eidolon's form flickers — for a moment, you see something else beneath. Something larger. Something with a boardroom smile.",
    "The Hierarchy's investment matures. Your Eidolon is almost unrecognizable. Beautiful. Terrible. Profitable.",
  ],
};

const ASCENSION_FEED_NARRATIVES: Record<string, string[]> = {
  early: [
    "The golden fragment dissolves gently. A soft warmth spreads through your Eidolon's form. For a moment, it glows — not with power, but with patience.",
    "Light enters your Eidolon like a whisper entering a cathedral. Small. Quiet. But the echo lasts longer than the sound.",
    "Your Eidolon absorbs the purified light and becomes still. Perfectly still. Listening to something only it can hear.",
  ],
  mid: [
    "Another fragment of purified light joins the others. Your Eidolon's form softens at the edges — like a rough stone becoming a lens.",
    "The Dreamer's frequency hums in your Eidolon's core now. You can almost hear it when the Ark is quiet.",
    "Golden motes begin to orbit your Eidolon's body. Not decoration — resonance. It is harmonizing with something vast.",
  ],
  late: [
    "The light enters without resistance. Your Eidolon has become a vessel for something it was always meant to carry.",
    "Almost there. Your Eidolon trembles on the edge of transformation. Not from corruption — from becoming.",
    "The Antiquarian watches with visible hope. 'Almost,' he whispers. 'Almost.'",
  ],
};

/**
 * Get the appropriate feeding narrative based on stone state and absorption count.
 */
export function getFeedingNarrative(
  stoneState: StoneState,
  absorptionCount: number,
): string {
  if (stoneState === "violet") {
    return "The violet stone dissolves. Your Eidolon absorbs something — but what? The stone's potential was uncommitted. Your bond deepens by a fraction.";
  }

  const narratives = stoneState === "red"
    ? CORRUPTION_FEED_NARRATIVES
    : ASCENSION_FEED_NARRATIVES;

  const tier = absorptionCount <= 3 ? "early" : absorptionCount <= 6 ? "mid" : "late";
  const pool = narratives[tier];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get the evolution narrative when threshold is reached.
 */
export function getEvolutionNarrative(path: "hierarchy" | "dreamer"): string {
  if (path === "hierarchy") {
    return `The tenth soul consumed. Your Eidolon screams — not in pain, but in recognition. The Hierarchy's mark blazes across its form in foxfire green. When the light fades, it is changed. Larger. Darker. Its eyes burn with the cold intelligence of corporate ambition. The Necromancer steps forward: "Ten souls. The Hierarchy has promoted your companion. They don't do that lightly. Or cheaply. Congratulations. Or condolences. The difference is academic at this point."`;
  }

  return `The tenth fragment of purified light joins the others — and the sum becomes greater than its parts. Your Eidolon rises. Not flying — ascending. The Dreamer's resonance fills the room like a chord struck on a cosmic instrument. When the light fades, your companion is transformed. Not larger — luminous. Not darker — radiant. Its form shimmers with golden fractals, and you hear a melody. The Antiquarian sets down his quill. For the first time in the entire Chronicle, he smiles. "The Dreamer's light has found a new vessel. Not a tool. Not a weapon. A song."`;
}

/**
 * Consume a soul stone from inventory and feed it to the Eidolon.
 * Returns the stone ID consumed, or null if no stone of that state exists.
 */
export function consumeStoneForEidolon(stoneState: StoneState): string | null {
  const store = useSoulStoneStore.getState();
  const stone = store.stones.find((s) => s.state === stoneState && !s.isPurifying);
  if (!stone) return null;

  // Remove stone from inventory
  useSoulStoneStore.setState((s) => ({
    stones: s.stones.filter((st) => st.id !== stone.id),
  }));

  return stone.id;
}

/**
 * Check if the player can feed a specific stone type to their Eidolon.
 */
export function canFeedStone(stoneState: StoneState): boolean {
  const store = useSoulStoneStore.getState();
  return store.stones.some((s) => s.state === stoneState && !s.isPurifying);
}

/**
 * Get a summary of the Eidolon's soul stone absorption progress.
 */
export function getAbsorptionProgress(): {
  red: { count: number; threshold: number; percent: number };
  gold: { count: number; threshold: number; percent: number };
} {
  // This reads from server state via tRPC — placeholder for client-side tracking
  return {
    red: { count: 0, threshold: HIERARCHY_EVOLUTION_THRESHOLD, percent: 0 },
    gold: { count: 0, threshold: DREAMER_ASCENSION_THRESHOLD, percent: 0 },
  };
}
