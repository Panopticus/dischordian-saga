/* ═══════════════════════════════════════════════════════
   ROOM MEDIA PROMPTS — nano-banana stills + Veo 3.1 videos

   Sibling to roomStateArtPrompts.ts (Section F flag-driven
   states for Cryo Bay and Medical Bay) and roomTierArtPrompts.ts
   (4-tier progression spine for Bridge and Engineering). This
   catalog covers every other room render the asset team needs
   to author beyond those two files — both still images
   (Gemini 2.5 Flash Image / nano-banana 2) and short videos
   (Veo 3.1) for ambient loops + one-shot cinematics.

   Style anchors are re-exported from roomStateArtPrompts.ts so
   the visual vocabulary (cyberpunk-meets-steampunk-sorcery,
   28mm wide-shot, no figures, no rendered text) carries over
   verbatim. Authors must NOT prepend their own anchor — the
   CSV-export pipeline does it once at row-emit time.

   Wire-up:
     - For stills: drop the rendered URL into the asset map in
       apps/client/src/game/roomStateAssets.ts under the matching
       roomId + stateId. The runtime resolver picks it up
       automatically and falls down-tier if missing.
     - For videos: extend roomStateAssets.ts with a `videos` field
       per (roomId, stateId). Videos are overlays — the still is
       always rendered first as a fallback.

   Accessibility note: every entry in this catalog targets a
   universal-access room (universal Prelude/Outbreak room or one
   of the species-exclusive bonus rooms tagged P2). No critical-
   path content lives in species rooms — see the §6.3b parity
   probe for the test that enforces this.
   ═══════════════════════════════════════════════════════ */

import { ROOM_STATE_STYLE_ANCHOR } from "./roomStateArtPrompts";

export type MediaModel = "nano-banana-2" | "veo-3.1";
export type MediaKind = "image" | "video";
export type Priority = "P0" | "P1" | "P2";

export interface RoomMediaPrompt {
  /** Stable asset id — `<roomId>:<stateId>` for stills,
   *  `<roomId>:<stateId>:video` or `shadow-tongue:<beat>` for videos. */
  assetId: string;
  roomId: string;
  /** State slug — matches the narrativeFlag-driven stateId in
   *  roomStateAssets.ts variant picker. */
  stateId: string;
  kind: MediaKind;
  model: MediaModel;
  label: string;
  /** Plain-English condition the runtime variant-picker / event
   *  trigger encodes. Mirrors the existing roomStateArtPrompts.ts
   *  contract so prompt-author and engineer agree on visibility. */
  condition: string;
  /** Prompt body without the shared anchor; the CSV-export pipeline
   *  composes `${ANCHOR} ${prompt}` at emit time. */
  prompt: string;
  /** Public-facing output path under apps/client/public/. The
   *  S3 upload pipeline mirrors this 1:1 to cdn/client-public/. */
  outputPath: string;
  /** Target resolution (stills) or `1920x1080@24fps,<n>s loop` etc (videos). */
  resolution: string;
  priority: Priority;
  dependencies: readonly string[];
}

const RES_STILL = "1920x1080";
const RES_VIDEO_LOOP_8S = "1920x1080@24fps,8s loop";
const RES_VIDEO_LOOP_10S = "1920x1080@24fps,10s loop";
const RES_VIDEO_ONESHOT_5S = "1920x1080@24fps,5s one-shot";
const RES_VIDEO_ONESHOT_6S = "1920x1080@24fps,6s one-shot";
const RES_VIDEO_ONESHOT_8S = "1920x1080@24fps,8s one-shot";
const RES_VIDEO_ONESHOT_12S = "1920x1080@24fps,12s one-shot";

const DEPS_IMAGE_ANCHOR = ["room_media_style_anchor_image"] as const;
const DEPS_VIDEO_ANCHOR = ["room_media_style_anchor_video"] as const;
const DEPS_VIDEO_ST = [
  "room_media_style_anchor_video",
  "shadow_tongue_corruption_layer",
] as const;
const DEPS_IMAGE_ST = [
  "room_media_style_anchor_image",
  "shadow_tongue_corruption_layer",
] as const;

/** Re-export of the still-image style anchor. Authors compose against this. */
export const ROOM_MEDIA_STYLE_ANCHOR_IMAGE = ROOM_STATE_STYLE_ANCHOR;

/** Cinematographic anchor for every Veo 3.1 entry. Engine drives audio
 *  separately — prompts must NOT request audio generation. */
export const ROOM_MEDIA_STYLE_ANCHOR_VIDEO =
  "Cinematographic constraints: 16:9 1920x1080 at 24fps. Locked camera unless explicitly cinematic. " +
  "Match the still palette exactly: cold institutional steel, patinated brass, deep oxblood accents, " +
  "warm-gold service lamps, phosphor-lavender and phosphor-green sorcerous-circuit glows. " +
  "Soft rim-light from ceiling strips, single warm-gold key, visible dust-in-beam, faint film-grain sepia. " +
  "No rendered text, no UI overlays, no watermarks, no captions, no figures unless explicitly named. " +
  "Audio NOT generated (the engine drives audio separately). " +
  "Loops must hide their cut point — match first and last frame.";

/** Composable corruption layer for ST-affected assets. Append to a base prompt
 *  body when the room/state is in a Shadow-Tongue-corrupted condition. */
export const SHADOW_TONGUE_CORRUPTION_LAYER =
  "Corruption layer (apply over base): a single artifact in frame is overwritten in an indigo hue " +
  "that drifts toward a colour the eye cannot quite name (not blue, not violet, not magenta — a hue that " +
  "reads as 'wrong'). RGB channel-shift on the artifact only, ~1px horizontal red/blue separation. Glyphs " +
  "on the artifact appear in two layers — a warm-gold underlayer (the original) and a slightly out-of-register " +
  "indigo overlayer (the edit). No hard glitch artifacts; the corruption is quiet, literary, deniable. " +
  "The rest of the room is unaffected.";

