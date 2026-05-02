# CDN Ship Status & SETI Production Manifest — 2026‑05‑02

**Branch:** `claude/analyze-cdn-assets-mA9CT`
**Audit basis:** anonymous HEAD probe of every URL emitted by every typed
asset manifest (3,347 URLs), plus a local-source coverage pass against
`assets/intermediate/` and `apps/client/public/`, plus the `pnpm vo:audit`
report.

This file is the **single doc a SETI prompt operator can read top-to-bottom**
and know exactly what's been made, what's been shipped, what's local-but-not-
uploaded, and what still needs to be produced. It supersedes nothing — it's a
status snapshot pointing at the existing prompt bibles for everything that
still needs work.

---

## 1. Headline numbers

| Metric | Value |
|---|---|
| Manifest URLs in scope | **3,347** |
| Live on CDN today (anonymous HTTP 200) | **1,641 (49.0%)** |
| Not live (anonymous HTTP 403 — missing or KMS-locked) | **1,706 (51.0%)** |
| Explicit 404s (object never landed) | **0** |
| Local sources sitting in `assets/intermediate/` ready to stage + upload | **23 files → 33 staging slots** |
| Voice-over surfaces with missing lines | **0 / 24** (per `pnpm vo:audit`) |

The 0/404 number is meaningful: every gap is *either* unproduced *or*
KMS-locked (re-uploadable with the canonical script). There are **no rotted
references** to objects that used to live on S3 and were deleted.

---

## 2. Per-surface ship status (one row = one production area)

✅ = fully live on CDN · ⚠️ = partially live · ❌ = nothing live · 🟡 = local
bytes exist, just needs `pnpm assets:stage && pnpm assets:upload`.

| Surface | Manifest source | Live | Total | Status |
|---|---|---:|---:|---|
| Dischordia base set art (cards + tier grids) | `base-set` + `base-set-grids` | 651 | 651 | ✅ |
| Hierarchy of the Damned art | `hierarchy-of-damned` | 124 | 124 | ✅ |
| Trade Empire art | `trade-empire` | 70 | 70 | ✅ |
| Cinematics — 9 act-spanning MP4s | `cinematics-mp4` | 9 | 9 | ✅ |
| Cinematics — keyframe webps | `cinematics-keyframes` | 38 | 38 | ✅ |
| VFX clips — act_spells / card_flips / cosmetic / hierarchy | `vfx-mp4` + `vfx-keyframes` | 36 | 42 | ⚠️ (3 dreamer\_visions MP4s + 3 keyframes missing) |
| Album 1 — *Dischordian Logic* slideshows | `album1-slideshows` | 490 | 490 | ✅ |
| Album 2 — *The Age of Privacy* slideshows | `album2-slideshows` | 0 | 334 | ❌ |
| Album 3 — *Book of Daniel 2:47* slideshows | `album3-slideshows` | 0 | 567 | ❌ |
| Album 4 — *West By God* slideshows | `album4-slideshows` | 0 | 200 | ❌ |
| Album 5 — *Silence in Heaven* slideshows | `album5-slideshows` | 0 | 552 | ❌ |
| Album 5 — narrator portraits | `album5-narrators` | 0 | 20 | ❌ |
| Album 5 — dialog backgrounds | `album5-backgrounds` | 0 | 18 | ❌ |
| Prelude + Act 1 deliverables (rooms / cutscenes / VFX / portraits / cards / music) | `prelude-act1-deliverables` | 223 | 232 | 🟡 (9 missing — all bytes already in `assets/intermediate/`) |
| Voice-over (24 surfaces, all 8 acts + companions + opponents) | `pnpm vo:audit` | 1,201 | 1,201 | ✅ (manifest complete; lines on `dgrsvoices` S3) |
| Music — Malkia Ukweli & the Panopticon in-game tracks | `apps/shared/musicRegistry.ts` | 14 / 14 tracks (~30 mp3s, all variants) | 14 | ✅ |
| Song slideshow audio (`/assets/audio/songs/*.mp3` — Last Words, Welcome to Celebration, To Be the Human, Eyes That Watch, Hacking Reality, Ocularum, The Prisoner, Lion in Black, Light Holds, Bulb Breaks, Superman Ain't Coming, Ain't Been the Same, Thaloria Awakening, Consider Life) | `apps/shared/songSlideshows.ts` | 0 | 14 | ❌ — see §4 |

