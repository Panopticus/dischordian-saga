# Card-Battle Replay MP4 Export

**Status:** design doc + substrate. Ships in audit/16 PR 36.
Closes audit/15 finding **Strm7** ("Card-battle replay export missing
UI; mirrors TCG7"). The TCG7 follow-up (in-app `/replay/:replayId`
viewer) is a separate consumer track.

## Why Strm7 exists

Pre-audit, `apps/shared/tcg-core/replay/replay.ts` shipped a complete
deterministic-replay pipeline — given a `(seed, actions, rulesVersion)`
triple, the reducer walks every action and produces the same
byte-identical state sequence. That's the engineering substrate. There
is no **player-facing surface** for it: streamers who want to clip a
match for social media or a content channel have no path to an MP4.
The audit's Streamer-persona Strm7 finding flags this gap.

The audit's recommendation was "ship `replayExport.ts` with an
FFmpeg WASM MP4 encoder." That is the right destination, but a single
PR pulling FFmpeg WASM into the bundle is a substantial dependency
load (~25–30 MB binary, requires SharedArrayBuffer, COOP/COEP
headers, async-heavy lifecycle). PR 36 ships **the substrate** so the
encoder integration is a follow-up that just plugs into a stable API
shape.

## What ships in this PR

- **`apps/shared/tcg-core/replay/replayExport.ts`** — pure helpers:
  the **frame-plan** layer. Given a `ReplayResult`, produces an
  ordered list of `ExportFrame` rows (`{ stepIndex, timeMs,
  stateAfter, durationMs }`). Encoder-agnostic. The frame plan is
  the contract any future encoder reads against (FFmpeg WASM in the
  follow-up; server-side `ffmpeg` shell as a fallback path; PNG-zip
  as the no-encoder degraded mode).
- **`apps/shared/tcg-core/replay/replayExport.test.ts`** —
  invariants on the frame plan: monotonic time, correct cumulative
  duration, per-action duration heuristic respects action kind,
  empty replay → empty plan, version-incompatible replay → empty
  plan with a flag.
- **This document** — the encoder follow-up's source-of-truth.

## What does NOT ship in this PR

- **The FFmpeg WASM dependency.** A 25–30 MB binary in the production
  bundle has measurable cost; landing it should be a focused infra PR
  with a bundle-size gate. The substrate here doesn't presume which
  encoder lands.
- **The `/replay/:replayId` page** (TCG7). Different finding,
  different consumer track.
- **Per-frame canvas rendering.** The frame plan returns
  `GameState` snapshots; the canvas renderer that converts each
  state to a 1920×1080 PNG is a separate React component that lives
  near the existing match-board UI.
- **Storage / job tracking for export tasks.** When a streamer
  requests an export, the encoder may take 30–90s for a full match.
  That requires a job queue + progress polling; out of scope here.

## Architecture

```
                       ┌─────────────────────────┐
                       │   ReplayResult (pure)   │  ← apps/shared/tcg-core/replay/replay.ts
                       └────────────┬────────────┘
                                    │
                  planExportFrames(result, options)
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │    ExportFrame[]        │  ← THIS PR
                       └────────────┬────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                ▼                   ▼                   ▼
         ┌────────────┐      ┌────────────┐      ┌────────────┐
         │ FFmpeg-WASM│      │ Server-side│      │  PNG-zip   │
         │  encoder   │      │   ffmpeg   │      │  fallback  │
         │ (browser)  │      │  (node)    │      │            │
         └────────────┘      └────────────┘      └────────────┘
                Follow-up infra PR.
```

The contract every encoder reads:

```ts
interface ExportFrame {
  stepIndex: number;
  timeMs: number;          // cumulative time, monotonic
  durationMs: number;      // how long this frame holds before the next
  stateAfter: GameState;
  primaryAction: Action;   // the action whose application produced this frame
}

interface FramePlan {
  ok: boolean;
  matchId: string;
  rulesVersion: string;
  versionCompatible: boolean;
  totalDurationMs: number;
  frames: ExportFrame[];
}
```

## Frame timing heuristic

