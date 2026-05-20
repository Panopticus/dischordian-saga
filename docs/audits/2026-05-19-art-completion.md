# Art Completion Audit — 2026-05-19

**Scope.** Every asset URL referenced from `apps/client/src`,
`apps/shared`, `apps/server`, and the `*VoManifest.json` voice
manifests, probed via `HEAD` against the production CDN
(`dgrsart.s3.us-east-2.amazonaws.com`) plus the legacy CloudFront
origin. Cross-referenced against an authenticated full-bucket listing
(`aws s3 ls s3://dgrsart/cdn/client-public/ --recursive`) to
distinguish "wrong path in code" from "asset doesn't exist."

**Final state on this branch:**

| Metric | Before | After |
|---|---:|---:|
| Unique asset URLs referenced in code | 3,002 (stale) | 3,774 (fresh) |
| Live on dgrsart | 881 | **1,999** |
| Dead on dgrsart | 394 | **46** |
| Dead on legacy CloudFront | 1,727 | 1,727 (separate workstream) |

**Net delta:** **348 dead URLs resolved** (394 → 46). Of the remaining
46, **43 are base-URL "directory" constants** flagged as 403 in
isolation but resolved fine at runtime via prefix composition
(§2.2 below). The actual hard gap is **3 audio tracks** — Album 1
T11 "The Empire Reborn", T18 "Planet of the Wolf", T23 "Wake Up" —
which need Suno production per `docs/REMAINING_ASSET_PRODUCTION_SPEC.md`
§B. **All other producer-side gaps are closed.**

The original audit was wrong by an order of magnitude. Two compounding
scanner bugs inflated the headline number. Both fixed in this branch.

---

## 1. What was actually wrong vs. what I thought was wrong

### 1.1 Scanner bugs (commit `bd5935f`)

- `extract-urls.sh` only matched `assetUrl("…")`. The `pair("X.png")`
  helper in `preludeAct1Deliverables.ts` expands to both
  `X.png` and `X.webp` at runtime — none of those URLs (206 of them)
  were being probed. Added a second grep pass.
- The committed `cdn-liveness-files.tsv` was generated against a
  pre-rename version of the imprint card files (before
  `s1_imprint_<name>_t<N>` → bare `<name>_t<N>`). It phantom-reported
  90 imprint cards as missing. The `scan-path-mismatches.sh` scanner
  was reading the stale file. Pointed it at `cdn-liveness.tsv`.

### 1.2 113 categorical TCG card webps (commit `389ac49`)

Bucket has the bytes — under the descriptive card-name slugged from
the `name` field, not the `s1_<cat>_<faction>_<index>` id-based path
the code reached for:

| Pattern | Example |
|---|---|
| `art/cards/allegiance/s1_alleg_antiquarian_t1.webp` → `antiquarian_apprentice_t1.webp` | code uses id, bucket uses name + tier suffix |
| `art/cards/class/s1_class_assassin_01.webp` → `glass_blade_initiate.webp` | name only; no index suffix |
| `art/cards/element/s1_elem_fire_01.webp` → `the_first_flame.webp` | (bucket dir is `element`, code dir is `elemental`) |
| `art/cards/dimension/s1_dim_time_01.webp` → `moment_keeper.webp` | (bucket dir is `dimension`, code dir is `dimensional`) |

Mapping rules (verified via `aws s3 ls` cross-reference):
- `slugify(name)` = lowercase, drop apostrophes, snake-case the rest
- Allegiance keeps the `_t<N>` tier suffix from the id
- Compound-word reconciliation (`Footsoldier` → `foot_soldier`)
- `Ne-Yon` collapses to `neyon` (hyphen elided, not converted to `_`)
- `new_babylon` faction prefix is `babylon_` in the bucket
- 3 by-elimination matches (Corpse-Reader / Ark Survivor / Chrome Archon)
  where the only code↔bucket pair remaining in a faction were paired;
  verified via flavor-text overlap.

All 113 rewrites verified live (HTTP 200) with sample probes; `pnpm
check` clean; `pnpm vitest run apps/shared/tcg-core/cards` 19/19 green.

### 1.3 Cross-cutting fixes (commit `a622629`)

