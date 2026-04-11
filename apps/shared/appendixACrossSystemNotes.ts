/* ═══════════════════════════════════════════════════════
   APPENDIX A DATA SHELL — cross-system integration notes.

   Encodes the 10 Appendix A integration notes from the
   Witnessing Narrative Proposal as typed data. Each note
   describes how an EXISTING subsystem in the repo should
   be narratively bound to a Witnessing concern — NOT how
   to build new code.

   Format: { noteId, existingModule, witnessingConcern,
             integrationMechanism, status }

   Status is "documented" for everything here — these are
   all proposal-level bindings that future work can
   implement by touching the target module.
   ═══════════════════════════════════════════════════════ */

export type AppendixANoteId =
  | "a1_matrix_of_dreams"
  | "a2_incursions_vortex_vehicle"
  | "a3_bonus_objectives_callbacks"
  | "a4_trade_agents_eyes_network"
  | "a5_four_guilds"
  | "a6_crew_genetics_pet_dynasty"
  | "a7_celebration_trial"
  | "a8_mechronis_professors"
  | "a9_dmc_identity_chain"
  | "a10_trophy_room_captains_quarters";

export type IntegrationStatus =
  /** Proposal-level binding; future work implements it. */
  | "documented"
  /** A link file or data shell ships in this commit. */
  | "shell_landed"
  /** The existing subsystem has been wired to the Witnessing concern. */
  | "wired";

export interface AppendixANote {
  id: AppendixANoteId;
  /** §A.N title from the proposal. */
  title: string;
  /** Which existing repo module the note binds to. */
  existingModule: string;
  /** Which Witnessing concern it serves. */
  witnessingConcern: string;
  /** Short summary of the integration mechanism. */
  integrationMechanism: string;
  status: IntegrationStatus;
  /** Any downstream flags this integration raises when it lands. */
  shippingFlags?: string[];
}

