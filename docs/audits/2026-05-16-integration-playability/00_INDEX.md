# Audit 2026-05-16 — Integration & Playability

Four perspectives chosen to serve one end goal: **wire everything and make
it playable, fun, and narratively cohesive.** The 2026-05-08 multi-perspective
sprint saturated the audience-flavor lenses (cinematic, ARG, cosplayer,
streamer, TCG-player, etc.); the engineering track covers `ship:check` parity
and router-wiring. The uncovered seams were *integration* ones — content that
is registered/advertised but not actually wired to its runtime — so these four
lenses each hunt a different flavor of that gap.

## Contents

| # | Perspective | File | P0 | P1 | P2 | P3 | Top concern |
|---|-------------|------|----|----|----|----|-------------|
| 01 | Adversarial QA / Soft-Lock | [01_adversarial_qa.md](./01_adversarial_qa.md) | 1 | 0 | 1 | 1 | 10/16 mystery arcs openable but have zero clues bound to any room — dead on arrival |
| 02 | Persistence & Determinism | [02_persistence_determinism.md](./02_persistence_determinism.md) | 1 | 5 | 2 | 0 | `saveProgress` overwrites the whole gameData blob, racing entitlement writes — silently erases paid entitlements |
| 03 | Continuity Editor | [03_continuity_editor.md](./03_continuity_editor.md) | 1 | 1 | 0 | 1 | Warm/confidant Elara lines fire after the Act 4 betrayal route — structurally guaranteed in one playthrough |
| 04 | Balance & Economy | [04_balance_economy.md](./04_balance_economy.md) | 1 | 3 | 3 | 1 | `dailyQuests.updateProgress` is client-trusted and uncapped — mint ~1k Dream + ~85k Credits per reset |

Aggregated, severity-sorted, cross-perspective view: **[AUDIT_TRACKER.md](./AUDIT_TRACKER.md)**.

## The one-sentence finding

All four P0s are the same defect class CLAUDE.md's ship-check section names
explicitly: **a declared/advertised contract whose runtime does not honor it.**
Mystery arcs are enrolled in `MYSTERY_DEFINITIONS` with no clue bindings; the
betrayal flag is declared and gated once then never propagated; replay
"version pinning" is documented but never executed; the store's SKU-parity
contract is claimed in CLAUDE.md but absent from the ship-check registry. This
is the information-asymmetry bug the gate exists to catch — and it is currently
catching none of these because no parity row covers them.
