/* ═══════════════════════════════════════════════════════
   MEMORABLE MOMENTS — Player history for the §11.2
   Antiquarian-curated feed in "The Lion in Black".

   The Lion in Black slideshow (§11.2) is designed to mirror
   the player's own playthrough back at them. Frames 2-10 are
   not fixed — they're curated by the Antiquarian from a pool
   of canonical "memorable moments" that the player has
   accumulated during gameplay.

   This module defines:

     1. The pool of moment KINDS the recorder knows about.
     2. The shape of a recorded moment (id, kind, title, etc).
     3. A pure helper `getDynamicLionFrames` that substitutes
        frame metadata based on what the player has actually
        done. Falls back to the canonical placeholder captions
        when a slot has no recording.

   The Zustand store that owns the ring buffer of recorded
   moments lives at client/src/stores/memorableMomentsStore.ts.
   The store calls the `record()` helpers below.
   ═══════════════════════════════════════════════════════ */

import type { SlideshowFrame, SongSlideshowDef } from "./songSlideshow";

/* ─── MOMENT KINDS ─── */

export type MemorableMomentKind =
  /** The player won a card battle. */
  | "card_battle_win"
  /** The player won a card battle while their deck was in a losing position. */
  | "card_battle_comeback"
  /** The player argued with / dismissed a companion (§1.3 wheel). */
  | "companion_argument"
  /** The player completed a slideshow cinematic. */
  | "slideshow_watched"
  /** The player reclaimed a consumed sector (§3.4). */
  | "sector_reclaimed"
  /** The player chose silence at the narrator wheel (third option). */
  | "silence_chosen"
  /** The player pushed a companion bond past 80. */
  | "bond_peak"
  /** The player defeated a Game Master in the Collector's Arena. */
  | "game_master_defeated"
  /** The player completed a crew mission. */
  | "crew_mission_completed"
  /** The player discovered the burnt tarot card in the Prelude. */
  | "tarot_found";

/**
 * A recorded moment. The `capturedAt` timestamp lets the
 * Antiquarian's feed sort reverse-chronologically. The
 * `subtitle` field is the player-facing description that
 * substitutes into Lion in Black's frame captions.
 */
export interface MemorableMoment {
  id: string;
  kind: MemorableMomentKind;
  /** Player-facing caption that replaces the canonical placeholder. */
  subtitle: string;
  /** Optional image URL — when provided, overrides the frame's placeholder art. */
  imageUrl?: string;
  /** Epoch ms. */
  capturedAt: number;
  /** Optional metadata for future tooling. */
  metadata?: Record<string, unknown>;
}

/* ─── FEED SLOT MAPPING ─── */

/**
 * Which moment kinds are eligible for each Lion in Black
 * dynamic frame slot. The §11.2 description references
 * specific player-experience beats ("a sector you reclaimed,
 * a companion you argued with, a card battle you won on a
 * losing deck") — these are the slots that the curator
 * tries to fill in order.
 *
 * Frames 1, 11, 12 are FIXED and not included in the mapping
 * (the opener, the helmet, and the Dischordia card closer).
 */
export const LION_FEED_SLOTS: ReadonlyArray<{
  frameIndex: number;
  preferredKinds: readonly MemorableMomentKind[];
  fallbackSubtitle: string;
}> = [
  {
    frameIndex: 1,
    preferredKinds: ["sector_reclaimed"],
    fallbackSubtitle: "A sector you reclaimed.",
  },
  {
    frameIndex: 2,
    preferredKinds: ["companion_argument"],
    fallbackSubtitle: "A companion you argued with.",
  },
  {
    frameIndex: 3,
    preferredKinds: ["card_battle_comeback", "card_battle_win"],
    fallbackSubtitle: "A card battle you won on a losing deck.",
  },
  {
    frameIndex: 4,
    preferredKinds: ["slideshow_watched"],
    fallbackSubtitle: "The first time you saw the Vortex in the Observation Deck.",
  },
  {
    frameIndex: 5,
    preferredKinds: ["silence_chosen"],
    fallbackSubtitle: "The night you chose silence in the narrator wheel.",
  },
  {
    frameIndex: 6,
    preferredKinds: ["bond_peak"],
    fallbackSubtitle: "The letter you never sent in the Captain's Quarters.",
  },
  {
    frameIndex: 7,
    preferredKinds: ["slideshow_watched"],
    fallbackSubtitle: "The Engineer's execution as you watched it.",
  },
  {
    frameIndex: 8,
    preferredKinds: ["slideshow_watched"],
    fallbackSubtitle: "The Eyes falling in the grass as you watched it.",
  },
  {
    frameIndex: 9,
    preferredKinds: ["tarot_found"],
    fallbackSubtitle: "The tarot card you didn't know you'd been carrying.",
  },
];

/* ─── CURATION ─── */

/**
 * Build the Antiquarian's curated frame list for The Lion in
 * Black from the player's recorded memorable moments.
 *
 * The function:
 *   1. Walks `LION_FEED_SLOTS` in order.
 *   2. For each slot, picks the most recent moment whose
 *      kind matches the slot's preferredKinds list. Each
 *      moment is used at most once across the whole feed.
 *   3. If no moment matches, falls back to the slot's
 *      canonical placeholder subtitle.
 *   4. Writes the chosen subtitle back into the frame's
 *      `caption` field and (if provided) its `imageUrl`.
 *
 * Returns a CLONE of the slideshow with its frames 2-10
 * (array indices 1-9, per LION_FEED_SLOTS) populated.
 * Frames 0 (opener), 10 (helmet), and 11 (Dischordia card)
 * are untouched.
 *
 * Pure — safe to call inside React render paths. The
 * slideshow it returns is a deep-enough copy that mutating
 * the result does not affect the original registry entry.
 */
export function getDynamicLionFrames(
  def: SongSlideshowDef,
  moments: readonly MemorableMoment[],
): SongSlideshowDef {
  const frames: SlideshowFrame[] = def.frames.map((f) => ({ ...f }));
  const consumed = new Set<string>();
  // Newest-first so each slot takes the freshest matching moment.
  const sortedMoments = [...moments].sort((a, b) => b.capturedAt - a.capturedAt);

  for (const slot of LION_FEED_SLOTS) {
    const frame = frames[slot.frameIndex];
    if (!frame) continue;
    const matching = sortedMoments.find(
      (m) => !consumed.has(m.id) && slot.preferredKinds.includes(m.kind),
    );
    if (matching) {
      consumed.add(matching.id);
      frame.caption = matching.subtitle;
      if (matching.imageUrl) frame.imageUrl = matching.imageUrl;
    } else {
      frame.caption = slot.fallbackSubtitle;
    }
  }

  return { ...def, frames };
}

/* ─── MOMENT CONSTRUCTION HELPERS ─── */

let momentCounter = 0;

/**
 * Mint a stable id for a freshly-recorded moment. Monotonic
 * within a single process.
 */
export function makeMomentId(kind: MemorableMomentKind): string {
  momentCounter += 1;
  return `${kind}:${Date.now()}:${momentCounter}`;
}

/** Convenience constructor. */
export function makeMemorableMoment(
  kind: MemorableMomentKind,
  subtitle: string,
  imageUrl?: string,
  metadata?: Record<string, unknown>,
): MemorableMoment {
  return {
    id: makeMomentId(kind),
    kind,
    subtitle,
    imageUrl,
    capturedAt: Date.now(),
    metadata,
  };
}
