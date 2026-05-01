/* ═══════════════════════════════════════════════════════
   MYSTERY ENGINE — pure type primitives

   The Streamed Prism Mystery Engine's authoring-side and
   runtime-side type contract. No runtime, no business logic
   — just the shapes the engine reads against.

   See docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md (§10, §15)
   for the architectural context. The five PR1 entry points
   read these types:
     - episodeMysteries.ts  (canonical authoring surface)
     - mysteryService.ts    (episode lifecycle, deduction)
     - mysteryTemplates.ts  (vote-seed compilers)
     - schema.ts            (durable state floor)
     - roomMysteries/_template.ts  (interrogate verb)
   ═══════════════════════════════════════════════════════ */

/* ─── BRANDED IDS ───
   String-newtypes so a hand-typed clue id can't accidentally
   stand in for an episode id. Authors write the human-readable
   string; TypeScript narrows on assignment. Mirrors the
   `as CardDefinition["id"]` pattern noted in CLAUDE.md.
*/

export type MysteryId   = string & { readonly __brand: "MysteryId" };
export type EpisodeId   = string & { readonly __brand: "EpisodeId" };
export type ClueId      = string & { readonly __brand: "ClueId" };
export type DeductionId = string & { readonly __brand: "DeductionId" };
export type LensId      = string & { readonly __brand: "LensId" };
export type ArcId       = string & { readonly __brand: "ArcId" };
export type ChoiceId    = string & { readonly __brand: "ChoiceId" };
export type SuspectId   = string & { readonly __brand: "SuspectId" };

/* ─── ENUMS ─── */

/** Sherlock-style deduction outcome. `false_lead_named` means
 *  the player paired clues that point at a known false lead —
 *  the game records it and the season-roll-up grades the play.
 *  `nonsense` means the pair has no authored result; runtime
 *  serves a generic "those don't connect" beat. */
export type DeductionResult =
  | "correct"
  | "partial"
  | "false_lead_named"
  | "nonsense";

/** L.A. Noire interrogation micro-signal returned by the
 *  engine when the player presses on an NPC answer. The signal
 *  is hidden from the UI until the player has earned the
 *  `interrogation_lit` flag; before that, the player sees
 *  three undifferentiated tone affordances. */
export type LaNoireSignal = "truth" | "doubt" | "lie";

/** Three affordances offered on every interrogation question.
 *  Authors author per-question variant text per tone — the
 *  engine resolves trust deltas + LaNoireSignal off the tone +
 *  the underlying answer. */
export type ToneId = "press" | "accept" | "challenge";

/** When in the episode beat the song slideshow drops. */
export type ContentDropTiming = "episode_open" | "episode_mid" | "episode_close";

/** Source of a mystery seed — used by `mysteryTemplates.ts`
 *  to compile votes / anniversaries / pattern triggers into
 *  concrete `MysteryDefinition`s. */
export type MysterySeedSource =
  | "epoch_vote_closure"
  | "anniversary"
  | "living_universe_pattern"
  | "npc_arc"
  | "manual";

/* ─── SEED + DEFINITION ─── */

/** Produced when a governance vote closes, an anniversary fires,
 *  or a Living Universe pressure threshold trips. Compiled by
 *  `mysteryTemplates.ts` into a concrete `MysteryDefinition`.
 *  Persisted on `epochVoteTallies.consequence` (when source =
 *  epoch_vote_closure) or on the seasonalEvents row. */
export interface MysterySeed {
  source: MysterySeedSource;
  /** Stable seed id — `<source>.<originId>.<voteOutcomeOrCycle>`. */
  seedId: string;
  /** Which template compiles this seed. Authored alongside the
   *  template in `mysteryTemplates.ts`. */
  templateId: string;
  /** Raw payload passed to the template's compile function.
   *  Schema is template-specific; the template owns the contract. */
  payload: Readonly<Record<string, unknown>>;
}

/** Authored deduction edge: pairing `clueA` with `clueB` (and
 *  optionally `clueC`) yields `result`. `narrationId` keys into
 *  the per-mystery narration manifest. Edges are unordered for
 *  pairs (engine tries both); 3-clue deductions are matched as
 *  unordered triples. */
