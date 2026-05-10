#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   ELARA LINE EXTRACTOR

   Walks every canonical authoring source for Elara dialog and
   emits a fresh apps/scripts/elara-lines.json. The Python VO
   generator (apps/scripts/generate_elara_vo.py) reads that JSON,
   so refreshing it is the prerequisite for "regenerate every line
   from the canonical source of truth."

   Sources covered:
     1. apps/shared/elaraLines.ts        ELARA_LINES (CompanionLine[])
     2. apps/shared/companionComments.ts COMPANION_COMMENTS (speaker:elara)
     3. apps/shared/cryoBayMystery.ts    CRYO_MYSTERY_RESPONSES + combines
     4. apps/shared/roomMysteries/*.ts   every RoomMysteryModule
     5. apps/shared/mobileNarratorDialog.ts NARRATOR_DIALOG[*].elara
     6. apps/shared/featureRoadmap.ts    FEATURE_ROADMAP unlock messages
     7. AwakeningPage.tsx STEP_DIALOG    (inlined; rewrite if Elara's
                                          opening monologue changes)

   Banded narrations (ElaraBandedText: lucid/fragmented/luminous)
   expand to three entries with the band suffixed onto the voId,
   matching what the runtime synthesizes via resolveBandedVoId.
   Tier escalation (resp.tiers[]) recurses.

   Detective lines (humanReaction.*) are intentionally skipped —
   they belong in humanVoManifest.json.

   Run from repo root:
     pnpm tsx apps/scripts/extract-elara-lines.ts

   Output (relative to repo root):
     apps/scripts/elara-lines.json
   ═══════════════════════════════════════════════════════ */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ELARA_LINES } from "../shared/elaraLines";
import { COMPANION_COMMENTS } from "../shared/companionComments";
import { CRYO_MYSTERY_RESPONSES } from "../shared/cryoBayMystery";
import { ROOM_MYSTERY_REGISTRY } from "../shared/roomMysteries";
import type { Verb, VerbResponse } from "../shared/roomMysteries";
import { NARRATOR_DIALOG } from "../shared/mobileNarratorDialog";
import { FEATURE_ROADMAP } from "../shared/featureRoadmap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface LineEntry {
  id: string;
  text: string;
  context: string;
  emotion: string;
  file: string;
}

const ELARA_BANDS = ["fragmented", "lucid", "luminous"] as const;
type ElaraBand = (typeof ELARA_BANDS)[number];

const BAND_EMOTION: Record<ElaraBand, string> = {
  fragmented: "fearful",
  lucid: "analytical",
  luminous: "warm",
};

const TRUST_TIER_EMOTION: Record<string, string> = {
  F: "analytical",
  P: "reassuring",
  H: "warm",
  V: "warm",
  D: "warm",
};

const lines: LineEntry[] = [];
const seen = new Set<string>();
const dupes: string[] = [];
const sanitized: { id: string; before: string; after: string }[] = [];

/** Strip artefacts that would be voiced literally by ElevenLabs:
 *
 *  - leading `Speaker: "..."` / `Speaker: '...'` wrappers (the
 *    canonical narration sometimes embeds the speaker label
 *    inside the prose; the dialog UI already shows ELARA as a
 *    chip, so the embedded label is also redundant for display).
 *  - asterisk-bracketed stage directions like `*static*`,
 *    `*thinks hard*`, `*the transmission cuts out*` — ElevenLabs
 *    Multilingual v2 reads asterisk prose literally.
 *
 *  Returns the cleaned text. Empty string return means the entry
 *  should be dropped. */
function sanitize(text: string, id: string): string {
  let out = text;
  // Speaker label + quoted body. Matches "Elara:" / "Agent Zero:"
  // / "Your companion:" / etc. followed by an opening quote.
  const wrap = out.match(/^[A-Z][A-Za-z' ]+:\s*['"](.*)['"]\s*$/s);
  if (wrap) out = wrap[1];
  // Stage directions inside asterisks.
  const stripped = out.replace(/\*[^*]+\*/g, "").replace(/\s{2,}/g, " ").trim();
  if (stripped !== text) sanitized.push({ id, before: text, after: stripped });
  return stripped;
}

function emit(entry: LineEntry) {
  if (seen.has(entry.id)) {
    dupes.push(entry.id);
    return;
  }
  const cleaned = sanitize(entry.text, entry.id);
  if (!cleaned) return;
  seen.add(entry.id);
  lines.push({ ...entry, text: cleaned });
}

/* ─── 1. CompanionLine canonical (elaraLines.ts) ─── */

for (const line of ELARA_LINES) {
  const band = line.requiresElaraStability;
  emit({
    id: line.lineId,
    text: line.text,
    context: "companion_line",
    emotion: band ? BAND_EMOTION[band] : "analytical",
    file: "shared/elaraLines.ts",
  });
}

