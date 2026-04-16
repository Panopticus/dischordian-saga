# ACT 1 SHIP-READY STRUCTURE BIBLE — Dischordian Saga

Companion to `PRELUDE_SHIP_READY_BIBLE.md`. Locks the production
structure for Act 1 — the twelve-match memoir the Engineer tells
through the card game, plus the Two Witnesses Part 2 scene that
closes the act.

**Status:** skeleton (October 2026). Opponent data shell exists at
`apps/shared/act1Opponents.ts`; narrative beats exist at
`apps/client/src/data/narrativeActs.ts:78–372`. This doc formalizes the
Prelude-handoff contract, the three-cycle structure, and the per-
opponent production slots so art / voice / cutscene pipelines can
start shipping concurrently.

Sections 3–5 are intentionally sparse in this revision — the
canonical opponent backstories already live in
`apps/shared/act1Opponents.ts` as the authoritative source. Per-
opponent art prompts, voice CSVs, and victory/defeat slideshow
bindings land in subsequent revisions.

---

## Section 0 — How to Use This Doc

**Style anchor.** Same §0 conventions as
`PRELUDE_SHIP_READY_BIBLE.md`:

- Art prompts target Nano Banana 2 at 1920×1080 with
  deep-space-black `#010020` base + cyan `#22d3ee` accent.
  Match the Prelude's cinematic still grammar (no rendered
  text, volumetric fog at ankle height, film grain,
  anamorphic lens flare on the brightest element).
- Cutscene videos target Seedance 2.0 at 24fps with a
  single continuous camera move and one dominant visual
  idea per shot.
- VO targets ElevenLabs at the voice profile specified in
  `docs/production/VOICE_OVER_BIBLE.md`. CSV import for
  lines ≤ 30s; Studio Projects for longer continuous takes
  (see the Log 5 precedent at
  `docs/production/prelude-asset-build/prompts/voice/log5/`).
- Every asset path in this doc is relative to the repo root.
- Canonical authority: `apps/shared/act1Opponents.ts` is the
  data shell; `apps/client/src/data/narrativeActs.ts` is the branching
  dialog tree; this Bible is the connective tissue between
  them and the production pipelines.

**Canon cross-references** (keep open while writing Act 1 content):

- `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` §4.2–§4.5
  — canonical three-cycle structure and opponent roster
- `docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md` — Warlord
  retcon, Two Witnesses Part 2 hygiene rules, and Act 1 Vex
  non-appearance rule
- `docs/production/PRELUDE_SHIP_READY_BIBLE.md` — pattern source
  for per-beat sections; Beat J's Archives scene is the direct
  lead-in to Section 6 below
- `docs/production/VOICE_OVER_BIBLE.md` — voice profiles for
  every returning Prelude character plus the four new Act 1
  speakers (Little Meme, Little Collector, Little Watcher,
  Professor Eidola, Professor Matrikala)

**Canon hygiene rules** (enforced across every Act 1 scene):

1. **Vex Solène does not appear in Act 1.** She is in the swarm
   the Warlord wears at Nexon and the player may *feel* her at
   the edges, but no face, no voice, no name. Her full reveal
   is Act 3+ per Canon Rev 7.
2. **Malkia Ukweli's civilian name is privately addressed
   only.** Public framing stays "the Enigma" through Act 2.
3. **The Oracle is referenced, never shown.** Every reference
   treats him as diagnosis, not prophecy.
4. **The Warlord is canonically a weaponized nanobot swarm,
   not a person.** Any Act 1 dialog that frames her as
   "corrupted innocent" is canon drift — see Canon Rev 7 §1.6.

---

## Section 1 — Act 1 Master Index

Twelve scripted card battles in three cycles, plus a cutscene
landing. The canonical act1Step values (1–12) lock the play order;
cycle finale slideshows are already bound in the data shell.

### 1.1 Cycle A — Kindergarten of Gods (§4.3)

The Engineer's childhood classroom. Three battles. Each opponent
is the proto-form of a figure the player will meet in full force
later in the game. The cycle finale fires the `welcome-to-
celebration` slideshow.

| # | id | Opponent | Deck leaning | Finale slideshow |
|---|---|---|---|---|
| 1 | `little_meme` | Little Meme | thought_virus, neutral | — |
| 2 | `little_collector` | Little Collector | new_babylon, neutral | — |
| 3 | `little_watcher` | Little Watcher | architect, neutral | `welcome-to-celebration` |

### 1.2 Cycle B — Mechronis Academy (§4.4)

The Engineer's Academy years. Five battles. Two professors, two
peers, one visiting fellow. The cycle finale fires the
`to-be-the-human` slideshow.

| # | id | Opponent | Deck leaning | Finale slideshow |
|---|---|---|---|---|
| 4 | `the_detective_student` | The Detective (student years) | neutral | — |
| 5 | `iron_lion_expelled` | Iron Lion (the day of his expulsion) | insurgency | — |
| 6 | `professor_eidola` | Professor Eidola | architect | — |
| 7 | `professor_matrikala` | Professor Matrikala | neutral | — |
| 8 | `the_seer_visit` | The Seer (visiting fellow) | neutral | `to-be-the-human` |

### 1.3 Cycle C — Nexon / Zenon / Last Words (§4.5)

The Engineer's war, trial, and execution. Four battles.
Including one against the Warlord's first war-deck deployment
(the canonical Battle of Nexon) and one against the not-yet-
split Game Master. The final match's cutscene (`last-words`)
is the Act 1 landing.

| # | id | Opponent | Deck leaning | Finale slideshow |
|---|---|---|---|---|
| 9 | `the_warlord_zero_first` | Warlord Zero (at the Battle of Nexon) | architect, new_babylon | `hacking-reality` |
| 10 | `the_programmer` | The Programmer | neutral | — |
| 11 | `the_game_master_original` | The Game Master (before the execution) | thought_virus, neutral | — |
| 12 | `the_authority` | The Authority | architect | `last-words` |

### 1.4 Per-opponent production slots

Each of the twelve opponents in the sections below will eventually
land with the following production fields, mirroring the Prelude
Bible per-beat structure:

- **Pre-match matchup-card art** (Nano Banana 2 prompt)
- **Pre-match VO line** (existing field `preMatchLine`)
- **Deck composition** (card list matching `deckLeaning`)
- **Victory cinematic / slideshow** (if finale position)
- **Defeat cinematic / slideshow** (if finale position)
- **Post-match narrative beat** (existing fields
  `postMatchWin` + `postMatchLoss`)
- **Flags set on completion** (narrative consumption by
  Acts 2–5)

The narrative fields (`backstory`, `preMatchLine`,
`postMatchWin`, `postMatchLoss`) are **already authored** in
`apps/shared/act1Opponents.ts` and should be read as canonical
source, not rewritten here.

---

## Section 2 — Act 1 Narrative Structure

### 2.1 The memoir frame

Act 1 is the Engineer's autobiography told through twelve card
matches. The player isn't fighting strangers — they're replaying
the most formative matches of a dead man's life, from his
childhood classroom to his execution. Every match is a memory
the Engineer chose to preserve in the deck; losing a match is
still canonical (his life survives the loss), but winning lets
the player feel the moment the way he wanted it felt.

The memoir frame has two consequences for every Act 1 scene:

1. **The Engineer is the narrator, not a character on screen.**
   His voice colors the pre-match / post-match beats. He can
   comment on his own past. Sample voice: dry, precise, warm
   about the people he loved, exact about the people he didn't.
   Same register as the Prelude's Beat E flashbacks.
2. **Every opponent is already dead or long gone from the
   Engineer's life by the time the player meets them here.**
   The emotional weight is nostalgia inflected by what the
   player knows from the Prelude — the Engineer's Log 5
   farewell names Kael, the Detective, and the Enigma, and
   three of Act 1's opponents are *these people young*.

### 2.2 The three cycles

| Cycle | Location | Ages | Narrative beat |
|---|---|---|---|
| **A — Kindergarten of Gods** | The schoolyard | 6–8 | Before any of them know what they'll become. Each opponent is a proto-form of a later cosmic figure (Meme, Collector, Watcher). The Engineer learns the Deck by losing to children. |
| **B — Mechronis Academy** | The Academy | 18–22 | The Engineer meets the Human (student Detective), watches Iron Lion walk out, learns the calibration arts, and plays one match against the Seer. The Academy is where he almost becomes safe. |
| **C — Nexon / Zenon / Last Words** | The war, the trial, the cell | 40 | The Warlord's first deployment breaks the line. The Engineer's trial. The execution that wasn't. Act 1's landing is the same song that landed Beat J — *Last Words* — but now the player knows what was said into the compartment before the song was written. |

