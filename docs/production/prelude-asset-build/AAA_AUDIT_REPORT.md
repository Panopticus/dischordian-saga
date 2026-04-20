# Prelude Opening Rooms — AAA Art Audit Report

Produced as the art-direction gap report for the 10 opening rooms defined in
`apps/shared/preludeRoomGate.ts`. Drives the regeneration pipeline and the
system-to-hotspot placement contract.

## Scope

All 10 rooms in `PRELUDE_ROOM_ORDER`, evaluated against the 11 interactive
systems the Prelude currently drives through Beats A–J.

## Style Contract (applied to every room)

Canonical templates: `prompts/rooms/room-cryo-bay.txt` and
`prompts/rooms/room-mess-hall.txt`. Every room prompt is a single dense
paragraph containing, in order: opener (`Hyper-realistic cinematic still,
16:9, 4K. Interior of [Room] aboard Ark 1047…`); geometry statement;
bolded focal objects with `{leftPct, topPct}` positions; light logic (no
overhead practicals; source → color → shadow); palette anchors
(`#010020` deep void, `#22d3ee` cyan, `#fbbf24` amber, `#cc2244` corrupted
red, `#44cc44` toxic green, `#00e676` foxfire green, violet for Vortex);
anamorphic lens flare + fine film grain; hard exclusions (no rendered text,
no people, no unmotivated holograms); shot framing (three-quarter wide,
standing eye level, camera at entrance); one-sentence mood closer.

## Per-Room Verdict

| # | Room | PNG | Prompt | Missing Anchor(s) | Verdict |
|---|------|-----|--------|-------------------|---------|
| 1 | cryo-bay | ✓ | ✓ | Interference/whisper trigger | Overpaint — add in-pod stasis-HUD at 50%/72% |
| 2 | bridge | ✓ | ✗ → **now ✓** | Holo-map anchor, operator stations | Re-gen — new prompt created |
| 3 | medical-bay | ✓ | ✓ → **amended** | Pet capsule distinct from med-pods | Re-gen — amber pet capsule at 18%/58% |
| 4 | mess-hall | ✓ | ✓ → **amended** | Beacon minigame object | Overpaint — beacon trolley at 82%/60% |
| 5 | comms-array | ✓ | ✓ → **amended** | Narrator-swap (Human-signal) anchor | Overpaint — Human-signal panel at 22%/48% |
| 6 | armory | ✓ | ✗ → **now ✓** | Combat-tutorial dummy + brief board | Re-gen — three dummies, tactical board, weapon rack |
| 7 | observation-deck | ✗ | draft → **now ✓** | Vortex rift visual clarity | First-pass generation — Vortex rift framed at 68%/28% |
| 8 | engineering | ✓ | ✓ → **amended** | 6-pod vs 3-pod mismatch; workbench crew-role stations | Re-gen — reconciled to 3 pods, 3 tool-stations at 30/50/70%/62% |
| 9 | cargo-hold | ✓ | ✓ → **amended** | Free Ports crate distinct; dockmaster console | Overpaint — hero crate at 38%/60%, ledger-console at 32%/68% |
| 10 | archives | ✓ | ✓ → **amended** | Seer's burnt tarot card | Overpaint — tarot on reading-plinth at 50%/60% |

**Regeneration summary:** 5 overpaints, 4 regenerations, 1 first-pass
generation.

## System → Hotspot Matrix

Every interactive system maps to exactly one diegetic anchor in exactly one
room, at a defined `{leftPct, topPct}` position that matches the updated
prompt.

