/* ═══════════════════════════════════════════════════════
   CADES FPS — Game Assets
   All art, SFX, music, and video frame assets for the
   CADES UNIT FPS (The Last Stand | Ship Defense |
   Historical Incursions).

   Source: s3://dgrsart/CADES_FPS_Assets.zip
   Prompts: docs/production/prompts/cades-fps-production-prompts.md
   ═══════════════════════════════════════════════════════ */

/* ─── CHARACTER ART (7) ─── */
export const CADES_CHARACTERS = {
  ironLionPortrait:    "/art/cades/characters/char-1a-iron-lion-portrait.png",
  ironLionFull:        "/art/cades/characters/char-1b-iron-lion-full.png",
  ironLionSprite:      "/art/cades/characters/char-1c-iron-lion-sprite.png",
  elara:               "/art/cades/characters/char-1d-elara.png",
  thoughtbornLeader:   "/art/cades/characters/char-1e-thoughtborn-leader.png",
  thoughtbornLeaderBossSplash: "/art/cades/characters/char-1e-thoughtborn-leader-boss-splash.png",
  gameMasterHuman:     "/art/cades/characters/char-1f-game-master-human.png",
  gameMasterRobot:     "/art/cades/characters/char-1g-game-master-robot.png",
} as const;

/* ─── ENEMY SPRITES (15) ─── */
export const CADES_ENEMIES = {
  machineScout:         "/art/cades/enemies/enemy-2a-machine-scout.png",
  machineSoldier:       "/art/cades/enemies/enemy-2b-machine-soldier.png",
  machineVanguard:      "/art/cades/enemies/enemy-2c-machine-vanguard.png",
  machineDisruptor:     "/art/cades/enemies/enemy-2d-machine-disruptor.png",
  machineCommander:     "/art/cades/enemies/enemy-2e-machine-commander.png",
  reclamationEnforcer:  "/art/cades/enemies/enemy-2f-reclamation-enforcer.png",
  reclamationCommander: "/art/cades/enemies/enemy-2g-reclamation-commander.png",
  salvager:             "/art/cades/enemies/enemy-2h-salvager.png",
  salvagerLeader:       "/art/cades/enemies/enemy-2i-salvager-leader.png",
  thoughtbornPilgrim:   "/art/cades/enemies/enemy-2j-thoughtborn-pilgrim.png",
  architectConstruct:   "/art/cades/enemies/enemy-2k-architect-construct.png",
  hierarchyAssassin:    "/art/cades/enemies/enemy-2l-hierarchy-assassin.png",
  collectorDrone:       "/art/cades/enemies/enemy-2m-collector-drone.png",
  realityShard:         "/art/cades/enemies/enemy-2n-reality-shard.png",
  hierarchyStrike:      "/art/cades/enemies/enemy-2o-hierarchy-strike.png",
} as const;

/* ─── ENVIRONMENT ART (8) ─── */
export const CADES_ENVIRONMENTS = {
  bridgeSkybox:      "/art/cades/environments/env-3a-bridge-skybox.png",
  bridgeFloor:       "/art/cades/environments/env-3b-bridge-floor.png",
  bridgeBarricade:   "/art/cades/environments/env-3c-bridge-barricade.png",
  arkEngineeringWall:"/art/cades/environments/env-3d-ark-engineering-wall.png",
  arkCargoWall:      "/art/cades/environments/env-3e-ark-cargo-wall.png",
  arkStarfield:      "/art/cades/environments/env-3f-ark-starfield.png",
  matrixVoid:        "/art/cades/environments/env-3g-matrix-void.png",
  matrixPillar:      "/art/cades/environments/env-3h-matrix-pillar.png",
} as const;

/* ─── PROP ART (7) ─── */
export const CADES_PROPS = {
  cadesInactive:       "/art/cades/props/prop-4a-cades-inactive.png",
  cadesActive:         "/art/cades/props/prop-4b-cades-active.png",
  ironLionNote:        "/art/cades/props/prop-4c-iron-lion-note.png",
  engineeringManifest: "/art/cades/props/prop-4d-engineering-manifest.png",
  cargoJacket:         "/art/cades/props/prop-4e-cargo-jacket.png",
  oldPhotograph:       "/art/cades/props/prop-4f-old-photograph.png",
  goggles:             "/art/cades/props/prop-4g-goggles.png",
} as const;

/* ─── UI ART (5) ─── */
export const CADES_UI = {
  modeSelectBg:      "/art/cades/ui/ui-5a-mode-select-bg.png",
  gmTransmissionBg:  "/art/cades/ui/ui-5b-gm-transmission-bg.png",
  openChannelBg:     "/art/cades/ui/ui-5c-open-channel-bg.png",
  loopResetDawn:     "/art/cades/ui/ui-5d-loop-reset-dawn.png",
  shieldBar:         "/art/cades/ui/ui-5e-shield-bar.png",
} as const;

