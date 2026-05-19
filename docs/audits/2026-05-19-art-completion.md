# Art Completion Audit — 2026-05-19

**Scope.** Every asset URL referenced from `apps/client/src`, `apps/shared`,
and the `*VoManifest.json` voice manifests, probed via unauthenticated
`HEAD` against the production CDN (`dgrsart.s3.us-east-2.amazonaws.com`)
plus the legacy CloudFront origin.

**Source data (regenerated against the current branch HEAD on 2026-05-19):**

- `docs/production/audit/all-urls.tsv` — raw URL ↔ source extraction
- `docs/production/audit/cdn-liveness.tsv` — `code ↔ url ↔ source`, one row per unique URL
- `docs/production/audit/per-source-status.tsv` — `source ↔ live ↔ dead ↔ pct ↔ verdict`
- `docs/production/audit/path-mismatches.tsv` — manifest URL → known-good alternate path

Two bugs in the prior audit data have been fixed:

1. `extract-urls.sh` only matched `assetUrl("…")` — it missed the
   `pair("…")` helper in `preludeAct1Deliverables.ts` that wraps half
   the Prelude / Act 1 URLs. Now `pair("x.png")` is correctly expanded
   to both `x.png` and `x.webp`. (+206 URLs surfaced)
2. The committed `cdn-liveness-files.tsv` was generated against an
   older version of the imprint card files (before the `s1_imprint_*`
   → bare-name rename), so it phantom-reported 90 imprint cards as
   missing that actually exist on the CDN. The path-mismatch scanner
   was reading the stale file. Both now read `cdn-liveness.tsv`.

Regenerate locally:

```bash
bash docs/production/audit/extract-urls.sh
bash docs/production/audit/probe-cdn.sh
bash docs/production/audit/scan-path-mismatches.sh
```

Caveat: probes are unauthenticated. The dgrsart bucket returns `200`
for public objects, `403` for missing or non-public ones. In practice
the application prefix `cdn/client-public/` is public-by-policy, so a
`403` there means **missing on CDN**.

---

## 1. Headline (revised)

| Surface | Count |
|---|---:|
| Unique asset URLs referenced in code | **3,903** |
| Live (HTTP 200) | **1,883** (48%) |
| Dead (HTTP 403) | **2,018** (52%) |
| `ERR` (transient probe failures, < 0.1%) | **2** |

The 2,018 dead URLs break down sharply:

| Bucket | Dead | Notes |
|---|---:|---|
| Legacy CloudFront (`d2xsxph8kpxj0f.cloudfront.net`) | **1,727** | All from `room-artwork-urls.txt` + 5,579 source-code references across the client + server. Origin is decommissioned; these are dead refs left over from the May 2026 CDN migration. Out of scope for an art audit, in scope for a migration cleanup PR. |
| `dgrsart` (the live CDN) | **291** | The real, actionable art gap. |

So **the actionable art gap is 291 URLs, not 2,121.** The original
audit was off by an order of magnitude because of the two scanner
bugs.

---

## 2. The 291 dgrsart dead URLs — by category

```
113   art/cards/{allegiance,class,element,race,dimension}/*.webp   (TCG categorical)
 56   literal-dgrsart-url (mixed)
 40   art/cards/<single-card>.webp                                  (TCG single cards)
 24   art/recruits/<name>_<emotion>.webp                            (4 recruits × 6 emotions)
 13   art/slideshows/album{2,4}/T<NN>/T<NN>_00_title.webp           (Album slideshow titles)
 11   art/specimens/* + ship/bunkroom + ui/* + dischordian-logic    (Misc art)
 10   art/cinematics/* (small remnant, mostly addressed)            (Cinematic frames)
  9   audio/{album1,music,songs,antiquarian}/*                      (One-off audio)
  6   videos/discoveries/entity_{N}.{webm,mp4}                      (Discovery videos)
  5   audio/ambient/celebration + scene rooms                       (Misc)
  4   art/fighters/{architect,collector,enigma}                     (Fighter sprites)
```

### 2.1 Genuine producer gap — `art/cards/{allegiance,class,element,race,dimension}/*.webp` (113 webps)

The TCG card subset that's actually missing on the CDN:

| Subfolder | Pattern | Count |
|---|---|---:|
| `art/cards/allegiance/s1_alleg_<faction>_t<1-6>.webp` | 6 factions × 6 tiers | **36** |
| `art/cards/class/s1_class_<class>_<01-05>.webp` | 6 classes × 5 cards | **30** |
| `art/cards/element/s1_elem_<elem>_<01-05>.webp` | 4 elements × 5 cards | **20** |
| `art/cards/race/s1_race_<race>_<01-03>.webp` | 5 races × 3 cards | **15** |
| `art/cards/dimension/s1_dim_<dim>_<01-03>.webp` | 4 dimensions × 3 cards | **12** |

No path-rewrite alternates exist (verified by direct HEAD probes
against `art/cards/elemental/`, bare-name, png/jpg flips, `tcg/`
prefix). These are genuinely not on the CDN under any naming. The
`NANO_BANANA_*.md` prompt packs at the docs root cover this set —
the prompts are written; the renders need to be produced and
uploaded.

### 2.2 Single-card misses (~40)

Scattered one-off misses under `art/cards/<faction>/<id>.webp`:
hierarchy of the damned (3), neutrals (4 — `burnt_card_placeholder`,
`gen_seer`, `gen_programmer`, `gen_game_master_original`), engine
demo (10), architect (8 incl. `gen_authority`, `s1_warlord_three_moves`,
`s1_char_018_the_antiquarian`), new_babylon (5), insurgency (5),
dreamer (3), antiquarian (5), thought_virus (2), house_oath_titles (2),
panopticon (4), and a few others. Each is a single missing webp.

