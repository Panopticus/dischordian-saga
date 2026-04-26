# Acts 2–7 Dialog Completeness Audit

> **STATUS — 2026-04 update:** the five structural recommendations at the
> bottom of this file have all shipped. See
> `docs/narrative-audit/SESSION_HANDOFF_ACTS_2_7.md` for the complete commit
> trail (handoff covers branch `claude/write-narrative-acts-El8yv` through
> `5daee3b`). The historical findings below are preserved for context, but
> the per-act "Gaps" sections are no longer accurate. Current real state:
>
> | Recommendation | Shipped artifact |
> |---|---|
> | Per-opponent dialog tables for Acts 3, 4, 6, 7 | `act3OpponentDialog.ts`, `act4OpponentDialog.ts`, `act6OpponentDialog.ts`, `act7OpponentDialog.ts` (+ `acts2to7Opponents.ts`) |
> | Reactive companion comments for Act 2–7 moments | `companionComments.ts` `cc_act2_*` through `cc_act7_*` (~30 entries) |
> | `alternateAnswers` schema + first use | `companionAskTopics.ts` (`CompanionAskTopicAlternateAnswer`, `resolveAskAnswer`); `ask_human_who` carries Act 6 + Act 7 alternates |
> | System tutors for Acts 2+ | `acts2to7SystemTutors.ts` |
> | Cross-act Ask topic lattice | `companionAskLattice.ts` |
>
> **Genuine remaining narrative-side work** (verified 2026-04-26):
>
> 1. **Writing Audit V2 line fixes — partial pass applied 2026-04-26.**
>    The audit's `storyMode.ts:LINE` paths are stale — text has moved to
>    `apps/client/src/game/cinematicDesign.ts` (FIGHTER_INTROS quotes),
>    `apps/shared/storyModeRewrite.ts` (Chapter 12 enhancements), and
>    `apps/client/src/data/loredex-data.json` (codex). Status of the
>    audit's 67 categorized fixes against the **current** codebase:
>
>    | Fix | Status | Notes |
>    |---|---|---|
>    | A.1 Architect "I merely ensured…" | ✅ applied | `cinematicDesign.ts:342` → "I corrected a draft." |
>    | A.2 Watcher "You lose in all of them" | ✅ applied | `cinematicDesign.ts:398` → "eleven thousand cycles…anomaly" |
>    | A.3 / A.6 / A.7 / A.8 | ⊘ refactored away | The original strings no longer exist; the in-fiction Architect speeches have already been re-authored in longer, more in-voice form |
>    | A.4 / A.5 Architect Chapter 12 dialog | ⊘ already rewritten | `storyModeRewrite.ts` enhancedPreFightDialog supersedes; the `finest creation` phrasing here is part of a deliberately authored long passage in Architect's calibrating voice — leaving it preserves the rhythm |
>    | B.1 Source "I was made to be a weapon" | ✅ applied | `cinematicDesign.ts:422` → full virus-interruption form |
>    | B.2–B.5 Source story-chapter lines | ⊘ live in `apps/scripts/source-lines.json` (script reference), not `storyModeChapters.ts`. Already partially incorporate the audit's reframing (post-loss "no. Run. RUN.", post-win "I forgot I could still be one voice"). The explicit `ALL WILL BE — / CONSUMED —` interruption is intentionally dialed down here vs. the FIGHTER_INTROS B.1 quote. Defer further interruption work to a coordinated VO pass. |
>    | C.1–C.3 Show-don't-tell narrator beats | ⊘ refactored away | The original bullet-summary lines no longer exist in `storyMode.ts`; the equivalent beats now live as authored cinematics in `postVictoryCinematics.ts` and `storyModeChapters.ts` with sensory-cascade phrasing already |
>    | C.4 Cut opening crawl 6 → 3 entries | ⊘ scope mismatch | Opening narration has been restructured; not a 1:1 fix |
>    | D.1–D.3 Length trims | ⊘ source descriptions already reauthored | Warlord/Meme/Engineer entity bios are now full multi-paragraph entries rather than one-liners; trim no longer applies |
>    | E.1 Enigma "Your equations cannot contain me" | ✅ applied | `cinematicDesign.ts:358` → paradox form |
>    | E.2 Shadow Tongue "truth is whatever I whisper" | ✅ applied | `cinematicDesign.ts:390` → "I don't lie. I revise." |
>    | E.3 Game Master "just changed the rules" | ✅ applied | `cinematicDesign.ts:406` → with `[He is not surprised.]` stage direction |
>    | F.1 Dreamer / F.2 Seer | ⊘ originals not present | Strings do not appear in current codebase; either refactored or pending |
>    | G.1 Warlord Loredex bio | ⊘ already applied | `loredex-data.json` entity_10 already carries the audit's REPLACE text |
>    | G.2 Engineer Loredex description | ✅ applied | `loredex-data.json` entity_18 description field expanded |
>    | G.3 The Forgotten | ⊘ already applied | `loredex-data.json` entity_41 (line 2216) already carries the audit's REPLACE text |
>    | G.4–G.11 SiH placeholder songs | ⊘ flagged in original audit as "not urgent" |
>    | **H.1–H.4 Subject 0 / Subject Zero → Prisoner 74 global rename** | ✅ applied | **Subject Zero is retired.** Prisoner 74 is the canonical designation; the "74" carries the implication that this is the 74th awakening of the Oracle's consciousness — i.e. there have been 73 prior iterations of testing/death/reset. Renamed across 16 active-dialog occurrences in `dialogBank_chapters_1_3.ts`, `dialogBank_chapters_4_6.ts`, `dialogBank_chapters_10_12.ts`, `dialogBank_cinematics.ts`, `chapters.ts`, `storyModeChapters.ts`, and `storyMode.ts`. `broadcastLibrary.ts:40` is **preserved as the diegetic transition line** (*"Prisoner 74. That's what the Panopticon called me. Not Subject Zero. Prisoner 74. The number matters."*) so any returning player who saw the old name has an in-fiction reconciliation. The four-name list at `storyModeChapters.ts:414` becomes *"Oracle. Prisoner 74. Prophet. Prisoner."* — the duplication of "Prisoner" reads as deliberate emphasis (number-as-designation vs. status). Note for follow-up: `dialogBank_cinematics.ts:146` says the Oracle is "the thirteenth draft" with "twelve iterations" — this is a separate counting system (Arena's genetic-sequence iterations) that may want reconciliation against the 74-awakenings count in a future creative pass. |
>    | I.1–I.3 Chapter 12 foreshadowing seeds | ⊘ line numbers stale | The seeds are good narrative ideas but require re-anchoring against current chapter structure. Recommend re-writing as a fresh task with current line context. |
>
>    Net: **7 high-confidence fixes applied** in this pass; the remainder
>    are either obsolete due to refactor, already shipped, or deliberately
>    deferred for a coordinated revision against the current text.
>
> 2. Act 7 Convergence Seat close-line editorial pass — explicitly
>    deferred until the finale cinematic locks (per session handoff).
> 3. Cades-FPS / Dead Man's Circuit *emit* sides of cross-game beats —
>    out of repo; the Loredex receivers are already wired.
> 4. Real-player QA feedback into variant tuning (the 289-entry variant
>    registry is first-pass authored).
> 5. **Writing Audit V3** (recommended): a fresh audit pass against the
>    current codebase rather than the historical text. The audit's
>    1,247-entry structure is sound; the line-number anchors need
>    refreshing. Pair with a per-character voice-consistency review of
>    the now-shipped Acts 2–7 dialog tables.

