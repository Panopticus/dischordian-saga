import { assetUrl } from "@/lib/assetUrl";

/* ═══════════════════════════════════════════════════════
   PRELUDE + ACT 1 DELIVERABLE ASSETS

   Typed catalog for the media bundle delivered in
   `Dischordian_Saga_Prelude_Act1_Assets.zip`. Maps every
   shipped file to a structured entry the runtime can consume
   via `assetUrl()` (local in dev, CDN in prod).

   Covers six categories:
     1. Prelude cutscene videos (10 MP4s)
     2. Prelude cutscene bookend stills (13 beats × {start, end})
     3. Prelude VFX still frames (code-implemented effects get
        pre-rendered start/end/frame paintings to cross-fade)
     4. Prelude room backdrops (4 rooms from zip; the remaining
        9 Bible rooms ship alongside as PNG-only)
     5. Prelude music + ambient audio beds
     6. Act 1 deliverables — 3 cutscenes + 5 rooms + 10
        battlefields + 14 portraits + 14 cards + 3 tracks

   Naming is authoritative to the zip. The Bible `PRELUDE_BEATS`
   registry in `apps/shared/preludeSequence.ts` remains the
   canonical ordering authority — this file documents the
   delivery-side paths so the runtime can light them up.
   ═══════════════════════════════════════════════════════ */

/* ─── SHARED TYPES ─── */

/** A still image with PNG + WebP delivery; consumers should prefer WebP. */
export interface ImagePair {
  png: string;
  webp: string;
}

function pair(path: string): ImagePair {
  if (!path.endsWith(".png")) {
    throw new Error(`pair() expects a .png suffix, got ${path}`);
  }
  return {
    png: assetUrl(path),
    webp: assetUrl(path.replace(/\.png$/u, ".webp")),
  };
}

/* ─── PRELUDE — CUTSCENE VIDEOS ─── */

/**
 * The 10 Prelude cutscene videos delivered by the production pipeline,
 * keyed by the Bible beat id they satisfy. A beat absent from this
 * map has no dedicated video delivery (breath beats F.5 and H.5 land
 * on cutscene bookend stills only).
 */
export const PRELUDE_CUTSCENE_VIDEOS: Readonly<Record<string, string>> = {
  beat_a: assetUrl("videos/prelude/prelude-beat-a-awakening.mp4"),
  beat_b: assetUrl("videos/prelude/prelude-beat-b-iris-open.mp4"),
  beat_c5: assetUrl("videos/prelude/prelude-beat-c5-palm-frost.mp4"),
  beat_d: assetUrl("videos/prelude/prelude-beat-d-cargo.mp4"),
  // The delivery's "medbay" clip lands on Beat G (medical-bay) in the
  // Bible, NOT Beat E (which is mess-hall — still VO+bookend only).
  beat_g: assetUrl("videos/prelude/prelude-beat-e-medbay.mp4"),
  beat_f: assetUrl("videos/prelude/prelude-beat-f-briefing.mp4"),
  // Observation deck / bridge viewing — lands on Beat I (Bridge).
  beat_i: assetUrl("videos/prelude/prelude-beat-g-observation.mp4"),
  // The bridge/comms-array handshake clip lands on Beat H.
  beat_h: assetUrl("videos/prelude/prelude-beat-h-bridge.mp4"),
  // Archive + finale both map to Beat J; the finale is the longer
  // Last Words landing so we expose both paths.
  beat_j: assetUrl("videos/prelude/prelude-beat-j-finale.mp4"),
} as const;

/** Alternate take of Beat J — the earlier Archives arrival cut. */
export const PRELUDE_BEAT_J_ARCHIVES_ARRIVAL = assetUrl(
  "videos/prelude/prelude-beat-j-archives-arrival-clip.mp4",
);

/** Alternate earlier take of Beat I (the "archive" clip), kept as b-roll. */
export const PRELUDE_BEAT_I_ARCHIVE_ALT = assetUrl(
  "videos/prelude/prelude-beat-i-archive.mp4",
);

/* ─── PRELUDE — CUTSCENE BOOKEND STILLS ─── */

