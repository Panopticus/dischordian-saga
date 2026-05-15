/* ═══════════════════════════════════════════════════════
   GAME-MODE NARRATIVE PREMISES — build-plan §VIII Phase F
   ("System narrative-premise wiring: every game mode has
   its diegetic 'why'.")

   The saga's premise canon was, before PR-14, scattered
   across per-system modules (casinoHeistCanon.ts,
   deadMansCircuit.ts, hellboxPortal.ts,
   conspiracyBoardRevelations.ts, the CADES mission shells,
   the Mystery Engine roster, etc.) with no single surface
   asserting that EVERY player-facing game mode has a
   recorded in-fiction reason the player is engaging it.

   This registry is that surface. Each entry binds a game
   mode to:
     - its diegetic "why" (the in-fiction reason the player
       plays it — NOT the gameplay description),
     - the canon module that anchors that why,
     - a canonStatus.

   The parity gate
   (apps/shared/_completeness/checks/gameModeNarrativePremiseCoverage.ts)
   asserts every entry has a non-empty premiseSourceModule.
   Hard parity — a game mode with no diegetic reason to
   exist is a Phase F failure.

   Three Phase F gaps are gap-filled by this PR (canonStatus
   "reconciled_pr14"): F2 (chess ↔ Game Master rules-layer),
   F7 (Trade Empire reconnaissance premise + Eyes-video
   production-pending hook), F10 (Apprentice Mentor Loop
   premise — the loop is canonically shadowed by the
   Politician's secret-apprentice lineage).
   ═══════════════════════════════════════════════════════ */

export type GameModePremiseStatus =
  /** Premise canon already existed in a dedicated module before PR-14. */
  | "anchored"
  /** Premise gap-filled / reconciled by PR-14 (Phase F). */
  | "reconciled_pr14"
  /** Premise canon exists but a referenced asset is production-pending. */
  | "production_pending";

export interface GameModePremise {
  /** Stable id. */
  id: string;
  /** Display name. */
  name: string;
  /**
   * The diegetic "why" — the in-fiction reason the player is
   * engaging this mode. NOT a gameplay description. One or two
   * sentences, present-tense, canon-voiced.
   */
  diegeticWhy: string;
  /**
   * The canon module (or modules) that anchor the premise.
   * MUST be non-empty for the parity gate to pass.
   */
  premiseSourceModule: string;
  /** Canon status. */
  canonStatus: GameModePremiseStatus;
  /** Optional canon-note (reconciliations, production-pending, caveats). */
  canonNote?: string;
}

