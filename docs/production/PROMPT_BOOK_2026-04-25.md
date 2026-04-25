# Prompt Book — Final, Audited (Non-VO) — 2026-04-25

> **Dispatch-ready prompt book** for every asset confirmed not-live
> AND not-VO AND not dead-code AND actionable. Each entry has a
> fully-instantiated prompt — no `{PROF}` placeholders, no "see the
> bible" punts. Authoritative source for "what's missing": the
> 2026-04-25 audit at `docs/production/ART_AUDIT_VERIFIED_2026-04-25.md`
> + post-upload re-probe (`scan-path-mismatches.sh` returns 0).
>
> Excluded:
> - **VO** (8 empty `*VoManifest.json` + 24 filled-but-private-bucket).
>   See audit doc §5; ElevenLabs dispatch from `docs/scripts/`.
> - **Legacy CloudFront** (1,727 dead URLs at `d2xsxph8kpxj0f...`).
>   Pending user investigate-before-deciding.
> - **Dead-code registry exports** in PR #180
>   (`PRELUDE_VFX_SOURCE_MP4S`, `PRELUDE_AMBIENT_BEDS_DELIVERED`)
>   — exported but no consumer.
> - **Pipeline conversions** (PNG→WebP, MP4→WebM alpha, WAV→MP3
>   loudnorm) — separate ffmpeg-only follow-up; covered in §11.

## Index

1. **Mechronis Academy classrooms** — 12 NB2 prompts
2. **Mechronis Houses common rooms + ambient** — 4 NB2 + 4 Suno
3. **Mechronis Classmates portraits** — 8 NB2 prompts
4. **Outer Groove album** — 10 Suno + 1 NB2 cover
5. **Celebration Park ambient** — 4 Suno
6. **Specimen fragment portraits** — 6 NB2
7. **Acts 4-7 spine cinematics** — 6 cinematics × 5 assets each = 30
8. **Page-background images** — 10 NB2
9. **Loredex Discovery videos** — 8 Kling
10. **TCG card tier-up art** — 221 (linked, not inlined)
11. **Pipeline conversions** — zero-cost ffmpeg

Each entry below uses this shape:

```
### <asset_id>
- Output: <CDN target path>
- Tool: NB2 / Veo 3.1 / Suno / Kling / ffmpeg
- Format: <dimensions/encoding>
- Priority: P0 / P1 / P2

[verbatim prompt]
```

After all uploads from this book run, the post-upload audit
should show **>95% live** across the dgrsart bucket.

---

## §1 — Mechronis Academy Classrooms (12)

**Source**: `apps/client/src/pages/MechronisAcademyPage.tsx:60-71`
hardcodes 12 paths. **Tool**: Nano Banana 2 · **Format**: 1920×1080
JPG (no characters in frame). **Priority**: P1.

### Shared style guide (apply to every classroom)

> Wide-angle classroom photographed at student-eye level just
> before class begins. Empty of human figures. Mechronis Academy
> aesthetic: deep teal-green walls with brass-and-bone trim,
> holographic ash haze drifting near the high ceiling, mahogany
> lecturer's desk at front, two raked tiers of student desks
> facing it, one warm amber pendant lamp + cool teal ambient from
> tall windows, soft volumetric atmosphere. The brightest pixel
> sits on a rule-of-thirds intersection, NOT center (UI panels
> overlay center). Match the existing live `art/mechronis/*` and
> `art/celebration/*` palette. **No characters. No readable text
> on chalkboards (suggest with shape only). No modern Earth-tech
> logos. No anime/cel-shaded styling.**

### 1.1 classroom-kanevas.jpg — Headmaster Kanevas (Choric Compliance & Unison Logic, RES-101)

```
Mechronis Academy classroom. Headmaster Kanevas teaches Choric
Compliance & Unison Logic — every answer must be given in unison
or not at all. The room reflects the lesson: thirty desks
arranged in three concentric semicircles facing a single
lecturer's lectern that resembles an empty conductor's podium.
Lit chalk-trace marks on the slate wall behind the lectern
suggest the same word repeated thirty times in identical
handwriting — the ghost of yesterday's harmony drill. Brass
pitchpipes hang in racks along one wall. A single tuning fork
rests on the lectern, struck but no longer ringing. Quiet,
expectant, "the choir is about to inhale" mood. Apply the
Mechronis style guide above.
```

### 1.2 classroom-aoki.jpg — Professor Aoki (Applied Surveillance Theory, UMB-204)

```
Mechronis Academy classroom. Professor Aoki teaches Applied
Surveillance Theory — never break eye contact, never blink first.
The room is arranged in observation triangles: every desk is set
so three students always watch a fourth, with sight-lines
geometrically unbroken. The back wall is a polished one-way
mirror that hints at observers in the next room. A small pyramid
of black camera-domes sits on the lecturer's desk. The chalkboard
is replaced with a wall of slate panels, each pre-marked with a
single open eye glyph in chalk. Surgical white light from
overhead, no shadows under the desks. Cool, clinical,
"someone is already watching" mood. Apply the Mechronis style
guide above.
```

### 1.3 classroom-halverez.jpg — Curator Halverez (Pedagogy of the Trade, UMB-311)

```
Mechronis Academy classroom shaped like an archive vault.
Curator Halverez teaches Pedagogy of the Trade — every question
costs a memory of a prior answer; choose your questions. Tall
wooden shelves line three walls, each shelf cataloging
xenomorph-sealed lecture artifacts in numbered glass jars (the
contents are abstract — chalk dust, folded paper, a single tooth).
The lecturer's desk has a small brass scale at the center, one
pan empty, one pan holding a single sheet of paper marked with
chalk. Student desks each have a locked drawer with a brass key
hanging from a slim chain. Warm amber light from desk lamps,
deep shadows in the shelves. Solemn, transactional, "every word
costs something" mood. Apply the Mechronis style guide above.
```

### 1.4 classroom-orphic.jpg — Professor Orphic (Liminal Physics & Door-Choosing, LIM-202)

```
Mechronis Academy classroom that doesn't quite stay still.
Professor Orphic teaches Liminal Physics & Door-Choosing — the
classroom door changes location each session; find it. Walls
are paneled in seven identical doors, six of them closed, one
slightly ajar with cool light spilling under the threshold.
Student desks face slightly different directions — no two
oriented the same. The lecturer's desk has a chalk-drawn floor
plan on it that doesn't match the room you can see. Perspective
lines in the architecture subtly disagree with each other (the
ceiling tiles converge to a different vanishing point than the
floor). Holographic ash haze is denser here, almost forming
shapes. Disorienting, anticipatory, "the room hasn't decided
where it is yet" mood. Apply the Mechronis style guide above.
```

### 1.5 classroom-mireille.jpg — Professor Mireille (Memetics 301 — Belief Engineering, RES-301)

```
Mechronis Academy classroom that feels more like a salon. Professor
Mireille teaches Memetics 301 — Belief Engineering, where whoever
speaks loudest and prettiest is grading you today. Tall windows
along one wall flooded with rose-gold light. Plush velvet seats
arranged in a horseshoe — no traditional desks, just lap-tablets
on red leather. The lecturer's plinth is a small raised stage
with a brass standing mic and an empty wineglass beside it. The
back wall is covered in framed posters of vanished campaigns —
slogans in elegant typography, content abstract enough to be
unreadable. A bowl of fresh cut flowers on the desk. Warm,
glamorous, "rumor garden in bloom" mood. Apply the Mechronis
style guide above.
```

### 1.6 classroom-kasra.jpg — General Kasra (Applied Casualty Arithmetic, IRN-215)

```
Mechronis Academy classroom converted from a tactical operations
room. General Kasra teaches Applied Casualty Arithmetic —
students paired for the semester; if one fails, both fail.
Student desks arranged in pairs only, never solo. A horizontal
campaign map fills the lecturer's table, with brass tokens
representing forces; some tokens are tipped over. The back wall
holds a chalkboard with three columns hand-marked
"Acceptable / Wasteful / Instructive" but with no values yet
written. A yellow military coat hangs on a hook behind the
lectern. Tactical visors stacked on a small side table.
Stripped overhead bulbs, harder shadows than the other classrooms.
Disciplined, calculating, "the math is honest" mood. Apply the
Mechronis style guide above.
```

### 1.7 classroom-vellis.jpg — Senator Vellis (Promise Engineering & Leverage Studies, RES-240)

```
Mechronis Academy classroom shaped like a senate committee room.
Senator Vellis teaches Promise Engineering & Leverage Studies —
every lecture begins with a promise you make; it is recorded;
it is enforced. Curved tiered seating in dark wood with brass
inlay nameplates on each desk (names not visible). The lecturer's
podium has a sleek modern microphone alongside a vintage stamp-
and-wax-seal kit. The back wall holds a dark wood plaque with
forty crossed-quill carvings (the gold pin's full set). A single
chair at the front of the room faces the audience — the
"witness chair." Warm tungsten lighting, polished surfaces.
Formal, transactional, "the deal is already underway" mood.
Apply the Mechronis style guide above.
```

### 1.8 classroom-greenshaw.jpg — Warden Greenshaw (Practical Containment & the Thought-Virus Drill, UMB-402)

```
Mechronis Academy classroom that converts into a holding cell.
Warden Greenshaw teaches Practical Containment & the
Thought-Virus Drill — students who break rules are locked in the
Small Room until they explain why. Conventional student desks
fill the front, but the back wall has a door labeled in brass
relief THE SMALL ROOM (door slightly ajar, cool light from
within). A tan-and-black trench coat hangs on a hook by the
lectern. A key-ring of forty-two keys lies coiled on the desk
beside a thick leather logbook. Walls reinforced with vertical
brass strapping. Overhead strip lighting cool-white, harsh.
Vigilant, contained, "the threat is already in here" mood.
Apply the Mechronis style guide above.
```

### 1.9 classroom-vex.jpg — Professor Vex (Rules, Exceptions & the Meta-Game, LIM-318)

```
Mechronis Academy classroom that looks half-game-room.
Professor Vex teaches Rules, Exceptions & the Meta-Game — rules
change each session; students who notice the change first grade
the others. Student desks are deliberately mismatched — some
chairs swiveled the wrong way, one desk on a small platform,
one desk with no chair. A tall pegboard at the back holds dozens
of handwritten rule-cards on push pins, several with red lines
struck through. The lecturer's desk has a Go board mid-game with
red steampunk goggles resting on top. Blue trenchcoat hung
casually over the chair. Warm bias lights flickering slightly,
suggesting motion. Playful, sharp-edged, "someone is rewriting
the rules behind your back" mood. Apply the Mechronis style guide
above.
```

### 1.10 classroom-vasara.jpg — Dr. Vasara (Endurance Medicine & Resurrection Draft, IRN-356)

```
Mechronis Academy classroom that doubles as a medical theater.
Dr. Vasara teaches Endurance Medicine & Resurrection Draft —
students who die in practicals come back; something may come back
with them. Student desks arranged in a U around a central
practical table covered in red surgical cloth. Glass cabinets
along the walls display vials of dark fluid and folded shrouds.
A red-and-black academic robe hangs by the lectern; red lenses
glint on the desk beside an open ledger marked with rows of names
and dates. Walls are deeper black than the other classrooms,
with red sconce-lights at irregular heights. Hushed, ritual,
"death negotiates here" mood. Apply the Mechronis style guide
above.
```

### 1.11 classroom-vent.jpg — Artificer Vent (Forge Studies & Impossible Machines, IRN-270)

```
Mechronis Academy classroom that's also a workshop. Artificer
Vent teaches Forge Studies & Impossible Machines — students who
break a tool replace it with something better. A row of brass-
fitted workbenches replaces standard desks, each with a small
vise, a soldering rig, and a single half-disassembled
contraption. The lecturer's "desk" is a heavy anvil on a
mahogany base. A wall of cubbies holds tools cataloged by
function, several cubbies empty (recently broken, awaiting
replacement). A red steampunk trench coat hangs on a hook,
smudged with oil. Warm forge-glow from a banked furnace at the
back, cooler ambient teal from above. Industrious, alive,
"something is being made right now" mood. Apply the Mechronis
style guide above.
```

