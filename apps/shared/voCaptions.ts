/**
 * VO captions — accessibility surface for the voice-over system.
 *
 * Every VO line key in the saga has a matching script line in one
 * of the per-character `*-lines.json` files. This module is the
 * single place the client reads captions from, so adding a new
 * speaker means dropping a captions file in one place.
 *
 * The structure intentionally matches the audio manifest pattern
 * (`*VoManifest.json`) so a new caption file is a parallel-write to
 * the existing generation pipeline:
 *
 *   { "<lineKey>": { "text": "<spoken text>", "lang": "en" } }
 *
 * Future i18n: the same key with a different `lang` lives in a
 * sibling file. The client picks the user's locale.
 *
 * Closes the WCAG 2.1 Level A gap flagged in the audit (no captions
 * for VO content). The infrastructure is here; populating it from
 * the existing per-character lines.json files is a follow-up
 * mechanical pass.
 */

export interface CaptionEntry {
  /** The spoken line text, ready to render. */
  text: string;
  /** BCP-47 language tag. Default "en". */
  lang?: string;
  /**
   * Optional speaker label — useful when a single VO clip contains
   * multiple speakers (rare; mostly cutscenes).
   */
  speaker?: string;
}

export type CaptionManifest = Record<string, CaptionEntry>;

/**
 * Lookup helper. Returns null when the key is missing — surfaces
 * the gap to UI rather than silently swallowing it.
 */
export function lookupCaption(
  manifest: CaptionManifest | undefined,
  lineKey: string,
): CaptionEntry | null {
  if (!manifest) return null;
  return manifest[lineKey] ?? null;
}

/**
 * Build a captions manifest from a per-character lines structure.
 * Most VO generators read JSON files shaped like
 *   { "<lineKey>": "<spoken text>" }
 * (or { "<lineKey>": { "text": "...", "voiceId": "..." } }).
 * Convert that into a manifest in one pass.
 */
export function buildCaptionManifestFromLines(
  lines: Record<string, string | { text?: string; speaker?: string }>,
  defaults: { lang?: string; speaker?: string } = {},
): CaptionManifest {
  const out: CaptionManifest = {};
  for (const [key, value] of Object.entries(lines)) {
    if (typeof value === "string") {
      out[key] = { text: value, lang: defaults.lang ?? "en", speaker: defaults.speaker };
    } else if (value && typeof value === "object" && typeof value.text === "string") {
      out[key] = {
        text: value.text,
        lang: defaults.lang ?? "en",
        speaker: value.speaker ?? defaults.speaker,
      };
    }
  }
  return out;
}
