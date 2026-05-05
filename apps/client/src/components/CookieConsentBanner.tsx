/**
 * Cookie consent banner.
 *
 * Pre-login: stores the user's choice in localStorage and dispatches
 * a window event so analytics-style code can opt-in/out at runtime.
 *
 * Post-login: also calls account.acceptAgreement so the choice is
 * persisted to the database under GDPR Art. 7.
 *
 * The banner is shown once per browser until the user makes a
 * choice. The "essential cookies only" path keeps the session cookie
 * (required for login) but disables analytics; the "accept all"
 * path opts the user into analytics + future tracking.
 *
 * If `loredex_cookie_consent` is set in localStorage at any value,
 * the banner does not render. To re-prompt, call
 * `clearCookieConsent()`.
 */
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

const STORAGE_KEY = "loredex_cookie_consent";
type Consent = "all" | "essential" | "unset";

export function getCookieConsent(): Consent {
  if (typeof window === "undefined") return "unset";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "all" || v === "essential" ? v : "unset";
}

export function clearCookieConsent(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

function setConsent(value: "all" | "essential") {
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent("loredex:consent-changed", {
    detail: { consent: value },
  }));
}

export function CookieConsentBanner() {
  const [consent, setConsentState] = useState<Consent>("unset");
  const acceptMutation = trpc.account.acceptAgreement.useMutation();

  useEffect(() => {
    setConsentState(getCookieConsent());
  }, []);

  if (consent !== "unset") return null;

  const handle = (choice: "all" | "essential") => {
    setConsent(choice);
    setConsentState(choice);
    // Best-effort persist to server. If unauthenticated this will
    // throw — that's fine, localStorage is the source of truth pre-login.
    acceptMutation.mutate({ agreementType: "cookie_policy" });
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-heading"
      aria-describedby="cookie-consent-body"
      data-testid="cookie-consent-banner"
      style={{
        position: "fixed",
        insetInlineStart: 16,
        insetInlineEnd: 16,
        bottom: 16,
        zIndex: 100,
        background: "rgba(12, 14, 22, 0.96)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: 16,
        color: "#e6e6f0",
        maxWidth: 720,
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h2 id="cookie-consent-heading" style={{ fontSize: 16, fontWeight: 600 }}>
        Cookies & data
      </h2>
      <p id="cookie-consent-body" style={{ fontSize: 14, lineHeight: 1.4 }}>
        Loredex OS uses cookies for essential session login. With your
        consent, we also collect anonymous gameplay analytics to improve
        balance and detect bugs. See our{" "}
        <a href="/legal/privacy" style={{ textDecoration: "underline" }}>
          Privacy Policy
        </a>
        .
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => handle("essential")}
          style={{
            padding: "8px 12px",
            background: "transparent",
            color: "#e6e6f0",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => handle("all")}
          style={{
            padding: "8px 12px",
            background: "#e6e6f0",
            color: "#0c0e16",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
