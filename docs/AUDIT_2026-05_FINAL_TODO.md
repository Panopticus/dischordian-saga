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

_None yet._

## Medium (degrades acts 2–7)

_None yet._

## Low (polish / juice)

- [ ] **Google login URL helper does not null-check missing client_id** — Stop 1 — `apps/client/src/const.ts:4-17` — `getGoogleLoginUrl()` builds a URL with `client_id=undefined` literally if `VITE_GOOGLE_CLIENT_ID` is unset, while `getDiscordLoginUrl()`/`getGitHubLoginUrl()` return `null` and let the caller hide the button. In a misconfigured deployment the Google button shows but leads to a broken Google OAuth page. Fix needs care: `getLoginUrl` (the deprecated alias) is called from ~10 sites that assume a string return. Recommended: add a parallel `isGoogleLoginAvailable(): boolean` helper, gate the button in `TitleStateUnauth.tsx:108-112` on it, leave `getGoogleLoginUrl()` untouched.

## Out of repo (Cades-FPS emit, asset CDN uploads, VO re-records)

_None yet._

---

## Stop log

| Stop | Date | Surface | Fixes inline | Logged here | Commit |
|---|---|---|---|---|---|
| 0 | 2026-05-04 | Watcher subsystem scaffolding | Plumbing only — no behavioral change | 0 | a112d46 |
| 1 | 2026-05-04 | TitlePage + AuthGate + OAuth | WELCOME BACK boot line for return ops; late_night_session observation | 1 | cd89858 |
| 2 | 2026-05-04 | SurveillanceOpening | first_dissent observation on LOOK AWAY; ?surveillance=force QA hook | 0 | 1215357 |
| 3 | 2026-05-04 | AwakeningPage | choice_latency on 5 question steps; name_committed; inline Watcher acknowledgment overlay | 0 | _pending_ |
