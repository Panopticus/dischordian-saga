/* ═══════════════════════════════════════════════════════
   SECOND CHAIR — selector + corruption renderer

   Pure / deterministic. Same context in, same advice out.

   Selection pipeline:
     1. Filter the corpus to fragments whose archetypes match
        the requested archetype OR include "general".
     2. If the player has not reached engineer_zero_confirmed
        (or bondTier < 3), strip vexAware fragments.
     3. Hash (missionId + revealStage) to pick a stable index.
     4. Compute hauntedness from reconstructionConfidence and
        revealStage.
     5. Apply the fragment's defaultCorruption pattern at the
        computed intensity. Below 0.2 the renderer returns the
        clean text — that's how the player notices Vex's model
        improving over the campaign.
   ═══════════════════════════════════════════════════════ */

import { SECOND_CHAIR_CORPUS } from "./corpus";
import type {
  SecondChairAdvice,
  SecondChairAdviceContext,
  SecondChairCorruption,
  SecondChairFragment,
} from "./types";

const CORRUPTION_FLOOR = 0.2;

export function getSecondChairAdvice(
  ctx: SecondChairAdviceContext,
): SecondChairAdvice {
  const eligible = SECOND_CHAIR_CORPUS.filter((f) =>
    f.archetypes.includes(ctx.archetype) || f.archetypes.includes("general"),
  );
  const filtered = filterByReveal(eligible, ctx);
  if (filtered.length === 0) {
    // Defensive: corpus always contains general fragments, so
    // this branch fires only if a future edit removes them.
    return {
      fragmentId: "te-sc-empty",
      rendered: "",
      hauntedness: 0,
      isVexAware: false,
    };
  }

  const idx =
    hashString(`${ctx.missionId}:${ctx.revealStage}`) % filtered.length;
  const fragment = filtered[idx];

  const hauntedness = computeHauntedness(ctx);
  const rendered = applyCorruption(
    fragment.text,
    fragment.defaultCorruption ?? "none",
    hauntedness,
  );

  return {
    fragmentId: fragment.id,
    rendered,
    hauntedness,
    isVexAware: fragment.vexAware ?? false,
  };
}

function filterByReveal(
  fragments: readonly SecondChairFragment[],
  ctx: SecondChairAdviceContext,
): readonly SecondChairFragment[] {
  const allowVexAware =
    ctx.revealStage === "engineer_zero_confirmed" && ctx.vexBondTier >= 3;
  return fragments.filter((f) => allowVexAware || !f.vexAware);
}

function computeHauntedness(ctx: SecondChairAdviceContext): number {
  let h = 1 - ctx.reconstructionConfidence;
  if (ctx.revealStage === "vex_public") h += 0.3;
  if (ctx.revealStage === "engineer_zero_confirmed") h -= 0.2;
  return clamp01(h);
}

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

/**
 * Deterministic 32-bit FNV-1a hash. We don't need cryptographic
 * properties — only stability across runs.
 */
function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

export function applyCorruption(
  text: string,
  pattern: SecondChairCorruption,
  intensity: number,
): string {
  if (intensity < CORRUPTION_FLOOR) return text;
  switch (pattern) {
    case "none":
      return text;
    case "stutter":
      return renderStutter(text, intensity);
    case "fade":
      return renderFade(text, intensity);
    case "loop":
      return renderLoop(text, intensity);
    case "interrupt":
      return renderInterrupt(text, intensity);
  }
}

function renderStutter(text: string, intensity: number): string {
  // Repeat the first word once, then prepend an em-dash + space.
  const firstSpace = text.indexOf(" ");
  if (firstSpace < 0) return `— ${text}`;
  const first = text.slice(0, firstSpace);
  const rest = text.slice(firstSpace);
  if (intensity >= 0.6) {
    return `— ${first} — ${first}${rest}`;
  }
  return `${first} — ${first}${rest}`;
}

function renderFade(text: string, intensity: number): string {
  // Insert a "[…]" elision near the middle of the text. Higher
  // intensity moves the elision earlier (more is lost).
  const len = text.length;
  if (len < 12) return `${text} […]`;
  const cutBias = intensity >= 0.6 ? 0.45 : 0.65;
  const target = Math.floor(len * cutBias);
  const safeBoundary = nearestWordBoundary(text, target);
  return `${text.slice(0, safeBoundary).trimEnd()} […] ${text.slice(safeBoundary).trimStart()}`;
}

function renderLoop(text: string, _intensity: number): string {
  // Repeat the first short clause, then drift.
  const clauseEnd = findClauseEnd(text);
  const clause = text.slice(0, clauseEnd).trim();
  return `${clause}. ${clause}. Pardon. Drift.`;
}

function renderInterrupt(text: string, _intensity: number): string {
  // Cut the sentence at the first clause boundary, then resume.
  const clauseEnd = findClauseEnd(text);
  const head = text.slice(0, clauseEnd).trim();
  return `${head} — no. The next one.`;
}

function nearestWordBoundary(text: string, target: number): number {
  for (let off = 0; off < 16; off++) {
    if (target + off < text.length && text[target + off] === " ") return target + off;
    if (target - off > 0 && text[target - off] === " ") return target - off;
  }
  return target;
}

function findClauseEnd(text: string): number {
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "." || ch === "," || ch === ";" || ch === "—") return i;
  }
  // Fall back to first space (no clause punctuation found).
  const sp = text.indexOf(" ");
  return sp < 0 ? text.length : sp;
}
