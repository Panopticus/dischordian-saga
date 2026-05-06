// apps/shared/npcs/types.ts
//
// Unified NPC dialog types — Stage 1 architecture foundation per the priority plan.
// Wraps the four parallel dialog systems (trees / comments / variants / personality-axis)
// behind a single selection contract. Back-compat: CompanionLine (apps/shared/companion.ts)
// is a structural subtype; existing Elara/Human banks keep working.
//
// See apps/shared/npcs/bibles/ for canonical voice direction per character.
// See apps/shared/npcs/bibles/_writers_guide.md for the structural-innovation map.

// --- Identity ---------------------------------------------------------------

/**
 * Canonical NPC keys for the priority roster (Stage 0). Stage 4 weave can extend
 * with additional roster characters; the registry (apps/shared/npcs/registry.ts)
 * carries the canonical metadata per key.
 */
export type NpcKey =
  | "elara"
  | "the_human"
  | "your_eidolon"
  | "adjudicator_locke"
  | "vex_solene"
  | "the_degen"
  | "nilmorg"
  | "the_game_master"
  | "the_meme"
  | "wraith_calder"
  | "the_seer"
  | "dmc_clone_companion"
  | "the_oracle"
  | "jericho_jones"
  // Lore-corrections (Phase A of the galactic-empire arc):
  // - the_antiquarian: Daniel Cross, the actual Antiquarian. Previously
  //   the_seer was wrongly assigned as primary NPC of the Shelf-mates.
  // - drael_mon: Hierarchy SVP of Acquisitions (peer demon lord). The
  //   Hierarchy_acquisitions sub-house had no real face before.
  | "the_antiquarian"
  | "drael_mon";

// --- Trust / Reveal / Channel ----------------------------------------------

/**
 * Generalized trust band. Per-NPC band-name sets vary by bible (3-band Locke / Seer,
 * 4-band Companion / Oracle, 5-band Hierophant). The selector matches the *string*
 * value against the NPC's declared band ladder in NpcProfile.trustBands.
 */
export type TrustBand = string;

/**
 * Reveal-stage gating. Per-NPC stage-name sets vary by bible:
 *   - Vex: "eyes_of_reality" | "vex_public" | "engineer_zero_hint" | "engineer_zero_confirmed"
 *   - Hierophant: "pre_arena" | "post_arena"  (binary; irreversible)
 *   - Meme: "Broadcast" | "Stolen" | "Quiet" | "Real" | "Replacement"
 *   - Companion: "Wary" | "Witnessed" | "Present" | "Inheriting"  (channel-bands)
 *   - Oracle: "dream_substrate" | "memory_residue" | "cinematic_exception"
 *   - Game Master: "Archon" | "Cult" | "dead_AI"
 */
export type RevealStage = string;

/**
 * Expression channel for non-verbal characters. Eidolon canonically operates only
 * on glyph/posture/sound. Companion progresses through all five. Oracle canonically
 * operates only on cinematic-exception (waking-non-cinematic excluded).
 */
export type ExpressionChannel =
  | "verbal"
  | "glyph"
  | "posture"
  | "sound"
  | "first_word"
  | "named_personality";

// --- Player-axis gating ----------------------------------------------------

/**
 * 7-axis player profile (re-exported here as a pure type so this module
 * doesn't take a runtime dep on apps/shared/playerProfile.ts).
 */
export type PlayerAxis =
  | "aggression"
  | "mercy"
  | "curiosity"
  | "conformity"
  | "vigilance"
  | "vulnerability"
  | "wit";

export type AxisMagnitude =
  | "strong_negative"
  | "moderate_negative"
  | "mild_negative"
  | "neutral"
  | "mild_positive"
  | "moderate_positive"
  | "strong_positive";

/**
 * Player-axis gate. The selector compares the player's axis-magnitude against
 * the gate; the line fires if the magnitude is in the allowed set.
 */
export interface PlayerAxisGate {
  axis: PlayerAxis;
  magnitudes: ReadonlyArray<AxisMagnitude>;
}

// --- Choices / branching ---------------------------------------------------

export interface NpcChoice {
  id: string;
  label: string;
  followUpLineId?: string;
  /** Narrative flag set on selection (writer-coordinated string). */
  setFlag?: string;
  /** Narrative flag cleared on selection. */
  clearFlag?: string;
  /** Per-NPC trust delta on selection (signed integer). */
  trustDelta?: number;
  /** Internal monologue line (italic, no VO). */
  internalMonologue?: string;
  /** Cross-NPC public flag — written to npc_public_flags table on selection. */
  publicFlag?: string;
}

