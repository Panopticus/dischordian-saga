# Chess Tutorial — Voice Over Direction

This doc briefs the voice actor(s) on the Celebration Game Master,
his Corrupted Arena counterpart, and the climb tiers.

## Two voices, one actor

The Game Master is played by one actor across two registers. The
**voice color is identical**; the delivery is different. This is
load-bearing for the narrative reveal at Gate 7 — the player has
to hear that the Arena host IS the teacher, just puppeted by the
Architect's operators.

### Celebration (tutor register)

- **Reference:** Mr. Shaibel in *The Queen's Gambit* (1983–88 scenes).
  Unhurried, amused at his own jokes, never rushed. Sentence
  pauses are long. Semicolons, em-dashes, and self-interruptions
  are honest — play them as the real pauses of a patient teacher.
- **Cadence:** close to spoken prose. Do not performative.
- **Key word:** warm, not sentimental.
- **The dread beats (G1–G6 outros, each marked `_dread`)** should
  fall out of the warm register by a single step — a breath in
  the wrong place, a sentence that self-corrects, a noticing of
  something the character would prefer not to notice. Do NOT
  signal dread with ominous delivery; the disquiet is in the
  words themselves. Read them as warmly as the rest, and let the
  listener notice.

### Corrupted (Arena host register)

- **Reference:** the Front Man in *Squid Game* + a 1980s quiz-show
  host run through a slight filter. Loud, cheerful, wrong.
- Same vocal color as the tutor. Same pitch range. The difference
  is **intentional performativity** — the lines are scripted and
  the speaker is aware they are scripted.
- ALL-CAPS words in the copy are EMPHASIZED LANDINGS. Read them
  like commercial-break reveal points.
- **The bleed-through cues** (marked in the Arena encounter scenes)
  snap back to the Celebration register mid-sentence. Treat them
  as a live signal leak — the delivery is mid-stream, incomplete,
  and immediately cut off. The actor should practice the transition
  as a single breath.

## Reference tracks (one per actor)

When the actor records sample lines, collect one reference track
at this file path per mood:

- `/audio/chess_tutorial/reference/<actor_slug>_warm.mp3` — tutor
- `/audio/chess_tutorial/reference/<actor_slug>_menacing.mp3` — Arena
- `/audio/chess_tutorial/reference/<actor_slug>_guarded.mp3` — dread-beat

## Per-clip direction table

The `listChessTutorialVoiceCues()` helper in
`apps/shared/tcg-core/story/chessTutorial.ts` produces the full
manifest of audio clip ids. For this release we call out the
emotionally critical clips explicitly:

| audioClipId | register | mood | one-line direction |
|---|---|---|---|
| `vo_gm_chess_g1_intro_03` | Celebration | curious | Warn the student that the Arena version isn't this version. Subtext: "I am preparing you for my own ghost." |
| `vo_gm_chess_g1_outro_dread` | Celebration | guarded | Breaks mid-sentence on "—who were my students." Tense correction lands at "it is hard to keep the tenses straight here." |
| `vo_gm_chess_g2_outro_dread` | Celebration | guarded | Two self-corrections in a row: "the position I died in, once" → "the position I TAUGHT FROM, that year." Let the first slip hang for half a beat. |
| `vo_gm_chess_g3_outro_dread` | Celebration | guarded | "The door is — the door is that way. Behind you." He looks over his shoulder; the sentence collapses. |
| `vo_gm_chess_g4_outro_dread` | Celebration | warm | The Prince reference. First explicit mention of the student who beat him. Delivery should be ALMOST at ease, almost. |
| `vo_gm_chess_g5_outro_dread` | Celebration | guarded | His hand passes through a piece. The line stops mid-demonstration and resumes. Neither character names it. |
| `vo_gm_chess_g6_outro_dread` | Celebration | cryptic | "There is a version of you who already finished this course." This is the first time he acknowledges the recursion. Read flat, not spooky. |
| `vo_gm_chess_g7_outro_id_01..04` | Celebration | varies | The identity reveal. Four cues: archon, builder, quote canon, games-shape-reality. He is tired but finally honest. |
| `vo_gm_chess_g7_outro_dr_01..03` | Celebration | guarded | The death reveal. "I am not a tutorial ghost" is the load-bearing line. Land it flatly, like a diagnosis. |
| `vo_gm_chess_g7_outro_profile_1` | Celebration | cryptic | "I have been watching you the whole time." This is the first "I see you" beat. Do NOT lean menacing. He is a teacher reporting an observation. |
| `vo_gm_chess_g4_5_intro_04` | Celebration | guarded | "I have replayed this game seven thousand times. I am about to lose it again." Read as grief disguised as patience. |
| `vo_gm_chess_g4_5_outro_03` | Celebration | guarded | "He was the only student who ever beat me. He was the only student I ever wanted to beat me." The two sentences are the same sentence. |
| `vo_gm_arena_*` (all Arena clips) | Corrupted | menacing | Game-show host register. ALL-CAPS words are landings. Laughter is scripted; commit to it. |
| `vo_gm_climb_t3_pre_02` | Celebration | warm | The keepsake bleed-through fills the chamber at Tier 3. "I am cheerful for the first time in seventeen thousand years." |

## Quote pairings

Lines that contain both a real-history citation and a lore
citation (e.g. G7 identity cue 3: "Sun Tzu … and the Iron Lion
at Kael's bridge") should pause infinitesimally between the two
citations. Not a full beat — a breath. The pause lets the
listener register that the pairing is deliberate.

## What not to do

- **No whispering during the dread beats.** The wrongness is in
  the words, not the delivery.
- **No laughter leaking into the tutor register.** The warm voice
  is amused; he does not laugh aloud. Laughter belongs only to
  the corrupted register, where it is scripted.
- **No accent shifts between registers.** Same actor, same accent,
  same vocal color throughout.

## Pipeline

Files land at `/audio/chess_tutorial/<audioClipId>.mp3`. The
server's `listChessTutorialVoiceCues()` helper walks every gate
(including Gate 4.5 and the Climb scenes) and populates the
memory-resin bank from the union. New cues added after this
direction doc ships automatically get slots; they just need the
audio dropped at the matching path.
