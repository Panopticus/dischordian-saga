# UNIVERSAL PROMPTING DOCUMENT — Prelude + Act 1 Missing Assets

> **Purpose.** A single, self-contained prompting bible for every
> Prelude and Act 1 art, cutscene, UI, and voice asset that is
> referenced in canon but not yet on disk. Paste-ready Nano Banana 2
> stills, Seedance 2.0 motion prompts, ElevenLabs VO specs, and
> exact output paths. Generated from a cross-walk of:
>
> - `docs/production/PRELUDE_SHIP_READY_BIBLE.md`
> - `docs/production/ACT1_NARRATIVE_STRUCTURE.md`
> - `docs/production/MISSING_ART_PROMPTS.md` (10-item prior batch, complete)
> - `docs/production/MISSING_CUTSCENES.md`
> - `docs/production/prelude-asset-build/manifests/asset_prompt_manifest.json`
> - `apps/client/public/art/`, `apps/client/public/videos/`, `apps/client/public/audio/` on-disk inventory
> - `apps/shared/act1Opponents.ts` data shell

---

## 0. How to Use This Doc

**Scope.** Only items that are *missing* on disk. Every Prelude
room, Prelude cutscene video, and Prelude VFX already present in
`apps/client/public/` is intentionally omitted. If an asset is
listed here, it is a production gap.

**Global image model.** Nano Banana 2, 1920×1080 for rooms and
16:9 cutscene frames, 1536×2048 for 3:4 matchup portraits.

**Global video model.** Seedance 2.0, 24fps, one continuous
camera move per shot, one dominant visual idea per beat.

**Global voice model.** ElevenLabs, voice profiles from
`docs/production/VOICE_OVER_BIBLE.md`. CSV import for lines ≤30s;
Studio Projects for longer takes.

**Global style anchor (every Prelude + Act 1 still).**

> Deep-space-black `#010020` base. No rendered text unless the
> prompt explicitly permits one canonical word. Volumetric fog
> at ankle height. Film grain. Anamorphic lens flare on the
> brightest element. Three-quarter wide cinematic 4K
> composition unless the prompt specifies otherwise.

