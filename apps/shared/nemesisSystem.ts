/* ═══════════════════════════════════════════════════════
   THE NEMESIS SYSTEM — Shadow-of-Mordor-style cohort rival

   Per dreamer-canon (2026-05-13): every player apprentice
   recruitment spawns a Nemesis — a second-wave Potential
   known only by their archetype-title, RNG-selected from
   the 11 archetypes the player is NOT training. The 1:1
   apprentice/nemesis pairing persists for the apprentice's
   lifetime; new apprentice → new Nemesis.

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CANON
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   The Nemesis is canonically the Politician's SECRET
   APPRENTICE. The Politician (7th Archon, female, per
   dreamer-canon — LORE_BIBLE.md:2693-2697 with the §I.1a
   pronoun correction) ran a hidden mentorship lineage in
   parallel to her public reign. Each secret apprentice was
   trained inside the Politician's surveillance-state
   doctrine and preserved as a consciousness-imprint inside
   the Matrix of Dreams when she was destroyed by the Iron
   Lion's legions 42 years before the Fall of Reality
   (LORE_BIBLE.md:2697).

   The Necromancer's escape from the Matrix of Dreams (the
   end-of-Season-2 event where he claims the Silence's body
   and exits the archive — encoded as conspiracy clues in
   apps/shared/dlcMysteries/resurrectionistCycleWalker.ts E4)
   re-released the Politician's secret apprentices into the
   world. They came back already remembering — already
   carrying the Politician's doctrine, her cadence, her
   propaganda tics. They came back already plural with each
   other.

   Each Nemesis carries one shared canonical tic: a phrase,
   gesture, or signature taken from the Politician's
   surviving propaganda. The chain-of-mentorship hint
   surfaces if the player completes the Politician's
   Insurance Policy investigation surface
   (apps/shared/antiquariansJournal.ts:XXIII · The Authority).

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MECHANIC (Shadow of Mordor / Shadow of War lineage)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   - SPAWN on apprentice recruitment. RNG selects one of
     the 11 OTHER archetypes (never matching the player's).
     1 apprentice → 1 Nemesis.
   - IDENTITY: known by archetype-title only ("The Ghost-
     Nemesis," "The Heretic-Nemesis"). Proper name reveals
     only when (a) the Resurrectionist arc E5 is closed AND
     (b) Game Master Fight 2 plague-masked-imprint seed is
     unlocked.
   - MEMORY: every encounter logged. Memories quoted
     verbatim on subsequent encounters.
   - GRUDGE TIER: 0-5 scale. Climbs on disruption / kill /
     mock. Higher tier = elaborate plans, more bespoke
     quotes, more aggressive interception.
   - PLANS: 3-5 active typed objectives at any time. Plans
     tick on a real-time cadence; ignored plans SUCCEED and
     deal lasting consequences (see nemesisPlans.ts).
   - POWER-UPS: each successful plan grants the Nemesis a
     Power-Up (immunity / special weapon / lieutenant).
   - DEATH: respawn one rank lower; remember the killing;
     subsequent ambush odds boosted (Mordor pattern: the
     Politician-network keeps reseeding).
   - POLITICIAN TIC: every Nemesis carries one shared tic
     from the Politician's propaganda lineage.

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CROSS-ARC INTEGRATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   The Nemesis surface integrates with:
     - Trade Empire route resolution (Nemesis can sabotage)
     - Casino (Nemesis can rig odds)
     - Apprentice corruption check (Nemesis whispers to
       the apprentice's breaking-point fear)
     - Hub votes (Nemesis can plant counter-vote campaigns)
     - Mystery Engine arcs Resurrectionist + Game Master
       gain Nemesis-aware deductions when the secret-
       apprentice canon surfaces.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import { APPRENTICE_ARCHETYPES, ARCHETYPES } from "./apprentices";

/**
 * Politician propaganda tics — each Nemesis carries one.
 *
 * Drawn from the Politician's canonical campaign canon
 * (antiquariansJournal.ts SIB-VII · The Politician: "Vote for
 * a future where truth is non-negotiable.") and the
 * surveillance-state doctrine she ran. Each tic is a
 * gesture / cadence / signature the Nemesis surfaces in
 * dialog without naming the Politician explicitly. Players
 * who connect the dots earn the reveal.
 */
