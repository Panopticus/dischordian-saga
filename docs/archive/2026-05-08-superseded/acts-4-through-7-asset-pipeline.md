# Acts 4 / 4.5 / 5 / 6 / 7 — Asset Pipeline

Status tracker for the five spine-closing acts' audio + visual
assets. All code wiring is live — dropping files at the paths
below lights them up with no additional changes.

## Status at a glance

| Bucket | Count | Status |
|---|---|---|
| Act openers — audio (ambient bed) | 5 | ⏳ External pipeline |
| Act openers — image frames (3 per act + reduced-motion hero) | 20 | ⏳ External pipeline |
| Act 4 Prisoner chapter VO (per-chapter intro + extraction lines) | ~8 | ⏳ External pipeline |
| Act 5 Cades FPS narration (7 missions × 2-3 lines each) | ~20 | ⏳ External pipeline |
| Act 5 Bridge of Kael post-credits VO | ~3 | ⏳ External pipeline |
| Act 6 confession VO (both confessions + 4 stance reactions) | ~14 | ⏳ External pipeline (already authored in `narrativeActs.ts`) |
| Act 7 convergence VO (final stances + closing line) | ~10 | ⏳ External pipeline (already authored) |
| Eyes whispers — auxiliary sector pass (5 new lines) | 5 | ⏳ External pipeline |

Everything ships with graceful fallbacks: reduced-motion text +
Lucide icons + silent-audio stubs. Pages are playable without any
of the bytes below.

---

## Act-opener slideshows (5 acts)

Each act's opener is a three-frame cinematic authored in
`apps/shared/songSlideshows.ts`. Every slideshow ships:
- `audioUrl: /audio/acts/act-N-intro.mp3` (one ambient bed per act)
- 3 image frames at `/art/cinematics/act-N-*/frameNN.webp`
- A `reducedMotionFallback.heroImageUrl` at `/art/cinematics/act-N-*/hero.webp`
- `flagsSetOnComplete` matching the completion gate's required flag

### Act 4 — The Revelation

**Audio**: `/audio/acts/act-4-revelation-intro.mp3` — 21 seconds, low
slow cello under a distant held breath. Narrator-voice optional
(reduced-motion fallback carries the prose). Tone: interrogation
room quiet. No music stings.

**Art** (`/art/cinematics/act-4-revelation/`):
- `frame01.webp` — Prison cell door, dim blue emergency lighting, a
  mirror where the observation window should be. Kael's silhouette
  faintly visible in the mirror's reflection (not in the cell).
- `frame02.webp` — Inverted Collector's Arena, empty seats, a single
  spotlight on the center ring. The ring itself is a memory palace
  — a hand-drawn map of Kael's childhood neighborhood burning in
  slow motion around the edges.
- `frame03.webp` — Kael's hands palms-up in surrender, a list of
  seventy-three names inked across the forearms, fading.
- `hero.webp` — Composite: cell door + mirror + the list of names.

### Act 4.5 — Dead Man's Circuit

**Audio**: `/audio/acts/act-4-5-dmc-intro.mp3` — 21 seconds, racing
engine warming up + dealer shuffling cards, both heard at half
volume through a wall. Identity-wager tone: neutral, curious,
doom-adjacent.

**Art** (`/art/cinematics/act-4-5-dmc/`):
- `frame01.webp` — Bone-and-chrome racetrack winding through a void
  field. Tail lights trail into darkness. One kart on the starting
  line. The driver's helmet has no visor — just a name-tag slot,
  blank.
- `frame02.webp` — The Degen Casino: a circular table lit from
  below, entropy symbols on every card face, a dealer in a dark
  hood whose hands are visible and whose face is not. Piles of
  chips, each embossed with a word: STUDENT / SEEKER / DETECTIVE /
  THE LAST.
- `frame03.webp` — Four silhouettes of the same person, each
  slightly different — the identity chain. Only one remains
  illuminated.
- `hero.webp` — Kart on the track + casino table composite.

### Act 5 — The Reckoning

**Audio**: `/audio/acts/act-5-map-intro.mp3` — 21 seconds, Kael's
voice reading coordinates from a ration wrapper, low and hoarse.
Iron Lion's transmission fading in at 14s ship-time. Final beat:
a single gunshot far away.

**Art** (`/art/cinematics/act-5-map/`):
- `frame01.webp` — Ration wrapper on a table, Kael's handwriting
  on the back listing five sectors + twenty worlds in small dense
  columns. Dim red flashlight.
- `frame02.webp` — Iron Lion in silhouette on the bridge of a ship,
  broadcast antenna above him, the Cades approach visible through
  the window.
- `frame03.webp` — Veridian VI from orbit, one green forest seen
  through a break in the cloud cover.
- `hero.webp` — Map composite + Iron Lion silhouette.

### Act 6 — The Confession

**Audio**: `/audio/acts/act-6-confession-intro.mp3` — 21 seconds,
Elara and The Human speaking softly in different rooms — heard
through a shared wall. A third presence breathing under both
signals. Tone: unguarded. First honest silence of the spine.

**Art** (`/art/cinematics/act-6-confession/`):
- `frame01.webp` — Elara's narrator portrait in full resolution for
  the first time. Her face is no longer fractal / flickering; she
  is a woman, specifically, with the grief of having been human.
- `frame02.webp` — The Human's trench coat hanging over a chair.
  His badge is on the table. A glass of water, half full.
- `frame03.webp` — A third chair at the table. Empty. But the
  glass next to it has a lip mark.
