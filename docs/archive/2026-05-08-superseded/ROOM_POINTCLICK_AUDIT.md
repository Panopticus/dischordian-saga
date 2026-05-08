# Room Point-and-Click Audit

_Generated 2026-04-30 alongside `apps/shared/roomMediaPrompts.ts` and the §6.3b accessibility parity probe. Regeneratable from the codebase — see "Regeneration" at the bottom._

This doc inventories every LucasArts-style point-and-click room in Loredex OS, its hotspot/exit/multi-stage-art status, and the gap between today and the plan in `/root/.claude/plans/analyze-every-room-for-streamed-prism.md`.

## Headline Numbers

- **Rooms in scope:** 32 (26 universal + 6 species-exclusive bonus)
- **Authored mystery modules today:** 9 of 26 universal (35%)
- **Multi-stage art today:** 4 of 32 (12.5%) — cryo-bay, medical-bay, bridge, engineering
- **After plan execution:** 11 of 32 (34%) for high-narrative rooms
- **Shadow Tongue point-and-click presence today:** narrative references only; 0 dedicated hotspots
- **Class/archetype/faction-gated rooms:** 0 (linear unlock for everyone)
- **Species-gated rooms:** 6 (bonus content; no critical-path content lives there)

## Accessibility Model (verified)

The current code architecture guarantees universal critical-path access:

| gate type | rooms | impact |
|---|---|---|
| linear (Prelude) | 10 | mandatory for all signatures |
| linear (Outbreak) | 7 | mandatory for all signatures |
| post-outbreak (Phase 5+) | 5+ | freely navigable Act 1+ |
| species-exclusive (DeMagi) | 2 | bonus content, ⅓ of players |
| species-exclusive (Quarchon) | 2 | bonus content, ⅓ of players |
| species-exclusive (Ne-Yon) | 2 | bonus content, ⅓ of players |
| class-exclusive | 0 | none exists |
| archetype-exclusive | 0 | archetypes drive dialog only |
| faction-exclusive | 0 | factions drive trust/quests only |
| outcome-branch-exclusive | 0 | outcomes drive cinematics/rewards only |

Verified by `apps/shared/roomAccessibilityParity.test.ts` — runs `canAccessRoom(room, sig)` across all 240 character-creation signatures × every critical-path room (~6,000 access checks). All universal rooms green; species rooms gated to exactly the matching species.

## Per-Room Inventory (universal rooms — 26)

Hotspot counts include both authored mystery hotspots and decorative/easter-egg ones. "Multi-stage" is one of: 4-state flag-driven (Section F), tier-based (T0/T2/T3), or "T0 only" (single legacy CDN PNG).

| room | deck | hotspots | multi-stage | mystery module | gap |
|---|---|---|---|---|---|
| **cryo-bay** | 1 Habitation | 13 | 4-state ✓ | `cryoBayMystery.ts` | none — golden reference |
| **medical-bay** | 1 Habitation | 7 | 4-state ✓ | `roomMysteries/medicalBay.ts` | needs engineering exit gate |
| **bridge** | 2 Command | 13 | T0/T2/T3 ✓ | `roomMysteries/bridge.ts` | ST narrative-only; need tier-3 annotations |
| **archives** | 2 Command | 6 (2 mystery) | T0 only | `roomMysteries/archives.ts` | only 2 ST hotspots; primary ST room is thin |
| **comms-array** | 3 Operations | 9 | T0 only | `roomMysteries/commsArray.ts` | no ST callback chain |
| **observation-deck** | 4 Astronomy | 0 | T0 only | NONE | high narrative weight, no module |
| **engineering** | 5 Engineering | 6 | T0/T2/T3 ✓ | `roomMysteries/engineering.ts` | ST schematic-edits not surfaced |
| **engineering-core** | 5 Engineering | 0 | T0 only | NONE | dead-end risk |
| **armory** | 6 Combat | 1 | T0 only | `roomMysteries/armory.ts` (easter egg) | only easter egg |
| **cargo-hold** | 6 Combat | 1 | T0 only | `roomMysteries/cargoHold.ts` (easter egg) | only easter egg |
| **captains-quarters** | 7 Restricted | 1 | T0 only | `roomMysteries/captainsQuarters.ts` (easter egg) | only easter egg |
| **antiquarian-library** | 8 Crafting | 0 | T0 only | NONE | no module |
| **forge-workshop** | 8 Crafting | 0 | T0 only | NONE | no module |
| **oracle-sanctum** | 9 Mystic | 0 | T0 only | NONE | no module; high narrative |
| **shadow-vault** | 9 Mystic | 0 | T0 only | NONE | no module; literal ST cell |
| **war-room** | 10 Tactics | 0 | T0 only | NONE | no module; high traffic |
| **cipher-den** | 10 Tactics | 0 | T0 only | NONE | no module; name suggests ST hub |
| **order-tribunal** | 10 Tactics | 0 | T0 only | NONE | no module |
| **chaos-forge** | 11 Elemental | 0 | T0 only | NONE | no module |
| **elemental-nexus** | 11 Elemental | 0 | T0 only | NONE | no module |
| **quantum-lab** | 12 Science | 0 | T0 only | NONE | no module |
| **synthesis-chamber** | 12 Science | 0 | T0 only | NONE | no module |
| **station-dock** | 13 External | 0 | T0 only | NONE | no module; act-2 launchpad |
| **guild-sanctum** | 14 Social | 0 | T0 only | NONE | no module |
| **social-hub** | 14 Social | 0 | T0 only | NONE | no module |
| **dreams-workshop-subbasement** | 15 Hidden | 0 | T0 only | NONE | no module |

