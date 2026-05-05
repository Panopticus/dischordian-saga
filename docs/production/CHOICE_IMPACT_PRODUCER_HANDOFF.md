# Choice-Impact Content Pass — Producer Handoff

This document closes items **12, 13, and 14** of the choice-impact roadmap follow-up. The work in items 1–11 is engineering; items 12–14 are content that lives outside the engineering toolchain and must be produced by the right specialist.

Engineering has shipped the *containers* for all three. The script entry points, asset slugs, and references in code are stable. Producers can fill the containers without further engineering coordination.

---

## Item 12 — VO Recording (~177 lines)

### Owner
Voice-acting / VO production lead.

### Inputs ready in the repo
- **Generator script**: `apps/scripts/generate-content-pass-vo.ts` (PR #407)
- **Env-var voice-id overrides**: `VOICE_ID_<SPEAKER>` (PR #408)
- **JSON config alternative**: `--voice-config voice-ids.json`
- **Authored content** with `[CUE]` timestamps, voice-direction notes, and mix instructions:
  - `apps/shared/npcs/romanceScenes/*.ts` — 5 candidates × 5 stages = ~57 scenes
  - `apps/shared/encounters/masterOfRlyeh.ts` — Hierarchy lord encounter (~12 lines)
  - `apps/shared/encounters/paleEmissary.ts` — Hierarchy lord encounter (~10 lines)
  - `apps/shared/encounters/reckoningDaughter.ts` — Hierarchy lord encounter (~12 lines)
  - `apps/shared/encounters/malkiaRevolution.ts` — six-step questline (~20 lines)
  - `apps/shared/encounters/sourceKaelDialogue.ts` — six-node tree (~15 lines)
  - `apps/shared/encounters/act7EpilogueVoScripts.ts` — five stance epilogues with `[CUE]` timestamps and per-line voice-direction prefixes

### Voice-ID assignments still required
The script ships `TODO_VOICE` placeholders for sentinel speakers. Producer fills these in via env vars or `--voice-config voice-ids.json`. Roster speakers (Elara, Human, Antiquarian, Locke, Vex) are already populated from `apps/shared/npcs/registry.ts`.

| Speaker | Env var | Notes |
|---|---|---|
| Jericho Jones | `VOICE_ID_JERICHO_JONES` | Laconic gunfighter cadence; long pauses |
| DMC Companion | `VOICE_ID_DMC_CLONE_COMPANION` | Clone-soul cadence; progressive individuation across stages 1–5 |
| Master of R'lyeh | `VOICE_ID_HIERARCHY_MASTER_OF_RLYEH` | Archival, wet, never raises |
| Pale Emissary | `VOICE_ID_HIERARCHY_PALE_EMISSARY` | Tall, courteous, patient beyond instinct |
| Reckoning Daughter | `VOICE_ID_HIERARCHY_RECKONING_DAUGHTER` | Meticulous, warm, pause before each numerical figure |
| Malkia Ukweli | `VOICE_ID_MALKIA_UKWELI` | Declarative, present-tense, never uses 'should' |
| Source | `VOICE_ID_SOURCE` | Theological present-tense; permeable phrases |
| Kael trace | `VOICE_ID_KAEL_TRACE` | Half a register lower than Source; rare and precious |
| System narrator | `VOICE_ID_SYSTEM` | Distant, reverberant; gender-neutral |
| Dual cue | `VOICE_ID_DUAL` | Producer-side mix of Elara + Human takes (12ms stereo offset, equal volume; 60% volume on Silence ending) |

### Run

```bash
export ELEVENLABS_API_KEY=sk_...
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...

# Voice IDs — fill in producer-supplied values
export VOICE_ID_JERICHO_JONES=...
export VOICE_ID_DMC_CLONE_COMPANION=...
export VOICE_ID_HIERARCHY_MASTER_OF_RLYEH=...
export VOICE_ID_HIERARCHY_PALE_EMISSARY=...
export VOICE_ID_HIERARCHY_RECKONING_DAUGHTER=...
export VOICE_ID_MALKIA_UKWELI=...
export VOICE_ID_SOURCE=...
export VOICE_ID_KAEL_TRACE=...
export VOICE_ID_SYSTEM=...
export VOICE_ID_DUAL=...

# Plan first (no API calls)
pnpm tsx apps/scripts/generate-content-pass-vo.ts --dry-run

# Generate everything
pnpm tsx apps/scripts/generate-content-pass-vo.ts

# Or scope down
pnpm tsx apps/scripts/generate-content-pass-vo.ts --source romance --only locke
```

### Output
- Local MP3s: `apps/client/public/audio/{romance,encounters,act7}/<bucket>/<lineId>.mp3`
- S3: `s3://dgrsvoices/{Romance,Encounter,Act 7 Epilogue} Voices/<bucket>/<lineId>.mp3`
- Per-source manifest JSONs at `apps/shared/{romanceScenes,encounters,act7Epilogue}VoManifest.json`

The romance and encounter UI components already lazy-import these manifests; clips play silently when manifest is empty (current state) and audibly once it's populated.

### Acceptance
- [ ] All ~177 lines generated and uploaded to S3
- [ ] Per-source manifest JSONs committed to the repo (or written to a CDN-readable location)
- [ ] Spot-check on Act 7 Humanity ending: dual-narrator beat lands in stereo with 12ms offset

---

## Item 13 — Vex's Convergence Seat Coda

### Owner
Composer.

### Reference in code
`apps/shared/npcs/romanceScenes/vex.ts` — `vex.romance.s5.act7_dedication`:

> *"I have written you a Coda. The Coda is fifteen minutes. It plays at the Convergence Seat. Elara has heard the draft. She has, in her register, approved. The Antiquarian has heard the draft. He has, in his register, refused to comment, which is — by his standards — approval."*

### Brief
- **Duration**: 15 minutes (fixed; the romance scene declares it canonically)
- **Form**: A "Coda" in the Coda Bridge musical tradition — composed for a single listener
- **Reuses canon**: the key change from `vex.romance.s2.played_for_one` (a key "that does not, in the Coda repertoire, exist") should appear at least once in the Coda. The cataloguers in stage-5 specifically promise to revise the repertoire to name the new key after the player.
- **Diegetic context**: plays during the Convergence Seat sequence in Act 7 stage 5 of the Vex romance. Mixes against the existing Act 7 cinematic backing (see existing Act 7 audio bed).
- **Premiere**: drops from `vex_romance_stage5_complete` flag firing.

### Wiring
The romance scene player (`apps/client/src/components/romance/RomanceScenePlayer.tsx`) already lazy-imports `apps/shared/romanceScenesVoManifest.json`. Composer can:
1. Drop the Coda mp3 at `apps/client/public/audio/romance/vex/vex.romance.s5.act7_dedication.mp3` (matches the lineId convention)
2. Add the manifest entry: `{"vex.romance.s5.act7_dedication": {"url": "/audio/romance/vex/...", "speaker": "vex_solene"}}`

When the player reaches stage 5, the modal will play it automatically. No code changes needed.

### Acceptance
- [ ] 15-min Coda audio asset delivered
- [ ] Manifest entry committed
- [ ] Plays during the Vex stage-5 scene without clipping the dialog beats

---

## Item 14 — Act 7 Cinematic Frame Art (5 slugs)

### Owner
Art lead / cinematic art pipeline.

### Reference in code
`apps/shared/encounters/act7EpilogueVoScripts.ts` declares five `frameSlug` values that the renderer reads as background art for each Act 7 epilogue cinematic. Slugs live in `apps/shared/act7Epilogues.ts` per stance:

| Slug | Stance | Mood description |
|---|---|---|
| `epilogue_humanity_ark_warm` | Humanity | "warm, mortal, owned" — interior of the Ark with golden window light, kettle steam visible, bridge lit but at human scale |
| `epilogue_machine_ark_exact` | Machine | "exact, total, measured" — same Ark, but with substrate hum visible as light striations; geometry corrected to perfect square; faintly cold |
| `epilogue_balance_ark_glow` | Balance | "the third option, refused-and-chosen" — Ark in motion against a long horizon; the Convergence Seat visible but unlit; deliberate ambiguity in colour temp |
| `epilogue_soldier_bridge_lit` | Soldier-Command | "command, taken, with full eyes" — bridge lit fully, Ark moving, captain's chair foregrounded but viewed from the second chair's POV |
| `epilogue_silence_seat_unlit` | Silence | "the fourth choice, refusing the having of a choice" — the Convergence Seat itself, unlit, slightly off-centre; the longest reverb of any ending |

### Style guidance
- Match the Act 1–6 cinematic frame style (existing examples in `apps/client/public/art/cinematics/`)
- Low contrast, painterly, allow the dialog text to overlay readably (avoid bright centres in frame composition)
- Each ending should feel **emotionally distinct on first sight** — even before reading the captions, the player should know which ending they're in

### Wiring
Drop assets at `apps/client/public/art/cinematics/<slug>.png` (or .webp). The Act 7 epilogue renderer (`apps/client/src/components/act7/Act7EpilogueRenderer.tsx`, when it ships) will read `frameSlug` from `act7Epilogues.ts` and render via `assetUrl()`.

The slugs are stable; the asset pipeline can pre-generate them via the existing `pnpm assets:upload` flow once the art is approved.

### Acceptance
- [ ] Five frame assets delivered, one per stance
- [ ] Uploaded via `pnpm assets:upload` to S3
- [ ] Spot-check overlay readability against the longest line in each stance's VO script

---

## Status

| Item | Status | Owner |
|---|---|---|
| 1. Encounter dispatcher service | ✅ Shipped (PR #423) | Engineering |
| 2. Vex reveal advancer | ✅ Shipped (PR #424) | Engineering |
| 3. Malkia phrase-echo wiring | ✅ Shipped (PR #424) | Engineering |
| 4. EncounterPlayer UI | ✅ Shipped (PR #423) | Engineering |
| 5. Antiquarian's Tome page | ✅ Shipped (PR #425) | Engineering |
| 6. Faction standing widget | ✅ Shipped (PR #425) | Engineering |
| 7. Dischordia meter | ✅ Shipped (PR #425) | Engineering |
| 8. CoNexus Tomes (7) | ✅ Shipped (PR #426) | Engineering |
| 9. Thought Virus mechanic | ✅ Registry shipped (PR #427); router + UI deferred | Engineering |
| 10. Two Witnesses decode quest | ✅ Registry shipped (PR #427); router + UI deferred | Engineering |
| 11. Dr. Lyra Vox questline | ✅ Registry shipped (PR #427); router + UI deferred | Engineering |
| **12. VO recording** | **⬜ Awaiting voice IDs + run** | **Producer** |
| **13. Vex Convergence Coda** | **⬜ Awaiting composition** | **Composer** |
| **14. Act 7 cinematic art** | **⬜ Awaiting 5 frame assets** | **Art** |

The choice-impact roadmap is engineering-complete. The remaining three items are content production tasks the engineering team has unblocked but cannot perform.

---

*Authored alongside the choice-impact PR sequence #404–#427.*
