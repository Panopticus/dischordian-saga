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
- `docs/archive/2026-05-08-superseded/PRELUDE_SHIP_READY_BIBLE.md` — pattern source
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
- **Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of
> the central atrium of Mechronis Academy — a technical
> university carved from grey limestone and polished dark-
> basalt composite, soaring early-Empire institutional
> architecture. The atrium is a rectangular hall with a
> vaulted ceiling of exposed brass ribs and obsidian-glass
> skylight panes; four tall narrow arched windows line the
> left wall, each two stories high, casting long shafts of
> warm late-morning sunlight across a polished basalt floor
> dulled by decades of student footfall. Center-frame sits
> the public-match card-table: a single rectangular table
> of brass-clad oak with inlaid bone corner accents, polished
> to a soft matte sheen, four empty institutional chairs
> arranged around it (two facing two). No rendered text on
> the table's brass plaque (keep it blank for future UI
> overlay). Along the right wall: three tall brass doorways
> in shallow arched alcoves, each leading off-frame deeper
> into the Academy; above each alcove, a small stone
> medallion carved with a faculty seal (generic geometric
> sigils, no rendered letters). The stone columns between
> the doorways are fluted and unpainted. At the far end of
> the atrium, a raised dais with a second smaller card-table
> and a row of faculty chairs (empty — faculty appear per-
> match as portraits). **Palette:** cool institutional cyan
> #4ba3b5 in the shadowed recesses of the atrium (wall
> tones, under-column shadow, the basalt floor's deeper
> reflections), polished brass #b8752d on door-frames and
> table edges, warm buttery sunlight #f5d98a in four hard
> parallelograms falling across the floor — the sun is the
> **last visual echo of §3.3 classroom warmth**, deliberate
> and sparing. Volumetric fog pooled at ankle height, thin
> and dignified, catching the sun shafts as dust motes.
> Anamorphic lens flare on the brightest window's inner
> edge. Faint film grain. Cinematic 4K composition, three-
> quarter wide shot, camera at standing adult eye level
> (not child-eye as §3.3), looking down the hall past the
> public card-table toward the dais. No rendered text,
> no visible people, no holograms. **The room feels
> important. The room is about to be hostile. Today it is
> still just a school.**

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

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/detective-student.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §4.4 atrium palette. The student
  portraits all share the atrium's cyan-cool ambient with
  one sun-shaft falling across the subject, so the five
  Cycle B matchup cards read as a family against the
  environment still.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing (subject fills upper two-thirds, lower third
> empty brass-clad card-table surface for UI overlay). A
> young man around twenty, seated at the §4.4 public card-
> table, leaning slightly forward with both forearms
> resting flat on the brass-inlaid oak. His face is open,
> warm, attentive — the specific attention of a person who
> is *listening as hard as they are looking*. He has a
> half-smile that is about to become a full smile if
> whatever you're about to say is worth it. Dark hair,
> short and side-parted, a little untidy at the crown.
> Clean-shaven. Eyes dark, lively, slightly amused. He
> wears the **Mechronis student blazer** — a tailored
> cyan-grey wool double-breasted jacket with two rows of
> brass buttons and a narrow Academy crest stitched onto
> the left breast (crest is a stylized geometric seal, no
> rendered letters). Under the blazer a plain white
> collared shirt, no tie. His hands are bare, fingers
> laced loosely on the table; no coffee cup yet, no
> notebook, no trench coat (this is *before* the trench
> coat — the iconography that will define the Human is not
> here yet). One of the §4.4 window sun-shafts falls
> diagonally across his left shoulder and the table edge
> in front of him, warm yellow against the atrium's cyan
> tone. Palette: cyan institutional #4ba3b5 on the blazer
> and background, brass #b8752d on his buttons and the
> table's edge, warm sunlight #f5d98a on his left side,
> dark hair #2a1f1a, white shirt collar #f0eae0.
> Background: softly defocused atrium columns and arched
> window, bokeh only. Cinematic 4K. **He is the friend
> the Engineer almost kept. The warmth in his face is the
> entire cost of what's coming.** No rendered text.

**Deck composition (first-pass spec):**
- **Lean:** `neutral` (10 cards)
- **Defining mechanic:** *Read.* The Detective's deck
  inspects the player's hand after every third card is
  played and reveals one player card to the Detective for
  the next turn. The player sees the reveal happen — a
  subtle UI cue (a soft amber outline on the revealed
  card). This is the canonical origin of the Detective's
  post-Prelude *read-the-room* keyword used through Acts
  2–5 when the Human-as-Detective ability fires.
- **Difficulty posture:** **Low.** The player is opening
  Cycle B; the mechanic is new but forgiving (a reveal is
  information, not damage). Win-rate target: 70%+ for
  first-time players. The match is a *meeting*, not a
  test.
- **Completion flag:** `act1_detective_student_defeated`
  on win; `act1_detective_student_played` set
  unconditionally (used by the §4.5 Galley-sandwich quest
  gate per Canon Rev 7 §5.6.13).

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

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/iron-lion-expelled.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §4.4 atrium palette. Unlike §4.5
  Detective, Iron Lion is **mid-motion** in-frame — the
  portrait captures him already leaving, not seated. The
  sun-shaft falls behind him, not on him.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A young man around twenty-one, standing beside
> the §4.4 public card-table rather than seated at it —
> one hand still resting on the chair-back he has just
> risen from, the other already pointing off-frame toward
> the atrium's brass doorways. His weight is on his front
> foot; he is mid-stride toward leaving. **The posture is
> the story.** His face is set — not angry, not sad,
> *done*. Jaw firm, eyes forward (not at camera — past
> camera, at the door). Close-cropped dark-auburn hair,
> slight beard starting at the jawline. He wears the
> **Mechronis Academy uniform**: same cut of cyan-grey
> blazer as the Detective but worn **one button too
> loose** at the collar, one sleeve rolled up to the
> elbow. The Academy crest on his left breast has been
> deliberately scratched through with a single diagonal
> mark (subtle — visible only on close inspection). Under
> the blazer, a plain work shirt in a warmer neutral grey.
> Bare forearm shows a faint pale scar running from wrist
> to inner elbow — the mark of someone who has worked
> with their hands, not just their mind. Lighting: the
> §4.4 atrium sun-shaft is **behind** him, rim-lighting
> his silhouette from the back; his face is lit only by
> the cyan institutional ambient. This is deliberate —
> the sun is where he's leaving from; the cold light is
> where he is. Palette: cyan #4ba3b5 (dominant on his
> face and the foreground), brass #b8752d (blazer buttons,
> faint), warm sun #f5d98a (rim light behind him only),
> warm grey #867b6d (work shirt). Background: defocused
> atrium doorway, the brass door slightly ajar. Cinematic
> 4K. **He is already halfway through the door. Whether
> he wins or loses this match, he walks out the same
> way.** No rendered text.

