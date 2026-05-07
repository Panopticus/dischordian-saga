# Audit Priorities — 2026-05-07

Sorted punch list derived from `audit/findings.json` (16 personas, 86 findings, 14 convergent). Score = severity_weight × convergence_count / fix_cost_estimate. P0 ships this week, P1 this milestone, P2 backlog, P3 won't-fix or by-design.

---

## P0 — Ship this week (critical OR convergence ≥3 OR legal blocker)

| # | ID | Title | Convergence | File:Line |
|---|----|-------|-------------|-----------|
| 1 | C-02 | Add `procedureRateLimit` to 175 unguarded public procedures (casino, marketplace, tradeWars, draft, trading, battlePass.addXp, pvp.getLeaderboard, elara.chat) | **3** | apps/server/routers/casino.ts:633-824, marketplace.ts:124+, battlePass.ts:75-160, elara.ts:161-243, pvp.ts:85-93 |
| 2 | C-03 | Implement `recordIapFulfillment()` + `(userId,platform,transactionId)` unique index; gate native binary deploy until verify writes a real fulfilled order | **3** | apps/server/routers/iapReceipt.ts:54-119 |
| 3 | C-13 | Cap casino slot/roulette payouts back below 1.0 RTP; add `casinoGames.test.ts` parity asserting RTP ≤ 0.92 | **2** | apps/shared/casinoGames.ts:63-83, :186-197 |
| 4 | C-05 | Wrap pack-opening, gem-bundle, createListing, placeBid in `db.transaction`; add anti-snipe `endsAt = GREATEST(endsAt, NOW()+60s)`; add `WHERE currentBid < newBid` lost-update guard | **2** | apps/server/routers/cardGame.ts:548,1749,1907; marketplace.ts:155,548,663,686-745 |
| 5 | C-01 | cardGame.ts: replace `Math.random()` at line 1266 with `createRng(seed)`; route playCard/attack/endTurn through tcg-core `reduce()`; delete inline GameState type | **2** | apps/server/routers/cardGame.ts:76-122,1228-1545,1266 |
| 6 | 15.R1 | Resolve Stockfish GPL-3.0 status (isolate as out-of-process service / swap to permissive engine / accept disclosure). **Blocker for store distribution.** | 1 | package.json:176 |
| 7 | 15.R3 | Replace placeholder Privacy + ToS bodies; consolidate duplicate `Privacy*` and `Terms*` routes; lock `CURRENT_AGREEMENT_VERSIONS` | 1 | apps/client/src/pages/PrivacyPolicyPage.tsx |
| 8 | C-11 | Make 9×5 Duelyst board keyboard-accessible (parallel DOM grid with role=grid + roving tabindex); convert hand cards from divs to `<button>`s; apply `.game-canvas-mount` class to all canvas wrappers | **2** | apps/client/src/game/duelyst/DuelystGameUI.tsx:1692,1900 |

## P1 — Ship this milestone (high severity OR convergence = 2)

