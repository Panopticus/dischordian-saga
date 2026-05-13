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
import { isGrudgeAcceleratorFor, NEMESIS_ARCHETYPE_BEHAVIORS } from "./nemesisArchetypes";
import type { NemesisEncounterKind } from "./nemesisMemory";
import type { FactionId } from "./factions";
import { FACTION_IDS, FACTION_REGISTRY } from "./factions";

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
  /** Phase K + faction alignment — the living-universe
   *  faction this Nemesis serves. Pinned at spawn. Optional
   *  in shape for back-compat with pre-K Nemeses; the
   *  runtime defaults to "hierarchy" when missing. */
  alignedFaction?: FactionId;
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

/* ═══════════════════════════════════════════════════════
   PHASE K1.2 — UNIFIED ENCOUNTER → TRANSITION DISPATCH

   Surface integrations record encounters via
   `recordSurfaceEvent` (server-side). Phase K1.2 adds a
   single dispatch point: given an encounter kind, apply
   the canonical rank/grudge transition. K4's archetype-
   acceleration is layered on top — a Ghost-Nemesis whose
   accel-trigger fires gets DOUBLE grudge gain on that
   encounter.
   ═══════════════════════════════════════════════════════ */

/** Apply a transition to a Nemesis based on the encounter
 *  kind. Returns the new NemesisDef (immutable). Encounter
 *  kinds that don't move state return the input unchanged. */
export function applyEncounterTransition(
  nemesis: NemesisDef,
  kind: NemesisEncounterKind,
): NemesisDef {
  // Base transition by encounter kind
  let next: NemesisDef;
  switch (kind) {
    case "killed_by_player":
      next = onPlayerKill(nemesis);
      break;
    case "fled_player":
      // Fleeing scars too — same transition as kill, but
      // grudge-only (rank holds since the fight didn't conclude).
      next = onPlanDisruption(nemesis);
      break;
    case "mocked_by_player":
      next = onPlanDisruption(nemesis);
      break;
    case "route_sabotage_blocked":
    case "casino_odds_rigging_blocked":
    case "apprentice_whisper_blocked":
    case "hub_counter_vote_blocked":
    case "ambush_survived":
      // Plan-disruption family: grudge climbs.
      next = onPlanDisruption(nemesis);
      break;
    case "route_sabotaged":
    case "casino_odds_rigged":
    case "apprentice_whisper_landed":
    case "hub_counter_vote_landed":
    case "ambush_landed":
      // Plan-success family: rank + grudge climb.
      next = onPlanSuccess(nemesis);
      break;
    case "first_encounter":
      // First encounter is just the chronicle's bookmark;
      // no state change.
      return nemesis;
    default:
      // Defensive — unhandled kinds pass through. The
      // ship:check parity covers full coverage.
      return nemesis;
  }

  // K4 layer: if this archetype is accelerated by this
  // encounter kind, add ANOTHER grudge tick.
  if (isGrudgeAcceleratorFor(nemesis.archetype, kind)) {
    next = onPlanDisruption(next);
  }

  return next;
}

/* ═══════════════════════════════════════════════════════
   PHASE K7.1 — POLITICIAN-TIC PROPAGATION

   Every Nemesis carries one of 12 propaganda tics. The
   tic is invisible until decoded — but it surfaces in
   dialog according to per-archetype rules. This is the
   filter the dialog system pipes lines through at render
   time.

   Tic-rendering rules:
     - Politician (n/a — there's no Politician-archetype
       Nemesis; the Politician IS the lineage, not an
       instance), Heretic, Sentinel: SPOKEN every line
     - Zealot, Martyr, Oracle: SPOKEN every 3rd line
     - Witch (n/a), Scholar, Artisan, Jester: WRITTEN
       (margin/aside, not voiced)
     - Ghost: STAGE-DIRECTION only (never voiced; appears
       as italicized prose action)
     - Wanderer, Revenant, Prodigal: SPOKEN every 5th line
   ═══════════════════════════════════════════════════════ */

export type TicDelivery = "spoken_every" | "spoken_every_3rd" | "spoken_every_5th" | "written_aside" | "stage_direction" | "silent";

/** Returns the tic-delivery rule for a Nemesis's
 *  archetype. */
export function ticDeliveryFor(nemesis: NemesisDef): TicDelivery {
  switch (nemesis.archetype) {
    case "heretic":
    case "sentinel":
      return "spoken_every";
    case "zealot":
    case "martyr":
    case "oracle":
      return "spoken_every_3rd";
    case "scholar":
    case "artisan":
    case "jester":
      return "written_aside";
    case "ghost":
      return "stage_direction";
    case "wanderer":
    case "revenant":
    case "prodigal":
      return "spoken_every_5th";
    default:
      return "silent";
  }
}

