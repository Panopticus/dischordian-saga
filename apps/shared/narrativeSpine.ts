/**
 * The narrative spine — one living-universe through-line.
 *
 * Design contract (owner-locked): the game is "open but guided," with
 * the narrative of *the Potential* — waking up and discovering an
 * ever-expanding living universe — at its core. The story IS the
 * connective layer: every system is REVEALED diegetically, by an
 * in-fiction carrier, at a canonical point on the saga's phase spine.
 *
 * This module is the single source of truth that joins three already-
 * shipped substrates that previously did not reference each other:
 *
 *   - apps/shared/gameModeNarrativePremises.ts  — the 14 canon "why you
 *     play this" premises (the systems).
 *   - apps/shared/sagaPhases.ts                 — the 0..14 phase spine
 *     (the trunk; each phase carries an actRange + triggerFlag).
 *   - apps/shared/surfaceDiscoverabilityCanon.ts — the per-surface gate
 *     bindings (sagaPhase / act / gameModePremiseId), already at
 *     0-orphan hard parity.
 *
 * NO CANON IS INVENTED HERE. Every beat's `sagaPhase` is the phase the
 * shipped surface-discoverability gate already binds that mode to; the
 * `carrier` and `diegeticReveal` are paraphrases of the mode's own
 * `diegeticWhy`; `premiseSourceModule` is carried through unchanged so
 * the chain back to canon is auditable.
 *
 * The parity gate (apps/shared/_completeness/checks/narrativeSpineCoverage.ts)
 * is HARD PARITY: every GAME_MODE_PREMISES id MUST be revealed by
 * exactly one spine beat. A system not on the spine is orphaned from
 * the story — the exact failure this work exists to eliminate.
 */
import {
  GAME_MODE_PREMISES,
  getGameModePremise,
} from "./gameModeNarrativePremises";
import { SAGA_PHASES, type SagaPhase } from "./sagaPhases";

/**
 * The in-fiction voice that walks the player into a system. Each maps
 * to an existing diegetic-delivery surface (Elara's prelude script,
 * Locke's inbox bridges, the Antiquarian's Loredex bridges, companion
 * banter, or an act/episode cutscene). Mechanical unlock toasts are
 * NEVER a carrier — the player experiences progression as story.
 */
export type SpineCarrier =
  | "elara_prelude"
  | "locke"
  | "antiquarian"
  | "companion"
  | "cutscene";

export interface SpineBeat {
  /** Stable id. snake_case. */
  id: string;
  /**
   * The phase the player is in when this system is revealed. MUST be a
   * registered SAGA_PHASES phase. The act is DERIVED from that phase's
   * actRange (never stored — avoids drift / invented canon).
   */
  sagaPhase: SagaPhase;
  /** The GAME_MODE_PREMISES id this beat reveals. MUST resolve. */
  revealsPremiseId: string;
  /**
   * The canonical player-facing entry route for this system. Sourced
   * from the shipped GAME_MODE_PREMISES surface routes — surface-
   * discoverability classifies most mode surfaces by featureRoadmap/
   * phase rather than gameModePremiseId, so the premise→route link is
   * declared HERE (one canonical door per system) instead of inferred.
   */
  entryRoute: string;
  /** Which in-fiction voice delivers the reveal. */
  carrier: SpineCarrier;
  /**
   * One-line, present-tense, canon-voiced reveal — a paraphrase of the
   * premise's own diegeticWhy, framed as the moment the universe widens.
   */
  diegeticReveal: string;
  /**
   * Is engaging this a mandatory trunk step (the Potential's main pull)
   * or an open-but-guided wing the living world escalates toward but
   * the player takes at their own pace?
   */
  spineRole: "trunk" | "wing";
}

/**
 * The spine. Ordered by sagaPhase. Every one of the 14 canon premises
 * is bound to exactly one beat — the gate enforces this.
 *
 * sagaPhase values are the SHIPPED surface-discoverability gate bindings
 * (see surfaceDiscoverabilityCanon.ts), consolidated here so the
 * connective layer has one ordered reading instead of three unjoined
 * ones.
 */
