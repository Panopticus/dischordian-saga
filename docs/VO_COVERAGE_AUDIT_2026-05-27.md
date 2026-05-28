# Voice-Over Coverage Audit — 2026-05-27

Branch: `claude/dischordia-tcg-narrative-BaiWI`
Scope: every line registered in any `*-lines.json` source plus every authored response in `apps/shared/roomMysteries/*.ts`, against the matching `apps/shared/*VoManifest.json` and `apps/client/public/audio/*` outputs.

This audit answers two questions:

1. **Are all hotspots correctly wired to their dialog dialog sources?** ✅ Yes — verified clean by the existing parity gates.
2. **Which lines lack VO?** 1,515 lines. **99.6% of the gap is in `room-mystery`** (744 Elara + 765 detective lines authored across 25 room modules with voIds declared but no corresponding manifest entry or `.mp3` file).

---

## Part 1 — Hotspot wiring (✅ clean)

The user asked to "update all of the hotspots with Elara's new dialog." The wiring is the bridge between an authored hotspot in `ROOM_DEFINITIONS` (`apps/client/src/contexts/GameContext.tsx`) and an authored narration in a `RoomMysteryModule.responses` table (`apps/shared/roomMysteries/<room>.ts`). The bridge is mediated by `room-mystery:<roomId>:<hotspotId>` action strings + the `resolveVerbResponse(mod, verb, hotspotId)` lookup called from `ArkExplorerPage.tsx:213`.

Two parity tests gate this wiring at hard PASS:

| Test | Coverage | Status |
|---|---|---|
| `apps/shared/roomMysteries/hotspotIdParity.test.ts` | 971 tests — every `responses` key has a matching GameContext action; every action targets a real response key | ✅ PASS |
| `apps/shared/roomMysteries/voCoverage.test.ts` | 6 tests — every Look response on every authored hotspot has a `voId` following the canonical `<speaker>.<room>.<hotspot>.<verb>` convention | ✅ PASS |

There is no wiring drift to fix. The 1,515 missing lines are an **authoring-vs-VO-generation** gap, not a hotspot-vs-dialog gap. The runtime correctly routes every click; the audio file the runtime tries to play just isn't there yet for 744 of the Elara responses (and 765 of the detective ones).

---

## Part 2 — VO coverage gap

### Per-surface (from `pnpm vo:audit`)

| Surface | Source | Expected | Implemented | Missing | Generator |
|---|---|---:|---:|---:|---|
| 22 character / per-act surfaces | various `-lines.json` | various | various | **0** | n/a (clean) |
| `chess-climb` | `chess-climb-lines.json` | 41 | 35 | **6** | `pnpm tsx apps/scripts/generate-chess-climb-vo.ts` |
| `room-mystery (elara)` | `apps/shared/roomMysteries/*.ts` | 1492 | 748 | **744** | `pnpm vo:room-mystery --only elara` |
| `room-mystery (detective)` | `apps/shared/roomMysteries/*.ts` | 1051 | 286 | **765** | `pnpm vo:room-mystery --only detective` |
| | | | | **1515** | |

Every other surface (26 of 29) is at 100% coverage. The audit is clean except for these three.

### Per-room breakdown — room-mystery Elara (744 missing)

Top 10 rooms by missing Elara voIds:

| Room | Missing Elara voIds |
|---|---:|
| `antiquarian-library` | 164 |
| `war-room` | 130 |
| `comms-array` | 65 |
| `archives` | 55 |
| `guild-sanctum` | 53 |
| `cipher-den` | 53 |
| `captains-quarters` | 36 |
| `bridge` | 34 |
| `synthesis-chamber` | 27 |
| `shadow-vault` | 23 |
| (15 other rooms with 1-16 missing each) | 104 |

### Per-room breakdown — room-mystery detective (765 missing)

Top 10 rooms by missing detective voIds:

| Room | Missing detective voIds |
|---|---:|
| `antiquarian-library` | 219 |
| `war-room` | 156 |
| `captains-quarters` | 51 |
| `engineering` | 45 |
| `oracle-sanctum` | 36 |
| `guild-sanctum` | 36 |
| `cipher-den` | 36 |
| `comms-array` | 30 |
| `synthesis-chamber` | 27 |
| `order-tribunal` | 27 |
| (15 other rooms with 1-21 missing each) | 102 |

**Two rooms hold 44% of the gap.** `antiquarian-library` (383 missing) + `war-room` (286 missing) = 669 / 1509 = 44.3% of all room-mystery VO not yet generated. Either of those two rooms, generated alone, knocks out a quarter of the total backlog.

### Per-verb breakdown — Elara missing

| Suffix | Count | What it represents |
|---|---:|---|
| `.fragmented` | 153 | Tier-1 banded Look narration (player has low confidence in self) |
| `.lucid` | 153 | Tier-2 banded Look narration (mid-confidence) |
| `.luminous` | 153 | Tier-3 banded Look narration (high-confidence) |
| `.talk` | 167 | Unbanded talk responses |
| `.use` | 117 | Unbanded use responses |
| `.tag-slate` | 1 | One-off canonical tag |
| | **744** | |

