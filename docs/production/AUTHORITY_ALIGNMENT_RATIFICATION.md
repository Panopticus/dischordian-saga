# Authority Alignment Ratification Brief

**Status:** awaiting writer ratification.
**Owners:** writers (decision), engineering (wiring).
**Tracked in:** `apps/shared/livingDeferralCanon.ts` →
`ch20_conexus_BONUS` entry (`status: "deferred_authoring"`).

---

## What this unblocks

`ch20_conexus_BONUS` is one of three BONUS chapter intros producers
shipped on 2026-05-10. The MP4 is live on the CDN. Two of the
three (`ch19_nilmorg_BONUS`, `ch21_shadow_tongue_BONUS`) have
authored gates and fire today. The Conexus variant has no gate —
because no one has decided what "Authority alignment" means at the
Act-7 close.

This document records engineering's best-guess wiring + the
candidate gates the writer is asked to choose from. As soon as the
writer picks (or proposes something different), removing this
deferred-authoring entry is a one-line PR.

## Current wiring (engineering best-guess)

```ts
// apps/shared/bonusChapterIntroTriggers.ts
export type AuthorityAlignment =
  | "aligned"
  | "neutral"
  | "opposed"
  | "architect_leaning";

export const AUTHORITY_ALIGNMENT_ALIGNED_FLAG =
  "authority_alignment_aligned";

// gate row
{
  introId: "ch20_conexus_BONUS",
  triggerFlag: AUTHORITY_ALIGNMENT_ALIGNED_FLAG,
  minAct: 7,
  writerReview: true,
}
```

The flag setter is intentionally absent today — nothing in the
codebase writes `authority_alignment_aligned`. The BONUS will fire
the moment a setter ships at Act-7 resolution time.

## The decision

Pick one of A, B, or C — or propose something different. The pick
determines the producer site (where the flag gets written) and
defines what "Authority alignment" means in canon.

### Option A — Authority arc completion

The player has completed an Authority-aligned narrative arc by
Act-7 close. Setter fires once the player's
`act7_authority_arc_completed` or equivalent narrative-event flag
is set.

- **Pro:** Simple. Maps to existing arc-completion semantics.
- **Con:** Doesn't capture "alignment" as distinct from "completion."
  A player could complete the Authority arc without aligning with
  its values.

### Option B — Faction-meter threshold

The player's net Authority-faction reputation at Act-7 close
exceeds some threshold. Setter fires from `worldMoodService.ts`
(faction state already lives there).

- **Pro:** Mechanical. Lets the player drift in either direction
  through play.
- **Con:** Needs a threshold value chosen + a tracker that's
  Authority-specific. Not all faction systems are equally
  developed.

### Option C — Choice-based commitment

The player chose the Authority-aligned dialog branch at one or
more canonical Act-7 forks (e.g. Conexus testimony, Visible War
cover, Hierarchy DLC arc). Setter fires from the specific dialog
resolution.

- **Pro:** Reflects a real choice the writer is in control of.
- **Con:** Authoring effort scales with the number of canonical
  forks; "aligned" becomes a function of N booleans.

## The four enum values

The `AuthorityAlignment` enum is engineering best-guess. The
writer should keep, refine, collapse, or replace:

- `"aligned"`     — fires the Conexus BONUS today.
- `"neutral"`     — possible future BONUS surface.
- `"opposed"`     — possible future BONUS surface.
- `"architect_leaning"` — a candidate variant if the Architect
  arc is part of the Authority story.

If the writer collapses the enum (e.g. only "aligned" vs
"not-aligned"), removing the unused values is a one-line PR.

## Once the writer picks

1. Edit `apps/shared/bonusChapterIntroTriggers.ts:74` — replace
   `AUTHORITY_ALIGNMENT_ALIGNED_FLAG` with the canonical flag name
   if different. Flip `writerReview` from `true` to `false`.
2. Add a setter at the producer site (act-7 resolution router,
   dialog completion handler, or world-mood service).
3. Remove the `ch20_conexus_BONUS` entry from
   `apps/shared/livingDeferralCanon.ts`.
4. Update the gate test in
   `apps/shared/__tests__/bonusChapterIntroRouter.test.ts` if the
   flag name changed.

That's the entire integration. The producer MP4 already lives at
`cdn/client-public/videos/chapter_intros/ch20_conexus_BONUS_complete.mp4`
(strip-`_BONUS` resolver in `chapterIntroCutscenes.ts:67-72`).

## Background

The Conexus is the saga-final tribunal-of-witnesses surface
(`docs/built/LORE_BIBLE.md` Conexus entries). The Authority arc
spans Acts 6-7. The BONUS variant cinematic is the "Authority
testifies and is heard" alternate-timeline beat. Without writer
guidance on what makes the player "aligned" with the Authority,
the cinematic sits inert.

See also:
- `apps/shared/storyEncounterChapterIntros.ts:29-33` — original
  canon-gap note from 2026-05-10.
- `apps/shared/bonusChapterIntroTriggers.ts:1-37` — header docs
  for the BONUS gate system.
- `apps/shared/livingDeferralCanon.ts:64-82` — canon spine entry.
