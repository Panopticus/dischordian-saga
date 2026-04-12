/* ═══════════════════════════════════════════════════════
   APPRENTICE RIVALRIES + FRIENDSHIPS

   Two apprentices deployed to the same role or visiting each
   other form relationships. Some become friends. Some become
   rivals. Creates emergent micro-drama.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";

export type Bond = "friendship" | "rivalry" | "romance" | "neutral";

/** Archetype-pair compatibility matrix (0-10, 5 = neutral) */
const COMPATIBILITY: Partial<Record<ApprenticeArchetype, Partial<Record<ApprenticeArchetype, { score: number; bond: Bond }>>>> = {
  zealot: {
    zealot: { score: 3, bond: "rivalry" },        // same cause, different priests
    heretic: { score: 0, bond: "rivalry" },       // existential enemies
    scholar: { score: 4, bond: "neutral" },
    martyr: { score: 8, bond: "friendship" },     // both self-sacrificing
    oracle: { score: 7, bond: "friendship" },     // both see meaning
    ghost: { score: 2, bond: "rivalry" },         // zealot hates secrecy
  },
  ghost: {
    ghost: { score: 6, bond: "neutral" },
    jester: { score: 2, bond: "rivalry" },        // noise vs silence
    sentinel: { score: 8, bond: "friendship" },   // both watch
    wanderer: { score: 6, bond: "romance" },      // both invisible together
  },
  scholar: {
    scholar: { score: 9, bond: "friendship" },
    artisan: { score: 7, bond: "friendship" },
    oracle: { score: 6, bond: "neutral" },
    heretic: { score: 4, bond: "neutral" },       // scholar distrusts disruption
    jester: { score: 3, bond: "rivalry" },
  },
  revenant: {
    revenant: { score: 8, bond: "friendship" },   // both dead-ish
    martyr: { score: 6, bond: "romance" },
    oracle: { score: 7, bond: "friendship" },
  },
  artisan: {
    artisan: { score: 7, bond: "friendship" },
    engineer: { score: 8, bond: "friendship" },   // (if we ever add this archetype)
    sentinel: { score: 6, bond: "friendship" },
  } as any,
  oracle: {
    oracle: { score: 4, bond: "rivalry" },        // dueling predictions
    prodigal: { score: 7, bond: "friendship" },
  },
  wanderer: {
    wanderer: { score: 5, bond: "neutral" },
    prodigal: { score: 6, bond: "friendship" },   // both know leaving
  },
  martyr: {
    martyr: { score: 7, bond: "friendship" },
    jester: { score: 6, bond: "romance" },        // comedy/tragedy pair
  },
  heretic: {
    heretic: { score: 5, bond: "rivalry" },
    zealot: { score: 0, bond: "rivalry" },
    prodigal: { score: 7, bond: "friendship" },
  },
  jester: {
    jester: { score: 6, bond: "neutral" },
    sentinel: { score: 4, bond: "neutral" },
  },
  sentinel: {
    sentinel: { score: 7, bond: "friendship" },
    ghost: { score: 8, bond: "friendship" },
  },
  prodigal: {
    prodigal: { score: 4, bond: "rivalry" },      // both left first
    heretic: { score: 7, bond: "friendship" },
  },
};

export interface ApprenticePairing {
  a: string;
  b: string;
  bond: Bond;
  score: number;
  /** Flavor blurb for the pairing */
  flavor: string;
}

const BOND_FLAVOR: Record<Bond, string> = {
  friendship: "They sit together at mess. {a} lends {b} books. {b} holds perimeter when {a} sleeps.",
  rivalry: "{a} and {b} avoid each other. When they can't, one leaves the room. Commanding officers keep them apart.",
  romance: "Something is forming between {a} and {b}. Neither has said it. The crew has noticed.",
  neutral: "{a} and {b} share space without incident. Neither seeks the other out.",
};

export function computePairing(
  aId: string, aArchetype: ApprenticeArchetype, aName: string,
  bId: string, bArchetype: ApprenticeArchetype, bName: string,
): ApprenticePairing {
  const matrix = COMPATIBILITY[aArchetype]?.[bArchetype]
    ?? COMPATIBILITY[bArchetype]?.[aArchetype]
    ?? { score: 5, bond: "neutral" as Bond };
  const flavor = BOND_FLAVOR[matrix.bond]
    .replace(/\{a\}/g, aName)
    .replace(/\{b\}/g, bName);
  return {
    a: aId,
    b: bId,
    bond: matrix.bond,
    score: matrix.score,
    flavor,
  };
}

/** Get all pairings among a roster, deduplicated (A-B only, not B-A). */
export function computeAllPairings(
  roster: Array<{ id: string; name: string; archetype: ApprenticeArchetype }>,
): ApprenticePairing[] {
  const pairings: ApprenticePairing[] = [];
  for (let i = 0; i < roster.length; i++) {
    for (let j = i + 1; j < roster.length; j++) {
      pairings.push(computePairing(
        roster[i].id, roster[i].archetype, roster[i].name,
        roster[j].id, roster[j].archetype, roster[j].name,
      ));
    }
  }
  return pairings;
}
