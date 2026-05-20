# Remaining Asset Production Spec — Loredex OS

**Single-source production document.** Everything that still needs to
be created or copied to close the art-completion audit. 6 images +
4 audio tracks + 3 server-side audio copies + 1 zip extraction.
Each section is self-contained — hand any one prompt to the named
tool and the result is the deliverable.

After all 14 items land, dead-dgrsart-URL count drops to ~41
runtime-composed base-URL false positives (not real misses).
The art audit is functionally complete.

---

## 0. Quick-start ops (do these first — no production needed)

Three audio gaps are already on the bucket as the album-master
version. They resolve with one-second server-side copies:

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-2

# Copy 1: "To Be The Human" — Mechronis slideshow uses album1 T07
aws s3 cp \
  s3://dgrsart/cdn/client-public/audio/album1/T07.mp3 \
  s3://dgrsart/cdn/client-public/audio/music/mechronis/to-be-the-human.mp3 \
  --content-type audio/mpeg \
  --cache-control 'public, max-age=31536000, immutable'

# Copy 2: "Dischordian Logic" — standalone song page uses album1 T02
aws s3 cp \
  s3://dgrsart/cdn/client-public/audio/album1/T02.mp3 \
  s3://dgrsart/cdn/client-public/audio/songs/dischordian_logic.mp3 \
  --content-type audio/mpeg \
  --cache-control 'public, max-age=31536000, immutable'
```

Two more gaps can be resolved by extracting from existing
producer-side zips on the bucket (no re-record needed):

```bash
# Extract 1: "Last Words (full)" — pull from AAA Final/last_words_only.zip
mkdir -p /tmp/last-words-extract
aws s3 cp "s3://dgrsart/AAA Final/last_words_only.zip" /tmp/last-words-extract/
cd /tmp/last-words-extract && unzip -o last_words_only.zip
# Find the longest .mp3 in the zip (likely the full mix), then:
aws s3 cp <FOUND_FILE> \
  s3://dgrsart/cdn/client-public/audio/music/song_last_words_prelude_full.mp3 \
  --content-type audio/mpeg \
  --cache-control 'public, max-age=31536000, immutable'

# Extract 2: "Welcome to Celebration" — pull from Videos/ zip
mkdir -p /tmp/celebration-extract
aws s3 cp "s3://dgrsart/Videos/Welcome to Celebration & Mechronis.zip" \
  /tmp/celebration-extract/
cd /tmp/celebration-extract && unzip -o "Welcome to Celebration & Mechronis.zip"
# The zip contains video; extract audio with ffmpeg if no standalone mp3 inside:
ffmpeg -i "Welcome to Celebration.mp4" -vn -acodec libmp3lame -b:a 192k \
  /tmp/welcome-to-celebration.mp3
aws s3 cp /tmp/welcome-to-celebration.mp3 \
  s3://dgrsart/cdn/client-public/audio/music/celebration/welcome-to-celebration.mp3 \
  --content-type audio/mpeg \
  --cache-control 'public, max-age=31536000, immutable'
```

**That resolves 5 of the 15 remaining gaps via copy/extract.**

Net remaining real production work: **6 new images + 4 new audio tracks**
(§A and §B below). One image (`master_faces/elara.png`) is referenced
only in tests — verify whether the test should be deleted instead of
the asset created (see §A.2).

---

## §A — Image Production (6 — Nano Banana / Imagen / Midjourney / SDXL)

**Universal style anchor:** dark sci-fi painterly, dramatic chiaroscuro,
rich detail, film grain, cinematic framing. No rendered text anywhere
in the painting (text overlays are added at runtime via UI). Match the
Dischordian Saga visual language: deep-space black `#010020` base
tones, cyan `#22d3ee` accent on tech, faction palettes per the bible
(`docs/TCG_ART_SPEC.md`).

**Upload target after generation:** `apps/client/public/<full-path>`
then run `pnpm assets:upload` to publish to S3 with
`Cache-Control: public, max-age=31536000, immutable`. Or upload
directly with `aws s3 cp` (see §D).

---

### A.1 — Seer tutorial card back

**Output file:** `art/card-game/card-back-seer.png`
**Dimensions:** 750 × 1050 px (5:7 portrait, standard TCG card back)
**Format:** PNG, 8-bit RGBA, ≤ 2 MB
**Consumed by:** `apps/client/src/components/act1/SeerCardFlicker.tsx`
— tutorial animation where this card back is shown face-down then
"flickers" to reveal a card mid-animation. The flicker boosts
brightness 1.6× and animates the ring runes — render the runes at
~40% baseline brightness so the runtime boost is visually
significant.

**Style reference:** `docs/TCG_ART_SPEC.md` §1 ("card backs"), the
neutral / Ark faction back (`card_back_neutral.png`) is the closest
visual cousin. **Render this distinctly LESS ornate than the seven
faction backs** — this is an instructional card back, not a
combat-tense faction back.

**Prompt:**

