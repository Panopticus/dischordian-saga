/* ═══════════════════════════════════════════════════════
   SECURITY HEADERS

   Sets the standard set of defense-in-depth response headers:

   - Content-Security-Policy — restricts the sources scripts/styles/
     images/connections can come from. Single biggest XSS mitigation.
   - Strict-Transport-Security — forces HTTPS for the origin once the
     browser has seen the header, defeats SSL-strip downgrade.
   - X-Content-Type-Options: nosniff — prevents MIME-sniff XSS.
   - X-Frame-Options: DENY — prevents framing/clickjacking.
   - Referrer-Policy: strict-origin-when-cross-origin — limits referrer leakage.
   - Permissions-Policy — disables APIs we don't use (camera, geolocation, etc.).

   No new dependency — Helmet adds value but also adds churn; this
   module gives equivalent coverage in ~50 lines and is easier to
   audit. Swap to Helmet when convenient.
   ═══════════════════════════════════════════════════════ */

import type { Request, Response, NextFunction } from "express";

const CDN_HOST = "https://dgrsart.s3.us-east-2.amazonaws.com";
const VOICE_CDN_HOST = "https://dgrsvoices.s3.us-east-2.amazonaws.com";
const STRIPE_HOSTS = ["https://api.stripe.com", "https://js.stripe.com", "https://checkout.stripe.com"];
const STOCKFISH_CDN = "https://d2xsxph8kpxj0f.cloudfront.net";
const YOUTUBE_HOSTS = ["https://www.youtube.com", "https://youtube.com", "https://www.youtube-nocookie.com"];

interface BuildCspOptions {
  isProduction: boolean;
  /** Extra connect-src origins — used if you add another vendor host. */
  extraConnectSrc?: string[];
}

/**
 * Build the CSP header value. Designed conservatively for the
 * Loredex client: scripts only from self + Stripe + Stockfish CDN,
 * images from self + the two S3 CDNs, connect to self + Stripe + WS.
 *
 * `'unsafe-inline'` is unavoidable for styles right now (Tailwind v4
 * + framer-motion both inject inline styles). When a strict mode is
 * achievable, swap to a nonce-based policy.
 */
export function buildCsp({ isProduction, extraConnectSrc = [] }: BuildCspOptions): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      // Required by Stripe Checkout + Stripe Elements.
      ...STRIPE_HOSTS,
      // Stockfish WASM is loaded from CloudFront.
      STOCKFISH_CDN,
      // Vite dev injects inline scripts via HMR — only allow in dev.
      ...(isProduction ? [] : ["'unsafe-inline'", "'unsafe-eval'"]),
    ],
    "script-src-elem": [
      "'self'",
      ...STRIPE_HOSTS,
      STOCKFISH_CDN,
      ...(isProduction ? [] : ["'unsafe-inline'"]),
    ],
    "style-src": [
      "'self'",
      // Tailwind v4 + framer-motion inject inline styles.
      "'unsafe-inline'",
    ],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      CDN_HOST,
      VOICE_CDN_HOST,
    ],
    "font-src": ["'self'", "data:"],
    "media-src": [
      "'self'",
      "blob:",
      CDN_HOST,
      VOICE_CDN_HOST,
    ],
    "connect-src": [
      "'self'",
      "ws:",
      "wss:",
      ...STRIPE_HOSTS,
      CDN_HOST,
      VOICE_CDN_HOST,
      ...extraConnectSrc,
    ],
    "frame-src": [
      "'self'",
      "https://js.stripe.com",
      "https://checkout.stripe.com",
      ...YOUTUBE_HOSTS,
    ],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'", ...STRIPE_HOSTS],
    "object-src": ["'none'"],
    // Worker/SharedWorker (Stockfish) — same-origin and blob.
    "worker-src": ["'self'", "blob:"],
  };
  if (isProduction) {
    directives["upgrade-insecure-requests"] = [];
  }
  return Object.entries(directives)
    .map(([k, v]) => (v.length ? `${k} ${v.join(" ")}` : k))
    .join("; ");
}

export function securityHeaders(opts: { isProduction: boolean }) {
  const cspValue = buildCsp({ isProduction: opts.isProduction });
  return (req: Request, res: Response, next: NextFunction) => {
    // CSP — primary XSS defense.
    res.setHeader("Content-Security-Policy", cspValue);

    // HSTS — only meaningful over HTTPS, and only once. 6 months,
    // include subdomains, preload-eligible.
    if (opts.isProduction) {
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=15552000; includeSubDomains",
      );
    }

    // Prevent MIME-sniff XSS.
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Prevent clickjacking. CSP frame-ancestors above is the
    // modern equivalent; XFO is for older browsers.
    res.setHeader("X-Frame-Options", "DENY");

    // Limit referrer leakage to other origins.
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Lock down browser APIs we don't use.
    res.setHeader(
      "Permissions-Policy",
      [
        "camera=()",
        "geolocation=()",
        "microphone=()",
        "payment=(self \"https://js.stripe.com\")",
        "usb=()",
        "interest-cohort=()",
      ].join(", "),
    );

    next();
  };
}
