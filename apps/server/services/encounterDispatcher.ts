/* ═══════════════════════════════════════════════════════
   ENCOUNTER DISPATCHER

   Runtime for the Hierarchy / Malkia / Source-Kael encounter
   content. The content (apps/shared/encounters/*.ts) is
   phase-keyed; this service tracks which phase the player is
   currently inside, which branch they picked at the choice
   point, and which lines fire next.

   Mirrors the romance ladder service's shape:
     - getEncounterStatus(userId)   — read-only summary of all
                                      encounters the player is
                                      mid-walk on or has
                                      completed
     - openEncounter(userId, id)    — start the encounter at
                                      the entry phase
     - currentLines(userId, id)     — return the line bundle
                                      for the current phase
                                      (filtered by player flags)
     - chooseBranch(userId, id, branchFlag) —
                                      record the player's pick;
                                      the corresponding line's
                                      setsFlags fire via npc_public_flags
     - advancePhase(userId, id)     — entry → negotiation →
                                      resolution → aftermath
     - completeEncounter(userId, id) —
                                      mark completed: true once
                                      aftermath has played

   Branch identification: encounter lines declare
   setsFlags entries like 'rlyeh_resolution_purchase' /
   'emissary_signed' / 'reckoning_accepted'. The branch flag
   passed to chooseBranch must be one of those strings; the
   service writes it to npc_public_flags and stores it on
   encounter_progress.branchChosen for fast UI.
   ═══════════════════════════════════════════════════════ */

import { and, eq, sql } from "drizzle-orm";

import { encounterProgress, npcPublicFlags } from "../../db/schema";
import {
  MALKIA_REVOLUTION_QUESTLINE,
  MALKIA_REVOLUTION_STEPS,
  MASTER_OF_RLYEH_LINES,
  PALE_EMISSARY_LINES,
  RECKONING_DAUGHTER_LINES,
  SOURCE_KAEL_DIALOGUE_LINES,
  type EncounterLine,
  type EncounterPhase,
} from "../../shared/encounters";
import { getDb } from "../db";
import { logger } from "../logger";

export type EncounterId =
  | "master_of_rlyeh"
  | "pale_emissary"
  | "reckoning_daughter"
  | "malkia_revolution"
  | "source_kael";

export const ENCOUNTER_IDS: readonly EncounterId[] = [
  "master_of_rlyeh",
  "pale_emissary",
  "reckoning_daughter",
  "malkia_revolution",
  "source_kael",
];

const ENCOUNTER_LINES: Readonly<Record<EncounterId, ReadonlyArray<EncounterLine>>> = {
  master_of_rlyeh: MASTER_OF_RLYEH_LINES,
  pale_emissary: PALE_EMISSARY_LINES,
  reckoning_daughter: RECKONING_DAUGHTER_LINES,
  malkia_revolution: MALKIA_REVOLUTION_QUESTLINE,
  source_kael: SOURCE_KAEL_DIALOGUE_LINES,
};

const ENCOUNTER_DISPLAY: Readonly<Record<EncounterId, { name: string; minAct: number }>> = {
  master_of_rlyeh: { name: "Master of R'lyeh", minAct: 5 },
  pale_emissary: { name: "Pale Emissary", minAct: 6 },
  reckoning_daughter: { name: "Reckoning Daughter", minAct: 7 },
  malkia_revolution: { name: "Malkia Ukweli", minAct: 5 },
  source_kael: { name: "The Source / Kael", minAct: 7 },
};

export interface EncounterStatus {
  encounterId: EncounterId;
  name: string;
  minAct: number;
  phase: EncounterPhase;
  branchChosen: string | null;
  completed: boolean;
  step: number | null;
  /** True if the player has not yet started this encounter. */
  notStarted: boolean;
}

const PHASE_ORDER: readonly EncounterPhase[] = [
  "entry",
  "negotiation",
  "resolution",
  "aftermath",
];

// ─── Reads ─────────────────────────────────────────────────

async function readPublicFlags(userId: number): Promise<Set<string>> {
  const db = await getDb();
  const out = new Set<string>();
  if (!db) return out;
  try {
    const rows = await db
      .select({ flag: npcPublicFlags.flag })
      .from(npcPublicFlags)
      .where(eq(npcPublicFlags.userId, userId));
    for (const r of rows) out.add(r.flag);
  } catch (err) {
    logger.warn("[encounterDispatcher] readPublicFlags failed:", err);
  }
  return out;
}

async function readProgress(
  userId: number,
  encounterId: EncounterId,
) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(encounterProgress)
    .where(and(
      eq(encounterProgress.userId, userId),
      eq(encounterProgress.encounterId, encounterId),
    ))
    .limit(1);
  return row ?? null;
}

// ─── Filtering ─────────────────────────────────────────────

