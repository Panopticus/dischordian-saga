/* ═══════════════════════════════════════════════════════
   DIALOG SKILL CHECK — shared D100 roll helper

   Used by both DialogWheel (tutorial skill checks) and NPCDialog
   (ME-style persuade/intimidate options on story conversations,
   added in plan §A1 — unify the dialogue UI grammar).

   The roll is `D100 + playerStat vs threshold`. A passed roll
   sums >= threshold; a failed roll falls short. The total/roll
   distinction is preserved in the result so the UI can show
   the dice value to the player.

   Pure & seedable — pass a deterministic rng for tests.
   ═══════════════════════════════════════════════════════ */

export type SkillType =
  | "charisma"
  | "intelligence"
  | "strength"
  | "perception"
  | "willpower"
  | "agility";

export interface SkillCheckResult {
  passed: boolean;
  roll: number;
  total: number;
  threshold: number;
}

/** D100 + playerStat vs threshold. `rng` defaults to Math.random. */
export function rollSkillCheck(
  playerStat: number,
  threshold: number,
  rng: () => number = Math.random,
): SkillCheckResult {
  const roll = Math.floor(rng() * 100) + 1;
  const total = roll + playerStat;
  return { passed: total >= threshold, roll, total, threshold };
}

/** Map the three core attribute scalars to the six skill stats
 *  used by skill checks. Mirrors the mapping originally inside
 *  DialogWheel so NPCDialog and any future dialog surface use the
 *  same stat derivation. */
export function deriveSkillStats(
  attrs: { attrAttack?: number; attrDefense?: number; attrVitality?: number } | null | undefined,
): Record<SkillType, number> {
  const atk = attrs?.attrAttack ?? 5;
  const def = attrs?.attrDefense ?? 5;
  const vit = attrs?.attrVitality ?? 5;
  return {
    charisma: vit * 10,
    intelligence: atk * 8 + def * 2,
    strength: atk * 10,
    perception: def * 6 + atk * 4,
    willpower: def * 10,
    agility: atk * 5 + vit * 5,
  };
}
