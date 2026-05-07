# Multi-Perspective Audit of Loredex OS / Dischordian Saga

## Context

Loredex OS is an unusually wide repo: ~810K lines of TypeScript across client / server / shared, a 7-act narrative with 362 LOREDEX entities, a 464-card TCG engine with 32 effect ops and 28 keywords, and a parallel chess multiplayer stack — plus ~98K lines of design docs and 19M of client-public assets. A blanket "review this codebase" is not actionable at that scale, and a single reviewer perspective (whichever one you happen to ask) systematically misses the failure modes other perspectives are tuned to catch.

The user wants a methodology that (a) covers every meaningful surface, (b) catches flaws *because* of perspective diversity, and (c) outputs concrete, prioritized remediations rather than abstract critique. This plan is that methodology — what perspectives to use, what each one is responsible for, how to dispatch them in parallel without duplicating work, how to triangulate findings, and how to convert them into ratcheted fixes that match the project's existing `pnpm ship:check` discipline.

This is a **plan for a recurring audit program**, not a one-shot review. Run it once to seed a baseline and a backlog; re-run cadenced slices on every release.

---

## What we already know (Phase-1 inventory)

Hard numbers from the inventory pass (use these to size each persona's scope):

| Surface | Magnitude |
|---|---|
| TS/TSX lines (apps/) | 810,230 across 3,379 files |
| Largest single file | `apps/db/schema.ts` — 7,050 lines |
| Top 20 files | dominate ~60K LOC (FightEngine2D, GameContext, ChessPage, cardGame router, episodeMysteries, moralityTrustActVariants…) |
| Tests | 704 `*.test.ts` / `*.spec.ts` files; vitest + Playwright |
| Dependencies | 88 prod + 34 dev; React 19 / Vite 7 / TS 5.9 / tRPC / Drizzle / Capacitor / Stripe / RevenueCat |
| CI | 7 GitHub workflows; no Dockerfiles |
| TODO/FIXME/HACK | 137 markers across `apps/` |
| Card defs | 464 cards, 17 faction dirs (Neutral 81, Architect 63, Thought Virus 53…) |
| Keywords | 28-value union; engine has 32 effect ops |
| LOREDEX entities | 362 (109 characters, 95 concepts, 23 locations, 22 events, 11 factions, 4 artifacts, 118 songs/transmissions) |
| VO manifests | 52 character/act manifests, ~7 act manifests |
| Acts in code | Act1/2/3/4/5/6/7 page entry points |
| Game-mode routers | ~30+ (TCG, 4× chess, PvP, coop, marketplace, guild, romance, transmedia…) |
| Ship-check ratchets | 6 TCG gates + DB FK gap (301) + economic transaction gap (12 routers) |

Phase-1 risk-surface scan confirmed the ratchets and surfaced numbers the audit must beat into shape:

| Risk surface | Reality |
|---|---|
| `as any` in apps/ | 417 instances |
| `@ts-ignore` / `@ts-expect-error` | 44 |
| Drizzle `references()` FKs declared | **6** (vs ~316 `*Id` columns — confirms the 301-gap ratchet) |
| `publicProcedure` count | 178 |
| `procedureRateLimit` callsites | **3** (the "rate-limit every public procedure" claim in CLAUDE.md is aspirational) |
| Hardcoded `dgrsart.s3` URLs | ~1,530 (helper exists; bypassed by `slideshowData`, `nilmorgPortraits`, `cabinArt`) |
| `Math.random()` in `apps/shared/tcg-core/` | 4 (incl. `ai/lookahead.ts`, `engine/rng.ts`) — replay determinism risk |
| Test files / source LOC | client 119/220K; server 166/124K; shared 450/4K |
| `aria-*` callsites | 411 + `accessibility-audit.spec.ts` already wired (a11y is actually a strength) |
| `.env` posture | `.env.example` only; secrets env-loaded; CORS uses `ENV.corsAllowlist` (good) |

## The 16 perspectives

Each persona is a self-contained Agent prompt (Phase-2 dispatch). They are grouped by axis so dispatch can fan out in waves of 3-4 in parallel without overlap.

### Wave A — Engineering hygiene (run in parallel)

1. **Staff engineer / architecture reviewer.** Reads the top-20 largest files plus `apps/server/routers.ts` and `apps/shared/tcg-core/` barrel. Looks for: god-files, leaky boundaries (`@shared` importing from `@/`), context-provider sprawl in `GameContext.tsx` (3,960 LOC), router composition rot. Flags places where a single file implies missing modules.
2. **Security engineer.** Confirmed gap: 178 `publicProcedure`s, 3 with rate limits. Enumerate the 175 unguarded routes, group by economic / read-only / mutation. Also: SSRF in `apps/server/spriteProxy.ts` (image-fetch path), WebSocket message validation in `apps/server/pvpWs.ts` and `chessMultiplayer.ts` (no replay guards observed), `Math.random()` in `apps/shared/tcg-core/ai/lookahead.ts` (server-side AI may leak strategy), Stripe + RevenueCat receipt-replay double-grant. Off-limits: a11y, perf, narrative.
3. **Database / backend engineer.** Reads `apps/db/schema.ts`. Confirmed: 6 declared FKs vs ~316 `*Id` columns. Enumerate the 310 missing FKs, group by table, mark which are *deletion-cascade dangerous* (orphans on user delete, deck delete, card delete). Validate the 12 untracked economic routers wrap mutations in transactions with appropriate isolation. Also: missing indexes on hot read paths (leaderboard, marketplace listings), `text` vs `varchar` length, utf8mb4 collation.
4. **Performance / bundle engineer.** Runs `vite build --report` (or analyzes the existing dist). Computes per-route bundle size, identifies if Three.js + Pixi.js + Stockfish ship together on first paint. Looks at the four ≥2,000-LOC client pages for re-render storms. Profiles `effectInterpreter.ts` worst-case fan-out (`foreach` × `sequence` nested ops in 464-card sample).

### Wave B — Quality + correctness (run in parallel)

5. **Test engineer / QA.** Computes test-to-source ratio per top-level dir; identifies dirs with <5% ratio. Checks whether the 704 tests actually cover the surfaces ship-check leaves at gap=0 vs trust the gate alone. Reads 5 random `*.test.ts` for assertion quality (snapshot abuse, `toBeTruthy` instead of specific assertions, missing negative cases). Audits Playwright suite for golden-path coverage of every game-mode router.
6. **DevOps / SRE.** Reviews `.github/workflows/*.yml`, the lack of Dockerfiles, and observability claims (Sentry/OTel "non-optional in prod" per ship-check). Confirms CI runs `pnpm check`, `pnpm lint`, `pnpm test`, `pnpm ship:check`, `pnpm lint:void-energy` on every PR; flags any that don't. Checks deploy story, secret rotation, asset-upload pipeline idempotency.
7. **Accessibility specialist.** Existing posture is good (411 `aria-*`, `accessibility-audit.spec.ts` with axe-core). Scope is therefore *depth*, not surface: keyboard navigation in `LoreTutorialEngine.tsx` and `MechanicTutorialOverlay.tsx`, color contrast under the Void Energy material system, motion-sensitivity (framer-motion + `prefers-reduced-motion`), screen-reader experience for the `9×5` Duelyst board, focus traps in modals. Recommend: graduate axe-core into a ratchet (`a11y.axe_violation_count`).
8. **Mobile engineer.** Capacitor build is in deps but no IaC for it. Validates `touch-action` on canvas surfaces (`FightEngine2D`, `DuelystGameUI`, chess), list virtualization in card collection / lore entries, store-SKU coverage across web/iOS/Android (ship-check claims this is gated).

### Wave C — Game + product (run in parallel)

9. **TCG designer.** Audits the 464 cards for: keyword distribution per faction (any underused keyword?), trial-category coverage (the 6-value union × Authority §5.8 9 phases — does every phase have answer cards in every faction?), curve / mana-cost / stat-budget outliers (the `tcg.card_stat_budget_coverage` gate exists for this — verify outlier list is current), rules-version drift in cards predating the current `RULES_VERSION`.
10. **RPG / systems designer.** Reviews progression: Identity Chains across 6 main characters × 7 acts, morality (`moralityTrustActVariants.ts` is 3,464 LOC — does it actually surface in choices, or is it a dangling state machine?), companion arcs (52 VO manifests), unlock conditions (`unlockCondition` 5-kind union), reward gating. Looks for narrative-flag producers that ship-check flags as missing.
11. **Narrative designer / writer.** Voice consistency across 52 VO manifests — sample 5 lines per character and check tonal drift between Act 1 and Act 7. LORE_BIBLE.md vs `loredex-data.json` drift (ship-check tracks this). Checks the canonical thesis ("the music IS the prophecy") is reinforced or undermined by Act 7 endings.
12. **Game economist.** Reads marketplace, tradeWars, trading, battlePass, packs. Models pack EV against rarity distribution (Common 172 / Uncommon 586 / Rare 206 / Epic 150 / Legendary 107 / Basic 14). Validates F2P-to-completion path is achievable. Audits Stripe + RevenueCat receipt validation, refund handling, regional pricing, and double-grant protection on receipt replay.

### Wave D — Outside-in (run in parallel)

13. **New player / playtester.** Walks the 6-gate card tutorial + Act 1 cold (no priors), then attempts to find the trial system without help. Reports jargon-overload moments (high — the inventory shows §-notation, Ne-Yon numbering, biblical references, identity-chain metaphors). Validates `LoreTutorialEngine` and `AutoTutorialPrompt` actually trigger when expected.
14. **Lore enthusiast / RPG veteran.** Reads the LORE_BIBLE.md and Act 1–7 in narrative order. Looks for: payoff (do early seeds reach late acts?), continuity (does Iron Lion imprint bleed-through respect the time-heist mystery?), depth (Disco Elysium-comparable inner voices, or stitched-on?), redundancy (95 "concepts" in LOREDEX is high — are they distinct?).
15. **Legal / compliance / IP reviewer.** License audit on 122 deps, font + sample licensing under `apps/client/public/`, age rating implications of psychological-horror voice, GDPR/CCPA stance for OAuth + Stripe + RevenueCat, S3 bucket public-read posture (`dgrsart` at `cdn/client-public/`), generated-content provenance for VO and asset-gen pipelines.
16. **Modder / community dev.** Reads card-definition format (`apps/shared/tcg-core/cards/definitions/<faction>/<id>.ts`) and asks: could a third party add a card without engine changes? Documents extension points (`expansionArt/` manifests, asset URL helpers) and the gaps. Tests whether `cardDefinitionSchema.parse()` rejects malformed inputs cleanly.

---

## Execution decisions (locked in)

- **Scope**: full 16-persona pass — all four waves dispatched.
- **Output location**: `audit/` directory at the repo root, on branch `claude/code-analysis-review-VS1ob`.
- **Final delivery**: commit the `audit/` tree (methodology + findings + priorities + new ratchet entries) and push to `claude/code-analysis-review-VS1ob`. No PR unless explicitly requested.

Concrete files produced:

```
audit/
  README.md                       — index + how to re-run
  methodology.md                  — this plan, copied/cleaned for the repo
  baseline-<YYYY-MM-DD>/
    ship-check.txt
    typecheck.log
    lint.log lint-void-energy.log
    tests.json
    bundle-sizes.json
    deps.json largest-files.txt
  personas/
    01-staff-engineer.md  …  16-modder.md   (one report per persona)
  findings.json                   — merged, with raised_by[] convergence array
  priorities-<YYYY-MM-DD>.md      — flat punch list, sorted by priority score
  ratchet-proposals.md            — new ship-check entries to add
```

## Methodology — five phases

### Phase 0: Baseline pinning (one-shot, ~15 min)

Run and snapshot, in `audit/baseline-<date>/`:

- `pnpm ship:check` (full table)
- `pnpm check` (typecheck baseline)
- `pnpm lint` and `pnpm lint:void-energy` (lint baseline)
- `pnpm test --reporter=json > tests.json` (test baseline)
- `git ls-files | wc -l`, top-20 largest files, dependency tree (`pnpm ls --depth=0 --json`)
- Bundle build: `pnpm build` and snapshot `dist/` size + per-chunk

Everything that follows is measured against this baseline so regressions across audit cycles are visible.

### Phase 1: Persona dispatch (parallelizable, ~30 min wall-clock)

Each of the 16 personas above maps to one Agent invocation. Prompt template (per persona):

> "You are <persona> reviewing Loredex OS. Scope is <files / dirs / commands>. Your job is to find <persona-specific failure modes>. Do NOT report what other perspectives cover (list of off-limits topics). Report under 600 words: top 5 findings, each with file_path:line, severity (critical/high/medium/low), and a concrete fix sketch. Skip generic advice — only repo-specific findings."

Dispatch in waves of 3–4 (matches the 4-Wave grouping above). Off-limits topics enforce non-overlap so two personas don't both flag the same `as any`.

### Phase 2: Triangulation (~1 hour)

Merge all 16 reports into `audit/findings.json`:

```ts
// shape
{
  id: "F-0042",
  finding: "...",
  file: "apps/server/routers/marketplace.ts",
  line: 312,
  severity: "high",
  raised_by: ["security_engineer", "game_economist", "db_engineer"],
  category: "economic_integrity",
  fix_sketch: "...",
}
```

The `raised_by` array is the headline signal: anything raised by ≥2 personas jumps the queue. This is the *whole reason* multi-perspective beats single-reviewer — convergent findings are almost never false positives.

### Phase 3: Prioritization (~30 min)

Score each finding `priority = (severity_weight × convergence_count) / fix_cost_estimate`. Bucket into:

- **P0 — fix this week**: critical or convergence ≥3.
- **P1 — fix this milestone**: high severity or convergence = 2.
- **P2 — backlog**: everything else.
- **P3 — won't-fix / by-design**: explicitly defended in writing.

Output: `audit/priorities-<date>.md` — a flat punch list, file paths and line numbers, no prose.

### Phase 4: Convert to ratchets (~1 day)

The repo already has the ideal lever for systemic findings: `apps/shared/_completeness/registry.ts` + `pnpm ship:check`. Every P0/P1 systemic finding (i.e. "X% of routers lack Y") gets a new ratchet entry, not a tracking issue. Concrete examples this audit will likely produce:

- `security.public_procedure_rate_limit_coverage` — declared = count of `publicProcedure`, implemented = count with rate limit middleware. Currently presumed, not measured.
- `security.zod_input_validation_coverage` — declared = count of mutation procedures, implemented = count with `.input(z.…)`.
- `a11y.aria_landmark_coverage` — declared = count of route-level pages, implemented = count with a `<main>` landmark.
- `client.bundle_route_budget` — per-route gzip ceiling; ratchet downward only.
- `tests.golden_path_coverage` — declared = count of game-mode routers, implemented = count with at least one Playwright test.

Per-finding non-systemic fixes become normal PRs against the `claude/code-analysis-review-VS1ob` branch.

### Phase 5: Cadence

- **Per PR**: `pnpm check && pnpm lint && pnpm lint:void-energy && pnpm test && pnpm ship:check` already required — verify and harden.
- **Weekly**: re-run Phase 1 wave A only (engineering hygiene drifts fast).
- **Per-act-ship**: re-run Phase 1 wave C (game/product) before declaring an act done.
- **Quarterly**: full 16-persona pass.

---

## Coverage strategy — "every line and every resource"

Reading 810K lines literally is wasted effort. The defensible way to claim line-level coverage:

1. **Top-20 files read in full** (~60K LOC, ~7% of repo, ~80% of complexity by Pareto).
2. **Pattern grep for the rest** — every persona has 3-5 ripgrep queries that enumerate their failure modes mechanically across all files. The security engineer doesn't read every router; they grep for `publicProcedure(` and audit the list. The DB engineer doesn't read every query; they grep for `db.execute(` template strings.
3. **Schema-driven coverage** — `cardDefinitionSchema.parse()` already validates 464 cards on registry build. Add equivalent schemas for VO manifests, expansion art manifests, LOREDEX entities (drift test claimed by ship-check). After this, "every resource is validated" becomes a CI claim.
4. **Asset coverage** — extend `scripts/_check-art-coverage.mjs` (currently 928 producer keys) to also HEAD-verify every `assetUrl(...)` callsite. The audit produces the gap list.
5. **Doc coverage** — diff `loredex-data.json` against `LORE_BIBLE.md` headings; the existing drift test (per ship-check) is the mechanism.

The output of the methodology is *not* "Claude read every line." It is: every line is reachable from a measured ratchet, a parsed schema, or a grepped pattern, and every gap is a P0/P1/P2 in the priority list.

---

## Critical files to read in full during Phase 1

For audit reviewers (human or agent) doing their first pass:

- `apps/db/schema.ts` (7,050 lines) — schema reviewer + DB engineer.
- `apps/server/routers.ts` (router composition map) — staff engineer + security engineer.
- `apps/server/routers/cardGame.ts`, `chess.ts`, `architectConsole.ts` — game-mode entry points.
- `apps/shared/_completeness/registry.ts` + `apps/shared/_completeness/ratchet-state.json` — ground truth on what's actually shipped.
- `apps/shared/tcg-core/cards/schema.ts`, `loader.ts`, `engine/version.ts`, `engine/effectInterpreter.ts` — TCG engine integrity.
- `apps/shared/tcg-core/types/Card.ts`, `Effect.ts`, `Trigger.ts`, `Targeting.ts` — engine type contracts.
- `apps/client/src/contexts/GameContext.tsx` (3,960 lines) — client state god-object.
- `apps/client/src/game/FightEngine2D.ts` (4,558 lines) — likely the worst architectural offender; flagged for staff engineer.
- `docs/DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md` — single source of truth per CLAUDE.md.

---

## Reused existing infrastructure

The audit deliberately rides on what's already in the repo rather than introducing new tooling:

- **`pnpm ship:check`** — ratchet engine for systemic findings.
- **`apps/shared/_completeness/registry.ts`** — where new ratchets land.
- **`pnpm lint:void-energy`** — already enforces design-system tokens; extend if a finding maps to it.
- **`scripts/_check-art-coverage.mjs`** — extend for full asset-callsite coverage.
- **`scripts/_vo-audit.mjs`** — already audits VO manifests; extend if narrative reviewer finds gaps.
- **`apps/shared/tcg-core/cards/schema.ts`** — Zod template for "schema every resource" goal.

No new frameworks, no new test runners, no new lint stacks.

---

## Verification — how we know the methodology worked

After one full pass:

1. `audit/findings.json` exists with ≥1 finding per persona (16+ findings; realistically 60-100).
2. `audit/priorities-<date>.md` exists, sorted, with file paths and line numbers — every entry is actionable, none are "consider improving X."
3. ≥3 new ratchets land in `apps/shared/_completeness/registry.ts`. `pnpm ship:check` shows them as RATCHET (not FAIL).
4. ≥1 P0 fix is committed on the `claude/code-analysis-review-VS1ob` branch with the new ratchet tightened, proving the loop closes.
5. The `convergence_count ≥ 2` subset of findings is published in a single document the team can read in <30 minutes — that document is the actual deliverable of "code review with multiple perspectives."

If steps 1–5 hold, the methodology is shown to find real flaws (because of multi-perspective convergence), produce real fixes (because of the ratchet integration), and be repeatable (because of cadence + reused infrastructure).
