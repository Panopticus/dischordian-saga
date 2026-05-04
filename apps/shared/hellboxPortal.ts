/* ═══════════════════════════════════════════════════════
   HELLBOX PORTAL — Medbay → Matrix of Dreams Selector

   The Hellbox is canonized in
   docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md (Beats B/C)
   as a neural-lattice device wired into the cloning pod in the
   medbay. First touch is a compelled cinematic transport to
   Celebration. Subsequent touches reuse the device as a fast-
   travel portal to Matrix-of-Dreams Levels.

   This module is the DATA LAYER the runtime UI
   (apps/client/src/pages/HellboxPortalPage.tsx, Phase B) will
   consume. It does NOT render anything itself.

   What it provides:
     • Portal-state machine: locked / first-touch / unlocked
     • Selector model: which Levels are choosable, grouped by school
     • Compelled-transport cinematic cue (first touch is canon)
     • Activation prerequisites
     • Lore-appropriate UI strings (Elara framing)

   Canon dependencies:
     • matrixOfDreamsLevels.ts (the Levels)
     • shipSensorReactions.ts (the Ark senses portal use)
     • engineerRecordings.ts ("the hellbox is the kernel" — Recording H.2)

   See plan §4 (The Hellbox & The Two Schools as Matrix-of-
   Dreams Levels).
   ═══════════════════════════════════════════════════════ */

import {
  MATRIX_OF_DREAMS_LEVELS,
  getAvailableLevels,
  getLevelsBySchool,
  type MatrixLevelDefinition,
  type SchoolId,
} from "./matrixOfDreamsLevels";

/** Discrete states the Hellbox can be in. */
export type HellboxState =
  | "locked"          // pre-Beat-B: the Hellbox has not yet been discovered
  | "first_touch"     // Beat C: compelled cinematic transport firing
  | "unlocked";       // any subsequent touch: portal selector available

/** Conditions the runtime checks before allowing portal use. */
export interface HellboxAccessConditions {
  /** Player has discovered the Hellbox (Beat B flag). */
  readonly hellboxDiscovered: boolean;
  /** Compelled first-touch cinematic has fired (Beat C flag). */
  readonly firstTouchComplete: boolean;
  /** Player is physically in the medbay (where the device lives). */
  readonly inMedbay: boolean;
}

export function resolveHellboxState(cond: HellboxAccessConditions): HellboxState {
  if (!cond.hellboxDiscovered) return "locked";
  if (!cond.firstTouchComplete) return "first_touch";
  return "unlocked";
}

/* ─── COMPELLED TRANSPORT (FIRST-TOUCH CINEMATIC) ─── */

/**
 * The first-touch cinematic. Per Beat C — "Hellbox compels — cinematic
 * POV transport to Celebration. Teacher: the hellbox itself (first
 * time only)." After this, the player can use the Hellbox at will.
 *
 * Lines reuse DialogCue mood/audio shape so existing tooling works.
 */
export interface HellboxCompelledTransport {
  readonly id: "hellbox_first_touch";
  readonly cue: ReadonlyArray<{
    readonly speaker:
      | "narrator"
      | "elara"
      | "the_human"
      | "engineer"          // Recording H.2 fragment plays here
      | "the_hellbox";      // The device itself, treated as a speaker
    readonly text: string;
    readonly mood:
      | "warm" | "guarded" | "curious" | "protective" | "reflective"
      | "broken" | "cryptic" | "menacing";
  }>;
}

export const HELLBOX_FIRST_TOUCH: HellboxCompelledTransport = {
  id: "hellbox_first_touch",
  cue: [
    {
      speaker: "elara",
      mood: "broken",
      text:
        "Don't — Potential, that thing is not a panel. That is the Hellbox. " +
        "It is wired into the cloning pod and I don't know why. I should know why. " +
        "I am sorry I do not.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Hellbox hums. The medbay's lights dim by half. The player's hand " +
        "is already on the device — they didn't decide to put it there.",
    },
    {
      speaker: "the_hellbox",
      mood: "cryptic",
      text:
        "Variant accepted. Memory-resin substrate calibrating. Destination: " +
        "the chamber the user is most willing to enter. The chamber is " +
        "Celebration. The reconstruction is gentler than the truth.",
    },
    {
      speaker: "engineer",
      mood: "guarded",
      // Recording H.2 fragment, per existing canon
      text:
        "— the next pod, the next pod, I can't tell them it's the same pod. " +
        "We are all running the same clone. The hellbox is the kernel. " +
        "I should not have built this.",
    },
    {
      speaker: "the_human",
      mood: "reflective",
      text:
        "He said that on the day he sent her. Agent Zero. The transference. " +
        "He knew this device killed him. He left it for you anyway. He was " +
        "very sure about who you would be.",
    },
    {
      speaker: "elara",
      mood: "warm",
      text:
        "The Hellbox is calling. I can't hold the medbay closed against it. " +
        "Go gently. Come back. I'll be here.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The medbay folds, the way a chapter folds when you turn the page. " +
        "The player wakes — if 'wakes' is the right word — on the rampart " +
        "of Celebration Castle, in a body that is not theirs, three steps " +
        "from a young guardsman named Bernardo, on the night the Ghost King " +
        "first walks. The first Episode is now playing. The player did not " +
        "choose this one. After it, they will get to choose.",
    },
  ],
};