export const APPENDIX_A_NOTES: Record<AppendixANoteId, AppendixANote> = {
  a1_matrix_of_dreams: {
    id: "a1_matrix_of_dreams",
    title: "Matrix of Dreams — diegetic substrate for all slideshows",
    existingModule: "apps/client/src/game/matrix-hub (+ Cades MatrixHub.tscn)",
    witnessingConcern:
      "Every slideshow the player watches is the Antiquarian or a Game Master pulling an archived moment from the Matrix of Dreams and playing it for the player. The game doesn't have flashbacks — it has Matrix pulls.",
    integrationMechanism:
      "Wrap SongSlideshow playback in a Matrix frame UI. Act 4 Prisoner chapters run INSIDE the Matrix; the White Oracle dispatches the player into archived Panopticon cells.",
    status: "documented",
    shippingFlags: ["matrix_is_slideshow_substrate"],
  },

  a2_incursions_vortex_vehicle: {
    id: "a2_incursions_vortex_vehicle",
    title: "Incursions = the §11.5 Vortex Endgame vehicle",
    existingModule: "apps/shared/incursions.ts",
    witnessingConcern:
      "The §11.5 community endgame event ('push back the Vortex') becomes a series of co-op Incursions with mini-Vortex at Room 5 and the Vortex itself at Room 10.",
    integrationMechanism:
      "Reuse incursions.ts's 10-room structure + weekly reset. Add Witnessing-specific room templates for the Vortex encounter and the community-wide progress counter.",
    status: "documented",
    shippingFlags: ["incursions_vortex_template_loaded"],
  },

  a3_bonus_objectives_callbacks: {
    id: "a3_bonus_objectives_callbacks",
    title: "Bonus Objectives = narrator callback delivery channel",
    existingModule: "apps/shared/livingUniverseEvents.ts + daily quests",
    witnessingConcern:
      "The 2-hour bonus objective refresh cycle becomes the delivery channel for companion callback objectives ('Elara asked you yesterday about the Memorial Corridor. Visit it in the next 2 hours to hear her thoughts').",
    integrationMechanism:
      "Add a new bonus objective type 'narrator_callback' that pulls from the §13 dialog matrix and surfaces an unlocked higher-tier line when the player completes the objective.",
    status: "documented",
    shippingFlags: ["bonus_objectives_callbacks_wired"],
  },

  a4_trade_agents_eyes_network: {
    id: "a4_trade_agents_eyes_network",
    title: "Trade Empire Agents = the Eyes' dead network",
    existingModule: "apps/shared/tradeEmpireAgents.ts",
    witnessingConcern:
      "Every §7.3 Infiltration success adds one agent to the player's permanent roster. The Eyes left hundreds of assets scattered across the galaxy before her death. Her final transmission (§7.1) is a list of their names.",
    integrationMechanism:
      "Reframe agent recruitment as 'finding the Eyes' asset'. Each recruited agent unlocks one line of the Eyes' final transmission in the Loredex.",
    status: "documented",
    shippingFlags: ["eyes_network_recruitment_wired"],
  },

  a5_four_guilds: {
    id: "a5_four_guilds",
    title: "Four New Babylon Guilds as F1 sub-factions",
    existingModule: "apps/client/src/game/factionWarData.ts + guild-*.jpg art",
    witnessingConcern:
      "The Living / The Locks / The Yellow Coats / The Influencers become four Infiltration routes inside the New Babylon F1 path (§7.3). Each has distinct gameplay unlocks.",
    integrationMechanism:
      "Add a Guild dimension to the New Babylon Infiltration flow. Each guild unlocks one distinct mechanic: organic crafting (Living), puzzle-box cards (Locks), market manipulation (Yellow Coats), Loredex rewriting (Influencers).",
    status: "documented",
    shippingFlags: [
      "guild_living_infiltrated",
      "guild_locks_infiltrated",
      "guild_yellow_coats_infiltrated",
      "guild_influencers_infiltrated",
    ],
  },

  a6_crew_genetics_pet_dynasty: {
    id: "a6_crew_genetics_pet_dynasty",
    title: "Crew Genetics × Pet Dynasty = one legacy system",
    existingModule: "apps/shared/crewGenetics.ts + pet garden (§2.5)",
    witnessingConcern:
      "Two parallel genetics systems become one continuous legacy mechanic. A Garden pet's traits can be passed to a crew member's next-generation child as a 'bond descendant'.",
    integrationMechanism:
      "Expose a shared crossover API that takes a pet id and a crew lineage id and produces a combined trait inheritance. Narratively: the pet 'retires' into the crew's legacy.",
    status: "documented",
    shippingFlags: ["pet_crew_legacy_bridge_wired"],
  },

  a7_celebration_trial: {
    id: "a7_celebration_trial",
    title: "Celebration Trial × Act 1 Cycle A — inline update",
    existingModule: "apps/shared/celebrationTrial.ts",
    witnessingConcern:
      "The 28-day Celebration daily decision system is Act 1 Cycle A's parallel mechanic. Each daily decision maps to a Kindergarten of Gods beat.",
    integrationMechanism:
      "Cross-link celebrationTrial.ts with witnessingCanonXref.ts so Loredex entries for the Celebration trial reference the Act 1 Cycle A opponents (Little Meme, Little Collector, Little Watcher).",
    status: "shell_landed",
  },

  a8_mechronis_professors: {
    id: "a8_mechronis_professors",
    title: "Mechronis Professors × Act 1 Cycle B — inline update",
    existingModule: "apps/shared/mechronisProfessors.ts",
    witnessingConcern:
      "The canonical Mechronis Professors grade the player's Cycle B battles. Curator Halverez's xenomorph mask is the same helmet as the Thaloria cinematic (§6.5).",
    integrationMechanism:
      "Cross-link mechronisProfessors.ts with witnessingCanonXref.ts and surface the Halverez/Thaloria helmet link in the Loredex as a zero-cost reveal.",
    status: "shell_landed",
  },

  a9_dmc_identity_chain: {
    id: "a9_dmc_identity_chain",
    title: "Dead Man's Circuit × four-name identity chain",
    existingModule: "games/dead-mans-circuit (Godot project)",
    witnessingConcern:
      "The player authors their own four-name identity chain in DMC per §10.1: Student, Seeker, Detective, Last. Each naming is delivered between three-race blocks. Nilmorg narrates each as a eulogy for a clone you 'used to be'.",
    integrationMechanism:
      "Insert a naming prompt between every three races. The racing gameplay is unchanged; it gains a four-beat narrative spine.",
    status: "documented",
    shippingFlags: [
      "dmc_student_named",
      "dmc_seeker_named",
      "dmc_detective_named",
      "dmc_last_named",
    ],
  },

  a10_trophy_room_captains_quarters: {
    id: "a10_trophy_room_captains_quarters",
    title: "Trophy Room + Captain's Quarters + Memorial Corridor",
    existingModule: "apps/client/src/game/livingArk.ts (ROOMS)",
    witnessingConcern:
      "Trophy Room displays: every authored Dischordia card, every pet that died, every dismissed companion line, the player's DMC identity chain. Captain's Quarters is the only room where both narrators are always present together.",
    integrationMechanism:
      "Trophy Room gets a 'Witnessing Wall' view that lists the above. Captain's Quarters adds a sleep-for-bond mechanic: one free bond point with each companion when the player sleeps there.",
    status: "documented",
    shippingFlags: [
      "trophy_room_witnessing_wall_shipped",
      "captains_quarters_sleep_bond_shipped",
    ],
  },
};

/** Ten notes in canonical A.1-A.10 order. */
export function listAppendixANotes(): readonly AppendixANote[] {
  const ids: AppendixANoteId[] = [
    "a1_matrix_of_dreams",
    "a2_incursions_vortex_vehicle",
    "a3_bonus_objectives_callbacks",
    "a4_trade_agents_eyes_network",
    "a5_four_guilds",
    "a6_crew_genetics_pet_dynasty",
    "a7_celebration_trial",
    "a8_mechronis_professors",
    "a9_dmc_identity_chain",
    "a10_trophy_room_captains_quarters",
  ];
  return ids.map((id) => APPENDIX_A_NOTES[id]);
}

export function getAppendixANote(id: AppendixANoteId): AppendixANote {
  return APPENDIX_A_NOTES[id];
}
