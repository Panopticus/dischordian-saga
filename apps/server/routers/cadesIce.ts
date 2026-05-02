/* ═══════════════════════════════════════════════════════
   CADES ICE SERVER ROUTER — short-lived TURN credentials
   for the WebRTC peer-connection layer.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { createHmac } from "crypto";

const PUBLIC_STUN: RTCIceServerLike[] = [
  { urls: "stun:stun.l.google.com:19302" },
];

interface RTCIceServerLike {
  urls: string;
  username?: string;
  credential?: string;
}

/**
 * Mint a short-lived TURN credential pair using the standard Coturn
 * static-auth-secret REST scheme (RFC draft-uberti-behave-turn-rest).
 *
 *   username = "<expiry-unix-seconds>:<userid>"
 *   credential = base64( hmac-sha1( static-auth-secret, username ) )
 *
 * Works with Coturn, Twilio TURN, Xirsys, and any other service that
 * follows the standard.
 */
function mintTurnCredentials(opts: {
  userId: number;
  ttlSec: number;
  staticAuthSecret: string;
}): { username: string; credential: string; expiresAt: number } {
  const expiresAt = Math.floor(Date.now() / 1000) + opts.ttlSec;
  const username = `${expiresAt}:${opts.userId}`;
  const hmac = createHmac("sha1", opts.staticAuthSecret);
  hmac.update(username);
  const credential = hmac.digest("base64");
  return { username, credential, expiresAt };
}

export const cadesIceRouter = router({
  /**
   * Returns the ICE-server config the client should pass to
   * `new RTCPeerConnection({ iceServers: ... })`. Always includes
   * STUN; conditionally includes TURN with short-lived credentials
   * when `TURN_HOST` + `TURN_STATIC_AUTH_SECRET` are configured.
   */
  getIceServers: protectedProcedure
    .input(z.object({ ttlSec: z.number().int().min(60).max(86400).optional() }).optional())
    .query(({ ctx, input }) => {
      const turnHost = process.env.TURN_HOST;
      const turnPort = process.env.TURN_PORT || "3478";
      const turnSecret = process.env.TURN_STATIC_AUTH_SECRET;
      const ttl = input?.ttlSec ?? 3600;

      const servers: RTCIceServerLike[] = [...PUBLIC_STUN];

      if (turnHost && turnSecret) {
        const { username, credential } = mintTurnCredentials({
          userId: ctx.user.id,
          ttlSec: ttl,
          staticAuthSecret: turnSecret,
        });
        // Include both UDP and TCP transports so the client can
        // fall back if UDP is blocked at the firewall.
        servers.push({
          urls: `turn:${turnHost}:${turnPort}?transport=udp`,
          username,
          credential,
        });
        servers.push({
          urls: `turn:${turnHost}:${turnPort}?transport=tcp`,
          username,
          credential,
        });
      }

      return {
        iceServers: servers,
        ttlSec: ttl,
      };
    }),
});

export { mintTurnCredentials };
