/* ═══════════════════════════════════════════════════════
   APPRENTICE → CREW MEMBER

   When an apprentice graduates the 28-day trial, they
   become a deployable crew member. This module maps the
   client-side `Apprentice` shape to a server-side
   `SerializedCrewMember` with `productionPath: "trained"`,
   archetype preserved, stats translated.

   Used by:
    - apps/server/routers/apprenticeTrial.ts (recordCompletion
      with graduated=true).
    - apps/server/routers/apprentice.ts (manual graduate, if
      surfaced separately).
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype, ApprenticeStats } from "./apprentices";
import type {
  SerializedCrewMember,
  GeneticStat,
} from "./crewPersistence";

/** Default lifespan ceiling for graduated apprentices — matches the
 *  crew_members.maxAge schema default (80 cycles). */
const DEFAULT_MAX_AGE = 80;

/** The minimum data we need from an Apprentice instance to instantiate
 *  a crew member. The trial router accepts these as parameters. */
export interface ApprenticeGraduationInput {
  /** Stable apprentice id (recommend keeping the same id so memorial
   *  surfaces can cross-reference). Optional; defaults to a fresh id. */
  apprenticeId?: string;
  name: string;
  archetype: ApprenticeArchetype;
  gender: "female" | "male" | "non-binary";
  /** Optional stats. If omitted, derived from archetype defaults. */
  stats?: Partial<ApprenticeStats>;
  /** Trial-day survived (used as starting age in cycles). */
  trialDaysSurvived?: number;
  /** Optional bond at graduation — translates to starting loyalty. */
  bondAtGraduation?: number;
  /** ms epoch of graduation (used for birthCycle). Default Date.now(). */
  now?: number;
  /** Player-chosen bloodline, if provided. Apprentices typically
   *  don't have a bloodline; we tag them with the archetype as a soft
   *  bloodline so the family-tree UI is not empty. */
  bloodlineId?: string;
}

/** Map apprentice stat space to crew GeneticStat space. The two
 *  spaces are slightly different — we translate as best we can. */
function translateApprenticeStats(
  archetype: ApprenticeArchetype,
  apprenticeStats?: Partial<ApprenticeStats>,
): Record<GeneticStat, number> {
  // Defaults — middling rolls so a fresh graduate is competent but not OP.
  const base: Record<GeneticStat, number> = {
    resilience: 60,
    intellect: 60,
    reflexes: 60,
    empathy: 60,
    immunity: 60,
    adaptability: 60,
  };
  if (apprenticeStats) {
    if (typeof apprenticeStats.strength === "number") {
      base.resilience = clamp(apprenticeStats.strength);
    }
    if (typeof apprenticeStats.intelligence === "number") {
      base.intellect = clamp(apprenticeStats.intelligence);
    }
    if (typeof apprenticeStats.agility === "number") {
      base.reflexes = clamp(apprenticeStats.agility);
    }
    if (typeof apprenticeStats.charisma === "number") {
      base.empathy = clamp(apprenticeStats.charisma);
    }
  }
  // Archetype primary-stat bonus — graduate is strongest in their lean.
  const PRIMARY_BONUS = 10;
  switch (archetype) {
    case "zealot":
    case "heretic":
    case "jester":
    case "martyr":
      base.empathy = clamp(base.empathy + PRIMARY_BONUS);
      break;
    case "ghost":
    case "wanderer":
    case "prodigal":
      base.reflexes = clamp(base.reflexes + PRIMARY_BONUS);
      break;
    case "scholar":
    case "artisan":
    case "oracle":
      base.intellect = clamp(base.intellect + PRIMARY_BONUS);
      break;
    case "revenant":
    case "sentinel":
      base.resilience = clamp(base.resilience + PRIMARY_BONUS);
      break;
  }
  return base;
}

function clamp(n: number): number {
  return Math.max(1, Math.min(100, Math.round(n)));
}

/** Instantiate a SerializedCrewMember from a graduated apprentice. */
export function instantiateApprenticeAsCrewMember(
  input: ApprenticeGraduationInput,
): SerializedCrewMember {
  const now = input.now ?? Date.now();
  const id =
    input.apprenticeId ??
    `apprentice-grad-${now}-${Math.floor(Math.random() * 100000)}`;
  const stats = translateApprenticeStats(input.archetype, input.stats);
  const loyalty = clamp(input.bondAtGraduation ?? 50);
  const bloodlineId =
    (input.bloodlineId ??
      `apprentice_${input.archetype}`) as SerializedCrewMember["bloodlineId"];
  return {
    id,
    name: input.name,
    nickname: null,
    species: "human",
    gender: input.gender,
    bloodlineId,
    generation: 1,
    parentIds: null,
    children: [],
    geneticTraits: [],
    role: null,
    stats,
    morale: 70,
    health: 100,
    loyalty,
    status: "active",
    age: input.trialDaysSurvived ?? 0,
    maxAge: DEFAULT_MAX_AGE,
    missionHistory: [],
    relationships: {},
    birthCycle: 0,
    isFounder: false,
    productionPath: "trained",
    archetype: input.archetype,
    biography: [
      {
        cycle: 0,
        text: `Graduated the 28-day Celebration Trial. Joined the crew. ${input.name} is no longer an apprentice — they are crew now.`,
        tag: "event",
      },
    ],
    personalQuestStage: 0,
    personalQuestResolution: null,
    cloneDegradation: 0,
    corruption: 0,
  };
}
