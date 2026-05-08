# Consolidated Missing-Asset Prompts — 2026-04-25

> **Dispatch-ready prompt pack** for every asset confirmed
> not-live AND actionable. PR #180 (221 URLs) is **excluded** —
> per user direction, those bytes exist on a dev machine and just
> need `pnpm assets:upload`. Legacy CloudFront (1,727 URLs) is
> **excluded** — pending user investigate-before-deciding routing.
>
> Authoritative source for "what's missing": the audit doc at
> `docs/production/ART_AUDIT_VERIFIED_2026-04-25.md` and the
> per-URL ledger at `docs/production/audit/cdn-liveness-files.tsv`.

## Index

1. Pipeline conversions (zero-cost ffmpeg)
2. Mechronis Academy classroom backgrounds (12 NB2 prompts)
3. Mechronis Houses common rooms + ambient (4 NB2 + 4 Suno)
4. Mechronis Classmates portraits (8 NB2)
5. Outer Groove album (10 Suno tracks + 1 NB2 cover)
6. Celebration Park ambient (4 Suno)
7. Specimen fragment portraits (6 NB2)
8. Acts 4-7 spine cinematics (30 assets across 6 cinematics)
9. Page-background images (10 NB2)
10. Slideshow audio gaps (2 Suno)
11. Loredex Discovery videos (8 Kling)
12. TCG card definition tier-up art (221 NB2; linked, not inlined)
13. Acts 2-7 + Architect VO recording (8 manifests; linked)
14. Excluded categories (recap)

Each prompt entry follows the shape:

```
### asset_id
- Output: <CDN target path>
- Tool: <NB2 / Veo 3.1 / Suno / Kling / ElevenLabs / ffmpeg>
- Priority: P0 / P1 / P2

#### Prompt
[verbatim]
```

For categories with bibles already authored elsewhere (TCG card
art, Acts 2-7 VO), the entry links the source bible rather than
inlining hundreds of prompts that operators dispatch from those
files anyway.

---

## §1 — Pipeline conversions (zero-cost ffmpeg)

These don't need new renders — they need format conversions of
intermediate files. Run on the dev machine that holds the PR #180
bundle BEFORE running `pnpm assets:upload`.

### 1.1 Prelude room PNG → WebP (13 rooms)

The `preludeAct1Deliverables.ts` registry treats 9 rooms as
"PNG-only intermediates" with the WebP path falling through to
the PNG (see `corridor`, `galley`, `mess-hall`, `briefing-room`,
`medical-bay`, `comms-array`, `archives`, `armory`,
`captains-quarters` in the registry). Convert each to WebP for
~16× size reduction.

```bash
for f in apps/client/public/art/rooms/prelude/*.png; do
  cwebp -q 88 "$f" -o "${f%.png}.webp"
done
```

### 1.2 Prelude VFX MP4 → WebM VP9 alpha (6 source MP4s)

Six VFX source MP4s in `PRELUDE_VFX_SOURCE_MP4S` are intermediate
renders that should ship as alpha-channel WebMs for in-browser
overlay use:

```
cryo-frost-retreat.mp4
pod-hatch-cryogas.mp4
hologram-materialize.mp4
breath-pulse-strip.mp4
sepia-drain.mp4
film-damage-overlay.mp4
```

```bash
for f in apps/client/public/art/vfx/prelude/*.mp4; do
  ffmpeg -i "$f" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 \
    -auto-alt-ref 0 -lag-in-frames 0 -an "${f%.mp4}.webm"
done
```

### 1.3 Prelude ambient WAV → MP3 + EBU R128 loudnorm (3 beds)

Three ambient WAVs in `PRELUDE_AMBIENT_BEDS_DELIVERED`:

```
ambient_neural_rig_hum.wav
ambient_transfer_array_standby.wav
ambient_bridge_powered_systems_mix.wav
```

```bash
# Two-pass loudnorm to -23 LUFS for consistent ambient mixing
for f in apps/client/public/audio/ambient/prelude/*.wav; do
  ffmpeg -i "$f" -af loudnorm=I=-23:TP=-2:LRA=7:print_format=json \
    -f null - 2> "${f%.wav}.loudnorm.json"
  # then run a 2nd pass using the measured_I/measured_TP/measured_LRA values
  # from the JSON above (see ffmpeg loudnorm docs for the full invocation)
  ffmpeg -i "$f" -c:a libmp3lame -b:a 192k "${f%.wav}.mp3"
done
```

