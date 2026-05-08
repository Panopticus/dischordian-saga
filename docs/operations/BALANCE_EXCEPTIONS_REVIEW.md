# Balance Exceptions — designer review

> 4 cards carry `balanceException` entries with reviewer `2026-05-stat-curve-recalibration`. Each was auto-classified by `apps/scripts/backfill-balance-exceptions.ts` based on structural heuristics (pet, reward, imprint, ability-driven, etc.). Designer review either rebalances the card (and removes the entry) or upgrades the reason to intent-on-record sign-off, replacing the reviewer field with the human approver's name.

Find them all: `grep -rln '"2026-05-stat-curve-recalibration"' apps/shared/tcg-core/cards/definitions`

## Review table

| Cost | Card | Stats | Keywords | Auto-reason category | File |
|------|------|-------|----------|---------------------|------|
| 3 | **General Prometheus** (`s1_char_009`) | 3/6 | — | low-cost util | `architect/s1_char_009_general_prometheus.ts` |
| 3 | **Honor Guard** (`s1_neutral_zeal_001`) | 2/3 | zeal | ability-driven | `neutral/engine_demo_cards.ts` |
| 4 | **Wraith Calder** (`s1_char_106`) | 3/4 | rebirth | ability-driven | `insurgency/s1_char_106_wraith_calder.ts` |
| 4 | **Loop Walker** (`s1_dim_time_02`) | 3/4 | grow, rebirth | ability-driven | `dimensional/time.ts` |

## Upgrade workflow

For each card the designer reviews:

1. **Confirm the deviation is intentional.** Check the abilities + keywords against current playtest data. If the stat profile is wrong, rebalance and remove the `balanceException` block entirely.
2. **Upgrade the reason.** Replace the auto-classified text with a one-line designer note that names the specific mechanic justifying the deviation (e.g. "Wraith Calder: rebirth keyword effectively doubles HP; printed line under raw curve compensates").
3. **Replace the reviewer.** Change `reviewer: "2026-05-stat-curve-recalibration"` to your name / handle. The string is the audit trail; replacing it signals the entry has been reviewed.
4. **Remove from this doc.** Delete the card's row.

When the table is empty, delete this doc.
