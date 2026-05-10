/* ═══════════════════════════════════════════════════════
   PARTY MEMBER BERTH — the diegetic conversation surface.

   Pure resolvers. The UI hands us a PartyMember + state
   snapshot; we hand back what to render: which expression,
   what activity they're mid-doing, what their berth looks
   like, what subtle detail in the room has changed since
   last visit.

   No HUD. No menus. The character is doing something. The
   face is their state, not a reaction. Visiting is a route
   change; the conversation is the room.

   Five things resolve here:
     1. expressionFor(member, state) → ExpressionKey
     2. activityFor(member, phase, recentEvents) → Activity
     3. doorframeFor(member) → DoorframeRecipe
     4. ambientDetailFor(member, recentEvents) → AmbientDetail
     5. presenceDriftFor(member, secondsLingered) → BondDelta
        (capped, small, intentionally subtle)

   Same shape works for Elara on the bridge, the Human on
   the observation deck, the Apprentice in their bunk, and
   each of the five recruits in theirs.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import type { PartyMember } from "./partyMember";
import type { DayPhase } from "./timeOfDay";

/* ─── Expressions ─── */

/**
 * The five canonical expressions every party member's portrait set
 * must paint. Maps the existing 4–5-emotion sheets we already have
 * for Elara / Human / 12 named NPCs onto a single bond×corruption
 * matrix so the same UI works everywhere.
 */
export type ExpressionKey =
  | "neutral"      // baseline — no current state pressure
  | "warm"         // high bond, low corruption — looking forward to seeing you
  | "considered"   // mid bond, mid corruption — thinking about something
  | "wary"         // low bond OR high corruption surfaces here
  | "vulnerable";  // breaking-point proximity, regardless of axes

/** State inputs the resolver reads from. All optional — the resolver
 *  defaults sensibly when a member doesn't have a particular axis. */
export interface BerthStateSnapshot {
  bond?: number;        // 0–100 for apprentice + recruits
  corruption?: number;  // 0–100 for apprentice
  /** Personal-quest stage — 3 = breaking point. */
  questStage?: 1 | 2 | 3;
  /** True if the apprentice is at trial day 14 with Heretical Quiet
   *  doctrine (Warden purge notice imminent). */
  purgeNoticeImminent?: boolean;
  /** Elara stability -100..100 → vulnerable below -50. */
  elaraStability?: number;
  /** Human light -100..100 → vulnerable below -50. */
  humanLight?: number;
}

/**
 * Resolve which expression key the portrait should render. Pure
 * function of member + state.
 *
 *   bond ≥ 70, corruption < 50            → warm
 *   bond < 30 OR corruption ≥ 70           → wary
 *   questStage === 3 OR purgeNoticeImminent → vulnerable
 *   else                                  → considered (mid) or neutral
 */
export function expressionFor(member: PartyMember, state: BerthStateSnapshot = {}): ExpressionKey {
  // Vulnerable is always-overrides — breaking-point proximity wins.
  if (state.questStage === 3) return "vulnerable";
  if (state.purgeNoticeImminent) return "vulnerable";

  switch (member.kind) {
    case "apprentice": {
      const bond = state.bond ?? member.bond;
      const corr = state.corruption ?? member.corruption;
      if (corr >= 70) return "wary";
      if (bond < 30) return "wary";
      if (bond >= 70 && corr < 50) return "warm";
      if (bond >= 40) return "considered";
      return "neutral";
    }
    case "elara": {
      const stab = state.elaraStability ?? member.stability;
      if (stab <= -50) return "vulnerable";
      if (stab <= -20) return "wary";
      if (stab >= 50) return "warm";
      if (stab >= 20) return "considered";
      return "neutral";
    }
    case "human": {
      const light = state.humanLight ?? member.light;
      if (light <= -50) return "vulnerable";
      if (light <= -20) return "wary";
      if (light >= 50) return "warm";
      if (light >= 20) return "considered";
      return "neutral";
    }
    case "recruit": {
      const bond = state.bond ?? member.bond;
      if (bond < 30) return "wary";
      if (bond >= 70) return "warm";
      if (bond >= 40) return "considered";
      return "neutral";
    }
  }
}

/* ─── Activities ─── */