### 1.4 terminusCinematicAssets — 1 missing WebP

The probe found 1 dead URL in `terminusCinematicAssets.ts` — the
WebP variant of one keyframe pair (PNG renders fine, the WebP
companion missed conversion).

```bash
# Identify the missing pair from docs/production/audit/dead-urls/apps_client_src_data_terminusCinematicAssets.ts.txt
# Then convert:
cwebp -q 88 path/to/<missing>.png -o path/to/<missing>.webp
```

---

## §2 — Mechronis Academy classroom backgrounds (12)

Hardcoded URLs in `apps/client/src/pages/MechronisAcademyPage.tsx`
that have NO registry mapping AND no rendered bytes. One classroom
backdrop per professor (`mechronisProfessors.ts` has 13 portraits;
the academy page hardcodes 12 classrooms — Vex through Proctor).

**Style guide**: 1920×1080 JPG; matches the Mechronis Academy
aesthetic established by `mechronisSlideshow` environments
(deep teal-green, holographic ash, brass-and-bone fixtures).
Each classroom should reflect its professor's discipline.

| ID | Professor / discipline | Output |
|---|---|---|
| classroom-kanevas | Kanevas (deep-time) | `art/classrooms/classroom-kanevas.jpg` |
| classroom-aoki | Aoki (combat doctrine) | `art/classrooms/classroom-aoki.jpg` |
| classroom-halverez | Halverez (memory cartography) | `art/classrooms/classroom-halverez.jpg` |
| classroom-orphic | Orphic (sound + signal) | `art/classrooms/classroom-orphic.jpg` |
| classroom-mireille | Mireille (rhetoric) | `art/classrooms/classroom-mireille.jpg` |
| classroom-vellis | Vellis (xenobiology) | `art/classrooms/classroom-vellis.jpg` |
| classroom-kasra | Kasra (logistics) | `art/classrooms/classroom-kasra.jpg` |
| classroom-greenshaw | Greenshaw (ethics) | `art/classrooms/classroom-greenshaw.jpg` |
| classroom-vex | Vex (countermeasures) | `art/classrooms/classroom-vex.jpg` |
| classroom-vent | Vent (forensic dreams) | `art/classrooms/classroom-vent.jpg` |
| classroom-vasara | Vasara (theology) | `art/classrooms/classroom-vasara.jpg` |
| classroom-proctor | Proctor (assessment) | `art/classrooms/classroom-proctor.jpg` |

**Tool**: Nano Banana 2 · **Priority**: P1 · **Tooling**: render
to PNG then `cwebp -q 88` (per Mechronis style elsewhere).

**Per-classroom prompt template** (instantiate by replacing
`{PROF}` and `{DISCIPLINE}`; pull professor descriptions from
`apps/shared/mechronisProfessors.ts` for accuracy):

```
1920×1080, photorealistic concept art, no characters in frame,
empty Mechronis Academy classroom photographed at student-eye
level just before class begins. The room belongs to Professor
{PROF}, who teaches {DISCIPLINE}. The space reflects {DISCIPLINE}
through props, blackboard contents, and lighting:
- Tall lecture room with deep teal-green walls, brass-and-bone
  trim, and a holographic ash haze drifting near the ceiling.
- Long mahogany desk at the front; the professor is absent.
- The blackboard is covered in {DISCIPLINE}-specific diagrams
  hand-drawn in chalk that has not yet been erased.
- Student desks in two raked tiers facing the lecturer's plinth,
  each with a brass reading lamp and a single open notebook.
- One distinct prop on the lecturer's desk that telegraphs
  {PROF}'s personality (e.g. a half-eaten apple, a folded letter,
  an annotated specimen jar). Suggest specifically based on
  {PROF}'s description.
- Lighting: a single amber pendant lamp + cool ambient teal from
  high windows. No harsh shadows.
- Quiet, expectant, "the lesson hasn't started yet" mood.
- Match the existing Mechronis common-room palette and treatment
  established in art/celebration/* and art/mechronis/*.

Negative: no people, no text watermarks, no UI overlays, no
modern Earth-tech logos, no anime / cel-shaded styling.
```

The 12 specific classroom prompts (substituting actual professor
descriptions) are dispatched against this template. Pull the
12 `{DISCIPLINE}` values from
`apps/shared/mechronisProfessors.ts` so the dispatch matches the
in-game professor data 1-to-1.

---

## §3 — Mechronis Houses common rooms + ambient (8)