_Scope: `apps/client/src/data/narrativeActs.ts` and the per-act mechanics files.
Companion to `docs/narrative-audit/WRITING_AUDIT_V2_INGAME.md` and the prelude/Act 1
audit that produced the work in `apps/shared/act1OpponentDialog.ts`,
`apps/shared/companionComments.ts`, `apps/shared/companionAskTopics.ts`,
`apps/shared/preludeSystemTutors.ts`, and Gates 5/6 of the card tutorial._

## Summary scoreboard

| Act | Title | Steps | Dialog written? | Opponent memoir? | Reactive companions? | Ask-topic coverage? |
|---|---|---|---|---|---|---|
| 2 | THE WHISPER | 7 | ✅ complete | N/A — interlude | ⚠️ partial | ⚠️ partial |
| 3 | THE OFFER | 5 | ✅ complete | ❌ missing | ❌ missing | ⚠️ partial |
| 4 | THE REVELATION | 14 | ✅ complete | ❌ missing | ❌ missing | ❌ missing |
| 5 | THE MAP | 5 | ✅ complete | N/A — interlude | ❌ missing | ❌ missing |
| 6 | THE CONFESSION | 8 | ✅ complete | ❌ missing | ❌ missing | ❌ missing |
| 7 | THE CONVERGENCE | 6 | ✅ complete | ❌ missing | ❌ missing | ❌ missing |

