/* ═══════════════════════════════════════════════════════
   WITNESSING HUB — shared state deriver

   Pure-function aggregator that takes the player's narrative
   flag set plus a few small runtime inputs and returns
   every panel's worth of data the WitnessingHubPage renders.

   The Hub page is a dashboard for the Witnessing Narrative
   Proposal. Every section of the proposal surfaces here:

     • Prelude intro state + available missions
     • Kael Fragment F1-F6 progress
     • Act progression (Prelude / Act 1 / 2 / 3 / 4 / 4.5 / 5)
     • Year One calendar — current month + upcoming beats
     • Milestone Chronicle feed (entries that have fired)
     • Appendix A / B / C shell status summary
     • Infiltration path commitment
     • Dischordia Cycle + Palimpsest phase (if available)

   All inputs are pure. The caller passes narrative flags
   and any runtime numbers (act1 card wins, chess depth,
   morality score, current month, etc.). The deriver does
   the rest.
   ═══════════════════════════════════════════════════════ */

import { KAEL_FRAGMENTS, type KaelFragment } from "./appendixBKaelQuestline";
import {
  isKaelQuestlineComplete,
  pendingKaelFragmentUnlocks,
  type KaelFragmentWatcherContext,
} from "./kaelFragmentWatchers";
import {
  derivePreludeIntroState,
  getNextPreludeCrewToJoin,
  getAvailablePreludeMissions,
  isPreludeComplete,
  getActiveInfiltrationPath,
} from "./witnessingRuntime";
import {
  YEAR_ONE_CALENDAR_RIPPLES,
  MILESTONE_CHRONICLE_ENTRIES,
  getActiveBeatChronicleEntries,
  getMilestoneChronicleEntry,
  type BeatChronicleEntry,
  type MilestoneChronicleEntry,
  type YearOneCalendarRipple,
} from "./witnessingYearOne";
import {
  WITNESSING_MILESTONES,
  type WitnessingMilestoneId,
} from "./witnessingEvents";
import { APPENDIX_A_NOTES, type AppendixANote } from "./appendixACrossSystemNotes";
import type { PreludeCrewMission } from "./preludeCrewMissions";
import type { InfiltrationPathDef } from "./act3EyesBiography";
import {
  ENGINEER_RECORDINGS,
  TOTAL_RECORDINGS,
  getDiscoveredRecordings,
  getNextPendingRecording,
} from "./engineerRecordings";

/* ─── PUBLIC TYPES ─── */

export type WitnessingAct =
  | "prelude"
  | "act_1"
  | "act_2"
  | "act_3"
  | "act_4"
  | "act_4_5"
  | "act_5";

export interface KaelFragmentProgress {
  fragment: KaelFragment;
  /** True if the fragment has been unlocked. */
  unlocked: boolean;
  /** True if the fragment's conditions are met but the flag isn't raised yet. */
  pending: boolean;
}

export interface ChronicleFeedItem {
  milestoneId: WitnessingMilestoneId;
  entry: MilestoneChronicleEntry;
  /** Monotonic order from the canonical milestone order. */
  order: number;
}

export interface AppendixStatusSummary {
  appendix: "A" | "B" | "C";
  shipped: number;
  total: number;
  /** Percentage 0-100. */
  progressPct: number;
}

export interface WitnessingHubState {
  currentAct: WitnessingAct;
  /** Human-readable act title. */
  currentActTitle: string;
  prelude: {
    crewOnboard: readonly string[];
    availableMissions: readonly PreludeCrewMission[];
    nextCrewName: string | null;
    complete: boolean;
  };
  kaelFragments: {
    entries: readonly KaelFragmentProgress[];
    unlockedCount: number;
    pendingCount: number;
    totalCount: number;
    questlineComplete: boolean;
  };
  calendar: {
    current: YearOneCalendarRipple;
    upcoming: readonly YearOneCalendarRipple[];
    past: readonly YearOneCalendarRipple[];
  };
  chronicleFeed: readonly ChronicleFeedItem[];
  /** Beat-flag Chronicle entries (non-milestone). */
  beatChronicleEntries: readonly BeatChronicleEntry[];
  infiltrationPath: InfiltrationPathDef | null;
  appendixSummaries: readonly AppendixStatusSummary[];
  /** Engineer holographic recordings panel. */
  engineerRecordings: {
    discoveredCount: number;
    totalCount: number;
    nextRecordingTitle: string | null;
    allDiscovered: boolean;
  };
}

