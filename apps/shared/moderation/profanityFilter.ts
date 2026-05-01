/**
 * Profanity / spam filter for in-game chat surfaces.
 *
 * Pure, deterministic, no-DB. Designed to be the first line of defence
 * for guild chat, spectator chat, and any future user-text surface
 * (DMs, deck-share comments, etc). The filter never throws — it just
 * returns a verdict the caller can act on:
 *
 *   blocked === true   → reject the message at the API boundary; do
 *                        not persist it. Used for unambiguous slurs
 *                        that have no place in any community context.
 *
 *   flags includes ... → message is allowed but flagged. The caller
 *                        should persist `sanitized` (which may have
 *                        masked profanity, normalised excess caps,
 *                        or compressed character runs) and may also
 *                        store the flag set for moderator review.
 *
 * Detection model — one regex builder, two policies:
 *
 *   Block list  → leet-tolerant + separator-tolerant ("n.i.g.g.3.r"
 *                 still matches "nigger"). Word boundaries at start
 *                 and end so embedded substrings (the classic
 *                 "scunthorpe" false positive on "cunt") don't trip.
 *   Mask list   → leet-tolerant only. We don't aggressively decode
 *                 separator obfuscation here because (a) the punitive
 *                 stakes are lower and (b) over-eager masking annoys
 *                 well-behaved players in marginal cases.
 *
 * Order of sanitisation matters: caps-normalise and run-compress
 * happen on the *raw* text, then masking is applied last. If we
 * masked first, the asterisks themselves would trigger the
 * repeat-character spam detector and get compressed back to 3
 * characters — silently truncating the censorship.
 *
 * Word lists are intentionally short here. A production deployment
 * should load the canonical lists from server-side admin config and
 * pass them via `lists` — these defaults are calibrated to demonstrate
 * each filter behaviour, not to be the final word.
 */

export interface FilterFlags {
  /** True if the message should not be persisted at all. */
  readonly blocked: boolean;
  /** Original text with masking + caps + run-compression applied. */
  readonly sanitized: string;
  /** Stable flag identifiers; useful for storage + analytics. */
  readonly flags: readonly FilterFlag[];
  /** Concrete strings that triggered each flag — useful for moderator review. */
  readonly evidence: Readonly<Record<FilterFlag, readonly string[]>>;
}

export type FilterFlag = "blocked" | "masked" | "caps" | "spam" | "url";

export interface FilterLists {
  /** Block-list — message is rejected outright if any entry matches. */
  readonly blocked: readonly string[];
  /** Mask-list — entries are replaced with asterisks of matching length. */
  readonly masked: readonly string[];
}

export const DEFAULT_LISTS: FilterLists = {
  blocked: ["nigger", "faggot", "tranny", "retard"],
  masked: ["fuck", "shit", "cunt", "bitch", "asshole", "dick", "cock", "piss"],
};

const LEET_TABLE: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
  $: "s",
  "!": "i",
};

const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+|\b\S+\.(?:com|net|org|gg|io|xyz)\b/iu;
const REPEAT_CHAR_PATTERN = /(.)\1{3,}/u;
const CAPS_MIN_LETTERS = 8;
const CAPS_RATIO_THRESHOLD = 0.6;

const REGEX_META = /[.*+?^${}()|[\]\\]/g;

function escapeRegex(s: string): string {
  return s.replace(REGEX_META, "\\$&");
}

/** Build a character class that matches `ch` and any leet variants of it. */
function leetCharClass(ch: string): string {
  const variants = [ch];
  for (const [k, v] of Object.entries(LEET_TABLE)) {
    if (v === ch) variants.push(k);
  }
  if (variants.length === 1) return escapeRegex(ch);
  return `[${variants.map(escapeRegex).join("")}]`;
}

/**
 * Build a regex that matches `word` with leet tolerance and word
 * boundaries. If `obfuscated` is true, also tolerates non-word /
 * underscore separators between characters (so "n.i.g.g.e.r" matches
 * "nigger"). Without that flag, the regex is stricter and won't
 * mis-classify benign substrings.
 */
function buildWordRegex(
  word: string,
  obfuscated: boolean,
  flags: string,
): RegExp {
  const sep = obfuscated ? "[\\W_]*" : "";
  const inner = word.split("").map(leetCharClass).join(sep);
  return new RegExp(`\\b${inner}\\b`, flags);
}

const blockedRegexCache = new Map<string, RegExp>();
const maskedRegexCache = new Map<string, RegExp>();

