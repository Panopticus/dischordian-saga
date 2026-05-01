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

/* ═══════════════════════════════════════════════════════
   Cutscene-trigger helpers — each wraps the cs_id + voLineId
   shape that <GuildCutscenePlayer> consumes. Server routers
   and engine event-emitters can drop these into their return
   payloads so the client triggers the right cutscene without
   re-deriving the id from event metadata.
   ═══════════════════════════════════════════════════════ */

/** A pair of (csId, voLineId) that the client can render
 *  directly via `<GuildCutscenePlayer csId voLineId />`. */
export interface CutsceneTrigger {
  csId: string;
  /** Specific paired VO line. Omitted when the cutscene has 0 or 1
   *  paired lines and no disambiguation is needed. */
  voLineId?: string;
}

/** F.5.1 hall-tier-up trigger. `newTier` is the tier the guild just
 *  reached (2..5; tier 1 → tier 2 plays elara_tier_2_001, etc.). */
export function tierUpCutscene(newTier: 2 | 3 | 4 | 5): CutsceneTrigger {
  return {
    csId: "cs_hall_tier_up",
    voLineId: `elara_tier_${newTier}_001`,
  };
}

/** F.5.3 signature-room-unlock trigger. Recognises the two
 *  bible-canonical signature rooms; falls back to the generic
 *  cs_room_unlock for non-signature rooms. Returns null if the
 *  room id is unknown — caller decides whether to no-op or treat
 *  that as a programming error. */
export function roomUnlockCutscene(roomId: string): CutsceneTrigger | null {
  switch (roomId) {
    case "oracle_pool":
      return {
        csId: "cs_signature_room_unlock_oracle_pool",
        voLineId: "vex_oracle_001",
      };
    case "portal_chamber":
      return {
        csId: "cs_signature_room_unlock_portal_chamber",
        voLineId: "architect_portal_001",
      };
    case "main_hall":
    case "mess_hall":
    case "war_room":
    case "training_ground":
    case "armory_vault":
    case "research_wing":
    case "trophy_gallery":
    case "guild_vault":
    case "guild_shop":
    case "diplomatic_chamber":
      return { csId: "cs_room_unlock" };
    default:
      return null;
  }
}

/** F.4 signature-ability cast trigger. `professorId` matches the
 *  speaker key in guild-cutscene-vo-lines.json (kanevas | aoki | … |
 *  proctor); `isCorrupted` selects the dark variant. Returns null
 *  for any non-Professor caster (the engine fires a normal cast
 *  effect with no cinematic). */
const PROFESSOR_TO_SIG_N: Record<string, number> = {
  kanevas: 1, aoki: 2, halverez: 3, orphic: 4, mireille: 5, kasra: 6,
  vellis: 7, greenshaw: 8, vex: 9, vasara: 10, vent: 11, proctor: 12,
};

export function signatureCutsceneFor(
  professorId: string,
  isCorrupted: boolean,
): CutsceneTrigger | null {
  const n = PROFESSOR_TO_SIG_N[professorId];
  if (!n) return null;
  const variant = isCorrupted ? "dark" : "light";
  // The voLineId is always the first (and only) paired line for
  // cs_sig_N_<variant>. Look it up so a future re-author of the
  // lines file doesn't desync this helper.
  const csId = `cs_sig_${n}_${variant}`;
  const lines = getCsVoLines(csId);
  return { csId, voLineId: lines[0]?.id };
}

/** F.2 / F.3 narrative-event trigger. `eventType` is one of the
 *  bible-canonical event names emitted by the guildWars router. */
export type GuildWarEventType =
  | "contract_unlock"
  | "contract_complete"
  | "house_cup_weekly_reset"
  | "donation_milestone"
  | "war_declared"
  | "war_first_blood"
  | "war_mvp_crowned"
  | "war_victory"
  | "war_defeat"
  | "alliance_war_placement_lock"
  | "thought_virus_reinfection"
  | "epoch_change_privacy"
  | "epoch_change_prophecy"
  | "epoch_change_insurgency"
  | "epoch_change_revelation"
  | "epoch_change_fall";

export function warEventCutscene(eventType: GuildWarEventType): CutsceneTrigger {
  const csId = `cs_${eventType}`;
  const lines = getCsVoLines(csId);
  return { csId, voLineId: lines[0]?.id };
}
