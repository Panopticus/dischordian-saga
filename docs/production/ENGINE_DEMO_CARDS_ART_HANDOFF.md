# Engine Demo Cards — Art Production Handoff

Audit follow-up — closes the "card art slugs" item from the
post-audit list (item #7). The 10 cards landed in PR #430 / Phase H
of the hidden-systems audit; their art slugs are placeholders today.

Until the renderer falls through to the default frame, the cards are
playable but indistinct on the board. Producer task: paint art for
each of the 10 slugs and upload to the dgrsart S3 prefix.

## Card list

All 10 are in `apps/shared/tcg-core/cards/definitions/neutral/engine_demo_cards.ts`. Faction is `neutral` (any deck can run them). Set: `s1` (Season 1).

| Slug (S3 path) | Card | Cost | Stats / Type | Mood |
|---|---|---|---|---|
| `art/cards/s1_neutral_dispel_001.webp` | Cut the Threads | 2 | Spell | Antiquarian — unraveling a tapestry by hand. Silver thread, dim red wax. Mood: precise grief. |
| `art/cards/s1_neutral_push_001.webp` | Tidewall | 1 | Spell | A wall of water arriving a heartbeat before the wave. Cold coastal palette. Mood: defensive math. |
| `art/cards/s1_neutral_if_001.webp` | Witness Whose Time Has Come | 3 | Unit 2/3 | A robed figure stepping forward at a trial — half-illuminated, the other half deferring. |
| `art/cards/s1_neutral_zeal_001.webp` | Honor Guard | 3 | Unit 2/3 | Soldier in formal armor flanking an unseen general. Light spilling onto the figure from off-canvas left. |
| `art/cards/s1_neutral_pack_001.webp` | Wolfpack Initiate | 2 | Unit 1/2 | One wolf with teeth bared, a chorus of eyes in the surrounding dark. Pre-dawn palette. |
| `art/cards/s1_neutral_resurrect_001.webp` | Phoenix Cadre | 4 | Unit 4/4 | Soldier mid-resurrection — body still kneeling, light returning. Cinder reds and bone whites. |
| `art/cards/s1_neutral_oncardplayed_001.webp` | The Reading Room | 3 | Unit 2/3 | A library that listens. Open book, attentive lamp, an empty reading-chair as if just vacated. |
| `art/cards/s1_neutral_onmove_001.webp` | The Watchtower's Eye | 2 | Unit 2/2 | Lone watchtower silhouette; an enemy unit small in the foreground, just stepping into the searchlight. |
| `art/cards/s1_neutral_summonednear_001.webp` | The Hospitality Officer | 3 | Unit 2/4 | An attendant at a doorway, hand raised in a precise welcoming gesture, the room beyond uncannily ready. |
| `art/cards/s1_neutral_struct_001.webp` | The Anchor of Kael | 4 | Structure 4/8 | A massive iron anchor set into the floor of a chamber that has clearly been built around it. Kael's mark cast in iron. |

## Specs (per `docs/ART_DEPARTMENT_PRODUCTION.md` §2 + §6)

- **Format**: WEBP, sRGB, 1024×1024 minimum (matches existing `art/cards/*.webp`).
- **Aspect**: square crop; the in-game card frame masks the portrait area.
- **Style**: neutral-faction cards lean atmospheric over chromatic — see `art/cards/s1_char_004.webp` (Ambassador Veron) as the closest existing reference.
- **Filename**: lowercased, snake_case, exactly matches the slug above. Renderer tries the slug verbatim against the CDN.

## Upload

Producer pipeline:

```bash
# Dry-run first to see what would change
pnpm assets:upload:dry

# Upload (idempotent ETag compare; only changed files round-trip)
pnpm assets:upload
```

The upload script (`apps/scripts/upload-public-to-s3.ts`) mirrors `apps/client/public/art/cards/` to `s3://dgrsart/cdn/client-public/art/cards/`. After upload, the renderer picks up the new files automatically — no code change required.

## Verification

After upload:

```bash
pnpm tsx scripts/_check-art-coverage.mjs
```

Confirms every card with a slug has a HEAD-reachable art URL. The coverage probe's count should bump by 10 once these land.

## Why these cards

Each exercises one engine surface area the original audit annotated as `// reserved` in `apps/shared/tcg-core/types/{Effect,Trigger,Card}.ts`. PR #430 implemented the runtimes; these are the demo cards that prove the runtimes work. Without them, the next audit run will re-flag the surfaces as unused.