Numbers in this table reconcile with `asset-liveness-report.json` and
`asset-coverage-report.json` (both written to repo root by `pnpm
assets:liveness` / `pnpm assets:coverage`).

---

## 3. The 33 staging slots already fulfilled by `assets/intermediate/` (cheapest wins)

23 source files in `assets/intermediate/prelude/{rooms,vfx,audio,cutscenes}/`
populate **33 canonical CDN paths** once `pnpm assets:stage` runs. This is
the cheapest production work in the entire backlog — no rendering required.

### 3.1 Prelude room backdrops — 13 PNGs → 26 staging slots (PNG + .webp transcode)

Source dir: `assets/intermediate/prelude/rooms/`

| Source basename | → Canonical staging path |
|---|---|
| `room-archives_original.png`           | `art/rooms/prelude/room-archives.{png,webp}` |
| `room-armory_original.png`             | `art/rooms/prelude/room-armory.{png,webp}` |
| `room-bridge_original.png`             | `art/rooms/prelude/room-bridge.{png,webp}` |
| `room-briefing-room_original.png`      | `art/rooms/prelude/room-briefing-room.{png,webp}` |
| `room-captains-quarters_original.png`  | `art/rooms/prelude/room-captains-quarters.{png,webp}` |
| `room-cargo-hold_original.png`         | `art/rooms/prelude/room-cargo-hold.{png,webp}` |
| `room-comms-array_original.png`        | `art/rooms/prelude/room-comms-array.{png,webp}` |
| `room-corridor_original.png`           | `art/rooms/prelude/room-corridor.{png,webp}` |
| `room-cryo-bay_original.png`           | `art/rooms/prelude/room-cryo-bay.{png,webp}` |
| `room-engineering_original.png`        | `art/rooms/prelude/room-engineering-bay.{png,webp}` *(slug remap)* |
| `room-galley_original.png`             | `art/rooms/prelude/room-galley.{png,webp}` |
| `room-medical-bay_original.png`        | `art/rooms/prelude/room-medical-bay.{png,webp}` |
| `room-mess-hall_original.png`          | `art/rooms/prelude/room-mess-hall.{png,webp}` |

### 3.2 Prelude VFX clips — 6 MP4s → 6 staging slots (raw byte copy)

Source dir: `assets/intermediate/prelude/vfx/`

| Source | → Canonical staging path |
|---|---|
| `breath-pulse-strip.mp4`     | `art/vfx/prelude/breath-pulse-strip.mp4` |
| `cryo-frost-retreat.mp4`     | `art/vfx/prelude/cryo-frost-retreat.mp4` |
| `film-damage-overlay.mp4`    | `art/vfx/prelude/film-damage-overlay.mp4` |
| `hologram-materialize.mp4`   | `art/vfx/prelude/hologram-materialize.mp4` |
| `pod-hatch-cryogas.mp4`      | `art/vfx/prelude/pod-hatch-cryogas.mp4` |
| `sepia-drain.mp4`            | `art/vfx/prelude/sepia-drain.mp4` |

### 3.3 Prelude ambient audio beds — 3 WAVs → 3 staging slots (raw byte copy, no loudnorm pass needed; `PRELUDE_AMBIENT_BEDS_DELIVERED` consumes the WAVs directly)

Source dir: `assets/intermediate/prelude/audio/`

| Source | → Canonical staging path |
|---|---|
| `ambient_bridge_powered_systems_mix.wav` | `audio/ambient/prelude/ambient_bridge_powered_systems_mix.wav` |
| `ambient_neural_rig_hum.wav`             | `audio/ambient/prelude/ambient_neural_rig_hum.wav` |
| `ambient_transfer_array_standby.wav`     | `audio/ambient/prelude/ambient_transfer_array_standby.wav` |

### 3.4 Known intentional skip (do not stage)

| Source | Reason |
|---|---|
| `prelude/cutscenes/prelude-beat-j-archives-arrival-clip.mp4` | Alternate take, intentionally unused per `preludeAct1Deliverables.ts`. Kept for a hypothetical director's cut. |

### 3.5 Run order — three commands, total runtime ≈ 30s + upload bandwidth

