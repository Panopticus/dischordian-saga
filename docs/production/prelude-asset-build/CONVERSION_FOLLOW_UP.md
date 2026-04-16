# Prelude Asset Build — Conversion Follow-Up

Three categories of delivered assets need format conversion before they
match the manifest paths in `apps/shared/preludeSequence.ts`. All source
files are parked in `assets/intermediate/prelude/` until conversion
tooling (ffmpeg, cwebp) is available.

---

## 1. VFX: MP4 → WebM + variant expansion

**Source:** `assets/intermediate/prelude/vfx/` (6 files)
**Target:** `apps/client/public/art/vfx/prelude/` (manifest expects `.webm`)

| Source file | Target base | Variants to generate |
|---|---|---|
| cryo-frost-retreat.mp4 | cryo-frost-retreat.webm | *(none)* |
| pod-hatch-cryogas.mp4 | pod-hatch-cryogas.webm | *(none)* |
| hologram-materialize.mp4 | hologram-materialize.webm | *(none)* |
| breath-pulse-strip.mp4 | breath-pulse-strip.webm | *(none)* |
| sepia-drain.mp4 | sepia-drain.webm | `-forward.webm`, `-reverse.webm` |
| film-damage-overlay.mp4 | film-damage.webm | *(none — note filename change)* |

**Conversion command (example):**
```bash
ffmpeg -i source.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -an output.webm
```

**Not yet delivered (remaining ~34 VFX):** See manifest `vfxAssets` arrays
for beats B through J for the full list of effects and their variant
suffixes.

---

## 2. Ambient Audio: WAV → MP3 with LUFS normalization

**Source:** `assets/intermediate/prelude/audio/` (3 files)
**Target:** `apps/client/public/audio/ambient/prelude/`

| Source file | Target file | LUFS target |
|---|---|---|
| ambient_neural_rig_hum.wav | neural-rig-hum.mp3 | -18 |
| ambient_transfer_array_standby.wav | transfer-array-standby.mp3 | -20 |
| ambient_bridge_powered_systems_mix.wav | bridge-powered-systems.mp3 | -19 |

**Conversion command (example):**
```bash
ffmpeg -i source.wav -af loudnorm=I=-18:TP=-1.5:LRA=11 -c:a libmp3lame -q:a 2 output.mp3
```

---

## 3. Room WebP: PNG → WebP companions

**Source:** `apps/client/public/art/rooms/room-*.png` (13 files)
**Target:** `apps/client/public/art/rooms/room-*.webp` (co-located)

The manifest (`PreludeRoomAsset`) requires both `.png` and `.webp` for
every room. Currently only room-bridge.webp and room-archives.webp exist
(from prior delivery; now stale since PNGs were overwritten with upscaled
versions).

**Conversion command (example):**
```bash
cwebp -q 80 room-cryo-bay.png -o room-cryo-bay.webp
```

Generate `.webp` for all 13 room PNGs. Also regenerate room-bridge.webp
and room-archives.webp from their new upscaled PNGs.