Each cycle is a three-to-five-battle arc with a finale cutscene.
Cycle A resolves on `welcome-to-celebration` (the Empire already
has a grip on the kids). Cycle B resolves on `to-be-the-human`
(the Detective / Human is canonically born in that shot). Cycle
C resolves on `last-words` (the Engineer's execution is suspended
by a single card — the one that gets handed to Malkia Ukweli).

### 2.3 The THE_SIGNAL interleave

Act 1 isn't pure card battles. The `ACT_1_THE_SIGNAL` narrative
tree at `apps/client/src/data/narrativeActs.ts:78–372` interleaves with
the cycles as ambient story moments in the Comms Array, Bridge,
Archives, and Engineering rooms:

- **Trigger:** Player enters the Comms Array after the Prelude's
  Beat H introduced Locke's first transmission. THE_SIGNAL
  picks up the same signal thread — this time The Human is on
  the other end, whispering through the substrate layer.
- **Two canonical branches:**
  - **Path A — Tell Elara immediately.** Elara learns of the
    Human's presence on the player's terms. She is guarded but
    not betrayed; cooperation stays intact through Act 1.
  - **Path Secret — Keep the Human hidden.** Elara will
    eventually discover the contact. Whether she discovers it
    via confession (`elaraDiscoveryPath: "told"`), accidental
    exposure (`"discovered"`), or being outright lied to
    (`"betrayed"`) changes the relational weight of every
    subsequent Elara scene in Acts 1–3.
- **Integration rule.** THE_SIGNAL nodes fire between specific
  card-cycle boundaries — not during a match, never overlapping
  a cutscene. Cycle A resolves → early THE_SIGNAL nodes open;
  Cycle B start → branch gate closes (the player has either
  told Elara or they haven't); Cycle C plays out on whichever
  branch the player is on.

### 2.4 The Meme's Show interleave

The Meme isn't just Opponent 1. Across Act 1 the Meme is also
a running 4th-wall-breaking **broadcast** about the Engineer —
six episodes titled *"The World's Smartest Man,"* already
canonized in `apps/shared/memeEngineerShow.ts`. Each episode
drops between specific card-cycle boundaries; together they
are the slow reveal of who the Engineer actually was, building
toward the Authority match and the full *Last Words* landing
in §5.8.

**Trigger re-homing (restructure note).** The manifest file
as shipped gates each episode on an `engineer_recording_N_
discovered` flag from the Epoch 0 holo-recording system, which
pre-dates Act 1's cycle structure. In Act 1 the trigger layer
is match-completion boundaries, not free-exploration flag
discovery; the runtime implementation will fire each episode's
unlock alongside the boundary flag the ladder already sets
(`act1_step_N_complete`). The episode content does not change
— only the trigger shape does.

**Episode → match-boundary mapping.** Broadcast order matches
the canonical episode order. Drops fall on **even** match
boundaries so the six episodes spread evenly across the 12-
match ladder:

| After match | Opponent | Cycle | Episode unlocks | Why here |
|---|---|---|---|---|
| Match 2 | `little_collector` | A | Ep 1 *"The Kid With the Coat"* | Player just fought a classmate of the Engineer; Meme introduces him as the prince who wasn't supposed to be at the school |
| Match 4 | `the_detective` (student) | B | Ep 2 *"Gary's Goggles"* | Player just fought another fellow student; Meme reveals what the Engineer saw through Gary's goggles (Celebration was a death loop) |
| Match 6 | `prof_eidola` | B | Ep 3 *"The Ghost Network"* | Player just fought a professor who knew him; Meme reveals how the Engineer used the Eyes to erase his Celebration classmates from Empire records |
| Match 8 | `the_seer` (Cycle B finale) | B→C | Ep 4 *"The Day He Stopped Fixing"* | The Seer foretold the deaths of the Eyes and the Oracle; Meme delivers the flashback of both deaths, the pacifist's break |
| Match 10 | `the_programmer` | C | Ep 5 *"Dispatched"* | Player is on Zenon now; Meme unpacks the Agent Zero betrayal — *"six words. Three of them are a lie"* — the backstory of the Warlord match they just lived through |
| After Match 12 | `the_authority` | C | Ep 6 *"The World's Smartest Man"* | Act 1's final Meme landing; plays after the *Last Words* full song, after the verdict. *"He's dead now. Really dead. Not hiding-dead. Not transferred-dead."* The Meme closes the show. |

**Placement inside the cycle transitions.** Each episode fires
on the **post-match outro beat**, between the defeated
opponent's `postMatchWin`/`postMatchLoss` line (from
`apps/shared/act1Opponents.ts`) and the next matchup card
reveal. The player sees the opponent's final line → receives
their XP/Dream reward from the match → then the Meme's show
splash plays. The episode itself is a short self-contained
cutscene using the existing Meme-narrated audio + the
`memeIntro` / `memeOutro` fields verbatim.

**Skip / replay.** Episodes are fully skippable on a per-
episode basis (same pattern as Prelude cutscenes — hold-to-
skip affordance with 0.8s fill). They are also replayable
from the Transmissions log at any time, so a skipped episode
is never lost. The Transmissions log is where Epoch 0
originally housed these; in Act 1 they simply unlock into the
same log earlier, via match boundaries rather than Prelude
discovery.

**Canon tie-ins.**
- The six episodes are the player's primary Act 1 education
  about the Engineer's pre-crew life — the Celebration
  experiment, the Ghost Network, the Eyes-and-Oracle
  partnership, and (in Ep 5–6) the betrayal at Zenon. Without
  this interleave the Authority match is just a match; *with*
  it, the verdict carries the weight of everything the Meme
  has spent the Act narrating.
- Episode 6 is the intentional thematic twin of the full
  *Last Words* song. The song is the Engineer's voice; the
  Meme's closing show is the Engineer's **witness**. Both
  land back-to-back at the Act 1 close (§5.8.1 then §5.9 /
  §6 transition).
- Little Meme's Cycle A match (Opponent 1) is still the
  player's first confrontation with the Meme as a character
  — the show's existence is not revealed until Ep 1 lands,
  so the broadcast is a retroactive reframing of that
  opening match (*"I stole his notebook in Year 3. I'm not
  apologizing. That notebook became the Deck. You're
  welcome."*)

**Completion flag:** the full interleave-complete flag is
`act1_meme_show_complete`, set when Ep 6 is viewed (not
skipped — skipping still sets the flag; the flag measures
*unlocked*, not *watched*). Acts 2+ use this flag for dialogue
gates where characters reference the show (e.g., Vex Solène
in Act 2 recognizing the Meme-coined phrase *"Dispatched."*).

### 2.5 Morality and alignment carry

**Restructure note — the alignment choice is no longer a
Prelude output.** Before the October 2026 Last Words
restructure the Prelude's Beat J captured a Light/Dark
choice that seeded Act 1's starting `moralityScore` at ±15.
After the restructure the canonical alignment moment is
§5.8.1 (the Authority finale, set *during* Act 1), so Act 1
no longer has a starting alignment position — it has a
starting *score* that accumulates toward the §5.8.1 choice.

**Act 1 starts morality-neutral.** `moralityScore` begins
at 0. Act 1's per-choice deltas (Path A vs Path Secret
branches, opponent pre-/post-match dialogue picks, Cycle C
Warlord and Programmer beats) are the only things that move
it during Act 1. The Prelude's `preludeCompletedFlags` still
feed dialogue flavor — e.g., whether the player read Kael's
memo — but do not offset the score.

**How the accumulated score matters at §5.8.1.**
- The Authority match's *framing* and the memoir narrator's
  inter-scene voice-over read differently depending on
  whether the player arrives at the trial with a warm
  balance (`moralityScore > +20`), a cool balance (< −20),
  or near neutral. Framing, not outcome — both Light and
  Dark are fully selectable at any cumulative score. The
  score is narrative texture; the choice is the player's.
- The `ChoicePillarLightDark` UI in §5.8.1 does not lock or
  pre-select based on the score. Every Act 1 player sees
  both pillars, regardless of how they played.