export const NARRATIVE_SPINE: readonly SpineBeat[] = [
  {
    id: "spine_loredex_awakening",
    sagaPhase: 0,
    revealsPremiseId: "loredex",
    entryRoute: "/loredex",
    carrier: "antiquarian",
    diegeticReveal:
      "The Potential wakes. The Antiquarian — one of the Two Witnesses — " +
      "opens the part of his chronicle you may walk yourself.",
    spineRole: "wing",
  },
  {
    id: "spine_tcg_tribunal",
    sagaPhase: 1,
    revealsPremiseId: "tcg_dischordia",
    entryRoute: "/cards/play",
    carrier: "cutscene",
    diegeticReveal:
      "The Tribunal convenes. Every duel is a re-play of a mind the " +
      "Game Master archived in the Matrix of Dreams — this is the trunk.",
    spineRole: "trunk",
  },
  {
    id: "spine_chess_gambit",
    sagaPhase: 1,
    revealsPremiseId: "chess",
    entryRoute: "/chess",
    carrier: "companion",
    diegeticReveal:
      "The Architect's board is set on the Game Master's rules-layer; " +
      "the variant is a lesson played inside the system that authored it.",
    spineRole: "wing",
  },
  {
    id: "spine_mystery_two_witnesses",
    sagaPhase: 2,
    revealsPremiseId: "mystery_engine",
    entryRoute: "/clue-journal",
    carrier: "antiquarian",
    diegeticReveal:
      "Ten investigative arcs open. The Two Witnesses record what you " +
      "deduce — the canon is partly written by which readings you file.",
    spineRole: "wing",
  },
  {
    id: "spine_hellbox_descent",
    sagaPhase: 3,
    revealsPremiseId: "hellbox",
    entryRoute: "/hellbox",
    carrier: "cutscene",
    diegeticReveal:
      "The cloning-pod lattice opens a portal into the Matrix of Dreams: " +
      "the Advocate's path in miniature, every descent a Blood-Weave bargain.",
    spineRole: "wing",
  },
  {
    id: "spine_demon_contract",
    sagaPhase: 3,
    revealsPremiseId: "demon_summoning",
    entryRoute: "/demon-packs",
    carrier: "cutscene",
    diegeticReveal:
      "The Hierarchy answers by contract. Every summon is a clause; the " +
      "demon owes exactly what was signed and not one clause more.",
    spineRole: "wing",
  },
  {
    id: "spine_apprentice_inheritance",
    sagaPhase: 3,
    revealsPremiseId: "apprentice_mentor_loop",
    entryRoute: "/apprentice",
    carrier: "companion",
    diegeticReveal:
      "The Mechronis trial cadence begins — you train a successor while " +
      "the Politician's dead insurance policy trains your rival's.",
    spineRole: "wing",
  },
  {
    id: "spine_conspiracy_unredaction",
    sagaPhase: 4,
    revealsPremiseId: "conspiracy_boards",
    entryRoute: "/conspiracy-board",
    carrier: "cutscene",
    diegeticReveal:
      "The Editor sealed memories out of the record. Each board you " +
      "solve un-redacts a memory-locked cutscene and a Soul Stone.",
    spineRole: "wing",
  },
  {
    id: "spine_trade_recon_cycle",
    sagaPhase: 5,
    revealsPremiseId: "trade_empire",
    entryRoute: "/trade-empire",
    carrier: "locke",
    diegeticReveal:
      "Locke sanctions your trade missions. You think you are trading; " +
      "the Ocularum reads the galaxy through your commerce.",
    spineRole: "wing",
  },
  {
    id: "spine_casino_edge",
    sagaPhase: 5,
    revealsPremiseId: "casino",
    entryRoute: "/casino",
    carrier: "companion",
    diegeticReveal:
      "The Degen's inherited casino opens at the edge of the Dreamer's " +
      "Shield — the house is a Ne-Yon and the game is how he reads you.",
    spineRole: "wing",
  },
  {
    id: "spine_circuit_accounting",
    sagaPhase: 5,
    revealsPremiseId: "dead_mans_circuit",
    entryRoute: "/circuit",
    carrier: "cutscene",
    diegeticReveal:
      "Nilmorg narrates a season raced on bone-tracks built from dead " +
      "clones — the most honest accounting of what disposability costs.",
    spineRole: "wing",
  },
  {
    id: "spine_cades_last_campaign",
    sagaPhase: 8,
    revealsPremiseId: "cades_fps",
    entryRoute: "/cades-fps",
    carrier: "cutscene",
    diegeticReveal:
      "The Iron Lion's last campaign — seven missions ending in a " +
      "mandatory death you cannot prevent, only witness.",
    spineRole: "trunk",
  },
  {
    id: "spine_tower_terminus_line",
    sagaPhase: 12,
    revealsPremiseId: "tower_defense",
    entryRoute: "/tower-defense",
    carrier: "cutscene",
    diegeticReveal:
      "You hold the line against the Terminus Swarm; each wave carries a " +
      "Kael Fragment, testing whether the line that failed him holds.",
    spineRole: "wing",
  },
  {
    id: "spine_governance_shell",
    sagaPhase: 13,
    revealsPremiseId: "governance_hub",
    entryRoute: "/governance",
    carrier: "cutscene",
    diegeticReveal:
      "The Architect's dismantling of the constructed CoNexus left a " +
      "governance shell — the saga's nexus decisions are how you fill it.",
    spineRole: "wing",
  },
] as const;