/**
 * Start/end stills framing every cutscene. Rendered as a pre-roll
 * title card (start) before the video begins and a post-roll
 * landing card (end) as the video fades. Gives each beat a paced
 * "breath in → video → breath out" rhythm even when the underlying
 * video is short or missing.
 *
 * Keyed by Bible `PreludeBeatId`. Breath beats A.5, C.5, D.5 ship
 * bookends; F.5 and H.5 do not.
 */
export const PRELUDE_CUTSCENE_BOOKENDS: Readonly<
  Record<string, { start: ImagePair; end: ImagePair }>
> = {
  beat_a: {
    start: pair("art/cutscenes/prelude/beat-a-awakening_start.png"),
    end: pair("art/cutscenes/prelude/beat-a-awakening_end.png"),
  },
  beat_a5: {
    start: pair("art/cutscenes/prelude/beat-a5-corridor_start.png"),
    end: pair("art/cutscenes/prelude/beat-a5-corridor_end.png"),
  },
  beat_b: {
    start: pair("art/cutscenes/prelude/beat-b-escape_start.png"),
    end: pair("art/cutscenes/prelude/beat-b-escape_end.png"),
  },
  beat_c: {
    start: pair("art/cutscenes/prelude/beat-c-engineering_start.png"),
    end: pair("art/cutscenes/prelude/beat-c-engineering_end.png"),
  },
  beat_c5: {
    start: pair("art/cutscenes/prelude/beat-c5-window_start.png"),
    end: pair("art/cutscenes/prelude/beat-c5-window_end.png"),
  },
  beat_d: {
    start: pair("art/cutscenes/prelude/beat-d-cargo-bay_start.png"),
    end: pair("art/cutscenes/prelude/beat-d-cargo-bay_end.png"),
  },
  beat_d5: {
    start: pair("art/cutscenes/prelude/beat-d5-galley_start.png"),
    end: pair("art/cutscenes/prelude/beat-d5-galley_end.png"),
  },
  // Beat E Bible subject is "Mess Hall / Prince's Archive flashback";
  // delivery's "medbay" still is repurposed as Beat G's bookends below.
  // Beat E uses its Bible-canonical video + flashback component only.
  beat_g: {
    start: pair("art/cutscenes/prelude/beat-e-medbay_start.png"),
    end: pair("art/cutscenes/prelude/beat-e-medbay_end.png"),
  },
  beat_f: {
    start: pair("art/cutscenes/prelude/beat-f-briefing_start.png"),
    end: pair("art/cutscenes/prelude/beat-f-briefing_end.png"),
  },
  beat_i: {
    start: pair("art/cutscenes/prelude/beat-g-observation_start.png"),
    end: pair("art/cutscenes/prelude/beat-g-observation_end.png"),
  },
  beat_h: {
    start: pair("art/cutscenes/prelude/beat-h-bridge_start.png"),
    end: pair("art/cutscenes/prelude/beat-h-bridge_end.png"),
  },
  beat_j: {
    start: pair("art/cutscenes/prelude/beat-j-finale_start.png"),
    end: pair("art/cutscenes/prelude/beat-j-finale_end.png"),
  },
} as const;

/**
 * Earlier take of Beat J's arrival bookend — kept for Archives
 * first-step moment if a pre-finale title is needed.
 */
export const PRELUDE_BEAT_I_ARCHIVE_BOOKENDS = {
  start: pair("art/cutscenes/prelude/beat-i-archive_start.png"),
  end: pair("art/cutscenes/prelude/beat-i-archive_end.png"),
} as const;

/* ─── PRELUDE — VFX STILL FRAMES ─── */

/**
 * VFX bookend stills. Most code-implemented VFX effects now have
 * a start/end (or single-frame) painting that components can
 * cross-fade between for a much richer look than CSS gradients
 * alone. Each VFX id maps to the states the painter delivered.
 */
export interface PreludeVfxStills {
  start?: ImagePair;
  end?: ImagePair;
  /** Single-frame effects (loops, drifts) deliver one painting. */
  frame?: ImagePair;
  /** The iris hatch ships only its closed-state painting. */
  closed?: ImagePair;
}

