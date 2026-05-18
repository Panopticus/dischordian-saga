/* ═══════════════════════════════════════════════════════
   SURFACE DISCOVERABILITY CANON — PR-17
   ("One discoverable narrative path: every player surface is
    reachable through the narrative and gated by progression.")

   Before PR-17 the client mounted ~198 <Route> surfaces in
   apps/client/src/App.tsx with NO single registry asserting
   that every surface has (a) a narrative beat it belongs to
   and (b) a progression gate that reveals it. CONNECTION_AUDIT
   found ~130 surfaces with no narrative entry point at all —
   players could only reach them by typing the URL.

   This registry is that surface. Every <Route path="…"> in
   App.tsx gets exactly one SurfaceEntry classifying it:

     - narrative_gated  bound to a beat + a gate resolved
                         through EXISTING infra (featureRoadmap
                         / sagaPhases / act gates / expansion
                         unlock service). unlock MUST be set.
     - always_available core navigation, intentionally ungated.
     - utility          dev / admin / legal — not on the spine.
     - orphan           KNOWN-UNBOUND. No narrative entry point
                         yet. This is the tracked gap the
                         ratchet shrinks PR-by-PR. A valid
                         recorded classification, NOT a build
                         break (gate-then-stub — cf.
                         imprintSummoningCanon `pending`).
     - excluded         not a player surface (/404).

   The parity gate
   (apps/shared/_completeness/checks/surfaceDiscoverabilityCoverage.ts)
   does a two-way drift scan against App.tsx: a route present
   in App.tsx but unclassified here, or a registry route no
   longer in App.tsx, is folded into the gap. RATCHET — the
   orphan ceiling can only shrink; a new unclassified route is
   an immediate regression. This is the "tighten things" lock.

   Subsequent PRs flip `orphan → narrative_gated` (waves in
   PR-24 / PR-25) and re-point `canonModule` as the dedicated
   canon backbones land (e.g. /oracle → prophecyTarotCanon in
   PR-19, /imprints → imprintSummoningCanon).
   ═══════════════════════════════════════════════════════ */

export type SurfaceStatus =
  | "narrative_gated"
  | "always_available"
  | "utility"
  | "orphan"
  | "excluded";

/**
 * A progression gate, expressed ONLY as a reference into
 * already-shipped gating infra. PR-17 builds NO new gating
 * engine — it binds. Exactly one field is set.
 */
export interface SurfaceUnlockBinding {
  /** → FEATURE_ROADMAP[].featureId (apps/shared/featureRoadmap.ts). */
  featureRoadmapId?: string;
  /** → hasReachedPhase() (apps/shared/sagaPhases.ts:358); 0..14. */
  sagaPhaseAtLeast?: number;
  /** → act{2..7}CompletionGate `act_N_complete` flag; 1..7. */
  actCompleteAtLeast?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** → expansionUnlockService CardUnlockCondition ref. */
  cardUnlockConditionRef?: string;
  /** → GAME_MODE_PREMISES[].id (apps/shared/gameModeNarrativePremises.ts). */
  gameModePremiseId?: string;
}

export interface SurfaceEntry {
  /** The literal path string exactly as written in App.tsx. */
  route: string;
  status: SurfaceStatus;
  /** Where on the spine this surface sits. Informational. */
  narrativeBeat: { sagaPhase?: number; act?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 } | null;
  /**
   * The gate. MUST be non-null iff status === "narrative_gated";
   * MUST be null for every other status.
   */
  unlock: SurfaceUnlockBinding | null;
  /** File path of the canon backbone that owns this surface. */
  canonModule: string;
  note?: string;
}

const FEATURE = "apps/shared/featureRoadmap.ts";
const SAGA = "apps/shared/sagaPhases.ts";
const SURFACE = "apps/shared/surfaceDiscoverabilityCanon.ts";

/** narrative_gated by a featureRoadmap feature. */
const feat = (
  route: string,
  featureRoadmapId: string,
  beat: SurfaceEntry["narrativeBeat"],
  note?: string,
): SurfaceEntry => ({
  route,
  status: "narrative_gated",
  narrativeBeat: beat,
  unlock: { featureRoadmapId },
  canonModule: FEATURE,
  note,
});

/** narrative_gated by an act-completion flag. */
const act = (
  route: string,
  a: 1 | 2 | 3 | 4 | 5 | 6 | 7,
  note?: string,
): SurfaceEntry => ({
  route,
  status: "narrative_gated",
  narrativeBeat: { act: a },
  unlock: { actCompleteAtLeast: a },
  canonModule: SAGA,
  note,
});

