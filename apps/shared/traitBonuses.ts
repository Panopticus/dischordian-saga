/* ═══════════════════════════════════════════════════════
   TRAIT-BASED FIGHTER BONUSES — NFT Potentials Integration
   Maps NFT traits (Class, Weapon, Specie) to stat boosts
   that apply when a holder fights in the arena.
   ═══════════════════════════════════════════════════════ */

export interface TraitBonus {
  attack: number;   // additive to fighter's attack stat
  defense: number;  // additive to fighter's defense stat
  hp: number;       // additive to fighter's HP
  speed: number;    // additive to fighter's speed stat (unused in engine currently, reserved)
  label: string;    // display label for UI
  color: string;    // hex color for UI glow
}

/* ─── CLASS BONUSES ─── */
export const CLASS_BONUSES: Record<string, TraitBonus> = {
  Spy:       { attack: 1, defense: 0, hp: 0,  speed: 2, label: "Spy Instinct",      color: "#22d3ee" },
  Oracle:    { attack: 0, defense: 1, hp: 5,  speed: 0, label: "Oracle's Sight",     color: "#a78bfa" },
  Assassin:  { attack: 2, defense: 0, hp: 0,  speed: 1, label: "Assassin's Edge",    color: "#ef4444" },
  Engineer:  { attack: 0, defense: 2, hp: 5,  speed: 0, label: "Engineer's Armor",   color: "#f59e0b" },
  Soldier:   { attack: 1, defense: 1, hp: 5,  speed: 0, label: "Soldier's Grit",     color: "#22c55e" },
  "Ne-Yon":  { attack: 1, defense: 1, hp: 0,  speed: 1, label: "Ne-Yon Resonance",   color: "#fbbf24" },
};

/* ─── WEAPON BONUSES ─── */
export const WEAPON_BONUSES: Record<string, TraitBonus> = {
  Sword:       { attack: 2, defense: 0, hp: 0,  speed: 0, label: "Blade Mastery",      color: "#94a3b8" },
  Staff:       { attack: 0, defense: 1, hp: 5,  speed: 0, label: "Staff Guard",         color: "#a78bfa" },
  Daggers:     { attack: 1, defense: 0, hp: 0,  speed: 1, label: "Twin Fang",           color: "#ef4444" },
  Bow:         { attack: 1, defense: 0, hp: 0,  speed: 1, label: "Archer's Precision",  color: "#22c55e" },
  Gauntlets:   { attack: 1, defense: 1, hp: 0,  speed: 0, label: "Iron Fists",          color: "#f59e0b" },
  Scythe:      { attack: 2, defense: 0, hp: 0,  speed: 0, label: "Reaper's Reach",      color: "#8b5cf6" },
  Spear:       { attack: 1, defense: 0, hp: 0,  speed: 1, label: "Lancer's Thrust",     color: "#06b6d4" },
  Hammer:      { attack: 2, defense: 1, hp: 0,  speed: 0, label: "Hammer Force",        color: "#d97706" },
  Shield:      { attack: 0, defense: 2, hp: 5,  speed: 0, label: "Shield Wall",         color: "#3b82f6" },
  Claws:       { attack: 2, defense: 0, hp: 0,  speed: 0, label: "Feral Claws",         color: "#dc2626" },
  Tome:        { attack: 1, defense: 1, hp: 0,  speed: 0, label: "Arcane Knowledge",    color: "#7c3aed" },
  Whip:        { attack: 1, defense: 0, hp: 0,  speed: 1, label: "Lash Strike",         color: "#ec4899" },
};

/* ─── SPECIE BONUSES ─── */
export const SPECIE_BONUSES: Record<string, TraitBonus> = {
  DeMagi:    { attack: 0, defense: 1, hp: 10, speed: 0, label: "DeMagi Resilience",  color: "#3b82f6" },
  Quarchon:  { attack: 1, defense: 0, hp: 5,  speed: 1, label: "Quarchon Fury",      color: "#a855f7" },
  "Ne-Yon":  { attack: 1, defense: 1, hp: 0,  speed: 0, label: "Ne-Yon Harmony",     color: "#fbbf24" },
};

/** Combine all trait bonuses for a given NFT's traits */
export function calculateTraitBonuses(traits: {
  nftClass?: string | null;
  weapon?: string | null;
  specie?: string | null;
}): {
  total: TraitBonus;
  breakdown: Array<{ source: string; bonus: TraitBonus }>;
} {
  const breakdown: Array<{ source: string; bonus: TraitBonus }> = [];
  const total: TraitBonus = { attack: 0, defense: 0, hp: 0, speed: 0, label: "Combined", color: "#a855f7" };

  if (traits.nftClass && CLASS_BONUSES[traits.nftClass]) {
    const b = CLASS_BONUSES[traits.nftClass];
    breakdown.push({ source: `Class: ${traits.nftClass}`, bonus: b });
    total.attack += b.attack;
    total.defense += b.defense;
    total.hp += b.hp;
    total.speed += b.speed;
  }

  if (traits.weapon && WEAPON_BONUSES[traits.weapon]) {
    const b = WEAPON_BONUSES[traits.weapon];
    breakdown.push({ source: `Weapon: ${traits.weapon}`, bonus: b });
    total.attack += b.attack;
    total.defense += b.defense;
    total.hp += b.hp;
    total.speed += b.speed;
  }

  if (traits.specie && SPECIE_BONUSES[traits.specie]) {
    const b = SPECIE_BONUSES[traits.specie];
    breakdown.push({ source: `Specie: ${traits.specie}`, bonus: b });
    total.attack += b.attack;
    total.defense += b.defense;
    total.hp += b.hp;
    total.speed += b.speed;
  }

  return { total, breakdown };
}
