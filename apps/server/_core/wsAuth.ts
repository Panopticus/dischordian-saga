/* ═══════════════════════════════════════════════════════
   WEBSOCKET AUTHENTICATION

   WebSocket upgrades carry the same Cookie header as the rest of
   the page's HTTP requests, so we can re-use the session-cookie
   verification path. Without this, every WS surface trusts a
   client-supplied userId — the impersonation hole flagged in the
   audit.

   Returns the authenticated user, or null if the connection is
   anonymous / has an invalid or expired session. Callers should
   close the socket on null for any flow that needs identity
   (matchmaking, ranked play, rewards). Anonymous WS connections
   are still allowed for spectate-only modes.
   ═══════════════════════════════════════════════════════ */

import type { IncomingMessage } from "http";
import { COOKIE_NAME } from "@shared/const";
import type { User } from "../../db/schema";
import { sdk } from "./sdk";
import * as db from "../db";
import { parse as parseCookieHeader } from "cookie";

/**
 * Authenticate a WebSocket upgrade request. The HTTP cookie set on
 * login is sent with the upgrade request, so we can verify it the
 * same way HTTP procedures do.
 */
export async function authenticateWebSocket(req: IncomingMessage): Promise<User | null> {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return null;
    const cookies = parseCookieHeader(cookieHeader);
    const sessionCookie = cookies[COOKIE_NAME];
    if (!sessionCookie) return null;
    const session = await sdk.verifySession(sessionCookie);
    if (!session) return null;
    const user = await db.getUserByOpenId(session.openId);
    return user ?? null;
  } catch {
    // Anything thrown here means "not authenticated". Don't leak
    // the reason to the client — the WS surface should fail closed.
    return null;
  }
}

/**
 * Convenience: authenticate, and if missing, close the socket with a
 * standard close code. Returns the User on success, null on failure
 * (caller should `return` immediately when null).
 */
export async function requireWsAuth(
  req: IncomingMessage,
  ws: { close: (code?: number, reason?: string) => void },
  closeReason = "unauthorized",
): Promise<User | null> {
  const user = await authenticateWebSocket(req);
  if (!user) {
    // 4401 — application-defined "unauthorized". Browsers won't
    // auto-reconnect on 4xxx codes by default.
    ws.close(4401, closeReason);
    return null;
  }
  return user;
}
