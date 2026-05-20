# Remaining Art + Audio Gaps — 2026-05-19 Post-AAA-Drop

After landing the AAA_Final asset drop, **58 dead dgrsart URLs remain.
Of those, only 15 are real misses** (the other 41 are base-URL constants
flagged in isolation that resolve fine at runtime via prefix composition
— see `docs/audits/2026-05-19-art-completion.md` §2.2).

This doc has full prompts and dimensions for the 15 actionable items —
**8 images + 7 audio tracks**.

**Two of the audio gaps already have source-equivalent tracks on the
bucket** (T02 = "Dischordian Logic", T07 = "To Be the Human"). For
those, the fix is an `aws s3 cp` operation, not a re-record — listed
inline below in §B.

---

## §A — IMAGES (8 assets)

### A.1 — `art/card-game/card-back-seer.png`

**Dimensions**: 750×1050 (TCG card back, 5:7 portrait)
**Format**: PNG (no WebP needed — used as a single tutorial overlay)
**Used by**: `apps/client/src/components/act1/SeerCardFlicker.tsx` —
the Seer-flicker tutorial animation that introduces the player to
face-down cards before the first deck is shown.

**Prompt**:
A TCG card back designed specifically for the Seer tutorial cue.
Base palette: cream (#f1f5f9) and silver, with starfield-blue micro-
detail along the inner border (matches the neutral-faction card back
visual language from `TCG_ART_SPEC.md`). At the center: a vertical
silver staff motif (the Seer's quarterstaff), planted nib-down into a
small base of pale runes. Around the staff: a circular ring of nine
soft-gold runes at low brightness — these are the runes that flicker
during the tutorial animation, so render them subtly enough that a
1.6× brightness boost is visually meaningful. The frame edge is a
chrome border 24 px thick with rounded corners (radius 18 px).
**Render this distinctly less ornate than the standard 7 faction
backs** — this is an instructional card back, not a combat-tense
faction back. Mood: a teacher's pointer. No rendered text. Dark sci-fi
painterly, dramatic chiaroscuro, faint film grain, deep neutral
backdrop.

---

### A.2 — `art/portraits/master_faces/elara.png`

**Dimensions**: 1024×1024 (square character reference portrait)
**Format**: PNG
**Used by**: `apps/shared/expansionArt/__tests__/newArtManifest.test.ts`
— **only referenced in tests, not in production code**.

**Verdict**: Likely a stale reference. Before drawing new art, verify
whether the test still needs this asset — if `git blame` shows the
test was written before the `getNPCPortrait("elara")` typed lookup
shipped (which currently returns Cloudinary URLs from
`apps/client/src/game/npcPortraits.ts:100`), the test should be
deleted, not the asset created.

**If the producer decides to ship this as the canonical reference face**:
A formal "master portrait" of Elara — 3/4 head-and-shoulders bust at
high resolution, neutral expression (mouth closed, eyes direct at
camera, no emotion), plain dark backdrop (deep void-black #010020),
even cinematic studio lighting from upper-left, no rim light, no
hologram effects. This is the canonical reference face that other
portraits (combat, hologram, expression bundles) derive from. Skin
tone matches existing Elara renders on the bucket (`characters/elara/
idle_hologram.avif`). Cyan accent (#22d3ee) only in the iris.
Identity reference, not in-fiction. No text.

---

### A.3 — `art/rooms/room-comms-relay.png`

**Dimensions**: 2752×1536 (matches existing room baselines on bucket)
**Format**: PNG (a `.webp` companion isn't required — the page
references the PNG directly)
**Used by**: `apps/client/src/pages/Act2InterludePage.tsx` as a
`<LivingBackground>` src (full-screen ambient backdrop with low
opacity and 3 particles).

**Context**: Act 2 Interlude is the bridge between the player
completing Act 1 and entering Act 2. The "comms relay" is a smaller
intermediate communications post (not the full bridge `comms_array`
which already exists on the bucket) — a quieter listening station.

**Prompt**:
A small, dim communications-relay post tucked into a side compartment
of the Ark. Wide-angle interior shot, eye-level. A single horseshoe-
shaped console wraps around a central low pedestal that holds a
quiet holographic emitter (faint cyan-blue haze, no projection
currently active). Two operator chairs flank the emitter, one
slightly pushed back as if the operator just stood up. Cabling
drapes from the ceiling in long loose loops. Wall panels show a
frozen waveform paused mid-transmission. No people. Ambient lighting
from inset wall strips: cold cyan-blue dominant, faint warm amber
from the console indicators. Composition leaves the central area
clear so the LivingBackground particle layer can overlay without
fighting the focal subject. Mood: the broadcast is about to resume.
Dark sci-fi painterly. Cyan (#22d3ee) + cold-blue + dim-amber-console
palette. No text.

---

### A.4 — `art/rooms/room-dreams-workshop-subbasement.webp`

**Dimensions**: 2752×1536
**Format**: WebP (the code expects .webp directly)
**Used by**: `apps/client/src/contexts/GameContext.tsx` (the
Dreams-Workshop-Subbasement hidden Ark room — "a low-ceilinged
maintenance level that does not appear on any official deck plan").

**Rich context from the room manifest** (use these to anchor the
composition — they're the named interactables the player can examine):
- **Darren's Desk**: cluttered, nine post-its + a polaroid waiting on it
- **The Inventor's Door**: a narrow stairwell at the far end leading back up
- **Blue Folder**: present somewhere on the desk
- **Dream Loom**: vertical brass frame strung with phosphor-lavender threads, weaves dreams when unobserved
- **Fragment Rack**: wall-rack of small clear vials, each holds a finished thread of dream-weave, labels older than the Ark
- **Mirror Pool**: shallow basin of mercury, surface reflects a ceiling that is not in this room
- **Corkboard**: kept dust-free by whoever still visits this room

**Prompt**:
A low-ceilinged maintenance subbasement of the Ark, lit unevenly by
ranks of buzzing fluorescent tubes — most are intact, two flicker.
The air is warm and visibly hazy from old dust suspended in the
fluorescent glow. The composition is mid-distance, eye-level,
slightly off-axis (this room was not designed by an architect — it
was carved out by someone who wanted privacy). At the far end of
the room, a narrow stairwell rises off-frame (the Inventor's Door).
Left wall: a vertical brass frame (the Dream Loom) strung with
phosphor-lavender threads that glow faintly in the dim air. Right
wall: a wall-rack of small clear vials, each holding a single bright
filament of dream-weave, with hand-lettered labels in a script older
than the Ark. Far-right corner: a shallow stone basin filled with
mirror-still mercury, the reflection in the basin showing a vaulted
gothic ceiling that is *not* the ceiling of this room. Back wall:
a cluttered industrial desk with nine yellow post-it notes
scattered across the corkboard above it (block-caps handwriting,
slightly uneven), a polaroid pinned to the corkboard, and a single
blue manila folder sitting on the desk. A coffee mug. A reading
lamp on. **The corkboard is dust-free** — everything else has a
visible layer of dust. No people in frame. Mood: someone keeps this
room despite official records claiming it doesn't exist. Warm-amber
fluorescent + phosphor-lavender + mercury-silver palette. No
rendered text on the post-its (the player examines them via UI).
Film grain. Dark sci-fi painterly.

---

### A.5 — `art/rooms/room-engineers-bench.png`

**Dimensions**: 2752×1536
**Format**: PNG
**Used by**: `apps/client/src/pages/EngineersBenchPage.tsx`
(`<LivingBackground>` with `benchAccent` color, opacity 0.12, 4
particles)

**Prompt**:
A working engineer's bench in a warm-lit workshop on the Ark.
Wide-angle interior, eye-level, slightly elevated. A long L-shaped
tool counter dominates the foreground — neatly organized hand tools
mounted in shadow-board outline above the bench (every tool has its
silhouette painted so missing tools are visible). The workspace
itself has a half-disassembled small surveillance drone laid out
in pieces — chassis open, three small sub-assemblies arranged in
order of how they came apart, tweezers and a magnifying glass
nearby. A ceramic coffee mug at the corner of the bench (still
faintly steaming — the engineer was here recently). Above the bench
hovering at chest height: an inactive holographic schematic of the
drone in cyan wireframe, frozen mid-rotation. Walls: cork-and-pegboard
texture, exposed amber sodium-vapor bulbs casting warm working light.
Behind the bench, in deep background: a tall storage rack of
labeled component bins. No people. Composition leaves the central
workspace clear for LivingBackground overlay. Mood: paused work
waiting to resume. Warm amber primary + cool cyan-blue holographic
accent. No text. Dark sci-fi painterly. Film grain.

---

### A.6 — `art/rooms/room-game-masters-arena.png`

**Dimensions**: 2752×1536
**Format**: PNG
**Used by**: `apps/client/src/pages/GameMastersArenaAct2Page.tsx`
(`<LivingBackground>`, 0.12 opacity, 3 particles)

**Prompt**:
A small ceremonial arena chamber set up as a private chess room.
Wide interior shot, eye-level, slightly elevated angle looking down
on the center. The chamber is circular — vaulted ceiling, dark
panelled walls in deep royal blue and chrome, the floor a polished
stone disc with a thin chrome ring inlaid around the perimeter. At
the absolute center: a single illuminated chess-style game table,
two empty chairs facing each other across the board, the board
itself displaying a **frozen mid-game position** with chess pieces
in carved chrome-and-obsidian (no specific recognizable opening —
late-mid-game, both sides have lost material). Hovering above the
table at chest height: a holographic projection of the same board
rendered in 3D wireframe, slowly rotating (frozen mid-rotation for
the still). Around the wall perimeter: tall banners of past players
hanging from the ceiling — faces obscured / silhouetted (the Game
Master remembers, the room remembers, the player doesn't yet).
Spotlights cluster down onto the table from a chrome ring overhead;
the walls and banners are in dim violet shadow. No people. The
chairs are inviting, not threatening. Mood: the rematch is on the
schedule. Royal-blue (#1e3a8a) + chrome + warm-amber-spotlight
palette. Dark sci-fi painterly. Film grain. No text.

---

### A.7 — `art/ship/bunkroom_corridor.webp`

**Dimensions**: 2752×1536
**Format**: WebP (.webp expected)
**Used by**: `apps/client/src/pages/BunkroomPage.tsx` (the crew
quarters page; renderer falls back to a tinted placeholder if missing)

**Prompt**:
A long narrow Ark crew-quarters corridor at low-light night cycle.
The composition is straight-on perspective looking down the corridor,
strong vanishing-point depth, the corridor narrowing into the deep
background. Twin rows of recessed bunk doors line either side, each
door with a small illuminated bunk-number stencilled above
(BR-101 through BR-118 ascending into the distance) — render the
numbers crisp enough to feel like a real shipboard ID system, but
don't try to make them legible from far away. A single overhead
ceiling light burns at half-power roughly midway down the corridor
— the rest of the corridor is lit by recessed soft-cyan emergency
strips along the baseboards. Sense of *habitation* — not abandoned:
a folded jacket on a hook outside one bunk, a single coffee cup
sitting on the corridor floor outside another bunk door, a small
hand-written note taped to a third bunk door (don't render the
text). At the far end of the corridor: a sealed pressure door, the
"NIGHT CYCLE: SILENCE PROTOCOL" indicator above it glowing dim red.
No people. Steel-grey + cyan emergency + warm-amber half-power
overhead palette. Mood: shipboard sleep. Dark sci-fi painterly.
Film grain.

---

### A.8 — `backgrounds/room-archives.webp`

**Dimensions**: 1920×1080 (16:9 hero, used as a full-page background
plate via inline `background-image` CSS — not via `<LivingBackground>`)
**Format**: WebP
**Used by**: `apps/client/src/components/act1/TwoWitnessesPart2.tsx`
— the Act 1 cycle-C witnessing surface backdrop (60% opacity).

**Note on path**: this URL is at `backgrounds/room-archives.webp`,
**not** the canonical `art/rooms/...` location. Consider whether to
also upload to `art/rooms/archives_witness/baseline.png` for
consistency with the rest of the room library. If keeping the
existing path, the asset goes to `cdn/client-public/backgrounds/
room-archives.webp`.

**Prompt**:
A vast Antiquarian archive seen from a moderate distance — vaulted
stone hall, ceiling arches receding into deep amber haze. The
composition is wide-angle and *low-busy* — designed to sit behind
high-contrast UI at 60% opacity, so the visual energy lives in the
periphery and the center is open. Multiple tiers of stone shelves
recede into the depth, packed with leather-bound volumes, scroll
cases, sealed canopic jars, a half-lit reading sconce here and
there. A long reading table in the deep middle-distance has a single
brass desk lamp on, illuminating an open ledger no one is reading.
Foreground: a faint scatter of dust motes lit by an off-frame
amber lamp. Color palette: amber (#f59e0b), aged parchment, brass,
deep temporal-blue (#3b82f6) sconce accents. No people. No text on
any visible book or scroll (player will overlay UI text). Mood:
the room has been waiting. Dark sci-fi painterly with
classical-archive notes. Film grain. Slight warm vignette.

---

## §B — AUDIO (7 tracks)

**Important**: Two of these gaps already have **source-equivalent
tracks on the bucket** that can be resolved with `aws s3 cp` — no
new audio production needed. These are flagged below.

### B.1 — `audio/album1/T11.mp3` ("The Empire Reborn")

**Format**: MP3 192 kbps, ~3-5 min runtime
**Used by**: `apps/shared/dreamerVisions.ts` (Vision 2 cutscene
caption set + companion slideshow frames at `art/slideshows/album1/T11/`)

**Context**: T11 in the Album 1 "Age of Dischordian Logic" sequence.
Per `apps/shared/dreamerVisions.ts:24`, T11's lyrical content
includes the noblewoman-with-the-ledger imagery used in the Dreamer's
Vision-2 sequence ("she keeps a ledger you cannot read", "and her
mirror keeps no faces"). The track is hinted at as the Vex Solène
introduction — aristocratic-riddle vocal cadence.

**Suno prompt**: *Dark sci-fi neo-soul slow burn, female lead with
aristocratic-riddle delivery, sparse instrumentation — minor-key
piano, distant strings, low brass swell at chorus. Production style:
Cowboy Bebop × Cyberpunk Edgerunners × Afro-samurai noir. 4/4, ~78
BPM. Lyrical voice: Vex Solène — older noblewoman speaking in
ledgers and mirrors, voice never raised. Themes: surveillance as
aristocratic record-keeping, the empire being rebuilt one
bookkeeping entry at a time, the player as an entry. Title:* **"The
Empire Reborn"**. *Mood: chrome on velvet.*

---

### B.2 — `audio/album1/T18.mp3` ("Planet of the Wolf")

**Format**: MP3 192 kbps, ~3-5 min
**Used by**: `apps/shared/dreamerVisions.ts` and `album1Slideshows`

**Context**: T18 sits in the Album 1 sequence late in the "Age of
Dischordian Logic" arc — the wolf imagery aligns thematically with
the Insurgency-faction songs and the Iron Lion mythos. Frames on
the bucket at `art/slideshows/album1/T18/` show wolf-pack iconography.

**Suno prompt**: *Driving post-rock with tribal percussion, male
lead vocal in lower register with a controlled growl, layered choir
on the bridge. Production style: Cowboy Bebop × Mad Max × dystopian
guerrilla anthem. 4/4, ~120 BPM. Lyrical voice: a pack leader
addressing his people on the eve of a strike. Themes: territory
without flag, loyalty before law, the planet itself as the only
banner the pack will stand under. Hook: "this is the planet of the
wolf". Title:* **"Planet of the Wolf"**. *Mood: defiance with bared
teeth.*

---

### B.3 — `audio/album1/T23.mp3` ("Wake Up")

**Format**: MP3 192 kbps, ~3-4 min
**Used by**: `apps/shared/dreamerVisions.ts`

**Context**: T23 is the second-to-last track on Album 1 ("Wake Up"
→ T24 "Welcome to Celebration" → T25 "Previews"). It's the album's
emotional pivot to the Age of Privacy — the wake-up call that ends
the Age of Dischordian Logic. Slideshow frames at `art/slideshows/
album1/T23/` depict the cryo-thaw / awakening imagery used at the
Ark's first season-opener.

**Suno prompt**: *Slow-build alternative rock anthem with a
folk-acoustic intro escalating to full-band climax. Male lead with
a hoarse, urgent tone — the song is the singer trying to convince
themselves as much as the listener. Production style: Cowboy Bebop
finale × Cyberpunk Edgerunners awakening-montage × confessional
indie. 4/4, ~88 BPM, half-time feel. Lyrical voice: an Ark survivor
who has finally accepted the cryo-wake is permanent. Themes:
denial → bargaining → acceptance, the world-after-the-end, the
demand that the listener also wake up. Hook: "wake up — the dream
is the trap". Title:* **"Wake Up"**. *Mood: dawn after a long
night.*

---

### B.4 — `audio/music/celebration/welcome-to-celebration.mp3`

**Format**: MP3 192 kbps
**Used by**: `apps/client/src/data/celebrationSlideshow.ts` —
audio bed for the Celebration park slideshow.

**Bucket already has the source on the producer side**:
`s3://dgrsart/Videos/Welcome to Celebration & Mechronis.zip` (735
MB — this is the source-of-truth zip with audio + video). Also note
`audio/album1/T24.mp3` should be this same track per the album1
title listing ("T24: Welcome to Celebration") — **check if T24
already exists at `audio/album1/T24.mp3`**; if so, copy:

```bash
aws s3 cp s3://dgrsart/cdn/client-public/audio/album1/T24.mp3 \
          s3://dgrsart/cdn/client-public/audio/music/celebration/welcome-to-celebration.mp3 \
  --content-type audio/mpeg --cache-control 'public, max-age=31536000, immutable'
```

**If T24 doesn't exist or differs, Suno prompt**:
*Funk-influenced upbeat anthem with brass section, female lead with
gospel-tinged warmth, hand-claps and a tight rhythm section.
Production style: Cowboy Bebop's Tank! × Parliament-Funkadelic ×
Cyberpunk Edgerunners' upbeat licensed cues. 4/4, ~108 BPM.
Lyrical voice: the Celebration park's resident emcee greeting new
arrivals. Themes: the simulated joy of a corporate amusement park
that is also a memorial; the welcome that is also a quiet warning.
Hook: "welcome to Celebration, friend — leave your year at the
door". Title:* **"Welcome to Celebration"**. *Mood: brass-band
performance with a held-breath undercurrent.*

---

### B.5 — `audio/music/mechronis/to-be-the-human.mp3`

**Format**: MP3 192 kbps
**Used by**: `apps/client/src/data/mechronisSlideshow.ts`

**Bucket already has an identical-content track**:
`s3://dgrsart/cdn/client-public/audio/album1/T07.mp3` is the
album1's "To Be The Human" track (per the track-listing in
`apps/shared/expansionArt/album1Slideshows.ts`, T07 = "To Be The
Human"). **Fix is a copy, no new audio needed**:

```bash
aws s3 cp s3://dgrsart/cdn/client-public/audio/album1/T07.mp3 \
          s3://dgrsart/cdn/client-public/audio/music/mechronis/to-be-the-human.mp3 \
  --content-type audio/mpeg --cache-control 'public, max-age=31536000, immutable'
```

The Mechronis Academy slideshow uses the album version. No re-record
required.

---

### B.6 — `audio/music/song_last_words_prelude_full.mp3`

**Format**: MP3 192 kbps
**Used by**: `apps/client/src/components/act1/act1CycleCWitnessing.ts`
(`LAST_WORDS_FULL_SONG_URL`)

**Bucket has the source zip and two related cuts**:
- `s3://dgrsart/AAA Final/last_words_only.zip` (21 MB) — source zip
- `s3://dgrsart/cdn/client-public/audio/music/song_last_words_prelude_cut.mp3` (4.66 MB) — shorter cut
- `s3://dgrsart/cdn/client-public/audio/music/song_last_words_prelude_tease.mp3` (716 KB) — 30s tease

**Option 1 (extract from zip)**: pull
`AAA Final/last_words_only.zip`, find the full-length stem inside,
upload to the target path. Likely fastest route — the producer
already shipped the audio.

**Option 2 (Suno re-record if extract isn't viable)**:
*Cinematic ballad — male lead with a desperate clarity (the singer
is testifying, not performing). Sparse piano + string quartet
intro, full orchestral swell on the second chorus, returns to
solo piano in the outro. Production style: Cowboy Bebop's "The
Real Folk Blues" × Final Fantasy main theme × confession booth.
4/4, ~72 BPM. Lyrical voice: a witness delivering their last
words to a courtroom that has already decided. Themes: the
testimony that outlives the verdict, the act of speaking on the
record knowing nobody is listening. Length: 3:30-4:00. Title:*
**"Last Words (Prelude — full version)"**. *Mood: the dignity of
the final statement.*

---

### B.7 — `audio/songs/dischordian_logic.mp3`

**Format**: MP3 192 kbps
**Used by**: `apps/client/src/pages/DischordianLogicSongPage.tsx`
(`AUDIO_SRC` — the dedicated song page's audio bed).

**Bucket already has the identical track** at
`audio/album1/T02.mp3` (4.2 MB — per album1 listing, T02 =
"Dischordian Logic"). **Fix is a copy**:

```bash
aws s3 cp s3://dgrsart/cdn/client-public/audio/album1/T02.mp3 \
          s3://dgrsart/cdn/client-public/audio/songs/dischordian_logic.mp3 \
  --content-type audio/mpeg --cache-control 'public, max-age=31536000, immutable'
```

The DischordianLogicSongPage is the standalone-page presentation of
the same track that's already in the album1 manifest. No re-record
needed.

---

## §C — Quick-fix copy operations (3 audio gaps resolved without new audio)

Three of the seven audio gaps (§B.4 if T24 exists, §B.5, §B.7) are
already on the bucket as the album1 master and can be resolved with
S3 server-side copies:

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-2

# B.5 — To Be The Human (album1 T07 already lives at this hash)
aws s3 cp s3://dgrsart/cdn/client-public/audio/album1/T07.mp3 \
          s3://dgrsart/cdn/client-public/audio/music/mechronis/to-be-the-human.mp3 \
  --content-type audio/mpeg \
  --cache-control 'public, max-age=31536000, immutable'

# B.7 — Dischordian Logic (album1 T02)
aws s3 cp s3://dgrsart/cdn/client-public/audio/album1/T02.mp3 \
          s3://dgrsart/cdn/client-public/audio/songs/dischordian_logic.mp3 \
  --content-type audio/mpeg \
  --cache-control 'public, max-age=31536000, immutable'

# B.4 — Welcome to Celebration (verify T24 exists first)
aws s3api head-object --bucket dgrsart \
  --key cdn/client-public/audio/album1/T24.mp3 2>/dev/null && \
aws s3 cp s3://dgrsart/cdn/client-public/audio/album1/T24.mp3 \
          s3://dgrsart/cdn/client-public/audio/music/celebration/welcome-to-celebration.mp3 \
  --content-type audio/mpeg \
  --cache-control 'public, max-age=31536000, immutable'
```

After these copies, only **4 audio tracks** are genuinely missing
(T11, T18, T23, last_words_full) — and the last_words full
version can likely be extracted from `AAA Final/last_words_only.zip`,
leaving **only 3 album1 tracks that need real Suno production
(T11, T18, T23)**.

---

## §D — Final actionable summary

| Class | Item | Dimensions / Format | Source |
|---|---|---|---|
| Image | `art/card-game/card-back-seer.png` | 750×1050 PNG | Nano Banana — §A.1 |
| Image | `art/portraits/master_faces/elara.png` | 1024×1024 PNG | Likely stale test ref — verify before generating |
| Image | `art/rooms/room-comms-relay.png` | 2752×1536 PNG | Nano Banana — §A.3 |
| Image | `art/rooms/room-dreams-workshop-subbasement.webp` | 2752×1536 WebP | Nano Banana — §A.4 |
| Image | `art/rooms/room-engineers-bench.png` | 2752×1536 PNG | Nano Banana — §A.5 |
| Image | `art/rooms/room-game-masters-arena.png` | 2752×1536 PNG | Nano Banana — §A.6 |
| Image | `art/ship/bunkroom_corridor.webp` | 2752×1536 WebP | Nano Banana — §A.7 |
| Image | `backgrounds/room-archives.webp` | 1920×1080 WebP | Nano Banana — §A.8 |
| Audio | `audio/album1/T11.mp3` "The Empire Reborn" | MP3 192k | Suno — §B.1 |
| Audio | `audio/album1/T18.mp3` "Planet of the Wolf" | MP3 192k | Suno — §B.2 |
| Audio | `audio/album1/T23.mp3` "Wake Up" | MP3 192k | Suno — §B.3 |
| Audio | `audio/music/celebration/welcome-to-celebration.mp3` | MP3 192k | **Copy** album1/T24 if it exists; else Suno — §B.4 |
| Audio | `audio/music/mechronis/to-be-the-human.mp3` | MP3 192k | **Copy** from album1/T07 — §B.5 |
| Audio | `audio/music/song_last_words_prelude_full.mp3` | MP3 192k | **Extract** from `AAA Final/last_words_only.zip`; else Suno — §B.6 |
| Audio | `audio/songs/dischordian_logic.mp3` | MP3 192k | **Copy** from album1/T02 — §B.7 |

**Genuinely new production needed:**
- **6 new images** (skip A.2 master_faces/elara unless the test is retained)
- **3 new audio tracks** (T11, T18, T23 — assuming the copies and zip-extraction resolve the other 4 audio gaps)

After landing these 9 new assets + the 3 copy operations, the
dead-dgrsart-URL count should drop to ~41, all of which are the
base-URL false positives flagged in `docs/audits/2026-05-19-art-
completion.md` §2.2 and not real misses.

---

## Upload path conventions

Per `apps/scripts/upload-public-to-s3.ts` and the existing producer
drop pattern:

```
art/cards/<faction>/<descriptor>.{png,webp}        # TCG card art
art/rooms/<snake_name>/baseline.{png,webp}         # Scene rooms (new pattern)
art/rooms/<legacy-name>.{png,webp}                 # Legacy hero rooms (pre-pattern)
art/portraits/master_faces/<name>.{png}            # Canonical reference faces
art/ship/<descriptor>.{png,webp}                   # Ship-interior plates
art/card-game/<descriptor>.{png}                   # Card-game UI overlays
backgrounds/<descriptor>.{webp}                    # Legacy page-background prefix (pre-art/)
audio/album<N>/T<NN>.mp3                           # Album tracks
audio/music/<category>/<name>.mp3                  # Categorised music
audio/songs/<slug>.mp3                             # Standalone songs
```

Upload via `pnpm assets:upload` (walks `apps/client/public/{art,
audio,videos,music,games,vo,characters,vfx-atlases}` → PUTs to
`s3://dgrsart/cdn/client-public/`) or direct `aws s3 cp` with
`--cache-control 'public, max-age=31536000, immutable'` and
appropriate `--content-type`.

Re-run audit after upload:

```bash
bash docs/production/audit/extract-urls.sh
bash docs/production/audit/probe-cdn.sh
awk -F'\t' '$2 ~ /dgrsart/ && $1 == "403"' \
  docs/production/audit/cdn-liveness.tsv | wc -l
```
