# Phase H — Producer-art Room Library Integration — Handoff

**Status**: 11 sub-phases delivered across 11 PRs merged to `main`.
This document is the production handoff: what was built, what's
deferred, and how to consume the new runtime systems.

## Phase H roster

| sub-phase | scope | PR |
|---|---|---|
| H.A | Asset ingest + inventory + canonical mapping | #602 |
| H.B | `roomArtManifest.ts` + `roomAssetCoverage` parity gate (561 entries) | #603 |
| H.C | `stateVariantRegistry.ts` + `compositeResolver.ts` (5-axis fallback chain) | #604 |
| H.D | Axis 9 TV-infection resolver + `axis9StateCoverage` | #605 |
| H.E | Axis 11 cycle-phase resolver + phase-locks + `axis11StateCoverage` | #606 |
| H.F | Axis 12 faction-livery resolver + `axis12StateCoverage` | #607 |
| H.G | Axis 13 storyteller-hook registry + dispatcher (~480 seed hooks) + `storyHookCoverage` | #608 |
| H.H | `useRoomArt` React hook + hotspot manifest sidecar + `hotspotCoverage` | #609 |
| H.I | Room reachability gating + unlock manifest (58 entries) + `roomReachabilityCoverage` | #610 |
| H.J | Visit-tier resolver wiring (`useVisitTier`) + parity consolidation | #611 |
| H.K | This handoff document | (this PR) |

## What's on `main` after Phase H

### Producer art

```
rooms_complete_library.zip          ingested (3.4 GB)
561 PNG files mapped to manifest    (60 rooms with art + 1 empty placeholder)
21 producer axes mapped to 5        canonical 13-axis grid sub-axes
                                    + 4 storyteller-hook clusters
166 spaces tracked                  60 rendered today; 106 deferred
```

### TypeScript modules

```
apps/shared/expansionArt/
  roomArtManifest.ts                561-entry typed manifest + accessors
  roomArtManifest.data.ts           generated data (do not hand-edit)
  roomArtManifest.test.ts           18 cases / 18 passing
  roomHotspotManifest.ts            19 stubbed deferred-space hotspot blocks
  roomHotspotManifest.test.ts        5 cases /  5 passing

apps/shared/roomVariants/
  stateVariantRegistry.ts           types + AXIS_DEPTHS canonical depths
  compositeResolver.ts              5-axis fallback chain
  compositeResolver.test.ts         13 cases / 13 passing
  axis9Resolver.ts                  TV-infection (5 states)
  axis9Resolver.test.ts              9 cases /  9 passing
  axis11Resolver.ts                 cycle-phase (5 states, 3 phase-locks)
  axis11Resolver.test.ts             8 cases /  8 passing
  axis12Resolver.ts                 faction-livery (8 states; multi-binding logic)
  axis12Resolver.test.ts             8 cases /  8 passing

apps/shared/roomHooks/
  storyHookRegistry.ts              StoryHook type + accessors
  storyHookRegistry.data.ts         ~480 seed hooks from H.A inventory
  hookDispatcher.ts                 activeStoryHooks / pickAxis13ForRoom
  hookDispatcher.test.ts             9 cases /  9 passing

apps/shared/roomGating/
  roomUnlockManifest.ts             58 entries + RoomUnlockRequirement union
  roomUnlockManifest.test.ts         6 cases /  6 passing

apps/client/src/game/
  useRoomArt.ts                     React hook returning ParallaxLayer[]
  useVisitTier.ts                   React hook bridging hotspotVisitTiers.ts schema

apps/shared/_completeness/checks/
  roomAssetCoverage.ts              parity gate (H.B)
  axis9StateCoverage.ts             parity gate (H.D)
  axis11StateCoverage.ts            parity gate (H.E)
  axis12StateCoverage.ts            parity gate (H.F)
  storyHookCoverage.ts              parity gate (H.G)
  hotspotCoverage.ts                parity gate (H.H)
  roomReachabilityCoverage.ts       parity gate (H.I)
```

### Tests

```
76 vitest cases across 8 Phase H test files — all passing
pnpm check clean
pnpm test → Phase H suite contributes 76 of total
```

### Parity gates (7 new)

```
art.room_asset_coverage             ratcheted  60/166 (36%)
art.axis9_state_coverage            ratcheted  partial per-room
art.axis11_state_coverage           ratcheted  partial per-room
art.axis12_state_coverage           ratcheted  partial per-room
art.story_hook_coverage             hard       full (seeded from H.A)
art.hotspot_coverage                ratcheted  68/166
art.room_reachability_coverage      ratcheted  58/117
```

## How to consume the new runtime

### Render a room with full state-variant composition

```tsx
import { useRoomArt } from "@/game/useRoomArt";
import ParallaxRoom from "@/components/ParallaxRoom";

function RoomBackdrop({ zipDir, narrativeFlags }) {
  const layers = useRoomArt(zipDir, { narrativeFlags });
  if (layers.length === 0) {
    return <LegacyImage src={roomDef.imageUrl} />; // fallback
  }
  return <ParallaxRoom layers={layers} fit="contain" />;
}
```