**Forward carry.** From §5.8.1 onward, `lightDarkAlignment`
(stored on `GameState` per PR #60) is the canonical
alignment field. Acts 2+ consume it. `moralityScore` also
keeps accumulating past Act 1 and continues to modulate
atmosphere per Canon Rev 7 §5.1 through the rest of the
game.

**No softlocks either direction.** Any cumulative Act 1
morality ledger is winnable to both alignments. A player who
goes full Path-Secret-`betrayed` can still pick Light at
§5.8.1; a full Path-A Light-leaning player can still pick
Dark. The doors are heavier, not closed.

### 2.6 Prelude → Act 1 handoff contract

Every piece of Prelude state Act 1 reads from GameContext.
After the October 2026 Last Words restructure, **the Prelude
does not hand Act 1 an alignment** — the canonical Light/Dark
choice fires in §5.8.1 and is written *during* Act 1, not
before it. The Prelude still hands Act 1 a completion-flag
set, the THE_SIGNAL branch seed, and mission/memo/recipe
state:

| Field | Source | Act 1 consumption |
|---|---|---|
| `preludeCompletedFlags` includes `cutscene_archives_two_witnesses_part1_complete` | Beat J completes (tease of Last Words) | Required to unlock the §5.8.1 full-song cutscene AND the Section 6 "Two Witnesses Meet Part 2" cutscene trigger |
| `preludeCompletedFlags` includes `prelude_burnt_card_found` | `burnt_card` crew mission | Required to unlock Act 1 at all — this is the Prelude's ship-complete gate |
| `humanContactMade` | Beat H Locke inbox + Beat C.5 whisper | Branches THE_SIGNAL entire event tree |
| `humanContactSecret` | Set on every Path-Secret choice | Feeds `elaraDiscoveryPath` at the branch-close gate |
| Beat D mission-board posting reads | `mission_board_read_kelvara` + two others | Locke offers whichever three the player read, in order |
| Kael Contingency Memo bullets | Beat F (`beat_f_memo_read`) | Referenced in Cycle C pre-Nexon dialogue; the memo's third bullet ("assume I am next") lands as a prophecy the player has now seen fulfilled |
| Engineer's sandwich recipe | Beat D.5 Galley | Unlocks the Galley optional quest Act 1 side-content per Canon Rev 7 §5.6.13 |

**Not handed over (intentional):** `lightDarkAlignment`
starts as `null` at Act 1 entry. Acts 2+ read this field;
it is written exclusively by §5.8.1's `ChoicePillarLightDark`.

### 2.7 Act 1 → Acts 2+ forward-writes

State Act 1 sets that later acts consume:

| Field | Source | Consumer |
|---|---|---|
| `lightDarkAlignment` | §5.8.1 `ChoicePillarLightDark` | **Canonical alignment for the entire game** — every post-Act-1 dialogue branch, every faction allegiance test, the Act 5 Post-Credits reprise frame |
| `act1_meme_show_complete` | Ep 6 of the Meme's Show interleave (§2.4) | Gates dialogue beats in Acts 2+ where NPCs reference the broadcast (Vex Solène's Meme-phrase recognitions, the Authority's Act 4 callback) |
| `elaraDiscoveryPath` | Path-Secret branch-close | Act 2 Elara scenes; affects Act 3 Thought Virus meter calibration |
| `narrativeActChoices` appended | Every Act 1 branch | Recorded for Act 5 Post-Credits "this is what you chose" reprise |
| Opponent defeat/loss flags | Every card match | Deck composition defaults Act 2 fight mode selects from |
| Trade Empire faction-first-contact flag | If player accepts any of Locke's three jobs | Opens the Trade Empire mid-game pillar in Act 3 |
| `moralityScore` | Every Act 1 choice | Drives atmosphere-mapping from Canon Rev 7 §5.1 through the rest of the game |

---

## Section 3 — Cycle A: Kindergarten of Gods (§4.3)

### 3.1 Cycle purpose

Three matches. The Engineer is six to eight years old. None of
the children he plays against know they will become anything
larger than children. The player, having finished the Prelude,
knows all three are proto-forms of cosmic figures they've
already heard referenced. Cycle A is the memoir's thesis: the
monsters started out at a little table in the schoolyard with
a deck between them, and the Engineer played each one in turn,
and he *lost*, and he lost, and then he lost again, and it
shaped him into the man who would build the Protocols.

The cycle's emotional register is **tender**. The children are
not yet cruel. They are simply becoming what they will become.
The Engineer's narration is fond — the only time in Act 1 the
narrator is allowed to sound like a man smiling at a
photograph.

### 3.2 Cycle environment

**Location:** a primary-school classroom on a pre-Empire world
(Eden-adjacent — see Canon Rev 7 §6 for Eden context). Small
wooden tables. Low ceiling. Natural warm-yellow sunlight
through a long window. One card table in the center of the
room.

**Mood:** directly opposite every other Prelude / Act 1
environment — **warm, sunlit, mundane.** This is the only room
in the whole game where no one is afraid yet. Every later
environment the player passes through (the Ark, the Academy,
the Vortex, the Archives) can be read as a slow retreat from
this room's brightness.

### 3.3 Art — Cycle A classroom environment still

- **Output:** `apps/client/public/art/rooms/room-kindergarten.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 conventions, but with the **warm-yellow
  sunlight palette** inverted from the Prelude's cold-cyan
  default. No fog, no film grain darkness, no anamorphic flare
  on cold points. The warm light is the point.
**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of a
> pre-Empire primary-school classroom on an Eden-adjacent
> world, late afternoon. A small rectangular wooden card-
> table sits dead center of the room, its surface a warm
> honey oak polished smooth by decades of children's
> forearms. Four child-height wooden chairs are pulled up
> close to it, two facing two, each seat carved with a
> different worn animal figure (a fox, a crane, a bear, a
> fish). The floor is clay-colored terracotta tile, softly
> scuffed. The back wall holds a dark slate board, blank —
> no rendered text, no chalk writing visible; only the faint
> ghost marks of a thousand lessons erased. To screen-right,
> a long panelled window-wall runs floor-to-ceiling with
> mullioned glass panes catching direct warm-yellow
> afternoon sunlight at a low angle, casting ten golden
> parallelograms across the floor and the card-table's
> surface. Motes of dust drift slowly in the light beams.
> The ceiling is low, exposed wood-beam, no artificial
> light — only the window sun lights the room. A small
> woven rug in dusty rose lies near the slate. No children
> are visible (they appear per-match as portrait cards).
> Palette: warm honey #d9a66a, soft sunlight yellow
> #f5d98a, dusty rose #c98b8b, terracotta #c66b3d, slate
> grey #55606e. **Deliberately no cyan, no deep space
> black, no emergency lighting** — this room is the only
> environment in the whole game that is lit by an actual
> sun. Soft diffused light, shallow depth of field on the
> card-table's center. Soft film grain. Anamorphic glow on
> the sun-panels but gentle, not flared. Cinematic 4K
> composition, three-quarter wide, camera at child-eye
> level looking slightly up at the card-table.

### 3.4 Opponent 1 — Little Meme

- **id:** `little_meme` (act1Step 1)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 45–59
- **Deck leaning:** `thought_virus`, `neutral`
- **Pre-match line:** already authored (see data shell)
- **Narrative purpose:** Introduces the player to the Dischordia
  card game proper. Little Meme is a child who repeats the same
  chant forever, and the *repetition itself* is the game's first
  mechanical hook — he's where the Thought Virus faction's
  "chant" mechanic originates in the memoir's telling.

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/little-meme.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048 (matchup-card convention; the UI layer composites the pre-match flavor line underneath at render time)
- **Priority:** P0
- **Style anchor:** §3.3 classroom palette (warm honey + sun-yellow + dusty rose). Character subject lit by the same window sunlight as the environment still so composites read as inhabitants of the same room.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing (subject fills the upper two-thirds of frame,
> lower third is deliberately empty honey-oak card-table
> surface for UI text overlay). A seven-year-old boy seated
> at the wooden card-table in the §3.3 classroom, leaning
> forward on both elbows, chin tilted up. His face is open,
> hungry, and delighted — a child who has found a new toy
> and will not stop until he has taken it apart. He is
> mid-chant: lips parted in a repeating phrase, the mouth
> caught between syllables. His eyes are locked directly on
> camera (not shy, not cruel — *certain*). He wears a
> simple pull-over tunic in dusty rose #c98b8b with
> rumpled sleeves. His hair is short, messy, chestnut. One
> hand is flat on the table, fingers splayed over an
> imaginary card; the other is half-raised, pointing with
> index finger extended as if tracking something the viewer
> can't yet see. Lighting: warm-yellow window sun striping
> his left cheek and the card-table surface. Palette: honey
> #d9a66a dominant, dusty rose #c98b8b accent, warm
> sunlight #f5d98a on his skin. Background is softly
> defocused interior of the classroom — slate board,
> window panes, rug — bokeh only, the child is the subject.
> No rendered text (the UI will overlay the flavor line
> *"Let me see. Let me see. Let me see..."* at render
> time). Soft film grain. Cinematic 4K. **Not cute — this
> boy is *certain*. The chant is already viral.**

**Deck composition (first-pass spec):**
- **Lean:** `thought_virus` (5 cards), `neutral` (5 cards)
- **Defining mechanic:** *Chant.* When a `thought_virus`
  card is played, a duplicate of it re-enters Little Meme's
  hand on the next turn (at half strength). This is the
  canonical origin of the Thought Virus faction's chant
  keyword — the player will see it again later in Act 1
  Cycle C and again in Acts 2+ against the grown Meme.
- **Difficulty posture:** **Introductory.** This is the
  player's first scripted Act 1 match. Deck power ceiling
  is deliberately low; the chant duplication is the only
  "new" mechanic and it fires at half strength so the
  player can win without understanding the keyword yet.
  Full deck authoring blocked on the live card pool as of
  Act 1 runtime stand-up.
- **Completion flag:** `act1_little_meme_defeated` on win,
  no penalty flag on loss (Act 1 allows retries).

### 3.5 Opponent 2 — Little Collector

- **id:** `little_collector` (act1Step 2)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 60–74
- **Deck leaning:** `new_babylon`, `neutral`
- **Pre-match line:** already authored
- **Narrative purpose:** The schoolyard jar. Every emotion trapped
  becomes currency later. Little Collector is where the New
  Babylon faction's "hoard" mechanic originates — every win
  banked, every loss catalogued.

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/little-collector.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §3.3 classroom palette. Shared lighting continuity with §3.4 (same window sun, same time of day).

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing (subject fills the upper two-thirds of frame,
> lower third empty honey-oak card-table surface for UI
> text overlay). A seven-year-old boy kneeling on one of
> the §3.3 classroom chairs to get taller than the table,
> both hands clasped around a small glass mason jar held
> protectively at his chest. The jar is roughly the size
> of his clasped hands; its glass is smoky and fogged from
> the inside, a faint iridescent shimmer trapped behind
> the glass suggesting *something* is inside (do not
> render distinct creatures — the shimmer is ambiguous,
> captured emotions rather than animals). His expression
> is sweet, earnest, and wrong — the smile of a child who
> has already decided to keep something that isn't his. He
> is looking slightly off-camera, to the player's right,
> as if watching the *next* emotion before he collects it.
> He wears a tidy little button-up shirt in soft sage
> green with the top button fastened, an overly-grown-up
> collar for his small frame. Hair parted to the side,
> neat, over-combed. Lighting: warm-yellow window sun from
> the same screen-right window as §3.3 and §3.4, catching
> the glass of the jar and making the trapped shimmer
> glow faintly golden. Palette: honey #d9a66a, sage green
> #7ba67a, sunlight #f5d98a, with a faint iridescent
> shimmer inside the jar glass (subtle — not overt
> magical effect). Background: softly defocused classroom,
> matching §3.3 bokeh. No rendered text. Cinematic 4K.
> **He is not a bully; he is a hoarder in the making. The
> sweetness is the menace.**

**Deck composition (first-pass spec):**
- **Lean:** `new_babylon` (5 cards), `neutral` (5 cards)
- **Defining mechanic:** *Hoard.* When a `new_babylon`
  card would be discarded, Little Collector banks it
  instead — at 3 banked cards, a bonus effect fires once
  per match. This is the canonical origin of the New
  Babylon faction's hoard keyword.
- **Difficulty posture:** **Light escalation** from
  Little Meme. The player now has one scripted match under
  their belt and is expected to know the UI. The hoard
  mechanic fires at most once per match in this
  introductory version, so a player who ignores it and
  plays aggressively still wins. Full deck authoring
  blocked on the live card pool.
- **Completion flag:** `act1_little_collector_defeated` on
  win; loss allows retry.

### 3.6 Opponent 3 — Little Watcher (Cycle A finale)

- **id:** `little_watcher` (act1Step 3)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 75–90
- **Deck leaning:** `architect`, `neutral`
- **Pre-match line:** already authored
- **Narrative purpose:** The finale boss. The half-finished white
  mask. Little Watcher is where the Architect faction's
  "record" mechanic originates — her deck *watches the player's
  hand* and adapts to it. The line "I have watched sixteen
  versions of you already" is the first moment in Act 1 where
  the memoir frame cracks — the player who is reading this is
  canonically *one of* those sixteen versions.
- **Finale slideshow:** `welcome-to-celebration` fires after the
  match wraps, win or loss.

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/little-watcher.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §3.3 classroom palette, but the
  afternoon sun is beginning to slant lower — this is the
  cycle finale, the *last hour* of the classroom day.
  Shadows are longer than in §3.4 and §3.5.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing (subject fills the upper two-thirds, lower third
> empty honey-oak card-table surface). A seven-year-old
> girl seated very still at the §3.3 classroom card-table,
> hands folded in her lap, spine straight, shoulders level.
> She wears a simple pale cream linen dress with subtle
> dusty-rose trim at the collar. Hair in a single dark
> braid down one shoulder. Held in her lap, barely
> catching the edge of frame, is a **half-finished white
> porcelain mask** — the upper half is smooth blank
> ceramic (covering where her eyes would be), the lower
> half trails into raw unfired grey clay that hasn't been
> shaped yet. She is not wearing the mask; she is holding
> it as if about to put it on. Her face is **fully
> visible** above the mask's upper edge — a perfectly
> composed little girl's face, eyes open, looking directly
> at the viewer with a soft, measured attention. No hostility,
> no fear, no curiosity — *assessment*. She has already
> decided what she sees. The lighting is late-afternoon
> through the §3.3 window, warm sun now angled lower and
> redder (approaching sunset temperature — first hint of
> the cycle finale's weight). The shadow of her head and
> the mask fall sharply across the honey-oak card-table
> surface in front of her, cast long. Palette: honey
> #d9a66a, cream #e6dcc2, dusty rose #c98b8b at her
> collar, white porcelain #f7f3ee for the mask, grey
> unfired clay #b8b4a8 for the mask's lower unfinished
> half, a warmer-toward-red sun #f0b878 (warmer than §3.4
> and §3.5 — the sun is lower). Background: classroom
> defocused, slate board barely readable behind her.
> Cinematic 4K. **She is recording you. The mask in her
> lap is for when she has seen enough to decide who she
> is being.** No rendered text.

**Deck composition (first-pass spec):**
- **Lean:** `architect` (6 cards), `neutral` (4 cards)
- **Defining mechanic:** *Record.* Little Watcher's deck
  observes the player's first three played cards and, on
  turn 4, composes an adaptive response that counters
  whichever faction the player has leaned into. This is the
  canonical origin of the Architect faction's record/adapt
  keyword — the player will re-encounter it every time they
  face an Architect-aligned opponent.
- **Difficulty posture:** **First real test.** Cycle A
  finale; the player is expected to have learned the UI
  and the chant + hoard mechanics. Record/adapt is the
  first mechanic that *reacts* to player choices rather
  than firing on a fixed timer, and losing here is the
  expected outcome of a first playthrough. Win or loss
  both fire `welcome-to-celebration` — the narrative does
  not branch on the outcome (it branches on which of the
  sixteen previous versions of the player Little Watcher
  is now recording).
- **Completion flags:** `act1_little_watcher_defeated` on
  win OR `act1_little_watcher_recorded` on loss; plus
  `act1_cycle_a_complete` set unconditionally when the
  `welcome-to-celebration` slideshow finishes.

**Finale cutscene — `welcome-to-celebration`:**

This is Cycle A's landing cutscene, fired regardless of
match outcome. It is the player's first glimpse of the
Celebration experiment that Ep 2 of the Meme's Show
(§2.4 *"Gary's Goggles"*) will later re-frame as a
4-year death loop.

- **Output:** `apps/client/public/videos/act1/welcome-to-celebration.mp4`
- **Duration:** 35–45s target
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `act1_cycle_a_complete`,
  `celebration_glimpse_shown`, `memoir_frame_acknowledged`
  (the last one lands on Little Watcher's voiceover line
  about "sixteen versions of you")
- **Reduced-motion fallback:** static end-frame + kinetic
  typewriter narration of Little Watcher's closing line

**START FRAME (Nano Banana 2):**
> Same §3.3 classroom, match complete. Wide shot from the
> empty seat opposite Little Watcher's chair (the player's
> POV, camera at child-eye level). Little Watcher sits
> exactly as in the matchup-card, hands in her lap, mask
> still not worn. The card-table between camera and her
> holds the final card play of the match — one card face-up
> on the player's side, one on hers, the played stacks
> intermixed. Warm late-afternoon sun has shifted another
> 15 minutes redder since the matchup card; the whole
> classroom is washed in amber. Dust motes thick in the
> light. Cinematic 4K. No rendered text.

**END FRAME (Nano Banana 2):**
> Pull-back establishing shot of the same classroom but
> the walls have **dissolved** — the wooden panelling
> peels back at the edges of frame to reveal, behind the
> school, a towering gated structure in polished brass and
> black marble: an immense ceremonial arch inscribed with
> the single word **"CELEBRATION"** in formal Empire
> script (rendered in-frame is permitted here, this single
> word is the canonical reveal). Beyond the arch, hundreds
> of identical schoolchildren in cream linen are walking
> in orderly processional lines toward a brass-and-bone
> amphitheatre. The Celebration banner flies above —
> dusty rose on cream. The classroom sits at the
> foreground as a small, warmly-lit island against the
> vast ceremonial machinery beyond. Little Watcher is now
> wearing the mask; only her braid and the lower edge of
> her jaw are visible beneath the porcelain. She is no
> longer seated — she stands at the threshold of the
> dissolving classroom wall, facing the arch. Palette:
> classroom honey and rose in the foreground, deep brass
> #b8752d and black marble #1c1a1a beyond the arch,
> ceremonial dusty rose #c98b8b on the distant banners.
> Cinematic 4K. The juxtaposition is the point.

**SEEDANCE 2.0 motion prompt:**
> Open on start frame — card-table, Little Watcher seated,
> amber classroom. Hold 3s. Beat at 4s: Little Watcher's
> voiceover line lands (*"I have watched sixteen versions
> of you already."*) as her hand lifts the mask from her
> lap. Beat at 8s: she places the mask over her face in a
> single slow motion; the classroom's warm light begins
> to shimmer at the edges of frame. Beat at 14s: camera
> slowly pulls back through where the east wall was; the
> wall dissolves outward in a wipe of warm dust, revealing
> the Celebration arch in distant tableau. Beat at 22s:
> camera continues the pull-back, the classroom becomes
> small foreground against the vast brass Celebration
> machinery; hundreds of children in cream linen walk
> toward the amphitheatre in silent processional. Beat at
> 30s: hold on final composition. Little Watcher (masked)
> at the dissolved threshold. Final 5s: slow fade to
> honey-amber black. 24fps. Reverent, foreboding, a
> child's-eye-view of something much larger than a
> classroom.

### 3.7 Cycle A → Cycle B transition

After `little_watcher` completes and the `welcome-to-
celebration` slideshow plays, the THE_SIGNAL tree unlocks its
first branching node (`act1-s1-choice`, a `wheel_choice` with
Path-A / Path-Secret shortText "INVESTIGATE" vs "KEEP HIDDEN")
at `apps/client/src/data/narrativeActs.ts:111`. The
player moves to the Comms Array, hears the Human's whisper for
the first time in Act 1 proper, and makes the Path A /
Path Secret choice before entering the Academy (§4).

**Branch-close gate:** Cycle B's first match (`the_detective_
student`) cannot begin until the THE_SIGNAL branch is resolved.
This is enforced by the Act 1 runner checking both
`narrativeActChoices` has an entry for the THE_SIGNAL branching
sceneId *and* `humanContactSecret` has been set to a boolean.

---

## Section 4 — Cycle B: Mechronis Academy (§4.4)

### 4.1 Cycle purpose

Five matches. The Engineer is eighteen to twenty-two. He is at
the Mechronis Academy — the technical university the Prelude
established through his diploma in Beat E (Prelude Bible §10.5).
Cycle B is the cycle where the Engineer **almost becomes safe**.
He meets the Human (still a student then, still called "the
Detective" only inside Mechronis slang). He watches Iron Lion
walk out. He learns the calibration arts from Professor
Matrikala. He earns a name from Professor Eidola. He plays one
match against a visiting Seer who wins without raising her
staff.

None of these relationships will survive what's coming. But
during Cycle B they exist, and the memoir frame lets the player
*feel* them as they were — young, warm, a little dumb, happy in
a way the Engineer has spent the rest of his life trying to
remember how to be.

### 4.2 Canon hygiene — Kanevas + CoNexus

Every Cycle B scene that references the Academy's administration
must follow the Prelude Bible §10.5 hygiene rule: **Kanevas is a
normal influential-but-not-warm headmaster.** Nothing in this
cycle (or anywhere in Act 1) may hint at his later canonical
function as the CoNexus interface layer. That reveal is Act 4+
scope per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §4.6.

The Engineer's narration about the Academy can carry mild
private reservation — "an institution I still don't know how to
feel about" — but never suspicion, never dread. Play each
professor's scene as a graduate remembering a professor, not a
survivor remembering a predator.

### 4.3 Cycle environment

**Location:** Mechronis Academy. Stone-and-composite architecture
with long corridors, tall arched windows, brass-and-bone
fixtures that will later be standard Empire issue but are here
still proud and clean. A central atrium with a single polished
card-table reserved for public matches — the table the Engineer
played every Academy opponent on.

**Mood:** **formal, quiet, a little echoing.** The Academy is a
place where your footsteps land too loudly. The environment's
palette shifts cyan-leaning from Cycle A's warm yellow — the
Empire's cold light is already arriving, but only as reflected
sunlight through institutional glass. Not hostile; just *about
to be*.

### 4.4 Art — Cycle B atrium environment still

- **Output:** `apps/client/public/art/rooms/room-mechronis-atrium.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 conventions, cyan-cool palette with a
  single shaft of warm sunlight through a high arched window.
  The sunlight is the last visual echo of Cycle A's classroom;
  after Cycle B it will not return until Act 5. Anamorphic
  flare on the arched window. Volumetric fog ankle height.
- **Nano Banana 2 prompt:** *to author in Section 4 revision.
  First pass should show the central atrium: a single polished
  brass-and-bone card-table center-frame, four tall arched
  windows along one wall casting warm sunlight across the
  floor, stone columns, a set of brass doorways leading off
  frame. No rendered text. No visible people. Cinematic 4K
  composition.*

### 4.5 Opponent 4 — The Detective (student years)

- **id:** `the_detective_student` (act1Step 4)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 96–110
- **Deck leaning:** `neutral`
- **Narrative purpose:** The player's first encounter with the
  Human **before he was The Human**. At Mechronis he was called
  "the Detective" by classmates who noticed he could read a
  room faster than anyone; the nickname stayed. The match is
  where their friendship starts. The Human's Log 5 Movement 3
  line — *"We did not have enough years. What we did have was
  enough."* — is canonically written *about this moment*. The
  player, having heard Log 5 in the Prelude, arrives carrying
  that weight.

**Production slots:**
- Matchup-card art (young man in a tidy student blazer, trench
  coat yet to arrive; warm open face)
- Deck composition (neutral; reading-the-opponent mechanics)
- Completion flag: `act1_detective_student_defeated`
- **Canon tie-in:** Setting the `act1_detective_student_played`
  flag unlocks a post-match Galley optional quest Act 1+ that
  references the sandwich recipe from Beat D.5 (Canon Rev 7
  §5.6.13)

### 4.6 Opponent 5 — Iron Lion (the day of his expulsion)

- **id:** `iron_lion_expelled` (act1Step 5)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 111–125
- **Deck leaning:** `insurgency`
- **Narrative purpose:** Iron Lion's last match at Mechronis
  before he walked out. The Engineer watched from the back row.
  Iron Lion's thesis — *"the point is that the point is not
  the rules"* — becomes the player's first exposure to the
  Insurgency faction's **rule-break** mechanic: Iron Lion's
  deck violates standard turn order deliberately, and the
  player has to either violate back or lose by playing clean.
  Iron Lion winning or losing does not change what happens
  next — he walks out either way. The memoir's point is that
  *winning is not the thing that matters*.

**Production slots:**
- Matchup-card art (young man with cropped hair, institutional
  Academy uniform worn one button too loose; he is already
  halfway through the door)
- Deck composition (Insurgency lean — turn-order violations)
- Completion flag: `act1_iron_lion_defeated`

### 4.7 Opponent 6 — Professor Eidola

- **id:** `professor_eidola` (act1Step 6)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 126–140
- **Deck leaning:** `architect`
- **Narrative purpose:** The ethics professor the Empire will
  later forget. She tests whether the student is worth ruining
  later. The match's load-bearing question — *"whether you
  play the way you think you ought to play"* — is the first
  Architect-faction **values-vs-action** mechanic: playing
  optimal cards locks some dialogue paths, playing
  sub-optimal-but-honest ones locks others. The outcome is
  the same victory-condition either way; the *report-card
  word* Professor Eidola writes changes what Act 3 can do
  with the player's Architect-faction reputation.

**Production slots:**
- Matchup-card art (middle-aged woman in academic robes, a
  single chalk mark on her sleeve, eyes tired but kind)
- Deck composition (Architect — values-vs-action branching)
- Completion flag: `act1_eidola_defeated`
- **Report-card state:** new GameState field
  `eidolaReportCardWord: "of course" | "interesting" | null`
  set by the match outcome + play style

### 4.8 Opponent 7 — Professor Matrikala

- **id:** `professor_matrikala` (act1Step 7)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 141–155
- **Deck leaning:** `neutral`
- **Narrative purpose:** The reactor-calibration master. The
  Engineer's technical mentor. Her line — *"the room is a kind
  of music. So is the Deck. Do not let either of them play
  you."* — is the first moment Act 1 names the Engineer's
  craft explicitly. Her post-match mention of the bench in
  Engineering *built by a student who once sat where you are
  sitting now* is a forward-reference: the bench is the same
  one the player found in the Prelude's Beat C Engineering
  room, and the Engineer-as-student built it.

**Production slots:**
- Matchup-card art (older woman, short grey hair, work
  coveralls with a single brass pin at the collar, a half-
  disassembled reactor coupling on the desk beside her)
- Deck composition (neutral — timing / calibration mechanics)
- Completion flag: `act1_matrikala_defeated`
- Forward-reference: this match's completion flag unlocks the
  Act 2 "young Engineer built the bench" Archives codex entry

### 4.9 Opponent 8 — The Seer (visiting fellow, Cycle B finale)

- **id:** `the_seer_visit` (act1Step 8)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 156–170
- **Deck leaning:** `neutral`
- **Narrative purpose:** The Seer visits Mechronis exactly once.
  She plays one match. She wins without raising her staff. The
  match mechanically demonstrates the later-game Seer's
  **prophecy** mechanic: her deck plays cards that haven't been
  drawn yet, from positions that don't exist in the game state,
  and it still resolves consistently because the game state
  retroactively adjusts. The memoir's narration explains that
  the player is not losing because they played poorly — they
  are losing because the match was decided before it began,
  and the Seer is polite enough to pretend otherwise. **Canon
  tie-in:** her staff is the same staff the player finds as
  the burnt-card fragment in the Prelude `burnt_card` crew
  mission. The Seer leaves it on the bench here. In the
  Prelude it burned. Those are the same staff at different
  points in time.

- **Finale slideshow:** `to-be-the-human` fires after the match
  wraps. The slideshow is canonically the *birth of the
  Human-as-Potential* — see Canon Rev 7 §6 for Eden context —
  and triggers the cycle's completion flag set.

**Production slots:**
- Matchup-card art (woman in plain robes, a dark staff leaning
  against the chair beside her, her face serene and slightly
  sad; she is already looking at where the staff will end up
  seventeen thousand years from now)
- Deck composition (prophecy mechanic — this one needs care;
  spec as a separate design doc before implementation)
- Finale cutscene prompt for `to-be-the-human` (Seedance 2.0,
  Eden canonical context)
- Completion flags: `act1_seer_visit_defeated` +
  `act1_cycle_b_complete`

### 4.10 Cycle B → Cycle C transition

After `the_seer_visit` completes and the `to-be-the-human`
slideshow plays, the memoir jumps forward **eighteen years**.
The narrator's voice changes register — still dry, still
precise, but cooler. The Engineer is now forty years old. Every
opponent Cycle C introduces is someone he has already known
for most of his adult life. The warmth of Cycles A and B does
not return.

Cycle B → Cycle C is the hardest transition in Act 1. The
environment palette shift should read as **a door closing**.
Canon: this is the last moment the Engineer is a private
person before the Empire makes him public.

---

## Section 5 — Cycle C: Nexon / Zenon / Last Words (§4.5)

### 5.1 Cycle purpose

Four matches. The Engineer is forty. Cycle C is Act 1's
landing — the war, the trial, and the execution-that-wasn't.
The opponents here are not new faces. They're everyone the
Prelude's Log 5 Movement 5 named. The player already knows
how this story ends, because they heard the Engineer record
his last log on the Vortex in Beat J. Cycle C walks them
backward from that recording to the moment it was *about*.

The memoir's register shift is deliberate and non-negotiable.
Cycle A was tender. Cycle B was formal and a little echoing.
Cycle C is **exact.** The narrator's voice is now the voice
the player knows from Log 5 — dry, precise, warm only about
the people he loved, exact about the people he didn't. Nothing
in Cycle C should sound surprised. The Engineer knew all of
this was coming. He wrote it down.

### 5.2 Canon hygiene — Vex Solène Act 1 non-appearance

The Warlord's Cycle C match (§5.5 below) is canonically the
first full deployment of the war-deck. Per `CANON_REV_7_ORACLE_
VEX_EXPANSION.md` §8, **Vex Solène does not appear in Act 1**.
She is inside the nanobot swarm the Warlord wears, and the
player may *feel* her at the edges — an occasional glitched
card effect, a single frame of a different face — but no name,
no voice, no portrait. Her full reveal is Act 3+ scope.

Every Cycle C reference to the swarm must be written as if the
Warlord is a weapon. The Canon Rev 7 §1.6 retcon is
load-bearing: **the Warlord is canonically a weaponized nanobot
swarm, not a corrupted innocent person.** Any dialogue that
frames her as a victim of possession is canon drift.

### 5.3 Cycle environment

Cycle C spans three distinct environments, in order:

1. **Nexon battlefield** (Opponents 9 + 10): a collapsing line
   of defensive positions at the edge of a city that is not
   going to survive the night. Mid-range shot depth. Everything
   dust-colored. The cyan palette that dominated Cycles A and B
   is almost gone — colors here are brass, bone, rust, and
   ember-orange from distant fires. **No natural light.**
2. **Zenon cell** (Opponent 11): a small interrogation chamber
   in the trial facility. One card-table. Two chairs. A single
   overhead panel light. Grey. Quiet. The opposite of every
   previous environment's grandeur — Cycle C's middle act
   happens in the smallest room in Act 1.
3. **The Authority gallery** (Opponent 12, cycle finale): a
   long hall with six crystal coffins along one wall, each
   faintly lit from within. The Engineer sits alone in a chair
   at the gallery's center. The Authority is not visible —
   only a voice and a silhouette above the gallery's back
   arch. The coffins are the same canonical pattern the player
   will meet again in Acts 4+ as the Resurrection Protocols'
   initial housings; at this point in the memoir they are
   unnamed Architect infrastructure. Do not label.

### 5.4 Art — Cycle C environment stills (three)

Three separate 1920×1080 `.png` + `.webp` stills required:

| Output path | Shot | Priority |
|---|---|---|
| `apps/client/public/art/rooms/room-nexon-battlefield.png` + `.webp` | Dust, brass, embers, collapsed line | P0 |
| `apps/client/public/art/rooms/room-zenon-cell.png` + `.webp` | Interrogation chamber, card-table, grey | P0 |
| `apps/client/public/art/rooms/room-authority-gallery.png` + `.webp` | Six crystal coffins, gallery hall, single chair | P0 |

All three Nano Banana 2 prompts to author in a Section 5
revision. First-pass direction notes are in §5.3 above.

### 5.5 Opponent 9 — Warlord Zero (at the Battle of Nexon)

- **id:** `the_warlord_zero_first` (act1Step 9)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 177–192
- **Deck leaning:** `architect`, `new_babylon`
- **Narrative purpose:** The Warlord's first full war-deck
  deployment. The Engineer stood opposite her on the line at
  Nexon; this is the match that match is about. Her line —
  *"I am going to win this war in three moves. This is not
  bragging. This is arithmetic."* — is the Warlord's
  mechanical thesis and also literally true: her deck's
  **three-move-lockout** mechanic forces the player to play
  three consecutive turns under reduced options. Winning does
  not end the war. Losing advances the war. Both outcomes fire
  the `hacking-reality` slideshow — the memoir's thesis is
  that **the war was the loss**, not any individual match.
- **Finale slideshow:** `hacking-reality` fires on both
  outcomes. Binds the Architect faction's reality-editing
  mechanic to the Warlord's arithmetic — the player has now
  seen Reality itself become a move.

**Production slots:**
- Matchup-card art (armored figure, face hidden behind a
  visor, shimmer along the visor's edge suggesting the swarm;
  NO face, NO glimpse of who is wearing the body)
- Deck composition (three-move-lockout mechanic — requires
  design spec before implementation)
- Finale cutscene prompt for `hacking-reality` (Seedance 2.0)
- Completion flag: `act1_warlord_zero_first_defeated` +
  `act1_nexon_battle_survived`
- **Canon hygiene:** see §5.2 above. Vex is in the swarm but
  cannot be shown, named, or hinted at. The Warlord's
  dialogue must not reference her host.

### 5.6 Opponent 10 — The Programmer

- **id:** `the_programmer` (act1Step 10)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 193–207
- **Deck leaning:** `neutral`
- **Narrative purpose:** The Engineer's oldest friend. Last seen
  at Nexon. The Last Words bridge quotes the Engineer's
  farewell to the Detective, not to the Programmer — because
  the Programmer vanishes **the night of this match** and is
  never seen again. The memoir's handling of the Programmer
  is its most restrained moment: he plays one hand, he
  shakes the Engineer's hand, and he is gone. The match's
  **deliberate-loss** mechanic (the Programmer can throw a
  match in progress and the game state refuses to register
  the concession) is where the Insurgency-adjacent "gift"
  mechanic originates.

**Production slots:**
- Matchup-card art (mid-forties man in plain cold-weather
  clothing, a satchel over one shoulder already half-packed,
  his face calm and final; he is already gone)
- Deck composition (deliberate-loss / gift mechanic)
- Completion flag: `act1_programmer_defeated` +
  `act1_programmer_vanished`
- **Canon tie-in:** this match's completion unlocks the Act 2
  codex entry that reframes the Programmer as a canonical
  Insurgency survivor rather than a casualty.

### 5.7 Opponent 11 — The Game Master (before the execution)

- **id:** `the_game_master_original` (act1Step 11)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 208–222
- **Deck leaning:** `thought_virus`, `neutral`
- **Narrative purpose:** The Game Master is canonically split
  into Left and Right after the Engineer's trial. Here he is
  still one man with both lenses in a single frame. He is
  the Engineer's actual trial opponent — the match is the
  **prosecution's opening argument, played as a card game.**
  His line — *"You have built a beautiful box. The only thing
  I am going to do is open it in front of everybody."* —
  establishes the Thought Virus faction's **public-witness**
  mechanic: his cards resolve *twice*, once privately and once
  publicly, and the public resolution is what goes into the
  verdict. Winning does not clear the Engineer's name.
  Winning just makes the Authority's decision harder.

**Production slots:**
- Matchup-card art (thin man in a single pair of spectacles —
  not yet split into the two-lens configuration; suit of
  Empire legal black; face measured and unreadable)
- Deck composition (public-witness double-resolution
  mechanic — requires design spec)
- Completion flag: `act1_game_master_original_defeated` +
  `act1_trial_phase_complete`
- **Forward reference:** this match's completion flag is the
  canonical source for the Left/Right Game Master split in
  Act 2+. The memoir notes it explicitly: *"This was the last
  time he was one person."*

### 5.8 Opponent 12 — The Authority (Cycle C finale, Act 1 landing)

- **id:** `the_authority` (act1Step 12)
- **Canonical source:** `apps/shared/act1Opponents.ts` lines 223–238
- **Deck leaning:** `architect`
- **Narrative purpose:** The final match of Act 1. Faceless.
  The gallery of six crystal coffins. The Engineer alone in
  a chair. The Authority's first and only line — *"What do
  you say to the charges?"* — is the prompt. The match *is*
  the Engineer's response.
  - **Victory:** The Authority overturns the execution. It is
    not freedom — *it is delay*. A delay long enough to make
    one more card. That card is the one *Last Words* plays.
  - **Defeat:** The Authority passes sentence. *Last Words*
    fires.
  Both outcomes flow into the same full-song cutscene
  (described below); the only narrative difference between
  outcomes is the memoir narrator's framing line.

#### 5.8.1 Last Words — full song cutscene (the Act 1 landing)

This section is Act 1's emotional landing and the canonical
home for *Last Words* (Malkia Ukweli, canon Rev 7 §5.6.9). The
Prelude's Beat J only played a 35-second tease of Verse 1 over
5 slides of Malkia watching the Log 5 recording in her studio
(see `docs/production/prelude-asset-build/prompts/voice/log5/
LAST_WORDS_TEASE_VS_FULL.md` for the restructure rationale).
When the Authority match wraps, the player finally hears the
song the tease promised — in full, in context, over the
younger Engineer in the gallery chair.

**Audio:**

- File: `apps/client/public/audio/music/song_last_words_prelude_cut.mp3`
- Duration: 219.8 seconds (3:39.8)
- Loudnorm: −18 LUFS
- Plays uninterrupted through every narrative beat below;
  post-production from canon Rev 7 §5.6.11 (scrubber hum,
  Protocols click, film-damage dropouts, female-voice
  harmonic ghost) stays on the song's master and does not
  need re-authoring here.

**Slide sequence (reuse the existing 20-slide Prelude asset):**

- Path: `apps/client/public/art/prelude/last-words/slide-{1..4}-{1..5}.webp`
- Already shipped; no new art required for this landing. The
  slides were originally built for the Prelude's full-song
  treatment and are re-homed here with the song itself. Their
  four sections map to the canonical song structure
  (verse 1 / pre-chorus + chorus 1 / verse 2 + chorus 2 /
  bridge + outro) — see
  `apps/client/src/components/prelude/lastWordsTimeline.ts`
  (Act 1's runner will fork this file or import from a
  shared location during runtime implementation).

**Canonical Light/Dark choice — the one canonical alignment
moment in the whole game.**

The choice UI appears synced to the chorus-1 line *"Freedom
of thought is worth dying for / And the insurgency will be
broadcast once more."* Before this point the player cannot
skip; after the first chorus ends the skip button unlocks
(identical to the Prelude Bible §17.5 original spec — the
only change is where the moment fires in the narrative
timeline).

- Reveal time: **66s** from song start (chorus-1 onset)
- Skip unlock: **110s** from song start (chorus-1 end)
- UI component: `ChoicePillarLightDark` from PR #40
- Persistence: the player's pick is written to
  `GameState.lightDarkAlignment` (renamed from
  `preludeAlignment` in this restructure)
- Refusal handling: if the player never picks, the choice
  persists through the rest of the song + the cutscene holds
  on black until a choice is made. No default is chosen for
  the player.

**Runtime gate:** the full-song cutscene only plays when
`preludeCompletedFlags` contains `cutscene_archives_two_
witnesses_part1_complete` (ensuring the player has heard the
tease first — otherwise the payoff misfires).

**Production slots:**
- Matchup-card art (silhouetted figure above a gallery arch,
  six faintly-lit crystal coffins behind, no face, no
  identifying detail; the Engineer's chair in foreground)
- Deck composition (trial / verdict mechanic — match turns
  correspond canonically to the trial's phases; requires
  design spec as a separate doc)
- Full-song cutscene runtime: build a sibling component to
  Prelude's `LastWordsWitnessing` at
  `apps/client/src/components/act1/LastWordsFullWitnessing.tsx`
  (or similar path). Reuse the 20-slide timeline + choice
  gating from the Prelude Bible §17 / canon Rev 7 §5.6.
- Completion flags: `act1_authority_defeated` OR
  `act1_authority_sentence_passed` (exactly one) +
  `act1_cycle_c_complete` + `act1_complete` +
  (`first_light_dark_choice_resolved_light` OR
  `first_light_dark_choice_resolved_dark`)
- **Canon tie-in:** the six crystal coffins are the canonical
  pre-configuration of the Resurrection Protocols' initial
  housings. In Act 1 they are unnamed Architect
  infrastructure; their identity is revealed in Act 4+ per
  Canon Rev 7 §8.

### 5.9 Cycle C → Section 6 transition

After `the_authority` completes and the `last-words` slideshow
plays, Act 1's card-battle spine is complete. The player's
experience hands off to the Section 6 "Two Witnesses Meet
Part 2" cutscene, which closes Act 1 narratively (as distinct
from mechanically — the card ladder is done; the story beat
is one scene more).

**Gate:** Section 6 cutscene triggers only when
`preludeCompletedFlags` contains `cutscene_archives_two_
witnesses_part1_complete` AND `act1_cycle_c_complete` is set
AND (`act1_authority_defeated` OR `act1_authority_sentence_
passed`) is set. All three conditions must be true — the
player must have finished Beat J *and* finished the Act 1
ladder for Section 6 to unlock.

---

## Section 6 — Two Witnesses Meet Part 2 (Act 1 narrative close)

**Status:** stub. Section 6 locks the emotional close of Act 1
but does not belong to the card-battle spine — it is a single
cutscene the player enters after §5.8.1's *Last Words* full-
song landing resolves. This stub reserves the section,
anchors the canon sources, and specifies the production slots
that need to be filled before Section 6 can be authored in
full. Full scene spec is deferred until the Act 1 runtime is
stood up and the Witnesses' voices have been cast.

### 6.1 Narrative purpose

Beat J was **Part 1**: the player encountered the Witnesses'
*existence* (both physically present in the Archives, the
Antiquarian's `antiq_fc_1` line landing, *Last Words* playing
as an archived Age-3 recording). Per Canon Rev 7 §8.5 option 1
(user-approved), that scene establishes that two people have
been waiting for the player across Ages without yet
explaining what they are waiting for.

Section 6 is **Part 2**: the Witnesses finally sit down with
the player. In Beat J they held the knowledge; here they
share enough of it that Act 1 lands. Act 1 is the Engineer's
memoir; Section 6 is the scene where the two people who have
carried the Engineer's legacy the longest finally tell the
player what carrying it *costs*.

**Core reveals Section 6 is allowed to make (canon-safe under
Canon Rev 7 §8.6):**
- That the Antiquarian was a Witness who died for his thought
  and came back. (He need not use the word "Revelation" —
  "I was executed for what I thought. I woke up in the next
  era." is sufficient.)
- That the Enigma was the voice on *Last Words* and that she
  also died and came back.
- That the Engineer whose song the player just heard is
  **not** a Witness — he pre-dates the Witness arc. His
  death is what Malkia carried forward; it is the seed of
  what she became.
- That the player is the fulcrum the Antiquarian referenced
  in Beat J — the one who decides whether what the Engineer
  and the Witnesses died for continues or closes.

**Core reveals Section 6 must NOT make** (per Canon Rev 7
§8.6 hygiene rules):
- No "1260 days" spoken aloud.
- No "Silence in Heaven" as a named event.
- No "Heart of Time" ship reference.
- No Age names (Privacy / Prophecy / Insurgency /
  Revelation) spoken aloud — the only permitted phrasing
  remains the Antiquarian's *"Across Ages, across the death
  of stars"*.
- No "Daniel Cross" civilian name. No "Malkia Ukweli"
  civilian name either — the Enigma and the Antiquarian
  are the only names used.

### 6.2 Structural shape

Section 6 is **one cutscene, no matches, no deck**. The
player watches and, at one beat, chooses. The cutscene fires
immediately after §5.8.1's `lightDarkAlignment` write
persists — the player leaves the Authority gallery and walks
(off-screen) back to the Archives, where both Witnesses are
waiting in the chairs they were standing in during Beat J.

- **Runtime:** ~3–5 minutes target, single contiguous scene.
- **Primary room:** the Archives (reuse Beat J's backdrop;
  re-lit, re-dressed — Engineer's chair is gone, the six
  crystal coffins are gone, the Archives are *just* an
  archive again; the memorial has completed its job).
- **Speakers:** the Antiquarian, the Enigma, the player
  (player lines are dialog-selection UI, not voiced).
- **No music bed.** Section 6 is deliberately scored only
  with the Archives' room ambient. After *Last Words* ran
  for 3:39, the silence is the point.

### 6.3 The Act 1 closing choice

Section 6 contains **one player choice** — the
*Act 1 closing choice*, which is distinct from the §5.8.1
Light/Dark alignment pick. Where Light/Dark was the player's
stance toward the *prophecy*, the Act 1 closing choice is the
player's stance toward the *Witnesses themselves*:

- **Accept the burden.** The player agrees to carry forward
  what the Engineer and the Witnesses started. Unlocks
  Act 2's Antiquarian-as-companion track by default; Enigma
  may accompany but follows the Antiquarian's lead.
- **Decline the burden.** The player refuses the Witnesses'
  explicit offer. Act 2 still opens but the Witnesses fade
  into the background — the player carries the weight alone
  until they choose to reach for them again in Act 3's
  Witness-return arc.
- **Deflect.** The player neither accepts nor declines — they
  ask a question instead. The Witnesses do not press.
  Section 6 ends with the question unresolved and Act 2
  opens with the player's companion track still ambiguous.

All three choices are canon-safe endpoints. None softlocks
Act 2. `GameState` field: `act1_closingChoice: "accept" |
"decline" | "deflect"`.

### 6.4 Canon source references

All authored material for Section 6 must trace back to at
least one of:

- `docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md` §8
  (Two Witnesses architecture — the definitive canon source)
- `docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md` §8.5
  (Beat J implications + option 1 recommendation)
- `docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md` §8.6
  (the eight Prelude-and-Act-1 hygiene rules — Section 6 is
  still bound by them; Section 6 is not Act 2 yet)
- `docs/design/WITNESSING_NARRATIVE_PROPOSAL.md` — the
  *original* Witnessing proposal, which predates Canon Rev 7
  and contains a *"Two Witnesses Meet"* cutscene variant set
  in a Memorial Corridor with a forgive-both / forgive-one /
  forgive-neither player choice. **Not currently canonical
  under Rev 7**, but archived as creative reference for the
  eventual scene author — the Memorial Corridor geography
  and the forgive-mechanic framing are both interesting
  alternates the Section 6 author may pick elements from.
  Any deviation from Rev 7 §8.6 hygiene rules is a spoiler
  and must be caught in review.

### 6.5 Production slots

Filled slots (already shipped):
- Archives room backdrop (`room-archives.webp`) — reuse
  from Beat J, no new art required.
- Antiquarian + Enigma voice casting — cast during Prelude
  production (Antiquarian uses `antiq_fc_1`'s voice; Enigma
  uses Malkia Ukweli's voice from *Last Words*).

Open slots (blockers for Section 6 authoring):
- **Dialog script** — the actual scene, ~3–5 minutes of
  voiced dialogue. Needs a single-pass authored draft before
  VO recording. Anchor constraints: §8.6 hygiene rules,
  §8.5 option 1 staging, the three §6.3 endpoints.
- **VO lines** — every line of §6.1 core reveals needs to be
  recorded. Current estimate: ~18–25 lines total across the
  two Witnesses. Not yet in `VOICE_OVER_BIBLE.md`.
- **Player dialog UI** — the three-choice selection widget
  (accept / decline / deflect). Should reuse the
  `ChoicePillarLightDark` visual treatment for consistency
  with §5.8.1, *not* the generic dialog-option list used in
  Beat H's Inbox.
- **Ambient authoring** — the Archives' "no-music" ambient
  bed needs to be confirmed (room tone, HVAC hum, single
  dripping-data-stream in the background; pull from existing
  Beat J audio if reusable).
- **Post-scene hand-off** — Section 6's closing frame hands
  off to the Act 2 opener. The Act 2 Bible (not yet written)
  will spec what the player sees on Section 6 fade-out; for
  now, Section 6 fades to `act1_complete: true` + a black
  title card reading simply *"End of Act 1"*.

### 6.6 Forward-write surface

Section 6 writes the following state that Acts 2+ consume:

| Field | Value source | Consumer |
|---|---|---|
| `act1_complete` | Set to `true` on cutscene end | Gates Act 2 entry |
| `act1_closingChoice` | §6.3 player pick | Act 2 companion-track default; affects Act 3 Witness-return branch weighting |
| `witness_antiquarian_met_part2` | Always set on cutscene end | Act 2+ dialogue branches that reference the Antiquarian's Part 2 confession |
| `witness_enigma_met_part2` | Always set on cutscene end | Act 2+ dialogue branches that reference the Enigma's Part 2 silence or speech |

### 6.7 Open canon items flagged by Section 6

Items that need user decision before Section 6 can be
authored in full:

1. **Does the Antiquarian sit or stand?** Beat J has both
   Witnesses standing near the central pedestal. Section 6's
   staging needs a choice about whether the Witnesses move
   closer to the player (sit at a table with them) or hold
   the Beat J pose. The former is warmer; the latter is more
   biblical. Both readings are canon-safe.
2. **Does the Enigma speak in Section 6?** In Beat J she is
   canonically silent (her voice is the archived *Last Words*
   recording). Section 6 is the earliest canon-safe moment
   she could speak live. User decision needed: does her
   first live line land in Section 6, or is it reserved for
   Act 2+?
3. **Does the Antiquarian reveal he was "the Programmer" of
   the Loredex?** Canon Rev 7 §8.6 rule 2 forbids saying
   "Daniel Cross" aloud. The Loredex alias "the Programmer"
   is not explicitly forbidden but is adjacent to the
   civilian name. Section 6 is either the moment he
   connects the two identities or it is not — a deliberate
   design choice.
4. **The "forgive both / one / neither" option from the
   original Witnessing Narrative Proposal — is that
   canonically available in Section 6, or is it retired?**
   Under Canon Rev 7 the Witnesses do not have any reveal-
   worthy "debt" between them in Act 1 (Malkia's abduction
   of Cross is Act 3+ content per §8.6 rule 6). Without that
   reveal, there is nothing in Section 6 for the player to
   forgive. The three §6.3 endpoints (accept / decline /
   deflect) replace the forgiveness mechanic. User
   confirmation: is that replacement intentional, or should
   the forgiveness-of-Witnesses mechanic be preserved and
   re-scoped to Act 3 when Malkia's abduction reveal lands?

---
