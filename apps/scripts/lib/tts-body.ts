/**
 * Shared helper for assembling the ElevenLabs TTS request body.
 *
 * Historical bug: two of the per-source VO generators
 * (generate-content-pass-vo.ts, generate-episode-vo.ts) used to
 * concatenate a per-speaker `text_prefix` containing italicised
 * stage directions (e.g. `*spoken low and steady, conspiratorial*`)
 * directly onto the spoken line and feed the whole string to
 * ElevenLabs. The actor read the directions aloud.
 *
 * This module is the chokepoint for the assembly site so the
 * test in apps/scripts/__tests__/vo-tts-body.test.ts can guard
 * both generators with a single assertion instead of duplicating
 * the check in each file.
 */

export interface TtsLineInput {
  /** The line as authored. Should already be clean (line.text in
   *  the generators is post-`cleanForTts` for content-pass; cue.text
   *  in episode dialogs is plain prose). The helper strips any
   *  leftover direction markers as a last line of defence. */
  text: string;
}

/** Returns the string assigned to the `text` field of the
 *  ElevenLabs POST body. Strips italic/asterisk-wrapped stage
 *  directions, parenthetical asides, and bracketed markers so
 *  the actor never reads them aloud. */
export function buildTtsBody(input: TtsLineInput): string {
  return input.text
    .replace(/\*[^*]*\*/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Per-speaker voice_settings as authored on the speaker config.
 *  The numeric values map directly to the ElevenLabs request shape. */
export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

/** A small set of nudges on top of a speaker's base voice_settings.
 *  Each field overrides the base when set; absent fields leave the
 *  base value alone. */
export interface VoiceSettingsDelta {
  stability?: number;
  similarity_boost?: number;
  style?: number;
}

/** Translate the prose direction (the field formerly known as
 *  `text_prefix`) into conservative numeric nudges on the speaker's
 *  base voice_settings. The base config already encodes most of
 *  the character; this function only resolves obvious mismatches
 *  between the prose intent and the numbers.
 *
 *  The mappings are intentionally narrow and case-insensitive:
 *
 *    "low and steady / patient / never raises / laconic"
 *      → stability ≥ 0.65, style ≤ 0.15
 *    "warm / lucid / audible breath / gentle"
 *      → style ≥ 0.25
 *    "meticulous / precise / archival / clinical"
 *      → stability ≥ 0.65, style ≤ 0.18
 *    "theological / permeable / present-tense"
 *      → style ≥ 0.4
 *
 *  Multiple matches compose; later clauses can lift `style` after
 *  earlier clauses lowered it (the most-recent match wins for the
 *  same field). */
export function tuneFromDirection(direction: string | undefined | null): VoiceSettingsDelta {
  if (!direction) return {};
  const d = direction.toLowerCase();
  const out: VoiceSettingsDelta = {};

  if (/(low and steady|never raises|laconic|long pauses|never hurries|patient|measured|quiet)/.test(d)) {
    out.stability = 0.65;
    out.style = 0.15;
  }
  if (/(warm|lucid|audible breath|softer register|tender|gentle)/.test(d)) {
    if (out.style === undefined || out.style < 0.25) out.style = 0.25;
  }
  if (/(meticulous|precise|archival|surgeon|surveillance|clinical|formal)/.test(d)) {
    out.stability = Math.max(out.stability ?? 0, 0.65);
    out.style = Math.min(out.style ?? 1, 0.18);
  }
  if (/(theological|permeable|present-tense|cadence of attention)/.test(d)) {
    out.style = 0.4;
  }

  return out;
}

/** Apply a delta on top of base voice_settings. Returns a fresh
 *  object suitable for direct serialisation in the ElevenLabs POST. */
export function applyDelta(
  base: VoiceSettings,
  delta: VoiceSettingsDelta,
): VoiceSettings {
  return {
    stability: delta.stability ?? base.stability,
    similarity_boost: delta.similarity_boost ?? base.similarity_boost,
    style: delta.style ?? base.style,
    use_speaker_boost: base.use_speaker_boost,
  };
}