**Global negative (paste into every image prompt's negative field).**

> `rendered text, subtitle, watermark, logo, stock photo, cartoon,
> anime, low quality, blurry, flat lighting, UI chrome, HUD, menu,
> cel shading, painting, illustration, double exposure, warped
> anatomy, extra fingers`

**Per-cycle palette lock (Act 1).** The Act 1 three-cycle
palette descent is the single most important visual continuity
rule. Do not blend:

| Cycle | Dominant | Accent | Warm source |
|---|---|---|---|
| A — Kindergarten (§3) | honey `#d9a66a` | dusty rose `#c98b8b` | actual sun through windows |
| B — Mechronis Academy (§4) | institutional cyan `#4ba3b5` | brass `#b8752d` | one reflected sun-shaft |
| C — Nexon / Zenon / Authority (§5) | dust-brown `#6b5a48`, grey `#55606e`, black marble `#1c1a1a` | ember-orange `#e06a1a` | distant fires only |

Cycle A is the only environment in the entire game lit by a
natural sun. Cycle C is the first environment in the game where
there is no warm color *except fire*.

**Canon hygiene rules (enforce across every asset).**

1. The Engineer's face is never rendered. Portraits are always
   from behind or obscured. Exception: the Prince's voice in
   Log 5 — no portrait required, audio only.
2. Vex Solène does not appear in Act 1. The Warlord's Act 1
   portrait must hide her face; the only acknowledgement is
   a faint iridescent shimmer along the visor lip.
3. The Authority has no face, no scale cue, no insignia. It is
   a silhouette against darker stone.
4. The Oracle is referenced, never shown.
5. Pre-split Game Master wears a single pair of wire-rimmed
   spectacles with two lenses in one frame. Do not render the
   canonical Left/Right split lenses in Act 1.

---

## 1. Batch Inventory — What This Doc Covers

| Tier | Category | Count | Priority |
|---|---|---|---|
| Prelude | VO audit (verify existing takes vs CSV) | 1 pass | P1 |
| Act 1 | Room environment stills | 5 | P0 |
| Act 1 | Matchup-card portraits | 12 | P0 |
| Act 1 | Cutscene videos (start + end + motion) | 4 | P0 |
| Act 1 | Mechanic UI components (code + art) | 3 | P0 |
| Act 1 | Cycle-finale VO audit (3 slideshows) | 1 pass | P1 |
| Section 6 | Two Witnesses Part 2 cutscene | 1 | P1 |
| **Total new renders** | | **~22 primary + UI/audio** | |

Per-asset prompts follow in §3 (Prelude), §4 (Act 1 rooms), §5
(Act 1 portraits), §6 (Act 1 cutscenes), §7 (UI), §8 (VO),
§9 (Section 6).

---

## 2. Prior Batch — Already Shipped

For reference only. The following were the previous 10-item
batch tracked in `MISSING_ART_PROMPTS.md` and are all on disk as
of 2026-04-12. Do not regenerate:

- `art/arenas/arena-default.jpg`
- `art/ui/health-bar.png`
- `art/chess/pieces-sprite.png`, `art/chess/board.png`
- `art/ui/trade-frame.png`
- `art/td/grid-tile.png`
- `art/rooms/room-archives.png`, `room-bridge.png`, `room-observation-deck.png`
- `art/crew/darren-fessler-badge.png`

All 11 Prelude room stills, all 15 Prelude cutscene videos, and
all 23 Prelude VFX overlays are likewise shipped and not
revisited in this doc.

---

## 3. Prelude — Remaining Gaps

Prelude is **ship-ready** for art and cutscenes. The only open
items are a VO audit and one optional Engineer seed line.

### 3.1 VO Audit — Prince (Engineer) Seed Lines

**Context.** The prelude-asset-build voice CSVs spec several
Prince/Engineer beats, but the on-disk `apps/client/public/audio/prince/`
directory only contains `prince_beat_e_diploma.mp3`. Before
claiming Prelude VO complete, verify each CSV line has a rendered
`.mp3` at the expected path.

**Action.** Walk `docs/production/prelude-asset-build/prompts/voice/section_*.csv`
top to bottom. For every row whose first column starts with
`prince_`, confirm a matching `apps/client/public/audio/prince/<row-id>.mp3`
exists. Re-record any gaps with voice profile `the_prince`
(ElevenLabs voice ID `FLW8imgp50K85LICuLQs`), CSV import, loudnorm
−18 LUFS, MP3 128 kbps mono.

**Known-suspect gaps (verify first):**

| Row id | Expected path | CSV source |
|---|---|---|
| `prince_beat_c_seed` | `apps/client/public/audio/prince/prince_beat_c_seed.mp3` | section_6_6.5.csv or section_7_7.5.csv (grep `prince_beat_c`) |
| `prince_beat_d_seed` | `apps/client/public/audio/prince/prince_beat_d_seed.mp3` | section_8_8.5.csv or section_9_9.5.csv |

If the CSV row does not exist, the line was never authored —
no action required. If the CSV row exists and the MP3 does not,
re-record and drop into place.

### 3.2 VO Audit — Other Characters

**Elara.** On disk: `elara_beat_a_five_pods`, `elara_beat_c_six_incubators`,
`elara_beat_d_17000_year_mission`, `elara_beat_f_213_entries`.
Audit against every `elara_` row across all ten section CSVs
(sections 3, 6, 7, 8, 9, 10, 11, 12, 14, 17).

**Human.** On disk: `human_beat_c5_first_breath`, `human_beat_d5_sandwich`,
`human_beat_f5_empty_chair`. Audit against every `human_` row.

**Locke.** On disk: `locke_beat_h_first_message`. Audit any
other Locke rows.

**Log 5 full take.** `docs/production/prelude-asset-build/prompts/voice/log5/`
is a six-minute continuous Studio Projects take. Confirm final
mastered file is in place at
`apps/client/public/audio/music/` or `apps/client/public/audio/cades/`
per the Log 5 README.

**Process.** If the audit surfaces a gap, file it against this
doc as a §3 addendum with the row id, the CSV source, and the
ElevenLabs voice profile. Do not re-record anything whose
`.mp3` already exists — the Prelude ships as-is on passed audits.

### 3.3 Prelude Art — No Gaps

All eleven Prelude room stills (`room-cryo-bay`, `room-corridor`,
`room-engineering`, `room-cargo-hold`, `room-galley`, `room-mess-hall`,
`room-briefing-room`, `room-medical-bay`, `room-comms-array`,
`room-bridge`, `room-archives`) are on disk as `.png` + `.webp`.

All fifteen Prelude cutscene videos (beats A through J plus the
.5 breath beats) are in `apps/client/public/videos/prelude/`.

All twenty-three Prelude VFX overlays are in `apps/client/public/art/vfx/prelude/`.

The Darren Fessler memorial badge and both *Last Words* slide
decks (tease + full) are shipped.

**No new Prelude art prompts are queued by this document.**

---

## 4. Act 1 — Room Environment Stills (5)

All rooms: 1920×1080 PNG + WebP pair. Output `.png` first,
convert to WebP via the existing `ResponsiveImage` pipeline.
Source spec: `ACT1_NARRATIVE_STRUCTURE.md` §3.3 (Cycle A),
§4.4 (Cycle B), §5.4.1–5.4.3 (Cycle C).

### 4.1 `room-kindergarten` — Cycle A Classroom

- **Path:** `apps/client/public/art/rooms/room-kindergarten.png` + `.webp`
- **Palette:** honey `#d9a66a`, sunlight `#f5d98a`, dusty rose `#c98b8b`, terracotta `#c66b3d`, slate grey `#55606e`
- **Hygiene:** deliberately no cyan, no deep-space black, no emergency lighting. This is the only sun-lit room in the game.
- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §3.3 (lines 430–459)
- **Priority:** P0

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic still, 16:9, 4K. A small schoolroom
> in a turn-of-century village schoolhouse. Warm honey-oak
> floorboards, worn smooth at the walking line. Center of frame:
> a single low wooden card-table approximately child-height,
> flanked by four child-sized wooden chairs, the table surface a
> polished honey-oak with a faint chalk-smudge across one edge.
> Screen-left, a dark slate blackboard on a freestanding wooden
> frame, ghost marks of a thousand lessons erased. Screen-right,
> a panelled window-wall runs floor-to-ceiling with mullioned
> glass panes catching direct warm-yellow afternoon sunlight at
> a low angle, casting ten golden parallelograms across the
> floor and the card-table's surface. Motes of dust drift in the
> light beams. Low exposed wood-beam ceiling, no artificial
> light — only window sun lights the room. A small woven rug in
> dusty rose near the slate. No children visible. Palette: warm
> honey `#d9a66a`, sunlight yellow `#f5d98a`, dusty rose
> `#c98b8b`, terracotta `#c66b3d`, slate grey `#55606e`.
> Deliberately no cyan, no deep space black, no emergency
> lighting — this room is lit by an actual sun. Soft diffused
> light, shallow depth of field on the card-table's center.
> Soft film grain. Gentle anamorphic glow on the sun-panels.
> Cinematic 4K composition, three-quarter wide, camera at
> child-eye level looking slightly up at the card-table.

### 4.2 `room-mechronis-atrium` — Cycle B Academy Atrium

- **Path:** `apps/client/public/art/rooms/room-mechronis-atrium.png` + `.webp`
- **Palette:** institutional cyan `#4ba3b5`, brass `#b8752d`, warm sunlight `#f5d98a` (sparingly)
- **Hygiene:** the sun-shafts are the last visual echo of Cycle A warmth. After this room the sun does not return until Act 5.
- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §4.4 (lines 822–872)
- **Priority:** P0

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic still, 16:9, 4K. Interior of the
> central atrium of Mechronis Academy — a technical university
> carved from grey limestone and polished dark-basalt composite,
> soaring early-Empire institutional architecture. Rectangular
> hall, vaulted ceiling of exposed brass ribs and obsidian-glass
> skylight panes. Four tall narrow arched windows line the left
> wall, each two stories high, casting long shafts of warm
> late-morning sunlight across a polished basalt floor dulled by
> decades of student footfall. Center-frame: the public-match
> card-table — a single rectangular table of brass-clad oak with
> inlaid bone corner accents, polished to a soft matte sheen,
> four empty institutional chairs arranged around it (two facing
> two). Blank brass plaque on the table (no rendered text).
> Right wall: three tall brass doorways in shallow arched
> alcoves; above each, a small stone medallion carved with a
> faculty seal (generic geometric sigils, no rendered letters).
> Fluted unpainted stone columns between the doorways. At the
> far end, a raised dais with a second smaller card-table and a
> row of empty faculty chairs. Palette: cool institutional cyan
> `#4ba3b5` in shadowed recesses, polished brass `#b8752d` on
> door-frames and table edges, warm buttery sunlight `#f5d98a`
> in four hard parallelograms across the floor — the last
> visual echo of the §3.3 classroom warmth, deliberate and
> sparing. Volumetric fog pooled at ankle height, thin and
> dignified, catching the sun shafts as dust motes. Anamorphic
> lens flare on the brightest window's inner edge. Faint film
> grain. Cinematic 4K composition, three-quarter wide shot,
> camera at standing adult eye level (not child-eye as §3.3),
> looking down the hall past the public card-table toward the
> dais. No rendered text, no visible people, no holograms.
> The room feels important. The room is about to be hostile.
> Today it is still just a school.

### 4.3 `room-nexon-battlefield` — Cycle C Breach

- **Path:** `apps/client/public/art/rooms/room-nexon-battlefield.png` + `.webp`
- **Palette:** dust-brown `#6b5a48`, polished brass `#b8752d`, rust-orange `#c66b3d`, ember-orange `#e06a1a`, bone-grey `#a6998a`, cold cyan `#4ba3b5` (emergency flares only)
- **Hygiene:** no natural light, no warm sun, no honey, no dusty rose. The only warm color is fire.
- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §5.4.1 (lines 1543–1584)
- **Priority:** P0

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic still, 16:9, 4K. A collapsed
> defensive line at the outer edge of the city of Nexon, late
> evening after a full day of fighting. Mid-range shot depth.
> Foreground: a half-ruined brass-and-stone parapet wall — a
> staggered row of bunker emplacements broken through in the
> center of frame, the breach showing dust, embers, and the
> silhouette of a single overturned card-table set up in the
> lee of a surviving brass gun-emplacement. The card-table is
> intact, lightly scattered with face-down cards, two empty
> chairs. Behind the parapet, the city of Nexon in
> mid-distance: collapsed colonnades, the silhouettes of three
> partially-downed monuments, slow-rising columns of smoke
> threading upward through a low ceiling of dust. Far
> distance: ember-orange glow from sustained fires on the
> horizon. No natural light — scene lit only by distant fires,
> faint cold emergency flares, and a single high-angle brass
> spotlight from an unseen battalion-post casting one hard
> amber cone across the ruined parapet and the card-table.
> Volumetric dust at knee height, drifting visibly through the
> spotlight. Brass shell-casings and scattered field-pack
> debris on the ground. A torn Insurgency banner hangs limp
> from a broken flagpole at screen-right. No visible bodies,
> no visible soldiers — the battlefield is empty now. No
> rendered text. Palette: dust-brown `#6b5a48` dominant,
> polished brass `#b8752d` on the gun-emplacement and
> card-table edges, rust-orange `#c66b3d` on the ruined
> metalwork, ember-orange `#e06a1a` on the distant fires,
> bone-grey `#a6998a` on the stone, cold cyan `#4ba3b5`
> barely present on the emergency flares. Deliberately no
> warm sun, no honey, no dusty rose — the only warm color is
> fire. Anamorphic lens flare from the amber spotlight.
> Cinematic 4K composition, camera at standing adult eye
> level, three-quarter wide framing on the card-table in the
> breach.

### 4.4 `room-zenon-cell` — Cycle C Interrogation Chamber

- **Path:** `apps/client/public/art/rooms/room-zenon-cell.png` + `.webp`
- **Palette:** institutional grey `#55606e`, warmer grey `#6b6b65`, clinical white `#e8e8e8`, deep shadow `#2a2a2d`
- **Hygiene:** no brass (except a blank door plate), no cyan, no warmth. The smallest room in Act 1.
- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §5.4.2 (lines 1586–1621)
- **Priority:** P0

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic still, 16:9, 4K. Interior of a
> small interrogation chamber in the Zenon trial facility. The
> room is deliberately undersized — walls feel close, ceiling
> barely above head height. Concrete-grey walls, unpolished.
> A single square card-table dead center on a stained grey
> floor; one chair on each side facing each other across the
> table. Both chairs are institutional grey metal — identical,
> no distinction between interrogator and accused. A single
> rectangular overhead panel-light centered directly above the
> card-table, unshaded, casting a hard white-cold cone
> downward — only the table and two chairs are fully lit; walls
> recede into deep grey shadow at the frame edges. Empty
> tabletop (cards appear at runtime). No windows. One metal
> door at the far wall, closed, flush to the concrete, no
> handle visible from inside. A small blank brass identifying
> plate beside the door. No furniture beyond the table, two
> chairs, and the door. No decoration. No trace of anyone
> having been there before. Palette: cold institutional grey
> `#55606e` dominant on walls and floor, warmer grey `#6b6b65`
> on chairs, clinical white `#e8e8e8` in the overhead
> light-cone, deep shadow `#2a2a2d` at frame edges. No brass
> except the blank door plate. No cyan. No warmth. Soft film
> grain. No volumetric fog — the room is sealed too tight for
> drift. Cinematic 4K composition, camera at standing adult
> eye level, centered on the table, looking directly down the
> chair-to-chair axis from just behind one chair's back. The
> opposite of every previous environment's grandeur.

### 4.5 `room-authority-gallery` — Cycle C Finale Hall

- **Path:** `apps/client/public/art/rooms/room-authority-gallery.png` + `.webp`
- **Palette:** black marble `#1c1a1a` dominant; coffin glows pale amber `#d9a66a` (3), pale violet `#8b7fbf` (2), pale cyan `#4ba3b5` (1); warm wood `#6b4a2d` on the single chair
- **Hygiene:** no ambient warm light; the coffin glow is the only illumination. The Authority silhouette above the back arch is featureless and scale-ambiguous.
- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §5.4.3 (lines 1623–1668)
- **Priority:** P0

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic still, 16:9, 4K. A long vaulted
> ceremonial hall — the Authority's gallery. Deep perspective
> shot looking down the hall's length from near the entrance
> end. Along the left wall, a row of six tall crystal coffins
> in identical alcoves — each coffin a vertical standing
> container of clear faceted crystal, seven feet tall, narrow,
> each faintly lit from within by a soft low-saturation glow
> (three pale amber, two pale violet, one barely-visible pale
> cyan — the assignment is deliberate but the player does not
> yet know what it signifies). Each coffin appears empty on
> close inspection; the light inside is ambient, not from a
> figure. The right wall is blank polished black marble,
> reflecting the coffins' faint glow. Floor: continuous slab
> of the same black marble, unlit except by coffin glow.
> Center of the gallery's length, roughly two-thirds down the
> hall from camera: a single simple wooden chair facing away
> from camera, down the hall toward the gallery's back arch.
> The chair is unadorned, plain, almost domestic — the only
> organic material in a room of stone and crystal. Empty in
> this establishing still. Far end of the hall: a tall stone
> archway with a raised shallow dais beneath it. Above the
> arch, recessed deep into the shadowed upper wall, a
> silhouette is barely suggested — a darker shape against
> dark stone, identifiable only as an outline that could be
> a seated figure. Do not render face, gender, or detail. The
> silhouette is the Authority's presence; the player will
> never see more of it. Palette: black marble `#1c1a1a`
> dominant, pale amber `#d9a66a` from three coffins, pale
> violet `#8b7fbf` from two coffins, pale cyan `#4ba3b5`
> from one coffin (all at low saturation, barely visible),
> warm wood `#6b4a2d` on the single chair, deep shadow
> everywhere else. No rendered text. No warm ambient — the
> coffin glow is the only light. Volumetric cool air at ankle
> height, still, not drifting. Cinematic 4K composition, deep
> perspective, camera at standing adult eye level at the
> entrance end, looking down the hall's length toward the
> silhouette.

---


## 5. Act 1 — Matchup-Card Portraits (12)

All portraits: 3:4 1536×2048 PNG + WebP pair. Subject fills
the upper two-thirds of frame; the lower third is deliberately
empty card-table surface so the UI layer composites the
pre-match flavor line underneath at render time. Output path
convention: `apps/client/public/art/matchups/act1/<slug>.png` + `.webp`.

Portraits share environment lighting with the cycle's room
still so the five Cycle B cards (for example) read as
inhabitants of the same atrium.

### 5.1 Cycle A — Kindergarten (3 portraits)

Cycle A palette: classroom honey + sun-yellow + dusty rose from
§4.1. All three portraits use the same screen-right window sun
as the classroom still. The sun moves fifteen minutes redder
across the three matches: brightest in §5.1.1, softer in §5.1.2,
longest shadows in §5.1.3 (cycle finale).

### 5.1.1 `little-meme.png` — Opponent 1

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §3.4 (lines 479–505)
- **Priority:** P0

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing (subject fills upper two-thirds, lower third
> deliberately empty honey-oak card-table surface for UI text
> overlay). A seven-year-old boy seated at the wooden
> card-table in the §4.1 classroom, leaning forward on both
> elbows, chin tilted up. His face is open, hungry, and
> delighted — a child who has found a new toy and will not
> stop until he has taken it apart. He is mid-chant: lips
> parted in a repeating phrase, the mouth caught between
> syllables. His eyes are locked directly on camera (not shy,
> not cruel — certain). Simple pull-over tunic in dusty rose
> `#c98b8b` with rumpled sleeves. Short, messy, chestnut
> hair. One hand flat on the table, fingers splayed over an
> imaginary card; the other half-raised, pointing with index
> finger extended as if tracking something the viewer can't
> yet see. Lighting: warm-yellow window sun striping his left
> cheek and the card-table surface. Palette: honey `#d9a66a`
> dominant, dusty rose `#c98b8b` accent, warm sunlight
> `#f5d98a` on his skin. Background: softly defocused
> interior of the classroom — slate board, window panes, rug —
> bokeh only, the child is the subject. No rendered text.
> Soft film grain. Cinematic 4K. Not cute — this boy is
> certain. The chant is already viral.

### 5.1.2 `little-collector.png` — Opponent 2

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §3.5 (lines 542–571)
- **Priority:** P0

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A seven-year-old boy kneeling on one of the §4.1
> classroom chairs to get taller than the table, both hands
> clasped around a small glass mason jar held protectively at
> his chest. The jar is roughly the size of his clasped hands;
> its glass is smoky and fogged from the inside, a faint
> iridescent shimmer trapped behind the glass suggesting
> something is inside (do not render distinct creatures — the
> shimmer is ambiguous, captured emotions rather than animals).
> His expression is sweet, earnest, and wrong — the smile of a
> child who has already decided to keep something that isn't
> his. He is looking slightly off-camera, to the player's
> right, as if watching the next emotion before he collects
> it. Tidy little button-up shirt in soft sage green with the
> top button fastened, an overly-grown-up collar for his small
> frame. Hair parted to the side, neat, over-combed. Lighting:
> warm-yellow window sun from the same screen-right window as
> §4.1, catching the glass of the jar and making the trapped
> shimmer glow faintly golden. Palette: honey `#d9a66a`, sage
> green `#7ba67a`, sunlight `#f5d98a`, with a faint iridescent
> shimmer inside the jar glass (subtle — not overt magical
> effect). Background: softly defocused classroom. No rendered
> text. Cinematic 4K. He is not a bully; he is a hoarder in
> the making. The sweetness is the menace.

### 5.1.3 `little-watcher.png` — Opponent 3 (Cycle A finale)

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §3.6 (lines 615–648)
- **Priority:** P0
- **Style note:** afternoon sun is lower and redder than §5.1.1/§5.1.2. Shadows cast longer.

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A seven-year-old girl seated very still at the
> §4.1 classroom card-table, hands folded in her lap, spine
> straight, shoulders level. Simple pale cream linen dress
> with subtle dusty-rose trim at the collar. Hair in a single
> dark braid down one shoulder. Held in her lap, barely
> catching the edge of frame, is a half-finished white
> porcelain mask — the upper half is smooth blank ceramic
> (covering where her eyes would be), the lower half trails
> into raw unfired grey clay that hasn't been shaped yet.
> She is not wearing the mask; she is holding it as if about
> to put it on. Her face is fully visible above the mask's
> upper edge — a perfectly composed little girl's face, eyes
> open, looking directly at the viewer with a soft, measured
> attention. No hostility, no fear, no curiosity —
> assessment. She has already decided what she sees. The
> lighting is late-afternoon through the §4.1 window, warm
> sun now angled lower and redder (approaching sunset
> temperature — first hint of the cycle finale's weight). The
> shadow of her head and the mask fall sharply across the
> honey-oak card-table surface in front of her, cast long.
> Palette: honey `#d9a66a`, cream `#e6dcc2`, dusty rose
> `#c98b8b` at her collar, white porcelain `#f7f3ee` for the
> mask, grey unfired clay `#b8b4a8` for the mask's lower
> unfinished half, warmer-toward-red sun `#f0b878` (warmer
> than §5.1.1/§5.1.2 — the sun is lower). Background:
> classroom defocused, slate board barely readable behind
> her. Cinematic 4K. She is recording you. The mask in her
> lap is for when she has seen enough to decide who she is
> being. No rendered text.

---


### 5.2 Cycle B — Mechronis Academy (5 portraits)

Cycle B palette: institutional cyan + brass + one reflected
sun-shaft from §4.2. Student portraits share a composition axis
— subject seated at the public card-table, facing camera, one
sun-shaft falling across them. Faculty portraits sit on the
dais side of the table, back to the faculty chairs.

### 5.2.1 `detective-student.png` — Opponent 4

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §4.5 (lines 899–931)
- **Priority:** P0
- **Hygiene:** No trench coat yet. No notebook. No coffee cup. The iconography that will define the Human is NOT here yet.

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing (subject fills upper two-thirds, lower third empty
> brass-clad card-table surface for UI overlay). A young man
> around twenty, seated at the §4.2 public card-table, leaning
> slightly forward with both forearms resting flat on the
> brass-inlaid oak. His face is open, warm, attentive — the
> specific attention of a person who is listening as hard as
> they are looking. Half-smile about to become a full smile if
> whatever you're about to say is worth it. Dark hair, short
> and side-parted, a little untidy at the crown. Clean-shaven.
> Eyes dark, lively, slightly amused. He wears the Mechronis
> student blazer — a tailored cyan-grey wool double-breasted
> jacket with two rows of brass buttons and a narrow Academy
> crest stitched onto the left breast (stylized geometric seal,
> no rendered letters). Under the blazer a plain white
> collared shirt, no tie. His hands are bare, fingers laced
> loosely on the table; no coffee cup, no notebook, no trench
> coat. One of the §4.2 window sun-shafts falls diagonally
> across his left shoulder and the table edge in front of him,
> warm yellow against the atrium's cyan tone. Palette: cyan
> institutional `#4ba3b5` on the blazer and background, brass
> `#b8752d` on his buttons and the table's edge, warm sunlight
> `#f5d98a` on his left side, dark hair `#2a1f1a`, white shirt
> collar `#f0eae0`. Background: softly defocused atrium
> columns and arched window, bokeh only. Cinematic 4K. He is
> the friend the Engineer almost kept. The warmth in his face
> is the entire cost of what's coming. No rendered text.

### 5.2.2 `iron-lion-expelled.png` — Opponent 5

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §4.6 (lines 978–1011)
- **Priority:** P0
- **Style note:** Unlike §5.2.1 Detective, Iron Lion is mid-motion, not seated. The sun-shaft falls *behind* him, rim-lighting his silhouette.

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A young man around twenty-one, standing beside the
> §4.2 public card-table rather than seated at it — one hand
> still resting on the chair-back he has just risen from, the
> other already pointing off-frame toward the atrium's brass
> doorways. His weight is on his front foot; he is mid-stride
> toward leaving. The posture is the story. His face is set —
> not angry, not sad, done. Jaw firm, eyes forward (not at
> camera — past camera, at the door). Close-cropped dark-auburn
> hair, slight beard starting at the jawline. He wears the
> Mechronis Academy uniform: same cut of cyan-grey blazer as
> the Detective but worn one button too loose at the collar,
> one sleeve rolled up to the elbow. The Academy crest on his
> left breast has been deliberately scratched through with a
> single diagonal mark (subtle — visible only on close
> inspection). Under the blazer, a plain work shirt in a warmer
> neutral grey. Bare forearm shows a faint pale scar running
> from wrist to inner elbow — the mark of someone who has
> worked with their hands, not just their mind. Lighting: the
> §4.2 atrium sun-shaft is behind him, rim-lighting his
> silhouette from the back; his face is lit only by the cyan
> institutional ambient. Palette: cyan `#4ba3b5` (dominant on
> his face and the foreground), brass `#b8752d` (blazer
> buttons, faint), warm sun `#f5d98a` (rim light behind him
> only), warm grey `#867b6d` (work shirt). Background:
> defocused atrium doorway, the brass door slightly ajar.
> Cinematic 4K. He is already halfway through the door.
> Whether he wins or loses this match, he walks out the same
> way. No rendered text.

### 5.2.3 `professor-eidola.png` — Opponent 6

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §4.7 (lines 1068–1102)
- **Priority:** P0
- **Style note:** Faculty portrait. She sits on the dais side of the table; one sun-shaft falls across her hands and the folder.

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A woman in her early fifties seated on the dais
> side of the §4.2 public card-table, upright, both hands
> folded on the table in front of her over a closed student
> report-card folder (do not render text on the folder; keep
> its surface matte-cream blank). She wears the Mechronis
> academic robe: a long charcoal-grey wool robe with a narrow
> silver piping along the lapel and a single embroidered
> ethics-department sigil at the collar (geometric pattern, no
> rendered letters). Under the robe, a plain dark high-collared
> blouse. Her hair is silver-streaked black, cut short and
> neat, parted to one side; a single stray chalk-dust mark on
> her left sleeve. Her face is the most asymmetric of any
> Cycle B portrait: one eyebrow slightly lifted, one corner of
> her mouth softened into something that isn't quite a smile.
> Eyes directly at camera, tired but kind — tired because she
> has made this assessment a thousand times, kind because she
> has not yet stopped caring. Reading glasses pushed up into
> her hair rather than worn. One sun-shaft from §4.2 falls
> across her hands and the folder, warm on the cool palette.
> Palette: cyan institutional `#4ba3b5` on the robe's shadowed
> folds and background, polished brass `#b8752d` on the table
> edge and a brass pen resting beside the folder, warm sun
> `#f5d98a` across her hands, silver-grey `#a6a6a6` in her
> hair, blank cream `#e6dcc2` on the closed folder. Background:
> defocused atrium columns, the empty faculty dais chairs
> behind her. Cinematic 4K. She is about to write a word she
> will not let you read. She has already chosen it. The
> question is whether you make her change it. No rendered text.

### 5.2.4 `professor-matrikala.png` — Opponent 7

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §4.8 (lines 1163–1199)
- **Priority:** P0
- **Style note:** The one faculty member NOT in the academic robe. The workshop visits the formal atrium. Sun-shaft falls full across her hands and the coupling — light lands on the *work*, not the face.

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A woman in her early sixties seated on the dais
> side of the §4.2 card-table but leaning forward, forearms on
> the brass-clad oak, body-language that of a workshop mentor
> rather than a formal examiner. She wears work coveralls (not
> the academic robe) in warm oxide-red canvas, sleeves rolled
> to the elbow, collar open. A single polished brass Academy
> pin holds the coverall's collar closed at the throat
> (faculty status in miniature). Her hands are the portrait's
> subject weight: bare, strong, knuckled, a web of fine scars
> and callus patterns that tell the story before her face
> does. On the table beside her elbow: a half-disassembled
> brass reactor coupling, its inner calibration ring partly
> exposed, a pair of fine needle-point calipers resting across
> it. The coupling is a musical instrument to her, half-open
> because she was mid-tune when the student sat down. Her face
> is weathered, warm, eyes bright and attentive — a professor
> who has spent her life teaching the same thing, and is still
> delighted every time a student finally hears it. Short
> silver-grey hair. Reading glasses on a brass chain around
> her neck, not worn. Lighting: the §4.2 sun-shaft falls full
> across the coupling and her hands, warm yellow on the brass
> and her skin — the hands and the work get the light, the
> face is lit by the atrium's cyan ambient. Palette: cyan
> `#4ba3b5` on background and her left side, oxide-red
> `#c66b3d` for the coveralls, polished brass `#b8752d` (the
> coupling, the pin, the table edge, the calipers), warm sun
> `#f5d98a` on her hands and the coupling, weathered skin with
> amber undertones. Background: defocused atrium faculty dais
> with a small rack of tools visible behind her (her workshop
> spilling into the formal room). Cinematic 4K. She will teach
> you to hear the reactor hum. The coupling is the lesson. The
> victory is not. No rendered text.

### 5.2.5 `seer-visit.png` — Opponent 8 (Cycle B finale)

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §4.9 (lines 1262–1303)
- **Priority:** P0
- **Style note:** The §4.2 sun-shafts fall *beside* her, not on her. The staff is subtly burnt at its lower third — same staff the player finds charred in the Prelude Beat J burnt-card mission, seventeen millennia later.

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A woman of indeterminate age (could be forty, could
> be seventy — the canon is that she is older than she looks)
> seated at the §4.2 public card-table on the visitor side
> (not on the faculty dais — she is a fellow, not faculty).
> She wears plain traveler's robes in unbleached linen-cream
> with no institutional markings — no Academy crest, no faculty
> sigil, no rank indicator. A wide undyed flax sash loosely
> tied at her waist. Her hair is long, dark, and loose over
> one shoulder. Her face is serene and slightly sad —
> composed, unhurried, watching the viewer with the specific
> attention of someone who already knows how this meeting ends.
> Eyes directly at camera, soft. Not smiling but not sad; the
> expression of a person remembering something that hasn't
> happened yet. Her hands are loosely clasped in her lap — not
> on the table. Leaning against the chair to her right, angled
> upright: a dark wooden staff, as tall as a standing adult,
> worn smooth at the middle from a hand that has held it for
> decades. The staff's head is a simple blunt carved sphere in
> the same dark wood; no ornament, no crystal, no metal. The
> staff is subtly burnt at its lower third — charred, cracked,
> as if it has already lived through the fire that consumes it
> in the Prelude's burnt-card crew mission seventeen thousand
> years from this moment. The portrait paints it as if the
> burn is memory, not prophecy. Lighting: the §4.2 sun-shafts
> fall just to one side of her, illuminating the staff's lower
> burnt third and the chair beside her, but leaving her face
> softly lit by the cyan ambient only. Palette: cyan `#4ba3b5`
> on her face and the background, warm sun `#f5d98a` on the
> staff (bright on the char, golden on the unburnt upper
> two-thirds), unbleached cream `#e6dcc2` on her robes, dark
> wood `#3a2618` on the staff. Background: defocused atrium
> columns. Cinematic 4K. She is looking at where the staff
> will end up. The player has already seen the charred fragment
> in Beat J's Archives — this is where the burn begins. No
> rendered text.

---

### 5.3 Cycle C — Nexon / Zenon / Authority (4 portraits)

Cycle C palette descent: dust-brown + brass + ember-orange
(§4.3 Nexon), institutional grey + clinical white (§4.4 Zenon
cell), black marble + coffin glow (§4.5 Authority gallery).

### 5.3.1 `warlord-zero-first.png` — Opponent 9

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §5.5 (lines 1702–1742)
- **Priority:** P0
- **Hygiene:** Per Canon Rev 7 §8, Vex Solène does not appear in Act 1. The face is completely hidden. The only permitted visual acknowledgement of the Vex-swarm is a faint iridescent shimmer along the visor's lower inner edge.
- **Style break:** This is the only Act 1 matchup portrait where the subject is standing, not seated. The Warlord is not playing a game; she is arriving on a battlefield.

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A fully armored figure standing at the §4.3 ruined
> brass parapet, mid-distance from camera (fills upper
> two-thirds of frame, lower third is the ruined parapet +
> card-table edge for UI overlay). Her armor is articulated
> brass-and-composite plate in a dusky-chrome finish — no
> Empire insignia, no faction marks, deliberately unornamented;
> this is field armor, not ceremonial. A segmented cuirass,
> pauldrons, greaves, gauntlets. The helm is full-face, a
> sculpted brass visor with a continuous horizontal scanning
> slit at eye level. The face is completely hidden. Along the
> visor's lower inner edge, a faint iridescent shimmer —
> barely visible, almost a heat-haze, the only visible
> indicator of the Vex-swarm infesting the body. The shimmer
> is subtle, not flashy; a viewer who doesn't know to look for
> it reads it as spotlight refraction on the visor. One
> gauntleted hand rests on the hilt of a broad short-bladed
> weapon at her side (do not render it drawn); the other is
> extended open-palmed toward the card-table in front of her
> as if offering the match. Her stance is still, not
> aggressive — a professional arriving to complete a
> transaction, not a warrior entering combat. Lighting: the
> §4.3 amber spotlight falls across her pauldron and the
> upper visor; the rest of her body is lit by distant
> ember-orange from the city fires and a faint cold cyan from
> emergency flares. The visor reflects the ember glow.
> Palette: dusky chrome `#6b6b65` on the armor, polished brass
> `#b8752d` at joints and edges, ember-orange `#e06a1a` on the
> visor's inner reflection and the city glow behind her,
> dust-brown `#6b5a48` in the background, faint iridescent
> shimmer (rainbow-pale, barely present) along the visor lip
> only. Background: defocused Nexon breach, smoke columns, a
> torn Insurgency banner at screen-right edge. Cinematic 4K.
> The face is hidden. The face will remain hidden for the
> entire Act 1 arc. Do not hint at who is wearing the body.
> No rendered text.

### 5.3.2 `programmer.png` — Opponent 10

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §5.6 (lines 1908–1946)
- **Priority:** P0
- **Style note:** Same Nexon breach as §5.3.1 but composed in the breach's opposite side (where the Engineer would sit) so the two cards read as shot/reverse-shot.

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A man in his mid-forties seated on the survivor
> side of the §4.3 ruined-parapet card-table, facing camera
> across the table. He is dressed in plain cold-weather travel
> clothing — a weather-worn dark-grey canvas coat buttoned to
> the throat, a simple coarse-knit wool scarf in muted
> ember-rust `#b85a1a` (the Nexon palette's warmest echo),
> fingerless work-gloves, no faction insignia of any kind. His
> hair is short, greying at the temples, neatly kept despite
> the battlefield setting. A trimmed salt-and-pepper beard.
> His face is calm and final — the composure of a person who
> has already made every decision that matters and is now only
> waiting for the match to end so he can go do what he has
> decided to do. Eyes on the viewer, steady, warm but unbound.
> No grief, no fear. He is already gone, and the portrait is
> the portrait of someone who hasn't realized yet that the
> conversation is already a memory. Over his shoulder: a
> canvas satchel, half-packed, resting on the chair beside him
> — the flap open, a rolled map and a small brass lockbox
> visible inside. A folded piece of thick paper peeks out from
> his coat pocket (do not render text on the paper; keep it
> closed and creased). One hand flat on the card-table,
> fingers spread over a single face-up card in mid-play; the
> other hand resting on the satchel's strap. Lighting: the
> §4.3 amber spotlight falls across his face and the
> card-table surface; ember-orange rim-lights his shoulders
> from the city behind him. Palette: dusky grey `#6b6b65` on
> his coat, ember-rust `#b85a1a` on the scarf, brass `#b8752d`
> on the satchel buckle and the table edge, amber spotlight
> `#d9a66a` on his face, dust-brown `#6b5a48` in the
> background. Background: defocused Nexon breach, same setting
> as §5.3.1. Cinematic 4K. He is going to lose this match on
> purpose. The portrait should sell it before the match
> starts. No rendered text.

### 5.3.3 `game-master-original.png` — Opponent 11

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §5.7 (lines 2020–2056)
- **Priority:** P0
- **Hygiene:** Pre-split. Wire-rimmed spectacles with TWO LENSES IN ONE FRAME (conventional). Do NOT render the canonical Acts 2+ Left/Right two-separate-eyepieces configuration.

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A thin man in his early fifties seated directly
> across the §4.4 interrogation chamber's card-table from
> camera, facing the viewer. He is lit by the single overhead
> panel-light's hard white cone — face and hands sharply
> illuminated, shoulders fading into the cell's deep grey
> shadow. He wears a tailored Empire legal-black suit: matte
> obsidian wool, no lapel insignia, no tie, a plain
> high-collared white shirt buttoned to the throat. His hair
> is thin, black, combed flat and receding. Clean-shaven.
> Crucially: he wears a single pair of wire-rimmed spectacles
> — two lenses in one frame, the conventional configuration.
> (Pre-split; do not render the later canonical
> two-separate-eyepieces Left/Right configuration the Game
> Master is known for in Acts 2+.) The spectacles' frames are
> slim and dark; the lenses are clear glass, rendering his
> eyes directly visible through them, not obscured. His face
> is measured and unreadable — no hostility, no smugness, no
> warmth; the specific professional neutrality of a prosecutor
> who has decided what he is going to do long before the match
> began and is only going through the motions of procedure.
> Eyes directly at camera, steady. Both hands flat on the
> table, palms down, fingers unnaturally still. Between his
> hands on the table surface: a single thick folio of pressed
> paper (do not render text; keep the folio closed). Palette:
> institutional grey `#55606e` on the walls behind him, hard
> clinical white `#e8e8e8` on his face/hands/shirt, deep
> shadow `#2a2a2d` at frame edges and on his suit, dark
> obsidian `#1c1a1a` on the suit fabric, thin silver glint on
> the spectacle frames. No brass. No warm light of any kind.
> No cyan. The only color temperature in frame is the panel
> light's clinical white. Soft film grain. Cinematic 4K.
> Remember his face. This is the last time he is one person.
> No rendered text.

### 5.3.4 `the-authority.png` — Opponent 12 (Act 1 finale)

- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §5.8 (lines 2207–2249)
- **Priority:** P0
- **Style break:** The opposite of every previous Act 1 matchup card. Camera is at the gallery entrance looking *down the hall* from the Engineer's POV. The Engineer's empty chair is in the immediate foreground. The Authority silhouette above the back arch is the portrait's true subject but lit so faintly the viewer's eye has to search for it.
- **Hygiene:** The Authority has no face, no hands, no color, no reflective surface, no insignia, no scale cue. The viewer cannot tell if the figure is human-sized or three times human-sized.

**Nano Banana 2 prompt:**

> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing, but composed as a deep-perspective hall shot rather
> than a seated-across-the-table two-shot. Camera is positioned
> at the §4.5 gallery entrance, low (seated eye level — the
> player's POV from where the Engineer will sit), looking down
> the long marble hall toward the back arch. The immediate
> foreground (lower third of frame) is the plain wooden chair
> where the Engineer will sit, empty in this still, facing
> away from camera toward the arch. The chair's back edges
> catch a faint sidelight from the coffin alcoves. Along the
> left wall of the hall, the six crystal coffins from §4.5
> glow at their canonical saturations (three pale amber, two
> pale violet, one pale cyan). The right wall is black marble,
> reflecting the coffin glow as faint vertical streaks. The
> hall's floor stretches in deep perspective down to the
> shallow dais under the stone archway at the far end. Above
> the arch, recessed deep into shadowed upper stone, the
> Authority's silhouette — a barely-visible darker shape
> against darker stone, readable only as a seated or standing
> outline, completely featureless: no face, no hands, no color,
> no reflective surface, no insignia, no indication of scale.
> The silhouette is the matchup-card's true subject, but it is
> lit so faintly that the viewer's eye has to search for it;
> first-pass impression should be "empty hall with chair and
> coffins," second-pass impression should be "oh — there is
> someone there." Palette: black marble `#1c1a1a` dominant
> (floor, right wall, upper shadow where the silhouette sits),
> pale amber `#d9a66a` from three coffins, pale violet
> `#8b7fbf` from two, pale cyan `#4ba3b5` from one (all
> low-saturation), warm wood `#6b4a2d` on the empty chair,
> deep shadow everywhere else. No ambient warm light; no
> overhead lighting; no brass; no artificial color of any
> kind. Faint film grain. Volumetric cool air at ankle height,
> still. Cinematic 4K. The Authority has no face because the
> Authority is not a person. The Authority is the verdict —
> and in the next beat of runtime, the player sits down in the
> foreground chair and makes the argument. No rendered text.

---

## 6. Act 1 — Cutscene Videos (4)

All cutscenes: 16:9 1920×1080 MP4, 24fps, H.264, AAC audio
where applicable. Each requires a START frame still (Nano
Banana 2), an END frame still (Nano Banana 2), and a Seedance
2.0 motion prompt describing the continuous camera move
between them. Reduced-motion fallback: static end-frame +
kinetic typewriter narration of the cutscene's key VO line.

Three cutscenes need new renders (§6.1, §6.2, §6.3). The
fourth (§6.4 *Last Words*) reuses existing Prelude slide art
but needs runtime wiring.

### 6.1 `welcome-to-celebration.mp4` — Cycle A Finale

- **Path:** `apps/client/public/videos/act1/welcome-to-celebration.mp4`
- **Duration:** 35–45s target
- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §3.6 (lines 674–749)
- **Fires:** after Opponent 3 (Little Watcher), win or loss
- **Flags set:** `act1_cycle_a_complete`, `celebration_glimpse_shown`, `memoir_frame_acknowledged`
- **Priority:** P0

**START FRAME (Nano Banana 2):**

> Same §4.1 classroom, match complete. Wide shot from the
> empty seat opposite Little Watcher's chair (the player's
> POV, camera at child-eye level). Little Watcher sits exactly
> as in her matchup-card, hands in her lap, mask still not
> worn. The card-table between camera and her holds the final
> card play of the match — one card face-up on the player's
> side, one on hers, the played stacks intermixed. Warm
> late-afternoon sun has shifted another 15 minutes redder
> since the matchup card; the whole classroom is washed in
> amber. Dust motes thick in the light. Cinematic 4K. No
> rendered text.

**END FRAME (Nano Banana 2):**

> Pull-back establishing shot of the same classroom but the
> walls have dissolved — the wooden panelling peels back at
> the edges of frame to reveal, behind the school, a towering
> gated structure in polished brass and black marble: an
> immense ceremonial arch inscribed with the single word
> CELEBRATION in formal Empire script (rendered in-frame is
> permitted here, this single word is the canonical reveal).
> Beyond the arch, hundreds of identical schoolchildren in
> cream linen are walking in orderly processional lines toward
> a brass-and-bone amphitheatre. The Celebration banner flies
> above — dusty rose on cream. The classroom sits at the
> foreground as a small, warmly-lit island against the vast
> ceremonial machinery beyond. Little Watcher is now wearing
> the mask; only her braid and the lower edge of her jaw are
> visible beneath the porcelain. She is no longer seated — she
> stands at the threshold of the dissolving classroom wall,
> facing the arch. Palette: classroom honey and rose in the
> foreground, deep brass `#b8752d` and black marble `#1c1a1a`
> beyond the arch, ceremonial dusty rose `#c98b8b` on the
> distant banners. Cinematic 4K. The juxtaposition is the
> point.

**SEEDANCE 2.0 motion prompt:**

> Open on start frame — card-table, Little Watcher seated,
> amber classroom. Hold 3s. Beat at 4s: Little Watcher's
> voiceover line lands ("I have watched sixteen versions of
> you already.") as her hand lifts the mask from her lap. Beat
> at 8s: she places the mask over her face in a single slow
> motion; the classroom's warm light begins to shimmer at the
> edges of frame. Beat at 14s: camera slowly pulls back
> through where the east wall was; the wall dissolves outward
> in a wipe of warm dust, revealing the Celebration arch in
> distant tableau. Beat at 22s: camera continues the pull-back,
> the classroom becomes small foreground against the vast
> brass Celebration machinery; hundreds of children in cream
> linen walk toward the amphitheatre in silent processional.
> Beat at 30s: hold on final composition. Little Watcher
> (masked) at the dissolved threshold. Final 5s: slow fade to
> honey-amber black. 24fps. Reverent, foreboding, a
> child's-eye-view of something much larger than a classroom.

**VO (ElevenLabs, voice profile `little_watcher`):**

> "I have watched sixteen versions of you already."

### 6.2 `to-be-the-human.mp4` — Cycle B Finale

- **Path:** `apps/client/public/videos/act1/to-be-the-human.mp4`
- **Duration:** 40–55s target (longer than §6.1 — Act 1's emotional pivot)
- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §4.9 (lines 1377–1448)
- **Fires:** after Opponent 8 (The Seer), win or scripted-loss
- **Flags set:** `act1_cycle_b_complete`, `to_be_the_human_shown`, `human_potential_seeded`
- **Priority:** P0

**START FRAME (Nano Banana 2):**

> Mechronis Academy's main gate at dusk — a tall
> brass-and-basalt archway opening onto a stone plaza, the
> §4.2 atrium visible receding behind it through the opposite
> doorway. Two young men stand in the gate's threshold,
> backlit by the late-afternoon sun pouring across the plaza.
> On the left: the Engineer (seen from behind — hair,
> shoulders, cyan-grey blazer only, not his face — keep the
> Engineer faceless per Prelude hygiene). On the right: the
> Detective (student-years, as rendered in §5.2.1's matchup
> card), facing the Engineer in three-quarter profile, his
> hand extended for a parting handshake. Their hands are about
> to meet but have not yet. Around them, a few other students
> walk past in the dusk, blurred in motion. Palette: cyan
> institutional `#4ba3b5` fading on the Academy stone behind
> them, warm dusk gold `#e6a84a` flooding the plaza beyond the
> gate, long shadows thrown toward camera. Cinematic 4K. No
> rendered text. This is the last warm moment Act 1 gives the
> player. Every later cycle palette is colder.

**END FRAME (Nano Banana 2):**

> The same plaza, forty seconds later. The Engineer stands
> alone in the gate's threshold, seen from behind, unmoving.
> The Detective has walked out through the plaza and is a
> small receding figure near the far edge of frame,
> silhouetted against the dusk sun — his Mechronis blazer
> replaced mid-shot by a longer darker coat that almost
> reaches his ankles, a coat he did not own when the scene
> began. His walk has changed too: shoulders squarer, stride
> more deliberate. He is not the same person who walked out.
> The plaza is emptier now; other students are gone. The
> gate-arch throws a long shadow across the foreground.
> Palette: cyan `#4ba3b5` in the gate-shadow where the
> Engineer stands, dusk gold `#e6a84a` fading to purple-grey
> on the plaza, the Detective-now-almost-Human in silhouette
> against the last warm strip of sky. Cinematic 4K. The door
> closes here. The coat is the reveal. He is on his way to
> becoming the man the player already knows from the Prelude's
> whispered voice on the substrate layer. No rendered text.

**SEEDANCE 2.0 motion prompt:**

> Open on start frame — two young men at the Academy gate,
> hands about to meet. Hold 2s. Beat at 3s: handshake
> completes in slow motion, held 1.5s. Beat at 5s: the
> Detective steps back, nods once, turns away from the
> Engineer and begins to walk into the plaza. Camera stays
> locked on the Engineer's shoulders (seen from behind), the
> Detective receding ahead. Beat at 12s: key transformation
> beat — as the Detective walks away, his cyan-grey student
> blazer dissolves in a slow dust-wipe from his shoulders
> down, replaced by a longer darker coat that reaches past
> his knees (do not cut; the transition is a slow morph, not
> an edit). His stride shifts subtly. Beat at 22s: Engineer's
> voice-over: "He walked out of the Academy gate. He would
> not be called the Detective again for a very long time. He
> would be something else first." Beat at 30s: the
> Detective-now-Human reaches the far edge of the plaza,
> silhouetted against the dusk sun. Final 10s: hold on the
> Engineer's stationary back, the Human a small shape near
> the horizon, warm light falling from the left. Slow fade to
> cyan-cool black (the Cycle C palette beginning to bleed in).
> 24fps. Quiet, valedictory, the last warm moment before cold
> arrives.

**VO (ElevenLabs, voice profile `the_prince` / Engineer
narrator):**

> "He walked out of the Academy gate. He would not be called
> the Detective again for a very long time. He would be
> something else first."

---

### 6.3 `hacking-reality.mp4` — Cycle C Mid-Point

- **Path:** `apps/client/public/videos/act1/hacking-reality.mp4`
- **Duration:** 30–40s target
- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §5.5 (lines 1807–1878)
- **Fires:** after Opponent 9 (Warlord Zero), win or loss
- **Flags set:** `act1_hacking_reality_shown`, `architect_reality_edit_witnessed`
- **Priority:** P0
- **Hygiene:** Ember-orange city glow in the far distance remains unchanged — the reality-edit has a radius, and the city is outside it. The Engineer is briefly "unwritten" for the length of one shot; the memoir's point is that he *was* there.

**START FRAME (Nano Banana 2):**

> The §4.3 Nexon breach in the aftermath of the match. Two
> chairs at the card-table, one occupied by the Warlord (seen
> from behind — pauldron silhouette, visor-rim just visible),
> one occupied by the Engineer (seen from behind, cyan-grey
> blazer, face not visible). The card-table surface is lit by
> the amber spotlight. One final card face-up between them in
> the table's center. The Nexon skyline is dimmer than the
> environment still — the fighting has paused for this one
> match to resolve. Ember-orange still glowing on the horizon.
> Cinematic 4K. No rendered text.

**END FRAME (Nano Banana 2):**

> Same camera position, seconds later. The card-table is gone
> — not removed, replaced: the brass table has become a
> seamless polished black marble surface of the same shape
> and size, as if reality has been pasted-over where the table
> used to be. The two chairs are gone similarly; where the
> chairs sat, there are now two identical black marble plinths
> of the exact same silhouette, continuous with the new
> tabletop. The Engineer is no longer there — where he sat,
> there is only the plinth and a thin trail of cyan-grey cloth
> dust drifting down into a pile (the memoir will later name
> this the dust where he was). The Warlord still stands
> behind the transformed table, unmoving, visor still facing
> the plinth where the Engineer was. The ruined parapet
> behind her has also begun to change — the brass edges
> softening into black marble at the frame edges, a ripple of
> reality-edit spreading outward from the card-table to
> consume the battlefield itself. The ember-orange city glow
> in the far distance remains unchanged. Palette: black marble
> `#1c1a1a` on the edit-zone, dusky chrome `#6b6b65` on the
> Warlord's unchanged armor, ember-orange `#e06a1a` in the far
> background, cyan-grey cloth-dust `#8b9199` where the
> Engineer was. Cinematic 4K. The memoir is saying: the
> Engineer was there. Then he was not, because someone
> changed the room. No rendered text.

**SEEDANCE 2.0 motion prompt:**

> Open on start frame — two chairs, one final card on the
> card-table, Warlord and Engineer both seated. Hold 3s. Beat
> at 4s: Warlord's voice lands ("I said three moves. I meant
> three edits.") as her gauntleted hand lifts from the
> card-table surface. Beat at 8s: reality-edit beat 1 — the
> final card on the table dissolves into a fine geometric
> lattice and reforms as a blank black square, as if the card
> had never been played. Beat at 14s: reality-edit beat 2 —
> the brass card-table itself ripples in one continuous wave
> from center outward and reforms as polished black marble,
> the chairs warping into marble plinths along with it; the
> Warlord does not move, but the Engineer's silhouette becomes
> briefly translucent. Beat at 22s: reality-edit beat 3 — the
> camera's framing edges warp inward for a split second as
> the reality-edit radius expands; the Engineer is no longer
> in his chair-plinth, only the cyan-grey cloth-dust pile
> remains. The Warlord is still. Beat at 28s: Engineer's VO
> (off-camera) "She said three moves. She meant three edits.
> The third one was the rules themselves." Final 8s: slow
> pull-back revealing the edit radius spreading across the
> ruined parapet, freezing just short of the distant
> ember-orange city. Slow fade to dust-brown black. 24fps.
> Grave, clinical, the opposite of spectacle. The horror is
> the calm.

**VO A (Warlord, ElevenLabs voice profile `the_warlord`):**

> "I said three moves. I meant three edits."

**VO B (Engineer narrator, `the_prince`):**

> "She said three moves. She meant three edits. The third one
> was the rules themselves."

### 6.4 `last-words.mp4` — Act 1 Landing (Full Song)

- **Path:** `apps/client/public/videos/act1/last-words.mp4`
  (or a sibling runtime component reusing existing slides — see below)
- **Duration:** 219.8s (3:39.8) — full song runtime
- **Source:** `ACT1_NARRATIVE_STRUCTURE.md` §5.8.1 (lines 2128–2190)
- **Fires:** after Opponent 12 (The Authority), win or sentence-passed
- **Flags set:** `act1_cycle_c_complete`, `act1_complete`, `first_light_dark_choice_resolved_light` OR `first_light_dark_choice_resolved_dark`
- **Priority:** P0

**Art asset status — NO NEW RENDERS NEEDED.** The 20 slides
at `apps/client/public/art/prelude/last-words/slide-{1..4}-{1..5}.webp`
are already shipped; they were originally authored for the
Prelude's full-song treatment and are re-homed here. The
matching audio at `apps/client/public/audio/music/song_last_words_prelude_cut.mp3`
(219.8s, −18 LUFS, post-production complete per Canon Rev 7 §5.6.11)
is likewise shipped.

**What IS needed (runtime / wiring, not prompts):**

- Build sibling component to Prelude's `LastWordsWitnessing`
  at `apps/client/src/components/act1/LastWordsFullWitnessing.tsx`
- Reuse the 20-slide timeline at
  `apps/client/src/components/prelude/lastWordsTimeline.ts`
  (fork or import from shared location)
- Wire the `ChoicePillarLightDark` component (from PR #40):
  - Reveal at **66s** from song start (chorus-1 onset)
  - Skip unlock at **110s** from song start (chorus-1 end)
  - Persist the player's pick to `GameState.lightDarkAlignment`
  - Refusal handling: no default; cutscene holds on black
    until a choice is made
- Runtime gate: only fires when `preludeCompletedFlags`
  contains `cutscene_archives_two_witnesses_part1_complete`
- Post-credits hand-off to §9 (Two Witnesses Part 2) stub

**Image model:** none. **Video model:** none (slideshow-driven).
**Audio model:** already rendered.

**Audit items before ship:**

- [ ] Confirm slide timing table in `lastWordsTimeline.ts`
      matches the song's canonical verse/chorus/bridge structure
      (4 sections × 5 slides each = 20 slides)
- [ ] Confirm `ChoicePillarLightDark` uses the same visual
      treatment as the Prelude Bible §17.5 original spec
- [ ] Confirm the skip button is locked until 110s
- [ ] Confirm refusal path does not auto-select

---

## 7. Act 1 — Mechanic UI Components (3)

These are **code-first** production slots with small art
dependencies. Each has a dedicated design-doc blocker in
`docs/production/act1/`; prompts below are for the supporting
art only. The runtime specs live in the mechanic docs.

### 7.1 Seer Prophecy — Card-Flicker Overlay

- **Mechanic source:** `docs/production/act1/seer-prophecy-mechanic.md`
- **Fires in:** Opponent 8 (The Seer), `the_seer_visit`
- **Priority:** P0 (blocks §5.2.5 match implementation)
- **Art requirement:** likely none — the flicker is a
  code-driven 800ms animation on the Seer's played-card slot.
  Verify: is a sprite-sheet or shader needed, or does CSS +
  existing card art suffice? If a frame-sequence is needed,
  queue a standalone prompt here.

**Proposed visual:** the Seer's card slot shows a cyan-tinted
double-exposure flicker — two candidate card backs
superimposed, fading to the eventual "drawn" card over 800ms.
No new art required if the existing card-back PNG suffices;
the animation is CSS-driven.

### 7.2 Public Witness — Verdict Stream Column

- **Mechanic source:** `docs/production/act1/public-witness-ui-spec.md`
- **Fires in:** Opponent 11 (Game Master), `the_game_master_original`
- **Priority:** P0 (blocks §5.3.3 match implementation)
- **Art requirement:** the verdict-stream column is a 20%-width
  right-hand rail rendered with clinical-white background and
  a thin brass frame. Code-rendered, no standalone image file
  needed. Divergence warning color is rust-orange `#c66b3d`
  (already in palette).

**Deliverables:**

- [ ] `VerdictStreamColumn.tsx` component (clinical-white bg,
      brass `#b8752d` 2px border, rust-orange `#c66b3d` divergence flashes)
- [ ] `gameMasterVerdictStreamBalance: number` GameState field
      (range −10 to +10, signed integer)
- [ ] Hand-off: write field to GameState on match close; §5.3.4
      Authority reads it as opening state

### 7.3 Authority Trial — Phase Gate Overlay

- **Mechanic source:** `docs/production/act1/authority-trial-phase-mechanic.md`
- **Fires in:** Opponent 12 (The Authority), `the_authority`
- **Priority:** P0 (blocks §5.3.4 match implementation)
- **Art requirement:** a small phase-indicator overlay shown
  at the top of the match HUD cycling through the ten legal
  phases: *charge* (T1), *opening argument* (T2),
  *evidence presentation* (T3–5), *cross-examination* (T6–8),
  *closing argument* (T9), *verdict* (T10).

**Proposed visual:** horizontal phase-bar in clinical white
(matching §4.4 Zenon cell palette), brass tick marks at each
phase boundary, current phase highlighted in warm amber
`#d9a66a`. No full-frame artwork needed — code-rendered from
the phase state machine.

**Deliverables:**

- [ ] `AuthorityPhaseBar.tsx` component
- [ ] Phase-restriction middleware reading the opening
      `gameMasterVerdictStreamBalance` handed off from §7.2

### 7.4 Warlord Three-Move — Lockout Countdown

- **Mechanic source:** `docs/production/act1/warlord-three-move-mechanic.md`
- **Fires in:** Opponent 9 (Warlord Zero), `the_warlord_zero_first`
- **Priority:** P0 (blocks §5.3.1 match implementation)
- **Art requirement:** a small corner countdown reading "3 / 3"
  → "2 / 3" → "1 / 3" during the lockout turns (4, 5, 6).
  Ember-orange `#e06a1a` text against dust-brown `#6b5a48`
  background. Code-rendered.

**Proposed visual:** 64×64px corner HUD chip in the top-right,
three brass pips that tick off as the lockout resolves.
Optional: a subtle rust-red frame pulse when the player's hand
narrows to two playable cards.

---

## 8. Act 1 — Voice-Over Audit

Act 1 opponent pre-match flavor lines are already authored as
text in `apps/shared/act1Opponents.ts`. They are UI-overlay
text, not voiced audio. No VO recording is queued for the
twelve matchup flavor lines.

**However, three cycle-finale cutscenes carry narrator VO
lines that DO need recording:**

### 8.1 `welcome-to-celebration` narrator VO

- **Speaker:** Little Watcher (voice profile `little_watcher`)
- **Line:** "I have watched sixteen versions of you already."
- **Length:** ~3.5s
- **Output:** `apps/client/public/audio/act1/little_watcher_sixteen_versions.mp3`
- **Direction:** A seven-year-old voice, but delivered with a
  40-year-old's measured calm. Not creepy. Not menacing.
  *Assessing.* No rising intonation on "already" — flat,
  final, complete. Leave a 0.5s breath of silence after.

### 8.2 `to-be-the-human` narrator VO

- **Speaker:** Engineer narrator (voice profile `the_prince`)
- **Line:** "He walked out of the Academy gate. He would not
  be called the Detective again for a very long time. He
  would be something else first."
- **Length:** ~8s
- **Output:** `apps/client/public/audio/act1/prince_to_be_the_human.mp3`
- **Direction:** Same register as Log 5 Movement 5 — dry,
  precise, warm only at the word *Detective*. Half-beat pause
  before *He would be something else first.* Volume drops on
  the final clause.

### 8.3 `hacking-reality` narrator VO (two speakers)

**Speaker A — the Warlord (voice profile `the_warlord`):**

- **Line:** "I said three moves. I meant three edits."
- **Length:** ~3s
- **Output:** `apps/client/public/audio/act1/warlord_three_edits.mp3`
- **Direction:** Helmeted, filtered through the brass visor —
  apply the Prelude's `warlord_visor` EQ preset. No emotion.
  No emphasis. This is arithmetic.

**Speaker B — Engineer narrator:**

- **Line:** "She said three moves. She meant three edits. The
  third one was the rules themselves."
- **Length:** ~5s
- **Output:** `apps/client/public/audio/act1/prince_third_edit_rules.mp3`
- **Direction:** Longer pause after *three edits* than the
  Warlord's take. The Engineer is letting the arithmetic
  land. Final clause delivered at the same volume as *"this
  is the tool doing exactly what I built it to do"* from
  Log 5 Movement 4.

### 8.4 Act 1 opener — optional bridge narration

Canon-safe slot for a short Engineer-narrator intro line
framing the Act 1 memoir, fired on Prelude → Act 1 hand-off.
Not required; only include if the Prelude Beat J tail lands
without sufficient context. If authored, it should live at
`apps/client/public/audio/act1/prince_memoir_opens.mp3`.

---

## 9. Section 6 — Two Witnesses Meet Part 2 (Act 1 Narrative Close)

Status: **scaffolded**. Section 6 is the single cutscene after
§6.4's *Last Words* landing resolves. It is a spoken scene
with no card match. The four `ACT1_NARRATIVE_STRUCTURE.md`
§6.7 decisions are now locked (§9.4 below); authoring is
unblocked pending dialog draft + VO recording.

### 9.1 Locked staging (from §9.4 decisions)

- **Witnesses stand**, in their Beat J pedestal pose. The
  player approaches; the Witnesses do not cross to meet them.
  Scene reads as *being witnessed*, not befriended.
- **Enigma is silent.** Only the Antiquarian speaks. The
  Enigma's first live line is reserved for Act 2+. Her
  presence carries through posture and eye-line only.
- **Antiquarian does not name the Loredex-Programmer identity.**
  He confirms he died for his thought and came back; the
  player does not yet learn he was the Loredex narrator. That
  convergence is held for a later act when it can land with
  more accumulated weight.
- **Closing choice is accept / decline / deflect** (not
  forgive-both/one/neither). The three-way Rev 7 endpoint
  replaces the archived forgiveness mechanic. Forgiveness is
  re-scoped to Act 3 when Malkia's canonical debt becomes
  visible per Canon Rev 7 §8.6 rule 6.

### 9.2 Production slots open for authoring

- [ ] Dialog script (~3–5 min of voiced dialogue, estimate
      drops to **12–16 Antiquarian lines** now that the
      Enigma is silent and the Programmer reveal is deferred)
- [ ] VO recording — Antiquarian only (profile `antiq_fc_1`).
      Enigma recording deferred to Act 2+ scope.
- [ ] Player dialog UI — three-choice widget
      (`accept` / `decline` / `deflect`) styled to match
      `ChoicePillarLightDark` from PR #40
- [ ] Archives ambient bed confirmed (no-music; room tone + HVAC
      hum + dripping-data-stream; pull from existing Beat J
      audio if reusable)
- [ ] Post-scene hand-off frame: black title card reading
      *"End of Act 1"*

### 9.3 Shipped / reusable

- Archives room backdrop: reuse `room-archives.webp` (Beat J).
  Re-light and re-dress: Engineer's chair gone, six crystal
  coffins gone, Archives are *just* an archive again —
  the memorial has completed its job.
- Antiquarian VO profile: already cast (Prelude `antiq_fc_1`)
- Enigma VO profile: Malkia Ukweli's *Last Words* voice —
  not exercised in Section 6, held for Act 2+

### 9.4 Decisions locked (2026-04-18)

| # | Question | Decision | Rationale |
|---|---|---|---|
| 1 | Antiquarian: sit or stand? | **Stand** (Beat J pose) | Ritual gravity. Scene lands on *being witnessed*, not befriended. Mirrors Beat J staging. |
| 2 | Enigma speaks live in Section 6? | **No — stays silent** | Holds her first live line for Act 2+ where it can land somewhere new. The player has already heard her archived voice three times (Prelude Beat J tease, full *Last Words*, this landing). |
| 3 | Antiquarian reveals Loredex-Programmer identity? | **No — kept separate** | Deferred to a later act. Reveal lands with more emotional weight once the player knows the Witnesses better. Also widens canon-hygiene margin on the forbidden civilian name. |
| 4 | Forgiveness mechanic or accept/decline/deflect? | **Replace** with accept/decline/deflect | Nothing canonically to forgive in Act 1 (Malkia's debt is Act 3+ per §8.6 rule 6). Forgiveness re-scoped to Act 3. Three-way choice is consequential, coherent, canon-safe. |

### 9.5 Closing-choice semantics (the one Section 6 player choice)

One beat mid-scene, the Antiquarian puts the ask to the player.
The player picks one of three:

- **Accept.** The player agrees to carry forward what the
  Engineer and the Witnesses started. Writes
  `act1_closingChoice = "accept"`. Unlocks Act 2's
  Antiquarian-as-companion track by default.
- **Decline.** The player refuses the Witnesses' offer.
  Writes `act1_closingChoice = "decline"`. Act 2 still opens
  but the Witnesses fade into the background until the player
  reaches for them in Act 3's Witness-return arc.
- **Deflect.** The player asks a question instead of answering.
  The Witnesses do not press. Writes
  `act1_closingChoice = "deflect"`. Section 6 ends with the
  question unresolved; Act 2 opens with companion track
  ambiguous.

All three are canon-safe endpoints. None softlocks Act 2.

### 9.6 Canon hygiene (Canon Rev 7 §8.6)

Section 6 is still Prelude-and-Act-1 scope. The following
must NOT appear:

- "1260 days" spoken aloud
- "Silence in Heaven" as a named event
- "Heart of Time" ship reference
- Age names (Privacy / Prophecy / Insurgency / Revelation)
  spoken aloud — permitted phrasing: *"Across Ages, across
  the death of stars"*
- Civilian names "Daniel Cross" and "Malkia Ukweli"
- **New (§9.4 decision 3 consequence):** no reference to
  the Antiquarian having been the Loredex narrator or having
  used the Programmer alias. He may say *"I was executed for
  what I thought. I woke up in the next era."* and similar
  canonical-Witness framing; he may not connect his current
  name to a prior identity the player has heard.

### 9.7 Reveals Section 6 IS allowed to make

Per Canon Rev 7 §8.6 rule-compatible subset:

- That the Antiquarian was a Witness who died for his
  thought and came back. Sufficient phrasing:
  *"I was executed for what I thought. I woke up in the
  next era."* He need not use the word "Revelation."
- That the Enigma was the voice on *Last Words* and that she
  also died and came back. This fact may be spoken **by the
  Antiquarian about the Enigma** (she is silent). She confirms
  only with a nod or held eye contact.
- That the Engineer whose song the player just heard is
  **not** a Witness — he pre-dates the Witness arc. His death
  is what Malkia carried forward; it is the seed of what she
  became.
- That the player is the fulcrum the Antiquarian referenced
  in Beat J — the one who decides whether what the Engineer
  and the Witnesses died for continues or closes.

### 9.8 Suggested cutscene shape (first-draft skeleton)

**Not yet canonical** — a structural scaffold for the script
author. Revise freely.

1. **Cold open (0:00–0:20).** Player walks into the Archives.
   Ambient only. The two Witnesses are standing where they
   stood in Beat J. They do not turn. The player crosses the
   room and stops.
2. **Antiquarian speaks (0:20–1:00).** He acknowledges the
   player without moving. Lands the "executed for what I
   thought" line. Lands *"across Ages, across the death of
   stars."* The Enigma's gaze shifts to the player once; she
   does not speak.
3. **The framing (1:00–2:00).** Antiquarian establishes the
   Engineer as the seed and Malkia as the carrier. He frames
   the player as the fulcrum.
4. **The ask (2:00–2:30).** Antiquarian puts the choice to
   the player. Dialog UI appears: *accept / decline / deflect*.
5. **The response (2:30–3:30).** Per choice:
   - **Accept:** Antiquarian nods. Enigma holds eye contact.
     One shared beat of silence.
   - **Decline:** Antiquarian nods. Enigma looks away.
     Silence.
   - **Deflect:** Antiquarian answers the player's question
     briefly and canon-safely, then falls silent. Enigma's
     posture unchanged.
6. **Close (3:30–end).** The room ambient lifts. Slow fade.
   Title card: *"End of Act 1."*

### 9.9 Forward-write surface

| Field | Value source | Consumer |
|---|---|---|
| `act1_complete` | Set to `true` on cutscene end | Gates Act 2 entry |
| `act1_closingChoice` | §9.5 player pick (`accept` / `decline` / `deflect`) | Act 2 companion-track default; affects Act 3 Witness-return branch weighting |
| `witness_antiquarian_met_part2` | Always set on cutscene end | Act 2+ dialogue branches referencing the Antiquarian's Part 2 confession |
| `witness_enigma_met_part2` | Always set on cutscene end | Act 2+ dialogue branches referencing the Enigma's Part 2 *silence* (important — her silence is the canonical fact this flag records) |

### 9.10 First-pass dialog script (Antiquarian — 14 lines)

**Status:** first-pass draft. Revise freely. All lines pass
§9.6 canon hygiene; none names Ages, Witnesses-in-the-abstract,
*1260 days*, *Silence in Heaven*, *Heart of Time*, civilian
names, or the Antiquarian's prior Loredex-Programmer identity.

**Speaker:** the Antiquarian only. The Enigma is silent
throughout; her presence is staged through eye-line and
posture per §9.4 decision 2.

**Voice profile:** `antiq_fc_1` (ElevenLabs, Prelude Beat J
casting carried forward). Loudnorm −18 LUFS. Mono MP3 128 kbps.

**Output directory:** `apps/client/public/audio/antiquarian/`

**Tonal register.** The Antiquarian is ceremonial without
being stagey. He has had more time to think about what he is
going to say than anyone the player has ever met; he does not
rush. Half-second pauses are load-bearing. He is warm, but he
is speaking from the other side of a thing the player has not
yet crossed. Do not punch endings. Let silence carry.

---

**Beat 2 — The Antiquarian acknowledges the player (0:20–1:00)**

| Line id | Text | Direction |
|---|---|---|
| `antiq_s6_l01` | "You came back. That is the part we were not certain of." | Measured, quiet. Half-beat on *came back*. The word *we* lands with an almost-turn toward the Enigma, not a full one. |
| `antiq_s6_l02` | "I was executed for what I thought. <break time=\"600ms\"/>I woke up in the next era." | The canonical confession. Flat, factual, no self-pity. The 600ms break between the two clauses is non-negotiable. |
| `antiq_s6_l03` | "Across Ages. <break time=\"400ms\"/>Across the death of stars. <break time=\"400ms\"/>I have been waiting in rooms very much like this one." | The permitted canonical phrasing per §9.6. Two short pauses, neither punched. |

**Beat 3 — The framing: Engineer, Enigma, player (1:00–2:00)**

| Line id | Text | Direction |
|---|---|---|
| `antiq_s6_l04` | "The song you heard a few minutes ago. <break time=\"500ms\"/>It was recorded a very long time ago, by someone you will never meet." | He means the Engineer. He does not say his name. He does not need to. |
| `antiq_s6_l05` | "He was not one of us. <break time=\"400ms\"/>He died before any of this had a shape. His death is the shape." | The core reveal — the Engineer is the seed, not a Witness. *His death is the shape* lands softly, not for emphasis. |
| `antiq_s6_l06` | "The voice you heard *carrying* his words — <break time=\"400ms\"/>she also died for what she thought. <break time=\"500ms\"/>She also woke up in the next era." | Indirect reference to the Enigma. He does not name her. The word *carrying* is emphasized lightly; she is the carrier, he is the keeper. On this line his eye-line shifts once to the Enigma and back. |
| `antiq_s6_l07` | "She has chosen silence tonight. <break time=\"400ms\"/>You will hear her voice again when she is ready to give it to you, and not before." | Licenses her silence in-fiction. Canon-safe — does not promise *when* she speaks, only that she will. |
| `antiq_s6_l08` | "So: what was begun in him, <break time=\"400ms\"/>carried by her, <break time=\"500ms\"/>now waits. <break time=\"600ms\"/>In you." | The pivot to the player. Long build of pauses. *In you* is the softest two syllables in the scene. Do not emphasize. |

**Beat 4 — The ask (2:00–2:30)**

| Line id | Text | Direction |
|---|---|---|
| `antiq_s6_l09` | "A thing was begun, and it has not finished. <break time=\"600ms\"/>It can continue in the weight you agree to carry, or it can end here, in this room, with us." | Still measured. No pressure in the voice. He is describing a door, not a demand. |
| `antiq_s6_l10` | "Will you carry it?" | The ask. Four syllables. Leave 1.0s of silence after the render — the dialog UI fades in on that silence. |

*(UI appears: ACCEPT / DECLINE / DEFLECT. Player chooses.)*

**Beat 5 — The response (2:30–3:30). One of three branches fires.**

| Line id | Branch | Text | Direction |
|---|---|---|---|
| `antiq_s6_l11a` | ACCEPT | "Then we have not waited in vain. <break time=\"500ms\"/>Go carefully. The road does not forgive hurry." | Warmth allowed on *we have not waited in vain*. The closing advice is gentle, not foreboding. |
| `antiq_s6_l11b` | DECLINE | "Then we will wait longer. <break time=\"500ms\"/>We have learned how." | No rebuke. Calm. *We have learned how* lands with the specific tiredness of someone who has done it before. |
| `antiq_s6_l11c` | DEFLECT | "Ask, then. <break time=\"400ms\"/>Tonight, an answer costs nothing." | Open, patient. A licensing line — the player's follow-up is dialogue-UI text, not voiced. |
| `antiq_s6_l12c` | DEFLECT (Antiquarian's canon-safe answer) | "What we are is not the question. <break time=\"400ms\"/>What you do with what you have heard tonight — that is the question. <break time=\"500ms\"/>Consider it, and come back when you can." | Catch-all canon-safe response that closes the deflect branch without revealing anything forbidden. If the script later authors specific deflect-questions, add `l12c_v1`, `l12c_v2`, etc. alongside this default. |

**Beat 6 — Close (3:30–end)**

| Line id | Text | Direction |
|---|---|---|
| `antiq_s6_l13` | "We will be here. <break time=\"400ms\"/>We have nowhere else we are expected to be." | The Witnesses' canonical standing posture is licensed by this line. Final breath low. |
| `antiq_s6_l14` | "End of memoir. <break time=\"600ms\"/>The next breath is yours." | Closing line. Delivered softer than anything else in the scene. The title card *End of Act 1* fades in on the final syllable. |

---

**Totals:** 14 base lines + 1 extra deflect-answer line
(`antiq_s6_l12c`) = 15 VO takes. Middle of the §9.2 estimate.

**Branch VO table:**

| Branch | Lines played |
|---|---|
| Accept | l01 → l02 → l03 → l04 → l05 → l06 → l07 → l08 → l09 → l10 → **l11a** → l13 → l14 |
| Decline | l01 → l02 → l03 → l04 → l05 → l06 → l07 → l08 → l09 → l10 → **l11b** → l13 → l14 |
| Deflect | l01 → l02 → l03 → l04 → l05 → l06 → l07 → l08 → l09 → l10 → **l11c → [player question] → l12c** → l13 → l14 |

Every branch shares 12 lines (l01–l10 + l13–l14); only the
response beat differs. Accept/decline trade one line each;
deflect adds one line over the shared baseline.

**VO production order (recommended recording sequence):**

1. `l01`–`l03` (opening canonical confession — set the
   register for the whole take)
2. `l13`–`l14` (closing — matches the opening's quiet
   register; record in the same session to keep timbre)
3. `l04`–`l08` (framing — warmer register allowed,
   especially on `l08`)
4. `l09`–`l10` (the ask — land the word *carry* carefully)
5. `l11a`, `l11b`, `l11c` (branch responses — record all
   three in one take session for tonal consistency)
6. `l12c` (deflect catch-all — optional if deflect branch
   gets per-question variants later)

**Open authoring slots (follow-up):**

- [ ] Review by canon owner for §9.6 hygiene compliance
- [ ] Optional: author 2–4 per-question deflect-variant
      lines (`antiq_s6_l12c_v1`–`_v4`) covering the most
      likely player questions (*who was he?*, *how long have
      you been waiting?*, *what happens if I say no?*,
      *why me?*)
- [ ] Enigma blocking pass — staged eye-line and posture
      cues for each branch, recorded as a still-reference
      sheet for the cutscene animator

---

## 10. Final Inventory Checklist

| # | Asset | Path | Format | Section | Status |
|---|---|---|---|---|---|
| 1 | Kindergarten room | `art/rooms/room-kindergarten.png` + `.webp` | 1920×1080 | §4.1 | PENDING |
| 2 | Mechronis atrium room | `art/rooms/room-mechronis-atrium.png` + `.webp` | 1920×1080 | §4.2 | PENDING |
| 3 | Nexon battlefield room | `art/rooms/room-nexon-battlefield.png` + `.webp` | 1920×1080 | §4.3 | PENDING |
| 4 | Zenon cell room | `art/rooms/room-zenon-cell.png` + `.webp` | 1920×1080 | §4.4 | PENDING |
| 5 | Authority gallery room | `art/rooms/room-authority-gallery.png` + `.webp` | 1920×1080 | §4.5 | PENDING |
| 6 | Little Meme portrait | `art/matchups/act1/little-meme.png` + `.webp` | 1536×2048 | §5.1.1 | PENDING |
| 7 | Little Collector portrait | `art/matchups/act1/little-collector.png` + `.webp` | 1536×2048 | §5.1.2 | PENDING |
| 8 | Little Watcher portrait | `art/matchups/act1/little-watcher.png` + `.webp` | 1536×2048 | §5.1.3 | PENDING |
| 9 | Detective student portrait | `art/matchups/act1/detective-student.png` + `.webp` | 1536×2048 | §5.2.1 | PENDING |
| 10 | Iron Lion expelled portrait | `art/matchups/act1/iron-lion-expelled.png` + `.webp` | 1536×2048 | §5.2.2 | PENDING |
| 11 | Professor Eidola portrait | `art/matchups/act1/professor-eidola.png` + `.webp` | 1536×2048 | §5.2.3 | PENDING |
| 12 | Professor Matrikala portrait | `art/matchups/act1/professor-matrikala.png` + `.webp` | 1536×2048 | §5.2.4 | PENDING |
| 13 | Seer visit portrait | `art/matchups/act1/seer-visit.png` + `.webp` | 1536×2048 | §5.2.5 | PENDING |
| 14 | Warlord Zero portrait | `art/matchups/act1/warlord-zero-first.png` + `.webp` | 1536×2048 | §5.3.1 | PENDING |
| 15 | Programmer portrait | `art/matchups/act1/programmer.png` + `.webp` | 1536×2048 | §5.3.2 | PENDING |
| 16 | Game Master portrait | `art/matchups/act1/game-master-original.png` + `.webp` | 1536×2048 | §5.3.3 | PENDING |
| 17 | The Authority portrait | `art/matchups/act1/the-authority.png` + `.webp` | 1536×2048 | §5.3.4 | PENDING |
| 18 | Welcome to Celebration cutscene | `videos/act1/welcome-to-celebration.mp4` | 1920×1080 35–45s | §6.1 | PENDING |
| 19 | To Be the Human cutscene | `videos/act1/to-be-the-human.mp4` | 1920×1080 40–55s | §6.2 | PENDING |
| 20 | Hacking Reality cutscene | `videos/act1/hacking-reality.mp4` | 1920×1080 30–40s | §6.3 | PENDING |
| 21 | Last Words runtime | `components/act1/LastWordsFullWitnessing.tsx` | code + existing slides | §6.4 | WIRING |
| 22 | Verdict Stream column | `components/act1/VerdictStreamColumn.tsx` | code | §7.2 | PENDING |
| 23 | Authority Phase bar | `components/act1/AuthorityPhaseBar.tsx` | code | §7.3 | PENDING |
| 24 | Warlord lockout HUD | `components/act1/WarlordLockoutChip.tsx` | code | §7.4 | PENDING |
| 25 | Little Watcher VO | `audio/act1/little_watcher_sixteen_versions.mp3` | mp3 ~3.5s | §8.1 | PENDING |
| 26 | Prince VO — Human farewell | `audio/act1/prince_to_be_the_human.mp3` | mp3 ~8s | §8.2 | PENDING |
| 27 | Warlord VO — three edits | `audio/act1/warlord_three_edits.mp3` | mp3 ~3s | §8.3 | PENDING |
| 28 | Prince VO — rules themselves | `audio/act1/prince_third_edit_rules.mp3` | mp3 ~5s | §8.3 | PENDING |
| — | Prelude VO audit | `audio/prince/`, `audio/elara/`, `audio/human/`, `audio/locke/` | audit pass | §3.1–§3.2 | AUDIT |
| 29 | Section 6 cutscene wiring | `components/act1/TwoWitnessesPart2.tsx` | code + existing Archives backdrop | §9 | SCAFFOLDED |
| 30 | Antiquarian Section 6 VO | `audio/antiquarian/antiq_s6_l{01..14,11a,11b,11c,12c}.mp3` | 15 mp3 takes | §9.2, §9.10 | DRAFTED |
| — | Enigma Section 6 VO | N/A — silent per §9.4 decision 2 | N/A | §9 | DEFERRED to Act 2+ |

**Totals:** 17 new image renders · 3 new cutscene video
renders · 2 runtime-only cutscene wirings (§6.4 *Last Words*,
§9 Section 6) · 4 new UI components · 4 new cutscene VO takes
· 12–16 Antiquarian Section 6 VO takes · 1 Prelude VO audit
pass. Enigma Section 6 VO deferred to Act 2+.

---

## 11. Change Log

- **2026-04-18** — Initial draft. Synthesized from the
  10-item prior batch (shipped 2026-04-12), a full inventory
  sweep of Prelude + Act 1 source docs, and the on-disk
  asset enumeration. Covers Prelude VO audit and every Act 1
  production slot through Section 6's blocked stub.
- **2026-04-18 (rev 2)** — Section 6 unblocked. Four
  `ACT1_NARRATIVE_STRUCTURE.md` §6.7 decisions locked:
  (1) Witnesses stand in Beat J pose; (2) Enigma silent,
  first live line held for Act 2+; (3) Antiquarian does not
  name the Loredex-Programmer identity; (4) closing choice
  replaced with accept/decline/deflect, forgiveness mechanic
  re-scoped to Act 3. §9 expanded with locked staging,
  closing-choice semantics, canon-hygiene consequences of
  decision 3, allowed reveals, a first-draft cutscene
  skeleton, and forward-write surface. Inventory now lists
  29 deliverables + Enigma VO deferred.
- **2026-04-18 (rev 3)** — §9.10 added. First-pass
  Antiquarian dialog script drafted: 14 base lines + 1
  deflect catch-all = 15 total VO takes. All lines pass
  §9.6 canon hygiene. Branch table maps each of the three
  player choices to 13 played lines (12 shared + 1 branch
  response); deflect adds an extra catch-all. Recommended
  recording order and open authoring slots (per-question
  deflect variants, Enigma blocking pass) documented.
