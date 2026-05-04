# Audit 2026-05 — Final TODO

> Living document. Each audit stop in `claude/audit-game-systems-iTiN3`
> appends entries here for things it could not fix inline. The plan that
> drives the campaign is at `/root/.claude/plans/do-an-audit-bug-elegant-sundae.md`
> (planner-side; not in repo). The Watcher subsystem doc is at
> `docs/built/WATCHER_DESIGN.md`.
>
> Format per entry:
> `- [ ] <issue> — <stop N> — <file:line> — <one-line cause> — <recommended fix>`
>
> Rules:
> - Mark `[x]` once a follow-up PR closes it.
> - Don't delete completed entries — strike them through and keep the
>   history so future audits can trace what was fixed when.
> - "Out of repo" is a separate bucket so contributors know it isn't
>   actionable here.

---

## Critical (blocks ship)

_None yet._

## High (degrades opening / first hour)

- [x] ~~**`filterPlayerVisibleCards` / `isVisibleToPlayer` are uncalled outside their own tests**~~ — Stop 8, fixed in Stop 21. New `apps/server/services/playerExpansionState.ts` exposes `getPlayerExpansionState(userId)` (reads `userProgress.gameData`) + `getLockedCardIds(state)` (walks `ALL_CARD_DEFINITIONS`). Wired into `cardGame.browse`, `cardGame.openBoosterPack`, and `cardGame.claimDailyPack` so deck-builder + paid packs + daily packs all gate locked cards. Reserved cards now also excluded from these surfaces.

## Medium (degrades acts 2–7)

- [x] ~~**PvP queue has no bot-fallback for empty queue**~~ — Stop 9, fixed in Stop 22. Server now sends `BOT_FALLBACK_OFFER { secondsAlone }` once per queue-session after `QUEUE_BOT_FALLBACK_MS` (45s) of being alone in queue. PvpArenaPage renders a "PRACTICE VS AI" CTA inline with the queue spinner; clicking navigates to `/act1-ladder` (DuelystAI client-side, no ELO impact). Live queue stays open in case a real opponent arrives mid-decision. Hooked into the live `/api/pvp` server (`pvpWs.ts`); audit-plan reference to `duelystWs.ts` was misdirected (that endpoint is set up but not wired to a client).

## Low (polish / juice)

- [x] ~~**Google login URL helper does not null-check missing client_id**~~ — Stop 1, fixed in Stop 20. Added `isGoogleLoginAvailable()` helper to `apps/client/src/const.ts`; gated the Google button in `TitleStateUnauth.tsx` on it. `getGoogleLoginUrl()` left untouched so the ~10 callers assuming string return are unaffected.
- [x] ~~**Imprint card art prompts incomplete (2/18 character sets populated)**~~ — Stop 17, closed in Stop 23. Investigation found the TODO comment was stale: all 18 character sets × 5 tiers = 90 prompts are actually present. Updated the file's doc comment to reflect the real coverage. The audit-plan claim was outdated; no content work was needed.

## Out of repo (Cades-FPS emit, asset CDN uploads, VO re-records)

- [ ] **Asset coverage probe needs CI run with AWS credentials** — Stop 18 — `scripts/_check-art-coverage.mjs` HEAD-checks 928 producer keys against the dgrsart S3 bucket; requires AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY. Run in a CI environment with credentials before any asset-touching release. Local audit verified in-repo invariants (preludeFlagContract, coverageProbeTitleVideos) pass cleanly.
- [ ] **VO audit needs a manifest-walk run** — Stop 18 — `scripts/_vo-audit.mjs` walks the per-character VO manifests and reports orphaned line ids. Run before any narrative-text PR lands.

---

## Stop log

