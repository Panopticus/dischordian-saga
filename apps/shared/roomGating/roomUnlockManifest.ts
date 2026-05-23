/**
 * Room unlock requirements manifest — Phase H.I.
 *
 * Data-side declarations of unlock requirements for the 117 deferred
 * spaces (12 Hellboxes + 7 vehicles + 60 destinations + 38
 * apprentice/pedagogy/berth/guild/Game-Master spaces) per
 * `_PRODUCTION_FINAL.md`.
 *
 * Extends the conceptual unlockRequirement enum from
 * `apps/client/src/contexts/GameContext.tsx` `RoomDef.unlockRequirement`
 * with new types that the existing `canAccessRoom()` switch can
 * adopt in a follow-up PR. Manifest is data-only so it's consumable
 * from server-side, parity gates, and tests without React imports.
 *
 * The 49 Ark rooms keep their existing unlockRequirement declarations
 * in GameContext.tsx; this manifest only covers the 117 new spaces.
 */

/**
 * Extended unlock-requirement union (superset of the existing
 * GameContext.UnlockRequirement).
 *
 * Existing types (retained verbatim):
 *   start                  — initial room
 *   narrative_event        — flag-driven (`{ type, value: flagId }`)
 *   room_visited           — chained on prior room visit
 *   specific_item          — requires item in inventory
 *   chain_complete         — class / alignment / species chain
 *   items_collected        — N items in inventory
 *
 * NEW types (introduced in H.I):
 *   blood_weave_alignment  — `apps/shared/bloodWeave.ts` alignment ≥ threshold
 *   hellbox_unlocked       — Hellbox transit reachable (per Hellbox-N open flag)
 *   apprentice_in_cohort   — at least one apprentice with given archetype
 *                            slotted in the cohort
 *   act_progress           — player's act-progress ≥ given act number
 *   loredex_threshold      — loredex entries unlocked ≥ given threshold
 */
export type RoomUnlockRequirement =
  | { type: "start" }
  | { type: "narrative_event"; value: string }
  | { type: "room_visited"; value: string }
  | { type: "specific_item"; value: string }
  | { type: "chain_complete"; value: string }
  | { type: "items_collected"; value: number }
  | { type: "blood_weave_alignment"; threshold: number }
  | { type: "hellbox_unlocked"; hellbox: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 }
  | { type: "apprentice_in_cohort"; archetype: string }
  | { type: "act_progress"; act: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 }
  | { type: "loredex_threshold"; threshold: number };

/** One unlock-manifest entry: canonical space_id + its gate. */
export interface RoomUnlockEntry {
  /** Canonical space_id per `_PRODUCTION_FINAL.md` (e.g. "hb.celebration_school"). */
  readonly canonicalSpaceId: string;
  /** Human-readable name for editor / debug overlay. */
  readonly name: string;
  /** Unlock gate. */
  readonly unlock: RoomUnlockRequirement;
  /** Optional human note. */
  readonly notes?: string;
}

/**
 * Manifest of 117 deferred-space unlock requirements.
 *
 * Hellboxes 1–12 each gate on the player having opened that Hellbox
 * (the `cs_hellbox_N_open` cutscene fired). Vehicles gate on faction
 * + act-progress (CADES APC at act 4 + CADES branch, etc.).
 * Destinations gate per their respective progression hooks.
 * Apprentice spaces gate on cohort presence + archetype.
 */
