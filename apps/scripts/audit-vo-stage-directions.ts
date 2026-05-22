#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   AUDIT VO STAGE DIRECTIONS

   Read-only sweep of every *-lines.json voice-bank under
   apps/scripts/ looking for stage-direction patterns that
   ElevenLabs Multilingual v2 would read aloud as part of the
   line. Reports findings by pattern + bank so the writer/
   producer can decide which to clean. Does NOT modify anything.

   Patterns scanned:

     A. [bracket-prefixed]       — already covered by the
                                   `strip-vo-stage-directions`
                                   cleanup; reported here so we
                                   can verify nothing regressed.

     B. *asterisk-wrapped*       — common Elevenlabs / Anthropic
                                   convention for tone direction
                                   (`*warmly*`, `*sighs softly*`).
                                   These do NOT influence the
                                   model — they're spoken.

     C. (parenthetical-cue)      — short-form tone hints like
                                   "(softly)" or "(with concern)"
                                   at the start of a line or
                                   between sentences. Mid-line
                                   parens are usually content
                                   ("(callsign)") so we only
                                   flag forms that LOOK like
                                   direction (single lowercase
                                   word or two, no proper noun).

     D. tone-word lead-in        — bare lead-ins like "Warmly,"
                                   or "Softly:" — rarer but real.

     E. ALL-CAPS bracketed       — already covered by A but
                                   counted separately so the
                                   producer can see how many
                                   cue cards survive.

   Usage:
     pnpm vo:audit-directions
   ═══════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPTS_DIR = __dirname;

interface LineEntry {
  id?: string;
  text?: string;
  directionNotes?: string;
  speaker?: string;
}

interface Finding {
  pattern: "A_bracket" | "B_asterisk" | "C_paren_cue" | "D_tone_leadin";
  file: string;
  id: string;
  speaker: string;
  excerpt: string;
  match: string;
}

/** Set of single-word tone cues commonly used as stage direction.
 *  Only flag when the word appears in isolation inside a paren or
 *  as a bare lead-in — otherwise these words have prose meaning. */
const TONE_WORDS = new Set([
  "softly", "warmly", "gently", "coldly", "harshly", "quietly", "loudly",
  "calmly", "tensely", "anxiously", "fearfully", "carefully", "slowly",
  "quickly", "urgently", "wearily", "tiredly", "sadly", "angrily",
  "bitterly", "sweetly", "tenderly", "sternly", "firmly", "lightly",
  "darkly", "drily", "wryly", "flatly", "evenly", "smoothly", "smugly",
  "whispered", "whispering", "shouting", "yelling", "sighing", "laughing",
  "crying", "sobbing", "muttering", "murmuring", "trembling", "shaking",
  "concerned", "amused", "annoyed", "exasperated", "relieved", "worried",
  "frightened", "delighted", "hopeful", "hopeless", "resigned",
  "analytical", "reassuring", "commanding", "vulnerable",
  // multi-word ones (paren only)
  "with concern", "with warmth", "with sadness", "with urgency",
  "with hope", "with gravity", "with authority",
  "speaking softly", "speaking warmly", "speaking gently",
  "matter-of-fact",
]);

/** Asterisk-wrapped span: `*tone*`, `*sighs softly*`, etc. */
const RE_ASTERISK = /\*([^*\n]{1,60})\*/g;

/** Parenthetical at the very start of a line OR after a sentence
 *  terminator, content limited so we don't trip on prose. */
const RE_PAREN_CUE = /(^|[.!?]\s+|\n\s*)\(([^()\n]{2,40})\)/g;

/** Bare tone-word lead-in like "Warmly," or "Softly:" — uppercase
 *  first letter, lowercase tone word, comma or colon. Rare. */
const RE_TONE_LEADIN = /^([A-Z][a-z]{3,20}),\s/;

function excerpt(s: string, around: string, span = 80): string {
  const i = s.indexOf(around);
  if (i < 0) return s.slice(0, span);
  const start = Math.max(0, i - 30);
  const end = Math.min(s.length, i + around.length + 30);
  return (start > 0 ? "…" : "") + s.slice(start, end).replace(/\n/g, " ") + (end < s.length ? "…" : "");
}