The banded look responses (459 total) come in matched 3-packs. When a player advances through Elara's character arc, the look narration tone shifts from fragmented → lucid → luminous; each band needs its own audio file with the appropriate vocal direction.

### chess-climb missing (6 lines)

Specific voIds:

```
vo_gm_climb_t1_mid_trailing_02
vo_gm_climb_t1_pre_01
vo_gm_climb_t2_mid_trailing_02
vo_gm_climb_t2_pre_01
vo_gm_climb_t3_pre_01
vo_gm_climb_t3_pre_02
```

All in the Game Master's chess-climb dialog; lines are in `apps/scripts/chess-climb-lines.json`.

---

## Part 3 — Runbook

All generators are **idempotent** — existing manifest entries are preserved and skipped on re-run. Safe to run multiple times.

All generators require `ELEVENLABS_API_KEY` for the actual TTS API calls. Optional `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` + `S3_BUCKET` + `AWS_REGION` enable direct S3 upload; without those credentials the generator writes to local `apps/client/public/audio/<speaker>/<voId>.mp3` paths and `pnpm vo:s3-backfill` upgrades later.

### Recommended run order

```bash
# Set credentials first
export ELEVENLABS_API_KEY=sk_...
# Optional — direct S3 upload (otherwise local dev paths)
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
export S3_BUCKET=dgrsvoices
export AWS_REGION=us-east-2

# Step 1 — chess-climb (6 lines, fast)
pnpm tsx apps/scripts/generate-chess-climb-vo.ts

# Step 2 — room-mystery Elara (744 lines)
pnpm vo:room-mystery --only elara

# Step 3 — room-mystery detective (765 lines)
pnpm vo:room-mystery --only detective

# Verify all surfaces are at 0/0 gap
pnpm vo:audit
```

### Cost-conscious alternatives

If running the full sweep at once is too expensive, the gap can be closed room-by-room. `pnpm vo:room-mystery` accepts `--only <speaker>` plus a `--limit N` cap for smoke tests. Targeting the two biggest contributors (`antiquarian-library` + `war-room`) closes 44% of the total backlog with a fraction of the API budget.

To do a per-room run, you would need to add a `--only-room <roomId>` flag to `apps/scripts/generate-room-mystery-vo.ts` (the current flag set is `--only`, `--limit`, `--dry-run`, `--list-voids` — no per-room filter). That's a small ~10-LOC change to the script.

### Dry-run probes (no API cost, useful for cost estimation)

```bash
# Show the full plan + counts without spending API budget
pnpm vo:room-mystery --dry-run

# Enumerate every (speaker, voId) pair the registry expands to
pnpm tsx apps/scripts/generate-room-mystery-vo.ts --list-voids

# Single source of truth — re-runs the full audit table
pnpm vo:audit

# Dump missing line ids for one specific surface
node scripts/_vo-audit.mjs --missing antiquarian
```

---

## Part 4 — Per-line missing manifest (for triage)

The full lists are saved to `/tmp` for inspection:

- `/tmp/elara_missing.txt` — 744 missing Elara voIds, one per line
- `/tmp/detective_missing.txt` — 766 missing detective voIds, one per line

Sample first 5 of `/tmp/elara_missing.txt`:

```
elara.antiquarian-library.archivist-anchor.look.t1.fragmented
elara.antiquarian-library.archivist-anchor.look.t1.lucid
elara.antiquarian-library.archivist-anchor.look.t1.luminous
elara.antiquarian-library.archivist-anchor.talk
elara.antiquarian-library.archivist-anchor.use
```

(Each line traces to a specific `RoomMysteryModule.responses[hotspotId].look` or `.talk` or `.use` field in `apps/shared/roomMysteries/<roomId>.ts`.)

---

## Part 5 — What is NOT a gap

For calibration, these surfaces were checked and confirmed at 100% VO coverage:

| Surface | Count | Status |
|---|---:|---|
| cades, degen, elara (character), human, locke, meme, necromancer, nilmorg, shadow_tongue, source, story-mode | 1517 (combined) | ✅ |
| act2, act3, act4, act5, act6, act7 (all per-act surfaces) | 167 (combined) | ✅ |
| engineer-memoir, palimpsest-host, seer, engineer-logs, guild-cutscenes, prelude, act1, act1-taunts, first-contact, story-mode | 391 (combined) | ✅ |
| elaraLines.ts, humanLines.ts (companion dialog) | 262 (combined) | ✅ |

26 of 29 tracked surfaces are at hard 100%. The audit is healthy except for the three identified above.

---

## Conclusion

The hotspot wiring is verified clean (971 parity tests + 6 VO-coverage tests passing). The user's first directive ("update all of the hotspots with Elara's new dialog") is satisfied by the existing gate — no code changes needed.

The VO generation gap is real and measurable: **1,515 lines, 1,509 of them in room-mystery**. The gap closes by running three generator commands with `ELEVENLABS_API_KEY` set. The two highest-leverage targets (`antiquarian-library` + `war-room`) hold 44% of the backlog and would be the natural starting point for a budget-conscious run.

All three generators are idempotent — running them multiple times is safe and a second invocation will skip any voIds already minted by a previous run.

Audit complete.
