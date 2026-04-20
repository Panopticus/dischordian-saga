# Prelude Systems — UX / UI Interaction Spec

Applies to all 11 interactive systems the Prelude drives across the 10
opening rooms. Companion to `AAA_AUDIT_REPORT.md`.

## Doctrine

Every interaction is **diegetic**. No floating UI chrome. No popup modals.
No HUD panels pinned to the viewport corners. All hover / active / success
feedback is painted by the VFX layer
(`apps/client/src/components/prelude/vfx/PreludeVfxOverlay.tsx`) directly
onto the anchor object inside the room backdrop.

Tutor text, when needed, appears on a **brass placard** that reads as a
ship-sign — part of the room, not part of the interface. Dialog lines use
the existing Elara / NPC speech-bubble convention already established in
`apps/client/src/game/roomDialogs.ts`.

## Uniform State Machine

Every anchor runs the same five-state state machine:

| State | Visual | Audio | Source |
|-------|--------|-------|--------|
| `idle` | 40% breathing glow at the anchor's native color, 2 s sine loop | — | `vfx_hotspot_idle_<color>` |
| `hover` | Anamorphic edge-glint on the anchor; cursor morphs to brass reticle; tutor placard fades in beside anchor (first-time only) | Soft color-coded chime (cyan = awaken, amber = pip, red = distortion pop, violet = wrongness, green = standby) | `vfx_hotspot_hover_glint` + `preludeSystemTutors.ts` |
| `active` | Anchor brightens to 100%; scene desaturates to ~60%; fog condenses around anchor | Beat-specific VO starts | existing per-beat VFX |
| `success` | One-shot bloom (`diploma-ink-bloom`, `lockbox_bio_recognize`, etc.); anchor dims to 20% "examined" | Resolve chime | existing per-beat VFX |
| `examined` | Anchor remains dim; hover response suppressed; prevents re-trigger | — | `vfx_hotspot_examined_dim` |

## Native Color → Chime Mapping

| Color | Use | Idle VFX ID | Chime tone |
|-------|-----|-------------|------------|
| Cyan `#22d3ee` | Most Ark systems (dialog, inbox, map, dummies, stations) | `vfx_hotspot_idle_cyan` | Soft awaken |
| Amber `#fbbf24` | Thematic signals (pet capsule, Free Ports seal, tarot lamp, inbox counter) | `vfx_hotspot_idle_amber` | Warm pip |
| Corrupted red `#cc2244` | Human-signal panel only | `vfx_hotspot_idle_red` | Distortion pop |
| Violet (Vortex) | Vortex rift in observation-deck dome | `vfx_hotspot_idle_violet` | Low wrongness hum |
| Foxfire green `#00e676` | Engineer workbench station | `vfx_hotspot_idle_green` | Standby click |

## Per-System Interaction