| # | ID | Title | Conv. | File:Line |
|---|----|-------|-------|-----------|
| 9 | C-07 | Backfill missing FKs (tier 1 cascade: user_progress, ark_themes, character_sheets, user_achievements; tier 2 restrict: pvp_matches.winnerId, game_replays; tier 3 restrict: store_purchases, market_transactions); ratchet `db.foreign_key_coverage` downward from 301 | **2** | apps/db/schema.ts:6,147-148,178-179,203,250,265,450 |
| 10 | C-06 | Reconcile migration journal: collapse 81-file/39-journal mess into single `0071_baseline_v1` from fresh DB; flip CI's `continue-on-error: true` to false | **2** | apps/db/migrations/, .github/workflows/ci.yml:173,277 |
| 11 | C-10 | Onboarding: mount `<AutoTutorialPrompt>` at GameGate level (5-line fix unlocks 28 authored tutorials); add empty-state CTA on BridgeConsole; build `<LoreTerm>` glossary tooltip; wrap LoreTutorialEngine in `role=dialog`+focus trap+aria-live; gate morality apply with consequence preview | **4** | App.tsx:629; BridgeConsole.tsx; LoreTutorialEngine.tsx:230-252,292; MechanicTutorialOverlay.tsx:140 |
| 12 | C-12 | Wire `resolveVariant(VARIANT_REGISTRY)` into act surfaces; add `narrativeFlagConsumerCoverage` ratchet; author authority/eidola/matrikala/programmer/act4_5 VO line JSON + run `pnpm vo:run-all`; run `pnpm lore:generate` to close `lore.bible_drift`; rewrite 214 s1_pack2 placeholder card flavors | **4** | apps/shared/moralityTrustActVariants.ts:154; apps/shared/authorityVoManifest.json (and 4 siblings); apps/shared/tcg-core/cards/definitions/s1_pack2/ |
| 13 | C-14 | Backfill ≥2 confession-tagged cards per faction (≥12 total); tag ~8 more TV/NB cards as evidence/reactive; author `tut-authority-trial` LoreTutorial | **2** | apps/shared/tcg-core/cards/definitions/{architect,thought_virus,new_babylon,dreamer,antiquarian,neutral}/; TrialPhaseIndicator.tsx |
| 14 | C-04 | GameContext.tsx: useMemo the provider value; split GameStateContext from GameActionsContext; migrate hot domains (morality, companion) to selector-grained Zustand stores | **2** | apps/client/src/contexts/GameContext.tsx:1727-3956,3820-3952 |
| 15 | C-08 | Promote `@opentelemetry/sdk-node` + exporters to hard prod deps; convert sentry/otel dynamic imports to static; ship-check `Sentry.getClient()` and OTel SDK non-null in prod; configure `vite esbuild.drop:['console','debugger']` | **3** | apps/server/sentry.ts:21-25, apps/server/otel.ts, apps/server/_core/env.ts:85-89 |
| 16 | C-09 | Stand up `vitest.integration.config.ts` against existing CI mysql:8.0 service; add `pnpm test:integration` step; replace E2E class-prefix locators with `data-testid`; install `@vitest/coverage-v8` (start at lines:60/branches:50, ratchet up); add `tests.golden_path_router_coverage` ratchet | **3** | apps/e2e/*.spec.ts; vitest.config.ts; package.json |
| 17 | 02.F2 | `lookahead.ts` make `rng` parameter required (default = Math.random escapes the seeded contract) | 1 | apps/shared/tcg-core/ai/lookahead.ts:95 |
| 18 | 02.F3 | Cap PvP spectators per-match (~200) and per-IP (~5); compute `getSpectatorView` once per broadcast tick (not per spectator) | 1 | apps/server/pvpWs.ts:1069-1107,192-222 |
| 19 | 02.F4 | Fail-closed when DB is null in Stripe webhook (return 5xx so Stripe retries); run idempotency layer A unconditionally for every event type | 1 | apps/server/_core/index.ts:91-112 |
| 20 | 04.F2 | `React.lazy()` ShaderOverlay inside AppShellImmersive; gate mount on `qualityTier !== 'low'`; remove three.js+postprocessing from initial chunk | 1 | apps/client/src/components/AppShellImmersive.tsx:29 |
| 21 | 04.F4_marketplace | `marketplace.searchListings`: composite index `(status, itemType, createdAt)` + cursor pagination + FULLTEXT on itemName; cap `myListings` at LIMIT 100; 30s cache on `getLeaderboard` | 1 | apps/server/routers/marketplace.ts:441-485,488-494 |
| 22 | 06.F1 | Add `app.get("/api/health", ...)` returning `{ok,dbPing,sentryReady,otelReady}` before CSRF/rate-limit; fix railway `healthcheckPath` and CI's curl path | 1 | railway.toml, apps/server/_core/index.ts |
| 23 | 07.F2 | Wrap LoreTutorialEngine + MechanicTutorialOverlay in `role="dialog"` + `aria-modal=true` + `useFocusTrap`; place typewriter content in `aria-live="polite"` | 1 | LoreTutorialEngine.tsx:292, MechanicTutorialOverlay.tsx:140 |
| 24 | 07.F3 | Add E2E auth `storageState` (or mock-auth bypass) so `accessibility-audit.spec.ts` covers auth-gated routes; tighten line 348 live-region assertion from `≥0` to `>0`; add Duelyst axe + grid-keyboard spec | 1 | apps/e2e/accessibility-audit.spec.ts:64,348 |
| 25 | 08.F3 | Create `apps/shared/store/skuCatalog.ts` with `STORE_SKUS: ProductSku[]`; route `store.ts` and `iapReceipt.ts` through it; add `mobile.sku_parity_coverage` ratchet | 1 | apps/client/src/lib/payments/index.ts:27-41 |
| 26 | 09.F5 | `deathwatch` keyword: either auto-inject `on_any_unit_dies` trigger at card-load (loader change) for the 25 cards declaring it, or strip the keyword and replace with authored triggers | 1 | apps/shared/_completeness/checks/keywordBehaviorCoverage.ts:74 |
| 27 | 10.F1 | Wire `resolveVariant(VARIANT_REGISTRY)` into act-page surfaces — covered in C-12 above; flagged here as the architectural anchor | (in C-12) | apps/shared/moralityTrustActVariants.ts:154 |
| 28 | 10.F2 | Thread `state.companionStats` into the variant resolver call site; add contract test asserting at least one `trust !== "any"` variant fires per act | 1 | apps/shared/moralityTrustActVariants.ts:107 |
| 29 | 14.F4 | Document the convergence matrix (Witnessing × Identity Chains × Thought Virus × Light/Dark) OR pick the two strongest pillars and surface the others through them | 1 | docs/design/NARRATIVE_ARCHITECTURE.md |
| 30 | 15.R2 | AI-content disclosure surface (in-app + store listing); per-asset provenance manifest; ElevenLabs commercial-tier confirmation | 1 | apps/scripts/generate-*-vo.ts; docs/production/ |
| 31 | 15.R4 | Neutral age gate at first login; COPPA / GDPR-Art.8 / ESRB / PEGI / IARC stance documented + submitted | 1 | apps/server/_core/oauth.ts |
| 32 | 16.F1 | Derive TS `Faction` from `z.infer<typeof factionSchema>` (or add parity test); `panopticon` is in Zod but not TS today | 1 | apps/shared/tcg-core/types/Card.ts:16-24 |
| 33 | 16.F2 | Replace hand-maintained barrel with `import.meta.glob("./definitions/**/*.ts", {eager:true})` + codegen for server bundle + CI staleness check | 1 | apps/shared/tcg-core/cards/index.ts |
| 34 | 16.F3 | Write `apps/shared/tcg-core/README.md` (the one CONTRIBUTING.md promises): minimal valid card, 3-step add checklist, faction checklist, standalone schema parse invocation | 1 | CONTRIBUTING.md:75-77 (no README) |