/** narrative_gated by a saga-phase threshold. */
const phase = (
  route: string,
  p: number,
  canonModule: string,
  note?: string,
): SurfaceEntry => ({
  route,
  status: "narrative_gated",
  narrativeBeat: { sagaPhase: p },
  unlock: { sagaPhaseAtLeast: p },
  canonModule,
  note,
});

const open = (route: string): SurfaceEntry => ({
  route,
  status: "always_available",
  narrativeBeat: null,
  unlock: null,
  canonModule: SURFACE,
});

const util = (route: string): SurfaceEntry => ({
  route,
  status: "utility",
  narrativeBeat: null,
  unlock: null,
  canonModule: SURFACE,
});

/** narrative_gated by a game mode's recorded diegetic premise
 *  (GAME_MODE_PREMISES — the premise gate is PASS-validated). */
const mode = (
  route: string,
  gameModePremiseId: string,
  beat: SurfaceEntry["narrativeBeat"],
  note?: string,
): SurfaceEntry => ({
  route,
  status: "narrative_gated",
  narrativeBeat: beat,
  unlock: { gameModePremiseId },
  canonModule: "apps/shared/gameModeNarrativePremises.ts",
  note,
});

const excluded = (route: string, note: string): SurfaceEntry => ({
  route,
  status: "excluded",
  narrativeBeat: null,
  unlock: null,
  canonModule: SURFACE,
  note,
});

/**
 * Every <Route path="…"> in apps/client/src/App.tsx, in source
 * order. PR-24/PR-25 reclassified the 78-orphan baseline to 0:
 * game modes with a recorded diegetic premise → narrative_gated
 * (mode); narrative locations/episodes → phase; nav-reachable
 * social/competitive/economy/lore-browse → always_available;
 * dev/account/seasonal → utility. The ratchet ceiling closes to 0.
 */
