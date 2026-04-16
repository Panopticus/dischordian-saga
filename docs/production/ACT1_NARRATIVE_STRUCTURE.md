# ACT 1 SHIP-READY STRUCTURE BIBLE — Dischordian Saga

Companion to `PRELUDE_SHIP_READY_BIBLE.md`. Locks the production
structure for Act 1 — the twelve-match memoir the Engineer tells
through the card game, plus the Two Witnesses Part 2 scene that
closes the act.

**Status:** skeleton (October 2026). Opponent data shell exists at
`apps/shared/act1Opponents.ts`; narrative beats exist at
`apps/shared/narrativeActs.ts:78–372`. This doc formalizes the
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
  data shell; `apps/shared/narrativeActs.ts` is the branching
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
tree at `apps/shared/narrativeActs.ts:78–372` interleaves with
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

### 2.4 Morality and alignment carry

The Prelude's Beat J Light/Dark choice (`preludeAlignment`)
is Act 1's starting moral position. Specifically:

- **Light** opens Act 1 with `moralityScore: +15` and enables
  Path A's most cooperative Elara beats by default.
- **Dark** opens Act 1 with `moralityScore: -15` and makes the
  Path Secret → `betrayed` branch cheaper to fall into (the
  Warlord Zero match in Cycle C reads differently when the
  player arrives carrying a cooler moral balance).

Both starting positions are winnable — Act 1 does not softlock
or force a reversal on either alignment. A Dark player who
wants to earn Elara's trust still can; the doors are heavier,
not closed.

### 2.5 Prelude → Act 1 handoff contract

Every piece of Prelude state Act 1 reads from GameContext:

| Field | Source | Act 1 consumption |
|---|---|---|
| `preludeAlignment` | Beat J Light/Dark choice | Sets starting `moralityScore` ±15; gates the Authority trial framing in Section 5 |
| `preludeCompletedFlags` includes `cutscene_archives_two_witnesses_part1_complete` | Beat J completes | Required to unlock the Section 6 "Two Witnesses Meet Part 2" cutscene trigger |
| `preludeCompletedFlags` includes `prelude_burnt_card_found` | `burnt_card` crew mission | Required to unlock Act 1 at all — this is the Prelude's ship-complete gate |
| `humanContactMade` | Beat H Locke inbox + Beat C.5 whisper | Branches THE_SIGNAL entire event tree |
| `humanContactSecret` | Set on every Path-Secret choice | Feeds `elaraDiscoveryPath` at the branch-close gate |
| Beat D mission-board posting reads | `mission_board_read_kelvara` + two others | Locke offers whichever three the player read, in order |
| Kael Contingency Memo bullets | Beat F (`beat_f_memo_read`) | Referenced in Cycle C pre-Nexon dialogue; the memo's third bullet ("assume I am next") lands as a prophecy the player has now seen fulfilled |
| Engineer's sandwich recipe | Beat D.5 Galley | Unlocks the Galley optional quest Act 1 side-content per Canon Rev 7 §5.6.13 |

### 2.6 Act 1 → Acts 2+ forward-writes

State Act 1 sets that later acts consume:

| Field | Source | Consumer |
|---|---|---|
| `elaraDiscoveryPath` | Path-Secret branch-close | Act 2 Elara scenes; affects Act 3 Thought Virus meter calibration |
| `narrativeActChoices` appended | Every Act 1 branch | Recorded for Act 5 Post-Credits "this is what you chose" reprise |
| Opponent defeat/loss flags | Every card match | Deck composition defaults Act 2 fight mode selects from |
| Trade Empire faction-first-contact flag | If player accepts any of Locke's three jobs | Opens the Trade Empire mid-game pillar in Act 3 |
| `moralityScore` | Every Act 1 choice | Drives atmosphere-mapping from Canon Rev 7 §5.1 through the rest of the game |