/* ─── ARCHIVES — Shadow Tongue primary room (3 stills) ─── */

const ARCHIVES_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "archives:corrupted",
    roomId: "archives",
    stateId: "corrupted",
    kind: "image",
    model: "nano-banana-2",
    label: "Archives — Shadow Tongue corruption visible",
    condition:
      "narrativeFlags.shadow_tongue_corruption_seen === true. Set when the player examines a corrupted-scroll-rack or rewritten-ledger hotspot.",
    outputPath: "art/rooms/mystery-states/archives_corrupted.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ST,
    prompt:
      "The Archives' main reading hall, wide architectural shot from the entry-arch vantage. Centre-back: " +
      "the curved data-orb pedestal, dimmed to the unnameable indigo hue that drifts away from violet. Left and " +
      "right walls: tall brass-framed scroll racks with frosted-glass fronts, behind which scrolls show two-layer " +
      "text — a warm-gold underlayer in Elara's hand and a slightly out-of-register indigo overlayer that has " +
      "rewritten select words. Foreground centre: the lectern stage, its stone base ringed in a faint indigo halo. " +
      "Stage-right: a freestanding glass cabinet with a hand-stitched label (rendered as fabric texture only, no " +
      "rendered text). Atmosphere: the room is intact, beautiful, undisturbed — but reading it is no longer " +
      "neutral. Apply the Shadow Tongue corruption layer on the data-orb, the scroll-rack glass, and the lectern " +
      "halo only — the rest of the room remains in standard warm-gold.",
  },
  {
    assetId: "archives:uncorrupted",
    roomId: "archives",
    stateId: "uncorrupted",
    kind: "image",
    model: "nano-banana-2",
    label: "Archives — uncorruption mini-loop completed",
    condition:
      "At least one shadowTongueState.activeEdits entry has been cleared via clearActiveEdit. The retreat is partial — Shadow Tongue is not gone, only stepped back.",
    outputPath: "art/rooms/mystery-states/archives_uncorrupted.webp",
    resolution: RES_STILL,
    priority: "P1",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Same composition as archives:corrupted but the indigo hue has retreated. The data-orb glows warm-gold, " +
      "the scroll-rack underlayer reads cleanly, the lectern halo is gone. A single rolled scroll on the lectern " +
      "shows freshly-written warm-gold ink atop the dried indigo overlayer — visible victory. Atmosphere: relief, " +
      "but the cabinet stage-right still hums faintly. The Editor is not gone, only stepped back. No figures.",
  },
  {
    assetId: "archives:tier-fluent",
    roomId: "archives",
    stateId: "tier-fluent",
    kind: "image",
    model: "nano-banana-2",
    label: "Archives — Shadow Tongue trust ≥ 80 (fluent)",
    condition:
      "shadowTongueState.powerLevel ≥ 80 AND shadow tongue trust tier === 'fluent'. The unnameable hue is now legible to the camera and to the player.",
    outputPath: "art/rooms/mystery-states/archives_tier_fluent.webp",
    resolution: RES_STILL,
    priority: "P1",
    dependencies: DEPS_IMAGE_ST,
    prompt:
      "Same composition as archives:corrupted. The unnameable hue is now legible to the camera — every surface " +
      "that previously read as warm-gold now shows the indigo underlayer beneath, faintly. The data-orb pulses " +
      "both colours simultaneously in counter-rhythm. The cabinet stage-right is open; its door swings on a slow " +
      "hinge. Atmosphere: the Editor is not visible, but the room is no longer ambiguous about who has been " +
      "writing. The viewer is reading both languages at once now. Apply the Shadow Tongue corruption layer " +
      "across every text-bearing surface, not just the lectern — the corruption has fully bloomed.",
  },
];

/* ─── COMMS ARRAY — 2 stills ─── */

const COMMS_ARRAY_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "comms-array:static-haunted",
    roomId: "comms-array",
    stateId: "static-haunted",
    kind: "image",
    model: "nano-banana-2",
    label: "Comms Array — Shadow Tongue voice in the static",
    condition:
      "narrativeFlags.shadow_tongue_voice_heard === true. Set when the player examines the voice-in-the-static hotspot.",
    outputPath: "art/rooms/mystery-states/commsarray_static_haunted.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ST,
    prompt:
      "Comms Array operations bay, wide shot. Bank of CRT-style monitors filling the back wall — most show clean " +
      "signal-traces in phosphor-green, but the central monitor (frame-anchor) shows pure static dimmed to the " +
      "unnameable indigo hue. Within the static, a single column of vertical glyphs is faintly resolving — " +
      "recognisable as Elara's hand but mid-rewrite. Foreground: a curved console with brass dials and " +
      "oxblood-leather wrist-rests. The headset on the console hook is faintly humming a phosphor-lavender glow. " +
      "Atmosphere: the room sounds full of one voice trying to be heard inside another. Apply the Shadow Tongue " +
      "corruption layer on the central monitor only.",
  },
  {
    assetId: "comms-array:signal-clear",
    roomId: "comms-array",
    stateId: "signal-clear",
    kind: "image",
    model: "nano-banana-2",
    label: "Comms Array — bridge systems restored",
    condition:
      "narrativeFlags.bridge_systems_restored === true. The room is operational, calm, productive.",
    outputPath: "art/rooms/mystery-states/commsarray_signal_clear.webp",
    resolution: RES_STILL,
    priority: "P1",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Same composition as comms-array:static-haunted. All monitors now show clean signal-traces in warm-gold or " +
      "phosphor-green; the central monitor displays a rolling waveform that resolves into a stable peak. The " +
      "headset hum has gone steady gold. The room is operational, calm, productive. Atmosphere: this is what " +
      "comms is supposed to feel like. No figures.",
  },
];