| Stop | Date | Surface | Fixes inline | Logged here | Commit |
|---|---|---|---|---|---|
| 0 | 2026-05-04 | Watcher subsystem scaffolding | Plumbing only — no behavioral change | 0 | a112d46 |
| 1 | 2026-05-04 | TitlePage + AuthGate + OAuth | WELCOME BACK boot line for return ops; late_night_session observation | 1 | cd89858 |
| 2 | 2026-05-04 | SurveillanceOpening | first_dissent observation on LOOK AWAY; ?surveillance=force QA hook | 0 | 1215357 |
| 3 | 2026-05-04 | AwakeningPage | choice_latency on 5 question steps; name_committed; inline Watcher acknowledgment overlay | 0 | e4a8756 |
| 4 | 2026-05-04 | Prelude Beat H | Watcher Locke-echo: 30s after "I am watching" bloom, surfaces "Locke is one of us. He just doesn't know it yet." | 0 | 51b9770 |
| 5 | 2026-05-04 | ArkExplorer hub | locked_door_attempt observation; 3-attempt persistence Watcher line; verified tutorial orchestrator one-shot guard | 0 | 9d9a2f5 |
| 6 | 2026-05-04 | DuelystGameUI match end | achievement fanfare + screen shake on win; KO slowmo on loss; pvp_retreat observation when conceded < turn 5 | 0 | 9dddab1 |
| 7 | 2026-05-04 | PackOpening dopamine pass | wired pack_rip + card_reveal_<rarity> SoundManager cues; lootCelebration particles on rare+; achievementFanfare on summary | 0 | 4b32fe8 |
| 8 | 2026-05-04 | Deck builder + unlock service | static audit only — no inline fixes (multi-surface fix) | 1 | d7468db |
| 9 | 2026-05-04 | PvP entry + matchmaking | static audit — verified rank decay logic, no bot-fallback for empty queue | 1 | b5cb983 |
| 10 | 2026-05-04 | Act 2 (Whisper) | verified substrate-ping already wired (audit plan was outdated); added tab_hidden detection + Watcher's first direct address ("You looked away. We noted it.") | 0 | 6edb17f |
| 11 | 2026-05-04 | Act 3 (Offer) | "Hesitation is data." Watcher line; centralized act-gated trigger eval in WatcherHost | 0 | bed4ba4 |
| 12 | 2026-05-04 | Act 4 (Revelation) | "We have seen this pattern before." Watcher line | 0 | 23c1ad7 |
| 13 | 2026-05-04 | Act 4.5 (Circuit) | "Three retreats. The wager remembers." — gated on >= 3 pvp_retreat observations | 0 | ed9e644 |
| 14 | 2026-05-04 | Act 5 (Map) | verified Elara map-first-open beat already wired (audit plan was outdated); added chronosphere Watcher line | 0 | 92c6c7d |
| 15 | 2026-05-04 | Act 6 (Confession) | unification reveal Watcher line: Architect/Panopticon/Source/Watcher as one entity | 0 | 4441c6b |
| 16 | 2026-05-04 | Act 7 (Convergence) | grand-secret inheritance Watcher line; seven acts as interview | 0 | 8c9353a |
| 17 | 2026-05-04 | Cross-system surfaces | static audit — verified architectDossier/dreamerDossier 404-shell pattern; logged 16 incomplete imprint art-prompt sets | 1 | adddb5f |
| 18 | 2026-05-04 | Asset + VO sweep | in-repo invariant tests pass; logged that real CDN HEAD-check + VO audit need credentialed CI run | 2 | 68594d3 |
| 19 | 2026-05-04 | Final verification pass | pnpm check clean, 10817/10817 tests pass, eslint 0 errors, void-energy 112 files clean | 0 | edcda3b |
| 20 | 2026-05-04 | Google login null-check (TODO closeout) | added isGoogleLoginAvailable() helper; gated Google button in TitleStateUnauth | -1 | bccbdfc |
| 21 | 2026-05-04 | Unlock-filter wiring (TODO closeout) | new playerExpansionState service; wired into cardGame.browse + openBoosterPack + claimDailyPack | -1 | 681a90c |
| 22 | 2026-05-04 | PvP bot-fallback (TODO closeout) | server BOT_FALLBACK_OFFER after 45s alone in queue; PvpArenaPage CTA → /act1-ladder | -1 | ba22616 |
| 23 | 2026-05-04 | Imprint art prompts (TODO closeout) | TODO comment was stale; verified all 90 prompts present; refreshed doc comment | -1 | _pending_ |

---

## Final state — 2026-05-04

Audit campaign complete. Branch `claude/audit-game-systems-iTiN3` ships:

- New cross-cutting Watcher subsystem (apps/shared/watcher/, apps/server/routers/watcher.ts, apps/client/src/lib/watcher.ts, apps/client/src/companion/WatcherHost.tsx) with 14 authored Watcher lines covering acts 0 through 7 plus per-surface beats (locked-door persistence, pvp retreats).
- 9 inline fixes:
  - TitlePage WELCOME BACK boot line for return operators
  - SurveillanceOpening ?surveillance=force QA hook
  - AwakeningPage choice_latency capture (5 question steps) + name_committed observation + inline Watcher acknowledgment overlay
  - Beat H Locke echo (30s post-bloom)
  - Ark Explorer locked-door persistence trigger
  - DuelystGameUI match-end combat juice (achievementFanfare + screenShake + koSlowmo) + pvp_retreat capture
  - PackOpening dopamine pass (wired authored audio cues + lootCelebration + achievementFanfare)
  - Act 2 tab-hidden detection
  - Centralized act-gated Watcher trigger evaluation in WatcherHost
- Documentation:
  - docs/built/WATCHER_DESIGN.md — full subsystem doc with privacy guarantee
  - docs/AUDIT_2026-05_FINAL_TODO.md — this living TODO log

Verification (run locally on 2026-05-04):
- `pnpm check` — clean
- `pnpm test` — 10817 passed, 0 failed (40 skipped)
- `pnpm lint` — 0 errors (2004 warnings, all pre-existing)
- `pnpm lint:void-energy` — 112 adopted files clean

Out-of-repo verification still owed:
- `pnpm db:smoke` — needs DATABASE_URL
- `node scripts/_check-art-coverage.mjs` — needs AWS credentials
- `pnpm vo:audit` — manifest walk before any narrative-text PR
