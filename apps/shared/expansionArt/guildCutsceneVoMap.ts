/* ═══════════════════════════════════════════════════════
   GUILD CUTSCENE VO MAP — pairs the visual cutscenes in
   guildCutscenesManifest.ts with the VO lines authored in
   apps/scripts/guild-cutscene-vo-lines.json.

   Built by parsing each line's `context` field for its
   cs_id (and, for F.4 signature abilities, the light/dark
   variant suffix). The pairing is what the GuildCutscenePlayer
   uses to spin up the right MP4 + audio simultaneously.

   Some cutscenes in the visual registry have no VO line
   (e.g. cs_emote_archon_12_architects_study — the player's
   own archon is silent); some VO lines fan out to multiple
   tier visuals (cs_hall_tier_up has elara_tier_2..5 paired).

   This module is the cross-link; both sides remain editable
   independently — adding a VO line with a new cs_id reference
   just shows up here without code changes.
   ═══════════════════════════════════════════════════════ */

import linesData from "../../scripts/guild-cutscene-vo-lines.json" with { type: "json" };
import {
  type GuildCutsceneVariant,
  guildCutsceneById,
} from "./guildCutscenesManifest";

/** A single VO line as authored in the lines-file. */
export interface GuildCutsceneVoLine {
  /** Unique line id, e.g. "kanevas_harmonize_001". */
  id: string;
  /** Speaker key — matches the per-character VO manifest stem
   *  (kanevas → kanevasVoManifest.json). */
  speaker: string;
  /** ElevenLabs voice id used to generate the audio. */
  voiceId: string;
  /** Manifest stem the audio URL lives under. */
  manifest: string;
  /** Spoken text, useful for subtitles + accessibility. */
  text: string;
  /** Author's free-form context with the cs_id reference. */
  context: string;
  /** Logical section header, e.g. "F.4 Signature Abilities (light)". */
  section: string;
  /** Emotion preset hint for ElevenLabs at generation time. */
  emotion: string;
}

/** Pairing of a single VO line with its visual cutscene id. */
export interface GuildCutsceneVoPair extends GuildCutsceneVoLine {
  /** Matches the `id` of an entry in GUILD_CUTSCENES (after the
   *  variant suffix is applied for F.4 abilities). */
  csId: string;
  /** F.4 ability variant. Undefined for non-F.4 cutscenes. */
  variant?: GuildCutsceneVariant;
}

const ALL_LINES = linesData as readonly GuildCutsceneVoLine[];

/* ─── Context parser ─── */
/* The author's context string follows a stable shape:
 *   "F.4.1 light cs_sig_1 — Headmaster Kanevas casts Harmonize"
 *   "F.2.4.a cs_emote_archon_1 — chorus tooltip-only emote sticker"
 *   "F.3.1 cs_war_declared — twin banner-slam"
 * The first cs_<token> match is the visual id; F.4 lines also carry
 * a "light" or "dark" word before the cs_sig_N. */
const CS_ID_RE = /\b(cs_[a-z0-9_]+)\b/;

function parseContext(context: string): {
  csId: string | null;
  variant: GuildCutsceneVariant | null;
} {
  const csMatch = context.match(CS_ID_RE);
  if (!csMatch) return { csId: null, variant: null };
  const csId = csMatch[1];
  let variant: GuildCutsceneVariant | null = null;
  if (context.startsWith("F.4")) {
    if (/\blight\b/.test(context)) variant = "light";
    else if (/\bdark\b/.test(context)) variant = "dark";
  }
  return { csId, variant };
}

/** Resolve a base cs_id + optional variant to the concrete registry
 *  id (cs_sig_1 + light → cs_sig_1_light). */
function resolveRegistryCsId(
  baseCsId: string,
  variant: GuildCutsceneVariant | null,
): string {
  return variant ? `${baseCsId}_${variant}` : baseCsId;
}

/* ─── Build pairs at module load ─── */
const PAIRS: readonly GuildCutsceneVoPair[] = ALL_LINES.map((line) => {
  const { csId: baseCsId, variant } = parseContext(line.context);
  if (!baseCsId) {
    return { ...line, csId: "", variant: undefined };
  }
  return {
    ...line,
    csId: resolveRegistryCsId(baseCsId, variant),
    variant: variant ?? undefined,
  };
}).filter((p) => p.csId.length > 0);

/* ─── Indexes ─── */
const BY_CS_ID = new Map<string, GuildCutsceneVoPair[]>();
const BY_VO_LINE_ID = new Map<string, GuildCutsceneVoPair>();
for (const pair of PAIRS) {
  const arr = BY_CS_ID.get(pair.csId) ?? [];
  arr.push(pair);
  BY_CS_ID.set(pair.csId, arr);
  BY_VO_LINE_ID.set(pair.id, pair);
}

/* ─── Public API ─── */

export const GUILD_CUTSCENE_VO_PAIRS: readonly GuildCutsceneVoPair[] = PAIRS;

/** All VO lines paired to a given cutscene. Most return 0 or 1; F.5
 *  cs_hall_tier_up returns 4 (one per tier). */
export function getCsVoLines(csId: string): readonly GuildCutsceneVoPair[] {
  return BY_CS_ID.get(csId) ?? [];
}

/** Look up the visual cutscene id paired to a given VO line. */
export function getVoLineCsId(voLineId: string): string | undefined {
  return BY_VO_LINE_ID.get(voLineId)?.csId;
}

/** Resolve a VO line id to its full pair (line + csId + variant). */
export function getVoLine(voLineId: string): GuildCutsceneVoPair | undefined {
  return BY_VO_LINE_ID.get(voLineId);
}

/** True if the visual cutscene exists in GUILD_CUTSCENES. Useful for
 *  test coverage. */
export function isResolvableCsId(csId: string): boolean {
  return Boolean(guildCutsceneById(csId));
}
