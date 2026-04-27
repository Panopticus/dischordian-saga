import { assetUrl } from "@/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   DEAD MAN'S CIRCUIT — Game Assets
   
   All art, music, video, and keyframe assets for the
   seasonal kart racing event operated by Nilmorg,
   SVP of Kinetic Acquisition, Hierarchy of the Damned.
   
   Asset source: s3://dgrsart/dmc_game_assets.zip
   Production doc: docs/production/DEAD_MANS_CIRCUIT_PRODUCTION.md
   ═══════════════════════════════════════════════════════ */

/* ─── ENVIRONMENT ART (1920×1080 JPG) ─── */

export const DMC_ENVIRONMENTS = {
  trench:          assetUrl("art/dmc/environments/dmc_env_the-trench_1920x1080.jpg"),
  boneLane:        assetUrl("art/dmc/environments/dmc_env_bone-lane_1920x1080.jpg"),
  deadStraight:    assetUrl("art/dmc/environments/dmc_env_dead-straight_1920x1080.jpg"),
  speedConduit:    assetUrl("art/dmc/environments/dmc_env_speed-conduit_1920x1080.jpg"),
  nilmorgPlatform: assetUrl("art/dmc/environments/dmc_env_nilmorg-platform_1920x1080.jpg"),
  startingGrid:    assetUrl("art/dmc/environments/dmc_env_starting-grid_1920x1080.jpg"),
  cloneVat:        assetUrl("art/dmc/environments/dmc_env_clone-vat_1920x1080.jpg"),
} as const;

/** Map environment keys to display names + usage context */
export const DMC_ENVIRONMENT_META: Record<keyof typeof DMC_ENVIRONMENTS, { title: string; usage: string }> = {
  trench:          { title: "The Trench",              usage: "Loading screen, lobby background" },
  boneLane:        { title: "The Bone Lane",           usage: "Bone Lane hazard section overlay" },
  deadStraight:    { title: "The Dead Straight",       usage: "Void section hazard background" },
  speedConduit:    { title: "The Speed Conduit",       usage: "Boost strip section background" },
  nilmorgPlatform: { title: "Nilmorg's Platform",     usage: "Pre-race cinematic, results screen" },
  startingGrid:    { title: "The Starting Grid",       usage: "Race start countdown screen" },
  cloneVat:        { title: "The Clone Vat",           usage: "Season announcement, clone creation" },
};

/* ─── MUSIC (MP3) ─── */

export const DMC_MUSIC = {
  terminalVelocity: assetUrl("music/dmc/dmc_music_terminal-velocity.mp3"),
  boneLane:         assetUrl("music/dmc/dmc_music_bone-lane.mp3"),
  nilmorgWatches:   assetUrl("music/dmc/dmc_music_nilmorg-watches.mp3"),
  signalLost:       assetUrl("music/dmc/dmc_music_signal-lost.mp3"),
  severancePrize:   assetUrl("music/dmc/dmc_music_severance-prize.mp3"),
  phaseThree:       assetUrl("music/dmc/dmc_music_phase-three.mp3"),
} as const;

export const DMC_MUSIC_META: Record<keyof typeof DMC_MUSIC, { title: string; bpm: number | null; usage: string }> = {
  terminalVelocity: { title: "Terminal Velocity",  bpm: 150,  usage: "Main race theme" },
  boneLane:         { title: "The Bone Lane",      bpm: 120,  usage: "Bone Lane hazard zone" },
  nilmorgWatches:   { title: "Nilmorg Watches",    bpm: 80,   usage: "Lobby / menu theme" },
  signalLost:       { title: "Signal Lost",        bpm: null,  usage: "Clone death sting (5s)" },
  severancePrize:   { title: "The Severance Prize", bpm: 130,  usage: "Victory theme (90s)" },
  phaseThree:       { title: "Phase Three",        bpm: 170,  usage: "Finals intensity theme" },
};

/* ─── CINEMATICS (MP4) ─── */

/**
 * The original V1 set (cloneAwakening, signalLost, severancePrize) was
 * superseded by the Seedance 20 4K shots in 2026-04-10 and is no longer
 * exported — the V2 keys below are wired into every play site. The MP4s
 * still exist on the CDN as historical reference; if a future feature
 * needs them, re-add the export rather than reaching past this comment.
 *
 * `raceTracking` is intentionally retained without a play site: the
 * production brief reserves it for a "lobby secondary background /
 * marketing loop" rotation that hasn't been built. Wire it as a second
 * hero loop or a track-preview tile when that feature lands; until
 * then DMC_CINEMATIC_META below documents the intended slot.
 */
