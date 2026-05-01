/* ═══════════════════════════════════════════════════════
   MYSTERY TEMPLATES — vote-seed compilers

   When an epoch witness vote closes (cron fires on
   epoch_vote_tallies.expiresAt), the winning option's
   `consequence` text is parsed into a `MysterySeed`. This
   module compiles each seed into a concrete `MysteryDefinition`
   that lives in the runtime registry alongside authored arcs.

   Architecture (per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md
   §10):

     epoch_vote_tallies.expiresAt fires
       → mysteryClosureCron picks the row
       → seedFromVoteClosure(voteId, winningOption) → MysterySeed
       → compileMysterySeed(seed) → MysteryDefinition
       → mysteryService.openCase(eligible players, definition.id)

   Templates are deterministic — the same seed compiles to the
   same definition, every time. This is load-bearing for replay
   and for the "every player gets the same authored frame from
   a community vote" guarantee.

   No DB access here — pure compilation.
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId,
  ChoiceId,
  ClueId,
  DeductionId,
  EpisodeDefinition,
  EpisodeId,
  LensId,
  MysteryDefinition,
  MysteryId,
  MysterySeed,
} from "./mysteryTypes";

/* ─── TEMPLATE IDS ─── */

/** Stable string ids for compiler lookup. Each id maps to one
 *  function in MYSTERY_TEMPLATES. Templates are append-only —
 *  adding a new compiler is additive; renaming an existing one
 *  breaks every seed already persisted with the old id. */
export const TEMPLATE_VOTE_RESOLUTION_SHORT = "vote_resolution_short";
export const TEMPLATE_NPC_ARC_TRIGGER       = "npc_arc_trigger";

/** Compile contract — one function per template id. Pure: same
 *  seed produces the same definition. */
export interface MysteryTemplate {
  /** Stable template id. Stored on the seed; the cron looks
   *  it up here at compile time. */
  id: string;
  /** Author-facing summary of what this template produces. */
  description: string;
  /** Compile a seed into a runtime mystery definition. Returns
   *  null when the seed payload is malformed for this template
   *  — the cron treats null as "skip and log" (no crash). */
  compile: (seed: MysterySeed) => MysteryDefinition | null;
}

/* ─── HELPERS ─── */

/** Produce a `MysterySeed` from a closed-vote tally. The seed
 *  is what the cron persists and what `compileMysterySeed`
 *  reads back. */
export function seedFromVoteClosure(
  voteId: string,
  winningOption: string,
  templateId: string,
  payload: Readonly<Record<string, unknown>> = {},
): MysterySeed {
  return {
    source: "epoch_vote_closure",
    seedId: `epoch_vote_closure.${voteId}.${winningOption}`,
    templateId,
    payload: { ...payload, voteId, winningOption },
  };
}

/** Produce a `MysterySeed` for an NPC arc handoff. Used when
 *  the engine wants to wrap an authored arc (Wraith, Jericho,
 *  etc.) in the same `MysterySeed → MysteryDefinition` plumbing
 *  the cron uses, so vote-spawned and authored arcs flow through
 *  one path. */
export function seedFromNpcArc(
  arcId: ArcId,
  authoredMysteryId: MysteryId,
): MysterySeed {
  return {
    source: "npc_arc",
    seedId: `npc_arc.${arcId}.${authoredMysteryId}`,
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { arcId, authoredMysteryId },
  };
}

/* ─── INTERNAL — short-form vote-resolution episode ─── */
/* Compiles a single 1-episode mystery from a vote outcome:
   the player investigates the losing option's "what if we'd
   chosen differently" thread. Used as the default short
   compiler when a vote has no bespoke template. */