/** Apply the Politician-tic to a single dialog line per
 *  the archetype's delivery rule. lineIndex is the
 *  position of the line in the scene (0-based). */
export function applyPoliticianTic(
  line: string,
  nemesis: NemesisDef,
  lineIndex: number,
): string {
  const tic = nemesis.politicianTic;
  const delivery = ticDeliveryFor(nemesis);
  const ticPhrase = ticPhraseFor(tic);

  switch (delivery) {
    case "spoken_every":
      return `${line} ${ticPhrase}`;
    case "spoken_every_3rd":
      return lineIndex % 3 === 0 ? `${line} ${ticPhrase}` : line;
    case "spoken_every_5th":
      return lineIndex % 5 === 0 ? `${line} ${ticPhrase}` : line;
    case "written_aside":
      // Margin annotation — surfaced visually as italic suffix
      return `${line} _(${ticPhrase})_`;
    case "stage_direction":
      // Pure prose action — never voiced
      return `${line} *[${ticPhrase}]*`;
    case "silent":
    default:
      return line;
  }
}

/** Look up the human-readable phrase for a Politician
 *  tic. The phrase is the surface signature the player
 *  decodes to connect the Nemesis to the Politician. */
export function ticPhraseFor(tic: PoliticianTic): string {
  return TIC_PHRASES[tic];
}

const TIC_PHRASES: Record<PoliticianTic, string> = {
  non_negotiable_truth_phrase: "this is non-negotiable",
  vote_for_phrase: "the vote, of course, is for me",
  campaign_smile_rictus: "*[the smile holds one beat too long]*",
  yellow_tie_signature: "*[a yellow detail at the throat]*",
  insurance_policy_marginalia: "(see appendix; the policy holds)",
  consent_framework_inversion: "you've already consented; we just hadn't told you yet",
  non_question_question: "but is it really a question",
  register_one_warmth: "between us, friend",
  register_three_authority: "let the record show",
  ledger_quote: "the ledger reads as follows",
  podium_tap_three: "three taps, three witnesses",
  rally_pause_count_to_two: "—— two",
};

/* ═══════════════════════════════════════════════════════
   PHASE K + FACTION ALIGNMENT — chooseNemesisFaction

   Per dreamer ask: Nemeses exist in the living universe
   and HELP factions the player opposes. At spawn time,
   the Nemesis is pinned to a faction whose interests
   align with their archetype AND maximally conflict with
   the player's current standing. Deterministic on seed.
   ═══════════════════════════════════════════════════════ */

export interface FactionStandingSnapshot {
  factionId: FactionId;
  standing: number;
}

/** Pin a Nemesis to a faction. Algorithm:
 *    - Score each faction by (archetypeAffinity × 2) +
 *      max(0, -playerStanding) — positive when the
 *      player is HOSTILE to the faction (the Nemesis
 *      wants to oppose the player, so they side with
 *      who the player attacks).
 *    - Tiebreak by deterministic RNG seeded with
 *      (userId, cohortNumber, sequence).
 *    - If all standings are positive (player allies
 *      with everyone), pick the highest archetype
 *      affinity to a faction the player has NOT
 *      championed.
 *
 *  Returns the FactionId. Never null — every Nemesis
 *  has a faction. */
export function chooseNemesisFaction(args: {
  archetype: NemesisDef["archetype"];
  userId: number;
  cohortNumber: number;
  nemesisSequence: number;
  playerStandings: readonly FactionStandingSnapshot[];
}): FactionId {
  const behavior = NEMESIS_ARCHETYPE_BEHAVIORS[args.archetype];
  const standingByFaction = new Map<FactionId, number>();
  for (const s of args.playerStandings) {
    standingByFaction.set(s.factionId, s.standing);
  }

  let bestScore = -Infinity;
  const tied: FactionId[] = [];
  for (const fid of FACTION_IDS) {
    const affinity = behavior.factionAffinityVector[fid] ?? 4;
    const standing = standingByFaction.get(fid) ?? 0;
    // Hostility-bonus: the more hostile the player is to
    // the faction, the more attractive it is for the
    // Nemesis to side with them.
    const hostilityBonus = Math.max(0, -standing);
    // Champion-penalty: avoid factions the player has
    // championed (no fun assigning the Nemesis to your
    // closest ally).
    const championPenalty = Math.max(0, standing) > 75 ? 50 : 0;
    const score = affinity * 2 + hostilityBonus - championPenalty;

    if (score > bestScore) {
      bestScore = score;
      tied.length = 0;
      tied.push(fid);
    } else if (score === bestScore) {
      tied.push(fid);
    }
  }

  if (tied.length === 1) return tied[0];

  // Deterministic tiebreak via seeded RNG
  const seed =
    args.userId * 1009 + args.cohortNumber * 31 + args.nemesisSequence * 7 + 1;
  const idx = seed % tied.length;
  return tied[idx];
}

