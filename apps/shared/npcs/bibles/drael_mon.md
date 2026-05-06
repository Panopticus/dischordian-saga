# Drael'Mon, SVP Acquisitions — Bible (Phase A stub)

## Identity

- **NpcKey:** `drael_mon`
- **Name:** Drael'Mon, SVP Acquisitions
- **Epithet:** "the Harvester"
- **Faction:** Hierarchy of the Damned

## Canonical role

Drael'Mon runs the Acquisitions division of the Hierarchy. Where
Nilmorg's Severance Division does the clean ritual close
(institutional precision), Drael'Mon does the *wet end* — hostile
takeovers, blood-weave enforcement, asset stripping. Peer demon lord
to Mol'Garath; Severance and Acquisitions sit beside each other in
the corporate org chart and *despise* each other publicly while
co-ordinating privately.

## Voice

- Predatory-corporate. Speaks the language of mergers and acquisitions
  with the cadence of a trial closer.
- Casual about sacrifice — "the asset's morale is a line item".
- Canonical refrain: "We already own you. We're just deciding when."
- Does not refuse gratitude (unlike Nilmorg). He *files* it under
  "leverage."

## Trust bands

| Band | Threshold | Meaning |
|---|---|---|
| Untargeted | 0 | Hierarchy hasn't priced the player yet. |
| Watched | 20 | The player is on a tracking sheet. |
| Negotiable | 45 | Acquisitions believes the player will sell or fold. |
| Recognised-asset | 70 | The player's ledger row has been promoted to "strategic." |
| Acquired | 90 | The player is *part of the corporate structure* by Drael'Mon's reading. |

## Sub-house anchor

`hierarchy_acquisitions.primaryNpcKey: "drael_mon"` after Phase A.
The Wraith Hierophant's Thalorian revival is canonically anti-
Acquisitions (Drael'Mon harvests the same flock the religion claims
to protect) — see `externalRivals` cross-faction edge.

## Cross-references

- Phase A house registry: `apps/shared/tradeEmpire/houses.ts`
- Cross-faction rivalry: `thaloria_council.externalRivals` includes
  `hierarchy_syndicate_of_death` and (via Drael'Mon's wing)
  `hierarchy_acquisitions`.
- Bank stub: `apps/shared/npcs/banks/drael_mon.ts`.