export const DMC_CINEMATICS = {
  circuitOpens:    assetUrl("videos/dmc/dmc_cin_circuit-opens.mp4"),
  theRace:         assetUrl("videos/dmc/dmc_cin_the-race.mp4"),
  nilmorgSpeaks:   assetUrl("videos/dmc/dmc_cin_nilmorg-speaks.mp4"),

  // V2 — Seedance 20 4K shots (2026-04-10)
  cloneAwakeningV2: assetUrl("videos/dmc/dmc_cin_clone-awakening-v2.mp4"),
  raceGameplay:     assetUrl("videos/dmc/dmc_cin_race-gameplay.mp4"),
  raceTracking:     assetUrl("videos/dmc/dmc_cin_race-tracking.mp4"),
  severancePodium:  assetUrl("videos/dmc/dmc_cin_severance-podium.mp4"),
  signalLostV2:     assetUrl("videos/dmc/dmc_cin_signal-lost-v2.mp4"),
  nilmorgLipSync:   assetUrl("videos/dmc/dmc_cin_nilmorg-lipsync.mp4"),
  nilmorgChair:     assetUrl("videos/dmc/dmc_cin_nilmorg-chair.mp4"),
} as const;

export const DMC_CINEMATIC_META: Record<keyof typeof DMC_CINEMATICS, { title: string; duration: string; usage: string }> = {
  circuitOpens:    { title: "The Circuit Opens",   duration: "15s", usage: "Season announcement" },
  theRace:         { title: "The Race",            duration: "20s", usage: "Gameplay trailer — lobby WATCH TRAILER tile" },
  nilmorgSpeaks:   { title: "Nilmorg Speaks",      duration: "15s", usage: "Character introduction" },

  cloneAwakeningV2: { title: "Clone Awakening (Seedance 4K)",  duration: "10s", usage: "Pre-race cinematic — overlays when player clicks ENTER THE TRENCH" },
  raceGameplay:     { title: "Race Gameplay POV (Seedance 4K)", duration: "20s", usage: "Hero video — lobby background loop" },
  raceTracking:     { title: "Race Tracking Shot (Seedance 4K)", duration: "15s", usage: "Lobby secondary background / marketing loop — NOT YET WIRED, asset retained for future second-loop or track-preview slot" },
  severancePodium:  { title: "Severance Prize Podium (Seedance 4K)", duration: "12s", usage: "Victory overlay — plays on 1st place finish" },
  signalLostV2:     { title: "Signal Lost (Seedance 4K)",       duration: "8s",  usage: "Death overlay — plays when clone fails to survive" },
  nilmorgLipSync:   { title: "Nilmorg Sermon (Lip Sync)",       duration: "12s", usage: "'The universe runs on power...' velocity-and-vanity sermon — hero panel on lobby" },
  nilmorgChair:     { title: "Nilmorg in Chair (Seedance 4K)",  duration: "15s", usage: "Ambient Nilmorg talking-head loop — commentary panel portrait" },
};

/* ─── CINEMATIC KEYFRAMES (PNG — start/end for Kling generation) ─── */

export const DMC_KEYFRAMES = {
  cin01: { start: assetUrl("art/dmc/keyframes/cin01_start.png"), end: assetUrl("art/dmc/keyframes/cin01_end.png") },
  cin02: { start: assetUrl("art/dmc/keyframes/cin02_start.png"), end: assetUrl("art/dmc/keyframes/cin02_end.png") },
  cin03: { start: assetUrl("art/dmc/keyframes/cin03_start.png"), end: assetUrl("art/dmc/keyframes/cin03_end.png") },
  cin04: { start: assetUrl("art/dmc/keyframes/cin04_start.png"), end: assetUrl("art/dmc/keyframes/cin04_end.png") },
  cin05: { start: assetUrl("art/dmc/keyframes/cin05_start.png"), end: assetUrl("art/dmc/keyframes/cin05_end.png") },
  cin06: { start: assetUrl("art/dmc/keyframes/cin06_start.png"), end: assetUrl("art/dmc/keyframes/cin06_end.png") },
} as const;

/* ─── ASSET MANIFEST ─── */

export const DMC_ASSET_MANIFEST = {
  environments:  { count: 7,  format: "1920×1080 JPG", dir: assetUrl("art/dmc/environments/") },
  music:         { count: 6,  format: "MP3",           dir: assetUrl("music/dmc/") },
  cinematics:    { count: 10, format: "MP4",           dir: assetUrl("videos/dmc/") },
  keyframes:     { count: 12, format: "PNG",           dir: assetUrl("art/dmc/keyframes/") },
  total: 35,
} as const;
