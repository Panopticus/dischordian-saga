# Ship-Readiness Audit — 2026-05-22

Full inventory of every asset on `s3://dgrsart/cdn/client-public/`
cross-referenced against every static + dynamic code reference in the
repo. Produced by walking the bucket (boto3 `list_objects_v2`), then
scanning every `assetUrl(...)` call, every hard-coded S3/CloudFront URL,
every `relPath:` in `apps/shared/expansionArt/*.data.ts`, every `art:` /
`artUrl:` field on every card definition, every entry in every VO
manifest, and every entry in `apps/shared/songSlideshows.ts`.

## TL;DR

| Metric | Count |
|---|---:|
| CDN objects on `dgrsart/cdn/client-public/` | **12,718** (31.14 GB) |
| Distinct code references (static + expanded dynamic) | **5,511** |
| ✅ Wired (referenced and present) | **5,257** |
| ❌ Missing (referenced but not on CDN) | **254** |
| ⚠ Orphans (on CDN but no code reference) | **6,016** |
| Code refs to **legacy** `d2xsxph8kpxj0f.cloudfront.net` (old CDN) | **2,211** (1,671 distinct paths) |
| Code refs to `dgrsvoices.s3` (separate VO bucket) | **2,635** |

The single largest wiring bug, by far, is **the card art rename**:
the producer renamed every card PNG from the legacy
`s1_<category>_<faction>_t<n>.webp` slug to a descriptive
`<snake_case_name>.webp`, but the card definitions in
`apps/shared/tcg-core/cards/definitions/**/*.ts` still reference the old
slugs. **105 cards have an auto-mapped fix; 49 more need producer input.**
See `card-art-rename-map.md` in this same directory for the full mapping.

The second largest is the **legacy CloudFront migration**: 2,211 still
point at `d2xsxph8kpxj0f.cloudfront.net`. These are inherited from the
old AWS account and need to be rewritten to the canonical
`dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/` prefix via the
already-present `assetUrl()` helper.

## Files in this directory

| File | Contents |
|---|---|
| `SHIP_READINESS.md` | This file — top-level summary + action plan |
| `cdn-inventory.tsv` | Every CDN object: `key\tsize_bytes\tlast_modified` (12,718 rows) |
| `cdn-matched.tsv` | Every CDN object that **is** referenced by code: `key\tref_count\tsize\tlm` (5,257 rows) |
| `cdn-missing.tsv` | Every code reference whose CDN object **does not exist**: `key\tref_count\tfirst_3_cites` (254 rows) |
| `cdn-orphans.tsv` | Every CDN object **nobody references**, sorted by size desc (6,016 rows) |
| `cdn-templates.tsv` | Dynamic template references the static scanner couldn't resolve (77 rows) |
| `code-asset-refs.tsv` | Raw static scan of code references (7,273 rows incl. all buckets) |
| `code-asset-refs-dynamic.tsv` | Programmatic expansions (suit catalog × rarity × slot, card defs, expansion-art manifests, VO manifests) (3,571 rows) |
| `code-asset-refs-all.tsv` | Union of the above two |
| `missing-by-category.md` | The 254 missing entries grouped by `art/<sub>/`, with CDN candidates suggested where similar names exist |
| `card-art-rename-map.md` | Per-card-definition rewire table (1,177 cards parsed; 1,023 wired; 105 auto-rewired; 49 unmapped) |
| `apply-card-art-rename.sh` | One-shot rewrite script that applies the high-confidence rewires in card-art-rename-map.md (`--dry-run` or `--apply`). 84 substitutions ready. |
| `cdn-coverage-by-category.md` | Per-subfolder CDN coverage table (`art/cards/` 87 %, `art/portraits/` 91 %, etc.) so you can see at a glance which subsystems are wired and which are drifting |
| `audit-art-prompts.md` | Every art file's prompt + spec verbatim — 31 sections covering suit sets (1,080 entries), seasonal/event/vote variants (parametric), earned-loadout artifacts (15), awakening cinematics (10), room states + tiers (14), Section F hero stills + videos (34), and every other prompt-bearing module in the repo (626 lines) |
| `audit-cutscenes.md` | Every cutscene script + video URL + VO file — 18 sections covering ~260 distinct cutscenes including opening / awakening / animated registry / hero cinematics / per-act / mid-match dialog / chapter intros / wheel reactions / confession close / guild / expansion / chess / discovery / terminus / climax / palimpsest / galactic dance (673 lines). Each entry has the trigger, video CDN URL, full dialogue text where present, and a `SCRIPT MISSING` / `VIDEO MISSING` flag when applicable. |
| `audit-summary.txt` | Raw machine summary (also embedded in this file) |

## Action plan — priority order

### P0 — Ship blockers (visible to players, fix before launch)

