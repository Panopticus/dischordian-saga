# Act 4.5 (Dead Man's Circuit) — VO Authoring Brief

**Status:** awaiting writer authoring.
**Owners:** writers (line text), engineering (post-author generation).
**Tracked in:** `apps/shared/livingDeferralCanon.ts` →
`act_4_5_vo_manifest` entry (`status: "deferred_authoring"`).

---

## What this unblocks

`apps/shared/act4_5VoManifest.json` is currently `{}` — by design.
The optional Act 4.5 arc (Dead Man's Circuit + Degen's Casino) ships
all of its infrastructure but none of its VO. Players today see the
DeadMansCircuitPage UI and hear Nilmorg's race-announcer lines
(those are pre-generated via `nilmorgVoManifest.json` and live), but
the surrounding identity-chain narration is silent.

This brief tells the writer exactly what surfaces need lines, with
what cast, and how many beats each needs. The generator is ready —
the moment the writer commits lines to `apps/scripts/act4_5-vo-lines.json`,
one command produces the MP3s.

## What's already shipped

- **Generator** — `apps/scripts/generate-act-vo.ts --act 4.5`
  (verified). Reads `act4_5-vo-lines.json`, calls ElevenLabs per
  line, uploads to `s3://dgrsvoices/Act 4.5 Voices/`, writes
  `act4_5VoManifest.json`. Idempotent.
- **Manifest consumer** — `apps/client/src/hooks/useActVO.ts:52`
  imports `act4_5VoManifest.json` and serves `useActVO("4_5")`.
  Empty manifest is a safe no-op.
- **DeadMansCircuitPage** — the racing minigame is fully built;
  Nilmorg's 28 announcer lines are voiced via the separate
  `vo:nilmorg` Python generator and already live.
- **Starter file** — `apps/scripts/act4_5-vo-lines.json` ships with
  3 example entries (narrator framing, Elara dispatch warning,
  Human identity-wager invitation) using the existing
  SPEAKER_SETTINGS keys and real voice ids. The starter is
  schema-valid and runnable.

## What needs authoring

Three surfaces, ~26 lines total (engineering estimate; writer
adjusts):

### 1. Degen's Casino intro + interactions (~6 lines)

The casino is Act 4.5's second optional track. No page exists yet
(future work) but the Degen NPC bible at `apps/shared/npcs/bibles/the_degen.md`
gives the voice. Lines should cover:

- Casino entry greeting (the Degen sees the player)
- 2-3 interaction beats (place a bet / draw a card / cash out)
- Casino exit (win, lose, walk away)

**Speaker prereq:** the Degen is NOT in `SPEAKER_SETTINGS` in
`generate-act-vo.ts` (it's in the prestige generator's voice cast,
not the act generator's). Either:
- (a) add a `degen` block to `SPEAKER_SETTINGS` (~6 lines, see the
  existing `iron_lion` block as template), using voice id
  `r6VqF23i4qBEORazjelf` from `apps/scripts/generate_vo_gaps.py:63-110`
- (b) route Degen lines through the existing Python generator
  (`pnpm vo:degen`) and reference them in the manifest manually.
  (a) is simpler.

### 2. Identity-chain authoring beats (~12 lines)

The Act 4.5 framing is "what you commit to here is canon for this
loop and erased by the next reset." The starter entries are the
first three of these:

- 3 already shipped in the starter (narrator + Elara + Human).
- ~9 more needed: companion variants per Eidolon companion, a
  consequence acknowledgement when the player commits a wager, a
  reflection beat after either track resolves.

Use existing speakers in SPEAKER_SETTINGS — `elara`, `human`,
`narrator`, `the_antiquarian` cover the canonical voices for
this loop's commentary.

### 3. Companion reactions (~8 lines)

The `dmc_clone_companion` NPC bible
(`apps/shared/npcs/bibles/dmc_clone_companion.md`) gives the
clone-companion voice. Reactions to:

- First entry to the Circuit (companion: "I have been here before")
- Mid-run banter (1-2 lines per significant race phase)
- Post-race reflection (win / lose)

**Speaker prereq:** clone companion isn't in SPEAKER_SETTINGS.
Add a block (template: copy `iron_lion`, swap the voice id) or
re-use an existing companion voice if the writer prefers narrative
ambiguity.

---

## How to extend the starter file

The starter at `apps/scripts/act4_5-vo-lines.json` is a JSON array.
Append entries with the same shape:

```json
{
  "id": "act4_5_degen_casino_welcome",
  "speaker": "degen",
  "voiceId": "r6VqF23i4qBEORazjelf",
  "text": "OH! New blood. New ODDS. Welcome to the only honest house in the loop.",
  "context": "act4_5_degen_casino_intro",
  "section": "§4.5.3 · Degen — Casino welcome",
  "emotion": "warm_serious",
  "outputDir": "audio/act4_5"
}
```

Notes:
- `id` must be unique across all act lines (the generator dedupes
  by id; existing manifest entries are skipped on re-run).
- `speaker` must exist in `SPEAKER_SETTINGS` (see prereq notes per
  surface above).
- `emotion` falls back to the speaker's defaults if not in
  `EMOTION_NUDGES`. The three shipped nudges are
  `whisper_heavy_reverb`, `warm_serious`, `quiet_wonder`. Unknown
  emotions are a no-op nudge — fine for first pass.
- `outputDir` is the local-cache path; `audio/act4_5` matches the
  S3 prefix convention.

## How to generate

```bash
export ELEVENLABS_API_KEY=sk_...
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
pnpm tsx apps/scripts/generate-act-vo.ts --act 4.5
```

Output: per-line MP3 on S3 under `Act 4.5 Voices/`, manifest entry
appended to `apps/shared/act4_5VoManifest.json`. Re-run safely
after editing — already-recorded lines are skipped.

To preview without spending API credits:

```bash
pnpm tsx apps/scripts/generate-act-vo.ts --act 4.5 --dry-run
```

## Once N lines are recorded

1. Commit the updated `act4_5VoManifest.json` so the client picks
   them up.
2. Update `apps/shared/livingDeferralCanon.ts` —
   `act_4_5_vo_manifest` entry's `blockedOn` field can drop the
   "missing file" framing once the starter has been extended past
   the example trio.
3. Once the casino UI also lands (separate scope), remove the
   canon entry entirely — Act 4.5 is shipped.

## Background

- `apps/shared/deadMansCircuit.ts` — full racing data shell (3
  seasons, 3 tracks, 6 abilities, 28 Nilmorg lines).
- `apps/shared/act4_5CompletionGate.ts` — defines the two-track
  parallel structure; Act 4.5 completes when either track does.
- `docs/DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md` §10 — the
  identity-wager arc canon.
- `apps/shared/npcs/bibles/the_degen.md` — Degen voice bible.
- `apps/shared/npcs/bibles/dmc_clone_companion.md` — clone
  companion voice bible.