/* ─── ENGINEERING — 2 supplementary stills (T0/T2/T3 covered by roomTierArtPrompts) ─── */

const ENGINEERING_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "engineering:edited-schematics",
    roomId: "engineering",
    stateId: "edited-schematics",
    kind: "image",
    model: "nano-banana-2",
    label: "Engineering — Shadow Tongue blueprint edits visible",
    condition:
      "narrativeFlags.shadow_tongue_engineering_edits_seen === true. Set when the player examines the schematic-pad hotspot.",
    outputPath: "art/rooms/mystery-states/engineering_edited_schematics.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ST,
    prompt:
      "Engineering bay wide shot, framed on the workbench. The reactor occupies the back-right at half height, " +
      "running but spitting a faint indigo plume from one valve. Centre frame: the workbench with a large unrolled " +
      "blueprint pinned at four corners; the blueprint's lines are split into two registers — the warm-gold " +
      "original and the indigo overlayer that has subtly redrawn three connection points. Tools scattered (brass " +
      "calipers, an oil-blued wrench, a notebook open to a half-finished page). Apply the Shadow Tongue corruption " +
      "layer on the blueprint and the reactor valve only. No figures.",
  },
  {
    assetId: "engineering:restored-from-edits",
    roomId: "engineering",
    stateId: "restored-from-edits",
    kind: "image",
    model: "nano-banana-2",
    label: "Engineering — uncorruption-completed for engineering.reactor",
    condition:
      "shadowTongueState.activeEdits entry `engineering.reactor` cleared via clearActiveEdit; player has rubbed the original schematic and combined it at the cipher-den uncorruption-bench.",
    outputPath: "art/rooms/mystery-states/engineering_restored_from_edits.webp",
    resolution: RES_STILL,
    priority: "P1",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Same composition as engineering:edited-schematics. The blueprint shows a single register only — the " +
      "warm-gold original, with a fresh hand-rubbing in graphite at one corner (proof of player labour). The " +
      "reactor's indigo plume is gone; the valve glows steady warm-gold. The notebook on the bench has a new page " +
      "filled with crisp diagnostic notes (rendered as ink-density only, no legible text). Atmosphere: someone " +
      "fixed something that was being silently broken. No figures.",
  },
];

/* ─── BRIDGE — 1 supplementary still (T0/T2/T3 covered by roomTierArtPrompts) ─── */

const BRIDGE_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "bridge:annotations-visible",
    roomId: "bridge",
    stateId: "annotations-visible",
    kind: "image",
    model: "nano-banana-2",
    label: "Bridge — Shadow Tongue annotations on tactical-display + timeline-projector",
    condition:
      "narrativeFlags.shadow_tongue_evidence === true AND room tier ≥ 2. Set when the player has examined the corresponding hotspots and the bridge has been activated.",
    outputPath: "art/rooms/mystery-states/bridge_annotations_visible.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ST,
    prompt:
      "Bridge command deck, wide architectural shot, viewed from the captain's-chair vantage looking forward. The " +
      "tactical-display dome at centre-back glows phosphor-lavender; superimposed on it, faint indigo annotations " +
      "float at three nodes — readable as marginalia in someone else's hand. The timeline-projector stage-left " +
      "shows entries in two layers, one warm-gold and one indigo. Crew avatars are absent (Tier 2 — activated, " +
      "not yet restored). Atmosphere: the room is busy thinking; some of the thoughts are not the Captain's. " +
      "Apply the Shadow Tongue corruption layer on the tactical-display dome and timeline-projector only.",
  },
];

/* ─── OBSERVATION DECK — 3 stills ─── */

const OBSERVATION_DECK_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "observation-deck:initial",
    roomId: "observation-deck",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "Observation Deck — initial (contemplative)",
    condition:
      "Default state on first entry: no observation-deck flags set. The cradle-pedestal is empty.",
    outputPath: "art/rooms/mystery-states/observation_deck_initial.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Observation Deck wide shot. Curved floor-to-ceiling viewport across the entire back wall, looking out " +
      "onto a starfield with the faint sweep of a distant nebula. Foreground centre: a brass telescope on a " +
      "free-standing pedestal. Floor: hexagonal tile pattern in oil-blued steel with phosphor-lavender grout-lines. " +
      "Stage-right: a low cradle-pedestal with empty mounting clips (the purification crystal hasn't been placed " +
      "yet). Atmosphere: contemplative, cold, awaiting. No figures.",
  },
  {
    assetId: "observation-deck:bond-resonance",
    roomId: "observation-deck",
    stateId: "bond-resonance",
    kind: "image",
    model: "nano-banana-2",
    label: "Observation Deck — first bond resonance",
    condition:
      "narrativeFlags.first_bond_resonance === true. Set when the player completes the bond-resonance tutorial.",
    outputPath: "art/rooms/mystery-states/observation_deck_bond_resonance.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Same composition as observation-deck:initial. The cradle-pedestal stage-right now holds a single faceted " +
      "crystal pulsing a slow warm-gold rhythm, casting concentric ripples across the hex floor. The starfield " +
      "through the viewport has a faint warm-gold afterimage at one star. Atmosphere: a quiet first triumph, two " +
      "beings in tune. No figures.",
  },
  {
    assetId: "observation-deck:purification-active",
    roomId: "observation-deck",
    stateId: "purification-active",
    kind: "image",
    model: "nano-banana-2",
    label: "Observation Deck — purification crystal fully active",
    condition:
      "narrativeFlags.purification_crystal_activated === true. Set when the player has activated the purification crystal beat.",
    outputPath: "art/rooms/mystery-states/observation_deck_purification_active.webp",
    resolution: RES_STILL,
    priority: "P1",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Same composition as observation-deck:initial. The crystal's pulse has accelerated and brightened; warm-gold " +
      "light fills the room, casting hard shadows. The hex floor's phosphor-lavender grout has shifted to " +
      "phosphor-gold. The viewport starfield is fully blanketed in soft golden afterimage. Atmosphere: cleansing " +
      "power, tangible and active. No figures.",
  },
];

