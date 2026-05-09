/* ═══════════════════════════════════════════════════════
   BLOOD WEAVE — Stage 3 of the Resurrection Protocol

   Pure logic for the cumulative `hierarchyAlignment` track
   that every Hellbox use, every Resurrection-Protocols
   completion, and every demon-bond all push toward.

   The Blood Weave is the lore mechanism by which the
   Hierarchy keeps its servants. Using salvage-tech
   resurrection mechanisms inserts the player further into
   the Hierarchy's pattern, and the Game-Master meta-arc
   gates on `hierarchyAlignment`. See:
    - docs/built/LORE_BIBLE.md (Blood Weave + Hierarchy)
    - apps/shared/hellboxClone.ts (HELLBOX_BLOOD_WEAVE_DELTA)
    - apps/shared/resurrectionProtocols.ts

   This module:
    - exposes the loredex unlock pool
    - returns the next-to-unlock entry given alignment level
    - exposes thresholds for narrative-flag gating

   Persisted state lives in the `bloodWeaveAlignment` table
   added in 0078_unified_roster.sql.
   ═══════════════════════════════════════════════════════ */

export interface BloodWeaveState {
  /** Cumulative alignment value (uncapped, but UI shows a 0..100 scaled
   *  view). Each Hellbox use = +1. Each Resurrection-Protocols
   *  completion = +3. Demon binding = +0.5 (rounded down on store). */
  alignmentValue: number;
  /** ms epoch of last alignment increase. */
  lastIncreaseAt?: number;
  /** Loredex entries already unlocked from the BLOOD_WEAVE_REVEAL_POOL
   *  (ids stored to avoid double-unlock). */
  revealedEntryIds: readonly string[];
}

/** Sources that move the alignment forward. Each source has a delta. */
export type BloodWeaveAlignmentSource =
  | "hellbox_restoration"
  | "resurrection_protocol_completed"
  | "resurrection_protocol_path_b" // off-ship return without player
  | "demon_bound"
  | "demon_purified"; // breaking a bond pushes alignment back slightly

export const BLOOD_WEAVE_DELTA: Record<BloodWeaveAlignmentSource, number> = {
  hellbox_restoration: 1,
  resurrection_protocol_completed: 3,
  resurrection_protocol_path_b: 1,
  demon_bound: 1,
  demon_purified: -1,
};

/** The escalating reveal pool. Each entry id corresponds to a loredex
 *  entry the producer must register; the player unlocks them in order
 *  as alignment crosses each threshold.
 *
 *  Order matters: lower thresholds reveal vaguer / more-foundational
 *  pieces first; higher thresholds reveal the Game-Master meta-arc
 *  endgame implications. */
export const BLOOD_WEAVE_REVEAL_POOL: ReadonlyArray<{
  /** Cumulative alignmentValue at which this entry unlocks. */
  threshold: number;
  loredexEntryId: string;
  /** Short description for UI affordances ("the next reveal at X uses"). */
  preview: string;
}> = [
  { threshold: 1, loredexEntryId: "blood_weave_first_pulse", preview: "The Hellbox hums afterwards. You hadn't noticed before." },
  { threshold: 2, loredexEntryId: "blood_weave_thread_visible", preview: "A blood-coloured thread, briefly, between two crew." },
  { threshold: 3, loredexEntryId: "hierarchy_servants_described", preview: "The Hierarchy keeps its servants this way. Always." },
  { threshold: 5, loredexEntryId: "blood_weave_ne_yon_absence", preview: "Why the Resurrectionist Ne-Yon left. What he tried to seal." },
  { threshold: 7, loredexEntryId: "samsara_machine_diagram", preview: "Ne-Yon's diagram of the Samsara machine, partially redacted." },
  { threshold: 9, loredexEntryId: "game_master_role_revealed", preview: "Who the Game Master is. Why the title fits." },
  { threshold: 12, loredexEntryId: "blood_weave_player_position", preview: "The position the player has assumed in the pattern, unwillingly." },
  { threshold: 15, loredexEntryId: "hierarchy_endgame_branch", preview: "The Hierarchy ending — and what it costs to refuse it." },
  { threshold: 20, loredexEntryId: "game_master_offer", preview: "The Game Master's offer. The price of declining." },
  { threshold: 25, loredexEntryId: "game_master_refusal_path", preview: "How to refuse the offer without losing the crew." },
  { threshold: 30, loredexEntryId: "blood_weave_cycle_complete", preview: "What happens when the Cycle Walker stops walking." },
  { threshold: 40, loredexEntryId: "game_master_terminal_choice", preview: "The terminal choice. The one that closes the loop." },
];