export const ROOM_UNLOCK_MANIFEST: readonly RoomUnlockEntry[] = [
  // ─── 12 Hellboxes (hellbox_unlocked gate) ──────────────────
  { canonicalSpaceId: "hb.celebration_school",   name: "Celebration School (HB1)",     unlock: { type: "hellbox_unlocked", hellbox: 1 } },
  { canonicalSpaceId: "hb.castle_of_death",      name: "Castle of Death (HB2)",        unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "hb.quiz_show_palimpsest", name: "Quiz Show Palimpsest (HB3)",   unlock: { type: "hellbox_unlocked", hellbox: 3 } },
  { canonicalSpaceId: "hb.mechronis_academy",    name: "Mechronis Academy (HB4)",      unlock: { type: "hellbox_unlocked", hellbox: 4 } },
  { canonicalSpaceId: "hb.universal_selector",   name: "Universal Selector (HB5)",     unlock: { type: "hellbox_unlocked", hellbox: 5 } },
  { canonicalSpaceId: "hb.dead_mans_circuit",    name: "Dead Man's Circuit (HB6)",     unlock: { type: "hellbox_unlocked", hellbox: 6 } },
  { canonicalSpaceId: "hb.degenerates_casino",   name: "Degenerate's Casino (HB7)",    unlock: { type: "hellbox_unlocked", hellbox: 7 } },
  { canonicalSpaceId: "hb.editors_workshop",     name: "Editor's Workshop (HB8)",      unlock: { type: "hellbox_unlocked", hellbox: 8 } },
  { canonicalSpaceId: "hb.eternal_match",        name: "The Eternal Match (HB9)",      unlock: { type: "hellbox_unlocked", hellbox: 9 } },
  { canonicalSpaceId: "hb.collected_souls",      name: "Hall of Collected Souls (HB10)", unlock: { type: "hellbox_unlocked", hellbox: 10 } },
  { canonicalSpaceId: "hb.the_hive",             name: "The Hive (HB11)",              unlock: { type: "hellbox_unlocked", hellbox: 11 } },
  { canonicalSpaceId: "hb.dischordian_arena",    name: "Dischordian Arena (HB12)",     unlock: { type: "hellbox_unlocked", hellbox: 12 } },

  // ─── 7 vehicles (act_progress + chain gates) ───────────────
  { canonicalSpaceId: "veh.cades_apc",         name: "CADES APC",                unlock: { type: "act_progress", act: 4 } },
  { canonicalSpaceId: "veh.captains_shuttle",  name: "Captain's Shuttle",        unlock: { type: "specific_item", value: "captains-key" } },
  { canonicalSpaceId: "veh.cargo_vessel",      name: "Trade Hub Cargo Vessel",   unlock: { type: "narrative_event", value: "trade_route_unlocked" } },
  { canonicalSpaceId: "veh.combat_dropship",   name: "Combat Dropship",          unlock: { type: "act_progress", act: 5 } },
  { canonicalSpaceId: "veh.pet_transport",     name: "Pet Transport Vessel",     unlock: { type: "room_visited", value: "ark.pet_garden" } },
  { canonicalSpaceId: "veh.eidolon_vessel",    name: "Eidolon Vessel",           unlock: { type: "narrative_event", value: "eidolon_bond_complete" } },
  { canonicalSpaceId: "veh.memorial_hearse",   name: "Memorial Hearse",          unlock: { type: "room_visited", value: "ark.memorial_corridor" } },

  // ─── 38 apprentice / pedagogy / berth / guild / Game-Master spaces ──
  { canonicalSpaceId: "ark.apprentice_hall",                    name: "The Apprentice Hall",                    unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "ark.trial_hall",                         name: "The Trial Hall",                         unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "ark.recruit_vestibule",                  name: "The Recruit Vestibule",                  unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "ark.apprentice_cellblock",               name: "The Apprentice Cellblock",               unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "ark.hellbox_clone_bench",                name: "Hellbox Clone Bench",                    unlock: { type: "apprentice_in_cohort", archetype: "any" } },
  { canonicalSpaceId: "ark.mourning_wall",                      name: "Mourning Wall",                          unlock: { type: "narrative_event", value: "apprentice_permadeath_any" } },
  { canonicalSpaceId: "ark.essence_harvest_sanctum",            name: "Essence Harvest Sanctum",                unlock: { type: "narrative_event", value: "essence_harvest_first" } },
  { canonicalSpaceId: "ark.blood_weave_atrium",                 name: "Blood Weave Atrium",                     unlock: { type: "blood_weave_alignment", threshold: 1 } },
  { canonicalSpaceId: "ark.personal_quest_ledger",              name: "Personal Quest Ledger Room",             unlock: { type: "apprentice_in_cohort", archetype: "any" } },
  { canonicalSpaceId: "ark.doctrine_binding_chamber",           name: "Doctrine Binding Chamber",               unlock: { type: "narrative_event", value: "doctrine_binding_unlocked" } },
  { canonicalSpaceId: "ark.audit_chamber",                      name: "Audit Chamber (Day-7/14/21)",            unlock: { type: "narrative_event", value: "audit_day_7_pending" } },
  { canonicalSpaceId: "ark.the_forge",                          name: "The Forge",                              unlock: { type: "narrative_event", value: "signature_card_forge_pending" } },
  { canonicalSpaceId: "ark.memory_card_library",                name: "Memory Card Library",                    unlock: { type: "narrative_event", value: "memory_card_minted_any" } },
  { canonicalSpaceId: "dest.celebration_school.training_barracks", name: "Celebration Park Training Barracks", unlock: { type: "hellbox_unlocked", hellbox: 1 } },
  { canonicalSpaceId: "dest.celebration_school.triangle_alcove",   name: "Triangle Event Alcove",              unlock: { type: "narrative_event", value: "triangle_event_pending" } },
  { canonicalSpaceId: "dest.warden_dock",                       name: "Warden's Dock",                          unlock: { type: "narrative_event", value: "heretical_quiet_doctrine_bound" } },
  { canonicalSpaceId: "dest.hall_of_disappearances",            name: "The Hall of Disappearances",             unlock: { type: "narrative_event", value: "mystery_episode_complete:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e4" }, notes: "DLC: wolf.anara_hunt. Opens once the Crucible-inheritance episode (E4) is resolved; holds the snow-globe-release lever for E5." },
  { canonicalSpaceId: "ark.mission_briefing_war_room",          name: "Mission Briefing War Room",              unlock: { type: "narrative_event", value: "apprentice_trial_graduated_any" } },
  { canonicalSpaceId: "ark.post_mission_return_hub",            name: "Post-Mission Return Hub",                unlock: { type: "narrative_event", value: "mission_deployed_any" } },
  // 12 apprentice berths
  { canonicalSpaceId: "ark.apprentice_berth.zealot",     name: "Zealot's Berth",     unlock: { type: "apprentice_in_cohort", archetype: "zealot" } },
  { canonicalSpaceId: "ark.apprentice_berth.ghost",      name: "Ghost's Berth",      unlock: { type: "apprentice_in_cohort", archetype: "ghost" } },
  { canonicalSpaceId: "ark.apprentice_berth.scholar",    name: "Scholar's Berth",    unlock: { type: "apprentice_in_cohort", archetype: "scholar" } },
  { canonicalSpaceId: "ark.apprentice_berth.revenant",   name: "Revenant's Berth",   unlock: { type: "apprentice_in_cohort", archetype: "revenant" } },
  { canonicalSpaceId: "ark.apprentice_berth.artisan",    name: "Artisan's Berth",    unlock: { type: "apprentice_in_cohort", archetype: "artisan" } },
  { canonicalSpaceId: "ark.apprentice_berth.oracle",     name: "Oracle's Berth",     unlock: { type: "apprentice_in_cohort", archetype: "oracle" } },
  { canonicalSpaceId: "ark.apprentice_berth.wanderer",   name: "Wanderer's Berth",   unlock: { type: "apprentice_in_cohort", archetype: "wanderer" } },
  { canonicalSpaceId: "ark.apprentice_berth.martyr",     name: "Martyr's Berth",     unlock: { type: "apprentice_in_cohort", archetype: "martyr" } },
  { canonicalSpaceId: "ark.apprentice_berth.heretic",    name: "Heretic's Berth",    unlock: { type: "apprentice_in_cohort", archetype: "heretic" } },
  { canonicalSpaceId: "ark.apprentice_berth.jester",     name: "Jester's Berth",     unlock: { type: "apprentice_in_cohort", archetype: "jester" } },
  { canonicalSpaceId: "ark.apprentice_berth.sentinel",   name: "Sentinel's Berth",   unlock: { type: "apprentice_in_cohort", archetype: "sentinel" } },
  { canonicalSpaceId: "ark.apprentice_berth.prodigal",   name: "Prodigal's Berth",   unlock: { type: "apprentice_in_cohort", archetype: "prodigal" } },
  // 5 recruit berths
  { canonicalSpaceId: "ark.recruit_berth.vex_solene",    name: "Vex Solène's Berth",    unlock: { type: "narrative_event", value: "recruit_vex_recruited" } },
  { canonicalSpaceId: "ark.recruit_berth.wraith_calder", name: "Wraith Calder's Berth", unlock: { type: "narrative_event", value: "recruit_wraith_recruited" } },
  { canonicalSpaceId: "ark.recruit_berth.locke",         name: "Locke's Berth",          unlock: { type: "narrative_event", value: "recruit_locke_recruited" } },
  { canonicalSpaceId: "ark.recruit_berth.jericho_jones", name: "Jericho Jones's Berth", unlock: { type: "narrative_event", value: "recruit_jericho_recruited" } },
  { canonicalSpaceId: "ark.recruit_berth.akai_shi",      name: "Akai Shi's Berth",      unlock: { type: "narrative_event", value: "recruit_akai_recruited" } },
  { canonicalSpaceId: "ark.elara_bridge_berth",          name: "Elara's Bridge Berth",  unlock: { type: "room_visited", value: "ark.bridge" } },
  { canonicalSpaceId: "ark.human_observation_deck",      name: "Human's Observation Deck", unlock: { type: "narrative_event", value: "human_signal_received" } },
  { canonicalSpaceId: "ark.berth_comm_screen",           name: "Bunkroom Comm Screen",     unlock: { type: "room_visited", value: "ark.apprentice_berth.zealot" } },
  // 12 Guild Common Rooms (per §AC.6 in production doc)
  { canonicalSpaceId: "ark.guild_common_room.house_of_iron",     name: "House of Iron",     unlock: { type: "narrative_event", value: "guild_house_iron_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_glass",    name: "House of Glass",    unlock: { type: "narrative_event", value: "guild_house_glass_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_smoke",    name: "House of Smoke",    unlock: { type: "narrative_event", value: "guild_house_smoke_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_ledger",   name: "House of Ledger",   unlock: { type: "narrative_event", value: "guild_house_ledger_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_circuit",  name: "House of Circuit",  unlock: { type: "narrative_event", value: "guild_house_circuit_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_thurible", name: "House of Thurible", unlock: { type: "narrative_event", value: "guild_house_thurible_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_anvil",    name: "House of Anvil",    unlock: { type: "narrative_event", value: "guild_house_anvil_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_mirror",   name: "House of Mirror",   unlock: { type: "narrative_event", value: "guild_house_mirror_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_garden",   name: "House of Garden",   unlock: { type: "narrative_event", value: "guild_house_garden_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_chapel",   name: "House of Chapel",   unlock: { type: "narrative_event", value: "guild_house_chapel_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_tower",    name: "House of Tower",    unlock: { type: "narrative_event", value: "guild_house_tower_unlocked" } },
  { canonicalSpaceId: "ark.guild_common_room.house_of_remnant",  name: "House of Remnant",  unlock: { type: "narrative_event", value: "guild_house_remnant_unlocked" } },
  // 1 Game Master Act-7 cinematic
  { canonicalSpaceId: "ark.tier_infinity_chess_hall", name: "Tier-Infinity Chess Hall", unlock: { type: "blood_weave_alignment", threshold: 40 } },

  // ─── 60 destination zones (NEW_ART_2; 2026-05-12 producer drop) ───
  //
  // Each category gates on a single engineering-best-guess rule sourced
  // from `_PRODUCTION_DESTINATIONS.md` §E. Writer ratification is
  // tracked in `apps/shared/livingDeferralCanon.ts` (one entry per
  // category, status: deferred_narrative_design). Override per-zone
  // freely when narrative-design has a sharper rule.

  // Castle of Death ×20 — HB2's destination expansion (§E.4)
  { canonicalSpaceId: "dest.castle_of_death.cod01_entrance_hall",          name: "Castle of Death — Entrance Hall",          unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod02_poison_kitchen",         name: "Castle of Death — Poison Kitchen",         unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod03_mirror_gallery",         name: "Castle of Death — Mirror Gallery",         unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod04_clocktower_mechanism",   name: "Castle of Death — Clocktower Mechanism",   unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod05_flooded_dungeon",        name: "Castle of Death — Flooded Dungeon",        unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod06_throne_room",            name: "Castle of Death — Throne Room",            unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod07_library_of_forbidden",   name: "Castle of Death — Library of the Forbidden", unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod08_torture_garden",         name: "Castle of Death — Torture Garden",         unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod09_ballroom_of_bones",      name: "Castle of Death — Ballroom of Bones",      unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod10_observatory_of_doom",    name: "Castle of Death — Observatory of Doom",    unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod11_crypt_of_ancestors",     name: "Castle of Death — Crypt of Ancestors",     unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod12_alchemy_lab",            name: "Castle of Death — Alchemy Lab",            unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod13_armory_of_legends",      name: "Castle of Death — Armory of Legends",      unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod14_dining_hall_of_last_supper", name: "Castle of Death — Dining Hall of the Last Supper", unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod15_music_room",             name: "Castle of Death — Music Room",             unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod16_servants_quarters",      name: "Castle of Death — Servants' Quarters",     unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod17_greenhouse_of_carnivores", name: "Castle of Death — Greenhouse of Carnivores", unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod18_chapel_of_false_saints", name: "Castle of Death — Chapel of False Saints", unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod19_portrait_gallery",       name: "Castle of Death — Portrait Gallery",       unlock: { type: "hellbox_unlocked", hellbox: 2 } },
  { canonicalSpaceId: "dest.castle_of_death.cod20_final_chamber_throne",   name: "Castle of Death — Final Chamber",          unlock: { type: "hellbox_unlocked", hellbox: 2 } },

  // Quiz Show ×5 — HB3's destination expansion (§E.5)
  { canonicalSpaceId: "dest.quiz_show.qs01_main_stage",                    name: "Quiz Show — Main Stage",                   unlock: { type: "hellbox_unlocked", hellbox: 3 } },
  { canonicalSpaceId: "dest.quiz_show.qs02_lightning_round_chamber",       name: "Quiz Show — Lightning Round Chamber",      unlock: { type: "hellbox_unlocked", hellbox: 3 } },
  { canonicalSpaceId: "dest.quiz_show.qs03_bonus_vault",                   name: "Quiz Show — Bonus Vault",                  unlock: { type: "hellbox_unlocked", hellbox: 3 } },
  { canonicalSpaceId: "dest.quiz_show.qs04_elimination_pit",               name: "Quiz Show — Elimination Pit",              unlock: { type: "hellbox_unlocked", hellbox: 3 } },
  { canonicalSpaceId: "dest.quiz_show.qs05_backstage_green_room",          name: "Quiz Show — Backstage Green Room",         unlock: { type: "hellbox_unlocked", hellbox: 3 } },

  // Crucible ×15 — Tier-5 PvP arena opens mid-saga (§E.2)
  { canonicalSpaceId: "dest.crucible.cr01_iron_pit",                       name: "Crucible — Iron Pit",                      unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr02_void_ring",                      name: "Crucible — Void Ring",                     unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr03_acid_gardens",                   name: "Crucible — Acid Gardens",                  unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr04_clockwork_maze",                 name: "Crucible — Clockwork Maze",                unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr05_shadow_cathedral",               name: "Crucible — Shadow Cathedral",              unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr06_frozen_colosseum",               name: "Crucible — Frozen Colosseum",              unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr07_volcanic_forge",                 name: "Crucible — Volcanic Forge",                unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr08_gravity_well",                   name: "Crucible — Gravity Well",                  unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr09_mirror_dimension",               name: "Crucible — Mirror Dimension",              unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr10_storm_spire",                    name: "Crucible — Storm Spire",                   unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr11_bone_garden",                    name: "Crucible — Bone Garden",                   unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr12_neon_undercity",                 name: "Crucible — Neon Undercity",                unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr13_crystal_cavern",                 name: "Crucible — Crystal Cavern",                unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr14_shipwreck_graveyard",            name: "Crucible — Shipwreck Graveyard",           unlock: { type: "act_progress", act: 3 } },
  { canonicalSpaceId: "dest.crucible.cr15_living_forest",                  name: "Crucible — Living Forest",                 unlock: { type: "act_progress", act: 3 } },

  // Tower Defense ×10 — Military campaign at Act 5 (§E.3)
  { canonicalSpaceId: "dest.tower_defense.td01_iron_fortress",             name: "Tower Defense — Iron Fortress",            unlock: { type: "act_progress", act: 5 } },
  { canonicalSpaceId: "dest.tower_defense.td02_frozen_pass",               name: "Tower Defense — Frozen Pass",              unlock: { type: "act_progress", act: 5 } },
  { canonicalSpaceId: "dest.tower_defense.td03_jungle_temple",             name: "Tower Defense — Jungle Temple",            unlock: { type: "act_progress", act: 5 } },
  { canonicalSpaceId: "dest.tower_defense.td04_void_station",              name: "Tower Defense — Void Station",             unlock: { type: "act_progress", act: 5 } },
  { canonicalSpaceId: "dest.tower_defense.td05_clockwork_city",            name: "Tower Defense — Clockwork City",           unlock: { type: "act_progress", act: 5 } },
  { canonicalSpaceId: "dest.tower_defense.td06_necropolis",                name: "Tower Defense — Necropolis",               unlock: { type: "act_progress", act: 5 } },
  { canonicalSpaceId: "dest.tower_defense.td07_sky_citadel",               name: "Tower Defense — Sky Citadel",              unlock: { type: "act_progress", act: 5 } },
  { canonicalSpaceId: "dest.tower_defense.td08_toxic_swamp",               name: "Tower Defense — Toxic Swamp",              unlock: { type: "act_progress", act: 5 } },
  { canonicalSpaceId: "dest.tower_defense.td09_crystal_mines",             name: "Tower Defense — Crystal Mines",            unlock: { type: "act_progress", act: 5 } },
  { canonicalSpaceId: "dest.tower_defense.td10_war_machine",               name: "Tower Defense — War Machine",              unlock: { type: "act_progress", act: 5 } },

  // Trade Empire ×10 — First planetfall opens trade routes at Act 2 (§E.1)
  { canonicalSpaceId: "dest.trade_empire.te01_aurum_prime",                name: "Trade Empire — Aurum Prime",               unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "dest.trade_empire.te02_iron_bazaar",                name: "Trade Empire — Iron Bazaar",               unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "dest.trade_empire.te03_silk_nebula_port",           name: "Trade Empire — Silk Nebula Port",          unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "dest.trade_empire.te04_scrapyard_moon",             name: "Trade Empire — Scrapyard Moon",            unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "dest.trade_empire.te05_crystal_exchange",           name: "Trade Empire — Crystal Exchange",          unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "dest.trade_empire.te06_void_market",                name: "Trade Empire — Void Market",               unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "dest.trade_empire.te07_garden_world_agri",          name: "Trade Empire — Garden-World Agri",         unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "dest.trade_empire.te08_fuel_refinery",              name: "Trade Empire — Fuel Refinery",             unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "dest.trade_empire.te09_data_haven",                 name: "Trade Empire — Data Haven",                unlock: { type: "act_progress", act: 2 } },
  { canonicalSpaceId: "dest.trade_empire.te10_resort_world",               name: "Trade Empire — Resort World",              unlock: { type: "act_progress", act: 2 } },
];

/** O(1) lookup by canonicalSpaceId. */
export const ROOM_UNLOCK_BY_ID: ReadonlyMap<string, RoomUnlockEntry> =
  new Map(ROOM_UNLOCK_MANIFEST.map((e) => [e.canonicalSpaceId, e] as const));

/** Manifest total — 131 spaces declared with explicit unlock gates
 *  (12 Hellboxes + 7 vehicles + 64 destination entries — 60 NEW_ART_2
 *  bridge entries + 4 pre-existing dest extras + 48 apprentice /
 *  pedagogy / berth / guild / Game-Master / misc rooms).
 *
 *  The 60 NEW_ART_2 destinations gate on engineering-best-guess
 *  category rules sourced from `_PRODUCTION_DESTINATIONS.md` §E:
 *    - Castle of Death (×20): `hellbox_unlocked: 2` (§E.4)
 *    - Quiz Show (×5):        `hellbox_unlocked: 3` (§E.5)
 *    - Crucible (×15):        `act_progress: 3`    (§E.2)
 *    - Tower Defense (×10):   `act_progress: 5`    (§E.3)
 *    - Trade Empire (×10):    `act_progress: 2`    (§E.1)
 *  Each category's writer-ratification gap is tracked in
 *  `apps/shared/livingDeferralCanon.ts` so the spec gap stays visible
 *  even after the ratchet closes. Writer overrides per-zone freely. */
export const ROOM_UNLOCK_MANIFEST_TOTAL = ROOM_UNLOCK_MANIFEST.length;
