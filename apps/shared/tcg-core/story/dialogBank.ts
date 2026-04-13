/**
 * Dialog bank — the resolver for all pre-match / post-match /
 * cinematic dialog ids referenced in encounter data.
 *
 * Every `preMatchDialog`, `postMatchWinDialog`, `postMatchLossDialog`,
 * and `show_cinematic` action in `tutorial.ts` and `chapters.ts`
 * points at a string id like "dialog_ch1_pre". This file holds
 * the actual content those ids resolve to.
 *
 * The content is split across several files by concern:
 *   - `dialogBank_tutorial.ts` — tutorial pre/post match cues
 *   - `dialogBank_chapters_1_3.ts` — story chapters 1-3
 *   - `dialogBank_chapters_4_6.ts` — story chapters 4-6
 *   - `dialogBank_chapters_7_9.ts` — story chapters 7-9
 *   - `dialogBank_chapters_10_12.ts` — story chapters 10-12
 *   - `dialogBank_cinematics.ts` — show_cinematic scenes
 *   - `dialogBank_matchlifecycle.ts` — mulligan, match start,
 *     BBS cast, victory/defeat, AI taunt-on-play
 *
 * This split keeps each file under the 300-line anti-timeout cap.
 */

/** Every cue belongs to a speaker. Speakers mostly align with the
 *  companion system plus in-universe boss characters and the
 *  Engineer's pre-recorded mix tapes. */
export type DialogSpeaker =
  | "elara"
  | "the_human"
  | "engineer"
  | "narrator"
  | "agent_zero"
  | "iron_lion"
  | "wraith_calder"
  | "the_jailer"
  | "akai_shi"
  | "necromancer"
  | "white_oracle"
  | "dr_vox"
  | "the_detective"
  | "the_enigma"
  | "the_degen"
  | "foucault"
  | "the_collector"
  | "the_architect"
  | "the_source"
  | "locke"
  | "antiquarian"
  | "the_oracle"
  | string;

/** Mood tag — same palette as tutorial steps, extended slightly
 *  for boss characters. Drives portrait animation + accent color. */
export type DialogMood =
  | "warm"
  | "guarded"
  | "curious"
  | "protective"
  | "conflicted"
  | "reflective"
  | "menacing"
  | "grieving"
  | "triumphant"
  | "broken"
  | "cryptic";

/** A single line of dialog. Multiple cues chain into a scene
 *  (pre-match dialog is typically 2-4 cues). */
export interface DialogCue {
  /** Stable id the cue is keyed by within its scene. */
  speaker: DialogSpeaker;
  /** Mood for portrait / accent / TTS delivery. */
  mood?: DialogMood;
  /** The line itself, written to be spoken aloud. */
  text: string;
  /**
   * Optional audio clip id. When set, the FNORD-23 capture hook
   * will write this cue into the memory resin bank the first
   * time the player hears it, so it becomes remixable.
   */
  audioClipId?: string;
  /**
   * Optional internal monologue — rendered as italic sub-text
   * beneath the main line, not spoken. Matches the client-side
   * `internalMonologue` pattern used in story chapters.
   */
  internal?: string;
}

/** A scene is an ordered list of cues resolved by a single
 *  dialog id (e.g. "dialog_ch1_pre"). */
export interface DialogScene {
  id: string;
  /** Human-readable label for editor tools + debug logs. */
  label: string;
  /** Which system this scene belongs to. */
  kind: "tutorial_pre" | "tutorial_post_win" | "tutorial_post_loss"
      | "chapter_pre" | "chapter_post_win" | "chapter_post_loss"
      | "cinematic" | "match_lifecycle";
  cues: readonly DialogCue[];
}

/* ═══════════════════════════════════════════════════════
   REGISTRY
   The master bank is assembled from imported sub-registries.
   D3+ commits add new sub-files and spread them in here.
   ═══════════════════════════════════════════════════════ */

import { DIALOG_BANK_TUTORIAL } from "./dialogBank_tutorial";
import { DIALOG_BANK_CHAPTERS_1_3 } from "./dialogBank_chapters_1_3";
import { DIALOG_BANK_CHAPTERS_4_6 } from "./dialogBank_chapters_4_6";
import { DIALOG_BANK_CHAPTERS_7_9 } from "./dialogBank_chapters_7_9";
import { DIALOG_BANK_CHAPTERS_10_12 } from "./dialogBank_chapters_10_12";
import { DIALOG_BANK_CINEMATICS } from "./dialogBank_cinematics";
import { DIALOG_BANK_MATCH_LIFECYCLE } from "./dialogBank_matchlifecycle";
import { CHESS_TUTORIAL_SCENES } from "./chessTutorial";

/** All registered scenes, assembled from every sub-file. */
const ALL_SCENES: readonly DialogScene[] = Object.freeze([
  ...DIALOG_BANK_TUTORIAL,
  ...DIALOG_BANK_CHAPTERS_1_3,
  ...DIALOG_BANK_CHAPTERS_4_6,
  ...DIALOG_BANK_CHAPTERS_7_9,
  ...DIALOG_BANK_CHAPTERS_10_12,
  ...DIALOG_BANK_CINEMATICS,
  ...DIALOG_BANK_MATCH_LIFECYCLE,
  ...CHESS_TUTORIAL_SCENES,
]);

export const DIALOG_BANK: Readonly<Record<string, DialogScene>> =
  Object.freeze(
    Object.fromEntries(ALL_SCENES.map((scene) => [scene.id, scene])),
  );

/** Resolve a dialog id. Returns undefined for unknown ids so
 *  the caller can decide whether that's an error or a no-op
 *  (tutorial ids that haven't been authored yet, for example).
 *  In dev we log a warning so missing content is visible. */
export function resolveDialog(id: string | undefined): DialogScene | undefined {
  if (!id) return undefined;
  const scene = DIALOG_BANK[id];
  if (!scene && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(`[dialogBank] No scene registered for id '${id}'`);
  }
  return scene;
}

/** Count of registered scenes — for the "coverage" badge
 *  in an admin / debug UI. */
export function getDialogBankCoverage(): {
  total: number;
  byKind: Record<string, number>;
} {
  const entries = Object.values(DIALOG_BANK);
  const byKind: Record<string, number> = {};
  for (const scene of entries) {
    byKind[scene.kind] = (byKind[scene.kind] ?? 0) + 1;
  }
  return { total: entries.length, byKind };
}
