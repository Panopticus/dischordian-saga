# Continuity Editor — Audit

_Date: 2026-05-16 · Lens: cross-branch contradiction (not coverage)_

## Persona briefing

I read this codebase as a film continuity editor / script supervisor reads
a shooting script with divergent takes: not "is the line recorded?" (that
is DOC1–5's job) but "does take B contradict the world-state take A
established?" My unit of concern is the **seam** — where branches
reconverge, where a knowledge/death/relationship state set on one path is
read by narration that a different path also reaches. Completeness audits
pass a scene if the line exists; I fail a scene if the line is true on a
path that should have made it false. Precision over volume: every finding
below names both contradicting locations, the playthrough path that
exposes it, and whether I read both sources or am inferring.

## Sources cross-read

- `apps/shared/moralityTrustActVariants.ts` (3800 lines) — variant
  registry + `resolveVariant`/`gatesMatch` resolver. Read in full
  structurally; resolver logic read line-by-line (246–317).
- `apps/shared/companionComments.ts` — Act 3/4/5 path-fork aftermath
  beats, esp. the Path A/B/C Elara/Human pairs (236–360).
- `apps/client/src/hooks/useVariant.ts` — how `trustByCompanion` /
  `elaraTrustLevel` feeds the resolver (40–100).
- `apps/shared/act4OpponentDialog.ts` — Path-C "Elara, Betrayed" branch
  selection (`act3_full_secret` → `ELARA_BETRAYED`).
- `apps/shared/actBranchingContract.test.ts` — the only existing
  branching invariant test (ask-topic pairing only).
- `apps/shared/episodeMysteries.ts` (8124 lines) — mystery roster:
  Necromancer/Varkul/Akai Shi, Wraith Calder, Jericho, Syl'Vex.
- `docs/built/LORE_BIBLE.md` — Akai Shi / Red Death / Necromancer canon
  (lines 79–87, 595–599, 726–747, 1184).
- `apps/shared/eraTimeline.ts` — era cross-anchoring invariant (Phase H4).
- Tooling run: `scripts/_check-entity-names.mjs` → 0 unknown candidates
  (one non-fatal regex warning). `pnpm lore:check` →
  **"LORE_BIBLE.md matches generator output"** (no canon/data drift).
  `pnpm ship:check` did not run cleanly in this environment (ELIFECYCLE,
  env-level, not a content failure).

## Findings

### Finding 1 — Warm/confidant Elara variant lines fire after the Path C betrayal — P0, confirmed

- **Source A (relationship fractured):**
  `apps/shared/companionComments.ts:319` —
  `cc_act4_pathC_betrayal_elara`, trigger `act4_pathC_complete`:
  _"You lied to my face about the substrate. Not once. Many times. I am
  still standing at my post. **That is not forgiveness. It is training.**"_
- **Source B (relationship intact, contradicting):**
  `apps/shared/moralityTrustActVariants.ts:509–518`
  (`cabin_act5_warm_elara`, Act 5: _"Elara has left a book on your
  pillow… She has already decided you will [read it]."_) and
  `:434–442` (`bridge_act6_confidant_elara`, Act 6: _"Elara is reading
  poetry at the navigation console… She does not apologise."_).
- **The contradiction:** the resolver `gatesMatch`
  (`moralityTrustActVariants.ts:264–285`) supports only **positive**
  `requiredFlags`. There is no negative/forbidden-flag gate. Both Elara
  intimacy variants are gated solely on `trust: "warm"|"confidant"` for
  `elara`. Trust is a single global scalar (`useVariant.ts:65–69`
  `trustByCompanion.elara = state.elaraTrustLevel`), and **no server or
  shared module reduces Elara trust on Path C** — `grep` for
  `act4_pathC_complete` / `act4_broken_trust` finds zero trust-mutating
  handlers in `apps/server/`. A player who builds Elara bond high in
  Acts 1–3, then chooses full-secret → betrayal in Act 4, keeps a high
  `elaraTrustLevel`, so Acts 5–7 cabin/bridge narration tells them Elara
  is leaving them poetry and books — immediately after she told them
  "that is not forgiveness."
- **Exposing path:** Act 1–3 high-Elara-bond play → Act 3 "full secret"
  (`act3_full_secret`/`act3_path_full_secret_chosen`) → Act 4 Path C
  (`act4_pathC_complete` / `act4_broken_trust`) → enter Cabin in Act 5 or
  Bridge in Act 6. A betrayal-route player who was warm with Elara
  pre-betrayal is the *expected* Path C player, so this is reachable in a
  single ordinary playthrough.
- **real?** Confirmed — read both sources, traced the resolver, and
  confirmed no trust-decrement exists for the Path C flags. The existing
  branching test (`actBranchingContract.test.ts`) only checks ask-topic
  pairing, so nothing guards this.

### Finding 2 — `bridge_act4_pathC` exists but no Path C lock propagates past Act 4 — P1, confirmed

- **Source A:** `moralityTrustActVariants.ts:423–432` `bridge_act4_pathC`
  is correctly gated `requiredFlags: ["act4_broken_trust"]` (the one
  place the betrayal flag *is* respected) — proving authors know the flag
  exists and is the intended gate.
- **Source B:** Every Act 5+ Elara/relationship variant
  (`cabin_act5_warm_elara` :509, `bridge_act6_confidant_elara` :434,
  `engineering_act6_humanity` :477 referencing Elara's hum, etc.) omits
  any `act4_broken_trust`/`act4_reconciled` requirement.
- **The contradiction:** the betrayal state is honored exactly once
  (Act 4 bridge) and then silently dropped; post-Act-4 narration
  reconverges to a single warm continuity regardless of whether the
  player took Path A (reconciled) or Path C (broken). This is the
  classic "choice that the script promises matters but reconverges to
  identical state" — both a continuity defect and a player-trust defect:
  Path C's `act4_broken_trust` becomes cosmetic after Act 4.
- **Exposing path:** any Path C playthrough that revisits relationship
  surfaces in Acts 5–7 (superset of Finding 1's path).
- **real?** Confirmed — the asymmetry (one flag-gated variant vs. zero
  flag-gated successors) is visible directly in the registry.

### Finding 3 — Akai Shi "killed at Thaloria" vs. alive as Red Death killing the Necromancer — investigated, NOT a contradiction (P3 doc-clarity only)

- `episodeMysteries.ts:831` (Jericho killed Akai Shi at Thaloria) vs.
  `:5391` (`suspect.akai_shi_red_death` … `killer-of-canonical-record`
  of the Necromancer, present tense, inside the Matrix).
- **Verdict:** reconciled by canon. `LORE_BIBLE.md:747` states Akai Shi
  "was resurrected and transformed into the Red Death… ultimately ending
  [the Necromancer's] millennia-long evasion of fate within the Matrix
  of Dreams." Death → resurrection → Red Death is intended canon, not
  drift. Flagged P3 only because the Necromancer suspect graph
  (`episodeMysteries.ts:5391`) labels the relation
  `killer-of-canonical-record` without an inline resurrection
  breadcrumb; a reader of that file alone could mis-flag it. Not
  player-facing.
- **real?** Confirmed both sources read; confirmed NOT a contradiction.

### Finding 4 — Wraith Calder "died at the wall" vs. margin notes centuries later — NOT a contradiction (no finding)

`episodeMysteries.ts:224` ("a man who should have died at the wall is
leaving margin notes in journals dated centuries after his obituary").
This is the *deliberately investigated paradox* of `mystery.wraith_calder`
(resolved E2: he was resurrected via the protocols he expropriated), not
a continuity slip. Era cross-anchoring (`eraTimeline.ts:358–407`,
Phase H4) has an explicit `paradoxicalEras` invariant. No timeline
contradiction found on spot-check.

## Top concern

**Finding 1 (P0).** The morality/trust act-variant resolver has no
negative-flag gate, and nothing decrements Elara's trust scalar when the
player betrays her on Path C. The result is a player who chooses the
betrayal route — the saga's headline Act-4 branch — being told, in their
own cabin in Act 5 and on the bridge in Act 6, that Elara is leaving them
poetry and marked-up books, one act after the script had her say "that is
not forgiveness." This is immersion-breaking, reachable in a single
ordinary betrayal playthrough, and structurally guaranteed (not
probabilistic) for any player who was warm with Elara before betraying
her. The cheapest correct fix is an optional `forbiddenFlags` field on
`MoralityTrustActVariant` enforced in `gatesMatch`, plus tagging every
Elara-intimacy variant ≥ Act 5 with `forbiddenFlags: ["act4_broken_trust"]`
(or, better, decrementing `elaraTrustLevel` when `act4_pathC_complete`
fires) — and a branching-contract test asserting no warm/confidant
companion variant resolves while that companion's betrayal flag is set.