## P2 — Backlog (medium severity, single persona)

| # | ID | Title | File |
|---|----|-------|------|
| 35 | 01.F3 | Move `assetUrl` to `apps/shared/lib/`; add ESLint `no-restricted-imports` rule banning `@/` from `apps/shared/**` | apps/shared/expansionArt/, suitAdapters/ |
| 36 | 01.F4 | Split FightEngine2D into `fight/sim/` (pure) and `fight/render/`; lift `FighterState2D` into a discriminated union | apps/client/src/game/FightEngine2D.ts |
| 37 | 01.F5 | Compose sub-routers under `apps/server/routers/_groups/{tcg,chess,economy,narrative,social,admin}.ts`; extract page god-files into `features/<feature>/components/` | apps/server/routers.ts; ChessPage/ArkExplorerPage/FightPage |
| 38 | 02.F5 | Delete spriteProxy fallback or apply MAX_FETCH_BYTES + upstream Content-Type passthrough | apps/server/spriteProxy.ts:230-247 |
| 39 | 02.F6 | Replace `sql.raw(voteDef.epoch)` with parameterized `sql\`...\`` template, or validate against literal enum at call boundary | apps/server/services/epochWitnessService.ts |
| 40 | 03.F4 | Switch `playerProfileEvents.id` to `mode:'bigint'` (or demote to int if event count < 2.1B) | apps/db/schema.ts:5275 |
| 41 | 03.F5 | Declare `idx_card_trades_pair`, `idx_crafting_log_user_created`, `idx_analytics_events_name_created` in schema.ts (else db:push proposes dropping them) | apps/db/schema.ts |
| 42 | 03.F6 | Bound `users.name` to varchar(64); add `uniqueIndex` on `users.email` filtered on `deletedAt IS NULL`; pin `utf8mb4_0900_ai_ci` | apps/db/schema.ts:9-10 |
| 43 | 04.F3 | effectInterpreter: add depth/iteration cap to `foreach`/`repeat`; cache empty-tile list per resolve; build `(row,col)→entityId` index once per resolve | apps/shared/tcg-core/engine/effectInterpreter.ts |
| 44 | 06.F4 | Add SIGTERM/SIGINT handler that drains WS, awaits Sentry.close + OTel shutdown | apps/server/_core/index.ts |
| 45 | 06.F5 | `db:migrate:prod` refuse on `NODE_ENV !== 'production'`; add `db:push` host guard | package.json |
| 46 | 07.F5 | Re-target `html.high-contrast` at `--energy-*` token CSS vars (not utility classes); add `a11y.contrast_ratio` ratchet over Void Energy material pairs | apps/client/src/index.css |
| 47 | 08.F1 | Run `npx cap add ios && npx cap add android` in Xcode/Android Studio host; commit native trees; add macOS CI lane for `pnpm mobile:build` | capacitor.config.ts |
| 48 | 08.F5 | Drop `maximum-scale=1` once F2 lands; add `safe-area-inset-top` padding to fixed HUDs; migrate LoredexGraph/LoreGallery/ArkExplorer/LoreJournal to `useListVirtualizer` | apps/client/index.html:5 |
| 49 | 09.F3 | Either print 4-6 more cards per orphan keyword (zeal/pack/blast/airdrop) or prune Keyword union and convert remnants to triggered abilities | apps/shared/tcg-core/types/Card.ts:37-68 |
| 50 | 09.F4 | Bias new uncommons to 1/2/4-cost slots to break the 3-cost peak (650/1284 = 51%) | apps/shared/tcg-core/cards/definitions/ |
| 51 | 09.F6 | Run `pnpm ship:check` and quote `tcg.card_stat_budget_coverage`; document outliers via `balanceException` blocks | apps/shared/tcg-core/balance/statCurve.ts |
| 52 | 10.F3 | Route ≥1 mechanical consequence per `act3_path_*_chosen` fork (deck/opponent/reward, not just VO suffix) | apps/client/src/pages/Act6/Act7CardLadderPage.tsx |
| 53 | 10.F4 | Add `crossArcReachability.test.ts` enumerating every `cross_arc_*` choice and asserting upstream episode flag has a writer | apps/shared/episodeMysteries.ts:3731 |
| 54 | 11.F3 | Introduce `react-i18next` + `t()` helper; route ItemDetailModal/MilestoneJournalEntries/RoomTutorialDialog through it; lint-block new JSX-text literals once catalogue exists | apps/client/src/components/ |
| 55 | 12.F6 | Server-set reference rate band (0.5≤rate≤2.0 vs 7-day rolling median) on `currencyExchange`; reject orders outside | apps/server/routers/marketplace.ts:792-831 |
| 56 | 13.F5 | Empty-state CTA on BridgeConsole that hides once `state.discoveredRooms.length > 0` (covered in C-10) | apps/client/src/pages/BridgeConsole.tsx |
| 57 | 14.F2 | Rewrite Iron Lion bleed-through transmission lines to lead with sensory dread before the audit metaphor | apps/shared/episodeMysteries.ts |
| 58 | 14.F5 | One Antiquarian-narrated frame line per Act-7 ending acknowledging "this ending was already in his book" | apps/shared/act7Epilogues.ts |
| 59 | 15.R5 | Commit `dgrsart` + `dgrsvoices` bucket policies as IaC; restrict public-read to `cdn/client-public/*`; pre-upload path/MIME allowlist | apps/scripts/upload-public-to-s3.ts |
| 60 | 16.F4 | Extract `FACTIONS = [...] as const`; derive Zod + TS from it; same for Keyword/TrialCategory; long-term: `pluginManifest` for community packs | schema.ts, types/Card.ts |
| 61 | 16.F5 | Ship `cancel_pending_effect`, `copy_effect`, `search_deck`, `transform_amount` ops in v1.2.0 RULES_VERSION bump | apps/shared/tcg-core/engine/effectInterpreter.ts |

