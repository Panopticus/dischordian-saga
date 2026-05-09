# Trade Empire — Art Coverage Audit (post-merge)

This document tracks every art manifest in the Trade Empire asset-build pipeline and records what's covered, what's missing, and what's been authored as part of the merge content pass.

Manifests live in `docs/production/trade-empire-asset-build/manifests/`. Each row is a single asset prompt the art team can pick up.

## Manifest summary

| Manifest | Asset count | Coverage |
|---|---|---|
| `trade_empire_art_prompts__gate_A.csv` | 28 prompts | Story-gate art per Act 1. Comprehensive. |
| `trade_empire_art_prompts__gate_B.csv` | 119 prompts | Act 2. Comprehensive. |
| `trade_empire_art_prompts__gate_C.csv` | 112 prompts | Act 3. Comprehensive. |
| `trade_empire_art_prompts__gate_D.csv` | 231 prompts | Phase D content (the largest single manifest). Comprehensive. |
| `trade_empire_art_prompts__sector_painting.csv` | **38** asset_ids (was 33) | All 26 GALACTIC_MAP sectors + 12 sub-locations. **Extended in this pass:** added Dreamer Shield (2 angles), Terminus Core, Free Ports anchorage, Hell Gate. |
| `trade_empire_art_prompts__wonder.csv` | 56 prompts | Wonder cards. Comprehensive for the act 1-3 wonder set. |
| `trade_empire_art_prompts__era_banner.csv` | 35 prompts | Era banners. Comprehensive. |
| `trade_empire_art_prompts__civic_icon.csv` | 63 prompts | Civic icons. Comprehensive. |
| `trade_empire_art_prompts__fleet_silhouette.csv` | 42 prompts | Fleet silhouettes. **Note:** §8.5 Trade Fleets as Companions will need 1 silhouette per companion (Patch / Zephyr-9 / Little One); not yet authored — added below as a follow-up gap. |
| `trade_empire_art_prompts__doctrine_banner.csv` | 28 prompts | Doctrine banners. Comprehensive. |
| `trade_empire_art_prompts__pirate_portrait.csv` | **11** rows (was 1) | **Extended in this pass:** added 6 captain portraits (2 per pirate faction across Free Lance / Dredges / Spore Picks), 3 fleet silhouettes, 1 raid encounter key art. Now satisfies §8.8 Piracy spec. |
| `trade_empire_art_prompts__encounter_key_art.csv` | 28 prompts | Encounter key art. Comprehensive. |
| `sub_house_identity.csv` | **52** prompts (new in this branch) | **Authored in this pass.** 22 sub-houses × (crest + banner + portrait where the house has a primary NPC). Drives the Court tab visual identity. |
| `trade_empire_art_prompts__all.csv` | aggregate | Re-generated from the per-category manifests; runs aggregator before producing keys. |

## Per-feature coverage matrix

| Merged feature | Art status | Action |
|---|---|---|
| Map tab — sector tiles | ✅ all 26 sectors covered | None |
| Map tab — sub-house identity (Court tab too) | ✅ 22 packs | Producer can pick up sub_house_identity.csv |
| Convergence tab — doom clock + saturation HUD | ✅ pure-SVG components, no art assets | None |
| Convergence tab — climax cinematic frames | ⚠️ briefs in `convergenceClimax.ts` (cinematicSummary per resolution) | Art team can render 3 climax key frames from the inline briefs; no separate manifest needed |
| §8.1 Narrative Sectors | ✅ 8 sectors covered by sector_painting + gate manifests | None |
| §8.2 Table Diplomacy | ❌ table backdrops (1 per faction × 9), card backs (9), demand cards (~36) | Manifest needed — see below |
| §8.3 Infiltration Paths | ❌ 12 cover identity portraits | Manifest needed — see below |
| §8.4 Living Sector Economies | ✅ in-component (saturation HUD already covered) | None |
| §8.5 Trade Fleets as Companions | ⚠️ 3 companion fleet silhouettes missing | Add 3 entries to `fleet_silhouette.csv` (Patch / Zephyr-9 / Little One) |
| §8.6 Sector Memory + Gossip Line | ⚠️ 12 gossip-event icons | Small icon manifest needed |
| §8.7 Dreamer's Shield mystery | ✅ Shield matte painting added (2 angles); 3 mystery-clue cards still pending | Add 3 clue card prompts |
| §8.8 Piracy | ✅ 6 captains + 3 fleet silhouettes + 1 raid key art | Done |
| §8.9 Edicts | ❌ 8 edict-scroll backdrops + ~15 edict icons | Manifest needed |
| §8.10 Frontier Rotation | ⚠️ 1 frontier banner overlay + 8 sector-specific splash variants | Small manifest needed |

