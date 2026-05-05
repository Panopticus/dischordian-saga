/**
 * Playwright global setup. When the auth env vars are present, mint a
 * session JWT for a fixed test user and write a Playwright storage-state
 * file so the auth-gated specs can run without going through real OAuth.
 *
 * Required env vars to enable:
 *   JWT_SECRET            Same secret the server uses to sign sessions.
 *   E2E_AUTH_OPEN_ID      The openId of a test user that already exists
 *                         in the database (matches `users.openId`).
 *
 * Optional env vars:
 *   E2E_AUTH_NAME         Display name embedded in the JWT (default "e2e").
 *   E2E_BASE_URL          Base URL for the cookie scope (default the
 *                         Playwright config's baseURL).
 *
 * If the vars are not set this is a no-op — the spec files keep their
 * conditional skip and the rest of the suite still runs.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SignJWT } from "jose";
import { COOKIE_NAME } from "../shared/const";

// ESM has no __dirname; derive it from import.meta.url so this file
// works under the project's `"type": "module"` setting. The previous
// CommonJS-style __dirname blew up Playwright's config loader at
// import time, which is why the e2e job in CI fails before any
// test even attempts to run.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STATE_PATH = join(__dirname, ".auth", "storageState.json");
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export const STORAGE_STATE_PATH = STATE_PATH;

export default async function globalSetup() {
  const openId = process.env.E2E_AUTH_OPEN_ID;
  const secret = process.env.JWT_SECRET;
  if (!openId || !secret) {
    // Auth-gated specs will continue to skip themselves.
    return;
  }
  const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3000";
  const url = new URL(baseUrl);
  const name = process.env.E2E_AUTH_NAME ?? "e2e";

  const expiresAt = Math.floor((Date.now() + ONE_YEAR_MS) / 1000);
  const token = await new SignJWT({
    openId,
    appId: process.env.GOOGLE_CLIENT_ID ?? "dischordian-saga",
    name,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expiresAt)
    .sign(new TextEncoder().encode(secret));

  const state = {
    cookies: [
      {
        name: COOKIE_NAME,
        value: token,
        domain: url.hostname,
        path: "/",
        expires: expiresAt,
        httpOnly: true,
        secure: url.protocol === "https:",
        sameSite: "Lax" as const,
      },
    ],
    origins: [],
  };

  mkdirSync(dirname(STATE_PATH), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}
