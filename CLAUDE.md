# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo at a glance

Loredex OS — Dischordian Saga's narrative + tactical-card client. Monorepo, ~228K lines TypeScript across `apps/`. Single `package.json` at the root drives everything via pnpm 10.

```
apps/
  client/   React 19 SPA (Vite, Tailwind v4, framer-motion, wouter, Pixi.js, Three.js)
  server/   Express + tRPC (~50 routers) — entry: apps/server/_core/index.ts
  shared/   Cross-layer types + game logic. Notably apps/shared/tcg-core (the card engine).
  db/       Drizzle schema (MySQL). drizzle.config.ts at repo root.
  e2e/      Playwright config + tests.
  scripts/  Asset / VO / data tooling (40+ tsx scripts).
scripts/    Repo-level shell + node tooling (lint, audit, void-energy ratchet).
docs/       built/ (shipping), design/ (aspirational), production/ (asset-gen specs).
```

Path aliases: `@` → `apps/client/src`, `@shared` → `apps/shared`.

## Common commands

```bash
pnpm dev                  # one-shot dev: tsx watches apps/server/_core/index.ts;
                          # server hosts Vite middleware → http://localhost:5173
pnpm build                # vite build + esbuild server bundle into dist/
pnpm start                # NODE_ENV=production node dist/index.js
pnpm check                # tsc --noEmit (full repo typecheck — run before opening any PR)
pnpm lint                 # eslint
pnpm lint:void-energy     # Tier-3A token/state-protocol enforcement (see Void Energy below)
pnpm test                 # vitest run (~9400 unit tests; ~75s on a warm machine)
pnpm test:e2e             # Playwright (apps/e2e/playwright.config.ts)
pnpm db:push              # drizzle-kit push — diff schema → DB and apply
                          #   (idempotent; bypasses the migration journal,
                          #   safe on out-of-sync DBs)
pnpm db:generate          # drizzle-kit generate — author a journaled migration
pnpm db:migrate           # drizzle-kit migrate — apply journaled migrations in
                          #   order (use for production deploys with a known
                          #   journal; will refuse if reality diverged from it)
pnpm db:smoke             # apps/scripts/db-fresh-smoke.ts — full schema sanity
```

Run a single vitest file: `pnpm vitest run path/to/file.test.ts` (or pass a directory). Watch mode: `pnpm vitest path/to/file.test.ts`.

## tRPC + server architecture

`apps/server/_core/` holds the bootstrap layer (Express setup, OAuth, tRPC context, env, Vite middleware, LLM/SDK adapters). The root tRPC router is **`apps/server/routers.ts`** — a single 350-line file that composes ~30 feature routers from `apps/server/routers/`. New feature work usually means adding one router file there + registering it in `routers.ts`.

WebSocket surfaces (PvP card duels, chess multiplayer, sprite proxy, chess multiplayer) are wired in `apps/server/_core/index.ts` alongside the Express app; they live in their own files at `apps/server/`.

## Card-game engine (`apps/shared/tcg-core`)

This is the largest cohesive subsystem; understanding it unlocks half the codebase.

- **Card definitions** live one-file-per-card under `apps/shared/tcg-core/cards/definitions/<faction>/<id>.ts`. Multi-tier characters (imprints, allegiances) put all tiers in one file and export an array. The barrel is `apps/shared/tcg-core/cards/index.ts` — every card def must be imported and spread into `ALL_CARD_DEFINITIONS`.
- **Static shape**: `apps/shared/tcg-core/types/Card.ts` (CardDefinition interface, Faction/Rarity/Keyword/TrialCategory unions). Effect trees: `types/Effect.ts` + `types/Trigger.ts` + `types/Targeting.ts`. Effects are **serialisable, no functions** — abilities are `op` discriminated unions (`deal_damage`, `buff`, `summon`, `foreach`, `sequence`, etc.) the engine interprets.
- **Validation**: `apps/shared/tcg-core/cards/schema.ts` is the Zod source of truth; `loader.ts` runs every CardDefinition through `cardDefinitionSchema.parse()` at registry build. Every object is `.strict()` — typos in field names blow up loudly.
- **RULES_VERSION**: every card carries a `rulesVersion`; `engine/version.ts` exports the current `RULES_VERSION`. Bumping the engine in a way that changes effect interpretation requires a version bump and a replay-pin so replays don't drift.
- **Expansion art manifests** (`apps/shared/expansionArt/`) are typed registries of producer-uploaded asset slugs. New drops add a manifest module + URL helper there; cards reference art via `assetUrl(...)` or the helper.

## Asset CDN

All image / audio / video / music / sample assets are served from **dgrsart S3 (us-east-2)** at the prefix `cdn/client-public/`, mirroring `apps/client/public/{art,audio,videos,music,games}` 1:1. Resolve paths via:

```ts
import { assetUrl } from "@/lib/assetUrl";
assetUrl("art/cards/...");  // → https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/cards/...
```

Upload pipeline: `pnpm assets:upload:dry` then `pnpm assets:upload` (apps/scripts/upload-public-to-s3.ts; idempotent ETag compare). Coverage probe across all expansion manifests: `pnpm tsx scripts/_check-art-coverage.mjs` (currently HEAD-verifies 928 producer keys).

## Voice-over pipeline

VO has its own per-act + per-character generators (`pnpm vo:act2`...`vo:act7`, `pnpm vo:companion`, etc.) that read `apps/scripts/<character>-lines.json` and write to `apps/shared/<character>VoManifest.json`. The full sweep is `pnpm vo:run-all`. Coverage audit: `pnpm vo:audit` (script: `scripts/_vo-audit.mjs`). All generators are idempotent — existing manifest entries are skipped.

