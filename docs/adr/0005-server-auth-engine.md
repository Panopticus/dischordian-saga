# ADR-0005 — Server-authoritative card engine

Status: accepted

## Context

A live-service card game must answer: who runs the rules, server
or client?

- **Client-authoritative** — client computes outcome, posts
  result; server credits rewards. Easy. Trivially cheatable.
- **Server-authoritative** — client posts an action, server
  reduces, returns the new state. Harder; needs identical rules
  on both sides for animation; protects the economy.
- **Replay-validated** — client plays freely, posts the action
  log; server replays through the same engine and verifies the
  hash. Hybrid; works when the engine is fully deterministic.

## Decision

Use a server-authoritative engine for live PvP card duels (current).
Use replay validation for asynchronous / offline modes (coop card,
campaign AI) — the engine is deterministic by construction so
client-recorded action logs can be re-simulated server-side.

## Consequences

- Engine lives in `apps/shared/tcg-core/` and runs on both sides.
  Client and server import the same `reduce(...)` function.
- RNG must be seeded; every random branch routes through the
  match's seed. Two leaks tracked in audit (`campaignAI`,
  `chessQuoteCanon`) — fix incoming.
- `RULES_VERSION` is bumped when the reducer changes meaning. Old
  replays may no longer round-trip; we keep the rule set
  archived.
- Replay validation foundation lives in
  `apps/server/services/replayVerifier.ts`. `MATCH_REPLAY_REQUIRED`
  env flag flips reject-vs-warn once clients are migrated.
- The downside: every effect added to the engine has to be
  serialisable (no closures), and any mutation of the
  `CardDefinition` shape needs schema validation in
  `cards/schema.ts` to catch typos at registry build.

## Alternatives considered

- **Client-authoritative with stat caps** — bandaid, not
  protection. Cheaters trivially file the right values.
- **Full snapshot + diff sync** — heavy bandwidth; unnecessary
  given the engine is deterministic.