/* ─── SFX (22) ─── */
export const CADES_SFX = {
  // Weapons
  ironcladFire:           "/audio/cades/sfx/cades_sfx_ironclad_fire.wav",
  resistanceRifleFire:    "/audio/cades/sfx/cades_sfx_resistance_rifle_fire.wav",
  bridgeAnchorFire:       "/audio/cades/sfx/cades_sfx_bridge_anchor_fire.wav",
  resonanceDisruptorFire: "/audio/cades/sfx/cades_sfx_resonance_disruptor_fire.wav",
  arcCasterFire:          "/audio/cades/sfx/cades_sfx_arc_caster_fire.wav",
  severanceBladeFire:     "/audio/cades/sfx/cades_sfx_severance_blade_fire.wav",
  integrityCharge:        "/audio/cades/sfx/cades_sfx_integrity_charge.wav",
  // Enemies
  machineHit:             "/audio/cades/sfx/cades_sfx_machine_hit.wav",
  machineShutdown:        "/audio/cades/sfx/cades_sfx_machine_shutdown.wav",
  machineFire:            "/audio/cades/sfx/cades_sfx_machine_fire.wav",
  factionHurt:            "/audio/cades/sfx/cades_sfx_faction_hurt.wav",
  factionDown:            "/audio/cades/sfx/cades_sfx_faction_down.wav",
  factionFire:            "/audio/cades/sfx/cades_sfx_faction_fire.wav",
  // Player
  integrityBreach:        "/audio/cades/sfx/cades_sfx_integrity_breach.wav",
  signalLost:             "/audio/cades/sfx/cades_sfx_signal_lost.wav",
  integrityRestored:      "/audio/cades/sfx/cades_sfx_integrity_restored.wav",
  // Atmosphere
  loopResetDawn:          "/audio/cades/sfx/cades_sfx_loop_reset_dawn.wav",
  ironLionSalute:         "/audio/cades/sfx/cades_sfx_iron_lion_salute.wav",
  channelOpen:            "/audio/cades/sfx/cades_sfx_channel_open.wav",
  gameMastersTransmission:"/audio/cades/sfx/cades_sfx_game_masters_transmission.wav",
  thoughtbornApproach:    "/audio/cades/sfx/cades_sfx_thoughtborn_approach.wav",
  breachAlarm:            "/audio/cades/sfx/cades_sfx_breach_alarm.wav",
} as const;

/* ─── MUSIC (7) ─── */
export const CADES_MUSIC = {
  theLastTorch:          "/audio/cades/music/cades_music_the_last_torch.wav",
  hullPressure:          "/audio/cades/music/cades_music_hull_pressure.mp3",
  archivedSilence:       "/audio/cades/music/cades_music_archived_silence.wav",
  theyAreCommitting:     "/audio/cades/music/cades_music_they_are_committing.wav",
  theTorchAndTheVoice:   "/audio/cades/music/cades_music_the_torch_and_the_voice.mp3",
  secondaryChannel:      "/audio/cades/music/cades_music_secondary_channel.wav",
  theShipsEscaped:       "/audio/cades/music/cades_music_the_ships_escaped.mp3",
} as const;

export const CADES_MUSIC_META = {
  theLastTorch:        { title: "The Last Torch",         mode: "last_stand",  usage: "Bridge ambient loop" },
  hullPressure:        { title: "Hull Pressure",          mode: "ship_defense", usage: "Ark ambient loop" },
  archivedSilence:     { title: "Archived Silence",       mode: "historical",   usage: "Matrix Hub ambient" },
  theyAreCommitting:   { title: "They Are Committing",    mode: "last_stand",  usage: "Combat escalation (wave 7+)" },
  theTorchAndTheVoice: { title: "The Torch and the Voice",mode: "last_stand",  usage: "Open Channel conversation" },
  secondaryChannel:    { title: "Secondary Channel",      mode: "historical",   usage: "Game Masters transmission" },
  theShipsEscaped:     { title: "The Ships Escaped",      mode: "last_stand",  usage: "Canon victory sting (3:47:00)" },
} as const;

/* ─── VIDEO FRAMES (10 — 5 start/end pairs for Kling) ─── */
export const CADES_VIDEO_FRAMES = {
  loopReset:    { start: "/art/cades/video-frames/video-9a-loop-reset-start.png",          end: "/art/cades/video-frames/video-9a-loop-reset-end.jpg" },
  cadesActivate:{ start: "/art/cades/video-frames/video-9b-cades-activation-start.png",    end: "/art/cades/video-frames/video-9b-cades-activation-end.png" },
  ironLionSalute:{ start: "/art/cades/video-frames/video-9c-iron-lion-salute-start.png",   end: "/art/cades/video-frames/video-9c-iron-lion-salute-end.png" },
  gmBetrayal:   { start: "/art/cades/video-frames/video-9d-game-master-betrayal-start.png",end: "/art/cades/video-frames/video-9d-game-master-betrayal-end.png" },
  thoughtborn:  { start: "/art/cades/video-frames/video-9e-thoughtborn-arrival-start.png", end: "/art/cades/video-frames/video-9e-thoughtborn-arrival-end.png" },
} as const;

/* ─── MANIFEST ─── */
export const CADES_ASSET_MANIFEST = {
  characters:    { count: 7,  dir: "/art/cades/characters/" },
  enemies:       { count: 15, dir: "/art/cades/enemies/" },
  environments:  { count: 8,  dir: "/art/cades/environments/" },
  props:         { count: 7,  dir: "/art/cades/props/" },
  ui:            { count: 5,  dir: "/art/cades/ui/" },
  sfx:           { count: 22, dir: "/audio/cades/sfx/" },
  music:         { count: 7,  dir: "/audio/cades/music/" },
  videoFrames:   { count: 10, dir: "/art/cades/video-frames/" },
  total: 81,
} as const;
