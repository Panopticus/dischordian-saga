> ⚠️ **SUPERSEDED 2026-05-02** — see `docs/production/OPEN_ASSETS_2026-05-02.md`
> Kept as historical reference. Do not edit.


# Missing Prelude + Act 1 Assets — Veo 3.1 Prompt Pack

Single consolidated audit of every cutscene, room, VFX, VO, and art asset
across the **Prelude** (15 beats) and **Act 1** (3 cycles + finale) of
Dischordian Saga. Every video row is framed as a **Veo 3.1** image-to-video
render (start frame → end frame → motion prompt). Every still uses the
same Nano Banana 2 shape. Every audio row cites its target loudness and
output path.

This doc is the **single artifact an operator should need**. The
underlying prompt files in `docs/production/prelude-asset-build/` and
`docs/production/act1-asset-build/` remain in place and canonical, but
this file consolidates what is **actually missing** after triple-checking
against `assets/intermediate/`, both CDNs, `apps/client/public/`, and
the React component tree.

---

## 0. How to use this doc

1. **Process INTERMEDIATE assets first.** Many "missing" rows in earlier
   audits are actually already rendered and sitting in
   `assets/intermediate/prelude/{rooms,cutscenes,vfx,audio}/`. These need
   only format conversion (PNG→WebP, WAV→MP3 + loudnorm, MP4→WebM) and
   placement at the canonical `apps/client/public/...` path before
   upload via `apps/scripts/upload-public-to-s3.ts`. Zero new generations
   required. See **§11 Processing Pipeline**.
2. **Then render MISSING assets** using the Veo/Nano/ElevenLabs prompts
   below, working beat-by-beat top-to-bottom. Each entry is
   self-contained: start-frame prompt, end-frame prompt, motion prompt,
   config block, output path, audio sync notes.
3. **Stop after Part 1** if you only need the Prelude (playtest-unblock
   tier). Part 2 is Act 1 and depends on Prelude rooms being wired.

### 0.1 Tools in play

| Asset type | Tool | Recipe doc |
|---|---|---|
| Still image (rooms, portraits, card art, VFX frames) | **Nano Banana 2** | `docs/production/commission-packages/examples/nano-banana-2_turnaround.md` |
| Motion clip (cutscene, VFX webm) | **Veo 3.1** (image-to-video, start+end keyframe) | `docs/production/commission-packages/examples/veo-3.1_one-shot-cinematic.md` |
| Voice line | **ElevenLabs** | per-character voice profile in `apps/shared/*VoManifest.json` |
| Ambient bed / music | source WAV → `ffmpeg` MP3 + EBU R128 loudnorm | per-bed LUFS target listed inline |

### 0.2 Asset status legend

| Tag | Meaning | Operator action |
|---|---|---|
| `DONE-LOCAL` | Final file at canonical `apps/client/public/...` path | None |
| `DONE-CDN-LEGACY` | Polished asset on `d2xsxph8kpxj0f.cloudfront.net`, wired in `InlineShipMap.tsx`/`ShipSchematicMap.tsx` but **missing from canonical local path** | Re-download from CDN and place at canonical path, OR regenerate, to satisfy `preludeReadiness.test.ts` and page-level `assetUrl()` loads |
| `DONE-CDN-PRIMARY` | Final asset on `dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/...` (what `assetUrl()` resolves to) | None |
| `DONE-CODE` | React / CSS / Three.js component; no media file required | None |
| `DONE-S3-VO` | Voice line recorded and published to `dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/...` (manifest wired) | None |
| `INTERMEDIATE` | Source / draft exists in `assets/intermediate/` — needs processing | Run pipeline per §11, then upload |
| `MISSING` | No asset anywhere | Render per prompt below |

### 0.3 Global style anchors

- **Prelude palette**: deep space black `#010020` base, cyan `#22d3ee`
  dominant, amber `#fbbf24` rare warm accent (Mess Hall service light,
  Medical Bay transfer-array standby, Briefing Room chair rim-light only),
  foxfire green `#00e676` for Engineering standby, purple-gold for the
  Observation Deck nebula/rift.
- **Act 1 Cycle A — Celebration/Kindergarten**: warm honey `#d9a66a`
  dominant, dusty rose `#c98b8b`, actual sun through windows.
- **Act 1 Cycle B — Mechronis Academy**: cool teal `#4ba3b5` dominant,
  brass `#b8752d`, ONE reflected sun-shaft.
- **Act 1 Cycle C — Nexon/Zenon/Authority**: dust-brown `#6b5a48` /
  institutional grey `#55606e` / black marble `#1c1a1a` dominant, ember
  `#e06a1a` accent, distant fires only.
- **Global negative prompt (all stills)**: `rendered text, subtitle,
  watermark, logo, stock photo, cartoon, anime, low quality, blurry,
  flat lighting, UI chrome, HUD, menu, cel shading, painting,
  illustration, double exposure, warped anatomy, extra fingers`.
- **Image base resolution**: 1920×1080 for 16:9 rooms + cutscene
  keyframes; 1536×2048 for 3:4 matchup portraits; 1024×1024 for card art.
- **Video**: 24fps, 16:9, image-to-video with START + END keyframe.

### 0.4 Canon hygiene — NEVER violate

- **Engineer face**: never rendered. Always from behind, obscured, or
  cropped above the shoulders. Applies to every beat and every cutscene.
- **Vex Solene**: does not appear in Act 1. The Warlord's visor hides
  her face; only iridescent shimmer at the visor lip is permitted.
- **The Authority**: no face, no scale cue, no insignia, no reflective
  surface. Silhouette against darker stone only.
- **Oracle**: referenced, never shown.
- **Game Master (pre-split)**: in `matchup-game-master-original` only,
  render a **single pair** of wire-rimmed spectacles (two lenses in one
  frame). NOT the Acts-2+ Left/Right twin-eyepiece configuration.
- **Forbidden phrases anywhere in rendered text or handwriting**:
  "1260 days", "Silence in Heaven", "Heart of Time",
  "Privacy / Prophecy / Insurgency / Revelation Ages", "Daniel Cross",
  "Malkia Ukweli".

### 0.5 Veo 3.1 config template (every cutscene uses this)

```
Mode:       Image-to-video with start + end keyframe
Duration:   per entry
Aspect:     16:9
Frame rate: 24fps
Seed:       lock if Veo allows; same seed across iterations
Start kf:   upload START FRAME PNG from _intermediate/
End kf:     upload END FRAME PNG from _intermediate/
Motion:     paste the VEO 3.1 motion prompt verbatim
Audio:      render silent; runtime composites VO + ambient + music
```

### 0.6 Rendered-text exceptions (whitelist)

The Prelude's "no rendered text" rule has **two** canonical exceptions
that MUST be legible in-frame:

1. **Beat F — Kael Contingency Memo** (§11.6 / `vfx_memo_holo_rise`):
   three calligraphic-cyan bullets must be readable by the player.
   Exact text in §1.F below.
2. **Cycle A finale — "CELEBRATION"** (§6.1 / `welcome-to-celebration`):
   the single word CELEBRATION inscribed on the ceremonial arch.

Act 1 has **one additional whitelisted word**: "CELEBRATION" on the
arch in the Cycle A finale end-frame. Everything else in Act 1 follows
the no-rendered-text rule.

---

# PART 1 — PRELUDE (15 beats, ~16 minutes of cutscene)

Prelude total runtime = 465s of short beats + ~490s of Beat J long-form
≈ 16 minutes. 10 VO lines already recorded and live in S3.

## §1.A  Beat A — Cryo Wake (35s)

### §1.A.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-a-awakening.mp4`
**Duration:** 35s @ 24fps, 16:9
**Status:** MISSING
**Bible:** `PRELUDE_SHIP_READY_BIBLE.md` §3
**Source prompts:** `docs/production/prelude-asset-build/prompts/cutscenes/prelude-beat-a-awakening_{start_frame,end_frame,motion}.txt`

**Dependencies (render these PNGs first via Nano Banana 2):**
- Start frame: `assets/intermediate/prelude/cutscenes/prelude-beat-a-awakening_start.png`
- End frame: `assets/intermediate/prelude/cutscenes/prelude-beat-a-awakening_end.png`

**START FRAME prompt (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Extreme close-up from inside the cryo pod looking outward through the canopy glass. The glass is half-frosted; six-pointed frost crystals are still forming at the edges of frame in slow motion. The player's POV — we cannot see their face. Beyond the glass, blurred and dim, the curved gallery of Pod Chamber 47 (Ark 1047 cryo-bay) is just becoming visible: shapes of other pods softly glowing cyan `#22d3ee` in the background. Volumetric cryogas inside the pod is still settling. The pod's internal indicator lights (a vertical column of small cyan LEDs to the right of the canopy) are sequencing from dim to bright — three are lit, three are still dark. Shallow depth of field, focused on the inside of the canopy glass. Palette: deep space black `#010020`, cyan `#22d3ee`, white frost. Anamorphic flare on the brightest LED. Faint film grain. No text. No visible character. Cinematic 4K.

**END FRAME prompt (Nano Banana 2):**
> Same Pod Chamber 47, thirty-five seconds later. Wide establishing shot now from outside the open pod, camera at standing eye level looking down the gallery toward the far corridor archway. The pod is fully open, cryogas has dissipated to ankle-height drift. Center of frame, three meters from the open pod, **Elara's holographic avatar** stands materialized: a translucent female figure in flowing senatorial robes rendered in cyan `#22d3ee` scanlines, hands clasped in front of her, expression warm and uncertain. She is two meters tall, slightly taller than the player would be. The hologram emits soft cyan rim light onto the floor and the railings around her. Behind her, the eleven sealed pods continue their slow cyan breath-pulse. The first emergency floor strip nearest camera is hot at its leading edge — the breath-rhythm pulse is at peak. Volumetric fog at ankle height. Anamorphic lens flare from Elara's hologram. Film grain. Deep space black `#010020` base. No rendered text. Cinematic 4K composition. The framing must clearly show **five other pods on the near row, still sealed, still glowing** — they are the visual punchline of the cutscene and the script line in §3.5 must land on them.

**VEO 3.1 motion prompt (image-to-video, start + end keyframe):**
> Begin extreme close-up inside pod canopy as frost crystals retract and final LEDs sequence to bright. Beat at 4s: pod hatch hisses open with volumetric cryogas burst, camera pushes through the opening pod glass and out into the chamber. Beat at 12s: slow continuous pull-back along the gallery, revealing eleven sealed pods on either side, each gently breath-pulsing cyan. Beat at 22s: Elara hologram materializes center-frame in scanline wipe, soft bloom builds. Final 8s: hold on Elara, slow lateral camera drift right to lock the framing. 24fps. Reverent, fragile, just-born tone.

**Veo 3.1 config:** Mode image-to-video start+end keyframe · Duration 35s · 16:9 · 24fps · camera: push-through + pull-back + lateral drift per motion.

**Audio hand-off:**
- VO `elara_beat_a_five_pods` @ ~24s — DONE-S3-VO →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/elara/elara_beat_a_five_pods.mp3`
- Ambient bed: `ambient_neural_rig_hum` NOT used here (Medical Bay
  bed); Beat A uses only reactive cryo-gas hiss + Elara hologram hum.
  See §1.G Audio for the neural-rig bed.
- Music cue: reverent low-strings bed, enters at ~22s on Elara
  materialization. Suno or composer — not yet sourced.

**Canon hygiene:** player's face never rendered (first-person POV
start; over-shoulder/behind for end frame if any body is shown).

### §1.A.2 Room art — Cryo Bay

**Output (local):** `apps/client/public/art/rooms/room-cryo-bay.png` + `room-cryo-bay.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-cryo-bay_original.png`
**Also on legacy CDN** (`DONE-CDN-LEGACY`):
`https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/cryo-bay_2da49870.png`
— wired in `apps/client/src/components/InlineShipMap.tsx:50`.
**Also on legacy CDN (murder-mystery state-aware variants, 4 frames)** —
see `docs/production/ASSET_URLS.md` "Cryo Bay / Medical Bay" section:
`/art/rooms/mystery-states/cryo-bay_{initial,investigating,victim-identified,case-open-later}.webp`.

**Action:** PNG→WebP convert the `_original.png`, drop both files at the
canonical `art/rooms/` path, run `apps/scripts/upload-public-to-s3.ts`.
Do NOT regenerate.

**Reference prompt** (if regeneration is required for any reason — e.g.
aspect-ratio repair):
> Hyper-realistic cinematic still, 16:9, 4K. Interior of Pod Chamber 47 aboard the cryo-bay deck of a 17,000-year-old generation ship called Ark 1047. The chamber is a long curved gallery with two facing rows of upright cryo-stasis pods — six pods per row, twelve total visible. The pods are tall vertical cylinders of brushed brass and obsidian glass, each with a faint warm cyan `#22d3ee` glow at the canopy where the occupant's face would be. Five pods on each row are sealed and softly luminous from within — sleeping, not empty, the cyan glow pulses at sub-1 Hz, you can almost hear them breathing. The sixth pod on the near side — center frame — is open: hatch lifted forty degrees, volumetric cryogas spilling out from the threshold and pooling at floor height in slow motion. The pod's interior is empty (the player just stepped out). Inside the open pod's rear wall, at approximately 50% left / 72% top in the composition, a small recessed stasis-HUD panel is still active — a twenty-centimeter square flush-mounted display with a faint cyan `#22d3ee` waveform scrolling slowly across it, rendered as abstract signal line-art only (no legible text, no numeric readouts), flickering intermittently as if carrying the last traces of the interference/whisper that woke the occupant. Floor is dark composite, scuffed bare to substrate at every walkway, dust drifting in low-angle starlight. Ceiling is unlit — only emergency floor strips along both walls and the cyan canopy glow of the eleven sealed pods illuminate the room. A single brass-and-bone railing runs the length of the gallery. At the far end of the chamber, a dark archway leads into the corridor. Ankle-height fog. Anamorphic lens flare from the open pod's cyan glow. Film grain. Deep space black `#010020` base. No rendered text. No people. No holograms. Dramatic cyan rim lighting on the open pod. Cinematic 4K composition, three-quarter wide shot, camera at standing eye level, looking down the gallery toward the corridor archway.

### §1.A.3 VFX — Beat A

| VFX | Status | File / Component | Notes |
|---|---|---|---|
| `vfx_cryo_frost_retreat` | INTERMEDIATE | `assets/intermediate/prelude/vfx/cryo-frost-retreat.mp4` | Convert MP4→WebM (VP9, alpha), place at `apps/client/public/art/vfx/prelude/cryo-frost-retreat.webm`. |
| `vfx_pod_hatch_cryogas` | INTERMEDIATE | `assets/intermediate/prelude/vfx/pod-hatch-cryogas.mp4` | Same — MP4→WebM VP9, alpha. |
| `vfx_hologram_materialize` | INTERMEDIATE | `assets/intermediate/prelude/vfx/hologram-materialize.mp4` | Same. Bible §18.3 marks this as shared across beats A, C, C.5, D, F, H. |

### §1.A.4 VO — Beat A

| Line ID | Speaker | Status | URL |
|---|---|---|---|
| `elara_beat_a_five_pods` | Elara | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/elara/elara_beat_a_five_pods.mp3` |

---

## §1.A.5  Beat A.5 — Corridor First Steps (15s breath beat)

### §1.A.5.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-a5-corridor.mp4`
**Duration:** 15s @ 24fps, 16:9 · wordless
**Status:** MISSING
**Bible:** §4

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-a5-corridor_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-a5-corridor_end.png`

**START FRAME prompt (Nano Banana 2):**
> Identical composition to the §4.2 corridor still, but framed for the start of a moving camera: camera positioned at the corridor entrance (just past the cryo-bay archway), looking down the curving corridor. Cryogas residue trail visible at the very base of frame — the player has just stepped through. Both emergency floor strips at the same brightness (mid-pulse, neither at peak nor trough). All other elements identical: dust motes, dim cyan, no overhead light, worn handrails, fifteen meters of corridor curving out of view to the right. 16:9, 4K, deep space black `#010020` base. No text.

**END FRAME prompt (Nano Banana 2):**
> Camera has drifted forward fifteen meters along the corridor's gentle right-hand curve. The cryo-bay archway is no longer visible behind. Ahead, partially visible around the curve, is the closed engineering-bay door: a tall vertical iris-style hatch in worn brass with a single dim cyan status pip at center. The door is closed. The breath-pulse on the nearest emergency strip is at peak (hot leading edge, slightly brighter than start frame). Dust motes thicker in this region — they have settled in the lee of the door for centuries. Same palette, same grain, same fog. 16:9, 4K. No text, no people.

**VEO 3.1 motion prompt:**
> Slow continuous forward dolly along the corridor's gentle right-hand curve, eye level steady at hip height. No camera shake. Beat change at 6s: emergency strip pulse cycles from mid to peak (subtle global brightness shift, 12% increase). Beat change at 12s: engineering-bay door becomes visible around the curve, single cyan status pip ignites. Final 3s: hold on the closed door. Dust motes drift lazily across frame throughout. 24fps. Silent, contemplative, breathing.

**Veo config:** 15s · 16:9 · 24fps · dolly forward, hip height, no shake.

**Audio hand-off:** wordless beat. Ambient corridor wash only (no
dedicated bed — reuse the ship's baseline hum layer from the reactive
audio system).

### §1.A.5.2 Room art — Corridor

**Output:** `apps/client/public/art/rooms/room-corridor.png` + `.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-corridor_original.png`
**Legacy CDN:** not wired in `InlineShipMap.tsx` (corridors are transitional, not map nodes).
**Action:** PNG→WebP convert, place locally, upload to primary CDN.

### §1.A.5.3 VFX — Beat A.5

| VFX | Status | Notes |
|---|---|---|
| `vfx_breath_pulse_strip` | INTERMEDIATE | `assets/intermediate/prelude/vfx/breath-pulse-strip.mp4` — MP4→WebM VP9 alpha. Shared across every beat's floor-strip rendering per bible §18.3. |

### §1.A.5.4 VO — Beat A.5

None. Breath beat is wordless by design (Bible §4.5).

---

## §1.B  Beat B — Corridor / Escape (20s)

### §1.B.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-b-escape.mp4`
**Duration:** 20s @ 24fps, 16:9 · wordless motion, no VO
**Status:** MISSING
**Bible:** §5

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-b-escape_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-b-escape_end.png`

**START FRAME prompt (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Close-up of the engineering-bay iris hatch, centered in frame, camera at eye level approximately 1.5 meters from the door surface. The hatch is a tall vertical brass-and-bone disc, two meters in diameter, with twelve radial petals meeting at a central hub. The hub bears a small recessed manual release wheel made of dark brass with knurled grip, and a single dim cyan `#22d3ee` status pip just below the wheel. Visible age: the central hub paint has been worn off completely, leaving polished brass underneath in a perfect circle the size of a human palm — millennia of hands have touched this exact spot. The petals themselves are matte and show fine concentric scoring from past iris cycles. Behind the door (to the left and right of the hatch frame), the corridor walls fall into shadow. Two emergency floor strips are visible at the very bottom of frame, breath-pulsing dim cyan at mid-cycle. The single status pip on the hub has just turned from dim cyan to **bright foxfire green `#00e676`** — the lock has just released. Volumetric fog at floor level. Anamorphic lens flare on the green pip. Film grain. Deep space black `#010020`. **No text. No people.** Cinematic 4K composition.

**END FRAME prompt (Nano Banana 2):**
> Same camera position twenty seconds later. The iris hatch is now **fully open** — the twelve brass-and-bone petals have rotated and retracted into the hatch frame, leaving a clean two-meter circular opening. Beyond the opening, the **engineering bay** is partially visible: a deep wide chamber dominated by the silhouette of the Engineer's workbench at the far end (a long industrial bench with hanging tool racks above it, currently dark and silent) and, in the foreground at floor level, **six dormant incubator pods** arranged in a semicircle facing the bench. The pods are hip-high, brass and obsidian glass, each canopy completely dark — not glowing yet. Cyan floor strips continue through the threshold and into the engineering bay, breath-pulsing at the same rhythm. A faint foxfire-green `#00e676` glow emanates from somewhere beyond the workbench (the bench's standby indicator). The hatch's hub status pip has now shifted from foxfire green to **steady cyan `#22d3ee`** — door is open, locked in open position. Volumetric fog spills slowly through the opening from the engineering bay (warmer-tinted, faintly green). Anamorphic flare from the pip and the distant green glow. Film grain. Deep space black base. **No text. No people. No holograms** (Elara appears in the next beat). Cinematic 4K composition.

**VEO 3.1 motion prompt:**
> Camera locked at eye level, no movement. Beat 0–3s: hold on closed iris, central pip glowing green. Beat at 3s: twelve petals begin synchronized rotation outward in slow mechanical opening, each petal disengaging with a half-second stagger so the iris peels back like a flower. Beat at 12s: iris fully retracted, warmer green-tinted fog spills through opening from engineering bay beyond. Beat at 16s: pip color shifts from foxfire green to steady cyan. Final 4s: hold on the open doorway and the dormant incubators in the distance. 24fps. Mechanical, reverent, anticipation building.

**Veo config:** 20s · 16:9 · 24fps · camera locked.

**Audio hand-off:** no VO. Ambient hum + iris-petal rotation SFX (runtime
composite). Note: the bible allows a small Human reactive "breathe" cue
around 14s from `cc_beat_c5_palm_frost` voice profile but NOT a line —
that belongs to C.5.

### §1.B.2 Room art — Engineering bay (appears through the iris)

See §1.C.2 — the engineering bay end-frame depends on the
`room-engineering.png` asset. No separate corridor room required (Beat B
composite uses the corridor still end-frame from Beat A.5 as its
background).

### §1.B.3 VFX — Beat B

| VFX | Status | Notes |
|---|---|---|
| `vfx_iris_hatch_open` | MISSING | Render per prompt below. 3s one-shot. |
| `vfx_status_pip_color_shift` | DONE-CODE | `apps/client/src/components/prelude/vfx/effects/StatusPipShift.tsx` |

**MISSING VFX — `vfx_iris_hatch_open` (Veo 3.1, 3s webm with alpha):**

**Output:** `apps/client/public/art/vfx/prelude/iris-hatch-open.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, 3s
**Source prompt:** `docs/production/prelude-asset-build/prompts/vfx/iris-hatch-open.txt`

START FRAME (alpha):
> TRANSPARENT BACKGROUND. Close-up of a twelve-petal mechanical iris hatch, centered on a dark matte-brass bulkhead aboard an ancient generation ship. The iris is in its CLOSED position — twelve triangular brass petals overlapping in a flower pattern, each petal approximately 30 degrees wide, forming a perfect circle 1.5 meters in diameter. Brushed brass `#a16207` with dark obsidian inlays at the petal seams. A faint cyan `#22d3ee` pilot light glows softly at the iris center where the petals meet. The iris is worn — scratches, carbon scoring, and light oxidation — seventeen millennia of disuse. No rendered text. Surface lighting from the cyan pilot light only. The iris fills the frame with ~10% dark margin around it. ONLY the iris is rendered; background is transparent alpha.

END FRAME (alpha):
> Same iris, 3 seconds later, fully OPEN. Twelve petals have rotated outward into the bulkhead's hidden recess, revealing a black void at the center. The pilot light has bloomed into a wider cyan `#22d3ee` ring around the rim of the opening, with anamorphic lens flare on the brightest points. Petal edges catch the cyan light on their inner surfaces as they sit retracted. The circular opening is approximately 1.4m diameter, slightly smaller than the iris footprint due to petal overlap in the recess. Background remains transparent alpha.

MOTION (Veo 3.1):
> At t=0s the iris is fully closed (start frame). At t=0.3s a brief cyan pulse brightens the pilot light as the mechanism engages. At t=0.5s all twelve petals begin rotating simultaneously — each petal pivots outward on its outer hinge, sliding into the bulkhead recess with a smooth mechanical curve. The rotation accelerates slightly past the midpoint (t=1.5s the iris is about 60% open) then decelerates as the petals reach their rest position in the recess. At t=2.6s the petals complete their rotation. The cyan bloom builds continuously from the center outward as the aperture widens, reaching peak brightness at t=2.8s when the opening is fully revealed. At t=3.0s the effect holds on the end frame. 24fps. Mechanical, precise, reverent — this iris has been waiting seventeen thousand years to open.

### §1.B.4 VO — Beat B

None. Cutscene is wordless mechanism sequence.

---

## §1.C  Beat C — Engineering / Crew Role Choice + Six Incubators (35s)

### §1.C.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-c-crew-and-incubators.mp4`
**Duration:** 35s @ 24fps, 16:9
**Status:** MISSING
**Bible:** §6

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-c-crew-and-incubators_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-c-crew-and-incubators_end.png`

**START FRAME prompt:**
> Identical composition to the §6.3 engineering still, but framed for the start of a moving camera: camera at the engineering-bay threshold (just inside the now-open iris from Beat B), looking down the central aisle toward the workbench. The six incubator pods are visible in the foreground semicircle. Elara's hologram is **just beginning to materialize** at the center of the semicircle, in the spotlight position — only the lower 30% of her form has scanline-wiped in, the rest is still resolving. The bench's foxfire-green standby pip is at full brightness. Volumetric fog, ankle height. 16:9, 4K, no text.

**END FRAME prompt:**
> Same engineering bay, thirty-five seconds later. Camera has drifted forward six meters along the central aisle and now rests at the heart of the incubator semicircle, looking past Elara's fully materialized hologram toward the workbench. **Elara is fully resolved** — translucent senatorial figure in cyan `#22d3ee` scanlines, hands open at her sides, expression watchful. Her gesture is subtle: one hand turned palm-up toward the six dormant incubator pods, as if presenting them. **The brass deck box on the workbench has its latch open** — only the latch, the lid is still closed. A single new visible detail on the bench: a **small holographic projection** has just bloomed above the recording rig: a low-fidelity 3D outline of the player's chosen starter crewmate (composite silhouette — render an ambiguous androgynous human-shaped wireframe, no facial features, no class signifier — the actual model will be substituted at runtime based on the player's choice). The wireframe is foxfire green. All six incubators remain dark and dormant. Volumetric fog has lifted slightly — the room is welcoming her. Anamorphic flare from the bench standby pip and Elara's hologram. Film grain, deep space black base. No text. Cinematic 4K composition.