### 1. Dialog / Elara
- **Anchor:** Elara holo-pip, right-rail (92% / 18%) in every room.
- **Click:** opens existing Elara dialog choices from `roomDialogs.ts`.
- **Diegetic read:** the pip is Elara's projection node — clicking "talks to Elara," consistent with every room.
- **No tutor placard** (Elara is the ambient interface; she doesn't need one).

### 2. Crew Role Choice (Beat C) — engineering
- **Anchors:** three workbench tool-stations (Engineer 30%/62%, Assassin 50%/62%, Oracle 70%/62%).
- **Hover:** station's pip brightens; tutor placard appears (`preludeSystemTutors.ts::CREW_ROLE_TUTOR`, first-time only).
- **Click:** winning station pulses gold; the other two dim to 10%. Pod sight-line aligned behind each station lights in sympathy.
- **Commit:** `prelude_tutor_crew_role_seen` + role flag raised.

### 3. Mission Board / Trading (Beat D) — cargo-hold
- **Anchor:** dockmaster ledger-console (32% / 68%) beside the Free Ports hero crate.
- **Click:** the console's recessed surface projects three mission-slate silhouettes in cyan line-art directly onto the crate's upper face (diegetic — the crate is the quartermaster's notice board).
- **Tutor:** `MISSION_BOARD_TUTOR` (Locke) first-time only.
- **Read-all-three → accept:** hero crate's bronze seal warms one notch (amber → brighter amber); ledger-console pip flips cyan-pulsing → cyan-steady.

### 4. Flashback Hotspots (Beat E) — mess-hall
- **Anchors:** toy soldier (28% / 68%), framed diploma (66% / 42%).
- **Behavior unchanged** from `beatEHotspots.ts`; sepia-drain on active, Prince VO, one-shot bloom on diploma.

### 5. Biometric Lockbox (Beat F) — mess-hall
- **Anchor:** strongbox (22% / 50%) on Prince's Archive center shelf.
- **Hover:** lock shifts dim cyan → bright cyan; tutor placard (`LOCKBOX_TUTOR`) first-time only.
- **Click:** palm-print flicker (cyan), lock pulses, then resolves green `#44cc44` for one beat → memo pages open in-screen as projected pages above the strongbox (not a modal — the pages are the lockbox's output).

### 6. NPC Inbox (Beat H) — comms-array
- **Anchors:** central console envelope-glyph (50% / 55%); secondary Human-signal panel on left wall (22% / 48%).
- **Inbox click:** envelope unfolds in-place using existing `vfx_inbox_envelope_unfold` + `vfx_inbox_edge_sentence_bloom`. Tutor (`INBOX_TUTOR`, The Human) first-time only.
- **Human-signal panel click** (during Beat 3): the scrolling red waveform stabilises into a single sustained line; narrator-swap fires here. This is the diegetic trigger for the narrator change — previously un-anchored.

### 7. Witnessing (Beat J) — archives
- **Anchor:** Seer's burnt tarot card on the reading-plinth (50% / 60%), amber conservator lamp above.
- **Click:** plinth well fires (`vfx_witnessing_hub_hemisphere_bloom`), the 20-slide choice pillar takes the screen. Tutor (`WITNESSING_TUTOR`, Seer) first-time only.
- **Post-choice:** plinth's brass rim inlays a Light or Dark wash; card's unburnt quadrant gains a faint matching tint (diegetic alignment feedback, no HUD gauge).

### 8. Save / Resume Objective Tracker — bridge
- **Anchor:** Captain's holo-map table with the pulsing waypoint (50% / 58%).
- **Hover:** the waypoint pip brightens; a small diegetic brass ribbon beside the table shows the next objective (populated from `getNextPreludeRoom`). No modal.
- **Click:** confirms intent to travel; the waypoint pulse accelerates briefly as acknowledgment.
- **Save/resume:** on load, the waypoint pin is pre-set to wherever the player left off; every examined-anchor dim state in other rooms is restored from the narrative flag bag.

### 9. System Tutor Cards — all rooms (first-time only)
- **Surface:** brass placard mounted on the wall / console nearest the anchor. Painted in by the VFX overlay — never a React modal.
- **Content:** `preludeSystemTutors.ts::introText` for that system.
- **Dismiss:** click anywhere on the placard; it fades out and sets the system's `completionFlag`. Placard never returns for that system.

### 10. VFX Overlay — all rooms
- **Extensions:** new generic idle / hover / examined VFX IDs (see color table) registered in `preludeVfxRegistry.ts` under `CODE_IMPLEMENTED_VFX_IDS`.
- **Driver:** the overlay picks the VFX for each anchor from a per-room anchor config table (`preludeRoomAnchors.ts`) so a new room anchor is added by editing data, not by hand-wiring JSX.

### 11. VO Multi-Speaker — all rooms
- **Binding:** each anchor carries an optional `voLineId` resolving against the per-speaker manifest (Elara / Human / Prince / Locke / Seer / Antiquarian).
- **Diegetic attribution:** the anchor *is* the speaker — toy soldier plays Prince VO; envelope plays Human VO; tarot plays Seer VO; Captain's holo-map plays Elara objective lines.

## New Hotspot Config Files (mirroring `beatEHotspots.ts`)

- `beatCWorkbenchHotspots.ts` — engineering crew-role tool-stations
- `beatDCargoHotspots.ts` — cargo-hold ledger-console + Free Ports seal
- `beatFStrongboxHotspot.ts` — mess-hall strongbox coordinate
- `beatHInboxHotspot.ts` — comms-array envelope-glyph + Human-signal panel
- `witnessingTarotHotspot.ts` — archives burnt tarot card
- `preludeRoomAnchors.ts` — generic per-room anchors (cryo HUD, pet capsule, beacon trolley, Vortex rift, bridge holo-map, Elara pip)

## Diegetic No-Go List

- No `position: fixed` UI chrome on the viewport.
- No modal overlays with standard web affordances (close-X buttons in corners, scroll-bars, tab strips).
- No rendered text painted onto room backdrops (tutor placards carry text but are delivered by the VFX layer as in-world signage, not baked into the PNG).
- No anchor brightens itself once examined (the `examined` state is absorbing; re-click does nothing — every system is a first-time-only interaction in the Prelude).

## Verification

End-to-end test (new): traverse `PRELUDE_ROOM_ORDER` from cryo-bay to
archives. Per room, assert each anchor in its per-room config table runs
all five states: enter → idle glow, hover → tutor placard (first visit) +
edge-glint, click → active, resolve → success bloom, re-enter → examined
dim and suppressed. Room's `cleaned` flag raises only after every anchor
in the room reaches `examined`. `getNextPreludeRoom` advances on room
clean. Save, reload, verify all examined states persist.
