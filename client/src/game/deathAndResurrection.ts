/* ═══════════════════════════════════════════════════════
   DEATH & RESURRECTION PROTOCOLS

   Death is REAL in the Arena. Your clone body dies.
   You lose experience, skill bonuses degrade, items are damaged.

   But death also POWERS the Resurrection Protocols —
   each death charges a meter that unlocks:
   - Necromancer lore
   - Special achievements
   - Ultra-rare materials (Soul Fragments)
   - The Eyes (legendary spy card)
   - The Necromancer's pet
   - Access to the Castle of Death

   Dark Souls (humanity/resurrection), Returnal (cycle of death)

   Lore: The Necromancer designed this system. Every death you suffer
   feeds the Resurrection Protocols. He's been watching. Counting.
   Preparing to resurrect something much older than you.
   ═══════════════════════════════════════════════════════ */

/* ─── SOUL DAMAGE ─── */

export interface SoulState {
  /** Accumulated soul damage 0-100 */
  soulDamage: number;
  /** Active skill degradations */
  degradations: SkillDegradation[];
  /** Resurrection meter 0-100 */
  resurrectionMeter: number;
  /** Total deaths across all runs */
  totalDeaths: number;
  /** Soul Fragments collected (ultra-rare material) */
  soulFragments: number;
  /** Unlocked Necromancer content */
  necromancerUnlocks: string[];
}

export interface SkillDegradation {
  stat: "attack" | "defense" | "speed" | "hp" | "luck" | "trust_gain" | "xp_gain";
  penalty: number; // Percentage reduction
  /** When this degradation heals (timestamp) */
  healsAt: number;
}

/* ─── DEATH CONSEQUENCES ─── */

export interface DeathConsequence {
  xpLost: number;
  skillDegradations: SkillDegradation[];
  itemDamage: { itemId: string; damagePercent: number }[];
  soulDamageIncrease: number;
  resurrectionMeterGain: number;
  /** Lore fragment revealed */
  loreFragment?: string;
  /** Narrator message */
  narratorMessage: string;
}

const NECROMANCER_LORE_FRAGMENTS = [
  "First death: 'The Necromancer felt it. A new thread for the tapestry.'",
  "Second death: 'He's been counting. Every Potential dies twice. Then they matter.'",
  "Third death: 'In the Matrix of Dreams, he nodded approvingly. You're becoming interesting.'",
  "Fifth death: 'The Resurrectionist visited the Necromancer's castle. They discussed you specifically.'",
  "Tenth death: 'The Necromancer has prepared a gift. It is waiting in the Castle of Death.'",
  "Fifteenth death: 'He remembers you from other timelines now. You keep dying at the same moment. Why?'",
  "Twentieth death: 'The Necromancer speaks directly: \"You are not the first to cycle. You will not be the last.\"'",
  "Twenty-fifth death: 'Something stirs in the Castle. An older protocol awakens.'",
];

export function processDeath(
  currentState: SoulState,
  context: { xp: number; equippedItems: string[] }
): DeathConsequence {
  const deathNum = currentState.totalDeaths + 1;

  // XP loss scales with soul damage
  const xpLost = Math.min(context.xp, Math.floor(100 + deathNum * 25 + currentState.soulDamage * 2));

  // Skill degradations (last 1-3 days real-time)
  const degradations: SkillDegradation[] = [];
  const now = Date.now();
  const dayMs = 86400000;

  if (deathNum <= 3) {
    degradations.push({ stat: "attack", penalty: 5, healsAt: now + dayMs });
  } else if (deathNum <= 10) {
    degradations.push({ stat: "attack", penalty: 10, healsAt: now + dayMs * 2 });
    degradations.push({ stat: "defense", penalty: 5, healsAt: now + dayMs });
  } else {
    degradations.push({ stat: "attack", penalty: 15, healsAt: now + dayMs * 3 });
    degradations.push({ stat: "defense", penalty: 10, healsAt: now + dayMs * 2 });
    degradations.push({ stat: "speed", penalty: 5, healsAt: now + dayMs });
  }

  // Equipment damage
  const itemDamage = context.equippedItems.map(itemId => ({
    itemId,
    damagePercent: 10 + Math.floor(Math.random() * 15), // 10-25% damage per item
  }));

  // Soul damage increases
  const soulDamageIncrease = Math.min(100 - currentState.soulDamage, 10);

  // Resurrection meter fills
  const resurrectionMeterGain = 10 + Math.floor(deathNum / 3);

  // Lore fragment at specific thresholds
  let loreFragment: string | undefined;
  if (deathNum === 1) loreFragment = NECROMANCER_LORE_FRAGMENTS[0];
  else if (deathNum === 2) loreFragment = NECROMANCER_LORE_FRAGMENTS[1];
  else if (deathNum === 3) loreFragment = NECROMANCER_LORE_FRAGMENTS[2];
  else if (deathNum === 5) loreFragment = NECROMANCER_LORE_FRAGMENTS[3];
  else if (deathNum === 10) loreFragment = NECROMANCER_LORE_FRAGMENTS[4];
  else if (deathNum === 15) loreFragment = NECROMANCER_LORE_FRAGMENTS[5];
  else if (deathNum === 20) loreFragment = NECROMANCER_LORE_FRAGMENTS[6];
  else if (deathNum === 25) loreFragment = NECROMANCER_LORE_FRAGMENTS[7];

  const narratorMessage = [
    "Your clone body fails. Your consciousness snaps back to the Ark.",
    "Darkness. Then: awareness. You were dead. Now you aren't. Again.",
    "The Resurrection Protocols activate. You owe the Necromancer another death.",
    "You feel yourself grow lighter. Some part of you stayed behind.",
  ][Math.min(3, Math.floor(deathNum / 5))];

  return {
    xpLost,
    skillDegradations: degradations,
    itemDamage,
    soulDamageIncrease,
    resurrectionMeterGain,
    loreFragment,
    narratorMessage,
  };
}