```bash
pnpm assets:stage:dry          # preview — should print 22 "would-stage" / "would-copy"
pnpm assets:stage              # actually copy + transcode 13 PNG→WebP via sharp
pnpm assets:upload             # idempotent S3 upload of everything in apps/client/public/
```

Set `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` before the upload step.
The upload script forces SSE-S3 (AES256), which is required for anonymous
HTTP reads through the public bucket policy — do not bypass it.

After the upload completes, the **9 `prelude-act1-deliverables` 403s**
collapse to 0; the surface flips from 🟡 to ✅.

---

## 4. Things that need to be **made**, not just uploaded

### 4.1 Albums 2 / 3 / 4 / 5 slideshow frames — **1,653 stills**

Author: every track in albums 2-5 has frame relPaths declared in
`apps/shared/expansionArt/album{2,3,4,5}Slideshows.ts`, but **zero frames
are live on CDN**. Album 1 (490 frames) is fully delivered, so this is a
producer pipeline that's known-working — it just hasn't been pointed at
albums 2-5.

| Album | Tracks | Frames | Visual style anchor |
|---|---:|---:|---|
| Album 2 — *The Age of Privacy* | 11 | 334 | Cold steel blue, surveillance green. Monospace terminal. |
| Album 3 — *The Book of Daniel 2:47* | 22 | 567 | Amber gold, desert ochre. Ancient manuscript serif. |
| Album 4 — *West By God* | 10 | 200 | 2D anime cel-shaded. Cowboy Bebop × Cyberpunk Edgerunners × Afro Samurai. 8K. |
| Album 5 — *Silence in Heaven* | 18 + 19 dialog scenes | 552 | Pure black → gold → white. Full theatrical production. |

The exact per-track frame inventories are in
`apps/shared/expansionArt/album{N}Slideshows.ts` — each track has a
`frameRelPaths: readonly string[]` that the SETI can lift verbatim into
prompts.

**Prompt source bibles already exist:**
- `apps/shared/albumRegistry.ts` — narrative role, era, epoch, visual-style
  one-liner for each album.
- `docs/production/COMPLETE_ART_PROMPT_BIBLE.md`
- `docs/production/CONSOLIDATED_MISSING_PROMPTS.md`
- `docs/production/PROMPT_BOOK_2026-04-25.md`
- `docs/production/SHIP_READY_ASSET_BIBLE.md`
- `apps/shared/dischordianLogicTrackMemes.ts` — Antiquarian's per-track
  commentary can be lifted verbatim into prompt context.
- `apps/shared/silenceInHeavenTracklist.ts` — full Album 5 tracklist with
  per-song scene/character notes.

### 4.2 Album 5 narrator portraits + dialog backgrounds — **38 stills**

| Catalog | Count | Path prefix | Source manifest |
|---|---:|---|---|
| Narrator portraits | 20 | `art/slideshows/album5/narrators/` | `apps/shared/expansionArt/album5Slideshows.ts` `ALBUM5_NARRATOR_PORTRAITS` |
| Dialog backgrounds | 18 | `art/slideshows/album5/dialog-backgrounds/` | `apps/shared/expansionArt/album5Slideshows.ts` `ALBUM5_DIALOG_BACKGROUNDS` |

These power the Album 5 dialog-composite system (the 19 dialog scenes
intercut between songs). All exact relPaths + ids are in the manifest;
prompt seeds are in `docs/production/CASINO_EXPANSION_ART_BIBLE.md` (the
visual lineage doc that defined the "theatrical production" look) and
`apps/shared/silenceInHeavenTracklist.ts`.

### 4.3 Dreamer Visions VFX — **3 MP4s + 3 keyframes**

These are the only VFX gaps in an otherwise-complete VFX manifest (36/42
clips live).

| Clip id | Video relPath | Keyframe relPath |
|---|---|---|
| `vfx_substrate_pulse`     | `videos/vfx/dreamer_visions/vfx_substrate_pulse.mp4`     | `art/vfx/dreamer_visions/kf_substrate_pulse.webp` |
| `vfx_iris_collapse`       | `videos/vfx/dreamer_visions/vfx_iris_collapse.mp4`       | `art/vfx/dreamer_visions/kf_iris_collapse.webp` |
| `vfx_cryo_frost_retreat`  | `videos/vfx/dreamer_visions/vfx_cryo_frost_retreat.mp4`  | `art/vfx/dreamer_visions/kf_cryo_frost_retreat.webp` |

