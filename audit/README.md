# Loredex OS / Dischordian Saga — Multi-Perspective Audit

**Date**: 2026-05-07
**Branch**: `claude/code-analysis-review-VS1ob`
**Personas dispatched**: 16
**Findings produced**: 86 total (14 convergent, 72 single-persona)
**Methodology**: parallel persona dispatch with explicit non-overlap → convergence triangulation → ratchet-backed remediation

---

## What this directory contains

```
audit/
├── README.md                       — this file (index)
├── methodology.md                  — the planning doc that drove the audit
├── findings.json                   — machine-readable findings + raised_by[]
├── priorities-2026-05-07.md        — flat punch list (P0/P1/P2/P3)
├── ratchet-proposals.md            — 11 ship-check entries to land
├── baseline-2026-05-07/            — pre-audit baseline numbers
│   ├── environment.md              — env limitations (no node_modules)
│   ├── largest-files.txt           — top 25 by LOC
│   ├── ratchet-state.json          — ship-check ground truth
│   ├── static-counts.txt           — grep baselines (publicProcedure, FK, etc.)
│   ├── deps.json                   — top-level dep listing
│   └── ship-check.txt              — would-be ship:check output (env unavailable)
└── personas/                       — 16 individual reports
    ├── 01-staff-engineer.md
    ├── 02-security-engineer.md
    ├── 03-db-engineer.md
    ├── 04-performance-engineer.md
    ├── 05-qa-engineer.md
    ├── 06-devops-sre.md
    ├── 07-accessibility.md
    ├── 08-mobile-engineer.md
    ├── 09-tcg-designer.md
    ├── 10-rpg-designer.md
    ├── 11-narrative-writer.md
    ├── 12-game-economist.md
    ├── 13-playtester.md
    ├── 14-lore-enthusiast.md
    ├── 15-legal-compliance.md
    └── 16-modder.md
```

## How to read this audit

**If you have 5 minutes**: read the "Convergence-first reading" section of `priorities-2026-05-07.md`. Six findings raised by ≥3 personas — those are where to start.

**If you have 30 minutes**: read `priorities-2026-05-07.md` end-to-end. Every entry has file:line and a fix sketch; nothing is "consider improving X."

**If you have 2 hours**: read the persona reports for the lanes you own (engineering / game / outside-in). Each is ≤900 words and structured the same way.

**If you want to run this again**: read `methodology.md`. The 16-persona dispatch is reproducible, parallelizable, and converges in ~30 minutes wall-clock.

## Headline findings (convergence ≥ 3)

These six are the highest-confidence systemic issues — each one was independently raised by 3 or 4 different personas looking at the codebase from non-overlapping angles:

| ID | Title | Personas |
|---|---|---|
| **C-02** | 175 of 199 publicProcedures have no rate limit; casino is exploitable | security + perf + economist |
| **C-03** | iapReceipt.verify is a stub — RevenueCat path grants nothing or replays infinitely | security + mobile + economist |
| **C-08** | Sentry/OTel "required in prod" but skip silently if SDKs missing — observability may be zero | security + perf + devops |
| **C-09** | E2E + unit tests run in CI but assert nothing meaningful (tautological matchers, no DB fixture) | qa + devops + a11y |
| **C-10** | Onboarding is a wall of jargon: 28 of 30 LORE_TUTORIALS never fire; no glossary; tutorials silent to AT users | a11y + writer + playtester + lore enthusiast |
| **C-12** | Authoring vs shipping gap: VARIANT_REGISTRY orphan, 5 stub VO manifests, 214 placeholder card flavors, lore-bible drift | tcg + rpg + writer + lore enthusiast |

C-10 and C-12 share a root cause that single-perspective review misses: **content is authored but not consumed; content is described but not shipped**. The methodology surfaced this *because* multiple personas looking at different surfaces saw the same shape.

## What's already strong (don't regress)

The audit also surfaced things that punch above their weight. Worth defending:

- **Path-flag payoff**: `act1_path_A`, `act3_partial_share`, `act3_full_secret` propagate into all four Act-7 stance epilogues with 12 distinct convergence variants. Disco Elysium-tier callback discipline. (14.F3)
- **Schema strictness**: `cardDefinitionSchema.parse()` with `.strict()` everywhere produces excellent error messages with offending card id + Zod path. Modder persona called this *"a beautiful piece of authoring DX"*. (16.F3 acknowledgement)
- **Reduced-motion handling**: `prefers-reduced-motion` honored across 30+ surfaces; the best-implemented a11y axis. (07 strengths)
- **Stripe webhook idempotency**: dual-layer protection (`processedWebhookEvents` + `storePurchases.stripePaymentIntentId` unique index). Solid. (12 convergence; 02.F4 partial — non-checkout events are the gap, not the architecture)
- **OAuth state CSRF**: 32-byte randomBytes + timing-safe compare in `oauth.ts:70-78`. (02 confirmed safe)
- **Code splitting**: 194 `lazy()` for 182 `<Route>`. Pixi/Stockfish correctly route-split + lazy. The bundle leak is one eager AppShellImmersive import — surgical fix. (04.F2)
- **CookieConsentBanner + DSR endpoints**: `exportMyData`, `deleteMyAccount` in `account.ts` already meet GDPR Art. 15/17/20 shape. (15 strengths)

## Methodology in one paragraph

Sixteen self-contained Agent prompts, each with explicit lane + off-limits topics, dispatched in 4 waves of 4 in parallel. Each wrote a structured Markdown report with `file:line, severity, finding, fix` per item. Reports were merged into `findings.json` with a `raised_by[]` array; convergence count is the priority signal. Systemic findings (≥2 personas) become ship-check ratchets, not GitHub issues — the existing ratchet mechanism is the right lever because it converts "we tracked this" into "CI catches this every PR."

## Re-run cadence

- **Per PR**: `pnpm check && pnpm lint && pnpm lint:void-energy && pnpm test && pnpm ship:check` (already required).
- **Weekly**: re-run Wave A only (engineering hygiene drifts fast).
- **Per-act-ship**: re-run Wave C before declaring an act done.
- **Quarterly**: full 16-persona pass.

To re-run the full pass: read `methodology.md` Phase-1 dispatch instructions. The persona prompts are committed alongside the reports for reproducibility.

## Limitations of this run

1. **No node_modules in audit env** — couldn't run `pnpm ship:check` / `pnpm test` / `pnpm build` directly. All findings are static (grep + AST + file inspection). The DevOps persona itself flagged this as a portability concern.
2. **Reports are agent-generated** — each is the work of one focused 5-15 minute pass. Treat as starting points for a human reviewer, not as final verdicts. The `priorities-2026-05-07.md` file:line citations are the verifiable part.
3. **Coverage claim** — "every line and every resource" is satisfied by ratchets + schema parsing + grep coverage of failure-mode patterns, not by literally reading 810K lines. See `methodology.md` Coverage Strategy section for the defense.
4. **One persona's 'severity: critical'** is calibrated against their lane, not a global scale. The triangulation step harmonizes by counting personas, not by averaging severity.
