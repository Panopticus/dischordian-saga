# Act 2 — Voice-Over Script

## The Dischordian Saga: Loredex OS

**Act:** 2 — "The Engineer's Bench" / "The Whisper"
**Speakers:** Elara · The Human · Zephyr-9 · Left Game Master · Right Game Master · Engineer (recordings)
**Total Lines:** 30

All audio URLs referenced in this document are already wired into the client
data shells (`apps/shared/act2Interlude.ts`, `apps/shared/songSlideshows.ts`,
`apps/shared/companionComments.ts`). Generate MP3s via the existing ElevenLabs
pipeline and drop them at the paths below. The client will pick them up
automatically.

See the Act 1 delivery pass (PRs #125–#128) for the voice-direction
reference — tone, delivery, and naming conventions carry over.

---

## §1 · The Human — Act 2 Whisper intro

**Direction:** Low, steady, conspiratorial. The Human has been listening to
Elara teach the player for weeks and is finally willing to break protocol to
say something. Slight reverb, as if transmitted from below the OS layer.

### Line 1 — Human Commentary 1

> I watched your tutorial. Elara's a good teacher. Patient. Thorough. But she
> only showed you one way to play. Every game on this Ark has two layers. The
> surface — what Elara teaches — and the substrate. The deeper mechanics. I'm
> not saying her way is wrong. I'm saying there's more.
>
> **VO Audio:** `/vo/act2/human-commentary-1.mp3`
> **Source:** `narrativeActs.ts:407`

### Line 2 — Human Commentary 2

> From now on, when you play, you might notice my signal in the background.
> Brief transmissions. Alternative strategies. A different voice. Think of it
> as a second opinion. From someone who sees the game from inside the walls.
>
> **VO Audio:** `/vo/act2/human-commentary-2.mp3`
> **Source:** `narrativeActs.ts:415`

---

## §2 · Elara — Substrate Recognition

**Direction:** Measured, protective, but not panicked. Elara has just realized
she is no longer the only voice in the room and is choosing to surface that
fact to the player before The Human can exploit the asymmetry.

### Line 3 — Elara Recognition

> I'm detecting substrate activity during your gameplay sessions. The Human's
> signal. They're commenting. On your performance. On my teaching. I can't
> block it. But I want you to know: I'm aware of it. And I'm watching. Don't
> let a voice in the walls tell you how to live your life.
>
> **VO Audio:** `/vo/act2/elara-recognition.mp3`
> **Source:** `Act2InterludePage.tsx:38`

---

## §3 · Engineer's Bench Framing — §6.2

**Direction:** These lines play over the Bench itself as ambient cinema, not
dialog. The Bench has the voice of a quiet instrument — Elara's tone on the
first power-on, the Bench's own mechanical hum underneath. For the light/dark
craft lines, the bench hum shifts pitch to match the alignment. The
out-of-Memory-Energy line is a narrator voice, neutral gender, dry.

### Line 4 — First Power On

> The bench powers on. It hums in a frequency you have heard before — on the
> Deck, in the reactor, in Elara's voice when she is reading old files. All
> three tuned to the same note.
>
> **VO Audio:** `/audio/act2/bench-first-power-on.mp3`
> **Source:** `act2Interlude.ts:45`

### Line 5 — Bench Ambient · Elara

> This bench… hums the same way his Deck did. Like it remembers him. I think
> he built it to build the Dischordia and then left it running. Just in case.
> Just in case one of us woke up.
>
> **VO Audio:** `/audio/act2/bench-elara-ambient.mp3`
> **Source:** `act2Interlude.ts:49`

### Line 6 — Bench Ambient · The Human

> She's right. He built it twice. Once before Mechronis, and once after Nexon.
> The second time was the one that worked. Don't ask me how I know. I watched
> it.
>
> **VO Audio:** `/audio/act2/bench-human-ambient.mp3`
> **Source:** `act2Interlude.ts:52`

### Line 7 — First Light Craft

> You forge your first card. It is embarrassingly small — a Common with a tiny
> effect. That is intentional. The bench is teaching you what a card IS before
> it teaches you what a card CAN BE.
>
> **VO Audio:** `/audio/act2/bench-first-light-craft.mp3`
> **Source:** `act2Interlude.ts:55`

### Line 8 — First Dark Craft

> You forge a dark card. The bench hums at a lower frequency. Elara flinches
> in the slot. The Human nods once, as if to say: be honest about what you are
> making.
>
> **VO Audio:** `/audio/act2/bench-first-dark-craft.mp3`
> **Source:** `act2Interlude.ts:58`

### Line 9 — Out of Memory Energy

> The Memory Energy reserve is empty. The bench will not turn away — it will
> only wait. If you want more, the Trade Empire is the answer, and you already
> know it. That is the point of this moment.
>
> **VO Audio:** `/audio/act2/bench-out-of-memory-energy.mp3`
> **Source:** `act2Interlude.ts:61`

---

## §4 · Zephyr-9's Classroom — §6.3

**Direction:** Zephyr-9 is Quarchon. Voice is precise, slow, lightly
mechanical, with an almost-affectionate restraint. He means every word. He
does not repeat himself. The four tier lines fire on classroom-depth crossings
(1, 3, 5, 8) — each is the student earning the next teaching.

### Line 10 — Zephyr-9 · Tier 1 (Basic Access)

> You may play. I will not let you win. I will not let you lose quickly. Both
> take time.
>
> **VO Audio:** `/audio/act2/zephyr-tier-1.mp3`
> **Source:** `act2Interlude.ts:102`

### Line 11 — Zephyr-9 · Tier 3 (Peek Top Card)

> Now you may peek at the top card of your deck before drawing. This is not
> cheating. This is chess applied to cards. Both games reward knowing what's
> coming.
>
> **VO Audio:** `/audio/act2/zephyr-tier-3.mp3`
> **Source:** `act2Interlude.ts:108`

### Line 12 — Zephyr-9 · Tier 5 (Undo Once)

> You may now un-do a single move per match. Use it sparingly. Quarchon have
> no un-do; we regret in other ways.
>
> **VO Audio:** `/audio/act2/zephyr-tier-5.mp3`
> **Source:** `act2Interlude.ts:114`

### Line 13 — Zephyr-9 · Tier 8 (Engineer's Opening)

> I will teach you the Engineer's Opening. It is the first hand he ever drew
> in a tournament. It is also the last hand he ever drew in one. There is a
> lesson in the symmetry.
>
> **VO Audio:** `/audio/act2/zephyr-tier-8.mp3`
> **Source:** `act2Interlude.ts:120`

---

## §5 · The Game Masters — §6.4

**Direction:** The two Game Masters share the original's broken goggles. The
Left one got the logic lens; the Right one got the mood lens. Their voices
are explicitly gendered to reinforce the split — Left is male, measured,
arithmetic; Right is female, theatrical, cruel. Casting should echo the
canonical reference pairing (Front Man cadence for Left; Bobby Fischer-via-TV
for Right).

### Line 14 — Shared · Game Master First Loss

> You lose. You were always going to lose. The Game Masters are reading your
> moves from the Matrix of Dreams. They read them before you make them. The
> only way to beat a Game Master at chess is to beat a Game Master in the
> Arena. Ask Zephyr-9 how.
>
> **VO Audio:** `/audio/act2/game-master-first-loss.mp3`
> **Speaker direction:** Record this as a third-person narrator voice (neither
> Left nor Right — a system line that reveals the canon rule of the arena).
> **Source:** `act2Interlude.ts:125`

### Line 15 — Left GM · First Contact

> I read from your left hemisphere. That is the logic one. I find it
> disappointing in almost every species, but I am fair. I will tell you when
> you play well. I will not tell you often.
>
> **VO Audio:** `/audio/act2/left-gm-first-contact.mp3`
> **Source:** `act2Interlude.ts:162`

### Line 16 — Left GM · First Defeat

> You played the arithmetic correctly. The arithmetic was the wrong question.
> I will not tell you the right question tonight. Come back.
>
> **VO Audio:** `/audio/act2/left-gm-first-defeat.mp3`
> **Source:** `act2Interlude.ts:165`

### Line 17 — Left GM · First Victory

> You beat the arithmetic. You did not beat the question. The question is
> what I am for. You will see me again.
>
> **VO Audio:** `/audio/act2/left-gm-first-victory.mp3`
> **Source:** `act2Interlude.ts:168`

### Line 18 — Left GM · Repeat Victory

> Again. Good. Repetition is the only teacher I respect. Come back tomorrow.
> I will be waiting in the same configuration.
>
> **VO Audio:** `/audio/act2/left-gm-repeat-victory.mp3`
> **Source:** `act2Interlude.ts` (repeatVictoryLine field)

### Line 19 — Right GM · First Contact

> I read from your right hemisphere. That is the pretty one. I am not fair.
> I am, however, extremely entertaining. Sit.
>
> **VO Audio:** `/audio/act2/right-gm-first-contact.mp3`
> **Source:** `act2Interlude.ts:177`

### Line 20 — Right GM · First Defeat

> Oh, darling. That was a READ. That was a WHOLE BOOK. I am keeping this one
> in the drawer where I keep the good ones.
>
> **VO Audio:** `/audio/act2/right-gm-first-defeat.mp3`
> **Source:** `act2Interlude.ts:180`

### Line 21 — Right GM · First Victory

> You win. Nobody wins the right hemisphere. Nobody. I am genuinely delighted.
> I will tell the Left one, and he will be genuinely unable to process it.
>
> **VO Audio:** `/audio/act2/right-gm-first-victory.mp3`
> **Source:** `act2Interlude.ts:183`

### Line 22 — Right GM · Repeat Victory

> Twice. Now that IS a storyline. I am writing notes about you. The notes are
> flattering. The flattery is part of the trap. Come back.
>
> **VO Audio:** `/audio/act2/right-gm-repeat-victory.mp3`
> **Source:** `act2Interlude.ts` (repeatVictoryLine field)

---

## §6 · Silence of Two Witnesses — §14.1

**Direction:** The Silence milestone fires at bond 60. Three audio beats
ride on top of the slideshow cinematic authored in `songSlideshows.ts`. The
first two are accessibility-captioning parentheticals — use a low-register
whisper with heavy reverb, almost inaudible; they describe what is visible
but not spoken. The third is a narrator-voice ambient bed that plays
underneath the entire 24-second cinematic.

### Line 23 — Silence · Elara (Parenthetical)

> (She says nothing. Her portrait flickers but does not resolve into speech.)
>
> **VO Audio:** `/audio/act2/silence-elara.mp3`
> **Source:** `witnessingEvents.ts:89` / `companionComments.ts:199`

### Line 24 — Silence · The Human (Parenthetical)

> (He says nothing either. His trench coat is still on screen; his voice is
> not.)
>
> **VO Audio:** `/audio/act2/silence-human.mp3`
> **Source:** `witnessingEvents.ts:90` / `companionComments.ts:202`

### Line 25 — Silence · Ambient Bed

> *24 seconds of ambient room tone + a held breath sample. No speech. A
> single synth chord that decays across the last 8 seconds.*
>
> **VO Audio:** `/audio/act2/silence-of-two-witnesses-ambient.mp3`
> **Source:** `songSlideshows.ts` `SILENCE_OF_TWO_WITNESSES_SLIDESHOW.audioUrl`

---

## §7 · Chess Climb Tier Reactions — §6.3 bridge

**Direction:** These fire when the player clears each tier of the chess
Climb (PR #129). Elara and The Human react alternately so each tier has one
voice. Tone matches the Zephyr-9 lines — warm but serious. These are NOT
companion-comments triggered by card battle; they are triggered by the
server-authoritative Climb.

### Line 26 — Climb Tier 0 Won · Elara

> You took two games off the Game Master at Exhibition. That is not nothing.
> He smiles when he says you did. I am not sure the smile means what he wants
> us to think it means.
>
> **VO Audio:** `/audio/act2/climb-tier-0-won-elara.mp3`
> **Source:** `companionComments.ts` `cc_chess_climb_tier_0_won_elara`

### Line 27 — Climb Tier 1 Won · The Human

> Wagered tier, cleared. You paid the ELO and got it back with interest. The
> host on the clipboard is reading from a new page now. Watch his hands while
> he does it.
>
> **VO Audio:** `/audio/act2/climb-tier-1-won-human.mp3`
> **Source:** `companionComments.ts` `cc_chess_climb_tier_1_won_human`

### Line 28 — Climb Tier 2 Won · Elara

> Hierarchy Table. You beat the demon with the clipboard. He will send you an
> Annotated Knight and forget to mention it is also a summons. Accept anyway.
> The note it comes with is the thing.
>
> **VO Audio:** `/audio/act2/climb-tier-2-won-elara.mp3`
> **Source:** `companionComments.ts` `cc_chess_climb_tier_2_won_elara`

### Line 29 — Climb Tier 3 Won · The Human

> Labyrinth Wager. Mol'Garath was at the audience, and you did not flinch.
> The Engineer finished that maze once. You're the second. There is a
> conversation you are now allowed to have. Don't skip it.
>
> **VO Audio:** `/audio/act2/climb-tier-3-won-human.mp3`
> **Source:** `companionComments.ts` `cc_chess_climb_tier_3_won_human`

---

## §8 · Dual-Signal Protocol — Act 2 Interlude ambient

**Direction:** These are the companion-comment triggers already authored in
`companionComments.ts` for the Act2InterludePage. Reusable ElevenLabs
"EngineerZero" (Elara) and "TrenchCoat" (Human) presets apply. Timing matches
the 1.5-second stagger in the interlude page.

### Line 30 — Dual Signal · Shared Bed

> *Dual-channel audio tone used under the Act 2 Interlude activation cinematic.
> 6 seconds. Low synth pulse at 110Hz (Elara channel) and 55Hz (Human
> channel). The Human channel fades IN during the second half.*
>
> **VO Audio:** `/audio/act2/dual-signal-tone.mp3`
> **Source:** `Act2InterludePage.tsx` onMount effect

---

## Generation checklist

- [ ] §1 Human commentary (2 lines) — voice `TrenchCoat`
- [ ] §2 Elara recognition (1 line) — voice `EngineerZero`
- [ ] §3 Bench framing (6 lines) — mixed; see direction above each
- [ ] §4 Zephyr-9 classroom (4 lines) — voice `Quarchon9`
- [ ] §5 Game Masters (9 lines — loss line + 4 Left + 4 Right) — voices
      `FrontManLeft` and `FrontManRight` (new presets)
- [ ] §6 Silence cinematic (3 beds) — processing-heavy; see direction
- [ ] §7 Climb tier reactions (4 lines) — alternating `EngineerZero` /
      `TrenchCoat`
- [ ] §8 Dual-signal tone bed (1 synth) — no voice

**Total generated MP3s: 29 · Total ambient beds: 2**

---

## Hosting notes

- All `/audio/act2/*.mp3` paths serve from `apps/client/public/audio/act2/`
  (mirrors the existing `apps/client/public/audio/elara/`, `.../human/`, etc.
  directories).
- All `/vo/act2/*.mp3` paths (the two Human Whisper lines + the Elara
  recognition) serve from `apps/client/public/vo/act2/` — this matches the
  `humanVoAudioUrl` convention in `narrativeActs.ts`.
- No database migration required; audio URLs are authored into static data
  shells.
