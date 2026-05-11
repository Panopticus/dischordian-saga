# Phase H.A — Producer-art room library ingest

**Status**: H.A first sub-phase of Phase H rollout. The producer-art
team's final passthrough delivery (`rooms_complete_library.zip`,
3.4 GB, 561 PNG files) has been **inventoried + mapped**.
Out-of-band step (CDN upload) is deferred to a credentialed
environment; subsequent sub-phases (H.B–H.K) consume the
manifest data committed in this PR.

This document is the H.A handoff. The plan-driven rollout
contract is in `/root/.claude/plans/mellow-waddling-stream.md`.

## What was delivered

```
zip source:           dgrsart S3 prefix AAA Final/rooms_complete_library.zip
zip size:             3,378,940,259 bytes (3.4 GB)
total room dirs:      61
total PNG files:      561
average per room:     ~9.2 (1 baseline + ~8.2 state variants)
state variants:       501 distinct files across 21 producer-named axes
```

### Per-room file structure (canonical)

```
<zip_dir_name>/
├── baseline.png                      # the master still (always present)
└── state_<axis>_<value>.png          # 1–14 state variants per room
```

Examples:
- `cryo_bay/baseline.png`
- `cryo_bay/state_tv_spreading.png`        ← Axis 9 TV-infection
- `cryo_bay/state_faction_insurgency.png`  ← Axis 12 faction-livery
- `cryo_bay/state_cycle_longnight.png`     ← Axis 11 cycle-phase
- `cryo_bay/state_act_tier_2.png`          ← Axis 15 investigation tier
- `cryo_bay/state_morality_dark.png`       ← Axis 13 storyteller hook

### Producer axis taxonomy (vs canonical 13-axis grid from INCEPTION §6.5)

```
producer axis      canonical          count   notes
─────────────────  ─────────────────  ─────   ────────────────────────────────
tv                 Axis 9 TV-inf       63     5 states across most rooms
cycle              Axis 11 cycle       30     longnight + dawn variants
faction            Axis 12 faction     46     8 faction states across rooms
epoch              Axis 10 epoch       30     shadowtongue grand-edit states
act                Axis 15 inv tier    84     tier_1..tier_7 (some tier2/tier5
                                              format inconsistency — H.B
                                              manifest normalizes)
morality           Axis 13 storyteller 52     dark / light per-room
season             Axis 13 storyteller 35     battle-pass season states
battlepass         Axis 13 storyteller 30     battlepass-theme overlays
investigation      Axis 15 inv tier    29     device_awakened, case_closed
governance         Axis 7 governance   29     quarantine, lore_unlock, etc.
irl                Axis 13 storyteller 21     IRL-season tie-ins
unlock             Axis 13 storyteller 20     hellbox, crew, cohort
trust              Axis 13 storyteller 11     companion-bond milestones
lore               Axis 13 storyteller 10     lore-tome reveal states
event              Axis 8 event window  3     finals, qualifier
companion          Axis 13 storyteller  3     companion-trust milestones
tournament         Axis 8 event window  1     finals
system             Axis 13 storyteller  1     system unlock
reveal             Axis 13 storyteller  1     daniel reveal
human              Axis 13 storyteller  1     Human reveal
hellbox            Axis 13 storyteller  1     Hellbox unlock
```

Producer used multiple value-naming inconsistencies (e.g., `tier_2`
vs `tier2`, `longnight` only for cycle). H.B manifest will
normalize these to the canonical taxonomy.

## Coverage vs production-doc spec

```
_PRODUCTION_FINAL.md spaces:                              166
  PART III  Ark rooms (A.1–A.49)                            49
  PART IV   Hellboxes (H.1–H.12)                            12
  PART V    Vehicles (V.1–V.7)                               7
  PART VI   Destinations (E.1–E.5; 60 zones)                60
  PART VIII Apprentice/pedagogy/etc.                        38

producer-art delivered:                                     61
  Ark rooms (full or close match):                          49
  Apprentice spaces (apprentice_berth + pedagogy_hall):      2
  Prelude sub-rooms (3 of A.49):                             3
  Sub-zones (reactor_control, personal_quarters):            2
  NEW rooms not in production-doc spec:                      5
    - auction_house, dreamers_sanctum, meditation_garden,
      order_tribunal, game_masters_sanctum

coverage:                                                   37% (61 / 166)
deferred for future producer-art passes:                   105 spaces
  - 12 Hellboxes
  - 7 vehicles
  - 60 destinations
  - 36 of 38 apprentice/pedagogy/berth/guild spaces (only 2 delivered)
```

The 105 deferred spaces will be addressed in subsequent producer-
art passes; H.B–H.K manifests use graceful fallback so the runtime
renders what's available and degrades cleanly for what isn't.

