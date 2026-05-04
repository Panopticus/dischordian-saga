/* ═══════════════════════════════════════════════════════
   PROPHECY VISION MAP — every song bound

   The single registry that says, for every song slideshow:
     - which narrative flag unlocks / fires it
     - which spine it belongs to (insurgency rise / reality fall)
     - which intensity tier it lives in (marquee / whisper / static)
     - which player act it sits in (the chrono-spine cell)
     - which Daniel Cross prophecy lines bookend it
     - whether it can be awakened from
     - which Oracle card (if any) it is bound to

   This is the structural backbone of the dream surface. Every
   tier delivers the same full slideshow underneath — only the
   first-contact ceremony differs. The Antiquarian's Index hosts
   the complete cinematic for every entry; the player who wants
   to experience every vision in full can.

   Authoring contract: append, never reorder. Every flag id
   transitions exactly once per player; the queue is keyed off
   that transition.
   ═══════════════════════════════════════════════════════ */

import type { DanielCrossProphecy } from "./danielCrossProphecies";
import { getProphecyById, allowedThemesForSpine } from "./danielCrossProphecies";
import { DREAMER_VISIONS } from "./dreamerVisions";
import { getSlideshow } from "./songSlideshows";
import type { SongSlideshowDef } from "./songSlideshow";

/* ─── TYPES ─── */

/** Which thematic arc the vision belongs to. Both spines fire
 *  in parallel — at every player act the player tastes both. */
export type Spine = "insurgency_rise" | "reality_fall";

/** Delivery tier. Every tier resolves to the same full slideshow
 *  in the Antiquarian's Index; only first-contact differs. */
export type Intensity =
  /** Dream-mode interrupt: bookends + awaken + completion. */
  | "marquee"
  /** Inline fragment tease (~30s, ≤ 6 frames) + full version
   *  always reachable in the Index. Never interrupts. */
  | "whisper"
  /** Single-frame stamp + one prophecy line in memorable
   *  moments; full version available to dream from the Index. */
  | "static";

/** Player act the vision is mapped to. 4.5 is the canonical
 *  pivot act between Acts 4 and 5 (Daniel-Cross route). */
export type PlayerAct = 1 | 2 | 3 | 4 | 4.5 | 5 | 6 | 7;

/** Album the vision belongs to. */
export type AlbumSlug =
  | "dischordian-logic"
  | "age-of-privacy"
  | "book-of-daniel"
  | "west-by-god"
  | "silence-in-heaven";

/** Which kind of completion reward fires when a marquee is
 *  watched in full. Lighter shapes here; the full grant is
 *  resolved server-side via prophecyAchievements.ts. */
export interface ProphecyReward {
  /** XP awarded for a full watch. Default applied if omitted. */
  readonly xp?: number;
  /** soulBoundDream awarded for a full watch. */
  readonly soulBoundDream?: number;
  /** Loredex entry id unlocked on full watch. */
  readonly loredexEntry?: string;
  /** When set, watching grants +1 charge to oracleDeckProgress
   *  via the bound Oracle card. Computed automatically when
   *  `oracleCardSlug` is set on the vision. */
  readonly oracleCharges?: number;
}

export interface ProphecyVisionGate {
  readonly minAwareness?: number;
  readonly minAct?: number;
  readonly maxAct?: number;
}

export interface ProphecyVision {
  /** Stable id ("pv_album3_t01" etc). */
  readonly id: string;
  /** Narrative flag whose false→true transition fires this
   *  vision's enqueue. Each flag belongs to at most one
   *  vision. */
  readonly flagId: string;
  readonly spine: Spine;
  readonly intensity: Intensity;
  readonly playerAct: PlayerAct;
  readonly albumSlug: AlbumSlug;
  /** Track id within the album ("T03", "t12", etc.). */
  readonly trackId: string;
  /** Slideshow id in apps/shared/songSlideshows.ts. */
  readonly slideshowId: string;
  /** For albums with internal arcs (Album 3 has 3 acts; Album
   *  5 has 3 acts + epilogue). */
  readonly albumInternalAct?: 1 | 2 | 3;
  /** → DANIEL_CROSS_PROPHECIES. */
  readonly openingProphecyId: string;
  readonly closingProphecyId: string;
  readonly reward: ProphecyReward;
  readonly gate?: ProphecyVisionGate;
  /** Only set on the unawakenable apex pair: First Visitation
   *  and "Not a Lion but a Lamb" capstone. */
  readonly unawakenable?: boolean;
  /** Bound Oracle card slug (one of the 23). When set, full
   *  watch grants +1 oracleDeckProgress.charges. */
  readonly oracleCardSlug?: string;
}