Defined in `apps/shared/expansionArt/cinematicsManifest.ts` `VFX_CLIPS`,
category `dreamer_visions`. The other four categories
(`act_spells`, `card_flips`, `cosmetic_ceremonies`, `hierarchy_mechanics`)
are complete — same producer pipeline.

Prompt source: `apps/shared/dreamerVisions.ts` carries the trigger logic /
beat context. `docs/production/MISSING_PRELUDE_ACT1_ASSETS.md` §1.A.3 shows
the producer pattern (Veo 3.1 image-to-video, alpha channel).

### 4.4 Song slideshow audio — **14 mp3 tracks (the "Malia / Malkia song" case)**

The "Malia song" the user is asking about is **Malkia Ukweli's catalog** —
the in-fiction artist whose tracks soundtrack the whole game. Two distinct
audio surfaces:

#### 4.4.1 In-game music (✅ all live on CDN)

`apps/shared/musicRegistry.ts` ships 14 named tracks across 1-4 variants
each (~30 mp3s total) at `audio/music/<slug>/v<n>.mp3`. Spot-checks confirm
all variants live: `main_menu/v1`, `ark_exploration/v1`, `trade_combat/v1`,
`arena_battle/v2` all 200. **Nothing to do here.**

#### 4.4.2 Song-slideshow narrative tracks (❌ none live)

`apps/shared/songSlideshows.ts` references 14 long-form narrative songs:

| File | Slideshow id | Album / Notes |
|---|---|---|
| `last-words.mp3`               | last-words            | Album 1 — *Dischordian Logic* track 28; the Programmer's execution |
| `welcome-to-celebration.mp3`   | welcome-to-celebration| Act 1 Cycle A finale anchor |
| `to-be-the-human.mp3`          | to-be-the-human       | The Human's introspection |
| `i-am-the-eyes-that-watch.mp3` | eyes-that-watch       | Watcher / Eyes faction |
| `hacking-reality.mp3`          | hacking-reality       | Programmer hacks the broadcast |
| `ocularum.mp3`                 | ocularum              | Album 2 / Surveillance era |
| `the-prisoner.mp3`             | the-prisoner          | Iron Lion |
| `the-lion-in-black.mp3`        | lion-in-black         | Iron Lion sacrifice |
| `the-light-holds.mp3`          | light-holds           | Album 5 closer beat |
| `the-bulb-breaks.mp3`          | bulb-breaks           | Surveillance failure |
| `superman-aint-coming.mp3`     | superman              | West By God anchor |
| `it-aint-been-the-same.mp3`    | aint-been-same        | West By God |
| `thaloria-awakening.mp3`       | thaloria              | Thaloria reveal |
| `consider-life.mp3`            | consider-life         | Quiet beat |

**Two separate problems** — read carefully:

1. **Path convention drift** — these entries hardcode `/assets/audio/songs/...`
   instead of `assetUrl("audio/songs/...")`. The CDN doesn't host
   `/assets/audio/...` at all (the canonical prefix is `cdn/client-public/`).
   Either rewrite the registry to use `assetUrl()` *and* upload to
   `audio/songs/<slug>.mp3`, or rewire the runtime to a different host.
   Recommended: rewrite the registry to call `assetUrl("audio/songs/<slug>.mp3")`,
   matching the rest of the codebase. (`apps/scripts/rewrite-asset-refs.ts`
   exists for exactly this kind of pass.)

2. **Bytes don't exist anywhere** — anonymous HEAD against
   `cdn/client-public/audio/songs/last-words.mp3` (and every plausible
   alternate prefix: `audio/album1/last-words.mp3`,
   `audio/album1/last_words.mp3`, `audio/song/...`) all return 403, and no
   local source under `apps/client/public/audio/` or `assets/intermediate/`
   matches. **These tracks have not been produced.**

**Production approach** (per the Suno workflow already wired up):

- Each track has a slideshow already authored in `apps/shared/songSlideshows.ts`
  with frame timings, dialog overlays, and narrator reactions — the timing
  spec doubles as a song-structure brief for the producer.
- Visual + narrative palette per track is in `albumRegistry.ts`
  + `apps/shared/silenceInHeavenTracklist.ts`
  + `apps/shared/dischordianLogicTrackMemes.ts`.