Source: `apps/shared/mechronisHouses.ts`. Four houses, each
needing a common-room JPG + an ambient MP3.

| House | Art output | Audio output |
|---|---|---|
| Resonance | `art/mechronis/common-rooms/resonance.jpg` | `audio/ambient/mechronis/resonance.mp3` |
| Umbra | `art/mechronis/common-rooms/umbra.jpg` | `audio/ambient/mechronis/umbra.mp3` |
| Ironflight | `art/mechronis/common-rooms/ironflight.jpg` | `audio/ambient/mechronis/ironflight.mp3` |
| Liminal | `art/mechronis/common-rooms/liminal.jpg` | `audio/ambient/mechronis/liminal.mp3` |

**Tool**: Nano Banana 2 (art) + Suno (audio) · **Priority**: P1.

### 3.1 Common-room art prompts (NB2)

Pull the four house descriptions from `apps/shared/mechronisHouses.ts`
(each house has a `description` field describing its character).
Use this template:

```
1920×1080, photorealistic concept art, empty Mechronis Academy
common room belonging to House {HOUSE}. {HOUSE_DESCRIPTION}.

Composition:
- Wide-angle hero shot of the lounge from the entry doorway,
  centered on a low conversation pit with worn leather seating.
- Walls express the House's identity through architectural cues
  rather than explicit signage: {HOUSE_VISUAL_LANGUAGE}.
- A single house banner hangs at the back of the room — heraldry
  is suggested through silhouette only, no readable text.
- A study alcove off to one side with stacked books, a teapot
  mid-steep, and one personal item left behind by an absent
  student.
- Lighting: warm, lived-in. Time of day suggests late evening,
  just after curfew. Soft glow from a single lamp + ambient sky
  light through tall windows.
- Match the Mechronis brass-and-bone fixture language and the
  teal-green palette established by mechronisSlideshow
  environments.

Negative: no people, no text on banners, no modern Earth-tech
logos, no anime / cel-shaded styling, no harsh shadows.
```

`{HOUSE_VISUAL_LANGUAGE}` per house (drawn from canon):
- **Resonance**: brass tuning forks embedded in the walls; floor
  tiles arranged in concentric rings; a working orrery in the
  ceiling.
- **Umbra**: black velvet drapes; recessed mirror panels that
  reflect candle-light without revealing depth; floors of dark
  cork that absorb sound.
- **Ironflight**: open ceiling ribs exposing brass piping; a wall
  of model airships rendered in bone and copper; a circular
  navigation table at the room's center.
- **Liminal**: doorways without rooms behind them; reading nooks
  carved into the walls at irregular angles; a clock with three
  hands moving at different speeds.

### 3.2 Ambient audio prompts (Suno)

```
House Resonance:
"Soft brass-tuning-fork resonance over a slow pulse, like a
clockwork heart beating once every four seconds. Distant choral
hum, no lyrics. 3 minutes loop. Mood: scholarly, attentive,
ready to think."

House Umbra:
"Low room-tone drone in a velvet-lined chamber. Occasional faint
candle-flicker hiss. A single distant grandfather clock, soft.
3 minutes loop. Mood: hushed, contemplative, secretive."

House Ironflight:
"Soft creak of wooden airship hull, distant wind through brass
piping, low metronomic ticking from a navigation instrument.
3 minutes loop. Mood: anticipatory, departure-imminent, brave."

House Liminal:
"Three slightly out-of-phase ticking clocks, a draft passing
through a door that hasn't opened, distant water dripping in
an irregular rhythm. 3 minutes loop. Mood: unsettled,
between-states, dreamlike."
```

All four target ~3 minutes, EBU R128 -23 LUFS for consistency
with the existing `act2Interlude` audio bed.

---

## §4 — Mechronis Classmates portraits (8)

Source: `apps/shared/mechronisClassmates.ts`. Each is a named NPC
classmate the player meets at the academy.

| Classmate | Output |
|---|---|
| aria-wen | `art/mechronis/classmates/aria-wen.png` |
| benik-holt | `art/mechronis/classmates/benik-holt.png` |
| tess-corvia | `art/mechronis/classmates/tess-corvia.png` |
| mara-thorne | `art/mechronis/classmates/mara-thorne.png` |
| ollen-mire | `art/mechronis/classmates/ollen-mire.png` |
| ozen-kade | `art/mechronis/classmates/ozen-kade.png` |
| vessa-lark | `art/mechronis/classmates/vessa-lark.png` |
| juno-reeve | `art/mechronis/classmates/juno-reeve.png` |