export const PRELUDE_VFX_STILLS: Readonly<Record<string, PreludeVfxStills>> = {
  vfx_starfield_drift_viewport: {
    frame: pair("art/vfx/prelude/starfield-drift_frame.png"),
  },
  vfx_role_wireframe_bloom: {
    start: pair("art/vfx/prelude/role-wireframe-bloom_start.png"),
    end: pair("art/vfx/prelude/role-wireframe-bloom_end.png"),
  },
  vfx_human_palm_frost: {
    start: pair("art/vfx/prelude/human-palm-frost_start.png"),
    end: pair("art/vfx/prelude/human-palm-frost_end.png"),
  },
  vfx_diploma_ink_bloom: {
    start: pair("art/vfx/prelude/diploma-ink-bloom_start.png"),
    end: pair("art/vfx/prelude/diploma-ink-bloom_end.png"),
  },
  vfx_mission_glyph_bloom: {
    start: pair("art/vfx/prelude/mission-glyph-bloom_start.png"),
    end: pair("art/vfx/prelude/mission-glyph-bloom_end.png"),
  },
  vfx_starlight_shaft_dust: {
    frame: pair("art/vfx/prelude/starlight-shaft-dust_frame.png"),
  },
  vfx_enigma_hand_on_rim: {
    frame: pair("art/vfx/prelude/enigma-hand-on-rim_frame.png"),
  },
  vfx_memo_paper_drift: {
    frame: pair("art/vfx/prelude/memo-paper-drift_frame.png"),
  },
  vfx_iris_hatch_open: {
    closed: pair("art/vfx/prelude/iris-hatch-open_closed.png"),
  },
  vfx_memo_holo_rise: {
    end: pair("art/vfx/prelude/memo-holo-rise_end.png"),
  },
  vfx_holo_pedestal_bloom: {
    end: pair("art/vfx/prelude/holo-pedestal-bloom_end.png"),
  },
} as const;

/** Legacy intermediate VFX MP4 sources (raw renders; pre-webm). */
export const PRELUDE_VFX_SOURCE_MP4S: Readonly<Record<string, string>> = {
  vfx_cryo_frost_retreat: assetUrl("art/vfx/prelude/cryo-frost-retreat.mp4"),
  vfx_pod_hatch_cryogas: assetUrl("art/vfx/prelude/pod-hatch-cryogas.mp4"),
  vfx_hologram_materialize: assetUrl("art/vfx/prelude/hologram-materialize.mp4"),
  vfx_breath_pulse_strip: assetUrl("art/vfx/prelude/breath-pulse-strip.mp4"),
  vfx_sepia_drain: assetUrl("art/vfx/prelude/sepia-drain.mp4"),
  vfx_film_damage_overlay: assetUrl("art/vfx/prelude/film-damage-overlay.mp4"),
} as const;

/* ─── PRELUDE — ROOM BACKDROPS ─── */

/**
 * Delivered room stills. The four "hero" rooms ship both PNG + WebP;
 * the remaining Bible rooms ship as PNG-only intermediates
 * (`ResponsiveImage` falls back cleanly).
 */
export const PRELUDE_ROOM_BACKDROPS: Readonly<Record<string, ImagePair>> = {
  // All 13 rooms ship to the top-level `art/rooms/` prefix — both PNG
  // and WebP variants live. Confirmed by 2026-04-25 audit probe + the
  // `scan-path-mismatches.sh` follow-up. Earlier registry revisions had
  // 4 hero rooms under `art/rooms/prelude/`, but those keys were never
  // populated (the production ZIP shipped under different filenames,
  // e.g. `room-engineering-bay.png` vs the registry's
  // `room-engineering.png`); the canonical bytes are at the top-level
  // path for every room.
  "cryo-bay": pair("art/rooms/room-cryo-bay.png"),
  "cargo-hold": pair("art/rooms/room-cargo-hold.png"),
  engineering: pair("art/rooms/room-engineering.png"),
  bridge: pair("art/rooms/room-bridge.png"),
  corridor: pair("art/rooms/room-corridor.png"),
  galley: pair("art/rooms/room-galley.png"),
  "mess-hall": pair("art/rooms/room-mess-hall.png"),
  "briefing-room": pair("art/rooms/room-briefing-room.png"),
  "medical-bay": pair("art/rooms/room-medical-bay.png"),
  "comms-array": pair("art/rooms/room-comms-array.png"),
  archives: pair("art/rooms/room-archives.png"),
  armory: pair("art/rooms/room-armory.png"),
  "captains-quarters": pair("art/rooms/room-captains-quarters.png"),
} as const;

/* ─── PRELUDE — AUDIO ─── */