/**
 * What the member is doing when you arrive. Not posed for you. Mid-
 * task. The Activity is what fills the room visually + what the
 * comm-screen ambient might overhear.
 */
export interface Activity {
  id: string;
  /** Short label rendered as a caption-style overlay if at all. */
  label: string;
  /** Sprite/animation sheet path. */
  spritePath: string;
  /** Looped audio bed path — the muffled-through-door sound on
   *  hover, and the present-in-room sound when you enter. */
  audioBedPath?: string;
  /** Beat the activity ties to. Influences whether they look up. */
  attentiveness: "high" | "medium" | "low";
}

/** Per-archetype default activities, keyed by phase. */
const APPRENTICE_ACTIVITIES: Record<ApprenticeArchetype, Record<DayPhase, Activity>> = buildApprenticeActivities();

function buildApprenticeActivities(): Record<ApprenticeArchetype, Record<DayPhase, Activity>> {
  const a = (id: string, label: string, attentiveness: Activity["attentiveness"] = "medium"): Activity => ({
    id,
    label,
    spritePath: `art/berth/activities/${id}.webp`,
    audioBedPath: `audio/berth/activities/${id}.mp3`,
    attentiveness,
  });
  const sleeping = a("sleeping", "asleep", "low");
  const eating = a("eating", "eating", "high");
  return {
    zealot: {
      dawn: a("reciting", "reciting morning stanza", "low"),
      midday: a("preaching", "preaching to the empty bunk", "medium"),
      dusk: a("transcribing_scripture", "transcribing scripture", "medium"),
      nightwatch: a("praying_silent", "praying without words", "low"),
    },
    ghost: {
      dawn: a("watching_window", "watching the bay-2 ladder", "high"),
      midday: a("absent", "not in the room", "low"),
      dusk: a("watching_door", "watching the door", "high"),
      nightwatch: sleeping,
    },
    scholar: {
      dawn: a("reading_book", "reading", "medium"),
      midday: a("annotating", "annotating with a fast pen", "low"),
      dusk: eating,
      nightwatch: a("reading_late", "still reading", "medium"),
    },
    revenant: {
      dawn: a("staring_wall", "staring at the wall", "low"),
      midday: a("re_lacing_bindings", "re-lacing wrist bindings", "medium"),
      dusk: a("listening_to_old_recording", "listening to a name", "low"),
      nightwatch: a("standing_silent", "standing in the dark", "low"),
    },
    artisan: {
      dawn: a("polishing_tool", "polishing one tool", "medium"),
      midday: a("at_workbench", "at the bench, humming", "high"),
      dusk: a("inventory_check", "counting rivets", "high"),
      nightwatch: a("workbench_late", "still at the bench", "medium"),
    },
    oracle: {
      dawn: a("vision_drawing", "drawing a vision they had", "low"),
      midday: a("staring_through_wall", "looking elsewhere", "low"),
      dusk: a("burning_a_drawing", "burning a drawing", "low"),
      nightwatch: a("eyes_open_dark", "awake in the dark", "low"),
    },
    wanderer: {
      dawn: a("packing_the_pack", "packing the road-pack", "high"),
      midday: a("absent", "out somewhere on the ship", "low"),
      dusk: a("repacking_the_pack", "repacking the road-pack", "medium"),
      nightwatch: a("staring_at_door", "staring at the door", "high"),
    },
    martyr: {
      dawn: a("mending_someone_elses_coat", "mending someone else's coat", "high"),
      midday: a("delivering_food", "delivering food two bunks over", "high"),
      dusk: a("writing_apology_letter", "writing an apology letter", "medium"),
      nightwatch: a("listening_at_door", "listening for someone", "high"),
    },
    heretic: {
      dawn: a("writing_withheld_letter", "writing a letter they will not send", "low"),
      midday: a("absent", "not where they're supposed to be", "low"),
      dusk: a("burning_pages", "burning the day's pages", "low"),
      nightwatch: a("listening_to_static", "listening to static", "low"),
    },
    jester: {
      dawn: a("rehearsing_punchline", "rehearsing a punchline alone", "high"),
      midday: a("polishing_mask", "polishing a half-mask", "medium"),
      dusk: a("eating_alone", "eating alone, laughing once", "high"),
      nightwatch: a("crying_silent", "crying without sound", "low"),
    },
    sentinel: {
      dawn: a("at_the_door", "watching the door", "high"),
      midday: a("polishing_armor", "polishing armor", "medium"),
      dusk: a("at_the_door_again", "still watching the door", "high"),
      nightwatch: a("on_post", "on post", "high"),
    },
    prodigal: {
      dawn: a("staring_at_old_photo", "staring at an old photo", "low"),
      midday: a("absent", "off-deck — they came back, then left again", "low"),
      dusk: a("returning", "returning, half-apologetic", "high"),
      nightwatch: a("packing_to_leave_again", "packing to leave again", "medium"),
    },
  };
}

