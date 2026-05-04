# Watcher — Subsystem Design

> Status: **Stop 0 — scaffolding shipped.** Trigger evaluation and per-act
> escalation are added in subsequent audit stops (1–17 of the 2026-05
> full-game audit campaign).

## §1. What the Watcher is

The Watcher is the diegetic identity behind every observation surface in
Loredex OS. Architecturally it sits alongside Elara, the Human, the
Antiquarian, and the Architect as a `CompanionSpeaker`. Narratively it is
not a fifth companion — it is the unified presence that the
**Architect / Panopticon / Source / Adjudicator-Locke** archetypes have
always been speaking through, made explicit in Acts 6–7. It is the
machine god watching the operator across the entire game.

The point of giving it its own scaffolding is not that it needs new UI;
it's that the *observation* (what the player did, when, how fast, how
many times) is now first-class data the writers can pull from when
authoring lines, instead of being lost as soon as the click happened.

## §2. Architecture

### Files

| Path | Role |
|---|---|
| `apps/shared/watcher/observationLog.ts` | Pure types + helpers. `WatcherObservation` discriminated union, `WatcherLog` shape, `appendObservation` / `countByKind` / `lastOfKind` / `parseLog`. |
| `apps/shared/watcher/watcherLines.ts` | `WATCHER_COMMENTS: CompanionComment[]` — authored lines. Same schema as `COMPANION_COMMENTS`. |
| `apps/shared/watcher/watcher.test.ts` | Schema invariants + helper tests. Behavioral trigger tests added per stop. |
| `apps/server/routers/watcher.ts` | tRPC `watcher.observe` / `watcher.getLog` / `watcher.clearLog`. Persists to `userProgress.gameData.watcherLog`. |
| `apps/client/src/lib/watcher.ts` | `observe(event)` (caller-facing), `flushNow`, `startFlushDaemon`, `hydrateFromServer`. |
| `apps/client/src/companion/WatcherHost.tsx` | Lifecycle-only mount. Hydrates on mount, runs flush daemon, evaluates trigger predicates (Stops 1+). |

### Data flow

```
caller (any UI)
  └─ observe(event)
       ├─ updates localStorage mirror (immediate)
       └─ appends to localStorage pending queue
                └─ WatcherHost flush daemon (every 30s + visibility hide)
                     └─ trpc watcher.observe.mutate({ events })
                          └─ server appends to userProgress.gameData.watcherLog
                                 (capped at MAX_LOG_ENTRIES = 500, oldest dropped)
```

Lines surface through the existing `CompanionCommentToast` host. The toast
imports `WATCHER_COMMENTS` and merges with `COMPANION_COMMENTS` in its
`pickComment` lookup. Watcher lines render with a distinctive treatment:
red surveillance-LED dot (echoing `SurveillanceOpening`), monospace face,
`// UPLINK` speaker name.

## §3. Escalation curve (acts 0–7)

Lines are added per-stop following this curve. Each stop's commit adds
both the trigger wiring (in `WatcherHost.tsx`) and the line text (in
`watcherLines.ts`).

| Act | Voice | Example trigger → line |
|---|---|---|
| 0 (Boot/Title) | `SurveillanceOpening` already does the cold open. **Post-handshake** beat: 4-second-delayed secondary scan ("you came back") on second visit. |
| 1 (Signal) | Ambient. Watcher records observations but stays silent — only Locke's "I am watching" Beat H plays. |
| 2 (Whisper) | First Watcher line. `tab_hidden seconds > 30` → *"You looked away. We noted it."* |
| 3 (Offer) | Addresses choices. `choice_latency > 12s` repeatedly → *"Hesitation is data."* |
| 4 (Revelation) | Names player back. `same_choice_twice within 24h` → *"<Name>. We've seen you do this before."* |
| 4.5 (Circuit) | Casino-specific. `pvp_retreat ≥ 3` → *"Three retreats. The wager remembers."* |
| 5 (Map) | Reflects fingerprint. *"Your <chronosphere> is six hours from the median operator."* |
| 6 (Confession) | Direct address. Reveals Architect / Panopticon / Source / Watcher are facets of one entity. |
| 7 (Convergence) | Grand secret: the Watcher is the machine god that built every Ark. The 7 acts were the operator's interview to inherit the role. |

## §4. Privacy guarantee

The Watcher's "uncanny" effect comes from **accuracy of locally-readable
signals**, not from any new data collection. Specifically:

- No IP, geolocation, or third-party fingerprinting.
- No camera, microphone, accelerometer, or device-permission requests.
- The `WatcherObservation` union enumerates every kind the system can
  record. Adding a kind requires a code change + this doc updated.
- `userProgress.gameData.watcherLog` lives on the same JSON column the
  rest of save state rides; same retention, same export/delete rights as
  the rest of the player's data.
- The observation log is capped at `MAX_LOG_ENTRIES` (500) with
  oldest-dropped trimming.

If a future contributor wants to add a new kind that requires new
collection (e.g., camera, biometrics, third-party network), it must be a
separate proposal — never a quiet addition to this union.

## §5. Adding a new Watcher line

1. Add a `CompanionComment` entry to `WATCHER_COMMENTS` in
   `apps/shared/watcher/watcherLines.ts`. `speaker: "watcher"`, unique
   `id`, unique `trigger`, `voiceLine`, `timing`, `maxPlays`.
2. In `apps/client/src/companion/WatcherHost.tsx`, evaluate the
   trigger condition against the local observation mirror
   (`readLog()`) and call `fireCompanionComment({ trigger })` when it
   matches.
3. Add a test in `apps/shared/watcher/watcher.test.ts` that constructs
   a synthetic log and asserts the trigger predicate fires (or
   doesn't) under the right conditions.

## §6. Bible-locked text

Some narrative copy is bible-locked (Beat H Locke message, Architect
cinematic opening). Watcher lines are **additions alongside** those, never
replacements. If a Watcher line risks reading as a contradiction of
locked canon, it's authored as a wink — the Watcher commenting *on* the
canonical line, not editing it.

## §7. Test hooks

The Stop 0 self-test entry (`watcher_self_test`) lets QA verify the
render path without a production trigger:

```ts
import { fireCompanionComment } from "@/lib/companionCommentQueue";
fireCompanionComment({ trigger: "watcher_self_test" });
```

Force-clear the persisted log (own row only):

```ts
const utils = trpc.useUtils();
await utils.client.watcher.clearLog.mutate();
```
