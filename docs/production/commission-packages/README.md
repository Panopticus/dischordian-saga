# Commission Packages — Living Character Sheet

Working surface for commissioning the assets specified in
`docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`. The art brief
is the canonical PROMPT source; this directory is the operational
TRACKING surface — what's commissioned, what's pending, dependency
ordering, and per-tool ready-to-paste examples.

## Structure

```
commission-packages/
├── README.md              # this file — orientation
├── p0-tranche.csv         # master manifest of P0 (ship-blocking) assets
├── examples/              # ready-to-paste-into-tool example packages
│   ├── nano-banana-2_turnaround.md
│   ├── nano-banana-2_viseme-grid.md
│   ├── meshy-v5_3d-rig.md
│   ├── veo-3.1_idle-loop.md
│   └── veo-3.1_one-shot-cinematic.md
└── (future)
    ├── p1-tranche.csv     # added when P0 commission is ~50% complete
    └── p2-tranche.csv     # added when P1 commission begins
```

## How to use this directory

### To commission an asset:

1. **Find it in `p0-tranche.csv`** by `asset_id`. The row gives you
   the tool, the prompt anchor (a §section reference into the art
   brief), the target output path, and the dependency list.
2. **Open the matching `examples/{tool-type}.md` file.** Each example
   is a complete copy-paste-ready recipe for that tool — structure of
   inputs, what to paste where, what the output should look like, and
   how to validate it.
3. **Pull the actual prompt text** from the art brief at the cited
   §section. The prompts in the brief are already tool-ready; the
   examples in this directory show the shape of the surrounding
   workflow (uploading source images, setting tool-specific knobs,
   saving to the right output path).
4. **Update `p0-tranche.csv`** with the new status (`completed`,
   `in_progress`, `failed_iteration_N`) and any notes.

### Dependency ordering

The `dependencies` column in `p0-tranche.csv` lists assets that must
be commissioned BEFORE a given row. For example: a Veo 3.1 cinematic's
START FRAME and END FRAME are themselves Nano Banana 2 assets that
must exist first; the cinematic row's dependencies field references
those frame-asset IDs.

A dependency-respecting commissioning order: filter `p0-tranche.csv`
by `status = pending AND dependencies are all completed`. The first
batch of work is everything with no dependencies (turnaround sheets
+ viseme grids + reference plates).

## P0 tranche scope (4 weeks per §10.1 roadmap)

- **Week 1:** Part 1A Elara 3D + 1B Human 3D — turnarounds, viseme
  sheets, shader atlases, idle/reveal cinematics. ~25 assets.
- **Week 2:** Part 1C player base meshes — 4 species × 2 sexes. 8
  GLBs + supporting turnarounds.
- **Week 3:** Six P0 NPC bundles (Agent Zero, Locke, Kael 3-phase,
  Antiquarian, Shadow Tongue, Architect). ~32 images per NPC × 6 +
  Kael's three phases = ~250 images.
- **Week 4:** Five P0 cinematics (CIN-ELARA-IDLE, CIN-HUMAN-REVEAL,
  CIN-KAEL-01, CIN-KAEL-02, CIN-ARCH-01). 5 videos.

**Total P0: ~300 individual assets across ~4 weeks.** P1 + P2 tranches
add ~2,000 more assets across weeks 5-9 (see §10.1 in the art brief).

## Tools required

| Tool | Used for | License/access |
|---|---|---|
| Nano Banana 2 | Still frames (turnarounds, viseme sheets, reference plates, Veo start/end frames) | API or web UI |
| Meshy v5 (or Tripo3D / Rodin) | Image-to-3D conversion of turnaround plates into rigged GLB | API key |
| Substance 3D Sampler | PBR texture re-bake on Meshy GLB output | License |
| Veo 3.1 | Motion clips with start-frame + end-frame keyframes + motion prompt | API or web UI |
| Seedance 2.0 | Veo 3.1 fallback if Veo unavailable | API or web UI |
| Suno v4 | Reveal-beat musical stingers | API |

Per-asset recipes in `examples/` show exactly which tool to use, what
to upload as input, what to paste, and what to save where.

## Status legend (used in p0-tranche.csv)

- `pending` — not started; dependencies may or may not be ready
- `blocked` — dependencies aren't met; check `dependencies` column
- `in_progress` — currently being commissioned (note initials/ticket
  in `notes` column)
- `iteration_N` — generated, but failed quality bar; on iteration N
- `completed` — generated, validated, saved to `output_path`
- `parked` — deferred (rare; usually because a §10.4 issue blocks)

## Where the actual prompt text lives

Every prompt cited from the art brief is at a stable §section
reference. The art brief is structured so each asset's prompt is a
self-contained block with the global style anchor embedded — you can
copy a §section's prompt block directly into Nano Banana 2 / Veo 3.1
without modification. Example: `prompt_ref = "§1A.1 FRONT"` means
"open the art brief, navigate to Part 1A.1 Bundle A, and copy the
FRONT turnaround prompt block."

The example packages in `examples/` show the wrapping workflow around
those prompt blocks (image inputs, tool settings, output naming).