/* ─── WAR ROOM — 2 stills ─── */

const WAR_ROOM_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "war-room:initial",
    roomId: "war-room",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "War Room — initial (command silence between briefings)",
    condition:
      "Default state on first entry: no war-room flags set.",
    outputPath: "art/rooms/mystery-states/war_room_initial.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "War Room wide shot. Centre: a circular brass-edged holo-table, currently dormant (matte glass top). Walls: " +
      "floor-to-ceiling racks of paper casualty-boards in oxblood-leather binders. Stage-left: a brass rack of " +
      "folded signal-flags. Stage-right: a side-table with a half-empty cut-glass decanter and one used tumbler. " +
      "Lighting: warm-gold key from above the holo-table, deep shadow at the room edges. Atmosphere: command " +
      "silence between briefings. No figures.",
  },
  {
    assetId: "war-room:active-conflict",
    roomId: "war-room",
    stateId: "active-conflict",
    kind: "image",
    model: "nano-banana-2",
    label: "War Room — Act 2 active (mid-decision)",
    condition:
      "narrativeFlags.act_2_active === true OR narrativeFlags.war_room_briefing_open === true.",
    outputPath: "art/rooms/mystery-states/war_room_active_conflict.webp",
    resolution: RES_STILL,
    priority: "P1",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Same composition as war-room:initial. The holo-table is alive — a phosphor-lavender three-dimensional " +
      "theatre map projects above it, with red and gold faction markers in motion. Two casualty-boards on the " +
      "back wall have been pulled and pinned open. The decanter is empty. Atmosphere: the room is mid-decision; " +
      "whoever was here has stepped out for thirty seconds. No figures.",
  },
];

/* ─── STATION DOCK — 2 stills ─── */

const STATION_DOCK_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "station-dock:initial",
    roomId: "station-dock",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "Station Dock — initial (industrial, expectant)",
    condition:
      "Default state on first entry: no station-dock flags set; airlock sealed.",
    outputPath: "art/rooms/mystery-states/station_dock_initial.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Station Dock wide shot. Massive cylindrical airlock at frame-centre, brass-rimmed with deep-oxblood seal " +
      "gaskets, currently sealed. Service alcoves to either side: stage-left a manifest console, stage-right a " +
      "cargo-lift platform at floor level. Floor: heavy plate steel with hazard-stripe oxblood paint at the " +
      "airlock perimeter. Atmosphere: industrial, expectant, the room before a journey. No figures.",
  },
  {
    assetId: "station-dock:ship-docked",
    roomId: "station-dock",
    stateId: "ship-docked",
    kind: "image",
    model: "nano-banana-2",
    label: "Station Dock — first ship docked (post-Act 1)",
    condition:
      "narrativeFlags.dock_first_ship === true. Set when the first ship docks at the Ark.",
    outputPath: "art/rooms/mystery-states/station_dock_ship_docked.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Same composition as station-dock:initial. The airlock is cycling open; warm-gold light spills from the " +
      "inner ship through the half-opened seal, projecting a long shadow forward across the deck plates. The " +
      "manifest console glows alive with rolling readouts. The cargo-lift has a single sealed crate on it, " +
      "oxblood seals intact. Atmosphere: arrival, threshold, story-resumes. No figures.",
  },
];

/* ─── ENGINEERING CORE — 1 still ─── */

const ENGINEERING_CORE_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "engineering-core:initial",
    roomId: "engineering-core",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "Engineering Core — initial (heat-distortion vault)",
    condition: "Default state on first entry: no engineering-core flags set.",
    outputPath: "art/rooms/mystery-states/engineering_core_initial.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Engineering Core wide shot. Centre-frame: the reactor coil — a vertical brass-and-steel cylindrical column " +
      "ribbed with phosphor-green coolant pipes. Floor: a circular grating with the column rising through it. " +
      "Stage-right: the core-terminal, a stand-up brass console with three large oxblood-leather-wrapped levers. " +
      "Atmosphere: heat distortion in the air above the coil, a deep slow pulse of phosphor-green at the column's " +
      "base, low warm-gold service lighting. No figures.",
  },
];

/* ─── ORACLE SANCTUM — 2 stills ─── */

const ORACLE_SANCTUM_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "oracle-sanctum:initial",
    roomId: "oracle-sanctum",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "Oracle Sanctum — initial (hush, ritual readiness)",
    condition: "Default state on first entry: no oracle-sanctum flags set.",
    outputPath: "art/rooms/mystery-states/oracle_sanctum_initial.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Oracle Sanctum wide shot. Centre-frame: a circular still-water oracle pool sunk into the floor, surrounded " +
      "by a low brass rim engraved with sigils. Back wall: a brass-pedestal'd prophecy-tablet at standing height. " +
      "Stage-right: a hanging incense-brazier on a chain, smoke drifting in slow phosphor-lavender. Lighting: low " +
      "warm-gold from sconces, the pool itself faintly luminous from below. Atmosphere: hush, ritual readiness, " +
      "very few hard edges. No figures.",
  },
  {
    assetId: "oracle-sanctum:prophecy-active",
    roomId: "oracle-sanctum",
    stateId: "prophecy-active",
    kind: "image",
    model: "nano-banana-2",
    label: "Oracle Sanctum — prophecy active",
    condition:
      "narrativeFlags.oracle_consulted === true. Set when the player consults the oracle pool.",
    outputPath: "art/rooms/mystery-states/oracle_sanctum_prophecy_active.webp",
    resolution: RES_STILL,
    priority: "P1",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Same composition as oracle-sanctum:initial. The oracle pool's surface is broken into slow concentric rings, " +
      "glowing warm-gold from below. Above the pool, a faint phosphor-lavender glyph hovers half-formed in the " +
      "air. The prophecy-tablet on the back wall has begun to display warm-gold script (rendered as abstract " +
      "glyphs only, no legible text). The incense smoke now coils more deliberately. Atmosphere: something is " +
      "speaking; the room is listening. No figures.",
  },
];

