/* ═══════════════════════════════════════════════════════
   CREW BALANCE — Tuneable constants

   Single source of truth for crew-system tuning. Imported
   by both the server tick pipeline and client previews so
   a single edit propagates everywhere. Values here are
   intentional starting points — expect to iterate after
   playtesting a populated Ark.
   ═══════════════════════════════════════════════════════ */

import type { CrewMissionDifficulty } from "./crewPersistence";

export const CREW_BALANCE = {
  /** One crew-year per this many real milliseconds. Default: 4 real hours = 1 crew-year. */
  realMsPerCrewYear: 4 * 60 * 60 * 1000,

  /** Ambient feed batch cadence in real ms. */
  ambientFeedTickMs: 6 * 60 * 60 * 1000,

  /** Per-hour chance of a random danger event firing (checked once per state read). */
  dangerEventHourlyChance: 0.08,

  /** Incubator malfunction base multiplier (applied to (100 - integrity) * 0.002 * elapsed). */
  incubatorMalfunctionMultiplier: 1.0,

  /** Minimum genetic integrity floor after repeated malfunction hits. */
  incubatorIntegrityFloor: 30,

  /** Mission success caps by difficulty — hard upper bounds even for godsquads. */
  missionSuccessCap: {
    routine: 0.98,
    challenging: 0.92,
    dangerous: 0.82,
    suicidal: 0.60,
  } as Record<CrewMissionDifficulty, number>,

  /** Mission base death chance by difficulty. */
  missionDeathChance: {
    routine: 0.015,
    challenging: 0.06,
    dangerous: 0.18,
    suicidal: 0.40,
  } as Record<CrewMissionDifficulty, number>,

  /** Mission base injury chance by difficulty. */
  missionInjuryChance: {
    routine: 0.04,
    challenging: 0.12,
    dangerous: 0.28,
    suicidal: 0.50,
  } as Record<CrewMissionDifficulty, number>,

  /** Max concurrent active crew missions. */
  maxConcurrentMissions: 3,

  /** Relationship delta applied to each pair that survived a shared mission together. */
  relationshipDeltaPerSharedMission: 6,

  /** Relationship delta when a crewmate is lost on a shared mission (affects survivors). */
  relationshipDeltaOnSharedLoss: 4,

  /** Score at which a pair is considered "rivals" — they refuse to serve
   *  on missions together without a morale hit, and surface in the UI as
   *  hostile pairs. */
  rivalryThreshold: -40,

  /** Score at which a pair is considered "close" — they unlock small
   *  cohesion bonuses and get relationship flavor text. */
  closeBondThreshold: 50,

  /** Score at which a close-bond pair can become a formal romance. */
  romanceThreshold: 75,

  /** Stat bonus applied to both members of a romance when active. */
  romanceMoraleBonus: 10,
};
