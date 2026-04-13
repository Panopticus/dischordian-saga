#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   VO MANIFEST BUILDER

   Walks the five authored VO catalogs and emits five canonical
   VO recording manifests:

     docs/narrator-vo-manifest.json   — trust-tier dialog,
                                        grouped by speaker x tier
     docs/companion-vo-manifest.json  — event-triggered companion
                                        comments, grouped by
                                        speaker x category
     docs/faction-vo-manifest.json    — Galactic Dance faction
                                        questline dialog, grouped
                                        by faction x NPC
     docs/journal-vo-manifest.json    — Antiquarian Journal
                                        audiobook, grouped by
                                        voice actor x epoch
     docs/broadcast-vo-manifest.json  — song-triggered broadcast
                                        interruptions, grouped
                                        by voice

   All five manifests share a cross-catalog uniqueness check on
   audioDialogId so studio pipeline filenames never collide.

   Run:
     npx tsx apps/scripts/buildVoManifest.ts
   ═══════════════════════════════════════════════════════ */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ALL_ELARA_DIALOGS,
  ALL_HUMAN_DIALOGS,
} from "../shared/narratorDialog";
import type {
  NarratorLine,
  NarratorScene,
  NarratorTierDialog,
} from "../shared/trustTierDialogTypes";
import { COMPANION_COMMENTS } from "../shared/companionComments";
import type {
  CompanionComment,
  CompanionTriggerCategory,
} from "../shared/companionComments";
import { HUMANS_QUESTLINE } from "../shared/questlineHumans";
import { CLONES_QUESTLINE } from "../shared/questlineClones";
import { THALORIA_QUESTLINE } from "../shared/questlineThaloria";
import { INSURGENCY_QUESTLINE } from "../shared/questlineInsurgency";
import { SYNDICATE_QUESTLINE } from "../shared/questlineSyndicate";
import { NEW_BABYLON_QUESTLINE } from "../shared/questlineNewBabylon";
import type {
  PotentialQuestline,
  PotentialQuestlineBeat,
  PotentialQuestlineChapter,
} from "../shared/potentialQuestlineTypes";
import { JOURNAL_ENTRIES } from "../shared/journalEntries";
import type {
  AntiquarianJournalEntry,
  JournalEpoch,
  JournalVoiceActor,
} from "../shared/journalEntries";
import { BROADCAST_LIBRARY } from "../shared/broadcastLibrary";
import type {
  BroadcastInterruption,
  BroadcastVoice,
} from "../shared/broadcastLibrary";

interface ManifestLine {
  audioDialogId: string;
  speaker: string;
  tier: number;
  tierLabel: string;
  sceneId: string;
  sceneTrigger: string;
  position: "opener" | "followup";
  wheelOptionId?: string;
  text: string;
  emotion: string;
  stageDirection?: string;
  proximity?: number;
  estimatedDurationSec: number;
}

interface SpeakerSessionGroup {
  speaker: string;
  tier: number;
  tierLabel: string;
  voiceProfile: string;
  lineCount: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  lines: ManifestLine[];
}

interface ManifestTotals {
  totalLines: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  perSpeaker: Record<string, { lines: number; durationSec: number; durationMin: string }>;
  perTier: Record<
    string,
    { lines: number; durationSec: number; durationMin: string }
  >;
}

interface NarratorVoManifest {
  generatedAt: string;
  generator: "apps/scripts/buildVoManifest.ts";
  totals: ManifestTotals;
  sessions: SpeakerSessionGroup[];
}

