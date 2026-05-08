# Security Engineer — Audit

## Top 7 findings  (security gets 7 because it's the highest-stakes lane)

### F1: Economic mutations have no per-user rate limit — currency farming wide open
- file: `apps/server/routers/marketplace.ts:124,217,640,686`; `casino.ts:633-824,1096`; `tradeWars.ts:316,604,1042`; `draft.ts:203,290`; `trading.ts:17,71`
- severity: critical
- category: rate_limit
- attack: Authed user scripts `casino.playVoidSlots`, `marketplace.buyListing`, `tradeWars.collectIncome`, `trading.acceptTrade` thousands of times per second. Casino RNG grind, marketplace front-running, colony-income loops all become tractable.
- finding: `procedureRateLimit` exists and is well-built (`_core/procedureRateLimit.ts`) but applied at only 4 sites repo-wide (`store.ts:39`, `cardGame.ts:977,1013`, `account.ts`). Every casino `play*`, every marketplace mutation, every tradeWars resource action is `protectedProcedure` with no token bucket. Global IP limit (600/min, `ipRateLimit.ts:25`) is far too loose. `casino.claimJackpot` (line 1096) pays out premium currency.
- fix: `.use(procedureRateLimit({ windowMs: 60_000, max: 30 }))` on all casino `play*` and marketplace/trading mutations; `max: 5/min` on `claimJackpot` and `placeBid`. Move bucket store to Redis before horizontal scale.

### F2: PvP AI epsilon-greedy defaults to `Math.random()` — replay determinism + strategy leak
- file: `apps/shared/tcg-core/ai/lookahead.ts:95`
- severity: high
- category: rng
- attack: Caller that omits `rng` arg silently uses `Math.random` — escapes the seeded `engine/rng.ts` contract. Predictable for an attacker watching turn N to anticipate AI's turn N+1; breaks replay determinism if AI runs server-side.
- finding: Default param `rng: () => number = Math.random` is the single hole in an otherwise enforced ban (rng.ts:8 documents the ban). ESLint `no-restricted-globals` doesn't catch by-reference passes.
- fix: Make `rng` required. Update test fixtures to pass `createRng(seed).next`.

### F3: Spectator WS — anon, unlimited, deep-clones full state per broadcast
- file: `apps/server/pvpWs.ts:1069-1107` (SPECTATE), `192-222` (`getSpectatorView`)
- severity: high
- category: websocket
- attack: Anonymous WS opens N connections, each loops `SPECTATE` against every active matchId. No per-IP cap on concurrent spectators, no auth gate, every state broadcast does `JSON.parse(JSON.stringify(state))` — CPU/heap sink scaling matches × spectators.
- finding: `wsRateLimit` is per-key, but spectators share a per-connection key, so opening more sockets multiplies budget linearly. Deep clone runs once per spectator per broadcast.
- fix: Cap `match.spectators.size` per match (~200) and per source IP (~5). Compute `getSpectatorView` once per broadcast tick, not per spectator. Require auth for `SPECTATE` on ranked matches.

### F4: Stripe webhook idempotency bypassed when DB is null; non-checkout events get no replay guard
- file: `apps/server/_core/index.ts:91-112` (layer A), `119-201` (layer B)
- severity: high
- category: replay
- attack: (a) When DB is unavailable the handler explicitly notes layer-A is bypassed — Stripe retries can re-enter `fulfillPurchase`. (b) Layer B (unique on `stripePaymentIntentId`) only fires inside the `checkout.session.completed` branch. Future event handlers inherit a silent gap.
- finding: Layer A is conditional on `if (db)`; catch only no-ops on duplicate-key error. RevenueCat path (`iapReceipt.ts:54`) documents `(userId, platform, transactionId)` idempotency in comments but writes no ledger row yet — the contract is aspirational.
- fix: Fail-closed when db is null — return 5xx so Stripe retries. Run layer A unconditionally for every event type. Add `(userId, platform, transactionId)` unique index on the IAP fulfillment ledger before wiring `recordIapFulfillment`.

### F5: Sprite proxy fallback re-fetches outside size cap, lies about Content-Type
- file: `apps/server/spriteProxy.ts:230-247`
- severity: medium
- category: ssrf
- attack: Pick an allowlisted URL whose Sharp pipeline throws. Primary errors → fallback `await fetch(url)` at line 236 has no `MAX_FETCH_BYTES` check, no content-length guard, serves whatever bytes come back hardcoded as `image/png` with `Cache-Control: public, max-age=3600`. Pollutes upstream caches with type-spoofed bytes.
- finding: Allowlist (line 34-38) is solid — 3 hosts, HTTPS-only, internal-IPs blocked. Primary path is hardened. Fallback drops both size cap and type discipline.
- fix: Delete the fallback, or apply the same MAX_FETCH_BYTES guard and pass through upstream Content-Type.

### F6: `sql.raw(voteDef.epoch)` inside JSON_SET — injection waiting for an upstream change
- file: `apps/server/services/epochWitnessService.ts` (two `sql.raw` interpolations in JSON_SET/JSON_EXTRACT)
- severity: medium
- category: injection
- attack: `voteDef.epoch` is server-side static today, but `sql.raw` bypasses Drizzle's parameterization. Any future route letting users pick the epoch key concatenates raw SQL into a JSON path.
- finding: Other `sql\`...${var}\`` callsites in services are correctly parameterized via tagged templates — only `sql.raw` sites carry risk.
- fix: Replace with parameterized `sql\`...\``, or validate against a literal enum at the call boundary with a comment naming the trust source.

### F7: Elara `chat` is `publicProcedure` with no rate limit, 32k max_tokens
- file: `apps/server/routers/elara.ts:161-243`; `_core/llm.ts:302,318`
- severity: medium
- category: rate_limit
- attack: Anonymous loops on `elara.chat` with 2KB messages. Each dispatches `gemini-2.5-flash` with `max_tokens: 32768` against the shared `ENV.forgeApiKey` — credit-card incinerator. Currently gated by `process.env.ELARA_LLM !== "on"`; the moment the flag flips, cost is unbounded.
- finding: `chat` is `publicProcedure`, no `procedureRateLimit`, no per-user token budget. History trimmed to 10 entries but not to total chars. `sanitizePlayerInput` covers the user message but not the assistant `history` items the client supplies.
- fix: Convert to `protectedProcedure` + `.use(procedureRateLimit({ windowMs: 60_000, max: 5 }))`. Per-user daily LLM-token budget. Sanitize+trim every history entry, not just `input.message`.

## Convergence hints
1. **DB engineer**: `processed_webhook_events` is created via raw `CREATE TABLE IF NOT EXISTS` in `services/webhookEventsBootstrap.ts` (orphaned migration 0055). Confirm the unique index on `eventId` exists in prod — if missing, F4 layer A is silently a no-op.
2. **Mobile engineer**: `iapReceipt.verify` is wired but inert. Before native IAP ships, add a `(userId, platform, transactionId)` unique index — the idempotency in the file header is currently aspirational comment.
3. **Reliability**: `pvpWs.ts:933` opens `setInterval(..., 250)` per coop match with no concurrent-match cap. Combined with F3's deep-clone, an authed synthetic-match flood pins CPU.