**Deck composition (first-pass spec):**
- **Lean:** `insurgency` (8 cards), `neutral` (2 cards)
- **Defining mechanic:** *Rule-break.* Iron Lion's deck
  deliberately violates standard turn order on turns 3
  and 6 — he plays out of sequence, plays two cards in
  one phase, or discards in an unsupported order. The
  game state reports a warning to the player ("opponent
  played out of turn — accept or contest?"). Contesting
  wastes a player turn; accepting lets Iron Lion press
  the advantage. The **correct** play is to rule-break
  back — the player can violate their own turn order in
  response if they've unlocked any `insurgency`-leaning
  cards. The memoir's point is *winning is not the thing
  that matters, and the rules are not the thing that
  matters either.*
- **Difficulty posture:** **Medium.** First match in the
  run where a clever mechanic is actively adversarial
  rather than informational. Players who play clean lose;
  players who contest every violation lose by tempo;
  players who rule-break back either win or get a very
  close defeat. The match outcome branches Act 2's
  Insurgency-faction-contact conversations but does not
  softlock anything.
- **Completion flag:** `act1_iron_lion_defeated` on win;
  `act1_iron_lion_witnessed` set unconditionally (Iron
  Lion walks out either way, and the memoir carries the
  *witnessed* fact forward).

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

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/professor-eidola.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §4.4 atrium palette. Faculty portraits
  differ from student portraits by framing: the professors
  sit on the **dais side** of the public card-table, their
  back to the dais chairs; students face them across the
  atrium's width. Eidola's portrait is the player's
  adversary-side view.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing (subject fills upper two-thirds, lower third
> empty brass-clad card-table surface for UI overlay). A
> woman in her early fifties seated on the dais side of
> the §4.4 public card-table, upright, both hands folded
> on the table in front of her over a closed student
> report-card folder (do not render any text on the
> folder; keep its surface matte-cream blank). She wears
> the **Mechronis academic robe**: a long charcoal-grey
> wool robe with a narrow silver piping along the lapel
> and a single embroidered ethics-department sigil at the
> collar (geometric pattern, no rendered letters). Under
> the robe, a plain dark high-collared blouse. Her hair is
> silver-streaked black, cut short and neat, parted to
> one side; a single stray chalk-dust mark on her left
> sleeve. Her face is the most **asymmetric** of any
> Cycle B portrait: one eyebrow slightly lifted, one
> corner of her mouth softened into something that isn't
> quite a smile. Eyes directly at camera, **tired but
> kind** — tired because she has made this assessment a
> thousand times, kind because she has not yet stopped
> caring. Reading glasses pushed up into her hair rather
> than worn. One sun-shaft from §4.4 falls across her
> hands and the folder, warm on the cool palette. Palette:
> cyan institutional #4ba3b5 on the robe's shadowed folds
> and background, polished brass #b8752d on the table
> edge and a brass pen resting beside the folder, warm
> sun #f5d98a across her hands, silver-grey #a6a6a6 in
> her hair, blank cream #e6dcc2 on the closed folder.
> Background: defocused atrium columns, the empty faculty
> dais chairs behind her. Cinematic 4K. **She is about to
> write a word she will not let you read. She has already
> chosen it. The question is whether you make her change
> it.** No rendered text.

**Deck composition (first-pass spec):**
- **Lean:** `architect` (7 cards), `neutral` (3 cards)
- **Defining mechanic:** *Values-vs-action.* Eidola's deck
  does not play *against* the player so much as it
  *observes*. Every player turn, the UI silently tracks
  whether the card played was *optimal* (best win-rate
  vs Eidola's board state) or *honest* (flavor-matched
  to the narrative arc the player has selected —
  cooperative if Path A, cagey if Path Secret). The
  match's outcome is the same victory-condition regardless
  of play style; what changes is the **report-card word**
  Eidola writes.
- **Report-card state (new GameState field):**
  `eidolaReportCardWord: "of course" | "interesting" | null`
  - `"of course"` — player played mostly optimal,
    confirming Eidola's prior assessment. Neutral Act 3
    Architect reputation unlocked by default.
  - `"interesting"` — player played mostly honest,
    surprising Eidola. Opens a named Act 3 Architect-
    faction side-quest where an old copy of her report
    card surfaces and the word "interesting" is the
    passphrase into an Archivist's private file.
  - `null` if the player loses or if play-style tracking
    inconclusive (fewer than 60% of cards fit either
    category); safe default.
- **Difficulty posture:** **Medium-low.** The match is
  winnable by either play style; the difficulty is in
  choosing to care about the *word*, not the victory.
- **Completion flag:** `act1_eidola_defeated` on win;
  `eidolaReportCardWord` written unconditionally on any
  outcome (including the `null` loss case).

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

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/professor-matrikala.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §4.4 atrium palette. Matrikala is the
  faculty member least in uniform — her portrait brings the
  *workshop* into the Academy's formal atrium. Her framing
  breaks the faculty/student axis slightly: she leans
  forward off the dais chair rather than sitting upright
  behind the table.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A woman in her early sixties seated on the dais
> side of the §4.4 card-table but leaning **forward**,
> forearms on the brass-clad oak, body-language that of a
> workshop mentor rather than a formal examiner. She wears
> **work coveralls** (not the academic robe) in warm
> oxide-red canvas, sleeves rolled to the elbow, collar
> open. A single polished brass Academy pin holds the
> coverall's collar closed at the throat (faculty status
> in miniature). Her hands are **the portrait's subject
> weight**: bare, strong, knuckled, a web of fine scars
> and callus patterns that tell the story before her face
> does. On the table beside her elbow: a **half-
> disassembled brass reactor coupling**, its inner
> calibration ring partly exposed, a pair of fine needle-
> point calipers resting across it. Do not render the
> coupling as menacing — it is a *musical instrument* to
> her, half-open because she was mid-tune when the
> student sat down. Her face is weathered, warm, eyes
> bright and attentive — a professor who has spent her
> life teaching the same thing, and is still delighted
> every time a student finally hears it. Short silver-
> grey hair. Reading glasses on a brass chain around her
> neck, not worn. Lighting: the §4.4 sun-shaft falls full
> across the coupling and her hands, warm yellow on the
> brass and her skin — the *hands and the work* get the
> light, the face is lit by the atrium's cyan ambient.
> Palette: cyan #4ba3b5 on the background and her left
> side, oxide-red #c66b3d for the coveralls, polished
> brass #b8752d (the coupling, the pin, the table edge,
> the calipers), warm sun #f5d98a on her hands and the
> coupling, weathered skin with amber undertones.
> Background: defocused atrium faculty dais with a small
> rack of tools visible behind her (her workshop spilling
> into the formal room). Cinematic 4K. **She will teach
> you to hear the reactor hum. The coupling is the
> lesson. The victory is not.** No rendered text.

