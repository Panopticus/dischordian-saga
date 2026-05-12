/**
 * Room-cutscene trigger registry — pairs every expansion cutscene
 * (declared in `cinematicsManifest.EXPANSION_CUTSCENES`) with the
 * runtime event that fires it.
 *
 * Three trigger kinds:
 *
 *   - `room_first_enter` — fires once, the first time the player
 *     enters the room with the given zipDir (matches the producer-
 *     art zipDir, e.g. `house_of_iron`, `the_forge`, `wardens_dock`)
 *   - `flag_set` — fires once when the narrative flag transitions
 *     to `true`. The flag id is the authoritative trigger; consumer
 *     should track a `<cutscene_id>_played` companion flag to
 *     enforce one-shot.
 *   - `mission_phase` — fires when a mission enters the given phase.
 *     Consumer is responsible for de-duping per-mission.
 *
 * The dispatcher (see {@link pickActiveRoomCutscene}) walks this list
 * in declaration order and returns the first match; the room renderer
 * (ArkExplorerPage cutscene overlay) consumes its result on every
 * room-enter / flag-change.
 *
 * Coverage gate: every entry in `EXPANSION_CUTSCENES` must appear
 * at least once as a `cutsceneId` here. Enforced by
 * `apps/shared/_completeness/checks/expansionCutsceneCoverage.ts`.
 */

import {
  EXPANSION_CUTSCENES,
  type ExpansionCutsceneDef,
} from "../expansionArt/cinematicsManifest";

export type CutsceneTriggerKind =
  | "room_first_enter"
  | "flag_set"
  | "mission_phase";

export interface RoomCutsceneTrigger {
  /** Matches a row in EXPANSION_CUTSCENES. */
  readonly cutsceneId: string;
  readonly kind: CutsceneTriggerKind;
  /** For `room_first_enter` — the producer-art zipDir (canonical
   *  CDN folder, same one used by `roomArtManifest`). */
  readonly zipDir?: string;
  /** For `flag_set` — narrative flag id from
   *  `apps/shared/flags/narrativeFlagRegistry.ts`. */
  readonly flagId?: string;
  /** For `mission_phase` — phase identifier. */
  readonly missionPhase?: string;
  /** When true, plays at most once (consumer should track a
   *  `<cutsceneId>_played` companion flag). All currently-declared
   *  expansion triggers are one-shot. */
  readonly oneShot: boolean;
}

/**
 * Authored triggers for every cutscene in NEW_CUTSCENES_67.zip.
 *
 * Order matters for the dispatcher: when multiple triggers are active
 * simultaneously for a single room-enter event, the first match wins.
 * Triggers are grouped by category for readability.
 */