/* ─── 2. Companion comments (Elara only) ─── */

for (const cc of COMPANION_COMMENTS) {
  if (cc.speaker !== "elara") continue;
  emit({
    id: cc.id,
    text: cc.voiceLine,
    context: cc.trigger,
    emotion: "analytical",
    file: "shared/companionComments.ts",
  });
}

/* ─── 3 + 4. Room mysteries (cryo bay + every registered room) ─── */

function emitElaraNarration(
  baseVoId: string | undefined,
  narration: VerbResponse["narration"],
  context: string,
  file: string,
) {
  if (!baseVoId) return;
  if (typeof narration === "string") {
    emit({ id: baseVoId, text: narration, context, emotion: "analytical", file });
    return;
  }
  for (const band of ELARA_BANDS) {
    emit({
      id: `${baseVoId}.${band}`,
      text: narration[band],
      context: `${context}.${band}`,
      emotion: BAND_EMOTION[band],
      file,
    });
  }
}

function visitVerbResponse(resp: VerbResponse, context: string, file: string) {
  emitElaraNarration(resp.voId, resp.narration, context, file);
  // Player-choice follow-ups — Elara replies with `elaraFollowUpVoId`
  // + `elaraFollowUpText`. These are not banded.
  if (resp.responses) {
    for (const r of resp.responses) {
      if (r.elaraFollowUpVoId && r.elaraFollowUpText) {
        emit({
          id: r.elaraFollowUpVoId,
          text: r.elaraFollowUpText,
          context: `${context}:follow_up:${r.id}`,
          emotion: "analytical",
          file,
        });
      }
    }
  }
  // Sierra-style "click again, learn a little more" tier escalation.
  if (resp.tiers) {
    resp.tiers.forEach((tier, i) =>
      visitVerbResponse(tier, `${context}:t${i + 2}`, file),
    );
  }
}

// Cryo bay (legacy table — same shape as the generic registry).
for (const [hotspotId, byVerb] of Object.entries(CRYO_MYSTERY_RESPONSES)) {
  for (const verb of Object.keys(byVerb) as Verb[]) {
    const resp = byVerb[verb];
    if (!resp) continue;
    visitVerbResponse(
      resp as unknown as VerbResponse,
      `cryo-bay:${hotspotId}:${verb}`,
      "shared/cryoBayMystery.ts",
    );
  }
}

// Every registered room module.
for (const [roomId, mod] of Object.entries(ROOM_MYSTERY_REGISTRY)) {
  if (roomId === "cryo-bay") continue; // already handled above
  for (const [hotspotId, byVerb] of Object.entries(mod.responses)) {
    for (const verb of Object.keys(byVerb ?? {}) as Verb[]) {
      const resp = (byVerb as Partial<Record<Verb, VerbResponse>>)[verb];
      if (!resp) continue;
      visitVerbResponse(
        resp,
        `${roomId}:${hotspotId}:${verb}`,
        `shared/roomMysteries/${roomId}.ts`,
      );
    }
  }
  // Inventory combines (climactic — e.g. cryo torn-id + data-slate).
  for (const rule of mod.combines ?? []) {
    const result = rule.result;
    if (!result.voId) continue;
    emitElaraNarration(
      result.voId,
      result.narration,
      `${roomId}:combine:${rule.a}+${rule.b}`,
      `shared/roomMysteries/${roomId}.ts`,
    );
  }
}

/* ─── 5. Mobile narrator slot (§13 yin/yang) ─── */

for (const [roomId, set] of Object.entries(NARRATOR_DIALOG)) {
  set.elara.forEach((line, idx) => {
    const beat = line.beatFlag ? `.${line.beatFlag}` : "";
    emit({
      id: `narrator.${roomId}.elara.${line.tier.toLowerCase()}${beat}.${idx}`,
      text: line.text,
      context: `narrator.${roomId}`,
      emotion: TRUST_TIER_EMOTION[line.tier] ?? "analytical",
      file: "shared/mobileNarratorDialog.ts",
    });
  });
}

/* ─── 6. Feature unlock roadmap ─── */

for (const f of FEATURE_ROADMAP) {
  emit({
    id: `feature_${f.featureId}`,
    text: f.unlockMessage,
    context: "feature_unlock",
    emotion: "warm",
    file: "shared/featureRoadmap.ts",
  });
}

/* ─── 7. Awakening flow (apps/client/src/pages/AwakeningPage.tsx) ───
   Inlined verbatim from STEP_DIALOG. If Elara's opening monologue is
   rewritten there, also rewrite it here — there's no shared module
   between client tsx and the generator yet. */

