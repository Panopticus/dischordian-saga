/* ═══════════════════════════════════════════════════════
   SECURITY HEADERS MIDDLEWARE
   Content Security Policy + standard hardening headers.
   ═══════════════════════════════════════════════════════ */
import type { RequestHandler } from "express";

export const securityHeaders: RequestHandler = (_req, res, next) => {
  // Content-Security-Policy — restrict resource loading
  // Allow self, inline styles (Tailwind/Framer), data URIs (icons),
  // Google OAuth, CloudFront CDN for images, Umami analytics
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cloud.umami.is",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.cloudfront.net https://lh3.googleusercontent.com",
      "connect-src 'self' wss: ws: https://api.elevenlabs.io https://cloud.umami.is",
      "media-src 'self' blob: https://*.cloudfront.net",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ")
  );

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Control Referer header leakage
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Opt out of Google FLoC/Topics
  res.setHeader("Permissions-Policy", "interest-cohort=(), camera=(), microphone=(), geolocation=()");

  // Prevent XSS in older browsers (modern browsers have built-in protection)
  res.setHeader("X-XSS-Protection", "0");

  next();
};