**VEO 3.1 motion prompt:**
> Slow continuous forward dolly six meters down the engineering bay aisle, camera at standing eye level. Beat 0–6s: Elara hologram completes scanline-wipe materialization in the foreground arc, soft bloom builds. Beat at 12s: Elara turns her open palm toward the six dormant incubator pods in a presenting gesture as her line about Dr. Lyra Vox plays. Beat at 22s: brass deck box latch on workbench clicks open mechanically. Beat at 28s: low-fidelity foxfire-green wireframe of chosen crewmate blooms above the bench's recording rig. Final 7s: hold on the framing — Elara, six dark pods, lit bench, wireframe. 24fps. Reverent, careful, planting-a-seed tone.

**Veo config:** 35s · 16:9 · 24fps · 6m forward dolly.

**Audio hand-off:**
- VO `elara_beat_c_six_incubators` @ ~12s — DONE-S3-VO →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/elara/elara_beat_c_six_incubators.mp3`
- Ambient: engineering bay reactive audio — no dedicated bed.

**Canon hygiene:** player crewmate wireframe at end-frame must be
ambiguous (no gender, no class). Runtime substitutes the correct
spritesheet.

### §1.C.2 Room art — Engineering

**Output:** `apps/client/public/art/rooms/room-engineering.png` + `.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-engineering_original.png`
**Legacy CDN:** `https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/engineering_554605d2.png` (`DONE-CDN-LEGACY`)
**Action:** PNG→WebP, drop at canonical path, upload.

### §1.C.3 VFX — Beat C

| VFX | Status | Notes |
|---|---|---|
| `vfx_incubator_pod_dormant_glow` | DONE-CODE | CSS animation on incubator pod sprites at runtime. |
| `vfx_bench_standby_pip` | DONE-CODE | CSS pulse on foxfire-green pip. |
| `vfx_role_wireframe_bloom` | MISSING | Render per prompt below. 2.5s one-shot WebM w/ alpha. |

**MISSING VFX — `vfx_role_wireframe_bloom` (Veo 3.1, 2.5s):**

**Output:** `apps/client/public/art/vfx/prelude/role-wireframe-bloom.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, 2.5s

START FRAME (alpha):
> TRANSPARENT BACKGROUND. Empty space where a crewmate hologram will materialize. Center of frame contains only the faintest cyan `#22d3ee` hint — a single pixel-width vertical line, barely visible, suggesting a projection axis. Height ~1.8m (human scale) but nothing rendered beyond that light seed. Background is fully transparent. No text. No visible room.

END FRAME (alpha):
> Fully materialized cyan `#22d3ee` wireframe hologram of a generic crewmate, 1.8m tall, standing in neutral pose. Hologram renders as thin glowing wireframe lines showing skeletal structure and silhouette outline — NOT solid-filled, NOT textured. Scanline effect runs vertically through the figure (thin horizontal cyan lines at 2% opacity). Soft cyan bloom surrounds the whole figure to ~2.2m diameter. Anamorphic lens flare on the head and shoulders. Floor contact point has a bright cyan ring at the hologram's feet, 40cm diameter. Background remains transparent alpha. No rendered text. No gender, no identifying features — this is a placeholder crew role slot, not a specific person.

MOTION:
> At t=0s only the seed line is visible. At t=0.3s the line pulses brighter and a cyan ground ring appears at the base. At t=0.5s wireframe structure begins scanning upward — vertical construction from feet to head, like a 3D printer building the figure. At t=1.5s the full wireframe silhouette is present but dim. At t=1.8s a soft bloom expands outward from the figure, filling in the scanlines and increasing brightness. At t=2.2s bloom peaks. At t=2.5s it settles into the steady end-frame state. 24fps. Ceremonial, reverent, revealing — like a sacred interface activating.

### §1.C.4 VO — Beat C

| Line ID | Speaker | Status | URL |
|---|---|---|---|
| `elara_beat_c_six_incubators` | Elara | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/elara/elara_beat_c_six_incubators.mp3` |

---

## §1.C.5  Beat C.5 — Window / Human Palm Frost (20s · CRITICAL VFX)

> Bible §7.6 flag: **"human-palm-frost is the single most important VFX
> in the Prelude — get the hand shape right or the moment falls flat."**

### §1.C.5.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-c5-window.mp4`
**Duration:** 20s @ 24fps, 16:9
**Status:** MISSING
**Bible:** §7

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-c5-window_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-c5-window_end.png`

**START FRAME prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the engineering bay's port-side wall, framed on **a tall rectangular viewport** approximately 1.2 meters wide and 2 meters tall, set into the matte-charcoal wall at standing height. The viewport glass is thick obsidian-tinted reinforced composite, slightly distorting the view. **Beyond the glass: deep space**, the Ark drifting through a broad starfield. The visible stars are scattered, dim, no nebula, no nearby planet — just the slow void. The Ark's outer hull plating is faintly visible at the bottom of the viewport (a curving brass-and-bone surface, weathered and pitted). **In front of the viewport, ten centimeters from the glass**, **Elara's hologram** stands with her back to the camera — translucent senatorial figure in cyan `#22d3ee` scanlines, hands at her sides, head tilted slightly upward as if looking at a particular distant star. The hologram bloom casts soft cyan rim light onto the viewport's frame. Camera is approximately three meters behind her, low three-quarter angle, framing both her silhouette and the starfield beyond. The engineering bay around the viewport is in shadow — only the cyan floor strips and Elara's hologram illuminate the scene. Volumetric fog at ankle height. Anamorphic lens flare on Elara's bloom and the brightest visible star. Film grain. Deep space black `#010020` base. **No rendered text. No other people. No other holograms.** Cinematic 4K composition. The mood is silent, intimate, contemplative — the player is supposed to want to stand next to her and not say anything.

**END FRAME prompt:**
> Same composition twenty seconds later. Camera has drifted forward two meters — Elara's silhouette is closer, the viewport more dominant. **A second presence has appeared in the scene** without entering it: across the viewport's reinforced glass, **at eye level on the inside surface of the glass**, a faint pattern of frost has formed in the shape of **a single open palm** — five fingers, slightly larger than human, pressed against the glass *from the player's side of the room*. There is no body attached to the palm. No figure. Just the frost-print, suggesting that something invisible is standing right next to the player and has just touched the window. Elara has not turned — she is still looking out at the stars, unaware. The palm-print is rendered in faint white frost on dark glass, very subtle but unmistakably hand-shaped. Same starfield beyond, same cyan rim from Elara, same fog, same grain. 16:9, 4K, no text. The reveal is **the palm-print** — that is The Human, becoming briefly visible to the player and only the player.

**VEO 3.1 motion prompt:**
> Slow continuous forward dolly two meters toward the viewport, camera at standing eye level, Elara's silhouette held in the right two-thirds of frame. No camera shake. Beat 0–8s: silent drift, dust motes catching cyan light. Beat at 9s: faint warm-white frost begins forming on the inside of the viewport glass at eye level, slowly resolving into the shape of an open palm over four seconds. Beat at 14s: palm-print fully formed, holds. Beat at 17s: The Human's voice begins (out of frame, no visual). Final 3s: hold on the palm-print and Elara's unaware silhouette. 24fps. Intimate, ancient, watching-from-just-beside-you tone.

**Veo config:** 20s · 16:9 · 24fps · 2m forward dolly.

**Audio hand-off:**
- VO `human_beat_c5_first_breath` @ ~17s — DONE-S3-VO →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/human/human_beat_c5_first_breath.mp3`
- Reactive: `cc_beat_c5_palm_frost` (Human-reactive whisper) →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_c5_palm_frost.mp3`

### §1.C.5.2 Room art — Engineering viewport

Reuses `room-engineering.png` (the viewport is built into the bay's
port-side wall). No separate room still required. See §1.C.2.

### §1.C.5.3 VFX — Beat C.5

| VFX | Status | Notes |
|---|---|---|
| `vfx_starfield_drift_viewport` | MISSING | 10s seamless loop, `starfield-drift.webm`. |
| `vfx_human_palm_frost` | MISSING | **⚠ HIGHEST PRIORITY VFX IN PRELUDE** — 4s one-shot, `human-palm-frost.webm`. |

**MISSING VFX — `vfx_starfield_drift_viewport` (Veo 3.1, 10s seamless loop):**

**Output:** `apps/client/public/art/vfx/prelude/starfield-drift.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, seamless loop.

START FRAME (alpha):
> TRANSPARENT BACKGROUND. Parallax starfield panorama seen through a viewport — three distinct depth layers: FAR (tiny pinprick stars, ~200 points, white and pale blue at 15% opacity), MID (small-to-medium stars, ~80 points, white and gold at 40% opacity, with faint anamorphic flare on the brightest 5), and NEAR (large stars, ~20 points, bright white and amber at 80% opacity with lens-flare spikes). Distant gas-cloud nebula in the upper-right quadrant: deep violet `#1e1b4b` bleeding into near-black, with cyan `#22d3ee` gas filaments at 20% opacity. No stars are in rigid grid pattern — they must look naturally scattered. Deep space black elsewhere but as TRANSPARENT alpha (not actual black) so the viewport can composite over any background. No rendered text. No ship interior visible.

END FRAME: IDENTICAL to start frame (seamless loop — pixel-perfect).

MOTION:
> Parallax drift: over 10 seconds the camera drifts slowly rightward. FAR layer shifts only 4 pixels. MID layer shifts 12 pixels. NEAR layer shifts 32 pixels. All motion is linear and steady — no acceleration, no tremble. At t=10s all layers have returned to the exact start position (the drift rolls over like a seamless panorama). Three bright NEAR-layer stars gently twinkle with sub-0.5 Hz opacity variation (±10%) on random offsets so no two twinkle in sync. The nebula is completely static — no internal motion. 24fps. Meditative, vast, patient.

**MISSING VFX — `vfx_human_palm_frost` (Veo 3.1, 4s one-shot, CRITICAL):**

**Output:** `apps/client/public/art/vfx/prelude/human-palm-frost.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, 4s.

START FRAME (alpha):
> TRANSPARENT BACKGROUND. Empty space centered for where frost will form. Very faint condensation — a diffuse irregular patch of pale cyan `#22d3ee` at 5% opacity, about 20cm × 25cm, suggesting the beginning of frost precipitation on glass. Six-pointed frost crystals are visible ONLY at the very edges of the patch (maybe 4 tiny crystals at <20% opacity), suggesting the formation is just starting. No recognizable shape yet — deliberately ambiguous. No text. No visible hand, no visible person.

