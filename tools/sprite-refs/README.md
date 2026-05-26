# Sprite reference renders

Visual reference for each Phase J sprite, composited over its room's base render.
Each JPG is **640×360 + 80px label band**, ~35 KB, quality 70.

Use these in `tools/hotspot-author.html` (or any image viewer) when authoring/tuning
hotspots — they let you see exactly where each sprite paints on the canvas, so you
can place a click target on the right pixel region.

## Layout

```
tools/sprite-refs/
  bridge/           sp01..sp58.jpg   (58 sprites)
  cryo-bay/         sp01..sp83.jpg   (83 sprites)
  medical-bay/      sp01..sp88.jpg   (88 sprites)
  engineering/      sp01..sp87.jpg   (87 sprites)
  archives/         sp01..sp90.jpg   (90 sprites)
  comms-array/      sp01..sp90.jpg   (90 sprites)
  observation-deck/ sp01..sp88.jpg   (88 sprites)
```

Each filename matches the sprite id in the composite resolver
(`apps/shared/roomComposition/<room>Composite.ts`), so finding the trigger
condition is a `grep -n <sprite_id> apps/shared/roomComposition/`.

## How they were generated

For each room, the canonical "fullest" base render was downloaded from the CDN
and each sprite alpha-composited on top:

| Room | Base used |
| --- | --- |
| `bridge` | `bridge_base_t2_activated` |
| `cryo-bay` | `cryo_bay_base_initial` |
| `medical-bay` | `medical_bay_base_initial` |
| `engineering` | `engineering_base_t2_activated` |
| `archives` | `archives_base_initial` |
| `comms-array` | `comms_array_base_initial` |
| `observation-deck` | `observation_deck_base_initial` |

## Regenerating

After new sprites land (or a room's reference base changes), regenerate this
directory locally. The generator script is intentionally one-off and not in the
repo's `package.json` task list — these are static references that change
rarely. See `tools/sprite-refs/_generator.py` for the standalone Python script.
