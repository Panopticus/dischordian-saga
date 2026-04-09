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
  trench:          "/art/dmc/environments/dmc_env_the-trench_1920x1080.jpg",
  boneLane:        "/art/dmc/environments/dmc_env_bone-lane_1920x1080.jpg",
  deadStraight:    "/art/dmc/environments/dmc_env_dead-straight_1920x1080.jpg",
  speedConduit:    "/art/dmc/environments/dmc_env_speed-conduit_1920x1080.jpg",
  nilmorgPlatform: "/art/dmc/environments/dmc_env_nilmorg-platform_1920x1080.jpg",
  startingGrid:    "/art/dmc/environments/dmc_env_starting-grid_1920x1080.jpg",
  cloneVat:        "/art/dmc/environments/dmc_env_clone-vat_1920x1080.jpg",
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
  terminalVelocity: "/music/dmc/dmc_music_terminal-velocity.mp3",
  boneLane:         "/music/dmc/dmc_music_bone-lane.mp3",
  nilmorgWatches:   "/music/dmc/dmc_music_nilmorg-watches.mp3",
  signalLost:       "/music/dmc/dmc_music_signal-lost.mp3",
  severancePrize:   "/music/dmc/dmc_music_severance-prize.mp3",
  phaseThree:       "/music/dmc/dmc_music_phase-three.mp3",
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

export const DMC_CINEMATICS = {
  circuitOpens:    "/videos/dmc/dmc_cin_circuit-opens.mp4",
  cloneAwakening:  "/videos/dmc/dmc_cin_clone-awakening.mp4",
  theRace:         "/videos/dmc/dmc_cin_the-race.mp4",
  signalLost:      "/videos/dmc/dmc_cin_signal-lost.mp4",
  severancePrize:  "/videos/dmc/dmc_cin_severance-prize.mp4",
  nilmorgSpeaks:   "/videos/dmc/dmc_cin_nilmorg-speaks.mp4",
} as const;

export const DMC_CINEMATIC_META: Record<keyof typeof DMC_CINEMATICS, { title: string; duration: string; usage: string }> = {
  circuitOpens:    { title: "The Circuit Opens",   duration: "15s", usage: "Season announcement" },
  cloneAwakening:  { title: "Clone Awakening",     duration: "10s", usage: "Pre-race intro" },
  theRace:         { title: "The Race",            duration: "20s", usage: "Gameplay trailer" },
  signalLost:      { title: "Signal Lost",         duration: "8s",  usage: "Death sequence" },
  severancePrize:  { title: "The Severance Prize", duration: "12s", usage: "Season winner" },
  nilmorgSpeaks:   { title: "Nilmorg Speaks",      duration: "15s", usage: "Character introduction" },
};

/* ─── CINEMATIC KEYFRAMES (PNG — start/end for Kling generation) ─── */

export const DMC_KEYFRAMES = {
  cin01: { start: "/art/dmc/keyframes/cin01_start.png", end: "/art/dmc/keyframes/cin01_end.png" },
  cin02: { start: "/art/dmc/keyframes/cin02_start.png", end: "/art/dmc/keyframes/cin02_end.png" },
  cin03: { start: "/art/dmc/keyframes/cin03_start.png", end: "/art/dmc/keyframes/cin03_end.png" },
  cin04: { start: "/art/dmc/keyframes/cin04_start.png", end: "/art/dmc/keyframes/cin04_end.png" },
  cin05: { start: "/art/dmc/keyframes/cin05_start.png", end: "/art/dmc/keyframes/cin05_end.png" },
  cin06: { start: "/art/dmc/keyframes/cin06_start.png", end: "/art/dmc/keyframes/cin06_end.png" },
} as const;

/* ─── ASSET MANIFEST ─── */

export const DMC_ASSET_MANIFEST = {
  environments:  { count: 7,  format: "1920×1080 JPG", dir: "/art/dmc/environments/" },
  music:         { count: 6,  format: "MP3",           dir: "/music/dmc/" },
  cinematics:    { count: 6,  format: "MP4",           dir: "/videos/dmc/" },
  keyframes:     { count: 12, format: "PNG",           dir: "/art/dmc/keyframes/" },
  total: 31,
} as const;