export const POLITICIAN_TICS = [
  "non_negotiable_truth_phrase",
  "vote_for_phrase",
  "campaign_smile_rictus",
  "yellow_tie_signature",
  "insurance_policy_marginalia",
  "consent_framework_inversion",
  "non_question_question",
  "register_one_warmth",
  "register_three_authority",
  "ledger_quote",
  "podium_tap_three",
  "rally_pause_count_to_two",
] as const;
export type PoliticianTic = (typeof POLITICIAN_TICS)[number];

export const POLITICIAN_TIC_AUTHORING: Readonly<Record<PoliticianTic, {
  description: string;
  surfaceCue: string;
  hiddenMeaning: string;
}>> = {
  non_negotiable_truth_phrase: {
    description: "Uses the phrase 'non-negotiable truth' in casual conversation.",
    surfaceCue: "Reads as rhetorical flourish.",
    hiddenMeaning: "Canonical Politician campaign slogan (Sib-VII).",
  },
  vote_for_phrase: {
    description: "Frames offers as 'votes' — 'vote for the easier path,' 'vote for your apprentice's safety.'",
    surfaceCue: "Reads as folksy democratic affect.",
    hiddenMeaning: "Canonical Politician consent-pattern: the trap of voting once and never questioning again.",
  },
  campaign_smile_rictus: {
    description: "Smiles too wide for too long when the player declines an offer.",
    surfaceCue: "Reads as menace.",
    hiddenMeaning: "Politician's mortician's-mask smile from the surveillance-state era.",
  },
  yellow_tie_signature: {
    description: "Wears or references something yellow at every encounter — tie, scarf, sash, a pinned flower.",
    surfaceCue: "Reads as personal style.",
    hiddenMeaning: "Cross-references the Meme (5th Archon) yellow-suit canon (apps/shared/antiquariansJournal.ts:351).",
  },
  insurance_policy_marginalia: {
    description: "Annotates documents with 'IP-7' or 'IP-class' as a private cipher.",
    surfaceCue: "Reads as bureaucratic habit.",
    hiddenMeaning: "Politician's Insurance Policy (the Authority) — IP-7 = item 7 of the Insurance Policy ledger.",
  },
  consent_framework_inversion: {
    description: "Phrases coercion as consent: 'You volunteered for this when you stayed.'",
    surfaceCue: "Reads as gaslighting.",
    hiddenMeaning: "Politician's signature corruption: making coercion feel like prior agreement.",
  },
  non_question_question: {
    description: "Asks questions whose only answer is the one being implied: 'You wouldn't want your apprentice to think you lied, would you?'",
    surfaceCue: "Reads as manipulation.",
    hiddenMeaning: "Politician's debate technique — questions that voted for their own answer.",
  },
  register_one_warmth: {
    description: "Drops into a warm, intimate register at high-stakes moments.",
    surfaceCue: "Reads as charm offensive.",
    hiddenMeaning: "Politician's register-one canonical mode (intimate-with-the-citizen).",
  },
  register_three_authority: {
    description: "Shifts to register-three authority when the player threatens to win: 'The Hierarchy of votes does not negotiate with private parties.'",
    surfaceCue: "Reads as institutional flexing.",
    hiddenMeaning: "Politician's register-three canonical mode (institution-speaks-through-her).",
  },
  ledger_quote: {
    description: "Quotes financial ledgers without context: 'In the ledger of consequences, the line you crossed was the third.'",
    surfaceCue: "Reads as cryptic threat.",
    hiddenMeaning: "Politician's bureaucratic-archive doctrine; cross-arc seed with the Degen's Trusteeship.",
  },
  podium_tap_three: {
    description: "Taps any flat surface three times before delivering a refusal.",
    surfaceCue: "Reads as nervous habit.",
    hiddenMeaning: "Politician's podium-tap-three rally-cadence signature.",
  },
  rally_pause_count_to_two: {
    description: "Pauses two beats before the punchline of any monologue.",
    surfaceCue: "Reads as theatrical timing.",
    hiddenMeaning: "Politician's rally-cadence pause — canonical applause-line cue.",
  },
};

/* ═══════════════════════════════════════════════════════
   NEMESIS DEFINITION
   ═══════════════════════════════════════════════════════ */

/** Visible rank tier. Climbs with successful plans, falls
 *  by one on player kill (Mordor respawn pattern). */
