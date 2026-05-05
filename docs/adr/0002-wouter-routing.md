# ADR-0002 — wouter over React Router

Status: accepted

## Context

The client needs route-based code splitting and hash-aware nav.
Options:

- **React Router** — industry default. ~12kB gzipped. Big API
  surface (loaders, actions, deferred data). Required for
  RSC integration but we're SPA-only.
- **wouter** — 1.5kB gzipped, hooks-based, no surprises. Smaller
  API surface; easier to read.
- **TanStack Router** — strongly typed; would be appealing but we
  hit it after the codebase already had wouter wired to ~50 lazy
  routes.

## Decision

Use wouter.

## Consequences

- Bundle savings: ~10kB. Real on cold mobile.
- All routes in `apps/client/src/App.tsx` use `lazy(() => import(...))`
  and wouter's `<Route>`. ~50 routes.
- We patch wouter via `patches/wouter@3.7.1.patch` to expose
  `window.__appRoutes` for E2E tests; revisit on each major bump.
- The downside: no built-in data-loading conventions. We use tRPC
  hooks per page instead, which is fine — but means there's no
  single answer to "where does this data come from" at a glance.

## Alternatives considered

- **React Router** — hard to justify the size given the small API
  we need.
- **TanStack Router** — would consider in a future rewrite if its
  type-safe routes mature; not worth the migration cost now.
