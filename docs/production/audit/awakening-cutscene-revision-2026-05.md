# Awakening Cutscene Revision — 2026-05 Producer Drop

**Status:** RESOLVED 2026-05-10 — chosen ordering applied to
`apps/shared/cutsceneRegistry.ts` cutscene_awakening entry as
`shotFilenames`. Design doc `docs/design/ANIMATED_CUTSCENES.md`
§Cutscene 1: Awakening rewritten to match.

**Chosen ordering** (lore-confirmed; identity → mission →
aftermath):

```ts
shotFilenames: [
  "first_clone_born.mp4",  // shot 1 — Vox nanobot consciousness transfer
  "the_mandate.mp4",        // shot 2 — Ark Council mandate handed to player
  "93847_sunrises.mp4",    // shot 3 — Elara's 256-year solitude reveal
],
```

Citations: `docs/built/LORE_BIBLE.md` carries the verbatim
"I've watched 93,847 sunrises from this viewport" line.
`NARRATIVE_ARCHITECTURE.md` documents the Vox neural-nanobot
identity chain (Senator Elara Voss → Panoptic Elara → cloned
on Ark 1047). The producer's revised content is canonically
coherent; ordering was decided by emotional-narrative
chronology (identity → context → cost) rather than calendar
order.

---

## Original audit (preserved for reference)

**Status:** OPEN — needs producer/writer ordering decision before
the producer-delivered MP4s play in-game.

## Context

Cutscene 1 of 5 ("Awakening") is registered in
`apps/shared/cutsceneRegistry.ts:55-65` with `shotCount: 3`,
`durationSec: 45`, `videoBasePath: "/videos/cutscenes/awakening/"`.

The original design (`docs/design/ANIMATED_CUTSCENES.md` lines
9-33) specifies 3 shots:

| Shot | Design content |
|------|----------------|
| 1 | Black screen → cryo pod hatch cracks → mist spills out |
| 2 | Slow zoom out revealing Pod Chamber 47 |
| 3 | Elara's holographic avatar materializes |

The 2026-05-10 producer drop (`OTHER_CUTSCENES.zip / awakening/`)
shipped 3 MP4s with **completely different content slugs**:

| File | Implied content |
|------|-----------------|
| `93847_sunrises.mp4` | Time-elapsed (~256 years of cryo sleep) |
| `first_clone_born.mp4` | Origin / cloning-program backstory |
| `the_mandate.mp4` | Political backstory / mission rationale |

The producer appears to have **revised the cutscene's narrative
content** away from the design doc's pod-opening sequence toward a
saga-context cold open (deep time → cloning origin → present-day
mandate). Mapping these 3 files to shot1/shot2/shot3 is a
creative decision, not a mechanical rename.

## Two resolution paths

### (a) Producer/writer call on shot ordering — RECOMMENDED

Producer chooses the ordering. Engineering writes one line:

```ts
// apps/shared/cutsceneRegistry.ts cutscene_awakening entry:
shotFilenames: [
  "93847_sunrises.mp4",      // shot 1
  "first_clone_born.mp4",    // shot 2
  "the_mandate.mp4",          // shot 3
],
```

The `shotFilenames` override on `CutsceneDefinition` was added in
Phase 8 of this initiative
(`apps/client/src/components/cutscenes/AnimatedCutscenePlayer.tsx`
honors it as the per-shot URL builder). Once producer confirms
the ordering, populating the array is a one-line edit.

If the design doc is also being revised to match the new content,
update `docs/design/ANIMATED_CUTSCENES.md §Cutscene 1: Awakening`
to reflect the revised shot descriptions in the same PR — they
should stay in lock-step.

### (b) Rename producer source files — NOT RECOMMENDED

Producer re-exports the 3 files as `shot1.mp4`, `shot2.mp4`,
`shot3.mp4`, re-runs `pnpm assets:upload`. This is more work for
producer than (a) and forces a rebake if the ordering decision
later changes.

## What engineering needs back

A 3-line answer in the form:

```
shot1: <filename>
shot2: <filename>
shot3: <filename>
```

Once landed, engineering applies the `shotFilenames` array to
`cutscene_awakening` in `cutsceneRegistry.ts` and the cutscene
fires correctly. The CutsceneRouter pattern is already in place
(awakening is one of the 5 originally-declared cutscenes; the
producer call only resolves which file plays at which shot index).

## What's verifiable right now

- 3 producer MP4s are live on CDN under
  `videos/cutscenes/awakening/` (verified 200 OK during Phase 0).
- Cutscene component scaffold exists
  (`apps/client/src/components/cutscenes/AwakeningCutscene.tsx`)
  and is registered in `CutsceneRouter`.
- Without `shotFilenames`, the player tries to load `shot1.mp4`
  etc. and falls back to the reduced-motion poster on 404 — the
  failure mode is graceful.
- This audit doc is the verifiable artifact tracking the
  producer call.