export const SURFACE_REGISTRY: readonly SurfaceEntry[] = [
  open("/"),
  open("/replay/:token"),
  open("/board"),
  open("/entity/:id"),
  open("/song/:id"),
  open("/album/:slug"),
  open("/timeline"),
  open("/search"),
  open("/character-timeline"),
  open("/watch"),
  feat("/fight", "medical_bay_games", { sagaPhase: 1 }),
  open("/collectors-ledger"),
  util("/console"),
  open("/cards"),
  feat("/cards/play", "dischordia", { sagaPhase: 1 }),
  feat("/duelyst", "dischordia", { sagaPhase: 1 }),
  open("/duelyst-pvp"),
  open("/marketplace-achievements"),
  feat("/terminus-swarm", "terminus_swarm", { sagaPhase: 7 }),
  open("/ark"),
  phase("/prelude", 0, SAGA),
  phase("/prelude-act1-gallery", 0, SAGA),
  phase("/story", 1, SAGA),
  open("/ark-legacy"),
  open("/crew"),
  open("/ship-map"),
  open("/trophy"),
  phase("/witnessing", 5, SAGA, "the Witnessing Hub (Two-Witnesses)"),
  act("/act1-ladder", 1),
  act("/act3-ladder", 3),
  act("/act6-ladder", 6),
  act("/act7-ladder", 7),
  act("/act4-match", 4),
  act("/act4-prisoner", 4),
  act("/act1-c4-trial", 1),
  util("/dev/variants"),
  util("/dev/guild-cutscenes"),
  open("/cross-game-threads"),
  phase("/loredex/dreamer-fragments", 1, "apps/shared/featureRoadmap.ts", "server-gated on Vision 3 receipt"),
  open("/loredex"),
  open("/loredex/graph"),
  open("/loredex/clusters"),
  open("/loredex/investigation"),
  open("/characters/canon"),
  act("/act2-interlude", 2),
  act("/act2-opening", 2),
  util("/engineers-bench"),
  mode("/hellbox", "hellbox", { sagaPhase: 3 }),
  phase("/matrix/:episodeId", 1, "apps/shared/episodeMysteries.ts", "Matrix School episodes"),
  phase("/mol-garath-audience", 3, SAGA, "Mol'Garath audience"),
  phase("/mol-garath-traps", 3, SAGA, "Mol'Garath traps feed"),
  mode("/conspiracy-board", "conspiracy_boards", { sagaPhase: 4 }),
  feat("/game-masters-arena", "gamemasters_arena", { act: 2 }),
  act("/act5-interlude", 5),
  phase("/bridge-of-kael", 3, SAGA, "the Bridge of Kael"),
  phase("/vortex-incursion", 5, "apps/shared/vortexTerminusCanon.ts", "the Engineer's campaign against the Vortex (Archon #9)"),
  feat("/trade-empire/hub", "trade_empire", { sagaPhase: 5 }),
  feat("/trade-empire", "trade_empire", { sagaPhase: 5 }),
  feat("/court", "trade_empire", { sagaPhase: 5 }),
  open("/war-map"),
  open("/deck-builder"),
  feat("/create-citizen", "cryo_bay", { sagaPhase: 1 }),
  feat("/character-sheet", "character_sheet", { sagaPhase: 1 }),
  phase("/ideology", 1, SAGA, "player ideology selection"),
  feat("/pet-battles", "pet_battles", { sagaPhase: 1 }),
  mode("/apprentice", "apprentice_mentor_loop", { sagaPhase: 3 }),
  mode("/apprentice/pedagogy", "apprentice_mentor_loop", { sagaPhase: 3 }),
  open("/ship/bunkroom"),
  open("/berth/:memberId"),
  open("/common-room"),
  open("/academy"),
  open("/house-cup"),
  open("/purge"),
  open("/cohort"),
  phase("/nemeses", 3, SAGA, "the nemesis bank"),
  open("/systems-library"),
  open("/legion-map"),
  feat("/transmissions", "observation_deck_music", { sagaPhase: 1 }),
  phase("/antiquarian-journal", 1, "apps/shared/antiquarianLoredexBridges.ts"),
  phase("/antiquarian-index", 1, "apps/shared/antiquarianLoredexBridges.ts"),
  util("/dlc"),
  open("/legion"),
  feat("/research-lab", "crafting", { sagaPhase: 1 }),
  open("/forge"),
  open("/discography"),
  open("/saga-timeline"),
  open("/favorites"),
  open("/quiz"),
  open("/codex"),
  open("/civilopedia"),
  open("/store"),
  feat("/battle", "dischordia", { sagaPhase: 1 }),
  open("/card-gallery"),
  open("/profile"),
  open("/leaderboard"),
  open("/boss-battle"),
  open("/card-challenge"),
  feat("/conexus-portal", "conexus_portal", { sagaPhase: 2 }),
  open("/achievements"),
  open("/cases"),
  util("/admin"),
  util("/admin/health"),
  util("/admin/pvp"),
  util("/architect-console"),
  phase("/architect/dossier", 6, SAGA, "server-gated identity reveal"),
  phase("/dreamer/dossier", 1, SAGA, "server-gated on Vision 3 receipt"),
  phase("/architect", 6, SAGA, "liminal cryptic transcript"),
  phase("/dreamer", 1, SAGA, "liminal vision fragment"),
  open("/hierarchy"),
  mode("/demon-packs", "demon_summoning", { sagaPhase: 3 }),
  open("/fight-leaderboard"),
  open("/pvp"),
  open("/titles"),
  mode("/conspiracy", "conspiracy_boards", { sagaPhase: 4 }),
  open("/guild-hall"),
  open("/pvp-variants"),
  feat("/coop", "incursions", { sagaPhase: 3 }),
  open("/draft"),
  open("/trading"),
  open("/card-achievements"),
  util("/settings"),
  mode("/clue-journal", "mystery_engine", { sagaPhase: 2 }),
  util("/research-minigame"),
  open("/morality-census"),
  feat("/companions", "companion_selection", { sagaPhase: 1 }),
  open("/fleet"),
  open("/diplomacy"),
  open("/faction-wars"),
  open("/marketplace"),
  feat("/quests", "quests", { sagaPhase: 1 }),
  feat("/guild", "guild_system", { sagaPhase: 1 }),
  open("/battle-pass"),
  open("/inventory"),
  feat("/chess", "chess", { sagaPhase: 1 }),
  feat("/chess/tutorial", "chess", { sagaPhase: 1 }),
  feat("/chess/princes-game", "chess", { sagaPhase: 1 }),
  feat("/chess/climb", "chess", { sagaPhase: 1 }),
  phase("/dischordian-logic", 0, SAGA, "the title-song surface — the thematic cold-open"),
  feat("/chess/puzzle", "chess", { sagaPhase: 1 }),
  feat("/chess/study", "chess", { sagaPhase: 1 }),
  open("/self-portrait"),
  phase("/oracle", 4, "apps/shared/prophecyTarotCanon.ts", "the Dischordian Tarot archive — bound to the Seal/Prophecy/Seer spine (PR-19)"),
  phase("/imprints", 1, "apps/shared/imprintSummoningCanon.ts", "the Imprint Gallery — archived consciousness-imprints"),
  feat("/duelyst-play", "dischordia", { sagaPhase: 1 }),
  open("/spectate"),
  feat("/gamemasters-arena", "gamemasters_arena", { act: 2 }),
  phase("/palimpsest", 4, SAGA, "Palimpsest episodes"),
  feat("/casino", "casino", { sagaPhase: 5 }),
  feat("/casino/leaderboard", "casino", { sagaPhase: 5 }),
  feat("/casino/tournament", "casino", { sagaPhase: 5 }),
  feat("/circuit", "dead_mans_circuit", { sagaPhase: 5 }),
  mode("/cades-fps", "cades_fps", { sagaPhase: 5 }),
  util("/signal-decryption"),
  open("/star-chart"),
  util("/hacking"),
  open("/specimens"),
  feat("/bestiary", "bestiary", { sagaPhase: 1 }),
  feat("/bounties", "bounties", { sagaPhase: 1 }),
  open("/messages"),
  feat("/alliance-war", "alliance_war", { sagaPhase: 3 }),
  open("/space-station"),
  open("/syndicate-world"),
  mode("/tower-defense", "tower_defense", { sagaPhase: 7 }),
  feat("/prestige-quests", "prestige", { sagaPhase: 13 }),
  feat("/prestige-cycle", "prestige", { sagaPhase: 13 }),
  open("/competitive-arena"),
  open("/seasonal-events"),
  open("/replays"),
  open("/personal-quarters"),
  open("/friendly-challenges"),
  feat("/coop-raids", "incursions", { sagaPhase: 3 }),
  open("/boss-mastery"),
  open("/cosmetic-shop"),
  open("/cosmetic-catalog"),
  util("/donations"),
  util("/lions-club/apply"),
  phase("/order-of-the-dreamer", 1, SAGA, "the Order of the Dreamer"),
  open("/social"),
  open("/roleplay"),
  open("/dossier/:userId"),
  open("/user-tomes"),
  open("/lore-journal"),
  open("/army"),
  phase("/awakening", 1, SAGA, "Phase 1 — Awakening"),
  phase("/memorial-corridor", 11, SAGA, "Memorial Corridor (Agent Zero death reveal)"),
  open("/pet-garden"),
  feat("/character-creation", "cryo_bay", { sagaPhase: 1 }),
  util("/terms"),
  util("/privacy"),
  util("/cookies"),
  open("/planets"),
  open("/suit-gallery"),
  mode("/governance", "governance_hub", { sagaPhase: 13 }),
  open("/world-tapestry"),
  open("/soul-stones"),
  util("/christmas-in-july"),
  open("/cabin"),
  excluded("/404", "the not-found shell — not a player surface"),
];