/** Compute alignment after applying a source delta. Pure. */
export function applyAlignmentDelta(
  state: BloodWeaveState,
  source: BloodWeaveAlignmentSource,
  now: number,
): BloodWeaveState {
  const delta = BLOOD_WEAVE_DELTA[source];
  return {
    ...state,
    alignmentValue: Math.max(0, state.alignmentValue + delta),
    lastIncreaseAt: delta > 0 ? now : state.lastIncreaseAt,
  };
}

/** Returns the loredex entries that are *now* unlockable but have not
 *  been revealed yet. Caller emits `loredex_entry_discovered` for each
 *  and stores the id in `revealedEntryIds`. */
export function newlyUnlockedEntries(state: BloodWeaveState): readonly string[] {
  const already = new Set(state.revealedEntryIds);
  return BLOOD_WEAVE_REVEAL_POOL
    .filter((p) => state.alignmentValue >= p.threshold && !already.has(p.loredexEntryId))
    .map((p) => p.loredexEntryId);
}

/** Returns a preview of the next pending reveal — what alignment must
 *  reach for the next unlock, and a short description. Useful for the
 *  Resurrection Panel's Stage-3 tab to motivate the player. */
export function nextReveal(state: BloodWeaveState): {
  threshold: number;
  preview: string;
  loredexEntryId: string;
} | null {
  const already = new Set(state.revealedEntryIds);
  const next = BLOOD_WEAVE_REVEAL_POOL.find(
    (p) => !already.has(p.loredexEntryId),
  );
  if (!next) return null;
  return next;
}

/** Discrete weather-band over alignmentValue. Used to colour the Stage-3
 *  tab and to gate narrative flags. Order: dormant → braiding → woven →
 *  bound → claimed. The "claimed" band fires the Game-Master meta-arc. */
export type BloodWeaveBand = "dormant" | "braiding" | "woven" | "bound" | "claimed";

export function bandFor(alignment: number): BloodWeaveBand {
  if (alignment <= 0) return "dormant";
  if (alignment < 5) return "braiding";
  if (alignment < 15) return "woven";
  if (alignment < 30) return "bound";
  return "claimed";
}

/** audit/16 — visual canon per band. Used by Stage-3 tab colouring,
 *  Loredex graph node tinting, and the cosplay reference site
 *  (`docs/audits/2026-05-08-multi-perspective/06_cosplayer.md` Cos5).
 *  Each band escalates colour saturation + glow intensity to match
 *  the narrative escalation. */
export interface BloodWeaveBandVisual {
  band: BloodWeaveBand;
  /** Hex colour of the dominant red-thread aesthetic. */
  colorHex: string;
  /** "none" | "subtle" | "moderate" | "pronounced" | "luminous" */
  glowIntensity: "none" | "subtle" | "moderate" | "pronounced" | "luminous";
  /** Describes how the cosmetic / portrait reads at this band. */
  threadDescription: string;
}

export const BLOOD_WEAVE_BAND_VISUALS: Readonly<Record<BloodWeaveBand, BloodWeaveBandVisual>> = {
  dormant: {
    band: "dormant",
    colorHex: "#1a1a1a",
    glowIntensity: "none",
    threadDescription: "No visible thread. The pattern is asleep.",
  },
  braiding: {
    band: "braiding",
    colorHex: "#8b3a3a",
    glowIntensity: "subtle",
    threadDescription: "Faint red tracery visible only in shadow light. The crew member's portrait gains a hairline-thin red filament along the jaw or shoulder.",
  },
  woven: {
    band: "woven",
    colorHex: "#a02d2d",
    glowIntensity: "moderate",
    threadDescription: "Threads now form a discernible pattern across the figure — a Hellbox sigil-trace at chest level, a thin red embroidery on collar / cuff. Visible in normal light.",
  },
  bound: {
    band: "bound",
    colorHex: "#c12121",
    glowIntensity: "pronounced",
    threadDescription: "The pattern is unmistakable. Red thread runs from temple to wrist, pulsing faintly with the crew's heartbeat. Eyes carry a red rim at the lower lid.",
  },
  claimed: {
    band: "claimed",
    colorHex: "#ff1a1a",
    glowIntensity: "luminous",
    threadDescription: "Saturated red glow envelops the figure. Eyes are fully red. The thread no longer cosmetic — it is structural. The Game-Master meta-arc fires.",
  },
};

/** Narrative flag fired on band crossing — the meta-arc system polls
 *  these to advance the Hierarchy / Game-Master arc. */
export function bandToFlag(band: BloodWeaveBand): string {
  return `blood_weave:${band}`;
}

/** Initial state for a new player. */
export function createBloodWeaveState(): BloodWeaveState {
  return {
    alignmentValue: 0,
    revealedEntryIds: [],
  };
}