function buildVoteResolutionEpisode(
  mysteryId: MysteryId,
  voteId: string,
  winningOption: string,
): EpisodeDefinition {
  const baseId = `${mysteryId}.e1`;
  const clueA = `${baseId}.tally_record` as ClueId;
  const clueB = `${baseId}.option_${winningOption}_path` as ClueId;
  return {
    id: baseId as EpisodeId,
    arcId: `arc.vote.${voteId}` as ArcId,
    ordinal: 1,
    title: `Vote Resolution — ${voteId}`,
    summary: `The community closed vote ${voteId} on option ${winningOption}. The losing options left visible threads in the Chronicle. Investigate what was set in motion — and what was set aside.`,
    clues: [
      {
        id: clueA,
        title: "Tally Record",
        body: `Vote ${voteId} closed with the community choosing option ${winningOption.toUpperCase()}. The Chronicle records the choice; the Antiquarian's marginalia records the alternative paths.`,
        foundIn: "antiquarian-library",
      },
      {
        id: clueB,
        title: "The Path Taken",
        body: `Per the closing, the path of option ${winningOption.toUpperCase()} is now the canon outcome. Trace the immediate consequences.`,
        foundIn: "comms-array",
      },
    ],
    deductions: [
      {
        id: `${baseId}.d.commit_to_path` as DeductionId,
        clueA,
        clueB,
        result: "correct",
        narrationId: `${baseId}.n.commit_to_path`,
      },
    ],
    choices: [
      {
        id: `${baseId}.c.accept_outcome` as ChoiceId,
        label: "Accept the Chronicle's record.",
        weight: "compliant",
      },
      {
        id: `${baseId}.c.contest_outcome` as ChoiceId,
        label: "Contest the closing — the alternatives still live.",
        weight: "skeptical",
      },
    ],
    contentBundle: {
      songId: `vote.${voteId}.outcome`,
      slideshowId: `vote.${voteId}.outcome`,
      loredexUnlocks: [`event_vote_${voteId}_closed`],
      conspiracyDiscoveries: [`vote_${voteId}_closure`],
      dropAt: "episode_close",
    },
  };
}

const VOTE_LENSES: ReadonlyArray<{ id: LensId; name: string; category: string }> = [
  { id: "lens.neutral" as LensId, name: "Neutral", category: "faction" },
];

/* ─── TEMPLATE IMPLEMENTATIONS ─── */

const voteResolutionShort: MysteryTemplate = {
  id: TEMPLATE_VOTE_RESOLUTION_SHORT,
  description:
    "1-episode interlude compiled from a closed vote. Surfaces the winning option as canon and the losing options as Chronicle marginalia.",
  compile(seed) {
    const voteId = seed.payload["voteId"];
    const winningOption = seed.payload["winningOption"];
    if (typeof voteId !== "string" || typeof winningOption !== "string") return null;
    const mysteryId = `mystery.vote.${voteId}.${winningOption}` as MysteryId;
    const episode = buildVoteResolutionEpisode(mysteryId, voteId, winningOption);
    return {
      id: mysteryId,
      arcId: `arc.vote.${voteId}` as ArcId,
      title: `Vote Resolution — ${voteId}`,
      summary: `Community vote ${voteId} closed on ${winningOption.toUpperCase()}. Investigate the immediate consequences.`,
      seed,
      episodes: [episode],
      suspects: [],
      lenses: VOTE_LENSES,
    };
  },
};

const npcArcTrigger: MysteryTemplate = {
  id: TEMPLATE_NPC_ARC_TRIGGER,
  description:
    "Pass-through compiler for authored NPC arcs. The seed payload references an authored MysteryDefinition by id; this template returns null and lets the runtime fetch the authored definition from episodeMysteries.ts directly. Exists so all flows go through one seed → definition path.",
  compile(_seed) {
    // Authored arcs are read from episodeMysteries.ts by the
    // runtime; this template is a marker, not a builder.
    return null;
  },
};

/* ─── REGISTRY ─── */

const MYSTERY_TEMPLATES: ReadonlyArray<MysteryTemplate> = [
  voteResolutionShort,
  npcArcTrigger,
];

/** Fetch a template by id. Returns null when the id isn't
 *  registered — the cron should log + skip rather than crash. */
export function getMysteryTemplate(id: string): MysteryTemplate | null {
  return MYSTERY_TEMPLATES.find((t) => t.id === id) ?? null;
}

/** Compile a seed into a runtime definition. Returns null when
 *  the template isn't registered or rejects the payload. */
export function compileMysterySeed(seed: MysterySeed): MysteryDefinition | null {
  const template = getMysteryTemplate(seed.templateId);
  if (!template) return null;
  return template.compile(seed);
}

/** Read-only access to the template registry — useful for
 *  test probes and admin inspection. */
export function listMysteryTemplates(): ReadonlyArray<MysteryTemplate> {
  return MYSTERY_TEMPLATES;
}
