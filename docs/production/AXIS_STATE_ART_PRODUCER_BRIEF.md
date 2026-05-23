# Axis-State Art — Producer Brief

**Status:** awaiting producer drop.
**Owners:** producer (art), engineering (post-drop ingest).
**Tracked by:** `art.axis9_state_coverage`, `art.axis11_state_coverage`,
`art.axis12_state_coverage` — three RATCHET rows in
`pnpm ship:check` (gaps 192 + 120 + 321 = **633 PNGs**).

**Companion doc:** `docs/production/AXIS_STATE_ART_PROMPT_GUIDE.md`
covers the exact pixel dimensions, the composition lock with the
baseline, per-axis prompt vocabulary, and validation checklists.
Read both — this brief is the *what / where*, the prompt guide
is the *how to match*.

---

## What this unblocks

Three rendering axes ship producer art per-room-per-state:

- **Axis 9** — *TV-infection* (one of 5 states per room: clean,
  exposed, spreading, corrupted, quarantined). Reflects the Hierarchy
  thought-virus seeping through the Ark.
- **Axis 11** — *Cycle-phase* (one of 5: dawn, midday, dusk,
  nightwatch, longnight). Reflects the saga's diurnal cycle.
- **Axis 12** — *Faction-livery* (one of 8: none, hierarchy,
  dreamers, pureflame, insurgency, panopticon, collectors, multi).
  Reflects which faction visually dominates the room.

Today: every room that has *any* variant in a given axis declares
the full state set, but most rooms ship only one or two variants.
The compositeResolver degrades gracefully (no crash, just no
overlay), but the visual richness the axis system was designed for
goes unrealized.

The ratchets count the gap honestly. The producer ships PNGs in
the right convention; engineering runs ingest; the ratchets shrink.

## Counts (audit-driven, 2026-05-23)

Source of truth — re-run `pnpm tsx apps/scripts/audit-art-ratchet-gaps.ts`
for the live numbers.

| Axis | Rooms-with-any-variant | States | Declared | Implemented | Gap |
|---|---:|---:|---:|---:|---:|
| Axis 9 (tv) | 51 | 5 | 255 | 63 | **192** |
| Axis 11 (cycle) | 30 | 5 | 150 | 30 | **120** |
| Axis 12 (faction) | 43 | 8 | 344 | 23 | **321** |
| **Total** | | | | | **633** |

The audit confirms **all 633 are genuinely missing** (not on CDN,
not in manifest). No "manifest stale" reconciliation to do first.

## Rooms in scope

The full per-axis room list is the output of:

```bash
pnpm tsx apps/scripts/audit-art-ratchet-gaps.ts
```

Highlights:

- **Axis 9 (tv) rooms include:** archives, armory, apprentice_berth,
  auction_house, bridge, cades_console, captains_quarters,
  cargo_hold, casino_floor, chaos_forge, chess_hall, cipher_den,
  comms_array, cryo_bay, daily_resource_board,
  defense_command_center, dreamers_sanctum, eidolon_sanctum,
  elemental_nexus, engineering_bay, engineering_core, forge_workshop,
  game_masters_sanctum, governance_chamber, grand_masters_sanctum,
  guild_sanctum, hierarchy_throne, medical_bay, meditation_garden,
  memorial_corridor, observation_deck, oracle_annual_sanctum,
  oracle_sanctum, order_tribunal, pedagogy_hall, pet_garden,
  pet_medical_annex, puzzle_study_chamber, quantum_lab,
  reactor_control, shadow_vault, social_hub, station_dock,
  synthesis_chamber, tower_assembly_bay, trade_hub, trophy_armory,
  trophy_room, war_room (51 total)
- **Axis 11 (cycle) rooms:** ~30 distinct (smaller set; mostly the
  inhabited / time-of-day-meaningful spaces — archives, armory,
  bridge, captains_quarters, cargo_hold, cryo_bay, medical_bay,
  pet_garden, war_room etc.)
- **Axis 12 (faction) rooms:** ~43 distinct (similar to axis 9,
  excluding rooms that are canonically single-faction).

## ZIP delivery convention

Producer ships one ZIP per axis (or one big ZIP — both work).
Filename must match the canonical normaliser:

```
<axis>_state_variants.zip
├── <zipDir>/
│   ├── state_<axis>_<value>.png
│   ├── state_<axis>_<value>.png
│   └── …
└── <zipDir>/
    └── state_<axis>_<value>.png
```

