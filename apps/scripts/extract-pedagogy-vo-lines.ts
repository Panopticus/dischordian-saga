/* ═══════════════════════════════════════════════════════
   EXTRACT PEDAGOGY VO LINES

   Reads the authored content in:
     apps/shared/apprenticeMechronisAudits.ts (audit answers)
     apps/shared/apprenticeDoctrines.ts        (stanzas)
     apps/shared/apprenticeMissionTypes.ts     (mission templates)
     apps/shared/apprenticeWarden.ts           (Warden lines)

   Emits:
     apps/scripts/apprentice-pedagogy-audits-lines.json
     apps/scripts/apprentice-pedagogy-doctrines-lines.json
     apps/scripts/apprentice-pedagogy-missions-lines.json
     apps/scripts/apprentice-pedagogy-warden-lines.json

   The format matches existing apprentice-<archetype>-<gender>-lines.json
   files: a JSON array of {id, character, text, emotion, bucket, file}.

   Idempotent — running twice produces identical output. The actual VO
   generation pipeline (TTS) consumes these files separately.
   ═══════════════════════════════════════════════════════ */

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { AUDIT_PROMPTS } from "../shared/apprenticeMechronisAudits";
import { DOCTRINES } from "../shared/apprenticeDoctrines";
import { MISSION_TYPES } from "../shared/apprenticeMissionTypes";
import { WARDEN, listWardenCandidates, buildPurgeNotice, wardenAuditCameo } from "../shared/apprenticeWarden";
import type { ApprenticeArchetype } from "../shared/apprentices";

interface VoLine {
  id: string;
  character: string;
  text: string;
  emotion: string;
  bucket: string;
  file: string;
}

const ARCHETYPES: readonly ApprenticeArchetype[] = [
  "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
  "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
];
const GENDERS = ["female", "male"] as const;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = __dirname;

/* ─── Audits ─── */

function emitAudits(): VoLine[] {
  const out: VoLine[] = [];
  for (const day of [7, 14, 21] as const) {
    const prompt = AUDIT_PROMPTS[day];
    for (const arch of ARCHETYPES) {
      const text = prompt.archetypeFlavor[arch].replace("[name]", "Initiate");
      for (const gender of GENDERS) {
        out.push({
          id: `audit_m${day}_${arch}_${gender}`,
          character: `apprentice_${arch}_${gender}`,
          text,
          emotion: day === 21 ? "withdrawn" : day === 14 ? "considered" : "guarded",
          bucket: `audit_m${day}`,
          file: "shared/apprenticeMechronisAudits.ts",
        });
      }
    }
  }
  return out;
}

/* ─── Doctrines ─── */

function emitDoctrines(): VoLine[] {
  const out: VoLine[] = [];
  for (const d of Object.values(DOCTRINES)) {
    for (const stanza of d.stanzas) {
      // Stanzas are recited by any apprentice. Emit one neutral
      // character variant + one per-archetype variant template.
      out.push({
        id: `doctrine_${d.id}_${stanza.recitedAt}_neutral`,
        character: "apprentice_neutral",
        text: stanza.line,
        emotion: stanza.recitedAt === "after_loss" ? "grieving"
          : stanza.recitedAt === "before_combat" ? "steeled"
          : stanza.recitedAt === "before_audit" ? "guarded"
          : stanza.recitedAt === "at_graduation" ? "settled"
          : "ritual",
        bucket: `doctrine_${d.id}`,
        file: "shared/apprenticeDoctrines.ts",
      });
    }
  }
  return out;
}

/* ─── Missions ─── */

function emitMissions(): VoLine[] {
  const out: VoLine[] = [];
  for (const m of Object.values(MISSION_TYPES)) {
    // Briefing and return templates. Crisis prompts stay textual (player-facing dialog).
    // {name} substituted with "Apprentice" placeholder for VO take.
    const briefing = m.briefingTemplate.replace(/\{name\}/g, "Apprentice");
    const ret = m.returnTemplate.replace(/\{name\}/g, "Apprentice");
    // Mission lines are spoken by the apprentice on assignment / return.
    for (const arch of m.resonantArchetypes) {
      for (const gender of GENDERS) {
        out.push({
          id: `mission_${m.id}_${arch}_${gender}_brief`,
          character: `apprentice_${arch}_${gender}`,
          text: briefing,
          emotion: m.difficulty === "lethal" ? "resolved" : m.difficulty === "high" ? "wary" : "steady",
          bucket: `mission_${m.role}`,
          file: "shared/apprenticeMissionTypes.ts",
        });
        out.push({
          id: `mission_${m.id}_${arch}_${gender}_return`,
          character: `apprentice_${arch}_${gender}`,
          text: ret,
          emotion: "tired",
          bucket: `mission_${m.role}_return`,
          file: "shared/apprenticeMissionTypes.ts",
        });
      }
    }
  }
  return out;
}

/* ─── Warden ─── */

function emitWarden(): VoLine[] {
  const out: VoLine[] = [];

  // Identity-anchor lines.
  out.push({
    id: "warden_failure_line",
    character: "the_warden",
    text: WARDEN.failureLine,
    emotion: "procedural",
    bucket: "warden_signature",
    file: "shared/apprenticeWarden.ts",
  });

  // Closing lines per audit classification.
  for (const cls of ["compliant", "ambiguous", "noncompliant", "withheld"] as const) {
    const cameo = wardenAuditCameo({
      classification: cls,
      doctrineId: "compliant_mouth",
      cumulativeArchitectInfluence: 50,
    });
    out.push({
      id: `warden_audit_close_${cls}`,
      character: "the_warden",
      text: cameo.closingLine,
      emotion: "procedural",
      bucket: "warden_audit_close",
      file: "shared/apprenticeWarden.ts",
    });
  }

  // Recruitment pitches.
  for (const c of listWardenCandidates()) {
    out.push({
      id: `warden_pitch_${c.id}`,
      character: "the_warden",
      text: c.pitch,
      emotion: "quiet",
      bucket: "warden_pitch",
      file: "shared/apprenticeWarden.ts",
    });
  }

  // Purge notice prompt + offer.
  const notice = buildPurgeNotice("Initiate");
  out.push({
    id: "warden_purge_prompt",
    character: "the_warden",
    text: notice.prompt,
    emotion: "quiet",
    bucket: "warden_purge",
    file: "shared/apprenticeWarden.ts",
  });
  out.push({
    id: "warden_purge_offer",
    character: "the_warden",
    text: notice.exitOffer,
    emotion: "procedural",
    bucket: "warden_purge",
    file: "shared/apprenticeWarden.ts",
  });

  return out;
}

/* ─── Write ─── */

function writeFile(name: string, lines: VoLine[]) {
  const path = join(OUT_DIR, name);
  // Stable: sort by id so re-runs produce identical files.
  lines.sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(path, JSON.stringify(lines, null, 2) + "\n", "utf-8");
  console.log(`[extract-pedagogy-vo] ${name} ← ${lines.length} lines`);
}

writeFile("apprentice-pedagogy-audits-lines.json", emitAudits());
writeFile("apprentice-pedagogy-doctrines-lines.json", emitDoctrines());
writeFile("apprentice-pedagogy-missions-lines.json", emitMissions());
writeFile("apprentice-pedagogy-warden-lines.json", emitWarden());

console.log("[extract-pedagogy-vo] done");