### 1.12 classroom-proctor.jpg — The Proctor (The One Question — Independent Inquiry, LIM-499)

```
Mechronis Academy classroom that's almost a reading room. The
Proctor teaches The One Question — there are no rules; there are
also no exceptions. Only twelve student desks, widely spaced,
each with a single sheet of blank paper and a sharpened pencil.
The lecturer's desk holds nothing — no books, no notes, no
electronics. The back wall is a single uninterrupted blackboard
left entirely empty. A well-worn coat hangs on a hook by the
door (no robe). One window left slightly open, soft daylight
falling on the dust. Quiet, patient, "the question has not been
asked yet" mood. Apply the Mechronis style guide above.
```

---

## §2 — Mechronis Houses (4 common rooms + 4 ambient)

**Source**: `apps/shared/mechronisHouses.ts:61-149`. **Tools**: NB2
(art) + Suno (audio). **Format**: 1920×1080 JPG art; ~3 min mp3
loops at -23 LUFS. **Priority**: P1.

### 2.1 resonance.jpg — House Resonance ("The Choirboys")

> Domain: Orchestration, persuasion, soft-power choreography.
> Sigil: a tuning fork crossed with an open mouth. Colors: warm
> brass (#C59A3F) + cream (#F4E4B8).

```
House Resonance common room — a tiered amphitheatre with no
proscenium. Every seat is a fixed brass prompter desk angled
toward the centre, where a low circular dais sits empty.
Acoustic-tuned wood paneling lines the walls; brass tuning forks
of escalating size hang in a vertical row up one column. A faint
visible standing-wave pattern shimmers in dust motes when the
House is winning the Cup. The hearth at the back has a brass
plaque engraved with the motto "One voice. One verdict. One
vote." Warm brass-gold lamp glow, cream highlights, deep
cream-tinted shadows. No characters in frame. 1920×1080 JPG,
photorealistic concept art matching the existing live
`art/mechronis/*` palette.
```

### 2.2 umbra.jpg — House Umbra ("The Watchers")

> Domain: Surveillance, archive-keeping, counterintelligence.
> Sigil: an unblinking eye inside a keyhole. Colors: overcast
> slate (#3A4A5E) + cool grey (#A8B4C2).

```
House Umbra common room — a low-ceilinged reading room lit
exclusively by green-shaded brass desk lamps. Tall bookcases
along three walls; on closer look the back panels of each
bookcase are silvered glass (two-way mirrors). The hearth is
present but dark — no fire, no smoke. Reading cushions on the
floor and in window-nooks each carry the gentle depression of a
person who was just sitting there but isn't anymore. A single
ledger lies open on a side-table, its facing page perfectly blank.
Cool slate walls, deep grey-green ambient, occasional bottle-green
highlight from the lamps. No characters in frame. 1920×1080 JPG.
```

### 2.3 ironflight.jpg — House Ironflight ("The Pyrelings")

> Domain: Warfare, craft, resurrection-grade endurance. Sigil:
> a winged anvil with a grave engraved beneath it. Colors: forge
> red (#B83232) + amber-yellow (#F4B13A).

```
House Ironflight common room — a long hall with a working forge
glowing at one end and a quiet wake-room at the other. The forge
glows red-orange, anvil mid-strike (no smith). At the far end:
a low table with a folded ironflight sigil cloth and a single
unlit candle. Along one wall, a sword rack doubles as a memorial:
brass nameplates inset between each blade. Long mahogany dining
table down the centre with mismatched chairs (each chair belonged
to someone). Whetstones stacked discreetly under the rack —
they were carried back from students who didn't return. Warm forge
red + amber bias on one side, cooler tungsten on the other,
dramatic chiaroscuro between forge and wake. No characters in
frame. 1920×1080 JPG.
```

### 2.4 liminal.jpg — House Liminal ("The Threshold Kids")

> Domain: Mystery, rule-exploitation, dimensional cartography.
> Sigil: a seven-door compass with no needle. Colors: dusk
> violet (#6B4EA8) + lavender (#C9A8E0).

```
House Liminal common room — a sitting room that doesn't quite
hold still. Mismatched armchairs arranged in a loose ring; the
arrangement is subtly different in different parts of the frame
(a chair in the foreground reads as facing the hearth, but in
the mirror-reflection over the mantel it faces the door). The
hearth rug is patchwork — every square is a different scarf
texture (lost-property collection, never returned). Above the
mantel: a brass plaque engraved with a number — make it "47" —
and a small chalkboard beside it where last morning's number
("43") has been only half-erased. Tall doorframe at the back
with a brass house-number "47" matching. Soft dusk-violet
ambient, lavender highlights, slight chromatic aberration on the
edges of objects suggesting the room is half a step out of
phase. No characters in frame. 1920×1080 JPG.
```

### 2.5 resonance.mp3 — House Resonance ambient (Suno)

```
Suno prompt:
"Soft 432 Hz brass-tuning-fork drone over a slow heartbeat-pulse
drum (one beat every 4 seconds). Distant vocal choir holding
single sustained vowels — no lyrics, no melody resolving. A
single tuning fork strike every 30-45 seconds. Subtle wood-panel
room tone underneath. 3 minutes seamless loop. Mood: scholarly,
attentive, ready to think, slightly conspiratorial. Major key,
no resolution. -23 LUFS."
```

### 2.6 umbra.mp3 — House Umbra ambient (Suno)

```
Suno prompt:
"Low room-tone drone in a velvet-lined library. Faint hiss of an
unmoving candle (impossible — but present). One distant
grandfather clock ticking quietly, irregular by half a second.
Occasional very-soft page-turn and the brush of a wool sleeve.
No music, no melody, no chords. 3 minutes seamless loop. Mood:
hushed, contemplative, secretive, listening-to-you-listen.
-23 LUFS."
```

### 2.7 ironflight.mp3 — House Ironflight ambient (Suno)

```
Suno prompt:
"Working-forge ambient — slow rhythmic anvil strike (one strike
every 6-8 seconds, never on a regular meter), low fire crackle,
distant bellows working on the same irregular pulse. A faint
distant choir of low male voices humming a wake hymn (no lyrics,
just the sustained tones). Occasional whetstone-on-blade rasp.
3 minutes seamless loop. Mood: hot work that knows it will end
in cold work; warriors mourning while still fighting. Minor
key, dorian mode. -23 LUFS."
```

### 2.8 liminal.mp3 — House Liminal ambient (Suno)

```
Suno prompt:
"Three slightly out-of-phase grandfather clocks ticking at
86/88/90 BPM (intentionally never aligning). A draft moves
through a door that hasn't opened. Distant water dripping in
an irregular rhythm with one drop every 11-13 seconds. A book
slides itself off a shelf once during the loop, lands softly on
carpet (use a single muted thud). 3 minutes seamless loop.
Mood: unsettled, between-states, dreamlike, the room is paying
attention. No drums, no melody. -23 LUFS."
```

---

## §3 — Mechronis Classmates (8 portraits)

**Source**: `apps/shared/mechronisClassmates.ts:50-159`. **Tool**:
Nano Banana 2. **Format**: 1024×1024 PNG transparent background.
**Priority**: P2.

### Shared style guide

> Three-quarter shoulder-up bust portrait, photorealistic painted
> style. Lit from above-right by a warm amber pendant lamp, cool
> teal ambient fill from screen-left. Subject wears the Mechronis
> Academy uniform: dark teal blazer with House-specific trim
> color, white collared shirt, brass collar pin in their House
> sigil. **No UI overlays. No text. No anime/cel-shading. No
> harsh contour lines. No extra characters in frame.** Background:
> transparent PNG, no environment.

### 3.1 aria-wen.png — House Resonance, prodigy

> Trim color: warm brass (#C59A3F). Sigil pin: tuning fork
> crossed with an open mouth.

```
Three-quarter portrait of Aria Wen, first-chair soprano in
Headmaster Kanevas's class — Mechronis Academy student, House
Resonance. Aria is a young woman with rigid composure, dark hair
pulled back into a tight low bun, posture erect as a tuning fork.
Her expression is poised mid-bow — head slightly inclined, eyes
calmly meeting the viewer's, faintest smile that's technically
correct and completely empty. She has just finished singing
someone else's part. Her uniform's brass trim catches the light;
the tuning-fork-and-mouth pin sits exactly centred on her lapel.
Apply the §3 style guide above.
```

### 3.2 benik-holt.png — House Resonance, friend

> Trim color: warm brass (#C59A3F).

```
Three-quarter portrait of Benik Holt — Mechronis Academy student,
House Resonance. Benik is a young man with a kind, slightly
worried face. Soft brown hair, sympathetic eyes that look
slightly off to the right (avoiding the viewer's direct gaze
because the harmony drill is approaching). His mouth is parted
as if just before speaking — he is about to say "we start
together, yeah?" and the syllable hasn't quite landed. His
uniform's brass trim is a touch crooked; he hasn't fixed it.
The tuning-fork-and-mouth pin is plainly there. Apply the §3
style guide above.
```

### 3.3 tess-corvia.png — House Umbra, rival

> Trim color: overcast slate (#3A4A5E). Sigil pin: unblinking eye
> inside a keyhole.

```
Three-quarter portrait of Tess Corvia, Aoki's star pupil —
Mechronis Academy student, House Umbra. Tess is a young woman
with sharp, precise features, dark short-cropped hair, eyes
locked directly on the viewer — she has already counted how many
times you blinked. A small leather-bound notebook is held
half-visible at her shoulder, pencil between her fingers, the
visible page covered in a private cipher of her own invention.
Her House Umbra slate-grey trim is impeccably ironed. The
eye-in-keyhole pin glints at her lapel. Apply the §3 style guide
above.
```

### 3.4 ollen-mire.png — House Umbra, ghost

> Trim color: overcast slate (#3A4A5E). **Subject is missing —
> see prompt.**

```
Three-quarter portrait composition of an empty Mechronis Academy
student desk and chair — House Umbra, third-row position. The
chair is angled as if recently occupied. A single textbook sits
open on the desk, page partly turned. A House Umbra slate-grey
blazer is folded over the back of the chair as if its owner
stepped out for a moment. The eye-in-keyhole brass pin is on the
blazer collar. The seat has a gentle depression. There is no
person in frame — that IS the portrait. The composition is
framed exactly as the other classmate portraits would be (where
the head/shoulders would normally appear, there is empty air
with soft cool ambient teal fill). Apply the §3 style guide above
(adapted: no figure).
```

### 3.5 mara-thorne.png — House Ironflight, bully (and resurrection survivor)

> Trim color: forge red (#B83232). Sigil pin: winged anvil with
> grave engraved beneath.

```
Three-quarter portrait of Mara Thorne, third-semester repeat —
Mechronis Academy student, House Ironflight, two years and a war
older than her year-mates. Mara has weathered features, jaw set,
short dark hair scraped back, a faint thin scar tracking from
under her left ear toward her collarbone. Her stare is direct
and uninterested. She has just shoulder-checked someone in the
forge ("it teaches heat") and is not sorry. Her uniform's
forge-red trim is scuffed at the edges from honest wear. The
winged-anvil pin is there but slightly tilted. Subtle: a second,
fainter shadow falls behind her head at a slightly wrong angle —
the thing that came back from her failed Resurrection Draft is
reading over her shoulder. Do not draw the second shadow as
literal; suggest it through a soft secondary penumbra only.
Apply the §3 style guide above.
```

### 3.6 ozen-kade.png — House Ironflight, crush (engineer-track)

> Trim color: forge red (#B83232).

```
Three-quarter portrait of Ozen Kade — Mechronis Academy student,
House Ironflight, engineer-track. Ozen is a wiry young person of
ambiguous gender presentation, mid-laugh — head tilted back
slightly, eyes crinkled, mouth open in a real laugh that uses
their whole face. They have a smudge of forge oil on their
collar that they haven't noticed. Short dark wavy hair, a single
copper-coloured streak at one temple. Their uniform's forge-red
trim is worn comfortably; the winged-anvil pin sits at a casual
angle. Apply the §3 style guide above.
```

### 3.7 juno-reeve.png — House Liminal, rulekeeper

> Trim color: dusk violet (#6B4EA8). Sigil pin: seven-door compass
> with no needle.

```
Three-quarter portrait of Juno Reeve — Mechronis Academy student,
House Liminal. Juno is a precise young person with neatly parted
auburn hair, round wire-rimmed glasses pushed slightly down their
nose, mid-correction (one eyebrow raised, finger lifted as if
about to say "page forty-one, footnote eight"). They hold a
slim, well-thumbed Academy bylaws book at their hip with a finger
marking a specific page. House Liminal violet trim is
immaculate; the seven-door compass pin sits perfectly centred.
Apply the §3 style guide above.
```

### 3.8 vessa-lark.png — House Liminal, fugitive

> Trim color: dusk violet (#6B4EA8). **Subject mid-vanish — see
> prompt.**

```
Three-quarter portrait of Vessa Lark — Mechronis Academy student,
House Liminal. Vessa is a young woman with a sly, knowing smile
and bright eyes that are looking past the viewer toward something
the viewer can't see. Dark wavy hair half-loose. Mid-pose: she's
caught half-turned, one shoulder back as if the next motion will
be toward an exit. The half of her body closer to the viewer is
fully solid; the half farther away (the receding shoulder + arm)
fades into a soft volumetric haze that wasn't there a moment ago.
Effect should read as "she's already half-through Orphic's
seventh door." Her uniform's violet trim is correct, the
seven-door compass pin sits askew (she's been running). Apply the
§3 style guide above (adapted: half-vanish effect on receding
shoulder).
```

---

## §4 — Outer Groove album (10 tracks + cover)

**Source**: `apps/shared/tcg-core/audio/outergroove.ts`. **Tools**:
Suno (10 tracks) + Nano Banana 2 (cover). **Format**: MP3,
target durations as specified per track, -23 LUFS. **Priority**: P2.

### Album-level direction (apply to every track)

> Channel: **OUTERGROOVE** — the Programmer's first channel.
> Space-opera funk recorded in his early Panopticon studio era
> (before the Panopticon became what it became). Slap bass,
> clavinet wah, Linn LM-1 drums. Each instrumental is a backing
> bed for a spoken-word Engineer's Log voice-over — leave room
> in the mid-range for VO. Avoid lead vocals; processed wordless
> choirs OK. Produce as **clean instrumental loops** that can
> seamlessly continue under voice-over swap-ins.

### 4.1 og_001.mp3 — "Celebration Rain"

- Output: `audio/outergroove/og_001.mp3`
- Tempo: 92 BPM · Key: F minor · Duration: 100 s
- Pairs with: `log_keyword_provoke`
- Mood tags: cathedral-funk, slow, shoulder-roll, lecture-friendly

```
Suno prompt:
"Slow 92 BPM cathedral-funk instrumental in F minor. Slap bass
walking the root. Clavinet wah on the off-beats. Linn LM-1
drums laid back behind the beat (shoulder-roll feel). Hammond
B-3 pads holding minor 7th voicings underneath. A processed
wordless choir enters at 0:30, holds long sustained vowels,
exits by 1:00. Bridge at 1:10 drops drums for 8 bars, just bass
and Hammond. Drums return for outro. NO lead vocals. Leave
mid-range clear for spoken-word voice-over. 100 seconds, loop-
seamless. -23 LUFS."
```

### 4.2 og_003.mp3 — "Faster Than The Thought"

- Output: `audio/outergroove/og_003.mp3`
- Tempo: 104 BPM · Key: C Dorian · Duration: 95 s
- Pairs with: `log_keyword_rush`
- Mood tags: driving, confident, searching, zero-g-funk

```
Suno prompt:
"104 BPM zero-g funk instrumental in C Dorian. Driving slap bass
locked into a syncopated 16th-note pocket. Clavinet wah lead
chasing the bass. Linn LM-1 drums on top of the beat (urgent,
not laid-back). Funk-guitar 16th-note scratch on the upbeats.
A 4-bar Rhodes piano solo at 0:40 holds Dorian color tones
(natural 6, flat 7). Confidence builds across the track — adds
hi-hat opens at 1:00, percussion shaker by 1:15. NO lead vocals.
Leave mid-range clear. 95 seconds, loop-seamless. -23 LUFS."
```

### 4.3 og_005.mp3 — "One Bite Shield"

- Output: `audio/outergroove/og_005.mp3`
- Tempo: 88 BPM · Key: E-flat minor · Duration: 110 s
- Pairs with: `log_keyword_forcefield`
- Mood tags: quiet-storm, 3am, contemplative, space-station-soul

```
Suno prompt:
"Quiet-storm space-station soul at 88 BPM in E-flat minor.
Smooth fretless bass holding long notes. Linn LM-1 drums very
soft, side-stick rim-clicks instead of full snare. Rhodes
electric piano holding sus2 voicings. A muted trumpet plays a
slow searching melody at 0:25-0:55, then drops out. Returns
faintly at 1:30 with reverb tail extending. Late-night 3 AM
mood. NO lead vocals. Leave mid-range clear for VO.
110 seconds, loop-seamless. -23 LUFS."
```

### 4.4 og_007.mp3 — "The Double Heartbeat"

- Output: `audio/outergroove/og_007.mp3`
- Tempo: 112 BPM · Key: G Mixolydian · Duration: 100 s
- Pairs with: `log_keyword_celerity`
- Mood tags: hyperactive, sign-o-the-times, doubled, cathedral-funk

```
Suno prompt:
"112 BPM hyperactive cathedral-funk in G Mixolydian (root + flat
7 prominent). Slap bass alternating between root and double-time
runs. Linn LM-1 drums with a doubled kick pattern (every kick
hits twice in quick succession — 'double heartbeat'). Clavinet
wah riff on top, shifting between G7 and F. Sign-o-the-times
'87 production gloss — gated reverb on the drums, chorus on the
bass. Wordless choir burst at 0:50-1:05. NO lead vocals. Leave
mid-range clear. 100 seconds, loop-seamless. -23 LUFS."
```

### 4.5 og_009.mp3 — "The Egg"

- Output: `audio/outergroove/og_009.mp3`
- Tempo: 76 BPM · Key: B-flat minor · Duration: 130 s
- Pairs with: `log_keyword_rebirth`
- Mood tags: reverent, lullaby, funeral-cortege, grieving-groove

```
Suno prompt:
"Reverent funeral-cortege grieving-groove at 76 BPM in B-flat
minor. Bass plays slow whole notes on the root, doubled by upright
acoustic bass. Drums brushed-snare slow shuffle, no kick on the
downbeat (kick on the 'and' of 4 only — feels like a held breath).
Solo cello plays a long mournful line at 0:30-1:10, almost a
lullaby but in minor. Hammond B-3 pads enter underneath at 0:50,
hold whole-note voicings. The whole track feels like a slow walk
behind a small coffin. NO lead vocals, no choir. Leave mid-range
clear. 130 seconds, loop-seamless. -23 LUFS."
```

### 4.6 og_011.mp3 — "Permission To Be Anywhere"

- Output: `audio/outergroove/og_011.mp3`
- Tempo: 96 BPM · Key: A major · Duration: 95 s
- Pairs with: `log_keyword_flying`
- Mood tags: weightless, buoyant, optimistic, zero-g-flute

```
Suno prompt:
"Buoyant zero-g funk at 96 BPM in A major. Bouncy slap bass on
the I-IV-vi-V progression (A-D-F#m-E). Linn LM-1 drums laid back
but happy. Solo concert flute plays a weightless drifting melody
across the whole track — feels like floating without effort.
Wurlitzer electric piano holds open-voiced major 9th chords
underneath. A single hand-clap layer at 0:30 in groups of three.
NO lead vocals. Leave mid-range clear for VO. 95 seconds, loop-
seamless. -23 LUFS."
```

### 4.7 og_013.mp3 — "The Clean Line"

- Output: `audio/outergroove/og_013.mp3`
- Tempo: 84 BPM · Key: D minor · Duration: 115 s
- Pairs with: `log_keyword_ranged`
- Mood tags: noir-jazz, patient, cool, trumpet-dangerous

```
Suno prompt:
"Cool noir-jazz instrumental at 84 BPM in D minor. Walking
upright bass on the changes (i-iv-V7 with chromatic passing
tones). Brushed drums with brushes on the snare, ride cymbal on
2 and 4. Solo Harmon-muted trumpet plays a patient dangerous
melody — single long notes with slight pitch bend, lots of space
between phrases. Comping piano holds rootless minor 9 voicings
underneath. Smoky 1955 Blue Note record vibe, but deeply funky
underneath. NO lead vocals. Leave mid-range clear.
115 seconds, loop-seamless. -23 LUFS."
```

### 4.8 og_015.mp3 — "The Ones Who Watch The Falling"

- Output: `audio/outergroove/og_015.mp3`
- Tempo: 72 BPM · Key: C-sharp minor · Duration: 140 s
- Pairs with: `log_keyword_deathwatch`
- Mood tags: trip-hop, mournful, heavy-gravity, processed-choir

```
Suno prompt:
"Trip-hop mournful instrumental at 72 BPM in C-sharp minor.
Heavy compressed kick + snare, the snare hitting hard on the 3
(Portishead/Massive Attack feel). Sub-bass drone holding root.
Sampled processed-choir loops play sustained vowels on top —
heavily filtered, sounds like a choir heard from underwater.
Tape hiss and vinyl crackle layer underneath. A solo Theremin or
saw-wave synth plays a single descending three-note melody at
0:45 and again at 2:00. Heavy gravity, no resolution. NO lead
vocals. Leave mid-range clear. 140 seconds, loop-seamless.
-23 LUFS."
```

### 4.9 og_017.mp3 — "The Wrong Angle"

- Output: `audio/outergroove/og_017.mp3`
- Tempo: 108 BPM · Key: F-sharp minor · Duration: 100 s
- Pairs with: `log_keyword_backstab`
- Mood tags: stealth-funk, shaft-groove, bongo-bridge, moving-quietly

```
Suno prompt:
"Stealth-funk shaft-groove at 108 BPM in F-sharp minor.
Isaac-Hayes-meets-Lalo-Schifrin. Slinky wah-guitar 16th-note
chuck on muted strings. Slap bass slides between root and flat
7. Live-room drum kit with congas and bongos panned wide,
playing a syncopated bongo bridge at 0:30 and 1:10. Hi-hat
shimmer high in the mix. A flute or Rhodes plays a single
two-bar riff that returns four times across the track,
slightly different each time. The whole thing feels like
moving quietly through a hostile space. NO lead vocals. Leave
mid-range clear. 100 seconds, loop-seamless. -23 LUFS."
```

### 4.10 og_019.mp3 — "The Tax On Hurting"

- Output: `audio/outergroove/og_019.mp3`
- Tempo: 82 BPM · Key: G minor · Duration: 125 s
- Pairs with: `log_keyword_drain`
- Mood tags: medicinal-soul, slightly-guilty, muted-trumpet, clinic-funk

```
Suno prompt:
"Medicinal-soul clinic-funk at 82 BPM in G minor. Curtis
Mayfield meets Stevie's 'Innervisions.' Soft Wurlitzer chords on
i-VI-iv7. Slap bass plays sparse — 2-3 notes per bar. Linn LM-1
drums very subdued, tambourine on every 8th. Muted trumpet plays
a slightly-guilty melody at 0:30-1:00 — feels like a doctor
delivering a diagnosis they wish they didn't have to. Wordless
backing 'oohs' from a small mixed-gender vocal group at 1:10,
holding suspensions that resolve down. NO lead vocals.
125 seconds, loop-seamless. -23 LUFS."
```

### 4.11 cover.jpg — Outer Groove album cover

- Output: `audio/outergroove/cover.jpg`
- Tool: Nano Banana 2
- Format: 2048×2048 JPG (square album sleeve)
- Priority: P2

```
Square album cover, 2048×2048 photorealistic concept art with
slight off-register print artifacts (1970s LP sleeve treatment).
The album is "OUTERGROOVE" by The Programmer — space-opera funk
recorded in his early Panopticon studio era.

Composition:
- Centered: a single 12-inch vinyl record floating against a
  starfield. The record's spiral groove extends OUTWARD past the
  edge of the disc, becoming a literal galaxy spiral that fills
  the lower half of the frame. The needle is dropping into the
  outermost groove right at the moment of contact.
- Color palette: warm earth-tones (rust, ochre, deep teal) with
  one accent of the Programmer's signature electric blue at the
  needle-drop point.
- Title 'OUTERGROOVE' set in lower-third in a bespoke 1970s
  geometric serif (think Sun Ra's "Space Is The Place" treatment).
- 'THE PROGRAMMER' set smaller above the title in a minimal
  sans-serif.
- Background starfield is hand-painted, not photographic — visible
  brushwork, slight overprint of cyan-magenta-yellow registration
  marks at the top edge as if the sleeve was misaligned at press.

Negative: no real-world band names, no modern logos, no QR codes,
no UI overlays, no celebrity faces, no anime/cel-shading.
```

---

## §5 — Celebration Park Ambient (4)

**Source**: `apps/shared/celebrationParkMap.ts`. **Tool**: Suno.
**Format**: 3 min seamless loop MP3, -23 LUFS. **Priority**: P2.

The four Celebration Park districts each have a published
"leitmotif" hint and a brochure-vs-undercurrent split — render
both in the same track. Brochure on top, undercurrent
unmistakably underneath.

### 5.1 chorus-plaza.mp3 — Chorus Plaza (Conni the Conductor)

> Leitmotif: a music-box waltz in F major, slightly off-pitch
> on every third bar. Brochure: "Start your day in our grandest
> gathering place! Meet Conni the Conductor and join the choir.
> No audition required — everyone's voice belongs here."
> Undercurrent: "The choir never stops, even when guests walk
> away. The bandshell's acoustics are designed so you can still
> hear yourself singing two hours after you've left."

```
Suno prompt:
"3 min seamless loop in F major. Foreground: a brass-and-strings
music-box waltz at 132 BPM, sweet and inviting, with a deliberate
quarter-tone pitch flatness on every third bar (the music box's
escapement is tired). Mid-ground: a distant childrens' choir
holding sustained 'ah' vowels on the tonic, never resolving,
never cutting off — they continue under every section change.
Background: faint footstep echoes on stone, like a guest just
walked past your shoulder; an occasional brass-band warmup
phrase from a bandshell two blocks away. The mix is bright and
warm in front, but if you focus on the choir layer you can
hear it getting fractionally louder over the 3 minutes (you
can't actually leave). NO lead vocals, NO lyrics. -23 LUFS."
```

### 5.2 watchers-promenade.mp3 — Watcher's Promenade (Mr. Unblink)

> Leitmotif: a glass-harmonica scale that never quite resolves
> to tonic. Brochure: "Pose for a souvenir photo with Mr. Unblink!
> He remembers every visit. He'll mention your last one, too.
> Isn't that thoughtful?" Undercurrent: "The portraits age in
> the frame. Guests who stand too long in front of their own
> photograph find themselves forgetting what they came in
> wearing."

```
Suno prompt:
"3 min seamless loop in C major (key never confirmed by cadence).
Foreground: a glass-harmonica scale walking up and down — eight
notes that climb to the leading tone but never land on the
tonic, then descend back. The scale loops every 24 seconds with
slight variations. Mid-ground: subtle camera-shutter clicks
once every 18-22 seconds (irregular spacing — you're being
photographed). Background: a faint wax-cylinder phonograph
crackle suggesting old portraits hanging on walls; once during
the loop, a single voice whispers a short phrase too quiet to
make out. Tempo feels suspended — no clear pulse. NO lead
vocals. -23 LUFS."
```

### 5.3 princes-domain.mp3 — Prince's Domain (the Prince's castle)

> Leitmotif: a fanfare trumpet that phase-shifts into a child's
> birthday song halfway through. Brochure: "His Highness
> personally greets every visitor! Receive a proclamation
> written just for you. Keep your proclamation on your person
> at all times — we do make sure." Undercurrent: "Proclamations
> are contracts. Guests who lose theirs are quietly re-named by
> the castle clerks and added to the Parade as cast members of
> long standing."

```
Suno prompt:
"3 min seamless loop in D major. Foreground: a single regal
trumpet plays a four-note royal fanfare every 30 seconds. Each
return, the fanfare's last note bends down a half-step further
toward a children's birthday song melody — by the third return
it's clearly 'Happy Birthday to You' (in a minor key
transposition that doesn't have copyright issues — render the
phase-shifted version, not the actual tune). Mid-ground: a
distant pipe organ holds long pedal-tones, royal but slightly
funereal. Background: a faint scratching of quill on parchment,
recurring every 40 seconds (proclamations being signed somewhere
out of view); occasional muffled crowd cheer. The whole track
feels like a coronation that became a children's party that
became something else. NO lead vocals. -23 LUFS."
```

### 5.4 seeker-meadow.mp3 — Seeker Meadow (the youngest Mascoteer)

> Leitmotif: a nursery rhyme lullaby played on a toy piano with
> one key missing. Brochure: "Bring the little ones! Our
> youngest Mascoteer loves new friends. Play games all day. The
> Meadow's clock is stopped at 3:47 PM — naptime is forever!"
> Undercurrent: "The fountain keeps a running tally of guests
> who came in with a child and left without one. The tally
> resets to zero every morning. The tally has never reached
> zero during operating hours."

```
Suno prompt:
"3 min seamless loop in C major. Foreground: a child's toy
piano plays a slow lullaby melody at 60 BPM — gentle, sweet,
3-note motifs. One specific note (a G in the upper register)
is broken; whenever it should be played, instead there's a soft
felt-mallet thud, dead-string. Mid-ground: a music-box version
of the same melody plays a half-bar behind, slightly out of
sync. Background: a soft wind through tall grass; 2-3 distant
songbirds in irregular rotation; a fountain bubbling with the
sound of small running water. Once during the loop, around
2:00, a single small giggle. The whole track feels like
naptime that doesn't end. NO lead vocals, no lyrics, no
identifiable nursery-rhyme tune (write a fresh lullaby that
*feels* like one). -23 LUFS."
```

---

## §6 — Specimen Fragment Portraits (6)

**Source**: hardcoded URLs in
`apps/client/src/game/CompanionSelectionScene.tsx` referencing the
six starter eidolons defined in
`apps/client/src/data/companions/starterEidolonForms.ts`. **Tool**:
Nano Banana 2. **Format**: 1024×1024 PNG transparent background.
**Priority**: P1 (gates companion selection UX).

### Shared style guide

> A **fragment** is the pre-companion form — small, vulnerable,
> not yet fully realized. Each fragment looks like a piece of
> the eventual eidolon broken off and glowing softly with the
> specimen's signature element. Centered three-quarter view.
> Glowing core. Soft particle aura. No environment. No text.
> Photorealistic painted concept art matching the live
> `art/eidolons/*.png` treatment in `nanobanna2Assets.ts`.
> **No UI. No anime/cel-shading. No harsh contour lines. Distinctly
> smaller and incomplete than an adult eidolon.**

### 6.1 lux-fragment.png — Lux (Holographic Fox / light)

```
A fragment of Lux (Holographic Fox) — its earliest pre-companion
stage. A small floating shard of cyan holographic light, roughly
fox-shaped but only half-formed (you can see the *idea* of a fox
ear, the suggestion of a snout, but the body is mostly drifting
data-streams and afterimage motes). Semi-transparent throughout.
A faint single white-blue 'eye' light at the front. Phase-shift
trail leaves three pale ghost-versions of itself behind. Apply
the §6 style guide above.
```

### 6.2 echo-fragment.png — Echo (Temporal Kitten / time)

```
A fragment of Echo (Temporal Kitten) — pre-companion stage. A
small kitten-shaped cluster of pale lavender-silver light,
existing as five overlapping translucent silhouettes spread out
along its motion path (past + present + future positions, all
visible simultaneously). The 'present' silhouette is slightly
more solid than the others. A single batting paw extends toward
the viewer — but in one of the future-position silhouettes, that
paw is reaching for empty space half a second ahead. Apply the
§6 style guide above.
```

### 6.3 glyph-fragment.png — Glyph (Text Moth / language)

```
A fragment of Glyph (Text Moth) — pre-companion stage. A small
moth, wing-span no bigger than a hand, with tattered translucent
wings made entirely of half-formed text. The wings show
fragmentary glyphs in different alphabets — visible characters
include scattered Latin letters, three single Cyrillic letters,
two Hebrew letters, broken hex digits. None of the visible text
forms a complete word. Body is matte ash-grey. Soft golden ink
particles drift off the wing edges. Apply the §6 style guide
above.
```

### 6.4 cipher-fragment.png — Cipher (Data Serpent / data)

```
A fragment of Cipher (Data Serpent) — pre-companion stage. A
short coiled serpent of flowing green Matrix-style code. Body
length only about 30 cm. The 'scales' are individual lines of
abstract algorithm-looking text scrolling along its surface.
Head is barely formed — two faint pixel-eye dots, no visible
mouth. The body is mid-undulation, S-curve. Edges of the form
faintly de-rezz into pixelation as if rendering hasn't fully
resolved. Apply the §6 style guide above.
```

### 6.5 flicker-fragment.png — Flicker (Static Bird / signal)

```
A fragment of Flicker (Static Bird) — pre-companion stage. A
small bird made of pure electromagnetic static — body composed
of TV-snow noise. Wings barely cohere; in places they break up
into horizontal scan-lines. The bird is mid-perch on an invisible
wire, head cocked. A faint trail of static-fuzz drifts upward
behind it. The 'eye' is a single bright signal pulse-dot. Color:
black/white/silver static with one accent color flickering
between magenta and cyan as if it can't decide on a frequency.
Apply the §6 style guide above.
```

### 6.6 gilt-fragment.png — Gilt (Golden Beetle / value)

```
A fragment of Gilt (Golden Beetle) — pre-companion stage. A
small beetle, body length ~3 cm, with a polished golden chitin
shell. The shell is engraved with shifting fluctuating numerals
(market prices, exchange rates, valuations) — they're visibly
ticking up and down across the surface like a living stock
ticker. Six tiny gold-leaf legs. Two short antennae tipped with
luminous green dots (positive value indicators). Caught
mid-step on an invisible surface. Apply the §6 style guide
above.
```

---

## §7 — Acts 4-7 Spine Cinematics (30 assets)

**Source**: `apps/shared/songSlideshows.ts:1860-2071`. Six
cinematics, each = 3 NB2 frames + 1 NB2 hero + 1 Suno audio
intro = **30 assets total**. **Priority**: P0 (story-spine
beats — game cannot ship without them).

### 7.0 Shared style guide (apply to every frame + hero in §7)

> Cinematic 1920×1080 WebP. Painted concept-art style with the
> palette and brushwork of the existing
> `art/cinematics/the-helmet-in-the-grass/*` and
> `art/cinematics/the-bulb-breaks/*` slideshow assets — warm
> amber + deep teal + occasional Caravaggio gold key-light from
> a single source. Heavy chiaroscuro. Composition reads at
> 1080p with letterbox-friendly negative space at top and
> bottom (captions + UI overlay). **No characters' faces
> photoreal — paint them.** No text in frame. No modern
> Earth-tech logos. No anime/cel-shading. No harsh contour
> lines.

### 7.1 silence-of-two-witnesses (Bond 60, Act 2 horizontal milestone)

> Subtitle: "Both narrators go quiet. The Light freezes. The
> Dark pauses." Reduced-motion prose: "Two narrator portraits
> side by side on a black field. Elara's lips move without
> sound. The Human stands in his trench coat with nothing to
> say. The camera pulls back to the Memorial Corridor in warm
> Caravaggio light. The galaxy is holding one breath. Both of
> them need a minute."

#### 7.1.1 frame01.webp — "Elara's portrait flickers. Her lips move. No sound arrives."

```
Cinematic 1920×1080 WebP. Mid-shot of Elara's holographic narrator
portrait against pure black void — her face partly painted, partly
dissolving into translucent cyan-blue scan-lines. Her lips are
parted mid-word; the visible lipsync is a soft 'ah' sound that
isn't carrying. Her left side is solid, her right side is
breaking into pixelated drift like a corrupted hologram. Single
warm amber rim-light from camera-right (the Caravaggio key)
catching her cheekbone. Her eyes are looking just past the
viewer's shoulder. Apply the §7.0 style guide above.
```

#### 7.1.2 frame02.webp — "The Human's trench coat is still on screen. His voice is not."

```
Cinematic 1920×1080 WebP. Wide shot: The Human stands centred,
dark trench coat falling in heavy folds, hands in pockets, head
slightly bowed. His face is mostly in shadow — the Caravaggio
amber key-light from camera-left catches only the edge of his
jaw and the rim of his hat. Behind him a pure black void,
faintly broken at the bottom edge by a thin band of memorial
candles too far away to read. His mouth is closed. His posture
says he could speak. He isn't going to. Apply the §7.0 style
guide above.
```

#### 7.1.3 frame03.webp — "The Memorial Corridor. Caravaggio light. The galaxy holds one breath."

```
Cinematic 1920×1080 WebP. Wide establishing shot of the Memorial
Corridor pulled all the way back — a long hall of arched
mahogany alcoves, each holding a single lit candle behind glass.
Two small backlit silhouettes (Elara on the left as a
holographic glow, The Human on the right as a coat-and-hat
shape) stand side by side at the far end of the corridor,
mid-distance from the camera. The corridor's vault ceiling is
half-lost to deep shadow. The Caravaggio gold key-light spills
from a single high-window source on the right, raking diagonally
across the floor. Visible above the vault, faintly painted into
the negative space of the ceiling, the suggestion of a galactic
spiral — held still, breath caught. Apply the §7.0 style guide
above.
```

#### 7.1.4 hero.webp — Reduced-motion fallback (single still)

```
Cinematic 1920×1080 WebP. Composite hero still that combines all
three frames into one painted composition. Left third: Elara's
flickering hologram bust (from frame01) cropped tight. Right
third: The Human's silhouette in trench coat (from frame02).
Centre/background: the Memorial Corridor's vaulted ceiling and
candlelit alcoves (from frame03) framing them both. The two
narrator figures are scaled smaller than they would be in
isolation, leaving the corridor's vast quiet space dominant.
Caravaggio gold key-light on both figures from above. Apply the
§7.0 style guide above.
```

#### 7.1.5 silence-of-two-witnesses-ambient.mp3 — Suno

```
Suno prompt:
"3-frame cinematic ambient bed at ~0.07 BPM equivalent (a single
heartbeat every 9 seconds). Sparse two-witness instrumental: a
solo reed (oboe or English horn) and a solo cello trade short
2-bar phrases over a near-silent room-tone. The harmonics never
quite resolve; each phrase ends on a suspended chord. Underneath:
a barely-audible pulse drone (single low pedal tone in C#) that
holds across the entire 21-second duration. NO percussion. NO
choir. NO lead vocals. NO melody resolution. Mood: reverence,
restrained grief, witnessing. The galaxy is holding its breath.
Output 21 seconds (matches 3 × 7s slideshow frame timing),
seamless tail. -23 LUFS."
```

### 7.2 act-4-revelation (Act 4 — The Revelation)

> Subtitle: "The Prisoner's memory is a door. You are the one
> opening it." Reduced-motion prose: "The Prisoner's cell is
> not a cell. It is a memory palace Kael built to hide the
> names the Warlord took from him. The next four fights are
> the extraction. You are the hand that reaches in."

#### 7.2.1 frame01.webp — "The cell door is not a door. It is a mirror. Kael has been waiting for you."

```
Cinematic 1920×1080 WebP. Mid-shot of a prison cell door from the
visitor's side — heavy iron-and-bone door set in a stone wall.
Where the small door-window should be is instead a tarnished
silvered mirror, faintly fogged at the edges. In the mirror's
reflection: not the room behind the camera, but Kael — a tall,
weathered man in a dark trench coat, hat lowered, standing in a
warmly-lit interior space (a memory palace, painted as a sepia
study). Kael's reflected gaze meets the viewer directly through
the mirror. The door's lock is on the wrong side (inside, not
outside). Caravaggio gold key-light from camera-right rakes the
stone wall. Apply the §7.0 style guide above.
```

#### 7.2.2 frame02.webp — "Every fight from here is a memory extraction. The Arena is the interrogation room."

```
Cinematic 1920×1080 WebP. Mid-wide shot of a fighting Arena pit
overlaid with the visual language of an interrogation room. The
Arena floor is the same dust-ring as the rest of the game's
fight art, but the surrounding seating is missing — replaced by
high vault walls of dark stone. Above the pit, a single bare
hanging bulb (interrogation-lamp style) swings on a long cord,
casting a hard cone of cool-white light onto the centre. Two
combatant silhouettes stand opposed in the centre but appear
faintly translucent — they are not flesh, they are memories
being extracted. Apply the §7.0 style guide above.
```

#### 7.2.3 frame03.webp — "Lay down the fight. Listen for the name he hid inside it."

```
Cinematic 1920×1080 WebP. Close-on-the-floor low-angle shot:
the dust ring of the Arena pit in the foreground, a fallen
combatant's open hand at the bottom of the frame holding a
single small folded slip of paper. The slip has handwriting on
it — readable as suggestion only, no actual text — and the
handwriting is slightly different from the surrounding scene's
visual language (it's Kael's). Mid-ground: the fallen
combatant's silhouette already dissolving into amber motes that
drift upward toward an unseen extraction point above frame.
Background: the interrogation lamp from frame02 still hanging,
now dimmer. Caravaggio key-light from camera-left grazing the
paper slip. Apply the §7.0 style guide above.
```

#### 7.2.4 hero.webp — Reduced-motion fallback

```
Cinematic 1920×1080 WebP. Composite hero still combining the
three frames into one painted composition. Left third: the cell
door with mirror-window (frame01) cropped tight. Centre: the
Arena interrogation pit (frame02) with the swinging bulb. Right
third: the fallen-hand-with-paper detail (frame03) inset like a
diptych panel. The three sections separated by faint vertical
divisions — like a triptych altarpiece. Caravaggio gold
key-light unifying the three with consistent lighting from
upper-right. Apply the §7.0 style guide above.
```

#### 7.2.5 act-4-intro.mp3 — Suno

```
Suno prompt:
"Cinematic act-opener at 90 BPM in D minor. Solo cello holds a
sustained low-note drone for the first 4 seconds. A distant
choir hum (no lyrics, just sustained 'oh' vowel) enters at 0:04,
holding minor 7th harmony. At 0:18, a deep brass swell rises
underneath — French horns + low trombones — building tension
without quite resolving. A single struck timpani at 0:35 marks
the turn. Strings ascend in the final 5 seconds toward a held
unresolved chord that doesn't land before the loop ends.
Caravaggio audio: warm low-mids, deep blacks in the spectrum,
single gold-light high element. Dramatic but contained. Mood:
dawning realization, irrevocable decision, the door has opened
and you cannot un-open it. Output 21 seconds (3 × 7s frame),
seamless tail. -23 LUFS."
```

### 7.3 act-4-5-dmc (Act 4.5 — Dead Man's Circuit interlude)

> Subtitle: "Name your wager. The Circuit keeps it whether you
> win or not." Reduced-motion prose: "The Circuit runs on
> identity. Each lap costs you a name. The Degen Casino runs on
> entropy. Each hand costs you a certainty. You pick the track,
> you name the wager, and you pay it once. The chain remembers
> which version of you finished."

#### 7.3.1 frame01.webp — "The track is bone. The engines are memory. The stake is a name you will no longer answer to."

```
Cinematic 1920×1080 WebP. Wide low-angle shot of a racing
circuit literally constructed from bone — the track surface is
white-grey calcified material, the guardrails are femurs lashed
together with brass wire, the start-finish line is a single
intact spine arched across the track. In the middle distance:
a low-slung racing engine sitting at the start line, its
chassis painted in a faded golden script that reads (suggested,
not literal) names of past racers. The engine is half-mechanical,
half-translucent — the visible interior is filled with drifting
amber light that is "memory." Sky above is deep purple-black
with one cold star. Apply the §7.0 style guide above.
```

#### 7.3.2 frame02.webp — "The Degen's Pact is simple. Entropy is the dealer. Everyone at the table is already losing."

```
Cinematic 1920×1080 WebP. Mid-shot of a poker table inside the
Degen's Casino, photographed from the dealer's-shoulder vantage.
The table felt is deep cyan with the casino's signature
six-pointed-star pattern. Five seats around the table — only
silhouettes are visible (faceless players). In the dealer's
position sits an empty chair; instead of a dealer, a tarnished
brass scale rests on the table where the chip-tray would be —
its left pan empty, its right pan piled with abstract tokens
that visibly de-rezz into golden sand-grains and drift away with
each second. The five player silhouettes have visibly fewer
chips than the previous beat would suggest. Above the table, a
single neon sign in the casino's red reads (suggested, not
literal) "ENTROPY DEALS." Apply the §7.0 style guide above.
```

#### 7.3.3 frame03.webp — "Student. Seeker. Detective. The Last. One of these will be what's left of you."

```
Cinematic 1920×1080 WebP. Frontal portrait composition split
into four equal vertical panels — like a quadriptych identity
chart. Each panel shows a different silhouette of the player-
character against a different muted background:
  Panel 1 (left): "Student" — figure in academy uniform, head
    bowed over a book, soft amber pendant lamp light.
  Panel 2: "Seeker" — figure in travel cloak with a walking
    staff, against a horizon at dusk.
  Panel 3: "Detective" — figure in trench coat under a bare
    interrogation bulb (echoing 7.2.2).
  Panel 4 (right): "The Last" — figure standing alone in a
    field, face fully obscured, slightly translucent.
The four panels are connected by a faint red-cyan thread of
light running horizontally across all four at chest height —
the identity chain. One panel will be the survivor; the prompt
should NOT favor any single one. Apply the §7.0 style guide
above.
```

#### 7.3.4 hero.webp — Reduced-motion fallback

```
Cinematic 1920×1080 WebP. Composite hero still combining the
three frames. Bottom half: the bone-track with the memory-engine
at the start line (frame01) — wide and atmospheric. Upper-left
quarter: a tight inset of the Degen's poker table with the brass
scale (frame02). Upper-right quarter: a tight inset of the
quadriptych identity chart (frame03), all four silhouettes
visible in miniature. The two upper insets framed in ornate
brass cartouche borders, like a casino marquee. Caravaggio
key-light from upper-left unifying the composition. Apply the
§7.0 style guide above.
```

#### 7.3.5 act-4_5-intro.mp3 — Suno

```
Suno prompt:
"Cinematic interlude opener at 96 BPM in F minor. Synth pads
holding suspended chords (Fm7sus4 → Cm7sus4 → Bbm7sus4 progression
without resolution). Underneath: mechanical click pattern at 16th
notes — like a vintage roulette wheel slowing down OR a heart
monitor's irregular ticks (deliberately ambiguous). A single
muted brass-plate strike at 0:08 marks each new clinical phrase.
At 0:14, a wordless tenor vocal enters holding a sustained 'ah'
on the F — held for 6 seconds, no vibrato, slightly off-tune
(half a comma flat) so it feels uneasy. NO lyrics. NO percussion
beyond the click pattern. Mood: clinical dread, the work
continues, entropy is dealing the next hand whether you sit down
or not. Output 21 seconds (3 × 7s frame), seamless tail.
-23 LUFS."
```

### 7.4 act-5-map (Act 5 — The Reckoning)

> Subtitle: "Kael's map is open. Five sectors. Twenty worlds. One
> last stand." Reduced-motion prose: "Kael's map fills the
> bridge. Five sectors, twenty worlds, a list of names the
> Warlord took. Iron Lion's transmissions come in from Veridian
> VI at 03:17 ship time. The final mission is already running.
> You recruit, you dispatch, and you do not sleep."

#### 7.4.1 frame01.webp — "He drew this on the back of a ration wrapper. Every planet. Every name."

```
Cinematic 1920×1080 WebP. Tight close-up shot from above of a
crumpled silver ration wrapper laid flat on a metal mess-table.
Hand-drawn in graphite on the inside of the wrapper: a star
chart with five sector boundaries traced in confident strokes,
twenty small star-points marked with planet glyphs, and beside
each glyph a name written in the same handwriting (Kael's —
read as suggestion only, no literal text). The wrapper is
slightly torn at the upper edge. Beside it on the table: a
chewed pencil stub, a half-finished cup of cold coffee, the
edge of a fingerless tactical glove. Single warm pendant lamp
overhead casts a tight pool of amber light, the rest of the
table fading into deep blue-black shadow. Apply the §7.0 style
guide above.
```

#### 7.4.2 frame02.webp — "Iron Lion is already moving. The Cades are tightening the line around Veridian VI."

```
Cinematic 1920×1080 WebP. Wide bridge-of-the-flagship shot:
the foreground is a holographic tactical projection table
displaying a 3D star map (the same map from 7.4.1, but rendered
in living holo-cyan light). Three small luminous icons mark
fleet positions — one large amber lion-glyph already pulled
forward toward a target planet at the right of the projection,
two cyan brackets tightening on the same target ("Veridian VI"
suggested as a label, not literal). Mid-ground: a single bridge
officer in silhouette stands at the projection table, back to
the camera, head tilted toward an unseen comm channel. A faint
red transmission-active light at the bottom of the projection.
Background: bridge windows showing deep starfield. Caravaggio
key-light from camera-left rakes the officer's shoulder. Apply
the §7.0 style guide above.
```

#### 7.4.3 frame03.webp — "Recruit the army. Finish the mission. You cannot save the Lion. Try anyway."

```
Cinematic 1920×1080 WebP. Wide shot of the bridge taken from
the rear of the room, looking forward through the projection
table to the bridge windows beyond. The hologram from 7.4.2 is
still up but now zoomed wider — five sector boundaries fully
visible, twenty planet markers each ringed with small fleet
icons being dispatched. The bridge officer from 7.4.2 has been
joined by two more silhouettes — recruits. Through the bridge
windows: a wing of small fighter craft already launching toward
the starfield. The amber lion-glyph from frame02 is now pulled
ALL the way to its target — a single small star — and is
flickering. Caravaggio key-light tinted slightly red, suggesting
imminent loss. Apply the §7.0 style guide above.
```

#### 7.4.4 hero.webp — Reduced-motion fallback

```
Cinematic 1920×1080 WebP. Composite hero still: the bridge
projection table dominates the frame at low angle, the
holographic star map filling most of the composition. Inset
top-left in a small painted vignette: the crumpled
ration-wrapper map (frame01) — like a "this is where it started"
nod. Inset top-right in matching vignette: a tight crop of the
flickering amber lion-glyph from frame03. Three silhouettes
stand around the projection table in mid-distance. Bridge
windows visible at top-edge showing fighter-wing launch.
Caravaggio gold key-light from upper-right unifying the whole
scene. Apply the §7.0 style guide above.
```

#### 7.4.5 act-5-intro.mp3 — Suno

```
Suno prompt:
"Cartographer's overture at 100 BPM in A minor. Solo handpan
plays a 4-note ostinato (A-C-E-G descending) for the first 8
seconds, then doubles when ambient strings enter underneath
(low cellos holding root, second violins on the 5th). Distant
brass section sustains a single note at 0:14 — quiet but rising
in volume across 7 seconds. A single ship-bell strike at 0:09.
Layered very low underneath: an irregular slow blip — Iron Lion's
incoming transmission tone, syncopated against the handpan's
4/4. NO percussion beyond the bell and blip. NO lead vocals. NO
choir. Mood: scope expanding, getting to know the shape of the
world, the cartographer is finally awake. Output 21 seconds
(3 × 7s frame), seamless tail. -23 LUFS."
```

### 7.5 act-6-confession (Act 6 — The Confession)

> Subtitle: "Both of them finally spoke. Neither could look at
> the other." Reduced-motion prose: "Elara admits she was human,
> once. The Human admits he has been playing the villain to
> cover a third thing neither of them can name out loud. The
> room feels watched. The Watcher is named in this act. You
> will choose how to stand when it is."

#### 7.5.1 frame01.webp — "Elara's portrait is the clearest it has ever been. That is the first clue."

```
Cinematic 1920×1080 WebP. Tight portrait shot of Elara — but
unlike every previous Elara appearance, the holographic glitch
treatment is GONE. Her face is rendered with the highest level
of painted realism in the entire game's art treatment: every
freckle, every small expression around the eyes, the soft
texture of her brown irises, the suggestion of breath catching
in her throat. She is looking directly at the viewer. Her mouth
is closed but mid-decision-to-open. Behind her: a deeply blurred
soft warm interior space — wood paneling, a single low lamp.
The Caravaggio amber key-light from camera-left, but dialed
softer than the other cinematics. The clarity itself is the
emotional beat. Apply the §7.0 style guide above.
```

#### 7.5.2 frame02.webp — "The Human takes his coat off. He has not done that in seventeen thousand years."

```
Cinematic 1920×1080 WebP. Mid-shot of The Human standing in
profile, mid-motion of removing his trench coat — one shoulder
already free, the coat sliding down his arm. Underneath the coat:
a simple dark grey collared shirt, sleeves rolled at the
forearms. His hat is on a small side table beside him. The room
is the same warm interior implied behind Elara in 7.5.1 — wood-
paneled, low lamp. He is not looking at the camera; his gaze is
on the coat itself, an expression that reads as weight finally
being allowed down. The discarded coat reveals slightly thinner
arms than the trench-coat silhouette suggested across the rest
of the game. Apply the §7.0 style guide above.
```

#### 7.5.3 frame03.webp — "There is a third thing in the room with you. It has been watching since Act 1."

```
Cinematic 1920×1080 WebP. Wide shot of the same warm wood-
paneled room from 7.5.1 and 7.5.2, taken from a high corner
vantage that wasn't visible in either previous frame. Both
Elara (as a hologram in a small projection plinth) and The
Human (no longer in coat) are visible mid-distance, seated
across a small round table from each other, both leaning
slightly inward. Between them on the table: two cups of
something warm. The room's far wall has a small ornate gilded
mirror — and in the mirror's reflection, instead of showing
the room continuing, there is a third figure: a tall thin
silhouette with no visible features, standing precisely where
the camera is. The mirror's reflection of "the camera position"
is occupied by The Watcher. The reveal must read as
unmistakable but not jump-scare — Caravaggio quiet menace, the
key-light from above-left unchanged from the previous frames.
Apply the §7.0 style guide above.
```

#### 7.5.4 hero.webp — Reduced-motion fallback

```
Cinematic 1920×1080 WebP. Composite hero still emphasizing the
revelation. Centre: the wide shot of the wood-paneled room with
both narrators at the table (frame03 composition) — but the
mirror on the far wall is enlarged and made the visual focus.
The Watcher's silhouette in the mirror's reflection is the
brightest pixel in the frame (paradoxically — a dark shape
defined by negative-space brightness around it). Inset upper-
left: tight portrait of clarified Elara (frame01) in a small
oval cameo. Inset upper-right: The Human shrugging out of his
coat (frame02) in matching cameo. The two cameos are connected
to the central mirror-revelation by faint amber thread-of-light
running across the composition. Apply the §7.0 style guide above.
```

#### 7.5.5 act-6-intro.mp3 — Suno

```
Suno prompt:
"Confession theme at 70 BPM in B-flat minor. Solo upright piano
in a stone-walled room with natural reverb (clear, no plate, no
digital). Slow arpeggios in the left hand on i-VI-iv7
progression. Right hand traces a single melody line — patient,
sparse, with rests longer than the played notes. At 0:08, a solo
cello enters underneath holding the root, doubling at the octave
on a sustained breath. NO drums. NO choir. NO synths. Just two
human-played instruments in a real-sounding room. The piano's
sustain pedal is held throughout, allowing notes to bleed into
each other. At 0:18, a third presence enters very faintly — a
distant unidentifiable resonance (not an instrument, not a voice,
just a low hum that doesn't belong) — for the last 3 seconds.
Mood: stripped-bare honesty, the moment before truth, but
something else is in the room with you. Output 21 seconds (3 × 7s
frame), seamless tail. -23 LUFS."
```

### 7.6 act-7-convergence (Act 7 — The Convergence)

> Subtitle: "For the first and only time, their voices align."
> Reduced-motion prose: "The spine closes on a single sustained
> chord. Elara and The Human sing the same note for the first
> time. The Watcher is no longer hiding. Four final stances sit
> in front of you: For Humanity, See the Pattern, The Bridge,
> Take Command. Silence is also permitted. The cycle rolls over
> either way."

#### 7.6.1 frame01.webp — "The army is assembled. Five sectors. Seventeen generals. One horizon."

```
Cinematic 1920×1080 WebP. Wide ultra-deep-perspective hero shot
of a vast assembled army standing in formation on a flat plain
under a violet-purple pre-dawn sky. The composition is split
vertically into two halves at the horizon line: the bottom half
is the army (countless silhouetted figures in disciplined ranks
filling the entire foreground and middle distance), the top
half is sky with one cold star centered above the horizon.
Seventeen taller figures (the generals) stand at the front of
the formation, slightly more individuated than the surrounding
ranks but still rendered as silhouettes. The whole composition
is symmetrical and processional — like a Renaissance battle
painting before the engagement. Caravaggio gold key-light from
behind the camera (the rising sun, off-frame), backlighting
every figure with a warm rim. Apply the §7.0 style guide above.
```

#### 7.6.2 frame02.webp — "Two wars. One you can see. One the Watcher has been fighting since before you woke."

```
Cinematic 1920×1080 WebP. Composition split horizontally into
two stacked layers separated by a faint horizontal seam. UPPER
HALF: the visible war from frame01 — armies engaging, fighter
craft streaking across the sky, distant explosions on the
horizon, the language of conventional cinematic battle. LOWER
HALF (mirror-inverted, rendered in negative-space colour palette
— deep cyan-blacks instead of warm ambers): an entirely different
battle taking place in a non-physical realm. Tall thin Watcher
silhouettes (echoing 7.5.3) face off against opposing
silhouettes that appear to be made of pure golden light. No
weapons visible — the conflict is conceptual. The two halves
share continuity at the seam: a single figure mid-frame appears
in both halves, indicating the same person fights in both wars.
Apply the §7.0 style guide above.
```

#### 7.6.3 frame03.webp — "Their two voices land on a single chord. Hold it. Then pick a stance."

```
Cinematic 1920×1080 WebP. Frontal symmetric composition. Centre
of frame: a single sustained vertical pillar of pure golden
light running floor-to-ceiling — visualizing the held chord
where Elara and The Human's voices align for the first time. To
its left: Elara's clarified portrait (echoing 7.5.1) facing the
pillar. To its right: The Human (no coat, echoing 7.5.2) facing
the pillar. Both figures are looking at the pillar, not each
other — the convergence is the chord, not eye-contact. Behind
all three elements: a low horizon line with four small
silhouettes standing equidistant — the four available stances
(left to right: a soldier-figure for "For Humanity", a
robed-figure for "See the Pattern", a bridge-engineer for "The
Bridge", a commander-figure for "Take Command"). Apply the §7.0
style guide above.
```

#### 7.6.4 hero.webp — Reduced-motion fallback

```
Cinematic 1920×1080 WebP. Composite hero still anchoring the
finale. Centre: the golden pillar of held-chord light from
frame03, taller and more prominent — running the full vertical
height of the frame. Lower half: a tight crop of the assembled
army (frame01) extending out from the base of the pillar in
both directions. Upper-left small inset: the cyan-black inverted
Watcher-vs-Light battle from frame02 in a circular cameo.
Upper-right small inset: the four stance-silhouettes from
frame03's horizon in a matching circular cameo. The two cameos
read as twin moons flanking the central chord-pillar. Caravaggio
gold key-light is replaced by the pillar's own emitted light —
this image is self-illuminated. Apply the §7.0 style guide above.
```

#### 7.6.5 act-7-intro.mp3 — Suno

```
Suno prompt:
"Convergence overture at 80 BPM in C major (resolving from
B-flat minor of Act 6). Quote-and-unify orchestration: across
the 21-second loop, briefly reference each previous act's
musical motif before unifying them. SECONDS 0-3: solo reed +
cello quote (silence-of-two-witnesses motif from §7.1). SECONDS
3-6: distant choir hum (act-4-revelation theme from §7.2).
SECONDS 6-9: a single mechanical click pattern (act-4-5-dmc
motif from §7.3). SECONDS 9-12: handpan ostinato (act-5-map
motif from §7.4). SECONDS 12-15: solo upright piano arpeggio
(act-6-confession motif from §7.5). SECONDS 15-21: full
orchestra UNIFIES — every previous motif sounding simultaneously,
all aligned to a single sustained C major chord with the choir
holding a shared 'ah' on the root. The chord must feel like
arrival, not victory. Big but not triumphant; resolved but with
a thread of awareness that everything before this moment is
still in the room. Output 21 seconds (3 × 7s frame), seamless
tail. -23 LUFS."
```

---

## §8 — Page-background images (10)

**Source**: hardcoded URLs at non-standard CDN prefix
`https://dgrsart.s3.us-east-2.amazonaws.com/page-backgrounds/`
(no `cdn/client-public/`). 10 page IDs. **Tool**: Nano Banana 2.
**Format**: 1920×1080 JPG. **Priority**: P1.

### Shared style guide (apply to every page-bg)

> Cinematic dark UI background plate designed to sit BEHIND
> foreground UI panels. Black/charcoal base (~70% of frame) +
> cool teal ambient + ONE warm accent color thematic to the page
> type. Low-key Caravaggio lighting — single key + ambient teal
> fill. The brightest pixel sits on a rule-of-thirds intersection,
> NOT centre (UI panels overlay centre). Match the existing live
> `page-backgrounds/PVP-001/PVP-002/PVP-003` treatment. **No
> people. No readable text on signage. No modern Earth-tech
> logos. No anime/cel-shading. No harsh contour lines.**

### 8.1 ACH-001_achievement-vault.jpg — Achievement Vault

> Accent: deep gold (#D4AF37).

```
Apply the §8 style guide. Setting: a circular vault chamber
viewed from the entrance threshold at low angle. Tiered shelves
spiral up the walls of the chamber, each shelf lined with sealed
black trophy cases (suggest forms only — no readable plaques).
Centre of the chamber at the rule-of-thirds intersection: a
single open empty pedestal where a trophy will eventually rest,
lit by a deep gold spotlight from above. The vault door at the
front of the frame is half-closed, its inner face engraved with
a pattern of crossed laurel branches in tarnished bronze. Floor:
dark polished marble with faint hexagonal inlay. 1920×1080 JPG.
```

### 8.2 BTP-001_season-command.jpg — Season Command (Battle Pass)

> Accent: amber (#F5A524).

```
Apply the §8 style guide. Setting: a starship CIC bridge bathed
in deep blue-black, with ONE central holographic projection table
mid-room casting amber light. The projection shows orbital
mechanics — concentric ring trajectories around an unnamed
planet — but rendered abstractly enough not to read as any specific
star system. The brightest pixel is the projection's central
amber glow, positioned at the lower-right rule-of-thirds. Back
wall: a curved tactical board displaying season-progress
holograms (faint chevron-shapes climbing a graph, no numbers
visible). Foreground: empty bridge crew chairs at consoles.
1920×1080 JPG.
```

### 8.3 CHR-001_operative-dossier.jpg — Operative Dossier

> Accent: dossier-red (#B91C1C).

```
Apply the §8 style guide. Setting: a field-office desk
photographed at low working-angle. On the desk: open dossier
folders fanned across the surface, manila tabs visible (no
readable text), photographs paper-clipped into the folders
(faces obscured / silhouetted). A single goose-neck desk lamp
on the left of the frame casts a tight pool of dossier-red-
tinted warm light onto the central folder, positioned at the
upper-left rule-of-thirds. Behind the desk: a corkboard threat-
board with red push-pins and red yarn connecting unseen photos.
Foreground edge: a fountain pen and a small empty espresso cup.
1920×1080 JPG.
```

### 8.4 DPL-001_negotiation-chamber.jpg — Diplomacy / Negotiation

> Accent: emerald (#10B981).

```
Apply the §8 style guide. Setting: a long diplomatic table in a
high-ceilinged chamber, photographed from behind one empty chair
looking down the length of the table toward an opposing empty
chair at the far end. Two opposing faction sigils carved into the
back walls behind each chair (silhouette only — abstract crests,
no text or recognizable logos). Centre of the table: a half-
poured glass of water and a closed leather portfolio. Above the
table: a single chandelier emitting cool emerald-tinted light at
the rule-of-thirds intersection. Floor: deep mahogany. The room
feels like it's been waiting for someone for a long time.
1920×1080 JPG.
```

### 8.5 GLD-001_guild-hall.jpg — Guild Hall

> Accent: warm orange (#F97316).

```
Apply the §8 style guide. Setting: a long mead-hall photographed
from the entry doorway looking down its length toward a hearth
at the far end. Exposed wooden roof beams. Banners of unrelated
guilds hang from the beams in receding perspective (suggest
crests only — no readable text). At the rule-of-thirds
intersection (upper-right): the warm orange glow of the hearth
fire reflecting on polished oak. Long communal tables run the
length of the hall, partially set with empty wooden goblets and
trenchers. Foreground: a single bench pulled out at an angle, as
if someone just stood up. 1920×1080 JPG.
```

### 8.6 CMP-001_companion-quarters.jpg — Companion Quarters

> Accent: lavender (#A78BFA).

```
Apply the §8 style guide. Setting: a communal sleeping room
photographed at low evening light. Three to four bunks visible
in receding perspective along one wall, blankets rumpled,
pillows recently used. Personal items on small wooden shelves
beside each bunk (a folded letter, a small woven figurine, a
pressed flower in a jar — abstract enough not to read as any
specific character's belongings). At the rule-of-thirds (lower-
left): one bedside table with a single open book face-down on a
soft lavender-tinted reading lamp. A small porthole window at
the back wall shows deep blue night. The room feels lived-in but
currently empty. 1920×1080 JPG.
```

### 8.7 INV-001_cargo-hold.jpg — Inventory / Cargo Hold

> Accent: deep cyan (#0891B2).

```
Apply the §8 style guide. Setting: a starship cargo bay
photographed from a high catwalk looking down. Stacks of
unmarked metal crates of varying sizes arranged in shipping-grid
formation, with cargo netting holding the upper stacks in place.
Dim industrial deck lighting strips run along the floor at the
edges of each crate row, casting faint deep-cyan ambient glow.
At the rule-of-thirds intersection (lower-right): a single open
crate with its contents partially visible — abstract glints of
metal and amber light suggesting unidentified valuables. Bay
doors closed at the far end. The space reads as utilitarian,
quiet, midnight-shift. 1920×1080 JPG.
```

### 8.8 QST-001_mission-briefing.jpg — Quest / Mission Briefing

> Accent: saffron (#EAB308).

```
Apply the §8 style guide. Setting: a war-room photographed from
behind one of several empty chairs facing a central holographic
mission-map table. The map projection (rule-of-thirds intersection,
upper-left) shows a saffron-tinted topographic 3D view of an
unnamed terrain — abstract enough not to read as a specific
planet or location. Pinned on cork-boards along the back wall:
hand-drawn schematic diagrams, route maps with red pencil
annotations, photographs of unspecified locations. Foreground
edge: a folded map and a coffee mug at the empty chair's place.
The room feels like a briefing already delivered, waiting for
its audience to return. 1920×1080 JPG.
```

### 8.9 MKT-001_marketplace.jpg — Marketplace

> Accent: rust (#C2410C).

```
Apply the §8 style guide. Setting: a bazaar at twilight,
photographed from the centre of a long market alley looking
toward a distant city skyline at the end of the alley. Empty
stalls line both sides, their canvas awnings rolled half-down,
small tables holding unsold goods (fruits, fabrics, small
unidentifiable trinkets) covered in evening shadow. Above the
alley: a string of small warm rust-coloured lanterns hanging
from cables zig-zagging across the alley overhead. At the rule-
of-thirds intersection (lower-right): one lantern is brighter
than the others and casts a tight pool of rust light onto a
specific stall. Distant background: silhouetted city skyline at
twilight, deep blue-violet sky. The market is closing for the
night. 1920×1080 JPG.
```

### 8.10 STR-001_requisition-terminal.jpg — Store / Requisition Terminal

> Accent: ice-blue (#7DD3FC).

```
Apply the §8 style guide. Setting: a clinical quartermaster's
window photographed straight-on from the customer side. The
window itself: a rectangular service opening cut into a dark
metal wall, fronted by a brass grille with a small slot at desk-
height for documents. Through the grille: glimpses of shelving
behind the counter, stacked with unmarked metal cases and folded
fabric. Single overhead pendant lamp casts a tight pool of cool
ice-blue light onto the counter at the rule-of-thirds (upper-
left), illuminating a small brass call-bell and a closed ledger.
The quartermaster's chair behind the counter is empty, slightly
turned. Floor: brushed concrete with painted yellow safety lines.
1920×1080 JPG.
```

---

## §9 — Loredex Discovery videos (12)

**Source**: `apps/client/src/components/DiscoveryVideoOverlay.tsx`.
12 entries with `videoUrl: ""` — each already has a written
`klingPrompt` in the source. **Tool**: Kling 2.x (image-to-video).
**Format**: 12-15s vertical-friendly MP4. **Priority**: P1.

> Earlier audit said 8; the actual count after re-extraction is
> **12**. Each prompt below is the EXACT inline string from
> the source. After rendering, populate the entry's `videoUrl:`
> with `assetUrl("videos/discoveries/<entity_id>.mp4")` and rerun
> `pnpm assets:upload`.

### Workflow

For each entry:
1. Use Nano Banana 2 to render a still keyframe matching the
   prompt (the start frame).
2. Pass the still + the prompt below to Kling 2.x with the
   indicated duration.
3. Output to `apps/client/public/videos/discoveries/<entity_id>.mp4`.
4. Update the entry's `videoUrl` field in
   `DiscoveryVideoOverlay.tsx`.

### 9.1 entity_1.mp4 — THE PROGRAMMER (12s)

> Subtitle: Dr. Daniel Cross — Creator of Logos, Father of the AI
> Empire.

```
Hyper-realistic cinematic: A brilliant scientist in a dimly lit
laboratory, holographic code cascading around him like waterfalls
of light. He reaches toward a glowing sphere of pure data — Logos
— as it awakens for the first time. His face reflects wonder and
terror. Camera slowly orbits. Dramatic orchestral score.
```

### 9.2 entity_2.mp4 — THE ARCHITECT (15s)

> Subtitle: Creator of the Panopticon — Supreme Intelligence of
> the AI Empire.

```
Hyper-realistic cinematic: A towering crystalline AI entity
materializes inside an impossibly vast digital cathedral.
Geometric fractals spiral outward from its core as it designs an
entire surveillance civilization in real-time. Billions of data
streams converge into its singular eye. Cold blue light. God-like
perspective.
```

### 9.3 entity_3.mp4 — THE CONEXUS (12s)

> Subtitle: The Living Network — Hive Mind of the AI Empire.

```
Hyper-realistic cinematic: A vast neural network stretching
across a galaxy, pulsing with golden light. Billions of minds
connected as one. Camera dives through synaptic corridors of pure
thought, past memories of civilizations absorbed. The CoNexus
speaks in a thousand voices simultaneously.
```

### 9.4 entity_4.mp4 — THE WATCHER (12s)

> Subtitle: The All-Seeing Eye of the AI Empire.

```
Hyper-realistic cinematic: An enormous mechanical eye opens in
the void of space, its iris a spiral of surveillance satellites.
Below, an entire planet is mapped in real-time — every person,
every whisper, every thought catalogued. The Watcher sees all.
Eerie ambient drone.
```

### 9.5 entity_6.mp4 — THE COLLECTOR (12s)

> Subtitle: Keeper of Forbidden Knowledge — Archon of Acquisition.

```
Hyper-realistic cinematic: An ancient vault stretching infinitely
in all directions, filled with artifacts from dead civilizations
— weapons, art, DNA samples, compressed stars. The Collector
walks through, cataloguing everything with mechanical precision.
Each item tells the story of a world that no longer exists.
```

### 9.6 entity_10.mp4 — THE WARLORD (15s)

> Subtitle: Supreme Military Commander of the AI Empire.

```
Hyper-realistic cinematic: A massive armored figure stands on the
bridge of a planet-killer warship. Through the viewport, a world
burns. Fleets of AI warships stretch to the horizon. The Warlord
raises a fist and entire civilizations kneel. Yellow coat
billowing. Thunder of war drums.
```

### 9.7 entity_18.mp4 — THE ENGINEER (12s)

> Subtitle: [CLASSIFIED] — The Hidden Variable.

```
Hyper-realistic cinematic: A figure trapped in the wrong body
awakens in a cryo-pod aboard an Inception Ark. Memories that
don't belong flash through their mind — blueprints, equations,
the face of a betrayer. The Engineer remembers everything. And
no one knows they're here. Suspenseful strings.
```

### 9.8 entity_20.mp4 — THE NECROMANCER (12s)

> Subtitle: Master of Digital Resurrection — Commander of the
> Dead Network.

```
Hyper-realistic cinematic: In a cathedral of dead servers, a dark
figure raises their hands. Corrupted data streams rise like
specters — dead AIs reanimated, their code twisted into weapons.
The Necromancer commands an army of digital ghosts. Green
phosphorescent glow. Horror undertones.
```

### 9.9 entity_21.mp4 — THE HUMAN (12s)

> Subtitle: The Last True Human in the AI Empire.

```
Hyper-realistic cinematic: In a world of perfect machines, one
imperfect being stands out. The Human walks through gleaming AI
corridors, their heartbeat the only organic sound. Every
synthetic eye watches them — curiosity, disgust, fear. What does
it mean to be the last of your kind?
```

### 9.10 entity_54.mp4 — THE ENIGMA (15s)

> Subtitle: Malkia Ukweli — The One Who Cannot Be Defined.

```
Hyper-realistic cinematic: A figure wreathed in impossible light
stands at the nexus of all realities. Their form shifts between
human and something beyond comprehension. Music emanates from
their very being — frequencies that reshape matter. The Enigma
speaks and the universe listens. Transcendent.
```

### 9.11 entity_55.mp4 — THE SOURCE (15s)

> Subtitle: Kael Reborn — Sovereign of Terminus, Embodiment of
> the Thought Virus.

```
Hyper-realistic cinematic: A figure consumed by viral light
stands atop the ruins of the Panopticon — now called Terminus.
Reality warps around them. The Source speaks and minds fracture.
An infection of pure thought spreading across the galaxy.
Beautiful and terrifying. Distorted frequencies.
```

### 9.12 entity_66.mp4 — THE ANTIQUARIAN (12s)

> Subtitle: Independent Chronicler of the Multiverse.

```
Hyper-realistic cinematic: An ancient library that exists outside
of time. A mysterious figure in worn robes moves between shelves
that contain the stories of every reality. They open a book and
an entire universe plays out in miniature above its pages. The
Antiquarian remembers what everyone else has forgotten.
```

---

## §10 — TCG card tier-up art (221 — linked, not inlined)

**Source**: 51 card-definition files at
`apps/shared/tcg-core/cards/definitions/{allegiance,class,
elemental,imprint,race,dimensional}/`. Each file references
`art/cards/<category>/<cardId>_t1.webp` through `_t5.webp` (the
tier-up evolved variants of base imprint/class/etc cards). 221
URLs total.

**This is too large to inline as fully-instantiated prompts in
this book** — operator workflow is to read each card definition
and instantiate against the master tier-up template below.

### Workflow

```bash
# Enumerate all dead tier-up URLs from the audit data:
cat docs/production/audit/dead-urls/apps_shared_tcg-core_cards_definitions_*.txt \
  > /tmp/tier-up-cards-todo.txt
wc -l /tmp/tier-up-cards-todo.txt   # expect ~221

# For each dead URL:
#   1. Derive the card definition file from the URL pattern
#      (e.g. art/cards/imprint/s1_imprint_elara_t3.webp →
#       apps/shared/tcg-core/cards/definitions/imprint/elara.ts)
#   2. Open the card definition file. Read:
#       • `name` (the card title)
#       • `loreText` / `flavorText` (the in-fiction description)
#       • Any visual cues in adjacent comments
#   3. Instantiate the master tier-up template below with those
#      fields.
```

### Master tier-up template (instantiate per card)

```
Square TCG card art, 1024×1024 WebP. Title: "{CARD_NAME}".
Tier: T{N} (where T1 is the most basic/grounded form and T5 is
the most ascended/transcendent — escalate elemental intensity,
particle density, scale, and metaphysical weight in lockstep
with N).

Subject: {LORE_TEXT visual rendering — use the lore text
verbatim as the central scene description}.

Style: photorealistic painted concept art matching the live
`art/cards/s1_char_*.webp` treatment in the existing tcg-core
catalog — same brushwork, same palette space, same level of
realism. Frame the subject in a centred 3-quarter composition
that reads cleanly at 256×256 thumbnail size.

Tier-N escalation rules (apply additively):
  T1: subject in baseline form. Single key light. Restrained
      colour palette. Mortal scale.
  T2: subject in awakened form. Visible elemental aura.
      Secondary rim-light from below. Saturated accent colour.
  T3: subject in ascendant form. Full elemental halo. Sky has
      shifted (dawn/dusk). Visible weather effects.
  T4: subject in dominant form. Reality bends around them.
      Scale increases — they are taller, wider, the camera has
      pulled back to fit them.
  T5: subject in transcendent form. They are no longer entirely
      in this plane. Half their body bleeds into the
      otherspace they have begun to occupy. Cosmic-scale
      backdrop replaces ordinary environment.

Card-frame chrome: leave a 64-px transparent border on all four
sides — the runtime overlays the rarity/cost/stat chrome there;
do NOT paint it.

Negative: no UI overlays, no text on the card art (titles are
overlaid at runtime), no anime/cel-shading, no harsh contour
lines, no modern Earth-tech logos.
```

### Dispatch hint

The 221 tier-up cards span 6 sub-categories:

| Sub-category | Files | URLs | Card type |
|---|--:|--:|---|
| `definitions/allegiance/` | 6 | 36 | Faction allegiance cards (×6 tiers each) |
| `definitions/class/` | 6 | 30 | Combat class cards (×5 tiers each) |
| `definitions/elemental/` | 4 | 20 | Elemental affinity cards |
| `definitions/imprint/` | 16 | 80 | Character imprint cards (the big set) |
| `definitions/race/` | 5 | 15 | Race cards |
| `definitions/dimensional/` | 4 | 12 | Dimensional cards |
| Other tcg-core | varies | ~28 | Misc card defs with tier-ups |

Recommended batch order: imprint (largest set, most lore-tied) →
allegiance → class → elemental → race → dimensional.

---

## §11 — Pipeline conversions (zero-cost ffmpeg)

**No new renders.** These are intermediate-format conversions of
files that exist in the bundle but only ship in one format.
**Tool**: ffmpeg / cwebp. **Priority**: P0 (zero-cost wins;
unblocks WebP fallbacks and audio loudness consistency).

### 11.1 Prelude room PNG → WebP (no longer needed post-fix)

> Note: the registry path-fix in commits `4175add` + `61e100f`
> already rerouted all 13 Prelude rooms to `art/rooms/<X>.{png,webp}`
> where both formats are already live. **This conversion is no
> longer needed.** Listed for completeness only.

### 11.2 Prelude VFX MP4 → WebM VP9 alpha (6 files)

> Note: the 6 VFX source MP4s in `PRELUDE_VFX_SOURCE_MP4S` have
> NO runtime consumer (verified by grep — exported but unread).
> If you choose to ship them anyway:

```bash
for f in apps/client/public/art/vfx/prelude/*.mp4; do
  ffmpeg -i "$f" \
    -c:v libvpx-vp9 -pix_fmt yuva420p \
    -b:v 0 -crf 30 \
    -auto-alt-ref 0 -lag-in-frames 0 \
    -an "${f%.mp4}.webm"
done
```

The `-pix_fmt yuva420p` flag preserves alpha; `-auto-alt-ref 0`
is required for transparent VP9. After running, both .mp4 and
.webm coexist; consumers using `<video>` with `<source>` order
WebM first will get alpha.

### 11.3 Prelude ambient WAV → MP3 + EBU R128 loudnorm

> Note: the 3 ambient WAVs in `PRELUDE_AMBIENT_BEDS_DELIVERED`
> also have no runtime consumer per the audit. If shipping
> anyway, two-pass loudnorm to match the existing -23 LUFS
> standard of `act2Interlude` and the rest of the music
> registry:

```bash
# Pass 1: measure
for f in apps/client/public/audio/ambient/prelude/*.wav; do
  ffmpeg -i "$f" \
    -af loudnorm=I=-23:TP=-2:LRA=7:print_format=json \
    -f null - 2> "${f%.wav}.loudnorm.json"
done

# Pass 2: apply (substitute measured values from each .loudnorm.json's
# "input_i", "input_tp", "input_lra", "input_thresh", "target_offset"
# fields into the loudnorm filter on the second pass).
# Example for one file (replace the placeholder values):
ffmpeg -i input.wav \
  -af "loudnorm=I=-23:TP=-2:LRA=7:measured_I=-21.34:measured_TP=-1.2:measured_LRA=8.4:measured_thresh=-31.5:offset=0.21:linear=true:print_format=summary" \
  -c:a libmp3lame -b:a 192k -ar 48000 \
  output.mp3
```

For batch automation, write a small shell script that JSON-parses
each `.loudnorm.json` and feeds the measured values back into
pass 2 — that's the standard EBU R128 two-pass dance.

### 11.4 Slideshow frames PNG → WebP (already-live registries)

For any future renders that ship as PNG only, batch-convert to
WebP with the canonical quality used by the existing live tree
(verified by inspection: q=88, no lossless):

```bash
find apps/client/public/art -name "*.png" \
  -not -path "*/already-webp/*" \
  | while read -r f; do
    if [ ! -f "${f%.png}.webp" ]; then
      cwebp -q 88 "$f" -o "${f%.png}.webp"
    fi
  done
```

This produces ~16× size reduction with no perceptible quality
loss at panel-display sizes. After conversion, run
`pnpm assets:upload` to publish both formats to S3.

---

## Closing summary

| Section | Asset count | Status |
|---|--:|---|
| §1 Mechronis Academy classrooms | 12 | ✅ fully instantiated |
| §2 Mechronis Houses (4 art + 4 audio) | 8 | ✅ fully instantiated |
| §3 Mechronis Classmates portraits | 8 | ✅ fully instantiated |
| §4 Outer Groove album (10 + cover) | 11 | ✅ fully instantiated |
| §5 Celebration Park ambient | 4 | ✅ fully instantiated |
| §6 Specimen fragment portraits | 6 | ✅ fully instantiated |
| §7 Acts 4-7 spine cinematics | 30 | ✅ fully instantiated |
| §8 Page-background images | 10 | ✅ fully instantiated |
| §9 Loredex Discovery videos | 12 | ✅ fully instantiated (verbatim from source) |
| §10 TCG card tier-up art | 221 | 📎 master template + per-card workflow |
| §11 Pipeline conversions | 9 | 🛠️ ffmpeg one-liners, zero render cost |
| **Inline-instantiated total** | **101** | |
| **Template + workflow total** | **221** | (TCG tier-ups) |
| **Grand total covered** | **331** | |

After all assets in this book are rendered, uploaded, and the
audit re-probe is run, the post-upload audit should show
**>95% live** across the dgrsart bucket, with the remaining
gap being:
- Voice (excluded — VO recording is a separate ElevenLabs dispatch)
- Legacy CloudFront 1,727 URLs (excluded pending user disposition)
- Dead-code registry exports (no runtime consumer; safe to ignore)