Different actions have different "weight" in match flow. A trial
declaration deserves more screen time than a pass, an attack
deserves more than a card draw. The heuristic in `replayExport.ts`
maps action kind → milliseconds:

| Action kind         | Frame ms |
|---------------------|----------|
| `play_card`         |    1500  |
| `declare_attack`    |    2000  |
| `declare_trial`     |    2500  |
| `resolve_trial`     |    2000  |
| `end_turn`          |     800  |
| `mulligan`          |    1000  |
| `pass`              |     500  |
| (default unknown)   |    1200  |

Total replay duration for a typical match (40-60 actions) lands at
60-90 seconds — within the social-media clip sweet spot.

## Encoder follow-up — implementation plan

When a future PR lands the FFmpeg WASM encoder:

1. **Dep**: `@ffmpeg/ffmpeg` + `@ffmpeg/util` (~30 MB).
2. **Bundle**: lazy-load behind `import("./replayEncoderFFmpeg")`,
   triggered by the player clicking the "Export MP4" button. Never
   eagerly-loaded.
3. **Headers**: requires COOP/COEP for SharedArrayBuffer. The Vite
   middleware in `apps/server/_core/index.ts` will need
   `Cross-Origin-Opener-Policy: same-origin` +
   `Cross-Origin-Embedder-Policy: require-corp` for the encoder
   route. Existing CORS / asset headers must be audited for
   compatibility.
4. **Render path**: each `ExportFrame.stateAfter` feeds into the
   existing match-board React component, rendered to a `<canvas>`
   off-DOM, captured as a PNG (`canvas.toBlob('image/png')`). The
   PNG sequence + frame-timing list is fed to FFmpeg WASM:

   ```ts
   await ffmpeg.exec([
     "-framerate", "30",
     "-i", "frame_%05d.png",
     "-vf", "fps=30",
     "-c:v", "libx264",
     "-pix_fmt", "yuv420p",
     "out.mp4",
   ]);
   ```

5. **Output**: blob URL surfaced via `<a download>` link, or POST'd
   to a future `replays/:id/export` endpoint for storage.

## Fallback path — PNG-zip

For environments where FFmpeg WASM is too costly (mobile, slow
connections), the substrate also enables a degraded "render every
frame to PNG, ship as a ZIP" path:

- Same `ExportFrame[]` plan as above.
- Each frame rendered to a PNG; zipped with `jszip`.
- Streamers can then assemble the MP4 with their preferred local
  tooling.
- Bundle cost: ~50KB for jszip vs. ~30MB for FFmpeg WASM.

The substrate's `FramePlan` shape supports both encoders without
modification.

## Privacy / abuse considerations

- **Public matches only**: the export pipeline operates on the
  `replays` table; only matches the player participated in (or
  matches marked `isPublic: true`) can be exported. The router-side
  authorization gate is a separate concern (already lives on
  `replayRouter` for the in-app viewer; the export endpoint reuses
  it).
- **No PII rendering**: the frame renderer must NOT include the
  match-history sidebar, opponent username (use a short tag), or
  any chat overlay. Only the board state.
- **Watermark**: every export carries a "dischordian-saga" watermark
  in the lower-right corner. Not optional. (Ships with the renderer
  in the follow-up.)

## Production checklist (encoder follow-up)

- [ ] Bundle-size gate: the lazy-loaded encoder chunk must be < 35MB
      compressed.
- [ ] COOP/COEP headers wired only for the export route — must not
      break the rest of the app's third-party iframe / Pixi
      compatibility.
- [ ] Worker pool: encoder runs on a dedicated Web Worker; the main
      thread stays responsive during export.
- [ ] Progress callback: `onProgress(0..1)` fires every ~500ms during
      encode; the UI surfaces a determinate progress bar.
- [ ] Cancel handle: streamer can cancel a long encode; the worker
      tears down cleanly.
- [ ] Watermark + "Generated from a Dischordian Saga match" footer.
- [ ] Tests: unit test the frame planner here; integration test the
      encoder under a Playwright suite that runs against a fixture
      match.
