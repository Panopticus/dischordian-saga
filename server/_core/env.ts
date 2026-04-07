/* ═══════════════════════════════════════════════════════
   ENVIRONMENT VARIABLE VALIDATION
   Validates all required env vars at boot. Throws immediately
   if critical variables are missing — no silent broken state.
   ═══════════════════════════════════════════════════════ */

const isProduction = process.env.NODE_ENV === "production";

/** Required in production, warned in development */
function required(key: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    if (isProduction) {
      throw new Error(`[ENV] Missing required environment variable: ${key}`);
    }
    console.warn(`[ENV] ⚠ Missing ${key} — some features will be disabled`);
    return "";
  }
  return value;
}

/** Optional — returns empty string if missing, no warning */
function optional(key: string, value: string | undefined, fallback = ""): string {
  return value?.trim() || fallback;
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

  // Payments (optional — store disabled without it)
  stripeSecretKey: optional("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY),
  stripeWebhookSecret: optional("STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET),

  // CORS (defaults to production domain)
  corsOrigin: optional("CORS_ORIGIN", process.env.CORS_ORIGIN, isProduction ? "https://dischordian-saga.com" : "*"),

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