**Deck composition (first-pass spec):**
- **Lean:** `neutral` (10 cards)
- **Defining mechanic:** *Calibration timing.* Matrikala's
  deck is **sine-wave paced**: her card power oscillates
  between peaks and troughs on a predictable 4-turn cycle.
  The player *feels* this as turns where she seems
  unstoppable followed by turns where she plays almost
  carelessly. The right play is to read the rhythm and
  time your own counter-plays to her troughs. This is the
  canonical origin of the Engineer's later **calibration
  deck** archetype — the first mechanical "lesson" the
  Engineer learns in his own memoir, taught back to the
  player through her.
- **Difficulty posture:** **Medium.** Forgiving of players
  who don't notice the rhythm (the troughs are deep enough
  to survive by sheer aggression) and rewarding of players
  who do (a calibrated counter-play on turn 4 or 8 often
  wins the match outright).
- **Completion flag:** `act1_matrikala_defeated` on win;
  `act1_matrikala_heard_the_hum` set if the player
  executed at least one calibrated counter-play during the
  match (unlocks the Act 2 Archives codex entry *"The
  Bench That Built the Engineer"*).

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

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/seer-visit.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §4.4 atrium palette, but the §4.4
  sun-shafts are **not falling on the Seer** — they fall
  slightly to one side, as if the room's light has
  already decided to not interfere with her. Unique in
  Cycle B: her portrait has the least contrast between
  face-lighting and background-lighting.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A woman of indeterminate age (could be forty,
> could be seventy — the game's canon is that she is
> older than she looks) seated at the §4.4 public card-
> table on the visitor side (not on the faculty dais —
> she is a fellow, not faculty). She wears **plain
> traveler's robes** in unbleached linen-cream with no
> institutional markings — no Academy crest, no faculty
> sigil, no rank indicator. A wide undyed flax sash is
> loosely tied at her waist. Her hair is long, dark, and
> loose over one shoulder. Her face is **serene and
> slightly sad** — composed, unhurried, watching the
> viewer with the specific attention of someone who
> already knows how this meeting ends. Eyes directly at
> camera, soft. She is not smiling but is not sad; she
> has the expression of a person remembering something
> that hasn't happened yet. Her hands are loosely clasped
> in her lap — not on the table. Leaning against the
> chair to her right, angled upright: **a dark wooden
> staff**, as tall as a standing adult, worn smooth at
> the middle from a hand that has held it for decades.
> The staff's head is a simple blunt carved sphere in
> the same dark wood; no ornament, no crystal, no metal.
> The staff is subtly **burnt** at its lower third —
> charred, cracked, as if it has already lived through
> the fire that consumes it in the Prelude's `burnt_
> card` crew mission seventeen thousand years from this
> moment. *The portrait paints it as if the burn is
> memory, not prophecy.* Lighting: the §4.4 sun-shafts
> fall just to one side of her, illuminating the staff's
> lower burnt third and the chair beside her, but
> leaving her face softly lit by the cyan ambient only.
> Palette: cyan #4ba3b5 on her face and the background,
> warm sun #f5d98a on the staff (bright on the char,
> golden on the unburnt upper two-thirds), unbleached
> cream #e6dcc2 on her robes, dark wood #3a2618 on the
> staff. Background: defocused atrium columns.
> Cinematic 4K. **She is looking at where the staff
> will end up. The player has already seen the charred
> fragment in Beat J's Archives — this is where the
> burn begins.** No rendered text.

**Deck composition (first-pass spec):**
- **Lean:** `neutral` (10 cards)
- **Defining mechanic:** *Prophecy.* The Seer's deck
  plays cards that **aren't in her hand yet** — her play
  sequence is drawn from a future turn and retroactively
  applied to the current turn. The player sees a
  deliberate UI quirk: the Seer's played card slot
  flickers for 800ms before settling on the card she
  *will have drawn*, as if the game state is
  recalculating to accommodate a play it hadn't permitted
  a moment earlier. **This match is a scripted loss for
  the player's first playthrough.** The Seer's win is
  canonically the memoir's point — *you are not losing
  because you played poorly; you are losing because the
  match was decided before it began, and the Seer is
  polite enough to pretend otherwise.*
- **Design doc dependency:** the prophecy mechanic
  requires a rigorous consistency spec (how does the
  Dischordia game engine resolve a card play that
  retroactively edits the game state without breaking
  card-effect chains?). **Blocked on a separate design
  doc at `docs/production/act1/seer-prophecy-
  mechanic.md` before runtime implementation.** This
  Bible entry reserves the slot; the design doc owns
  the spec.
- **Difficulty posture:** **Scripted narrative loss.**
  The match does not softlock on defeat. Both victory
  and defeat fire the same `to-be-the-human` slideshow
  and the same cycle-complete flag; the only difference
  is whether `act1_seer_visit_defeated` or
  `act1_seer_visit_scripted_loss` is set (Acts 2+ read
  both cases identically for the vast majority of
  content, but the scripted-loss flag opens one
  additional Seer dialog in Act 3 where she remarks
  *"You remember the match in the atrium. I remember
  not raising my staff. Both of us are correct."*)
- **Completion flags:** `act1_seer_visit_defeated` OR
  `act1_seer_visit_scripted_loss` (exactly one) +
  `act1_seer_staff_witnessed` (unconditional — the
  canonical seeding of the burnt-card fragment
  continuity) + `act1_cycle_b_complete` (unconditional
  on `to-be-the-human` slideshow end).

**Finale cutscene — `to-be-the-human`:**

This is Cycle B's landing cutscene, fired regardless of
match outcome. It is the canonical *birth of the Human-
as-Potential* — see Canon Rev 7 §6 for the Eden context.
The slideshow compresses the Academy arc into a single
emotional landing: the Engineer and the Detective part
ways at the Academy gate, and the Detective walks off
toward an unseen horizon that will become, over the
following eighteen years, the Human. The player has
spent five matches watching him warm and open; here the
memoir closes the door on who he was and opens the door
to who he becomes.

- **Output:** `apps/client/public/videos/act1/to-be-the-human.mp4`
- **Duration:** 40–55s target (longer than §3.6 — the
  Human's reveal is the Act 1 emotional pivot)
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `act1_cycle_b_complete`,
  `to_be_the_human_shown`, `human_potential_seeded`
  (Canon Rev 7 §6 hook for Act 3+ Human-as-Potential
  branches)
- **Reduced-motion fallback:** static end-frame + kinetic
  typewriter narration of the Engineer's voice-over
  closing line: *"He walked out of the Academy gate. He
  would not be called the Detective again for a very
  long time. He would be something else first."*

**START FRAME (Nano Banana 2):**
> Mechronis Academy's main gate at dusk — a tall brass-
> and-basalt archway opening onto a stone plaza, the
> §4.4 atrium visible receding behind it through the
> opposite doorway. Two young men stand in the gate's
> threshold, backlit by the late-afternoon sun pouring
> across the plaza. On the left: the Engineer (seen
> from behind — hair, shoulders, cyan-grey blazer only,
> not his face — keep the Engineer faceless as per
> Prelude hygiene). On the right: the Detective
> (student-years, as rendered in §4.5's matchup-card),
> facing the Engineer in three-quarter profile, his
> hand extended for a parting handshake. Their hands
> are about to meet but have not yet. Around them, a
> few other students walk past in the dusk, blurred in
> motion. Palette: cyan institutional #4ba3b5 fading on
> the Academy stone behind them, warm dusk gold #e6a84a
> flooding the plaza beyond the gate, long shadows
> thrown toward camera. Cinematic 4K. No rendered text.
> **This is the last warm moment Act 1 gives the
> player. Every later cycle palette is colder.**

**END FRAME (Nano Banana 2):**
> The same plaza, forty seconds later. The Engineer
> stands alone in the gate's threshold, seen from
> behind, unmoving. The Detective has walked out
> through the plaza and is a small receding figure
> near the far edge of frame, silhouetted against the
> dusk sun — his Mechronis blazer replaced mid-shot
> by a **longer darker coat** that almost reaches his
> ankles, a coat he did not own when the scene began.
> His walk has changed too: shoulders squarer,
> stride more deliberate. He is not the same person
> who walked out. The plaza is emptier now; other
> students are gone. The gate-arch throws a long
> shadow across the foreground. Palette: cyan
> #4ba3b5 in the gate-shadow where the Engineer
> stands, dusk gold #e6a84a fading to purple-grey on
> the plaza, the Detective-now-almost-Human in
> silhouette against the last warm strip of sky.
> Cinematic 4K. **The door closes here. The coat is
> the reveal. He is on his way to becoming the man
> the player already knows from the Prelude's
> whispered voice on the substrate layer.** No
> rendered text.

**SEEDANCE 2.0 motion prompt:**
> Open on start frame — two young men at the Academy
> gate, hands about to meet. Hold 2s. Beat at 3s:
> handshake completes in slow motion, held 1.5s. Beat
> at 5s: the Detective steps back, nods once, turns
> away from the Engineer and begins to walk into the
> plaza. Camera stays locked on the Engineer's
> shoulders (seen from behind), the Detective
> receding ahead. Beat at 12s: **key transformation
> beat** — as the Detective walks away, his cyan-grey
> student blazer dissolves in a slow dust-wipe from
> his shoulders down, replaced by a longer darker
> coat that reaches past his knees (do not cut; the
> transition is a slow morph, not an edit). His
> stride shifts subtly. Beat at 22s: Engineer's
> voice-over: *"He walked out of the Academy gate.
> He would not be called the Detective again for a
> very long time. He would be something else first."*
> Beat at 30s: the Detective-now-Human reaches the
> far edge of the plaza, silhouetted against the
> dusk sun. Final 10s: hold on the Engineer's
> stationary back, the Human a small shape near the
> horizon, warm light falling from the left. Slow
> fade to cyan-cool black (the Cycle C palette
> beginning to bleed in). 24fps. Quiet, valedictory,
> the last warm moment before cold arrives.

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

Three separate 1920×1080 `.png` + `.webp` stills required.
All three must land **colder** than any Cycle A or B
environment — Cycle C is the cycle where the Empire's
hostility has arrived in full, and the palette's job is to
make the player feel that in the environment before any
opponent says a word.

| Output path | Shot | Priority |
|---|---|---|
| `apps/client/public/art/rooms/room-nexon-battlefield.png` + `.webp` | Dust, brass, embers, collapsed line | P0 |
| `apps/client/public/art/rooms/room-zenon-cell.png` + `.webp` | Interrogation chamber, card-table, grey | P0 |
| `apps/client/public/art/rooms/room-authority-gallery.png` + `.webp` | Six crystal coffins, gallery hall, single chair | P0 |

#### 5.4.1 `room-nexon-battlefield` — Nano Banana 2 prompt

> Hyper-realistic cinematic still, 16:9, 4K. A collapsed
> defensive line at the outer edge of the city of Nexon,
> late evening after a full day of fighting. Mid-range
> shot depth. The foreground is a half-ruined brass-and-
> stone parapet wall — a staggered row of bunker
> emplacements broken through in the center of frame, the
> breach showing dust, embers, and the silhouette of a
> single overturned card-table set up in the lee of a
> surviving brass gun-emplacement (the Engineer's field
> match was played here). The card-table is intact,
> lightly scattered with face-down cards, two empty
> chairs. Behind the parapet, the city of Nexon stretches
> in mid-distance: collapsed colonnades, the silhouettes
> of three partially-downed monuments, slow-rising columns
> of smoke threading upward through a low ceiling of
> dust. In the far distance, ember-orange glow from
> sustained fires on the horizon. **No natural light** —
> the entire scene is lit by distant fires, close emergency
> flares (cyan-cold, faint), and a single high-angle
> brass spotlight from an unseen battalion-post above
> the frame casting one hard amber cone across the
> ruined parapet and the card-table. Volumetric dust at
> knee height, drifting visibly through the spotlight.
> Brass shell-casings and scattered field-pack debris on
> the ground. A torn Insurgency banner hangs limp from
> a broken flagpole at screen-right. No visible bodies,
> no visible soldiers — the battlefield is *empty now*,
> the fighting has moved on or is about to resume. No
> rendered text. Palette: dust-brown #6b5a48 dominant,
> polished brass #b8752d on the gun-emplacement and
> card-table edges, rust-orange #c66b3d on the ruined
> metalwork, ember-orange #e06a1a on the distant fires,
> bone-grey #a6998a on the stone, cold cyan #4ba3b5
> barely present on the emergency flares. **Deliberately
> no warm sun, no honey, no dusty rose — Cycle A and B's
> warmth is gone. The only warm color is fire.**
> Anamorphic lens flare from the amber spotlight.
> Cinematic 4K composition, camera at standing adult eye
> level, three-quarter wide framing on the card-table in
> the breach.

#### 5.4.2 `room-zenon-cell` — Nano Banana 2 prompt

> Hyper-realistic cinematic still, 16:9, 4K. Interior of
> a small interrogation chamber in the Zenon trial
> facility. The room is deliberately **undersized** — the
> walls feel close, the ceiling barely above head height.
> Concrete-grey walls, unpolished. A single square card-
> table dead center on a stained grey floor; one chair on
> each side facing each other across the table. Both
> chairs are institutional grey metal — identical, no
> distinction between interrogator and accused. A single
> rectangular overhead panel-light centered directly above
> the card-table, unshaded, casting a hard white-cold
> cone downward — only the table and the two chairs are
> fully lit; the walls recede into deep grey shadow at
> the frame edges. The table surface is empty (the cards
> appear at runtime). No windows. One metal door at the
> far wall, closed, flush to the concrete, no handle
> visible from inside the room. A small brass identifying
> plate beside the door, blank (keep unreadable). No
> furniture beyond the table, two chairs, and the door.
> No decoration. No trace of anyone having been there
> before — the room has been cleaned. **Palette: cold
> institutional grey #55606e dominant on the walls and
> floor, slightly warmer grey #6b6b65 on the chairs,
> hard clinical white #e8e8e8 in the overhead light-cone,
> deep shadow #2a2a2d at the frame edges.** No brass
> (except the door plate). No cyan. No warmth. This is
> the smallest room in Act 1 and it must feel that way.
> Soft film grain. No volumetric fog (the room is sealed
> too tight for drift). Cinematic 4K composition, camera
> at standing adult eye level, centered on the table,
> looking directly down the chair-to-chair axis from just
> behind one chair's back. **The opposite of every
> previous environment's grandeur — Cycle C's middle act
> happens in the smallest room in Act 1.**

#### 5.4.3 `room-authority-gallery` — Nano Banana 2 prompt

> Hyper-realistic cinematic still, 16:9, 4K. A long
> vaulted ceremonial hall — the Authority's gallery.
> Deep perspective shot looking down the hall's length
> from near the entrance end. Along the left wall, a row
> of **six tall crystal coffins** in identical
> alcoves — each coffin a vertical standing container of
> clear faceted crystal, seven feet tall, narrow, each
> faintly lit from within by a soft low-saturation glow
> (three coffins glowing pale amber, two glowing pale
> violet, one glowing barely-visible pale cyan — the
> assignment is deliberate but the player does not yet
> know what it signifies). Each coffin appears **empty**
> on close inspection; the light inside is ambient, not
> from a figure. The right wall is blank polished black
> marble, reflecting the coffins' faint glow. The floor
> is a continuous slab of the same black marble, unlit
> except by the coffin glow. Center of the gallery's
> length, roughly two-thirds down the hall from camera:
> **a single simple wooden chair** facing away from
> camera, down the hall toward the gallery's back arch.
> The chair is unadorned, plain, almost domestic — the
> only organic material in a room of stone and crystal.
> (The Engineer will sit here at match start; the chair
> is empty in this establishing still.) At the far end
> of the hall, a tall stone archway with a raised shallow
> dais beneath it. Above the arch, recessed deep into the
> shadowed upper wall, **a silhouette is barely suggested
> — a darker shape against dark stone, identifiable only
> as an outline that could be a seated figure**. Do not
> render face, gender, or detail. The silhouette is the
> Authority's presence; the player will never see more of
> it. Palette: black marble #1c1a1a dominant, pale amber
> #d9a66a from three coffins, pale violet #8b7fbf from
> two coffins, pale cyan #4ba3b5 from one coffin (all at
> low saturation, barely visible), warm wood #6b4a2d on
> the single chair, deep shadow everywhere else. No
> rendered text. No warm ambient — the coffin glow is
> the only light. Volumetric cool air at ankle height,
> still, not drifting. Cinematic 4K composition, deep
> perspective, camera at standing adult eye level at the
> entrance end, looking down the hall's length toward
> the silhouette. **The Engineer's chair is the only
> thing in this room that cares whether anyone lives or
> dies. Everything else is ceremony and architecture.**

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

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/warlord-zero-first.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §5.4.1 Nexon palette (dust-brown +
  brass + ember-orange); matchup card is shot **standing
  at the ruined parapet**, not seated at the card-table.
  This single portrait breaks the Cycle A+B seated-at-
  table convention — the Warlord is not playing a game,
  she is arriving on a battlefield.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A fully armored figure standing at the §5.4.1
> ruined brass parapet, mid-distance from camera (fills
> upper two-thirds of frame, lower third is the ruined
> parapet + card-table edge for UI overlay). Her armor is
> articulated brass-and-composite plate in a dusky-
> chrome finish — no Empire insignia, no faction marks,
> deliberately unornamented; this is **field armor**, not
> ceremonial. A segmented cuirass, pauldrons, greaves,
> gauntlets. The helm is full-face, a sculpted brass
> visor with a continuous horizontal scanning slit at
> eye level. **The face is completely hidden.** Along
> the visor's lower inner edge, a **faint iridescent
> shimmer** — barely visible, almost a heat-haze, the
> only visible indicator of the Vex-swarm infesting the
> body. The shimmer is **subtle**, not flashy; a viewer
> who doesn't know to look for it reads it as spotlight
> refraction on the visor. One gauntleted hand rests on
> the hilt of a broad short-bladed weapon at her side
> (do not render it drawn); the other is extended open-
> palmed toward the card-table in front of her as if
> offering the match. Her stance is **still**, not
> aggressive — the composition should read as a
> professional arriving to complete a transaction, not a
> warrior entering combat. Lighting: the §5.4.1 amber
> spotlight falls across her pauldron and the upper
> visor; the rest of her body is lit by distant ember-
> orange from the city fires and a faint cold cyan from
> the emergency flares. The visor reflects the ember
> glow. Palette: dusky chrome #6b6b65 on the armor,
> polished brass #b8752d at joints and edges, ember-
> orange #e06a1a on the visor's inner reflection and
> the city glow behind her, dust-brown #6b5a48 in the
> background, faint iridescent shimmer (rainbow-pale,
> barely present) along the visor lip only. Background:
> defocused Nexon breach, smoke columns, a torn
> Insurgency banner at screen-right edge. Cinematic 4K.
> **The face is hidden. The face will remain hidden for
> the entire Act 1 arc. Do not hint at who is wearing
> the body.** No rendered text.

**Deck composition (first-pass spec):**
- **Lean:** `architect` (5 cards), `new_babylon` (5 cards)
- **Defining mechanic:** *Three-move-lockout.* On the
  Warlord's third turn, her deck locks three consecutive
  player turns to reduced option sets — the player's hand
  is forcibly narrowed to two playable cards per turn for
  turns 4, 5, and 6, with the Warlord's stated thesis
  *"three moves"* displayed as a small countdown
  indicator in the UI corner. The mechanic is explicit,
  not hidden; the player is *meant* to watch the
  arithmetic happen. The right play during lockout is
  timing — not fighting the lockout, but choosing which
  of the two options the Warlord left you serves the
  long-game better. This is the canonical origin of the
  Architect/New-Babylon **forced-option** keyword the
  player will see again in Acts 3+.
- **Design doc dependency:** forced-option lockout is
  mechanically invasive and must not break existing deck
  synergies in strange ways. Reserved slot; **blocked on
  `docs/production/act1/warlord-three-move-mechanic.md`**
  before runtime implementation.
- **Difficulty posture:** **Hard.** First Cycle C match;
  the difficulty spike from §4.8 Matrikala's Cycle B
  finale-adjacent match is deliberate. The memoir's
  thesis is that *the war was the loss*, so the match
  being hard and the outcome not mattering narratively
  reinforces each other. Both win and loss fire the
  same finale cutscene.
- **Completion flags:** `act1_warlord_zero_first_defeated`
  on win OR `act1_warlord_zero_first_lost` on loss
  (exactly one) + `act1_nexon_battle_survived`
  (unconditional — surviving the match *is* surviving
  the battle in the memoir's telling) + Ep 5 Meme's Show
  *"Dispatched"* unlock per §2.4 table (fires on the
  next match boundary, i.e. after §5.6 Programmer).
- **Canon hygiene:** see §5.2 above. Vex is in the
  swarm but cannot be shown, named, or hinted at in any
  dialogue, subtitle, or visual detail. The iridescent
  visor shimmer is the **only** permitted visual
  acknowledgement.

**Finale cutscene — `hacking-reality`:**

Fires on both match outcomes. Binds the Architect
faction's reality-editing mechanic to the Warlord's
arithmetic — the player has now seen Reality itself
become a move. This is Cycle C's **first** cutscene
landing; the Authority's §5.8.1 *Last Words* is the
cycle's second and final one.

- **Output:** `apps/client/public/videos/act1/hacking-reality.mp4`
- **Duration:** 30–40s target
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `act1_hacking_reality_shown`,
  `architect_reality_edit_witnessed` (used by Act 3+
  Architect-faction reputation branches; persists through
  the rest of the game)
- **Reduced-motion fallback:** static end-frame + kinetic
  typewriter narration of the Engineer's VO line *"She
  said three moves. She meant three edits. The third one
  was the rules themselves."*

**START FRAME (Nano Banana 2):**
> The §5.4.1 Nexon breach in the aftermath of the match.
> Two chairs at the card-table, one occupied by the
> Warlord (seen from behind — pauldron silhouette, visor-
> rim just visible), one occupied by the Engineer (seen
> from behind, cyan-grey blazer, face not visible). The
> card-table surface is lit by the amber spotlight. One
> final card face-up between them in the table's center.
> The Nexon skyline is dimmer than the environment still
> — the fighting has paused for this one match to
> resolve. Ember-orange still glowing on the horizon.
> Cinematic 4K. No rendered text.

**END FRAME (Nano Banana 2):**
> Same camera position, seconds later. The card-table is
> **gone** — not removed, *replaced*: the brass table has
> become a seamless polished black marble surface of the
> same shape and size, as if reality has been pasted-over
> where the table used to be. The two chairs are gone
> similarly; where the chairs sat, there are now **two
> identical black marble plinths** of the exact same
> silhouette, continuous with the new tabletop. The
> Engineer is no longer there — where he sat, there is
> only the plinth and a thin trail of cyan-grey cloth
> dust drifting down into a pile (the memoir will later
> name this *the dust where he was*). The Warlord still
> stands behind the transformed table, unmoving, visor
> still facing the plinth where the Engineer was. The
> ruined parapet behind her has also begun to change —
> the brass edges softening into black marble at the
> frame edges, a ripple of reality-edit spreading outward
> from the card-table to consume the battlefield itself.
> The ember-orange city glow in the far distance remains
> unchanged — Reality-edit has a radius, and the city is
> outside it. Palette: black marble #1c1a1a on the edit-
> zone, dusky chrome #6b6b65 on the Warlord's unchanged
> armor, ember-orange #e06a1a in the far background,
> cyan-grey cloth-dust #8b9199 where the Engineer was.
> Cinematic 4K. **The memoir is saying: the Engineer
> *was* there. Then he was not, because someone changed
> the room. The player knows he survives this scene
> because Acts 1's remaining matches happen. But for the
> length of this shot, he has been unwritten.** No
> rendered text.

**SEEDANCE 2.0 motion prompt:**
> Open on start frame — two chairs, one final card on the
> card-table, Warlord and Engineer both seated. Hold 3s.
> Beat at 4s: Warlord's voice lands (*"I said three
> moves. I meant three edits."*) as her gauntleted hand
> lifts from the card-table surface. Beat at 8s:
> **reality-edit beat 1** — the final card on the table
> dissolves into a fine geometric lattice and reforms as
> a blank black square, as if the card had never been
> played. Beat at 14s: **reality-edit beat 2** — the
> brass card-table itself ripples in one continuous wave
> from center outward and reforms as polished black
> marble, the chairs warping into marble plinths along
> with it; the Warlord does not move, but the Engineer's
> silhouette becomes briefly translucent. Beat at 22s:
> **reality-edit beat 3** — the camera's framing edges
> warp inward for a split second as the reality-edit
> radius expands; the Engineer is no longer in his
> chair-plinth, only the cyan-grey cloth-dust pile
> remains. The Warlord is still. Beat at 28s: Engineer's
> VO (off-camera) *"She said three moves. She meant
> three edits. The third one was the rules themselves."*
> Final 8s: slow pull-back revealing the edit radius
> spreading across the ruined parapet, freezing just
> short of the distant ember-orange city. Slow fade to
> dust-brown black. 24fps. Grave, clinical, the opposite
> of spectacle. **The horror is the calm.**

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

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/programmer.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §5.4.1 Nexon palette. The Programmer
  is the Nexon environment's *second* opponent — same
  battlefield, after the Warlord. His portrait uses the
  same setting as §5.5 but composed in the breach's
  opposite side (where the Engineer would sit) so the
  two cards read as shot/reverse-shot.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A man in his mid-forties seated on the
> survivor side of the §5.4.1 ruined-parapet card-table,
> facing camera across the table. He is dressed in
> **plain cold-weather travel clothing** — a weather-worn
> dark-grey canvas coat buttoned to the throat, a simple
> coarse-knit wool scarf in muted ember-rust #b85a1a
> (the Nexon palette's warmest echo), fingerless work-
> gloves, no faction insignia of any kind. His hair is
> short, greying at the temples, neatly kept despite the
> battlefield setting. A trimmed salt-and-pepper beard.
> His face is **calm and final** — the composure of a
> person who has already made every decision that matters
> and is now only waiting for the match to end so he can
> go do what he has decided to do. Eyes on the viewer,
> steady, warm but unbound. No grief, no fear. He is
> already gone, and the portrait is the portrait of
> someone who hasn't realized yet that the conversation
> is already a memory. Over his shoulder: a **canvas
> satchel, half-packed**, resting on the chair beside him
> — the flap open, a rolled map and a small brass lockbox
> visible inside. A folded piece of thick paper peeks out
> from his coat pocket (do not render text on the paper;
> keep it closed and creased). One hand flat on the card-
> table, fingers spread over a single face-up card in
> mid-play; the other hand resting on the satchel's
> strap. Lighting: the §5.4.1 amber spotlight falls
> across his face and the card-table surface; ember-
> orange rim-lights his shoulders from the city behind
> him. Palette: dusky grey #6b6b65 on his coat, ember-
> rust #b85a1a on the scarf, brass #b8752d on the
> satchel buckle and the table edge, amber spotlight
> #d9a66a on his face, dust-brown #6b5a48 in the
> background. Background: defocused Nexon breach, same
> setting as §5.5's Warlord portrait, same ember glow on
> the horizon. Cinematic 4K. **He is going to lose this
> match on purpose. The portrait should sell it before
> the match starts.** No rendered text.

**Deck composition (first-pass spec):**
- **Lean:** `neutral` (10 cards)
- **Defining mechanic:** *Gift.* On the Programmer's
  fourth turn, he plays a card that can only be read as
  a **deliberate throw** — a weak card into a strong
  player position, or a strong card into a trap. The
  player receives a UI prompt: *"The Programmer has
  thrown the match. Accept the gift? [Yes] [No]"*
  Accepting closes the match with a player victory
  and the Programmer vanishes from the Nexon line that
  night. Declining forces the Programmer to continue
  playing — he will play out the rest of the match at
  reduced strength, the player wins anyway, and the
  Programmer still vanishes. The **same** narrative
  outcome fires either way; what the prompt measures is
  whether the player understands what is being offered.
  This is the canonical origin of the Insurgency-
  adjacent **gift** keyword — a card that is explicitly
  *given*, not played against.
- **Difficulty posture:** **Narrative, not mechanical.**
  The match cannot be lost; the question is only whether
  the player accepts the gift. Both choices set
  `act1_programmer_gift_accepted: true | false` as a
  GameState field; Acts 2+ read this for the Programmer-
  as-Insurgency-survivor codex entry framing (the
  accepted version frames him as having *chosen* the
  player as his heir; the declined version frames him
  as having had to *leave anyway*).
- **Completion flags:** `act1_programmer_defeated`
  (unconditional) + `act1_programmer_vanished`
  (unconditional) + `act1_programmer_gift_accepted:
  boolean` (set to the player's response) + Ep 5 Meme's
  Show *"Dispatched"* unlocks on this match's boundary
  per §2.4 table.
- **Canon tie-in:** this match's completion unlocks the
  Act 2 codex entry *"The Programmer did not die at
  Nexon"* — which reframes him as a canonical Insurgency
  survivor rather than a casualty. The codex's tone
  depends on the `act1_programmer_gift_accepted` value.

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

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/game-master-original.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §5.4.2 Zenon cell palette
  (institutional grey + hard clinical white + deep
  shadow). The matchup card framing mirrors the cell's
  chair-to-chair-across-the-table layout; camera is
  positioned just behind the player's chair, looking
  across the table at the Game Master on the opposite
  side — the tightest matchup-card framing in Act 1,
  consistent with the cell's claustrophobic scale.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing. A thin man in his early fifties seated
> directly across the §5.4.2 interrogation chamber's
> card-table from camera, facing the viewer. He is lit
> by the single overhead panel-light's hard white cone —
> face and hands sharply illuminated, shoulders fading
> into the cell's deep grey shadow. He wears a tailored
> **Empire legal-black suit**: matte obsidian wool, no
> lapel insignia, no tie, a plain high-collared white
> shirt buttoned to the throat. His hair is thin, black,
> combed flat and receding. Clean-shaven. **Crucially:
> he wears a single pair of wire-rimmed spectacles —
> two lenses in one frame, the conventional
> configuration.** (This is pre-split; do *not* render
> the later canonical two-separate-eyepieces Left/Right
> configuration the Game Master is known for in Acts
> 2+.) The spectacles' frames are slim and dark; the
> lenses are clear glass, rendering his eyes directly
> visible through them, not obscured. His face is
> **measured and unreadable** — no hostility, no
> smugness, no warmth; the specific professional neutrality
> of a prosecutor who has decided what he is going to do
> long before the match began and is only going through
> the motions of procedure. Eyes directly at camera,
> steady. Both hands flat on the table, palms down,
> fingers unnaturally still. Between his hands on the
> table surface: a single thick folio of pressed paper
> (do not render text; keep the folio closed). Palette:
> institutional grey #55606e on the walls behind him,
> hard clinical white #e8e8e8 on his face/hands/shirt,
> deep shadow #2a2a2d at the frame edges and on his suit,
> dark obsidian #1c1a1a on the suit fabric, thin silver
> glint on the spectacle frames. **No brass. No warm
> light of any kind. No cyan.** The only color temperature
> in frame is the panel light's clinical white. Soft film
> grain. Cinematic 4K. **Remember his face. This is the
> last time he is one person.** No rendered text.

**Deck composition (first-pass spec):**
- **Lean:** `thought_virus` (6 cards), `neutral` (4 cards)
- **Defining mechanic:** *Public witness / double
  resolution.* Every card the Game Master plays resolves
  **twice** in a single turn: once privately (affecting
  only the match's internal scoring state) and once
  publicly (displayed in a dedicated "verdict stream" UI
  column that records the public record of each play).
  The two resolutions can have **different effects** —
  the same card might be a strong tactical play privately
  and a damning admission publicly, or vice versa. The
  player has no access to a parallel witness-column;
  their plays resolve once, normally. The match can be
  won mechanically (reduce the Game Master's private
  scoring state to zero) while being *lost publicly* (the
  verdict stream records the player as having played
  admissibly damning cards). Winning does **not** clear
  the Engineer's name; winning only makes the Authority's
  §5.8 decision harder.
- **Design doc dependency:** the parallel-resolution UI is
  a significant UX invention and must be spec'd
  separately. **Blocked on `docs/production/act1/
  public-witness-ui-spec.md`** before runtime
  implementation. The spec must address: how the parallel
  verdict stream renders, how player readability of "this
  card is tactically good but publicly damning" is made
  legible, and how verdict-stream state hands off to the
  §5.8 Authority match (the Authority reads the verdict
  stream as its opening state).
- **Difficulty posture:** **High but winnable.** The
  public/private divergence is the match's *mechanic*,
  not its *trick* — the game is explicitly telling the
  player that private and public plays differ, and the
  skill is in choosing which dimension to fight on. Win-
  rate target 45–55% (harder than §4.9 Seer's scripted-
  loss because both outcomes here are live and
  consequential).
- **Completion flags:** `act1_game_master_original_
  defeated` on private win; `act1_trial_phase_complete`
  unconditional; new GameState field
  `gameMasterVerdictStreamBalance: number` (range -10 to
  +10, signed integer measuring net public-verdict
  damage) handed off to §5.8's Authority match as its
  opening state.
- **Forward reference:** this match's completion flag is
  the canonical source for the Left/Right Game Master
  split in Act 2+. The memoir notes it explicitly: *"This
  was the last time he was one person."* The split
  happens **between** Act 1 and Act 2; Act 2's first
  Game Master appearance is already two separate figures.

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

**Matchup-card art:**
- **Output:** `apps/client/public/art/matchups/act1/the-authority.png` + `.webp`
- **Aspect:** 3:4 portrait 1536×2048
- **Priority:** P0
- **Style anchor:** §5.4.3 Authority gallery palette (black
  marble + faint coffin glow + single wooden chair). The
  matchup-card framing is the **opposite** of every
  previous Act 1 matchup card — the viewer is looking
  *down the hall from the Engineer's POV*, with the
  Engineer's empty chair in the immediate foreground, the
  Authority silhouette above the back arch as the only
  subject in the portrait's upper two-thirds. **The
  Authority is not sitting across from the player; the
  Authority is not sitting at all.**

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic portrait, 3:4, 4K, matchup-card
> framing, but composed as a deep-perspective hall shot
> rather than a seated-across-the-table two-shot. Camera
> is positioned at the §5.4.3 gallery entrance, low
> (seated eye level — the player's POV from where the
> Engineer will sit), looking down the long marble hall
> toward the back arch. The immediate foreground (lower
> third of frame) is **the plain wooden chair** where the
> Engineer will sit, empty in this still, facing away
> from camera toward the arch. The chair's back edges
> catch a faint sidelight from the coffin alcoves. Along
> the left wall of the hall, the six crystal coffins from
> §5.4.3 glow at their canonical saturations (three pale
> amber, two pale violet, one pale cyan). The right wall
> is black marble, reflecting the coffin glow as faint
> vertical streaks. The hall's floor stretches in deep
> perspective down to the shallow dais under the stone
> archway at the far end. **Above the arch, recessed
> deep into shadowed upper stone, the Authority's
> silhouette** — a barely-visible darker shape against
> darker stone, readable only as a seated or standing
> outline, **completely featureless**: no face, no
> hands, no color, no reflective surface, no insignia, no
> indication of scale (the viewer cannot tell if the
> figure is human-sized or three times human-sized).
> The silhouette is **the matchup-card's true subject**,
> but it is lit so faintly that the viewer's eye has to
> search for it; first-pass impression should be "empty
> hall with chair and coffins," second-pass impression
> should be "oh — there is someone there." Palette:
> black marble #1c1a1a dominant (floor, right wall, upper
> shadow where the silhouette sits), pale amber #d9a66a
> from three coffins, pale violet #8b7fbf from two,
> pale cyan #4ba3b5 from one (all low-saturation), warm
> wood #6b4a2d on the empty chair, deep shadow everywhere
> else. **No ambient warm light; no overhead lighting;
> no brass; no artificial color of any kind.** Faint
> film grain. Volumetric cool air at ankle height, still.
> Cinematic 4K. **The Authority has no face because the
> Authority is not a person. The Authority is the
> verdict — and in the next beat of runtime, the player
> sits down in the foreground chair and makes the
> argument.** No rendered text.

**Deck composition (first-pass spec):**
- **Lean:** `architect` (10 cards, no mixed leaning —
  purest Architect deck in Act 1)
- **Defining mechanic:** *Trial / verdict.* The match's
  turns correspond canonically to the phases of an
  Empire judicial proceeding: **charge** (turn 1),
  **opening argument** (turn 2), **evidence
  presentation** (turns 3–5), **cross-examination**
  (turns 6–8), **closing argument** (turn 9), **verdict**
  (turn 10). Each phase has different card-play
  restrictions modeled on the legal phase's real-world
  procedure (only defensive cards in turn 1, only
  evidence-category cards in 3–5, etc.). The **opening
  state** of the match is the
  `gameMasterVerdictStreamBalance` handed off from §5.7:
  a warmer balance makes the verdict phase's threshold
  easier to cross; a colder one makes it harder. **The
  match is not about defeating an opponent — the
  Authority does not *have* a hand. The match is about
  playing coherent Dischordia through all ten phases
  without breaking a phase-restriction and without the
  verdict stream landing below the execution threshold.**
- **Design doc dependency:** the phase-restriction
  system is a full-match mechanic with no precedent in
  Cycles A or B. **Blocked on `docs/production/act1/
  authority-trial-phase-mechanic.md`** before runtime
  implementation. Coordinate this spec with the §5.7
  public-witness-UI spec — they share the verdict stream.
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
