# Hotspot Author (standalone visual editor)

A single self-contained HTML file for visually editing room hotspot
coordinates against the AAA Final room art — no dev server, no React,
no build step. Bypasses everything that was making `/ark?author-hotspots=1`
fail to render locally.

## Quick start

1. Open `tools/hotspot-author.html` in your browser. Either:
   - **Double-click it in Finder** (works via `file://` — clipboard
     fallback uses `document.execCommand("copy")` if `navigator.clipboard`
     is blocked).
   - Or serve from this directory: `cd tools && python3 -m http.server 8000`
     then open <http://localhost:8000/hotspot-author.html>.
2. Pick a room from the top-left dropdown.
3. Pick a variant (defaults to `baseline`). Variants come from the art
   manifest — every state overlay is available.
4. Drag existing hotspot rectangles to move them. Drag corner/edge
   handles on the selected rect to resize. Drag empty canvas to create
   a new hotspot. Arrow keys nudge (Shift = ×5).
5. Edit any field in the right side-panel (id, name, description, type,
   action, Elara dialog, x/y/w/h).
6. Click **Copy TS literal** to put the entire updated hotspots array
   on the clipboard. Paste it between `hotspots: [` and `],` in
   `apps/client/src/contexts/GameContext.tsx`.

## What's in the file

- Inlined JSON: every hotspot from every room in `ROOM_DEFINITIONS`
  (~660 hotspots across 28 rooms).
- Inlined JSON: every variant URL from the art manifest (~640 entries
  across 142 zip-dirs).
- Pure HTML/CSS/JS — no React, no build, no dependencies. Runs over
  `file://`.
- Loads room art directly from the dgrsart S3 CDN.

## Regenerating the embedded data

When you add new rooms or new variants, re-run:

```bash
pnpm tsx apps/scripts/_extract-hotspot-data.ts
pnpm tsx apps/scripts/_extract-room-variants.ts
```

Both scripts write to `tools/hotspot-author-data.json` and
`tools/hotspot-author-variants.json`. After regenerating, rebuild the
HTML (the data is embedded — replace the contents between
`const ROOMS = ...;` and `const VARIANTS = ...;` with the new JSON).

A future improvement would be to add `scripts/_build-hotspot-author.mjs`
that templates the HTML automatically. For now manual is fine — the
data doesn't change often.

## Known limitations

- The 4 placeholder-art rooms (`engineering`*, `antiquarian-library`*,
  `dreams-workshop-subbasement`, `hall-of-disappearances`) — only the
  first two have art under a different zipDir name (`engineering_bay`
  and `antiquarians_library` plural). The tool handles those via a
  small override map. The last two have no manifest entries at all
  and show "(no art available)" in the variant dropdown.
- `requiresTier?` is not yet a `HotspotDef` field, so variant-specific
  hotspot overrides can't be authored here yet. When that schema lands,
  add a "Show in tier" multi-select to the side panel.
- Render-order (z-stacking) follows array order — to reorder hotspots,
  you'll need to re-arrange them in `GameContext.tsx` after pasting
  the TS literal back.
- Mystery-action IDs (`room-mystery:roomId:hotspotId`) are validated
  by `pnpm vitest run apps/shared/roomMysteries/hotspotIdParity.test.ts`
  — if you rename an `id` that's referenced in a `RoomMysteryModule`
  union, you'll need to update the module too.

## When to use this vs `/ark?author-hotspots=1`

- **`/ark?author-hotspots=1`** is better when you want to test
  hotspots against live game state (Elara dialog popup, NPC
  manifestation, debug-flag interactions). Requires a working dev
  server.
- **This standalone tool** is better when you just need to re-anchor
  coordinates against the art without booting anything. Bypasses dev-
  server, auth, service-worker, and provider boilerplate entirely.

Both produce the same export format — paste-ready TS literals for
`GameContext.tsx`.