**Tool**: Nano Banana 2 · **Priority**: P2.

Pull each classmate's `description`, `house`, and `personality`
from `apps/shared/mechronisClassmates.ts` and instantiate against
this template:

```
Square portrait, 1024×1024 PNG transparent background, three-quarter
shoulder-up bust of {CLASSMATE_NAME} — a Mechronis Academy student
in House {HOUSE}.

Subject: {DESCRIPTION}.

Style: photorealistic painted portrait, lit from above-right by a
warm amber pendant lamp, cool teal ambient fill from screen-left.
Match the Mechronis Academy uniform: dark teal blazer with
House-specific trim color, white collared shirt, brass collar pin.
{HOUSE} trim color: {HOUSE_COLOR}.

Pose & expression: {PERSONALITY_BEAT — drawn from the
personality field, e.g. "leaning slightly forward, arms folded,
eyes narrowed in skepticism" for a contrarian classmate}.

Negative: no UI overlays, no text, no modern Earth-tech logos,
no anime / cel-shaded styling, no harsh contour lines, no extra
characters in frame.
```

---

## §5 — Outer Groove album (10 tracks + cover)

Source: `apps/shared/tcg-core/audio/outergroove.ts`. The full
in-game album by the in-fiction band "Outer Groove" — 10 tracks
plus cover art.

| Track | Output |
|---|---|
| og_001 | `audio/outergroove/og_001.mp3` |
| og_003 | `audio/outergroove/og_003.mp3` |
| og_005 | `audio/outergroove/og_005.mp3` |
| og_007 | `audio/outergroove/og_007.mp3` |
| og_009 | `audio/outergroove/og_009.mp3` |
| og_011 | `audio/outergroove/og_011.mp3` |
| og_013 | `audio/outergroove/og_013.mp3` |
| og_015 | `audio/outergroove/og_015.mp3` |
| og_017 | `audio/outergroove/og_017.mp3` |
| og_019 | `audio/outergroove/og_019.mp3` |
| cover | `audio/outergroove/cover.jpg` |

**Tool**: Suno (10 tracks) + Nano Banana 2 (cover) · **Priority**: P2.

