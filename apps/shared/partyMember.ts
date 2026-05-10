/* ═══════════════════════════════════════════════════════
   PARTY MEMBER — unified discriminated union for the Berth
   System. Lets every conversation surface (bunkroom door,
   bridge, observation deck, recipe archive, war-room, etc.)
   speak in one shape regardless of which character backs it.

   Three classes today:
     • The active Apprentice (cohort slot)
     • Persistent companions (Elara, the Human)
     • Recruited NPCs (the canonical 5 from
       resurrectionProtocols.ts:RESURRECTABLE_NPC_KEYS)

   The Berth System reads from this single shape; it never
   branches on "is this an apprentice or an NPC" downstream.
   ═══════════════════════════════════════════════════════ */

import type {
  ApprenticeArchetype,
  Gender,
  Rarity as ApprenticeRarity,
} from "./apprentices";
import type {
  ElaraStabilityBand,
  HumanLightBand,
} from "./companion";
import type { ResurrectableNpcKey } from "./resurrectionProtocols";

/* ─── Roster ids ─── */

/** Stable id for any party member. */
export type PartyMemberId =
  | "apprentice_active"
  | "elara"
  | "the_human"
  | ResurrectableNpcKey;

/* ─── Discriminated union ─── */

export type PartyMember =
  | ApprenticePartyMember
  | ElaraPartyMember
  | HumanPartyMember
  | RecruitPartyMember;

export interface ApprenticePartyMember {
  kind: "apprentice";
  id: "apprentice_active";
  /** Underlying apprentice id (e.g. "apprentice-1234-5678"). */
  apprenticeId: string;
  /** Player-chosen name. */
  displayName: string;
  archetype: ApprenticeArchetype;
  gender: Gender;
  rarity: ApprenticeRarity;
  bond: number;
  corruption: number;
  trialDay: number;
  /** Doctrine selected at recruit, if any. */
  doctrineId?: string;
  /** Hidden 0-100 stat, optional (legacy apprentices may not have it). */
  architectInfluence?: number;
  /** Cohort slot. */
  cohortSlot?: "active" | "training_a" | "training_b";
  /** True if the apprentice is in the "graduated" or "companion" stage. */
  graduated?: boolean;
}

export interface ElaraPartyMember {
  kind: "elara";
  id: "elara";
  displayName: "Elara";
  /** -100..100. Drives stability band → expression + screen tint. */
  stability: number;
  stabilityBand: ElaraStabilityBand;
}

export interface HumanPartyMember {
  kind: "human";
  id: "the_human";
  displayName: "The Human";
  /** 0..100 trust; gates reveal stage. */
  trust: number;
  /** -100..100 light band (parallel to stability for Elara). */
  light: number;
  lightBand: HumanLightBand;
  /** Reveal stage 0..4. 0=signal-static, 4=fully revealed. */
  revealStage: 0 | 1 | 2 | 3 | 4;
}

export interface RecruitPartyMember {
  kind: "recruit";
  id: ResurrectableNpcKey;
  displayName: string;
  /** 0..100 trust analogue for recruits; mapped from existing
   *  per-NPC bond stat. */
  bond: number;
  /** Recruited yet? Locked-bunk doors render until true. */
  recruited: boolean;
  /** Optional act-gate flag the door checks before unlocking. */
  recruitGateFlag?: string;
}

/* ─── Helpers ─── */

/**
 * Tier 1 = always-on conversation surfaces (apprentice + Elara + Human).
 * Tier 2 = recruited-only (the 5 canonical recruits).
 *
 * Tier 1 doors live where they live (Elara on the bridge, Human on the
 * observation deck, Apprentice in the bunkroom). Tier 2 doors all live
 * in the bunkroom corridor.
 */
export type PartyMemberTier = 1 | 2;

export function tierOf(member: PartyMember): PartyMemberTier {
  switch (member.kind) {
    case "apprentice":
    case "elara":
    case "human":
      return 1;
    case "recruit":
      return 2;
  }
}

/**
 * Where on the ship does this member's door open onto? Maps to the
 * canonical room ids in companionRoomRegistry.ts.
 */
export function canonicalRoomFor(member: PartyMember):
  | "bridge"
  | "observation-deck"
  | "bunk-room"
  | "recipe-archive"
  | "war-room"
  | "engineering"
  | "armory"
  | "medical-bay" {
  switch (member.kind) {
    case "elara": return "bridge";
    case "human": return "observation-deck";
    case "apprentice": return "bunk-room";
    case "recruit":
      // Hard-mapped to existing canonical assignments where they exist;
      // bunk-room for recruits without a canonical post.
      switch (member.id) {
        case "locke": return "war-room";
        case "vex_solene": return "bunk-room";
        case "wraith_calder": return "bunk-room";
        case "jericho_jones": return "bunk-room";
        case "akai_shi": return "bunk-room";
      }
  }
}

/** Is this member currently visible/visitable for the player? */
export function isVisitable(member: PartyMember): boolean {
  if (member.kind === "recruit") return member.recruited;
  if (member.kind === "human") return member.revealStage >= 1; // pre-reveal: door is dark
  return true;
}

/**
 * Display priority for the bunkroom door grid. Lower = earlier.
 * Apprentice always first; recruits sorted by canonical id order.
 */
export function bunkroomDisplayOrder(member: PartyMember): number {
  if (member.kind === "apprentice") return 0;
  if (member.kind === "recruit") {
    const idx = ["vex_solene", "wraith_calder", "locke", "jericho_jones", "akai_shi"]
      .indexOf(member.id);
    return idx >= 0 ? 1 + idx : 99;
  }
  return 99; // tier-1 non-apprentice members aren't in the bunkroom
}

/** Convenience: is the member persistent (always available, modulo
 *  reveal/lock state)? Used by the comm screen to know whose corner
 *  is always pinned. */
export function isPersistent(member: PartyMember): boolean {
  return member.kind === "elara" || member.kind === "human";
}