- `hero.webp` — Three chairs, two occupied (Elara / Human), one
  empty but recently used.

### Act 7 — The Convergence

**Audio**: `/audio/acts/act-7-convergence-intro.mp3` — 21 seconds,
Elara and The Human's voices align on a single sustained chord for
the first and only time in the spine. Chord is held through the
entire bed. Final beat: brief silence, then a held indrawn breath.

**Art** (`/art/cinematics/act-7-convergence/`):
- `frame01.webp` — Wide shot of the assembled army across five
  sectors, rendered as a single aerial composite — insurgents,
  Authority defectors, Dreamer's Shield survivors, Antiquarian
  scholars, Free Ports smugglers — all facing the same direction.
- `frame02.webp` — Two visible-war / invisible-war diagram, hand-drawn
  chalkboard-style: on one side, faction lines; on the other, a
  shape labeled "Watcher" that the player can see but the narrators
  cannot.
- `frame03.webp` — Four stance icons (FOR HUMANITY / SEE THE PATTERN /
  THE BRIDGE / TAKE COMMAND), each in its own quadrant. Player
  cursor floating between them.
- `hero.webp` — Army composite + stance icons.

---

## Act-specific VO batches (beyond the openers)

### Act 4 Prisoner chapters (~8 lines)

See `apps/shared/actsFourFiveShells.ts` ACT_4_PRISONER_CHAPTERS.
Each chapter ships an `openingLine` — four chapters, one line each.
Plus post-match Kael memory-extraction lines (one per chapter, four
more). Total ~8.

- Voice: Kael, broken-and-recovering. Low register. The Prisoner
  persona — neither the Warlord nor the Engineer, the thing
  between.
- Host at `/audio/act4/prisoner-{chapter}.mp3` +
  `/audio/act4/extraction-{chapter}.mp3`.
- Audio URL stubs exist in the data shell.

### Act 5 Cades FPS (~20 lines)

See `apps/shared/actsFourFiveShells.ts` CADES_FPS_MISSIONS. Seven
missions, each with a pre-mission brief (Iron Lion), mid-mission
callout, post-mission debrief. M5 has the forced partial loss
("you will feel it") and M7 has Iron Lion's final transmission.

- Voices: Iron Lion (Cades command), Agent Zero / Vex Solène
  (M6 recruitment reveal).
- Host at `/audio/act5/cades-m{N}-{phase}.mp3`.

### Act 5 Bridge of Kael post-credits (~3 lines)

`apps/shared/actsFourFiveShells.ts` BRIDGE_OF_KAEL_POST_CREDITS.
Fires once when `kael_questline_complete` + `returned_to_bridge_post_kael`
both hold. Three beats: the console activating, the Engineer's
Dischordia card appearing, the closing line.

- Voice: The Engineer (one final time; the same voice bank used in
  the Engineer Recordings, not the Prisoner).
- Host at `/audio/act5/bridge-of-kael-{1,2,3}.mp3`.

### Act 6 confession content (~14 lines)

Already authored in `apps/client/src/data/narrativeActs.ts`
ACT_6_THE_CONFESSION. Elara's confession (5 lines), The Human's
confession (5 lines), 4 stance reactions. All `vo*AudioUrl` refs
point at `/vo/act6/*.mp3`.

- Voices: EngineerZero (Elara), TrenchCoat (The Human).

### Act 7 convergence content (~10 lines)

`narrativeActs.ts` ACT_7_THE_CONVERGENCE. Army status narration +
4 final stance reactions + closing line ("I've been waiting a very
long time to say that to someone"). All refs under `/vo/act7/`.

- Voices: both narrators, aligned on the closing line for the
  first time — production note: record separately, mix to a single
  sustained chord in post.

---

## Eyes whispers — auxiliary sector pass (5 new lines)

Added in this batch (polish item 2). Paths authored on-sector via
GALACTIC_MAP `eyesNarrator` strings:

- `abyssal_sectors` — 4 sentences, cold register
- `syndicate_route_prime` — 4 sentences, conspiratorial
- `command_post_iron` — 4 sentences, respectful
- `atarion_ruins` — 5 sentences, nostalgic
- `tidewater_archive` — 3 sentences, dry

Voice: same register as the 15 PR #138 whispers — female-Bond,
confident, Asian formal precision. Generate with
ElevenLabs preset "TheEyes" (seed from the 15-line manifest in
PR #138). Host at `/audio/act3/eyes-whisper-{sectorId}.mp3`.

---

## Verification

Drop a file; reload the page; the corresponding surface lights up.
Vite dev server serves `apps/client/public/` statically — no build
step required.

```bash
# Smoke-test any asset path the client references
curl -sI http://localhost:5173/audio/acts/act-5-map-intro.mp3 | head -1
curl -sI http://localhost:5173/art/cinematics/act-6-confession/frame01.webp | head -1
```

---

## Tracking

- ✅ All five act openers have slideshow defs + trigger entries +
  completion-gate wiring (commit `40ef201`).
- ✅ Art prompts for all 20 act-opener frames live in this file.
- ✅ Eyes whispers expanded to 20 sectors (commit `60160ba`).
- ⏳ MP3 + WebP generation is external per the shared-asset
  pipeline convention. No code changes needed when the bytes land.
- ⏳ Extended VO per-act batches (Act 4 Prisoner chapters, Act 5
  Cades missions, Act 6/7 confession + convergence) follow the
  existing `apps/client/public/audio/act-N/` directory convention.

See also `docs/production/act2-asset-pipeline.md` for the Act 2
equivalent tracker + directory layout precedent.
