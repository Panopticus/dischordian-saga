/**
 * Capacitor configuration — Dischordian Saga / Loredex OS native shell.
 *
 * Wraps the Vite-built SPA at apps/client/dist as a Capacitor web
 * app, with iOS + Android targets. Runtime native features
 * (StoreKit / Google Play Billing via RevenueCat, Preferences for
 * secure storage, etc.) are added via individual plugins.
 *
 * Per the 2026-05 plan §E mobile decision: native iOS + Android
 * shipping is the actual product target (web SPA is fine for staging
 * / demos but Apple App Store and Google Play require native IAP for
 * digital goods, and Stripe-redirect is a TOS violation).
 *
 * Platform scaffolding (`npx cap add ios`, `npx cap add android`)
 * needs to be run in an environment with Xcode / Android Studio
 * installed; the resulting `ios/` and `android/` directories are
 * committed alongside this file once they exist. Until then the JS
 * config is the only source of truth.
 */
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ink.dgrslabs.dischordian",
  appName: "Dischordian Saga",
  webDir: "dist/public",
  // Vite emits to dist/public — cap sync copies that into the
  // platform shell's web-asset folder.
  bundledWebRuntime: false,
  server: {
    // Web fallback for the Capacitor live-reload dev loop. Real
    // builds are static; this only matters when developers use
    // `npx cap run ios --livereload`.
    androidScheme: "https",
    iosScheme: "capacitor",
  },
  ios: {
    contentInset: "always",
    backgroundColor: "#000000",
    // Allow rotation but lock the duel/match boards to landscape via
    // ImmersiveModeManager. Most narrative routes are portrait.
  },
  android: {
    backgroundColor: "#000000",
    allowMixedContent: false,
    captureInput: true,
  },
  plugins: {
    // RevenueCat configuration. API keys live in env-injected
    // runtime config; this block only declares the plugin surface.
    Purchases: {
      // No static config — apiKey + appUserId are passed at runtime
      // by apps/client/src/lib/payments/revenuecat.ts.
    },
    Preferences: {
      group: "DischordianSecure",
    },
  },
};

export default config;