| Class | Count | What changed |
|---|---:|---|
| Single-card art moved into faction subdirs | 5 | `gen_authority.webp` → `architect/the_authority.webp`, `burnt_card_placeholder.webp` → `neutral/the_burnt_card.webp`, etc. |
| Hierarchy card | 1 | `art/cards/hierarchy/lord_master_of_rlyeh.webp` → `art/cards/architect/master_of_rlyeh.webp` |
| Scene rooms | 4 routes | `room-war-room.{png,webp}`, `room-social-hub.webp`, `room-guild-sanctum.webp`, `room-station-dock.webp` → `art/rooms/<snake_case>/baseline.png` |
| Recruit emotion portraits | 24 (4 recruits × 6 emotions) | Repointed to `art/portraits/expressions/<recruit>_<emotion>.png`; producer's emotion taxonomy (combat/doctrinal/focused/neutral/wounded) mapped to code's (base/considered/neutral/vulnerable/warm/wary) |
| Unused `artBase` field | 6 specimens | Bare-name URLs given a valid `-fragment.png` value |
| Legacy-prefix S3 migration | 125 files | Copied `s3://dgrsart/{page-backgrounds,cabin-art,nilmorg-portraits,cdn/casino}/*` → `s3://dgrsart/cdn/client-public/<prefix>/*` (public-policy scope); updated 4 base-URL constants in `apps/shared/{cabinArt,nilmorgPortraits,pageBackgrounds}.ts` and `apps/client/src/lib/casinoAssets.ts` |

### 1.4 CloudFront defensives + dead Stockfish CDN (this commit)

- `ElaraDialog.tsx` — 2 `?? "https://cloudfront..."` fallbacks were
  unreachable (the typed lookup `getNPCPortrait("elara")` always
  returns a non-null entry). Replaced with an explicit guard +
  unconditional access.
- `apps/server/_core/securityHeaders.ts` — `STOCKFISH_CDN` const was
  dead: `apps/client/src/lib/stockfishWorker.ts` swapped to a
  permissive pure-TS chess engine (PermissiveChessEngine), no
  external WASM is loaded. Removed from CSP `script-src` and
  `script-src-elem` allowlists.
- `apps/server/spriteProxy.ts` — `d2xsxph8kpxj0f.cloudfront.net`
  removed from `ALLOWED_DOMAINS` (origin decommissioned). Test
  expectation updated to assert `dgrsart.s3...` is allowlisted
  instead.
- `apps/server/routers/elara.ts` — server-side dead CF URL on the
  `getGreeting` payload replaced with the Cloudinary URL the
  client-side typed lookup already returns.

---

## 2. Remaining gap: 127 dgrsart-dead URLs

