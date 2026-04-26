# DISCHORDIAN SAGA — IN-GAME WRITING AUDIT v3
## Voice-quality pass against the current codebase
## Session: 2026-04-26 (branch `claude/game-analysis-review-NGx0K`)

---

## 0. Why a V3

`docs/narrative-audit/WRITING_AUDIT_V2_INGAME.md` listed 67 fixes against
file paths and line numbers from a now-superseded codebase shape (the
audit's `client/src/game/storyMode.ts:LINE` anchors no longer match current
text — most of that content has been refactored into
`apps/client/src/game/cinematicDesign.ts`,
`apps/client/src/game/storyModeChapters.ts`,
`apps/client/src/game/postVictoryCinematics.ts`,
`apps/shared/storyModeRewrite.ts`,
`apps/scripts/source-lines.json`, and the
`apps/shared/tcg-core/story/dialogBank_*.ts` family).

`STUB_DIALOG_AUDIT_2026-04.md` closed Issue G (Loredex stubs) and added a
CI guard. The remaining V2 categories — A (Architect cliché), B (Source
virus-interruption), C (narrator over-exposition), E (voice drift), F
(generic villain patterns) — were explicitly deferred there as
"tracked separately; not stub-scope."

V3 picks up those five voice-quality categories, plus Acts 2–7 surfaces
that did not exist when V2 was written, and produces a fresh audit
anchored to the current files.

## 1. Status carried forward from V2

Applied this session in commit `18b571a` (and earlier passes):

| V2 fix | Status | Notes |
|---|---|---|
| A.1 Architect "I merely ensured…" | ✅ applied 2026-04-26 | `cinematicDesign.ts:342` → "I corrected a draft." |
| A.2 Watcher "You lose in all of them" | ✅ applied 2026-04-26 | `cinematicDesign.ts:398` → eleven thousand cycles / first anomaly |
| B.1 Source "I was made to be a weapon" | ✅ applied 2026-04-26 | `cinematicDesign.ts:422` → full virus-interruption form |
| E.1 Enigma "Your equations cannot contain me" | ✅ applied 2026-04-26 | `cinematicDesign.ts:358` → paradox form |
| E.2 Shadow Tongue "truth is whatever I whisper" | ✅ applied 2026-04-26 | `cinematicDesign.ts:390` → "I don't lie. I revise." |
| E.3 Game Master "just changed the rules" | ✅ applied 2026-04-26 | `cinematicDesign.ts:406` → with `[He is not surprised.]` |
| G.2 Engineer Loredex description | ✅ applied 2026-04-26 | `loredex-data.json` entity_18 expanded |
| G.1 / G.3 Warlord / The Forgotten | ✅ shipped earlier | already present in current `loredex-data.json` |
| H.1–H.4 Subject Zero → Prisoner 74 rename | ✅ applied 2026-04-26 (commit `653c678`) | 16 active-dialog occurrences renamed; explainer line preserved |

Iteration-count reconciliation (commit `3d7ea3c`): the Foucault cinematic
at `dialogBank_cinematics.ts:146` now reads *"Twelve sequence iterations —
the Arena's tally, not the Panopticon's"* to disambiguate from the
74-awakenings canon.

## 2. Scope of V3

V3 is **not** a fresh 1,247-entry pass. It is a re-anchored, current-state
voice audit covering:

- The five voice-quality categories from V2 that did not get applied
  cleanly (A.3–A.8, B.2–B.5, C.1–C.4, E.1–E.3 follow-on, F.1–F.2)
- Acts 2–7 narrative surfaces that did not exist when V2 was written
  (`act2Interlude.ts`, `act3OpponentDialog.ts`, `act4OpponentDialog.ts`,
  `act5Interlude.ts`, `act6OpponentDialog.ts`, `act7OpponentDialog.ts`,
  `companionComments.ts` Act 2–7 entries, `companionAskTopics.ts` Act 2+
  topics, `acts2to7SystemTutors.ts`, `companionAskLattice.ts`,
  `moralityTrustActVariants.ts` 289-entry registry)
