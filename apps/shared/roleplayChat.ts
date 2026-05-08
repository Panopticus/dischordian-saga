/* ═══════════════════════════════════════════════════════════════════
   ROLEPLAY CHAT — message-parser + IC/OOC vocabulary.

   Pure utility module shared between client (render) and server
   (validation). No DB, no React, no node-only deps.

   Three things live here:

     parseChatAction(text)   — recognise /me, /em, /whisper, /ic, /ooc
                                prefixes; return a discriminated
                                union the renderer can switch on.

     factionVocabulary(f)    — IC verb-table per faction. The
                                Insurgency calls treasury "cache",
                                the Empire calls a guild war an
                                "affirmation", etc. Driven from one
                                table so renaming is cheap.

     INNER_VOICE_LABELS      — display labels for the 7 Inner Voice
                                archetypes, mirroring INNER_VOICE_PROFILES
                                in apps/shared/innerVoiceSkills.ts.
   ═══════════════════════════════════════════════════════════════════ */

export type ChatActionMode = "say" | "emote" | "whisper" | "ic" | "ooc";

export interface ChatAction {
  mode: ChatActionMode;
  /** Stripped message body (prefix removed). */
  body: string;
  /** Whisper-only: the recipient handle as parsed from /whisper <name> ... */
  whisperTo?: string;
}

/**
 * Parse a raw chat-input string into an action. The first token of
 * the message is matched against known prefixes; everything else is
 * `body`. Unknown prefixes fall through to `say`.
 */
export function parseChatAction(rawInput: string): ChatAction {
  const trimmed = rawInput.trim();
  if (!trimmed.startsWith("/")) return { mode: "say", body: trimmed };

  const spaceIdx = trimmed.indexOf(" ");
  const tag = (spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx)).toLowerCase();
  const rest = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1);

  switch (tag) {
    case "/me":
    case "/em":
    case "/emote":
      return { mode: "emote", body: rest };
    case "/ic":
      return { mode: "ic", body: rest };
    case "/ooc":
      return { mode: "ooc", body: rest };
    case "/w":
    case "/whisper":
    case "/tell": {
      // /whisper <handle> <body>
      const innerSpace = rest.indexOf(" ");
      if (innerSpace === -1) {
        // No body; treat as no-op "say" so the user sees it didn't go.
        return { mode: "say", body: trimmed };
      }
      return {
        mode: "whisper",
        whisperTo: rest.slice(0, innerSpace),
        body: rest.slice(innerSpace + 1),
      };
    }
    default:
      // Unknown slash command — leave as-is so it isn't silently eaten.
      return { mode: "say", body: trimmed };
  }
}

/**
 * Faction vocabulary — the seven IC verbs each faction renames.
 * Keep this list short on purpose; bigger tables drift.
 */
export const FACTION_VOCABULARY = {
  empire: {
    treasury: "Tithe",
    war: "Affirmation",
    raid: "Levy",
    council: "Edict Chamber",
    member: "Citizen",
    cell: "Chamber",
    motto: "Edict",
  },
  insurgency: {
    treasury: "Cache",
    war: "Strike",
    raid: "Hit",
    council: "Cell Roundtable",
    member: "Operative",
    cell: "Cell",
    motto: "Rite",
  },
  witness: {
    treasury: "Reliquary",
    war: "Reckoning",
    raid: "Vigil",
    council: "Choir",
    member: "Witness",
    cell: "Circle",
    motto: "Vow",
  },
  neutral: {
    treasury: "Treasury",
    war: "War",
    raid: "Raid",
    council: "Council",
    member: "Member",
    cell: "Chapter",
    motto: "Compact",
  },
} as const;

export type FactionKey = keyof typeof FACTION_VOCABULARY;

export function factionVocabulary(f: FactionKey | string | null | undefined) {
  if (!f) return FACTION_VOCABULARY.neutral;
  if (f in FACTION_VOCABULARY) return FACTION_VOCABULARY[f as FactionKey];
  return FACTION_VOCABULARY.neutral;
}

/** Display labels for the 7 inner-voice archetypes. */
export const INNER_VOICE_LABELS = {
  aggression: "Aggression",
  mercy: "Mercy",
  curiosity: "Curiosity",
  conformity: "Conformity",
  vigilance: "Vigilance",
  vulnerability: "Vulnerability",
  wit: "Wit",
} as const;

export type InnerVoiceKey = keyof typeof INNER_VOICE_LABELS;

/**
 * Predefined "calling" archetypes — the player's chosen IC label,
 * shown on the dossier. Free-form `calling` is also allowed; this
 * list is just the menu of recommended canon-aligned options.
 */
export const CALLING_OPTIONS = [
  "Vessel",
  "Cell-Runner",
  "Witness",
  "Archon",
  "Hierophant",
  "Antiquarian's Hand",
  "Engineer",
  "Programmer",
  "Apprentice",
  "Sentinel",
  "Voidkeeper",
  "Crewmate",
  "Strike-Captain",
  "Reckoner",
  "Survivor",
] as const;

/** Recommended pronoun forms — IC-flavored, but normal pronouns work too. */
export const PRONOUN_OPTIONS = [
  "she/her",
  "he/him",
  "they/them",
  "she/they",
  "he/they",
  "called Vessel",
  "called Cell-Runner",
  "called Witness",
  "addressed as Archon",
] as const;

/**
 * Compute the ISO-week key ("YYYY-Www") for a given Date. Used for
 * the Confession Booth one-per-week constraint and parity with the
 * existing users.signupWeek convention.
 */
export function isoWeekKey(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * Trial-category labels in canonical sort-order. Mirrors the
 * `resolveTrialCategories.test.ts` invariant from tcg-core.
 */
export const TRIAL_CATEGORY_LABELS = {
  confession: "Confession",
  defensive: "Defense",
  evidence: "Evidence",
  narrative: "Narrative",
  offensive: "Offensive",
  reactive: "Reactive",
} as const;

export type TrialCategoryKey = keyof typeof TRIAL_CATEGORY_LABELS;