## Per-Room Inventory (species-exclusive bonus rooms — 6)

Gated by `canAccessRoom()` in `apps/shared/characterCreationImpact.ts` lines 283–292. ⅔ of players never enter each. **MUST NOT** contain critical-path content.

| room | species | hotspots | multi-stage | mystery module | nano-banana prompt id |
|---|---|---|---|---|---|
| the_elemental_forge | DeMagi | 0 | none | NONE | `the_elemental_forge:initial` (P2) |
| blood_archive | DeMagi | 0 | none | NONE | `blood_archive:initial` (P2) |
| probability_chamber | Quarchon | 0 | none | NONE | `probability_chamber:initial` (P2) |
| dimensional_observatory | Quarchon | 0 | none | NONE | `dimensional_observatory:initial` (P2) |
| hybrid_sanctum | Ne-Yon | 0 | none | NONE | `hybrid_sanctum:initial` (P2) |
| the_between | Ne-Yon | 0 | none | NONE | `the_between:initial` (P2) |

## Shadow Tongue Presence Map

Today the Shadow Tongue narrative thread exists only in dialog/relationship code (`apps/client/src/game/shadowTongueRelationship.ts` — 7 trust tiers, 5 personality archetypes, 8 VO lines, 7 revelations) and in the `CorruptibleBio` Loredex wrapper. No room currently has a Shadow Tongue hotspot.

After plan execution:

| room | new ST hotspots | revelation chain entry |
|---|---|---|
| archives | corrupted-scroll-rack, rewritten-ledger, indigo-glow-lectern, unnameable-hue-cabinet | scrolls-rewritten, ledger-rewrite-pattern, editor-uses-elara-creds, hue-borrowed-from-witness |
| bridge | (tier-3 escalation on tactical-display + timeline-projector) | edits-on-conspiracy-board, age-of-privacy-edited |
| comms-array | voice-in-the-static, (tier-3 talk on static-screen) | he-speaks-in-static, direct-address-low-trust |
| engineering | schematic-pad | reactor-blueprint-edited |
| shadow-vault | sealed-cell-glass, manuscript-pile, warden-terminal, release-or-seal-lever | meeting-the-editor, the-novel-is-here, player-choice-st-fate |
| cipher-den | rosetta-pad, encrypted-correspondence, dictionary-of-edits, uncorruption-bench | warlord-vox-correspondence, edit-vocabulary-known |

## Activated Infrastructure (already shipped)

Code shipped on `claude/analyze-room-components-b4qjh`:

- **`apps/shared/roomMediaPrompts.ts`** — 28 nano-banana stills + 8 Veo 3.1 videos. Source of truth for asset-team rendering.
- **`apps/shared/shadowTongueEdits.ts`** — Typed `ActiveEdit` shape + pure helpers (`recordEdit`, `clearEdit`, `parseActiveEdits`, etc.). Gives the previously-empty `shadowTongueState.activeEdits` JSON column a structure the engine can read/write.
- **`apps/server/routers/epochWitness.ts`** — Three new tRPC procedures: `getShadowTongueState`, `recordActiveEdit`, `clearActiveEdit`. Both mutations protected; both emit ripple events.
- **`apps/shared/roomAccessibilityParity.test.ts`** — Brute-forces 240 signatures × 25 rooms; the load-bearing test that catches future regressions where a writer accidentally places progression content inside a species-gated room.

## Multi-Stage Art Coverage

| room | states defined | render assets shipped | covered by `roomMediaPrompts.ts`? |
|---|---|---|---|
| cryo-bay | 4 (initial / investigating / victim-identified / case-open-later) | yes | (existing in `roomStateArtPrompts.ts`) |
| medical-bay | 4 (initial / device-awakened / donated / refused) | yes | (existing in `roomStateArtPrompts.ts`) |
| bridge | 3 (T0/T2/T3) | yes | T0 + new `annotations-visible` ST state |
| engineering | 3 (T0/T2/T3) | yes | T0 + new `edited-schematics` and `restored-from-edits` |
| archives | 0 → 3 (corrupted / uncorrupted / tier-fluent) | NEW | yes (P0/P1 in manifest) |
| comms-array | 0 → 2 (static-haunted / signal-clear) | NEW | yes |
| observation-deck | 0 → 3 (initial / bond-resonance / purification-active) | NEW | yes |
| war-room | 0 → 2 (initial / active-conflict) | NEW | yes |
| station-dock | 0 → 2 (initial / ship-docked) | NEW | yes |
| engineering-core | 0 → 1 (initial) | NEW | yes |
| oracle-sanctum | 0 → 2 (initial / prophecy-active) | NEW | yes |
| shadow-vault | 0 → 3 (cell-sealed / cell-released / cell-resealed) | NEW | yes |
| cipher-den | 0 → 1 (initial) | NEW | yes |
| species-exclusive (×6) | 0 → 1 each (initial) | NEW | yes (P2 in manifest) |

