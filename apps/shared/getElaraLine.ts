// F6 — single adapter for consumers migrating onto the companion
// substrate. Resolves a lineId to a CompanionLine record, preferring an
// authored entry in elaraLines.ts / humanLines.ts / lockedDoorLines.ts
// but falling through to a synthetic record when only a VO manifest
// mapping exists (legacy surfaces). Legacy callers that still pass raw
// text can wrap it with synthFromText() below.

import type { CompanionLine } from "./companion";
import { ELARA_LINES } from "./elaraLines";
import { HUMAN_LINES } from "./humanLines";
import { LOCKED_DOOR_LINES } from "./lockedDoorLines";
import elaraVoManifest from "./elaraVoManifest.json";
import humanVoManifest from "./humanVoManifest.json";

const REGISTRY = new Map<string, CompanionLine>();
for (const line of [...ELARA_LINES, ...HUMAN_LINES, ...LOCKED_DOOR_LINES]) {
  REGISTRY.set(line.lineId, line);
}

const ELARA_VO_IDS = new Set(Object.keys(elaraVoManifest as Record<string, string>));
const HUMAN_VO_IDS = new Set(Object.keys(humanVoManifest as Record<string, string>));

/**
 * Resolve a lineId to a full CompanionLine record.
 *
 * - First tries the authored registry (elaraLines + humanLines + lockedDoor).
 * - Falls back to a synthetic text-less record with `voId` set when the id
 *   exists in the VO manifest. Consumers treat this as "play the audio, no
 *   typewriter" — still inside the F13 scheduler so double-VO is impossible.
 * - Returns null when neither authored nor in-manifest.
 */
export function getElaraLine(lineId: string): CompanionLine | null {
  const authored = REGISTRY.get(lineId);
  if (authored) return authored;
  if (ELARA_VO_IDS.has(lineId)) {
    return {
      lineId,
      speaker: "elara",
      text: "",
      voId: lineId,
      priority: 1,
      interruptible: true,
      dismissible: "auto",
      durationMs: 4000,
    };
  }
  if (HUMAN_VO_IDS.has(lineId)) {
    return {
      lineId,
      speaker: "human",
      text: "",
      voId: lineId,
      priority: 1,
      interruptible: true,
      dismissible: "auto",
      durationMs: 4000,
    };
  }
  return null;
}

/** Build an ad-hoc line from raw text (for legacy surfaces that don't
 *  yet have a lineId). Not registered; caller owns lifecycle. */
export function synthFromText(text: string, speaker: "elara" | "human" = "elara"): CompanionLine {
  return {
    lineId: `__synth_${Math.random().toString(36).slice(2, 10)}`,
    speaker,
    text,
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: Math.max(3000, Math.min(12000, text.length * 60)),
  };
}
