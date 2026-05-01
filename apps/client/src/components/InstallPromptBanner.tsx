/* ═══════════════════════════════════════════════════════
   INSTALL PROMPT BANNER (M4 in
   /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md)

   Surfaces the existing PWA standalone-mode capability to mobile
   users. The honest answer to "should we force fullscreen on mobile?"
   is: no, force fullscreen is a no-op on iOS Safari and friction on
   Android. The actual fullscreen-feel for web apps is PWA standalone
   mode, which the codebase already declares
   (apps/client/public/manifest.json `display: standalone`,
   apps/client/index.html `apple-mobile-web-app-capable: yes`). The
   missing piece is the prompt that tells users it exists.

   Two paths handled:

     Android / Chromium-based browsers: capture the
     `beforeinstallprompt` event and show a single-button banner.
     Tapping calls .prompt() on the saved event — the actual
     install dialog comes from the browser, not us. If the user
     dismisses without installing, we set a localStorage flag so
     the banner stays away for 14 days.

     iOS Safari: there's no programmatic install API. We detect the
     UA + the standalone mode (already-installed users see no
     banner) and show platform-specific instructions instead:
     "Tap Share → Add to Home Screen."

   Either way the banner is dismissible. Once dismissed it doesn't
   come back for 14 days; once the user installs (detected via
   `display-mode: standalone`) it never comes back.
   ═══════════════════════════════════════════════════════ */
import React, { useEffect, useState } from "react";

const DISMISS_KEY = "ds_install_prompt_dismissed_at";
const RETURN_AFTER_DAYS = 14;
const SHOW_AFTER_VISIT_NUMBER = 2;
const VISIT_COUNT_KEY = "ds_install_prompt_visit_count";

type BannerKind = "android" | "ios" | null;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: readonly string[];
  prompt: () => Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // Real iOS plus iPadOS-reporting-as-Mac (touch-capable Mac UAs).
  return /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Mac") && navigator.maxTouchPoints > 0);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS exposes a non-standard `navigator.standalone` flag; everywhere
  // else we read the display-mode media query.
  const iosStandalone =
    "standalone" in navigator &&
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  const dmStandalone =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(display-mode: standalone)").matches;
  return Boolean(iosStandalone || dmStandalone);
}

function dismissedRecently(): boolean {
  if (typeof localStorage === "undefined") return false;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) return false;
  const ageMs = Date.now() - dismissedAt;
  return ageMs < RETURN_AFTER_DAYS * 24 * 60 * 60 * 1000;
}

function bumpVisitCount(): number {
  if (typeof localStorage === "undefined") return 0;
  const raw = localStorage.getItem(VISIT_COUNT_KEY);
  const prev = raw ? Number(raw) : 0;
  const next = (Number.isFinite(prev) ? prev : 0) + 1;
  try {
    localStorage.setItem(VISIT_COUNT_KEY, String(next));
  } catch {
    // Storage full or denied — banner just keeps re-evaluating per
    // session, which is fine.
  }
  return next;
}

function recordDismissal(): void {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // ignore; we'll ask again next session
  }
}

export default function InstallPromptBanner(): React.ReactElement | null {
  const [kind, setKind] = useState<BannerKind>(null);
  const [androidEvent, setAndroidEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Already installed — never show.
    if (isStandalone()) return;
    // Dismissed in the last 14 days — keep away.
    if (dismissedRecently()) return;
    // Don't show on the very first visit; let the user see the app
    // before nagging them to install. Bump the visit counter every
    // mount so the banner appears on visit 2+ for new users and
    // immediately for returning users post-cooldown.
    const visit = bumpVisitCount();
    if (visit < SHOW_AFTER_VISIT_NUMBER) return;

    const onBeforeInstall = (e: Event): void => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      setAndroidEvent(evt);
      setKind("android");
    };
    window.addEventListener(
      "beforeinstallprompt",
      onBeforeInstall as EventListener,
    );

    // For iOS Safari there's no event — fall back to UA detection.
    // Defer the kind set so the Android event has first refusal in
    // case both fire (iOS Chrome / Edge can theoretically deliver
    // beforeinstallprompt). Use a microtask to settle.
    Promise.resolve().then(() => {
      if (isIos()) {
        setKind((prev) => prev ?? "ios");
      }
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstall as EventListener,
      );
    };
  }, []);

  if (kind === null) return null;

  const onDismiss = (): void => {
    recordDismissal();
    setKind(null);
  };

  if (kind === "android" && androidEvent) {
    return (
      <BannerShell onDismiss={onDismiss}>
        <p className="text-sm">
          Install <span className="font-semibold">Loredex OS</span> for an
          immersive, fullscreen experience.
        </p>
        <button
          type="button"
          className="mt-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          onClick={() => {
            void androidEvent.prompt();
            void androidEvent.userChoice.finally(() => {
              setKind(null);
              recordDismissal();
            });
          }}
        >
          Install
        </button>
      </BannerShell>
    );
  }

  // iOS Safari path. No programmatic install — show share-sheet
  // instructions and dismiss.
  return (
    <BannerShell onDismiss={onDismiss}>
      <p className="text-sm">
        Install <span className="font-semibold">Loredex OS</span> for an
        immersive, fullscreen experience: tap the{" "}
        <span aria-label="Share" role="img">
          ⎙
        </span>{" "}
        Share icon, then{" "}
        <span className="font-medium">Add to Home Screen</span>.
      </p>
    </BannerShell>
  );
}

function BannerShell({
  children,
  onDismiss,
}: {
  children: React.ReactNode;
  onDismiss: () => void;
}): React.ReactElement {
  return (
    <div
      role="dialog"
      aria-label="Install Loredex OS"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 pointer-events-none"
    >
      <div className="mx-auto max-w-md rounded-lg border border-border/50 bg-card/95 backdrop-blur-sm px-4 py-3 shadow-lg pointer-events-auto">
        <div className="flex items-start gap-3">
          <div className="flex-1">{children}</div>
          <button
            type="button"
            aria-label="Dismiss"
            className="text-muted-foreground hover:text-foreground"
            onClick={onDismiss}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