## Veo 3.1 Video Coverage

Eight videos in `apps/shared/roomMediaPrompts.ts`. Engine treats videos as overlays; the corresponding still always renders as fallback.

| asset id | kind | duration | priority |
|---|---|---|---|
| `shadow-tongue:text-corruption-loop` | ambient loop | 8s | P0 |
| `archives:glyph-rewriting-loop` | ambient loop | 10s | P0 |
| `bridge:fast-travel-unlocked` | one-shot cinematic | 6s | P0 |
| `comms-array:signal-discovery` | one-shot cinematic | 5s | P0 |
| `cryo-bay:awakening` | one-shot cinematic | 12s | P1 |
| `shadow-vault:meeting` | one-shot cinematic | 8s | P0 |
| `observation-deck:bond-resonance-pulse` | ambient loop | 10s | P1 |
| `engineering:schematic-edit-reveal` | one-shot cinematic | 6s | P0 |

## Where to Find Things

| concept | file |
|---|---|
| 4-tier progression spine | `apps/shared/roomTier.ts` |
| Section F state-driven art (cryo, medical) | `apps/shared/roomStateArtPrompts.ts` |
| Tier-based art (bridge, engineering) | `apps/shared/roomTierArtPrompts.ts` |
| New nano-banana + Veo manifest | `apps/shared/roomMediaPrompts.ts` |
| Runtime variant picker | `apps/client/src/game/roomStateAssets.ts` |
| Mystery modules + hotspots | `apps/shared/roomMysteries/*.ts` (+ `cryoBayMystery.ts`) |
| Click handler / hotspot rectangles | `apps/client/src/contexts/GameContext.tsx` |
| Verb-coin UI | `apps/client/src/components/VerbCoin.tsx` |
| Point-and-click scene container | `apps/client/src/components/PointAndClickScene.tsx` |
| Prelude unlock chain | `apps/shared/preludeRoomGate.ts` (kebab-case ids) |
| Outbreak unlock order | `apps/shared/awakeningProtocol.ts` (snake_case ids) |
| Species gating | `apps/shared/characterCreationImpact.ts` (`canAccessRoom`) |
| Shadow Tongue trust + revelations | `apps/client/src/game/shadowTongueRelationship.ts` |
| Shadow Tongue edits typed data | `apps/shared/shadowTongueEdits.ts` |
| Shadow Tongue state DB | `apps/db/schema.ts` (table `shadowTongueState`) |
| Shadow Tongue tRPC | `apps/server/routers/epochWitness.ts` |
| Corruption visual shader | `apps/client/src/shaders/corruption.frag` |
| Corruption text wrapper | `apps/client/src/components/CorruptibleBio.tsx` |
| Accessibility parity probe | `apps/shared/roomAccessibilityParity.test.ts` |

## Known Foot-guns

1. **Room-id casing** — `OUTBREAK_ROOM_ORDER` uses snake_case (`cryo_bay`); `PRELUDE_ROOM_ORDER` and `ROOM_DEFINITIONS` use kebab-case (`cryo-bay`). Normalise before comparing. The parity probe handles this; new code must too.
2. **`shadow_tongue_state` is a single-row global** — id defaults to 1, no per-user. Mutations from a protected procedure record the originating `userId` in the ripple event for downstream consequence-engines, but the state itself is global canon.
3. **`activeEdits` JSON shape change** — was `Record<string, unknown>` and always empty; now structured. Any pre-existing client code parsing it directly should switch to `parseActiveEdits()` from `apps/shared/shadowTongueEdits.ts`.
4. **Species-room flags must not gate other content** — first-look flags like `demagi_forge_seen` are cosmetic/Loredex-only. The parity probe will fail loudly if a flag set only inside a species-gated room is consumed elsewhere as a prerequisite.
5. **`RULES_VERSION` bump** — adding flags is non-breaking; adding `connections:` entries to `ROOM_DEFINITIONS` mutates the deterministic graph. Bump `RULES_VERSION` if any test or replay relies on graph-derived shortest paths or unlock counts.

## Regeneration

This doc tracks four sources of truth:

- `apps/client/src/contexts/GameContext.tsx` (`ROOM_DEFINITIONS`)
- `apps/shared/roomMysteries/index.ts` (registered mystery modules)
- `apps/shared/characterCreationImpact.ts` (species-gated rooms)
- `apps/shared/roomMediaPrompts.ts` (planned new art)

A future PR should land an `apps/scripts/audit-room-pointclick.ts` that prints this table from those four sources so it never drifts.