function fmtMin(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m${s.toString().padStart(2, "0")}s`;
}

function lineToManifestLine(
  line: NarratorLine,
  scene: NarratorScene,
  tierDialog: NarratorTierDialog,
  position: "opener" | "followup",
  wheelOptionId: string | undefined,
): ManifestLine {
  return {
    audioDialogId: line.audioDialogId,
    speaker: tierDialog.narrator,
    tier: tierDialog.tier,
    tierLabel: tierDialog.tierLabel,
    sceneId: scene.id,
    sceneTrigger: scene.trigger,
    position,
    wheelOptionId,
    text: line.text,
    emotion: line.emotion,
    stageDirection: line.stageDirection,
    proximity: line.proximity,
    estimatedDurationSec: line.estimatedDurationSec,
  };
}

function buildSessionForTier(d: NarratorTierDialog): SpeakerSessionGroup {
  const lines: ManifestLine[] = [];
  for (const scene of d.scenes) {
    for (const line of scene.opener) {
      lines.push(lineToManifestLine(line, scene, d, "opener", undefined));
    }
    for (const key of Object.keys(scene.followups)) {
      for (const line of scene.followups[key]) {
        lines.push(lineToManifestLine(line, scene, d, "followup", key));
      }
    }
  }
  const totalDurationSec = lines.reduce((a, l) => a + l.estimatedDurationSec, 0);
  return {
    speaker: d.narrator,
    tier: d.tier,
    tierLabel: d.tierLabel,
    voiceProfile: d.voiceProfile,
    lineCount: lines.length,
    totalDurationSec,
    totalDurationMinFormatted: fmtMin(totalDurationSec),
    lines,
  };
}

function verifyUnique(sessions: SpeakerSessionGroup[]): void {
  const seen = new Map<string, string>();
  for (const s of sessions) {
    for (const line of s.lines) {
      if (seen.has(line.audioDialogId)) {
        throw new Error(
          `Duplicate audioDialogId "${line.audioDialogId}" — in ${line.sceneId} and ${seen.get(line.audioDialogId)}`,
        );
      }
      seen.set(line.audioDialogId, line.sceneId);
    }
  }
}

function buildTotals(sessions: SpeakerSessionGroup[]): ManifestTotals {
  const perSpeaker: ManifestTotals["perSpeaker"] = {};
  const perTier: ManifestTotals["perTier"] = {};
  let totalLines = 0;
  let totalDurationSec = 0;
  for (const s of sessions) {
    totalLines += s.lineCount;
    totalDurationSec += s.totalDurationSec;
    const sp = (perSpeaker[s.speaker] ??= {
      lines: 0,
      durationSec: 0,
      durationMin: "",
    });
    sp.lines += s.lineCount;
    sp.durationSec += s.totalDurationSec;

    const key = `${s.speaker}_T${s.tier}`;
    perTier[key] = {
      lines: s.lineCount,
      durationSec: s.totalDurationSec,
      durationMin: s.totalDurationMinFormatted,
    };
  }
  for (const sp of Object.values(perSpeaker)) {
    sp.durationMin = fmtMin(sp.durationSec);
  }
  return {
    totalLines,
    totalDurationSec,
    totalDurationMinFormatted: fmtMin(totalDurationSec),
    perSpeaker,
    perTier,
  };
}

/* ─── Companion-comment manifest shape ─── */

interface CompanionManifestLine {
  audioDialogId: string;
  commentId: string;
  speaker: string;
  category: CompanionTriggerCategory;
  trigger: string;
  text: string;
  emotion: string;
  stageDirection?: string;
  proximity?: number;
  estimatedDurationSec: number;
  loreReveal?: string;
  timing: string;
  maxPlays: number;
  requiresClass?: string;
  minTrust?: number;
}

interface CompanionSessionGroup {
  /** e.g. "elara_combat", "human_ship_ambient". */
  sessionKey: string;
  speaker: string;
  category: CompanionTriggerCategory;
  lineCount: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  lines: CompanionManifestLine[];
}

interface CompanionManifestTotals {
  totalLines: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  perSpeaker: Record<
    string,
    { lines: number; durationSec: number; durationMin: string }
  >;
  perCategory: Record<string, { lines: number; durationSec: number; durationMin: string }>;
}

interface CompanionVoManifest {
  generatedAt: string;
  generator: "apps/scripts/buildVoManifest.ts";
  totals: CompanionManifestTotals;
  sessions: CompanionSessionGroup[];
}

function companionToManifestLine(c: CompanionComment): CompanionManifestLine {
  return {
    audioDialogId: c.audioDialogId,
    commentId: c.id,
    speaker: c.speaker,
    category: c.category,
    trigger: c.trigger,
    text: c.voiceLine,
    emotion: c.emotion,
    stageDirection: c.stageDirection,
    proximity: c.proximity,
    estimatedDurationSec: c.estimatedDurationSec,
    loreReveal: c.loreReveal,
    timing: c.timing,
    maxPlays: c.maxPlays,
    requiresClass: c.requiresClass,
    minTrust: c.minTrust,
  };
}

function buildCompanionSessions(): CompanionSessionGroup[] {
  const groups = new Map<string, CompanionSessionGroup>();
  for (const c of COMPANION_COMMENTS) {
    const key = `${c.speaker}_${c.category}`;
    let group = groups.get(key);
    if (!group) {
      group = {
        sessionKey: key,
        speaker: c.speaker,
        category: c.category,
        lineCount: 0,
        totalDurationSec: 0,
        totalDurationMinFormatted: "",
        lines: [],
      };
      groups.set(key, group);
    }
    group.lines.push(companionToManifestLine(c));
    group.lineCount++;
    group.totalDurationSec += c.estimatedDurationSec;
  }
  for (const g of groups.values()) g.totalDurationMinFormatted = fmtMin(g.totalDurationSec);
  return [...groups.values()].sort((a, b) => a.sessionKey.localeCompare(b.sessionKey));
}

function buildCompanionTotals(sessions: CompanionSessionGroup[]): CompanionManifestTotals {
  const perSpeaker: CompanionManifestTotals["perSpeaker"] = {};
  const perCategory: CompanionManifestTotals["perCategory"] = {};
  let totalLines = 0;
  let totalDurationSec = 0;
  for (const s of sessions) {
    totalLines += s.lineCount;
    totalDurationSec += s.totalDurationSec;
    const sp = (perSpeaker[s.speaker] ??= {
      lines: 0,
      durationSec: 0,
      durationMin: "",
    });
    sp.lines += s.lineCount;
    sp.durationSec += s.totalDurationSec;
    const cat = (perCategory[s.category] ??= {
      lines: 0,
      durationSec: 0,
      durationMin: "",
    });
    cat.lines += s.lineCount;
    cat.durationSec += s.totalDurationSec;
  }
  for (const v of Object.values(perSpeaker)) v.durationMin = fmtMin(v.durationSec);
  for (const v of Object.values(perCategory)) v.durationMin = fmtMin(v.durationSec);
  return {
    totalLines,
    totalDurationSec,
    totalDurationMinFormatted: fmtMin(totalDurationSec),
    perSpeaker,
    perCategory,
  };
}

function verifyCrossCatalogUnique(
  narratorSessions: SpeakerSessionGroup[],
  companionSessions: CompanionSessionGroup[],
  factionSessions: FactionSessionGroup[],
  journalSessions: JournalSessionGroup[],
  broadcastSessions: BroadcastSessionGroup[],
): void {
  const seen = new Map<string, string>();
  for (const s of narratorSessions) {
    for (const line of s.lines) {
      if (seen.has(line.audioDialogId)) {
        throw new Error(
          `Duplicate audioDialogId "${line.audioDialogId}" in narrator catalog (${line.sceneId} & ${seen.get(line.audioDialogId)})`,
        );
      }
      seen.set(line.audioDialogId, `narrator:${line.sceneId}`);
    }
  }
  for (const s of companionSessions) {
    for (const line of s.lines) {
      if (seen.has(line.audioDialogId)) {
        throw new Error(
          `Cross-catalog duplicate audioDialogId "${line.audioDialogId}" (companion:${line.commentId} collides with ${seen.get(line.audioDialogId)})`,
        );
      }
      seen.set(line.audioDialogId, `companion:${line.commentId}`);
    }
  }
  for (const s of factionSessions) {
    for (const line of s.lines) {
      if (seen.has(line.audioDialogId)) {
        throw new Error(
          `Cross-catalog duplicate audioDialogId "${line.audioDialogId}" (faction:${line.chapterId} collides with ${seen.get(line.audioDialogId)})`,
        );
      }
      seen.set(line.audioDialogId, `faction:${line.chapterId}`);
    }
  }
  for (const s of journalSessions) {
    for (const line of s.lines) {
      if (seen.has(line.audioDialogId)) {
        throw new Error(
          `Cross-catalog duplicate audioDialogId "${line.audioDialogId}" (journal:${line.entryId} collides with ${seen.get(line.audioDialogId)})`,
        );
      }
      seen.set(line.audioDialogId, `journal:${line.entryId}`);
    }
  }
  for (const s of broadcastSessions) {
    for (const line of s.lines) {
      if (seen.has(line.audioDialogId)) {
        throw new Error(
          `Cross-catalog duplicate audioDialogId "${line.audioDialogId}" (broadcast:${line.broadcastId} collides with ${seen.get(line.audioDialogId)})`,
        );
      }
      seen.set(line.audioDialogId, `broadcast:${line.broadcastId}`);
    }
  }
}

/* ─── Broadcast library manifest shape ─── */

interface BroadcastManifestLine {
  audioDialogId: string;
  broadcastId: string;
  voice: BroadcastVoice;
  trigger: string;
  text: string;
  emotion: string;
  stageDirection?: string;
  estimatedDurationSec: number;
  loreReveal: string | null;
  forced: boolean;
  probability?: number;
}

interface BroadcastSessionGroup {
  /** "programmer" | "antiquarian" | "enigma" (base voice, variants merged). */
  sessionKey: string;
  baseVoice: "programmer" | "antiquarian" | "enigma";
  lineCount: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  lines: BroadcastManifestLine[];
}

interface BroadcastManifestTotals {
  totalLines: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  perBaseVoice: Record<string, { lines: number; durationSec: number; durationMin: string }>;
  perVoiceVariant: Record<string, { lines: number; durationSec: number; durationMin: string }>;
}

interface BroadcastVoManifest {
  generatedAt: string;
  generator: "apps/scripts/buildVoManifest.ts";
  totals: BroadcastManifestTotals;
  sessions: BroadcastSessionGroup[];
}

function normalizeBroadcastVoice(
  v: BroadcastVoice,
): "programmer" | "antiquarian" | "enigma" {
  if (v === "programmer" || v === "programmer_wry") return "programmer";
  if (v === "enigma" || v === "storyteller_enigma") return "enigma";
  return "antiquarian";
}

function broadcastToManifestLine(b: BroadcastInterruption): BroadcastManifestLine {
  return {
    audioDialogId: b.audioDialogId,
    broadcastId: b.id,
    voice: b.voice,
    trigger: b.trigger,
    text: b.text,
    emotion: b.emotion,
    stageDirection: b.stageDirection,
    estimatedDurationSec: b.estimatedDurationSec,
    loreReveal: b.loreReveal,
    forced: b.forced,
    probability: b.probability,
  };
}

function buildBroadcastSessions(): BroadcastSessionGroup[] {
  const groups = new Map<string, BroadcastSessionGroup>();
  for (const b of BROADCAST_LIBRARY) {
    const baseVoice = normalizeBroadcastVoice(b.voice);
    let group = groups.get(baseVoice);
    if (!group) {
      group = {
        sessionKey: baseVoice,
        baseVoice,
        lineCount: 0,
        totalDurationSec: 0,
        totalDurationMinFormatted: "",
        lines: [],
      };
      groups.set(baseVoice, group);
    }
    group.lines.push(broadcastToManifestLine(b));
    group.lineCount++;
    group.totalDurationSec += b.estimatedDurationSec;
  }
  for (const g of groups.values()) g.totalDurationMinFormatted = fmtMin(g.totalDurationSec);
  return [...groups.values()].sort((a, b) => a.sessionKey.localeCompare(b.sessionKey));
}

function buildBroadcastTotals(sessions: BroadcastSessionGroup[]): BroadcastManifestTotals {
  const perBaseVoice: BroadcastManifestTotals["perBaseVoice"] = {};
  const perVoiceVariant: BroadcastManifestTotals["perVoiceVariant"] = {};
  let totalLines = 0;
  let totalDurationSec = 0;
  for (const s of sessions) {
    totalLines += s.lineCount;
    totalDurationSec += s.totalDurationSec;
    const base = (perBaseVoice[s.baseVoice] ??= {
      lines: 0,
      durationSec: 0,
      durationMin: "",
    });
    base.lines += s.lineCount;
    base.durationSec += s.totalDurationSec;
    for (const line of s.lines) {
      const variant = (perVoiceVariant[line.voice] ??= {
        lines: 0,
        durationSec: 0,
        durationMin: "",
      });
      variant.lines++;
      variant.durationSec += line.estimatedDurationSec;
    }
  }
  for (const v of Object.values(perBaseVoice)) v.durationMin = fmtMin(v.durationSec);
  for (const v of Object.values(perVoiceVariant)) v.durationMin = fmtMin(v.durationSec);
  return {
    totalLines,
    totalDurationSec,
    totalDurationMinFormatted: fmtMin(totalDurationSec),
    perBaseVoice,
    perVoiceVariant,
  };
}

/* ─── Journal audiobook manifest shape ─── */

interface JournalManifestLine {
  audioDialogId: string;
  entryId: string;
  entryTitle: string;
  epoch: JournalEpoch;
  voiceActor: JournalVoiceActor;
  paragraphIndex: number;
  text: string;
  emotion: string;
  stageDirection?: string;
  estimatedDurationSec: number;
  linkedSlideshowId?: string;
  linkedSongId?: string;
}

interface JournalSessionGroup {
  /** e.g. "antiquarian_foundation", "human_fall_of_reality". */
  sessionKey: string;
  voiceActor: JournalVoiceActor;
  epoch: JournalEpoch;
  entryCount: number;
  lineCount: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  lines: JournalManifestLine[];
}

interface JournalManifestTotals {
  totalEntries: number;
  totalLines: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  perVoice: Record<
    string,
    { entries: number; lines: number; durationSec: number; durationMin: string }
  >;
  perEpoch: Record<
    string,
    { entries: number; lines: number; durationSec: number; durationMin: string }
  >;
}

interface JournalVoManifest {
  generatedAt: string;
  generator: "apps/scripts/buildVoManifest.ts";
  totals: JournalManifestTotals;
  sessions: JournalSessionGroup[];
}

function buildJournalSessions(): JournalSessionGroup[] {
  const groups = new Map<string, JournalSessionGroup>();
  for (const entry of JOURNAL_ENTRIES) {
    const key = `${entry.voiceActor}_${entry.epoch}`;
    let group = groups.get(key);
    if (!group) {
      group = {
        sessionKey: key,
        voiceActor: entry.voiceActor,
        epoch: entry.epoch,
        entryCount: 0,
        lineCount: 0,
        totalDurationSec: 0,
        totalDurationMinFormatted: "",
        lines: [],
      };
      groups.set(key, group);
    }
    group.entryCount++;
    entry.paragraphs.forEach((p, idx) => {
      group!.lines.push({
        audioDialogId: p.audioDialogId,
        entryId: entry.id,
        entryTitle: entry.title,
        epoch: entry.epoch,
        voiceActor: entry.voiceActor,
        paragraphIndex: idx,
        text: p.text,
        emotion: p.emotion,
        stageDirection: p.stageDirection,
        estimatedDurationSec: p.estimatedDurationSec,
        linkedSlideshowId: entry.linkedSlideshowId,
        linkedSongId: entry.linkedSongId,
      });
      group!.lineCount++;
      group!.totalDurationSec += p.estimatedDurationSec;
    });
  }
  for (const g of groups.values()) g.totalDurationMinFormatted = fmtMin(g.totalDurationSec);
  return [...groups.values()].sort((a, b) => a.sessionKey.localeCompare(b.sessionKey));
}

function buildJournalTotals(sessions: JournalSessionGroup[]): JournalManifestTotals {
  const perVoice: JournalManifestTotals["perVoice"] = {};
  const perEpoch: JournalManifestTotals["perEpoch"] = {};
  let totalEntries = 0;
  let totalLines = 0;
  let totalDurationSec = 0;
  for (const s of sessions) {
    totalEntries += s.entryCount;
    totalLines += s.lineCount;
    totalDurationSec += s.totalDurationSec;
    const v = (perVoice[s.voiceActor] ??= {
      entries: 0,
      lines: 0,
      durationSec: 0,
      durationMin: "",
    });
    v.entries += s.entryCount;
    v.lines += s.lineCount;
    v.durationSec += s.totalDurationSec;
    const e = (perEpoch[s.epoch] ??= {
      entries: 0,
      lines: 0,
      durationSec: 0,
      durationMin: "",
    });
    e.entries += s.entryCount;
    e.lines += s.lineCount;
    e.durationSec += s.totalDurationSec;
  }
  for (const v of Object.values(perVoice)) v.durationMin = fmtMin(v.durationSec);
  for (const v of Object.values(perEpoch)) v.durationMin = fmtMin(v.durationSec);
  return {
    totalEntries,
    totalLines,
    totalDurationSec,
    totalDurationMinFormatted: fmtMin(totalDurationSec),
    perVoice,
    perEpoch,
  };
}

/* ─── Faction-questline manifest shape ─── */

interface FactionManifestLine {
  audioDialogId: string;
  speaker: string;
  questlineId: string;
  questlineTitle: string;
  chapterId: string;
  chapterTitle: string;
  position: "opener" | "followup";
  wheelOptionId?: string;
  text: string;
  emotion: string;
  stageDirection?: string;
  proximity?: number;
  estimatedDurationSec: number;
}

interface FactionSessionGroup {
  /** e.g. "humans_mirren_hale", "syndicate_the_word". */
  sessionKey: string;
  questlineId: string;
  questlineTitle: string;
  npcId: string;
  lineCount: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  lines: FactionManifestLine[];
}

interface FactionManifestTotals {
  totalLines: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  perNpc: Record<string, { lines: number; durationSec: number; durationMin: string }>;
  perQuestline: Record<
    string,
    { lines: number; durationSec: number; durationMin: string }
  >;
}

interface FactionVoManifest {
  generatedAt: string;
  generator: "apps/scripts/buildVoManifest.ts";
  totals: FactionManifestTotals;
  sessions: FactionSessionGroup[];
}

const GALACTIC_DANCE_QUESTLINES: PotentialQuestline[] = [
  HUMANS_QUESTLINE,
  CLONES_QUESTLINE,
  THALORIA_QUESTLINE,
  INSURGENCY_QUESTLINE,
  SYNDICATE_QUESTLINE,
  NEW_BABYLON_QUESTLINE,
];

function factionBeatToManifestLine(
  beat: PotentialQuestlineBeat,
  questline: PotentialQuestline,
  chapter: PotentialQuestlineChapter,
  position: "opener" | "followup",
  wheelOptionId: string | undefined,
): FactionManifestLine | null {
  if (!beat.text || !beat.audioDialogId) return null;
  return {
    audioDialogId: beat.audioDialogId,
    speaker: beat.speaker,
    questlineId: questline.id,
    questlineTitle: questline.title,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    position,
    wheelOptionId,
    text: beat.text,
    emotion: beat.emotion ?? "neutral",
    stageDirection: beat.stageDirection,
    proximity: beat.proximity,
    estimatedDurationSec: beat.estimatedDurationSec ?? 0,
  };
}

function buildFactionSessions(): FactionSessionGroup[] {
  const groups = new Map<string, FactionSessionGroup>();
  for (const q of GALACTIC_DANCE_QUESTLINES) {
    for (const ch of q.chapters) {
      const pushLine = (line: FactionManifestLine | null) => {
        if (!line) return;
        const key = `${q.id}_${line.speaker}`;
        let group = groups.get(key);
        if (!group) {
          group = {
            sessionKey: key,
            questlineId: q.id,
            questlineTitle: q.title,
            npcId: line.speaker,
            lineCount: 0,
            totalDurationSec: 0,
            totalDurationMinFormatted: "",
            lines: [],
          };
          groups.set(key, group);
        }
        group.lines.push(line);
        group.lineCount++;
        group.totalDurationSec += line.estimatedDurationSec;
      };
      for (const beat of ch.opener) {
        pushLine(factionBeatToManifestLine(beat, q, ch, "opener", undefined));
      }
      for (const key of Object.keys(ch.followups)) {
        for (const beat of ch.followups[key]) {
          pushLine(factionBeatToManifestLine(beat, q, ch, "followup", key));
        }
      }
    }
  }
  for (const g of groups.values()) g.totalDurationMinFormatted = fmtMin(g.totalDurationSec);
  return [...groups.values()].sort((a, b) => a.sessionKey.localeCompare(b.sessionKey));
}

function buildFactionTotals(sessions: FactionSessionGroup[]): FactionManifestTotals {
  const perNpc: FactionManifestTotals["perNpc"] = {};
  const perQuestline: FactionManifestTotals["perQuestline"] = {};
  let totalLines = 0;
  let totalDurationSec = 0;
  for (const s of sessions) {
    totalLines += s.lineCount;
    totalDurationSec += s.totalDurationSec;
    const npc = (perNpc[s.npcId] ??= {
      lines: 0,
      durationSec: 0,
      durationMin: "",
    });
    npc.lines += s.lineCount;
    npc.durationSec += s.totalDurationSec;
    const ql = (perQuestline[s.questlineId] ??= {
      lines: 0,
      durationSec: 0,
      durationMin: "",
    });
    ql.lines += s.lineCount;
    ql.durationSec += s.totalDurationSec;
  }
  for (const v of Object.values(perNpc)) v.durationMin = fmtMin(v.durationSec);
  for (const v of Object.values(perQuestline)) v.durationMin = fmtMin(v.durationSec);
  return {
    totalLines,
    totalDurationSec,
    totalDurationMinFormatted: fmtMin(totalDurationSec),
    perNpc,
    perQuestline,
  };
}

function main(): void {
  // ── narrator tier dialog ──
  const narratorSessions: SpeakerSessionGroup[] = [
    ...ALL_ELARA_DIALOGS.map(buildSessionForTier),
    ...ALL_HUMAN_DIALOGS.map(buildSessionForTier),
  ];
  verifyUnique(narratorSessions);

  const narratorManifest: NarratorVoManifest = {
    generatedAt: new Date().toISOString(),
    generator: "apps/scripts/buildVoManifest.ts",
    totals: buildTotals(narratorSessions),
    sessions: narratorSessions,
  };

  // ── companion comments ──
  const companionSessions = buildCompanionSessions();
  const companionManifest: CompanionVoManifest = {
    generatedAt: new Date().toISOString(),
    generator: "apps/scripts/buildVoManifest.ts",
    totals: buildCompanionTotals(companionSessions),
    sessions: companionSessions,
  };

  // ── faction questlines ──
  const factionSessions = buildFactionSessions();
  const factionManifest: FactionVoManifest = {
    generatedAt: new Date().toISOString(),
    generator: "apps/scripts/buildVoManifest.ts",
    totals: buildFactionTotals(factionSessions),
    sessions: factionSessions,
  };

  // ── journal audiobook ──
  const journalSessions = buildJournalSessions();
  const journalManifest: JournalVoManifest = {
    generatedAt: new Date().toISOString(),
    generator: "apps/scripts/buildVoManifest.ts",
    totals: buildJournalTotals(journalSessions),
    sessions: journalSessions,
  };

  // ── broadcast library ──
  const broadcastSessions = buildBroadcastSessions();
  const broadcastManifest: BroadcastVoManifest = {
    generatedAt: new Date().toISOString(),
    generator: "apps/scripts/buildVoManifest.ts",
    totals: buildBroadcastTotals(broadcastSessions),
    sessions: broadcastSessions,
  };

  // ── cross-catalog uniqueness (5-way) ──
  verifyCrossCatalogUnique(
    narratorSessions,
    companionSessions,
    factionSessions,
    journalSessions,
    broadcastSessions,
  );

  // ── write outputs ──
  const __filename = fileURLToPath(import.meta.url);
  const repoRoot = resolve(dirname(__filename), "..", "..");
  const narratorPath = resolve(repoRoot, "docs", "narrator-vo-manifest.json");
  const companionPath = resolve(repoRoot, "docs", "companion-vo-manifest.json");
  const factionPath = resolve(repoRoot, "docs", "faction-vo-manifest.json");
  const journalPath = resolve(repoRoot, "docs", "journal-vo-manifest.json");
  const broadcastPath = resolve(repoRoot, "docs", "broadcast-vo-manifest.json");
  mkdirSync(dirname(narratorPath), { recursive: true });
  writeFileSync(narratorPath, JSON.stringify(narratorManifest, null, 2) + "\n", "utf8");
  writeFileSync(companionPath, JSON.stringify(companionManifest, null, 2) + "\n", "utf8");
  writeFileSync(factionPath, JSON.stringify(factionManifest, null, 2) + "\n", "utf8");
  writeFileSync(journalPath, JSON.stringify(journalManifest, null, 2) + "\n", "utf8");
  writeFileSync(broadcastPath, JSON.stringify(broadcastManifest, null, 2) + "\n", "utf8");

  // ── report ──
  console.log("");
  console.log("Narrator VO Manifest");
  console.log("====================");
  console.log(`Written: ${narratorPath}`);
  console.log("");
  console.log(`Total lines:    ${narratorManifest.totals.totalLines}`);
  console.log(`Total runtime:  ${narratorManifest.totals.totalDurationMinFormatted}`);
  console.log("");
  console.log("Per speaker:");
  for (const [name, v] of Object.entries(narratorManifest.totals.perSpeaker)) {
    console.log(`  ${name.padEnd(12)} ${v.lines.toString().padStart(4)} lines   ${v.durationMin}`);
  }
  console.log("");
  console.log("Per recording session (speaker x tier):");
  for (const s of narratorSessions) {
    console.log(
      `  ${s.speaker.padEnd(12)} T${s.tier} ${s.tierLabel.padEnd(32)} ${s.lineCount
        .toString()
        .padStart(3)} lines   ${s.totalDurationMinFormatted}`,
    );
  }

  console.log("");
  console.log("Companion VO Manifest");
  console.log("=====================");
  console.log(`Written: ${companionPath}`);
  console.log("");
  console.log(`Total lines:    ${companionManifest.totals.totalLines}`);
  console.log(`Total runtime:  ${companionManifest.totals.totalDurationMinFormatted}`);
  console.log("");
  console.log("Per speaker:");
  for (const [name, v] of Object.entries(companionManifest.totals.perSpeaker)) {
    console.log(`  ${name.padEnd(12)} ${v.lines.toString().padStart(4)} lines   ${v.durationMin}`);
  }
  console.log("");
  console.log("Per recording session (speaker x category):");
  for (const s of companionSessions) {
    console.log(
      `  ${s.speaker.padEnd(10)} ${s.category.padEnd(22)} ${s.lineCount
        .toString()
        .padStart(3)} lines   ${s.totalDurationMinFormatted}`,
    );
  }

  console.log("");
  console.log("Faction VO Manifest");
  console.log("===================");
  console.log(`Written: ${factionPath}`);
  console.log("");
  console.log(`Total lines:    ${factionManifest.totals.totalLines}`);
  console.log(`Total runtime:  ${factionManifest.totals.totalDurationMinFormatted}`);
  console.log("");
  console.log("Per NPC:");
  for (const [npc, v] of Object.entries(factionManifest.totals.perNpc)) {
    console.log(`  ${npc.padEnd(22)} ${v.lines.toString().padStart(4)} lines   ${v.durationMin}`);
  }
  console.log("");
  console.log("Per recording session (faction x NPC):");
  for (const s of factionSessions) {
    console.log(
      `  ${s.questlineId.padEnd(34)} ${s.npcId.padEnd(22)} ${s.lineCount
        .toString()
        .padStart(3)} lines   ${s.totalDurationMinFormatted}`,
    );
  }

  console.log("");
  console.log("Journal VO Manifest");
  console.log("===================");
  console.log(`Written: ${journalPath}`);
  console.log("");
  console.log(`Total entries:  ${journalManifest.totals.totalEntries}`);
  console.log(`Total lines:    ${journalManifest.totals.totalLines}`);
  console.log(`Total runtime:  ${journalManifest.totals.totalDurationMinFormatted}`);
  console.log("");
  console.log("Per voice actor:");
  for (const [name, v] of Object.entries(journalManifest.totals.perVoice)) {
    console.log(
      `  ${name.padEnd(14)} ${v.entries.toString().padStart(2)} entries, ${v.lines
        .toString()
        .padStart(3)} lines   ${v.durationMin}`,
    );
  }
  console.log("");
  console.log("Per epoch:");
  for (const [name, v] of Object.entries(journalManifest.totals.perEpoch)) {
    console.log(
      `  ${name.padEnd(22)} ${v.entries.toString().padStart(2)} entries, ${v.lines
        .toString()
        .padStart(3)} lines   ${v.durationMin}`,
    );
  }
  console.log("");
  console.log("Per recording session (voice x epoch):");
  for (const s of journalSessions) {
    console.log(
      `  ${s.voiceActor.padEnd(14)} ${s.epoch.padEnd(22)} ${s.lineCount
        .toString()
        .padStart(3)} lines   ${s.totalDurationMinFormatted}`,
    );
  }

  console.log("");
  console.log("Broadcast VO Manifest");
  console.log("=====================");
  console.log(`Written: ${broadcastPath}`);
  console.log("");
  console.log(`Total lines:    ${broadcastManifest.totals.totalLines}`);
  console.log(`Total runtime:  ${broadcastManifest.totals.totalDurationMinFormatted}`);
  console.log("");
  console.log("Per base voice:");
  for (const [name, v] of Object.entries(broadcastManifest.totals.perBaseVoice)) {
    console.log(
      `  ${name.padEnd(14)} ${v.lines.toString().padStart(3)} lines   ${v.durationMin}`,
    );
  }
  console.log("");
  console.log("Per voice variant (incl. programmer_wry, storyteller_enigma):");
  for (const [name, v] of Object.entries(broadcastManifest.totals.perVoiceVariant)) {
    console.log(
      `  ${name.padEnd(22)} ${v.lines.toString().padStart(3)} lines   ${v.durationMin}`,
    );
  }

  console.log("");
  console.log("Combined grand totals");
  console.log("=====================");
  const grandLines =
    narratorManifest.totals.totalLines +
    companionManifest.totals.totalLines +
    factionManifest.totals.totalLines +
    journalManifest.totals.totalLines +
    broadcastManifest.totals.totalLines;
  const grandSec =
    narratorManifest.totals.totalDurationSec +
    companionManifest.totals.totalDurationSec +
    factionManifest.totals.totalDurationSec +
    journalManifest.totals.totalDurationSec +
    broadcastManifest.totals.totalDurationSec;
  console.log(`Total unique audioDialogIds: ${grandLines}`);
  console.log(`Total runtime:               ${fmtMin(grandSec)}`);
  console.log(`  narrator:                  ${narratorManifest.totals.totalDurationMinFormatted}`);
  console.log(`  companion:                 ${companionManifest.totals.totalDurationMinFormatted}`);
  console.log(`  faction:                   ${factionManifest.totals.totalDurationMinFormatted}`);
  console.log(`  journal:                   ${journalManifest.totals.totalDurationMinFormatted}`);
  console.log(`  broadcast:                 ${broadcastManifest.totals.totalDurationMinFormatted}`);
  console.log("");
}

main();