const AWAKENING_DIALOG: Record<string, string> = {
  CRYO_OPEN:
    "Don't try to move. Your pod cycled early — I had to bring you up out of sequence. The fluid is reading wrong, the bay alarms have been silenced from somewhere I don't have eyes on, and we are very short on time. Breathe. Slowly. I'll explain what I can while you come back to yourself.",
  ELARA_INTRO:
    "I am Elara — the ship's intelligence, or what's left of me with eight decks gone dark. You are aboard Inception Ark 1047, and I will be plain with you: the bridge is deadlocked, half my systems will not answer, and one of the first wave is dead in a corridor I cannot put a camera into. You are the only Potential I could wake without tripping whatever is doing this. Before I send you out there, I need to know who I just brought up.",
  SPECIES_QUESTION:
    "Your biosignature is reading outside every classification I have on file — and right now, knowing exactly what walked out of that pod is the difference between sending you down that corridor and sealing you back in for your own protection. Help me here. What do you remember being?",
  CLASS_QUESTION:
    "I have one operative I can trust, and that is you. The bridge will not open. Security drones are not answering. I am out of better options. So tell me honestly, before I put you in a room with a body — when something goes wrong, what do you reach for first?",
  ALIGNMENT_QUESTION:
    "Whoever did this chose a philosophy before they chose a weapon. The Architect would call it a necessary correction — order is worth a life. The Dreamer would call it the price of being free of him. I need to know how you'll read the next room you walk into, because you are about to walk into one. Where do you stand? And spare me the diplomatic answer. We are well past that.",
  ELEMENT_QUESTION_DEMAGI:
    "The fundamental forces don't care that this ship is failing — but you'll need one of them on your side before the next bulkhead. This isn't preference. This is what you survive the next hour with.",
  ELEMENT_QUESTION_QUARCHON:
    "The fundamental forces don't care that this ship is failing — but you'll need one of them on your side before the next bulkhead. This isn't preference. This is what you survive the next hour with.",
  NAME_INPUT:
    "I am about to grant you authorities I am not technically allowed to grant anyone, and I refuse to do it to a serial number. The crew manifest can call you whatever it likes. I won't. What should I call you?",
  ATTRIBUTES:
    "Hold still — I'm calibrating your interface on the fastest pass I can run. Whatever you weight here is what you carry into that corridor, so weight it like you mean it. Where you put your strength now decides what kind of survivor you get to be in the next fifteen minutes.",
  FIRST_STEPS:
    "Citizen profile ratified — by me, alone, under emergency authority, which is a sentence I never wanted to say out loud. The seal on that door cycles green in ten seconds and I cannot hold it longer. Out there: a sealed bridge I cannot reach, a body I cannot identify, and a ship that has started lying to me. Pay attention to the small things. Whoever did this is still aboard, and the details are how we find them.",
};
for (const [step, text] of Object.entries(AWAKENING_DIALOG)) {
  emit({
    id: step,
    text,
    context: "awakening",
    emotion: "urgent",
    file: "client/src/pages/AwakeningPage.tsx",
  });
}

/* ─── WRITE ─── */

const outPath = join(__dirname, "elara-lines.json");
writeFileSync(outPath, JSON.stringify(lines, null, 2) + "\n", "utf8");

// Bucket counts for a glance at coverage.
const byContext = new Map<string, number>();
for (const l of lines) {
  const head = l.context.split(/[.:]/)[0] ?? l.context;
  byContext.set(head, (byContext.get(head) ?? 0) + 1);
}

console.log(`wrote ${lines.length} Elara lines → ${outPath}`);
console.log("\ncoverage by context bucket:");
for (const [ctx, n] of [...byContext.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${n.toString().padStart(4)} ${ctx}`);
}

if (dupes.length > 0) {
  console.log(`\nskipped ${dupes.length} duplicate ids (kept first occurrence):`);
  // Show only a few — duplicate ids are normal when a line is reachable
  // through multiple registry paths.
  for (const id of dupes.slice(0, 10)) console.log(`  - ${id}`);
  if (dupes.length > 10) console.log(`  … and ${dupes.length - 10} more`);
}

if (sanitized.length > 0) {
  console.log(
    `\nsanitized ${sanitized.length} line(s) — stripped speaker labels / stage directions:`,
  );
  for (const s of sanitized) {
    console.log(`  - ${s.id}`);
    console.log(`      before: ${s.before.slice(0, 100)}${s.before.length > 100 ? "…" : ""}`);
    console.log(`      after:  ${s.after.slice(0, 100)}${s.after.length > 100 ? "…" : ""}`);
  }
  console.log(
    "\nThese were sanitized in the JSON only — the canonical TS source still has the artefacts.",
  );
}
