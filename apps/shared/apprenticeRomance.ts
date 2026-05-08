/* ═══════════════════════════════════════════════════════
   APPRENTICE ROMANCE — 4-stage arc state machine

   Consumes the existing CrewRomance shape (see
   crewPersistence.ts:243) and APPRENTICE_IDENTITIES romance
   gating. Stages:
     spark        — bond ≥ 30, identity.romance.available
     courtship    — bond ≥ 55, personalQuestStage ≥ 1
     consummation — bond ≥ 75, personalQuestStage ≥ 2
     committed    — bond ≥ 90, personalQuestResolution = "deepened"
                     OR alcove "lock-in" scene played

   The state machine is *pure*. Callers (the Commons scene
   resolver, the gift UI) pass the relevant slice of state in
   and apply the returned diff.

   Romance lock-in fires `loredex_entry_discovered` for the
   archetype-couple entry id (see `coupleLoredexEntryId`) and
   sets the player narrative-flag `romanceWith:<crewMemberId>`.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import type { SerializedCrewMember } from "./crewPersistence";
import { APPRENTICE_IDENTITIES } from "./apprenticeIdentity";

export type RomanceStage = "spark" | "courtship" | "consummation" | "committed";

export interface RomanceArcState {
  /** Current stage (undefined → not yet sparked). */
  stage?: RomanceStage;
  /** Tick of last stage transition (for cooldowns). */
  lastTransitionAt?: number;
  /** Was the lock-in (committed) loredex unlock fired? Idempotency. */
  lockInFired?: boolean;
}

export interface RomanceAdvanceContext {
  /** Crew member of romance interest. */
  member: SerializedCrewMember;
  /** Player→member bond (0..100). */
  bond: number;
  /** Player narrative flags currently set (used for excludeFlags). */
  flags: ReadonlySet<string>;
  /** Is the alcove sub-zone currently open (i.e. player is in The
   *  Commons / alcove)? Lock-in requires alcove. */
  inAlcove?: boolean;
  /** Current romance state (may be partial if just sparked). */
  current?: RomanceArcState;
}

export interface RomanceAdvanceResult {
  /** Next stage if transition fires; null if no transition. */
  nextStage: RomanceStage | null;
  /** Should the loredex couple-entry be unlocked now? */
  fireLoredexUnlock: boolean;
  /** Suggested narrative flag to set on transition (player side). */
  flagToSet?: string;
  /** Reason for the result — useful for UI / logs. */
  reason: string;
}

/** Returns the loredex entry id for an archetype's couple-arc reveal.
 *  These are pre-authored; the loredex registry must contain them. */
export function coupleLoredexEntryId(archetype: ApprenticeArchetype): string {
  return `couple_arc_${archetype}`;
}

/** Pure state-machine step. Inspect bond + identity + member progress
 *  and return the next stage if a transition is justified. */
export function advanceRomance(ctx: RomanceAdvanceContext): RomanceAdvanceResult {
  const archetype = ctx.member.archetype;
  if (!archetype) {
    return { nextStage: null, fireLoredexUnlock: false, reason: "No archetype on member." };
  }
  const ident = APPRENTICE_IDENTITIES[archetype];
  if (!ident.romance.available) {
    return {
      nextStage: null,
      fireLoredexUnlock: false,
      reason: `${archetype} archetype is not romanceable.`,
    };
  }
  if (ctx.member.status === "dead") {
    return { nextStage: null, fireLoredexUnlock: false, reason: "Member is deceased." };
  }
  const stage = ctx.current?.stage;
  const minSpark = ident.romance.minBondToStart;
  const questStage = ctx.member.personalQuestStage ?? 0;

  // spark
  if (!stage && ctx.bond >= minSpark) {
    return {
      nextStage: "spark",
      fireLoredexUnlock: false,
      flagToSet: `romance:spark:${ctx.member.id}`,
      reason: `Bond reached ${ctx.bond} ≥ ${minSpark} — spark.`,
    };
  }
  // courtship
  if (stage === "spark" && ctx.bond >= 55 && questStage >= 1) {
    return {
      nextStage: "courtship",
      fireLoredexUnlock: false,
      flagToSet: `romance:courtship:${ctx.member.id}`,
      reason: `Bond ≥ 55 and personal-quest stage 1 reached.`,
    };
  }
  // consummation
  if (stage === "courtship" && ctx.bond >= 75 && questStage >= 2) {
    return {
      nextStage: "consummation",
      fireLoredexUnlock: false,
      flagToSet: `romance:consummation:${ctx.member.id}`,
      reason: `Bond ≥ 75 and personal-quest stage 2 reached.`,
    };
  }
  // committed (lock-in)
  if (
    stage === "consummation" &&
    ctx.bond >= 90 &&
    ctx.member.personalQuestResolution === "deepened" &&
    ctx.inAlcove === true &&
    !ctx.current?.lockInFired
  ) {
    return {
      nextStage: "committed",
      fireLoredexUnlock: true,
      flagToSet: `romance:committed:${ctx.member.id}`,
      reason: `Lock-in: bond ≥ 90, deepened resolution, alcove present.`,
    };
  }
  return {
    nextStage: null,
    fireLoredexUnlock: false,
    reason: stage
      ? `Holding at ${stage} (bond=${ctx.bond}, questStage=${questStage}).`
      : `Pre-spark (bond=${ctx.bond}, need ${minSpark}).`,
  };
}

/** Apply a result back onto the romance state. Pure; caller persists. */
export function applyRomanceResult(
  current: RomanceArcState | undefined,
  result: RomanceAdvanceResult,
  now: number,
): RomanceArcState {
  if (!result.nextStage) return current ?? {};
  return {
    ...(current ?? {}),
    stage: result.nextStage,
    lastTransitionAt: now,
    lockInFired: result.fireLoredexUnlock || current?.lockInFired,
  };
}

/** Coverage check — every romanceable archetype has a couple-arc id
 *  that downstream loredex authoring must register. */
export function romanceableArchetypes(): ApprenticeArchetype[] {
  return (Object.keys(APPRENTICE_IDENTITIES) as ApprenticeArchetype[]).filter(
    (a) => APPRENTICE_IDENTITIES[a].romance.available,
  );
}

/** When a romanced apprentice dies — surface intensifier hook for the
 *  mission resolver / mourning system. Returns a multiplier the
 *  resolver should apply to mourning effects + the obituary tag. */
export interface RomanceLossEffect {
  mourningMultiplier: number;
  obituaryTag: "romanceLost";
}
export function romanceLossEffect(): RomanceLossEffect {
  return {
    mourningMultiplier: 2,
    obituaryTag: "romanceLost",
  };
}