## P3 — Defer / by-design / preserve

| # | ID | Title | Disposition |
|---|----|-------|-------------|
| 62 | 14.F3 | Path flags reach Act 7 with 12 distinct convergence variants — **POSITIVE**. Document in PRODUCTION_BIBLE under "Promises Kept" so future contributors don't flatten this. | preserve |
| 63 | 11.F5 | Concept namespace bleed (Audit-* duplicates, Mystery-Engine internals) | bundled into C-12 lore work |
| 64 | 10.F6 | Romance flags absent from VARIANT_REGISTRY | bundled into C-12 |

---

## Convergence-first reading

Six findings raised by ≥3 personas — these are the highest-confidence systemic issues:

1. **C-02** — rate limits (security + perf + economist)
2. **C-03** — IAP fulfillment stub (security + mobile + economist)
3. **C-08** — silent observability (security + perf + devops)
4. **C-09** — test theater (qa + devops + a11y)
5. **C-10** — onboarding wall (a11y + writer + playtester + lore enthusiast)
6. **C-12** — scaffolding-vs-shipped pattern (tcg + rpg + writer + lore enthusiast)

Two of these (C-10, C-12) are the largest cohesive failure in the repo: there is content authored that is not consumed and content described that does not exist. The methodology surfaced this *because* multiple non-overlapping perspectives saw the same shape from different angles.

## Counts

- **P0**: 8 items (5 convergent, 3 single-persona blockers)
- **P1**: 26 items (9 convergent, 17 single-persona high)
- **P2**: 27 items (single-persona medium)
- **P3**: 3 items (preserve / bundled)

Total: **64 actionable**, 3 deferred.