export const GAME_MODE_PREMISES: readonly GameModePremise[] = [
  /* ─── Anchored before PR-14 (premise modules already shipped) ─── */
  {
    id: "tcg_dischordia",
    name: "Dischordia (the TCG)",
    diegeticWhy:
      "You are not playing a card game. You are summoning consciousness-" +
      "imprints the Game Master archived in the Matrix of Dreams; every " +
      "duel is a re-play of an archived mind the Hierarchy once funded.",
    premiseSourceModule:
      "apps/shared/tcg-core/* (imprint-summoning canon) + the build " +
      "plan §VI.1 + Phase J scope",
    canonStatus: "anchored",
    canonNote:
      "The universal-combat-canon frame; per the build plan §X.9 the " +
      "Matrix-archive premise applies to the imprint-faction surface. " +
      "Phase J carries the per-card cutscene wiring; the PREMISE itself " +
      "is anchored here.",
  },
  {
    id: "casino",
    name: "The Degen's Casino",
    diegeticWhy:
      "The Degen inherited the Trickster's intergalactic casino as the " +
      "prize of the Casino Heist. You gamble at the edge of the Dreamer's " +
      "Shield because the house is a Ne-Yon and the game is how he reads you.",
    premiseSourceModule: "apps/shared/casinoHeistCanon.ts",
    canonStatus: "anchored",
  },
  {
    id: "dead_mans_circuit",
    name: "Dead Man's Circuit",
    diegeticWhy:
      "You race bone-tracks built from the remains of dead clones, " +
      "narrated by Nilmorg, because in a saga where bodies are disposable " +
      "the kart season is the most honest accounting of what disposability " +
      "costs.",
    premiseSourceModule: "apps/shared/deadMansCircuit.ts",
    canonStatus: "anchored",
  },
  {
    id: "hellbox",
    name: "Hellbox / Resurrection Protocols",
    diegeticWhy:
      "The Hellbox is the neural-lattice kernel wired into the cloning " +
      "pod — a portal into the Matrix of Dreams. You enter it because it " +
      "is the Advocate's path in miniature: every descent is a small " +
      "Blood-Weave bargain.",
    premiseSourceModule: "apps/shared/hellboxPortal.ts",
    canonStatus: "anchored",
  },
  {
    id: "conspiracy_boards",
    name: "Conspiracy Boards",
    diegeticWhy:
      "The Editor sealed memories out of the saga's record. Each of the " +
      "seven boards you solve unseals a memory-locked cutscene and a Soul " +
      "Stone manifestation — you investigate because the truth was " +
      "redacted and the boards are how it is un-redacted.",
    premiseSourceModule: "apps/shared/conspiracyBoardRevelations.ts",
    canonStatus: "anchored",
    canonNote:
      "7 boards mapped to cutscene unlocks + Soul Stone manifestations. " +
      "The Antiquarian-Library soul-stone surface wiring is the Phase F9 " +
      "follow-on; the PREMISE is anchored.",
  },
  {
    id: "cades_fps",
    name: "CADES FPS",
    diegeticWhy:
      "The Iron Lion's last campaign, run as a Godot iframe: seven " +
      "missions (M1 Scout's Gambit → M7 Iron Lion's Last Stand). You play " +
      "it because the saga's military spine is a campaign that ends in a " +
      "mandatory death you cannot prevent — only witness.",
    premiseSourceModule: "apps/shared/actsFourFiveShells.ts (CADES_FPS_MISSIONS)",
    canonStatus: "anchored",
    canonNote:
      "Canon ships M1-M7. The build plan §VIII Phase F3 said 'M1-M8' — " +
      "M8 is NOT canonical; M7 (Iron Lion's Last Stand, mandatory_death) " +
      "is the arc-terminal beat. The plan overcounted by one; the canon " +
      "stops at M7 by design and this entry records that as the resolved " +
      "state, not a gap.",
  },
  {
    id: "loredex",
    name: "The Loredex",
    diegeticWhy:
      "The Antiquarian's database. You read it because the Antiquarian " +
      "is one of the Two Witnesses and the Loredex is the part of his " +
      "chronicle he lets you walk yourself.",
    premiseSourceModule:
      "apps/shared/antiquarianLoredexBridges.ts + transmissionLoredexUnlocks.ts",
    canonStatus: "anchored",
  },
  {
    id: "mystery_engine",
    name: "The Mystery Engine",
    diegeticWhy:
      "Ten authored investigative arcs (the_watcher … fenra). You solve " +
      "them because the Two Witnesses record what you deduce, and the " +
      "saga's canon is partly written by which readings you file.",
    premiseSourceModule:
      "apps/shared/episodeMysteries.ts + _completeness/checks/mysteryEngineRosterCoverage.ts",
    canonStatus: "anchored",
  },
  {
    id: "tower_defense",
    name: "Tower Defense (Terminus Swarm)",
    diegeticWhy:
      "You hold the line against the Terminus Swarm because each wave " +
      "carries a Kael Fragment — the Source's dispersed self, testing " +
      "whether the line that failed him will hold for anyone.",
    premiseSourceModule: "apps/shared/wovenSystems/registry.ts (tower_defense) + build plan §VI.6",
    canonStatus: "anchored",
  },
  {
    id: "governance_hub",
    name: "The Governance Hub (CoNexus)",
    diegeticWhy:
      "You vote at the Hub because the constructed CoNexus the Architect " +
      "dismantled left a governance shell, and the saga's nexus-point " +
      "decisions are how the playerbase fills it.",
    premiseSourceModule: "apps/shared/wovenSystems/registry.ts (governance) + apps/shared/conexusCanon.ts",
    canonStatus: "anchored",
  },
  {
    id: "demon_summoning",
    name: "Demon Summoning",
    diegeticWhy:
      "You summon Hierarchy demons because the Hierarchy operates by " +
      "contract — every summon is a clause, and the contract canon " +
      "(Mol'Garath's quarterly review) means the demon you call owes " +
      "exactly what was signed and not one clause more.",
    premiseSourceModule: "apps/shared/wovenSystems/registry.ts (demon_summoning) + apps/shared/hierarchyCanon.ts",
    canonStatus: "anchored",
  },

  /* ─── Reconciled by PR-14 (Phase F gap-fills) ─── */
  {
    id: "chess",
    name: "Chess (The Architect's Gambit, on the Game Master's rules-layer)",
    diegeticWhy:
      "You play on the Architect's board but under the Game Master's " +
      "rules-layer. The Architect designed the variant as an educational " +
      "instrument; the Game Master authored the meta-rules it runs on — " +
      "the same discipline with which he authored the Matrix of Dreams. " +
      "Every game is the Architect's lesson played inside the Game " +
      "Master's system.",
    premiseSourceModule:
      "apps/shared/featureRoadmap.ts:80-82 (The Architect's Gambit) + " +
      "apps/shared/archonCanon.ts:the_game_master (A10 — Puzzles, " +
      "strategy, the Matrix of Dreams, reality games)",
    canonStatus: "reconciled_pr14",
    canonNote:
      "Phase F2. Prior canon named chess 'The Architect's Gambit' (the " +
      "board + variant — the Architect's) with no Game-Master binding. " +
      "PR-14 reconciles WITHOUT contradiction (the dual-canon pattern " +
      "used for the Politician's destruction): the Architect owns the " +
      "BOARD and the variant's pedagogy; the Game Master owns the " +
      "RULES-LAYER (the meta-system the variant runs on), exactly as he " +
      "owns the Matrix of Dreams' rules. Both are true. Authoring that " +
      "makes chess solely the Architect's OR solely the Game Master's " +
      "violates this reconciliation.",
  },
  {
    id: "trade_empire",
    name: "Trade Empire",
    diegeticWhy:
      "You run Locke-sanctioned trade missions because the cycle is a " +
      "perfect operational reconnaissance loop — the Ocularum reads the " +
      "galaxy through your commerce. You think you are trading. You are " +
      "the Eyes' instrument.",
    premiseSourceModule:
      "apps/shared/episodeMysteries.ts (the_watcher arc — Locke's " +
      "reconnaissance-cycle canon) + apps/shared/wovenSystems/registry.ts (trade_empire)",
    canonStatus: "reconciled_pr14",
    canonNote:
      "Phase F7. The reconnaissance PREMISE is now bound to the " +
      "the_watcher arc's canonical reading (the seven Locke trade " +
      "missions are an Ocularum recon cycle). The 'Eyes Music Video " +
      "unlock' side-deliverable is PRODUCTION-PENDING — wired here as " +
      "a premise note, not a feature gate, mirroring the wbg-01 / " +
      "Ocularum-video production-pending pattern. When the Eyes video " +
      "producer drop lands, its canonical placement is Trade-Empire " +
      "reconnaissance-cycle completion.",
  },
  {
    id: "apprentice_mentor_loop",
    name: "The Apprentice Mentor Loop",
    diegeticWhy:
      "You mentor an apprentice through the 12-archetype 28-day trial " +
      "because the Mechronis Academy trial cadence is the saga's " +
      "inheritance ritual — and because every cohort is shadowed by the " +
      "Politician's secret-apprentice lineage (the Nemesis). You train a " +
      "successor; the Politician, dead, trains yours' rival.",
    premiseSourceModule:
      "apps/shared/apprenticeDoctrines.ts + apps/shared/nemesisSystem.ts + " +
      "apps/shared/episodeMysteries.ts (the_politician arc — the " +
      "insurance-policy lineage)",
    canonStatus: "reconciled_pr14",
    canonNote:
      "Phase F10. The loop had pedagogical-doctrine canon but no " +
      "explicit diegetic 'why you play this'. PR-14 binds the premise " +
      "to (a) the Mechronis trial cadence (the inheritance ritual) and " +
      "(b) the Politician's secret-apprentice canon from the the_politician " +
      "arc (PR-11) — the loop is canonically a mirror: you train a " +
      "successor while the Politician's insurance policy trains its " +
      "adversary against you. The premise is the doubling.",
  },
] as const;

/** Coverage metric for the parity gate. */
export function getGameModePremiseCoverage(): {
  declared: number;
  withPremise: number;
} {
  return {
    declared: GAME_MODE_PREMISES.length,
    withPremise: GAME_MODE_PREMISES.filter(
      (m) => m.premiseSourceModule.trim().length > 0 && m.diegeticWhy.trim().length > 0,
    ).length,
  };
}

/** Look up a game mode's premise by id. */
export function getGameModePremise(id: string): GameModePremise | undefined {
  return GAME_MODE_PREMISES.find((m) => m.id === id);
}