### 2.3 Recruits (24)

`art/recruits/{akai_shi,jericho_jones,vex_solene,wraith_calder}_
{base,considered,neutral,vulnerable,warm,wary}.webp` — emotion-state
portraits for the 4 recruit characters. Referenced as literal URLs
in component code. None on CDN.

### 2.4 Album slideshow titles (13)

`art/slideshows/album{2,4}/T<NN>/T<NN>_00_title.webp`:
- Album 2: T05, T06, T15 (3 titles)
- Album 4: T01–T10 (10 titles)

Frame-zero / title cards. The body frames are largely present —
this is just the cover-card slot per track.

### 2.5 Long-tail (~85)

| Pattern | Count | Notes |
|---|---:|---|
| `art/cinematics/<act>/frame0X.webp` | ~5 | Most cinematics keyframes are now live; this is a small remnant |
| `art/specimens/*-fragment.png` + bare names | 12 | Dreamer-fragment specimens (toxis, strain, sibyl, nyx, auros, cog, etc.) |
| `art/ui/*.webp` | 4 | `card-frame`, `deck-bg`, `graph-bg`, `leaderboard-bg` |
| `art/rooms/room-{war-room,social-hub,guild-sanctum,station-dock,dreams-workshop-subbasement}.webp` | 5 | Late-game scene rooms (`GameContext.tsx`) |
| `art/fighters/{architect,collector,enigma}` | 4 | Fighter sprite atlases (`spriteSheetConfig.ts`) |
| `audio/album1/T{11,18,23}.mp3` | 3 | Three missing album1 tracks |
| `audio/music/{celebration,mechronis,songs}/*.mp3` | 4 | `welcome-to-celebration`, `to-be-the-human`, `song_last_words_prelude_full`, `dischordian_logic` |
| `videos/discoveries/entity_{4,5,6,7,8,9}.{webm,mp4}` | ~6 | Late-discovery videos |
| Page-level 1-offs | ~30 | Scene rooms / posters / audio cues across `Act2Interlude`, `Act5Interlude`, `EngineersBench`, `GameMastersArena`, `BunkroomPage`, etc. |
| Bare-prefix probes (`cdn/casino`, `cdn/client-public/`, `cabin-art/items`) | ~8 | Dead-end / probe artifacts; many are legacy prefixes |

---

## 3. Mostly-working surfaces

Several surfaces that the previous audit flagged as 0% are actually
100% live in the fresh data:

- **Mechronis professors / classmates / houses** — all `art/mechronis/
  {professors,classmates}/*.{png,webp}` are live. Only `audio/music/
  mechronis/to-be-the-human.mp3` is missing.
- **Prelude rooms** — all 26 `art/rooms/prelude/room-<X>.{png,webp}`
  variants are live. The earlier-claimed path-mismatch with top-level
  `art/rooms/` resolves because *both* prefixes are populated.
- **Imprint card art** — all 90 imprint slots (18 NPCs × 5 tiers) at
  `art/cards/imprint/<name>_t<N>.webp` are live. The previous audit's
  "90 missing imprint webps" was a phantom from stale extraction
  data.
- **Battlefields, cutscenes, VFX, audio beds, cades FPS, christmas-
  in-july** — all live. Previous "0% live" flags were stale-data
  artifacts.

---

## 4. What needs producer work vs. what needs code/upload

### Needs producer renders (no asset exists anywhere on CDN)

1. **§2.1 TCG categorical card art** — 113 webps. `NANO_BANANA_*.md`
   prompt packs ready. This is the single biggest gap.
2. **§2.3 Recruits emotional portraits** — 24 webps.
3. **§2.4 Album 2 + Album 4 title cards** — 13 webps.
4. **§2.2 ~40 one-off card webps** — scattered across factions.
5. Various long-tail (§2.5) — ~85 misc assets.

### Needs code-side cleanup (no asset needed)

1. **Legacy CloudFront migration** — 5,579 references across 53+
   client/server files (`AppShellImmersive`, `OpeningCinematic`,
   `RoomTutorialDialog`, `ElaraDialog`, `InlineShipMap`,
   `securityHeaders`, etc.) all hardcode `d2xsxph8kpxj0f.cloudfront.
   net` URLs. The CloudFront origin is dead, so every one of these
   is a broken reference. Each needs to be mapped to its current
   `assetUrl(...)` equivalent (most exist on dgrsart already).
   Separate workstream from art completion proper.

### Needs AWS creds (cannot be done in this session)

The producer-key probe `scripts/_check-art-coverage.mjs` covers 928
typed-manifest keys (Trade Empire, Hierarchy of the Damned,
Dischordia base set, cinematics, VFX, albums, new-art manifest,
title videos). It needs `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`
to disambiguate "missing" from "missing-public-acl" via authenticated
HEAD. Open ratchet item in `AUDIT_2026-05_FINAL_TODO.md`.

---

## 5. Suggested next moves

1. **Land the 113 categorical card webps.** Largest impact, prompts
   ready, well-defined drop. Once landed, register `art/cards/`
   under a typed manifest (similar to `aaaArtArchive/`) so the
   ship-check gate covers it going forward.
2. **CloudFront migration sweep** — separate PR, mechanical
   find-and-replace from the 5,579 hardcoded URLs to `assetUrl(...)`
   equivalents. Verify each replacement against the dgrsart bucket
   first.
3. **Recruits + album title cards** — 37 misc webps, well-scoped
   producer drop.
4. **Long-tail one-offs** — triage source by source; some are
   probably orphaned references from removed features.