export const ROOM_CUTSCENE_TRIGGERS: readonly RoomCutsceneTrigger[] = [
  /* ── berth (4) — apprentice-berth narrative beats ── */
  {
    cutsceneId: "cs_berth_sleep",
    kind: "flag_set",
    flagId: "berth_sleep_initiated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_berth_wake",
    kind: "flag_set",
    flagId: "berth_wake_morning",
    oneShot: true,
  },
  {
    cutsceneId: "cs_berth_visitor",
    kind: "flag_set",
    flagId: "berth_visitor_arrived",
    oneShot: true,
  },
  {
    cutsceneId: "cs_berth_nightmare",
    kind: "flag_set",
    flagId: "berth_nightmare_triggered",
    oneShot: true,
  },

  /* ── cohort_park (4) — cohort-lifecycle beats ── */
  {
    cutsceneId: "cs_cohort_bonding",
    kind: "flag_set",
    flagId: "cohort_bonding_threshold",
    oneShot: true,
  },
  {
    cutsceneId: "cs_cohort_training",
    kind: "flag_set",
    flagId: "cohort_training_complete",
    oneShot: true,
  },
  {
    cutsceneId: "cs_cohort_argument",
    kind: "flag_set",
    flagId: "cohort_argument_erupted",
    oneShot: true,
  },
  {
    cutsceneId: "cs_cohort_farewell",
    kind: "flag_set",
    flagId: "cohort_member_departed",
    oneShot: true,
  },

  /* ── comm_screen (5) — incoming-call narrative beats ── */
  {
    cutsceneId: "cs_comm_archon_call",
    kind: "flag_set",
    flagId: "comm_archon_calling",
    oneShot: true,
  },
  {
    cutsceneId: "cs_comm_warden_tap",
    kind: "flag_set",
    flagId: "comm_warden_tapping",
    oneShot: true,
  },
  {
    cutsceneId: "cs_comm_mourning_call",
    kind: "flag_set",
    flagId: "comm_mourning_call",
    oneShot: true,
  },
  {
    cutsceneId: "cs_comm_doctrine_recitation",
    kind: "flag_set",
    flagId: "comm_doctrine_recital_aired",
    oneShot: true,
  },
  {
    cutsceneId: "cs_comm_cohort_banter",
    kind: "flag_set",
    flagId: "comm_cohort_banter_open",
    oneShot: true,
  },

  /* ── doctrine_binding (7) — doctrine_binding_chamber beats ── */
  {
    cutsceneId: "cs_doctrine_first_arrival",
    kind: "room_first_enter",
    zipDir: "doctrine_binding_chamber",
    oneShot: true,
  },
  {
    cutsceneId: "cs_doctrine_recitation_ceremony",
    kind: "flag_set",
    flagId: "doctrine_recitation_active",
    oneShot: true,
  },
  {
    cutsceneId: "cs_doctrine_compliant_mouth",
    kind: "flag_set",
    flagId: "doctrine_choice_comply",
    oneShot: true,
  },
  {
    cutsceneId: "cs_doctrine_heretical_quiet",
    kind: "flag_set",
    flagId: "doctrine_choice_heretical",
    oneShot: true,
  },
  {
    cutsceneId: "cs_doctrine_forked_path",
    kind: "flag_set",
    flagId: "doctrine_fork_chosen",
    oneShot: true,
  },
  {
    cutsceneId: "cs_doctrine_cold_hand",
    kind: "flag_set",
    flagId: "doctrine_cold_hand_witnessed",
    oneShot: true,
  },
  {
    cutsceneId: "cs_doctrine_human_remainder",
    kind: "flag_set",
    flagId: "doctrine_human_remainder_revealed",
    oneShot: true,
  },

  /* ── forge (5) — the_forge beats ── */
  {
    cutsceneId: "cs_forge_first_creation",
    kind: "flag_set",
    flagId: "forge_first_card_minted",
    oneShot: true,
  },
  {
    cutsceneId: "cs_forge_failure",
    kind: "flag_set",
    flagId: "forge_craft_failed",
    oneShot: true,
  },
  {
    cutsceneId: "cs_forge_upgrade",
    kind: "flag_set",
    flagId: "forge_card_upgraded",
    oneShot: true,
  },
  {
    cutsceneId: "cs_forge_corrupted",
    kind: "flag_set",
    flagId: "forge_card_corrupted",
    oneShot: true,
  },
  {
    cutsceneId: "cs_forge_purified",
    kind: "flag_set",
    flagId: "forge_card_purified",
    oneShot: true,
  },

  /* ── guild_room (21) — guild-common-room first-arrival beats +
       one glass-archon-dialogue branch. zipDirs map to the 12
       canonical houses; the remaining 9 archetypes (bone/blood/
       cipher/dust/song/storm/thread/tide/vine) reuse the generic
       guild_common_room or per-archetype variants once those zipDirs
       are produced. For now they fire on the generic zipDir as a
       flag-driven beat. ── */
  {
    cutsceneId: "cs_guild_anvil_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_anvil",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_chapel_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_chapel",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_circuit_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_circuit",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_garden_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_garden",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_glass_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_glass",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_glass_archon_dialogue",
    kind: "flag_set",
    flagId: "glass_archon_summoned",
    oneShot: true,
  },
  // cs_guild_iron_first_arrival — producer shipped only the poster
  // (cs_guild_iron_first_arrival_start.png); no mp4 yet. When the
  // animation ships, re-add a room_first_enter trigger on
  // zipDir = "house_of_iron".
  {
    cutsceneId: "cs_guild_ledger_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_ledger",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_mirror_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_mirror",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_remnant_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_remnant",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_smoke_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_smoke",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_thurible_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_thurible",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_tower_first_arrival",
    kind: "room_first_enter",
    zipDir: "house_of_tower",
    oneShot: true,
  },
  // Lore-archetype guilds without a canonical zipDir yet — fire on
  // flag set in the generic guild_common_room until per-archetype
  // zipDirs ship (tracked in _PRODUCTION_FINAL.md PART VI).
  {
    cutsceneId: "cs_guild_blood_first_arrival",
    kind: "flag_set",
    flagId: "guild_blood_first_visit",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_bone_first_arrival",
    kind: "flag_set",
    flagId: "guild_bone_first_visit",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_cipher_first_arrival",
    kind: "flag_set",
    flagId: "guild_cipher_first_visit",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_dust_first_arrival",
    kind: "flag_set",
    flagId: "guild_dust_first_visit",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_song_first_arrival",
    kind: "flag_set",
    flagId: "guild_song_first_visit",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_storm_first_arrival",
    kind: "flag_set",
    flagId: "guild_storm_first_visit",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_thread_first_arrival",
    kind: "flag_set",
    flagId: "guild_thread_first_visit",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_tide_first_arrival",
    kind: "flag_set",
    flagId: "guild_tide_first_visit",
    oneShot: true,
  },
  {
    cutsceneId: "cs_guild_vine_first_arrival",
    kind: "flag_set",
    flagId: "guild_vine_first_visit",
    oneShot: true,
  },

  /* ── mechronis_audit (6) — Hellbox-4 audit storyline by day ── */
  {
    cutsceneId: "cs_audit_day7_zealot",
    kind: "flag_set",
    flagId: "audit_day7_zealot_active",
    oneShot: true,
  },
  {
    cutsceneId: "cs_audit_day14_heretic",
    kind: "flag_set",
    flagId: "audit_day14_heretic_active",
    oneShot: true,
  },
  {
    cutsceneId: "cs_audit_day14_scholar",
    kind: "flag_set",
    flagId: "audit_day14_scholar_active",
    oneShot: true,
  },
  {
    cutsceneId: "cs_audit_day21_martyr",
    kind: "flag_set",
    flagId: "audit_day21_martyr_active",
    oneShot: true,
  },
  {
    cutsceneId: "cs_audit_day28_verdict_mercy",
    kind: "flag_set",
    flagId: "audit_verdict_mercy",
    oneShot: true,
  },
  {
    cutsceneId: "cs_audit_day28_verdict_purge",
    kind: "flag_set",
    flagId: "audit_verdict_purge",
    oneShot: true,
  },

  /* ── memory_card (4) — memory_card_library beats ── */
  {
    cutsceneId: "cs_memory_card_mint",
    kind: "flag_set",
    flagId: "memory_card_minted",
    oneShot: true,
  },
  {
    cutsceneId: "cs_memory_card_release",
    kind: "flag_set",
    flagId: "memory_card_released",
    oneShot: true,
  },
  {
    cutsceneId: "cs_memory_card_corrupt",
    kind: "flag_set",
    flagId: "memory_card_corrupted",
    oneShot: true,
  },
  {
    cutsceneId: "cs_memory_card_inherit",
    kind: "flag_set",
    flagId: "memory_card_inherited",
    oneShot: true,
  },

  /* ── mission (7) — mission-flow phases ── */
  {
    cutsceneId: "cs_mission_briefing",
    kind: "mission_phase",
    missionPhase: "briefing",
    oneShot: true,
  },
  {
    cutsceneId: "cs_mission_tier2_briefing",
    kind: "mission_phase",
    missionPhase: "briefing_tier2",
    oneShot: true,
  },
  {
    cutsceneId: "cs_mission_tier3_briefing",
    kind: "mission_phase",
    missionPhase: "briefing_tier3",
    oneShot: true,
  },
  {
    cutsceneId: "cs_mission_deploy",
    kind: "mission_phase",
    missionPhase: "deploy",
    oneShot: true,
  },
  {
    cutsceneId: "cs_mission_discovery",
    kind: "mission_phase",
    missionPhase: "discovery",
    oneShot: true,
  },
  {
    cutsceneId: "cs_mission_ambush",
    kind: "mission_phase",
    missionPhase: "ambush",
    oneShot: true,
  },
  {
    cutsceneId: "cs_mission_return_failure",
    kind: "mission_phase",
    missionPhase: "return_failure",
    oneShot: true,
  },

  /* ── wardens_dock (4) — destination warden-dock branch beats ── */
  {
    cutsceneId: "cs_warden_purge_notice",
    kind: "flag_set",
    flagId: "warden_purge_notice_received",
    oneShot: true,
  },
  {
    cutsceneId: "cs_warden_comply",
    kind: "flag_set",
    flagId: "warden_choice_comply",
    oneShot: true,
  },
  {
    cutsceneId: "cs_warden_resist",
    kind: "flag_set",
    flagId: "warden_choice_resist",
    oneShot: true,
  },
  {
    cutsceneId: "cs_warden_escape",
    kind: "flag_set",
    flagId: "warden_choice_escape",
    oneShot: true,
  },

  /* ── chess_tutorial (9) — Celebration Game Master teaching-gate intros.
       Each fires once when the player enters the matching gate. ── */
  {
    cutsceneId: "cs_chess_tut_g1_intro",
    kind: "flag_set",
    flagId: "chess_tutorial_g1_started",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_tut_g2_intro",
    kind: "flag_set",
    flagId: "chess_tutorial_g2_started",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_tut_g3_intro",
    kind: "flag_set",
    flagId: "chess_tutorial_g3_started",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_tut_g4_intro",
    kind: "flag_set",
    flagId: "chess_tutorial_g4_started",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_tut_g4_5_intro",
    kind: "flag_set",
    flagId: "chess_tutorial_g4_5_started",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_tut_g5_intro",
    kind: "flag_set",
    flagId: "chess_tutorial_g5_started",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_tut_g5_5_intro",
    kind: "flag_set",
    flagId: "chess_tutorial_g5_5_started",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_tut_g6_intro",
    kind: "flag_set",
    flagId: "chess_tutorial_g6_started",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_tut_g7_intro",
    kind: "flag_set",
    flagId: "chess_tutorial_g7_started",
    oneShot: true,
  },

  /* ── chess_ladder (12) — first-seated-against-opponent beats.
       Each fires the first time the player sits down at the board
       across from this opponent in the story-mode ladder. ── */
  {
    cutsceneId: "cs_chess_ladder_the_human_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_the_human_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_the_collector_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_the_collector_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_iron_lion_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_iron_lion_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_the_enigma_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_the_enigma_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_the_warlord_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_the_warlord_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_the_oracle_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_the_oracle_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_the_necromancer_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_the_necromancer_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_the_programmer_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_the_programmer_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_agent_zero_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_agent_zero_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_the_source_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_the_source_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_game_master_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_game_master_first_seated",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_ladder_the_architect_first_seated",
    kind: "flag_set",
    flagId: "chess_ladder_the_architect_first_seated",
    oneShot: true,
  },

  /* ── chess_climb (4) — corrupted-GM Climb-tier wager beats. ── */
  {
    cutsceneId: "cs_chess_climb_tier_0_exhibition",
    kind: "flag_set",
    flagId: "chess_climb_tier_0_entered",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_climb_tier_1_wagered",
    kind: "flag_set",
    flagId: "chess_climb_tier_1_entered",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_climb_tier_2_hierarchy_table",
    kind: "flag_set",
    flagId: "chess_climb_tier_2_entered",
    oneShot: true,
  },
  {
    cutsceneId: "cs_chess_climb_tier_3_labyrinth_wager",
    kind: "flag_set",
    flagId: "chess_climb_tier_3_entered",
    oneShot: true,
  },
];