/* ─── PORTAL SELECTOR MODEL ─── */

export interface HellboxSelectorGroup {
  readonly school: SchoolId;
  readonly displayName: string;
  /** Pixar-magical color tag the runtime will theme on. */
  readonly themeTag: "celebration_warm" | "mechronis_cold";
  /** All levels in the school the player has UNLOCKED (selectable). */
  readonly availableLevels: readonly MatrixLevelDefinition[];
  /** All levels in the school still locked (shown greyed-out). */
  readonly lockedLevels: readonly MatrixLevelDefinition[];
  /** All levels in the school the player has COMPLETED (shown checked, replayable). */
  readonly completedLevels: readonly MatrixLevelDefinition[];
}

export interface HellboxSelectorModel {
  /** Whether the portal is currently usable. */
  readonly state: HellboxState;
  /** The grouped selector data. */
  readonly groups: readonly HellboxSelectorGroup[];
  /** Total Episodes the player has completed across both schools. */
  readonly totalCompleted: number;
  /** Total Episodes available in the registry. */
  readonly totalEpisodes: number;
  /** Elara's framing line shown above the selector. */
  readonly elaraFraming: string;
}

export function buildSelectorModel(
  cond: HellboxAccessConditions,
  completedIds: ReadonlySet<string>,
): HellboxSelectorModel {
  const state = resolveHellboxState(cond);
  const allAvailable = new Set(getAvailableLevels(completedIds).map((l) => l.id));
  const groups: HellboxSelectorGroup[] = (["celebration", "mechronis"] as const).map((school) => {
    const all = getLevelsBySchool(school);
    const available = all.filter((l) => allAvailable.has(l.id) && !completedIds.has(l.id));
    const completed = all.filter((l) => completedIds.has(l.id));
    const locked = all.filter((l) => !allAvailable.has(l.id) && !completedIds.has(l.id));
    return {
      school,
      displayName: school === "celebration" ? "Celebration School" : "Mechronis Academy",
      themeTag: school === "celebration" ? "celebration_warm" : "mechronis_cold",
      availableLevels: available,
      lockedLevels: locked,
      completedLevels: completed,
    };
  });
  const totalCompleted = completedIds.size;
  const totalEpisodes = MATRIX_OF_DREAMS_LEVELS.length;
  return {
    state,
    groups,
    totalCompleted,
    totalEpisodes,
    elaraFraming: pickElaraFraming(state, totalCompleted, totalEpisodes),
  };
}

/* ─── ELARA FRAMING LINES ─── */

/**
 * Elara's framing line above the selector. Different lines for different
 * states — the Hellbox is not a neutral interface; it is a haunted device,
 * and Elara has feelings about it.
 */
function pickElaraFraming(state: HellboxState, completed: number, total: number): string {
  if (state === "locked") {
    return "There is no portal here. Not yet. The medbay holds.";
  }
  if (state === "first_touch") {
    return "I cannot stop this. I am sorry. Go gently.";
  }
  // unlocked
  if (completed === 0) {
    return "Welcome back. Pick a chamber. The reconstruction will hold whatever you carry into it.";
  }
  if (completed < total / 2) {
    return "You're starting to recognize the rooms. That's normal. Some of them recognize you back.";
  }
  if (completed < total) {
    return "Almost everything I know about him is in these chambers. Take what you need.";
  }
  // total reached
  return "You've walked every room. The chambers will keep replaying for whoever comes after you. That's how he wanted it.";
}

/* ─── LOOKUP HELPERS ─── */

export function getFirstTouchSceneCues(): HellboxCompelledTransport["cue"] {
  return HELLBOX_FIRST_TOUCH.cue;
}
