/* ═══════════════════════════════════════════════════════
   DEAD MAN'S CIRCUIT — FOUR-NAME NAMING PROMPTS (A.9)

   Canonical data shell for the identity chain the player
   authors in DMC per §10.1:

     Student   → named before the first three-race block
     Seeker    → named before the second three-race block
     Detective → named before the third three-race block
     Last      → named before the fourth three-race block

   Each naming is delivered between three-race blocks.
   Nilmorg narrates each as a eulogy for a clone you "used
   to be." The racing gameplay is unchanged; this config
   just describes what the Godot client should prompt the
   player for and which flag it should raise on save.
   ═══════════════════════════════════════════════════════ */

export type DmcIdentityId = "student" | "seeker" | "detective" | "last";

export interface DmcNamingPrompt {
  id: DmcIdentityId;
  /** 1-based order in which this prompt appears. */
  order: number;
  /** How many three-race blocks the player has completed
   *  before this prompt fires. */
  racesCompletedBefore: number;
  /** Heading shown to the player when the prompt opens. */
  heading: string;
  /** Nilmorg's eulogy for the previous clone. */
  nilmorgEulogy: string;
  /** The single question the player answers by typing a name. */
  namingQuestion: string;
  /** Flag raised on save. */
  completedFlag: string;
  /** Archetype descriptor displayed after save. */
  archetypeDescriptor: string;
}

export const DMC_NAMING_PROMPTS: readonly DmcNamingPrompt[] = [
  {
    id: "student",
    order: 1,
    racesCompletedBefore: 3,
    heading: "THE STUDENT",
    nilmorgEulogy:
      "The clone you used to be never learned the track. They died on the first corner of the first race. You are what that clone wanted to be next.",
    namingQuestion:
      "What does a student call themselves when they are learning something they are not supposed to learn?",
    completedFlag: "dmc_student_named",
    archetypeDescriptor: "The Student — the one who notices the rules before the race begins.",
  },
  {
    id: "seeker",
    order: 2,
    racesCompletedBefore: 6,
    heading: "THE SEEKER",
    nilmorgEulogy:
      "The Student is gone. Their clone body wore out. You carried what they learned. Now you are looking for something the Student did not know to look for.",
    namingQuestion:
      "What does a person call themselves when they are searching for a thing they cannot yet describe?",
    completedFlag: "dmc_seeker_named",
    archetypeDescriptor: "The Seeker — the one who races not to win, but to find.",
  },
  {
    id: "detective",
    order: 3,
    racesCompletedBefore: 9,
    heading: "THE DETECTIVE",
    nilmorgEulogy:
      "The Seeker found it. Whatever it was. The clone body that held the Seeker could not hold what the Seeker saw. You inherited the question.",
    namingQuestion:
      "What does a person call themselves when they know the shape of the answer and they are hunting the proof?",
    completedFlag: "dmc_detective_named",
    archetypeDescriptor: "The Detective — the one who has stopped looking and started accusing.",
  },
  {
    id: "last",
    order: 4,
    racesCompletedBefore: 12,
    heading: "THE LAST",
    nilmorgEulogy:
      "There are no more clones after this one. The cloning infrastructure is spent. You inherited the Detective's proof and the Seeker's question and the Student's innocence and you are taking them all into the final race as one person.",
    namingQuestion:
      "What does a person call themselves when they know this is the last body they will ever wear?",
    completedFlag: "dmc_last_named",
    archetypeDescriptor: "The Last — the one who races knowing the chain ends here.",
  },
];

/**
 * Given the number of three-race blocks the player has
 * completed, return the naming prompt that should fire next
 * (or null if none is pending).
 */
export function getNextDmcNamingPrompt(
  racesCompleted: number,
  flags: Record<string, unknown>,
): DmcNamingPrompt | null {
  for (const prompt of DMC_NAMING_PROMPTS) {
    if (flags[prompt.completedFlag]) continue;
    if (racesCompleted >= prompt.racesCompletedBefore) return prompt;
  }
  return null;
}

/**
 * List every prompt in canonical order.
 */
export function listDmcNamingPrompts(): readonly DmcNamingPrompt[] {
  return DMC_NAMING_PROMPTS;
}

/**
 * Returns the player's authored identity chain from flags,
 * sparse: entries the player has not named yet are omitted.
 */
export function getDmcIdentityChain(
  namedNames: Partial<Record<DmcIdentityId, string>>,
): {
  student?: string;
  seeker?: string;
  detective?: string;
  last?: string;
} {
  return {
    student: namedNames.student,
    seeker: namedNames.seeker,
    detective: namedNames.detective,
    last: namedNames.last,
  };
}