function isToneCue(inside: string): boolean {
  const t = inside.trim().toLowerCase();
  if (!t) return false;
  // Direct match against the tone vocabulary.
  if (TONE_WORDS.has(t)) return true;
  // "speaking <tone>" / "with <tone>" — already covered above for
  // a few; allow the prefix form generically too.
  if (/^(speaking|sounding|whispering|with)\s+\w+/.test(t)) return true;
  // Anthropic-style action labels: "sighs softly", "laughs nervously".
  if (/^(sighs?|laughs?|chuckles?|whispers?|murmurs?|nods?|gasps?)\b/.test(t)) return true;
  return false;
}

function scanFile(file: string): Finding[] {
  const lines = JSON.parse(fs.readFileSync(path.join(SCRIPTS_DIR, file), "utf8")) as LineEntry[];
  if (!Array.isArray(lines)) return [];
  const findings: Finding[] = [];
  for (const ln of lines) {
    if (typeof ln?.text !== "string" || typeof ln.id !== "string") continue;
    const text = ln.text;
    const speaker = ln.speaker ?? "?";

    // A — leading [bracket] block. Anything we haven't yet stripped.
    if (/^\s*\[[^\]]+\]/.test(text)) {
      const m = text.match(/^\s*\[[^\]]+\]/);
      findings.push({
        pattern: "A_bracket",
        file,
        id: ln.id,
        speaker,
        excerpt: excerpt(text, m![0]),
        match: m![0],
      });
    }

    // B — asterisk-wrapped spans.
    for (const m of text.matchAll(RE_ASTERISK)) {
      findings.push({
        pattern: "B_asterisk",
        file,
        id: ln.id,
        speaker,
        excerpt: excerpt(text, m[0]),
        match: m[0],
      });
    }

    // C — parenthetical tone cues (only flag if the inside looks
    // like a tone word, not prose).
    for (const m of text.matchAll(RE_PAREN_CUE)) {
      const inside = m[2];
      if (!isToneCue(inside)) continue;
      findings.push({
        pattern: "C_paren_cue",
        file,
        id: ln.id,
        speaker,
        excerpt: excerpt(text, `(${inside})`),
        match: `(${inside})`,
      });
    }

    // D — bare tone-word lead-in.
    const lead = text.match(RE_TONE_LEADIN);
    if (lead) {
      const word = lead[1].toLowerCase();
      if (TONE_WORDS.has(word)) {
        findings.push({
          pattern: "D_tone_leadin",
          file,
          id: ln.id,
          speaker,
          excerpt: excerpt(text, lead[0]),
          match: lead[0].trim(),
        });
      }
    }
  }
  return findings;
}

function main() {
  const files = fs.readdirSync(SCRIPTS_DIR).filter(n => n.endsWith("-lines.json"));
  const all: Finding[] = [];
  for (const f of files) {
    try {
      all.push(...scanFile(f));
    } catch {
      // skip malformed banks
    }
  }

  // Aggregate by pattern, then by file.
  const byPattern: Record<string, Finding[]> = {};
  for (const f of all) {
    (byPattern[f.pattern] ??= []).push(f);
  }

  const labels: Record<string, string> = {
    A_bracket:     "A. Leading [bracket] block (should be stripped)",
    B_asterisk:    "B. *asterisk-wrapped* tone spans (TTS speaks literally)",
    C_paren_cue:   "C. (parenthetical tone cues) — single-word matches",
    D_tone_leadin: "D. Bare tone-word lead-in (Warmly, / Softly,)",
  };

  console.log(`Scanned ${files.length} voice-bank files.\n`);
  for (const [key, label] of Object.entries(labels)) {
    const items = byPattern[key] ?? [];
    console.log(`${label} — ${items.length} hit(s)`);
    if (items.length === 0) continue;
    const byFile: Record<string, Finding[]> = {};
    for (const it of items) (byFile[it.file] ??= []).push(it);
    for (const [file, fs2] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
      console.log(`  ${file} — ${fs2.length}`);
      for (const f of fs2.slice(0, 3)) {
        console.log(`     [${f.speaker}] ${f.id}`);
        console.log(`        match: ${f.match}`);
        console.log(`        in:    ${f.excerpt}`);
      }
      if (fs2.length > 3) console.log(`     … and ${fs2.length - 3} more`);
    }
    console.log();
  }

  console.log(`Total findings: ${all.length}`);
}

main();
