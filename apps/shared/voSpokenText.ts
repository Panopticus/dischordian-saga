/* ═══════════════════════════════════════════════════════
   VO SPOKEN-TEXT NORMALISER

   Many *-lines.json banks were authored with producer-facing stage
   directions baked into the `text` field — `[CUE 0:00]`, `[Voice
   direction: warm, allow breath at line ends.]`, `[SPOKEN]`, etc.
   ElevenLabs Multilingual v2 does not interpret bracketed prose as
   direction; it speaks it literally. Without normalisation the player
   hears the cue card read out loud before every line.

   `spokenText()` returns the line as it should be sent to TTS:

     • strips a leading run of one-or-more `[...]` blocks (the
       producer prefix) plus any whitespace that follows
     • strips any further `[...]` block when it sits on its own line
       or directly between sentences (mid-line cue inserts)
     • collapses the resulting blank-line run that the strip leaves
       behind so the line doesn't open with a fake pause

   Authored asterisk-wrapped emotional cues (`*warmly* …`) are left
   alone because they live in apps/scripts/generate-elara-vo.ts as
   per-emotion `text_prefix` strings the TTS pass already chooses to
   omit by setting `fullText = text`. If you ever add a different
   prefix convention, gate it here so the same normalisation runs in
   every voice generator. ════════════════════════════════════════ */

/** Strip producer-facing stage directions from a line's `text` field
 *  so it is safe to send to ElevenLabs TTS. Idempotent — calling it
 *  twice yields the same result. When stripping would empty the line
 *  entirely (the whole content was bracketed, e.g. a narrator-action
 *  beat like "[The Hierophant does not look up.]"), the original is
 *  returned unchanged — that bracket IS the line, not a cue card. */
export function spokenText(raw: string): string {
  if (!raw) return raw;
  let s = raw;

  // 1. Leading bracket-block run. Matches one or more `[…]` groups
  //    separated by whitespace at the very start of the text, e.g.
  //    `[CUE 0:00] [Voice direction: warm.]Real line begins here.`
  s = s.replace(/^\s*(?:\[[^\]]*\]\s*)+/, "");

  // 2. Mid-line bracket cues that follow a sentence terminator or sit
  //    on their own line. Examples:
  //      `…ends.\n[CUE 1:05] More text.` → `…ends.\n More text.`
  //      `…ends.  [PATH-A VARIANT.] More text.` → `…ends.  More text.`
  //    We deliberately do NOT touch in-line parenthetical content like
  //    "(callsign)" or "(today is circled)" — those are part of the
  //    spoken line, not direction.
  s = s.replace(/(^|[.!?]\s+|\n\s*)\[[^\]]*\]\s*/g, "$1");

  // 3. Collapse the run of blank lines a removed cue can leave behind.
  s = s.replace(/\n{3,}/g, "\n\n");

  s = s.trim();

  // 4. Fallback: if every word turned out to live inside a bracket,
  //    the bracket IS the line — a narrator-action beat the producer
  //    wrote as the spoken content rather than a producer cue card.
  //    Leave it intact rather than ship the player a blank dialog
  //    bubble.
  if (!s) return raw.trim();

  return s;
}

/** Convenience predicate — returns true iff `raw` carries any stage
 *  direction the spoken-text normaliser would strip. Used by audits
 *  and tests so adding a stage direction to an authored line is
 *  caught at lint time. */
export function hasStageDirection(raw: string): boolean {
  if (!raw) return false;
  return spokenText(raw) !== raw.trim();
}