export type NemesisRank = 1 | 2 | 3 | 4 | 5;

/** Grudge tier — escalates from neutral to total. */
export type GrudgeTier = 0 | 1 | 2 | 3 | 4 | 5;

/** Whether the Nemesis's proper name is revealed yet. */
export interface NemesisIdentity {
  /** Always known: the archetype-title (e.g. "The Heretic-Nemesis"). */
  archetypeTitle: string;
  /**
   * The proper name. Hidden until BOTH gates are closed:
   *   - Resurrectionist arc E5 complete
   *   - Game Master Fight 2 plague-masked-imprint seed seen
   * Stored procedurally-generated at spawn; surfaced only
   * when the two gates report unlocked from game-state.
   */
  properName: string;
  /** True only when both gates are unlocked from game-state. */
  nameRevealed: boolean;
}

/** Full Nemesis definition — instantiated on apprentice recruit. */
export interface NemesisDef {
  /** Stable id (nem_{userId}_{cohortNumber}). */
  id: string;
  /** The user who spawned this Nemesis. */
  userId: number;
  /** The apprentice cohort this Nemesis is paired to. */
  cohortNumber: number;
  /** RNG-selected from the 11 archetypes NOT being trained. */
  archetype: ApprenticeArchetype;
  /** Identity surface (title visible; name gated). */
  identity: NemesisIdentity;
  /** The Politician-propaganda tic this Nemesis carries. */
  politicianTic: PoliticianTic;
  /** Current visible rank. */
  rank: NemesisRank;
  /** Current grudge tier toward the player. */
  grudgeTier: GrudgeTier;
  /** Cosmetic / lore: this Nemesis's preferred operating
   *  surface ("trade-empire" / "casino" / "hub" / "apprentice"). */
  preferredSurface: NemesisSurface;
  /** Timestamp (ISO) when spawned. */
  spawnedAt: string;
  /** Timestamp (ISO) of the last encounter. Null on spawn. */
  lastEncounterAt: string | null;
}

/** The four operational surfaces a Nemesis can target. */
export type NemesisSurface =
  | "trade-empire"
  | "casino"
  | "hub"
  | "apprentice";

export const NEMESIS_SURFACES: readonly NemesisSurface[] = [
  "trade-empire",
  "casino",
  "hub",
  "apprentice",
];

/* ═══════════════════════════════════════════════════════
   ARCHETYPE-TITLE GENERATION
   ═══════════════════════════════════════════════════════ */

/** Returns the canonical archetype-title for an archetype. */
export function archetypeTitleFor(archetype: ApprenticeArchetype): string {
  const def = ARCHETYPES.find((a) => a.id === archetype);
  if (!def) throw new Error(`Unknown archetype: ${archetype}`);
  return `${def.name}-Nemesis`;
}

/* ═══════════════════════════════════════════════════════
   PROPER-NAME GENERATION
   ═══════════════════════════════════════════════════════ */

/** Procedurally-generated proper-name pools per archetype.
 *  Names are intentionally surveillance-state-flavored —
 *  the Politician's secret apprentice naming convention. */
const PROPER_NAME_POOLS: Readonly<Record<ApprenticeArchetype, readonly string[]>> = {
  zealot: ["Vera Astra", "Lyon Salgado", "Demara Pell", "Kell Vance"],
  ghost: ["Senne Aro", "Lirielle Ven", "Aron Sable", "Kez Marrow"],
  scholar: ["Ardith Cale", "Pyor Linn", "Vesna Korr", "Tobias Lokk"],
  revenant: ["Calix Mourn", "Sarael Eight", "Onric Pall", "Vex Onyx"],
  artisan: ["Marin Lath", "Iolanthe Verge", "Talin Forge", "Pell Wright"],
  oracle: ["Ennae Lir", "Tristan Pale", "Vesper Quill", "Mara Hollow"],
  wanderer: ["Caspian Roan", "Pell Yossarian", "Marrow Kael", "Lin Astair"],
  martyr: ["Sebra Knell", "Atlas Vance", "Mira Lamb", "Joren Ash"],
  heretic: ["Nye Atticus", "Saera Bishop", "Calder Vex", "Onae Pyor"],
  jester: ["Penn Quill", "Liron Vex", "Marrow Patch", "Sela Roan"],
  sentinel: ["Cale Watcher", "Lyra Iron", "Pyor Bastion", "Veska Hold"],
  prodigal: ["Cassian Vance", "Ennae Returns", "Lir Coda", "Pell Homewards"],
};