> A TCG card back designed specifically for a tutorial cue. Vertical
> 5:7 portrait composition, 750×1050. Base palette: cream `#f1f5f9`
> and silver, with starfield-blue (`#3b82f6` at 30% opacity)
> micro-detail along the inner border. At the absolute center: a
> vertical silver quarterstaff motif (the Seer's staff), planted
> nib-down into a small circular base of pale runes. Around the
> staff at radius 280 px from center: a ring of nine soft-gold
> (`#fbbf24`) runes evenly spaced, rendered at low brightness
> (~40% — these flicker at 1.6× during the tutorial animation, so
> headroom matters). Frame edge: chrome border 24 px thick with
> rounded corners (radius 18 px). Background: dark neutral void
> with faint starfield far behind the staff. Lighting: subtle
> chiaroscuro from upper-left, no rim light. Dark sci-fi painterly.
> Film grain. No rendered text. No human figures. Mood: a teacher's
> pointer — instructional, calm.

---

### A.2 — Elara canonical reference portrait

**Output file:** `art/portraits/master_faces/elara.png`
**Dimensions:** 1024 × 1024 px (square reference)
**Format:** PNG, 8-bit RGBA
**Consumed by:** `apps/shared/expansionArt/__tests__/newArtManifest.test.ts`
**only** — no production-code reference.

**⚠️ Decision required before generating:** This asset appears only
in a test fixture. Run `git blame apps/shared/expansionArt/__tests__/newArtManifest.test.ts:116`
to check whether the assertion was written before the
`getNPCPortrait("elara")` typed lookup landed in
`apps/client/src/game/npcPortraits.ts` (which currently returns
Cloudinary URLs at runtime). If the test predates the typed lookup,
**delete the test assertion instead of producing this asset**.
If the producer wants this as the canonical reference face from
which all other Elara portraits derive, prompt below.

**Prompt (only if proceeding):**

> A formal canonical reference portrait of Elara — 3/4
> head-and-shoulders bust, 1024×1024 square. Neutral expression:
> mouth closed, eyes direct at camera, no emotion. Plain dark
> backdrop (`#010020` deep void-black, no gradient). Even
> cinematic studio lighting from upper-left at ~30° angle, no
> rim light, no environmental reflections, no hologram effects.
> Skin tone matches existing Elara renders at
> `cdn/client-public/characters/elara/idle_hologram.avif` —
> warm-neutral, mid-tone. Eyes: cyan iris `#22d3ee` with subtle
> bloom, normal pupil, no glow effect. Hair: existing canonical
> style (refer to `characters/elara/viseme.avif` for hair
> reference). Costume: minimal — the canonical bridge-officer
> uniform's collar should be visible at the bottom edge but
> uniform details should NOT be the focal point. This is a
> face-reference plate, intended as the source-of-truth for
> downstream portrait derivations. No film grain on this one
> (clinical reference, not in-fiction). No text.

---

### A.3 — Act 2 communications relay

**Output file:** `art/rooms/room-comms-relay.png`
**Dimensions:** 2752 × 1536 px (16:9 cinematic widescreen, matches
existing room baselines on bucket)
**Format:** PNG, 8-bit RGB, ≤ 8 MB
**Consumed by:** `apps/client/src/pages/Act2InterludePage.tsx` as the
`<LivingBackground>` src — full-screen ambient backdrop rendered at
**8% opacity** with 3 particles overlaid (a violet-indigo accent
color, `rgba(99, 102, 241, 0.35)`). The composition must leave the
visual center mostly clear so UI overlays read cleanly.

**Narrative context:** Act 2 Interlude is the bridge between Acts
1 → 2. The "comms relay" is a **smaller, more intimate**
communications post than the main bridge `comms_array` (which
already exists at `cdn/client-public/art/rooms/comms_array/baseline.png`).
Picture a side-compartment listening station, not the full bridge.

**Prompt:**

> A small, dim communications-relay post tucked into a side
> compartment of the Inception Ark. Wide-angle interior shot,
> 2752×1536, eye-level perspective, slight off-axis (the room
> feels improvised rather than designed). **The visual energy
> lives at the edges; the center is intentionally open** for a
> UI overlay. Foreground center: a single horseshoe-shaped console
> wrapping around a low pedestal that holds a quiet holographic
> emitter (faint cyan-blue haze, no projection currently active —
> the broadcast is paused, not finished). Two operator chairs
> flank the emitter; the left chair is slightly pushed back as
> if the operator just stood up mid-shift. Cabling drapes from
> the ceiling in long loose loops on either side of the
> composition. Walls (left and right): inset panels showing a
> frozen waveform paused mid-transmission. Ceiling: low, with
> recessed strip lighting. No people in frame. Lighting: cold
> cyan-blue dominant (`#22d3ee` from wall strips and emitter),
> faint warm amber from console indicators (`#fbbf24` at 30%).
> Dark sci-fi painterly. Film grain. No text. Mood: the broadcast
> is about to resume.

---

### A.4 — Dreams Workshop subbasement (hidden Ark room)

**Output file:** `art/rooms/room-dreams-workshop-subbasement.webp`
**Dimensions:** 2752 × 1536 px
**Format:** WebP @ q85, ≤ 2 MB
**Consumed by:** `apps/client/src/contexts/GameContext.tsx` (room
manifest entry `id: "dreams-workshop-subbasement"`, name "Dreams
Workshop (Sub-Basement)") — a hidden Ark room described in the
manifest as *"A low-ceilinged maintenance level that does not
appear on any official deck plan. The air is warm. The
fluorescents hum. Nine post-its and a polaroid wait on a cluttered
desk at the back wall. Nobody has been here in a while — except
whoever keeps the dust off the corkboard."*

**Interactables that must be visually present** (the player examines
each via UI hotspots — the art is the stage):
- **Darren's Desk** — cluttered industrial desk at the back wall
- **The Inventor's Door** — narrow stairwell rising off-frame leading back up to the Bridge
- **Blue Folder** — sitting on the desk
- **Dream Loom** — vertical brass frame strung with phosphor-lavender threads (left wall, top-left area)
- **Fragment Rack** — wall-rack of small clear vials, each holds a finished thread of dream-weave, labels older than the Ark (right wall, top-right area)
- **Mirror Pool** — shallow basin of mercury, surface reflects a ceiling that is NOT in this room (right wall, mid-area)
- **Corkboard** — kept dust-free by whoever still visits this room (above the desk)
- **Nine Post-Its** — yellow, hand-written in uneven block-caps, scattered across the corkboard + lamp base
- **A Polaroid** — pinned to the corkboard

**Prompt:**

> A low-ceilinged maintenance subbasement of the Inception Ark,
> 2752×1536, wide-angle interior shot, mid-distance, eye-level,
> slightly off-axis perspective (the room was not architecturally
> designed — it was carved out by someone who wanted privacy).
> Lit unevenly by ranks of buzzing industrial fluorescent tubes
> mounted in the low ceiling — most are intact, two flicker
> visibly. The air is warm and **visibly hazy** from old dust
> suspended in the fluorescent glow. **Far end of room
> (background-right)**: a narrow stairwell rises off-frame
> upward — this is the Inventor's Door, the way back to the
> Bridge. **Left wall (foreground-left through mid-distance)**:
> a vertical brass frame about chest-high — the Dream Loom —
> strung with phosphor-lavender threads (color `#c084fc`) that
> glow faintly in the dim air. **Right wall (foreground-right
> through mid-distance)**: a wall-mounted rack of small clear
> glass vials in neat rows, each holding a single bright
> filament of dream-weave; hand-lettered labels visible but
> not readable (script older than the Ark — undecipherable
> glyphs). **Right wall (mid-distance, lower)**: a shallow stone
> basin filled with mirror-still mercury; the reflection in the
> basin clearly shows a vaulted gothic cathedral ceiling that
> is NOT the ceiling of this room. **Back wall (deep
> background)**: a cluttered industrial desk with a reading lamp
> ON, throwing warm amber over the desktop. Above the desk: a
> corkboard with nine yellow post-it notes scattered across it
> in uneven block-caps handwriting (don't render legible text),
> a polaroid pinned to the corkboard, a single blue manila
> folder lying on the desk surface, a coffee mug, scattered
> tools. **The corkboard is conspicuously dust-free** — every
> other surface in the room has a visible layer of dust. No
> people in frame. Palette: warm-amber fluorescent
> (`#fbbf24` at 60%) + phosphor-lavender (`#c084fc`) +
> mercury-silver + deep shadow black. Dark sci-fi painterly,
> film grain, slight tilt-shift on the depth focus. No text.
> Mood: someone keeps this room despite the deck-plan claiming
> it doesn't exist.

---

### A.5 — Engineer's workshop bench

**Output file:** `art/rooms/room-engineers-bench.png`
**Dimensions:** 2752 × 1536 px
**Format:** PNG, 8-bit RGB, ≤ 8 MB
**Consumed by:** `apps/client/src/pages/EngineersBenchPage.tsx`
as `<LivingBackground>` at 12% opacity with 4 particles + a
`benchAccent` color overlay (cyan-leaning). The composition
should leave the central workspace area open for UI overlay.

**Prompt:**

> A working engineer's bench in a warm-lit workshop aboard the
> Ark, 2752×1536, wide-angle interior, eye-level, slightly elevated
> looking down. **Foreground (occupying lower 60% of the frame)**:
> a long L-shaped tool counter — neatly organized hand tools
> mounted in shadow-board outline on the wall behind the bench
> (each tool's silhouette painted onto the pegboard so missing
> tools would be visible at a glance). **The workspace surface
> itself (center frame)**: a half-disassembled small surveillance
> drone laid out in pieces — chassis open, three small
> sub-assemblies arranged in order of how they came apart,
> tweezers and a magnifying glass beside them, a small parts
> tray to one side. **Corner of the bench (foreground-right)**: a
> ceramic coffee mug, still faintly steaming (the engineer was
> here recently). **Hovering above the bench at chest height,
> mid-frame**: an inactive holographic schematic of the drone
> rendered in cyan (`#22d3ee`) wireframe, frozen mid-rotation.
> **Walls**: cork-and-pegboard texture; exposed amber sodium-vapor
> bulbs (`#fbbf24`) casting warm working light from off-frame
> upper-left. **Background (deep)**: a tall storage rack of
> labeled component bins receding into shallow depth. No people.
> Palette: warm amber (`#fbbf24`) primary, cool cyan-blue
> (`#22d3ee`) holographic accent, mid-grey concrete floor visible
> at the very bottom of the frame. Dark sci-fi painterly. Film
> grain. No text. Mood: paused work waiting to resume.

---

### A.6 — Game Master's private arena chamber

**Output file:** `art/rooms/room-game-masters-arena.png`
**Dimensions:** 2752 × 1536 px
**Format:** PNG, 8-bit RGB, ≤ 8 MB
**Consumed by:** `apps/client/src/pages/GameMastersArenaAct2Page.tsx`
as `<LivingBackground>` at 12% opacity with 3 particles + a faction
accent color.

**Prompt:**

> A small ceremonial arena chamber set up as a private chess room,
> 2752×1536, wide interior shot, eye-level, slightly elevated
> looking down on the center. **The chamber is circular** — vaulted
> ceiling overhead, dark panelled walls in deep royal blue
> (`#1e3a8a`) and chrome, floor a polished stone disc with a thin
> chrome ring inlaid around the perimeter. **At the absolute
> center of the floor**: a single illuminated chess-style game
> table with two empty chairs facing each other across the board.
> **The board itself** shows a frozen mid-game position with
> carved chess pieces in chrome-and-obsidian — no specific
> recognizable opening, late-mid-game, both sides have lost
> material; black king is at risk but not yet in check.
> **Hovering above the table at chest height**: a holographic
> projection of the same board rendered in cyan (`#22d3ee`)
> wireframe 3D, slowly rotating (frozen mid-rotation for this
> still). **Walls (perimeter)**: tall banners hang from the
> ceiling around the wall — banners of past players, faces
> rendered as silhouettes / shadowed (the Game Master remembers
> the players, the room remembers, the viewer doesn't yet).
> **Lighting**: spotlights cluster down onto the table from a
> chrome ring overhead; the walls and banners are in dim violet
> shadow. The two chairs are inviting, not threatening. No
> people. Palette: royal blue (`#1e3a8a`) + chrome + warm-amber
> spotlight (`#fbbf24` at the table) + dim violet at the
> perimeter. Dark sci-fi painterly. Film grain. No text. Mood:
> the rematch is on the schedule.

---

### A.7 — Crew bunkroom corridor (night cycle)

**Output file:** `art/ship/bunkroom_corridor.webp`
**Dimensions:** 2752 × 1536 px
**Format:** WebP @ q85, ≤ 2 MB
**Consumed by:** `apps/client/src/pages/BunkroomPage.tsx` (full-screen
backdrop for crew quarters page; renderer falls back to a tinted
placeholder if missing). Composition is purely environmental — no
UI overlay competes with the center.

**Prompt:**

> A long narrow Ark crew-quarters corridor at low-light night cycle,
> 2752×1536, **straight-on perspective looking down the corridor**,
> strong vanishing-point depth, corridor narrowing into the deep
> background. **Twin rows of recessed bunk doors line either side**
> — twin rows of 9 doors each (BR-101 through BR-118 ascending),
> each door with a small illuminated bunk-number stencilled
> directly above it (render the numbers crisp enough that they
> feel like a real shipboard ID system but don't try to make them
> legible from far away). **Lighting**: a single overhead ceiling
> light burns at half-power roughly 1/3 down the corridor from
> camera — warm amber (`#fbbf24` at 40%) — the rest of the
> corridor is lit by recessed soft-cyan emergency strips
> (`#22d3ee` at 50%) running along the baseboards on both sides.
> **Sense of habitation** (not abandoned, just sleeping):
> a folded jacket on a hook outside the second-left bunk; a single
> coffee cup sitting on the corridor floor outside the third-right
> bunk door; a small folded hand-written note taped to a fourth-
> left bunk door (no legible text). **Far end of corridor (deep
> background)**: a sealed pressure door, with a "NIGHT CYCLE:
> SILENCE PROTOCOL" indicator panel above it glowing dim red
> (`#ef4444` at 40%) — render the indicator panel as a glowing
> bar, not as readable text. **Floor**: matte grey decking with
> faint cyan ground-strip glow. No people. Palette: steel-grey
> primary + cyan emergency (`#22d3ee`) + warm-amber half-power
> overhead (`#fbbf24`) + dim red pressure-door indicator
> (`#ef4444`). Dark sci-fi painterly. Film grain. No text. Mood:
> shipboard sleep.

---

### A.8 — Antiquarian archive (low-busy background plate)

**Output file:** `backgrounds/room-archives.webp`
**Dimensions:** 1920 × 1080 px (16:9 hero — note: at the non-canonical
`backgrounds/` prefix, NOT `art/rooms/`. The consumer references this
exact legacy path.)
**Format:** WebP @ q85, ≤ 1.5 MB
**Consumed by:** `apps/client/src/components/act1/TwoWitnessesPart2.tsx`
as a full-page CSS background-image at **60% opacity**. High-contrast
UI overlays sit on top of this asset — design the composition to
work behind text and dialog cards.

**Prompt:**

> A vast Antiquarian archive seen from moderate distance, 1920×1080
> widescreen, wide-angle interior, eye-level perspective. **Designed
> as a low-busy background plate** — visual energy lives in the
> periphery, the visual center is intentionally open so UI overlays
> sit cleanly at 60% asset opacity. **Composition**: vaulted stone
> hall with ceiling arches receding into deep amber haze, strong
> central vanishing point. **Multiple tiers of stone shelves**
> recede into the depth on both sides, packed with leather-bound
> volumes, scroll cases, sealed canopic jars, the occasional
> half-lit reading sconce mounted on the shelf-end. **Middle
> distance**: a long reading table with a single brass desk lamp
> ON, illuminating an open ledger — no one is reading it. **Far
> background**: arches fade into warm amber haze, suggesting the
> hall continues for an impossibly long distance. **Foreground**:
> a faint scatter of dust motes lit by an off-frame amber lamp.
> **Palette**: amber (`#f59e0b`) primary, aged parchment, brass,
> deep temporal-blue (`#3b82f6`) sconce accents in mid-distance.
> No people. No legible text on any visible book or scroll
> (player overlays UI text). Dark sci-fi painterly with
> classical-archive influences. Film grain. Slight warm vignette
> at the edges. Mood: the room has been waiting.

---

## §B — Audio Production (4 — Suno 5.1 / Udio / equivalent)

**Universal style anchor:** the Saga's Album 1 ("Age of Dischordian
Logic") sits at the intersection of Cowboy Bebop's jazz-noir,
Cyberpunk Edgerunners' synth anthems, and dark Americana / Afro
samurai textures. Each track is 3:00–4:30 runtime, MP3 192 kbps
stereo. Lyrics use the Saga's vocal voice: literate, slightly arch,
finds the beat under every line, never overstates.

**Upload target after generation:** `apps/client/public/audio/<path>`
then `pnpm assets:upload`. Or `aws s3 cp` directly with
`--content-type audio/mpeg --cache-control 'public, max-age=31536000, immutable'`.

---

### B.1 — Album 1 T11: "The Empire Reborn"

**Output file:** `audio/album1/T11.mp3`
**Format:** MP3 192 kbps stereo, 3:30–4:00 runtime
**Consumed by:** `apps/shared/dreamerVisions.ts` (Vision 2 cutscene
+ companion slideshow at `art/slideshows/album1/T11/`). Already-shipped
caption lines that the music must support lyrically:
- "she keeps a ledger you cannot read"
- "and her mirror keeps no faces"
- "the cup is wrong"
- "the ledger does not say so"

**Lyrical persona:** Vex Solène, older noblewoman, aristocratic-riddle
delivery. The voice never raises. The track is a quiet menace, not a
loud one.

**Suno 5.1 prompt:**

> **Title:** The Empire Reborn
>
> **Style of Music:** dark sci-fi neo-soul slow burn, female lead
> with aristocratic-riddle delivery, sparse instrumentation —
> minor-key Rhodes piano, distant string ensemble, low brass swell
> at the chorus, brushed snare, upright bass with bow on long notes.
> 4/4 time, 78 BPM. Production reference: D'Angelo's Voodoo album ×
> Cowboy Bebop's "Green Bird" × Cyberpunk Edgerunners "I Really Want
> to Stay at Your House" instrumental bed. Tape-saturated. Reverb on
> the vocal long but not overwhelming. F-sharp minor.
>
> **Lyrics:**
> ```
> [Verse 1 — quiet, half-spoken]
> Build it back / the empire / row by row
> Build it back / the empire / column by column
> Build it back / from the ledger / from the list
> Build it back / from every name we kissed
>
> [Verse 2]
> She keeps a ledger / you cannot read
> Six minds / in six coffins / take a turn at the bleed
> She keeps a mirror / and her mirror keeps no faces
> Only the spaces / where the faces used to be
>
> [Chorus — louder but still controlled]
> The empire reborn / is the empire that learned
> The empire reborn / is the empire that turned
> Every page of you / every page of me
> Into a row / and a row / and a row in a registry
>
> [Verse 3 — almost whispered]
> The cup is wrong / and the noon is wrong
> The chair is yours / but the chair's been yours too long
> Only you are correct / says the audit, says the bill
> The ledger / does not say / so
>
> [Bridge — strings swell, brass enters]
> Row by row / and the row is the choice
> Row by row / and the choice is the voice
> Row by row / and the voice is the page
> Row by row / and the page is the cage
>
> [Final chorus — full ensemble]
> The empire reborn / is the empire that learned
> The empire reborn / is the empire that turned you in
>
> [Outro — solo Rhodes, slow fade]
> She keeps a ledger / you cannot read
> She keeps a ledger / you cannot read
> She keeps a ledger
> [Vocal trails off]
> ```

---

### B.2 — Album 1 T18: "Planet of the Wolf"

**Output file:** `audio/album1/T18.mp3`
**Format:** MP3 192 kbps stereo, 3:30–4:30 runtime
**Consumed by:** `apps/shared/dreamerVisions.ts` + companion slideshow
at `art/slideshows/album1/T18/`. The bucket already has these
slideshow frames so the visual context is locked in — wolf-pack
iconography, Insurgency-faction palette, Iron Lion mythos undertones.

**Lyrical persona:** a pack leader (Iron Lion-adjacent — could be a
sergeant from the Insurgency, could be the Iron Lion himself
addressing his cell). Lower register, controlled growl, choir on the
bridge.

**Suno 5.1 prompt:**

> **Title:** Planet of the Wolf
>
> **Style of Music:** driving post-rock with tribal percussion, male
> lead vocal in lower baritone register with a controlled growl,
> layered choir entering on the bridge. 4/4 time, 120 BPM. Production
> reference: Massive Attack's "Inertia Creeps" × Mad Max: Fury Road
> soundtrack × Nine Inch Nails "The Beginning of the End". Drums:
> live floor tom and tribal hand drums, sparse hi-hat, kick on every
> beat. Bass: distorted, walking. Guitar: muted palm-mute eighth
> notes underneath, building to ringing power chords at chorus.
> D minor, dropped tuning. Atmosphere: dust, distance, fire on the
> horizon.
>
> **Lyrics:**
> ```
> [Verse 1 — low growl, almost spoken]
> Before the map / there was the path
> Before the path / there was the pack
> Before the pack / there was the howl
> Before the howl / there was the wolf
>
> [Verse 2]
> They draw the line / and they call it the law
> We were on this dirt / before they drew
> They draw the flag / and they call it the country
> We were on this dirt / before they flew
>
> [Pre-chorus — building]
> This is the planet
> This is the planet
> This is the planet
>
> [Chorus — full kit, choir layered in for the last line]
> This is the planet of the wolf
> This is the planet of the pack
> This is the planet of the long howl
> This is the planet that doesn't ask
>
> [Verse 3]
> They draw the badge / and they pin it to the chest
> We pin our tattoos / and we move on
> They draw the wage / and they call it the bond
> We bond at the kill / and the kill is the song
>
> [Bridge — choir-led, drums drop to floor tom]
> The planet was here / before the empire
> The planet was here / before the throne
> The planet will be here / when the empire is gone
> The planet will be here / when you walk home
>
> [Final chorus — full intensity, choir doubled]
> This is the planet of the wolf
> This is the planet of the pack
> This is the planet of the long howl
> This is the planet
> Of the wolf
>
> [Outro — single hand drum, fade]
> [Howl] [Howl] [Howl]
> ```

---

### B.3 — Album 1 T23: "Wake Up"

**Output file:** `audio/album1/T23.mp3`
**Format:** MP3 192 kbps stereo, 3:30–4:00 runtime
**Consumed by:** `apps/shared/dreamerVisions.ts`. Album 1's penultimate
track (T23 → T24 "Welcome to Celebration" → T25 "Previews"). The
emotional pivot from Age of Dischordian Logic → Age of Privacy.
Companion slideshow at `art/slideshows/album1/T23/` shows cryo-thaw /
awakening imagery.

**Lyrical persona:** an Ark survivor who has finally accepted the
cryo-wake is permanent. The song is the singer trying to convince
themselves as much as the listener. Half folk confessional, half
declaration.

**Suno 5.1 prompt:**

> **Title:** Wake Up
>
> **Style of Music:** slow-build alternative rock anthem with a
> folk-acoustic intro escalating to full-band climax. Male lead with
> hoarse, urgent delivery — voice is a tool, not a performance. 4/4
> time, 88 BPM with half-time feel on the verses. Production
> reference: Bon Iver's "Holocene" intro → Mumford & Sons' "Awake My
> Soul" build → Arcade Fire "Wake Up" full-band climax. Intro:
> fingerpicked acoustic, single voice, no reverb. Builds: kick drum
> enters at verse 2, full drum kit at chorus, electric guitar power
> chords at bridge, gang-vocal "WAKE UP" stomps at final chorus.
> E major (bright key for the awakening). Tape-warm production.
>
> **Lyrics:**
> ```
> [Verse 1 — fingerpicked acoustic, single voice]
> I went to sleep / on a planet
> I woke up / on a ship
> I went to sleep / in a name
> I woke up / on this lip
> Of the long dark / and the longer light
> And the dream / is not the dream tonight
>
> [Verse 2 — kick drum enters on the 2 and 4]
> They said: the dream / is the gentlest cage
> They said: the dream / is the safest page
> But I read the page / and the page read me
> And the cage / was the page / of the dreamery
>
> [Pre-chorus — band starts to lift]
> Wake up / wake up
> The dream is the trap
> Wake up / wake up
> The trap is the trap
>
> [Chorus — full kit, electric guitar power chords]
> Wake up / the dream is the trap
> Wake up / the trap is the map
> Wake up / the map is the lie
> Wake up / and watch the lie die
>
> [Verse 3 — kit drops back, acoustic returns briefly]
> I went to sleep / a citizen
> I woke up / a survivor
> I went to sleep / a passenger
> I woke up / the driver
>
> [Bridge — gang vocals, full intensity, half-step modulation]
> Wake up / wake up
> The dawn is the answer
> Wake up / wake up
> The answer is the dancer
> Wake up / wake up
> The dancer is the dawn
> Wake up / wake up
> The dawn is going on
>
> [Final chorus — gang vocals "WAKE UP" stomps on each line]
> WAKE UP / the dream is the trap
> WAKE UP / the trap is the map
> WAKE UP / the map is the lie
> WAKE UP / the lie is dying
>
> [Outro — single acoustic guitar, voice]
> I went to sleep / on a planet
> I woke up / on a ship
> I'm awake / now
> ```

---

### B.4 — Welcome to Celebration (extract-fallback)

**Output file:** `audio/music/celebration/welcome-to-celebration.mp3`
**Format:** MP3 192 kbps stereo, 3:00–4:00 runtime
**Consumed by:** `apps/client/src/data/celebrationSlideshow.ts`

**First try extraction (preferred)**: `s3://dgrsart/Videos/Welcome to
Celebration & Mechronis.zip` contains the source audio. The album-version
audio at `audio/album1/T24.mp3` does NOT exist on the bucket
(verified via HEAD). Extract from the zip via §0 ops above.

**Suno 5.1 prompt (fallback if zip extraction fails):**

> **Title:** Welcome to Celebration
>
> **Style of Music:** funk-influenced upbeat anthem with full brass
> section, female lead with gospel-tinged warmth, hand-claps on the
> 2 and 4, tight rhythm section, Hammond B3 organ comping under the
> chorus. 4/4 time, 108 BPM. Production reference: Parliament-
> Funkadelic's "Give Up the Funk" × Cowboy Bebop's "Tank!" (brass
> energy) × Aretha Franklin's "Spanish Harlem" (vocal warmth).
> Drums: tight pocket, slapped snare, ride on the bridge. Bass:
> slap funk, walking lines. Brass section: 3-piece (trumpet,
> tenor sax, trombone) with stabs on the off-beats. G major,
> bright. Hand claps mixed forward.
>
> **Lyrics:**
> ```
> [Intro — brass fanfare, 8 bars]
> [Brass]
>
> [Verse 1 — full band]
> Welcome to Celebration / friend
> Welcome to the simulation / that pretends
> Welcome to the park / where the smiles are real
> Welcome to the year / you don't have to feel
>
> [Verse 2]
> Welcome to the booth / where the prizes never end
> Welcome to the line / where the line is the friend
> Welcome to the gate / where the gate is the joy
> Welcome to the toy / that is also the boy
>
> [Chorus — full ensemble, claps on 2 and 4]
> Welcome to Celebration / leave your year at the door
> Welcome to Celebration / we won't ask what it's for
> Welcome to Celebration / there's a chair with your name
> Welcome to Celebration / and the chair is the game
>
> [Verse 3 — slightly more melancholy lift]
> Welcome to the dance / where the dancers are paid
> Welcome to the song / that the parade has played
> Welcome to the smile / that was rented by the day
> Welcome to the wave / that the wave has to pay
>
> [Bridge — Hammond solo, brass swell, full band drops to claps]
> Celebration / Celebration
> Celebration / Celebration
> Don't ask what we celebrate / don't ask what we ate
> Don't ask why the gate is closed / the gate is the gate
>
> [Final chorus — gospel-style ad-libs over the top]
> Welcome to Celebration / leave your year at the door
> Welcome to Celebration / we won't ask what it's for
> [Ad-libs] "Won't ask what it's for, friend"
> Welcome to Celebration / there's a chair with your name
> Welcome to Celebration / and the chair is the game
> [Ad-libs] "The chair is the game, friend, the chair is the game"
>
> [Outro — brass fanfare reprise, hand claps fade]
> ```

---

## §C — Audio extraction operations (1 — Last Words full)

`s3://dgrsart/AAA Final/last_words_only.zip` (21 MB) likely contains
the full-length version of "Last Words (Prelude)". Two shorter
cuts are already on the public CDN:
- `audio/music/song_last_words_prelude_cut.mp3` (4.66 MB)
- `audio/music/song_last_words_prelude_tease.mp3` (716 KB, ~30s)

The audit's missing path is the **full** version
(`song_last_words_prelude_full.mp3`).

```bash
mkdir -p /tmp/last-words
aws s3 cp "s3://dgrsart/AAA Final/last_words_only.zip" /tmp/last-words/
cd /tmp/last-words
unzip -o last_words_only.zip
# Inspect contents — find the longest .mp3 / .wav. The album-master
# version is typically 3-5 MB at 192kbps.
ls -lS *.mp3 *.wav 2>/dev/null | head
# Identify the full-length stem (compare durations to the existing
# `_cut` and `_tease` versions to confirm which is the "full"):
ffprobe -v error -show_entries format=duration -of csv=p=0 <candidate>.mp3
# Then upload:
aws s3 cp <FULL_MP3> \
  s3://dgrsart/cdn/client-public/audio/music/song_last_words_prelude_full.mp3 \
  --content-type audio/mpeg \
  --cache-control 'public, max-age=31536000, immutable'
```

**Suno fallback if extraction fails:**

> **Title:** Last Words (Prelude — full version)
>
> **Style of Music:** cinematic ballad — male lead with desperate
> clarity (testifying, not performing). Sparse piano + string
> quartet intro, full orchestral swell on the second chorus,
> returns to solo piano for the outro. 4/4 time, 72 BPM.
> Production reference: Cowboy Bebop's "The Real Folk Blues" ×
> Final Fantasy main theme × Sufjan Stevens' "Death With Dignity"
> orchestration. C minor, modulating to E-flat major at the
> bridge. Runtime target: 3:30–4:00. The two existing shorter
> cuts (`_cut.mp3` at ~4:38, `_tease.mp3` at ~30s) should be
> referenced for melodic continuity — this full version is the
> same song extended with a second bridge and a longer outro.
>
> **Lyrics:**
> ```
> [Verse 1 — solo piano, voice]
> If you hear this / you outlived me
> If you hear this / the room is empty
> If you hear this / the door is closed
> If you hear this / then someone chose
>
> [Verse 2]
> I will not / waste your time
> I will not / explain the line
> I will not / beg the page
> I will not / age in the cage
>
> [Chorus — strings enter]
> These are the last words / I am offering
> These are the last words / I am authoring
> Not the last words / they will record
> But the last words / I afford
>
> [Verse 3 — strings swell]
> The verdict / does not need me
> The verdict / does not need this song
> The verdict / will be wrong
> The verdict / will be long
>
> [Bridge — full orchestra, modulation]
> If the courtroom is loud / she will speak
> If the courtroom is quiet / she will listen
> I am loud now / and the listening is meek
> I am loud now / and the verdict is risen
>
> [Final chorus — full orchestra, vocal at climax]
> These are the last words / I am offering
> These are the last words / I am authoring
> Not the last words / they will record
> But the last words / I afford
> But the last words / I afford
>
> [Outro — solo piano, vocal whisper]
> If you hear this / you outlived me
> If you hear this
> If you hear this
> [Piano resolves, fade]
> ```

---

## §D — Upload + verify after delivery

Once renders / recordings / extracts are in hand, drop into the
in-repo public tree at:

```
apps/client/public/art/card-game/card-back-seer.png
apps/client/public/art/portraits/master_faces/elara.png        (if produced)
apps/client/public/art/rooms/room-comms-relay.png
apps/client/public/art/rooms/room-dreams-workshop-subbasement.webp
apps/client/public/art/rooms/room-engineers-bench.png
apps/client/public/art/rooms/room-game-masters-arena.png
apps/client/public/art/ship/bunkroom_corridor.webp
apps/client/public/backgrounds/room-archives.webp
apps/client/public/audio/album1/T11.mp3
apps/client/public/audio/album1/T18.mp3
apps/client/public/audio/album1/T23.mp3
apps/client/public/audio/music/celebration/welcome-to-celebration.mp3
apps/client/public/audio/music/song_last_words_prelude_full.mp3
```

Then publish:

```bash
pnpm assets:upload:dry      # preview the diff
pnpm assets:upload          # actual upload with idempotent ETag compare
```

The upload script (`apps/scripts/upload-public-to-s3.ts`) PUTs to
`s3://dgrsart/cdn/client-public/` with the canonical headers
(`Cache-Control: public, max-age=31536000, immutable` + SSE-AES256).

Or for ad-hoc single uploads:

```bash
aws s3 cp <local-path> s3://dgrsart/cdn/client-public/<remote-path> \
  --content-type <image/png|image/webp|audio/mpeg> \
  --cache-control 'public, max-age=31536000, immutable'
```

After uploads, verify the audit gap closes:

```bash
bash docs/production/audit/extract-urls.sh
bash docs/production/audit/probe-cdn.sh
awk -F'\t' '$2 ~ /dgrsart/ && $1 == "403"' \
  docs/production/audit/cdn-liveness.tsv | wc -l
# Expect: ~41 (all base-URL false positives — the audit is complete)
```

For the 3 server-side copies in §0 (no local file involved), run the
`aws s3 cp` commands directly and re-probe immediately — the copies
complete in under a second per file.

---

## Final tally

| Block | Items | Action |
|---|---:|---|
| §0 quick-fix copies | 2 | `aws s3 cp` from album1 master (T07, T02) |
| §0 quick-fix extracts | 2 | Unzip producer-side zips on bucket |
| §A new images | 6 | Nano Banana / Imagen / Midjourney / SDXL |
| §A optional image | 1 | `master_faces/elara.png` — only if keeping the test |
| §B new audio | 3 | Suno 5.1 / Udio (T11, T18, T23) |
| §B extract-or-record audio | 1 | Welcome to Celebration |
| §C extract audio | 1 | Last Words (full) from AAA Final/last_words_only.zip |

**Total: 13 actions, 9 of which require fresh production (6 images +
3 audio); the other 4 are bucket-internal copies / extractions.**

Following the production runbook above closes the art audit to its
floor (~41 runtime-composed false positives, no real misses).
