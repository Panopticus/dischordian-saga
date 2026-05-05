/**
 * Shared credential sanitiser for the asset/VO/upload scripts.
 *
 * Consolidates the U+2028 / nbsp / smart-quotes web-paste defense
 * that PR #402 added one-off in two scripts. The whole scripts/
 * directory should import this rather than re-implementing.
 *
 * Server boot (`apps/server/_core/env.ts`) has its own copy that
 * runs once across every credential — this module is for scripts
 * that don't go through the server entrypoint.
 */

const NON_PRINTABLE_ASCII = /[^\x20-\x7E]/g;

export function sanitizeCredential(value: string | undefined): string {
  if (!value) return "";
  return value.replace(NON_PRINTABLE_ASCII, "").trim();
}

/**
 * Pull a credential from process.env, sanitised. Throws if missing
 * (vs. the server's `optional` which warns) — scripts are usually
 * launched with explicit env loads, and a missing key here is a
 * configuration error not a feature flag.
 */
export function requireCredential(name: string): string {
  const cleaned = sanitizeCredential(process.env[name]);
  if (!cleaned) {
    throw new Error(
      `[credentialUtils] Missing required environment variable: ${name}\n` +
      `  Set it in your .env or shell before running this script.`,
    );
  }
  return cleaned;
}

/**
 * Pull an optional credential. Returns "" if missing (no throw).
 */
export function optionalCredential(name: string): string {
  return sanitizeCredential(process.env[name]);
}