export interface WitnessingHubInputs {
  flags: Record<string, unknown>;
  /** 1-12. Clamped on the consumer side. */
  yearOneMonth: number;
  /** Total Act 1 card wins for progression derivation. */
  act1CardWins: number;
  /** Chess depth for Act 2 Engineers Bench unlock. */
  zephyrDepth: number;
  /** Player morality score for Act 2 Game Master selection. */
  moralityScore: number;
  /** Runtime context for Kael Fragment watcher. */
  kaelContext?: KaelFragmentWatcherContext;
}

/* ─── ACT DETECTION ─── */

const ACT_TITLES: Record<WitnessingAct, string> = {
  prelude: "Prelude — The Ark Awakens",
  act_1: "Act 1 — The Twelve Steps",
  act_2: "Act 2 — The Engineer's Bench",
  act_3: "Act 3 — The Eyes in the Dark",
  act_4: "Act 4 — The Prisoner",
  act_4_5: "Act 4.5 — Dead Man's Circuit",
  act_5: "Act 5 — The Reckoning",
};

function deriveCurrentAct(
  flags: Record<string, unknown>,
  act1CardWins: number,
): WitnessingAct {
  if (flags.act_5_started) return "act_5";
  if (flags.act_4_5_started || flags.act_4_5_circuit_complete) return "act_4_5";
  if (flags.act_4_started || flags.act_4_prisoner_cell_complete)
    return "act_4";
  if (
    flags.act_3_starting ||
    flags.act3_insurgency_committed ||
    flags.act3_empire_committed ||
    flags.act3_hierarchy_committed
  )
    return "act_3";
  if (flags.act_2_started || flags.crafting_mastered) return "act_2";
  if (act1CardWins > 0 || flags.act_1_cycle_a_complete) return "act_1";
  return "prelude";
}

/* ─── PANEL DERIVERS ─── */

function deriveKaelFragmentPanel(
  flags: Record<string, unknown>,
  kaelContext: KaelFragmentWatcherContext | undefined,
): WitnessingHubState["kaelFragments"] {
  const pendingIds = new Set(
    pendingKaelFragmentUnlocks(flags, kaelContext ?? {}),
  );
  const entries: KaelFragmentProgress[] = KAEL_FRAGMENTS.map((fragment) => ({
    fragment,
    unlocked: Boolean(flags[fragment.flag]),
    pending: pendingIds.has(fragment.id),
  }));
  return {
    entries,
    unlockedCount: entries.filter((e) => e.unlocked).length,
    pendingCount: entries.filter((e) => e.pending).length,
    totalCount: entries.length,
    questlineComplete: isKaelQuestlineComplete(flags),
  };
}

function derivePreludePanel(
  flags: Record<string, unknown>,
): WitnessingHubState["prelude"] {
  const state = derivePreludeIntroState(flags);
  const next = getNextPreludeCrewToJoin(flags);
  return {
    crewOnboard: state.crewOnboard,
    availableMissions: getAvailablePreludeMissions(flags),
    nextCrewName: next?.name ?? null,
    complete: isPreludeComplete(flags),
  };
}

function deriveCalendarPanel(
  month: number,
): WitnessingHubState["calendar"] {
  const clamped = Math.max(1, Math.min(12, month));
  const current =
    YEAR_ONE_CALENDAR_RIPPLES.find((r) => r.month === clamped) ??
    YEAR_ONE_CALENDAR_RIPPLES[0];
  return {
    current,
    upcoming: YEAR_ONE_CALENDAR_RIPPLES.filter((r) => r.month > clamped),
    past: YEAR_ONE_CALENDAR_RIPPLES.filter((r) => r.month < clamped),
  };
}