/** Derive the act a beat lands in from its phase's actRange. */
export function actForBeat(beat: SpineBeat): number {
  const phase = SAGA_PHASES.find((p) => p.phase === beat.sagaPhase);
  return phase ? phase.actRange.min : -1;
}

/** Coverage metric for the parity gate. */
export function getNarrativeSpineCoverage(): {
  declared: number;
  bound: number;
} {
  const boundPremiseIds = new Set(
    NARRATIVE_SPINE.filter(
      (b) =>
        getGameModePremise(b.revealsPremiseId) !== undefined &&
        SAGA_PHASES.some((p) => p.phase === b.sagaPhase),
    ).map((b) => b.revealsPremiseId),
  );
  return {
    declared: GAME_MODE_PREMISES.length,
    bound: GAME_MODE_PREMISES.filter((m) => boundPremiseIds.has(m.id)).length,
  };
}

/**
 * Structural problems that make a beat non-canonical (unresolvable
 * premise, unregistered phase, or a premise revealed by 0 or >1 beats).
 */
export function getNarrativeSpineDefects(): string[] {
  const out: string[] = [];
  for (const b of NARRATIVE_SPINE) {
    if (!getGameModePremise(b.revealsPremiseId)) {
      out.push(
        `beat '${b.id}' reveals premise '${b.revealsPremiseId}' which is ` +
          `not in GAME_MODE_PREMISES`,
      );
    }
    if (!SAGA_PHASES.some((p) => p.phase === b.sagaPhase)) {
      out.push(
        `beat '${b.id}' sagaPhase ${b.sagaPhase} is not a registered ` +
          `SAGA_PHASES phase`,
      );
    }
  }
  for (const m of GAME_MODE_PREMISES) {
    const beats = NARRATIVE_SPINE.filter((b) => b.revealsPremiseId === m.id);
    if (beats.length === 0) {
      out.push(
        `system '${m.id}' (${m.name}) is ORPHANED FROM THE SPINE — no ` +
          `beat reveals it; the story never walks the player into it`,
      );
    } else if (beats.length > 1) {
      out.push(
        `system '${m.id}' (${m.name}) is revealed by ${beats.length} beats ` +
          `(${beats.map((b) => b.id).join(", ")}) — a system must enter ` +
          `the story at exactly one canonical point`,
      );
    }
  }
  return out;
}

/**
 * Render the mode↔act coherence matrix (the source for
 * docs/built/SAGA_GAME_MODE_COHERENCE.md). Pure — the drift test and
 * the doc are generated from this so they can never disagree.
 */
export function renderCoherenceMatrix(): string {
  const rows = [...NARRATIVE_SPINE]
    .slice()
    .sort((a, b) => a.sagaPhase - b.sagaPhase)
    .map((b) => {
      const m = getGameModePremise(b.revealsPremiseId);
      const act = actForBeat(b);
      return `| ${b.sagaPhase} | ${act} | ${m?.name ?? b.revealsPremiseId} | \`${b.entryRoute}\` | ${b.spineRole} | ${b.carrier} | ${b.diegeticReveal} |`;
    });
  return [
    "<!-- GENERATED from apps/shared/narrativeSpine.ts — do not edit by hand.",
    "     Regenerate: pnpm tsx apps/scripts/gen-saga-mode-coherence.ts -->",
    "",
    "# Saga ↔ Game-Mode Coherence",
    "",
    "Every game mode enters the story at exactly one canonical phase, via",
    "an in-fiction carrier. No mode surfaces lore out of its act. This",
    "matrix is generated from the narrative spine; the ship:check gate",
    "`narrative.spine_coverage` enforces that it stays in sync and that",
    "no system is orphaned from the spine.",
    "",
    "| Saga phase | Act | System | Entry route | Spine role | Carrier | Diegetic reveal |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}
