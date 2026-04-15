/* ═══════════════════════════════════════════════════════
   PRELUDE SEQUENCE — Ship-ready asset manifest

   Structured registry of the 15 Prelude beats and every asset each
   beat consumes, matching docs/production/PRELUDE_SHIP_READY_BIBLE.md
   Section 19 (Asset Delivery Checklist) exactly.

   Canonical authority: PRELUDE_SHIP_READY_BIBLE.md §19. Any
   discrepancy between this file and the Bible should be resolved by
   updating this file to match the Bible, NOT the other way around.

   Downstream consumers:
   - apps/server/preludeReadiness.test.ts — dashboards production
     progress against disk presence of new assets
   - apps/server/preludeBibleAudit.test.ts — cross-audits every
     "existing asset" claim in the Bible against this registry +
     disk + VO manifests
   - (future) A runtime Prelude sequence player that walks
     PRELUDE_BEATS in order

   Naming conventions:
   - Room slugs are kebab-case (matching on-disk file names like
     "room-cryo-bay.png"). Intentionally NOT tied to the
     arkEventHandler.ts RoomId union, which uses snake_case and is
     missing 5 Prelude-only rooms (corridor, briefing_room, galley,
     mess_hall, cargo_hold). Extending RoomId is out of scope for
     this PR; the runtime player can introduce its own bridge.
   - Asset paths are relative to the repo root (e.g.
     "apps/client/public/art/rooms/room-cryo-bay.png"). This is what
     the readiness test passes to fs.existsSync after joining with
     REPO_ROOT.
   - VFX variants are suffixed with "-{variant}.webm" (e.g.
     "chair-rim-hot-edge-build.webm"). This is the inferred
     convention — if production delivers different naming, the
     audit test will surface it.

   Known Bible inconsistency (for audit transparency): §19.1 header
   says "9 P0 + 2 P1 = 11 total" but the table has 10 P0 rows + 2 P1
   rows = 12 total. This file trusts the table, not the header.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

/**
 * Beat id. Half-step beats (A.5, C.5, D.5, F.5, H.5) are the Rev 6
 * breath beats added to slow pacing — see Bible §1.
 */
export type PreludeBeatId =
  | "beat_a"
  | "beat_a5"
  | "beat_b"
  | "beat_c"
  | "beat_c5"
  | "beat_d"
  | "beat_d5"
  | "beat_e"
  | "beat_f"
  | "beat_f5"
  | "beat_g"
  | "beat_h"
  | "beat_h5"
  | "beat_i"
  | "beat_j";

/** P0 is the playtest-unblock tier; P1 is backfill content. Bible §19. */
export type PreludePriority = "P0" | "P1";

/** Voice profile matching docs/production/VOICE_OVER_BIBLE.md. */
export type PreludeVoiceProfile =
  | "elara"
  | "the_human"
  | "the_prince"
  | "locke"
  | "the_antiquarian";

/** A room environment still. png and webp are always co-delivered. */
export interface PreludeRoomAsset {
  /** Path to the PNG relative to repo root. */
  png: string;
  /** Path to the WebP relative to repo root. */
  webp: string;
  /**
   * True if this asset already exists on main before this PR's media
   * pipeline delivers anything new (currently only `room-bridge`).
   * Readiness test excludes these from "new delivery" counts but still
   * verifies they exist on disk.
   */
  existingOnMain: boolean;
}

/** A cutscene video that plays when a beat begins. Every beat has exactly one. */
export interface PreludeCutsceneAsset {
  /** Path to the MP4 relative to repo root. */
  mp4: string;
  /**
   * Target duration in milliseconds. Every cutscene has a target from
   * Bible §19.2. Beat J's is ~8m10s (the Log 5 climax).
   */
  targetDurationMs: number;
}

/**
 * A single VO line. At runtime the `lineId` is looked up in the
 * speaker's `*VoManifest.json` (in apps/shared/) which maps the id
 * to an S3 URL. `localPath` is what the Bible specifies as the
 * notional local delivery path and is only used by the audit test.
 */
export interface PreludeVoLine {
  lineId: string;
  speaker: PreludeVoiceProfile;
  localPath: string;
  /** "new" — this PR ships a manifest entry; "existing" — Bible claims the id is already recorded. */
  status: "new" | "existing";
  /** Bible section that spec'd the line (e.g. "§8.5"). */
  bibleSection: string;
}

