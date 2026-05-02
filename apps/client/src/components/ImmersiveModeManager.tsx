/* ═══════════════════════════════════════════════════════
   IMMERSIVE MODE MANAGER

   Drives browser-fullscreen + landscape-orientation lock for
   the widescreen art direction. Settings-gated via the
   `immersiveMode` flag in shared/settingsSchema (default on).

   Why a one-shot user-gesture listener and not a mount-time
   request? Browsers reject `Element.requestFullscreen()` and
   `screen.orientation.lock(...)` outside a user activation —
   calling them on mount throws a NotAllowedError. We arm a
   capture-phase pointerdown/keydown listener that fires once,
   then makes the fullscreen + orientation requests inside that
   handler so they sit on a fresh activation.

   Mobile orientation lock requires fullscreen first (per the
   spec), so we always await the fullscreen promise before
   attempting `orientation.lock("landscape")`. iOS Safari
   doesn't expose either API in HTML context — there the
   feature degrades to a no-op and the player can install the
   PWA for the same effect.

   ESC / F11 / browser back exit fullscreen; we don't fight
   them. Re-entering the app and clicking arms the listener
   again only if the user hadn't already opted out via
   settings. The setting flips at runtime via the storage
   event so toggling Settings → Immersive Mode in another tab
   immediately disarms.
   ═══════════════════════════════════════════════════════ */
import { useEffect } from "react";
import { loadSettings } from "@/lib/settingsSync";

const STORAGE_KEY = "loredex-settings";

function isImmersiveModeEnabled(): boolean {
  try {
    return loadSettings().immersiveMode;
  } catch {
    return true;
  }
}

function isMobileViewport(): boolean {
  // Same heuristic LandscapeEnforcer uses so the two stay in lockstep.
  return (
    window.innerWidth < 768 ||
    ("ontouchstart" in window && window.innerWidth < 1024)
  );
}

async function enterImmersiveMode(): Promise<void> {
  const root = document.documentElement;
  const req =
    root.requestFullscreen?.bind(root) ??
    (root as unknown as { webkitRequestFullscreen?: () => Promise<void> })
      .webkitRequestFullscreen?.bind(root);
  if (!req) return;
  try {
    await req();
  } catch {
    // User-agent rejected (e.g. iOS Safari, embedded webview). The page
    // continues to work in windowed mode; nothing else to do.
    return;
  }
  if (!isMobileViewport()) return;
  const orientation = (
    screen as unknown as {
      orientation?: { lock?: (o: string) => Promise<void> };
    }
  ).orientation;
  if (!orientation?.lock) return;
  try {
    await orientation.lock("landscape");
  } catch {
    // Some Android browsers reject lock requests outside an installed
    // PWA. Fullscreen still applied; the LandscapeEnforcer overlay on
    // landscape-required pages remains as the visual fallback.
  }
}

export default function ImmersiveModeManager(): null {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isImmersiveModeEnabled()) return;
    if (document.fullscreenElement) return;

    let armed = true;
    const onFirstGesture = () => {
      if (!armed) return;
      armed = false;
      window.removeEventListener("pointerdown", onFirstGesture, true);
      window.removeEventListener("keydown", onFirstGesture, true);
      // Re-check the setting at fire time so toggling it OFF before the
      // first click suppresses the request.
      if (!isImmersiveModeEnabled()) return;
      void enterImmersiveMode();
    };
    window.addEventListener("pointerdown", onFirstGesture, true);
    window.addEventListener("keydown", onFirstGesture, true);

    // Cross-tab toggle: another tab flipping the setting fires a
    // storage event. Disarm immediately so the next click in this tab
    // doesn't surprise the player by going fullscreen.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      if (!isImmersiveModeEnabled()) {
        armed = false;
        window.removeEventListener("pointerdown", onFirstGesture, true);
        window.removeEventListener("keydown", onFirstGesture, true);
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      armed = false;
      window.removeEventListener("pointerdown", onFirstGesture, true);
      window.removeEventListener("keydown", onFirstGesture, true);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}