function deriveChronicleFeed(
  flags: Record<string, unknown>,
): readonly ChronicleFeedItem[] {
  const out: ChronicleFeedItem[] = [];
  const milestoneOrder: WitnessingMilestoneId[] = Object.keys(
    WITNESSING_MILESTONES,
  ) as WitnessingMilestoneId[];
  for (let i = 0; i < milestoneOrder.length; i++) {
    const id = milestoneOrder[i];
    const milestone = WITNESSING_MILESTONES[id];
    if (flags[milestone.raisesFlag]) {
      out.push({
        milestoneId: id,
        entry: getMilestoneChronicleEntry(id),
        order: i,
      });
    }
  }
  return out;
}

function deriveAppendixSummary(
  appendix: "A" | "B" | "C",
  flags: Record<string, unknown>,
): AppendixStatusSummary {
  if (appendix === "A") {
    const notes: AppendixANote[] = Object.values(APPENDIX_A_NOTES);
    const shipped = notes.filter(
      (n) => n.status === "shell_landed" || n.status === "wired",
    ).length;
    const total = notes.length;
    return {
      appendix,
      shipped,
      total,
      progressPct: Math.round((shipped / total) * 100),
    };
  }
  if (appendix === "B") {
    // Six Kael Fragments — shipped count = unlocked fragments.
    const shipped = KAEL_FRAGMENTS.filter((f) => flags[f.flag]).length;
    return {
      appendix,
      shipped,
      total: KAEL_FRAGMENTS.length,
      progressPct: Math.round((shipped / KAEL_FRAGMENTS.length) * 100),
    };
  }
  // Appendix C — the quiz-show track shipped all 11 new-code
  // entries, so this is always 100%. We still surface the
  // panel so the player sees the track represented.
  return { appendix, shipped: 11, total: 11, progressPct: 100 };
}

/* ─── ENTRY POINT ─── */

/* ─── ENGINEER RECORDINGS PANEL ─── */

function deriveEngineerRecordingsPanel(
  flags: Record<string, unknown>,
  cardWins: number,
): WitnessingHubState["engineerRecordings"] {
  const discovered = getDiscoveredRecordings(flags);
  // Use a simple heuristic for next recording — check with 0 step / false act1
  // since the hub display doesn't gate on those specifics.
  const next = getNextPendingRecording(flags, cardWins, 0, false);
  return {
    discoveredCount: discovered.length,
    totalCount: TOTAL_RECORDINGS,
    nextRecordingTitle: next?.title ?? null,
    allDiscovered: discovered.length >= TOTAL_RECORDINGS,
  };
}

export function deriveWitnessingHubState(
  inputs: WitnessingHubInputs,
): WitnessingHubState {
  const currentAct = deriveCurrentAct(inputs.flags, inputs.act1CardWins);
  return {
    currentAct,
    currentActTitle: ACT_TITLES[currentAct],
    prelude: derivePreludePanel(inputs.flags),
    kaelFragments: deriveKaelFragmentPanel(inputs.flags, inputs.kaelContext),
    calendar: deriveCalendarPanel(inputs.yearOneMonth),
    chronicleFeed: deriveChronicleFeed(inputs.flags),
    beatChronicleEntries: getActiveBeatChronicleEntries(inputs.flags),
    infiltrationPath: getActiveInfiltrationPath(inputs.flags),
    appendixSummaries: [
      deriveAppendixSummary("A", inputs.flags),
      deriveAppendixSummary("B", inputs.flags),
      deriveAppendixSummary("C", inputs.flags),
    ],
    engineerRecordings: deriveEngineerRecordingsPanel(inputs.flags, inputs.act1CardWins),
  };
}
