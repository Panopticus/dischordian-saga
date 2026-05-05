/* ═══════════════════════════════════════════════════════
   ROMANCE SCENE LOGIC — pure helpers

   Extracted from RomanceScenePlayer so the path-aware variant
   filter and the DMC-stage-3 naming-fork detection can be unit
   tested without rendering React. The component imports these.
   ═══════════════════════════════════════════════════════ */

import {
  ROMANCE_SCENE_BANKS,
  type RomanceNpcId,
} from "@shared/npcs/romanceScenes";
import type { NpcLine } from "@shared/npcs/types";

export interface DmcChoiceBeats {
  question: NpcLine;
  partner: NpcLine;
  kin: NpcLine;
}

/**
 * Filter the romance scene bank for a given (npcId, stage)
 * against the player's currently-active public + narrative
 * flags. Drops scene lines whose `reactsToPublicFlag` does not
 * appear in the active set — that's how Locke's Disclosure
 * vs Betrayal stage-3 variants are gated.
 */
export function selectStageBeats(
  npcId: RomanceNpcId,
  stage: number,
  activeFlags: ReadonlySet<string>,
): readonly NpcLine[] {
  const bank = ROMANCE_SCENE_BANKS[npcId] ?? [];
  return bank
    .filter((line) => line.lineId.includes(`.s${stage}.`))
    .filter((line) => {
      if (!line.reactsToPublicFlag) return true;
      return activeFlags.has(line.reactsToPublicFlag);
    });
}

/**
 * Detect the DMC stage-3 naming-fork (kin-name vs partner-name).
 * Returns null if the bank doesn't contain the fork (i.e. it
 * isn't DMC at stage 3, or one of the fork lines is missing).
 */
export function detectDmcChoice(
  npcId: RomanceNpcId,
  stage: number,
  beats: readonly NpcLine[],
): DmcChoiceBeats | null {
  if (npcId !== "dmc_companion" || stage !== 3) return null;
  const partner = beats.find((l) =>
    (l.setsFlags ?? []).includes("dmc_naming_partner_branch"),
  );
  const kin = beats.find((l) =>
    (l.setsFlags ?? []).includes("dmc_naming_kin_branch"),
  );
  const question = beats.find((l) =>
    (l.setsFlags ?? []).includes("dmc_companion_naming_offered"),
  );
  if (!partner || !kin || !question) return null;
  return { question, partner, kin };
}

/**
 * Splice the chosen DMC branch back into the beat sequence at
 * the position immediately after the question, omitting the
 * unchosen branch entirely. Returns the original sequence
 * untouched if there's no fork or no pick yet.
 */
export function withDmcPick(
  beats: readonly NpcLine[],
  fork: DmcChoiceBeats | null,
  pick: "partner" | "kin" | null,
): readonly NpcLine[] {
  if (!fork) return beats;
  const base = beats.filter(
    (l) => l.lineId !== fork.partner.lineId && l.lineId !== fork.kin.lineId,
  );
  if (!pick) return base;
  const chosen = pick === "partner" ? fork.partner : fork.kin;
  const qIdx = base.findIndex((l) => l.lineId === fork.question.lineId);
  if (qIdx < 0) return [...base, chosen];
  return [...base.slice(0, qIdx + 1), chosen, ...base.slice(qIdx + 1)];
}

/**
 * Split a scene line into stage-direction (parenthesised) and
 * dialog parts so the renderer can style them differently.
 * Stage directions render dim italic; dialog renders in the
 * speaker's accent colour.
 */
export interface ScenePart {
  kind: "stage" | "dialog";
  text: string;
}

export function splitOnParens(text: string): ScenePart[] {
  const parts: ScenePart[] = [];
  let depth = 0;
  let buf = "";
  let kind: ScenePart["kind"] = "dialog";
  for (const ch of text) {
    if (ch === "(") {
      if (depth === 0 && buf.length > 0) {
        parts.push({ kind, text: buf });
        buf = "";
      }
      depth++;
      buf += ch;
      kind = "stage";
    } else if (ch === ")") {
      depth = Math.max(0, depth - 1);
      buf += ch;
      if (depth === 0) {
        parts.push({ kind: "stage", text: buf });
        buf = "";
        kind = "dialog";
      }
    } else {
      buf += ch;
    }
  }
  if (buf.length > 0) parts.push({ kind, text: buf });
  return parts;
}
