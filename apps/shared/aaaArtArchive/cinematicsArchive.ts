/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — Cinematics layer

   - climax_videos: 3 full-motion MP4s for the act-finale climaxes
   - climax_stills: 5 hero stills feeding the climax presentation
   - epigraphs: 5 act-card epigraph plates (Age of Privacy/etc.)
   - expansion_loops: 3 ambient looping plates (skyline, valley,
                      void-drift) for menu-screen idle ambience
   - witnessing_vfx: 7 per-faction Witnessing transition plates
                     (one per soul-stone faction)
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";

export const CLIMAX_VIDEO_IDS = [
  "climax_architect_awakens",
  "climax_terminus_breach",
  "climax_watcher_eye",
] as const;
export type ClimaxVideoId = (typeof CLIMAX_VIDEO_IDS)[number];

export function climaxVideoUrl(id: ClimaxVideoId): string {
  return assetUrl(`art/cinematics/climax_videos/${id}.mp4`);
}

export const CLIMAX_STILL_IDS = [
  "climax_architect_awakens",
  "climax_insurgency_rises",
  "climax_seer_prophecy",
  "climax_terminus_breach",
  "climax_watcher_eye_opens",
] as const;
export type ClimaxStillId = (typeof CLIMAX_STILL_IDS)[number];

export function climaxStillUrl(id: ClimaxStillId): string {
  return assetUrl(`art/cinematics/climax_stills/${id}.png`);
}

export const EPIGRAPH_IDS = [
  "epigraph_age_of_potentials",
  "epigraph_age_of_privacy",
  "epigraph_age_of_revelation",
  "epigraph_fall_of_reality",
  "epigraph_silence_in_heaven",
] as const;
export type EpigraphId = (typeof EPIGRAPH_IDS)[number];

export function epigraphUrl(id: EpigraphId): string {
  return assetUrl(`art/cinematics/epigraphs/${id}.png`);
}

export const EXPANSION_LOOP_IDS = [
  "loop_new_babylon_skyline",
  "loop_thaloria_valley",
  "loop_void_drift",
] as const;
export type ExpansionLoopId = (typeof EXPANSION_LOOP_IDS)[number];

export function expansionLoopUrl(id: ExpansionLoopId): string {
  return assetUrl(`art/cinematics/expansion_loops/${id}.png`);
}

export const WITNESSING_VFX_FACTIONS = [
  "authority",
  "dreamer",
  "hierarchy",
  "insurgency",
  "mechronis",
  "terminus",
  "watcher",
] as const;
export type WitnessingVfxFaction = (typeof WITNESSING_VFX_FACTIONS)[number];

export interface WitnessingVfxUrls {
  readonly final: string;
  readonly original: string;
}

export function witnessingVfxUrls(f: WitnessingVfxFaction): WitnessingVfxUrls {
  return {
    final: assetUrl(`art/cinematics/witnessing_vfx/witness_${f}.png`),
    original: assetUrl(`art/cinematics/witnessing_vfx/witness_${f}_original.png`),
  };
}

export function witnessingVfxUrl(f: WitnessingVfxFaction): string {
  return witnessingVfxUrls(f).final;
}

export function allCinematicsUrls(): readonly string[] {
  const urls: string[] = [];
  for (const id of CLIMAX_VIDEO_IDS) urls.push(climaxVideoUrl(id));
  for (const id of CLIMAX_STILL_IDS) urls.push(climaxStillUrl(id));
  for (const id of EPIGRAPH_IDS) urls.push(epigraphUrl(id));
  for (const id of EXPANSION_LOOP_IDS) urls.push(expansionLoopUrl(id));
  for (const f of WITNESSING_VFX_FACTIONS) {
    const u = witnessingVfxUrls(f);
    urls.push(u.final, u.original);
  }
  return urls;
}