/* ─── SHADOW VAULT — 3 stills (encounter scene) ─── */

const SHADOW_VAULT_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "shadow-vault:cell-sealed",
    roomId: "shadow-vault",
    stateId: "cell-sealed",
    kind: "image",
    model: "nano-banana-2",
    label: "Shadow Vault — cell sealed (default)",
    condition:
      "Default state on first entry: no shadow-vault flags set, lever in neutral position.",
    outputPath: "art/rooms/mystery-states/shadow_vault_cell_sealed.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ST,
    prompt:
      "Shadow Vault wide shot. Centre-frame: a sealed-cell glass containment, a tall reinforced-glass cylinder " +
      "full of the unnameable indigo hue (so dense the eye cannot resolve depth). Floor surrounding the cell: " +
      "oil-blued steel inscribed with brass-inlaid containment sigils. Stage-left: a manuscript-pile on a low " +
      "pedestal — leather folios stacked carelessly. Stage-right: the warden-terminal, a brass console with a " +
      "single phosphor-lavender readout. Foreground centre: a long brass lever in a neutral position. Lighting: " +
      "extremely cold, all rim-light, no key — the cell itself provides the only colour in the room. No figures. " +
      "Apply the Shadow Tongue corruption layer concentrated entirely inside the cell glass — the surrounding " +
      "room is uncorrupted but cold.",
  },
  {
    assetId: "shadow-vault:cell-released",
    roomId: "shadow-vault",
    stateId: "cell-released",
    kind: "image",
    model: "nano-banana-2",
    label: "Shadow Vault — Grand Edit active (lever thrown)",
    condition:
      "shadowTongueState.grandEditActive === 1. Player has thrown the release-or-seal-lever to release.",
    outputPath: "art/rooms/mystery-states/shadow_vault_cell_released.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ST,
    prompt:
      "Same composition as shadow-vault:cell-sealed. The cell-glass has cracked at the base; the unnameable " +
      "indigo has begun to seep along the floor sigils, lighting them in an out-of-register glow. The " +
      "manuscript-pile is unbound — folios float in mid-air around the room. The warden-terminal is dark. The " +
      "lever is fully thrown. Atmosphere: the room has just made a decision and the decision was the wrong one. " +
      "Apply the Shadow Tongue corruption layer across the entire room.",
  },
  {
    assetId: "shadow-vault:cell-resealed",
    roomId: "shadow-vault",
    stateId: "cell-resealed",
    kind: "image",
    model: "nano-banana-2",
    label: "Shadow Vault — sealed after release walked back",
    condition:
      "shadowTongueState.grandEditActive === 0 AND narrativeFlags.shadow_vault_released_then_sealed === true. The player walked back the release.",
    outputPath: "art/rooms/mystery-states/shadow_vault_cell_resealed.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Same composition as shadow-vault:cell-sealed. The cell-glass is restored but visibly scarred — a hairline " +
      "brass weld traces around its base. The indigo within is dimmer, retreated. The manuscript-pile is bound " +
      "and stacked. The warden-terminal glows steady warm-gold. The lever is in the neutral position with a " +
      "small brass lock-plate fitted. Atmosphere: the room remembers what almost happened. No figures.",
  },
];

/* ─── CIPHER DEN — 1 still (uncorruption hub) ─── */

const CIPHER_DEN_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "cipher-den:initial",
    roomId: "cipher-den",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "Cipher Den — initial (scholarly, suspicious, lived-in)",
    condition: "Default state on first entry: no cipher-den flags set.",
    outputPath: "art/rooms/mystery-states/cipher_den_initial.webp",
    resolution: RES_STILL,
    priority: "P0",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "Cipher Den wide shot. Centre-frame: a long oak-and-brass desk angled to camera, holding the rosetta-pad " +
      "(a thick brass-bound codex on a reading-stand) and a stack of encrypted-correspondence folios. Back wall: " +
      "an entire wall of cubbyholes filled with rolled letters tagged in oxblood ribbons. Stage-left: the " +
      "dictionary-of-edits — a freestanding lectern with a perpetually-open book whose pages turn themselves " +
      "slowly. Stage-right: the uncorruption-bench — a worktop with a brass-rimmed magnifier on a swing-arm and " +
      "small bottles of ink. Lighting: warm-gold from a single hooded desk-lamp, the rest of the room in shadow. " +
      "Atmosphere: scholarly, suspicious, lived-in. No figures.",
  },
];

/* ─── SPECIES-EXCLUSIVE BONUS ROOMS — 6 stills (P2) ───
   NOTE: These rooms are gated by canAccessRoom() in
   apps/shared/characterCreationImpact.ts — only ⅓ of players
   see each. They contain NO critical-path content; they are
   atmospheric bonuses tied to species choice. */