/** Recruit activities — simpler, one activity per recruit, phase-tinted. */
const RECRUIT_DEFAULT_ACTIVITY: Record<string, string> = {
  vex_solene: "tuning_a_guitar",
  wraith_calder: "rewriting_a_song",
  locke: "reading_a_warrant",
  jericho_jones: "cleaning_a_revolver",
  akai_shi: "meditating",
};

const ELARA_ACTIVITY_BY_PHASE: Record<DayPhase, string> = {
  dawn: "calibrating_at_dawn",
  midday: "running_diagnostics",
  dusk: "reading_a_log",
  nightwatch: "ambient_dim",
};

const HUMAN_ACTIVITY_BY_REVEAL: Record<number, string> = {
  0: "signal_static",
  1: "signal_ghost",
  2: "signal_fragment",
  3: "signal_convergence",
  4: "watching_through_window",
};

export function activityFor(
  member: PartyMember,
  phase: DayPhase,
): Activity {
  const base = (id: string, label: string, attentiveness: Activity["attentiveness"] = "medium"): Activity => ({
    id,
    label,
    spritePath: `art/berth/activities/${id}.webp`,
    audioBedPath: `audio/berth/activities/${id}.mp3`,
    attentiveness,
  });
  switch (member.kind) {
    case "apprentice":
      return APPRENTICE_ACTIVITIES[member.archetype][phase];
    case "recruit": {
      const id = RECRUIT_DEFAULT_ACTIVITY[member.id] ?? "idle";
      return base(`${id}_${phase}`, id.replace(/_/g, " "));
    }
    case "elara":
      return base(ELARA_ACTIVITY_BY_PHASE[phase], "");
    case "human":
      return base(HUMAN_ACTIVITY_BY_REVEAL[member.revealStage] ?? "signal_static", "");
  }
}

/* ─── Doorframe / berth composition ─── */

export interface DoorframeRecipe {
  /** Backdrop image — the room interior. */
  backdropPath: string;
  /** Where the figure stands (left | right | center). Asymmetric
   *  doorway feel. */
  figureAnchor: "left" | "right" | "center";
  /** Where the comm screen mounts on the wall. */
  commScreenAnchor: "wall_left" | "wall_right" | "shelf_top";
  /** Optional ambient sprite slots — small environmental details
   *  the renderer composites on top of the backdrop. */
  ambientSlots: string[];
}

export function doorframeFor(member: PartyMember): DoorframeRecipe {
  switch (member.kind) {
    case "apprentice":
      return {
        backdropPath: `art/berth/apprentice/${member.archetype}_bunk.webp`,
        figureAnchor: "right",
        commScreenAnchor: "wall_left",
        ambientSlots: ["bunk_pillow", "wall_locker", "small_table", "deck_window"],
      };
    case "elara":
      return {
        backdropPath: "art/berth/elara/bridge_pedestal.webp",
        figureAnchor: "center",
        commScreenAnchor: "shelf_top",
        ambientSlots: ["captain_chair_back", "console_array", "starfield_window"],
      };
    case "human":
      return {
        backdropPath: "art/berth/human/observation_deck.webp",
        figureAnchor: "left",
        commScreenAnchor: "wall_right",
        ambientSlots: ["window_static", "single_chair", "long_table"],
      };
    case "recruit":
      return {
        backdropPath: `art/berth/recruit/${member.id}_bunk.webp`,
        figureAnchor: "right",
        commScreenAnchor: "wall_left",
        ambientSlots: ["bunk_pillow", "wall_locker", "personal_object"],
      };
  }
}

/* ─── Ambient detail (the thing that's changed since last visit) ─── */