The 5 new rooms not in the production-doc spec (auction_house,
dreamers_sanctum, meditation_garden, order_tribunal,
game_masters_sanctum) are accepted as canonical additions; H.K
back-matter will document them as additions to the production-doc
spec.

## Files committed in this H.A pass

```
apps/scripts/_phase_h/
├── room_library_inventory.json     # 3,425-line full per-room file inventory
│                                     (561 files; 61 rooms; states parsed
│                                     into {axis, value, stem} objects)
└── room_library_mapping.json       # zip dir-name → canonical space_id
                                      mapping table + axis taxonomy + CDN
                                      destination spec + upload-step doc

docs/production/
└── _PHASE_H_INGEST.md              # this document
```

## Out-of-band step: CDN upload

The sandbox running this ingest lacks AWS credentials. Producer-
side (or a credentialed CI run) must execute the upload before
H.B+ runtime can render. Two options:

### Option A — Use existing upload tooling (recommended)

```bash
# 1. Extract zip into apps/client/public/art/rooms/
mkdir -p apps/client/public/art/rooms
unzip -o /path/to/rooms_complete_library.zip -d /tmp/rooms_library
cp -r /tmp/rooms_library/rooms/* apps/client/public/art/rooms/

# 2. Run existing upload script (requires AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY)
pnpm tsx apps/scripts/upload-public-to-s3.ts --only=art

# 3. Verify
pnpm tsx scripts/_check-art-coverage.mjs
```

### Option B — Direct S3 sync (if extracted)

```bash
aws s3 sync /tmp/rooms_library/rooms \
  s3://dgrsart/cdn/client-public/art/rooms \
  --acl public-read \
  --cache-control "public, max-age=31536000"
```

### Expected URL pattern post-upload

```
https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/<zip_dir>/<filename>
```

Example: `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/cryo_bay/baseline.png`

## What's next (Phase H sub-phases)

| sub-phase | scope | depends on |
|---|---|---|
| **H.B** | `roomArtManifest.ts` — TypeScript manifest using the H.A JSON inventory; first batch 49 Ark rooms tier-0 wired into `resolveRoomBackgroundUrl()`. `roomAssetCoverage` parity gate. | H.A merged |
| **H.C** | `ParallaxRoom.tsx` multi-variant + `stateVariantRegistry.ts` scaffold | H.B merged |
| **H.D** | Axis 9 (TV-infection) resolver + 63 state variants wired | H.B + H.C |
| **H.E** | Axis 11 (time-of-day) wire-in; phase-locks for Warden's Dock + Memory Library | H.B + H.C |
| **H.F** | Axis 12 (faction-livery) resolver + 46 faction state variants | H.B + H.C |
| **H.G** | Axis 13 storyteller-hook registry — extracts every §13 hook from PARTs II–VIII of `_PRODUCTION_FINAL.md` (60,078 lines) into typed registry | H.B + H.C |
| **H.H** | Hotspot expansion: 49 → 166 rooms in `ROOM_DEFINITIONS`; hotspots from zip JSON if present else from §4 "Objects" lists | H.B |
| **H.I** | Room reachability gating: extend `unlockRequirement` enum; gate 117 new spaces (12 HB + 7 veh + 60 dest + 38 apprentice — some deferred) | H.H |
| **H.J** | 7 ship-check parity gates consolidated; visit-tier resolver wired | H.B–H.I |
| **H.K** | `pnpm ship:check` clean; cross-doc sync `_PRODUCTION_CROSS_CUT.md` §F.1; production handoff. Includes adding the 5 new producer-delivered rooms (auction_house, dreamers_sanctum, meditation_garden, order_tribunal, game_masters_sanctum) to `_PRODUCTION_ARK_ROOMS.md` with full §4 specs | H.J |

## Verification (H.A done-stamp)

- [x] `rooms_complete_library.zip` downloaded (3.4 GB)
- [x] Extracted: 561 PNG files across 61 room directories
- [x] Full inventory at `apps/scripts/_phase_h/room_library_inventory.json`
- [x] Canonical space-id mapping at `apps/scripts/_phase_h/room_library_mapping.json`
- [x] Axis taxonomy documented (21 producer axes → canonical 13-axis grid)
- [x] Coverage gap documented (37%; 105 spaces deferred)
- [ ] CDN upload (OUT-OF-BAND; documented above)

## Acceptance criteria

`H.A passes when`:
1. The inventory + mapping JSON files are on `main`
2. This handoff document is on `main`
3. CDN upload is queued for out-of-band execution by a credentialed
   producer-side or CI process
4. H.B can begin authoring the TypeScript manifest against this
   JSON data