Per-track prompts and lore should come from
`apps/shared/tcg-core/audio/outergroove.ts` (which has each
track's title, mood, and narrative role). Read the file once and
instantiate per track.

**Cover art prompt (NB2)**:
```
Square album cover, 2048×2048 JPG. The album is "Outer Groove" —
a fictional in-game LP by an underground band who plays a
gritty psychedelic-funk hybrid. Cover style: hand-drawn poster
illustration, warm earth-tones (rust, ochre, deep teal),
slightly off-register print like a 1970s LP sleeve. Centered
imagery: a single record needle dropping onto a vinyl groove
that spirals out into a starfield. The album title in lower-third
in a bespoke serif. Negative: no real-world band names, no
modern logos, no QR codes, no UI overlays.
```

---

## §6 — Celebration Park ambient (4)

Source: `apps/shared/celebrationParkMap.ts`. Four park districts,
each needing an ambient track.

| District | Output |
|---|---|
| Chorus Plaza | `audio/ambient/celebration/chorus-plaza.mp3` |
| Watcher's Promenade | `audio/ambient/celebration/watchers-promenade.mp3` |
| Prince's Domain | `audio/ambient/celebration/princes-domain.mp3` |
| Seeker Meadow | `audio/ambient/celebration/seeker-meadow.mp3` |

**Tool**: Suno · **Priority**: P2 · ~3 min loop, -23 LUFS.

```
Chorus Plaza:
"Bright marble plaza ambient — distant choral hum (no lyrics),
soft pigeons, a fountain mid-distance, occasional warm
laughter. Major key, hopeful but melancholy. 3 minutes loop."

Watcher's Promenade:
"Long stone promenade ambient — measured footsteps, low wind
through arched colonnades, faint distant bells from a
clocktower. Tense, observed, imperial. Minor key. 3 minutes
loop."

Prince's Domain:
"Royal-gardens ambient — soft fountain spray, distant string
quartet rehearsing imperfectly, occasional peacock cry, wind
through topiary. Polite but uneasy. 3 minutes loop."

Seeker Meadow:
"Open meadow ambient — wind through tall grass, three songbird
species in rotation, distant celebration drums far enough to be
gentle. Pastoral, contemplative, restorative. 3 minutes loop."
```

---

## §7 — Specimen fragment portraits (6)

Hardcoded in `apps/client/src/game/CompanionSelectionScene.tsx`.
Pre-companion fragment forms of the six starter specimens.

| Specimen | Output |
|---|---|
| Auros | `art/specimens/auros-fragment.png` |
| Nyx | `art/specimens/nyx-fragment.png` |
| Sibyl | `art/specimens/sibyl-fragment.png` |
| Strain | `art/specimens/strain-fragment.png` |
| Cog | `art/specimens/cog-fragment.png` |
| Toxis | `art/specimens/toxis-fragment.png` |

**Tool**: Nano Banana 2 · **Priority**: P1 · 1024×1024 PNG transparent.

Pull each specimen's full description, color palette, and
narrative role from `apps/client/src/data/companions/starterEidolonForms.ts`.

**Template**:
```
1024×1024 PNG transparent background. The fragment form of
specimen {NAME} — its earliest pre-companion stage, before the
player bonds with it.

A fragment is small, vulnerable, and not yet fully realized.
It looks like a piece of {NAME}'s eventual companion form
that has been broken off and is glowing softly with the
specimen's signature color: {SIGNATURE_COLOR}.

{NAME}'s full description: {DESCRIPTION}.

Composition: centered, three-quarter view, glowing core, soft
particle aura around the silhouette, no environment, no text.
Style: photorealistic painted concept art with the same
treatment as the live `art/eidolons/*.png` portraits in the
nanobanna2 catalog (see apps/client/src/data/nanobanna2Assets.ts
for the reference style).

Negative: no UI overlays, no anime/cel-shading, no harsh
contours, no full-body adult forms — these are FRAGMENTS,
distinctly smaller and incomplete.
```

---

## §8 — Acts 4-7 spine cinematics (30 assets across 6 cinematics)

Source: `apps/shared/songSlideshows.ts`. Each cinematic = 4 NB2
keyframes (frame01–03 + hero) + 1 Suno intro audio = 5 assets.
Six cinematics total = 30 assets. **All are major story beats.**

| Cinematic | Frames (NB2) | Audio (Suno) |
|---|---|---|
| `silence-of-two-witnesses` | `art/cinematics/silence-of-two-witnesses/{frame01,frame02,frame03,hero}.webp` | `audio/act2/silence-of-two-witnesses-ambient.mp3` |
| `act-4-revelation` | `art/cinematics/act-4-revelation/{frame01,frame02,frame03,hero}.webp` | `audio/acts/act-4-intro.mp3` |
| `act-4-5-dmc` | `art/cinematics/act-4-5-dmc/{frame01,frame02,frame03,hero}.webp` | `audio/acts/act-4_5-intro.mp3` |
| `act-5-map` | `art/cinematics/act-5-map/{frame01,frame02,frame03,hero}.webp` | `audio/acts/act-5-intro.mp3` |
| `act-6-confession` | `art/cinematics/act-6-confession/{frame01,frame02,frame03,hero}.webp` | `audio/acts/act-6-intro.mp3` |
| `act-7-convergence` | `art/cinematics/act-7-convergence/{frame01,frame02,frame03,hero}.webp` | `audio/acts/act-7-intro.mp3` |

**Tool**: Nano Banana 2 (frames) + Suno (audio) · **Priority**: P0
(spine story beats).

### 8.1 Workflow per cinematic

For each of the 6 cinematics, pull the slideshow definition from
`apps/shared/songSlideshows.ts` (each entry includes a `frames[]`
array with per-frame `description` text and a `klingPrompt`).
Inline that description as the per-frame NB2 prompt.

### 8.2 Per-cinematic frame prompts

The slideshow registry contains the source prompts directly.
Operators dispatching renders should:

```bash
# Read the slideshow def for the target cinematic
node -e '
const { SONG_SLIDESHOWS } = require("./apps/shared/songSlideshows.ts");
const sh = SONG_SLIDESHOWS.find(s => s.id === "silence-of-two-witnesses");
sh.frames.forEach((f, i) => console.log(`Frame ${i+1}:`, f.klingPrompt || f.description));
'
```

(The slideshow registry is the source of truth for these prompts;
this doc does not duplicate the inline strings since they're
already version-controlled at
`apps/shared/songSlideshows.ts:1-2098`.)

### 8.3 Per-cinematic audio prompts (Suno)

```
silence-of-two-witnesses-ambient (Act 2 climax):
"Sparse two-witness ambient. A reed instrument and a cello
trade phrases over a slow heartbeat drum. The harmonics never
quite resolve. 3 minutes loop, -23 LUFS. Mood: reverence,
restrained grief, witnessing."

act-4-intro (Revelation):
"Cinematic act-opener — slow ascent of strings layered over a
distant choir hum, kicks in at 0:18 with a deep brass swell.
Builds to a held chord at 0:48. 1:00 total, ducks for VO. Mood:
dawning realization, irrevocable."

act-4_5-intro (Dead Man's Circuit interlude):
"DMC overture — synth pads with mechanical clicks and the
faintest trace of a heart monitor. Builds to a wordless tenor
vocal at 0:30. 0:45 total. Mood: clinical dread, the work
continues."

act-5-intro (Map):
"Cartographer's theme — handpan loop with ambient strings,
occasional distant bells. Builds with a gradually rising bass
line. 1:00 total. Mood: scope expanding, getting to know the
shape of the world."

act-6-intro (Confession):
"Confession theme — solo piano in a stone-walled room, slow
arpeggios. A second voice (cello) enters at 0:25. No drums.
1:00 total. Mood: stripped-bare honesty, the moment before
truth."

act-7-intro (Convergence):
"Convergence overture — every previous act's musical motif
quoted briefly in sequence (witnesses theme, revelation swell,
DMC clicks, cartographer handpan, confession piano), unified
into a single triumphant orchestral statement. 1:30 total.
Mood: 'we are here. all of us. now.'"
```

---

## §9 — Page-background images (10)

Source: `literal-dgrsart-url` MIXED bucket — hardcoded URLs in
various page TS files at the non-standard CDN path
`https://dgrsart.s3.us-east-2.amazonaws.com/page-backgrounds/`.

| ID | Output | Page |
|---|---|---|
| ACH-001 | `page-backgrounds/ACH-001_achievement-vault.jpg` | Achievement Vault |
| BTP-001 | `page-backgrounds/BTP-001_season-command.jpg` | Season Command |
| CHR-001 | `page-backgrounds/CHR-001_operative-dossier.jpg` | Operative Dossier |
| DPL-001 | `page-backgrounds/DPL-001_negotiation-chamber.jpg` | Diplomacy / Negotiation |
| GLD-001 | `page-backgrounds/GLD-001_guild-hall.jpg` | Guild Hall |
| CMP-001 | `page-backgrounds/CMP-001_companion-quarters.jpg` | Companion Quarters |
| INV-001 | `page-backgrounds/INV-001_cargo-hold.jpg` | Inventory / Cargo Hold |
| QST-001 | `page-backgrounds/QST-001_mission-briefing.jpg` | Quest / Mission Briefing |
| MKT-001 | `page-backgrounds/MKT-001_marketplace.jpg` | Marketplace |
| STR-001 | `page-backgrounds/STR-001_requisition-terminal.jpg` | Store / Requisition Terminal |

**Tool**: Nano Banana 2 · **Priority**: P1 · 1920×1080 JPG.

These match the established existing live `page-backgrounds/` PVP
slot art (ranked-table, tournament-hall, draft-chamber) which use
a darker palette than typical room art — black + cool teal +
single accent color per page-type, with deep parallax depth.

**Per-page prompt template** (instantiate per row above):

```
1920×1080 photorealistic concept art, dark UI background plate
designed to sit BEHIND foreground UI panels (not be the focal
point). The page is "{PAGE_NAME}".

Composition:
- Wide-angle establishing shot of {PAGE_LOCATION_DESCRIPTION},
  empty of characters, deep parallax with the strongest visual
  weight in the lower-third (so UI panels stacked above don't
  fight for attention).
- Color palette: black/charcoal base (~70% of frame) + cool teal
  ambient + ONE warm accent color thematic to the page type
  ({ACCENT_COLOR_GUIDE}).
- Lighting: low-key, single key light + ambient teal fill. The
  brightest point in the frame should NOT be in the
  visual-center (UI panels go there); push the brightest pixel
  to a rule-of-thirds intersection.
- Match the existing page-backgrounds treatment for PVP-001
  through PVP-003 (ranked-table, tournament-hall, draft-chamber):
  dramatic, cinematic, but quiet enough to read UI over.
- No characters in frame. No readable text on signage. No
  modern Earth-tech logos.

Per-page accent + setting:
ACH-001 — Achievement Vault: deep gold accent. A circular vault
chamber lined with tiered shelves of sealed black trophy cases.
BTP-001 — Season Command: amber accent. A starship CIC bridge
with orbital projection table mid-room, season-progress holograms
on the back wall.
CHR-001 — Operative Dossier: red accent. A field-office desk
with open dossier folders, a pinned threat-board, single goose-
neck lamp.
DPL-001 — Negotiation Chamber: emerald accent. A long
diplomatic table with two empty chairs, a half-poured glass of
water, the seal of two opposing factions on opposite walls.
GLD-001 — Guild Hall: warm orange accent. A long mead-hall with
exposed beams, banners of all guilds hung from the ceiling, hearth
visible at the back.
CMP-001 — Companion Quarters: lavender accent. A communal
sleeping room with rumpled bunks, personal items on shelves,
one open book on the bedside table.
INV-001 — Cargo Hold: deep cyan accent. A starship cargo bay
with stacked crates and visible lighting strips on the floor.
QST-001 — Mission Briefing: saffron accent. A war-room with a
holographic mission map mid-room, schematics pinned on cork
boards.
MKT-001 — Marketplace: rust accent. A bazaar at twilight with
empty stalls under string lights, distant city skyline.
STR-001 — Requisition Terminal: ice-blue accent. A clinical
quartermaster's window with shelving behind a brass grille,
single overhead pendant.

Negative: no people, no readable text, no modern logos, no
anime/cel-shaded styling, no harsh contour outlines.
```

---

## §10 — Slideshow audio gaps (2 Suno)

Two single-track audio gaps in otherwise fully-shipped slideshows:

| Slideshow | Output |
|---|---|
| `celebrationSlideshow` | `audio/music/celebration/welcome-to-celebration.mp3` |
| `mechronisSlideshow` | `audio/music/mechronis/to-be-the-human.mp3` |

**Tool**: Suno · **Priority**: P1 · 2:00 with 0:08 fade-out, -23 LUFS.

```
welcome-to-celebration:
"Opening fanfare for the Celebration Sector — bright orchestral
march with brass section lead, choir oh-vowels at 0:30, full
ensemble swell at 1:00, decrescendo to solo flute at 1:50, fade
to silence by 2:00. Mood: warm civic pride that has a thread of
something secret beneath it. Major key, but the secondary chord
hints at minor."

to-be-the-human:
"Quiet introspective theme — solo piano in a low register, slow
arpeggios. Cello enters at 0:30 with a counter-melody. Bass
clarinet joins at 1:00. The piece never fully resolves; it ends
on a held suspended chord that fades over the last 8 seconds.
2:00 total. Mood: 'becoming what you have always been told you
were not.'"
```

---

## §11 — Loredex Discovery videos (8 Kling)

Source: `apps/client/src/components/DiscoveryVideoOverlay.tsx`
already wires 5 live Loredex Discovery videos. **8 additional
Discovery slots have an empty `videoUrl: ""` field** — those need
Kling videos.

Identify the 8 empty slots via:

```bash
grep -nE '^[[:space:]]*videoUrl:[[:space:]]*""' \
  apps/client/src/components/DiscoveryVideoOverlay.tsx
```

For each, the surrounding entry has a `loreEntryId` and a
`videoPrompt` (or matching prompt elsewhere). Pull the prompt
from one of:

- `docs/production/prompts/kling-discovery-video-prompts.md`
- The inline `videoPrompt` field in the Discovery entry itself

Each video is 5s, 720p, vertical-friendly framing (used as a
modal overlay), -23 LUFS audio if any. Tooling: Kling 1.5
image-to-video with Nano Banana 2 start + end keyframes if
the prompt requests motion-bookend.

(This section links to existing prompt files rather than
duplicating them — operators dispatching Kling renders work from
`docs/production/prompts/kling-discovery-video-prompts.md`
directly. After rendering, populate the empty `videoUrl` strings
in `DiscoveryVideoOverlay.tsx` with the resulting CDN paths.)

---

## §12 — TCG card definition tier-up art (221 NB2; linked, not inlined)

Source: 51 card definition files at
`apps/shared/tcg-core/cards/definitions/{allegiance,class,elemental,imprint,race,dimensional}/`.

Each tier-up card references `art/cards/<category>/<cardId>_tN.webp`
where `tN` is the tier (t1–t5 typically). 405 base card URLs are
LIVE; 221 tier-up variants are DEAD.

**This is a large catalog.** Per-asset prompts live in:

- The card definition file itself (each definition has a
  `loreText`, `flavorText`, and visual cues that compose the
  prompt)
- `docs/production/COMPLETE_ART_PROMPT_BIBLE.md` (master prompt
  bible — has the prompt template per card category)

**Workflow**:

```bash
# 1. Enumerate all dead tier-up URLs
cat docs/production/audit/dead-urls/apps_shared_tcg-core_cards_definitions_*.txt \
  > /tmp/tier-up-cards-todo.txt
wc -l /tmp/tier-up-cards-todo.txt   # expect 221

# 2. For each, derive the source card definition file:
#    URL → cardId → grep card defn for full lore + visual prompt
# 3. Instantiate against the card-tier prompt template in
#    COMPLETE_ART_PROMPT_BIBLE.md
```

This doc does NOT inline the 221 prompts. The bible + per-card
file is the source of truth and stays version-controlled.

**Priority**: P2 (gameplay still works with tier-up shown via
fallback to base art).

---

## §13 — Acts 2-7 + Architect VO recording (linked)

The 8 empty voice manifests (`act{2,3,4,4_5,5,6,7}VoManifest.json`
+ `architectVoManifest.json`) are unambiguous recording gaps.

**This is NOT a render task.** It's an ElevenLabs recording task
against per-act VO scripts.

**Workflow**:

```bash
# Per-act VO scripts live at:
ls docs/scripts/act{2..7}-vo-lines.json
# Each is a CSV-importable structure: { id, character, text, dispatchNotes }
# ElevenLabs dispatch:
#   1. Pick voice profile per character from existing live manifests
#      (e.g. Elara's profile from elaraVoManifest entries' metadata)
#   2. Batch CSV import into ElevenLabs
#   3. Render to MP3, upload to dgrsvoices bucket under the
#      established Act-N-Voices/ key prefix
#   4. Populate the corresponding act{N}VoManifest.json with the
#      full URL map
```

**Priority**: P0 for spine acts (2-7 narrative), P1 for The
Architect.

The audit cannot enumerate per-line counts because the source
scripts live in `docs/scripts/`, not in the empty manifests. After
recording, rerun the audit's CDN probe to verify the
`dgrsvoices.s3` bucket actually serves the new files (the bucket
returned 403 to anonymous probes during this audit — see the
audit's "Ambiguity notes" for what to verify in the AWS console).

---

## §14 — Excluded categories (recap)

Three categories are deliberately NOT in this prompt pack:

1. **PR #180 — `preludeAct1Deliverables.ts` (221 URLs)** — bytes
   exist on a dev machine per user. Action is `pnpm assets:upload`,
   not re-render. Audit doc §3 Group A has the full URL list.

2. **Legacy CloudFront — `d2xsxph8kpxj0f.cloudfront.net` (1,727 URLs)** —
   user selected "investigate-before-deciding" during plan
   review. Audit doc §3 Group E has the full URL list and the
   migrate-vs-rerender-vs-retire decision tree.

3. **Voice manifest filled-but-403 entries (~1,400 URLs across 24
   manifests)** — `dgrsvoices.s3` bucket returns 403 anonymously.
   Verify bucket policy in AWS console; if files exist, this is
   a CORS/access issue, not a missing-asset issue. See audit doc
   §5 ambiguity notes.

---

## Summary

| Section | Asset count | Tool | Priority |
|---|--:|---|---|
| §1 Pipeline conversions | 23 | ffmpeg | P0 |
| §2 Mechronis classrooms | 12 | NB2 | P1 |
| §3 Mechronis Houses | 8 | NB2 + Suno | P1 |
| §4 Mechronis Classmates | 8 | NB2 | P2 |
| §5 Outer Groove album | 11 | Suno + NB2 | P2 |
| §6 Celebration ambient | 4 | Suno | P2 |
| §7 Specimen fragments | 6 | NB2 | P1 |
| §8 Acts 4-7 cinematics | 30 | NB2 + Suno | **P0** |
| §9 Page backgrounds | 10 | NB2 | P1 |
| §10 Slideshow audio gaps | 2 | Suno | P1 |
| §11 Loredex Discovery videos | 8 | Kling | P1 |
| §12 TCG tier-up art | 221 | NB2 (linked) | P2 |
| §13 VO recording | 8 manifests (unbounded lines) | ElevenLabs (linked) | P0–P1 |
| **Total render queue** | **~351** | | |

Plus PR #180 upload (221) + legacy CloudFront decision (1,727)
deferred per user direction.