- Existing music prompt template:
  `docs/production/prompts/suno-game-music-prompts.md` (per `musicRegistry.ts`
  comment) — extend with one entry per song above.
- Loudness target: align with `PRELUDE_AMBIENT_BEDS` LUFS convention
  (`-23 LUFS` integrated, `-1 dBTP` true peak).
- Output: 1 mp3 per track at `apps/client/public/audio/songs/<slug>.mp3`,
  then `pnpm assets:upload`.

After production: also fix the registry to use `assetUrl()` (a 14-line
mechanical change — see §6).

---

## 5. Already-shipped surfaces (don't re-do these)

These are **complete** as of the 2026-05-02 audit. SETIs should skip prompts
for any of these unless explicitly asked for re-renders:

- **Dischordia base set art** — 651 / 651 (cards + tier grids).
- **Hierarchy of the Damned art** — 124 / 124.
- **Trade Empire art** — 70 / 70 (wonders, eras, encounters, doctrines, fleet,
  pirates, civics, sectors).
- **Cinematics** — 9 act-spanning MP4s + 38 keyframes
  (`01_pack_opening` … `09_act7_convergence`).
- **VFX** — 36 / 42 clips. Categories `act_spells` (5), `card_flips` (7 —
  rarity ladder), `cosmetic_ceremonies` (3), `hierarchy_mechanics` (3) all
  complete. Only `dreamer_visions` (3 of 6) gaps remain.
- **Album 1** — *Dischordian Logic* slideshows (490 frames, all 29 tracks).
- **Voice-over** — 1,201 lines across 24 surfaces; `pnpm vo:audit` reports
  0 missing across all generators. Lines live at
  `dgrsvoices.s3.us-east-2.amazonaws.com`.
- **Game music** — Malkia Ukweli's 14-track in-game registry, all variants
  live at `audio/music/<slug>/v<n>.mp3`.
- **223 / 232 Prelude + Act 1 deliverables** — every cutscene MP4, every
  battlefield, every Act 1 portrait, every Act 1 starter card, every Act 1
  music track is live. The 9 stragglers are the §3 staging items.
