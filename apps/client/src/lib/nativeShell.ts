/* ═══════════════════════════════════════════════════════
   NATIVE SHELL INIT — StatusBar / SplashScreen / Android back
   No-op on web. The lazy globalThis.Capacitor probe mirrors
   lib/payments and lib/haptics so web bundles stay free of the
   native runtime (plugins are dynamically imported only on native).
   Called once from main.tsx after the app mounts.
   ═══════════════════════════════════════════════════════ */

function isNative(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).Capacitor?.isNativePlatform?.() === true;
}

export function initNativeShell(): void {
  if (!isNative()) return;

  // The app is a black immersive surface, so force light status-bar
  // text (Capacitor Style.Dark = dark background / light content),
  // a black bar on Android, and keep content out from under the bar
  // (iOS contentInset:"always" in capacitor.config.ts handles inset).
  import("@capacitor/status-bar")
    .then(async ({ StatusBar, Style }) => {
      await StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      await StatusBar.setBackgroundColor({ color: "#000000" }).catch(
        () => {},
      );
      await StatusBar.setOverlaysWebView({ overlay: false }).catch(
        () => {},
      );
    })
    .catch(() => {});

  // capacitor.config.ts sets launchAutoHide:false so the splash stays
  // up until React has actually mounted (no white flash / "frozen"
  // first paint). It is mounted by the time this runs — hide it.
  import("@capacitor/splash-screen")
    .then(({ SplashScreen }) => SplashScreen.hide())
    .catch(() => {});

  // Android hardware back: walk history when possible, otherwise
  // background the app. Never hard-exit mid-session (data loss / bad
  // store review); minimizeApp is the Android-correct behaviour and
  // the event never fires on iOS.
  import("@capacitor/app")
    .then(({ App }) => {
      App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) window.history.back();
        else void App.minimizeApp().catch(() => {});
      });
    })
    .catch(() => {});
}