export interface DeductionGraphEdge {
  id: DeductionId;
  clueA: ClueId;
  clueB: ClueId;
  clueC?: ClueId;
  result: DeductionResult;
  /** Narration manifest key for the runtime's reveal beat. */
  narrationId: string;
  /** When set, this deduction unlocks the named episode (used
   *  to gate critical-path advancement). */
  unlocksEpisode?: EpisodeId;
}

/** Authored suspect graph node. `relations` are stable strings
 *  (`places-at`, `motive-for`, `corroborates`, `contradicts`,
 *  `succession`, `members-of`, `expropriated`, `caught-in`,
 *  `judged-by`, `completes`, `resolves`, `cross-arc-to`).
 *  The engine doesn't enforce a closed enum so per-arc authors
 *  can introduce new edge types as the canon demands. */
export interface SuspectGraphNode {
  id: SuspectId;
  /** Display label. */
  name: string;
  /** Free-form NPC / faction / event tag. */
  type: string;
  /** Outgoing relations to other suspect nodes. */
  relations: ReadonlyArray<{
    to: SuspectId;
    relation: string;
  }>;
}

/** Per-lens overlay. The lens picks one of N narrative framings
 *  (Insurgency reads X as expropriator; Hierarchy reads X as
 *  thief). Authored once per (lens × arc); stored as a delta
 *  per docs/design §14c.8. */
export interface LensDefinition {
  id: LensId;
  /** Display label. */
  name: string;
  /** Faction / class / race the lens corresponds to. */
  category: string;
  /** Per-clue narration overrides keyed by ClueId. Empty means
   *  the lens uses the base narration. */
  clueNarrationOverrides?: Readonly<Record<ClueId, string>>;
  /** Per-deduction narration overrides keyed by DeductionId. */
  deductionNarrationOverrides?: Readonly<Record<DeductionId, string>>;
}

/** Episode-close content bundle. Every authored episode SHIPS
 *  these five deliverables — a beat without a bundle is
 *  incomplete (per docs/design §14b.2). */
export interface EpisodeContentBundle {
  /** Album-track id, e.g. "album1.t19" = "The Syndicated". */
  songId: string;
  /** Matches `songId` by convention; set explicitly when an
   *  episode wants a different visual reel than the song's
   *  default slideshow. */
  slideshowId: string;
  /** 2-5 Loredex entries unlocked at episode close. */
  loredexUnlocks: ReadonlyArray<string>;
  /** Per-arc conspiracy node ids that flip from undiscovered →
   *  discovered when this beat lands. The arc's
   *  `<arcId>NarrativeIntegration.ts` owns the node + edge
   *  declarations (per the §14b.6 CADES pattern). */
  conspiracyDiscoveries?: ReadonlyArray<string>;
  /** Bounties from the arc's BountyContract list this beat
   *  opens. Surface via existing `BountyBoardPage.tsx`. */
  bountyContractIds?: ReadonlyArray<string>;
  /** NPCMessage ids dropped on episode close — uses the
   *  existing `ASYNC_NPC_MESSAGES` shape in
   *  `apps/client/src/game/investigationSystems.ts`. */
  npcMessageIds?: ReadonlyArray<string>;
  /** For flashback episodes (Wraith E4 Eighth-Death; Jericho
   *  E2 Akai-Shi) — references the existing `MEMORY_REPLAYS`
   *  registry. */
  memoryReplayId?: string;
  /** When in the beat the slideshow auto-pops. */
  dropAt: ContentDropTiming;
}

/** One episode of one mystery arc. Authored in
 *  `apps/shared/episodeMysteries.ts`. */