/** A VFX effect. Variants are files named "{base}-{suffix}.webm". */
export interface PreludeVfxAsset {
  /** Stable effect id, referenced from beat sections. */
  id: string;
  /** Base WebM path relative to repo root. */
  webmPath: string;
  /**
   * Variant suffixes. Empty array means the base file is the only
   * delivery. Non-empty means the runtime also expects
   * `{base without .webm}-{suffix}.webm` for each suffix.
   */
  variantSuffixes: readonly string[];
  /**
   * True if this effect's canonical declaration is on an earlier
   * beat and the current beat just references it. Readiness test
   * dedupes by path, so this flag only matters for documentation.
   */
  reused: boolean;
}

/** A looping ambient audio bed. */
export interface PreludeAmbientBed {
  /** Path to the MP3 relative to repo root. */
  mp3: string;
  /** EBU R128 target loudness — Bible §18.6. */
  loudnessTargetLufs: number;
}

/** A single Prelude beat with every asset it consumes. */
export interface PreludeBeat {
  id: PreludeBeatId;
  /** Human-readable title from Bible Section 1 master index. */
  title: string;
  /** Order in the Prelude sequence (1 = first to play). */
  sequenceOrder: number;
  /** Bible section number (e.g. "§3" for Beat A). */
  bibleSection: string;
  /** Kebab-case room slug matching on-disk file naming. See header note on RoomId divergence. */
  roomSlug: string;
  priority: PreludePriority;
  /** Narrative flag set when this beat's cutscene completes. */
  completionFlag?: string;
  /**
   * Room still. null if this beat reuses the room first declared by
   * `inheritsRoomFrom`. Readiness test dedupes by filesystem path,
   * so inherited rooms don't double-count.
   */
  room: PreludeRoomAsset | null;
  /** Set when `room` is null — the beat id whose room this beat reuses. */
  inheritsRoomFrom?: PreludeBeatId;
  cutscene: PreludeCutsceneAsset;
  voLines: readonly PreludeVoLine[];
  vfxAssets: readonly PreludeVfxAsset[];
  ambientBed?: PreludeAmbientBed;
}

/* ─── BEAT REGISTRY ─── */

/**
 * The 15 Prelude beats, in play order. Asset paths are authoritative
 * from Bible §19 (the delivery checklist) where it conflicts with the
 * individual beat sections. Known per-section drift:
 *
 * - Beat A.5 cutscene: §4.3 says "prelude-beat-a5-corridor.mp4",
 *   §19.2 says "prelude-beat-a5-corridor-first-steps.mp4".
 *   This file uses §19.2.
 * - Beat B cutscene: §5.4 says "prelude-beat-b-escape.mp4",
 *   §19.2 says "prelude-beat-b-corridor-escape.mp4".
 *   This file uses §19.2.
 *
 * preludeBibleAudit.test.ts surfaces both of these as per-section
 * drift from the delivery checklist.
 */