/**
 * Filter encounter lines to those the player can hear right
 * now: their phase must match, their requiresFlag (if any)
 * must be set, their forbidFlag (if any) must NOT be set.
 *
 * For Malkia, also gate on the active step — each MALKIA_STEP_N
 * is its own phase-keyed bundle, so the Malkia walk is
 * step-then-phase rather than phase alone.
 */
export function filterLinesForPhase(args: {
  encounterId: EncounterId;
  phase: EncounterPhase;
  step: number | null;
  flags: ReadonlySet<string>;
}): readonly EncounterLine[] {
  const lines = ENCOUNTER_LINES[args.encounterId];
  // Malkia uses step buckets — collapse to the chosen step's
  // lines first, then filter by phase.
  const stepLines: readonly EncounterLine[] =
    args.encounterId === "malkia_revolution" && args.step
      ? (MALKIA_REVOLUTION_STEPS[`step${args.step}` as keyof typeof MALKIA_REVOLUTION_STEPS] ?? [])
      : lines;

  return stepLines.filter((line) => {
    if (line.phase !== args.phase) return false;
    if (line.requiresFlag && !args.flags.has(line.requiresFlag)) return false;
    if (line.forbidFlag && args.flags.has(line.forbidFlag)) return false;
    return true;
  });
}

// ─── Public API ────────────────────────────────────────────

/**
 * Read every encounter's progress (or notStarted=true) for a
 * given user. Drives the encounter list UI.
 */
export async function getEncounterStatus(
  userId: number,
): Promise<EncounterStatus[]> {
  const db = await getDb();
  if (!db) {
    return ENCOUNTER_IDS.map((encounterId) => ({
      encounterId,
      name: ENCOUNTER_DISPLAY[encounterId].name,
      minAct: ENCOUNTER_DISPLAY[encounterId].minAct,
      phase: "entry" as EncounterPhase,
      branchChosen: null,
      completed: false,
      step: null,
      notStarted: true,
    }));
  }
  const rows = await db
    .select()
    .from(encounterProgress)
    .where(eq(encounterProgress.userId, userId));
  const byId = new Map(rows.map((r) => [r.encounterId as EncounterId, r]));
  return ENCOUNTER_IDS.map((encounterId) => {
    const row = byId.get(encounterId);
    return {
      encounterId,
      name: ENCOUNTER_DISPLAY[encounterId].name,
      minAct: ENCOUNTER_DISPLAY[encounterId].minAct,
      phase: (row?.phase ?? "entry") as EncounterPhase,
      branchChosen: row?.branchChosen ?? null,
      completed: row?.completed ?? false,
      step: row?.step ?? null,
      notStarted: !row,
    };
  });
}

/**
 * Open an encounter at the entry phase. Idempotent — if a row
 * already exists, returns its current state without resetting.
 */
export async function openEncounter(
  userId: number,
  encounterId: EncounterId,
): Promise<EncounterStatus> {
  const db = await getDb();
  if (!db) {
    return {
      encounterId,
      name: ENCOUNTER_DISPLAY[encounterId].name,
      minAct: ENCOUNTER_DISPLAY[encounterId].minAct,
      phase: "entry",
      branchChosen: null,
      completed: false,
      step: encounterId === "malkia_revolution" ? 1 : null,
      notStarted: false,
    };
  }
  const existing = await readProgress(userId, encounterId);
  if (existing) {
    return {
      encounterId,
      name: ENCOUNTER_DISPLAY[encounterId].name,
      minAct: ENCOUNTER_DISPLAY[encounterId].minAct,
      phase: existing.phase as EncounterPhase,
      branchChosen: existing.branchChosen ?? null,
      completed: existing.completed,
      step: existing.step ?? null,
      notStarted: false,
    };
  }
  const initialStep = encounterId === "malkia_revolution" ? 1 : null;
  await db.insert(encounterProgress).values({
    userId,
    encounterId,
    phase: "entry",
    step: initialStep,
  });
  return {
    encounterId,
    name: ENCOUNTER_DISPLAY[encounterId].name,
    minAct: ENCOUNTER_DISPLAY[encounterId].minAct,
    phase: "entry",
    branchChosen: null,
    completed: false,
    step: initialStep,
    notStarted: false,
  };
}

/**
 * Return the line bundle for the player's current phase, with
 * flag-aware filtering.
 */
export async function currentLines(
  userId: number,
  encounterId: EncounterId,
): Promise<readonly EncounterLine[]> {
  const progress = await readProgress(userId, encounterId);
  if (!progress) return [];
  const flags = await readPublicFlags(userId);
  return filterLinesForPhase({
    encounterId,
    phase: progress.phase as EncounterPhase,
    step: progress.step ?? null,
    flags,
  });
}

/**
 * Record the player's branch pick. Writes the chosen flag to
 * npc_public_flags so existing reactsToPublicFlag NPC banks
 * pick it up, and stores the chosen branch on the row for fast
 * UI reads. Idempotent.
 */
