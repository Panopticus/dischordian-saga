# Mobile Engineer — Audit

## Top 5 findings

### F1: Capacitor is config-only — no `ios/` or `android/` native projects
- file: /home/user/dischordian-saga/capacitor.config.ts:14-18
- severity: high
- category: capacitor_setup
- finding: Config ships (`appId: ink.dgrslabs.dischordian`, RevenueCat + Preferences plugin blocks) and `mobile:sync`/`mobile:build` scripts exist, but `find -maxdepth 3` returns no `ios/` or `android/`. The header comment admits the dirs land "once they exist." No `Info.plist`, no `AndroidManifest.xml`, no signing config, no 1024x1024 App Store icon (manifest tops at 512). `mobile:build` fails on `cap sync` with no platforms.
- fix: run `npx cap add ios && npx cap add android` in a Xcode/Android Studio host, commit the trees, add a macOS CI lane running `pnpm mobile:build`.

### F2: `.game-canvas-mount` rule declared but no canvas applies it
- file: /home/user/dischordian-saga/apps/client/src/index.css:1296-1300; /home/user/dischordian-saga/apps/client/src/game/duelyst/DuelystGameUI.tsx:1692
- severity: high
- category: touch
- finding: index.css ships `.game-canvas-mount { touch-action: none }` purely so the parity probe (`apps/shared/_completeness/checks/mobileWiring.ts:75-79`) matches. Repo-wide grep for the class in TSX returns zero. DuelystGameUI's canvas is `<canvas ref={canvasRef} className="max-w-full max-h-full" />`; FightArena2D, ChessPage, SignalDecryption omit it. On iOS WKWebView this means double-tap zooms the board, two-finger drag scrolls the page, 300ms tap-delay on every play. Ship-check passing on file existence, not wiring.
- fix: add `className="game-canvas-mount"` to wrapper divs around each canvas. Strengthen the probe to grep TSX consumers, not the CSS declaration.

### F3: No store-SKU catalog — `iosProductId/androidProductId/stripePriceId` unmapped
- file: /home/user/dischordian-saga/apps/client/src/lib/payments/index.ts:27-41
- severity: high
- category: sku_parity
- finding: `ProductSku` interface declares all three platform ids, but `grep -rE "iosProductId|androidProductId"` returns only the interface — no populated catalog. Server `store.ts:67` reads `product.stripePriceEnv` from a separate path; no shared module unifies the three. CLAUDE.md flags "store SKU coverage across web+iOS+Android" as a planned ratchet — not yet declared in `_completeness/registry.ts`. A SKU on Stripe without matching App Store Connect / Play Console entries silently fails native checkout.
- fix: create `apps/shared/store/skuCatalog.ts` exporting `STORE_SKUS: ProductSku[]`; add a `checkSkuParity` registry entry asserting every row has all three ids (or explicit `webOnly: true`). Route `store.ts` + `iapReceipt.ts` through it.

### F4: RevenueCat verify half-wired; fulfillment is a TODO comment
- file: /home/user/dischordian-saga/apps/server/routers/iapReceipt.ts:108-118
- severity: high
- category: iap
- finding: `iapReceipt.verify` calls RevenueCat REST and returns `{ ok: true, orderId }`, but the comment at line 108 says fulfillment "hands off via the shared `recordIapFulfillment` helper (added when the helper module lands)." Helper does not exist (grep returns nothing). Successful native IAP returns success to the client, writes no `storePurchases` row, grants no entitlement — user pays Apple, receives nothing. No idempotency on `(userId, platform, transactionId)` despite the docstring promising it; no Apple/Google direct-verify fallback when `REVENUECAT_SECRET_API_KEY` is unset (just throws PRECONDITION_FAILED).
- fix: implement `recordIapFulfillment(...)` upserting `storePurchases` keyed on transactionId and granting entitlement transactionally. Block native binary deploy until verify returns a real orderId.

### F5: Viewport blocks pinch globally; HUDs miss `safe-area-inset-top`
- file: /home/user/dischordian-saga/apps/client/index.html:5
- severity: medium
- category: safe_area
- finding: `<meta name="viewport" content="...maximum-scale=1, viewport-fit=cover">` disables pinch-zoom across the whole SPA — hostile on lore/text routes. Bottom-nav inset is correctly honoured (MobileBottomNav, AppShell, CommandConsole), but no `padding-top: env(safe-area-inset-top)` on duel/chess HUDs — notch overlap likely on iPhone 14 Pro+. Capacitor `ios.contentInset: "always"` does not help fixed-position HUDs inside the webview. Also: only LeaderboardPage adopts `useListVirtualizer`; LoredexGraph, LoreGallery, ArkExplorer, LoreJournal still render full DOM (cellular/low-end iOS will thrash).
- fix: drop `maximum-scale=1` once F2's per-canvas `touch-action` lands. Add `safe-area-inset-top` padding to all `position: fixed` HUDs in DuelystGameUI/ChessPage/FightArena2D. Migrate the four lore pages to `useListVirtualizer`.

## Mobile readiness status
Scaffolded, not deployable. Capacitor, RevenueCat plugin, payment adapter, iapReceipt route, virtualization helper, and PWA manifest pass `mobileWiring` ship-check — but probes check file existence, not runtime. No native projects, no canvas wears the touch class, no SKU catalog, IAP fulfillment is a stub. Web PWA installable today; iOS/Android need ~2 weeks of native + IAP wiring before TestFlight.

## Convergence hints
- **Staff Engineer**: F2 + F4 are "ship-check passing because probes match scaffolding, not behaviour" — exactly the failure CLAUDE.md warns against.
- **Backend / Payments**: F3 + F4 — `store.ts` and `iapReceipt.ts` both need the unified SKU registry.
- **Performance**: F2 className helps canvas perf; 19MB `apps/client/public` is their lane.
- **QA**: no Playwright mobile-emulation covers canvas touch.
- **Security**: iapReceipt trusts RevenueCat REST without webhook signature checks.