const SPECIES_EXCLUSIVE_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "the_elemental_forge:initial",
    roomId: "the_elemental_forge",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "The Elemental Forge — initial (DeMagi only)",
    condition:
      "DeMagi-only room. Visible only when canAccessRoom('the_elemental_forge', sig) is true.",
    outputPath: "art/rooms/species/the_elemental_forge_initial.webp",
    resolution: RES_STILL,
    priority: "P2",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "A circular forge chamber carved into volcanic basalt. Centre-frame: a brass-bound crucible-of-origins " +
      "suspended over a slow-pulsing magma vent, ringed by eight inscribed brass tiles (one per element). " +
      "Stage-left: an ancestral anvil, three meters tall, its face polished mirror-bright by centuries of strikes. " +
      "Stage-right: a rack of unfinished elemental weapons, half-shaped. Lighting: warm magma-gold from below, " +
      "cold steel rim-light from above. Atmosphere: ancestral memory at working temperature. No figures.",
  },
  {
    assetId: "blood_archive:initial",
    roomId: "blood_archive",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "Blood Archive — initial (DeMagi only)",
    condition:
      "DeMagi-only room. Visible only when canAccessRoom('blood_archive', sig) is true.",
    outputPath: "art/rooms/species/blood_archive_initial.webp",
    resolution: RES_STILL,
    priority: "P2",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "A vault chamber lined floor-to-ceiling with brass-bound lineage codices, each chained to its shelf. " +
      "Centre-frame: a freestanding shrine — a low oxblood-leather altar holding a single covered relic under " +
      "glass. Floor: red-veined marble inlaid with brass family-tree branches. Lighting: cold rim-light, single " +
      "warm-gold key on the relic only. Atmosphere: hush of ancestral debt. No figures.",
  },
  {
    assetId: "probability_chamber:initial",
    roomId: "probability_chamber",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "Probability Chamber — initial (Quarchon only)",
    condition:
      "Quarchon-only room. Visible only when canAccessRoom('probability_chamber', sig) is true.",
    outputPath: "art/rooms/species/probability_chamber_initial.webp",
    resolution: RES_STILL,
    priority: "P2",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "A spherical observation chamber with curved phosphor-lavender walls. Centre-frame: a wavefunction-rig — a " +
      "brass armature suspending a translucent quartz orb that pulses through superposed images of itself. " +
      "Stage-right: a low brass tray holding twelve hand-carved dice-of-states, each inscribed with an unknown " +
      "sigil. Floor: oil-blued steel etched with an interference pattern. Lighting: phosphor-lavender ambient, no " +
      "key. Atmosphere: every state is true and waiting to collapse. No figures.",
  },
  {
    assetId: "dimensional_observatory:initial",
    roomId: "dimensional_observatory",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "Dimensional Observatory — initial (Quarchon only)",
    condition:
      "Quarchon-only room. Visible only when canAccessRoom('dimensional_observatory', sig) is true.",
    outputPath: "art/rooms/species/dimensional_observatory_initial.webp",
    resolution: RES_STILL,
    priority: "P2",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "An octagonal observatory with a vaulted ceiling. Centre-frame: a rift-lens — a brass-and-glass aperture " +
      "pointing upward, currently showing a fractal slice of an unfamiliar starfield. Back wall: a dimension-loom, " +
      "a vertical brass frame strung with phosphor-lavender threads weaving themselves into a slow-shifting " +
      "tapestry (rendered as abstract glyph patterns, no legible text). Lighting: cold phosphor-lavender from the " +
      "aperture, deep oxblood accents on the floor. Atmosphere: a window onto somewhere the camera was not " +
      "invited. No figures.",
  },
  {
    assetId: "hybrid_sanctum:initial",
    roomId: "hybrid_sanctum",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "Hybrid Sanctum — initial (Ne-Yon only)",
    condition:
      "Ne-Yon-only room. Visible only when canAccessRoom('hybrid_sanctum', sig) is true.",
    outputPath: "art/rooms/species/hybrid_sanctum_initial.webp",
    resolution: RES_STILL,
    priority: "P2",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "A long narrow chapel-room with an axial mirror down the centre dividing it into two halves. Centre-frame: " +
      "a dual-altar — one half forged in DeMagi brass-and-magma motifs, the other in Quarchon " +
      "phosphor-lavender-and-glass. The dividing mirror is severed at chest height, hairline crack widening to a " +
      "notch where the two altar halves meet. Lighting: warm-gold on the brass half, phosphor-lavender on the " +
      "glass half, neutral cold rim where they meet. Atmosphere: reconciled tension, neither side dominant. " +
      "No figures.",
  },
  {
    assetId: "the_between:initial",
    roomId: "the_between",
    stateId: "initial",
    kind: "image",
    model: "nano-banana-2",
    label: "The Between — initial (Ne-Yon only)",
    condition:
      "Ne-Yon-only room. Visible only when canAccessRoom('the_between', sig) is true.",
    outputPath: "art/rooms/species/the_between_initial.webp",
    resolution: RES_STILL,
    priority: "P2",
    dependencies: DEPS_IMAGE_ANCHOR,
    prompt:
      "A liminal chamber with no clear walls — the floor dissolves into mist about three meters out from the " +
      "centre. Centre-frame: a single brass threshold-stone, knee-high, set in a circular pool of still water " +
      "that reflects a ceiling that isn't there. Lighting: ambient warm-gold from no visible source, " +
      "phosphor-green mist below the floor-line. Atmosphere: a doorway that goes nowhere and everywhere; this " +
      "is the room between rooms. No figures.",
  },
];

/* ─── VIDEO PROMPTS — Veo 3.1 (8 entries) ───
   Ambient loops use .webm with seamless cut points; one-shot
   cinematics use .mp4. All entries are no-audio (engine drives
   audio separately). The runtime treats videos as overlays —
   the corresponding still always renders as a fallback. */