/* ─── DEFAULT GATES ─── */

function defaultGate(spine: Spine, act: PlayerAct): ProphecyVisionGate {
  if (spine === "insurgency_rise") {
    return { minAwareness: 13, minAct: 1, maxAct: act >= 5 ? 7 : 6 };
  }
  // reality_fall — Album 4/5 future content unlocks late.
  return { minAwareness: 23, minAct: act >= 6 ? 6 : 4 };
}

/* ─── REGISTRY ─── */

/** The prophecy vision registry. Foundational entries that
 *  exercise every code path; the writers' room expands by
 *  appending until every song in songSlideshows.ts has a
 *  binding. The coverage tests assert structural invariants
 *  (every flag uniquely bound, themes aligned with spine,
 *  bookend ids resolve, etc.) so additions can't drift. */
export const PROPHECY_VISIONS: readonly ProphecyVision[] = [
  /* ═══════════════════════════════════════════════════════
     ONSET — First Visitation (Daniel Cross's introduction)

     Reframes the existing Vision 1 ("The First Notice") as
     Daniel Cross's first contact. This is the only dream
     that fires before `daniel_cross_first_contact` is set —
     until the player has been visited, every other queued
     marquee waits.
     ═══════════════════════════════════════════════════════ */
  {
    id: "pv_first_visitation",
    flagId: "dreamer_awareness_threshold_3",
    spine: "insurgency_rise",
    intensity: "marquee",
    playerAct: 1,
    albumSlug: "dischordian-logic",
    trackId: "T03",
    slideshowId: "vision_first_notice",
    openingProphecyId: "dc_prophecy_onset_open",
    closingProphecyId: "dc_prophecy_onset_close",
    reward: {
      xp: 100,
      soulBoundDream: 10,
      loredexEntry: "daniel_cross_first_contact",
    },
    gate: { minAwareness: 3 },
    unawakenable: true,
  },

  /* ═══════════════════════════════════════════════════════
     INSURGENCY RISE — ALBUM 1 (Dischordian Logic)
     ═══════════════════════════════════════════════════════ */
  {
    id: "pv_album1_to_be_the_human",
    flagId: "act1_closing_choice_made",
    spine: "insurgency_rise",
    intensity: "marquee",
    playerAct: 2,
    albumSlug: "dischordian-logic",
    trackId: "T07",
    slideshowId: "to-be-the-human",
    openingProphecyId: "dc_prophecy_001",
    closingProphecyId: "dc_prophecy_005",
    reward: { xp: 50, soulBoundDream: 5 },
    gate: defaultGate("insurgency_rise", 2),
    oracleCardSlug: "dreamer",
  },
  {
    id: "pv_album1_i_am_the_eyes",
    flagId: "act2_dual_signal_activated",
    spine: "insurgency_rise",
    intensity: "marquee",
    playerAct: 2,
    albumSlug: "dischordian-logic",
    trackId: "T11",
    slideshowId: "i-am-the-eyes-that-watch",
    openingProphecyId: "dc_prophecy_002",
    closingProphecyId: "dc_prophecy_009",
    reward: { xp: 50, soulBoundDream: 5 },
    gate: defaultGate("insurgency_rise", 2),
    oracleCardSlug: "two_witnesses",
  },
  {
    id: "pv_album1_hacking_reality",
    flagId: "act3_started",
    spine: "insurgency_rise",
    intensity: "whisper",
    playerAct: 3,
    albumSlug: "dischordian-logic",
    trackId: "T18",
    slideshowId: "hacking-reality",
    openingProphecyId: "dc_prophecy_006",
    closingProphecyId: "dc_prophecy_012",
    reward: { xp: 10, soulBoundDream: 1 },
    gate: { minAwareness: 7, minAct: 3 },
  },
  {
    id: "pv_album1_the_prisoner",
    flagId: "act3_kael_logs_unlocked",
    spine: "insurgency_rise",
    intensity: "static",
    playerAct: 3,
    albumSlug: "dischordian-logic",
    trackId: "T20",
    slideshowId: "the-prisoner",
    openingProphecyId: "dc_prophecy_010",
    closingProphecyId: "dc_prophecy_011",
    reward: { xp: 5, soulBoundDream: 1 },
    gate: { minAwareness: 3 },
    oracleCardSlug: "prisoner",
  },

  /* ═══════════════════════════════════════════════════════
     INSURGENCY RISE — ALBUM 2 (Age of Privacy)
     ═══════════════════════════════════════════════════════ */
  {
    id: "pv_album2_ocularum",
    flagId: "act3_kael_opener_heard",
    spine: "insurgency_rise",
    intensity: "marquee",
    playerAct: 3,
    albumSlug: "age-of-privacy",
    trackId: "T05",
    slideshowId: "ocularum",
    openingProphecyId: "dc_prophecy_002",
    closingProphecyId: "dc_prophecy_006",
    reward: { xp: 50, soulBoundDream: 5 },
    gate: defaultGate("insurgency_rise", 3),
    oracleCardSlug: "tower",
  },

  /* ═══════════════════════════════════════════════════════
     INSURGENCY RISE — ALBUM 3 (Book of Daniel 24:7)

     The album is structured in three internal acts:
     Awakening / Struggle / Resolution. Each gets at least
     one marquee.
     ═══════════════════════════════════════════════════════ */
  {
    id: "pv_album3_lion_in_black",
    flagId: "act4_revelation_complete",
    spine: "insurgency_rise",
    intensity: "marquee",
    playerAct: 4,
    albumSlug: "book-of-daniel",
    trackId: "T11",
    slideshowId: "the-lion-in-black",
    albumInternalAct: 2,
    openingProphecyId: "dc_prophecy_003",
    closingProphecyId: "dc_prophecy_007",
    reward: { xp: 75, soulBoundDream: 8 },
    gate: defaultGate("insurgency_rise", 4),
    oracleCardSlug: "antiquarian",
  },
  {
    id: "pv_album3_light_holds",
    flagId: "act4_army_unlocked",
    spine: "insurgency_rise",
    intensity: "marquee",
    playerAct: 4.5,
    albumSlug: "book-of-daniel",
    trackId: "T13",
    slideshowId: "the-light-holds",
    albumInternalAct: 3,
    openingProphecyId: "dc_prophecy_011",
    closingProphecyId: "dc_prophecy_014",
    reward: { xp: 75, soulBoundDream: 8 },
    gate: defaultGate("insurgency_rise", 5),
    oracleCardSlug: "iron_lion",
  },
  {
    id: "pv_album3_two_witnesses_meet",
    flagId: "act5_map_first_open",
    spine: "insurgency_rise",
    intensity: "whisper",
    playerAct: 5,
    albumSlug: "book-of-daniel",
    trackId: "T15",
    slideshowId: "two-witnesses-meet",
    albumInternalAct: 3,
    openingProphecyId: "dc_prophecy_009",
    closingProphecyId: "dc_prophecy_010",
    reward: { xp: 10, soulBoundDream: 1 },
    gate: { minAwareness: 7, minAct: 5 },
  },

  /* ═══════════════════════════════════════════════════════
     REALITY FALL — ALBUM 4 (West by God)

     Album 4 is authored as a continuous narrative — already
     primed for Album-as-Film mode. The bulb-breaks beat is
     the hinge into reality-fall territory.
     ═══════════════════════════════════════════════════════ */
  {
    id: "pv_album4_bulb_breaks",
    flagId: "act6_silence_meta_heard",
    spine: "reality_fall",
    intensity: "marquee",
    playerAct: 6,
    albumSlug: "west-by-god",
    trackId: "T08",
    slideshowId: "the-bulb-breaks",
    openingProphecyId: "dc_prophecy_017",
    closingProphecyId: "dc_prophecy_021",
    reward: { xp: 75, soulBoundDream: 8 },
    gate: defaultGate("reality_fall", 6),
    oracleCardSlug: "moon_tyrant",
  },
  {
    id: "pv_album4_superman_aint_coming",
    flagId: "act6_human_confession_heard",
    spine: "reality_fall",
    intensity: "whisper",
    playerAct: 6,
    albumSlug: "west-by-god",
    trackId: "T09",
    slideshowId: "superman-aint-coming",
    openingProphecyId: "dc_prophecy_015",
    closingProphecyId: "dc_prophecy_018",
    reward: { xp: 10, soulBoundDream: 1 },
    gate: { minAwareness: 7, minAct: 6 },
  },

  /* ═══════════════════════════════════════════════════════
     REALITY FALL — ALBUM 5 (Silence in Heaven)

     The capstone — "Not a Lion but a Lamb" — is unawakenable
     and gates `act_7_complete`. This is the apex of the
     entire dream surface; it cannot be skipped.
     ═══════════════════════════════════════════════════════ */
  {
    id: "pv_album5_silence_two_witnesses",
    flagId: "act7_arc_closes",
    spine: "reality_fall",
    intensity: "marquee",
    playerAct: 7,
    albumSlug: "silence-in-heaven",
    trackId: "T15",
    slideshowId: "silence-of-two-witnesses",
    albumInternalAct: 2,
    openingProphecyId: "dc_prophecy_018",
    closingProphecyId: "dc_prophecy_019",
    reward: { xp: 100, soulBoundDream: 12 },
    gate: defaultGate("reality_fall", 7),
    oracleCardSlug: "necromancer",
  },
  {
    id: "pv_album5_capstone_lamb",
    flagId: "act7_convergence_landing",
    spine: "reality_fall",
    intensity: "marquee",
    playerAct: 7,
    albumSlug: "silence-in-heaven",
    trackId: "T37",
    slideshowId: "act-7-convergence-intro",
    albumInternalAct: 3,
    openingProphecyId: "dc_prophecy_capstone_open",
    closingProphecyId: "dc_prophecy_capstone_close",
    reward: { xp: 250, soulBoundDream: 25, loredexEntry: "the_full_truth" },
    gate: { minAwareness: 23, minAct: 7 },
    unawakenable: true,
    oracleCardSlug: "universe",
  },
];

