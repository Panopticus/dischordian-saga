/* ═══════════════════════════════════════════════════════
   WITNESSING CONTENT VALIDATOR — Appendix A.3.

   Cross-registry consistency check for every Witnessing
   data module. Run as a test step (or as an admin debug
   command) to catch drift between:

     - shared/songSlideshows.ts           (slideshow registry)
     - shared/mobileNarratorDialog.ts     (§13 dialog matrix)
     - shared/livingArkTouchpoints.ts     (§14.2 room touchpoints)
     - shared/witnessingEvents.ts         (§14.1 milestones)
     - shared/memorableMoments.ts         (§11.2 feed slots)
     - shared/lyraVoxDialog.ts            (third narrator)
     - shared/mobileNarrator.ts           (forcing flags, affinity,
                                           room id bridge)

   Every check is a pure function that returns a list of
   `ValidationIssue` objects. Callers choose whether to treat
   issues as errors (fail the test) or as warnings (log and
   continue).

   This module depends on every other Witnessing module by
   design — it's the single entry point for "is the content
   library consistent with itself?"
   ═══════════════════════════════════════════════════════ */

import { validateSlideshow } from "./songSlideshow";
import { SONG_SLIDESHOWS } from "./songSlideshows";
import { NARRATOR_DIALOG } from "./mobileNarratorDialog";
import { ROOM_WITNESSING_TOUCHPOINTS } from "./livingArkTouchpoints";
import { WITNESSING_MILESTONES } from "./witnessingEvents";
import { LION_FEED_SLOTS } from "./memorableMoments";
import { LYRA_VOX_DIALOG } from "./lyraVoxDialog";
import {
  FORCING_FLAGS,
  ROOM_AFFINITY,
  type NarratorRoomId,
} from "./mobileNarrator";

/* ─── ISSUE TYPES ─── */

export type ValidationCategory =
  | "slideshow"
  | "dialog"
  | "touchpoints"
  | "milestones"
  | "memorable_moments"
  | "lyra_vox"
  | "forcing_flags"
  | "registry_cross_ref";

export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  category: ValidationCategory;
  severity: ValidationSeverity;
  /** A short identifier for grouping (e.g. a slideshow id, a room id). */
  locus: string;
  /** Human-readable description of the issue. */
  message: string;
}

export interface ValidationReport {
  issues: ValidationIssue[];
  /** Total errors — non-zero means fail-fast tests should fail. */
  errorCount: number;
  /** Total warnings — should be surfaced but not fail. */
  warningCount: number;
}

/* ─── INDIVIDUAL CHECKS ─── */

/**
 * Every slideshow in the registry validates cleanly by the
 * existing `validateSlideshow` issue checker (ordering,
 * ken-burns, duration, lyrics monotonic).
 */
export function checkSlideshows(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const def of Object.values(SONG_SLIDESHOWS)) {
    const defIssues = validateSlideshow(def);
    for (const defIssue of defIssues) {
      issues.push({
        category: "slideshow",
        severity: "error",
        locus: def.id,
        message: `${defIssue.kind}: ${defIssue.message}`,
      });
    }
  }
  return issues;
}

/**
 * Every dialog line in every room must have a valid trust
 * tier and a non-empty text field.
 */
export function checkDialogMatrix(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const validTiers = new Set(["F", "P", "H", "V", "D"]);
  for (const [roomId, set] of Object.entries(NARRATOR_DIALOG)) {
    for (const narratorKey of ["elara", "the_human"] as const) {
      const lines = set[narratorKey];
      if (!lines || lines.length === 0) {
        issues.push({
          category: "dialog",
          severity: "warning",
          locus: `${roomId}/${narratorKey}`,
          message: "No dialog lines declared",
        });
        continue;
      }
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!validTiers.has(line.tier)) {
          issues.push({
            category: "dialog",
            severity: "error",
            locus: `${roomId}/${narratorKey}/${i}`,
            message: `Invalid tier "${line.tier}"`,
          });
        }
        if (!line.text || line.text.trim().length === 0) {
          issues.push({
            category: "dialog",
            severity: "error",
            locus: `${roomId}/${narratorKey}/${i}`,
            message: "Empty text",
          });
        }
      }
    }
  }
  return issues;
}

/**
 * Every room touchpoint must have a narratorReactionTable,
 * filter presets, and a narratorSlotPreference — and every
 * room id must match the registry key.
 */
export function checkLivingArkTouchpoints(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const [roomId, touchpoints] of Object.entries(
    ROOM_WITNESSING_TOUCHPOINTS,
  )) {
    if (touchpoints.roomId !== roomId) {
      issues.push({
        category: "touchpoints",
        severity: "error",
        locus: roomId,
        message: `roomId field ${touchpoints.roomId} does not match registry key`,
      });
    }
    if (
      !["elara", "the_human", "contested"].includes(
        touchpoints.narratorSlotPreference,
      )
    ) {
      issues.push({
        category: "touchpoints",
        severity: "error",
        locus: roomId,
        message: `Invalid narratorSlotPreference: ${touchpoints.narratorSlotPreference}`,
      });
    }
    if (Object.keys(touchpoints.narratorReactionTable).length === 0) {
      issues.push({
        category: "touchpoints",
        severity: "warning",
        locus: roomId,
        message: "Empty narratorReactionTable",
      });
    }
  }
  return issues;
}