| # | System | Implementation | Room | Anchor | Position |
|---|--------|---------------|------|--------|----------|
| 1 | Dialog / Elara companion | `apps/client/src/game/roomDialogs.ts` | all | Elara holo-pip, right-rail | 92% / 18% |
| 2 | Crew Role Choice (Beat C) | `components/prelude/BeatCCrewRoleChoice.tsx` | engineering | 3 workbench tool-stations (Engineer / Assassin / Oracle) | 30/50/70% / 62% |
| 3 | Mission Board (Beat D) | `components/prelude/BeatDMissionBoard.tsx` | cargo-hold | Dockmaster ledger-console beside Free Ports hero crate | 32% / 68% |
| 4a | Flashback — Toy Soldier (Beat E) | `components/prelude/beatEHotspots.ts` | mess-hall | Prince's Archive shelf, toy soldier | 28% / 68% |
| 4b | Flashback — Diploma (Beat E) | `components/prelude/beatEHotspots.ts` | mess-hall | Wall-mounted framed diploma | 66% / 42% |
| 5 | Biometric Lockbox (Beat F) | `components/prelude/BeatFBiometricLockbox.tsx` | mess-hall | Dark composite strongbox on Prince's shelf | 22% / 50% |
| 6 | NPC Inbox (Beat H) | `components/prelude/BeatHInbox.tsx` | comms-array | Central console envelope-glyph | 50% / 55% |
| 7 | Witnessing (Beat J) | `components/prelude/LastWordsWitnessing.tsx` | archives | Reading-plinth with Seer's burnt tarot card | 50% / 60% |
| 8 | Save/resume objective tracker | `components/prelude/PreludeSequencePlayerConnected.tsx` | bridge | Captain's holo-map table with pinned waypoint | 50% / 58% |
| 9 | System tutor cards | `apps/shared/preludeSystemTutors.ts` | all | Diegetic brass placard beside each anchor | adjacent |
| 10 | VFX overlay | `components/prelude/vfx/PreludeVfxOverlay.tsx` | all | Painted onto anchors (no new art position) | n/a |
| 11 | VO multi-speaker | scene-gated | all | Objects-as-speakers (soldier=Prince, inbox=Human, tarot=Seer) | uses existing |

## Gap-Fill Anchors Added (net new across the 10 prompts)

| Room | New anchor | Position | Why |
|------|-----------|----------|-----|
| cryo-bay | Stasis-HUD panel inside open pod | 50% / 72% | Beat 1 interference/whisper trigger |
| medical-bay | Amber-canopy pet stasis capsule | 18% / 58% | Must read distinct from cyan med-pods |
| mess-hall | Beacon-operator trolley + console | 82% / 60% | Beacon minigame interaction point |
| comms-array | Human-signal wall panel (red waveform) | 22% / 48% | Narrator-swap anchor (Beat 3) |
| observation-deck | Framed Vortex rift in dome | 68% / 28% | Beat 4 narrator-swap; upgraded from "subtle shimmer" |
| cargo-hold | Free Ports hero crate + dockmaster console | 38% / 60%, 32% / 68% | Mission-board physical anchor, 1,047-year delivery |
| archives | Seer's burnt tarot card on reading-plinth | 50% / 60% | Witnessing trigger; Act 1 hook |
| bridge (new) | Captain's holo-map table w/ pinned waypoint | 50% / 58% | Objective tracker + save/resume visual |
| armory (new) | Three combat-training dummies | 32/50/68% / 58–60% | Combat tutorial anchor |

## Verification Gates

1. **Prompt-contract lint** — parse each `room-*.txt`; assert opener phrase,
   at least one bolded focal clause per expected system, exclusions phrase,
   framing phrase.
2. **Coordinate alignment** — headless render PNG with red dots at each
   hotspot's declared `{leftPct, topPct}`; dot must land on the intended
   anchor.
3. **End-to-end Prelude walkthrough** — traverse `PRELUDE_ROOM_ORDER`
   (`preludeRoomGate.ts`). Per room: idle glow on entry → hover shows tutor
   placard (first visit) → click runs active → success dims to examined →
   room-clean flag raised → `getNextPreludeRoom` advances. Save/resume
   preserves examined state.
4. **Aesthetic diff** — color-pick rendered art for `#010020` plus at least
   one canonical accent; verify no overhead practicals, no rendered text,
   no unauthorised holograms (bridge holo-map, comms holo-field,
   engineering tool-station pips, and armory tactical-board line-art are
   sanctioned).

Acceptance: all 10 rooms pass gates 1–4; all 11 systems have a diegetic
anchor that plays the full idle → hover → active → success → examined
state machine end-to-end.