/** O(1) lookup by cutsceneId. Multi-valued because in principle a
 *  single cutscene could have multiple triggers; the seed registry
 *  authors one trigger per cutscene. */
export const TRIGGERS_BY_CUTSCENE: ReadonlyMap<string, readonly RoomCutsceneTrigger[]> =
  (() => {
    const m = new Map<string, RoomCutsceneTrigger[]>();
    for (const t of ROOM_CUTSCENE_TRIGGERS) {
      const arr = m.get(t.cutsceneId);
      if (arr) arr.push(t);
      else m.set(t.cutsceneId, [t]);
    }
    return m;
  })();

/** Total trigger count — must equal EXPANSION_CUTSCENES length for
 *  full coverage (asserted by completeness check). */
export const ROOM_CUTSCENE_TRIGGER_TOTAL = ROOM_CUTSCENE_TRIGGERS.length;

/* ─── Dispatch helpers ─── */

export interface CutsceneDispatchSlice {
  /** Narrative flag map. */
  readonly narrativeFlags: Readonly<Record<string, boolean | undefined>>;
  /** Set of zipDirs the player has entered already (for room_first_enter). */
  readonly visitedRoomZipDirs: ReadonlySet<string>;
  /** Currently-active mission phase, if any. */
  readonly missionPhase?: string;
}