export async function chooseBranch(
  userId: number,
  encounterId: EncounterId,
  branchFlag: string,
): Promise<{ ok: boolean }> {
  const db = await getDb();
  if (!db) return { ok: false };

  await db
    .insert(npcPublicFlags)
    .values({ userId, flag: branchFlag, setBy: "encounter" })
    .onDuplicateKeyUpdate({
      set: { flag: sql`${npcPublicFlags.flag}` },
    });
  await db
    .update(encounterProgress)
    .set({ branchChosen: branchFlag })
    .where(and(
      eq(encounterProgress.userId, userId),
      eq(encounterProgress.encounterId, encounterId),
    ));
  return { ok: true };
}

/**
 * Advance to the next phase. entry → negotiation → resolution
 * → aftermath. After aftermath, the encounter completes.
 * Malkia is special-cased: each Malkia step is internally
 * phased, so advancing past aftermath increments the step
 * (1..6) and resets phase back to entry. Step 6's aftermath
 * completes the whole questline.
 */
export async function advancePhase(
  userId: number,
  encounterId: EncounterId,
): Promise<{ ok: boolean; phase: EncounterPhase; step: number | null; completed: boolean }> {
  const db = await getDb();
  if (!db) return { ok: false, phase: "entry", step: null, completed: false };

  const progress = await readProgress(userId, encounterId);
  if (!progress) {
    return { ok: false, phase: "entry", step: null, completed: false };
  }
  if (progress.completed) {
    return {
      ok: true,
      phase: progress.phase as EncounterPhase,
      step: progress.step ?? null,
      completed: true,
    };
  }

  // Write the just-played phase's setsFlags to npc_public_flags
  // so cross-system reactions fire. Filter to lines whose flags
  // we care about (any setsFlags entry — encounter content keeps
  // it tight). Idempotent on the unique (userId, flag) index.
  const flags = await readPublicFlags(userId);
  const justPlayed = filterLinesForPhase({
    encounterId,
    phase: progress.phase as EncounterPhase,
    step: progress.step ?? null,
    flags,
  });
  for (const line of justPlayed) {
    for (const flag of line.setsFlags ?? []) {
      try {
        await db
          .insert(npcPublicFlags)
          .values({ userId, flag, setBy: "encounter" })
          .onDuplicateKeyUpdate({
            set: { flag: sql`${npcPublicFlags.flag}` },
          });
      } catch (err) {
        logger.warn(`[encounterDispatcher] write flag ${flag} failed:`, err);
      }
    }
  }

  // After Malkia step 4 plays (phrase echo) the
  // act4_malkia_phrase_echo flag is now set. The
  // antiquarianMalkiaRevealStage resolver advances on it.
  // No service-side action needed — the flag write above
  // suffices; companion comments + the resolver pick it up.

  // After any encounter that touches Engineer-arc flags, run
  // the Vex reveal advancer in case engineer_zero_confirmed
  // is now reachable.
  if (encounterId === "source_kael" || encounterId === "malkia_revolution") {
    try {
      const { advanceVexRevealIfReady } = await import("./vexRevealAdvancer");
      void advanceVexRevealIfReady(userId);
    } catch (err) {
      logger.warn("[encounterDispatcher] vex advancer call failed:", err);
    }
  }

  const currentPhaseIdx = PHASE_ORDER.indexOf(progress.phase as EncounterPhase);
  if (currentPhaseIdx < PHASE_ORDER.length - 1) {
    const nextPhase = PHASE_ORDER[currentPhaseIdx + 1];
    await db
      .update(encounterProgress)
      .set({ phase: nextPhase })
      .where(eq(encounterProgress.id, progress.id));
    return { ok: true, phase: nextPhase, step: progress.step ?? null, completed: false };
  }

  // We're at aftermath. For Malkia, increment the step (or
  // complete if step 6). For others, complete now.
  if (encounterId === "malkia_revolution") {
    const currentStep = progress.step ?? 1;
    if (currentStep < 6) {
      const nextStep = currentStep + 1;
      await db
        .update(encounterProgress)
        .set({ phase: "entry", step: nextStep, branchChosen: null })
        .where(eq(encounterProgress.id, progress.id));
      return { ok: true, phase: "entry", step: nextStep, completed: false };
    }
  }

  await db
    .update(encounterProgress)
    .set({ completed: true })
    .where(eq(encounterProgress.id, progress.id));
  return {
    ok: true,
    phase: progress.phase as EncounterPhase,
    step: progress.step ?? null,
    completed: true,
  };
}

/**
 * Convenience: complete the encounter explicitly. Used by tests
 * and by 'walk to end' flows that don't tick phase by phase.
 */
export async function completeEncounter(
  userId: number,
  encounterId: EncounterId,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(encounterProgress)
    .set({ completed: true })
    .where(and(
      eq(encounterProgress.userId, userId),
      eq(encounterProgress.encounterId, encounterId),
    ));
}
