import type { Request } from "express";
import { logger } from "../logger";

export type AuthAuditEvent =
  | "login_success"
  | "login_failure"
  | "csrf_state_mismatch"
  | "csrf_state_missing"
  | "csrf_state_legacy"
  | "token_refresh_success"
  | "token_refresh_failure"
  | "token_refresh_missing";

interface AuthAuditFields {
  provider?: string;
  openId?: string;
  reason?: string;
  hasCookie?: boolean;
  hasQuery?: boolean;
}

function clientIp(req: Request): string | undefined {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0]?.trim();
  }
  return req.ip;
}

function userAgent(req: Request): string | undefined {
  const ua = req.headers["user-agent"];
  return typeof ua === "string" ? ua.slice(0, 256) : undefined;
}

export function logAuthEvent(
  req: Request,
  event: AuthAuditEvent,
  fields: AuthAuditFields = {},
): void {
  const level = event.endsWith("_failure") || event.startsWith("csrf_") ? "warn" : "info";
  const data: Record<string, unknown> = {
    event,
    ip: clientIp(req),
    ua: userAgent(req),
    ...fields,
  };
  if (level === "warn") {
    logger.warn(`[AuthAudit] ${event}`, data);
  } else {
    logger.info(`[AuthAudit] ${event}`, data);
  }
}