/* ─── INDEXES ─── */

const VISIONS_BY_ID: ReadonlyMap<string, ProphecyVision> = new Map(
  PROPHECY_VISIONS.map((v) => [v.id, v]),
);
const VISIONS_BY_FLAG: ReadonlyMap<string, ProphecyVision> = new Map(
  PROPHECY_VISIONS.map((v) => [v.flagId, v]),
);

/** Resolve the vision a flag transition fires, if any. The
 *  reactor calls this on every false→true narrative-flag
 *  transition. Returns undefined for flags with no binding —
 *  the reactor treats that as a no-op. */
export function findProphecyForFlag(flagId: string): ProphecyVision | undefined {
  return VISIONS_BY_FLAG.get(flagId);
}

/** Resolve a vision by id. */
export function getProphecyVisionById(id: string): ProphecyVision | undefined {
  return VISIONS_BY_ID.get(id);
}

/** Resolve a slideshow def for a prophecy vision. Looks first in
 *  the SONG_SLIDESHOWS registry, then falls back to dreamerVisions
 *  for the First Visitation (which reuses VISION_1_SLIDESHOW). The
 *  client + Antiquarian's Index call this rather than getSlideshow
 *  directly, so the dream-only Vision 1 def is reachable without
 *  having to register it twice. */
