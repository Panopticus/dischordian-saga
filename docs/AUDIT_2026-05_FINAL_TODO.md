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

- [ ] **`filterPlayerVisibleCards` / `isVisibleToPlayer` are uncalled outside their own tests** — Stop 8 — `apps/shared/tcg-core/cards/cardVisibility.ts` + `apps/shared/tcg-core/rewards/expansionUnlockService.ts` — the unified visibility helpers exist, are well-tested, and are correct, but no production surface invokes them. `apps/server/routers/cardGame.ts:128` (`browse`) returns all `isActive=1` rows without filtering by `unlockCondition`; `apps/client/src/pages/DeckBuilderPage.tsx:113` consumes `cardGame.browse` directly; pack-opening reward grants don't filter either. Result: act-gated S2 hierarchy cards (act_exclusives, special_editions, etc.) leak to fresh-save players. Fix needs a `PlayerExpansionState` accessor (server-side: read `userProgress.gameData.completedActs` + battle-pass tier + entitlements; client-side: cached over websocket), then `filterPlayerVisibleCards(rows, state)` at the end of `cardGame.browse`, the pack-opening pool builder, and reward-grant menus. Touches ~4 files but each is a small wrapper.

## Medium (degrades acts 2–7)

- [ ] **PvP queue has no bot-fallback for empty queue** — Stop 9 — `apps/server/duelystWs.ts:289-300` (setupDuelystWebSocket matchmaking loop) — `tryMatchPlayers()` pairs from a shared real-player queue every MATCHMAKING_INTERVAL_MS; if the player is alone in queue they wait forever. UX: solo testers and low-traffic-time visitors see "QUEUE_UPDATE position: 1" indefinitely. Recommended fix: after `QUEUE_TIMEOUT_BEFORE_BOT_MS` (e.g., 45s) of being alone in queue, dispatch the player into a single-player CADES match against a faction-appropriate AI opponent using DuelystAI.ts (already used for solo Act 1 ladder). Cleanup is already supported (`activeMatches.delete`, `playerConnections` mapping).

## Low (polish / juice)

- [ ] **Google login URL helper does not null-check missing client_id** — Stop 1 — `apps/client/src/const.ts:4-17` — `getGoogleLoginUrl()` builds a URL with `client_id=undefined` literally if `VITE_GOOGLE_CLIENT_ID` is unset, while `getDiscordLoginUrl()`/`getGitHubLoginUrl()` return `null` and let the caller hide the button. In a misconfigured deployment the Google button shows but leads to a broken Google OAuth page. Fix needs care: `getLoginUrl` (the deprecated alias) is called from ~10 sites that assume a string return. Recommended: add a parallel `isGoogleLoginAvailable(): boolean` helper, gate the button in `TitleStateUnauth.tsx:108-112` on it, leave `getGoogleLoginUrl()` untouched.
- [ ] **Imprint card art prompts incomplete (2/18 character sets populated)** — Stop 17 — `apps/shared/tcg-core/cardArtPrompts/imprint.ts:1763` — `IMPRINT_PROMPTS_LIST` covers Elara + Antiquarian only; the other 16 sets (agent_zero, akai_shi, foucault, iron_lion, locke, the_architect, the_collector, the_detective, the_dreamer, the_engineer, the_enigma, the_human, the_jailer, the_necromancer, the_oracle, the_source) have no prompts. Imprint cards reference the registry through `IMPRINT_CARD_ART_PROMPTS` so the absence is graceful — those cards just don't have art-generation guidance. This is content work (16 sets × multi-tier prompts each), not engineering, but tracked here so the gap is visible.

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
| 18 | 2026-05-04 | Asset + VO sweep | in-repo invariant tests pass; logged that real CDN HEAD-check + VO audit need credentialed CI run | 2 | _pending_ |