export const PRELUDE_BEATS: readonly PreludeBeat[] = [
  // ─────────────────────────────────────────────────────────
  // BEAT A — Cryo Wake (§3)
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_a",
    title: "Cryo Wake",
    sequenceOrder: 1,
    bibleSection: "§3",
    roomSlug: "cryo-bay",
    priority: "P0",
    completionFlag: "cutscene_awakening_complete",
    room: {
      png: "apps/client/public/art/rooms/room-cryo-bay.png",
      webp: "apps/client/public/art/rooms/room-cryo-bay.webp",
      existingOnMain: false,
    },
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-a-cryo-wake.mp4",
      targetDurationMs: 35_000,
    },
    voLines: [
      {
        lineId: "elara_beat_a_five_pods",
        speaker: "elara",
        localPath: "apps/client/public/audio/elara/elara_beat_a_five_pods.mp3",
        status: "new",
        bibleSection: "§3.5",
      },
    ],
    // Beat A's 3 VFX per the Master Index "3 (frost, hatch,
    // hologram-materialize)" row. The audit test surfaced these
    // paths as referenced in the Bible, so we register them as
    // new deliveries here. §3.6 has not been read in full during
    // this session — if §3.6 uses different paths, the audit test
    // will re-surface the drift and the Bible should be updated
    // to match §19 / this registry.
    vfxAssets: [
      {
        id: "vfx_cryo_frost_retreat",
        webmPath: "apps/client/public/art/vfx/prelude/cryo-frost-retreat.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_pod_hatch_cryogas",
        webmPath: "apps/client/public/art/vfx/prelude/pod-hatch-cryogas.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_hologram_materialize",
        webmPath: "apps/client/public/art/vfx/prelude/hologram-materialize.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT A.5 — Corridor First Steps (§4)
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_a5",
    title: "Corridor First Steps (Breath Beat)",
    sequenceOrder: 2,
    bibleSection: "§4",
    roomSlug: "corridor",
    priority: "P0",
    completionFlag: "breath_beat_a5_complete",
    room: {
      png: "apps/client/public/art/rooms/room-corridor.png",
      webp: "apps/client/public/art/rooms/room-corridor.webp",
      existingOnMain: false,
    },
    cutscene: {
      // §19.2 path; §4.3 says "prelude-beat-a5-corridor.mp4" (drift).
      mp4: "apps/client/public/videos/prelude/prelude-beat-a5-corridor-first-steps.mp4",
      targetDurationMs: 15_000,
    },
    voLines: [],
    vfxAssets: [
      {
        id: "vfx_breath_pulse_strip",
        webmPath: "apps/client/public/art/vfx/prelude/breath-pulse-strip.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT B — Corridor / Escape (§5)
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_b",
    title: "Corridor / Escape",
    sequenceOrder: 3,
    bibleSection: "§5",
    roomSlug: "corridor",
    priority: "P0",
    completionFlag: "cutscene_door_iris_complete",
    room: null,
    inheritsRoomFrom: "beat_a5",
    cutscene: {
      // §19.2 path; §5.4 says "prelude-beat-b-escape.mp4" (drift).
      mp4: "apps/client/public/videos/prelude/prelude-beat-b-corridor-escape.mp4",
      targetDurationMs: 20_000,
    },
    voLines: [],
    vfxAssets: [
      {
        id: "vfx_iris_hatch_open",
        webmPath: "apps/client/public/art/vfx/prelude/iris-hatch-open.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_status_pip_color_shift",
        webmPath: "apps/client/public/art/vfx/prelude/status-pip-shift.webm",
        variantSuffixes: ["loop"],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT C — Engineering / Crew Role Choice + Six Incubators (§6)
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_c",
    title: "Engineering — Crew Role Choice + Six Incubators",
    sequenceOrder: 4,
    bibleSection: "§6",
    roomSlug: "engineering",
    priority: "P0",
    completionFlag: "cutscene_engineering_intro_complete",
    room: {
      png: "apps/client/public/art/rooms/room-engineering.png",
      webp: "apps/client/public/art/rooms/room-engineering.webp",
      existingOnMain: false,
    },
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-c-engineering-role-choice.mp4",
      targetDurationMs: 35_000,
    },
    voLines: [
      {
        lineId: "elara_beat_c_six_incubators",
        speaker: "elara",
        localPath:
          "apps/client/public/audio/elara/elara_beat_c_six_incubators.mp3",
        status: "new",
        bibleSection: "§6.5",
      },
    ],
    vfxAssets: [
      {
        id: "vfx_incubator_pod_dormant_glow",
        webmPath: "apps/client/public/art/vfx/prelude/incubator-pod-dormant.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_bench_standby_pip",
        webmPath: "apps/client/public/art/vfx/prelude/bench-standby-pip.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_role_wireframe_bloom",
        webmPath: "apps/client/public/art/vfx/prelude/role-wireframe-bloom.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT C.5 — Window (Breath Beat) (§7)
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_c5",
    title: "Window (Breath Beat)",
    sequenceOrder: 5,
    bibleSection: "§7",
    roomSlug: "engineering",
    priority: "P0",
    completionFlag: "breath_beat_c5_complete",
    room: null,
    inheritsRoomFrom: "beat_c",
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-c5-window.mp4",
      targetDurationMs: 20_000,
    },
    voLines: [
      {
        lineId: "human_beat_c5_first_breath",
        speaker: "the_human",
        localPath:
          "apps/client/public/audio/human/human_beat_c5_first_breath.mp3",
        status: "new",
        bibleSection: "§7.5",
      },
    ],
    vfxAssets: [
      {
        id: "vfx_starfield_drift_viewport",
        webmPath: "apps/client/public/art/vfx/prelude/starfield-drift.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_human_palm_frost",
        webmPath: "apps/client/public/art/vfx/prelude/human-palm-frost.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT D — Cargo Bay / Trade Empire Seed + Locke Mission Board (§8)
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_d",
    title: "Cargo Bay — Trade Empire Seed + Locke Mission Board",
    sequenceOrder: 6,
    bibleSection: "§8",
    roomSlug: "cargo-hold",
    priority: "P0",
    completionFlag: "cutscene_cargo_intro_complete",
    room: {
      png: "apps/client/public/art/rooms/room-cargo-hold.png",
      webp: "apps/client/public/art/rooms/room-cargo-hold.webp",
      existingOnMain: false,
    },
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-d-cargo-bay.mp4",
      targetDurationMs: 30_000,
    },
    voLines: [
      {
        lineId: "elara_beat_d_17000_year_mission",
        speaker: "elara",
        localPath:
          "apps/client/public/audio/elara/elara_beat_d_17000_year_mission.mp3",
        status: "new",
        bibleSection: "§8.5",
      },
    ],
    vfxAssets: [
      {
        id: "vfx_starlight_shaft_dust",
        webmPath: "apps/client/public/art/vfx/prelude/starlight-shaft-dust.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_mission_slate_glow",
        webmPath: "apps/client/public/art/vfx/prelude/mission-slate-glow.webm",
        variantSuffixes: ["loop", "transition"],
        reused: false,
      },
      {
        id: "vfx_mission_glyph_bloom",
        webmPath: "apps/client/public/art/vfx/prelude/mission-glyph-bloom.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT D.5 — Galley (Breath Beat) (§9)
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_d5",
    title: "Galley (Breath Beat)",
    sequenceOrder: 7,
    bibleSection: "§9",
    roomSlug: "galley",
    priority: "P0",
    completionFlag: "breath_beat_d5_complete",
    room: {
      png: "apps/client/public/art/rooms/room-galley.png",
      webp: "apps/client/public/art/rooms/room-galley.webp",
      existingOnMain: false,
    },
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-d5-galley.mp4",
      targetDurationMs: 25_000,
    },
    voLines: [
      {
        lineId: "human_beat_d5_sandwich",
        speaker: "the_human",
        localPath: "apps/client/public/audio/human/human_beat_d5_sandwich.mp3",
        status: "new",
        bibleSection: "§9.5",
      },
    ],
    vfxAssets: [
      {
        id: "vfx_galley_pilot_warm",
        webmPath: "apps/client/public/art/vfx/prelude/galley-pilot-warm.webm",
        variantSuffixes: [],
        reused: false,
      },
      // §9.6 marks this as "optional polish — if it weakens the realism cut it".
      {
        id: "vfx_galley_steam_residue",
        webmPath: "apps/client/public/art/vfx/prelude/galley-steam-residue.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT E — Mess Hall / Prince's Archive — flashback mechanic intro (§10)
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_e",
    title: "Mess Hall / Prince's Archive",
    sequenceOrder: 8,
    bibleSection: "§10",
    roomSlug: "mess-hall",
    priority: "P0",
    completionFlag: "cutscene_mess_hall_intro_complete",
    room: {
      png: "apps/client/public/art/rooms/room-mess-hall.png",
      webp: "apps/client/public/art/rooms/room-mess-hall.webp",
      existingOnMain: false,
    },
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-e-mess-hall-flashback.mp4",
      targetDurationMs: 45_000,
    },
    voLines: [
      {
        lineId: "prince_beat_e_toy_soldier",
        speaker: "the_prince",
        localPath:
          "apps/client/public/audio/prince/prince_beat_e_toy_soldier.mp3",
        status: "new",
        bibleSection: "§10.5",
      },
      {
        lineId: "prince_beat_e_diploma",
        speaker: "the_prince",
        localPath: "apps/client/public/audio/prince/prince_beat_e_diploma.mp3",
        status: "new",
        bibleSection: "§10.5",
      },
    ],
    vfxAssets: [
      // Core flashback mechanic — reused in Beat J (§10.6 flags as shared system asset).
      {
        id: "vfx_sepia_drain",
        webmPath: "apps/client/public/art/vfx/prelude/sepia-drain.webm",
        variantSuffixes: ["forward", "reverse"],
        reused: false,
      },
      {
        id: "vfx_film_damage_overlay",
        webmPath: "apps/client/public/art/vfx/prelude/film-damage.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_diploma_ink_bloom",
        webmPath: "apps/client/public/art/vfx/prelude/diploma-ink-bloom.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT F — Briefing Room / Kael Contingency Memo (§11)
  // ─────────────────────────────────────────────────────────
  //
  // §1 Master Index claims "0 new VO lines" for Beat F but §11.5
  // explicitly adds `elara_beat_f_213_entries` as a NEW P0 line. The
  // Master Index row is stale; this file follows §11.5.
  {
    id: "beat_f",
    title: "Briefing Room — Kael Contingency Memo",
    sequenceOrder: 9,
    bibleSection: "§11",
    roomSlug: "briefing-room",
    priority: "P0",
    completionFlag: "cutscene_briefing_room_intro_complete",
    room: {
      png: "apps/client/public/art/rooms/room-briefing-room.png",
      webp: "apps/client/public/art/rooms/room-briefing-room.webp",
      existingOnMain: false,
    },
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-f-briefing-room.mp4",
      targetDurationMs: 30_000,
    },
    voLines: [
      {
        lineId: "elara_beat_f_213_entries",
        speaker: "elara",
        localPath:
          "apps/client/public/audio/elara/elara_beat_f_213_entries.mp3",
        status: "new",
        bibleSection: "§11.5",
      },
    ],
    vfxAssets: [
      {
        id: "vfx_lockbox_bio_recognize",
        webmPath:
          "apps/client/public/art/vfx/prelude/lockbox-bio-recognize.webm",
        variantSuffixes: ["idle", "recognize", "open"],
        reused: false,
      },
      {
        id: "vfx_data_slate_glow",
        webmPath: "apps/client/public/art/vfx/prelude/data-slate-glow.webm",
        variantSuffixes: ["pulse", "slowdown"],
        reused: false,
      },
      {
        id: "vfx_memo_holo_rise",
        webmPath: "apps/client/public/art/vfx/prelude/memo-holo-rise.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT F.5 — Empty Chair (Breath Beat — 90 seconds) (§12)
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_f5",
    title: "Empty Chair (Breath Beat)",
    sequenceOrder: 10,
    bibleSection: "§12",
    roomSlug: "briefing-room",
    priority: "P0",
    completionFlag: "breath_beat_f5_complete",
    room: null,
    inheritsRoomFrom: "beat_f",
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-f5-empty-chair.mp4",
      targetDurationMs: 90_000,
    },
    voLines: [
      {
        lineId: "human_beat_f5_empty_chair",
        speaker: "the_human",
        localPath:
          "apps/client/public/audio/human/human_beat_f5_empty_chair.mp3",
        status: "new",
        bibleSection: "§12.5",
      },
    ],
    vfxAssets: [
      {
        id: "vfx_chair_rim_hot_edge",
        webmPath: "apps/client/public/art/vfx/prelude/chair-rim-hot-edge.webm",
        variantSuffixes: ["build", "hold", "fade"],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT G — Medical Bay (§13) — wordless, environmental storytelling
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_g",
    title: "Medical Bay",
    sequenceOrder: 11,
    bibleSection: "§13",
    roomSlug: "medical-bay",
    priority: "P0",
    completionFlag: "cutscene_medical_bay_intro_complete",
    room: {
      png: "apps/client/public/art/rooms/room-medical-bay.png",
      webp: "apps/client/public/art/rooms/room-medical-bay.webp",
      existingOnMain: false,
    },
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-g-medical-bay.mp4",
      targetDurationMs: 25_000,
    },
    // §13.5 explicit: "Beat G is intentionally wordless."
    voLines: [],
    vfxAssets: [
      {
        id: "vfx_med_pod_faint_pulse",
        webmPath: "apps/client/public/art/vfx/prelude/med-pod-faint-pulse.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_neural_rig_idle_hum_visual",
        webmPath: "apps/client/public/art/vfx/prelude/neural-rig-idle-hum.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_transfer_array_amber_standby",
        webmPath:
          "apps/client/public/art/vfx/prelude/transfer-array-amber-standby.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT H — Comms Array / Locke's First Message (§14)
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_h",
    title: "Comms Array — NPC Inbox + Locke's First Message",
    sequenceOrder: 12,
    bibleSection: "§14",
    roomSlug: "comms-array",
    priority: "P0",
    completionFlag: "cutscene_comms_array_intro_complete",
    room: {
      png: "apps/client/public/art/rooms/room-comms-array.png",
      webp: "apps/client/public/art/rooms/room-comms-array.webp",
      existingOnMain: false,
    },
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-h-comms-array.mp4",
      targetDurationMs: 25_000,
    },
    voLines: [
      {
        lineId: "locke_beat_h_first_message",
        speaker: "locke",
        localPath:
          "apps/client/public/audio/locke/locke_beat_h_first_message.mp3",
        status: "new",
        bibleSection: "§14.5",
      },
    ],
    vfxAssets: [
      {
        id: "vfx_signal_intake_lit_panel",
        webmPath:
          "apps/client/public/art/vfx/prelude/signal-intake-lit-panel.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_inbox_envelope_unfold",
        webmPath:
          "apps/client/public/art/vfx/prelude/inbox-envelope-unfold.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_inbox_edge_sentence_bloom",
        webmPath:
          "apps/client/public/art/vfx/prelude/inbox-edge-sentence-bloom.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_amber_counter_glyph",
        webmPath: "apps/client/public/art/vfx/prelude/amber-counter-glyph.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT H.5 — Memo Pile (Breath Beat) (§15) — wordless, reuses Beat H room
  // ─────────────────────────────────────────────────────────
  {
    id: "beat_h5",
    title: "Memo Pile (Breath Beat)",
    sequenceOrder: 13,
    bibleSection: "§15",
    roomSlug: "comms-array",
    priority: "P0",
    completionFlag: "breath_beat_h5_complete",
    room: null,
    inheritsRoomFrom: "beat_h",
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-h5-memo-pile.mp4",
      targetDurationMs: 20_000,
    },
    voLines: [],
    vfxAssets: [
      {
        id: "vfx_memo_paper_drift",
        webmPath: "apps/client/public/art/vfx/prelude/memo-paper-drift.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_elara_fade_out",
        webmPath: "apps/client/public/art/vfx/prelude/elara-fade-out.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT I — Bridge / Witnessing Hub Activate (§16)
  // ─────────────────────────────────────────────────────────
  //
  // Room note: §16.3 says Beat I REUSES the existing `room-bridge.png` /
  // `.webp` asset that lives on main (pre-Prelude Bible delivery). The
  // readiness test should see this as existing and count it green.
  {
    id: "beat_i",
    title: "Bridge — Witnessing Hub Activate",
    sequenceOrder: 14,
    bibleSection: "§16",
    roomSlug: "bridge",
    priority: "P0",
    completionFlag: "cutscene_bridge_intro_complete",
    room: {
      png: "apps/client/public/art/rooms/room-bridge.png",
      webp: "apps/client/public/art/rooms/room-bridge.webp",
      existingOnMain: true,
    },
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-i-bridge-witnessing.mp4",
      targetDurationMs: 40_000,
    },
    // §16.5 explicit: "Beat I is wordless by design."
    voLines: [],
    vfxAssets: [
      {
        id: "vfx_witnessing_hub_hemisphere_bloom",
        webmPath:
          "apps/client/public/art/vfx/prelude/witnessing-hub-hemisphere-bloom.webm",
        variantSuffixes: ["activation", "steady_state"],
        reused: false,
      },
      {
        id: "vfx_primary_lights_cascade",
        webmPath:
          "apps/client/public/art/vfx/prelude/primary-lights-cascade.webm",
        variantSuffixes: ["forward", "reverse"],
        reused: false,
      },
      // §16.6 explicit: vfx_warm_dust_drift has NO asset file — it is a
      // material swap on the existing dust particle system. Not listed here
      // as a delivery because there is no file to check.
      {
        id: "vfx_viewport_polarization_lift",
        webmPath:
          "apps/client/public/art/vfx/prelude/viewport-polarization-lift.webm",
        variantSuffixes: [],
        reused: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BEAT J — Archives + Two Witnesses Meet Part 1 (§17) — the climax
  // ─────────────────────────────────────────────────────────
  //
  // Beat J is the Prelude's landing and the most asset-heavy single beat.
  // Its ~8m10s cutscene contains the full Log 5 playback, the canonical
  // 1-second silence, the *Last Words* song intro, and the first Light/Dark
  // choice. VO is ALL reused (antiq_fc_1, holo_log_5_full, song_last_words)
  // per §17.5 — "Total new VO recordings required for Beat J: zero."
  // VFX is split between reuses from Beats E and G and six new effects
  // specific to the Archives.
  //
  // The holo_log_5_full and song_last_words_prelude_cut files are spec'd
  // in CANON_REV_7_ORACLE_VEX_EXPANSION.md §5.6 rather than this Bible;
  // the paths below are the local delivery destinations the Bible uses.
  // Both will show as missing on disk until the canon expansion's own
  // production pipeline delivers them.
  {
    id: "beat_j",
    title: "Archives + Two Witnesses Meet Part 1",
    sequenceOrder: 15,
    bibleSection: "§17",
    roomSlug: "archives",
    priority: "P0",
    completionFlag: "cutscene_archives_two_witnesses_part1_complete",
    room: {
      png: "apps/client/public/art/rooms/room-archives.png",
      webp: "apps/client/public/art/rooms/room-archives.webp",
      existingOnMain: false,
    },
    cutscene: {
      mp4: "apps/client/public/videos/prelude/prelude-beat-j-archives.mp4",
      // ~8m10s — the longest cutscene in the Prelude, dominated by the
      // full 6m40s Log 5 take + the 1s silence + Last Words intro/chorus.
      targetDurationMs: 490_000,
    },
    voLines: [
      // Both reuses; zero new recordings. Log 5 and the Last Words song
      // are both spec'd in CANON_REV_7_ORACLE_VEX_EXPANSION.md §5.6, not
      // this Bible. The song is tracked in PRELUDE_BEAT_J_MUSIC below
      // because it's music, not VO, and doesn't fit PreludeVoiceProfile.
      {
        lineId: "antiq_fc_1",
        speaker: "the_antiquarian",
        localPath: "apps/client/public/audio/antiquarian/antiq_fc_1.mp3",
        status: "existing",
        bibleSection: "§17.5",
      },
      {
        lineId: "holo_log_5_full",
        speaker: "the_prince",
        localPath: "apps/client/public/audio/prince/holo_log_5_full.mp3",
        status: "existing",
        bibleSection: "§17.5",
      },
    ],
    vfxAssets: [
      // Reuses from Beat E (flashback mechanic scoped to pedestal volume).
      {
        id: "vfx_sepia_drain",
        webmPath: "apps/client/public/art/vfx/prelude/sepia-drain.webm",
        variantSuffixes: ["forward", "reverse"],
        reused: true,
      },
      {
        id: "vfx_film_damage_overlay",
        webmPath: "apps/client/public/art/vfx/prelude/film-damage.webm",
        variantSuffixes: [],
        reused: true,
      },
      // Reuse from Beat G (continuity element, visible through doorway).
      {
        id: "vfx_transfer_array_amber_standby",
        webmPath:
          "apps/client/public/art/vfx/prelude/transfer-array-amber-standby.webm",
        variantSuffixes: [],
        reused: true,
      },
      // New to Beat J (six effects per §17.6).
      {
        id: "vfx_log5_beam_transfer",
        webmPath: "apps/client/public/art/vfx/prelude/log5-beam-transfer.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_holo_pedestal_bloom",
        webmPath: "apps/client/public/art/vfx/prelude/holo-pedestal-bloom.webm",
        variantSuffixes: ["activation", "steady_state"],
        reused: false,
      },
      {
        id: "vfx_memory_crystal_pulse",
        webmPath:
          "apps/client/public/art/vfx/prelude/memory-crystal-pulse.webm",
        variantSuffixes: ["loop", "bright_steady", "flaring"],
        reused: false,
      },
      {
        id: "vfx_enigma_hand_on_rim",
        webmPath: "apps/client/public/art/vfx/prelude/enigma-hand-on-rim.webm",
        variantSuffixes: [],
        reused: false,
      },
      {
        id: "vfx_peripheral_warm_halo",
        webmPath:
          "apps/client/public/art/vfx/prelude/peripheral-warm-halo.webm",
        variantSuffixes: ["build", "hold", "fade"],
        reused: false,
      },
      {
        id: "vfx_choice_pillar_light_dark_split",
        webmPath:
          "apps/client/public/art/vfx/prelude/choice-pillar-light-dark-split.webm",
        variantSuffixes: ["appearance", "light", "dark"],
        reused: false,
      },
    ],
  },
];

/* ─── BACKFILL ROOMS ─── */

/**
 * P1 backfill rooms from Bible §20. These two rooms are referenced
 * by the Master Index as "Cumulative armory backfill" and "Cumulative
 * captain's quarters backfill" with the P1 priority. They are not
 * attached to a specific Prelude beat — they are environment-only
 * rooms the player can optionally walk into between beats.
 */
export const PRELUDE_BACKFILL_ROOMS: readonly PreludeRoomAsset[] = [
  {
    png: "apps/client/public/art/rooms/room-armory.png",
    webp: "apps/client/public/art/rooms/room-armory.webp",
    existingOnMain: false,
  },
  {
    png: "apps/client/public/art/rooms/room-captains-quarters.png",
    webp: "apps/client/public/art/rooms/room-captains-quarters.webp",
    existingOnMain: false,
  },
];

/* ─── BEAT J MUSIC (separate from VO) ─── */

/**
 * Beat J's Last Words song cut. Tracked separately from voLines
 * because it's music, not VO — the Enigma's singing voice is
 * canonical but doesn't fit `PreludeVoiceProfile`. Bible §17.5
 * "Audio track 3" + canon expansion §5.6.9 for the full lyrics.
 */
export const PRELUDE_BEAT_J_MUSIC: readonly { mp3: string; bibleSection: string }[] = [
  {
    mp3: "apps/client/public/audio/music/song_last_words_prelude_cut.mp3",
    bibleSection: "§17.5",
  },
];

/* ─── AMBIENT AUDIO BEDS ─── */

/**
 * Prelude ambient audio beds per Bible §19.5. These are tracked
 * separately from `PRELUDE_BEATS` because ambient beds cross beat
 * boundaries (Beat G's transfer-array-standby is reused in Beat J's
 * Archives mix). Each bed is a deliverable with a loudness target.
 */
export const PRELUDE_AMBIENT_BEDS: readonly PreludeAmbientBed[] = [
  {
    mp3: "apps/client/public/audio/ambient/prelude/neural-rig-hum.mp3",
    loudnessTargetLufs: -18,
  },
  {
    mp3: "apps/client/public/audio/ambient/prelude/transfer-array-standby.mp3",
    loudnessTargetLufs: -20,
  },
  {
    mp3: "apps/client/public/audio/ambient/prelude/bridge-powered-systems.mp3",
    loudnessTargetLufs: -19,
  },
];

/* ─── HELPERS ─── */

/**
 * Collected asset paths across the entire Prelude registry, grouped by
 * kind. Used by `preludeReadiness.test.ts` to compute the delivery
 * dashboard and by `preludeBibleAudit.test.ts` to diff against the
 * Bible's path references.
 *
 * Each value is a deduplicated sorted array of repo-root-relative paths.
 * VFX variants are expanded into their full file list (base + one file
 * per suffix). Reused VFX are included once per unique path regardless
 * of how many beats reference them.
 */
export interface CollectedPreludePaths {
  roomPngs: readonly string[];
  roomWebps: readonly string[];
  cutsceneMp4s: readonly string[];
  voAudioNew: readonly string[];
  voAudioExisting: readonly string[];
  vfxWebms: readonly string[];
  ambientMp3s: readonly string[];
}

/** Expand a VFX asset to its full file list (base + variants). */
function expandVfxFiles(vfx: PreludeVfxAsset): string[] {
  const files: string[] = [vfx.webmPath];
  if (vfx.variantSuffixes.length === 0) return files;
  const basePath = vfx.webmPath.replace(/\.webm$/u, "");
  for (const suffix of vfx.variantSuffixes) {
    files.push(`${basePath}-${suffix}.webm`);
  }
  return files;
}

/** Sort + dedupe a list of paths. */
function uniqueSorted(paths: string[]): string[] {
  return Array.from(new Set(paths)).sort();
}

/**
 * Walk PRELUDE_BEATS + PRELUDE_BACKFILL_ROOMS + PRELUDE_AMBIENT_BEDS
 * and collect every unique asset path grouped by kind.
 */
export function collectPreludeAssetPaths(): CollectedPreludePaths {
  const roomPngs: string[] = [];
  const roomWebps: string[] = [];
  const cutsceneMp4s: string[] = [];
  const voAudioNew: string[] = [];
  const voAudioExisting: string[] = [];
  const vfxWebms: string[] = [];
  const ambientMp3s: string[] = [];

  for (const beat of PRELUDE_BEATS) {
    if (beat.room) {
      roomPngs.push(beat.room.png);
      roomWebps.push(beat.room.webp);
    }
    cutsceneMp4s.push(beat.cutscene.mp4);
    for (const line of beat.voLines) {
      if (line.status === "new") {
        voAudioNew.push(line.localPath);
      } else {
        voAudioExisting.push(line.localPath);
      }
    }
    for (const vfx of beat.vfxAssets) {
      vfxWebms.push(...expandVfxFiles(vfx));
    }
  }

  for (const backfill of PRELUDE_BACKFILL_ROOMS) {
    roomPngs.push(backfill.png);
    roomWebps.push(backfill.webp);
  }

  for (const bed of PRELUDE_AMBIENT_BEDS) {
    ambientMp3s.push(bed.mp3);
  }

  return {
    roomPngs: uniqueSorted(roomPngs),
    roomWebps: uniqueSorted(roomWebps),
    cutsceneMp4s: uniqueSorted(cutsceneMp4s),
    voAudioNew: uniqueSorted(voAudioNew),
    voAudioExisting: uniqueSorted(voAudioExisting),
    vfxWebms: uniqueSorted(vfxWebms),
    ambientMp3s: uniqueSorted(ambientMp3s),
  };
}

/**
 * Set of room PNG paths that already exist on main (pre-Prelude Bible).
 * Today this is only `room-bridge.png`. Built from beat data so we stay
 * in sync if more rooms get the `existingOnMain: true` flag later.
 */
function existingOnMainRoomPngs(): Set<string> {
  const set = new Set<string>();
  for (const beat of PRELUDE_BEATS) {
    if (beat.room?.existingOnMain) set.add(beat.room.png);
  }
  return set;
}

/**
 * Total count of new deliverables across all asset categories. Used by
 * the readiness dashboard as the denominator for its "N of M delivered"
 * display. Does NOT count `existingOnMain` rooms (the bridge) since
 * those are not this PR's pipeline responsibility.
 */
export function countPreludeNewDeliveries(): number {
  const paths = collectPreludeAssetPaths();
  const existing = existingOnMainRoomPngs();
  const newRoomCount = paths.roomPngs.filter((p) => !existing.has(p)).length;
  return (
    newRoomCount +
    paths.cutsceneMp4s.length +
    paths.voAudioNew.length +
    paths.vfxWebms.length +
    paths.ambientMp3s.length +
    PRELUDE_BEAT_J_MUSIC.length
  );
}