/** Returns a deterministic-given-seed proper name for an archetype. */
export function generateProperName(
  archetype: ApprenticeArchetype,
  seed: number,
): string {
  const pool = PROPER_NAME_POOLS[archetype];
  if (!pool || pool.length === 0) {
    throw new Error(`No proper-name pool for archetype: ${archetype}`);
  }
  const idx = Math.abs(seed) % pool.length;
  return pool[idx];
}

/* ═══════════════════════════════════════════════════════
   RNG ARCHETYPE SELECTION
   ═══════════════════════════════════════════════════════ */

/** Returns the 11 archetypes that are NOT the player's apprentice. */
export function eligibleNemesisArchetypes(
  apprenticeArchetype: ApprenticeArchetype,
): readonly ApprenticeArchetype[] {
  return APPRENTICE_ARCHETYPES.filter((a) => a !== apprenticeArchetype);
}

/**
 * Deterministic pseudo-RNG selection for Nemesis archetype.
 * Same seed → same archetype, every time. Production code
 * SHOULD seed with `userId * 1009 + cohortNumber` so each
 * player's nemesis-for-cohort is stable across sessions.
 */
export function selectNemesisArchetype(
  apprenticeArchetype: ApprenticeArchetype,
  seed: number,
): ApprenticeArchetype {
  const eligible = eligibleNemesisArchetypes(apprenticeArchetype);
  const idx = Math.abs(seed) % eligible.length;
  return eligible[idx];
}

/* ═══════════════════════════════════════════════════════
   POLITICIAN-TIC SELECTION
   ═══════════════════════════════════════════════════════ */

/** Deterministic Politician-tic selection. */
export function selectPoliticianTic(seed: number): PoliticianTic {
  const idx = Math.abs(seed) % POLITICIAN_TICS.length;
  return POLITICIAN_TICS[idx];
}

/* ═══════════════════════════════════════════════════════
   PREFERRED-SURFACE SELECTION
   ═══════════════════════════════════════════════════════ */

/**
 * Each archetype has a canonical preferred-surface. The
 * mapping is the Nemesis's chosen operating theatre — it
 * does NOT restrict the Nemesis to that surface (plans can
 * target any of the four), but it weights the spawn cadence.
 */
const ARCHETYPE_SURFACE_AFFINITY: Readonly<Record<ApprenticeArchetype, NemesisSurface>> = {
  zealot: "hub",          // cause-aligned political agitation
  ghost: "trade-empire",  // sabotage by absence
  scholar: "hub",         // counter-vote essays
  revenant: "casino",     // ledger-based grudge campaigns
  artisan: "trade-empire",// sabotaged manufactures
  oracle: "apprentice",   // whispers to the breaking-point
  wanderer: "trade-empire", // disrupts routes by drifting onto them
  martyr: "apprentice",   // baits the player into a sacrifice
  heretic: "hub",         // schism campaigns
  jester: "casino",       // odds-rigging via pranks
  sentinel: "trade-empire", // hard-blocks the lanes
  prodigal: "casino",     // returns-from-exile staking
};

/** Returns the Nemesis's preferred operating surface. */
export function preferredSurfaceFor(archetype: ApprenticeArchetype): NemesisSurface {
  return ARCHETYPE_SURFACE_AFFINITY[archetype];
}

/* ═══════════════════════════════════════════════════════
   SPAWN
   ═══════════════════════════════════════════════════════ */

export interface NemesisSpawnInput {
  userId: number;
  cohortNumber: number;
  apprenticeArchetype: ApprenticeArchetype;
  /** ISO timestamp of the spawn (caller-supplied for testability). */
  spawnedAtIso: string;
  /**
   * Whether the in-game gates for proper-name reveal are
   * already unlocked (Resurrectionist E5 + Game Master Fight
   * 2 plague-mask seed). Defaults to false. The runtime can
   * re-evaluate this flag later; we persist the gating decision
   * separately from the (always-computed) proper name.
   */
  nameRevealedFromGameState?: boolean;
}

