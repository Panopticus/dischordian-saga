/* ═══════════════════════════════════════════════════════
   APPENDIX C §C.7 — INTEGRATION MAP

   What already exists, what is new. Appendix C is
   architected to run on infrastructure the game already
   ships.

   Each entry maps an existing subsystem (or a new one) to
   how Appendix C uses it. This is the catalog the runtime
   implementation should consult to answer "do I need to
   build a new system for this, or does canon already
   cover it?"
   ═══════════════════════════════════════════════════════ */

export type AppendixCSystemStatus = "existing" | "new" | "data_only";

export interface AppendixCIntegrationEntry {
  id: string;
  /** Name of the system. */
  system: string;
  /** File that owns the system (or would, if new). */
  file: string;
  /** Whether the system already exists, is new, or is data-only. */
  status: AppendixCSystemStatus;
  /** How Appendix C uses the system. */
  usage: string;
}

/** Canonical systems Appendix C RE-USES with zero changes. */
export const APPENDIX_C_CANONICAL_USES: readonly AppendixCIntegrationEntry[] = [
  {
    id: "quiz_spectator",
    system: "Gamemaster's Arena (spectator + betting)",
    file: "apps/client/src/game/quizSpectator.ts",
    status: "existing",
    usage:
      "The entire show runs on it. Clone numbers, dies_on_round, survives_round, perfect_run bets, spectator messages. Zero changes needed.",
  },
  {
    id: "loredex_quiz",
    system: "Loredex Quiz",
    file: "apps/client/src/pages/LoreQuizPage.tsx",
    status: "existing",
    usage:
      "Round 1 of every episode draws questions directly from the existing quiz engine.",
  },
  {
    id: "thaloria_debate_stage",
    system: "Thaloria Debate Stage art",
    file: "apps/client/public/art/special-maps/special-thaloria-debate-stage.png",
    status: "existing",
    usage:
      "Round 2 Debate and the Episode 10 full Debate episode are set here. Single existing asset.",
  },
  {
    id: "ripple_engine",
    system: "Ripple Engine",
    file: "apps/server/services/rippleEngine.ts",
    status: "existing",
    usage:
      "All Palimpsest meter changes are emitted as ripple events; the casualty crawl pulls from the existing combat_death stream.",
  },
  {
    id: "living_ark_daily_brief",
    system: "Living Ark daily brief",
    file: "apps/client/src/game/livingArk.ts",
    status: "existing",
    usage:
      "Host cold opens reference whatever event happened on the player's ship today.",
  },
  {
    id: "transmissions",
    system: "Transmissions",
    file: "apps/shared/transmissions.ts",
    status: "existing",
    usage:
      "All ads during broadcasts are existing transmissions. Inventor hacks piggyback on the transmission delivery pipeline.",
  },
  {
    id: "signal_beacons",
    system: "Signal Beacons",
    file: "apps/shared/signalBeacons.ts",
    status: "existing",
    usage:
      "The Inventor's posthumous message after Darren's death is delivered as a canonical Signal Beacon.",
  },
  {
    id: "mechronis_professors",
    system: "Mechronis Professors",
    file: "apps/shared/mechronisProfessors.ts",
    status: "existing",
    usage:
      "Episode 6 Survivor: Mechronis uses canonical Kanevas, Aoki, Halverez. Introduces Professor Glinn Vyre as a guest judge (single new Professor entry).",
  },
  {
    id: "apprentice_betrayal",
    system: "Apprentice Betrayal",
    file: "apps/shared/apprenticeBetrayal.ts",
    status: "existing",
    usage:
      "Episode 4 Auction memory-loss mechanic uses the existing Apprentice Betrayal memory-tracking system.",
  },
  {
    id: "syndicate_worlds",
    system: "Syndicate Worlds",
    file: "apps/shared/syndicateWorlds.ts",
    status: "existing",
    usage:
      "Episode 7 Railroad episode's legal filings become Syndicate contracts the player has canonically signed.",
  },
  {
    id: "cryo_dreams",
    system: "Cryo Dreams",
    file: "apps/shared/cryoDreams.ts",
    status: "existing",
    usage:
      "Darren's posthumous half-finished scenarios get finished by the player and appear as new cryoDreams entries credited 'story by [player] and Darren Fessler.'",
  },
  {
    id: "antiquarians_journal",
    system: "Antiquarian's Journal",
    file: "apps/shared/antiquariansJournal.ts",
    status: "existing",
    usage:
      "Every Palimpsest-relevant event generates a Chronicle entry in the canonical voice.",
  },
  {
    id: "card_archetypes",
    system: "Dischordia card pool",
    file: "apps/shared/cardArchetypes.ts",
    status: "existing",
    usage:
      "THE ASSISTANT card (Darren's memorial) is added to the existing card pool. Zero new art — reuses Darren's badge render.",
  },
];

