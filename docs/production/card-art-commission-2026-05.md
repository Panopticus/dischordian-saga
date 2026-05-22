# Card-art commission backlog — 2026-05-22

Outstanding card art that has no candidate on CDN and must be commissioned.

After the cross-folder resolver (`scripts/audit/resolve-card-art-unmapped.ts`)
re-scanned the 49 originally-unmapped cards against the full inventory,
exactly **1 card** has no recoverable match. The four other cards
initially routed here all turned out to have existing producer files
under renamed slugs and were promoted out of the backlog (see
`audit/ship-readiness-2026-05-22/card-art-rename-map.md` —
"Producer verify" section for the by-elimination matches).

---

## Card 1 of 1 — The Master of R'lyeh, the Sleeping Reader

| Field | Value |
|---|---|
| **Card ID** | `s2_hierarchy_lord_master_of_rlyeh` |
| **Faction** | `hierarchy_of_damned` (S2 expansion · Hierarchy of the Damned) |
| **Rarity / Cost** | legendary · 8 |
| **Tier** | demon-lord (2 of 4 canonical hierarchy lords) |
| **Sibling refs on CDN** | `art/cards/hierarchy/the_pale_emissary.webp`, `art/cards/hierarchy/the_reckoning_daughter.webp` — match their palette, lighting register, and frame composition |
| **Target CDN path** | `cdn/client-public/art/cards/hierarchy/lord_master_of_rlyeh.webp` |
| **Card def** | `apps/shared/tcg-core/cards/definitions/s2_hierarchy/master_of_rlyeh.ts` |

### Why this needs new art (not a rename)

The file `art/cards/architect/master_of_rlyeh.webp` exists but belongs
to a **different card** — the S1 Architect tier-5 character
`s1_char_013_master_of_rlyeh`, which still resolves correctly through
its legacy slug `art/cards/s1_char_013.webp` (also on CDN). The S2
hierarchy-lord variant is a separate card with its own lore beat,
mechanics, and tier, and must not share the S1 Architect's portrait.

### Format spec (canonical card-art)

- **File**: `lord_master_of_rlyeh.webp`
- **Container**: WEBP, lossless or near-lossless (`q=95`+); sRGB color space
- **Dimensions**: **1024 × 1024 px** (square; in-game card frame masks the portrait area)
- **Bit depth**: 8-bit; no embedded ICC profile beyond sRGB
- **Background**: full bleed to all four edges; do not crop in card-frame chrome
- **Companion `.png`**: optional but recommended — same basename, same dimensions, same upload location. The `<picture>` fallback in the client prefers WEBP but renders PNG on older surfaces.

### Lore signature (from `apps/shared/hierarchyOfTheDamned.ts`)

> Second demon-lord. Reads dreams as if they were bound volumes.
> Catalogues the Potentials' nightmares before they become memory; the
> cataloguing IS the corruption. The Master never wakes, and the
> not-waking is the Hierarchy's most patient strategy.

### Mechanical signature (from the card def)

- 5 power / 15 health body, `provoke` keyword — anchors a board he never has to leave
- On each owner turn start: opponent **mills 1** (the page being filed under their name) + he gains a **permanent +1/+1** (the thumbprint that cannot be scrubbed off)
- Verdict delta −2; trial categories: evidence, narrative

### Flavor text (must visually echo)

> "He does not wake. The book closes by its own slow weight. Your dream
> is still on the shelf — slightly thicker than before."

### Commission prompt

Use against the same Nano Banana 2 (`gemini-3-pro-image-preview`) image pipeline documented in `docs/production/_PRODUCTION_FINAL.md` §0.2.

```
SUBJECT
A robed, ageless demon-lord seated in deep sleep at the head of an
endless library of bound human dreams. Eyes closed. One hand rests
open-palmed on a thick, leather-bound tome; the tome is closing
itself by its own weight onto an unfinished page. The page bears a
half-written name in dark ink. Behind him, the library recedes
impossibly — shelves of identical leather spines stretching into
oceanic dark, each spine subtly different in only one detail
(thumbprint, watermark, single underlined word) so the eye finds no
two alike. He has not moved in centuries; dust has accreted on his
shoulders in soft, undisturbed drifts.

COMPOSITION
Square 1:1 frame, 1024×1024. Three-quarter portrait, subject centered
slightly above the horizontal midline. The closing book lower-left,
catching the eye second. Library depth recedes to the upper-right
vanishing point. The viewer reads in this order: face → closing book
→ infinite shelves.

PALETTE & LIGHTING
Match the existing S2 Hierarchy lord cards
(art/cards/hierarchy/the_pale_emissary.webp,
art/cards/hierarchy/the_reckoning_daughter.webp) — deep oceanic
blue-blacks, oxidized brass, parchment cream, candlelit ember
accents. One concealed warm light source (a sleeping reading-candle,
half-melted) catches the face from below and dies into the library
dark. No daylight, no synthetic light. The whole image carries the
register of "submerged cathedral" rather than "library" — water-pressure
quiet.

MOOD
Patient corruption. He is doing the worst possible thing — cataloguing
your nightmares before they become memory — by doing nothing at all.
The threat is not action; the threat is the steady accrual that
cannot be undone. Stillness as antagonism. Cold reverence.

SYMBOLIC DETAILS (must include at least three)
- The closing book whose closure is visibly inevitable but not yet
  complete — a fraction of a second from contact
- A second, even thicker volume to his right, already shelved, with
  a single fingerprint smudged into its spine
- His reading-glasses folded beside him, unworn — he reads without
  them, in sleep
- A faint thumbprint embossed in the air around him (the
  "thumbprint that cannot be scrubbed off" — the permanent +1/+1
  mechanic visualized)
- One sheet of dream-pages drifting upward from the deeper shelves,
  caught mid-archive — not falling, ascending toward him

NEGATIVE PROMPT
no open eyes, no awake expression, no overt menace, no fangs, no
visible motion blur, no contemporary library furniture, no clean
modern typography on book spines, no chiaroscuro that resolves the
library depth into a finite room, no fire/flame larger than a single
candle, no aquatic creatures, no obvious cthulhu pastiche, no
text/captions/watermarks/UI chrome in the image, no card frame

STYLE
Painterly digital, oil-paint surface with restrained brushwork; the
"submerged cathedral" register of the existing Hierarchy lord cards.
Photoreal anatomy, illustrated atmosphere. No anime stylization. No
cel-shading.

OUTPUT
1024×1024 WEBP (and matching PNG sibling), full bleed, sRGB.
```

### Producer delivery checklist

- [ ] `lord_master_of_rlyeh.webp` (1024×1024, sRGB, q≥95)
- [ ] `lord_master_of_rlyeh.png` (same dimensions, lossless — optional but recommended for the `<picture>` fallback)
- [ ] Upload via `pnpm assets:upload` after dropping both files at `apps/client/public/art/cards/hierarchy/`
- [ ] Verify on CDN: `curl -I https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/cards/hierarchy/lord_master_of_rlyeh.webp` → 200
- [ ] No card-def edit needed — `s2_hierarchy/master_of_rlyeh.ts` already points at the target path