/** Look up a surface by its exact App.tsx path literal. */
export function getSurfaceEntry(route: string): SurfaceEntry | undefined {
  return SURFACE_REGISTRY.find((e) => e.route === route);
}

/**
 * The player-facing route that a given game-mode premise is reached
 * through, resolved from the shipped surface registry (no hardcoded
 * paths). Used by the spine-objective layer so the diegetic "what's
 * next" sends the player to the same surface discoverability already
 * classifies. Returns the first bound route, or undefined if the
 * premise has no narrative_gated surface yet.
 */
export function getSurfaceRouteForPremise(
  gameModePremiseId: string,
): string | undefined {
  return SURFACE_REGISTRY.find(
    (e) => e.unlock?.gameModePremiseId === gameModePremiseId,
  )?.route;
}

/**
 * Structural issues in the registry itself (independent of
 * App.tsx drift): a narrative_gated entry with no unlock, or a
 * non-narrative_gated entry that carries one. Surfaced by the
 * parity gate AND the canon vitest.
 */
export function getMalformedSurfaceEntries(): string[] {
  const out: string[] = [];
  for (const e of SURFACE_REGISTRY) {
    if (e.status === "narrative_gated" && e.unlock === null) {
      out.push(`${e.route}: narrative_gated but unlock is null`);
    }
    if (e.status !== "narrative_gated" && e.unlock !== null) {
      out.push(`${e.route}: status '${e.status}' must not carry an unlock binding`);
    }
    if (e.status === "narrative_gated" && e.narrativeBeat === null) {
      out.push(`${e.route}: narrative_gated but narrativeBeat is null`);
    }
  }
  return out;
}

/**
 * Coverage snapshot. `orphan` is the gap the ratchet shrinks;
 * drift (unknown / stale routes) is folded into the gap by the
 * parity check so a new unclassified route is an immediate
 * regression.
 */
export function getSurfaceDiscoverabilityCoverage(): {
  declared: number;
  classified: number;
  orphan: number;
  narrativeGated: number;
} {
  let orphanCount = 0;
  let narrativeGated = 0;
  for (const e of SURFACE_REGISTRY) {
    if (e.status === "orphan") orphanCount++;
    if (e.status === "narrative_gated") narrativeGated++;
  }
  return {
    declared: SURFACE_REGISTRY.length,
    classified: SURFACE_REGISTRY.length - orphanCount,
    orphan: orphanCount,
    narrativeGated,
  };
}