export function resolveSlideshowForVision(
  vision: ProphecyVision,
): SongSlideshowDef | undefined {
  const direct = getSlideshow(vision.slideshowId);
  if (direct) return direct;
  for (const dv of DREAMER_VISIONS) {
    if (dv.slideshow.id === vision.slideshowId) {
      return dv.slideshow;
    }
  }
  return undefined;
}

/** All visions matching a given album. */
export function listVisionsForAlbum(slug: AlbumSlug): readonly ProphecyVision[] {
  return PROPHECY_VISIONS.filter((v) => v.albumSlug === slug);
}

/** All visions matching a given player act. */
export function listVisionsForAct(act: PlayerAct): readonly ProphecyVision[] {
  return PROPHECY_VISIONS.filter((v) => v.playerAct === act);
}

/** All marquee visions, in registry order. Used by the queue
 *  drainer + Witness ladder predicates. */
export function listMarquees(): readonly ProphecyVision[] {
  return PROPHECY_VISIONS.filter((v) => v.intensity === "marquee");
}

/** All whisper visions. */
export function listWhispers(): readonly ProphecyVision[] {
  return PROPHECY_VISIONS.filter((v) => v.intensity === "whisper");
}

/** All static-echo visions. */
export function listStatics(): readonly ProphecyVision[] {
  return PROPHECY_VISIONS.filter((v) => v.intensity === "static");
}