// --- The line itself -------------------------------------------------------

export interface NpcLine {
  /** Unique identifier; also the VO clip key (manifest[lineId] → CDN URL). */
  lineId: string;

  /** Owning NPC. */
  npcKey: NpcKey;

  /** Textual content. Empty string allowed for non-verbal lines (channel != "verbal"). */
  text: string;

  /** Optional VO clip ID; if absent, line renders without audio. */
  voId?: string;

  /** Display priority (0 = lowest, 3 = highest). */
  priority?: 0 | 1 | 2 | 3;

  /** Whether the line can be interrupted by higher-priority content. */
  interruptible?: boolean;

  /** Dismissal mode; how the line can be cleared from the screen. */
  dismissible?: "tap" | "auto" | "manual";

  /** Display duration in milliseconds; only meaningful for dismissible="auto". */
  durationMs?: number;

  // --- Gating ------------------------------------------------------------

  /** Required narrative flags (ALL must be present). */
  unlockFlags?: ReadonlyArray<string>;

  /** Excluded narrative flags (NONE may be present). */
  excludeFlags?: ReadonlyArray<string>;

  /** Minimum saga act (line invisible before this act). */
  minAct?: number;

  /** Maximum saga act (line invisible after this act). */
  maxAct?: number;

  /** Required trust band (resolved against NpcProfile.trustBands). */
  requiresTrustBand?: TrustBand;

  /** Required reveal-stage. */
  requiresRevealStage?: RevealStage;

  /** Player-axis personality gate (per-NPC axis-of-interest, see registry). */
  playerAxisGate?: PlayerAxisGate;

  /** Expression channel; defaults to "verbal" if absent. */
  expressionChannel?: ExpressionChannel;

  /** Cross-NPC reaction trigger — line fires if listed npc_public_flag is set. */
  reactsToPublicFlag?: string;

  // --- Anti-spam --------------------------------------------------------

  /** Cooldown key; identical-key lines de-dup per cooldownWindowMs. */
  cooldownKey?: string;

  /** Cooldown window in milliseconds (default: 0 = once per playthrough per cooldownKey). */
  cooldownWindowMs?: number;

  /** Max plays across the entire playthrough (default: unbounded). */
  maxPlays?: number;

  // --- Branching --------------------------------------------------------

  /** Optional player choices following the line. */
  choices?: ReadonlyArray<NpcChoice>;

  /** Optional follow-up line that fires automatically. */
  nextLineId?: string;

  // --- Side effects -----------------------------------------------------

  /** Trust delta applied automatically when line fires (signed integer). */
  trustDelta?: number;

  /** Narrative flag(s) automatically set on play. */
  setsFlags?: ReadonlyArray<string>;

  /** Cross-NPC public flag(s) automatically written on play. */
  setsPublicFlags?: ReadonlyArray<string>;
}

// --- Per-NPC profile ------------------------------------------------------

/**
 * Trust band ladder for a single NPC. Order is canonical: index 0 is the lowest
 * band (e.g., "Hostile" / "Wary") and the last index is the highest (e.g.,
 * "Confidant" / "Inheriting"). Threshold is the minimum trust value (0-100)
 * required to enter the band.
 */
export interface TrustBandDefinition {
  band: TrustBand;
  threshold: number;
  /** Optional human-readable label. */
  label?: string;
}

/**
 * Personality archetype (bible-defined). The selector reads this for
 * within-line register variants when an NPC's bank carries multiple
 * archetype-keyed phrasings of the same canonical content.
 */
export type PersonalityArchetype = string;

export interface NpcProfile {
  npcKey: NpcKey;
  name: string;
  faction?: string;
  role?: string;

  /** ElevenLabs voice ID (per apps/scripts/generate-npc-vo.ts registry). */
  voiceId?: string;

  /** Per-NPC trust band ladder, in canonical low→high order. */
  trustBands: ReadonlyArray<TrustBandDefinition>;

  /** Player-axes the NPC reads (selector picks the most-load-bearing). */
  axisOfInterest?: ReadonlyArray<PlayerAxis>;

  /** Bible-defined personality archetypes for register variants. */
  personalityArchetypes?: ReadonlyArray<PersonalityArchetype>;

  /** Canonical reveal-stage ladder (or absent if NPC has no reveal-staging). */
  revealStages?: ReadonlyArray<RevealStage>;

  /** Canonical expression-channel ladder (for non-verbal-arc characters). */
  expressionChannels?: ReadonlyArray<ExpressionChannel>;

  /** Canonical primary room ID (where NPC most naturally appears). */
  primaryRoom?: string;