const VIDEO_PROMPTS: readonly RoomMediaPrompt[] = [
  {
    assetId: "shadow-tongue:text-corruption-loop",
    roomId: "archives",
    stateId: "text-corruption-loop",
    kind: "video",
    model: "veo-3.1",
    label: "Shadow Tongue — text corruption ambient loop (cross-room)",
    condition:
      "shadowTongueState.activeEdits.length > 0. Used as ambient overlay anywhere there is at least one active edit.",
    outputPath: "art/rooms/videos/shadow_tongue_text_corruption_loop.webm",
    resolution: RES_VIDEO_LOOP_8S,
    priority: "P0",
    dependencies: DEPS_VIDEO_ST,
    prompt:
      "8-second seamless loop. Locked camera. Tight framing on a single Archives data-bank panel that fills 60% " +
      "of frame, the surrounding room blurred to phosphor-lavender bokeh. Frame 0: the panel's glyphs resolve " +
      "cleanly in warm-gold (Elara's hand). From frame 24 to frame 96, individual characters glitch one at a " +
      "time toward the unnameable indigo hue and silently rewrite themselves into a slightly different glyph — " +
      "never enough to be obviously different, always enough to read as wrong. From frame 96 to frame 192, the " +
      "rewrite reverses, returning each character to its warm-gold original. Subtle ~1px RGB channel-shift on " +
      "each rewrite event, no full glitch artifacts. Loop point invisible: frame 192 must equal frame 0. No " +
      "rendered text legible to the player, no UI, no figures.",
  },
  {
    assetId: "archives:glyph-rewriting-loop",
    roomId: "archives",
    stateId: "glyph-rewriting-loop",
    kind: "video",
    model: "veo-3.1",
    label: "Archives — ambient glyph-rewriting loop",
    condition:
      "Player is in archives AND narrativeFlags.shadow_tongue_corruption_seen === true.",
    outputPath: "art/rooms/videos/archives_glyph_rewriting_loop.webm",
    resolution: RES_VIDEO_LOOP_10S,
    priority: "P0",
    dependencies: DEPS_VIDEO_ST,
    prompt:
      "10-second seamless loop. Locked camera, slight 2% slow-zoom-in across the loop then snap-cut back to start " +
      "(cut hidden by a one-frame indigo flash). Wide-shot framing of the Archives reading hall from the entry-arch " +
      "vantage. Across the loop, glyph-bands on the curved back-wall data-banks slowly migrate left-to-right by " +
      "~6 pixels and rewrite themselves character-by-character; the warm-gold underlayer remains constant; the " +
      "indigo overlayer drifts. Scrolls in the rack glass on left and right walls show the same effect at " +
      "quarter-speed. The data-orb at room-centre pulses once per second, alternating warm-gold and " +
      "unnameable-indigo. No figures, no audio, no rendered legible text.",
  },
  {
    assetId: "bridge:fast-travel-unlocked",
    roomId: "bridge",
    stateId: "fast-travel-unlocked",
    kind: "video",
    model: "veo-3.1",
    label: "Bridge — fast travel unlocked (one-shot cinematic)",
    condition:
      "narrativeFlags.fast_travel_unlocked transitions false → true. Plays once, then the still cinematic frame holds.",
    outputPath: "art/rooms/videos/bridge_fast_travel_unlocked.mp4",
    resolution: RES_VIDEO_ONESHOT_6S,
    priority: "P0",
    dependencies: DEPS_VIDEO_ANCHOR,
    prompt:
      "6-second one-shot cinematic. Camera starts on a slight handheld float above the captain's chair vantage, " +
      "then dollies forward toward the tactical-display dome over 4 seconds. Frame 0–48: the dome is dark, sigils " +
      "on its rim faintly etched. Frame 48–96: warm-gold phosphor begins to fill the rim sigils one at a time in " +
      "a clockwise sweep, accompanied by a single bright-key lighting flash on frame 72 (visible as a soft " +
      "dust-in-beam burst). Frame 96–144: the dome interior blooms into a holographic ley-line web — a 3D map of " +
      "the Ark with phosphor-lavender lines connecting room-nodes, each node lighting in warm-gold one after " +
      "another. End frame holds for 12 frames on the fully-lit web. No figures, no audio, no rendered text — " +
      "just the geometry of the map itself.",
  },
  {
    assetId: "comms-array:signal-discovery",
    roomId: "comms-array",
    stateId: "signal-discovery",
    kind: "video",
    model: "veo-3.1",
    label: "Comms Array — Shadow Tongue voice discovery (one-shot)",
    condition:
      "narrativeFlags.shadow_tongue_voice_heard transitions false → true. Plays once.",
    outputPath: "art/rooms/videos/comms_array_signal_discovery.mp4",
    resolution: RES_VIDEO_ONESHOT_5S,
    priority: "P0",
    dependencies: DEPS_VIDEO_ST,
    prompt:
      "5-second one-shot. Locked camera framed centred on the comms-array's central CRT monitor at 70% of frame. " +
      "Frame 0–60: pure phosphor-green static. Frame 60–96: the static dims to the unnameable indigo hue and " +
      "begins to organise — vertical bands resolve into the silhouette of a face composed entirely of glyphs " +
      "(recognisable as a face only by negative space), holding for exactly 12 frames at frame 96. Frame 108–120: " +
      "the face dissolves back into static, but the static now has a faint warm-gold underlayer barely visible " +
      "through the indigo. End frame holds. RGB channel-shift peaks at frame 96 (~3px) then settles to 1px. No " +
      "audio, no rendered text, no other figures.",
  },
  {
    assetId: "cryo-bay:awakening",
    roomId: "cryo-bay",
    stateId: "awakening",
    kind: "video",
    model: "veo-3.1",
    label: "Cryo Bay — awakening cinematic (game-start)",
    condition:
      "Plays on game-start before any flag is set. Replaces existing AWK-001 if present.",
    outputPath: "art/rooms/videos/cryo_bay_awakening.mp4",
    resolution: RES_VIDEO_ONESHOT_12S,
    priority: "P1",
    dependencies: DEPS_VIDEO_ANCHOR,
    prompt:
      "12-second one-shot cinematic. Camera begins inside a closed cryo-pod looking outward through frosted glass " +
      "— the room beyond is barely visible, all colour washed pale. Frame 0–48: the frost on the glass begins to " +
      "retreat from the centre outward, revealing more of the cryo-bay environment in cold blue-green tones. " +
      "Frame 48–96: a phosphor-lavender stasis-readout HUD on the pod's interior glass briefly illuminates " +
      "(rendered as abstract bars only, no legible text), then dims. Frame 96–192: the pod's seal cracks audibly " +
      "(audio engine-driven, do not generate); a slow vertical pull pushes the glass aside; warm-gold service-lamp " +
      "light spills in from the room beyond, slowly washing the cold colour away. Frame 192–288: camera holds on " +
      "the open pod-frame; the room beyond is now visible in full warm-gold/oxblood/phosphor-lavender palette; a " +
      "single character row of cryo-pods recedes into shallow depth-of-field. End frame holds 12 frames. No figures.",
  },
  {
    assetId: "shadow-vault:meeting",
    roomId: "shadow-vault",
    stateId: "meeting",
    kind: "video",
    model: "veo-3.1",
    label: "Shadow Vault — first encounter cinematic",
    condition:
      "Player enters shadow-vault for the first time AND narrativeFlags.shadow_tongue_face_to_face is being set.",
    outputPath: "art/rooms/videos/shadow_vault_meeting.mp4",
    resolution: RES_VIDEO_ONESHOT_8S,
    priority: "P0",
    dependencies: DEPS_VIDEO_ST,
    prompt:
      "8-second one-shot cinematic. Camera begins at the room's threshold; over 5 seconds, dollies slowly forward " +
      "toward the sealed-cell glass cylinder, ending at half a meter from the glass. Frame 0–48: the cell appears " +
      "as featureless dense indigo. Frame 48–96: as the camera nears, faint glyph-shapes begin to coalesce inside " +
      "the indigo — like text seen through deep water. Frame 96–144: a single silhouette resolves — humanoid in " +
      "proportion only, edges defined by the absence of indigo rather than presence of form. Frame 144–168: the " +
      "silhouette tilts its head slightly, registering the camera; one indigo-on-indigo glyph in the cell visibly " +
      "rewrites itself in a single frame, sending a ripple through the entire cell. End frame holds 24 frames. " +
      "The room around the cell remains uncorrupted, very cold, very still. No audio, no figures outside the cell.",
  },
  {
    assetId: "observation-deck:bond-resonance-pulse",
    roomId: "observation-deck",
    stateId: "bond-resonance-pulse",
    kind: "video",
    model: "veo-3.1",
    label: "Observation Deck — bond resonance ambient pulse loop",
    condition:
      "Player is in observation-deck AND narrativeFlags.first_bond_resonance === true.",
    outputPath: "art/rooms/videos/observation_deck_bond_resonance_pulse.webm",
    resolution: RES_VIDEO_LOOP_10S,
    priority: "P1",
    dependencies: DEPS_VIDEO_ANCHOR,
    prompt:
      "10-second seamless loop. Locked camera framed on the observation-deck purification-crystal in its " +
      "cradle-pedestal at 40% of frame, with the panoramic starfield viewport visible behind. Frame 0: the crystal " +
      "pulses with a slow warm-gold heartbeat. Across the loop, every 2 seconds the crystal emits a soft warm-gold " +
      "ripple that propagates outward across the hex floor, fading by frame 96; on the second pulse the starfield " +
      "in the viewport ripples once in a faint warm-gold afterimage; on the third pulse a single distant star " +
      "momentarily brightens. Frame 240 returns to identical state of frame 0. No figures, no audio, no rendered " +
      "text.",
  },
  {
    assetId: "engineering:schematic-edit-reveal",
    roomId: "engineering",
    stateId: "schematic-edit-reveal",
    kind: "video",
    model: "veo-3.1",
    label: "Engineering — Shadow Tongue schematic edit reveal (one-shot)",
    condition:
      "First `look` of the schematic-pad hotspot in engineering. narrativeFlags.shadow_tongue_engineering_edits_seen transitions false → true.",
    outputPath: "art/rooms/videos/engineering_schematic_edit_reveal.mp4",
    resolution: RES_VIDEO_ONESHOT_6S,
    priority: "P0",
    dependencies: DEPS_VIDEO_ST,
    prompt:
      "6-second one-shot cinematic. Camera framed top-down on the engineering workbench, looking straight down " +
      "at the unrolled blueprint. Frame 0–48: the blueprint shows clean warm-gold lines defining a " +
      "reactor-coolant schematic. Frame 48–96: a shadow-shaped indigo brush passes across three connection points " +
      "on the diagram (the brush is implied by motion, no figure visible — only the blueprint's lines being " +
      "touched); each touched line erases and rewrites itself in indigo overlay, slightly redirecting the " +
      "connection. Frame 96–144: camera pulls back to reveal the wider workbench — the rest of the room is " +
      "unchanged, the blueprint now shows two registers (warm-gold underlayer + indigo overlayer). End frame " +
      "holds 24 frames. RGB channel-shift on the blueprint only, ~1px. No figures, no audio, no rendered legible " +
      "text.",
  },
];

