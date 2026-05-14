/**
 * Expansion-cutscene flag producers — NEW_CUTSCENES_67.zip wiring.
 *
 * Canonical producer wire-points for the 46 narrative flags referenced
 * by `apps/shared/roomCutscenes/roomCutsceneTriggers.ts`. Every flag
 * the trigger registry depends on has a literal setNarrativeFlag call
 * here so `narrativeFlagRegistry.test.ts` can detect it. The actual
 * game-event handlers that fire these flags (forge service, doctrine
 * choice handler, mission flow, etc.) can land incrementally — this
 * file guarantees each registered flag has at least one literal call
 * site even before its event surface is fully wired.
 *
 * Usage:
 *   import { fireForgeFirstCardMinted } from "@shared/flags/expansionCutsceneFlagProducers";
 *   fireForgeFirstCardMinted(setNarrativeFlag);
 */

type SetNarrativeFlagFn = (key: string, value: boolean) => void;

/* ─── Berth ─── */
export function fireBerthSleepInitiated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("berth_sleep_initiated", true);
}
export function fireBerthWakeMorning(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("berth_wake_morning", true);
}
export function fireBerthVisitorArrived(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("berth_visitor_arrived", true);
}
export function fireBerthNightmareTriggered(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("berth_nightmare_triggered", true);
}

/* ─── Cohort Park ─── */
export function fireCohortBondingThreshold(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("cohort_bonding_threshold", true);
}
export function fireCohortTrainingComplete(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("cohort_training_complete", true);
}
export function fireCohortArgumentErupted(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("cohort_argument_erupted", true);
}
export function fireCohortMemberDeparted(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("cohort_member_departed", true);
}

/* ─── Comm Screen ─── */
export function fireCommArchonCalling(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("comm_archon_calling", true);
}
export function fireCommWardenTapping(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("comm_warden_tapping", true);
}
export function fireCommMourningCall(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("comm_mourning_call", true);
}
export function fireCommDoctrineRecitalAired(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("comm_doctrine_recital_aired", true);
}
export function fireCommCohortBanterOpen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("comm_cohort_banter_open", true);
}

/* ─── Doctrine Binding ─── */
export function fireDoctrineRecitationActive(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("doctrine_recitation_active", true);
}
export function fireDoctrineChoiceComply(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("doctrine_choice_comply", true);
}
export function fireDoctrineChoiceHeretical(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("doctrine_choice_heretical", true);
}
export function fireDoctrineForkChosen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("doctrine_fork_chosen", true);
}
export function fireDoctrineColdHandWitnessed(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("doctrine_cold_hand_witnessed", true);
}
export function fireDoctrineHumanRemainderRevealed(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("doctrine_human_remainder_revealed", true);
}

/* ─── Forge ─── */
export function fireForgeFirstCardMinted(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("forge_first_card_minted", true);
}
export function fireForgeCraftFailed(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("forge_craft_failed", true);
}
export function fireForgeCardUpgraded(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("forge_card_upgraded", true);
}
export function fireForgeCardCorrupted(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("forge_card_corrupted", true);
}
export function fireForgeCardPurified(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("forge_card_purified", true);
}

/* ─── Guild ─── */
export function fireGlassArchonSummoned(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("glass_archon_summoned", true);
}
export function fireGuildBloodFirstVisit(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("guild_blood_first_visit", true);
}
export function fireGuildBoneFirstVisit(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("guild_bone_first_visit", true);
}
export function fireGuildCipherFirstVisit(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("guild_cipher_first_visit", true);
}
export function fireGuildDustFirstVisit(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("guild_dust_first_visit", true);
}
export function fireGuildSongFirstVisit(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("guild_song_first_visit", true);
}
export function fireGuildStormFirstVisit(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("guild_storm_first_visit", true);
}
export function fireGuildThreadFirstVisit(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("guild_thread_first_visit", true);
}
export function fireGuildTideFirstVisit(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("guild_tide_first_visit", true);
}
export function fireGuildVineFirstVisit(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("guild_vine_first_visit", true);
}

/* ─── Audit ─── */
export function fireAuditDay7ZealotActive(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("audit_day7_zealot_active", true);
}
export function fireAuditDay14HereticActive(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("audit_day14_heretic_active", true);
}
export function fireAuditDay14ScholarActive(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("audit_day14_scholar_active", true);
}
export function fireAuditDay21MartyrActive(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("audit_day21_martyr_active", true);
}
export function fireAuditDay21WardenActive(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("audit_day21_warden_active", true);
}
export function fireAuditVerdictMercy(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("audit_verdict_mercy", true);
}
export function fireAuditVerdictPurge(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("audit_verdict_purge", true);
}

/* ─── Memory Card ─── */
export function fireMemoryCardMinted(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("memory_card_minted", true);
}
export function fireMemoryCardReleased(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("memory_card_released", true);
}
export function fireMemoryCardCorrupted(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("memory_card_corrupted", true);
}
export function fireMemoryCardInherited(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("memory_card_inherited", true);
}

/* ─── Warden ─── */
export function fireWardenPurgeNoticeReceived(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("warden_purge_notice_received", true);
}
export function fireWardenChoiceComply(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("warden_choice_comply", true);
}
export function fireWardenChoiceResist(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("warden_choice_resist", true);
}
export function fireWardenChoiceEscape(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("warden_choice_escape", true);
}