export interface AmbientDetail {
  /** A small thing in the room that surfaces a recent state-shift —
   *  a half-finished letter, a folded coat, a tea cup that's gone
   *  cold. Pure flavor; renderer overlays a sprite. */
  description: string;
  spritePath?: string;
}

/**
 * Reads recent narrative beats and returns an ambient detail to
 * surface. Intentionally thin — this fires from a small, hand-
 * authored table so each beat reads as authored, not procedural.
 */
export function ambientDetailFor(
  member: PartyMember,
  recentEvents: ReadonlyArray<RecentBerthEvent>,
): AmbientDetail | null {
  // Most-recent-first.
  for (const ev of recentEvents) {
    const detail = AMBIENT_DETAILS[ev.kind]?.(member);
    if (detail) return detail;
  }
  return null;
}

export type RecentBerthEvent =
  | { kind: "doctrine_bound" }
  | { kind: "audit_completed" }
  | { kind: "betrayal_warning" }
  | { kind: "memory_card_consumed" }
  | { kind: "mission_returned" }
  | { kind: "graduation_forge" };

const AMBIENT_DETAILS: Partial<Record<RecentBerthEvent["kind"], (m: PartyMember) => AmbientDetail | null>> = {
  doctrine_bound: (m) =>
    m.kind === "apprentice"
      ? {
          description: `The doctrine slip is on the bunk. ${m.displayName} hasn't put it away.`,
          spritePath: "art/berth/details/doctrine_slip.webp",
        }
      : null,
  audit_completed: () => ({
    description: "An audit transcript pinned to the wall. The pin is too straight.",
    spritePath: "art/berth/details/audit_transcript.webp",
  }),
  betrayal_warning: () => ({
    description: "Something has been removed from the shelf and not put back.",
    spritePath: "art/berth/details/missing_object.webp",
  }),
  memory_card_consumed: () => ({
    description: "A Memory Card sits on the desk. Half-burned at the edge.",
    spritePath: "art/berth/details/memory_card.webp",
  }),
  mission_returned: () => ({
    description: "A road-coat is on the chair. Still cold.",
    spritePath: "art/berth/details/cold_coat.webp",
  }),
  graduation_forge: () => ({
    description: "A signature card sits on the table, still warm.",
    spritePath: "art/berth/details/forged_card.webp",
  }),
};

/* ─── Presence drift (silent visiting → tiny bond gain) ─── */

/**
 * Bond delta from silent presence. Capped at +1 per visit; only fires
 * after 30 seconds in the room. Designed to be near-imperceptible
 * but to mean something across many visits — a player who lingers
 * gets a marginal warmth shift, a player who never visits doesn't.
 *
 * Strict design constraint: cannot be ground. The cap kicks in
 * regardless of session length, and the daily-cap on the calling
 * code holds the day-aggregate to +3 (3 visits worth).
 */
export function presenceDriftFor(secondsLingered: number): number {
  if (secondsLingered < 30) return 0;
  if (secondsLingered < 90) return 0.5;
  return 1;
}

/* ─── Coverage (parity-gate facing) ─── */

export const APPRENTICE_ARCHETYPES_LIST: readonly ApprenticeArchetype[] = [
  "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
  "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
];

/**
 * For the parity gate: every (archetype, phase) cell must have an
 * activity authored. 12 × 4 = 48 cells.
 */
export function apprenticeActivityCoverage(): { archetype: ApprenticeArchetype; phase: DayPhase; authored: boolean }[] {
  const phases: DayPhase[] = ["dawn", "midday", "dusk", "nightwatch"];
  const out: { archetype: ApprenticeArchetype; phase: DayPhase; authored: boolean }[] = [];
  for (const arch of APPRENTICE_ARCHETYPES_LIST) {
    for (const phase of phases) {
      const a = APPRENTICE_ACTIVITIES[arch][phase];
      out.push({
        archetype: arch,
        phase,
        authored: !!a && !!a.id && !!a.label,
      });
    }
  }
  return out;
}

/** For the parity gate: every recruit has a default activity. */
export function recruitActivityCoverage(): { id: string; authored: boolean }[] {
  return Object.entries(RECRUIT_DEFAULT_ACTIVITY).map(([id, activity]) => ({
    id,
    authored: !!activity && activity.length > 3,
  }));
}
