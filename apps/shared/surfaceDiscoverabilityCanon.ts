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

const orphan = (route: string, note: string): SurfaceEntry => ({
  route,
  status: "orphan",
  narrativeBeat: null,
  unlock: null,
  canonModule: SURFACE,
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

const NO_BEAT = "no narrative entry point yet — tighten in a later discoverability wave (PR-24/PR-25)";

/**
 * Every <Route path="…"> in apps/client/src/App.tsx, in source
 * order. Orphans carry the tracked gap; later PRs flip them.
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
  orphan("/collectors-ledger", NO_BEAT),
  util("/console"),
  open("/cards"),
  feat("/cards/play", "dischordia", { sagaPhase: 1 }),
  feat("/duelyst", "dischordia", { sagaPhase: 1 }),
  orphan("/duelyst-pvp", "PvP matchmaking — no narrative entry point (CONNECTION_AUDIT critical orphan)"),
  orphan("/marketplace-achievements", NO_BEAT),
  feat("/terminus-swarm", "terminus_swarm", { sagaPhase: 7 }),
  open("/ark"),
  phase("/prelude", 0, SAGA),
  phase("/prelude-act1-gallery", 0, SAGA),
  phase("/story", 1, SAGA),
  orphan("/ark-legacy", NO_BEAT),
  open("/crew"),
  open("/ship-map"),
  orphan("/trophy", NO_BEAT),
  orphan("/witnessing", NO_BEAT),
  act("/act1-ladder", 1),
  act("/act3-ladder", 3),
  act("/act6-ladder", 6),
  act("/act7-ladder", 7),
  act("/act4-match", 4),
  act("/act4-prisoner", 4),
  act("/act1-c4-trial", 1),
  util("/dev/variants"),
  util("/dev/guild-cutscenes"),
  orphan("/cross-game-threads", NO_BEAT),
  phase("/loredex/dreamer-fragments", 1, "apps/shared/featureRoadmap.ts", "server-gated on Vision 3 receipt"),
  open("/loredex"),
  open("/loredex/graph"),
  open("/loredex/clusters"),
  orphan("/loredex/investigation", NO_BEAT),
  open("/characters/canon"),
  act("/act2-interlude", 2),
  act("/act2-opening", 2),
  orphan("/engineers-bench", NO_BEAT),
  orphan("/hellbox", "Hellbox Portal — no narrative entry point (CONNECTION_AUDIT critical orphan)"),
  phase("/matrix/:episodeId", 1, "apps/shared/episodeMysteries.ts", "Matrix School episodes"),
  orphan("/mol-garath-audience", NO_BEAT),
  orphan("/mol-garath-traps", NO_BEAT),
  orphan("/conspiracy-board", NO_BEAT),
  feat("/game-masters-arena", "gamemasters_arena", { act: 2 }),
  act("/act5-interlude", 5),
  orphan("/bridge-of-kael", NO_BEAT),
  orphan("/vortex-incursion", "Vortex incursion — canon-pending until vortexTerminusCanon (PR-22)"),
  feat("/trade-empire/hub", "trade_empire", { sagaPhase: 5 }),
  feat("/trade-empire", "trade_empire", { sagaPhase: 5 }),
  feat("/court", "trade_empire", { sagaPhase: 5 }),
  orphan("/war-map", NO_BEAT),
  open("/deck-builder"),
  feat("/create-citizen", "cryo_bay", { sagaPhase: 1 }),
  feat("/character-sheet", "character_sheet", { sagaPhase: 1 }),
  orphan("/ideology", NO_BEAT),
  feat("/pet-battles", "pet_battles", { sagaPhase: 1 }),
  orphan("/apprentice", NO_BEAT),
  orphan("/apprentice/pedagogy", NO_BEAT),
  orphan("/ship/bunkroom", NO_BEAT),
  orphan("/berth/:memberId", NO_BEAT),
  orphan("/common-room", NO_BEAT),
  orphan("/academy", NO_BEAT),
  orphan("/house-cup", NO_BEAT),
  orphan("/purge", NO_BEAT),
  orphan("/cohort", NO_BEAT),
  orphan("/nemeses", NO_BEAT),
  open("/systems-library"),
  orphan("/legion-map", NO_BEAT),
  feat("/transmissions", "observation_deck_music", { sagaPhase: 1 }),
  phase("/antiquarian-journal", 1, "apps/shared/antiquarianLoredexBridges.ts"),
  phase("/antiquarian-index", 1, "apps/shared/antiquarianLoredexBridges.ts"),
  util("/dlc"),
  orphan("/legion", NO_BEAT),
  feat("/research-lab", "crafting", { sagaPhase: 1 }),
  orphan("/forge", NO_BEAT),
  open("/discography"),
  open("/saga-timeline"),
  open("/favorites"),
  orphan("/quiz", NO_BEAT),
  open("/codex"),
  open("/civilopedia"),
  open("/store"),
  feat("/battle", "dischordia", { sagaPhase: 1 }),
  open("/card-gallery"),
  open("/profile"),
  open("/leaderboard"),
  orphan("/boss-battle", NO_BEAT),
  orphan("/card-challenge", "Card Challenge — no narrative entry point (CONNECTION_AUDIT critical orphan)"),
  feat("/conexus-portal", "conexus_portal", { sagaPhase: 2 }),
  open("/achievements"),
  orphan("/cases", NO_BEAT),
  util("/admin"),
  util("/admin/health"),
  util("/admin/pvp"),
  util("/architect-console"),
  phase("/architect/dossier", 6, SAGA, "server-gated identity reveal"),
  phase("/dreamer/dossier", 1, SAGA, "server-gated on Vision 3 receipt"),
  phase("/architect", 6, SAGA, "liminal cryptic transcript"),
  phase("/dreamer", 1, SAGA, "liminal vision fragment"),
  open("/hierarchy"),
  orphan("/demon-packs", "Demon Summoning — no narrative entry point (CONNECTION_AUDIT critical orphan)"),
  orphan("/fight-leaderboard", NO_BEAT),
  orphan("/pvp", "PvP Arena — no narrative entry point (CONNECTION_AUDIT critical orphan)"),
  orphan("/titles", NO_BEAT),
  orphan("/conspiracy", "Conspiracy Boards — no narrative entry point (CONNECTION_AUDIT critical orphan)"),
  orphan("/guild-hall", NO_BEAT),
  orphan("/pvp-variants", NO_BEAT),
  feat("/coop", "incursions", { sagaPhase: 3 }),
  orphan("/draft", NO_BEAT),
  orphan("/trading", NO_BEAT),
  orphan("/card-achievements", NO_BEAT),
  util("/settings"),
  orphan("/clue-journal", "Mystery Engine clue journal — no narrative entry point (CONNECTION_AUDIT critical orphan)"),
  orphan("/research-minigame", NO_BEAT),
  orphan("/morality-census", NO_BEAT),
  feat("/companions", "companion_selection", { sagaPhase: 1 }),
  orphan("/fleet", NO_BEAT),
  orphan("/diplomacy", NO_BEAT),
  orphan("/faction-wars", NO_BEAT),
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
  orphan("/self-portrait", NO_BEAT),
  phase("/oracle", 4, "apps/shared/prophecyTarotCanon.ts", "the Dischordian Tarot archive — bound to the Seal/Prophecy/Seer spine (PR-19)"),
  orphan("/imprints", "Imprint Gallery — no narrative entry point; rebinds to imprintSummoningCanon (CONNECTION_AUDIT critical orphan)"),
  feat("/duelyst-play", "dischordia", { sagaPhase: 1 }),
  orphan("/spectate", NO_BEAT),
  feat("/gamemasters-arena", "gamemasters_arena", { act: 2 }),
  orphan("/palimpsest", "Palimpsest episodes — no narrative entry point (CONNECTION_AUDIT critical orphan)"),
  feat("/casino", "casino", { sagaPhase: 5 }),
  feat("/casino/leaderboard", "casino", { sagaPhase: 5 }),
  feat("/casino/tournament", "casino", { sagaPhase: 5 }),
  feat("/circuit", "dead_mans_circuit", { sagaPhase: 5 }),
  orphan("/cades-fps", NO_BEAT),
  orphan("/signal-decryption", NO_BEAT),
  orphan("/star-chart", NO_BEAT),
  orphan("/hacking", NO_BEAT),
  orphan("/specimens", NO_BEAT),
  feat("/bestiary", "bestiary", { sagaPhase: 1 }),
  feat("/bounties", "bounties", { sagaPhase: 1 }),
  open("/messages"),
  feat("/alliance-war", "alliance_war", { sagaPhase: 3 }),
  orphan("/space-station", NO_BEAT),
  orphan("/syndicate-world", NO_BEAT),
  orphan("/tower-defense", NO_BEAT),
  feat("/prestige-quests", "prestige", { sagaPhase: 13 }),
  feat("/prestige-cycle", "prestige", { sagaPhase: 13 }),
  orphan("/competitive-arena", "Competitive Arena — no narrative entry point (CONNECTION_AUDIT critical orphan)"),
  open("/seasonal-events"),
  open("/replays"),
  orphan("/personal-quarters", NO_BEAT),
  orphan("/friendly-challenges", NO_BEAT),
  feat("/coop-raids", "incursions", { sagaPhase: 3 }),
  orphan("/boss-mastery", "Boss Mastery — no narrative entry point (CONNECTION_AUDIT critical orphan)"),
  open("/cosmetic-shop"),
  open("/cosmetic-catalog"),
  util("/donations"),
  orphan("/lions-club/apply", NO_BEAT),
  orphan("/order-of-the-dreamer", NO_BEAT),
  open("/social"),
  orphan("/roleplay", NO_BEAT),
  orphan("/dossier/:userId", NO_BEAT),
  orphan("/user-tomes", NO_BEAT),
  open("/lore-journal"),
  orphan("/army", NO_BEAT),
  phase("/awakening", 1, SAGA, "Phase 1 — Awakening"),
  orphan("/memorial-corridor", NO_BEAT),
  orphan("/pet-garden", NO_BEAT),
  feat("/character-creation", "cryo_bay", { sagaPhase: 1 }),
  util("/terms"),
  util("/privacy"),
  util("/cookies"),
  open("/planets"),
  open("/suit-gallery"),
  orphan("/governance", "Governance Hub — no narrative entry point; the post-Act-7 continuing-loop vote surface (CONNECTION_AUDIT critical orphan)"),
  open("/world-tapestry"),
  orphan("/soul-stones", NO_BEAT),
  orphan("/christmas-in-july", "seasonal casino event — no narrative entry point"),
  orphan("/cabin", NO_BEAT),
  excluded("/404", "the not-found shell — not a player surface"),
];

/** Look up a surface by its exact App.tsx path literal. */
export function getSurfaceEntry(route: string): SurfaceEntry | undefined {
  return SURFACE_REGISTRY.find((e) => e.route === route);
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
