/* ═══════════════════════════════════════════════════════
   CHARISMA TRUST SCALING

   First consumer of the previously-inert characterSheets.charisma
   column, identified by the choice-impact audit as a stat that
   "exists but does nothing." The dialog wheel skill-check
   fallback (apps/shared/dialogWheel.ts) is the second consumer;
   together they make character creation's class-specific stat
   distribution observable to the player.

   Formula: positive trust deltas are multiplied by
   `(charisma - 5) * 0.05 + 1.0`. At default charisma 5 the
   multiplier is 1.0 (no behaviour change). Spy (6) → ×1.05,
   Oracle (7) → ×1.10, Assassin (3) → ×0.90. Negative deltas
   are NOT scaled — earned trust loss bites at full strength
   regardless of how charming you are.

   Result is rounded toward the original delta's sign (so
   ×1.05 of +1 → +1, not 0; ×0.90 of +1 → +1; the floor here
   protects the writer-authored minimum effect).
   ═══════════════════════════════════════════════════════ */

import { eq } from "drizzle-orm";

import { characterSheets } from "../../db/schema";
import { getDb } from "../db";

const DEFAULT_CHARISMA = 5;

export async function getPlayerCharisma(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return DEFAULT_CHARISMA;
  try {
    const [sheet] = await db
      .select({ charisma: characterSheets.charisma })
      .from(characterSheets)
      .where(eq(characterSheets.userId, userId))
      .limit(1);
    return sheet?.charisma ?? DEFAULT_CHARISMA;
  } catch {
    return DEFAULT_CHARISMA;
  }
}

export function charismaTrustMultiplier(charisma: number): number {
  return (charisma - DEFAULT_CHARISMA) * 0.05 + 1.0;
}

export async function scaleTrustDeltaByCharisma(
  userId: number,
  delta: number,
): Promise<number> {
  if (delta <= 0) return delta;
  const charisma = await getPlayerCharisma(userId);
  const multiplier = charismaTrustMultiplier(charisma);
  if (multiplier === 1.0) return delta;
  const scaled = Math.round(delta * multiplier);
  // Never zero out a writer-authored positive delta — the floor
  // here preserves narrative intent. An uncharming player still
  // gains *some* trust when the line earns it.
  return scaled <= 0 ? 1 : scaled;
}