Line-text authoring is ✅ across all six acts: zero TODO/FIXME/XXX/placeholder
markers. The gaps are structural — same pattern the prelude/Act 1 pass
closed: per-opponent dialog tables, reactive companion comments, and Ask-topic
flag gates.

## Per-act findings

### Act 2 — THE WHISPER (`narrativeActs.ts:390–507`)
- **Shape:** Human's first in-engine commentary after the tutorial; establishes
  dual-narration channel. 4 dialog steps, 1 wheel_choice with 5 options
  (secret-path branch).
- **Strong:** Elara's "sensor glitch" deflect/lie branching. Class checks for
  Oracle and Spy.
- **Gaps:**
  - No companion comments wired for "first substrate ping heard mid-match"
    — the mechanic is defined at `narrativeActs.ts:498` but nothing fires
    `cc_act2_*` reactive lines.
  - Ask topics: `act1_intro_complete` unlocks carry through, but no Act 2-
    specific topic (e.g. "why is the substrate louder now?") exists.

### Act 3 — THE OFFER (`narrativeActs.ts:515–628`)
- **Shape:** Kael log reveal. Three narrative paths branch here — one of the
  highest-leverage acts for player agency.
- **Strong:** The `kael_lore_discovered` flag already feeds `companionComments`
  entries `cc_kael_discover` and `cc_kael_human` (both pre-existing).
- **Gaps:**
  - Each path (transparent / pragmatic / full-secret) deserves its own
    per-beat reactive line the way Act 1 handles role choice — currently the
    path fork fires a single wheel response and goes quiet.
  - No "Ask Elara about Kael's logs" follow-up chain. The existing
    `ask_elara_kael` / `ask_human_kael` topics gate on `kael_lore_discovered`
    but only carry one answer each — a follow-up per log entry would let the
    player pull the story out piece by piece.

### Act 4 — THE REVELATION (`narrativeActs.ts:646–893`)
- **Shape:** Three-path divergence (A: Willing Disclosure, B: Discovery, C:
  Betrayal). 14 steps — the largest act body.
- **Strong:** The three paths produce genuinely different Elara voices; the
  betrayal branch lands the strongest single scene in the codebase.
- **Gaps:**
  - No per-path reactive comment set — the other reactive comments all fire
    outside Act 4, leaving the act's biggest emotional beats unreinforced by
    the general companion-comment channel.
  - Ask topics: every topic here is implicitly gated by path, but no topic
    exists for "what was path B like" retrospective reads. Players on one
    path cannot ask about the others.
  - The Revelation reveals the Human's situation but there is no dedicated
    `ask_human_identity_progress` topic that surfaces the next bit of truth
    after Act 4.

### Act 5 — THE MAP (`narrativeActs.ts:902–989`)
- **Shape:** 5 steps — a navigational interlude. Links Act 4 resolution to
  the army recruitment system.
- **Strong:** Clean hand-off to the recruitment mission board.
- **Gaps:**
  - No reactive companion comments for the first time the player opens the
    map view. Elara would have a strong line here (she has been waiting
    seventeen thousand years to see these coordinates light up).
  - No ask-topic unlock for the star chart itself.