## Void Energy design system (Tier 3A)

The codebase is mid-migration to a physics-based theming system (`glass | flat | retro` materials). Adoption is ratcheted via **`.void-energy-adopted`** — a flat list of paths under enforcement. Once a file is in that list:

- Raw hex / rgb / hsl literals are forbidden — use design tokens.
- Tailwind colour-ramp utilities (`text-amber-400`, etc.) are forbidden.
- Raw pixel values must be in the allowlist (0-3px) or use spacing tokens.
- State must live in `data-*` / ARIA attributes, never in utility classes (`is-active`, `is-open` flagged).

Enforcement: `pnpm lint:void-energy`. Per-line escape hatches: `// void-ignore` (next line) or `// void-ignore` end-of-line. Migrate a file in: append it to `.void-energy-adopted` then run `pnpm migrate:void-energy`.

## Documentation hierarchy

When writing or following design intent:

- **`docs/DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md`** is the single source of truth. If it disagrees with another doc, the bible wins; if it disagrees with shipping code, the code wins (and the bible needs updating).
- `docs/built/LORE_BIBLE.md` — canonical lore for shipping content (10K+ lines).
- `docs/design/` — aspirational / roadmap; check `ARCHITECTURE_PROPOSAL.md`, `NARRATIVE_ARCHITECTURE.md`.
- `docs/production/` — asset-generation specs (art, voice, music). `ASSET_URLS.md` enumerates CDN-hosted hero assets.
- `docs/narrative-audit/` — DOC1..DOC5 narrative-system audits (LOREDEX in DOC4 is the canonical entity reference).

## Conventions worth knowing

- **`as CardDefinition["id"]` casts** in card files are intentional — they let authors write the human-readable id while keeping the engine's branded `CardDefId` type private.
- **`trial_categories` arrays must be sorted** in canonical order (confession < defensive < evidence < narrative < offensive < reactive). The `resolveTrialCategories.test.ts` invariant enforces this.
- **`reserved: true`** on a CardDefinition means the engine knows the card but pack-opening / deck-builder / reward surfaces filter it out (`isReservedCard()`). Use for retroactively-delivered cards (`burnt_card_placeholder`).
- **`unlockCondition`** (added in #265) gates cards behind player progression (act_completion / secret / battle_pass / founding_author / authors_edition); evaluated by `apps/shared/tcg-core/rewards/expansionUnlockService.ts`.

## Definition of Shipped — `pnpm ship:check`

A subsystem in this repo is **shipped** when its declared contract (a discriminated union, an enum, a registry, a Zod schema kind, a `references()` declaration) has a runtime that honors every declared item — and a parity test exists to prove it. Scaffolding without runtime is **tracked**, not shipped. The two are not the same.

The gate is `pnpm ship:check`. It walks `apps/shared/_completeness/registry.ts`, runs each subsystem's parity check, and prints a single table:

```
Subsystem                          Declared  Implemented  Gap  Status
effect.op handlers                       26           26    0  PASS
Keyword.* combat behaviors                9            8    1  FAIL  (drain)
trial_categories coverage               475            7  468  RATCHET
```

- **PASS** — declared count equals implemented count; hard parity met.
- **RATCHET** — gap > 0 but ≤ the recorded ceiling in `ratchet-state.json`; allowed but tracked. Cannot regress.
- **FAIL** — gap > 0 with no ratchet config, or gap exceeds the recorded ceiling. CI fails.

### Rules for Claude

When working in this repo, before declaring any subsystem, feature, or task complete:

1. **Run `pnpm ship:check` and quote the relevant rows.** Do not say "done" without showing the gate's output. If the relevant rows show PASS, the user has a verifiable answer. If they show RATCHET or FAIL, name the gap explicitly.
2. **Adding new declared types/enums/registries requires a parity test in the same change.** If you add a new variant to a discriminated union, a new enum value, a new schema kind, a new `references()` site, you must also add (or extend) the corresponding entry in `apps/shared/_completeness/registry.ts`. New scaffolding without coverage is itself a ship-check failure waiting to happen.
3. **Do not silence the gate.** Resist the urge to add `--update-ratchet` after introducing a regression. The flag exists for tightening (recording an improvement), not for normalizing slippage. If the ceiling has slipped, fix the implementation or push a separate PR with explicit reviewer sign-off.
4. **The gate exists because of an information-asymmetry bug.** Patterns I (Claude) infer from file structure are not equivalent to patterns I read from source. The gate makes "is the runtime actually wired" a mechanical check both of us can run. Treat it as the contract.

Subsystems landing under the gate (rolled out incrementally — see `/root/.claude/plans/now-develop-a-plan-purring-origami.md`):

- Card engine: Effect ops, Trigger kinds, Keyword behaviors, Condition kinds, CardUnlockCondition UI surfaces, narrative-flag producers, replay determinism, stat budget, trial_categories coverage.
- DB: foreign-key coverage on every `*Id` column.
- Server: observability wiring (Sentry/OTel non-optional in prod), per-IP rate limit on every `publicProcedure`, transaction wrapping on economic surfaces.
- Mobile: canvas `touch-action`, list virtualization, store SKU coverage across web+iOS+Android.
- Lore: `LORE_BIBLE.md` regenerated from `loredex-data.json` (drift test).
