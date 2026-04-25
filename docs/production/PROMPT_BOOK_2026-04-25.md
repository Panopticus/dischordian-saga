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