/**
 * Spawns a Nemesis for an apprentice recruitment event. The
 * function is deterministic-given-input — same userId +
 * cohortNumber + apprenticeArchetype → same Nemesis. This is
 * intentional: replays / save-restore land the same Nemesis.
 */
export function spawnNemesis(input: NemesisSpawnInput): NemesisDef {
  const seed = input.userId * 1009 + input.cohortNumber * 31;
  const archetype = selectNemesisArchetype(input.apprenticeArchetype, seed);
  const properName = generateProperName(archetype, seed + 7);
  const politicianTic = selectPoliticianTic(seed + 13);
  const preferredSurface = preferredSurfaceFor(archetype);

  return {
    id: `nem_${input.userId}_${input.cohortNumber}`,
    userId: input.userId,
    cohortNumber: input.cohortNumber,
    archetype,
    identity: {
      archetypeTitle: archetypeTitleFor(archetype),
      properName,
      nameRevealed: Boolean(input.nameRevealedFromGameState),
    },
    politicianTic,
    rank: 1,
    grudgeTier: 0,
    preferredSurface,
    spawnedAt: input.spawnedAtIso,
    lastEncounterAt: null,
  };
}

/* ═══════════════════════════════════════════════════════
   RANK / GRUDGE-TIER TRANSITIONS
   ═══════════════════════════════════════════════════════ */

/**
 * Player killed the Nemesis. Mordor respawn pattern: the
 * Nemesis returns one rank lower (minimum 1, never deleted)
 * and the grudge tier climbs by 1 (max 5).
 */
export function onPlayerKill(nemesis: NemesisDef): NemesisDef {
  const newRank: NemesisRank = Math.max(1, nemesis.rank - 1) as NemesisRank;
  const newGrudge: GrudgeTier = Math.min(5, nemesis.grudgeTier + 1) as GrudgeTier;
  return {
    ...nemesis,
    rank: newRank,
    grudgeTier: newGrudge,
  };
}

/** Nemesis succeeded at a plan. Rank +1 (max 5), grudge tier +1 (max 5). */
export function onPlanSuccess(nemesis: NemesisDef): NemesisDef {
  const newRank: NemesisRank = Math.min(5, nemesis.rank + 1) as NemesisRank;
  const newGrudge: GrudgeTier = Math.min(5, nemesis.grudgeTier + 1) as GrudgeTier;
  return {
    ...nemesis,
    rank: newRank,
    grudgeTier: newGrudge,
  };
}

/** Player disrupted a plan. Rank holds; grudge tier +1 (max 5). */
export function onPlanDisruption(nemesis: NemesisDef): NemesisDef {
  const newGrudge: GrudgeTier = Math.min(5, nemesis.grudgeTier + 1) as GrudgeTier;
  return { ...nemesis, grudgeTier: newGrudge };
}

/* ═══════════════════════════════════════════════════════
   NAME-REVEAL GATE
   ═══════════════════════════════════════════════════════ */

/**
 * Evaluates the two-gate name-reveal condition from game-state
 * flags. The caller supplies the relevant boolean flags; the
 * function returns whether the proper name should be visible.
 *
 * Per dreamer-canon: the proper name reveals ONLY when BOTH
 * gates are closed.
 */
export function shouldRevealProperName(
  resurrectionistE5Complete: boolean,
  gameMasterPlagueMaskSeedSeen: boolean,
): boolean {
  return resurrectionistE5Complete && gameMasterPlagueMaskSeedSeen;
}

/** Re-evaluates the Nemesis's name-reveal status against current
 *  game-state and returns an updated NemesisDef. */
export function refreshNameRevealed(
  nemesis: NemesisDef,
  resurrectionistE5Complete: boolean,
  gameMasterPlagueMaskSeedSeen: boolean,
): NemesisDef {
  const nameRevealed = shouldRevealProperName(
    resurrectionistE5Complete,
    gameMasterPlagueMaskSeedSeen,
  );
  if (nameRevealed === nemesis.identity.nameRevealed) return nemesis;
  return {
    ...nemesis,
    identity: { ...nemesis.identity, nameRevealed },
  };
}

/** Display name — proper name if revealed, archetype-title if not. */
export function displayName(nemesis: NemesisDef): string {
  return nemesis.identity.nameRevealed
    ? nemesis.identity.properName
    : nemesis.identity.archetypeTitle;
}
