/* ═══════════════════════════════════════════════════════
   ENVIRONMENT VARIABLE VALIDATION
   Validates all required env vars at boot. Throws immediately
   if critical variables are missing — no silent broken state.
   ═══════════════════════════════════════════════════════ */

const isProduction = process.env.NODE_ENV === "production";

/**
 * Strip non-printable / non-ASCII characters that get smuggled in when an
 * operator pastes a key from a web page or chat client. Common offenders:
 *   U+2028 (line separator), U+2029 (paragraph separator), U+00A0 (nbsp),
 *   U+200B–U+200D (zero-width), U+FEFF (BOM), smart quotes.
 * These are invisible but blow up HTTP header encoding (ByteString error),
 * cause silent auth failures, and pollute logs with the raw key.
 *
 * Apply once at boot to every credential. PR #402 fixed this for
 * ELEVENLABS_API_KEY in two VO scripts; this generalises the fix.
 */
export function sanitizeCredential(value: string | undefined): string {
  if (!value) return "";
  // Strip everything outside printable ASCII. Catches all invisible-paste
  // offenders without enumerating each codepoint.
  return value.replace(/[^\x20-\x7E]/g, "").trim();
}

/** Required in production, warned in development */
function required(key: string, value: string | undefined): string {
  const cleaned = sanitizeCredential(value);
  if (!cleaned) {
    if (isProduction) {
      throw new Error(`[ENV] Missing required environment variable: ${key}`);
    }
    console.warn(`[ENV] Missing ${key} — some features will be disabled`);
    return "";
  }
  return cleaned;
}

/** Optional — returns empty string if missing, no warning */
function optional(key: string, value: string | undefined, fallback = ""): string {
  return sanitizeCredential(value) || fallback;
}

export const ENV = {
  // Auth (required for login)
  googleClientId: required("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID),
  googleClientSecret: required("GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET),
  cookieSecret: required("JWT_SECRET", process.env.JWT_SECRET),

  // Database (required for persistence)
  databaseUrl: required("DATABASE_URL", process.env.DATABASE_URL),

  // Discord OAuth (optional — enables Discord login)
  discordClientId: optional("DISCORD_CLIENT_ID", process.env.DISCORD_CLIENT_ID),
  discordClientSecret: optional("DISCORD_CLIENT_SECRET", process.env.DISCORD_CLIENT_SECRET),

  // GitHub OAuth (optional — enables GitHub login)
  githubClientId: optional("GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID),
  githubClientSecret: optional("GITHUB_CLIENT_SECRET", process.env.GITHUB_CLIENT_SECRET),

  // Admin
  ownerOpenId: optional("OWNER_OPEN_ID", process.env.OWNER_OPEN_ID),

  // LLM (required for Elara/Human chat)
  forgeApiUrl: optional("LLM_API_URL", process.env.LLM_API_URL),
  forgeApiKey: optional("LLM_API_KEY", process.env.LLM_API_KEY),

  // ElevenLabs (VO generation pipeline)
  elevenLabsApiKey: optional("ELEVENLABS_API_KEY", process.env.ELEVENLABS_API_KEY),

  // AWS (S3 asset uploads, VO upload)
  awsAccessKeyId: optional("AWS_ACCESS_KEY_ID", process.env.AWS_ACCESS_KEY_ID),
  awsSecretAccessKey: optional("AWS_SECRET_ACCESS_KEY", process.env.AWS_SECRET_ACCESS_KEY),

  // Payments (optional — store disabled without it)
  stripeSecretKey: optional("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY),
  stripeWebhookSecret: optional("STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET),

  // Email (transactional). Resend or SendGrid; service decides at use site.
  resendApiKey: optional("RESEND_API_KEY", process.env.RESEND_API_KEY),
  sendgridApiKey: optional("SENDGRID_API_KEY", process.env.SENDGRID_API_KEY),

  // CORS (defaults to production domain).
  //
  // Task 6.1 — `corsOrigin` is a raw string for back-compat.
  // `corsAllowlist` is the parsed, comma-separated allowlist that
  // the CORS middleware actually checks against. Multiple origins
  // can be configured via a comma in CORS_ORIGIN:
  //   CORS_ORIGIN=https://dischordian-saga.com,https://www.dischordian-saga.com
  corsOrigin: optional("CORS_ORIGIN", process.env.CORS_ORIGIN, isProduction ? "https://dischordian-saga.com" : "*"),
  corsAllowlist: (optional("CORS_ORIGIN", process.env.CORS_ORIGIN, isProduction ? "https://dischordian-saga.com" : "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)),

  // Server
  port: parseInt(process.env.PORT || "3000", 10),
  isProduction,
};

// Boot-time summary
const missing = [
  !ENV.googleClientId && "GOOGLE_CLIENT_ID",
  !ENV.googleClientSecret && "GOOGLE_CLIENT_SECRET",
  !ENV.cookieSecret && "JWT_SECRET",
  !ENV.databaseUrl && "DATABASE_URL",
].filter(Boolean);

if (missing.length > 0 && !isProduction) {
  console.warn(`[ENV] Development mode — ${missing.length} vars missing: ${missing.join(", ")}`);
}