/** Prelude music tracks shipped with the bundle. */
export const PRELUDE_MUSIC = {
  ambientShip: assetUrl("audio/prelude/prelude-ambient-ship.mp3"),
  elaraTheme: assetUrl("audio/prelude/prelude-elara-theme.mp3"),
} as const;

/** Prelude ambient audio beds (intermediate WAVs from Bible §19.5). */
export const PRELUDE_AMBIENT_BEDS_DELIVERED = {
  neuralRigHum: assetUrl("audio/ambient/prelude/ambient_neural_rig_hum.wav"),
  transferArrayStandby: assetUrl(
    "audio/ambient/prelude/ambient_transfer_array_standby.wav",
  ),
  bridgePoweredSystems: assetUrl(
    "audio/ambient/prelude/ambient_bridge_powered_systems_mix.wav",
  ),
} as const;

/* ─── ACT 1 — CUTSCENE VIDEOS ─── */

export type Act1CutsceneId =
  | "act1-tavern-arrival"
  | "act1-arena-challenge"
  | "act1-council-revelation";

export const ACT1_CUTSCENES: Readonly<
  Record<Act1CutsceneId, { video: string; bookends: { start: ImagePair; end: ImagePair }; title: string }>
> = {
  "act1-tavern-arrival": {
    title: "Tavern Arrival",
    video: assetUrl("videos/act1/act1-tavern-arrival.mp4"),
    bookends: {
      start: pair("art/cutscenes/act1/act1-tavern-arrival_start.png"),
      end: pair("art/cutscenes/act1/act1-tavern-arrival_end.png"),
    },
  },
  "act1-arena-challenge": {
    title: "Arena Challenge",
    video: assetUrl("videos/act1/act1-arena-challenge.mp4"),
    bookends: {
      start: pair("art/cutscenes/act1/act1-arena-challenge_start.png"),
      end: pair("art/cutscenes/act1/act1-arena-challenge_end.png"),
    },
  },
  "act1-council-revelation": {
    title: "Council Revelation",
    video: assetUrl("videos/act1/act1-council-revelation.mp4"),
    bookends: {
      start: pair("art/cutscenes/act1/act1-council-revelation_start.png"),
      end: pair("art/cutscenes/act1/act1-council-revelation_end.png"),
    },
  },
} as const;

/* ─── ACT 1 — ROOMS / ENVIRONMENTS ─── */

export type Act1RoomId =
  | "tavern"
  | "market-square"
  | "council-chamber"
  | "dockyard"
  | "arena-lobby";

export const ACT1_ROOMS: Readonly<Record<Act1RoomId, ImagePair>> = {
  tavern: pair("art/rooms/act1/room-tavern.png"),
  "market-square": pair("art/rooms/act1/room-market-square.png"),
  "council-chamber": pair("art/rooms/act1/room-council-chamber.png"),
  dockyard: pair("art/rooms/act1/room-dockyard.png"),
  "arena-lobby": pair("art/rooms/act1/room-arena-lobby.png"),
} as const;

/* ─── ACT 1 — BATTLEFIELDS ─── */

export type Act1BattlefieldId =
  | "tavern-brawl"
  | "market-alley"
  | "arena-pit"
  | "dockyard-platform"
  | "council-floor"
  | "underground-forge"
  | "void-bridge"
  | "garden-ruins"
  | "rooftop-chase"
  | "ship-corridor";

export const ACT1_BATTLEFIELDS: Readonly<Record<Act1BattlefieldId, ImagePair>> = {
  "tavern-brawl": pair("art/battlefields/act1/bf-tavern-brawl.png"),
  "market-alley": pair("art/battlefields/act1/bf-market-alley.png"),
  "arena-pit": pair("art/battlefields/act1/bf-arena-pit.png"),
  "dockyard-platform": pair("art/battlefields/act1/bf-dockyard-platform.png"),
  "council-floor": pair("art/battlefields/act1/bf-council-floor.png"),
  "underground-forge": pair("art/battlefields/act1/bf-underground-forge.png"),
  "void-bridge": pair("art/battlefields/act1/bf-void-bridge.png"),
  "garden-ruins": pair("art/battlefields/act1/bf-garden-ruins.png"),
  "rooftop-chase": pair("art/battlefields/act1/bf-rooftop-chase.png"),
  "ship-corridor": pair("art/battlefields/act1/bf-ship-corridor.png"),
} as const;