END FRAME (alpha):
> Hyper-realistic frost pattern forming the UNMISTAKABLE OUTLINE AND INNER DETAIL OF AN OPEN HUMAN PALM PRESSED AGAINST GLASS from the other side. The frost covers a region approximately 18cm × 22cm. The shape must clearly read as a human left hand, fingers spread open, palm facing the viewer — five distinct fingers, thumb on the right side (viewer's right), palm curvature at the base, finger creases visible as concentrations of denser frost. Frost density is HIGHER in the negative space around where the hand is (fingers, palm show less frost — the warmth of the hand is melting the frost), and LOWER frost (darker, more transparent) in the actual hand silhouette. Six-pointed crystalline frost crystals at the perimeter and in the space BETWEEN the fingers, brightest cyan `#22d3ee` at the crystal tips. Frost color: cyan-white `#cffafe` with deep cyan shadows. The overall effect: you see the ghost of a human hand in the frost, unmistakable. NO rendered text. No actual hand visible — only the frost imprint of where the hand is. This is the canonical "someone is there on the other side" moment.

MOTION:
> At t=0s only faint condensation (start frame). At t=0.5s frost crystals begin forming from random seed points within the patch area, growing outward in six-pointed fractal patterns. At t=1.2s the density increases — more crystals, more opacity. At t=1.8s something subtle: the frost pattern BEGINS to suggest a shape — the player's eye catches finger outlines forming. At t=2.5s the hand silhouette is becoming undeniable. At t=3.2s the hand-shaped NEGATIVE SPACE (where warmth melts the frost) is fully visible — frost is dense around fingers, thinner in the palm region where body heat is highest. At t=3.8s the pattern settles into its final resolved state. At t=4.0s hold on the end frame. 24fps. Slow, tender, inexorable. The player should feel cold running down their spine as the shape resolves — this is The Human reaching for the player through 17,000 years of glass and cryosleep.

### §1.C.5.4 VO — Beat C.5

| Line ID | Speaker | Status | URL |
|---|---|---|---|
| `human_beat_c5_first_breath` | Human | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/human/human_beat_c5_first_breath.mp3` |
| `cc_beat_c5_palm_frost` | Human (reactive) | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_c5_palm_frost.mp3` |

---

## §1.D  Beat D — Cargo Bay / Trade Empire Seed + Locke Mission Board (30s)

### §1.D.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-d-cargo-bay.mp4`
**Duration:** 30s @ 24fps, 16:9
**Status:** MISSING
**Bible:** §8

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-d-cargo-bay_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-d-cargo-bay_end.png`

**START FRAME prompt:**
> Identical composition to the §8.3 cargo hold still, but framed for the start of a moving camera: camera positioned at the entrance from the engineering bay (right side of frame), looking diagonally across the cargo hold toward the mission board on the far left wall. The starlight shaft is dead center. Elara's hologram is **in mid-stride**, walking from the entrance toward the mission board, her translucent cyan form passing through the starlight shaft (the shaft passes harmlessly through her, no shadow). Camera at standing eye level, slight low angle to emphasize the chamber's height. 16:9, 4K, no text, deep space black base.

**END FRAME prompt:**
> Same cargo hold, thirty seconds later. Camera has dollied forward and slightly left, now positioned about four meters from the mission board, looking past Elara's hologram (who has stopped at the board's center, hand raised, palm-out toward one specific slate in the upper-left corner). The slate Elara is pointing to is the **17,000-year-old posting** — its cyan glow is now visibly more saturated than the other two active slates, drawing the eye. The other two active slates are still glowing faintly. The starlight shaft is now to the right of frame, partially out of view. The mission board occupies the left two-thirds of frame. Above Elara's pointing hand, a faint cyan **glyph projection** has bloomed in front of the slate — a small holographic icon (do not render specific shape) indicating the mission's still-open status. Volumetric fog, ankle height. Anamorphic flare on the highlighted slate. Film grain. Deep space black base. **No rendered text.** Cinematic 4K composition.

**VEO 3.1 motion prompt:**
> Slow continuous diagonal dolly from cargo entrance toward the left-wall mission board, camera at standing eye level. Beat 0–8s: Elara hologram walks ahead of camera, passing through the central starlight shaft (no shadow cast). Beat at 12s: Elara stops at mission board center, raises one open palm toward upper-left slate. Beat at 18s: highlighted slate's cyan glow saturates over four seconds, becoming visibly brighter than the other two active slates. Beat at 24s: small cyan holographic glyph blooms in front of the highlighted slate. Final 6s: hold on Elara, mission board, glowing slate. 24fps. Quiet, archeological, weight-of-time tone.

**Veo config:** 30s · 16:9 · 24fps · diagonal dolly.

**Audio hand-off:**
- VO `elara_beat_d_17000_year_mission` @ ~12s — DONE-S3-VO →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/elara/elara_beat_d_17000_year_mission.mp3`
- Reactive: `cc_beat_d_first_slate_human` (Human-reactive, fires on first
  slate highlight) →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_d_first_slate_human.mp3`

### §1.D.2 Room art — Cargo Hold

**Output:** `apps/client/public/art/rooms/room-cargo-hold.png` + `.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-cargo-hold_original.png`
**Legacy CDN:** `https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/cargo-hold_9df574a9.png` (`DONE-CDN-LEGACY`)
**Action:** PNG→WebP, canonical path, upload.

### §1.D.3 VFX — Beat D

| VFX | Status | Notes |
|---|---|---|
| `vfx_starlight_shaft_dust` | MISSING | 8s seamless loop. |
| `vfx_mission_slate_glow` | DONE-CODE | `MissionSlateGlow.tsx` handles the saturation ramp at runtime. |
| `vfx_mission_glyph_bloom` | MISSING | 1.5s one-shot. |

**MISSING VFX — `vfx_starlight_shaft_dust` (Veo 3.1, 8s seamless loop):**

**Output:** `apps/client/public/art/vfx/prelude/starlight-shaft-dust.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, seamless loop.

START FRAME (alpha):
> TRANSPARENT BACKGROUND. A single vertical column of pale cyan-white `#e0f2fe` volumetric light descending from the top of the frame to the bottom, approximately 80cm wide at the top narrowing to 60cm at the bottom (perspective taper). The shaft is luminous but semi-translucent — inside the shaft you can see ~40 tiny dust motes suspended and drifting upward through the beam, each mote is a white pinprick at 60-90% opacity with a faint bloom halo. Outside the shaft is fully transparent alpha. Shaft edges are soft (Gaussian blur, no hard line). Anamorphic horizontal flare where the shaft is widest at the top. Deep cyan accent at `#22d3ee` only on the brightest dust motes. No text.

END FRAME: IDENTICAL to start frame (seamless loop).

MOTION:
> The shaft itself is static — no pulsing, no flicker. Inside the shaft, the ~40 dust motes drift UPWARD at varying slow speeds (3-12 px per second). As each mote reaches the top of the shaft it fades out over 0.5s. Simultaneously, new motes fade in at the bottom of the shaft. The mote count stays constant (~40) throughout. Very subtle horizontal drift (±2px random) on each mote simulates gentle air currents. At t=8s the system returns to the same configuration as t=0s (seamless loop — the motes you see at the end are in the same positions as the ones at the start). 24fps. Contemplative, ancient, reverent — the first natural light the ship has seen in millennia.

**MISSING VFX — `vfx_mission_glyph_bloom` (Veo 3.1, 1.5s one-shot):**

**Output:** `apps/client/public/art/vfx/prelude/mission-glyph-bloom.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, 1.5s.

START FRAME (alpha):
> TRANSPARENT BACKGROUND. Empty space where the glyph will bloom. A single cyan `#22d3ee` seed point at center, 2-pixel diameter, faintly glowing. Nothing else rendered. No text.

END FRAME (alpha):
> A small holographic cyan glyph, approximately 30cm × 30cm, rendered as thin cyan `#22d3ee` lines with soft bloom. The glyph is an abstract geometric sigil: concentric circles with radial marker lines (like a stylized compass rose), meaningful-looking but not legible as any specific language. Bloom halo surrounds the glyph to ~60cm diameter. Anamorphic horizontal flare across the glyph center. No rendered text. The glyph is a Trade Empire mission-posting marker — it should feel like a UI affordance, not a magical rune.

MOTION:
> At t=0s only the seed point. At t=0.15s the seed brightens and a scanning cyan line draws the outer circle clockwise in 0.4s. At t=0.55s a second scanning line draws the inner circle counter-clockwise in 0.3s. At t=0.85s the radial marker lines flash into existence simultaneously. At t=1.0s a soft bloom expands outward from the completed glyph, reaching full size at t=1.3s. At t=1.5s the effect holds on end frame. 24fps. Precise, informational, functional — a UI element, not a spell.

### §1.D.4 VO — Beat D

| Line ID | Speaker | Status | URL |
|---|---|---|---|
| `elara_beat_d_17000_year_mission` | Elara | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/elara/elara_beat_d_17000_year_mission.mp3` |
| `cc_beat_d_first_slate_human` | Human (reactive) | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_d_first_slate_human.mp3` |

---

## §1.D.5  Beat D.5 — Galley (25s breath beat)

### §1.D.5.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-d5-galley.mp4`
**Duration:** 25s @ 24fps, 16:9
**Status:** MISSING
**Bible:** §9

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-d5-galley_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-d5-galley_end.png`

**START FRAME prompt:**
> Identical to the §9.3 galley still, but framed for the start of a moving camera: camera at the galley doorway looking diagonally across the room toward the lone coffee mug on the counter. The framing emphasizes the mug as the natural focal point. Warm-amber pilot light on the stove visible. Dust motes barely moving. 16:9, 4K, no text.

**END FRAME prompt:**
> Same galley, twenty-five seconds later. Camera has dollied two meters forward and slightly right — the coffee mug now occupies the center-right of frame, much closer to the lens. **A faint warm-amber glow** from the stove's pilot light has subtly increased in intensity (5% brighter), and the mug's interior dark ring is now catching the warm light, looking almost like fresh coffee. **No other change** — the mug has not been touched, nothing has moved, no figure has appeared. Same dust, same pans, same stools. The shot is purely about the closer view of the mug and the slight warming of the pilot light. 16:9, 4K, no text.

**VEO 3.1 motion prompt:**
> Slow continuous forward dolly two meters and slight right pan, camera at standing eye level. No camera shake. Beat 0–8s: silent drift, dust motes barely moving in the still air. Beat at 9s: stove's amber pilot light brightens by 5% over four seconds — almost imperceptible. Beat at 14s: The Human's voice begins (out of frame, no visual). Final 5s: hold on the close shot of the lone coffee mug, warm amber on its rim. 24fps. Domestic, fragile, fond tone.

**Veo config:** 25s · 16:9 · 24fps · 2m forward dolly + slight right pan.

**Audio hand-off:**
- VO `human_beat_d5_sandwich` @ ~14s — DONE-S3-VO →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/human/human_beat_d5_sandwich.mp3`

### §1.D.5.2 Room art — Galley

**Output:** `apps/client/public/art/rooms/room-galley.png` + `.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-galley_original.png`
**Legacy CDN:** not wired (galley is not a map node in InlineShipMap).
**Action:** PNG→WebP, canonical path, upload.

### §1.D.5.3 VFX — Beat D.5

| VFX | Status | Notes |
|---|---|---|
| `vfx_galley_pilot_warm` | DONE-CODE | `AmberGlow.tsx` component handles the 5% amber brightness ramp. |
| `vfx_galley_steam_residue` | P1 / INTERMEDIATE-OPTIONAL | `docs/production/prelude-asset-build/prompts/vfx/galley-steam-residue.txt` — Bible §9.6 flags as "cut if it weakens realism". 6s seamless loop WebM alpha. Not in `assets/intermediate/` yet; render only if Beat D.5 needs extra atmosphere in playtest. |

### §1.D.5.4 VO — Beat D.5

| Line ID | Speaker | Status | URL |
|---|---|---|---|
| `human_beat_d5_sandwich` | Human | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/human/human_beat_d5_sandwich.mp3` |

---

## §1.E  Beat E — Mess Hall / Prince's Archive (45s · complex 3-act beat)

### §1.E.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-e-mess-hall-flashback.mp4`
**Duration:** 45s @ 24fps, 16:9
**Status:** MISSING
**Bible:** §10

This beat is the Prelude's most complex single-clip cutscene — 3 acts
inside 45s with sepia-drain transitions and two holographic-Prince
materializations. Recommend split-render: (a) render the three acts as
separate 10s / 15s / 20s Veo clips, (b) composite + sepia in post. If
Veo honors long motion-beat lists, try single render first.

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-e-mess-hall-flashback_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-e-mess-hall-flashback_end.png`
- **Mid-frame A** (sepia Prince holding toy soldier at Archive shelf): render separately at `assets/intermediate/prelude/cutscenes/prelude-beat-e_mid-a.png`
- **Mid-frame B** (young sepia Prince in front of diploma): render at `assets/intermediate/prelude/cutscenes/prelude-beat-e_mid-b.png`

**START FRAME prompt:**
> Identical composition to the §10.3 Mess Hall still, but framed for a camera just *inside* the entrance doorway, looking diagonally across the room with the central table dominating the lower right and the Archive shelf on the left wall just coming into frame. The framed diploma is partially visible in the upper-left corner. The plate-with-napkin on the far chair is visible. Warm-amber service light on the ceiling above the far end of the table. Full color (no sepia yet — the sepia drain is an in-motion effect). 16:9, 4K, no text.

**END FRAME prompt:**
> Full-color Mess Hall, sepia fully drained back to normal, both holograms gone. Camera has pulled back to a medium-wide shot of the Archive shelf, including the toy soldier, the still-dim strongbox (now the compositional focal point — faint cyan glow from its biometric lock), and the diploma mounted above. The plate-and-napkin on the far chair is visible on the right edge of frame. Warm-amber service light above the central table. The real Mess Hall — no holograms, no sepia, no flashback — but the player now knows what the room *contains*. Volumetric fog ankle height. Anamorphic lens flare on the strongbox's cyan lock. Film grain. Deep space black `#010020` base. 16:9, 4K, no text.

**Mid Frame A prompt (sepia flashback 1 — holographic Prince holding toy soldier):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the same §10.3 Mess Hall, but the whole image is treated with a yellow-brown sepia tone + faint film-damage overlay (flecks, scratches, slight tint shift toward warm sepia `#b0793a`). Camera is positioned at the Archive shelf's center bay, framing it as the subject. Holographic Prince stands beside the shelf: an older man in his late fifties, translucent sepia-toned hologram rendered in the same aesthetic as Elara but with warmer yellow-brown tones instead of cyan. He wears a Free Ports senatorial greatcoat, weathered. He is holding a small battered cast-metal child's toy soldier in his right hand at about chest height, turning it gently in his fingers as if remembering something. His expression is small, private, fond. Film-damage scratches cross the frame (subtle — suggest age, not destruction). Deep space black has been mostly replaced with warm brown. Volumetric fog at ankle height, slightly tinted amber. No rendered text. No people except the holographic Prince.

**Mid Frame B prompt (sepia flashback 2 — younger Prince in front of diploma):**
> Same sepia treatment as Mid Frame A. Camera has tracked up and left to the diploma mounted above the Archive shelf. Framing shows the diploma centered. In front of the diploma, approximately 40cm forward of the wall, a younger holographic Prince has materialized — mid-thirties version of the same man, translucent sepia hologram, wearing cleaner Free Ports academic robes (this is his graduation day). He stands in three-quarter view, the diploma visible as the clear subject behind him. His expression is proud but not smug — the private pride of a young man who has earned something his family didn't have. Film-damage scratches. Warm sepia palette throughout. Volumetric ankle fog, amber-tinted. 16:9, 4K, no rendered text on the diploma (the ink bloom effect is applied in motion, not the still).

**VEO 3.1 motion prompt:**
> Slow continuous camera work across three acts inside a 45-second runtime. **Act 1 (0–10s):** forward dolly from the doorway into the Mess Hall, full color, camera at standing eye level, diagonally revealing the central table, the one-chair-with-plate, and the left-wall Archive shelf. Dust motes drift in the amber service light. **Transition at 10s (3 seconds long):** sepia-drain from full color to yellow-brown tones. **Act 2 (10–25s):** camera is now at the Archive shelf's center bay. Holographic Prince materializes holding the toy soldier (use Mid Frame A as visual anchor). Film-damage overlay appears. At 14s the Prince begins speaking (audio triggers Prince VO line 1 from §10.5). The hologram holds the soldier, occasionally turning it in his hand, the gesture small and private. At 24s the line finishes. The hologram fades over 1 second. **Transition at 25s (sepia drains back to full color over 2 seconds).** **Act 3 (27–45s):** camera tracks up the left wall to frame the diploma. Second sepia-drain transition at 27s (3 seconds). Younger holographic Prince materializes in front of the diploma (use Mid Frame B). At 30s he begins speaking (audio triggers Prince VO line 2 from §10.5). At 34s a brief pale-gold ink bloom traces across the diploma's calligraphy (render as subtle glow, holds 2 seconds, fades). At 40s the line finishes. The hologram fades over 1 second. Sepia drains back to full color over 2 seconds. Camera pulls back slightly for the final 3 seconds to frame the Archive shelf including the dormant strongbox — the final shot is the sealed strongbox's cyan lock glow catching the player's eye as the cutscene ends. 24fps. Reverent, archaeological, private-memory tone.

**Veo config:** 45s · 16:9 · 24fps · complex three-act with 2 sepia
transitions + 2 Prince materializations. **Split-render recommendation:**
render each act + each transition as a separate shorter clip; composite
sepia/film-damage overlay in post; concatenate with `ffmpeg`.

**Audio hand-off:**
- VO `prince_beat_e_toy_soldier` @ ~14s — DONE-S3-VO →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/prince/prince_beat_e_toy_soldier.mp3`
- VO `prince_beat_e_diploma` @ ~30s — DONE-S3-VO →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/prince/prince_beat_e_diploma.mp3`
- Reactive: `cc_beat_e_flashback_complete` →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_e_flashback_complete.mp3`

**Canon hygiene:** the Prince's face CAN be rendered (unlike the
Engineer). Both holograms are shown as translucent sepia-toned figures,
NOT solid characters.

### §1.E.2 Room art — Mess Hall

**Output:** `apps/client/public/art/rooms/room-mess-hall.png` + `.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-mess-hall_original.png`
**Legacy CDN:** not wired in InlineShipMap (mess hall isn't a map node in the current schematic UI).
**Action:** PNG→WebP, canonical path, upload.

### §1.E.3 VFX — Beat E

| VFX | Status | Notes |
|---|---|---|
| `vfx_sepia_drain` | INTERMEDIATE | `assets/intermediate/prelude/vfx/sepia-drain.mp4` → MP4→WebM VP9 alpha. Full-screen overlay, shared with Beat J. Bible §18.1. |
| `vfx_film_damage_overlay` | INTERMEDIATE | `assets/intermediate/prelude/vfx/film-damage-overlay.mp4` → MP4→WebM VP9 alpha. Full-screen overlay, shared with Beat J. |
| `vfx_diploma_ink_bloom` | MISSING | 2s one-shot. Render per prompt below. |

**MISSING VFX — `vfx_diploma_ink_bloom` (Veo 3.1, 2s):**

**Output:** `apps/client/public/art/vfx/prelude/diploma-ink-bloom.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, 2s.

START FRAME (alpha):
> TRANSPARENT BACKGROUND. Empty space with a faint hint of calligraphic ink marks on a rectangular area approximately 40cm × 30cm (landscape, like a framed diploma). Ink is barely visible at 10% opacity — dark brown `#44403c` flowing script shapes, deliberately illegible. No rendered readable text.

END FRAME (alpha):
> Same 40cm × 30cm rectangular region with a pale-gold `#fde047` SOFT BLOOM tracing across the calligraphic ink. The ink itself remains at the same opacity — it's not getting brighter, the BLOOM is tracing along its pen strokes. The bloom creates a warm golden glow that follows every curve of the script, as if the ink is being illuminated from within by soft sunlight. Bloom intensity is strongest along horizontal script strokes. The text remains DELIBERATELY ILLEGIBLE — do not render actual words. Warm anamorphic flare on the widest bloom areas. No rendered readable text.

MOTION:
> At t=0s only faint ink visible. At t=0.2s a warm gold bloom seeds at the upper-left of the text area. The bloom expands along the ink strokes in a connected tracing motion, following the script as if reading it left-to-right, top-to-bottom. Path completes at t=1.6s when all strokes are bloomed. At t=1.8s the bloom settles to steady intensity. At t=2.0s holds on end frame. 24fps. Gentle, reverent, nostalgic — the memory of a credential that mattered once.

### §1.E.4 VO — Beat E

| Line ID | Speaker | Status | URL |
|---|---|---|---|
| `prince_beat_e_toy_soldier` | Prince | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/prince/prince_beat_e_toy_soldier.mp3` |
| `prince_beat_e_diploma` | Prince | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/prince/prince_beat_e_diploma.mp3` |
| `cc_beat_e_flashback_complete` | Human (reactive) | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_e_flashback_complete.mp3` |

---

## §1.F  Beat F — Briefing Room / Kael Contingency Memo (30s)

> **Whitelisted rendered-text beat.** The Kael memo's three bullets
> must be fully legible in the end frame and the VFX webm.

### §1.F.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-f-briefing-room.mp4`
**Duration:** 30s @ 24fps, 16:9
**Status:** MISSING
**Bible:** §11

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-f-briefing-room_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-f-briefing-room_end.png`

**START FRAME prompt:**
> Identical composition to the §11.3 Briefing Room still, but framed from just inside the entrance doorway, camera at standing eye level looking diagonally across the room with the central table in the lower-middle ground, the eight chairs arranged around it (the askew chair visible on the far side of the table), and both side-wall lockboxes visible in the mid-background. The left-wall lockbox's biometric lock is bright cyan, pulsing. The right-wall lockbox's door is already slightly ajar. The far-wall holo display is dark. Full color, no flashback treatment. 16:9, 4K, no text.

**END FRAME prompt (rendered-text exception):**
> Full front view of the Briefing Room's far wall, dominated by the holographic display now active and rendering the three-bullet **Kael Contingency Memo**. The display shows, in hand-written calligraphic cyan text, the three bullet points listed in §11.4 — fully legible and readable by the player as static text in the frame. The title "If Kael is taken — a memo from the Engineer" sits above the three bullets in the same hand. Below and to the left of the display, the right-wall lockbox is open, its interior dark and empty (the memo has risen out of it). In the left peripheral frame, Elara's hologram is visible standing silently, one arm lowered at her side, watching the player read. The central briefing table occupies the lower third of the frame with the eight chairs visible (the askew chair central). Full color. Cinematic 4K composition. **This is the one exception to the "no rendered text" rule** — the three memo bullets MUST be rendered legibly in the end frame because the player is meant to read them.
>
> The exact rendered bullets (verbatim from `memo-holo-rise.txt`):
> - Contingency transfer protocol — see Locke
> - Archives vault — bridge key pattern
> - If I am not returning — Quinn

**VEO 3.1 motion prompt:**
> Slow continuous camera work across three acts and one silent beat inside a 30-second runtime. **Act 1 (0–5s):** forward dolly from the doorway into the Briefing Room, standing eye level, revealing the central table, eight chairs, both lockboxes, and the dark far-wall display. Dust motes drift in the dim cyan floor-strip light. **Act 2 (5–14s):** camera glides left to the left-wall lockbox. At 7s Elara's hologram materializes beside the lockbox. At 8s the biometric lock flashes once (three-frame brighter pulse) and the lockbox door slides open. At 9s the cyan data-slate is revealed inside. At 11s Elara speaks the `elara_beat_f_213_entries` line. At 13s the slate's pulse slows and settles. **Silent beat (14–20s):** camera dollies back to a wide shot of the briefing table, Elara's hologram remaining in left-frame beside the open lockbox. 6 seconds of held silence. The askew chair is centered in the composition. Music drops to a single low sustained cello note, barely audible. **Act 3 (20–30s):** camera glides right to the right-wall lockbox. At 21s its door swings open fully. At 22s a pale cyan holographic sheet rises out of the lockbox and projects onto the far-wall display, which wakes to bright cyan. At 23s the document title appears ("If Kael is taken — a memo from the Engineer"). At 24s the first bullet renders, fully legible. At 26s the second bullet renders. At 28s the third bullet renders. Camera holds on the display for the final 2 seconds. Elara remains silently in left peripheral frame. 24fps. Cold, measured, documentarian tone — this is the room where decisions were made, not where feelings were expressed.

**Veo config:** 30s · 16:9 · 24fps · multi-act camera + two lockbox
actuations + rendered-text composite. If Veo's typography rendering is
weak, render the memo text as a pre-composed HUD card and composite
over the Veo render in post.

**Audio hand-off:**
- VO `elara_beat_f_213_entries` @ ~11s — DONE-S3-VO →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/elara/elara_beat_f_213_entries.mp3`
- Reactive: `cc_beat_f_lock_first_try` (Human, fires on left lockbox
  pulse) →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_f_lock_first_try.mp3`

### §1.F.2 Room art — Briefing Room

**Output:** `apps/client/public/art/rooms/room-briefing-room.png` + `.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-briefing-room_original.png`
**Legacy CDN:** not in `InlineShipMap.tsx` hash list.
**Action:** PNG→WebP, canonical path, upload.

### §1.F.3 VFX — Beat F

| VFX | Status | Notes |
|---|---|---|
| `vfx_lockbox_bio_recognize` | DONE-CODE | `BiometricLock.tsx` handles the left-lockbox pulse. |
| `vfx_data_slate_glow` | DONE-CODE | `DataSlateGlow.tsx` handles the settle after the lockbox opens. |
| `vfx_memo_holo_rise` | MISSING | 3.5s one-shot WebM w/ alpha. **Rendered-text exception — the three bullets must be legible.** |

**MISSING VFX — `vfx_memo_holo_rise` (Veo 3.1, 3.5s, rendered-text allowed):**

**Output:** `apps/client/public/art/vfx/prelude/memo-holo-rise.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, 3.5s.

START FRAME (alpha):
> TRANSPARENT BACKGROUND. The top of a brass lockbox visible at the bottom of the frame, showing its open lid at ~40° angle. A pale cyan `#22d3ee` glow emanates from the lockbox interior. No holographic sheet visible yet. No rendered text.

END FRAME (alpha — RENDERED TEXT IS PERMITTED):
> Same lockbox at the bottom of frame. Above it, floating at eye level, a rectangular holographic sheet, approximately 50cm wide × 70cm tall, rendered in pale cyan `#22d3ee` translucent glow. Three handwritten-calligraphic text bullets are rendered on the sheet in cyan script (rendered text permitted per §11.6):
>
>   • Contingency transfer protocol — see Locke
>   • Archives vault — bridge key pattern
>   • If I am not returning — Quinn
>
> Each bullet starts with a small dot glyph. Handwriting style: flowing, human, anxious. Text is fully legible but rendered with slight wobble like real handwriting. Soft cyan bloom around the whole sheet. Anamorphic flare at each bullet's starting dot. Scanlines visible on the hologram at 3% opacity.

MOTION:
> At t=0s only the lockbox glow. At t=0.2s a small cyan rectangle begins rising vertically out of the lockbox, 50cm wide, initially 5cm tall. It rises at moderate speed, growing in height as it ascends. By t=1.2s it's at eye level and 70cm tall. At t=1.4s a scanline wipe pass sweeps top-to-bottom across the sheet. At t=1.6s the first text bullet writes itself in cyan handwriting over 0.5s. At t=2.1s the second bullet writes (0.5s). At t=2.6s the third bullet writes (0.5s). At t=3.1s all three bullets glow slightly brighter as the sheet settles. At t=3.5s holds on end frame. 24fps. Revelatory, anxious, intimate — these are Kael's last instructions before she left.

### §1.F.4 VO — Beat F

| Line ID | Speaker | Status | URL |
|---|---|---|---|
| `elara_beat_f_213_entries` | Elara | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/elara/elara_beat_f_213_entries.mp3` |
| `cc_beat_f_lock_first_try` | Human (reactive) | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_f_lock_first_try.mp3` |

---

## §1.F.5  Beat F.5 — Empty Chair (90s · longest breath beat in Prelude)

> Bible §12.5 flag: **"the slowest beat in the Prelude. Embrace it."**
> 90 seconds of near-zero camera motion with a single subtle amber
> rim-light rising then falling on the askew chair.

### §1.F.5.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-f5-empty-chair.mp4`
**Duration:** 90s @ 24fps, 16:9
**Status:** MISSING
**Bible:** §12

**Split-render advised.** 90s is at or past Veo 3.1's comfortable
single-clip length. Render as three 30s clips (hold → zoom+rim-build →
VO+fade) and concatenate.

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-f5-empty-chair_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-f5-empty-chair_end.png`

**START FRAME prompt:**
> Medium-close shot of the askew eighth chair in the crew Briefing Room aboard Ark 1047. The chair is pushed back ~40cm from the central command table and angled slightly away. Dark brass leather upholstery, heavy construction, small cyan status indicator at the neck (dark). The other seven chairs are visible in soft focus in the background, tight to the table. The central table occupies the lower third of the frame, its surface dark and inert. The far-wall holographic display is visible in the deep background, powered off. No rim-light yet — the chair is lit only by cyan floor strips and faint cyan table glow. Dust motes in the air. Volumetric fog ankle height. Full color, no flashback treatment. 16:9, 4K, no text.

**END FRAME prompt:**
> Same shot as the mid frame, 30 seconds later. The rim-light has reached full intensity then begun fading back — the end frame shows the rim-light at ~20% intensity, clearly dimmer than the mid frame's 40%. The chair is almost cold again. The room is cold again. The composition is held. The mood is **the light has left, the words have been said, the chair is still the chair**. 16:9, 4K, no text.

**VEO 3.1 motion prompt:**
> Minimal motion across 90 seconds. **Act 1 (0–20s):** held medium-close shot of the askew eighth chair, no camera movement. Dust motes drift in dim cyan light. No audio change. **Act 2 (20–45s):** very slow continuous zoom-in toward the chair — less than 1 degree of FOV change per second, almost imperceptible. Dust motes continue. **Act 3 (45–73s):** zoom halts. Subtle warm-amber `#fbbf24` rim-light begins building along the chair's upper edge and left armrest, over 28 seconds, reaching maximum intensity at 73s. Directional rim-light only — the rest of the room stays cold cyan. No audio change during buildup. **Act 4 (73–87s):** at 73s the `human_beat_f5_empty_chair` VO line begins playing (see §12.5). Camera held, rim-light held at max intensity. At 87s the line ends. **Act 5 (87–90s):** rim-light fades back to zero over 3 seconds. Chair is cold again. Cutscene ends. 24fps. Still, patient, grief-adjacent. This is the slowest beat in the Prelude. Embrace it.

**Veo config:** 90s total (split 30+30+30 if needed) · 16:9 · 24fps ·
static camera with very slow zoom + rim-light ramp.

**Audio hand-off:**
- VO `human_beat_f5_empty_chair` @ 73s — DONE-S3-VO →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/human/human_beat_f5_empty_chair.mp3`

### §1.F.5.2 Room art

Reuses `room-briefing-room.png` from §1.F.2. No new still.

### §1.F.5.3 VFX — Beat F.5

| VFX | Status | Notes |
|---|---|---|
| `vfx_chair_rim_hot_edge` | DONE-CODE | `ChairRimHotEdge.tsx` handles the amber rim-light ramp. |

### §1.F.5.4 VO — Beat F.5

| Line ID | Speaker | Status | URL |
|---|---|---|---|
| `human_beat_f5_empty_chair` | Human | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/human/human_beat_f5_empty_chair.mp3` |

---

## §1.G  Beat G — Medical Bay (25s · wordless)

### §1.G.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-g-medical-bay.mp4`
**Duration:** 25s @ 24fps, 16:9 · wordless
**Status:** MISSING
**Bible:** §13

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-g-medical-bay_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-g-medical-bay_end.png`

**START FRAME prompt:**
> Identical composition to the §13.3 Medical Bay still, framed from just inside the entrance doorway. The central surgical console is in the right-middle ground with the sterile tray of three syringes visible. The four med-pods are on the back wall (the faintly-active fourth pod's cyan glow softly visible). The neural-rig workstation is on the right wall with the hung headset. The locked transfer-array alcove is on the left wall, the amber standby light visible above the hatch. Full color. No camera movement yet — this is the still before the cutscene begins. 16:9, 4K, no text.

**END FRAME prompt:**
> Close shot of the locked transfer-array alcove on the left wall. The heavy armored hatch fills most of the frame, its engraved label visible but unreadable (no rendered text). Above the hatch, the single amber-yellow `#fbbf24` standby indicator is lit steady — the only warm color in the frame. The rest of the Medical Bay is visible in soft peripheral blur: the surgical console behind camera-right, the med-pods in deep background, the neural-rig workstation in the right edge. The amber light is the dominant focal point. The mood: **a locked door that has been waiting for the right person for seventeen thousand years, and the right person has not arrived yet.**

**VEO 3.1 motion prompt:**
> Slow continuous camera work across three acts inside a 25-second runtime. **Act 1 (0–10s):** diagonal dolly from the entrance doorway across the Medical Bay, passing the surgical console on the right and the neural-rig workstation on the left. Dust motes drift. Ambient neural-rig hum + transfer-array standby tone layered at ~55%. **Act 2 (10–17s):** camera slows and holds briefly on the sterile silver tray with the three empty syringes on the surgical console. Scorch arc visible in soft focus. 7 seconds of held shot. No VO. **Act 3 (17–25s):** camera glides left to the transfer-array alcove. At 20s the amber standby light becomes the dominant focal point. Camera holds on the amber light for the final 5 seconds. Fade to black at 25s. 24fps. Clinical, patient, environmental-storytelling tone.

**Veo config:** 25s · 16:9 · 24fps · diagonal dolly + glide-left.

**Audio hand-off:**
- No VO this beat (wordless by design).
- Ambient: **`ambient_neural_rig_hum`** layered at ~55% with
  `ambient_transfer_array_standby`. Both are INTERMEDIATE WAVs — see
  §11 Processing Pipeline for MP3 conversion + loudnorm (target:
  -19 LUFS neural-rig, -20 LUFS transfer-array).

### §1.G.2 Room art — Medical Bay

**Output:** `apps/client/public/art/rooms/room-medical-bay.png` + `.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-medical-bay_original.png`
**Legacy CDN:** `https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/medical-bay_f5c9cffe.png` (`DONE-CDN-LEGACY`)
**Also on legacy CDN (state-aware variants, 4 frames)** — see
`docs/production/ASSET_URLS.md` Medical Bay Section F:
`/art/rooms/mystery-states/medical-bay_{initial,device-awakened,donated,refused}.webp`
**Action:** PNG→WebP, canonical path, upload. Mystery-state variants
are already co-located on the legacy CDN — no re-render needed, just
confirm they're mirrored to the primary CDN.

### §1.G.3 VFX — Beat G

| VFX | Status | Notes |
|---|---|---|
| `vfx_med_pod_faint_pulse` | DONE-CODE | CSS `@keyframes` on fourth-pod sprite. |
| `vfx_neural_rig_idle_hum_visual` | DONE-CODE | `CyanPulse.tsx` handles the soft cyan indicator pulse. |
| `vfx_transfer_array_amber_standby` | DONE-CODE | `AmberGlow.tsx` handles the amber standby — steady, not pulsing. |

### §1.G.4 VO — Beat G

None. Wordless beat by bible design.

### §1.G.5 Audio — ambient bed

| Bed | Status | Source | Target LUFS | Canonical path |
|---|---|---|---|---|
| `ambient_neural_rig_hum` | INTERMEDIATE | `assets/intermediate/prelude/audio/ambient_neural_rig_hum.wav` | -19 LUFS | `apps/client/public/audio/ambient/prelude/ambient_neural_rig_hum.mp3` |
| `ambient_transfer_array_standby` | INTERMEDIATE | `assets/intermediate/prelude/audio/ambient_transfer_array_standby.wav` | -20 LUFS | `apps/client/public/audio/ambient/prelude/ambient_transfer_array_standby.mp3` |

**Processing:** see §11.

---

## §1.H  Beat H — Comms Array / Locke's First Message (25s)

### §1.H.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-h-comms-array.mp4`
**Duration:** 25s @ 24fps, 16:9
**Status:** MISSING
**Bible:** §14

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-h-comms-array_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-h-comms-array_end.png`

**START FRAME prompt:**
> Identical composition to the §14.3 Comms Array still, framed from just inside the entrance doorway. The central console dominates the middle-ground with its idle holographic field showing the cyan envelope glyph and the amber "1" counter floating above. Elara's translucent cyan hologram stands beside the console on the left side of frame, facing the console with her back three-quarters turned to the camera — she is waiting, not guiding. The signal intake matrix fills the back wall. The archival cart is in the right foreground. Full color, no text rendered. 16:9, 4K.

**END FRAME prompt:**
> Close-up three-quarter view of the message reader UI, the full Locke message body now fully rendered and held. The header strip shows "LOCKE" + glyph-timestamp, the separator line, and the full message body below. The final clause of the message is **highlighted subtly** — the last sentence has a slightly brighter cyan glow than the rest of the text, suggesting it has just been read/spoken. Elara's hologram is visible on the far left edge of frame, silent. The camera has tightened very slightly on the reader — less than 3% scale change from the mid frame. 16:9, 4K, message text rendered fully legibly.

**VEO 3.1 motion prompt:**
> Slow continuous camera work across four acts inside a 25-second runtime. **Act 1 (0–5s):** forward dolly from entrance doorway into the Comms Array, standing eye level. Elara's hologram is already standing beside the central console on the left, silent. The amber "1" counter above the holographic field is the visual focal point. **Act 2 (5–9s):** camera glides to three-quarter front view of the console. Holographic field expands from idle size (60cm) to reader size (90cm × 120cm) over 2 seconds. The envelope glyph unfolds into a full message reader UI pattern with the sender name "LOCKE" rendering legibly in the header strip. **Act 3 (9–24s):** at 9s the message body text renders all at once as a legible block. At 10s the `locke_beat_h_first_message` VO begins playing. Camera holds on the message reader for 14 seconds, giving the player time to both read the body and hear it spoken. **Act 4 (24–25s):** at 22s (during the VO's final clause) the camera tightens less than 3% scale on the message text, and the last sentence's cyan glow brightens subtly. At 24s the line ends. At 25s fade to black. 24fps. Businesslike, warm-on-the-surface, with one beat of subtle edge at the end.

**Veo config:** 25s · 16:9 · 24fps · dolly + tight-in. The Locke message
text is the de-facto third rendered-text exception — if Veo cannot
render the message body legibly, produce the text as a pre-composed HUD
card and composite over the render in post (same approach as Beat F's
memo display).

**Audio hand-off:**
- VO `locke_beat_h_first_message` @ ~10s — DONE-S3-VO →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/locke/locke_beat_h_first_message.mp3`
- Reactive: `cc_beat_h_inbox_first_open` (Human) →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_h_inbox_first_open.mp3`

### §1.H.2 Room art — Comms Array

**Output:** `apps/client/public/art/rooms/room-comms-array.png` + `.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-comms-array_original.png`
**Legacy CDN:** `https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/comms-array_cd8062dd.png` (`DONE-CDN-LEGACY`)
**Action:** PNG→WebP, canonical path, upload.

### §1.H.3 VFX — Beat H

| VFX | Status | Notes |
|---|---|---|
| `vfx_signal_intake_lit_panel` | DONE-CODE | CSS on the matrix panel sprites. |
| `vfx_inbox_envelope_unfold` | DONE-CODE | `InboxEnvelopeUnfold.tsx` |
| `vfx_inbox_edge_sentence_bloom` | DONE-CODE | `InboxSentenceBloom.tsx` handles the final-clause brighten. |
| `vfx_amber_counter_glyph` | DONE-CODE | `AmberCounterGlyph.tsx` |

### §1.H.4 VO — Beat H

| Line ID | Speaker | Status | URL |
|---|---|---|---|
| `locke_beat_h_first_message` | Locke | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/locke/locke_beat_h_first_message.mp3` |
| `cc_beat_h_inbox_first_open` | Human (reactive) | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_h_inbox_first_open.mp3` |

---

## §1.H.5  Beat H.5 — Memo Pile (20s · wordless breath beat)

### §1.H.5.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-h5-memo-pile.mp4`
**Duration:** 20s @ 24fps, 16:9 · wordless
**Status:** MISSING
**Bible:** §15

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-h5-memo-pile_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-h5-memo-pile_end.png`

**START FRAME prompt:**
> Interior of the Comms Array aboard Ark 1047, three-quarter view of the central console with the wheeled archival cart visible in the right foreground. Full cold-cyan palette. Elara's hologram is still present beside the console at the start of her fade, semi-translucent cyan scanlines, silent and nearly finished with the scene. The holographic message reader has already collapsed back toward its idle envelope-glyph state, with the amber counter slightly dimmer than Beat H. Six lit signal-intake panels glow on the back wall. The archival cart shows three shelves of memo slates, two faintly glowing cyan. Dust motes drift in thin cyan light. No rendered text except the abstract unreadable envelope-glyph suggestion. Cinematic 16:9, 4K, standing eye level, calm transitional framing.

**END FRAME prompt:**
> Close three-quarter view of the wheeled archival cart in the Comms Array, focused on the floor beside the cart's lower-right wheel. A single postcard-sized paper memo has come to rest on the floor, slightly yellowed with age, face blank with no legible text or glyphs. Two memo slates on the cart remain faintly glowing cyan on the middle and bottom shelves. Elara's hologram is gone. The central console is now peripheral and softly out of focus. Cyan emergency strips and the room's dim signal-panel light bathe the scene in cold archive light. Dust motes drift around the settled paper. Cinematic 16:9, 4K, quiet held composition, no rendered text.

**VEO 3.1 motion prompt:**
> Continuous camera work across three acts inside a 20-second runtime. **Act 1 (0–8s):** Elara's hologram fades from full opacity to zero over 2 seconds beside the central console. The Inbox UI on the holographic field shrinks back to its idle envelope-glyph state and the amber counter dims slightly. Camera begins a slow glide from the central console toward the wheeled archival cart in the right foreground. **Act 2 (8–14s):** camera arrives at the cart. The two faintly glowing memo slates on the middle and bottom shelves are visible. A single loose postcard-sized paper memo, slightly yellowed with age, begins drifting from the top shelf toward the floor over roughly 5 seconds in barely-moving ventilation air. No other motion. **Act 3 (14–20s):** the memo comes to rest beside the cart's lower-right wheel. Camera holds on the settled memo for the final 6 seconds as dust motes drift in cyan light, then fades to black. 24fps. Quiet, decompressive, archive-breath tone.

**Veo config:** 20s · 16:9 · 24fps · slow glide + drifting paper.

**Audio hand-off:** wordless. Ambient Comms Array wash continues.

### §1.H.5.2 Room art

Reuses `room-comms-array.png` from §1.H.2. No new still.

### §1.H.5.3 VFX — Beat H.5

| VFX | Status | Notes |
|---|---|---|
| `vfx_memo_paper_drift` | MISSING | 5s one-shot, per prompt below. |
| `vfx_elara_fade_out` | DONE-CODE | `ElaraFadeOut.tsx` handles the 2s fade. |

**MISSING VFX — `vfx_memo_paper_drift` (Veo 3.1, 5s one-shot):**

**Output:** `apps/client/public/art/vfx/prelude/memo-paper-drift.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, 5s.

START FRAME (alpha):
> TRANSPARENT BACKGROUND. A single postcard-sized piece of paper (15cm × 10cm) at the TOP of the frame, tilted at ~15° with its top edge just leaving a shelf. The paper has faint handwritten marks on it but no legible text. Paper color is faded cream `#fef3c7` with soft shadow. No shelf or ship interior visible — only the paper. Background fully transparent.

END FRAME (alpha):
> Same paper at the BOTTOM of the frame, now resting flat on an invisible floor surface. The paper has rotated ~120° total during its descent (now tilted differently). No shelf visible. The paper is the only rendered element.

MOTION:
> At t=0s paper is at top-left area, tilted 15° (start frame). The paper slides off the shelf edge and begins falling. Physics: gravity (slow — this is in space, with only minimal ventilation airflow), slight horizontal drift (paper moves ~80px to the right over the descent), and rotation (paper tumbles gently, completing ~120° rotation total over the 5s descent). Motion curve: NOT a simple free-fall — the paper catches air, flutters, slows mid-descent at t=2s, drifts horizontally, then resumes falling. By t=4.7s the paper is just above the floor position. At t=4.8s soft touchdown, paper comes to rest at bottom of frame. At t=5.0s holds on end frame. 24fps. Quiet, melancholy, patient — like a leaf falling through still air. This paper has been on that shelf for 17,000 years.

### §1.H.5.4 VO — Beat H.5

None. Wordless breath beat.

---

## §1.I  Beat I — Bridge / Witnessing Hub Activate (40s · wordless · biggest visual transformation)

> Bible §16.6 flag: "the biggest visual transformation in the Prelude."
> Palette swings from full cold-cyan to full warm sodium-gold over
> Acts 3–5 as the primary lights restore.

### §1.I.1 Cutscene — Veo 3.1

**Output:** `apps/client/public/videos/prelude/prelude-beat-i-bridge-witnessing-activate.mp4`
**Duration:** 40s @ 24fps, 16:9 · wordless · contains HOLD-FOR-INPUT beat
**Status:** MISSING
**Bible:** §16

Note: Veo 3.1 cannot render an indefinite "hold for player input" beat.
Render the cutscene as two segments: **segment A** = pre-input (0–16s,
ends on UI prompt fully faded up and Hub central well pulsing ready);
**segment B** = post-input (16s→40s, begins on Hub hemisphere flare,
through sodium-gold cascade, through held warmth, to dim-back fade).
Runtime concatenates A → player input → B.

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-i-bridge-witnessing-activate_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-i-bridge-witnessing-activate_end.png`
- Mid PNG (pre-input hold): render at `assets/intermediate/prelude/cutscenes/prelude-beat-i_mid.png` — Hub central well pulsing, "PRESS TO ACTIVATE" prompt faded up, Elara right hand raised.

**START FRAME prompt:**
> Cinematic still of the Bridge aboard Ark 1047, framed from the rear of the command crescent looking forward toward the panoramic viewport. Full cold-cyan palette consistent with every prior Prelude room: cyan floor strips, dormant cyan duty-station pips, dim cyan emergency lighting, and the faint cold light from the polarized panoramic viewport showing the debris graveyard in silhouette. The Witnessing Hub dominates the rear wall behind camera — its circular brass-and-cyan surface visible in the peripheral/background of the composition, central well dark, twelve radial spokes dark. The five duty stations of the command crescent are visible in the middle-ground (captain's chair centered, four flanking officer stations), all dark. Full color, no warm lights anywhere in frame. 16:9, 4K, no text.

**END FRAME prompt:**
> Full warm-sodium-gold Bridge. All five duty stations lit with amber-gold console illumination. Captain's chair armrests glowing. Panoramic viewport's polarization partially lifted, admitting more starlight from the debris graveyard outside. Witnessing Hub at rear wall fully active with cyan-white hemisphere. Elara's hologram still visible beside the Hub, hand lowered, silent. Dust motes drifting in warm gold light throughout. Anamorphic lens flares on the captain's chair, the brightest duty station, and the Hub's hemisphere. The Bridge is *alive*. This is the only frame in the Prelude where the Ark looks like the ship it used to be. 16:9, 4K, no text.

**VEO 3.1 motion prompt (full 40s; split as noted above):**
> Continuous camera work across six acts inside a 40-second runtime. **Act 1 (0–8s):** camera rises from below (suggesting ascent from the Comms Array exit hatch to the Bridge level), arriving at the rear of the command crescent, facing forward. Full cold cyan palette. Witnessing Hub dormant in peripheral view. **Act 2 (8–16s):** camera glides toward the Witnessing Hub on the rear wall. Elara's hologram materializes beside the Hub's central well at 10s. At 12s Elara raises her right hand in a slow offering gesture. At 14s UI "PRESS TO ACTIVATE" prompt fades up. At 16s cutscene HOLDS for player input (indefinite — does not auto-advance). **Act 3 (16–22s):** on input, Hub's central well flares bright. Hemispheric cyan-white bloom rises over 3 seconds to ~1.5m height. Twelve radial spokes light sequentially clockwise from 12 o'clock over 3 seconds. At 22s hemisphere at max intensity. **Act 4 (22–30s):** primary-light-restoration cascade begins. Wave of warm sodium-gold `#fde68a` light travels forward from the Hub toward the viewport over 4 seconds. Each duty station lights as the wave passes. Captain's chair lights at 26s. Viewport reached at 28s, polarization lifts partially. At 30s the Bridge is fully lit warm sodium-gold. **Act 5 (30–38s):** slow camera pan across the warmly-lit Bridge showing duty stations, captain's chair, viewport, and the still-active Hub. 8 seconds of held warmth. Ambient audio bed shifts to powered-systems mix. **Act 6 (38–40s):** primary lights dim back to cold cyan over 2 seconds. Witnessing Hub hemisphere remains active. Fade to black at 40s. 24fps. Reverent, awe-tinted, the biggest visual transformation in the Prelude.

**Veo config:** split into 16s (segment A) + 24s (segment B). 16:9 ·
24fps · camera rise → glide → flare → sodium-gold cascade → held
warmth → dim back.

**Audio hand-off:**
- No VO this beat (wordless).
- Reactive: `cc_beat_i_prep_human` (Human reactive, fires just before
  hemisphere flare) →
  `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_i_prep_human.mp3`
- Ambient bed: at 30s (sodium-gold fully on), shift to
  `ambient_bridge_powered_systems_mix`. INTERMEDIATE WAV — see §11.
  Target -18 LUFS.

### §1.I.2 Room art — Bridge

**Output:** `apps/client/public/art/rooms/room-bridge.png` + `.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-bridge_original.png`
**Legacy CDN:** `https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/bridge_5da73f83.png` (`DONE-CDN-LEGACY`)
**Also:** `apps/client/src/components/ResponsiveImage.tsx:16` references the local path `src="/art/rooms/room-bridge.png"` directly — this hard-coded path MUST be satisfied for the bridge component to render correctly.
**Action:** PNG→WebP, canonical path, upload. Validate that `preludeReadiness.test.ts`'s bridge-existence assertion passes.

### §1.I.3 VFX — Beat I

| VFX | Status | Notes |
|---|---|---|
| `vfx_witnessing_hub_hemisphere_bloom` | DONE-CODE | `WitnessingHubBloom.tsx` |
| `vfx_primary_lights_cascade` | DONE-CODE | `PrimaryLightsCascade.tsx` |
| `vfx_viewport_polarization_lift` | DONE-CODE | `ViewportPolarization.tsx` |

### §1.I.4 VO — Beat I

None. Wordless beat.

### §1.I.5 Audio — ambient bed

| Bed | Status | Source | Target LUFS | Canonical path |
|---|---|---|---|---|
| `ambient_bridge_powered_systems_mix` | INTERMEDIATE | `assets/intermediate/prelude/audio/ambient_bridge_powered_systems_mix.wav` | -18 LUFS | `apps/client/public/audio/ambient/prelude/ambient_bridge_powered_systems_mix.mp3` |

---

## §1.J  Beat J — Archives + Two Witnesses Meet Part 1 (~8m10s)

> **The Prelude's longest single beat.** Contains the full ~6m40s Log 5
> playback (sepia Prince hologram inside the pedestal well), one full
> second of absolute silence, and the *Last Words* intro + first chorus.
> Ends on a Light/Dark choice pillar held indefinitely for player input.

### §1.J.1 Cutscene — Veo 3.1 (split-render required)

**Output:** `apps/client/public/videos/prelude/prelude-beat-j-archives.mp4`
**Target total duration:** 490_000 ms ≈ 8m10s @ 24fps, 16:9
**Status:** MISSING — 1 partial arrival clip already sitting in
`assets/intermediate/prelude/cutscenes/prelude-beat-j-archives-arrival-clip.mp4`
(Acts 1–2 only, ~30s). Use it as the first chunk; render the rest.
**Bible:** §17

**CRITICAL PRODUCTION NOTE.** Veo 3.1 is not designed for single 8-minute
renders. Split the beat into discrete Veo clips and concatenate with
`ffmpeg`. Recommended split (10 clips total):

| # | Act | Window | Content | Clip duration |
|---|---|---|---|---|
| 1 | Act 1 | 0:00–0:15 | Entry + establishing; Enigma waiting | 15s |
| 2 | Act 2 | 0:15–0:30 | Antiquarian enters; `antiq_fc_1`; Enigma nod | 15s |
| 3 | Act 3 | 0:30–0:34 | Log 5 crystal flare → beam transfer → Prince holo materializes (sepia) | 4s |
| 4 | Acts 4–5 | 0:34–2:00 | Log 5 Movements 1–2 — locked medium hold | 86s — split into 2×43s if needed |
| 5 | Acts 6–7 | 2:00–5:00 | Log 5 Movements 3–4 — Antiquarian glance beat; Enigma hand-on-rim | 180s — split into 6×30s |
| 6 | Act 8 | 5:00–7:14 | Log 5 Movement 5 + Protocols preflight | 134s — split into 5×≈27s |
| 7 | Act 9 | 7:14–7:15 | Hard cut → Prince freeze → 1s absolute silence | 1s |
| 8 | Act 10 | 7:15–8:05 | *Last Words* enters; Prince thaws; camera pull-back; warm-amber halo builds | 50s |
| 9 | Act 10→11 | 7:58–8:05 | First chorus line triggers Light/Dark choice pillar fade-up | overlapped inside clip 8 |
| 10 | Act 11 | 8:05 → player input | Held choice pillar; on resolution, chosen half brightens, other dims 2s, fade to black 8s with `Last Words` continuing over black | ≤indef |

The 6m40s Log 5 core (clips 3–6) is the hardest to render because
Veo has to hold a locked framing with minor contained-volume effects
for long stretches. Consider compositing the sepia Prince hologram
inside the pedestal well separately (static sepia still + sepia-drain
+ film-damage overlays from §1.E.3) and keying it over a Veo-rendered
Archives hold shot.

**Dependencies:**
- Start PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-j-archives-two-witnesses_start.png`
- End PNG: `assets/intermediate/prelude/cutscenes/prelude-beat-j-archives-two-witnesses_end.png`
- Multiple inter-act keyframes per clip above — render as needed.

**START FRAME prompt:**
> Cinematic still of the Archives aboard Ark 1047, framed from just inside the entrance doorway. Full cold-cyan palette. The central pedestal with its inactive holo-projection well occupies the middle of the frame. The twelve archive plinths curve around the background; the Log 5 crystal on the far wall is visibly brighter than the other eleven, pulsing subtly. **The Enigma is visible** standing in the eleven-o'clock position relative to the pedestal, three-quarters back view to camera — render her as a woman in a dark traveling coat, a deep-purple scarf that catches the cyan light with a slight violet edge-glow, her hair pulled back, her hands clasped in front of her at waist level, her gaze fixed on the central pedestal. She is silent, still, and clearly *waiting*. The Antiquarian is NOT yet in frame (he enters in Act 2). The etched gold star-chart on the domed ceiling is visible but subtle. Through the entrance doorway (partially visible behind the camera's side), the distant amber transfer-array standby light from Beat G is a small warm point at the right edge of frame. 16:9, 4K, no text.

**END FRAME prompt:**
> Wide shot of the Archives with the **Light/Dark choice UI visible center-screen**. The UI is a vertical pale pillar approximately 2 meters tall, floating at standing eye level centered between the camera and the pedestal. The pillar is split vertically down its center line: the **left half is soft-gold `#fde68a`** (Light), the **right half is deep-violet `#1e1b4b`** (Dark). No text labels, no icons, no prompts. The Antiquarian is visible on the right side of the composition, the Enigma on the left, both watching the player, both silent. The central pedestal is still in frame behind the choice pillar, the Prince hologram is still gently glowing in real-color inside the well. Around the peripheral edges of the frame, the warm-amber halo from Act 10's buildup has reached full intensity — the Archives is held in a soft amber peripheral glow that does not touch the center of the frame (where the choice UI is) but frames the composition. *Last Words* is canonically audible (the first chorus line *"Freedom of thought is worth dying for"* has just been sung as the choice UI appeared). 16:9, 4K, no text on the choice UI, no text anywhere.

**VEO 3.1 motion prompt (full — annotate per-clip when rendering):**
> Continuous camera work across 11 acts and one indefinite choice-hold inside an ~8m10s runtime plus player-choice delay. **Act 1 (0:00–0:15):** camera rises from floor level at the Archives doorway and glides into the circular domed room, establishing the central pedestal, twelve archive plinths, the brighter Log 5 crystal on the far wall, and the Enigma already waiting at the eleven-o'clock position. Full cold-cyan palette. **Act 2 (0:15–0:30):** camera holds while the Antiquarian enters from behind the camera, crosses to the four-o'clock position opposite the Enigma, and delivers `antiq_fc_1`; at 0:27 he looks toward the Enigma and she nods once. **Act 3 (0:30–0:34):** the Log 5 crystal flares, a cyan beam traces to the pedestal well, and the small sepia Prince hologram materializes with sepia-drain and film-damage scoped only to the well volume. **Acts 4–8 (0:34–7:14):** Log 5's five movements play in full while the camera holds on a locked medium shot of the pedestal with both Witnesses flanking it. No cuts, pans, or zooms. The only room-scale motion is a brief Antiquarian glance toward the distant amber transfer-array light during Movement 3 and the Enigma raising her left hand to rest on the rim of the well during Movement 4. The contained Prince hologram scene changes between movements: Vortex console, engineering bench, galley counter, Kael farewell, Protocols preflight. **Act 9 (7:14–7:15):** Log 5 hard-cuts mid-syllable on "Back to the —"; the sepia Prince hologram freezes; one full second of absolute silence; no motion. **Act 10 (7:15–8:05):** `Last Words` enters. Over 4 seconds the Prince hologram thaws from sepia into real color, the Antiquarian takes one small step back, the Enigma lowers her hand, and the camera begins a very slow pull-back over the next 30 seconds while a warm-amber halo builds around the frame periphery. At 7:55 the first chorus begins; at approximately 7:58 the line "Freedom of thought is worth dying for" triggers the Light/Dark choice pillar to fade up. **Act 11 (8:05 → player resolution):** hold on the wordless gold/violet split choice pillar while music and visuals continue. On player input, the chosen half brightens, the other half dims, hold 2 seconds, then fade to black while `Last Words` continues for roughly 8 more seconds over black. 24fps. Reverent, grief-loaded, no extra camera movement beyond the specified holds and pull-back.

**Veo config per clip:** 16:9 · 24fps · each clip locked-framing for the
Log 5 body; start/end keyframes explicitly set for Acts 3, 9, 10, 11
transitions. Clip 10 (Act 11) renders up to first ~10s of the held
pillar; the runtime `Act1CycleCAuthorityWitnessing` component logic
handles the indefinite hold and resolution fade.

**Canon hygiene:**
- The Antiquarian's face may be rendered.
- The Enigma's face may be rendered (she is not Vex Solene).
- The Prince hologram is sepia-toned until Act 10's thaw, then real
  color.
- No visible Engineer, no Human, no Oracle, no Authority in this beat.

### §1.J.2 Room art — Archives

**Output:** `apps/client/public/art/rooms/room-archives.png` + `.webp`
**Status:** INTERMEDIATE — `assets/intermediate/prelude/rooms/room-archives_original.png`
**Legacy CDN:** `https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/archives_cb00ab0a.png` (`DONE-CDN-LEGACY`)
**Action:** PNG→WebP, canonical path, upload. The Archives still is
reused by `Act1CardLadderPage`, `Act6CardLadderPage`, and
`WitnessingHubPage` via `assetUrl("art/rooms/room-archives.png")` —
priority to get this file at the canonical path.

---

### §1.J.3 VFX — Beat J

Beat J is VFX-heavy: 9 effects, mostly new renders or shared with other
beats.

| VFX | Status | Notes |
|---|---|---|
| `vfx_sepia_drain` | INTERMEDIATE | Reused from Beat E. `assets/intermediate/prelude/vfx/sepia-drain.mp4` → WebM. |
| `vfx_film_damage_overlay` | INTERMEDIATE | Reused from Beat E. `assets/intermediate/prelude/vfx/film-damage-overlay.mp4` → WebM. |
| `vfx_transfer_array_amber_standby` | DONE-CODE | Reused from Beat G. `AmberGlow.tsx` handles the distant amber point through the doorway. |
| `vfx_log5_beam_transfer` | MISSING | 3s one-shot, per prompt below. |
| `vfx_holo_pedestal_bloom` | MISSING | **3 deliverables** (activation 3s + steady-state 8s loop + base 3s) per prompt below. |
| `vfx_memory_crystal_pulse` | DONE-CODE | `MemoryCrystalPulse.tsx` handles the twelve-crystal breath on the curved walls. |
| `vfx_enigma_hand_on_rim` | MISSING | 2s subtle one-shot, per prompt below. |
| `vfx_peripheral_warm_halo` | DONE-CODE | `PeripheralWarmHalo.tsx` handles the Act 10 amber halo buildup. |
| `vfx_choice_pillar_light_dark_split` | DONE-CODE | `ChoicePillarLightDark.tsx` handles the Act 11 pillar + resolution. |

**MISSING VFX — `vfx_log5_beam_transfer` (Veo 3.1, 3s one-shot):**

**Output:** `apps/client/public/art/vfx/prelude/log5-beam-transfer.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, 3s.

START FRAME (alpha):
> TRANSPARENT BACKGROUND. A bright cyan `#22d3ee` crystalline point at the left side of frame (representing the Log 5 memory-crystal in its dormant position). Size: 3cm diameter. Bright anamorphic flare. On the right side of frame, a darker cyan point representing the central pedestal's projection well, ~6cm diameter but dim (pre-activation). No beam between them yet. No rendered text. No room interior visible.

END FRAME (alpha):
> Same two cyan points, but now connected by a CURVED cyan `#22d3ee` beam that arcs upward between them (curving over the top ~20% of the frame like a rainbow arc — the bible notes this path curves around the domed ceiling's star-chart). The beam is 8-12px wide, with soft outer bloom extending 30px. Core brightness: brilliant cyan-white `#e0f2fe`. Edge fade: soft gradient to transparent. Both endpoints are now brighter than start — the crystal is slightly dimmed (having transferred) and the pedestal well is now brightly glowing. Anamorphic horizontal flare across the whole beam.

MOTION:
> At t=0s both endpoints dim (start frame). At t=0.2s the left crystal flares brilliantly. At t=0.4s a cyan particle beam emerges from the crystal and begins tracing along the curved bezier path toward the pedestal. The beam head is a bright moving point (like a comet) that leaves a glowing trail behind it. At t=1.6s the beam head reaches the pedestal well — impact bloom. At t=1.8s the trail (full beam) is visible along the entire bezier arc at peak brightness. At t=2.3s the pedestal well brightens significantly as the transfer completes. At t=2.8s the beam begins to softly fade along the trail, but the pedestal well remains bright. At t=3.0s holds on end frame with beam visible but dimmer than peak. 24fps. Majestic, ceremonial, the moment of truth — Log 5 is being played.

**MISSING VFX — `vfx_holo_pedestal_bloom` (3 deliverables):**

**Output files:**
1. `apps/client/public/art/vfx/prelude/holo-pedestal-bloom.webm` (base — 3s one-shot)
2. `apps/client/public/art/vfx/prelude/holo-pedestal-bloom-activation.webm` (3s)
3. `apps/client/public/art/vfx/prelude/holo-pedestal-bloom-steady_state.webm` (8s seamless loop)

**All format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio.

**Part 1 — `holo-pedestal-bloom-activation.webm` (3s one-shot):**

START FRAME: TRANSPARENT BACKGROUND. Centered: a dark cylindrical pedestal projection well at the bottom of frame, ~80cm diameter, dim. The well's rim has a faint cyan `#22d3ee` pilot glow. Nothing above the well. No text.

END FRAME: Same pedestal with BRIGHT cyan rim-glow. Above the well, a volumetric cyan bloom rises to ~30cm height — a soft column of cyan light with a faint cylindrical shape suggesting a hologram is about to appear. The bloom is translucent, its brightness fading to ~40% at the top. Anamorphic lens flare across the brightest rim.

MOTION: At t=0s dim pedestal. At t=0.3s cyan rim flashes brighter. At t=0.6s a bloom column begins rising out of the well, growing in height over 1.5s. At t=2.1s it reaches full 30cm height. At t=2.5s the bloom settles into its steady shape. At t=3.0s holds on end frame. 24fps. Sacred activation moment.

**Part 2 — `holo-pedestal-bloom-steady_state.webm` (8s seamless loop):**

START FRAME = END FRAME of activation (pedestal with bright rim + 30cm bloom column).
END FRAME = IDENTICAL to start (seamless loop).
MOTION: The bloom column breathes subtly — sub-0.5Hz alpha oscillation between 80% and 100% opacity. Rim glow matches the pulse. Dust-like motes inside the bloom drift gently upward. At t=8s the system has returned to the exact starting configuration.

**Part 3 — `holo-pedestal-bloom.webm` (base):** identical to Part 1 (activation). Runtime plays this file when the variant system is disabled.

**MISSING VFX — `vfx_enigma_hand_on_rim` (Veo 3.1, 2s subtle):**

> Bible §17.6 flag: **"SUBTLE — the player should register that she
> touched the rim, not that something magical happened."** Do NOT
> over-design.

**Output:** `apps/client/public/art/vfx/prelude/enigma-hand-on-rim.webm`
**Format:** 1920×1080, VP9 WebM, alpha channel, 24fps, no audio, 2s.

START FRAME (alpha):
> TRANSPARENT BACKGROUND. A small localized cyan `#22d3ee` edge glow at the lower-left of frame, approximately 4cm × 3cm, representing where a hand rests on a pedestal rim. Glow is at 15% opacity. Very soft, barely noticeable. No hand or rim rendered — just the glow region.

END FRAME (alpha):
> Same glow region, now at 45% opacity — still subtle, but the player can see it. Cyan `#22d3ee` with the brightest intensity along a curved edge (following the rim shape). Soft bloom extends 15cm outward at 10% opacity. Anamorphic flare is minimal — this is an environmental ambient lighting cue, not a dramatic special effect.

MOTION:
> At t=0s 15% opacity glow (start). The glow intensifies smoothly from 15% to 45% over 1.8s in a single linear curve. The bloom halo grows outward in proportion. At t=2.0s holds on end frame. 24fps. VERY subtle. No flashes, no bursts. This should register subliminally — the player should feel the Enigma's presence more than see it.

### §1.J.4 VO — Beat J

| Line ID | Speaker | Status | URL |
|---|---|---|---|
| `antiq_fc_1` | Antiquarian | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/antiquarian/antiq_fc_1.mp3` |
| `cc_beat_j_tease_start` | Human (reactive) | DONE-S3-VO | `https://dgrsvoices.s3.us-east-2.amazonaws.com/Human+Voices/reactive/cc_beat_j_tease_start.mp3` |

**Log 5 playback (Movements 1–5):** the Prince's ~6m40s Log 5 recording
is a separate long-form VO asset. **Status to confirm** — Log 5 is not
in the standard prelude-beat VO list above; it's owned by the
canon-expansion pipeline (see `CANON_REV_7_ORACLE_VEX_EXPANSION.md`).
If not yet recorded, it's a new long-form ElevenLabs render against the
Prince voice profile, with per-movement scripts sourced from the Log 5
script doc (not in `apps/shared/*VoManifest.json`).

### §1.J.5 Song — *Last Words* (prelude cut)

**Output:** `apps/client/public/audio/music/song_last_words_prelude_cut.mp3`
**Status:** MISSING (or owned by canon-expansion pipeline — status TBD)
**Canon:** `CANON_REV_7_ORACLE_VEX_EXPANSION.md §5.6.9`
**Lyrics anchor:** first chorus line "Freedom of thought is worth dying for" triggers the Light/Dark choice UI at ~7:58 inside Beat J.

Also used by Act 1 Cycle C finale `Act1CycleCAuthorityWitnessing.tsx`
(§2.C.fin below) — same file, shared audio.

---

# PART 2 — ACT 1 (3 cycles + finale)

Act 1 is structured as three **Cycles** (A / B / C) of ~3–5 matches each,
each cycle ending in a **finale cutscene**. Unlike the Prelude, Act 1
has a **small** set of Veo-eligible cutscenes — only the three cycle
finales. Per-battle intros use static matchup-card portraits, not
motion clips. The Authority tribunal (§18) uses the
`Act1CycleCAuthorityWitnessing.tsx` slideshow wiring (already shipped,
PR #89) driven by the *Last Words* song + prelude last-words slide
WebPs — NOT a Veo render.

### §2.pre  Cycle palettes (authoritative)

| Cycle | Dominant | Accent | Warm source | Forbidden |
|---|---|---|---|---|
| A — Kindergarten of Gods / Celebration | `#d9a66a` honey gold | `#c98b8b` dusty rose | Actual sun through schoolroom windows | Cyan, deep space black, emergency lighting |
| B — Mechronis Academy | `#4ba3b5` cool teal | `#b8752d` brass | ONE reflected sun-shaft | Ember orange, dust brown |
| C — Nexon / Zenon / Authority | `#6b5a48` dust brown · `#55606e` institutional grey · `#1c1a1a` black marble | `#e06a1a` ember | Distant fires only | Warm sun, honey, dusty rose |

---

## §2.A  Cycle A — Kindergarten of Gods

Celebration school year, §§3–6 of `ACT_1_SHIP_READY_BIBLE.md`. Three
opponent matches (Minnie, Corey, Kanshi), one cycle-finale cutscene.

### §2.A.1 Room — Kindergarten

**Output:** `apps/client/public/art/rooms/room-kindergarten.png` + `.webp`
**Status:** MISSING — not in `assets/intermediate/`, not on any CDN, not wired.
**Aspect / res:** 16:9 / 1920×1080
**Palette:** `#d9a66a #f5d98a #c98b8b #c66b3d #55606e`
**Source prompt:** `docs/production/act1-asset-build/prompts/rooms/room-kindergarten.txt`

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. A small schoolroom in a turn-of-century village schoolhouse. Warm honey-oak floorboards, worn smooth at the walking line. Center of frame: a single low wooden card-table approximately child-height, flanked by four child-sized wooden chairs, the table surface a polished honey-oak with a faint chalk-smudge across one edge. Screen-left, a dark slate blackboard on a freestanding wooden frame, ghost marks of a thousand lessons erased. Screen-right, a panelled window-wall runs floor-to-ceiling with mullioned glass panes catching direct warm-yellow afternoon sunlight at a low angle, casting ten golden parallelograms across the floor and the card-table's surface. Motes of dust drift in the light beams. Low exposed wood-beam ceiling, no artificial light — only window sun lights the room. A small woven rug in dusty rose near the slate. No children visible. Palette: warm honey `#d9a66a`, sunlight yellow `#f5d98a`, dusty rose `#c98b8b`, terracotta `#c66b3d`, slate grey `#55606e`. Deliberately no cyan, no deep space black, no emergency lighting — this room is lit by an actual sun. Soft diffused light, shallow depth of field on the card-table's center. Soft film grain. Gentle anamorphic glow on the sun-panels. Cinematic 4K composition, three-quarter wide, camera at child-eye level looking slightly up at the card-table.

### §2.A.2 Battlefield backdrops — Cycle A

Per `docs/production/act1-asset-build/manifests/act1_art_prompts__battlefield.csv`,
Cycle A has three time-of-day variants of the Celebration schoolyard
used as post-match slideshow backdrops (NOT alternative room stills):

| Asset ID | Output | Time of day | Status | Source |
|---|---|---|---|---|
| `bf_celebration_schoolyard_day10` | `apps/client/public/art/backdrops/act1/bf-celebration-schoolyard-day10.png` | Day 10 warm afternoon | MISSING | CSV row |
| `bf_celebration_schoolyard_day20` | `apps/client/public/art/backdrops/act1/bf-celebration-schoolyard-day20.png` | Day 20, 4:30 PM deeper amber | MISSING | CSV row |
| `bf_celebration_pavilion_day28` | `apps/client/public/art/backdrops/act1/bf-celebration-pavilion-day28.png` | Day 28, 6:30 PM graduation evening | MISSING | CSV row |

Full prompts in the battlefield CSV — they follow the kindergarten
palette with progressive sunset temperature shifts.

### §2.A.3 Opponent portraits — Cycle A (3 matchup cards)

All three are MISSING. Render as 3:4 matchup cards at 1536×2048.

**§2.A.3.1 Little Meme (Minnie — Archon, child form, match 1):**

**Output:** `apps/client/public/art/matchups/act1/little-meme.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/little-meme.txt`

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing (subject fills upper two-thirds, lower third deliberately empty honey-oak card-table surface for UI text overlay). A seven-year-old boy seated at the wooden card-table in the §4.1 classroom, leaning forward on both elbows, chin tilted up. His face is open, hungry, and delighted — a child who has found a new toy and will not stop until he has taken it apart. He is mid-chant: lips parted in a repeating phrase, the mouth caught between syllables. His eyes are locked directly on camera (not shy, not cruel — certain). Simple pull-over tunic in dusty rose `#c98b8b` with rumpled sleeves. Short, messy, chestnut hair. One hand flat on the table, fingers splayed over an imaginary card; the other half-raised, pointing with index finger extended as if tracking something the viewer can't yet see. Lighting: warm-yellow window sun striping his left cheek and the card-table surface. Palette: honey `#d9a66a` dominant, dusty rose `#c98b8b` accent, warm sunlight `#f5d98a` on his skin. Background: softly defocused interior of the classroom — slate board, window panes, rug — bokeh only, the child is the subject. No rendered text. Soft film grain. Cinematic 4K. Not cute — this boy is certain. The chant is already viral.

**§2.A.3.2 Little Collector (Corey — Archon, child form, match 2):**

**Output:** `apps/client/public/art/matchups/act1/little-collector.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/little-collector.txt`

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing. A seven-year-old boy kneeling on one of the §4.1 classroom chairs to get taller than the table, both hands clasped around a small glass mason jar held protectively at his chest. The jar is roughly the size of his clasped hands; its glass is smoky and fogged from the inside, a faint iridescent shimmer trapped behind the glass suggesting something is inside (do not render distinct creatures — the shimmer is ambiguous, captured emotions rather than animals). His expression is sweet, earnest, and wrong — the smile of a child who has already decided to keep something that isn't his. He is looking slightly off-camera, to the player's right, as if watching the next emotion before he collects it. Tidy little button-up shirt in soft sage green with the top button fastened, an overly-grown-up collar for his small frame. Hair parted to the side, neat, over-combed. Lighting: warm-yellow window sun from the same screen-right window as §4.1, catching the glass of the jar and making the trapped shimmer glow faintly golden. Palette: honey `#d9a66a`, sage green `#7ba67a`, sunlight `#f5d98a`, with a faint iridescent shimmer inside the jar glass (subtle — not overt magical effect). Background: softly defocused classroom. No rendered text. Cinematic 4K. He is not a bully; he is a hoarder in the making. The sweetness is the menace.

**§2.A.3.3 Little Watcher (Kanshi Sha — Archon, child form, match 3, cycle finale opponent):**

**Output:** `apps/client/public/art/matchups/act1/little-watcher.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/little-watcher.txt`

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing. A seven-year-old girl seated very still at the §4.1 classroom card-table, hands folded in her lap, spine straight, shoulders level. Simple pale cream linen dress with subtle dusty-rose trim at the collar. Hair in a single dark braid down one shoulder. Held in her lap, barely catching the edge of frame, is a half-finished white porcelain mask — the upper half is smooth blank ceramic (covering where her eyes would be), the lower half trails into raw unfired grey clay that hasn't been shaped yet. She is not wearing the mask; she is holding it as if about to put it on. Her face is fully visible above the mask's upper edge — a perfectly composed little girl's face, eyes open, looking directly at the viewer with a soft, measured attention. No hostility, no fear, no curiosity — assessment. She has already decided what she sees. The lighting is late-afternoon through the §4.1 window, warm sun now angled lower and redder (approaching sunset temperature — first hint of the cycle finale's weight). The shadow of her head and the mask fall sharply across the honey-oak card-table surface in front of her, cast long. Palette: honey `#d9a66a`, cream `#e6dcc2`, dusty rose `#c98b8b` at her collar, white porcelain `#f7f3ee` for the mask, grey unfired clay `#b8b4a8` for the mask's lower unfinished half, warmer-toward-red sun `#f0b878` (warmer than §5.1.1/§5.1.2 — the sun is lower). Background: classroom defocused, slate board barely readable behind her. Cinematic 4K. She is recording you. The mask in her lap is for when she has seen enough to decide who she is being. No rendered text.

---

### §2.A.4 Card art — Cycle A (3 cards)

All MISSING. 1024×1024 square, Nano Banana 2. Full composed prompts in
`docs/production/act1-asset-build/manifests/act1_art_prompts__card_art.csv`
(rows 2, 4, 6 — `card_art_countermelody`, `card_art_jar_wouldnt_close`,
`card_art_first_card`).

**§2.A.4.1 The Countermelody (A1 unlock — Common Neutral):**

**Output:** `apps/client/public/art/cards/act1/card-art-countermelody.png` + `.webp`

> *Global style anchor:* Hyper-realistic cinematic composition with a strong biographical quality — every frame should feel like it's been pulled from a recovered personal archive. Palette: warmer and more nostalgic than the Prelude's cold cyan; dominant warm gold `#fbbf24`, institutional steel grey, deep wood panelling, faint film-grain sepia undertone. Subjects rendered with the specificity of photographic portraiture. Film grain. Anamorphic lens flares where warm light meets composition edges. 1920×1080 / 16:9 / 4K. No rendered text unless explicitly flagged.
>
> Square card-art composition (1024×1024). A single tuning fork in the center of the frame, struck and vibrating — the vibration rendered as a faint soft halo of sound-wave concentric rings emanating outward. Brass body with warm-gold reflectivity, sitting upright on a worn dark-wood surface (the Celebration schoolyard card table). Background: out-of-focus warm-gold afternoon Day-10 schoolyard light, faint pink-gold parade banner bokeh. The fork's tone is canonically the OPPOSITE of Minnie's viral chant — render the sound rings as a quiet, organized, single-frequency wave (contrast with chaotic). NO PEOPLE. Lower-third of the frame is the worn wood surface, leaving room for the card's name banner. Faint film-grain sepia. The card is a Common Neutral; the composition should feel modest and earnest.

**§2.A.4.2 The Jar That Wouldn't Close (A2 unlock — Rare Light):**

**Output:** `apps/client/public/art/cards/act1/card-art-jar-wouldnt-close.png` + `.webp`

> Square card-art composition (1024×1024). An amber glass jar — Corey's jar from §2.3 — center-frame, lid askew (NOT closed), a single warm-gold light beam escaping upward through the gap between lid and rim. The light beam carries a few small translucent coin-shapes drifting upward and out, each with a faint defocused face on its surface. The jar itself is half-full of similar coins, nestled at the bottom and giving off their own subdued amber inner-glow. The lid hovers approximately 1cm above the rim, frozen in the act of failing to seal. Background: out-of-focus 4:30 PM Day-20 schoolyard light, deeper amber than A1. The jar sits on the same worn dark-wood surface. Lower third clean for the card-name banner. The card is Rare Light; the visual hinge is the LID FAILING — Corey's jar canonically wouldn't close, and the spilled-light is the player's attention escaping back to them.

**§2.A.4.3 The First Card (A3 unlock — Epic Light, Kanshi's gift regardless of win/loss):**

**Output:** `apps/client/public/art/cards/act1/card-art-first-card.png` + `.webp`

> Square card-art composition (1024×1024). A single small folded paper card, blank on both sides, held in the warm-lit palm of a child's hand at center-frame (the Engineer's seven-year-old hand from the §5.4 graduation handoff). The paper has a faint warm-gold inner glow seeping through its fibers — the canonical 'three random effects on play' rendered as latent potential rather than literal symbols. Around the card: faint film-grain sepia bokeh of the graduation pavilion at 6:30 PM evening light, soft-focus pillars in the background. The hand is small but steady, fingers slightly curled to cradle the paper. NO faces. NO rendered text on the paper. The card is Epic Light; the composition's emotional register is GIFT, not reward — Kanshi Sha gives this card whether the player wins or loses, and the prompt should communicate that giving rather than that earning.

### §2.A.5 Cycle A Finale Cutscene — *Welcome to Celebration*

**Output:** `apps/client/public/videos/act1/welcome-to-celebration.mp4`
**Duration:** 40s (range 35–45s) @ 24fps, 16:9
**Status:** MISSING — prompts already authored in
`docs/production/act1-asset-build/prompts/cutscenes/welcome-to-celebration_{start_frame,end_frame,motion}.txt`
**Bible:** `ACT_1_SHIP_READY_BIBLE.md` §6.1
**Fires after:** `little_watcher` match resolves
**Flags set:** `act1_cycle_a_complete`, `celebration_glimpse_shown`, `memoir_frame_acknowledged`

**Dependencies:**
- Start PNG: `assets/intermediate/act1/cutscenes/welcome-to-celebration_start.png`
- End PNG: `assets/intermediate/act1/cutscenes/welcome-to-celebration_end.png`

**START FRAME prompt (Nano Banana 2):**
> Same §4.1 classroom, match complete. Wide shot from the empty seat opposite Little Watcher's chair (the player's POV, camera at child-eye level). Little Watcher sits exactly as in her matchup-card, hands in her lap, mask still not worn. The card-table between camera and her holds the final card play of the match — one card face-up on the player's side, one on hers, the played stacks intermixed. Warm late-afternoon sun has shifted another 15 minutes redder since the matchup card; the whole classroom is washed in amber. Dust motes thick in the light. Cinematic 4K. No rendered text.

**END FRAME prompt (Nano Banana 2 — rendered-text exception "CELEBRATION"):**
> Pull-back establishing shot of the same classroom but the walls have dissolved — the wooden panelling peels back at the edges of frame to reveal, behind the school, a towering gated structure in polished brass and black marble: an immense ceremonial arch inscribed with the single word CELEBRATION in formal Empire script (rendered in-frame is permitted here, this single word is the canonical reveal). Beyond the arch, hundreds of identical schoolchildren in cream linen are walking in orderly processional lines toward a brass-and-bone amphitheatre. The Celebration banner flies above — dusty rose on cream. The classroom sits at the foreground as a small, warmly-lit island against the vast ceremonial machinery beyond. Little Watcher is now wearing the mask; only her braid and the lower edge of her jaw are visible beneath the porcelain. She is no longer seated — she stands at the threshold of the dissolving classroom wall, facing the arch. Palette: classroom honey and rose in the foreground, deep brass `#b8752d` and black marble `#1c1a1a` beyond the arch, ceremonial dusty rose `#c98b8b` on the distant banners. Cinematic 4K. The juxtaposition is the point.

**VEO 3.1 motion prompt:**
> Open on start frame — card-table, Little Watcher seated, amber classroom. Hold 3s. Beat at 4s: Little Watcher's voiceover line lands ("I have watched sixteen versions of you already.") as her hand lifts the mask from her lap. Beat at 8s: she places the mask over her face in a single slow motion; the classroom's warm light begins to shimmer at the edges of frame. Beat at 14s: camera slowly pulls back through where the east wall was; the wall dissolves outward in a wipe of warm dust, revealing the Celebration arch in distant tableau. Beat at 22s: camera continues the pull-back, the classroom becomes small foreground against the vast brass Celebration machinery; hundreds of children in cream linen walk toward the amphitheatre in silent processional. Beat at 30s: hold on final composition. Little Watcher (masked) at the dissolved threshold. Final 5s: slow fade to honey-amber black. 24fps. Reverent, foreboding, a child's-eye-view of something much larger than a classroom.

**Veo config:** 40s · 16:9 · 24fps · fixed child-eye-level POV pulling
back through a dissolving wall. Note: the "CELEBRATION" arch text must
render legibly — if Veo's typography is unreliable, composite the word
over a generic brass-arch render in post.

**Audio hand-off:**
- VO `vo-little-watcher-sixteen-versions` @ ~4s — status: `prompted`
  (NOT yet recorded). Output
  `apps/client/public/audio/act1/little_watcher_sixteen_versions.mp3`,
  duration 3.5s. Render via ElevenLabs against the `little_watcher`
  voice profile. Source line: "I have watched sixteen versions of you
  already."
- No ambient bed; classroom sun + dust + processional footfall runtime
  SFX only.

---

## §2.B  Cycle B — Mechronis Academy

Mechronis academy years, §§7–12 of `ACT_1_SHIP_READY_BIBLE.md`. Five
opponent matches (young Iron Lion / Kael / Agent Zero / Eyes / Seeker),
one cycle-finale cutscene.

### §2.B.1 Room — Mechronis Atrium

**Output:** `apps/client/public/art/rooms/room-mechronis-atrium.png` + `.webp`
**Status:** MISSING
**Aspect / res:** 16:9 / 1920×1080
**Palette:** `#4ba3b5 #b8752d #f5d98a`
**Source prompt:** `docs/production/act1-asset-build/prompts/rooms/room-mechronis-atrium.txt`

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the central atrium of Mechronis Academy — a technical university carved from grey limestone and polished dark-basalt composite, soaring early-Empire institutional architecture. Rectangular hall, vaulted ceiling of exposed brass ribs and obsidian-glass skylight panes. Four tall narrow arched windows line the left wall, each two stories high, casting long shafts of warm late-morning sunlight across a polished basalt floor dulled by decades of student footfall. Center-frame: the public-match card-table — a single rectangular table of brass-clad oak with inlaid bone corner accents, polished to a soft matte sheen, four empty institutional chairs arranged around it (two facing two). Blank brass plaque on the table (no rendered text). Right wall: three tall brass doorways in shallow arched alcoves; above each, a small stone medallion carved with a faculty seal (generic geometric sigils, no rendered letters). Fluted unpainted stone columns between the doorways. At the far end, a raised dais with a second smaller card-table and a row of empty faculty chairs. Palette: cool institutional cyan `#4ba3b5` in shadowed recesses, polished brass `#b8752d` on door-frames and table edges, warm buttery sunlight `#f5d98a` in four hard parallelograms across the floor — the last visual echo of the §3.3 classroom warmth, deliberate and sparing. Volumetric fog pooled at ankle height, thin and dignified, catching the sun shafts as dust motes. Anamorphic lens flare on the brightest window's inner edge. Faint film grain. Cinematic 4K composition, three-quarter wide shot, camera at standing adult eye level, looking down the hall past the public card-table toward the dais. No rendered text, no visible people, no holograms. The room feels important. The room is about to be hostile. Today it is still just a school.

### §2.B.2 Battlefield backdrops — Cycle B

| Asset ID | Output | Status | Source |
|---|---|---|---|
| `bf_mechronis_classroom_standard` | `apps/client/public/art/backdrops/act1/bf-mechronis-classroom-standard.png` | MISSING | CSV row |
| `bf_mechronis_common_room` | `apps/client/public/art/backdrops/act1/bf-mechronis-common-room.png` | MISSING | CSV row |

Full prompts in `act1_art_prompts__battlefield.csv`.

### §2.B.3 Opponent portraits — Cycle B (5 matchup cards)

All MISSING. 3:4 / 1536×2048.

**§2.B.3.1 Detective / Student (Young Iron Lion at 20):**

**Output:** `apps/client/public/art/matchups/act1/detective-student.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/detective-student.txt`

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing (subject fills upper two-thirds, lower third empty brass-clad card-table surface for UI overlay). A young man around twenty, seated at the §4.2 public card-table, leaning slightly forward with both forearms resting flat on the brass-inlaid oak. His face is open, warm, attentive — the specific attention of a person who is listening as hard as they are looking. Half-smile about to become a full smile if whatever you're about to say is worth it. Dark hair, short and side-parted, a little untidy at the crown. Clean-shaven. Eyes dark, lively, slightly amused. He wears the Mechronis student blazer — a tailored cyan-grey wool double-breasted jacket with two rows of brass buttons and a narrow Academy crest stitched onto the left breast (stylized geometric seal, no rendered letters). Under the blazer a plain white collared shirt, no tie. His hands are bare, fingers laced loosely on the table; no coffee cup, no notebook, no trench coat. One of the §4.2 window sun-shafts falls diagonally across his left shoulder and the table edge in front of him, warm yellow against the atrium's cyan tone. Palette: cyan institutional `#4ba3b5` on the blazer and background, brass `#b8752d` on his buttons and the table's edge, warm sunlight `#f5d98a` on his left side, dark hair `#2a1f1a`, white shirt collar `#f0eae0`. Background: softly defocused atrium columns and arched window, bokeh only. Cinematic 4K. He is the friend the Engineer almost kept. The warmth in his face is the entire cost of what's coming. No rendered text.

**§2.B.3.2 Iron-Lion-Expelled (Young Kael / The Recruiter at 21):**

**Output:** `apps/client/public/art/matchups/act1/iron-lion-expelled.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/iron-lion-expelled.txt`

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing. A young man around twenty-one, standing beside the §4.2 public card-table rather than seated at it — one hand still resting on the chair-back he has just risen from, the other already pointing off-frame toward the atrium's brass doorways. His weight is on his front foot; he is mid-stride toward leaving. The posture is the story. His face is set — not angry, not sad, done. Jaw firm, eyes forward (not at camera — past camera, at the door). Close-cropped dark-auburn hair, slight beard starting at the jawline. He wears the Mechronis Academy uniform: same cut of cyan-grey blazer as the Detective but worn one button too loose at the collar, one sleeve rolled up to the elbow. The Academy crest on his left breast has been deliberately scratched through with a single diagonal mark (subtle — visible only on close inspection). Under the blazer, a plain work shirt in a warmer neutral grey. Bare forearm shows a faint pale scar running from wrist to inner elbow — the mark of someone who has worked with their hands, not just their mind. Lighting: the §4.2 atrium sun-shaft is behind him, rim-lighting his silhouette from the back; his face is lit only by the cyan institutional ambient. Palette: cyan `#4ba3b5` (dominant on his face and the foreground), brass `#b8752d` (blazer buttons, faint), warm sun `#f5d98a` (rim light behind him only), warm grey `#867b6d` (work shirt). Background: defocused atrium doorway, the brass door slightly ajar. Cinematic 4K. He is already halfway through the door. Whether he wins or loses this match, he walks out the same way. No rendered text.

**§2.B.3.3 Professor Eidola (Young Agent Zero — ethics professor, assessment opponent):**

**Output:** `apps/client/public/art/matchups/act1/professor-eidola.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/professor-eidola.txt`

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing. A woman in her early fifties seated on the dais side of the §4.2 public card-table, upright, both hands folded on the table in front of her over a closed student report-card folder (do not render text on the folder; keep its surface matte-cream blank). She wears the Mechronis academic robe: a long charcoal-grey wool robe with a narrow silver piping along the lapel and a single embroidered ethics-department sigil at the collar (geometric pattern, no rendered letters). Under the robe, a plain dark high-collared blouse. Her hair is silver-streaked black, cut short and neat, parted to one side; a single stray chalk-dust mark on her left sleeve. Her face is the most asymmetric of any Cycle B portrait: one eyebrow slightly lifted, one corner of her mouth softened into something that isn't quite a smile. Eyes directly at camera, tired but kind — tired because she has made this assessment a thousand times, kind because she has not yet stopped caring. Reading glasses pushed up into her hair rather than worn. One sun-shaft from §4.2 falls across her hands and the folder, warm on the cool palette. Palette: cyan institutional `#4ba3b5` on the robe's shadowed folds and background, polished brass `#b8752d` on the table edge and a brass pen resting beside the folder, warm sun `#f5d98a` across her hands, silver-grey `#a6a6a6` in her hair, blank cream `#e6dcc2` on the closed folder. Background: defocused atrium columns, the empty faculty dais chairs behind her. Cinematic 4K. She is about to write a word she will not let you read. She has already chosen it. The question is whether you make her change it. No rendered text.

**§2.B.3.4 Professor Matrikala (Young Eyes — engineering mentor):**

**Output:** `apps/client/public/art/matchups/act1/professor-matrikala.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/professor-matrikala.txt`

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing. A woman in her early sixties seated on the dais side of the §4.2 card-table but leaning forward, forearms on the brass-clad oak, body-language that of a workshop mentor rather than a formal examiner. She wears work coveralls (not the academic robe) in warm oxide-red canvas, sleeves rolled to the elbow, collar open. A single polished brass Academy pin holds the coverall's collar closed at the throat (faculty status in miniature). Her hands are the portrait's subject weight: bare, strong, knuckled, a web of fine scars and callus patterns that tell the story before her face does. On the table beside her elbow: a half-disassembled brass reactor coupling, its inner calibration ring partly exposed, a pair of fine needle-point calipers resting across it. The coupling is a musical instrument to her, half-open because she was mid-tune when the student sat down. Her face is weathered, warm, eyes bright and attentive — a professor who has spent her life teaching the same thing, and is still delighted every time a student finally hears it. Short silver-grey hair. Reading glasses on a brass chain around her neck, not worn. Lighting: the §4.2 sun-shaft falls full across the coupling and her hands, warm yellow on the brass and her skin — the hands and the work get the light, the face is lit by the atrium's cyan ambient. Palette: cyan `#4ba3b5` on background and her left side, oxide-red `#c66b3d` for the coveralls, polished brass `#b8752d` (the coupling, the pin, the table edge, the calipers), warm sun `#f5d98a` on her hands and the coupling, weathered skin with amber undertones. Background: defocused atrium faculty dais with a small rack of tools visible behind her (her workshop spilling into the formal room). Cinematic 4K. She will teach you to hear the reactor hum. The coupling is the lesson. The victory is not. No rendered text.

**§2.B.3.5 Seer Visit (Cycle B finale opponent — the Seer's earlier visit to Mechronis):**

**Output:** `apps/client/public/art/matchups/act1/seer-visit.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/seer-visit.txt`

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing. A woman of indeterminate age (could be forty, could be seventy — the canon is that she is older than she looks) seated at the §4.2 public card-table on the visitor side (not on the faculty dais — she is a fellow, not faculty). She wears plain traveler's robes in unbleached linen-cream with no institutional markings — no Academy crest, no faculty sigil, no rank indicator. A wide undyed flax sash loosely tied at her waist. Her hair is long, dark, and loose over one shoulder. Her face is serene and slightly sad — composed, unhurried, watching the viewer with the specific attention of someone who already knows how this meeting ends. Eyes directly at camera, soft. Not smiling but not sad; the expression of a person remembering something that hasn't happened yet. Her hands are loosely clasped in her lap — not on the table. Leaning against the chair to her right, angled upright: a dark wooden staff, as tall as a standing adult, worn smooth at the middle from a hand that has held it for decades. The staff's head is a simple blunt carved sphere in the same dark wood; no ornament, no crystal, no metal. The staff is subtly burnt at its lower third — charred, cracked, as if it has already lived through the fire that consumes it in the Prelude's burnt-card crew mission seventeen thousand years from this moment. The portrait paints it as if the burn is memory, not prophecy. Lighting: the §4.2 sun-shafts fall just to one side of her, illuminating the staff's lower burnt third and the chair beside her, but leaving her face softly lit by the cyan ambient only. Palette: cyan `#4ba3b5` on her face and the background, warm sun `#f5d98a` on the staff (bright on the char, golden on the unburnt upper two-thirds), unbleached cream `#e6dcc2` on her robes, dark wood `#3a2618` on the staff. Background: defocused atrium columns. Cinematic 4K. She is looking at where the staff will end up. The player has already seen the charred fragment in Beat J's Archives — this is where the burn begins. No rendered text.

---

### §2.B.4 Card art — Cycle B (6 cards)

All MISSING. 1024×1024 square, Nano Banana 2. Full composed prompts in
`docs/production/act1-asset-build/manifests/act1_art_prompts__card_art.csv`
rows 8–14 (`card_art_iron_stance` through `card_art_only_reason_i_stayed`).

**§2.B.4.1 The Iron Stance (B1 unlock — Rare Light):**

**Output:** `apps/client/public/art/cards/act1/card-art-iron-stance.png` + `.webp`

> Square card-art composition (1024×1024). A single weathered iron tower-shield planted upright in the center of the frame, dug slightly into a packed-earth surface. Brushed steel surface, dented from prior impacts, with a faint warm-gold rim-light catching the upper edge from the right of frame. NO heraldry, NO insignia — the shield is functional, not ceremonial (canonical Iron Lion: he refuses institutional symbols). Background: out-of-focus warm-gold afternoon light, suggestion of a Mechronis Academy gate (deep wood-and-iron archway) defocused at the back of the frame. The shield casts a long shadow toward the viewer. Lower third clean for the card-name banner. The card is Rare Light; the visual register is HOLD THE LINE — render the shield as if it has been here a long time and intends to stay.

**§2.B.4.2 The Recruiter's Gift (B2 unlock — Epic Neutral):**

**Output:** `apps/client/public/art/cards/act1/card-art-recruiters-gift.png` + `.webp`

> Square card-art composition (1024×1024). A single thin braided-fiber bracelet center-frame, laid loosely on a worn dark-wood surface (the Mechronis classroom card table). The braid is in three colors: deep insurgency-yellow `#eab308`, warm gold, and a dark gray-blue that picks up the Mechronis uniform palette. The bracelet is canonically Kael's gift — render it as worn but cared for, slightly frayed at the closure but still intact. Behind it on the table: a half-finished Dischordia card face-down, its back showing faint warm-gold trim. Background: out-of-focus warm-gold afternoon Mechronis classroom light, soft window-shaft from the left. NO HANDS in this composition — the bracelet is offered, awaiting acceptance. Lower third clean for the card-name banner. The card is Epic Neutral; the visual register is THE OFFER — quiet, without ceremony.

**§2.B.4.3 The Weapon I Didn't Build (B3 unlock — Legendary Dark):**

**Output:** `apps/client/public/art/cards/act1/card-art-weapon-i-didnt-build.png` + `.webp`

> Square card-art composition (1024×1024). A pair of EMPTY hands at center-frame, palms turned up and slightly cupped, as if recently holding something that is no longer there. The hands are the Engineer's adult hands (worn, calloused, faint scar between the thumb and forefinger of the right hand — canonical match to §2.1.2 reference). NO weapon visible. The faint silhouette of an absent shape — vague, sword-like or stance-like — hovers in the empty palm-space, rendered as a thin outline of cool-grey light, almost a memory. Background: out-of-focus institutional Mechronis blue-gray, single warm-gold shaft cutting diagonally across the upper frame from off-frame-right. Lower third clean for the card-name banner. The card is Legendary Dark; the visual register is the CANONICAL ABSENCE — what the Engineer is holding is the choice he didn't make about Agent Zero. Render the absence with weight, not with melancholy.

**§2.B.4.4 The Memorized Page (B4 unlock — Epic Dark):**

**Output:** `apps/client/public/art/cards/act1/card-art-memorized-page.png` + `.webp`

> Square card-art composition (1024×1024). A single torn page from a textbook, center-frame, lying flat on a dark wooden desk. The page's surface is BLANK — the canonical 'memorized page' is what's been removed, not what's printed. Faint impressions of erased text remain (graphite shadow, illegible). A single fingerprint smudge in the upper-left corner of the page. Beside the page: a small circular pale-blue Watcher sigil ~1cm, drawn in pencil, visually identical to the sigil on Young Eyes's wrist (§2.8 portrait cross-reference). Background: out-of-focus dark Mechronis fourth-year classroom under desk-lamp pool, single warm-yellow glow at the edge of the frame. Lower third clean for the card-name banner. The card is Epic Dark; the visual register is SURVEILLANCE-AS-INHERITANCE — the player gets this card because Young Eyes left it for them.

**§2.B.4.5 The Classmate's Compass (B5 win unlock — Legendary Light):**

**Output:** `apps/client/public/art/cards/act1/card-art-classmates-compass.png` + `.webp`

> Square card-art composition (1024×1024). A small brass pocket compass center-frame, open and resting on a worn dark-wood surface (the senior common room coffee table). The compass face is canonical: the needle is NOT pointing north — it points slightly off-axis, toward the upper-right of the composition. The brass case has a single small engraved mark (no rendered text — abstract geometric, suggesting a younger Human's monogram). The needle catches a thin warm-gold reflection from off-frame-right (firelight). Background: out-of-focus fireplace warmth, leather armchair leg in soft focus at the back of the frame. Lower third clean for the card-name banner. The card is Legendary Light; the visual register is DIRECTION-AS-GIFT — the Human gave the Engineer this compass and the Engineer never asked why; render the brass with care, the needle's slight off-true as the canonical detail.

**§2.B.4.6 "The only reason I stayed" (B5 loss unlock — Legendary Dark):**

**Output:** `apps/client/public/art/cards/act1/card-art-only-reason-i-stayed.png` + `.webp`

> Square card-art composition (1024×1024). The same Mechronis senior common-room setting as the Compass card, but EMPTY — a single leather armchair angled toward the fireplace, a low coffee-table-card-table in front of it with a Dischordia deck face-down on the surface. NO compass on this table; NO second armchair partner. The fireplace burns down to embers — warmer red-orange tones, softer light pool than the Compass card. Faint sepia film-grain heavier than other Cycle B cards. Background: bookshelves softly out-of-focus, a window at frame-right showing dusk-blue night beyond. Lower third clean for the card-name banner. The card is Legendary Dark; the visual register is the CANONICAL ABSENCE of the Human — the Engineer stayed for the conversation that didn't happen. Render the empty chair as the subject, not the table; the player should feel the seat is canonically the Human's seat.

### §2.B.5 Cycle B Finale Cutscene — *To Be the Human*

**Output:** `apps/client/public/videos/act1/to-be-the-human.mp4`
**Duration:** 47s (range 40–55s) @ 24fps, 16:9
**Status:** MISSING — prompts already authored in
`docs/production/act1-asset-build/prompts/cutscenes/to-be-the-human_{start_frame,end_frame,motion}.txt`
**Bible:** `ACT_1_SHIP_READY_BIBLE.md` §6.2
**Fires after:** `the_seer_visit` match resolves
**Flags set:** `act1_cycle_b_complete`, `to_be_the_human_shown`, `human_potential_seeded`

**Dependencies:**
- Start PNG: `assets/intermediate/act1/cutscenes/to-be-the-human_start.png`
- End PNG: `assets/intermediate/act1/cutscenes/to-be-the-human_end.png`

**START FRAME prompt:**
> Mechronis Academy's main gate at dusk — a tall brass-and-basalt archway opening onto a stone plaza, the §4.2 atrium visible receding behind it through the opposite doorway. Two young men stand in the gate's threshold, backlit by the late-afternoon sun pouring across the plaza. On the left: the Engineer (seen from behind — hair, shoulders, cyan-grey blazer only, not his face — keep the Engineer faceless per Prelude hygiene). On the right: the Detective (student-years, as rendered in §5.2.1's matchup card), facing the Engineer in three-quarter profile, his hand extended for a parting handshake. Their hands are about to meet but have not yet. Around them, a few other students walk past in the dusk, blurred in motion. Palette: cyan institutional `#4ba3b5` fading on the Academy stone behind them, warm dusk gold `#e6a84a` flooding the plaza beyond the gate, long shadows thrown toward camera. Cinematic 4K. No rendered text. This is the last warm moment Act 1 gives the player. Every later cycle palette is colder.

**END FRAME prompt:**
> The same plaza, forty seconds later. The Engineer stands alone in the gate's threshold, seen from behind, unmoving. The Detective has walked out through the plaza and is a small receding figure near the far edge of frame, silhouetted against the dusk sun — his Mechronis blazer replaced mid-shot by a longer darker coat that almost reaches his ankles, a coat he did not own when the scene began. His walk has changed too: shoulders squarer, stride more deliberate. He is not the same person who walked out. The plaza is emptier now; other students are gone. The gate-arch throws a long shadow across the foreground. Palette: cyan `#4ba3b5` in the gate-shadow where the Engineer stands, dusk gold `#e6a84a` fading to purple-grey on the plaza, the Detective-now-almost-Human in silhouette against the last warm strip of sky. Cinematic 4K. The door closes here. The coat is the reveal. He is on his way to becoming the man the player already knows from the Prelude's whispered voice on the substrate layer. No rendered text.

**VEO 3.1 motion prompt:**
> Open on start frame — two young men at the Academy gate, hands about to meet. Hold 2s. Beat at 3s: handshake completes in slow motion, held 1.5s. Beat at 5s: the Detective steps back, nods once, turns away from the Engineer and begins to walk into the plaza. Camera stays locked on the Engineer's shoulders (seen from behind), the Detective receding ahead. Beat at 12s: key transformation beat — as the Detective walks away, his cyan-grey student blazer dissolves in a slow dust-wipe from his shoulders down, replaced by a longer darker coat that reaches past his knees (do not cut; the transition is a slow morph, not an edit). His stride shifts subtly. Beat at 22s: Engineer's voice-over: "He walked out of the Academy gate. He would not be called the Detective again for a very long time. He would be something else first." Beat at 30s: the Detective-now-Human reaches the far edge of the plaza, silhouetted against the dusk sun. Final 10s: hold on the Engineer's stationary back, the Human a small shape near the horizon, warm light falling from the left. Slow fade to cyan-cool black (the Cycle C palette beginning to bleed in). 24fps. Quiet, valedictory, the last warm moment before cold arrives.

**Veo config:** 47s · 16:9 · 24fps · camera locked on Engineer's back,
receding figure in plaza. The blazer → long-coat morph at 12s is the
key hinge beat — if Veo fumbles it, render the before/after as separate
Nano Banana 2 stills and hand-crossfade in After Effects.

**Canon hygiene:** Engineer's face MUST never be rendered — always from
behind. Detective's face is visible at start; by end he is silhouette
only (a preview of the Human's canonical never-directly-shown status).

**Audio hand-off:**
- VO `vo-prince-to-be-the-human` @ ~22s — status: `prompted` (NOT yet
  recorded). Output `apps/client/public/audio/act1/prince_to_be_the_human.mp3`,
  duration ~8s. ElevenLabs against the `the_prince` voice profile.
  Engineer memoir narration line verbatim in the motion prompt above.
  Note: the `the_prince` voice profile is the Engineer's canonical
  memoir voice (Prince = the Engineer's later identity), NOT the
  Prelude Prince character from Beat E.
- No ambient bed; plaza ambient + footfall runtime only.

---

## §2.C  Cycle C — Nexon / Zenon / Authority Tribunal

Insurgency war + trial arc, §§13–18 of `ACT_1_SHIP_READY_BIBLE.md`. Four
opponent matches (Warlord-Zero-First / Programmer / Game-Master-Original /
Authority), one mid-cycle cutscene (`hacking-reality` after C1), and one
cycle finale delivered as a React slideshow wiring (NOT a Veo render)
plus the Act 1 Finale arc.

> **Cycle C finale is already code-shipped.** The `cutscene-last-words-full`
> entry in `asset_prompt_manifest.json` has `type: cutscene_wiring`,
> `status: shipped`, `shipped_in_pr: 89`, `art_required: false`. It
> renders in `apps/client/src/components/act1/Act1CycleCAuthorityWitnessing.tsx`
> using the **Prelude Last Words slide WebPs** at
> `apps/client/public/art/prelude/last-words/slide-{1..4}-{1..5}.webp`
> + the shared `song_last_words_prelude_cut.mp3` (see §1.J.5).

### §2.C.1 Rooms — Cycle C (3 primary rooms)

**§2.C.1.1 Nexon Battlefield:**

**Output:** `apps/client/public/art/rooms/room-nexon-battlefield.png` + `.webp`
**Status:** MISSING
**Aspect / res:** 16:9 / 1920×1080
**Palette:** `#6b5a48 #b8752d #c66b3d #e06a1a #a6998a #4ba3b5`
**Source prompt:** `docs/production/act1-asset-build/prompts/rooms/room-nexon-battlefield.txt`

> Hyper-realistic cinematic still, 16:9, 4K. A collapsed defensive line at the outer edge of the city of Nexon, late evening after a full day of fighting. Mid-range shot depth. Foreground: a half-ruined brass-and-stone parapet wall — a staggered row of bunker emplacements broken through in the center of frame, the breach showing dust, embers, and the silhouette of a single overturned card-table set up in the lee of a surviving brass gun-emplacement. The card-table is intact, lightly scattered with face-down cards, two empty chairs. Behind the parapet, the city of Nexon in mid-distance: collapsed colonnades, the silhouettes of three partially-downed monuments, slow-rising columns of smoke threading upward through a low ceiling of dust. Far distance: ember-orange glow from sustained fires on the horizon. No natural light — scene lit only by distant fires, faint cold emergency flares, and a single high-angle brass spotlight from an unseen battalion-post casting one hard amber cone across the ruined parapet and the card-table. Volumetric dust at knee height, drifting visibly through the spotlight. Brass shell-casings and scattered field-pack debris on the ground. A torn Insurgency banner hangs limp from a broken flagpole at screen-right. No visible bodies, no visible soldiers — the battlefield is empty now. No rendered text. Palette: dust-brown `#6b5a48` dominant, polished brass `#b8752d` on the gun-emplacement and card-table edges, rust-orange `#c66b3d` on the ruined metalwork, ember-orange `#e06a1a` on the distant fires, bone-grey `#a6998a` on the stone, cold cyan `#4ba3b5` barely present on the emergency flares. Deliberately no warm sun, no honey, no dusty rose — the only warm color is fire. Anamorphic lens flare from the amber spotlight. Cinematic 4K composition, camera at standing adult eye level, three-quarter wide framing on the card-table in the breach.

**§2.C.1.2 Zenon Cell (interrogation chamber):**

**Output:** `apps/client/public/art/rooms/room-zenon-cell.png` + `.webp`
**Status:** MISSING
**Aspect / res:** 16:9 / 1920×1080
**Palette:** `#55606e #6b6b65 #e8e8e8 #2a2a2d`
**Source prompt:** `docs/production/act1-asset-build/prompts/rooms/room-zenon-cell.txt`

> Hyper-realistic cinematic still, 16:9, 4K. Interior of a small interrogation chamber in the Zenon trial facility. The room is deliberately undersized — walls feel close, ceiling barely above head height. Concrete-grey walls, unpolished. A single square card-table dead center on a stained grey floor; one chair on each side facing each other across the table. Both chairs are institutional grey metal — identical, no distinction between interrogator and accused. A single rectangular overhead panel-light centered directly above the card-table, unshaded, casting a hard white-cold cone downward — only the table and two chairs are fully lit; walls recede into deep grey shadow at the frame edges. Empty tabletop (cards appear at runtime). No windows. One metal door at the far wall, closed, flush to the concrete, no handle visible from inside. A small blank brass identifying plate beside the door. No furniture beyond the table, two chairs, and the door. No decoration. No trace of anyone having been there before. Palette: cold institutional grey `#55606e` dominant on walls and floor, warmer grey `#6b6b65` on chairs, clinical white `#e8e8e8` in the overhead light-cone, deep shadow `#2a2a2d` at frame edges. No brass except the blank door plate. No cyan. No warmth. Soft film grain. No volumetric fog — the room is sealed too tight for drift. Cinematic 4K composition, camera at standing adult eye level, centered on the table, looking directly down the chair-to-chair axis from just behind one chair's back. The opposite of every previous environment's grandeur.

**§2.C.1.3 Authority Gallery:**

**Output:** `apps/client/public/art/rooms/room-authority-gallery.png` + `.webp`
**Status:** MISSING
**Aspect / res:** 16:9 / 1920×1080
**Palette:** `#1c1a1a #d9a66a #8b7fbf #4ba3b5 #6b4a2d`
**Source prompt:** `docs/production/act1-asset-build/prompts/rooms/room-authority-gallery.txt`

> Hyper-realistic cinematic still, 16:9, 4K. A long vaulted ceremonial hall — the Authority's gallery. Deep perspective shot looking down the hall's length from near the entrance end. Along the left wall, a row of six tall crystal coffins in identical alcoves — each coffin a vertical standing container of clear faceted crystal, seven feet tall, narrow, each faintly lit from within by a soft low-saturation glow (three pale amber, two pale violet, one barely-visible pale cyan — the assignment is deliberate but the player does not yet know what it signifies). Each coffin appears empty on close inspection; the light inside is ambient, not from a figure. The right wall is blank polished black marble, reflecting the coffins' faint glow. Floor: continuous slab of the same black marble, unlit except by coffin glow. Center of the gallery's length, roughly two-thirds down the hall from camera: a single simple wooden chair facing away from camera, down the hall toward the gallery's back arch. The chair is unadorned, plain, almost domestic — the only organic material in a room of stone and crystal. Empty in this establishing still. Far end of the hall: a tall stone archway with a raised shallow dais beneath it. Above the arch, recessed deep into the shadowed upper wall, a silhouette is barely suggested — a darker shape against dark stone, identifiable only as an outline that could be a seated figure. Do not render face, gender, or detail. The silhouette is the Authority's presence; the player will never see more of it. Palette: black marble `#1c1a1a` dominant, pale amber `#d9a66a` from three coffins, pale violet `#8b7fbf` from two coffins, pale cyan `#4ba3b5` from one coffin (all at low saturation, barely visible), warm wood `#6b4a2d` on the single chair, deep shadow everywhere else. No rendered text. No warm ambient — the coffin glow is the only light. Volumetric cool air at ankle height, still, not drifting. Cinematic 4K composition, deep perspective, camera at standing adult eye level at the entrance end, looking down the hall's length toward the silhouette.

### §2.C.2 Battlefield backdrops — Cycle C

Per `act1_art_prompts__battlefield.csv` rows 6–10:

| Asset ID | Output | Status | Notes |
|---|---|---|---|
| `bf_nexon_command_bunker` | `apps/client/public/art/backdrops/act1/bf-nexon-command-bunker.png` | MISSING | Warlord C1 interior battlefield |
| `bf_zenon_field_tent` | `apps/client/public/art/backdrops/act1/bf-zenon-field-tent.png` | MISSING | Wanda Wyrlord (Programmer) C2 backdrop |
| `bf_vortex_pressurized_bay` | `apps/client/public/art/backdrops/act1/bf-vortex-pressurized-bay.png` | MISSING | C3 Warlord Nano-Swarm "Hacking Reality" backdrop |
| `bf_newbabylon_tribunal` | `apps/client/public/art/backdrops/act1/bf-newbabylon-tribunal.png` | MISSING | C4 Wayne Warden Tribunal backdrop |
| `bf_ark_archives_dimmed` | `apps/client/public/art/backdrops/act1/bf-ark-archives-dimmed.png` | MISSING | Authority-chamber backdrop variant |

Full prompts in the battlefield CSV.

---

### §2.C.3 Opponent portraits — Cycle C (4 matchup cards)

All MISSING. 3:4 / 1536×2048.

**§2.C.3.1 Warlord Zero First (Vernon Vortex — match C1, canonical Warlord first-form, Vex Solene no-face):**

**Output:** `apps/client/public/art/matchups/act1/warlord-zero-first.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/warlord-zero-first.txt`
**Canon hygiene:** `vex_solene_no_face_reveal` — visor is full-face opaque; ONLY a faint iridescent shimmer at the visor lip is permitted.

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing. A fully armored figure standing at the §4.3 ruined brass parapet, mid-distance from camera (fills upper two-thirds of frame, lower third is the ruined parapet + card-table edge for UI overlay). Her armor is articulated brass-and-composite plate in a dusky-chrome finish — no Empire insignia, no faction marks, deliberately unornamented; this is field armor, not ceremonial. A segmented cuirass, pauldrons, greaves, gauntlets. The helm is full-face, a sculpted brass visor with a continuous horizontal scanning slit at eye level. The face is completely hidden. Along the visor's lower inner edge, a faint iridescent shimmer — barely visible, almost a heat-haze, the only visible indicator of the Vex-swarm infesting the body. The shimmer is subtle, not flashy; a viewer who doesn't know to look for it reads it as spotlight refraction on the visor. One gauntleted hand rests on the hilt of a broad short-bladed weapon at her side (do not render it drawn); the other is extended open-palmed toward the card-table in front of her as if offering the match. Her stance is still, not aggressive — a professional arriving to complete a transaction, not a warrior entering combat. Lighting: the §4.3 amber spotlight falls across her pauldron and the upper visor; the rest of her body is lit by distant ember-orange from the city fires and a faint cold cyan from emergency flares. The visor reflects the ember glow. Palette: dusky chrome `#6b6b65` on the armor, polished brass `#b8752d` at joints and edges, ember-orange `#e06a1a` on the visor's inner reflection and the city glow behind her, dust-brown `#6b5a48` in the background, faint iridescent shimmer (rainbow-pale, barely present) along the visor lip only. Background: defocused Nexon breach, smoke columns, a torn Insurgency banner at screen-right edge. Cinematic 4K. The face is hidden. The face will remain hidden for the entire Act 1 arc. Do not hint at who is wearing the body. No rendered text.

**§2.C.3.2 Programmer (Wanda Wyrlord — match C2, forced-loss survivor):**

**Output:** `apps/client/public/art/matchups/act1/programmer.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/programmer.txt`

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing. A man in his mid-forties seated on the survivor side of the §4.3 ruined-parapet card-table, facing camera across the table. He is dressed in plain cold-weather travel clothing — a weather-worn dark-grey canvas coat buttoned to the throat, a simple coarse-knit wool scarf in muted ember-rust `#b85a1a` (the Nexon palette's warmest echo), fingerless work-gloves, no faction insignia of any kind. His hair is short, greying at the temples, neatly kept despite the battlefield setting. A trimmed salt-and-pepper beard. His face is calm and final — the composure of a person who has already made every decision that matters and is now only waiting for the match to end so he can go do what he has decided to do. Eyes on the viewer, steady, warm but unbound. No grief, no fear. He is already gone, and the portrait is the portrait of someone who hasn't realized yet that the conversation is already a memory. Over his shoulder: a canvas satchel, half-packed, resting on the chair beside him — the flap open, a rolled map and a small brass lockbox visible inside. A folded piece of thick paper peeks out from his coat pocket (do not render text on the paper; keep it closed and creased). One hand flat on the card-table, fingers spread over a single face-up card in mid-play; the other hand resting on the satchel's strap. Lighting: the §4.3 amber spotlight falls across his face and the card-table surface; ember-orange rim-lights his shoulders from the city behind him. Palette: dusky grey `#6b6b65` on his coat, ember-rust `#b85a1a` on the scarf, brass `#b8752d` on the satchel buckle and the table edge, amber spotlight `#d9a66a` on his face, dust-brown `#6b5a48` in the background. Background: defocused Nexon breach, same setting as §5.3.1. Cinematic 4K. He is going to lose this match on purpose. The portrait should sell it before the match starts. No rendered text.

**§2.C.3.3 Game Master Original (Wayne Warden / pre-split — match C3, Zenon cell):**

**Output:** `apps/client/public/art/matchups/act1/game-master-original.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/game-master-original.txt`
**Canon hygiene:** `pre_split_spectacles_single_frame_two_lenses` — ONE frame with TWO lenses, NOT the Acts-2+ Left/Right split.

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing. A thin man in his early fifties seated directly across the §4.4 interrogation chamber's card-table from camera, facing the viewer. He is lit by the single overhead panel-light's hard white cone — face and hands sharply illuminated, shoulders fading into the cell's deep grey shadow. He wears a tailored Empire legal-black suit: matte obsidian wool, no lapel insignia, no tie, a plain high-collared white shirt buttoned to the throat. His hair is thin, black, combed flat and receding. Clean-shaven. Crucially: he wears a single pair of wire-rimmed spectacles — two lenses in one frame, the conventional configuration. (Pre-split; do not render the later canonical two-separate-eyepieces Left/Right configuration the Game Master is known for in Acts 2+.) The spectacles' frames are slim and dark; the lenses are clear glass, rendering his eyes directly visible through them, not obscured. His face is measured and unreadable — no hostility, no smugness, no warmth; the specific professional neutrality of a prosecutor who has decided what he is going to do long before the match began and is only going through the motions of procedure. Eyes directly at camera, steady. Both hands flat on the table, palms down, fingers unnaturally still. Between his hands on the table surface: a single thick folio of pressed paper (do not render text; keep the folio closed). Palette: institutional grey `#55606e` on the walls behind him, hard clinical white `#e8e8e8` on his face/hands/shirt, deep shadow `#2a2a2d` at frame edges and on his suit, dark obsidian `#1c1a1a` on the suit fabric, thin silver glint on the spectacle frames. No brass. No warm light of any kind. No cyan. The only color temperature in frame is the panel light's clinical white. Soft film grain. Cinematic 4K. Remember his face. This is the last time he is one person. No rendered text.

**§2.C.3.4 The Authority (match C4 / Cycle C finale / Act 1 finale — faceless, featureless, scale-ambiguous):**

**Output:** `apps/client/public/art/matchups/act1/the-authority.png` + `.webp`
**Source:** `docs/production/act1-asset-build/prompts/matchups/the-authority.txt`
**Canon hygiene:** `faceless_featureless_scale_ambiguous` — no face, no hands, no insignia, no reflective surface, no scale cue.

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card framing, but composed as a deep-perspective hall shot rather than a seated-across-the-table two-shot. Camera is positioned at the §4.5 gallery entrance, low (seated eye level — the player's POV from where the Engineer will sit), looking down the long marble hall toward the back arch. The immediate foreground (lower third of frame) is the plain wooden chair where the Engineer will sit, empty in this still, facing away from camera toward the arch. The chair's back edges catch a faint sidelight from the coffin alcoves. Along the left wall of the hall, the six crystal coffins from §4.5 glow at their canonical saturations (three pale amber, two pale violet, one pale cyan). The right wall is black marble, reflecting the coffin glow as faint vertical streaks. The hall's floor stretches in deep perspective down to the shallow dais under the stone archway at the far end. Above the arch, recessed deep into shadowed upper stone, the Authority's silhouette — a barely-visible darker shape against darker stone, readable only as a seated or standing outline, completely featureless: no face, no hands, no color, no reflective surface, no insignia, no indication of scale. The silhouette is the matchup-card's true subject, but it is lit so faintly that the viewer's eye has to search for it; first-pass impression should be "empty hall with chair and coffins," second-pass impression should be "oh — there is someone there." Palette: black marble `#1c1a1a` dominant (floor, right wall, upper shadow where the silhouette sits), pale amber `#d9a66a` from three coffins, pale violet `#8b7fbf` from two, pale cyan `#4ba3b5` from one (all low-saturation), warm wood `#6b4a2d` on the empty chair, deep shadow everywhere else. No ambient warm light; no overhead lighting; no brass; no artificial color of any kind. Faint film grain. Volumetric cool air at ankle height, still. Cinematic 4K. The Authority has no face because the Authority is not a person. The Authority is the verdict — and in the next beat of runtime, the player sits down in the foreground chair and makes the argument. No rendered text.

---

### §2.C.4 Card art — Cycle C (5 cards, includes 2 Mythics)

All MISSING. 1024×1024, Nano Banana 2. Full composed prompts in
`act1_art_prompts__card_art.csv` rows 16–20 +
`card_art_memory_card_procedural` (row 22, procedural template for the
apprentice-permadeath trial).

**§2.C.4.1 The Standstill (C1 unlock — Epic Light):**

**Output:** `apps/client/public/art/cards/act1/card-art-standstill.png` + `.webp`

> Square card-art composition (1024×1024). A single hourglass center-frame, but the sand is FROZEN MID-FALL — a thin column of grain suspended between the upper and lower bulbs, neither falling nor settling. The brass frame shows wear. Behind the hourglass: out-of-focus rust-orange `#e06a1a` Vortex sky from the Nexon battlefield, low muzzle-flash light at the bottom of the frame, but the immediate space around the hourglass holds a small bubble of warm-gold neutral light — the canonical 'one turn delay' rendered as physics-paused-locally. Lower third clean for the card-name banner. The card is Epic Light; the visual register is the WORLD HOLDING ITS BREATH. Render the suspended sand grain with crisp clarity; the war beyond it should be soft-focused so the viewer's eye lands on the frozen pause.

**§2.C.4.2 The Converter (C2 unlock — Legendary Dark):**

**Output:** `apps/client/public/art/cards/act1/card-art-converter.png` + `.webp`

> Square card-art composition (1024×1024). A single soldier's helmet center-frame, lying on its side on a dusty Zenon battlefield surface. The helmet is HALF Insurgency mustard-yellow `#eab308` (the side facing the viewer, with a faded Insurgency medic patch visible on the shell), and HALF Warlord black-gunmetal `#1a1410` (the side facing away). The helmet's interior shows the canonical seam between the two — a thin line of cool-blue `#3b82f6` light tracing the conversion edge (intentional rhyme with Wanda's optic-rings, plants the swarm-and-cyborg connection). Background: out-of-focus Zenon battlefield smoke, distant rust-orange muzzle-flash low in the frame. Lower third clean for the card-name banner. The card is Legendary Dark; the visual register is the CANONICAL CONVERSION — render with care, not with menace. Wanda's canonical loss is that she IS what she converted.

**§2.C.4.3 The Friend I Saved (C3 Mythic Light unlock):**

**Output:** `apps/client/public/art/cards/act1/card-art-friend-i-saved.png` + `.webp`

> Square card-art composition (1024×1024). The Engineer's right hand center-frame, palm-up, fingers slightly curled. A single silver-mercury droplet rests in the center of his palm, perfectly spherical, catching the warm-gold work-lamp light from above. The droplet is canonically a small piece of the Warlord's nano-swarm — render as brushed-mercury `#a8aab2` with a faint cool-blue `#3b82f6` specular highlight on its surface (the swarm's signature palette inversion: warm light enters silver, leaves cool-blue). Background: out-of-focus warm-gold light from the Vortex bay's overhead work-lamp, with the bokeh of the Resurrection Protocols' status LED visible as a soft small blue point in the upper-right of the frame. NO faces. The hand is the entire image. Lower third clean for the card-name banner — but reserve a small space for the procedural N-score flavor text (per §2.12, the flavor text varies by C3 N-value). The card is MYTHIC LIGHT — only the second Mythic in Act 1; the visual register is GIFT-AT-COST. Render the droplet as the entire emotional weight of the composition; the hand is offering, not holding.

**§2.C.4.4 The Last Word (C4 Mythic Light unlock):**

**Output:** `apps/client/public/art/cards/act1/card-art-last-word.png` + `.webp`

> Square card-art composition (1024×1024). A single vintage broadcast microphone center-frame, mounted on a small polished black-stone surface — the canonical Tribunal-chamber-or-cell recording setup. The microphone is brass-bodied with a fine wire-mesh diaphragm; it shows a faint condensation halo around the mesh (the Engineer is breathing into it, right now). Warm-yellow Authority-spec spotlighting from above, hard down-shadow on the stone surface. Visible in soft focus behind the microphone: the unrolled Tribunal verdict scroll — partially or fully filled with ink lines depending on win/loss path; for the base still, render at half-fill so producers can composite the win/loss epigraph variant. NO faces. NO hands. The microphone is the entire subject. Lower third clean for the card-name banner. The card is MYTHIC LIGHT — the second of two Mythics in Act 1, alongside The Friend I Saved. The visual register is THE MOMENT BEFORE THE WORDS — render the breath-condensation as the canonical detail; the player should feel that the recording is about to begin and that everything in the universe will hear it.

**§2.C.4.5 Memory Card (apprentice permadeath — procedural template, Epic Light):**

**Output:** `apps/client/public/art/cards/act1/card-art-memory-card-procedural.png` + `.webp`
**Type:** template — runtime composites the deceased apprentice's
canonical portrait into the central slot. Generate ONCE as a generic
memorial frame.

> Square card-art composition (1024×1024) — PROCEDURAL TEMPLATE. The base composition is a generic apprentice portrait slot at center-frame, framed by a soft warm-gold memorial overlay (faint candle-light glow rim, fine particulate dust drifting upward, the canonical Witnessing-chorus visual cue). Producers composite the deceased apprentice's canonical portrait (from `apps/shared/apprentices.ts` generated identity) into the slot at runtime. The frame around the portrait: a thin brushed-brass border with three small notch marks at the bottom — one notch per trait that survived the player's choices (Resilience / Trust / Clarity). For the base still, render the portrait slot as a soft-focus silhouette of an apprentice-aged figure (no face details), the brass frame complete, the three notches present. Background: out-of-focus warm-gold candle-light, deep shadow at the corners. Lower third clean for the procedurally-generated apprentice name banner ('[Name] — In Memory'). The card is Epic Light; the visual register is MEMORIAL not reward. The §20.4 procedural flavor text branch (Resilience/Trust/Clarity-tanked variant) appears in the lower frame, not on the art itself.

---

### §2.C.5 Mid-Cycle Cutscene — *Hacking Reality* (fires after C1 / Warlord-Zero-First)

**Output:** `apps/client/public/videos/act1/hacking-reality.mp4`
**Duration:** 35s (range 30–40s) @ 24fps, 16:9
**Status:** MISSING — prompts already authored in
`docs/production/act1-asset-build/prompts/cutscenes/hacking-reality_{start_frame,end_frame,motion}.txt`
**Bible:** `ACT_1_SHIP_READY_BIBLE.md` §6.3
**Fires after:** `the_warlord_zero_first` match resolves
**Flags set:** `act1_hacking_reality_shown`, `architect_reality_edit_witnessed`

**Dependencies:**
- Start PNG: `assets/intermediate/act1/cutscenes/hacking-reality_start.png`
- End PNG: `assets/intermediate/act1/cutscenes/hacking-reality_end.png`

**START FRAME prompt:**
> The §4.3 Nexon breach in the aftermath of the match. Two chairs at the card-table, one occupied by the Warlord (seen from behind — pauldron silhouette, visor-rim just visible), one occupied by the Engineer (seen from behind, cyan-grey blazer, face not visible). The card-table surface is lit by the amber spotlight. One final card face-up between them in the table's center. The Nexon skyline is dimmer than the environment still — the fighting has paused for this one match to resolve. Ember-orange still glowing on the horizon. Cinematic 4K. No rendered text.

**END FRAME prompt:**
> Same camera position, seconds later. The card-table is gone — not removed, replaced: the brass table has become a seamless polished black marble surface of the same shape and size, as if reality has been pasted-over where the table used to be. The two chairs are gone similarly; where the chairs sat, there are now two identical black marble plinths of the exact same silhouette, continuous with the new tabletop. The Engineer is no longer there — where he sat, there is only the plinth and a thin trail of cyan-grey cloth dust drifting down into a pile (the memoir will later name this the dust where he was). The Warlord still stands behind the transformed table, unmoving, visor still facing the plinth where the Engineer was. The ruined parapet behind her has also begun to change — the brass edges softening into black marble at the frame edges, a ripple of reality-edit spreading outward from the card-table to consume the battlefield itself. The ember-orange city glow in the far distance remains unchanged. Palette: black marble `#1c1a1a` on the edit-zone, dusky chrome `#6b6b65` on the Warlord's unchanged armor, ember-orange `#e06a1a` in the far background, cyan-grey cloth-dust `#8b9199` where the Engineer was. Cinematic 4K. The memoir is saying: the Engineer was there. Then he was not, because someone changed the room. No rendered text.

**VEO 3.1 motion prompt:**
> Open on start frame — two chairs, one final card on the card-table, Warlord and Engineer both seated. Hold 3s. Beat at 4s: Warlord's voice lands ("I said three moves. I meant three edits.") as her gauntleted hand lifts from the card-table surface. Beat at 8s: reality-edit beat 1 — the final card on the table dissolves into a fine geometric lattice and reforms as a blank black square, as if the card had never been played. Beat at 14s: reality-edit beat 2 — the brass card-table itself ripples in one continuous wave from center outward and reforms as polished black marble, the chairs warping into marble plinths along with it; the Warlord does not move, but the Engineer's silhouette becomes briefly translucent. Beat at 22s: reality-edit beat 3 — the camera's framing edges warp inward for a split second as the reality-edit radius expands; the Engineer is no longer in his chair-plinth, only the cyan-grey cloth-dust pile remains. The Warlord is still. Beat at 28s: Engineer's VO (off-camera) "She said three moves. She meant three edits. The third one was the rules themselves." Final 8s: slow pull-back revealing the edit radius spreading across the ruined parapet, freezing just short of the distant ember-orange city. Slow fade to dust-brown black. 24fps. Grave, clinical, the opposite of spectacle. The horror is the calm.

**Veo config:** 35s · 16:9 · 24fps · locked-frame reality-edit
sequence. The three reality-edit beats (card, table, Engineer) are
hard transitions — Veo may fumble them. Fallback: render card-dissolve
as a separate 2s clip via alpha-atlas, table-morph as a 6s Veo
image-to-video with explicit mid-keyframe, Engineer-fade as a 3s alpha
animation. Composite in After Effects.

**Canon hygiene:** Engineer faceless throughout (seen from behind → ash
pile). Warlord visor full-face, still only iridescent-shimmer canon.

**Audio hand-off:**
- VO `vo-warlord-three-edits` @ ~4s — status: `prompted` / NOT recorded.
  Output `apps/client/public/audio/act1/warlord_three_edits.mp3`,
  duration 3s. ElevenLabs `the_warlord` voice profile + post-processing
  `warlord_visor_eq_preset` (visor-muffled high-frequency rolloff).
  Line: "I said three moves. I meant three edits."
- VO `vo-prince-third-edit-rules` @ ~28s — status: `prompted` / NOT
  recorded. Output
  `apps/client/public/audio/act1/prince_third_edit_rules.mp3`, duration
  5s. ElevenLabs `the_prince` (Engineer memoir voice) profile. Line:
  "She said three moves. She meant three edits. The third one was the
  rules themselves."
- No ambient bed; fires + wind + reality-edit stinger SFX runtime.

---

### §2.C.fin  Cycle C Finale — *Last Words* (React wiring, NOT a Veo render)

**Component:** `apps/client/src/components/act1/Act1CycleCAuthorityWitnessing.tsx`
**Helpers:** `apps/client/src/components/act1/act1CycleCWitnessing.ts`
**Tests:** `apps/client/src/components/act1/act1CycleCWitnessing.test.ts`
**Status:** `DONE-CODE` — shipped in PR #89. `art_required: false` per
`asset_prompt_manifest.json`.

This cycle finale does NOT render a Veo MP4. It renders a slideshow in
React, reading:

- **Slide images:** `apps/client/public/art/prelude/last-words/slide-{1..4}-{1..5}.webp` (4 × 5 grid = 20 slides, shared with the Prelude Beat J Archives cutscene). **Status to verify:** slide WebPs are referenced in the manifest — confirm they exist locally at `apps/client/public/art/prelude/last-words/` OR on the dgrsart primary CDN; render if missing.
- **Audio:** `apps/client/public/audio/music/song_last_words_prelude_cut.mp3` — shared with Beat J §1.J.5 (**MISSING**, still to be produced by the canon-expansion pipeline).
- **Duration:** 219.8s (~3m 40s).
- **State writes:** `GameContext.setLightDarkAlignment` + narrative flags `act1_cycle_c_alignment_light` or `act1_cycle_c_alignment_dark`.
- **Skip default:** `light`.
- **Flags set:** `act_1_cycle_c_complete`, `act1_cycle_c_alignment_light|act1_cycle_c_alignment_dark`.

**Remaining asset work for this cycle finale:** produce the *Last Words*
song file (§1.J.5) and confirm the 20 slide WebPs exist locally. No new
Veo render.

### §2.C.fin2  Two Witnesses Part 2 (Antiquarian Section 6 slideshow wiring)

**Component:** `apps/client/src/components/act1/TwoWitnessesPart2.tsx` (scaffolded, PR TBD)
**Status:** `scaffolded`, `art_required: false`. Uses
`apps/client/public/art/rooms/room-archives.webp` as a static backdrop
(satisfied by §1.J.2 processing).
**Duration:** 240s (~4m).
**VO manifest:** `docs/production/act1-asset-build/prompts/voice/section6_antiquarian.csv` — **19 Antiquarian lines** still to record against the `antiq_fc_1` voice profile.
**Fires after:** `act1_complete` (post-Authority).
**Flags set:** `witness_antiquarian_met_part2`, `witness_enigma_met_part2`.
**State writes:** `GameState.act1_closingChoice` via a `ChoicePillarAcceptDeclineDeflect` UI.

---

## §2.D  Act 1 Finale Cutscene

Per `ACT_1_SHIP_READY_BIBLE.md` §18 and the asset manifest: the Act 1
Finale is NOT a separate Veo render. The post-Authority epilogue is
the *Last Words* finale wiring (§2.C.fin) plus the Two Witnesses Part 2
slideshow wiring (§2.C.fin2) plus the §18 Tribunal-verdict epilogue
card-art branches (Mythic Light `The Last Word` already covered in
§2.C.4.4).

**No additional Veo work required** beyond the per-cycle finales above
once the *Last Words* song and the 20 last-words slide WebPs are
delivered.

---

## §2.E  Act 1 — VO lines (cutscene narration + Section 6 bundle)

### §2.E.1 Cutscene narration — 4 lines

All `prompted`, none recorded. Render via ElevenLabs.

| Line ID | Cutscene | Speaker | Voice profile | Output | Duration | Source line |
|---|---|---|---|---|---|---|
| `vo-little-watcher-sixteen-versions` | `welcome-to-celebration` | Little Watcher | `little_watcher` | `apps/client/public/audio/act1/little_watcher_sixteen_versions.mp3` | 3.5s | "I have watched sixteen versions of you already." |
| `vo-prince-to-be-the-human` | `to-be-the-human` | The Prince (Engineer memoir) | `the_prince` | `apps/client/public/audio/act1/prince_to_be_the_human.mp3` | 8s | "He walked out of the Academy gate. He would not be called the Detective again for a very long time. He would be something else first." |
| `vo-warlord-three-edits` | `hacking-reality` | The Warlord | `the_warlord` + `warlord_visor_eq_preset` post | `apps/client/public/audio/act1/warlord_three_edits.mp3` | 3s | "I said three moves. I meant three edits." |
| `vo-prince-third-edit-rules` | `hacking-reality` | The Prince | `the_prince` | `apps/client/public/audio/act1/prince_third_edit_rules.mp3` | 5s | "She said three moves. She meant three edits. The third one was the rules themselves." |

**Full scripts:** `docs/production/act1-asset-build/prompts/voice/cutscene_narration.csv`.

### §2.E.2 Section 6 Antiquarian bundle — 19 lines

**Speaker:** Antiquarian
**Voice profile:** `antiq_fc_1` (same as Prelude Beat J's `antiq_fc_1`)
**Filename pattern:** `antiq_s6_{line_id}.mp3`
**Output dir:** `apps/client/public/audio/antiquarian/`
**CSV manifest:** `docs/production/act1-asset-build/prompts/voice/section6_antiquarian.csv`
**Status:** `drafted` — 19 lines scripted, none recorded.
**Bible:** §9.10 / §9.10.1 of the UNIVERSAL prompting doc.

These lines drive the post-Authority Two Witnesses Part 2 slideshow
wiring (§2.C.fin2). Render all 19 in one ElevenLabs batch against the
`antiq_fc_1` voice profile.

### §2.E.3 UI components (4) — DONE-CODE or prompted

Per manifest:

| Component | File | Status |
|---|---|---|
| `VerdictStreamColumn` | `apps/client/src/components/act1/VerdictStreamColumn.tsx` | `prompted` — scaffolded, production-ready per design doc `docs/production/act1/public-witness-ui-spec.md`. |
| `AuthorityPhaseBar` | `apps/client/src/components/act1/AuthorityPhaseBar.tsx` | `prompted` — per `docs/production/act1/authority-trial-phase-mechanic.md`. |
| `WarlordLockoutChip` | `apps/client/src/components/act1/WarlordLockoutChip.tsx` | `prompted` — per `docs/production/act1/warlord-three-move-mechanic.md`. |
| `SeerCardFlicker` | `apps/client/src/components/act1/SeerCardFlicker.tsx` | `prompted` — CSS/shader, no art asset required. |

These are code deliverables, not render deliverables. Treat as
implementation tasks for the client team.

### §2.E.4 Animator reference (3) — 1 shipped, 2 prompted

| Ref | Output | Status |
|---|---|---|
| Enigma blocking reference PNG (2×2 panel, 1920×1080) | `docs/production/act1/reference/enigma-blocking-sheet.png` | `prompted` |
| Enigma gaze timeline CSV (24 rows) | `docs/production/act1/reference/enigma-gaze-timeline.csv` | `shipped` |
| Enigma branch deltas MD (3 pages) | `docs/production/act1/reference/enigma-branch-deltas.md` | `shipped` |

---

# §11  Processing pipeline for INTERMEDIATE assets

Everything tagged `INTERMEDIATE` in Parts 1 & 2 is already rendered —
it sits in `assets/intermediate/prelude/` as an unprocessed source
file. Processing is mechanical and should be done first, before any
new renders.

### §11.1 Room PNG → WebP (13 Prelude rooms)

**Source directory:** `assets/intermediate/prelude/rooms/`
**Source files:** `room-{cryo-bay,corridor,engineering,cargo-hold,galley,mess-hall,briefing-room,medical-bay,comms-array,archives,bridge,armory,captains-quarters}_original.png`
**Target directory:** `apps/client/public/art/rooms/`

Per room, produce both a PNG and a WebP at the canonical path (no
`_original` suffix):

```bash
# Requires: imagemagick, cwebp (libwebp-tools)
for src in assets/intermediate/prelude/rooms/room-*_original.png; do
  name=$(basename "$src" _original.png)      # e.g. room-cryo-bay
  cp "$src" "apps/client/public/art/rooms/${name}.png"
  cwebp -q 82 "$src" -o "apps/client/public/art/rooms/${name}.webp"
done
```

**Quality target:** `-q 82` (matches the existing convention in
`apps/client/public/art/rooms/mystery-states/cryo-bay_*.webp` per
`docs/production/ASSET_URLS.md`). Expected file sizes: ~250–400 KB
per WebP, ~1.5–3 MB per PNG.

After processing, run:

```bash
pnpm tsx apps/scripts/upload-public-to-s3.ts --only=art
```

to push to `dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/`.
Verify `apps/server/preludeReadiness.test.ts` stops flagging the
canonical paths as missing.

### §11.2 Ambient WAV → MP3 + EBU R128 loudnorm (3 beds)

**Source:** `assets/intermediate/prelude/audio/ambient_{bridge_powered_systems_mix,neural_rig_hum,transfer_array_standby}.wav`
**Target:** `apps/client/public/audio/ambient/prelude/*.mp3`

Per bible §4.6 / §13.6 / §16.6 loudness targets:

| Bed | Target LUFS | True peak | LRA |
|---|---|---|---|
| `ambient_bridge_powered_systems_mix` | -18 LUFS | -1 dBTP | ≤ 8 LU |
| `ambient_neural_rig_hum` | -19 LUFS | -1 dBTP | ≤ 6 LU |
| `ambient_transfer_array_standby` | -20 LUFS | -1 dBTP | ≤ 6 LU |

Single-pass encode (FFmpeg's `loudnorm` filter — two-pass is ideal, but
single-pass is acceptable for seamless loops):

```bash
# Bridge (-18 LUFS):
ffmpeg -i assets/intermediate/prelude/audio/ambient_bridge_powered_systems_mix.wav \
  -af "loudnorm=I=-18:TP=-1:LRA=8" \
  -c:a libmp3lame -q:a 2 \
  apps/client/public/audio/ambient/prelude/ambient_bridge_powered_systems_mix.mp3

# Neural rig (-19 LUFS):
ffmpeg -i assets/intermediate/prelude/audio/ambient_neural_rig_hum.wav \
  -af "loudnorm=I=-19:TP=-1:LRA=6" \
  -c:a libmp3lame -q:a 2 \
  apps/client/public/audio/ambient/prelude/ambient_neural_rig_hum.mp3

# Transfer array (-20 LUFS):
ffmpeg -i assets/intermediate/prelude/audio/ambient_transfer_array_standby.wav \
  -af "loudnorm=I=-20:TP=-1:LRA=6" \
  -c:a libmp3lame -q:a 2 \
  apps/client/public/audio/ambient/prelude/ambient_transfer_array_standby.mp3
```

Run `upload-public-to-s3.ts --only=audio` after.

### §11.3 VFX MP4 → WebM VP9 w/ alpha (6 VFX)

**Source:** `assets/intermediate/prelude/vfx/{breath-pulse-strip,cryo-frost-retreat,film-damage-overlay,hologram-materialize,pod-hatch-cryogas,sepia-drain}.mp4`
**Target:** `apps/client/public/art/vfx/prelude/*.webm`

The intermediate MP4s already carry the motion; convert to WebM VP9
with alpha channel preserved. If the MP4s lack alpha (ProRes 4444 or
RGBA source preferred), the convert step needs to key a background
color to alpha first — check with `ffprobe` before batch-converting.

```bash
for src in assets/intermediate/prelude/vfx/*.mp4; do
  name=$(basename "$src" .mp4)
  ffmpeg -i "$src" \
    -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 2M -deadline good -cpu-used 2 \
    -auto-alt-ref 0 \
    -an \
    "apps/client/public/art/vfx/prelude/${name}.webm"
done
```

**If alpha is not present in source:** fall back to rendering on a
chroma-key background (pure green `#00ff00`) and key in post, OR
re-request alpha source from the intermediate renderer.

### §11.4 Upload + verify

Once all §11.1–11.3 steps complete:

```bash
pnpm tsx apps/scripts/upload-public-to-s3.ts         # full sweep
pnpm --filter server vitest run preludeReadiness.test.ts
```

The readiness test's dashboard logs should show room-asset deliveries
jumping from 0 to 13 and VFX deliveries jumping from 0 to 6.

### §11.5 Download last-words slides if missing

The Cycle C finale (`§2.C.fin`) depends on
`apps/client/public/art/prelude/last-words/slide-{1..4}-{1..5}.webp`
(20 slides). These may exist on the primary CDN but not locally. Check:

```bash
ls apps/client/public/art/prelude/last-words/ 2>/dev/null || \
  aws s3 cp s3://dgrsart/cdn/client-public/art/prelude/last-words/ \
    apps/client/public/art/prelude/last-words/ \
    --recursive
```

If neither exists, render via Nano Banana 2 per the slideshow frame
descriptions in `CANON_REV_7_ORACLE_VEX_EXPANSION.md §5.6.9` /
`SHIP_READY_ASSET_BIBLE.md §3.7`.

---

# PART 3 — Asset Delivery Checklist (flat)

One row per asset. **Work the INTERMEDIATE rows first (§11 pipeline),
then the MISSING rows in priority order.** `DONE-*` rows are
informational — no action required.

### §3.1 Prelude — cutscenes (15)

| Beat | Output | Duration | Status | Tool | Priority |
|---|---|---|---|---|---|
| A | `apps/client/public/videos/prelude/prelude-beat-a-awakening.mp4` | 35s | MISSING | Veo 3.1 | P0 |
| A.5 | `apps/client/public/videos/prelude/prelude-beat-a5-corridor.mp4` | 15s | MISSING | Veo 3.1 | P0 |
| B | `apps/client/public/videos/prelude/prelude-beat-b-escape.mp4` | 20s | MISSING | Veo 3.1 | P0 |
| C | `apps/client/public/videos/prelude/prelude-beat-c-crew-and-incubators.mp4` | 35s | MISSING | Veo 3.1 | P0 |
| C.5 | `apps/client/public/videos/prelude/prelude-beat-c5-window.mp4` | 20s | MISSING | Veo 3.1 | P0 |
| D | `apps/client/public/videos/prelude/prelude-beat-d-cargo-bay.mp4` | 30s | MISSING | Veo 3.1 | P0 |
| D.5 | `apps/client/public/videos/prelude/prelude-beat-d5-galley.mp4` | 25s | MISSING | Veo 3.1 | P0 |
| E | `apps/client/public/videos/prelude/prelude-beat-e-mess-hall-flashback.mp4` | 45s | MISSING | Veo 3.1 (split-render) | P0 |
| F | `apps/client/public/videos/prelude/prelude-beat-f-briefing-room.mp4` | 30s | MISSING | Veo 3.1 (rendered-text) | P0 |
| F.5 | `apps/client/public/videos/prelude/prelude-beat-f5-empty-chair.mp4` | 90s | MISSING | Veo 3.1 (split 30+30+30) | P0 |
| G | `apps/client/public/videos/prelude/prelude-beat-g-medical-bay.mp4` | 25s | MISSING | Veo 3.1 | P0 |
| H | `apps/client/public/videos/prelude/prelude-beat-h-comms-array.mp4` | 25s | MISSING | Veo 3.1 | P0 |
| H.5 | `apps/client/public/videos/prelude/prelude-beat-h5-memo-pile.mp4` | 20s | MISSING | Veo 3.1 | P0 |
| I | `apps/client/public/videos/prelude/prelude-beat-i-bridge-witnessing-activate.mp4` | 40s | MISSING | Veo 3.1 (split A+B) | P0 |
| J | `apps/client/public/videos/prelude/prelude-beat-j-archives.mp4` | ~8m10s | MISSING | Veo 3.1 (10-clip split-render) | P0 |

### §3.2 Prelude — rooms (13)

All rooms have `_original.png` sources in `assets/intermediate/prelude/rooms/`.

| Room | Output (PNG + WebP) | Status | Action |
|---|---|---|---|
| cryo-bay | `apps/client/public/art/rooms/room-cryo-bay.{png,webp}` | INTERMEDIATE + DONE-CDN-LEGACY | §11.1 process |
| corridor | `apps/client/public/art/rooms/room-corridor.{png,webp}` | INTERMEDIATE | §11.1 process |
| engineering | `apps/client/public/art/rooms/room-engineering.{png,webp}` | INTERMEDIATE + DONE-CDN-LEGACY | §11.1 process |
| cargo-hold | `apps/client/public/art/rooms/room-cargo-hold.{png,webp}` | INTERMEDIATE + DONE-CDN-LEGACY | §11.1 process |
| galley | `apps/client/public/art/rooms/room-galley.{png,webp}` | INTERMEDIATE | §11.1 process |
| mess-hall | `apps/client/public/art/rooms/room-mess-hall.{png,webp}` | INTERMEDIATE | §11.1 process |
| briefing-room | `apps/client/public/art/rooms/room-briefing-room.{png,webp}` | INTERMEDIATE | §11.1 process |
| medical-bay | `apps/client/public/art/rooms/room-medical-bay.{png,webp}` | INTERMEDIATE + DONE-CDN-LEGACY | §11.1 process |
| comms-array | `apps/client/public/art/rooms/room-comms-array.{png,webp}` | INTERMEDIATE + DONE-CDN-LEGACY | §11.1 process |
| archives | `apps/client/public/art/rooms/room-archives.{png,webp}` | INTERMEDIATE + DONE-CDN-LEGACY | §11.1 process (high priority — Act 1 pages depend on it) |
| bridge | `apps/client/public/art/rooms/room-bridge.{png,webp}` | INTERMEDIATE + DONE-CDN-LEGACY | §11.1 process (ResponsiveImage hard-coded path) |
| armory | `apps/client/public/art/rooms/room-armory.{png,webp}` | INTERMEDIATE + DONE-CDN-LEGACY | §11.1 process |
| captains-quarters | `apps/client/public/art/rooms/room-captains-quarters.{png,webp}` | INTERMEDIATE + DONE-CDN-LEGACY | §11.1 process |
| observation-deck | `apps/client/public/art/rooms/room-observation-deck.{png,webp}` | DONE-CDN-LEGACY only (no intermediate) | Re-download from legacy CDN and place at canonical path, OR regenerate from `docs/production/prelude-asset-build/prompts/rooms/room-observation-deck.txt` |

### §3.3 Prelude — state-aware room variants (8 already on CDN)

| Variant | Output | Status |
|---|---|---|
| Cryo Bay × 4 states | `/art/rooms/mystery-states/cryo-bay_{initial,investigating,victim-identified,case-open-later}.webp` | DONE-CDN-LEGACY per `ASSET_URLS.md` Section F |
| Medical Bay × 4 states | `/art/rooms/mystery-states/medical-bay_{initial,device-awakened,donated,refused}.webp` | DONE-CDN-LEGACY per `ASSET_URLS.md` Section F |

Mirror to primary CDN via `upload-public-to-s3.ts` after placing
locally.

### §3.4 Prelude — VFX (23 total)

**DONE-CODE** (17, no file required): `vfx_amber_counter_glyph`,
`vfx_bench_standby_pip`, `vfx_chair_rim_hot_edge`,
`vfx_choice_pillar_light_dark_split`,
`vfx_data_slate_glow`, `vfx_elara_fade_out`,
`vfx_galley_pilot_warm` (AmberGlow), `vfx_inbox_edge_sentence_bloom`,
`vfx_inbox_envelope_unfold`, `vfx_incubator_pod_dormant_glow`,
`vfx_lockbox_bio_recognize`, `vfx_med_pod_faint_pulse`,
`vfx_memory_crystal_pulse`, `vfx_neural_rig_idle_hum_visual`,
`vfx_peripheral_warm_halo`, `vfx_primary_lights_cascade`,
`vfx_signal_intake_lit_panel`, `vfx_status_pip_color_shift`,
`vfx_transfer_array_amber_standby`,
`vfx_viewport_polarization_lift`, `vfx_witnessing_hub_hemisphere_bloom`.

**INTERMEDIATE** (6, §11.3 process):

| VFX | Source MP4 | Target WebM |
|---|---|---|
| `vfx_breath_pulse_strip` | `assets/intermediate/prelude/vfx/breath-pulse-strip.mp4` | `apps/client/public/art/vfx/prelude/breath-pulse-strip.webm` |
| `vfx_cryo_frost_retreat` | `assets/intermediate/prelude/vfx/cryo-frost-retreat.mp4` | `apps/client/public/art/vfx/prelude/cryo-frost-retreat.webm` |
| `vfx_film_damage_overlay` | `assets/intermediate/prelude/vfx/film-damage-overlay.mp4` | `apps/client/public/art/vfx/prelude/film-damage-overlay.webm` |
| `vfx_hologram_materialize` | `assets/intermediate/prelude/vfx/hologram-materialize.mp4` | `apps/client/public/art/vfx/prelude/hologram-materialize.webm` |
| `vfx_pod_hatch_cryogas` | `assets/intermediate/prelude/vfx/pod-hatch-cryogas.mp4` | `apps/client/public/art/vfx/prelude/pod-hatch-cryogas.webm` |
| `vfx_sepia_drain` | `assets/intermediate/prelude/vfx/sepia-drain.mp4` | `apps/client/public/art/vfx/prelude/sepia-drain.webm` |

**MISSING** (10, need Nano Banana 2 + Veo 3.1 render per §1.X):

| VFX | Output WebM | Duration | Section |
|---|---|---|---|
| `vfx_iris_hatch_open` | `apps/client/public/art/vfx/prelude/iris-hatch-open.webm` | 3s | §1.B.3 |
| `vfx_role_wireframe_bloom` | `apps/client/public/art/vfx/prelude/role-wireframe-bloom.webm` | 2.5s | §1.C.3 |
| `vfx_starfield_drift_viewport` | `apps/client/public/art/vfx/prelude/starfield-drift.webm` | 10s loop | §1.C.5.3 |
| `vfx_human_palm_frost` | `apps/client/public/art/vfx/prelude/human-palm-frost.webm` | 4s | §1.C.5.3 ⚠ CRITICAL |
| `vfx_starlight_shaft_dust` | `apps/client/public/art/vfx/prelude/starlight-shaft-dust.webm` | 8s loop | §1.D.3 |
| `vfx_mission_glyph_bloom` | `apps/client/public/art/vfx/prelude/mission-glyph-bloom.webm` | 1.5s | §1.D.3 |
| `vfx_galley_steam_residue` | `apps/client/public/art/vfx/prelude/galley-steam-residue.webm` | 6s loop (P1/OPTIONAL) | §1.D.5.3 |
| `vfx_diploma_ink_bloom` | `apps/client/public/art/vfx/prelude/diploma-ink-bloom.webm` | 2s | §1.E.3 |
| `vfx_memo_holo_rise` | `apps/client/public/art/vfx/prelude/memo-holo-rise.webm` | 3.5s (rendered-text) | §1.F.3 |
| `vfx_memo_paper_drift` | `apps/client/public/art/vfx/prelude/memo-paper-drift.webm` | 5s | §1.H.5.3 |
| `vfx_log5_beam_transfer` | `apps/client/public/art/vfx/prelude/log5-beam-transfer.webm` | 3s | §1.J.3 |
| `vfx_holo_pedestal_bloom` ×3 | `holo-pedestal-bloom{,.activation,-steady_state}.webm` | 3s + 3s + 8s loop | §1.J.3 |
| `vfx_enigma_hand_on_rim` | `apps/client/public/art/vfx/prelude/enigma-hand-on-rim.webm` | 2s (subtle) | §1.J.3 |

### §3.5 Prelude — audio beds (3)

| Bed | Target MP3 | Status | LUFS |
|---|---|---|---|
| `ambient_neural_rig_hum` | `apps/client/public/audio/ambient/prelude/ambient_neural_rig_hum.mp3` | INTERMEDIATE | -19 |
| `ambient_transfer_array_standby` | `apps/client/public/audio/ambient/prelude/ambient_transfer_array_standby.mp3` | INTERMEDIATE | -20 |
| `ambient_bridge_powered_systems_mix` | `apps/client/public/audio/ambient/prelude/ambient_bridge_powered_systems_mix.mp3` | INTERMEDIATE | -18 |

All three ready for §11.2 `loudnorm` pass.

### §3.6 Prelude — VO lines (10 recorded + reactive layer)

**All** Prelude VO lines are `DONE-S3-VO` and wired into manifests at
`apps/shared/{elara,human,locke,prince,antiquarian}VoManifest.json`.
Full URL list inline in §1.A–§1.J entries above. No action required.

### §3.7 Prelude — songs

| Song | Target | Status |
|---|---|---|
| `song_last_words_prelude_cut.mp3` | `apps/client/public/audio/music/song_last_words_prelude_cut.mp3` | MISSING (owned by canon-expansion pipeline per `CANON_REV_7_ORACLE_VEX_EXPANSION.md §5.6.9`) |
| Log 5 long-form playback (~6m40s, Prince voice) | TBD — used inside Beat J | MISSING (likely canon-expansion pipeline) |

### §3.8 Act 1 — rooms (5 primary + 10 battlefield backdrops)

| Asset | Output | Status | Source prompt |
|---|---|---|---|
| `room-kindergarten` | `apps/client/public/art/rooms/room-kindergarten.{png,webp}` | MISSING | §2.A.1 |
| `room-mechronis-atrium` | `apps/client/public/art/rooms/room-mechronis-atrium.{png,webp}` | MISSING | §2.B.1 |
| `room-nexon-battlefield` | `apps/client/public/art/rooms/room-nexon-battlefield.{png,webp}` | MISSING | §2.C.1.1 |
| `room-zenon-cell` | `apps/client/public/art/rooms/room-zenon-cell.{png,webp}` | MISSING | §2.C.1.2 |
| `room-authority-gallery` | `apps/client/public/art/rooms/room-authority-gallery.{png,webp}` | MISSING | §2.C.1.3 |
| `bf_celebration_schoolyard_day10` | `apps/client/public/art/backdrops/act1/bf-celebration-schoolyard-day10.png` | MISSING | CSV |
| `bf_celebration_schoolyard_day20` | `…/bf-celebration-schoolyard-day20.png` | MISSING | CSV |
| `bf_celebration_pavilion_day28` | `…/bf-celebration-pavilion-day28.png` | MISSING | CSV |
| `bf_mechronis_classroom_standard` | `…/bf-mechronis-classroom-standard.png` | MISSING | CSV |
| `bf_mechronis_common_room` | `…/bf-mechronis-common-room.png` | MISSING | CSV |
| `bf_nexon_command_bunker` | `…/bf-nexon-command-bunker.png` | MISSING | CSV |
| `bf_zenon_field_tent` | `…/bf-zenon-field-tent.png` | MISSING | CSV |
| `bf_vortex_pressurized_bay` | `…/bf-vortex-pressurized-bay.png` | MISSING | CSV |
| `bf_newbabylon_tribunal` | `…/bf-newbabylon-tribunal.png` | MISSING | CSV |
| `bf_ark_archives_dimmed` | `…/bf-ark-archives-dimmed.png` | MISSING | CSV |

CSV backdrops: `docs/production/act1-asset-build/manifests/act1_art_prompts__battlefield.csv`.

### §3.9 Act 1 — opponent portraits (12)

All MISSING, 3:4 / 1536×2048, Nano Banana 2.

| ID | Output | Section |
|---|---|---|
| `matchup-little-meme` | `apps/client/public/art/matchups/act1/little-meme.{png,webp}` | §2.A.3.1 |
| `matchup-little-collector` | `…/little-collector.{png,webp}` | §2.A.3.2 |
| `matchup-little-watcher` | `…/little-watcher.{png,webp}` | §2.A.3.3 |
| `matchup-detective-student` | `…/detective-student.{png,webp}` | §2.B.3.1 |
| `matchup-iron-lion-expelled` | `…/iron-lion-expelled.{png,webp}` | §2.B.3.2 |
| `matchup-professor-eidola` | `…/professor-eidola.{png,webp}` | §2.B.3.3 |
| `matchup-professor-matrikala` | `…/professor-matrikala.{png,webp}` | §2.B.3.4 |
| `matchup-seer-visit` | `…/seer-visit.{png,webp}` | §2.B.3.5 |
| `matchup-warlord-zero-first` | `…/warlord-zero-first.{png,webp}` | §2.C.3.1 |
| `matchup-programmer` | `…/programmer.{png,webp}` | §2.C.3.2 |
| `matchup-game-master-original` | `…/game-master-original.{png,webp}` | §2.C.3.3 |
| `matchup-the-authority` | `…/the-authority.{png,webp}` | §2.C.3.4 |

### §3.10 Act 1 — card art (14)

All MISSING, 1024×1024, Nano Banana 2. Full prompts in
`act1_art_prompts__card_art.csv`.

| Card | Rarity / Alignment | Section |
|---|---|---|
| `card_art_countermelody` | Common Neutral | §2.A.4.1 |
| `card_art_jar_wouldnt_close` | Rare Light | §2.A.4.2 |
| `card_art_first_card` | Epic Light | §2.A.4.3 |
| `card_art_iron_stance` | Rare Light | §2.B.4.1 |
| `card_art_recruiters_gift` | Epic Neutral | §2.B.4.2 |
| `card_art_weapon_i_didnt_build` | Legendary Dark | §2.B.4.3 |
| `card_art_memorized_page` | Epic Dark | §2.B.4.4 |
| `card_art_classmates_compass` | Legendary Light | §2.B.4.5 |
| `card_art_only_reason_i_stayed` | Legendary Dark | §2.B.4.6 |
| `card_art_standstill` | Epic Light | §2.C.4.1 |
| `card_art_converter` | Legendary Dark | §2.C.4.2 |
| `card_art_friend_i_saved` | Mythic Light ⭐ | §2.C.4.3 |
| `card_art_last_word` | Mythic Light ⭐ | §2.C.4.4 |
| `card_art_memory_card_procedural` | Epic Light (template) | §2.C.4.5 |

### §3.11 Act 1 — cutscenes (3 Veo + 2 wiring)

| ID | Output | Duration | Status | Section |
|---|---|---|---|---|
| `welcome-to-celebration` | `apps/client/public/videos/act1/welcome-to-celebration.mp4` | 40s | MISSING (prompted) | §2.A.5 |
| `to-be-the-human` | `apps/client/public/videos/act1/to-be-the-human.mp4` | 47s | MISSING (prompted) | §2.B.5 |
| `hacking-reality` | `apps/client/public/videos/act1/hacking-reality.mp4` | 35s | MISSING (prompted) | §2.C.5 |
| `cutscene-last-words-full` | React wiring — `Act1CycleCAuthorityWitnessing.tsx` | 219.8s | DONE-CODE (PR #89) | §2.C.fin |
| `cutscene-two-witnesses-part2` | React wiring — `TwoWitnessesPart2.tsx` | 240s | scaffolded | §2.C.fin2 |

### §3.12 Act 1 — VO (4 cutscene + 19 Section 6 = 23 lines)

| Bundle | Output dir | Count | Status | Section |
|---|---|---|---|---|
| Cutscene narration | `apps/client/public/audio/act1/` | 4 | prompted — not recorded | §2.E.1 |
| Section 6 Antiquarian | `apps/client/public/audio/antiquarian/antiq_s6_*.mp3` | 19 | drafted — not recorded | §2.E.2 |

### §3.13 Act 1 — UI components (4) + animator reference (3)

All code/doc deliverables, not render. Status per §2.E.3 + §2.E.4.

### §3.14 Act 1 — songs

| Song | Target | Status |
|---|---|---|
| `song_last_words_prelude_cut.mp3` | `apps/client/public/audio/music/song_last_words_prelude_cut.mp3` | MISSING — shared with Prelude Beat J |
| 20 × `slide-{1..4}-{1..5}.webp` (Last Words slideshow) | `apps/client/public/art/prelude/last-words/` | TBD — verify on CDN before rendering |

---

## §12  Priority order — operator workflow

1. **Process everything INTERMEDIATE** (§11). Zero cost, unblocks
   `preludeReadiness.test.ts` for 13 rooms, 6 VFX, 3 ambient beds.
   Upload via `upload-public-to-s3.ts`.
2. **Render the 10 missing Prelude VFX** via Nano Banana 2 + Veo 3.1
   per §1.B / §1.C / §1.C.5 / §1.D / §1.D.5 / §1.E / §1.F / §1.H.5 /
   §1.J. `human-palm-frost` is the single highest priority.
3. **Render the 14 missing Prelude cutscenes** in beat order A → J.
   Beat J is 10 separate Veo clips; split-render per §1.J.1.
4. **Render Act 1 rooms (5) + battlefields (10) + portraits (12) +
   card art (14)** via Nano Banana 2. Parallelizable — dispatch to
   the art pipeline as separate batches.
5. **Render Act 1 cutscenes (3)** via Veo 3.1: Welcome to Celebration,
   To Be the Human, Hacking Reality.
6. **Record Act 1 VO (23 lines)** via ElevenLabs. Cutscene narration (4)
   + Section 6 Antiquarian bundle (19).
7. **Produce / confirm song assets**: *Last Words* prelude cut + Log 5
   long-form + 20 Last Words slide WebPs.

---

## §13  Verification

After each section completes:

```bash
# Readiness dashboard — Prelude.
pnpm --filter server vitest run preludeReadiness.test.ts

# Bible cross-audit — catches existing-asset regressions.
pnpm --filter server vitest run preludeBibleAudit.test.ts

# Full asset-url upload + CDN verification.
pnpm tsx apps/scripts/upload-public-to-s3.ts --dry-run
```

When `preludeReadiness.test.ts`'s console dashboards show every
category at full delivery, flip those dashboards from `console.log` to
`expect.fail` (per the test's own design comment) to lock in the
completion state.

**Doc maintenance:** whenever an asset ships, update its row's status
tag in Parts 1–2 inline AND in the corresponding Part 3 checklist row.
The doc is the single source of truth for production status.