export interface EpisodeDefinition {
  id: EpisodeId;
  arcId: ArcId;
  /** 1-indexed within the arc. */
  ordinal: number;
  /** Display title (e.g. "The First Death and the Crystalline City"). */
  title: string;
  /** Author summary — drives the case-file cold-open + recap. */
  summary: string;
  /** Clues the player can find during this episode. The runtime
   *  awards them via room-mystery hotspots, interrogation, or
   *  bounty completion. */
  clues: ReadonlyArray<{
    id: ClueId;
    title: string;
    body: string;
    /** Where the engine plants the clue — room id, npc id,
     *  bounty id, or a meta-source like "recap" for late
     *  joiners. */
    foundIn: string;
  }>;
  /** Deduction graph for this episode. */
  deductions: ReadonlyArray<DeductionGraphEdge>;
  /** Choices presented at episode close. Choice carry-forward
   *  is handled by `playerMysteryChoices`. */
  choices: ReadonlyArray<{
    id: ChoiceId;
    label: string;
    /** Free-form weight tag — "ruthless", "patient", "trusting",
     *  etc. The season-roll-up aggregates these. */
    weight: string;
  }>;
  /** Episode-close content bundle (per §14b.2). */
  contentBundle: EpisodeContentBundle;
}

/** Top-level mystery arc definition. One per NPC arc + one per
 *  vote-spawned mystery + one per anniversary. */
export interface MysteryDefinition {
  id: MysteryId;
  arcId: ArcId;
  /** Display title. */
  title: string;
  /** Author summary — drives the case-file home view. */
  summary: string;
  /** Source of the seed that produced this mystery. NPC arcs
   *  are typically `npc_arc`; vote-spawned mysteries carry the
   *  vote outcome on `seed.payload`. */
  seed?: MysterySeed;
  /** Episodes in display order — 5 for canonical NPC arcs, 1-2
   *  for vote-spawned interludes. */
  episodes: ReadonlyArray<EpisodeDefinition>;
  /** Suspect graph. */
  suspects: ReadonlyArray<SuspectGraphNode>;
  /** Available lenses for this arc. The base narration is
   *  authored on the episode; lens overlays apply on top. */
  lenses: ReadonlyArray<LensDefinition>;
}

/* ─── RUNTIME-SIDE TYPES ─── */

/** Per-player progress through a mystery. Persisted on
 *  `playerMysteryProgress`. */
export interface PlayerMysteryProgress {
  userId: string;
  mysteryId: MysteryId;
  currentEpisodeId: EpisodeId;
  /** When the player opened the case file. */
  openedAt: Date;
  /** Last action that advanced the case (clue found, deduction
   *  submitted, choice made). */
  lastActedAt: Date;
  lensId: LensId;
  /** True when the player joined mid-arc and needs a recap
   *  rendered before they can see episode N's room state. */
  recapNeeded: boolean;
}

/** A clue the player has found, with metadata for the journal
 *  display. Persisted on `mysteryEvidence`. */
export interface PlayerEvidenceRecord {
  userId: string;
  mysteryId: MysteryId;
  clueId: ClueId;
  foundAt: Date;
  foundInRoom: string;
  /** Which verb fired (look / use / talk / interrogate / recap). */
  foundViaVerb: string;
  /** NPC ids the player has presented this clue to during
   *  interrogation. Empty array = unpresented. */
  presentedToNpcs: ReadonlyArray<string>;
  /** Free-form player notes. */
  notes: string | null;
}

/** A submitted deduction. Persisted on `mysteryDeductions`. */
export interface PlayerDeductionRecord {
  userId: string;
  mysteryId: MysteryId;
  episodeId: EpisodeId;
  /** Pair (or triple) the player submitted, in submission order. */
  clueAId: ClueId;
  clueBId: ClueId;
  clueCId: ClueId | null;
  result: DeductionResult;
  /** Which authored narration ran (for the recap surface). */
  narrationId: string;
  submittedAt: Date;
}

/** The dynamic per-player NPC trust scalar finalized by an
 *  arc. Persisted on `npcTrustScalars`. */
export interface NpcTrustScalar {
  userId: string;
  npcId: string;
  /** 0-100. */
  scalar: number;
  /** Last mystery whose result moved the scalar. */
  lastUpdatedFromMysteryId: MysteryId | null;
  /** Which arc finalized this scalar (Wraith / Jericho / Seer /
   *  Vex / Game Master / Degen). Null until an arc closes. */
  finalizedFromArc: ArcId | null;
}