This automatically:
- Picks the producer-baseline still
- Adds Axis 9 TV-infection overlay (per `tv_phase_<n>` flags or per-room overrides)
- Adds Axis 11 cycle-phase overlay (per `timeOfDay.currentPhase()` + phase-locks)
- Adds Axis 12 faction-livery overlay (per `faction_bound_<id>` flag count)
- Adds Axis 13 storyteller-hook overlay (per `pickAxis13ForRoom` first-match)
- Degrades each overlay independently if not in the producer library

### Fire a storyteller hook

```ts
// To activate a room visual shift, write the matching narrative flag:
setNarrativeFlag("storyhook_cryo_bay_morality_dark", true);
// Next render: useRoomArt resolves axis13 = "morality_dark"
// → state_morality_dark.png is layered on top of baseline
```

The seed registry has ~480 hooks; see
`apps/shared/roomHooks/storyHookRegistry.ts` for the full list.

### Wire a visit-tier escalation

```tsx
const tier = useVisitTier(roomId, hotspotId, hotspotDef, {
  getCount: (r, h) => gameState.rooms[r]?.hotspotClickCount[h] ?? 0,
});

const response = tier?.responseId
  ? hotspotDef.responses[tier.responseId]
  : hotspotDef.responses[hotspotDef.defaultResponseId];
```

### Check room reachability with new gate types

```ts
import { ROOM_UNLOCK_BY_ID } from "@shared/roomGating/roomUnlockManifest";

const entry = ROOM_UNLOCK_BY_ID.get("hb.celebration_school");
// entry.unlock = { type: "hellbox_unlocked", hellbox: 1 }

// Adapter pattern (incremental adoption — leave GameContext alone):
function canAccessNewSpace(spaceId, game) {
  const entry = ROOM_UNLOCK_BY_ID.get(spaceId);
  if (!entry) return false;
  return checkUnlock(entry.unlock, game);
}
```

## Out-of-band step: CDN upload

The sandbox running this ingest lacked AWS credentials. CDN upload
of the 561 PNGs (3.4 GB) is **still pending**. Run from a
credentialed environment:

```bash
# Option A — use existing repo tooling
unzip -o rooms_complete_library.zip -d /tmp/rooms_library
mkdir -p apps/client/public/art/rooms
cp -r /tmp/rooms_library/rooms/* apps/client/public/art/rooms/
pnpm tsx apps/scripts/upload-public-to-s3.ts --only=art

# Option B — direct S3 sync
aws s3 sync /tmp/rooms_library/rooms s3://dgrsart/cdn/client-public/art/rooms
```

Once uploaded, every URL the manifest generates resolves:
```
https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/<zipDir>/<filename>
```

## Outstanding TBDs (deferred to follow-up)

```
[1] CDN upload                                            (credentialed env)
[2] ArkExplorerPage adoption of useRoomArt                (one-line swap)
[3] GameContext.canAccessRoom() adoption of new gate types (incremental)
[4] 105 producer-deferred spaces (12 HB + 7 veh + 60 dest + 36 apprentice)
    awaiting future producer-art passes
[5] _PRODUCTION_CROSS_CUT.md §F.1 sync (460 new cutscene IDs from
    Phase G + apprentice work) — separate doc-pass
[6] Per-room §13 storyteller-hook narrative-flag canonicalization
    (currently uses synthesised "storyhook_<zipDir>_<variantKey>"
    flags; narrative team can rename to registered flags from
    narrativeFlagRegistry.ts as gameplay scenes are authored)
[7] Hotspot expansion: 60 destinations + 36 apprentice spaces still
    need authored hotspot bounding boxes (sidecar in
    roomHotspotManifest.ts can grow incrementally)
```

## Cumulative production-asset roster (post-Phase-H)

```
spaces declared (PRODUCTION_FINAL.md):             166
spaces rendered today:                              60 (37%)
spaces with explicit unlock gating:                 58 (49% of 117 deferred)
spaces with at least one hotspot:                   68 (49 inline + 19 sidecar)

state-variant resolvers operational:                 4 (Axis 9, 11, 12, 13)
storyteller hooks seeded:                         ~480
parity gates added in Phase H:                       7

vitest cases in Phase H modules:                    76 (all passing)
```

## Phase H verdict

Producer-art delivery integrated into the runtime as a data-and-
resolver layer. The 49 existing Ark rooms continue to render via
their legacy `ROOM_DEFINITIONS.imageUrl`; the new producer-baseline
art is available via `useRoomArt` for incremental adoption. State
variants (TV-infection, faction-livery, cycle-phase, storyteller
hooks) are wired and degrade gracefully when variants are missing.

The 105 deferred spaces (Hellboxes / vehicles / destinations /
apprentice spaces beyond the producer-delivered 2) have unlock
gating + hotspot stubs ready for the day the producer's next
passthrough lands. Subsequent producer-art releases plug into the
same manifest + resolver chain with zero runtime changes — just
filesystem ingest + manifest regeneration.

**End of Phase H.**