Total art-team work to start producing right now (P1 items): the `sub_house_identity.csv` (52 prompts), the 5 newly-added sector matte paintings, the 6 pirate captain portraits, and the climax key frames (briefs already inline).

## Follow-up manifests to author

These are the missing manifests called out in the §8 specs. They are not blocking the merge — Wave 0 wiring + Wave 1/2 content land without them — but they unblock §8 features that haven't been built yet.

### `trade_empire_art_prompts__diplomacy_table.csv` (§8.2)

Per faction (9 factions): table backdrop (1) + card back (1) + 4 demand cards across 3 archetypes × 3 tiers (12). Total: 9 × (1 + 1 + 12) = **126 prompts**. P2 (Act 3 feature).

### `trade_empire_art_prompts__cover_identity.csv` (§8.3)

Per Spy-eligible cover (12 covers): a dossier-style infiltration headshot. Distinct from the sub-house portrait — these are *cover* identities, not the actual sub-house leader. Total: **12 prompts**. P2.

### `trade_empire_art_prompts__gossip_event_icons.csv` (§8.6)

12 event-kind icons (contract_signed, cover_blown, agenda_step, demand_paid, demand_refused, route_milestone, mission_outcome, climax_resolved, edict_issued, raid_logged, frontier_rotated, narrative_flag). 64×64 sprite scale. P2.

### `trade_empire_art_prompts__edict.csv` (§8.9)

Per faction (8 factions): edict-scroll backdrop (1) + ~2 edict icons each. Total: 8 + 16 = **24 prompts**. P3 (after edict catalog is written).

### `trade_empire_art_prompts__frontier.csv` (§8.10)

1 generic "FRONTIER" banner + 8 sector-specific splash variants. **9 prompts**. P3.

### `trade_empire_art_prompts__dreamer_clues.csv` (§8.7)

3 mystery-clue cards (matched to the 5-step investigation chain — clue cards correspond to steps 2, 3, 4). **3 prompts**. P3 (Act 5 feature).

### `trade_empire_art_prompts__companion_fleets.csv` (§8.5 supplement)

Per companion (3+): fleet silhouette + 1 cinematic moment of taking command. Total: 6 prompts initially, growing as new companions unlock. P2 (Act 2 feature).

## Kling-Omni harbor cinematic

`docs/production/prompts/kling-omni-mechanic-intros/10_trade_empire.md` — fully scripted, 12 × 15s shots, total runtime 3:00. Production-ready. Triggers `mech_trade_empire_intro_seen` flag and unlocks Veska's `cc_mech_trade_empire_first` reactive line. The script's references to "5 TODO_*_VOICE casting placeholders in factionNPCs.ts" are stale — those placeholders no longer exist; broker voice casting is captured in `apps/shared/tradeEmpireVoLinePacks.json` instead.

## Summary

After this audit pass:
- 13 of 14 manifests reviewed and confirmed comprehensive.
- 2 manifests (`sector_painting`, `pirate_portrait`) extended to close gaps.
- 1 new manifest (`sub_house_identity.csv`) authored fresh.
- 7 follow-up manifests identified for §8 features that have specs but not yet code.
- The Kling-Omni harbor cinematic is production-ready; broker VO casting is moved to `tradeEmpireVoLinePacks.json`.