### Act 6 — THE CONFESSION (`narrativeActs.ts:997–1153`)
- **Shape:** The Human's identity reveal. 8 steps with 2 wheel_choices.
- **Strong:** The confession itself is one of the game's best-written scenes.
- **Gaps:**
  - No per-step reactive comments — the confession's aftermath would carry a
    lot of weight with even one Elara or Human toast in the minutes after.
  - `ask_human_who` currently returns the Act 1–6 deferral line. Act 6+ the
    answer should change — the current topic has no act-based alternate
    answer field.
  - The `both_narrators_trust_80` trigger already fires here for one line,
    but there is no Act 6 reactive companion set beyond that.

### Act 7 — THE CONVERGENCE (`narrativeActs.ts:1161–1263`)
- **Shape:** Final convergence. 6 steps.
- **Strong:** The final dialog is complete and strong.
- **Gaps:**
  - No mid-combat taunts or reactive banter for the convergence boss
    encounter equivalent of `act1OpponentDialog`. Final acts need their own
    per-opponent dialog tables in the same shape.
  - No Ask-topic unlocks for the post-convergence state. Topics still feel
    like Act 1 content because none have a `unlockedFromAct >= 6` answer.

## Recommended remediation (same template as Act 1 pass)

1. **Per-opponent dialog tables for Acts 3, 4, 6, 7.** Mirror
   `act1OpponentDialog.ts` for every scripted Act 3+ encounter. Highest
   leverage first: Act 4's betrayal encounter and Act 7's convergence boss.
2. **Reactive companion comments for Act 2–7 moments.** Extend
   `companionComments.ts` with `cc_act{N}_*` triggers for: first substrate
   ping, path fork (A/B/C), map first-open, army first-recruit, confession
   aftermath, convergence landing. Aim for ~15 new entries.
3. **Act-gated Ask topics and multi-act answer variants.** Add an
   `alternateAnswers?: Array<{ unlockedFromAct: number; answer: string }>`
   field to `CompanionAskTopic` so one topic can carry multiple
   act-progressed answers (the Act 6+ version of `ask_human_who` is the
   first concrete need).
4. **System tutors for Acts 2+.** `preludeSystemTutors` handles Mission
   Board / Inbox / Witnessing. Army recruitment (Act 5+), the star map
   (Act 5), and the confession journal (Act 6) all deserve parallel
   `systemTutors` entries in their own file.
5. **Cross-act Ask topic lattice.** Build `companionAskLattice.ts` that
   exposes a "what can I ask right now?" view filtered by act — this is the
   data side of the Q&A surface the audit keeps flagging and the prelude
   implementation partially solves.

## Verification

After remediation, these assertions should hold:

- `grep -c "TODO\\|FIXME\\|XXX\\|placeholder" apps/client/src/data/narrativeActs.ts`
  returns `0` (already true — keep it true).
- Every Act 2–7 scripted encounter has a sibling dialog-table file under
  `apps/shared/actNOpponentDialog.ts` with the same 12-field schema and a
  matching test.
- `companionComments.ts` contains at least one `cc_act{N}_*` entry for each
  act boundary transition (Act 2 first-step, Act 3 path fork, Act 4 per-path,
  Act 5 map-open, Act 6 confession, Act 7 convergence).
- `companionAskTopics.ts` contains at least one topic unlocked per
  `unlockedFromAct` value in `{2, 3, 4, 5, 6, 7}`.

## Pattern reuse — pointers for the remediation sprint

- Data layer template: `apps/shared/act1OpponentDialog.ts`
  (12 fields × N opponents, tests at `act1OpponentDialog.test.ts`)
- Reactive template: `apps/shared/companionComments.ts` entries for
  `prelude_beat_*` (21 lines, tests at `companionComments.test.ts`)
- Q&A template: `apps/shared/companionAskTopics.ts` +
  `toAskWheelChoice` adapter
- System-tutor template: `apps/shared/preludeSystemTutors.ts`
- UI wiring templates:
  `apps/client/src/components/companion/CompanionAskPanel.tsx`,
  `apps/client/src/components/companion/CompanionCommentToast.tsx`,
  `apps/client/src/components/prelude/PreludeTutorCard.tsx`,
  `apps/client/src/components/act1/Act1OpponentTauntOverlay.tsx`
