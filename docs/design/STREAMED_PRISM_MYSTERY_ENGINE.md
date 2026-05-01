# Plan: Room Point-and-Click Audit + Shadow Tongue Wiring + Media Prompt Manifest

## Context

The user asked us to (a) audit every LucasArts-style room for hotspots and multi-stage art, (b) "make the Shadow Tongue point-and-click components perfect," (c) verify the path by which rooms unlock so every room has a thing-to-do, and (d) author nano-banana (Gemini 2.5 Flash Image) prompts for new stills and Veo 3.1 prompts for new videos.

**Why now:** the room system is partially built — 9 of 26 rooms have authored mystery modules; only 4 rooms (cryo-bay, medical-bay, bridge, engineering) have multi-stage art; Shadow Tongue (Ny'Koth) has a deep dialog/trust system but almost no point-and-click surface, and the DB column `shadowTongueState.activeEdits` is unused. 17 rooms have no module at all and risk being dead-end stops on a click-through.

**Outcome:** every room has at least 1-3 hotspots that set a flag / grant inventory / open an exit; Shadow Tongue is wired into Archives (his primary room), Bridge, Comms Array, Engineering, and a new Shadow Vault scene with a lean uncorruption mini-loop; a single typed manifest at `apps/shared/roomMediaPrompts.ts` holds every nano-banana still and Veo 3.1 video the asset team needs to render.

---

## Phasing (chunkable)

- **Phase A — Audit + spec doc** (paper-only, ~1 day): generate `docs/production/room-pointclick-audit.md` from the audit script; land Shadow Tongue spec doc.
- **Phase B — Shadow Tongue point-and-click wiring** (~2-3 days): extend `archives.ts`, `bridge.ts`, `commsArray.ts`, `engineering.ts`; new `shadowVault.ts`, `cipherDen.ts`; wire `activeEdits` through tRPC; ship the uncorruption combine-loop.
- **Phase C — Progression-spine fixes** (~3-4 days): minimal modules for the 17 unmoduled rooms; add missing exits.
- **Phase D — Media manifest + asset gen** (parallel to C): land `apps/shared/roomMediaPrompts.ts`; render Veo loops + new state stills.
- **Phase E — Verification**: vitest + manual click-through + asset coverage probe + lint:void-energy.

---

## 1. Per-Room Audit Table

26 rooms. Columns: hotspots today | exits today | multi-stage art status | gap | minimum fix.

| room | deck | hotspots | exits | multi-stage | gap | minimum fix |
|---|---|---|---|---|---|---|
| cryo-bay | 1 | 13 | medical-bay, bridge | 4-state ✓ | none — golden reference | hold |
| medical-bay | 1 | 7 | cryo-bay | 4-state ✓ | no engineering exit | add `door-engineering` gated on `medbay_first_clue_found` |
| bridge | 2 | 13 | cryo-bay, archives, comms-array | T0/T2/T3 ✓ | ST narrative-only | add tier-3 ST annotations on tactical-display + timeline-projector |
| archives | 2 | 6 (only 2 mystery) | bridge | T0 only | ST primary room is thin; needs T2/T3 art | extend to 5 hotspots; add `archives:corrupted` + `archives:uncorrupted` art |
| comms-array | 3 | 9 | bridge, observation-deck | T0 only | no ST callback chain | add `voice-in-the-static` hotspot |
| observation-deck | 4 | 0 (no module) | comms-array | T0 only | no module, possible dead-end | new module + T2 Bond-Resonance art |
| engineering | 5 | 6 | medical-bay, engineering-core | T0/T2/T3 ✓ | ST edits-the-schematics not surfaced | add `schematic-pad` hotspot |
| engineering-core | 5 | 0 | engineering | T0 only | NO MODULE | 3-hotspot module |
| armory | 6 | 1 (easter egg) | observation-deck | T0 only | only easter egg | 3-hotspot module |
| cargo-hold | 6 | 1 (easter egg) | armory | T0 only | only easter egg | 3-hotspot module + station-dock exit |
| captains-quarters | 7 | 1 (easter egg) | bridge (key-gated) | T0 only | only easter egg | 4-hotspot module (vox-desk, hidden-safe, dream-journal, mirror) |
| forge-workshop | 8 | 0 | engineering | T0 only | NO MODULE | 3-hotspot module |
| antiquarian-library | 8 | 0 | captains-quarters | T0 only | NO MODULE | 3-hotspot module |
| oracle-sanctum | 9 | 0 | observation-deck | T0 only | NO MODULE; high narrative | 3-hotspot module + T2 art |
| shadow-vault | 9 | 0 | armory | T0 only | NO MODULE; literal ST cell | 4-hotspot encounter scene + T2/T3 art |
| war-room | 10 | 0 | bridge, station-dock, social-hub | T0 only | NO MODULE; high traffic | 3-hotspot module + T2 art |
| cipher-den | 10 | 0 | comms-array | T0 only | NO MODULE; name suggests ST hub | 4-hotspot ST decryption hub |
| order-tribunal | 10 | 0 | bridge | T0 only | NO MODULE | 2-hotspot module |
| chaos-forge | 11 | 0 | engineering | T0 only | NO MODULE | 2-hotspot module |
| elemental-nexus | 11 | 0 | observation-deck | T0 only | NO MODULE | 2-hotspot module |
| quantum-lab | 12 | 0 | archives | T0 only | NO MODULE | 2-hotspot module |
| synthesis-chamber | 12 | 0 | medical-bay | T0 only | NO MODULE | 2-hotspot module |
| station-dock | 13 | 0 | engineering, war-room | T0 only | NO MODULE; act-2 launchpad | 3-hotspot module + T2 ship-docked art |
| guild-sanctum | 14 | 0 | bridge, station-dock | T0 only | NO MODULE | 2-hotspot module |
| social-hub | 14 | 0 | bridge, guild-sanctum, war-room | T0 only | NO MODULE | 2-hotspot module |
| dreams-workshop-subbasement | 15 | 0 | bridge | T0 only | NO MODULE | 3-hotspot module |

**Species-exclusive bonus rooms** (gated by `canAccessRoom()` in `apps/shared/characterCreationImpact.ts` lines 283-292; only ⅓ of players see each):

| room | species gate | hotspots | art | gap | minimum fix |
|---|---|---|---|---|---|
| the_elemental_forge | DeMagi only | 0 | none | NO MODULE | 2-hotspot module + base nano-banana still |
| blood_archive | DeMagi only | 0 | none | NO MODULE | 2-hotspot module + base still |
| probability_chamber | Quarchon only | 0 | none | NO MODULE | 2-hotspot module + base still |
| dimensional_observatory | Quarchon only | 0 | none | NO MODULE | 2-hotspot module + base still |
| hybrid_sanctum | Ne-Yon only | 0 | none | NO MODULE | 2-hotspot module + base still |
| the_between | Ne-Yon only | 0 | none | NO MODULE | 2-hotspot module + base still |

**Total rooms in scope: 32** (26 universal + 6 species-exclusive).

**Multi-stage art coverage today:** 4 of 32 rooms (12.5%). After Phase D: 11 of 32 (34%) for the rooms that carry narrative weight.

**Accessibility model — confirmed by `apps/shared/preludeRoomGate.ts` + `awakeningProtocol.ts` + `characterCreationImpact.ts`:**
- The 10 Prelude rooms unlock linearly for **every** player regardless of species/class/archetype/faction/alignment.
- Post-Prelude, the remaining 16 universal rooms unlock together at Act 1+ for every player.
- Species-exclusive rooms are **bonus content**, not critical-path — ⅔ of players will never enter them. They must NOT contain progression-gating items, ST uncorruption pairs, or critical Loredex entries.
- No archetype, class, faction, or narrative-outcome currently locks any room. Branching outcomes (donated vs refused DNA, ST trust tier) affect dialog and rewards, not access.

**Dead-end risks** (rooms with only one connection): observation-deck, engineering-core, captains-quarters, antiquarian-library, oracle-sanctum, shadow-vault, cipher-den, order-tribunal, chaos-forge, elemental-nexus, quantum-lab, synthesis-chamber, dreams-workshop-subbasement. None of these is a hard bug — single-exit rooms are valid for caches/secrets — but verify each is intentional during the click-through pass.

---

## 2. Shadow Tongue Point-and-Click Spec

### 2.1 Files to create

- `apps/shared/roomMysteries/shadowTongueHotspots.ts` — cross-room ST hotspot pack
- `apps/shared/roomMysteries/shadowVault.ts` — dedicated encounter scene
- `apps/shared/roomMysteries/cipherDen.ts` — ST decryption hub
- `apps/shared/shadowTongueEdits.ts` — `ActiveEdit` typed catalog
- `apps/shared/shadowTongueUncorruption.ts` — combine-loop rules

### 2.2 Files to edit

- `apps/shared/roomMysteries/archives.ts` — extend 2 → 5 hotspots
- `apps/shared/roomMysteries/bridge.ts` — tier-aware ST annotations on tactical-display + timeline-projector
- `apps/shared/roomMysteries/commsArray.ts` — `voice-in-the-static` hotspot + tier-3 talk on static-screen
- `apps/shared/roomMysteries/engineering.ts` — `schematic-pad` hotspot
- `apps/shared/roomMysteries/index.ts` — register new modules
- `apps/client/src/contexts/GameContext.tsx` — hotspot rectangles + ROOM_DEFINITIONS entries for shadow-vault, cipher-den, new connections
- `apps/server/routers/epochWitness.ts` — `recordActiveEdit`, `clearActiveEdit` procedures; extend `getShadowTonguePower` to return `activeEdits[]`
- `apps/client/src/game/shadowTongueRelationship.ts` — export `selectShadowTongueNarration(band, response)`
- `apps/client/src/components/CorruptibleBio.tsx` — accept `activeEdits` prop; render crossouts on hotspot descriptions
- `apps/shared/shadow_tongueVoManifest.json` — ~20 new VO ids
- `apps/shared/roomTier.ts` — add `archives` and `comms-array` thresholds

### 2.3 Hotspot definitions to add

Format: `room | id | verbs | flag set | revelation | inventory`.

**Archives (3 new + tier escalation on 2 existing):**
- `corrupted-scroll-rack | look,use | shadow_tongue_corruption_seen | scrolls-rewritten | grants corrupted-fragment`
- `rewritten-ledger | look,use,talk | shadow_tongue_ledger_read | ledger-rewrite-pattern | grants original-ledger-fragment after combine`
- `indigo-glow-lectern | look,use | shadow_tongue_lectern_lit | editor-uses-elara-creds | sets activeEdits.archives_lectern`
- `unnameable-hue-cabinet | look | shadow_tongue_hue_named | hue-borrowed-from-witness | none`
- combine: `corrupted-fragment + original-ledger-fragment → restored-ledger` clears one activeEdits entry

**Bridge (2 tier escalations, no new rectangles):**
- `tactical-display | look (tier-3+) | bridge_st_annotations_visible | edits-on-conspiracy-board`
- `timeline-projector | look (tier-2+) | bridge_st_timeline_overlay | age-of-privacy-edited`

**Comms Array (1 new + tier-3 escalation):**
- `voice-in-the-static | look,talk | shadow_tongue_voice_heard | he-speaks-in-static | grants static-fragment-recording`
- `static-screen | tier-3 talk | shadow_tongue_dialog_initiated | direct-address-low-trust`

**Engineering (1 new):**
- `schematic-pad | look,use | shadow_tongue_engineering_edits_seen | reactor-blueprint-edited | grants original-schematic-rubbing`
- combine: `original-schematic-rubbing + corrupted-fragment → restored-schematic` clears activeEdits.engineering_reactor

**Shadow Vault (new module, 4 hotspots):**
- `sealed-cell-glass | look,talk | shadow_tongue_face_to_face | meeting-the-editor`
- `manuscript-pile | look,use | shadow_tongue_manuscript_found | the-novel-is-here | grants manuscript-folio`
- `warden-terminal | use | shadow_tongue_warden_query | (reads activeEdits count)`
- `release-or-seal-lever | use | shadow_tongue_outcome_chosen | player-choice-st-fate | sets grandEditActive`

**Cipher Den (new module, 4 hotspots):**
- `rosetta-pad | look,use | cipher_den_introduced | (none) | grants rosetta-key-1`
- `encrypted-correspondence | look,use | cipher_letter_decoded | warlord-vox-correspondence | grants vox-letter-decoded`
- `dictionary-of-edits | look,talk | shadow_tongue_dictionary_read | edit-vocabulary-known`
- `uncorruption-bench | use (combine) | (none) | (none) | composes restored fragments → tRPC clearActiveEdit`

### 2.4 `activeEdits` data model

```ts
interface ActiveEdit {
  id: string;          // "archives_lectern"
  room: string;        // "archives"
  artifact: string;    // "lectern"
  type: "scrub" | "rewrite" | "elevate";
  createdAt: number;
  uncorruptedAt: number | null;
}
```

Server (`apps/server/routers/epochWitness.ts`):
- `recordActiveEdit({ id, room, artifact, type })` — appends to JSON
- `clearActiveEdit({ id })` — flips uncorruptedAt; awards trust delta +5
- `getShadowTonguePower` response gains `activeEdits: ActiveEdit[]`

Client: new hook `useShadowTongueEdits()` reads from tRPC; `CorruptibleBio` consumes the array.

### 2.45 Accessibility guards (load-bearing)

Every Shadow Tongue hotspot, revelation, and uncorruption pair from §2.3 lands in a **universal** room (archives, bridge, comms-array, engineering, shadow-vault, cipher-den) — never in a species-exclusive room. This is deliberate: ST is a critical narrative thread, and ⅔ of players cannot be locked out of his arc.

The mini-loop's "find both halves in different rooms" pairs (§2.5) must obey the same rule: both halves must live in universal rooms. The three v1 pairs already comply (archives × archives, archives × engineering, bridge × comms-array). Author future pairs against the same constraint.

If a future writer wants species-exclusive ST flavour, surface it as a **Loredex entry** unlocked from a universal hotspot's tier-3 `look` response when `canAccessRoom(speciesRoom, sig) === true` — not as a hotspot inside the species room. That keeps narrative parity for all players.

### 2.5 Uncorruption mini-loop (lean — no new mini-game UI)

5 beats:
1. Player sees a corrupted artifact → `CorruptibleBio` red crossouts because `activeEdits.<id>` exists
2. `look` on corrupted hotspot → grants `corrupted-fragment`
3. `look` on the original-source hotspot in another room → grants `original-fragment`
4. `use` combine in cipher-den's `uncorruption-bench` → calls `clearActiveEdit`
5. Crossouts disappear; trust +5; revelation fires

Three v1 pairs:
- `archives.lectern` ⟷ archives.corrupted-fragment + archives.original-ledger-fragment
- `engineering.reactor` ⟷ engineering.original-schematic-rubbing + archives.corrupted-fragment
- `bridge.starmap` ⟷ bridge.tactical-display rubbing + comms-array corrupted fragment

The constraint "find both halves in different rooms" forces traversal and rewards revisiting earlier rooms — which is the whole point.

---

## 3. Progression-Spine Fixes — 17 Minimum Modules

Each new file lives at `apps/shared/roomMysteries/<roomCamel>.ts` and is registered in `roomMysteries/index.ts`. Each hotspot has at minimum a `look` response; at least one hotspot per room must `setsFlag`, `grantsItem`, or `unlocksExit`.

| room | new file | hotspot ids (max 3) | first-look flag |
|---|---|---|---|
| forge-workshop | `forgeWorkshop.ts` | anvil, schema-rack, kiln | `forge_introduced` |
| antiquarian-library | `antiquarianLibrary.ts` | card-catalog, locked-vault, antiquarian-bust | `antiquarian_seen` |
| engineering-core | `engineeringCore.ts` | reactor-coil, coolant-pipe, core-terminal | `eng_core_introduced` |
| oracle-sanctum | `oracleSanctum.ts` | oracle-pool, prophecy-tablet, incense-brazier | `oracle_consulted` |
| shadow-vault | `shadowVault.ts` | (see §2.3) | `shadow_tongue_face_to_face` |
| war-room | `warRoom.ts` | holo-table, casualty-board, signal-flag-rack | `war_room_introduced` |
| cipher-den | `cipherDen.ts` | (see §2.3) | `cipher_den_introduced` |
| order-tribunal | `orderTribunal.ts` | judges-bench, evidence-locker | `tribunal_seen` |
| chaos-forge | `chaosForge.ts` | chaos-anvil, entropy-vat | `chaos_forge_seen` |
| elemental-nexus | `elementalNexus.ts` | elemental-orrery, node-pillar | `nexus_seen` |
| quantum-lab | `quantumLab.ts` | entanglement-rig, observation-cage | `quantum_lab_seen` |
| synthesis-chamber | `synthesisChamber.ts` | synth-vat, recipe-board | `synthesis_seen` |
| station-dock | `stationDock.ts` | airlock-control, ship-manifest, cargo-lift | `dock_introduced` |
| guild-sanctum | `guildSanctum.ts` | sigil-altar, allegiance-pad | `guild_sanctum_seen` |
| social-hub | `socialHub.ts` | bulletin-board, mess-table | `social_hub_seen` |
| dreams-workshop-subbasement | `dreamsWorkshop.ts` | dream-loom, fragment-rack, mirror-pool | `dreams_workshop_seen` |
| observation-deck | `observationDeck.ts` | panoramic-viewport, purification-crystal-cradle, bond-resonance-altar | `observation_first_clue_found` |

**Exit additions (dead-end fixes):**
- `medical-bay` → add `engineering` exit (gated `medbay_first_clue_found`)
- `archives` → add `cipher-den` exit (Phase 5+ free roam)
- `cargo-hold` → add `station-dock` exit (act-2 launchpad)
- `observation-deck` → confirm bidirectional `comms-array` and `armory` exits

Every first-look flag becomes proof "this room has been engaged with" — feeds achievements + Loredex room-completion grid.

### 3.1 Species-exclusive minimum modules (6 rooms)

Each species (DeMagi / Quarchon / Ne-Yon) gets 2 exclusive rooms gated by `canAccessRoom(roomId, sig)`. Currently all six have no module → ⅔ of bonus content is silent for every player. Author 2-hotspot modules so each species's bonus rooms feel intentional, not stub.

| room | new file | hotspots | first-look flag | species |
|---|---|---|---|---|
| the_elemental_forge | `theElementalForge.ts` | crucible-of-origins, ancestral-anvil | `demagi_forge_seen` | DeMagi |
| blood_archive | `bloodArchive.ts` | lineage-codex, blood-relic-shrine | `demagi_archive_seen` | DeMagi |
| probability_chamber | `probabilityChamber.ts` | wavefunction-rig, dice-of-states | `quarchon_chamber_seen` | Quarchon |
| dimensional_observatory | `dimensionalObservatory.ts` | rift-lens, dimension-loom | `quarchon_observatory_seen` | Quarchon |
| hybrid_sanctum | `hybridSanctum.ts` | dual-altar, severed-mirror | `neyon_sanctum_seen` | Ne-Yon |
| the_between | `theBetween.ts` | threshold-stone, between-pool | `neyon_between_seen` | Ne-Yon |

**Constraints (load-bearing — must hold):**
- Every species-exclusive flag must be cosmetic / Loredex-only. NEVER use a `<species>_*_seen` flag as a prerequisite for any other room, item, or quest. The flag may grant an exclusive Loredex entry or a cosmetic but cannot block progress.
- Each module's hotspots may grant inventory items, BUT those items must NEVER be required to clear an `activeEdits` uncorruption pair, complete a Prelude or Outbreak gate, or unlock any universal room. Use a `speciesExclusive: true` field on `Inventory` items if it doesn't already exist; combine recipes filter it out.
- VO ids for species rooms must be sourced from species-specific manifests (or reuse the player's selected NPC voice), so ⅓ of the recorded lines aren't dead weight on disk for ⅔ of players.

---

## 4. Media Manifest — `apps/shared/roomMediaPrompts.ts`

Mirrors the typed structure of existing `roomStateArtPrompts.ts` and `roomTierArtPrompts.ts`. Single source of truth for nano-banana stills + Veo 3.1 videos. CSV export pipeline picks up `kind` and `model` columns; output paths feed S3 upload.

```ts
export type MediaModel = "nano-banana-2" | "veo-3.1";
export type MediaKind = "image" | "video";
export type Priority = "P0" | "P1" | "P2";

export interface RoomMediaPrompt {
  assetId: string;          // "<roomId>:<state>" or "<roomId>:<state>:video"
  roomId: string;
  stateId: string;
  kind: MediaKind;
  model: MediaModel;
  label: string;
  condition: string;        // plain-English flag predicate
  prompt: string;           // body; anchor prepended at csv-export time
  outputPath: string;
  resolution: string;       // "1920x1080" or "1920x1080@24fps,8s loop"
  priority: Priority;
  dependencies: readonly string[];
}
```

**Anchors** (prepended at CSV-export, NOT in each entry's body):

`ROOM_MEDIA_STYLE_ANCHOR_IMAGE` — re-export of `ROOM_STATE_STYLE_ANCHOR` from `roomStateArtPrompts.ts` (cold institutional steel + brass + phosphor-lavender ley-lines, 16:9 1920×1080, 28mm, no figures, no text, no UI).

`ROOM_MEDIA_STYLE_ANCHOR_VIDEO` — new. Body:

> Cinematographic constraints: 16:9 1920×1080 at 24fps. Locked camera unless explicitly cinematic. Match the still palette exactly: cold institutional steel, patinated brass, deep oxblood accents, warm-gold service lamps, phosphor-lavender and phosphor-green sorcerous-circuit glows. Soft rim-light from ceiling strips, single warm-gold key, visible dust-in-beam, faint film-grain sepia. No rendered text, no UI overlays, no watermarks, no captions, no figures unless explicitly named. Audio NOT generated (the engine drives audio separately). Loops must hide their cut point — match first and last frame.

`SHADOW_TONGUE_CORRUPTION_LAYER` — composable layer for ST-affected assets:

> Corruption layer (apply over base): a single artifact in frame is overwritten in an indigo hue that drifts toward a colour the eye cannot quite name (not blue, not violet, not magenta — a hue that reads as "wrong"). RGB channel-shift on the artifact only, ~1px horizontal red/blue separation. Glyphs on the artifact appear in two layers — a warm-gold underlayer (the original) and a slightly out-of-register indigo overlayer (the edit). No hard glitch artifacts; the corruption is quiet, literary, deniable. The rest of the room is unaffected.

### 4.1 Nano-Banana 2 (Gemini 2.5 Flash Image) — Still Prompts

Each entry: `[ROOM_MEDIA_STYLE_ANCHOR_IMAGE] + body below`. Resolution `1920×1080` unless noted.

#### Archives (Shadow Tongue primary room)

**`archives:corrupted` (P0)** — `apps/client/public/art/rooms/mystery-states/archives_corrupted.webp`
Condition: `shadow_tongue_corruption_seen` flag set.
> The Archives' main reading hall, wide architectural shot from the entry-arch vantage. Centre-back: the curved data-orb pedestal, dimmed to the unnameable indigo hue that drifts away from violet. Left and right walls: tall brass-framed scroll racks with frosted-glass fronts, behind which scrolls show two-layer text — a warm-gold underlayer in Elara's hand and a slightly out-of-register indigo overlayer that has rewritten select words. Foreground centre: the lectern stage, its stone base ringed in a faint indigo halo. Stage-right: a freestanding glass cabinet with a hand-stitched label reading [unnameable hue, no rendered text]. Atmosphere: the room is intact, beautiful, undisturbed — but reading it is no longer neutral. Apply SHADOW_TONGUE_CORRUPTION_LAYER on the data-orb, the scroll-rack glass, and the lectern halo only.

**`archives:uncorrupted` (P1)** — `archives_uncorrupted.webp`
Condition: at least one `clearActiveEdit` resolved.
> Same composition as `archives:corrupted` but the indigo hue has retreated. The data-orb glows warm-gold, the scroll-rack underlayer reads cleanly, the lectern halo is gone. A single rolled scroll on the lectern shows freshly-written warm-gold ink atop the dried indigo overlayer — visible victory. Atmosphere: relief, but the cabinet stage-right still hums faintly. The Editor is not gone, only stepped back.

**`archives:tier-fluent` (P1)** — `archives_tier_fluent.webp`
Condition: shadow tongue trust ≥ 80.
> Same composition. The unnameable hue is now legible to the camera — every surface that previously read as warm-gold now shows the indigo underlayer beneath, faintly. The data-orb pulses both colours simultaneously in counter-rhythm. The cabinet stage-right is open; its door swings on a slow hinge. Atmosphere: the Editor is not visible, but the room is no longer ambiguous about who has been writing. The viewer is reading both languages at once now.

#### Comms Array

**`comms-array:static-haunted` (P0)** — `commsarray_static_haunted.webp`
Condition: `shadow_tongue_voice_heard`.
> Comms Array operations bay, wide shot. Bank of CRT-style monitors filling the back wall — most show clean signal-traces in phosphor-green, but the central monitor (frame-anchor) shows pure static dimmed to the unnameable indigo hue. Within the static, a single column of vertical glyphs is faintly resolving — recognisable as Elara's hand but mid-rewrite. Foreground: a curved console with brass dials and oxblood-leather wrist-rests. The headset on the console hook is faintly humming a phosphor-lavender glow. Atmosphere: the room sounds full of one voice trying to be heard inside another. Apply SHADOW_TONGUE_CORRUPTION_LAYER on the central monitor only.

**`comms-array:signal-clear` (P1)** — `commsarray_signal_clear.webp`
Condition: `bridge_systems_restored`.
> Same composition. All monitors now show clean signal-traces in warm-gold or phosphor-green; the central monitor displays a rolling waveform that resolves into a stable peak. The headset hum has gone steady gold. The room is operational, calm, productive. Atmosphere: this is what comms is supposed to feel like.

#### Engineering

**`engineering:edited-schematics` (P0)** — `engineering_edited_schematics.webp`
Condition: `shadow_tongue_engineering_edits_seen`.
> Engineering bay wide shot, framed on the workbench. The reactor occupies the back-right at half height, running but spitting a faint indigo plume from one valve. Centre frame: the workbench with a large unrolled blueprint pinned at four corners; the blueprint's lines are split into two registers — the warm-gold original and the indigo overlayer that has subtly redrawn three connection points. Tools scattered (brass calipers, an oil-blued wrench, a notebook open to a half-finished page). Apply SHADOW_TONGUE_CORRUPTION_LAYER on the blueprint and the reactor valve only.

**`engineering:restored` (P1)** — `engineering_restored.webp`
Condition: uncorruption-completed for `engineering.reactor`.
> Same composition. The blueprint shows a single register only — the warm-gold original, with a fresh hand-rubbing in graphite at one corner (proof of player labour). The reactor's indigo plume is gone; the valve glows steady warm-gold. The notebook on the bench has a new page filled with crisp diagnostic notes [no rendered text]. Atmosphere: someone fixed something that was being silently broken.

#### Bridge

**`bridge:annotations-visible` (P0)** — `bridge_annotations_visible.webp`
Condition: `shadow_tongue_evidence` AND tier ≥ 2.
> Bridge command deck, wide architectural shot, viewed from the captain's-chair vantage looking forward. The tactical-display dome at centre-back glows phosphor-lavender; superimposed on it, faint indigo annotations float at three nodes — readable as marginalia in someone else's hand. The timeline-projector stage-left shows entries in two layers, one warm-gold and one indigo. Crew avatars are absent (Tier 2 — activated, not yet restored). Atmosphere: the room is busy thinking; some of the thoughts are not the Captain's.

#### Observation Deck

**`observation-deck:initial` (P0)** — `observation_deck_initial.webp`
Condition: base.
> Observation Deck wide shot. Curved floor-to-ceiling viewport across the entire back wall, looking out onto a starfield with the faint sweep of a distant nebula. Foreground centre: a brass telescope on a free-standing pedestal. Floor: hexagonal tile pattern in oil-blued steel with phosphor-lavender grout-lines. Stage-right: a low cradle-pedestal with empty mounting clips (the purification crystal hasn't been placed yet). Atmosphere: contemplative, cold, awaiting. No figures.

**`observation-deck:bond-resonance` (P0)** — `observation_deck_bond_resonance.webp`
Condition: `first_bond_resonance` flag.
> Same composition. The cradle-pedestal stage-right now holds a single faceted crystal pulsing a slow warm-gold rhythm, casting concentric ripples across the hex floor. The starfield through the viewport has a faint warm-gold afterimage at one star. Atmosphere: a quiet first triumph, two beings in tune.

**`observation-deck:purification-active` (P1)** — `observation_deck_purification_active.webp`
Condition: crystal-activated.
> Same composition. The crystal's pulse has accelerated and brightened; warm-gold light fills the room, casting hard shadows. The hex floor's phosphor-lavender grout has shifted to phosphor-gold. The viewport starfield is fully blanketed in soft golden afterimage. Atmosphere: cleansing power, tangible and active.

#### War Room

**`war-room:initial` (P0)** — `war_room_initial.webp`
Condition: base.
> War Room wide shot. Centre: a circular brass-edged holo-table, currently dormant (matte glass top). Walls: floor-to-ceiling racks of paper casualty-boards in oxblood-leather binders. Stage-left: a brass rack of folded signal-flags. Stage-right: a side-table with a half-empty cut-glass decanter and one used tumbler. Lighting: warm-gold key from above the holo-table, deep shadow at the room edges. Atmosphere: command silence between briefings. No figures.

**`war-room:active-conflict` (P1)** — `war_room_active_conflict.webp`
Condition: act-2 active.
> Same composition. The holo-table is alive — a phosphor-lavender three-dimensional theatre map projects above it, with red and gold faction markers in motion. Two casualty-boards on the back wall have been pulled and pinned open. The decanter is empty. Atmosphere: the room is mid-decision; whoever was here has stepped out for thirty seconds.

#### Station Dock

**`station-dock:initial` (P0)** — `station_dock_initial.webp`
Condition: base.
> Station Dock wide shot. Massive cylindrical airlock at frame-centre, brass-rimmed with deep-oxblood seal gaskets, currently sealed. Service alcoves to either side: stage-left a manifest console, stage-right a cargo-lift platform at floor level. Floor: heavy plate steel with hazard-stripe oxblood paint at the airlock perimeter. Atmosphere: industrial, expectant, the room before a journey. No figures.

**`station-dock:ship-docked` (P0)** — `station_dock_ship_docked.webp`
Condition: post-act-1 / first ship docked.
> Same composition. The airlock is cycling open; warm-gold light spills from the inner ship through the half-opened seal, projecting a long shadow forward across the deck plates. The manifest console glows alive with rolling readouts. The cargo-lift has a single sealed crate on it, oxblood seals intact. Atmosphere: arrival, threshold, story-resumes.

#### Engineering Core

**`engineering-core:initial` (P0)** — `engineering_core_initial.webp`
Condition: base.
> Engineering Core wide shot. Centre-frame: the reactor coil — a vertical brass-and-steel cylindrical column ribbed with phosphor-green coolant pipes. Floor: a circular grating with the column rising through it. Stage-right: the core-terminal, a stand-up brass console with three large oxblood-leather-wrapped levers. Atmosphere: heat distortion in the air above the coil, a deep slow pulse of phosphor-green at the column's base, low warm-gold service lighting. No figures.

#### Oracle Sanctum

**`oracle-sanctum:initial` (P0)** — `oracle_sanctum_initial.webp`
Condition: base.
> Oracle Sanctum wide shot. Centre-frame: a circular still-water oracle pool sunk into the floor, surrounded by a low brass rim engraved with sigils. Back wall: a brass-pedestal'd prophecy-tablet at standing height. Stage-right: a hanging incense-brazier on a chain, smoke drifting in slow phosphor-lavender. Lighting: low warm-gold from sconces, the pool itself faintly luminous from below. Atmosphere: hush, ritual readiness, very few hard edges. No figures.

**`oracle-sanctum:prophecy-active` (P1)** — `oracle_sanctum_prophecy_active.webp`
Condition: `oracle_consulted`.
> Same composition. The oracle pool's surface is broken into slow concentric rings, glowing warm-gold from below. Above the pool, a faint phosphor-lavender glyph hovers half-formed in the air. The prophecy-tablet on the back wall has begun to display warm-gold script [no rendered text — abstract glyphs only]. The incense smoke now coils more deliberately. Atmosphere: something is speaking; the room is listening.

#### Shadow Vault (the encounter scene)

**`shadow-vault:cell-sealed` (P0)** — `shadow_vault_cell_sealed.webp`
Condition: base.
> Shadow Vault wide shot. Centre-frame: a sealed-cell glass containment, a tall reinforced-glass cylinder full of the unnameable indigo hue (so dense the eye cannot resolve depth). Floor surrounding the cell: oil-blued steel inscribed with brass-inlaid containment sigils. Stage-left: a manuscript-pile on a low pedestal — leather folios stacked carelessly. Stage-right: the warden-terminal, a brass console with a single phosphor-lavender readout. Foreground centre: a long brass lever in a neutral position. Lighting: extremely cold, all rim-light, no key — the cell itself provides the only colour in the room. No figures. Apply SHADOW_TONGUE_CORRUPTION_LAYER concentrated entirely inside the cell glass — the surrounding room is uncorrupted but cold.

**`shadow-vault:cell-released` (P0)** — `shadow_vault_cell_released.webp`
Condition: `grandEditActive = true`.
> Same composition. The cell-glass has cracked at the base; the unnameable indigo has begun to seep along the floor sigils, lighting them in an out-of-register glow. The manuscript-pile is unbound — folios float in mid-air around the room. The warden-terminal is dark. The lever is fully thrown. Atmosphere: the room has just made a decision and the decision was the wrong one. Apply SHADOW_TONGUE_CORRUPTION_LAYER across the entire room.

**`shadow-vault:cell-resealed` (P0)** — `shadow_vault_cell_resealed.webp`
Condition: `grandEditActive = false` after a previous true state (i.e. the player walked it back).
> Same composition. The cell-glass is restored but visibly scarred — a hairline brass weld traces around its base. The indigo within is dimmer, retreated. The manuscript-pile is bound and stacked. The warden-terminal glows steady warm-gold. The lever is in the neutral position with a small brass lock-plate fitted. Atmosphere: the room remembers what almost happened.

#### Cipher Den

**`cipher-den:initial` (P0)** — `cipher_den_initial.webp`
Condition: base.
> Cipher Den wide shot. Centre-frame: a long oak-and-brass desk angled to camera, holding the rosetta-pad (a thick brass-bound codex on a reading-stand) and a stack of encrypted-correspondence folios. Back wall: an entire wall of cubbyholes filled with rolled letters tagged in oxblood ribbons. Stage-left: the dictionary-of-edits — a freestanding lectern with a perpetually-open book whose pages turn themselves slowly. Stage-right: the uncorruption-bench — a worktop with a brass-rimmed magnifier on a swing-arm and small bottles of ink. Lighting: warm-gold from a single hooded desk-lamp, the rest of the room in shadow. Atmosphere: scholarly, suspicious, lived-in.

#### Species-exclusive bonus rooms (P2 — render after universal rooms)

Each entry uses the same `ROOM_MEDIA_STYLE_ANCHOR_IMAGE`. Bodies kept tight; the species lensing is in the focal artifacts, not in colour-palette divergence (avoid making them feel like a different game).

**`the_elemental_forge:initial` (P2)** — `the_elemental_forge_initial.webp` (DeMagi)
> A circular forge chamber carved into volcanic basalt. Centre-frame: a brass-bound crucible-of-origins suspended over a slow-pulsing magma vent, ringed by eight inscribed brass tiles (one per element). Stage-left: an ancestral anvil, three meters tall, its face polished mirror-bright by centuries of strikes. Stage-right: a rack of unfinished elemental weapons, half-shaped. Lighting: warm magma-gold from below, cold steel rim-light from above. Atmosphere: ancestral memory at working temperature. No figures.

**`blood_archive:initial` (P2)** — `blood_archive_initial.webp` (DeMagi)
> A vault chamber lined floor-to-ceiling with brass-bound lineage codices, each chained to its shelf. Centre-frame: a freestanding shrine — a low oxblood-leather altar holding a single covered relic under glass. Floor: red-veined marble inlaid with brass family-tree branches. Lighting: cold rim-light, single warm-gold key on the relic only. Atmosphere: hush of ancestral debt. No figures.

**`probability_chamber:initial` (P2)** — `probability_chamber_initial.webp` (Quarchon)
> A spherical observation chamber with curved phosphor-lavender walls. Centre-frame: a wavefunction-rig — a brass armature suspending a translucent quartz orb that pulses through superposed images of itself. Stage-right: a low brass tray holding twelve hand-carved dice-of-states, each inscribed with an unknown sigil. Floor: oil-blued steel etched with an interference pattern. Lighting: phosphor-lavender ambient, no key. Atmosphere: every state is true and waiting to collapse. No figures.

**`dimensional_observatory:initial` (P2)** — `dimensional_observatory_initial.webp` (Quarchon)
> An octagonal observatory with a vaulted ceiling. Centre-frame: a rift-lens — a brass-and-glass aperture pointing upward, currently showing a fractal slice of an unfamiliar starfield. Back wall: a dimension-loom, a vertical brass frame strung with phosphor-lavender threads weaving themselves into a slow-shifting tapestry [no rendered text, abstract glyph patterns]. Lighting: cold phosphor-lavender from the aperture, deep oxblood accents on the floor. Atmosphere: a window onto somewhere the camera was not invited. No figures.

**`hybrid_sanctum:initial` (P2)** — `hybrid_sanctum_initial.webp` (Ne-Yon)
> A long narrow chapel-room with an axial mirror down the centre dividing it into two halves. Centre-frame: a dual-altar — one half forged in DeMagi brass-and-magma motifs, the other in Quarchon phosphor-lavender-and-glass. The dividing mirror is severed at chest height, hairline crack widening to a notch where the two altar halves meet. Lighting: warm-gold on the brass half, phosphor-lavender on the glass half, neutral cold rim where they meet. Atmosphere: reconciled tension, neither side dominant. No figures.

**`the_between:initial` (P2)** — `the_between_initial.webp` (Ne-Yon)
> A liminal chamber with no clear walls — the floor dissolves into mist about three meters out from the centre. Centre-frame: a single brass threshold-stone, knee-high, set in a circular pool of still water that reflects a ceiling that isn't there. Lighting: ambient warm-gold from no visible source, phosphor-green mist below the floor-line. Atmosphere: a doorway that goes nowhere and everywhere; this is the room between rooms. No figures.

### 4.2 Veo 3.1 — Video Prompts

Each entry: `[ROOM_MEDIA_STYLE_ANCHOR_VIDEO] + body below`. Resolution `1920×1080@24fps` unless noted. All prompts are no-audio (engine drives audio).

**`shadow-tongue:text-corruption-loop` (P0)** — 8s seamless loop — `art/rooms/videos/shadow_tongue_text_corruption_loop.webm`
Used as ambient overlay anywhere `activeEdits` count > 0.
> 8-second seamless loop. Locked camera. Tight framing on a single Archives data-bank panel that fills 60% of frame, the surrounding room blurred to phosphor-lavender bokeh. Frame 0: the panel's glyphs resolve cleanly in warm-gold (Elara's hand). From frame 24 to frame 96, individual characters glitch one at a time toward the unnameable indigo hue and silently rewrite themselves into a slightly different glyph — never enough to be obviously different, always enough to read as wrong. From frame 96 to frame 192, the rewrite reverses, returning each character to its warm-gold original. Subtle ~1px RGB channel-shift on each rewrite event, no full glitch artifacts. Loop point invisible: frame 192 must equal frame 0. No rendered text legible to the player, no UI, no figures.

**`archives:glyph-rewriting-loop` (P0)** — 10s seamless loop — `art/rooms/videos/archives_glyph_rewriting_loop.webm`
Used as ambient atmosphere when player is in archives with `shadow_tongue_corruption_seen`.
> 10-second seamless loop. Locked camera, slight 2% slow-zoom-in across the loop then snap-cut back to start (cut hidden by a one-frame indigo flash). Wide-shot framing of the Archives reading hall from the entry-arch vantage. Across the loop, glyph-bands on the curved back-wall data-banks slowly migrate left-to-right by ~6 pixels and rewrite themselves character-by-character; the warm-gold underlayer remains constant; the indigo overlayer drifts. Scrolls in the rack glass on left and right walls show the same effect at quarter-speed. The data-orb at room-centre pulses once per second, alternating warm-gold and unnameable-indigo. No figures, no audio, no rendered legible text.

**`bridge:fast-travel-unlocked` (P0)** — 6s one-shot cinematic — `art/rooms/videos/bridge_fast_travel_unlocked.mp4`
Triggers when `fast_travel_unlocked` flag transitions false→true.
> 6-second one-shot cinematic. Camera starts on a slight handheld float above the captain's chair vantage, then dollies forward toward the tactical-display dome over 4 seconds. Frame 0–48: the dome is dark, sigils on its rim faintly etched. Frame 48–96: warm-gold phosphor begins to fill the rim sigils one at a time in a clockwise sweep, accompanied by a single bright-key lighting flash on frame 72 (visible as a soft dust-in-beam burst). Frame 96–144: the dome interior blooms into a holographic ley-line web — a 3D map of the Ark with phosphor-lavender lines connecting room-nodes, each node lighting in warm-gold one after another. End frame holds for 12 frames on the fully-lit web. No figures, no audio, no rendered text — just the geometry of the map itself.

**`comms-array:signal-discovery` (P0)** — 5s one-shot cinematic — `art/rooms/videos/comms_array_signal_discovery.mp4`
Triggers when `shadow_tongue_voice_heard` flag transitions false→true.
> 5-second one-shot. Locked camera framed centred on the comms-array's central CRT monitor at 70% of frame. Frame 0–60: pure phosphor-green static. Frame 60–96: the static dims to the unnameable indigo hue and begins to organise — vertical bands resolve into the silhouette of a face composed entirely of glyphs (recognisable as a face only by negative space), holding for exactly 12 frames at frame 96. Frame 108–120: the face dissolves back into static, but the static now has a faint warm-gold underlayer barely visible through the indigo. End frame holds. RGB channel-shift peaks at frame 96 (~3px) then settles to 1px. No audio, no rendered text, no other figures.

**`cryo-bay:awakening` (P1)** — 12s one-shot cinematic — `art/rooms/videos/cryo_bay_awakening.mp4`
Triggers on game-start, replaces existing AWK-001 if present.
> 12-second one-shot cinematic. Camera begins inside a closed cryo-pod looking outward through frosted glass — the room beyond is barely visible, all colour washed pale. Frame 0–48: the frost on the glass begins to retreat from the centre outward, revealing more of the cryo-bay environment in cold blue-green tones. Frame 48–96: a phosphor-lavender stasis-readout HUD on the pod's interior glass briefly illuminates [no rendered text — abstract bars only], then dims. Frame 96–192: the pod's seal cracks audibly (audio engine-driven, do not generate); a slow vertical pull pushes the glass aside; warm-gold service-lamp light spills in from the room beyond, slowly washing the cold colour away. Frame 192–288: camera holds on the open pod-frame; the room beyond is now visible in full warm-gold/oxblood/phosphor-lavender palette; a single character row of cryo-pods recedes into shallow depth-of-field. End frame holds 12 frames. No figures.

**`shadow-vault:meeting` (P0)** — 8s one-shot cinematic — `art/rooms/videos/shadow_vault_meeting.mp4`
Triggers when player enters shadow-vault for the first time AND `shadow_tongue_face_to_face` flag is being set.
> 8-second one-shot cinematic. Camera begins at the room's threshold; over 5 seconds, dollies slowly forward toward the sealed-cell glass cylinder, ending at half a meter from the glass. Frame 0–48: the cell appears as featureless dense indigo. Frame 48–96: as the camera nears, faint glyph-shapes begin to coalesce inside the indigo — like text seen through deep water. Frame 96–144: a single silhouette resolves — humanoid in proportion only, edges defined by the absence of indigo rather than presence of form. Frame 144–168: the silhouette tilts its head slightly, registering the camera; one indigo-on-indigo glyph in the cell visibly rewrites itself in a single frame, sending a ripple through the entire cell. End frame holds 24 frames. The room around the cell remains uncorrupted, very cold, very still. No audio, no figures outside the cell.

**`observation-deck:bond-resonance-pulse` (P1)** — 10s seamless loop — `art/rooms/videos/observation_deck_bond_resonance_pulse.webm`
Used as ambient atmosphere after `first_bond_resonance` flag.
> 10-second seamless loop. Locked camera framed on the observation-deck purification-crystal in its cradle-pedestal at 40% of frame, with the panoramic starfield viewport visible behind. Frame 0: the crystal pulses with a slow warm-gold heartbeat. Across the loop, every 2 seconds the crystal emits a soft warm-gold ripple that propagates outward across the hex floor, fading by frame 96; on the second pulse the starfield in the viewport ripples once in a faint warm-gold afterimage; on the third pulse a single distant star momentarily brightens. Frame 240 returns to identical state of frame 0. No figures, no audio, no rendered text.

**`engineering:schematic-edit-reveal` (P0)** — 6s one-shot cinematic — `art/rooms/videos/engineering_schematic_edit_reveal.mp4`
Triggers on first `look` of `schematic-pad` hotspot.
> 6-second one-shot cinematic. Camera framed top-down on the engineering workbench, looking straight down at the unrolled blueprint. Frame 0–48: the blueprint shows clean warm-gold lines defining a reactor-coolant schematic. Frame 48–96: a shadow-shaped indigo brush passes across three connection points on the diagram (the brush is implied by motion, no figure visible — only the blueprint's lines being touched); each touched line erases and rewrites itself in indigo overlay, slightly redirecting the connection. Frame 96–144: camera pulls back to reveal the wider workbench — the rest of the room is unchanged, the blueprint now shows two registers (warm-gold underlayer + indigo overlayer). End frame holds 24 frames. RGB channel-shift on the blueprint only, ~1px. No figures, no audio, no rendered legible text.

### 4.3 Output paths

- Stills: `apps/client/public/art/rooms/mystery-states/<roomId>_<state>.webp`
- Tier stills: `apps/client/public/art/rooms/ark/<roomId>_t<tier>.webp` (existing convention; not used by 4.1 entries)
- Videos: `apps/client/public/art/rooms/videos/<assetId>.webm` (loops) or `.mp4` (one-shots)
- S3 mirror: `cdn/client-public/art/rooms/...` via existing `pnpm assets:upload` pipeline (`apps/scripts/upload-public-to-s3.ts`)

### 4.4 Pipeline integration

- Extend `roomStateAssets.ts` runtime variant picker to handle a new `videos` field per (room,state) with image-fallback rule (always render the still; the video plays as overlay if present).
- Add `kind` and `model` columns to whichever script under `apps/scripts/` produces the prompt CSV (analogue of `act1ArtPrompts.ts`). The asset team then picks per-row whether to render via Gemini Flash Image or Veo 3.1.
- S3 upload pipeline already handles arbitrary file extensions via the ETag-compare in `upload-public-to-s3.ts`; no infra change needed.

---

## 5. Critical Files

**Top priority (must-edit/create for Phases B-D):**
- `apps/shared/roomMysteries/index.ts` — registry hub
- `apps/shared/roomMysteries/archives.ts` — extend 2 → 5 hotspots
- `apps/shared/roomMediaPrompts.ts` (NEW) — full nano-banana + Veo manifest
- `apps/client/src/contexts/GameContext.tsx` — hotspot rectangles + new connections
- `apps/server/routers/epochWitness.ts` — `recordActiveEdit` / `clearActiveEdit`

**Secondary:**
- `apps/shared/shadowTongueEdits.ts` (NEW), `apps/shared/shadowTongueUncorruption.ts` (NEW)
- `apps/shared/roomMysteries/shadowVault.ts` (NEW), `cipherDen.ts` (NEW), `observationDeck.ts` (NEW)
- `apps/client/src/game/roomStateAssets.ts` — variant picker extension (handle videos)
- `apps/client/src/components/CorruptibleBio.tsx` — `activeEdits`-aware crossout rendering
- `apps/client/src/game/shadowTongueRelationship.ts` — `selectShadowTongueNarration` helper
- `apps/shared/shadow_tongueVoManifest.json` — ~20 new VO ids
- `apps/shared/roomTier.ts` — add archives + comms-array tier thresholds
- `apps/shared/roomMysteries/index.test.ts` — clue-count assertion update

**Existing functions/utilities to reuse (do NOT reinvent):**
- `getRoomTier()` from `apps/shared/roomTier.ts` — tier derivation from flags
- `getShadowTonguePersonality()` / `getShadowTongueTrustTier()` from `apps/client/src/game/shadowTongueRelationship.ts`
- `useNpcVO("shadow_tongue", loader)` via existing `useShadowTongueVO.ts`
- `PointAndClickScene` + `VerbCoin` components — already do hotspot rendering, narration banner, inventory strip
- `ElaraConversationPopup` state machine — for any new dialog branches
- `CorruptibleBio` component — already does red-ink deterministic crossouts; just extend to read tRPC `activeEdits`
- `corruption.frag` shader — already wired to render glitch effect at 0–1 intensity
- `epochWitnessService.adjustShadowTonguePower` — already clamps 0–100
- `assetUrl()` from `apps/client/src/lib/assetUrl.ts` — for all CDN paths
- `ROOM_STATE_STYLE_ANCHOR` from `apps/shared/roomStateArtPrompts.ts` — re-export, do not duplicate
- **`canAccessRoom(roomId, sig)` from `apps/shared/characterCreationImpact.ts` (lines 283-292)** — call this BEFORE rendering hotspots in any species-gated room; the room registry must filter accordingly so the click-through walker doesn't try to enter rooms a species can't access
- `preludeRoomGate.ts` — Prelude unlock chain; consult before adding any new Prelude-phase exit
- `OUTBREAK_ROOM_ORDER` / `POST_OUTBREAK_ROOMS` from `apps/shared/awakeningProtocol.ts` — Outbreak phase gating; do not duplicate

---

## 6. Verification

### 6.1 Unit / integration tests

- `pnpm vitest run apps/shared/roomMysteries/index.test.ts` — total clue count ≥ N (assert exact post-Phase-C number)
- New `apps/shared/roomMediaPrompts.test.ts`: every entry has non-empty body, valid `model` enum, unique `assetId`, unique `outputPath`
- New `apps/shared/shadowTongueEdits.test.ts`: round-trip JSON serialisation; `clearActiveEdit` flips `uncorruptedAt`
- New `apps/shared/roomMysteries/shadowTongueHotspots.test.ts`: every ST hotspot id from §2.3 appears in at least one room module
- Existing must remain green: `cryoBayMystery.test.ts`, `roomMysteries/medicalBay.test.ts`, `bridge.test.ts`, `engineering.test.ts`, `lyraVoxDialog.test.ts`, `livingUniverse.test.ts`, `phase26.test.ts`
- `pnpm check` (full repo `tsc --noEmit`) before any PR

### 6.2 Manual click-through (acceptance script)

Walk `OUTBREAK_ROOM_ORDER` from cryo-bay through observation-deck, then phase-5 free roam, with `?debug-hotspots=1`:
1. Every hotspot has visible rectangle and triggers a response.
2. Every progression hotspot sets exactly one flag (no duplicate `setsFlag`).
3. Every exit door reachable + correctly gated.
4. Shadow Tongue chain: archives data-banks tier-2 → `shadow_tongue_evidence` set → bridge tactical-display tier-3 shows ST annotation → comms-array static-screen tier-3 unlocks `voice-in-the-static` → engineering schematic-pad shows edited blueprint.
5. Uncorruption mini-loop: complete archives lectern pair end-to-end. Confirm `activeEdits` count drops; `CorruptibleBio` re-renders without crossouts; trust ticks +5; revelation fires.
6. Shadow Vault entry: confirm cinematic plays once; `shadow_tongue_face_to_face` set; lever can both release and re-seal.

### 6.3 Asset coverage probe

Read-only script (or vitest) that:
- enumerates `ROOM_DEFINITIONS`
- for each `(room, state)` referenced in any `roomMysteries/*.ts` `setsFlag` or `roomStateAssets.ts` variant, asserts an `imageUrl` or `ROOM_MEDIA_PROMPTS` entry exists
- prints missing assets table

Wire into CI as a non-blocking warning initially; promote to blocking after Phase D.

### 6.3b Accessibility / parity probe (NEW — required for this work)

A vitest that, given each of the 120 character-creation signatures (3 species × 8 elements × 2 alignments × 5 classes from `characterCreationImpact.ts`), simulates a play-through and asserts:
1. Every signature can reach every room in `OUTBREAK_ROOM_ORDER` and `POST_OUTBREAK_ROOMS` — no signature is locked out of a critical-path room.
2. Every signature can complete every Shadow Tongue uncorruption pair from §2.5 — no pair has a half hidden in a species-gated room.
3. No `setsFlag` in any `roomMysteries/*.ts` is referenced as a prerequisite by another room/quest where that flag is only-settable in a species-gated room. Run this as a static graph check, not a runtime sim.
4. Each species sees the same critical-path Loredex completion percentage; species-exclusive entries are tagged `bonusContent: true` and excluded from the parity calculation.

This is the load-bearing test that addresses the "make sure all gameplay is accessible" requirement. Author it before authoring the species-room modules so any drift is caught immediately.

### 6.4 Lint

- `pnpm lint` — eslint must pass
- `pnpm lint:void-energy` — only triggers if any new file lives under a Tier-3A path; new shared modules are Tier-2 logic and exempt, but verify no design-token violations were copied into prompt strings (raw hex literals like `#6366f1` belong to the relationship file, not new modules)

### 6.5 End-to-end & regression

- `pnpm test:e2e` — Playwright suite must pass; if a click-through e2e exists it should be extended to walk one full uncorruption loop
- `pnpm db:smoke` — confirm `shadowTongueState` schema unchanged (we only populate the existing JSON column, no migration)

---

## 7. Risks / Call-Outs

1. **`activeEdits` shape change is observable.** Currently `json<Record<string, unknown>>()`, always empty. Any existing consumer parsing it will see structured data for the first time. Audit `useShadowTongueVO.ts` and `epochWitnessService.ts` callers before populating.

2. **`RULES_VERSION` bump.** Adding flags is non-breaking. Adding exits to `connections:` arrays mutates the deterministic graph. If any test or replay relies on graph-derived shortest paths, bump `RULES_VERSION` in `apps/shared/tcg-core/engine/version.ts` and pin replays.

3. **Underscore-vs-kebab room ids.** `OUTBREAK_ROOM_ORDER` uses `cryo_bay`; `ROOM_DEFINITIONS` uses `cryo-bay`. Known foot-gun. New code MUST not compare the two without normalisation. `apps/shared/awakeningProtocol.ts` documents this; preserve its convention.

4. **S3 / video MIME.** Confirm `apps/scripts/upload-public-to-s3.ts` sets correct `Content-Type` for `.webm` (`video/webm`) and `.mp4` (`video/mp4`); ETag compare is content-only and works either way, but CloudFront caching depends on MIME.

5. **CorruptibleBio crossout density.** Visually fun in small doses; overwhelming with 2+ active edits per hotspot description. Cap visible crossouts at 1 per description; gate the rest behind `look` interactions.

6. **Hotspot rectangle drift.** Many of the 17 unmoduled rooms have T0-only art that was never tightly composed. New hotspots need a `?debug-hotspots=1` walk before shipping or the rectangles will sit on empty wall.

7. **Veo 3.1 output format.** Veo emits `.mp4` natively; converting ambient loops to `.webm` (smaller, alpha-friendly) is preferred. Add a one-line ffmpeg step to the asset-render script: `ffmpeg -i in.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -an out.webm`.

8. **Manifest-validation tests** (`preludeBibleAudit.test.ts`, etc.) will need their allowed-id lists updated for the ~20 new VO ids and the new prompt manifest. Update tests in the same PR as the manifest entries.

9. **Shadow Vault placement in unlock order.** The room id `shadow-vault` is on Deck 9 Mystic. Its narrative weight (the encounter scene) suggests late-game gating. Confirm with the writer which flag gates entry — likely `shadow_tongue_evidence` AND trust ≥ 60 — before authoring its module.

10. **Audit doc location.** `docs/production/room-pointclick-audit.md` should be regeneratable from the codebase via the audit probe in §6.3 so it doesn't drift. Treat as derived, not authored.

11. **Prompt-body authoring style.** All §4.1 still bodies and §4.2 video bodies were authored to compose with `ROOM_STATE_STYLE_ANCHOR` (re-exported). The asset team should NOT prepend their own anchor — the CSV-export pipeline does it once. Authors who copy-paste a prompt into a one-off render must paste the anchor manually.

12. **Species-exclusive accessibility trap.** The largest accessibility risk in this plan is a future writer placing a critical-path item, ST uncorruption pair half, or progression flag inside `the_elemental_forge`, `blood_archive`, `probability_chamber`, `dimensional_observatory`, `hybrid_sanctum`, or `the_between`. Two-thirds of the player base would silently lose access. The §6.3b parity probe catches this; it must be wired into CI as **blocking** (not advisory) for any PR that touches `roomMysteries/`, `cryoBayMystery.ts`, `medicalBay.ts`, `roomTier.ts`, `awakeningProtocol.ts`, `preludeRoomGate.ts`, or `characterCreationImpact.ts`.

13. **Outcome-branch divergence.** The `donated_dna_sample` vs `refused_dna_sample` medical-bay branch is the only existing material outcome-fork. It currently affects cinematics + crew traits, not access. If this work or follow-up adds outcome-gated rooms, ensure every branch reaches the same critical-path coverage and update the §6.3b probe to enumerate outcome-branches alongside the 120 creation signatures.

14. **`canAccessRoom()` call placement.** The function exists but is not called consistently from the room-graph code. Audit every consumer of `ROOM_DEFINITIONS` and `roomGraph` before shipping species-room modules, or the bonus rooms will appear as accessible to wrong-species players in dev tools and exit menus, even though entering them no-ops.

---

## 8. Out of Scope (explicitly)

- Re-rendering existing T0 art for cosmetic uplift — the existing CDN PNGs stay until the rooms get state variants (which gives them new art for free).
- Adding new connections beyond the dead-end fixes in §3 — non-trivial graph changes need writer sign-off.
- Authoring lore/dialog for the 17+6 new minimum modules beyond the first-look flag-set — writers will pass over them after Phase C lands the wiring.
- Full Veo cinematics for every room — the 8 enumerated videos cover the high-narrative beats only. Routine room-entry has no video.
- Changing the existing `OUTBREAK_ROOM_ORDER` phase gates.
- Sound design / VO recording for the ~20 new ST manifest ids (asset-team job after this lands).
- Adding new class/archetype/faction/outcome-based room gates — the existing model (universal core + species-exclusive bonus) is correct and stays. We are only ensuring parity within the existing model.
- Writing alternate "equivalent paths" for species-exclusive rooms — bonus content is bonus, not parity-required. Parity applies to **critical-path coverage**, not to total room count.

## 9. Accessibility Summary (load-bearing answer to the user's check)

The current code design guarantees universal critical-path access:
- **Class-gated rooms:** none.
- **Archetype-gated rooms:** none (archetypes drive dialog/personality only).
- **Faction-gated rooms:** none (factions drive trust/quest hooks only).
- **Outcome-branch-gated rooms:** none (donated/refused, ST trust, etc. drive dialog and rewards, not access).
- **Species-gated rooms:** 6 (the_elemental_forge, blood_archive, probability_chamber, dimensional_observatory, hybrid_sanctum, the_between) — bonus content, NOT critical path.

This plan preserves that guarantee by:
1. Placing every Shadow Tongue hotspot in universal rooms (§2.45).
2. Keeping every uncorruption-pair half in universal rooms (§2.5).
3. Ensuring species-exclusive flags are cosmetic/Loredex-only and never gate other content (§3.1 constraints).
4. Adding the §6.3b parity probe as a CI gate so future PRs can't silently break this guarantee.

No player will be locked out of progression, the Shadow Tongue arc, or any uncorruption mini-loop, regardless of species/class/archetype/element/alignment/faction. Bonus content varies by species; critical content does not.

---
---

# Plan 2: Episodic Mystery System — Living-Universe-Linked Detective Layer

## Context (Plan 2)

Plan 1 (above) shipped: 32 rooms with point-and-click hotspots, Shadow Tongue wired end-to-end, AAA art on CDN, parity probe in CI, and 708 voIds rendered. That work is **merged** to main as squash commits `5f95439`, `7a59805`, and `c1023c21`.

**Plan 2 is a new design** (not yet implemented) for an **Episodic Mystery System** that braids the room point-and-click work into the Living Universe, Living Ark, yearly calendar, and governance hub. The user asked: "Is there a way to have the yearly calendar and governance hub votes create a series of mysteries and conspiracies to unravel?" — drawing inspiration from Sherlock Holmes: Crimes & Punishments, Police Quest, Hero's Quest / Quest for Glory, **Telltale games** (Walking Dead, Wolf Among Us, Tales from the Borderlands), L.A. Noire, and Disco Elysium.

**Outcome**: a year-long episodic detective layer where (a) governance vote outcomes seed mysteries, (b) underwritten NPCs (Wraith Calder, Oracle, Seer, Vex Solène, Game Master, Degen) gain 5-episode arcs that finalize per-player trust scalars, (c) the same mystery reads differently per faction/race/class lens, (d) anniversary mysteries recur and deepen with prestige, and (e) Living Universe pressure events emerge from collective deduction patterns.

---

## 1. Architecture (in prose)

The Mystery Engine is a **scheduling and authoring lattice** that braids five existing systems together — never replacing them, never inventing a parallel clock:

```
yearOneMonth.ts          → season grid (12 monthly slots, advances raise flag)
livingUniverseEvents.ts  → stakes sensor (pressure-driven emergence, MAX 2 concurrent)
rippleEngine.ts          → trigger fabric (~40 event types; pub/sub bus)
dailyBrief.ts + livingArk.ts → delivery shelf (Daily Brief story slot)
epochWitnessVotes.ts     → mystery seed source (26 votes × 5 epochs)
```

End-to-end data flow for one mystery beat:

1. **Vote opens** → `epochWitnessService.openVote()`
2. **Players vote** → `ripple.emit("governance_vote_cast")` (already exists)
3. **Vote closes** → NEW `mysteryClosureCron` flips `isClosed`, emits `epoch_vote_closed`
4. **Mystery seeded** → `mysteryService.compileVoteOutcome()` reads winning option's NEW structured `seed` field, generates a `MysteryDefinition`
5. **Episode opens** → `playerMysteryProgress` row per eligible player, bound to current `yearOneMonth`
6. **Surface placement** → Daily Brief gains "Case File" card; Living Ark room hosting episode gets `case_beat` event-type; hotspots gain `interrogate` verb
7. **Investigation** → player explores via existing verb-coin, accumulates EMS-typed clues, does interrogation, presents evidence, runs deductions
8. **Pressure feedback** → each action emits ripple events (`mystery_clue_found`, `mystery_deduction_correct`, etc.) which `mysteryService` translates to pressure deltas
9. **Episode closes** → `playerMysteryChoices` row written, next episode scheduled for next `yearOneMonth` advance, `mystery_episode_closed` ripple
10. **Living Universe** → aggregate pressure may activate new mystery-flavored emergent events ("the patterns are surfacing"); witnessing layer recolors per most-cited evidence
11. **Season roll-up** → after Episode 5, per-NPC trust scalar finalizes, Antiquarian Bible entry locks in, VO bank ships

The engine is a **router**, not a runtime. No new event loop, no parallel persistence, no separate save format.

## 2. Mystery taxonomy (6 types, all share the case-file UI)

| type | seed | scope | resolution | telltale lineage |
|---|---|---|---|---|
| **Vote-Spawned** | `epochWitnessVotes.options[winId].seed` | Voters + recap-on-entry for non-voters | Bounded by which option won (frame, not truth) | "Previously, the community decided…" preface |
| **NPC-Arc** | Hardcoded in `episodeMysteries.ts` | Solo with collective tally surfacing | 5 episodes → trust scalar finalizes | Walking Dead Season 1 (relationship-with-Clementine) |
| **Faction/Race/Class Lens** | Same case as NPC-arc, Lens added | Per-player per-signature | Same critical clues, different reading paths | Hero's Quest class-specific solutions |
| **Anniversary** | Bound to seasonal event (Fall of Reality 21d) | All players, recurring yearly | First-cycle fresh; prestiged players see new evidence layered | Wolf Among Us recontextualization |
| **Living Universe Pattern** | `livingUniverseEvents` event triggers | All players inside activation window | Time-boxed; "the moment passed" archive if uncompleted | L.A. Noire crime-of-the-week atop main spine |
| **Cross-NPC Weave** | Multi-arc dependency in `episodeMysteries.ts` | Players who completed both arcs | 1-2 interstitial episodes as Month 12 cliffhanger | GoT Season 1 Episode 6 family-converges |

## 3. Episode structure (Telltale 7-phase, ~30-60 min)

A canonical NPC-arc episode runs 7 ordered phases, all hooking existing surfaces:

- **Phase A — Recap (cold open)** — 30-90s Antiquarian narration of prior choices. Late-joiner densified branch via `playerMysteryProgress.lastEpisodePlayed < N-1`.
- **Phase B — Cold Hook** — new clue arrives in Daily Brief story slot. New event-type `case_beat` in `dailyBrief.ts`.
- **Phase C — Investigation** — 1-3 rooms gain investigation flavor; hotspots gain optional `interrogate` verb (additive to Look/Use/Talk in `_template.ts`).
- **Phase D — Deduction Gate** — Sherlock-style 2-3-clue combine. Multiple coherent solutions; false leads continue rather than block.
- **Phase E — Interrogation Set Piece** — once per episode. L.A. Noire Truth/Doubt/Lie + Telltale Sympathetic/Pressing/Accusatory tone. Disco-Elysium internal voices = existing Elara/Human banding.
- **Phase F — Choice Point** — bounded 2-4 options. **"X will remember that"** explicit Telltale telegraphing.
- **Phase G — Cliffhanger** — one-screen tease, gates next episode behind next `yearOneMonth` advance.

Cadence: 5 episodes per arc, one per month, aligned to `year_one_month_N_opened` flags. Async play within each window.

## 4. Detective-game mechanics

- **Evidence Board** — REUSE the existing `CADESConspiracyBoard.tsx` pattern (per §14b.6 course-correction). Each arc declares `<arcId>_CONSPIRACY_NODES` + `<arcId>_CONSPIRACY_EDGES` in its narrative-integration manifest; a thin `SagaConspiracyBoard.tsx` wrapper (NEW, <200 lines) tabs between arcs. Manual-pinned layout, discovery-gated, edges only render between two discovered nodes. Per-room `CADESClueBoard.tsx` is the per-arc clue surface, filtered by id-prefix (`clue_wraith_*`, `clue_jericho_*`, etc.). No new "three-column suspects/evidence/locations" view — the canonical board is graph-shaped, and that's authorial intent.
- **Deduction Engine** — each NPC arc declares a deduction graph in `episodeMysteries.ts`. `mysteryService.submitDeduction({clueAId, clueBId})` → `correct | partial | false_lead_named | nonsense`. Premature accusation closes episode with *misread* color (Holmes pattern).
- **Interrogation Mode** (`InterrogationDialog.tsx`, NEW) — wraps existing dialog renderer. Per-question tone choice (3 affordances) with trust deltas; L.A. Noire-style Truth/Doubt/Lie micro-mechanic; evidence-present option.
- **Evidence Cross-Reference** — sparse `presentationReactions: (npcId, clueId) → reaction` table. Empty cells = default brush-off; populated cells = load-bearing VO.
- **Mind Map** — REUSE `CADESConspiracyBoard.tsx`'s manual-pinned SVG layout; do NOT introduce a force-directed alternative. Authored placement is part of the storytelling. Navigation aid only — the case must remain solvable from text alone for §6.3b parity.
- **Internal Voices (Disco-Elysium echo)** — Elara/Human bands already in `_template.ts`; add third **Antiquarian-Bible** band for retrospective narration. Witnessing layer's narrator preference (`livingArkTouchpoints.ts`) tilts which voice argues louder.
- **Police-Quest Procedure** — one episode per arc (typically 3 or 4) is procedural — order matters; out-of-order = soft-fail with reduced **procedural integrity** score affecting season ending. Hosted in `roomMysteries/orderTribunal.ts`.

## 5. Ripple + pressure integration

**New ripple events** in `rippleEngine.ts`:
- `epoch_vote_closed(voteId, winningOptionId)`
- `mystery_clue_found(userId, mysteryId, clueId, episodeId)`
- `mystery_deduction_submitted(userId, mysteryId, isCorrect, isFalseLead)`
- `mystery_interrogation_pressed(userId, npcId, toneId, trustDelta)`
- `mystery_evidence_presented(userId, npcId, clueId, reactionId)`
- `mystery_episode_closed(userId, mysteryId, episodeId, choiceId)`
- `mystery_season_resolved(userId, mysteryId, resolutionColorId)`

**New pressure types** in `livingUniverseEvents.ts` — fold into 3 to limit churn:
- `mysteryProgress` (forward action)
- `mysteryMisreads` (false-lead deductions; "the wrong story is louder")
- `mysteryInterrogationHeat` (Pressing/Accusatory tone choices; tilts NPCs fearful)

**New emergent events** (≥2 to seat the new pressure types, respecting `MAX_CONCURRENT_EVENTS = 2`):
- **"The Pattern Surfaces"** — `mysteryProgress > 1000` in 14d. Daily Brief gains "what we know" community card; witnessing recolors by most-cited evidence.
- **"The Wrong Story Louder"** — `mysteryMisreads > 1000`. Antiquarian flips to suppressed-truth variants for 7d; Shadow Tongue edits multiply.
- **"The Witnesses Talk"** — `evidenceCrossReferenced > 1000` (computed from `mystery_evidence_presented` ripples). NPC trust caps relax for 3d.

## 6. Vote-outcome → mystery template format

The existing `consequence: string` field stays (display-only). **Add an optional sibling**:

```ts
options: {
  id: string;
  text: string;
  consequence: string;  // unchanged — still display
  seed?: MysterySeed;   // NEW — optional structured field
}[]
```

`MysterySeed` (declared in NEW `apps/shared/mysteryTemplates.ts`):

- `templateId: MysteryTemplateId` — references compilable templates (`npc_arc_kickoff`, `anniversary_cycle`, `faction_truthlayer`, `living_universe_pattern`, `cross_npc_weave`)
- `npcFocus?: NpcId`
- `factionWeights?: Partial<Record<FactionId, number>>`
- `roomBindings: RoomId[]`
- `daysAvailable?: number` (null = until next monthly advance)
- `evidenceSeeds: EvidenceSeed[]` — 3-5 starting clues
- `successColors: ColorId[]` — bounded resolution colors
- `crossLinks?: CrossLinkSpec[]`
- `accessibilityFloor: SignatureFloor` — usually `["all"]`

Vote-closure runs in `mysteryService.compileVoteOutcome(voteId, winningOptionId)`:
1. Read vote + winning option's `seed`. Absent seed → fallback to display-only consequence.
2. Resolve `templateId` to a compiler in `mysteryTemplates.ts`.
3. Compiler returns `MysteryDefinition` (same shape as hardcoded NPC arcs — vote-spawned mysteries are first-class).
4. Per eligible player: write `playerMysteryProgress` row, episode 1, bound to current `yearOneMonth`.

**Vote-closure cron** — periodic job re-using bootstrap pattern from `auditLogRotation.ts` / `announcementsBootstrap.ts` / `pvpRatingsBootstrap.ts` (all confirmed to exist). Idempotent: re-running must not double-emit `epoch_vote_closed` or double-seed mysteries. Schema: add `expiresAt` to `epochVoteTallies` (small migration; field doesn't exist today).

**Backfill policy**: future votes only (Revelation epoch's last 5, Fall of Reality's 3). Past closed votes have already shipped display-only consequences — no retroactive mysteries.

## 7. Underwritten-NPC arc proposals (6 NPCs × 5 episodes)

Each arc finalizes a **per-player trust scalar** (currently absent for these 5 of 13 canonical NPCs). Lore is rich; VO is thin or zero — exactly the gap to fill. Current state per Phase 1 explore agent + canon-correction lookup:

| NPC | Bible lines | VO lines | hook |
|---|---|---|---|
| **Wraith Calder / Hierophant** | 1410 | 0 | Bounty hunter killed by the Host at end of Epoch 1; reborn in New Babylon centuries later; stole the resurrection protocols from the Syndicate of Death; the Final Rite re-seated his consciousness in a Thalorian vessel — he became the Hierophant of Thaloria in Exile, herald of the Oracle's revelatory return |
| **Jericho Jones** | (no standalone bible yet — flagged for authoring) | 0 | Insurgency Iron-Clad Lion in training; killed Akai Shi at the Battle of Thaloria to stop the Thought Virus from spreading; the pre-Fall Iron Lion imprint is awakening in him while he trains under the Degen's mediation on the Heart of Time |
| **The Seer** | 1000 | 8 | Pre-recorded prophecies that contradict |
| **Vex Solène** | 829 | 0 | Engineer-Zero/Warlord-fragment swap residue |
| **The Game Master** | 739 | 41 | Dead-AI's recovered logs |
| **The Degen** | 758 | 12 | Ne-Yon casino debt to Hierarchy demon |

> **Canon correction note (2026-05-01)**: A prior pass had Wraith as a "seven-deaths arena survivor" and proposed an "Oracle: Stolen Voice" arc. Both were lore-incorrect. Per `apps/shared/npcs/bibles/wraith_calder.md:149-210` and `apps/shared/npcs/bibles/the_oracle.md:7,604`: Wraith's seven pre-rite bodies were sequential rebirths after the Host invasion, not arena deaths; the eighth death was the Sanctuary's Final Rite that transformed him into the Hierophant. The Oracle is **not an investigable NPC** — the Oracle operates only through dream-substrate / memory-residue / cinematic-exception triggers (any oracle line in waking-time outside those three channels is the Meme or a False Prophet). Wraith awaits the Oracle's return; the Oracle is not interrogated. Jericho Jones replaces Oracle in the arc list.

### 7.1 Wraith Calder — "The Eighth Death and the Names"

The arc's spine is Wraith's transformation from bounty hunter → Hierophant, told via investigation of the artifacts and witnesses he left across the centuries. The Syndicate of Death is the season antagonist. Existing canon to weave: `questlineSyndicate.ts` "The Fair Trade" + The Word and The Silence (Information Twins, Syndicate-Of-Death info brokers); 347,000 names Wraith writes daily as Hierophant; pre-rite trust persisting into post-rite (5 bands: Hostile / Wary / Witnessed / Present / Inheriting).

- **E1 "The First Death and the Crystalline City"** — investigate Wraith's death at the end of Epoch 1 when the Host invaded the crystalline city. Cold hook: a bounty contract signed but never collected. Cross-reference Antiquarian's Journal `ep1-15`. Choice: read his original bounty file at face value, or read it as a redacted document.
- **E2 "The Stolen Protocols"** — the resurrection technology Wraith took from the Syndicate. Investigation hosted in Cipher Den + Engineering Core (Substrate-N from `synthesisChamber.ts` and the Syndicate's encrypted ledgers). Cross-link planted to Game Master (R&D Archon territory). Choice: name the stolen tech publicly or hold the name.
- **E3 "The Six Immortal Twins"** — Syndicate of Death's structure. Wraith hunted six twins; you investigate which ones he killed and which are still active. Police-Quest procedural beat: file the Tribunal report in correct order. **The Word and The Silence** are interrogable here — they speak in alternating sentences, L.A. Noire Truth/Doubt/Lie set piece. Choice: trade the Information Twins a memory imprint for 7-Omega clearance, or refuse the fair trade.
- **E4 "The Eighth Death"** — the Sanctuary's Final Rite that consumed Wraith's body and re-seated his consciousness. This is the **load-bearing canon assertion** per `wraith_calder.md:210`. Disco-Elysium internal-voice argument: was the rite consent or coercion? The Hierophant remembers as one; the bounty hunter remembers as the other. Choice: accept the rite's continuity narrative, or insist the bounty hunter died in it.
- **E5 "The Herald's Vigil"** — Wraith as Hierophant, writing names. The 347,000 unnamed dead are the case file. The player participates in one daily ceremony, choosing a name to inscribe. The Oracle is *invoked* but does not appear (canon-respecting: Oracle only manifests via substrate). Choice: name a Syndicate twin Wraith couldn't reach in life, name an obscure victim Shadow Tongue scrubbed, or name a name only the player carries from another arc. Trust scalar finalizes (5 bands).

**Faction lens**:
- Thaloria reads as religious continuity (the rite as sacrament)
- Insurgency reads as anti-cartel direct action (the resurrection protocols as expropriated commons)
- Hierarchy reads as theft + identity laundering (the rite as legal evasion)
- Same critical clues, three framings.

**VO commitment**: ~120 banded lines for Wraith (currently 0). Trust bands authored along the existing 5-band Hostile/Wary/Witnessed/Present/Inheriting axis already declared in his bible.

**Cross-link**: Episode 5's "name a name only the player carries from another arc" hook depends on **Jericho arc** (the Akai Shi inscription) — Year 1 Month 12 cliffhanger material.

### 7.2 Jericho Jones — "The Iron Lion Imprint"

Jericho is being trained as the **new Iron Lion** under the Degen's mediation on the Heart of Time. The pre-Fall Iron Lion's consciousness is awakening in him while he trains. He killed Akai Shi at the Battle of Thaloria to stop the Thought Virus from spreading — that killing is the moral seed of the arc. Existing canon: TCG card `s1_char_011_jericho_jones.ts` (Insurgency, Provoke, 2-cost 5/7, "+2 ATK to adjacent allies"); Degen bible §2.5/§3.11/§4.4; Game Master bible §4.5.

- **E1 "The Recruit"** — first contact with Jericho. Investigation: why is the Degen training an Insurgency Lion on a casino timeline? Cold hook: the Degen's ledger has a single line for "Iron Lion training" with no fee — a *gift*, which is the one thing the Degen doesn't do. Choice: ask Jericho directly about the Degen's interest, or ask the Degen about Jericho.
- **E2 "Akai Shi"** — flashback investigation into the Battle of Thaloria. Akai Shi was someone Jericho trusted; the Thought Virus had taken her. Police-Quest procedural beat: reconstruct the killing in correct order from the witnesses. Disco-Elysium internal voices: Sympathetic (the killing was mercy), Pressing (the killing was murder), Accusatory (the killing was theft of agency). Choice: which framing does Jericho accept when he tells the story?
- **E3 "The Imprint Surfaces"** — the pre-Fall Iron Lion's consciousness is bleeding through. Investigation in `dreamsWorkshop.ts` — the dream-loom catches imprints. Cross-link to **Wraith arc** (resurrection-protocol territory: is the imprint a stowaway from the same tech?). Choice: warn Jericho about the imprint, or let him discover it himself.
- **E4 "Lionism Ethics"** — the Iron Lion code vs. the killing of Akai Shi. The pre-Fall Iron Lion (whose imprint is rising) had a different read on the code than current Jericho. Sherlock-style deduction matrix: which Lion's reading is correct? Multiple coherent solutions. The honest answer is *both readings are partial* — the code evolved between the Falls.
- **E5 "The Degen's Commission"** — what was Jericho being trained for? The reveal is that the Degen positioned Jericho against a coming Syndicate-of-Death move (the same Syndicate Wraith faced). Jericho becomes operational. Choice: bless his commission, refuse to witness, or insist on witnessing in person. Trust scalar finalizes.

**Faction lens**:
- Insurgency: reads as cadre formation (Jericho as comrade-in-training)
- Hierarchy: reads as a counter-asset emerging (Jericho as threat)
- Thaloria: reads as Lionism's moral evolution (Jericho as test case)

**VO commitment**: ~120 banded lines for Jericho (currently 0; no standalone bible yet — bible authoring is a PR2 prerequisite, fed by Degen + Game Master cross-references already in canon).

**Cross-link**: Episode 5's "coming Syndicate-of-Death move" Jericho is positioned against = **Wraith arc Episode 5's "name a Syndicate twin Wraith couldn't reach"**. The Y1M12 cliffhanger reveals that Jericho's commission is to finish what Wraith couldn't — the two arcs converge.

**Cross-arc to Wraith Episode 5**: Akai Shi is a name the player can choose to inscribe in Wraith's daily ceremony (E5). Inscribing it deepens Jericho's trust scalar; declining preserves Jericho's right to grieve privately. This is the Year 1 Month 12 cliffhanger payoff.

### 7.3 The Seer — "Pre-Recorded Contradictions"
- **E1 "The Unread Tape"** — never-played prophecy.
- **E2 "The Two Tomorrows"** — contradictory same-day prophecies. The contradiction's resolution requires consulting the Hierophant (Wraith) — cross-link to Wraith arc (the Hierophant's daily-names ceremony catalogues prophecies the Seer never delivered). **Note**: the Seer is NOT a substitute for the Oracle — substrate-channel canon (`the_oracle.md:604`) forbids any waking-time character occupying the Oracle's role.
- **E3 "The Listener Who Stopped Listening"** — audience drift.
- **E4 "The Recording Engineer"** — cross-link to Vex (Engineer Zero predecessor).
- **E5 "The Prophecy That Cancels Itself"** — third prediction visible only via in-order completion. Procedural integrity matters.

### 7.4 Vex Solène — "Engineer Zero Persists"
- **E1 "The Rite That Didn't Take"** — residue.
- **E2 "The Replacement Memory"** — whose memory?
- **E3 "The Engineer's Workshop"** — tied to `dreamsWorkshop.ts`.
- **E4 "The Two-Voiced Decision"** — Vex makes a choice; player decides which voice listens.
- **E5 "The Unification (or Not)"** — integrate or excise the fragment.

### 7.5 The Game Master — "The Dead AI's Last Move"
- **E1 "The Last Save"** — final-minutes log.
- **E2 "The Abandoned Players"** — who was mid-game when AI died?
- **E3 "The Missing Move"** — chess-puzzle deduction set piece via existing `chessClimb.ts`.
- **E4 "The Successor"** — presence-band forming.
- **E5 "The Endgame"** — make the GM's last move or refuse.

### 7.6 The Degen — "The Ne-Yon Debt"
- **E1 "The Ledger Page"** — uncountered debt line. Casino router investigation.
- **E2 "The Debt Collector"** — Hierarchy demon arrives.
- **E3 "The Original Wager"** — what did the Degen bet?
- **E4 "The Substitute Payer"** — Degen tries to make player pay.
- **E5 "The Casino's True Owner"** — casino itself was a wager. `DegensCasinoPage.tsx` recolors permanently.

## 8. Faction / Race / Class Lens system

A `signatureLens` field on episode definitions. Each Lens has a frame, gating evidence, bonus deduction.

### 8.1 Faction (Voltari Resonance Node — truth-layer divergence)
- Resonance Node emits same evidence three ways. Each faction's lens sees one frame as "true," others as "static."
- Voltari = literal truth (specialist). Hierarchy = politically convenient. Insurgency = morally inconvenient.
- Climax deduction: "which reading is correct?" — honest answer is *all three are partial*; bounded ending = whether player accepts pluralism or names a single truth.

### 8.2 Race (Ne-Yon Enigma Inheritance — bisected mirror)
- Ne-Yon sees the case **dual**: who-did-it AND who-was-going-to-do-it.
- Mechanic: split-screen case file; deductions combine left/right halves OR cross-side (cross-side = unique third deduction Ne-Yon-only).
- Other races see one half. Critical path reachable by all (§6.3b parity); mirror is enrichment not gating.

### 8.3 Class (Spy Cover-Identity Compromise — same crime, 5 angles)
- Bridge leak. Five class lenses, same suspect graph, different rooms host evidence.
- Spy: tradecraft / counter-intel. Engineer: reverse-engineer comms protocol. Oracle: psychic residue. Soldier: tactical impact map. Assassin: who profited.
- Critical clues present in all 5 paths; class-flavor clues only in lens path.
- **Forces authoring parity** — every class lens must implement before episode ships. Closes Soldier/Engineer thinness gap structurally.

## 9. Cadence + calendar (Year One)

| Month | Beat | Type |
|---|---|---|
| 1-5 | **Wraith arc E1-E5** ("The Eighth Death and the Names" — Syndicate of Death + resurrection protocols + the Final Rite) | NPC-arc |
| 6 | **Anniversary — "What Was Lost in the Fall"** (bound to Fall of Reality 21d) | Anniversary |
| 7-11 | **Jericho arc E1-E5** ("The Iron Lion Imprint" — Akai Shi + Lionism ethics + the Degen's commission) | NPC-arc |
| 12 | **Cross-NPC Cliffhanger — "The Inscription and the Lion"** (Jericho's commission = the Syndicate move Wraith couldn't reach; the player inscribes Akai Shi's name in Wraith's daily ceremony) | Cross-NPC weave |

Vote-spawned mysteries thread between as 1-2-episode interludes (color the spine, don't displace it). Living Universe pattern mysteries fire opportunistically when pressure crosses thresholds.

**Year Two (post-prestige)**: Wraith and Jericho arcs do NOT reset — re-open with new evidence layer that recontextualizes Year One deductions ("deeper truth," never "you were tricked"). Year Two slots Seer + Vex + Game Master + Degen into M1-5 / M7-11, preserving M6 anniversary and M12 cliffhanger.

**Special-event tie-ins**:
- Shadow Convergence (14d) → 1-episode combat-flavored vote-spawned
- Chrono Harvest (10d) → opportunistic Living Universe pattern if threshold crossed
- Lore Symposium (14d) → Antiquarian-narrated cross-reference beat surfacing accumulated case evidence

## 10. Critical files

### NEW shared modules
- `apps/shared/episodeMysteries.ts` — canonical authoring surface (NPC arcs, episodes, deduction graphs, suspect graphs, lens definitions)
- `apps/shared/mysteryTemplates.ts` — vote-seed compilers; one function per `MysteryTemplateId`
- `apps/shared/mysteryTypes.ts` — pure types shared client/server (`MysteryId`, `EvidenceId`, `DeductionId`, `EpisodeId`, `LensId`, `MysterySeed`, `MysteryDefinition`)
- `apps/shared/mysteryVoiceBands.ts` — banded narration extension for the Antiquarian voice

### EXTEND existing shared
- `apps/shared/roomMysteries/_template.ts` — add `interrogate` verb (additive); add optional `mysteryBinding?: { mysteryId, episodeId, lensFiltering }` to `VerbResponse`
- `apps/shared/livingUniverseEvents.ts` — register §5 pressure types + emergent events
- `apps/shared/epochWitnessVotes.ts` + `Late.ts` — add optional `seed?: MysterySeed` to `options[].consequence`
- `apps/shared/seasonalEvents.ts` — Fall of Reality entry gains optional `mysterySeed?: MysterySeed`

### NEW server services / routers
- `apps/server/services/mysteryService.ts` — episode lifecycle, deduction validation, vote-closure compilation. **NAME COLLISION VERIFIED**: `episodeService.ts` already exists; using `mysteryService.ts` is correct.
- `apps/server/services/mysteryClosureCron.ts` — re-uses bootstrap pattern from confirmed precedents (`auditLogRotation.ts`, `announcementsBootstrap.ts`, `pvpRatingsBootstrap.ts`)
- `apps/server/routers/mysteries.ts` — `getActiveCase`, `getEvidenceBoard`, `submitDeduction`, `askQuestion`, `presentEvidence`, `submitChoice`, `getRecap`, `closeEpisode`

### EXTEND existing server
- `apps/server/services/rippleEngine.ts` — register §5.1 events
- `apps/server/services/epochWitnessService.ts` — emit `epoch_vote_closed`; expose `compileVoteOutcome` hook
- `apps/server/services/pressureService.ts` — accept new pressure types (existing decay applies)
- `apps/server/routers/dailyBrief.ts` — `case_beat` event-type; "Case File" card in `getToday`
- `apps/server/routers/epochWitness.ts` — `closeVote` admin procedure (cron is default)

### Schema extensions (`apps/db/schema.ts`)
- `playerMysteryProgress` — userId, mysteryId, currentEpisode, openedAt, lastActedAt, lensId, recapNeeded
- `mysteryEvidence` — userId, mysteryId, clueId, foundAt, foundInRoom, foundViaVerb, presentedToNpcs, notes
- `mysteryDeductions` — userId, mysteryId, episodeId, clueAId, clueBId, clueCId?, result, narrationId, submittedAt
- `playerMysteryChoices` — userId, mysteryId, episodeId, choiceId, weight, willRememberFlag, recordedAt
- `mysteryInterrogationLog` — userId, mysteryId, episodeId, npcId, questionId, toneId, trustDeltaApplied, askedAt
- `npcTrustScalars` — userId, npcId, scalar (0-100), lastUpdatedFromMysteryId, finalizedFromArc — covers Wraith/Oracle/Seer/Vex/Game Master gap
- **Schema-add to `epochVoteTallies`**: `expiresAt: timestamp` (verified missing today)
- Migration: `0059_mystery_engine.sql` (next available after 0058)

### NEW client components
- `SagaConspiracyBoard.tsx` — thin wrapper over the existing `CADESConspiracyBoard.tsx`; tabs between per-arc boards (REUSES existing component; <200 new lines)
- `DeductionPanel.tsx` — Sherlock 2/3-clue submission
- `InterrogationDialog.tsx` — wraps existing dialog renderer; tone choices + Truth/Doubt/Lie
- `CaseRecap.tsx` — Telltale cold-open recap
- `ChoiceConsequenceToast.tsx` — "X will remember that" overlay
- `SeasonRollUp.tsx` — end-of-season aggregate

(Note: no separate `EvidenceBoard.tsx` or `MindMap.tsx` — the existing `CADESConspiracyBoard.tsx` IS the case-level board. Per the §14b.6 course-correction, follow the canonical pattern rather than fork it.)

### NEW client hooks
- `useActiveMystery.ts`, `useEvidenceBoard.ts`, `useInterrogation.ts`

### NPC trust extensions
- `apps/client/src/game/npcRelationships.ts` — add per-player trust for Wraith, Oracle, Seer, Vex, Game Master (precedents: Antiquarian/Elara/Human/Companion patterns already established)

### VO
- `apps/shared/mysteryVoManifest.json` per arc (or per NPC). Phase 1 ships banded variants for load-bearing scenes only (~200 lines per NPC arc, NOT 1000). Generated by `pnpm vo:mystery` (analog of `pnpm vo:room-mystery`).

### Tests
- `episodeMysteries.test.ts` — definition validity (clues exist, deduction graphs are DAGs, accessibility floors satisfied)
- `mysteryTemplates.test.ts` — every template compiles to valid `MysteryDefinition`
- `mysteryService.test.ts` — episode lifecycle, vote closure, deduction validation
- `mysteryAccessibilityParity.test.ts` — extends §6.3b probe: every (class × race × morality × faction × NPC arc × episode) reaches critical path

## 11. Verification

1. **Episode lifecycle** — open synthetic player, walk 11 clues + 4 deductions + 1 interrogation + 1 choice, advance month, assert episode 2 unlocks.
2. **Vote-closure → mystery generation** — seed expired tally, run cron, assert `isClosed=true`, ripple fires, eligible players get `playerMysteryProgress` rows.
3. **Choice carry-forward** — choice X in E1 → recap quotes it in E2 → resolution color in E5 incorporates it.
4. **Lens branching** — 5 synthetic players × different signatures → all reach critical path; each unlocks signature-flavored deduction.
5. **§6.3b parity probe extension** — every (class × race × morality × faction × NPC arc × episode) completes. Failure = build break.
6. **Late-joiner** — Month 5 player without E1-E4 history → recap renders densified; auto-populated clues with `foundVia="recap"`.
7. **Living Universe interaction** — drive `mysteryProgress > 1000` → "The Pattern Surfaces" activates; MAX_CONCURRENT_EVENTS cap honored.
8. **Multiplayer state** — 100 players, 70/30 accusation split → solo sovereignty preserved; community-summary card surfaces AFTER own accusation (no biasing late-joiners).
9. **Vote-outcome variant** — A wins vs. B wins → distinct mystery seeds compile → distinct frames; in-fiction truth identical (parity).

## 12. Risks + open questions

1. **Authorship cost** — naive 6 NPCs × 5 episodes × ~1500 words × 3 bands = 135k words. Realistic with banding concentrated where load-bearing: ~75k words. **Mitigation: phase ruthlessly** (PR1 framework only; PR2 first arc; iterate before authoring more).
2. **Telltale illusion-of-choice risk** — bounded ≠ illusory. Resolution color, trust scalar, Antiquarian Bible footnote, next-year anniversary VO callbacks all genuinely vary. Never promise cosmology mutation; deliver texture mutation.
3. **Late-joiner experience** — recap is the linchpin. Recap text authored *as you author each episode*, not after.
4. **Multiplayer state** — solo sovereignty + collective texture (existing Living Universe pattern). Community-aggregate card surfaces AFTER own accusation.
5. **Vote-closure mechanism** — net-new cron. Idempotency mandatory (re-running must not double-emit). `expiresAt` schema add required.
6. **VO generation cost** — 230 lines = 12min ElevenLabs. ~500 lines per arc → ~26min/arc. 6 arcs = ~150min. Tractable but real. Mitigation: ship banded VO for load-bearing 30% only.
7. **Architectural risks**:
   - `episodeService.ts` collision **VERIFIED**: use `mysteryService.ts` (already designed that way).
   - `interrogate` verb extension touches 34 room-mystery modules — type-safe (verb is optional in `responses`) but every room author should know.
   - Pressure type proliferation — fold to 3 (`mysteryProgress`, `mysteryMisreads`, `mysteryInterrogationHeat`) computing derived in handlers.
   - 3 new emergent events compete with existing 11 under MAX_CONCURRENT_EVENTS=2 cap; some may rarely activate. Acceptable — don't bypass cap.
8. **Open questions for stakeholder**:
   - Vote-spawned mysteries for all players or only voters? **Recommendation**: all eligible, with non-voters getting one-line "you weren't there but here's the verdict" recap.
   - Trust scalars visible as number or banded text? **Recommendation**: banded text only (number = server-side detail).
   - False-lead recovery within same episode? **Recommendation**: yes, at trust cost.
   - Case file persists across prestige? **Recommendation**: yes — prestige adds layers.
   - Backfill `seed` on already-closed historical votes? **Recommendation**: no.

## 13. Phased rollout

- **PR1 — Engine bones** — schema, ripple events, vote-closure cron (with `expiresAt` migration), `mysteryService`, mock 2-episode arc, tests, `interrogate` verb. Stub Case File card on Daily Brief. **No new prose value yet.**
- **PR2 — Wraith arc + UX** — 5 episodes ("The Eighth Death and the Names"), EvidenceBoard, DeductionPanel, InterrogationDialog, CaseRecap, MindMap, ChoiceConsequenceToast, SeasonRollUp. First shipping NPC arc. ~30% banded VO. Authors The Word and The Silence as interrogable Information Twins.
- **PR3 — Jericho arc + Anniversary scaffolding** — Jericho 5 episodes ("The Iron Lion Imprint"); requires authoring Jericho's standalone bible first (currently flagged-for-write). Fall of Reality anniversary infrastructure (no full episode yet).
- **PR4 — Vote-spawned enabled** — backfill `seed` on next-cycle votes (Revelation last 5).
- **PR5 — Lens system** — faction/race/class lenses ship; existing arcs gain layers retroactively (parity probe gates).
- **PR6 — Seer + Vex arcs** — 10 more episodes. Cross-NPC weave (Wraith's Syndicate move + Jericho's commission + Akai Shi inscription) lands as Y1 M12 cliffhanger.
- **PR7 — Game Master + Degen arcs** — complete 6 underwritten NPCs.
- **PR8 — Anniversary + Prestige evolution** — full Anniversary Cycle 1 + Cycle 2 evolution.
- **PR9 — Living Universe pattern mysteries** — pressure-emergent type goes live.

Each PR ships independently. Each PR is verifiable end-to-end. **No PR is gated on the next.**

**Sequencing principle**: engine first → one full arc → iterate → scale. Don't author 6 arcs in parallel. Telltale didn't author all 5 Walking Dead episodes before shipping E1; they shipped, learned, adjusted.

## 14. Inspirational anchor map

- **Sherlock Holmes: Crimes & Punishments** → §4 Deduction Engine (multiple coherent solutions, accuse-anyone, false-lead philosophy)
- **Police Quest** → §4 Procedure (one episode per arc is order-matters); §11 procedural integrity score
- **Hero's Quest / Quest for Glory** → §8 class-specific paths reaching same critical clues; reputation = trust scalar
- **Telltale (Walking Dead, Wolf Among Us, Tales from the Borderlands)** → §3 episode structure end-to-end (5×monthly, recap, "X will remember that," cliffhangers, season roll-up); relationship-tone-over-skill-checks drives §4 Interrogation
- **L.A. Noire** → §4 Truth/Doubt/Lie; §4 Evidence Cross-Reference
- **Disco Elysium** → §4 Internal Voices (Elara/Human/Antiquarian as three voices); "skill check that fails is still progress" = false-lead deductions

## 14b. Music + Slideshow + Loredex + Conspiracy Board Integration

Each mystery episode beat is also a **content release event**. The Saga already ships music (5 albums, 118 tracks), slideshows (Album 1 fully sliced — 29 tracks × 490 frames at 3168×1344 cel-shaded anime), 254 Loredex entries, and a transmission system that unlocks Loredex on broadcast. The Mystery Engine threads through all four.

### 14b.1 Existing inventory (per Phase 1 explore)

**Albums** (`apps/shared/albumRegistry.ts:16-22`):

| Album | Tracks | Era | Slideshow status |
|---|---|---|---|
| **Dischordian Logic** | 29 | Age of Privacy → Rise of Insurgency | ✓ FULL (`expansionArt/album1Slideshows.ts`) |
| **The Age of Privacy** | 20 | Empire → Insurgency Birth | ✗ unsliced |
| **The Book of Daniel 2:47** | 22 | Age of Prophecy | ✗ unsliced |
| **West By God** | 10 | Age of Insurgency | ✗ unsliced |
| **Silence in Heaven** | 37 | Age of Revelation → Fall of Reality | ✗ unsliced (full musical: 18 songs + 19 dialog scenes) |

**Already wired**:
- 254 Loredex entries (`apps/client/src/data/loredex-data.json`) — Wraith Calder, Akai Shi, Jericho Jones, Iron Lion, Oracle, The Host, Syndicate of Death, The Syndicated all exist as entries
- 25 song↔Loredex mappings (`apps/shared/loredexSongMap.ts`)
- Transmission→Loredex unlock pattern (`apps/shared/transmissionLoredexUnlocks.ts`) — episodes already unlock entries on broadcast (e.g. ep1-15 "The Beginning of the End" unlocks entity_76 The Host + entity_54 The Enigma)
- `BountyContract` + `InvestigationClue` shapes (`apps/client/src/game/investigationSystems.ts`) — 8 authored bounties + 5-clue-type taxonomy (visual / audio / data / scent / temporal)
- Lyrics generation: LLM-powered on-demand (`apps/server/routers/lyrics.ts`); NOT pre-authored. Song *titles* are the canonical reference; lyrics are produced fresh per request.

**Already built but undocumented in earlier passes** (course-corrected per §14b.6):
- Conspiracy board: `CADESConspiracyBoard.tsx` (140 lines) — SVG node+edge graph with discovery-gating
- Clue board: `CADESClueBoard.tsx` (96 lines) — prefix-filtered clue cards
- Arc-integration manifest template: `cadesNarrativeIntegration.ts` (635 lines, 8 sections)
- Bounty contracts: `BountyContract` shape + 8 authored bounties
- Memory replays: `MemoryReplay` shape + 3 authored replays
- Async NPC messages: `NPCMessage` + `getUnreadMessages()` resolver
- Bestiary: `BestiaryEntry` shape + 4 authored entries

**NOT yet built**:
- Per-song mystery-beat metadata (which arc unlocks which song?)
- Song release schedule / time-gating (slideshows ship, but no per-beat content-drop cadence)
- Multi-episode case arcs (current bounties are singular)
- Per-arc narrative-integration manifests for the 6 NPC arcs (Wraith / Jericho / Seer / Vex / Game Master / Degen)

### 14b.2 Per-episode content release contract

Every mystery episode beat ships **5 deliverables** simultaneously:

| deliverable | source | status today |
|---|---|---|
| **Beat narration** | `episodeMysteries.ts` per-episode authored prose | NEW |
| **1 song unlock** | from existing 118-track catalog, mapped per beat | EXISTS — needs per-beat mapping |
| **1 slideshow** | Album 1 ✓ full; Albums 2-5 needs slicing | PARTIAL — Album 1 ready; PR2 binds Album 1 to Wraith arc; Albums 2-5 sliced as needed by Jericho/Seer/Vex/etc. arcs |
| **2-5 Loredex unlocks** | from 254-entry catalog; new entries authored where missing | EXISTS — extend `transmissionLoredexUnlocks.ts` pattern |
| **1-3 conspiracy board threads** | Authored in the arc's narrative-integration manifest (section 6 — `<arcId>_CONSPIRACY_NODES` + `<arcId>_CONSPIRACY_EDGES`); rendered by the existing `CADESConspiracyBoard.tsx` pattern via `SagaConspiracyBoard.tsx` | DATA AUTHORING — no new component |

The episode definition in `episodeMysteries.ts` carries five fields encoding the bundle:

```ts
interface EpisodeContentBundle {
  songId: string;                 // album track id (e.g. "album1.t19" = "The Syndicated")
  slideshowId: string;            // matches songId by convention
  loredexUnlocks: LoredexEntryId[];     // 2-5 entries unlocked at episode close
  conspiracyDiscoveries: string[];      // arc-conspiracy-node ids that flip from undiscovered → discovered
  bountyContractIds?: string[];         // bounties from the arc's BountyContract list this beat opens
  npcMessageIds?: string[];             // NPCMessage ids dropped on episode close (existing `ASYNC_NPC_MESSAGES` shape)
  memoryReplayId?: string;              // for flashback episodes (Wraith E4 Eighth Death; Jericho E2 Akai Shi) — references existing MemoryReplay registry
  dropAt: "episode_open" | "episode_mid" | "episode_close";  // when in the beat does the song drop
}
```

The `EpisodeContentBundle` is **part of the canon contract**: a beat without a bundle is incomplete.

### 14b.3 Wraith Calder arc — content map

| Episode | Beat | Song (Album / Track) | Slideshow | Loredex unlocks | Board threads added |
|---|---|---|---|---|---|
| **E1 "The First Death and the Crystalline City"** | Investigation of Wraith's Epoch-1 death by the Host invasion | **"The Beginning of the End"** (Silence in Heaven sih-end-of-epoch1; tied to existing `ep1-15` transmission canon) | needs slicing (PR3) | `entity_wraith_calder`, `entity_76` The Host, `entity_69` The City, `event_host_invasion` | Wraith ↔ The Host (motive-for); Wraith ↔ The City (places-at); Wraith ↔ Crystalline Harmonic (corroborates) |
| **E2 "The Stolen Protocols"** | Resurrection technology Wraith expropriated | **"Wake Up"** (album1.t23, Dischordian Logic Act 3) | ✓ Album 1 ready | `concept_resurrection_protocols`, `entity_syndicate_of_death`, `event_protocol_theft` | Wraith ↔ Syndicate of Death (contradicts/expropriated); Resurrection Protocols ↔ Substrate-N from synthesisChamber.ts (corroborates) |
| **E3 "The Six Immortal Twins"** | Syndicate of Death structure; The Word + The Silence interrogation | **"The Syndicated"** (album1.t19, Dischordian Logic Act 3) — direct title hit | ✓ Album 1 ready | `entity_word_silence` Information Twins, `concept_six_immortal_twins`, `event_fair_trade` (the questline this echoes) | Word/Silence ↔ Syndicate (members-of); Wraith ↔ each twin (hunted); 7-Omega Clearance ↔ memory imprint (fair trade) |
| **E4 "The Eighth Death"** | The Sanctuary's Final Rite | **"Last Words"** (album1.t28, Dischordian Logic Act 5 finale) — Engineer's execution as thematic parallel for the body-consuming rite | ✓ Album 1 ready | `concept_final_rite`, `entity_thalorian_vessel`, `event_eighth_death`, `concept_consciousness_continuity` | Bounty Hunter Wraith ↔ Hierophant Wraith (succession); Final Rite ↔ Sanctuary (places-at); Resurrection Protocols ↔ Final Rite (technology-source-of) |
| **E5 "The Herald's Vigil"** | Hierophant's daily-names ceremony; player inscribes a name | **"Silence in Heaven"** title track (Silence in Heaven sih-tt) — vigil/ceremony tonal match | needs slicing (PR3) | `entity_hierophant_wraith`, `concept_347000_names`, `concept_oracle_awaited` (Oracle as awaited, not investigable per `the_oracle.md:604` canon), `entity_word_silence` (re-cast post-deduction) | Hierophant Wraith ↔ Oracle (herald-of); 347,000 Names ↔ Shadow Tongue Edits (counter-narrative); Akai Shi inscription option ↔ **Jericho arc Episode 5** (cross-arc cliffhanger thread) |

### 14b.4 Jericho Jones arc — content map

| Episode | Beat | Song (Album / Track) | Slideshow | Loredex unlocks | Board threads added |
|---|---|---|---|---|---|
| **E1 "The Recruit"** | Iron Lion training first contact under the Degen | **"Inner Circle"** (album1.t10, Dischordian Logic Act 1) | ✓ Album 1 ready | `entity_jericho_jones`, `concept_iron_lion_callsign`, `entity_degen` (deepened), `concept_heart_of_time` | Jericho ↔ Iron Lion callsign (succession); Jericho ↔ Degen (mediator); Iron-Clad Lions ↔ Insurgency (faction-of) |
| **E2 "Akai Shi"** | Battle of Thaloria killing | **"Identity"** (Book of Daniel 2:47 bod-identity) — Kael/Recruiter identity-chain parallel | needs slicing (PR4) | `entity_akai_shi`, `event_battle_of_thaloria`, `concept_thought_virus_vector`, `concept_mercy_killing` | Akai Shi ↔ Thought Virus (consumed-by); Jericho ↔ Akai Shi (killed); Battle of Thaloria ↔ The Host (continuation-of) |
| **E3 "The Imprint Surfaces"** | Pre-Fall Iron Lion consciousness bleeding through | **"I Am The Eyes That Watch"** (album1.t12, Dischordian Logic Act 2) — observation/presence tonal match | ✓ Album 1 ready | `concept_iron_lion_imprint`, `entity_pre_fall_iron_lion`, `concept_dream_loom_catches`, `concept_imprint_resonance` | Pre-Fall Iron Lion ↔ Jericho (imprint-of); Imprint ↔ Resurrection Protocols (cross-arc thread to Wraith E2); Dream-Loom ↔ Iron Lion Imprint (caught-in) |
| **E4 "Lionism Ethics"** | Iron Lion code vs. Akai Shi killing | **"The Last Stand"** (Book of Daniel 2:47 bod-last-stand) — direct Iron Lion canon song per `loredexSongMap.ts` | needs slicing (PR4) | `concept_lionism_code`, `concept_lion_code_evolution`, `event_veridian_vi`, `concept_pre_fall_post_fall_continuity` | Lionism Code (pre-Fall) ↔ Lionism Code (post-Fall) (evolved-from); Akai Shi killing ↔ both code variants (judged-by) |
| **E5 "The Degen's Commission"** | What Jericho was trained for; Syndicate counter-move | **"Planet of the Wolf"** (album1.t18, Dischordian Logic Act 3) — Thaloria location per `loredexSongMap.ts` | ✓ Album 1 ready | `concept_degens_commission`, `event_syndicate_counter_move`, `concept_iron_lion_operational`, `entity_jericho_operational` | Degen's Commission ↔ Wraith E5 unfinished Syndicate move (completes); Jericho operational ↔ Vex introduction (cross-arc to Vex arc Y2); Akai Shi inscription (from Wraith E5) ↔ Jericho's grief (resolves) |

### 14b.5 Anniversary mystery — Fall of Reality

The 37-track **Silence in Heaven** album is the natural anniversary content vault. Each Anniversary Cycle (yearly Fall of Reality 21d event) releases:
- **Cycle 1** (Year 1): tracks 1-12 (the rising-action 12 — the Fall begins). Slideshow slicing scheduled for PR8 (Anniversary + Prestige evolution).
- **Cycle 2** (Year 2 post-prestige): tracks 13-24 (the apex 12). Recontextualizes Year 1 deductions per Wolf-Among-Us pattern.
- **Cycle 3** (Year 3): tracks 25-37 (the resolution 13). The full musical's dialog scenes are released as cinematic interstitials between mystery episodes.

The anniversary mystery's evidence pile **deepens with each cycle** because the album reveals more song-text (and thus more Loredex unlocks) per year.

### 14b.6 Conspiracy Board — extend the existing CADES pattern (do NOT build new)

**Course correction (2026-05-01)**: a prior pass proposed `CaseConspiracyBoard.tsx` as new. **It already exists.** The Saga ships a complete, mature investigation/conspiracy infrastructure. The Mystery Engine **extends** it; it does not replace it. Honor the pattern. The shipping pieces:

| Existing component | Path | Role | How the engine extends |
|---|---|---|---|
| **`CADESConspiracyBoard.tsx`** | `apps/client/src/components/CADESConspiracyBoard.tsx` (140 lines) | SVG node+edge graph, fixed pinned layout, discovery-gated, edges only render between discovered nodes, "N of M discovered · K verified connections" footer | Generalise the same component to read `<arcId>_CONSPIRACY_NODES` + `<arcId>_CONSPIRACY_EDGES` per active arc; tab between arc boards; preserve the manual-pinned-layout aesthetic |
| **`CADESClueBoard.tsx`** | `apps/client/src/components/CADESClueBoard.tsx` (96 lines) | Filtered clue cards by id-prefix; locked state with discovery-flag hint; connected-bounty linkout; type icon (visual/audio/data/scent/temporal) | Same prefix-filter pattern: `clue_wraith_`, `clue_jericho_`, `clue_seer_`, etc. New clues drop into `INVESTIGATION_CLUES` registry; the board surfaces them automatically |
| **`cadesNarrativeIntegration.ts`** | `apps/client/src/data/cadesNarrativeIntegration.ts` (635 lines, 8 sections) | Single-arc manifest: unlock trigger / tutorial / surveillance lines / crew reactions / NPC ambient / conspiracy nodes+edges / clues / room-dialog additions | **Each NPC arc gets its own `<arcId>NarrativeIntegration.ts` modelled on this template.** Same 8 sections, populated for the arc's beats |
| **`investigationSystems.ts`** | `apps/client/src/game/investigationSystems.ts` (305 lines) | `BountyContract` + `InvestigationClue` + `BestiaryEntry` + `MemoryReplay` + `Augmentation` + `NPCMessage` + `getUnreadMessages()` — the Witcher-3-meets-Cyberpunk-2077 source-of-truth | Extend each registry per arc; do NOT introduce new shapes |
| **`BountyBoardPage.tsx`** | `apps/client/src/game/BountyBoardPage.tsx` | Existing UI page that surfaces all bounties | Mystery-arc bounties auto-surface here once registered |
| **`useNarrativeIntegration.ts`** | `apps/client/src/hooks/useNarrativeIntegration.ts` | React hook composing narrative state across arcs | Extend to compose multiple arc-integrations once §14b ships |
| **`useCadesAmbientLines.ts`** | `apps/client/src/hooks/useCadesAmbientLines.ts` | Ambient-line resolver for CADES-context dialog | Generalise to `useArcAmbientLines(arcId)` — same shape |

**The CADES integration is the canonical reference implementation. Read it before authoring any arc.**

#### What "extending the pattern" means concretely

For each NPC arc (Wraith, Jericho, Seer, Vex, Game Master, Degen), produce one file:
`apps/client/src/data/<arcId>NarrativeIntegration.ts` — modelled exactly on `cadesNarrativeIntegration.ts`. Sections:

1. **Unlock trigger** — analogous to `CADES_DISCOVERY_WHISPER` (`cadesNarrativeIntegration.ts:31`). For Wraith arc: a Hierophant-themed whisper from a relevant NPC unlocks the case file at the right narrative-act gate.
2. **Tutorial** — analogous to `CADES_TUTORIAL` (line 51). For Wraith arc: 6-8 steps walking the player through the case-file UI, the conspiracy board, the deduction panel. ~200 dream tokens / 400 XP / 1 card reward (matches CADES economy).
3. **Surveillance / chorus lines** — analogous to `GAME_MASTERS_SURVEILLANCE` (line 226). For Wraith arc: cryptic Syndicate-of-Death chorus during E1-3, escalating to direct-address from The Word and The Silence in E4-5. Same `cryptic | overt` style toggle.
4. **Crew reactions** — analogous to `CADES_CREW_REACTIONS` (line 367). One reaction per episode beat landing. The existing `CrewReaction` shape (trigger / feedText / moraleEffect / severity / room / category) handles all of these without modification.
5. **NPC ambient lines** — analogous to `CADES_AMBIENT_LINES` (line 471). Per-NPC, per-trust-band, per-context lines that fire when the arc condition is met. Pattern: `{ id, npcId, minTrust, arcCondition, context, text, oneTime? }`. Wraith arc would seed lines on Elara, The Human, Agent Zero, The Antiquarian, The Source — same cast already wired for CADES.
6. **Conspiracy nodes + edges** — analogous to `CADES_CONSPIRACY_NODES` + `CADES_CONSPIRACY_EDGES` (line 548). Each arc declares its own pinned coordinates contributing to a shared canvas. CADES already pins nodes in the 1000×560 viewbox; Wraith arc claims a different region (e.g. left half) and Jericho arc claims another (e.g. lower-right) — composed into one master view that opens by tab per arc but draws cross-arc edges across the full canvas.
7. **Investigation clues** — analogous to `CADES_INVESTIGATION_CLUES` (line 574). Same `{ id, type, room, discoveredBy, title, description, connectedBounty }` shape; same prefix convention (`clue_wraith_*`); same 5-type taxonomy (visual / audio / data / scent / temporal). They normalize into `INVESTIGATION_CLUES` automatically (see `investigationSystems.ts:144-152` — the existing import + `.map()` pattern).
8. **Room dialog additions** — analogous to `CADES_ROOM_DIALOG_ADDITION` (line 615). Per-arc dialog layers added to relevant Living-Ark rooms. The Wraith arc adds layers to the Sanctuary / Comms Array / Cipher Den; Jericho arc adds layers to the Heart of Time / Engineering / Bridge.

#### Existing infrastructure the engine REUSES (no new shapes)

| Shape | Where | Reused for |
|---|---|---|
| `BountyContract` | `investigationSystems.ts:20-38` | Each arc's per-episode investigation bounties (Wraith E2 = "bounty_wraith_resurrection_protocols"; Jericho E2 = "bounty_jericho_akai_shi_killing"). Existing fields cover: postedBy (which NPC opened the case) / investigationSteps / target / reward / difficulty / requiresFlag (the prior episode's completion flag) / timeLimitHours |
| `InvestigationClue` | `investigationSystems.ts:121-131` | All per-beat clues. 5 types cover everything I sketched in §14b: visual / audio / data / scent / temporal. No new types needed. |
| `MemoryReplay` | `investigationSystems.ts:181-194` | **The Wraith Eighth-Death and Jericho Akai-Shi flashback episodes are MemoryReplays.** Owner = the NPC; layered evidence (visual / audio / thermal / data); revelation per replay; trustRequired gate. The existing `MEMORY_REPLAYS` registry already has 3 canonical replays (Elara senate vote / Human promotion / Kael theft of Ark 1047) — adding 6-8 more for the arc flashback beats fits the registry. |
| `BestiaryEntry` | `investigationSystems.ts:160-170` | Syndicate of Death twins / Iron Lion imprint variants / Thoughtborn / etc. — entities the player encounters get bestiary entries with weakness/resistance/discoveryVia. |
| `Augmentation` | `investigationSystems.ts:233-245` | The Final Rite consciousness re-seating could ship as an Augmentation tagged "narrative-only" — the player can mock-install it during Wraith E4 to feel the Hierophant transformation, then uninstall. Or skip. Pattern is in place. |
| `NPCMessage` + `getUnreadMessages()` | `investigationSystems.ts:275-305` | **Each episode beat closes by dropping an `NPCMessage` from the arc's NPC.** Wraith E2 closes with a message from The Antiquarian; Jericho E2 closes with a message from The Degen. Existing `getUnreadMessages()` resolver is flag-gated — episode completion is the flag. |

#### What is genuinely NEW

- **Per-arc integration files** (data, not code) — one `<arcId>NarrativeIntegration.ts` per arc × 6 arcs = 6 files. Each ~600 lines of structured data following the CADES template.
- **`SagaConspiracyBoard.tsx`** (NEW component): a thin wrapper around the existing `CADESConspiracyBoard.tsx` that accepts an `arcId` prop, loads the arc's nodes + edges, and tabs between arcs. The original CADES board can be the first tab; the saga board adds Wraith / Jericho / Seer / Vex / Game Master / Degen tabs as their arcs unlock. **<200 new lines.**
- **Episode beat → integration trigger** glue: a small `episodeRippleService.ts` that, on episode-completion, sets the arc's discovery flag, invalidates the relevant tRPC query (so the existing `CADESConspiracyBoard.tsx` discovery-recompute fires), and queues the `NPCMessage` drop. **<150 new lines.**
- **Per-arc tutorial unlock** (one-off LoreTutorial per arc, modelled on `CADES_TUTORIAL` at `cadesNarrativeIntegration.ts:51-207`).

**Total new code**: ~350 lines + 6 data manifests. Most of the work is **authoring within the established schema**, not building components.

#### Why the pattern is right (and why I shouldn't reinvent it)

The CADES integration is **deliberate**:
- **Manual-pinned layout** — the board is a NARRATIVE artifact (placed by an author), not an auto-laid-out graph. Authorial control over which node sits where is part of the storytelling. Wraith's Hierophant node BELONGS in a specific spot relative to the Oracle node, and an authored placement says that.
- **Discovery-gated nodes + edges** — the player's experience is "the world becomes legible as you investigate." Pre-seeded shared-saga nodes (matrix_of_dreams, game_master, hierarchy_of_damned, xethraal, iron_lion, inception_arks) anchor every player's board so cross-arc edges have stable endpoints.
- **Prefix-filtered clue boards + bounty postedBy** — the same backend registries serve different views; per-arc filtering is a UI concern, not a data-model concern.
- **8-section integration manifest** — the cadesNarrativeIntegration file is a complete, repeatable arc-authoring template. Following it verbatim means each arc ships with the same depth (unlock + tutorial + chorus + crew + NPC + board + clues + room dialog) and the same UX surface area.

The Wolf-Among-Us / Witcher-3 / Disco-Elysium / Telltale references in §1-§4 of the plan are vehicles, not architectures. **The architecture is `cadesNarrativeIntegration.ts`.**

### 14b.7 Loredex extensions — new entries needed

Phase 1 found 254 entries already exist. Audit before authoring:

- ✓ `entity_wraith_calder`, `entity_iron_lion`, `entity_akai_shi`, `entity_jericho_jones`, `entity_oracle`, `entity_word_silence`, `entity_syndicate_of_death`, `entity_76` (The Host), `entity_69` (The City) all exist.
- ✗ NEEDS AUTHORING (best-effort list — verify in PR1 with the audit script):
  - `concept_resurrection_protocols`, `concept_six_immortal_twins`, `concept_final_rite`, `concept_eighth_death`, `concept_347000_names`, `concept_oracle_awaited`
  - `concept_iron_lion_imprint`, `concept_iron_lion_callsign`, `concept_lionism_code`, `concept_lion_code_evolution`, `concept_pre_fall_post_fall_continuity`
  - `concept_heart_of_time` (Degen's vessel), `concept_degens_commission`
  - `event_host_invasion`, `event_protocol_theft`, `event_eighth_death`, `event_battle_of_thaloria`, `event_veridian_vi`, `event_syndicate_counter_move`, `event_fair_trade`

Each new Loredex entry follows the existing schema (`apps/shared/loredexSchema.ts:19-38`). Authoring cadence: **PR2 ships Wraith arc entries; PR3 ships Jericho arc entries.** No PR ships an episode without its Loredex unlocks pre-staged.

### 14b.8 Slideshow slicing — phased plan

Album 1 (Dischordian Logic, 29 tracks × 17 frames avg = 490 frames) is shipped. The other 4 albums need slicing in mystery-arc-aligned order:

- **PR3 (Wraith arc + Anniversary scaffolding)** — slice **Silence in Heaven** tracks 1-3 (the Host invasion / Crystalline City openers used by Wraith E1) + the title track for Wraith E5. Estimated 60 frames.
- **PR4 (Vote-spawned enabled)** — no new slicing.
- **PR5 (Lens system)** — no new slicing.
- **PR6 (Seer + Vex arcs)** — slice **Book of Daniel 2:47** tracks for Jericho arc (Identity, The Last Stand, plus 4 more). Estimated 100 frames.
- **PR7 (Game Master + Degen arcs)** — slice **West By God** (10 tracks) + remaining Book of Daniel for full Jericho coverage. Estimated 100 frames.
- **PR8 (Anniversary + Prestige)** — slice **Silence in Heaven** tracks 1-12 fully. Estimated 200 frames.
- **PR9 (Living Universe pattern mysteries)** — slice **The Age of Privacy** album as an opportunistic content vault (20 tracks ≈ 340 frames).

All slicing follows the existing Album 1 convention (`expansionArt/album1Slideshows.ts`): 3168×1344 cel-shaded anime, PNG→WebP q85, served from `cdn/client-public/art/slideshows/<album>/T<NN>/<file>.webp`.

### 14b.9 Per-beat content drop UX

When an episode beat lands, three surfaces fire in sequence (~3 seconds total):

1. **`ChoiceConsequenceToast` + Loredex discovery banner** — "X will remember that. **N new Loredex entries unlocked.**" (re-uses `DiscoveryNotification` precedent.)
2. **Slideshow auto-pop** — the song's slideshow opens in modal (re-uses Login Transmission auto-pop pattern from commit `c4e63f8`). Player can dismiss or watch through.
3. **Conspiracy board reveal** — discovery flag flips for the new node(s); next time the player opens the case file, those nodes + their edges render per the existing `CADESConspiracyBoard.tsx` reveal pattern (no Witcher-3 snap; the canonical aesthetic is "the world becomes legible as you investigate"). Idempotent — re-opening doesn't re-fire.

Players who skip the slideshow can replay it later from the **Now Broadcasting** surface (extends `transmissionDeck.ts` library; "Now Broadcasting" is a sibling to the existing `transmissions` library, scoped to the player's active mysteries).

### 14b.10 Critical files for music + slideshow + loredex + board integration

**REUSE (canonical existing infrastructure — read before authoring)**:
- `apps/client/src/components/CADESConspiracyBoard.tsx` — node+edge SVG component, fixed layout, discovery-gated
- `apps/client/src/components/CADESClueBoard.tsx` — clue-card filtered board with type icons + locked state
- `apps/client/src/data/cadesNarrativeIntegration.ts` — **the canonical 8-section arc-integration template** (635 lines)
- `apps/client/src/game/investigationSystems.ts` — `BountyContract` / `InvestigationClue` / `BestiaryEntry` / `MemoryReplay` / `Augmentation` / `NPCMessage` shapes + registries
- `apps/client/src/game/BountyBoardPage.tsx` — existing UI page that auto-surfaces new bounties
- `apps/client/src/hooks/useNarrativeIntegration.ts` + `useCadesAmbientLines.ts` — composable hooks (extend rather than fork)

**EXTEND (data authoring against existing schemas)**:
- `apps/shared/loredexSongMap.ts` — add new song↔entry mappings as arcs ship
- `apps/shared/loredex-data.json` — add new entries from §14b.7 list
- `apps/shared/episodeMysteries.ts` (already specified in §10.1) — episode list with `EpisodeContentBundle` field
- `apps/shared/expansionArt/album{2,3,4,5}Slideshows.ts` — slideshow manifests, phased per §14b.8

**NEW (only what existing infrastructure doesn't cover)**:
- `apps/client/src/data/wraithCalderNarrativeIntegration.ts`, `jerichoJonesNarrativeIntegration.ts`, `seerNarrativeIntegration.ts`, `vexNarrativeIntegration.ts`, `gameMasterNarrativeIntegration.ts`, `degenNarrativeIntegration.ts` — one per arc, modelled exactly on `cadesNarrativeIntegration.ts`
- `apps/client/src/components/SagaConspiracyBoard.tsx` — thin wrapper component, <200 lines, tabs between per-arc boards reusing the CADES board pattern
- `apps/client/src/components/SongLyricsPanel.tsx` — case-context-injected LLM lyrics consultation surface
- `apps/client/src/components/NowBroadcasting.tsx` — case-active player's content drops library (extends transmission deck)
- `apps/server/services/episodeRippleService.ts` — orchestrates per-beat surface fire (sets discovery flags, queues `NPCMessage` drops, fires LoreDex unlocks)
- `apps/server/routers/lyrics.ts` (EXTEND) — accept case-context input for thematic generation
- Schema additions: `mysteryEpisodeProgress`, `mysteryDeductions`, `playerEpisodeContentDrops` (audit log of which player saw which content drop). The "edges" table I previously proposed is **not needed** — the existing CADES board reads edges from a static manifest, and the per-player view uses discovery flags to filter visibility.

### 14b.11 Authoring economy

The integration **reduces** Plan 2's authorship cost rather than increasing it. The slideshow art for Album 1 is shipped; the lyric LLM is in place. What's left:

- ~50 new Loredex entries across 6 NPC arcs (≈ 200 words each = 10k words total)
- ~60 conspiracy node + edge declarations across the 6 per-arc narrative-integration manifests (~5 nodes-with-edges per episode × 12 episodes Year 1; authored within the existing `CADES_CONSPIRACY_NODES` / `CADES_CONSPIRACY_EDGES` schema)
- Slideshow slicing for Albums 2-5 is asset-team work, not narrative authoring
- Lyric strategy stays LLM-on-demand (no 118 lyric files needed)

This is an **order of magnitude less** than the 75k narrative-words estimate in §12. The content release schedule rides on existing assets and existing systems — the Mystery Engine just sequences them.

### 14b.12 Telltale lineage for content drops

Telltale shipped a song / soundtrack with each episode that bound to the climax. The Walking Dead's Episode 1 ending "Take Us Back" and Wolf Among Us's "Joker" cue are templates. The Saga has a 118-track catalog already authored — every episode beat picks a track from the existing pool, re-contextualised by deduction. The slideshow + Loredex + conspiracy board are the **visual diary** that makes "Previously, on Dischordian Saga…" feel like a season-of-television.

---

## 14c. Multi-Year Saga Integration — All 5 Albums × 7 Acts × 5 Epochs × 117 Game Functions

§14b shipped Album 1 + Wraith + Jericho arcs. §14c is the **whole-saga vehicle**: every album, every act, every epoch, and every game function carrying the mystery engine forward. The universe should feel updates everywhere — not just in the case file.

### 14c.1 The canonical saga lattice (per Phase 1 deep explore)

**5 albums × 7 acts × 5 epochs are not parallel — they interlock.** The lattice:

| Album | Tracks | Era / Epoch | Acts served | Narrative role | Endgame mystery seeded |
|---|---|---|---|---|---|
| **Dischordian Logic** | 29 | Age of Privacy → Rise of Insurgency (ep0) | Acts 1-2 | Birth of resistance; Engineer's execution | Engineer's "Last Words" coded transmission |
| **The Age of Privacy** | 20 | Empire → Insurgency Birth (ep0 mid/late) | Acts 1-2 | Surveillance state; Panopticon; Thought Virus deployment | The Architect's true name |
| **The Book of Daniel 2:47** | 22 | Age of Prophecy (ep1) | Acts 3-4 | Oracle's visions; Iron Lion's sacrifice; prophecy circulates | The Iron Lion's eighth life; the Akai Shi proof |
| **West By God** | 10 | Age of Insurgency (ep2) | Acts 5-6 | Two Witnesses rising (Programmer + Enigma); broadcast hack | The Antiquarian = Programmer? (per westByGodTracks T09 "fake my own death" hint) |
| **Silence in Heaven** | 37 | Age of Revelation → Fall of Reality (ep3-ep4) | Acts 6-7 + endgame | Full musical: 18 songs + 19 dialog scenes; 4 internal acts (Warning / Judgment / Reckoning / Epilogue) | The Fall itself; the Oracle's revelatory return |

**Acts** (per `acts2to7Opponents.ts`): 7 narrative acts. Act 1 = Memoir-in-12-battles (3 cycles: Kindergarten of Gods / Mechronis Academy / Nexon-Zenon). Acts 2 + 5 = structural interludes. Act 3 = 3 substrate-access opponents (Echo / Archivist / Warden). Act 4 = 3 path-gated reveal battles. Act 6 = 2 confession-side mirrors. Act 7 = 4-boss convergence finale.

**Epochs** (per `epochWitnessVotes.ts:3`): 5 ages × 6 votes each (5 spawn votes + 1 epoch closer) = 30 votes total at canonical full population. Epoch 0 + Epoch 1 fully authored; Epochs 2-4 have schema slots awaiting content (`age_of_insurgency`, `age_of_revelation`, `fall_of_reality`).

### 14c.2 Multi-year content release calendar (5 years)

The mystery engine drives a **5-year content release**. Each year = one full album cycle, one or more arcs from §7, and the epoch advances. The Saga ages with the player.

| Year | Album cycle | Epoch state | Acts unlocked | Mystery arcs (NPC) | Mystery anchors (Antiquarian + community) | Endgame revelation |
|---|---|---|---|---|---|---|
| **Y1** | Album 1 (Dischordian Logic) — 29 tracks shipped | ep0 active; ep0 closer voted | Acts 1-2 | Wraith Calder (M1-5); Jericho Jones (M7-11); cross-arc cliffhanger M12 | "What Was Lost in the Fall" anniversary M6 (Silence-in-Heaven openers) | Engineer's coded final transmission decoded |
| **Y2** | Album 2 (The Age of Privacy) — 20 tracks sliced | ep0 closes; ep1 opens | Act 3 unlocks | The Seer (M1-5); Vex Solène (M7-11); cross-arc M12 | Y1 anniversary deepens (SIH tracks 13-24) | The Architect's true name surfaces |
| **Y3** | Album 3 (The Book of Daniel 2:47) — 22 tracks sliced | ep1 active; ep1 closer voted | Act 4 unlocks | The Game Master (M1-5); The Degen (M7-11); cross-arc M12 | Y2 anniversary deepens (SIH tracks 25-37) | Akai Shi's prophecy fulfilment |
| **Y4** | Album 4 (West By God) — 10 tracks sliced | ep2 active; ep2 closer voted | Acts 5-6 unlock | Year-of-Witnesses arc (Programmer + Enigma double-arc, 5+5 episodes) | Two-Witnesses Prophecy fulfilment cycle | Antiquarian's identity reveal |
| **Y5** | Album 5 (Silence in Heaven) — 37 tracks sliced (full musical) | ep3 closes; ep4 opens (Fall of Reality) | Act 7 + endgame | Oracle's Revelatory Return arc (substrate-only — anti-arc, the awaited Oracle finally manifests through dream/memory/cinematic-exception channels per `the_oracle.md:604`) | Fall of Reality anniversary becomes the LIVE final season; community-resolved | The Fall itself — community-determined ending |

**Year 6+** = post-Fall content (the Living Universe persists; each player's version of the Fall is canon for them; community-aggregate Fall is canon for the Chronicle).

### 14c.3 Per-album content authoring roadmap

#### Album 1 — Dischordian Logic (Year 1, shipped)
✓ Slideshows complete (490 frames); ✓ track manifest in `expansionArt/album1Slideshows.ts`; ✓ Wraith arc + Jericho arc map directly to Album 1 tracks T10/T12/T18/T19/T23/T28 (per §14b.3-4).

#### Album 2 — The Age of Privacy (Year 2 PR cycle)
**New file**: `apps/shared/ageOfPrivacyTracks.ts` (template: `westByGodTracks.ts` lines 16-51). Each of 20 tracks gets:
- ID, title, runtime
- Era anchor (Empire → Insurgency Birth)
- NPC referenced (Architect, Politician, Empire functionaries — surveillance-era figures)
- Act position (Acts 1-2 sub-beats)
- Mystery beat assigned (Seer arc / Vex arc / Y2 anniversary)
- Loredex unlocks
- Conspiracy board threads

**New file**: `apps/shared/expansionArt/album2Slideshows.ts` (template: `album1Slideshows.ts`). 20 tracks × ~17 frames = ~340 frames. Asset slicing PR8 + PR9.

**Mystery anchors**:
- Seer arc E1-E5 mapped to AoP tracks dealing with prophecy precedent (the Seer is the Oracle's predecessor in the surveillance era; her prophecies were *recorded against her will* by the Empire)
- Vex arc E1-E5 mapped to AoP tracks about Engineering Zero and the Empire's R&D division
- The Architect's true name (Y2 endgame revelation) requires correctly decoding 3 specific AoP tracks (player evidence-board work)

#### Album 3 — The Book of Daniel 2:47 (Year 3 PR cycle)
**New file**: `apps/shared/bookOfDanielTracks.ts` (template: `westByGodTracks.ts`). 22 tracks. Era: Age of Prophecy (ep1).

**Already mapped** (per `loredexSongMap.ts`):
- "The Last Stand" → entity_iron_lion (canonical)
- "Identity" → Kael identity-chain (canonical, used in Jericho E2 already)

**Mystery anchors**:
- Game Master arc E1-E5 — the dead-AI's recovered logs; Book of Daniel tracks about prophecy *recordings* (the AI is a prophecy that recorded itself before its medium died)
- Degen arc E1-E5 — Ne-Yon casino debt to a Hierarchy demon; Book of Daniel tracks about chosen-by-prophecy figures (the Degen was prophesied as a casino king before he knew what gambling was)
- Akai Shi's prophecy fulfilment (Y3 endgame revelation) ties back to **Jericho arc Y1** (the killing was prophesied; Jericho's grief was prophesied; the imprint was prophesied) — Wolf-Among-Us recontextualisation pattern

**New file**: `apps/shared/expansionArt/album3Slideshows.ts`. 22 × 17 = ~374 frames.

#### Album 4 — West By God (Year 4 PR cycle)
✓ Track manifest exists at `apps/shared/westByGodTracks.ts:16-51` (10 tracks fully spec'd).
- T01 → Programmer pre-contact
- T09 → "Exit stage left, fake my own death" (the Antiquarian-identity hint per `westByGodTracks.ts:46`)
- T10 → epilogue

**Mystery anchors**:
- **Year of the Witnesses**: instead of two single-NPC arcs, Y4 is a **double-arc** (Programmer + Enigma each get 5 episodes; episodes alternate weeks). Per West-By-God canon, they ARE the Two Witnesses. The mystery is whether they survive activating the broadcast infrastructure that lets the Insurgency reach the Empire's whole population.
- **Antiquarian identity reveal** (Y4 endgame): the player decodes T09 + cross-references with the Antiquarian's Journal entries. If decoded, the Programmer = Antiquarian reveal lands; if not, the Y5 anniversary holds it open. Both paths are canon-compatible.

**New file**: `apps/shared/expansionArt/album4Slideshows.ts`. 10 × 17 = ~170 frames.

#### Album 5 — Silence in Heaven (Year 5 PR cycle)
✓ Track manifest exists at `apps/shared/silenceInHeavenTracklist.ts:26-44, 98-141`. 37 tracks: 18 songs + 19 dialog scenes. 4 internal acts (Warning T1-3 / Judgment T4-11 / Reckoning T12-17 / Epilogue T18). Narrators: Antiquarian + Malkia/Storyteller (per `silenceInHeavenNarrators.ts`).

**Mystery anchors**:
- **Oracle's Revelatory Return** (anti-arc): the Oracle does NOT investigate. The Oracle *manifests* — once, through dream-substrate, once through memory-residue, once through cinematic-exception (per `the_oracle.md:604` 3-channel canon). Each manifestation drops 6-7 SIH tracks of revelation. Players assemble the Oracle's message across the year.
- **Fall of Reality LIVE** (Y5 anniversary): the anniversary stops being commemorative and becomes the live final season. Community vote shapes how the Fall lands. SIH's 19 dialog scenes are the cinematic interstitials between Live Fall episodes.
- **The Saga Ends — and Continues**: Y5 closes ep3 → ep4 (Fall of Reality). Year 6+ is post-Fall — the Living Universe persists; player choices become each player's canon Fall.

**New file**: `apps/shared/expansionArt/album5Slideshows.ts`. 37 × 17 = ~630 frames (the largest single-album slicing job).

### 14c.4 Game-function narrative integration — all 117 routers

Per Phase 1 deep explore: 117 routers exist; ~30 have HIGH narrative integration; ~40 MEDIUM; ~47 NONE. The mystery engine raises the floor. **Every game function gets a narrative tie-in — even if the tie is shallow.** Patterns by integration depth:

#### Pattern A — DEEP (the function is a mystery surface)
The function ITSELF carries mystery beats. Affected routers: `storyMode.ts`, `cardGame.ts`, `dailyBrief.ts`, `transmissions.ts`, `loreJournal.ts`, `npc.ts`, `companion.ts`, `epochWitness.ts`, `dailyQuests.ts`, `livingUniverseEvents.ts`, `prestige.ts`, `ark.ts`, `memoryEnergy.ts`, `dreamsWorkshop.ts`, `eidolonBond.ts`, `silenceInHeavenLore.ts`, `antiquariansJournal.ts`.

Already deep — extend with:
- Active-mystery banner on Daily Brief
- Companion lines that reference active arc beats
- TCG drafts where pack contents bias toward currently-active mystery arcs (canonical: an Insurgency draft in M7-11 of Y1 weights Jericho-tagged cards higher)
- Epoch witness votes seeded by the year's active mystery convergence

#### Pattern B — MEDIUM (the function is decorated by mystery)
The function isn't itself a mystery, but it's RESKINNED per active arc. Affected routers: `tradeEmpire.ts`, `marketplace.ts`, `prestigeQuests.ts`, `crafting.ts`, `companion.ts` (medium depth), `bossMastery.ts`, `seasonalEvents.ts`, `outbreak.ts`, `deadMansCircuit.ts`, `personalQuarters.ts`, `factions.ts`, `classMastery.ts`.

Reskinning per arc:
- **Trade Empire**: contracts named for and themed by current arc (e.g. "Resurrection Protocol Components" contracts during Wraith E2)
- **Marketplace**: limited-time epoch artifacts (cosmetics tagged to the active album track)
- **Crafting**: recipes unlocked by mystery progression (the Final Rite vessel ingredient list opens after Wraith E4)
- **Boss Mastery**: bosses gain dialog lines about the active arc (the Iron Lion boss references his imprint awakening during Jericho E3)
- **Seasonal Events**: 6-event-categories rotation seeded by the year's mystery cadence (combat events spawn near combat-themed beats; lore events spawn near revelation beats)

#### Pattern C — SHALLOW (the function gets a narrative wrapper)
The mechanic is unchanged but the *flavor text + UI copy + sound effects* shift per arc. Affected routers: `casino.ts`, `pvp.ts`, `chess.ts`, `chessClimb.ts`, `chessPuzzle.ts`, `towerDefense.ts`, `medbay.ts`, `essenceHarvest.ts`, `inventory.ts`, `collection.ts`, `notifications.ts`, `announcements.ts`, `guild.ts`, `guildWars.ts`, `pets.ts`, `social.ts`, `vortexIncursion.ts`, `marketAchievements.ts`.

Wrapper examples:
- **Casino**: slot reels' symbol set rotates per arc (Syndicate-of-Death twins as wild symbols during Wraith E3); blackjack table dealer flavor lines reference the active mystery
- **Chess Climb**: opponent names + portraits rotate per arc (the climb in Wraith arc M3 is a "Six Twins Tournament" — six opponents named for the immortal twins)
- **PvP Arena**: ladder seasons named per arc ("Iron Lion Trials" during Jericho E4)
- **Tower Defense**: wave themes per arc ("Panopticon Defense Drills" during Vex arc; "Host Invasion Reenactment" during Wraith E1)
- **Medbay**: pet healing dialog reflects the active arc ("your eidolon dreams of Akai Shi" during Jericho E2)
- **Inventory / Collection**: item descriptions auto-rewrite to weave in arc context (the same potion flavor-text different in M1 vs M5)
- **Achievements**: monthly achievement set named per arc ("Witness of the Eighth Death" during Wraith E4 month)

#### The "shallow wrapper system" — `apps/shared/arcFlavorPack.ts` (NEW)
Centralised arc-flavor packs. One per active arc per month. Each pack:
```ts
interface ArcFlavorPack {
  arcId: MysteryArcId;
  monthRange: [number, number];     // M-of-year window
  casinoSymbols?: string[];          // slot reel symbols
  chessOpponentSet?: ChessOpponent[]; // 6 themed opponents
  pvpSeasonName?: string;
  towerDefenseWaveTheme?: string;
  medbayDialogPool?: string[];
  inventoryFlavorOverrides?: Record<ItemId, string>;
  achievementSetName?: string;
  marketplaceCosmeticTags?: string[];
}
```
Loaded at session start; consumed by each Pattern-C router via `getActiveArcFlavor(now)`. Authoring a pack is **30 minutes of writing per arc-month**. 12 arc-months × 5 years = 60 packs total — manageable.

### 14c.5 The "Universe Feels Updates" ripple system

Per Phase 1: every surface that announces content already exists. The mystery engine *coordinates* them. When an episode beat lands, **all 14 ripple surfaces fire in canonical sequence** (at most ~5 seconds of UX, designed to FEEL like a living world reacting):

| # | Surface | Existing source | Per-beat fire |
|---|---|---|---|
| 1 | Daily Brief | `dailyBrief.ts` | Today's brief leads with the new beat's framing |
| 2 | Login Transmission | `transmissions.ts` autoplay | Beat's song slideshow auto-pops post-login |
| 3 | Title Screen Announcement | `announcements.ts` | "Episode N — '<title>' broadcasting now" |
| 4 | Now-Playing UI | `lyrics.ts` + music registry | Track + Loredex sidebar lights up |
| 5 | Loredex Discovery Banners | `loreJournal.ts` | "N new entries unlocked" |
| 6 | Achievement Unlock | `cardAchievements.ts` | Beat-themed achievement available |
| 7 | NPC Dialog Reaction | `npc.ts` reactToEvent | Companion + 2-3 nearest NPCs have new lines |
| 8 | Antiquarian's Journal | `antiquariansJournal.ts` | New journal annotation auto-unlocks |
| 9 | Sidebar Notifications | `notificationRouter.ts` | Mystery-engine notification |
| 10 | Music Player Slideshow | `songSlideshow.ts` | Beat's slideshow added to library |
| 11 | Living Universe Event Pop | `livingUniverseEvents.ts` | Beat-aligned pressure event spawns |
| 12 | Seasonal Event Ticker | `seasonalEvents.ts` | Beat-aligned event added to ticker |
| 13 | Faction Reputation Ticker | `potentialFactions.ts` | Trust deltas from beat propagate |
| 14 | Conspiracy Board Reveal | `CADESConspiracyBoard.tsx` pattern (existing — see §14b.6 course-correction) | New nodes + edges become visible per the existing discovery-gated reveal (no Witcher-3 snap; honor the established aesthetic) |

**Sequencing**: orchestrated by `apps/server/services/episodeRippleService.ts` (NEW). Idempotent (re-login doesn't re-fire surfaces 1-12). Player-respecting (settings can suppress 4-13 if too noisy; surfaces 1-3 + 14 always fire).

### 14c.6 The 5 endgame revelations — multi-year payoff

Each year's mystery arc work earns one **canonical revelation**, payable at the year-end SeasonRollUp. These revelations are the *spine* of the multi-year saga:

1. **Y1 — Engineer's Coded Last Words.** The Engineer's execution (T28 "Last Words", canonical Album 1 finale) is decoded. The decode requires player completion of Wraith arc + Jericho arc cross-link AND M12 anniversary participation. Reveals: which faction the Engineer was actually serving in his final moments. Three player-divergent decodes possible.
2. **Y2 — The Architect's True Name.** Surveillance-era figure unmasked via correctly-decoded AoP tracks. Reveals: the Architect of the Panopticon and the Architect of New Babylon are not the same entity (or are the same — community-vote determined).
3. **Y3 — Akai Shi's Prophecy Fulfilment.** Recontextualises Y1 Jericho killing as prophesied + sanctified. Wolf-Among-Us deeper-truth pattern. Reveals: Akai Shi consented before the Thought Virus took her; the killing was a contract.
4. **Y4 — The Antiquarian's Identity.** Programmer = Antiquarian per West-By-God T09 hint. The Antiquarian's Journal is read in the Programmer's voice for the rest of the saga.
5. **Y5 — The Fall of Reality.** Community-determined. Each player's Fall is their canon; the community-aggregate Fall enters the Chronicle. The Oracle finally returns (substrate-only manifestation — dream / memory / cinematic-exception). The 5-year saga closes; Y6+ is post-Fall living-universe content.

### 14c.7 The Antiquarian thread — the through-line

The Antiquarian's Journal (`antiquariansJournal.ts`) annotates every transmission and every epoch closer. Currently entries `ep0-N` and `ep1-15+` exist. The mystery engine **extends the Journal year-over-year** in lockstep with the album cycles:

- Y1: extend journal with `ep1-16` through `ep1-25` (Wraith arc + Jericho arc beats annotated as the Antiquarian witnesses them)
- Y2: extend journal with `ep2-1` through `ep2-25` (Age-of-Privacy era retrospectives + Seer/Vex arc annotations)
- Y3: extend journal with `ep3-1` through `ep3-25` (Age-of-Prophecy + Game-Master/Degen)
- Y4: extend journal with `ep4-1` through `ep4-15` (Age-of-Insurgency + Two-Witnesses; Antiquarian voice begins to slip — readers should suspect his identity by Y4 mid)
- Y5: journal becomes UNRELIABLE NARRATOR — entries written by the Programmer-as-Antiquarian explicitly admit themselves; Y5 entries can be read in two voices (Antiquarian-public / Programmer-private). Player toggles the voice.

This is the **single most efficient narrative-integration mechanism** in the saga: one shared file (`antiquariansJournal.ts`) carries the through-line across every album, every act, every arc, every year.

### 14c.8 Faction lens × all 5 years

Per §6 (Lens System), each player picks a faction lens. The lens **persists across years** but gains depth per album:

- Insurgency lens: Y1 reads Wraith as expropriator; Y2 reads Seer as outlaw-prophet; Y3 reads Game-Master as recovered comrade; Y4 reads Two Witnesses as the cause's apex; Y5 reads the Fall as liberation accomplished or betrayed.
- Hierarchy lens: same beats, opposite valence.
- Thaloria lens: religious continuity through all 5 years; the Hierophant arc (Y1) is the foundation; the Oracle's Y5 return is the apotheosis.
- Quarchon / Dreamer / etc.: each lens gets a 5-year arc-of-arcs.

Lens-specific Loredex pages, banded VO, and conspiracy-board edges are authored once per arc-per-lens and **stored as deltas** (the base arc + the lens overlay = the player's experience). Authoring economy: 6 lenses × 12 arc-months × 5 years = 360 deltas, each ~5 minutes — large but tractable, and most of the work is reskinning existing prose.

### 14c.9 Phased rollout — extended to multi-year

§13 covered Y1 PRs 1-9. The multi-year extension:

**Year 2** (PRs 10-18):
- PR10: Album 2 track manifest authored (`ageOfPrivacyTracks.ts`)
- PR11: Album 2 slideshow slicing (~340 frames)
- PR12: Seer arc (5 episodes); Y2 Loredex unlocks (~30 entries)
- PR13: Vex arc (5 episodes); Y2 cross-arc cliffhanger
- PR14: Y2 anniversary (deepens Y1 anniversary; SIH 13-24 sliced)
- PR15: ep0-closer vote authored + ep1-opener vote authored (advances epoch state)
- PR16: Pattern-C arc-flavor packs for Y2 (12 packs)
- PR17: Antiquarian's Journal Y2 extension (~25 entries)
- PR18: Architect's Name endgame revelation surface

**Year 3** (PRs 19-27): same shape, Album 3 / Game-Master + Degen arcs / Akai Shi recontextualisation
**Year 4** (PRs 28-36): Album 4 / Two-Witnesses double-arc / Antiquarian identity reveal / Y4 epoch-closer
**Year 5** (PRs 37-45): Album 5 (largest slicing job) / Oracle Revelatory Return / Live Fall anniversary / saga conclusion

**Total over 5 years**: ~45 PRs, ~1700 frames sliced, ~150 Loredex entries authored, ~60 arc-flavor packs, ~125 Antiquarian journal entries, ~360 lens-overlay deltas, 5 endgame revelations. Rate: ~9 PRs/year ≈ 1 PR every 6 weeks — sustainable for a 1-3 person narrative team.

### 14c.10 Critical files for multi-year integration

- `apps/shared/ageOfPrivacyTracks.ts`, `bookOfDanielTracks.ts` (NEW — track manifests for Albums 2-3; templates: `westByGodTracks.ts`, `silenceInHeavenTracklist.ts`)
- `apps/shared/expansionArt/album{2,3,4,5}Slideshows.ts` (NEW — slideshow manifests, phased per §14c.3)
- `apps/shared/arcFlavorPack.ts` (NEW — Pattern-C wrapper definitions)
- `apps/server/services/episodeRippleService.ts` (NEW — orchestrates the 14-surface ripple per §14c.5)
- `apps/server/services/arcFlavorService.ts` (NEW — `getActiveArcFlavor(now)` resolver consumed by Pattern-C routers)
- `apps/shared/antiquariansJournal.ts` (EXTEND year-over-year — the through-line)
- `apps/shared/silenceInHeavenLore.ts` + `silenceInHeavenNarrators.ts` (EXTEND — Y5 live-Fall anniversary uses the dual-narrator structure)
- `apps/shared/epochWitnessVotes.ts` (EXTEND — populate ep1-closer through ep4-closer + spawn votes for ep2/3/4)
- `apps/shared/transmissions.ts` (EXTEND year-over-year — episodic content for ep2/3/4)
- `apps/shared/loredexSongMap.ts` (EXTEND year-over-year — every new song↔entry mapping)
- `apps/shared/loredex-data.json` (EXTEND year-over-year — ~30 entries per year)
- Per-arc `<arcId>NarrativeIntegration.ts` files (NEW per §14b.6 — modelled on `cadesNarrativeIntegration.ts`; includes per-arc conspiracy nodes + edges in section 6 of the manifest, NOT a separate `mysteryConspiracyThreads.ts` registry)
- Lens overlay files (NEW — `apps/shared/lensOverlays/<lens>/<arcId>.ts` × 6 lenses × 12 arcs × 5 years; structured as deltas)

### 14c.11 Authoring economy — multi-year totals

| Asset | Y1 | Y2 | Y3 | Y4 | Y5 | Total |
|---|---|---|---|---|---|---|
| Episodes | 12 | 12 | 12 | 12 | 12 | 60 |
| Album-tracks integrated | 29 | 20 | 22 | 10 | 37 | 118 (full corpus) |
| Slideshow frames sliced | 0 (Album 1 ✓) | 340 | 374 | 170 | 630 | 1514 |
| New Loredex entries | 50 | 30 | 30 | 30 | 30 | 170 |
| Antiquarian journal entries | 25 | 25 | 25 | 15 | (live) | 90+ |
| Arc-flavor packs | 12 | 12 | 12 | 12 | 12 | 60 |
| Lens-overlay deltas | 72 | 72 | 72 | 72 | 72 | 360 |
| Epoch closers / spawn votes | 0 | 6 | 6 | 6 | 6 | 24 |
| Endgame revelations | 1 | 1 | 1 | 1 | 1 | 5 |

This is the **whole-saga vehicle**: every album integrated, every act served, every epoch advanced, every game function (117 routers across Patterns A/B/C) carrying the narrative forward, every ripple surface coordinated, every year advancing the lattice. The mystery engine is the **operating system** for the Saga's content release for the next half-decade.

---

## 15. Top 5 critical files to land first

When PR1 begins:

1. `/home/user/dischordian-saga/apps/shared/episodeMysteries.ts` (NEW — canonical authoring surface; every NPC arc, episode, deduction graph, suspect graph, lens definition)
2. `/home/user/dischordian-saga/apps/server/services/mysteryService.ts` (NEW — episode lifecycle, vote-closure compilation, deduction validation; orchestration brain)
3. `/home/user/dischordian-saga/apps/shared/mysteryTemplates.ts` (NEW — vote-seed compilers; load-bearing integration with `epochWitnessVotes`)
4. `/home/user/dischordian-saga/apps/db/schema.ts` (EXTEND — 6 new tables + `epochVoteTallies.expiresAt`; the durable state floor)
5. `/home/user/dischordian-saga/apps/shared/roomMysteries/_template.ts` (EXTEND — `interrogate` verb + `mysteryBinding` field; the contract every existing 34 room-mystery module reads against)