  /** Canonical signature monologue line ID (for first-meet flavor). */
  signatureMonologueLineId?: string;

  /** Free-form metadata; bible-asserted fields (e.g., agenda, title). */
  metadata?: Readonly<Record<string, string>>;
}

// --- Trust state (adapter contract) ---------------------------------------

/**
 * Per-NPC trust state. Adapters at apps/shared/npcs/adapters/ return this
 * shape uniformly so the selector doesn't special-case per NPC. NPCs without
 * a bespoke source (Locke uses lockeRelationship.ts; Eidolon uses eidolonBonds)
 * read from the npc_trust table directly.
 */
export interface TrustState {
  npcKey: NpcKey;
  /** Numeric trust value (0-100 by convention; adapters normalize if needed). */
  trust: number;
  /** Resolved trust band (matched against NpcProfile.trustBands). */
  band: TrustBand;
  /** Per-NPC narrative flags. */
  flags: ReadonlySet<string>;
  /** Current reveal-stage if applicable. */
  revealStage?: RevealStage;
  /** Last interaction timestamp (epoch ms). */
  lastInteractionAt?: number;
}

// --- Selector context -----------------------------------------------------

/**
 * Player profile snapshot consumed by the selector. Pure value-object; the
 * selector does not call back into player-profile mutation code.
 */
export interface PlayerProfileSnapshot {
  /** Magnitude per axis. The 7 axes per playerProfile.ts. */
  axes: Readonly<Record<PlayerAxis, AxisMagnitude>>;
}

/**
 * Surface-class for selection. Surfaces correspond to canonical authoring
 * locations; the selector reads (npcKey, surface) to find applicable lines.
 *
 *   - "room"            sector / ship-room entry
 *   - "transmission"    incoming voice transmission (Seer, Oracle dreams, etc.)
 *   - "npc_line"        direct NPC dialog (mission briefings, conversations)
 *   - "journal"         lore / journal callouts
 *   - "wheel_followup"  dialog-wheel response branch
 *   - "match"           TCG match-lifecycle commentary
 *   - "fight"           fight-engine commentary
 *   - "trade_empire"    trade empire mission / contract / route
 *   - "dmc"             Dead Man's Circuit race / season events
 *   - "cinematic"       scripted cinematic scene
 *   - "dream_sequence"  Oracle dream-substrate (per the_oracle.md §1.1)
 *   - "memory_residue"  Oracle memory-narrator-frame (per the_oracle.md §1.2)
 *   - "expression"      non-verbal channel render (Eidolon glyphs, Companion posture)
 */
export type DialogSurface =
  | "room"
  | "transmission"
  | "npc_line"
  | "journal"
  | "wheel_followup"
  | "match"
  | "fight"
  | "trade_empire"
  | "dmc"
  | "cinematic"
  | "dream_sequence"
  | "memory_residue"
  | "expression";

export interface NpcSelectorContext {
  npcKey: NpcKey;
  surface: DialogSurface;
  /** Surface-specific target ID (room ID, mission ID, scene ID, etc.). */
  targetId: string;
  /** Current saga act (1-7). */
  act: number;
  /** Player narrative flags. */
  flags: ReadonlySet<string>;
  /** Cross-NPC public flags (npc_public_flags table). */
  publicFlags: ReadonlySet<string>;
  /** Trust state for the NPC (via adapter). */
  trustState: TrustState;
  /** Player profile snapshot (for axis gating). */
  playerProfile: PlayerProfileSnapshot;
  /** Per-line history (for cooldown / maxPlays enforcement). */
  lineHistory: ReadonlyMap<string, ReadonlyArray<number>>;
}

// --- Selector result ------------------------------------------------------

export interface NpcSelectorResult {
  line: NpcLine;
  /** Specificity score that won the selection. Useful for debugging. */
  specificityScore: number;
  /** Sibling candidates that passed gates but lost on specificity. */
  alternates?: ReadonlyArray<{ line: NpcLine; specificityScore: number }>;
}

// --- Back-compat ----------------------------------------------------------

/**
 * Re-exported convenience: callers that have a CompanionLine can treat it
 * as an NpcLine after npcKey-mapping. The mapping happens in the selector
 * adapter (apps/shared/npcs/adapters/companionAdapter.ts).
 */
export type CompanionSpeaker = "elara" | "the_human";

/** Type guard: an NpcKey that maps to a CompanionSpeaker. */
export function isCompanionKey(key: NpcKey): key is CompanionSpeaker {
  return key === "elara" || key === "the_human";
}