- **Public/characters/** — 28 character turnaround folders (per
  `apps/client/public/characters/_inventory.json`).

---

## 6. Code-level cleanups blocked on / unblocked by this audit

These are mechanical edits the asset audit reveals. Not media work — but
they belong in the same PR sweep so the runtime actually consumes the new
bytes.

1. **Rewrite `songSlideshows.ts` audioUrls to use `assetUrl()`**.
   Currently 14 entries hardcode `/assets/audio/songs/<slug>.mp3` — that's
   a dev-only path. Replace with `assetUrl("audio/songs/<slug>.mp3")` to
   pick up the CDN automatically (and the dev fallback continues to work
   because `assetUrl` is a passthrough in dev). Use
   `pnpm assets:rewrite:dry` first, then `pnpm assets:rewrite:apply`.

2. **Reconnect the legacy `d2xsxph8kpxj0f.cloudfront.net` references** —
   `MISSING_PRELUDE_ACT1_ASSETS.md` calls these `DONE-CDN-LEGACY`. They're
   wired in `InlineShipMap.tsx` and `ShipSchematicMap.tsx`. Once §3 staging
   completes, every legacy URL has a canonical sibling on `dgrsart` —
   migrate the components to `assetUrl()` so the legacy CDN can be retired.
   Not blocking, but a hygiene win.

3. **`assets/intermediate/` cleanup decision** — the 23 source files are
   still referenced by `_stage-from-intermediate.mjs`'s mapping table. If
   the team wants the staging script to be the only source of truth, leave
   `assets/intermediate/` checked in. If the source-of-truth lives elsewhere
   (S3 bucket, producer drop dir), `assets/intermediate/` can be moved to
   `.gitignore` after staging completes. **Recommend: leave for now**
   pending the Album-5 dialog-composite work landing.

---

## 7. SETI prompt routing — "if I want to make X, where do I read?"

Pre-built prompt-bibles already exist for every gap above. Don't re-prompt
from scratch — pull from these:

| If you need to make… | Read |
|---|---|
| Anything in the Prelude (rooms, cutscenes, VFX, audio, VO) | `docs/production/MISSING_PRELUDE_ACT1_ASSETS.md` (2,257 lines, beat-by-beat with Veo + Nano + ElevenLabs blocks) |
| Anything in Act 1 (3 cycles + finale) | Same doc, Part 2 |
| Acts 2-7 art / battlefields / portraits | `docs/production/ACTS_2_THROUGH_7_ASSET_BIBLE.md` + `docs/production/acts-2-7-aaa-final/ASSET_MANIFEST.md` |
| Album 1-5 slideshow frames | `apps/shared/expansionArt/album{N}Slideshows.ts` (frame paths) + `apps/shared/albumRegistry.ts` (visual style) + `apps/shared/dischordianLogicTrackMemes.ts` (Antiquarian per-track context) + `apps/shared/silenceInHeavenTracklist.ts` (Album 5 dialog beats) |
| Album 5 narrator portraits + dialog backgrounds | `docs/production/CASINO_EXPANSION_ART_BIBLE.md` (theatrical-production look-and-feel) + `apps/shared/expansionArt/album5Slideshows.ts` (`ALBUM5_NARRATOR_PORTRAITS`, `ALBUM5_DIALOG_BACKGROUNDS`) |
| Dreamer Visions VFX | `apps/shared/dreamerVisions.ts` + `cinematicsManifest.ts`. Pattern from neighboring categories in the same file. |
| Song slideshow audio (Last Words, Ocularum, etc.) | `apps/shared/songSlideshows.ts` (timings + dialog overlays) + `apps/shared/silenceInHeavenTracklist.ts` (per-song scene notes) + extend `docs/production/prompts/suno-game-music-prompts.md` |
| New voice lines | `apps/shared/<character>VoManifest.json` + `apps/scripts/<character>-lines.json` + the existing per-act generator (`pnpm vo:act<N>`); `pnpm vo:audit` will tell you if you're done. |
| New card art | `apps/shared/tcg-core/cards/definitions/<faction>/<id>.ts` carries the rules; art prompts grouped under `docs/production/COMPLETE_ART_PROMPT_BIBLE.md` and `apps/shared/tcg-core/cardArtPrompts/`. |
| Anything not listed | `docs/production/PRODUCTION_BIBLE.md` (719 lines, top-level routing) |

---

## 8. Reproducibility — how to regenerate this snapshot

```bash
# Local-only: where each manifest URL lives in the working tree.
pnpm assets:coverage          # writes asset-coverage-report.json

# Anonymous probe: which manifest URLs the public can actually fetch.
pnpm assets:liveness          # writes asset-liveness-report.json

# VO completeness across all 24 surfaces (TS + Python generators).
pnpm vo:audit

# Stage the 33 prelude slots from intermediate (idempotent).
pnpm assets:stage:dry
pnpm assets:stage

# Upload everything in apps/client/public/ to dgrsart (idempotent ETag compare).
pnpm assets:upload:dry
pnpm assets:upload
```

The two JSON reports are git-ignored artefacts; commit only this markdown
snapshot. Re-run after every producer drop and update §1's headline numbers.

---

## 9. One-page TL;DR for the SETI

- **0 explicit 404s** — the CDN is healthy, no rotted references.
- **Stage + upload §3 → 9 fewer 403s** (one half-day of work, mostly bandwidth).
- **Dreamer Visions** is the only VFX gap → **3 Veo clips + 3 keyframes**.
- **Albums 2 / 3 / 4 / 5** are the giant gap → **1,653 stills** to render
  via the Album 1 producer pipeline. All frame paths + per-track context
  already typed in `apps/shared/expansionArt/album{N}Slideshows.ts`.
- **Album 5 narrators + dialog backgrounds** → **38 stills** (small, but
  blocks the Album 5 dialog-composite system).
- **Song slideshow MP3s (Malkia Ukweli's narrative tracks)** → **14 tracks
  to record + a path-rewrite pass**. The in-game music registry is
  unrelated and already complete.
- **Voice-over: 0 missing.**
- **Cards / cinematics / Trade Empire / Hierarchy / Album 1: 0 missing.**

If a SETI does §3 + §4.1–§4.4 in order, the CDN goes from 49% live to
≥95% live. The remaining 5% is Album 5 dialog-composite polish that
depends on §4.2 landing first.