/* ─── EXPORT — full catalog ─── */

export const ROOM_MEDIA_PROMPTS: readonly RoomMediaPrompt[] = [
  ...ARCHIVES_PROMPTS,
  ...COMMS_ARRAY_PROMPTS,
  ...ENGINEERING_PROMPTS,
  ...BRIDGE_PROMPTS,
  ...OBSERVATION_DECK_PROMPTS,
  ...WAR_ROOM_PROMPTS,
  ...STATION_DOCK_PROMPTS,
  ...ENGINEERING_CORE_PROMPTS,
  ...ORACLE_SANCTUM_PROMPTS,
  ...SHADOW_VAULT_PROMPTS,
  ...CIPHER_DEN_PROMPTS,
  ...SPECIES_EXCLUSIVE_PROMPTS,
  ...VIDEO_PROMPTS,
];

/** Convenience: stills only (kind === "image"). */
export const ROOM_MEDIA_STILLS: readonly RoomMediaPrompt[] =
  ROOM_MEDIA_PROMPTS.filter((p) => p.kind === "image");

/** Convenience: videos only (kind === "video"). */
export const ROOM_MEDIA_VIDEOS: readonly RoomMediaPrompt[] =
  ROOM_MEDIA_PROMPTS.filter((p) => p.kind === "video");