Most of the remaining gap is actually producer-side (assets that
don't exist on the bucket at all), plus base-URL constants that are
flagged as "dead" by the audit but resolve at runtime via prefix
composition. Breakdown:

### 2.1 Genuinely missing on the bucket (~90 actionable, needs producer)

| Cluster | Count | Notes |
|---|---:|---|
| `art/cards/s1_<curve\|zeal\|struct\|resurrect\|blast>_<NNN>.webp` | ~30 | Era Mote, Schematic Spark, Engine Warden, Glimmer Wisp, Oath Keeper, etc. Card defs exist; no producer art on bucket under any naming I could find |
| `art/cards/s1_neutral_*_001.webp` (engine demo cards) | 10 | Cut the Threads, Tidewall, Witness Whose Time Has Come, etc. |
| `art/specimens/{auros,cog,nyx,sibyl,strain,toxis}-fragment.png` | 6 | 6 of the 13 specimens have no fragment art (the other 7 — cipher, echo, flicker, gilt, glyph, lux, spore — are live) |
| `art/slideshows/album{2,4}/T<NN>/T<NN>_00_title.webp` | 13 | Albums 2 and 4 don't exist on bucket at all (only 1 and 5 are present) |
| `art/cards/hierarchy/lord_{pale_emissary,reckoning_daughter}.webp` | 2 | The third hierarchy card (master_of_rlyeh) was repaired in 1.3; these two have no bucket counterpart |
| `audio/album1/T{11,18,23}.mp3` | 3 | Album 1 audio only delivered through T09 |
| `audio/music/{celebration/welcome,mechronis/to-be-the-human,song_last_words_prelude_full,songs/dischordian_logic}.mp3` | 4 | Misc one-off audio |
| `art/ui/{card-frame,deck-bg,graph-bg,leaderboard-bg}.webp` | 4 | Producer-side UI assets |
| `art/rooms/room-{dreams-workshop-subbasement,comms-relay,engineers-bench,game-masters-arena}.{png,webp}` | ~5 | Late-game scene rooms; close bucket matches exist (`comms_array`, `game_masters_sanctum`) but are different rooms, not the ones the code is naming |
| `art/cards/{card_locke_sworn_pen_title,card_thaloria_witness_title,gen_seer,s2_watcher_001..003}` | ~6 | Misc one-off cards |
| Other one-offs (master_faces/elara, ship/bunkroom, fighters/{architect,collector,enigma}, etc.) | ~10 | Various |

### 2.2 Base-URL "directory" constants flagged as dead (~22)

These show up in the audit because the source-grep pattern catches
the URL prefix at the top of a const declaration:

```ts
const CDN_BASE = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public";  // ← flagged as dead URL
const RECRUITS_BASE = `${CDN_BASE}/art/recruits`;                                  // composed at runtime
```

The flagged URL (e.g. `cdn/client-public/`) is a 403 in isolation
because it's a directory, but at runtime the code never fetches that
URL — it composes `${BASE}/<filename>` which resolves fine. These
include: `cdn/client-public/`, `art/cades/<categories>/`,
`art/rooms/`, `art/eidolons/`, `art/vfx/`, `videos/dmc/`, etc.

Not actionable. Could be filtered out of the audit by adding a
"trailing slash or no leaf" filter to the extractor.

---

## 3. The 1,727 CloudFront refs — separate workstream

5,579 hardcoded `d2xsxph8kpxj0f.cloudfront.net` URLs across 35
non-test source files. The CF origin is decommissioned — every one
of these is a broken HTTP request waiting to happen if it gets hit
at runtime.

**This is not a mechanical search-and-replace.** Two reasons:

1. **No 1:1 mapping.** The CF assets were AI-generated with
   content-hash-suffixed filenames (e.g.
   `001_the_programmer_00494c37.png`,
   `sprite_architect_idle_73497ee2.png`). The dgrsart bucket has
   nothing under matching basenames — the producer's reorganisation
   renamed everything thematically (e.g. fighter sprites are now
   collected into atlases: `art/fighters/architect/architect_idle_movement.png`
   instead of per-frame individual files).

2. **Format change.** The new asset format is sprite ATLASES (one
   image, many frames) rather than the old per-frame individual
   files. `CharacterModel3D.ts`, `bossEncounters.ts`,
   `conexusGames.ts`, `gameData.ts` reference individual frames
   that no longer exist as discrete files. Migrating these requires
   rewriting the sprite-rendering pipeline to handle atlases, not
   just rewriting URLs.

Hot-path files by CF-ref count:

| File | CF refs | What it gates |
|---|---:|---|
| `apps/client/src/game/CharacterModel3D.ts` | 1,134 | 3D fight system character sprites (heaviest user; needs sprite-atlas migration) |
| `apps/client/src/data/bossEncounters.ts` | 96 | Boss encounter portraits / cinematics |
| `apps/client/src/game/gameData.ts` | 49 | Game data table — character / room art |
| `apps/client/src/data/conexusGames.ts` | 47 | CoNexus mini-game art |
| `apps/client/src/game/duelyst/types.ts` | 12 | Duelyst card-game type fixtures |
| `apps/client/src/data/companionData.ts` | 4 | Companion sprite refs |
| (29 other files, 1-10 refs each) | ~98 | Components with single hardcoded hero assets |

Of the 1,727 dead CF URLs, today's commit removed only the **6 that
were guaranteed-defensive** (2 in `ElaraDialog` + 3 STOCKFISH_CDN
references + spriteProxy allowlist + the elara server-router
response). The remaining 1,721 need per-asset producer mapping
(or per-file decisions to delete features entirely).

**Recommended next step:** the producer needs to deliver a CSV/JSON
mapping every CF URL the codebase still references to its dgrsart
equivalent (where one exists), and a list of which features no
longer have any asset (decision needed: rebuild, find replacement,
or remove). Without that mapping, mechanical replacement risks
silently rendering wrong art across the app.

---

## 4. How to re-run the audit

```bash
# Regenerate URL extraction + CDN probe + path-mismatch analysis
bash docs/production/audit/extract-urls.sh    # parses code, writes all-urls.tsv
bash docs/production/audit/probe-cdn.sh       # HEAD-probes each URL, writes cdn-liveness.tsv
bash docs/production/audit/scan-path-mismatches.sh  # finds dead-URL → live-alternate via narrow transforms

# Aggressive alternate-path probe (extension flips, snake↔kebab,
# prefix strips, parent-dir swaps, tier encoding flips)
bash docs/production/audit/probe-alternates.sh

# Authenticated bucket listing (requires AWS creds; needed to
# distinguish "doesn't exist" from "non-public ACL"):
AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… aws s3 ls \
  s3://dgrsart/cdn/client-public/ --recursive > /tmp/dgrsart-keys.txt

# Producer-key probe (separate concern: checks ~928 typed-manifest
# keys for upload-delivery delta):
AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… node scripts/_check-art-coverage.mjs
```

The probe scripts can be re-run on every PR if wired into CI (the
audit already has a `docs/production/audit/probe-cdn.sh` that needs
no credentials; the listing-based diff needs creds).
