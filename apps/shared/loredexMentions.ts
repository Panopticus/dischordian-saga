/**
 * Loredex mention-line bank — NPC depth #9 (the "mentioned by"
 * injection layer).
 *
 * Each entry is a voiced line spoken by a priority-roster NPC that
 * name-drops a specific Loredex entry. The client renders these as
 * tap-targets that open the named entry's detail page (and play its
 * narrator bio memo, if available, from loredexVoManifest).
 *
 * Lines are gated by trust band — the selector should only surface a
 * mention line whose `trustBandMin` is at-or-below the player's
 * current band (resolved per NPC via apps/shared/npcs/registry.ts).
 *
 * Authoring source: apps/scripts/loredex-mention-lines.json. The
 * authored file is kept under apps/scripts/ because the per-character
 * VO generators read from there; this wrapper exposes the same data
 * to runtime code with a typed shape.
 */
import linesData from "../scripts/loredex-mention-lines.json" with {
  type: "json",
};

import type { NpcKey } from "./npcs/types";

export interface LoredexMentionLine {
  /** Stable selector id; matches the VO manifest entry once generated. */
  id: string;
  /** Speaking NPC. Voice + register come from the speaker's bible. */
  speaker: NpcKey;
  /** The Loredex entry this line name-drops. */
  mentionTargetEntryId: string;
  /**
   * Minimum trust band (matched against the speaker's NpcProfile.trustBands)
   * for this line to be eligible. The selector composes with the standard
   * faction-loyalty modifier in registry.ts before resolving the band.
   */
  trustBandMin: string;
  /** The voiced line text. */
  text: string;
  /** Emotion preset (matches per-character VO generators' EMOTION_SETTINGS). */
  emotion: string;
  /** Source-file marker for ship-check + audit traceability. */
  file: string;
}

export const LOREDEX_MENTION_LINES: ReadonlyArray<LoredexMentionLine> =
  linesData as ReadonlyArray<LoredexMentionLine>;

/** Mention lines spoken by a particular NPC. */
export function mentionLinesFor(speaker: NpcKey): ReadonlyArray<LoredexMentionLine> {
  return LOREDEX_MENTION_LINES.filter(line => line.speaker === speaker);
}

/** Mention lines that name-drop a particular Loredex entry. */
export function mentionsOf(entryId: string): ReadonlyArray<LoredexMentionLine> {
  return LOREDEX_MENTION_LINES.filter(line => line.mentionTargetEntryId === entryId);
}

/** All distinct speakers in the bank. */
export function mentionSpeakers(): ReadonlyArray<NpcKey> {
  return Array.from(new Set(LOREDEX_MENTION_LINES.map(l => l.speaker)));
}

/** All distinct mention targets in the bank. */
export function mentionTargets(): ReadonlyArray<string> {
  return Array.from(new Set(LOREDEX_MENTION_LINES.map(l => l.mentionTargetEntryId)));
}