function blockedRegex(word: string): RegExp {
  let r = blockedRegexCache.get(word);
  if (!r) {
    r = buildWordRegex(word, true, "iu");
    blockedRegexCache.set(word, r);
  }
  return r;
}

function maskedRegex(word: string): RegExp {
  let r = maskedRegexCache.get(word);
  if (!r) {
    r = buildWordRegex(word, false, "giu");
    maskedRegexCache.set(word, r);
  }
  return r;
}

function detectBlocked(raw: string, list: readonly string[]): string[] {
  const hits: string[] = [];
  for (const word of list) {
    if (blockedRegex(word).test(raw)) hits.push(word);
  }
  return hits;
}

function detectMasked(raw: string, list: readonly string[]): string[] {
  const hits: string[] = [];
  for (const word of list) {
    // .test() on a /g regex is stateful; reset before each probe.
    const re = maskedRegex(word);
    re.lastIndex = 0;
    if (re.test(raw)) hits.push(word);
  }
  return hits;
}

function applyMasks(text: string, hits: readonly string[]): string {
  let out = text;
  for (const word of hits) {
    const re = maskedRegex(word);
    re.lastIndex = 0;
    out = out.replace(re, (m) => "*".repeat(m.length));
  }
  return out;
}

function isCapsHeavy(text: string): boolean {
  let letters = 0;
  let upper = 0;
  for (const ch of text) {
    if (ch >= "a" && ch <= "z") letters++;
    else if (ch >= "A" && ch <= "Z") {
      letters++;
      upper++;
    }
  }
  if (letters < CAPS_MIN_LETTERS) return false;
  return upper / letters >= CAPS_RATIO_THRESHOLD;
}

function normaliseCaps(text: string): string {
  return text.replace(/[A-Z]+/gu, (m) => m[0] + m.slice(1).toLowerCase());
}

function compressRuns(text: string): string {
  return text.replace(/(.)\1{3,}/gu, (_m, ch) => `${ch}${ch}${ch}`);
}

/**
 * Apply the filter. See file header for the order-of-operations
 * rationale (caps + spam transforms run before masking so the mask
 * asterisks don't get re-classified as spam).
 */
export function filterMessage(
  raw: string,
  lists: FilterLists = DEFAULT_LISTS,
): FilterFlags {
  const flags: FilterFlag[] = [];
  const evidence: Record<FilterFlag, string[]> = {
    blocked: [],
    masked: [],
    caps: [],
    spam: [],
    url: [],
  };

  // 1. Block list — short-circuit. Sanitized field echoes raw input
  // for downstream logging.
  const blockedHits = detectBlocked(raw, lists.blocked);
  if (blockedHits.length > 0) {
    flags.push("blocked");
    evidence.blocked = blockedHits;
    return {
      blocked: true,
      sanitized: raw,
      flags,
      evidence: freezeEvidence(evidence),
    };
  }

  // 2. Detection passes — all run against the *raw* text so the
  // transforms below don't pollute each other's signal.
  const maskedHits = detectMasked(raw, lists.masked);
  const capsHit = isCapsHeavy(raw);
  const spamMatch = raw.match(REPEAT_CHAR_PATTERN);
  const urlMatch = raw.match(URL_PATTERN);

  // 3. Transforms — order: spam-compress → caps-normalise → mask.
  // Mask MUST come last; otherwise the asterisks would re-trigger
  // spam compression (4 stars → 3 stars) and silently truncate the
  // censorship.
  let working = raw;

  if (spamMatch) {
    flags.push("spam");
    evidence.spam = [spamMatch[0]];
    working = compressRuns(working);
  }

  if (capsHit) {
    flags.push("caps");
    evidence.caps = [raw];
    working = normaliseCaps(working);
  }

  if (maskedHits.length > 0) {
    flags.push("masked");
    evidence.masked = maskedHits;
    working = applyMasks(working, maskedHits);
  }

  if (urlMatch) {
    flags.push("url");
    evidence.url = [urlMatch[0]];
  }

  return {
    blocked: false,
    sanitized: working,
    flags,
    evidence: freezeEvidence(evidence),
  };
}

function freezeEvidence(
  e: Record<FilterFlag, string[]>,
): Readonly<Record<FilterFlag, readonly string[]>> {
  return {
    blocked: Object.freeze([...e.blocked]),
    masked: Object.freeze([...e.masked]),
    caps: Object.freeze([...e.caps]),
    spam: Object.freeze([...e.spam]),
    url: Object.freeze([...e.url]),
  };
}
