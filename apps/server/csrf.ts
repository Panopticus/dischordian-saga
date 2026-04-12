/* ═══════════════════════════════════════════════════════
   CSRF PROTECTION — Origin/Referer header validation
   Lightweight CSRF protection without tokens.
   tRPC mutations are POST requests, so we validate
   that the Origin header matches our allowed origins.
   ═══════════════════════════════════════════════════════ */
import type { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

// Methods that modify state
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Paths that skip CSRF (webhooks need raw body, external callbacks)
const SKIP_PATHS = [
  "/api/stripe/webhook",
  "/api/oauth/callback",
];

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip safe methods
  if (!UNSAFE_METHODS.has(req.method)) return next();

  // Skip exempt paths
  if (SKIP_PATHS.some(p => req.path.startsWith(p))) return next();

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // In development, allow all origins
  if (process.env.NODE_ENV === "development") return next();

  // Must have either Origin or Referer header
  if (!origin && !referer) {
    logger.warn("CSRF: Missing Origin and Referer headers", "csrf", {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    return res.status(403).json({ error: "Forbidden: missing origin" });
  }

  // Validate that the origin matches our host
  const host = req.headers.host;
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        logger.warn("CSRF: Origin mismatch", "csrf", {
          origin, host: host || "unknown", path: req.path,
        });
        return res.status(403).json({ error: "Forbidden: origin mismatch" });
      }
    } catch {
      return res.status(403).json({ error: "Forbidden: invalid origin" });
    }
  } else if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host !== host) {
        logger.warn("CSRF: Referer mismatch", "csrf", {
          referer, host: host || "unknown", path: req.path,
        });
        return res.status(403).json({ error: "Forbidden: referer mismatch" });
      }
    } catch {
      return res.status(403).json({ error: "Forbidden: invalid referer" });
    }
  }

  next();
}
