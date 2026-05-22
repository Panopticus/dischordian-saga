/* ═══════════════════════════════════════════════════════
   VO SPOKEN-TEXT NORMALISER

   Many *-lines.json banks were authored with producer-facing stage
   directions baked into the `text` field — `[CUE 0:00]`, `[Voice
   direction: warm, allow breath at line ends.]`, `[SPOKEN]`, plus
   asterisk-wrapped action beats like `*She unfolds the paper.*`.
   ElevenLabs Multilingual v2 does not interpret these as direction;
   it speaks the cue cards out loud. Without normalisation the
   player hears "She unfolds the paper" before the actual line.

   `spokenText()` returns the line as it should be sent to TTS:

     • strips a leading run of one-or-more `[...]` blocks (the
       producer prefix) plus any whitespace that follows
     • strips any further `[...]` block when it sits on its own line
       or directly between sentences (mid-line cue inserts)
     • strips asterisk-wrapped stage directions — `*Sentence-shaped
       action beat.*` — anywhere in the line. Italics emphasis
       (`*for*`, `*Cause*`, `*unread first citation*`) keeps its
       inner text and just drops the asterisks; the heuristic that
       separates them is "ends with .!? and contains whitespace."
     • collapses the resulting blank-line run that the strip leaves
       behind so the line doesn't open with a fake pause

   Per-emotion `*warmly* …` prefixes wired into
   apps/scripts/generate-elara-vo.ts are NOT in line `text` —
   they're injected at TTS time and intentionally unused. The strip
   below only touches the authored content. ═════════════════════ */

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

  // 3. Asterisk-wrapped spans. Two flavours, separated by whether the
  //    span reads as a sentence:
  //      • `*She unfolds the paper.*`  — stage direction, drop fully
  //      • `*Cause*`, `*for*`, `*unread first citation*` — italics
  //        emphasis, keep the inner text, drop the asterisks only
  //    A span counts as a stage direction when it contains whitespace
  //    AND ends with sentence-terminal punctuation (`.`, `!`, `?`).
  //    Single-word emphasis like `*ack!*` has no whitespace, so it
  //    survives. Trailing comma / colon emphasis (`*okay,*`) has no
  //    terminal punct, so it survives too.
  s = s.replace(/\*([^*\n]+?)\*/g, (_match, inner) => {
    const trimmed = inner.trim();
    if (/\s/.test(trimmed) && /[.!?]$/.test(trimmed)) {
      // Stage direction — remove the whole span.
      return "";
    }
    // Italics emphasis — keep the inner word(s).
    return inner;
  });

  // 4. Tidy ONLY when the strip actually modified the line. Cleaning
  //    whitespace unconditionally would also "fix" prose-level typos
  //    like `Insurgency , renowned` → `Insurgency, renowned`, which
  //    is outside this normaliser's scope and produces false-positive
  //    hits in `hasStageDirection`. Restricting the tidy to actually
  //    stripped lines keeps every untouched line byte-identical to
  //    its `raw` (modulo the final trim).
  const modified = s !== raw;
  if (modified) {
    s = s.replace(/[ \t]{2,}/g, " ");
    s = s.replace(/\s+([.!?,;:])/g, "$1");
    s = s.replace(/\n{3,}/g, "\n\n");
  }

  s = s.trim();

  // 5. Fallback: if every word turned out to live inside a bracket,
  //    the bracket IS the line — a narrator-action beat the producer
  //    wrote as the spoken content rather than a producer cue card.
  //    Leave it intact rather than ship the player a blank dialog
  //    bubble. (Asterisk-wrapped lines have already been collapsed
  //    by step 3, so the same fallback covers them too.)
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
