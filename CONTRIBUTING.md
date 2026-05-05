# Contributing to Loredex OS / Dischordian Saga

## Day 1

### Setup

```bash
# Node 22+, pnpm 10+ (project pins via packageManager).
pnpm install --frozen-lockfile

# Fastest dev loop — single tsx watch + Vite middleware.
pnpm dev   # http://localhost:5173

# Common checks (the same ones CI runs).
pnpm check          # tsc --noEmit (~30s warm)
pnpm lint           # eslint
pnpm lint:void-energy   # token / state-protocol ratchet
pnpm test           # vitest, ~9400 unit tests, ~75s warm
pnpm test:e2e       # Playwright (auth-gated; needs JWT_SECRET)
```

### Required environment

For the full local experience you need a MySQL instance and OAuth
credentials. For most code work the in-memory DB fallback covers
typecheck + unit tests. See `.env.example` for the full list.

The minimum to reach the title screen:

```
DATABASE_URL=mysql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET=any-32-char-string-fine-in-dev
VITE_GOOGLE_CLIENT_ID=...   # same id, exposed to client
```

### Where things live

- `apps/server/_core/` — bootstrap (Express, OAuth, tRPC context, env, Vite)
- `apps/server/routers/` — feature routers; one file per surface
- `apps/server/routers.ts` — top-level composition (350 LOC; keep
  it lean, add new routers there)
- `apps/server/services/` — business logic extracted from routers
- `apps/shared/tcg-core/` — card engine. **Read its README first**
  before editing — `engine/`, `cards/`, `types/Effect.ts`
- `apps/client/src/` — React 19, Vite, Tailwind v4, framer-motion,
  wouter
- `apps/client/src/contexts/GameContext.tsx` — god-context being
  decomposed into `apps/client/src/stores/*` Zustand stores; new
  state should land in a store, not the context
- `apps/db/schema.ts` — Drizzle schema (split planned)
- `apps/scripts/` — VO + asset pipeline scripts
- `docs/` — all design + production + audit docs
- `docs/legal/` — vendor list + retention policy
- `docs/operations/` — runbooks (incident, Stripe, etc.)
- `docs/adr/` — architecture decisions

### Conventions

- **No comments narrating what code does.** Names should carry
  meaning. Comments are for hidden constraints, subtle invariants,
  or the "why" of an unexpected workaround.
- **Currency-bearing mutations must be transactional.** Atomic
  conditional UPDATEs (`WHERE balance >= cost`) over
  read-then-write.
- **All WS surfaces authenticate via session cookie.** See
  `apps/server/_core/wsAuth.ts`. Never trust a client-supplied
  `userId`.
- **Server-side Zod schemas for every mutation input.** `z.any()`
  / `z.unknown()` are red flags.
- **Use `protectedProcedure` for any state-changing call.**
  `adminProcedure` for admin-only. `publicProcedure` only for
  reads or unauth-by-design (login start, public catalog).
- **Card definitions live in `apps/shared/tcg-core/cards/definitions/<faction>/<id>.ts`**;
  the registry barrel lives at `cards/index.ts`. Schema validation
  in `cards/schema.ts` is `.strict()` — typos fail loudly.
- **Trial categories arrays must be sorted in canonical order**
  (confession < defensive < evidence < narrative < offensive <
  reactive). Test enforces it.

### Pull requests

- Use the PR template; it's not optional. Reviewers look for the
  testing notes specifically.
- One concern per PR. If you can't summarise it in one paragraph,
  split it.
- New `as any` / `@ts-ignore` requires a comment explaining why.
- New player-visible behaviour adds a CHANGELOG entry.

### Getting help

- Architecture / philosophy: `docs/DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md`
  is the single source of truth.
- Lore: `docs/built/LORE_BIBLE.md`.
- Audit history: `docs/narrative-audit/`, `docs/AUDIT_2026-05_FINAL_TODO.md`.
- ADRs: `docs/adr/`.