/**
 * Pick the cutscene that should play *right now* — given the current
 * narrative flag snapshot + visited-rooms set + current room zipDir.
 *
 * Semantics:
 *   - room_first_enter triggers fire when the player enters a room
 *     whose zipDir is NOT in `visitedRoomZipDirs` (consumer adds it
 *     after dispatch).
 *   - flag_set triggers fire when their flagId is true AND the
 *     companion `<cutsceneId>_played` flag is NOT already true.
 *   - mission_phase triggers fire when game.missionPhase matches.
 *
 * Returns the first matching trigger; consumer dispatches the
 * corresponding ExpansionCutsceneDef and writes the `_played`
 * companion flag.
 */
export function pickActiveRoomCutscene(
  game: CutsceneDispatchSlice,
  currentRoomZipDir: string,
): RoomCutsceneTrigger | undefined {
  for (const t of ROOM_CUTSCENE_TRIGGERS) {
    const playedFlag = `${t.cutsceneId}_played`;
    if (t.oneShot && game.narrativeFlags[playedFlag] === true) continue;
    switch (t.kind) {
      case "room_first_enter": {
        if (
          t.zipDir === currentRoomZipDir &&
          !game.visitedRoomZipDirs.has(currentRoomZipDir)
        ) {
          return t;
        }
        break;
      }
      case "flag_set": {
        if (t.flagId && game.narrativeFlags[t.flagId] === true) return t;
        break;
      }
      case "mission_phase": {
        if (t.missionPhase && game.missionPhase === t.missionPhase) return t;
        break;
      }
    }
  }
  return undefined;
}

/** Asserts every expansion cutscene has at least one trigger. Used
 *  by the completeness gate; throws if any cutscene is unwired. */
export function assertEveryCutsceneHasTrigger(
  cutscenes: readonly ExpansionCutsceneDef[],
): readonly string[] {
  const missing: string[] = [];
  for (const c of cutscenes) {
    if (!TRIGGERS_BY_CUTSCENE.has(c.id)) missing.push(c.id);
  }
  return missing;
}

/** Eager validation at module load — fails fast if a producer drop
 *  adds an mp4 without a matching trigger entry. */
const _missing = assertEveryCutsceneHasTrigger(EXPANSION_CUTSCENES);
if (_missing.length > 0) {
  // Intentionally a soft warning at module-load — the parity gate
  // (apps/shared/_completeness/checks/expansionCutsceneCoverage.ts)
  // is the enforcing surface.
  // eslint-disable-next-line no-console
  console.warn(
    `[roomCutsceneTriggers] ${_missing.length} cutscenes lack a runtime trigger: ` +
      _missing.join(", "),
  );
}
