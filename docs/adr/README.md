# Architecture Decision Records

Light-weight log of decisions that shaped this codebase. Each ADR
captures the *context*, the *decision*, and the *consequences* —
not the implementation. Code says what; ADRs say why.

## Index

- [ADR-0001 — Drizzle ORM over Prisma](./0001-drizzle-orm.md)
- [ADR-0002 — wouter over React Router](./0002-wouter-routing.md)
- [ADR-0003 — Void Energy design system](./0003-void-energy.md)
- [ADR-0004 — Pixi for cards, Three for scenes](./0004-pixi-three-split.md)
- [ADR-0005 — Server-authoritative card engine](./0005-server-auth-engine.md)

## When to write a new ADR

Write an ADR when you make a decision that:

1. Future readers will reasonably ask "why?" about, **and**
2. Has more than one defensible answer, **and**
3. Will be hard to reverse later.

Don't write an ADR for a fix or a feature, or for a decision that's
"the obvious one". The bar is "if I were arguing with a colleague,
I'd want this on paper."

## Format

```
# ADR-NNNN — Short title

Status: accepted | superseded by ADR-NNNN | deprecated

## Context

What was the situation? What forced the decision?

## Decision

What did we choose? One sentence.

## Consequences

What follows from this — both good and bad. What's harder now?
What's easier?

## Alternatives considered

What else was on the table, and why did we not pick it?
```