Example for the tv axis:

```
axis9_tv_states.zip
├── cryo_bay/
│   ├── state_tv_clean.png
│   ├── state_tv_exposed.png
│   ├── state_tv_corrupted.png
│   └── state_tv_quarantined.png
├── archives/
│   ├── state_tv_clean.png
│   ├── state_tv_exposed.png
│   ├── state_tv_spreading.png
│   ├── state_tv_corrupted.png
│   └── state_tv_quarantined.png
└── …
```

**Naming rules** (enforced by the Phase-H normaliser at
`apps/scripts/_phase_h/_filename_normalisers.ts`):
- Snake-case room ids (match canonical zipDir).
- Files literally named `state_<axis>_<value>.png` — no prefixes,
  no suffix tags, no per-shot numbering. One PNG per (room, axis,
  state) tuple.
- Resolution should match the room's baseline.png aspect.

## State vocabularies (strict)

The normaliser rejects unknown values. Use exactly these tokens:

- **axis9 (tv):** `clean`, `exposed`, `spreading`, `corrupted`, `quarantined`
- **axis11 (cycle):** `dawn`, `midday`, `dusk`, `nightwatch`, `longnight`
- **axis12 (faction):** `none`, `hierarchy`, `dreamers`, `pureflame`,
  `insurgency`, `panopticon`, `collectors`, `multi`

A `multi` faction variant means "multiple factions visibly co-present"
— used when no single livery dominates.

## Engineering post-drop steps

1. **Producer uploads ZIP** to `s3://dgrsart/producer_drops/<filename>.zip`.
2. **Engineer runs ingest** (template — exact script lands when the
   ZIP arrives; the existing Phase-H ingest pipeline at
   `apps/scripts/_phase_h/` is the template):

   ```bash
   pnpm tsx apps/scripts/_phase_h/<ingest-script>.ts \
     --zip s3://dgrsart/producer_drops/axis9_tv_states.zip \
     --axis tv
   ```

   The ingest pipeline:
   - Downloads + extracts the ZIP.
   - Normalises filenames via `_filename_normalisers.ts`.
   - Uploads PNGs to `s3://dgrsart/cdn/client-public/art/rooms/<zipDir>/`.
   - Appends entries to `apps/shared/expansionArt/roomArtManifest.data.ts`
     (auto-generated section).
3. **Verify the ratchet shrinks:**

   ```bash
   pnpm tsx apps/scripts/audit-art-ratchet-gaps.ts
   pnpm ship:check
   ```

   Both should show the new lower gap; tighten ratchet state with
   `pnpm ship:check --update-ratchet` once happy.
4. **Commit** the regenerated `roomArtManifest.data.ts` and
   `ratchet-state.json`. The runtime picks up new entries
   automatically (composite resolver, useRoomArt).

## Optional first drop (smallest valuable slice)

If the producer wants to validate the pipeline before drawing all
633, the cheapest meaningful drop is:

- **axis11 cycle for cryo_bay alone** — 5 PNGs (dawn / midday /
  dusk / nightwatch / longnight). Closes 4 of the 120 axis11 gap
  (cryo_bay already has longnight today).

That's a 5-PNG ZIP, ~30 minutes of art, that exercises the entire
ingest pipeline end-to-end without committing the producer to the
full sweep.

## Why this matters

The compositeResolver consults axes 9/11/12 every time a room
renders (`apps/client/src/game/useRoomArt.ts:50-70`). With most
states absent, rooms render flat — the same visual whether the
Hierarchy thought-virus is at peak corruption or the dawn cycle
is on or the Insurgency just took the room. Closing the gap turns
the canvas into the dynamic, state-aware tableau the spec
described.

## Background

- `apps/shared/expansionArt/roomArtManifest.ts:33-62` — RoomArtEntry
  shape (zipDir, axis, value, variantKey, relPath).
- `apps/shared/_completeness/checks/axis9StateCoverage.ts` (+
  `axis11StateCoverage.ts`, `axis12StateCoverage.ts`) — the ratchet
  rule. "Every room with at least one variant must declare all states."
- `apps/scripts/audit-art-ratchet-gaps.ts` — the live enumerator.
- `apps/scripts/_phase_h/` — the ingest pipeline directory; pattern
  copied from prior NEW_ART drops.
- `apps/scripts/upload-public-to-s3.ts` — the broader S3 sync
  script (different surface; CDN drops use this, raw producer ZIPs
  use the Phase-H ingest).