/* ─── ACT 1 — PORTRAITS ─── */

export type Act1PortraitId =
  | "human"
  | "elara"
  | "enigma"
  | "engineer"
  | "gamemaster"
  | "warlord"
  | "iron-lion"
  | "agent-zero"
  | "collector"
  | "degen"
  | "meme"
  | "necromancer"
  | "seer"
  | "watcher";

export const ACT1_PORTRAITS: Readonly<Record<Act1PortraitId, ImagePair>> = {
  human: pair("art/portraits/act1/portrait-human.png"),
  elara: pair("art/portraits/act1/portrait-elara.png"),
  enigma: pair("art/portraits/act1/portrait-enigma.png"),
  engineer: pair("art/portraits/act1/portrait-engineer.png"),
  gamemaster: pair("art/portraits/act1/portrait-gamemaster.png"),
  warlord: pair("art/portraits/act1/portrait-warlord.png"),
  "iron-lion": pair("art/portraits/act1/portrait-iron-lion.png"),
  "agent-zero": pair("art/portraits/act1/portrait-agent-zero.png"),
  collector: pair("art/portraits/act1/portrait-collector.png"),
  degen: pair("art/portraits/act1/portrait-degen.png"),
  meme: pair("art/portraits/act1/portrait-meme.png"),
  necromancer: pair("art/portraits/act1/portrait-necromancer.png"),
  seer: pair("art/portraits/act1/portrait-seer.png"),
  watcher: pair("art/portraits/act1/portrait-watcher.png"),
} as const;

/* ─── ACT 1 — STARTER CARDS ─── */

export type Act1CardId =
  | "strike"
  | "slash"
  | "shield-bash"
  | "dodge"
  | "heal"
  | "fireball"
  | "shadow-bolt"
  | "ice-wall"
  | "lightning-chain"
  | "poison"
  | "trap"
  | "mind-control"
  | "void-rift"
  | "back";

export const ACT1_CARDS: Readonly<Record<Act1CardId, ImagePair>> = {
  strike: pair("art/cards/act1/card-strike.png"),
  slash: pair("art/cards/act1/card-slash.png"),
  "shield-bash": pair("art/cards/act1/card-shield-bash.png"),
  dodge: pair("art/cards/act1/card-dodge.png"),
  heal: pair("art/cards/act1/card-heal.png"),
  fireball: pair("art/cards/act1/card-fireball.png"),
  "shadow-bolt": pair("art/cards/act1/card-shadow-bolt.png"),
  "ice-wall": pair("art/cards/act1/card-ice-wall.png"),
  "lightning-chain": pair("art/cards/act1/card-lightning-chain.png"),
  poison: pair("art/cards/act1/card-poison.png"),
  trap: pair("art/cards/act1/card-trap.png"),
  "mind-control": pair("art/cards/act1/card-mind-control.png"),
  "void-rift": pair("art/cards/act1/card-void-rift.png"),
  back: pair("art/cards/act1/card-back.png"),
} as const;

/* ─── ACT 1 — MUSIC ─── */

export const ACT1_MUSIC = {
  tavernAmbient: assetUrl("audio/act1/act1-tavern-ambient.mp3"),
  arenaBattle: assetUrl("audio/act1/act1-arena-battle.mp3"),
  councilTension: assetUrl("audio/act1/act1-council-tension.mp3"),
} as const;

/* ─── CONVENIENCE HELPERS ─── */

/**
 * Does this Bible beat id have a delivered cutscene video? Used by
 * the Prelude sequence player to pick between video playback and
 * the bookend-only ("audio-drama") fallback.
 */
export function hasPreludeCutsceneVideo(beatId: string): boolean {
  return beatId in PRELUDE_CUTSCENE_VIDEOS;
}

/** Lookup a Prelude cutscene video URL by Bible beat id, or null. */
export function getPreludeCutsceneVideo(beatId: string): string | null {
  return PRELUDE_CUTSCENE_VIDEOS[beatId] ?? null;
}

/** Lookup the bookend stills for a Prelude beat, or null. */
export function getPreludeCutsceneBookends(
  beatId: string,
): { start: ImagePair; end: ImagePair } | null {
  return PRELUDE_CUTSCENE_BOOKENDS[beatId] ?? null;
}