/** New files / additions Appendix C introduces. */
export const APPENDIX_C_NEW_CODE: readonly AppendixCIntegrationEntry[] = [
  {
    id: "darren_fessler_npc",
    system: "Darren Fessler NPC",
    file: "apps/shared/darrenFessler.ts",
    status: "new",
    usage:
      "Dialog, letters, and office-hours review prompts.",
  },
  {
    id: "general_alaric_npc",
    system: "General Alaric NPC",
    file: "apps/shared/generalAlaric.ts",
    status: "new",
    usage:
      "Contestant dialog, Objection ability, cross-faction metadata linking him to Shadow Tongue.",
  },
  {
    id: "professor_glinn_vyre",
    system: "Professor Glinn Vyre entry",
    file: "apps/shared/mechronisProfessors.ts",
    status: "data_only",
    usage: "One new Mechronis Professor entry — the Game Master Professor.",
  },
  {
    id: "palimpsest_meter",
    system: "Palimpsest meter",
    file: "apps/shared/palimpsest.ts",
    status: "new",
    usage:
      "Modeled on the existing necromancerCycle.ts two-bar pattern. Consumes the §C.1 contribution tables.",
  },
  {
    id: "palimpsest_ripple_events",
    system: "Six new ripple events",
    file: "apps/server/services/rippleEngine.ts",
    status: "data_only",
    usage:
      "palimpsest_signal_gain, palimpsest_noise_gain, inventor_hack_landed, inventor_hack_blocked, show_casualty_rolled, host_mask_slipped.",
  },
  {
    id: "palimpsest_episode_configs",
    system: "13 episode configs",
    file: "apps/shared/appendixC/episodeFormats.ts",
    status: "data_only",
    usage:
      "One entry per episode — Round 3 format, theme, casualty rules, hack level.",
  },
  {
    id: "darrens_desk",
    system: "Darren's desk in Dreams Workshop",
    file: "apps/client/src/game/rooms/dreamsWorkshop.ts",
    status: "new",
    usage:
      "Single scene, accessible post-Episode 12. Displays half-finished scenarios the player can finish.",
  },
  {
    id: "inventor_signal_beacon",
    system: "Inventor's posthumous Signal Beacon",
    file: "apps/shared/signalBeacons.ts",
    status: "data_only",
    usage: "One new beacon entry fired after Darren's death.",
  },
  {
    id: "the_assistant_card",
    system: "THE ASSISTANT card",
    file: "apps/shared/cardArchetypes.ts",
    status: "data_only",
    usage: "Darren's memorial Dischordia card. Reuses his badge render.",
  },
  {
    id: "mailroom_letters",
    system: "12 between-episode letter templates",
    file: "apps/shared/darrenFessler.ts",
    status: "data_only",
    usage: "Mailroom content, one per episode.",
  },
  {
    id: "governance_hub_panel",
    system: "Palimpsest Governance Hub panel",
    file: "apps/client/src/pages/GovernanceHubPage.tsx",
    status: "new",
    usage:
      "Renders the Palimpsest bars as an illuminated-manuscript page component.",
  },
];

export function listAppendixCCanonicalUses(): readonly AppendixCIntegrationEntry[] {
  return APPENDIX_C_CANONICAL_USES;
}

export function listAppendixCNewCode(): readonly AppendixCIntegrationEntry[] {
  return APPENDIX_C_NEW_CODE;
}
