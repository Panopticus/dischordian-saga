/* ═══════════════════════════════════════════════════════
   LOREDEX OBITUARY — auto-generated entries for fallen crew

   When an apprentice or named NPC dies, an obituary entry
   is added to the player's personal Loredex section. The
   entry composes:
    - The character's name + archetype.
    - The deathRecord (cycle, cause, last words, epitaph).
    - The mission name + squad members present at death.
    - For named NPCs: a "Resurrection Protocols" pointer.

   The entry is flagged `memorial: true` so the Loredex UI
   can render it under a Memorial section. If the entry's
   subject is later resurrected (Path A) or returned (Path
   B / Hellbox), the entry is marked `closed: true` but
   never deleted — the obituary is part of the player's
   record forever.
   ═══════════════════════════════════════════════════════ */

import type { SerializedCrewMember } from "./crewPersistence";

export interface LoredexObituaryEntry {
  /** Stable id: `obituary.${memberKey}`. */
  id: string;
  /** Subject's display name. */
  subjectName: string;
  /** Subject's archetype (apprentice) or NPC key (named NPC). */
  subjectKey: string;
  /** "apprentice" | "recruited_npc" | "bred_crew". */
  subjectKind: "apprentice" | "recruited_npc" | "bred_crew";
  /** In-game cycle of death. */
  deathCycle: number;
  /** Cause of death. */
  cause: string;
  /** The character's last words (from deathRecord). */
  lastWords: string;
  /** Archetype-flavored epitaph (apprenticePermadeath.generateEpitaph). */
  epitaph: string;
  /** Mission name where death occurred. */
  missionName?: string;
  /** Crew memberKeys present at death (squadList rendered by UI). */
  squadMemberKeys: string[];
  /** True if the deceased was in an active romance. */
  romanced?: boolean;
  /** Personal-quest stage at death (0..3); informs the entry's emotional weight. */
  personalQuestStage?: number;
  /** Resurrection Protocols quest pointer for named NPCs. Empty for apprentices. */
  resurrectionQuestId?: string;
  /** True after Path A / Path B / Hellbox resolves the death. The entry
   *  stays in the obituary section but can render with a "returned" badge. */
  closed?: boolean;
  /** ms epoch the entry was created. */
  createdAt: number;
  /** ms epoch the entry was closed (resurrection happened). */
  closedAt?: number;
  /** Set by the server when the entry's subject is permanently lost
   *  (cycle_complete) — true permadeath, no path to return. */
  cycleComplete?: boolean;
  /** Number of unread loredex entries the deceased was carrying when
   *  they died. Surfaced as memorial-only entries on the Memorial Wall.
   *  Populated by the carry-memorial-sweep drain handler. */
  carriedUnreadCount?: number;
}

/** Compose an obituary entry from a fallen crew member. The deathRecord
 *  must be set; the caller should call this immediately after the death
 *  resolves so the missionName reference is fresh. */
export function composeObituary(args: {
  member: SerializedCrewMember;
  squadMemberKeys: string[];
  missionName?: string;
  resurrectionQuestId?: string;
  now: number;
  /** Real count of loredex entries the member discovered but never
   *  read. Populated by the server from crewLoredexCarryService.
   *  When > 0, the obituary surfaces "took N unread entries with them." */
  carriedUnreadCount?: number;
}): LoredexObituaryEntry {
  const { member, squadMemberKeys, missionName, resurrectionQuestId, now, carriedUnreadCount } =
    args;
  const dr = member.deathRecord;
  if (!dr) {
    throw new Error("composeObituary: member has no deathRecord");
  }
  const subjectKind: LoredexObituaryEntry["subjectKind"] =
    member.productionPath === "trained"
      ? "apprentice"
      : member.productionPath === "recruited"
        ? "recruited_npc"
        : "bred_crew";
  const subjectKey =
    member.productionPath === "recruited"
      ? (member.linkedNpcKey ?? "unknown_npc")
      : (member.archetype ?? "unknown_archetype");
  const epitaph =
    dr.epitaph ?? `They are gone. ${dr.cause} took them. We remember.`;
  return {
    id: `obituary.${member.id}`,
    subjectName: member.name,
    subjectKey,
    subjectKind,
    deathCycle: dr.cycle,
    cause: dr.cause,
    lastWords: dr.lastWords,
    epitaph,
    missionName,
    squadMemberKeys,
    romanced: dr.romanced,
    personalQuestStage: dr.personalQuestStage,
    resurrectionQuestId,
    createdAt: now,
    ...(carriedUnreadCount && carriedUnreadCount > 0
      ? { carriedUnreadCount }
      : {}),
  };
}

/** Mark an obituary entry as closed (subject was resurrected/returned). */
export function closeObituary(
  entry: LoredexObituaryEntry,
  now: number,
): LoredexObituaryEntry {
  return { ...entry, closed: true, closedAt: now };
}

/** Mark an obituary entry as terminal — the cycle is complete, no further
 *  return possible. Set when:
 *   - An apprentice dies a second time (after one Hellbox restoration).
 *   - A recruited NPC dies a second time (after Path A resurrection).
 *   - A bred crew dies (no return path exists for bred crew). */
export function markCycleComplete(
  entry: LoredexObituaryEntry,
  now: number,
): LoredexObituaryEntry {
  return { ...entry, cycleComplete: true, closedAt: now };
}