/** Helper: human-readable name for a faction. */
export function factionDisplayName(factionId: FactionId): string {
  return FACTION_REGISTRY[factionId]?.name ?? factionId;
}

/* ═══════════════════════════════════════════════════════
   PHASE K10.3 — VARIANCE SIGNATURE

   The "always different game experience" promise needs
   a measurable invariant. nemesisRunSignature returns a
   compact signature describing the unique fingerprint of
   a player's Nemesis history — across cohorts, plans,
   outcomes, faction alignments, decoded tics. Two
   playthroughs with the same length should differ in at
   least 4 signature dimensions (enforced by test).
   ═══════════════════════════════════════════════════════ */

export interface NemesisRunSignatureInput {
  /** All Nemeses the player has met across cohorts. */
  nemeses: readonly Pick<
    NemesisDef,
    "id" | "archetype" | "rank" | "grudgeTier" | "politicianTic"
  >[];
  /** All factions the player's Nemeses are aligned with
   *  (in spawn order, may include duplicates). */
  factionsAligned: readonly FactionId[];
  /** Plan-kind frequencies across the player's Nemesis
   *  history (succeeded + disrupted). */
  planKindCounts: Readonly<Record<string, number>>;
  /** Encounter outcomes by category. */
  outcomes: Readonly<{
    killed: number;
    fled: number;
    mocked: number;
    recruited: number;
    madePeace: number;
    promoted_to_lieutenant: number;
  }>;
  /** Number of unique Politician-tics the player has
   *  decoded. */
  ticsDecoded: number;
}

export interface NemesisRunSignature {
  /** Stable hex-string. Two identical Run-states return
   *  the same signature. */
  hash: string;
  /** The independent dimensions used to build the hash.
   *  Test: two playthroughs of similar length should
   *  differ in ≥4 of these. */
  dimensions: {
    archetypesEncountered: number;
    distinctTicsCarried: number;
    distinctFactionsAligned: number;
    distinctPlanKinds: number;
    killOrFleeRatio: string;
    recruitOrPeaceTaken: boolean;
    averageGrudgeTier: number;
    lieutenantPromotions: number;
  };
}

/** Pure function — computes a 256-bit (hex) signature
 *  for the player's Nemesis run. */
export function nemesisRunSignature(
  input: NemesisRunSignatureInput,
): NemesisRunSignature {
  const archetypesEncountered = new Set(input.nemeses.map((n) => n.archetype)).size;
  const distinctTicsCarried = new Set(input.nemeses.map((n) => n.politicianTic)).size;
  const distinctFactionsAligned = new Set(input.factionsAligned).size;
  const distinctPlanKinds = Object.keys(input.planKindCounts).filter(
    (k) => (input.planKindCounts[k] ?? 0) > 0,
  ).length;
  const killOrFleeRatio = (() => {
    const total = input.outcomes.killed + input.outcomes.fled;
    if (total === 0) return "0:0";
    return `${input.outcomes.killed}:${input.outcomes.fled}`;
  })();
  const recruitOrPeaceTaken =
    input.outcomes.recruited > 0 || input.outcomes.madePeace > 0;
  const averageGrudgeTier =
    input.nemeses.length === 0
      ? 0
      : input.nemeses.reduce((s, n) => s + n.grudgeTier, 0) / input.nemeses.length;
  const lieutenantPromotions = input.outcomes.promoted_to_lieutenant;

  const dimensions = {
    archetypesEncountered,
    distinctTicsCarried,
    distinctFactionsAligned,
    distinctPlanKinds,
    killOrFleeRatio,
    recruitOrPeaceTaken,
    averageGrudgeTier,
    lieutenantPromotions,
  };

  // Simple FNV-1a 32-bit hash, repeated 8x with salts to
  // produce a 256-bit hex string. Pure, deterministic,
  // no crypto dependency.
  const json = JSON.stringify(dimensions);
  let hash = "";
  for (let salt = 0; salt < 8; salt++) {
    let h = 2166136261 ^ salt;
    for (let i = 0; i < json.length; i++) {
      h ^= json.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    hash += (h >>> 0).toString(16).padStart(8, "0");
  }

  return { hash, dimensions };
}

/** Counts the number of dimensions in which two
 *  signatures differ. The Phase K10.3 contract requires
 *  ≥ 4 for any two same-length playthroughs. */
export function compareRunSignatures(
  a: NemesisRunSignature,
  b: NemesisRunSignature,
): number {
  let diff = 0;
  const keys = Object.keys(a.dimensions) as (keyof NemesisRunSignature["dimensions"])[];
  for (const k of keys) {
    if (a.dimensions[k] !== b.dimensions[k]) diff++;
  }
  return diff;
}
