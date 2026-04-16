# Last Words — Prelude Tease vs Act 1 Full

**Design note, October 2026.**

The canonical *Last Words* song by Malkia Ukweli / The Enigma appears
twice in the game with two different treatments, anchored to two
different moments in the narrative.

## Two moments, two treatments

| Moment | File | Duration | Purpose |
|---|---|---|---|
| **Prelude Beat J** — Archives scene | `song_last_words_prelude_tease.mp3` | 35s | Motif-only tease after Log 5's hard cut. Player hears Malkia's voice for the first time but does not yet understand what she is responding to or what the song will become. No Light/Dark choice here. |
| **Act 1 Cycle C finale** — Authority match landing | `song_last_words_prelude_cut.mp3` | 219.8s (3:39.8) | Full canonical treatment. Plays the complete song with the 20-slide Witnessing sequence, the peripheral warm halo build, and the canonical Light/Dark alignment choice synced to the first chorus line *"Freedom of thought is worth dying for / And the insurgency will be broadcast once more."* |

## Why

Act 1 is the Engineer's memoir told through twelve card matches
plus the Meme's six-episode public broadcast (see
`docs/production/ACT1_NARRATIVE_STRUCTURE.md` §5.5 when written).
By the time the Authority passes sentence and *Last Words* fires
in Cycle C, the player has spent a whole act watching the Meme's
4th-wall-breaking public show misrepresent the Engineer alongside
the memoir's accurate private narration. The full song landing at
that moment carries the weight of both perspectives collapsing.

If the full song played in the Prelude (as it does in the currently-
shipped Beat J), the reveal lands with half the context — the
player doesn't yet know the Engineer's life story well enough for
Malkia's response to carry its full emotional freight, and the
Meme-vs-memoir contrast that makes Act 1's landing devastating
hasn't been set up.

Moving *Last Words* to Act 1's end + keeping only a tease in the
Prelude preserves the song's scarcity. The player hears Malkia
once, briefly, as a hint that SOMEONE responded. They leave the
Prelude wondering. Act 1 gives them the answer in full.

## Tease specification

The Prelude tease is the first 35 seconds of the full song with a
3-second fade-out at the end:

- **Source:** `apps/client/public/audio/music/song_last_words_prelude_cut.mp3` (full 3:39.8)
- **Start:** 0s (song start)
- **End:** 35s (with fade-out 32s → 35s)
- **Generated via:** `ffmpeg -t 35 -af "afade=t=out:st=32:d=3" -c:a libmp3lame -q:a 2`
- **Contains:** The instrumental intro plus the opening lines of Verse 1 *"I press play, and there you are / Flickering light in the dark of the stars"* (canonical lyrics per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6.9).
- **Does NOT contain:** the Bridge's verbatim Engineer quotes, the chorus's manifesto lines, the manifesto's *"Don't kneel. Don't despair."*, or the *"Enigma"* confessional. All of that material is reserved for the Act 1 Cycle C cutscene where it can land with full context.

## Prelude Beat J sequencing change (staged)

The Prelude's `LastWordsWitnessing` component was originally built
to play the full song with all 20 slides and the Light/Dark choice
synced to the chorus. The migration to the tease requires:

1. Switch `LAST_WORDS_SONG_URL` to the tease file for the Prelude
2. Shorten the slide sequence to just Section 1 (slides 1-1 through 1-5, Verse 1 cover)
3. Remove the Light/Dark choice from this moment entirely
4. The Prelude ends on Log 5 → tease → fade to black, no choice

The canonical Light/Dark choice moves to the Act 1 Cycle C finale
(see Act 1 Bible §5.8 — to be updated in a follow-up revision).

## Implementation status

- [x] Tease audio file generated (this commit)
- [ ] `LAST_WORDS_SONG_URL` updated to tease path
- [ ] Slide timeline trimmed to Verse 1 coverage
- [ ] Light/Dark choice removed from Prelude Beat J
- [ ] Act 1 Bible §5.8 + the Act 1 runtime take over the full song + choice
- [ ] Existing Beat J tests updated to reflect new duration + no-choice state
