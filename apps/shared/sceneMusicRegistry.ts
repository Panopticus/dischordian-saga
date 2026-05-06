/* ═══════════════════════════════════════════════════════
   SCENE MUSIC REGISTRY — declarative scene → track cues

   The discography has 107 canonical tracks (apps/shared/
   albumRegistry.ts), but until now music played as a
   *player* — not a *score*. This registry is the metadata
   layer that lets story beats, combat moments, hub visits
   and romance scenes declare which track they want, at
   what intensity, with what fade timing.

   Reference titles: ME2 (combat-music ramp), KOTOR
   (combat-enter swap). See plan §D2 in
   /root/.claude/plans/restart-in-plan-mode-wobbly-dawn.md.

   Track ids reference apps/shared/songTriggerMap.ts entries
   (the canonical id surface) or song-id strings the audio
   pipeline can resolve. The seed below is ~10 cues — the
   scaffolding for a wider authoring sweep, not a complete
   coverage map.
   ═══════════════════════════════════════════════════════ */

import { SONG_TRIGGER_MAP } from "./songTriggerMap";

/** Intensity layer the player crossfades into. The base
 *  track plays at "ambient"; combat beats ramp to "combat";
 *  a climactic moment can push to "climax" if the track has
 *  a stem authored for it. */
export type MusicIntensity = "ambient" | "combat" | "climax";

export interface SceneMusicCue {
  /** Stable scene id — opaque string the calling component
   *  uses to look up its cue. Convention: act_<n>_<beat>,
   *  hub_<location>, romance_<npc>_stage_<n>, codex_unlock_
   *  <category>. */
  sceneId: string;
  /** Track id (matches a `songId` in SONG_TRIGGER_MAP, or a
   *  resolvable id known to the audio pipeline). */
  baseTrackId: string;
  /** Default intensity to start at when the scene loads. */
  intensity: MusicIntensity;
  /** Crossfade-in duration in ms. 0 = hard cut. */
  fadeInMs: number;
  /** Crossfade-out duration on scene leave. */
  fadeOutMs: number;
  /** Optional: scene allows ramping to combat intensity (set
   *  false for KOTOR/ME-style "no combat-music in dialogue
   *  hubs"). Default true. */
  allowCombatRamp?: boolean;
  /** Optional human-readable note for designers. */
  note?: string;
}

/* ─── SEED CUES ─── */

export const SCENE_MUSIC_CUES: SceneMusicCue[] = [
  {
    sceneId: "act_1_intro",
    baseTrackId: "welcome-to-celebration",
    intensity: "ambient",
    fadeInMs: 1200,
    fadeOutMs: 800,
    allowCombatRamp: false,
    note: "Engineer's memoir voice opens; underscore should sit under narration.",
  },
  {
    sceneId: "act_1_combat_default",
    baseTrackId: "hacking-reality",
    intensity: "combat",
    fadeInMs: 400,
    fadeOutMs: 600,
    note: "Generic Act 1 card-battle bed.",
  },
  {
    sceneId: "act_3_intro",
    baseTrackId: "the-prisoner",
    intensity: "ambient",
    fadeInMs: 1500,
    fadeOutMs: 1000,
    allowCombatRamp: false,
    note: "Panopticon-coded; player has just chosen an infiltration path.",
  },
  {
    sceneId: "hub_inception_ark",
    baseTrackId: "governance-hub",
    intensity: "ambient",
    fadeInMs: 1500,
    fadeOutMs: 1000,
    allowCombatRamp: false,
    note: "Default Ark hub bed; companion banter overlays cleanly.",
  },
  {
    sceneId: "hub_observation_deck",
    baseTrackId: "last-words",
    intensity: "ambient",
    fadeInMs: 2000,
    fadeOutMs: 1500,
    allowCombatRamp: false,
    note: "Quieter, contemplative — the player came here on purpose.",
  },
  {
    sceneId: "romance_locke_stage_3",
    baseTrackId: "the-two-witnesses",
    intensity: "ambient",
    fadeInMs: 1800,
    fadeOutMs: 2000,
    allowCombatRamp: false,
    note: "Stage-3 commitment beat. Intentionally too big for the moment — Locke is theatrical.",
  },
  {
    sceneId: "romance_elara_stage_3",
    baseTrackId: "sih-track-37",
    intensity: "ambient",
    fadeInMs: 1800,
    fadeOutMs: 2000,
    allowCombatRamp: false,
    note: "The story is yours now — fits Elara's commitment beat exactly.",
  },
  {
    sceneId: "act_6_silence_in_heaven",
    baseTrackId: "sih-track-24",
    intensity: "climax",
    fadeInMs: 3000,
    fadeOutMs: 4000,
    allowCombatRamp: false,
    note: "Mandatory dark mode per SONG_TRIGGER_MAP. Full UI hidden during playback.",
  },
  {
    sceneId: "act_7_fall_of_new_babylon",
    baseTrackId: "sih-track-32",
    intensity: "combat",
    fadeInMs: 800,
    fadeOutMs: 2000,
    note: "Climactic faction battle; stems crossfade through combat → climax.",
  },
  {
    sceneId: "codex_unlock_default",
    baseTrackId: "building-the-architect",
    intensity: "ambient",
    fadeInMs: 600,
    fadeOutMs: 800,
    allowCombatRamp: false,
    note: "Brief sting under the codex-unlock toast (Tier-1 plan §A4).",
  },
];

/* ─── HELPERS ─── */

const KNOWN_TRACK_IDS = new Set(SONG_TRIGGER_MAP.map((s) => s.songId));

export function getSceneMusicCue(sceneId: string): SceneMusicCue | undefined {
  return SCENE_MUSIC_CUES.find((c) => c.sceneId === sceneId);
}

/** True if the cue's base track is one we already advertise
 *  in SONG_TRIGGER_MAP. Cues may reference tracks not yet in
 *  the trigger map — those are flagged but not rejected. */
export function isCueTrackKnown(cue: SceneMusicCue): boolean {
  return KNOWN_TRACK_IDS.has(cue.baseTrackId);
}

/** All distinct scene ids declared in the registry. */
export function listSceneIds(): string[] {
  return SCENE_MUSIC_CUES.map((c) => c.sceneId);
}