- Cross-cutting voice-pattern checks (length compliance, exposition,
  speaker-attribution drift) sampled across the active narrative content

Out of scope (handled elsewhere):
- Stub markers / placeholders (covered by `STUB_DIALOG_AUDIT_2026-04.md`
  and `contentIntegrity.test.ts` Section 5)
- Structural completeness of Acts 2–7 (covered by
  `ACTS_2_7_COMPLETENESS_AUDIT.md`, status: shipped)
- Cross-game beat scaffolding (covered by `SESSION_HANDOFF_ACTS_2_7.md`,
  status: Loredex-side complete)
- VO recording / re-recording (covered by `vo:*` pipeline scripts)

## 3. Methodology

For each category, V3 records:

1. **Anchor** — the file + line where the issue lives in the current
   codebase (or "no longer applicable" with a one-line reason).
2. **Current text** — the literal string in `main` as of this session.
3. **Recommended replacement** — the prose, in voice.
4. **Why** — the voice-rule the fix enforces.
5. **VO impact** — whether an `audioClipId` is attached (i.e. if a
   re-record is needed once the line lands).

Voice rules (carried from V2, refined this session):

- Architect: **measurement, not modesty**. Doesn't threaten — calibrates.
  Never "I have already won." Always "I have observed the parameters."
- Watcher: **observation, not prediction**. Never "I have seen all
  outcomes." Always "I have watched for [N] cycles."
- Source / Kael: **virus interrupts humanity**. Heartbreak lives in the
  hijack (`— ALL WILL BE — / — CONSUMED —`) cutting through Kael's lucid
  fragments. Never pure-virus, never pure-Kael for more than two clauses.
- Game Master: **chaos pretended to be accidental**. Stage directions in
  brackets break the fourth wall (`[He is not surprised.]`).
- Shadow Tongue: **revision, not lies**. Literary register, not pulpy.
- Enigma: **paradox in the equation's own framework**. Never direct
  defiance — recursion.
- Elara: **memory, not lecture**. She remembers what she saw; she does
  not narrate what things mean.
- Human: **encrypted grief**. Silences and interruptions; never
  unprompted exposition.
- Antiquarian: **lyrical patience**. Already strong — protect it.
- Engineer (memoir frame): **first-person past with present-tense
  intrusions**. Already strong — protect it.
- Narrator beats: **evoke, do not summarize**. Sensory cascade beats
  plot recap.

## 4. Findings (categorised)

> Section 4 is built up incrementally; subsections will land in
> follow-up edits. Status of each subsection appears here:
>
> - 4A — Architect (status: pending)
> - 4B — Source / Kael (status: pending)
> - 4C — Narrator / exposition (status: pending)
> - 4D — Length compliance (≤25 words for fight-context) (status: pending)
> - 4E — Voice drift across speakers (status: pending)
> - 4F — Generic-villain rhetorical patterns (status: pending)
> - 4G — New surfaces that did not exist for V2 (status: pending)

## 5. Open questions for the team

> To be filled as findings land.

## 6. Verification protocol (when V3 fixes are applied)

1. `pnpm test apps/shared/contentIntegrity.test.ts` — must remain green.
2. Per-act dialog tests
   (`apps/shared/act{1,3,4,6,7}OpponentDialog.test.ts`) — must remain
   green; they enforce the 12-field schema and ≤25-word rule for
   fight-context fields.
3. `grep -rn "Subject Zero\|Subject 0"` — must return only
   `apps/shared/broadcastLibrary.ts:40` (the diegetic transition line).
4. Manual playback of any line whose text changes and that has an
   attached `audioClipId` — the VO will need to be regenerated via the
   appropriate `pnpm vo:*` pipeline.

---

*Document under construction — Section 4 to follow in chunks.*
