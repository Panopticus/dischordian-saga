# Art Completion Audit — 2026-05-19

**Scope.** Every asset URL referenced from `apps/client/src`, `apps/shared`,
and the `*VoManifest.json` voice manifests, probed via unauthenticated
`HEAD` against the production CDN (`dgrsart.s3.us-east-2.amazonaws.com`)
plus the legacy CloudFront origin.

**Source data (regenerated today by the container's session-start hook):**

- `docs/production/audit/all-urls.tsv` — raw URL ↔ source extraction
- `docs/production/audit/cdn-liveness.tsv` — `code ↔ url ↔ source`, one row per unique URL
- `docs/production/audit/per-source-status.tsv` — `source ↔ live ↔ dead ↔ pct ↔ verdict`
- `docs/production/audit/path-mismatches.tsv` — manifest URL → known-good alternate path

Regenerate locally: run `docs/production/audit/extract-urls.sh` then
`docs/production/audit/probe-cdn.sh`. (HEAD probes against a public
S3 bucket are unauthenticated — `200` = object exists with public-read
ACL, `403` = either the object doesn't exist or it isn't public. In
this bucket the application path is public-by-policy, so a `403` on a
`cdn/client-public/...` key effectively means **missing on CDN**.)

---

## 1. Headline numbers

| Surface | Count |
|---|---:|
| Unique asset URLs referenced in code | **3,002** |
| Live (HTTP 200) | **881** (29%) |
| Dead (HTTP 403 — missing or non-public) | **2,121** (71%) |

The headline number is misleading on its own. The 2,121 dead URLs break
down very unevenly:

| Bucket | Dead URLs | Notes |
|---|---:|---|
| Legacy CloudFront (`d2xsxph8kpxj0f.cloudfront.net`) | **1,727** | All from `room-artwork-urls.txt` — a dead source. Origin was decommissioned in the May 2026 CDN migration. **Should be deleted from the repo,** not re-uploaded. |
| `dgrsart` under `cdn/client-public/` | **378** | Genuinely missing assets the application references. This is the actionable list. |
| `dgrsart` outside `cdn/client-public/` (`page-backgrounds/…`, `cabin-art/…`, `nilmorg-portraits/…`, `cdn/casino/…`, `cdn/events/…`) | **16** | Legacy prefix references — should also be migrated to `cdn/client-public/` per the bible (§6.1). |

So **the real art-completion gap is ~394 dgrsart URLs**, not 2,121.

---

## 2. Top blockers (prioritised by impact)

### 2.1 Card-game art — **211 missing webps**

Card art is the single largest gap. Every card definition under
`apps/shared/tcg-core/cards/definitions/{allegiance,class,imprint,
element,race,dimension}/*` references an `art/cards/<category>/<id>.webp`
that does not exist on the CDN.

| Subfolder | Missing webps | Why it matters |
|---|---:|---|
| `art/cards/imprint/` | **90** | 18 imprints × 5 tiers — every NPC character card |
| `art/cards/allegiance/` | **36** | 6 factions × 6 tiers — faction headers |
| `art/cards/class/` | **30** | 6 classes × 5 cards |
| `art/cards/element/` | **20** | 4 elements × 5 cards |
| `art/cards/race/` | **15** | 5 races × 3 cards |
| `art/cards/dimension/` | **12** | 4 dimensions × 3 cards |
| `art/cards/` neutrals (`burnt_card_placeholder`, `gen_seer`, `gen_programmer`, `gen_game_master_original`, `gen_authority`, `s1_warlord_three_moves`, `s1_char_018_the_antiquarian`) | 7 | One-offs |
| Misc (`art/card-game/card-back-seer.png`) | 1 | Seer-flicker tutorial overlay |

**This corresponds exactly to the `NANO_BANANA_*.md` prompt packs** at
the docs root (allegiance, class, element/dimension/race, imprints 1–3,
oracle). The prompts are written; the renders haven't been produced
or uploaded.

**Recommendation:** schedule a Nano Banana batch for the seven prompt
packs and run `pnpm assets:upload` against `apps/client/public/art/cards/`
once the WEBPs land. Until then, the engine renders the card frame
chrome with an empty art slot.

### 2.2 Prelude room backdrops — **17 URLs, alternate path is live**

`apps/client/src/data/preludeAct1Deliverables.ts` (lines 232–252)
references `art/rooms/prelude/room-<room>.{png,webp}` for all 13
Prelude rooms. **None of those 17 URLs resolve.** The
`path-mismatches.tsv` script found that the top-level alternates
(`art/rooms/room-<room>.{png,webp}`) **do resolve** — so the assets
exist, just at a different prefix than the manifest claims.

The file's own comment (lines 233–238) acknowledges the history: a
prior pass moved off `art/rooms/` because the prelude prefix
appeared to be missing at audit-time, and the 2026-04-26
"`prelude_rooms_missing_9.zip`" upload was supposed to fix that. As
of today, the prelude-prefixed copies are still 403.

**Two paths to fix, decide which:**

1. Re-point the manifest to the top-level `art/rooms/` paths (one-line
   string change on 13 entries). Cheapest fix; assets already shipped.
2. Re-upload the prelude-prefixed `prelude_rooms_missing_9.zip` payload
   if the canon really is "Prelude-version rooms live under
   `art/rooms/prelude/`."

Open question for the producer: are the top-level and prelude-prefixed
versions intended to be different art (e.g. cryo-bay closed vs.
breached)? If yes, option 2. If they're meant to be the same painting,
option 1 is correct.

### 2.3 Mechronis Academy — **28 URLs across 4 sources**

`MechronisAcademyPage.tsx` (12), `mechronisHouses.ts` (8),
`mechronisClassmates.ts` (8) reference `art/mechronis/classmates/…`
and `art/mechronis/common-rooms/…`. Plus 4 `audio/ambient/mechronis/…`
beds via `apps/client/src/data/mechronisSlideshow.ts` and 3 audio cues.
**No coverage at all** — this whole sub-surface is wired but not
asset-backed. Production status flag in the bible says Mechronis is
"shipping" — that's accurate for the gameplay; the art is missing.

### 2.4 Cades FPS — **49 URLs across `christmasInJulyAssets.ts`,
`cadesAssets.ts`, `dmcAssets.ts`**

`christmasInJulyAssets.ts` is 0% live (49/49 dead). `cadesAssets.ts`
is 77/77 (100% live!) on individual asset URLs, but its 7 *directory*
URLs (`art/cades/characters/`, `art/cades/enemies/`, etc.) all 403 —
those are likely meta-listing probes, not real assets, so they're
fine to ignore. The Christmas-in-July casino event drop is the
actionable gap.

### 2.5 Outergroove album — **11 audio tracks**

`apps/shared/tcg-core/audio/outergroove.ts` references 10 .mp3 tracks
+ cover.jpg. Zero are live. The album is referenced from the music
player; right now every play attempt 403s.

### 2.6 Prelude cutscene MP4s — **9 videos**

Every `videos/prelude/prelude-beat-*.mp4` referenced by
`preludeAct1Deliverables.ts` is 403:

- `prelude-beat-a-awakening.mp4` through `prelude-beat-j-finale.mp4`,
  plus `prelude-beat-c5-palm-frost.mp4`

The Prelude beats render their fallback (`ResponsiveImage` over the
beat still) when the video 404s, which is why the Prelude is
"shipping" per the bible — but the cinematic beats are silently
flat right now. The bookend stills *are* live (those URLs come back
200), only the MP4s are missing.

### 2.7 Cinematics keyframes — **24 PNGs across 6 packs**

`apps/shared/expansionArt/cinematicsManifest.ts` declares cutscenes
for Acts 4 / 4.5 (DMC) / 5 / 6 / 7 plus "silence-of-two-witnesses"
— 4 keyframes per pack, 6 packs, 24 PNGs. **All 403.** Combined with
§2.6 this means the Act-2-through-Act-7 cinematic surface has its
manifests authored but no actual frames on the CDN.

### 2.8 Long tail (single-source DEADs ≤ 10 each)

Full list (sources with 100% dead URLs, excluding the card-def files
already covered in §2.1):

| Source | Dead | Surface |
|---|---:|---|
| `apps/shared/songSlideshows.ts` | 30/35 (86%) | Album slideshows for songs |
| `apps/client/src/data/nanobanna2Assets.ts` | 7 | Nano Banana 2 hero assets |
| `apps/client/src/data/companions/starterEidolonForms.ts` | 6 | Eidolon (Lux / Echo) starter forms |
| `apps/client/src/data/optionalComponentAssets.ts` | 5 | Optional-component placeholders |
| `apps/client/src/contexts/GameContext.tsx` | 5 | `art/rooms/room-dreams-workshop-subbasement.webp`, `room-guild-sanctum`, `room-station-dock`, `room-war-room`, `room-social-hub` |
| `apps/shared/celebrationParkMap.ts` | 4 | Celebration park map tiles |
| `apps/client/src/data/dmcAssets.ts` | 4 | Act 4.5 DMC assets |
| `apps/client/src/game/spriteSheetConfig.ts` | 3 | Sprite-sheet sources |
| `apps/client/src/pages/DischordianLogicSongPage.tsx` | 2 | Song-page bg + audio |
| 9 × single-asset misses (`Act2InterludePage`, `Act5InterludePage`, `EngineersBenchPage`, `GameMastersArenaAct2Page`, `act1CycleCWitnessing`, `TwoWitnessesPart2`, `SeerCardFlicker`, `roomStateAssets`, `wire-card-art`) | 1 ea | Per-page hero stills / single audio cue |

### 2.9 MIXED sources (partially live)

| Source | Live | Dead | Note |
|---|---:|---:|---|
| `literal-dgrsart-url` (hardcoded URLs across `*.ts`/`*.tsx`/`*.json`) | 37 | 54 | Worth deleting the 54 dead literals once their owners are identified |
| `terminus-swarm/TerminusSwarmPage.tsx` | 27 | 28 | Half of the Terminus Swarm set live |
| `CompanionSelectionScene.tsx` | 6 | 12 | Half of companion portraits live |
| `terminusCinematicAssets.ts` | 10 | 11 | One cinematic poster missing |
| `celebrationSlideshow.ts` | 8 | 9 | One missing |
| `mechronisSlideshow.ts` | 2 | 3 | One missing |

---

## 3. Cross-checks vs. production bible

The bible (§6.1) names `scripts/_check-art-coverage.mjs` as the
authoritative coverage probe; it HEAD-checks **928 producer keys**
covering Trade Empire, Hierarchy of the Damned, Dischordia base set,
cinematics, VFX, Album 1 & 5 slideshows, new-art manifest, and title-
page videos. **That probe requires AWS credentials and was not run in
this session** (CLAUDE.md ratchet item #40 in `AUDIT_2026-05_FINAL_TODO.md`
is still open on this — needs CI run).

This audit is the *unauthenticated* counterpart: it covers what the
*application code* references, regardless of whether those URLs are
listed in a typed manifest. The two are complementary:

- The producer-key probe (`_check-art-coverage.mjs`) catches uploads
  the producer promised but didn't deliver.
- This audit (`per-source-status.tsv`) catches application references
  to assets that were never registered in a typed manifest, plus
  manifest entries whose live status has drifted.

Of the ~394 dgrsart-dead URLs found here, the largest cluster (§2.1
card art, 211 URLs) is **not** covered by either typed manifest the
bible mentions — every card-def file builds its art path inline with
`assetUrl(\`art/cards/<cat>/<id>.webp\`)`. That's a registry gap as
much as an art gap: if the card art were threaded through a manifest
like `apps/shared/expansionArt/dischordiaBaseSet.ts` (which already
declares the *tier grid* art for the same set), it would land under
the ship-check gate and stop drifting silently.

---

## 4. Suggested follow-ups

In priority order — each is a separate piece of work, not a single
PR:

1. **Delete dead `room-artwork-urls.txt` and the 1,727 CloudFront
   references.** They're noise; they account for the headline "71%
   dead" but block nothing.
2. **Decide the prelude-room paths** (option 1 vs. option 2 in §2.2)
   and either land the path-rewrite PR or re-upload the Prelude-
   prefixed payload.
3. **Land card-art renders for `art/cards/{imprint,allegiance,class,
   element,race,dimension}/`** — 211 webps from the existing
   `NANO_BANANA_*.md` prompt packs.
4. **Register card art under a typed manifest** so the
   `aaaArtArchive`-style parity test can hold the line.
5. **Upload Mechronis Academy** (§2.3), **Outergroove tracks** (§2.5),
   **Prelude beat MP4s** (§2.6), **Act-2–7 cinematic keyframes** (§2.7).
6. **Re-run `scripts/_check-art-coverage.mjs` in CI with AWS creds**
   (item already on the TODO list).
7. **Triage the MIXED sources** (§2.9) — most are likely one or two
   genuinely-missing files each.

---

## 5. How to re-run

```bash
# regenerate URL → source extraction
bash docs/production/audit/extract-urls.sh

# probe every unique URL (uses curl HEAD, 48-way parallel; ~60s)
bash docs/production/audit/probe-cdn.sh

# inspect verdict tables
column -t -s $'\t' docs/production/audit/per-source-status.tsv | less
column -t -s $'\t' docs/production/audit/path-mismatches.tsv | less

# producer-key probe (needs AWS creds; covers ~928 manifest keys)
AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… \
  node scripts/_check-art-coverage.mjs
```
