# Acts 2–7 Dialog Completeness Audit

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