1. **Card art rename** (165 broken `art:` references across `apps/shared/tcg-core/cards/definitions/**/*.ts`).
   - 105 have a high-confidence one-line rewire ready in
     `card-art-rename-map.md` → "Auto-mapped" section. Apply
     mechanically.
   - 49 are ambiguous (multiple folder candidates, or the producer did
     not ship that specific tier). Resolve with the producer.
   - Affects every faction (Antiquarian, Architect, Dreamer, Insurgency,
     New Babylon, Thought Virus) and every class (Assassin, Engineer,
     Neyon, Oracle, Soldier, Spy) at minimum.

2. **Body silhouettes missing** (`art/bodies/{human,demagi,quarchon,neyon}.png`).
   - PaperDollBG3's species silhouette layer 403s for every species.
   - The 8 species-set base layers cover the body so it doesn't appear
     broken to the player, but it's still a hole in the rendering pipeline.
   - Either ship the four PNGs (1024 × 1536, transparent) or remove the
     BodyLayer call site from `apps/client/src/components/PaperDollBG3.tsx:140`.

3. **Recruit portraits** (24 missing files in `art/recruits/`).
   - Five recruits (akai_shi, jericho_jones, vex_solene, wraith_calder)
     each expect 5 emotional-state portraits (base / considered / neutral
     / warm / wary). Cited by recruit-UI components.

