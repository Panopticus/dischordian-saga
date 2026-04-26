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

> Subsection landing tracker (built up in chunks):
>
> - 4A — Architect — ✅ landed (this commit)
> - 4B — Source / Kael — pending
> - 4C — Narrator / exposition — pending
> - 4D — Length compliance — pending
> - 4E — Voice drift across speakers — pending
> - 4F — Generic-villain rhetorical patterns — pending
> - 4G — New surfaces (Acts 2–7, variant registry) — pending

### 4A — Architect (V2 Category A)

**Status: largely closed. No new fixes recommended.**

The Architect surface across the active narrative content is consistently
in voice — measurement, calibration, vulnerability when it lands, never
cliché-villain modesty or "I have already won" patterns. Sampled
locations:

- **`apps/client/src/game/cinematicDesign.ts:342`** — Architect intro
  quote, post-V2-A.1: *"I did not create the universe. I corrected a
  draft."* ✅ in voice.
- **`apps/shared/tcg-core/story/dialogBank_chapters_10_12.ts:163–227`**
  — Chapter 12 boss-fight three-phase dialog scenes (pre, win, loss).
  All Architect cues use the *measurement / confession / vulnerability*
  register. Notable:
  - "Oracle. I foresaw this moment the day I built the Arena. … This is
    the bad ending for me. I want you to know I prepared for it
    anyway." (line 171) — foresight as acceptance, not threat. ✅
  - "I am going to kneel eventually. You should know that going in. I
    built a fight that allows me to kneel only after I have finished
    the confession…" (line 177) — radical self-disclosure. ✅
  - "I kneel. Good. That's — good. My schematic is already unrolling
    across the floor like an apology I was holding closed for eleven
    years." (line 197) — confession beat. ✅
  - "Get up. I have two more phases I would hate for you to miss."
    (line 223) — even loss-state stays in voice. ✅
- **`apps/shared/tcg-core/story/dialogBank_cinematics.ts:170–229`** —
  Phase 2 (False Prophet reveal) and Phase 3 (Corruption Outbreak)
  cinematics. Every Architect cue is grief-tinged measurement:
  - "I wore your face for a decade. It is the only skin I ever fit
    into." (line 183) ✅
  - "Phase three: the design eats itself. … which is what I was afraid
    of, and why I built the walls so thick, and why the walls were
    never the point." (line 220) ✅
- **`apps/client/src/game/postVictoryCinematics.ts:267–270`** — Three
  Architect cues across the Chapter 12 victory cinematic. All in voice.
- **`apps/shared/storyModeRewrite.ts:120–124`** — The "I wore your face
  for a decade" / "You were my finest creation" enhanced Chapter 12
  pre-fight passage. The phrase *"finest creation"* survives here from
  V2 fix A.5 — but the surrounding text has been rewritten in calibrating
  voice and the phrase now reads as the Architect *naming* the Human's
  identity to him directly, not as villain pride. ✅ leave.
- **`apps/shared/questlineQuarchonCh3.ts:72–134`** — `architects_echo`
  (a Quarchon AI construct distinct from the Architect itself). This
  surface is exemplary — it explicitly *self-distinguishes* from the
  Architect by what it does *not* say: *"The Architect would have said:
  'Your compliance is required.' He would not have framed the
  probability model as shared information."* (line 115). The whole
  quest is V3-grade voice work; protect it.

**Soft note (no action):** the Codex page at
`apps/client/src/pages/CodexPage.tsx:148` describes the Surveillance
Grid with the line *"By the time a resistance fighter decides to act,
the Architect has already calculated and countered every possible
move."* This is *static codex copy* describing Empire infrastructure
(not Architect dialogue). It trends slightly toward V2's deprecated
"already won" pattern but is in-fiction *propaganda*-style world-text,
which works as flavor; recommend leaving unless a future pass wants to
make even the codex copy reflect calibration-not-omniscience.

**No fixes required for V2 Category A as part of V3.**


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
