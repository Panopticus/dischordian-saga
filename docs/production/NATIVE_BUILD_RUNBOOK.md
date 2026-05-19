# Native Build Runbook (iOS / Android)

Why this is a runbook and not a script: `npx cap add ios|android`
generates Xcode / Gradle projects and **requires a macOS host with
Xcode (iOS) and a JDK + Android SDK (Android)**. Those toolchains are
not present in the Linux CI / Claude-on-the-web container, so the
`ios/` and `android/` directories cannot be generated here. Everything
that does NOT need the toolchain (JS config, Capacitor plugins, the
web/native code seams, the SKU catalog) is already wired in-repo; this
document is the exact sequence to run on a provisioned Mac to produce
and commit the native shells.

## Preconditions

- macOS with Xcode + Command Line Tools (`xcode-select --install`).
- CocoaPods (`sudo gem install cocoapods`).
- JDK 17 + Android Studio / Android SDK, `ANDROID_HOME` exported.
- `pnpm install` clean at the repo root (Capacitor 8 deps already in
  `package.json`, including `@capacitor/haptics`).

## One-time scaffolding (run on the Mac, commit the result)

```bash
pnpm build                 # emits dist/public — Capacitor's webDir
npx cap add ios
npx cap add android
npx cap sync               # or: pnpm mobile:sync
```

Commit the generated `ios/` and `android/` directories alongside
`capacitor.config.ts`. From this point CI can build them; the
scaffolding step is not repeated.

## Per-release loop

```bash
pnpm build && pnpm mobile:sync
pnpm mobile:ios            # cap run ios     (or open ios/App/App.xcworkspace)
pnpm mobile:android        # cap run android (or open android/ in Studio)
```

## Plugin notes

- **Haptics** — `@capacitor/haptics` is installed and consumed in
  `apps/client/src/lib/haptics.ts` behind a `globalThis.Capacitor`
  native probe (web keeps the Vibration API). No native code needed;
  `cap sync` registers the plugin. iOS additionally honors the device
  "System Haptics" toggle — nothing to configure.
- **StatusBar / SplashScreen / orientation** — see
  `capacitor.config.ts`; these are config-driven and apply on
  `cap sync`. Lock orientation in the generated native projects only
  if a future build needs to deviate from the config default.
- **IAP** — RevenueCat (`@revenuecat/purchases-capacitor`) drives
  StoreKit / Play Billing; server verification already lives in
  `apps/server/routers/iapReceipt.ts`. Store SKUs must match the
  `apps/server/storeSkuCatalog.ts` ids (the ship:check SKU-coverage
  gate enforces parity across web/iOS/Android).

## Store SKU registration (do before first store submission)

For every product with `priceUsd > 0`, create the matching SKU in App
Store Connect and Google Play Console using the platform ids in
`apps/server/storeSkuCatalog.ts` (iOS uses the
`com.dischordiansaga.<key>` form). The subscription product
`vip_monthly` must be created as an **auto-renewing subscription**
($4.99/mo) and its Stripe counterpart as a **recurring Price**, with
`STRIPE_PRICE_VIP_MONTHLY` set to that Price id (web checkout refuses
to sell a subscription without it).

## Verification gates (run in CI, no toolchain needed)

- `pnpm ship:check` — `mobile.native_haptics` proves every named
  haptic pattern has a native mapping; store-SKU coverage gate proves
  web/iOS/Android SKU parity.
- `pnpm check` — typecheck across the web/native seams.