4. **Title screen videos** (3 missing entries under `videos/title/`).
   - The TitlePage's `DischordiaOpeningCinematic` expects
     `videos/title/the-dischordia-opening.mp4`. That file **does** exist
     on CDN (it's the 30.7 MB orphan in §Orphans below), so this is
     likely a path-typo issue in code. Verify the exact `assetUrl(...)`
     argument resolves to a `videos/title/*` key that's actually on S3.

5. **`art/cades/*` placeholders** (6 entries that look like template
   fragments — e.g. `art/cades/characters/`, `art/cades/enemies/`).
   These are `assetUrl("art/cades/...")` calls in
   `apps/client/src/data/cadesAssets.ts:137-144` that haven't been
   completed. Filling them in is a code-side task, not a CDN one.

### P1 — Wiring debt (silent on players, but blocks ship)

6. **Legacy CloudFront migration** (2,211 references to `d2xsxph8kpxj0f.cloudfront.net`).
   - All of these should be rewritten to the canonical `assetUrl(...)`
     helper so we're not on two CDNs in production.
   - `apps/scripts/rewrite-asset-refs.ts` exists for this; run it with
     `--dry-run` first.

7. **Audio/elara orphans** (1,214 MP3s in `cdn/client-public/audio/elara/`).
   - These are a **duplicate** of the canonical `dgrsvoices.s3` bucket
     used by the awakening VO player. Either delete from `cdn/` to save
     ~? GB (verify total size), or rewire the code to use `cdn/` and
     retire `dgrsvoices`. The first option is cleaner.
   - Same for `audio/human/` (807 orphans).

8. **`art/rooms/`** (~10 missing). Several `assetUrl("art/rooms/...")`
   calls reference paths like `art/rooms/` (bare prefix) or
   `art/rooms/mystery-states`. These are template-construction bugs in
   `apps/shared/roomMediaPrompts.ts`-adjacent code; resolve in code.

### P2 — Cleanup (do later)

9. **Orphan triage** (6,016 entries on CDN that nothing references).
   Largest are pre-rendered MP4 cinematics (planet_of_the_wolf at
   426 MB, welcome-to-celebration at 407 MB, necromancers_lair × 2 at
   346 MB each — that's a duplicate upload, ~346 MB to recover). Total
   orphan storage is several GB. Decide which are intentional drops
   awaiting code-side wiring vs. truly retired.
   - Top 20 by size are in `audit-summary.txt`; full list in
     `cdn-orphans.tsv`.

10. **Empty top-level prefixes nothing references at all**: `cabin-art/`
    (43 files), `casino/` (65 files), `nilmorg-portraits/` (5 files),
    `page-backgrounds/` (12 files), `vfx-atlases/` (21 files),
    `vo/` (45 files). These have ZERO matched code references — likely
    legacy drops or in-progress features. Audit each top-level prefix
    against the design bible before deleting.

## Suit-catalog coverage (paper-doll)

The 9 active suit sets each ship **10 of 16 slots** at all 5 craftable
rarities. The 10 shipped slots are:

  head, chest, shoulders, arms, gloves, belt, legs, feet, back, weapon-primary

The 6 not-yet-shipped slots are:

  face, neck, weapon-offhand, aura, ring-1, ring-2

`base-mask` and `base-suit` literal paths are 403 but are
**intentionally** not shipped — the starter `mask:…` / `suit:…` sentinels
in card data route through `parseSuitPieceArtId()` to a class set's
head/chest slot, so they reuse the catalog art.

The 9 sets shipped are:

| Set ID | Category | Pieces shipped |
|---|---|---|
| `regalia-of-the-seeing-stylus` | class — oracle | 50 (10 × 5 rarities) |
| `pressure-loom-harness` | class — engineer | 50 |
| `black-crepe-weave` | class — assassin | 50 |
| `bulwark-of-the-eighth-column` | class — soldier | 50 |
| `low-profile-tailoring` | class — spy | 50 |
| `the-mourners-coat` | foundation — humanity | 50 |
| `arcane-rune-regalia` | species — demagi | 50 |
| `clockwork-exoframe` | species — quarchon | 50 |
| `hybrid-vein-panoply` | species — neyon | 50 |

That's **450 of the planned ~720** suit PNGs shipped. The remaining 270
are face/neck/weapon-offhand/aura/ring-1/ring-2 for each of the 9 sets ×
5 rarities = 270, plus 9 sets × `mythic` rarity for the 10 already-shipped
slots if we want mythic suits = 90 more. Plan accordingly.

## Prior in-repo audit artifacts (worth knowing)

The repo already has a targeted audit pass at `docs/production/audit/`
that complements this report:

- `docs/production/audit/cdn-liveness.tsv` — 3,002 hand-curated URL
  liveness probes (status code per URL per source file). Targeted at
  the known-fragile paths, not a full bucket walk.
- `docs/production/audit/path-mismatches.tsv` — 17 canonical drift
  entries (e.g. prelude room paths split between
  `art/rooms/prelude/<room>.png` in code vs `art/rooms/<room>.png` on
  CDN). Fix these in code, not on CDN.
- `docs/production/audit/dead-urls/` — per-file dead-URL reports for
  74 source files (most are TCG card definitions reflecting the same
  card-art rename issue I caught here).
- `docs/production/audit/awakening-cutscene-revision-2026-05.md` and
  `chapter-intro-canon-gap-2026-05.md` — narrative-driven gap reports.
- `output/suit-art-prompts.md` — fully-rendered (non-parametric) twin
  of the 1,080 suit-piece prompts (~10K lines), useful for handing
  individual prompts to the producer.

Use the prior audit for **targeted in-flight tracking** of known
hotspots and this audit for **comprehensive at-rest status** before
ship. The two don't conflict — `path-mismatches.tsv` entries appear
in my `cdn-missing.tsv` too, with the same proposed fix.

## Methodology

- CDN inventory via `boto3 list_objects_v2` paginated full walk of
  `s3://dgrsart/cdn/client-public/` (no key prefix filter).
- Static code refs by regex over `apps/client/src/`, `apps/shared/`,
  `apps/server/`, `apps/scripts/`, `apps/db/`, `apps/e2e/`, `docs/`:
  - `assetUrl(\`…\`)`, `assetUrl("…")`, `assetUrl('…')`
  - `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/<key>`
  - `https://dgrsart.s3.us-east-2.amazonaws.com/<key>` (root-level)
  - `https://dgrsvoices.s3.us-east-2.amazonaws.com/<key>`
  - `https://d2xsxph8kpxj0f.cloudfront.net/<key>`
- Dynamic refs by expanding known runtime generators:
  - `suitArtUrl(setId, rarity, slot)` for every (setId, rarity, slot) in
    `SUIT_SET_ROSTER × RARITY_ORDER × SUIT_SLOT_ORDER`
  - `bodyArtUrl(species)` for `{human, demagi, quarchon, neyon}`
  - Every `relPath:` in every `apps/shared/expansionArt/*.data.ts`
  - Every `art|artUrl|imageUrl|cardArt|thumbnail:` field on every
    `CardDefinition` in `apps/shared/tcg-core/cards/definitions/**/*.ts`
  - Every audio URL embedded in `apps/shared/*VoManifest.json`
  - Every `audio/...` and `art/slideshows/...` literal in
    `apps/shared/songSlideshows.ts`
- Match accepts `.webp` ↔ `.png` ↔ `.jpg` partners (the browser's
  `<picture>` fallback handles the format switch at runtime).
- Trivial regex artifacts (template fragments like `"art/" + slug`,
  `<path>`, etc.) are filtered out of the missing list.

To re-run: see the scripts in `/tmp/audit_*.py` (kept ephemeral; copy to
`apps/scripts/audit/` if we want them in-repo for regression).

## Other-bucket appendix

### `dgrsvoices.s3.us-east-2.amazonaws.com` (Elara/Human VO)

This bucket is **not** included in the CDN inventory above. It hosts the
awakening voice-over MP3s and the per-act character VO. 2,597 distinct
paths referenced in code, mostly through
`apps/shared/<character>VoManifest.json` (Elara, Human, Antiquarian,
Kael, etc.). The orphans of `cdn/client-public/audio/elara/` and
`audio/human/` (mentioned above) are duplicates of this bucket and
should be reconciled.

### `dgrsart.s3.us-east-2.amazonaws.com/<root>` (non-CDN-prefix)

154 references not under `cdn/client-public/`. Most are direct image
URLs in `apps/client/src/components/...` that pre-date the
`assetUrl()` helper. Migrate to `assetUrl()` for consistency.

### `d2xsxph8kpxj0f.cloudfront.net` (legacy CDN)

2,211 references across 1,671 distinct paths. Migration plan in P1 §6.