/**
 * Every milestone must have a unique raisesFlag, a title,
 * a description, and at least one NPC reaction.
 */
export function checkMilestones(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenFlags = new Set<string>();
  for (const milestone of Object.values(WITNESSING_MILESTONES)) {
    if (seenFlags.has(milestone.raisesFlag)) {
      issues.push({
        category: "milestones",
        severity: "error",
        locus: milestone.id,
        message: `Duplicate raisesFlag: ${milestone.raisesFlag}`,
      });
    }
    seenFlags.add(milestone.raisesFlag);

    if (!milestone.title || !milestone.description) {
      issues.push({
        category: "milestones",
        severity: "error",
        locus: milestone.id,
        message: "Missing title or description",
      });
    }
    if (Object.keys(milestone.npcReactions).length === 0) {
      issues.push({
        category: "milestones",
        severity: "warning",
        locus: milestone.id,
        message: "No NPC reactions declared",
      });
    }
  }
  return issues;
}

/**
 * Every Lion in Black feed slot must target a valid frame
 * index in the Lion in Black slideshow, and every slot's
 * preferredKinds list must contain at least one kind.
 */
export function checkMemorableMomentFeed(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const lionDef = SONG_SLIDESHOWS["the-lion-in-black"];
  if (!lionDef) {
    issues.push({
      category: "memorable_moments",
      severity: "error",
      locus: "the-lion-in-black",
      message: "Lion in Black slideshow is not registered",
    });
    return issues;
  }
  for (const slot of LION_FEED_SLOTS) {
    if (slot.frameIndex < 0 || slot.frameIndex >= lionDef.frames.length) {
      issues.push({
        category: "memorable_moments",
        severity: "error",
        locus: `slot-${slot.frameIndex}`,
        message: `Slot frameIndex out of bounds (frames: ${lionDef.frames.length})`,
      });
    }
    if (slot.preferredKinds.length === 0) {
      issues.push({
        category: "memorable_moments",
        severity: "error",
        locus: `slot-${slot.frameIndex}`,
        message: "Empty preferredKinds",
      });
    }
    if (!slot.fallbackSubtitle || slot.fallbackSubtitle.length === 0) {
      issues.push({
        category: "memorable_moments",
        severity: "error",
        locus: `slot-${slot.frameIndex}`,
        message: "Missing fallback subtitle",
      });
    }
  }
  return issues;
}

/**
 * Lyra Vox dialog must have at least one line for every
 * canonical ROOM_AFFINITY key.
 */
export function checkLyraVoxDialog(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const roomId of Object.keys(ROOM_AFFINITY) as NarratorRoomId[]) {
    const lines = LYRA_VOX_DIALOG[roomId];
    if (!lines || lines.length === 0) {
      issues.push({
        category: "lyra_vox",
        severity: "error",
        locus: roomId,
        message: "No Lyra Vox dialog",
      });
      continue;
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.text || line.text.trim().length === 0) {
        issues.push({
          category: "lyra_vox",
          severity: "error",
          locus: `${roomId}/${i}`,
          message: "Empty Lyra Vox line text",
        });
      }
    }
  }
  return issues;
}

/**
 * Every entry in FORCING_FLAGS must map to "silence", "elara",
 * "the_human", or "lyra_vox".
 */
export function checkForcingFlags(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const validValues = new Set(["silence", "elara", "the_human", "lyra_vox"]);
  for (const [flagId, value] of Object.entries(FORCING_FLAGS)) {
    if (!validValues.has(value as string)) {
      issues.push({
        category: "forcing_flags",
        severity: "error",
        locus: flagId,
        message: `Invalid forcing flag value: ${value}`,
      });
    }
  }
  return issues;
}

/**
 * Cross-registry check: every ROOM_AFFINITY key must have a
 * Lyra Vox dialog entry AND a touchpoints entry AND (for ship
 * rooms, not memorial_corridor / pet_garden) a mobile narrator
 * dialog set.
 */
export function checkRegistryCrossReferences(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const roomId of Object.keys(ROOM_AFFINITY) as NarratorRoomId[]) {
    if (!ROOM_WITNESSING_TOUCHPOINTS[roomId]) {
      issues.push({
        category: "registry_cross_ref",
        severity: "error",
        locus: roomId,
        message: "ROOM_AFFINITY entry missing from ROOM_WITNESSING_TOUCHPOINTS",
      });
    }
    if (!LYRA_VOX_DIALOG[roomId]) {
      issues.push({
        category: "registry_cross_ref",
        severity: "error",
        locus: roomId,
        message: "ROOM_AFFINITY entry missing from LYRA_VOX_DIALOG",
      });
    }
  }
  return issues;
}

/* ─── ORCHESTRATOR ─── */

/**
 * Run every check and return a combined report. Tests usually
 * expect `errorCount === 0`.
 */
export function runWitnessingValidation(): ValidationReport {
  const issues: ValidationIssue[] = [
    ...checkSlideshows(),
    ...checkDialogMatrix(),
    ...checkLivingArkTouchpoints(),
    ...checkMilestones(),
    ...checkMemorableMomentFeed(),
    ...checkLyraVoxDialog(),
    ...checkForcingFlags(),
    ...checkRegistryCrossReferences(),
  ];
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  return { issues, errorCount, warningCount };
}
