# Acts 2-7 AAA Final drop — delivery notes

**Drop date:** 2026-04-24
**Branch:** `claude/add-act-2-7-assets-FpYmW`
**Source ZIP:** `dgrsart.s3.us-east-2.amazonaws.com/AAA Final/dischordian_acts2_7_assets.zip`

## What landed at runtime paths

103 files copied into the gitignored `apps/client/public/` tree, ready for
S3 sync. Path scheme follows `docs/production/commission-packages/acts-2-7-tranche.csv`.

| Bucket            | Count | Local path                                     | Size  |
|-------------------|-------|------------------------------------------------|-------|
| Cinematic videos  | 43    | `apps/client/public/videos/acts/act-{N}/`      | 191 MB |
| Audio cues        | 39    | `apps/client/public/audio/acts/act-{N}/` + `act-2-stingers/` | 67 MB |
| VFX texture atlases | 21  | `apps/client/public/vfx-atlases/acts/act-{N}/` | 115 MB |

Per-act file inventory: see `ASSET_MANIFEST.md` in this directory.

## What was NOT copied to runtime paths

- **86 cinematic start/end frame PNGs** (584 MB) — Veo 3.1 keyframe inputs
  used to generate the MP4 videos. The tranche CSV designates these as
  `_intermediate/` work products. They live in the ZIP at
  `cinematics/act-{N}/{start,end}/*.png` if regeneration is ever needed.

## Pipeline plumbing changes shipped on this branch

- `.gitignore` — added `apps/client/public/vfx-atlases/` so the new bucket
  follows the same "S3 is source of truth, local is dev cache" convention
  as `art/`, `audio/`, `videos/`, `music/`, `games/`.
- `apps/scripts/upload-public-to-s3.ts` — added `vfx-atlases` to
  `TRACKED_DIRS` so `pnpm tsx apps/scripts/upload-public-to-s3.ts` syncs
  the new bucket to `s3://dgrsart/cdn/client-public/vfx-atlases/`.

## Sync to S3 (operator action required)

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
pnpm tsx apps/scripts/upload-public-to-s3.ts
# 16-way concurrent, ETag-skipped, 1-year immutable cache headers.
```

After the sync completes, the bytes are addressable as:

- `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/videos/acts/act-{N}/<file>.mp4`
- `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/audio/acts/act-{N}/<file>.mp3`
- `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/vfx-atlases/acts/act-{N}/<file>.png`

## Runtime wiring — STILL REQUIRED

Bytes-on-CDN does not equal in-game playback. The runtime currently
references the **older** asset scheme (`art/cinematics/act-N-foo/frame01.webp`,
`audio/acts/act-N-intro.mp3` per `ACTS_2_THROUGH_7_ASSET_BIBLE.md`), and
nothing in the codebase yet loads `videos/acts/act-{N}/...` or
`vfx-atlases/acts/act-{N}/...`.

A grep at the time of this drop found exactly one reference into the
cinematics tree (`apps/client/src/pages/PrestigeCycleResetPage.tsx:78`,
loading `art/cinematics/act-7-convergence/hero.webp`), and zero references
into `videos/acts/`, `audio/acts/`, or `vfx-atlases/`.

To make the videos play in-game, additional code work is needed:

1. **Slideshow → video player** — `apps/shared/songSlideshows.ts`,
   `apps/client/src/components/SongSlideshow.tsx`, and the per-act opener
   triggers in `apps/client/src/hooks/useNarrativeIntegration.ts`
   `SLIDESHOW_TRIGGERS` need a video-playback path that loads the new
   `cin_act{N}_*.mp4` instead of cycling through `frame01..03.webp`.
2. **Per-act audio bed wiring** — every `act-{N}-intro.mp3` (and the
   stingers / extraction beds) needs to be referenced from the relevant
   page or `audio/acts/...` constant.
3. **VFX atlas consumption** — the new atlases (`bench_glow_light.png`,
   `army_composite_parallax.png`, etc.) need component-level adoption per
   the tranche CSV's prompt-ref column.

These are out of scope for the asset-drop branch and should be tracked as
a follow-up wiring PR.

## Reference docs

- `docs/production/acts-2-7-aaa-final/ASSET_MANIFEST.md` — file-level inventory.
- `docs/production/acts-2-7-aaa-final/production_notes.md` — generation tracker.
- `docs/production/acts-2-7-aaa-final/remaining_work.md` — gap analysis from the artist team.
- `docs/production/acts-2-7-aaa-final/character_canon_map.md` — character canon refs used.
- `docs/production/commission-packages/acts-2-7-tranche.csv` — production-target spec.
- `docs/archive/2026-05-08-superseded/ACTS_2_THROUGH_7_ASSET_BIBLE.md` — older WebP-frame asset bible
  (still referenced by current runtime; the AAA Final drop supersedes it for
  cinematic + music delivery, but its room/portrait/UI rows are still valid).