/* ─── ELIGIBILITY ─── */

export interface PlayerProphecySnapshot {
  /** Awareness counter from dreamer_awareness.awarenessCount. */
  readonly awareness: number;
  /** Player's current act (1 / 2 / ... / 7), best-effort. */
  readonly currentAct: number;
  /** Whether `daniel_cross_first_contact` is set. While unset,
   *  marquees other than the First Visitation queue but never
   *  drain. */
  readonly firstContactReceived: boolean;
}

/** Predicate: is this vision eligible to fire for the player
 *  right now? The queue uses this to gate enqueue (so a flag
 *  setting too early just queues silently) and the drainer
 *  uses it to filter the pending list at session start. */
export function isProphecyEligible(
  vision: ProphecyVision,
  snapshot: PlayerProphecySnapshot,
): boolean {
  const gate = vision.gate ?? {};
  if (gate.minAwareness !== undefined && snapshot.awareness < gate.minAwareness) {
    return false;
  }
  if (gate.minAct !== undefined && snapshot.currentAct < gate.minAct) {
    return false;
  }
  if (gate.maxAct !== undefined && snapshot.currentAct > gate.maxAct) {
    return false;
  }
  return true;
}

/** Resolve the bookend prophecies for a vision. Returns
 *  undefined if either id fails to resolve — caller should
 *  treat that as a content-author bug. */
export function resolveBookend(
  vision: ProphecyVision,
): { opening: DanielCrossProphecy; closing: DanielCrossProphecy } | undefined {
  const opening = getProphecyById(vision.openingProphecyId);
  const closing = getProphecyById(vision.closingProphecyId);
  if (!opening || !closing) return undefined;
  return { opening, closing };
}

/* ─── COVERAGE / VALIDATION ─── */

export interface RegistryIssue {
  readonly visionId: string;
  readonly kind:
    | "duplicate_flag"
    | "duplicate_id"
    | "unknown_opening_prophecy"
    | "unknown_closing_prophecy"
    | "theme_mismatch_opening"
    | "theme_mismatch_closing";
  readonly message: string;
}

/** Validate the registry. Returns an empty array when clean.
 *  The shared-side test runs this and asserts empty. */
export function validateProphecyRegistry(): RegistryIssue[] {
  const issues: RegistryIssue[] = [];
  const seenFlags = new Set<string>();
  const seenIds = new Set<string>();

  for (const v of PROPHECY_VISIONS) {
    if (seenIds.has(v.id)) {
      issues.push({
        visionId: v.id,
        kind: "duplicate_id",
        message: `Duplicate prophecy vision id: ${v.id}`,
      });
    }
    seenIds.add(v.id);

    if (seenFlags.has(v.flagId)) {
      issues.push({
        visionId: v.id,
        kind: "duplicate_flag",
        message: `Duplicate flag binding: ${v.flagId} on ${v.id}`,
      });
    }
    seenFlags.add(v.flagId);

    const opening = getProphecyById(v.openingProphecyId);
    if (!opening) {
      issues.push({
        visionId: v.id,
        kind: "unknown_opening_prophecy",
        message: `${v.id} opening prophecy ${v.openingProphecyId} not found`,
      });
    } else {
      const allowed = allowedThemesForSpine(v.spine);
      if (!allowed.includes(opening.theme)) {
        issues.push({
          visionId: v.id,
          kind: "theme_mismatch_opening",
          message: `${v.id} (spine=${v.spine}) opening theme ${opening.theme} not in allowed set`,
        });
      }
    }

    const closing = getProphecyById(v.closingProphecyId);
    if (!closing) {
      issues.push({
        visionId: v.id,
        kind: "unknown_closing_prophecy",
        message: `${v.id} closing prophecy ${v.closingProphecyId} not found`,
      });
    } else {
      const allowed = allowedThemesForSpine(v.spine);
      if (!allowed.includes(closing.theme)) {
        issues.push({
          visionId: v.id,
          kind: "theme_mismatch_closing",
          message: `${v.id} (spine=${v.spine}) closing theme ${closing.theme} not in allowed set`,
        });
      }
    }
  }

  return issues;
}