/* ─── RESURRECTION METER REWARDS ─── */

export interface ResurrectionUnlock {
  meterThreshold: number;
  id: string;
  name: string;
  description: string;
  type: "lore" | "achievement" | "material" | "card" | "pet" | "room";
}

export const RESURRECTION_UNLOCKS: ResurrectionUnlock[] = [
  { meterThreshold: 10, id: "necro_lore_1", name: "Necromancer: First Notice", description: "The Necromancer has noticed you.", type: "lore" },
  { meterThreshold: 25, id: "soul_fragment_recipe", name: "Soul Fragment Recipe", description: "Craft Soul Fragments from accumulated death experiences.", type: "material" },
  { meterThreshold: 40, id: "necro_achievement_1", name: "Achievement: Death Learner", description: "Died 5+ times and still pushing forward.", type: "achievement" },
  { meterThreshold: 55, id: "the_eyes_card", name: "The Eyes (Legendary Spy Card)", description: "The Necromancer grants you The Eyes — a legendary spy card.", type: "card" },
  { meterThreshold: 70, id: "castle_access", name: "Castle of Death Access", description: "The Matrix of Dreams opens a path to the Castle of Death.", type: "room" },
  { meterThreshold: 85, id: "necromancer_pet", name: "Bone Familiar Pet", description: "The Necromancer gifts you a Bone Familiar companion.", type: "pet" },
  { meterThreshold: 100, id: "necro_achievement_final", name: "Achievement: Thazulok's Apprentice", description: "Max resurrection meter. The Necromancer knows your name.", type: "achievement" },
];

export function getUnlockedAtMeter(meterValue: number): ResurrectionUnlock[] {
  return RESURRECTION_UNLOCKS.filter(u => meterValue >= u.meterThreshold);
}

export function getNextUnlock(meterValue: number): ResurrectionUnlock | null {
  return RESURRECTION_UNLOCKS.find(u => meterValue < u.meterThreshold) || null;
}

/* ─── SOUL FRAGMENT USES ─── */

export const SOUL_FRAGMENT_USES = [
  { id: "revive_pet", name: "Revive Fallen Pet", cost: 3, description: "Instantly revive a dead pet (skips cooldown)" },
  { id: "skip_degradation", name: "Purge Soul Damage", cost: 5, description: "Heal all skill degradations immediately" },
  { id: "reroll_death", name: "Reroll Death Outcome", cost: 10, description: "Recover 50% of XP lost from your last death" },
  { id: "necromancer_favor", name: "Necromancer's Favor", cost: 20, description: "Unlock a random legendary card from the Necromancer's collection" },
];

/* ─── DEATH STATS ─── */

export function getSoulStatus(state: SoulState): {
  level: "intact" | "damaged" | "fractured" | "broken" | "shattered";
  description: string;
} {
  if (state.soulDamage === 0) return { level: "intact", description: "Your soul is whole. For now." };
  if (state.soulDamage < 25) return { level: "damaged", description: "Minor cracks. Nothing you can't walk off." };
  if (state.soulDamage < 50) return { level: "fractured", description: "You feel the deaths. They echo." };
  if (state.soulDamage < 80) return { level: "broken", description: "Something is wrong. You know it. The Necromancer knows it." };
  return { level: "shattered", description: "You're barely holding together. He's waiting." };
}

/* ─── DEFAULT STATE ─── */

export const DEFAULT_SOUL_STATE: SoulState = {
  soulDamage: 0,
  degradations: [],
  resurrectionMeter: 0,
  totalDeaths: 0,
  soulFragments: 0,
  necromancerUnlocks: [],
};
