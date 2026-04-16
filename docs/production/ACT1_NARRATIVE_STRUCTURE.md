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
